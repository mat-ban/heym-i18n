# Telegram

O nó **Telegram** envia uma mensagem por meio da Telegram Bot API. Utilize-o para respostas de chat, alertas operacionais, atualizações de status de workflow ou qualquer etapa subsequente que deva enviar uma mensagem a um usuário, grupo ou canal do Telegram.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `telegram` contendo o token do bot |
| `chatId` | expressão | ID do chat, grupo ou canal de destino |
| `message` | expressão | Texto da mensagem de saída. Suporta [expressões](../reference/expression-dsl.md). |

## Configuração

1. Crie uma [credencial do Telegram Bot](../reference/integrations.md#telegram)
2. Adicione o nó **Telegram** ao seu workflow
3. Selecione a credencial
4. Defina `chatId` como um ID de chat estático ou uma expressão como `$telegramEvent.message.chat.id`
5. Defina `message` como o texto de saída ou um template construído a partir de dados upstream

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

## Campos de Saída

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` em caso de sucesso |
| `$nodeLabel.ok` | Sinalizador de sucesso da Telegram API |
| `$nodeLabel.result` | Objeto de resultado bruto do `sendMessage` retornado pelo Telegram |
| `$nodeLabel.result.message_id` | ID da mensagem no Telegram |
| `$nodeLabel.result.chat.id` | ID do chat de destino retornado pelo Telegram |

## Padrões Comuns

- Combine-o com o [Telegram Trigger](./telegram-trigger-node.md) para bots conversacionais
- Envie avisos de erro a partir do [Error Handler](./error-handler-node.md)
- Publique resumos gerados por [LLM](./llm-node.md) ou [Agent](./agent-node.md)

## Relacionados

- [Telegram Trigger](./telegram-trigger-node.md) – Inicie um workflow a partir de mensagens recebidas pelo bot
- [Third-Party Integrations](../reference/integrations.md) – Configuração da credencial do Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Adicione e gerencie credenciais `telegram`
- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
