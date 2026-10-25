# Klávesové zkratky

Heym poskytuje klávesové zkratky v rámci editoru workflow a canvasu pro zrychlení běžných akcí.

## Globální zkratky editoru

Tyto zkratky jsou aktivní kdekoli v editoru workflow.

| Zkratka | Akce |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Otevře Command Palette |
| `Ctrl + I` / `Cmd + I` | Přepne panel [AI Assistant](./ai-assistant.md) (funguje i při psaní) |
| `Ctrl + Enter` / `Cmd + Enter` | Spustí aktuální workflow |
| `Ctrl + S` / `Cmd + S` | Uloží workflow |
| `Ctrl + Z` / `Cmd + Z` | Zpět |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Znovu |
| `Ctrl + Y` / `Cmd + Y` | Znovu (alternativa) |
| `Escape` | Zavře otevřené overlaye, dialogy a panely |

## Zkratky canvasu

Tyto zkratky platí, když je canvas aktivní (není aktivní žádné textové pole).

### Výběr a navigace

| Zkratka | Akce |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Vybere všechny uzly |
| `Shift` (podržet) | Tažením vyberete více uzlů |
| `Ctrl` / `Cmd` (podržet) | Kliknutím přidáte jednotlivé uzly do výběru |
| `Escape` | Zruší výběr všech uzlů; zavře inline vyhledávání uzlů |

### Úprava uzlů

| Zkratka | Akce |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Zkopíruje vybrané uzly |
| `Ctrl + X` / `Cmd + X` | Vyřízne vybrané uzly |
| `Ctrl + V` / `Cmd + V` | Vloží uzly |
| `Delete` nebo `Backspace` | Smaže vybrané uzly a/nebo hrany |
| `D` | Přepne vybrané uzly mezi povoleným / zakázaným stavem |
| `P` | Přepne připnutá data na vybraném uzlu |

### Inline vyhledávání uzlů

Napsáním libovolného tisknutelného znaku na canvasu (když není aktivní žádné textové pole) otevřete vyskakovací okno inline vyhledávání uzlů. Napsaný znak se stane prvním znakem vyhledávacího dotazu.

| Zkratka | Akce |
|----------|--------|
| Libovolný tisknutelný znak | Otevře inline vyhledávání uzlů a zahájí psaní |
| `Backspace` | Odebere poslední znak z vyhledávacího dotazu |
| `Escape` | Zavře inline vyhledávání uzlů |

## Command Palette (`Ctrl + K`)

Command Palette je dostupná z editoru, dashboardu, dokumentace a zobrazení evaluací. Umožňuje rychle navigovat mezi workflow, záložkami a stránkami dokumentace, aniž byste museli opustit klávesnici.

| Zkratka | Akce |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Otevře Command Palette |
| `↑` / `↓` | Navigace v seznamu výsledků |
| `Tab` / `Shift + Tab` | Navigace v seznamu výsledků |
| `Enter` | Otevře vybranou položku |
| `Escape` | Zavře paletu |

## Zkratky dashboardu

Tyto zkratky jsou aktivní na záložce Workflows, když není aktivní žádné jiné textové pole.

| Zkratka | Akce |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Zaměří vyhledávání workflow |
| `Escape` | Vymaže vyhledávání workflow, pokud obsahuje text |

## Zkratky panelu vlastností

Tyto zkratky jsou aktivní, když je vybrán uzel a panel vlastností je otevřený.

| Zkratka | Akce |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Otevře propojený sub-workflow na nové kartě (pouze uzel Execute) |

## Zkratky dialogu Evaluate

Tyto zkratky jsou aktivní, když je otevřený dialog Evaluate.

| Zkratka | Akce |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Použije výraz a zavře dialog |
| `Ctrl + Z` / `Cmd + Z` | Vrátí změny v editoru výrazů |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Znovu provede změny v editoru výrazů |
| `Ctrl + Y` / `Cmd + Y` | Znovu provede změny v editoru výrazů (alternativa) |

## Zkratky historie a spuštění

Tyto zkratky jsou dostupné v dialogu Execution History a v panelu Traces.

| Zkratka | Akce |
|----------|--------|
| `S` | Přepne vstupní pole vyhledávání pro filtrování záznamů |

## Související

- [Funkce canvasu](./canvas-features.md) – Data pin, povolení/zakázání, extrahování do sub-workflow
- [Struktura workflow](./workflow-structure.md) – Formát uzlů a hran
- [Uzel Execute](../nodes/execute-node.md) – Volá sub-workflow (`Ctrl + Shift + O`)
- [Rychlý start](../getting-started/quick-start.md) – Vytvořte své první workflow

- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
