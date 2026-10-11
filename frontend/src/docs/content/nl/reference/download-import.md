# Downloaden & Importeren

Exporteer workflows of volledige mappen als bestanden, of importeer ze via drag & drop. Gebruik dit voor back-up, delen of het migreren van workflows tussen instanties.

## Workflow downloaden (JSON)

**Locatie:** Editor-werkbalk → **Download**-knop (zichtbaar op grote schermen)

**Wat wordt geëxporteerd:**
- `nodes` – Alle nodes op het canvas
- `edges` – Alle verbindingen tussen nodes

**Bestandsnaam:** `{workflow-name}.json` (afgeleid van de workflownaam)

**Formaat:** Zie [Workflowstructuur](./workflow-structure.md) voor het JSON-schema.

## Map downloaden (ZIP)

**Locatie:** Dashboard → Workflows-tab → 3-puntsmenu van de map → **Downloaden als ZIP**

**Wat wordt geëxporteerd:**
- Alle workflows in de map en alle submappen, recursief
- De mappenhiërarchie blijft behouden als mappenstructuur in de ZIP

**ZIP-structuur:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Elk `.json`-bestand bevat `{ name, nodes, edges }`.

## Importeren

### Vanuit het Dashboard (Workflows-tab)

1. Ga naar de tab [Workflows](../tabs/workflows-tab.md)
2. Sleep een **JSON**- of **ZIP**-bestand naar het workflowgebied

**JSON-bestand:** Er wordt een nieuwe workflow aangemaakt. De workflownaam komt uit het veld `name` in de JSON, of uit de bestandsnaam als `name` ontbreekt.

**ZIP-bestand:** De volledige mappenstructuur wordt opnieuw aangemaakt op het hoogste niveau. Elk `.json`-bestand in de ZIP wordt een workflow die in de bijbehorende map wordt geplaatst. Referenties en verwijzingen tussen workflows die niet bestaan in de huidige instantie worden automatisch gewist. Als sommige workflows niet kunnen worden geïmporteerd, toont een samenvatting hoeveel er zijn geslaagd.

### Vanuit het Canvas (Editor)

1. Open een workflow in de editor
2. Sleep een JSON-bestand naar het canvas
3. Als het canvas al nodes of edges bevat, verschijnt een bevestigingsdialoog met de vraag of de huidige workflow moet worden vervangen
4. De geïmporteerde nodes en edges vervangen of worden samengevoegd met de huidige workflow

## Bestandsformaten

### JSON (één workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Verplicht; array van node-objecten
- `edges` – Optioneel; array van edge-objecten (standaard `[]`)
- `name` – Optioneel; wordt gebruikt bij het aanmaken van een nieuwe workflow via de Dashboard-import

### ZIP (map)

ZIP-archief waarin de mappenstructuur de mappenhiërarchie weerspiegelt. Elk bestand is een workflow-JSON (zie hierboven). Map- en workflownamen worden respectievelijk afgeleid van de map- en bestandsnamen.

Zie [Workflowstructuur](./workflow-structure.md) voor de indelingen van nodes en edges.

## Gebruiksscenario's

- **Back-up** – Download workflows of volledige mappen vóór ingrijpende wijzigingen
- **Delen** – Exporteer en deel JSON-bestanden met teamleden
- **Migratie** – Verplaats workflows of mappenstructuren tussen Heym-instanties
- **Versiebeheer** – Bewaar workflow-JSON in Git naast code

## Gerelateerd

- [Workflowstructuur](./workflow-structure.md) – JSON-formaat voor nodes en edges
- [Workflows-tab](../tabs/workflows-tab.md) – Workflows aanmaken en importeren via drag & drop
- [Workfloworganisatie](./workflow-organization.md) – Mappen en submappen
- [Canvas-functies](./canvas-features.md) – Editor-functies waaronder canvas-import
