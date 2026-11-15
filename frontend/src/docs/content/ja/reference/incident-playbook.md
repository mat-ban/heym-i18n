# Heym Incident Playbook (L0)

このプレイブックを使用して、Heym のインシデントを確認し、ユーザーへの影響を評価し、重大度（severity）を選択して、適切な復旧手順と担当者に迅速にアクセスします。

詳細な手順：[Heym Runbook (L1)](./operations-runbook.md)

最終確認日: 2026-11-10。対象範囲: Docker Compose または Kubernetes 上のセルフホスト Heym（単一インスタンスまたは Cluster）。

## デプロイメントの引き継ぎ (Deployment handover)

オンコール（on-call）でこれらのドキュメントを使用する前に、各環境に合わせてこのテーブルを記入してください。名前、URL、容量目標、および復旧目標はデプロイメント固有のものです。リポジトリの例は本番環境のインベントリではありません。

| 項目 | デプロイメント固有の値 |
| --- | --- |
| 環境および Heym 公開 URL | `<environment>`, `<public-url>` |
| プラットフォームのオンコール担当者および副担当 | `<rotation-or-contact>`, `<backup-contact>` |
| インシデントチャンネルおよびインシデント管理システム | `<channel>`, `<tracker-url>` |
| データベースのオンコール担当者およびデータベース識別子 | `<contact>`, `<database-id>` |
| インフラ、ネットワーク、ストレージの責任者 | `<contacts>` |
| リリース責任者およびデプロイメントシステム | `<contact>`, `<deployment-url>` |
| アプリケーションエラー、レイテンシ、可用性のダッシュボード | `<dashboard-url>` |
| ホストまたは Pod の CPU、メモリ、ディスク、再起動ダッシュボード | `<dashboard-url>` |
| PostgreSQL 接続、ロック、ディスク、レプリケーションのダッシュボード | `<dashboard-url>` |
| ログおよびオプションの OTel Trace バックエンド | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose プロジェクト/ファイルまたは Kubernetes コンテキスト/名前空間 | `<exact-target>` |
| Main、Worker、データベース、ストレージの配置場所 | `<services-or-deployments>`, `<storage-ids>` |
| 承認されたスモーク Workflow と期待される結果 | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| データベースおよびファイルのバックアップ手順、最新のリストアテスト | `<procedure-url>`, `<test-date>` |
| 目標復旧時間および目標復旧時点 (RTO, RPO) | `<RTO>`, `<RPO>` |

連絡先とダッシュボードのリンクは、デプロイメントのアクセス制限された運用環境用コピーに保管してください。証拠資料には、認証情報や Workflow Payload ではなく、ID、タイムスタンプ、カウント、サニタイズされたエラーを含める必要があります。

## プラットフォームインベントリ

| コンポーネント | 責任 | インシデントへの影響 |
| --- | --- | --- |
| フロントエンドおよび Main バックエンド | UI、API、MCP、Portal、インタラクティブ実行 | パブリックルートと Main プロセスを個別に確認する |
| PostgreSQL | アプリケーション状態、実行レジストリ、Run Queue、同時実行スロット、調整、通知 | データベースの停止により、リクエスト処理とバックグラウンド実行の両方が停止する可能性がある |
| Worker インスタンス（Cluster モード有効時） | キューに入れられた実行可能なバックグラウンド実行 | 正常な Worker は Main のパブリック Endpoint を代替しない |
| 選出された Leader プロセス | Cron、アラート評価、バックグラウンド調整 | 互換性のある Worker が Leader になることができる。これにより役割が Main に変わるわけではない |
| Main の永続ストレージ | Drive ファイル、インストール済みプラグイン、Coding-Agent ワークスペース | Main と共にストレージを復旧する。Ingress を Worker にルーティングしてもストレージは復旧しない |
| 各実行インスタンス上の Sandbox バックエンド | 隔離実行のための Docker コンテナまたは Kubernetes Pod | Sandbox バックエンドに障害が発生すると、UI が稼働していても選択したノードに影響を与える可能性がある |
| Workflow の依存関係 | モデルプロバイダー、MCP サーバー、外部 API、データストア、メッセージングサービス | 単一の依存関係の障害か、プラットフォーム全体の障害かを特定する |
| オプションの OTel コレクター | エクスポートされた Workflow、ノード、Agent ツール Span | エクスポートされた Trace の欠落のみでは、実行が失敗したことを証明できない |

Heym の組み込み Run Queue は PostgreSQL を使用します。Redis、RabbitMQ、およびベクトルストアは Workflow の依存関係になる可能性がありますが、組み込みキューの必須サービスではありません。

`GET /api/health` はプロセスのヘルスとバージョンのみを報告します。PostgreSQL、キュー、Leader 選出、Sandbox 容量、認証情報の同期はテストされません。正常（グリーン）な応答は単一のチェックにすぎず、エンドツーエンドの準備完了を保証するものではありません。

## 最初の 5 分間

| ステップ | アクション | 判断または証拠 |
| --- | --- | --- |
| 1 | アラートを確認し、環境、サービス、開始時刻を検証する | UTC タイムスタンプと直近のリリース/設定変更を記録する |
| 2 | パブリック UI と `/api/health`、次に直接 Main バックエンドを確認する | 直接バックエンドが正常でパブリックアクセスが失敗している場合、ルーティングまたはフロントエンドの問題を示す |
| 3 | PostgreSQL の接続性と接続プールの負荷を確認する | アプリケーションサービスを再起動する前に、データベース障害を L1 にルーティングする |
| 4 | コンテナ/Pod の状態、CPU、メモリ、ストレージ、直近のエラーを確認する | インフラ障害、高負荷、Workflow 固有の障害を切り分ける |
| 5 | Cluster モードで **設定 > インスタンス**、キューの状態、Leader の証拠を確認する | Main の喪失、オフライン/不一致の Worker、または Main 専用タスクを特定する |
| 6 | 重大度を割り当て、ルーティングテーブルから 1 つの緩和策を開始する | P1/P2 の場合は直ちにインシデントを起票し、関連する責任者を招集する |
| 7 | 安全な本番モードのスモーク Workflow 実行を検証し、復旧を監視する | キュー滞留時間（Queue Age）、エラー、リソースの改善を確認し、次回の更新時刻を設定する |

リリースが障害と重なっている場合は、[不適切なデプロイまたは設定のデグレ](./operations-runbook.md#bad-deployment-or-configuration-regression) を確認してください。ロールバック前にスキーマの互換性を検証してください。

## 重大度と対応基準

これらは初期対応目標です。デプロイメントのインシデントポリシーやビジネスへの影響がより厳格な場合は、それを適用してください。

| 重大度 | 事例 | 対応 |
| --- | --- | --- |
| P1 | Main が全ユーザーに対して利用不可、データベース停止または書き込み失敗、広範な実行失敗、重要インテークの停止 | 即時緩和、インシデント記録、プラットフォームおよび依存関係オンコールの招集 |
| P2 | バックログの増加、Worker 容量の喪失、接続枯渇の逼迫、共有容量を低下させる単一 Workflow、繰り返す OOM | 直ちに緩和を開始、15分以内の封じ込めを目標、インシデント記録 |
| P3 | 単一の Workflow/プロバイダーの障害、プラットフォーム全体の正常容量下での限定的影響 | Workflow または依存関係の責任者による追跡、オンコールメモの記録 |
| P4 | 情報提供シグナル、予想される容量傾向、確認済みの誤検知 | 確認、記録、必要に応じて監視の調整 |

## シグナルから L1 へのルーティング

アラートリンクを設定する際は、これらの相対アンカーを使用してください。監視サービスに絶対 URL が必要な場合は、ホストされた運用環境用コピーの場所をプレフィックスとして付与してください。

| シグナル | 参照先 |
| --- | --- |
| UI/API 利用不可、パブリック 5xx、プロセスヘルスチェック失敗 | [UI または API の停止](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL 接続不可、接続拒否、書き込み失敗 | [データベースの停止](./operations-runbook.md#postgresql-down-or-not-writable) |
| クライアント過多、プールタイムアウト、ロック待機、アクティブ接続急増 | [データベース接続とロック](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| バックエンド/Worker の計画的な再起動が必要 | [サービスの再起動](./operations-runbook.md#controlled-service-restart) |
| 実行回数、合計時間、Token、CPU、メモリの急増 | [最もリソースを消費する Workflow](./operations-runbook.md#most-resource-consuming-workflows) |
| キューの増加、実行が待機中または停止しているように見える | [キューの滞留](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| オフライン/不一致インスタンス、アイドル Worker、スケジューラまたは配信の問題 | [Cluster チェック](./operations-runbook.md#cluster-mode-checks) |
| Worker が正常な状態で Main インスタンスを喪失 | [Main インスタンスが利用不可](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook エラー、MCP/Portal 障害、SSE 切断 | [Ingress および実行 Endpoint](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM、CrashLoop、Pending、ディスクフル、Persistent Volume 障害 | [コンテナ、Pod、またはストレージの問題](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| イメージ、環境、またはスキーマ変更後のエラー増加 | [不適切なデプロイ](./operations-runbook.md#bad-deployment-or-configuration-regression) |
| Agent/LLM/MCP プロバイダーエラー、429、認証情報の失敗 | [モデルまたは統合の障害](./operations-runbook.md#model-credential-or-integration-failure) |
| Code/Playwright/Skill/Coding-Agent Sandbox 障害 | [Sandbox 障害](./operations-runbook.md#sandbox-failure) |
| 復旧が目標を満たせない、データベースまたはファイルの喪失 | [復旧および災害対応](./operations-runbook.md#recovery-and-disaster-response) |

## エスカレーション

| 状況 | 招集先 | 提供情報 |
| --- | --- | --- |
| 複数の機能面または Workflow に影響 | プラットフォームオンコールおよびインシデントリード | 環境、範囲、開始時刻、緩和策、次回更新時刻 |
| データベース停止、飽和、ロック、ディスク枯渇 | データベースオンコール | データベース ID、接続数、ブロック PID、サニタイズされたエラー、ストレージ状態 |
| Pod/ノード障害、ストレージアタッチ、Sandbox 容量不足 | インフラ/ストレージ責任者 | コンテキスト、名前空間、ワークロード、Pod イベント、リソース圧迫 |
| 直接バックエンドは稼働しているがパブリックルートが失敗 | ネットワーク/Ingress 責任者 | 影響を受けるルート、ステータスコード、レイテンシ、バックエンド比較 |
| 単一の Workflow が負荷を独占または単独で失敗 | Workflow 責任者 | Workflow/実行 ID、Trigger ソース、レート、時間枠、一時的な制限 |
| 関連するデプロイ/設定の変更 | リリース責任者 | 稼働中のイメージダイジェスト、展開時刻、スキーマリビジョン、直近の正常バージョン |
| プロバイダーのクォータ/認証/可用性の問題 | 認証情報または統合の責任者 | プロバイダー、モデル/サービス、ステータスコード、安全な場合はリクエスト ID（シークレットを除く） |

最初の緩和策の後も P1/P2 の影響が続く場合は、すでに収集された証拠をもとに直ちにエスカレーションしてください。完全な根本原因の特定を待つ必要はありません。

## 障害時の想定挙動

| 障害 | 継続可能な機能 | 最初のアクション |
| --- | --- | --- |
| PostgreSQL 停止 | 静的フロントエンドはロード可能な場合がある | データベースパスを復旧する。すべてのアプリケーションインスタンスを再起動しない |
| Main 停止、Worker 正常 | 互換性のある Worker が Leader となった場合、適格なバックグラウンド作業とスケジュールは継続可能 | 永続ストレージと共に Main を復旧する。パブリック UI/API/MCP/Portal は停止したまま |
| Worker 停止 | 再割り当てに伴い、他の適格なインスタンスがキューに入った作業を引き継ぐ | トラフィックを追加する前に、配置、予備容量、復旧状況を確認する |
| 中断された実行 | 適格な復旧可能実行は、最初から 1 回だけ再開可能 | 手動で再実行する前に、自動復旧と外部の副作用を確認する |
| Main 専用ワークロードの過負荷 | Worker はアイドルのままの可能性がある | 違反しているインテークを減らすか、Main の容量を増やす。ウェイト変更では固定されたタスクを移動できない |
| 内部アラート停止 | 外部の稼働時間/DB/インフラ監視は継続して動作可能 | Heym 外部の監視を使用する。Heym のアラートは同じ DB とスケジューラに依存している |
| Sandbox またはプロバイダー停止 | その依存関係を持たない Workflow は動作可能 | 影響を受ける Workflow を隔離し、依存関係を修復する |

## 復旧とインシデントの完了

1. パブリックアクセス、データベースアクセス、想定されるインスタンスの適格性、および安全な本番モードのスモーク Workflow を確認します。エディタでのテストでは Worker へのディスパッチは証明されません。
2. エラーの安定、レイテンシ、リソース使用率、およびキュー滞留時間（Queue Age）の減少を最低 10 分間観察します。また、次に予定されている重要なスケジュールタスクまたは合意された同等のスモークチェックを監視します。
3. 失敗、復旧、スキップ、期限切れ、保留中の各実行について、Workflow の責任者と照合します。再実行する前に外部の副作用を確認してください。
4. 一時的な Trigger の一時停止、制限、および Worker ウェイトを段階的に復元します。残存する各制限に責任者と有効期限を割り当てます。
5. 影響、UTC タイムライン、対応内容、証拠、および残存リスクをインシデントに記録します。P1/P2 の根本原因レビューを割り当て、手順が不足していた場合は両方のドキュメントを更新します。

## 関連運用リファレンス

- [L1 コマンドの設定と確認](./operations-runbook.md#command-setup)
- [実行とデプロイ](../getting-started/running-and-deployment.md)
- [負荷分散](./cluster.md)
- [Kubernetes デプロイ](../getting-started/kubernetes.md)
- [セキュリティとキーのローテーション](./security.md)
