# Playwright

**Playwright** mazgas automatizuoja naršyklės sąveikas su konfigūruojamais žingsniais. Naudokite jį žiniatinklio duomenų rinkimui, formų užpildymui ir naršyklėje vykdomiems workflows.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.results`, `$nodeLabel.screenshot`, ir neprivalomi tinklo/naršyklės duomenys |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `playwrightMode` | string | `"steps"` (numatytasis) arba `"code"` (Vykdyti kodą). Pasirinkite Properties Panel režimo išskleidžiamajame sąraše |
| `playwrightSteps` | array | Žingsniai: navigate, click, type, aiStep ir kt. Kiekvienas žingsnis turi veiksmą ir selektorių/parametrus. `disabled: true` išlaiko žingsnį sąraše, bet praleidžia jį vykdymo metu |
| `playwrightCode` | string | Pasirinktinis Playwright Python, naudojamas kai režimas yra Vykdyti kodą. Vykdomas sustiprintoje smėlio dėžėje ir yra **išjungtas pagal numatytuosius nustatymus** — žr. saugumo pastabą žemiau |
| `playwrightHeadless` | boolean | Vykdyti be sąsajos (numatytasis: true) |
| `playwrightStealth` | boolean | Pasirinktinė žingsnių režimo nustatymas, kuris sumažina įprastus Playwright automatizavimo signalus (numatytasis: false). Properties Panel etiketė: Sumažinti automatizavimo vėliavas |
| `playwrightTimeout` | number | Laiko limitas ms (numatytasis: 30000) |
| `playwrightCaptureNetwork` | boolean | Fiksuoti JSON atsakymus, antraštes, slapukus ir naršyklės saugyklą |
| `playwrightAuthEnabled` | boolean | Atkurti naršyklės autentifikaciją iš slapukų/saugojimo būsenos prieš vykdant žingsnius |
| `playwrightAuthStateExpression` | string | Išraiška arba JSON, kuris išsprendžia į Playwright `storageState` arba žalius `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selektorius, kuris turi būti matomas po autentifikacijos paleidimo |
| `playwrightAuthCheckTimeout` | number | Laiko limitas ms autentifikuoto selektoriaus tikrinimui (numatytasis: 5000) |
| `playwrightAuthFallbackSteps` | array | Tik prisijungimo atsarginiai žingsniai, kurie vykdomi, kai slapukų atkūrimas nesuteikia autentifikacijos puslapiui |

## Žingsnių tipai

- **navigate** – Eiti į URL
- **refresh** – Perkrauti dabartinį puslapį (pasirinktinė žingsnio `timeout` ms per naujinimo navigaciją)
- **click** – Spustelėti elementą pagal selektorių
- **type** – Įvesti tekstą į įvesties lauką (po vieną simbolį)
- **fill** – Užpildyti įvesties reikšmę
- **wait** – Palaukti laiko limitą (ms)
- **screenshot** – Fiksuoti ekrano nuotrauką (`outputKey` saugo base64 rezultatuose)
- **getText** – Elemento teksto turinys (`selector`, pasirinktinė `outputKey`)
- **getAttribute** – Atributo reikšmė (`selector`, `attribute`, pasirinktinė `outputKey`)
- **getHTML** – Išorinis HTML elemento (`selector`, pasirinktinė `outputKey`)
- **getVisibleTextOnPage** – Visas puslapio matomas tekstas kaip `document.body.innerText` (be selektoriaus; naudokite `outputKey`; pasirinktinė žingsnio `timeout` ms laukia prieš fiksavimą)
- **hover** – Užveskite pelės žymeklį virš elemento
- **selectOption** – Pasirinkti parinktį `<select>`
- **scrollDown** / **scrollUp** – Pelės ratuko slinkimas (pasirinktinė `amount` pikseliais)
- **aiStep** – LLM grąžina tas pačias veiksmų rūšis kaip ir rankiniai žingsniai (žr. žemiau); įdėtiniai `aiStep` nėra palaikomi

## Žingsnio išjungimas

Kiekvienas žingsnis turi galios jungiklį savo antraštėje. Išjungtas žingsnis rodo savo pavadinimą perbrauktą ir išblukusį, lieka sąraše su visais savo laukais ir yra praleidžiamas, kai mazgas vykdomas — naudinga izoliuoti nesėkmingą selektorių, neištrinant darbo. Išsaugotas žingsnis turi `disabled: true`; žingsniai be šios vėliavos vykdomi normaliai.

Išjungti žingsniai yra nematomi likusiai mazgo daliai: jie nepatenka į "pirmasis žingsnis turi būti `navigate`" autentifikacijos paleidimo taisyklę, išjungtas `aiStep` neatlieka jokio LLM skambučio, o išjungti įrašai `playwrightAuthFallbackSteps` taip pat yra praleidžiami. Išjungus kiekvieną žingsnį, vykdymas nepavyksta su pranešimu, prašančiu įjungti vieną.

## AI Žingsnis

**aiStep** veiksmas naudoja LLM analizuoti puslapio HTML (ir pasirinktinai ekrano nuotrauką) ir generuoti Playwright veiksmus iš natūralios kalbos nurodymų. API priima tuos pačius veiksmų pavadinimus kaip ir rankiniai žingsniai (įskaitant `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, slinkimus ir kt.). **Auto heal** tik pakeičia nesėkmingus selektorių pagrindu veiksmus alternatyvomis spustelėjimui, įvedimui, užpildymui, užvedimui ir pasirinkimui.

| Pasirinkimas | Aprašymas |
|--------------|-----------|
| `instructions` | Ką AI turėtų daryti (pvz., "Spustelėkite Prisijungimo mygtuką") |
| `credentialId` | LLM kredencialas (OpenAI, Google arba Pasirinktinis) |
| `model` | Paieškos sąrašas modelių iš pasirinkto LLM kredencialo |
| `saveStepsForFuture` | Talpinti sugeneruotus žingsnius ateities vykdymams (vengti LLM skambučio) |
| `sendScreenshot` | Siųsti ekrano nuotrauką LLM vizualiems elementams |
| `aiStepTimeout` | Laiko limitas LLM skambuciui ms (numatytasis 30000) |

### AI Auto Heal

**AI Auto Heal** padaro workflows atsparius DOM pokyčiams. Kai selektorius nepavyksta du kartus (pvz., po svetainės dizaino atnaujinimo), Heym skambina LLM, kad rastų alternatyvų lokatorių — paprastai `role=button[name='Submit']` arba `text=Exact text` vietoj CSS selektorių.

Įjunkite **Auto heal mode** AI žingsnio parametruose. Jei išsaugotas žingsnis nepavyksta:

1. Heym fiksuoja dabartinį HTML ir ekrano nuotrauką
2. Siunčia nepavykusį žingsnį + puslapio kontekstą LLM
3. LLM grąžina tvirtą alternatyvą (rolės pagrindu lokatorių, teksto lokatorių arba atsarginį CSS)
4. Bandymas su nauju selektoriumi

Tai sumažina nestabilumą, kai svetainės atnaujina savo žymėjimą ar klasės pavadinimus.
## Automatizavimo žymų sumažinimas

Įjunkite **Reduce automation flags** (`playwrightStealth: true`), kai svetainė traktuoja Playwright supakuotą Chromium kaip botą dėl standartinių automatizavimo signalų (`HeadlessChrome` vartotojo agente, `navigator.webdriver`, trūkstamo `window.chrome`).

Ši parinktis taikoma tik **Steps** režime. Ji:

- Pašalina Chromium `--enable-automation` žymą ir nustato `--disable-blink-features=AutomationControlled`
- Siunčia standartinį Chrome vartotojo agentą (be `HeadlessChrome`)
- Atkuria bendras naršyklės paviršius, kuriuos Playwright palieka tuščius (`window.chrome`, papildiniai)
- Palieka host GPU renderer nepakeistą, kai GPU yra prieinamas (vietinis macOS/Windows). Linux/Docker neturi GPU; Chromium programinės įrangos rendererio eilutė pranešama kaip tipiškas Mali (ARM) arba Mesa (x86) GPU, o ne SwiftShader.

Tai neslepia, kad sesija valdomas per Chrome DevTools Protocol, ir tai nėra būdas apeiti svetainės saugumą, CAPTCHAs ar prieigos kontrolę. Naudokite tai tik tiems workflows, kuriuos turite teisę vykdyti — vidiniams įrankiams, savo svetainėms ir leidžiamai naršyklės automatizacijai.

Run Code režimas lieka nepakeistas — individualūs scenarijai patys paleidžia Chromium.

## Tinklo užfiksavimas

Įjunkite `playwrightCaptureNetwork`, kad surinktumėte papildomus derinimo duomenis vykdymo metu:

- `networkRequests` – Užfiksuoti JSON/API atsakymai
- `cookies` – Naršyklės slapukai vykdymo pabaigoje
- `localStorage` – Naršyklės `localStorage` raktų ir reikšmių poros
- `sessionStorage` – Naršyklės `sessionStorage` raktų ir reikšmių poros

Tai naudinga, kai reikia patikrinti paslėptus API skambučius, autentifikavimo būseną ar naršyklės pusės duomenis po automatizuoto srauto.

## Slapukų pradžia ir prisijungimo atsarginė kopija

Įjunkite `playwrightAuthEnabled`, kai norite, kad Playwright atidarytų puslapį, jau prisijungus.

### Autentifikavimo būsenos šaltinis

Nustatykite `playwrightAuthStateExpression` į tokią išraišką kaip `$global.authState`. Vertė gali būti:

- Playwright `storageState` objektas: `{"cookies": [...], "origins": [...]}` 
- Žali `cookies[]` masyvas
- JSON eilutė, turinti bet kurią iš šių formų

Rekomenduojama schema:

1. Paleiskite Playwright mazgą su tinklo užfiksavimu arba autentifikavimo pradžia įjungta
2. Išsaugokite `$playwrightNode.cookies` arba visą autentifikavimo būsenos objektą [Global Variable](../reference/global-variables.md)
3. Pakartotinai naudokite tą kintamąjį vėlesniuose Playwright mazguose per `$global.authState`

### Autentifikavimo patikra

Pirmasis pagrindinis Playwright žingsnis turi būti `navigate`. Po to, kai šis žingsnis užsikrauna, Heym patikrina `playwrightAuthCheckSelector`.

- Jei selektorius matomas, likę pagrindiniai žingsniai tęsiasi normaliai
- Jei selektorius trūksta, Heym vykdo `playwrightAuthFallbackSteps`
- Po atsarginių žingsnių užbaigimo, Heym vėl patikrina tą patį selektorių
- Jei selektorius vis dar trūksta, mazgas nepavyksta su autentifikavimo pradžios klaida

Atsarginiai žingsniai valdo navigaciją po autentifikavimo nesėkmės. Jie turėtų palikti naršyklę autentifikuotame puslapyje, kurio tikisi likusi pagrindinio srauto dalis.

## Išvesties laukai

- `$playwrightNode.status` – `"ok"` sėkmės atveju
- `$playwrightNode.results` – Žingsnių išvestys (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot raktai ir kt.)
- `$playwrightNode.screenshot` – Base64 ekrano nuotrauka, kai žingsnis ją išsaugo
- `$playwrightNode.cookies` – Galutiniai naršyklės slapukai, kai įjungta autentifikavimo pradžia arba tinklo užfiksavimas
- `$playwrightNode.networkRequests` – Užfiksuoti tinklo atsakymai (kai įjungta)
- `$playwrightNode.localStorage` – Naršyklės vietinė saugykla (kai įjungta)
- `$playwrightNode.sessionStorage` – Naršyklės sesijos saugykla (kai įjungta)

## Pavyzdys

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

## Run Code režimas

Savybių skydelyje nustatykite **Mode** į **Run Code**, kad redaguotumėte `playwrightCode` vietoj vizualių žingsnių. Autentifikavimo pradžia taikoma tik Steps režimui.

Pavyzdys (sandbox / Docker — Chromium reikia `--no-sandbox`):

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

Wrapperis teikia `inputs`, `headless`, `timeout_ms` ir `capture_network`. Galite įterpti `$nodeLabel.field` išraiškas kode; spausdinkite JSON su `status` ir `results`.
## Pasirinktinių kodų saugumas

`playwrightCode` laukas vykdo savavališką Python kodą. Kadangi tai atitinka kodo vykdymą, jis yra **išjungtas pagal numatytuosius nustatymus** ir, kai yra įjungtas, veikia izoliuotai:

- **Išjungtas pagal numatytuosius nustatymus.** Vykdant mazgą, kuriame nustatytas `playwrightCode`, įvyksta aiški klaida, nebent operatorius nustato `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Patikra vykdoma vykdymo metu, todėl ji taip pat apima anksčiau išsaugotus workflows ir suplanuotus / sub-workflow vykdymus.
- **Izoliuotas, kai įjungtas.** Pasirinktinis kodas nevykdomas backend procese. Jis vykdomas sustiprintame, laikinoje konteineryje, kuriame nėra Docker socket, nėra backend prisijungimų, nėra backend paslapčių aplinkoje, sumažintos galimybės, `no-new-privileges` ir CPU / atminties / PID apribojimai. Jei Docker nėra prieinamas, vykdymas nepavyksta. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` leidžia grįžti į proceso kelią, skirtą tik patikimiems arba vietiniams kūrimo naudojimams (ne saugumo ribai). Native `./run.sh` pagal numatytuosius nustatymus naudoja `subprocess`, kai nėra nustatyta `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) ir GHCR vieno vaizdo sprendžia brolio vykdytoją per `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (grįžtant prie `HEYM_CODEX_DOCKER_IMAGE`) ir naudoja atitinkamą venv kelią (`/app/.venv` vs `/app/backend/.venv`).
- **Chromium pastaba.** Smėlio dėžės konteineris pagal numatytuosius nustatymus veikia kaip root, o Chromium atsisako veikti kaip root be `--no-sandbox`. Pasirinktinis kodas, kuris paleidžia Chromium, turėtų perduoti šį parametrą, pavyzdžiui, `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Žingsnių pagrindu (ir slaptas) paleidimai taip pat perduoda `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, kad pirštų atspaudų skriptai negalėtų atidaryti STUN UDP į `stun.l.google.com:19302`. Pasirinktini `chromium.launch` skambučiai taip pat turėtų apimti šį parametrą.

Žingsnių pagrindu veikiantys Playwright mazgai (`playwrightSteps`) yra visiškai generuojami Heym (be savavališko kodo), nėra paveikti visų aukščiau išvardytų dalykų ir visada yra prieinami — teikite pirmenybę jiems.

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Crawler mazgas](./crawler-node.md) – Paprastesnis žiniatinklio nuskaitymas su FlareSolverr
- [Kredencialų dalijimasis](../reference/credentials-sharing.md) – LLM kredencialai AI žingsniams
