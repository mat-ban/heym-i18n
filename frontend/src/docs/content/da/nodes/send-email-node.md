# Send Email

**Send Email**-noden sender e-mails via SMTP. Den kan anvendes til notifikationer, advarsler og transaktions-e-mails.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `to` | expression | Modtager(e). Adskilt med komma for flere modtagere. |
| `cc` | expression | Modtager(e) i kopi. Adskilt med komma for flere modtagere. |
| `bcc` | expression | Modtager(e) i blindkopi. Adskilt med komma for flere modtagere. Skjult for andre modtagere. |
| `subject` | expression | E-mail-emne |
| `emailBody` | expression | E-mail-indhold |
| `attachments` | expression | Adskilt med komma [Drive](./drive-node.md) fil-ID'er til vedhæftning. Kun filer ejet af workflow-ejeren eller delt med et af deres teams kan vedhæftes. |

## Vedhæftninger

For at vedhæfte filer fra [Drive](./drive-node.md) skal en eller flere Drive-fil-ID'er angives i feltet `attachments`. 
Brug et `$`-udtryk til at referere til en upstream Drive-nodes `id`-output (f.eks. `$drive.id`), 
eller angiv statiske ID'er adskilt med komma. Hvert ID løses i workflow-ejerens scope; et ugyldigt eller 
utilgængeligt ID medfører fejl i noden i stedet for at sende en delvis e-mail.

## Opsætning

Tilføj SMTP-legitimationsoplysninger med server, port, e-mail og adgangskode. Almindelige SMTP-servere:

- Gmail: `smtp.gmail.com`, port 587 (App-adgangskode påkrævet)
- Outlook: `smtp.office365.com`, port 587

## Eksempel

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

Værdien `attachments` i ovenstående eksempel refererer til en upstream [Drive](./drive-node.md)-node med label `drive`,
hvorved den producerede fil vedhæftes.

## Relateret

- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [Fejlhåndtering](./error-handler-node.md) – Send e-mail ved fejl
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj SMTP-legitimationsoplysninger
- [Tredjepartsintegrationer](../reference/integrations.md#smtp-email) – Opsætning af SMTP-udbydere (Gmail, Outlook, Mailgun, SendGrid)
