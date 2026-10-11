# Settings

Settings 對話框可讓您管理個人資料、設定持續生效的 AI 指示、更新帳號密碼、設定聊天語音、設定預設 AI 認證與模型，以及檢視 observability 狀態。點擊頁首右上角的**您的頭像與名稱**即可開啟。

## 開啟對話框

點擊頁首右上角的**您的頭像與名稱**。對話框會開啟並顯示以下分頁：**Profile**、**Security**、**Voice**、**AI Defaults** 與 **Observability**。Instance 管理員還會看到 **SSO** 分頁。

## Profile 分頁

### 個人資料圖片

Heym 會在頁首顯示您帳號電子郵件對應的 [Gravatar](https://gravatar.com) 圖片，該圖片也會顯示於 [Chat](../tabs/chat-tab.md) 與 **Chat with Heym** 中您的訊息旁、[Board](../tabs/board-tab.md) 留言旁，以及分享對話框與團隊成員清單中您的名稱旁。若要變更圖片，請更新 Gravatar 上的圖片；Heym 會在數小時內取得新圖片。若沒有 Gravatar 圖片，Heym 會顯示您名稱的第一個字母。

該圖片由 Heym 伺服器擷取並快取於伺服器端，因此您的瀏覽器永遠不會連線至 Gravatar。若伺服器無法連線至 Gravatar，所有人將持續看到姓名縮寫。

### 名稱

顯示於整個應用程式中的您的顯示名稱。此欄位為必填，不可留空。

### User Rules

User Rules 是自動注入至每個 AI 請求的自訂指示——無論是在 workflow builder 或 dashboard chat 中皆然。在 **workflow builder**（[AI Assistant](./ai-assistant.md)）中，它們會附加至用於產生 workflow JSON 的 system prompt。在 **dashboard chat** 中，它們會作為 system 層級的 context 套用。您只需撰寫一次，即可全域套用，無須在每個 prompt 中重複。

**常見用途：**

- 語言或語氣：`Always respond in English. Keep responses concise.`
- 程式碼風格：`Use async/await patterns. Prefer TypeScript interfaces over types.`
- Workflow 慣例：`Include error handling in all workflows. Use descriptive node labels.`
- 回應格式：`Use bullet points. Avoid lengthy explanations.`

**適用範圍：**

| Context | 說明 |
|---------|-------------|
| **Workflow builder** | [AI Assistant](./ai-assistant.md) 用於產生或修改 workflow 的請求 |
| **Dashboard chat** | 所有 [Chat 分頁](../tabs/chat-tab.md) 對話 |

User Rules 會在 system 層級注入——它們會在每個 prompt 之前自動執行，無須針對每個 workflow 或對話進行額外設定。

### 儲存 Profile 變更

點擊 **Save Changes** 以套用。變更會立即對所有新的 AI 請求生效。

## Security 分頁

### 變更密碼

使用 Security 分頁更新您的帳號密碼。

**要求：**

| 規則 | 要求 |
|------|-------------|
| 最小長度 | 8 個字元 |
| 大寫字母 | 至少一個大寫字母（A–Z） |
| 小寫字母 | 至少一個小寫字母（a–z） |
| 數字 | 至少一個數字（0–9） |

密碼也必須與您目前的密碼不同。這些規則會在前端與後端同時強制執行。

**步驟：**

1. 輸入您的 **Current Password**
2. 輸入您的 **New Password**（必須符合上述所有要求）
3. 在 **Confirm New Password** 中再次輸入
4. 點擊 **Update Password**

若目前密碼不正確，會顯示行內錯誤訊息。成功時會顯示確認訊息，且表單會自動重設。

## Voice 分頁

Voice 分頁可為 [Chat 分頁](../tabs/chat-tab.md) 設定語音：選擇一個 **ElevenLabs 認證**（或直接新增一個）、從您的 ElevenLabs 帳號中選擇一個 **Voice**，然後點擊 **Save Voice Settings**。這會啟用逐訊息朗讀與互動語音模式。完整流程請參閱 [Chat Voice (TTS & STT)](./chat-voice.md)。

## AI Defaults 分頁

AI Defaults 分頁包含兩個區段。

### 偏好的認證與模型

選擇一個**偏好的 LLM 認證**以及其中的一個**模型**。這會成為應用程式中每個 AI 功能的起始預設值——包括 chat、[AI Assistant](./ai-assistant.md)（builder、analyzer 與 workflow 建立）、board mapper、AI dashboard widgets、[docs chat](../tabs/chat-tab.md)、data-table AI schema helper、expression builder 與 evals——只要該介面本身沒有已儲存的選擇時即適用。

每個介面遵循的選擇規則如下：

1. **已儲存的選擇**——您在該介面上已做出的選擇（例如某個 chat 對話最後使用的模型）永遠優先。
2. **偏好設定**——在沒有已儲存選擇時使用。
3. **第一個可用的認證**——當您未設定偏好時的備援選項。

您仍可隨時針對各介面變更認證與模型；偏好設定僅用於填入初始預設值。將認證保留為 **No preference** 即可維持先前的「第一個認證」行為。若您偏好的認證之後被刪除或取消分享，該分頁會顯示通知，且各介面會靜默退回至第一個可用的認證。

### Coding package usage

對於每個 **Codex** 認證（包含共用認證），此頁籤會以水平長條圖顯示每個作用中視窗的剩餘速率限制用量——例如 **5 hours** 視窗及/或 **Weekly** 視窗，視您的方案而定。每個長條圖會顯示剩餘配額的百分比以及重置倒數計時。**Refresh** 按鈕可依需求重新擷取（結果會在伺服器上短暫快取）。

對於每個 **OpenCode** 認證，此頁籤會以相同樣式的長條圖顯示 OpenCode Go 訂閱視窗——**5 hours**、**Weekly** 與 **Monthly**——並使用該認證的 API key 從閘道已驗證的用量 Endpoint 讀取。已達上限的視窗會以琥珀色顯示 **"limit reached"**。若 key 無效或該 workspace 沒有 Go 訂閱，卡片會說明原因，而不顯示長條圖。

## Observability Tab

Observability 頁籤會顯示此執行個體的 [OpenTelemetry Tracing](./opentelemetry.md) 唯讀狀態：tracing 是否已啟用、OTLP endpoint、服務名稱、取樣器比例，以及會發出哪些 span。Tracing 是透過後端的 `HEYM_OTEL_*` 環境變數進行配置，因此此頁籤不會編輯任何內容。當 tracing 停用時，此頁籤會列出啟用所需的環境變數。諸如 OTLP 認證標頭之類的機密資訊永遠不會顯示於此。完整配置參考請參閱 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)。

## SSO Tab

僅對執行個體管理員可見——即列於 `HEYM_ADMIN_EMAILS` 中的帳號。此頁籤會將 Heym 連接至外部 OpenID Connect 提供者，讓人們使用既有帳號登入。輸入 issuer URL 與 client 認證、將唯讀的 redirect URI 複製到您的提供者，並在啟用前執行 **Test connection**。測試通過後，即可由此處關閉密碼登入。完整設定請參閱 [Single Sign-On](./sso.md)。

## Instances Tab

僅對執行個體管理員可見——即列於 `HEYM_ADMIN_EMAILS` 中的帳號。此頁籤會列出連接至此資料庫的 Heym 執行個體，並設定背景執行如何在它們之間分配。每一列會顯示該執行個體可編輯的名稱、其角色、是否運作中、其對資料庫的實測延遲、開/關切換，以及其權重。權重是目前可承接工作的執行個體之間的份額，而非 100 的百分比：以 `41 / 26 / 33` 且第三個執行個體關閉為例，前兩個實際分別接收 61% 與 39%。面板會在表格下方印出該有效分配，且僅在沒有任何已啟用執行個體設定權重時才拒絕儲存。

**Give new instances a share automatically** 預設為開啟：新加入的執行個體否則會停留在權重 0 且接收不到任何工作，因此 leader 會給予它一次均等份額，並將現有權重按比例調降，同時維持其比例。它永遠不會更動您自行設定權重的執行個體。

面板也會回報過去 24 小時的執行中有多少只能在主執行個體上執行。當該比例偏高時，其下方的權重無法移動那些工作。關於哪些工作會留在 main 以及如何選擇數值，請參閱 [Load Distribution](./cluster.md)。

## What Is Not in This Dialog

| Feature | Where to Find It |
|---------|-----------------|
| **API key management (MCP)** | [MCP Tab](../tabs/mcp-tab.md) – 檢視、複製及重新產生您的 MCP server API key |
| **Theme (dark / light)** | 標頭中的 Sun/Moon 切換按鈕（位於使用者徽章旁） |
| **Email change** | 目前不支援 |

## Related

- [AI Assistant](./ai-assistant.md) – 使用 User Rules 的 Workflow builder 聊天
- [Chat Tab](../tabs/chat-tab.md) – 使用 User Rules 的 Dashboard 聊天
- [Chat Voice (TTS & STT)](./chat-voice.md) – 於 Voice 頁籤中配置的 ElevenLabs 語音
- [MCP Tab](../tabs/mcp-tab.md) – MCP server API key 與 workflow 工具暴露
- [Credentials Tab](../tabs/credentials-tab.md) – 供 AI 節點與整合使用的 API key
- [Security](./security.md) – Session 管理、速率限制、認證加密
- [Single Sign-On](./sso.md) – 連接外部 OpenID Connect 提供者
- [OpenTelemetry Tracing](./opentelemetry.md) – 用於 workflow 與節點執行的分散式追蹤
