# Telegram Trigger

A **Telegram Trigger** csomópont egy nulla bemenettel rendelkező belépési pont, amely elindít egy workflow-t, amikor az Ön Telegram botja webhook frissítést kap. Használja chatbotokhoz, támogatási triage-hez, slash-szerű parancsokhoz vagy inline gomb visszahívásokhoz, amelyeket downstream AI- és integrációs csomópontokba kíván továbbítani.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` hitelesítési adat, amely tartalmazza a bot tokent és opcionálisan a webhook secret tokent |

## Beállítási útmutató

### 1. Hozzon létre egy `telegram` hitelesítési adatot

1. Lépjen a **Settings → Credentials → New Credential** menüpontra
2. Válassza a **Telegram Bot** típust
3. Illessze be a **Bot Token**-t a BotFather-től
4. Opcionálisan állítson be egy **Webhook Secret Token**-t, ha azt szeretné, hogy a Telegram egyező ellenőrző fejlécet küldjön
5. Mentse el a hitelesítési adatot

### 2. Adja hozzá a csomópontot a workflow-hoz

1. Húzza a **Telegram Trigger** csomópontot a vászonra
2. Válassza ki a csomópontot a Properties panel megnyitásához
3. Válassza ki a `telegram` hitelesítési adatot
4. Másolja ki a csomópont panelen megjelenő **Webhook URL**-t

### 3. Regisztrálja a webhookot a Telegramban

Használja a Bot API `setWebhook` metódusát a csomópont URL-jével:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Ha secret tokent konfigurált a Heym-ben, ugyanazt az értéket küldje a webhook beállításakor:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Kimeneti mezők

Miután a csomópont triggerelődött, a downstream csomópontok a következőkhöz férhetnek hozzá:

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.update` | Teljes Telegram update payload |
| `$nodeLabel.message` | Az update elsődleges message-szerű objektuma |
| `$nodeLabel.message.text` | Bejövő üzenet szövege |
| `$nodeLabel.message.chat.id` | Chat ID a downstream válaszadáshoz |
| `$nodeLabel.message.from.id` | Telegram felhasználói ID |
| `$nodeLabel.callback_query` | Callback payload, amikor az update inline billentyűzetről érkezett |
| `$nodeLabel.headers` | Tisztított webhook fejlécek |
| `$nodeLabel.triggered_by` | Trigger forrás címkéje (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | A vászon csomópont ID-ja, amely a Telegram update-et fogadta |
| `$nodeLabel.triggered_at` | ISO időbélyeg ehhez a workflow futtatáshoz |

## Példa workflow

**Telegram üzenet → LLM → Telegram válasz**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** címke: `telegramEvent`
- **LLM** felhasználói üzenet: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Biztonság

- Ha a hitelesítési adat tartalmaz `secret_token`-t, a Heym ellenőrzi az `x-telegram-bot-api-secret-token` fejlécet a workflow futtatása előtt.
- Az érzékeny kérésfejlécek eltávolításra kerülnek, mielőtt a payload eléri a downstream csomópontokat.
- A webhook URL statikus a csomópont ID-hoz, így csak akkor kell újraregisztrálnia, ha maga a csomópont megváltozik.

## Kapcsolódó

- [Telegram Node](./telegram-node.md) – Válasz vagy kimenő értesítés küldése
- [Triggers](../reference/triggers.md) – Az összes workflow belépési pont áttekintése
- [Third-Party Integrations](../reference/integrations.md) – Telegram hitelesítési adat beállítása
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram` hitelesítési adatok hozzáadása és kezelése
