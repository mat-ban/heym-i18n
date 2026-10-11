# 実行 Token

Execution Token は、単一の Workflow の execute および stream エンドポイントへのアクセスを許可するスコープ付き JWT です。これにより、長期間有効なユーザーセッション Token を公開することなく、外部システムから Workflow を呼び出すことができます。

## Execution Token を使用する理由

Workflow の認証が **JWT** に設定されている場合、エンドポイントは通常、有効なユーザーセッションを必要とします。Execution Token を使用すると、以下のことが可能になります：

- アカウントの認証情報を共有することなく、外部スクリプト、CI パイプライン、または連携先に呼び出し可能な Token を共有できます。
- 露出範囲を限定できます — Token は特定の 1 つの Workflow に対してのみ有効です。
- パスワードの変更やセッション Token のローテーションを行うことなく、アクセスを即座に失効させることができます。
- 短期 Token（分単位または時間単位）と長期 Token（最長 10 年）を選択できます。

## Token の作成

エディターの **Run with cURL** ダイアログ（右上のツールバー）を開きます。Workflow の認証が **JWT Token** に設定されている場合、ダイアログに Token マネージャーが表示されます：

1. **Short-lived** または **Long-lived (10yr)** を選択します。
2. 短期 Token の場合は、有効期間を秒単位で入力します（最小 60）。
3. **+ New Token** をクリックします。

Token は即座に作成され、リストに追加され、自動的に選択されるため、cURL コマンドに反映されます。

## Token リスト

各 Token の行には以下が表示されます：

| 列 | 説明 |
|--------|-------------|
| Created | 作成タイムスタンプ |
| Status | **Expires:** 日付、**Expired**、または **Revoked** |
| Eye icon | Token 値の表示・非表示を切り替え |
| Revoke button | Token を失効としてマーク（取り消し不可） |

有効な（期限切れでも失効済みでもない）行をクリックすると選択されます。選択された Token は cURL コマンドのプレビューに埋め込まれます。

期限切れおよび失効済みの Token はリストに表示されたままですが、選択することはできません。

## Token の使用

リストから Token 値をコピーし（目のアイコンをクリックして表示）、`Bearer` Token として含めます：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

ダイアログで Token を選択した状態で **Copy cURL** を使用すると、Token はすでにコマンドに埋め込まれているため、手動で置き換える必要はありません。

## Token のスコープ

各 Token には以下の JWT クレームが含まれます：

| クレーム | 値 |
|-------|-------|
| `sub` | Token 作成者のユーザー ID |
| `wid` | Workflow UUID — 他の Workflow では Token は拒否されます |
| `scope` | `workflow:execute` — ユーザーセッション Token と区別します |
| `jti` | 失効の検索に使用される一意の Token ID |
| `exp` | 有効期限のタイムスタンプ |

バックエンドはすべてのリクエストでこれらすべてを検証します：署名の有効性、有効期限、`wid` の一致、および `jti` が失効していないこと。

## 失効

Token の横にある失効（circle-slash）ボタンをクリックすると、その Token を失効させることができます。失効は即座に反映されます — その Token を使用した後続のリクエストは `401` を返します。Token の行は **Revoked** ラベルとともにリストに表示されたままになります。

失効の取り消しはできません。アクセスを復元する必要がある場合は、新しい Token を作成してください。

## API

Token 管理エンドポイントは、通常のセッションで認証されます。

| メソッド | パス | 説明 |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Token を作成 |
| `GET` | `/api/workflows/{id}/execution-tokens` | この Workflow の自分の Token を一覧表示 |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Token を失効 |

**作成リクエストボディ：**

```json
{ "ttl_seconds": 900 }
```

**作成レスポンス：**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

`token` フィールドは作成時に一度だけ返されます。すぐに保存してください。後続の `GET` リクエストでは同じ行が返されますが、cURL ダイアログでいつでも表示することもできます。

## 可視性スコープ

各ユーザーは自分が作成した Token のみを表示できます。共有 Workflow にアクセスできるチームメンバーは、互いの Token を表示することはできません。

## 関連項目

- [Webhooks](./webhooks.md) — HTTP Trigger エンドポイントと cURL ダイアログ
- [Security](./security.md) — セッション管理と認証の概要
- [SSE Streaming](./sse-streaming.md) — ストリーミングエンドポイントで Execution Token を使用する
