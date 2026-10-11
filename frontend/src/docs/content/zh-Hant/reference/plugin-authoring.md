# Plugin 開發

Heym 外掛是由操作人員安裝的可信賴 zip 套件。一個套件可以新增一個或多個自訂 action 或 trigger 節點，而無需變更核心應用程式。

## 套件配置

外掛 zip 必須在套件根目錄包含 `plugin.json`，以及由 `entry` 指定的 Python 進入點檔案（預設為 `handler.py`）。

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` 為選用項目，會作為外掛的文件頁面提供。將 `icon.svg` 放在套件根目錄可作為預設節點圖示，或在 `plugin.json` 中設定節點專屬的 `icon` 路徑。

## Manifest

當一個套件要公開多個節點時，請使用多節點的 `plugin.json`：

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

亦接受舊版單節點 manifest：省略 `nodes`，並於頂層提供 `kind`、`fields`、`dslHint` 與 `docSlug`。

## Manifest 欄位

| 欄位 | 備註 |
|-------|-------|
| `id` | 小寫套件 id，使用字母、數字與連字號。 |
| `name` | 人類可讀的套件名稱。 |
| `version` | 用於顯示與 handler 快取的套件版本。 |
| `description` | 顯示於 UI 與助理情境中的簡短描述。 |
| `entry` | zip 內的 Python handler 檔案路徑；預設為 `handler.py`。 |
| `dependencies` | 選用的 pip 需求，會以 `uv pip install` 安裝。 |
| `nodes` | 此套件公開的自訂節點。 |

每個節點需要唯一的 `key`、一個 `name`，以及 `action` 或 `trigger` 的 `kind`。若省略 `function`，action 會呼叫 `run`，trigger 會呼叫 `trigger`。

支援的欄位類型為 `string`、`number`、`boolean` 與 `select`。Select 欄位使用由 `{ "label": "...", "value": "..." }` 物件組成的 `options` 陣列。為必填欄位設定 `required`，為遮蔽輸入設定 `secret`。Manifest 亦接受欄位的 `default`、`dynamic` 與 `expression` 中繼資料；這些會與 manifest 一同儲存，但外掛節點目前會在執行階段讀取已儲存的節點設定，而非從預設值自動填入缺少的設定。

非 secret 的字串欄位會以 expression 輸入 UI 呈現。在執行階段，任何以 `$` 開頭的已儲存字串設定值，會在呼叫 handler 之前被解析。

## Handler 函式

Action handler 會接收 workflow 輸入、解析後的設定，以及一個小型 context：

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger handler 會接收解析後的設定與 context：

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

回傳字典以公開具名輸出欄位。若 handler 回傳其他類型，Heym 會將其包裝為 `{ "value": result }`。

## 安裝與執行階段

外掛預設為停用。操作人員可透過 `HEYM_PLUGINS_ENABLED=true` 啟用，並以 `HEYM_PLUGIN_ADMIN_EMAILS` 限制管理權限。已安裝的外掛檔案位於 `HEYM_PLUGINS_DIR` 之下，在容器部署中應以持久化方式掛載。

外掛程式碼是可信賴、由操作人員安裝的 Python，會與後端在同一個行程內執行。它能存取網路與已安裝的函式庫，因此請僅安裝你願意以與 Heym 本身相同信任層級執行的套件。
