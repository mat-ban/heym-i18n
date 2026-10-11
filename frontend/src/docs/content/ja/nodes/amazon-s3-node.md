# Amazon S3

Amazon S3 ノードは、[Amazon S3](https://aws.amazon.com/s3/) 内のオブジェクトを読み書きします。

## サポートされている操作

- `Create Bucket`: 認証情報のリージョンにバケットを作成します。
- `Delete Bucket`: 空のバケットを削除します。
- `List Buckets`: 認証情報から参照可能なバケットを一覧表示します。
- `Create Folder`: 空のフォルダマーカー（`/` で終わるゼロバイトのキー）を作成します。
- `Delete Folder`: フォルダプレフィックス配下のすべてのオブジェクト（ネストされたキーを含む）を削除します。
- `Get All in Folder`: フォルダプレフィックス配下のすべてのオブジェクトメタデータを一覧表示します（サーバーサイドページネーション）。
- `Upload Object`: テキストの Payload をバケット/キーに書き込みます。
- `Get Object`: オブジェクトをダウンロードし、デコードされたテキストまたは base64 コンテンツを返します。
- `Copy Object`: オブジェクトを別のキーまたはバケットにコピーします。
- `List Objects`: プレフィックス配下のオブジェクトメタデータを一覧表示します（単一ページ、最大 1000 キー、Continuation Token をサポート）。
- `Delete Object`: キーを指定して単一のオブジェクトを削除します。

## 認証情報の設定

Credentials タブで `Amazon S3` 認証情報を以下の内容で作成してください：

- Access Key ID
- Secret Access Key
- Region
- 任意の Session Token（一時的な AWS STS 認証情報用）

## 共通フィールド

- `Bucket`: 対象のバケット名（コピー操作ではコピー先バケット）。
- `Object Key`: `reports/daily.json` のようなパス形式のオブジェクトキー。
- `Folder Path`: フォルダ操作のプレフィックス（例：`docs/archive`）。
- `Source Bucket`: コピー元バケット（任意）。デフォルトはコピー先バケットです。
- `Source Object Key`: コピー操作のコピー元キー。
- `Prefix`: 一覧表示操作で結果を絞り込むために使用します。
- `Continuation Token`: 前回の一覧表示レスポンスから取得した、次のページを取得するための任意の Token。
- `Max Keys`: List Objects のページサイズ（1〜1000）。
- `Include Binary`: Get Object で有効にすると、`body_text` の代わりに `body_base64` を返します。
- `Body`: アップロードするテキストコンテンツ。
- `Content Type`: アップロードするオブジェクトの任意の MIME タイプ。

## 出力例

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## 注意事項

- `Upload Object` は現在、UTF-8 のテキストコンテンツをアップロードします。
- `Get Object` はバイナリオプションを有効にすることで、バイナリファイルに対して base64 を返すことができます。
- `Create Bucket` は認証情報のリージョンを使用し、`s3:CreateBucket` が必要です。
- `Delete Bucket` はバケットが空であることが必要で、`s3:DeleteBucket` が必要です。
- `List Buckets` には `s3:ListAllMyBuckets` が必要です。
- `Create Folder` はゼロバイトのマーカーオブジェクトをアップロードします。S3 にはネイティブのディレクトリ型は存在しません。
- `Delete Folder` はキーがフォルダプレフィックスで始まるすべてのオブジェクトを削除します。使用には注意してください。
- `Get All in Folder` はすべてのオブジェクトが返されるまで、プレフィックスを自動的にページネーションします。
- `List Objects` は 1 ページ（最大 1000 キー）を返します。`truncated` が true の場合、`next_continuation_token` を次回呼び出しの Continuation Token フィールドに渡してください。
- `Copy Object` には、コピー元に対する `s3:GetObject` と、コピー先に対する `s3:PutObject` が必要です。

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [認証情報](../reference/credentials.md) – 認証情報のタイプと使用方法
- [サードパーティ統合](../reference/integrations.md) – Amazon S3 認証情報の設定
