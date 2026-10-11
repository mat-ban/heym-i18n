# Suoritusten välilehti

**Suoritusten** välilehti näyttää LLM-suoritusketjuja. Tarkastele pyyntö-/vastausdatakenttiä, ajoituksia, työkutsuja ja virheenjäljitystä [Agentti](../nodes/agent-node.md)- ja [LLM](../reference/node-types.md)-solmujen toiminnassa sekä aggregoituja mittareita (kutsut, tokenit, kustannukset, viive, virheprosentti) millä tahansa aikavälillä.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Katso Suoritukset-esittely</a></p>

## Tilastoyläotsikko

Sivu avautuu tilastoyhteenvedolla suorituslistan yläpuolella, laskettuna valitun aikavälin ja muiden aktiivisten suodattimien perusteella:

- **KPI-kortit** – Kutsut yhteensä, Tokenit yhteensä, Kustannukset yhteensä (USD), Keskimääräinen viive, Virheprosentti
- **Tokenit mallin mukaan** – Donitsikaavio tokenimäärästä mallikohtaisesti
- **Kustannukset mallin mukaan** – Donitsikaavio USD-kuluista mallikohtaisesti. Hinnoittelemattomille malleille näkyy linkki "Määritä hinnat" kohteeseen [LLM-kustannustaulu](./datatable-tab.md#llm-cost-table-system-table)
- **Kutsut ajan funktiona** – Pinottu aluekaavio onnistuneista ja epäonnistuneista kutsusta aikaväleittäin (5 min / 1 h / 6 h / 1 vrk, valitaan automaattisesti valitun aikavälin mukaan)
- **Huomio hinnoittelemattomista malleista** – Näkyy kaavioiden alla, kun joillakin jäljitetyillä malleilla ei ole hintariviä, ja sisältää linkin LLM-kustannustauluun

## Aikaväli

Yksi **Aikaväli**-valitsin suodatinpalkin yläosassa ohjaa sekä tilastoyläotsikkoa että suorituslistaa. Vaihtoehdot: Viimeinen 1 tunti, Viimeiset 24 tuntia, Viimeiset 7 päivää (oletus), Viimeiset 30 päivää, Kaikki. Aikavälin muuttaminen nollaa sivutusasetukset ja lataa kaaviot ja listan uudelleen yhdessä.

## Suorituslista

- Sivutettu lista viimeisimmistä suorituksista valitulla aikavälillä
- Jokainen suoritus näyttää: workflow, solmu, tunnistetiedot, aikaleima, kesto
- Klikkaa suoritusta avataksesi yksityiskohtaisen näkymän
- Käytä **Edellinen / Seuraava** -painikkeita yksityiskohtaisessa näkymässä liikkuaksesi suoritusten välillä sulkematta ikkunaa

## Suodatus

- **Aikaväli** – 1h / 24h / 7d / 30d / Kaikki; suodattaa sekä kaaviot että listan
- **Tunnistetiedot** – Suodata käytetyn tunnistetiedon (API-avain) mukaan
- **Lähde** – Suodata workflown tai suorituksen lähteen mukaan
- **Haku** – Hae mallin, workflown, tunnistetiedon tai solmun tunnisteen perusteella
- **Päivitä** – Lataa nykyinen suoritussivu uudelleen

## Suorituksen yksityiskohdat

Kun avaat suorituksen:

- **Vaiheet** – Ylhäältä alas -ajoitus, joka lukee suorituksen järjestettynä ketjuna: Järjestelmä → Käyttäjä → Avustaja → Työkalu → Vastaus. Jokainen vaihe on tiivistettävissä; laajennettaessa näkyy luettava yksityiskohta (viestin teksti tai työkalun argumentit ja tulos), jonka jälkeen vaiheen JSON. JSON-sisältö jokaisessa tapahtumatyypissä – mukaan lukien MCP-kutsut ja JSON-RPC-datakentät – avautuu oletuksena laajennettavassa puurakenteessa, jossa ensimmäinen taso on laajennettuna. Käytä **Puu / Raaka** -vaihtoehtoa siirtyäksesi muotoillun rakenteen ja alkuperäisen tekstin välillä. Virheellinen JSON pysyy näkyvissä pelkkänä tekstinä. Työkaluvaiheet näyttävät kestonsa ja MCP/Taito-merkin tarvittaessa sekä odottavat / aikakatkaistut / peruutetut merkit, kun työkutsun tila on asetettu. Vastausvaihe voi näyttää aggregoituja `tool_metrics` -merkkejä (kutsujen määrät tilan ja työkalun kokonaiskeston mukaan). Kun suoritus tallentaa jokaisen mallikutsun, kuten Dashboard Chat -viesti ja reititetty agentti tekevät, **LLM**-vaihe sijaitsee ennen työkutsuja, joita kutsu pyysi, ja **Keston jakautuminen** esittää jokaisen mallikutsun, työkalun ja reitityspäätöksen yhdellä aikajanalla. Dashboard Chat -viesti on yksi suoritus, riippumatta siitä, kuinka monta työvuoroa se vaati. Suoritukset ilman viestiketjua (esimerkiksi kuvagenerointi) näyttävät minimaalisen Pyyntö → Vastaus -ajanjakson.
- **Pyyntö** – Täydellinen pyyntödatakenttä, joka lähetettiin LLM:lle, **Puu / Raaka** -JSON-näkymillä
- **Vastaus** – Mallin vastaus, mukaan lukien mahdolliset työkutsut, **Puu / Raaka** -JSON-näkymillä
- **Työkalumittarit** – Kun vastauksessa läsnä, tiivis yhteenveto työkutsujen määristä (`success` / `error` / `pending` / `timeout` / `cancelled`) ja työkalun kokonaiskestosta
- **Ajoituksen jakautuminen** – `llm_ms`, `tools_ms`, `mcp_list_ms` suorituskykyanalyysiä varten
- **Työkutsut** – Työkalun nimi, argumentit, tulos, tila ja kulunut aika
- **Sisältyvät taidot** – Mallille pyynnössä välitetyt taidot
- **Siirry workflowhin** - Siirry suoraan liittyvään workflowhin suorituksen yksityiskohtaisesta ikkunasta

## Kopiointi ja vienti

- Kopioi pyynnön tai vastauksen JSON leikepöydälle; kopiointi käyttää aina täydellistä raakaa datakenttää riippumatta aktiivisesta näkymästä
- Käytä virheenjäljitykseen tai jakamiseen tukitiimin kanssa

## Ylläpito

- **Tyhjennä kaikki** – Poista kaikki tallennetut suoritukset vahvistuksen jälkeen
- Sivutusvalvonta näyttää nykyisen näkyvän alueen (esimerkiksi `1-25/240`)

## Liittyvät

- [Miksi Heym](../getting-started/why-heym.md) – LLM-havainnollistaminen agentin elinkaaren ajan
- [Agenttisolmu](../nodes/agent-node.md) – Agenttisolmu työkutsuilla
- [Solmutyypit](../reference/node-types.md) – LLM- ja Agenttisolmut
- [Tunnistetietojen välilehti](./credentials-tab.md) – Suorituksissa käytetyt tunnistetiedot
- [OpenTelemetry-jäljitys](../reference/opentelemetry.md) – Valinnainen OTel-vienti workflow-, solmu- ja Agenttityökalujen jänneväleille
- [Datataulukon välilehti](./datatable-tab.md) – Sisältää LLM-kustannustaulun, jota kustannuskaavio käyttää
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Tiivis sivun opas kojelautapinnoille
