# Suorita

**Suorita**-solmu kutsuu toista workflowta (aliworkflow) ja välittää sille syötteen. Käytä sitä uudelleenkäytettävään logiikkaan, ei datan muuntamiseen – käytä tähän tarkoitukseen [Aseta](./set-node.md)-solmua.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `executeWorkflowId` | UUID | Suoritettavan workflown ID |
| `executeInput` | lauseke | Yksi syöte (workflowille, jolla on yksi syötekenttä) |
| `executeInputMappings` | taulukko | `{ key, value }` useille syötteille. `key` = kohdeworkflown syötekentän nimi. |
| `executeDoNotWait` | totuusarvo | Kun `true`, lähettää aliworkflown taustalle odottamatta. Tuloste: `{ "status": "dispatched", "workflow_id": "..." }`. Oletus: `false`. |

## Vastauksen muoto

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## Älä odota

Kun `executeDoNotWait: true`, solmu lähettää aliworkflown taustasäikeeseen ja palauttaa välittömästi:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Ylemmän workflowtason suoritus jatkuu seuraavaan solmuun odottamatta. Aliworkflown suoritusmerkintä kirjoitetaan jälkikäteen historiaan sen valmistuttua. Käytä tätä, kun aliworkflown tulosta ei tarvita myöhemmissä vaiheissa.

## Yksi syöte

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Useita syötteitä

Kun kohdeworkflowssa on useita syötekenttiä, käytä `executeInputMappings`-parametria:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

`key`-arvon on vastattava kohdeworkflown [Syöte](./input-node.md)-solmun `inputFields`-kenttien nimiä.

## Liittyvät

- [Canvas-ominaisuudet](../reference/canvas-features.md) – "Extract to Sub-Workflow" luo Suorita-solmut valituista solmuista
- [Solmutyypit](../reference/node-types.md) – Kaikkien solmutyyppien yleiskatsaus
- [Syötesolmu](./input-node.md) – Kohdeworkflown syötekentät
- [Aseta-solmu](./set-node.md) – Datan muuntaminen (ei workflowkutsuja)
