# Telegram

**Telegram** čvor šalje poruku putem Telegram Bot API-ja. Koristite ga za odgovore u chatu, operativna upozorenja, ažuriranja statusa workflowa ili bilo koji nizvodni korak koji treba poslati poruku Telegram korisniku, grupi ili kanalu.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` vjerodajnica koja sadrži bot token |
| `chatId` | expression | ID odredišnog chata, grupe ili kanala |
| `message` | expression | Tekst odlazne poruke. Podržava [expressions](../reference/expression-dsl.md). |

## Postavljanje

1. Izradite [Telegram Bot vjerodajnicu](../reference/integrations.md#telegram)
2. Dodajte **Telegram** čvor u svoj workflow
3. Odaberite vjerodajnicu
4. Postavite `chatId` na statični ID chata ili expression poput `$telegramEvent.message.chat.id`
5. Postavite `message` na odlazni tekst ili predložak izgrađen od podataka iz prethodnih koraka

## Primjer

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

## Izlazna polja

| Expression | Opis |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` u slučaju uspjeha |
| `$nodeLabel.ok` | Telegram API zastavica uspjeha |
| `$nodeLabel.result` | Sirovi `sendMessage` rezultatni objekt iz Telegrama |
| `$nodeLabel.result.message_id` | Telegram ID poruke |
| `$nodeLabel.result.chat.id` | ID odredišnog chata koji vraća Telegram |

## Uobičajeni obrasci

- Upotrijebite ga zajedno s [Telegram Trigger](./telegram-trigger-node.md) za konverzacijske botove
- Šaljite obavijesti o pogreškama iz [Error Handler](./error-handler-node.md)
- Objavljujte sažetke koje generiraju [LLM](./llm-node.md) ili [Agent](./agent-node.md)

## Povezano

- [Telegram Trigger](./telegram-trigger-node.md) – Pokrenite workflow na temelju dolaznih bot poruka
- [Third-Party Integrations](../reference/integrations.md) – Postavljanje Telegram vjerodajnice
- [Credentials Tab](../tabs/credentials-tab.md) – Dodavanje i upravljanje `telegram` vjerodajnicama
- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
