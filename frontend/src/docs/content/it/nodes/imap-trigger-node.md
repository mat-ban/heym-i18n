# IMAP Trigger

Il nodo **IMAP Trigger** esegue il polling di una casella di posta elettronica a intervalli fissi e avvia un workflow una volta per ogni nuovo messaggio rilevato. Si tratta di un nodo trigger a input zero, progettato per l'automazione della posta in entrata, come la gestione delle richieste di supporto, il monitoraggio delle caselle condivise e le caselle di approvazione.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale `imap` contenente server, login, casella di posta e impostazioni SSL |
| `pollIntervalMinutes` | Integer | Frequenza con cui Heym controlla la casella di posta per nuove email |

## Guida alla configurazione

### 1. Creare una credenziale `imap`

1. Accedere a **Settings → Credentials → New Credential**
2. Selezionare il tipo **IMAP Email Inbox**
3. Inserire:
   - **IMAP Host** (ad esempio `imap.gmail.com`)
   - **IMAP Port** (`993` per SSL/TLS sulla maggior parte dei provider)
   - **Username / Email**
   - **Password / App Password**
   - **Mailbox** opzionale (predefinito: `INBOX`)
4. Lasciare abilitata l'opzione **Use SSL / TLS**, a meno che il server di posta richieda esplicitamente IMAP senza SSL
5. Salvare la credenziale

### 2. Aggiungere il nodo al workflow

1. Trascinare **IMAP Trigger** sul canvas
2. Selezionare il nodo per aprire il pannello Properties
3. Scegliere la credenziale `imap`
4. Impostare **Poll Interval (Minutes)** con un valore intero come `1`, `5` o `15`

## Semantica del trigger

- Il primo polling stabilisce una baseline del contenuto attuale della casella di posta e **non** riproduce le email precedenti.
- I polling successivi attivano il workflow una volta per ogni messaggio il cui IMAP UID è più recente del cursore salvato.
- Se il `UIDVALIDITY` della casella di posta cambia, Heym reimposta il cursore ed esegue nuovamente la baseline per evitare elaborazioni duplicate.
- Ogni nuova email avvia una esecuzione separata del workflow con `trigger_source = "imap"`.

## Campi di output

Dopo l'attivazione del nodo, i nodi a valle possono accedere a:

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.email` | Payload completo dell'email analizzata |
| `$nodeLabel.email.subject` | Oggetto decodificato |
| `$nodeLabel.email.from` | Header `From` grezzo |
| `$nodeLabel.email.fromAddresses` | Elenco dei mittenti analizzato |
| `$nodeLabel.email.toAddresses` | Elenco dei destinatari analizzato |
| `$nodeLabel.email.ccAddresses` | Elenco CC analizzato |
| `$nodeLabel.email.replyToAddresses` | Elenco reply-to analizzato |
| `$nodeLabel.email.text` | Corpo in testo semplice |
| `$nodeLabel.email.html` | Corpo HTML |
| `$nodeLabel.email.attachments` | Array di metadati degli allegati (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Oggetto degli header decodificato |
| `$nodeLabel.email.uid` | IMAP UID per deduplicazione o logging |
| `$nodeLabel.triggered_by` | Etichetta dell'origine del trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID del nodo sul canvas che ha rilevato l'email |
| `$nodeLabel.triggered_at` | Timestamp ISO per l'esecuzione del workflow |

## Workflow di esempio

**Email di supporto in entrata → riepilogo → instradamento**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** etichetta: `supportInbox`
- **LLM** messaggio utente: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Note

- Molti provider richiedono una **app password** per l'accesso IMAP, invece della password dell'account principale.
- Il contenuto degli allegati non viene iniettato nell'input del workflow; vengono inclusi solo i metadati degli allegati.
- Utilizzare [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) o [DataTable](./datatable-node.md) a valle per instradare o registrare le nuove email.

## Correlati

- [Triggers](../reference/triggers.md) – Panoramica di tutti i punti di ingresso del workflow
- [Third-Party Integrations](../reference/integrations.md) – Configurazione della credenziale IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Aggiungere e gestire le credenziali `imap`
- [Send Email](./send-email-node.md) – Rispondere o inoltrare i messaggi in entrata