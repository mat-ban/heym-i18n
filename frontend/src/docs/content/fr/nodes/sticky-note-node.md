# Sticky Note

Le nœud **Sticky Note** ajoute des notes markdown enrichies au canvas. Il n'est pas exécuté : utilisez-le pour la documentation, les instructions, les images de référence ou les notes de workflow.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 0 |
| Sortie | N/A (non exécuté) |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `stickyTitle` | string | Titre affiché en haut de la note autocollante. |
| `stickyColor` | string | Couleur d'arrière-plan : `yellow`, `sky`, `emerald`, `rose`, `violet` ou `zinc`. |
| `note` | string | Contenu Markdown. Double-cliquez pour modifier sur le canvas. Prend en charge les liens et le markdown d'image tel que `![Alt](https://example.com/image.png)`. |

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

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Organisation des workflows](../reference/workflow-organization.md) – Organiser les workflows
