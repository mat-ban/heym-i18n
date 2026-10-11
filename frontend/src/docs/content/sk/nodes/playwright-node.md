# Playwright

Uzol **Playwright** automatizuje interakcie s prehliadačom pomocou konfigurovateľných krokov. Použite ho na web scraping, vypĺňanie formulárov a workflowy založené na prehliadači.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.results`, `$nodeLabel.screenshot` a voliteľné sieťové/údaje prehliadača |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (predvolené) alebo `"code"` (Spustiť kód). Vyberte v rozbaľovacom menu Režim v paneli vlastností |
| `playwrightSteps` | array | Kroky: navigate, click, type, aiStep atď. Každý krok má akciu a selektor/parametre. `disabled: true` ponechá krok v zozname, ale pri spustení ho preskočí |
| `playwrightCode` | string | Vlastný Playwright Python použitý, keď je Režim nastavený na Spustiť kód. Spúšťa sa v zabezpečenom sandboxe a je **predvolene zakázaný** — pozrite bezpečnostnú poznámku nižšie |
| `playwrightHeadless` | boolean | Spustiť headless (predvolené: true) |
| `playwrightStealth` | boolean | Voliteľné nastavenie v režime Kroky, ktoré potláča bežné signály automatizácie Playwright (predvolené: false). Označenie v paneli vlastností: Znížiť príznaky automatizácie |
| `playwrightTimeout` | number | Časový limit v ms (predvolené: 30000) |
| `playwrightCaptureNetwork` | boolean | Zachytiť JSON odpovede, hlavičky, cookies a úložisko prehliadača |
| `playwrightAuthEnabled` | boolean | Obnoviť autentifikáciu prehliadača z cookies/storageState pred spustením krokov |
| `playwrightAuthStateExpression` | string | Výraz alebo JSON, ktorý sa vyhodnotí na Playwright `storageState` alebo surové `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selektor, ktorý musí byť viditeľný po inicializácii autentifikácie |
| `playwrightAuthCheckTimeout` | number | Časový limit v ms pre kontrolu autentifikovaného selektora (predvolené: 5000) |
| `playwrightAuthFallbackSteps` | array | Záložné kroky iba na prihlásenie, ktoré sa spustia, keď obnovenie cookies neautentifikuje stránku |

## Typy krokov

- **navigate** – Prejsť na URL
- **refresh** – Znovu načítať aktuálnu stránku (voliteľný `timeout` kroku v ms pre navigáciu pri opätovnom načítaní)
- **click** – Kliknúť na prvok podľa selektora
- **type** – Zadať text do vstupu (znak po znaku)
- **fill** – Vyplniť hodnotu vstupu
- **wait** – Čakať na časový limit (ms)
- **screenshot** – Zachytiť snímku obrazovky (`outputKey` uloží base64 do results)
- **getText** – Textový obsah prvku (`selector`, voliteľný `outputKey`)
- **getAttribute** – Hodnota atribútu (`selector`, `attribute`, voliteľný `outputKey`)
- **getHTML** – Vonkajšie HTML prvku (`selector`, voliteľný `outputKey`)
- **getVisibleTextOnPage** – Viditeľný text celej stránky ako `document.body.innerText` (bez selektora; použite `outputKey`; voliteľný `timeout` kroku v ms čaká pred zachytením)
- **hover** – Prejsť myšou nad prvkom
- **selectOption** – Vybrať možnosť v `<select>`
- **scrollDown** / **scrollUp** – Posun kolieskom myši (voliteľný `amount` v pixeloch)
- **aiStep** – LLM vráti rovnaké druhy akcií ako manuálne kroky (pozrite nižšie); vnorený `aiStep` nie je podporovaný

## Vypnutie kroku

Každý krok má v hlavičke prepínač napájania. Vypnutý krok sa zobrazuje s prečiarknutým a stlmeným názvom, zostáva v zozname so všetkými svojimi poľami a pri spustení uzla sa preskočí — užitočné na izolovanie zlyhávajúceho selektora bez odstránenia práce. Uložený krok nesie `disabled: true`; kroky bez tohto príznaku sa spúšťajú normálne.

Vypnuté kroky sú pre zvyšok uzla neviditeľné: nespĺňajú pravidlo „prvý krok musí byť `navigate`" pri inicializácii autentifikácie, vypnutý `aiStep` nevykoná žiadne volanie LLM a vypnuté položky v `playwrightAuthFallbackSteps` sa tiež preskočia. Vypnutie všetkých krokov spôsobí zlyhanie spustenia so správou, ktorá vás vyzve povoliť aspoň jeden.

## AI krok

Akcia **aiStep** používa LLM na analýzu HTML stránky (a voliteľne snímky obrazovky) a generuje akcie Playwright z inštrukcií v prirodzenom jazyku. API akceptuje rovnaké názvy akcií ako manuálne kroky (vrátane `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, posunov atď.). **Auto heal** nahrádza iba zlyhávajúce kroky založené na selektoroch alternatívami pre click, type, fill, hover a selectOption.

| Možnosť | Popis |
|--------|-------------|
| `instructions` | Čo má AI urobiť (napr. „Klikni na tlačidlo Login") |
| `credentialId` | Prihlasovacie údaje LLM (OpenAI, Google alebo Custom) |
| `model` | Prehľadávateľný zoznam modelov z vybraných prihlasovacích údajov LLM |
| `saveStepsForFuture` | Uložiť vygenerované kroky do vyrovnávacej pamäte pre ďalšie spustenia (vyhne sa volaniu LLM) |
| `sendScreenshot` | Poslať snímku obrazovky LLM pre vizuálne prvky |
| `aiStepTimeout` | Časový limit pre volanie LLM v ms (predvolené 30000) |

### AI Auto Heal

**AI Auto Heal** robí workflowy odolné voči zmenám DOM. Keď selektor zlyhá dvakrát (napr. po redizajne stránky), Heym zavolá LLM, aby našiel alternatívny lokátor — typicky `role=button[name='Submit']` alebo `text=Exact text` namiesto CSS selektorov.

Povoľte **Režim Auto heal** vo vlastnostiach AI kroku. Ak uložený krok zlyhá:

1. Heym zachytí aktuálne HTML a snímku obrazovky
2. Pošle zlyhávajúci krok + kontext stránky LLM
3. LLM vráti robustnú alternatívu (lokátor založený na role, textový lokátor alebo záložný CSS)
4. Zopakuje pokus s novým selektorom

Tým sa znižuje nestabilita, keď stránky aktualizujú svoje označenie alebo názvy tried.
## Zníženie automatizačných príznakov

Zapnite **Zníženie automatizačných príznakov** (`playwrightStealth: true`), keď stránka považuje Chromium priložené k Playwright za bota kvôli štandardným automatizačným signálom (`HeadlessChrome` v user agentovi, `navigator.webdriver`, chýbajúce `window.chrome`).

Táto možnosť sa uplatňuje iba v režime **Steps**. Robí nasledovné:

- Odstráni príznak `--enable-automation` prehliadača Chromium a nastaví `--disable-blink-features=AutomationControlled`
- Odosiela štandardný Chrome user agent (bez `HeadlessChrome`)
- Obnoví bežné povrchy prehliadača, ktoré Playwright necháva prázdne (`window.chrome`, pluginy)
- Ponecháva renderer GPU hostiteľa nezmenený, keď je GPU dostupné (lokálne macOS/Windows). Linux/Docker nemá GPU; reťazec softvérového renderera Chromium sa namiesto SwiftShader hlási ako typické GPU Mali (ARM) alebo Mesa (x86).

Neskrýva, že relácia je riadená prostredníctvom Chrome DevTools Protocol, a nie je spôsobom, ako obísť zabezpečenie stránky, CAPTCHA alebo riadenie prístupu. Použite ho pre workflowy, ktoré ste oprávnení spúšťať — interné nástroje, vlastné stránky a povolenú automatizáciu prehliadača.

Režim Run Code zostáva nezmenený — vlastné skripty spúšťajú Chromium samy.

## Zachytávanie siete

Zapnite `playwrightCaptureNetwork` na zhromažďovanie dodatočných ladiacich údajov počas spustenia:

- `networkRequests` – Zachytené JSON/API odpovede
- `cookies` – Cookies prehliadača na konci spustenia
- `localStorage` – Páry kľúč-hodnota v `localStorage` prehliadača
- `sessionStorage` – Páry kľúč-hodnota v `sessionStorage` prehliadača

To je užitočné, keď potrebujete preskúmať skryté API volania, stav autentifikácie alebo údaje na strane prehliadača po automatizovanom toku.

## Bootstrap cookies a záložné prihlásenie

Zapnite `playwrightAuthEnabled`, keď chcete, aby Playwright otvoril stránku už prihlásený.

### Zdroj stavu autentifikácie

Nastavte `playwrightAuthStateExpression` na výraz, ako napríklad `$global.authState`. Hodnota môže byť:

- Objekt `storageState` pre Playwright: `{"cookies": [...], "origins": [...]}`
- Surové pole `cookies[]`
- JSON reťazec obsahujúci jeden z týchto tvarov

Odporúčaný postup:

1. Spustite uzol Playwright so zapnutým zachytávaním siete alebo bootstrapom autentifikácie
2. Uložte `$playwrightNode.cookies` alebo celý objekt stavu autentifikácie do [Globálnej premennej](../reference/global-variables.md)
3. Znovu použite túto premennú v neskorších uzloch Playwright prostredníctvom `$global.authState`

### Kontrola autentifikácie

Prvý hlavný krok Playwright musí byť `navigate`. Po načítaní tohto kroku Heym skontroluje `playwrightAuthCheckSelector`.

- Ak je selektor viditeľný, zostávajúce hlavné kroky pokračujú normálne
- Ak selektor chýba, Heym spustí `playwrightAuthFallbackSteps`
- Po dokončení záložných krokov Heym znova skontroluje ten istý selektor
- Ak selektor stále chýba, uzol zlyhá s chybou bootstrapu autentifikácie

Záložné kroky vlastnia navigáciu po zlyhaní autentifikácie. Mali by ponechať prehliadač na autentifikovanej stránke, ktorú očakáva zvyšok hlavného toku.

## Výstupné polia

- `$playwrightNode.status` – `"ok"` pri úspechu
- `$playwrightNode.results` – Výstupy krokov (getText, getHTML, getVisibleTextOnPage, getAttribute, kľúče snímok obrazovky atď.)
- `$playwrightNode.screenshot` – Snímka obrazovky v Base64, keď ju krok uloží
- `$playwrightNode.cookies` – Konečné cookies prehliadača, keď je zapnutý bootstrap autentifikácie alebo zachytávanie siete
- `$playwrightNode.networkRequests` – Zachytené sieťové odpovede (keď je zapnuté)
- `$playwrightNode.localStorage` – Lokálne úložisko prehliadača (keď je zapnuté)
- `$playwrightNode.sessionStorage` – Úložisko relácie prehliadača (keď je zapnuté)

## Príklad

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

V paneli vlastností nastavte **Mode** na **Run Code**, aby ste upravovali `playwrightCode` namiesto vizuálnych krokov. Bootstrap autentifikácie sa uplatňuje iba v režime Steps.

Príklad (sandbox / Docker — Chromium potrebuje `--no-sandbox`):

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

Wrapper poskytuje `inputs`, `headless`, `timeout_ms` a `capture_network`. Do kódu môžete vložiť výrazy `$nodeLabel.field`; vypíšte JSON s `status` a `results`.
## Zabezpečenie vlastného kódu

Pole `playwrightCode` spúšťa ľubovoľný Python kód. Keďže to je ekvivalent spustenia kódu, je **predvolene zakázané** a v prípade povolenia je spúšťané v sandboxe:

- **Predvolene zakázané.** Spustenie uzla, ktorý má nastavené `playwrightCode`, zlyhá s jasnou chybou, pokiaľ operátor nenastaví `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Kontrola prebieha v čase spustenia, takže pokrýva aj predtým uložené workflowy a spustenia podľa plánu / spustenia pod-workflowov.
- **Izolované, keď je povolené.** Vlastný kód sa nespúšťa v procese backendu. Spúšťa sa v zabezpečenom, jednorazovom súbežnom kontajneri bez Docker socketu, bez backend bind mounts, bez backend secrets v jeho prostredí, so zrušenými capabilities, `no-new-privileges` a limitmi CPU / pamäte / PID. Ak Docker nie je dostupný, spustenie zlyhá bezpečne (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` sa vracia k ceste v rámci procesu len pre dôveryhodné alebo lokálne vývojové použitie (nie je to bezpečnostná hranica). Natívny `./run.sh` predvolene používa `subprocess`, keď nie je nastavené `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) a samostatný image GHCR riešia súbežný runner cez `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (s návratom na `HEYM_CODEX_DOCKER_IMAGE`) a používajú zodpovedajúcu cestu venv (`/app/.venv` vs `/app/backend/.venv`).
- **Poznámka k Chromium.** Sandbox kontajner sa predvolene spúšťa ako root a Chromium odmieta spustenie ako root bez `--no-sandbox`. Vlastný kód, ktorý spúšťa Chromium, by ho mal odovzdať, napríklad `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Spustenia založené na krokoch (a stealth) tiež odovzdávajú `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, aby fingerprint skripty nemohli otvoriť STUN UDP na `stun.l.google.com:19302`. Vlastné volania `chromium.launch` by mali tento flag obsahovať tiež.

Playwright uzly založené na krokoch (`playwrightSteps`) sú plne generované systémom Heym (žiadny ľubovoľný kód), nie sú ovplyvnené ničím z vyššie uvedeného a sú vždy dostupné — uprednostnite ich.

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Uzol Crawler](./crawler-node.md) – Jednoduchšie web scraping so FlareSolverr
- [Zdieľanie prihlasovacích údajov](../reference/credentials-sharing.md) – LLM prihlasovacie údaje pre AI kroky
