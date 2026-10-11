# Codex

**Codex** 節點會在隔離的 Heym 工作區中，針對 GitHub 儲存庫執行 OpenAI Codex CLI。此節點專為程式碼撰寫任務而設計，例如修正測試、編輯檔案、產生 patch，或開啟草稿 pull request。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1，外加 `question` |
| 認證資訊 | Codex access token + GitHub |
| 輸出 | `$nodeLabel.summary`、`$nodeLabel.diff`、`$nodeLabel.changedFiles`、`$nodeLabel.pullRequestUrl` |

## 認證

**OpenAI Codex** 認證資訊支援兩種驗證模式：

| 模式 | 說明 |
|------|-------------|
| **Sign in with ChatGPT**（建議） | 使用你的 ChatGPT Plus/Pro 訂閱的 OAuth（PKCE）登入，因此執行時**不會**產生以 token 計費的 API 成本。在認證資訊對話框中點選 **Sign in with ChatGPT**，於瀏覽器中授權，然後將 `localhost:1455` 重新導向 URL 貼回 Heym。Heym 會儲存產生的 token 組合，並在到期時自動更新。 |
| **Access token** | 貼上僅供本機 Codex 執行器使用的 ChatGPT/Codex `access_token`。 |

Codex 認證資訊不接受 API key。此節點不會提交雲端 Codex 任務；它會在 Heym 執行環境內複製儲存庫，將 ChatGPT token 組合寫入隔離的 `auth.json`（或傳遞 `CODEX_ACCESS_TOKEN`），且僅提供給 Codex 程序使用，並讓 token 不進入 `$credentials`。

此節點也需要 **GitHub** 認證資訊，用於複製私有儲存庫、推送工作分支，以及建立草稿 pull request。

在 Docker 部署中，Heym 會從相同的 Heym 映像檔啟動同層級容器（而非獨立的 GHCR 映像檔）來執行 Codex。該容器僅掛載 Codex 工作區磁碟區，並讓 Codex 自身的 bubblewrap 沙箱建立命名空間與全新的 `/proc`。執行器會加入 `SYS_ADMIN`、unconfined seccomp 與 AppArmor，以及 `systempaths=unconfined`（Docker Engine 25+）。若缺少最後一個旗標，每個指令都會在啟動前失敗，並顯示 `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`。

OpenAI 參考資料：

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## 欄位

| 欄位 | 說明 |
|-------|-------------|
| Codex Credential | OpenAI Codex 認證資訊（ChatGPT 登入或 `access_token`） |
| GitHub Credential | 用於存取儲存庫的 GitHub PAT 認證資訊 |
| Repository URL | HTTPS GitHub 儲存庫 URL |
| Base Branch | Codex 執行前要複製的分支，預設為 `main` |
| Model | 選用的 Codex 模型（可編輯的下拉式選單，例如 `gpt-5.6-sol`、`gpt-5.6-terra`、`gpt-5.6-luna`）；留空則使用 Codex 的預設值 |
| Reasoning Effort | Codex 推理深度：`low`、`medium`、`high`、`xhigh`（Extra High）、`max` 或 `ultra`（預設為 `medium`） |
| Task Prompt | 給 Codex 的程式碼撰寫任務；支援 `$input.text` 等表達式 |
| Publish Mode | 變更的交付方式（請見下方表格） |
| Branch Name | PR/commit 模式的工作分支，預設為 `codex/$executionId` |
| Timeout | Codex 最長執行時間（秒） |

## Publish 模式

| 模式 | 功能 |
|------|--------------|
| `diff_only` | 在本機編輯檔案，並回傳 patch 與變更的檔案。不會推送任何內容。 |
| `draft_pr` | 提交至分支、推送該分支，並開啟草稿 pull request。 |
| `open_pr` | 提交至分支、推送該分支，並開啟可供審查（非草稿）的 pull request。 |
| `commit_push` | 提交至分支並推送該分支，但不開啟 pull request。 |
| `direct_commit` | 直接提交並推送至基礎分支（不使用獨立分支或 PR）。 |
| `open_or_update_pr` | 當 agent 已有開啟中的 PR 時更新該 PR——即使分支名稱不同，執行器仍會依作者 + 基礎分支找到它——否則開啟新的 PR。最適合重新執行與「更新開啟中的 PR」指示。 |
| `update_existing_pr` | 將 commit 加入現有的分支/PR；若尚不存在則開啟一個。 |
| `patch_artifact` | 將 diff 儲存為可下載的檔案，並回傳 `patchUrl`。不會推送任何內容。 |

## 輸出

| 鍵 | 說明 |
|-----|-------------|
| `status` | `completed` 或 `needs_input` |
| `summary` | Codex 的摘要 |
| `validation` | Codex 回報的驗證備註、測試或檢查 |
| `diff` | 檔案變更時的 Git patch |
| `changedFiles` | 變更的檔案路徑 |
| `threadId` | Codex thread/session id（若可用） |
| `branchName` | 工作分支名稱 |
| `pullRequestUrl` | `draft_pr`、`open_pr`、`open_or_update_pr` 與 `update_existing_pr` 模式中的 PR URL |
| `pushedBranch` | commit/PR 模式中已推送的分支 |
| `patchUrl` | `patch_artifact` 模式中 diff 的下載連結 |
| `usage` | Codex CLI 回報的使用量中繼資料（若可用） |
## 提取請求上的 UI 螢幕截圖

對於 UI/前端任務，Codex 應將 PNG 螢幕截圖儲存在 gitignored 路徑下，例如 `frontend/.e2e-artifacts/`（而非原始碼中）。若缺少前端相依套件，Codex 可執行 `bun install`（或 npm/pnpm install），並啟動短期的預覽/`bun run dev`，僅用於擷取 UI。Heym 會將這些圖片上傳至單一共享的 GitHub **prerelease**（`codex-pr-assets`），作為命名為 `<branch>-…` 的資產，然後在**開啟提取請求之前**將其嵌入 PR 描述中，因此新建的 PR 在建立時即已包含其螢幕截圖（現有的 PR 則會就地更新）。Codex 也必須設定有意義的 `pull_request_title`（絕不可使用如 `Done.` 的佔位符）。

Codex 有時會在任務進行中結束一輪（「…現在讓我截個圖」），這會在螢幕截圖擷取之前就結束該次執行。為防止此情況，runner prompt 要求在最終結果**之前**擷取螢幕截圖；若執行仍以無可發布的摘要結束，或是有 UI 變更但無螢幕截圖，Heym 會在同一工作區再執行一次 Codex 以完成。若 UI 變更之後仍無螢幕截圖，則會在 PR 內文中加入一則可見的註記，使此缺口永遠不會被無聲忽略。

## 哪些內容會發布至 GitHub

你的 **Task Prompt** 是私人輸入，並非 PR 內容。僅有兩項內容會被發布：描述程式碼變更內容的 `## Change Summary`，以及擷取螢幕截圖時的 `## Screenshots` 區段。PR 標題僅根據變更摘要衍生。

runner prompt 載明此政策，Heym 也會在執行後強制執行：在任何內容被提交或開啟為提取請求之前，它會從摘要、PR 內文及提交訊息中移除 prompt 回音區段（`## Task`、`## Prompt`、`## Instructions`、`## Original Request`、…）以及任何逐字複製自任務 prompt 的段落。諸如 `Both pass. Let me do a final review:` 的步驟敘述也會被拒絕作為 PR 標題或提交主旨。

## 後續問題

若 Codex 需要缺少的需求或產品決策，它會回傳 `needs_input`。Heym 會暫停執行並暴露一個 `question` 輸出 handle。將該 handle 連接至通知分支，例如 Slack 或 Send Email，以將公開的後續連結傳送給審閱者。

當審閱者回答後，Heym 會從已儲存的工作區中介資料恢復相同的執行快照與 Codex thread。

## 作為 agent 工具

Codex 節點可附加至 **AI Agent** 節點的工具 handle，使 agent 能委派編碼任務。在節點上設定 credential、GitHub credential 及 repository，然後以 agent 提供的切換標記 **Task Prompt**（以及選用的 **Repository URL**），使 agent 在呼叫時提供它們。當 Codex 作為工具執行時，`needs_input` 結果會內聯回傳給 agent，而非暫停 workflow，因此 agent 可以調整請求並再次呼叫 Codex。

## 範例

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## 相關

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
