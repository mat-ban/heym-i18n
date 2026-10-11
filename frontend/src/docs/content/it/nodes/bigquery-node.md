# BigQuery

Il nodo **BigQuery** esegue query SQL e inserisce righe nei dataset di Google BigQuery tramite la BigQuery REST API v2. Utilizzarlo per interrogare grandi dataset analitici o per inserire in streaming righe nelle tabelle a partire dai dati del workflow.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziale | BigQuery (OAuth2) |
| Output | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale BigQuery da [Credenziali](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operazione: `query` o `insertRows` |
| `bqProjectId` | expression | ID del progetto Google Cloud (es. `my-gcp-project`) |
| `bqQuery` | expression | Stringa di query SQL. Obbligatoria per `query`. |
| `bqMaxResults` | string | Numero massimo di righe restituite da `query` (predefinito `1000`). |
| `bqDatasetId` | expression | ID del dataset (es. `my_dataset`). Obbligatorio per `insertRows`. |
| `bqTableId` | expression | ID della tabella (es. `my_table`). Obbligatorio per `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Per `insertRows`: **Raw** = array JSON completo; **Selective** = singola riga come coppie chiave-valore. |
| `bqRows` | expression | Array JSON di oggetti riga per la modalità raw (es. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Coppie chiave-valore per la modalità selective. Ogni chiave è il nome di una colonna; ogni valore è un'espressione. |

## Configurazione delle credenziali

BigQuery utilizza un modello **OAuth2 "Bring Your Own App"**. È necessario fornire le proprie credenziali OAuth2 di Google Cloud.

**Configurazione del backend:** Impostare **`FRONTEND_URL`** sul backend di Heym all'URL pubblico dell'applicazione (l'indirizzo digitato dagli utenti nel browser), ad esempio `https://your-heym-domain`. L'URI di reindirizzamento OAuth è sempre `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Accedere a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → abilitare **BigQuery API**.
2. Accedere a **Credentials** → **Create Credentials** → **OAuth client ID** → selezionare **Web application**.
3. In **Authorized redirect URIs**, aggiungere esattamente: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Copiare il **Client ID** e il **Client Secret**.
5. Nella Dashboard di Heym → **Credenziali** → **Nuova** → selezionare **BigQuery (OAuth2)**.
6. Inserire il Client ID, il Client Secret e un nome, quindi fare clic su **Connect** per completare il consenso OAuth2 in una finestra popup del browser.

I Token vengono aggiornati automaticamente in background — non è richiesta alcuna gestione manuale dei Token.

## Operazioni

| Operazione | Campi obbligatori | Descrizione |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Esegue una query SQL e restituisce le righe |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows o bqMappings | Inserisce una o più righe tramite l'API di streaming insertAll |

## Riferimento Output

| Operazione | Campo di output | Tipo | Descrizione |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Array di oggetti riga (nome colonna → valore) |
| `query` | `.total` | number | Numero di righe restituite |
| `query` | `.schema` | array | Campi dello schema della tabella |
| `insertRows` | `.insertedCount` | number | Numero di righe inserite correttamente |
| `insertRows` | `.errors` | array | Errori di inserimento per riga (vuoto in caso di successo completo) |

## Esempio – Eseguire una query

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

Accesso all'output: `$getUsers.rows` (array di oggetti riga), `$getUsers.rows[0].email`, `$getUsers.total`.

## Esempio – Inserire una riga

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

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere una credenziale BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Modello OAuth2 simile per i dati dei fogli di calcolo
- [Integrazioni di terze parti](../reference/integrations.md) – Configurazione delle credenziali di integrazione