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
- **Valitse vetämällä** – Napsauta ja vedä kaaviossa keskittyäksesi mukautetulle päivämääräalueelle
- **Valintatila** – Valitut alueet päivittävät yhteenvetokortit, kaaviot ja workflowtaulukot muuttamatta perusasetusta
- **Tyhjennä valinta** – Palaa esiasetettuun aikaväliin, kun olet valmis tarkasteluun

## Automaattinen päivitys

- Ota automaattinen päivitys käyttöön pitääksesi mittareita ajan tasalla ilman manuaalista uudelleenlatausta

## Liittyvät

- [Workflows-välilehti](./workflows-tab.md) – Mitattavat workflowt
- [Traces-välilehti](./traces-tab.md) – Yksityiskohtainen suoritusketjujen tarkastelu
- [Lokit-välilehti](./logs-tab.md) – Runtimelokit virheenkorjausta varten
- [Contextual Showcase](../reference/contextual-showcase.md) – Tiivis sivun opas kojetaulun pintoja varten

Jos haluat saada ilmoituksen kaavion näyttämästä trendistä sen sijaan, että seuraisit sitä aktiivisesti, muuta se [hälytykseksi](./alerts-tab.md): virhemäärä, suorituskesto, LLM-kulutus ja suoritusmäärä voidaan kaikki asettaa kynnysarvoille tietyn aikavälin yli.
