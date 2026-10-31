# Separador Chat

O separador **Chat** disponibiliza uma interface direta de conversação com LLMs. Utilize-o para testar modelos, colocar questões, executar workflows existentes ou criar um novo workflow a partir de um pedido em linguagem natural.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Ver demonstração do Chat</a></p>

## Configuração

1. Selecione uma [credencial](./credentials-tab.md) (chave de API para OpenAI, Google, etc.)
2. Escolha um modelo na lista pendente (os modelos são carregados a partir da credencial selecionada)
3. Comece a escrever para enviar mensagens

Também pode iniciar uma conversa a partir da caixa de chat no [separador Workflows](./workflows-tab.md). Esta envia a primeira mensagem e abre a nova conversa aqui com a resposta já em streaming.

## Funcionalidades

- **Contexto de variáveis globais** – As suas [Variáveis Globais](../reference/global-variables.md) estão disponíveis para o LLM, pelo que pode perguntar sobre valores armazenados ou fazer referência aos mesmos
- **Contexto de modelos do espaço de trabalho** – Os modelos partilhados de workflows e nós no seu espaço de trabalho são incluídos como contexto, permitindo ao Chat responder a questões sobre os modelos disponíveis
- **Agente de longa duração** – O Chat continua a funcionar em segundo plano mesmo que o navegador seja fechado, pelo que pode regressar a partir de outro dispositivo e continuar a mesma conversa
- **Criação de workflows** – Peça ao Chat para criar ou configurar um workflow; este utiliza o mesmo motor Workflow AI Builder que o assistente do editor para gerar e guardar o workflow
- **Criação de tarefas Kanban** – Peça naturalmente para adicionar uma tarefa ou criar um cartão. O Chat adiciona-o à primeira coluna do quadro solicitado; quando existem vários quadros e nenhum é indicado, o Chat apresenta um seletor de quadros antes de criar o cartão
- **Mensagens de seguimento em fila** – Envie mais mensagens enquanto uma resposta está em streaming. As mensagens em fila são persistidas, podem ser editadas ou eliminadas antes de iniciarem e são executadas por ordem após a resposta ativa
- **Pausas de planeamento** – Quando o Chat necessita de detalhes de planeamento, coloca questões de esclarecimento e suspende as mensagens de seguimento em fila até obter resposta. Após a conclusão da resposta de planeamento, as mensagens em fila são retomadas
- **Credenciais** – Quando um workflow criado ou editado pelo Chat necessita de uma credencial, o Chat pergunta qual utilizar, oferece a criação de uma nova na conversa ou permite continuar sem credencial. Também pode pedir ao Chat para criar uma credencial ou atualizar uma que possua; este abre o formulário de credencial na conversa. O modelo vê o nome e o tipo da credencial, nunca os seus valores, tanto para credenciais próprias como para partilhadas consigo. Os nós LLM e Agent adicionados pelo Chat são executados com a credencial e o modelo selecionados para o chat, incluindo credenciais partilhadas; quando o Chat edita um workflow, os seus nós LLM e Agent existentes mantêm a sua credencial e modelo. Consulte [Assistente de IA › Credenciais](../reference/ai-assistant.md#credentials)
- **Dashboards** – Pergunte quais [dashboards](./dashboard-tab.md) possui, o que está num deles ou em que dashboard se encontra um workflow. Peça ao Chat para adicionar um novo widget a um dashboard (coloca um widget vazio lá, construindo e testando depois o respetivo workflow), colocar um workflow existente num dashboard como widget, renomear ou eliminar um widget, ou organizar o esquema de um dashboard. O Heym Work apresenta estes dashboards como as suas páginas. Consulte [Dashboard › A partir do Chat e MCP](./dashboard-tab.md#a-partir-do-chat-e-mcp)
- **Tabelas de dados** – Quando um workflow que o Chat cria ou edita armazena registos, o Chat pergunta que [tabela de dados](./datatable-tab.md) utilizar ou oferece-se para criar uma com as colunas necessárias. Também pode inspecionar linhas, adicionar ou remover colunas e inserir, atualizar ou eliminar linhas diretamente em tabelas que possui ou pode editar. Forneça um nome de tabela ou ligação DataTable. A remoção de colunas e a limpeza de todas as linhas solicitam confirmação; a adição de colunas preserva os dados existentes. Consulte [Assistente de IA › Tabelas de dados](../reference/ai-assistant.md#data-tables)
- **Respostas em streaming** – Veja a saída do modelo à medida que é transmitida
- **Parar resposta** – Interrompa a resposta em streaming em qualquer momento; parar também limpa as mensagens em fila dessa conversa
- **Renderização de Markdown** – As respostas suportam formatação markdown, incluindo imagens em linha
- **Apresentação de imagens** – As imagens incorporadas nas respostas (por exemplo, de geração de imagens por LLM) aparecem em linha; clique em qualquer imagem para a visualizar em ecrã inteiro. Prima **Esc** ou o botão de retroceder (dispositivo móvel) para fechar a vista de ecrã inteiro
- **Copiar mensagens** – Copie qualquer mensagem para a área de transferência
- **Limpar chat** – Inicie uma nova conversa
- **Entrada de voz** – Utilize o botão do microfone para conversão de fala em texto (suportado pelo navegador). Quando a gravação termina, o Heym pode efetuar uma ligeira limpeza da transcrição antes de a enviar
- **Workflows agendados** – Pergunte quando são executados os workflows cron (hoje, esta semana, este mês ou um intervalo de datas personalizado). O assistente utiliza os mesmos dados de agendamento que o separador [Agendamentos](./scheduled-tab.md) e pode limitar os resultados aos workflows que possui ou incluir os partilhados consigo
- **Histórico de execuções de workflows** – Pergunte sobre um workflow ("quantas vezes foi executado o relatório diário?", "falhou?", "quando foi a última execução?"). O Chat procura o workflow pelo seu ID e responde com base na contagem de execuções, distribuição por estado, primeira e última execução e duração média. Pergunte porque falhou uma execução ou o que devolveu e o Chat abre essa execução individual para ler as suas entradas, saídas e erros por nó
- **Onde as execuções falham e por que são lentas** – Pergunte onde os seus workflows falham ou por que motivo são lentos e o Chat indica os workflows que mais executaram, que mais falharam e que são mais lentos, bem como os tipos de nós que consomem mais tempo (média por chamada e total), que mais falham e que mais executam, os mesmos números do separador [Analytics](./analytics-tab.md). Os tipos de nós são contabilizados para execuções a partir da versão que introduziu a análise de nós. Pergunte sobre a última hora, 3 ou 6 horas, 24 horas, 7 ou 30 dias, ou todo o histórico; as janelas de horas iniciam à hora certa, pelo que "a última hora" às 15:20 abrange das 14:00 até agora.
- **Estado de execução em tempo real** – Pergunte o que está a ser executado neste momento e o Chat responde com a contagem, os nomes dos workflows, há quanto tempo cada execução está em curso, em que nó se encontra e uma ligação direta para a execução em tempo real

- **Chips de contexto de execução** – **Perguntar à IA** no [Execution History](../reference/execution-history.md#ask-ai) abre uma nova conversa com a execução de Workflow selecionada anexada como chips. Consulte [Perguntar sobre uma execução](#perguntar-sobre-uma-execucao)

## Utilizar o Chat a partir de um Cliente MCP

O motor de Chat também pode ser acedido fora do navegador. Ative o **Heym Agent** no [separador MCP / A2A](./mcp-tab.md) e os clientes MCP (Claude, Cursor e qualquer outra ferramenta compatível com MCP) recebem uma única ferramenta `heym_chat` que executa este mesmo motor com todas as suas capacidades. Assinale também **Ativar A2A** e outros agentes poderão enviar-lhe tarefas através do [A2A](../reference/a2a.md); essas conversas apresentam um ícone de rede na lista.

Essas conversas ficam no histórico deste separador, marcadas com um ícone de ficha na lista de conversas. Abra uma para ler o que o cliente pediu, ver os cartões de ferramentas que acionou e continuar o fio de conversa. Responder a uma pergunta de esclarecimento funciona da mesma forma, quer o turno tenha começado aqui ou a partir de um cliente MCP.

Através de MCP, o Chat não lista, escolhe nem cria credenciais. Os Workflows que constrói deixam os campos de credenciais vazios, e a resposta nomeia os nós que necessitam de uma credencial para que possa defini-los no editor.

As tabelas de dados também funcionam através de MCP: o Chat pode editar colunas e linhas diretamente, criar tabelas e associá-las a workflows. As questões sobre tabelas e as confirmações de eliminação chegam como texto no resultado; responda com o mesmo `conversation_id`.

## Limite de Contexto

O Chat mantém até 25 mensagens recentes em contexto. As mensagens mais antigas são removidas para se manter dentro dos limites do modelo.

## Criar Workflows

Quando pede ao Chat para criar, construir, gerar ou configurar um Workflow, este cria um novo Workflow guardado com um nome e descrição gerados. A resposta inclui uma pré-visualização do Canvas em modo de leitura dos nós e ligações gerados, além de uma ligação **Open workflow** que abre o editor de Workflows num novo separador do navegador. Utilize o botão **Run** do cartão de pré-visualização quando quiser executar o Workflow.

O feedback de seguimento no mesmo Chat edita esse Workflow em vez de criar outro. Por exemplo, depois de o Chat criar um Workflow, pode dizer "adicionar um passo de aprovação", "alterar o formato de saída" ou "şöyle yap" e o Chat atualiza o Workflow guardado e renova a pré-visualização.

Isto é mais adequado para pedidos em que pretende que o trabalho seja feito como uma automação reutilizável, e não apenas como uma resposta pontual.

## Criar Tarefas Kanban

Peça ao Chat em linguagem comum, por exemplo, "Adicionar uma tarefa chamada Corrigir erro de início de sessão" ou
"Criar um novo cartão Atualizar documentação no quadro Launch." Pode incluir uma
descrição no mesmo pedido. O Chat cria sempre o cartão na primeira coluna do quadro
selecionado.

Se o seu espaço de trabalho tiver vários quadros e não identificar nenhum, o Chat pausa com um
seletor de quadro de escolha única. Selecione um quadro para concluir a criação do cartão. Não é necessário nenhum comando de barra
nem formato de mensagem especial.

## Perguntar o Que Está em Execução

Pergunte em linguagem comum — "o que está em execução?", "quantos Workflows estão ativos neste momento?",
"em que nó está o relatório noturno?" — e o Chat reporta o panorama em tempo real:

- **Quantas** execuções estão em curso, divididas entre em execução e a aguardar revisão humana
- **A que Workflows** pertencem, por nome
- **Há quanto tempo** cada execução está em curso (por exemplo `1m 35s`, `3h 25m`)
- **Que nó** está a executar neste momento, pela sua etiqueta no Canvas, mais o último nó que terminou
- **Uma ligação** para cada execução em direto, que abre o Canvas com essa execução a ser reproduzida

As execuções em pausa para um [Human-in-the-Loop](../reference/human-in-the-loop.md) ou revisão do Codex são reportadas como
a aguardar por si, não como em execução. Estes são os mesmos dados que o distintivo de execuções ativas no cabeçalho,
pelo que o Chat e o distintivo nunca divergem. Para execuções que já terminaram, peça antes as execuções recentes
— isso lê o [Histórico de Execuções](../reference/execution-history.md).

## Perguntar sobre uma execução

Selecione uma execução de Workflow no [Execution History](../reference/execution-history.md#ask-ai), a partir do editor ou de All History, e clique em **Perguntar à IA** junto ao título da caixa de diálogo. O Chat abre uma nova conversa com dois chips acima da caixa de mensagem:

- **Workflow:** o nome do Workflow
- **Execution:** os primeiros carateres do id da execução selecionada

Remova um chip com o respetivo **×** para o excluir. Depois faça a sua pergunta, por exemplo «porque demorou tanto esta execução?», «o que falhou aqui?» ou «consegue corrigir?». Os chips restantes são anexados a essa mensagem com os ids completos, pelo que o Chat lê diretamente as entradas, as saídas e o rasto por nó da execução em vez de procurar o Workflow. Para corrigir o Workflow, o Chat guarda, testa e verifica a alteração conforme descrito em [Criação de Workflows](#criacao-de-workflows).

A mensagem enviada mostra os chips por baixo da sua pergunta. Pertencem apenas a essa mensagem; as perguntas seguintes na mesma conversa mantêm o contexto do histórico.

## Perguntar Sobre Alertas

O Chat pode responder a perguntas sobre os [Alertas](./alerts-tab.md) que definiu:

- **O que existe** — "que Alertas tenho?", "há algum Alerta no Workflow de faturas?",
  "que Alertas estão a disparar neste momento?"
- **Como está configurado** — "qual é o limiar do Alerta de custos?", "como está isso configurado?"
- **Porque e quando disparou** — "porque disparou o Alerta de custos?", "quando foi o último acionamento?"

Para uma pergunta do tipo "porque disparou", o Chat lê o registo de disparo e cita o valor observado
real, o limiar e a janela exata que foi avaliada, além do detalhe contribuinte:
ids de execuções com falha e mensagens de erro para Alertas de erro, gasto por modelo para Alertas de custos, ou
a discriminação por origem de Trigger para Alertas de contagem de execuções. Reporta o que era verdade quando o Alerta
disparou em vez de recalcular a janela, porque a janela já passou e um novo cálculo
pode dar uma resposta diferente.

## Regras do Utilizador

As [Regras do Utilizador](../reference/user-settings.md) (configuradas nas Definições) são automaticamente injetadas em cada conversa de Chat como instruções ao nível do sistema. Defina-as uma vez para aplicar preferências persistentes a todos os pedidos de Chat.

## Trabalhar com Avaliações

O Chat pode criar, alterar e executar as suites em [Evals](./evals-tab.md), tanto suites de prompts como suites de agente:

- **Suite de prompts**: "cria uma suite de prompts para o meu prompt de resposta de suporte com 8 casos de teste e compara o gpt-4o com o gpt-4.1-mini". O Chat escreve os casos de teste com as respostas esperadas, seleciona um método de pontuação e guarda a suite.
  - Antes de criar a suite, define que credencial LLM e modelos utilizar. Com exatamente uma credencial LLM, utiliza essa e informa; caso contrário, pergunta.
  - Para a pontuação LLM-as-Judge, também pergunta se um juiz separado deve pontuar as respostas.
- **Suite de agente**: "verifica se o meu agente de suporte pesquisa sempre a documentação e nunca envia e-mails". O Chat localiza o agente e guarda as verificações de ferramentas e limites. Quando solicitado, executa o workflow, gerando uma entrada diferente para cada execução.
  - As execuções de suites de agente são execuções reais de workflow, pelo que os seus efeitos secundários ocorrem. O Chat indica quantas execuções inicia.
- **Baseline**: O Chat pode trabalhar com a baseline de um agente de três formas:
  - Reportá-la a partir das últimas execuções do agente.
  - Construí-la a partir das execuções que inicia ("executa-o 5 vezes e usa isso como baseline").
  - Guardar os valores que fornecer ("define a baseline para 3 segundos p95 e 0,01 $ por execução").
- **Execuções**: O Chat aguarda até um minuto por uma execução e depois reporta o resultado:
  - Para uma suite de prompts: a contagem de aprovações de cada modelo e os casos que falharam.
  - Para uma suite de agente: a taxa de aprovação, as verificações com falha e o desvio em relação à baseline.
  - Uma execução mais longa continua no Evals; peça ao Chat para a verificar novamente.

Depois de o Chat criar ou alterar uma suite, a resposta apresenta um cartão com o nome da suite, o respetivo tipo e um botão **Abrir no Evals**, à semelhança do cartão de um workflow guardado. Através do MCP, o resultado do `heym_chat` lista a ligação de cada suite guardada nessa chamada.

O mesmo funciona a partir de um cliente MCP através de `heym_chat` (consulte [Utilizar o Chat a partir de um cliente MCP](#utilizar-o-chat-a-partir-de-um-cliente-mcp)). As ferramentas de avaliação permanecem dentro do `heym_chat`; os clientes MCP não as visualizam como ferramentas separadas.

O Assistente de IA do editor não cria suites.

## Trabalhar com Avaliações

O Chat pode criar, alterar e executar as suites em [Evals](./evals-tab.md), tanto suites de prompts como suites de agente:

- **Suite de prompts**: "cria uma suite de prompts para o meu prompt de resposta de suporte com 8 casos de teste e compara o gpt-4o com o gpt-4.1-mini". O Chat escreve os casos de teste com as respostas esperadas, seleciona um método de pontuação e guarda a suite.
  - Antes de criar a suite, define que credencial LLM e modelos utilizar. Com exatamente uma credencial LLM, utiliza essa e informa; caso contrário, pergunta.
  - Para a pontuação LLM-as-Judge, também pergunta se um juiz separado deve pontuar as respostas.
- **Suite de agente**: "verifica se o meu agente de suporte pesquisa sempre a documentação e nunca envia e-mails". O Chat localiza o agente e guarda as verificações de ferramentas e limites. Quando solicitado, executa o workflow, gerando uma entrada diferente para cada execução.
  - As execuções de suites de agente são execuções reais de workflow, pelo que os seus efeitos secundários ocorrem. O Chat indica quantas execuções inicia.
- **Baseline**: O Chat pode trabalhar com a baseline de um agente de três formas:
  - Reportá-la a partir das últimas execuções do agente.
  - Construí-la a partir das execuções que inicia ("executa-o 5 vezes e usa isso como baseline").
  - Guardar os valores que fornecer ("define a baseline para 3 segundos p95 e 0,01 $ por execução").
- **Execuções**: O Chat aguarda até um minuto por uma execução e depois reporta o resultado:
  - Para uma suite de prompts: a contagem de aprovações de cada modelo e os casos que falharam.
  - Para uma suite de agente: a taxa de aprovação, as verificações com falha e o desvio em relação à baseline.
  - Uma execução mais longa continua no Evals; peça ao Chat para a verificar novamente.

Depois de o Chat criar ou alterar uma suite, a resposta apresenta um cartão com o nome da suite, o respetivo tipo e um botão **Abrir no Evals**, à semelhança do cartão de um workflow guardado. Através do MCP, o resultado do `heym_chat` lista a ligação de cada suite guardada nessa chamada.

O mesmo funciona a partir de um cliente MCP através de `heym_chat` (consulte [Utilizar o Chat a partir de um cliente MCP](#utilizar-o-chat-a-partir-de-um-cliente-mcp)). As ferramentas de avaliação permanecem dentro do `heym_chat`; os clientes MCP não as visualizam como ferramentas separadas.

O Assistente de IA do editor não cria suites.

## Relacionado

- [Separador MCP / A2A](./mcp-tab.md) – Exponha este motor a clientes MCP como a ferramenta `heym_chat`
- [Definições](../reference/user-settings.md) – Defina Regras de Utilizador aplicadas a todos os pedidos de chat
- [Separador Credenciais](./credentials-tab.md) – Adicione e faça a gestão de chaves de API
- [Separador Variáveis](./global-variables-tab.md) – Variáveis globais disponíveis para o Chat
- [Tipos de Nó](../reference/node-types.md) – Nós LLM e de agente para workflows
- [Nó de agente](../nodes/agent-node.md) – Agente de IA com chamada de ferramentas
- [Assistente de IA](../reference/ai-assistant.md) – Assistente do editor suportado pela mesma DSL de construção de workflows
- [Histórico de Execuções](../reference/execution-history.md) – Consulte execuções anteriores (botão Histórico no cabeçalho)
- [Separador Agendamentos](./scheduled-tab.md) – Calendário de execuções cron futuras (os mesmos dados que o Chat pode resumir)
- [Separador Alertas](./alerts-tab.md) – Alertas de limiar que o Chat pode listar e explicar
- [Destaque Contextual](../reference/contextual-showcase.md) – Orientação compacta na aplicação para esta página
- [Voz do Chat (TTS e STT)](../reference/chat-voice.md) – Leia mensagens em voz alta e fale mãos-livres com a ElevenLabs

## Chamadas de ferramentas e tamanho do contexto

Cada vez que o assistente invoca uma ferramenta (executar um workflow, listar execuções, construir um novo workflow), aparece um cartão recolhível na conversa. O cartão expande-se automaticamente enquanto a ferramenta é executada, mostrando os argumentos exatos. Quando a ferramenta termina, o cartão recolhe para um resumo de uma linha com o tempo decorrido. Clique em qualquer cartão para voltar a expandir os argumentos e o resumo da resposta.

Um pequeno indicador circular abaixo do campo de entrada mostra a utilização atual do contexto como percentagem da janela do modelo (por exemplo, `12% · ~9.2k`). Passe o cursor sobre o indicador para ver um detalhe: prompt de sistema, AGENTS.md, bloco de workflows, regras de utilizador, histórico e o texto que está a introduzir. Quando a utilização ultrapassa os 80%, o anel fica âmbar; aos 95%, fica vermelho.

Se a utilização se aproximar do limite, o Heym comprime automaticamente as mensagens mais antigas num resumo curto, utilizando o mesmo mecanismo que os nós de agente usam. Aparece um cartão "Contexto comprimido" em linha para mostrar o que aconteceu.
