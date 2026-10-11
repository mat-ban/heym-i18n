# Sticky Note

Węzeł **Sticky Note** dodaje do canvasu bogate notatki w formacie markdown. Nie jest wykonywany — służy do dokumentacji, instrukcji, obrazów referencyjnych lub notatek dotyczących workflow.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 0 |
| Wyjście | Nie dotyczy (nie jest wykonywany) |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `stickyTitle` | string | Tytuł wyświetlany u góry sticky note. |
| `stickyColor` | string | Kolor tła: `yellow`, `sky`, `emerald`, `rose`, `violet` lub `zinc`. |
| `note` | string | Treść w formacie Markdown. Kliknij dwukrotnie, aby edytować na canvasie. Obsługuje linki oraz obrazy w formacie markdown, takie jak `![Alt](https://example.com/image.png)`. |

## Przykład

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

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Organizacja workflow](../reference/workflow-organization.md) – Organizacja workflow
