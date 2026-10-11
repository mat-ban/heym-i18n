# Playwright

**Playwright** 節點可透過可設定的步驟自動化瀏覽器互動。適用於網頁擷取、表單填寫，以及以瀏覽器為基礎的 Workflow。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.results`、`$nodeLabel.screenshot`，以及選用的網路/瀏覽器資料 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"`（預設）或 `"code"`（Run Code）。請在 Properties Panel 的 Mode 下拉式選單中選擇 |
| `playwrightSteps` | array | 步驟：navigate、click、type、aiStep 等。每個步驟都有 action 與 selector/params。`disabled: true` 會將步驟保留在清單中，但在執行時略過 |
| `playwrightCode` | string | 當 Mode 為 Run Code 時所使用的自訂 Playwright Python。於強化的沙箱中執行，且**預設為停用**——請參閱下方的安全性說明 |
| `playwrightHeadless` | boolean | 以 headless 模式執行（預設：true） |
| `playwrightStealth` | boolean | 選擇性啟用的 Steps 模式設定，可減少常見的 Playwright 自動化訊號（預設：false）。Properties Panel 標籤：Reduce automation flags |
| `playwrightTimeout` | number | 逾時時間，單位為毫秒（預設：30000） |
| `playwrightCaptureNetwork` | boolean | 擷取 JSON 回應、headers、cookies 及瀏覽器儲存空間 |
| `playwrightAuthEnabled` | boolean | 在執行步驟前，從 cookies/storageState 還原瀏覽器驗證狀態 |
| `playwrightAuthStateExpression` | string | 可解析為 Playwright `storageState` 或原始 `cookies[]` 的運算式或 JSON |
| `playwrightAuthCheckSelector` | string | 驗證啟動後必須可見的 selector |
| `playwrightAuthCheckTimeout` | number | 已驗證 selector 檢查的逾時時間，單位為毫秒（預設：5000） |
| `playwrightAuthFallbackSteps` | array | 當 cookie 還原無法通過頁面驗證時，所執行的僅限登入的備援步驟 |

## 步驟類型

- **navigate** – 前往 URL
- **refresh** – 重新載入目前頁面（選用的步驟 `timeout`，單位為毫秒，用於重新載入導覽）
- **click** – 依 selector 點擊元素
- **type** – 將文字輸入至輸入欄位（逐字元輸入）
- **fill** – 填入輸入值
- **wait** – 等待逾時（毫秒）
- **screenshot** – 擷取螢幕截圖（`outputKey` 會將 base64 儲存於 results 中）
- **getText** – 元素的文字內容（`selector`、選用的 `outputKey`）
- **getAttribute** – 屬性值（`selector`、`attribute`、選用的 `outputKey`）
- **getHTML** – 元素的外部 HTML（`selector`、選用的 `outputKey`）
- **getVisibleTextOnPage** – 以 `document.body.innerText` 取得整頁的可見文字（無 selector；請使用 `outputKey`；選用的步驟 `timeout`，單位為毫秒，會在擷取前等待）
- **hover** – 將滑鼠游標停留在元素上
- **selectOption** – 在 `<select>` 中選取選項
- **scrollDown** / **scrollUp** – 滑鼠滾輪捲動（選用的 `amount`，單位為像素）
- **aiStep** – LLM 會傳回與手動步驟相同類型的動作（請參閱下方）；不支援巢狀 `aiStep`

## 關閉步驟

每個步驟的標頭都有電源切換開關。關閉的步驟會以刪節線與淡化樣式顯示其標題，並保留在清單中及其所有欄位，且在節點執行時略過——這對於在不刪除既有工作的情況下隔離失敗的 selector 很有用。儲存的步驟會帶有 `disabled: true`；沒有此旗標的步驟則會正常執行。

已停用的步驟對節點的其他部分而言是不可見的：它們不會滿足驗證啟動的「第一個步驟必須是 `navigate`」規則，已停用的 `aiStep` 不會發出 LLM 呼叫，而 `playwrightAuthFallbackSteps` 中已停用的項目也會被略過。若將所有步驟都關閉，執行會失敗並顯示訊息，要求您啟用其中一個步驟。

## AI Step

**aiStep** 動作會使用 LLM 分析頁面 HTML（以及選用的螢幕截圖），並依自然語言指示產生 Playwright 動作。API 接受與手動步驟相同的動作名稱（包括 `navigate`、`refresh`、`getText`、`getHTML`、`getAttribute`、`getVisibleTextOnPage`、`screenshot`、捲動等）。**Auto heal** 僅會針對 click、type、fill、hover 及 selectOption，以替代方案取代失敗的 selector 型步驟。

| 選項 | 說明 |
|--------|-------------|
| `instructions` | AI 應執行的動作（例如「Click the Login button」） |
| `credentialId` | LLM 認證（OpenAI、Google 或 Custom） |
| `model` | 來自所選 LLM 認證的可搜尋模型清單 |
| `saveStepsForFuture` | 快取產生的步驟以供後續執行使用（避免 LLM 呼叫） |
| `sendScreenshot` | 將螢幕截圖傳送給 LLM 以處理視覺元素 |
| `aiStepTimeout` | LLM 呼叫的逾時時間，單位為毫秒（預設 30000） |

### AI Auto Heal

**AI Auto Heal** 可讓 Workflow 對 DOM 變更具有韌性。當 selector 失敗兩次時（例如網站改版後），Heym 會呼叫 LLM 尋找替代的 locator——通常是 `role=button[name='Submit']` 或 `text=Exact text`，而非 CSS selector。

請在 AI step 屬性中啟用 **Auto heal mode**。若已儲存的步驟失敗：

1. Heym 會擷取目前的 HTML 與螢幕截圖
2. 將失敗的步驟 + 頁面內容傳送給 LLM
3. LLM 會傳回穩健的替代方案（以 role 為基礎的 locator、文字 locator，或備援 CSS）
4. 以新的 selector 重試

這可降低網站更新其標記或 class 名稱時的不穩定性。
## 減少自動化特徵旗標

當網站因為標準自動化訊號（user agent 中的 `HeadlessChrome`、`navigator.webdriver`、缺少 `window.chrome`）而將 Playwright 內建的 Chromium 視為機器人時，請啟用 **Reduce automation flags**（`playwrightStealth: true`）。

此選項僅適用於 **Steps** 模式。它會：

- 移除 Chromium 的 `--enable-automation` 旗標，並設定 `--disable-blink-features=AutomationControlled`
- 送出標準的 Chrome user agent（不含 `HeadlessChrome`）
- 還原 Playwright 預設留空的常見瀏覽器介面（`window.chrome`、plugins）
- 在有 GPU 可用時（本機 macOS/Windows），維持主機 GPU 渲染器不變。Linux/Docker 沒有 GPU；Chromium 的軟體渲染器字串會回報為典型的 Mali（ARM）或 Mesa（x86）GPU，而非 SwiftShader。

它不會隱藏工作階段是透過 Chrome DevTools Protocol 驅動的事實，也不是用來繞過網站安全性、CAPTCHA 或存取控制的方式。請將其用於你獲授權執行的工作流程——內部工具、你自己的網站，以及獲准的瀏覽器自動化。

Run Code 模式維持不變——自訂指令碼會自行啟動 Chromium。

## 網路擷取

啟用 `playwrightCaptureNetwork` 以在執行期間收集額外的除錯資料：

- `networkRequests` – 擷取的 JSON/API 回應
- `cookies` – 執行結束時的瀏覽器 cookies
- `localStorage` – 瀏覽器 `localStorage` 鍵值對
- `sessionStorage` – 瀏覽器 `sessionStorage` 鍵值對

當你需要在自動化流程結束後檢查隱藏的 API 呼叫、驗證狀態或瀏覽器端資料時，這會很有用。

## Cookie 啟動與登入備援

當你希望 Playwright 開啟已登入的頁面時，請啟用 `playwrightAuthEnabled`。

### 驗證狀態來源

將 `playwrightAuthStateExpression` 設為諸如 `$global.authState` 的表達式。其值可以是：

- Playwright 的 `storageState` 物件：`{"cookies": [...], "origins": [...]}`
- 原始的 `cookies[]` 陣列
- 包含上述任一結構的 JSON 字串

建議模式：

1. 執行一個啟用網路擷取或驗證啟動的 Playwright 節點
2. 將 `$playwrightNode.cookies` 或完整的驗證狀態物件儲存至[全域變數](../reference/global-variables.md)
3. 在後續的 Playwright 節點中透過 `$global.authState` 重複使用該變數

### 驗證檢查

第一個主要的 Playwright 步驟必須是 `navigate`。在該步驟載入後，Heym 會檢查 `playwrightAuthCheckSelector`。

- 若該 selector 可見，其餘主要步驟會正常繼續
- 若該 selector 不存在，Heym 會執行 `playwrightAuthFallbackSteps`
- 備援步驟完成後，Heym 會再次檢查同一個 selector
- 若該 selector 仍不存在，節點會以驗證啟動錯誤失敗

驗證失敗後，導覽由備援步驟負責。它們應讓瀏覽器停留在其餘主要流程所預期的已驗證頁面上。

## 輸出欄位

- `$playwrightNode.status` – 成功時為 `"ok"`
- `$playwrightNode.results` – 步驟輸出（getText、getHTML、getVisibleTextOnPage、getAttribute、screenshot 鍵等）
- `$playwrightNode.screenshot` – 當步驟儲存螢幕擷取畫面時的 Base64 螢幕擷取畫面
- `$playwrightNode.cookies` – 當啟用驗證啟動或網路擷取時的最終瀏覽器 cookies
- `$playwrightNode.networkRequests` – 擷取的網路回應（啟用時）
- `$playwrightNode.localStorage` – 瀏覽器本機儲存空間（啟用時）
- `$playwrightNode.sessionStorage` – 瀏覽器工作階段儲存空間（啟用時）

## 範例

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Run Code 模式

在 Properties Panel 中，將 **Mode** 設為 **Run Code**，以編輯 `playwrightCode` 而非視覺化步驟。驗證啟動僅適用於 Steps 模式。

範例（sandbox / Docker——Chromium 需要 `--no-sandbox`）：

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

Wrapper 會提供 `inputs`、`headless`、`timeout_ms` 與 `capture_network`。你可以在程式碼中嵌入 `$nodeLabel.field` 表達式；印出包含 `status` 與 `results` 的 JSON。
## 自訂程式碼安全性

`playwrightCode` 欄位會執行任意 Python 程式碼。由於這等同於程式碼執行，因此**預設為停用**，且啟用時會受到沙箱隔離：

- **預設為停用。** 除非操作人員設定 `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`，否則執行設有 `playwrightCode` 的節點會失敗並顯示明確的錯誤。此檢查於執行時進行，因此也涵蓋先前儲存的 Workflow 以及排程 / 子 Workflow 執行。
- **啟用時隔離執行。** 自訂程式碼不會在後端行程中執行，而是在經過強化的拋棄式同層容器中執行，該容器沒有 Docker socket、沒有後端 bind mount、環境中沒有後端機密、已捨棄 capabilities、啟用 `no-new-privileges`，並設有 CPU / 記憶體 / PID 限制。若 Docker 無法使用，執行會以失敗關閉（fail closed）。`HEYM_PLAYWRIGHT_SANDBOX=subprocess` 可選擇回到行程內路徑，僅供受信任或本機開發用途（並非安全邊界）。原生 `./run.sh` 在未設定 `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` 時預設為 `subprocess`。`./deploy.sh`（Compose）與 GHCR 單一映像檔會透過 `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`（退回至 `HEYM_CODEX_DOCKER_IMAGE`）解析同層執行器，並使用對應的 venv 路徑（`/app/.venv` 與 `/app/backend/.venv`）。
- **Chromium 注意事項。** 沙箱容器預設以 root 身分執行，而 Chromium 在沒有 `--no-sandbox` 的情況下會拒絕以 root 身分執行。啟動 Chromium 的自訂程式碼應傳入該參數，例如 `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`。以步驟為基礎（以及 stealth）的啟動也會傳入 `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`，使指紋辨識腳本無法對 `stun.l.google.com:19302` 開啟 STUN UDP。自訂的 `chromium.launch` 呼叫也應包含該旗標。

以步驟為基礎的 Playwright 節點（`playwrightSteps`）完全由 Heym 產生（無任意程式碼），不受上述所有事項影響，且隨時可用——建議優先使用。

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型總覽
- [Crawler 節點](./crawler-node.md) – 使用 FlareSolverr 進行更簡單的網頁擷取
- [Credentials 共用](../reference/credentials-sharing.md) – AI 步驟所用的 LLM credentials
