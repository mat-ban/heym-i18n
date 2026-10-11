# Sticky Note

O nó **Sticky Note** adiciona notas markdown avançadas ao canvas. Ele não é executado — utilize-o para documentação, instruções, imagens de referência ou notas de workflow.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 0 |
| Saída | N/A (não executado) |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `stickyTitle` | string | Título de exibição mostrado no topo da sticky note. |
| `stickyColor` | string | Cor de fundo: `yellow`, `sky`, `emerald`, `rose`, `violet` ou `zinc`. |
| `note` | string | Conteúdo Markdown. Dê um duplo clique para editar no canvas. Suporta links e markdown de imagem como `![Alt](https://example.com/image.png)`. |

## Exemplo

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

## Relacionados

- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Organização de workflow](../reference/workflow-organization.md) – Organize workflows