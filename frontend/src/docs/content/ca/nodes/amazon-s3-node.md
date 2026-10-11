# Node Amazon S3

El node Amazon S3 llegeix i escriu objectes a [Amazon S3](https://aws.amazon.com/s3/).

## Operacions admeses

- `Create Bucket`: Crea un bucket a la regió de les credencials.
- `Delete Bucket`: Elimina un bucket buit.
- `List Buckets`: Llista els buckets visibles per a les credencials.
- `Create Folder`: Crea un marcador de carpeta buit (clau de zero bytes que acaba amb `/`).
- `Delete Folder`: Elimina tots els objectes sota un prefix de carpeta (incloent-hi les claus niuades).
- `Get All in Folder`: Llista les metadades de tots els objectes sota un prefix de carpeta (paginació del costat del servidor).
- `Upload Object`: Escriu un payload de text en un bucket/clau.
- `Get Object`: Descarrega un objecte i retorna text descodificat o contingut en base64.
- `Copy Object`: Copia un objecte a una altra clau o bucket.
- `List Objects`: Llista les metadades dels objectes sota un prefix (una sola pàgina, fins a 1000 claus; admet tokens de continuació).
- `Delete Object`: Elimina un sol objecte per clau.

## Configuració de les credencials

Creeu unes credencials `Amazon S3` a la pestanya Credencials amb:

- Access Key ID
- Secret Access Key
- Region
- Session Token opcional (per a credencials temporals d'AWS STS)

## Camps comuns

- `Bucket`: Nom del bucket de destinació (bucket de destinació per a les operacions de còpia).
- `Object Key`: Clau d'objecte tipus ruta, com ara `reports/daily.json`.
- `Folder Path`: Prefix per a les operacions de carpeta (per exemple, `docs/archive`).
- `Source Bucket`: Bucket d'origen opcional per a la còpia; per defecte, el bucket de destinació.
- `Source Object Key`: Clau d'origen per a les operacions de còpia.
- `Prefix`: Utilitzat per les operacions de llistat per acotar els resultats.
- `Continuation Token`: Token opcional d'una resposta de llistat anterior per obtenir la pàgina següent.
- `Max Keys`: Mida de pàgina per a List Objects (1–1000).
- `Include Binary`: Quan s'habilita a Get Object, retorna `body_base64` en lloc de `body_text`.
- `Body`: Contingut de text a pujar.
- `Content Type`: Tipus MIME opcional per als objectes pujats.

## Exemples de sortida

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

## Notes

- `Upload Object` actualment puja contingut de text en UTF-8.
- `Get Object` pot retornar base64 per a fitxers binaris habilitant l'opció binària.
- `Create Bucket` utilitza la regió de les credencials i requereix `s3:CreateBucket`.
- `Delete Bucket` requereix que el bucket estigui buit i necessita `s3:DeleteBucket`.
- `List Buckets` requereix `s3:ListAllMyBuckets`.
- `Create Folder` puja un objecte marcador de zero bytes; S3 no té un tipus de directori natiu.
- `Delete Folder` elimina tots els objectes la clau dels quals comença pel prefix de carpeta; utilitzeu-ho amb precaució.
- `Get All in Folder` pagina automàticament a través del prefix fins que es retornen tots els objectes.
- `List Objects` retorna una pàgina (fins a 1000 claus). Quan `truncated` és cert, passeu `next_continuation_token` al camp Continuation Token de la crida següent.
- `Copy Object` requereix `s3:GetObject` a l'origen i `s3:PutObject` a la destinació.

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Credentials](../reference/credentials.md) – Tipus de credencials i ús
- [Third-Party Integrations](../reference/integrations.md) – Configuració de les credencials d'Amazon S3