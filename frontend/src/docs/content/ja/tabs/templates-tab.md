# Templatesタブ

Templatesタブでは、完全なWorkflowや個別のノードを保存、閲覧、再利用できます。一度作成したものを共有し、新しいプロジェクトにワンクリックで適用できます。

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Templatesデモを見る</a></p>

## 概要

テンプレートには2種類あります：

- **Workflowテンプレート** — 完全なWorkflow（すべてのノードと接続）を再利用可能な出発点として保存します。
- **ノードテンプレート** — 設定済みの単一ノード（例：調整済みのLLMノードやカスタムHTTPノード）を、異なるWorkflow間で再利用できるように保存します。

タブ上部の**Workflows / Nodes**トグルで切り替えられます。

検索バーを使用して、名前、説明、タグ、またはノードタイプで表示中のテンプレートを絞り込めます。

---

## テンプレートの作成

### Workflowテンプレート

1. エディタで共有したいWorkflowを開きます。
2. 上部ツールバーの**Share as Template**をクリックします。
3. 名前、説明、任意のタグを入力します。
4. 公開範囲を選択します：**Everyone**（全ユーザー）または**Specific users**（ユーザー名を入力、および/またはチームを選択）。
5. **Share**をクリックします。緑色の通知で成功が確認できます。

### ノードテンプレート

1. キャンバス上の任意のノードを右クリックします。
2. コンテキストメニューから**Share as Template**を選択します。
3. フォームに入力し、**Share**をクリックします。

---

## テンプレートの使用

### Workflowテンプレート

1. **Templates**タブを開き、**Workflows**が選択されていることを確認します。
2. カードをクリックしてプレビューするか、直接**Use**をクリックします。
3. Workflowが新しいWorkflowとして複製され、エディタで開きます。

### ノードテンプレート

1. **Templates**タブを開き、**Nodes**を選択します。
2. ノードテンプレートカードの**Use**をクリックします。
3. ダイアログが表示されるので、ノードの追加先を選択します：
   - **New workflow** — このノードのみを含む新しいWorkflowを作成します。
   - **Existing workflow** — Workflowリストから選択します。エディタを開いたときにノードが自動的に挿入されます。

---

## プレビュー

任意のテンプレートカードをクリックすると、完全なプレビューが開きます：

- **カードサムネイル** — テンプレートカードには、Workflowと単一ノードテンプレートの両方について、読み取り専用キャンバスのフィット済みスナップショットが表示されます。
- **Workflowテンプレート** — 編集履歴プレビューと同じスタイルの読み取り専用キャンバスで、パンとズームが可能です。
- **ノードテンプレート** — 保存されたノードが、単一ノードプレビューとして同じ読み取り専用キャンバス上に開きます。
- **ノードの詳細** — プレビュー内の任意のノードをクリックすると、保存された設定をサイドパネルで確認できます。
- タグ、使用回数、**owner**がすべてのテンプレートに表示されます。

**ESC**を押すか、外側をクリックするとプレビューが閉じます。

---

## テンプレートの管理

- **Edit** – テンプレートのownerである場合、カードにカーソルを合わせて鉛筆アイコンをクリックすると、名前、説明、タグ、公開範囲を更新できます
- **Delete** – テンプレートのownerである場合、カードにカーソルを合わせて、確認Promptの後にテンプレートを削除できます
- **Owner専用の操作** – 編集と削除のコントロールは、自分が作成したテンプレートにのみ表示されます

---

## Command Palette（CTRL+K）

テンプレート（Workflowとノードの両方）は**CTRL+K** Command Paletteから検索できます。テンプレートを選択するとすぐに使用できます — Workflowテンプレートはエディタで開き、ノードテンプレートは追加先を尋ねます。

---

## Chatでのテンプレート

AIにテンプレートについて質問できます — ワークスペース内のすべてのテンプレートを認識しています。

---

## 公開範囲

| 設定 | 閲覧可能なユーザー |
|---|---|
| Everyone | プラットフォーム上の全ユーザー |
| Specific users | 名前で指定したユーザー、および/または選択したチーム — チームメンバー全員がアクセス権を取得します |

**Specific users**で共有する場合、個別ユーザー（名前指定）とチームの両方を追加できます。チームメンバーはTemplatesタブでテンプレートを確認し、使用できます。

---

## 関連項目

- [Teams](../reference/teams.md) – チームとテンプレートを共有する
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – ダッシュボードタブの簡単なページガイド
