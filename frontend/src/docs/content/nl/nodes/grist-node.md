# Grist

De **Grist**-node leest, schrijft en beheert gegevens in Grist-spreadsheets. Gebruik deze voor CRUD-operaties, batch-updates en spreadsheetautomatisering.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | Grist-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operatie: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Document-ID (uit Grist-URL) |
| `gristTableId` | expression | Tabel-ID |
| `gristRecordId` | expression | Record-ID (operaties op één record) |
| `gristRecordData` | JSON string | Veldwaarden voor aanmaken/bijwerken. Gebruik **kolom-ID's** (bijv. `User_Name`), niet labels. |
| `gristRecordsData` | JSON string | Array van records voor batchoperaties |
| `gristFilter` | JSON string | Filter: `{"Column_ID": [values]}` |
| `gristSort` | string | Sortering: `Column_ID` of `-Column_ID` (aflopend) |
| `gristLimit` | number | Maximaal aantal records (standaard: 100) |

## Kolom-ID's versus labels

Gebruik **kolom-ID's** (met underscores, bijv. `User_Name`) in `gristRecordData` en filters, niet de weergegeven labels. Gebruik `listColumns` om kolom-ID's te achterhalen.

## Voorbeeld – Records ophalen

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

## Voorbeeld – Record aanmaken

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

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Tabblad Referenties](../tabs/credentials-tab.md) – Grist API-sleutel toevoegen
- [Integraties met derden](../reference/integrations.md#grist) – Grist-referentie instellen
