# Telegram

Il nodo **Telegram** invia un messaggio tramite la Telegram Bot API. Lo si utilizzi per risposte in chat, avvisi operativi, aggiornamenti sullo stato del workflow o qualsiasi passaggio a valle che debba inviare un messaggio a un utente, gruppo o canale Telegram.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale `telegram` contenente il token del bot |
| `chatId` | expression | ID della chat, del gruppo o del canale di destinazione |
| `message` | expression | Testo del messaggio in uscita. Supporta le [espressioni](../reference/expression-dsl.md). |

## Configurazione

1. Creare una [credenziale Telegram Bot](../reference/integrations.md#telegram)
2. Aggiungere il nodo **Telegram** al workflow
3. Selezionare la credenziale
4. Impostare `chatId` su un ID chat statico o su un'espressione come `$telegramEvent.message.chat.id`
5. Impostare `message` sul testo in uscita o su un modello costruito a partire dai dati a monte

## Esempio

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Campi di output

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` in caso di successo |
| `$nodeLabel.ok` | Flag di successo della Telegram API |
| `$nodeLabel.result` | Oggetto risultato grezzo di `sendMessage` restituito da Telegram |
| `$nodeLabel.result.message_id` | ID del messaggio Telegram |
| `$nodeLabel.result.chat.id` | ID della chat di destinazione restituito da Telegram |

## Pattern comuni

- Abbinarlo al [Telegram Trigger](./telegram-trigger-node.md) per bot conversazionali
- Inviare notifiche di errore dall'[Error Handler](./error-handler-node.md)
- Pubblicare riepiloghi generati da [LLM](./llm-node.md) o [Agent](./agent-node.md)

## Correlati

- [Telegram Trigger](./telegram-trigger-node.md) – Avvia un workflow dai messaggi in arrivo del bot
- [Integrazioni di terze parti](../reference/integrations.md) – Configurazione della credenziale Telegram
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere e gestire le credenziali `telegram`
- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo