# Amazon S3-node

De Amazon S3-node leest en schrijft objecten in [Amazon S3](https://aws.amazon.com/s3/).

## Ondersteunde bewerkingen

- `Create Bucket`: Maakt een bucket aan in de regio van de referentie.
- `Delete Bucket`: Verwijdert een lege bucket.
- `List Buckets`: Toont buckets die zichtbaar zijn voor de referentie.
- `Create Folder`: Maakt een lege mapmarkering aan (een key van nul bytes die eindigt op `/`).
- `Delete Folder`: Verwijdert alle objecten onder een mapprefix (inclusief geneste keys).
- `Get All in Folder`: Toont alle objectmetadata onder een mapprefix (server-side paginering).
- `Upload Object`: Schrijft een tekst-payload naar een bucket/key.
- `Get Object`: Downloadt een object en retourneert ofwel gedecodeerde tekst ofwel base64-inhoud.
- `Copy Object`: Kopieert een object naar een andere key of bucket.
- `List Objects`: Toont objectmetadata onder een prefix (één pagina, tot 1000 keys; ondersteunt continuation tokens).
- `Delete Object`: Verwijdert één object op basis van de key.

## Referentie instellen

Maak een `Amazon S3`-referentie aan in het tabblad Referenties met:

- Access Key ID
- Secret Access Key
- Region
- Optioneel Session Token (voor tijdelijke AWS STS-referenties)

## Algemene velden

- `Bucket`: Naam van de doelbucket (bestemmingsbucket voor kopieerbewerkingen).
- `Object Key`: Padachtige objectkey zoals `reports/daily.json`.
- `Folder Path`: Prefix voor mapbewerkingen (bijvoorbeeld `docs/archive`).
- `Source Bucket`: Optionele bronbucket voor kopiëren; standaard de bestemmingsbucket.
- `Source Object Key`: Bronkey voor kopieerbewerkingen.
- `Prefix`: Wordt gebruikt door lijstbewerkingen om resultaten af te bakenen.
- `Continuation Token`: Optioneel token uit een eerdere lijstrespons om de volgende pagina op te halen.
- `Max Keys`: Paginagrootte voor List Objects (1–1000).
- `Include Binary`: Indien ingeschakeld bij Get Object, wordt `body_base64` geretourneerd in plaats van `body_text`.
- `Body`: Tekstinhoud om te uploaden.
- `Content Type`: Optioneel MIME-type voor geüploade objecten.

## Uitvoervoorbeelden

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

## Opmerkingen

- `Upload Object` uploadt momenteel UTF-8-tekstinhoud.
- `Get Object` kan base64 retourneren voor binaire bestanden door de binaire optie in te schakelen.
- `Create Bucket` gebruikt de regio van de referentie en vereist `s3:CreateBucket`.
- `Delete Bucket` vereist dat de bucket leeg is en heeft `s3:DeleteBucket` nodig.
- `List Buckets` vereist `s3:ListAllMyBuckets`.
- `Create Folder` uploadt een markerobject van nul bytes; S3 heeft geen native maptype.
- `Delete Folder` verwijdert elk object waarvan de key begint met de mapprefix; gebruik dit met zorg.
- `Get All in Folder` pagineert automatisch door de prefix totdat alle objecten zijn geretourneerd.
- `List Objects` retourneert één pagina (tot 1000 keys). Wanneer `truncated` true is, geeft u `next_continuation_token` door aan het veld Continuation Token van de volgende aanroep.
- `Copy Object` vereist `s3:GetObject` op de bron en `s3:PutObject` op de bestemming.

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Credentials](../reference/credentials.md) – Referentietypen en gebruik
- [Third-Party Integrations](../reference/integrations.md) – Amazon S3-referentie instellen
