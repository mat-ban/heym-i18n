# Grist

Il nodo **Grist** legge, scrive e gestisce dati nei fogli di calcolo Grist. Utilizzarlo per operazioni CRUD, aggiornamenti in batch e automazione dei fogli di calcolo.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale Grist da [Credenziali](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operazione: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID del documento (dall'URL di Grist) |
| `gristTableId` | expression | ID della tabella |
| `gristRecordId` | expression | ID del record (operazioni su record singolo) |
| `gristRecordData` | JSON string | Valori dei campi per create/update. Utilizzare gli **ID delle colonne** (es. `User_Name`), non le etichette. |
| `gristRecordsData` | JSON string | Array di record per operazioni in batch |
| `gristFilter` | JSON string | Filtro: `{"Column_ID": [values]}` |
| `gristSort` | string | Ordinamento: `Column_ID` o `-Column_ID` (decrescente) |
| `gristLimit` | number | Numero massimo di record (predefinito: 100) |

## ID delle colonne vs etichette

Utilizzare gli **ID delle colonne** (con underscore, es. `User_Name`) in `gristRecordData` e nei filtri, non le etichette visualizzate. Utilizzare `listColumns` per individuare gli ID delle colonne.

## Esempio – Get Records

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

## Esempio – Create Record

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

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere la chiave API di Grist
- [Integrazioni di terze parti](../reference/integrations.md#grist) – Configurazione delle credenziali Grist