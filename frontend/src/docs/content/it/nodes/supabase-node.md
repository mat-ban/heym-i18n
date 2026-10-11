# Supabase

Il nodo **Supabase** legge e modifica le tabelle esposte dall'API PostgREST di un progetto Supabase. Lo si utilizza quando si desidera accedere allo stato applicativo basato su SQL all'interno di un workflow senza dover scrivere manualmente richieste HTTP.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziale | Supabase |
| Output | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale Supabase da [Credenziali](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operazione: `select`, `insert`, `update`, `upsert` o `delete` |
| `supabaseSchema` | expression | Nome dello schema. Se lasciato vuoto, il nodo utilizza lo schema predefinito della credenziale, quindi `public`. |
| `supabaseTable` | expression | Nome semplice della tabella da interrogare o modificare. Inserire lo schema in `supabaseSchema`, non qui. |
| `supabaseSelectColumns` | expression | Elenco di selezione PostgREST separato da virgole per `select` (predefinito `*`) |
| `supabaseFilter` | expression | Oggetto filtro JSON. Supporta corrispondenze esatte, oggetti operatore e gruppi logici, ad esempio `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` o `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Numero massimo di righe da restituire per `select` (`0` = recupera tutte le righe corrispondenti con paginazione lato server, i valori negativi ricadono su `100`) |
| `supabaseOrderBy` | expression | Colonna opzionale per l'ordinamento in `select` |
| `supabaseAscending` | boolean | Ordina in modo crescente se `true`, decrescente se `false` |
| `supabaseRowsInputMode` | string | Per `insert`/`upsert`: modalità `raw` con array JSON oppure `auto` per mappare automaticamente il singolo input a monte |
| `supabaseDataInputMode` | string | Per `update`: modalità `raw` con oggetto JSON oppure `auto` per mappare automaticamente il singolo input a monte |
| `supabaseIgnoredInputFields` | string | Elenco opzionale di nomi di campo separati da virgole da omettere durante la mappatura automatica dei dati di input |
| `supabaseRows` | expression | Array JSON di oggetti riga per `insert` e `upsert` |
| `supabaseOnConflict` | expression | Colonne di destinazione del conflitto opzionali, separate da virgole, per `upsert`, ad esempio `id` o `tenant_id,email` |
| `supabaseData` | expression | Oggetto JSON dei valori di colonna aggiornati per `update` |

## Configurazione delle credenziali

Creare una credenziale **Supabase** nella [scheda Credenziali](../tabs/credentials-tab.md) con:

1. Il proprio **Project URL**, ad esempio `https://your-project.supabase.co`
2. Una **API key** con accesso alle tabelle che questo workflow deve utilizzare
3. Uno **schema predefinito** opzionale (predefinito `public`)

Il nodo comunica con l'endpoint PostgREST di Supabase all'indirizzo `/rest/v1/<table>`.
Utilizzare `supabaseTable` solo per la tabella, ad esempio `users` o `profiles`. Non inserire `schema.table`, `rpc/...` o altri percorsi API in questo campo.

Quando viene selezionata una credenziale Supabase valida, l'editor può individuare le tabelle esposte e le colonne delle tabelle direttamente dai metadati OpenAPI di PostgREST. Utilizzare il menu a discesa **tabelle individuate** per selezionare una tabella e i **chip delle colonne** sotto **Select Columns** per costruire rapidamente un elenco di selezione.

## Operazioni

| Operazione | Campi obbligatori | Descrizione |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Legge le righe con filtri di corrispondenza esatta, limite e ordinamento opzionali |
| `insert` | `supabaseTable`, `supabaseRows` o mappatura automatica dell'input | Inserisce una o più righe |
| `update` | `supabaseTable`, `supabaseData` o mappatura automatica dell'input, `supabaseFilter` | Aggiorna le righe corrispondenti al filtro |
| `upsert` | `supabaseTable`, `supabaseRows` o mappatura automatica dell'input | Inserisce o unisce righe utilizzando la semantica upsert di Supabase. Utilizzare `supabaseOnConflict` quando è necessaria una destinazione di conflitto esplicita. |
| `delete` | `supabaseTable`, `supabaseFilter` | Elimina le righe corrispondenti al filtro |

## Sintassi dei filtri

`supabaseFilter` compila JSON strutturato in parametri di query PostgREST.

- Corrispondenza esatta: `{"status":"active"}`
- Confronto: `{"created_at":{"gte":"2026-01-01"}}`
- Appartenenza: `{"status":{"in":["active","paused"]}}`
- Corrispondenza di pattern: `{"email":{"ilike":"*@example.com"}}`
- OR logico: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- AND logico: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Per più operatori sullo stesso campo, preferire un gruppo logico:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginazione

`select` esegue ora una vera paginazione lato server verso PostgREST.

- `supabaseLimit: "0"` recupera tutte le righe corrispondenti pagina per pagina
- I valori di `supabaseLimit` superiori a 1000 si distribuiscono automaticamente su più richieste
- I risultati vengono uniti in un unico array `.rows` e `.count` rimane il conteggio totale delle righe corrispondenti

Quando si leggono tabelle di grandi dimensioni, impostare un `supabaseOrderBy` stabile per mantenere prevedibili i confini delle pagine.
## Auto-map Input

Per `insert`, `upsert` e `update`, passare il nodo a **Auto-map input** quando il singolo
nodo a monte restituisce già la struttura che si desidera scrivere.

- Un singolo oggetto diventa una riga o un payload di aggiornamento
- Un array di oggetti diventa più righe per `insert` / `upsert`
- Un oggetto a monte con un array `rows` riutilizza direttamente tale array
- `supabaseIgnoredInputFields` consente di escludere campi quali `id`, `created_at` o `success`

## Output Reference

| Campo di output | Tipo | Descrizione |
|-------------|------|-------------|
| `.rows` | array | Oggetti riga restituiti |
| `.count` | number | Numero di righe restituite o interessate |
| `.success` | boolean | Indica se l'operazione è riuscita |

## Esempio – Select Active Users

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

Accesso all'output: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Esempio – Upsert a Profile Row

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

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Credentials Tab](../tabs/credentials-tab.md) – Aggiungere le credenziali Supabase
- [Third-Party Integrations](../reference/integrations.md) – Configurazione delle credenziali di integrazione
