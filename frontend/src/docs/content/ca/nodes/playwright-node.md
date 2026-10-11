# Playwright

El node **Playwright** automatitza interaccions amb el navegador mitjançant passos configurables. Utilitzeu-lo per a web scraping, emplenament de formularis i workflows basats en navegador.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.results`, `$nodeLabel.screenshot` i dades opcionals de xarxa/navegador |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (per defecte) o `"code"` (Run Code). Trieu-lo al desplegable Mode del panell de propietats |
| `playwrightSteps` | array | Passos: navigate, click, type, aiStep, etc. Cada pas té una acció i un selector/paràmetres. `disabled: true` manté un pas a la llista però l'omet en temps d'execució |
| `playwrightCode` | string | Playwright Python personalitzat que s'utilitza quan el Mode és Run Code. S'executa a la sandbox reforçada i està **desactivat per defecte** — consulteu la nota de seguretat a continuació |
| `playwrightHeadless` | boolean | Executa en mode headless (per defecte: true) |
| `playwrightStealth` | boolean | Configuració opcional del mode Steps que redueix els senyals habituals d'automatització de Playwright (per defecte: false). Etiqueta al panell de propietats: Reduce automation flags |
| `playwrightTimeout` | number | Timeout en ms (per defecte: 30000) |
| `playwrightCaptureNetwork` | boolean | Captura respostes JSON, capçaleres, cookies i emmagatzematge del navegador |
| `playwrightAuthEnabled` | boolean | Restaura l'autenticació del navegador a partir de cookies/storageState abans d'executar els passos |
| `playwrightAuthStateExpression` | string | Expressió o JSON que es resol a `storageState` de Playwright o a `cookies[]` en cru |
| `playwrightAuthCheckSelector` | string | Selector que ha de ser visible després de l'arrencada d'autenticació |
| `playwrightAuthCheckTimeout` | number | Timeout en ms per a la comprovació del selector autenticat (per defecte: 5000) |
| `playwrightAuthFallbackSteps` | array | Passos de fallback només per a l'inici de sessió que s'executen quan la restauració de cookies no autentica la pàgina |

## Tipus de passos

- **navigate** – Vés a l'URL
- **refresh** – Recarrega la pàgina actual (`timeout` opcional del pas en ms per a la navegació de recàrrega)
- **click** – Fes clic a l'element pel selector
- **type** – Escriu text en un camp d'entrada (caràcter a caràcter)
- **fill** – Emplena el valor d'un camp d'entrada
- **wait** – Espera un timeout (ms)
- **screenshot** – Captura una captura de pantalla (`outputKey` emmagatzema base64 a results)
- **getText** – Contingut de text d'un element (`selector`, `outputKey` opcional)
- **getAttribute** – Valor d'un atribut (`selector`, `attribute`, `outputKey` opcional)
- **getHTML** – HTML extern d'un element (`selector`, `outputKey` opcional)
- **getVisibleTextOnPage** – Text visible de tota la pàgina com a `document.body.innerText` (sense selector; utilitzeu `outputKey`; el `timeout` opcional del pas en ms espera abans de la captura)
- **hover** – Passa el cursor per sobre d'un element
- **selectOption** – Selecciona una opció en un `<select>`
- **scrollDown** / **scrollUp** – Desplaçament amb la roda del ratolí (`amount` opcional en píxels)
- **aiStep** – L'LLM retorna els mateixos tipus d'accions que els passos manuals (vegeu a continuació); no s'admet `aiStep` imbricat

## Desactivar un pas

Cada pas té un commutador d'encesa al seu encapçalament. Un pas desactivat mostra el seu títol ratllat i atenuat, es manté a la llista amb tots els seus camps i s'omet quan s'executa el node — útil per aïllar un selector que falla sense eliminar la feina feta. El pas emmagatzemat porta `disabled: true`; els passos sense aquesta marca s'executen amb normalitat.

Els passos desactivats són invisibles per a la resta del node: no satisfan la regla "el primer pas ha de ser `navigate`" de l'arrencada d'autenticació, un `aiStep` desactivat no fa cap crida a l'LLM, i les entrades desactivades a `playwrightAuthFallbackSteps` també s'ometen. Desactivar tots els passos fa fallar l'execució amb un missatge que us demana que n'activeu un.

## AI Step

L'acció **aiStep** utilitza un LLM per analitzar l'HTML de la pàgina (i opcionalment una captura de pantalla) i generar accions de Playwright a partir d'instruccions en llenguatge natural. L'API accepta els mateixos noms d'acció que els passos manuals (incloent-hi `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, desplaçaments, etc.). **Auto heal** només substitueix els passos fallits basats en selector per alternatives per a click, type, fill, hover i selectOption.

| Opció | Descripció |
|--------|-------------|
| `instructions` | Què ha de fer la IA (p. ex. "Click the Login button") |
| `credentialId` | Credencial de l'LLM (OpenAI, Google o Custom) |
| `model` | Llista cercable de models de la credencial d'LLM seleccionada |
| `saveStepsForFuture` | Emmagatzema a la memòria cau els passos generats per a properes execucions (evita la crida a l'LLM) |
| `sendScreenshot` | Envia una captura de pantalla a l'LLM per a elements visuals |
| `aiStepTimeout` | Timeout per a la crida a l'LLM en ms (per defecte: 30000) |
### AI Auto Heal

**AI Auto Heal** fa que els workflows siguin resilients als canvis del DOM. Quan un selector falla dues vegades (per exemple, després d'un redisseny del lloc), Heym crida el LLM per trobar un localitzador alternatiu—normalment `role=button[name='Submit']` o `text=Exact text` en lloc de selectors CSS.

Activeu el **Mode d'auto-reparació** a les propietats del pas d'IA. Si el pas desat falla:

1. Heym captura l'HTML actual i una captura de pantalla
2. Envia el pas fallit + el context de la pàgina al LLM
3. El LLM retorna una alternativa robusta (localitzador basat en rol, localitzador de text o CSS de reserva)
4. Torna a intentar-ho amb el nou selector

Això redueix la inestabilitat quan els llocs actualitzen el seu marcatge o els noms de classe.

## Reduir els senyals d'automatització

Activeu **Reduir els senyals d'automatització** (`playwrightStealth: true`) quan un lloc tracta el Chromium inclòs amb Playwright com un bot a causa dels senyals d'automatització estàndard (`HeadlessChrome` a l'agent d'usuari, `navigator.webdriver`, absència de `window.chrome`).

Aquesta opció només s'aplica en el mode **Steps**. Fa el següent:

- Elimina el senyal `--enable-automation` del Chromium i estableix `--disable-blink-features=AutomationControlled`
- Envia un agent d'usuari estàndard de Chrome (sense `HeadlessChrome`)
- Restaura superfícies comunes del navegador que Playwright deixa buides (`window.chrome`, connectors)
- Deixa el renderitzador de GPU de l'amfitrió sense canvis quan hi ha una GPU disponible (macOS/Windows local). Linux/Docker no té GPU; la cadena del renderitzador de programari del Chromium es reporta com una GPU típica Mali (ARM) o Mesa (x86) en lloc de SwiftShader.

No amaga que la sessió es controla mitjançant el Chrome DevTools Protocol, i no és una manera d'eludir la seguretat del lloc, els CAPTCHA ni els controls d'accés. Utilitzeu-ho per a workflows que esteu autoritzats a executar—eines internes, els vostres propis llocs i automatització de navegador permesa.

El mode Run Code no canvia—els scripts personalitzats inicien el Chromium ells mateixos.

## Captura de xarxa

Activeu `playwrightCaptureNetwork` per recollir dades de depuració addicionals durant l'execució:

- `networkRequests` – Respostes JSON/API capturades
- `cookies` – Cookies del navegador al final de l'execució
- `localStorage` – Parells clau-valor de `localStorage` del navegador
- `sessionStorage` – Parells clau-valor de `sessionStorage` del navegador

Això és útil quan necessiteu inspeccionar crides API ocultes, l'estat d'autenticació o dades del costat del navegador després d'un flux automatitzat.

## Inicialització de cookies i fallback d'inici de sessió

Activeu `playwrightAuthEnabled` quan vulgueu que Playwright obri una pàgina ja amb la sessió iniciada.

### Origen de l'estat d'autenticació

Establiu `playwrightAuthStateExpression` amb una expressió com ara `$global.authState`. El valor pot ser:

- Un objecte `storageState` de Playwright: `{"cookies": [...], "origins": [...]}`
- Una matriu `cookies[]` en brut
- Una cadena JSON que contingui qualsevol de les dues formes

Patró recomanat:

1. Executeu un node de Playwright amb la captura de xarxa o la inicialització d'autenticació activada
2. Emmagatzemeu `$playwrightNode.cookies` o un objecte d'estat d'autenticació complet en una [Variable global](../reference/global-variables.md)
3. Reutilitzeu aquesta variable en nodes de Playwright posteriors mitjançant `$global.authState`

### Comprovació d'autenticació

El primer pas principal de Playwright ha de ser `navigate`. Un cop aquest pas s'ha carregat, Heym comprova `playwrightAuthCheckSelector`.

- Si el selector és visible, els passos principals restants continuen amb normalitat
- Si el selector no hi és, Heym executa `playwrightAuthFallbackSteps`
- Un cop completats els passos de fallback, Heym torna a comprovar el mateix selector
- Si el selector encara no hi és, el node falla amb un error d'inicialització d'autenticació

Els passos de fallback s'encarreguen de la navegació després d'un error d'autenticació. Han de deixar el navegador a la pàgina autenticada que espera la resta del flux principal.

## Camps de sortida

- `$playwrightNode.status` – `"ok"` en cas d'èxit
- `$playwrightNode.results` – Sortides dels passos (getText, getHTML, getVisibleTextOnPage, getAttribute, claus de captura de pantalla, etc.)
- `$playwrightNode.screenshot` – Captura de pantalla en Base64 quan un pas en desa una
- `$playwrightNode.cookies` – Cookies finals del navegador quan la inicialització d'autenticació o la captura de xarxa estan activades
- `$playwrightNode.networkRequests` – Respostes de xarxa capturades (quan està activat)
- `$playwrightNode.localStorage` – Emmagatzematge local del navegador (quan està activat)
- `$playwrightNode.sessionStorage` – Emmagatzematge de sessió del navegador (quan està activat)

## Exemple

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
## Mode Run Code

Al Panell de propietats, establiu el **Mode** a **Run Code** per editar `playwrightCode` en lloc dels passos visuals. L'arrencada d'autenticació només s'aplica al mode Steps.

Exemple (sandbox / Docker — Chromium necessita `--no-sandbox`):

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

L'embolcall proporciona `inputs`, `headless`, `timeout_ms` i `capture_network`. Podeu incrustar expressions `$nodeLabel.field` al codi; imprimiu JSON amb `status` i `results`.

## Seguretat del codi personalitzat

El camp `playwrightCode` executa Python arbitrari. Atès que això equival a l'execució de codi, està **desactivat per defecte** i, quan s'activa, s'executa en un sandbox:

- **Desactivat per defecte.** L'execució d'un node que tingui `playwrightCode` definit falla amb un error clar tret que un operador estableixi `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. La comprovació s'executa en el moment de l'execució, de manera que també cobreix workflows desats prèviament i execucions programades o de subworkflow.
- **Aïllat quan s'activa.** El codi personalitzat no s'executa al procés del backend. S'executa en un contenidor germà efímer i endurit, sense socket de Docker, sense muntatges bind del backend, sense secrets del backend al seu entorn, amb capacitats eliminades, `no-new-privileges` i límits de CPU / memòria / PID. Si Docker no està disponible, l'execució falla de manera segura. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` torna a optar pel camí dins del procés només per a ús de confiança o desenvolupament local (no és una frontera de seguretat). L'`./run.sh` natiu pren `subprocess` per defecte quan no s'estableix cap `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. L'`./deploy.sh` (Compose) i la imatge única de GHCR resolen el runner germà mitjançant `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (amb retrocés a `HEYM_CODEX_DOCKER_IMAGE`) i utilitzen el camí venv corresponent (`/app/.venv` vs `/app/backend/.venv`).
- **Nota sobre Chromium.** El contenidor sandbox s'executa com a root per defecte, i Chromium es nega a executar-se com a root sense `--no-sandbox`. El codi personalitzat que iniciï Chromium hauria de passar aquesta opció, per exemple `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Els llançaments basats en passos (i sigil·losos) també passen `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` perquè els scripts de fingerprint no puguin obrir STUN UDP cap a `stun.l.google.com:19302`. Les crides personalitzades a `chromium.launch` també haurien d'incloure aquesta opció.

Els nodes Playwright basats en passos (`playwrightSteps`) són generats íntegrament per Heym (sense codi arbitrari), no es veuen afectats per tot l'anterior i sempre estan disponibles — doneu-los preferència.

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Crawler Node](./crawler-node.md) – Web scraping més senzill amb FlareSolverr
- [Credentials Sharing](../reference/credentials-sharing.md) – Credencials d'LLM per als passos d'IA
