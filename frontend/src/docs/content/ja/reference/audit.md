# 監査ログ

Heym は、セキュリティに関連するすべてのアクションについて監査行を記録します。誰が、何に対して実行し、成功したかどうかが記録されます。行は `winston.audit` ロガーを通じてバックエンドの標準出力に送られ、リクエストアクセスログと並んで出力され、**Logs** タブまたは `docker logs` で確認できます。

監査ログは**常に有効**です。有効化するものも、設定すべき環境変数もありません。

## 行のフォーマット

1 つのアクションは、必ず 1 つの自己完結した行を生成します：

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

すべての行には以下のフィールドが含まれます：

| フィールド | 説明 |
|-------|-------------|
| `action` | 何が起きたかを `resource.verb` 形式で表します — 以下の表を参照してください。 |
| `outcome` | `success`、`failure`、または `denied`。 |
| `actor_id` | アクションを実行したユーザーの UUID。誰も認証されていなかった場合にのみ省略されます。 |
| `actor_email` | そのユーザーのメールアドレス。ログイン失敗時には、確認済みのアカウントではなく、試行されたアドレスが記録されます。 |
| `target` | 操作対象のオブジェクトを `type:uuid` 形式で表します。 |
| `target_name` | そのオブジェクトの人間が読める名前。スペースを含む場合は引用符で囲まれます。 |

続いてアクション固有のフィールドが並びます — 例えば `credential_type`、`imported`、`grantee_email`、`team_name` などです。スペース、引用符、または `=` を含む値は引用符で囲まれ、256 文字を超える値は `...(truncated)` マーカーで切り詰められます。

## ログの読み方

監査ロガーはリクエストロガーの子であるため、両者は同じストリームに到達しつつ、分離可能な状態を保ちます：

```bash
# 監査行のみ、アクセスログのノイズなし
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# あるユーザーが実行したすべて
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# ログイン失敗とアクセス拒否
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# ある credential に触れたすべて
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

アプリ内では、**Logs** タブが同じコンテナ出力を読み取ります。これは `DOCKER_LOGS_ENABLED` と `DOCKER_LOGS_ALLOWED_EMAILS` 許可リストによって制御されます。

## 何が記録されるか

すべての状態変更が記録されます。読み取りは、読み取り自体が機微な行為である場合にのみ記録されます — Workflow の実行履歴の閲覧、credential を開くこと、ファイルのダウンロードなどです。通常の一覧および詳細の読み取りは監査されません。アクセスログがすでにリクエストが発生したことを記録しており、すべての `GET` を監査すると重要な行が埋もれてしまうためです。

### 認証

| アクション | 備考 |
|--------|-------|
| `auth.register` | 登録が無効化されている場合、またはパスワードサインインがオフの場合（`reason=password_login_disabled`）は `outcome=denied`、メールアドレスが使用済みの場合は `failure`。 |
| `auth.login` | `outcome=failure` は、試行されたアドレスと、メールアドレスが不明であったかパスワードが誤っていたかを記録します。 |
| `auth.logout` | actor は refresh cookie から解決されるため、cookie なしのログアウトは識別情報なしで記録されます。 |
| `auth.token_refresh` | `outcome=denied` と `reason=refresh_token_replayed_or_revoked` — アラートを出す価値のある token 盗難のシグナルです。 |
| `auth.password_change` | 現在のパスワードが誤っていた場合は `outcome=failure`。 |
| `auth.sso_login` | シングルサインオン。`outcome=failure` はプロバイダーの応答が拒否された理由を伴います。`denied` は `email_not_verified`、`domain_not_allowed`、または `provisioning_disabled` を伴います。 |
| `sso_settings.update` | 管理者が [SSO](./sso.md) 設定を変更しました。`enabled` と `password_login_disabled` を記録し、client secret は決して記録しません。 |
| `sso_settings.test` | 管理者が SSO 接続テストを実行しました。 |

### Workflow

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.history_view` は、コラボレーターが他人の実行履歴を読む場合に `owned=false` を記録します。`workflow.delete` は、コラボレーターが削除を試みた場合に `outcome=denied` と `reason=not_owner` を記録します。

### Credential

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` は、credential を開くと復号されるため監査されます。見つからない場合は `outcome=denied` が記録され、これは credential-id の列挙試行がどのように見えるかを示しています。
### その他のリソース

| リソース | アクション |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vector stores | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alerts | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Data tables | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

一括操作は、行ごとではなくリクエストごとに件数付きで 1 回だけログに記録されます。5,000 行の CSV インポートでは、`imported`、`rejected`、`total` を含む `data_table.import_csv` の行が 1 行だけ生成されます。

## シークレットは決してログに記録されません

監査行には、識別子、名前、件数が記録されます。credential の内容、変数の値、パスワード、Token が記録されることは決してありません。

これを徹底する仕組みは 2 つあります。呼び出し箇所は安全なフィールドのみを渡すように記述されており、監査ヘルパーは最後の防壁として秘匿化を行います。名前が `password`、`secret`、`token`、`api_key`、`value`、`authorization`、`cookie` などを含むフィールドは、行が構築される前に `***` に置き換えられます。過剰な秘匿化は意図的なものです。役に立たない行のほうが、credential が漏洩するよりはましです。

シークレットが記録に真に関連する場合でも、その形状のみがログに記録されます。ファイル共有では `password_protected=true` が記録され、パスワードそのものは決して記録されません。

## 保持期間

**監査行は、コンテナのログ出力が存在する間だけ保持されます。** データベースには書き込まれません。バックエンドコンテナを再作成すると、そのログは破棄されます。

再デプロイ後も存続する監査履歴が必要な場合は、他のコンテナログと同様に、コンテナの stdout を永続的な場所へ転送してください。log driver、sidecar collector、あるいはお使いのプラットフォームのログ集約などが該当します。

## コントリビューター向け

監査行を出力するには、1 回の呼び出しで済みます。

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

このヘルパーは同期処理であり、データベースに一切アクセスせず、自身のエラーを握りつぶすため、監査呼び出しがリクエストを失敗させたり遅延させたりすることはありません。

追加する際の 3 つのルール：

1. **アクションは `resource.verb` の形式で snake_case で命名してください。** `backend/tests/test_audit_log.py` は `app/api/` 配下のすべての `audit()` 呼び出しを走査し、名前が一致しない場合、および対象リソースの呼び出し箇所がすべて失われた場合にビルドを失敗させます。

2. **確実に存在する属性のみを読み取ってください。** ヘルパーの `try/except` は自身の本体を保護するものであり、渡された式を保護するものではありません。`target_name=workflow.name` における `AttributeError` は、`audit()` が実行される前の呼び出し箇所で発生し、リクエストを壊します。ORM のカラムとローカル変数を読み取り、オプション属性や遅延ロードされる属性は読まないでください。

3. **削除の前に削除をログに記録してください。** `db.delete(row)` の後では、記録したい名前と id が失われている可能性があります。呼び出しはその上に配置してください。
