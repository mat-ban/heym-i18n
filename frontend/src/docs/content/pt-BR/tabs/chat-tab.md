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
- **Credenciais** – Quando um Workflow criado ou editado pelo Chat precisa de uma credencial, o Chat pergunta qual usar, oferece criar uma nova na conversa ou permite que você continue sem. Você também pode pedir ao Chat para criar uma credencial ou atualizar uma que você possui; ele abre o formulário de credencial na conversa. O modelo vê o nome e o tipo da credencial, nunca seus valores. Consulte [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Tabelas de dados** – Quando um Workflow criado ou editado pelo Chat armazena registros, o Chat pergunta qual [tabela de dados](./datatable-tab.md) usar ou oferece criar uma com as colunas de que o Workflow precisa. Ele também pode listar suas tabelas e suas colunas. Ele nunca lê nem grava linhas. Consulte [AI Assistant › Data tables](../reference/ai-assistant.md#data-tables)
- **Respostas em streaming** – Veja a saída do modelo conforme ela é transmitida
- **Interromper resposta** – Interrompa a resposta em streaming atual a qualquer momento; interromper também limpa as mensagens na fila daquela conversa
- **Renderização de Markdown** – As respostas suportam formatação markdown, incluindo imagens em linha
- **Exibição de imagens** – Imagens incorporadas nas respostas (por exemplo, de geração de imagens por LLM) aparecem em linha; clique em qualquer imagem para visualizá-la em tela cheia. Pressione **Esc** ou o botão de voltar (no celular) para fechar a visualização em tela cheia
- **Copiar mensagens** – Copie qualquer mensagem para a área de transferência
- **Limpar chat** – Inicie uma nova conversa
- **Entrada de voz** – Use o botão de microfone para conversão de fala em texto (com suporte do navegador). Quando a gravação para, o Heym pode fazer uma leve limpeza na transcrição antes de você enviá-la
- **Workflows agendados** – Pergunte quando os Workflows cron são executados (hoje, esta semana, este mês ou um intervalo de datas personalizado). O assistente usa os mesmos dados de agendamento da aba [Scheduled](./scheduled-tab.md) e pode limitar os resultados aos Workflows que você possui ou incluir aqueles compartilhados com você
- **Histórico de execuções de Workflow** – Pergunte sobre um Workflow ("quantas vezes o relatório diário foi executado?", "ele falhou?", "quando foi a última execução?"). O Chat localiza o Workflow pelo seu ID e responde com base na contagem de execuções, detalhamento de status, horário da primeira e da última execução e duração média. Pergunte por que uma execução falhou ou o que ela retornou, e o Chat então abre essa execução específica para ler suas entradas, saídas e erros por Nó
- **Status de execução ao vivo** – Pergunte o que está em execução agora e o Chat responde com a contagem, os nomes dos Workflows, há quanto tempo cada execução está em andamento, em qual Nó ela está e um link direto para a execução ao vivo
## Usando o Chat a partir de um Cliente MCP

O motor de Chat também pode ser acessado de fora do navegador. Ative a **Heym Chat Tool** na [aba MCP](./mcp-tab.md) e os clientes MCP — Claude, Cursor e qualquer outro que fale MCP — recebem uma única ferramenta `heym_chat` que executa esse mesmo motor com todas as suas capacidades.

Essas conversas ficam no histórico desta aba, marcadas com um ícone de plug na lista de conversas. Abra uma para ler o que o cliente perguntou, ver os cards de ferramentas que ele acionou e continuar a conversa você mesmo. Responder a uma pergunta de esclarecimento funciona da mesma forma, seja quando o turno começou aqui ou a partir de um cliente MCP.

Via MCP, o Chat não lista, seleciona nem cria credenciais. Os Workflows que ele constrói deixam os campos de credencial vazios, e a resposta nomeia os Nós que precisam de uma credencial para que você possa configurá-los no editor.

As tabelas de dados também funcionam via MCP: o Chat lista suas tabelas, cria novas e as conecta aos Workflows que constrói. A pergunta sobre a tabela chega como texto no resultado, então responda com o mesmo `conversation_id`.

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
## Relacionados

- [Aba MCP](./mcp-tab.md) – Exponha este engine a clientes MCP como a ferramenta `heym_chat`
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
