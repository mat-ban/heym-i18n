# Triggers

Os Workflows são iniciados por **nós de trigger** ou **pontos de entrada**. Cada tipo de trigger tem o seu próprio endpoint ou processo em segundo plano.

## Nós de Trigger

Nós iniciais (sem arestas de entrada) que iniciam a execução:

| Tipo de Nó | Descrição |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Ponto de entrada HTTP. Recebe `body`, `headers`, `query` dos pedidos. |
| [Cron](../nodes/cron-node.md) | É executado segundo um agendamento (expressão cron, por exemplo `0 * * * *` para execução horária). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Inicia quando o Telegram envia uma atualização de webhook do bot para o URL de webhook específico do nó. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Inicia quando o Discord envia um webhook da Interactions API para o endpoint específico do nó. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Consulta periodicamente uma caixa de correio IMAP e inicia uma vez por cada novo email detetado. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Inicia quando o Heym publica um evento da plataforma. Os eventos numa mesma janela de despacho chegam em conjunto como um array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Abre uma ligação de cliente de saída para um socket externo e inicia em eventos de socket selecionados. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Gera um URL de upload de utilização única e inicia quando um chamador publica um ficheiro multipart de grandes dimensões. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Inicia quando uma mensagem é consumida de uma fila RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Inicia quando o Slack envia um evento através do webhook da Events API. |

## Pontos de Entrada

| Trigger | Endpoint / Origem | Autenticação |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Cabeçalho `X-MCP-Key` ou `Authorization: Bearer` (apenas cabeçalhos) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token de sessão do Portal |
| **Board** | Movimentação de cartão no [Board](../tabs/board-tab.md) / execução de seguimento para uma coluna com uma cadeia de workflow (`trigger_source="board"`) | JWT (proprietário do board) |
| **Cron** | Agendador cron (executa a cada 60s, avalia expressões cron) | N/A |
| **IMAP** | Gestor de triggers IMAP (worker líder, intervalo de consulta por nó) | Nome de utilizador/palavra-passe IMAP |
| **WebSocket** | Gestor de triggers WebSocket de saída (worker líder, ligações de cliente persistentes) | Cabeçalhos opcionais por nó |
| **File Upload** | `POST /api/file-intake/u/{token}` após a criação de um slot | Token de capacidade de utilização única |
| **RabbitMQ** | Consumidor RabbitMQ (worker líder) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Segredo de assinatura HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Chave pública da aplicação Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | `x-telegram-bot-api-secret-token` opcional |
| **Editor** | Igual ao Webhook, através de `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: O corpo do pedido é passado como `body` para os nós textInput
- **Modo do corpo**: Os Workflows podem utilizar exemplos com a forma do campo `defined` ou exemplos JSON em bruto `generic` no editor e na caixa de diálogo cURL
- **Autenticação**: Configurada por workflow (`auth_type`, `allow_anonymous`)

Consulte [Webhooks](./webhooks.md) para obter detalhes sobre TTL, cache, limitação de taxa e autenticação.

### MCP

Os Workflows com `mcp_enabled=true` aparecem como ferramentas para clientes MCP. O nome da ferramenta é derivado do nome do workflow. Consulte [MCP Tab](../tabs/mcp-tab.md).

### Portal

Interface de chat pública em `/chat/{slug}`. Consulte [Portal](./portal.md) para obter detalhes.

### Cron

O agendador cron é executado a cada 60 segundos, encontra Workflows com nós `cron` ativos, avalia expressões cron e executa os Workflows correspondentes. O input inclui `{"triggered_by": "cron"}`.

### IMAP

O gestor de triggers IMAP é executado no worker líder e verifica os nós `imapTrigger` ativos de acordo com o seu `pollIntervalMinutes` configurado. Cada nó armazena um cursor IMAP (`UIDVALIDITY` + último UID visto). O input inclui `email`, `triggered_by: "imap"`, `trigger_node_id` e `triggered_at`.

### Eventos da Plataforma Heym

O despachante de eventos do Heym consulta o registo `heym_events` a cada 5 segundos e entrega os eventos correspondentes aos nós `heymTrigger` ativos. A entrega é reclamada por (evento, workflow, nó) através de uma restrição única, pelo que um evento é disparado exatamente uma vez por nó subscritor em todos os workers, contentores e máquinas. Todos os eventos reclamados numa passagem são entregues numa única execução: o input inclui `events` (sempre um array, do mais antigo para o mais recente), `count`, `triggered_by: "heym_event"`, `trigger_node_id` e `triggered_at`. Apenas são despachados eventos publicados nos últimos 5 minutos, o que impede que uma interrupção reproduza um acumulado de eventos; os eventos são retidos durante 7 dias.

### WebSocket

O gestor de triggers WebSocket é executado no worker líder e mantém uma ligação de cliente de saída por cada nó [WebSocket Trigger](../nodes/websocket-trigger-node.md) ativo. Pode emitir execuções para `onMessage`, `onConnected` e `onClosed`. O input inclui `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` e um de `message`, `connection` ou `close`.

### Carregamento de Ficheiros

O [Trigger de Carregamento de Ficheiros](../nodes/file-upload-trigger-node.md) gera um slot de carregamento de utilização única e com TTL limitado quando o workflow é invocado através da API, MCP ou canvas. O carregamento de dados de formulário multipart para `POST /api/file-intake/u/{token}` consome o slot, armazena o ficheiro como um ficheiro do Drive e inicia o workflow de forma síncrona. A entrada inclui `file`, `uploaded_at`, `triggered_by: "file_upload"` e metadados de carregamento.

### Telegram

O Telegram envia atualizações de webhook do bot para `POST /api/telegram/webhook/{node_id}`. O payload é passado para o workflow como `update`, `message`, `callback_query` opcional, `headers` sanitizados, `triggered_by`, `trigger_node_id` e `triggered_at`. Se a credencial selecionada tiver um token secreto, o Heym verifica `x-telegram-bot-api-secret-token` antes da execução.

### Discord

O Discord envia webhooks de interação para `POST /api/discord/webhook/{node_id}`. O payload é passado para o workflow como `interaction`, `type`, `data`, `headers` sanitizados, `triggered_by`, `trigger_node_id` e `triggered_at`. O Heym verifica o pedido utilizando Ed25519 e a chave pública da aplicação da credencial `discord_trigger` selecionada antes da execução.

### RabbitMQ

O consumidor RabbitMQ inicia quando o worker líder é inicializado. Os workflows com nós `rabbitmq` onde `rabbitmqOperation === "receive"` recebem um consumidor. A entrada inclui `message_data` (corpo, cabeçalhos, routing_key, etc.) e `triggered_by: "rabbitmq"`.

## Limite de simultaneidade

Um workflow com um [limite de simultaneidade](./webhooks.md#concurrency-limit-and-queued-runs) coloca em fila as execuções de produção de todos os pontos de entrada acima quando os seus slots estão cheios, por ordem de chegada (FIFO), em todas as instâncias. A forma como o chamador obtém o resultado depende do ponto de entrada:

| Ponto de entrada | Enquanto a execução aguarda |
|---|---|
| Webhook / API | `202 Accepted` com um `execution_id` e um URL de estado |
| SSE streaming, Quick Drawer, Portal chat | O stream permanece aberto e envia eventos `queued` |
| Portal without streaming | O pedido aguarda o resultado |
| MCP | Um resultado `queued` para consultar com `heym_execution_status` |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | O trigger aguarda o resultado, durante o tempo que uma execução noutra [instância](./cluster.md) aguardaria. A execução ocorre de qualquer forma e é registada no histórico |

Quando a fila está cheia, a execução não é iniciada e o histórico regista-a como `queue_full`. As execuções de teste do editor, chamadas de sub-workflow (nó [Execute](../nodes/execute-node.md) e ferramentas de workflow do agente), [Evals](../tabs/evals-tab.md), execuções de teste no modo build do chat e retomas de revisão nunca são colocadas na fila. As execuções de cartões do [Board](../tabs/board-tab.md), execuções de [File Upload](../nodes/file-upload-trigger-node.md), execuções iniciadas pela ferramenta run-workflow do assistente de IA e workflows de notificação de alertas também são iniciados sem esperar por um slot.

## trigger_source

O histórico de execuções registra `trigger_source` para cada ponto de entrada:

| Valor | Quando |
|-------|------|
| `"API"` | Chamada Webhook / API sem cabeçalho explícito (predefinição) |
| `"Canvas"` | Execução a partir do canvas do editor de workflows |
| `"Quick Drawer"` | Execução a partir do painel quick-drawer do editor, incluindo execuções de ficheiros carregados a partir da respetiva zona de largar |
| `"cron"` | Agendador Cron |
| `"imap"` | Gestor de trigger IMAP |
| `"websocket"` | Gestor de trigger WebSocket de saída |
| `"file_upload"` | Endpoint de carregamento do Trigger de Carregamento de Ficheiros (hiperligações geradas via HTTP, MCP ou canvas) |
| `"dashboard"` | Execuções de widgets do painel e carregamentos a partir de um widget de largar ficheiros |
| `"telegram"` | Webhook do bot Telegram |
| `"Discord"` | Webhook de interações do Discord |
| `"MCP"` | Chamada de ferramenta MCP |
| `"portal"` | Execução do Portal |
| `"dashboard_chat"` | Chat do assistente de IA |
| `"AI Agents"` | Sub-workflow invocado por um nó de agente de IA |
| `"SUB_WORKFLOW"` | Sub-workflow invocado por um nó Execute Workflow |
| personalizado | Qualquer valor enviado no cabeçalho `X-Trigger-Source` ou no parâmetro de consulta/corpo `trigger_source` |
| (não definido) | Consumidor RabbitMQ |

## Entradas por Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` do pedido
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + `callback_query` opcional + `headers` sanitizados + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + `headers` sanitizados + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Carregamento de Ficheiros**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (objeto de evento Slack completo) + `headers` (sanitizados) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + `conversation_history` opcional

## Relacionado

- [Webhooks](./webhooks.md) – TTL de Webhook, cache, limite de taxa, autenticação
- [Estrutura do Workflow](./workflow-structure.md) – Nós e arestas
- [Tipos de Nó](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Trigger Telegram](../nodes/telegram-trigger-node.md), [Trigger IMAP](../nodes/imap-trigger-node.md), [Trigger Heym](../nodes/heym-trigger-node.md), [Trigger WebSocket](../nodes/websocket-trigger-node.md), [Trigger de Carregamento de Ficheiros](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Trigger Discord](../nodes/discord-trigger-node.md) – Trigger de webhook de interações do Discord
- [Início Rápido](../getting-started/quick-start.md) – Construir um workflow com Input
- [Portal](./portal.md) – Trigger do Portal e interface de chat
- [Histórico de Execuções](./execution-history.md) – Ver execuções anteriores e trigger_source
