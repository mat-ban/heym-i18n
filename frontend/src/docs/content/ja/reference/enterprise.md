# Enterprise

Heym プラットフォーム向けの商用ライセンス、プロフェッショナルサポート、およびデプロイメントサービスです。

## 概要

Heym は、ソース公開ライセンスの下で無償で利用およびセルフホストが可能です。商用ライセンス、本番環境グレードのデプロイメント支援、または専任サポートを必要とする組織向けに、Enterprise プランでは Heym チームによるハンズオンサービスを提供します。

| サービス | 説明 |
|---------|-------------|
| **本番エージェントサポート** | アーキテクチャレビュー、エージェントおよび Workflow の設計ガイダンス、エージェントの本番運用に向けたハンズオン支援 |
| **ツールトレーニング** | Workflow エディタ、AI ノード、エージェント、各種統合を網羅する、お客様チーム向けのオンボーディングセッションおよびトレーニング |
| **Heym Q&A** | プラットフォームに関する質問、ベストプラクティス、トラブルシューティングのための Heym エンジニアリングチームへの直接アクセス |
| **Kubernetes デプロイメント** | マルチワーカーノード構成、サイドカーコンテナ、スケーリング戦略、Cluster 構成に関する支援 |
| **ソリューションコンサルティング** | 統合計画やアーキテクチャの推奨事項を含む、お客様固有のユースケースに合わせたカスタムソリューション設計 |
| **優先サポート & SLA** | 保証された応答時間と優先的な問題解決 |
| **カスタム開発** | お客様組織の要件に合わせた機能開発および改修 |

## Heym Work

[Heym Work](./heym-work.md) は、Heym の上で動作するビジネスチーム向けのインターフェースです。担当者が業務内容を説明していくつかの質問に答えるだけでテスト済みの Workflow を取得でき、専用に構築されたページから作業し、シングルサインオン（SSO）、Owner・Editor・Viewer ロール、およびすべての実行への名前記録を備えた状態でレビューに回答できます。独自のライセンスでお使いの Heym の隣で動作し、**Settings → Heym Work** から接続できます。詳細の確認やトライアルの申し込みは [heym.run/enterprise](https://heym.run/enterprise) から行えます。

## 本番エージェントサポート

Heym チームは、お客様のビジネスプロセス向けにエージェントおよび Workflow を設計、構築、堅牢化するお手伝いをします。これには、要件のレビュー、ノード構成の推奨、および信頼性、可観測性、ガバナンスに関するベストプラクティスに沿った Workflow の実現が含まれます。

サポートは、[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[Cron](../nodes/cron-node.md) Trigger など、すべてのノードタイプを対象とします。さらに、[マルチエージェントオーケストレーション](./agent-architecture.md)、[Human-in-the-Loop](./human-in-the-loop.md) チェックポイント、ブランチ間の[並列実行](./parallel-execution.md)といった高度なパターンもカバーします。

## ツールトレーニング

お客様チームのスキルレベルとユースケースに合わせたハンズオントレーニングセッションを提供します：

- Workflow エディタと[キャンバス機能](./canvas-features.md)
- AI 搭載ノード：[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[RAG](../nodes/rag-node.md)
- [エージェントアーキテクチャ](./agent-architecture.md)とマルチエージェントオーケストレーション
- [Credentials](./credentials.md) の管理と[サードパーティ統合](./integrations.md)
- [Trigger](./triggers.md)、[Webhook](./webhooks.md)、および [Cron](../nodes/cron-node.md) によるスケジューリング
- [Expression DSL](./expression-dsl.md)と[グローバル変数](./global-variables.md)
- [Teams](./teams.md) のコラボレーションと [Credentials 共有](./credentials-sharing.md)
- 顧客向けチャットインターフェースのための [Portal](./portal.md) デプロイメント
- AI Workflow の可観測性のための [Traces](../tabs/traces-tab.md) と [Evals](../tabs/evals-tab.md)

## Kubernetes デプロイメント

標準の[実行とデプロイメント](../getting-started/running-and-deployment.md)ガイドでは、単一サーバーの本番環境セットアップ向けの Docker Compose を扱っています。Enterprise のお客様には、高可用性と水平スケーリングのための本番 Kubernetes デプロイメントに関する支援を提供します：

- **複数のワーカーノード** — 冗長性と負荷分散のために Heym バックエンドワーカーを複数の Kubernetes ノードに分散配置
- **サイドカーコンテナ** — ログ収集、監視エージェント、サービスメッシュ（Istio、Linkerd）、シークレットインジェクション（Vault）のためのサイドカーパターンの構成
- **リソース計画** — CPU およびメモリの requests/limits、Pod Disruption Budget、Horizontal Pod Autoscaler ポリシー
- **ネットワーキング** — Ingress コントローラの構成、TLS 終端、バックエンド、フロントエンド、データベース Pod 間の内部サービス通信
- **永続ストレージ** — 適切な StorageClass とバックアップ戦略を伴うデータベースおよびベクトルストアのボリュームプロビジョニング
- **モニタリング** — コンテナメトリクス、ログ、アラートのための Prometheus、Grafana、または既存の可観測性スタックとの統合

## ソリューションコンサルティング

組織ごとに、エージェントを稼働させるシステムや制約は異なります。Heym チームは、以下の支援のためのコンサルティングを提供します：

- Heym がお客様固有のユースケースに適合するかの評価
- エンドツーエンドのエージェントおよび Workflow アーキテクチャの設計
- 既存インフラストラクチャおよびサードパーティサービスとの統合計画
- 複雑な Workflow のデバッグと本番環境の問題解決
- n8n、Zapier、Make.com などのツールからの既存 Workflow の移行

## お問い合わせ

ライセンスに関するお問い合わせ、価格、または introductory call のご予約は、**enterprise@heym.run** までご連絡ください。

## 関連項目

- [実行とデプロイメント](../getting-started/running-and-deployment.md) — Docker Compose による本番デプロイメント
- [セキュリティ](./security.md) — プラットフォームのセキュリティプラクティスと構成
- [並列実行](./parallel-execution.md) — マルチワーカー実行モデル
- [Teams](./teams.md) — チームコラボレーションとリソース共有
- [全機能セット](./features.md) — Heym の機能の完全な概要
- [Heym Work](./heym-work.md) — ビジネスチーム向けインターフェースと接続方法
