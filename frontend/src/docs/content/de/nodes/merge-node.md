# Zusammenführungs-Knoten

Der **Zusammenführungs-Knoten** (Merge) führt mehrere parallele Ausführungspfade wieder zusammen.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | Mindestens 2 |
| Ausgänge | 1 |
| Ausgabe | Kombiniertes Array oder Objekt aller eingehenden Zweige |

## Modi

- **Wait for All**: Wartet, bis alle eingehenden Knoten erfolgreich abgeschlossen sind.
- **First Come**: Fährt sofort fort, sobald der erste Zweig eintrifft.

## Verwandte Themen

- [Parallele Ausführung](../reference/parallel-execution.md) – Parallele Pfade im Workflow\n