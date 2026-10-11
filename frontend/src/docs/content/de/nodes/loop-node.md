# Schleifen-Knoten

Der **Schleifen-Knoten** (Loop) iteriert über Arrays von Elementen und führt verbundene Unterknoten für jedes Element aus.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 1 |
| Ausgänge | 2 (`body` für den Schleifendurchlauf, `done` nach Abschluss) |
| Ausgabe | `$nodeLabel.item`, `$nodeLabel.index` |

## Konfiguration

- **Array-Ausdruck**: z. B. `$input.users`
- **Ausführungsart**: Sequenziell oder parallel mit einstellbarem Concurrency-Limit

## Verwandte Themen

- [Zusammenführungs-Knoten](./merge-node.md) – Ergebnisse sammeln\n