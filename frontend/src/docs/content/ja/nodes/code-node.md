# コード

**Code** ノードは、あなたが記述した Python を独自の `requirements.txt` とともに実行し、JSON を返します。実行ごとにまったく新しいコンテナが割り当てられ、実行終了時に破棄されるため、ある実行が別の実行を参照したり影響を与えたりすることは決してありません。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.result`（`main` が返した値）、および `$nodeLabel.logs` と `$nodeLabel.install` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `codeSource` | string | Python ソース。`main(params)` を定義し、JSON シリアライズ可能な値を返す必要があります |
| `codeParameters` | expression | Workflow のデータをコードに渡す JSON オブジェクト。式はコード実行前に解決されます |
| `codeRequirements` | string | `requirements.txt` の内容。1 行につき 1 パッケージ。空の場合はインストールをスキップします |
| `codeAllowNetwork` | boolean | コード自体がネットワークにアクセスできるかどうか（デフォルトは `false`） |

## `main` 関数

コードには、1 つの引数を受け取るトップレベルの `main` を定義する必要があります。

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

モジュールレベルのステートメントも実行されますが、ノードの出力になるのは `main` が返したものだけです。

エディタには行番号が表示され、**Format** の横にある展開ボタンを押すとより大きなエディタが開き、`Esc` で閉じます。編集は入力と同時に適用されるため、保存するものはありません。**Format** ボタンは Ruff を使ってコードを再フォーマットし、コメントを保持します。また、貼り付け時によく発生するインデントの崩れも修復します。一様にインデントされたブロック、タブとスペースの混在、ブロックから 1〜2 スペースずれた行などは、いずれも拒否されずに修正されます。本当の構文エラーは、その行と列とともに報告されます。フォーマットはノードが実行されるのと同じ隔離コンテナ内で実行されます。ネットワークもバックエンド環境もないため、実行時と同様に Docker が必要です。

## パラメータの読み取り

`params` はドット記法をサポートしており、ネストされたオブジェクトやリストを経由したアクセスも可能です。

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` は、有効な Python 識別子ではないキーを読み取ります
- `params.get("maybe")` は、キーが存在しない場合に例外を発生させる代わりに `None` を返します
- `params.to_dict()` はプレーンな辞書を返します
- 提供されていないキーを読み取ると、そのキー名と利用可能なキーの一覧を含むエラーが発生します

## 出力

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — `main` の戻り値です。下流のノードは `$nodeLabel.result.message` を読み取ります
- `logs` — コードが `print` に送ったすべての内容です。結果を破損しないよう別途キャプチャされます
- `install` — 依存関係をインストールしたツール（`uv`、`pip`、または `none`）とその出力です

## 依存関係

`requirements.txt` に、ローカルで記述するのとまったく同じようにパッケージを列挙します。

```
requests==2.32.3
feedparser
```

パッケージはコード実行前に `uv` によって使い捨てのディレクトリへインストールされます。`uv` がパッケージを扱えない場合、Heym は `pip` で再試行します。実行間でキャッシュされるものはないため、重い依存関係は実行ごとに数秒を追加します。`requirements.txt` を空のままにするとインストール手順が完全にスキップされ、目に見えて高速になります。

wheel を提供せず C コンパイラを必要とするパッケージはインストールに失敗します。その理由は `install.log` に表示されます。

## ネットワーク

| フェーズ | ネットワーク |
|-------|---------|
| 依存関係のインストール | 常に有効 — pip と uv は PyPI に到達する必要があります |
| コードの実行 | デフォルトでは無効。`codeAllowNetwork` で有効になります |

`codeAllowNetwork` が無効の場合、`requests.get(...)` のような外部呼び出しは接続エラーで失敗します。これが意図されたデフォルトです。ほとんどの Code ノードは、別のノードがすでに取得したデータを変換します。取得は **HTTP** ノードで行い、そのボディを `codeParameters` 経由で渡すことを推奨します。

## サンドボックスと制限

コードは、すべての Linux ケイパビリティが削除され、`no-new-privileges` が設定され、ルートファイルシステムが読み取り専用のコンテナ内で、非 root ユーザーとして実行されます。Docker ソケットも、バックエンドのシークレットや環境も一切受け取りません。

| 制限 | 値 |
|-------|-------|
| メモリ | 512 MB |
| CPU | 1 |
| プロセス | 256 |
| 依存関係インストールのタイムアウト | 120 秒 |
| 実行タイムアウト | 60 秒 |

これらはサンドボックスの固定プロパティであり、設定ではありません。

> **Docker が必要です。** Agent Python ツールやスキルとは異なり、Code ノードにはローカルフォールバックモードも、それを緩和する環境変数もありません。到達可能な Docker デーモンがない場合、ノードはバックエンドプロセスでコードを実行するのではなく、明確なエラーで失敗します。ネイティブの `./run.sh` 開発では、このノードを使用する前に Docker を起動してください。詳しくは [Security → Code node sandbox](../reference/security.md#code-node-sandbox) を参照してください。

## 適したノードがある場合はそちらを使う

| やりたいこと | 使用するノード |
|-------------|-----|
| CSV、TSV、XML の解析・生成、またはファイルの OCR | [Converter](converter-node.md) |
| HTTP API の呼び出し | [HTTP](http-node.md) |
| フィールドのマッピングや名前変更 | [Set](set-node.md) |
| 別の Workflow の実行 | [Execute](execute-node.md) |

**Code** に頼るのは、それらのノードにどうしても当てはまらないロジック — カスタムの計算、特注のパース、またはアルゴリズム — が必要な場合です。
## 例

上流のノードによって生成された行をスコアリングします：

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

`codeParameters` を `{ "rows": "$fetchRows.result" }` に設定すると、下流のノードは `$scoreRows.result.total` を読み取ります。
