# BigQuery

El node **BigQuery** executa consultes SQL i insereix files a conjunts de dades de Google BigQuery mitjançant l'API REST v2 de BigQuery. Utilitzeu-lo per consultar conjunts de dades analítics de gran volum o per transmetre files a taules a partir de dades del workflow.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | BigQuery (OAuth2) |
| Sortida | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de BigQuery de [Credencials](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operació: `query` o `insertRows` |
| `bqProjectId` | expression | ID del projecte de Google Cloud (p. ex. `my-gcp-project`) |
| `bqQuery` | expression | Cadena de consulta SQL. Obligatòria per a `query`. |
| `bqMaxResults` | string | Nombre màxim de files retornades per `query` (per defecte `1000`). |
| `bqDatasetId` | expression | ID del conjunt de dades (p. ex. `my_dataset`). Obligatori per a `insertRows`. |
| `bqTableId` | expression | ID de la taula (p. ex. `my_table`). Obligatori per a `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Per a `insertRows`: **Raw** = matriu JSON completa; **Selective** = una sola fila com a parells camp-valor. |
| `bqRows` | expression | Matriu JSON d'objectes de fila per al mode raw (p. ex. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Parells clau-valor per al mode selective. Cada clau és un nom de columna; cada valor és una expressió. |

## Configuració de la credencial

BigQuery utilitza un model **OAuth2 "Bring Your Own App"**. Heu de proporcionar les vostres pròpies credencials OAuth2 de Google Cloud.

**Configuració del backend:** establiu **`FRONTEND_URL`** al backend de Heym amb l'URL pública de l'aplicació (l'adreça que els usuaris escriuen al navegador), p. ex. `https://your-heym-domain`. L'URI de redirecció OAuth sempre és `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Aneu a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → activeu **BigQuery API**.
2. Aneu a **Credentials** → **Create Credentials** → **OAuth client ID** → seleccioneu **Web application**.
3. A **Authorized redirect URIs**, afegiu exactament: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Copieu el **Client ID** i el **Client Secret**.
5. Al Heym Dashboard → **Credencials** → **Nou** → seleccioneu **BigQuery (OAuth2)**.
6. Introduïu el Client ID, el Client Secret i un nom, i feu clic a **Connect** per completar el consentiment OAuth2 en una finestra emergent del navegador.

Els tokens es renoven automàticament en segon pla — no cal cap gestió manual de tokens.

## Operacions

| Operació | Camps obligatoris | Descripció |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Executa una consulta SQL i retorna files |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows o bqMappings | Insereix una o més files mitjançant l'API streaming insertAll |

## Referència de sortida

| Operació | Camp de sortida | Tipus | Descripció |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Matriu d'objectes de fila (nom de columna → valor) |
| `query` | `.total` | number | Nombre de files retornades |
| `query` | `.schema` | array | Camps de l'esquema de la taula |
| `insertRows` | `.insertedCount` | number | Nombre de files inserides correctament |
| `insertRows` | `.errors` | array | Errors d'inserció per fila (buit si tot ha estat correcte) |

## Exemple – Executar una consulta

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Accés a la sortida: `$getUsers.rows` (matriu d'objectes de fila), `$getUsers.rows[0].email`, `$getUsers.total`.

## Exemple – Inserir una fila

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Credentials Tab](../tabs/credentials-tab.md) – Afegir una credencial OAuth2 de BigQuery
- [Google Sheets](./google-sheets-node.md) – Patró OAuth2 similar per a dades de fulls de càlcul
- [Third-Party Integrations](../reference/integrations.md) – Configuració de credencials d'integracions