# Download & Import

Eksporter workflows eller hele mapper som filer, eller importer dem via drag & drop. Anvend denne funktion til backup, deling eller migration af workflows mellem instanser.

## Download Workflow (JSON)

**Placering:** Editorværktøjslinje → **Download**-knap (synlig på store skærme)

**Hvad der eksporteres:**
- `nodes` – Alle noder på canvas
- `edges` – Alle forbindelser mellem noder

**Filnavn:** `{workflow-name}.json` (afledt af workflow-navnet)

**Format:** Se [Workflow Structure](./workflow-structure.md) for JSON-schemaet.

## Download Mappe (ZIP)

**Placering:** Dashboard → Workflows-faneblad → mappens 3-prik-menu → **Download as ZIP**

**Hvad der eksporteres:**
- Alle workflows i mappen og alle undermapper, rekursivt
- Mappehierarki bevares som mapper i ZIP-filen

**ZIP-struktur:**
```
Mappenavn/
  workflow1.json
  workflow2.json
  Undermappe/
    workflow3.json
    DybUndermappe/
      workflow4.json
```

Hver `.json`-fil indeholder `{ name, nodes, edges }`.

## Import

### Fra Dashboard (Workflows-faneblad)

1. Gå til [Workflows](../tabs/workflows-tab.md)-fanebladet
2. Træk en **JSON**- eller **ZIP**-fil over workflow-området

**JSON-fil:** Der oprettes et nyt workflow. Workflow-navnet kommer fra `name`-feltet i JSON'en, eller filnavnet hvis `name` mangler.

**ZIP-fil:** Hele mappestrukturen genskabes på rodniveau. Hver `.json`-fil i ZIP'en bliver til et workflow placeret i den tilsvarende mappe. Legitimationsoplysninger og tværgående workflow-referencer, der ikke findes i den aktuelle instans, ryddes automatisk. Hvis nogle workflows ikke kan importeres, vises en oversigt over antallet af vellykkede imports.

### Fra Canvas (Editor)

1. Åbn et workflow i editoren
2. Træk en JSON-fil over canvas
3. Hvis canvas allerede indeholder noder eller edges, vises en bekræftelsesdialog, der spørger om det aktuelle workflow skal erstattes
4. De importerede noder og edges erstatter eller flettes ind i det aktuelle workflow

## Filformater

### JSON (enkelt workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Valgfrit workflow-navn"
}
```

- `nodes` – Påkrævet; array af node-objekter
- `edges` – Valgfrit; array af edge-objekter (standardværdi `[]`)
- `name` – Valgfrit; bruges ved oprettelse af nyt workflow fra Dashboard-import

### ZIP (mappe)

ZIP-arkiv, hvor mappestrukturen afspejler hierarkiet. Hver fil er et workflow-JSON (se ovenfor). Mappe- og workflow-navne er afledt af henholdsvis mappe- og filnavne.

Se [Workflow Structure](./workflow-structure.md) for node- og edge-formater.

## Anvendelsestilfælde

- **Backup** – Download workflows eller hele mapper før større ændringer
- **Deling** – Eksporter og del JSON-filer med teammedlemmer
- **Migration** – Flyt workflows eller mappestrukturer mellem Heym-instanser
- **Versionskontrol** – Gem workflow-JSON i Git sammen med kode

## Relateret

- [Workflow Structure](./workflow-structure.md) – JSON-format for noder og edges
- [Workflows Tab](../tabs/workflows-tab.md) – Opret workflows og importer via drag & drop
- [Workflow Organization](./workflow-organization.md) – Mapper og undermapper
- [Canvas Features](./canvas-features.md) – Editorfunktioner inklusive canvas-import
