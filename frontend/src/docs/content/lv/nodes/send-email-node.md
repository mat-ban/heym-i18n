# Sūtīt e-pastu

**Sūtīt e-pastu** mezgls sūta e-pastus, izmantojot SMTP. Izmantojiet to paziņojumiem, brīdinājumiem un darījumu e-pastiem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP akreditācijas dati no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `to` | expression | Saņēmējs(-i). Vairākiem atdaliet ar komatu. |
| `cc` | expression | Kopijas saņēmējs(-i). Vairākiem atdaliet ar komatu. |
| `bcc` | expression | Slepenās kopijas saņēmējs(-i). Vairākiem atdaliet ar komatu. Paslēpts no citiem saņēmējiem. |
| `subject` | expression | E-pasta tēma |
| `emailBody` | expression | E-pasta saturs |
| `attachments` | expression | Ar komatu atdalīti [Drive](./drive-node.md) failu ID, ko pievienot. Var pievienot tikai failus, kas pieder workflow īpašniekam vai ir kopīgoti ar kādu no viņa komandām. |

## Pielikumi

Pievienojiet failus no sava [Drive](./drive-node.md), nododot vienu vai vairākus Drive failu ID laukā `attachments`.
Izmantojiet `$` izteiksmi, lai atsauktos uz iepriekšējā Drive mezgla `id` izvadi (piemēram, `$drive.id`),
vai uzskaitiet statiskus ID, atdalot tos ar komatiem. Katrs ID tiek atrisināts workflow īpašnieka tvērumā; nederīgs vai
nepieejams ID izraisa mezgla kļūmi, nevis daļēja e-pasta nosūtīšanu.

## Iestatīšana

Pievienojiet SMTP akreditācijas datus ar serveri, portu, e-pastu un paroli. Biežāk izmantotie SMTP serveri:

- Gmail: `smtp.gmail.com`, ports 587 (nepieciešama App Password)
- Outlook: `smtp.office365.com`, ports 587

## Piemērs

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

Iepriekš minētā `attachments` vērtība atsaucas uz iepriekšējo [Drive](./drive-node.md) mezglu ar apzīmējumu `drive`,
pievienojot failu, ko tas izveidoja.

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Kļūdu apstrādātājs](./error-handler-node.md) – Sūtīt e-pastu kļūmes gadījumā
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienot SMTP akreditācijas datus
- [Trešo pušu integrācijas](../reference/integrations.md#smtp-email) – SMTP pakalpojumu sniedzēja iestatīšana (Gmail, Outlook, Mailgun, SendGrid)
