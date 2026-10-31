# Analytics-välilehti

**Analytics**-välilehdessä näet workflowien suoritusmittareita ja trendejä. Seuraa käyttöä, suorituskykyä ja tunnista pullonkauloja.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Katso Analytics-esittely</a></p>

## Yhteenvedon tilastot

- **Suoritukset yhteensä** – Valitulla aikavälillä suoritettujen workflowien määrä
- **Onnistumisprosentti** – Onnistuneiden suoritusten osuus
- **Keskimääräinen kesto** – Suorituksen keskimääräinen kestoaika
- **Säästetty aika** – Arvioitu kokonaisaikasäästö: kunkin workflowin määrittämä minuuttisäästö per suoritus × sen onnistuneet suoritukset, laskettuna yhteen valitulla aikavälillä
- **Trendit** – Ylös/alas-indikaattorit edelliseen jaksoon verrattuna

## Aikaväli

- **1h**, **3h**, **6h** – Viimeinen tunti, 3 tuntia tai 6 tuntia. Analytiikka tallennetaan tunneittain, joten nämä laskevat ikkunan aloitusajan kokonaisuudessaan: Viimeinen tunti klo 15:20 kattaa ajan klo 14:00 tähän hetkeen
- **24h** – Viimeiset 24 tuntia
- **7d** – Viimeiset 7 päivää
- **30d** – Viimeiset 30 päivää
- **Kaikki** – Koko saatavilla oleva historia

## Workflow-suodatin

- Suodata mittareita tietyn workflowin mukaan
- **Kaikki workflowt** – Aggregoi kaikkien workflowien tiedot

## Taulukot

Kaksi taulukkoa näyttää workflowien käyttöä: **Eniten käytetyt** (leveämpi) ja **Eniten epäonnistuneet**.

- **Säästetty aika** – Eniten käytetyissä näkyy kunkin workflowin kokonaisaikasäästö (minuuttisäästö per suoritus × onnistuneet suoritukset). **Ei asetettu** tarkoittaa, että arvio puuttuu; napsauta avataksesi kyseisen kentän workflowissa.
- **Lajiteltavat sarakkeet** – Napsauta sarakeotsikkoa lajitellaksesi kyseisen sarakkeen mukaan. Napsauta uudelleen vaihtaaksesi nousevaan/laskevaan järjestykseen. Nuoli-indikaattorit näyttävät lajittelusuunnan.
- **Mobiiliotsikot** – Pienillä näytöillä sarakeotsikot lyhennetään (esim. "Suoritukset" → "Kert", "Onnistuneet" → "OK", "Virheet" → "Vir") niin, että taulukot mahtuvat ilman vaakasuuntaista vieritystä.

## Kaaviot

- **Suoritusmäärät aikajanalla** – Viivakaavio suorituksista aikaväleittäin
- **Onnistuneet vs. epäonnistuneet** – Aluekaavio, joka vertaa terveitä ja epäonnistuneita suorituksia
- **Keskimääräinen viive aikajanalla** – Viivakaavio, joka näyttää vastausaikojen muutokset
- **Valitse vetämällä** – Napsauta ja vedä millä tahansa kaaviolla tarkastellaksesi mukautettua ajanjaksoa. Valinnan on katettava vähintään kaksi pistettä kaaviossa; tavallinen napsautus ei valitse mitään
- **Valintatila** – Valitut alueet päivittävät yhteenvetokortit, kaaviot ja workflowtaulukot muuttamatta perusasetusta
- **Tyhjennä valinta** – Palaa esiasetettuun aikaväliin, kun olet valmis tarkasteluun

## Solmutyypit

Viivepersentiilien alapuolella kolme kaaviota näyttää, mihin solmujen aika ja virheet kuluvat, ryhmiteltynä solmutyypeittäin (Agent, HTTP Request, Code jne.) tarkasteltavissa workflow'issa:

- **Eniten aikaa vievät solmut** – 10 solmutyyppiä, joilla on suurin kokonaissuoritusaika, esitettynä keskimääräisenä kestona kutsua kohden. Tunti ilman kyseisen tyypin kutsuja näyttää työkaluvihjeessä **Ei kutsuja**.
- **Useimmin epäonnistuvat solmutyypit** – 10 solmutyyppiä, joissa on eniten virheitä (virhe tai timeout), kukin omalla virhemäärällään aikaväliä kohden.
- **Eniten kutsutut solmutyypit** – 10 solmutyyppiä, joita suoritettiin eniten, kukin omalla kutsumäärällään aikaväliä kohden. Ohitettuja solmuja ei lasketa.

Vie kohdistin kaavion päälle nähdäksesi osoittimen alla olevan solmutyypin aivan sen vieressä. Solmutyyppi, joka on liian pieni näkyäkseen kaavion suurimman rinnalla (alle 1 % siitä), jätetään pois kyseisestä kaaviosta ja sen selitteestä. Kaaviot noudattavat workflow-suodatinta, aikaväliä ja mitä tahansa kaaviosta vedettyä aluetta. Solmuanalytiikka tallennetaan ajoille siitä versiosta lähtien, joka toi sen mukaan, ja valmistunut ajo näkyy noin minuutin kuluessa. Vanhempia ajoja ei lasketa mukaan.

## Automaattinen päivitys

- Ota automaattinen päivitys käyttöön pitääksesi mittareita ajan tasalla ilman manuaalista uudelleenlatausta

## Liittyvät

- [Workflows-välilehti](./workflows-tab.md) – Mitattavat workflowt
- [Traces-välilehti](./traces-tab.md) – Yksityiskohtainen suoritusketjujen tarkastelu
- [Lokit-välilehti](./logs-tab.md) – Runtimelokit virheenkorjausta varten
- [Contextual Showcase](../reference/contextual-showcase.md) – Tiivis sivun opas kojetaulun pintoja varten

Jos haluat saada ilmoituksen kaavion näyttämästä trendistä sen sijaan, että seuraisit sitä aktiivisesti, muuta se [hälytykseksi](./alerts-tab.md): virhemäärä, suorituskesto, LLM-kulutus ja suoritusmäärä voidaan kaikki asettaa kynnysarvoille tietyn aikavälin yli.
