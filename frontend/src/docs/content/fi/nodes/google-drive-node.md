# Google Drive

**Google Drive** -solmu listaa, lataa, päivittää ja poistaa tiedostoja sekä kansioita Google Drivessa OAuth2-autentikoinnin avulla. Se pystyy myös kopioimaan Drive-tiedoston suoraan [Heym Driveen](./drive-node.md) yhdellä operaatiolla.

> **Tämä ei ole [Drive](./drive-node.md) -solmu.** Kyseinen solmu on *Heym Drive* – Heymin oma sisäinen tiedostovarasto. Tämä solmu kommunikoi Google Driven kanssa. `syncToHeymDrive` -operaatio toimii siltana näiden kahden välillä.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | Google Drive (OAuth2) |
| Tulos | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | Google Drive -tunnistetiedot [Tunnistetiedoista](../tabs/credentials-tab.md) |
| `gdOperation` | merkkijono | Operaatiot: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | lauseke | Kansion ID tai täydellinen Drive-kansion URL. Käytetään `listFolderFiles`- ja `removeFolder`-operaatioissa. Tyhjä tarkoittaa Drivin juurikansiota. |
| `gdFileId` | lauseke | Tiedoston ID tai täydellinen Drive/Docs-URL. Käytetään `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile` -operaatioissa. |
| `gdMaxResults` | lauseke | `listFolderFiles` -operaatiossa: palautettavien tiedostojen enimmäismäärä (oletus 100). Tyhjä tai `0` lataa koko kansion sivutusjärjestelmällä. Jokainen listattu tiedosto sisältää `size_bytes` -kentän, kun Drive raportoi koon. |
| `gdQuery` | lauseke | `listFolderFiles` -operaatiossa: lisäsuodatin AND-ehtona, esim. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | totuusarvo | `listFolderFiles` -operaatiossa: sisällytä roskakoriin siirretyt tiedostot. Oletusarvo false. |
| `gdExportFormat` | merkkijono | `downloadFile` / `syncToHeymDrive` -operaatioissa: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Tyhjä tarkoittaa automaattista valintaa. Ei vaikuta tavallisiin tiedostoihin. |
| `gdFilename` | lauseke | `syncToHeymDrive` -operaatiossa: ohita Heym Drivessä tallennettava tiedostonimi. |
| `gdBase64Content` | lauseke | `updateFile` -operaatiossa: base64-merkkijono tai `data:` -URL, joka korvaa tiedoston sisällön. |
| `gdNewName` | lauseke | `updateFile` -operaatiossa: uusi tiedostonimi (nimeäminen uudelleen). |
| `gdNewParentId` | lauseke | `updateFile` -operaatiossa: kohdekansion ID tai URL (siirto). |
| `gdPermanentDelete` | totuusarvo | `removeFile` / `removeFolder` -operaatioissa: kun false (oletus), kohde siirretään roskakoriin ja on palautettavissa; kun true, kohde tuhotaan pysyvästi. |

## Tiedostojen ja kansioiden ID:t

`gdFileId`, `gdFolderId` ja `gdNewParentId` hyväksyvät joko **pelkän ID:n** tai **täydellisen URL-osoitteen** – Heym erottaa ID:n automaattisesti. Kaikki seuraavat muodot toimivat:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets ja Slides

Google-alustaisilla dokumenteilla **ei ole ladattavaa binaaridataa**. Ne ovat tietueita Googlen palvelimilla, eivät tiedostoja – Drive API palauttaa virheen `403 Only files with binary content can be downloaded`, jos pyydetään niiden raakasisältöä.

`downloadFile` ja `syncToHeymDrive` tunnistavat nämä automaattisesti ja **vientivaihtoehto** aktivoituu, joten operaatiot eivät epäonnistu Google Doc -kohteiden vuoksi:

| Lähde | Oletusvienti |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Muut Google-alustaiset tyypit | PDF |

Aseta **Viennin muoto** ohittaaksesi kohdemuodon. Asetusta ei huomioida tavallisissa tiedostoissa, jotka ladataan aina sellaisenaan.

## Operaatiot

| Operaatiot | Pakollinen | Kuvaus |
|-----------|----------|-------------|
| `listFolderFiles` | – (tyhjä kansio = juuri) | Listaa tiedostot kansiossa valinnaisella suodattimella |
| `downloadFile` | `gdFileId` | Lataa tiedoston sisältö base64-muodossa, muuntaen alkuperäiset dokumentit automaattisesti |
| `syncToHeymDrive` | `gdFileId` | Lataa Google Drivestä ja tallentaa tuloksen Heym Driveen |
| `updateFile` | `gdFileId` + vähintään yksi seuraavista: sisältö / nimi / kohdekansio | Päivitä sisältö, nimeä uudelleen ja/tai siirrä |
| `removeFile` | `gdFileId` | Siirrä roskakoriin (oletus) tai poista tiedosto pysyvästi |
| `removeFolder` | `gdFolderId` | Siirrä roskakoriin (oletus) tai poista kansio ja sen sisältö pysyvästi |

### Poistot ovat oletuksena palautettavissa

`removeFile` ja `removeFolder` siirtävät kohteen **Google Driven roskakoriin**, josta se voidaan palauttaa. Tämä on turvallinen oletus toiminnolle, joka voi suorittua aikataulun mukaisesti tai [Loop](./loop-node.md) -solmun sisällä.

**Poista pysyvästi** -asetuksen käyttöönotto tuhoaa kohteen palauttamattomasti. `removeFolder` -operaatiossa tuhoutuu myös kansion kaikki sisältö.

Solmu myös tarkistaa kohteen tyypin: `removeFile` kieltäytyy kansioista ja `removeFolder` kieltäytyy tiedostoista, joten väärin kirjoitettu ID ei voi hiljaisesti poistaa väärää kohdetta.

### updateFile jättää tyhjät kentät koskemattomiksi

`updateFile` on päivitys, ei korvaus. Täytä mikä tahansa yhdistelmä sisällöstä, uudesta nimestä ja kohdekansiosta – kaikki tyhjäksi jätetyt kentät säilyvät ennallaan. Vähintään yksi kolmesta on pakollinen.
## Tunnistetiedot

Google Drive käyttää **OAuth2 "Bring Your Own App"** -mallia. Käyttäjän on tarjottava omat Google Cloud OAuth2 -tunnistetiedot.

> **Tämä tunnistetieto myöntää täydet käyttöoikeudet Driveen.** Heym pyytää `https://www.googleapis.com/auth/drive` -käyttöalueen, koska solmu toimii käyttäjän omistamissa tiedostoissa. Kapeampi `drive.file` -käyttöalue näkee vain sovelluksen itsensä luomat tiedostot, mikä tekisi käyttäjän olemassa olevien tiedostojen listauksen, päivityksen ja poistamisen mahdottomaksi. Katso [Tunnistetietojen jakaminen](../reference/credentials-sharing.md) ennen tämän tunnistetiedon jakamista tiimin kanssa.

**Taustajärjestelmän määritys:** Aseta **`FRONTEND_URL`** Heymin taustajärjestelmään sovelluksen julkiseksi URL-osoitteeksi. OAuth-uudelleenohjausosoite on aina `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — se johdetaan vain tästä asetuksesta, ei pyyntöotsikoista.

1. Siirry [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → ota käyttöön **Google Drive API**.
2. Siirry **Credentials** → **Create Credentials** → **OAuth client ID** → valitse **Web application**.
3. Lisää **Authorized redirect URIs** -kohdalle tarkalleen `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Kopioi **Client ID** ja **Client Secret**.
5. Heymissä: **Dashboard → Credentials → New → Google Drive (OAuth2)**, liitä molemmat arvot, napsauta **Connect** ja hyväksy pääsyoikeus ponnahdusikkunassa.

## Tuloste

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

`size_bytes` on `null` kansioille ja Googlen alkuperäisille tiedostoille, jotka eivät ilmoita kokoa.

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

Tavalliselle tiedostolle `exported` on `false` ja `export_format` on `null`.

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id` on uuden **Heym Drive** -tiedoston ID, erillinen `google_file_id`:stä.

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted` on `"trashed"` tai `"permanent"`.

## Esimerkki: varmuuskopioi Drive-kansio Heym Driveen

1. **[Cron](./cron-node.md)** — suorita päivittäin.
2. **Google Drive** — `listFolderFiles` lähdekansiossa, aseta `gdQuery` arvoon `mimeType='application/pdf'`, jos haluat vain PDF-tiedostoja.
3. **[Loop](./loop-node.md)** — iteroi `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` asetuksella `gdFileId` arvoon `$BackupLoop.item.id` ja `gdFilename` arvoon `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — lähetä yhteenveto varmuuskopioiduista tiedostoista.

## Huomioita

- Kaikki tekstikentät hyväksyvät `$`-lausekkeita, joten ID:t ja tiedostonimet voivat tulla aiemmista solmuista.
- Jaetut asemat ovat tuettuja — solmu asettaa `supportsAllDrives` jokaisessa pyynnössä.
- Lataukset tarkistetaan taustajärjestelmän `FILE_MAX_SIZE_MB` -asetuksen mukaisesti.
- Liitä tämä solmu [Agent](./agent-node.md) -solmun työkalun syötteeseen ja käytä bot-kuvaketta missä tahansa kentässä, jotta agentti voi täyttää sen ajonaikaisesti.

## Katso myös

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
