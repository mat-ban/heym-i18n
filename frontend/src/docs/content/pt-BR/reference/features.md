# Conjunto Completo de Recursos

Uma visão geral abrangente de todas as capacidades do Heym. Cada seção descreve um recurso ou conceito em poucas frases.

---

## Primeiros Passos

### [Introdução](../getting-started/introduction.md)

O Heym é uma infraestrutura para executar e governar agentes de IA em produção. Você constrói sistemas agênticos em um canvas visual e os executa com confiança: orquestre agentes, automatize processos de negócios, inspecione cada execução e mantenha os humanos no controle em sua própria infraestrutura. Ele oferece suporte a workflows visuais, nós com IA ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), um [AI Assistant](./ai-assistant.md), integrações ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), e-mail de entrada via [IMAP Trigger](../nodes/imap-trigger-node.md), saída via [Send Email](../nodes/send-email-node.md)), agendamento com [Cron](../nodes/cron-node.md) e portais de chat do [Portal](./portal.md) para usuários finais.

Consulte também [Conceitos Fundamentais](../getting-started/core-concepts.md), [Tipos de Nós](./node-types.md) e [Integrações de Terceiros](./integrations.md).

### [Por que o Heym](../getting-started/why-heym.md)

Por que o Heym percorre o ciclo de vida do agente (construir, orquestrar, executar, observar, avaliar, controlar, expor) e mostra o que um runtime auto-hospedado gerencia em cada etapa. Isso abrange o nó [LLM](../nodes/llm-node.md) e o [Agent Node](../nodes/agent-node.md) com chamada de ferramentas, ferramentas Python, conexões [MCP](../tabs/mcp-tab.md), skills e orquestração multiagente; triggers, retentativas e [distribuição de carga](./cluster.md); [Traces](../tabs/traces-tab.md) com custo em USD por execução e exportação OpenTelemetry; [Evals](../tabs/evals-tab.md); [checkpoints de revisão humana](./human-in-the-loop.md), guardrails, SSO e trilha de auditoria; e endpoints REST, MCP e Portal. Uma comparação de capacidades com n8n, Zapier e Make.com encerra a página.

Consulte também [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) e [Arquitetura de Agentes](./agent-architecture.md).

### [Início Rápido](../getting-started/quick-start.md)

Coloque seu primeiro workflow em execução em minutos: crie um workflow a partir da aba [Workflows](../tabs/workflows-tab.md), adicione um nó [Input](../nodes/input-node.md), um nó [LLM](../nodes/llm-node.md) e um nó [Output](../nodes/output-node.md), depois conecte-os. Configure o [LLM](../nodes/llm-node.md) com uma credencial e defina `userMessage` como `$input.text`; use Run ou o [AI Assistant](./ai-assistant.md) para executar ou gerar workflows com linguagem natural.

Combina naturalmente com [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) e [Expression DSL](./expression-dsl.md).

### [Conceitos Fundamentais](../getting-started/core-concepts.md)

Workflows são grafos direcionados de nós conectados por arestas; a execução flui dos nós de trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) através de nós de processamento até os nós [Output](../nodes/output-node.md). Cada nó possui um tipo, dados (configuração) e entradas/saídas; as arestas definem o fluxo de dados. Os nós referenciam dados upstream por meio de expressões do [Expression DSL](./expression-dsl.md), como `$nodeLabel.field`; nós independentes são executados em [paralelo](./parallel-execution.md) automaticamente.

Consulte também [Triggers](./triggers.md), [Execução em Paralelo](./parallel-execution.md) e [Estrutura de Workflow](./workflow-structure.md).

### [Execução e Implantação](../getting-started/running-and-deployment.md)

O Heym fornece `run.sh` para desenvolvimento local (banco de dados em Docker, backend FastAPI, frontend Vite) e `deploy.sh` para produção com Docker Compose. Ambos utilizam um arquivo `.env`; as variáveis principais incluem `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` e `ALLOW_REGISTER`. O desenvolvimento é executado em portas configuráveis de frontend e backend; a produção serve a API sob `/api` através do contêiner de frontend.

Consulte também [Segurança](./security.md), [Enterprise](./enterprise.md) e [Configurações](./user-settings.md).

### [Migrar para o Heym](../getting-started/migrate-to-heym.md)

A ferramenta AI Convert transforma um workflow de outra plataforma (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) ou uma descrição em linguagem natural em um workflow do Heym, transmitido ao vivo para um canvas e pronto para [baixar e importar](./download-import.md). Ela executa uma verificação de segurança por IA e, em seguida, gera o DSL com limites de entrada e de taxa já configurados. Acesse em [heym.run/convert](https://heym.run/convert).

Consulte também [Início Rápido](../getting-started/quick-start.md), [Download e Importação](./download-import.md) e [AI Assistant](./ai-assistant.md).

---

## Nós

### Triggers
#### [Input](../nodes/input-node.md)

O nó Input é o ponto de entrada para workflows que recebem dados do usuário ou do chamador da API. Ele oferece suporte a um ou vários campos de entrada e expõe metadados da requisição (headers, query params). Acesse os campos do body via `$nodeLabel.body.fieldKey`, os headers via `$nodeLabel.headers` e a query via `$nodeLabel.query`.

Combina naturalmente com [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) e [Output](../nodes/output-node.md). Para referências de payload e acesso a campos, consulte [Expression DSL](./expression-dsl.md) e [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

O nó Cron dispara um workflow em um agendamento usando uma expressão cron padrão de cinco campos. Nenhuma entrada do usuário é necessária — o workflow é executado automaticamente nos horários especificados (por exemplo, a cada hora, diariamente, a cada 15 minutos). A saída é um evento de trigger sem payload.

Consulte também [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) e [Execution History](./execution-history.md) para execuções agendadas e com atraso.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

O nó IMAP Trigger consulta uma caixa de entrada em um intervalo configurável de minutos e inicia um workflow para cada novo e-mail detectado. Ele produz headers analisados, listas de remetentes e destinatários, corpos em texto simples e HTML, metadados de anexos e um timestamp do trigger. Utilize-o para triagem de caixas de entrada de suporte, roteamento de caixa de correio para o [Slack](../nodes/slack-node.md) ou fluxos de aprovação orientados por e-mail com [Human-in-the-Loop](./human-in-the-loop.md).

Combina com [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) e [Slack](../nodes/slack-node.md) para workflows de triagem de entrada e resposta.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

O nó Heym Trigger inicia um workflow quando o próprio Heym publica um evento da plataforma: `heym.started`, `workflow.created`, `workflow.updated` ou `workflow.deleted`. A entrega é em lote — todo evento publicado dentro de uma mesma janela de despacho de cinco segundos chega em uma única execução como `$nodeLabel.events`, sempre um array. Cada evento é reivindicado por meio de uma restrição única de banco de dados, de modo que é disparado exatamente uma vez por nó assinante, independentemente de quantos workers, containers ou máquinas estejam em execução. Utilize-o para trilhas de auditoria de alterações em workflows, anúncios de deploy e resumos de integridade da instância.

Combina com o nó [Heym](../nodes/heym-node.md) para consultar o workflow alterado e com [Loop](../nodes/loop-node.md) para agir uma vez por evento.

#### [Heym](../nodes/heym-node.md)

O nó Heym lê os próprios dados do Heym por meio de três operações: `listWorkflows` retorna todos os workflows que o proprietário pode acessar, com contagens de nós e timestamps; `getWorkflow` retorna a estrutura de nós e arestas de um workflow; e `getExecutionHistory` retorna entradas do histórico de execução do mais recente para o mais antigo, com filtros opcionais de status, janela de tempo e limite, além de totais agrupados por status. Os resultados são restritos ao proprietário do workflow no qual o nó reside, de modo que uma execução iniciada por cron, um portal ou um evento retorna os mesmos dados que uma execução manual. `getWorkflow` retorna a configuração completa dos nós, o que torna possível auditar um workflow em busca de chaves ou tokens codificados diretamente; ele não expõe nada que o proprietário do workflow já não pudesse abrir no editor. Nenhuma credencial é necessária.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

O nó WebSocket Trigger abre uma conexão de cliente de saída para um servidor WebSocket externo e inicia o workflow em `onMessage`, `onConnected` ou `onClosed`. Ele expõe payloads de mensagens analisados, estado de reconexão, metadados de fechamento e a URL do socket para expressões downstream.

Combina com [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) e [SSE Streaming](./sse-streaming.md) para integrações em tempo real.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

O nó Telegram Trigger recebe atualizações de webhook do bot e inicia o workflow imediatamente. Ele expõe o payload completo da atualização, o objeto de mensagem principal, callback queries, headers sanitizados e um timestamp do trigger. Utilize-o para chatbots, assistentes de IA no [Telegram](../nodes/telegram-node.md) e fluxos acionados por botões.

Combina com [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) e [Webhooks](./webhooks.md) para workflows acionados por bots.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

O nó Slack Trigger recebe webhooks da Slack Events API e inicia um workflow automaticamente após verificar a assinatura da requisição. Ele expõe o payload do evento e headers sanitizados para roteamento downstream, classificação baseada em [LLM](../nodes/llm-node.md) e fluxos de resposta.

Combina com [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) e [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

O nó Discord Trigger recebe webhooks da Discord Interactions API, verifica assinaturas Ed25519 com a credencial `discord_trigger` selecionada e inicia o workflow. Ele expõe o payload completo da interação, dados de comando, headers sanitizados e metadados do trigger para roteamento downstream ou respostas.

Combina com [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) e [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

O nó RabbitMQ envia ou recebe mensagens de filas e exchanges do RabbitMQ. Utilize-o para workflows orientados a mensagens e processamento de eventos. O modo de envio publica uma mensagem com atraso opcional; o modo de recebimento atua como um [trigger](./triggers.md), de modo que o workflow é iniciado quando uma mensagem chega. A saída inclui status, message_id e body.

Combina com [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) e [Parallel Execution](./parallel-execution.md) para processamento orientado a eventos.

#### [Error Handler](../nodes/error-handler-node.md)

O nó Error Handler é executado automaticamente quando qualquer nó do workflow falha. Não são necessárias arestas de entrada; ele é acionado pelo engine. A saída inclui a mensagem de erro, o label do nó que falhou, o tipo do nó e o timestamp. Utilize-o para enviar notificações por meio de [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) ou [Send Email](../nodes/send-email-node.md), registrar erros ou retornar respostas de erro personalizadas.

Como alternativa ao tratamento de erros no canvas, um workflow também pode delegar falhas a um workflow separado — consulte [Error Workflow](#error-workflow). Se o canvas já contiver um nó Error Handler, o error workflow **não** será chamado (o handler local tem precedência).

Os destinos de notificação mais comuns são [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) e [Send Email](../nodes/send-email-node.md); os detalhes de execução são mais fáceis de inspecionar no [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

O nó AI Agent é um nó [LLM](../nodes/llm-node.md) com tool calling. Ele pode executar ferramentas Python, chamar nós conectados do canvas como ferramentas, conectar-se a servidores [MCP](../tabs/mcp-tab.md), usar skills (arquivos de instrução e scripts Python opcionais), atuar como um orquestrador que delega a outros nós de agente e chamar outros workflows como ferramentas. A saída fica disponível como `$nodeLabel.text`. Um toggle opcional **Extra Body** anexa um objeto JSON de parâmetros de requisição específicos do provedor a cada requisição no loop de tool calling; ele fica desativado por padrão. Um toggle opcional **Use Responses API** encaminha as chamadas de modelo do agente pela Responses API, o que preserva o raciocínio do modelo entre chamadas de ferramentas, de modo que um modelo de raciocínio mantém sua cadeia de pensamento ao longo de um loop de múltiplas etapas; ele fica desativado por padrão e funciona com OpenAI e credenciais personalizadas.

As ferramentas de nós do canvas permitem que um agente chame nós de workflow configurados diretamente do canvas. Conecte um nó compatível à alça de ferramentas do agente e, em seguida, marque campos específicos como fornecidos pelo agente com o ícone de bot. Esses campos se tornam parâmetros de ferramenta em tempo de execução, enquanto credenciais e campos não marcados permanecem fixos na configuração do nó.

A seção Skills agora inclui **AI Build** para criar novas skills, uma ação de edição inline por IA para skills existentes, download individual de cada skill em ZIP e um switch opcional **Enable Drive files** para skills que precisam ler arquivos do Heym Drive em tempo de execução. O modal do Skill Builder transmite uma conversa de chat à esquerda, aceita arquivos por arrastar e soltar com cada comentário de fine-tune, exibe uma pré-visualização somente leitura em tempo real dos arquivos `SKILL.md` e `.py` gerados à direita, pode baixar essa pré-visualização como ZIP e salva os arquivos de fine-tune enviados de volta como assets empacotados da skill por meio do mesmo fluxo de ingestão de ZIP usado em uploads manuais.

Com o **[Agent Persistent Memory](./agent-persistent-memory.md)** habilitado, cada nó de agente mantém seu próprio grafo de conhecimento: os fatos são carregados no system prompt quando não vazios, e execuções bem-sucedidas disparam uma mesclagem em segundo plano de novas entidades e relacionamentos. Sub-agentes usam grafos separados. Você pode **compartilhar** o grafo de um agente com outros agentes (do mesmo workflow ou de outros) com acesso somente leitura ou leitura/gravação a partir do diálogo do grafo. O controle de cérebro no canvas abre o editor de grafo.

Os nós de agente também podem entrar no modo [Human-in-the-Loop](./human-in-the-loop.md). Nesse modo, o agente recebe uma ferramenta `request_human_review` e pode pausar em etapas específicas que exigem aprovação, criar um link público de revisão de uso único, expor um ramo `review` no canvas para fluxos de notificação e aguardar até que um revisor aceite, edite ou recuse o texto de revisão em Markdown. O campo HITL do nó atua como diretrizes de aprovação para quando perguntar, enquanto o resumo voltado ao revisor é gerado a partir de cada solicitação de revisão. Para ferramentas [MCP](../tabs/mcp-tab.md), o Heym usa o modelo para interpretar essas instruções escritas como `always`, `once` ou `never`, de modo que a linguagem livre de aprovação é mapeada para uma política concreta em tempo de execução. A execução é marcada como `pending` e é retomada a partir do snapshot de execução armazenado após a chegada da decisão, e a mesma execução do agente pode pausar mais de uma vez se etapas posteriores também exigirem revisão.

Os nós de agente comprimem automaticamente seu histórico de mensagens acumulado quando ele se aproxima de 80% da janela de contexto do modelo. O system prompt, a primeira mensagem do usuário e a mensagem mais recente do usuário são sempre preservados; tudo entre eles é resumido usando o mesmo modelo e credencial. Os eventos de compressão são visíveis no painel Debug, no [Execution History](./execution-history.md) e na aba [Traces](../tabs/traces-tab.md).

Consulte também [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) e [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

O nó Codex executa a CLI do OpenAI Codex dentro de um workspace Heym isolado. Ele aceita uma credencial do Codex (faça login com o ChatGPT para usar sua assinatura sem custos de API por token, ou cole um access token), uma credencial do GitHub, URL do repositório, branch base, prompt da tarefa, modo de publicação (`diff_only` ou `draft_pr`), nome do branch e timeout. O runner clona o repositório localmente, passa o pacote de tokens do ChatGPT ou o `CODEX_ACCESS_TOKEN` apenas para o processo do Codex e retorna um resumo estruturado, notas de validação, arquivos alterados, diff, metadados de uso e uma URL opcional de draft PR.

Quando o Codex retorna `needs_input`, o workflow pausa e expõe o branch `question`. Conecte esse branch ao Slack, e-mail ou outro nó de notificação; o link público de acompanhamento retoma o snapshot de execução salvo após o envio da resposta. O nó Codex também pode ser anexado a um AI Agent como ferramenta, permitindo que o agente delegue tarefas de codificação; como ferramenta, um resultado `needs_input` é retornado inline ao agente em vez de pausar o workflow.

Veja também [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) e [Node Types](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

O nó OpenCode Go executa a CLI do OpenCode (Go) contra um repositório do GitHub. O isolamento segue o padrão do Codex: localmente é executado como um subprocesso do host, enquanto implantações em Docker o executam dentro de um contêiner irmão reforçado que compartilha o volume do workspace. Ele aceita uma credencial do OpenCode Go (uma chave de API do gateway com uma base URL opcional), uma credencial do GitHub, URL do repositório, branch base, prompt da tarefa, modo de publicação, nome do branch, timeout e um modelo `opencode-go/<model>` escolhido a partir de uma lista de modelos pesquisável e dinâmica (com um fallback integrado). O Heym executa todas as operações de git/GitHub no host e nunca coloca o token do GitHub dentro do sandbox; o OpenCode apenas edita arquivos em disco. O nó retorna um resumo estruturado, notas de validação, arquivos alterados, diff e uma URL opcional de pull request. Ele pode ser anexado a um AI Agent como ferramenta.

Veja também [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) e [Node Types](./node-types.md).

#### [LLM](../nodes/llm-node.md)

O nó LLM processa texto com um modelo de linguagem ou gera imagens. Ele oferece suporte a geração de texto, visão (entrada de imagem), geração de imagem, saída JSON estruturada, execução nativa de Batch API do provedor para endpoints OpenAI e compatíveis com OpenAI suportados, e um toggle opcional **Use Responses API** que encaminha a chamada pela Responses API em vez de Chat Completions (desativado por padrão; funciona com OpenAI e credenciais personalizadas, e não pode ser combinado com o modo Batch). Configure credencial, modelo, mensagens de sistema e de usuário, temperatura e max tokens; use [Expression DSL](./expression-dsl.md) nos prompts. No modo batch, o `userMessage` deve resolver para um array, o nó emite um branch `batchStatus` com atualizações de progresso, e a saída final inclui resultados de batch por item. Um toggle opcional **Extra Body** anexa um objeto JSON de parâmetros de requisição específicos do provedor (por exemplo, `{"thinking": {"type": "disabled"}}`) a cada chamada de API; ele fica desativado por padrão. [Guardrails](./guardrails.md) opcionais bloqueiam conteúdo inseguro antes da chamada.

Combina naturalmente com [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) e [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

O nó Decision faz perguntas tipadas a um modelo de decisão sobre o estado da execução e retorna probabilidades em vez de texto corrido. Um campo **State** carrega o que o modelo deve ler — uma expressão isolada mantém seu próprio tipo, então `$input` envia o objeto em vez de seu texto — e uma lista de perguntas carrega os julgamentos. As perguntas vêm em três formatos: **noul** responde se uma condição é verdadeira, **choice** escolhe uma opção de um conjunto que você define e retorna a distribuição completa, e **score** avalia o estado ao longo de níveis ordenados e pode ficar entre eles. Respostas de choice e score também carregam uma confiança, então um [Switch](../nodes/switch-node.md) pode rotear com base na resposta enquanto um [Condition](../nodes/condition-node.md) faz o gate com base em quão certa ela foi. **Generate with AI** elabora o template de estado e as linhas de perguntas a partir de uma frase simples, e **Custom request body** envia JSON escrito à mão para um endpoint cujo contrato seja diferente. A resposta do provedor é repassada sem alterações, e cada chamada é registrada em [Traces](../tabs/traces-tab.md).

Requer uma credencial de Decision Model; combina naturalmente com [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) e [Agent Node](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

O nó RAG / Vector Store insere, faz upsert, exclui e pesquisa documentos em um vector store para geração aumentada por recuperação. Um dropdown de Database seleciona o backend — **Qdrant** (servidor externo) ou **Postgres (pgvector)** (banco de dados do próprio Heym, sem serviço externo), com padrão em Qdrant. Escolha um vector store na aba [Vectorstores](../tabs/vectorstores-tab.md) e defina a operação como insert, upsert, delete ou search. Upsert e delete endereçam um documento por um id único armazenado dentro do payload — um **Document ID Field** nomeia esse campo (padrão `doc_id`) e **Document ID** carrega seu valor — de modo que um documento mantém o id que seu próprio sistema já utiliza: upsert substitui todos os pontos correspondentes antes de armazenar a nova versão, e delete informa se algo foi correspondido. Os metadados do documento aceitam expressões em seus valores, então `{"url": "$start.url"}` armazena o que a execução produziu. A busca suporta filtros de metadados e reranking opcional com Cohere, e retorna um array de resultados com texto, score, metadados, flag de reranked e count para uso em fluxos de [LLM](../nodes/llm-node.md) ou [Agent Node](../nodes/agent-node.md).

Nós downstream comuns são [LLM](../nodes/llm-node.md) e [Agent Node](../nodes/agent-node.md); a configuração do vector store fica em [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

O nó MCP Call chama uma ferramenta [MCP](../tabs/mcp-tab.md) específica diretamente, sem que um LLM decida qual ferramenta invocar. Use-o quando você sabe exatamente qual ferramenta executar em tempo de design — para execução determinística de ferramentas MCP em etapa única dentro de um workflow. Configure uma conexão (SSE, Streamable HTTP ou stdio; mesmos campos da conexão MCP do [Agent Node](../nodes/agent-node.md)), clique em **Fetch Tools** para popular um dropdown, selecione uma ferramenta e preencha os campos de argumentos que são renderizados automaticamente a partir do input schema da ferramenta. Cada argumento aceita um valor estático ou uma [expressão DSL](./expression-dsl.md) como `$userInput.body.text`. O resultado fica disponível como `$nodeLabel.result` (objeto JSON se parseável, caso contrário string). O nó MCP Call não pode ser conectado a um [Agent Node](../nodes/agent-node.md) como ferramenta de canvas.

Veja também [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) e [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

O nó Condition ramifica o workflow com base em uma expressão if/else. Ele possui dois handles de saída: um para quando a condição é verdadeira e outro para quando é falsa. Use operadores de comparação e lógicos da [Expression DSL](./expression-dsl.md) na expressão de condição; o nó repassa a entrada para o branch escolhido.

Veja também [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) e [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

O nó Switch encaminha a execução para caminhos diferentes ao corresponder um valor a casos. Configure uma expressão a ser avaliada e uma lista de valores de caso; cada caso recebe um handle de origem e um handle padrão é usado para valores sem correspondência. A entrada é repassada para o branch correspondido.

Use [Condition](../nodes/condition-node.md) para ramificação binária e [Merge](../nodes/merge-node.md) para reunir caminhos roteados; as regras de correspondência são abordadas em [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

O nó Merge aguarda múltiplas entradas paralelas e as combina em uma única saída. Defina o número de entradas a aguardar; o nó produz um objeto mesclado assim que todos os branches forem concluídos. Use-o para unir resultados de branches paralelos antes de continuar; não o use quando branches paralelos terminarem em nós Output separados.

Veja também [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) e [Output](../nodes/output-node.md) ao recombinar branches.

#### [Loop](../nodes/loop-node.md)

O nó Loop itera sobre um array, executando os nós downstream para cada item. Ele exige uma back-connection do último nó do corpo da iteração para avançar. Dentro do corpo do loop use `item`, `index`, `total`, `isFirst` e `isLast`; o loop possui saídas separadas para o caminho de iteração e o caminho de conclusão.

Combina com [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) e [Expression DSL](./expression-dsl.md) para workflows iterativos.

### Data

#### [Set](../nodes/set-node.md)

O nó Set transforma e mapeia dados de entrada para uma saída personalizada. Defina mapeamentos chave-valor em que cada valor é uma expressão da [Expression DSL](./expression-dsl.md). Use-o para maiúsculas, substring, concatenação, números aleatórios e transformações semelhantes. Acesse a saída pela chave (por exemplo, `$setNode.keyName`). Quando conectado a um agent como ferramenta de canvas, os valores de mapeamento podem ser marcados como fornecidos pelo agent para que o agent os preencha em tempo de execução. Para chamar outros workflows, use o nó [Execute](../nodes/execute-node.md).

Veja também [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) e [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

O nó Converter converte dados entre formatos sem escrever código. As conversões de texto são `csvToJson` (texto CSV em um array de objetos de linha, ou arrays quando não há cabeçalho), `jsonToCsv` (um array de objetos/linhas em texto CSV), `xmlToJson` (texto XML em um objeto) e `jsonToXml` (um objeto em texto XML). Configure a direção da conversão e a expressão de origem; as conversões CSV utilizam adicionalmente um delimitador e o tratamento de cabeçalho, e `jsonToCsv` pode fixar uma ordem explícita de colunas. Aspas, delimitadores incorporados e quebras de linha incorporadas seguem a RFC 4180. Atributos XML usam prefixos `@`, texto misturado com atributos usa `#text`, elementos repetidos tornam-se arrays, e a expansão de entidades XML está desabilitada. O mesmo nó também funciona em arquivos armazenados. `imageToText` e `pdfToText` executam o Tesseract OCR, lendo um arquivo do Heym Drive (`$Upload.file.id` de um Trigger de upload de arquivo, o resultado de um nó Drive, ou um arquivo gerado por um agente), escolhendo o idioma automaticamente a partir do script detectado ou usando códigos que você nomear, como `tur` ou `eng+tur`, e normalizando o texto para UTF-8 por padrão, com normalização NFC opcional e charsets mais restritos como `cp1254`. `fileConvert` reescreve um arquivo armazenado em outro formato, documentos através do pandoc e imagens através do Pillow, e salva o resultado como um novo arquivo no Drive sem tocar no original. O resultado está disponível como `$converterNode.result`, com `.language`, `.encoding`, `.page_count`, `.pages` e `.file` ao lado dele para execuções de OCR, e `.id`, `.filename` e `.download_url` para `fileConvert`.

Veja também [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) e [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

O nó Code executa o Python que você escreve, com seu próprio `requirements.txt`, em um container que é criado e destruído a cada execução. Seu código define uma função `main(params)` e retorna qualquer valor serializável em JSON, que se torna `$codeNode.result`; tudo o que ele imprime é capturado separadamente como `$codeNode.logs`, e `$codeNode.install` informa qual ferramenta instalou as dependências. Os parâmetros são configurados como um objeto JSON cujas expressões `$` são resolvidas antes da execução, e o código os lê com notação de ponto, como `params.user.name` ou `params.orders[0].id`. As dependências são instaladas com `uv`, com fallback para `pip` em pacotes que o `uv` não consegue lidar, sem cache entre execuções; deixar `requirements.txt` vazio pula completamente a instalação e é muito mais rápido. A fase de execução não tem rede, a menos que `codeAllowNetwork` esteja ativado, enquanto a instalação de dependências sempre acessa o PyPI. O sandbox é executado como não-root com todas as capabilities removidas, um sistema de arquivos raiz somente leitura, sem socket Docker e sem acesso a segredos do backend, limitado a 512 MB de memória, uma CPU, 256 processos, 120 segundos de instalação e 60 segundos de execução. O Docker é obrigatório e não há modo de fallback: sem um daemon acessível, o nó falha em vez de executar seu código no processo do backend.

#### [Variable](../nodes/variable-node.md)

O nó Variable define ou atualiza uma variável local do workflow (`$vars.variableName`) ou uma [variável global](./global-variables.md) persistente (`$global.variableName`). Use-o para contadores, listas acumuladas e estado compartilhado. Configure o nome da variável, a expressão de valor, a coerção de tipo e se deve armazenar no armazenamento global. Variáveis do tipo array suportam `$array()` e `.add()`.

Combina com [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) e [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

O nó Execute chama outro workflow (sub-workflow) e passa entrada para ele. Especifique o workflow de destino por ID e forneça a entrada por meio de uma única expressão ou mapeamentos chave-valor. A saída inclui workflow_id, status e outputs; use-o para lógica reutilizável, não para transformação de dados (use Set para isso).

Veja também [Canvas Features](./canvas-features.md) para Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) e [Output](../nodes/output-node.md).

### Integrações

#### [HTTP](../nodes/http-node.md)

O nó HTTP faz requisições HTTP usando configuração no estilo cURL. Ele pode ser um ponto de partida do workflow (sem aresta de entrada) ou receber entrada de nós anteriores. A resposta está disponível como status, headers e body (JSON analisado quando aplicável). Use [Credentials](./credentials.md) para autenticação Bearer ou cabeçalho personalizado.

Combina com [Webhooks](./webhooks.md), [Credentials](./credentials.md) e [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

O nó WebSocket Send abre uma conexão de cliente de saída, envia uma mensagem de texto/JSON/binária e a fecha. Use-o para publicar a saída do workflow em sistemas em tempo real sem criar um endpoint de socket hospedado pelo Heym.

Veja também [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) e [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

O nó Telegram envia uma mensagem de bot para um chat, grupo ou canal. Configure uma [credencial](./credentials.md) do Telegram, defina `chatId` e componha a `message` de saída com expressões do [Expression DSL](./expression-dsl.md). Ele se combina naturalmente com o [Telegram Trigger](../nodes/telegram-trigger-node.md) para workflows conversacionais e com o [Error Handler](../nodes/error-handler-node.md) para alertas de operadores.

Consulte também [Integrações de Terceiros](./integrations.md) e [Credenciais](./credentials.md) para padrões de configuração e credenciais.

#### [Slack](../nodes/slack-node.md)

O nó Slack envia uma mensagem para um canal do Slack por meio de um Incoming Webhook. Configure uma [credencial](./credentials.md) do Slack e uma expressão de mensagem. Utilize-o para notificações, alertas e relatórios de erros; a saída passa pela entrada.

Combina com [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) e [Integrações de Terceiros](./integrations.md).

#### [Discord](../nodes/discord-node.md)

O nó Discord envia uma mensagem para um canal do Discord por meio de um Incoming Webhook. Configure uma [credencial](./credentials.md) do Discord, componha a mensagem de saída com o [Expression DSL](./expression-dsl.md) e, opcionalmente, defina substituições de nome de usuário ou avatar do webhook.

Combina com [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) e [Integrações de Terceiros](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

O nó Send Email envia e-mails via SMTP. Configure uma [credencial](./credentials.md) SMTP e expressões do [Expression DSL](./expression-dsl.md) para destinatário(s), assunto e corpo. Utilize-o para notificações, alertas e e-mails transacionais. A saída inclui status, to e subject.

O [IMAP Trigger](../nodes/imap-trigger-node.md) complementa o Send Email ao lidar com e-mails recebidos. Juntos, eles permitem que um workflow leia e-mails recebidos de uma caixa de entrada compartilhada, resuma-os ou classifique-os com nós de IA e envie uma mensagem de acompanhamento ou escalonamento. O [Telegram Trigger](../nodes/telegram-trigger-node.md) e o [nó Telegram](../nodes/telegram-node.md) fornecem o mesmo padrão de entrada/saída para workflows de chat orientados por bot.

Para fluxos de notificação bidirecionais, ele também combina bem com [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) e [Integrações de Terceiros](./integrations.md).

#### [Redis](../nodes/redis-node.md)

O nó Redis executa operações no Redis: set, get, hasKey e deleteKey. Utilize-o para cache, limitação de taxa e armazenamento de chave-valor. Configure uma [credencial](./credentials.md), o tipo de operação, a expressão de chave e, para operações set, o valor e o TTL opcional. A saída varia conforme a operação (value, success, exists, deleted).

Combina com [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) e [Parallel Execution](./parallel-execution.md) para cache, limitação e coordenação.

#### [Grist](../nodes/grist-node.md)

O nó Grist lê, grava e gerencia dados em planilhas do Grist. As operações incluem getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables e listColumns. Forneça o ID do documento, o ID da tabela e, para create/update, os dados do registro usando os IDs das colunas. Utilize-o para CRUD, atualizações em lote e automação de planilhas.

Consulte também [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) e [Integrações de Terceiros](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

O nó Google Sheets lê, grava e gerencia dados de planilhas via OAuth2. Utilize-o para ler relatórios, anexar resultados de workflows, atualizar rastreadores e limpar ou inspecionar abas de planilhas dentro de um workflow. Assim como o [BigQuery](../nodes/bigquery-node.md), ele usa uma credencial de integração do Google e se encaixa bem ao lado do [Grist](../nodes/grist-node.md) quando dados de planilhas fazem parte do fluxo.

Combina com [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) e [Integrações de Terceiros](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

O nó BigQuery executa consultas SQL e insere linhas em conjuntos de dados do Google BigQuery via OAuth2. Ele é útil para workflows de análise, pipelines de relatórios e gravação de dados de eventos estruturados a partir de execuções de workflows. Ele frequentemente combina com [Set](../nodes/set-node.md) para modelar linhas e com [Google Sheets](../nodes/google-sheets-node.md) para relatórios mais leves orientados a planilhas.

Combina com [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) e [Integrações de Terceiros](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

O nó Google Drive lista, baixa, atualiza e exclui arquivos e pastas do Drive via OAuth2, e pode copiar um arquivo do Drive diretamente para o [Heym Drive](../nodes/drive-node.md) com sua operação `syncToHeymDrive`. Google Docs, Sheets e Slides não possuem bytes baixáveis, portanto o nó os exporta automaticamente — Docs para PDF, Sheets para XLSX, Slides para PPTX — com uma opção de substituição do formato de destino. As exclusões movem os itens para a lixeira do Drive, a menos que "Delete permanently" esteja habilitado, e o nó se recusa a excluir uma pasta por meio da operação de arquivo ou vice-versa. Assim como o [Google Sheets](../nodes/google-sheets-node.md), ele utiliza uma credencial OAuth2 fornecida pelo Google; observe que esta solicita acesso total ao Drive, portanto revise [Credential Sharing](./credentials-sharing.md) antes de compartilhá-la.

Combina com [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) e [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

O nó GitHub fornece 40 ações nativas da GitHub REST que abrangem repositórios, organizações e usuários, issues, pull requests, reviews, releases, workflows do Actions, insights de tráfego e arquivos de repositório. Utilize-o para triagem de issues, automação de reviews, dispatch de workflows e espera de conclusão, automação de releases e atualizações de arquivos de repositório sem construir requisições HTTP manualmente. Ele suporta GitHub.com e `base_url` opcional do GitHub Enterprise na credencial.

Combina com [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) e [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

O nó Jira conecta workflows ao Jira Cloud ou às APIs REST do Jira Data Center / Server para automação de projetos, issues, comentários, anexos, usuários, notificações e transições. Ele pode listar projetos, pesquisar issues com JQL, criar ou atualizar issues, inspecionar changelogs, notificar stakeholders, gerenciar comentários e anexos, buscar ou gerenciar usuários, listar transições disponíveis e mover issues por meio de um transition ID. Utilize uma credencial Jira com e-mail Atlassian, API token, URL base do site e modo de implantação.

Combina com [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) e [Third-Party Integrations](./integrations.md) para intake de suporte, triagem de bugs e workflows de release.

#### [Linear](../nodes/linear-node.md)

O nó Linear conecta workflows à API GraphQL do Linear para automação de workspace e issues. Ele pode listar times, projetos, issues, estados de workflow, membros do time e comentários; criar, atualizar, excluir e vincular issues; e criar, atualizar, resolver, reabrir ou excluir comentários. Utilize uma chave de API pessoal do Linear ou credencial OAuth2 e, em seguida, descubra os UUIDs de time, projeto, estado e responsável a partir das operações de listagem antes de criar ou atualizar issues.

Combina com [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) e [Third-Party Integrations](./integrations.md) para workflows de intake, triagem e backlog de engenharia.

#### [Supabase](../nodes/supabase-node.md)

O nó Supabase lê e modifica tabelas expostas por meio do Supabase PostgREST. Ele funciona bem para backends de produtos, dados de usuário/perfil, estado de workflow e automações no estilo CRUD que desejam acesso a banco de dados sem a configuração manual de requisições HTTP.

Combina com [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) e [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

O nó ClickHouse executa operações de CRUD, contagem e SQL bruto em um banco de dados ClickHouse externo por meio de sua interface HTTP. Ele é adequado para pipelines de analytics, registro de eventos e workflows de relatórios: insira eventos conforme ocorrem e, em seguida, agregue-os ou conte-os com `query`/`count`. Ele espelha o conjunto de operações do [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) além de uma alternativa de SQL bruto, com `update`/`remove` executados como mutações do ClickHouse.

Combina com [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) para relatórios agendados e [Third-Party Integrations](./integrations.md).

#### [Notion](../nodes/notion-node.md)

O nó Notion gerencia bancos de dados, fontes de dados, páginas e blocos do Notion por meio da API atual do Notion (`2026-03-11`). Ele suporta busca, CRUD de páginas, operações de banco de dados e fontes de dados, blocos filhos, append/update/delete de blocos e trash/restore. Utilize um token de integração interna ou uma credencial OAuth de integração pública do Notion. O editor pode pesquisar e paginar com cursor as fontes de dados e páginas pai acessíveis. Credenciais compartilhadas funcionam da mesma forma que credenciais próprias para a execução de workflows.

Para chamadas REST personalizadas, `$credentials.YourNotionCredential` é resolvido para o mesmo bearer token. Combina com [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) e [Third-Party Integrations](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

O nó Sentry automatiza organizações, projetos, equipes, issues, eventos e releases do Sentry por meio da API REST do Sentry. Utilize-o para triagem de alertas, atualizações de status de issues, automação de releases, consulta de eventos e configuração ou limpeza de projetos e equipes. Ele oferece suporte ao Sentry SaaS e ao Sentry auto-hospedado por meio de uma base URL opcional na credencial.

Combina com [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) e [Third-Party Integrations](./integrations.md) para workflows de incidentes e releases.

#### [DataTable](../nodes/datatable-node.md)

O nó DataTable lê, grava e gerencia dados em Heym DataTables (armazenamento estruturado próprio da plataforma). As operações incluem find, getAll, getById, insert, update, remove e upsert. Nenhuma credencial externa é necessária. As tabelas são gerenciadas na aba de dashboard [DataTable](../tabs/datatable-tab.md) e acessadas diretamente pelo proprietário do workflow.

Combina com [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) e a [aba DataTable](../tabs/datatable-tab.md) para armazenamento estruturado próprio da plataforma.

#### [Drive](../nodes/drive-node.md)

O nó Drive gerencia arquivos gerados por skills diretamente dentro de um workflow. As operações incluem delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams e unshareWithMyTeams para gerenciamento de acesso somente leitura por equipes; a conversão de formato fica no nó [Converter](../nodes/converter-node.md). Referencie o arquivo com `$agentLabel._generated_files[0].id`; as saídas incluem status, file_id, download_url atualizada para restrições de link e shared_team_count para compartilhamento com equipes. Isso é especialmente útil com workflows do [Agent Node](../nodes/agent-node.md) que utilizam [File Generation](./file-generation.md) e o modelo de referência do [Drive](./drive.md).

Os complementos comuns são [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) e [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

O nó Amazon S3 executa operações de armazenamento de objetos no Amazon S3 usando uma credencial `s3` (access key, secret key, region, session token opcional). As operações incluem putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder e listBuckets. O upload de texto e o download de texto ou base64 são suportados, com os campos bucket e key aceitando [Expression DSL](./expression-dsl.md). Utilize-o para armazenar saídas de workflows, arquivar arquivos e ler objetos de volta em um fluxo.

Combina com [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) e [Third-Party Integrations](./integrations.md).

### Automação

#### [Crawler](../nodes/crawler-node.md)

O nó Crawler faz scraping de páginas web usando FlareSolverr com extração HTML opcional via seletores CSS. Configure uma [credencial](./credentials.md) do FlareSolverr, uma expressão de URL, tempo de espera e seletores opcionais para extração. A saída é o HTML bruto ou o conteúdo extraído. Utilize-o para web scraping e extração de conteúdo.

Combina com [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) e [LLM](../nodes/llm-node.md) para fluxos de scraping e análise.

#### [Playwright](../nodes/playwright-node.md)

O nó Playwright automatiza interações com o navegador por meio de etapas configuráveis (navigate, refresh, click, type, screenshot, extract, aiStep) ou do modo **Run Code** para Playwright Python personalizado (em sandbox; desativado por padrão via `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Ele oferece suporte ao modo headless, uma configuração opcional que reduz sinais comuns de automação do Playwright, timeouts, captura de rede opcional (responses, cookies, localStorage, sessionStorage), bootstrap de autenticação por cookie/storageState a partir de expressões de [Global Variables](./global-variables.md) como `$global.authState`, etapas de login de fallback quando a restauração de autenticação falha e uma etapa de IA com Auto Heal quando os seletores falham. Utilize-o para web scraping, preenchimento de formulários e workflows baseados em navegador.

Consulte também [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) e [Execution History](./execution-history.md) para automação de navegador e depuração.

### Utilitários

#### [Output](../nodes/output-node.md)

O nó Output é o endpoint do workflow que retorna a resposta ao chamador. Defina a expressão de mensagem para referenciar o nó anterior pelo label (nunca utilize `$input` do nó [Input](../nodes/input-node.md) aqui). O downstream assíncrono opcional permite que os nós após o output sejam executados em segundo plano após o envio da resposta.

As fontes upstream comuns são [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) e [Execute](../nodes/execute-node.md); a modelagem da resposta é mais fácil de depurar no [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

O nó JSON output mapper constrói um objeto JSON simples a partir de mapeamentos chave-valor no estilo [Set](../nodes/set-node.md) e o retorna na raiz da resposta do workflow. Utilize-o quando um chamador de API deve receber um corpo JSON bruto em vez do wrapper padrão do nó [Output](../nodes/output-node.md).
#### [Mapeador de saída HTML](../nodes/html-output-mapper-node.md)

O nó Mapeador de saída HTML renderiza um único template HTML, interpolando expressões `$nodeLabel.field` na página. Quando ele é o único nó terminal do workflow, o webhook de execução responde com `text/html` e o código de status configurado no nó, em vez de um corpo JSON, permitindo que um workflow sirva uma página diretamente a um navegador. Envie `X-Simple-Response: false` para receber o envelope JSON usual de volta para depuração.

Combina com [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) e [Webhooks](./webhooks.md).

#### [Saída de gráfico](../nodes/chart-output-node.md)

O nó Saída de gráfico é o nó terminal de um workflow de widget do [Dashboard](../tabs/dashboard-tab.md). Ele transforma as linhas produzidas pelos nós anteriores em um payload de gráfico padronizado que o dashboard renderiza. Escolha um `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text ou HITL), mapeie `labelField`/`valueField` (ou `series` para múltiplas séries, ou `text` para uma mensagem markdown) e posicione-o por último; ele não possui aresta de saída. O HITL ignora as linhas anteriores e lista suas revisões humanas pendentes.

Veja também [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) e [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

O nó Wait pausa a execução do workflow por uma duração especificada em milissegundos, de até 15 minutos. Use-o para limitação de taxa, ações atrasadas ou intervalos de polling. Ele repassa a entrada sem alterações.

Combina com [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) e [Parallel Execution](./parallel-execution.md) para ritmo e polling.

#### [Nota adesiva](../nodes/sticky-note-node.md)

O nó Nota adesiva adiciona notas em markdown à tela. Ele não é executado. Use-o para documentação, instruções ou notas de workflow junto a outros [Canvas Features](./canvas-features.md). Dê um duplo clique na tela para editar o conteúdo da nota.

Veja também [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) e [Workflow Organization](./workflow-organization.md).

#### [Log no console](../nodes/console-log-node.md)

O nó Log no console registra um valor no console do backend (servidor). Use-o para depuração e inspeção durante o desenvolvimento. A mensagem de log suporta expressões do [Expression DSL](./expression-dsl.md); a saída repassa a entrada sem alterações.

Combina com [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) e [Expression Evaluation Dialog](./expression-evaluation-dialog.md) para depuração.

#### [Desabilitar nó](../nodes/disable-node.md)

O nó Desabilitar nó desabilita permanentemente outro nó do workflow, definindo seu flag `active` como false. Especifique o nó de destino pelo label. Use-o para operações pontuais, como interromper um trigger [Cron](../nodes/cron-node.md) após uma condição ser atendida.

Veja também [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) e [Cron](../nodes/cron-node.md) para padrões de controle de workflow.

#### [Habilitar nó](../nodes/enable-node.md)

O nó Habilitar nó reativa outro nó, definindo seu flag `active` como true e salvando a alteração. Especifique o nó de destino pelo label. Use-o para rearmar um trigger [Cron](../nodes/cron-node.md) desabilitado a partir de outro ponto de entrada, ou para ativar um nó assim que uma condição for atendida. Um destino que esteja a jusante do nó Habilitar nó e ainda não tenha sido executado também é executado na execução atual.

Veja também [Desabilitar nó](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) e [Cron](../nodes/cron-node.md) para padrões de controle de workflow.

#### [Lançar erro](../nodes/throw-error-node.md)

O nó Lançar erro interrompe a execução do workflow imediatamente e retorna uma resposta de erro com um código de status HTTP personalizado. Defina a expressão da mensagem de erro e o código de status (por exemplo, 400, 401, 403, 404, 429, 500). Use-o para falhas de validação, acesso não autorizado ou outras condições de erro, especialmente quando combinado com [Condition](../nodes/condition-node.md) e [Error Handler](../nodes/error-handler-node.md).

Combina com [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) e [Security](./security.md) para caminhos de falha explícitos.

---

## Referência
### [Tipos de Nó](./node-types.md)

O Heym oferece uma variedade de tipos de nó: triggers como [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) e [Error Handler](../nodes/error-handler-node.md); nós de IA como [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) e [MCP Call](../nodes/mcp-call-node.md); nós de lógica como [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) e [Loop](../nodes/loop-node.md); nós de dados como [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) e [Heym](../nodes/heym-node.md); integrações como [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) e [Drive](../nodes/drive-node.md); nós de automação como [Crawler](../nodes/crawler-node.md) e [Playwright](../nodes/playwright-node.md); e utilitários como [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) e [Sticky Note](../nodes/sticky-note-node.md). Utilize expressões como `$input.text` e `$nodeLabel.field` na configuração dos nós.

Consulte também [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) e [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

O Heym utiliza uma linguagem de expressão simples para referenciar dados de nós anteriores. Utilize `$input` para o nó [Input](../nodes/input-node.md), `$nodeLabel.field` para qualquer nó anterior, `$credentials.CredentialName` para [credentials](./credentials.md) e `$global.variableName` para [global variables](./global-variables.md). Variáveis especiais integradas incluem `$now`, `$UUID` e metadados do workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` e `$executionId` (o id do [Execution History](./execution-history.md) da execução — `/workflows/{id}/{executionId}` abre essa execução no canvas; disponível apenas em tempo de execução, vazio no diálogo de pré-visualização de expressões). O suporte inclui literais, aritmética, comparações, contexto de [Loop](../nodes/loop-node.md), campos aninhados e auxiliares de string/array (incluindo `$text.toJson()` para analisar uma string JSON). Quando o valor completo é um único `$expr`, o backend preserva arrays, objetos, booleanos e números como tipos nativos.

Consulte também [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) e [Workflow Structure](./workflow-structure.md).

### [Global Variables](./global-variables.md)

O Global Variable Store armazena dados persistentes de chave-valor no escopo do usuário que sobrevivem entre execuções de workflow. Crie variáveis na aba [Variables](../tabs/global-variables-tab.md) ou a partir de um nó [Variable](../nodes/variable-node.md) com a opção "Store in Global Variable Store" habilitada. Acesse-as com `$global.variableName` em expressões; elas podem ser compartilhadas com outros usuários ou [teams](./teams.md).

Combina com [Variable](../nodes/variable-node.md), [Teams](./teams.md) e [Credentials Sharing](./credentials-sharing.md) para estado de workflow compartilhado.
### [Diálogo de Avaliação de Expressão](./expression-evaluation-dialog.md)

O Diálogo de Avaliação de Expressão é um editor expansível que aparece quando você clica no botão de expandir ao lado dos campos de expressão. Ele abre como um modal grande e centralizado, mantém o autocomplete ativo e atualiza automaticamente a saída de preview do backend após você pausar a digitação. Resultados de objetos e arrays podem ser navegados com o seletor de caminho de saída. O diálogo aceita um caminho de ponto puro de linha completa (por exemplo, `myNode.output.field`) como se fosse `$myNode.output.field`; consulte as regras de posicionamento do [Expression DSL](./expression-dsl.md).

O botão **Build with AI** na barra de ferramentas permite descrever a expressão desejada em texto simples. Selecione uma [credencial](./credentials.md) de LLM e um modelo, digite uma descrição como *"Obtenha o nome do cliente a partir da resposta da API"* e clique em Generate. O backend envia o contexto do [Expression DSL](./expression-dsl.md) e as saídas dos nós da última execução para o modelo e retorna uma única string de expressão. O resultado é avaliado imediatamente para que você possa verificá-lo antes de clicar em Apply.

Combina naturalmente com [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) e [mapeador de saída JSON](../nodes/json-output-mapper-node.md).

### [Estrutura do Workflow](./workflow-structure.md)

Os workflows são armazenados como JSON com nós e arestas. O objeto do workflow inclui id, name, description, nodes, edges e configurações de autenticação. Cada nó possui id, type, position e data (label e configuração específica do tipo). As arestas conectam os IDs dos nós de origem e destino com IDs de handle opcionais. A sintaxe de expressão nos campos de data segue o [Expression DSL](./expression-dsl.md), e essa mesma estrutura é utilizada por [Download & Import](./download-import.md).

Consulte também [Tipos de Nó](./node-types.md), [Expression DSL](./expression-dsl.md) e [Download & Import](./download-import.md).

### [Recursos do Canvas](./canvas-features.md)

Passe o mouse sobre qualquer nó do canvas que não seja sticky e clique em **Run** para executar até esse nó. As entradas obrigatórias abrem no painel Run com o primeiro campo em foco; caminhos sem entradas iniciam imediatamente. Consulte [Run to Node](./canvas-features.md#run-to-node).

O editor de workflow oferece Data Pin (fixa a última saída de um nó para testar as etapas seguintes sem reexecutar), Execution Logs (resultados de nós em tempo real e progresso do agente que complementam o [Execution History](./execution-history.md)), Enable/Disable (ignora nós durante a execução) e Extract to Sub-Workflow (move uma seleção para um novo workflow e a substitui por um nó [Execute](../nodes/execute-node.md)). Uma execução de produção em andamento pode ser aberta a partir do History ou de um cartão do Board; o editor restaura seu snapshot atual, conecta-se ao SSE e mantém a animação do canvas e os logs de Debug ativos. Os [Atalhos de Teclado](./keyboard-shortcuts.md) suportam copiar, colar, executar e busca inline de nós.

Consulte também [Atalhos de Teclado](./keyboard-shortcuts.md), [Edit History](./edit-history.md) e [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Assista à demonstração do Editor</a></p>

### [Atalhos de Teclado](./keyboard-shortcuts.md)

O Heym fornece atalhos em todo o editor: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo e Escape para dispensar. No canvas: selecionar tudo, seleção múltipla, copiar/recortar/colar, excluir, alternar nó habilitado (D), alternar dados fixados (P) e busca inline de nós ao digitar. Os atalhos estão documentados na referência do aplicativo e funcionam em conjunto com os [Recursos do Canvas](./canvas-features.md), como Data Pin e habilitar/desabilitar nó.

Consulte também [Recursos do Canvas](./canvas-features.md), [Quick Drawer](./quick-drawer.md) e [Contextual Showcase](./contextual-showcase.md).

### [AI Assistant](./ai-assistant.md)

O AI Assistant é um painel de chat aberto a partir do painel Debug que permite criar ou modificar workflows com linguagem natural. Selecione uma [credencial](./credentials.md) e um modelo, depois descreva o que você deseja; a IA transmite uma resposta em streaming e qualquer [workflow JSON](./workflow-structure.md) válido em um bloco de código é automaticamente analisado e aplicado ao canvas. A entrada de voz é suportada em navegadores compatíveis.

Ative o **modo YOLO** (modo Agent, desativado por padrão) e o assistente testa o que constrói. Após cada alteração, ele executa o workflow no canvas, lê o resultado e corrige o workflow até que ele faça o que você pediu, por até 5 execuções por mensagem. Ele solicita entradas de teste antes da primeira execução, pode executar seus outros workflows quando precisa do resultado deles e mostra cada etapa enquanto trabalha. Consulte [AI Assistant › Modo YOLO](./ai-assistant.md#yolo-mode).

Quando um workflow armazena registros, o assistente pergunta qual [tabela de dados](../tabs/datatable-tab.md) usar, ou cria uma com as colunas de que o workflow precisa. Consulte [AI Assistant › Tabelas de dados](./ai-assistant.md#data-tables).

Quando o workflow atual contém skills do [Agent Node](../nodes/agent-node.md), o assistente envia apenas o `SKILL.md` de cada skill para o contexto do workflow. Arquivos `.py` anexados e assets binários de skills são excluídos antes da requisição para que pacotes grandes de skills não estourem a janela de contexto do modelo.

Combina bem com [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) e [Expression DSL](./expression-dsl.md).
### [Chat with Heym](./chat-with-heym.md)

O Chat with Heym é um assistente de cabeçalho de documentação para dúvidas sobre o produto. Ele é aberto em um diálogo centralizado, mantém a seleção de credenciais e modelos visível no topo, injeta o caminho da página de documentação ativa como contexto e limpa o histórico de mensagens quando o diálogo é fechado. Ele complementa o [AI Assistant](./ai-assistant.md) mais amplo e o [Contextual Showcase](./contextual-showcase.md) mais leve.

Consulte também [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) e [Node Types](./node-types.md).

### [Workflow Organization](./workflow-organization.md)

Administradores de instância (`HEYM_ADMIN_EMAILS`) podem acessar e editar todos os workflows, localizar os workflows de um proprietário por e-mail, inspecionar agendamentos e histórico de execução, pausar e retomar triggers automáticos e excluir workflows após as execuções serem concluídas. Consulte [Instance Administration](../tabs/workflows-tab.md#instance-administration) para o fluxo de offboarding e a distinção entre pausar triggers automáticos e bloquear todas as chamadas.

Os workflows podem ser organizados em pastas e subpastas em uma estrutura de árvore. As pastas têm nomes e parent opcional; os workflows são atribuídos a pastas. Os workflows podem ser agendados para exclusão (movidos para uma área de lixeira antes da remoção permanente). A API suporta criação, atualização, exclusão e movimentação de workflows entre pastas, e o mesmo modelo de organização aparece na aba [Workflows](../tabs/workflows-tab.md).

Consulte também [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) e [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

O Quick Drawer é um painel fixo de execução rápida no lado direito para páginas internas que não são do canvas. Ele permite pesquisar [workflows](../tabs/workflows-tab.md), fixar favoritos, selecionar entradas, executar imediatamente e inspecionar o progresso ou os resultados sem abrir o editor. A ordem dos itens fixados e o último workflow selecionado são armazenados no navegador.

Consulte também [Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) e [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

O Contextual Showcase é uma trilha de guia compacta dentro do aplicativo para superfícies principais autenticadas, como abas do dashboard, [Evals](../tabs/evals-tab.md), Docs e o editor de workflows. Ele permanece fechado por padrão, apresenta primeiro um breve resumo da página, oferece um pouco mais de detalhe sob demanda e vincula ao artigo completo da documentação quando você deseja orientação mais aprofundada.

Combina com [Chat with Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) e [AI Assistant](./ai-assistant.md) para fluxos de orientação dentro do aplicativo.

### [Credentials](./credentials.md)

As credenciais armazenam chaves de API e segredos usados pelos nós de workflow. Adicione-as na aba [Credentials](../tabs/credentials-tab.md) e faça referência a elas por nome ou ID em nós como [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) e [Redis](../nodes/redis-node.md). Elas são criptografadas em repouso, podem ser compartilhadas com usuários ou [teams](./teams.md) e também podem ser referenciadas no [Expression DSL](./expression-dsl.md) via `$credentials.Name`.

Consulte também [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md) e [Third-Party Integrations](./integrations.md).

### [Credentials Sharing](./credentials-sharing.md)

As credenciais podem ser compartilhadas com outros usuários por e-mail ou com teams; todos os membros do team ganham acesso quando uma credencial é compartilhada com um team. Credenciais compartilhadas aparecem com um indicador na aba [Credentials](../tabs/credentials-tab.md). Em tempo de execução, o contexto do proprietário do workflow mescla credenciais próprias, compartilhadas com o usuário e compartilhadas com teams. Use `$credentials.CredentialName` em expressões ou defina credentialId nos dados do nó.

Consulte também [Credentials](./credentials.md), [Teams](./teams.md) e [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

Os teams permitem compartilhar workflows, credenciais, variáveis globais, vector stores e arquivos do Drive com um grupo de usuários de uma só vez. Crie teams na aba [Teams](../tabs/teams-tab.md) e adicione membros por e-mail. Compartilhe recursos com um team a partir dos diálogos de compartilhamento relevantes; todos os membros passam a ter acesso. O criador pode editar e excluir o team; excluir um team remove todos os compartilhamentos do team.

Combina com [Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md) e [Enterprise](./enterprise.md).

### [Parallel Execution](./parallel-execution.md)

O Heym executa nós em paralelo quando eles não têm dependências entre si. O executor constrói um DAG e executa nós do mesmo nível simultaneamente com um thread pool; assim que um nó termina, seus nós downstream são agendados. Use o nó [Merge](../nodes/merge-node.md) para combinar ramificações paralelas quando necessário. Várias execuções de workflow são executadas simultaneamente; cada execução é isolada. O modo [SSE Streaming](./sse-streaming.md) emite eventos conforme os nós são concluídos.

Consulte também [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) e [Execution History](./execution-history.md).
### [Arquitetura de Agentes](./agent-architecture.md)

O [Nó Agent](../nodes/agent-node.md) suporta subagentes (o orquestrador chama outros nós de agente via call_sub_agent), sub-workflows (o agente chama outros workflows via call_sub_workflow), skills (conteúdo de instrução e ferramentas Python a partir de .zip ou .md) e conexões de cliente [MCP](../tabs/mcp-tab.md). O executor de ferramentas do orquestrador roteia chamadas de subagentes e sub-workflows; as demais ferramentas são encaminhadas para os executores de Python, MCP ou skills. A profundidade máxima de aninhamento para subagentes e sub-workflows é 5. O loop de chamada de ferramentas inclui compressão automática de contexto: antes de cada iteração, o uso de tokens é estimado e, se exceder 80% da janela de contexto do modelo, as mensagens intermediárias são resumidas usando o mesmo modelo, mantendo intactos o system prompt, a primeira mensagem do usuário e a última mensagem do usuário.

Consulte também [Nó Agent](../nodes/agent-node.md), [Memória Persistente do Agente](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) e [MCP](../tabs/mcp-tab.md).

### [Memória Persistente do Agente](./agent-persistent-memory.md)

Grafo de conhecimento opcional por [Nó Agent](../nodes/agent-node.md) armazenado no Postgres: entidades, tipos, propriedades e relacionamentos direcionados. Quando `persistentMemoryEnabled` é true, o grafo é resumido no system prompt a cada execução; após conclusões bem-sucedidas, um [LLM](../nodes/llm-node.md) extrai atualizações estruturadas em segundo plano. O CRUD REST fica em `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. O editor é aberto a partir do controle de cérebro rosa no nó.

Consulte também [Nó Agent](../nodes/agent-node.md), [Arquitetura de Agentes](./agent-architecture.md) e [Traces](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

O Human-in-the-loop permite que um [Nó Agent](../nodes/agent-node.md) solicite aprovação em checkpoints específicos, crie uma página pública `/review/{token}` e aguarde que um revisor não autenticado aceite, edite ou recuse o texto de revisão em Markdown. Agentes com HITL habilitado também expõem um handle de saída `review`, para que você possa notificar o [Slack](../nodes/slack-node.md), o [Send Email](../nodes/send-email-node.md) ou outros canais enquanto a execução estiver pendente. O texto HITL no nível do nó é usado como diretrizes de aprovação, enquanto o resumo da página pública é gerado a partir da própria solicitação de revisão. Execuções pendentes aparecem imediatamente no [Histórico de Execuções](./execution-history.md), podem ocorrer mais de uma vez na mesma execução e são retomadas a partir do snapshot exato do workflow armazenado assim que cada decisão é enviada.

Consulte também [Nó Agent](../nodes/agent-node.md), [Portal](./portal.md), [Histórico de Execuções](./execution-history.md) e [Send Email](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Os workflows podem ser acionados via [HTTP](../nodes/http-node.md) em `POST /api/workflows/{workflow_id}/execute`, ou transmitidos incrementalmente a partir de `POST /api/workflows/{workflow_id}/execute/stream`. O corpo da requisição é passado como body para os nós [Input](../nodes/input-node.md); headers e query params ficam disponíveis em expressões da [Expression DSL](./expression-dsl.md). Configure a autenticação por workflow: anônima, JWT ou header personalizado. O cache de resposta opcional, o rate limiting e o diálogo Run with cURL do editor ficam todos no workflow e se aplicam a ambos os modos.

Consulte também [Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) e [Estrutura do Workflow](./workflow-structure.md).

### [Execution Tokens](./execution-tokens.md)

Os execution tokens são JWTs com escopo que concedem acesso aos endpoints execute e stream de um único workflow. Quando um workflow usa autenticação JWT, os tokens permitem que scripts externos, pipelines de CI e integrações chamem o workflow sem compartilhar uma sessão de usuário. Cada token carrega uma claim `wid` que o fixa a um workflow, um `jti` usado para revogação instantânea e um TTL configurável (de 60 segundos a 10 anos). Crie, selecione e revogue tokens diretamente no diálogo **Run with cURL** — o token selecionado é incorporado automaticamente ao comando gerado.

Consulte também [Webhooks](./webhooks.md), [Segurança](./security.md) e [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

O diálogo cURL pode alternar a execução de [webhook](./webhooks.md) para o modo Server-Sent Events. Isso produz eventos `execution_started`, `node_start`, `node_complete` e `execution_complete` em tempo real, adiciona `--no-buffer` ao comando cURL gerado e permite configurar mensagens de início por nó, como `[START] LLM` ou texto personalizado para consumidores externos de terminal.

Consulte também [Webhooks](./webhooks.md), [Histórico de Execuções](./execution-history.md) e [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Os workflows são iniciados por nós de trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), recebimento do [RabbitMQ](../nodes/rabbitmq-node.md)) ou por pontos de entrada: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), agendador Cron, webhook do Telegram, webhook de interação do Discord, gerenciador de trigger do IMAP, consumidor do RabbitMQ ou execução pelo Editor. Cada trigger possui seu próprio endpoint ou processo em segundo plano; o [Cron](../nodes/cron-node.md) é executado a cada 60 segundos, os nós [Telegram Trigger](../nodes/telegram-trigger-node.md) recebem webhooks do bot, os nós [Discord Trigger](../nodes/discord-trigger-node.md) recebem webhooks de interação assinados, e os nós [IMAP Trigger](../nodes/imap-trigger-node.md) são executados no intervalo de polling configurado. Os nós [Input](../nodes/input-node.md) recebem body, headers e query das requisições de webhook.

Consulte também [Node Types](./node-types.md), [Webhooks](./webhooks.md) e [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

O histórico de execução registra as execuções de workflow: entradas, saídas, resultados dos nós, status e origem do trigger. Acesse-o pela barra de ferramentas do Editor, pela visualização Docs, pelo cabeçalho do Dashboard ou pela visualização [Evals](../tabs/evals-tab.md). O histórico por workflow exibe as execuções do workflow aberto; a visualização de todo o histórico exibe as execuções entre workflows e chat. As execuções em andamento no momento aparecem no topo de ambos os diálogos com as ações **Open live** e **Cancel**. O Open live conecta o editor à execução existente via [SSE](./sse-streaming.md), restaura os nós concluídos, pulsa os nós atual e pendentes e acrescenta logs de Debug sem iniciar outra execução. O Bring to Canvas carrega as entradas e as saídas dos nós de uma execução concluída para reexecução ou depuração; o deep link `/workflows/{workflowId}/{executionId}` oferece suporte tanto a execuções em andamento quanto a execuções concluídas. As execuções pausadas por [Human-in-the-Loop](./human-in-the-loop.md) são armazenadas imediatamente como `pending`, incluindo a URL pública de revisão e quaisquer nós de notificação executados a partir do branch `review` do agente. Se o servidor for reiniciado no meio de uma execução, as execuções interrompidas são recuperadas automaticamente: elas são reexecutadas do zero com as mesmas entradas e exibidas como concluídas (marcadas como **Recovered**), controlado por um toggle **Auto-recover runs** por workflow que, alternativamente, pode registrá-las como `skipped`.

Consulte também [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) e [Traces](../tabs/traces-tab.md).

### Execution Highlights

Após uma execução ao vivo — ou após o **Bring to Canvas** —, um popup dispensável de **Execution Highlights** aparece no canto superior direito do Canvas, listando o que cada nó produziu na ordem de execução. É uma forma rápida de inspecionar a saída por nó sem abrir cada nó; feche-o com o **✕**, e ele reabre na próxima execução. Os Highlights também são exibidos nas execuções do dashboard. Consulte [Execution History](./execution-history.md) para obter detalhes.

### [Edit History](./edit-history.md)

O Edit History rastreia as versões salvas de um workflow (cada Save cria uma versão). Visualize a lista, abra uma versão para ver um diff em relação ao workflow atual ([nós](./workflow-structure.md), edges, config) e use Revert para restaurar uma versão anterior. Diferentemente do [Execution History](./execution-history.md), o Edit History rastreia alterações de estrutura, não execuções.

Consulte também [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) e [Canvas Features](./canvas-features.md).

### Error Workflow

Um workflow pode designar outro workflow para ser executado quando ele falhar. Configure isso no painel **Properties** no nível do workflow (exibido quando nenhum nó está selecionado), em **On error, run workflow**. Apenas o proprietário do workflow pode definir, alterar ou limpar essa configuração; consulte [Owner-only settings](./workflow-organization.md#owner-only-settings). Quando uma execução de nível superior termina com uma falha não tratada, o workflow de erro selecionado é executado e recebe o contexto da falha (id e nome do workflow que falhou, id da execução, mensagem de erro, label e tipo do nó que falhou e um timestamp). Se o canvas já contiver um nó [Error Handler](../nodes/error-handler-node.md), o handler local terá precedência e o workflow de erro **não** será chamado. O próprio workflow de erro é executado diretamente, portanto nunca dispara seu próprio workflow de erro.

Ele cobre toda execução de nível superior que não seja de teste: ambos os endpoints de execução, o [Portal](./portal.md) e todos os triggers, incluindo [cron](../nodes/cron-node.md), os triggers de plataformas de chat, e-mail, filas, [MCP](../tabs/mcp-tab.md) e widgets do dashboard. Com o [Load Distribution](./cluster.md) habilitado, isso permanece inalterado, incluindo execuções realizadas por um worker: o nó que falhou retorna junto com o resultado, e o workflow de erro é então distribuído como qualquer outra execução, de modo que um nó dentro dele que precise ser executado na instância principal ainda o será. Dois casos são deliberadamente deixados de fora, porque o desfecho do próprio workflow ainda não é conhecido: uma execução que nenhuma instância chegou a executar e uma espera que expirou enquanto a execução ainda pode estar em andamento. Ele também **não** é disparado por execuções de teste manuais no canvas.
### Timeout de Workflow

Cada workflow pode definir um **timeout de workflow** em segundos no painel **Properties** no nível do workflow. `0` (o padrão) o desabilita. Quando definido, uma execução que exceda o limite é interrompida no próximo limite de nó e registrada como uma execução com falha com um erro de "timed out". O timeout se aplica a execuções manuais, via API e acionadas por trigger. Nós [Wait](../nodes/wait-node.md) longos são interrompidos prontamente em vez de bloquear por toda a sua duração.

### Tempo Economizado

Cada workflow pode registrar um **tempo estimado economizado por execução** (em minutos), definido no painel **Properties** no nível do workflow. A aba [Analytics](../tabs/analytics-tab.md) agrega isso ao longo do intervalo selecionado como uma estatística total de **Time Saved** (soma da estimativa de cada workflow × suas execuções bem-sucedidas). Most Used também lista essa soma por workflow; **Not Set** abre o campo de estimativa quando ele não está definido. O relatório [Workflow Analysis](./workflow-analysis.md) recomenda definir uma estimativa quando nenhuma está configurada.

### [Settings](./user-settings.md)

O diálogo Settings (aberto a partir do seu avatar no cabeçalho) tem quatro abas: Profile (imagem do Gravatar, nome de exibição, User Rules), [Security](./security.md) (alterar senha), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) e Observability (status somente leitura do [OpenTelemetry](./opentelemetry.md)). User Rules são instruções personalizadas injetadas em cada requisição de IA, incluindo o construtor de workflow e o [Chat](../tabs/chat-tab.md), para que você possa definir idioma, tom, estilo de código ou convenções de workflow uma única vez. A política de senha e o gerenciamento de chaves de API do [MCP](../tabs/mcp-tab.md) também estão disponíveis.

Veja também [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) e [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

O Heym pode emitir traces do OpenTelemetry para cada execução de workflow e execução de nó: um span raiz `heym.workflow.execute` por execução e um span filho `heym.node.execute` por nó, com uso de modelo e token anexado aos nós de LLM e agent. Os spans são exportados via OTLP/HTTP para qualquer backend compatível (Jaeger, Grafana Tempo, Honeycomb, Datadog), e o contexto de trace W3C se propaga por webhooks de entrada, HTTP de saída e sub-workflows. O tracing é desabilitado por padrão e configurado com [variáveis de ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; o status ativo é exibido na aba Observability das [Settings](./user-settings.md).

Veja também [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) e [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Exporte o workflow atual como JSON a partir da barra de ferramentas do Editor (botão Download); o arquivo inclui nós e arestas. Importe arrastando um arquivo JSON para a aba [Workflows](../tabs/workflows-tab.md) (cria um novo workflow) ou para o canvas (substitui ou mescla). O JSON deve incluir um array de nós; nome e arestas são opcionais. Use-o para backup, compartilhamento ou migração entre instâncias.

Veja também [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) e [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

O Portal expõe workflows como interfaces de chat públicas em `/chat/{slug}`. Configure portal_enabled, slug, autenticação opcional (usuários do portal), streaming e upload de arquivos por workflow. Os usuários finais interagem por meio de uma interface de chat sem fazer login no Heym; saídas de imagem podem ser exibidas no chat. Workflows do Portal também podem encaminhar para páginas de revisão de [Human-in-the-Loop](./human-in-the-loop.md) quando um [Agent Node](../nodes/agent-node.md) exige aprovação, enquanto o branch `review` do agent envia notificações para outros canais. Use-o para ferramentas internas, chatbots voltados ao cliente e formulários com IA.

Veja também [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) e [Drive](./drive.md).

### [File Generation](./file-generation.md)

As Skills podem gerar arquivos como PDF, DOCX, CSV, JSON e imagens durante a execução, gravando no workspace `_OUTPUT_DIR`. O Heym captura esses arquivos automaticamente, armazena-os e expõe metadados de download em `_generated_files`, que podem então ser gerenciados com o [Drive node](../nodes/drive-node.md) ou revisados na aba [Drive](../tabs/drive-tab.md).

Veja também [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) e [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

O Drive é a camada de armazenamento e compartilhamento para arquivos gerados por skills. Ele permite navegar pelos arquivos, criar links públicos ou protegidos por senha, aplicar expiração e limites de download, compartilhar arquivos somente leitura com suas equipes e gerenciar esses arquivos programaticamente com o [Drive node](../nodes/drive-node.md) ou manualmente a partir da aba [Drive](../tabs/drive-tab.md).

Veja também [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) e [Portal](./portal.md).
### [Segurança](./security.md)

O Heym aplica uma política de senha (comprimento, letras maiúsculas, letras minúsculas, dígitos), armazena access tokens em cookies HttpOnly e rotaciona refresh tokens a cada uso. O rate limiting é aplicado ao login, ao registro e ao login do [Portal](./portal.md). As [Credenciais](./credentials.md) são criptografadas em repouso com AES-256 (Fernet). A API key do [MCP](../tabs/mcp-tab.md) é usada para autenticação de clientes; a segurança de conteúdo está disponível por meio dos [Guardrails](./guardrails.md) nos nós [LLM](../nodes/llm-node.md) e [Agent Node](../nodes/agent-node.md). Os [Execution Tokens](./execution-tokens.md) fornecem JWTs com escopo por workflow para chamadores externos.

Consulte também [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) e [Credenciais](./credentials.md).

### [Single Sign-On](./sso.md)

O Heym autentica pessoas em qualquer provedor externo OpenID Connect - Keycloak, Okta, Entra ID, Auth0, Google - configurado em tempo de execução em **Settings → SSO** por um administrador da instância listado em `HEYM_ADMIN_EMAILS`. Apenas uma URL de issuer e as credenciais de cliente são informadas; todos os endpoints vêm do documento de descoberta do provedor, portanto nenhum provedor é fixado no código. O login usa Authorization Code com PKCE, e o ID token é verificado com base nas chaves publicadas pelo provedor. As contas são mapeadas primeiro por `(issuer, subject)` e, em segundo lugar, pelo email verificado, com provisionamento automático opcional limitado a uma lista de domínios de email permitidos. O login por senha permanece disponível junto ao SSO e pode ser desativado após um teste de conexão bem-sucedido, com as contas de `HEYM_ADMIN_EMAILS` isentas, para que um provedor mal configurado não possa bloquear a instância.

Consulte também [Settings](./user-settings.md), [Segurança](./security.md) e [Audit Logging](./audit.md).

### [Distribuição de Carga](./cluster.md)

Aponte uma segunda instância do Heym para o mesmo banco de dados e ela se junta como worker. As execuções em segundo plano - cron, webhooks, chamadas de ferramentas MCP, triggers de chat - são compartilhadas entre as instâncias por uma porcentagem definida por um administrador da instância em **Settings → Instances**, com o status, a latência de banco de dados e a versão de cada instância em uma única tabela. As instâncias nunca se comunicam entre si: o Postgres carrega o trabalho, portanto um worker não precisa de porta aberta nem de rota de volta para a instância principal. Trabalhos que envolvem arquivos locais, um workspace de agente de código ou um plugin instalado sempre são executados na instância principal, e o painel informa quanto das últimas 24 horas isso representou, para que um operador possa ver quando as porcentagens não ajudam. Toda execução no histórico nomeia a instância que a executou, e ambos os diálogos de histórico podem filtrar por ela.

Consulte também [Settings](./user-settings.md), [Traces](../tabs/traces-tab.md) e [Analytics](../tabs/analytics-tab.md).

### [Integrações de Terceiros](./integrations.md)

O Heym se conecta a serviços externos por meio de credenciais armazenadas na aba [Credentials](../tabs/credentials-tab.md) (criptografadas em repouso). Os tipos suportados incluem OpenAI, Google, Decision Model para o [nó Decision](../nodes/decision-node.md), Model Router para seleção automática de modelo (veja abaixo), GitHub para o [nó GitHub](../nodes/github-node.md) e integrações MCP, Jira para o [nó Jira](../nodes/jira-node.md), Notion para o [nó Notion](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP para [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header e FlareSolverr para [Crawler](../nodes/crawler-node.md). Cada tipo documenta os campos obrigatórios; as credenciais podem ser compartilhadas com usuários ou [equipes](./teams.md) e referenciadas por nome nos nós ou como `$credentials.Name` em expressões.

### Model Router (Auto Model)

Uma credencial **Model Router** escolhe o modelo por requisição em vez de armazenar uma chave. Ela
armazena uma credencial de modelo de decisão mais uma lista das suas credenciais existentes OpenAI/Google/Custom,
cada uma com critérios indicando quando deve ser usada, e aparece em todo seletor de modelo
com um único modelo chamado **Auto**.

Os Traces, o Execution Log do canvas e o Span View mostram ambas as metades da escolha, por
exemplo `Auto Model / GPT-5`, enquanto o custo permanece atribuído ao modelo que foi executado. O Auto
Model não pode ser combinado com a Responses API, o modo Batch ou saída de imagem. Consulte
[Credenciais](./credentials.md) para o comportamento completo.

Consulte também [Credenciais](./credentials.md), [Compartilhamento de Credenciais](./credentials-sharing.md) e [Equipes](./teams.md).

### [Guardrails](./guardrails.md)

Os Guardrails bloqueiam mensagens de usuário inseguras ou indesejadas antes que cheguem a um [LLM](../nodes/llm-node.md) ou [Agent Node](../nodes/agent-node.md). Habilite-os por nó e selecione as categorias a bloquear (por exemplo, violência, discurso de ódio, conteúdo sexual, automutilação, assédio, atividade ilegal). Defina a sensibilidade (baixa, média, alta). Quando acionado, o nó lança um erro que você pode capturar com um [Error Handler](../nodes/error-handler-node.md). A detecção usa a API de moderação do provedor ou classificação por LLM, dependendo do tipo de credencial.

Consulte também [Segurança](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) e [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

O Enterprise abrange licenciamento comercial, suporte profissional e serviços de implantação para equipes que executam o Heym em produção. Inclui auxílio na arquitetura de workflows, onboarding, orientação sobre Kubernetes e escalabilidade, suporte prioritário e desenvolvimento personalizado em torno de recursos avançados como [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) e [Portal](./portal.md).

Consulte também [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) e [Teams](./teams.md).

---

## Abas do Dashboard

### [Workflows](../tabs/workflows-tab.md)

A aba Workflows é a visualização padrão do dashboard. Ela exibe uma listagem em dois painéis: workflows e pastas como linhas densas à esquerda, e uma pré-visualização do workflow selecionado à direita, com seu trigger, última execução e etapas, além de Open Workflow e Run Now. Cada linha possui um chip de status (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) que o dropdown Status pode filtrar. Um workflow sem nó de trigger é rotulado pela forma como sua execução mais recente foi iniciada - API para uma chamada HTTP, SubWorker para um workflow pai, Portal para seu chat público - e permanece como Manual até ser executado. Pastas e subpastas tratam da [organização](./workflow-organization.md). Crie workflows com New Workflow, arraste e solte JSON para [importar](./download-import.md), e edite ou exclua pelas ações da linha. Workflows podem ser movidos entre pastas; a exclusão é agendada (lixeira) antes da remoção permanente.

Consulte também [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) e [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Um quadro kanban agêntico onde os cards são jobs persistentes. Configure cada coluna com uma cadeia ordenada de workflows; mover um card para a coluna executa a cadeia com o contexto completo do card (conteúdo, comentários, histórico, saídas anteriores). Os resultados são gravados de volta no card — verde em caso de sucesso, vermelho em caso de falha, âmbar enquanto em execução. Rodadas de acompanhamento reexecutam a cadeia da coluna atual com tudo o que foi acumulado até o momento, o que possibilita o planejamento iterativo. As execuções são registradas em [Execution History](./execution-history.md) com a origem de trigger `board`. Enquanto uma execução de card está ativa, **Open live** abre exatamente essa execução no canvas animado com logs de Debug incrementais.

Consulte também [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) e [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

A aba Templates permite salvar e reutilizar templates de workflow (workflows completos) e templates de nó (nós individuais configurados). Crie templates de workflow a partir do editor (Share as Template) e templates de nó clicando com o botão direito em um nó. Navegue por visibilidade (Everyone ou usuários/[equipes](./teams.md) específicos), aplique um template para criar um novo workflow ou adicionar um nó ao canvas, e gerencie seus templates compartilhados.

Consulte também [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) e [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

A aba Variables gerencia o [Global Variable Store](./global-variables.md). Crie, edite e exclua variáveis globais; defina nome, valor e tipo de valor (Auto, String, Number, Boolean, Array, Object). As variáveis têm escopo por usuário e persistem entre execuções. Referencie-as em qualquer [expressão](./expression-dsl.md) de workflow como `$global.variableName`. As variáveis podem ser compartilhadas com outros usuários ou [equipes](./teams.md).

Consulte também [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) e [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

A aba Chat é a superfície de agente de longa duração do Heym para operar o workspace por meio de conversação. Selecione uma [credencial](./credentials.md) e um modelo, depois peça ao Chat para responder perguntas, inspecionar definições de workflow, executar workflows existentes, resumir execuções e agendamentos, relatar o histórico de execuções de um único workflow (contagem de execuções, detalhamento por status, última execução e os detalhes de uma execução sob solicitação), relatar quais execuções estão em andamento neste momento (com tempo decorrido, nó atual e um link para cada execução ativa), resolver revisões humanas pendentes, criar e revisar workflows com o mesmo motor do AI Builder usado no editor, ou adicionar cards a quadros kanban com linguagem natural. Novos cards sempre começam na primeira coluna do quadro selecionado; quando vários quadros estão disponíveis e nenhum foi nomeado, o Chat apresenta uma seleção de quadro antes de criar o card.

O Chat continua em execução no backend após o navegador ser fechado. Enquanto uma resposta está sendo transmitida, você pode enviar mais mensagens; o Heym as armazena em uma fila com suporte de banco de dados, permite editar ou excluir mensagens enfileiradas antes que comecem e as executa em ordem quando a resposta atual termina. Se o assistente precisar de detalhes de planejamento e retornar perguntas de esclarecimento, a fila é pausada até que você responda a essas perguntas e, em seguida, é retomada após a resposta de planejamento.

As respostas são transmitidas com markdown, imagens inline, cards de pré-visualização de workflow, cards recolhíveis de chamadas de ferramentas, uso de contexto e compressão automática de contexto. O Chat oferece suporte a anexos, entrada de voz, reprodução em voz alta, ações de cópia, prompts rápidos, User Rules das [Configurações](./user-settings.md) e [variáveis globais](./global-variables.md) como contexto.

Veja também [Assistente de IA](./ai-assistant.md), [Credenciais](./credentials.md) e [Configurações](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Assista à demonstração do Chat</a></p>

### [Credenciais](../tabs/credentials-tab.md)

A aba Credenciais gerencia chaves de API e segredos usados pelos nós. Adicione credenciais por tipo (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere, etc.), nomeie-as e referencie-as em nós de workflow. Edite ou exclua a partir do card; compartilhe com usuários por e-mail ou com [equipes](./teams.md). Todos os valores são criptografados em repouso e mascarados na interface.

Veja também [Credenciais](./credentials.md), [Compartilhamento de Credenciais](./credentials-sharing.md) e [Integrações de Terceiros](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Assista à demonstração de Credenciais</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

A aba Vectorstores gerencia os vector stores usados pelos nós de [RAG](../nodes/rag-node.md). Crie um store com um nome e uma [credencial](./credentials.md) de vector store — *RAG: Qdrant + OpenAI* (Qdrant externo) ou *RAG: Psql + OpenAI* (o próprio Postgres do Heym via pgvector), que define o backend do store — opcionalmente defina um nome de coleção e, em seguida, faça upload de documentos (PDF, TXT, etc.). Gerencie o conteúdo (visualizar, excluir fontes), edite os detalhes do store e compartilhe stores com usuários. Em um nó de [RAG](../nodes/rag-node.md), escolha o Database, selecione o vector store e execute operações de insert, upsert, delete ou search.

Veja também [Qdrant RAG](../nodes/rag-node.md), [Credenciais](./credentials.md) e [Equipes](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Assista à demonstração de Vectorstores</a></p>
### [MCP](../tabs/mcp-tab.md)

A aba MCP configura a integração com o Model Context Protocol. O Heym oferece suporte a dois modos:

**Servidor padrão** – Um único endpoint em `/api/mcp/sse` expõe todos os workflows habilitados para MCP. Visualize e regenere sua API key, copie o JSON pronto para uso no cliente, conecte o Cursor com um clique ou siga o fluxo de configuração do Claude com registro OAuth automático.

**Servidores nomeados** – Crie múltiplos endpoints MCP isolados, cada um com sua própria URL baseada em UUID (`/api/mcp/servers/{uuid}/sse`) e API key independente. Atribua workflows específicos a cada servidor para que diferentes clientes de IA ou equipes vejam apenas as ferramentas de que precisam. Cada servidor nomeado oferece suporte aos mesmos métodos de autenticação (API key, Claude OAuth) e possui seus próprios atalhos Copy JSON e Add to Cursor. Ambos os endpoints oferecem suporte ao transporte SSE (GET) e ao transporte Streamable HTTP (POST). Alternar um workflow dentro de um servidor nomeado o move para o topo da lista atribuída, mantendo a linha alterada visível.

**Ferramenta de chat do Heym** – Qualquer um dos modos também pode expor o motor de [Chat](../tabs/chat-tab.md) como uma única ferramenta `heym_chat`, alternada por superfície com sua própria credencial de LLM e modelo (pré-preenchidos a partir do seu modelo preferido em [Configurações](./user-settings.md)). Um cliente MCP envia uma única `message` em linguagem natural e o motor faz o resto: criar, editar e executar workflows, análises, execuções, status de execução em tempo real, agendamentos, boards e cards, equipes, variáveis globais, busca em documentação e decisões human-in-the-loop. Capacidades adicionadas ao Chat posteriormente ficam acessíveis pela mesma ferramenta sem registro adicional. Cada chamada é armazenada no histórico da aba Chat como uma conversa marcada com plug e retorna um `conversation_id` que o cliente pode enviar de volta para continuar a conversa.

Veja também [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) e [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Assistir à demonstração do MCP</a></p>

### [Traces](../tabs/traces-tab.md)

A aba Traces exibe os traces de execução do [LLM](../nodes/llm-node.md). Um cabeçalho de estatísticas acima da lista resume o intervalo de tempo selecionado com cards de KPI (Calls, Tokens, Cost, Avg Latency, Error %) e três gráficos — Tokens by Model, Cost by Model e Calls Over Time (sucesso vs erro empilhados). Um único seletor de **Time range** (1h / 24h / 7d / 30d / All; padrão 7 dias) filtra tanto os gráficos quanto a lista em conjunto. O custo é calculado a partir da [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) por usuário; modelos sem precificação exibem um aviso inline que direciona para ela. Abra qualquer trace para ver os payloads de requisição e resposta, a decomposição de tempo (llm_ms, tools_ms, mcp_list_ms), as chamadas de ferramentas (nome, argumentos, resultado) e as skills incluídas. Eventos expandidos exibem JSON — incluindo payloads MCP e JSON-RPC — como uma árvore recolhível com o primeiro nível aberto por padrão; **Tree / Raw** alterna de volta para o texto original e JSON malformado permanece legível. Use os traces para depurar o comportamento do [Agent Node](../nodes/agent-node.md) e do [LLM](../nodes/llm-node.md) e para copiar ou exportar payloads.

Veja também [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) e [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Assistir à demonstração de Traces</a></p>
### [Alertas](../tabs/alerts-tab.md)

A aba Alertas define condições de limite em uma janela de tempo e informa quando elas são ultrapassadas. Quatro tipos de alerta cobrem as perguntas que os operadores realmente fazem: **limite de erros** (isto falhou mais de N vezes na janela), **duração do workflow** (as execuções ficaram mais lentas, medidas como máximo, média ou p95), **custo em tokens / USD** (o gasto ultrapassou um orçamento, resolvido pela mesma tabela de preços que a de [Traces](../tabs/traces-tab.md)) e **contagem de execuções** (isto foi executado com muito mais frequência do que deveria). Cada tipo é avaliado em uma janela que você escolhe, nunca em um único evento, porque uma execução com falha é ruído e uma rajada é um incidente. Os alertas monitoram um workflow ou todos os workflows aos quais você tem acesso.

Um assistente de cinco etapas percorre tipo, escopo, condição, resposta e revisão. A etapa de Revisão faz o **backtest** da condição primeiro, informando com que frequência ela teria disparado nas últimas 24 horas até 7 dias, de modo que um limite muito baixo seja detectado antes de ser salvo, e não depois de acionar alguém. Descreva o que você deseja em linguagem natural e a IA preenche cada etapa que puder, marcando suas suposições; uma solicitação parcial ainda faz o assistente avançar, abrindo na primeira etapa que ainda precisa de uma decisão em vez de obrigá-lo a começar de novo. Por padrão, um alerta dispara uma vez e permanece silencioso até que a métrica se recupere; você pode, em vez disso, fazê-lo repetir em um intervalo.

Na etapa de resposta, um alerta pode criar e atribuir um novo workflow para ser executado quando disparar, usar um que você já tenha ou não fazer nada. O payload de disparo carrega o valor observado, o limite, a janela e os workflows que contribuíram para o número, e é assim que os alertas chegam ao Slack, e-mail ou Telegram usando nós que você já possui. O histórico de disparos registra o que era verdade no momento em que cada alerta disparou e é mantido por 90 dias; reconhecer um disparo altera o badge de Firing para Acknowledged sem fingir que a condição foi resolvida. A aba [Chat](../tabs/chat-tab.md) pode responder quais alertas existem e por que ou quando um deles foi acionado. Os alertas podem ser compartilhados com usuários e [equipes](../tabs/teams-tab.md).

Veja também [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md) e [Execution History](./execution-history.md).

### [Analytics](../tabs/analytics-tab.md)

A aba Analytics mostra métricas e tendências de execução. As estatísticas de resumo incluem total de execuções, taxa de sucesso, taxa de erro, detalhamentos de latência e total de **Time Saved** (a soma dos minutos estimados economizados por execução de cada workflow × suas execuções bem-sucedidas). Most Used lista essa mesma soma por workflow. Selecione um intervalo de tempo base (24h, 7d, 30d ou all), opcionalmente filtre por workflow e, em seguida, arraste sobre qualquer gráfico para detalhar um intervalo de datas selecionado. Os gráficos e as tabelas de workflow são atualizados para a seleção, e a atualização automática mantém as métricas atualizadas. Ela complementa o [Execution History](./execution-history.md) e a visualização [Scheduled](../tabs/scheduled-tab.md) quando você precisa tanto de resultados passados quanto de execuções futuras.

Veja também [Execution History](./execution-history.md), [Scheduled](../tabs/scheduled-tab.md) e [Evals](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

A aba Dashboard é um espaço no estilo Grafana onde você constrói grades de widgets de gráfico, cada um renderizado a partir de seu próprio workflow Heym oculto. Mantenha quantos dashboards precisar e compartilhe cada um com usuários ou equipes, somente leitura ou editável; os widgets sempre são executados com as credenciais do proprietário, de modo que todos veem os mesmos dados. Descreva uma métrica em linguagem natural e a IA gera o widget, ou adicione um manualmente e escolha um tipo de gráfico, pré-visualizado com dados de exemplo: bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text ou HITL. HITL é um carrossel das suas revisões humanas pendentes. O cabeçalho mostra `1/n pending`. O nome do workflow abre essa execução no canvas. **Approve**, **Request changes** e **Reject** a resolvem, e o ícone de histórico ao lado do título do widget abre essa execução no diálogo de histórico na mesma página. Os widgets armazenam seus resultados em cache, podem ser ajustados com IA (cada alteração é salva no [Edit History](./edit-history.md)), clonados junto com seu workflow completo, reorganizados com Tidy up e arrastados ou redimensionados no modo de edição. Como cada widget é um workflow, qualquer dado que você possa buscar — uma chamada [HTTP](../nodes/http-node.md), uma consulta [BigQuery](../nodes/bigquery-node.md), uma busca [RAG](../nodes/rag-node.md) ou uma saída de [LLM](../nodes/llm-node.md) — pode se tornar um gráfico.

Veja também [Chart Output node](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md) e [Execution History](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>
### [Evals](../tabs/evals-tab.md)

A aba Evals (em `/evals`) permite criar suítes de avaliação, adicionar ou gerar casos de teste, otimizar o prompt da suíte e executar avaliações em workflows com [nó Agent](../nodes/agent-node.md). Selecione um ou mais modelos, escolha um método de pontuação (Exact Match, Contains ou LLM-as-Judge), opcionalmente permita que um modelo separado ou um [nó Decision](../nodes/decision-node.md) avalie respostas LLM-as-Judge, defina execuções por teste (além de temperature e reasoning effort para Exact Match e Contains) e, em seguida, compare aprovação/reprovação e saídas por modelo. Revise o histórico de execuções de avaliações anteriores, incluindo o judge utilizado em cada execução, reexecute uma com o mesmo judge, exporte-a como JSON e verifique o comportamento subjacente em [Traces](../tabs/traces-tab.md).

Consulte também [nó Agent](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md) e [Execution History](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Teams](../tabs/teams-tab.md)

A aba Teams permite criar e gerenciar equipes. Crie uma equipe, adicione membros por e-mail e remova membros (o criador não pode ser removido). Compartilhe [workflows](../tabs/workflows-tab.md), [templates](../tabs/templates-tab.md), [credentials](../tabs/credentials-tab.md), [variables](../tabs/global-variables-tab.md), [vector stores](../tabs/vectorstores-tab.md) e [Drive files](../tabs/drive-tab.md) com equipes a partir de seus respectivos diálogos de compartilhamento; todos os membros da equipe ganham acesso. Edite o nome e a descrição da equipe ou exclua a equipe (remove todos os compartilhamentos da equipe).

Consulte também [Teams](./teams.md), [Credentials Sharing](./credentials-sharing.md) e [Workflow Organization](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

A aba Scheduled mostra todos os workflows [Cron](../nodes/cron-node.md) ativos em um calendário visual. Alterne entre as visualizações de dia, semana e mês para ver quando suas automações estão agendadas para execução e, em seguida, retorne ao [workflow](../tabs/workflows-tab.md) relacionado quando precisar editar o agendamento.

Consulte também [Cron](../nodes/cron-node.md), [Analytics](../tabs/analytics-tab.md) e [Execution History](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

### [Logs](../tabs/logs-tab.md)

A aba Logs mostra os logs dos contêineres Docker da stack do Heym (backend, frontend, PostgreSQL). Selecione o(s) contêiner(es), filtre por nível de log (All, INFO, WARNING, ERROR, DEBUG) e pesquise dentro dos logs. Utilize-a para depuração e solução de problemas. Para logs de execução de workflow (resultados de nós, saídas), utilize [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) ou o painel Debug no editor.

Consulte também [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) e [Canvas Features](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

### [DataTable](../tabs/datatable-tab.md)

A aba DataTable permite criar e gerenciar tabelas de dados estruturados dentro do Heym. Defina colunas tipadas (string, number, boolean, date, JSON), gerencie linhas com edição inline por duplo clique, importe/exporte CSV e compartilhe tabelas com usuários ou [equipes](./teams.md) com permissões de leitura/escrita. Utilize o [nó DataTable](../nodes/datatable-node.md) para acessar tabelas programaticamente em workflows. Uma seção fixada de **System tables** no topo hospeda a **LLM Cost Table**: uma visualização de esquema fixo dos preços por modelo, alimentada pelo Helicone em segundo plano (TTL de 24 horas, atualização manual), na qual cada usuário pode substituir preços ou adicionar linhas personalizadas para modelos que o Helicone não lista. Essas regras de precificação alimentam o KPI de custo e o gráfico de custo por modelo na aba [Traces](../tabs/traces-tab.md).

Consulte também [nó DataTable](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Workflow Structure](./workflow-structure.md) e [Teams](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>
### [Drive](../tabs/drive-tab.md)

A aba Drive exibe todos os arquivos gerados por skills em seus workflows. Ela lista cada arquivo com nome, tipo, tamanho, nó de origem, data de criação e estado de compartilhamento com a equipe, além de oferecer controles de busca, download autenticado, compartilhamento, exclusão e paginação. É o painel complementar ao [File Generation](./file-generation.md), à referência do [Drive](./drive.md) e ao [nó Drive](../nodes/drive-node.md).

Consulte também [Drive](./drive.md), [File Generation](./file-generation.md) e [nó Drive](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Assista à demonstração do Drive</a></p>
