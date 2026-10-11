# RAG / Vektorivarasto

**RAG / Vektorivarasto** -solmu lisää, päivittää, poistaa ja hakee dokumentteja vektorivarastosta Retrieval Augmented Generation (RAG) -käyttöön. Käytä sitä täydentämään LLM-kontekstia asiaankuuluvilla dokumenteilla ja pitämään tämä konteksti synkronoituna dokumenttien lähdejärjestelmän kanssa.

Solmussa on **Tietokanta** -pudotusvalikko, jossa valitaan taustajärjestelmä:

- **Qdrant** – tallentaa vektorit ulkoiseen Qdrant-palvelimeen (vaatii *RAG: Qdrant + OpenAI* -tunnistetiedot).
- **Postgres (pgvector)** – tallentaa vektorit suoraan Heymin omaan Postgres-tietokantaan, ei ulkoista palvelua (vaatii *RAG: Psql + OpenAI* -tunnistetiedot).

Oletusarvo on **Qdrant** taaksepäin yhteensopivuuden vuoksi. Tietokannan vaihtaminen suodattaa **Vektorivarasto** -listan näyttämään vain kyseisellä taustajärjestelmällä tuetut varastot. Molemmat taustajärjestelmät tukevat samoja toimintoja, metadatasuodatusta ja Cohere-arvioijien uudelleenjärjestelyä.

Kumpaankin taustajärjestelmään voidaan myös yhdistää *RAG: Custom Embeddings* -tunnistetiedoilla, jotka
korvaavat OpenAI:n millä tahansa OpenAI-yhteensopivalla upotuspäätepisteellä ja nimeävät oman vektorivarastonsa. Tällaisilla tunnistetiedoilla luotu varasto näkyy sen kohdetietokannan alla.
Katso [Mukautetut upotukset](../reference/integrations.md#custom-embeddings-rag).

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (haku), `$nodeLabel.point_id` (lisäys, päivitys), `$nodeLabel.deleted` (poisto) |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vektorivaraston taustajärjestelmä (oletus: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektorivarasto [Vektorivarastot](../tabs/vectorstores-tab.md) -välilehdeltä |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Toiminnon tyyppi (myös `operation`) |
| `documentContent` | lauseke | Tallennettava dokumenttiteksti (lisäys, päivitys) |
| `documentMetadata` | JSON-merkkijono | Tallennettavien dokumenttien metadata (lisäys, päivitys); arvot tukevat lausekkeita |
| `documentIdField` | merkkijono | Payload-kenttä, joka sisältää yksilöllisen tunnisteen (päivitys, poisto; oletus `doc_id`) |
| `documentId` | lauseke | Yksilöllisen tunnisteen arvo (päivitys, poisto) |
| `queryText` | lauseke | Hakukysely (vain haku) |
| `searchLimit` | numero | Enimmäistulosten määrä (oletus: 5) |
| `metadataFilters` | JSON-merkkijono | Metadatasuodattimet haulle (arvot tukevat lausekkeita) |
| `enableReranker` | boolean | Käytä Coherea hakutulosten uudelleenjärjestelyyn |
| `rerankerCredentialId` | UUID | Cohere-tunnistetiedot uudelleenjärjestelyä varten |
| `rerankerTopN` | numero | Uudelleenjärjestelyn jälkeen säilytettävien huipputulosten määrä |

## Toiminnot

### Lisäys

Lisää dokumentteja vektorivarastoon.

| Kenttä | Pakollinen | Kuvaus |
|-------|----------|-------------|
| `documentContent` | kyllä | Upotettava ja tallennettava teksti |
| `documentMetadata` | ei | JSON-objekti, esim. `{"source": "user", "category": "general"}` |

**Tuloste:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metadatalausekkeet

Metadata-arvot hyväksyvät lausekkeita, joten dokumentti voidaan tallentaa suorituskontekstista saatavilla tiedoilla:

```json
{ "url": "$start.url", "category": "faq" }
```

Lausekkeet ratkaistaan JSON:n jäsentämisen jälkeen, ei sijoittamalla tekstiä sen sisään, joten
arvo, joka sisältää lainausmerkin tai rivinvaihdon, ei voi rikkoa objektia. Arvo, joka on kokonainen
lauseke, säilyttää ratkaistun tyypinsä — `{"count": "$start.count"}` tallentaa numeron, ei
merkkijonoa `"7"` — mikä on tärkeää, koska haun `metadataFilters` vertaavat tarkkoja tyyppejä. Sekateksti kuten
`"page $start.count"` ratkaistaan merkkijonoksi, ja samat säännöt koskevat myös sisäkkäisiä objekteja ja taulukoita.

Sama koskee `upsert`-toimintoa ja haun `metadataFilters`-kenttää: se jäsennetään ensin ja sen
arvot ratkaistaan jälkeenpäin samoilla säännöillä. Joten suodatin, joka on kirjoitettu muodossa `{"count": "$start.count"}`,
vastaa lisäyksen tallentamaa lukua eikä merkkijonoa `"7"`.

### Kumpi workflow tallensi dokumentin

Dokumentti, joka tallennetaan ilman omaa `source`-kenttäänsä, merkitään tallentaneella workflowlla
muodossa `source: "workflow:<workflow name>"`. [Vektorivarastot](../tabs/vectorstores-tab.md) -välilehti
ryhmittelee nämä **Lisännyt workflow: _nimi_** -otsikon alle, joten varaston sisältö kertoo kunkin dokumentin
lähteen, ja yhden workflown dokumentit voidaan poistaa ryhmänä. Oman `source`-kentän asettaminen
`documentMetadata`-kentässä ohittaa aina automaattisen leiman.

### Päivitys

Lisää dokumentti tai korvaa samalla yksilöllisellä tunnisteella jo tallennetun dokumentin.

Tunniste on **payloadin sisällä oleva kenttä**, ei varaston sisäinen point-tunniste, joten dokumentti
säilyttää järjestelmän jo käyttämän tunnisteen — CRM-järjestelmän tunnisteen, tuotekoodin, sivun polun.
`documentIdField` määrittää kyseisen kentän ja `documentId` sen arvon.

| Kenttä | Pakollinen | Kuvaus |
|-------|----------|-------------|
| `documentId` | kyllä | Dokumentin yksilöllinen tunniste (tukee lausekkeita) |
| `documentContent` | kyllä | Upotettava ja tallennettava teksti |
| `documentIdField` | ei | Payload-kenttä, jossa tunniste sijaitsee (oletus `doc_id`) |
| `documentMetadata` | ei | JSON-objekti, esim. `{"source": "crm", "url": "$start.url"}` (arvot tukevat lausekkeita) |

Kaikki pisteet, joiden tunnistekenttä vastaa, poistetaan ensin, joten dokumentti, joka oli aiemmin
tallennettuna useana osana, korvataan kokonaisuutena eikä monisteta. Tunnistekenttä kirjoitetaan
payloadiin automaattisesti, ja point-tunniste pysyy vakiona saman dokumentin päivitysten välillä.

**Tuloste:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
onko olemassa olevaa versiota korvattu), `$nodeLabel.replaced_count`
### Poista

Poistaa dokumentin sen yksilöllisen tunnisteen perusteella.

| Kenttä | Pakollinen | Kuvaus |
|-------|----------|-------------|
| `documentId` | kyllä | Dokumentin yksilöllinen tunniste (tukee lausekkeita) |
| `documentIdField` | ei | Payload-kenttä, jossa tunniste sijaitsee (oletus `doc_id`) |

**Tuloste:** `$nodeLabel.deleted` – `true`, kun vähintään yksi kohde vastasi, `false`, kun tunnistetta ei löytynyt varastosta. `$nodeLabel.deleted_count` sisältää poistettujen kohteiden määrän.

Tuntemattoman tunnisteen poistaminen ei ole virhetilanne: solmu suoritetaan onnistuneesti arvolla `deleted: false`, joten siivoushaaraa ei tarvitse suojata erillisellä ehdolla.

### Haku

Semanttinen haku samankaltaisille dokumenteille.

| Kenttä | Pakollinen | Kuvaus |
|-------|----------|-------------|
| `queryText` | kyllä | Hakukysely |
| `searchLimit` | ei | Enimmäistulokset (oletus: 5) |
| `metadataFilters` | ei | Suodata metatietojen perusteella (täsmällinen JSON-objektin vastaavuus, arvot tukevat lausekkeita) |
| `enableReranker` | ei | Ota Cohere-arviointi käyttöön paremman relevanssin saamiseksi |
| `rerankerCredentialId` | arvioinnin yhteydessä | Cohere-tunnistetiedot |
| `rerankerTopN` | ei | Lopullinen tulosten määrä arvioinnin jälkeen |

**Tuloste:** `$nodeLabel.results` – taulukko, joka sisältää `{ id, text, score, metadata }`

Kun arviointi on käytössä:

- `$nodeLabel.reranked` muuttuu arvoon `true`
- Jokainen tulos sisältää myös `relevance_score`
- `score` säilyy alkuperäisenä vektorisamankaltaisuuspisteenä
- `relevance_score` on Cohere-arvioijan pisteet

## Tulosten käyttö

- `$ragNode.results.first().text` – paras hakutulos
- `$ragNode.results.first().score` – samankaltaisuuspiste (0–1)
- `$ragNode.results.first().metadata.source` – parhaan tuloksen metatiedot
- `$ragNode.results.map("item.text").join("\n\n")` – yhdistä LLM-kontekstia varten
- `$ragNode.reranked` – onko arviointia käytetty
- `$ragNode.count` – palautettujen tulosten määrä
- `$ragNode.replaced` – onko upsert korvannut olemassa olevan dokumentin
- `$ragNode.deleted` – onko poisto poistanut mitään

## Esimerkki – Haku

```json
{
  "type": "rag",
  "data": {
    "label": "searchDocs",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "metadataFilters": "{\"category\": \"faq\"}",
    "enableReranker": true,
    "rerankerCredentialId": "cohere-credential-uuid",
    "rerankerTopN": 5
  }
}
```

## Esimerkki – Lisäys

```json
{
  "type": "rag",
  "data": {
    "label": "insertDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "insert",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"user_input\"}"
  }
}
```

## Esimerkki – Päivitys

```json
{
  "type": "rag",
  "data": {
    "label": "syncDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "upsert",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"crm\"}"
  }
}
```

## Esimerkki – Poisto

```json
{
  "type": "rag",
  "data": {
    "label": "removeDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "delete",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id"
  }
}
```

## Aiheeseen liittyvät

- [Miksi Heym](../getting-started/why-heym.md) – Sisäänrakennettu RAG osana agenttiajoaikaa
- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Vektorivarastot-välilehti](../tabs/vectorstores-tab.md) – Vektorivarastojen luominen ja hallinta
- [Kolmannen osapuolen integraatiot](../reference/integrations.md#qdrant) – Qdrant- ja Postgres (pgvector) -tunnistetietojen määrittäminen
- [Agenttisolmu](./agent-node.md) – Käytä RAG-tuloksia agentin kontekstina
- [LLM-solmu](./llm-node.md) – Syötä RAG-tulokset LLM-järjestelmäkäskynä
