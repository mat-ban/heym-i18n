# Playwright

**Playwright**-noden automatiserar webbläsarinteraktioner med konfigurerbara steg. Den används för webbskrapning, formulärifyllning och webbläsarbaserade Workflows.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.results`, `$nodeLabel.screenshot` samt valfri nätverks-/webbläsardata |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `playwrightMode` | string | `"steps"` (standard) eller `"code"` (Run Code). Väljs i rullgardinsmenyn Mode i egenskapspanelen |
| `playwrightSteps` | array | Steg: navigate, click, type, aiStep m.fl. Varje steg har action och selector/params. `disabled: true` behåller ett steg i listan men hoppar över det vid körning |
| `playwrightCode` | string | Anpassad Playwright Python som används när Mode är Run Code. Körs i den härdade sandlådan och är **inaktiverad som standard** — se säkerhetsnotisen nedan |
| `playwrightHeadless` | boolean | Kör headless (standard: true) |
| `playwrightStealth` | boolean | Opt-in-inställning för Steps-läget som minskar vanliga Playwright-automatiseringssignaler (standard: false). Etikett i egenskapspanelen: Reduce automation flags |
| `playwrightTimeout` | number | Timeout i ms (standard: 30000) |
| `playwrightCaptureNetwork` | boolean | Fånga JSON-svar, headers, cookies och webbläsarlagring |
| `playwrightAuthEnabled` | boolean | Återställ webbläsarautentisering från cookies/storageState innan stegen körs |
| `playwrightAuthStateExpression` | string | Uttryck eller JSON som löses upp till Playwright `storageState` eller rå `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selector som måste vara synlig efter autentiseringsbootstrap |
| `playwrightAuthCheckTimeout` | number | Timeout i ms för kontrollen av den autentiserade selectorn (standard: 5000) |
| `playwrightAuthFallbackSteps` | array | Reservsteg endast för inloggning som körs när cookie-återställning inte autentiserar sidan |

## Stegtyper

- **navigate** – Gå till URL
- **refresh** – Ladda om aktuell sida (valfritt steg `timeout` i ms för omladdningens navigering)
- **click** – Klicka på element via selector
- **type** – Skriv text i inmatningsfält (tecken för tecken)
- **fill** – Fyll i inmatningsvärde
- **wait** – Vänta en timeout (ms)
- **screenshot** – Ta skärmbild (`outputKey` lagrar base64 i results)
- **getText** – Textinnehåll i ett element (`selector`, valfritt `outputKey`)
- **getAttribute** – Attributvärde (`selector`, `attribute`, valfritt `outputKey`)
- **getHTML** – Outer HTML för ett element (`selector`, valfritt `outputKey`)
- **getVisibleTextOnPage** – Hela sidans synliga text som `document.body.innerText` (ingen selector; använd `outputKey`; valfritt steg `timeout` i ms väntar innan fångst)
- **hover** – Hovra över element
- **selectOption** – Välj alternativ i en `<select>`
- **scrollDown** / **scrollUp** – Mushjulsrullning (valfritt `amount` i pixlar)
- **aiStep** – LLM returnerar samma typer av åtgärder som manuella steg (se nedan); nästlad `aiStep` stöds inte

## Stänga av ett steg

Varje steg har en strömbrytare i sin rubrik. Ett avstängt steg visas med överstruken och nedtonad titel, finns kvar i listan med alla sina fält och hoppas över när noden körs — användbart för att isolera en felande selector utan att radera arbete. Det sparade steget har `disabled: true`; steg utan flaggan körs normalt.

Inaktiverade steg är osynliga för resten av noden: de uppfyller inte regeln att "första steget måste vara `navigate`" vid autentiseringsbootstrap, ett inaktiverat `aiStep` gör inget LLM-anrop, och inaktiverade poster i `playwrightAuthFallbackSteps` hoppas också över. Om alla steg stängs av misslyckas körningen med ett meddelande om att aktivera minst ett.

## AI-steg

Åtgärden **aiStep** använder en LLM för att analysera sidans HTML (och valfritt en skärmbild) och generera Playwright-åtgärder från instruktioner i naturligt språk. API:et accepterar samma åtgärdsnamn som manuella steg (inklusive `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, rullningar m.fl.). **Auto heal** ersätter endast misslyckade selector-baserade steg med alternativ för click, type, fill, hover och selectOption.

| Alternativ | Beskrivning |
|------------|-------------|
| `instructions` | Vad AI:n ska göra (t.ex. "Click the Login button") |
| `credentialId` | LLM-autentiseringsuppgift (OpenAI, Google eller Custom) |
| `model` | Sökbar lista över modeller från den valda LLM-autentiseringsuppgiften |
| `saveStepsForFuture` | Cachelagra genererade steg för framtida körningar (undviker LLM-anrop) |
| `sendScreenshot` | Skicka skärmbild till LLM för visuella element |
| `aiStepTimeout` | Timeout för LLM-anrop i ms (standard 30000) |

### AI Auto Heal

**AI Auto Heal** gör Workflows motståndskraftiga mot DOM-ändringar. När en selector misslyckas två gånger (t.ex. efter en omdesign av en webbplats) anropar Heym LLM:en för att hitta en alternativ locator—vanligtvis `role=button[name='Submit']` eller `text=Exact text` i stället för CSS-selectors.

Aktivera **Auto heal mode** i AI-stegets egenskaper. Om det sparade steget misslyckas:

1. Heym fångar aktuell HTML och skärmbild
2. Skickar det misslyckade steget + sidkontext till LLM:en
3. LLM:en returnerar ett robust alternativ (rollbaserad locator, textlocator eller reserv-CSS)
4. Försöker igen med den nya selectorn

Detta minskar instabilitet när webbplatser uppdaterar sin markup eller sina klassnamn.
## Minska automationflaggor

Aktivera **Minska automationflaggor** (`playwrightStealth: true`) när en webbplats behandlar Playwrights medföljande Chromium som en bot på grund av standardiserade automationssignaler (`HeadlessChrome` i user agent, `navigator.webdriver`, saknad `window.chrome`).

Detta alternativ gäller endast i läget **Steps**. Det:

- Tar bort Chromiums flagga `--enable-automation` och anger `--disable-blink-features=AutomationControlled`
- Skickar en standardiserad Chrome user agent (utan `HeadlessChrome`)
- Återställer vanliga webbläsarytor som Playwright lämnar tomma (`window.chrome`, plugins)
- Lämnar värdens GPU-renderare oförändrad när en GPU är tillgänglig (lokal macOS/Windows). Linux/Docker har ingen GPU; Chromiums mjukvarurenderarsträng rapporteras som en typisk Mali (ARM)- eller Mesa (x86)-GPU istället för SwiftShader.

Det döljer inte att sessionen styrs över Chrome DevTools Protocol, och det är inte ett sätt att kringgå webbplatsens säkerhet, CAPTCHA eller åtkomstkontroller. Använd det för workflows som man är auktoriserad att köra — interna verktyg, egna webbplatser och tillåten webbläsarautomatisering.

Läget Run Code är oförändrat — anpassade skript startar Chromium själva.

## Network Capture

Aktivera `playwrightCaptureNetwork` för att samla in extra felsökningsdata under körningen:

- `networkRequests` – Insamlade JSON/API-svar
- `cookies` – Webbläsarcookies vid körningens slut
- `localStorage` – Webbläsarens `localStorage`-nyckelvärdepar
- `sessionStorage` – Webbläsarens `sessionStorage`-nyckelvärdepar

Detta är användbart när inspektion av dolda API-anrop, autentiseringstillstånd eller webbläsarsidans data behövs efter ett automatiserat flöde.

## Cookie Bootstrap och inloggningsfallback

Aktivera `playwrightAuthEnabled` när Playwright ska öppna en sida som redan är inloggad.

### Källa för autentiseringstillstånd

Ange `playwrightAuthStateExpression` till ett uttryck som `$global.authState`. Värdet kan vara:

- Ett Playwright-`storageState`-objekt: `{"cookies": [...], "origins": [...]}`
- En rå `cookies[]`-array
- En JSON-sträng som innehåller endera formen

Rekommenderat mönster:

1. Kör en Playwright-nod med network capture eller auth bootstrap aktiverat
2. Lagra `$playwrightNode.cookies` eller ett fullständigt autentiseringstillståndsobjekt i en [Global Variable](../reference/global-variables.md)
3. Återanvänd den variabeln i senare Playwright-noder via `$global.authState`

### Autentiseringskontroll

Det första huvudsteget i Playwright måste vara `navigate`. Efter att det steget har laddats kontrollerar Heym `playwrightAuthCheckSelector`.

- Om selektorn är synlig fortsätter de återstående huvudstegen normalt
- Om selektorn saknas kör Heym `playwrightAuthFallbackSteps`
- Efter att fallback-stegen har slutförts kontrollerar Heym samma selektor igen
- Om selektorn fortfarande saknas misslyckas noden med ett auth bootstrap-fel

Fallback-steg ansvarar för navigering efter autentiseringsfel. De bör lämna webbläsaren på den autentiserade sida som resten av huvudflödet förväntar sig.

## Utdatafält

- `$playwrightNode.status` – `"ok"` vid lyckad körning
- `$playwrightNode.results` – Stegutdata (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot-nycklar etc.)
- `$playwrightNode.screenshot` – Base64-screenshot när ett steg sparar en sådan
- `$playwrightNode.cookies` – Slutliga webbläsarcookies när auth bootstrap eller network capture är aktiverat
- `$playwrightNode.networkRequests` – Insamlade nätverkssvar (när aktiverat)
- `$playwrightNode.localStorage` – Webbläsarens local storage (när aktiverat)
- `$playwrightNode.sessionStorage` – Webbläsarens session storage (när aktiverat)

## Exempel

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

## Läget Run Code

I egenskapspanelen ställs **Mode** in på **Run Code** för att redigera `playwrightCode` istället för visuella steg. Auth bootstrap gäller endast i läget Steps.

Exempel (sandbox / Docker — Chromium behöver `--no-sandbox`):

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

Wrappern tillhandahåller `inputs`, `headless`, `timeout_ms` och `capture_network`. Uttryck av typen `$nodeLabel.field` kan bäddas in i koden; skriv ut JSON med `status` och `results`.
## Säkerhet för anpassad kod

Fältet `playwrightCode` kör godtycklig Python. Eftersom detta motsvarar kodkörning är det **inaktiverat som standard** och, när det aktiveras, sandboxat:

- **Inaktiverat som standard.** Körning av en nod som har `playwrightCode` angivet misslyckas med ett tydligt felmeddelande om inte en operatör anger `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Kontrollen körs vid exekveringstillfället, vilket innebär att den även omfattar tidigare sparade workflows samt schemalagda körningar och körningar av underordnade workflows.
- **Isolerat när det är aktiverat.** Anpassad kod körs inte i backend-processen. Den körs i en härdad, tillfällig syskoncontainer utan Docker-socket, utan backend-bind-monteringar, utan backend-hemligheter i sin miljö, med borttagna behörigheter (capabilities), `no-new-privileges` samt CPU-, minnes- och PID-gränser. Om Docker inte är tillgängligt misslyckas körningen stängt (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` väljer tillbaka den processinterna sökvägen, endast för betrodd användning eller lokal utveckling (inte en säkerhetsgräns). Inbyggda `./run.sh` använder `subprocess` som standard när ingen `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` är angiven. `./deploy.sh` (Compose) och GHCR-single-imagen löser syskonrunnern via `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (med fallback till `HEYM_CODEX_DOCKER_IMAGE`) och använder matchande venv-sökväg (`/app/.venv` kontra `/app/backend/.venv`).
- **Notering om Chromium.** Sandbox-containern körs som root som standard, och Chromium vägrar köra som root utan `--no-sandbox`. Anpassad kod som startar Chromium bör ange den flaggan, till exempel `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Steg-baserade (och stealth-) starter anger även `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` så att fingeravtrycksskript inte kan öppna STUN UDP mot `stun.l.google.com:19302`. Anpassade `chromium.launch`-anrop bör också inkludera den flaggan.

Steg-baserade Playwright-noder (`playwrightSteps`) genereras helt av Heym (ingen godtycklig kod), påverkas inte av något av ovanstående och är alltid tillgängliga — dessa bör föredras.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Crawler-nod](./crawler-node.md) – Enklare webbskrapning med FlareSolverr
- [Delning av autentiseringsuppgifter](../reference/credentials-sharing.md) – LLM-autentiseringsuppgifter för AI-steg
