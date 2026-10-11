# Logs 分頁

**Logs** 分頁會顯示 Heym 技術堆疊的 Docker 容器日誌。您可以使用它來進行除錯、監控與疑難排解。若需 Workflow 執行日誌（節點結果、輸出），請使用 Workflow 編輯器中的 Debug 面板——請參閱 [Canvas Features](../reference/canvas-features.md#execution-logs)。

在自架部署中，Docker 後端日誌預設為停用。若要啟用，請設定 `DOCKER_LOGS_ENABLED=true`，將 `DOCKER_LOGS_ALLOWED_EMAILS` 設為以逗號分隔的受信任使用者電子郵件清單（允許存取 Docker 日誌），並確認 `/var/run/docker.sock` 已掛載至後端容器中。預設的 Docker Compose 服務與直接使用 `docker run` 的範例皆包含該掛載，以供 Docker 型的 MCP stdio 工具使用；僅在您接受 Docker socket 信任邊界時才保留它。

若註冊功能為開放狀態，請在啟用 Docker 日誌前先建立受信任的管理員帳號，或維持 `ALLOW_REGISTER=false`；否則未經驗證的自助註冊程序可能搶先使用允許清單中的電子郵件。

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ 觀看 Logs 示範</a></p>

## 容器選擇

- **All Containers** – 合併顯示 backend、frontend 與 PostgreSQL 的日誌
- **Backend** – `heym-backend` 容器
- **Frontend** – `heym-frontend` 容器
- **PostgreSQL** – `heym-postgres` 容器

## 日誌層級篩選

- **All** – 顯示所有日誌層級
- **INFO** – INFO 及以上
- **WARNING** – 警告與錯誤
- **ERROR** – 僅錯誤
- **DEBUG** – Debug 及以上

## 搜尋

- 以文字搜尋篩選日誌
- 符合的內容會在日誌輸出中醒目顯示

## 功能

- **Auto scroll** – 有新日誌時自動捲動至底部
- **Stream** – 即時串流日誌（於支援時）
- **Copy** – 將日誌複製至剪貼簿
- **Download** – 將日誌下載為檔案

## 使用情境

- 針對 Workflow 執行失敗進行除錯
- 檢查 API 請求／回應日誌
- 監控資料庫查詢
- 檢查啟動與健康狀態訊息

## 相關內容

- [Canvas Features](../reference/canvas-features.md) – Workflow Debug 面板中的執行日誌
- [Traces Tab](./traces-tab.md) – LLM trace 檢查
- [Analytics Tab](./analytics-tab.md) – 執行指標
- [Workflows Tab](./workflows-tab.md) – Workflow 管理
- [Contextual Showcase](../reference/contextual-showcase.md) – 儀表板介面的精簡頁面導覽
