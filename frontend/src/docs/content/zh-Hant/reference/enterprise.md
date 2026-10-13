# Enterprise

Heym 平台的商業授權、專業支援與部署服務。

## 概觀

Heym 可依其 source-available 授權免費使用與自行託管。對於需要商業授權、正式環境部署協助或專屬支援的組織，Enterprise 方案提供由 Heym 團隊親自協助的服務。

| 服務 | 說明 |
|---------|-------------|
| **Production Agent Support** | 架構審查、Agent 與 Workflow 設計指導，以及協助將 Agent 導入正式環境的實作支援 |
| **Tool Training** | 為您的團隊提供的入門課程與訓練，涵蓋 Workflow 編輯器、AI 節點、Agent 及整合功能 |
| **Heym Q&A** | 直接與 Heym 工程團隊聯繫，針對平台問題、最佳實務及疑難排解進行諮詢 |
| **Kubernetes Deployment** | 協助多 worker 節點設定、sidecar 容器、擴展策略及 Cluster 配置 |
| **Solution Consulting** | 針對您的特定使用情境進行客製化解決方案設計，包含整合規劃與架構建議 |
| **Priority Support & SLA** | 保證回應時間與優先問題處理 |
| **Custom Development** | 依據您組織需求所量身打造的功能開發與修改 |

## Heym Work

[Heym Work](./heym-work.md) 是執行於 Heym 之上的業務團隊介面。使用者只需描述工作內容、回答幾個問題，即可取得經過測試的 Workflow，在專為他們打造的頁面中工作並回覆審核，同時具備單一登入（SSO）、Owner、Editor 與 Viewer 角色，以及每次執行上的名稱記錄。它以獨立授權與您的 Heym 並行運作；可在 **Settings → Heym Work** 中連線。造訪 [heym.run/enterprise](https://heym.run/enterprise) 瞭解詳情並申請試用。

## Production Agent Support

Heym 團隊協助您為業務流程設計、建置及強化 Agent 與 Workflow。這包括審查您的需求、建議節點配置，並確保您的 Workflow 遵循可靠性、可觀測性及治理的最佳實務。

支援涵蓋所有節點類型，包括 [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md) 及 [Cron](../nodes/cron-node.md) Trigger——以及進階模式，例如[多 Agent 協作](./agent-architecture.md)、[Human-in-the-Loop](./human-in-the-loop.md) 檢查點，以及跨分支的[平行執行](./parallel-execution.md)。

## Tool Training

依據您團隊的技能水準與使用情境所量身打造的實作訓練課程：

- Workflow 編輯器與[畫布功能](./canvas-features.md)
- AI 驅動節點：[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[RAG](../nodes/rag-node.md)
- [Agent 架構](./agent-architecture.md)與多 Agent 協作
- [Credentials](./credentials.md) 管理與[第三方整合](./integrations.md)
- [Trigger](./triggers.md)、[Webhook](./webhooks.md)，以及透過 [Cron](../nodes/cron-node.md) 進行排程
- [Expression DSL](./expression-dsl.md) 與[全域變數](./global-variables.md)
- [Teams](./teams.md) 協作與 [credentials 共享](./credentials-sharing.md)
- 用於客戶端聊天介面的 [Portal](./portal.md) 部署
- 用於 AI Workflow 可觀測性的 [Traces](../tabs/traces-tab.md) 與 [Evals](../tabs/evals-tab.md)

## Kubernetes Deployment

標準的[執行與部署](../getting-started/running-and-deployment.md)指南涵蓋適用於單一伺服器正式環境的 Docker Compose 設定。Enterprise 客戶可獲得正式環境 Kubernetes 部署的協助，以實現高可用性與水平擴展：

- **多個 worker 節點** — 將 Heym 後端 worker 分散至多個 Kubernetes 節點，以實現備援與負載平衡
- **Sidecar 容器** — 為日誌收集、監控 Agent、服務網格（Istio、Linkerd）及機密注入（Vault）配置 sidecar 模式
- **資源規劃** — CPU 與記憶體的 requests/limits、pod disruption budget，以及水平 pod 自動擴展策略
- **網路** — Ingress controller 配置、TLS 終止，以及後端、前端與資料庫 pod 之間的內部服務通訊
- **持久性儲存** — 資料庫與向量儲存的磁碟區佈建，搭配適當的 StorageClass 與備份策略
- **監控** — 與 Prometheus、Grafana 或您現有的可觀測性堆疊整合，以取得容器指標、日誌與警示

## Solution Consulting

每個組織執行 Agent 所面對的系統與限制各不相同。Heym 團隊提供顧問服務，協助您：

- 評估 Heym 是否適合您的特定使用情境
- 設計端對端的 Agent 與 Workflow 架構
- 規劃與您現有基礎架構及第三方服務的整合
- 除錯複雜的 Workflow 並解決正式環境問題
- 從 n8n、Zapier 或 Make.com 等工具遷移現有的 Workflow

## 聯絡方式

請透過 **enterprise@heym.run** 聯繫 Enterprise 團隊，以洽詢授權、價格或安排初步通話。

## 相關內容

- [執行與部署](../getting-started/running-and-deployment.md) — 使用 Docker Compose 進行正式環境部署
- [安全性](./security.md) — 平台安全實務與配置
- [平行執行](./parallel-execution.md) — 多 worker 執行模型
- [Teams](./teams.md) — 團隊協作與資源共享
- [完整功能集](./features.md) — Heym 功能完整概觀
- [Heym Work](./heym-work.md)：業務團隊專用介面與連線方式
