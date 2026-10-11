# Workflow struktūra

Darbo eigos saugomos kaip JSON su mazgais ir briaunomis. Daugiau informacijos apie [Mazgų tipus](./node-types.md) ir [Išraiškų DSL](./expression-dsl.md) sintaksę `data` laukuose.

## Darbo eigos objektas

```json
{
  "id": "uuid",
  "name": "Mano Darbo Eiga",
  "description": "Pasirinktinė aprašymas",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Mazgo objektas

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

### Agentų mazgo `data` (nuolatinė atmintis)

[Agent](../nodes/agent-node.md) mazgai palaiko pasirinktinius žinių grafus kiekvienam drobės mazgui:

| Laukas | Tipas | Aprašymas |
|--------|-------|-----------|
| `persistentMemoryEnabled` | boolean | Kai `true`, įkelia saugomą grafiką į sistemos užklausą ir sujungia naujus faktus po sėkmingų vykdymų |
| `memoryShares` | masyvas (pasirinktinai) | Suteikia kitiems agentams prieigą prie šio mazgo atminties grafiko (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Daugiau informacijos žr. [Agentų nuolatinė atmintis](./agent-persistent-memory.md). |

Pavyzdys:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "asistentas",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Daugiau informacijos apie [Agentų nuolatinę atmintį](./agent-persistent-memory.md) rasite API keliais, redaktoriaus elgesiu ir ištraukimo semantika.

## Briaunos objektas

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Mazgų tipai

Dažniausi `type` reikšmės: [Įvestis](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agentas](../nodes/agent-node.md), [Sąlyga](../nodes/condition-node.md), [Perjungimas](../nodes/switch-node.md), [Išvestis](../nodes/output-node.md), [JSON išvesties žemėlapis](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Laukti](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Siųsti](../nodes/websocket-send-node.md) (`websocketSend`), [Sujungti](../nodes/merge-node.md), [Nustatyti](../nodes/set-node.md), [Kintamasis](../nodes/variable-node.md), [Ciklas](../nodes/loop-node.md) ir kt. Pilnas sąrašas: [Mazgų tipai](./node-types.md). Mazgai toje pačioje vykdymo lygyje vykdomi [paraleliai](./parallel-execution.md).

## Redaktoriaus išdėstymas

Kiekvienas mazgas turi `position.x` ir `position.y` desktopo drobės išdėstymui. Ekranuose, kurių plotis mažesnis nei 768px, redaktorius pakeičia laisvos formos Vue Flow drobę į viso ekrano, įdėtą darbo eigos medį. Medis seka sujungtas vykdymo takus, žymi paralelinius šakas ir naudoja tuos pačius mazgų etiketes, ikonėles ir naujausio vykdymo būseną kaip desktopo redaktorius.

Paspauskite ant mazgo, kad jį pasirinkti. Jei jis turi užfiksuotą vykdymo rezultatą, jo viso ekrano detalės atsidaro su įvesties, išvesties ir klaidų skirtukais. Mobilus apatinis navigacijos meniu siūlo **Mazgai**, **Ypatybės**, **Vykdyti** ir **Daugiau**; antraštė išlaiko išsaugojimo, istorijos, paieškos, nustatymų ir dalijimosi veiksmus. Desktopas ir toliau naudoja laisvos formos Vue Flow drobę ir šoninius panelius.

Naudokite **Pridėti mazgą** mobiliajame Mazgų skirtuke, kad ieškotumėte mazgų bibliotekos. Įprastas mazgas atidaro ryšio lapą iš karto po to, kai jis pridėtas: pasirinkite ankerinį mazgą ir įdėkite jį **Po**, **Prieš** arba kaip **Paralelinę** šaką. Redagavimo režime paspauskite ant esamo įprasto mazgo, kad atidarytumėte tą patį lapą su jo dabartiniu ryšiu pasirinktu. Trigger mazgai lieka nepriklausomi, nes jie nepriima įprastos įvesties. Redagavimo valdiklis taip pat atskleidžia pašalinimo veiksmą pasirinktam mazgui. Vykdymo detalės apima ankstesnius ir kitus rodykles, kai gretimų mazgų rezultatai yra prieinami. AI Asistentas atsidaro virš mobiliojo medžio kaip apatinis lapas, nekeisdamas aktyvaus redaktoriaus skirtuko.

## Susiję

- [Mazgų tipai](./node-types.md) – Visi mazgų tipai ir aprašymai
- [Drobės funkcijos](./canvas-features.md) – Redaktoriaus funkcijos (duomenų segtuvai, vykdymo žurnalai, įgalinti/išjungti, ištraukti į sub-darbą)
- [Atsisiųsti ir importuoti](./download-import.md) – Eksportuoti ir importuoti darbo eigas kaip JSON
- [Agentų mazgas](../nodes/agent-node.md) – Agentų mazgo `data` struktūra
- [Agentų nuolatinė atmintis](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` ir atminties grafiko API
- [Išraiškų DSL](./expression-dsl.md) – Sintaksė `userMessage`, `condition`, `$vars`, `$global` ir kt.
- [Paralelinis vykdymas](./parallel-execution.md) – Kaip mazgai vykdomi paraleliai
- [Trigger](./triggers.md) – Pradėti mazgus ir įėjimo taškus
- [Darbo eigos skirtukas](../tabs/workflows-tab.md) – Kurti ir valdyti darbo eigas
