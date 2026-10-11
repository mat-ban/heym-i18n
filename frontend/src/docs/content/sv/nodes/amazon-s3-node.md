# Amazon S3-nod

Amazon S3-noden läser och skriver objekt i [Amazon S3](https://aws.amazon.com/s3/).

## Operationer som stöds

- `Create Bucket`: Skapar en bucket i autentiseringsuppgifternas region.
- `Delete Bucket`: Tar bort en tom bucket.
- `List Buckets`: Listar buckets som är synliga för autentiseringsuppgifterna.
- `Create Folder`: Skapar en tom mappmarkör (nollbytes-nyckel som slutar med `/`).
- `Delete Folder`: Tar bort alla objekt under ett mapprefix (inklusive nästlade nycklar).
- `Get All in Folder`: Listar all objektmetadata under ett mapprefix (server-side-paginering).
- `Upload Object`: Skriver en textpayload till en bucket/nyckel.
- `Get Object`: Laddar ner ett objekt och returnerar antingen avkodad text eller base64-innehåll.
- `Copy Object`: Kopierar ett objekt till en annan nyckel eller bucket.
- `List Objects`: Listar objektmetadata under ett prefix (en sida, upp till 1000 nycklar; stöder continuation tokens).
- `Delete Object`: Tar bort ett enskilt objekt via nyckel.

## Konfiguration av autentiseringsuppgifter

Skapa en `Amazon S3`-autentiseringsuppgift under fliken Autentiseringsuppgifter med:

- Access Key ID
- Secret Access Key
- Region
- Valfri Session Token (för tillfälliga AWS STS-autentiseringsuppgifter)

## Vanliga fält

- `Bucket`: Målbucketens namn (destinationsbucket för kopieringsoperationer).
- `Object Key`: Sökvägsliknande objektnyckel, till exempel `reports/daily.json`.
- `Folder Path`: Prefix för mappoperationer (till exempel `docs/archive`).
- `Source Bucket`: Valfri källbucket för kopiering; standardvärdet är destinationsbucketen.
- `Source Object Key`: Källnyckel för kopieringsoperationer.
- `Prefix`: Används av listoperationer för att avgränsa resultat.
- `Continuation Token`: Valfri token från ett tidigare list-svar för att hämta nästa sida.
- `Max Keys`: Sidstorlek för List Objects (1–1000).
- `Include Binary`: När det är aktiverat på Get Object returneras `body_base64` i stället för `body_text`.
- `Body`: Textinnehåll som ska laddas upp.
- `Content Type`: Valfri MIME-typ för uppladdade objekt.

## Exempel på utdata

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

## Anteckningar

- `Upload Object` laddar för närvarande upp UTF-8-textinnehåll.
- `Get Object` kan returnera base64 för binära filer genom att aktivera det binära alternativet.
- `Create Bucket` använder autentiseringsuppgifternas region och kräver `s3:CreateBucket`.
- `Delete Bucket` kräver att bucketen är tom och behöver `s3:DeleteBucket`.
- `List Buckets` kräver `s3:ListAllMyBuckets`.
- `Create Folder` laddar upp ett nollbytes-markörobjekt; S3 har ingen inbyggd katalogtyp.
- `Delete Folder` tar bort alla objekt vars nyckel börjar med mapprefixet; använd med försiktighet.
- `Get All in Folder` paginerar automatiskt genom prefixet tills alla objekt har returnerats.
- `List Objects` returnerar en sida (upp till 1000 nycklar). När `truncated` är true skickas `next_continuation_token` in i nästa anrops Continuation Token-fält.
- `Copy Object` kräver `s3:GetObject` på källan och `s3:PutObject` på destinationen.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Autentiseringsuppgifter](../reference/credentials.md) – Typer av autentiseringsuppgifter och användning
- [Tredjepartsintegrationer](../reference/integrations.md) – Konfiguration av Amazon S3-autentiseringsuppgifter
