# Siųsti el. laišką

**Siųsti el. laišką** mazgas siunčia el. laiškus per SMTP. Naudokite jį pranešimams, įspėjimams ir transakciniams el. laiškams.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | SMTP kredencialas iš [Kredencialų](../tabs/credentials-tab.md) |
| `to` | išraiška | Gavėjas(-ai). Atkirtas kableliais, jei yra keli. |
| `cc` | išraiška | Kopija gavėjas(-ai). Atkirtas kableliais, jei yra keli. |
| `bcc` | išraiška | Akloji kopija gavėjas(-ai). Atkirtas kableliais, jei yra keli. Paslėpta nuo kitų gavėjų. |
| `subject` | išraiška | El. laiško tema |
| `emailBody` | išraiška | El. laiško turinys |
| `attachments` | išraiška | Kableliais atkirtos [Drive](./drive-node.md) failų ID, kuriuos reikia pridėti. Pridėti galima tik failus, priklausančius darbo eigai arba bendrinamus su viena iš jų komandų. |

## Priedai

Pridėkite failus iš savo [Drive](./drive-node.md) perduodami vieną ar daugiau Drive failų ID į `attachments` lauką. Naudokite `$` išraišką, kad nurodytumėte aukščiau esančio Drive mazgo `id` išvestį (pavyzdžiui, `$drive.id`), arba išvardinkite statinius ID, atskirtus kableliais. Kiekvienas ID yra išsprendžiamas darbo eigos savininko kontekste; neteisingas arba neprieinamas ID sukelia mazgo nesėkmę, o ne siunčia dalinį el. laišką.

## Nustatymas

Pridėkite SMTP kredencialą su serveriu, prievadu, el. pašto adresu ir slaptažodžiu. Matomas siuntėjas yra pasirenkamas kredencialo laukas **From**; jei From paliekamas tuščias, siunčiama naudojant naudotojo vardą. Dažniausiai naudojami SMTP serveriai:

- Gmail: `smtp.gmail.com`, prievadas 587 (reikalingas programos slaptažodis)
- Outlook: `smtp.office365.com`, prievadas 587

## Pavyzdys

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Jūsų užklausa buvo apdorota",
    "emailBody": "Sveiki,\n\nJūsų užklausa dėl $userInput.body.text buvo įvykdyta.",
    "attachments": "$drive.id"
  }
}
```

Aukščiau pateikta `attachments` vertė nurodo aukščiau esantį [Drive](./drive-node.md) mazgą, pažymėtą kaip `drive`, pridėdama failą, kurį jis sukūrė.

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Klaidų tvarkyklė](./error-handler-node.md) – Siųsti el. laišką nesėkmės atveju
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti SMTP kredencialus
- [Trečiųjų šalių integracijos](../reference/integrations.md#smtp-email) – SMTP paslaugų teikėjo nustatymas (Gmail, Outlook, Mailgun, SendGrid)
