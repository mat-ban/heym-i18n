# Sentry

使用 Sentry 節點從 Workflow 自動化 Sentry 的組織、專案、團隊、Issue、Event 及 Release 操作。

## Credential

建立一個帶有驗證 Token 的 **Sentry** Credential。若使用 Sentry SaaS，將 Base URL 留空；若使用自架的 Sentry 執行個體，則設定其根 URL。

## 操作

- `createProject`、`createRelease`、`createTeam`
- `deleteIssue`、`deleteProject`、`deleteRelease`、`deleteTeam`
- `getEvent`、`getIssue`、`getProject`、`getRelease`
- `listEvents`、`listIssues`、`listOrganizations`、`listProjects`、`listReleases`、`listTeams`
- `updateIssue`、`updateOrganization`、`updateProject`、`updateRelease`、`updateTeam`

`createIssue` 與 `createOrganization` 並未開放，因為 Sentry 並未為其記錄公開的 REST Endpoint。

## 常用欄位

| 欄位 | 說明 |
| --- | --- |
| Credential | 要使用的 Sentry Credential |
| Operation | 要執行的 Sentry 動作 |
| Organization Slug | 用於組織更新，以及專案、團隊、Issue、Event 與 Release 操作的 Sentry 組織 Slug |
| Project Slug | 用於專案 get/update/delete 與 Event 操作的專案 Slug；用於 Issue 篩選的專案 Slug 或 ID |
| Team Slug | 用於專案建立與團隊 update/delete 操作的團隊 Slug |
| Issue ID | 用於 Issue get/update/delete 操作的 Issue ID |
| Event ID | 用於 Event 查詢操作的 Event ID |
| Release Version | 用於 Release get/update/delete 操作的 Release 版本 |
| Name | 用於建立操作的專案或團隊名稱 |
| Slug | 用於建立操作的選填專案或團隊 Slug |
| Platform | 用於專案建立的選填 Sentry 平台 |
| Status / Assigned To | Issue 更新欄位。`updateIssue` 至少需要其中一項 |
| Query | Sentry 搜尋查詢。若要查詢未解決的 Issue 可省略，或設為空字串以取得所有 Issue |
| Limit | 列表操作的結果數量上限，最多 1,000 筆結果 |
| Release Projects JSON | 用於 Release 建立的專案 Slug JSON 陣列 |
| Release Refs JSON | 用於 Release 建立的 repository/commit 物件 JSON 陣列 |
| Payload JSON | 用於組織、專案、Release 與團隊更新操作的 JSON 物件 |

## 範例

列出未解決的 Issue：

```json
{
  "sentryOperation": "listIssues",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryQuery": "is:unresolved level:error",
  "sentryStatsPeriod": "14d",
  "sentryLimit": "25"
}
```

解決一個 Issue：

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

刪除一個 Issue：

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

建立一個 Release：

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

更新一個專案：

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## 輸出

列表操作會回傳 `success`、`operation`、`count`，以及相關的集合，例如 `organizations`、`projects`、`teams`、`issues`、`events` 或 `releases`。單一資源操作會回傳 `organization`、`issue`、`event`、`release`、`project` 或 `team`。刪除操作會回傳相關的資源鍵，其中包含 `deleted: true` 及識別欄位。
