# Plugin Trigger

**Plugin Trigger** ノードは、[Plugin ノード](./plugin-node.md) のトリガー形式に対応するノードです。これは `kind` が `trigger` であるインストール済みプラグインによって提供され、Workflow が開始する際の初期データを生成します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 0 |
| 出力 | 1 |
| 出力 | `$nodeLabel.<keys returned by the plugin>` |

トリガープラグインは、プラグインのハンドラーが Workflow の開始時に必要とするデータを返す限り、任意のソース（別のアプリケーション、サードパーティサービス、その他のテクノロジーなど）を表現できます。

## 使用するタイミング

インストール済みプラグインが Workflow を開始するトリガーを定義している場合に、Plugin Trigger ノードを使用します。Workflow の途中でアクションを実行するプラグインについては、代わりに [Plugin ノード](./plugin-node.md) を使用してください。

## 設定

Plugin ノードと同様に、設定フォームはプラグインの manifest フィールドから生成されます。シークレットではない文字列フィールドには式入力が使用され、シークレットフィールドはマスクされます。

## プラグインの実行方法

プラグインのコードは信頼済み（Heym が提供し、オペレーターがインストール）であり、インプロセスで実行されます。インストールは `HEYM_PLUGIN_ADMIN_EMAILS` に制限されており、このサブシステムは `HEYM_PLUGINS_ENABLED` によって制御されます。詳細は [Running & Deployment](../getting-started/running-and-deployment.md) を参照してください。

## プラグインの作成

トリガープラグインのパッケージを構築するには、zip のレイアウト、manifest フィールド、ハンドラーのシグネチャ、アイコン、依存関係、およびランタイムの信頼モデルについて、[Plugin Authoring](../reference/plugin-authoring.md) を参照してください。
