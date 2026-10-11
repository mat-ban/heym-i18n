# Telegram

**Telegram** node saadab sõnumi Telegram Bot API kaudu. Kasutage seda chat'i vastuste, operatiivsete teavituste, workflow'de staatuse uuenduste või mis tahes järgneva sammu jaoks, mis peaks saatma sõnumi Telegrami kasutajale, grupile või kanalile.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` mandaat, mis sisaldab boti tokenit |
| `chatId` | avaldis | Sihtkoha chat'i, grupi või kanali ID |
| `message` | avaldis | Väljuva sõnumi tekst. Toetab [avaldisi](../reference/expression-dsl.md). |

## Seadistamine

1. Looge [Telegram Bot mandaat](../reference/integrations.md#telegram)
2. Lisage **Telegram** node oma workflow'sse
3. Valige mandaat
4. Määrake `chatId` staatiliseks chat'i ID-ks või avaldiseks nagu `$telegramEvent.message.chat.id`
5. Määrake `message` väljuvaks tekstiks või ülesvoolu andmetest koostatud malliks

## Näide

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

## Väljundi väljad

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` õnnestumise korral |
| `$nodeLabel.ok` | Telegram API õnnestumise lipp |
| `$nodeLabel.result` | Telegrami töötlemata `sendMessage` tulemuse objekt |
| `$nodeLabel.result.message_id` | Telegrami sõnumi ID |
| `$nodeLabel.result.chat.id` | Telegrami tagastatud sihtkoha chat'i ID |

## Levinud mustrid

- Siduge see [Telegram Triggeriga](./telegram-trigger-node.md) vestlusbotide jaoks
- Saatke veateateid [Error Handlerist](./error-handler-node.md)
- Postitage kokkuvõtteid, mille on genereerinud [LLM](./llm-node.md) või [Agent](./agent-node.md)

## Seotud

- [Telegram Trigger](./telegram-trigger-node.md) – Käivitage workflow sissetulevate boti sõnumite põhjal
- [Third-Party Integrations](../reference/integrations.md) – Telegrami mandaadi seadistamine
- [Credentials Tab](../tabs/credentials-tab.md) – Lisage ja haldake `telegram` mandaate
- [Node Types](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
