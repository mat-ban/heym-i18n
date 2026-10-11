# Plugin

**Plugin** 節點會執行已安裝外掛所提供的自訂動作。外掛能為 Heym 擴充新的節點類型——動作、第三方整合，或任何能以 Python 表達的內容——而無需修改核心應用程式。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.<keys returned by the plugin>` |

一個外掛**套件**（單一 zip 檔）可包含**多個節點**——動作與 Trigger 的任何組合皆可。每個節點會以其自身的名稱與說明，出現在面板的 **Plugins** 分類下。將其中一個節點拖曳至畫布上，即會建立一個繫結至該套件（`pluginId`）與節點（`pluginNodeKey`）的 Plugin 節點。

## 使用時機

當操作人員已安裝能執行您所需動作的外掛時，請使用 Plugin 節點——例如呼叫私有 API、與內部系統通訊，或執行專為您的部署所撰寫的客製化邏輯。

若為用於啟動 Workflow 的 Trigger 類型外掛，請參閱
[Plugin Trigger 節點](./plugin-trigger-node.md)。

## 設定

此節點的設定表單會依據外掛的 manifest 自動產生。外掛所宣告的每個欄位（`string`、`number`、`boolean` 或 `select`）都會自動呈現。非機密的字串欄位會使用表達式輸入，而開頭為 `$` 的已儲存字串設定值，會在外掛處理常式執行前先行解析。

機密欄位（例如 API 金鑰）在 UI 中會以遮罩顯示，且絕不會寫入日誌。

## 外掛的執行方式

外掛由 Heym 提供並由操作人員安裝，因此外掛程式碼屬於**受信任**的內容，會像內建節點一樣在行程內執行，並具備完整的網路與函式庫存取權限。外掛可宣告 pip `dependencies`，於安裝時安裝至執行個體中。

安裝與移除外掛僅限於電子郵件列於 `HEYM_PLUGIN_ADMIN_EMAILS` 中的操作人員，且整個子系統受 `HEYM_PLUGINS_ENABLED` 控管（預設為停用）。環境變數相關說明請參閱
[執行與部署](../getting-started/running-and-deployment.md)。

## 自訂圖示

外掛可提供自訂 SVG 標誌。將 `icon.svg` 置於套件根目錄，即可為所有節點設定預設圖示，並且／或於 manifest 中為節點指定專屬的 `"icon": "<file>.svg"`。圖示會同時顯示於面板卡片與畫布節點上；未設定圖示的節點則會退回使用預設的拼圖圖示。

## AI Builder

已安裝的外掛會呈現給 AI 助理與聊天畫布，因此您可以要求 Heym「使用 Acme CRM 外掛建立一筆記錄」，它便會產生帶有正確 `pluginId` 與 `config` 的 Plugin 節點。

## 撰寫外掛

若要建置外掛套件，請參閱
[外掛撰寫](../reference/plugin-authoring.md)，以瞭解 zip 結構、manifest 欄位、處理常式簽章、圖示、相依性，以及執行階段信任模型。
