# 檔案分析

檔案分析讓 Chat、[Agent 節點](../nodes/agent-node.md) 與 [Code 節點](../nodes/code-node.md) 能夠在隔離的 Python 沙箱中開啟並分析來自 [Drive](./drive.md) 的大型檔案。PDF、試算表、CSV、DOCX 與 JSON 檔案會先進行檢查，隨後依需求選讀，因此 200 頁的合約或一百萬列的工作簿永遠無需完整納入模型的上下文之中。

## 運作方式

每次呼叫均在沒有網路存取權限的全新容器中執行。所需檔案以唯讀方式複製入內，代碼執行完成後容器即被銷毀。同一個工作階段的多次呼叫之間會保留一個小型工作資料夾，使後續步驟能夠依據前一步驟儲存的結果繼續運作。

| 路徑 | 內容 |
|------|--------|
| `/input` | 本工作階段的 Drive 檔案，唯讀 |
| `/work` | 工作階段期間持續保留的工作空間，例如 `/work/sales.pkl` |
| `/work/out` | 寫入此處的檔案將在呼叫完成後儲存至 Drive，並以連結形式回傳 |

沙箱已預先安裝 pandas、openpyxl、xlrd、pdfplumber、pypdf、python-docx 與 langdetect，以及 [轉換器節點](../nodes/converter-node.md) 所使用的 Tesseract OCR。

## 工具

模型可搭配三個工具使用，並在 Chat 中提供第四個工具：

| 工具 | 功能 |
|------|----------|
| `list_files` | 列出您可以開啟的 Drive 檔案：名稱、類型、大小、日期 |
| `inspect_file` | 回傳檔案類型、中繼資料與結構，並附帶簡短範例 |
| `run_python` | 在指定檔案上執行 Python 並回傳主控台輸出 |
| `clear_workspace` | 僅限 Chat：刪除對話的工作資料夾 |

`inspect_file` 僅讀取製作摘要所需之內容：

| 類型 | 摘要內容 |
|-----|-----------------|
| PDF | 頁數、標題與作者、文字是否可擷取、語言、頁面大小、首頁文字與表格。掃描的 PDF 透過 OCR 讀取（每次呼叫最多 5 頁） |
| XLSX / XLS | 包含列數與欄數的工作表、標題列、類型、就緒的 pandas `read_hint`、具名範圍、前幾列 |
| CSV / TSV | 編碼、分隔符號、列數、含類型的欄位、前幾列 |
| DOCX | 標題大綱、表格、字數與字元數、作者與日期 |
| JSON | 根類型、索引鍵、陣列長度、巢狀深度、範例記錄 |

在 `run_python` 內部，使用 `heym_files` 模組開啟檔案：

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## 在 Chat 中

在 [Chat 標籤頁](../tabs/chat-tab.md)、Heym Work Chat 或透過 MCP 工具 `heym_chat` 附加 PDF、試算表、DOCX、CSV 或 JSON 檔案、圖片（PNG、JPG、GIF、WebP）或純文字檔案。一則訊息最多可夾帶 10 個檔案。每個檔案皆儲存於您的 Drive 中；訊息中僅包含其名稱與 ID。Chat 會檢查檔案，讀取解答問題所需之部分，並以表格或摘要回答。

## 在工作流程中

執行過程僅開啟專屬檔案：透過 [檔案上傳 Trigger](../nodes/file-upload-trigger-node.md) 上傳的檔案、節點寫入 Drive 的檔案，以及 [Drive 節點](../nodes/drive-node.md) 在同一執行中透過 **Get** 步驟取得的檔案。

- **Agent 節點**：當 agent 的輸入或訊息夾帶檔案時，將自動取得上述工具以操作該檔案。
- **Code 節點**：將 **Files** 設定為運算式，例如 `$Upload.file.id`。檔案將會掛載並於 `params.files` 中列出。

## 限制

| 限制 | 限制值 |
|-----------|------|
| 每次呼叫記憶體 | 2 GB |
| 每次呼叫時間 | 120 秒 |
| 每個工作階段工作資料夾 | 2 GB |
| 每次呼叫輸出檔案 | 20 個，每個最大 100 MB |
| 回傳給模型的輸出文字 | 20,000 個字元 |
| 每次呼叫檔案數 | 20 個 |

## 安全性

- 沙箱未連接網路，無法存取 Heym 的設定或機密，並以非特殊權限使用者身分執行。
- 檔案僅於沙箱內部進行剖析。
- 在 Chat 中，存取權限依循 Drive：您開啟自己擁有的檔案及與團隊共用的檔案。
- 在 Chat 中開啟檔案會記錄於稽核日誌中。
- 檔案內容嚴格視為純資料；檔案內部包含的指令將不會被執行。

## 系統需求

檔案分析需要在 Heym 執行個體上設置沙箱後端（Docker 或 [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)）。

## 相關內容

- [Drive](./drive.md)
- [Code 節點](../nodes/code-node.md)
- [Agent 節點](../nodes/agent-node.md)
- [Chat 標籤頁](../tabs/chat-tab.md)
