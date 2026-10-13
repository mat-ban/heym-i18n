# E-mail verzenden

De node **E-mail verzenden** verzendt e-mails via SMTP. Gebruik deze voor meldingen, waarschuwingen en transactionele e-mails.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `to` | expression | Ontvanger(s). Door komma's gescheiden voor meerdere. |
| `cc` | expression | Carbon-copy ontvanger(s). Door komma's gescheiden voor meerdere. |
| `bcc` | expression | Blind carbon-copy ontvanger(s). Door komma's gescheiden voor meerdere. Verborgen voor andere ontvangers. |
| `subject` | expression | Onderwerp van de e-mail |
| `emailBody` | expression | Inhoud van de e-mailbody |
| `attachments` | expression | Door komma's gescheiden [Drive](./drive-node.md)-bestands-ID's om bij te voegen. Alleen bestanden die eigendom zijn van de workflow-eigenaar of gedeeld zijn met een van diens teams kunnen worden bijgevoegd. |

## Bijlagen

Voeg bestanden uit uw [Drive](./drive-node.md) bij door een of meer Drive-bestands-ID's door te geven aan het veld `attachments`. Gebruik een `$`-expressie om te verwijzen naar de `id`-uitvoer van een upstream Drive-node (bijvoorbeeld `$drive.id`), of geef statische ID's op, gescheiden door komma's. Elke ID wordt opgelost binnen het bereik van de workflow-eigenaar; een ongeldige of ontoegankelijke ID laat de node mislukken in plaats van een gedeeltelijke e-mail te verzenden.

## Configuratie

Voeg een SMTP-referentie toe met server, poort, e-mail en wachtwoord. De zichtbare afzender is het optionele veld **From** van de referentie; bij een leeg From-veld wordt verzonden met de gebruikersnaam. Veelvoorkomende SMTP-servers:

- Gmail: `smtp.gmail.com`, poort 587 (App-wachtwoord vereist)
- Outlook: `smtp.office365.com`, poort 587

## Voorbeeld

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

De waarde van `attachments` hierboven verwijst naar een upstream [Drive](./drive-node.md)-node met het label `drive`, en voegt het bestand bij dat deze heeft geproduceerd.

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Error Handler](./error-handler-node.md) – E-mail verzenden bij een fout
- [Credentials Tab](../tabs/credentials-tab.md) – SMTP-referenties toevoegen
- [Third-Party Integrations](../reference/integrations.md#smtp-email) – SMTP-providerconfiguratie (Gmail, Outlook, Mailgun, SendGrid)
