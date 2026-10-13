# Trimitere Email

Nodul **Trimitere Email** trimite emailuri prin SMTP. Utilizați-l pentru notificări, alerte și emailuri tranzacționale.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare SMTP din [Acreditări](../tabs/credentials-tab.md) |
| `to` | expression | Destinatar(i). Separați prin virgulă pentru mai mulți. |
| `cc` | expression | Destinatar(i) în copie (carbon-copy). Separați prin virgulă pentru mai mulți. |
| `bcc` | expression | Destinatar(i) în copie ascunsă (blind carbon-copy). Separați prin virgulă pentru mai mulți. Ascunși de ceilalți destinatari. |
| `subject` | expression | Subiectul emailului |
| `emailBody` | expression | Conținutul corpului emailului |
| `attachments` | expression | ID-uri de fișiere din [Drive](./drive-node.md) separate prin virgulă, pentru atașare. Doar fișierele deținute de proprietarul workflow-ului sau partajate cu una dintre echipele acestuia pot fi atașate. |

## Atașamente

Atașați fișiere din [Drive](./drive-node.md) transmițând unul sau mai multe ID-uri de fișiere Drive către câmpul `attachments`.
Utilizați o expresie `$` pentru a face referire la ieșirea `id` a unui nod Drive anterior (de exemplu `$drive.id`),
sau listați ID-uri statice separate prin virgule. Fiecare ID este rezolvat în domeniul de aplicare al proprietarului workflow-ului; un ID invalid sau
inaccesibil cauzează eșecul nodului în loc să trimită un email parțial.

## Configurare

Adăugați o acreditare SMTP cu server, port, email și parolă. Expeditorul vizibil este câmpul opțional **From** al acreditării; dacă From este lăsat gol, trimiterea se face cu numele de utilizator. Servere SMTP comune:

- Gmail: `smtp.gmail.com`, port 587 (necesită App Password)
- Outlook: `smtp.office365.com`, port 587

## Exemplu

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

Valoarea `attachments` de mai sus face referire la un nod [Drive](./drive-node.md) anterior etichetat `drive`,
atașând fișierul pe care acesta l-a produs.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Error Handler](./error-handler-node.md) – Trimiteți email la eșec
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați acreditări SMTP
- [Integrări terțe](../reference/integrations.md#smtp-email) – Configurare furnizor SMTP (Gmail, Outlook, Mailgun, SendGrid)
