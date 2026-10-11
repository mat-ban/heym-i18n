# Telegram Trigger

Uzol **Telegram Trigger** je vstupný bod s nulovým vstupom, ktorý spustí workflow, keď váš Telegram bot prijme webhook update. Použite ho pre chatbotov, triedenie podpory, príkazy podobné slash príkazom alebo spätné volania inline tlačidiel, ktoré by mali smerovať do nadväzných AI a integračných uzlov.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje typu `telegram` obsahujúce token bota a voliteľný secret token pre webhook |

## Sprievodca nastavením

### 1. Vytvorte prihlasovacie údaje typu `telegram`

1. Prejdite do **Settings → Credentials → New Credential**
2. Vyberte typ **Telegram Bot**
3. Vložte **Bot Token** z BotFather
4. Voliteľne nastavte **Webhook Secret Token**, ak chcete, aby Telegram posielal zodpovedajúcu overovaciu hlavičku
5. Uložte prihlasovacie údaje

### 2. Pridajte uzol do svojho workflowu

1. Pretiahnite **Telegram Trigger** na plátno
2. Vyberte uzol a otvorte panel Properties
3. Zvoľte svoje prihlasovacie údaje typu `telegram`
4. Skopírujte **Webhook URL** zobrazenú v paneli uzla

### 3. Zaregistrujte webhook v Telegrame

Použite metódu `setWebhook` z Bot API s URL adresou z uzla:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Ak ste v Heym nakonfigurovali secret token, pošlite pri nastavovaní webhooku rovnakú hodnotu:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Výstupné polia

Po spustení uzla môžu nadväzné uzly pristupovať k:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.update` | Úplný Telegram update payload |
| `$nodeLabel.message` | Primárny objekt typu message z updatu |
| `$nodeLabel.message.text` | Text prichádzajúcej správy |
| `$nodeLabel.message.chat.id` | Chat ID pre odpoveď v nadväzných uzloch |
| `$nodeLabel.message.from.id` | Telegram user ID |
| `$nodeLabel.callback_query` | Callback payload, ak update prišiel z inline klávesnice |
| `$nodeLabel.headers` | Sanitizované hlavičky webhooku |
| `$nodeLabel.triggered_by` | Označenie zdroja triggera (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID uzla na plátne, ktorý prijal Telegram update |
| `$nodeLabel.triggered_at` | ISO časová značka pre toto spustenie workflowu |

## Príklad workflowu

**Telegram správa → LLM → Telegram odpoveď**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** label: `telegramEvent`
- **LLM** používateľská správa: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Zabezpečenie

- Ak vaše prihlasovacie údaje obsahujú `secret_token`, Heym overí `x-telegram-bot-api-secret-token` pred spustením workflowu.
- Citlivé hlavičky požiadavky sú odstránené predtým, než payload dorazí do nadväzných uzlov.
- Webhook URL je statická pre dané ID uzla, takže ju musíte znovu zaregistrovať len vtedy, keď sa zmení samotný uzol.

## Súvisiace

- [Telegram Node](./telegram-node.md) – Odoslanie odpovede alebo odchádzajúceho upozornenia
- [Triggers](../reference/triggers.md) – Prehľad všetkých vstupných bodov workflowu
- [Third-Party Integrations](../reference/integrations.md) – Nastavenie prihlasovacích údajov pre Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Pridávanie a správa prihlasovacích údajov typu `telegram`
