# Stahování a import

Exportujte workflows nebo celé složky jako soubory nebo je importujte pomocí drag & drop. Využijte to pro zálohování, sdílení nebo migraci workflows mezi instancemi.

## Stažení workflow (JSON)

**Umístění:** Panel nástrojů editoru → tlačítko **Download** (viditelné na velkých obrazovkách)

**Co se exportuje:**
- `nodes` – Všechny uzly na canvasu
- `edges` – Všechna propojení mezi uzly

**Název souboru:** `{workflow-name}.json` (odvozený z názvu workflow)

**Formát:** Schéma JSON naleznete v části [Workflow Structure](./workflow-structure.md).

## Stažení složky (ZIP)

**Umístění:** Dashboard → karta Workflows → nabídka se třemi tečkami u složky → **Download as ZIP**

**Co se exportuje:**
- Všechny workflows ve složce a všech podsložkách, rekurzivně
- Hierarchie složek zachovaná jako adresáře uvnitř ZIPu

**Struktura ZIPu:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Každý soubor `.json` obsahuje `{ name, nodes, edges }`.

## Import

### Z Dashboardu (karta Workflows)

1. Přejděte na kartu [Workflows](../tabs/workflows-tab.md)
2. Přetáhněte soubor **JSON** nebo **ZIP** do oblasti workflows

**Soubor JSON:** Vytvoří se nový workflow. Název workflow pochází z pole `name` v JSONu, případně z názvu souboru, pokud pole `name` chybí.

**Soubor ZIP:** Celá struktura složek se znovu vytvoří na kořenové úrovni. Každý soubor `.json` uvnitř ZIPu se stane workflow umístěným v odpovídající složce. Přihlašovací údaje a reference mezi workflows, které v aktuální instanci neexistují, se automaticky vymažou. Pokud se některé workflows nepodaří importovat, zobrazí se souhrn s počtem úspěšných importů.

### Z Canvasu (editor)

1. Otevřete workflow v editoru
2. Přetáhněte soubor JSON na canvas
3. Pokud canvas již obsahuje uzly nebo edges, zobrazí se potvrzovací dialog s dotazem, zda nahradit aktuální workflow
4. Importované uzly a edges nahradí nebo se sloučí s aktuálním workflow

## Formáty souborů

### JSON (jeden workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Povinné; pole objektů uzlů
- `edges` – Nepovinné; pole objektů edges (výchozí hodnota je `[]`)
- `name` – Nepovinné; použije se při vytváření nového workflow z importu v Dashboardu

### ZIP (složka)

ZIP archiv, ve kterém struktura adresářů odpovídá hierarchii složek. Každý soubor je workflow ve formátu JSON (viz výše). Názvy složek a workflows se odvozují z názvů adresářů, respektive souborů.

Formáty uzlů a edges naleznete v části [Workflow Structure](./workflow-structure.md).

## Případy použití

- **Zálohování** – Stáhněte workflows nebo celé složky před zásadními změnami
- **Sdílení** – Exportujte a sdílejte soubory JSON s kolegy
- **Migrace** – Přesuňte workflows nebo struktury složek mezi instancemi Heym
- **Správa verzí** – Ukládejte JSON workflows do Gitu společně s kódem

## Související

- [Workflow Structure](./workflow-structure.md) – Formát JSON pro uzly a edges
- [Workflows Tab](../tabs/workflows-tab.md) – Vytváření workflows a import pomocí drag & drop
- [Workflow Organization](./workflow-organization.md) – Složky a podsložky
- [Canvas Features](./canvas-features.md) – Funkce editoru včetně importu na canvas
