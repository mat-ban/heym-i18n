# Telegram

De **Telegram**-node verzendt een bericht via de Telegram Bot API. Gebruik deze voor chatantwoorden, operationele waarschuwingen, workflow-statusupdates of elke volgende stap die een Telegram-gebruiker, -groep of -kanaal moet berichten.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram`-referentie met het bot-token |
| `chatId` | expressie | ID van de bestemmingschat, -groep of -kanaal |
| `message` | expressie | Tekst van het uitgaande bericht. Ondersteunt [expressies](../reference/expression-dsl.md). |

## Configuratie

1. Maak een [Telegram Bot-referentie](../reference/integrations.md#telegram) aan
2. Voeg de **Telegram**-node toe aan uw workflow
3. Selecteer de referentie
4. Stel `chatId` in op een statische chat-ID of een expressie zoals `$telegramEvent.message.chat.id`
5. Stel `message` in op de uitgaande tekst of een sjabloon dat is opgebouwd uit gegevens van eerdere nodes

## Voorbeeld

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

## Uitvoervelden

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` bij succes |
| `$nodeLabel.ok` | Succesmarkering van de Telegram API |
| `$nodeLabel.result` | Onbewerkt `sendMessage`-resultaatobject van Telegram |
| `$nodeLabel.result.message_id` | Telegram-bericht-ID |
| `$nodeLabel.result.chat.id` | Door Telegram geretourneerd ID van de bestemmingschat |

## Veelvoorkomende patronen

- Combineer deze met [Telegram Trigger](./telegram-trigger-node.md) voor conversationele bots
- Verzend foutmeldingen vanuit [Error Handler](./error-handler-node.md)
- Plaats samenvattingen die zijn gegenereerd door [LLM](./llm-node.md) of [Agent](./agent-node.md)

## Gerelateerd

- [Telegram Trigger](./telegram-trigger-node.md) – Start een workflow vanuit inkomende bot-berichten
- [Third-Party Integrations](../reference/integrations.md) – Configuratie van Telegram-referenties
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram`-referenties toevoegen en beheren
- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
