# Uzel Amazon S3

Uzel Amazon S3 čte a zapisuje objekty v [Amazon S3](https://aws.amazon.com/s3/).

## Podporované operace

- `Create Bucket`: Vytvoří bucket v regionu přihlašovacích údajů.
- `Delete Bucket`: Odstraní prázdný bucket.
- `List Buckets`: Vypíše buckety viditelné pro přihlašovací údaje.
- `Create Folder`: Vytvoří prázdný marker složky (klíč o nulové velikosti končící `/`).
- `Delete Folder`: Odstraní všechny objekty pod prefixem složky (včetně vnořených klíčů).
- `Get All in Folder`: Vypíše metadata všech objektů pod prefixem složky (stránkování na straně serveru).
- `Upload Object`: Zapíše textový payload do bucketu/klíče.
- `Get Object`: Stáhne objekt a vrátí buď dekódovaný text, nebo obsah ve formátu base64.
- `Copy Object`: Zkopíruje objekt do jiného klíče nebo bucketu.
- `List Objects`: Vypíše metadata objektů pod prefixem (jedna stránka, až 1000 klíčů; podporuje continuation tokeny).
- `Delete Object`: Odstraní jeden objekt podle klíče.

## Nastavení přihlašovacích údajů

V záložce Přihlašovací údaje vytvořte přihlašovací údaje typu `Amazon S3` s těmito hodnotami:

- Access Key ID
- Secret Access Key
- Region
- Volitelný Session Token (pro dočasné přihlašovací údaje AWS STS)

## Společná pole

- `Bucket`: Název cílového bucketu (cílový bucket pro operace kopírování).
- `Object Key`: Klíč objektu ve formátu cesty, například `reports/daily.json`.
- `Folder Path`: Prefix pro operace se složkami (například `docs/archive`).
- `Source Bucket`: Volitelný zdrojový bucket pro kopírování; výchozí je cílový bucket.
- `Source Object Key`: Zdrojový klíč pro operace kopírování.
- `Prefix`: Používá se u operací výpisu k omezení výsledků.
- `Continuation Token`: Volitelný token z předchozí odpovědi výpisu pro načtení další stránky.
- `Max Keys`: Velikost stránky pro List Objects (1–1000).
- `Include Binary`: Je-li povoleno u Get Object, vrátí `body_base64` místo `body_text`.
- `Body`: Textový obsah k nahrání.
- `Content Type`: Volitelný MIME typ pro nahrané objekty.

## Příklady výstupů

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

- `Upload Object` v současnosti nahrává textový obsah ve formátu UTF-8.
- `Get Object` může vrátit base64 pro binární soubory, pokud povolíte binární volbu.
- `Create Bucket` používá region přihlašovacích údajů a vyžaduje oprávnění `s3:CreateBucket`.
- `Delete Bucket` vyžaduje, aby byl bucket prázdný, a potřebuje oprávnění `s3:DeleteBucket`.
- `List Buckets` vyžaduje oprávnění `s3:ListAllMyBuckets`.
- `Create Folder` nahraje marker objekt o nulové velikosti; S3 nemá nativní typ adresáře.
- `Delete Folder` odstraní každý objekt, jehož klíč začíná prefixem složky; používejte opatrně.
- `Get All in Folder` automaticky stránkuje přes prefix, dokud nejsou vráceny všechny objekty.
- `List Objects` vrací jednu stránku (až 1000 klíčů). Je-li `truncated` true, předejte `next_continuation_token` do pole Continuation Token v dalším volání.
- `Copy Object` vyžaduje oprávnění `s3:GetObject` na zdroji a `s3:PutObject` na cíli.

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Credentials](../reference/credentials.md) – Typy přihlašovacích údajů a jejich použití
- [Third-Party Integrations](../reference/integrations.md) – Nastavení přihlašovacích údajů Amazon S3
