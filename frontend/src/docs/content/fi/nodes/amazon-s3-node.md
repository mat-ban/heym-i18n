# Amazon S3 -solmu

Amazon S3 -solmu lukee ja kirjoittaa objekteja [Amazon S3](https://aws.amazon.com/s3/) -palveluun.

## Tuetut toiminnot

- `Create Bucket`: Luo kauhan (bucket) tunnistetietojen alueella.
- `Delete Bucket`: Poistaa tyhjän kauhan.
- `List Buckets`: Listaa tunnistetiedoille näkyvät kauhat.
- `Create Folder`: Luo tyhjän kansion merkitsimen (nollatavuinen avain, joka päättyy `/`-merkkiin).
- `Delete Folder`: Poistaa kaikki objektit kansion etuliitteen alla (mukaan lukien sisäkkäiset avaimet).
- `Get All in Folder`: Listaa kaikkien objektien metatiedot kansion etuliitteen alla (palvelimella toteutettu sivutus).
- `Upload Object`: Kirjoittaa tekstisisällön kauhaan/avaimelle.
- `Get Object`: Lataa objektin ja palauttaa joko dekoodatun tekstin tai base64-sisällön.
- `Copy Object`: Kopioi objektin toiseen avaimeen tai kauhaan.
- `List Objects`: Listaa objektien metatiedot etuliitteen alla (yksi sivu, enintään 1000 avainta; tukee jatkotunnisteita).
- `Delete Object`: Poistaa yksittäisen objektin avaimen perusteella.

## Tunnistetietojen määrittäminen

Luo `Amazon S3`-tunnistetiedot Tunnistetiedot-välilehdessä seuraavilla tiedoilla:

- Access Key ID
- Secret Access Key
- Region
- Valinnainen Session Token (väliaikaisille AWS STS -tunnistetiedoille)

## Yleiset kentät

- `Bucket`: Kohdekauhan nimi (kopiointitoimintojen kohdekauha).
- `Object Key`: Polkumainen objektiavain, esim. `reports/daily.json`.
- `Folder Path`: Etuliite kansiotoiminnoille (esim. `docs/archive`).
- `Source Bucket`: Valinnainen lähdekauha kopiointia varten; oletuksena kohdekauha.
- `Source Object Key`: Lähdeavain kopiointitoiminnoille.
- `Prefix`: Listaustojen rajaamiseen käytettävä etuliite.
- `Continuation Token`: Valinnainen tunniste edellisestä listausvastauksesta seuraavan sivun hakemiseksi.
- `Max Keys`: List Objects -toiminnon sivukoko (1–1000).
- `Include Binary`: Kun käytössä Get Object -toiminnossa, palauttaa `body_base64` -arvon `body_text` -arvon sijaan.
- `Body`: Ladattava tekstisisältö.
- `Content Type`: Valinnainen MIME-tyyppi ladatuille objekteille.

## Tulosesimerkkejä

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

## Huomioita

- `Upload Object` lähettää tällä hetkellä UTF-8 -tekstisisältöä.
- `Get Object` voi palauttaa base64-muotoisen sisällön binääritiedostoille binääriasetuksen ollessa käytössä.
- `Create Bucket` käyttää tunnistetietojen aluetta ja vaatii `s3:CreateBucket` -oikeuden.
- `Delete Bucket` edellyttää kauhan olevan tyhjän ja vaatii `s3:DeleteBucket` -oikeuden.
- `List Buckets` vaatii `s3:ListAllMyBuckets` -oikeuden.
- `Create Folder` lähettää nollatavuisen merkitsinobjektin; S3:ssa ei ole natiivia hakemistotyyppiä.
- `Delete Folder` poistaa jokaisen objektin, jonka avain alkaa kansioetuliitteellä; käytä varoen.
- `Get All in Folder` sivutusautomaattisesti etuliitteen läpi, kunnes kaikki objektit on palautettu.
- `List Objects` palauttaa yhden sivun (enintään 1000 avainta). Kun `truncated` on tosi, välitä `next_continuation_token` seuraavan kutsun Continuation Token -kenttään.
- `Copy Object` vaatii `s3:GetObject` -oikeuden lähteelle ja `s3:PutObject` -oikeuden kohteelle.

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Tunnistetiedot](../reference/credentials.md) – Tunnistetietotyypit ja käyttö
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Amazon S3 -tunnistetietojen määrittäminen
