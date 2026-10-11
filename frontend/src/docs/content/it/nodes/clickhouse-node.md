# ClickHouse

Il nodo **ClickHouse** esegue operazioni CRUD, di conteggio e SQL raw su un database [ClickHouse](https://clickhouse.com/) esterno tramite la sua interfaccia HTTP. Utilizzarlo per scrivere eventi in una tabella ClickHouse da un workflow, leggere o aggregare dati analitici, oppure eseguire SQL arbitrario, senza dover scrivere manualmente richieste HTTP.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziale | ClickHouse |
| Output | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale ClickHouse da [Credenziali](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operazione: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` o `upsert` |
| `clickhouseTable` | expression | Nome semplice della tabella. Obbligatorio per ogni operazione eccetto `query`. |
| `clickhouseQuery` | expression | SQL raw per `query`. `SELECT`/`SHOW`/`DESCRIBE` restituiscono righe; le altre istruzioni vengono eseguite come comandi. |
| `clickhouseFilter` | expression | Oggetto JSON di filtri di uguaglianza, ad esempio `{"status":"active"}`. Utilizzato da `find`, `count`, `update` e `remove`. I valori sono parametrizzati. |
| `clickhouseLimit` | string | Numero massimo di righe per `find` / `getAll` (`0` = illimitato, nessuna clausola LIMIT). Predefinito `100`. |
| `clickhouseSort` | expression | `column` opzionale oppure `column ASC\|DESC` per `find` |
| `clickhouseRowId` | expression | Valore confrontato con la colonna `id` della tabella per `getById` |
| `clickhouseInputMode` | string | Per `insert`/`upsert`: modalità `raw` con array JSON oppure modalità `selective` con campi chiave/valore |
| `clickhouseData` | expression | Array JSON di oggetti riga per `insert`/`upsert`, oppure oggetto JSON di valori di colonna per `update` |
| `clickhouseMappings` | array | Coppie `{key, value}` utilizzate quando `clickhouseInputMode` è `selective` |

## Configurazione delle credenziali

Creare una credenziale **ClickHouse** nella [scheda Credenziali](../tabs/credentials-tab.md) con:

1. **Host** — l'host HTTP senza schema, ad esempio `your-instance.clickhouse.cloud`
2. **Port** — la porta dell'interfaccia HTTP (`8443` per HTTPS, `8123` per HTTP)
3. **Username** / **Password** — valori predefiniti `default` con password vuota
4. **Database** — valore predefinito `default`
5. **Secure** — abilitare per HTTPS (ClickHouse Cloud)

Il nodo si connette tramite il client HTTP ufficiale `clickhouse-connect`. Utilizzare **Test connessione** nella finestra della credenziale per verificare la raggiungibilità prima di salvare.

## Operazioni

| Operazione | Campi obbligatori | Descrizione |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Esegue SQL raw. `SELECT` restituisce `{rows, count}`; le altre istruzioni restituiscono `{result}`. |
| `find` | `clickhouseTable` | Legge righe con filtri di uguaglianza, ordinamento e limite opzionali |
| `getAll` | `clickhouseTable` | Legge righe fino al limite senza filtri |
| `count` | `clickhouseTable` | Conta le righe, con filtro opzionale |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Legge una singola riga tramite la sua colonna `id` |
| `insert` | `clickhouseTable`, `clickhouseData` o mappings | Inserisce una o più righe |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Aggiorna le righe corrispondenti tramite `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Elimina le righe corrispondenti tramite `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` o mappings | Inserisce righe (presuppone una tabella `ReplacingMergeTree`) |

## Sintassi dei filtri

`clickhouseFilter` è un oggetto JSON piatto di controlli di uguaglianza sulle colonne. I valori vengono inviati come parametri di query associati, pertanto sono sicuri contro l'injection.

```json
{ "status": "active", "tenant_id": 42 }
```

Questo viene compilato in `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Nel costruttore di filtri è supportata solo l'uguaglianza; per intervalli, join o aggregazioni, utilizzare l'operazione `query` con SQL raw.

## Modalità di input (insert / upsert)

- **Array JSON** (`raw`): fornire un array JSON di oggetti riga in `clickhouseData`. Le chiavi mancanti in una determinata riga vengono inserite come `NULL`. L'insieme delle colonne è l'unione delle chiavi di tutte le righe.
- **Chiave-valore** (`selective`): dopo aver selezionato una credenziale e una tabella, l'editor rileva le colonne della tabella e crea un campo valore per ciascuna colonna. Viene inserita una riga per esecuzione; ogni valore supporta le espressioni.
## Mutazioni e semantica di ClickHouse

ClickHouse è un database OLAP, pertanto le scritture a livello di riga si comportano diversamente rispetto a un archivio OLTP:

- **`update`** emette `ALTER TABLE … UPDATE` e **`remove`** emette `DELETE FROM`. Entrambe sono **mutazioni asincrone**: vengono applicate in modo differito e risultano relativamente onerose. Si preferiscano scritture in batch rispetto a mutazioni frequenti su singola riga.
- **`upsert`** esegue un `INSERT`. Per ottenere il comportamento di merge-on-key, si configuri la tabella con un motore `ReplacingMergeTree`.
- **`getById`** presuppone che la tabella disponga di una colonna `id`.
- `update` e `remove` richiedono un `clickhouseFilter` non vuoto per evitare mutazioni sull'intera tabella.

## Riferimento dell'output

| Campo di output | Tipo | Descrizione |
|-------------|------|-------------|
| `.rows` | array | Oggetti riga restituiti (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Conteggio delle righe (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Riga singola o `null` (`getById`) |
| `.result` | string | Riepilogo del comando per `query` non-SELECT |
| `.success` | boolean | Indica se l'operazione è riuscita |

## Esempio – Inserimento di un evento

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Esempio – Conteggio degli utenti attivi

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Accesso all'output: `$activeCount.count`.

## Esempio – Query per il report giornaliero

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Accesso all'output: `$dailyReport.rows`, `$dailyReport.count`.

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiunta delle credenziali ClickHouse
- [Integrazioni di terze parti](../reference/integrations.md) – Configurazione delle credenziali di integrazione
