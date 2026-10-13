# Quick Drawer

O **Quick Drawer** é um painel lateral direito de execução rápida para workflows. Ele aparece em páginas autenticadas, como a aba [Workflows do dashboard](../tabs/workflows-tab.md), Docs e Evals.

## Acesso

- Clique no acionador fixo **Quick / Workflows** na borda central direita da tela
- Quando o [Contextual Showcase](./contextual-showcase.md) também estiver disponível, seu acionador **Page Guide** fica acima do Quick Workflows
- O drawer abre a partir da direita e desloca a página atual para a esquerda com uma leve reescala
- No mobile, o Quick Drawer fica oculto
- O drawer não é exibido no editor de workflow, nas páginas de login/registro, no portal ou nas páginas de revisão HITL

## Busca de Workflows

Use o campo de filtro no topo do drawer para buscar workflows por:

- Nome do workflow
- Descrição do workflow

A busca não diferencia maiúsculas de minúsculas e atualiza a lista imediatamente.

## Workflows Fixados

Fixe workflows para mantê-los no topo do drawer.

- Workflows fixados aparecem em sua própria seção acima da lista completa
- Novos itens fixados são adicionados ao topo
- A ordem dos itens fixados é preservada entre recarregamentos no armazenamento do navegador

## Executando Workflows

Selecione um workflow para abrir seu formulário de entrada.

- Os campos de entrada são exibidos verticalmente na ordem do drawer
- Clique em **Run Workflow** para executar o workflow selecionado
- Clique em **Stop Workflow** para cancelar uma execução em andamento a partir do drawer
- Workflows sem campos de entrada ainda podem ser executados diretamente
- Um workflow que começa com um [File Upload Trigger](../nodes/file-upload-trigger-node.md) exibe uma área de soltura em vez disso: arraste um arquivo até ela ou clique para escolher um. A área lista os tipos e o tamanho de arquivo aceitos pelo trigger e recusa outros arquivos antes do envio. **Run Workflow** permanece desabilitado até que um arquivo seja escolhido.

O drawer usa a mesma API de execução de workflow que outras superfícies de execução do Heym, portanto as saídas e o comportamento em tempo de execução permanecem consistentes.

Interromper uma execução a partir do drawer também cancela a execução ativa no backend, incluindo qualquer job do navegador Playwright em andamento para aquela execução de workflow.

## Progresso e Resultados

Após iniciar uma execução, o drawer exibe:

- Progresso das etapas em streaming para os nós conforme eles iniciam e terminam
- Status final: `success`, `error` ou `pending`
- Saídas finais em um painel JSON compacto
- Entradas de histórico marcadas com `Quick Drawer`

`pending` significa que o workflow está aguardando uma ação posterior, como revisão humana.

Uma execução com arquivo passa pelo link de upload de uso único do trigger: o painel solicita um link ao workflow, envia o arquivo para ele e mostra o resultado quando o upload retorna. Execuções com arquivo mostram o status final e as saídas, mas não o progresso passo a passo, e também são marcadas como `Quick Drawer` no histórico. O arquivo escolhido é limpo após cada execução, pois cada link aceita apenas um arquivo.

## Armazenamento do Navegador

O Quick Drawer armazena preferências pessoais em `localStorage`:

- IDs de workflows fixados
- Último workflow selecionado

O drawer **não** persiste valores de entrada nesta versão.

## Escopo

O Quick Drawer é intencionalmente uma superfície de execução leve.

- Incluído: busca, fixação, seleção, entrada (incluindo um arquivo), execução, progresso, resultado
- Excluído: criação de workflow, edição, gerenciamento de pastas e ações de canvas

## Relacionados

- [Workflows Tab](../tabs/workflows-tab.md) – Lista principal de workflows, pastas e gerenciamento
- [Quick Start](../getting-started/quick-start.md) – Crie e execute seu primeiro workflow
- [Execution History](./execution-history.md) – Revise execuções anteriores
- [Webhooks](./webhooks.md) – Dispare workflows via HTTP
- [Contextual Showcase](./contextual-showcase.md) – Trilha de orientação em nível de página que complementa o Quick Drawer
