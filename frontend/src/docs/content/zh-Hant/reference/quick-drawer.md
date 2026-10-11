# Quick Drawer

**快速抽屜** 是 Workflow 的右側快速執行面板。它會出現在已驗證的頁面上，例如儀表板的 [Workflows 分頁](../tabs/workflows-tab.md)、Docs 與 Evals。

## 存取

- 點擊畫面右側邊緣固定的 **Quick / Workflows** Trigger
- 當 [情境展示](./contextual-showcase.md) 也可使用時，其 **Page Guide** Trigger 會位於 Quick Workflows 上方
- 抽屜會從右側開啟，並以細微的縮放效果將目前頁面往左推移
- 在行動裝置上，快速抽屜會隱藏
- 抽屜不會顯示在 Workflow 編輯器、登入/註冊、入口網站或 HITL 審查頁面上

## Workflow 搜尋

使用抽屜頂端的篩選欄位，依下列條件搜尋 Workflow：

- Workflow 名稱
- Workflow 描述

搜尋不分大小寫，並會立即更新清單。

## 釘選的 Workflow

釘選 Workflow 可將其保留在抽屜頂端。

- 釘選的 Workflow 會顯示在完整清單上方的專屬區段中
- 新釘選的項目會新增至頂端
- 釘選順序會透過瀏覽器儲存空間在重新載入後保留

## 執行 Workflow

選取一個 Workflow 以開啟其輸入表單。

- 輸入欄位會依抽屜順序垂直顯示
- 點擊 **Run Workflow** 以執行選取的 Workflow
- 點擊 **Stop Workflow** 以從抽屜取消正在執行的執行作業
- 沒有 Input 欄位的 Workflow 仍可直接執行

抽屜使用與其他 Heym 執行介面相同的 Workflow 執行 API，因此輸出與執行階段行為會保持一致。

從抽屜停止執行也會取消作用中的後端執行作業，包括該 Workflow 執行中任何進行中的 Playwright 瀏覽器工作。

## 進度與結果

開始執行後，抽屜會顯示：

- 節點開始與完成時的串流步驟進度
- 最終狀態：`success`、`error` 或 `pending`
- 精簡 JSON 面板中的最終輸出
- 標記為 `Quick Drawer` 的歷史紀錄項目

`pending` 表示 Workflow 正在等待後續動作，例如人工審查。

## 瀏覽器儲存空間

快速抽屜會將個人偏好設定儲存在 `localStorage` 中：

- 釘選的 Workflow ID
- 上次選取的 Workflow

在此版本中，抽屜**不會**保存輸入值。

## 範圍

快速抽屜刻意設計為輕量的執行介面。

- 包含：搜尋、釘選、選取、輸入、執行、進度、結果
- 排除：Workflow 建立、編輯、資料夾管理與畫布操作

## 相關內容

- [Workflows 分頁](../tabs/workflows-tab.md) – 主要 Workflow 清單、資料夾與管理
- [快速開始](../getting-started/quick-start.md) – 建立並執行你的第一個 Workflow
- [執行歷史](./execution-history.md) – 檢閱過去的執行紀錄
- [Webhooks](./webhooks.md) – 透過 HTTP 觸發 Workflow
- [情境展示](./contextual-showcase.md) – 補足快速抽屜的頁面層級指引列
