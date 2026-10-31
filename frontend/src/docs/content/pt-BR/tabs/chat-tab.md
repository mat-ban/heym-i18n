# Aba Chat

A aba **Chat** oferece uma interface direta de conversa com o LLM. Use-a para testar modelos, fazer perguntas, executar Workflows existentes ou criar um novo Workflow a partir de uma solicitação em linguagem natural.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Assistir à demonstração do Chat</a></p>

## Configuração

1. Selecione uma [credencial](./credentials-tab.md) (chave de API para OpenAI, Google, etc.)
2. Escolha um modelo no menu suspenso (os modelos são carregados a partir da credencial selecionada)
3. Comece a digitar para enviar mensagens

Você também pode iniciar uma conversa a partir da caixa de chat na [aba Workflows](./workflows-tab.md). Ela envia sua primeira mensagem e abre a nova conversa aqui com a resposta já em streaming.

## Recursos

- **Contexto de variáveis globais** – Suas [Variáveis Globais](../reference/global-variables.md) ficam disponíveis para o LLM, permitindo que você pergunte sobre ou referencie valores armazenados
- **Contexto de templates do workspace** – Templates compartilhados de Workflow e de Nó no seu workspace são incluídos como contexto, permitindo que o Chat responda a perguntas sobre os templates disponíveis
- **Agente de longa duração** – O Chat continua funcionando no backend mesmo se o navegador for fechado, então você pode retornar de outro dispositivo e continuar a mesma conversa
- **Criação de Workflow** – Peça ao Chat para criar ou configurar um Workflow, e ele usa o mesmo motor do Workflow AI Builder do assistente do editor para gerar e salvar o Workflow
- **Criação de tarefas no Kanban** – Peça naturalmente para adicionar uma tarefa ou criar um card. O Chat adiciona-o à primeira coluna do board solicitado; quando você tem vários boards e não nomeia nenhum, o Chat apresenta um seletor de board antes de criar o card
- **Acompanhamentos na fila** – Envie mais mensagens enquanto uma resposta está em streaming. As mensagens na fila são persistidas, podem ser editadas ou excluídas antes de começarem e são executadas em ordem após a resposta ativa
- **Pausas de planejamento** – Quando o Chat precisa de detalhes de planejamento, ele faz perguntas de esclarecimento e pausa os acompanhamentos na fila até que você responda. Após a resposta de planejamento terminar, as mensagens na fila são retomadas
- **Credenciais** – Quando um Workflow criado ou editado pelo Chat precisa de uma credencial, o Chat pergunta qual usar, oferece criar uma nova na conversa ou permite que você continue sem. Você também pode pedir ao Chat para criar uma credencial ou atualizar uma que você possui; ele abre o formulário de credencial na conversa. O modelo vê o nome e o tipo da credencial, nunca seus valores, para credenciais que você possui e aquelas compartilhadas com você. Os nós LLM e Agent adicionados pelo Chat são executados com a credencial e o modelo selecionados para o chat, incluindo credenciais compartilhadas; quando o Chat edita um workflow, seus nós LLM e Agent existentes mantêm sua credencial e modelo. Consulte [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Dashboards** – Pergunte quais [dashboards](./dashboard-tab.md) você possui, o que há em um deles ou em qual dashboard um workflow está. Peça ao Chat para adicionar um novo widget a um dashboard (ele coloca um widget vazio ali, depois constrói e testa seu workflow), colocar um workflow existente em um dashboard como widget, renomear ou excluir um widget, ou organizar o layout de um dashboard. O Heym Work exibe esses dashboards como suas páginas. Veja [Dashboard › A partir do Chat e MCP](./dashboard-tab.md#a-partir-do-chat-e-mcp)
- **Tabelas de dados** – Quando um workflow que o Chat cria ou edita armazena registros, o Chat pergunta qual [tabela de dados](./datatable-tab.md) usar ou oferece criar uma com as colunas necessárias. Ele também pode inspecionar linhas, adicionar ou remover colunas e inserir, atualizar ou excluir linhas diretamente em tabelas que você possui ou pode editar. Forneça o nome de uma tabela ou link DataTable. A remoção de colunas e a limpeza de todas as linhas solicitam confirmação; adicionar colunas preserva os dados existentes. Veja [Assistente de IA › Tabelas de dados](../reference/ai-assistant.md#data-tables)
- **Respostas em streaming** – Veja a saída do modelo conforme ela é transmitida
- **Interromper resposta** – Interrompa a resposta em streaming atual a qualquer momento; interromper também limpa as mensagens na fila daquela conversa
- **Renderização de Markdown** – As respostas suportam formatação markdown, incluindo imagens em linha
- **Exibição de imagens** – Imagens incorporadas nas respostas (por exemplo, de geração de imagens por LLM) aparecem em linha; clique em qualquer imagem para visualizá-la em tela cheia. Pressione **Esc** ou o botão de voltar (no celular) para fechar a visualização em tela cheia
- **Copiar mensagens** – Copie qualquer mensagem para a área de transferência
- **Limpar chat** – Inicie uma nova conversa
- **Entrada de voz** – Use o botão de microfone para conversão de fala em texto (com suporte do navegador). Quando a gravação para, o Heym pode fazer uma leve limpeza na transcrição antes de você enviá-la
- **Workflows agendados** – Pergunte quando os Workflows cron são executados (hoje, esta semana, este mês ou um intervalo de datas personalizado). O assistente usa os mesmos dados de agendamento da aba [Scheduled](./scheduled-tab.md) e pode limitar os resultados aos Workflows que você possui ou incluir aqueles compartilhados com você
- **Histórico de execuções de Workflow** – Pergunte sobre um Workflow ("quantas vezes o relatório diário foi executado?", "ele falhou?", "quando foi a última execução?"). O Chat localiza o Workflow pelo seu ID e responde com base na contagem de execuções, detalhamento de status, horário da primeira e da última execução e duração média. Pergunte por que uma execução falhou ou o que ela retornou, e o Chat então abre essa execução específica para ler suas entradas, saídas e erros por Nó
- **Onde as execuções falham e por que são lentas** – Pergunte onde seus workflows falham ou por que são lentos e o Chat indica os workflows que mais rodaram, que mais falharam e que são mais lentos, bem como os tipos de nós que consomem mais tempo (média por chamada e total), que mais falham e que mais rodam, os mesmos números da aba [Analytics](./analytics-tab.md). Os tipos de nós são contabilizados para execuções a partir da versão que introduziu a análise de nós. Pergunte sobre a última hora, 3 ou 6 horas, 24 horas, 7 ou 30 dias, ou todo o histórico; as janelas de horas começam na hora cheia, portanto "a última hora" às 15:20 cobre de 14:00 até agora.
- **Status de execução ao vivo** – Pergunte o que está em execução agora e o Chat responde com a contagem, os nomes dos Workflows, há quanto tempo cada execução está em andamento, em qual Nó ela está e um link direto para a execução ao vivo
## Usando o Chat a partir de um Cliente MCP

O mecanismo de Chat também pode ser acessado fora do navegador. Ative o **Heym Agent** na [aba MCP / A2A](./mcp-tab.md) e os clientes MCP (Claude, Cursor e qualquer outra ferramenta compatível com MCP) recebem uma única ferramenta `heym_chat` que executa este mesmo mecanismo com todos os seus recursos. Marque também **Habilitar A2A** e outros agentes poderão enviar tarefas para ele por meio do [A2A](../reference/a2a.md); essas conversas exibem um ícone de rede na lista.

Essas conversas ficam no histórico desta aba, marcadas com um ícone de plug na lista de conversas. Abra uma para ler o que o cliente perguntou, ver os cards de ferramentas que ele acionou e continuar a conversa você mesmo. Responder a uma pergunta de esclarecimento funciona da mesma forma, seja quando o turno começou aqui ou a partir de um cliente MCP.

Via MCP, o Chat não lista, seleciona nem cria credenciais. Os Workflows que ele constrói deixam os campos de credencial vazios, e a resposta nomeia os Nós que precisam de uma credencial para que você possa configurá-los no editor.

As tabelas de dados também funcionam via MCP: o Chat pode editar colunas e linhas diretamente, criar tabelas e conectá-las a workflows. Perguntas sobre tabelas e confirmações de exclusão chegam como texto no resultado; responda com o mesmo `conversation_id`.

## Limite de Contexto

O chat mantém até 25 mensagens recentes no contexto. As mensagens mais antigas são removidas para permanecer dentro dos limites do modelo.

## Criando Workflows

Quando você pede ao Chat para criar, construir, gerar ou configurar um Workflow, ele cria um novo Workflow salvo com um nome e uma descrição gerados. A resposta inclui uma pré-visualização somente leitura do canvas com os Nós e as conexões gerados, além de um link **Open workflow** que abre o editor de Workflow em uma nova aba do navegador. Use o botão **Run** do card de pré-visualização quando quiser executar o Workflow.

Feedback de acompanhamento no mesmo chat edita esse Workflow em vez de criar outro. Por exemplo, depois que o Chat cria um Workflow, você pode dizer "add an approval step", "change the output format" ou "şöyle yap" e o Chat atualiza o Workflow salvo e atualiza a pré-visualização.

Isso é ideal para solicitações em que você quer o trabalho feito como uma automação reutilizável, não apenas como uma resposta pontual.

## Criando Tarefas no Kanban

Peça ao Chat em linguagem comum, por exemplo, "Add a task called Fix login bug" ou
"Create a new card Update documentation on the Launch board." Você pode incluir uma
descrição na mesma solicitação. O Chat sempre cria o card na primeira coluna do board
selecionado.

Se o seu workspace tiver vários boards e você não identificar um, o Chat pausa com um
seletor de board de escolha única. Selecione um board para concluir a criação do card. Nenhum comando de barra
ou formato de mensagem especial é necessário.

## Perguntando o Que Está em Execução

Pergunte em linguagem comum — "what is running?", "how many workflows are active right now?",
"which node is the nightly report on?" — e o Chat informa o panorama ao vivo:

- **Quantas** execuções estão em andamento, divididas entre em execução e aguardando revisão humana
- **A quais Workflows** elas pertencem, por nome
- **Há quanto tempo** cada execução está em andamento (por exemplo `1m 35s`, `3h 25m`)
- **Qual Nó** está executando agora, pelo seu rótulo no canvas, além do último Nó que terminou
- **Um link** para cada execução ao vivo, que abre o canvas com essa execução sendo reproduzida

Execuções pausadas para uma revisão de [Human-in-the-Loop](../reference/human-in-the-loop.md) ou Codex são reportadas como
aguardando você, não como em execução. Esses são os mesmos dados do badge de execuções ativas no cabeçalho,
então o Chat e o badge nunca divergem. Para execuções que já terminaram, peça as execuções recentes
em vez disso — isso lê o [Execution History](../reference/execution-history.md).

## Perguntando sobre uma execução

Selecione uma execução de Workflow no [Execution History](../reference/execution-history.md#ask-ai), pelo editor ou por All History, e clique em **Perguntar à IA** ao lado do título da caixa de diálogo. O Chat abre uma nova conversa com dois chips acima da caixa de mensagem:

- **Workflow:** o nome do Workflow
- **Execution:** os primeiros caracteres do id da execução selecionada

Remova um chip com seu **×** para excluí-lo. Em seguida, faça sua pergunta, por exemplo «por que esta execução demorou tanto?», «o que falhou aqui?» ou «você pode corrigir isso?». Os chips restantes são anexados a essa mensagem com os ids completos, portanto, o Chat lê diretamente as entradas, saídas e o rastreamento por nó da execução em vez de procurar o Workflow. Para corrigir o Workflow, o Chat salva, testa e verifica a alteração conforme descrito em [Criando Workflows](#criando-workflows).

A mensagem enviada mostra os chips sob sua pergunta. Eles pertencem apenas a essa mensagem; perguntas seguintes na mesma conversa mantêm o contexto do histórico.

## Perguntando Sobre Alertas

O Chat pode responder perguntas sobre os [alertas](./alerts-tab.md) que você definiu:

- **O que existe** — "what alerts do I have?", "is there an alert on the invoice workflow?",
  "which alerts are firing right now?"
- **Como um está configurado** — "what is the threshold on the cost alert?", "how is that configured?"
- **Por que e quando ele disparou** — "why did the cost alert fire?", "when did this last trigger?"

Para uma pergunta do tipo "por que ele disparou", o Chat lê o registro de disparo e cita o valor
real observado, o limite e a janela exata que foi avaliada, além do detalhe contribuinte:
ids de execuções com falha e mensagens de erro para alertas de erro, gasto por modelo para alertas de custo, ou
a divisão por origem de Trigger para alertas de contagem de execuções. Ele reporta o que era verdade quando o alerta
disparou em vez de recalcular a janela, porque a janela já passou e um novo cálculo
pode dar uma resposta diferente.

## Regras de Usuário

As [Regras de Usuário](../reference/user-settings.md) (configuradas em Settings) são automaticamente injetadas em cada conversa do Chat como instruções em nível de sistema. Defina-as uma vez para aplicar preferências persistentes a todas as solicitações de chat.
## Trabalhar com Avaliações

O Chat pode criar, alterar e executar as suites em [Evals](./evals-tab.md), tanto suites de prompts quanto suites de agente:

- **Suite de prompts**: "crie uma suite de prompts para o meu prompt de resposta de suporte com 8 casos de teste e compare o gpt-4o com o gpt-4.1-mini". O Chat escreve os casos de teste com as respostas esperadas, seleciona um método de pontuação e salva a suite.
  - Antes de criar a suite, ele define qual credencial LLM e modelos usar. Com exatamente uma credencial LLM, ele usa essa e avisa; caso contrário, ele pergunta.
  - Para pontuação LLM-as-Judge, ele também pergunta se um juiz separado deve pontuar as respostas.
- **Suite de agente**: "verifique se o meu agente de suporte sempre pesquisa a documentação e nunca envia e-mails". O Chat localiza o agente e salva as verificações de ferramentas e limites. Quando solicitado, ele executa o workflow, gerando uma entrada diferente para cada execução.
  - As execuções de suites de agente são execuções reais de workflow, portanto seus efeitos colaterais ocorrem. O Chat informa quantas execuções inicia.
- **Baseline**: O Chat pode trabalhar com a baseline de um agente de três maneiras:
  - Relatá-la a partir das execuções mais recentes do agente.
  - Construí-la a partir das execuções que inicia ("execute 5 vezes e use isso como baseline").
  - Armazenar números que você fornecer ("defina a baseline para 3 segundos p95 e US$ 0,01 por execução").
- **Execuções**: O Chat aguarda até um minuto por uma execução e depois relata o resultado:
  - Para uma suite de prompts: a contagem de aprovações de cada modelo e os casos que falharam.
  - Para uma suite de agente: a taxa de aprovação, as verificações com falha e o desvio da baseline.
  - Uma execução mais longa continua no Evals; peça ao Chat para verificá-la novamente.

Depois que o Chat cria ou altera uma suite, a resposta mostra um cartão com o nome da suite, seu tipo e um botão **Abrir no Evals**, como o cartão de um workflow salvo. Via MCP, o resultado de `heym_chat` lista o link de cada suite salva nessa chamada.

O mesmo funciona a partir de um cliente MCP por meio de `heym_chat` (veja [Usar o Chat a partir de um cliente MCP](#usar-o-chat-a-partir-de-um-cliente-mcp)). As ferramentas de avaliação permanecem dentro de `heym_chat`; os clientes MCP não as veem como ferramentas separadas.

O Assistente de IA do editor não cria suites.

## Trabalhar com Avaliações

O Chat pode criar, alterar e executar as suites em [Evals](./evals-tab.md), tanto suites de prompts quanto suites de agente:

- **Suite de prompts**: "crie uma suite de prompts para o meu prompt de resposta de suporte com 8 casos de teste e compare o gpt-4o com o gpt-4.1-mini". O Chat escreve os casos de teste com as respostas esperadas, seleciona um método de pontuação e salva a suite.
  - Antes de criar a suite, ele define qual credencial LLM e modelos usar. Com exatamente uma credencial LLM, ele usa essa e avisa; caso contrário, ele pergunta.
  - Para pontuação LLM-as-Judge, ele também pergunta se um juiz separado deve pontuar as respostas.
- **Suite de agente**: "verifique se o meu agente de suporte sempre pesquisa a documentação e nunca envia e-mails". O Chat localiza o agente e salva as verificações de ferramentas e limites. Quando solicitado, ele executa o workflow, gerando uma entrada diferente para cada execução.
  - As execuções de suites de agente são execuções reais de workflow, portanto seus efeitos colaterais ocorrem. O Chat informa quantas execuções inicia.
- **Baseline**: O Chat pode trabalhar com a baseline de um agente de três maneiras:
  - Relatá-la a partir das execuções mais recentes do agente.
  - Construí-la a partir das execuções que inicia ("execute 5 vezes e use isso como baseline").
  - Armazenar números que você fornecer ("defina a baseline para 3 segundos p95 e US$ 0,01 por execução").
- **Execuções**: O Chat aguarda até um minuto por uma execução e depois relata o resultado:
  - Para uma suite de prompts: a contagem de aprovações de cada modelo e os casos que falharam.
  - Para uma suite de agente: a taxa de aprovação, as verificações com falha e o desvio da baseline.
  - Uma execução mais longa continua no Evals; peça ao Chat para verificá-la novamente.

Depois que o Chat cria ou altera uma suite, a resposta mostra um cartão com o nome da suite, seu tipo e um botão **Abrir no Evals**, como o cartão de um workflow salvo. Via MCP, o resultado de `heym_chat` lista o link de cada suite salva nessa chamada.

O mesmo funciona a partir de um cliente MCP por meio de `heym_chat` (veja [Usar o Chat a partir de um cliente MCP](#usar-o-chat-a-partir-de-um-cliente-mcp)). As ferramentas de avaliação permanecem dentro de `heym_chat`; os clientes MCP não as veem como ferramentas separadas.

O Assistente de IA do editor não cria suites.

## Relacionados

- [Aba MCP / A2A](./mcp-tab.md) – Exponha este engine a clientes MCP como a ferramenta `heym_chat`
- [Configurações](../reference/user-settings.md) – Defina Regras de Usuário aplicadas a todas as solicitações de chat
- [Aba Credenciais](./credentials-tab.md) – Adicione e gerencie chaves de API
- [Aba Variáveis](./global-variables-tab.md) – Variáveis globais disponíveis para o Chat
- [Tipos de Nó](../reference/node-types.md) – Nós LLM e Agente para workflows
- [Nó Agente](../nodes/agent-node.md) – Agente de IA com chamada de ferramentas
- [Assistente de IA](../reference/ai-assistant.md) – Assistente do editor alimentado pelo mesmo DSL de construção de workflows
- [Histórico de Execuções](../reference/execution-history.md) – Visualize execuções anteriores (botão Histórico no cabeçalho)
- [Aba Agendados](./scheduled-tab.md) – Calendário de próximas execuções cron (os mesmos dados que o Chat pode resumir)
- [Aba Alertas](./alerts-tab.md) – Alertas de limite que o Chat pode listar e explicar
- [Vitrine Contextual](../reference/contextual-showcase.md) – Orientação compacta no aplicativo para esta página
- [Voz do Chat (TTS e STT)](../reference/chat-voice.md) – Leia mensagens em voz alta e converse com as mãos livres com o ElevenLabs

## Chamadas de ferramentas e tamanho do contexto

Cada vez que o assistente invoca uma ferramenta (executando um workflow, listando execuções, construindo um novo workflow), um card recolhível aparece na conversa. O card se expande automaticamente enquanto a ferramenta é executada, mostrando os argumentos exatos. Quando a ferramenta termina, o card é recolhido para um resumo de uma linha com o tempo decorrido. Clique em qualquer card para reexpandir os argumentos e o resumo da resposta.

Um pequeno badge em anel abaixo do campo de entrada mostra o uso atual do contexto como porcentagem da janela do modelo (por exemplo, `12% · ~9.2k`). Passe o mouse sobre o badge para ver um detalhamento: prompt do sistema, AGENTS.md, bloco de workflows, regras de usuário, histórico e seu rascunho de entrada. Quando o uso ultrapassa 80%, o anel fica âmbar; a 95%, fica vermelho.

Se o uso se aproximar do limite, o Heym comprime automaticamente as mensagens mais antigas em um resumo curto usando o mesmo mecanismo que os Nós Agente utilizam. Um card "Contexto comprimido" aparece inline para mostrar o que aconteceu.
