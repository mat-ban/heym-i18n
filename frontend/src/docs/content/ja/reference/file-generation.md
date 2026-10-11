# ファイル生成

スキルは実行中にファイル（PDF、DOCX、CSV、画像など）を生成できます。生成されたファイルは自動的に保存され、ダウンロード可能になります。

## 仕組み

スキルが実行されると、Heym はスキルの実行環境に `_output_files/` ディレクトリを作成します。このパスは `_OUTPUT_DIR` 環境変数として利用できます。

このディレクトリに書き込まれたファイル（`_` で始まるファイルを除く）は、スキルの完了後にキャプチャされ、ファイルシステムに保存され、ダウンロードリンクが自動的に生成されます。

## スキルでのファイル書き込み

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# CSV を生成
csv_path = os.path.join(output_dir, "report.csv")
with open(csv_path, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Value"])
    writer.writerow(["Revenue", args.get("revenue", 0)])
    writer.writerow(["Users", args.get("users", 0)])

print(json.dumps({"status": "Report generated"}))
```

## PDF 生成

PDF 生成には `reportlab` ライブラリが利用できます：

```python
import os
import json
import sys
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

pdf_path = os.path.join(output_dir, "invoice.pdf")
c = canvas.Canvas(pdf_path, pagesize=A4)
c.drawString(100, 750, f"Invoice for {args.get('customer', 'Unknown')}")
c.drawString(100, 730, f"Amount: ${args.get('amount', 0)}")
c.save()

print(json.dumps({"status": "Invoice generated"}))
```

## DOCX 生成

`python-docx` ライブラリが利用できます：

```python
import os
import json
import sys
from docx import Document

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

doc = Document()
doc.add_heading(args.get("title", "Report"), level=1)
doc.add_paragraph(args.get("content", ""))
doc.save(os.path.join(output_dir, "report.docx"))

print(json.dumps({"status": "Document generated"}))
```

## 複数ファイル

スキルは 1 回の実行で複数のファイルを生成できます：

```python
import os
import json
import sys
import csv

args = json.load(sys.stdin)
output_dir = os.environ.get("_OUTPUT_DIR", ".")

# CSV を生成
with open(os.path.join(output_dir, "data.csv"), "w") as f:
    writer = csv.writer(f)
    writer.writerow(["col1", "col2"])
    writer.writerow(["val1", "val2"])

# テキストサマリーを生成
with open(os.path.join(output_dir, "summary.txt"), "w") as f:
    f.write("Summary of the data processing...")

print(json.dumps({"status": "done", "files_generated": 2}))
```

## ファイルサイズ制限

生成されたファイルは `FILE_MAX_SIZE_MB` 設定（デフォルト：99 MB）の対象となります。この制限を超えるファイルは通知なくスキップされます。

## ダウンロードリンク

実行後、生成された各ファイルには一意のダウンロード URL が付与されます。これらの URL はスキルの出力内の `_generated_files` キーの下に含まれます：

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.csv",
      "mime_type": "text/csv",
      "size_bytes": 1234,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

`id` フィールドはファイルの UUID です。[Drive ノード](../nodes/drive-node.md)と組み合わせて使用することで、Workflow 内からファイルを管理できます — 削除、パスワードの追加、有効期限の設定、ダウンロード回数の制限などが可能です：

```
$agentLabel._generated_files[0].id
```

これらのリンクは直接共有することも、[Drive](../reference/drive.md) タブから管理することもできます。

デプロイ構成に応じて、`download_url` は次のいずれかになります：
- 絶対 URL（バックエンドコンテナに `FRONTEND_URL` が設定されている場合）。
- 相対パス（例：`/api/files/dl/abc123...`）。これはブラウザ UI でも引き続き機能します。

## サポートされる MIME タイプ

ファイルタイプはファイル拡張子から自動的に検出されます。一般的なタイプ：

| 拡張子 | MIME タイプ |
|-----------|-----------|
| .pdf | application/pdf |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .csv | text/csv |
| .json | application/json |
| .txt | text/plain |
| .png | image/png |
| .jpg | image/jpeg |

## 関連項目

- [Drive ノード](../nodes/drive-node.md) - 生成されたファイルに対するプログラムによる削除、パスワード、TTL、ダウンロード制限、チーム共有/共有解除
- [Drive](../reference/drive.md) - ダッシュボードの Drive タブと共有リンクの動作
- [Drive タブ](../tabs/drive-tab.md) - UI でのファイルの閲覧と管理
