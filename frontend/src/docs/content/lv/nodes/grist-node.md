# Grist

**Grist** mezgls nolasa, raksta un pārvalda datus Grist izklājlapās. Izmantojiet to CRUD operācijām, batch atjauninājumiem un izklājlapu automatizācijai.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | Grist akreditācijas dati no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operācija: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Dokumenta ID (no Grist URL) |
| `gristTableId` | expression | Tabulas ID |
| `gristRecordId` | expression | Ieraksta ID (viena ieraksta operācijām) |
| `gristRecordData` | JSON string | Lauku vērtības izveidei/atjaunināšanai. Izmantojiet **kolonnu ID** (piem., `User_Name`), nevis nosaukumus. |
| `gristRecordsData` | JSON string | Ierakstu masīvs batch operācijām |
| `gristFilter` | JSON string | Filtrs: `{"Column_ID": [values]}` |
| `gristSort` | string | Kārtošana: `Column_ID` vai `-Column_ID` (dilstošā secībā) |
| `gristLimit` | number | Maksimālais ierakstu skaits (noklusējums: 100) |

## Kolonnu ID pret nosaukumiem

Izmantojiet **kolonnu ID** (ar pasvītrām, piem., `User_Name`) `gristRecordData` un filtros, nevis attēlojamos nosaukumus. Izmantojiet `listColumns`, lai noskaidrotu kolonnu ID.

## Piemērs – Ierakstu iegūšana

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

## Piemērs – Ieraksta izveide

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

## Saistītais

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienojiet Grist API atslēgu
- [Trešo pušu integrācijas](../reference/integrations.md#grist) – Grist akreditācijas datu iestatīšana
