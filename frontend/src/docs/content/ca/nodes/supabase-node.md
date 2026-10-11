# Supabase

El node **Supabase** llegeix i modifica taules exposades per l'API PostgREST d'un projecte Supabase. Utilitzeu-lo quan vulgueu accedir a l'estat de l'aplicació basat en SQL des d'un workflow sense escriure sol·licituds HTTP manualment.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | Supabase |
| Sortida | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Supabase de [Credencials](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operació: `select`, `insert`, `update`, `upsert` o `delete` |
| `supabaseSchema` | expression | Nom de l'esquema. Si es deixa en blanc, el node utilitza l'esquema per defecte de la credencial i, si no n'hi ha, `public`. |
| `supabaseTable` | expression | Nom simple de la taula a consultar o modificar. Poseu l'esquema a `supabaseSchema`, no aquí. |
| `supabaseSelectColumns` | expression | Llista de selecció PostgREST separada per comes per a `select` (per defecte `*`) |
| `supabaseFilter` | expression | Objecte de filtre JSON. Admet coincidències exactes, objectes d'operadors i grups lògics, p. ex. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` o `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Nombre màxim de files a retornar per a `select` (`0` = obtenir totes les files coincidents amb paginació del costat del servidor; els valors negatius es reverteixen a `100`) |
| `supabaseOrderBy` | expression | Columna opcional per ordenar per a `select` |
| `supabaseAscending` | boolean | Ordena ascendentment quan és `true`, descendentment quan és `false` |
| `supabaseRowsInputMode` | string | Per a `insert`/`upsert`: mode `raw` amb matriu JSON o `auto` per mapar automàticament l'única entrada upstream |
| `supabaseDataInputMode` | string | Per a `update`: mode `raw` amb objecte JSON o `auto` per mapar automàticament l'única entrada upstream |
| `supabaseIgnoredInputFields` | string | Noms de camps opcionals separats per comes per ometre'ls durant el mapatge automàtic de les dades d'entrada |
| `supabaseRows` | expression | Matriu JSON d'objectes de fila per a `insert` i `upsert` |
| `supabaseOnConflict` | expression | Columnes objectiu de conflicte opcionals separades per comes per a `upsert`, per exemple `id` o `tenant_id,email` |
| `supabaseData` | expression | Objecte JSON amb els valors de columna actualitzats per a `update` |

## Configuració de la credencial

Creeu una credencial **Supabase** a la [pestanya Credencials](../tabs/credentials-tab.md) amb:

1. La vostra **URL del projecte**, per exemple `https://your-project.supabase.co`
2. Una **clau d'API** amb accés a les taules que aquest workflow ha d'utilitzar
3. Un **esquema per defecte** opcional (per defecte `public`)

El node es comunica amb l'endpoint PostgREST de Supabase a `/rest/v1/<table>`.
Utilitzeu `supabaseTable` només per a la taula, com ara `users` o `profiles`. No hi passeu `schema.table`, `rpc/...` ni altres rutes d'API.

Quan se selecciona una credencial de Supabase vàlida, l'editor pot descobrir les taules exposades i les columnes de les taules directament a partir de les metadades OpenAPI de PostgREST. Utilitzeu el desplegable de **taules descobertes** per triar una taula i els **chips de columnes** sota **Select Columns** per construir ràpidament una llista de selecció.

## Operacions

| Operació | Camps obligatoris | Descripció |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Llegeix files amb filtres de coincidència exacta, límit i ordenació opcionals |
| `insert` | `supabaseTable`, `supabaseRows` o mapatge automàtic de l'entrada | Insereix una o més files |
| `update` | `supabaseTable`, `supabaseData` o mapatge automàtic de l'entrada, `supabaseFilter` | Actualitza les files que coincideixen amb el filtre |
| `upsert` | `supabaseTable`, `supabaseRows` o mapatge automàtic de l'entrada | Insereix o fusiona files utilitzant la semàntica d'upsert de Supabase. Utilitzeu `supabaseOnConflict` quan necessiteu un objectiu de conflicte explícit. |
| `delete` | `supabaseTable`, `supabaseFilter` | Elimina les files que coincideixen amb el filtre |

## Sintaxi del filtre

`supabaseFilter` compila JSON estructurat en paràmetres de consulta PostgREST.

- Coincidència exacta: `{"status":"active"}`
- Comparació: `{"created_at":{"gte":"2026-01-01"}}`
- Pertenència: `{"status":{"in":["active","paused"]}}`
- Coincidència de patró: `{"email":{"ilike":"*@example.com"}}`
- OR lògic: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- AND lògic: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Per a múltiples operadors sobre el mateix camp, preferiu un grup lògic:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginació

`select` ara realitza una paginació real del costat del servidor contra PostgREST.

- `supabaseLimit: "0"` obté totes les files coincidents pàgina a pàgina
- Els valors de `supabaseLimit` superiors a 1000 es divideixen automàticament en múltiples sol·licituds
- Els resultats es fusionen en una única matriu `.rows` i `.count` manté el recompte total de files coincidents

Quan llegiu taules grans, establiu un `supabaseOrderBy` estable per mantenir els límits de pàgina previsibles.
## Auto-map Input

Per a `insert`, `upsert` i `update`, canvieu el node a **Auto-map input** quan el node
upstream únic ja genera l'estructura que voleu escriure.

- Un objecte únic es converteix en una fila o en un payload d'actualització
- Una matriu d'objectes es converteix en múltiples files per a `insert` / `upsert`
- Un objecte upstream amb una matriu `rows` reutilitza aquesta matriu directament
- `supabaseIgnoredInputFields` us permet descartar camps com ara `id`, `created_at` o `success`

## Output Reference

| Camp de sortida | Tipus | Descripció |
|-------------|------|-------------|
| `.rows` | array | Objectes de fila retornats |
| `.count` | number | Nombre de files retornades o afectades |
| `.success` | boolean | Indica si l'operació s'ha completat correctament |

## Exemple – Seleccionar usuaris actius

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Accés a la sortida: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Exemple – Upsert d'una fila de perfil

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Credentials Tab](../tabs/credentials-tab.md) – Afegir credencials de Supabase
- [Third-Party Integrations](../reference/integrations.md) – Configuració de credencials d'integracions
