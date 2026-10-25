# Portal

**Portal** mahdollistaa Heym-workflowjen julkaisemisen julkisina chat-tyylisiksi käyttöliittyminä. Käyttäjät voivat suorittaa workflowja URL-osoitteen kautta ilman Heymiin kirjautumista.

## Toiminnallisuus

- **Julkinen URL**: `/chat/{slug}` (esim. `/chat/my-workflow`)
- **Chat-käyttöliittymä**: Käyttäjät vuorovaikuttavat chat-käyttöliittymän kautta (viestit, syötteet, vastaukset)
- **Valinnainen autentikointi**: Jos portal-käyttäjät on määritelty, kirjautuminen vaaditaan; muuten portal on julkinen
- **Reaaliaikainen suoritus**: Reaaliaikainen solmujen edistyminen suorituksen aikana (kun käytössä)
- **Suoritusten keskeytys**: Käyttäjät voivat keskeyttää käynnissä olevan portal-suorituksen chat-alalaudalta; aktiivinen workflow-suoritus keskeytetään myös palvelimella
- **Tiedostojen lähetys**: Valinnaiset tiedostojen lähetykset (teksti, kuvat jne.) syötekenttää kohti
- **Ihmisen tarkastus**: Portal-suoritukset voivat näyttää [HITL-tarkastuslinkkejä](./human-in-the-loop.md), kun agentti keskeytyy hyväksyntää varten
- **Kuvanäyttö**: Workflow-tulosteet, jotka sisältävät kuvia (esim. LLM-kuvageneroinnista tai Playwright-näyttökaappauksista), näkyvät chatissa pikkukuvina. Klikkaa mitä tahansa kuvaa avataksesi täysikokoinen katselu; paina **Esc** tai käytä laitteen takaisin-painiketta sulkeaksesi katselun

## Workflow-määritys

| Asetus | Kuvaus |
|---------|-------------|
| `portal_enabled` | Ota portal käyttöön tässä workflowssa |
| `portal_slug` | URL-slug (esim. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Käytä reaaliaikaista suoritusta |
| `portal_file_upload_enabled` | Salli tiedostojen lähetys |
| `portal_file_config` | Kenttäkohtainen tiedostomääritys (tyypit, rajat) |

Määritä editorissa: Workflow-otsikon **Portal**-painike avaa portal-asetukset -valintaikkunan.

## Toimintalogiikka

1. **Info**: `GET /api/portal/{slug}/info` – Palauttaa workflow-metatiedot ja syötekentät (ei autentikointia)
2. **Kirjautuminen** (jos vaaditaan): `POST /api/portal/{slug}/login` – Palauttaa istunnon tokenin
3. **Suoritus**: `POST /api/portal/{slug}/execute` – Portal-chat-käyttöliittymä kutsuu tätä (tai sen reaaliaikaisvarianttia sisäisesti, kun käytössä); loppukäyttäjät vuorovaikuttavat chat-käyttöliittymän kautta, eivät kutsumalla APIa suoraan.
4. **Keskeytys**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Kutsutaan, kun käyttäjä painaa **Stop** aktiivisen portal-suorituksen aikana

## Samanaikaisuusraja

Kun workflow'lla on [samanaikaisuusraja](./webhooks.md#concurrency-limit-and-queued-runs) ja kaikki paikat ovat käytössä, portaaliviesti odottaa vuoroaan heti suorittamisen sijaan. Chat näyttää edistymisrivillään **Waiting in queue (2/5)**, kunnes suoritus alkaa, ja sen jälkeen vastauksen tavalliseen tapaan. Suoritus tapahtuu edelleen, vaikka käyttäjä sulkisi sivun. **Stop** poistaa odottavan suorituksen jonosta. Kun jono on täynnä, viesti epäonnistuu ilmoituksella "Concurrency queue is full". Jonossa odottanut suoritus ei suoratoista vastaustaan token kerrallaan; koko vastaus näytetään, kun se valmistuu.

## HITL portal-suorituksissa

Jos portal-workflow saavuttaa [Agent-solmun](../nodes/agent-node.md), jossa [Human-in-the-Loop](./human-in-the-loop.md) on käytössä, portal-vastaus näyttää tarkastuslinkin tyhjän sijaan.

- Workflow-suorituksen tila muuttuu `pending`-tilaksi
- Portal-chat näyttää tarkastus-URLin
- Kaikki solmut, jotka on kytketty agentin `review`-tulokahvaan, voivat ilmoittaa Slackiin, sähköpostiin tai muihin kanaviin välittömästi
- Tarkastaja suorittaa päätöksen `/review/{token}` -osoitteessa ilman kirjautumista
- Tarkastuksen jälkeen workflow jatkuu tallennetusta tilannevedoksesta

Tämä mahdollistaa julkisten chat-vuoropuhelujen yhdistämisen yksityisten ihmishyväksyntävaiheiden kanssa.

## Syötekentät

Syötekentät tulevat [Syöte](../nodes/input-node.md)-solmuista. API poimii aloitussolmut, joiden tyyppi on `textInput`, ja niiden `inputFields`-kentät. Suoritus käyttää samaa moottoria kuin normaalit suoritukset; syötteet välitetään `body.inputs`- ja `conversation_history`-kenttinä monivuoropuheluille.

## Autentikointi ja istunnot

- **WorkflowPortalUser**: Käyttäjätunnus/salasana per workflow (kun autentikointi on käytössä)
- **Viimeisen käyttäjän poistaminen**: Kun portaali on käytössä, viimeisen portaalikäyttäjän poistaminen tekee portaalista jälleen julkisen; asetusikkuna pyytää ensin vahvistusta
- **PortalSession**: Istunnon tokenit, joilla on 168 tunnin TTL
- **Nopeusrajoitus**: 3 epäonnistunutta kirjautumisyritystä → 24 tunnin esto per workflow+IP
- Vanhentuneet istunnot siivotaan cron-ajon avulla

## Määrityskäyttöliittymä

**WebPortalSettingsDialog** -välilehdet:

1. **Yleinen**: Ota portal käyttöön, aseta slug, kopioi portal-URL
2. **Käyttäjät**: Lisää/poista portal-käyttäjiä (käyttäjätunnus/salasana)
3. **Valinnat**: Reaaliaikainen tila, tiedostojen lähetys, näytä syötekentät

## Liittyvät aiheet

- [Miksi Heym](../getting-started/why-heym.md) – Portal chat-pinnana tuotannossa toimiville agenteille
- [Workflows-välilehti](../tabs/workflows-tab.md) – Luo workflowja ja ota portal käyttöön
- [Human-in-the-Loop](./human-in-the-loop.md) – Julkiset tarkastussivut odottaville agenttitulosteille
- [Triggers](./triggers.md) – Portal sisääntulopisteenä
- [Solmutyypit](./node-types.md) – [Syöte](../nodes/input-node.md) portal-syötteille
- [Workflow-rakenne](./workflow-structure.md) – Solmut ja yhteydet
