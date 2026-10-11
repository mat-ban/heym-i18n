# Telegram

**Telegram** mezgls nosūta ziņojumu, izmantojot Telegram Bot API. Izmantojiet to chat atbilžu sniegšanai, operatīvajiem brīdinājumiem, workflow statusa atjauninājumiem vai jebkuram nākamajam solim, kam jānosūta ziņojums Telegram lietotājam, grupai vai kanālam.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` akreditācijas dati, kas satur bota token |
| `chatId` | expression | Mērķa chat, grupas vai kanāla ID |
| `message` | expression | Izejošā ziņojuma teksts. Atbalsta [expressions](../reference/expression-dsl.md). |

## Iestatīšana

1. Izveidojiet [Telegram Bot akreditācijas datus](../reference/integrations.md#telegram)
2. Pievienojiet **Telegram** mezglu savam workflow
3. Izvēlieties akreditācijas datus
4. Iestatiet `chatId` uz statisku chat ID vai expression, piemēram, `$telegramEvent.message.chat.id`
5. Iestatiet `message` uz izejošo tekstu vai veidni, kas veidota no iepriekšējo mezglu datiem

## Piemērs

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

## Izvades lauki

| Expression | Apraksts |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` veiksmes gadījumā |
| `$nodeLabel.ok` | Telegram API veiksmes karodziņš |
| `$nodeLabel.result` | Neapstrādāts `sendMessage` rezultāta objekts no Telegram |
| `$nodeLabel.result.message_id` | Telegram ziņojuma ID |
| `$nodeLabel.result.chat.id` | Telegram atgrieztais mērķa chat ID |

## Biežāk izmantotie modeļi

- Savienojiet to ar [Telegram Trigger](./telegram-trigger-node.md) sarunvalodas botiem
- Sūtiet kļūdu paziņojumus no [Error Handler](./error-handler-node.md)
- Publicējiet kopsavilkumus, ko ģenerē [LLM](./llm-node.md) vai [Agent](./agent-node.md)

## Saistītie

- [Telegram Trigger](./telegram-trigger-node.md) – Palaidiet workflow no ienākošajiem bota ziņojumiem
- [Third-Party Integrations](../reference/integrations.md) – Telegram akreditācijas datu iestatīšana
- [Credentials Tab](../tabs/credentials-tab.md) – Pievienojiet un pārvaldiet `telegram` akreditācijas datus
- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
