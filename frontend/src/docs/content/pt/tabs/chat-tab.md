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
- **Credenciais** – Quando um workflow criado ou editado pelo Chat necessita de uma credencial, o Chat pergunta qual utilizar, oferece a criação de uma nova na conversa ou permite continuar sem credencial. Também pode pedir ao Chat para criar uma credencial ou atualizar uma que possua; este abre o formulário de credencial na conversa. O modelo vê o nome e o tipo da credencial, nunca os seus valores. Consulte [Assistente de IA › Credenciais](../reference/ai-assistant.md#credentials)
- **Tabelas de dados** – Quando um workflow criado ou editado pelo Chat armazena registos, o Chat pergunta qual [tabela de dados](./datatable-tab.md) utilizar ou oferece a criação de uma com as colunas necessárias ao workflow. Também pode listar as suas tabelas e respetivas colunas. Nunca lê nem escreve linhas. Consulte [Assistente de IA › Tabelas de dados](../reference/ai-assistant.md#data-tables)
- **Respostas em streaming** – Veja a saída do modelo à medida que é transmitida
- **Parar resposta** – Interrompa a resposta em streaming em qualquer momento; parar também limpa as mensagens em fila dessa conversa
- **Renderização de Markdown** – As respostas suportam formatação markdown, incluindo imagens em linha
- **Apresentação de imagens** – As imagens incorporadas nas respostas (por exemplo, de geração de imagens por LLM) aparecem em linha; clique em qualquer imagem para a visualizar em ecrã inteiro. Prima **Esc** ou o botão de retroceder (dispositivo móvel) para fechar a vista de ecrã inteiro
- **Copiar mensagens** – Copie qualquer mensagem para a área de transferência
- **Limpar chat** – Inicie uma nova conversa
- **Entrada de voz** – Utilize o botão do microfone para conversão de fala em texto (suportado pelo navegador). Quando a gravação termina, o Heym pode efetuar uma ligeira limpeza da transcrição antes de a enviar
- **Workflows agendados** – Pergunte quando são executados os workflows cron (hoje, esta semana, este mês ou um intervalo de datas personalizado). O assistente utiliza os mesmos dados de agendamento que o separador [Agendamentos](./scheduled-tab.md) e pode limitar os resultados aos workflows que possui ou incluir os partilhados consigo
- **Histórico de execuções de workflows** – Pergunte sobre um workflow ("quantas vezes foi executado o relatório diário?", "falhou?", "quando foi a última execução?"). O Chat procura o workflow pelo seu ID e responde com base na contagem de execuções, distribuição por estado, primeira e última execução e duração média. Pergunte porque falhou uma execução ou o que devolveu e o Chat abre essa execução individual para ler as suas entradas, saídas e erros por nó
- **Estado de execução em tempo real** – Pergunte o que está a ser executado neste momento e o Chat responde com a contagem, os nomes dos workflows, há quanto tempo cada execução está em curso, em que nó se encontra e uma ligação direta para a execução em tempo real

## Utilizar o Chat a partir de um Cliente MCP

O motor de Chat também pode ser acedido fora do navegador. Ative a **Heym Chat Tool** no [separador MCP](./mcp-tab.md) e os clientes MCP — Claude, Cursor e qualquer outro que fale MCP — obtêm uma única ferramenta `heym_chat` que executa este mesmo motor com todas as suas capacidades.

Essas conversas ficam no histórico deste separador, marcadas com um ícone de ficha na lista de conversas. Abra uma para ler o que o cliente pediu, ver os cartões de ferramentas que acionou e continuar o fio de conversa. Responder a uma pergunta de esclarecimento funciona da mesma forma, quer o turno tenha começado aqui ou a partir de um cliente MCP.

Através de MCP, o Chat não lista, escolhe nem cria credenciais. Os Workflows que constrói deixam os campos de credenciais vazios, e a resposta nomeia os nós que necessitam de uma credencial para que possa defini-los no editor.

As Tabelas de dados também funcionam através de MCP: o Chat lista as suas tabelas, cria novas e integra-as nos Workflows que constrói. A sua pergunta sobre a tabela chega como texto no resultado, pelo que deve respondê-la com o mesmo `conversation_id`.

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

## Relacionado

- [Separador MCP](./mcp-tab.md) – Exponha este motor a clientes MCP como a ferramenta `heym_chat`
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
