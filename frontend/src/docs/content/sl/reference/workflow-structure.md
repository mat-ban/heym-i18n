# Struktura Workflowa

Workflows so shranjeni v formatu JSON z vozlišči in robovi. Oglejte si [Vrste vozlišč](./node-types.md) za razpoložljive vrste vozlišč in [Izrazni DSL](./expression-dsl.md) za sintakso izrazov v poljih `data`.

## Objekt Workflow

```json
{
  "id": "uuid",
  "name": "Moj Workflow",
  "description": "Neobvezni opis",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Objekt Vozlišče

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

### Podatki vozlišča agenta (trajna pomnilnika)

[Vozlišča agenta](../nodes/agent-node.md) podpirajo neobvezno znanje graf za vsako vozlišče platna:

| Polje | Tip | Opis |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Ko je `true`, naloži shranjeni graf v sistemski poziv in združi nove dejstva po uspešnih izvedbah |
| `memoryShares` | array (neobvezno) | Daje drugim agentom dostop do pomnilniškega grafa tega vozlišča (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Oglejte si [Trajna pomnilnika agenta](./agent-persistent-memory.md). |

Primer:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "asistent",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Oglejte si [Trajna pomnilnika agenta](./agent-persistent-memory.md) za poti API, obnašanje urejevalnika in semantiko ekstrakcije.

## Objekt Rob

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Vrste vozlišč

Pogoste vrednosti `type`: [Vhod](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Pogoji](../nodes/condition-node.md), [Preklop](../nodes/switch-node.md), [Izhod](../nodes/output-node.md), [JSON izhodni mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Čakanje](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Pošlji](../nodes/websocket-send-node.md) (`websocketSend`), [Združitev](../nodes/merge-node.md), [Nastavi](../nodes/set-node.md), [Spremenljivka](../nodes/variable-node.md), [Zanka](../nodes/loop-node.md) in še več. Celoten seznam: [Vrste vozlišč](./node-types.md). Vozlišča na isti ravni izvajanja se izvajajo [paralelno](./parallel-execution.md).

## Postavitev urejevalnika

Vsako vozlišče ima `position.x` in `position.y` za postavitev na namizju platna. Na zaslonih pod 768px prelomom urejevalnik nadomesti prosto oblikovano platno Vue Flow s celotnim zaslonom, zamaknjenim drevesom workflowa. Drevo sledi povezanih izvršilnim potekom, označuje paralelne veje in uporablja iste oznake vozlišč, ikone in najnovejši status izvajanja kot namizni urejevalnik.

Tapnite vozlišče, da ga izberete. Če ima zabeležen rezultat izvajanja, se odpre njegov podroben pogled s zavihki za vhod, izhod in napake. Mobilna spodnja navigacija ponuja **Vozlišča**, **Lastnosti**, **Izvedi** in **Več**; glava ohranja dejanja za shranjevanje, zgodovino, iskanje, nastavitve in deljenje. Namizje še naprej uporablja prosto oblikovano platno Vue Flow in stranske panele.

Uporabite **Dodaj vozlišče** v mobilnem zavihku Vozlišča za iskanje knjižnice vozlišč. Redno vozlišče odpre povezovalni list takoj po dodajanju: izberite sidrno vozlišče in ga postavite **Za**, **Pred** ali kot **Paralelno** vejo. V načinu urejanja tapnite obstoječe redno vozlišče, da odprete isti list s trenutno izbrano povezavo. Trigger vozlišča ostanejo neodvisna, ker ne sprejemajo rednega vhoda. Urejevalna kontrola prav tako razkriva dejanje odstranitve za izbrano vozlišče. Podrobnosti izvajanja vključujejo prejšnje in naslednje puščice, ko so rezultati sosednjih vozlišč na voljo. AI Asistent se odpre nad mobilnim drevesom kot spodnji list, ne da bi spremenil aktivni zavihek urejevalnika.

## Sorodno

- [Vrste vozlišč](./node-types.md) – Vse vrste vozlišč in opisi
- [Značilnosti platna](./canvas-features.md) – Značilnosti urejevalnika (prikaz podatkov, dnevniki izvajanja, omogoči/izključi, ekstrakcija v pod-workflow)
- [Prenos in uvoz](./download-import.md) – Izvoz in uvoz workflowov kot JSON
- [Vozlišče agenta](../nodes/agent-node.md) – Struktura `data` vozlišča agenta
- [Trajna pomnilnika agenta](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` in API pomnilniškega grafa
- [Izrazni DSL](./expression-dsl.md) – Sintaksa za `userMessage`, `condition`, `$vars`, `$global` itd.
- [Paralelno izvajanje](./parallel-execution.md) – Kako se vozlišča izvajajo paralelno
- [Triggerji](./triggers.md) – Začetni vozlišča in vstopne točke
- [Zavihek Workflows](../tabs/workflows-tab.md) – Ustvarjanje in upravljanje workflowov
