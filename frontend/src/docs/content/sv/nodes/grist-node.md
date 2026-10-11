# Grist

Noden **Grist** läser, skriver och hanterar data i Grist-kalkylblad. Den används för CRUD-operationer, batchuppdateringar och automatisering av kalkylblad.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `credentialId` | UUID | Grist-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operation: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Dokument-ID (från Grist-URL) |
| `gristTableId` | expression | Tabell-ID |
| `gristRecordId` | expression | Post-ID (operationer för enskilda poster) |
| `gristRecordData` | JSON string | Fältvärden för create/update. Använd **kolumn-ID:n** (t.ex. `User_Name`), inte etiketter. |
| `gristRecordsData` | JSON string | Array av poster för batchoperationer |
| `gristFilter` | JSON string | Filter: `{"Column_ID": [values]}` |
| `gristSort` | string | Sortering: `Column_ID` eller `-Column_ID` (fallande) |
| `gristLimit` | number | Max antal poster (standard: 100) |

## Kolumn-ID:n kontra etiketter

Använd **kolumn-ID:n** (med understreck, t.ex. `User_Name`) i `gristRecordData` och filter, inte visningsetiketter. Använd `listColumns` för att identifiera kolumn-ID:n.

## Exempel – Hämta poster

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

## Exempel – Skapa post

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

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till Grist API-nyckel
- [Tredjepartsintegrationer](../reference/integrations.md#grist) – Konfigurering av Grist-autentiseringsuppgifter
