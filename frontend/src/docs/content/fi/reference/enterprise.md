# Enterprise

Kaupalliset lisenssit, ammattitaitoinen tuki ja käyttöönottoapuvälineet Heym-alustalle.

## Yleiskatsaus

Heym on vapaasti käytettävissä ja omassa käytössä hallittavissa sen lähdekoodia tarjoavan lisenssin puitteissa. Organisaatioille, jotka tarvitsevat kaupallista lisenssiä, tuotantokäyttöön soveltuvaa käyttöönottoapua tai erikoistunutta tukea, Enterprise-suunnitelma tarjoaa Heym-tiimin käsityötä sisältäviä palveluita.

| Palvelu | Kuvaus |
|---------|-------------|
| **Tuotantoagenttien tuki** | Arkkitehtuurikatselmukset, agenttien ja workflowjen suunnittelun ohjaus sekä käytännön apua agenttien viemiseen tuotantokäyttöön |
| **Työkalukoulutus** | Perehdytykset ja koulutukset tiimillesi workflow-editorista, tekoälysolmuista, agenteista ja integraatioista |
| **Heym Q&A** | Suora yhteys Heymin kehitystiimiin alustaan liittyvissä kysymyksissä, parhaisiin käytäntöihin ja vianmääritykseen |
| **Kubernetes-käyttöönotto** | Apua usean työntekijäsolmun asetuksien, sidecar-säiliöiden, skaalausstrategioiden ja klusterin konfiguroinnin kanssa |
| **Ratkaisukonsultointi** | Mukautettu ratkaisusuunnittelu organisaatiosi erityistarpeisiin, mukaan lukien integrointisuunnittelu ja arkkitehtuurisuositukset |
| **Priorisoitu tuki & SLA** | Taatut vastausajat ja priorisoitu ongelmien ratkaisu |
| **Mukautettu kehitys** | Ominaisuuksien kehitys ja muokkaukset organisaatiosi vaatimuksiin räätälöitynä |

## Heym Work

[Heym Work](./heym-work.md) on liiketoimintatiimeille suunnattu käyttöliittymä, joka toimii Heymin päällä. Käyttäjät kuvailevat tehtävän, vastaavat muutamaan kysymykseen ja saavat testatun workflow'n, työskentelevät heille rakennetuilla sivuilla ja vastaavat tarkistuksiin – kertakirjautumisella (SSO), Owner-, Editor- ja Viewer-rooleilla sekä nimellä jokaisessa suorituksessa. Se toimii Heym-instanssisi rinnalla omalla lisenssillään; yhdistä se kohdassa **Settings → Heym Work**. Lue lisää ja pyydä kokeiluversio osoitteessa [heym.run/enterprise](https://heym.run/enterprise).

## Tuotantoagenttien tuki

Heym-tiimi auttaa suunnittelemaan, rakentamaan ja vahvistamaan agentteja ja workflowja liiketoimintaprosessien tueksi. Tämä sisältää vaatimusten tarkastelun, solmujen konfiguraatioiden suosittelun ja varmistuksen siitä, että workflowt noudattavat parhaita käytäntöjä luotettavuuden, havainnoitavuuden ja hallinnan osalta.

Tuki kattaa kaikki solmutyypit, mukaan lukien [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) ja [Cron](../nodes/cron-node.md) -laukaisimet — sekä edistyneet mallit kuten [moniagenttiorkestrointi](./agent-architecture.md), [ihmisen osallistuminen](./human-in-the-loop.md) tarkistuspisteet ja [rinnakkaissuoritus](./parallel-execution.md) eri haaroilla.

## Työkalukoulutus

Käytännön koulutussessiot, jotka on räätälöity tiimisi osaamistasolle ja käyttötarkoituksille:

- Workflow-editori ja [canvas-ominaisuudet](./canvas-features.md)
- Tekoälyllä toimivat solmut: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agenttien arkkitehtuuri](./agent-architecture.md) ja moniagenttiorkestrointi
- [Tunnistetiedot](./credentials.md) hallinta ja [kolmannen osapuolen integraatiot](./integrations.md)
- [Laukaisimet](./triggers.md), [webhookit](./webhooks.md) ja aikataulutus [Cron](../nodes/cron-node.md) -solmulla
- [Expression DSL](./expression-dsl.md) ja [globaalit muuttujat](./global-variables.md)
- [Tiimit](./teams.md) yhteistyö ja [tunnistetietojen jakaminen](./credentials-sharing.md)
- [Portal](./portal.md) -käyttöönotto asiakasrajapinnan chat-ominaisuuksille
- [Suoritukset](../tabs/traces-tab.md) ja [arvioinnit](../tabs/evals-tab.md) tekoälyworkflowjen havainnoitavuuteen

## Kubernetes-käyttöönotto

Standardiohje [Running & Deployment](../getting-started/running-and-deployment.md) kattaa Docker Composen yksittäiselle palvelimelle tuotantokäyttöön. Enterprise-asiakkaat saavat apua tuotantokäyttöön soveltuvien Kubernetes-käyttöönottojen kanssa korkean saatavuuden ja vaakasuuntaisen skaalautuvuuden saavuttamiseksi:

- **Useat työntekijäsolmut** — Heymin taustaprosessien jakaminen useille Kubernetes-solmuille redundanssin ja kuormantasauksen vuoksi
- **Sidecar-säiliöt** — Sidecar-mallien konfigurointi lokien keräykseen, seuranta-agenteille, palvelumäsille (Istio, Linkerd) ja salaisuuksien injektointiin (Vault)
- **Resurssisuunnittelu** — CPU- ja muistivaraukset/rajat, podien häiriöbudjetit ja vaakasuuntaiset podin autoskaalauskäytännöt
- **Verkkoyhteydet** — Ingress-kontrollerin konfigurointi, TLS-päätös ja sisäiset palveluväliset yhteydet taustaprosessien, käyttöliittymän ja tietokantapodien välillä
- **Pysyvä tallennus** - Tietokannan ja vektorivaraston tilan varaus sopivalla StorageClassilla ja varmuuskopiointistrategioilla
- **Seuranta** - Integraatiot Prometheuksen, Grafanan tai olemassa olevan havainnoitavuusratkaisun kanssa konttien mittareiden, lokien ja hälytysten seurantaan

## Ratkaisukonsultointi

Jokainen organisaatio käyttää agentteja eri järjestelmien ja rajoitusten puitteissa. Heym-tiimi tarjoaa konsultointia auttaakseen sinua:

- Arvioimaan sopiiko Heym organisaatiosi käyttötapaukseen
- Suunnittelemaan kokonaisvaltaisia agentti- ja workflow-arkkitehtuureja
- Suunnittelemaan integraatiot olemassa olevan infrastruktuurin ja kolmannen osapuolen palveluiden kanssa
- Etsimään virheitä monimutkaisista workflowista ja ratkaisemaan tuotantoon liittyviä ongelmia
- Siirtämään olemassa olevat workflowt työkaluista kuten n8n, Zapier tai Make.com

## Yhteystiedot

Ota yhteyttä enterprise-tiimiin sähköpostitse **enterprise@heym.run** lisenssikyselyissä, hinnoittelussa tai alustavan puhelun varaamisessa.

## Aiheeseen liittyvät

- [Running & Deployment](../getting-started/running-and-deployment.md) — Tuotantokäyttöönotto Docker Composella
- [Security](./security.md) — Alustan turvallisuuskäytännöt ja konfigurointi
- [Parallel Execution](./parallel-execution.md) — Monityöntekijäsuoritusmalli
- [Teams](./teams.md) — Tiimiyhteistyö ja resurssien jakaminen
- [Full Feature Set](./features.md) — Kattava yleiskatsaus Heymin ominaisuuksista
- [Heym Work](./heym-work.md): liiketoimintatiimien käyttöliittymä ja sen yhdistäminen
