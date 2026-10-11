# Amazon S3 sõlm

Amazon S3 sõlm loeb ja kirjutab objekte [Amazon S3-s](https://aws.amazon.com/s3/).

## Toetatud toimingud

- `Create Bucket`: Loob ämbri mandaadi regioonis.
- `Delete Bucket`: Kustutab tühja ämbri.
- `List Buckets`: Loetleb mandaadile nähtavad ämbrid.
- `Create Folder`: Loob tühja kausta markeri (nullbaidine võti, mis lõpeb `/`-ga).
- `Delete Folder`: Kustutab kõik objektid kausta prefiksi all (sealhulgas pesastatud võtmed).
- `Get All in Folder`: Loetleb kõik objektide metaandmed kausta prefiksi all (serveripoolne lehekülgedeks jagamine).
- `Upload Object`: Kirjutab tekstilise payload'i ämbrisse/võtmesse.
- `Get Object`: Laadib objekti alla ja tagastab kas dekodeeritud teksti või base64 sisu.
- `Copy Object`: Kopeerib objekti teise võtmesse või ämbrisse.
- `List Objects`: Loetleb objektide metaandmed prefiksi all (üks lehekülg, kuni 1000 võtit; toetab jätkamise tokeneid).
- `Delete Object`: Kustutab üksiku objekti võtme järgi.

## Mandaadi seadistamine

Looge vahekaardil Mandaadid `Amazon S3` mandaat järgmiste andmetega:

- Access Key ID
- Secret Access Key
- Region
- Valikuline Session Token (ajutiste AWS STS mandaatide jaoks)

## Ühised väljad

- `Bucket`: Sihtämri nimi (sihtämber kopeerimistoimingute jaoks).
- `Object Key`: Tee-laadne objekti võti, näiteks `reports/daily.json`.
- `Folder Path`: Kausta toimingute prefiks (näiteks `docs/archive`).
- `Source Bucket`: Valikuline lähteämber kopeerimiseks; vaikimisi sihtämber.
- `Source Object Key`: Lähtevõti kopeerimistoimingute jaoks.
- `Prefix`: Kasutatakse loetlemistoimingutes tulemuste piiramiseks.
- `Continuation Token`: Valikuline token eelmisest loetlemisvastusest järgmise lehekülje toomiseks.
- `Max Keys`: Lehekülje suurus toimingu List Objects jaoks (1–1000).
- `Include Binary`: Kui on lubatud toimingul Get Object, tagastab `body_base64` `body_text` asemel.
- `Body`: Üleslaaditav tekstisisu.
- `Content Type`: Valikuline MIME-tüüp üleslaaditavate objektide jaoks.

## Väljundi näited

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

## Märkused

- `Upload Object` laadib praegu üles UTF-8 tekstisisu.
- `Get Object` saab binaarfailide jaoks tagastada base64, lubades binaarse valiku.
- `Create Bucket` kasutab mandaadi regiooni ja nõuab õigust `s3:CreateBucket`.
- `Delete Bucket` nõuab, et ämber oleks tühi, ja õigust `s3:DeleteBucket`.
- `List Buckets` nõuab õigust `s3:ListAllMyBuckets`.
- `Create Folder` laadib üles nullbaidise marker-objekti; S3-l puudub natiivne kataloogitüüp.
- `Delete Folder` eemaldab iga objekti, mille võti algab kausta prefiksiga; kasutage ettevaatlikult.
- `Get All in Folder` jagab automaatselt lehekülgedeks läbi prefiksi, kuni kõik objektid on tagastatud.
- `List Objects` tagastab ühe lehekülje (kuni 1000 võtit). Kui `truncated` on tõene, edastage `next_continuation_token` järgmise kutse väljale Continuation Token.
- `Copy Object` nõuab õigust `s3:GetObject` lähtel ja `s3:PutObject` sihtkohal.

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist sõlmetüüpidest
- [Credentials](../reference/credentials.md) – Mandaadi tüübid ja kasutamine
- [Third-Party Integrations](../reference/integrations.md) – Amazon S3 mandaadi seadistamine
