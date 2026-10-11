# Playwright

**Playwright** node automatiseerib brauseri interaktsioone konfigureeritavate sammudega. Kasutage seda veebikaapimiseks, vormide täitmiseks ja brauseripõhiste workflow'de jaoks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.results`, `$nodeLabel.screenshot` ja valikulised võrgu-/brauseriandmed |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (vaikimisi) või `"code"` (Käivita kood). Valige Properties Panel'i Mode rippmenüüst |
| `playwrightSteps` | array | Sammud: navigate, click, type, aiStep jne. Igal sammul on action ja selector/params. `disabled: true` jätab sammu nimekirja, kuid jätab selle käitusajal vahele |
| `playwrightCode` | string | Kohandatud Playwright Python, mida kasutatakse, kui Mode on Run Code. Töötab karastatud sandbox'is ja on **vaikimisi keelatud** — vt allpool olevat turbemärkust |
| `playwrightHeadless` | boolean | Käivita headless-režiimis (vaikimisi: true) |
| `playwrightStealth` | boolean | Steps-režiimis valikuline säte, mis vähendab levinud Playwright automatiseerimissignaale (vaikimisi: false). Properties Panel'i silt: Reduce automation flags |
| `playwrightTimeout` | number | Timeout millisekundites (vaikimisi: 30000) |
| `playwrightCaptureNetwork` | boolean | Jäädvusta JSON-vastused, päised, küpsised ja brauseri salvestusruum |
| `playwrightAuthEnabled` | boolean | Taasta brauseri autentimine küpsiste/storageState'i põhjal enne sammude käivitamist |
| `playwrightAuthStateExpression` | string | Avaldis või JSON, mis laheneb Playwrighti `storageState`-iks või töötlemata `cookies[]`-ks |
| `playwrightAuthCheckSelector` | string | Selector, mis peab olema nähtav pärast autentimise alglaadimist |
| `playwrightAuthCheckTimeout` | number | Autenditud selectori kontrolli timeout millisekundites (vaikimisi: 5000) |
| `playwrightAuthFallbackSteps` | array | Ainult sisselogimiseks mõeldud varusammud, mida käivitada, kui küpsiste taastamine lehte ei autenti |

## Sammutüübid

- **navigate** – Mine URL-ile
- **refresh** – Laadi praegune leht uuesti (valikuline sammu `timeout` millisekundites uuestilaadimise navigatsiooni jaoks)
- **click** – Klõpsa elemendil selectori järgi
- **type** – Sisesta tekst sisendisse (tähemärk-haaval)
- **fill** – Täida sisendi väärtus
- **wait** – Oota timeout'i (ms)
- **screenshot** – Jäädvusta kuvatõmmis (`outputKey` salvestab base64 tulemustesse)
- **getText** – Elemendi tekstisisu (`selector`, valikuline `outputKey`)
- **getAttribute** – Atribuudi väärtus (`selector`, `attribute`, valikuline `outputKey`)
- **getHTML** – Elemendi väline HTML (`selector`, valikuline `outputKey`)
- **getVisibleTextOnPage** – Kogu lehe nähtav tekst kujul `document.body.innerText` (selector puudub; kasutage `outputKey`-d; valikuline sammu `timeout` millisekundites ootab enne jäädvustamist)
- **hover** – Hõlju elemendi kohal
- **selectOption** – Vali valik `<select>`-is
- **scrollDown** / **scrollUp** – Hiireratta kerimine (valikuline `amount` pikslites)
- **aiStep** – LLM tagastab samu tüüpi tegevusi nagu käsitsi sammud (vt allpool); pesastatud `aiStep` ei ole toetatud

## Samm uuesti välja lülitamine

Igal sammul on oma päises toitelüliti. Välja lülitatud samm kuvatakse läbikriipsutatud ja tuhmilt, jääb nimekirja kõigi oma väljadega ning jäetakse node'i käivitamisel vahele — see on kasulik vigase selectori isoleerimiseks ilma tööd kustutamata. Salvestatud sammul on `disabled: true`; sammud ilma selle liputa käivituvad tavaliselt.

Keelatud sammud on ülejäänud node'i jaoks nähtamatud: need ei rahulda autentimise alglaadimise reeglit "esimene samm peab olema `navigate`", keelatud `aiStep` ei tee LLM-kutset ning ka keelatud kirjed `playwrightAuthFallbackSteps`-is jäetakse vahele. Kõigi sammude välja lülitamine nurjab käivituse teatega, mis palub ühe lubada.

## AI-samm

**aiStep**-tegevus kasutab LLM-i, et analüüsida lehe HTML-i (ja valikuliselt kuvatõmmist) ning genereerida loomuliku keele juhiste põhjal Playwrighti tegevusi. API võtab vastu samu tegevuste nimesid nagu käsitsi sammud (sealhulgas `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, kerimised jne). **Auto heal** asendab ainult ebaõnnestunud selectoripõhised sammud alternatiividega tegevuste click, type, fill, hover ja selectOption jaoks.

| Valik | Kirjeldus |
|--------|-------------|
| `instructions` | Mida AI peaks tegema (nt "Klõpsa nupul Login") |
| `credentialId` | LLM-i mandaat (OpenAI, Google või Custom) |
| `model` | Otsitav mudelite nimekiri valitud LLM-i mandaadist |
| `saveStepsForFuture` | Salvesta genereeritud sammud järgmisteks käivitusteks (väldib LLM-kutset) |
| `sendScreenshot` | Saada kuvatõmmis LLM-ile visuaalsete elementide jaoks |
| `aiStepTimeout` | LLM-kutse timeout millisekundites (vaikimisi: 30000) |

### AI Auto Heal

**AI Auto Heal** muudab workflow'd vastupidavaks DOM-i muutustele. Kui selector ebaõnnestub kaks korda (nt pärast saidi ümberkujundust), kutsub Heym LLM-i, et leida alternatiivne lokaator — tavaliselt `role=button[name='Submit']` või `text=Exact text` CSS-selectorite asemel.

Lubage AI-sammu omadustes **Auto heal mode**. Kui salvestatud samm ebaõnnestub:

1. Heym jäädvustab praeguse HTML-i ja kuvatõmmise
2. Saadab ebaõnnestunud sammu + lehe konteksti LLM-ile
3. LLM tagastab vastupidava alternatiivi (rollipõhine lokaator, tekstilokaator või varu-CSS)
4. Proovib uuesti uue selectoriga

See vähendab ebastabiilsust, kui saidid uuendavad oma märgistust või klassinimesid.
## Automaatika lippude vähendamine

Lubage **Automaatika lippude vähendamine** (`playwrightStealth: true`), kui sait käsitleb Playwrighti kaasasolevat Chromiumi botina standardsete automaatika signaalide tõttu (`HeadlessChrome` user agent'is, `navigator.webdriver`, puuduv `window.chrome`).

See valik rakendub ainult **Steps** režiimis. See:

- Eemaldab Chromiumi `--enable-automation` lipu ja määrab `--disable-blink-features=AutomationControlled`
- Saadab standardset Chrome'i user agent'i (ilma `HeadlessChrome`)
- Taastab tavalised brauseri pinnad, mille Playwright jätab tühjaks (`window.chrome`, pluginad)
- Jätab hosti GPU renderdaja muutmata, kui GPU on saadaval (lokaalne macOS/Windows). Linux/Dockeril puudub GPU; Chromiumi tarkvaralise renderdaja string esitatakse tüüpilise Mali (ARM) või Mesa (x86) GPU-na, mitte SwiftShaderina.

See ei varja, et sessiooni juhitakse Chrome DevTools Protocoli kaudu, ega ole viis mööda minna saidi turvameetmetest, CAPTCHA-dest ega juurdepääsukontrollidest. Kasutage seda workflow'de puhul, mille käivitamiseks olete volitatud — sisemised tööriistad, teie enda saidid ja lubatud brauseri automaatika.

Run Code režiim on muutumatu — kohandatud skriptid käivitavad Chromiumi ise.

## Võrgu jäädvustamine

Lubage `playwrightCaptureNetwork`, et koguda käivituse ajal täiendavaid silumisandmeid:

- `networkRequests` – jäädvustatud JSON/API vastused
- `cookies` – brauseri cookies'id käivituse lõpus
- `localStorage` – brauseri `localStorage` võti-väärtus paarid
- `sessionStorage` – brauseri `sessionStorage` võti-väärtus paarid

See on kasulik, kui peate pärast automatiseeritud voogu uurima peidetud API-kutseid, autentimise olekut või brauseripoolseid andmeid.

## Cookie Bootstrap Ja Login Fallback

Lubage `playwrightAuthEnabled`, kui soovite, et Playwright avaks lehe juba sisse logituna.

### Autentimise oleku allikas

Määrake `playwrightAuthStateExpression` avaldiseks nagu `$global.authState`. Väärtus võib olla:

- Playwrighti `storageState` objekt: `{"cookies": [...], "origins": [...]}`
- Toores `cookies[]` massiiv
- JSON-string, mis sisaldab kumbagi kuju

Soovitatav muster:

1. Käivitage Playwright node, millel on lubatud võrgu jäädvustamine või autentimise bootstrap
2. Salvestage `$playwrightNode.cookies` või täielik autentimise oleku objekt [Globaalsesse muutujasse](../reference/global-variables.md)
3. Kasutage seda muutujat uuesti hilisemates Playwright node'ides `$global.authState` kaudu

### Autentimise kontroll

Esimene peamine Playwrighti samm peab olema `navigate`. Pärast selle sammu laadimist kontrollib Heym `playwrightAuthCheckSelector`-it.

- Kui selektor on nähtav, jätkuvad ülejäänud peamised sammud tavaliselt
- Kui selektor puudub, käivitab Heym `playwrightAuthFallbackSteps`-i
- Pärast fallback sammude lõppemist kontrollib Heym sama selektorit uuesti
- Kui selektor on endiselt puuduv, nurjub node autentimise bootstrap veaga

Fallback sammud vastutavad navigeerimise eest pärast autentimise nurjumist. Need peaksid jätma brauseri autenditud lehele, mida ülejäänud põhivoog eeldab.

## Väljundväljad

- `$playwrightNode.status` – `"ok"` õnnestumise korral
- `$playwrightNode.results` – Sammude väljundid (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot võtmed jne)
- `$playwrightNode.screenshot` – Base64 screenshot, kui samm salvestab ühe
- `$playwrightNode.cookies` – Lõplikud brauseri cookies'id, kui autentimise bootstrap või võrgu jäädvustamine on lubatud
- `$playwrightNode.networkRequests` – Jäädvustatud võrgu vastused (kui lubatud)
- `$playwrightNode.localStorage` – Brauseri local storage (kui lubatud)
- `$playwrightNode.sessionStorage` – Brauseri session storage (kui lubatud)

## Näide

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Run Code režiim

Määrake Properties Panel'is **Mode** väärtuseks **Run Code**, et muuta `playwrightCode`-i visuaalsete sammude asemel. Autentimise bootstrap rakendub ainult Steps režiimis.

Näide (sandbox / Docker — Chromium vajab `--no-sandbox`):

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

Wrapper pakub `inputs`, `headless`, `timeout_ms` ja `capture_network`. Koodi saab manustada `$nodeLabel.field` avaldisi; printige JSON koos `status` ja `results`-iga.
## Kohandatud koodi turvalisus

Väli `playwrightCode` käivitab suvalist Pythonit. Kuna see on samaväärne koodi käivitamisega, on see **vaikimisi keelatud** ja lubamise korral liivakastis:

- **Vaikimisi keelatud.** `playwrightCode`-iga sõlme käivitamine ebaõnnestub selge veateatega, kui operaator ei ole seadnud `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Kontroll teostatakse käivitamise ajal, seega see hõlmab ka varem salvestatud workflow'sid ning ajakava- ja alam-workflow'de käivitusi.
- **Isoleeritud, kui lubatud.** Kohandatud kood ei käivitu backend-protsessis. See käivitub karastatud, ühekordses õekskonteineris, millel puudub Dockeri socket, backend'i bind-mount'id, backend'i saladused keskkonnas, on eemaldatud võimekused, `no-new-privileges` ning CPU / mälu / PID piirangud. Kui Docker ei ole saadaval, ebaõnnestub käivitus suletud olekus. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` lülitab tagasi protsessisisesele teele ainult usaldusväärseks või kohalikuks arenduseks (ei ole turvapiir). Natiivne `./run.sh` kasutab vaikimisi `subprocess`-t, kui `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` ei ole seatud. `./deploy.sh` (Compose) ja GHCR üksikpilt lahendavad õekskonteineri käivitaja `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` kaudu (tagavaraks `HEYM_CODEX_DOCKER_IMAGE`) ning kasutavad vastavat venv-teed (`/app/.venv` vs `/app/backend/.venv`).
- **Chromiumi märkus.** Liivakastikonteiner käivitub vaikimisi root-kasutajana ning Chromium keeldub root-kasutajana käivitumast ilma `--no-sandbox` liputa. Kohandatud kood, mis käivitab Chromiumi, peaks selle edasi andma, näiteks `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Sammupõhised (ja stealth) käivitused edastavad samuti `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, et sõrmejäljeskriptid ei saaks avada STUN UDP-d aadressile `stun.l.google.com:19302`. Kohandatud `chromium.launch` väljakutsed peaksid samuti selle lipu kaasama.

Sammupõhised Playwrighti sõlmed (`playwrightSteps`) on täielikult Heymi poolt genereeritud (ilma suvalise koodita), neid kõik ülaltoodu ei mõjuta ja need on alati saadaval — eelistage neid.

## Seotud

- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Crawleri sõlm](./crawler-node.md) – Lihtsam veebikaapimine FlareSolverriga
- [Mandaatide jagamine](../reference/credentials-sharing.md) – LLM-i mandaadid AI sammude jaoks
