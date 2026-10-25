# 鍵盤快速鍵

Heym 在 Workflow 編輯器與畫布中提供鍵盤快速鍵，以加速常見操作。

## 全域編輯器快速鍵

這些快速鍵在 Workflow 編輯器的任何位置皆可使用。

| 快速鍵 | 動作 |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | 開啟 Command Palette |
| `Ctrl + I` / `Cmd + I` | 切換 [AI Assistant](./ai-assistant.md) 面板（輸入時亦可使用） |
| `Ctrl + Enter` / `Cmd + Enter` | 執行目前的 Workflow |
| `Ctrl + S` / `Cmd + S` | 儲存 Workflow |
| `Ctrl + Z` / `Cmd + Z` | 復原 |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | 重做 |
| `Ctrl + Y` / `Cmd + Y` | 重做（替代鍵） |
| `Escape` | 關閉開啟的覆蓋層、對話框與面板 |

## 畫布快速鍵

這些快速鍵適用於畫布取得焦點時（未在文字輸入狀態下）。

### 選取與導覽

| 快速鍵 | 動作 |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | 選取所有節點 |
| `Shift`（按住） | 拖曳以選取多個節點 |
| `Ctrl` / `Cmd`（按住） | 點擊以將個別節點加入選取範圍 |
| `Escape` | 取消選取所有節點；關閉內嵌節點搜尋 |

### 編輯節點

| 快速鍵 | 動作 |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | 複製選取的節點 |
| `Ctrl + X` / `Cmd + X` | 剪下選取的節點 |
| `Ctrl + V` / `Cmd + V` | 貼上節點 |
| `Delete` 或 `Backspace` | 刪除選取的節點及／或邊 |
| `D` | 切換選取節點的啟用／停用狀態 |
| `P` | 切換選取節點的釘選資料 |

### 內嵌節點搜尋

在畫布上輸入任何可列印字元時（未聚焦於文字輸入框），會開啟內嵌節點搜尋彈出視窗。輸入的字元會成為搜尋查詢的第一個字元。

| 快速鍵 | 動作 |
|----------|--------|
| 任何可列印字元 | 開啟內嵌節點搜尋並開始輸入 |
| `Backspace` | 移除搜尋查詢的最後一個字元 |
| `Escape` | 關閉內嵌節點搜尋 |

## Command Palette（`Ctrl + K`）

Command Palette 可從編輯器、儀表板、文件與 evals 檢視中使用。它讓您無需離開鍵盤即可快速導覽至 Workflow、分頁與文件頁面。

| 快速鍵 | 動作 |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | 開啟 Command Palette |
| `↑` / `↓` | 在結果清單中導覽 |
| `Tab` / `Shift + Tab` | 在結果清單中導覽 |
| `Enter` | 開啟選取的項目 |
| `Escape` | 關閉 Command Palette |

## 儀表板快速鍵

這些快速鍵在 Workflows 分頁中且未在其他文字輸入狀態下時可使用。

| 快速鍵 | 動作 |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | 聚焦 Workflow 搜尋 |
| `Escape` | 當 Workflow 搜尋有文字時清除搜尋內容 |

## 屬性面板快速鍵

這些快速鍵在選取節點且屬性面板開啟時可使用。

| 快速鍵 | 動作 |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | 在新分頁中開啟連結的子 Workflow（僅限 Execute 節點） |

## Evaluate 對話框快速鍵

這些快速鍵在 Evaluate 對話框開啟時可使用。

| 快速鍵 | 動作 |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | 套用表達式並關閉對話框 |
| `Ctrl + Z` / `Cmd + Z` | 復原表達式編輯器中的變更 |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | 重做表達式編輯器中的變更 |
| `Ctrl + Y` / `Cmd + Y` | 重做表達式編輯器中的變更（替代鍵） |

## 歷史記錄與 Trace 快速鍵

這些快速鍵可在 Execution History 對話框與 Traces 面板中使用。

| 快速鍵 | 動作 |
|----------|--------|
| `S` | 切換搜尋輸入以篩選項目 |

## 相關內容

- [畫布功能](./canvas-features.md) – 資料釘選、啟用／停用、擷取為子 Workflow
- [Workflow 結構](./workflow-structure.md) – 節點與邊格式
- [Execute 節點](../nodes/execute-node.md) – 呼叫子 Workflow（`Ctrl + Shift + O`）
- [快速開始](../getting-started/quick-start.md) – 建立您的第一個 Workflow

- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
