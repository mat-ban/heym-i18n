# 安全性

Heym 平台的安全性實務與設定。

## 密碼原則

所有密碼——無論是在註冊時或變更密碼時——都必須符合以下要求：

| 規則 | 要求 |
|------|-------------|
| 最小長度 | 8 個字元 |
| 大寫字母 | 至少一個大寫字母（A–Z） |
| 小寫字母 | 至少一個小寫字母（a–z） |
| 數字 | 至少一個數字（0–9） |

這些規則在前端與後端（Pydantic 驗證器）皆會強制執行。若請求中的密碼不符合規範，會在寫入任何資料庫之前以 `422 Unprocessable Entity` 回應拒絕。

**有效密碼範例：** `MyWorkflow7!`

## Session 管理

- Access token 儲存於 **HttpOnly** cookie 中，而非 `localStorage`。這可防止 JavaScript（包括 XSS payload）讀取 token。
- Refresh token 的範圍限定於 `/api/auth/refresh` 路徑，無法傳送至其他 endpoint。
- 每次呼叫 `/api/auth/refresh` 都會**輪換**refresh token：舊 token 會立即撤銷，並核發新的 token。重複使用已用過的 refresh token 會回傳 `401`。

## 速率限制

以下 endpoint 會依 IP 進行速率限制：

| Endpoint | 限制 | 封鎖時間 |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 次請求 / 60 秒 | 15 分鐘 |
| `POST /api/auth/register` | 5 次請求 / 60 秒 | 10 分鐘 |
| `POST /register`（OAuth 用戶端） | 5 次請求 / 60 秒 | 10 分鐘 |
| Portal 登入 | 3 次嘗試 | 24 小時 |

當設定了 `REDIS_URL` 時，速率限制會在所有後端 worker 之間共用。若未設定，則限制僅套用於個別 worker 程序。

## 憑證加密

所有儲存於 [Credentials](../tabs/credentials-tab.md) 面板中的 API key、webhook URL 與 bearer token，在寫入資料庫之前都會使用 AES-256（Fernet）進行靜態加密。金鑰衍生自 `ENCRYPTION_KEY` 環境變數。當其為空時，`run.sh` 與 `deploy.sh` 腳本會自動產生一組強式值；若 `ENCRYPTION_KEY` 為空或仍為已知的預留位置，應用程式會拒絕啟動。

## MCP API Key

MCP API key 用於驗證連接至 `/api/mcp/sse` endpoint 的外部 MCP 用戶端。當 SSE 連線建立時，會核發一個短效期（1 小時）的 session token，並將其嵌入 message endpoint URL 中，而非使用真實的 API key，以避免金鑰出現在伺服器存取日誌中。設定方式請參閱 [MCP Tab](../tabs/mcp-tab.md)。

## OAuth / PKCE

OAuth 2.0 授權伺服器（用於 MCP 用戶端）僅支援搭配 PKCE（`S256`）的 `authorization_code` grant。同意表單使用有效期為 10 分鐘的 HMAC-SHA256 CSRF token。同意頁面中顯示的所有值皆經過 HTML 跳脫處理。

## Execution Token

[Execution token](./execution-tokens.md) 是範圍限定的 JWT，用於從外部系統呼叫 workflow 的 execute endpoint。與使用者 session token 不同，它們具有以下特性：

- **單一 workflow 範圍限定**——token 用於任何其他 workflow 都會被拒絕。
- **可獨立撤銷**——撤銷 token 不會影響核發該 token 的使用者 session。
- **可為短效或長效**——TTL 可選擇從 60 秒到 10 年。

Token 使用相同的應用程式密鑰（`SECRET_KEY`）簽署，並在每次請求時檢查：簽章、到期時間、`wid` claim 是否符合，以及撤銷狀態。設定方式與 API 參考請參閱 [Execution Tokens](./execution-tokens.md)。

## 內容安全

在 LLM 與 Agent 節點上使用 [Guardrails](./guardrails.md)，以在使用者訊息到達模型之前封鎖不安全或違反政策的內容。Guardrails 支援九種內容類別（暴力、仇恨言論、色情內容等），並可設定靈敏度等級。

## Python 工具沙箱

[Agent 節點](../nodes/agent-node.md)上使用者定義的 Python 工具會執行不受信任的程式碼。根據預設，Heym 會在強化的拋棄式 Docker 容器中執行每個工具，具備以下特性：

- 無網路存取，
- 唯讀根檔案系統，搭配一個小型 `tmpfs` 工作目錄，
- 非 root 使用者，並捨棄所有 Linux capabilities 及設定 `no-new-privileges`，
- 嚴格的 CPU、記憶體與 PID 限制，以及
- **不掛載 Docker socket**，因此工具無法觸及主機的 Docker daemon。

執行後端由 `HEYM_PYTHON_TOOL_SANDBOX` 環境變數控制：

| 值 | 行為 |
|-------|----------|
| `auto`（預設） | 在強化的 Docker 容器中執行。若 Docker 無法使用，執行會**安全地失敗**——不會在沒有 OS 隔離的情況下默默執行不受信任的程式碼。 |
| `docker` | 與 `auto` 相同，但絕不退回。 |
| `subprocess` | 在本機的行程內子程序中執行，並以 import 允許清單加以防護。這**並非安全邊界**，僅適用於受信任的程式碼或本機開發。`run.sh` 會為原生開發選擇此模式。 |

設定 `HEYM_PYTHON_TOOL_IMAGE` 可固定沙箱映像；當其為空時，Heym 會自動偵測執行中的後端映像。行程內限制（import 允許清單加上屬性與 introspection 過濾）會作為縱深防禦加以套用，但容器才是真正的隔離邊界——在多使用者與正式環境部署中，請保持預設的 `auto`（或 `docker`）模式。

## Skill Sandbox

附加至 [Agent 節點](../nodes/agent-node.md) 的 Python skills 同樣會執行不受信任的程式碼——skill 可能原封不動地夾帶在共享的 workflow 或 `everyone` 可見性的 template 中——因此 skills 與 Python tools 一樣，都必須通過**相同**的 `HEYM_PYTHON_TOOL_SANDBOX` 開關，並以相同方式 fail closed。Skill 容器採用完全相同的強化設定（非 root、捨棄所有 capabilities、`no-new-privileges`、唯讀根檔案系統、CPU/記憶體/PID 限制，以及**沒有 Docker socket**），但有兩項刻意保留的差異，因為 skills 確實需要它們：

- **允許網路對外連線**（skills 會呼叫 API，並透過 `uv` 安裝自己的相依套件），以及
- **掛載可寫入的 workspace**，讓 skills 能產生輸出檔案並讀取 Heym Drive 檔案。

此 workspace 透過 Codex runner 所使用的同一個具名 Docker volume（`heym-codex-workspaces`，掛載於 `/app/data/codex-workspaces`）與用完即丟的兄弟容器共享。只有本次執行自己的子目錄會透過每次執行專屬的 `volume-subpath` 掛載至兄弟容器中——因此某個 skill 永遠不會看到另一次執行或 Codex 的 workspace 資料。Docker Compose stack 一律會掛載此 volume；單容器 `docker run` 則必須為 Python skills 及 Codex 加上 `-v heym-codex-workspaces:/app/data/codex-workspaces`。若在 `auto`/`docker` 模式下缺少此 volume，skill 執行會 **fail closed**，而不會在 backend 中執行。由於每次執行專屬的 subpath 掛載需要 **Docker Engine 25.0 或更新版本**，較舊的 engine 應升級，或以 `HEYM_PYTHON_TOOL_SANDBOX=subprocess` 執行受信任的 skills。

只有非機密、可攜的環境變數（proxy 與 CA-bundle 設定、locale）會轉送進容器；資料庫 URL、`SECRET_KEY`/`ENCRYPTION_KEY`、供應商 API keys 及 OAuth secrets 皆由 allowlist 予以保留。Skill 檔案路徑會經過驗證，確保其位於 workspace 內，且輸出目錄中植入的 symlinks（包括 `_hitl_request.json` sentinel）絕不會被跟隨。如有需要，可使用 `HEYM_SKILL_IMAGE`、`HEYM_SKILL_NETWORK`、`HEYM_SKILL_MEMORY`、`HEYM_SKILL_CPUS`、`HEYM_SKILL_PIDS` 及 `HEYM_SKILL_USER` 覆寫預設值。

與 tools 相同，`subprocess` 模式會在 backend 行程中執行 skill，且**並非安全邊界**——僅適用於受信任的單一使用者或本機開發情境（`run.sh` 會為原生開發選擇此模式）。

## Code Node Sandbox

[Code 節點](../nodes/code-node.md)會執行任意使用者 Python 程式碼以及任意第三方相依套件，因此它是三個 sandbox 中最嚴格的一個，也是唯一**沒有逃生出口**的：它不讀取任何 sandbox 模式變數、沒有 `subprocess` 模式，且在無法連線至 Docker daemon 時 fail closed。它絕不會退回在 backend 行程中執行使用者程式碼。

執行時會使用一個或兩個用完即丟的容器，兩者皆與 tool 及 skill sandbox 採用相同的強化設定（非 root、捨棄所有 capabilities、`no-new-privileges`、唯讀根檔案系統、CPU/記憶體/PID 限制，以及**沒有 Docker socket**）：

- 當 `requirements.txt` 為空時，會以**單一容器搭配 `--network none`** 執行程式碼。Runner 會透過容器的 stdin payload 傳入，因此完全不需掛載任何內容。
- 當有相依套件時，第一個容器會在有網路存取的情況下將它們安裝至每次執行專屬的 `.deps` 目錄，第二個容器則以**唯讀**方式掛載該子樹並執行程式碼。除非節點的 `codeAllowNetwork` 選項開啟，否則執行容器沒有網路。

相依套件以 `uv` 安裝，並以 `pip` 重試，且不會在多次執行之間快取。當 backend 在容器中執行時，每次執行專屬的目錄位於 skill sandbox 所使用的同一個 `heym-codex-workspaces` volume 上，並透過每次執行專屬的 `volume-subpath` 掛載，因此某次執行永遠不會看到另一次執行的檔案；該形式需要 **Docker Engine 25.0 或更新版本**。原生 backend（`./run.sh`）沒有這類 volume，也不需要——其每次執行專屬的目錄是本機暫存路徑，直接 bind-mount 至兄弟容器中。無論採用何種方式，該目錄都會在每次執行後刪除，不論結果為何。

只有非機密、可攜的環境變數會轉送進容器——proxy 設定、CA bundles 及 locale，這些是相依套件安裝在企業 proxy 後方存取 PyPI 時所需的。資料庫 URL、`SECRET_KEY`/`ENCRYPTION_KEY`、供應商 API keys 及 OAuth secrets 皆由 allowlist 予以保留，因此新的 backend secret 預設會被捨棄，而不會外洩直到有人更新 denylist。Backend 的 `HOME` 絕不會覆寫 sandbox 自身的可寫入路徑。

**Format** 按鈕使用相同的 sandbox。Ruff 會解析並改寫原始碼，而非執行它，但若在 backend 主機上執行，等同於將 backend 的完整環境交給不受信任的檔案，因此它會取得自己專屬、用完即丟的 `--network none` 容器，具備相同的限制與相同的 allowlisted 環境。若無 Docker，它會 fail closed，而不會在主機上進行格式化。

Sandbox 限制是常數而非環境變數——512 MB 記憶體、一個 CPU、256 個行程、120 秒安裝逾時，以及 60 秒執行逾時。映像檔則由既有的 `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` 鏈解析；此節點不引入自身的設定。

## 相關

- [Running & Deployment](../getting-started/running-and-deployment.md) – 於啟動時設定 `SECRET_KEY`、`ENCRYPTION_KEY`、`ALLOW_REGISTER` 及 `HEYM_PYTHON_TOOL_SANDBOX`
- [Code Node](../nodes/code-node.md) – 具備獨立依賴項的沙箱化 Python 執行環境
- [Agent Node](../nodes/agent-node.md) – 在沙箱中執行的自訂 Python 工具
- [Execution Tokens](./execution-tokens.md) – 用於從外部系統呼叫 Workflow 的範圍限定 JWT
- [Guardrails](./guardrails.md) – 封鎖 LLM 與 Agent 節點中的不安全內容
- [Settings](./user-settings.md) – 變更您的密碼
- [Credentials Tab](../tabs/credentials-tab.md) – 管理 API 金鑰
- [MCP Tab](../tabs/mcp-tab.md) – MCP API 金鑰與 OAuth 用戶端
- [Portal](./portal.md) – 公開聊天入口網站的存取控制
