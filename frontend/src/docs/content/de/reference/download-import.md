# Download & Import

Exportiere Workflows oder ganze Ordner als Dateien oder importiere sie per Drag & Drop. Verwende dies für Backup, Freigabe oder die Migration von Workflows zwischen Instanzen.

## Workflow herunterladen (JSON)

**Ort:** Editor-Toolbar → **Download**-Button (sichtbar auf großen Bildschirmen)

**Was exportiert wird:**
- `nodes` – Alle Knoten auf dem Canvas
- `edges` – Alle Verbindungen zwischen Knoten

**Dateiname:** `{workflow-name}.json` (abgeleitet vom Workflow-Namen)

**Format:** Siehe [Workflow-Struktur](./workflow-structure.md) für das JSON-Schema.

## Ordner herunterladen (ZIP)

**Ort:** Dashboard → Workflows-Reiter → 3-Punkte-Menü des Ordners → **Download as ZIP**

**Was exportiert wird:**
- Alle Workflows im Ordner und allen Unterordnern, rekursiv
- Ordnerhierarchie bleibt als Verzeichnisse innerhalb der ZIP erhalten

**ZIP-Struktur:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Jede `.json`-Datei enthält `{ name, nodes, edges }`.

## Import

### Vom Dashboard (Workflows-Reiter)

1. Gehe zum [Workflows](../tabs/workflows-tab.md)-Reiter
2. Ziehe eine **JSON**- oder **ZIP**-Datei auf den Workflow-Bereich

**JSON-Datei:** Ein neuer Workflow wird erstellt. Der Workflow-Name stammt aus dem `name`-Feld im JSON oder aus dem Dateinamen, falls `name` fehlt.

**ZIP-Datei:** Die gesamte Ordnerstruktur wird auf Root-Ebene neu erstellt. Jede `.json`-Datei innerhalb der ZIP wird zu einem Workflow, der im passenden Ordner abgelegt wird. Anmeldedaten und workflowübergreifende Referenzen, die in der aktuellen Instanz nicht existieren, werden automatisch entfernt. Wenn einige Workflows nicht importiert werden können, zeigt eine Zusammenfassung an, wie viele erfolgreich waren.

### Vom Canvas (Editor)

1. Öffne einen Workflow im Editor
2. Ziehe eine JSON-Datei auf den Canvas
3. Wenn der Canvas bereits Knoten oder Kanten enthält, fragt ein Bestätigungsdialog, ob der aktuelle Workflow ersetzt werden soll
4. Die importierten Knoten und Kanten ersetzen oder verschmelzen mit dem aktuellen Workflow

## Dateiformate

### JSON (einzelner Workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Erforderlich; Array von Knoten-Objekten
- `edges` – Optional; Array von Kanten-Objekten (Standardwert ist `[]`)
- `name` – Optional; wird beim Erstellen eines neuen Workflows aus dem Dashboard-Import verwendet

### ZIP (Ordner)

ZIP-Archiv, bei dem die Verzeichnisstruktur die Ordnerhierarchie widerspiegelt. Jede Datei ist ein Workflow-JSON (siehe oben). Ordner- und Workflow-Namen werden jeweils aus den Verzeichnis- und Dateinamen abgeleitet.

Siehe [Workflow-Struktur](./workflow-structure.md) für Knoten- und Kantenformate.

## Anwendungsfälle

- **Backup** – Lade Workflows oder ganze Ordner vor größeren Änderungen herunter
- **Freigabe** – Exportiere und teile JSON-Dateien mit Teammitgliedern
- **Migration** – Verschiebe Workflows oder Ordnerstrukturen zwischen Heym-Instanzen
- **Versionskontrolle** – Speichere Workflow-JSON in Git zusammen mit Code

## Verwandte Themen

- [Workflow-Struktur](./workflow-structure.md) – JSON-Format für Knoten und Kanten
- [Reiter Workflows](../tabs/workflows-tab.md) – Workflows erstellen und per Drag & Drop importieren
- [Workflow-Organisation](./workflow-organization.md) – Ordner und Unterordner
- [Canvas-Funktionen](./canvas-features.md) – Editor-Funktionen einschließlich Canvas-Import
