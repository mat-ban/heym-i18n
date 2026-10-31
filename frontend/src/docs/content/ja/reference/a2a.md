# A2A

Heymは、Agent2Agentプロトコル（A2A 1.0、JSON-RPCバインディング）を介して**Heym Agent**を提供します。Heym Agentは[Chatタブ](../tabs/chat-tab.md)の背後にあるエンジンです。MCPクライアントは`heym_chat`ツールとして同じエージェントにアクセスします（[MCP / A2Aタブ](../tabs/mcp-tab.md)を参照）。A2Aを有効にすると、別のエージェントから自然言語でTaskを送信し、Chatと同じ機能を使用してその応答を受信できます。

## 有効化

1. **MCP / A2A**タブを開きます。
2. デフォルトサーバーまたは名前付きサーバーで**Heym Agent**をオンにし、その認証情報とモデルを選択します。
3. **A2Aを有効化**にチェックを入れます。カードに**Agent Card**のURLと**JSON-RPC Endpoint**が表示されます。

A2AはHeym Agent上で動作します。エージェントをオフにすると、A2Aも連動してオフになります。

## Endpoints

| | デフォルトサーバー | 名前付きサーバー |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Cardは認証情報を必要とせず、ユーザー、サーバー、Workflowの名前も含みません。これはA2Aがオンの場合にのみ存在します。少なくとも1人のユーザーがデフォルトサーバーでA2Aをオンにしている間はドメインカードが存在し、名前付きサーバーのカードはそのサーバーのA2Aがオンである間存在します。それ以外の場合、アドレスは404を返します。

## 認証

MCPと同様の認証情報をヘッダーのみで送信してください。

- `X-MCP-Key: <key>`: デフォルトサーバーのキーまたは名前付きサーバーのキー
- `Authorization: Bearer <token>`: HeymのOAuthサーバーからのOAuth Token

URL内の認証情報は拒否されます。Agent Cardは両方のスキームを宣言しているため、A2Aクライアントはカードからそれらを読み取ることができます。

## メソッド

| メソッド | 説明 |
|---|---|
| `SendMessage` | Taskを開始するか、入力を待機しているタスクを継続します。`configuration.returnImmediately`が`true`でない限り、応答を待ちます。 |
| `SendStreamingMessage` | 上記と同様に、タスクの進行状況とその結果をServer-Sent Eventsストリームとして配信します。 |
| `GetTask` | Taskの状態、応答、履歴を取得します（`historyLength`で履歴の長さを制限）。 |
| `ListTasks` | このサーバー上のタスクを新しい順に一覧表示します。`contextId`や`status`によるフィルタリング、`pageSize`および`pageToken`に対応します。 |
| `CancelTask` | 実行中または待機中のTaskを停止します。 |
| `SubscribeToTask` | 実行中のTaskの経過を購読・追従します。 |
| `GetExtendedAgentCard` | サーバー名およびスキルとして割り当てられたWorkflowsを含むカードを取得します。 |

プッシュ通知は提供されていません。カードには`pushNotifications: false`と記載され、プッシュメソッドは`PushNotificationNotSupportedError`を返します。リクエストにはA2A 1.0を使用し、`A2A-Version: 1.0`を送信してください。`message/send`などのA2A 0.3のメソッド名は`VersionNotSupportedError`を返します。

## Tasksと会話

各TaskはChatタブ内の会話であり、ネットワークアイコンで示されます。Taskの`contextId`はその会話を表します。会話を継続するには、同じ`contextId`を指定し、`taskId`を指定せずに新しいメッセージを送信してください。

| エージェントの動作 | Taskの状態 |
|---|---|
| 応答完了 | `TASK_STATE_COMPLETED`: 応答がテキストとして返され、保存された場合はWorkflowsや評価スイートへのリンクがデータとして含まれます |
| 明確化のための質問 | `TASK_STATE_INPUT_REQUIRED`: 同じ`taskId`で回答してください |
| 認証情報が必要 | `TASK_STATE_AUTH_REQUIRED`: ステータスメッセージにHeymの認証情報ページへのリンクが含まれます。ユーザーはHeymにログインしたブラウザでリンクを開きます。値が別のエージェントを経由することはありません。その後、同じTaskでメッセージを送信して継続します。 |
| 失敗 | `TASK_STATE_FAILED`: 理由を明記 |
| キャンセル済み | `TASK_STATE_CANCELED` |

完了したTaskや処理中のタスクへのメッセージは`UnsupportedOperationError`で拒否されます。メッセージは`text`パートと`data`パートを受け付け、合計20,000文字まで対応します。ファイルパートは拒否されるため、ファイルはリンクとして送信してください。

## 進行状況

Taskの実行中、ストリームは各ステップの状態更新を送信します。Chatタブに表示される文言（例: `Running workflow "Invoice Parser"` または `Testing the workflow · attempt 2/5`）と同じ形式で通知されます。MCPクライアントは`heym_chat`から`notifications/progress`として同じステップを受信します。

## 例

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## 制限事項

- `CancelTask`は、Chatタブの停止ボタンと同様に、それを実行しているHeymインスタンス上で実行中のターンを即座に停止します。他のノードではTaskがキャンセル済みとしてマークされ、遅れて届いたターンの結果は記録されません。
- プッシュ通知非対応、RESTまたはgRPCバインディングなし、署名付きAgent Cardsなし。

## 関連項目

- [MCP / A2Aタブ](../tabs/mcp-tab.md): Heym AgentとA2Aの有効化
- [Chatタブ](../tabs/chat-tab.md): エージェントの背後にあるエンジン
- [セキュリティ](./security.md): キーの安全な保管方法
