# ファイルアップロード Trigger

**ファイルアップロード Trigger** ノードは、JSON リクエスト内に base64 として埋め込むことができない**大容量ファイル**（音声、動画、アーカイブ）を必要とする Workflow 向けの、ゼロ入力のエントリーポイントです。Workflow を呼び出すと、事前入力済みの単一使用の `curl` アップロードリンクが返され、そのリンクにファイルをアップロードすると、ファイルが添付された状態で実行が開始されます。

呼び出し元 — サンドボックス内で動作する Claude や ChatGPT のような AI エージェントを含む — が、20 MB の音声録音や 75 MB の動画を Heym Workflow に渡す必要がある場合に使用します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| 出力 | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## 動作の仕組み

このノードは 2 つのフェーズで動作します：

1. **発行（Mint）。** Workflow が HTTP（`POST /api/workflows/{id}/execute`）、MCP ツール、またはキャンバスの **Run Workflow** ボタン経由で呼び出された場合、その実行では本体は**実行されません**。代わりに、単一使用のアップロードスロットを発行し、以下を返します：

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **アップロード + 実行。** 呼び出し元は自身のファイルを指定して `curl` を実行します。アップロード Endpoint はスロットを検証し、ファイルを保存し、Workflow を**同期的に**実行し、アップロードレスポンス内で Workflow の出力を返します。リンクは**単一使用**です — 2 回目のアップロードは `409` を返します。

キャンバス上では、**Run Workflow** を実行すると、発行された `curl` がコピーボタン付きでデバッグパネルに表示されます。

## Heym からの実行

以下の 2 つの場所から、同じリンク発行およびアップロードの仕組みを通じて、ファイルに対して直接このような Workflow を実行できます。

- [Quick Drawer](../reference/quick-drawer.md) にはファイルのドロップゾーンが表示されます。これらの実行は履歴で `Quick Drawer` とタグ付けされます。
- ダッシュボード上の[実行ウィジェット](../tabs/dashboard-tab.md#run-widgets)は、ドロップされた各ファイルに対して Workflow を実行します。これらの実行は `dashboard` とタグ付けされます。

## パラメータ

| パラメータ | 型 | デフォルト | 説明 |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | アップロードリンクが有効な期間（1〜10080 分 / 最大 7 日間）。 |
| `maxSizeMb` | number | `100` | 受け入れる最大ファイルサイズ。ハード上限は **100 MB** です。 |
| `allowedTypes` | string | （空） | 任意のカンマ区切りの MIME/拡張子許可リスト（例：`audio/*, .wav`）。空の場合はすべての型を許可します。 |

## 出力フィールド

| 式 | 説明 |
|------------|-------------|
| `$nodeLabel.file.id` | 保存されたファイルの UUID（Drive ファイル）。 |
| `$nodeLabel.file.name` | 元のファイル名。 |
| `$nodeLabel.file.mime` | 検出されたコンテンツタイプ。 |
| `$nodeLabel.file.size` | バイト単位のサイズ。 |
| `$nodeLabel.file.download_url` | 下流のノード向けの認証済みダウンロード URL。 |
| `$nodeLabel.uploaded_at` | アップロードの ISO タイムスタンプ。 |

## 例

文字起こし Workflow：

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. エージェントが Workflow の MCP ツールを呼び出し、`curl` を受け取ります。
2. エージェントは自身のサンドボックスから録音を指定して `curl` を実行します。
3. アップロードによって Workflow が実行され、`curl` のレスポンスに文字起こしの要約が含まれます。

## セキュリティ

- アップロード URL には高エントロピーの Token が埋め込まれています — この Token 自体がケイパビリティであるため、サンドボックス化されたエージェントはアップロードに Heym の認証情報を必要としません。サーバー側には Token のハッシュのみが保存されます。
- 発行には通常の Workflow 認証が必要なため、認可された呼び出し元のみがアップロードリンクを作成できます。
- すべての発行とすべてのアップロード試行（受理・拒否を問わず — 期限切れ、再生、サイズ超過、許可されていない型、不明な Token）は、追記専用の監査証跡に記録されます。
- アップロードは単一使用、TTL 制限、サイズ上限が適用され、サイズ超過のアップロードは拒否されます。

## 注記

- 汎用の HTTP、MCP、キャンバスの呼び出しチャネルは JSON 専用のままです。このノードは、multipart ファイルアップロードを受け入れるためのサポートされた方法です。
- アップロードされたファイルは通常の Drive ファイルとして保存されるため、ファイル参照を受け入れる任意の下流ノード（文字起こし、メール添付の送信など）が `$nodeLabel.file` を利用できます。
