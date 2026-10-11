# ダウンロードとインポート

Workflow またはフォルダ全体をファイルとしてエクスポートしたり、ドラッグ＆ドロップでインポートしたりできます。バックアップ、共有、またはインスタンス間での Workflow の移行にご利用ください。

## Workflow のダウンロード（JSON）

**場所:** エディターツールバー → **Download** ボタン（大画面で表示されます）

**エクスポートされる内容:**
- `nodes` – キャンバス上のすべてのノード
- `edges` – ノード間のすべての接続

**ファイル名:** `{workflow-name}.json`（Workflow 名から生成されます）

**フォーマット:** JSON スキーマについては [Workflow Structure](./workflow-structure.md) をご参照ください。

## フォルダのダウンロード（ZIP）

**場所:** ダッシュボード → Workflows タブ → フォルダの 3 点メニュー → **Download as ZIP**

**エクスポートされる内容:**
- フォルダ内およびすべてのサブフォルダ内のすべての Workflow（再帰的）
- フォルダ階層は ZIP 内のディレクトリとして保持されます

**ZIP 構造:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

各 `.json` ファイルには `{ name, nodes, edges }` が含まれます。

## インポート

### ダッシュボードから（Workflows タブ）

1. [Workflows](../tabs/workflows-tab.md) タブに移動します
2. **JSON** または **ZIP** ファイルを Workflow エリアにドラッグします

**JSON ファイル:** 新しい Workflow が作成されます。Workflow 名は JSON 内の `name` フィールドから取得され、`name` が存在しない場合はファイル名が使用されます。

**ZIP ファイル:** フォルダ構造全体がルートレベルで再作成されます。ZIP 内の各 `.json` ファイルは、対応するフォルダに配置された Workflow になります。現在のインスタンスに存在しない Credential および Workflow 間参照は自動的にクリアされます。一部の Workflow のインポートに失敗した場合は、成功した件数のサマリーが表示されます。

### キャンバスから（エディター）

1. エディターで Workflow を開きます
2. JSON ファイルをキャンバスにドラッグします
3. キャンバスにすでにノードまたはエッジが存在する場合、現在の Workflow を置き換えるかどうかを確認するダイアログが表示されます
4. インポートされたノードとエッジが現在の Workflow を置き換えるか、マージされます

## ファイルフォーマット

### JSON（単一 Workflow）

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – 必須。ノードオブジェクトの配列
- `edges` – オプション。エッジオブジェクトの配列（デフォルトは `[]`）
- `name` – オプション。ダッシュボードからのインポートで新しい Workflow を作成する際に使用されます

### ZIP（フォルダ）

ディレクトリ構造がフォルダ階層を反映する ZIP アーカイブです。各ファイルは Workflow JSON（上記参照）です。フォルダ名と Workflow 名は、それぞれディレクトリ名とファイル名から生成されます。

ノードとエッジのフォーマットについては [Workflow Structure](./workflow-structure.md) をご参照ください。

## ユースケース

- **バックアップ** – 大きな変更の前に Workflow またはフォルダ全体をダウンロードします
- **共有** – JSON ファイルをエクスポートしてチームメンバーと共有します
- **移行** – Heym インスタンス間で Workflow またはフォルダ構造を移動します
- **バージョン管理** – Workflow JSON をコードとともに Git に保存します

## 関連項目

- [Workflow Structure](./workflow-structure.md) – ノードとエッジの JSON フォーマット
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow の作成とドラッグ＆ドロップによるインポート
- [Workflow Organization](./workflow-organization.md) – フォルダとサブフォルダ
- [Canvas Features](./canvas-features.md) – キャンバスインポートを含むエディター機能
