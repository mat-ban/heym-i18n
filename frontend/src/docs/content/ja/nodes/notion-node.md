# Notion

**Notion** ノードは、Notion API を通じてデータベース、データソース、ページ、ブロックを管理します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Credential | 内部統合 Token または Notion OAuth |
| API バージョン | `2026-03-11` |

Notion のデータベース形式のコレクションは、現在の API バージョンでは **データソース ID** を使用します。ノードを実行する前に、Workflow が必要とするすべてのページまたはデータソースを統合に共有してください。
リソースフィールドは、生の Notion ID または完全な Notion URL のいずれかを受け付けます。URL は API リクエストの前に、埋め込まれたリソース ID に正規化されます。

## 操作

| 操作 | 必須フィールド | 主な出力 |
|-----------|-----------------|-------------|
| Search | 任意の query/filter/sort | `.results`、`.count`、`.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID または Parent Page ID、Properties | `.page`、`.id`、`.url` |
| Update Page | Page ID、Properties/Icon/Cover のいずれか | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | `parent` を含む Database リクエスト | `.database`、`.id`、`.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID、空でない Database リクエスト | `.database`、`.id`、`.url` |
| Create Data Source | `parent` と空でない `properties` を含む Data Source リクエスト | `.data_source`、`.id`、`.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID、空でない Data Source リクエスト | `.data_source`、`.id`、`.url` |
| Query Data Source | Data Source ID | `.results`、`.count`、`.next_cursor` |
| Get Block Children | Block または Page ID | `.results`、`.count`、`.next_cursor` |
| Update Block | Block ID、block update オブジェクト | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block または Page ID、Children | `.results`、`.count` |

すべての操作は `.success` と `.operation` も返します。

## JSON フィールド

Database Request、Data Source Request、Properties、Children、Filter、Sort、Sorts、Icon、Cover の各フィールドは、Notion API の JSON を受け付けます。JSON 文字列内の式は、リクエストの前に解決されます。フィールドは、`$input.database`、`$input.properties`、`$input.children` のように、必要なオブジェクトまたは配列に直接解決される単一の式にすることもできます。

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

ページまたはブロックのコンテンツの場合、Children は Notion ブロックオブジェクトの配列です。

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

## データベースとデータソース

現在の Notion API では、**データベース**はコンテナであり、**データソース**はプロパティスキーマとクエリ可能な行を保持します。Retrieve Database はデータベースの `data_sources` リストを返します。Retrieve Data Source または Query Data Source で、それらの ID のいずれかを使用してください。

Create Database は、Notion の Create a database エンドポイントからの完全なリクエストオブジェクトを受け付けます。これには `parent` が含まれている必要があり、`title`、`description`、`is_inline`、`initial_data_source`、`icon`、`cover` を含めることができます。例：

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

Update Database は、`parent`、`title`、`description`、`is_inline`、`icon`、`cover`、`in_trash`、`is_locked` を含む、update エンドポイントのリクエストオブジェクトを受け付けます。Database ID フィールドは、生の ID、完全な Notion URL、または式を受け付けます。

Create Page の properties オブジェクトを構築する前に、**Retrieve Data Source** を使用してデータソースの `properties` スキーマを取得してください。**Create Data Source** には、親データベースオブジェクトと空でない `properties` スキーマが必要です。**Update Data Source** は、対応する Notion エンドポイントでサポートされている空でないリクエストオブジェクトを受け付けます。

たとえば、既存のデータベース内にデータソースを作成します。

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

Data Source と Parent Page のセレクターは、短いデバウンスを伴うサーバー側検索と、カーソルベースの **Load more** ページネーションをサポートします。Notion で新しいリソースを共有した後は、**Refresh** を使用してください。**Use expression** に切り替えると、式、生の ID、または URL を入力できます。

`{"property":"object","value":"database"}` を使用する古いチュートリアルの Search フィルターは、現在の `data_source` 値に変換されます。新しい Workflow では、`data_source` または `page` を直接使用してください。

Append Blocks は **Start**、**End**、**After Block** の位置をサポートします。Create Page と Append Blocks は、Notion のリクエストごとの制限を満たすために、100 を超えるトップレベルの子要素を自動的に順序付けられたリクエストに分割します。

レート制限されたリクエスト（`429` または `529`）は、最大 3 回再試行されます。Heym は Notion の `Retry-After` ヘッダーに従い、各待機時間を最大 10 秒に制限し、ランダム化されたジッターを追加します。Notion リクエストは、ページと Workflow ノード間でプロセス全体の HTTP 接続プールを共有します。
## Notion API の制限

- 単一のリッチテキスト `text.content` 値には、最大 2,000 文字まで含めることができます。それより長いテキストは複数のリッチテキストオブジェクトに分割してください。
- Notion では、トップレベルのブロック子要素は 1 リクエストあたり 100 個までに制限されています。Heym はより大きな Children 配列をバッチ処理しますが、個々のブロックは依然として Notion の Payload 制限を満たす必要があります。
- API は 1 リクエストにつき最大 2 階層までのネストされたブロック子要素を受け付けます。より深い構造を作成するには、後続の Append Blocks 操作を使用してください。
- リクエスト Payload は、1,000 個のブロック要素および全体で 500 KB に制限されています。

## ページネーション

Search、Query Data Source、および Get Block Children は、1 から 100 までのページサイズと、任意の開始カーソルを受け付けます。ページサイズを `0` に設定すると、カーソルを自動的に追跡し、ノードの 10,000 件の安全制限まで、すべての結果をマージします。

## Credential の設定

Credential ダイアログで、いずれかの設定方法（**Internal token** または **OAuth**）を選択してください：

- **Internal token:** 内部インテグレーションを作成し、その Token を Heym にコピーしてから、必要な各ページまたはデータソースをインテグレーションと共有します。**Test Connection** を使用してアクセスを検証してください。
- **OAuth:** パブリック Notion インテグレーションを作成し、Notion に `{FRONTEND_URL}/api/credentials/notion/oauth/callback` を登録します。Heym の Credential ダイアログで **OAuth** を選択し、インテグレーションの Client ID と Client Secret を入力してから、**Connect** をクリックしてワークスペースを認可します。Secret は Credential とともに暗号化して保存され、OAuth state や環境設定には配置されません。認可後、Credential には接続されたワークスペース名（`connected (Workspace Name)`）が表示されます。保留中の OAuth Credential には `Not connected` と表示されます。

編集時に Internal token フィールドを空のままにすると、保存済みの Token が保持されます。

カスタム [HTTP](../nodes/http-node.md) リクエストでは、`$credentials.YourNotionCredential` は Notion ノードが使用するものと同じ Bearer Token（Internal token または OAuth アクセストークン）に解決されます。

## API バージョンに関する注意事項

Heym は Notion リクエストを API バージョン `2026-03-11` に固定しています。このバージョンでは以下を使用します：

- 従来のデータベースクエリパスの代わりに、`data_source_id` 親および `/data_sources` Endpoint
- ページのゴミ箱移動／復元操作において、`archived` の代わりに `in_trash`
- Append Block Children において、`position` オブジェクト（`start`、`end`、`after_block`）

古い Notion 自動化の例を移行する場合：

- データベースの親／クエリ参照を、**Retrieve Database** またはエディターのデータソースピッカーから取得したデータソース ID に置き換えてください
- `archived: true` を `in_trash: true` に置き換えてください
- append の `after` パラメータを、ノードの **Append Position** フィールドに置き換えてください

依然としてオブジェクト値 `database` を使用している検索フィルターは、自動的に `data_source` に正規化されます。

## 関連項目

- [Credentials](../reference/credentials.md)
- [Third-Party Integrations](../reference/integrations.md)
- [Node Types](../reference/node-types.md)
