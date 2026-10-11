# Telegram Trigger

**Telegram Trigger**-noden er en nul-input-startpunkt, der aktiverer et workflow, når den tilknyttede Telegram-bot modtager en webhook-opdatering. Anvendes til chatbots, support-triage, kommandoer eller inline-knap-tilbagekald, der skal føres videre til efterfølgende AI- og integrationsnoder.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram`-legitimationsoplysninger indeholdende bot-token og valgfrit webhook-hemmeligt token |

## Opsætningsvejledning

### 1. Opret `telegram`-legitimationsoplysninger

1. Gå til **Indstillinger → Legitimationsoplysninger → Ny legitimationsoplysning**
2. Vælg typen **Telegram Bot**
3. Indsæt **Bot Token** fra BotFather
4. Valgfrit: Angiv et **Webhook Secret Token**, hvis der ønskes verifikationsheader fra Telegram
5. Gem legitimationsoplysningerne

### 2. Tilføj noden til workflowet

1. Træk **Telegram Trigger** ind på canvas
2. Vælg noden for at åbne egenskabspanel
3. Vælg de relevante `telegram`-legitimationsoplysninger
4. Kopier den viste **Webhook URL** fra nodepanelet

### 3. Registrer webhook i Telegram

Brug Bot API's `setWebhook`-metode med URL'en fra noden:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Hvis der er konfigureret et hemmeligt token i Heym, skal samme værdi sendes ved opsætning af webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Outputfelter

Efter noden er udløst, kan efterfølgende noder tilgå:

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.update` | Fuld Telegram-opdateringspayload |
| `$nodeLabel.message` | Primært beskedlignende objekt fra opdateringen |
| `$nodeLabel.message.text` | Indgående beskedtekst |
| `$nodeLabel.message.chat.id` | Chat-ID til svar nedstrøms |
| `$nodeLabel.message.from.id` | Telegram bruger-ID |
| `$nodeLabel.callback_query` | Callback-payload ved opdateringer fra inline-tastatur |
| `$nodeLabel.headers` | Renset webhook-headers |
| `$nodeLabel.triggered_by` | Triggerkilde (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Canvas-node-ID, der modtog Telegram-opdateringen |
| `$nodeLabel.triggered_at` | ISO-tidsstempel for kørslen |

## Eksempel-workflow

**Telegram-besked → LLM → Telegram-svar**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** label: `telegramEvent`
- **LLM** brugerbesked: `"Svar kort på denne brugerbesked: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Sikkerhed

- Hvis legitimationsoplysningerne indeholder `secret_token`, verificerer Heym `x-telegram-bot-api-secret-token` før workflow-kørsel.
- Følsomme request-headers fjernes, før payload når efterfølgende noder.
- Webhook-URL'en er statisk for node-ID'et og skal kun genregistreres ved nodeændringer.

## Relateret

- [Telegram Node](./telegram-node.md) – Send svar eller udgående notifikationer
- [Triggers](../reference/triggers.md) – Oversigt over alle workflow-startpunkter
- [Third-Party Integrations](../reference/integrations.md) – Opsætning af Telegram-legitimationsoplysninger
- [Credentials Tab](../tabs/credentials-tab.md) – Håndtering af `telegram`-legitimationsoplysninger
