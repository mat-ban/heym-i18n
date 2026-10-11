# Playwright

Uzel **Playwright** automatizuje interakce s prohlížečem pomocí konfigurovatelných kroků. Využijte jej pro web scraping, vyplňování formulářů a workflow založené na prohlížeči.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.results`, `$nodeLabel.screenshot` a volitelná data o síti/prohlížeči |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (výchozí) nebo `"code"` (Run Code). Zvolte v rozbalovacím seznamu Mode v panelu vlastností |
| `playwrightSteps` | array | Kroky: navigate, click, type, aiStep atd. Každý krok má akci a selektor/parametry. `disabled: true` ponechá krok v seznamu, ale při běhu jej přeskočí |
| `playwrightCode` | string | Vlastní Playwright Python použitý, když je Mode nastaven na Run Code. Spouští se v zabezpečeném sandboxu a je **ve výchozím stavu zakázán** — viz bezpečnostní poznámka níže |
| `playwrightHeadless` | boolean | Spustit headless (výchozí: true) |
| `playwrightStealth` | boolean | Volitelné nastavení režimu Steps, které potlačuje běžné signály automatizace Playwright (výchozí: false). Popisek v panelu vlastností: Reduce automation flags |
| `playwrightTimeout` | number | Časový limit v ms (výchozí: 30000) |
| `playwrightCaptureNetwork` | boolean | Zachytit JSON odpovědi, hlavičky, cookies a úložiště prohlížeče |
| `playwrightAuthEnabled` | boolean | Obnovit autentizaci prohlížeče z cookies/storageState před spuštěním kroků |
| `playwrightAuthStateExpression` | string | Výraz nebo JSON, který se vyhodnotí na Playwright `storageState` nebo surové `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selektor, který musí být po bootstrapu autentizace viditelný |
| `playwrightAuthCheckTimeout` | number | Časový limit v ms pro kontrolu selektoru po autentizaci (výchozí: 5000) |
| `playwrightAuthFallbackSteps` | array | Záložní kroky pouze pro přihlášení, které se spustí, když obnovení cookies neautentizuje stránku |

## Typy kroků

- **navigate** – Přejít na URL
- **refresh** – Znovu načíst aktuální stránku (volitelný `timeout` kroku v ms pro navigaci při opětovném načtení)
- **click** – Kliknout na prvek podle selektoru
- **type** – Napsat text do vstupu (znak po znaku)
- **fill** – Vyplnit hodnotu vstupu
- **wait** – Čekat po určitou dobu (ms)
- **screenshot** – Pořídit snímek obrazovky (`outputKey` uloží base64 do results)
- **getText** – Textový obsah prvku (`selector`, volitelný `outputKey`)
- **getAttribute** – Hodnota atributu (`selector`, `attribute`, volitelný `outputKey`)
- **getHTML** – Vnější HTML prvku (`selector`, volitelný `outputKey`)
- **getVisibleTextOnPage** – Viditelný text celé stránky jako `document.body.innerText` (bez selektoru; použijte `outputKey`; volitelný `timeout` kroku v ms čeká před zachycením)
- **hover** – Najetí myší na prvek
- **selectOption** – Vybrat možnost v `<select>`
- **scrollDown** / **scrollUp** – Posun kolečkem myši (volitelný `amount` v pixelech)
- **aiStep** – LLM vrací stejné druhy akcí jako ruční kroky (viz níže); vnořený `aiStep` není podporován

## Vypnutí kroku

Každý krok má ve své hlavičce přepínač napájení. Vypnutý krok se zobrazuje s přeškrtnutým a ztlumeným názvem, zůstává v seznamu se všemi svými poli a při spuštění uzlu se přeskočí — což je užitečné pro izolaci selhávajícího selektoru bez smazání práce. Uložený krok nese `disabled: true`; kroky bez tohoto příznaku se spouštějí normálně.

Vypnuté kroky jsou pro zbytek uzlu neviditelné: nesplňují pravidlo bootstrapu autentizace „první krok musí být `navigate`", vypnutý `aiStep` neprovádí volání LLM a vypnuté položky v `playwrightAuthFallbackSteps` se také přeskočí. Vypnutí všech kroků způsobí selhání běhu se zprávou, která Vás vyzve k povolení alespoň jednoho kroku.

## AI Step

Akce **aiStep** využívá LLM k analýze HTML stránky (a volitelně snímku obrazovky) a generuje akce Playwright z instrukcí v přirozeném jazyce. API přijímá stejné názvy akcí jako ruční kroky (včetně `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, posunů atd.). **Auto heal** nahrazuje pouze selhané kroky založené na selektoru alternativami pro click, type, fill, hover a selectOption.

| Možnost | Popis |
|--------|-------------|
| `instructions` | Co má AI udělat (např. „Klikni na tlačítko Login") |
| `credentialId` | Přihlašovací údaje LLM (OpenAI, Google nebo Custom) |
| `model` | Prohledávatelný seznam modelů z vybraných přihlašovacích údajů LLM |
| `saveStepsForFuture` | Uložit vygenerované kroky pro příští běhy (vyhne se volání LLM) |
| `sendScreenshot` | Odeslat snímek obrazovky LLM pro vizuální prvky |
| `aiStepTimeout` | Časový limit pro volání LLM v ms (výchozí 30000) |

### AI Auto Heal

**AI Auto Heal** činí workflow odolnými vůči změnám DOM. Když selektor selže dvakrát (např. po redesignu webu), Heym zavolá LLM, aby našel alternativní lokátor — typicky `role=button[name='Submit']` nebo `text=Exact text` místo CSS selektorů.

Povolte **Auto heal mode** ve vlastnostech AI kroku. Pokud uložený krok selže:

1. Heym zachytí aktuální HTML a snímek obrazovky
2. Odešle selhaný krok + kontext stránky LLM
3. LLM vrátí robustní alternativu (lokátor založený na roli, textový lokátor nebo záložní CSS)
4. Zopakuje pokus s novým selektorem

To snižuje nestabilitu, když weby aktualizují své značkování nebo názvy tříd.
## Omezení automatizačních příznaků

Zapněte **Reduce automation flags** (`playwrightStealth: true`), pokud web považuje Chromium přibalené k Playwright za bota kvůli standardním automatizačním signálům (`HeadlessChrome` v user agentu, `navigator.webdriver`, chybějící `window.chrome`).

Tato volba se uplatní pouze v režimu **Steps**. Provádí následující:

- Odstraní příznak Chromia `--enable-automation` a nastaví `--disable-blink-features=AutomationControlled`
- Odesílá standardní user agent prohlížeče Chrome (bez `HeadlessChrome`)
- Obnoví běžná rozhraní prohlížeče, která Playwright ponechává prázdná (`window.chrome`, pluginy)
- Ponechá renderer GPU hostitele nezměněný, pokud je GPU k dispozici (lokální macOS/Windows). Linux/Docker GPU nemá; řetězec softwarového rendereru Chromia je namísto SwiftShader hlášen jako typické GPU Mali (ARM) nebo Mesa (x86).

Neskrývá, že je relace řízena přes Chrome DevTools Protocol, a není způsobem, jak obejít zabezpečení webu, CAPTCHA ani řízení přístupu. Používejte ji pro workflow, k jejichž spuštění jste oprávněni — interní nástroje, vlastní weby a povolenou automatizaci prohlížeče.

Režim Run Code zůstává nezměněn — vlastní skripty spouštějí Chromium samy.

## Network Capture

Zapněte `playwrightCaptureNetwork` pro sběr dodatečných ladicích dat během spuštění:

- `networkRequests` – Zachycené JSON/API odpovědi
- `cookies` – Cookies prohlížeče na konci spuštění
- `localStorage` – Páry klíč-hodnota z `localStorage` prohlížeče
- `sessionStorage` – Páry klíč-hodnota z `sessionStorage` prohlížeče

To je užitečné, když potřebujete po automatizovaném toku prozkoumat skrytá volání API, stav autentizace nebo data na straně prohlížeče.

## Bootstrap cookies a záložní přihlášení

Zapněte `playwrightAuthEnabled`, pokud chcete, aby Playwright otevřel stránku již přihlášený.

### Zdroj stavu autentizace

Nastavte `playwrightAuthStateExpression` na výraz, jako je `$global.authState`. Hodnota může být:

- Objekt `storageState` pro Playwright: `{"cookies": [...], "origins": [...]}`
- Surové pole `cookies[]`
- JSON řetězec obsahující některý z těchto tvarů

Doporučený postup:

1. Spusťte uzel Playwright se zapnutým zachytáváním sítě nebo bootstrapem autentizace
2. Uložte `$playwrightNode.cookies` nebo celý objekt stavu autentizace do [Global Variable](../reference/global-variables.md)
3. Znovu použijte tuto proměnnou v dalších uzlech Playwright přes `$global.authState`

### Kontrola autentizace

Prvním hlavním krokem Playwright musí být `navigate`. Po načtení tohoto kroku Heym zkontroluje `playwrightAuthCheckSelector`.

- Pokud je selektor viditelný, zbývající hlavní kroky pokračují normálně
- Pokud selektor chybí, Heym spustí `playwrightAuthFallbackSteps`
- Po dokončení záložních kroků Heym zkontroluje stejný selektor znovu
- Pokud selektor stále chybí, uzel selže s chybou bootstrapu autentizace

Záložní kroky přebírají navigaci po selhání autentizace. Měly by zanechat prohlížeč na autentizované stránce očekávané zbytkem hlavního toku.

## Výstupní pole

- `$playwrightNode.status` – `"ok"` při úspěchu
- `$playwrightNode.results` – Výstupy kroků (getText, getHTML, getVisibleTextOnPage, getAttribute, klíče screenshotů atd.)
- `$playwrightNode.screenshot` – Screenshot v Base64, pokud jej krok uloží
- `$playwrightNode.cookies` – Konečné cookies prohlížeče, pokud je zapnutý bootstrap autentizace nebo zachytávání sítě
- `$playwrightNode.networkRequests` – Zachycené síťové odpovědi (pokud je zapnuto)
- `$playwrightNode.localStorage` – Local storage prohlížeče (pokud je zapnuto)
- `$playwrightNode.sessionStorage` – Session storage prohlížeče (pokud je zapnuto)

## Příklad

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

## Režim Run Code

V panelu vlastností nastavte **Mode** na **Run Code**, chcete-li upravovat `playwrightCode` namísto vizuálních kroků. Bootstrap autentizace se uplatní pouze v režimu Steps.

Příklad (sandbox / Docker — Chromium vyžaduje `--no-sandbox`):

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

Wrapper poskytuje `inputs`, `headless`, `timeout_ms` a `capture_network`. Do kódu můžete vložit výrazy `$nodeLabel.field`; vypište JSON s `status` a `results`.
## Zabezpečení vlastního kódu

Pole `playwrightCode` spouští libovolný Python kód. Jelikož se jedná o ekvivalent spuštění kódu, je **ve výchozím stavu zakázáno** a pokud je povoleno, běží v sandboxu:

- **Ve výchozím stavu zakázáno.** Spuštění uzlu, který má nastaveno `playwrightCode`, selže s jasnou chybou, pokud operátor nenastaví `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Kontrola probíhá v okamžiku spuštění, takže pokrývá i dříve uložené workflow a spuštění plánů / podřízených workflow.
- **Při povolení izolováno.** Vlastní kód neběží v procesu backendu. Běží v zabezpečeném, jednorázovém sourozeneckém kontejneru bez Docker socketu, bez bind mountů backendu, bez tajných údajů backendu v jeho prostředí, s odebranými oprávněními (capabilities), `no-new-privileges` a limity CPU / paměti / PID. Pokud Docker není dostupný, spuštění selže bezpečně (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` přepíná zpět na cestu v rámci procesu pouze pro důvěryhodné nebo lokální vývojové použití (není bezpečnostní hranicí). Nativní `./run.sh` standardně používá `subprocess`, pokud není nastaven `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) a samostatný image GHCR řeší sourozenecký runner přes `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (s fallbackem na `HEYM_CODEX_DOCKER_IMAGE`) a používají odpovídající cestu k venv (`/app/.venv` vs `/app/backend/.venv`).
- **Poznámka k Chromiu.** Sandbox kontejner standardně běží jako root a Chromium odmítá běžet jako root bez `--no-sandbox`. Vlastní kód, který spouští Chromium, by jej měl předat, například `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Spuštění založená na krocích (a stealth) také předávají `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, aby fingerprint skripty nemohly otevřít STUN UDP na `stun.l.google.com:19302`. Vlastní volání `chromium.launch` by měla tento přepínač také obsahovat.

Playwright uzly založené na krocích (`playwrightSteps`) jsou plně generovány systémem Heym (žádný libovolný kód), nejsou ovlivněny výše uvedeným a jsou vždy dostupné — upřednostněte je.

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Uzel Crawler](./crawler-node.md) – Jednodušší web scraping s FlareSolverr
- [Sdílení přihlašovacích údajů](../reference/credentials-sharing.md) – LLM přihlašovací údaje pro AI kroky
