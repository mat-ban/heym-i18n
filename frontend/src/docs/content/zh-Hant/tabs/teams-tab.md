# Teams 分頁

**Teams** 分頁讓您建立與管理團隊，以便與一群使用者分享 Workflow、Credentials、變數、向量儲存與 Drive 檔案。

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ 觀看 Teams 示範</a></p>

## 建立團隊

1. 點擊 **New Team**
2. 輸入名稱與選填的描述
3. 點擊 **Create**

您會自動成為團隊建立者與第一位成員。

## 管理成員

- **新增成員** – 在團隊詳細資料對話框中輸入使用者電子郵件，然後點擊 **Add**
- **移除成員** – 點擊成員旁的 X（建立者無法被移除）
- **編輯團隊** – 建立者可編輯名稱與描述
- **刪除團隊** – 建立者可刪除團隊；所有團隊分享都會被移除
- **已分享的資源** – 團隊詳細資料對話框會顯示與該團隊分享的 Workflow、Credentials、變數、向量儲存、Drive 檔案、Workflow 範本與節點範本。點擊 Workflow 即可在編輯器中開啟；切換至對應的分頁即可查看其他資源。

## 與團隊分享

您可以從下列位置將資源分享給團隊：

- **Workflows** – Workflow 編輯器中的分享對話框
- **Workflow Templates** – 建立/編輯 Workflow 範本時的分享對話框（可見性：Specific users）
- **Node Templates** – 建立/編輯節點範本時的分享對話框（可見性：Specific users）
- **Credentials** – Credentials 分頁中的分享對話框
- **Variables** – Variables 分頁中的分享對話框
- **Vector Stores** – Vectors 分頁中的分享對話框
- **Dashboards** – Dashboard 分頁中的 Dashboard 設定（讀取或寫入）
- **Drive Files** – Drive 分頁中的分享對話框，或 Drive 節點的 `shareWithMyTeams` / `unshareWithMyTeams` 操作

當您與團隊分享時，所有團隊成員都會取得存取權。詳情請參閱 [Teams](../reference/teams.md)。

當您與團隊分享 Workflow 時，也請將該 Workflow 所依賴的 Credentials 與子 Workflow 分享給同一個團隊。僅有 Workflow 存取權並不會授予 Credential 或子 Workflow 的存取權。

## Chat 整合

[Chat 分頁](./chat-tab.md)的 AI 助理可以列出您的團隊。詢問「my teams」即可查看您所屬的團隊。

## 相關內容

- [Teams](../reference/teams.md) – Teams 參考與分享模型
- [Credentials Sharing](../reference/credentials-sharing.md) – 與使用者和團隊分享 Credentials
- [Workflow Organization](../reference/workflow-organization.md) – 資料夾與分享
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard 介面的精簡頁面指南
