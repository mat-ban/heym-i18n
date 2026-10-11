# Google Drive

**Google Drive** ノードは、OAuth2 を介して Google Drive 内のファイルやフォルダの一覧取得、ダウンロード、更新、削除を行います。また、1 回の操作で Drive のファイルを直接 [Heym Drive](./drive-node.md) にコピーすることもできます。

> **これは [Drive](./drive-node.md) ノードではありません。** そちらのノードは *Heym Drive* であり、Heym 独自の内部ファイルストレージです。本ノードは Google Drive と通信します。`syncToHeymDrive` 操作は、この 2 つを橋渡しするものです。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Credential | Google Drive (OAuth2) |
| 出力 | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) の Google Drive credential |
| `gdOperation` | string | 操作: `listFolderFiles`、`downloadFile`、`syncToHeymDrive`、`updateFile`、`removeFile`、`removeFolder` |
| `gdFolderId` | expression | フォルダ ID または完全な Drive フォルダ URL。`listFolderFiles` および `removeFolder` で使用します。空の場合は Drive のルートを意味します。 |
| `gdFileId` | expression | ファイル ID または完全な Drive/Docs URL。`downloadFile`、`syncToHeymDrive`、`updateFile`、`removeFile` で使用します。 |
| `gdMaxResults` | expression | `listFolderFiles` 用: 返すファイルの最大数（デフォルト 100）。空または `0` を指定すると、ページングによってフォルダ全体を読み込みます。一覧に含まれる各ファイルには、Drive がサイズを報告する場合に `size_bytes` が含まれます。 |
| `gdQuery` | expression | `listFolderFiles` 用: フォルダフィルタと AND 結合される追加の Drive クエリ（例: `mimeType='application/pdf'`）。 |
| `gdIncludeTrashed` | boolean | `listFolderFiles` 用: ゴミ箱内のファイルを含めます。デフォルトは false。 |
| `gdExportFormat` | string | `downloadFile` / `syncToHeymDrive` 用: `pdf`、`docx`、`xlsx`、`pptx`、`csv`、`txt`。空の場合は自動です。通常のファイルでは無視されます。 |
| `gdFilename` | expression | `syncToHeymDrive` 用: Heym Drive に保存されるファイル名を上書きします。 |
| `gdBase64Content` | expression | `updateFile` 用: ファイルの内容を置き換える base64 文字列または `data:` URL。 |
| `gdNewName` | expression | `updateFile` 用: 新しいファイル名（リネーム）。 |
| `gdNewParentId` | expression | `updateFile` 用: 移動先フォルダの ID または URL（移動）。 |
| `gdPermanentDelete` | boolean | `removeFile` / `removeFolder` 用: false（デフォルト）の場合、項目はゴミ箱に移動され復元可能です。true の場合、完全に削除されます。 |

## ファイルとフォルダの ID

`gdFileId`、`gdFolderId`、`gdNewParentId` は、**ベア ID** または **完全な URL** のいずれかを受け付けます — Heym が ID を自動的に抽出します。以下はすべて有効です:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs、Sheets、Slides

Google ネイティブのドキュメントには、**ダウンロード可能なバイト列が存在しません**。これらはファイルではなく Google のサーバー上のレコードであるため、生のコンテンツを要求すると Drive API は `403 Only files with binary content can be downloaded` を返します。

`downloadFile` と `syncToHeymDrive` はこれらを自動的に検出し、代わりに**エクスポート**します。したがって、対象が Google Doc であるという理由だけで操作が失敗することはありません:

| ソース | デフォルトのエクスポート |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| その他の Google ネイティブ形式 | PDF |

**Export Format** を設定すると、対象を上書きできます。この設定は通常のアップロード済みファイルでは無視され、常にそのままダウンロードされます。

## 操作

| 操作 | 必須 | 説明 |
|-----------|----------|-------------|
| `listFolderFiles` | —（空のフォルダ = ルート） | フォルダ内のファイルを一覧表示します。任意のクエリフィルタを指定できます。 |
| `downloadFile` | `gdFileId` | ファイルのバイト列を base64 としてダウンロードし、ネイティブドキュメントは自動的にエクスポートします。 |
| `syncToHeymDrive` | `gdFileId` | Google Drive からダウンロードし、その結果を Heym Drive に保存します。 |
| `updateFile` | `gdFileId` + コンテンツ / 名前 / 親のうち少なくとも 1 つ | コンテンツの置き換え、リネーム、および/または移動を行います。 |
| `removeFile` | `gdFileId` | ファイルをゴミ箱に移動（デフォルト）または完全に削除します。 |
| `removeFolder` | `gdFolderId` | フォルダとその内容をゴミ箱に移動（デフォルト）または完全に削除します。 |

### 削除はデフォルトで復元可能です

`removeFile` と `removeFolder` は、項目を **Google Drive のゴミ箱**に移動し、そこから復元できます。これは、スケジュールや [Loop](./loop-node.md) 内で実行される可能性のある処理にとって安全なデフォルトです。

**Delete permanently** を有効にすると、項目は復元不能に破壊されます。`removeFolder` の場合、フォルダ内のすべての内容も破壊されます。

本ノードは対象の型もチェックします: `removeFile` はフォルダを拒否し、`removeFolder` はファイルを拒否するため、ID の入力ミスによって誤ったものを黙って削除してしまうことはありません。

### updateFile は空のフィールドをそのままにします

`updateFile` は置き換えではなく更新です。コンテンツ、新しい名前、新しいフォルダの任意の組み合わせを入力してください — 空のままにしたものは変更されません。3 つのうち少なくとも 1 つが必須です。
## Credential の設定

Google Drive は **OAuth2 の「Bring Your Own App」** モデルを採用しています。お客様自身の Google Cloud OAuth2 認証情報を提供していただきます。

> **この Credential は Drive へのフルアクセスを許可します。** 本ノードは既に所有しているファイルを操作するため、Heym は `https://www.googleapis.com/auth/drive` スコープを要求します。より狭い `drive.file` スコープでは、アプリ自身が作成したファイルしか参照できず、既存ファイルの一覧表示、更新、削除が不可能になります。この Credential をチームで共有する前に、[Credential Sharing](../reference/credentials-sharing.md) をご確認ください。

**バックエンドの設定:** Heym バックエンドの **`FRONTEND_URL`** に、アプリの公開 URL を設定してください。OAuth リダイレクト URI は常に `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` となり、この設定からのみ導出され、リクエストヘッダーからは導出されません。

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** に移動し、**Google Drive API** を有効化します。
2. **Credentials** → **Create Credentials** → **OAuth client ID** に移動し、**Web application** を選択します。
3. **Authorized redirect URIs** に、`{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback` を正確に追加します。
4. **Client ID** と **Client Secret** をコピーします。
5. Heym で **Dashboard → Credentials → New → Google Drive (OAuth2)** を開き、両方の値を貼り付けてから **Connect** をクリックし、ポップアップでアクセスを承認します。

## Output

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

`size_bytes` は、フォルダおよびサイズを報告しない Google ネイティブファイルの場合 `null` になります。

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

通常のファイルの場合、`exported` は `false` となり、`export_format` は `null` になります。

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id` は新しい **Heym Drive** のファイル ID であり、`google_file_id` とは異なります。

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted` は `"trashed"` または `"permanent"` になります。

## 例: Drive フォルダを Heym Drive にバックアップする

1. **[Cron](./cron-node.md)** — 毎日実行します。
2. **Google Drive** — ソースフォルダに対して `listFolderFiles` を実行します。PDF のみを対象とする場合は、`gdQuery` に `mimeType='application/pdf'` を設定します。
3. **[Loop](./loop-node.md)** — `$ListReports.files` を反復処理します。
4. **Google Drive** — `syncToHeymDrive` を実行し、`gdFileId` に `$BackupLoop.item.id`、`gdFilename` に `$BackupLoop.item.name` を設定します。
5. **[Slack](./slack-node.md)** — バックアップされた内容のサマリーを投稿します。

## Notes

- すべてのテキストフィールドは `$` 式を受け付けるため、ID やファイル名を前段のノードから取得できます。
- 共有ドライブをサポートしています — 本ノードはすべてのリクエストで `supportsAllDrives` を設定します。
- ダウンロードは、バックエンドの `FILE_MAX_SIZE_MB` 設定に対してサイズチェックが行われます。
- 本ノードを [Agent](./agent-node.md) ノードの tool 入力に接続し、任意のフィールドで bot アイコンを使用すると、実行時にエージェントがそのフィールドを埋めることができます。

## See Also

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
