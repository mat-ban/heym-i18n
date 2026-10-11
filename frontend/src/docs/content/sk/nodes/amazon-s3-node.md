# Uzol Amazon S3

Uzol Amazon S3 číta a zapisuje objekty v [Amazon S3](https://aws.amazon.com/s3/).

## Podporované operácie

- `Create Bucket`: Vytvorí bucket v regióne prihlasovacích údajov.
- `Delete Bucket`: Odstráni prázdny bucket.
- `List Buckets`: Zobrazí zoznam bucketov viditeľných pre prihlasovacie údaje.
- `Create Folder`: Vytvorí prázdny marker priečinka (kľúč s nulovou veľkosťou končiaci na `/`).
- `Delete Folder`: Odstráni všetky objekty pod prefixom priečinka (vrátane vnorených kľúčov).
- `Get All in Folder`: Zobrazí zoznam metadát všetkých objektov pod prefixom priečinka (stránkovanie na strane servera).
- `Upload Object`: Zapíše textový payload do bucketu/kľúča.
- `Get Object`: Stiahne objekt a vráti buď dekódovaný text, alebo obsah vo formáte base64.
- `Copy Object`: Skopíruje objekt do iného kľúča alebo bucketu.
- `List Objects`: Zobrazí zoznam metadát objektov pod prefixom (jedna stránka, až 1000 kľúčov; podporuje continuation tokeny).
- `Delete Object`: Odstráni jeden objekt podľa kľúča.

## Nastavenie prihlasovacích údajov

V karte Prihlasovacie údaje vytvorte prihlasovacie údaje typu `Amazon S3` s týmito hodnotami:

- Access Key ID
- Secret Access Key
- Region
- Voliteľný Session Token (pre dočasné AWS STS prihlasovacie údaje)

## Spoločné polia

- `Bucket`: Názov cieľového bucketu (cieľový bucket pre operácie kopírovania).
- `Object Key`: Kľúč objektu v tvare cesty, napríklad `reports/daily.json`.
- `Folder Path`: Prefix pre operácie s priečinkami (napríklad `docs/archive`).
- `Source Bucket`: Voliteľný zdrojový bucket pre kopírovanie; predvolene cieľový bucket.
- `Source Object Key`: Zdrojový kľúč pre operácie kopírovania.
- `Prefix`: Používa sa pri operáciách výpisu na obmedzenie výsledkov.
- `Continuation Token`: Voliteľný token z predchádzajúcej odpovede výpisu na získanie ďalšej stránky.
- `Max Keys`: Veľkosť stránky pre List Objects (1–1000).
- `Include Binary`: Ak je povolené pri Get Object, vráti `body_base64` namiesto `body_text`.
- `Body`: Textový obsah na nahranie.
- `Content Type`: Voliteľný MIME typ pre nahrávané objekty.

## Príklady výstupov

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

## Poznámky

- `Upload Object` v súčasnosti nahráva textový obsah vo formáte UTF-8.
- `Get Object` môže vrátiť base64 pre binárne súbory povolením binárnej možnosti.
- `Create Bucket` používa región prihlasovacích údajov a vyžaduje `s3:CreateBucket`.
- `Delete Bucket` vyžaduje, aby bol bucket prázdny, a potrebuje `s3:DeleteBucket`.
- `List Buckets` vyžaduje `s3:ListAllMyBuckets`.
- `Create Folder` nahráva marker objekt s nulovou veľkosťou; S3 nemá natívny typ adresára.
- `Delete Folder` odstráni každý objekt, ktorého kľúč začína prefixom priečinka; používajte opatrne.
- `Get All in Folder` automaticky stránkuje cez prefix, kým sa nevrátia všetky objekty.
- `List Objects` vráti jednu stránku (až 1000 kľúčov). Ak je `truncated` true, odovzdajte `next_continuation_token` do poľa Continuation Token pri ďalšom volaní.
- `Copy Object` vyžaduje `s3:GetObject` na zdroji a `s3:PutObject` na cieli.

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Prihlasovacie údaje](../reference/credentials.md) – Typy prihlasovacích údajov a ich použitie
- [Integrácie tretích strán](../reference/integrations.md) – Nastavenie prihlasovacích údajov Amazon S3
