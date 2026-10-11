# Nota Adesiva

O nó **Sticky Note** adiciona notas em markdown avançado ao canvas. Ele não é executado — utilize-o para documentação, instruções, imagens de referência ou anotações de workflow.

## Visão Geral

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
| `note` | string | Conteúdo em Markdown. Dê um duplo clique para editar no canvas. Suporta links e markdown de imagem como `![Alt](https://example.com/image.png)`. |

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

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Workflow Organization](../reference/workflow-organization.md) – Organize workflows
