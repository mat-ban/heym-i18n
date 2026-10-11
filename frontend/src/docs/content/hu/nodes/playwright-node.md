# Playwright

A **Playwright** csomópont konfigurálható lépésekkel automatizálja a böngészőinterakciókat. Web scrapinghez, űrlapkitöltéshez és böngészőalapú workflow-khoz használható.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.results`, `$nodeLabel.screenshot`, valamint opcionális hálózati/böngészőadatok |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (alapértelmezett) vagy `"code"` (Run Code). A Properties Panel Mode legördülő menüjében választható ki |
| `playwrightSteps` | array | Lépések: navigate, click, type, aiStep stb. Minden lépéshez tartozik action és selector/params. A `disabled: true` a listában hagyja a lépést, de futásidőben kihagyja |
| `playwrightCode` | string | Egyedi Playwright Python, amely akkor fut, ha a Mode értéke Run Code. A megerősített sandboxban fut, és **alapértelmezés szerint le van tiltva** — lásd az alábbi biztonsági megjegyzést |
| `playwrightHeadless` | boolean | Fej nélküli futtatás (alapértelmezett: true) |
| `playwrightStealth` | boolean | Opt-in Steps-mód beállítás, amely csökkenti a gyakori Playwright automatizálási jeleket (alapértelmezett: false). Properties Panel címke: Reduce automation flags |
| `playwrightTimeout` | number | Timeout ms-ban (alapértelmezett: 30000) |
| `playwrightCaptureNetwork` | boolean | JSON válaszok, headerek, cookie-k és böngészőtárhely rögzítése |
| `playwrightAuthEnabled` | boolean | Böngészőhitelesítés visszaállítása cookie-kból/storageState-ből a lépések futtatása előtt |
| `playwrightAuthStateExpression` | string | Kifejezés vagy JSON, amely Playwright `storageState`-re vagy nyers `cookies[]`-re oldódik fel |
| `playwrightAuthCheckSelector` | string | Szelektor, amelynek láthatónak kell lennie a hitelesítési bootstrap után |
| `playwrightAuthCheckTimeout` | number | Timeout ms-ban a hitelesített szelektor ellenőrzéséhez (alapértelmezett: 5000) |
| `playwrightAuthFallbackSteps` | array | Csak bejelentkezésre szolgáló fallback lépések, amelyek akkor futnak, ha a cookie-visszaállítás nem hitelesíti az oldalt |

## Lépéstípusok

- **navigate** – Ugrás URL-re
- **refresh** – Az aktuális oldal újratöltése (opcionális lépés `timeout` ms-ban az újratöltési navigációhoz)
- **click** – Elem kattintása szelektor alapján
- **type** – Szöveg beírása bemenetbe (karakterenként)
- **fill** – Bemeneti érték kitöltése
- **wait** – Várakozás egy timeoutra (ms)
- **screenshot** – Képernyőkép rögzítése (`outputKey` a base64-et a results-ban tárolja)
- **getText** – Egy elem szöveges tartalma (`selector`, opcionális `outputKey`)
- **getAttribute** – Attribútumérték (`selector`, `attribute`, opcionális `outputKey`)
- **getHTML** – Egy elem külső HTML-je (`selector`, opcionális `outputKey`)
- **getVisibleTextOnPage** – A teljes oldal látható szövege `document.body.innerText` formában (nincs selector; használja az `outputKey`-t; opcionális lépés `timeout` ms-ban a rögzítés előtti várakozáshoz)
- **hover** – Elem fölé mozgatás
- **selectOption** – Opció kiválasztása egy `<select>`-ben
- **scrollDown** / **scrollUp** – Egérgörgős görgetés (opcionális `amount` pixelben)
- **aiStep** – Az LLM ugyanolyan típusú műveleteket ad vissza, mint a manuális lépések (lásd alább); a beágyazott `aiStep` nem támogatott

## Lépés kikapcsolása

Minden lépés fejlécében található egy be-/kikapcsoló gomb. A kikapcsolt lépés címe áthúzva és elhalványítva jelenik meg, az összes mezőjével együtt a listában marad, és a csomópont futtatásakor kimarad — ez hasznos egy hibás szelektor izolálásához anélkül, hogy törölni kellene a munkát. A tárolt lépés `disabled: true` értéket hordoz; a jelölő nélküli lépések normálisan futnak.

A letiltott lépések láthatatlanok a csomópont többi része számára: nem teljesítik a hitelesítési bootstrap „az első lépésnek `navigate`-nek kell lennie" szabályát, a letiltott `aiStep` nem hív LLM-et, és a `playwrightAuthFallbackSteps` letiltott elemei is kimaradnak. Ha minden lépést kikapcsol, a futtatás meghiúsul egy üzenettel, amely arra kéri Önt, hogy engedélyezzen legalább egyet.

## AI Step

Az **aiStep** művelet egy LLM-et használ az oldal HTML-jének (és opcionálisan egy képernyőképnek) az elemzéséhez, valamint ahhoz, hogy természetes nyelvű utasításokból Playwright műveleteket generáljon. Az API ugyanazokat a műveletneveket fogadja el, mint a manuális lépések (beleértve a `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, görgetések stb.). Az **Auto heal** csak a sikertelen szelektoralapú lépéseket helyettesíti alternatívákkal a click, type, fill, hover és selectOption esetében.

| Opció | Leírás |
|--------|-------------|
| `instructions` | Mit tegyen az AI (pl. „Kattintson a Login gombra") |
| `credentialId` | LLM hitelesítési adat (OpenAI, Google vagy Custom) |
| `model` | A kiválasztott LLM hitelesítési adatból származó modellek kereshető listája |
| `saveStepsForFuture` | A generált lépések gyorsítótárazása a következő futtatásokhoz (elkerüli az LLM hívást) |
| `sendScreenshot` | Képernyőkép küldése az LLM-nek vizuális elemekhez |
| `aiStepTimeout` | Az LLM hívás timeoutja ms-ban (alapértelmezett: 30000) |

### AI Auto Heal

Az **AI Auto Heal** ellenállóvá teszi a workflow-kat a DOM-változásokkal szemben. Amikor egy szelektor kétszer meghiúsul (pl. egy webhely újratervezése után), a Heym meghívja az LLM-et, hogy találjon egy alternatív lokátort — jellemzően `role=button[name='Submit']` vagy `text=Exact text` formában CSS szelektorok helyett.

Engedélyezze az **Auto heal mode** beállítást az AI step tulajdonságai között. Ha a mentett lépés meghiúsul:

1. A Heym rögzíti az aktuális HTML-t és képernyőképet
2. Elküldi a sikertelen lépést + az oldalkontextust az LLM-nek
3. Az LLM visszaad egy robusztus alternatívát (szerepalapú lokátor, szöveges lokátor vagy fallback CSS)
4. Újrapróbálkozik az új szelektorral

Ez csökkenti a törékenységet, amikor a webhelyek frissítik a markupjukat vagy az osztályneveiket.
## Automatizálási jelzők csökkentése

Engedélyezze az **Automatizálási jelzők csökkentése** (`playwrightStealth: true`) beállítást, ha egy webhely a Playwright beépített Chromiumját botként kezeli a szokásos automatizálási jelzések miatt (`HeadlessChrome` a user agentben, `navigator.webdriver`, hiányzó `window.chrome`).

Ez a beállítás kizárólag **Steps** módban érvényes. A következőket teszi:

- Eltávolítja a Chromium `--enable-automation` kapcsolóját, és beállítja a `--disable-blink-features=AutomationControlled` opciót
- Szabványos Chrome user agentet küld (nem tartalmaz `HeadlessChrome`-ot)
- Visszaállítja azokat a szokásos böngészőfelületeket, amelyeket a Playwright üresen hagy (`window.chrome`, bővítmények)
- Változatlanul hagyja a hoszt GPU renderelőjét, ha GPU elérhető (helyi macOS/Windows). Linux/Docker esetén nincs GPU; a Chromium szoftveres renderelő karakterlánca egy tipikus Mali (ARM) vagy Mesa (x86) GPU-ként jelenik meg a SwiftShader helyett.

Nem rejti el, hogy a munkamenet Chrome DevTools Protocolon keresztül vezérelt, és nem alkalmas a webhely biztonsági mechanizmusainak, CAPTCHA-inak vagy hozzáférés-vezérléseinek megkerülésére. Olyan workflow-khoz használja, amelyek futtatására Ön jogosult — belső eszközök, saját webhelyek és engedélyezett böngészőautomatizálás.

A Run Code mód változatlan — az egyedi szkriptek maguk indítják el a Chromiumot.

## Hálózati rögzítés

Engedélyezze a `playwrightCaptureNetwork` beállítást további hibakeresési adatok gyűjtéséhez a futtatás során:

- `networkRequests` – Rögzített JSON/API válaszok
- `cookies` – Böngésző cookie-k a futtatás végén
- `localStorage` – Böngésző `localStorage` kulcs-érték párok
- `sessionStorage` – Böngésző `sessionStorage` kulcs-érték párok

Ez akkor hasznos, ha egy automatizált folyamat után rejtett API-hívásokat, hitelesítési állapotot vagy böngészőoldali adatokat kell megvizsgálnia.

## Cookie bootstrap és bejelentkezési tartalék

Engedélyezze a `playwrightAuthEnabled` beállítást, ha azt szeretné, hogy a Playwright már bejelentkezve nyisson meg egy oldalt.

### Hitelesítési állapot forrása

Állítsa a `playwrightAuthStateExpression` értékét egy kifejezésre, például `$global.authState`. Az érték a következő lehet:

- Playwright `storageState` objektum: `{"cookies": [...], "origins": [...]}`
- Nyers `cookies[]` tömb
- JSON karakterlánc, amely bármelyik formát tartalmazza

Ajánlott minta:

1. Futtasson egy Playwright csomópontot hálózati rögzítéssel vagy hitelesítési bootstrap-pel engedélyezve
2. Tárolja a `$playwrightNode.cookies` értéket vagy egy teljes hitelesítési állapot objektumot egy [Globális változóban](../reference/global-variables.md)
3. Használja újra ezt a változót a későbbi Playwright csomópontokban a `$global.authState` segítségével

### Hitelesítés ellenőrzése

Az első fő Playwright lépésnek `navigate` műveletnek kell lennie. Miután ez a lépés betöltődött, a Heym ellenőrzi a `playwrightAuthCheckSelector` értékét.

- Ha a szelektor látható, a fennmaradó fő lépések normálisan folytatódnak
- Ha a szelektor hiányzik, a Heym lefuttatja a `playwrightAuthFallbackSteps` lépéseket
- A tartalék lépések befejezése után a Heym ismét ellenőrzi ugyanazt a szelektort
- Ha a szelektor továbbra is hiányzik, a csomópont hitelesítési bootstrap hibával meghiúsul

A tartalék lépések felelősek a navigációért a hitelesítési hiba után. A böngészőt a fő folyamat többi része által elvárt hitelesített oldalon kell hagyniuk.

## Kimeneti mezők

- `$playwrightNode.status` – `"ok"` sikeres végrehajtás esetén
- `$playwrightNode.results` – Lépéskimenetek (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot kulcsok stb.)
- `$playwrightNode.screenshot` – Base64 képernyőkép, amikor egy lépés ment egyet
- `$playwrightNode.cookies` – Végső böngésző cookie-k, amikor a hitelesítési bootstrap vagy a hálózati rögzítés engedélyezett
- `$playwrightNode.networkRequests` – Rögzített hálózati válaszok (amikor engedélyezett)
- `$playwrightNode.localStorage` – Böngésző local storage (amikor engedélyezett)
- `$playwrightNode.sessionStorage` – Böngésző session storage (amikor engedélyezett)

## Példa

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

## Run Code mód

A Tulajdonságok panelen állítsa a **Mode** értékét **Run Code**-ra, hogy a vizuális lépések helyett a `playwrightCode` szerkesztését végezze. A hitelesítési bootstrap csak Steps módban érvényes.

Példa (sandbox / Docker — a Chromiumnak szüksége van a `--no-sandbox` kapcsolóra):

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

A wrapper biztosítja az `inputs`, `headless`, `timeout_ms` és `capture_network` értékeket. A kódba beágyazhat `$nodeLabel.field` kifejezéseket; nyomtasson JSON-t `status` és `results` mezőkkel.
## Egyedi kód biztonsága

A `playwrightCode` mező tetszőleges Python kódot futtat. Mivel ez kódfuttatással egyenértékű, **alapértelmezés szerint le van tiltva**, és ha engedélyezik, sandboxban fut:

- **Alapértelmezés szerint letiltva.** Egy olyan csomópont futtatása, amelynél a `playwrightCode` be van állítva, egyértelmű hibaüzenettel meghiúsul, kivéve, ha az üzemeltető beállítja a `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` értéket. Az ellenőrzés futtatáskor történik, így a korábban mentett workflow-kra, valamint az ütemezett és al-workflow futtatásokra is kiterjed.
- **Engedélyezés esetén izoláltan fut.** Az egyedi kód nem a backend folyamatban fut. Egy megerősített, eldobható testvérkonténerben fut, amely nem rendelkezik Docker socketkel, backend bind mountokkal, a környezetében backend titkos kulcsokkal; a képességek el vannak dobva, a `no-new-privileges` be van állítva, valamint CPU-, memória- és PID-korlátok érvényesek. Ha a Docker nem érhető el, a futtatás zárt módon meghiúsul. A `HEYM_PLAYWRIGHT_SANDBOX=subprocess` visszavált a folyamaton belüli útvonalra, kizárólag megbízható vagy helyi fejlesztési használatra (nem biztonsági határvonal). A natív `./run.sh` alapértelmezés szerint a `subprocess` értéket használja, ha nincs beállítva a `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. A `./deploy.sh` (Compose) és a GHCR egyetlen image a `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (visszaesésként a `HEYM_CODEX_DOCKER_IMAGE`) segítségével oldja fel a testvér futtatót, és a hozzá illő venv útvonalat használja (`/app/.venv` vs `/app/backend/.venv`).
- **Chromium megjegyzés.** A sandbox konténer alapértelmezés szerint rootként fut, és a Chromium megtagadja a rootként való futtatást `--no-sandbox` nélkül. Az olyan egyedi kódnak, amely Chromiumot indít, át kell adnia ezt a kapcsolót, például: `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. A lépésalapú (és stealth) indítások átadják a `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` kapcsolót is, hogy a fingerprint szkriptek ne nyithassanak STUN UDP-t a `stun.l.google.com:19302` felé. Az egyedi `chromium.launch` hívásoknak is tartalmazniuk kell ezt a kapcsolót.

A lépésalapú Playwright csomópontokat (`playwrightSteps`) teljes egészében a Heym generálja (nincs bennük tetszőleges kód), a fentiek egyike sem érinti őket, és mindig elérhetők — részesítse előnyben ezeket.

## Kapcsolódó tartalmak

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Crawler csomópont](./crawler-node.md) – Egyszerűbb web scraping FlareSolverr-rel
- [Hitelesítési adatok megosztása](../reference/credentials-sharing.md) – LLM hitelesítési adatok AI-lépésekhez
