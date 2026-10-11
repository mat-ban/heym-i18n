# Telegram

Uzel **Telegram** odesílá zprávu prostřednictvím Telegram Bot API. Použijte jej pro odpovědi v chatu, provozní výstrahy, aktualizace stavu workflow nebo jakýkoli navazující krok, který má odeslat zprávu uživateli, skupině nebo kanálu v Telegramu.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaje `telegram` obsahující token bota |
| `chatId` | expression | ID cílového chatu, skupiny nebo kanálu |
| `message` | expression | Text odchozí zprávy. Podporuje [expressions](../reference/expression-dsl.md). |

## Nastavení

1. Vytvořte [přihlašovací údaje Telegram Bot](../reference/integrations.md#telegram)
2. Přidejte uzel **Telegram** do svého workflow
3. Vyberte přihlašovací údaje
4. Nastavte `chatId` na statické ID chatu nebo na expression, například `$telegramEvent.message.chat.id`
5. Nastavte `message` na odchozí text nebo šablonu sestavenou z dat předchozích uzlů

## Příklad

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

## Výstupní pole

| Expression | Popis |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` při úspěchu |
| `$nodeLabel.ok` | Příznak úspěchu Telegram API |
| `$nodeLabel.result` | Surový objekt výsledku `sendMessage` z Telegramu |
| `$nodeLabel.result.message_id` | ID zprávy v Telegramu |
| `$nodeLabel.result.chat.id` | ID cílového chatu vrácené Telegramem |

## Běžné vzory

- Zkombinujte jej s [Telegram Trigger](./telegram-trigger-node.md) pro konverzační boty
- Odesílejte oznámení o chybách z [Error Handler](./error-handler-node.md)
- Zveřejňujte souhrny generované pomocí [LLM](./llm-node.md) nebo [Agent](./agent-node.md)

## Související

- [Telegram Trigger](./telegram-trigger-node.md) – Spuštění workflow z příchozích zpráv bota
- [Third-Party Integrations](../reference/integrations.md) – Nastavení přihlašovacích údajů Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Přidání a správa přihlašovacích údajů `telegram`
- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
