# Amazon S3 Node

Amazon S3-noden læser og skriver objekter i [Amazon S3](https://aws.amazon.com/s3/).

## Understøttede operationer

- `Create Bucket`: Opretter en bucket i credential-regionen.
- `Delete Bucket`: Sletter en tom bucket.
- `List Buckets`: Lister buckets, der er synlige for credential.
- `Create Folder`: Opretter en tom foldermarkør (nul-byte nøgle, der slutter med `/`).
- `Delete Folder`: Sletter alle objekter under en folderpræfiks (inklusive nestede nøgler).
- `Get All in Folder`: Lister alle objektmetadata under en folderpræfiks (server-side paginering).
- `Upload Object`: Skriver en tekst-payload til en bucket/nøgle.
- `Get Object`: Downloader et objekt og returnerer enten dekodet tekst eller base64-indhold.
- `Copy Object`: Kopierer et objekt til en anden nøgle eller bucket.
- `List Objects`: Lister objektmetadata under en præfiks (enkelt side, op til 1000 nøgler; understøtter fortsættelsestokens).
- `Delete Object`: Sletter et enkelt objekt via nøgle.

## Opsætning af legitimationsoplysninger

Opret en `Amazon S3`-credential i Credentials-tabellen med:

- Access Key ID
- Secret Access Key
- Region
- Valgfrit Session Token (for midlertidige AWS STS-legitimationsoplysninger)

## Fælles felter

- `Bucket`: Mål-bucket-navn (destination-bucket for kopieringsoperationer).
- `Object Key`: Sti-lignende objektnøgle såsom `reports/daily.json`.
- `Folder Path`: Præfiks for folderoperationer (for eksempel `docs/archive`).
- `Source Bucket`: Valgfrit kilde-bucket for kopiering; standard er destination-bucket.
- `Source Object Key`: Kilde-nøgle for kopieringsoperationer.
- `Prefix`: Bruges af list-operationer til at begrænse resultaterne.
- `Continuation Token`: Valgfrit token fra en tidligere list-respons for at hente næste side.
- `Max Keys`: Side-størrelse for List Objects (1–1000).
- `Include Binary`: Når aktiveret på Get Object, returneres `body_base64` i stedet for `body_text`.
- `Body`: Tekstindhold, der skal uploades.
- `Content Type`: Valgfri MIME-type for uploadede objekter.

## Output-eksempler

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

## Noter

- `Upload Object` uploader i øjeblikket UTF-8 tekstindhold.
- `Get Object` kan returnere base64 for binære filer ved at aktivere binary-optionen.
- `Create Bucket` bruger credential-regionen og kræver `s3:CreateBucket`.
- `Delete Bucket` kræver, at bucketen er tom, og har brug for `s3:DeleteBucket`.
- `List Buckets` kræver `s3:ListAllMyBuckets`.
- `Create Folder` uploader en nul-byte markør-objekt; S3 har ingen indbygget mappetype.
- `Delete Folder` fjerner hvert objekt, hvis nøgle starter med folderpræfikset; brug med forsigtighed.
- `Get All in Folder` auto-paginerer gennem præfikset, indtil alle objekter er returneret.
- `List Objects` returnerer én side (op til 1000 nøgler). Når `truncated` er sand, skal `next_continuation_token` sendes ind i Continuation Token-feltet i næste kald.
- `Copy Object` kræver `s3:GetObject` på kilden og `s3:PutObject` på destinationen.

## Relateret

- [Node Types](../reference/node-types.md) – Oversigt over alle nodetyper
- [Credentials](../reference/credentials.md) – Credential-typer og brug
- [Third-Party Integrations](../reference/integrations.md) – Opsætning af Amazon S3-legitimationsoplysninger
