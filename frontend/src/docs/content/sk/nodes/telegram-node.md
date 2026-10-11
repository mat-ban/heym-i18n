# Telegram

Uzol **Telegram** odosiela správu prostredníctvom Telegram Bot API. Použite ho na odpovede v chate, prevádzkové upozornenia, aktualizácie stavu workflowu alebo akýkoľvek nadväzujúci krok, ktorý má odoslať správu používateľovi, skupine alebo kanálu v Telegrame.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje `telegram` obsahujúce bot token |
| `chatId` | expression | ID cieľového chatu, skupiny alebo kanála |
| `message` | expression | Text odchádzajúcej správy. Podporuje [expressions](../reference/expression-dsl.md). |

## Nastavenie

1. Vytvorte [prihlasovacie údaje pre Telegram Bot](../reference/integrations.md#telegram)
2. Pridajte uzol **Telegram** do svojho workflowu
3. Vyberte prihlasovacie údaje
4. Nastavte `chatId` na statické ID chatu alebo na expression, napríklad `$telegramEvent.message.chat.id`
5. Nastavte `message` na odchádzajúci text alebo šablónu zostavenú z údajov z predchádzajúcich uzlov

## Príklad

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

## Výstupné polia

| Expression | Popis |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` pri úspechu |
| `$nodeLabel.ok` | Príznak úspechu Telegram API |
| `$nodeLabel.result` | Surový objekt výsledku `sendMessage` z Telegramu |
| `$nodeLabel.result.message_id` | ID správy v Telegrame |
| `$nodeLabel.result.chat.id` | ID cieľového chatu vrátené Telegramom |

## Bežné vzory

- Skombinujte ho s uzlom [Telegram Trigger](./telegram-trigger-node.md) pre konverzačných botov
- Odosielajte oznámenia o chybách z uzla [Error Handler](./error-handler-node.md)
- Zverejňujte súhrny generované uzlom [LLM](./llm-node.md) alebo [Agent](./agent-node.md)

## Súvisiace

- [Telegram Trigger](./telegram-trigger-node.md) – Spustite workflow z prichádzajúcich správ bota
- [Third-Party Integrations](../reference/integrations.md) – Nastavenie prihlasovacích údajov pre Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Pridávanie a správa prihlasovacích údajov `telegram`
- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
