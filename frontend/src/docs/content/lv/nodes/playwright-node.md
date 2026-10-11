# Playwright

**Playwright** mezgls automatizē pārlūkprogrammas darbības ar konfigurējamiem soļiem. Izmantojiet to tīmekļa skrāpēšanai, formu aizpildīšanai un pārlūkprogrammā balstītām workflow.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.results`, `$nodeLabel.screenshot` un neobligāti tīkla/pārlūkprogrammas dati |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (noklusējums) vai `"code"` (Run Code). Izvēlieties Properties Panel Mode nolaižamajā izvēlnē |
| `playwrightSteps` | array | Soļi: navigate, click, type, aiStep utt. Katram solim ir action un selector/params. `disabled: true` saglabā soli sarakstā, bet izlaiž to izpildes laikā |
| `playwrightCode` | string | Pielāgots Playwright Python, ko izmanto, kad Mode ir Run Code. Darbojas drošā sandbox vidē un ir **pēc noklusējuma atspējots** — skatiet drošības piezīmi zemāk |
| `playwrightHeadless` | boolean | Darbināt headless režīmā (noklusējums: true) |
| `playwrightStealth` | boolean | Steps režīma iestatījums, kas jāiespējo atsevišķi un samazina izplatītos Playwright automatizācijas signālus (noklusējums: false). Properties Panel apzīmējums: Reduce automation flags |
| `playwrightTimeout` | number | Timeout milisekundēs (noklusējums: 30000) |
| `playwrightCaptureNetwork` | boolean | Uztvert JSON atbildes, headers, cookies un pārlūkprogrammas krātuvi |
| `playwrightAuthEnabled` | boolean | Atjaunot pārlūkprogrammas autentifikāciju no cookies/storageState pirms soļu izpildes |
| `playwrightAuthStateExpression` | string | Izteiksme vai JSON, kas atrisina uz Playwright `storageState` vai neapstrādātu `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selector, kam jābūt redzamam pēc autentifikācijas sāknēšanas |
| `playwrightAuthCheckTimeout` | number | Timeout milisekundēs autentificētā selector pārbaudei (noklusējums: 5000) |
| `playwrightAuthFallbackSteps` | array | Tikai pieteikšanās fallback soļi, ko izpildīt, ja cookie atjaunošana neautentificē lapu |

## Soļu tipi

- **navigate** – Doties uz URL
- **refresh** – Pārlādēt pašreizējo lapu (neobligāts solis `timeout` milisekundēs pārlādes navigācijai)
- **click** – Noklikšķināt uz elementa pēc selector
- **type** – Ievadīt tekstu ievadlaukā (pa rakstzīmēm)
- **fill** – Aizpildīt ievades vērtību
- **wait** – Pagaidīt timeout (ms)
- **screenshot** – Uzņemt ekrānuzņēmumu (`outputKey` saglabā base64 rezultātos)
- **getText** – Elementa teksta saturs (`selector`, neobligāts `outputKey`)
- **getAttribute** – Atribūta vērtība (`selector`, `attribute`, neobligāts `outputKey`)
- **getHTML** – Elementa ārējais HTML (`selector`, neobligāts `outputKey`)
- **getVisibleTextOnPage** – Visas lapas redzamais teksts kā `document.body.innerText` (nav selector; izmantojiet `outputKey`; neobligāts solis `timeout` milisekundēs pagaida pirms uztveršanas)
- **hover** – Novietot kursoru uz elementa
- **selectOption** – Izvēlēties opciju `<select>` elementā
- **scrollDown** / **scrollUp** – Peles ritināšana (neobligāts `amount` pikseļos)
- **aiStep** – LLM atgriež tāda paša veida darbības kā manuālie soļi (skatiet zemāk); ligzdots `aiStep` netiek atbalstīts

## Soļa izslēgšana

Katram solim tā galvenē ir ieslēgšanas/izslēgšanas pārslēgs. Izslēgts solis tiek parādīts ar pārsvītrotu un blāvu nosaukumu, paliek sarakstā ar visiem tā laukiem un tiek izlaists, kad mezgls darbojas — noderīgi, lai izolētu kļūdainu selector, neizdzēšot darbu. Saglabātais solis satur `disabled: true`; soļi bez šī karodziņa darbojas normāli.

Izslēgtie soļi nav redzami pārējai mezgla daļai: tie neatbilst autentifikācijas sāknēšanas noteikumam "pirmajam solim jābūt `navigate`", izslēgts `aiStep` neveic LLM izsaukumu, un izslēgti ieraksti `playwrightAuthFallbackSteps` arī tiek izlaisti. Ja tiek izslēgti visi soļi, izpilde neizdodas ar ziņojumu, kas lūdz iespējot vismaz vienu.

## AI solis

**aiStep** darbība izmanto LLM, lai analizētu lapas HTML (un neobligāti ekrānuzņēmumu) un ģenerētu Playwright darbības no dabiskās valodas instrukcijām. API pieņem tos pašus darbību nosaukumus kā manuālie soļi (tostarp `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, ritināšanas utt.). **Auto heal** aizstāj tikai neizdevušos selector balstītos soļus ar alternatīvām darbībām click, type, fill, hover un selectOption.

| Opcija | Apraksts |
|--------|-------------|
| `instructions` | Ko AI ir jādara (piem., "Click the Login button") |
| `credentialId` | LLM akreditācijas dati (OpenAI, Google vai Custom) |
| `model` | Meklējams modelis saraksts no izvēlētajiem LLM akreditācijas datiem |
| `saveStepsForFuture` | Saglabāt ģenerētos soļus nākamajām izpildēm kešatmiņā (izvairās no LLM izsaukuma) |
| `sendScreenshot` | Nosūtīt ekrānuzņēmumu LLM vizuālo elementu noteikšanai |
| `aiStepTimeout` | Timeout LLM izsaukumam milisekundēs (noklusējums 30000) |

### AI Auto Heal

**AI Auto Heal** padara workflow noturīgus pret DOM izmaiņām. Kad selector neizdodas divas reizes (piem., pēc vietnes pārveides), Heym izsauc LLM, lai atrastu alternatīvu lokatoru — parasti `role=button[name='Submit']` vai `text=Exact text` CSS selector vietā.

Iespējojiet **Auto heal mode** AI soļa īpašībās. Ja saglabātais solis neizdodas:

1. Heym uztver pašreizējo HTML un ekrānuzņēmumu
2. Nosūta neizdevušos soli + lapas kontekstu LLM
3. LLM atgriež noturīgu alternatīvu (uz lomu balstītu lokatoru, teksta lokatoru vai rezerves CSS)
4. Atkārto ar jauno selector

Tas samazina nestabilitāti, kad vietnes atjaunina savu marķējumu vai klašu nosaukumus.
## Samazināt automatizācijas pazīmes

Iespējojiet **Samazināt automatizācijas pazīmes** (`playwrightStealth: true`), ja vietne uzskata Playwright pievienoto Chromium par botu standarta automatizācijas signālu dēļ (`HeadlessChrome` lietotāja aģentā, `navigator.webdriver`, trūkstošais `window.chrome`).

Šī opcija darbojas tikai **Steps** režīmā. Tā:

- Noņem Chromium karodziņu `--enable-automation` un iestata `--disable-blink-features=AutomationControlled`
- Nosūta standarta Chrome lietotāja aģentu (bez `HeadlessChrome`)
- Atjauno parastās pārlūka virsmas, ko Playwright atstāj tukšas (`window.chrome`, spraudņi)
- Atstāj resursdatora GPU renderētāju nemainītu, ja GPU ir pieejams (lokāli macOS/Windows). Linux/Docker nav GPU; Chromium programmatūras renderētāja virkne tiek norādīta kā tipisks Mali (ARM) vai Mesa (x86) GPU, nevis SwiftShader.

Tā neslēpj, ka sesija tiek vadīta caur Chrome DevTools Protocol, un tā nav metode, kā apiet vietnes drošību, CAPTCHA vai piekļuves kontroli. Izmantojiet to workflow, ko esat pilnvarots palaist — iekšējiem rīkiem, savām vietnēm un atļautai pārlūka automatizācijai.

Run Code režīms nav mainīts — pielāgoti skripti paši palaiž Chromium.

## Tīkla uztveršana

Iespējojiet `playwrightCaptureNetwork`, lai izpildes laikā apkopotu papildu atkļūdošanas datus:

- `networkRequests` – Uztvertās JSON/API atbildes
- `cookies` – Pārlūka sīkdatnes izpildes beigās
- `localStorage` – Pārlūka `localStorage` atslēgu-vērtību pāri
- `sessionStorage` – Pārlūka `sessionStorage` atslēgu-vērtību pāri

Tas ir noderīgi, ja pēc automatizētas plūsmas ir nepieciešams pārbaudīt slēptus API izsaukumus, autentifikācijas stāvokli vai pārlūka puses datus.

## Sīkdatņu sāknēšana un pieteikšanās rezerves variants

Iespējojiet `playwrightAuthEnabled`, ja vēlaties, lai Playwright atver lapu jau pieteicies.

### Autentifikācijas stāvokļa avots

Iestatiet `playwrightAuthStateExpression` uz izteiksmi, piemēram, `$global.authState`. Vērtība var būt:

- Playwright `storageState` objekts: `{"cookies": [...], "origins": [...]}`
- Neapstrādāts `cookies[]` masīvs
- JSON virkne, kas satur jebkuru no šīm formām

Ieteicamais modelis:

1. Palaidiet Playwright node ar iespējotu tīkla uztveršanu vai autentifikācijas sāknēšanu
2. Saglabājiet `$playwrightNode.cookies` vai pilnu autentifikācijas stāvokļa objektu [Globālajā mainīgajā](../reference/global-variables.md)
3. Atkārtoti izmantojiet šo mainīgo vēlākos Playwright node, izmantojot `$global.authState`

### Autentifikācijas pārbaude

Pirmajam galvenajam Playwright solim ir jābūt `navigate`. Pēc šī soļa ielādes Heym pārbauda `playwrightAuthCheckSelector`.

- Ja selektors ir redzams, atlikušie galvenie soļi turpinās parasti
- Ja selektors nav atrasts, Heym palaiž `playwrightAuthFallbackSteps`
- Pēc rezerves soļu pabeigšanas Heym vēlreiz pārbauda to pašu selektoru
- Ja selektors joprojām nav atrasts, node neizdodas ar autentifikācijas sāknēšanas kļūdu

Rezerves soļi pārvalda navigāciju pēc autentifikācijas kļūmes. Tiem ir jāatstāj pārlūks autentificētajā lapā, ko sagaida pārējā galvenā plūsma.

## Izvades lauki

- `$playwrightNode.status` – `"ok"` veiksmes gadījumā
- `$playwrightNode.results` – Soļu izvades (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot atslēgas utt.)
- `$playwrightNode.screenshot` – Base64 ekrānuzņēmums, kad solis to saglabā
- `$playwrightNode.cookies` – Galīgās pārlūka sīkdatnes, kad autentifikācijas sāknēšana vai tīkla uztveršana ir iespējota
- `$playwrightNode.networkRequests` – Uztvertās tīkla atbildes (kad iespējots)
- `$playwrightNode.localStorage` – Pārlūka lokālā krātuve (kad iespējota)
- `$playwrightNode.sessionStorage` – Pārlūka sesijas krātuve (kad iespējota)

## Piemērs

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

## Run Code režīms

Rekvizītu panelī iestatiet **Mode** uz **Run Code**, lai rediģētu `playwrightCode`, nevis vizuālos soļus. Autentifikācijas sāknēšana attiecas tikai uz Steps režīmu.

Piemērs (sandbox / Docker — Chromium nepieciešams `--no-sandbox`):

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

Ietvars nodrošina `inputs`, `headless`, `timeout_ms` un `capture_network`. Kodā varat iegult `$nodeLabel.field` izteiksmes; izdrukājiet JSON ar `status` un `results`.
## Pielāgota koda drošība

Lauks `playwrightCode` izpilda patvaļīgu Python kodu. Tā kā tas ir līdzvērtīgs koda izpildei, tas ir **pēc noklusējuma atspējots** un, kad tas ir iespējots, tiek izolēts smilškastē:

- **Pēc noklusējuma atspējots.** Mezgla ar iestatītu `playwrightCode` izpilde neizdodas ar skaidru kļūdas ziņojumu, ja vien operators nav iestatījis `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Pārbaude tiek veikta izpildes laikā, tāpēc tā attiecas arī uz iepriekš saglabātiem workflow un grafika / apakš-workflow izpildēm.
- **Izolēts, kad iespējots.** Pielāgots kods netiek izpildīts backend procesā. Tas tiek izpildīts nostiprinātā, vienreizlietojamā blakus konteinerā bez Docker socket, bez backend bind mounts, bez backend akreditācijas datiem tā vidē, ar atņemtām capabilities, `no-new-privileges` un CPU / atmiņas / PID ierobežojumiem. Ja Docker nav pieejams, izpilde neizdodas droši. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` atgriežas pie procesa iekšējā ceļa tikai uzticamai vai lokālās izstrādes lietošanai (nav drošības robeža). Vietējais `./run.sh` pēc noklusējuma izmanto `subprocess`, ja nav iestatīts `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) un GHCR vienotais attēls atrisina blakus runneri, izmantojot `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (ar atkāpšanos uz `HEYM_CODEX_DOCKER_IMAGE`), un izmanto atbilstošo venv ceļu (`/app/.venv` pret `/app/backend/.venv`).
- **Chromium piezīme.** Smilškastas konteiners pēc noklusējuma darbojas kā root, un Chromium atsakās darboties kā root bez `--no-sandbox`. Pielāgotam kodam, kas palaiž Chromium, tas ir jānodod, piemēram, `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Uz soļiem balstīti (un stealth) palaišanas gadījumi arī nodod `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, lai fingerprint skripti nevarētu atvērt STUN UDP uz `stun.l.google.com:19302`. Pielāgotiem `chromium.launch` izsaukumiem arī jāiekļauj šis karodziņš.

Uz soļiem balstīti Playwright mezgli (`playwrightSteps`) tiek pilnībā ģenerēti ar Heym (bez patvaļīga koda), uz tiem neattiecas nekas no iepriekš minētā, un tie vienmēr ir pieejami — dodiet tiem priekšroku.

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Crawler mezgls](./crawler-node.md) – Vienkāršāka tīmekļa skrāpēšana ar FlareSolverr
- [Akreditācijas datu koplietošana](../reference/credentials-sharing.md) – LLM akreditācijas dati AI soļiem
