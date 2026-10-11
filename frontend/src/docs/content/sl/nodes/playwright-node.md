# Playwright

**Playwright** vozlišče avtomatizira interakcije z brskalnikom s konfigurabilnimi koraki. Uporabite ga za spletno strganje, izpolnjevanje obrazcev in brskalniške workflows.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.results`, `$nodeLabel.screenshot`, in opcijski podatki o omrežju/brskalniku |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `playwrightMode` | niz | `"steps"` (privzeto) ali `"code"` (Zaženi kodo). Izberite v spustnem meniju v razdelku Lastnosti |
| `playwrightSteps` | polje | Koraki: navigacija, klik, vnos, aiStep itd. Vsak korak ima dejanje in selektor/parametre. `disabled: true` ohrani korak na seznamu, vendar ga preskoči med izvajanjem |
| `playwrightCode` | niz | Prilagojena Playwright Python koda, ki se uporablja, ko je način Zaženi kodo. Izvaja se v utrjenem peskovniku in je **privzeto onemogočena** — glejte spodnjo opombo o varnosti |
| `playwrightHeadless` | boolean | Izvedba brez grafičnega vmesnika (privzeto: true) |
| `playwrightStealth` | boolean | Nastavitev v načinu korakov, ki zmanjšuje običajne signale avtomatizacije Playwright (privzeto: false). Oznaka v razdelku Lastnosti: Zmanjšaj avtomatizacijske zastavice |
| `playwrightTimeout` | številka | Časovna omejitev v ms (privzeto: 30000) |
| `playwrightCaptureNetwork` | boolean | Zajemanje JSON odgovorov, glav, piškotkov in shranjevanja brskalnika |
| `playwrightAuthEnabled` | boolean | Obnovitev avtentikacije brskalnika iz piškotkov/shranjevanja stanja pred izvajanjem korakov |
| `playwrightAuthStateExpression` | niz | Izraz ali JSON, ki se razreši v Playwright `storageState` ali surove `cookies[]` |
| `playwrightAuthCheckSelector` | niz | Selektor, ki mora biti viden po avtentikaciji |
| `playwrightAuthCheckTimeout` | številka | Časovna omejitev v ms za preverjanje avtentikacijskega selektorja (privzeto: 5000) |
| `playwrightAuthFallbackSteps` | polje | Koraki za prijavo, ki se izvedejo, ko obnova piškotkov ne avtentikira strani |

## Vrste korakov

- **navigate** – Pojdi na URL
- **refresh** – Osveži trenutno stran (opcijski korak `timeout` v ms za navigacijo osvežitve)
- **click** – Kliknite element po selektorju
- **type** – Vnesite besedilo v vnos (znak po znak)
- **fill** – Izpolnite vrednost vnosa
- **wait** – Počakajte na časovno omejitev (ms)
- **screenshot** – Zajemite posnetek zaslona (`outputKey` shrani base64 v rezultate)
- **getText** – Besedilna vsebina elementa (`selector`, opcijski `outputKey`)
- **getAttribute** – Vrednost atributa (`selector`, `attribute`, opcijski `outputKey`)
- **getHTML** – Zunanji HTML elementa (`selector`, opcijski `outputKey`)
- **getVisibleTextOnPage** – Celotno vidno besedilo strani kot `document.body.innerText` (brez selektorja; uporabite `outputKey`; opcijski korak `timeout` v ms čaka pred zajemom)
- **hover** – Premaknite se nad element
- **selectOption** – Izberite možnost v `<select>`
- **scrollDown** / **scrollUp** – Pomikanje z miško (opcijska `amount` v slikovnih točkah)
- **aiStep** – LLM vrne enake vrste dejanj kot ročni koraki (glejte spodaj); gnezdeni `aiStep` ni podprt

## Izklop koraka

Vsak korak ima stikalo za napajanje v svoji glavi. Izklopljen korak prikazuje svoj naslov prečrtan in zatemnjen, ostane na seznamu z vsemi svojimi polji in se preskoči, ko vozlišče deluje — koristno za izolacijo neuspešnega selektorja brez brisanja dela. Shranjeni korak nosi `disabled: true`; koraki brez oznake se izvajajo normalno.

Onemogočeni koraki so nevidni za preostali del vozlišča: ne izpolnjujejo pravila "prvi korak mora biti `navigate`" pri avtentikaciji, onemogočen `aiStep` ne izvede nobenega LLM klica, in onemogočeni vnosi v `playwrightAuthFallbackSteps` so prav tako preskočeni. Izklop vseh korakov povzroči neuspeh izvajanja z sporočilom, ki vas prosi, da omogočite enega.

## AI Korak

Dejanje **aiStep** uporablja LLM za analizo HTML strani (in opcijsko posnetka zaslona) ter generira Playwright dejanja iz navodil v naravnem jeziku. API sprejema enake nazive dejanj kot ročni koraki (vključno z `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, pomikanja itd.). **Avtomatsko zdravljenje** samo nadomesti neuspešne korake, ki temeljijo na selektorjih, z alternativami za klik, vnos, izpolnitev, premik in selectOption.

| Možnost | Opis |
|--------|-------------|
| `instructions` | Kaj naj AI stori (npr. "Kliknite gumb Prijava") |
| `credentialId` | LLM poverilnica (OpenAI, Google ali Prilagojeno) |
| `model` | Iskalni seznam modelov iz izbrane LLM poverilnice |
| `saveStepsForFuture` | Shranite generirane korake za naslednje izvajanje (izogibajte se LLM klicu) |
| `sendScreenshot` | Pošljite posnetek zaslona LLM za vizualne elemente |
| `aiStepTimeout` | Časovna omejitev za LLM klic v ms (privzeto 30000) |

### AI Avtomatsko zdravljenje

**AI Avtomatsko zdravljenje** naredi workflows odporne na spremembe DOM. Ko selektor dvakrat ne uspe (npr. po prenovi strani), Heym pokliče LLM, da najde alternativni lokator — običajno `role=button[name='Submit']` ali `text=Exact text` namesto CSS selektorjev.

Omogočite **Način avtomatskega zdravljenja** v lastnostih AI koraka. Če shranjeni korak ne uspe:

1. Heym zajame trenutni HTML in posnetek zaslona
2. Pošlje neuspešni korak + kontekst strani LLM
3. LLM vrne robustno alternativo (lokator na osnovi vloge, lokator besedila ali rezervni CSS)
4. Ponovno poskusi z novim selektorjem

To zmanjšuje nestabilnost, ko strani posodabljajo svojo oznako ali imena razredov.
## Zmanjšanje avtomatizacijskih zastavic

Omogočite **Zmanjšanje avtomatizacijskih zastavic** (`playwrightStealth: true`), ko spletna stran obravnava Playwrightov vgrajen Chromium kot bot zaradi standardnih avtomatizacijskih signalov (`HeadlessChrome` v uporabniškem agentu, `navigator.webdriver`, manjkajoč `window.chrome`).

Ta možnost velja samo v **Korakih** načinu. To:

- Odstrani Chromiumovo zastavico `--enable-automation` in nastavi `--disable-blink-features=AutomationControlled`
- Pošlje standardni Chrome uporabniški agent (brez `HeadlessChrome`)
- Obnovi običajne površine brskalnika, ki jih Playwright pusti prazne (`window.chrome`, vtičniki)
- Pusti gostiteljski GPU renderer nespremenjen, ko je GPU na voljo (lokalni macOS/Windows). Linux/Docker nima GPU; niz programske opreme Chromium se poroča kot tipičen Mali (ARM) ali Mesa (x86) GPU namesto SwiftShader.

Ne skriva, da je seja upravljana preko Chrome DevTools Protocol, in ni način za obhod varnosti spletne strani, CAPTCHAs ali kontrol dostopa. Uporabite jo za workflows, ki jih imate pravico izvajati — notranja orodja, vaše lastne spletne strani in dovoljena avtomatizacija brskalnika.

Način za izvajanje kode ostaja nespremenjen — prilagojeni skripti zaženejo Chromium sami.

## Zajem omrežja

Omogočite `playwrightCaptureNetwork`, da zberete dodatne podatke za odpravljanje napak med izvajanjem:

- `networkRequests` – Zajeti JSON/API odgovori
- `cookies` – Piškotki brskalnika ob koncu izvajanja
- `localStorage` – Ključ-vrednost pari `localStorage` brskalnika
- `sessionStorage` – Ključ-vrednost pari `sessionStorage` brskalnika

To je koristno, ko potrebujete pregledati skrite API klice, stanje avtentikacije ali podatke na strani brskalnika po avtomatiziranem toku.

## Bootstrap piškotkov in rezervni postopek prijave

Omogočite `playwrightAuthEnabled`, ko želite, da Playwright odpre stran, ki je že prijavljena.

### Vir stanja avtentikacije

Nastavite `playwrightAuthStateExpression` na izraz, kot je `$global.authState`. Vrednost je lahko:

- Objekt `storageState` Playwrighta: `{"cookies": [...], "origins": [...]}`
- Neobdelana tabela `cookies[]`
- JSON niz, ki vsebuje katerokoli obliko

Priporočeni vzorec:

1. Zaženite Playwright vozlišče z omogočenim zajemom omrežja ali avtentikacijo bootstrap
2. Shranite `$playwrightNode.cookies` ali celoten objekt stanja avtentikacije v [Globalno spremenljivko](../reference/global-variables.md)
3. Ponovno uporabite to spremenljivko v kasnejših Playwright vozliščih preko `$global.authState`

### Preverjanje avtentikacije

Prvi glavni korak Playwrighta mora biti `navigate`. Ko se ta korak naloži, Heym preveri `playwrightAuthCheckSelector`.

- Če je selektor viden, se preostali glavni koraki nadaljujejo normalno
- Če selektor manjka, Heym izvede `playwrightAuthFallbackSteps`
- Po zaključku rezervnih korakov Heym ponovno preveri isti selektor
- Če selektor še vedno manjka, vozlišče ne uspe z napako avtentikacije bootstrap

Rezervni koraki prevzamejo navigacijo po neuspehu avtentikacije. Pustiti morajo brskalnik na prijavljeni strani, ki jo pričakuje preostali glavni tok.

## Izhodni podatki

- `$playwrightNode.status` – `"ok"` ob uspehu
- `$playwrightNode.results` – Izhodi korakov (getText, getHTML, getVisibleTextOnPage, getAttribute, ključi zaslona itd.)
- `$playwrightNode.screenshot` – Base64 slika zaslona, ko korak shrani eno
- `$playwrightNode.cookies` – Končni piškotki brskalnika, ko je omogočen avtentikacijski bootstrap ali zajem omrežja
- `$playwrightNode.networkRequests` – Zajeti omrežni odgovori (ko je omogočeno)
- `$playwrightNode.localStorage` – Lokalna shrambe brskalnika (ko je omogočeno)
- `$playwrightNode.sessionStorage` – Shranjevanje seje brskalnika (ko je omogočeno)

## Primer

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

## Način za izvajanje kode

V Plošči lastnosti nastavite **Način** na **Izvajanje kode**, da uredite `playwrightCode` namesto vizualnih korakov. Avtentikacijski bootstrap velja samo za način Koraki.

Primer (sandbox / Docker — Chromium potrebuje `--no-sandbox`):

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

Ovijalnik zagotavlja `inputs`, `headless`, `timeout_ms` in `capture_network`. V kodo lahko vključite izraze `$nodeLabel.field`; natisnite JSON z `status` in `results`.
## Varnost prilagojenega kode

Polje `playwrightCode` izvaja poljuben Python. Ker to ustreza izvrševanju kode, je **privzeto onemogočeno** in, ko je omogočeno, deluje v peskovniku:

- **Privzeto onemogočeno.** Izvrševanje vozlišča, ki ima nastavljeno `playwrightCode`, ne uspe z jasnim sporočilom o napaki, razen če operater nastavi `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Preverjanje se izvede ob času izvrševanja, zato pokriva tudi prej shranjene workflows in načrtovane / pod-workflows.
- **Izolirano, ko je omogočeno.** Prilagojen koda ne teče v procesih backend. Izvaja se v utrjenem, začasnem sosednjem vsebniku brez Docker vtičnice, brez vezav backend, brez backend skrivnosti v svojem okolju, z zmanjšanimi zmožnostmi, `no-new-privileges` in omejitvami CPU / pomnilnika / PID. Če Docker ni na voljo, se izvajanje zaključi. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` se vrne v pot znotraj procesa, ki je namenjena le zaupanja vredni ali lokalni razvojni uporabi (ni varnostna meja). Privzeto `./run.sh` uporablja `subprocess`, ko ni nastavljena `HEYM_PLAYWRIGHT_SANDBOX_IMAGE`. `./deploy.sh` (Compose) in enojna slika GHCR rešita sosednjega izvajalca preko `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (v primeru neuspeha se vrne na `HEYM_CODEX_DOCKER_IMAGE`) in uporabita ustrezno pot venv (`/app/.venv` proti `/app/backend/.venv`).
- **Opomba o Chromiumu.** Sandi vsebnik se privzeto izvaja kot root, Chromium pa zavrne izvajanje kot root brez `--no-sandbox`. Prilagojena koda, ki zažene Chromium, mora to predati, na primer `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Izvršitve, ki temeljijo na korakih (in stealth), prav tako predajo `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, tako da skripti za prstne odtise ne morejo odpreti STUN UDP na `stun.l.google.com:19302`. Prilagojeni klici `chromium.launch` naj vključujejo tudi to zastavico.

Vozlišča Playwright, ki temeljijo na korakih (`playwrightSteps`), so popolnoma generirana s strani Heym (brez poljubne kode), niso prizadeta z vsemi zgoraj navedenimi in so vedno na voljo — raje jih uporabite.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Crawler vozlišče](./crawler-node.md) – Enostavnejše spletno strganje z FlareSolverr
- [Deljenje poverilnic](../reference/credentials-sharing.md) – Poverilnice LLM za AI korake
