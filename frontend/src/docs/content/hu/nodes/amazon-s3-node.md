# Amazon S3 csomópont

Az Amazon S3 csomópont objektumokat olvas és ír az [Amazon S3](https://aws.amazon.com/s3/) szolgáltatásban.

## Támogatott műveletek

- `Create Bucket`: Létrehoz egy bucketet a hitelesítési adatokban megadott régióban.
- `Delete Bucket`: Töröl egy üres bucketet.
- `List Buckets`: Listázza a hitelesítési adatok számára látható bucketeket.
- `Create Folder`: Létrehoz egy üres mappajelölőt (nulla bájtos kulcs, amely `/` karakterrel végződik).
- `Delete Folder`: Töröl minden objektumot egy mappaprefix alatt (a beágyazott kulcsokat is beleértve).
- `Get All in Folder`: Listázza az összes objektum metaadatát egy mappaprefix alatt (szerveroldali lapozás).
- `Upload Object`: Szöveges payloadot ír egy bucketbe/kulcsra.
- `Get Object`: Letölt egy objektumot, és vagy dekódolt szöveget, vagy base64 tartalmat ad vissza.
- `Copy Object`: Átmásol egy objektumot egy másik kulcsra vagy bucketbe.
- `List Objects`: Listázza az objektumok metaadatait egy prefix alatt (egy oldal, legfeljebb 1000 kulcs; támogatja a folytatási tokeneket).
- `Delete Object`: Töröl egyetlen objektumot kulcs alapján.

## Hitelesítési adatok beállítása

Hozzon létre egy `Amazon S3` hitelesítési adatot a Hitelesítési adatok lapon az alábbiakkal:

- Access Key ID
- Secret Access Key
- Region
- Opcionális Session Token (ideiglenes AWS STS hitelesítési adatokhoz)

## Gyakori mezők

- `Bucket`: A cél bucket neve (másolási műveleteknél a cél bucket).
- `Object Key`: Útvonalszerű objektumkulcs, például `reports/daily.json`.
- `Folder Path`: Mappaműveletekhez használt prefix (például `docs/archive`).
- `Source Bucket`: Opcionális forrás bucket másoláshoz; alapértelmezésben a cél bucket.
- `Source Object Key`: Forráskulcs másolási műveletekhez.
- `Prefix`: A listázási műveletek használják az eredmények szűkítéséhez.
- `Continuation Token`: Opcionális token egy korábbi listázási válaszból a következő oldal lekéréséhez.
- `Max Keys`: A List Objects oldalmérete (1–1000).
- `Include Binary`: Ha engedélyezett a Get Object műveletnél, `body_base64` értéket ad vissza `body_text` helyett.
- `Body`: A feltöltendő szöveges tartalom.
- `Content Type`: Opcionális MIME-típus a feltöltött objektumokhoz.

## Kimeneti példák

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

## Megjegyzések

- Az `Upload Object` jelenleg UTF-8 szöveges tartalmat tölt fel.
- A `Get Object` base64 tartalmat adhat vissza bináris fájlokhoz a bináris opció engedélyezésével.
- A `Create Bucket` a hitelesítési adatokban megadott régiót használja, és `s3:CreateBucket` jogosultságot igényel.
- A `Delete Bucket` megköveteli, hogy a bucket üres legyen, és `s3:DeleteBucket` jogosultságot igényel.
- A `List Buckets` `s3:ListAllMyBuckets` jogosultságot igényel.
- A `Create Folder` egy nulla bájtos jelölőobjektumot tölt fel; az S3-nak nincs natív könyvtártípusa.
- A `Delete Folder` minden olyan objektumot eltávolít, amelynek kulcsa a mappaprefixszel kezdődik; körültekintéssel használja.
- A `Get All in Folder` automatikusan lapoz a prefixen keresztül, amíg az összes objektum vissza nem tér.
- A `List Objects` egy oldalt ad vissza (legfeljebb 1000 kulcs). Ha a `truncated` értéke true, adja át a `next_continuation_token` értékét a következő hívás Continuation Token mezőjében.
- A `Copy Object` `s3:GetObject` jogosultságot igényel a forráson és `s3:PutObject` jogosultságot a célon.

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Hitelesítési adatok](../reference/credentials.md) – Hitelesítési adattípusok és használatuk
- [Külső integrációk](../reference/integrations.md) – Az Amazon S3 hitelesítési adatok beállítása
