# Teamsタブ

**Teams**タブでは、Workflow、credentials、variables、vector stores、Driveファイルをユーザーのグループと共有するためのチームを作成・管理できます。

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Teamsデモを見る</a></p>

## チームの作成

1. **New Team**をクリックします
2. 名前と任意の説明を入力します
3. **Create**をクリックします

自動的にあなたがチームの作成者となり、最初のメンバーになります。

## メンバーの管理

- **メンバーの追加** – チーム詳細ダイアログでユーザーのメールアドレスを入力し、**Add**をクリックします
- **メンバーの削除** – メンバーの横にあるXをクリックします（作成者は削除できません）
- **チームの編集** – 作成者は名前と説明を編集できます
- **チームの削除** – 作成者はチームを削除できます。チーム共有はすべて削除されます
- **共有リソース** – チーム詳細ダイアログには、チームと共有されているWorkflow、credentials、variables、vector stores、Driveファイル、Workflowテンプレート、ノードテンプレートが表示されます。Workflowをクリックするとエディタで開きます。その他のリソースについては、該当するタブに切り替えてください。

## チームとの共有

以下の場所からチームとリソースを共有できます：

- **Workflows** – Workflowエディタの共有ダイアログ
- **Workflow Templates** – Workflowテンプレートの作成・編集時の共有ダイアログ（公開範囲: Specific users）
- **Node Templates** – ノードテンプレートの作成・編集時の共有ダイアログ（公開範囲: Specific users）
- **Credentials** – Credentialsタブの共有ダイアログ
- **Variables** – Variablesタブの共有ダイアログ
- **Vector Stores** – Vectorsタブの共有ダイアログ
- **Dashboards** – Dashboardタブのダッシュボード設定（読み取りまたは書き込み）
- **Drive Files** – Driveタブの共有ダイアログ、またはDriveノードの`shareWithMyTeams` / `unshareWithMyTeams`オペレーション

チームと共有すると、すべてのチームメンバーがアクセスできるようになります。詳細は[Teams](../reference/teams.md)をご参照ください。

Workflowをチームと共有する場合は、そのWorkflowが依存するcredentialsとサブWorkflowも同じチームと共有してください。Workflowへのアクセス権限だけでは、credentialsや子Workflowへのアクセス権限は付与されません。

## Chat連携

[Chatタブ](./chat-tab.md)のAIアシスタントは、あなたのチームを一覧表示できます。「my teams」と尋ねると、所属しているチームを確認できます。

## 関連項目

- [Teams](../reference/teams.md) – Teamsのリファレンスと共有モデル
- [Credentials Sharing](../reference/credentials-sharing.md) – ユーザーおよびチームとのcredentials共有
- [Workflow Organization](../reference/workflow-organization.md) – フォルダと共有
- [Contextual Showcase](../reference/contextual-showcase.md) – ダッシュボード画面のコンパクトページガイド
