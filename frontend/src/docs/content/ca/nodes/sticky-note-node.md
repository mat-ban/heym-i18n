# Nota adhesiva

El node **Nota adhesiva** afegeix notes Markdown enriquides al canvas. No s'executa—utilitzeu-lo per a documentació, instruccions, imatges de referència o notes del workflow.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 0 |
| Sortida | N/A (no s'executa) |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `stickyTitle` | string | Títol de visualització mostrat a la part superior de la nota adhesiva. |
| `stickyColor` | string | Color de fons: `yellow`, `sky`, `emerald`, `rose`, `violet` o `zinc`. |
| `note` | string | Contingut Markdown. Feu doble clic per editar-lo al canvas. Admet enllaços i Markdown d'imatges com ara `![Alt](https://example.com/image.png)`. |

## Exemple

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

## Relacionat

- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [Organització de workflows](../reference/workflow-organization.md) – Organitzeu els workflows