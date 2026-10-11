# 團隊

Teams 可讓您一次將 Workflow、Credentials、全域變數、Vector Store 與 Drive 檔案分享給一群使用者。

## 概觀

- **Team** – 具名的群組，包含一位建立者與多位成員
- **Creator** – 必定為成員；可編輯 Team、刪除 Team、新增成員
- **Member** – 可新增與移除其他成員（建立者除外）；可存取與該 Team 分享的資源

## 建立與管理 Teams

從 [Teams 分頁](../tabs/teams-tab.md)建立 Teams。透過電子郵件新增成員；成員必須擁有帳號。建立者無法被移除。刪除 Team 會移除所有 Team 分享。

## 分享模型

資源可分享給：

1. **個別使用者** – 透過電子郵件（使用者對使用者分享）
2. **Teams** – 透過選擇 Team（Team 分享）

兩種模型為累加關係。使用者符合下列任一條件即可取得存取權：

- 被直接分享（使用者分享），或
- 為擁有 Team 分享之 Team 的成員

## 可與 Teams 分享的項目

| 資源 | 分享位置 |
|----------|----------------|
| Workflows | Workflow 編輯器中的分享對話框 |
| Workflow Templates | 建立／編輯 Workflow 範本時的分享對話框 |
| Node Templates | 建立／編輯節點範本時的分享對話框 |
| Credentials | Credentials 分頁中的分享對話框 |
| 全域變數 | Variables 分頁中的分享對話框 |
| Vector Stores | Vectors 分頁中的分享對話框 |
| Drive 檔案 | Drive 分頁中的分享對話框，或 Drive 節點的 `shareWithMyTeams` / `unshareWithMyTeams` 操作 |

對於範本，當可見性為 **Specific users** 時，您也可以選擇 Teams。所選 Teams 的所有成員皆可取得該範本的存取權。
Drive 檔案的 Team 分享對 Team 成員而言為唯讀；檔案擁有者保留管理權限。

## API Endpoints

- `GET /api/teams` – 列出使用者所屬的 Teams
- `GET /api/teams/{id}` – 取得包含成員的 Team 詳細資料
- `GET /api/teams/{id}/shared-entities` – 回傳與該 Team 分享的實體（Workflow、Credentials、全域變數、Vector Store、檔案、Workflow 範本、節點範本）
- `POST /api/teams` – 建立 Team
- `PATCH /api/teams/{id}` – 更新 Team
- `DELETE /api/teams/{id}` – 刪除 Team（僅限建立者）
- `POST /api/teams/{id}/members` – 新增成員（body：`{ "email": "..." }`）
- `DELETE /api/teams/{id}/members/{user_id}` – 移除成員

各資源的 Team 分享：

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST body 接受 `permission`（`read` 或 `write`，預設為 `write`）；對已存在的 Team 再次 POST 會更新其權限
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## 相關內容

- [Teams 分頁](../tabs/teams-tab.md) – 建立與管理 Teams
- [Templates 分頁](../tabs/templates-tab.md) – 與 Teams 分享 Workflow 與節點範本
- [Credentials 分享](./credentials-sharing.md) – 與使用者及 Teams 分享 Credentials
- [Workflow 組織](./workflow-organization.md) – 資料夾與 Workflow 分享
