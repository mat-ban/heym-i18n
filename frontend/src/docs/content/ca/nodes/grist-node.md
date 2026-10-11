# Grist

El node **Grist** llegeix, escriu i gestiona dades en fulls de càlcul de Grist. Utilitzeu-lo per a operacions CRUD, actualitzacions per lots i automatització de fulls de càlcul.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Grist des de [Credencials](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operació: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID del document (de la URL de Grist) |
| `gristTableId` | expression | ID de la taula |
| `gristRecordId` | expression | ID del registre (operacions d'un sol registre) |
| `gristRecordData` | JSON string | Valors dels camps per a crear/actualitzar. Utilitzeu els **IDs de columna** (p. ex. `User_Name`), no les etiquetes. |
| `gristRecordsData` | JSON string | Array de registres per a operacions per lots |
| `gristFilter` | JSON string | Filtre: `{"Column_ID": [values]}` |
| `gristSort` | string | Ordenació: `Column_ID` o `-Column_ID` (descendent) |
| `gristLimit` | number | Nombre màxim de registres (per defecte: 100) |

## IDs de columna vs etiquetes

Utilitzeu els **IDs de columna** (amb guions baixos, p. ex. `User_Name`) a `gristRecordData` i als filtres, no les etiquetes de visualització. Utilitzeu `listColumns` per descobrir els IDs de columna.

## Exemple – Obtenir registres

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

## Exemple – Crear registre

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

## Relacionat

- [Tipus de node](../reference/node-types.md) – Visió general de tots els tipus de node
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegir la clau API de Grist
- [Integracions de tercers](../reference/integrations.md#grist) – Configuració de la credencial de Grist