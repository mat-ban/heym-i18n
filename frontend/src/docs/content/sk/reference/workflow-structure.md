# Štruktúra workflowu

Workflowy sú uložené ako JSON s uzlami a hranami. Dostupné typy uzlov nájdete v časti [Typy uzlov](./node-types.md) a syntax výrazov v poliach `data` v časti [Expression DSL](./expression-dsl.md).

## Objekt workflowu

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

## Objekt uzla

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

### `data` uzla Agent (perzistentná pamäť)

Uzly [Agent](../nodes/agent-node.md) podporujú voliteľný znalostný graf pre každý uzol na plátne:

| Pole | Typ | Popis |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Ak je `true`, uložený graf sa načíta do systémového promptu a po úspešných spusteniach sa zlúčia nové fakty |
| `memoryShares` | array (voliteľné) | Udeľuje iným agentom prístup k pamäťovému grafu tohto uzla (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Pozrite si [Perzistentná pamäť agenta](./agent-persistent-memory.md). |

Príklad:

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

Cesty API, správanie editora a sémantiku extrakcie nájdete v časti [Perzistentná pamäť agenta](./agent-persistent-memory.md).

## Objekt hrany

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Typy uzlov

Bežné hodnoty `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) a ďalšie. Úplný zoznam: [Typy uzlov](./node-types.md). Uzly na rovnakej úrovni spustenia bežia [paralelne](./parallel-execution.md).

## Rozloženie editora

Každý uzol má `position.x` a `position.y` pre rozloženie na plátne v desktopovom zobrazení. Na obrazovkách pod
breakpointom 768px editor nahrádza voľné plátno Vue Flow full-screen stromom
workflowu s odsadením. Strom sleduje prepojené cesty spustenia, označuje paralelné vetvy a používa
rovnaké označenia uzlov, ikony a stav posledného spustenia ako desktopový editor.

Klepnutím na uzol ho vyberiete. Ak má zaznamenaný výsledok spustenia, otvorí sa jeho full-screen detail
so záložkami vstup, výstup a chyba. Mobilná spodná navigácia poskytuje **Uzly**, **Vlastnosti**,
**Spustiť** a **Viac**; hlavička si zachováva akcie uloženia, histórie, vyhľadávania, nastavení a zdieľania.
Desktop naďalej používa voľné plátno Vue Flow a bočné panely.

Pomocou **Pridať uzol** na mobilnej karte Uzly môžete vyhľadávať v knižnici uzlov. Bežný uzol otvorí
okno prepojenia hneď po pridaní: vyberte kotvový uzol a umiestnite ho **After**,
**Before** alebo ako **Parallel** vetvu. V režime úprav klepnutím na existujúci bežný uzol otvoríte rovnaké
okno s jeho aktuálne zvoleným prepojením. Trigger uzly zostávajú nezávislé, pretože neprijímajú
bežný vstup. Ovládací prvok úprav tiež ponúka akciu odstránenia pre vybraný uzol. Detaily spustenia
obsahujú šípky predchádzajúci a nasledujúci, ak sú dostupné výsledky susedných
uzlov. AI Assistant sa otvára nad mobilným stromom ako spodné okno bez
zmeny aktívnej karty editora.

## Súvisiace

- [Typy uzlov](./node-types.md) – Všetky typy uzlov a popisy
- [Funkcie plátna](./canvas-features.md) – Funkcie editora (data pin, logy spustenia, zapnutie/vypnutie, extrakcia do pod-workflowu)
- [Stiahnutie a import](./download-import.md) – Export a import workflowov ako JSON
- [Uzol Agent](../nodes/agent-node.md) – Štruktúra `data` uzla Agent
- [Perzistentná pamäť agenta](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` a API pamäťového grafu
- [Expression DSL](./expression-dsl.md) – Syntax pre `userMessage`, `condition`, `$vars`, `$global` atď.
- [Paralelné spustenie](./parallel-execution.md) – Ako uzly bežia paralelne
- [Triggers](./triggers.md) – Počiatočné uzly a vstupné body
- [Karta Workflows](../tabs/workflows-tab.md) – Vytváranie a správa workflowov
