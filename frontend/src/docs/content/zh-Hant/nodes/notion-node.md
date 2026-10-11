# Notion

**Notion** 節點透過 Notion API 管理資料庫、資料來源、頁面與區塊。

## 概覽

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| Credential | 內部整合 Token 或 Notion OAuth |
| API 版本 | `2026-03-11` |

Notion 資料庫類型的集合在目前的 API 版本中使用 **data source ID**。在執行此節點之前，請先將
Workflow 所需的每個頁面或資料來源分享給整合。資源欄位可接受原始 Notion ID 或完整的 Notion
URL。URL 會在發出 API 請求前正規化為其內嵌的資源 ID。

## 操作

| 操作 | 必填欄位 | 主要輸出 |
|-----------|-----------------|-------------|
| Search | 選填的 query/filter/sort | `.results`、`.count`、`.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID 或 Parent Page ID、Properties | `.page`、`.id`、`.url` |
| Update Page | Page ID、Properties/Icon/Cover 其中之一 | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | 包含 `parent` 的 Database request | `.database`、`.id`、`.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID、非空的 database request | `.database`、`.id`、`.url` |
| Create Data Source | 包含 `parent` 與非空 `properties` 的 data source request | `.data_source`、`.id`、`.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID、非空的 data source request | `.data_source`、`.id`、`.url` |
| Query Data Source | Data Source ID | `.results`、`.count`、`.next_cursor` |
| Get Block Children | Block 或 Page ID | `.results`、`.count`、`.next_cursor` |
| Update Block | Block ID、block update 物件 | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block 或 Page ID、Children | `.results`、`.count` |

所有操作也會回傳 `.success` 與 `.operation`。

## JSON 欄位

Database Request、Data Source Request、Properties、Children、Filter、Sort、Sorts、Icon 與 Cover 欄位
接受 Notion API JSON。JSON 字串內的表達式會在請求前解析。欄位也可以是單一獨立表達式，直接解析為
所需的物件或陣列，例如 `$input.database`、`$input.properties` 或 `$input.children`。

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

若為頁面或區塊內容，Children 是 Notion 區塊物件的陣列：

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## 資料庫與資料來源

在目前的 Notion API 中，**database** 是容器，而 **data source** 則存放屬性結構定義與可查詢的資料列。
Retrieve Database 會回傳資料庫的 `data_sources` 清單；請使用其中一個 ID 搭配 Retrieve Data Source
或 Query Data Source。

Create Database 接受來自 Notion 的 Create a database Endpoint 的完整請求物件。它必須包含 `parent`，
並可包含 `title`、`description`、`is_inline`、`initial_data_source`、`icon` 與 `cover`。例如：

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database 接受 update Endpoint 的請求物件，包括 `parent`、`title`、`description`、`is_inline`、
`icon`、`cover`、`in_trash` 與 `is_locked`。Database ID 欄位可接受原始 ID、完整 Notion URL 或表達式。

在建構 Create Page 的 properties 物件之前，請使用 **Retrieve Data Source** 取得資料來源的
`properties` 結構定義。**Create Data Source** 需要父資料庫物件與非空的 `properties` 結構定義。
**Update Data Source** 接受對應 Notion Endpoint 所支援的非空請求物件。

例如，在現有資料庫內建立資料來源：

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Data Source 與 Parent Page 選擇器支援伺服器端搜尋，具備短暫的防抖（debounce）與基於游標的
**Load more** 分頁。在 Notion 中分享新資源後，請使用 **Refresh**。切換至 **Use expression** 以輸入
表達式、原始 ID 或 URL。

來自較舊教學、使用 `{"property":"object","value":"database"}` 的 Search 篩選條件會轉譯為目前的
`data_source` 值。新的 Workflow 應直接使用 `data_source` 或 `page`。

Append Blocks 支援 **Start**、**End** 與 **After Block** 位置。Create Page 與 Append Blocks 會自動將
超過 100 個頂層子項拆分為有序的請求，以符合 Notion 的每請求限制。

受到速率限制的請求（`429` 或 `529`）最多重試三次。Heym 會遵循 Notion 的 `Retry-After` 標頭，將每次
等待上限設為 10 秒，並加入隨機抖動（jitter）。Notion 請求會跨頁面與 Workflow 節點共用一個
process-wide 的 HTTP 連線池。
## Notion API 限制

- 單一 rich-text `text.content` 值最多可包含 2,000 個字元。請將較長文字拆分為多個 rich-text 物件。
- Notion 限制每次請求的頂層 block children 數量為 100 個。Heym 會將較大的 Children 陣列分批處理，但每個個別 block 仍須符合 Notion 的 payload 限制。
- API 在單次請求中最多接受兩層巢狀 block children。若要建立更深層的結構，請透過後續的 Append Blocks 操作完成。
- 請求 payload 限制為 1,000 個 block 元素，且總大小不得超過 500 KB。

## 分頁

Search、Query Data Source 與 Get Block Children 接受 1 至 100 的 page size，以及選用的 start cursor。將 page size 設為 `0` 可自動跟隨 cursor 並合併所有結果，最多可達節點的 10,000 筆結果安全上限。

## 認證設定

在認證對話框中選擇下列任一種設定方式（**Internal token** 或 **OAuth**）：

- **Internal token：** 建立內部整合，將其 token 複製到 Heym，然後將每個所需的頁面或資料來源分享給該整合。使用 **Test Connection** 驗證存取權限。
- **OAuth：** 建立公開的 Notion 整合，並在 Notion 中註冊 `{FRONTEND_URL}/api/credentials/notion/oauth/callback`。在 Heym 認證對話框中選擇 **OAuth**，輸入整合的 Client ID 與 Client Secret，然後點擊 **Connect** 授權工作區。該 secret 會以加密方式與認證一同儲存，且不會放入 OAuth state 或環境設定中。授權完成後，認證會顯示已連線的工作區名稱（`connected (Workspace Name)`）。待處理的 OAuth 認證會顯示 `Not connected`。

在編輯時將 internal token 欄位留空，會保留已儲存的 token。

對於自訂的 [HTTP](../nodes/http-node.md) 請求，`$credentials.YourNotionCredential` 會解析為與 Notion 節點所使用的相同 bearer token（internal token 或 OAuth access token）。

## API 版本注意事項

Heym 將 Notion 請求固定使用 API 版本 `2026-03-11`。此版本使用：

- `data_source_id` 父項與 `/data_sources` endpoint，而非舊版的 database-query 路徑
- 以 `in_trash` 取代 `archived` 來執行頁面垃圾桶/還原操作
- 以 `position` 物件（`start`、`end`、`after_block`）執行 Append Block Children

遷移較舊的 Notion 自動化範例時：

- 將 database 父項/查詢參照替換為來自 **Retrieve Database** 或編輯器資料來源選擇器的 data source ID
- 將 `archived: true` 替換為 `in_trash: true`
- 將 append 的 `after` 參數替換為節點的 **Append Position** 欄位

仍使用物件值 `database` 的搜尋篩選條件會自動正規化為 `data_source`。

## 相關內容

- [認證](../reference/credentials.md)
- [第三方整合](../reference/integrations.md)
- [節點類型](../reference/node-types.md)
