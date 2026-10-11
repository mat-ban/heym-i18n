# Logsタブ

**Logs**タブには、HeymスタックのDockerコンテナログが表示されます。デバッグ、監視、トラブルシューティングにご利用ください。Workflow実行ログ（ノードの結果や出力）については、WorkflowエディタのDebugパネルをご使用ください。詳細は[Canvas Features](../reference/canvas-features.md#execution-logs)をご参照ください。

Docker-backedログは、セルフホスト環境ではデフォルトで無効になっています。有効にするには、`DOCKER_LOGS_ENABLED=true`を設定し、`DOCKER_LOGS_ALLOWED_EMAILS`にDockerログへのアクセスを許可する信頼済みユーザーのメールアドレスをカンマ区切りで指定し、`/var/run/docker.sock`がバックエンドコンテナにマウントされていることを確認してください。デフォルトのDocker Composeサービスおよび直接の`docker run`の例には、DockerベースのMCP stdioツール用にこのマウントが含まれています。Dockerソケットの信頼境界を受け入れる場合にのみ、このマウントを維持してください。

登録がオープンになっている場合は、Dockerログを有効にする前に信頼済みの管理者アカウントを作成するか、`ALLOW_REGISTER=false`を維持してください。そうしないと、未検証の自己登録ユーザーが許可リストに含まれるメールアドレスを取得してしまう可能性があります。

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Logsデモを視聴</a></p>

## コンテナの選択

- **All Containers** – backend、frontend、PostgreSQLのログを統合表示
- **Backend** – `heym-backend`コンテナ
- **Frontend** – `heym-frontend`コンテナ
- **PostgreSQL** – `heym-postgres`コンテナ

## ログレベルフィルター

- **All** – すべてのログレベルを表示
- **INFO** – INFO以上
- **WARNING** – 警告およびエラー
- **ERROR** – エラーのみ
- **DEBUG** – Debug以上

## 検索

- テキスト検索でログをフィルタリング
- 一致した箇所はログ出力内でハイライト表示されます

## 機能

- **Auto scroll** – 新しいログが到着すると自動的に最下部までスクロール
- **Stream** – ログをリアルタイムでストリーミング（対応している場合）
- **Copy** – ログをクリップボードにコピー
- **Download** – ログをファイルとしてダウンロード

## ユースケース

- Workflow実行失敗のデバッグ
- APIリクエスト/レスポンスログの確認
- データベースクエリの監視
- 起動メッセージおよびヘルスメッセージの確認

## 関連項目

- [Canvas Features](../reference/canvas-features.md) – Workflow Debugパネルでの実行ログ
- [Traces Tab](./traces-tab.md) – LLMトレースの検査
- [Analytics Tab](./analytics-tab.md) – 実行メトリクス
- [Workflows Tab](./workflows-tab.md) – Workflow管理
- [Contextual Showcase](../reference/contextual-showcase.md) – ダッシュボード画面向けのコンパクトなページガイド
