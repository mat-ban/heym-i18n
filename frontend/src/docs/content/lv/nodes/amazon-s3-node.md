# Amazon S3 mezgls

Amazon S3 mezgls nolasa un ieraksta objektus [Amazon S3](https://aws.amazon.com/s3/).

## Atbalstītās operācijas

- `Create Bucket`: Izveido bucket akreditācijas datu reģionā.
- `Delete Bucket`: Dzēš tukšu bucket.
- `List Buckets`: Uzskaita bucket, kas redzami akreditācijas datiem.
- `Create Folder`: Izveido tukšas mapes marķieri (nulles baitu key, kas beidzas ar `/`).
- `Delete Folder`: Dzēš visus objektus zem mapes prefiksa (ieskaitot ligzdotos key).
- `Get All in Folder`: Uzskaita visu objektu metadatus zem mapes prefiksa (servera puses lapošana).
- `Upload Object`: Ieraksta teksta payload uz bucket/key.
- `Get Object`: Lejupielādē objektu un atgriež vai nu dekodētu tekstu, vai base64 saturu.
- `Copy Object`: Kopē objektu uz citu key vai bucket.
- `List Objects`: Uzskaita objektu metadatus zem prefiksa (viena lapa, līdz 1000 key; atbalsta continuation tokens).
- `Delete Object`: Dzēš atsevišķu objektu pēc key.

## Akreditācijas datu iestatīšana

Izveidojiet `Amazon S3` akreditācijas datus cilnē Akreditācijas dati ar:

- Access Key ID
- Secret Access Key
- Region
- Neobligāts Session Token (pagaidu AWS STS akreditācijas datiem)

## Biežāk izmantotie lauki

- `Bucket`: Mērķa bucket nosaukums (galamērķa bucket kopēšanas operācijām).
- `Object Key`: Ceļam līdzīgs objekta key, piemēram, `reports/daily.json`.
- `Folder Path`: Prefikss mapes operācijām (piemēram, `docs/archive`).
- `Source Bucket`: Neobligāts avota bucket kopēšanai; pēc noklusējuma ir galamērķa bucket.
- `Source Object Key`: Avota key kopēšanas operācijām.
- `Prefix`: Izmanto saraksta operācijas, lai ierobežotu rezultātus.
- `Continuation Token`: Neobligāts token no iepriekšējās saraksta atbildes, lai iegūtu nākamo lapu.
- `Max Keys`: Lapas izmērs operācijai List Objects (1–1000).
- `Include Binary`: Ja iespējots operācijā Get Object, atgriež `body_base64` nevis `body_text`.
- `Body`: Augšupielādējamais teksta saturs.
- `Content Type`: Neobligāts MIME tips augšupielādētajiem objektiem.

## Izvades piemēri

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

## Piezīmes

- `Upload Object` pašlaik augšupielādē UTF-8 teksta saturu.
- `Get Object` var atgriezt base64 binārajiem failiem, iespējojot bināro opciju.
- `Create Bucket` izmanto akreditācijas datu reģionu un pieprasa `s3:CreateBucket`.
- `Delete Bucket` pieprasa, lai bucket būtu tukšs, un nepieciešams `s3:DeleteBucket`.
- `List Buckets` pieprasa `s3:ListAllMyBuckets`.
- `Create Folder` augšupielādē nulles baitu marķiera objektu; S3 nav vietējā direktoriju tipa.
- `Delete Folder` noņem katru objektu, kura key sākas ar mapes prefiksu; izmantojiet piesardzīgi.
- `Get All in Folder` automātiski lapo cauri prefiksam, līdz tiek atgriezti visi objekti.
- `List Objects` atgriež vienu lapu (līdz 1000 key). Kad `truncated` ir true, nododiet `next_continuation_token` nākamā izsaukuma laukā Continuation Token.
- `Copy Object` pieprasa `s3:GetObject` avotam un `s3:PutObject` galamērķim.

## Saistītais

- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Credentials](../reference/credentials.md) – Akreditācijas datu tipi un lietošana
- [Third-Party Integrations](../reference/integrations.md) – Amazon S3 akreditācijas datu iestatīšana
