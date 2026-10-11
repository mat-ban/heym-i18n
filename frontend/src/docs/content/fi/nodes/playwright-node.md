# Playwright

**Playwright**-solmu automatisoi selaininteraktioita määritettävillä vaiheilla. Käytä sitä verkkosivujen kaavintaan, lomakkeiden täyttämiseen ja selainpohjaisiin workflowihin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.results`, `$nodeLabel.screenshot` ja valinnaiset verkkoselaindata |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `playwrightMode` | merkkijono | `"steps"` (oletus) tai `"code"` (Suorita koodia). Valitse Properties Panel -valikosta Mode-alasvetovalikosta |
| `playwrightSteps` | taulukko | Vaiheet: navigate, click, type, aiStep jne. Jokaisella vaiheella on toiminto ja valitsin/parametrit. `disabled: true` säilyttää vaiheen listassa mutta ohittaa sen suorituksen aikana |
| `playwrightCode` | merkkijono | Mukautettu Playwright Python -koodi, jota käytetään, kun Mode on Run Code. Suoritetaan suojatussa hiekkalaatikossa ja on **oletusarvoisesti pois käytöstä** — katso tietoturvahuomio alla |
| `playwrightHeadless` | totuusarvo | Suorita päättömässä tilassa (oletus: true) |
| `playwrightStealth` | totuusarvo | Steps-tilan asetus, joka vähentää yleisiä Playwright-automaatiosignaaleja (oletus: false). Properties Panel -otsikko: Reduce automation flags |
| `playwrightTimeout` | numero | Aikakatkaisu millisekunteina (oletus: 30000) |
| `playwrightCaptureNetwork` | totuusarvo | Kaappaa JSON-vastaukset, otsakkeet, evästeet ja selaintila |
| `playwrightAuthEnabled` | totuusarvo | Palauta selaimen todennus evästeistä/storageState-tilasta ennen vaiheiden suorittamista |
| `playwrightAuthStateExpression` | merkkijono | Lauseke tai JSON, joka ratkaistaan Playwrightin `storageState`-tilaksi tai raa'aksi `cookies[]`-taulukoksi |
| `playwrightAuthCheckSelector` | merkkijono | Valitsin, jonka on oltava näkyvissä todennuksen alustuksen jälkeen |
| `playwrightAuthCheckTimeout` | numero | Aikakatkaisu millisekunteina todennetun valitsimen tarkistukselle (oletus: 5000) |
| `playwrightAuthFallbackSteps` | taulukko | Vain kirjautumiseen tarkoitetut varavaiheet, jotka suoritetaan, jos evästeiden palautus ei todenna sivua |

## Vaihetyypit

- **navigate** – Siirry URL-osoitteeseen
- **refresh** – Päivitä nykyinen sivu (valinnainen vaihe `timeout` millisekunteina päivitysnavigointia varten)
- **click** – Klikkaa elementtiä valitsimen perusteella
- **type** – Kirjoita tekstiä syötekenttään (merkki kerrallaan)
- **fill** – Täytä syötekentän arvo
- **wait** – Odota aikakatkaisua (ms)
- **screenshot** – Kaappaa kuvakaappaus (`outputKey` tallentaa base64-muodossa tuloksiin)
- **getText** – Elementin tekstisisältö (`selector`, valinnainen `outputKey`)
- **getAttribute** – Attribuutin arvo (`selector`, `attribute`, valinnainen `outputKey`)
- **getHTML** – Elementin ulkoinen HTML (`selector`, valinnainen `outputKey`)
- **getVisibleTextOnPage** – Koko sivun näkyvä teksti `document.body.innerText` -muodossa (ei valitsinta; käytä `outputKey`; valinnainen vaihe `timeout` millisekunteina odottaa ennen kaappausta)
- **hover** - Vie hiiri elementin päälle
- **selectOption** – Valitse vaihtoehto `<select>`-elementistä
- **scrollDown** / **scrollUp** – Hiiren rullan vieritys (valinnainen `amount` pikseleinä)
- **aiStep** – LLM palauttaa samantyyppisiä toimintoja kuin manuaaliset vaiheet (katso alla); sisäkkäisiä `aiStep`-vaiheita ei tueta

## Vaiheen poistaminen käytöstä

Jokaisessa vaiheessa on päälle/pois-kytkin otsikkopalkissa. Pois käytöstä oleva vaihe näyttää otsikkonsa yliviivattuna ja himmenee, pysyy listassa kaikkine kenttineen ja ohitetaan, kun solmu suoritetaan — hyödyllinen epäonnistuneen valitsimen eristämiseen työn poistamatta. Tallennettu vaihe sisältää `disabled: true`; vaiheet ilman tätä lippua suoritetaan normaalisti.

Poissa olevat vaiheet ovat näkymättömiä muulle solmulle: ne eivät täytä "ensimmäisen vaiheen on oltava `navigate`" -sääntöä todennuksen alustuksessa, pois käytössä oleva `aiStep` ei tee LLM-kutsua, ja pois käytössä olevat `playwrightAuthFallbackSteps`-merkinnät ohitetaan myös. Jos kaikki vaiheet kytketään pois päältä, suoritus epäonnistuu viestillä, jossa pyydetään ottamaan yksi vaihe käyttöön.

## AI-vaihe

**aiStep**-toiminto käyttää LLM:ää analysoimaan sivun HTML:ää (ja valinnaisesti kuvakaappausta) ja luomaan Playwright-toimintoja luonnollisen kielen ohjeista. API hyväksyy samat toimintonimet kuin manuaaliset vaiheet (mukaan lukien `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, vieritykset jne.). **Automaattinen korjaus** korvaa vain epäonnistuneet valitsinpohjaiset vaiheet vaihtoehtoisilla toiminnoilla click, type, fill, hover ja selectOption -vaiheille.

| Vaihtoehto | Kuvaus |
|--------|-------------|
| `instructions` | Mitä tekoälyn tulisi tehdä (esim. "Klikkaa Kirjaudu-painiketta") |
| `credentialId` | LLM-tunnistetiedot (OpenAI, Google tai Custom) |
| `model` | Haettavissa oleva luettelo valitun LLM-tunnistetiedon malleista |
| `saveStepsForFuture` | Välimuistiin tallennetut vaiheet seuraavia suorituksia varten (välttää LLM-kutsun) |
| `sendScreenshot` | Lähetä kuvakaappaus LLM:lle visuaalisten elementtien analysointia varten |
| `aiStepTimeout` | LLM-kutsun aikakatkaisu millisekunteina (oletus 30000) |

### AI Automaattinen korjaus

**AI Automaattinen korjaus** tekee workflowista kestävämpiä DOM-muutoksia vastaan. Kun valitsin epäonnistuu kahdesti (esim. sivuston uudelleensuunnittelun jälkeen), Heym kutsuu LLM:ää löytämään vaihtoehtoisen paikantimen — tyypillisesti `role=button[name='Lähetä']` tai `text=Tarkka teksti` CSS-valitsinten sijaan.

Ota **Automaattinen korjaus -tila** käyttöön AI-vaiheen ominaisuuksista. Jos tallennettu vaihe epäonnistuu:

1. Heym kaappaa nykyisen HTML:n ja kuvakaappauksen
2. Lähettää epäonnistuneen vaiheen + sivukontekstin LLM:lle
3. LLM palauttaa vankemman vaihtoehdon (roolipohjainen paikannin, tekstipaikannin tai varajärjestelmä CSS)
4. Yrittää uudelleen uudella valitsimella

Tämä vähentää epäluotettavuutta, kun sivustot päivittävät merkintäkieltään tai luokkanimiään.
## Automaatiomerkkien vähentäminen

Ota käyttöön **Automaatiomerkkien vähentäminen** (`playwrightStealth: true`), kun sivusto luokittelee Playwrightin mukana tulevan Chromiumin bottina standardien automaatiomerkkien perusteella (`HeadlessChrome` käyttäjäagentissa, `navigator.webdriver`, puuttuva `window.chrome`).

Tämä vaihtoehto koskee vain **Vaiheet**-tilaa. Se:

- Poistaa Chromiumin `--enable-automation` -lipun ja asettaa `--disable-blink-features=AutomationControlled`
- Lähettää standardin Chrome-käyttäjäagentin (ei `HeadlessChrome`)
- Palauttaa yleiset selainpinnat, jotka Playwright jättää tyhjiksi (`window.chrome`, liitännäiset)
- Jättää isäntä-GPU:n renderöijän muuttumattomaksi, kun GPU on käytettävissä (paikallinen macOS/Windows). Linux/Dockerissa ei ole GPU:a; Chromiumin ohjelmistorenderöijä merkitään tyypilliseksi Mali (ARM) tai Mesa (x86) -GPU:ksi SwiftShaderin sijaan.

Tämä ei kätke sitä, että istunto ohjataan Chrome DevTools Protocolin kautta, eikä se ole keino ohittaa sivuston turvallisuutta, CAPTCHA:ita tai käyttöoikeuksien valvontaa. Käytä tätä vain sellaisissa workfloweissa, joiden suorittamiseen sinulla on valtuudet – sisäisissä työkaluissa, omilla sivustoillasi ja sallituissa selainautomaatioissa.

Suorita koodi -tila pysyy muuttumattomana – mukautetut skriptit käynnistävät Chromiumin itse.

## Verkkokaappaus

Ota käyttöön `playwrightCaptureNetwork` kerätäksesi lisää virheenjäljitystietoa suorituksen aikana:

- `networkRequests` – Kaapatut JSON/API-vastaukset
- `cookies` – Selaimen evästeet suorituksen lopussa
- `localStorage` – Selaimen `localStorage`-avain-arvo -parit
- `sessionStorage` – Selaimen `sessionStorage`-avain-arvo -parit

Tämä on hyödyllistä, kun haluat tarkastaa piilotettuja API-kutsuja, todennustilaa tai selainpuolen dataa automaation jälkeen.

## Evästepohjaus ja kirjautumisvarasuunnitelma

Ota käyttöön `playwrightAuthEnabled`, kun haluat Playwrightin avaavan sivun jo kirjautuneena.

### Todennustilan lähde

Aseta `playwrightAuthStateExpression` lausekkeeksi, kuten `$global.authState`. Arvo voi olla:

- Playwrightin `storageState`-objekti: `{"cookies": [...], "origins": [...]}`
- Raaka `cookies[]`-taulukko
- JSON-merkkijono, joka sisältää jomman kummista

Suositeltu käyttötapa:

1. Suorita Playwright-solmu verkkokaappauksella tai todennuspohjauksella käytössä
2. Tallenna `$playwrightNode.cookies` tai koko todennustilaobjekti [Globaaliin muuttujaan](../reference/global-variables.md)
3. Käytä tätä muuttujaa myöhemmissä Playwright-solmuissa `$global.authState`:n kautta

### Todennuksen tarkistus

Ensimmäisen pääasiallisen Playwright-vaiheen on oltava `navigate`. Kun vaihe on ladannut sivun, Heym tarkistaa `playwrightAuthCheckSelector`.

- Jos valitsin on näkyvissä, muut pääasialliset vaiheet jatkuvat normaalisti
- Jos valitsin puuttuu, Heym suorittaa `playwrightAuthFallbackSteps`
- Varavaiheiden suorituksen jälkeen Heym tarkistaa saman valitsimen uudelleen
- Jos valitsin on edelleen puuttuva, solmu epäonnistuu todennuspohjausvirheellä

Varavaiheet vastaavat navigoinnista todennusvirheen jälkeen. Niiden tulisi jättää selain sille sivulle, jonka muut pääasialliset vaiheet odottavat.

## Tulokentät

- `$playwrightNode.status` – `"ok"` onnistuessa
- `$playwrightNode.results` – Vaiheiden tulokset (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot-avaimet jne.)
- `$playwrightNode.screenshot` – Base64-kuvakaappaus, kun vaihe tallentaa sellaisen
- `$playwrightNode.cookies` – Lopulliset selaimen evästeet, kun todennuspohjaus tai verkkokaappaus on käytössä
- `$playwrightNode.networkRequests` – Kaapatut verkkopyynnöt (kun käytössä)
- `$playwrightNode.localStorage` – Selaimen paikallinen tallennustila (kun käytössä)
- `$playwrightNode.sessionStorage` – Selaimen istuntotallennustila (kun käytössä)

## Esimerkki

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

## Suorita koodi -tila

Aseta **Tila**-välilehdellä **Suorita koodi**, jos haluat muokata `playwrightCode`-koodia visuaalisten vaiheiden sijaan. Todennuspohjaus koskee vain vaiheet-tilaa.

Esimerkki (sandbox / Docker – Chromium tarvitsee `--no-sandbox`):

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

Wrapper tarjoaa `inputs`, `headless`, `timeout_ms` ja `capture_network`. Voit upottaa `$nodeLabel.field`-lausekkeita koodiin; tulosta JSON `status`- ja `results`-kenttinä.
## Mukautetun koodin turvallisuus

`playwrightCode`-kenttä suorittaa mielivaltaista Python-koodia. Koska tämä vastaa koodin suorittamista, se on **oletusarvoisesti pois käytöstä** ja, kun se otetaan käyttöön, se suoritetaan eristetyssä ympäristössä:

- **Oletusarvoisesti pois käytöstä.** Solmun, jossa on määritetty `playwrightCode`, suorittaminen epäonnistuu selkeällä virheilmoituksella, ellei operaattori aseta `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Tarkistus suoritetaan suoritushetkellä, joten se koskee myös aiemmin tallennettuja workfloweja sekä aikataulutettuja / alityönkulkuja.
- **Eristetty, kun käytössä.** Mukautettu koodi ei suoritu taustaprosessissa. Se suoritetaan kovennettussa, kertakäyttöisessä sisarkontissa, jossa ei ole Docker-socketia, ei taustaprosessin sidottuja liitoksia, ei taustaprosessin salaisuuksia sen ympäristössä, pudotettu oikeuksia, `no-new-privileges` -asetusta sekä CPU / muisti / PID-rajoituksia. Jos Docker ei ole käytettävissä, suoritus epäonnistuu suljettuna. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` valitsee takaisin prosessin sisäisen polun vain luotettuja tai paikallista kehitystä varten (ei turvallisuusrajaa). Natiivi `./run.sh` oletusarvoisesti valitsee `subprocess`, kun `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` ei ole asetettu. `./deploy.sh` (Compose) ja GHCR-yksittäinen kuva selvittävät sisarsuorittimen `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` -kautta (pudoten takaisin `HEYM_CODEX_DOCKER_IMAGE` -kuvaan) ja käyttävät vastaavaa virtuaaliympäristön polkua (`/app/.venv` vs `/app/backend/.venv`).
- **Chromium-huomio.** Eristyskontti suoritetaan oletusarvoisesti root-käyttäjänä, ja Chromium kieltäytyy suorittamasta root-käyttäjänä ilman `--no-sandbox` -valitsinta. Mukautettu koodi, joka käynnistää Chromiumin, tulisi välittää se, esimerkiksi `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Vaiheperusteiset (ja salakäytössä olevat) käynnistykset välittävät myös `--force-webrtc-ip-handling-policy=disable_non_proxied_udp`, jotta sormenjälkien skriptit eivät voi avata STUN UDP -yhteyttä kohteeseen `stun.l.google.com:19302`. Mukautetut `chromium.launch` -kutsut tulisi sisältää myös tämä lippu.

Vaiheperusteiset Playwright-solmut (`playwrightSteps`) luodaan kokonaan Heymin toimesta (ei mielivaltaista koodia), eivätkä ne ole vaikutuksia kaikkeen edellä mainittuun, ja ne ovat aina käytettävissä — suosittele niitä.

## Aiheeseen liittyvää

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Crawler-solmu](./crawler-node.md) – Yksinkertaisempi verkkonäytteenotto FlareSolverrilla
- [Tunnistetietojen jakaminen](../reference/credentials-sharing.md) – LLM-tunnistetiedot tekoälyvaiheita varten
