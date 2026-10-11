# Board

O separador **Board** é um quadro kanban agêntico. O trabalho avança através de colunas, e cada
coluna pode executar workflows do Heym. Um cartão não é apenas uma tarefa — é uma tarefa
agêntica persistente que transporta contexto, histórico de conversação, estado de execução, resultados
e execuções de workflows.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Boards e colunas

- Pode criar tantos boards quantos forem necessários. Um novo board começa com as colunas
  predefinidas **Backlog → Planning → Development → Done**.
- Cada board necessita de um **Agentic Kanban Model** (uma credencial mais um modelo). É
  obrigatório — a caixa de diálogo de novo board não cria um board sem ele, e um board
  que não tenha nenhum mantém as suas ações desativadas — porque é o modelo que mapeia cada
  cartão nos inputs dos workflows que executa e converte o respetivo output de volta em
  texto legível.
- O ícone de engrenagem no cabeçalho do board abre as definições do board: nome, descrição
  (apresentada sob o cabeçalho) e o Agentic Kanban Model.
- As colunas são totalmente editáveis: adicione, renomeie, altere a cor, reordene ou elimine-as a partir das
  definições da coluna (uma coluna tem de estar vazia antes de poder ser eliminada).
- Os cartões são ordenados verticalmente por prioridade — arraste para reordenar.
- Também pode criar um cartão a partir do [separador Chat](./chat-tab.md) com um pedido
  em linguagem natural. O Chat solicita que selecione um board quando necessário e adiciona sempre o cartão à primeira
  coluna desse board.

## Partilhar um board

As definições do board também permitem partilhar o board com **utilizadores** (por email) e com
**equipas**, com permissão de `read` ou `write`:

- **read** — o board e os seus cartões são visíveis, mas nada pode ser alterado: sem novos
  cartões, sem movimentos, sem comentários, sem execuções.
- **write** — utilização total do board: cartões, movimentos, comentários e execuções.
- Apenas o **proprietário** vê a engrenagem e os botões de eliminação, e apenas o proprietário pode alterar
  as definições do board, o seu Agentic Kanban Model ou as suas partilhas.

As cadeias num board partilhado são sempre executadas com as credenciais e o Agentic Kanban
Model do **proprietário**, pelo que os colaboradores nunca precisam das suas próprias.

## Anexos dos cartões

Abra um cartão e utilize **Attach file** para lhe adicionar ficheiros — largue-os na caixa ou escolha-os
com o botão, e remova-os da mesma lista. Os anexos são armazenados no
[Drive](./drive-tab.md).

Cada execução **resolve os anexos antes de os workflows começarem**, por tipo:

- **Documentos** (pdf, markdown, csv, json, texto) são extraídos para texto, limitados a 20 000
  caracteres por ficheiro, no campo `text` do anexo.
- **Imagens** são entregues como um `url` que o percurso de visão carrega diretamente (o input de imagem de um nó LLM
  aceita-o tal como está).
- **Qualquer outro tipo** é transmitido como uma referência simples (`name`, `url`, `mime_type`).

Os workflows leem-nos em `$input.card.attachments` (e sempre em `$input.board.attachments`,
independentemente do que o mapeador mapeou). O Agentic Kanban Model também vê o texto extraído e os URLs
das imagens, pelo que pode mapear um anexo diretamente para o campo que um workflow espera.

## Cadeias de workflows das colunas

Cada coluna pode ser configurada com uma **lista ordenada de workflows** (a cadeia).
Quando um cartão se move para uma coluna que tem uma cadeia:

1. A cadeia inicia automaticamente em segundo plano — o movimento em si nunca espera.
2. Os workflows são executados **sequencialmente**. O output de cada workflow é anexado ao contexto
   do cartão antes de o seguinte começar.
3. Se um workflow falhar, a cadeia para: os elos restantes são ignorados e o
   cartão fica **vermelho**.
4. Quando todos os elos têm sucesso, o cartão fica **verde**. Enquanto a cadeia está em execução,
   o cartão pulsa **âmbar**; uma execução em pausa para revisão humana apresenta um estado âmbar
   estático.

As execuções são registadas no [Histórico de Execuções](../reference/execution-history.md) com a
origem de trigger `board`, e cada cartão mantém a sua própria lista de execuções com outputs e erros
por workflow. Abra um cartão enquanto um workflow está em execução e escolha **Open live** ao lado
da execução para ligar o editor a essa execução exata. A mesma animação do canvas, os registos de Debug
incrementais e o resultado final aparecem sem iniciar uma segunda execução.

## O que os workflows recebem

A cadeia transmite um payload padrão como entrada do workflow. Leia-o com
[expressões](../reference/expression-dsl.md) normais, tais como `$input.card.title`:

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

- `comments` — todos os comentários no cartão, do mais antigo para o mais recente.
- `history` — a cronologia completa de atividade (comentários, movimentações, outputs), limitada
  às 200 entradas mais recentes.
- `previous_outputs` — outputs de execuções anteriores concluídas (colunas anteriores e
  rondas de seguimento).
- `chain.previous_workflow_outputs` — outputs das ligações anteriores na cadeia
  *atual*.
- Nas rondas de seguimento, `move` é `null` e `rerun` é `true`.

## O ciclo de planeamento (rondas de seguimento)

Um padrão comum consiste em colocar um workflow de planeamento na **segunda coluna** (por predefinição
designada Planning — o nome não importa; o espaço é que importa). Esse workflow enriquece o
cartão e coloca questões de seguimento:

1. Mova um cartão para a segunda coluna — o workflow escreve um plano enriquecido e as suas
   questões de volta no cartão como output.
2. Responda no fio de comentários do cartão. A resposta liberta o cartão: este avança para a
   coluna seguinte, que o recolhe com a resposta em contexto. A cadeia da segunda coluna
   não é executada novamente.
3. Para melhorar o plano no local, prima **Run follow-up round**. A mesma
   cadeia é executada novamente com todo o contexto acumulado, e depois o cartão aguarda nessa coluna
   até adicionar um comentário para o libertar.

A barreira de planeamento é posicional, não baseada no nome: a coluna mais à esquerda e a coluna
imediatamente à sua direita nunca avançam por si próprias — executam a sua cadeia e aguardam
aí (um comentário liberta a segunda coluna). A partir da terceira coluna, uma
cadeia bem-sucedida faz avançar o cartão para a direita por si própria, até à última
coluna. Renomear ou remover a etiqueta predefinida "Planning" não altera qual o espaço
que constitui a barreira. Um cartão só pode ter uma execução ativa de cada vez.

## Human-in-the-loop e questões do Codex

Se um workflow da cadeia fizer uma pausa — num nó
[Human-in-the-Loop](../reference/human-in-the-loop.md), numa ferramenta HITL de um agente, ou
porque um nó [Codex](../nodes/codex-node.md) necessita de
mais informações — a execução é persistida como pendente e o cartão apresenta o estado pendente âmbar. Cada pausa mantém a sua própria superfície de resposta: uma ligação de revisão HITL para HITL, o ecrã de seguimento do Codex para o Codex.

Assim que responder, a cadeia é retomada por si própria: o workflow em pausa termina, o seu output
é colocado no cartão, o resto da cadeia dessa coluna é executado e o cartão avança como habitualmente.
Se a execução retomada falhar, o cartão fica vermelho e as ligações restantes são ignoradas.

## Relacionado

- [Workflows](./workflows-tab.md)
- [Histórico de execuções](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
