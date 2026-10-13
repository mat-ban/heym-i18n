# Vectorstoresタブ

**Vectorstores**タブでは、[RAG](../nodes/rag-node.md)ノードで使用するベクターストアを管理します。ストアの作成、ドキュメントのアップロード、チームメンバーとの共有が可能です。

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vectorstoresのデモを見る</a></p>

## ベクターストアの作成

1. **New Vector Store** をクリックします
2. 名前と任意の説明を入力します
3. ベクターストアの **credential** を選択します – *RAG: Qdrant + OpenAI*（外部Qdrantサーバー）、*RAG: Psql + OpenAI*（pgvector経由のHeym独自のPostgresデータベース）、または *RAG: Custom Embeddings*（OpenAI互換のembedding Endpoint。いずれかのバックエンドを対象とします）。credentialによってストアのバックエンドが決まります。
4. 任意でカスタムコレクション名を設定します（デフォルトでは自動生成されます）
5. 保存します

> ストアのバックエンドは作成時にcredentialによって固定されます。RAGノードでは、**Database** ドロップダウンが一致するバックエンドのストアに絞り込みます。

## ドキュメントのアップロード

- **ファイルのアップロード** – ファイルをドラッグ＆ドロップまたは選択します（PDF、TXTなど）
- **重複の処理** – 重複するファイル名を上書きするかスキップするかを選択します
- **進捗** – 取り込み中はアップロードの進捗が表示されます

## コンテンツの管理

- **アイテムの表示** – ストアごとのソースグループとドキュメント数を確認できます。アップロードされたファイルはそのファイル名の下にグループ化されます。`source` を自身で持たない状態で [RAGノード](../nodes/rag-node.md) が保存したドキュメントは、**Added workflow: _name_** の下にグループ化され、書き込んだWorkflowの名前が付けられます
- **ソースの削除** – 特定のファイルまたはソースグループをストアから削除します。1つのWorkflowが追加したすべての内容も含まれます
- **ストアの編集** – 名前、説明、credentialを変更します
- **検索** – `POST /api/vector-stores/{id}/search` に `query`（および 1〜20 の `limit`、デフォルトは 5）を指定すると、RAG ノードの検索が返すチャンクを一致度の高い順に、それぞれのスコアとソース付きで返します。Heym Work の RAG 画面ではこれを使用して検索（Retrieval）をテストします

## 共有

- メールアドレスで他のユーザーとベクターストアを共有できます
- 共有されたストアにはインジケーターが表示されます
- ストアカードのメニューから共有を解除できます

## Workflowでの使用

[RAGノード](../nodes/rag-node.md)で、名前を指定してベクターストアを選択します。ノードは関連するチャンクを取得し、それらでLLMコンテキストを拡張します。

## 関連項目

- [Credentialsタブ](./credentials-tab.md) – ベクターストアのcredential設定（Qdrant、Postgres、またはカスタムembedding）
- [RAGノード](../nodes/rag-node.md) – ノードリファレンス
- [Workflowsタブ](./workflows-tab.md) – RAGを使用するWorkflowの作成
- [Contextual Showcase](../reference/contextual-showcase.md) – ダッシュボード画面のコンパクトなページガイド
