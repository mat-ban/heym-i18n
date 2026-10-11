# Nodo Amazon S3

Il nodo Amazon S3 legge e scrive oggetti in [Amazon S3](https://aws.amazon.com/s3/).

## Operazioni supportate

- `Create Bucket`: Crea un bucket nella region della credenziale.
- `Delete Bucket`: Elimina un bucket vuoto.
- `List Buckets`: Elenca i bucket visibili alla credenziale.
- `Create Folder`: Crea un marcatore di cartella vuota (chiave a zero byte terminante con `/`).
- `Delete Folder`: Elimina tutti gli oggetti sotto un prefisso di cartella (incluse le chiavi annidate).
- `Get All in Folder`: Elenca tutti i metadati degli oggetti sotto un prefisso di cartella (paginazione lato server).
- `Upload Object`: Scrive un payload di testo in un bucket/chiave.
- `Get Object`: Scarica un oggetto e restituisce testo decodificato oppure contenuto base64.
- `Copy Object`: Copia un oggetto in un'altra chiave o in un altro bucket.
- `List Objects`: Elenca i metadati degli oggetti sotto un prefisso (singola pagina, fino a 1000 chiavi; supporta i token di continuazione).
- `Delete Object`: Elimina un singolo oggetto tramite chiave.

## Configurazione delle credenziali

Creare una credenziale `Amazon S3` nella scheda Credenziali con:

- Access Key ID
- Secret Access Key
- Region
- Session Token opzionale (per credenziali temporanee AWS STS)

## Campi comuni

- `Bucket`: Nome del bucket di destinazione (bucket di destinazione per le operazioni di copia).
- `Object Key`: Chiave dell'oggetto in stile percorso, ad esempio `reports/daily.json`.
- `Folder Path`: Prefisso per le operazioni sulle cartelle (ad esempio `docs/archive`).
- `Source Bucket`: Bucket di origine opzionale per la copia; per impostazione predefinita corrisponde al bucket di destinazione.
- `Source Object Key`: Chiave di origine per le operazioni di copia.
- `Prefix`: Utilizzato dalle operazioni di elenco per delimitare i risultati.
- `Continuation Token`: Token opzionale proveniente da una risposta di elenco precedente per recuperare la pagina successiva.
- `Max Keys`: Dimensione della pagina per List Objects (1–1000).
- `Include Binary`: Se abilitato su Get Object, restituisce `body_base64` invece di `body_text`.
- `Body`: Contenuto testuale da caricare.
- `Content Type`: Tipo MIME opzionale per gli oggetti caricati.

## Esempi di output

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Note

- `Upload Object` attualmente carica contenuto testuale UTF-8.
- `Get Object` può restituire base64 per i file binari abilitando l'opzione binaria.
- `Create Bucket` utilizza la region della credenziale e richiede `s3:CreateBucket`.
- `Delete Bucket` richiede che il bucket sia vuoto e necessita di `s3:DeleteBucket`.
- `List Buckets` richiede `s3:ListAllMyBuckets`.
- `Create Folder` carica un oggetto marcatore a zero byte; S3 non dispone di un tipo nativo di directory.
- `Delete Folder` rimuove ogni oggetto la cui chiave inizia con il prefisso della cartella; utilizzare con cautela.
- `Get All in Folder` esegue automaticamente la paginazione attraverso il prefisso fino alla restituzione di tutti gli oggetti.
- `List Objects` restituisce una pagina (fino a 1000 chiavi). Quando `truncated` è true, passare `next_continuation_token` nel campo Continuation Token della chiamata successiva.
- `Copy Object` richiede `s3:GetObject` sull'origine e `s3:PutObject` sulla destinazione.

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Credenziali](../reference/credentials.md) – Tipi di credenziale e utilizzo
- [Integrazioni di terze parti](../reference/integrations.md) – Configurazione delle credenziali Amazon S3