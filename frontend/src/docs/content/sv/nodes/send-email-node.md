# Skicka e-post

Noden **Skicka e-post** skickar e-post via SMTP. Den används för aviseringar, varningar och transaktionella e-postmeddelanden.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `to` | uttryck | Mottagare. Kommaseparerade vid flera. |
| `cc` | uttryck | Kopia till mottagare. Kommaseparerade vid flera. |
| `bcc` | uttryck | Dold kopia till mottagare. Kommaseparerade vid flera. Dold för övriga mottagare. |
| `subject` | uttryck | E-postämne |
| `emailBody` | uttryck | E-postens innehåll |
| `attachments` | uttryck | Kommaseparerade fil-ID:n från [Drive](./drive-node.md) som ska bifogas. Endast filer som ägs av workflowets ägare eller som delats med en av dennes team kan bifogas. |

## Bilagor

Bifoga filer från [Drive](./drive-node.md) genom att ange ett eller flera Drive-fil-ID:n i fältet
`attachments`. Använd ett `$`-uttryck för att referera till en uppströms Drive-nods `id`-utdata (till
exempel `$drive.id`), eller lista statiska ID:n separerade med kommatecken. Varje ID löses upp inom
workflowets ägares omfång; ett ogiltigt eller otillgängligt ID gör att noden misslyckas i stället för att
skicka ett ofullständigt e-postmeddelande.

## Konfiguration

Lägg till en SMTP-autentiseringsuppgift med server, port, e-post och lösenord. Den synliga avsändaren är autentiseringsuppgiftens valfria fält **From**; om From lämnas tomt skickas mejlet som användarnamnet. Vanliga SMTP-servrar:

- Gmail: `smtp.gmail.com`, port 587 (App Password krävs)
- Outlook: `smtp.office365.com`, port 587

## Exempel

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

Värdet för `attachments` ovan refererar till en uppströms [Drive](./drive-node.md)-nod med etiketten
`drive`, och bifogar filen som den producerade.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Felhanterare](./error-handler-node.md) – Skicka e-post vid fel
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till SMTP-autentiseringsuppgifter
- [Tredjepartsintegrationer](../reference/integrations.md#smtp-email) – Konfiguration av SMTP-leverantör (Gmail, Outlook, Mailgun, SendGrid)
