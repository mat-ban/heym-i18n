# Telegram Trigger

O nó **Telegram Trigger** é um ponto de entrada sem inputs que inicia um workflow quando o seu bot do Telegram recebe uma atualização via webhook. Utilize-o para chatbots, triagem de suporte, comandos no estilo slash ou callbacks de botões inline que devem ser encaminhados para nós de IA e integração a jusante.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `telegram` contendo o token do bot e, opcionalmente, o token secreto do webhook |

## Guia de Configuração

### 1. Criar uma Credencial `telegram`

1. Acesse **Settings → Credentials → New Credential**
2. Selecione o tipo **Telegram Bot**
3. Cole o **Bot Token** fornecido pelo BotFather
4. Opcionalmente, defina um **Webhook Secret Token** caso deseje que o Telegram envie um cabeçalho de verificação correspondente
5. Salve a credencial

### 2. Adicionar o Nó ao Seu Workflow

1. Arraste o **Telegram Trigger** para o canvas
2. Selecione o nó para abrir o painel de Propriedades
3. Escolha a sua credencial `telegram`
4. Copie a **Webhook URL** exibida no painel do nó

### 3. Registrar o Webhook no Telegram

Utilize o método `setWebhook` da Bot API com a URL fornecida pelo nó:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Caso tenha configurado um token secreto no Heym, envie o mesmo valor ao definir o webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Campos de Output

Após o nó ser acionado, os nós a jusante podem acessar:

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.update` | Payload completo da atualização do Telegram |
| `$nodeLabel.message` | Objeto principal semelhante a mensagem extraído da atualização |
| `$nodeLabel.message.text` | Texto da mensagem recebida |
| `$nodeLabel.message.chat.id` | ID do Chat para responder a jusante |
| `$nodeLabel.message.from.id` | ID do usuário do Telegram |
| `$nodeLabel.callback_query` | Payload de callback quando a atualização é proveniente de um teclado inline |
| `$nodeLabel.headers` | Cabeçalhos do webhook sanitizados |
| `$nodeLabel.triggered_by` | Rótulo da origem do Trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID do nó no canvas que recebeu a atualização do Telegram |
| `$nodeLabel.triggered_at` | Timestamp ISO desta execução do workflow |

## Exemplo de Workflow

**Mensagem do Telegram → LLM → Resposta no Telegram**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** label: `telegramEvent`
- **LLM** user message: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Segurança

- Caso a sua credencial possua um `secret_token`, o Heym verifica o cabeçalho `x-telegram-bot-api-secret-token` antes de executar o workflow.
- Cabeçalhos sensíveis da requisição são removidos antes que o payload alcance os nós a jusante.
- A URL do webhook é estática para o ID do nó, portanto só é necessário registrá-la novamente quando o próprio nó for alterado.

## Relacionados

- [Telegram Node](./telegram-node.md) – Enviar uma resposta ou notificação de saída
- [Triggers](../reference/triggers.md) – Visão geral de todos os pontos de entrada do workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuração da credencial do Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Adicionar e gerenciar credenciais `telegram`