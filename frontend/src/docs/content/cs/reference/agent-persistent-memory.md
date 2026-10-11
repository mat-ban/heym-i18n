# Persistentní paměť agenta

Uzly agenta mohou uchovávat **znalostní graf pro každý uzel** uložený v databázi: entity (s typy a vlastnostmi) a vztahy mezi nimi. Je-li tato funkce povolena, Heym **vkládá souhrn tohoto grafu do systémového promptu** při každém spuštění (pokud graf není prázdný). Po úspěšném spuštění **úloha extrakce pomocí LLM** sloučí nová fakta z konverzace do grafu na pozadí.

Sub-agenti a orchestrátoři ve výchozím nastavení používají graf vázaný na **jejich vlastní uzel na canvasu**. Můžete také **udělit jiným agentům přístup pro čtení nebo čtení a zápis** ke grafu tohoto uzlu (včetně agentů v **jiných workflow**, které vlastníte) – viz [Sdílení s jinými agenty](#sharing-with-other-agents).

## Povolení

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Je-li `true`, načte graf tohoto uzlu do systémového promptu a naplánuje extrakci po spuštění pro graf tohoto uzlu |
| `memoryShares` | array (volitelné) | Uděluje jiným uzlům agenta přístup ke grafu paměti **tohoto** uzlu; viz [Sdílení](#sharing-with-other-agents) |

Zapněte ji ve vlastnostech uzlu agenta (**Persistentní paměť (graf)**). Růžová ikona **mozku** na uzlu otevře editor grafu, je-li paměť povolena (nebo je-li zobrazen model).

## Editor grafu

Dialog vykresluje entity jako animovaný, silově orientovaný graf – barevné kruhy s velikostí podle počtu připojení a seskupené podle typu entity – spolu s možnostmi úprav a navigace (přizpůsobení zobrazení, uspořádání, klávesové zkratky). Uzly a hrany můžete **přidávat, upravovat nebo mazat** ručně; výběr vztahu Zdroj/Cíl je prohledávatelný pro grafy s mnoha entitami. Výběrem uzlu se zobrazí jeho odchozí a příchozí připojení, z nichž každé lze kliknutím přeskočit na příslušný uzel. Změny se projeví pouze v grafu **tohoto** agenta (graf pro uzel na canvasu, jehož mozek jste otevřeli).

## Sdílení s jinými agenty

V dialogu grafu paměti vám **Sdílet paměť s jinými agenty** umožňuje připojit **protějšky**, které mohou tento graf využívat za běhu:

1. Zvolte **workflow** (libovolné workflow, které můžete otevřít v editoru).
2. Zvolte uzel **agenta** v tomto workflow.
3. Nastavte **Pouze pro čtení** nebo **Čtení a zápis**.

| Oprávnění | Účinek |
|------------|--------|
| Pouze pro čtení | Když agent **protějšku** běží, tento graf se sloučí do systémového promptu protějšku (pokud obsahuje entity). Nedochází k extrakci do tohoto grafu ze spuštění protějšku. |
| Čtení a zápis | Stejné chování promptu jako u čtení, a po **úspěšném** dokončení protějšku může obvyklá extrakce paměti také **sloučit do tohoto (vlastníkova) grafu** s použitím přihlašovacích údajů spuštění protějšku. |

Protějšky jsou uloženy pro každý vlastnický uzel jako položky `memoryShares` s `peerWorkflowId` a `peerCanvasNodeId` (a `permission`). Starší workflow mohou vynechat `peerWorkflowId` pro protějšky ve **stejném** workflow; editor to považuje za aktuální workflow.

**Sdílení mezi workflow** se řeší za běhu prohledáním workflow, **které vlastníte**. Spuštění bez kontextu ověřeného uživatele řeší pouze sdílení definovaná v JSON **aktuálního** workflow (stejný canvas).

## Chování za běhu

### Vlastní graf (`persistentMemoryEnabled`)

1. **Před voláním LLM** – Pokud graf obsahuje entity, do systémové instrukce se připojí blok vysvětlující, že se jedná o fakta z předchozích spuštění (mohou být neúplná; při konfliktu vítězí aktuální zpráva uživatele).
2. **Po úspěšném dokončení** – Úloha na pozadí požádá model (se stejnými přihlašovacími údaji jako spuštění agenta) o strukturovaný JSON (entity + vztahy). Tento payload se sloučí do databáze (u některých typů se uplatňuje deduplikace a čištění vztahů, např. hran ve stylu zaměstnání).

### Protějšek přijímající sdílené grafy

Když agent běží, systém najde **vlastnické** uzly (v kterémkoli z vašich workflow, je-li to možné), jejichž `memoryShares` odkazují na workflow a uzel na canvasu tohoto spuštění. Pro každou shodu se graf tohoto vlastníka připojí jako sekce **sdílené paměti** v systémovém promptu. Protějšky s **Čtením a zápisem** navíc naplánují cíle extrakce pro **vlastníkův** workflow/graf, když spuštění uspěje.

Extrakce **neproběhne**, pokud spuštění skončí chybou nebo ve stavu čekajícím na HITL.

## Workflow JSON (pole `data`)

Ukládá se na uzel agenta stejně jako ostatní nastavení:

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

`permission` je `"read"` nebo `"write"`. Pokud se nesdílí, vynechejte `memoryShares` nebo použijte `[]`.

Úplný tvar objektu uzlu naleznete v části [Struktura workflow](./workflow-structure.md).

## Související

- [Uzel agenta](../nodes/agent-node.md) — Úplná konfigurace agenta
- [Architektura agenta](./agent-architecture.md) — Orchestrátor, sub-agenti, nástroje
- [Struktura workflow](./workflow-structure.md) — Formát JSON workflow
- [Funkce canvasu](./canvas-features.md) — Ovládání mozku a dialog grafu
- [Karta Spuštění](../tabs/traces-tab.md) — Pozorovatelnost požadavků/odpovědí LLM
