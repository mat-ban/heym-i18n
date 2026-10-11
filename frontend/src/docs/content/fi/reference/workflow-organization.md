# Workflowjen organisointi

Heym mahdollistaa workflowjen järjestämisen kansioihin, alikansioiden luomisen sekä workflowjen poistoaikataulutuksen. Katso [Workflow-välilehti](../tabs/workflows-tab.md) käyttöliittymän yleiskatsaukseen.

## Kansiot ja alikansiot

Kansiot muodostavat puurakenteen. Jokaisessa kansiossa on:

- **Nimi** – Näyttönimi
- **Yläkansio** – `parent_id` viittaa toiseen kansioon; `null` tarkoittaa juurikansiota
- **Workflowt** – Workflowt voidaan siirtää kansioihin `folder_id`-kentän avulla

### API

| Endpoint | Tarkoitus |
|----------|---------|
| `GET /folders` | Vain juurikansiot |
| `GET /folders/tree` | Koko puurakenne (alikansiot + workflowt) |
| `GET /folders/{id}` | Yksittäinen kansio sisältöineen |
| `POST /folders` | Luo kansio (`parent_id` valinnainen) |
| `PUT /folders/{id}` | Päivitä nimi tai `parent_id` |
| `DELETE /folders/{id}` | Poista kansio (kaskadipoisto) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Siirrä workflow kansioon |
| `DELETE /folders/workflows/{workflow_id}/folder` | Poista workflow kansiosta |
| `GET /folders/{id}/export` | Lataa kansio ja kaikki alikansiot ZIP-tiedostona |

### Puurakenne

Puurakenteen vastaus sisältää `children` ja `workflows` kustakin kansiosta. Jaetut workflowt voivat näkyä kansiossa `WorkflowShare.folder_id`-kentän kautta.

## Workflowjen jakaminen

Avaa **Jaa** workflow-editorissa kutsuaksesi käyttäjiä sähköpostitse tai jakaa workflown [tiimin](./teams.md) kanssa. Jokaisella kutsulla ja tiimijakamisella on liitettynä käyttöoikeus:

| Käyttöoikeus | Mitä yhteistyökumppani voi tehdä |
|------------|------------------------------|
| **Luku** | Avaa workflown, tarkastele sitä, näe suoritushistorian ja suorita se. Editori avautuu vain luku -tilassa: Tallennus on pois käytöstä ja canvasta ei voi muokata. |
| **Kirjoitus** | Kaikki mitä Luku sallii, plus canvasin, asetusten, analyysidokumentin ja agentin muistin muokkaaminen. |

Käyttöoikeus näkyy jokaisen jaon kohdassa Jaa-dialogissa ja sitä voi muuttaa milloin tahansa pudotusvalikosta poistamatta ja lisäämättä jakoa uudelleen. Kun käyttäjä pääsee workflowhin useita reittejä (suora jako ja yksi tai useampi tiimi), **korkein** käyttöoikeus voittaa. Ennen käyttöoikeuksien käyttöönottoa tehdyt jaot ovat **Kirjoitus**, ja API-asiakkaat, jotka jättävät `permission`-kentän pois, saavat myös **Kirjoitus**-oikeudet.

Omistajalle varatut toiminnot eivät koskaan riipu käyttöoikeudesta: workflown poistaminen, versioiden palauttaminen tai tyhjentäminen, historian tyhjentäminen, jaosten hallinta sekä alla olevat [vain omistajalle -asetukset](#vain-omistajalle---asetukset) pysyvät omistajalla myös **Kirjoitus**-yhteistyökumppaneilla. **Luku**-oikeudet omaava yhteistyökumppani, joka lähettää muokkauksen API:n kautta (`PUT /api/workflows/{id}`, analyysimuistiinpano, agentin muisti, välimuistin tyhjennys) tai tekoälyavustajan kautta, saa vastaukseksi `403` virheen ja viestin `Sinulla on vain lukuoikeudet tähän workflowhun`.

Workflown jakaminen antaa pääsyn canvasiin, suoritushistoriaan ja analyysidokumenttiin. Se **ei** automaattisesti jaa:

- Workflown solmuissa viitattuja **tunnistetietoja**
- [Suorita](../nodes/execute-node.md)-solmuilla tai agenteilla kutsuttuja **aliworkflowja**

Vastaanottajien tulee saada nämä tunnistetiedot ja aliworkflowt jaettuna erikseen (samoille käyttäjille tai tiimeille). Jaa tunnistetiedot [Tunnistetiedot-välilehdeltä](../tabs/credentials-tab.md); katso [Tunnistetietojen jakaminen](./credentials-sharing.md). Jaa jokainen aliworkflow sen oman editorin jakodialogista.

### Vain omistajalle -asetukset

Koko **Suorita cURL:lla** -konfiguraatio pysyy omistajalla jaon jälkeen. Yhteistyökumppanit voivat edelleen avata dialogin ja kopioida generoidun komennon, mutta ohjauselementit ovat vain luku -tilassa.

Seuraavien asetusten muuttaminen ei-omistajana hylätään virheellä `403`:

- **Todennus** (`auth_type`) ja **Otsikkokenttä** (`auth_header_key`)
- **Pyynnön runko** -tila (`webhook_body_mode`) ja **Pyyntömetodi** (`http_method`)
- **Vastauksen välimuisti** (`cache_ttl_seconds`) ja **Käyttörajoitus** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE-suoratoisto** (`sse_enabled`, `sse_node_config`)

**Otsikon arvo** (`auth_header_value`) käyttäytyy eri tavalla: se on piilotettu yhteistyökumppaneilta kokonaan, ja yhteistyökumppanin kirjoitusoperaatio jätetään huomiotta sen sijaan että se hylättäisiin. Editori näyttää kentän peitettuna, joten `403`-virhe siellä rikkoisi tavallisen tallennuksen sen sijaan että se ilmoittaisi hyökkäyksestä.

Todennus on syy sille, miksi tämä lohko on vain omistajalle: `Anonymous` sallii tunnistautumattomien kutsumien suorittaa workflown, ja suoritus ilman kirjautunutta käyttäjää käyttää **omistajan** tunnistetietoja ja globaaleja muuttujia, ei kutsujan. Muu lohko liittyy julkaistuun pyyntösopimukseen ja omistajan kustannuskontrolliin, joten se liikkuu sen mukana.

**Virhetilanteessa suorita workflow** (`error_workflow_id`) workflow-tason **Ominaisuudet**-paneelissa on vain omistajalle samasta syystä: [virheworkflow](./features.md#error-workflow) suoritetaan epäonnistuneen suorituksen tunnistetiedoilla ja globaaleilla muuttujilla, jotka ovat omistajan käytettävissä käynnistetyissä ja tunnistamattomissa suorituksissa. Yhteistyökumppanit näkevät asetuksen vain luku -tilassa, ja sen lisääminen, korvaaminen tai tyhjentäminen ei-omistajana hylätään virheellä `403`.

Canvasin, nimen ja kuvauksen muokkaaminen ei ole vaikutuksen alaisena.

### Suoritustokenit

Yhteistyökumppani voi luoda suoritustokenin hänelle jaetulle workflowlle. Suoritus liitetään **tokenin luoneelle käyttäjälle**, joten se käyttää kyseisen käyttäjän tunnistetietoja ja globaaleja muuttujia, ei omistajan. Vain aidosti tunnistautumaton kutsu — `auth_type: anonymous` ilman kutsujaa — suoritetaan omistajan kontekstissa.

## Poistoaikataulutettu

Workflowt voidaan aikatauluttaa poistettaviksi välittömän poistamisen sijaan.

- **Kenttä**: `scheduled_for_deletion` (nullattava päivämäärä ja aika)
- **Käyttäytyminen**: Kun asetus on päällä, workflow siirtyy `folder_id = null` -tilaan ja näkyy "Poistoaikataulutettu" -osiossa.
### API

| Endpoint | Tarkoitus |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Aseta `scheduled_for_deletion`, tyhjennä `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Tyhjennä `scheduled_for_deletion` (palauta) |

### Käyttöliittymä

- **Vedä roskakoriin** – Pudota workflowt "Aikataulutettu poistettavaksi" -alueelle aikatauluttamista varten
- **Palauta** – Poista aikataulutuksesta
- **Poista välittömästi** – Roskakori-ikoni pysyvää poistoa varten

### Siivouslogiikka

Cron-ajastettu tehtävä suoritetaan päivittäin kello **23:59** (konfiguroitu aikavyöhyke). Workflow poistetaan vain, kun:

- **Kaikki alkusolmut** (solmut, joihin ei tule yhteyksiä, lukuun ottamatta sticky/errorHandler) ovat `active === false`

Jos jokin alkusolmu on edelleen aktiivinen, workflow säilyy seuraavaan suorituskertaan asti.

## Dashboard-käyttöliittymä

- **Kansiorivit** – Uusi kansio, rekursiivinen kansiopuu laajennus/kutistustoiminnoilla. Jokaisessa kansiossa on valinnainen kuvaus nimen alla ja merkintä, joka laskee kansiossa olevat workflowt mukaan lukien alikansiot.
- **Kansiotoiminnot** – Uusi alikansio, Nimeä uudelleen, Vaihda kuvake, Lataa ZIP-tiedostona ja Poista ovat rivikohtaisesti saatavilla; hiiren oikean painikkeen kontekstivalikko tarjoaa samat toiminnot, ja puhelimet näyttävät yksittäisen valikkopainikkeen.
- **Pääalue** – Juuritason workflowt (ei kansiota, ei aikataulutettu) ja Aikataulutettu poistettavaksi
- **Kansion pudotusesitys** – Workflown vetäminen korostaa tarkan kansion tai alikansion ja näyttää sen täydellisen polun korttikokoisessa esikatselussa. Kutistettu kansio laajenee lyhyen viipymisen jälkeen.
- **Vakaa vetopalautte** – Lähdekortti käyttää vetämisen haamua, ja aktiivinen pudotuskohde pysyy valittuna vierittäessä tai ohjausobjektien ylittäessä saman kansion sisällä.
- **Kohdetarkistus** – Nykyinen kansio näytetään muodossa **Jo kansiossa** eikä hyväksy tarpeetonta siirtoa.
- **Muut pudotusvyöhykkeet** – Juuri ja "Aikataulutettu poistettavaksi" korostuvat, kun ne voivat hyväksyä vedetyn workflown.
- **ZIP-pudotus** – Pudota ZIP-tiedosto workflow-alueelle tuodaksesi kansiorakenteen juuritasolle

## Liittyvät aiheet

- [Workflowt-välilehti](../tabs/workflows-tab.md) – Luo ja hallinnoi workflowja
- [Tunnistetietojen jakaminen](./credentials-sharing.md) – Jaa tunnistetiedot workflowjen yhteistyökumppaneiden kanssa
- [Tiimit](./teams.md) – Jaa workflowt ja tunnistetiedot tiimien kanssa
- [Keskeiset käsitteet](../getting-started/core-concepts.md) – Workflowt, solmut ja suoritus
- [Workflown rakenne](./workflow-structure.md) – Workflowjen JSON-muoto
- [Triggerit](./triggers.md) – Alkusolmut ja sisäänpääsypisteet
