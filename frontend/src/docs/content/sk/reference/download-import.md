# Sťahovanie a import

Exportujte workflowy alebo celé priečinky ako súbory alebo ich importujte pomocou drag & drop. Využite to na zálohovanie, zdieľanie alebo migráciu workflowov medzi inštanciami.

## Sťahovanie workflowu (JSON)

**Umiestnenie:** Panel nástrojov editora → tlačidlo **Download** (viditeľné na veľkých obrazovkách)

**Čo sa exportuje:**
- `nodes` – Všetky uzly na plátne
- `edges` – Všetky prepojenia medzi uzlami

**Názov súboru:** `{workflow-name}.json` (odvodený od názvu workflowu)

**Formát:** Schému JSON nájdete v časti [Workflow Structure](./workflow-structure.md).

## Sťahovanie priečinka (ZIP)

**Umiestnenie:** Dashboard → karta Workflows → 3-bodové menu priečinka → **Download as ZIP**

**Čo sa exportuje:**
- Všetky workflowy v priečinku a vo všetkých podpriečinkoch, rekurzívne
- Hierarchia priečinkov zachovaná ako adresáre vnútri ZIP archívu

**Štruktúra ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Každý súbor `.json` obsahuje `{ name, nodes, edges }`.

## Import

### Z Dashboardu (karta Workflows)

1. Prejdite na kartu [Workflows](../tabs/workflows-tab.md)
2. Presuňte súbor **JSON** alebo **ZIP** na oblasť workflowov

**Súbor JSON:** Vytvorí sa nový workflow. Názov workflowu pochádza z poľa `name` v súbore JSON alebo z názvu súboru, ak pole `name` chýba.

**Súbor ZIP:** Celá štruktúra priečinkov sa znovu vytvorí na koreňovej úrovni. Každý súbor `.json` vnútri ZIP archívu sa stane workflowom umiestneným v zodpovedajúcom priečinku. Prihlasovacie údaje a odkazy medzi workflowmi, ktoré v aktuálnej inštancii neexistujú, sa automaticky vymažú. Ak sa niektoré workflowy nepodarí importovať, zobrazí sa súhrn s počtom úspešných importov.

### Z plátna (editor)

1. Otvorte workflow v editore
2. Presuňte súbor JSON na plátno
3. Ak plátno už obsahuje uzly alebo prepojenia, zobrazí sa potvrdzovací dialóg s otázkou, či chcete nahradiť aktuálny workflow
4. Importované uzly a prepojenia nahradia alebo sa zlúčia s aktuálnym workflowom

## Formáty súborov

### JSON (jeden workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Povinné; pole objektov uzlov
- `edges` – Voliteľné; pole objektov prepojení (predvolene `[]`)
- `name` – Voliteľné; použije sa pri vytváraní nového workflowu z importu cez Dashboard

### ZIP (priečinok)

ZIP archív, v ktorom štruktúra adresárov zrkadlí hierarchiu priečinkov. Každý súbor je JSON workflowu (pozri vyššie). Názvy priečinkov a workflowov sa odvodzujú z názvov adresárov, respektíve súborov.

Formáty uzlov a prepojení nájdete v časti [Workflow Structure](./workflow-structure.md).

## Prípady použitia

- **Zálohovanie** – Stiahnite workflowy alebo celé priečinky pred väčšími zmenami
- **Zdieľanie** – Exportujte a zdieľajte súbory JSON s kolegami
- **Migrácia** – Presuňte workflowy alebo štruktúry priečinkov medzi inštanciami Heym
- **Verzionovanie** – Ukladajte JSON workflowov v Gite spolu s kódom

## Súvisiace

- [Workflow Structure](./workflow-structure.md) – Formát JSON pre uzly a prepojenia
- [Workflows Tab](../tabs/workflows-tab.md) – Vytvárajte workflowy a importujte pomocou drag & drop
- [Workflow Organization](./workflow-organization.md) – Priečinky a podpriečinky
- [Canvas Features](./canvas-features.md) – Funkcie editora vrátane importu na plátno
