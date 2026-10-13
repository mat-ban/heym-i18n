# Enviar correu electrònic

El node **Enviar correu electrònic** envia correus electrònics via SMTP. Utilitzeu-lo per a notificacions, alertes i correus electrònics transaccionals.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial SMTP de [Credencials](../tabs/credentials-tab.md) |
| `to` | expressió | Destinatari(s). Separats per comes per a múltiples. |
| `cc` | expressió | Destinatari(s) en còpia de carbó. Separats per comes per a múltiples. |
| `bcc` | expressió | Destinatari(s) en còpia de carbó oculta. Separats per comes per a múltiples. Ocults per als altres destinataris. |
| `subject` | expressió | Assumpte del correu electrònic |
| `emailBody` | expressió | Contingut del cos del correu electrònic |
| `attachments` | expressió | IDs de fitxers de [Drive](./drive-node.md) separats per comes per adjuntar. Només es poden adjuntar fitxers propietat del propietari del workflow o compartits amb un dels seus equips. |

## Adjuncions

Adjunteu fitxers del vostre [Drive](./drive-node.md) passant un o més IDs de fitxers de Drive al camp `attachments`. Utilitzeu una expressió `$` per referenciar la sortida `id` d'un node Drive anterior (per exemple `$drive.id`), o llisteu IDs estàtics separats per comes. Cada ID es resol en l'àmbit del propietari del workflow; un ID no vàlid o inaccessible fa fallar el node en lloc d'enviar un correu electrònic parcial.

## Configuració

Afegiu una credencial SMTP amb servidor, port, correu electrònic i contrasenya. El remitent visible és el camp opcional **From** de la credencial; si From està en blanc, s'envia amb el nom d'usuari. Servidors SMTP comuns:

- Gmail: `smtp.gmail.com`, port 587 (cal contrasenya d'aplicació)
- Outlook: `smtp.office365.com`, port 587

## Exemple

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

El valor `attachments` anterior referencia un node [Drive](./drive-node.md) anterior etiquetat com a `drive`, adjuntant el fitxer que ha produït.

## Relacionat

- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [Gestor d'errors](./error-handler-node.md) – Enviar correu electrònic en cas de fallada
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegir credencials SMTP
- [Integracions de tercers](../reference/integrations.md#smtp-email) – Configuració de proveïdors SMTP (Gmail, Outlook, Mailgun, SendGrid)
