# Telegram

**Telegram** mazgas siunčia žinutę per Telegram Bot API. Naudokite jį pokalbių atsakymams, operatyviesiems įspėjimams, darbo eigos būsenos atnaujinimams arba bet kuriam žemiau esančiam žingsniui, kuris turėtų siųsti žinutę Telegram vartotojui, grupei ar kanalui.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | `telegram` kredencialas, turintis bot token |
| `chatId` | išraiška | Tikslinė pokalbio, grupės ar kanalo ID |
| `message` | išraiška | Išeinančios žinutės tekstas. Palaiko [išraiškas](../reference/expression-dsl.md). |

## Nustatymas

1. Sukurkite [Telegram Bot kredencialą](../reference/integrations.md#telegram)
2. Pridėkite **Telegram** mazgą prie savo darbo eigos
3. Pasirinkite kredencialą
4. Nustatykite `chatId` kaip statinį pokalbio ID arba išraišką, pvz., `$telegramEvent.message.chat.id`
5. Nustatykite `message` kaip išeinantį tekstą arba šabloną, sukurtą iš aukščiau esančių duomenų

## Pavyzdys

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

## Išvesties laukai

| Išraiška | Aprašymas |
|----------|-----------|
| `$nodeLabel.status` | `"sent"` sėkmės atveju |
| `$nodeLabel.ok` | Telegram API sėkmės žymuo |
| `$nodeLabel.result` | Žali `sendMessage` rezultato objektas iš Telegram |
| `$nodeLabel.result.message_id` | Telegram žinutės ID |
| `$nodeLabel.result.chat.id` | Tikslinio pokalbio ID, grąžintas iš Telegram |

## Dažni modeliai

- Pora su [Telegram Trigger](./telegram-trigger-node.md) pokalbių botams
- Siųsti klaidų pranešimus iš [Error Handler](./error-handler-node.md)
- Paskelbti santraukas, sugeneruotas [LLM](./llm-node.md) arba [Agent](./agent-node.md)

## Susiję

- [Telegram Trigger](./telegram-trigger-node.md) – Pradėkite darbo eigą iš gaunamų bot žinučių
- [Trečiųjų šalių integracijos](../reference/integrations.md) – Telegram kredencialų nustatymas
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti ir valdyti `telegram` kredencialus
- [Mazgų tipai](../reference/node-types.md) – Visi mazgų tipų apžvalga
