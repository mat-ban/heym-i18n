# Crawler

**Crawler** ノードは、FlareSolverr を使用して Web ページをスクレイピングし、オプションで CSS セレクターによる HTML 抽出を行います。Web スクレイピングやコンテンツ抽出にご利用ください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.body`（HTML または抽出されたコンテンツ） |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) で設定した FlareSolverr credential |
| `crawlerUrl` | expression | スクレイピング対象の URL（式をサポート） |
| `crawlerWaitSeconds` | number | スクレイピング前に待機する秒数（デフォルト: 0） |
| `crawlerMaxTimeout` | number | 最大タイムアウト（ミリ秒、デフォルト: 60000） |
| `crawlerMode` | string | `"basic"` またはその他のモード |
| `crawlerSelectors` | array | 抽出用の CSS セレクター。各要素: `{ selector, attribute? }` |

## 例

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## Egress の安全性

- credential に保存される FlareSolverr URL は `http://` または `https://` を使用する必要があり、link-local アドレスやクラウドメタデータアドレスに解決されてはなりません。拒否されるアドレス集合は `169.254.0.0/16`、`fe80::/10`、Alibaba Cloud および AWS の IPv6 メタデータアドレス、ならびにこれらを内包し得る IPv6 トランジション形式です。これは既知のエンドポイントのリストであり、すべてのプロバイダーに対する保証ではありません。
- ループバックアドレスおよびプライベートアドレスは意図的に許可されています。これにより、ドキュメント記載の `http://localhost:8191` 構成や、`http://flaresolverr:8191` のような compose サービス名が引き続き機能します。その結果として、このフィールドはバックエンドがこれらのアドレス上で到達可能な他の任意のサービスを指すこともでき、そのレスポンスはノードの出力として返されます。credential の共有はこれを防ぎません。サインイン済みのユーザーは誰でも自身の FlareSolverr credential を作成できるため、既存の credential を伏せても何も変わりません。実際に有効な制御は、Workflow を作成できる人物を信頼すること、およびバックエンドが到達可能な範囲を制限するネットワークルールです。
- Heym は接続前に解決済みアドレスを固定するため、チェック後に DNS 応答によってリクエストがメタデータアドレスへ移動することはありません。ガードが有効な間は環境プロキシが無効化され、リダイレクトは追跡されません。
- その後 FlareSolverr がユーザーに代わって取得するページは、FlareSolverr 自身が解決する別のホップです。Heym はこれを検査しないため、FlareSolverr コンテナが接続可能な範囲の制限は、お客様のネットワークポリシーに属します。
- 信頼されたセルフホスト環境では、`HEYM_HTTP_ALLOW_PRIVATE_URLS=true` によりメタデータルールを解除できます。ホスト型またはマルチテナント環境ではデフォルトのままにしてください。

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Playwright Node](./playwright-node.md) – ブラウザ自動化の代替手段
- [Credentials Tab](../tabs/credentials-tab.md) – FlareSolverr credential の追加
