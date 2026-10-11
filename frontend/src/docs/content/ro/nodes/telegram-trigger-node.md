# Telegram Trigger

Nodul **Telegram Trigger** este un punct de intrare fără input care pornește un workflow atunci când botul dvs. Telegram primește o actualizare webhook. Utilizați-l pentru chatbots, triajul solicitărilor de suport, comenzi de tip slash sau callback-uri de la butoane inline care ar trebui să se ramifice către noduri AI și de integrare din aval.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditarea `telegram` care conține token-ul botului și, opțional, token-ul secret pentru webhook |

## Ghid de configurare

### 1. Creați o acreditare `telegram`

1. Accesați **Settings → Credentials → New Credential**
2. Selectați tipul **Telegram Bot**
3. Lipiți **Bot Token**-ul din BotFather
4. Opțional, setați un **Webhook Secret Token** dacă doriți ca Telegram să trimită un header de verificare corespunzător
5. Salvați acreditarea

### 2. Adăugați nodul în workflow-ul dvs.

1. Trageți **Telegram Trigger** pe canvas
2. Selectați nodul pentru a deschide panoul Properties
3. Alegeți acreditarea `telegram`
4. Copiați **Webhook URL**-ul afișat în panoul nodului

### 3. Înregistrați webhook-ul în Telegram

Utilizați metoda `setWebhook` din Bot API cu URL-ul din nod:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Dacă ați configurat un token secret în Heym, trimiteți aceeași valoare la setarea webhook-ului:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Câmpuri de ieșire

După declanșarea nodului, nodurile din aval pot accesa:

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.update` | Payload-ul complet al actualizării Telegram |
| `$nodeLabel.message` | Obiectul principal de tip mesaj din actualizare |
| `$nodeLabel.message.text` | Textul mesajului primit |
| `$nodeLabel.message.chat.id` | ID-ul chat-ului pentru a răspunde în aval |
| `$nodeLabel.message.from.id` | ID-ul utilizatorului Telegram |
| `$nodeLabel.callback_query` | Payload-ul de callback atunci când actualizarea provine de la o tastatură inline |
| `$nodeLabel.headers` | Header-ele webhook sanitizate |
| `$nodeLabel.triggered_by` | Eticheta sursei trigger-ului (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID-ul nodului din canvas care a primit actualizarea Telegram |
| `$nodeLabel.triggered_at` | Timestamp ISO pentru această execuție a workflow-ului |

## Exemplu de workflow

**Mesaj Telegram → LLM → răspuns Telegram**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** etichetă: `telegramEvent`
- **LLM** mesaj utilizator: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Securitate

- Dacă acreditarea dvs. are un `secret_token`, Heym verifică `x-telegram-bot-api-secret-token` înainte de a rula workflow-ul.
- Header-ele sensibile ale cererii sunt eliminate înainte ca payload-ul să ajungă la nodurile din aval.
- URL-ul webhook-ului este static pentru ID-ul nodului, astfel încât trebuie să îl reînregistrați doar atunci când nodul în sine se modifică.

## Resurse conexe

- [Telegram Node](./telegram-node.md) – Trimiteți un răspuns sau o notificare în exterior
- [Triggers](../reference/triggers.md) – Prezentare generală a tuturor punctelor de intrare în workflow
- [Third-Party Integrations](../reference/integrations.md) – Configurarea acreditării Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Adăugați și gestionați acreditările `telegram`
