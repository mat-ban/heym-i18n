# 下載與匯入

將 Workflow 或整個資料夾匯出為檔案，或透過拖放方式匯入。可用於備份、分享，或在不同執行個體之間遷移 Workflow。

## 下載 Workflow（JSON）

**位置：** 編輯器工具列 → **Download** 按鈕（在大螢幕上可見）

**匯出內容：**
- `nodes` – 畫布上的所有節點
- `edges` – 節點之間的所有連接

**檔案名稱：** `{workflow-name}.json`（取自 Workflow 名稱）

**格式：** 請參閱 [Workflow Structure](./workflow-structure.md) 了解 JSON schema。

## 下載資料夾（ZIP）

**位置：** 儀表板 → Workflows 分頁 → 資料夾三點選單 → **Download as ZIP**

**匯出內容：**
- 資料夾及其所有子資料夾中的所有 Workflow，以遞迴方式匯出
- 資料夾階層結構以目錄形式保留於 ZIP 內

**ZIP 結構：**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

每個 `.json` 檔案包含 `{ name, nodes, edges }`。

## 匯入

### 從儀表板（Workflows 分頁）

1. 前往 [Workflows](../tabs/workflows-tab.md) 分頁
2. 將 **JSON** 或 **ZIP** 檔案拖放至 Workflow 區域

**JSON 檔案：** 建立一個新的 Workflow。Workflow 名稱取自 JSON 中的 `name` 欄位；若缺少 `name`，則使用檔案名稱。

**ZIP 檔案：** 整個資料夾結構會於根層級重新建立。ZIP 內的每個 `.json` 檔案會成為一個 Workflow，並放置於對應的資料夾中。目前執行個體中不存在的 Credential 與跨 Workflow 參照會自動清除。若有部分 Workflow 匯入失敗，會顯示摘要說明成功匯入的數量。

### 從畫布（編輯器）

1. 在編輯器中開啟一個 Workflow
2. 將 JSON 檔案拖放至畫布上
3. 若畫布上已有節點或連接，會顯示確認對話框，詢問是否取代目前的 Workflow
4. 匯入的節點與連接會取代或合併至目前的 Workflow

## 檔案格式

### JSON（單一 Workflow）

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – 必填；節點物件的陣列
- `edges` – 選填；連接物件的陣列（預設為 `[]`）
- `name` – 選填；從儀表板匯入並建立新 Workflow 時使用

### ZIP（資料夾）

ZIP 封存檔，其目錄結構對應資料夾階層。每個檔案皆為一個 Workflow JSON（見上述說明）。資料夾與 Workflow 名稱分別取自目錄名稱與檔案名稱。

節點與連接的格式請參閱 [Workflow Structure](./workflow-structure.md)。

## 使用情境

- **備份** – 在進行重大變更前下載 Workflow 或整個資料夾
- **分享** – 匯出 JSON 檔案並與團隊成員分享
- **遷移** – 在不同 Heym 執行個體之間移動 Workflow 或資料夾結構
- **版本控制** – 將 Workflow JSON 與程式碼一同存放於 Git

## 相關內容

- [Workflow Structure](./workflow-structure.md) – 節點與連接的 JSON 格式
- [Workflows Tab](../tabs/workflows-tab.md) – 建立 Workflow 並透過拖放匯入
- [Workflow Organization](./workflow-organization.md) – 資料夾與子資料夾
- [Canvas Features](./canvas-features.md) – 編輯器功能，包含畫布匯入
