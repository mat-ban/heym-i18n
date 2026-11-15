# Code-Knoten

Der **Code-Knoten** führt benutzerdefinierten JavaScript-, TypeScript- oder Python-Code zur Datentransformation, Filterung und komplexen Berechnungslogik aus.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 1 |
| Ausgänge | 1 |
| Ausgabe | Der vom Skript über `return` zurückgegebene Wert |

## Verwendung

Im Code-Editor haben Sie Zugriff auf Eingabedaten über `$input` und Workflow-Variablen über `$vars`:

```javascript
// Beispiel JavaScript Transformation
const items = $input.items || [];
return {
  total: items.length,
  activeItems: items.filter(i => i.status === 'active')
};
```

## Verwandte Themen

- [Ausdrucks-DSL](../reference/expression-dsl.md) – Einfache Datenausdrücke ohne Code\n
## Reading Drive files

Aktivieren Sie **Dateien** (`codeFiles`), um dem Code die Dateien des Laufs bereitzustellen. Das Feld akzeptiert eine ID, kommagetrennte IDs, eine Liste oder einen Ausdruck, der zu einer Datei oder deren ID aufgelöst wird, wie etwa `$Upload.file.id` oder `$Upload.file`. Eine Datei lässt sich öffnen, wenn sie in diesen Workflow gelangte: über den [Datei-Upload-Trigger](./file-upload-trigger-node.md) hochgeladen oder von einem seiner Knoten in [Drive](../reference/drive.md) geschrieben. Andere Drive-Dateien stehen einem Lauf nicht zur Verfügung, sodass ein Workflow nicht zum Auslesen fremder Drive-Verzeichnisse verwendet werden kann.

```python
import heym_files
import pandas as pd

def main(params):
    workbook = params.files[0]
    df = pd.read_excel(heym_files.path(workbook.name), sheet_name="Summary")
    return {"rows": len(df), "columns": list(df.columns)}
```
