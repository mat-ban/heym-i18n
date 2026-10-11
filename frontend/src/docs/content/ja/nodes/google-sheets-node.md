# Google Sheets

**Google Sheets** ノードは、OAuth2 を介して Google Sheets スプレッドシートのデータを読み取り、書き込み、管理します。スプレッドシートのワークフローを自動化するために使用できます — レポートの読み取り、結果の記録、トラッカーの更新などが可能です。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Credential | Google Sheets (OAuth2) |
| 出力 | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) から取得した Google Sheets credential |
| `gsOperation` | string | 操作: `readRange`、`appendRows`、`updateRange`、`clearRange`、`getSheetInfo` |
| `gsSpreadsheetId` | expression | スプレッドシート ID または完全な Google Sheets URL |
| `gsSheetName` | expression | シートタブ名（例: `Sheet1`）。`getSheetInfo` では不要です。 |
| `gsStartRow` | expression | `readRange` 用: 1 始まりの最初のデータ行（`gsHasHeader` 指定時は行 1 がヘッダーになります）。 |
| `gsMaxRows` | expression | `readRange` 用: データの最大行数（0 = すべて）。 |
| `gsHasHeader` | boolean | `readRange` 用: true の場合、行 1 を列名として扱います。 |
| `gsUpdateRow` | expression | `updateRange` 専用: 更新する 1 始まりのシート行番号（列 A–Z）。未設定の場合は `gsStartRow` が使用されます。batchUpdate ではなく、単一の values API PUT です。 |
| `gsRange` | expression | A1 表記の範囲（例: `A1:D100`）。レガシーな例です。エディタでは読み取り/更新に行フィールドを使用します。 |
| `gsKeepHeader` | boolean | `clearRange` 専用: true の場合、行 1 を保持し、それ以下のデータ行をクリアします（列 A–Z）。 |
| `gsAppendPlacement` | `append` \| `prepend` | `appendRows` 専用: **Bottom** はデータのある最終行の後に追加します。**Top** は行 1 の直下に新しい行を挿入します（データは下にシフトされます）。 |
| `gsValuesInputMode` | `raw` \| `selective` | `appendRows` / `updateRange` 用: **Raw** = 完全な JSON 配列。**Selective** = 1 つのシート行、列フィールドのみ（A1 ラベルなし）。 |
| `gsValuesSelectiveCols` | string | Selective モード: 列数（A–Z）。 |
| `gsValues` | expression | 値の JSON 2 次元配列（例: `[["Name","Age"],["Alice",30]]`）。`appendRows`、`updateRange` で必須です。 |

## スプレッドシート ID

`gsSpreadsheetId` フィールドには、**ベア ID**（Google Sheets URL の `/d/` と `/edit` の間にある長い英数字文字列）または**完全な URL** のいずれかを指定できます — Heym が ID を自動的に抽出します。

## Credential の設定

Google Sheets は **OAuth2 の「Bring Your Own App」** モデルを採用しています。ご自身の Google Cloud OAuth2 credential を用意していただきます。

**バックエンド設定:** Heym バックエンドの **`FRONTEND_URL`** を、アプリの公開 URL（ユーザーがブラウザに入力するアドレス）に設定してください。例: `https://your-heym-domain`。OAuth リダイレクト URI は常に `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` となり、この設定のみから導出され、リクエストヘッダーからは導出されません。

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** に移動し、**Google Sheets API** を有効化します。
2. **Credentials** → **Create Credentials** → **OAuth client ID** に移動し、**Web application** を選択します。
3. **Authorized redirect URIs** に、正確に `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` を追加します（例: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`）。
4. **Client ID** と **Client Secret** をコピーします。
5. Heym Dashboard → **Credentials** → **New** に移動し、**Google Sheets (OAuth2)** を選択します。
6. Client ID、Client Secret、名前を入力し、**Connect** をクリックしてブラウザのポップアップで OAuth2 同意を完了します。

Token はバックグラウンドで自動的に更新されます — 手動での Token 管理は不要です。

## 操作

| 操作 | 必須フィールド | 説明 |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | セル値（A–Z）を読み取ります。レガシーフローでは任意で `gsRange` を指定できます |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | 最下部（`gsAppendPlacement` が append）または行 1 の直下（`prepend`）に行を追加します |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | `gsUpdateRow` から始まる行（A–Z）を上書きします。複数行の JSON は連続する行に書き込みます |
| `clearRange` | gsSpreadsheetId, gsSheetName | タブの列 A–Z のすべての値をクリアします。任意で `gsKeepHeader` を指定すると最初の行を保持します |
| `getSheetInfo` | gsSpreadsheetId | スプレッドシートのタイトルとシートタブの一覧を取得します |

## 出力リファレンス

| 操作 | 出力フィールド | 型 | 説明 |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | 行オブジェクト: 列キー（ヘッダー名または A、B、…）に加えて **`rowIndex`**（1 始まりのシート行） |
| `readRange` | `.total` | number | 返されたデータ行数 |
| `appendRows` | `.updatedRange` | string | 書き込まれた範囲 |
| `appendRows` | `.updates` | number | 追加された行数 |
| `updateRange` | `.updatedRange` | string | 書き込まれた範囲 |
| `updateRange` | `.updatedCells` | number | 更新されたセル数 |
| `clearRange` | `.clearedRange` | string | クリアされた範囲 |
| `getSheetInfo` | `.title` | string | スプレッドシートのタイトル |
| `getSheetInfo` | `.sheets` | array | `{sheetId, title}` オブジェクトの一覧 |

すべての操作には、出力に `success: true` と `operation: "<name>"` が含まれます。
## 例 – 範囲の読み取り

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

出力へのアクセス: `$readReport.rows[0]`（最初のデータ行オブジェクト）、`$readReport.rows[0].Name`（ヘッダーによる列）、`$readReport.rows[0].rowIndex`（1 始まりのシート行番号）。

## 例 – 入力からの行追加

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Credentials タブ](../tabs/credentials-tab.md) – Google Sheets OAuth2 認証情報の追加
- [サードパーティ統合](../reference/integrations.md#google-sheets-oauth2) – Google Sheets 認証情報の設定
