# OpenCode Go

**OpenCode Go** 節點會在隔離且強化的 Heym 容器中，針對 GitHub 儲存庫執行 [OpenCode](https://opencode.ai) CLI（Go）。與 Codex 節點相同，它專為修正測試、編輯檔案、產生 patch 或開啟 pull request 等程式設計任務而設計，但它使用與供應商無關的 **OpenCode Go** 模型閘道，而非 OpenAI Codex。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 認證 | OpenCode Go API key + GitHub |
| 輸出 | `$nodeLabel.summary`、`$nodeLabel.diff`、`$nodeLabel.changedFiles`、`$nodeLabel.pullRequestUrl` |

## 認證

**OpenCode Go** 認證會儲存 OpenCode Go 閘道的 **API key**（來自 [opencode.ai/go](https://opencode.ai/go)）以及選用的 **Gateway Base URL**（預設為 `https://opencode.ai/zen/go/v1`；僅在自架或代理閘道時覆寫）。

此節點也需要 **GitHub** 認證，用於複製私有儲存庫、推送工作分支，以及建立 pull request。GitHub token **絕不會被放入沙箱容器內**——Heym 會在主機上執行所有 git 與 GitHub 操作，因此產生的程式碼無法竊取推送認證。

## 隔離與安全性

執行隔離由 `HEYM_OPENCODE_CLI_COMMAND` 選擇，與 Codex 節點完全相同：

- **本機開發（`run.sh`）** 會將其保留為預設的 `opencode`，因此 OpenCode 會以主機子程序的形式對複製的工作區執行——不需要 Docker，也不需要額外旗標。
- **Docker 部署（`deploy.sh` 與單一 GHCR 映像）** 會將其設為 `/usr/local/bin/heym-opencode-docker`，這是一個 wrapper，會在共用 OpenCode 工作區具名 volume 的**強化、拋棄式同層容器**內執行 `opencode run`。

強化後的 runner 容器會捨棄所有 Linux capabilities、設定 `no-new-privileges`、使用唯讀 root 搭配 tmpfs `/tmp`，並套用 pid/memory/CPU 限制。允許網路對外連線（OpenCode 必須能連線至模型閘道）。**GitHub token 絕不會被放入容器內**——所有 git 與 GitHub 操作都在主機端執行，因此容器內只會有 OpenCode API key 與儲存庫檔案。

OpenCode 僅會編輯磁碟上的檔案；Heym 掌控所有 git/GitHub 動作。

## 模型

OpenCode Go 的模型清單經常變動，因此 **Model** 欄位會從閘道的模型清單（`GET https://opencode.ai/zen/go/v1/models`）即時填入，並顯示為可搜尋的下拉式選單。若即時清單無法取得，則會使用內建的備援清單。模型 id 使用 `opencode-go/<model>` 形式（例如 `opencode-go/kimi-k3`、`opencode-go/deepseek-v4-pro`、`opencode-go/qwen3.7-max`）——`opencode-go` 是 OpenCode CLI 對 Go 閘道使用的供應商 id。將此欄位留空會使用 runner 預設值（`opencode-go/kimi-k3`）。以較舊的 `opencode/<model>` 形式儲存的模型 id 會在執行時自動改寫。

## 欄位

| 欄位 | 說明 |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go 認證（閘道 API key） |
| GitHub Credential | 用於儲存庫存取的 GitHub PAT 認證 |
| Repository URL | HTTPS GitHub 儲存庫 URL；支援表達式 |
| Base Branch | OpenCode 執行前要複製的分支，預設為 `main` |
| Model | OpenCode Go 模型（即時可搜尋下拉式選單，`opencode-go/<model>`）；留空則使用 runner 預設值 |
| Reasoning Variant | 選用；對支援 reasoning effort 的模型會對應至 `opencode run --variant` |
| Task Prompt | 給 OpenCode 的程式設計任務；支援 `$input.text` 等表達式 |
| Publish Mode | 變更的交付方式（請見下方表格） |
| Branch Name | PR/commit 模式的工作分支，預設為 `opencode/$executionId` |
| Timeout | OpenCode 最長執行時間（秒） |

## Publish Modes

| 模式 | 功能 |
|------|--------------|
| `diff_only` | 在本機編輯檔案並回傳 patch 與變更的檔案。不會推送任何內容。 |
| `draft_pr` | 提交至分支、推送該分支，並開啟 draft pull request。 |
| `open_pr` | 提交至分支、推送該分支，並開啟可供審查（非 draft）的 pull request。 |
| `commit_push` | 提交至分支並推送該分支，但不開啟 pull request。 |
| `direct_commit` | 直接提交並推送至 base 分支（不使用獨立分支或 PR）。 |
| `open_or_update_pr` | 當 agent 已有開啟中的 PR 時更新該 PR——即使分支名稱不同，runner 也會依作者 + base 找到它——否則開啟新的 PR。最適合重新執行與「更新開啟中的 PR」指示。 |
| `update_existing_pr` | 對現有分支/PR 新增 commit；若尚不存在則開啟一個。 |
| `patch_artifact` | 將 diff 儲存為可下載的檔案並回傳 `patchUrl`。不會推送任何內容。 |

## 輸出

| Key | 說明 |
|-----|-------------|
| `status` | 一律為 `completed`（OpenCode Go 節點不會暫停等待輸入） |
| `summary` | OpenCode 的最終訊息 |
| `validation` | 回報時的驗證備註 |
| `diff` | 檔案變更時的 Git patch |
| `changedFiles` | 變更的檔案路徑 |
| `branchName` | 工作分支名稱 |
| `pullRequestUrl` | `draft_pr`、`open_pr`、`open_or_update_pr` 與 `update_existing_pr` 模式中的 PR URL |
| `pushedBranch` | commit/PR 模式中已推送的分支 |
| `patchUrl` | `patch_artifact` 模式中 diff 的下載連結 |
## 提取請求上的 UI 螢幕截圖

對於 UI／前端任務，OpenCode 應將 PNG 螢幕截圖儲存在 gitignored 路徑下，例如 `frontend/.e2e-artifacts/`（而非原始碼中）。若缺少前端相依套件，runner prompt 允許進行針對性的套件安裝（例如 `bun install`），並搭配短期的預覽／`bun run dev`，純粹用於擷取 UI。Heym 會將這些圖片上傳至單一共享的 GitHub **prerelease**（`opencode-pr-assets`），作為命名為 `<branch>-…` 的資產，然後在**開啟提取請求之前**將它們嵌入 PR 描述中，因此新建的 PR 在建立時即已包含其螢幕截圖（既有的 PR 則會就地更新）。

OpenCode 也被指示以一行 `PR_TITLE: …` 作為結尾，讓 Heym 能以有意義的主旨開啟提取請求，而非使用如 `Done.` 之類的佔位符。

OpenCode 有時會在任務進行中途結束一輪（「…Now let me take a screenshot」），這會在螢幕截圖擷取之前就結束該次執行。為防止此情況，runner prompt 要求在最終訊息**之前**擷取螢幕截圖；而若該次執行仍以無可發布的摘要結束，或是有 UI 變更但沒有螢幕截圖，Heym 會在同一工作區再執行一次 OpenCode 以完成收尾。若之後 UI 變更仍沒有螢幕截圖，則會在 PR 內文中加入一則可見的註記，確保此缺口永遠不會被無聲略過。

## 哪些內容會發布至 GitHub

你的 **Task Prompt** 是私人輸入，並非 PR 內容。只有兩項內容會被發布：描述程式碼變更內容的 `## Change Summary`，以及擷取到螢幕截圖時的 `## Screenshots` 區段。PR 標題僅根據變更摘要衍生。

runner prompt 載明了此政策，Heym 也會在執行後強制執行：在任何內容被提交或開啟為提取請求之前，它會從摘要、PR 內文及提交訊息中移除 prompt 回聲區段（`## Task`、`## Prompt`、`## Instructions`、`## Original Request`、…），以及任何逐字複製自任務 prompt 的段落。

Heym 會從 agent 的訊息中讀取 `## Change Summary` 區段，而非採用其最後所說的內容，因為 OpenCode 每個步驟都會發出一則訊息，而最後一則通常是執行中途的評論。步驟敘述（`Both pass. Let me do a final review:`）也會被拒絕作為 PR 標題或提交主旨。若該次執行未產生可用的變更摘要，提取請求會改為列出已變更的檔案，而非發布評論。

## 作為 agent 工具

OpenCode Go 節點可附加至 **AI Agent** 節點的工具控制點，讓 agent 能委派編碼任務。在節點上設定 credential、GitHub credential 及 repository，然後以 agent 提供的切換開關標記 **Task Prompt**（以及選用的 **Repository URL**），讓 agent 在呼叫時提供它們。

## 範例

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## 相關

- [Codex 節點](./codex-node.md)
- [GitHub 節點](./github-node.md)
- [Agent 節點](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials 共享](../reference/credentials-sharing.md)
- [節點類型](../reference/node-types.md)
