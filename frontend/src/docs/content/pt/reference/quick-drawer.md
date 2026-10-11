# Quick Drawer

O **Quick Drawer** é um painel lateral direito de execução rápida para Workflows. Ele aparece em páginas autenticadas, como a aba [Workflows](../tabs/workflows-tab.md) do dashboard, Docs e Avaliações.

## Acesso

- Clique no trigger fixo **Quick / Workflows** na borda central direita da tela
- Quando o [Contextual Showcase](./contextual-showcase.md) também estiver disponível, o trigger **Page Guide** dele fica acima do Quick Workflows
- O drawer abre a partir da direita e desloca a página atual para a esquerda com um leve redimensionamento
- Em dispositivos móveis, o Quick Drawer fica oculto
- O drawer não é exibido no editor de Workflow, nas páginas de login/registro, no portal ou nas páginas de revisão HITL

## Busca de Workflows

Utilize o campo de filtro no topo do drawer para buscar Workflows por:

- Nome do Workflow
- Descrição do Workflow

A busca não diferencia maiúsculas de minúsculas e atualiza a lista imediatamente.

## Workflows Fixados

Fixe Workflows para mantê-los no topo do drawer.

- Workflows fixados aparecem em sua própria seção acima da lista completa
- Novos itens fixados são adicionados ao topo
- A ordem dos itens fixados é preservada entre recarregamentos no armazenamento do navegador

## Executando Workflows

Selecione um Workflow para abrir o respectivo formulário de entrada.

- Os campos de entrada são exibidos verticalmente na ordem do drawer
- Clique em **Run Workflow** para executar o Workflow selecionado
- Clique em **Stop Workflow** para cancelar uma execução em andamento a partir do drawer
- Workflows sem campos de entrada também podem ser executados diretamente

O drawer utiliza a mesma API de execução de Workflow que as demais superfícies de execução do Heym, portanto as saídas e o comportamento em tempo de execução permanecem consistentes.

Interromper uma execução a partir do drawer também cancela a execução ativa no backend, incluindo qualquer tarefa do navegador Playwright em andamento para aquela execução de Workflow.

## Progresso e Resultados

Após iniciar uma execução, o drawer exibe:

- Progresso das etapas em streaming para os nós conforme eles iniciam e finalizam
- Status final: `success`, `error` ou `pending`
- Saídas finais em um painel JSON compacto
- Entradas no Histórico marcadas com `Quick Drawer`

`pending` significa que o Workflow está aguardando uma ação posterior, como revisão humana.

## Armazenamento do Navegador

O Quick Drawer armazena preferências pessoais em `localStorage`:

- IDs de Workflows fixados
- Último Workflow selecionado

O drawer **não** persiste valores de entrada nesta versão.

## Escopo

O Quick Drawer é intencionalmente uma superfície de execução leve.

- Incluído: busca, fixação, seleção, entrada, execução, progresso, resultado
- Excluído: criação de Workflow, edição, gerenciamento de pastas e ações no canvas

## Relacionados

- [Aba Workflows](../tabs/workflows-tab.md) – Lista principal de Workflows, pastas e gerenciamento
- [Quick Start](../getting-started/quick-start.md) – Crie e execute seu primeiro Workflow
- [Histórico de Execuções](./execution-history.md) – Revise execuções anteriores
- [Webhooks](./webhooks.md) – Dispare Workflows via HTTP
- [Contextual Showcase](./contextual-showcase.md) – Trilha de orientação em nível de página que complementa o Quick Drawer