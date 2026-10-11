# Plugin 開発

Heym プラグインは、運用担当者がインストールする信頼済みの zip パッケージです。1 つのパッケージで、コアアプリを変更することなく、1 つ以上のカスタム action ノードまたは trigger ノードを追加できます。

## パッケージレイアウト

プラグインの zip には、パッケージルートに `plugin.json` を含める必要があり、また `entry` で指定された Python エントリファイル（デフォルトは `handler.py`）を含める必要があります。

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` は任意であり、プラグインのドキュメントページとして提供されます。デフォルトのノードアイコンとして使用する `icon.svg` をパッケージルートに配置するか、`plugin.json` でノード固有の `icon` パスを設定してください。

## マニフェスト

1 つのパッケージで複数のノードを公開する場合は、マルチノード形式の `plugin.json` を使用します。

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

レガシーなシングルノード形式のマニフェストも受け付けられます。その場合は `nodes` を省略し、トップレベルに `kind`、`fields`、`dslHint`、`docSlug` を指定します。

## マニフェストのフィールド

| フィールド | 備考 |
|-------|-------|
| `id` | 英小文字、数字、ハイフンを使用したパッケージ id。 |
| `name` | 人間が読みやすいパッケージ名。 |
| `version` | 表示およびハンドラのキャッシュに使用されるパッケージバージョン。 |
| `description` | UI およびアシスタントのコンテキストに表示される短い説明。 |
| `entry` | zip 内の Python ハンドラファイルパス。デフォルトは `handler.py`。 |
| `dependencies` | `uv pip install` でインストールされる任意の pip 要件。 |
| `nodes` | このパッケージが公開するカスタムノード。 |

各ノードには一意の `key`、`name`、および `action` または `trigger` のいずれかの `kind` が必要です。`function` を省略した場合、action は `run` を呼び出し、trigger は `trigger` を呼び出します。

サポートされるフィールドタイプは `string`、`number`、`boolean`、`select` です。select フィールドは `{ "label": "...", "value": "..." }` オブジェクトの `options` 配列を使用します。必須フィールドには `required` を、マスクされた入力には `secret` を設定してください。マニフェストはフィールドの `default`、`dynamic`、`expression` メタデータも受け付けますが、これらはマニフェストとともに保存されるものの、プラグインノードは現在、デフォルトから不足している config を自動的に補完するのではなく、実行時に保存されたノード config を読み取ります。

シークレットではない文字列フィールドは、expression 入力 UI でレンダリングされます。実行時には、`$` で始まる保存済みの文字列 config 値は、ハンドラが呼び出される前に解決されます。

## ハンドラ関数

action ハンドラは、workflow の入力、解決済みの config、および小さなコンテキストを受け取ります。

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

trigger ハンドラは、解決済みの config とコンテキストを受け取ります。

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

名前付きの出力フィールドを公開するには、辞書を返します。ハンドラが別の型を返した場合、Heym はそれを `{ "value": result }` としてラップします。

## インストールとランタイム

プラグインはデフォルトで無効になっています。運用担当者は `HEYM_PLUGINS_ENABLED=true` で有効化し、`HEYM_PLUGIN_ADMIN_EMAILS` で管理を制限します。インストールされたプラグインファイルは `HEYM_PLUGINS_DIR` 配下に配置され、コンテナデプロイでは永続的にマウントする必要があります。

プラグインコードは信頼済みで、運用担当者がインストールした Python であり、バックエンドと同一プロセス内で実行されます。ネットワークやインストール済みライブラリにアクセスできるため、Heym 本体と同等の信頼レベルで実行してもよいパッケージのみをインストールしてください。
