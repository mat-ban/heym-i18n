# Grist

Vozlišče **Grist** bere, piše in upravlja podatke v Grist preglednicah. Uporabite ga za CRUD operacije, serijske posodobitve in avtomatizacijo preglednic.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Grist poverilnica iz [Poverilnic](../tabs/credentials-tab.md) |
| `gristOperation` | niz | Operacija: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | izraz | ID dokumenta (iz Grist URL) |
| `gristTableId` | izraz | ID tabele |
| `gristRecordId` | izraz | ID zapisa (operacije z enim zapisom) |
| `gristRecordData` | JSON niz | Vrednosti polj za ustvarjanje/posodobitev. Uporabite **ID-je stolpcev** (npr. `User_Name`), ne oznak. |
| `gristRecordsData` | JSON niz | Množica zapisov za serijske operacije |
| `gristFilter` | JSON niz | Filter: `{"Column_ID": [values]}` |
| `gristSort` | niz | Razvrščanje: `Column_ID` ali `-Column_ID` (padajoče) |
| `gristLimit` | število | Maksimalno število zapisov (privzeto: 100) |

## ID-ji stolpcev proti oznakam

Uporabite **ID-je stolpcev** (podčrtaji, npr. `User_Name`) v `gristRecordData` in filtrih, ne prikaznih oznak. Uporabite `listColumns` za odkrivanje ID-jev stolpcev.

## Primer – Pridobitev zapisov

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

## Primer – Ustvarjanje zapisa

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

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte Grist API ključ
- [Integracije tretjih oseb](../reference/integrations.md#grist) – Nastavitev Grist poverilnice
