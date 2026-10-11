# Playwright

De **Playwright**-node automatiseert browserinteracties met configureerbare stappen. Gebruik deze voor webscraping, het invullen van formulieren en browsergebaseerde workflows.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.results`, `$nodeLabel.screenshot` en optionele netwerk-/browsergegevens |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (standaard) of `"code"` (Code uitvoeren). Kies dit in de vervolgkeuzelijst Modus van het Eigenschappenpaneel |
| `playwrightSteps` | array | Stappen: navigate, click, type, aiStep, enz. Elke stap heeft een actie en selector/params. `disabled: true` houdt een stap in de lijst maar slaat deze tijdens de uitvoering over |
| `playwrightCode` | string | Aangepaste Playwright Python die wordt gebruikt wanneer Modus is ingesteld op Code uitvoeren. Draait in de geharde sandbox en is **standaard uitgeschakeld** — zie de beveiligingsopmerking hieronder |
| `playwrightHeadless` | boolean | Uitvoeren zonder venster (standaard: true) |
| `playwrightStealth` | boolean | Opt-in instelling voor de modus Stappen die veelvoorkomende Playwright-automatiseringssignalen vermindert (standaard: false). Label in het Eigenschappenpaneel: Automatiseringsmarkeringen verminderen |
| `playwrightTimeout` | number | Time-out in ms (standaard: 30000) |
| `playwrightCaptureNetwork` | boolean | JSON-responses, headers, cookies en browseropslag vastleggen |
| `playwrightAuthEnabled` | boolean | Browserauthenticatie herstellen vanuit cookies/storageState voordat de stappen worden uitgevoerd |
| `playwrightAuthStateExpression` | string | Expressie of JSON die resulteert in Playwright `storageState` of ruwe `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selector die zichtbaar moet zijn na de authenticatie-bootstrap |
| `playwrightAuthCheckTimeout` | number | Time-out in ms voor de controle van de geauthenticeerde selector (standaard: 5000) |
| `playwrightAuthFallbackSteps` | array | Fallback-stappen voor alleen inloggen die worden uitgevoerd wanneer het herstellen van cookies de pagina niet authenticeert |

## Staptypen

- **navigate** – Ga naar URL
- **refresh** – Herlaad de huidige pagina (optionele stap `timeout` in ms voor de herlaadnavigatie)
- **click** – Klik op een element via selector
- **type** – Typ tekst in een invoerveld (teken voor teken)
- **fill** – Vul de invoerwaarde in
- **wait** – Wacht een time-out af (ms)
- **screenshot** – Maak een schermafbeelding (`outputKey` slaat base64 op in results)
- **getText** – Tekstinhoud van een element (`selector`, optionele `outputKey`)
- **getAttribute** – Attribuutwaarde (`selector`, `attribute`, optionele `outputKey`)
- **getHTML** – Buitenste HTML van een element (`selector`, optionele `outputKey`)
- **getVisibleTextOnPage** – Volledige zichtbare paginatekst als `document.body.innerText` (geen selector; gebruik `outputKey`; optionele stap `timeout` in ms wacht voor het vastleggen)
- **hover** – Zweef over een element
- **selectOption** – Selecteer een optie in een `<select>`
- **scrollDown** / **scrollUp** – Scrollen met het muiswiel (optionele `amount` in pixels)
- **aiStep** – LLM retourneert dezelfde soorten acties als handmatige stappen (zie hieronder); geneste `aiStep` wordt niet ondersteund

## Een stap uitschakelen

Elke stap heeft een aan/uit-schakelaar in de kop. Een uitgeschakelde stap toont de titel doorgestreept en gedimd, blijft met al zijn velden in de lijst staan en wordt overgeslagen wanneer de node wordt uitgevoerd — handig om een falende selector te isoleren zonder werk te verwijderen. De opgeslagen stap bevat `disabled: true`; stappen zonder deze markering worden normaal uitgevoerd.

Uitgeschakelde stappen zijn onzichtbaar voor de rest van de node: ze voldoen niet aan de regel "de eerste stap moet `navigate` zijn" van de authenticatie-bootstrap, een uitgeschakelde `aiStep` doet geen LLM-aanroep, en uitgeschakelde items in `playwrightAuthFallbackSteps` worden eveneens overgeslagen. Als alle stappen worden uitgeschakeld, mislukt de uitvoering met een bericht waarin u wordt gevraagd er één in te schakelen.

## AI-stap

De actie **aiStep** gebruikt een LLM om de HTML van de pagina (en optioneel een schermafbeelding) te analyseren en Playwright-acties te genereren op basis van instructies in natuurlijke taal. De API accepteert dezelfde actienamen als handmatige stappen (waaronder `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, scrolls, enz.). **Auto heal** vervangt alleen mislukte selector-gebaseerde stappen door alternatieven voor click, type, fill, hover en selectOption.

| Optie | Beschrijving |
|--------|-------------|
| `instructions` | Wat de AI moet doen (bijv. "Klik op de knop Inloggen") |
| `credentialId` | LLM-referentie (OpenAI, Google of Aangepast) |
| `model` | Doorzoekbare lijst met modellen van de geselecteerde LLM-referentie |
| `saveStepsForFuture` | Gegenereerde stappen cachen voor volgende uitvoeringen (voorkomt LLM-aanroep) |
| `sendScreenshot` | Schermafbeelding naar de LLM sturen voor visuele elementen |
| `aiStepTimeout` | Time-out voor LLM-aanroep in ms (standaard: 30000) |

### AI Auto Heal

**AI Auto Heal** maakt workflows veerkrachtig tegen DOM-wijzigingen. Wanneer een selector twee keer mislukt (bijv. na een herontwerp van een site), roept Heym de LLM aan om een alternatieve locator te vinden — doorgaans `role=button[name='Submit']` of `text=Exact text` in plaats van CSS-selectors.

Schakel **Auto heal-modus** in bij de eigenschappen van de AI-stap. Als de opgeslagen stap mislukt:

1. Heym legt de huidige HTML en schermafbeelding vast
2. Stuurt de mislukte stap + paginacontext naar de LLM
3. De LLM retourneert een robuust alternatief (op rollen gebaseerde locator, tekstlocator of fallback-CSS)
4. Probeert opnieuw met de nieuwe selector

Dit vermindert instabiliteit wanneer sites hun markup of classnamen bijwerken.
## Automatiseringsmarkeringen beperken

Schakel **Automatiseringsmarkeringen beperken** (`playwrightStealth: true`) in wanneer een site de meegeleverde Chromium van Playwright als een bot behandelt vanwege standaard automatiseringssignalen (`HeadlessChrome` in de user agent, `navigator.webdriver`, ontbrekend `window.chrome`).

Deze optie is alleen van toepassing in de modus **Stappen**. Deze:

- Verwijdert Chromium's `--enable-automation`-markering en stelt `--disable-blink-features=AutomationControlled` in
- Verzendt een standaard Chrome user agent (zonder `HeadlessChrome`)
- Herstelt gangbare browseroppervlakken die Playwright leeg laat (`window.chrome`, plugins)
- Laat de GPU-renderer van de host ongewijzigd wanneer een GPU beschikbaar is (lokale macOS/Windows). Linux/Docker heeft geen GPU; de software-rendererstring van Chromium wordt gerapporteerd als een typische Mali (ARM) of Mesa (x86) GPU in plaats van SwiftShader.

Het verbergt niet dat de sessie via het Chrome DevTools Protocol wordt aangestuurd, en het is geen manier om sitebeveiliging, CAPTCHA's of toegangscontroles te omzeilen. Gebruik het voor workflows die u bevoegd bent uit te voeren — interne tools, uw eigen sites en toegestane browserautomatisering.

De modus Code uitvoeren blijft ongewijzigd — aangepaste scripts starten Chromium zelf.

## Netwerkopname

Schakel `playwrightCaptureNetwork` in om extra foutopsporingsgegevens tijdens de uitvoering te verzamelen:

- `networkRequests` – Vastgelegde JSON/API-responses
- `cookies` – Browsercookies aan het einde van de uitvoering
- `localStorage` – Browser `localStorage` sleutel-waardeparen
- `sessionStorage` – Browser `sessionStorage` sleutel-waardeparen

Dit is nuttig wanneer u verborgen API-aanroepen, auth-status of browserzijdige gegevens na een geautomatiseerde flow wilt inspecteren.

## Cookie-bootstrap en inlog-fallback

Schakel `playwrightAuthEnabled` in wanneer u wilt dat Playwright een pagina opent waarin al is ingelogd.

### Bron van auth-status

Stel `playwrightAuthStateExpression` in op een expressie zoals `$global.authState`. De waarde kan zijn:

- Een Playwright `storageState`-object: `{"cookies": [...], "origins": [...]}`
- Een onbewerkte `cookies[]`-array
- Een JSON-string met een van beide vormen

Aanbevolen patroon:

1. Voer een Playwright-node uit met netwerkopname of auth-bootstrap ingeschakeld
2. Sla `$playwrightNode.cookies` of een volledig auth-statusobject op in een [Globale variabele](../reference/global-variables.md)
3. Hergebruik die variabele in latere Playwright-nodes via `$global.authState`

### Auth-controle

De eerste hoofdstap van Playwright moet `navigate` zijn. Nadat die stap is geladen, controleert Heym `playwrightAuthCheckSelector`.

- Als de selector zichtbaar is, worden de resterende hoofdstappen normaal voortgezet
- Als de selector ontbreekt, voert Heym `playwrightAuthFallbackSteps` uit
- Nadat de fallback-stappen zijn voltooid, controleert Heym dezelfde selector opnieuw
- Als de selector nog steeds ontbreekt, mislukt de node met een auth-bootstrap-fout

Fallback-stappen zijn verantwoordelijk voor navigatie na een auth-fout. Ze moeten de browser achterlaten op de geauthenticeerde pagina die door de rest van de hoofdflow wordt verwacht.

## Uitvoervelden

- `$playwrightNode.status` – `"ok"` bij succes
- `$playwrightNode.results` – Stapuitvoer (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot-sleutels, enz.)
- `$playwrightNode.screenshot` – Base64-screenshot wanneer een stap er een opslaat
- `$playwrightNode.cookies` – Definitieve browsercookies wanneer auth-bootstrap of netwerkopname is ingeschakeld
- `$playwrightNode.networkRequests` – Vastgelegde netwerkresponses (indien ingeschakeld)
- `$playwrightNode.localStorage` – Browser local storage (indien ingeschakeld)
- `$playwrightNode.sessionStorage` – Browser session storage (indien ingeschakeld)

## Voorbeeld

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

## Modus Code uitvoeren

Stel in het Eigenschappenpaneel **Modus** in op **Code uitvoeren** om `playwrightCode` te bewerken in plaats van visuele stappen. Auth-bootstrap is alleen van toepassing op de modus Stappen.

Voorbeeld (sandbox / Docker — Chromium heeft `--no-sandbox` nodig):

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

De wrapper biedt `inputs`, `headless`, `timeout_ms` en `capture_network`. U kunt `$nodeLabel.field`-expressies in de code opnemen; druk JSON af met `status` en `results`.
## Beveiliging van aangepaste code

Het veld `playwrightCode` voert willekeurige Python uit. Omdat dit gelijkstaat aan code-uitvoering, is het **standaard uitgeschakeld** en, wanneer ingeschakeld, draait het in een sandbox:

- **Standaard uitgeschakeld.** Het uitvoeren van een node waarin `playwrightCode` is ingesteld, mislukt met een duidelijke foutmelding, tenzij een beheerder `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` instelt. De controle vindt plaats op het moment van uitvoering, zodat ook eerder opgeslagen workflows en geplande / sub-workflow-uitvoeringen hieronder vallen.
- **Geïsoleerd wanneer ingeschakeld.** Aangepaste code draait niet in het backend-proces. Deze draait in een geharde, wegwerpbare zustercontainer zonder Docker-socket, zonder backend bind mounts, zonder backend-secrets in de omgeving, met ingetrokken capabilities, `no-new-privileges` en CPU- / geheugen- / PID-limieten. Als Docker niet beschikbaar is, mislukt de uitvoering veilig (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` schakelt terug naar het in-process-pad, uitsluitend voor vertrouwd of lokaal ontwikkelgebruik (geen beveiligingsgrens). De native `./run.sh` gebruikt standaard `subprocess` wanneer geen `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` is ingesteld. `./deploy.sh` (Compose) en de GHCR single image vinden de zuster-runner via `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (met terugval op `HEYM_CODEX_DOCKER_IMAGE`) en gebruiken het bijbehorende venv-pad (`/app/.venv` versus `/app/backend/.venv`).
- **Chromium-opmerking.** De sandbox-container draait standaard als root, en Chromium weigert als root te draaien zonder `--no-sandbox`. Aangepaste code die Chromium start, dient deze door te geven, bijvoorbeeld `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Op stappen gebaseerde (en stealth-)starts geven ook `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` door, zodat fingerprint-scripts geen STUN UDP kunnen openen naar `stun.l.google.com:19302`. Aangepaste `chromium.launch`-aanroepen dienen die flag eveneens op te nemen.

Op stappen gebaseerde Playwright-nodes (`playwrightSteps`) worden volledig door Heym gegenereerd (geen willekeurige code), zijn niet onderhevig aan al het bovenstaande en zijn altijd beschikbaar — geef hier de voorkeur aan.

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Crawler Node](./crawler-node.md) – Eenvoudiger webscraping met FlareSolverr
- [Credentials Sharing](../reference/credentials-sharing.md) – LLM-referenties voor AI-stappen
