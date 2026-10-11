# Grist

**Grist** čvor čita, zapisuje i upravlja podacima u Grist proračunskim tablicama. Koristite ga za CRUD operacije, skupna ažuriranja i automatizaciju proračunskih tablica.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Grist vjerodajnica iz [Vjerodajnice](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operacija: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID dokumenta (iz Grist URL-a) |
| `gristTableId` | expression | ID tablice |
| `gristRecordId` | expression | ID zapisa (operacije s pojedinačnim zapisom) |
| `gristRecordData` | JSON string | Vrijednosti polja za stvaranje/ažuriranje. Koristite **ID-ove stupaca** (npr. `User_Name`), ne oznake. |
| `gristRecordsData` | JSON string | Polje zapisa za skupne operacije |
| `gristFilter` | JSON string | Filter: `{"Column_ID": [values]}` |
| `gristSort` | string | Sortiranje: `Column_ID` ili `-Column_ID` (silazno) |
| `gristLimit` | number | Maksimalan broj zapisa (zadano: 100) |

## ID-ovi stupaca naspram oznaka

Koristite **ID-ove stupaca** (donje crte, npr. `User_Name`) u `gristRecordData` i filtrima, ne oznake za prikaz. Koristite `listColumns` za otkrivanje ID-ova stupaca.

## Primjer – Dohvaćanje zapisa

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Primjer – Stvaranje zapisa

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## Povezano

- [Vrste čvorova](../reference/node-types.md) – Pregled svih vrsta čvorova
- [Kartica Vjerodajnice](../tabs/credentials-tab.md) – Dodajte Grist API ključ
- [Integracije trećih strana](../reference/integrations.md#grist) – Postavljanje Grist vjerodajnica
