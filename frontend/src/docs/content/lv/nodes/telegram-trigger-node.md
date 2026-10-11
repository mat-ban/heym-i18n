# Telegram Trigger

**Telegram Trigger** mezgls ir ieejas punkts bez ievades, kas palaiž workflow, kad Jūsu Telegram bots saņem webhook atjauninājumu. Izmantojiet to čatbotiem, atbalsta pieprasījumu šķirošanai, slash-veida komandām vai inline pogu callback izsaukumiem, kas jānovirza uz lejupstraumes AI un integrāciju mezgliem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` akreditācijas dati, kas satur bota token un neobligātu webhook secret token |

## Iestatīšanas pamācība

### 1. Izveidojiet `telegram` akreditācijas datus

1. Dodieties uz **Settings → Credentials → New Credential**
2. Izvēlieties tipu **Telegram Bot**
3. Ielīmējiet **Bot Token** no BotFather
4. Ja vēlaties, iestatiet **Webhook Secret Token**, ja vēlaties, lai Telegram sūta atbilstošu verifikācijas header
5. Saglabājiet akreditācijas datus

### 2. Pievienojiet mezglu savam workflow

1. Velciet **Telegram Trigger** uz kanvas
2. Izvēlieties mezglu, lai atvērtu Properties paneli
3. Izvēlieties savus `telegram` akreditācijas datus
4. Nokopējiet **Webhook URL**, kas parādīts mezgla panelī

### 3. Reģistrējiet webhook Telegram

Izmantojiet Bot API `setWebhook` metodi ar URL no mezgla:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Ja esat konfigurējis secret token Heym, nosūtiet to pašu vērtību, iestatot webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Izvades lauki

Pēc tam, kad mezgls tiek aktivizēts, lejupstraumes mezgli var piekļūt:

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.update` | Pilns Telegram atjauninājuma payload |
| `$nodeLabel.message` | Galvenais ar ziņojumu līdzīgais objekts no atjauninājuma |
| `$nodeLabel.message.text` | Ienākošā ziņojuma teksts |
| `$nodeLabel.message.chat.id` | Chat ID atbildes nosūtīšanai lejupstraumē |
| `$nodeLabel.message.from.id` | Telegram lietotāja ID |
| `$nodeLabel.callback_query` | Callback payload, ja atjauninājums nāca no inline tastatūras |
| `$nodeLabel.headers` | Sanitizēti webhook header |
| `$nodeLabel.triggered_by` | Trigger avota apzīmējums (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Kanvas mezgla ID, kas saņēma Telegram atjauninājumu |
| `$nodeLabel.triggered_at` | ISO laika zīmogs šai workflow izpildei |

## Workflow piemērs

**Telegram ziņojums → LLM → Telegram atbilde**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** apzīmējums: `telegramEvent`
- **LLM** lietotāja ziņojums: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Drošība

- Ja Jūsu akreditācijas datos ir `secret_token`, Heym pārbauda `x-telegram-bot-api-secret-token` pirms workflow palaišanas.
- Sensitīvie pieprasījuma header tiek noņemti pirms payload nonākšanas lejupstraumes mezglos.
- Webhook URL ir statisks mezgla ID, tāpēc tas ir jāreģistrē no jauna tikai tad, kad mainās pats mezgls.

## Saistītie

- [Telegram Node](./telegram-node.md) – Nosūtīt atbildi vai izejošo paziņojumu
- [Triggers](../reference/triggers.md) – Pārskats par visiem workflow ieejas punktiem
- [Third-Party Integrations](../reference/integrations.md) – Telegram akreditācijas datu iestatīšana
- [Credentials Tab](../tabs/credentials-tab.md) – Pievienot un pārvaldīt `telegram` akreditācijas datus
