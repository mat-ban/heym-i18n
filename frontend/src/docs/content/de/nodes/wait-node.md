# Warten

Der **Warten**-Knoten pausiert die Workflow-Ausführung für eine angegebene Dauer. Verwende ihn für Rate Limiting, verzögerte Aktionen oder Polling-Intervalle.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | Reicht die Eingabe durch |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knoten-Bezeichner (camelCase) |
| `duration` | number | Verzögerung in Millisekunden (z. B. 1000 = 1 Sekunde). Der Editor akzeptiert 1 bis 900000 (15 Minuten) |

## Beispiel

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Loop-Knoten](./loop-node.md) – Verwende Wait innerhalb von Schleifen für Rate Limiting
