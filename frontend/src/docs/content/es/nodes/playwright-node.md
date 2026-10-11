# Playwright

El nodo **Playwright** automatiza interacciones con el navegador mediante pasos configurables. Utilícelo para web scraping, rellenado de formularios y workflows basados en navegador.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.results`, `$nodeLabel.screenshot` y datos opcionales de red/navegador |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (predeterminado) o `"code"` (Run Code). Seleccione en el desplegable Mode del Panel de Propiedades |
| `playwrightSteps` | array | Pasos: navigate, click, type, aiStep, etc. Cada paso tiene action y selector/params. `disabled: true` mantiene un paso en la lista pero lo omite en tiempo de ejecución |
| `playwrightCode` | string | Playwright Python personalizado que se utiliza cuando Mode es Run Code. Se ejecuta en el sandbox reforzado y está **deshabilitado de forma predeterminada** — consulte la nota de seguridad a continuación |
| `playwrightHeadless` | boolean | Ejecutar en modo headless (predeterminado: true) |
| `playwrightStealth` | boolean | Ajuste opcional del modo Steps que reduce las señales comunes de automatización de Playwright (predeterminado: false). Etiqueta en el Panel de Propiedades: Reduce automation flags |
| `playwrightTimeout` | number | Timeout en ms (predeterminado: 30000) |
| `playwrightCaptureNetwork` | boolean | Capturar respuestas JSON, cabeceras, cookies y almacenamiento del navegador |
| `playwrightAuthEnabled` | boolean | Restaurar la autenticación del navegador desde cookies/storageState antes de ejecutar los pasos |
| `playwrightAuthStateExpression` | string | Expresión o JSON que se resuelve en `storageState` de Playwright o `cookies[]` sin procesar |
| `playwrightAuthCheckSelector` | string | Selector que debe ser visible tras el bootstrap de autenticación |
| `playwrightAuthCheckTimeout` | number | Timeout en ms para la comprobación del selector autenticado (predeterminado: 5000) |
| `playwrightAuthFallbackSteps` | array | Pasos de fallback solo para inicio de sesión que se ejecutan cuando la restauración de cookies no autentica la página |

## Tipos de pasos

- **navigate** – Ir a la URL
- **refresh** – Recargar la página actual (`timeout` opcional del paso en ms para la navegación de recarga)
- **click** – Hacer clic en un elemento por selector
- **type** – Escribir texto en un input (carácter a carácter)
- **fill** – Rellenar el valor de un input
- **wait** – Esperar un timeout (ms)
- **screenshot** – Capturar una captura de pantalla (`outputKey` almacena base64 en results)
- **getText** – Contenido de texto de un elemento (`selector`, `outputKey` opcional)
- **getAttribute** – Valor de un atributo (`selector`, `attribute`, `outputKey` opcional)
- **getHTML** – HTML externo de un elemento (`selector`, `outputKey` opcional)
- **getVisibleTextOnPage** – Texto visible de toda la página como `document.body.innerText` (sin selector; utilice `outputKey`; el `timeout` opcional del paso en ms espera antes de la captura)
- **hover** – Pasar el cursor sobre un elemento
- **selectOption** – Seleccionar una opción en un `<select>`
- **scrollDown** / **scrollUp** – Desplazamiento con la rueda del ratón (`amount` opcional en píxeles)
- **aiStep** – El LLM devuelve los mismos tipos de acciones que los pasos manuales (consulte a continuación); no se admite `aiStep` anidado

## Desactivar un paso

Cada paso tiene un interruptor de encendido en su cabecera. Un paso desactivado muestra su título tachado y atenuado, permanece en la lista con todos sus campos y se omite cuando el nodo se ejecuta — útil para aislar un selector que falla sin eliminar el trabajo. El paso almacenado lleva `disabled: true`; los pasos sin este indicador se ejecutan con normalidad.

Los pasos desactivados son invisibles para el resto del nodo: no satisfacen la regla de "el primer paso debe ser `navigate`" del bootstrap de autenticación, un `aiStep` desactivado no realiza ninguna llamada al LLM y las entradas desactivadas en `playwrightAuthFallbackSteps` también se omiten. Desactivar todos los pasos hace fallar la ejecución con un mensaje que solicita habilitar uno.

## AI Step

La acción **aiStep** utiliza un LLM para analizar el HTML de la página (y opcionalmente una captura de pantalla) y generar acciones de Playwright a partir de instrucciones en lenguaje natural. La API acepta los mismos nombres de acción que los pasos manuales (incluidos `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, desplazamientos, etc.). **Auto heal** solo reemplaza los pasos fallidos basados en selector por alternativas para click, type, fill, hover y selectOption.

| Opción | Descripción |
|--------|-------------|
| `instructions` | Lo que debe hacer la IA (p. ej. "Click the Login button") |
| `credentialId` | Credencial del LLM (OpenAI, Google o Custom) |
| `model` | Lista de modelos con búsqueda de la credencial LLM seleccionada |
| `saveStepsForFuture` | Almacenar en caché los pasos generados para próximas ejecuciones (evita la llamada al LLM) |
| `sendScreenshot` | Enviar una captura de pantalla al LLM para elementos visuales |
| `aiStepTimeout` | Timeout para la llamada al LLM en ms (predeterminado 30000) |
### AI Auto Heal

**AI Auto Heal** hace que los workflows sean resistentes a los cambios en el DOM. Cuando un selector falla dos veces (por ejemplo, tras un rediseño del sitio), Heym llama al LLM para encontrar un localizador alternativo; normalmente `role=button[name='Submit']` o `text=Exact text` en lugar de selectores CSS.

Habilite el **Auto heal mode** en las propiedades del paso de IA. Si el paso guardado falla:

1. Heym captura el HTML actual y una captura de pantalla
2. Envía el paso fallido + el contexto de la página al LLM
3. El LLM devuelve una alternativa robusta (localizador basado en rol, localizador de texto o CSS de respaldo)
4. Reintenta con el nuevo selector

Esto reduce la fragilidad cuando los sitios actualizan su marcado o los nombres de las clases.

## Reduce automation flags

Habilite **Reduce automation flags** (`playwrightStealth: true`) cuando un sitio trate el Chromium incluido con Playwright como un bot debido a las señales de automatización estándar (`HeadlessChrome` en el user agent, `navigator.webdriver`, ausencia de `window.chrome`).

Esta opción se aplica únicamente en el modo **Steps**. Hace lo siguiente:

- Elimina el flag `--enable-automation` de Chromium y establece `--disable-blink-features=AutomationControlled`
- Envía un user agent estándar de Chrome (sin `HeadlessChrome`)
- Restaura superficies comunes del navegador que Playwright deja vacías (`window.chrome`, plugins)
- Deja sin cambios el renderizador de GPU del host cuando hay una GPU disponible (macOS/Windows local). Linux/Docker no tiene GPU; la cadena del renderizador por software de Chromium se reporta como una GPU típica Mali (ARM) o Mesa (x86) en lugar de SwiftShader.

No oculta que la sesión se controla a través de Chrome DevTools Protocol, y no es una forma de eludir la seguridad del sitio, los CAPTCHA ni los controles de acceso. Utilícelo para workflows que esté autorizado a ejecutar: herramientas internas, sus propios sitios y automatización de navegador permitida.

El modo Run Code no cambia: los scripts personalizados lanzan Chromium por sí mismos.

## Network Capture

Habilite `playwrightCaptureNetwork` para recopilar datos de depuración adicionales durante la ejecución:

- `networkRequests` – Respuestas JSON/API capturadas
- `cookies` – Cookies del navegador al final de la ejecución
- `localStorage` – Pares clave-valor de `localStorage` del navegador
- `sessionStorage` – Pares clave-valor de `sessionStorage` del navegador

Esto resulta útil cuando necesita inspeccionar llamadas API ocultas, el estado de autenticación o datos del lado del navegador después de un flujo automatizado.

## Cookie Bootstrap And Login Fallback

Habilite `playwrightAuthEnabled` cuando desee que Playwright abra una página ya autenticada.

### Auth State Source

Establezca `playwrightAuthStateExpression` en una expresión como `$global.authState`. El valor puede ser:

- Un objeto `storageState` de Playwright: `{"cookies": [...], "origins": [...]}`
- Un array `cookies[]` sin procesar
- Una cadena JSON que contenga cualquiera de las dos formas

Patrón recomendado:

1. Ejecute un nodo Playwright con la captura de red o el auth bootstrap habilitados
2. Almacene `$playwrightNode.cookies` o un objeto de estado de autenticación completo en una [Global Variable](../reference/global-variables.md)
3. Reutilice esa variable en nodos Playwright posteriores mediante `$global.authState`

### Auth Check

El primer paso principal de Playwright debe ser `navigate`. Una vez que ese paso se carga, Heym comprueba `playwrightAuthCheckSelector`.

- Si el selector es visible, los pasos principales restantes continúan con normalidad
- Si el selector no está presente, Heym ejecuta `playwrightAuthFallbackSteps`
- Una vez completados los pasos de respaldo, Heym comprueba de nuevo el mismo selector
- Si el selector sigue sin estar presente, el nodo falla con un error de auth bootstrap

Los pasos de respaldo se encargan de la navegación tras un fallo de autenticación. Deben dejar el navegador en la página autenticada que espera el resto del flujo principal.

## Output Fields

- `$playwrightNode.status` – `"ok"` en caso de éxito
- `$playwrightNode.results` – Salidas de los pasos (getText, getHTML, getVisibleTextOnPage, getAttribute, claves de screenshot, etc.)
- `$playwrightNode.screenshot` – Captura de pantalla en Base64 cuando un paso guarda una
- `$playwrightNode.cookies` – Cookies finales del navegador cuando el auth bootstrap o la captura de red están habilitados
- `$playwrightNode.networkRequests` – Respuestas de red capturadas (cuando está habilitado)
- `$playwrightNode.localStorage` – Almacenamiento local del navegador (cuando está habilitado)
- `$playwrightNode.sessionStorage` – Almacenamiento de sesión del navegador (cuando está habilitado)

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
## Modo Run Code

En el Panel de Propiedades, establezca **Mode** en **Run Code** para editar `playwrightCode` en lugar de los pasos visuales. El bootstrap de autenticación se aplica únicamente al modo Steps.

Ejemplo (sandbox / Docker — Chromium necesita `--no-sandbox`):

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

El wrapper proporciona `inputs`, `headless`, `timeout_ms` y `capture_network`. Puede incrustar expresiones `$nodeLabel.field` en el código; imprima JSON con `status` y `results`.

## Seguridad del código personalizado

El campo `playwrightCode` ejecuta Python arbitrario. Dado que esto equivale a ejecución de código, está **deshabilitado por defecto** y, cuando se habilita, se ejecuta en un sandbox:

- **Deshabilitado por defecto.** La ejecución de un nodo que tenga `playwrightCode` configurado falla con un error claro a menos que un operador establezca `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. La comprobación se ejecuta en el momento de la ejecución, por lo que también cubre workflows guardados previamente y ejecuciones programadas / de sub-workflow.
- **Aislado cuando se habilita.** El código personalizado no se ejecuta en el proceso del backend. Se ejecuta en un contenedor hermano endurecido y desechable, sin socket de Docker, sin bind mounts del backend, sin secretos del backend en su entorno, con capacidades reducidas, `no-new-privileges` y límites de CPU / memoria / PID. Si Docker no está disponible, la ejecución falla de forma segura. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` opta por volver a la ruta en proceso, solo para uso confiable o de desarrollo local (no es una frontera de seguridad). El `./run.sh` nativo usa `subprocess` por defecto cuando no se establece `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) y la imagen única de GHCR resuelven el runner hermano mediante `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (con fallback a `HEYM_CODEX_DOCKER_IMAGE`) y utilizan la ruta de venv correspondiente (`/app/.venv` vs `/app/backend/.venv`).
- **Nota sobre Chromium.** El contenedor del sandbox se ejecuta como root por defecto, y Chromium se niega a ejecutarse como root sin `--no-sandbox`. El código personalizado que lance Chromium debe pasarlo, por ejemplo `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Los lanzamientos basados en pasos (y stealth) también pasan `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` para que los scripts de fingerprint no puedan abrir STUN UDP hacia `stun.l.google.com:19302`. Las llamadas personalizadas a `chromium.launch` también deben incluir ese flag.

Los nodos de Playwright basados en pasos (`playwrightSteps`) son generados íntegramente por Heym (sin código arbitrario), no se ven afectados por todo lo anterior y están siempre disponibles — se recomienda su uso.

## Relacionado

- [Tipos de nodo](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Nodo Crawler](./crawler-node.md) – Web scraping más sencillo con FlareSolverr
- [Compartir credenciales](../reference/credentials-sharing.md) – Credenciales de LLM para pasos de IA
