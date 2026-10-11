# LLM

**LLM**-solmu käsittelee tekstiä kielimallilla tai generoi kuvia. Se tukee tekstin generointia, näkökykyä (kuvasyöte), kuvien generointia, rakennettua JSON-tulostetta ja palveluntarjoajan omaa **Batch API** -suoritusta tuetuille tekstimalleille.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1, plus valinnainen `batchStatus`, kun eräsuoritus on käytössä |
| Tuloste | `$nodeLabel.text` (teksti), `$nodeLabel.image` (kuva) tai erätuloksen kentät kuten `$nodeLabel.results` |

## Parametrit

### Tunnistetiedot & Malli

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | LLM-tunnistetiedot kohdasta [Tunnistetiedot](../tabs/credentials-tab.md) |
| `model` | merkkijono | Mallin nimi (esim. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` kuville) |
| `fallbackCredentialId` | UUID (valinnainen) | Varatunnistetiedot, kun ensisijainen epäonnistuu |
| `fallbackModel` | merkkijono (valinnainen) | Varamalli, kun ensisijainen epäonnistuu |

Jos ensisijainen tunnistetiedot tai malli palauttaa virheen, solmu yrittää automaattisesti varatunnistetiedoilla ja -mallilla ennen kuin epäonnistuu.

Heym tarkistaa myös **eräsuorituskyvyn** valituista tunnistetiedoista ja mallista. Eräsuoritus on käytettävissä:

- OpenAI-tunnistetiedoilla
- Mukautetuilla / OpenAI-yhteensopivilla tunnistetiedoilla, joiden endpoint tarjoaa vaaditut `/v1/files` ja `/v1/batches` API:t

Jos valittu palveluntarjoaja tai malli ei tue eräsuoritusta, Ominaisuudet-paneeli näyttää sen suoraan ja poistaa vaihtoehdon käytöstä.

### Promptit (tekstitila)

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `systemInstruction` | merkkijono | Järjestelmäprompti. Tukee [lausekkeita](../reference/expression-dsl.md). |
| `userMessage` | merkkijono | Käyttäjäviesti. Oletus: `$input.text` |
| `temperature` | numero | 0.0–2.0 (oletus: 0.7) |
| `maxTokens` | numero | Maksimivastauksen tokenit (valinnainen) |
| `requestTimeoutSeconds` | numero | Maksimisekunnit odottaa mallin vastausta ennen aikakatkaisua (oletus: 60). Kasvata sitä hitailla tai itse isännöidyillä palveluntarjoajilla (LiteLLM, vLLM, paikalliset mallit). |

### Kuva & Tuloste

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Tekstin tai kuvan generointi |
| `imageInputEnabled` | boolean | Sisällytä kuva käyttäjäviestiin (näkökyky) |
| `imageInput` | lauseke | Base64 data URL tai kuvan URL |
| `jsonOutputEnabled` | boolean | Rakennettu JSON-tuloste |
| `jsonOutputSchema` | merkkijono | JSON-skeema rakennetulle tulosteelle |
| `extraBodyEnabled` | boolean | Lähetä palveluntarjoajakohtaisia pyynnön parametreja (oletus: `false`) |
| `extraBody` | merkkijono | JSON-objekti, joka yhdistetään API-pyynnön runkoon |

### Päättelymallit (o1, o3)

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Ota käyttöön päättelymalleille |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Päättelysyvyys |

### Eräsuoritus

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Käytä palveluntarjoajan omaa Batch API:a yksittäisen pyynnön sijaan |

Eräsuoritus on käytettävissä vain **LLM**-solmussa. Se ei koske [Agenttisolmuun](./agent-node.md).

Kun eräsuoritus on käytössä:

- `outputType` on oltava `text`
- `imageInputEnabled` on oltava `false`
- `userMessage` on oltava **taulukko**
- jokaisen taulukon alkion on oltava merkkijono tai primitiiviarvo

Tyypillisiä esimerkkejä:

- `$input.items.map("item.text")`
- `$vars.promptList`

Jos lauseke palauttaa yksittäisen merkkijonon taulukon sijaan, suoritus epäonnistuu validointivirheellä ennen kuin palveluntarjoajan kutsu alkaa.

## Erätilan Haara

Kun eräsuoritus on käytössä, LLM-solmu paljastaa toisen tulostekahvan: `batchStatus`.

Käytä tätä haaraa ilmoituksiin, lokitukseen, Slack-viesteihin tai sivuvaikutuksiin, kun erä on vielä käynnissä. Haara laukeaa aina, kun palveluntarjoajan tila muuttuu merkittävästi, mukaan lukien normalisoidut tilat kuten:

- `pending`
- `processing`
- `completed`
- `failed`

Tilan haarapayload on saatavilla muodossa `$input` alaspäin suuntautuvissa solmuissa ja sisältää:

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

Esimerkkihaara:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Esimerkki tilan yhdistämisestä:

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## Erätuloksen Muoto

Onnistuneen suorituksen yhteydessä pääasiallinen LLM-tuloste sisältää:

- `$nodeLabel.text` – yhdistetyt onnistuneet tekstit
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – kohtaiset tulokset alkuperäisessä järjestyksessä
- `$nodeLabel.usage`

Jokainen kohde `$nodeLabel.results` -taulukossa sisältää kenttiä kuten:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Kun **JSON-tuloste** on käytössä yhdessä eräsuorituksen kanssa, Heym jäsentää jokaisen onnistuneen kohteen erikseen. Jäsennetyt objektit ovat saatavilla kohtaisesti ja kerätään `parsedResults` -kenttään.
## Responses API

**Käytä Responses API:a** -valintaruutu ohjaa solmun kutsun [Responses API](https://platform.openai.com/docs/api-reference/responses):n kautta Chat Completionsin sijaan. Oletusarvoisesti valinta on pois päältä, ja solmu toimii samalla tavalla molemmilla tavoilla: samat promputit, sama JSON-tulostusskeema ja sama tulosten muoto.

Toiminto käyttää OpenAI-tunnistetietoja sekä mukautettuja tunnistetietoja, joiden yhdyskäytävä tukee päätepistettä, joten myös itse isännöity tai välityspalvelimen kautta toimiva asennus voi käyttää sitä. Google-tunnistetiedoilla toiminto pysyy pois käytöstä, eikä sitä voi yhdistää [Erätilaan](#batch-status-branch) - solmun paneeli ilmoittaa, miten tietty tunnistetieto toimii ennen kuin suoritat mitään.

Jos päätepiste ei ole käytettävissä suoritusaikana, solmu epäonnistuu viestillä, joka nimeää syyn, sen sijaan että palaisi hiljaa takaisin, joten Responses API:lle määritetty solmu toimii aina sen kautta. Palatakseen tarkoituksella toiseen tunnistetietoon tai malliin, käytä **Varaustunnistetieto**- ja **Varausmalli**-kenttiä; ne perivät tämän valintaruudun, joten varauskredentiaalisen on myös tuettava päätepistettä.

## Kuvan generointi

- **Mallit:** `nanobanana`, `gemini-2.0-flash-exp`
- **Tuloste:** `$nodeLabel.image` (base64 data-URL)
- Kun käytät [Syötesolmua](./input-node.md) promptin antamiseen, käytä `$userPrompt.body.text` -arvoa `userMessage`-kentässä

## JSON-tuloste

Kun `jsonOutputEnabled` on tosi, LLM palauttaa skeeman mukaisen JSON-datan. Kenttiin pääsee käsiksi muodossa `$nodeLabel.fieldName`.

## Lisäbody

Jotkin palveluntarjoajat hyväksyvät pyyntöparametreja, joita standardi OpenAI-yhteensopivat kentät eivät kata, kuten mallin ajattelutilan poistaminen käytöstä. Valitse solmun ominaisuuksista **Lähetä lisäpyynnön body** ja syötä JSON-objekti. Se yhdistetään jokaiseen tämän solmun tekemään API-pyyntöön.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Oletusarvoisesti pois päältä.** Kun valintaruutu on pois päältä, mitään ylimääräistä ei lähetetä.
- On oltava JSON-**objekti**. Taulukko, skalaari tai virheellinen teksti aiheuttaa solmun epäonnistumisen virheellä `Invalid extra body JSON` sen sijaan, että se hylättäisiin hiljaa.
- **Muotoile**-painike valintaruudun vieressä muotoilee JSONin uudelleen ja muuttuu punaiseksi tekstillä `Invalid`, kun teksti ei jäsennä.
- Käytetään pääasiallisessa suorituksessa, varausmallin yrityksessä ja erätilassa tehtyihin pyyntöihin. **Ei** käytetä kuvien generointiin tai suojauksen tarkistuksiin, jotka käyttävät erilaista pyynnön muotoa ja erillistä mallia.
- `$`-lausekkeet ratkaistaan ennen jäsennystä, joten `{"max_tokens": $prev.limit}` toimii. Koska tämä on tekstuaalista korvaamista, ratkaistu arvo, joka sisältää lainausmerkin tai rivinvaihdon, tuottaa virheellisen JSONin ja aiheuttaa solmun epäonnistumisen.

## Esimerkki – Teksti

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Esimerkki – Eräteksti

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Esimerkki – Kuvan generointi

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Suojaukset

Ota **Suojaukset** käyttöön solmun ominaisuuksista estääksesi turvattomat käyttäjäviestit ennen LLM-kutsua. Katso [Suojaukset](../reference/guardrails.md) täydelliseen viitteeseen.

## Liittyvät aiheet

- [Agenttisolmu](./agent-node.md) – LLM työkutsun kanssa
- [Miksi Heym](../getting-started/why-heym.md) – Missä LLM-vaiheet sopivat agentin elinkaareen
- [Suojaukset](../reference/guardrails.md) – Estä turvattomat sisältöluokat
- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Expression DSL](../reference/expression-dsl.md) – Viittaaminen dataan promputissa
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Laajennettava editori reaaliaikaisella backend-esikatselulla promputille
- [Tunnistetieto-välilehti](../tabs/credentials-tab.md) – Lisää LLM API-avaimia
- [Pika-aloitus](../getting-started/quick-start.md) – Perus LLM-workflow
