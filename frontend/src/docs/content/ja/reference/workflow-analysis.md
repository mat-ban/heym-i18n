# Workflow 分析

**Workflow Analysis** は、Workflow ごとに 1 つの共有・編集可能な Markdown ドキュメントを保持する左側のパネルです。Workflow の役割を説明したり、改善アイデアを記録したりするために使用でき、AI に初稿を生成させることもできます。

このドキュメントは共有されます。Workflow にアクセスできる全員が閲覧・編集できます。ドキュメントは Workflow とともに保存され、Workflow が削除されると自動的に削除されます。

## パネルを開く

1. エディターで Workflow を開きます。
2. エディターツールバーの **Analyze**（Sparkles アイコン）をクリックします。
3. パネルが左側に開きます。パネルが開いている間はノードパレット（左パネル）が折りたたまれ、ノードパレットを再度開くと分析パネルが閉じます。

このパネルは保存済みの Workflow でのみ利用できます。新規作成した未保存の Workflow では、まず保存してください。

## ドキュメント

パネルには 1 つの Markdown ドキュメントが表示され、**Edit**（鉛筆）ボタンと **Preview**（目）ボタンで 2 つのビューを切り替えられます。

| ビュー | 用途 |
|------|---------|
| **Edit** | プレーンな Markdown エディター（textarea）。 |
| **Preview** | レンダリングされた Markdown。 |

ヘッダーには、ドキュメントを**最後に編集したユーザー**とその日時が表示されます。

### 保存

**Save** をクリックすると変更が保存されます。Save は未保存の編集がある場合にのみ有効になります。

ドキュメントは共有されるため、保存には楽観的同時実行制御が使用されます。

- パネルを開いてから他のユーザーが新しいバージョンを保存していた場合、あなたの保存は拒否され、他の編集者の名前を示す警告が表示されます。
- その後、**Reload (discard mine)** を選択してサーバー側のバージョンを受け入れるか、**Overwrite** を選択してあなたのバージョンで強制的に上書きするかを選べます。

## AI 分析

パネル上部で LLM の **Credential** と **Model** を選択します（モデル一覧は選択した Credential から読み込まれます。詳細は [Credentials](../tabs/credentials-tab.md) を参照してください）。その後、分析を実行します。

- **Analyze my workflow** — ドキュメントが空の場合に表示されます。AI が生成した Markdown レポートを未保存の下書きとしてエディターに直接ストリーミングします。内容を確認・編集してから **Save** してください。
- **Reanalyze** — ドキュメントにすでに内容がある場合に表示されます。新しいレポートを別の **preview** にストリーミングし、現在のドキュメントはそのまま保持します。**Accept** を選択するとエディターの内容を新しい分析結果で置き換え、**Discard** を選択すると元の内容を保持します。

どちらの操作も、まず **Workflow を実行**し（Workflow が有効かつ実行可能な場合）、その実行結果を分析 Prompt に含めます。これにより、レポートは Workflow の実際の動作を反映したものになります。Workflow を実行できない場合は、代わりに静的な構造に基づいて分析が進められます。

生成されるレポートは、順に 3 つのセクションで構成されます。**Improvement areas**（Workflow が Credential、ユーザー入力、外部リクエスト、データ露出に触れる場合は **security** の観点も含む具体的な提案）、Workflow の **Purpose**、そして **What it does**（ノードを順を追って説明するステップバイステップの解説）です。

**Improvement areas** セクションでは、常に次の 4 つの明示的なチェックが実行されます。

1. **Error coverage** — キャンバスに [Error Handler](../nodes/error-handler-node.md) ノードがなく、エラー Workflow も設定されていない場合、レポートはこの点を指摘し、エラーハンドリングの追加を推奨します。
2. **Time saved** — 1 回の実行あたりの推定節約時間が設定されていない場合、レポートは [Analytics](../tabs/analytics-tab.md) の **Time Saved** メトリクスが表示されるよう設定することを推奨します。
3. **Network nodes** — ネットワーク呼び出しを行うノード（[HTTP](../nodes/http-node.md) や各種連携ノードなど）について、レポートはそれらのノードに固有のエラーハンドリング（retry および／または continue-on-error）を推奨します。
4. **Alerts** — Workflow に [alerts](../tabs/alerts-tab.md) が設定されていない場合、レポートは本番稼働前にアラートを設定することを推奨します。

5. **Evals**: Workflow にエージェントスイートのない [Agent ノード](../nodes/agent-node.md)が含まれている場合、レポートは [Evals](../tabs/evals-tab.md#agent-suites) で **Agent Suite**（または **Prompt Suite**）を作成することを推奨します。[LLM](../nodes/llm-node.md) ノードが含まれている場合は、複数のモデル間でその Prompt をテストするために **Prompt Suite** を推奨します。

### Properties から Analyzer を実行する

キャンバスにノードがあるものの、まだ分析ドキュメントがない場合、Workflow レベルの [Properties](./canvas-features.md) パネル（ノードが選択されていないときに表示されます）に **Run Analyzer** ボタンが表示されます。これをクリックするとこの Workflow Analysis パネルが開き、Credential と Model を選択してレポートを生成できます。

各分析の実行は、[Traces](../tabs/traces-tab.md) の **Workflow Analysis** ソースに記録されます。

LLM の Credential が設定されていない場合、Analyze ボタンは無効になります。[Credentials Tab](../tabs/credentials-tab.md) で追加してください。

## 関連項目

- [AI Assistant](./ai-assistant.md) — 自然言語から Workflow ノードを生成・変更します。
- [Sticky Note](../nodes/sticky-note-node.md) — キャンバス上に直接貼り付ける短いメモ用です。
