# Templates 分頁

Templates 分頁讓您儲存、瀏覽並重複使用完整的 Workflow 與個別節點。將您建立過的內容分享出去，一鍵套用到新專案。

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ 觀看 Templates 示範</a></p>

## 概觀

Templates 分為兩種：

- **Workflow templates** — 將完整的 Workflow（所有節點與連線）儲存為可重複使用的起始範本。
- **Node templates** — 將單一已設定的節點（例如調校過的 LLM 節點或自訂 HTTP 節點）儲存起來，以便在不同 Workflow 之間重複使用。

使用分頁頂端的 **Workflows / Nodes** 切換開關在兩者之間切換。

使用搜尋列依名稱、描述、標籤或節點類型篩選顯示的 templates。

---

## 建立 Template

### Workflow template

1. 在編輯器中開啟您想分享的 Workflow。
2. 點擊頂端工具列中的 **Share as Template**。
3. 填寫名稱、描述與選填的標籤。
4. 選擇可見性：**Everyone**（所有使用者）或 **Specific users**（輸入使用者名稱及／或選擇團隊）。
5. 點擊 **Share**。綠色通知會確認成功。

### Node template

1. 在畫面上對任一節點按右鍵。
2. 從右鍵選單中選擇 **Share as Template**。
3. 填寫表單並點擊 **Share**。

---

## 使用 Template

### Workflow template

1. 開啟 **Templates** 分頁，確認已選取 **Workflows**。
2. 點擊卡片以預覽，或直接點擊 **Use**。
3. 該 Workflow 會被複製成新的 Workflow，並在編輯器中開啟。

### Node template

1. 開啟 **Templates** 分頁並選擇 **Nodes**。
2. 在 node template 卡片上點擊 **Use**。
3. 會出現對話框 — 選擇要將節點加入的位置：
   - **New workflow** — 建立僅包含此節點的全新 Workflow。
   - **Existing workflow** — 從您的 Workflow 清單中挑選；編輯器開啟時會自動插入該節點。

---

## 預覽

點擊任一 template 卡片以開啟完整預覽：

- **卡片縮圖** — template 卡片會為 Workflow 與單一節點 template 呈現符合尺寸的唯讀畫布快照。
- **Workflow templates** — 與編輯歷史預覽樣式一致的唯讀畫布，包含平移與縮放功能。
- **Node templates** — 儲存的節點會以單一節點預覽的形式，開啟於相同的唯讀畫布上。
- **節點詳細資料** — 點擊預覽中的任一節點，即可在側邊面板檢視其儲存的設定。
- 所有 templates 皆會顯示標籤、使用次數與 **擁有者**。

按下 **ESC** 或點擊外部即可關閉預覽。

---

## 管理 Templates

- **編輯** – 若您是 template 的擁有者，將游標停留在卡片上並點擊鉛筆圖示，即可更新其名稱、描述、標籤或可見性
- **刪除** – 若您是 template 的擁有者，將游標停留在卡片上，並在確認提示後刪除該 template
- **僅限擁有者的操作** – 編輯與刪除控制項僅會顯示於您建立的 templates

---

## 命令面板（CTRL+K）

Templates（包含 Workflow 與節點）可從 **CTRL+K** 命令面板搜尋。選擇 template 即可立即使用 — Workflow templates 會在編輯器中開啟，node templates 則會提示您選擇目的地。

---

## Chat 中的 Templates

您可以向 AI 詢問關於 templates 的問題 — 它知道您工作區中的所有 templates。

---

## 可見性

| 設定 | 誰能看到 |
|---|---|
| Everyone | 平台上的所有使用者 |
| Specific users | 您依名稱列出的使用者及／或您選擇的團隊 — 所有團隊成員皆可存取 |

以 **Specific users** 分享時，您可以同時加入個別使用者（依名稱）與團隊。團隊成員會在 Templates 分頁中看到該 template，並可使用它。

---

## 相關內容

- [Teams](../reference/teams.md) – 與團隊分享 templates
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – 儀表板分頁的簡短頁面導覽
