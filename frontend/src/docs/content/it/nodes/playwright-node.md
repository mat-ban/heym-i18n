# Playwright

Il nodo **Playwright** automatizza le interazioni con il browser tramite passaggi configurabili. Lo si utilizzi per web scraping, compilazione di moduli e workflow basati sul browser.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.results`, `$nodeLabel.screenshot` e dati opzionali di rete/browser |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (predefinito) o `"code"` (Run Code). Si scelga dal menu a tendina Mode nel pannello delle proprietà |
| `playwrightSteps` | array | Passaggi: navigate, click, type, aiStep, ecc. Ogni passaggio ha un'azione e un selettore/parametri. `disabled: true` mantiene il passaggio nell'elenco ma lo salta in fase di esecuzione |
| `playwrightCode` | string | Playwright Python personalizzato utilizzato quando Mode è impostato su Run Code. Viene eseguito nella sandbox rafforzata ed è **disabilitato per impostazione predefinita** — si veda la nota di sicurezza riportata di seguito |
| `playwrightHeadless` | boolean | Esecuzione headless (predefinito: true) |
| `playwrightStealth` | boolean | Impostazione opt-in della modalità Steps che riduce i segnali di automazione comuni di Playwright (predefinito: false). Etichetta nel pannello delle proprietà: Reduce automation flags |
| `playwrightTimeout` | number | Timeout in ms (predefinito: 30000) |
| `playwrightCaptureNetwork` | boolean | Cattura le risposte JSON, gli header, i cookie e lo storage del browser |
| `playwrightAuthEnabled` | boolean | Ripristina l'autenticazione del browser da cookie/storageState prima di eseguire i passaggi |
| `playwrightAuthStateExpression` | string | Espressione o JSON che restituisce lo `storageState` di Playwright o `cookies[]` grezzi |
| `playwrightAuthCheckSelector` | string | Selettore che deve essere visibile dopo il bootstrap dell'autenticazione |
| `playwrightAuthCheckTimeout` | number | Timeout in ms per la verifica del selettore autenticato (predefinito: 5000) |
| `playwrightAuthFallbackSteps` | array | Passaggi di fallback di solo login da eseguire quando il ripristino dei cookie non autentica la pagina |

## Tipi di passaggio

- **navigate** – Vai all'URL
- **refresh** – Ricarica la pagina corrente (parametro opzionale del passaggio `timeout` in ms per la navigazione di ricaricamento)
- **click** – Clicca l'elemento tramite selettore
- **type** – Digita testo in un input (carattere per carattere)
- **fill** – Compila il valore di un input
- **wait** – Attende un timeout (ms)
- **screenshot** – Cattura uno screenshot (`outputKey` memorizza il base64 nei risultati)
- **getText** – Contenuto testuale di un elemento (`selector`, `outputKey` opzionale)
- **getAttribute** – Valore di un attributo (`selector`, `attribute`, `outputKey` opzionale)
- **getHTML** – HTML esterno di un elemento (`selector`, `outputKey` opzionale)
- **getVisibleTextOnPage** – Testo visibile dell'intera pagina come `document.body.innerText` (nessun selettore; si utilizzi `outputKey`; il parametro opzionale del passaggio `timeout` in ms attende prima della cattura)
- **hover** – Passa il mouse sopra un elemento
- **selectOption** – Seleziona un'opzione in un `<select>`
- **scrollDown** / **scrollUp** – Scorrimento con la rotellina del mouse (`amount` opzionale in pixel)
- **aiStep** – L'LLM restituisce gli stessi tipi di azioni dei passaggi manuali (si veda di seguito); l'annidamento di `aiStep` non è supportato

## Disattivazione di un passaggio

Ogni passaggio dispone di un interruttore di attivazione nella propria intestazione. Un passaggio disattivato mostra il titolo barrato e attenuato, rimane nell'elenco con tutti i suoi campi e viene saltato quando il nodo viene eseguito — utile per isolare un selettore non funzionante senza eliminare il lavoro svolto. Il passaggio memorizzato riporta `disabled: true`; i passaggi privi di questo flag vengono eseguiti normalmente.

I passaggi disabilitati sono invisibili al resto del nodo: non soddisfano la regola "il primo passaggio deve essere `navigate`" del bootstrap dell'autenticazione, un `aiStep` disabilitato non effettua alcuna chiamata all'LLM e anche le voci disabilitate in `playwrightAuthFallbackSteps` vengono saltate. Disattivando tutti i passaggi, l'esecuzione fallisce con un messaggio che invita ad attivarne almeno uno.

## AI Step

L'azione **aiStep** utilizza un LLM per analizzare l'HTML della pagina (e facoltativamente uno screenshot) e generare azioni Playwright a partire da istruzioni in linguaggio naturale. L'API accetta gli stessi nomi di azione dei passaggi manuali (inclusi `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, gli scorrimenti, ecc.). **Auto heal** sostituisce unicamente i passaggi basati su selettore non riusciti con alternative per click, type, fill, hover e selectOption.

| Opzione | Descrizione |
|--------|-------------|
| `instructions` | Ciò che l'IA deve fare (es. "Click the Login button") |
| `credentialId` | Credenziale LLM (OpenAI, Google o Custom) |
| `model` | Elenco ricercabile dei modelli disponibili dalla credenziale LLM selezionata |
| `saveStepsForFuture` | Memorizza nella cache i passaggi generati per le esecuzioni successive (evita la chiamata all'LLM) |
| `sendScreenshot` | Invia lo screenshot all'LLM per gli elementi visivi |
| `aiStepTimeout` | Timeout per la chiamata all'LLM in ms (predefinito 30000) |
### AI Auto Heal

**AI Auto Heal** rende i workflow resilienti ai cambiamenti del DOM. Quando un selettore fallisce due volte (ad esempio dopo un restyling del sito), Heym interpella l'LLM per individuare un locator alternativo—tipicamente `role=button[name='Submit']` o `text=Exact text` al posto dei selettori CSS.

Abilitare la **Auto heal mode** nelle proprietà dello step AI. Se lo step salvato fallisce:

1. Heym acquisisce l'HTML corrente e uno screenshot
2. Invia lo step fallito e il contesto della pagina all'LLM
3. L'LLM restituisce un'alternativa robusta (locator basato su role, locator testuale o CSS di fallback)
4. Riprova con il nuovo selettore

Ciò riduce l'instabilità quando i siti aggiornano il markup o i nomi delle classi.

## Reduce automation flags

Abilitare **Reduce automation flags** (`playwrightStealth: true`) quando un sito tratta il Chromium incluso in Playwright come un bot a causa dei segnali di automazione standard (`HeadlessChrome` nello user agent, `navigator.webdriver`, `window.chrome` mancante).

Questa opzione si applica solo in modalità **Steps**. Essa:

- Rimuove il flag `--enable-automation` di Chromium e imposta `--disable-blink-features=AutomationControlled`
- Invia uno user agent Chrome standard (senza `HeadlessChrome`)
- Ripristina le comuni superfici del browser che Playwright lascia vuote (`window.chrome`, plugin)
- Lascia invariato il renderer GPU dell'host quando una GPU è disponibile (macOS/Windows locale). Linux/Docker non dispone di GPU; la stringa del renderer software di Chromium viene riportata come una tipica GPU Mali (ARM) o Mesa (x86) anziché SwiftShader.

Non occulta il fatto che la sessione sia pilotata tramite Chrome DevTools Protocol e non costituisce un mezzo per aggirare la sicurezza dei siti, i CAPTCHA o i controlli di accesso. Utilizzarla per workflow che si è autorizzati a eseguire — strumenti interni, siti propri e automazione browser consentita.

La modalità Run Code rimane invariata — gli script personalizzati avviano Chromium autonomamente.

## Network Capture

Abilitare `playwrightCaptureNetwork` per raccogliere dati di debug aggiuntivi durante l'esecuzione:

- `networkRequests` – Risposte JSON/API acquisite
- `cookies` – Cookie del browser al termine dell'esecuzione
- `localStorage` – Coppie chiave-valore di `localStorage` del browser
- `sessionStorage` – Coppie chiave-valore di `sessionStorage` del browser

Ciò è utile quando occorre ispezionare chiamate API nascoste, stato di autenticazione o dati lato browser dopo un flusso automatizzato.

## Cookie Bootstrap And Login Fallback

Abilitare `playwrightAuthEnabled` quando si desidera che Playwright apra una pagina già autenticata.

### Auth State Source

Impostare `playwrightAuthStateExpression` su un'espressione come `$global.authState`. Il valore può essere:

- Un oggetto `storageState` di Playwright: `{"cookies": [...], "origins": [...]}`
- Un array `cookies[]` grezzo
- Una stringa JSON contenente una delle due forme

Pattern consigliato:

1. Eseguire un nodo Playwright con network capture o auth bootstrap abilitato
2. Memorizzare `$playwrightNode.cookies` o un oggetto auth state completo in una [Global Variable](../reference/global-variables.md)
3. Riusare tale variabile nei nodi Playwright successivi tramite `$global.authState`

### Auth Check

Il primo step principale di Playwright deve essere `navigate`. Dopo il caricamento di tale step, Heym verifica `playwrightAuthCheckSelector`.

- Se il selettore è visibile, gli step principali rimanenti proseguono normalmente
- Se il selettore è assente, Heym esegue `playwrightAuthFallbackSteps`
- Al termine degli step di fallback, Heym verifica nuovamente lo stesso selettore
- Se il selettore è ancora assente, il nodo fallisce con un errore di auth bootstrap

Gli step di fallback gestiscono la navigazione dopo il fallimento dell'autenticazione. Devono lasciare il browser sulla pagina autenticata attesa dal resto del flusso principale.

## Output Fields

- `$playwrightNode.status` – `"ok"` in caso di successo
- `$playwrightNode.results` – Output degli step (getText, getHTML, getVisibleTextOnPage, getAttribute, chiavi screenshot, ecc.)
- `$playwrightNode.screenshot` – Screenshot in Base64 quando uno step ne salva uno
- `$playwrightNode.cookies` – Cookie finali del browser quando auth bootstrap o network capture sono abilitati
- `$playwrightNode.networkRequests` – Risposte di rete acquisite (quando abilitato)
- `$playwrightNode.localStorage` – Local storage del browser (quando abilitato)
- `$playwrightNode.sessionStorage` – Session storage del browser (quando abilitato)

## Example

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
## Modalità Run Code

Nel pannello delle proprietà, impostare **Mode** su **Run Code** per modificare `playwrightCode` anziché i passaggi visuali. Il bootstrap di autenticazione si applica esclusivamente alla modalità Steps.

Esempio (sandbox / Docker — Chromium richiede `--no-sandbox`):

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

Il wrapper fornisce `inputs`, `headless`, `timeout_ms` e `capture_network`. È possibile incorporare espressioni `$nodeLabel.field` nel codice; stampare JSON con `status` e `results`.

## Sicurezza del codice personalizzato

Il campo `playwrightCode` esegue Python arbitrario. Poiché ciò equivale all'esecuzione di codice, è **disabilitato per impostazione predefinita** e, quando abilitato, viene eseguito in sandbox:

- **Disabilitato per impostazione predefinita.** L'esecuzione di un nodo con `playwrightCode` impostato fallisce con un errore esplicito a meno che un operatore non imposti `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Il controllo viene eseguito al momento dell'esecuzione, pertanto copre anche i Workflow salvati in precedenza e le esecuzioni pianificate / dei sub-workflow.
- **Isolato quando abilitato.** Il codice personalizzato non viene eseguito nel processo backend. Viene eseguito in un container sibling temporaneo e irrobustito, privo di socket Docker, senza bind mount del backend, senza segreti del backend nel suo ambiente, con capability rimosse, `no-new-privileges` e limiti di CPU / memoria / PID. Se Docker non è disponibile, l'esecuzione fallisce in modalità fail-closed. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` ripristina il percorso in-process, esclusivamente per uso fidato o di sviluppo locale (non costituisce un confine di sicurezza). Lo script nativo `./run.sh` utilizza `subprocess` per impostazione predefinita quando `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` non è impostato. `./deploy.sh` (Compose) e l'immagine singola GHCR risolvono il runner sibling tramite `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (con fallback su `HEYM_CODEX_DOCKER_IMAGE`) e utilizzano il percorso venv corrispondente (`/app/.venv` vs `/app/backend/.venv`).
- **Nota su Chromium.** Il container sandbox viene eseguito come root per impostazione predefinita e Chromium rifiuta di essere eseguito come root senza `--no-sandbox`. Il codice personalizzato che avvia Chromium deve passarlo, ad esempio `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Anche gli avvii basati su step (e stealth) passano `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` affinché gli script di fingerprinting non possano aprire STUN UDP verso `stun.l.google.com:19302`. Anche le chiamate personalizzate a `chromium.launch` devono includere tale flag.

I nodi Playwright basati su step (`playwrightSteps`) sono interamente generati da Heym (nessun codice arbitrario), non sono interessati da quanto sopra e sono sempre disponibili — se ne consiglia l'utilizzo.

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Crawler Node](./crawler-node.md) – Web scraping semplificato con FlareSolverr
- [Credentials Sharing](../reference/credentials-sharing.md) – Credenziali LLM per gli step IA
