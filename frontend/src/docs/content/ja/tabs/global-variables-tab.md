# Variablesタブ

**Variables**タブでは、**Global Variable Store** を管理します。これは、すべてのWorkflow間で共有される永続的なキーと値のデータです。

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Variablesのデモを見る</a></p>

## 概要

- グローバル変数の作成、編集、削除
- 変数はユーザースコープであり、Workflowの実行をまたいで永続化されます
- 式の中で `$global.variableName` を介して参照できます

## 変数の作成

1. **New Variable** をクリックします
2. **name**（式で使用される名前）を入力します
3. **value**（文字列、数値、真偽値、配列、またはオブジェクト）を設定します
4. **value type**（Auto、String、Number、Boolean、Array、Object）を選択します

## 編集と削除

- **編集** – 変数の行にある編集アイコンをクリックします
- **削除** – ゴミ箱アイコンをクリックします。これを使用しているWorkflowでは、代替が必要になります
- **一括削除** – 複数の変数を選択し、**Delete selected** を使用します

## Workflowでの使用

任意の式で変数を参照できます：

```
$global.environment
$global.settings.baseUrl
```

また、[Variableノード](../nodes/variable-node.md)で **Store in Global Variable Store** を有効にすることで、グローバル変数を設定することもできます。

## 関連項目

- [Global Variables](../reference/global-variables.md) – リファレンスガイド
- [Variableノード](../nodes/variable-node.md) – `isGlobal` で変数を設定します
- [Expression DSL](../reference/expression-dsl.md) – `$global` 構文
- [Chatタブ](./chat-tab.md) – Chatはグローバル変数にアクセスできます
- [Contextual Showcase](../reference/contextual-showcase.md) – ダッシュボード画面向けのコンパクトなページガイド
