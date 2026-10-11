# Histórico de Execuções

O histórico de execuções regista as execuções de workflows: entradas, saídas, resultados dos nós, estado e origem do trigger. Utilize-o para acompanhar uma execução ativa em produção, inspecionar execuções anteriores, depurar falhas ou voltar a executar com as mesmas entradas através de **Bring to Canvas**.

## Visão geral

Cada execução armazena:

| Campo | Descrição |
|-------|-------------|
| **Inputs** | Corpo do pedido ou entradas da execução (por exemplo, `text` para o nó Input) |
| **Outputs** | Saídas ao nível do workflow |
| **Node results** | Saídas por nó, estado e tempo de execução |
| **Status** | `success`, `error`, `pending`, `skipped` ou `failed` (ver [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Como a execução foi acionada (ver [Triggers](./triggers.md)) |

## Aceder ao Histórico

| Localização | Âmbito |
|----------|-------|
| Barra de ferramentas do **Editor** | Apenas o workflow atual |
| Cabeçalho da vista **Docs** | Apenas o workflow atual |
| Cabeçalho do **Dashboard** (separador Chat) | Todos os workflows + execuções de chat/assistant |
| Cabeçalho da vista **Evals** | Todos os workflows + execuções de chat/assistant |

Clique no botão **History** (ícone de relógio) para abrir a caixa de diálogo.

## Histórico por workflow vs. Histórico global

- **Por workflow** (Editor, Docs): Mostra as execuções do workflow que tem aberto. Utilize **Clear history** para remover as execuções apenas desse workflow.
- **Histórico global** (Dashboard, Evals): Mostra execuções de todos os workflows e sessões de chat/assistant. A cobertura corresponde ao acesso aos workflows: workflows que possui, workflows partilhados diretamente consigo e workflows partilhados com uma equipa à qual pertence. Utilize **Clear all history** para remover todos os registos que possui. O histórico de workflows partilhados será mantido.

## Bring to Canvas

**Bring to Canvas** carrega as entradas e as saídas dos nós de uma execução selecionada para o workflow atual.

### O que carrega

- **Inputs** → Painel de entrada da execução (por exemplo, `text` para o nó Input, ou campos personalizados)
- **Node results** → O painel de resultados de execução mostra as saídas anteriores por nó
- **Execution result** → Estado, saídas e temporização da execução

### Comportamento por contexto

- **No Editor** (histórico por workflow): Aplica-se imediatamente ao workflow aberto e fecha a caixa de diálogo.
- **A partir do Histórico global** (Dashboard/Evals): Navega para o editor do workflow e, em seguida, aplica os dados quando o editor carrega. Disponível apenas para execuções de workflows — não para execuções de chat/assistant.

### Ligação direta para execução

Abrir um workflow em `/workflows/{workflowId}/{executionId}` traz automaticamente essa execução para o canvas — o mesmo que selecionar a execução e escolher **Bring to Canvas**. Isto torna uma execução anterior específica partilhável como URL. Se a execução não for encontrada (id incorreto ou eliminado), o editor recorre ao carregamento do workflow simples.

### Casos de utilização

- Voltar a executar um workflow com as mesmas entradas
- Depurar uma execução falhada inspecionando as entradas e as saídas dos nós
- Comparar saídas entre execuções

## Destaques de Execução

Após uma execução em tempo real — ou após **Bring to Canvas** — aparece um popup dispensável de **Execution Highlights** no **canto superior direito do Canvas**. É uma forma rápida de ver *o que cada nó produziu*, listado de cima para baixo pela ordem de execução. Feche-o com o **✕**; reabre na execução seguinte.

### O que é mostrado

| Registo | Origem | Automático? |
|--------|--------|-------|
| **Input** | Os parâmetros de entrada da execução (nó input/trigger) | Sim |
| **Output** | O resultado do nó de saída — ou, se não existir, a mensagem do último nó | Sim |
| **Agent / LLM** | A saída de cada nó de agente ou LLM | Sim |
| **Output** | Qualquer outro nó com **Highlight Node Output** ativado | Opcional |

Os nós que já são destacados automaticamente (input / output / last / agent / llm) nunca aparecem duas vezes, mesmo que também ative a opção.

### Cada registo

- Mostra `Node — message…` com os primeiros **250 caracteres**; clique numa linha para a expandir e apresentar a **mensagem completa como Markdown**, com um botão **Copy**.
- Um nó que foi executado várias vezes (por exemplo, dentro de um loop) mostra `Node (N)` com um seletor `‹ i / N ›` — escolha qual execução visualizar; o seletor de cada nó é independente.

### Highlight Node Output

Todos os nós **exceto Agent e LLM** têm uma caixa de verificação **Highlight Node Output** no respetivo painel de propriedades (desativada por predefinição). Ative-a para adicionar a saída desse nó ao popup. Aparece um pequeno distintivo ✦ nos nós destacados no canvas. No [workflow DSL](./expression-dsl.md) este é o campo de dados do nó `"highlight": true` (predefinição `false`).

### Nos dashboards

Os cartões de widget do dashboard que executaram um workflow mostram um botão ✦ **Execution highlights** no cabeçalho do cartão; clique nele para abrir o mesmo popup para a execução desse widget, com a saída desenhada do widget como registo em destaque.

## Executar Execuções

Ambos os diálogos de histórico apresentam as **execuções em curso** no topo da lista, antes das execuções anteriores.

- Aparece um indicador rotativo e a etiqueta **Em execução** com a hora de início
- Clique em **Abrir em direto** para associar o editor a essa execução exata sem a reiniciar
- O canvas restaura primeiro os nós que já foram concluídos e, em seguida, recebe os eventos
  `node_start`, `node_complete` e de execução final através de SSE
- O nó atual pulsa no canvas, os nós a jusante mantêm a animação pendente e
  o painel de Depuração acrescenta cada resultado à medida que chega — tal como numa execução iniciada a partir do editor
- Clique em **Cancelar** para parar a execução imediatamente
- Cancelar a partir de qualquer diálogo (Editor ou Dashboard) também fecha o fluxo SSE ativo em qualquer separador do canvas aberto para esse workflow, para que o estado do editor seja reposto de forma limpa
- Após o cancelamento, a entrada em execução desaparece na atualização seguinte; prima **Atualizar** para atualizar a lista manualmente
- Se cancelar uma execução que já terminou, o pedido não tem efeito

O URL em direto é `/workflows/{workflowId}/{executionId}`. O observador é apenas de leitura: sair
do editor apenas desliga esse separador do navegador e nunca interrompe o workflow. Os snapshots
ativos são partilhados através do PostgreSQL, pelo que abrir uma execução continua a funcionar quando o trigger e o pedido
do editor chegam a workers de backend diferentes.

## Recuperação de falhas

Se o servidor for reiniciado (implementação, reinício do contentor ou falha) enquanto um workflow está em execução, o worker dessa execução para a meio. O Heym recupera automaticamente estas execuções interrompidas em vez de as deixar presas como **Em execução**.

- No arranque seguinte, o processo líder eleito deteta execuções órfãs — instantaneamente no caso de um reinício gracioso, ou dentro de ~60 segundos no caso de uma falha abrupta (assim que os heartbeats cessam claramente).
- As execuções recuperadas são **reexecutadas de raiz com os mesmos inputs** (não retomadas do ponto onde pararam), utilizando a definição atual do workflow. Ao concluir, registam uma entrada terminal normal (por exemplo, `success`), pelo que o histórico apresenta a execução como concluída.
- Uma execução é repetida **uma vez**. Se a tentativa de recuperação também for interrompida — ou se o workflow tiver entretanto sido eliminado — a entrada é registada como `failed`.
- Isto funciona da mesma forma num único contentor e em implementações com vários workers; apenas o líder efetua a recuperação, pelo que uma execução nunca é recuperada duas vezes por workers diferentes.

### Alternância de recuperação automática

O painel **Registo de execução** (execução) do editor tem uma caixa de verificação **Recuperação automática**, **ativada por predefinição** por workflow.

- **Ativada**: as execuções interrompidas deste workflow são reexecutadas conforme descrito acima.
- **Desativada**: as execuções interrompidas não são reexecutadas e são registadas com o estado `skipped`.

> As execuções de sub-workflows não são recuperadas de forma independente — são reencaminhadas pela execução principal recuperada. Os triggers com a sua própria reentrega (RabbitMQ, agendado/cron, IMAP) também podem reentregar no reinício, pelo que uma execução recuperada pode ocasionalmente ser executada duas vezes.

## Revisão humana pendente

As execuções que pausam para aprovação [Human-in-the-Loop](./human-in-the-loop.md) são escritas imediatamente no histórico com o estado `pending`.

- O nó de agente pendente armazena um payload de revisão que inclui `reviewUrl`, `draftText` e `expiresAt`
- Quaisquer nós ligados ao handle `review` do agente também podem ser executados antes de o humano responder, e os seus resultados de nó são armazenados na mesma entrada de histórico pendente
- Os diálogos de histórico apresentam a ligação de revisão para que os proprietários a possam copiar ou abrir
- Os diálogos de histórico e o painel de Depuração do editor apresentam a decisão humana final após a retoma da execução
- Quando um revisor aceita, edita ou recusa o rascunho, a mesma entrada de histórico é atualizada com o resultado final da execução
- Se a mesma execução pausar para HITL mais do que uma vez, a entrada de histórico mantém-se a mesma, enquanto cada checkpoint recebe a sua própria ligação de revisão de utilização única

Isto é especialmente útil para execuções de portal e workflows de longa duração que podem aguardar horas ou dias antes de continuar.

## Copiar

Utilize **Copiar** junto a Inputs ou Outputs para copiar o JSON para a área de transferência.

## Limpar histórico

- **Por workflow**: No diálogo de histórico do Editor, clique em **Limpar histórico** para remover as execuções do workflow atual.
- **Todo o histórico**: No diálogo de histórico do Dashboard/Evals, clique em **Limpar todo o histórico** para remover todos os registos de execução que lhe pertencem. As execuções de workflows partilhados são mantidas. Esta ação não pode ser anulada.

## Detalhes da linha temporal de execução

Quando o **Registo de execução** do editor está aberto, clique no botão do temporizador para apresentar a linha temporal de execução. Selecione um intervalo para abrir um inspetor de detalhes em linha que assume a área das linhas. Apresenta o estado do passo selecionado, a duração, o número de tentativas, informações de repetição, erros, o ID de rastreio e uma pré-visualização compacta do output. Os outputs de objetos e arrays utilizam o mesmo visualizador `JsonTree` que o resto do painel de Depuração; os valores escalares utilizam uma pré-visualização de texto. Quando um passo produz imagens (capturas de ecrã do Playwright, imagens geradas, ficheiros de imagem), estas aparecem como miniaturas acima do output, e o JSON apresenta um marcador de posição curto em vez do base64 em bruto. Clique numa miniatura para a abrir numa lightbox; os botões de seta ou as teclas ←/→ percorrem todas as imagens da execução, com um contador como `2 / 5`. Utilize **Abrir rastreio** para spans de LLM e Agente quando estiver disponível um ID de rastreio.

## Detalhe do nó em dispositivos móveis

Num telefone, o editor apresenta uma árvore de workflow em ecrã inteiro em vez do canvas de forma livre. Toque num nó da árvore com um resultado registado para abrir a respetiva execução como detalhe em ecrã inteiro. A vista disponibiliza separadores distintos de **Dados de entrada**, **Dados de saída** e **Erros**. O separador de saída apresenta o resultado registado e oferece **Copiar saída**; o separador de entrada mostra a configuração do nó selecionado e o separador de erros mostra o erro registado quando o nó falhou. Utilize **Voltar ao workflow** ou o botão de fechar para regressar à árvore.

Os diálogos de histórico do canvas e do dashboard mantêm os controlos de execução numa única linha e colocam os filtros de etiquetas e de instâncias disponíveis numa grelha responsiva. Os respetivos menus de filtros utilizam o mesmo seletor integrado na aplicação, pelo que a marca de seleção apresenta uma margem e uma linha de base consistentes com todas as etiquetas de opção.

## Relacionado

- [Triggers](./triggers.md) – Como os workflows são iniciados; o histórico registra `trigger_source` (incluindo `board` para execuções iniciadas por movimentos de cartões do [Board](../tabs/board-tab.md) e acompanhamentos)
- [Human-in-the-Loop](./human-in-the-loop.md) – URLs de revisão pendentes e comportamento de retomada
- [Edit History](./edit-history.md) – Controlo de versões para gravações de workflow (reverter, diff)
- [Quick Start](../getting-started/quick-start.md) – Crie e execute o seu primeiro workflow
- [Workflows Tab](../tabs/workflows-tab.md) – Crie e faça a gestão de workflows
