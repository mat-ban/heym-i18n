# Amazon S3 Vozlišče

Vozlišče Amazon S3 bere in piše objekte v [Amazon S3](https://aws.amazon.com/s3/).

## Podprte operacije

- `Ustvari Bucket`: Ustvari bucket v regiji poverilnic.
- `Izbriši Bucket`: Izbriše prazen bucket.
- `Naštej Buckete`: Našteje buckete, vidne poverilnici.
- `Ustvari Mapo`: Ustvari prazno oznako mape (ključ z nič bajti, ki se konča z `/`).
- `Izbriši Mapo`: Izbriše vse objekte pod predpono mape (vključno z gnezdenimi ključi).
- `Pridobi Vse v Mapi`: Našteje vse metapodatke objektov pod predpono mape (stranitev na strežniku).
- `Naloži Objekt`: Zapiše besedilni payload v bucket/ključ.
- `Pridobi Objekt`: Prenese objekt in vrne bodisi dekodirano besedilo bodisi vsebino v base64.
- `Kopiraj Objekt`: Kopira objekt na drug ključ ali bucket.
- `Naštej Objekte`: Našteje metapodatke objektov pod predpono (ena stran, do 1000 ključev; podpira nadaljevalne tokene).
- `Izbriši Objekt`: Izbriše en sam objekt po ključu.

## Nastavitev poverilnic

Ustvarite poverilnico `Amazon S3` na zavihku Poverilnice z:

- ID ključa za dostop
- Tajni dostopni ključ
- Regija
- Neobvezni sejni žeton (za začasne AWS STS poverilnice)

## Pogosta polja

- `Bucket`: Ime ciljne mape (ciljni bucket za operacije kopiranja).
- `Object Key`: Potni ključ objekta, kot je `reports/daily.json`.
- `Folder Path`: Predpona za operacije z mapami (na primer `docs/archive`).
- `Source Bucket`: Neobvezni izvorni bucket za kopiranje; privzeto na ciljni bucket.
- `Source Object Key`: Izvorni ključ za operacije kopiranja.
- `Prefix`: Uporablja se pri operacijah na seznamu za omejevanje rezultatov.
- `Continuation Token`: Neobvezni žeton iz prejšnjega odgovora na seznam za pridobitev naslednje strani.
- `Max Keys`: Velikost strani za Naštej Objekte (1–1000).
- `Include Binary`: Ko je omogočeno pri Pridobi Objekt, vrne `body_base64` namesto `body_text`.
- `Body`: Besedilna vsebina za nalaganje.
- `Content Type`: Neobvezna MIME vrsta za naložene objekte.

## Primeri izhodov

### Ustvari Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Izbriši Bucket

- `${label}.success`
- `${label}.bucket`

### Naštej Buckete

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Ustvari Mapo

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Izbriši Mapo

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Pridobi Vse v Mapi

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Naloži Objekt

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Pridobi Objekt

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Kopiraj Objekt

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Naštej Objekte

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Izbriši Objekt

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Opombe

- `Naloži Objekt` trenutno nalaga UTF-8 besedilno vsebino.
- `Pridobi Objekt` lahko vrne base64 za binarne datoteke z omogočeno binarno možnostjo.
- `Ustvari Bucket` uporablja regijo poverilnic in zahteva `s3:CreateBucket`.
- `Izbriši Bucket` zahteva, da je bucket prazen in potrebuje `s3:DeleteBucket`.
- `Naštej Buckete` zahteva `s3:ListAllMyBuckets`.
- `Ustvari Mapo` naloži objekt oznake z nič bajti; S3 nima naravne vrste imenika.
- `Izbriši Mapo` odstrani vsak objekt, katerega ključ se začne s predpono mape; uporabljajte previdno.
- `Pridobi Vse v Mapi` samodejno paginira skozi predpono, dokler niso vrnjeni vsi objekti.
- `Naštej Objekte` vrne eno stran (do 1000 ključev). Ko je `truncated` resnično, prenesite `next_continuation_token` v polje Continuation Token naslednjega klica.
- `Kopiraj Objekt` zahteva `s3:GetObject` na izvoru in `s3:PutObject` na cilju.

## Sorodno

- [Vrste Vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Poverilnice](../reference/credentials.md) – Vrste in uporaba poverilnic
- [Integracije Tretjih Oseb](../reference/integrations.md) – Nastavitev poverilnic Amazon S3
