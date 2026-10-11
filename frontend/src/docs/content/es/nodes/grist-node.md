# Grist

El nodo **Grist** lee, escribe y gestiona datos en hojas de cálculo de Grist. Utilícelo para operaciones CRUD, actualizaciones por lotes y automatización de hojas de cálculo.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Grist desde [Credenciales](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operación: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID del documento (desde la URL de Grist) |
| `gristTableId` | expression | ID de la tabla |
| `gristRecordId` | expression | ID del registro (operaciones de registro único) |
| `gristRecordData` | JSON string | Valores de campo para crear/actualizar. Utilice **IDs de columna** (p. ej. `User_Name`), no etiquetas. |
| `gristRecordsData` | JSON string | Array de registros para operaciones por lotes |
| `gristFilter` | JSON string | Filtro: `{"Column_ID": [values]}` |
| `gristSort` | string | Ordenación: `Column_ID` o `-Column_ID` (descendente) |
| `gristLimit` | number | Máximo de registros (predeterminado: 100) |

## IDs de columna vs etiquetas

Utilice **IDs de columna** (con guiones bajos, p. ej. `User_Name`) en `gristRecordData` y en los filtros, no etiquetas de visualización. Utilice `listColumns` para descubrir los IDs de columna.

## Ejemplo – Obtener registros

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

## Ejemplo – Crear registro

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

## Relacionado

- [Tipos de nodo](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir la clave de API de Grist
- [Integraciones de terceros](../reference/integrations.md#grist) – Configuración de la credencial de Grist