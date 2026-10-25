# GitHub

**GitHub** 節點可將原生 GitHub REST 操作加入 Workflow，類似於你可能在 n8n 等工具中熟悉的多操作 GitHub 節點。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| Credential | GitHub |
| 輸出 | `$nodeLabel.*` |

## 支援的操作

此節點目前提供 40 個動作：

| 資源 | 動作 |
|----------|---------|
| Repository | `Get Repository`、`Get Repository License`、`Get Repository Profile`、`Get Repository Issues`、`Get Repository Pull Requests`、`List Popular Paths for Repository`、`List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`、`List User Repositories`、`Get User Repositories`、`Get User Issues`、`Invite User` |
| Issue | `Create Issue`、`Get Issue`、`List Issues`、`Edit Issue`、`Lock Issue`、`Create Comment` |
| Pull request | `Create Pull Request`、`List Pull Requests` |
| Review | `Create Review`、`Get Review`、`List Reviews`、`Update Review` |
| Release | `Create Release`、`Get Release`、`List Releases`、`Update Release`、`Delete Release` |
| Workflow | `List Workflows`、`Get Workflow`、`Enable Workflow`、`Disable Workflow`、`Get Workflow Usage`、`Dispatch Workflow`、`Dispatch Workflow and Wait` |
| File | `Get File`、`List Files`、`Create or Update File`、`Delete File` |

## Credential

在 [Credentials Tab](../tabs/credentials-tab.md) 中建立 **GitHub** Credential，並提供：

- 個人存取 Token
- 選用的完整 REST API 基礎 URL，用於 GitHub Enterprise Server

若使用 GitHub.com，請將基礎 URL 留空。建議使用細粒度 PAT。

若使用 GitHub Enterprise Server，請輸入包含 `/api/v3` 的完整 REST API Endpoint，例如
`https://github.example.com/api/v3`。請勿僅輸入網頁介面根路徑
（`https://github.example.com`）。

若你使用 GitHub Enterprise Server，且之後編輯 Credential 以輪換 Token，將
`base_url` 留空會保留現有的 Enterprise Endpoint。僅在你想要變更該 Endpoint 時，
才輸入新的 URL。

## 常用欄位

大多數操作會使用：

- **Owner** – Repository 擁有者、組織名稱或使用者名稱
- **Repository** – Repository 名稱

`List Organization Repositories` 僅需要 **Owner**（組織名稱），不使用 repository 欄位。

`List User Repositories` 僅需要 **Owner**（使用者名稱），不使用 repository 欄位。

`Get User Repositories` 對應 n8n 的 User → Get Repositories 動作。`Get User Issues` 預設
會回傳指派給已驗證 GitHub 使用者的 issue。將 **Mentioned Filter** 設為任何非空值，
則會改為回傳提及已驗證使用者的 issue。它也支援 state、labels、updated-since、sort、
direction 及 per-page 篩選條件。`Invite User` 需要組織與電子郵件地址，且不使用 Owner 或 Repository。

## Repository

Repository 操作包含中繼資料、偵測到的授權內容、社群健康概況，以及流量洞察。
`List Popular Paths for Repository` 與
`List Top Referrers for Repository` 會回傳 GitHub 過去 14 天的熱門流量項目，且
需要 repository 管理 push 權限。

`List Issues` 支援選用的 assignee、creator、mentioned user、以逗號分隔的 labels、
updated-since 時間戳、sort 及 direction 篩選條件。`List Pull Requests` 支援 state、sort、
direction 及 per-page 控制項。

`Get Repository Issues` 與 `Get Repository Pull Requests` 以明確的 n8n 相容 repository
動作名稱，公開與其 List 對應項相同的 API。

### Get Repository 中繼資料

`Get Repository` 會將 GitHub 的完整回應儲存於 `$github.repository`，同時也公開
`$github.full_name`、`$github.default_branch`、`$github.private` 及 `$github.url`。

repository Payload 通常包含：

- 身分與擁有權：ID、名稱、完整名稱、描述、擁有者及可見性
- Repository 狀態：private、fork、archived、disabled 及 default branch
- URL：GitHub 頁面、API、clone、SSH 及 Git URL
- 活動與大小：建立、更新及 push 時間戳、大小、stars、watchers、forks、subscribers 及 open issues
- 功能：issues、projects、wiki、Pages、discussions、topics、language 及 homepage
- License、合併設定、呼叫者權限、安全性設定，以及可取得時的 fork parent/source 中繼資料

部分管理、權限、合併及安全性欄位取決於 Credential 的 repository
權限。

範例：

- Owner：`heymrun`
- Repository：`heym`

## Issues

Issue 操作支援 title/body 欄位，以及用於 labels 與 assignees 的選用 JSON 陣列欄位。

`List Issues` 僅回傳 repository issue。Pull request 會被排除；請使用 `List Pull Requests` 取得 PR 結果。

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Edit Issue 欄位語意

對於 `Edit Issue`，僅有你在執行時明確設定的欄位會傳送至 GitHub：

- **State** – 選擇 `Don't change`、`Open` 或 `Closed`。保持未設定以維持目前狀態。
- **State Reason** – 可選設定 `Completed`、`Not Planned`、`Duplicate` 或 `Reopened`。
- **Title / Body** – 留空以維持目前值。
- **Labels / Assignees** – 將欄位留空以維持目前值。使用 `[]` 清除所有 labels 或 assignees。使用如 `["bug"]` 的 JSON 陣列來取代它們。

`Edit Issue` 在執行時需要至少一個要變更的欄位。若你僅提供 issue 編號，執行會因 GitHub API 層的驗證錯誤而失敗。
## Lock Issue

`Lock Issue` 接受選填的 **Lock reason**。提供時，其值必須是 GitHub 支援的其中一種：

- `off-topic`
- `too heated`
- `resolved`
- `spam`

將 reason 留空即可在沒有特定原因的情況下鎖定。

## Pull Requests

建立 PR 需要：

- Title
- Head branch
- Base branch
- 選填的 body
- 選填的 draft 模式

## Pull Request Reviews

Review 操作對應 GitHub 的 pull request review API：

| 操作 | 必填欄位 | 選填欄位 |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request number、event | Body、commit ID |
| `Get Review` | Pull request number、review ID | — |
| `List Reviews` | Pull request number | Per page |
| `Update Review` | Pull request number、review ID、body | — |

`Create Review` 支援 `Approve`、`Request Changes`、`Comment` 與 `Pending`。
`Request Changes` 與 `Comment` 必須提供 body。當 Commit ID 為空時，GitHub
會審查該 pull request 的最新 commit。

## Releases

| 操作 | 執行階段必填欄位 | 常見選填欄位 |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name（標題）、body、target branch、draft、prerelease |
| `Update Release` | Release ID | Tag name、release name、body、target branch、draft、prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` 可將 `draft` / `prerelease` 明確設為 `true` 或 `false`。

## Workflows

Workflow 操作支援：

- 列出 repository workflows
- 以數字 ID 或 workflow 檔案名稱取得 workflow
- 啟用或停用 workflow
- 依 runner 作業系統讀取可計費的 workflow 使用量
- 以 ref 或 branch 加上選填的 JSON inputs 物件來觸發 workflow

GitHub 正在逐步關閉 `Get Workflow Usage` endpoint。使用此操作的 Workflows 在
GitHub 移除該 endpoint 時可能需要進行遷移。

`Dispatch Workflow` 同時接受兩種 GitHub 回應形式：舊版的 `204 No Content` 以及較新的
`200` 回應（包含 `workflow_run_id`、`run_url` 與 `html_url`）。

`Dispatch Workflow and Wait` 會觸發 workflow 並輪詢該次執行，直到其狀態為
`completed`。請以秒為單位設定 timeout 與 polling interval。當 GitHub 回傳較新的 `200`
回應時，Heym 會使用 `workflow_run_id`。對於傳統的 `204 No Content` 回應，Heym 會為所選的
workflow 與 ref 找出新建的 `workflow_dispatch` 執行，然後等待該次執行。

## File Contents

`Get File` 透過 GitHub 的 contents API 讀取 repository 檔案，並在可用時解碼文字內容。二進位檔案與非 UTF-8 內容可能僅回傳 metadata，而不含解碼後的 `content` 欄位。

`List Files` 會針對指定的資料夾路徑與選填的 ref，從 repository contents API 回傳目錄項目。將 **Directory Path** 留空即可列出 repository 根目錄。

`Create or Update File` 使用以下項目將文字內容寫入 repository 路徑：

- File path
- Commit message
- File content
- 選填的 branch

`Delete File` 使用 commit message 與選填的 branch 移除 repository 路徑。若檔案存在，Heym 會在刪除前自動取得目前的 SHA。

若檔案已存在，Heym 會在更新前自動取得目前的 SHA。

## Pagination

`List Issues`、`Get Repository Issues`、`Get User Issues`、`List Pull Requests`、
`Get Repository Pull Requests`、`List Reviews`、`List Releases`、`List Workflows`、
`List Organization Repositories`、`List User Repositories` 與 `Get User Repositories` 支援
**Per Page**（1–100）。Heym 僅請求一頁結果；同一操作中沒有用於取得額外頁面的 `page` 欄位。


### Return all pages

開啟 **Return all pages** 後，一次執行會走訪每一頁；若已設定 **Cursor**，則從該位置開始。無論 **Per Page** 為何，每個請求都會取得 100 個項目。節點會在約 1,000 個項目（或 100 個請求）後停止：issue 物件每個約 6 KB，更高的上限會產生非常大的節點輸出。提前停止時，它不會擲回錯誤，而是傳回已取得的內容，並附上 `has_more: true` 和 `next_cursor`，您可以將該 Cursor 傳給下一次執行以繼續。停止 Workflow 或達到 Workflow 逾時，會在頁與頁之間結束取得。

## Output

實際結構取決於所選的操作。常見欄位包括：

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

將 `github` 替換為你的節點標籤。

## Notes

- 提供 Labels 與 assignees 時，必須是有效的 JSON 陣列。
- 提供 Workflow dispatch inputs 時，必須是有效的 JSON 物件。
- `Edit Issue` 僅在你明確設定時才會使用 `state`；保持未設定即可維持目前的 issue 狀態。
- GitHub API 權限取決於你授予的 token scopes 或精細的 repository 權限。

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – 新增與管理 GitHub credentials
- [Third-Party Integrations](../reference/integrations.md) – GitHub credential 設定與 Enterprise `base_url`
- [Agent Node](./agent-node.md) – 搭配 `@modelcontextprotocol/server-github` 使用 GitHub credentials
- [Node Types](../reference/node-types.md) – 完整節點目錄
