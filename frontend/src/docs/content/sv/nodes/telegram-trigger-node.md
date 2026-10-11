# Telegram Trigger

Noden **Telegram Trigger** är en ingångspunkt utan indata som startar ett workflow när en Telegram-bot tar emot en webhook-uppdatering. Den används för chattbotar, supportärenden, slash-liknande kommandon eller callbacks från inline-knappar som ska vidarebefordras till nedströms AI- och integrationsnoder.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 0 |
| Utdata | 1 |
| Utdata | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | `telegram`-autentiseringsuppgift som innehåller bot-token och eventuell webhook-hemlighetstoken |

## Konfigurationsguide

### 1. Skapa en `telegram`-autentiseringsuppgift

1. Gå till **Settings → Credentials → New Credential**
2. Välj typen **Telegram Bot**
3. Klistra in **Bot Token** från BotFather
4. Ange eventuellt en **Webhook Secret Token** om Telegram ska skicka en matchande verifieringsheader
5. Spara autentiseringsuppgiften

### 2. Lägg till noden i workflowet

1. Dra **Telegram Trigger** till canvas
2. Markera noden för att öppna panelen Properties
3. Välj `telegram`-autentiseringsuppgiften
4. Kopiera **Webhook URL** som visas i nodpanelen

### 3. Registrera webhooken i Telegram

Använd Bot API-metoden `setWebhook` med URL:en från noden:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Om en hemlig token har konfigurerats i Heym skickas samma värde när webhooken registreras:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Utdatafält

När noden har triggats kan nedströms noder komma åt:

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.update` | Fullständig Telegram-uppdateringspayload |
| `$nodeLabel.message` | Primärt meddelandeliknande objekt från uppdateringen |
| `$nodeLabel.message.text` | Inkommande meddelandetext |
| `$nodeLabel.message.chat.id` | Chat-ID för att svara nedströms |
| `$nodeLabel.message.from.id` | Telegram-användar-ID |
| `$nodeLabel.callback_query` | Callback-payload när uppdateringen kom från ett inline-tangentbord |
| `$nodeLabel.headers` | Sanerade webhook-headers |
| `$nodeLabel.triggered_by` | Etikett för triggerkälla (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Canvas-nod-ID som tog emot Telegram-uppdateringen |
| `$nodeLabel.triggered_at` | ISO-tidsstämpel för denna workflow-körning |

## Exempel på workflow

**Telegram-meddelande → LLM → Telegram-svar**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger**-etikett: `telegramEvent`
- **LLM** användarmeddelande: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Säkerhet

- Om autentiseringsuppgiften har en `secret_token` verifierar Heym `x-telegram-bot-api-secret-token` innan workflowet körs.
- Känsliga request-headers tas bort innan payloaden når nedströms noder.
- Webhook-URL:en är statisk för nod-ID:t, så den behöver bara registreras om när själva noden ändras.

## Relaterat

- [Telegram-nod](./telegram-node.md) – Skicka ett svar eller en utgående avisering
- [Triggers](../reference/triggers.md) – Översikt över alla ingångspunkter för workflow
- [Tredjepartsintegrationer](../reference/integrations.md) – Konfiguration av Telegram-autentiseringsuppgifter
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till och hantera `telegram`-autentiseringsuppgifter
