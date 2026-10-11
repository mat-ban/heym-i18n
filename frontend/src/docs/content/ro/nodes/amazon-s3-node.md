# Nodul Amazon S3

Nodul Amazon S3 citește și scrie obiecte în [Amazon S3](https://aws.amazon.com/s3/).

## Operațiuni acceptate

- `Create Bucket`: Creează un bucket în regiunea acreditării.
- `Delete Bucket`: Șterge un bucket gol.
- `List Buckets`: Listează bucket-urile vizibile pentru acreditare.
- `Create Folder`: Creează un marker de folder gol (cheie de zero octeți care se termină cu `/`).
- `Delete Folder`: Șterge toate obiectele dintr-un prefix de folder (inclusiv cheile imbricate).
- `Get All in Folder`: Listează toate metadatele obiectelor dintr-un prefix de folder (paginare pe partea de server).
- `Upload Object`: Scrie un payload text într-un bucket/cheie.
- `Get Object`: Descarcă un obiect și returnează fie text decodat, fie conținut base64.
- `Copy Object`: Copiază un obiect într-o altă cheie sau un alt bucket.
- `List Objects`: Listează metadatele obiectelor dintr-un prefix (o singură pagină, până la 1000 de chei; acceptă token-uri de continuare).
- `Delete Object`: Șterge un singur obiect după cheie.

## Configurarea acreditărilor

Creați o acreditare `Amazon S3` în fila Acreditări cu:

- Access Key ID
- Secret Access Key
- Region
- Session Token opțional (pentru acreditări temporare AWS STS)

## Câmpuri comune

- `Bucket`: Numele bucket-ului țintă (bucket-ul destinație pentru operațiunile de copiere).
- `Object Key`: Cheie de obiect de tip cale, precum `reports/daily.json`.
- `Folder Path`: Prefix pentru operațiunile cu foldere (de exemplu `docs/archive`).
- `Source Bucket`: Bucket sursă opțional pentru copiere; implicit este bucket-ul destinație.
- `Source Object Key`: Cheia sursă pentru operațiunile de copiere.
- `Prefix`: Folosit de operațiunile de listare pentru a restrânge rezultatele.
- `Continuation Token`: Token opțional dintr-un răspuns de listare anterior pentru a prelua pagina următoare.
- `Max Keys`: Dimensiunea paginii pentru List Objects (1–1000).
- `Include Binary`: Când este activat la Get Object, returnează `body_base64` în loc de `body_text`.
- `Body`: Conținut text de încărcat.
- `Content Type`: Tip MIME opțional pentru obiectele încărcate.

## Exemple de ieșire

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

- `Upload Object` încarcă în prezent conținut text UTF-8.
- `Get Object` poate returna base64 pentru fișiere binare prin activarea opțiunii binare.
- `Create Bucket` utilizează regiunea acreditării și necesită `s3:CreateBucket`.
- `Delete Bucket` necesită ca bucket-ul să fie gol și necesită `s3:DeleteBucket`.
- `List Buckets` necesită `s3:ListAllMyBuckets`.
- `Create Folder` încarcă un obiect marker de zero octeți; S3 nu are un tip nativ de director.
- `Delete Folder` elimină fiecare obiect a cărui cheie începe cu prefixul folderului; utilizați cu prudență.
- `Get All in Folder` paginează automat prin prefix până când toate obiectele sunt returnate.
- `List Objects` returnează o singură pagină (până la 1000 de chei). Când `truncated` este true, transmiteți `next_continuation_token` în câmpul Continuation Token al apelului următor.
- `Copy Object` necesită `s3:GetObject` pe sursă și `s3:PutObject` pe destinație.

## Resurse conexe

- [Node Types](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Credentials](../reference/credentials.md) – Tipuri de acreditări și utilizarea acestora
- [Third-Party Integrations](../reference/integrations.md) – Configurarea acreditărilor Amazon S3
