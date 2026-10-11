# Amazon S3 čvor

Amazon S3 čvor čita i zapisuje objekte u [Amazon S3](https://aws.amazon.com/s3/).

## Podržane operacije

- `Create Bucket`: Stvara bucket u regiji vjerodajnice.
- `Delete Bucket`: Briše prazan bucket.
- `List Buckets`: Prikazuje popis bucketa vidljivih vjerodajnici.
- `Create Folder`: Stvara prazan marker mape (ključ nulte veličine koji završava s `/`).
- `Delete Folder`: Briše sve objekte pod prefiksom mape (uključujući ugniježđene ključeve).
- `Get All in Folder`: Prikazuje popis metapodataka svih objekata pod prefiksom mape (paginacija na strani poslužitelja).
- `Upload Object`: Zapisuje tekstualni payload u bucket/ključ.
- `Get Object`: Preuzima objekt i vraća dekodirani tekst ili base64 sadržaj.
- `Copy Object`: Kopira objekt u drugi ključ ili bucket.
- `List Objects`: Prikazuje popis metapodataka objekata pod prefiksom (jedna stranica, do 1000 ključeva; podržava continuation tokene).
- `Delete Object`: Briše pojedinačni objekt prema ključu.

## Postavljanje vjerodajnica

Stvorite vjerodajnicu `Amazon S3` na kartici Vjerodajnice s parametrima:

- Access Key ID
- Secret Access Key
- Region
- Neobavezni Session Token (za privremene AWS STS vjerodajnice)

## Uobičajena polja

- `Bucket`: Naziv ciljnog bucketa (odredišni bucket za operacije kopiranja).
- `Object Key`: Ključ objekta u obliku putanje, primjerice `reports/daily.json`.
- `Folder Path`: Prefiks za operacije s mapama (na primjer `docs/archive`).
- `Source Bucket`: Neobavezni izvorni bucket za kopiranje; zadano je odredišni bucket.
- `Source Object Key`: Izvorni ključ za operacije kopiranja.
- `Prefix`: Koristi se u operacijama popisa za ograničavanje rezultata.
- `Continuation Token`: Neobavezni token iz prethodnog odgovora popisa za dohvaćanje sljedeće stranice.
- `Max Keys`: Veličina stranice za List Objects (1–1000).
- `Include Binary`: Kada je omogućeno na Get Object, vraća `body_base64` umjesto `body_text`.
- `Body`: Tekstualni sadržaj za upload.
- `Content Type`: Neobavezni MIME tip za uploadane objekte.

## Primjeri izlaza

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

## Napomene

- `Upload Object` trenutačno uploada UTF-8 tekstualni sadržaj.
- `Get Object` može vratiti base64 za binarne datoteke omogućavanjem binarne opcije.
- `Create Bucket` koristi regiju vjerodajnice i zahtijeva `s3:CreateBucket`.
- `Delete Bucket` zahtijeva da bucket bude prazan i potrebna je dozvola `s3:DeleteBucket`.
- `List Buckets` zahtijeva `s3:ListAllMyBuckets`.
- `Create Folder` uploada marker objekt nulte veličine; S3 nema nativni tip direktorija.
- `Delete Folder` uklanja svaki objekt čiji ključ započinje prefiksom mape; koristite s oprezom.
- `Get All in Folder` automatski paginira kroz prefiks dok se ne vrate svi objekti.
- `List Objects` vraća jednu stranicu (do 1000 ključeva). Kada je `truncated` istinit, proslijedite `next_continuation_token` u polje Continuation Token sljedećeg poziva.
- `Copy Object` zahtijeva `s3:GetObject` na izvoru i `s3:PutObject` na odredištu.

## Povezano

- [Vrste čvorova](../reference/node-types.md) – Pregled svih vrsta čvorova
- [Vjerodajnice](../reference/credentials.md) – Vrste vjerodajnica i njihova upotreba
- [Integracije trećih strana](../reference/integrations.md) – Postavljanje vjerodajnica za Amazon S3
