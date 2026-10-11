# Telegram

**Telegram**-noden sender en besked via Telegram Bot API. Den kan bruges til chat-svar, operationelle advarsler, statusopdateringer for workflows eller enhver efterfølgende handling, der skal sende en besked til en Telegram-bruger, -gruppe eller -kanal.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram`-legitimationsoplysninger, der indeholder bot-token |
| `chatId` | expression | Destinationschat, -gruppe eller -kanal-ID |
| `message` | expression | Udgående beskedtekst. Understøtter [udtryk](../reference/expression-dsl.md). |

## Opsætning

1. Opret [Telegram Bot-legitimationsoplysninger](../reference/integrations.md#telegram)
2. Tilføj **Telegram**-noden til workflowet
3. Vælg legitimationsoplysningerne
4. Indstil `chatId` til et statisk chat-ID eller et udtryk som f.eks. `$telegramEvent.message.chat.id`
5. Indstil `message` til den udgående tekst eller en skabelon baseret på opstrømsdata

## Eksempel

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Modtaget: $telegramEvent.message.text"
  }
}
```

## Output-felter

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` ved succes |
| `$nodeLabel.ok` | Telegram API-succesflag |
| `$nodeLabel.result` | Rå `sendMessage`-resultatobjekt fra Telegram |
| `$nodeLabel.result.message_id` | Telegram-besked-ID |
| `$nodeLabel.result.chat.id` | Destinationschat-ID returneret af Telegram |

## Almindelige mønstre

- Kombiner med [Telegram Trigger](./telegram-trigger-node.md) til samtalebaserede bots
- Send fejlmeddelelser fra [Error Handler](./error-handler-node.md)
- Send opsummeringer genereret af [LLM](./llm-node.md) eller [Agent](./agent-node.md)

## Relateret

- [Telegram Trigger](./telegram-trigger-node.md) – Start et workflow fra indgående bot-beskeder
- [Tredjepartsintegrationer](../reference/integrations.md) – Opsætning af Telegram-legitimationsoplysninger
- [Legitimationsoplysningsfanen](../tabs/credentials-tab.md) – Tilføj og håndter `telegram`-legitimationsoplysninger
- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
