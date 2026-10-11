# Knoten deaktivieren

Der **Knoten deaktivieren**-Knoten deaktiviert dauerhaft einen anderen Knoten im Workflow. Bei der Ausführung setzt er das `active` des Zielknotens auf `false` und speichert die Änderung dauerhaft. Verwende ihn für einmalige Vorgänge, wie das Stoppen eines Cron-Triggers, nachdem eine Bedingung erfüllt ist.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knoten-Bezeichner (camelCase) |
| `targetNodeLabel` | string | Label des zu deaktivierenden Knotens (z. B. `hourlyCheck`) |

## Anwendungsfall

Deaktiviere einen [Cron](./cron-node.md)-Trigger, nachdem eine Bedingung erfüllt ist, damit er bei zukünftigen Workflow-Ausführungen nicht mehr läuft. Schalte ihn später mit [Knoten aktivieren](./enable-node.md) wieder ein.

## Beispiel

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Ablauf: Cron → HTTP-Prüfung → Bedingung (Status abgeschlossen?) → wenn wahr: Knoten deaktivieren (Ziel: cron) → Ausgabe.

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Knoten aktivieren](./enable-node.md) – Einen deaktivierten Knoten wieder einschalten
- [Cron-Knoten](./cron-node.md) – Trigger zum Deaktivieren
- [Bedingungsknoten](./condition-node.md) – Verzweigung vor dem Deaktivieren
