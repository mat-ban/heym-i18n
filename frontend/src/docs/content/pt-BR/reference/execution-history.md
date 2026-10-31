# Histórico de Execução

O histórico de execução registra as execuções do Workflow: entradas, saídas, resultados dos Nós, status e origem do Trigger. Use-o para acompanhar uma execução ativa em produção, inspecionar execuções anteriores, depurar falhas ou reexecutar com as mesmas entradas via **Bring to Canvas**.

## Visão Geral

Cada execução armazena:

| Campo | Descrição |
|-------|-----------|
| **Inputs** | Corpo da requisição ou entradas da execução (ex.: `text` para o Nó Input) |
| **Outputs** | Saídas no nível do Workflow |
| **Node results** | Saídas por Nó, status e tempo de execução |
| **Status** | `success`, `error`, `pending`, `skipped` ou `failed` (consulte [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Como a execução foi disparada (consulte [Triggers](./triggers.md)) |

## Acessando o Histórico

| Local | Escopo |
|-------|--------|
| Barra de ferramentas do **Editor** | Apenas o Workflow atual |
| Cabeçalho da visualização **Docs** | Apenas o Workflow atual |
| Cabeçalho do **Dashboard** (aba Chat) | Todos os Workflows + execuções de chat/assistente |
| Cabeçalho da visualização **Evals** | Todos os Workflows + execuções de chat/assistente |

Clique no botão **History** (ícone de relógio) para abrir o diálogo.

## Histórico por Workflow vs. Todos

- **Por Workflow** (Editor, Docs): Exibe as execuções do Workflow que você tem aberto. Use **Clear history** para remover as execuções apenas desse Workflow.
- **All History** (Dashboard, Evals): Exibe execuções de todos os Workflows e sessões de chat/assistente. A cobertura corresponde ao acesso ao Workflow: Workflows que você possui, Workflows compartilhados diretamente com você e Workflows compartilhados com uma equipe à qual você pertence. Use **Clear all history** para remover todos os registros que você possui. O histórico de Workflows compartilhados será mantido.

## Bring to Canvas

**Bring to Canvas** carrega as entradas e as saídas dos Nós de uma execução selecionada no Workflow atual.

### O que é carregado

- **Inputs** → Painel de entrada da execução (ex.: `text` para o Nó Input, ou campos personalizados)
- **Node results** → O painel de resultado da execução exibe as saídas anteriores por Nó
- **Execution result** → Status, saídas e tempo da execução

### Comportamento por contexto

- **No Editor** (histórico por Workflow): Aplica imediatamente ao Workflow aberto e fecha o diálogo.
- **A partir do All History** (Dashboard/Evals): Navega até o editor do Workflow e, em seguida, aplica os dados quando o editor carrega. Disponível apenas para execuções de Workflow — não para execuções de chat/assistente.

### Deep link de execução

Abrir um Workflow em `/workflows/{workflowId}/{executionId}` traz automaticamente essa execução para o Canvas — o mesmo que selecionar a execução e escolher **Bring to Canvas**. Isso torna uma execução passada específica compartilhável como URL. Se a execução não for encontrada (id incorreto ou excluído), o editor recorre ao carregamento do Workflow simples.

### Casos de uso

Pressione Ctrl/Cmd+clique em uma execução em qualquer uma das listas de histórico para abrir esse link direto em uma nova aba do navegador. A aba atual e o diálogo aberto permanecem inalterados. As execuções de chat e assistente não têm workflow, portanto o atalho apenas as seleciona, como um clique comum.

- Reexecutar um Workflow com as mesmas entradas
- Depurar uma execução com falha inspecionando entradas e saídas dos Nós
- Comparar saídas entre execuções

## Perguntar à IA

Ambas as caixas de diálogo de histórico têm um botão **Perguntar à IA** (ícone de brilho) ao lado do título. Abre a [aba Chat](../tabs/chat-tab.md#asking-about-a-run) em uma nova conversa com o workflow e a execução selecionada anexada como chips removíveis. Pergunte por que a execução foi lenta, o que falhou ou peça ao Chat para corrigir o workflow. O Chat lê exatamente essa execução, incluindo o rastreamento e erros por nó.

Na caixa de diálogo All History, **Perguntar à IA** só aparece enquanto uma execução de workflow estiver selecionada; as execuções de chat e assistente não o mostram.

## Linha do tempo de execução

No detalhe da execução, o botão **Linha do tempo** (ícone de temporizador) ao lado de **Expandir tudo** substitui a lista de **Etapas** por uma linha do tempo de spans. Enquanto a linha do tempo é exibida, o mesmo botão indica **Logs**; clique nele para voltar à lista. No All History, o botão aparece apenas para execuções de workflow. A linha do tempo desenha uma barra por nó no momento em que foi iniciado, para que veja quanto tempo durou cada nó e quais foram executados em paralelo. Passe o cursor sobre uma barra para ver sua duração; clique nela para abrir o mesmo inspetor de detalhes da [linha do tempo de execução](#execution-timeline-details) do editor. A visualização escolhida se mantém enquanto a caixa de diálogo estiver aberta.

As execuções registradas antes de os horários de início dos nós serem armazenados são organizadas sucessivamente por duração.

## Execution Highlights

Após uma execução ao vivo — ou após **Bring to Canvas** — um popup dispensável de **Execution Highlights** aparece no **canto superior direito do Canvas**. É uma forma rápida de ver *o que cada Nó produziu*, listado de cima para baixo na ordem de execução. Feche-o com o **✕**; ele reabre na próxima execução.

### O que é exibido

| Registro | Origem | Automático? |
|----------|--------|-------------|
| **Input** | Os parâmetros de entrada da execução (Nó de input/trigger) | Sim |
| **Output** | O resultado do Nó de output — ou, se não houver, a mensagem do último Nó | Sim |
| **Agent / LLM** | A saída de cada Nó de agente ou LLM | Sim |
| **Output** | Qualquer outro Nó com **Highlight Node Output** habilitado | Opcional |

Nós que já são destacados automaticamente (input / output / last / agent / llm) nunca aparecem duas vezes, mesmo que você também habilite a opção.

### Cada registro

- Exibe `Node — message…` com os primeiros **250 caracteres**; clique em uma linha para expandi-la e renderizar a **mensagem completa como Markdown**, com um botão **Copy**.
- Um Nó que foi executado várias vezes (ex.: dentro de um loop) exibe `Node (N)` com um seletor `‹ i / N ›` — escolha qual execução visualizar; o seletor de cada Nó é independente.

### Highlight Node Output

Todo Nó **exceto Agent e LLM** possui uma caixa de seleção **Highlight Node Output** em seu painel de propriedades (desativada por padrão). Habilite-a para adicionar a saída desse Nó ao popup. Um pequeno selo ✦ aparece nos Nós destacados no Canvas. No [workflow DSL](./expression-dsl.md), este é o campo de dados do Nó `"highlight": true` (o padrão é `false`).

### Em dashboards

Os cards de widget do Dashboard que executaram um Workflow exibem um botão ✦ **Execution highlights** no cabeçalho do card; clique nele para abrir o mesmo popup para a execução desse widget, com a saída desenhada pelo widget como o registro em destaque.
## Executando Execuções

Ambos os diálogos de histórico mostram **execuções em andamento no momento** no topo da lista, antes das execuções anteriores.

- Um indicador giratório e o rótulo **Running** aparecem junto com o horário de início
- Clique em **Open live** para conectar o editor a essa execução exata sem reiniciá-la
- O canvas primeiro restaura os nós que já foram concluídos e, em seguida, recebe
  eventos `node_start`, `node_complete` e de execução final via SSE
- O nó atual pulsa no canvas, os nós downstream mantêm sua animação pendente e
  o painel Debug adiciona cada resultado conforme ele chega — assim como uma execução iniciada pelo editor
- Clique em **Cancel** para interromper a execução imediatamente
- Cancelar a partir de qualquer diálogo (Editor ou Dashboard) também fecha o stream SSE ativo em qualquer aba de canvas aberta para esse workflow, de modo que o estado do editor é redefinido de forma limpa
- Após o cancelamento, a entrada em execução desaparece na próxima atualização; pressione **Refresh** para atualizar a lista manualmente
- Se você cancelar uma execução que já foi concluída, a requisição não terá efeito

Execuções aguardando por um [slot de simultaneidade](./webhooks.md#concurrency-limit-and-queued-runs) são listadas na mesma seção com a etiqueta **Queued 2/5**, sua posição na fila e o tamanho da fila. Elas não têm o botão **Open live** porque nada está em execução ainda; **Cancel** remove a execução em espera da fila e a registra como `cancelled`. Uma execução que esperou mais do que o tempo máximo de espera do workflow é registrada como `expired`, e uma execução rejeitada por fila cheia como `queue_full`; ambas têm seu próprio badge na lista de execuções.

A URL ao vivo é `/workflows/{workflowId}/{executionId}`. O observador é somente leitura: sair
do editor apenas desconecta aquela aba do navegador e nunca interrompe o workflow. Os snapshots
ativos são compartilhados através do PostgreSQL, portanto abrir uma execução ainda funciona quando o trigger e a requisição do editor chegam a workers de backend diferentes.

## Recuperação de Falhas

Se o servidor reiniciar (deploy, reinício de container ou falha) enquanto um workflow estiver em execução, o worker dessa execução para no meio do processo. O Heym recupera automaticamente essas execuções interrompidas em vez de deixá-las travadas como **Running**.

- Na próxima inicialização, o processo líder eleito detecta execuções órfãs — instantaneamente para um reinício gracioso, ou dentro de ~60 segundos para uma falha abrupta (assim que os heartbeats cessam claramente).
- As execuções recuperadas são **reexecutadas do zero com as mesmas entradas** (não retomadas de onde pararam), usando a definição atual do workflow. Ao concluir, registram uma entrada terminal normal (por exemplo, `success`), de modo que o histórico mostra a execução como concluída.
- Uma execução é repetida **uma vez**. Se a tentativa de recuperação também for interrompida — ou se o workflow tiver sido excluído nesse meio-tempo — a entrada é registrada como `failed`.
- Isso funciona da mesma forma em um único container e em implantações com múltiplos workers; apenas o líder realiza a recuperação, portanto uma execução nunca é recuperada duas vezes por workers diferentes.

### Alternância de recuperação automática

O painel **Execution Log** (execução) do editor possui uma caixa de seleção **Auto-recover**, **ativada por padrão** por workflow.

- **Ativada**: execuções interrompidas deste workflow são reexecutadas conforme descrito acima.
- **Desativada**: execuções interrompidas não são reexecutadas e são registradas com o status `skipped`.

> Execuções de sub-workflow não são recuperadas de forma independente — elas são reconduzidas pela execução pai recuperada. Triggers com sua própria reentrega (RabbitMQ, agendado/cron, IMAP) também podem reentregar na reinicialização, portanto uma execução recuperada pode ocasionalmente ser executada duas vezes.

## Revisão Humana Pendente

Execuções que pausam para aprovação de [Human-in-the-Loop](./human-in-the-loop.md) são gravadas no histórico imediatamente com o status `pending`.

- O nó agente pendente armazena um payload de revisão incluindo `reviewUrl`, `draftText` e `expiresAt`
- Quaisquer nós conectados ao handle `review` do agente também podem ser executados antes que o humano responda, e seus resultados de nó são armazenados na mesma entrada de histórico pendente
- Os diálogos de histórico mostram o link de revisão para que os proprietários possam copiá-lo ou abri-lo
- Os diálogos de histórico e o painel Debug do editor mostram a decisão humana final após a execução ser retomada
- Quando um revisor aceita, edita ou recusa o rascunho, a mesma entrada de histórico é atualizada com o resultado final da execução
- Se a mesma execução pausar para HITL mais de uma vez, a entrada de histórico permanece a mesma enquanto cada checkpoint recebe seu próprio link de revisão de uso único

Isso é especialmente útil para execuções de portal e workflows de longa duração que podem aguardar horas ou dias antes de continuar.

## Copiar

Use **Copy** ao lado de Inputs ou Outputs para copiar o JSON para a área de transferência.

## Limpar Histórico

- **Por workflow**: No diálogo de histórico do Editor, clique em **Clear history** para remover as execuções do workflow atual.
- **Todo o Histórico**: No diálogo de histórico do Dashboard/Evals, clique em **Clear all history** para remover todos os registros de execução que você possui. Execuções de workflows compartilhados são mantidas. Esta ação não pode ser desfeita.

## Detalhes da linha do tempo de execução

Quando o **Execution Log** do editor estiver aberto, clique no botão de cronômetro para exibir a linha do tempo da execução. Selecione um intervalo para abrir um inspetor de detalhes em linha que assume a área das linhas. Ele mostra o status da etapa selecionada, duração, contagem de tentativas, informações de retry, erros, trace ID e uma prévia compacta da saída. Saídas de objeto e array usam o mesmo visualizador `JsonTree` do restante do painel Debug; valores escalares usam uma prévia de texto. Quando uma etapa produz imagens (capturas de tela do Playwright, imagens geradas, arquivos de imagem ou imagens em base64 no corpo da requisição, encontradas em qualquer lugar na saída), elas aparecem como miniaturas acima da saída, e o JSON mostra um pequeno placeholder no lugar do base64 bruto. Clique em uma miniatura para abri-la em um lightbox; os botões de seta ou as teclas ←/→ percorrem todas as imagens da execução, com um contador como `2 / 5`. Use **Open trace** para spans de LLM e Agent quando um trace ID estiver disponível.
## Detalhes do nó no celular

Em um celular, o editor exibe uma árvore de Workflow em tela cheia em vez do canvas de formato livre. Toque em um nó da árvore com um resultado registrado para abrir sua execução como um detalhe em tela cheia. A visualização oferece abas separadas de **Input Data**, **Output Data** e **Errors**. A aba de output exibe o resultado registrado e oferece **Copy Output**; a aba de input mostra a configuração do nó selecionado, e a aba de errors mostra o erro registrado quando o nó falhou. Use **Back to workflow** ou o botão de fechar para retornar à árvore.

Os diálogos de histórico do canvas e do dashboard mantêm seus controles de execução em uma única linha e posicionam os filtros disponíveis de tag e instância em uma grade responsiva. Seus menus de filtro usam o mesmo seletor interno do aplicativo, de modo que a marca de seleção escolhida tenha uma margem e uma linha de base consistentes com todos os rótulos de opção.

## Relacionados

- [Triggers](./triggers.md) – Como os Workflows são iniciados; o histórico registra `trigger_source` (incluindo `board` para execuções iniciadas por movimentações de cards do [Board](../tabs/board-tab.md) e follow-ups)
- [Human-in-the-Loop](./human-in-the-loop.md) – URLs de revisão pendentes e comportamento de retomada
- [Edit History](./edit-history.md) – Controle de versão para salvamentos de Workflow (reverter, diff)
- [Quick Start](../getting-started/quick-start.md) – Crie e execute seu primeiro Workflow
- [Workflows Tab](../tabs/workflows-tab.md) – Crie e gerencie Workflows
