# Telegram

O nó **Telegram** envia uma mensagem através da Telegram Bot API. Utilize-o para respostas de Chat, Alertas operacionais, atualizações de status de Workflow ou qualquer etapa subsequente que deva enviar uma mensagem a um usuário, grupo ou canal do Telegram.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `telegram` contendo o Token do bot |
| `chatId` | expressão | ID do Chat, grupo ou canal de destino |
| `message` | expressão | Texto da mensagem de saída. Suporta [expressões](../reference/expression-dsl.md). |

## Configuração

1. Crie uma [credencial do Telegram Bot](../reference/integrations.md#telegram)
2. Adicione o nó **Telegram** ao seu Workflow
3. Selecione a credencial
4. Defina `chatId` como um ID de Chat estático ou uma expressão como `$telegramEvent.message.chat.id`
5. Defina `message` como o texto de saída ou um Modelo construído a partir de dados anteriores

## Exemplo

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Campos de saída

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` em caso de sucesso |
| `$nodeLabel.ok` | Indicador de sucesso da Telegram API |
| `$nodeLabel.result` | Objeto de resultado bruto do `sendMessage` retornado pelo Telegram |
| `$nodeLabel.result.message_id` | ID da mensagem do Telegram |
| `$nodeLabel.result.chat.id` | ID do Chat de destino retornado pelo Telegram |

## Padrões comuns

- Combine-o com o [Telegram Trigger](./telegram-trigger-node.md) para bots conversacionais
- Envie avisos de erro a partir do [Error Handler](./error-handler-node.md)
- Publique resumos gerados por [LLM](./llm-node.md) ou [Agent](./agent-node.md)

## Relacionados

- [Telegram Trigger](./telegram-trigger-node.md) – Inicie um Workflow a partir de mensagens recebidas pelo bot
- [Integrações de terceiros](../reference/integrations.md) – Configuração da credencial do Telegram
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicione e gerencie credenciais `telegram`
- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó