# Playwright

Węzeł **Playwright** automatyzuje interakcje z przeglądarką przy użyciu konfigurowalnych kroków. Znajduje zastosowanie w scrapowaniu stron internetowych, wypełnianiu formularzy oraz workflow opartych na przeglądarce.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.results`, `$nodeLabel.screenshot` oraz opcjonalne dane sieciowe/przeglądarki |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (domyślnie) lub `"code"` (Run Code). Wybór w rozwijanym menu Mode w panelu właściwości |
| `playwrightSteps` | array | Kroki: navigate, click, type, aiStep itp. Każdy krok ma akcję oraz selektor/parametry. `disabled: true` pozostawia krok na liście, ale pomija go w czasie wykonania |
| `playwrightCode` | string | Własny kod Playwright w Pythonie używany, gdy Mode ma wartość Run Code. Uruchamiany w wzmocnionym sandboxie i **domyślnie wyłączony** — patrz uwaga dotycząca bezpieczeństwa poniżej |
| `playwrightHeadless` | boolean | Uruchomienie w trybie headless (domyślnie: true) |
| `playwrightStealth` | boolean | Opcjonalne ustawienie trybu Steps, które redukuje typowe sygnały automatyzacji Playwright (domyślnie: false). Etykieta w panelu właściwości: Reduce automation flags |
| `playwrightTimeout` | number | Limit czasu w ms (domyślnie: 30000) |
| `playwrightCaptureNetwork` | boolean | Przechwytywanie odpowiedzi JSON, nagłówków, plików cookie oraz pamięci przeglądarki |
| `playwrightAuthEnabled` | boolean | Przywrócenie uwierzytelnienia przeglądarki z plików cookie/storageState przed uruchomieniem kroków |
| `playwrightAuthStateExpression` | string | Wyrażenie lub JSON, które zwraca Playwright `storageState` lub surowe `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selektor, który musi być widoczny po inicjalizacji uwierzytelnienia |
| `playwrightAuthCheckTimeout` | number | Limit czasu w ms dla sprawdzenia selektora uwierzytelnienia (domyślnie: 5000) |
| `playwrightAuthFallbackSteps` | array | Kroki awaryjne wyłącznie do logowania, uruchamiane, gdy przywrócenie plików cookie nie uwierzytelni strony |

## Typy kroków

- **navigate** – Przejście do adresu URL
- **refresh** – Ponowne załadowanie bieżącej strony (opcjonalny `timeout` kroku w ms dla nawigacji przeładowania)
- **click** – Kliknięcie elementu po selektorze
- **type** – Wpisanie tekstu do pola (znak po znaku)
- **fill** – Wypełnienie wartości pola
- **wait** – Oczekiwanie przez określony czas (ms)
- **screenshot** – Wykonanie zrzutu ekranu (`outputKey` zapisuje base64 w results)
- **getText** – Treść tekstowa elementu (`selector`, opcjonalny `outputKey`)
- **getAttribute** – Wartość atrybutu (`selector`, `attribute`, opcjonalny `outputKey`)
- **getHTML** – Zewnętrzny HTML elementu (`selector`, opcjonalny `outputKey`)
- **getVisibleTextOnPage** – Pełny widoczny tekst strony jako `document.body.innerText` (bez selektora; należy użyć `outputKey`; opcjonalny `timeout` kroku w ms oczekuje przed przechwyceniem)
- **hover** – Najechanie na element
- **selectOption** – Wybór opcji w elemencie `<select>`
- **scrollDown** / **scrollUp** – Przewijanie kółkiem myszy (opcjonalny `amount` w pikselach)
- **aiStep** – LLM zwraca te same rodzaje akcji co kroki manualne (patrz poniżej); zagnieżdżony `aiStep` nie jest obsługiwany

## Wyłączanie kroku

Każdy krok ma przełącznik zasilania w swoim nagłówku. Wyłączony krok wyświetla tytuł przekreślony i przygaszony, pozostaje na liście ze wszystkimi polami i jest pomijany podczas uruchomienia węzła — przydatne do wyizolowania niedziałającego selektora bez usuwania pracy. Zapisany krok zawiera `disabled: true`; kroki bez tej flagi działają normalnie.

Wyłączone kroki są niewidoczne dla reszty węzła: nie spełniają reguły „pierwszy krok musi być `navigate`" inicjalizacji uwierzytelnienia, wyłączony `aiStep` nie wykonuje wywołania LLM, a wyłączone wpisy w `playwrightAuthFallbackSteps` również są pomijane. Wyłączenie wszystkich kroków powoduje niepowodzenie uruchomienia z komunikatem o konieczności włączenia jednego z nich.

## Krok AI

Akcja **aiStep** wykorzystuje LLM do analizy HTML strony (oraz opcjonalnie zrzutu ekranu) i generowania akcji Playwright na podstawie instrukcji w języku naturalnym. API akceptuje te same nazwy akcji co kroki manualne (w tym `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, przewijanie itp.). **Auto heal** zastępuje wyłącznie nieudane kroki oparte na selektorach alternatywami dla click, type, fill, hover i selectOption.

| Opcja | Opis |
|--------|-------------|
| `instructions` | Co AI ma zrobić (np. „Kliknij przycisk Login") |
| `credentialId` | Dane logowania LLM (OpenAI, Google lub Custom) |
| `model` | Przeszukiwalna lista modeli z wybranych danych logowania LLM |
| `saveStepsForFuture` | Buforowanie wygenerowanych kroków na przyszłe uruchomienia (pozwala uniknąć wywołania LLM) |
| `sendScreenshot` | Wysłanie zrzutu ekranu do LLM w celu obsługi elementów wizualnych |
| `aiStepTimeout` | Limit czasu wywołania LLM w ms (domyślnie 30000) |

### AI Auto Heal

**AI Auto Heal** czyni workflow odpornymi na zmiany w DOM. Gdy selektor zawiedzie dwukrotnie (np. po redesignie strony), Heym wywołuje LLM w celu znalezienia alternatywnego lokalizatora — zazwyczaj `role=button[name='Submit']` lub `text=Exact text` zamiast selektorów CSS.

Należy włączyć **Auto heal mode** we właściwościach kroku AI. Jeśli zapisany krok zawiedzie:

1. Heym przechwytuje bieżący HTML oraz zrzut ekranu
2. Wysyła nieudany krok + kontekst strony do LLM
3. LLM zwraca solidną alternatywę (lokalizator oparty na roli, lokalizator tekstowy lub awaryjny CSS)
4. Ponawia próbę z nowym selektorem

Zmniejsza to niestabilność, gdy strony aktualizują swoje znaczniki lub nazwy klas.
## Ograniczanie flag automatyzacji

Włącz opcję **Reduce automation flags** (`playwrightStealth: true`), gdy witryna traktuje dołączony do Playwright Chromium jako bota z powodu standardowych sygnałów automatyzacji (`HeadlessChrome` w user agent, `navigator.webdriver`, brak `window.chrome`).

Opcja ta działa wyłącznie w trybie **Steps**. Powoduje ona, że:

- Usuwana jest flaga Chromium `--enable-automation` i ustawiana jest flaga `--disable-blink-features=AutomationControlled`
- Wysyłany jest standardowy user agent Chrome (bez `HeadlessChrome`)
- Przywracane są typowe powierzchnie przeglądarki, które Playwright pozostawia puste (`window.chrome`, wtyczki)
- Renderer GPU hosta pozostaje niezmieniony, gdy GPU jest dostępny (lokalnie macOS/Windows). Linux/Docker nie ma GPU; ciąg renderera programowego Chromium jest raportowany jako typowy GPU Mali (ARM) lub Mesa (x86) zamiast SwiftShader.

Opcja ta nie ukrywa faktu, że sesja jest sterowana przez Chrome DevTools Protocol i nie służy do omijania zabezpieczeń witryny, CAPTCHA ani kontroli dostępu. Należy jej używać w workflow, do których uruchamiania istnieje upoważnienie — narzędzia wewnętrzne, własne witryny oraz dozwolona automatyzacja przeglądarki.

Tryb Run Code pozostaje niezmieniony — skrypty niestandardowe samodzielnie uruchamiają Chromium.

## Przechwytywanie ruchu sieciowego

Włącz opcję `playwrightCaptureNetwork`, aby zbierać dodatkowe dane debugowania podczas uruchomienia:

- `networkRequests` – przechwycone odpowiedzi JSON/API
- `cookies` – cookies przeglądarki na koniec uruchomienia
- `localStorage` – pary klucz-wartość `localStorage` przeglądarki
- `sessionStorage` – pary klucz-wartość `sessionStorage` przeglądarki

Jest to przydatne, gdy zachodzi potrzeba zbadania ukrytych wywołań API, stanu uwierzytelnienia lub danych po stronie przeglądarki po zakończeniu zautomatyzowanego przepływu.

## Bootstrap cookies i mechanizm awaryjny logowania

Włącz opcję `playwrightAuthEnabled`, gdy Playwright ma otworzyć stronę już zalogowany.

### Źródło stanu uwierzytelnienia

Ustaw `playwrightAuthStateExpression` na wyrażenie takie jak `$global.authState`. Wartość może być:

- Obiektem `storageState` Playwright: `{"cookies": [...], "origins": [...]}`
- Surową tablicą `cookies[]`
- Ciągiem JSON zawierającym jedną z powyższych struktur

Zalecany wzorzec:

1. Uruchom węzeł Playwright z włączonym przechwytywaniem ruchu sieciowego lub bootstrapem uwierzytelnienia
2. Zapisz `$playwrightNode.cookies` lub pełny obiekt stanu uwierzytelnienia w [Zmiennej globalnej](../reference/global-variables.md)
3. Użyj ponownie tej zmiennej w kolejnych węzłach Playwright poprzez `$global.authState`

### Sprawdzanie uwierzytelnienia

Pierwszym głównym krokiem Playwright musi być `navigate`. Po załadowaniu tego kroku Heym sprawdza `playwrightAuthCheckSelector`.

- Jeśli selektor jest widoczny, pozostałe główne kroki są kontynuowane normalnie
- Jeśli selektora brakuje, Heym uruchamia `playwrightAuthFallbackSteps`
- Po zakończeniu kroków awaryjnych Heym ponownie sprawdza ten sam selektor
- Jeśli selektora nadal brakuje, węzeł kończy się błędem bootstrapu uwierzytelnienia

Kroki awaryjne przejmują nawigację po niepowodzeniu uwierzytelnienia. Powinny pozostawić przeglądarkę na uwierzytelnionej stronie oczekiwanej przez pozostałą część głównego przepływu.

## Pola wyjściowe

- `$playwrightNode.status` – `"ok"` w przypadku powodzenia
- `$playwrightNode.results` – Wyjścia kroków (getText, getHTML, getVisibleTextOnPage, getAttribute, klucze zrzutów ekranu itp.)
- `$playwrightNode.screenshot` – Zrzut ekranu w formacie Base64, gdy krok go zapisuje
- `$playwrightNode.cookies` – Końcowe cookies przeglądarki, gdy włączony jest bootstrap uwierzytelnienia lub przechwytywanie ruchu sieciowego
- `$playwrightNode.networkRequests` – Przechwycone odpowiedzi sieciowe (gdy włączone)
- `$playwrightNode.localStorage` – Lokalna pamięć przeglądarki (gdy włączona)
- `$playwrightNode.sessionStorage` – Pamięć sesji przeglądarki (gdy włączona)

## Przykład

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

## Tryb Run Code

W panelu właściwości ustaw **Mode** na **Run Code**, aby edytować `playwrightCode` zamiast kroków wizualnych. Bootstrap uwierzytelnienia dotyczy wyłącznie trybu Steps.

Przykład (sandbox / Docker — Chromium wymaga `--no-sandbox`):

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

Wrapper udostępnia `inputs`, `headless`, `timeout_ms` oraz `capture_network`. W kodzie można osadzać wyrażenia `$nodeLabel.field`; należy wypisać JSON z polami `status` i `results`.
## Bezpieczeństwo niestandardowego kodu

Pole `playwrightCode` uruchamia dowolny kod Python. Ponieważ jest to równoznaczne z wykonywaniem kodu, jest ono **domyślnie wyłączone**, a gdy zostanie włączone, działa w piaskownicy:

- **Domyślnie wyłączone.** Wykonanie węzła, w którym ustawiono `playwrightCode`, kończy się niepowodzeniem z czytelnym błędem, o ile operator nie ustawi `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Sprawdzenie następuje w momencie wykonania, więc obejmuje również wcześniej zapisane workflows oraz uruchomienia z Harmonogramów i pod-workflow.
- **Izolacja po włączeniu.** Niestandardowy kod nie jest uruchamiany w procesie backendu. Działa w utwardzonym, jednorazowym kontenerze siostrzanym bez gniazda Docker, bez bind mounts backendu, bez sekretów backendu w swoim środowisku, z obniżonymi uprawnieniami (dropped capabilities), `no-new-privileges` oraz limitami CPU / pamięci / PID. Jeśli Docker jest niedostępny, uruchomienie kończy się w trybie fail-closed. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` przywraca ścieżkę w procesie wyłącznie do użytku zaufanego lub lokalnego środowiska deweloperskiego (nie stanowi granicy bezpieczeństwa). Natywny `./run.sh` domyślnie używa `subprocess`, gdy nie ustawiono `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) oraz pojedynczy obraz GHCR wyznaczają runner siostrzany przez `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (z fallbackiem do `HEYM_CODEX_DOCKER_IMAGE`) i korzystają z pasującej ścieżki venv (`/app/.venv` vs `/app/backend/.venv`).
- **Uwaga dotycząca Chromium.** Kontener piaskownicy domyślnie działa jako root, a Chromium odmawia uruchomienia jako root bez `--no-sandbox`. Niestandardowy kod uruchamiający Chromium powinien przekazać tę flagę, na przykład `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Uruchomienia oparte na krokach (oraz stealth) przekazują również `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, aby skrypty fingerprintingu nie mogły otworzyć STUN UDP do `stun.l.google.com:19302`. Niestandardowe wywołania `chromium.launch` również powinny zawierać tę flagę.

Węzły Playwright oparte na krokach (`playwrightSteps`) są w pełni generowane przez Heym (bez dowolnego kodu), nie podlegają żadnym z powyższych ograniczeń i są zawsze dostępne — zaleca się ich preferowanie.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Węzeł Crawler](./crawler-node.md) – Prostsze web scraping z FlareSolverr
- [Udostępnianie danych logowania](../reference/credentials-sharing.md) – Dane logowania LLM dla kroków AI
