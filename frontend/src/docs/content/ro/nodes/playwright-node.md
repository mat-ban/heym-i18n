# Playwright

Nodul **Playwright** automatizează interacțiunile cu browserul prin pași configurabili. Utilizați-l pentru extragerea datelor web, completarea formularelor și workflow-uri bazate pe browser.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.results`, `$nodeLabel.screenshot` și date opționale de rețea/browser |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (implicit) sau `"code"` (Run Code). Se alege din meniul dropdown Mode din panoul de proprietăți |
| `playwrightSteps` | array | Pași: navigate, click, type, aiStep etc. Fiecare pas are acțiune și selector/parametri. `disabled: true` păstrează un pas în listă, dar îl omite la execuție |
| `playwrightCode` | string | Cod Playwright Python personalizat folosit când Modul este Run Code. Rulează în sandbox-ul securizat și este **dezactivat implicit** — consultați nota de securitate de mai jos |
| `playwrightHeadless` | boolean | Rulare headless (implicit: true) |
| `playwrightStealth` | boolean | Setare opțională pentru modul Steps care reduce semnalele comune de automatizare Playwright (implicit: false). Eticheta din panoul de proprietăți: Reduce automation flags |
| `playwrightTimeout` | number | Timeout în ms (implicit: 30000) |
| `playwrightCaptureNetwork` | boolean | Captează răspunsuri JSON, antete, cookie-uri și stocarea browserului |
| `playwrightAuthEnabled` | boolean | Restaurează autentificarea browserului din cookie-uri/storageState înainte de a rula pașii |
| `playwrightAuthStateExpression` | string | Expresie sau JSON care se rezolvă la `storageState` Playwright sau la `cookies[]` brute |
| `playwrightAuthCheckSelector` | string | Selector care trebuie să fie vizibil după inițializarea autentificării |
| `playwrightAuthCheckTimeout` | number | Timeout în ms pentru verificarea selectorului autentificat (implicit: 5000) |
| `playwrightAuthFallbackSteps` | array | Pași de rezervă doar pentru autentificare, rulați când restaurarea cookie-urilor nu autentifică pagina |

## Tipuri de pași

- **navigate** – Accesează URL-ul
- **refresh** – Reîncarcă pagina curentă (`timeout` opțional în ms pentru navigarea de reîncărcare)
- **click** – Face clic pe element după selector
- **type** – Tastează text într-un câmp de intrare (caracter cu caracter)
- **fill** – Completează valoarea unui câmp de intrare
- **wait** – Așteaptă un timeout (ms)
- **screenshot** – Capturează un screenshot (`outputKey` stochează base64 în results)
- **getText** – Conținutul text al unui element (`selector`, `outputKey` opțional)
- **getAttribute** – Valoarea unui atribut (`selector`, `attribute`, `outputKey` opțional)
- **getHTML** – HTML-ul exterior al unui element (`selector`, `outputKey` opțional)
- **getVisibleTextOnPage** – Textul vizibil al întregii pagini ca `document.body.innerText` (fără selector; utilizați `outputKey`; `timeout` opțional în ms așteaptă înainte de capturare)
- **hover** – Plasează cursorul peste element
- **selectOption** – Selectează o opțiune într-un `<select>`
- **scrollDown** / **scrollUp** – Derulare cu rotița mouse-ului (`amount` opțional în pixeli)
- **aiStep** – LLM-ul returnează aceleași tipuri de acțiuni ca pașii manuali (vezi mai jos); `aiStep` imbricat nu este acceptat

## Dezactivarea unui pas

Fiecare pas are un comutator de activare în antetul său. Un pas dezactivat apare cu titlul tăiat și estompat, rămâne în listă cu toate câmpurile sale și este omis la rularea nodului — util pentru izolarea unui selector defect fără a șterge munca. Pasul stocat poartă `disabled: true`; pașii fără acest indicator rulează normal.

Pașii dezactivați sunt invizibili pentru restul nodului: nu satisfac regula „primul pas trebuie să fie `navigate`" a inițializării autentificării, un `aiStep` dezactivat nu face nicio apelare LLM, iar intrările dezactivate din `playwrightAuthFallbackSteps` sunt și ele omise. Dezactivarea tuturor pașilor duce la eșecul rulării cu un mesaj care vă solicită să activați unul.

## Pasul AI

Acțiunea **aiStep** utilizează un LLM pentru a analiza HTML-ul paginii (și opțional un screenshot) și a genera acțiuni Playwright din instrucțiuni în limbaj natural. API-ul acceptă aceleași nume de acțiuni ca pașii manuali (inclusiv `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, derulări etc.). **Auto heal** înlocuiește doar pașii eșuați bazați pe selector cu alternative pentru click, type, fill, hover și selectOption.

| Opțiune | Descriere |
|--------|-------------|
| `instructions` | Ce ar trebui să facă AI-ul (de ex. „Click the Login button") |
| `credentialId` | Acreditare LLM (OpenAI, Google sau Custom) |
| `model` | Listă căutabilă de modele din acreditarea LLM selectată |
| `saveStepsForFuture` | Memorează pașii generați pentru rulările viitoare (evită apelarea LLM) |
| `sendScreenshot` | Trimite screenshot-ul către LLM pentru elemente vizuale |
| `aiStepTimeout` | Timeout pentru apelarea LLM în ms (implicit 30000) |

### AI Auto Heal

**AI Auto Heal** face workflow-urile rezistente la modificările DOM-ului. Când un selector eșuează de două ori (de ex. după o reproiectare a site-ului), Heym apelează LLM-ul pentru a găsi un locator alternativ — de obicei `role=button[name='Submit']` sau `text=Exact text` în locul selectorilor CSS.

Activați **Auto heal mode** în proprietățile pasului AI. Dacă pasul salvat eșuează:

1. Heym capturează HTML-ul curent și un screenshot
2. Trimite pasul eșuat + contextul paginii către LLM
3. LLM-ul returnează o alternativă robustă (locator bazat pe rol, locator text sau CSS de rezervă)
4. Reîncearcă cu noul selector

Aceasta reduce instabilitatea când site-urile își actualizează markup-ul sau numele claselor.
## Reducerea indicatorilor de automatizare

Activați **Reduce automation flags** (`playwrightStealth: true`) atunci când un site tratează Chromium-ul inclus în Playwright ca pe un bot din cauza semnalelor standard de automatizare (`HeadlessChrome` în user agent, `navigator.webdriver`, lipsa `window.chrome`).

Această opțiune se aplică doar în modul **Steps**. Aceasta:

- Elimină flag-ul `--enable-automation` al Chromium și setează `--disable-blink-features=AutomationControlled`
- Trimite un user agent standard Chrome (fără `HeadlessChrome`)
- Restaurează suprafețele comune ale browserului pe care Playwright le lasă goale (`window.chrome`, plugin-uri)
- Lasă neschimbat renderer-ul GPU al gazdei atunci când un GPU este disponibil (macOS/Windows local). Linux/Docker nu are GPU; șirul renderer-ului software al Chromium este raportat ca un GPU tipic Mali (ARM) sau Mesa (x86) în loc de SwiftShader.

Nu ascunde faptul că sesiunea este controlată prin Chrome DevTools Protocol și nu reprezintă o modalitate de a ocoli securitatea site-ului, CAPTCHA-urile sau controalele de acces. Utilizați-o pentru workflow-uri pe care sunteți autorizat să le rulați — instrumente interne, site-uri proprii și automatizări de browser permise.

Modul Run Code rămâne neschimbat — scripturile personalizate lansează Chromium singure.

## Capturarea rețelei

Activați `playwrightCaptureNetwork` pentru a colecta date suplimentare de depanare în timpul rulării:

- `networkRequests` – Răspunsuri JSON/API capturate
- `cookies` – Cookie-urile browserului la finalul rulării
- `localStorage` – Perechile cheie-valoare din `localStorage` ale browserului
- `sessionStorage` – Perechile cheie-valoare din `sessionStorage` ale browserului

Acest lucru este util atunci când trebuie să inspectați apeluri API ascunse, starea de autentificare sau datele din partea browserului după un flux automatizat.

## Bootstrap pentru cookie-uri și fallback pentru autentificare

Activați `playwrightAuthEnabled` atunci când doriți ca Playwright să deschidă o pagină deja autentificată.

### Sursa stării de autentificare

Setați `playwrightAuthStateExpression` la o expresie precum `$global.authState`. Valoarea poate fi:

- Un obiect `storageState` Playwright: `{"cookies": [...], "origins": [...]}`
- Un array brut `cookies[]`
- Un șir JSON care conține oricare dintre aceste forme

Model recomandat:

1. Rulați un nod Playwright cu capturarea rețelei sau bootstrap-ul de autentificare activat
2. Stocați `$playwrightNode.cookies` sau un obiect complet de stare de autentificare într-o [Variabilă globală](../reference/global-variables.md)
3. Reutilizați acea variabilă în noduri Playwright ulterioare prin `$global.authState`

### Verificarea autentificării

Primul pas principal Playwright trebuie să fie `navigate`. După ce acel pas se încarcă, Heym verifică `playwrightAuthCheckSelector`.

- Dacă selectorul este vizibil, pașii principali rămași continuă normal
- Dacă selectorul lipsește, Heym rulează `playwrightAuthFallbackSteps`
- După finalizarea pașilor de fallback, Heym verifică din nou același selector
- Dacă selectorul încă lipsește, nodul eșuează cu o eroare de bootstrap pentru autentificare

Pașii de fallback dețin navigarea după eșecul autentificării. Aceștia trebuie să lase browserul pe pagina autentificată așteptată de restul fluxului principal.

## Câmpuri de ieșire

- `$playwrightNode.status` – `"ok"` la succes
- `$playwrightNode.results` – Ieșirile pașilor (getText, getHTML, getVisibleTextOnPage, getAttribute, chei screenshot etc.)
- `$playwrightNode.screenshot` – Screenshot în Base64 atunci când un pas salvează unul
- `$playwrightNode.cookies` – Cookie-urile finale ale browserului atunci când bootstrap-ul de autentificare sau capturarea rețelei este activată
- `$playwrightNode.networkRequests` – Răspunsuri de rețea capturate (când este activat)
- `$playwrightNode.localStorage` – Stocarea locală a browserului (când este activată)
- `$playwrightNode.sessionStorage` – Stocarea de sesiune a browserului (când este activată)

## Exemplu

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

## Modul Run Code

În Properties Panel, setați **Mode** la **Run Code** pentru a edita `playwrightCode` în locul pașilor vizuali. Bootstrap-ul de autentificare se aplică doar în modul Steps.

Exemplu (sandbox / Docker — Chromium necesită `--no-sandbox`):

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

Wrapper-ul oferă `inputs`, `headless`, `timeout_ms` și `capture_network`. Puteți încorpora expresii `$nodeLabel.field` în cod; afișați JSON cu `status` și `results`.
## Securitatea codului personalizat

Câmpul `playwrightCode` execută cod Python arbitrar. Deoarece acest lucru este echivalent cu execuția de cod, este **dezactivat implicit** și, atunci când este activat, rulează într-un mediu izolat (sandbox):

- **Dezactivat implicit.** Executarea unui nod care are setat `playwrightCode` eșuează cu o eroare clară, cu excepția cazului în care un operator setează `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Verificarea se face în momentul execuției, astfel încât acoperă și workflow-urile salvate anterior, precum și execuțiile programate / ale sub-workflow-urilor.
- **Izolat atunci când este activat.** Codul personalizat nu rulează în procesul backend. Acesta rulează într-un container frate (sibling) consolidat, de unică folosință, fără socket Docker, fără bind mounts către backend, fără secrete de backend în mediul său, cu capabilități eliminate, `no-new-privileges` și limite de CPU / memorie / PID. Dacă Docker nu este disponibil, execuția eșuează în siguranță (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` reactivează calea în proces (in-process) exclusiv pentru utilizare de încredere sau pentru dezvoltare locală (nu reprezintă o graniță de securitate). Scriptul nativ `./run.sh` folosește implicit `subprocess` atunci când nu este setat `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) și imaginea unică GHCR rezolvă runner-ul frate (sibling) prin `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (cu revenire la `HEYM_CODEX_DOCKER_IMAGE`) și utilizează calea venv corespunzătoare (`/app/.venv` vs `/app/backend/.venv`).
- **Notă privind Chromium.** Containerul sandbox rulează implicit ca root, iar Chromium refuză să ruleze ca root fără `--no-sandbox`. Codul personalizat care lansează Chromium ar trebui să transmită acest flag, de exemplu `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Lansările bazate pe pași (și cele stealth) transmit de asemenea `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, astfel încât scripturile de fingerprinting să nu poată deschide STUN UDP către `stun.l.google.com:19302`. Apelurile personalizate `chromium.launch` ar trebui să includă și acest flag.

Nodurile Playwright bazate pe pași (`playwrightSteps`) sunt generate în totalitate de Heym (fără cod arbitrar), nu sunt afectate de cele de mai sus și sunt întotdeauna disponibile — se recomandă utilizarea lor prioritară.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nodul Crawler](./crawler-node.md) – Web scraping mai simplu cu FlareSolverr
- [Partajarea acreditărilor](../reference/credentials-sharing.md) – Acreditări LLM pentru pașii AI
