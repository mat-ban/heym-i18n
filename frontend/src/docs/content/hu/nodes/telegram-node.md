# Telegram

A **Telegram** csomópont üzenetet küld a Telegram Bot API-n keresztül. Használja chatválaszokhoz, operatív riasztásokhoz, workflow állapotfrissítésekhez vagy bármely olyan downstream lépéshez, amelynek üzenetet kell küldenie egy Telegram felhasználónak, csoportnak vagy csatornának.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` hitelesítési adat, amely tartalmazza a bot tokent |
| `chatId` | expression | A cél chat, csoport vagy csatorna azonosítója |
| `message` | expression | A kimenő üzenet szövege. Támogatja az [expressions](../reference/expression-dsl.md) szintaxist. |

## Beállítás

1. Hozzon létre egy [Telegram Bot hitelesítési adatot](../reference/integrations.md#telegram)
2. Adja hozzá a **Telegram** csomópontot a workflow-hoz
3. Válassza ki a hitelesítési adatot
4. Állítsa a `chatId` értékét statikus chat azonosítóra vagy egy expressionre, például `$telegramEvent.message.chat.id`
5. Állítsa a `message` értékét a kimenő szövegre vagy egy upstream adatokból felépített sablonra

## Példa

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

## Kimeneti mezők

| Expression | Leírás |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` siker esetén |
| `$nodeLabel.ok` | A Telegram API sikerességét jelző flag |
| `$nodeLabel.result` | A Telegram nyers `sendMessage` eredményobjektuma |
| `$nodeLabel.result.message_id` | Telegram üzenetazonosító |
| `$nodeLabel.result.chat.id` | A Telegram által visszaadott cél chat azonosító |

## Gyakori minták

- Párosítsa a [Telegram Trigger](./telegram-trigger-node.md) csomóponttal beszélgetős botokhoz
- Küldjön hibaértesítéseket az [Error Handler](./error-handler-node.md) csomópontból
- Tegye közzé az [LLM](./llm-node.md) vagy [Agent](./agent-node.md) által generált összefoglalókat

## Kapcsolódó

- [Telegram Trigger](./telegram-trigger-node.md) – Workflow indítása bejövő botüzenetekből
- [Third-Party Integrations](../reference/integrations.md) – Telegram hitelesítési adatok beállítása
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram` hitelesítési adatok hozzáadása és kezelése
- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
