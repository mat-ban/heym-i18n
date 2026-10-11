# Notion

**Notion** 节点通过 Notion API 管理数据库、数据源、页面和块。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭据 | 内部集成 Token 或 Notion OAuth |
| API 版本 | `2026-03-11` |

在当前 API 版本中，Notion 数据库风格的集合使用**数据源 ID**。在运行节点之前，请将工作流所需的每个页面或数据源共享给集成。资源字段接受原始 Notion ID 或完整的 Notion URL。在发起 API 请求之前，URL 会被规范化为其内嵌的资源 ID。

## 操作

| 操作 | 必填字段 | 主要输出 |
|-----------|-----------------|-------------|
| Search | 可选的 query/filter/sort | `.results`、`.count`、`.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID 或 Parent Page ID、Properties | `.page`、`.id`、`.url` |
| Update Page | Page ID、Properties/Icon/Cover 之一 | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | 包含 `parent` 的 Database request | `.database`、`.id`、`.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID、非空 database request | `.database`、`.id`、`.url` |
| Create Data Source | 包含 `parent` 和非空 `properties` 的 data source request | `.data_source`、`.id`、`.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID、非空 data source request | `.data_source`、`.id`、`.url` |
| Query Data Source | Data Source ID | `.results`、`.count`、`.next_cursor` |
| Get Block Children | Block 或 Page ID | `.results`、`.count`、`.next_cursor` |
| Update Block | Block ID、block update object | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block 或 Page ID、Children | `.results`、`.count` |

所有操作还会返回 `.success` 和 `.operation`。

## JSON 字段

Database Request、Data Source Request、Properties、Children、Filter、Sort、Sorts、Icon 和 Cover 字段接受 Notion API JSON。JSON 字符串中的表达式会在请求之前被解析。字段也可以是一个独立的表达式，直接解析为所需的对象或数组，例如 `$input.database`、`$input.properties` 或 `$input.children`。

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

对于页面或块内容，Children 是 Notion 块对象的数组：

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

## 数据库与数据源

在当前 Notion API 中，**database** 是容器，而 **data source** 保存属性 schema 和可查询的行。Retrieve Database 返回数据库的 `data_sources` 列表；将其中的一个 ID 用于 Retrieve Data Source 或 Query Data Source。

Create Database 接受来自 Notion 的 Create a database endpoint 的完整请求对象。它必须包含 `parent`，并且可以包含 `title`、`description`、`is_inline`、`initial_data_source`、`icon` 和 `cover`。例如：

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

Update Database 接受 update endpoint 的请求对象，包括 `parent`、`title`、`description`、`is_inline`、`icon`、`cover`、`in_trash` 和 `is_locked`。Database ID 字段接受原始 ID、完整的 Notion URL 或表达式。

在构建 Create Page properties 对象之前，使用 **Retrieve Data Source** 获取数据源的 `properties` schema。**Create Data Source** 需要父数据库对象和非空 `properties` schema。**Update Data Source** 接受相应 Notion endpoint 支持的非空请求对象。

例如，在现有数据库中创建数据源：

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

Data Source 和 Parent Page 选择器支持服务端搜索，具有短暂的防抖和基于游标的 **Load more** 分页。在 Notion 中共享新资源后，使用 **Refresh**。切换到 **Use expression** 以输入表达式、原始 ID 或 URL。

来自旧教程的 Search 过滤器（使用 `{"property":"object","value":"database"}`）会被转换为当前的 `data_source` 值。新工作流应直接使用 `data_source` 或 `page`。

Append Blocks 支持 **Start**、**End** 和 **After Block** 位置。Create Page 和 Append Blocks 会自动将超过 100 个顶层子项拆分为有序请求，以满足 Notion 的每请求限制。

受速率限制的请求（`429` 或 `529`）最多重试三次。Heym 遵循 Notion 的 `Retry-After` 响应头，将每次等待上限设为 10 秒，并添加随机抖动。Notion 请求在页面和工作流节点之间共享进程级 HTTP 连接池。
## Notion API 限制

- 单个富文本 `text.content` 值最多可包含 2,000 个字符。更长的文本需拆分为多个富文本对象。
- Notion 限制每次请求的顶层子块最多为 100 个。Heym 会对更大的 Children 数组进行分批处理，但每个单独的块仍须满足 Notion 的 Payload 限制。
- API 在单次请求中最多接受两层嵌套的子块。更深层的结构需通过后续的 Append Blocks 操作创建。
- 请求 Payload 限制为 1,000 个块元素，总大小不超过 500 KB。

## 分页

Search、Query Data Source 和 Get Block Children 接受 1 到 100 的 page size 以及可选的起始游标。将 page size 设置为 `0` 可自动跟随游标并合并所有结果，最多不超过节点的 10,000 条结果安全上限。

## 凭据设置

在凭据对话框中选择以下任一设置方式（**Internal token** 或 **OAuth**）：

- **Internal token：** 创建一个内部集成，将其 Token 复制到 Heym 中，然后将每个所需的页面或数据源共享给该集成。使用 **Test Connection** 验证访问权限。
- **OAuth：** 创建一个公共 Notion 集成，并在 Notion 中注册 `{FRONTEND_URL}/api/credentials/notion/oauth/callback`。在 Heym 凭据对话框中，选择 **OAuth**，输入集成的 Client ID 和 Client Secret，然后点击 **Connect** 授权工作区。Secret 会随凭据一起加密存储，不会放入 OAuth state 或环境配置中。授权后，凭据会显示已连接的工作区名称（`connected (Workspace Name)`）。待处理的 OAuth 凭据会显示 `Not connected`。

在编辑时保持 internal token 字段为空将保留已存储的 Token。

对于自定义 [HTTP](../nodes/http-node.md) 请求，`$credentials.YourNotionCredential` 会解析为与 Notion 节点所使用的相同的 bearer token（internal token 或 OAuth access token）。

## API 版本说明

Heym 将 Notion 请求固定为 API 版本 `2026-03-11`。此版本使用：

- `data_source_id` 父级和 `/data_sources` Endpoint，而非旧版数据库查询路径
- `in_trash` 而非 `archived` 用于页面回收站/恢复操作
- `position` 对象（`start`、`end`、`after_block`）用于 Append Block Children

迁移较旧的 Notion 自动化示例时：

- 将数据库父级/查询引用替换为来自 **Retrieve Database** 或编辑器数据源选择器的数据源 ID
- 将 `archived: true` 替换为 `in_trash: true`
- 将 append 的 `after` 参数替换为节点的 **Append Position** 字段

仍使用对象值 `database` 的搜索过滤器会自动规范化为 `data_source`。

## 相关

- [Credentials](../reference/credentials.md)
- [Third-Party Integrations](../reference/integrations.md)
- [Node Types](../reference/node-types.md)
