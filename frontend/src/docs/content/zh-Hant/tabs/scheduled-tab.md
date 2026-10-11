# Scheduled 分頁

**Scheduled** 分頁以視覺化日曆呈現所有啟用中的 Cron Workflow。您可以在日、週、月檢視之間切換，查看自動化排程的執行時間。

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ 觀看 Scheduled 示範</a></p>

## 檢視

- **Day** – 所選日期的逐小時時間軸；每次執行會以其排程時間顯示為一個區塊
- **Week** – 涵蓋當週的七欄網格；當多個 Workflow 在同一小時觸發時，區塊會堆疊顯示
- **Month** – 完整月份網格；每個儲存格列出當天排程執行的 Workflow

## Workflow 區塊

每個區塊顯示：

- **Workflow 名稱** – 點擊即可直接開啟 Workflow 畫布
- **Cron 表達式** – 游標懸停時顯示，呈現原始排程（例如 `0 9 * * 1-5`）

## 導覽

列於 `HEYM_ADMIN_EMAILS` 的 Instance 管理員在勾選 **Show all workflows** 時，可查看每位擁有者的排程。取消勾選則僅顯示自己的 Workflow。其他使用者則保留 **Show shared with me** 選項。若要停用員工的自動化，請使用 Workflows 預覽上的 [instance administration controls](./workflows-tab.md#instance-administration) 來暫停或恢復 Trigger。

- 使用 **previous / next** 箭頭切換日、週或月
- **Today** 按鈕可立即返回當前日期

## 相關內容

- [Cron Node](../nodes/cron-node.md) – 在畫布上設定排程 Trigger
- [Workflows Tab](./workflows-tab.md) – 管理與組織所有 Workflow
- [Analytics Tab](./analytics-tab.md) – 執行指標與趨勢
