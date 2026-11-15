# Heym Incident Playbook (L0)

使用此 Playbook 確認 Heym 故障事件、評估使用者影響、選擇嚴重性等級（severity），並快速獲取正確的復原規程與負責人。

詳細操作規程：[Heym Runbook (L1)](./operations-runbook.md)

最後審查時間：2026-11-10。適用範圍：自我裝載 Heym，單一執行個體或 Cluster，運作於 Docker Compose 或 Kubernetes。

## 部署交接 (Deployment handover)

在值班（on-call）使用這些文件之前，請為每個環境填寫此表。名稱、URL、容量目標與復原指標均取決於具體部署。程式碼庫中的範例不代表生產環境清單。

| 項目 | 部署值 |
| --- | --- |
| 環境及 Heym 公開 URL | `<environment>`, `<public-url>` |
| 平台值班人員及代理人 | `<rotation-or-contact>`, `<backup-contact>` |
| 事件溝通頻道與事件追蹤系統 | `<channel>`, `<tracker-url>` |
| 資料庫值班人員及資料庫識別碼 | `<contact>`, `<database-id>` |
| 基礎設施、網路與儲存負責人 | `<contacts>` |
| 發布負責人與部署系統 | `<contact>`, `<deployment-url>` |
| 應用程式錯誤、延遲與可用性儀表板 | `<dashboard-url>` |
| 主機或 Pod CPU、記憶體、磁碟與重新啟動儀表板 | `<dashboard-url>` |
| PostgreSQL 連線數、鎖定、磁碟與複寫儀表板 | `<dashboard-url>` |
| 記錄檔與選用 OTel Trace 後端 | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose 專案/檔案或 Kubernetes 內容/命名空間 | `<exact-target>` |
| Main、Worker、資料庫與儲存位置 | `<services-or-deployments>`, `<storage-ids>` |
| 核准的冒煙 Workflow 及預期結果 | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| 資料庫與檔案備份規程、最新復原測試 | `<procedure-url>`, `<test-date>` |
| 復原時間目標與復原點目標 (RTO, RPO) | `<RTO>`, `<RPO>` |

請將聯絡資訊和儀表板連結保存在部署受限的維運複本中。證據應包含 ID、時間戳記、計數與脫敏錯誤資訊，而非認證或 Workflow Payload。

## 平台清單

| 元件 | 職責 | 故障影響 |
| --- | --- | --- |
| 前端與 Main 後端 | UI、API、MCP、Portal、互動式執行 | 分別檢查公開路由與 Main 主程序 |
| PostgreSQL | 應用程式狀態、執行登錄表、Run Queue、並行插槽、協調與通知 | 資料庫中斷可能會同時終止請求處理與背景執行 |
| Worker 執行個體（啟用 Cluster 模式時） | 佇列中符合條件的背景執行任務 | 健康的 Worker 無法取代 Main 的公開 Endpoint |
| 選出的 Leader 程序 | Cron、警示評估、背景協調 | 相容的 Worker 可成為 Leader；這不會將其角色轉變為 Main |
| Main 的持續性儲存 | Drive 檔案、已安裝外掛模組與 Coding-Agent 工作區 | 將儲存與 Main 一同復原；將 Ingress 路由至 Worker 無法復原儲存 |
| 各執行個體上的 Sandbox 後端 | 用於隔離執行的 Docker 容器或 Kubernetes Pod | Sandbox 後端故障可能會影響選定節點，而 UI 仍正常運作 |
| Workflow 相依項 | 模型提供商、MCP 伺服器、外部 API、資料儲存與傳訊服務 | 確定是單一相依項故障還是整個平台故障 |
| 選用 OTel Collector | 匯出的 Workflow、節點與 Agent Tool Span | 僅缺少匯出的 Trace 並不能證明執行失敗 |

Heym 內建的 Run Queue 使用 PostgreSQL。Redis、RabbitMQ 和向量儲存可作為 Workflow 相依項；它們不是內建佇列的強制服務。

`GET /api/health` 僅回報程序健康狀態與版本。它不測試 PostgreSQL、佇列、Leader 選舉、Sandbox 容量或認證同步。傳回綠色狀態僅代表單項檢查通過，並非端對端就緒的保證。

## 前五分鐘回應

| 步驟 | 行動 | 決策或證據 |
| --- | --- | --- |
| 1 | 確認警示並驗證環境、服務及開始時間 | 記錄 UTC 時間戳記以及最近的發布/設定變更 |
| 2 | 檢查公開 UI 和 `/api/health`，隨後檢查直接 Main 後端 | 公開路徑失敗而直接後端正常，表明存在路由或前端問題 |
| 3 | 檢查 PostgreSQL 連線能力與連線池壓力 | 在重新啟動應用程式服務之前，先將資料庫故障路由至 L1 |
| 4 | 檢查容器/Pod 狀態、CPU、記憶體、儲存與最近錯誤 | 區分基礎設施故障、高負載與特定 Workflow 故障 |
| 5 | 在 Cluster 模式下檢查 **設定 > 執行個體**、佇列狀態與 Leader 證據 | 確認 Main 遺失、離線/不符的 Worker 或僅限 Main 的任務 |
| 6 | 指定嚴重性等級並從路由表中啟動一項緩解措施 | 針對 P1/P2，立即建立事件記錄並通知相關負責人 |
| 7 | 驗證安全生產模式下的冒煙 Workflow 執行並觀察復原情況 | 確認佇列延遲（Queue Age）、錯誤率與資源使用改善；設定下次更新時間 |

如果發布與故障同時發生，請參閱[錯誤部署或設定回歸](./operations-runbook.md#bad-deployment-or-configuration-regression)。復原前請檢查結構描述（Schema）相容性。

## 嚴重性等級與回應

以下為基準回應目標。若具體部署的事件原則與業務影響要求更嚴格，請以更嚴格者為準。

| 嚴重性 | 範例 | 回應 |
| --- | --- | --- |
| P1 | Main 對所有使用者不可用；資料庫不可用或寫入失敗；大規模執行失敗；關鍵接入在所有 Workflow 中中斷 | 立即緩解，建立事件記錄，通知平台與相依項值班人員 |
| P2 | 積壓增長；Worker 容量損失；連線池接近耗盡；單一 Workflow 降低共用容量；反覆 OOM | 立即開始緩解，目標 15 分鐘內遏制，建立事件記錄 |
| P3 | 孤立的 Workflow/提供商故障；在平台整體健康容量下影響有限 | Workflow 或相依項負責人追蹤，記錄值班備忘 |
| P4 | 資訊性訊號、預期內的容量趨勢、已驗證的誤報 | 確認、記錄，必要時調整監控警示臨界值 |

## 訊號路由至 L1

在設定警示連結時，請使用這些相對錨點。當監控服務需要絕對 URL 時，請前置裝載維運複本的具體位址。

| 訊號 | 從此處開始 |
| --- | --- |
| UI/API 不可用，公開 5xx，程序健康檢查失敗 | [UI 或 API 中斷](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL 無法連線、連線被拒、寫入失敗 | [資料庫中斷](./operations-runbook.md#postgresql-down-or-not-writable) |
| 用戶端過多、連線池逾時、鎖定等待、作用中連線激增 | [資料庫連線與鎖定](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| 需要受控重新啟動後端/Worker | [服務重新啟動](./operations-runbook.md#controlled-service-restart) |
| 執行次數、總時長、Token、CPU 或記憶體激增 | [資源消耗最大的 Workflow](./operations-runbook.md#most-resource-consuming-workflows) |
| 佇列增長，執行任務處於等待或停滯狀態 | [佇列積壓](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| 執行個體離線/不符、Worker 閒置、排程或分配問題 | [Cluster 檢查](./operations-runbook.md#cluster-mode-checks) |
| Worker 正常但 Main 執行個體遺失 | [Main 執行個體不可用](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook 錯誤、MCP/Portal 故障、SSE 斷線 | [Ingress 與執行 Endpoint](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM、CrashLoop、Pending、磁碟滿、Persistent Volume 故障 | [容器、Pod 或儲存問題](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| 映像檔、環境或結構描述變更後錯誤增加 | [錯誤部署](./operations-runbook.md#bad-deployment-or-configuration-regression) |
| Agent/LLM/MCP 提供商錯誤、429、認證失敗 | [模型或整合故障](./operations-runbook.md#model-credential-or-integration-failure) |
| Code/Playwright/Skill/Coding-Agent Sandbox 失敗 | [Sandbox 故障](./operations-runbook.md#sandbox-failure) |
| 復原無法滿足目標；資料庫或檔案遺失 | [復原與災難回應](./operations-runbook.md#recovery-and-disaster-response) |

## 呈報流程 (Escalation)

| 發現項 | 介入人員 | 提供資訊 |
| --- | --- | --- |
| 多個互動介面或 Workflow 受影響 | 平台值班人員與事件指揮官 | 環境、範圍、開始時間、緩解措施、下次更新時間 |
| 資料庫不可用、過載、鎖定或磁碟耗盡 | 資料庫值班人員 | 資料庫 ID、連線數、阻斷 PID、脫敏錯誤、儲存狀態 |
| Pod/節點故障、儲存掛載失敗、Sandbox 容量不足 | 基礎設施/儲存負責人 | 內容、命名空間、工作負載、Pod 事件、資源壓力 |
| 直接後端正常但公開路由失敗 | 網路/Ingress 負責人 | 受影響路由、狀態碼、延遲、後端對比 |
| 單一 Workflow 佔用過多負載或單獨失敗 | Workflow 負責人 | Workflow/Run ID、Trigger 來源、速率、時間範圍、暫時限制 |
| 存在關聯的部署/設定變更 | 發布負責人 | 執行中映像檔摘要、發布時間、結構描述版本、上一已知正常版本 |
| 提供商配額/身分驗證/可用性問題 | 認證或整合負責人 | 提供商、模型/服務、狀態碼、安全請求 ID；切勿包含金鑰 |

如果在首次緩解後 P1/P2 影響依然存在，請立即憑藉已收集的證據進行呈報。切勿等待完整的根本原因分析。

## 故障預期

| 故障現象 | 哪些功能可維持 | 首要行動 |
| --- | --- | --- |
| PostgreSQL 不可用 | 靜態前端可能仍可載入 | 復原資料庫連線路徑；切勿盲目重新啟動所有應用程式執行個體 |
| Main 不可用，Worker 正常 | 若有相容 Worker 成為 Leader，符合條件的背景任務與排程可繼續 | 將 Main 與其持續性儲存一同復原；公開 UI/API/MCP/Portal 仍不可用 |
| Worker 不可用 | 重新分配時，其他合格執行個體可接管佇列中的任務 | 在增加流量前檢查執行個體分布、備用容量與復原情況 |
| 執行中斷 | 符合條件的可復原執行任務可從頭重新啟動一次 | 手動重放之前，請先檢查自動復原機制與外部副作用 |
| 僅限 Main 的工作負載過載 | Worker 可能保持閒置 | 減少違規接入或增加 Main 容量；調整權重無法轉移已固定的任務 |
| 內部警示不可用 | 外部 Uptime/資料庫/基礎架構監控仍可正常運作 | 使用 Heym 之外的監控；Heym 警示依賴於相同的資料庫與排程器 |
| Sandbox 或提供商不可用 | 不依賴該項的 Workflow 可正常運作 | 隔離受影響的 Workflow 並修復相應相依項 |

## 復原與事件關閉

1. 驗證公開存取、資料庫存取、預期的執行個體合格狀態以及安全的生產模式冒煙 Workflow。在編輯器中測試無法證明 Worker 排程正常。
2. 觀察至少 10 分鐘穩定的錯誤率、延遲、資源使用率以及下降的佇列延遲（Queue Age）。同時觀察下一次預期的關鍵排程任務或達成一致的同等冒煙檢查。
3. 與 Workflow 負責人核對失敗、已復原、略過、過期以及待處理的執行任務。在重放任何操作前檢查外部副作用。
4. 逐步復原暫時 Trigger 暫停、限制原則以及 Worker 權重。為每一項剩餘限制指定負責人和到期時間。
5. 使用影響範圍、UTC 時間軸、採取的行動、證據以及未解決的風險更新事件記錄。為 P1/P2 指派根本原因檢討，並在規程缺失時更新這兩份文件。

## 相關操作參考

- [L1 命令設定與檢查](./operations-runbook.md#command-setup)
- [執行與部署](../getting-started/running-and-deployment.md)
- [負載分配](./cluster.md)
- [Kubernetes 部署](../getting-started/kubernetes.md)
- [安全性與金鑰輪替](./security.md)
