# Pošlji e-pošto

Vozlišče **Pošlji e-pošto** pošilja e-pošto preko SMTP. Uporabite ga za obvestila, opozorila in transakcijske e-pošte.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP poverilnica iz [Poverilnic](../tabs/credentials-tab.md) |
| `to` | izraz | Prejemnik(i). Ločeni z vejico za več prejemnikov. |
| `cc` | izraz | Prejemnik(i) v kopiji. Ločeni z vejico za več prejemnikov. |
| `bcc` | izraz | Prejemnik(i) v slepi kopiji. Ločeni z vejico za več prejemnikov. Skriti pred drugimi prejemniki. |
| `subject` | izraz | Zadeva e-pošte |
| `emailBody` | izraz | Vsebina telesa e-pošte |
| `attachments` | izraz | Ločeni z vejico [Drive](./drive-node.md) ID-ji datotek za priponke. Pripeti so lahko le datoteke, ki jih ima lastnik delovnega toka ali so deljene z eno od njihovih ekip. |

## Priponke

Pripnite datoteke iz vašega [Drive](./drive-node.md) tako, da v polje `attachments` posredujete enega ali več ID-jev datotek Drive. Uporabite izraz `$`, da se sklicujete na izhod `id` zgornjega vozlišča Drive (na primer `$drive.id`), ali naštejte statične ID-je, ločene z vejicami. Vsak ID se razreši v obsegu lastnika delovnega toka; neveljaven ali nedostopen ID povzroči napako vozlišča namesto pošiljanja delne e-pošte.

## Nastavitev

Dodajte SMTP poverilnico z naslovom strežnika, pristaniščem, e-poštnim naslovom in geslom. Pogosti SMTP strežniki:

- Gmail: `smtp.gmail.com`, pristanišče 587 (zahteva se aplikacijsko geslo)
- Outlook: `smtp.office365.com`, pristanišče 587

## Primer

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Vaša zahteva je bila obdelana",
    "emailBody": "Pozdravljeni,\n\nVaša zahteva za $userInput.body.text je bila zaključena.",
    "attachments": "$drive.id"
  }
}
```

Vrednost `attachments` zgoraj se sklicuje na zgornje vozlišče [Drive](./drive-node.md) z oznako `drive`, ki pripne datoteko, ki jo je ustvarilo.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Obvladovalec napak](./error-handler-node.md) – Pošlji e-pošto ob napaki
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajanje SMTP poverilnic
- [Integracije tretjih oseb](../reference/integrations.md#smtp-email) – Nastavitev SMTP ponudnika (Gmail, Outlook, Mailgun, SendGrid)
