# 執行與部署

Heym 為不同環境提供兩套腳本：`run.sh` 用於本機開發，`deploy.sh` 則用於以 Docker Compose 進行的正式環境部署。

> **影片導覽：** [在 2 分鐘內於本機設定 Heym](https://www.youtube.com/watch?v=P6YvlupUboU) — 複製儲存庫、啟動 PostgreSQL、填入必要的環境變數，並在本機執行個體上建立您的第一個帳號。

## 先決條件

兩套腳本皆需先安裝以下工具：

| 工具 | 用途 |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | 資料庫容器（開發）與完整堆疊（正式） |
| [uv](https://github.com/astral-sh/uv) | 後端的 Python 套件管理工具 |
| [bun](https://bun.sh) | 前端的 JavaScript 執行環境 |

## 環境設定

`run.sh` 與 `deploy.sh` 皆會讀取專案根目錄下的 `.env` 檔案。若該檔案不存在，腳本會自動從 `.env.example` 建立一份 — 本機開發與正式環境皆然。

`SECRET_KEY` 與 `ENCRYPTION_KEY` 在 `.env.example` 中預設為空值。當任一為空時，`run.sh` 與 `deploy.sh` 會自動產生一組密碼學強度的值並寫回 `.env`，因此全新設定無需手動處理金鑰。若既有的 `.env` 仍包含舊版 `ENCRYPTION_KEY` 佔位符（`change_this_to_a_random_32_byte_hex_value`），腳本會以明確的錯誤停止，而非直接覆寫 — 輪替該金鑰將導致先前加密的憑證無法讀取。若任一金鑰為空或仍為已知的佔位符，後端本身亦會拒絕啟動。

若要手動建立該檔案（此為選用 — 腳本會自動為您完成）：

```bash
cp .env.example .env
```

關鍵環境變數：

關於所有支援的變數、預設值與正式環境注意事項，請參閱 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)。

| 變數 | 說明 |
|----------|-------------|
| `SECRET_KEY` | **必填。** JWT 簽章密鑰。為空時由 `run.sh`/`deploy.sh` 自動產生。 |
| `ENCRYPTION_KEY` | **必填。** 憑證加密金鑰。為空時由 `run.sh`/`deploy.sh` 自動產生。 |
| `DATABASE_URL` | 選用的資料庫連線字串覆寫。若為空，Heym 會從 `POSTGRES_*` 設定組建。 |
| `BACKEND_PORT` | 後端 API 連接埠 — 預設為 `10105` |
| `FRONTEND_PORT` | 前端連接埠 — 預設為 `4017` |
| `FRONTEND_URL` | **正式環境必填。** 應用程式的公開 URL（scheme + host，例如 `https://heym.example.com`）。用於 OAuth 重新導向 URI（Google Sheets、BigQuery、Notion 及類似服務），以及背景執行所產生的審查、Codex 後續追蹤與檔案連結；必須與使用者在瀏覽器中使用的 URL 一致。在 Cluster 中，每個執行個體皆須設定相同的值。 |
| `ALLOW_REGISTER` | 開放使用者註冊（正式環境為 `false`，開發環境為 `true`）。請僅在您的管理員帳號建立後才將其設為 `false` — 系統沒有首位使用者引導機制，因此空資料庫加上停用註冊將導致無法建立任何帳號。 |
| `DOCKER_LOGS_ENABLED` | 設為 `true` 時啟用由 Docker 支援的 Logs 分頁存取；同時需要 Docker socket 存取權限 |
| `DOCKER_LOGS_ALLOWED_EMAILS` | 當 `DOCKER_LOGS_ENABLED=true` 時，允許存取 Docker 記錄的受信任使用者電子郵件清單（以逗號分隔） |
| `REQUEST_BODY_MAX_SIZE_MB` | Endpoint 處理常式執行前可接受的 HTTP 請求主體大小上限；預設為 `100`，比 `FILE_MAX_SIZE_MB` 多 1 MB，以保留 multipart 額外負荷的空間 |
| `HEYM_PYTHON_TOOL_SANDBOX` | 使用者自訂 Python 工具的執行方式：`auto`（預設 — 強化隔離的 Docker 容器；若 Docker 無法使用則以失敗關閉）、`docker`（同上，絕不退回），或 `subprocess`（行程內本機退回；非安全邊界，僅限受信任/開發環境）。`run.sh` 會為原生開發設定 `subprocess`。請參閱 [Security](../reference/security.md#python-tool-sandbox)。 |
| `HEYM_PYTHON_TOOL_IMAGE` | 用於 Python 工具 Docker 沙箱的映像。為空 = 自動偵測執行中的後端映像。 |

資料庫連線預設值（`POSTGRES_HOST`、`POSTGRES_PORT`、`POSTGRES_USER`、`POSTGRES_PASSWORD`、`POSTGRES_DB`）記載於 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) 與 `.env.example`。

---

## 開發：`run.sh`

`run.sh` 以單一指令在本機啟動全部三個服務——資料庫（以 Docker 容器形式）、FastAPI 後端，以及 Vite 開發伺服器。

```bash
./run.sh
```

**其逐步執行內容如下：**

1. 檢查 `docker`、`bun` 與 `uv` 是否可用
2. 若 `.env` 不存在，則從 `.env.example` 建立，並在 `SECRET_KEY` 或 `ENCRYPTION_KEY` 為空時產生隨機值
3. 在連接埠 `6543` 上啟動（或建立）資料庫 Docker 容器，並將其資料儲存於 `heym-postgres-data` Docker volume，而非主機目錄
4. 透過 `uv sync` 安裝 Python 相依套件
5. 執行 Alembic 資料庫遷移（`alembic upgrade head`）
6. 若後端與前端連接埠遭佔用，則予以釋放
7. 以 `--reload` 啟動 FastAPI 後端（程式碼變更時熱重載）
8. 透過 `bun install` 安裝前端相依套件
9. 啟動 Vite 開發伺服器

**選項：**

| Flag | 說明 |
|------|-------------|
| *（無）* | 以啟用 debug 記錄的方式啟動（`LOG_LEVEL=DEBUG`） |
| `--no-debug` | 以預設記錄層級啟動（不輸出 debug 資訊） |
| `--help` | 顯示使用說明 |

**服務位址（開發環境）：**

| 服務 | 位址 |
|---------|---------|
| 前端 | `localhost` 上的 `FRONTEND_PORT`（預設：4017） |
| 後端 API | `localhost` 上的 `BACKEND_PORT`（預設：10105） |
| 互動式 API 文件 | `localhost:10105/docs` |
| 資料庫 | `localhost:6543` |

按下 `Ctrl+C` 可優雅地停止所有服務。

---

## 端對端測試：`run_e2e.sh`

前端 Playwright 測試套件會針對實際的 Vue 應用程式、FastAPI 後端，以及一個隔離的 PostgreSQL 資料庫執行：

```bash
./run_e2e.sh
```

此測試套件為關鍵路徑的 smoke 與回歸測試套件，並非完整的产品涵蓋範圍。其涵蓋身分驗證、核心 Workflow 生命週期與執行、部分 dashboard 資源、公開路由，以及一個模擬的 HITL 審查 UI。Provider 整合、每一種節點類型、分享/權限矩陣，以及完整的 HITL 續行執行，仍主要由後端測試涵蓋，或需要專屬的整合環境。

每次執行都會取得專屬的臨時 PostgreSQL 16 容器、隨機可用的資料庫/後端/前端連接埠、身分驗證狀態、測試結果，以及 HTML 報告。這讓多個 `run_e2e.sh` 程序能夠並行執行，而不會共用狀態或覆寫產出物。此腳本會在執行結束時移除其資料庫容器，並印出產出物目錄與報告路徑。

實用指令：

```bash
./run_e2e.sh --ui         # 搭配隔離資料庫的互動式 Playwright 執行器
cd frontend
bun run test:e2e:report   # 開啟最近一次完成的本機執行報告
```

直接執行 `bun run test:e2e` 與 `bun run test:e2e:ui` 需要明確的 `DATABASE_URL`，以免它們在無意間對本機開發資料庫啟動。一般本機執行請使用 `./run_e2e.sh`。

`./check.sh` 會執行 lint、型別檢查、格式化，以及後端測試，但不含 E2E 測試套件，以維持預設本機檢查路徑的快速。Playwright E2E 測試請另行以 `./run_e2e.sh` 執行。Pull request 一律會在 GitHub Actions 中執行 Chromium E2E 測試套件，並在發生失敗時保留 trace、螢幕擷取畫面、影片與 HTML 報告。

---

## Production: `deploy.sh`

`deploy.sh` 使用 Docker Compose 建置並執行完整堆疊。三個服務 — 資料庫、後端與前端 — 皆以容器形式執行。後端 entrypoint 會在啟動伺服器前自動執行遷移，並以 8 個 worker 啟動。

**初次部署（建置 + 啟動）：**

```bash
./deploy.sh
```

此操作執行零停機部署：先建置映像檔，同時既有容器持續運作，接著再切換至新版本。

**可用指令：**

| 指令 | 說明 |
|---------|-------------|
| `./deploy.sh` | 建置映像檔並啟動/更新所有服務 |
| `./deploy.sh --status` | 顯示容器狀態 |
| `./deploy.sh --logs` | 串流所有容器的日誌 |
| `./deploy.sh --restart` | 重新啟動所有容器 |
| `./deploy.sh --down` | 停止並移除所有容器 |
| `./deploy.sh --migrate-pgdata` | 一次性遷移：將既有的 `data/postgres` 目錄複製到 `heym-postgres-data` Docker volume，並重建其索引 |
| `./deploy.sh --help` | 顯示使用說明 |

**資料庫儲存：使用 Docker named volume，而非主機目錄。**

Compose 將 PostgreSQL 儲存於 `heym-postgres-data` Docker volume。較早的版本則是 bind-mount 主機目錄 `./data/postgres`。macOS（virtiofs）與 Windows/WSL2 上的主機 bind mount 無法為 PostgreSQL 提供其所需的 `fsync` 與檔案關閉保證：在這些環境中的 Cluster 會在 WAL segment 上遇到 `PANIC: could not close file … Input/output error`，並隨時間損毀。Linux bind mount 從未受影響，但現在所有平台皆使用相同配置。

若既有部署的資料仍位於 `./data/postgres`，升級是一次性步驟。`./deploy.sh` 會偵測到此情況，在建置前停止，並要求您先進行遷移：

```bash
./deploy.sh --migrate-pgdata   # stop services, copy into the volume, rebuild indexes
./deploy.sh                    # deploy as usual
```

**此遷移亦會重建索引。** 複製是逐位元組進行，因此舊 bind mount 造成的索引損壞也會一併帶過去。因此 `--migrate-pgdata` 會先在新 volume 上單獨啟動 `postgres` 服務，對其執行 `reindexdb`，然後在堆疊其餘部分啟動前再次停止它。這點很重要，因為這類損毀會使索引項目指向超出 heap 尾端的位置 — 這種狀態 `pg_amcheck` 會回報為正常，因此檢查通過並不代表資料表健康。REINDEX 會修復那些索引項目；但它無法還原舊檔案系統已遺失的 heap 分頁。在已知健康的大型資料庫上，您可以使用 `./deploy.sh --migrate-pgdata --skip-reindex` 略過重建。

複製過程為非破壞性。`./data/postgres` 會保留作為備份，且遷移會拒絕覆寫已存有資料庫的 volume。若任一步驟失敗，新的 volume 會被移除，因此半遷移的 Cluster 絕不會被誤部署。在確認您的 Workflow 完好無損後，即可刪除舊目錄。`postgres` 容器帶有相同的防護機制，因此手動執行 `docker compose up` 也無法在您的資料上悄悄初始化一個空資料庫。全新安裝則無需任何操作。

**服務位址（production）：**

前端容器暴露於 `FRONTEND_PORT`（預設：4017）。後端 API 提供於 `/api` 路徑下，透過前端容器代理 — 因此在 production 中僅有一個對外連接埠。

**容器總覽：**

| 容器 | 說明 |
|-----------|-------------|
| `heym-db` | 關聯式資料庫 |
| `heym-backend` | FastAPI API 伺服器（8 個 worker，由 `backend/Dockerfile` 建置） |
| `heym-frontend` | 前端預覽容器，提供建置後的 Vue 應用程式（由 `frontend/Dockerfile` 建置） |

**版本更新標記：**

應用程式頁首會顯示執行中的 Docker 建置版本。當該版本落後於最新的 Heym GitHub release 時，版本旁會出現紫色的 **Update** 標記。點擊版本或標記即可開啟 Heym GitHub releases 頁面。

---

## 預建映像檔：`docker run`

如果您不想在本機建置應用程式，可以直接拉取已發佈的容器映像檔並執行。

該映像檔會在單一容器中同時啟動前端與後端。PostgreSQL 仍為外部服務，但您可以提供 `DATABASE_URL`，或使用 `.env.example` 中的 `POSTGRES_*` 變數。

> **請將資料庫儲存於 Docker 具名磁碟區中。** 發行映像檔並未內附資料庫，因此 `DATABASE_URL` 所指向的 PostgreSQL 需由您自行運行。請以 `-v heym-postgres-data:/var/lib/postgresql/data` 掛載，而非使用主機路徑：在 macOS（virtiofs）與 Windows/WSL2 上，以 bind mount 掛載的 PostgreSQL 資料目錄無法遵守資料庫所需的 `fsync` 保證，長期下來會損毀 cluster。

> **向量儲存後端。** `run.sh` 與 `deploy.sh` 會執行官方 `postgres:16` 映像檔，並於啟動時自動安裝 `postgresql-16-pgvector` 套件，因此 **Postgres (pgvector) RAG 後端**在該環境下可開箱即用，無需變更您的資料。然而，預建的單一容器映像檔會連線至**您**所提供的 PostgreSQL——該資料庫必須支援 `vector` 擴充功能，才能使用 Postgres 後端。Heym 無法將 pgvector 安裝至非由其管理的資料庫。若缺少該擴充功能，啟動遷移會優雅地略過 pgvector 資料表——部署仍會成功，Qdrant RAG 持續運作，而建立或上傳至 Postgres 向量儲存時會回傳明確的「backend unavailable」訊息，直到啟用 pgvector 為止。

**直接執行映像檔時請自行設定金鑰。** 與 `run.sh`/`deploy.sh` 不同，預建映像檔不會自動產生金鑰。在執行 `cp .env.example .env` 之後，請填入兩個空金鑰（就地取代可避免產生重複項目）：

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **請將檔案與外掛掛載設為絕對路徑。** `FILE_STORAGE_DIR` 與 `HEYM_PLUGINS_DIR` 預設為相對路徑 `./data/files` 與 `data/plugins`，而發行映像檔會從 `/app/backend` 啟動後端。若維持相對路徑，它們會解析為 `/app/backend/data/files` 與 `/app/backend/data/plugins`，導致上述兩個 bind mount 收不到任何內容，且容器被替換時上傳的檔案會遺失。`-e` 旗標會覆寫 `.env.example` 透過 `--env-file` 提供的相對值，因為命令列的 `-e` 優先於 `--env-file`。Compose（`./deploy.sh`）則無需此設定：該映像檔會從 `/app` 啟動後端，相對預設值已能正確落在掛載點上。

> **Docker socket 存取。** 掛載 `/var/run/docker.sock` 會讓後端對主機 Docker daemon 擁有廣泛的控制權。預設 Docker Compose 服務與直接 `docker run` 範例皆包含此掛載，以支援會執行 `docker` 指令的 Docker 型 MCP stdio 工具。Logs 分頁仍需設定 `DOCKER_LOGS_ENABLED=true` 與 `DOCKER_LOGS_ALLOWED_EMAILS`，並以逗號分隔受信任的使用者電子郵件清單。請在啟用 Docker logs 之前先建立受信任的管理員帳號，或維持 `ALLOW_REGISTER=false`，以免未經驗證的自行註冊者冒用允許清單中的電子郵件。使用者自訂的 Python 工具**不會**取得此 socket：它們會在獨立且強化過的容器中執行，且不具備 Docker socket。請參閱 [Security](../reference/security.md#python-tool-sandbox)。

> **Codex runner。** Codex 節點會使用與 `ghcr.io/heymrun/heym` 相同的映像檔作為同層 runner 容器（`--entrypoint codex`），以便 Codex 的 Linux 沙箱能建立 namespace。若您希望在直接映像檔設定中使用 Codex workflow，請保留 `heym-codex-workspaces` 磁碟區掛載；該 runner 不會取得 Docker socket 或後端機密。

> **OpenCode Go runner。** OpenCode Go 節點會使用相同映像檔作為強化過的同層 runner（`--entrypoint opencode`），並共用 `heym-opencode-workspaces`。若您希望在直接映像檔設定中使用 OpenCode workflow，請保留該磁碟區掛載；該 runner 不會取得 Docker socket 或 GitHub token。

> **Skill 沙箱。** Agent 節點上的 Python skill 會在強化過的同層容器中執行，並共用 `heym-codex-workspaces` 磁碟區，因此請為 skill 保留該磁碟區掛載——不僅是為了 Codex。每次執行都會取得隔離的單次執行子路徑，且該同層容器不會取得 Docker socket 或後端機密。此功能需要 **Docker Engine 25.0+**；在較舊的引擎上，或缺少該磁碟區時，`HEYM_PYTHON_TOOL_SANDBOX=auto` 會以失敗關閉（fail closed）——僅在受信任的單一使用者環境中才設定 `HEYM_PYTHON_TOOL_SANDBOX=subprocess`。請參閱 [Security](../reference/security.md#skill-sandbox)。

> **Playwright 需要 `--shm-size 2g`。** Docker 為容器配置的 `/dev/shm` 僅有 64 MB，Chromium 在此限制下會導致其 renderer 崩潰。以步驟為基礎的 Playwright 節點會在此容器內以子程序方式執行 Chromium，因此會受到此容器的限制；自訂的 `playwrightCode` 則在另一個同層容器中執行，並設定自己的限制。`docker-compose.yml` 已宣告 `shm_size: "2gb"`，因此 `run.sh` 與 `deploy.sh` 不受影響——只有單純使用 `docker run` 時才需要加上此旗標。

> **Playwright Run Code。** 自訂 Playwright Python 需要 `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` 以及上述的 Docker socket 掛載。release image 會為 GHCR 配置（`/app/backend/.venv`）設定 `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON`。Compose 的 `./deploy.sh` 會將 sandbox image 預設為 `heym-backend:local`。請在 sandbox 容器內的 Chromium 啟動參數中保留 `--no-sandbox`。

**直接執行 image 所需的最低環境變數：**

| 變數 | 必填 | 用途 |
|----------|----------|---------|
| `DATABASE_URL` | 選填 | 完整的 PostgreSQL 連線字串覆寫 |
| `POSTGRES_HOST` | 是，當 `DATABASE_URL` 為空時 | PostgreSQL 主機 |
| `POSTGRES_PORT` | 是，當 `DATABASE_URL` 為空時 | PostgreSQL 連接埠 |
| `POSTGRES_USER` | 是，當 `DATABASE_URL` 為空時 | PostgreSQL 使用者名稱 |
| `POSTGRES_PASSWORD` | 是，當 `DATABASE_URL` 為空時 | PostgreSQL 密碼 |
| `POSTGRES_DB` | 是，當 `DATABASE_URL` 為空時 | PostgreSQL 資料庫名稱 |
| `SECRET_KEY` | 是 | JWT 簽署密鑰 |
| `ENCRYPTION_KEY` | 是 | 憑證加密密鑰 |
| `FRONTEND_URL` | 建議 | 公開的瀏覽器 URL，特別是供 OAuth callback 使用 |
| `CORS_ORIGINS` | 建議 | 允許的瀏覽器來源 |
| `FILE_STORAGE_DIR` | 建議 | 當您掛載該路徑時，請將其設為絕對路徑 `/app/data/files`；相對路徑預設值 `./data/files` 在此 image 中會解析至 `/app/backend` 底下，因而錯過掛載點 |
| `ALLOW_REGISTER` | 建議 | 在正式環境中設為 `false`，除非您有意開放註冊，但請務必在您的管理員帳號建立之後再設定——系統沒有首位使用者 bootstrap 機制 |
| `DOCKER_LOGS_ENABLED` | 選填 | 設為 `true` 以允許 Logs 分頁使用 Docker socket 存取 |
| `DOCKER_LOGS_ALLOWED_EMAILS` | 當 `DOCKER_LOGS_ENABLED=true` 時必填 | 以逗號分隔的受信任使用者電子郵件清單，允許其存取 Docker logs |
| `HEYM_PLUGINS_ENABLED` | 選填 | 設為 `true` 以啟用 plugin 子系統（以 zip 安裝的自訂節點）。預設為關閉 |
| `HEYM_PLUGIN_ADMIN_EMAILS` | 當 `HEYM_PLUGINS_ENABLED=true` 時必填 | 以逗號分隔的 operator 電子郵件清單，允許其安裝／解除安裝 plugin |
| `HEYM_PLUGINS_DIR` | 選填 | plugin 檔案的儲存位置。當您掛載該路徑時，請將其設為絕對路徑 `/app/data/plugins`；相對路徑預設值 `data/plugins` 在此 image 中會解析至 `/app/backend` 底下，因而錯過掛載點 |
| `HEYM_PYTHON_TOOL_SANDBOX` | 選填 | Python tool 隔離模式；預設為 `auto`（強化 Docker sandbox，fail closed）。請參閱 [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | 選填 | 覆寫 Python tool sandbox image；留空 = 自動偵測 backend image |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | 選填 | 同層 Codex runner 容器所使用的 Docker volume；在 Docker 部署中預設為 `heym-codex-workspaces` |
| `HEYM_CODEX_NETWORK_ACCESS` | 選填 | 允許 Codex 的 sandboxed 指令下載檔案／相依套件；Docker 部署預設啟用此項 |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | 選填 | 同層 OpenCode runner 容器所使用的 Docker volume；在 Docker 部署中預設為 `heym-opencode-workspaces` |

**注意事項：**

- 此 image 會暴露連接埠 `4017`
- 後端維持內部存取，並透過 `/api` 代理
- 當 `POSTGRES_HOST=localhost` 時，release image 會在需要時自動將其改寫為 `host.docker.internal`，讓同一份 `.env` 也能搭配 macOS Docker/Desktop 工具上的主機層級 PostgreSQL 容器運作
- 若您希望 Drive 上傳與 skill 產生的檔案在容器重新啟動後仍能保留，請保留 `data/files` 掛載
- **Plugins：** 若要啟用，請設定 `HEYM_PLUGINS_ENABLED=true` 與 `HEYM_PLUGIN_ADMIN_EMAILS`，並掛載 `data/plugins`，讓已安裝的 plugin 檔案在容器重新建立後仍能保留。Plugin metadata 儲存於您的 PostgreSQL 中，因此同樣會保留。Plugin 所宣告的 pip `dependencies` 會在安裝時安裝至容器中；由於 image 檔案系統是短暫的，這些相依套件會在啟動時為每個已安裝的 plugin **自動重新安裝**（release image 的 `uv` venv 可寫入，因此這在單一容器 image 中也能運作）

### 將現有資料庫搬移至具名 volume

`./deploy.sh --migrate-pgdata` 僅認得 Compose stack。若您是針對自己的 PostgreSQL 容器執行 release image，且該容器以 bind mount 方式掛載主機目錄，請自行遷移。

請先檢查您的資料庫容器使用何種掛載方式：

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

若 `"Type"` 顯示為 `bind`，請將其搬移至具名 volume：

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own

# 若此 Docker 主機執行多個 Heym 部署，請為 volume 命名。
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. 再次於該 volume 上啟動 PostgreSQL，沿用您先前的 flags，
#    但將 bind mount 替換掉。
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. 待其接受連線後，重建索引。
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**在步驟 2 與步驟 3 中使用您自己的 image，而非 `postgres:16`。** 若您的資料庫執行的是 `pgvector/pgvector:pg16` 或其他變體，以原廠 image 啟動複製的 cluster 可能會失敗，因為其預期的擴充套件函式庫不存在。

您原始的資料目錄不會被此程序更動，因此它仍是您的回復路徑。請僅在確認遷移後的資料庫能服務您的 workflows 之後再刪除它。步驟 4 之所以重要，原因與 Compose 遷移時相同：複製的內容會一併帶走任何既有的索引損壞。

---

## 執行多個執行個體

上述所有內容部署的是單一 Heym 執行個體。當單一機器不再足夠時，將第二個執行個體指向同一個 PostgreSQL 資料庫，它便會以 worker 身分加入：背景執行 — cron、webhooks、MCP 工具呼叫、chat triggers — 接著會依您在 **Settings → Instances** 下設定的百分比，在執行個體之間分擔。

執行個體之間從不互相通訊。Postgres 承載工作，因此 worker 不需要開放任何連接埠，也不需要回連主執行個體的路由，且不涉及任何訊息代理。涉及本機磁碟的工作 — Drive 檔案、coding-agent 工作區、已安裝的 plugins — 一律在主執行個體上執行，因此無需透過檔案系統共享任何內容。

有兩條規則 cluster 無法替您強制執行：每個執行個體都必須使用相同的 `SECRET_KEY` 與 `ENCRYPTION_KEY`，且 ingress 必須僅指向主執行個體。這兩點連同放置規則以及如何選擇百分比，都在 [Load Distribution](../reference/cluster.md) 中說明。

> 這是負載分散，而非高可用性。主執行個體在 ingress、檔案儲存與編輯器方面仍是單點故障。

## 常見 Workflows

**首次設定：**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

若使用預先建置的 `docker run` image，請先手動產生金鑰（請參閱上方的 **Prebuilt Image** 章節）。

**程式碼變更後更新 production：**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**檢查 production 日誌：**

```bash
./deploy.sh --logs
```

**停止 production 服務：**

```bash
./deploy.sh --down
```

---

## 相關內容

- [Introduction](./introduction.md) – 平台總覽
- [Quick Start](./quick-start.md) – 建立您的第一個 workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 完整設定參考
- [Security](../reference/security.md) – JWT、加密與 CORS 設定
- [Load Distribution](../reference/cluster.md) – 對單一資料庫執行多個執行個體
