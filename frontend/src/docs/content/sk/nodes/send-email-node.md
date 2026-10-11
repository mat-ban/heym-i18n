# Odoslanie e-mailu

Uzol **Odoslanie e-mailu** odosiela e-maily cez SMTP. Použite ho na notifikácie, upozornenia a transakčné e-maily.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP prihlasovacie údaje z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `to` | expression | Príjemca(ovia). Pre viacerých oddeľte čiarkou. |
| `cc` | expression | Príjemca(ovia) v kópii. Pre viacerých oddeľte čiarkou. |
| `bcc` | expression | Príjemca(ovia) v skrytej kópii. Pre viacerých oddeľte čiarkou. Skryté pred ostatnými príjemcami. |
| `subject` | expression | Predmet e-mailu |
| `emailBody` | expression | Obsah tela e-mailu |
| `attachments` | expression | Čiarkou oddelené ID súborov z [Drive](./drive-node.md), ktoré sa majú priložiť. Priložiť je možné iba súbory vlastnené vlastníkom workflow alebo zdieľané s jedným z jeho tímov. |

## Prílohy

Priložte súbory zo svojho [Drive](./drive-node.md) tak, že do poľa `attachments` zadáte jedno alebo viac ID súborov z Drive.
Použite výraz `$` na odkazovanie výstupu `id` uzla Drive nachádzajúceho sa vyššie v toku (napríklad `$drive.id`),
alebo uveďte statické ID oddelené čiarkami. Každé ID sa vyhodnocuje v rozsahu vlastníka workflow; neplatné alebo
neprístupné ID spôsobí zlyhanie uzla namiesto odoslania čiastočného e-mailu.

## Nastavenie

Pridajte SMTP prihlasovacie údaje so serverom, portom, e-mailom a heslom. Bežné SMTP servery:

- Gmail: `smtp.gmail.com`, port 587 (vyžaduje sa App Password)
- Outlook: `smtp.office365.com`, port 587

## Príklad

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

Hodnota `attachments` vyššie odkazuje na uzol [Drive](./drive-node.md) nachádzajúci sa vyššie v toku s označením `drive`,
a pripája súbor, ktorý vytvoril.

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Error Handler](./error-handler-node.md) – Odoslanie e-mailu pri zlyhaní
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie SMTP prihlasovacích údajov
- [Integrácie tretích strán](../reference/integrations.md#smtp-email) – Nastavenie SMTP poskytovateľa (Gmail, Outlook, Mailgun, SendGrid)
