# Knoten aktivieren

Der **Knoten aktivieren** schaltet einen anderen Knoten wieder ein. Bei der Ausführung setzt er `active` des Zielknotens auf `true` und speichert die Änderung dauerhaft. Er ist das Gegenstück zu [Knoten „Deaktivieren"](./disable-node.md): Verwende ihn, um einen [Cron](./cron-node.md)-Trigger oder einen beliebigen Knoten, der abgeschaltet wurde, wieder scharf zu stellen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knoten-Bezeichner (camelCase) |
| `targetNodeLabel` | string | Label des zu aktivierenden Knotens (z. B. `hourlyCheck`) |

## Verhalten

- Das Ziel wird als aktiv gespeichert, sodass zukünftige Ausführungen und Trigger es sehen. Ein wieder aktivierter Cron-Trigger feuert wieder zu seinem nächsten geplanten Zeitpunkt.
- Wenn das Ziel downstream vom Knoten „Aktivieren" liegt und noch nicht ausgeführt wurde, läuft es auch in der aktuellen Ausführung.
- Das Aktivieren eines Knotens, der bereits aktiv ist, ändert nichts; die Ausgabe meldet weiterhin `enabled: true`.
- Der Knoten schlägt mit einem Fehler fehl, wenn `targetNodeLabel` leer ist oder kein Knoten dieses Label hat.

## Anwendungsfall

Starte einen [Cron](./cron-node.md)-Trigger bei Bedarf. Speichere den Cron-Knoten abgeschaltet und gib dem Workflow einen zweiten Einstiegspunkt wie einen [Input](./input-node.md)-Trigger. Eine Anfrage an diesen Einstiegspunkt führt den Knoten „Aktivieren" aus, und der Cron beginnt zu feuern.

Ein abgeschalteter Trigger startet niemals von selbst eine Ausführung, daher muss der Knoten „Aktivieren" hinter einem Einstiegspunkt liegen, der ausgeführt werden kann.

## Beispiel

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Ablauf: Input → Knoten „Aktivieren" (Ziel: cron) → Output. Der Cron-Knoten `hourlyCheck` ist im selben Workflow als deaktiviert gespeichert und führt seinen eigenen HTTP-Prüfzweig aus, sobald er aktiviert ist.

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Knoten „Deaktivieren"](./disable-node.md) – Einen Knoten von innerhalb eines Workflows abschalten
- [Cron-Knoten](./cron-node.md) – Trigger zum Aktivieren
- [Bedingungsknoten](./condition-node.md) – Verzweigung vor dem Aktivieren
- [Canvas-Funktionen](../reference/canvas-features.md) – Einen Knoten manuell aktivieren oder deaktivieren
