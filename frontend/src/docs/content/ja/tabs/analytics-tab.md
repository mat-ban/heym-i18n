# Analyticsタブ

**Analytics**タブでは、Workflowの実行メトリクスとトレンドを確認できます。使用状況やパフォーマンスを監視し、ボトルネックを特定できます。

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Analyticsデモを見る</a></p>

## サマリー統計

- **総実行回数** – 選択期間内のWorkflow実行回数
- **成功率** – 成功した実行の割合
- **平均所要時間** – 実行時間の平均値
- **節約時間** – 推定される合計節約時間：各Workflowに設定された実行あたりの節約分数 × 成功実行回数を、選択期間全体で合計したもの
- **トレンド** – 前期間との比較を示す増減インジケーター

## 期間

- **24h** – 過去24時間
- **7d** – 過去7日間
- **30d** – 過去30日間
- **All** – 利用可能な全履歴

## Workflowフィルター

- 特定のWorkflowでメトリクスを絞り込み
- **All workflows** – すべてのWorkflowを集計

## テーブル

Workflowの使用状況を示す2つのテーブルがあります：**Most Used**（幅広）と**Most Failed**です。

- **Time Saved** – Most Usedには、各Workflowの合計節約時間（実行あたりの節約分数 × 成功実行回数）が表示されます。**Not Set**は推定値が未設定であることを示します。クリックすると、そのWorkflowの該当フィールドが開きます。
- **並べ替え可能な列** – 列ヘッダーをクリックすると、その列で並べ替えられます。もう一度クリックすると昇順・降順が切り替わります。矢印インジケーターが並べ替え方向を示します。
- **モバイルラベル** – 小さい画面では、テーブルが横スクロールなしで収まるように列ラベルが短縮されます（例：「Executions」→「Runs」、「Success」→「OK」、「Error」→「Err」）。

## チャート

- **Execution Volume Over Time** – 時間バケットごとの実行回数を示す折れ線グラフ
- **Success vs Error Rate** – 正常実行と失敗実行を比較するエリアチャート
- **Average Latency Over Time** – 応答時間の変化を示す折れ線グラフ
- **ドラッグで選択** – 任意のチャート上でクリック＆ドラッグすると、カスタム日付範囲にフォーカスできます
- **選択モード** – 選択した範囲は、基本プリセットを変更せずにサマリーカード、チャート、Workflowテーブルを更新します
- **Clear Selection** – 詳細分析が完了したら、プリセットの期間に戻ります

## 自動更新

- 自動更新を有効にすると、手動で再読み込みせずにメトリクスを最新の状態に保てます

## 関連項目

- [Workflowsタブ](./workflows-tab.md) – 計測対象のWorkflow
- [Tracesタブ](./traces-tab.md) – 詳細なトレースの検査
- [Logsタブ](./logs-tab.md) – デバッグ用のランタイムログ
- [Contextual Showcase](../reference/contextual-showcase.md) – ダッシュボード画面向けのコンパクトなページガイド

チャートに表示されるトレンドを監視するのではなく通知してほしい場合は、[alert](./alerts-tab.md)に変換できます。エラー数、実行時間、LLM支出、実行回数は、いずれも時間枠に対してしきい値を設定できます。
