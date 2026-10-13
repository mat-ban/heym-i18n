# E-mail küldése

A **E-mail küldése** csomópont e-maileket küld SMTP-n keresztül. Használja értesítésekhez, riasztásokhoz és tranzakciós e-mailekhez.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | SMTP hitelesítési adat a [Hitelesítési adatok](../tabs/credentials-tab.md) lapról |
| `to` | expression | Címzett(ek). Több címzett esetén vesszővel elválasztva. |
| `cc` | expression | Másolatot kapó címzett(ek). Több címzett esetén vesszővel elválasztva. |
| `bcc` | expression | Rejtett másolatot kapó címzett(ek). Több címzett esetén vesszővel elválasztva. A többi címzett elől rejtve. |
| `subject` | expression | E-mail tárgya |
| `emailBody` | expression | E-mail törzsének tartalma |
| `attachments` | expression | Vesszővel elválasztott [Drive](./drive-node.md) fájl-azonosítók a csatolmányokhoz. Csak a workflow tulajdonosa által birtokolt vagy valamelyik csapatával megosztott fájlok csatolhatók. |

## Csatolmányok

Csatoljon fájlokat a [Drive](./drive-node.md) tárhelyéről úgy, hogy egy vagy több Drive fájl-azonosítót ad át az `attachments` mezőnek. Használjon `$` kifejezést egy korábbi Drive csomópont `id` kimenetére való hivatkozáshoz (például `$drive.id`), vagy sorolja fel a statikus azonosítókat vesszővel elválasztva. Minden azonosító a workflow tulajdonosának hatókörében kerül feloldásra; egy érvénytelen vagy elérhetetlen azonosító a csomópont meghibásodását eredményezi a részleges e-mail elküldése helyett.

## Beállítás

Adjon hozzá egy SMTP hitelesítési adatot a szerverrel, porttal, e-mail-címmel és jelszóval. A látható feladó a hitelesítési adat opcionális **From** mezője; üres From esetén a rendszer a felhasználónévvel küldi el az üzenetet. Gyakori SMTP szerverek:

- Gmail: `smtp.gmail.com`, 587-es port (alkalmazásjelszó szükséges)
- Outlook: `smtp.office365.com`, 587-es port

## Példa

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

A fenti `attachments` érték egy `drive` címkével ellátott korábbi [Drive](./drive-node.md) csomópontra hivatkozik, és csatolja az általa előállított fájlt.

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Hibakezelő](./error-handler-node.md) – E-mail küldése hiba esetén
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – SMTP hitelesítési adatok hozzáadása
- [Külső integrációk](../reference/integrations.md#smtp-email) – SMTP szolgáltató beállítása (Gmail, Outlook, Mailgun, SendGrid)
