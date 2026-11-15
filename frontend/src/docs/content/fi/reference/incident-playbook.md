# Heym Incident Playbook (L0)

Käytä tätä käsikirjaa (playbook) Heym-häiriötilanteen vahvistamiseen, käyttäjävaikutusten arviointiin, vakavuusasteen (severity) valitsemiseen sekä oikean toipumismenettelyn ja vastuuhenkilön tavoittamiseen.

Yksityiskohtaiset menettelyt: [Heym Runbook (L1)](./operations-runbook.md)

Viimeksi tarkistettu: 2026-11-10. Soveltamisala: self-hosted Heym, yksittäinen instanssi tai cluster, Docker Composessa tai Kubernetesissa.

## Käyttöönoton luovutus (Deployment handover)

Täytä tämä taulukko kullekin ympäristölle ennen näiden dokumenttien käyttöä päivystyksessä (on-call). Nimet, URL-osoitteet, kapasiteettitavoitteet ja toipumistavoitteet ovat käyttöönototapauskohtaisia. Repositorion esimerkit eivät muodosta tuotantoinventaariota.

| Kohde | Arvo käyttöönotossa |
| --- | --- |
| Ympäristö ja julkinen Heym-URL | `<environment>`, `<public-url>` |
| Alustapäivystäjä ja varahenkilö | `<rotation-or-contact>`, `<backup-contact>` |
| Häiriökanava ja häiriöseuranta | `<channel>`, `<tracker-url>` |
| Tietokantapäivystäjä ja tietokannan tunniste | `<contact>`, `<database-id>` |
| Infrastruktuuri-, verkko- ja tallennustilavastaavat | `<contacts>` |
| Julkaisuvastaava ja käyttöönottotyökalu | `<contact>`, `<deployment-url>` |
| Sovellusvirheiden, viiveen ja saatavuuden koontinäyttö | `<dashboard-url>` |
| Isännän tai podin CPU:n, muistin, levyn ja uudelleenkäynnistysten koontinäyttö | `<dashboard-url>` |
| PostgreSQL-yhteyksien, lukkojen, levyn ja replikoinnin koontinäyttö | `<dashboard-url>` |
| Lokit ja valinnainen OTel-jäljitysbackend | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose-projekti/tiedostot tai Kubernetes-konteksti/namespace | `<exact-target>` |
| Mainin, workerien, tietokannan ja tallennustilan sijainnit | `<services-or-deployments>`, `<storage-ids>` |
| Hyväksytty savutesti-workflow (smoke) ja odotettu tulos | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Tietokannan ja tiedostojen varmuuskopiointimenettely, viimeisin palautustesti | `<procedure-url>`, `<test-date>` |
| Toipumisaikatavoite (RTO) ja toipumispistetavoite (RPO) | `<RTO>`, `<RPO>` |

Säilytä yhteystiedot ja koontinäyttöjen linkit käyttöönoton rajoitetun pääsyn operatiivisessa kopiossa. Todisteiden tulee sisältää tunnisteita, aikaleimoja, laskureita ja siistittyjä virheilmoituksia credentials- tai workflow-payload-tietojen sijaan.

## Alustaluettelo

| Komponentti | Vastuu | Vaikutus häiriötilanteessa |
| --- | --- | --- |
| Frontend ja pääbackend (main) | UI, API, MCP, Portal, interaktiivinen suoritus | Tarkista julkinen reitti ja pääprosessi erikseen |
| PostgreSQL | Sovelluksen tila, suoritusrekisteri, suoritusjono, rinnakkaisuuspaikat, koordinointi ja ilmoitukset | Tietokantakatkos voi pysäyttää sekä pyyntöjen käsittelyn että taustasuorituksen |
| Worker-instanssit, kun cluster-tila on käytössä | Kelvolliset taustasuoritukset jonossa | Terveet workerit eivät korvaa main-instanssin julkisia endpointeja |
| Valittu johtajaprosessi (leader) | Cron, hälytysten arviointi, taustakoordinointi | Yhteensopiva worker voi tulla johtajaksi; tämä ei muuta sen roolia mainiksi |
| Main-instanssin pysyvä tallennustila | Drive-tiedostot, asennetut liitännäiset ja koodausagenttien työtilat | Palauta tallennustila yhdessä mainin kanssa; ingressin ohjaaminen workerille ei palauta sitä |
| Sandbox-backend jokaisessa suoritusinstanssissa | Docker-säiliöt tai Kubernetes-podit eristettyyn suoritukseen | Vikaantunut sandbox-backend voi vaikuttaa valittuihin solmuihin UI:n toimiessa |
| Workflow-riippuvuudet | Mallintarjoajat, MCP-palvelimet, ulkoiset API:t, tietovarastot ja viestipalvelut | Selvitä, vikaantuuko yksittäinen riippuvuus vai koko alusta |
| Valinnainen OTel-kerääjä | Viedyt workflow-, solmu- ja Agent-työkalujen jänteet (spans) | Puuttuvat jäljitykset eivät yksinään todista suorituksen epäonnistumista |

Heymin sisäänrakennettu suoritusjono käyttää PostgreSQL:ää. Redis, RabbitMQ ja vektoritietokannat voivat olla workflow-riippuvuuksia; ne eivät ole pakollisia palveluita sisäänrakennetulle jonolle.

`GET /api/health` raportoi ainoastaan prosessin kunnon ja version. Se ei testaa PostgreSQL:ää, jonoa, johtajavaalia, sandbox-kapasiteettia tai credentials-synkronointia. Positiivinen vastaus on yksittäinen tarkistus, ei tae järjestelmän valmiudesta.

## Ensimmäiset viisi minuuttia

| Vaihe | Toimenpide | Päätös tai todiste |
| --- | --- | --- |
| 1 | Kuittaa hälytys ja tarkista ympäristö, palvelu ja alkamisaika | Kirjaa UTC-aikaleimat ja viimeisin julkaisu-/konfiguraatiomuutos |
| 2 | Tarkista julkinen UI ja `/api/health`, sitten suora main-backend | Julkinen virhe terveen suoran backendin rinnalla viittaa reititys- tai frontend-ongelmiin |
| 3 | Tarkista PostgreSQL-yhteydet ja yhteyskuormitus | Ohjaa tietokantaviat L1-tasolle ennen sovelluspalveluiden uudelleenkäynnistystä |
| 4 | Tarkista säiliöiden/podien tila, CPU, muisti, tallennustila ja tuoreet virheet | Erottele infrastruktuurivika, ylikuormitus ja workflow-kohtaiset virheet |
| 5 | Cluster-tilassa tarkista **Asetukset > Instanssit**, jonojen tilat ja johtajatiedot | Tunnista mainin menetys, offline/yhteensopimattomat workerit tai main-sidotut työt |
| 6 | Määritä vakavuusaste ja aloita yksi lieventävä toimenpide reititystaulukosta | Avaa P1/P2-tapauksissa välittömästi häiriötiketti ja ota yhteys vastaavaan omistajaan |
| 7 | Varmista turvallisen tuotantotilan workflow-ajo ja seuraa toipumista | Varmista jonon iän, virheiden ja resurssien paraneminen; aseta seuraava päivitysaika |

Jos julkaisu osuu samaan aikaan vian kanssa, tutki [Virheellinen käyttöönotto tai konfiguraatioregressio](./operations-runbook.md#bad-deployment-or-configuration-regression). Tarkista skeeman yhteensopivuus ennen palautusta (rollback).

## Vakavuusaste ja vaste

Nämä ovat alustavia vastetavoitteita. Sovella käyttöönoton häiriökäytäntöä ja liiketoimintavaikutusta, jos ne ovat tiukempia.

| Vakavuus | Esimerkit | Vaste |
| --- | --- | --- |
| P1 | Main ei ole kenenkään käytettävissä; tietokanta ei ole käytettävissä tai kirjoitukset epäonnistuvat; laaja suoritushäiriö; kriittinen syöte estynyt kaikissa workfloweissa | Välitön rajoittaminen, häiriömerkintä, alusta- ja riippuvuuspäivystys |
| P2 | Kasvava jonoruuhka; worker-kapasiteetin menetys; lähestyvä yhteyksien loppuminen; yksi workflow heikentää jaettua kapasiteettia; toistuvat OOM-kaatumiset | Aloita toimenpiteet välittömästi, rajaustavoite 15 minuutissa, häiriömerkintä |
| P3 | Eristetty workflow- tai tarjoajavika; rajallinen vaikutus alustan säilyessä toimintakykyisenä | Workflow- tai komponenttivastaava, seurattava toimenpide ja päivystysmerkintä |
| P4 | Informatiivinen signaali, odotettu kapasiteettitrendi, vahvistettu väärä hälytys | Kuittaa, dokumentoi ja säädä valvontaa tarvittaessa |

## Signaalien reititys L1-tasolle

Käytä näitä suhteellisia ankkureita hälytyslinkkejä määritettäessä. Jos valvontapalvelu vaatii absoluuttisen URL-osoitteen, lisää eteen isännöidyn operatiivisen kopiosi sijainti.

| Signaali | Aloita tästä |
| --- | --- |
| UI/API ei käytettävissä, julkiset 5xx-virheet, prosessin kuntotarkastus epäonnistui | [UI tai API alhaalla](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL ei tavoitettavissa, yhteys hylätty, kirjoitusvirhe | [Tietokanta alhaalla](./operations-runbook.md#postgresql-down-or-not-writable) |
| Liikaa asiakkaita, poolin aikakatkaisu, lukkoodotukset, aktiivisten yhteyksien piikki | [Tietokantayhteydet ja lukot](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Backendin tai workerien hallittu uudelleenkäynnistys tarpeen | [Palvelun uudelleenkäynnistys](./operations-runbook.md#controlled-service-restart) |
| Piikki suoritusten määrässä, kokonaiskestossa, tokeneissa, CPU:ssa tai muistissa | [Eniten resursseja kuluttavat workflowt](./operations-runbook.md#most-resource-consuming-workflows) |
| Kasvava jono, odottavat tai näennäisesti jumiutuneet ajot | [Jonon ruuhkautuminen (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instanssi offline tai yhteensopimaton, joutilas worker, ajastus- tai jakeluongelma | [Cluster-tilan tarkistukset](./operations-runbook.md#cluster-mode-checks) |
| Main menetetty workerien pysyessä terveinä | [Main-instanssi ei käytettävissä](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook-virheet, MCP/Portal-häiriöt, SSE-suoratoiston katkeamiset | [Ingress- ja suoritus-endpointit](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, levy täynnä, pysyvän taltion vika | [Säiliö-, pod- tai tallennustilaongelma](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Agent/LLM/MCP-tarjoajan virheet, koodi 429, credentials-virhe | [Malli- tai integraatiovika](./operations-runbook.md#model-credential-or-integration-failure) |
| Sandbox-virheet Code-, Playwright-, skill- tai koodausagenttiajossa | [Sandbox-vika](./operations-runbook.md#sandbox-failure) |
| Toipuminen ei saavuta tavoitteita; tietokanta tai tiedostoja menetetty | [Toipuminen ja katastrofivalmius](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalointi

| Havainto | Kutsu mukaan | Toimita |
| --- | --- | --- |
| Useita rajapintoja tai workfloweja vaikutuksen alaisena | Alustapäivystäjä ja häiriöjohtaja | Ympäristö, laajuus, alkamisaika, toimenpiteet, seuraava tilannepäivitys |
| Tietokanta ei käytettävissä, kyllästetty, lukittu tai levy täynnä | Tietokantapäivystäjä | Tietokannan ID, yhteyksien määrä, estävät PID:t, siistityt virheet, levyn tila |
| Pod-/solmuvika, tallennustilan liitos, sandbox-kapasiteetti | Infrastruktuuri-/tallennustilavastaava | Konteksti, namespace, työkuorma, pod-tapahtumat, resurssipaine |
| Julkinen reitti pettää suoran backendin toimiessa | Verkko-/ingressvastaava | Vaikutuksen alaiset reitit, tilakoodit, viive, vertailu backendin kanssa |
| Yksi workflow hallitsee kuormitusta tai pettää eristetysti | Kyseisen workflow'n omistaja | Workflow-/ajotunnisteet, trigger-lähde, taajuus, aikaikkuna, tilapäiset rajat |
| Korreloitu julkaisu- tai konfiguraatiomuutos | Julkaisuvastaava | Aktiivisen kuvan tunniste (digest), käyttöönottoaika, skeemaversio, viimeisin toimiva versio |
| Tarjoajan kiintiö, todennus tai saatavuus | Credential- tai integraatiovastaava | Tarjoaja, malli/palvelu, tilakoodi, pyynnön ID jos turvallinen; ei salaisia arvoja |

Jos P1/P2-tason vaikutus jatkuu ensimmäisen lieventävän toimenpiteen jälkeen, eskaloi välittömästi jo kerätyillä todisteilla. Älä odota täydellistä juurisyyanalyysia.

## Odotettu käyttäytyminen vikatilanteissa

| Vika | Mikä voi jatkua | Ensimmäinen toimenpide |
| --- | --- | --- |
| PostgreSQL ei käytettävissä | Staattinen frontend voi edelleen latautua | Palauta tietokantapolku; älä käynnistä jokaista sovellusinstanssia uudelleen |
| Main ei käytettävissä, workerit terveitä | Kelvolliset taustatyöt ja ajastukset voivat jatkua, jos yhteensopiva worker johtaa | Palauta main pysyvän tallennustilansa kanssa; julkiset UI/API/MCP/Portal pysyvät poissa käytöstä |
| Worker ei käytettävissä | Muut kelvolliset instanssit ottavat jonotetut työt vastaan uudelleenjaon yhteydessä | Tarkista sijoittelu, varakapasiteetti ja toipuminen ennen liikenteen palauttamista |
| Keskeytynyt ajo | Kelvolliset palautuskelpoiset ajot voivat käynnistyä alusta, kerran | Tarkista automaattinen toipuminen ja ulkoiset sivuvaikutukset ennen manuaalista uusinta-ajoa |
| Vain mainille osoitettujen töiden ylikuormitus | Workerit voivat pysyä joutilaina | Vähennä kuormittavaa syötettä tai lisää mainin kapasiteettia; painotusmuutokset eivät siirrä sidottuja töitä |
| Sisäinen hälytysjärjestelmä ei käytettävissä | Ulkoinen käytettävyys-/tietokanta-/infraseuranta voi edelleen toimia | Käytä Heymin ulkopuolista seurantaa; Heymin hälytykset riippuvat samasta tietokannasta ja ajastimesta |
| Sandbox tai tarjoaja ei käytettävissä | Workflowt ilman kyseistä riippuvuutta voivat toimia | Eristä vaikutuksen alaiset workflowt ja korjaa riippuvuus |

## Toipuminen ja häiriön päättäminen

1. Varmista julkinen pääsy, tietokantayhteys, instanssien tarkoitettu kelpoisuus ja turvallinen tuotantotilan savutesti-workflow (smoke). Testi editorissa ei todista välitystä workereille.
2. Seuraa vähintään 10 minuutin ajan virheiden, viiveen ja resurssien käytön vakautta sekä jonon iän pienenemistä. Seuraa myös seuraavaa odotettua kriittistä ajastusta tai sovittua vastaavaa tarkistusta.
3. Täsmää epäonnistuneet, palautetut, ohitetut, vanhentuneet ja odottavat ajot workflow-omistajien kanssa. Tarkista ulkoiset sivuvaikutukset ennen minkään ajamista uudelleen.
4. Pura tilapäiset trigger-keskeytykset, rajat ja worker-painotukset asteittain. Määritä kullekin jäljellä olevalle rajoitukselle vastuuhenkilö ja vanhentumisaika.
5. Päivitä häiriötiketti vaikutuksilla, UTC-aikajanalla, toimenpiteillä, todisteilla ja avoimilla riskeillä. Määritä juurisyyn tutkinta (post-mortem) P1/P2-tapauksille ja päivitä molemmat dokumentit, jos jokin menettely puuttui.

## Liittyvät operatiiviset viitteet

- [L1-komentojen määritys ja tarkistukset](./operations-runbook.md#command-setup)
- [Käyttö ja käyttöönotto](../getting-started/running-and-deployment.md)
- [Kuormanjako](./cluster.md)
- [Kubernetes-käyttöönotto](../getting-started/kubernetes.md)
- [Turvallisuus ja avainten kierto](./security.md)
