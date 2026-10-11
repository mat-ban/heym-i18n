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