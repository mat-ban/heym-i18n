# Triggers

Os Workflows são iniciados por **Nós de Trigger** ou **pontos de entrada**. Cada tipo de Trigger possui seu próprio endpoint ou processo em segundo plano.

## Nós de Trigger

Nós iniciais (sem arestas de entrada) que iniciam a execução:

| Tipo de Nó | Descrição |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Ponto de entrada HTTP. Recebe `body`, `headers`, `query` das requisições. |
| [Cron](../nodes/cron-node.md) | Executa em uma agenda (expressão cron, ex.: `0 * * * *` para a cada hora). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Inicia quando o Telegram envia uma atualização de webhook do bot para a URL de webhook específica do Nó. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Inicia quando o Discord envia um webhook da Interactions API para o endpoint específico do Nó. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Consulta uma caixa de correio IMAP e inicia uma vez para cada e-mail recém-detectado. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Inicia quando o Heym publica um evento da plataforma. Eventos em uma mesma janela de despacho chegam juntos como um array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Abre uma conexão de cliente de saída para um socket externo e inicia em eventos de socket selecionados. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Gera uma URL de upload de uso único e inicia quando um chamador envia um arquivo multipart grande. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Inicia quando uma mensagem é consumida de uma fila RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Inicia quando o Slack envia um evento via webhook da Events API. |

## Pontos de Entrada

| Trigger | Endpoint / Origem | Autenticação |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Header `X-MCP-Key` ou `Authorization: Bearer` (somente headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token de sessão do Portal |
| **Board** | Movimentação de card do [Board](../tabs/board-tab.md) / execução de follow-up em uma coluna com uma cadeia de workflow (`trigger_source="board"`) | JWT (proprietário do board) |
| **Cron** | Agendador Cron (executa a cada 60s, avalia expressões cron) | N/A |
| **IMAP** | Gerenciador de IMAP trigger (worker líder, intervalo de polling por Nó) | Usuário/senha IMAP |
| **WebSocket** | Gerenciador de WebSocket trigger de saída (worker líder, conexões de cliente persistentes) | Headers opcionais por Nó |
| **File Upload** | `POST /api/file-intake/u/{token}` após um slot ser gerado | Token de capacidade de uso único |
| **RabbitMQ** | Consumidor RabbitMQ (worker líder) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Segredo de assinatura HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Chave pública da aplicação Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | `x-telegram-bot-api-secret-token` opcional |
| **Editor** | Igual ao Webhook, via `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Entrada**: O corpo da requisição é passado como `body` para os Nós textInput
- **Modo do corpo**: Os Workflows podem usar exemplos com formato de campos `defined` ou exemplos JSON brutos `generic` no editor e no diálogo cURL
- **Autenticação**: Configurada por workflow (`auth_type`, `allow_anonymous`)

Consulte [Webhooks](./webhooks.md) para detalhes sobre TTL, cache, rate limiting e autenticação.

### MCP

Workflows com `mcp_enabled=true` aparecem como ferramentas para clientes MCP. O nome da ferramenta é derivado do nome do workflow. Consulte [MCP Tab](../tabs/mcp-tab.md).

### Portal

Interface de chat pública em `/chat/{slug}`. Consulte [Portal](./portal.md) para detalhes.

### Cron

O agendador Cron executa a cada 60 segundos, encontra Workflows com Nós `cron` ativos, avalia expressões cron e executa os Workflows correspondentes. A entrada inclui `{"triggered_by": "cron"}`.

### IMAP

O gerenciador de IMAP trigger executa no worker líder e verifica Nós `imapTrigger` ativos conforme seu `pollIntervalMinutes` configurado. Cada Nó armazena um cursor IMAP (`UIDVALIDITY` + último UID visto). A entrada inclui `email`, `triggered_by: "imap"`, `trigger_node_id` e `triggered_at`.

### Eventos da Plataforma Heym

O dispatcher de eventos do Heym consulta o log `heym_events` a cada 5 segundos e entrega eventos correspondentes aos Nós `heymTrigger` ativos. A entrega é reivindicada por (evento, workflow, Nó) através de uma restrição única, de modo que um evento dispara exatamente uma vez por Nó assinante em cada worker, container e máquina. Todo evento reivindicado em uma passagem é entregue em uma única execução: a entrada inclui `events` (sempre um array, do mais antigo primeiro), `count`, `triggered_by: "heym_event"`, `trigger_node_id` e `triggered_at`. Apenas eventos publicados nos últimos 5 minutos são despachados, o que impede que uma indisponibilidade reproduza um backlog; os eventos são retidos por 7 dias.

### WebSocket

O gerenciador de WebSocket trigger executa no worker líder e mantém uma conexão de cliente de saída por Nó [WebSocket Trigger](../nodes/websocket-trigger-node.md) ativo. Ele pode emitir execuções para `onMessage`, `onConnected` e `onClosed`. A entrada inclui `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` e um entre `message`, `connection` ou `close`.
### Upload de Arquivo

O [Trigger de Upload de Arquivo](../nodes/file-upload-trigger-node.md) gera um slot de upload de uso único com TTL limitado quando o Workflow é invocado através da API, MCP ou canvas. O upload de dados de formulário multipart para `POST /api/file-intake/u/{token}` consome o slot, armazena o arquivo como um arquivo do Drive e inicia o Workflow de forma síncrona. A entrada inclui `file`, `uploaded_at`, `triggered_by: "file_upload"` e metadados de upload.

### Telegram

O Telegram envia atualizações de webhook do bot para `POST /api/telegram/webhook/{node_id}`. O payload é passado para o Workflow como `update`, `message`, `callback_query` opcional, `headers` sanitizados, `triggered_by`, `trigger_node_id` e `triggered_at`. Se a credencial selecionada tiver um token secreto, o Heym verifica `x-telegram-bot-api-secret-token` antes da execução.

### Discord

O Discord envia webhooks de interação para `POST /api/discord/webhook/{node_id}`. O payload é passado para o Workflow como `interaction`, `type`, `data`, `headers` sanitizados, `triggered_by`, `trigger_node_id` e `triggered_at`. O Heym verifica a requisição usando Ed25519 e a chave pública da aplicação da credencial `discord_trigger` selecionada antes da execução.

### RabbitMQ

O consumidor RabbitMQ é iniciado quando o worker líder é inicializado. Workflows com Nós `rabbitmq` onde `rabbitmqOperation === "receive"` recebem um consumidor. A entrada inclui `message_data` (body, headers, routing_key, etc.) e `triggered_by: "rabbitmq"`.

## trigger_source

O histórico de execução registra `trigger_source` para cada ponto de entrada:

| Valor | Quando |
|-------|------|
| `"API"` | Chamada de Webhook / API sem header explícito (padrão) |
| `"Canvas"` | Execução a partir do canvas do editor de Workflow |
| `"Quick Drawer"` | Execução a partir do painel quick-drawer do editor, incluindo execuções de arquivos enviados pela área de soltura |
| `"cron"` | Agendador Cron |
| `"imap"` | Gerenciador de Trigger IMAP |
| `"websocket"` | Gerenciador de Trigger WebSocket de saída |
| `"file_upload"` | Endpoint de upload do Trigger de Upload de Arquivo (links gerados via HTTP, MCP ou canvas) |
| `"dashboard"` | Execuções de widgets do painel e uploads a partir de um widget de soltura de arquivo |
| `"telegram"` | Webhook do bot do Telegram |
| `"Discord"` | Webhook de interações do Discord |
| `"MCP"` | Chamada de ferramenta MCP |
| `"portal"` | Execução do Portal |
| `"dashboard_chat"` | Chat do assistente de IA |
| `"AI Agents"` | Sub-workflow invocado por um Nó de agente de IA |
| `"SUB_WORKFLOW"` | Sub-workflow invocado por um Nó Execute Workflow |
| custom | Qualquer valor enviado no header `X-Trigger-Source` ou no parâmetro de query/body `trigger_source` |
| (não definido) | Consumidor RabbitMQ |

## Entradas por Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` da requisição
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + `callback_query` opcional + `headers` sanitizados + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + `headers` sanitizados + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Upload de Arquivo**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (objeto de evento completo do Slack) + `headers` (sanitizados) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + `conversation_history` opcional

## Relacionados

- [Webhooks](./webhooks.md) – TTL de Webhook, cache, rate limit, autenticação
- [Estrutura do Workflow](./workflow-structure.md) – Nós e arestas
- [Tipos de Nó](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Trigger do Telegram](../nodes/telegram-trigger-node.md), [Trigger IMAP](../nodes/imap-trigger-node.md), [Trigger Heym](../nodes/heym-trigger-node.md), [Trigger WebSocket](../nodes/websocket-trigger-node.md), [Trigger de Upload de Arquivo](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Trigger do Discord](../nodes/discord-trigger-node.md) – Trigger de webhook de interações do Discord
- [Início Rápido](../getting-started/quick-start.md) – Construa um Workflow com Input
- [Portal](./portal.md) – Trigger de Portal e interface de chat
- [Histórico de Execução](./execution-history.md) – Visualize execuções anteriores e trigger_source
