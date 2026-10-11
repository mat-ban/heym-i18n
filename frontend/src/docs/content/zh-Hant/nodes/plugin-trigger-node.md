# Plugin Trigger

**Plugin Trigger** 節點是 [Plugin 節點](./plugin-node.md) 的 Trigger 類型對應版本。它由已安裝的外掛提供，該外掛的 `kind` 為 `trigger`，並產生 Workflow 啟動時所需的初始資料。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.<keys returned by the plugin>` |

Trigger 外掛可代表任何來源——不同的應用程式、第三方服務或其他技術——只要該外掛的處理常式回傳 Workflow 應起始的資料即可。

## 使用時機

當已安裝的外掛定義了可啟動 Workflow 的 Trigger 時，請使用 Plugin Trigger 節點。若外掛是在 Workflow 執行過程中執行動作，請改用 [Plugin 節點](./plugin-node.md)。

## 設定

與 Plugin 節點相同，設定表單是根據外掛的 manifest 欄位所產生。非機密的字串欄位使用表達式輸入，機密欄位則會遮蔽。

## 外掛的執行方式

外掛程式碼為受信任的程式碼（由 Heym 提供、由操作人員安裝），並在行程內執行。安裝權限僅限於 `HEYM_PLUGIN_ADMIN_EMAILS`，且此子系統受 `HEYM_PLUGINS_ENABLED` 控制。請參閱[執行與部署](../getting-started/running-and-deployment.md)。

## 撰寫外掛

若要建置 Trigger 外掛套件，請參閱[外掛撰寫](../reference/plugin-authoring.md)，以了解 zip 結構、manifest 欄位、處理常式簽章、圖示、相依性及執行時期信任模型。
