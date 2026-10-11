# Telegram

**Telegram**-noden skickar ett meddelande via Telegram Bot API. Den används för chatt­svar, driftlarm, statusuppdateringar för Workflows eller andra nedströmssteg som ska skicka ett meddelande till en Telegram-användare, grupp eller kanal.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | `telegram`-autentiseringsuppgift som innehåller bot-token |
| `chatId` | uttryck | ID för målchatt, grupp eller kanal |
| `message` | uttryck | Utgående meddelandetext. Stöder [uttryck](../reference/expression-dsl.md). |

## Konfiguration

1. Skapa en [Telegram Bot-autentiseringsuppgift](../reference/integrations.md#telegram)
2. Lägg till **Telegram**-noden i Workflowet
3. Välj autentiseringsuppgiften
4. Ange `chatId` till ett statiskt chatt-ID eller ett uttryck som `$telegramEvent.message.chat.id`
5. Ange `message` till den utgående texten eller en mall som byggs från uppströmsdata

## Exempel

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

## Utdatafält

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.status` | `"sent"` vid lyckat resultat |
| `$nodeLabel.ok` | Framgångsflagga från Telegram API |
| `$nodeLabel.result` | Rått `sendMessage`-resultatobjekt från Telegram |
| `$nodeLabel.result.message_id` | Telegram-meddelande-ID |
| `$nodeLabel.result.chat.id` | Målchatt-ID som returneras av Telegram |

## Vanliga mönster

- Kombinera med [Telegram Trigger](./telegram-trigger-node.md) för konversationsbaserade bottar
- Skicka felnotiser från [Error Handler](./error-handler-node.md)
- Publicera sammanfattningar som genererats av [LLM](./llm-node.md) eller [Agent](./agent-node.md)

## Relaterat

- [Telegram Trigger](./telegram-trigger-node.md) – Starta ett Workflow från inkommande bot-meddelanden
- [Third-Party Integrations](../reference/integrations.md) – Konfiguration av Telegram-autentiseringsuppgifter
- [Credentials Tab](../tabs/credentials-tab.md) – Lägg till och hantera `telegram`-autentiseringsuppgifter
- [Node Types](../reference/node-types.md) – Översikt över alla nodtyper
