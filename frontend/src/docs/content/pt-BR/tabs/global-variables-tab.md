# Aba Variables

A aba **Variables** gerencia o **Global Variable Store** – dados persistentes de chave-valor compartilhados entre todos os seus workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Assistir à demonstração de Variables</a></p>

## Visão Geral

- Criar, editar e excluir variáveis globais
- As variáveis são de escopo do usuário e persistem entre execuções de workflow
- Referencie em expressões via `$global.variableName`

## Criando uma Variável

1. Clique em **New Variable**
2. Insira um **nome** (usado em expressões)
3. Defina o **valor** (string, number, boolean, array ou object)
4. Escolha o **tipo de valor** (Auto, String, Number, Boolean, Array, Object)

## Editando e Excluindo

- **Editar** – Clique no ícone de edição na linha da variável
- **Excluir** – Clique no ícone de lixeira; workflows que a utilizam precisarão de uma substituição
- **Exclusão em massa** – Selecione várias variáveis e use **Delete selected**

## Usando em Workflows

Referencie variáveis em qualquer expressão:

```
$global.environment
$global.settings.baseUrl
```

Você também pode definir variáveis globais a partir de um [Nó Variable](../nodes/variable-node.md) habilitando **Store in Global Variable Store**.

## Relacionados

- [Global Variables](../reference/global-variables.md) – Guia de referência
- [Nó Variable](../nodes/variable-node.md) – Defina variáveis com `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Sintaxe `$global`
- [Aba Chat](./chat-tab.md) – O Chat pode acessar variáveis globais
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para superfícies do dashboard
