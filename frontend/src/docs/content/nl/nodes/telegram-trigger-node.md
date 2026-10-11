# Telegram Trigger

De **Telegram Trigger**-node is een zero-input entry point dat een workflow start wanneer uw Telegram-bot een webhook-update ontvangt. Gebruik deze voor chatbots, support triage, slash-achtige commando's of inline button callbacks die moeten doorstromen naar downstream AI- en integratienodes.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram`-referentie met het bot-token en optioneel het webhook secret token |

## Installatiehandleiding

### 1. Een `telegram`-referentie aanmaken

1. Ga naar **Settings → Credentials → New Credential**
2. Selecteer type **Telegram Bot**
3. Plak het **Bot Token** van BotFather
4. Stel optioneel een **Webhook Secret Token** in als u wilt dat Telegram een overeenkomstige verificatieheader verzendt
5. Sla de referentie op

### 2. De node toevoegen aan uw workflow

1. Sleep **Telegram Trigger** naar het canvas
2. Selecteer de node om het Properties-paneel te openen
3. Kies uw `telegram`-referentie
4. Kopieer de **Webhook URL** die in het node-paneel wordt weergegeven

### 3. De webhook registreren in Telegram

Gebruik de Bot API `setWebhook`-methode met de URL van de node:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Als u een secret token in Heym hebt geconfigureerd, verzend dan dezelfde waarde bij het instellen van de webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Uitvoervelden

Nadat de node is geactiveerd, kunnen downstream-nodes het volgende benaderen:

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.update` | Volledige Telegram update-payload |
| `$nodeLabel.message` | Primair message-achtig object uit de update |
| `$nodeLabel.message.text` | Binnenkomende berichttekst |
| `$nodeLabel.message.chat.id` | Chat-ID voor het downstream beantwoorden |
| `$nodeLabel.message.from.id` | Telegram gebruikers-ID |
| `$nodeLabel.callback_query` | Callback-payload wanneer de update afkomstig is van een inline toetsenbord |
| `$nodeLabel.headers` | Opgeschoonde webhook-headers |
| `$nodeLabel.triggered_by` | Trigger-bronlabel (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Canvas node-ID die de Telegram-update heeft ontvangen |
| `$nodeLabel.triggered_at` | ISO-tijdstempel voor deze workflow-uitvoering |

## Voorbeeldworkflow

**Telegram-bericht → LLM → Telegram-antwoord**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger**-label: `telegramEvent`
- **LLM** gebruikersbericht: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Beveiliging

- Als uw referentie een `secret_token` heeft, verifieert Heym `x-telegram-bot-api-secret-token` voordat de workflow wordt uitgevoerd.
- Gevoelige request-headers worden verwijderd voordat de payload downstream-nodes bereikt.
- De webhook-URL is statisch voor het node-ID, dus u hoeft deze alleen opnieuw te registreren wanneer de node zelf verandert.

## Gerelateerd

- [Telegram Node](./telegram-node.md) – Een antwoord of uitgaande notificatie verzenden
- [Triggers](../reference/triggers.md) – Overzicht van alle workflow entry points
- [Third-Party Integrations](../reference/integrations.md) – Telegram-referentie-instelling
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram`-referenties toevoegen en beheren
