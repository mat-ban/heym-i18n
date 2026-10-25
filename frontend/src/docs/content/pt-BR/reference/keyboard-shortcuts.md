# Atalhos de Teclado

O Heym fornece atalhos de teclado em todo o editor de workflow e canvas para acelerar ações comuns.

## Atalhos Globais do Editor

Esses atalhos estão ativos em qualquer lugar do editor de workflow.

| Atalho | Ação |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Abrir a Command Palette |
| `Ctrl + I` / `Cmd + I` | Alternar o painel do [AI Assistant](./ai-assistant.md) (funciona enquanto você digita) |
| `Ctrl + Enter` / `Cmd + Enter` | Executar o workflow atual |
| `Ctrl + S` / `Cmd + S` | Salvar o workflow |
| `Ctrl + Z` / `Cmd + Z` | Desfazer |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Refazer |
| `Ctrl + Y` / `Cmd + Y` | Refazer (alternativo) |
| `Escape` | Dispensar overlays, diálogos e painéis abertos |

## Atalhos do Canvas

Esses atalhos se aplicam quando o canvas está em foco (nenhuma entrada de texto está ativa).

### Seleção e Navegação

| Atalho | Ação |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Selecionar todos os nós |
| `Shift` (manter pressionado) | Arrastar para selecionar vários nós |
| `Ctrl` / `Cmd` (manter pressionado) | Clicar para adicionar nós individuais à seleção |
| `Escape` | Desselecionar todos os nós; fechar a busca inline de nós |

### Edição de Nós

| Atalho | Ação |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Copiar nó(s) selecionado(s) |
| `Ctrl + X` / `Cmd + X` | Recortar nó(s) selecionado(s) |
| `Ctrl + V` / `Cmd + V` | Colar nó(s) |
| `Delete` ou `Backspace` | Excluir nó(s) e/ou edge(s) selecionado(s) |
| `D` | Alternar nó(s) selecionado(s) entre habilitado / desabilitado |
| `P` | Alternar dados fixados no nó selecionado |

### Busca Inline de Nós

Digitar qualquer caractere imprimível no canvas (quando nenhuma entrada de texto está em foco) abre o popup de busca inline de nós. O caractere digitado se torna o primeiro caractere da consulta de busca.

| Atalho | Ação |
|----------|--------|
| Qualquer caractere imprimível | Abrir a busca inline de nós e começar a digitar |
| `Backspace` | Remover o último caractere da consulta de busca |
| `Escape` | Fechar a busca inline de nós |

## Command Palette (`Ctrl + K`)

A Command Palette está disponível no editor, dashboard, docs e nas visualizações de evals. Ela permite navegar rapidamente para workflows, abas e páginas de documentação sem sair do teclado.

| Atalho | Ação |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Abrir a Command Palette |
| `↑` / `↓` | Navegar pela lista de resultados |
| `Tab` / `Shift + Tab` | Navegar pela lista de resultados |
| `Enter` | Abrir o item selecionado |
| `Escape` | Fechar a palette |

## Atalhos do Dashboard

Esses atalhos estão ativos na aba Workflows quando nenhuma outra entrada de texto está ativa.

| Atalho | Ação |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Focar na busca de workflows |
| `Escape` | Limpar a busca de workflows quando ela contém texto |

## Atalhos do Painel de Propriedades

Esses atalhos estão ativos enquanto um nó está selecionado e o painel de propriedades está aberto.

| Atalho | Ação |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Abrir o sub-workflow vinculado em uma nova aba (somente nó Execute) |

## Atalhos do Diálogo Evaluate

Esses atalhos estão ativos enquanto o diálogo Evaluate está aberto.

| Atalho | Ação |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Aplicar expressão e fechar o diálogo |
| `Ctrl + Z` / `Cmd + Z` | Desfazer alterações no editor de expressões |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Refazer alterações no editor de expressões |
| `Ctrl + Y` / `Cmd + Y` | Refazer alterações no editor de expressões (alternativo) |

## Atalhos de Histórico e Traces

Esses atalhos estão disponíveis no diálogo de Execution History e no painel de Traces.

| Atalho | Ação |
|----------|--------|
| `S` | Alternar a entrada de busca para filtrar entradas |

## Relacionados

- [Recursos do Canvas](./canvas-features.md) – Data pin, habilitar/desabilitar, extrair para sub-workflow
- [Estrutura do Workflow](./workflow-structure.md) – Formato de nó e edge
- [Nó Execute](../nodes/execute-node.md) – Chama sub-workflows (`Ctrl + Shift + O`)
- [Início Rápido](../getting-started/quick-start.md) – Construa seu primeiro workflow

- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
