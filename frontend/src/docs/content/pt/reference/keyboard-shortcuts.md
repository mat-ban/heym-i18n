# Atalhos de Teclado

O Heym fornece atalhos de teclado no editor de workflow e no canvas para acelerar ações comuns.

## Atalhos Globais do Editor

Estes atalhos estão ativos em qualquer lugar do editor de workflow.

| Atalho | Ação |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Abrir a Paleta de Comandos |
| `Ctrl + I` / `Cmd + I` | Alternar o painel do [Assistente de IA](./ai-assistant.md) (funciona durante a digitação) |
| `Ctrl + Enter` / `Cmd + Enter` | Executar o workflow atual |
| `Ctrl + S` / `Cmd + S` | Salvar o workflow |
| `Ctrl + Z` / `Cmd + Z` | Desfazer |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Refazer |
| `Ctrl + Y` / `Cmd + Y` | Refazer (alternativo) |
| `Escape` | Dispensar sobreposições, diálogos e painéis abertos |

## Atalhos do Canvas

Estes atalhos aplicam-se quando o canvas está em foco (nenhuma entrada de texto está ativa).

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
| `Ctrl + C` / `Cmd + C` | Copiar o(s) nó(s) selecionado(s) |
| `Ctrl + X` / `Cmd + X` | Recortar o(s) nó(s) selecionado(s) |
| `Ctrl + V` / `Cmd + V` | Colar o(s) nó(s) |
| `Delete` ou `Backspace` | Excluir o(s) nó(s) e/ou a(s) aresta(s) selecionado(s) |
| `D` | Alternar o(s) nó(s) selecionado(s) entre habilitado / desabilitado |
| `P` | Alternar os dados fixados no nó selecionado |

### Busca Inline de Nós

Digitar qualquer caractere imprimível no canvas (quando nenhuma entrada de texto está em foco) abre o popup de busca inline de nós. O caractere digitado torna-se o primeiro caractere da consulta de busca.

| Atalho | Ação |
|----------|--------|
| Qualquer caractere imprimível | Abrir a busca inline de nós e começar a digitar |
| `Backspace` | Remover o último caractere da consulta de busca |
| `Escape` | Fechar a busca inline de nós |

## Paleta de Comandos (`Ctrl + K`)

A Paleta de Comandos está disponível no editor, no dashboard, na documentação e nas visualizações de avaliações. Ela permite navegar rapidamente para workflows, abas e páginas de documentação sem sair do teclado.

| Atalho | Ação |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Abrir a Paleta de Comandos |
| `↑` / `↓` | Navegar pela lista de resultados |
| `Tab` / `Shift + Tab` | Navegar pela lista de resultados |
| `Enter` | Abrir o item selecionado |
| `Escape` | Fechar a paleta |

## Atalhos do Dashboard

Estes atalhos estão ativos na aba Workflows quando nenhuma outra entrada de texto está ativa.

| Atalho | Ação |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Focar a busca de workflows |
| `Escape` | Limpar a busca de workflows quando ela contém texto |

## Atalhos do Painel de Propriedades

Estes atalhos estão ativos enquanto um nó está selecionado e o painel de propriedades está aberto.

| Atalho | Ação |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Abrir o sub-workflow vinculado em uma nova aba (somente Nó Execute) |

## Atalhos do Diálogo de Avaliação

Estes atalhos estão ativos enquanto o diálogo de Avaliação está aberto.

| Atalho | Ação |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Aplicar a expressão e fechar o diálogo |
| `Ctrl + Z` / `Cmd + Z` | Desfazer alterações no editor de expressões |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Refazer alterações no editor de expressões |
| `Ctrl + Y` / `Cmd + Y` | Refazer alterações no editor de expressões (alternativo) |

## Atalhos de Histórico e Execuções

Estes atalhos estão disponíveis no diálogo de Histórico de Execuções e no painel de Execuções.

| Atalho | Ação |
|----------|--------|
| `S` | Alternar a entrada de busca para filtrar entradas |

## Relacionados

- [Recursos do Canvas](./canvas-features.md) – Fixação de dados, habilitar/desabilitar, extrair para sub-workflow
- [Estrutura do Workflow](./workflow-structure.md) – Formato de nós e arestas
- [Nó Execute](../nodes/execute-node.md) – Chama sub-workflows (`Ctrl + Shift + O`)
- [Início Rápido](../getting-started/quick-start.md) – Construa seu primeiro workflow