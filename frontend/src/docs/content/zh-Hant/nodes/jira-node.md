# Jira

**Jira** 節點將 Workflow 連接至 Jira REST API，以實現專案、Issue、留言、附件、使用者、通知及轉換的自動化。預設操作為 **Search Issues**。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| Credential | Jira（Cloud 電子郵件/API Token 或 Data Center 使用者名稱/密碼、Base URL、部署模式、選用的 REST API 版本） |
| 輸出 | `$nodeLabel.*` |

## Credential

在 [Credentials Tab](../tabs/credentials-tab.md) 中建立 **Jira** Credential。儲存的設定鍵為 `email`、`api_token`、`base_url`、`deployment`，以及選用的 `api_version`。對於 Jira Cloud，`email` 儲存 Atlassian 帳號電子郵件，`api_token` 儲存 Atlassian API Token。對於 Jira Data Center / Server，這些相同的鍵則儲存 Basic 驗證的使用者名稱與密碼。設定步驟請參閱 [Third-Party Integrations](../reference/integrations.md#jira)。

| 欄位 | 設定鍵 | 說明 |
| --- | --- | --- |
| Jira Email / Username | `email` | Jira Cloud Atlassian 帳號電子郵件，或 Jira Data Center / Server 使用者名稱 |
| API Token / Password | `api_token` | Jira Cloud Atlassian API Token，或 Jira Data Center / Server 用於 Basic 驗證的密碼 |
| Base URL | `base_url` | Jira 站台 URL，例如 `https://your-domain.atlassian.net` |
| Deployment | `deployment` | Jira Cloud 請填 `cloud`，Jira Data Center / Server 請填 `data_center` |
| REST API Version | `api_version` | Jira Cloud 預設為 `3`。Data Center / Server 使用 REST API v2 |

Jira Credential 目前尚不支援 Data Center / Server 的個人存取 Token 與 Bearer 驗證。

使用 **Test Connection** 以針對目前的 Jira 使用者驗證 Credential。

## 操作

| 操作 | 必填欄位 | 輸出 |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | 選用的 Limit、Start At | `projects`、`count`、`pagination` |
| Search Issues | 選用的 JQL、Issue Fields、Limit、Next Page Token、Start At | `issues`、`count`、`pagination` |
| Get Issue | Issue Key 或 ID | `issue`、`key` |
| Create Issue | Project Key、Summary | `issue`、`key` |
| Update Issue | Issue Key 或 ID，以及至少一個已變更的欄位 | `issue`、`key` |
| Delete Issue | Issue Key 或 ID | `deleted` |
| Get Issue Changelog | Issue Key 或 ID；選用的 Limit、Start At | `changelog`、`count`、`pagination` |
| Notify Issue | Issue Key 或 ID、Subject、Text Body | `notified` |
| List Comments | Issue Key 或 ID；選用的 Limit、Start At | `comments`、`count`、`pagination` |
| Create Comment | Issue Key 或 ID、Comment Body | `comment` |
| Get Comment | Issue Key 或 ID、Comment ID | `comment` |
| Update Comment | Issue Key 或 ID、Comment ID、Comment Body | `comment` |
| Delete Comment | Issue Key 或 ID、Comment ID | `deleted` |
| Add Attachment | Issue Key 或 ID、Filename、Base64 內容 | `attachments`、`count` |
| Get Attachment | Attachment ID；選用的 Include Binary | `attachment` |
| List Attachments | Issue Key 或 ID；選用的 Limit、Start At、Include Binary | `attachments`、`count`、`pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key 或 ID | `transitions`、`count` |
| Transition Issue | Issue Key 或 ID、Transition ID | `transition`、`issue`、`key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

支援表達式的文字欄位可使用 [expressions](../reference/expression-dsl.md)，例如 `$input.text`。`jiraIncludeBinary` 是布林切換項，不支援表達式，但當 Jira 節點連接至 Agent 工具控制代碼時，可標記為由 Agent 提供。

## Issue 與更新欄位

- **Project Key** 是簡短的專案鍵，例如 `ENG`。使用 List Projects 來探索鍵值。
- **Issue Key 或 ID** 接受如 `ENG-123` 的鍵或數值 Issue ID。使用 Search Issues 或 List Projects 來探索值。
- **Transition ID** 來自 List Transitions。每個 transition 物件都包含一個 `id` 欄位。
- **Comment ID** 與 **Attachment ID** 來自 List Comments、List Attachments，或先前的建立/取得回應。
- **Account ID / Username** 是 Jira Cloud 的 `accountId` 值，或 Jira Data Center / Server 的使用者名稱。Get Myself 或 Get User 可協助您探索它。
- Issue 的 **description** 與留言 **body** 文字在 REST API v3 上會以 Atlassian Document Format 傳送；當 Credential 的部署為 Data Center / Server 時，則以純文字傳送。在 v3 中，換行字元會變成獨立的段落。
- **Get Issue Changelog** 使用 Jira Cloud 的分頁 changelog Endpoint。對於 Data Center / Server，它會讀取展開的 Issue changelog 資料，並將設定的 offset/limit 套用至傳回的歷史記錄。
- 在 **Update Issue** 時，將選用欄位留空以保留其目前的值。
- 在更新時將 **Description** 或 **Assignee Account ID / Username** 設為 `null` 以清除這些欄位。Labels 無法以 `null` 清除。
- Notify Issue 上的 **Recipients JSON** 在省略時預設為 `{"assignee":true}`。常見的鍵包括 `assignee`、`reporter`、`watchers` 與 `voters`（例如 `{"assignee":true,"watchers":true}`）。
- **Add Attachment** 接受原始 base64 或 data URL 內容，並受平台檔案大小設定限制（預設為 99 MB）。
## 分頁

- **Search Issues** 在 Jira Cloud 上使用透過 `jiraNextPageToken` 進行的游標分頁。請從前一次執行讀取 `pagination.nextPageToken`，並將其傳入下一個 Search Issues 節點。
- **Search Issues** 在 Jira Data Center / Server 上使用透過 `jiraStartAt` 進行的偏移分頁。請讀取 `pagination.startAt`、`pagination.maxResults` 與 `pagination.total` 以計算下一頁。
- **List Projects**、**Get Issue Changelog**、**List Comments** 與 **List Attachments** 使用搭配 `jiraLimit` 與 `jiraStartAt` 的偏移分頁。分頁結果會回傳 `pagination.startAt`、`pagination.maxResults`、`pagination.total` 與 `pagination.isLast`。
- **List Attachments** 會先從該 issue 擷取所有附件，再於用戶端切割結果。分頁欄位仍會描述所回傳的頁面，但大型 issue 可能會產生額外的擷取成本。
- **List Transitions** 不進行分頁。

## 關鍵欄位

| 欄位 | 使用者 | 備註 |
| --- | --- | --- |
| `credentialId` | 所有操作 | 所擁有的 Jira 認證 UUID |
| `jiraOperation` | 所有操作 | 預設為 `searchIssues` |
| `jiraProjectKey` | Create Issue | 專案索引鍵，例如 `ENG` |
| `jiraIssueKey` | Issue、comment、attachment、notification 與 transition 操作 | Issue 索引鍵，例如 `ENG-123` 或數值 issue ID |
| `jiraIssueType` | Create Issue | 預設為 `Task` |
| `jiraIssueTypeId` | Create Issue | 選用的 issue 類型 ID；設定時會覆寫 `jiraIssueType` |
| `jiraSummary` | Create/Update Issue | Create Issue 時為必填 |
| `jiraDescription` | Create/Update Issue | 在 REST API v3 上以 ADF 傳送，或在 REST API v2 上以純文字傳送；更新時使用 `null` 以清除描述 |
| `jiraJql` | Search Issues | 預設為 `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | 選用的 JSON 陣列或以逗號分隔的 issue 欄位；留空時預設為 `key`、`summary`、`status`、`assignee` 與 `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId 或 Data Center / Server 使用者名稱；更新時使用 `null` 以清除指派對象 |
| `jiraLabels` | Create/Update Issue | JSON 陣列或以逗號分隔的文字 |
| `jiraCommentBody` | Create/Update Comment | 在 REST API v3 上以 ADF 傳送，或在 REST API v2 上以純文字傳送 |
| `jiraCommentId` | Get/Update/Delete Comment | Jira 留言 ID |
| `jiraTransitionId` | Transition Issue | 使用 List Transitions 探索 |
| `jiraAttachmentId` | Get/Delete Attachment | Jira 附件 ID |
| `jiraAttachmentFilename` | Add Attachment | 上傳的檔案名稱 |
| `jiraAttachmentBase64` | Add Attachment | 原始 base64 或 data URL 內容；受檔案大小限制約束 |
| `jiraAttachmentMimeType` | Add Attachment | 選用的 MIME 類型；留空時會從檔案名稱推斷 |
| `jiraIncludeBinary` | Get/List Attachment | 布林切換；啟用時會加入 `content_base64` |
| `jiraNotifySubject` | Notify Issue | 必填的通知主旨 |
| `jiraNotifyTextBody` | Notify Issue | 必填的純文字通知內文 |
| `jiraNotifyHtmlBody` | Notify Issue | 選用的 HTML 內文 |
| `jiraNotifyTo` | Notify Issue | 收件者 JSON；預設為 `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId 或 Data Center / Server 使用者名稱 |
| `jiraUserEmail` | Create User | 新使用者電子郵件地址 |
| `jiraUsername` | Create User | 選用的 Data Center / Server 使用者名稱；留空時會退回使用 `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | 選用的顯示名稱 |
| `jiraUserProducts` | Create User | JSON 陣列或以逗號分隔的產品索引鍵；僅限 Jira Cloud |
| `jiraLimit` | Search Issues、List Projects、Get Issue Changelog、List Comments、List Attachments | 預設為 `50`；範圍 1–100 |
| `jiraStartAt` | Search Issues on Data Center / Server、List Projects、Get Issue Changelog、List Comments、List Attachments | 偏移分頁起始索引 |
| `jiraNextPageToken` | Search Issues on Jira Cloud | 來自先前搜尋回應的游標 Token |

## 範例

從上游輸入建立 issue：

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

更新 issue 並清除指派對象：

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

使用自訂欄位與游標分頁搜尋 issue：

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

在 Data Center 上使用偏移分頁搜尋 issue：

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

在列出可用 transition 後轉換 issue：

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- 接著以 Transition ID: `$listTransitions.transitions[0].id` 執行 **Transition Issue**

通知關注者關於 issue 的更新：

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## 輸出

每個成功的操作都會設定：

- `$jira.success`
- `$jira.operation`

**Get Myself** 會暴露 `user`。

**分頁列表操作** 會暴露 `count`、一個集合欄位，以及 `pagination`：

| 操作 | 集合鍵 | 分頁結構 |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud：`{ maxResults, nextPageToken, isLast }`；Data Center：`{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** 會暴露 `transitions` 與 `count`，且不包含分頁。

**Issue 變更與讀取** 會暴露 Jira issue payload，並在適用時一併暴露 `key`。

**Comment** 的取得／建立／更新會暴露 `comment`；刪除則暴露 `deleted`。

**Transition Issue** 會以 `{ transitionId }` 形式暴露 `transition`，並一併暴露更新後的 `issue` 與 `key`。

**Attachment add** 會暴露 `attachments` 與 `count`。**Get Attachment** 會暴露 `attachment`；**List Attachments** 會暴露 `attachments`、`count` 與 `pagination`。當啟用 **Include Binary** 時，每個 attachment 物件可能包含 `content_base64`。刪除則暴露 `deleted`。

**User** 的取得／建立會暴露 `user`；刪除則暴露 `deleted`。

**Notify Issue** 會暴露 `notified`。

常見的存取模式：

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## 相關

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
