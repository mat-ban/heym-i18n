# Slanje e-pošte

Čvor **Slanje e-pošte** šalje e-poštu putem SMTP-a. Koristite ga za obavijesti, upozorenja i transakcijske e-poruke.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP vjerodajnica iz [Vjerodajnice](../tabs/credentials-tab.md) |
| `to` | expression | Primatelj(i). Za više primatelja odvojite zarezom. |
| `cc` | expression | Primatelj(i) u kopiji. Za više primatelja odvojite zarezom. |
| `bcc` | expression | Primatelj(i) u skrivenoj kopiji. Za više primatelja odvojite zarezom. Skriveno od ostalih primatelja. |
| `subject` | expression | Naslov e-pošte |
| `emailBody` | expression | Sadržaj tijela e-pošte |
| `attachments` | expression | ID-ovi datoteka iz [Drive](./drive-node.md) odvojeni zarezom za privitak. Mogu se priložiti samo datoteke u vlasništvu vlasnika workflowa ili one podijeljene s jednim od njegovih timova. |

## Privitci

Priložite datoteke iz svog [Drive](./drive-node.md) prosljeđivanjem jednog ili više ID-ova datoteka iz Drivea u polje `attachments`. Koristite `$` expression za referenciranje izlaza `id` uzvodnog Drive čvora (na primjer `$drive.id`) ili navedite statične ID-ove odvojene zarezima. Svaki se ID razrješava u opsegu vlasnika workflowa; nevažeći ili nedostupni ID uzrokuje pad čvora umjesto slanja djelomične e-pošte.

## Postavljanje

Dodajte SMTP vjerodajnicu s poslužiteljem, portom, e-poštom i lozinkom. Uobičajeni SMTP poslužitelji:

- Gmail: `smtp.gmail.com`, port 587 (potrebna App Password)
- Outlook: `smtp.office365.com`, port 587

## Primjer

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

Vrijednost `attachments` iznad referencira uzvodni [Drive](./drive-node.md) čvor označen kao `drive` te prilaže datoteku koju je proizveo.

## Povezano

- [Vrste čvorova](../reference/node-types.md) – Pregled svih vrsta čvorova
- [Rukovatelj pogreškama](./error-handler-node.md) – Slanje e-pošte pri neuspjehu
- [Kartica Vjerodajnice](../tabs/credentials-tab.md) – Dodavanje SMTP vjerodajnica
- [Integracije trećih strana](../reference/integrations.md#smtp-email) – Postavljanje SMTP pružatelja usluga (Gmail, Outlook, Mailgun, SendGrid)
