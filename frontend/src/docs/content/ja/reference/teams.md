# チーム

Teams を使用すると、Workflow、Credential、グローバル変数、Vector Store、Drive ファイルを一度に複数のユーザーのグループと共有できます。

## 概要

- **Team** – 作成者とメンバーを持つ名前付きのグループ
- **作成者** – 常にメンバーであり、Team の編集、Team の削除、メンバーの追加が可能
- **メンバー** – 他のメンバー（作成者を除く）の追加と削除が可能。Team に共有されたリソースにアクセスできます

## Team の作成と管理

[Teams タブ](../tabs/teams-tab.md)から Team を作成します。メンバーはメールアドレスで追加し、アカウントを持っている必要があります。作成者は削除できません。Team を削除すると、すべての Team 共有が削除されます。

## 共有モデル

リソースは以下の方法で共有できます：

1. **個別ユーザー** – メールアドレスによる指定（ユーザー間共有）
2. **Team** – Team を選択して共有（Team 共有）

どちらのモデルも加算的に適用されます。ユーザーは以下のいずれかに該当する場合にアクセス権を取得します：

- 直接共有されている（ユーザー共有）、または
- Team 共有を持つ Team のメンバーである

## Team と共有できるもの

| リソース | 共有場所 |
|----------|----------------|
| Workflow | Workflow エディターの共有ダイアログ |
| Workflow テンプレート | Workflow テンプレートの作成・編集時の共有ダイアログ |
| ノードテンプレート | ノードテンプレートの作成・編集時の共有ダイアログ |
| Credential | Credentials タブの共有ダイアログ |
| グローバル変数 | Variables タブの共有ダイアログ |
| Vector Store | Vectors タブの共有ダイアログ |
| Drive ファイル | Drive タブの共有ダイアログ、または Drive ノードの `shareWithMyTeams` / `unshareWithMyTeams` オペレーション |

テンプレートの場合、可視性が **Specific users** のときに Team も選択できます。選択した Team のすべてのメンバーがテンプレートにアクセスできるようになります。
Drive ファイルの Team 共有は Team メンバーにとって読み取り専用です。ファイルの所有者は管理権限を保持します。

## API Endpoint

- `GET /api/teams` – ユーザーが所属する Team の一覧を取得
- `GET /api/teams/{id}` – メンバーを含む Team の詳細を取得
- `GET /api/teams/{id}/shared-entities` – Team に共有されているエンティティ（Workflow、Credential、グローバル変数、Vector Store、ファイル、Workflow テンプレート、ノードテンプレート）を返します
- `POST /api/teams` – Team を作成
- `PATCH /api/teams/{id}` – Team を更新
- `DELETE /api/teams/{id}` – Team を削除（作成者のみ）
- `POST /api/teams/{id}/members` – メンバーを追加（body: `{ "email": "..." }`）
- `DELETE /api/teams/{id}/members/{user_id}` – メンバーを削除

リソースごとの Team 共有：

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST の body は `permission`（`read` または `write`、デフォルトは `write`）を受け付けます。既存の Team を再度 POST すると、その権限が更新されます
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## 関連項目

- [Teams タブ](../tabs/teams-tab.md) – Team の作成と管理
- [Templates タブ](../tabs/templates-tab.md) – Workflow テンプレートとノードテンプレートを Team と共有
- [Credential の共有](./credentials-sharing.md) – Credential をユーザーおよび Team と共有
- [Workflow の整理](./workflow-organization.md) – フォルダーと Workflow の共有
