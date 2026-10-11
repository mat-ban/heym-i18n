# Playwright

**Playwright**-noden automatiserer browserinteraktioner med konfigurerbare trin. Den kan anvendes til webscraping, formularudfyldning og browserbaserede workflows.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.results`, `$nodeLabel.screenshot` og valgfri netværks-/browserdata |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (standard) eller `"code"` (Run Code). Vælges i egenskabspanelets Mode-dropdown |
| `playwrightSteps` | array | Trin: navigate, click, type, aiStep osv. Hvert trin har en handling og selector/parametre. `disabled: true` bevarer et trin på listen men springer det over under kørsel |
| `playwrightCode` | string | Brugerdefineret Playwright Python-kode, der anvendes når Mode er Run Code. Kører i en hærdet sandkasse og er **deaktiveret som standard** — se sikkerhedsnoten nedenfor |
| `playwrightHeadless` | boolean | Kør headless (standard: true) |
| `playwrightStealth` | boolean | Steps-mode-indstilling der reducerer almindelige Playwright-automatiseringssignaler (standard: false). Egenskabspanel-label: Reduce automation flags |
| `playwrightTimeout` | number | Timeout i ms (standard: 30000) |
| `playwrightCaptureNetwork` | boolean | Indfang JSON-svar, headers, cookies og browserstorage |
| `playwrightAuthEnabled` | boolean | Gendan browserautentifikation fra cookies/storageState før trin køres |
| `playwrightAuthStateExpression` | string | Udtryk eller JSON der oversættes til Playwright `storageState` eller rå `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selector der skal være synlig efter auth-bootstrap |
| `playwrightAuthCheckTimeout` | number | Timeout i ms for autentificeret selector-check (standard: 5000) |
| `playwrightAuthFallbackSteps` | array | Login-only fallback-trin der køres når cookie-genoprettelse ikke autentificerer siden |

## Trintyper

- **navigate** – Gå til URL
- **refresh** – Genindlæs den aktuelle side (valgfrit trin `timeout` i ms for genindlæsningsnavigationen)
- **click** – Klik på element via selector
- **type** – Indtast tekst i input (tegn-for-tegn)
- **fill** – Udfyld inputværdi
- **wait** – Vent på en timeout (ms)
- **screenshot** – Tag screenshot (`outputKey` gemmer base64 i resultater)
- **getText** – Tekstindhold af et element (`selector`, valgfri `outputKey`)
- **getAttribute** – Attributværdi (`selector`, `attribute`, valgfri `outputKey`)
- **getHTML** – Ydre HTML af et element (`selector`, valgfri `outputKey`)
- **getVisibleTextOnPage** – Fuld sidetekst som `document.body.innerText` (ingen selector; brug `outputKey`; valgfrit trin `timeout` i ms venter før indfangning)
- **hover** – Hold musen over element
- **selectOption** – Vælg option i en `<select>`
- **scrollDown** / **scrollUp** – Musescroll (valgfri `amount` i pixels)
- **aiStep** – LLM returnerer samme slags handlinger som manuelle trin (se nedenfor); nested `aiStep` understøttes ikke

## Deaktivering af et trin

Hvert trin har en tænd/sluk-knap i sin header. Et deaktiveret trin vises gennemstreget og dæmpet, forbliver på listen med alle sine felter, og springes over når noden kører — nyttigt til at isolere en fejlende selector uden at slette arbejde. Det gemte trin indeholder `disabled: true`; trin uden flagget kører normalt.

Deaktiverede trin er usynlige for resten af noden: de opfylder ikke "første trin skal være `navigate`"-reglen for auth-bootstrap, en deaktiveret `aiStep` foretager intet LLM-kald, og deaktiverede poster i `playwrightAuthFallbackSteps` springes også over. Hvis alle trin slukkes, fejler kørslen med en besked om at aktivere mindst et.

## AI-trin

**aiStep**-handlingen bruger en LLM til at analysere sidens HTML (og valgfrit et screenshot) og generere Playwright-handlinger fra naturligsprogsinstruktioner. API'en accepterer samme handlingsnavne som manuelle trin (inklusive `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, scrolls osv.). **Auto heal** erstatter kun fejlende selector-baserede trin med alternativer for click, type, fill, hover og selectOption.

| Indstilling | Beskrivelse |
|--------|-------------|
| `instructions` | Hvad AI'en skal gøre (f.eks. "Klik på Login-knappen") |
| `credentialId` | LLM-legitimationsoplysninger (OpenAI, Google eller Custom) |
| `model` | Søgbare liste af modeller fra den valgte LLM-legitimationsoplysning |
| `saveStepsForFuture` | Cache genererede trin til næste kørsler (undgår LLM-kald) |
| `sendScreenshot` | Send screenshot til LLM for visuelle elementer |
| `aiStepTimeout` | Timeout for LLM-kald i ms (standard 30000) |

### AI Auto Heal

**AI Auto Heal** gør workflows robuste over for DOM-ændringer. Når en selector fejler to gange (f.eks. efter en sideomdesign), kalder Heym LLM'en for at finde en alternativ locator — typisk `role=button[name='Submit']` eller `text=Exakt tekst` i stedet for CSS-selectors.

Aktivér **Auto heal mode** i AI-trinets egenskaber. Hvis det gemte trin fejler:

1. Heym indfanger den aktuelle HTML og screenshot
2. Sender det fejlende trin + sidekontekst til LLM'en
3. LLM returnerer en robust alternativ (role-baseret locator, tekstlocator eller fallback-CSS)
4. Prøver igen med den nye selector

Dette reducerer ustabilitet når sider opdaterer deres markup eller klasse-navne.
## Reducer automationsflag

Aktivér **Reducer automationsflag** (`playwrightStealth: true`), når en hjemmeside behandler Playwrights indbyggede Chromium som en bot på grund af standardautomationssignaler (`HeadlessChrome` i user agent, `navigator.webdriver`, manglende `window.chrome`).

Denne indstilling gælder kun i **Steps**-tilstand. Den:

- Fjerner Chromiums `--enable-automation`-flag og sætter `--disable-blink-features=AutomationControlled`
- Sender en standard Chrome user agent (uden `HeadlessChrome`)
- Gendanner almindelige browserflader, som Playwright efterlader tomme (`window.chrome`, plugins)
- Beholder GPU-renderingsværten uændret, når en GPU er tilgængelig (lokal macOS/Windows). Linux/Docker har ingen GPU; Chromiums software-renderer rapporteres som en typisk Mali (ARM) eller Mesa (x86) GPU i stedet for SwiftShader.

Dette skjuler ikke, at sessionen kører over Chrome DevTools Protocol, og det er ikke en måde at omgå hjemmesidesikkerhed, CAPTCHAs eller adgangskontrol på. Anvend det til workflows, som der er autorisation til at køre - interne værktøjer, egne hjemmesider og tilladt browserautomatisering.

Run Code-tilstand forbliver uændret - brugerdefinerede scripts starter Chromium selv.

## Netværksfangst

Aktivér `playwrightCaptureNetwork` for at indsamle ekstra fejlsøgningsdata under kørslen:

- `networkRequests` - Fangede JSON/API-svar
- `cookies` - Browser-cookies ved afslutning af kørslen
- `localStorage` - Browserens `localStorage` nøgle-værdi-par
- `sessionStorage` - Browserens `sessionStorage` nøgle-værdi-par

Dette er nyttigt, når der er behov for at inspicere skjulte API-kald, autentificeringstilstand eller browserdata efter en automatiseret flow.

## Cookie-bootstrap og login-fallback

Aktivér `playwrightAuthEnabled`, når der ønskes at åbne en side, der allerede er logget ind.

### Autentificeringstilstandskilde

Sæt `playwrightAuthStateExpression` til et udtryk som `$global.authState`. Værdien kan være:

- Et Playwright `storageState`-objekt: `{"cookies": [...], "origins": [...]}`
- En rå `cookies[]`-array
- En JSON-streng, der indeholder en af ovenstående strukturer

Anbefalet mønster:

1. Kør en Playwright-node med netværksfangst eller auth-bootstrap aktiveret
2. Gem `$playwrightNode.cookies` eller et fuldt auth-state-objekt i en [Global Variabel](../reference/global-variables.md)
3. Genbrug variablen i senere Playwright-noder via `$global.authState`

### Autentificeringskontrol

Det første hovedtrin i Playwright skal være `navigate`. Efter at trinet er indlæst, kontrollerer Heym `playwrightAuthCheckSelector`.

- Hvis selectoren er synlig, fortsætter de resterende hovedtrin normalt
- Hvis selectoren mangler, kører Heym `playwrightAuthFallbackSteps`
- Efter fallback-trin er gennemført, kontrolleres selectoren igen
- Hvis selectoren stadig mangler, fejler noden med en auth-bootstrap-fejl

Fallback-trin tager kontrol over navigationen efter autentificeringsfejl. De bør efterlade browseren på den autentificerede side, som forventes af resten af hovedflowet.

## Outputfelter

- `$playwrightNode.status` - `"ok"` ved succes
- `$playwrightNode.results` - Trinoutputs (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot-nøgler osv.)
- `$playwrightNode.screenshot` - Base64-screenshot, når et trin gemmer et
- `$playwrightNode.cookies` - Endelige browser-cookies, når auth-bootstrap eller netværksfangst er aktiveret
- `$playwrightNode.networkRequests` - Fangede netværkssvar (når aktiveret)
- `$playwrightNode.localStorage` - Browserens local storage (når aktiveret)
- `$playwrightNode.sessionStorage` - Browserens session storage (når aktiveret)

## Eksempel

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

## Run Code-tilstand

I egenskabspanellet skal **Mode** sættes til **Run Code** for at redigere `playwrightCode` i stedet for visuelle trin. Auth-bootstrap gælder kun for Steps-tilstand.

Eksempel (sandkasse / Docker - Chromium kræver `--no-sandbox`):

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

Wrapperen leverer `inputs`, `headless`, `timeout_ms` og `capture_network`. Det er muligt at indlejre `$nodeLabel.field`-udtryk i koden; print JSON med `status` og `results`.
## Sikkerhed for brugerdefineret kode

Feltet `playwrightCode` kører vilkårlig Python-kode. Da dette svarer til kodeudførelse, er det **deaktiveret som standard** og, når aktiveret, kører det i en sandkasse:

- **Deaktiveret som standard.** Udførelsen af en node med `playwrightCode` konfigureret fejler med en klar fejlmeddelelse, medmindre en operatør sætter `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Tjekket udføres ved kørselstidspunktet, hvilket også dækker tidligere gemte workflows og planlagte / underordnede workflow-kørsler.
- **Isoleret ved aktivering.** Brugerdefineret kode kører ikke i backend-processen. Den kører i en hærdet, engangs-container uden Docker-socket, uden backend-bindemonteringer, uden backend-hemmeligheder i dens miljø, med reducerede kapabiliteter, `no-new-privileges`, og CPU / hukommelse / PID-begrænsninger. Hvis Docker ikke er tilgængelig, fejler kørslen på en sikker måde. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` vælger tilbage til den in-proces-vej kun til brug i tillids- eller lokale udviklingsmiljøer (ikke en sikkerhedsgrænse). Den native `./run.sh` bruger som standard `subprocess`, når ingen `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` er angivet. `./deploy.sh` (Compose) og GHCR-enkeltbilledet løser den underordnede kører via `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (med tilbagefald til `HEYM_CODEX_DOCKER_IMAGE`) og bruger den matchende venv-sti (`/app/.venv` vs `/app/backend/.venv`).
- **Chromium-bemærkning.** Sandkasse-containeren kører som standard som root, og Chromium nægter at køre som root uden `--no-sandbox`. Brugerdefineret kode, der starter Chromium, bør inkludere dette, f.eks. `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Trinbaserede (og stealth) start inkluderer også `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, så fingerprint-scripts ikke kan åbne STUN UDP til `stun.l.google.com:19302`. Brugerdefinerede `chromium.launch`-kald bør også inkludere dette flag.

Trinbaserede Playwright-noder (`playwrightSteps`) genereres fuldstændigt af Heym (uden vilkårlig kode), er upåvirkede af alt ovenstående og er altid tilgængelige — disse bør foretrækkes.

## Relateret

- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [Crawler-node](./crawler-node.md) – Simpel webscraping med FlareSolverr
- [Deling af legitimationsoplysninger](../reference/credentials-sharing.md) – LLM-legitimationsoplysninger til AI-trin
