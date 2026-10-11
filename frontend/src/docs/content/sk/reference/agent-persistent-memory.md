# Trvalá pamäť agenta

Uzly agenta môžu uchovávať **znalostný graf pre každý uzol** uložený v databáze: entity (s typmi a vlastnosťami) a vzťahy medzi nimi. Ak je táto funkcia povolená, Heym **vkladá súhrn tohto grafu do systémového promptu** pri každom spustení (ak graf nie je prázdny). Po úspešnom spustení **úloha na extrakciu pomocou LLM** na pozadí zlúči nové fakty z konverzácie do grafu.

Sub-agenti a orchestrátory štandardne používajú graf naviazaný na **svoj vlastný uzol na plátne**. Môžete tiež **udeliť iným agentom prístup na čítanie alebo na čítanie a zápis** k grafu tohto uzla (vrátane agentov v **iných workflowoch**, ktoré vlastníte) – pozrite si časť [Zdieľanie s inými agentmi](#zdieľanie-s-inými-agentmi).

## Povolenie

| Parameter | Typ | Popis |
|-----------|-----|-------|
| `persistentMemoryEnabled` | boolean | Ak je `true`, načíta graf tohto uzla do systémového promptu a naplánuje extrakciu po spustení pre graf tohto uzla |
| `memoryShares` | pole (voliteľné) | Udeľuje iným uzlom agenta prístup k pamäťovému grafu **tohto** uzla; pozrite si časť [Zdieľanie](#zdieľanie-s-inými-agentmi) |

Zapnite ho vo vlastnostiach uzla agenta (**Persistent memory (graph)**). Ružová ikona **mozgu** na uzle otvára editor grafu, keď je pamäť povolená (alebo keď je zobrazený model).

## Editor grafu

Dialógové okno vykresľuje entity ako animovaný graf s rozložením riadeným silami – farebné kruhy s veľkosťou podľa počtu prepojení a zoskupené podľa typu entity – plus úpravy a navigáciu (prispôsobenie zobrazenia, usporiadanie rozloženia, klávesové skratky). Môžete **manuálne pridávať, upravovať alebo odstraňovať** uzly a hrany; výbery vzťahov Source/Target sú prehľadávateľné pre grafy s mnohými entitami. Výber uzla zobrazuje jeho odchádzajúce a prichádzajúce prepojenia, pričom na každé sa dá kliknúť a prejsť na daný uzol. Zmeny sa aplikujú iba na graf **tohto** agenta (graf pre uzol na plátne, ktorého mozog ste otvorili).

## Zdieľanie s inými agentmi

V dialógovom okne pamäťového grafu vám **Share memory with other agents** umožňuje pripojiť **partnerské uzly**, ktoré môžu tento graf používať za behu:

1. Vyberte **workflow** (akýkoľvek workflow, ktorý dokážete otvoriť v editore).
2. Vyberte uzol **agenta** v tomto workflow.
3. Nastavte **Read only** alebo **Read & write**.

| Oprávnenie | Účinok |
|------------|--------|
| Read only | Keď sa spustí **partnerský** agent, tento graf sa zlúči do systémového promptu partnera (ak obsahuje entity). Žiadna extrakcia do tohto grafu zo spustenia partnera. |
| Read & write | Rovnaké správanie promptu ako pri čítaní a po **úspešnom** dokončení partnera môže obvyklá extrakcia pamäte tiež **zlúčiť do tohto (vlastníckeho) grafu** pomocou prihlasovacích údajov spustenia partnera. |

Partnerské uzly sa ukladajú pre každý vlastnícky uzol ako položky `memoryShares` s `peerWorkflowId` a `peerCanvasNodeId` (a `permission`). Staršie workflowy môžu vynechať `peerWorkflowId` pre partnerské uzly v **tom istom** workflow; editor to považuje za aktuálny workflow.

**Zdieľanie medzi workflowmi** sa rieši za behu skenovaním workflowov, **ktoré vlastníte**. Spustenia bez autentifikovaného používateľského kontextu riešia iba zdieľania definované v JSON **aktuálneho** workflow (rovnaké plátno).

## Správanie za behu

### Vlastný graf (`persistentMemoryEnabled`)

1. **Pred volaním LLM** – Ak má graf entity, do systémovej inštrukcie sa pripojí blok vysvetľujúci, že ide o fakty z predchádzajúcich spustení (môžu byť neúplné; pri konflikte má prednosť aktuálna správa používateľa).
2. **Po úspešnom dokončení** – Úloha na pozadí požiada model (s rovnakými prihlasovacími údajmi ako spustenie agenta) o štruktúrovaný JSON (entity + vzťahy). Tento payload sa zlúči do databázy (uplatňuje sa deduplikácia a čistenie vzťahov pre niektoré typy, napr. hrany typu zamestnanie).

### Partner prijímajúci zdieľané grafy

Keď sa spustí agent, systém nájde **vlastnícke** uzly (v ktorýchkoľvek vašich workflowoch, ak je to možné), ktorých `memoryShares` odkazujú na workflow a uzol na plátne tohto spustenia. Pre každú zhodu sa graf tohto vlastníka pripojí ako sekcia **zdieľanej pamäte** v systémovom prompte. Partneri s právom **Read & write** navyše naplánujú ciele extrakcie pre **vlastnícky** workflow/graf, keď spustenie uspeje.

Extrakcia sa **nespustí**, keď spustenie skončí chybou alebo v stave čakajúcom na HITL.

## Workflow JSON (pole `data`)

Ukladá sa na uzle agenta rovnako ako ostatné nastavenia:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` je `"read"` alebo `"write"`. Ak sa nezdieľa, vynechajte `memoryShares` alebo použite `[]`.

Úplný tvar objektu uzla nájdete v časti [Workflow Structure](./workflow-structure.md).

## Súvisiace

- [Agent Node](../nodes/agent-node.md) — Úplná konfigurácia agenta
- [Agent Architecture](./agent-architecture.md) — Orchestrátor, sub-agenti, nástroje
- [Workflow Structure](./workflow-structure.md) — Formát JSON workflow
- [Canvas Features](./canvas-features.md) — Ovládanie mozgu a dialóg grafu
- [Traces tab](../tabs/traces-tab.md) — Pozorovateľnosť požiadaviek/odpovedí LLM
