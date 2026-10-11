# Scheduledタブ

**Scheduled**タブでは、アクティブなすべてのCron Workflowがビジュアルカレンダー上に表示されます。日・週・月のビューを切り替えて、自動化がいつ実行されるようにスケジュールされているかを確認できます。

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Scheduledデモを視聴する</a></p>

## ビュー

- **日** – 選択した日の時間ごとのタイムライン。各実行はスケジュールされた時刻にブロックとして表示されます
- **週** – 現在の週にわたる7列のグリッド。複数のWorkflowが同じ時間に実行される場合、ブロックが積み重なって表示されます
- **月** – 月全体のグリッド。各セルにその日に実行される予定のWorkflowが一覧表示されます

## Workflowブロック

各ブロックには以下が表示されます：

- **Workflow名** – クリックするとWorkflowキャンバスを直接開きます
- **Cron式** – ホバー時に表示され、生のスケジュール（例：`0 9 * * 1-5`）を確認できます

## ナビゲーション

`HEYM_ADMIN_EMAILS`に登録されているインスタンス管理者は、**Show all workflows**をチェックするとすべてのオーナーのスケジュールを確認できます。チェックを外すと自分のWorkflowのみが表示されます。その他のユーザーには**Show shared with me**オプションが引き続き表示されます。従業員の自動化を停止するには、Workflowsプレビューの[インスタンス管理コントロール](./workflows-tab.md#instance-administration)を使用してTriggerを一時停止または再開してください。

- **前へ / 次へ**の矢印を使用して、日・週・月を移動します
- **Today**ボタンをクリックすると、現在の日付に即座に戻ります

## 関連項目

- [Cronノード](../nodes/cron-node.md) – キャンバス上でスケジュールされたTriggerを設定する
- [Workflowsタブ](./workflows-tab.md) – すべてのWorkflowを管理・整理する
- [Analyticsタブ](./analytics-tab.md) – 実行メトリクスとトレンド
