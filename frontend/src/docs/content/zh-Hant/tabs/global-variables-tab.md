# Variables 分頁

**Variables** 分頁負責管理 **Global Variable Store**——這是一份持久化的鍵值資料，會在所有 Workflow 之間共享。

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ 觀看 Variables 示範</a></p>

## 概觀

- 建立、編輯與刪除全域變數
- 變數隸屬於使用者範圍，並會跨 Workflow 執行持續保存
- 可透過 `$global.variableName` 在運算式中引用

## 建立變數

1. 點擊 **New Variable**
2. 輸入 **name**（用於運算式中）
3. 設定 **value**（字串、數字、布林值、陣列或物件）
4. 選擇 **value type**（Auto、String、Number、Boolean、Array、Object）

## 編輯與刪除

- **Edit** – 點擊變數列上的編輯圖示
- **Delete** – 點擊垃圾桶圖示；使用該變數的 Workflow 將需要替換
- **Bulk delete** – 選取多個變數後使用 **Delete selected**

## 在 Workflow 中使用

在任何運算式中引用變數：

```
$global.environment
$global.settings.baseUrl
```

您也可以透過啟用 **Store in Global Variable Store**，從 [Variable 節點](../nodes/variable-node.md) 設定全域變數。

## 相關內容

- [Global Variables](../reference/global-variables.md) – 參考指南
- [Variable 節點](../nodes/variable-node.md) – 使用 `isGlobal` 設定變數
- [Expression DSL](../reference/expression-dsl.md) – `$global` 語法
- [Chat 分頁](./chat-tab.md) – Chat 可存取全域變數
- [Contextual Showcase](../reference/contextual-showcase.md) – 儀表板介面的精簡頁面指南
