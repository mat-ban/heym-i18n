# Drive

**Drive** ノードは、Workflow 内から直接、スキルによって生成されたファイルを管理します。ファイルの取得、外部 URL からのダウンロード、削除、チームとの共有・共有解除、またはアクセス制約（パスワード、有効期限、ダウンロード回数制限）のプログラムによる更新に使用できます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.files`、`$nodeLabel.status`、`$nodeLabel.file_id`、`$nodeLabel.download_url`（操作により異なります） |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `driveOperation` | string | 操作: `get`、`getAll`、`downloadUrl`、`save`、`delete`、`setPassword`、`setTtl`、`setMaxDownloads`、`shareWithMyTeams`、`unshareWithMyTeams` |
| `driveFileId` | expression / select | 管理対象となる Drive ファイルの UUID（`getAll`、`downloadUrl`、`save` 以外のすべての操作で必要） |
| `driveLimit` | number | 返却するファイルの最大数（`getAll` のみ。空の場合は無制限） |
| `driveSourceUrl` | expression | 取得して Drive に保存する URL（`downloadUrl` のみ） |
| `driveFilename` | expression | 拡張子を含む完全なファイル名（`save` のみ。例: `1.mp3`） |
| `driveBase64Content` | expression | デコードして保存する生の base64 文字列または data URL（`save` のみ） |
| `driveIncludeBinary` | boolean | 出力にファイル内容を base64 として含める（`get` のみ） |
| `drivePassword` | expression | アクセス Token に設定するパスワード（`setPassword` のみ） |
| `driveTtlHours` | number | ダウンロードリンクが失効するまでの時間（`setTtl` のみ） |
| `driveMaxDownloads` | number | 許可される最大ダウンロード回数（`setMaxDownloads` のみ） |

## ファイル ID の取得

スキルがファイルを生成すると、その出力には `_generated_files` 配列が含まれます。各エントリには `id` フィールドが含まれます:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

ファイル ID は次のように参照します: `$agentLabel._generated_files[0].id`

## 操作

| 操作 | 必須フィールド | 説明 |
|-----------|----------------|-------------|
| `get` | driveFileId | Drive からファイルのメタデータ（および任意でバイナリ内容）を取得します |
| `getAll` | なし | 所有およびチーム共有の読み取り可能な Drive ファイルを、ファイル名、MIME タイプ、サイズ、ソース、ダウンロード URL などのメタデータとともに一覧表示します |
| `downloadUrl` | driveSourceUrl | 外部 URL からファイルを取得し、Drive に保存します |
| `save` | driveFilename, driveBase64Content | base64 コンテンツをデコードし、Drive ファイルとして保存します |
| `delete` | driveFileId | ファイルとそのすべてのアクセス Token をディスクおよびデータベースから削除します |
| `setPassword` | driveFileId, drivePassword | デフォルトの公開 Token を、パスワードで保護された Token に置き換えます |
| `setTtl` | driveFileId, driveTtlHours | デフォルトの公開 Token を、N 時間後に失効する Token に置き換えます |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | デフォルトの公開 Token を、N 回のダウンロードに制限された Token に置き換えます |
| `shareWithMyTeams` | driveFileId | Workflow の所有者が現在所属するすべてのチームと、ファイルを読み取り専用で共有します |
| `unshareWithMyTeams` | driveFileId | ファイルからすべてのチーム共有を解除します |

> **注意:** `set*` 操作は、デフォルト（制約なし）の公開 Token を削除し、指定された制約を持つ新しい Token を作成します。更新された `download_url` が出力に含まれます。
> **チーム共有:** `shareWithMyTeams` は、所有者の現在のチームに対する明示的な共有を作成します。操作を再度実行しない限り、将来のチームは自動的に追加されません。`unshareWithMyTeams` は、ファイルからすべてのチーム共有を解除します。

## 例 — URL からファイルをダウンロード

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

保存されたファイルを後続で参照します: `$fetchReport.id`、`$fetchReport.download_url`

ファイル名は `Content-Disposition` レスポンスヘッダーから取得されます。存在しない場合は、URL パスから導出されます。

## 例 — base64 入力を Drive に保存

テキスト入力ノード（または任意の上流ノード）が base64 ファイルコンテンツを提供する場合に使用します:

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

保存されたファイルを後続で参照します: `$saveAudio.id`、`$saveAudio.download_url`

`driveBase64Content` は、生の base64 文字列または `data:...;base64,...` data URL を受け付けます。MIME タイプはファイル名の拡張子から推測されます。

## 例 — ファイルを取得して Vision LLM でバイナリを使用

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

base64 コンテンツを後続で参照します: `$fetchImage.file_base64`

`file_base64` を介して返された画像は、Workflow を実行するとデバッグパネルにインラインで表示されます。

## 例 — Drive ファイルの一覧表示

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

返された最初のファイルを後続で参照します: `$listFiles.files[0].filename`、`$listFiles.files[0].size_bytes`
## 例 — 処理後にファイルを削除

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## 例 — 生成されたファイルにパスワードを設定

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## 例 — 有効期限（TTL）を設定

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## 例 — ダウンロード回数を制限

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## 例 — 自分のチームと共有

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

チームメンバーは Drive からファイルを閲覧・ダウンロードでき、Workflow 内で読み取り操作を使用できます。ただし、削除、再共有、公開リンクの制約の変更はできません。

## 例 — 自分のチームとの共有を解除

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## ファイルの変換

フォーマット変換は [Converter](./converter-node.md) ノードに移動しました。Drive でファイルを保存または取得し、その id を converter ノードに渡します：

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

元のファイルは保持され、変換されたファイルは新しい Drive ファイルとして保存されます。

## 出力へのアクセス

**get:**
- `$nodeLabel.id` — ファイルの UUID
- `$nodeLabel.filename` — ファイル名
- `$nodeLabel.mime_type` — MIME タイプ（例：`image/png`）
- `$nodeLabel.size_bytes` — ファイルサイズ（バイト単位）
- `$nodeLabel.download_url` — 公開ダウンロード URL
- `$nodeLabel.file_base64` — base64 エンコードされたファイル内容（**Include binary content** が有効な場合のみ）

**getAll:**
- `$nodeLabel.files` — ファイルメタデータオブジェクトの配列
- `$nodeLabel.count` — 返されたファイル数
- `$nodeLabel.files[0].id` — ファイルの UUID
- `$nodeLabel.files[0].filename` — ファイル名
- `$nodeLabel.files[0].mime_type` — MIME タイプ
- `$nodeLabel.files[0].size_bytes` — ファイルサイズ（バイト単位）
- `$nodeLabel.files[0].download_url` — 公開 Token が存在する場合の公開ダウンロード URL
- `$nodeLabel.files[0].metadata` — 保存されたメタデータオブジェクト
- `$nodeLabel.files[0].created_at` — ファイル作成タイムスタンプ

**downloadUrl:**
- `$nodeLabel.id` — 新しく保存されたファイルの UUID
- `$nodeLabel.filename` — ファイル名（`Content-Disposition` または URL パスから取得）
- `$nodeLabel.mime_type` — レスポンスまたはファイル拡張子から検出された MIME タイプ
- `$nodeLabel.size_bytes` — ファイルサイズ（バイト単位）
- `$nodeLabel.download_url` — 保存されたファイルの Drive ダウンロード URL

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — 削除されたファイルの UUID

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — ファイルの UUID
- `$nodeLabel.download_url` — 制約が適用された新しいアクセス Token URL

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — ファイルの UUID
- `$nodeLabel.shared_team_count` — 操作後のチーム共有数

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — ファイルの UUID
- `$nodeLabel.shared_team_count` — 操作後は `0`

## 所有権

オーナー専用の操作では、ファイルが Workflow のオーナーに属している必要があります。読み取り操作（`get`、`getAll`）は、チームを通じて Workflow のオーナーと共有されたファイルにもアクセスできます。

## 関連項目

- [File Generation](../reference/file-generation.md) - スキルがファイルを生成する方法と `_generated_files` 出力
- [Drive Tab](../reference/drive.md) - ダッシュボードでの視覚的なファイル管理
- [Agent Node](./agent-node.md) - ファイルを生成するスキルを実行
- [Converter Node](./converter-node.md) - 保存されたファイルを別のフォーマットに変換、または OCR でテキスト化
- [Expression DSL](../reference/expression-dsl.md) - 動的な値のための式構文
