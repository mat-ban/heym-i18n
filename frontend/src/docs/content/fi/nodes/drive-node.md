# Drive-solmu

**Drive**-solmu hallinnoi workflowissa taitojen luomia tiedostoja suoraan workflown sisällä. Sillä voi hakea tiedostoja, ladata tiedostoja ulkoisista URL-osoitteista, poistaa niitä, jakaa tai poistaa jakamista tiimien kanssa tai päivittää niiden käyttörajoituksia (salasana, vanhentuminen, latausraja) ohjelmallisesti.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (vaihtelee operaation mukaan) |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `driveOperation` | merkkijono | Operaatio: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | lauseke / valinta | Hallinnoidun Drive-tiedoston UUID (kaikki operaatiot paitsi `getAll`, `downloadUrl` ja `save`) |
| `driveLimit` | numero | Palautettavien tiedostojen enimmäismäärä (`getAll` vain; tyhjä tarkoittaa ei rajaa) |
| `driveSourceUrl` | lauseke | URL-osoite, josta tiedosto haetaan ja tallennetaan Driveen (`downloadUrl` vain) |
| `driveFilename` | lauseke | Tiedostonimi kokonaisuudessaan, mukaan lukien tiedostopääte (`save` vain, esim. `1.mp3`) |
| `driveBase64Content` | lauseke | Raaka base64-merkkijono tai data-URL, joka dekoodataan ja tallennetaan (`save` vain) |
| `driveIncludeBinary` | totuusarvo | Sisällytä tiedoston sisältö base64-muodossa tulosteeseen (`get` vain) |
| `drivePassword` | lauseke | Asetettava salasana käyttöoikeustunnukselle (`setPassword` vain) |
| `driveTtlHours` | numero | Tuntien määrä, jonka jälkeen latauslinkki vanhenee (`setTtl` vain) |
| `driveMaxDownloads` | numero | Sallittujen latausten enimmäismäärä (`setMaxDownloads` vain) |

## Tiedostotunnuksen hankkiminen

Kun taito luo tiedostoja, tuloste sisältää `_generated_files` -taulukon. Jokainen alkio sisältää `id` -kentän:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

Viittaa tiedostotunnukseen seuraavasti: `$agentLabel._generated_files[0].id`

## Operaatiot

| Operaatio | Pakolliset kentät | Kuvaus |
|-----------|----------------|-------------|
| `get` | driveFileId | Hae tiedoston metatiedot (ja mahdollisesti binäärisisältö) Drivesta |
| `getAll` | ei mitään | Listaa omistamasi ja tiimien kanssa jaetut luettavat Drive-tiedostot metatietoineen, kuten tiedostonimi, MIME-tyyppi, koko, lähde ja lataus-URL |
| `downloadUrl` | driveSourceUrl | Hae tiedosto ulkoisesta URL-osoitteesta ja tallenna se Driveen |
| `save` | driveFilename, driveBase64Content | Dekoodaa base64-sisällön ja tallenna se Drive-tiedostoksi |
| `delete` | driveFileId | Poista tiedosto ja kaikki sen käyttöoikeustunnukset levyltä ja tietokannasta |
| `setPassword` | driveFileId, drivePassword | Korvaa oletuskäyttöoikeustunnus salasanasuojatulla tunnuksella |
| `setTtl` | driveFileId, driveTtlHours | Korvaa oletuskäyttöoikeustunnus tunnuksella, joka vanhenee N tunnin kuluttua |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Korvaa oletuskäyttöoikeustunnus tunnuksella, joka on rajoitettu N lataukseen |
| `shareWithMyTeams` | driveFileId | Jaa tiedosto vain-luku -oikeudella kaikkien workflown omistajan nykyisten tiimien kanssa |
| `unshareWithMyTeams` | driveFileId | Poista kaikki tiimijako-oikeudet tiedostosta |

> **Huomio:** `set*`-operaatiot poistavat oletusarvoisen (ei-rajoitteisen) julkisen tunnuksen ja luovat uuden määritellyn rajoitteen kanssa. Päivitetty `download_url` sisältyy tulosteeseen.
> **Tiimijako:** `shareWithMyTeams` luo nimenomaiset jako-oikeudet omistajan nykyisille tiimeille. Tulevia tiimejä ei lisätä automaattisesti, ellei operaatiota suoriteta uudelleen. `unshareWithMyTeams` poistaa kaikki tiimijako-oikeudet tiedostosta.

## Esimerkki — Tiedoston lataaminen URL-osoitteesta

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

Viittaa tallennettuun tiedostoon myöhemmissä vaiheissa: `$fetchReport.id`, `$fetchReport.download_url`

Tiedostonimi otetaan vastauksen `Content-Disposition` -otsakkeesta; jos sitä ei ole, se johdetaan URL-osoitteen polusta.

## Esimerkki — Base64-syötteen tallentaminen Driveen

Käytä tätä, kun tekstisyötesolmu (tai mikä tahansa edeltävä solmu) tarjoaa base64-muotoista tiedostosisältöä:

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

Viittaa tallennettuun tiedostoon myöhemmissä vaiheissa: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` hyväksyy raakan base64-merkkijonon tai `data:...;base64,...` -muotoisen data-URL-osoitteen. MIME-tyyppi päätellään tiedostonimen päätteestä.

## Esimerkki — Tiedoston haku ja binäärisisällön käyttö Vision LLM:ssä

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

Viittaa base64-sisältöön myöhemmissä vaiheissa: `$fetchImage.file_base64`

`file_base64` -kautta palautetut kuvat näytetään inline-muodossa debug-paneelissa workflown suorituksen yhteydessä.

## Esimerkki — Drive-tiedostojen listaaminen

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

Viittaa ensimmäiseen palautettuun tiedostoon myöhemmissä vaiheissa: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Esimerkki — Poista tiedosto käsittelyn jälkeen

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Esimerkki — Aseta salasana luodulle tiedostolle

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## Esimerkki — Aseta vanhentumisaika (TTL)

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## Esimerkki — Rajoita latauksia

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## Esimerkki — Jaa tiimien kanssa

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

Tiimin jäsenet voivat tarkastella ja ladata tiedoston Drivesta sekä käyttää lukuoperaatioita workfloweissa. He eivät voi poistaa, uudelleenjakaa tai muuttaa julkisten linkkien rajoituksia.

## Esimerkki — Peruuta jako tiimeiltä

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Tiedoston muuntaminen

Muunnos siirretty [Converter](./converter-node.md)-solmuun. Tallenna tai hae tiedosto Drivella ja välitä sen tunniste muuntosolmuun:

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

Alkuperäinen tiedosto säilyy ja muunnettu tiedosto tallennetaan uutena Drive-tiedostona.

## Tulostiedot

**get:**
- `$nodeLabel.id` — Tiedoston UUID
- `$nodeLabel.filename` — Tiedostonimi
- `$nodeLabel.mime_type` — MIME-tyyppi (esim. `image/png`)
- `$nodeLabel.size_bytes` — Tiedostokoko tavuina
- `$nodeLabel.download_url` — Julkinen latausosoite
- `$nodeLabel.file_base64` — Base64-koodattu tiedostosisältö (vain kun **Sisällytä binäärisisältö** on käytössä)

**getAll:**
- `$nodeLabel.files` — Taulukko tiedostometatiedoista
- `$nodeLabel.count` — Palautettujen tiedostojen määrä
- `$nodeLabel.files[0].id` — Tiedoston UUID
- `$nodeLabel.files[0].filename` — Tiedostonimi
- `$nodeLabel.files[0].mime_type` — MIME-tyyppi
- `$nodeLabel.files[0].size_bytes` — Tiedostokoko tavuina
- `$nodeLabel.files[0].download_url` — Julkinen latausosoite, kun julkinen tunniste on olemassa
- `$nodeLabel.files[0].metadata` — Tallennettu metatieto-objekti
- `$nodeLabel.files[0].created_at` — Tiedoston luontiaikaleima

**downloadUrl:**
- `$nodeLabel.id` — Uuden tallennetun tiedoston UUID
- `$nodeLabel.filename` — Tiedostonimi (haettu `Content-Disposition`-otsakkeesta tai URL-polusta)
- `$nodeLabel.mime_type` — Vastauksesta tai tiedostopäätteestä havaittu MIME-tyyppi
- `$nodeLabel.size_bytes` — Tiedostokoko tavuina
- `$nodeLabel.download_url` — Tallennetun tiedoston latausosoite Drivessa

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — Poistetun tiedoston UUID

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — Tiedoston UUID
- `$nodeLabel.download_url` — Uusi pääsyosoite, johon rajoitus on sovellettu

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — Tiedoston UUID
- `$nodeLabel.shared_team_count` — Tiimijaosten määrä operaation jälkeen

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — Tiedoston UUID
- `$nodeLabel.shared_team_count` — `0` operaation jälkeen

## Omistajuus

Vain omistajalle suunnatut operaatiot edellyttävät, että tiedosto kuuluu workflown omistajalle. Lukuoperaatiot (`get`, `getAll`) voivat käyttää myös tiimin kautta workflown omistajalle jaettuja tiedostoja.

## Liittyvät

- [Tiedostojen luonti](../reference/file-generation.md) - Kuinka taidot luovat tiedostoja ja `_generated_files`-tuloste
- [Drive-välilehti](../reference/drive.md) - Visuaalinen tiedostojen hallinta kojelaudassa
- [Agent-solmu](./agent-node.md) - Suorittaa tiedostoja luovia taitoja
- [Muuntosolmu](./converter-node.md) - Muunna tallennettu tiedosto toiseen muotoon tai OCR-tekstiksi
- [Lauseke-DSL](../reference/expression-dsl.md) - Dynaamisten arvojen lausekesyntaksi
