# Workflow-rakenteet

Workflowt tallennetaan JSON-muodossa solmujen ja yhteyksien muodossa. Katso [Solmutyypit](./node-types.md) saatavilla olevista solmutyypeistä ja [Expression DSL](./expression-dsl.md) lausekesyntaksista `data`-kentissä.

## Workflow-objekti

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Solmu-objekti

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Agent-solmun `data` (pysyvä muisti)

[Agent](../nodes/agent-node.md)-solmut tukevat valinnaista tietokantaa canvas-solmua kohti:

| Kenttä | Tyyppi | Kuvaus |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Kun `true`, lataa tallennettu tietokanta järjestelmän kehotteeseen ja yhdistää uudet tiedot onnistuneiden suoritusten jälkeen |
| `memoryShares` | taulukko (valinnainen) | Antaa muille agenteille pääsyn tämän solmun tietokantaan (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Katso [Agentin pysyvä muisti](./agent-persistent-memory.md). |

Esimerkki:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Katso [Agentin pysyvä muisti](./agent-persistent-memory.md) API-reiteistä, editorin käyttäytymisestä ja tiedonkeruun semantiikasta.

## Yhteys-objekti

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Solmutyypit

Yleisiä `type`-arvoja: [Syöte](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Ehto](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Tuloste](../nodes/output-node.md), [JSON-tulostemuunnin](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Odota](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Lähetä](../nodes/websocket-send-node.md) (`websocketSend`), [Yhdistä](../nodes/merge-node.md), [Aseta](../nodes/set-node.md), [Muuttuja](../nodes/variable-node.md), [Silmukka](../nodes/loop-node.md) ja muut. Täydellinen lista: [Solmutyypit](./node-types.md). Samalla suoritustasolla olevat solmut suoritetaan [rinnakkain](./parallel-execution.md).

## Editorin asettelu

Jokaisella solmulla on `position.x` ja `position.y` työpöytäcanvasin asettelua varten. Alle 768px näytöillä editori korvaa vapaamuotoisen Vue Flow -canvasin koko näytön sisennetyllä workflow-puulla. Puu seuraa yhteydessä olevia suorituspolkuja, merkitsee rinnakkaiset haarat ja käyttää samoja solmumerkintöjä, kuvakkeita ja viimeisimmän suorituksen tilaa kuin työpöytäeditori.

Kosketa solmua valitaksesi sen. Jos sillä on tallennettu suoritustulos, sen koko näytön yksityiskohtanäkymä avautuu syöte-, tuloste- ja virhe-välilehtien kanssa. Mobiilin alanavigaatio tarjoaa **Solmut**, **Ominaisuudet**, **Suorita** ja **Lisää**; otsikkopalkissa säilyvät tallennus, historia, haku, asetukset ja jakaminen. Työpöytäversio jatkaa vapaamuotoisen Vue Flow -canvasin ja sivupaneelien käyttöä.

Käytä **Lisää solmu** -toimintoa mobiilin Solmut-välilehdessä solmukirjaston hakemiseen. Tavallinen solmu avaa yhteyden muokkausikkunan heti lisäyksen jälkeen: valitse kohdesolmu ja sijoita se **Jälkeen**, **Ennen** tai **Rinnakkaisena** haarana. Muokkaustilassa kosketa olemassa olevaa tavallista solmua avataksesi saman ikkunan sen nykyisellä yhteydellä valittuna. Trigger-solmut pysyvät itsenäisinä, koska ne eivät hyväksy tavallista syötettä. Muokkausohjain tarjoaa myös valitun solmun poistotoiminnon. Suoritusyksityiskohdissa on edellisen ja seuraavan nuolet, kun viereisten solmujen tuloksia on saatavilla. Tekoälyavustaja avautuu mobiilipuun yläpuolelle alareunan ikkunana muuttamatta aktiivista editorin välilehteä.

## Aiheeseen liittyvät

- [Solmutyypit](./node-types.md) – Kaikki solmutyypit ja niiden kuvaukset
- [Canvas-ominaisuudet](./canvas-features.md) – Editorin ominaisuudet (datapinni, suorituslokit, käyttöönotto/poisto, erottelu ala-workflowksi)
- [Lataa & tuo](./download-import.md) – Vie ja tuo workflowt JSON-muodossa
- [Agent-solmu](../nodes/agent-node.md) – Agent-solmun `data`-rakenne
- [Agentin pysyvä muisti](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` ja muistikaavion API
- [Expression DSL](./expression-dsl.md) – Syntaksi `userMessage`, `condition`, `$vars`, `$global` jne. kentille
- [Rinnakkaissuoritus](./parallel-execution.md) – Kuinka solmut suoritetaan rinnakkain
- [Triggerit](./triggers.md) – Alkusolmut ja sisäänpääsypisteet
- [Workflowt-välilehti](../tabs/workflows-tab.md) – Workflowjen luominen ja hallinta
