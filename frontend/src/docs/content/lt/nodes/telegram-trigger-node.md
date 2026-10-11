# Telegram Trigger

**Telegram Trigger** mazgas yra nulinio įvesties taškas, kuris pradeda workflow, kai Jūsų Telegram bot'as gauna webhook atnaujinimą. Naudokite jį chatbot'ams, palaikymo triagavimui, slash tipo komandų vykdymui arba inline mygtukų atgaliniams skambučiams, kurie turėtų būti nukreipti į žemyn esančius AI ir integracijos mazgus.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | `telegram` kredencialas, kuriame yra bot'o token'as ir pasirinktinė webhook slaptažodžio token'as |

## Nustatymo Gidas

### 1. Sukurkite `telegram` Kredencialą

1. Eikite į **Nustatymai → Kredencialai → Naujas Kredencialas**
2. Pasirinkite tipą **Telegram Bot**
3. Įklijuokite **Bot Token** iš BotFather
4. Pasirinktinai nustatykite **Webhook Secret Token**, jei norite, kad Telegram siųstų atitinkamą patvirtinimo antraštę
5. Išsaugokite kredencialą

### 2. Pridėkite Mazgą prie Savo Workflow

1. Vilkite **Telegram Trigger** ant drobės
2. Pasirinkite mazgą, kad atidarytumėte Ypatybių panelę
3. Pasirinkite savo `telegram` kredencialą
4. Nukopijuokite **Webhook URL**, rodoma mazgo panelėje

### 3. Registruokite Webhook Telegram

Naudokite Bot API `setWebhook` metodą su URL iš mazgo:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Jei nustatėte slaptažodžio token'ą Heym, siųskite tą pačią vertę nustatydami webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Išvesties Laukai

Po to, kai mazgas suveikia, žemyn esantys mazgai gali pasiekti:

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.update` | Pilnas Telegram atnaujinimo payload |
| `$nodeLabel.message` | Pagrindinis pranešimo tipo objektas iš atnaujinimo |
| `$nodeLabel.message.text` | Atvykusio pranešimo tekstas |
| `$nodeLabel.message.chat.id` | Pokalbio ID, skirtas atsakymams žemyn |
| `$nodeLabel.message.from.id` | Telegram vartotojo ID |
| `$nodeLabel.callback_query` | Atgalinio skambučio payload, kai atnaujinimas atėjo iš inline klaviatūros |
| `$nodeLabel.headers` | Sanitizuotos webhook antraštės |
| `$nodeLabel.triggered_by` | Suveikimo šaltinio etiketė (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Drobės mazgo ID, kuris gavo Telegram atnaujinimą |
| `$nodeLabel.triggered_at` | ISO laiko žymė šiam workflow vykdymui |

## Pavyzdinė Workflow

**Telegram pranešimas → LLM → Telegram atsakymas**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** etiketė: `telegramEvent`
- **LLM** vartotojo pranešimas: `"Atsakykite trumpai į šį vartotojo pranešimą: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Saugumas

- Jei Jūsų kredencialas turi `secret_token`, Heym patikrina `x-telegram-bot-api-secret-token` prieš vykdydamas workflow.
- Jautrios užklausų antraštės pašalinamos prieš pasiekiant žemyn esančius mazgus.
- Webhook URL yra statinis mazgo ID, todėl Jums reikia jį vėl registruoti tik tada, kai pats mazgas keičiasi.

## Susiję

- [Telegram Node](./telegram-node.md) – Siųsti atsakymą arba išorinį pranešimą
- [Triggers](../reference/triggers.md) – Visų workflow įėjimo taškų apžvalga
- [Third-Party Integrations](../reference/integrations.md) – Telegram kredencialo nustatymas
- [Credentials Tab](../tabs/credentials-tab.md) – Pridėti ir valdyti `telegram` kredencialus
