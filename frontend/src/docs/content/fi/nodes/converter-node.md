# Muunnin

**Muunnin**-solmu muuntaa tietoja ja tiedostoja eri muotojen välillä ilman koodaamista. Se on teknologianeutraali, joten uusia muotoja voidaan lisätä ajan myötä. Solmu muuntaa CSV-, JSON- ja XML-tietoja molempiin suuntiin, suorittaa Tesseract OCR -tekniikalla tekstin poimimista kuvista ja PDF-tiedostoista sekä tallentaa tiedoston uudessa muodossa.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.result` (jäsennetty data `csvToJson` / `xmlToJson` -muunnoksille, teksti `jsonToCsv` / `jsonToXml` -muunnoksille, poimittu teksti `imageToText` / `pdfToText` -muunnoksille, uuden tiedoston metatiedot `fileConvert` -muunnoksille) |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `conversion` | merkkijono | `csvToJson` (CSV-teksti → riviolioiden taulukko), `jsonToCsv` (olioiden/rivien taulukko → CSV-teksti), `xmlToJson` (XML-teksti → olio), `jsonToXml` (olio → XML-teksti), `imageToText` (OCR-kuvasta), `pdfToText` (OCR jokaiselta valitulta PDF-sivulta) tai `fileConvert` (tallentaa tiedoston uudessa muodossa) |
| `source` | lauseke | Muunnettava data. Jätä tyhjäksi käyttääksesi solmun ensimmäistä syötettä |
| `delimiter` | merkkijono | Yksittäinen merkkikenttäerotin (oletus `,`) |
| `hasHeader` | totuusarvo | Vain `csvToJson` — käsittele ensimmäinen rivi otsikkorivinä (oletus `true`) |
| `trimValues` | totuusarvo | Vain `csvToJson` — poista välilyönnit otsikoiden ja soluarvojen ympäriltä (oletus `true`) |
| `includeHeader` | totuusarvo | Vain `jsonToCsv` — kirjoita otsikkorivi (oletus `true`) |
| `converterColumns` | merkkijono | Vain `jsonToCsv` — valinnainen pilkulla erotettu sarakkeiden järjestys |
| `converterFileId` | lauseke | Tiedostomuunnokset — Heym Drive -tiedosto, jota luetaan, esim. `$Upload.file.id` |
| `converterTargetFormat` | merkkijono | Vain `fileConvert` — tulostusmuoto (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | merkkijono | Vain OCR — `auto` (oletus), Tesseract-koodi kuten `tur` tai `custom` |
| `ocrLanguageCustom` | merkkijono | Vain OCR — kielikoodit, kun `ocrLanguage` on `custom`, esim. `eng+tur` |
| `ocrEncoding` | merkkijono | Vain OCR — merkistö, johon teksti normalisoidaan (oletus `utf-8`) |
| `ocrNormalizeUnicode` | totuusarvo | Vain OCR — sovella NFC-normalisointia (oletus `true`) |
| `ocrPsm` | merkkijono | Vain OCR — Tesseractin sivunsegmentointitila (oletus `3`) |
| `ocrDpi` | numero | Vain `pdfToText` — sivun rasterointiDPI (oletus `300`) |
| `ocrPageRange` | lauseke | Vain `pdfToText` — `3` tai `2-5`. Tyhjä tarkoittaa kaikkia sivuja |

## Toiminta

- **`csvToJson`** jäsentää lähde-CSV-tekstin. Kun `hasHeader: true`, jokaisesta rivistä tulee olio, jonka avaimet ovat otsikkorivin arvot; kun `hasHeader: false`, jokaisesta rivistä tulee soluarvojen taulukko. Lainatut kentät, upotetut erottimet ja upotetut rivinvaihdot käsitellään RFC 4180 -standardin mukaisesti. UTF-8 BOM -etumerkki (yleinen Excel-viennissä) poistetaan, ja kaksoisotsikoiden nimet tehdään yksilöllisiksi ilman oikean sarakkeen ylikirjoittamista (`a, a, a_2` → `a`, `a_3`, `a_2`). Aseta `delimiter` arvoon `\t` jäsentääksesi tabulaattorilla erotettuja arvoja.
- **`trimValues`** (oletus `true`) poistaa ylimääräiset välilyönnit otsikoiden ja soluarvojen ympäriltä, **mukaan lukien lainattujen kenttien sisällä** (`" padded "` → `padded`). RFC 4180 käsittelee lainatut välilyönnit datana, joten aseta `trimValues: false` säilyttääksesi ne täsmällisesti.
- **`jsonToCsv`** muodostaa CSV-tekstin olioiden (tai taulukoiden) taulukosta. Sarakkeiden järjestys otetaan `converterColumns` -parametrista, jos se on annettu, muuten ensimmäisen olion avaimista. Arvot, jotka sisältävät erottimen, lainausmerkit tai rivinvaihtoja, lainataan automaattisesti.
- **`xmlToJson`** jäsentää XML:n olioksi. Attribuutit käyttävät `@`-etuliitettä ja attribuuttien seassa oleva teksti käyttää `#text`-merkintää; toistuvat sisaruuselementit muuttuvat taulukoiksi. XML-entiteettien laajennus on estetty.
- **`jsonToXml`** muuntaa olion XML-dokumentiksi. Olion täytyy sisältää täsmälleen yksi ylimmän tason avain, joka muodostaa XML-dokumentin juurielementin. Käytä samaa `@attribute`- ja `#text`-käytäntöä kuin `xmlToJson` -muunnoksessa tuottaaksesi attribuutteja ja tekstiä lastenelementtien rinnalla.
- **`imageToText`** suorittaa Tesseract OCR -tunnistuksen yhdelle kuvalle (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasteroi jokaisen valitun sivun `ocrDpi` -resoluutiolla ja tunnistaa sen. Jokainen sivu käy OCR-prosessin läpi, joten digitaalisen PDF:n täydellinen tekstikerros luetaan silti uudelleen pikseleistä. Tämä pitää skannattujen ja digitaalisten dokumenttien käyttäytymisen identtisenä hitauden kustannuksella, joten rajoita `ocrPageRange` pitkissä tiedostoissa.
- **`fileConvert`** kirjoittaa lähdetiedoston uudessa muodossa ja tallentaa tuloksen **uutena** Drive-tiedostona. Alkuperäistä ei koskaan muokata. Dokumentit käsitellään pandocin, kuvat Pillow-kirjaston ja JSON CSV:ksi Pythonin csv-kirjoittajan avulla. Kuvaa ei voi muuttaa dokumentiksi eikä dokumenttia kuvaksi; jos haluat poimia tekstin kuvasta, käytä `imageToText` -muunnosta.

## Tiedoston saaminen sisään

Tiedostomuunnokset lukevat Heym Drivesta, ei polusta tai URL-osoitteesta, joten tiedosto on tallennettava ensin. Kolme yleistä ketjua:

- **[Tiedoston lataustriggeri](./file-upload-trigger-node.md) → Muunnin** — osoita `converterFileId` arvoon `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Muunnin** — nouda etätiedosto Driveen ja välitä sitten `$Download.id`.
- **[Agentti](./agent-node.md) → Muunnin** — taitteella, joka kirjoittaa tiedoston, se näkyy muodossa `$reportAgent._generated_files[0].id`.

`converterFileId` hyväksyy myös kokonaisen tiedosto-olion (`$Upload.file`) tai Heym-latausosoitteen; tiedostotunnus poimitaan kummastakin. Tiedoston on oltava joko omistamasi tai jonka tiimikaveri on jakanut kanssasi.
## Kielet

`auto` (oletusarvo) suorittaa ensin Tesseractin kirjoitussuunnan- ja kirjaimistotunnistuksen ja valitsee sitten asennetuista malleista parhaan tunnistetulle kirjaimistolle. Kirjaimistomallit kuten `Latin` tai `Cyrillic` lukevat kaikki kyseisellä kirjaimistolla kirjoitetut kielet, minkä vuoksi `auto` käsittelee turkin- ja englanninkieliset laskut ilman erillistä kielivalintaa.

Kielen nimen määrittäminen on kuitenkin tarkempaa, kun se on tiedossa. Käytä yhtä koodia (`tur`) tai yhdistä useita `+`-merkillä (`eng+tur`) sekakielisille asiakirjoille – useammat kielet hidastavat ja hieman heikentävät tunnistusta, joten pidä lista lyhyenä. Koodit toimivat vain, kun vastaavat kielidatat on asennettu palvelimelle; solmu listaa saatavilla olevat kielet, jos valitset puuttuvan.

Jokainen Heym-kuva sisältää `osd`-mallin sekä englannin, turkin, saksan, ranskan, espanjan, italian, portugalin, hollannin, venäjän, arabian, yksinkertaistetun kiinan, japanin, korean sekä latinalaisen, kyrillisen, arabialaisen, HanS-, japanilaisen ja hangul-kirjaimistomallit.

## Merkistökoodaus

Tunnistettu teksti on UTF-8 -muodossa ja säilyttää kaikki Tesseractin tuottamat merkit. `ocrNormalizeUnicode` (oletuksena päällä) soveltaa NFC-normalisointia, jolloin esimerkiksi kirjain `s` ja yhdistävä sedilli muuttuvat yksittäiseksi `ş` -merkiksi – tämä kannattaa jättää päälle, koska muodot eivät ole vertailtavissa tai tietokantahaussa samanarvoisia.

`ocrEncoding` on merkityksellinen vain, jos jokin jälkikäsittelyjärjestelmä ei pysty tallentamaan koko Unicode-aluetta. Valitsemalla `cp1254` tai `iso-8859-9` turkkilainen teksti säilyy ehjänä, kun taas `latin-1` ja `ascii` ovat rajoittuneempia ja korvaavat käsittelemättömät merkit `?`-merkillä. Jätä arvoksi `utf-8`, ellei kohdejärjestelmä pakota muuhun.

## Tuloste

`csvToJson`, `jsonToCsv`, `xmlToJson` ja `jsonToXml` palauttavat `$label.result` ja `$label.conversion`. OCR-muunnokset lisäävät:

| Kenttä | Kuvaus |
|-------|-------------|
| `$label.result` | Koko tunnistettu teksti, sivut yhdistettynä tyhjällä rivillä |
| `$label.language` | Käytetty malli (hyödyllinen nähdä, mitä `auto` valitsi) |
| `$label.encoding` | Merkistö, johon teksti normalisoitiin |
| `$label.page_count` | Tunnistettujen sivujen määrä |
| `$label.pages` | Taulukko `{ page, text }` sivuittain käsittelyä varten |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` lähdetiedostosta |

`fileConvert` palauttaa uuden tiedoston:

| Kenttä | Kuvaus |
|-------|-------------|
| `$label.id` | Uuden tiedoston UUID |
| `$label.filename` | Muunnettu tiedostonimi, pääosa säilyy ja pääte vaihdetaan |
| `$label.mime_type` | Uuden tiedoston MIME-tyyppi |
| `$label.size_bytes` | Uuden tiedoston koko |
| `$label.download_url` | Drive-latausosoite uudelle tiedostolle |
| `$label.source_file` | Muunnetun tiedoston metatiedot |

## Esimerkki

```json
{
  "type": "converter",
  "data": {
    "label": "toRows",
    "conversion": "csvToJson",
    "source": "$userInput.body.text",
    "delimiter": ",",
    "hasHeader": true
  }
}
```

Syötteellä `name,age\nAda,36` jälkikäsittelysolmut saavat käyttöönsä jäsennetyt rivit `$toRows.result` -kautta (`[{ "name": "Ada", "age": "36" }]`).

XML:n muuntaminen JSONiksi:

```json
{
  "type": "converter",
  "data": {
    "label": "xmlToObject",
    "conversion": "xmlToJson",
    "source": "$webhook.body"
  }
}
```

Syötteellä `<person id="1"><name>Ada</name></person>` `$xmlToObject.result` on `{ "person": { "@id": "1", "name": "Ada" } }`. XML:n luomiseksi välitä kyseinen objekti toiselle Converter-solmulle, jossa on `conversion: "jsonToXml"`.

Skannatun laskun lukeminen tiedostonlähetystriggerin kautta:

```json
{
  "type": "converter",
  "data": {
    "label": "readInvoice",
    "conversion": "pdfToText",
    "converterFileId": "$Upload.file.id",
    "ocrLanguage": "tur",
    "ocrEncoding": "utf-8",
    "ocrDpi": 300,
    "ocrPageRange": "1-3"
  }
}
```

[Agentti](./agent-node.md)- tai [LLM](./llm-node.md)-solmu voi jälkikäsittelyssä poimia rakenteelliset kentät `$readInvoice.result` -arvosta.

Agentin markdown-raportin muuntaminen PDF:ksi:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

Jälkikäsittelysolmut lukevat `$convertDoc.download_url` -arvosta PDF:n jakamista varten tai `$convertDoc.id` -arvosta jatkaakseen työskentelyä sen kanssa [Drive](./drive-node.md) -solmussa.

## Vaatimukset

OCR käyttää `tesseract`- ja popplerin `pdftoppm` -ohjelmia, ja asiakirjojen muunnos perustuu pandociin. Kaikki kolme sisältyvät jokaiseen Heymin käyttöön, mukaan lukien `run.sh`, docker-compose ja yksittäinen julkaisukuva, joten mitään erillisiä asetuksia ei tarvita. Sivurajat, aikakatkaisut ja maksimi-DPI ovat kiinteitä alustan arvoja eivätkä asetuksia.

## Liittyvät solmut

- [Set](./set-node.md) – Muunna ja yhdistä yksittäisiä kenttiä
- [JSON output mapper](./json-output-mapper-node.md) – Rakenna JSON-vastausobjekti
- [File upload trigger](./file-upload-trigger-node.md) – Vastaanota tiedosto Heym Driveen
- [Drive](./drive-node.md) – Tallenna, nouda ja jaa tiedostoja
- [Node Types](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Expression DSL](../reference/expression-dsl.md) – Funktiot ja syntaksi
