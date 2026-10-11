# Board

A aba **Board** é um kanban agêntico. O trabalho avança pelas colunas, e cada
coluna pode executar Workflows do Heym. Um card não é apenas uma tarefa — é um job
agêntico persistente que carrega contexto, histórico de conversa, estado de execução,
saídas e execuções de Workflow.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Boards e colunas

- Você pode criar quantos boards precisar. Um novo board começa com as colunas
  padrão **Backlog → Planning → Development → Done**.
- Todo board precisa de um **Agentic Kanban Model** (uma credencial mais um modelo). É
  obrigatório — a janela de novo board não cria um board sem ele, e um board
  que não tenha nenhum mantém suas ações desabilitadas — porque é o modelo que mapeia cada
  card para as entradas dos Workflows que ele executa e converte suas saídas de volta em
  texto legível.
- O ícone de engrenagem no cabeçalho do board abre as configurações do board: nome, descrição
  (exibida abaixo do cabeçalho) e o Agentic Kanban Model.
- As colunas são totalmente editáveis: adicione, renomeie, altere a cor, reordene ou exclua-as
  nas configurações da coluna (uma coluna precisa estar vazia antes de poder ser excluída).
- Os cards são ordenados verticalmente por prioridade — arraste para reordenar.
- Você também pode criar um card na [aba Chat](./chat-tab.md) com um pedido em
  linguagem natural. O Chat solicita que você selecione um board quando necessário e sempre adiciona o card à
  primeira coluna desse board.

## Compartilhando um board

As configurações do board também permitem compartilhá-lo com **usuários** (por email) e com
**equipes**, com permissão de `read` ou `write`:

- **read** — o board e seus cards ficam visíveis, mas nada pode ser alterado: nenhum novo
  card, nenhuma movimentação, nenhum comentário, nenhuma execução.
- **write** — uso completo do board: cards, movimentações, comentários e execuções.
- Apenas o **owner** vê a engrenagem e os botões de exclusão, e apenas o owner pode alterar as
  configurações do board, seu Agentic Kanban Model ou seus compartilhamentos.

As chains em um board compartilhado sempre são executadas com as credenciais e o Agentic Kanban
Model do **owner**, então os colaboradores nunca precisam das suas próprias.

## Anexos de card

Abra um card e use **Attach file** para adicionar arquivos a ele — solte-os na caixa ou escolha-os
com o botão, e remova-os da mesma lista. Os anexos são armazenados no
[Drive](./drive-tab.md).

Toda execução **resolve os anexos antes que os Workflows comecem**, por tipo:

- **Documentos** (pdf, markdown, csv, json, text) são extraídos para texto, limitados a 20.000
  caracteres por arquivo, no campo `text` do anexo.
- **Imagens** são entregues como uma `url` que o caminho de visão carrega diretamente (a entrada de imagem de um Nó LLM
  a aceita como está).
- **Qualquer outra coisa** é repassada como uma referência simples (`name`, `url`, `mime_type`).

Os Workflows os leem em `$input.card.attachments` (e sempre em `$input.board.attachments`,
independentemente do que o mapper mapeou). O Agentic Kanban Model também vê o texto extraído e as URLs
das imagens, então ele pode mapear um anexo diretamente para o campo que um Workflow espera.

## Chains de Workflow das colunas

Cada coluna pode ser configurada com uma **lista ordenada de Workflows** (a chain).
Quando um card se move para uma coluna que tem uma chain:

1. A chain começa automaticamente em segundo plano — a movimentação em si nunca espera.
2. Os Workflows são executados **sequencialmente**. A saída de cada Workflow é anexada ao contexto
   do card antes que o próximo comece.
3. Se um Workflow falhar, a chain para: os elos restantes são ignorados e o
   card fica **vermelho**.
4. Quando todos os elos têm sucesso, o card fica **verde**. Enquanto a chain está em execução,
   o card pulsa em **âmbar**; uma execução pausada para revisão humana mostra um estado âmbar
   estático.

As execuções são registradas no [Execution History](../reference/execution-history.md) com a
origem de Trigger `board`, e cada card mantém sua própria lista de execuções com as saídas
e erros por Workflow. Abra um card enquanto um Workflow está em execução e escolha **Open live** ao lado
da execução para anexar o editor àquela execução exata. A mesma animação de canvas, os logs de Debug
incrementais e o resultado final aparecem sem iniciar uma segunda execução.
## O que os workflows recebem

A cadeia passa um payload padrão como entrada do workflow. Leia-o com
[expressões](../reference/expression-dsl.md) normais, como `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — todos os comentários no card, do mais antigo para o mais recente.
- `history` — a linha do tempo completa de atividades (comentários, movimentações, outputs), limitada às
  200 entradas mais recentes.
- `previous_outputs` — outputs de execuções concluídas anteriormente (colunas anteriores e
  rodadas de follow-up).
- `chain.previous_workflow_outputs` — outputs dos elos anteriores na cadeia
  *atual*.
- Em rodadas de follow-up, `move` é `null` e `rerun` é `true`.

## O loop de planejamento (rodadas de follow-up)

Um padrão comum é colocar um workflow de planejamento na **segunda coluna** (por padrão
chamada Planning — o nome não importa; o slot importa). Esse workflow enriquece o
card e faz perguntas de follow-up:

1. Mova um card para a segunda coluna — o workflow grava um plano enriquecido e suas
   perguntas de volta no card como um output.
2. Responda na thread de comentários do card. A resposta libera o card: ele avança para
   a próxima coluna, que o assume com a resposta em contexto. A cadeia da segunda coluna
   não é executada novamente.
3. Para melhorar o plano no local, em vez disso, pressione **Run follow-up round**. A mesma
   cadeia é executada novamente com todo o contexto acumulado, e então o card aguarda nessa coluna
   até que você adicione um comentário para liberá-lo.

O gate de planejamento é posicional, não baseado em nome: a coluna mais à esquerda e a coluna
imediatamente à sua direita nunca avançam por conta própria — elas executam sua cadeia e aguardam
ali por você (um comentário libera a segunda coluna). A partir da terceira coluna, uma
cadeia bem-sucedida avança o card para a direita por conta própria, até a última
coluna. Renomear ou remover o rótulo padrão "Planning" não altera qual slot
é o gate. Um card só pode ter uma execução ativa por vez.

## Human-in-the-Loop e perguntas do Codex

Se um workflow da cadeia pausar — em um nó
[Human-in-the-Loop](../reference/human-in-the-loop.md), em uma ferramenta HITL de um agente, ou
porque um nó [Codex](../nodes/codex-node.md) precisa
de mais informações — a execução é persistida como pendente e o card exibe o estado pendente âmbar. Cada pausa mantém sua própria superfície de resposta: um link de revisão HITL para HITL, a
tela de follow-up do Codex para o Codex.

Assim que você responder, a cadeia é retomada por conta própria: o workflow pausado é concluído, seu output
chega ao card, o restante da cadeia dessa coluna é executado e o card avança como de costume.
Se a execução retomada falhar, o card fica vermelho e os elos restantes são ignorados.

## Relacionados

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
