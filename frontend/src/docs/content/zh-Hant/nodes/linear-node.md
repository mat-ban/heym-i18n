# Linear

**Linear** 節點將 Workflow 連接至 Linear GraphQL API，以進行 Issue 與工作區自動化。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| Credential | Linear 個人 API key 或 OAuth2 |
| 輸出 | `$nodeLabel.*` |

## Credential

在 [Credentials Tab](../tabs/credentials-tab.md) 中建立 **Linear** Credential。選擇一種驗證模式：

**個人 API key**

1. 在 Linear 中，開啟 **Settings → Security & Access → Personal API keys**。
2. 建立一組可存取您欲自動化之工作區的 key。
3. 將該 key 貼入 Heym 中新建的 Linear Credential，並使用 **Test Connection** 進行驗證。

**OAuth2**

1. 建立一個 Linear OAuth 應用程式。
2. 將 `{FRONTEND_URL}/api/credentials/linear/oauth/callback` 註冊為 redirect URI。
3. 在 Heym 中選擇 **OAuth2**，輸入 Client ID 與 Client Secret，然後點擊 **Connect**。

個人 API key 與 OAuth token 會以建立或授權它們的使用者身分運作。

## 操作

| 操作 | 必填欄位 | 輸出 |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit；選填 After Cursor | `teams`、`count`、`pageInfo` |
| List Projects | Limit；選填 After Cursor | `projects`、`count`、`pageInfo` |
| List Issues | Limit；選填 Team ID、Project ID、After Cursor | `issues`、`count`、`pageInfo` |
| List Workflow States | Team ID | `states`、`count` |
| List Team Members | Team ID、Limit；選填 After Cursor | `members`、`count`、`pageInfo` |
| Get Issue | Issue ID 或如 `ENG-123` 的識別碼 | `issue`、`identifier`、`url` |
| Create Issue | Team ID、Title | `issue`、`identifier`、`url` |
| Update Issue | Issue ID 或識別碼，以及至少一個變更的欄位 | `issue`、`identifier`、`url` |
| Delete Issue | Issue ID 或識別碼 | `deleted` |
| Add Issue Link | Issue ID 或識別碼、Link URL | `link` |
| Create Comment | Issue ID 或識別碼、Comment Body | `comment` |
| List Comments | Issue ID 或識別碼、Limit；選填 After Cursor | `comments`、`count`、`pageInfo` |
| Update Comment | Comment ID、Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`、`entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

所有文字欄位皆支援 [expressions](../reference/expression-dsl.md)。

## Issue 欄位

- **Team ID** 與 **Project ID** 為 Linear UUID。使用 List Teams 或 List Projects 來取得它們。
- **State ID** 為建立或更新 Issue 時所使用的 workflow-state UUID。使用 List Workflow States 來取得它。
- **Assignee ID** 為 Linear 使用者 UUID。使用 List Team Members 來取得它。
- **Priority** 接受 `0` 至 `4`：無優先級、緊急、高、一般與低。
- 將選填的更新欄位留空以保留其目前的值。
- 將更新欄位設為 `null` 以清除 description、project、assignee 或 state。
- **Link URL** 為 Issue 新增外部附件連結。
- **Comment ID** 為現有留言的 Linear UUID。使用 List Comments 來取得它。
- **Parent Comment ID** 在建立留言時回覆現有的 Linear 留言。

## 分頁

List 操作可回傳單一頁面，或自動擷取每一頁：

- 關閉 **Return All** 以手動使用 `Limit` 與 `After Cursor`。
- 開啟 **Return All** 以在伺服器端跟隨 Linear cursor，最多 10,000 筆結果。

分頁結果會回傳 `pageInfo.hasNextPage` 與 `pageInfo.endCursor`。當 **Return All** 關閉時，將 cursor 傳入下一次節點執行的 **After Cursor** 以擷取下一頁。

## 範例

從上游輸入建立 Issue：

- Operation：`Create Issue`
- Team ID：`team UUID`
- Title：`$input.title`
- Description：`$input.description`
- Priority：`2`

為已建立的 Issue 新增留言：

- Operation：`Create Comment`
- Issue ID：`$createLinearIssue.issue.id`
- Comment Body：`$input.comment`
- Parent Comment ID：選填，用於回覆其他留言時

解決留言討論串：

- Operation：`Resolve Comment`
- Comment ID：`$listComments.comments[0].id`

為 Issue 新增外部連結：

- Operation：`Add Issue Link`
- Issue ID：`$createLinearIssue.issue.id`
- Link URL：`$input.url`

分頁瀏覽團隊成員：

- Operation：`List Team Members`
- Team ID：`$listTeams.teams[0].id`
- Limit：`50`
- After Cursor：當 `hasNextPage` 為 true 時，於下一次執行使用 `$listTeamMembers.pageInfo.endCursor`

在更新 Issue 前取得 workflow state ID：

- Operation：`List Workflow States`
- Team ID：`$listTeams.teams[0].id`
- 接著在 **Update Issue** 中使用 `$listStates.states[0].id` 作為 **State ID**

## 輸出

每個成功的操作皆會設定：

- `$linear.success`
- `$linear.operation`

List 操作亦會提供 `count`，並在適用時提供 `pageInfo`。Issue 操作會提供完整的 Linear issue payload，以及如 `identifier` 與 `url` 等便利欄位。Comment mutation 會提供完整的 `comment` payload，但 Delete Comment 除外，其提供 `deleted` 與 `entityId`。

## 相關

- [Credentials Tab](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
