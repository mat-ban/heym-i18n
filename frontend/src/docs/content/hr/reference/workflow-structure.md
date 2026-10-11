# Struktura Workflows-a

Workflows se pohranjuju kao JSON s čvorovima i rubovima. Pogledajte [Tipovi čvorova](./node-types.md) za dostupne tipove čvorova i [Expression DSL](./expression-dsl.md) za sintaksu izraza u `data` poljima.

## Objekt Workflow

```json
{
  "id": "uuid",
  "name": "Moj Workflow",
  "description": "Opcionalni opis",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Objekt Čvor

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

### Čvor agenta `data` (perzistentna memorija)

[Agent](../nodes/agent-node.md) čvorovi podržavaju opcionalnu graf znanja po čvoru platna:

| Polje | Tip | Opis |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Kada je `true`, učitajte pohranjeni graf u sustavni prompt i spojite nove činjenice nakon uspješnih izvršavanja |
| `memoryShares` | array (opcionalno) | Omogućuje drugim agentima pristup memorijskom grafu ovog čvora (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Pogledajte [Perzistentna memorija agenta](./agent-persistent-memory.md). |

Primjer:

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

Pogledajte [Perzistentna memorija agenta](./agent-persistent-memory.md) za API putanje, ponašanje uređivača i semantiku ekstrakcije.

## Objekt Rub

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Tipovi Čvorova

Uobičajene vrijednosti `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) i drugi. Potpuni popis: [Tipovi čvorova](./node-types.md). Čvorovi na istoj razini izvršavanja rade u [paraleli](./parallel-execution.md).

## Izgled Uređivača

Svaki čvor ima `position.x` i `position.y` za raspored na platnu na radnoj površini. Na ekranima ispod 768px prekidača, uređivač zamjenjuje slobodni Vue Flow platno s punim ekranom, uvučenim stablom workflows-a. Stablo prati povezane putanje izvršavanja, označava paralelne grane i koristi iste oznake čvorova, ikone i status posljednjeg izvršavanja kao uređivač na radnoj površini.

Dodirnite čvor da biste ga odabrali. Ako ima zabilježeni rezultat izvršavanja, otvara se njegov detalj u punom ekranu s karticama za ulaz, izlaz i greške. Donja navigacija na mobilnom uređaju pruža **Čvorovi**, **Svojstva**, **Izvrši** i **Više**; zaglavlje zadržava akcije za spremanje, povijest, pretraživanje, postavke i dijeljenje. Radna površina nastavlja koristiti slobodno Vue Flow platno i bočne panele.

Koristite **Dodaj čvor** u mobilnoj kartici Čvorovi za pretraživanje biblioteke čvorova. Obični čvor odmah otvara listu veza nakon što je dodan: odaberite čvor sidra i postavite ga **Iza**, **Ispred** ili kao **Paralelnu** granu. U načinu uređivanja, dodirnite postojeći obični čvor da biste otvorili istu listu s njegovom trenutnom vezom odabranom. Trigger čvorovi ostaju neovisni jer ne prihvaćaju običan ulaz. Kontrola uređivanja također otkriva akciju uklanjanja za odabrani čvor. Detalji izvršavanja uključuju prethodne i sljedeće strelice kada su dostupni rezultati susjednih čvorova. AI Asistent otvara se iznad mobilnog stabla kao donji list, bez promjene aktivne kartice uređivača.

## Povezano

- [Tipovi čvorova](./node-types.md) – Svi tipovi čvorova i opisi
- [Značajke platna](./canvas-features.md) – Značajke uređivača (pin podataka, dnevnici izvršavanja, omogućavanje/onesposobljavanje, ekstrakcija u pod-workflow)
- [Preuzimanje i uvoz](./download-import.md) – Izvoz i uvoz workflows-a kao JSON
- [Čvor agenta](../nodes/agent-node.md) – Struktura `data` čvora agenta
- [Perzistentna memorija agenta](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` i API memorijskog grafa
- [Expression DSL](./expression-dsl.md) – Sintaksa za `userMessage`, `condition`, `$vars`, `$global`, itd.
- [Paralelno izvršavanje](./parallel-execution.md) – Kako čvorovi rade u paraleli
- [Triggeri](./triggers.md) – Početni čvorovi i ulazne točke
- [Kartica Workflows](../tabs/workflows-tab.md) – Kreirajte i upravljajte workflows-ima
