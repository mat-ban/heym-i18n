# Separador Variáveis

O separador **Variáveis** gere o **Armazenamento Global de Variáveis** – dados persistentes de chave-valor partilhados entre todos os seus workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Ver demonstração de Variáveis</a></p>

## Visão Geral

- Criar, editar e eliminar variáveis globais
- As variáveis são de âmbito de utilizador e persistem entre execuções de workflows
- Referenciar em expressões através de `$global.variableName`

## Criar uma Variável

1. Clique em **Nova Variável**
2. Introduza um **nome** (utilizado em expressões)
3. Defina o **valor** (string, number, boolean, array ou object)
4. Escolha o **tipo de valor** (Auto, String, Number, Boolean, Array, Object)

## Editar e Eliminar

- **Editar** – Clique no ícone de edição na linha da variável
- **Eliminar** – Clique no ícone do caixote do lixo; os workflows que a utilizam necessitarão de uma substituição
- **Eliminação em massa** – Selecione várias variáveis e utilize **Eliminar selecionadas**

## Utilizar em Workflows

Referencie variáveis em qualquer expressão:

```
$global.environment
$global.settings.baseUrl
```

Também pode definir variáveis globais a partir de um [Nó de variável](../nodes/variable-node.md) ativando **Armazenar no Armazenamento Global de Variáveis**.

## Relacionado

- [Variáveis Globais](../reference/global-variables.md) – Guia de referência
- [Nó de Variável](../nodes/variable-node.md) – Definir variáveis com `isGlobal`
- [DSL de Expressões](../reference/expression-dsl.md) – Sintaxe `$global`
- [Separador Chat](./chat-tab.md) – O Chat pode aceder a variáveis globais
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de página para superfícies do dashboard
