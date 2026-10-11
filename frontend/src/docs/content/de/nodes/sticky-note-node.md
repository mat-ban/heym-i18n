# Notiz

Der **Notiz**-Knoten fügt dem Canvas umfangreiche Markdown-Notizen hinzu. Er wird nicht ausgeführt – verwende ihn für Dokumentation, Anweisungen, Referenzbilder oder Workflow-Notizen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 0 |
| Ausgabe | N/A (wird nicht ausgeführt) |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knoten-Bezeichner (camelCase) |
| `stickyTitle` | string | Angezeigter Titel, der oben in der Haftnotiz erscheint. |
| `stickyColor` | string | Hintergrundfarbe: `yellow`, `sky`, `emerald`, `rose`, `violet` oder `zinc`. |
| `note` | string | Markdown-Inhalt. Doppelklicke zum Bearbeiten auf dem Canvas. Unterstützt Links und Bild-Markdown wie `![Alt](https://example.com/image.png)`. |

## Beispiel

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Workflow-Organisation](../reference/workflow-organization.md) – Workflows organisieren
