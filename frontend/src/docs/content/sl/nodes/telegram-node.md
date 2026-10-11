# Telegram

Vozlišče **Telegram** pošilja sporočilo preko Telegram Bot API. Uporabite ga za odgovore v klepetu, operativna opozorila, posodobitve stanja delovnega toka ali katerikoli naslednji korak, ki naj pošlje sporočilo uporabniku, skupini ali kanalu na Telegramu.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | `telegram` poverilnica, ki vsebuje bot token |
| `chatId` | izraz | ID ciljne klepetalnice, skupine ali kanala |
| `message` | izraz | Besedilo odhodnega sporočila. Podpira [izraze](../reference/expression-dsl.md). |

## Nastavitev

1. Ustvarite [Telegram Bot poverilnico](../reference/integrations.md#telegram)
2. Dodajte vozlišče **Telegram** v vaš delovni tok
3. Izberite poverilnico
4. Nastavite `chatId` na statični ID klepetalnice ali izraz, kot je `$telegramEvent.message.chat.id`
5. Nastavite `message` na odhodno besedilo ali predlogo, zgrajeno iz podatkov iz zgornjih korakov

## Primer

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Prejeto: $telegramEvent.message.text"
  }
}
```

## Izhodni polja

| Izraz | Opis |
|-------|------|
| `$nodeLabel.status` | `"sent"` ob uspehu |
| `$nodeLabel.ok` | Uspešna oznaka Telegram API |
| `$nodeLabel.result` | Surov `sendMessage` rezultatni objekt iz Telegrama |
| `$nodeLabel.result.message_id` | Telegram ID sporočila |
| `$nodeLabel.result.chat.id` | ID ciljne klepetalnice, ki ga vrne Telegram |

## Pogoste sheme

- Povežite ga z [Telegram Trigger](./telegram-trigger-node.md) za pogovorne bote
- Pošljite obvestila o napakah iz [Error Handler](./error-handler-node.md)
- Objavite povzetke, ki jih generira [LLM](./llm-node.md) ali [Agent](./agent-node.md)

## Sorodno

- [Telegram Trigger](./telegram-trigger-node.md) – Začnite delovni tok iz prihajajočih bot sporočil
- [Integracije tretjih oseb](../reference/integrations.md) – Nastavitev Telegram poverilnice
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte in upravljajte `telegram` poverilnice
- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
