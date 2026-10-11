# Send Email

Il nodo **Send Email** invia email tramite SMTP. Utilizzarlo per notifiche, avvisi ed email transazionali.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale SMTP da [Credenziali](../tabs/credentials-tab.md) |
| `to` | expression | Destinatario/i. Separare con virgole per più destinatari. |
| `cc` | expression | Destinatario/i in copia conoscenza. Separare con virgole per più destinatari. |
| `bcc` | expression | Destinatario/i in copia conoscenza nascosta. Separare con virgole per più destinatari. Nascosti agli altri destinatari. |
| `subject` | expression | Oggetto dell'email |
| `emailBody` | expression | Contenuto del corpo dell'email |
| `attachments` | expression | ID file di [Drive](./drive-node.md) separati da virgole da allegare. È possibile allegare solo i file di proprietà del proprietario del workflow o condivisi con uno dei suoi team. |

## Allegati

Allegare file dal proprio [Drive](./drive-node.md) passando uno o più ID file di Drive al campo `attachments`. Utilizzare un'espressione `$` per fare riferimento all'output `id` di un nodo Drive a monte (ad esempio `$drive.id`), oppure elencare ID statici separati da virgole. Ogni ID viene risolto nell'ambito del proprietario del workflow; un ID non valido o inaccessibile causa l'errore del nodo anziché l'invio di un'email parziale.

## Configurazione

Aggiungere una credenziale SMTP con server, porta, email e password. Server SMTP comuni:

- Gmail: `smtp.gmail.com`, porta 587 (richiesta App Password)
- Outlook: `smtp.office365.com`, porta 587

## Esempio

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

Il valore `attachments` sopra riportato fa riferimento a un nodo [Drive](./drive-node.md) a monte etichettato `drive`, allegando il file da esso prodotto.

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Error Handler](./error-handler-node.md) – Inviare un'email in caso di errore
- [Credentials Tab](../tabs/credentials-tab.md) – Aggiungere credenziali SMTP
- [Third-Party Integrations](../reference/integrations.md#smtp-email) – Configurazione dei provider SMTP (Gmail, Outlook, Mailgun, SendGrid)