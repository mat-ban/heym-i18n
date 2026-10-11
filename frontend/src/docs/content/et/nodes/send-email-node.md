# E-kirja saatmine

Sõlm **E-kirja saatmine** saadab e-kirju SMTP kaudu. Kasutage seda teavituste, hoiatuste ja tehinguliste e-kirjade jaoks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `to` | expression | Adressaat (adressaadid). Mitme puhul eraldage komadega. |
| `cc` | expression | Koopia adressaat (adressaadid). Mitme puhul eraldage komadega. |
| `bcc` | expression | Pimekoopia adressaat (adressaadid). Mitme puhul eraldage komadega. Peidetud teistele adressaatidele. |
| `subject` | expression | E-kirja teema |
| `emailBody` | expression | E-kirja sisu |
| `attachments` | expression | Komadega eraldatud [Drive](./drive-node.md) faili ID-d, mis lisatakse manustena. Manustada saab ainult faile, mis kuuluvad workflow omanikule või on jagatud ühega tema tiimidest. |

## Manused

Manustage faile oma [Drive](./drive-node.md)-st, edastades ühe või mitu Drive faili ID-d väljale `attachments`.
Kasutage `$` avaldist, et viidata ülesvoolu Drive sõlme `id` väljundile (näiteks `$drive.id`),
või loetlege staatilised ID-d komadega eraldatult. Iga ID lahendatakse workflow omaniku skoobis; kehtetu või
kättesaamatu ID põhjustab sõlme nurjumise, mitte osalise e-kirja saatmise.

## Seadistamine

Lisage SMTP mandaat koos serveri, pordi, e-posti ja parooliga. Levinumad SMTP serverid:

- Gmail: `smtp.gmail.com`, port 587 (nõuab rakenduse parooli)
- Outlook: `smtp.office365.com`, port 587

## Näide

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

Ülaltoodud `attachments` väärtus viitab ülesvoolu [Drive](./drive-node.md) sõlmele sildiga `drive`,
manustades faili, mille see lõi.

## Seotud

- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Vigade käsitleja](./error-handler-node.md) – E-kirja saatmine nurjumise korral
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – SMTP mandaatide lisamine
- [Kolmandate osapoolte integratsioonid](../reference/integrations.md#smtp-email) – SMTP teenusepakkuja seadistamine (Gmail, Outlook, Mailgun, SendGrid)
