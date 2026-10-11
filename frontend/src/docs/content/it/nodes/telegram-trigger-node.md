# Telegram Trigger

Il nodo **Telegram Trigger** è un punto di ingresso a zero input che avvia un workflow quando il Suo bot Telegram riceve un aggiornamento webhook. Utilizzarlo per chatbot, triage del supporto, comandi in stile slash o callback di pulsanti inline che devono diramarsi verso nodi IA e di integrazione a valle.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale `telegram` contenente il token del bot e l'eventuale token segreto del webhook |

## Guida alla configurazione

### 1. Creare una credenziale `telegram`

1. Accedere a **Settings → Credentials → New Credential**
2. Selezionare il tipo **Telegram Bot**
3. Incollare il **Bot Token** fornito da BotFather
4. Impostare facoltativamente un **Webhook Secret Token** se si desidera che Telegram invii un header di verifica corrispondente
5. Salvare la credenziale

### 2. Aggiungere il nodo al workflow

1. Trascinare **Telegram Trigger** sul canvas
2. Selezionare il nodo per aprire il pannello Properties
3. Scegliere la credenziale `telegram`
4. Copiare l'**Webhook URL** mostrato nel pannello del nodo

### 3. Registrare il webhook su Telegram

Utilizzare il metodo `setWebhook` della Bot API con l'URL fornito dal nodo:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Se è stato configurato un token segreto in Heym, inviare lo stesso valore al momento della registrazione del webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Campi di output

Dopo l'attivazione del nodo, i nodi a valle possono accedere a:

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.update` | Payload completo dell'aggiornamento Telegram |
| `$nodeLabel.message` | Oggetto principale di tipo messaggio contenuto nell'aggiornamento |
| `$nodeLabel.message.text` | Testo del messaggio in arrivo |
| `$nodeLabel.message.chat.id` | ID della chat per rispondere a valle |
| `$nodeLabel.message.from.id` | ID utente Telegram |
| `$nodeLabel.callback_query` | Payload di callback quando l'aggiornamento proviene da una tastiera inline |
| `$nodeLabel.headers` | Header del webhook sanitizzati |
| `$nodeLabel.triggered_by` | Etichetta dell'origine del Trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID del nodo sul canvas che ha ricevuto l'aggiornamento Telegram |
| `$nodeLabel.triggered_at` | Timestamp ISO per questa esecuzione del workflow |

## Workflow di esempio

**Messaggio Telegram → LLM → risposta Telegram**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** label: `telegramEvent`
- **LLM** messaggio utente: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Sicurezza

- Se la credenziale dispone di un `secret_token`, Heym verifica l'header `x-telegram-bot-api-secret-token` prima di eseguire il workflow.
- Gli header di richiesta sensibili vengono rimossi prima che il payload raggiunga i nodi a valle.
- L'URL del webhook è statico per l'ID del nodo, pertanto è necessario registrarlo nuovamente solo quando il nodo stesso viene modificato.

## Correlati

- [Telegram Node](./telegram-node.md) – Inviare una risposta o una notifica in uscita
- [Triggers](../reference/triggers.md) – Panoramica di tutti i punti di ingresso del workflow
- [Third-Party Integrations](../reference/integrations.md) – Configurazione della credenziale Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Aggiungere e gestire le credenziali `telegram`