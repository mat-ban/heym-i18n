# Nedladdning och import

Exportera workflows eller hela mappar som filer, eller importera dem via drag & drop. Använd detta för säkerhetskopiering, delning eller migrering av workflows mellan instanser.

## Ladda ned workflow (JSON)

**Plats:** Redigerarens verktygsfält → **Download**-knappen (synlig på större skärmar)

**Vad som exporteras:**
- `nodes` – Alla noder på canvas
- `edges` – Alla kopplingar mellan noder

**Filnamn:** `{workflow-name}.json` (härlett från workflowens namn)

**Format:** Se [Workflow-struktur](./workflow-structure.md) för JSON-schemat.

## Ladda ned mapp (ZIP)

**Plats:** Instrumentpanelen → Workflows-fliken → mappens 3-punktsmeny → **Download as ZIP**

**Vad som exporteras:**
- Alla workflows i mappen och alla undermappar, rekursivt
- Mapphierarkin bevaras som kataloger inuti ZIP-filen

**ZIP-struktur:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Varje `.json`-fil innehåller `{ name, nodes, edges }`.

## Import

### Från instrumentpanelen (Workflows-fliken)

1. Gå till fliken [Workflows](../tabs/workflows-tab.md)
2. Dra en **JSON**- eller **ZIP**-fil till workflow-området

**JSON-fil:** En ny workflow skapas. Workflowens namn hämtas från fältet `name` i JSON-filen, eller från filnamnet om `name` saknas.

**ZIP-fil:** Hela mappstrukturen återskapas på rotnivå. Varje `.json`-fil inuti ZIP-filen blir en workflow som placeras i motsvarande mapp. Autentiseringsuppgifter och korsreferenser mellan workflows som inte finns i den aktuella instansen rensas automatiskt. Om vissa workflows inte kan importeras visas en sammanfattning av hur många som lyckades.

### Från canvas (redigeraren)

1. Öppna en workflow i redigeraren
2. Dra en JSON-fil till canvas
3. Om canvas redan har noder eller edges visas en bekräftelsedialog som frågar om den aktuella workflowen ska ersättas
4. De importerade noderna och edges ersätter eller sammanfogas med den aktuella workflowen

## Filformat

### JSON (enskild workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Krävs; array av nodobjekt
- `edges` – Valfritt; array av edge-objekt (standardvärdet är `[]`)
- `name` – Valfritt; används när en ny workflow skapas via import från instrumentpanelen

### ZIP (mapp)

ZIP-arkiv där katalogstrukturen speglar mapphierarkin. Varje fil är en workflow-JSON (se ovan). Mapp- och workflow-namn härleds från katalog- respektive filnamnen.

Se [Workflow-struktur](./workflow-structure.md) för format för noder och edges.

## Användningsområden

- **Säkerhetskopiering** – Ladda ned workflows eller hela mappar före större ändringar
- **Delning** – Exportera och dela JSON-filer med teammedlemmar
- **Migrering** – Flytta workflows eller mappstrukturer mellan Heym-instanser
- **Versionshantering** – Lagra workflow-JSON i Git tillsammans med kod

## Relaterat

- [Workflow-struktur](./workflow-structure.md) – JSON-format för noder och edges
- [Workflows-fliken](../tabs/workflows-tab.md) – Skapa workflows och importera via drag & drop
- [Workflow-organisering](./workflow-organization.md) – Mappar och undermappar
- [Canvas-funktioner](./canvas-features.md) – Redigeringsfunktioner inklusive canvas-import
