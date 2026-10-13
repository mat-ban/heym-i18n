# File Upload Trigger

**File Upload Trigger** -solmu on nollasyötteinen alkupiste workfloweille, jotka tarvitsevat **suuria tiedostoja** (ääni, video, arkistot), joita ei voida upottaa base64-muodossa JSON-pyyntöön. Workflown käynnistäminen palauttaa esitäytetyn, kertakäyttöisen `curl`-upload-linkin; tiedoston lataaminen tähän linkiin käynnistää suorituksen, jossa tiedosto on liitettynä.

Käytä tätä solmua tilanteissa, joissa kutsuva osapuoli – mukaan lukien tekoälyagentti kuten Claude tai ChatGPT, joka toimii eristetyssä ympäristössä – on toimittava esimerkiksi 20 MB:n äänitallenteen tai 75 MB:n videon Heym-workflowlle.

## Yleiskatsaus

| Ominaisuus | Arvo |
|------------|------|
| Syötteet | 0 |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Toimintaperiaate

Solmu toimii kahdessa vaiheessa:

1. **Linkin luonti.** Kun workflow käynnistetään HTTP:n kautta (`POST /api/workflows/{id}/execute`), MCP-työkaluna tai Canvasin **Run Workflow** -painikkeella, suoritus **ei** suorita workflown runkoa. Sen sijaan se luo kertakäyttöisen upload-paikan ja palauttaa:

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **Lataus + suoritus.** Kutsuva osapuoli suorittaa `curl`-komennon tiedostollaan. Upload-endpoint validoi paikan, tallentaa tiedoston, suorittaa workflown **synkronoidusti** ja palauttaa workflown tuloksen upload-vastauksessa. Linkki on **kertakäyttöinen** – toinen latausyritys palauttaa virhekoodin `409`.

Canvasissa **Run Workflow** näyttää luodun `curl`-komennon debug-paneelissa kopiointipainikkeella varustettuna.

## Suorittaminen Heymistä

Kahdessa paikassa tällainen Workflow voidaan suorittaa suoraan tiedostolle saman luonti- ja lähetysprosessin kautta:

- [Quick Drawer](../reference/quick-drawer.md) näyttää pudotusalueen tiedostolle. Nämä suoritukset merkitään historiassa tunnisteella `Quick Drawer`.
- Kojelaudan [suorituswidget](../tabs/dashboard-tab.md#run-widgets) suorittaa Workflow'n jokaiselle pudotetulle tiedostolle. Nämä suoritukset merkitään tunnisteella `dashboard`.

## Parametrit

| Parametri | Tyyppi | Oletus | Kuvaus |
|-----------|--------|--------|---------|
| `ttlMinutes` | numero | `60` | Kuinka kauan upload-linkki pysyy voimassa (1–10080 minuuttia / enintään 7 päivää). |
| `maxSizeMb` | numero | `100` | Suurin sallittu tiedostokoko. Kovana rajana on **100 MB**. |
| `allowedTypes` | merkkijono | (tyhjä) | Valinnainen pilkuilla erotettu MIME/tyyppien sallittujen arvojen lista, esim. `audio/*, .wav`. Tyhjä sallii kaikki tyypit. |

## Tulokentät

| Lauseke | Kuvaus |
|---------|---------|
| `$nodeLabel.file.id` | Tallennetun tiedoston UUID (Drive-tiedosto). |
| `$nodeLabel.file.name` | Alkuperäinen tiedostonimi. |
| `$nodeLabel.file.mime` | Havaittu sisältötyyppi. |
| `$nodeLabel.file.size` | Koko tavuina. |
| `$nodeLabel.file.download_url` | Autentikoitu latauslinkki alaspäin suuntautuville solmuille. |
| `$nodeLabel.uploaded_at` | Uploadin ISO-aikaleima. |

## Esimerkki

Transkriptio-workflow:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Agentti kutsuu workflown MCP-työkalua ja saa vastauksena `curl`-komennon.
2. Agentti suorittaa `curl`-komennon eristetystä ympäristöstään löytyvällä äänitallenteella.
3. Upload käynnistää workflown ja `curl`-vastaus sisältää transkription yhteenvedon.

## Turvallisuus

- Upload-linkki sisältää korkean entropian tokenin – token **on** käyttöoikeus, joten eristetyssä ympäristössä toimivalle agentille ei tarvita Heym-tunnistetietoja latausta varten. Vain tokenin tiiviste tallennetaan palvelimelle.
- Linkin luonti edellyttää normaalia workflow-autentikointia, joten vain valtuutetut osapuolet voivat luoda upload-linkkejä.
- Jokainen linkin luonti ja jokainen latausyritys (hyväksytty tai hylätty – vanhentunut, uudelleenkäytetty, liian suuri, ei-sallittu tyyppi, tuntematon token) kirjataan vain lisättävään tarkistuslokiin.
- Uploadit ovat pakotetusti kertakäyttöisiä, voimassaoloaikansa rajoittamia ja kokorajoittamia; liian suuret uploadit hylätään.

## Huomiot

- Yleiset HTTP-, MCP- ja Canvas-käynnistyskanavat pysyvät JSON-pohjaisina; tämä solmu on tuettu tapa hyväksyä moniosaisia tiedostolatauksia.
- Ladattu tiedosto tallennetaan normaaliin Drive-tiedostoon, joten mikä tahansa alaspäin suuntautuva solmu, joka hyväksyy tiedostoviitteen (transkriptio, sähköpostin liite jne.), voi käyttää `$nodeLabel.file` -tulosta.
