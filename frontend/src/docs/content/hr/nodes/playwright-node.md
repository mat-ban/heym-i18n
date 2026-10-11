# Playwright

**Playwright** čvor automatizira interakcije s preglednicima putem konfigurabilnih koraka. Koristite ga za web scraping, ispunjavanje obrazaca i workflows temeljen na pregledniku.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.results`, `$nodeLabel.screenshot`, i opcionalni podaci o mreži/pregledniku |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `playwrightMode` | string | `"steps"` (zadano) ili `"code"` (Pokreni kod). Odaberite u padajućem izborniku Properties Panel |
| `playwrightSteps` | array | Koraci: navigate, click, type, aiStep, itd. Svaki korak ima akciju i selektor/parametre. `disabled: true` drži korak u popisu, ali ga preskoči tijekom izvođenja |
| `playwrightCode` | string | Prilagođeni Playwright Python koji se koristi kada je način rada Pokreni kod. Izvodi se u pojačanom sandboxu i je **zadano onemogućen** — pogledajte napomenu o sigurnosti u nastavku |
| `playwrightHeadless` | boolean | Izvršavanje bez prikaza (zadano: true) |
| `playwrightStealth` | boolean | Opcija za korake koja smanjuje uobičajene signale automatizacije Playwrighta (zadano: false). Oznaka u Properties Panel: Smanji oznake automatizacije |
| `playwrightTimeout` | number | Timeout u ms (zadano: 30000) |
| `playwrightCaptureNetwork` | boolean | Snimanje JSON odgovora, zaglavlja, kolačića i pohrane preglednika |
| `playwrightAuthEnabled` | boolean | Obnovi autentifikaciju preglednika iz kolačića/storageState prije izvođenja koraka |
| `playwrightAuthStateExpression` | string | Izraz ili JSON koji se rješava u Playwright `storageState` ili sirove `cookies[]` |
| `playwrightAuthCheckSelector` | string | Selektor koji mora biti vidljiv nakon autentifikacije |
| `playwrightAuthCheckTimeout` | number | Timeout u ms za provjeru selektora nakon autentifikacije (zadano: 5000) |
| `playwrightAuthFallbackSteps` | array | Koraci za prijavu koji se izvode kada obnova kolačića ne autentificira stranicu |

## Tipovi koraka

- **navigate** – Idite na URL
- **refresh** – Ponovno učitajte trenutnu stranicu (opcionalni korak `timeout` u ms za ponovno učitavanje)
- **click** – Kliknite element prema selektoru
- **type** – Upisujte tekst u unos (znak po znak)
- **fill** – Ispunite vrijednost unosa
- **wait** – Pričekajte određeni vremenski period (ms)
- **screenshot** – Snimite screenshot (`outputKey` pohranjuje base64 u rezultate)
- **getText** – Tekstualni sadržaj elementa (`selector`, opcionalni `outputKey`)
- **getAttribute** – Vrijednost atributa (`selector`, `attribute`, opcionalni `outputKey`)
- **getHTML** – Vanjski HTML elementa (`selector`, opcionalni `outputKey`)
- **getVisibleTextOnPage** – Cijeli vidljivi tekst stranice kao `document.body.innerText` (bez selektora; koristite `outputKey`; opcionalni korak `timeout` u ms čeka prije snimanja)
- **hover** – Pređite mišem preko elementa
- **selectOption** – Odaberite opciju u `<select>`
- **scrollDown** / **scrollUp** – Pomicanje mišem (opcionalna `amount` u pikselima)
- **aiStep** – LLM vraća iste vrste akcija kao ručni koraci (vidi dolje); ugniježđeni `aiStep` nije podržan

## Isključivanje koraka

Svaki korak ima prekidač za napajanje u svom zaglavlju. Isključeni korak prikazuje svoj naslov prekrižen i prigušen, ostaje u popisu sa svim svojim poljima i preskoči se kada se čvor izvršava — korisno za izoliranje neuspjelog selektora bez brisanja rada. Pohranjeni korak nosi `disabled: true`; koraci bez oznake normalno se izvršavaju.

Onemogućeni koraci su nevidljivi ostatku čvora: ne zadovoljavaju pravilo "prvi korak mora biti `navigate`" za autentifikaciju, onemogućeni `aiStep` ne izvršava LLM poziv, a onemogućeni unosi u `playwrightAuthFallbackSteps` također se preskoče. Isključivanje svih koraka uzrokuje neuspjeh izvođenja s porukom koja vas traži da omogućite jedan.

## AI Korak

Akcija **aiStep** koristi LLM za analizu HTML-a stranice (i opcionalno screenshot) i generira Playwright akcije iz uputa na prirodnom jeziku. API prihvaća iste nazive akcija kao ručni koraci (uključujući `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, pomicanja, itd.). **Auto heal** zamjenjuje samo neuspjele korake temeljene na selektorima s alternativama za click, type, fill, hover i selectOption.

| Opcija | Opis |
|--------|------|
| `instructions` | Što AI treba učiniti (npr. "Kliknite na gumb Prijava") |
| `credentialId` | LLM vjerodajnica (OpenAI, Google ili Prilagođeno) |
| `model` | Pretraživački popis modela iz odabrane LLM vjerodajnice |
| `saveStepsForFuture` | Keširajte generirane korake za sljedeća izvođenja (izbjegava LLM poziv) |
| `sendScreenshot` | Pošaljite screenshot LLM-u za vizualne elemente |
| `aiStepTimeout` | Timeout za LLM poziv u ms (zadano 30000) |

### AI Auto Heal

**AI Auto Heal** čini workflows otpornima na promjene u DOM-u. Kada selektor ne uspije dvaput (npr. nakon redizajna stranice), Heym poziva LLM da pronađe alternativni locator—tipično `role=button[name='Submit']` ili `text=Exact text` umjesto CSS selektora.

Omogućite **Auto heal mode** u svojstvima AI koraka. Ako neuspjeli korak:

1. Heym snima trenutni HTML i screenshot
2. Šalje neuspjeli korak + kontekst stranice LLM-u
3. LLM vraća robusnu alternativu (locator temeljen na ulozi, tekstualni locator ili fallback CSS)
4. Ponovno pokušava s novim selektorom

To smanjuje nestabilnost kada se stranice ažuriraju u svom markup-u ili nazivima klasa.
## Smanjivanje oznaka automatizacije

Omogućite **Smanjivanje oznaka automatizacije** (`playwrightStealth: true`) kada stranica tretira Playwrightov ugrađeni Chromium kao bot zbog standardnih automatizacijskih signala (`HeadlessChrome` u user agentu, `navigator.webdriver`, nedostajući `window.chrome`).

Ova opcija primjenjuje se samo u **Steps** modu. Ona:

- Uklanja Chromiumovu oznaku `--enable-automation` i postavlja `--disable-blink-features=AutomationControlled`
- Šalje standardni Chrome user agent (bez `HeadlessChrome`)
- Obnavlja uobičajene površine preglednika koje Playwright ostavlja praznima (`window.chrome`, dodaci)
- Ostavlja host GPU renderer nepromijenjenim kada je GPU dostupan (lokalni macOS/Windows). Linux/Docker nema GPU; string softverskog renderera Chromiuma izvještava se kao tipični Mali (ARM) ili Mesa (x86) GPU umjesto SwiftShader.

Ovo ne skriva da je sesija vođena preko Chrome DevTools Protocol-a, i nije način za zaobilaženje sigurnosti stranice, CAPTCHAs-a ili kontrola pristupa. Koristite ga za workflows za koje imate ovlaštenje — interne alate, vlastite stranice i dopuštenu automatizaciju preglednika.

Run Code mod ostaje nepromijenjen — prilagođeni skripti pokreću Chromium sami.

## Snimanje mreže

Omogućite `playwrightCaptureNetwork` za prikupljanje dodatnih podataka za otklanjanje pogrešaka tijekom izvođenja:

- `networkRequests` – Snimljeni JSON/API odgovori
- `cookies` – Kolačići preglednika na kraju izvođenja
- `localStorage` – Ključ-vrijednost parovi iz `localStorage` preglednika
- `sessionStorage` – Ključ-vrijednost parovi iz `sessionStorage` preglednika

Ovo je korisno kada trebate pregledati skrivene API pozive, stanje autentifikacije ili podatke na strani preglednika nakon automatiziranog toka.

## Bootstrap kolačića i rezervna prijava

Omogućite `playwrightAuthEnabled` kada želite da Playwright otvori stranicu već prijavljenu.

### Izvor stanja autentifikacije

Postavite `playwrightAuthStateExpression` na izraz kao što je `$global.authState`. Vrijednost može biti:

- Playwright `storageState` objekt: `{"cookies": [...], "origins": [...]}`
- Raw `cookies[]` niz
- JSON string koji sadrži bilo koji oblik

Preporučeni obrazac:

1. Pokrenite Playwright čvor s omogućenom snimkom mreže ili autentifikacijskim bootstrapom
2. Spremite `$playwrightNode.cookies` ili puni objekt stanja autentifikacije u [Globalnu varijablu](../reference/global-variables.md)
3. Ponovno upotrijebite tu varijablu u kasnijim Playwright čvorovima putem `$global.authState`

### Provjera autentifikacije

Prvi glavni Playwright korak mora biti `navigate`. Nakon što se taj korak učita, Heym provjerava `playwrightAuthCheckSelector`.

- Ako je selektor vidljiv, preostali glavni koraci nastavljaju normalno
- Ako selektor nedostaje, Heym pokreće `playwrightAuthFallbackSteps`
- Nakon što se rezervni koraci završe, Heym ponovno provjerava isti selektor
- Ako selektor i dalje nedostaje, čvor ne uspijeva s greškom autentifikacijskog bootstrapa

Rezervni koraci preuzimaju navigaciju nakon neuspjeha autentifikacije. Trebali bi ostaviti preglednik na autentificiranoj stranici koju očekuje ostatak glavnog toka.

## Polja izlaza

- `$playwrightNode.status` – `"ok"` u slučaju uspjeha
- `$playwrightNode.results` – Izlazi koraka (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot ključevi itd.)
- `$playwrightNode.screenshot` – Base64 screenshot kada korak snimi jedan
- `$playwrightNode.cookies` – Konačni kolačići preglednika kada je omogućen autentifikacijski bootstrap ili snimanje mreže
- `$playwrightNode.networkRequests` – Snimljeni mrežni odgovori (kada je omogućeno)
- `$playwrightNode.localStorage` – Lokalna pohrana preglednika (kada je omogućeno)
- `$playwrightNode.sessionStorage` – Sesijska pohrana preglednika (kada je omogućeno)

## Primjer

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

## Run Code mod

U Panelu svojstava postavite **Mod** na **Run Code** kako biste uredili `playwrightCode` umjesto vizualnih koraka. Autentifikacijski bootstrap primjenjuje se samo na Steps mod.

Primjer (sandbox / Docker — Chromium treba `--no-sandbox`):

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

Omotač pruža `inputs`, `headless`, `timeout_ms` i `capture_network`. Možete ugraditi `$nodeLabel.field` izraze u kod; ispišite JSON s `status` i `results`.
## Sigurnost prilagođenog koda

Polje `playwrightCode` izvršava proizvoljni Python kod. Budući da to odgovara izvršavanju koda, **zadano je onemogućeno** i, kada je omogućeno, radi u sandboxu:

- **Zadano onemogućeno.** Izvršavanje čvora koji ima postavljen `playwrightCode` ne uspijeva s jasnom pogreškom osim ako operater ne postavi `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Provjera se izvršava u vrijeme izvršavanja, tako da pokriva i prethodno spremljene workflows i raspoređene / pod-workflow izvršavanja.
- **Izolirano kada je omogućeno.** Prilagođeni kod ne radi u pozadinskom procesu. Izvršava se u učvršćenom, jednokratnom kontejneru bez Docker socket-a, bez pozadinskih bind mount-ova, bez pozadinskih tajni u svom okruženju, s uklonjenim mogućnostima, `no-new-privileges` i ograničenjima CPU-a / memorije / PID-a. Ako Docker nije dostupan, izvršavanje se zatvara. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` vraća se u putanju unutar procesa samo za pouzdanu ili lokalnu razvojnu upotrebu (nije sigurnosna granica). Prirodni `./run.sh` zadano koristi `subprocess` kada nije postavljen `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) i GHCR pojedinačna slika rješavaju sestrinski runner putem `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (padajući na `HEYM_CODEX_DOCKER_IMAGE`) i koriste odgovarajući venv put (`/app/.venv` naspram `/app/backend/.venv`).
- **Napomena o Chromiumu.** Sandbox kontejner se zadano pokreće kao root, a Chromium odbija raditi kao root bez `--no-sandbox`. Prilagođeni kod koji pokreće Chromium trebao bi proslijediti ovu opciju, na primjer `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Izvršavanja temeljen na koracima (i stealth) također prosljeđuju `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` kako bi skripte za otisak prsta spriječile otvaranje STUN UDP na `stun.l.google.com:19302`. Prilagođeni pozivi `chromium.launch` također bi trebali uključivati tu opciju.

Playwright čvorovi temeljen na koracima (`playwrightSteps`) potpuno su generirani od strane Heym-a (bez proizvoljnog koda), nisu pogođeni svim navedenim i uvijek su dostupni — preporučuje se njihova upotreba.

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Crawler čvor](./crawler-node.md) – Jednostavnije web scraping s FlareSolverr
- [Dijeljenje vjerodajnica](../reference/credentials-sharing.md) – LLM vjerodajnice za AI korake
