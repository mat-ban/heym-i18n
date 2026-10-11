# Sticky Note

El nodo **Sticky Note** añade notas Markdown enriquecidas al canvas. No se ejecuta: utilícelo para documentación, instrucciones, imágenes de referencia o notas del workflow.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 0 |
| Salida | N/A (no se ejecuta) |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `stickyTitle` | string | Título visible que se muestra en la parte superior de la sticky note. |
| `stickyColor` | string | Color de fondo: `yellow`, `sky`, `emerald`, `rose`, `violet` o `zinc`. |
| `note` | string | Contenido Markdown. Haga doble clic para editar en el canvas. Admite enlaces e imágenes en Markdown como `![Alt](https://example.com/image.png)`. |

## Ejemplo

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

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Organización de workflows](../reference/workflow-organization.md) – Organice los workflows