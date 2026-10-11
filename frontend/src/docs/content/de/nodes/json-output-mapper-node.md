# JSON-Ausgabe-Mapper

Der **JSON-Ausgabe-Mapper**-Knoten erstellt ein JSON-Objekt aus Schlüssel/Wert-[Mappings](./set-node.md) (dasselbe Modell wie [Set](./set-node.md)). Verwende ihn, wenn Aufrufer einen **reinen JSON-Body** an der Wurzel der Antwort erhalten sollen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 0 (Sink) |
| Laufzeitausgabe | Objekt, das aus `mappings` erstellt wird |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knoten-Bezeichner (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }`-Einträge (wie bei Set) |

## Verwendung als Agent-Tool

Nicht unterstützt. Dieser Knoten ist ein terminaler Sink und kann daher nicht an einen Tools-Handle eines [Agent-Knoten](./agent-node.md) angehängt werden. Verwende einen [Set](./set-node.md)-Knoten, wenn ein Agent Werte mitten in der Konversation formen muss.

## Webhook- und Ausführungsverhalten

Wenn dieser Knoten die **einzige** terminale Ausgabe des Workflows ist, sind die Ausführungs-**outputs** das gemappte Objekt selbst: Schlüssel aus `mappings` erscheinen auf der **obersten Ebene** des JSON. Es gibt **keinen** äußeren Wrapper, der durch das Knoten-Label benannt ist, und **kein** `{ "result": ... }`-Objekt (anders als beim [Output](./output-node.md)-Knoten).

Wenn mehrere terminale Knoten Ausgaben erzeugen (zum Beispiel [Output](./output-node.md) plus JSON output mapper oder mehrere Branches), verwendet Heym die normale Form: jeder terminale Knoten wird durch sein `label` benannt.

## Loop-Einschränkung

Dieselbe Regel wie bei [Output](./output-node.md): Platziere diesen Knoten nicht innerhalb eines Loop-Iterations-Branches – nur nach dem `done`-Branch der Loop. Siehe [Loop](./loop-node.md).

## Beispiel

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Verwandte Themen

- [Set](./set-node.md) – Dieselbe Mapping-Mechanik für Zwischentransformationen
- [Output](./output-node.md) – Nachrichten- oder schema-basierte Antwort mit `result`-Wrapping
- [Knotentypen](../reference/node-types.md) – Alle Knotentypen
- [Workflow-Struktur](../reference/workflow-structure.md) – JSON-Workflow-Format
- [Webhooks](../reference/webhooks.md) – Execute-Endpoint und Antworten
