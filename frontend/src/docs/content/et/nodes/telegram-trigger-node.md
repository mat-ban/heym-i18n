# Telegram Trigger

**Telegram Trigger** node on nullsisendiga sisendpunkt, mis käivitab workflow, kui Teie Telegrami bot saab webhook-uuenduse. Kasutage seda vestlusbotide, tugipäringute triaaži, kaldkriipsukäskude sarnaste käskude või inline-nuppude callback'ide jaoks, mis peaksid suunduma allavoolu AI- ja integratsioonisõlmedesse.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` mandaat, mis sisaldab boti tokenit ja valikulist webhooki salajast tokenit |

## Seadistusjuhend

### 1. Looge `telegram` mandaat

1. Minge jaotisse **Settings → Credentials → New Credential**
2. Valige tüübiks **Telegram Bot**
3. Kleepige **Bot Token**, mille saite BotFather'ilt
4. Soovi korral määrake **Webhook Secret Token**, kui soovite, et Telegram saadaks vastava verificerimispäise
5. Salvestage mandaat

### 2. Lisage node oma workflow'sse

1. Lohistage **Telegram Trigger** lõuendile
2. Valige node, et avada Properties-paneel
3. Valige oma `telegram` mandaat
4. Kopeerige **Webhook URL**, mis on node'i paneelil kuvatud

### 3. Registreerige webhook Telegramis

Kasutage Bot API `setWebhook` meetodit koos node'ist saadud URL-iga:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Kui konfigureerisite Heymis salajase tokeni, saatke webhooki seadistamisel sama väärtus:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Väljundväljad

Pärast node'i käivitumist saavad allavoolu node'id juurde pääseda järgmisele:

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.update` | Täielik Telegrami uuenduse payload |
| `$nodeLabel.message` | Uuenduse peamine sõnumilaadne objekt |
| `$nodeLabel.message.text` | Sissetuleva sõnumi tekst |
| `$nodeLabel.message.chat.id` | Chat ID vastamiseks allavoolu |
| `$nodeLabel.message.from.id` | Telegrami kasutaja ID |
| `$nodeLabel.callback_query` | Callback payload, kui uuendus tuli inline-klaviatuurilt |
| `$nodeLabel.headers` | Puhastatud webhooki päised |
| `$nodeLabel.triggered_by` | Triggeri allika silt (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Lõuendi node'i ID, mis võttis Telegrami uuenduse vastu |
| `$nodeLabel.triggered_at` | Selle workflow käivituse ISO ajatempel |

## Näidis-workflow

**Telegrami sõnum → LLM → Telegrami vastus**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** silt: `telegramEvent`
- **LLM** kasutaja sõnum: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Turvalisus

- Kui Teie mandaadil on `secret_token`, verifitseerib Heym `x-telegram-bot-api-secret-token` enne workflow käivitamist.
- Tundlikud päringu päised eemaldatakse enne, kui payload jõuab allavoolu node'ideni.
- Webhooki URL on node'i ID jaoks staatiline, seega peate selle uuesti registreerima ainult siis, kui node ise muutub.

## Seotud

- [Telegram Node](./telegram-node.md) – Saatke vastus või väljaminev teavitus
- [Triggers](../reference/triggers.md) – Ülevaade kõigist workflow sisendpunktidest
- [Third-Party Integrations](../reference/integrations.md) – Telegrami mandaadi seadistamine
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram` mandaatide lisamine ja haldamine
