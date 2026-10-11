# Download e Importazione

Esportare Workflow o intere cartelle come file, oppure importarli tramite drag & drop. Utilizzare questa funzione per backup, condivisione o migrazione di Workflow tra istanze.

## Download Workflow (JSON)

**Posizione:** Toolbar dell'editor → pulsante **Download** (visibile su schermi di grandi dimensioni)

**Contenuto esportato:**
- `nodes` – Tutti i nodi presenti sul canvas
- `edges` – Tutte le connessioni tra i nodi

**Nome file:** `{workflow-name}.json` (derivato dal nome del Workflow)

**Formato:** Consultare [Workflow Structure](./workflow-structure.md) per lo schema JSON.

## Download cartella (ZIP)

**Posizione:** Dashboard → scheda Workflows → menu a 3 punti della cartella → **Download as ZIP**

**Contenuto esportato:**
- Tutti i Workflow presenti nella cartella e in tutte le sotto-cartelle, in modo ricorsivo
- Gerarchia delle cartelle preservata come directory all'interno del file ZIP

**Struttura ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Ogni file `.json` contiene `{ name, nodes, edges }`.

## Importazione

### Dalla Dashboard (scheda Workflows)

1. Accedere alla scheda [Workflows](../tabs/workflows-tab.md)
2. Trascinare un file **JSON** o **ZIP** nell'area dei Workflow

**File JSON:** Viene creato un nuovo Workflow. Il nome del Workflow deriva dal campo `name` presente nel JSON, oppure dal nome del file qualora `name` sia assente.

**File ZIP:** L'intera struttura delle cartelle viene ricreata a livello root. Ogni file `.json` contenuto nello ZIP diventa un Workflow collocato nella cartella corrispondente. Le Credenziali e i riferimenti tra Workflow che non esistono nell'istanza corrente vengono rimossi automaticamente. Qualora alcuni Workflow non vengano importati correttamente, viene mostrato un riepilogo con il numero di importazioni riuscite.

### Dal Canvas (editor)

1. Aprire un Workflow nell'editor
2. Trascinare un file JSON sul canvas
3. Se il canvas contiene già nodi o edge, una finestra di conferma chiede se sostituire il Workflow corrente
4. I nodi e gli edge importati sostituiscono o si integrano nel Workflow corrente

## Formati dei file

### JSON (singolo Workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Obbligatorio; array di oggetti nodo
- `edges` – Opzionale; array di oggetti edge (valore predefinito `[]`)
- `name` – Opzionale; utilizzato durante la creazione di un nuovo Workflow tramite l'importazione dalla Dashboard

### ZIP (cartella)

Archivio ZIP in cui la struttura delle directory rispecchia la gerarchia delle cartelle. Ogni file è un Workflow in formato JSON (vedere sopra). I nomi delle cartelle e dei Workflow derivano rispettivamente dai nomi delle directory e dei file.

Consultare [Workflow Structure](./workflow-structure.md) per i formati di nodi ed edge.

## Casi d'uso

- **Backup** – Scaricare Workflow o intere cartelle prima di modifiche rilevanti
- **Condivisione** – Esportare e condividere file JSON con i membri del team
- **Migrazione** – Spostare Workflow o strutture di cartelle tra istanze Heym
- **Controllo di versione** – Archiviare i Workflow JSON in Git insieme al codice

## Correlati

- [Workflow Structure](./workflow-structure.md) – Formato JSON per nodi ed edge
- [Workflows Tab](../tabs/workflows-tab.md) – Creare Workflow e importare tramite drag & drop
- [Workflow Organization](./workflow-organization.md) – Cartelle e sotto-cartelle
- [Canvas Features](./canvas-features.md) – Funzionalità dell'editor, inclusa l'importazione sul canvas