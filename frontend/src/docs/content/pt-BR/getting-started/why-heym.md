# Por que Heym

Heym é infraestrutura para executar e governar agentes de IA em produção. Um runtime auto-hospedado cobre todas as etapas do ciclo de vida do agente.

Um agente em protótipo precisa de um modelo, um prompt e algumas ferramentas. Um agente em produção também precisa de triggers e retries, estado salvo quando pausa para uma pessoa, um registro de cada chamada de modelo e ferramenta, um custo para cada execução, testes antes de uma alteração ser publicada e limites claros sobre o que ele pode fazer sozinho. O Heym mantém tudo isso em um só lugar, para que o sistema que você projeta na tela seja o sistema que executa. Construa sistemas agênticos e depois execute-os com confiança.

## Um Runtime para o Ciclo de Vida do Agente

| Etapa | O que o Heym oferece |
|---|---|
| **Construir** | Componha agentes e etapas determinísticas na tela, gere-os com o [AI Assistant](../reference/ai-assistant.md) ou comece a partir de [Templates](../tabs/templates-tab.md) e skills portáveis. |
| **Orquestrar** | Coordene agentes, [sub-agentes](../reference/agent-architecture.md), agentes de código, RAG, automação de navegador e ferramentas com fluxo de dados explícito e [execução paralela](../reference/parallel-execution.md). |
| **Executar** | Inicie execuções a partir de [webhooks](../reference/webhooks.md), agendamentos e [triggers](../reference/triggers.md) de eventos, com retries por Nó, [tratamento de erros](../nodes/error-handler-node.md) e [distribuição de carga](../reference/cluster.md) entre instâncias. |
| **Observar** | Inspecione cada execução por meio do [histórico](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md), custo em USD por execução, execuções ao vivo na tela, [analytics](../tabs/analytics-tab.md), [alertas](../tabs/alerts-tab.md) e exportação via [OpenTelemetry](../reference/opentelemetry.md). |
| **Avaliar** | Teste prompts e modelos em relação a saídas esperadas em [Evals](../tabs/evals-tab.md), com pontuação LLM-as-Judge e comparação lado a lado de modelos. |
| **Controlar** | Mantenha os humanos no controle com [checkpoints de revisão](../reference/human-in-the-loop.md) e [guardrails](../reference/guardrails.md), e governe o acesso com [credenciais](../reference/credentials.md) criptografadas, [equipes](../reference/teams.md), [single sign-on](../reference/sso.md) e uma [trilha de auditoria](../reference/audit.md). |
| **Expor** | Disponibilize workflows via REST e [SSE](../reference/sse-streaming.md), como ferramentas [MCP](../tabs/mcp-tab.md), como interfaces de chat do [Portal](../reference/portal.md) e como widgets do [dashboard](../tabs/dashboard-tab.md). |

## Construir

### AI Assistant: Construa Workflows com Linguagem Natural

O [AI Assistant](../reference/ai-assistant.md) é um painel de chat dentro do editor de workflow. Descreva o que você deseja, por exemplo "crie um workflow que recebe entrada do usuário, pesquisa minha base de conhecimento e responde usando GPT-4o", e o assistente gera Nós e conexões que são aplicados instantaneamente à tela.

- Usa sua própria credencial de LLM (qualquer modelo suportado)
- Suporta **entrada por voz** para projetar workflows sem usar as mãos
- Aplica automaticamente JSON de workflow válido da resposta da IA à tela
- Transmite respostas em tempo real

O assistente funciona diretamente dentro do editor e transmite Nós para a tela em tempo real, e tudo o que ele gera permanece editável como Nós que você posicionou manualmente.

### Sistema de Skills

Skills são pacotes portáveis de capacidades, um arquivo de instruções `SKILL.md` mais scripts Python opcionais, que podem ser aplicados a qualquer Nó Agente.

- As instruções da skill são adicionadas ao início do system prompt do agente
- Arquivos Python na skill se tornam ferramentas chamáveis
- Skills são reutilizáveis entre workflows e compartilháveis como arquivos `.zip`

Isso é análogo a entregar ao seu agente uma descrição de cargo e uma caixa de ferramentas em uma única aplicação.

### Workflow Analyzer: Feedback com Consciência de Execução

O painel de [Workflow Analysis](../reference/workflow-analysis.md) é uma ferramenta de documentação e feedback com consciência de execução integrada ao editor. Clique em **Analyze**, escolha uma credencial de LLM e um modelo, e o Heym gera um relatório Markdown editável para o workflow atual.

Diferente de uma anotação estática, o analisador primeiro executa o workflow quando possível e inclui o resultado da execução no prompt. O relatório aborda áreas de melhoria, o propósito do workflow e uma explicação passo a passo do que os Nós fazem. Quando um relatório já existe, **Reanalyze** transmite uma prévia separada para que você possa aceitar a nova versão ou manter o documento compartilhado atual.

## Orquestrar
### Nós de LLM e Agente Integrados

O [Nó Agente](../nodes/agent-node.md) do Heym executa um loop de chamadas de ferramentas fortemente integrado com ferramentas Python inline, conexões MCP e um sistema portátil de skills, tudo projetado para agentes em produção.

O [Nó LLM](../nodes/llm-node.md) simples do Heym também vai além de uma única etapa de prompt-resposta. Para endpoints OpenAI e compatíveis com OpenAI suportados, ele pode alternar para o **modo Batch API**, de modo que um único Nó envia um array de prompts em uma requisição em lote nativa do provedor, com custo reduzido. O canvas então expõe um branch dedicado `batchStatus` que é disparado conforme o lote avança por estados como `pending`, `processing` e `completed`.

Isso significa que o Nó LLM pode fazer duas coisas ao mesmo tempo:

- Executar a requisição em lote principal e retornar as saídas finais por item no branch normal
- Disparar lógica de notificação ou logging a cada atualização relevante de status do lote, sem transformar o fluxo em um loop de polling customizado

A execução em lote é uma primitiva de Workflow LLM de primeira classe, com verificações de capacidade de provedor e modelo na interface do Nó.

O **Nó Agente** é o núcleo da orquestração de agentes no Heym:

- **Chamada de ferramentas** – O agente itera sobre chamadas de ferramentas em um loop até produzir uma resposta final
- **Ferramentas Python** – Defina ferramentas customizadas inline com Python completo; o agente as chama em tempo de execução
- **Conexões MCP** – Conecte-se a qualquer servidor [Model Context Protocol](https://modelcontextprotocol.io/) (stdio ou SSE) e o agente recebe todas as suas ferramentas automaticamente
- **Skills** – Solte um arquivo `.zip` ou `.md` sobre um agente para estender seu contexto de sistema e adicionar ferramentas Python
- **Chamadas de sub-workflow** – O agente pode invocar outros Workflows do Heym como ferramentas, compondo comportamentos complexos sem código customizado

Consulte [Nó Agente](../nodes/agent-node.md) e [Arquitetura de Agentes](../reference/agent-architecture.md) para a referência completa.

### Orquestração Multi-Agente

O Heym suporta um **padrão de orquestrador** com primitivas visuais de primeira classe:

- Um agente atua como **orquestrador** (`isOrchestrator: true`) e recebe uma ferramenta `call_sub_agent`
- Ele delega tarefas para **sub-agentes** nomeados no mesmo canvas
- Sub-agentes podem, por sua vez, chamar outros agentes ou sub-workflows (profundidade máxima: 5)
- **Execução paralela**: quando o orquestrador chama múltiplos sub-agentes em um único turno, eles são executados em paralelo para resultados mais rápidos

Isso viabiliza arquiteturas como um agente de planejamento que roteia trabalho para um pesquisador, um programador e um sumarizador, tudo conectado visualmente sem código de orquestração customizado.

Consulte [Arquitetura de Agentes](../reference/agent-architecture.md) para detalhes de execução.

### Agentes de Programação como Nós de Workflow

O Heym inclui dois Nós que executam um agente de programação real como etapa de Workflow, não como conclusão de chat:

- **[Nó Codex](../nodes/codex-node.md)** – Executa a CLI do OpenAI Codex em um workspace isolado do Heym contra um repositório GitHub. Suporta **Sign in with ChatGPT** (PKCE OAuth na sua assinatura Plus/Pro, sem custo de API por token) ou um access token, clona o repositório, permite que o Codex edite código e retorna `summary`, `diff`, `changedFiles` e uma `pullRequestUrl` de rascunho.
- **[Nó OpenCode Go](../nodes/opencode-go-node.md)** – O mesmo fluxo de repositório através do gateway OpenCode agnóstico de provedor (Kimi, DeepSeek, Qwen e mais), executado em um **contêiner descartável reforçado**: todas as capabilities removidas, root somente leitura, limites de pid/memória/CPU. O token do GitHub permanece fora do sandbox: o Heym realiza toda operação git e GitHub no host, de modo que o código gerado não pode exfiltrar credenciais de push.

Isso significa que um Workflow pode triar um bug a partir de um Webhook, entregar o repositório a um agente de programação, aguardar o PR de rascunho e postar o link no Slack, totalmente automatizado, com limites de recursos configuráveis por implantação.

### Pipeline RAG Integrado

O Heym inclui um [Nó RAG / Vector Store](../nodes/rag-node.md) e uma aba gerenciada de [Vectorstores](../tabs/vectorstores-tab.md). Você pode:

- Escolher seu backend de vetores: **Qdrant** (servidor externo) ou **Postgres (pgvector)**, que armazena vetores no próprio banco de dados do Heym sem serviço extra para executar
- Inserir documentos em um vector store diretamente de um Nó de Workflow
- Realizar busca semântica e alimentar resultados em um Nó LLM ou Agente
- Referenciar resultados com expressões como `$ragNode.results.map("item.payload.content").join("\n\n")`

No Heym, RAG são dois Nós com controle total sobre embeddings e recuperação.

### Automação de Navegador com Playwright

O [Nó Playwright](../nodes/playwright-node.md) é automação de navegador first-party no canvas.

- **Modo de etapas** – Componha visualmente ações de navegar, clicar, digitar, preencher, capturar tela, extrair e rolar
- **Etapas de IA com auto-heal** – Descreva uma ação em linguagem natural e um LLM gera as ações do Playwright; seletores com falha podem ser corrigidos automaticamente, e etapas geradas podem ser cacheadas para pular chamadas futuras ao LLM
- **Modo Run Code** – Alterne o Nó para Playwright Python completo para fluxos complexos (desabilitado por padrão; executa no sandbox reforçado do Heym quando habilitado)
- **Sessões autenticadas** – Restaure cookies/`storageState` antes de executar, verifique o login com uma checagem de seletor e recorra a etapas de login scriptadas
- **Captura de rede** – Opcionalmente colete respostas JSON, headers, cookies e armazenamento do navegador junto com os resultados

O Heym trata o navegador como um Nó normal, com as mesmas expressões, credenciais e tratamento de erros que todo o resto.
### Expression DSL

O [Expression DSL](../reference/expression-dsl.md) do Heym oferece uma sintaxe limpa e poderosa para referenciar dados de Nós anteriores:

- `$input.text` – Dados do Nó de Entrada
- `$nodeName.field` – Campo de saída de qualquer Nó anterior
- `$global.variableName` – Variáveis globais persistentes
- Auxiliares de array: `.first()`, `.map("field")`, `.join("\n")`

As expressões funcionam em todos os campos de texto, incluindo prompts, cabeçalhos HTTP, condições e valores definidos, de modo que os dados transitam entre as etapas de forma explícita. A DSL equilibra poder e legibilidade sem exigir conhecimento completo de JavaScript.

## Execução

### Triggers, Retentativas e Caminhos de Erro

Um Workflow pode iniciar de diversos lugares. Nós [Input](../nodes/input-node.md) recebem [webhooks](../reference/webhooks.md) HTTP, o [Cron](../nodes/cron-node.md) é executado conforme uma agenda, e [triggers](../reference/triggers.md) de eventos iniciam execuções a partir do Telegram, Discord, Slack, caixas de entrada IMAP, streams WebSocket, filas RabbitMQ, uploads de arquivos e eventos da plataforma Heym.

As falhas são tratadas dentro do grafo. Qualquer Nó pode tentar novamente em caso de falha com um número definido de tentativas e uma espera entre elas, cada tentativa é registrada no [histórico de execução](../reference/execution-history.md), e um Nó [Error Handler](../nodes/error-handler-node.md) é executado automaticamente quando um Nó falha, de modo que a recuperação faz parte do próprio Workflow.

### Execução Paralela em DAG

O executor de Workflows do Heym utiliza um agendador de grafo acíclico direcionado (DAG). Nós independentes são executados em paralelo automaticamente, sem necessidade de configuração.

- Nós no mesmo nível de dependência são despachados simultaneamente para um pool de threads (`max_workers=8`)
- Assim que qualquer Nó termina, seus Nós subsequentes são agendados
- O [Nó Merge](../nodes/merge-node.md) combina os resultados de ramificações paralelas
- Múltiplas execuções de Workflow são executadas simultaneamente; cada execução é totalmente isolada

O paralelismo é o comportamento padrão, determinado pela estrutura do grafo.

Consulte [Execução Paralela](../reference/parallel-execution.md).

### Escala entre Instâncias

Aponte uma segunda instância do Heym para o mesmo banco de dados PostgreSQL e ela se junta como worker. Execuções em segundo plano são compartilhadas entre instâncias conforme os pesos que você definir, um líder eleito mantém agendamentos, avaliação de alertas e recuperação de falhas em execução durante um failover, e cada execução registra a instância que a executou. Consulte [Distribuição de Carga](../reference/cluster.md).

### Quadro Kanban Agêntico

A [aba Board](../tabs/board-tab.md) é um quadro Kanban integrado onde as próprias colunas executam Workflows. Um cartão é uma tarefa agêntica persistente que carrega contexto, histórico de conversa, estado de execução, saídas e execuções de Workflow.

- **Cadeias de Workflow por coluna** – Mover um cartão para uma coluna dispara a cadeia de Workflow dessa coluna; um **Agentic Kanban Model** (sua credencial + modelo) mapeia o conteúdo do cartão para as entradas do Workflow e converte as saídas de volta em texto legível
- **Anexos de cartão** – Solte arquivos sobre um cartão; documentos são extraídos para texto e imagens são enviadas a modelos com capacidade de visão antes de cada execução
- **Canvas de execução ao vivo** – Abra a execução ativa dentro de um cartão e acompanhe-a sendo executada no canvas real do Workflow, Nó por Nó
- **Compartilhamento com equipe** – Compartilhe quadros com usuários ou equipes com permissões de leitura/escrita; cadeias em quadros compartilhados são executadas com as credenciais do proprietário, de modo que os colaboradores nunca precisam das suas próprias
- **Visibilidade de falhas** – Cartões com falha exibem um indicador de histórico de erros, e execuções de acompanhamento podem pausar para aguardar comentários

O quadro é uma superfície nativa da plataforma: cartões, Workflows, credenciais e execuções ao vivo residem todos em um único lugar.

### Heym Drive: Armazenamento de Arquivos Integrado

A [aba Drive](../tabs/drive-tab.md) é um armazenamento de arquivos integrado à plataforma. Arquivos gerados por skills e Workflows (PDF, DOCX, CSV, imagens) chegam lá automaticamente, e os anexos de cartões do quadro também são armazenados lá.

- **Links de compartilhamento** – Links de download públicos ou protegidos por senha (Basic Auth) com expiração opcional e limites máximos de download
- **Compartilhamento com equipe** – Compartilhe arquivos somente leitura com suas equipes e remova todos os compartilhamentos de equipe em uma única ação
- **Ações em massa** – Seleção múltipla com intervalos por shift-click, agrupe seleções em um único download ZIP ou aplique uma configuração de compartilhamento/senha/exclusão a vários arquivos de uma só vez
- **Acesso de agentes** – Skills podem optar por ler arquivos do Drive, de modo que um agente pode trabalhar sobre documentos que você ou outros Workflows produziram

Artefatos gerados ganham um lar permanente e compartilhável dentro da plataforma.

## Observação

### LLM Traces

A [aba Traces](../tabs/traces-tab.md) oferece observabilidade completa para cada chamada de LLM:

- Payloads de requisição e resposta
- Tempo por chamada: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Nomes, argumentos e resultados de chamadas de ferramentas
- Skills passadas ao modelo

O sistema de traces é projetado especificamente para depurar comportamento agêntico, com payloads completos de requisição e resposta e tempo por chamada.
### Rastreamento de Custo de Tokens de LLM

Toda chamada de LLM no Heym é automaticamente precificada. A [Aba de Traces](../tabs/traces-tab.md) exibe as contagens de tokens de entrada e saída por trace, juntamente com um custo em USD em tempo real, derivado de uma tabela de preços sincronizada.

- **Custo por trace** – Tokens de entrada, tokens de saída e total em USD exibidos em cada linha de trace
- **Análise de custos** – Cards de KPI e um gráfico de custo por modelo são atualizados conforme o intervalo de tempo selecionado (1h / 24h / 7d / 30d / Tudo)
- **Tabela de Custo de LLM** – Uma tabela de sistema na [Aba de DataTable](../tabs/datatable-tab.md) é populada a partir do Helicone a cada 24 horas; você pode sobrescrever preços ou adicionar linhas personalizadas para modelos ainda não listados
- **Aviso de preço ausente** – Traces de modelos sem entrada de preço exibem um aviso inline com um link direto para a tabela de custos

Cada execução carrega seu próprio custo em USD, detalhado por modelo.

### Abrir Execuções de Produção em um Canvas ao Vivo

Um workflow de produção permanece inspecionável após ser iniciado fora do editor. Abra qualquer entrada **Em Execução** em qualquer um dos diálogos de Histórico, ou abra a execução ativa dentro de um card do Agentic Kanban, e o Heym anexa o editor de workflow normal àquela execução exata.

- Nós que já finalizaram aparecem com seus resultados imediatamente
- O nó atual e os nós downstream pendentes continuam pulsando conforme a execução avança
- O painel de Debug recebe os mesmos resultados incrementais de nós que uma execução iniciada pelo canvas
- A saída final e os destaques de execução chegam sem polling ou iniciar uma execução duplicada
- Fechar o editor apenas desconecta o observador; nunca cancela o workflow de produção

O observador usa SSE com suporte de um snapshot de execução entre workers, portanto funciona para Triggers de webhook, agendamento, chat, MCP, integração e Board, mesmo quando outro worker de backend é o responsável pela execução.

### OpenTelemetry, Análise e Alertas

O Heym emite spans de [OpenTelemetry](../reference/opentelemetry.md) para cada execução de workflow, execução de nó e invocação de ferramenta de Agente, exportados via OTLP/HTTP para Jaeger, Grafana Tempo, Honeycomb, Datadog ou qualquer outro backend compatível.

A aba de [Análise](../tabs/analytics-tab.md) rastreia contagens de execução, taxa de sucesso, duração e tendências por workflow. Os [Alertas](../tabs/alerts-tab.md) monitoram contagens de erro, duração de execução, gasto de tokens ou USD e volume de execução em uma janela de tempo, e então executam um workflow de notificação que você escolher, para que um alerta chegue ao Slack, e-mail, Telegram ou qualquer outro lugar onde um nó possa chegar.

## Avaliar

### Evals Integrados

A [Aba de Evals](../tabs/evals-tab.md) permite definir suítes de teste e executá-las em seus workflows de agente:

- Crie casos de teste com entradas e saídas esperadas, ou gere-os a partir do prompt da suíte
- Execute uma suíte em vários modelos e compare suas saídas lado a lado
- Pontue com Exact Match, Contains ou LLM-as-Judge com um modelo juiz independente
- Revise aprovação/reprovação, real vs esperado e histórico de execuções

Altere um prompt ou um modelo, reexecute a suíte e compare os resultados antes que a mudança chegue à produção.

## Controlar

### Human-in-the-Loop (HITL)

O Heym possui um sistema integrado de [Human-in-the-Loop](../reference/human-in-the-loop.md) que permite aos agentes pausar a execução, solicitar revisão humana e retomar exatamente de onde pararam.

- **Checkpoints de Agente** – Habilite `hitlEnabled` em qualquer nó de Agente para conceder a ele uma ferramenta `request_human_review`. O agente decide quando uma decisão precisa de supervisão humana e chama a ferramenta com um resumo e um rascunho.
- **URLs públicas de revisão** – Cada solicitação de revisão gera um link seguro de uso único em `/review/{token}` (TTL de 168 horas). Os revisores podem **aceitar**, **editar e continuar** ou **recusar** sem fazer login.
- **Snapshots de execução** – O workflow congela seu estado completo (histórico de conversa, variáveis, resultados de ferramentas) para que retome exatamente de onde pausou após o revisor responder.
- **Ramificação de notificação** – Um handle de saída `review` opcional permite conectar um fluxo de notificação (Slack, e-mail, webhook) que dispara quando uma revisão é solicitada.
- **Políticas de aprovação de ferramentas MCP** – Diretrizes escritas de HITL são interpretadas em escopos de aprovação (`always` / `once` / `never`) para que o agente possa aprovar automaticamente ferramentas de baixo risco e escalar as de alto risco.
- **Múltiplos checkpoints** – Uma única execução de agente pode pausar para revisão várias vezes; cada checkpoint é independente.

URLs públicas de revisão, editar e continuar, ramificação de notificação e retomada baseada em snapshot funcionam todos a partir do mesmo checkpoint de agente.

Consulte [Human-in-the-Loop](../reference/human-in-the-loop.md) para a referência completa.

### Guardrails de LLM

O Heym possui [Guardrails](../reference/guardrails.md) integrados tanto em nós de [LLM](../nodes/llm-node.md) quanto de [Agente](../nodes/agent-node.md), para que você possa bloquear conteúdo inseguro antes que uma resposta de modelo chegue às etapas downstream.

- **Toggle de segurança no nível do nó** – Habilite guardrails diretamente no nó que gera ou processa conteúdo voltado ao usuário
- **Ampla cobertura de políticas** – Bloqueie violência, discurso de ódio, conteúdo sexual, NSFW/profanidade, assédio, atividades ilegais, solicitações de dados pessoais e tentativas de prompt injection
- **Detecção multilíngue** – Aplique as mesmas regras de segurança em turco, inglês, árabe, espanhol e outros idiomas
- **Fallback nativo do workflow** – Quando uma mensagem é bloqueada, o nó lança um erro tipado de workflow que você pode rotear através de um [Error Handler](../nodes/error-handler-node.md)

A política de segurança reside diretamente dentro da configuração de LLM e Agente e se conecta diretamente à ramificação de workflow e ao tratamento de erros.
### Acesso, Credenciais e Auditoria

Agentes atuam com credenciais reais, portanto o acesso faz parte da governança. [Credenciais](../reference/credentials.md) são criptografadas em repouso, mascaradas após a criação e compartilháveis com usuários ou [equipes](../reference/teams.md), e as equipes também compartilham workflows, variáveis, vector stores e arquivos do Drive. [Single sign-on](../reference/sso.md) conecta qualquer provedor OpenID Connect, incluindo Okta, Entra ID, Keycloak, Auth0 e Google. O [audit trail](../reference/audit.md) registra cada ação relevante para a segurança com seu ator, alvo e resultado, transmitido junto com os logs do seu container para o coletor de logs ou SIEM que você já utiliza.

### Self-Hosted, Você é Dono dos Seus Dados

O Heym roda na sua infraestrutura. Workflows, credenciais, histórico de execução e traces ficam no seu próprio banco de dados, e as chamadas de modelo partem dos seus servidores para o provedor que você escolher, ou para um modelo que você mesmo hospeda via Ollama ou vLLM. Para agentes que processam documentos sensíveis, dados de clientes ou bases de conhecimento proprietárias, isso geralmente é um requisito obrigatório.

O Heym é licenciado sob a **MIT License com a condição Commons Clause**. O código-fonte é source-available: você pode usá-lo, modificá-lo e hospedá-lo por conta própria livremente. A Commons Clause restringe a venda do software, incluindo a oferta de hospedagem paga ou serviços de consultoria/suporte cujo valor derive substancialmente do Heym. Para licenciamento comercial, implantações enterprise ou suporte profissional, entre em contato pelo [enterprise@heym.run](mailto:enterprise@heym.run).

## Expor

### APIs e Streaming

Workflows são chamáveis via HTTP em `/api/workflows/{workflow_id}/execute`, que retorna JSON, e em `/api/workflows/{workflow_id}/execute/stream`, que transmite eventos de nós como Server-Sent Events enquanto a execução avança. Ambos compartilham autenticação em nível de workflow, rate limiting e cache de resposta. Consulte [Webhooks](../reference/webhooks.md) e [SSE Streaming](../reference/sse-streaming.md).

### Integração com MCP (Model Context Protocol)

O Heym tem suporte nativo a [MCP](../tabs/mcp-tab.md) em ambos os lados:

- **Como cliente**: Nós Agente se conectam a servidores MCP externos (Filesystem, Browserbase, ferramentas customizadas) via stdio ou SSE e consomem suas ferramentas automaticamente
- **Como servidor**: Workflows com MCP ativado se tornam ferramentas no servidor padrão em `/api/mcp/sse`, ou em servidores nomeados com sua própria URL e API key, para que Claude Desktop, Cursor e outros clientes MCP possam chamar seus workflows do Heym diretamente

Agentes podem consumir vários servidores MCP ao mesmo tempo, e qualquer workflow pode se tornar uma ferramenta para um cliente MCP externo.

### Portal: Publique Workflows como Chat UIs

O recurso [Portal](../reference/portal.md) transforma qualquer workflow em uma interface de chat pública em `/chat/{slug}`:

- Autenticação opcional com credenciais por usuário
- Execução em streaming (progresso dos nós em tempo real)
- Suporte a upload de arquivos
- Histórico de conversas com múltiplos turnos

Equipes entregam ferramentas internas, chatbots voltados ao cliente e formulários com IA a partir de um workflow e uma URL, sem precisar escrever código de frontend.

### Dashboards com Workflows

A [aba Dashboard](../tabs/dashboard-tab.md) é uma superfície de relatórios construída pelo usuário, onde cada widget de gráfico é alimentado por seu próprio workflow oculto do Heym. Um widget pode chamar APIs, consultar BigQuery, buscar em RAG/vector stores, executar etapas de LLM, transformar linhas e finalizar com um [Nó Chart Output](../nodes/chart-output-node.md). Você pode criar widgets manualmente, gerá-los com IA, refiná-los depois, armazenar resultados em cache e reorganizar o grid visualmente.
## Comparação com Ferramentas de Automação de Workflow

Muitas equipes chegam ao Heym vindas de ferramentas de automação de workflow. A tabela abaixo compara o Heym com n8n, Zapier e Make.com nas capacidades que importam quando agentes entram em produção, e as notas de rodapé abaixo dela citam a documentação oficial por trás da comparação. Para uma análise mais aprofundada de cada ferramenta individualmente, consulte as páginas de comparação em [heym.run/compare](https://heym.run/compare).

| Capacidade | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Nó LLM integrado | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + ramificações de status | ✓ | limitado¹¹ | –¹¹ | limitado¹¹ |
| Nó Agente integrado (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Orquestração multiagente | ✓ | ✓ | limitado | limitado |
| Nós de agente de codificação (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| RAG / vector store integrado | ✓ | ✓ | limitado¹ | plugin² |
| Leitura / escrita WebSocket | ✓ | limitado¹² | –¹³ | –¹⁴ |
| Construtor de workflow em linguagem natural | ✓ | limitado³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Abrir uma execução em andamento no canvas ao vivo | ✓ | limitado¹⁹ | limitado¹⁹ | –¹⁹ |
| Dashboards alimentados por workflow | ✓ | limitado¹⁷ | limitado¹⁷ | limitado¹⁷ |
| Quadro Kanban agêntico | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Sistema de Skills para agentes | ✓ | – | – | – |
| Drive de arquivos integrado (links de compartilhamento, equipes) | ✓ | limitado²² | limitado²² | –²² |
| Nó de automação de navegador (Playwright) | ✓ | limitado²³ | limitado²³ | –²³ |
| Inspeção de trace de LLM | ✓ | limitado⁴ | – | ✓ |
| Exportação de tracing OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Rastreamento de custo de tokens de LLM (USD) | ✓ | –¹⁵ | –¹⁵ | limitado¹⁵ |
| Evals integradas para workflows de IA | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | limitado⁶ | limitado⁷ |
| Guardrails de LLM | ✓ | ✓⁸ | ✓⁸ | limitado⁸ |
| Compressão automática de contexto | ✓ | – | – | – |
| Execução paralela de DAG | ✓ | limitado⁹ | – | – |
| Auto-hospedável, código-fonte disponível | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| DSL de expressões para dados dinâmicos | ✓ | ✓ | limitado | ✓ |
> **Notas de rodapé:** ¹ Zapier Knowledge Sources — sem vector store exposto ou controle de embedding. ² Make.com possui módulos Pinecone/Qdrant, mas nenhum Nó RAG nativo. ³ n8n AI Workflow Builder é beta somente em nuvem com limites de créditos. ⁴ n8n exibe etapas intermediárias; o tracing completo exige ferramentas de terceiros. ⁵ n8n oferece suporte a aprovações de chamadas de ferramentas de IA por meio de chat, e-mail e canais de colaboração, mas não captura snapshots nem retoma toda a execução como o Heym faz. ⁶ Zapier Human in the Loop oferece suporte a aprovações e coleta de dados dentro de Zaps, mas não é um sistema de checkpoint com revisão pública e retomada por snapshot. ⁷ Make.com oferece Human in the Loop como um app Enterprise com solicitações de revisão e resultados ajustados/aprovados/cancelados, mas permanece limitado por plano e menos nativo para agentes. ⁸ n8n disponibiliza um Nó Guardrails dedicado, Zapier disponibiliza AI Guardrails em seus produtos de IA, e Make.com documenta regras de agentes e fluxos de revisão, mas não um recurso de guardrails autônomo comparável, portanto Make está marcado como limitado. ⁹ n8n executa sequencialmente por padrão; o paralelismo exige contornos com sub-workflows. ¹⁰ Sustainable Use License — livre para auto-hospedagem em uso interno, redistribuição comercial restrita. ¹¹ Em 22 de abril de 2026, a documentação oficial do n8n descreve batching HTTP e padrões de loop/wait em vez de um branch nativo de status de batch de LLM, a documentação oficial do app ChatGPT do Zapier não lista Triggers e apenas um API Request beta genérico, e a página oficial de integração com OpenAI do Make expõe ações em lote como create/watch completed, mas não um Nó LLM de primeira classe com ramificação por status, portanto n8n/Make estão marcados como limitados e Zapier está marcado como indisponível para esse padrão específico de Workflow. ¹² A documentação oficial do n8n cobre os Nós HTTP Webhook e HTTP Request, além de extensibilidade via Code/custom/community, mas não consegui encontrar um Nó de Trigger/envio WebSocket de primeira linha, portanto n8n está marcado como limitado. ¹³ A documentação oficial do Zapier cobre Webhooks de entrada e requisições de Webhook/API de saída apenas via HTTP, não etapas nativas de Trigger ou envio WebSocket. ¹⁴ A documentação oficial do Make cobre módulos de Webhooks e módulos de requisição HTTP(S), mas não consegui encontrar um módulo nativo de Trigger ou envio WebSocket. ¹⁵ n8n não possui rastreamento nativo de custo de tokens de LLM; existem Workflows alternativos da comunidade, mas exigem instalação manual e chamadas de API pós-execução (feature request aberto em maio de 2026). O Zapier não expõe contagem de tokens por execução nem custo em USD aos usuários; etapas de IA consomem apenas tasks. O painel de créditos do Make.com reflete parcialmente o consumo de tokens para IA hospedada pelo Make (desde agosto de 2025), mas conexões com chaves de API de terceiros são cobradas como 1 operação = 1 crédito, sem contagem de tokens; não há detalhamento em USD por execução por modelo disponível. ¹⁶ O Heym emite spans nativos de OpenTelemetry (um por execução de Workflow mais um por Nó) via OTLP/HTTP para qualquer backend compatível, com propagação de trace-context W3C e sem código de instrumentação, configurado por meio de variáveis de ambiente `HEYM_OTEL_*` e desabilitado por padrão. O n8n possui uma integração documentada de tracing com OpenTelemetry para execuções de Workflow e Nó. Zapier e Make.com não documentam exportação via OpenTelemetry de suas execuções de Workflow/cenário em junho de 2026. ¹⁷ n8n documenta um painel Insights para métricas de execução em produção, Zapier documenta Zap History mais Task Usage, e Make.com documenta Scenario History; essas são superfícies de monitoramento/histórico, não widgets de dashboard personalizados respaldados por lógica arbitrária de Workflow como a aba Dashboard do Heym. ¹⁸ O Heym Workflow Analyzer executa o Workflow quando possível, lê o resultado da execução e gera um relatório Markdown compartilhado e editável cobrindo áreas de melhoria, propósito e comportamento passo a passo. n8n documenta o AI Workflow Builder para criar/refinar/depurar Workflows, Zapier documenta solução de problemas com IA para execuções de Zap com erro, e Make.com documenta o histórico de cenário mais etapas de raciocínio do agente de IA, mas suas documentações públicas não descrevem o mesmo documento compartilhado de análise de Workflow ciente da execução. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) lista execuções em andamento e pode carregar dados de uma execução anterior no editor, enquanto [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) expõe um estado em execução em seu editor. [Make Scenario History](https://help.make.com/scenario-history) documenta detalhes de execução e logs. Sua documentação pública, verificada em 18 de julho de 2026, não descreve o fluxo exato do Heym: abrir uma execução de produção arbitrária em andamento a partir do History ou de um cartão Kanban, restaurar seu snapshot atual de Nó e continuar recebendo animação de Nó e logs de Debug no mesmo canvas. ²⁰ Os Nós [Codex](../nodes/codex-node.md) e [OpenCode Go](../nodes/opencode-go-node.md) do Heym executam uma CLI real de agente de codificação em um workspace isolado do Heym contra um repositório GitHub — clone, edição, produção de diff, push de branch, abertura de pull request — como uma etapa de Workflow de primeira classe. Em 20 de julho de 2026, nenhum concorrente documenta equivalente: o [Nó OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) do n8n cobre chamadas de API de chat/assistant, não um agente de codificação em nível de repositório, e o suporte nativo ao Codex permanece uma solicitação da comunidade; o próprio blog do Zapier documenta a direção inversa — [Codex conduzindo ferramentas do Zapier por meio do Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — não o Codex como etapa de um Zap; os módulos OpenAI do Make.com expõem completions/assistants/ações em lote, não um agente de codificação que clona repositórios e abre PRs. ²¹ A [aba Board](../tabs/board-tab.md) do Heym é um quadro Kanban agêntico integrado cujas colunas executam Workflows e cujos cartões carregam contexto, histórico de conversa, estado de execução e execuções. n8n ([integração Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([integrações Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) e Make.com ([integração Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) apenas se conectam a apps de kanban de terceiros, como Kanban Tool, Wekan ou NocoDB; nenhum documenta um quadro integrado que executa seus próprios Workflows, em 20 de julho de 2026. ²² n8n armazena dados binários de execução internamente (opcionalmente em [armazenamento externo compatível com S3](https://docs.n8n.io/hosting/scaling/external-storage/)), mas não documenta nenhum drive de arquivos voltado ao usuário com links de compartilhamento ou compartilhamento em equipe, portanto está marcado como limitado. O [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) do Zapier processa arquivos apenas durante a execução de um Zap e o [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) armazena pequenos valores de texto, portanto Zapier está marcado como limitado. Os [data stores](https://help.make.com/l6du-data-stores) do Make.com armazenam registros estruturados e seu [manuseio de arquivos](https://help.make.com/working-with-files) passa arquivos entre apps sem armazenamento integrado persistente, portanto Make está marcado como indisponível. ²³ O [Nó Playwright](../nodes/playwright-node.md) do Heym é automação de navegador de primeira linha com um modo visual de etapas, etapas geradas por IA e um modo de código completo. n8n oferece apenas pacotes da comunidade, como [n8n-playwright](https://github.com/toema/n8n-playwright), com uma [feature request ainda aberta para Nós nativos de automação de navegador](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), portanto está marcado como limitado. Os Zapier Agents podem [navegar e ler páginas via navegação web e uma extensão do Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), mas o Zapier não documenta nenhuma etapa de automação de navegador com script, portanto está marcado como limitado. Make.com documenta módulos HTTP e apps de scraping de terceiros em vez de qualquer módulo nativo de automação de navegador, em 20 de julho de 2026.
## Relacionados

- [Introdução](./introduction.md) – Visão geral da plataforma
- [Início Rápido](./quick-start.md) – Crie seu primeiro workflow
- [Análise de Workflow](../reference/workflow-analysis.md) – Gere relatórios compartilhados de execução de workflow e feedback de melhorias
- [Aba Dashboard](../tabs/dashboard-tab.md) – Crie dashboards baseados em workflows com widgets de gráficos gerados por IA
- [Nó Agente](../nodes/agent-node.md) – Nó LLM com chamada de ferramentas, MCP e skills
- [Arquitetura de Agentes](../reference/agent-architecture.md) – Sub-agentes, orquestrador e despacho de ferramentas
- [Aba Board](../tabs/board-tab.md) – Quadro Kanban agêntico com colunas que executam workflows
- [Nó Codex](../nodes/codex-node.md) – Execute o agente de codificação OpenAI Codex em um repositório GitHub
- [Nó OpenCode Go](../nodes/opencode-go-node.md) – Agente de codificação agnóstico de provedor em um container reforçado
- [Aba Drive](../tabs/drive-tab.md) – Armazenamento de arquivos integrado com links de compartilhamento, equipes e ações em massa
- [Nó Playwright](../nodes/playwright-node.md) – Automação de navegador nativa com etapas de IA e modo de código
- [Nó RAG / Vector Store](../nodes/rag-node.md) – Busca vetorial e inserção de documentos (Qdrant ou Postgres pgvector)
- [Assistente de IA](../reference/ai-assistant.md) – Construtor de workflows em linguagem natural
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Checkpoints de agente com URLs públicas de revisão
- [Guardrails](../reference/guardrails.md) – Bloqueie prompts inseguros antes que cheguem aos seus modelos
- [Aba Traces](../tabs/traces-tab.md) – Observabilidade de chamadas LLM
- [Aba Evals](../tabs/evals-tab.md) – Suítes de testes para workflows de IA
- [Aba Alertas](../tabs/alerts-tab.md) – Alertas de limite para erros, duração, custo e volume de execuções
- [Rastreamento OpenTelemetry](../reference/opentelemetry.md) – Exporte spans de execução, nós e ferramentas via OTLP
- [Distribuição de Carga](../reference/cluster.md) – Compartilhe execuções entre instâncias com failover de líder
- [Single Sign-On](../reference/sso.md) – Faça login por qualquer provedor OpenID Connect
- [Log de Auditoria](../reference/audit.md) – Ações relevantes para segurança com ator, alvo e resultado
- [Portal](../reference/portal.md) – Publique workflows como interfaces públicas de chat
- [Execução Paralela](../reference/parallel-execution.md) – Execução concorrente baseada em DAG
- [Aba MCP](../tabs/mcp-tab.md) – Configuração de servidor e cliente MCP
