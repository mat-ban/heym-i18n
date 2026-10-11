# Porquê o Heym

O Heym é infraestrutura para executar e governar agentes de IA em produção. Um runtime auto-alojado cobre todas as fases do ciclo de vida do agente.

Um agente em protótipo precisa de um modelo, um prompt e algumas ferramentas. Um agente em produção precisa também de triggers e retries, estado guardado quando pausa para uma pessoa, um registo de cada chamada a modelos e ferramentas, um custo para cada execução, testes antes de uma alteração ser publicada e limites claros sobre o que pode fazer autonomamente. O Heym reúne tudo isto num único lugar, para que o sistema que concebe no canvas seja o sistema que é executado. Construa sistemas agênticos e execute-os com confiança.

## Um Runtime para o Ciclo de Vida do Agente

| Fase | O que o Heym lhe oferece |
|---|---|
| **Construir** | Componha agentes e passos determinísticos no canvas, gere-os com o [Assistente de IA](../reference/ai-assistant.md) ou comece a partir de [Modelos](../tabs/templates-tab.md) e skills portáveis. |
| **Orquestrar** | Coordene agentes, [sub-agentes](../reference/agent-architecture.md), agentes de programação, RAG, automação de browser e ferramentas com fluxo de dados explícito e [execução paralela](../reference/parallel-execution.md). |
| **Executar** | Inicie execuções a partir de [webhooks](../reference/webhooks.md), agendamentos e [triggers](../reference/triggers.md) de eventos, com retries por nó, [tratamento de erros](../nodes/error-handler-node.md) e [distribuição de carga](../reference/cluster.md) entre instâncias. |
| **Observar** | Inspecione cada execução através do [histórico](../reference/execution-history.md), [rastreios LLM](../tabs/traces-tab.md), custo em USD por execução, execuções em direto no canvas, [análises](../tabs/analytics-tab.md), [alertas](../tabs/alerts-tab.md) e exportação [OpenTelemetry](../reference/opentelemetry.md). |
| **Avaliar** | Teste prompts e modelos face a resultados esperados em [Avaliações](../tabs/evals-tab.md), com pontuação LLM-as-Judge e comparação de modelos lado a lado. |
| **Controlar** | Mantenha os humanos no controlo com [pontos de verificação de revisão](../reference/human-in-the-loop.md) e [guardrails](../reference/guardrails.md), e governe o acesso com [credenciais](../reference/credentials.md) encriptadas, [equipas](../reference/teams.md), [início de sessão único](../reference/sso.md) e um [registo de auditoria](../reference/audit.md). |
| **Expor** | Disponibilize workflows via REST e [SSE](../reference/sse-streaming.md), como ferramentas [MCP](../tabs/mcp-tab.md), como interfaces de chat do [Portal](../reference/portal.md) e como widgets do [dashboard](../tabs/dashboard-tab.md). |

## Construir

### Assistente de IA: Construir Workflows com Linguagem Natural

O [Assistente de IA](../reference/ai-assistant.md) é um painel de chat dentro do editor de workflows. Descreva o que pretende, por exemplo "crie um workflow que recebe input do utilizador, pesquisa na minha base de conhecimento e responde usando GPT-4o", e o assistente gera nós e ligações que são aplicados instantaneamente ao canvas.

- Utiliza a sua própria credencial LLM (qualquer modelo suportado)
- Suporta **entrada por voz** para conceção de workflows mãos-livres
- Aplica automaticamente ao canvas o JSON de workflow válido da resposta da IA
- Transmite respostas em tempo real

O assistente funciona diretamente dentro do editor e transmite nós para o canvas em tempo real, e tudo o que gera permanece editável como os nós que colocou manualmente.

### Sistema de Skills

As skills são pacotes de capacidades portáveis, um ficheiro de instruções `SKILL.md` mais scripts Python opcionais, que podem ser colocados em qualquer Nó de agente.

- As instruções da skill são pré-anexadas ao prompt de sistema do agente
- Os ficheiros Python na skill tornam-se ferramentas invocáveis
- As skills são reutilizáveis entre workflows e partilháveis como arquivos `.zip`

Isto é análogo a dar ao seu agente uma descrição de funções e uma caixa de ferramentas numa única operação.

### Analisador de Workflows: Feedback Consciente da Execução

O painel de [Análise de Workflows](../reference/workflow-analysis.md) é uma ferramenta de documentação e feedback consciente da execução, integrada no editor. Clique em **Analyze**, escolha uma credencial LLM e um modelo, e o Heym gera um relatório Markdown editável para o workflow atual.

Ao contrário de uma nota estática, o analisador executa primeiro o workflow quando possível e inclui o resultado da execução no prompt. O relatório abrange áreas de melhoria, o propósito do workflow e uma explicação passo a passo do que os nós fazem. Quando já existe um relatório, **Reanalyze** transmite uma pré-visualização separada para que possa aceitar a nova versão ou manter o documento partilhado atual.

## Orquestrar

### Nós de LLM e de Agente Integrados

O [Nó de Agente](../nodes/agent-node.md) do Heym executa um ciclo de chamadas de ferramentas fortemente integrado, com ferramentas Python inline, ligações MCP e um sistema de competências portátil, tudo concebido para agentes de produção.

O [nó LLM](../nodes/llm-node.md) simples do Heym também vai além de um único passo de prompt-resposta. Para endpoints OpenAI e compatíveis com OpenAI suportados, pode alternar para o **modo Batch API**, de modo que um único nó submete um array de prompts num pedido batch nativo do fornecedor com custo reduzido. O canvas expõe então um ramo dedicado `batchStatus` que é acionado à medida que o batch atravessa estados como `pending`, `processing` e `completed`.

Isto significa que o nó LLM pode fazer duas coisas em simultâneo:

- Executar o pedido batch principal e devolver os resultados finais por item no ramo normal
- Acionar lógica de notificação ou de registo em cada atualização relevante do estado do batch, sem transformar o fluxo num ciclo de polling personalizado

A execução em batch é um primitivo de workflow LLM de primeira classe, com verificações de capacidade do fornecedor e do modelo na interface do nó.

O **Nó de Agente** é o núcleo da orquestração de agentes no Heym:

- **Chamada de ferramentas** – O agente itera sobre chamadas de ferramentas num ciclo até produzir uma resposta final
- **Ferramentas Python** – Defina ferramentas personalizadas inline com Python completo; o agente chama-as em tempo de execução
- **Ligações MCP** – Ligue-se a qualquer servidor [Model Context Protocol](https://modelcontextprotocol.io/) (stdio ou SSE) e o agente obtém automaticamente todas as suas ferramentas
- **Competências** – Coloque um ficheiro `.zip` ou `.md` num agente para ampliar o seu contexto de sistema e adicionar ferramentas Python
- **Chamadas a sub-workflows** – O agente pode invocar outros workflows do Heym como ferramentas, compondo comportamentos complexos sem código personalizado

Consulte o [Nó de Agente](../nodes/agent-node.md) e a [Arquitetura de Agentes](../reference/agent-architecture.md) para a referência completa.

### Orquestração Multi-Agente

O Heym suporta um **padrão de orquestrador** com primitivos visuais de primeira classe:

- Um agente atua como **orquestrador** (`isOrchestrator: true`) e recebe uma ferramenta `call_sub_agent`
- Delega tarefas a **sub-agentes** nomeados no mesmo canvas
- Os sub-agentes podem, por sua vez, chamar outros agentes ou sub-workflows (profundidade máxima: 5)
- **Execução paralela**: Quando o orquestrador chama vários sub-agentes num único turno, estes são executados em paralelo para obter resultados mais rápidos

Isto permite arquiteturas como um agente de planeamento que encaminha trabalho para um investigador, um programador e um sumarizador, tudo ligado visualmente sem código de orquestração personalizado.

Consulte a [Arquitetura de Agentes](../reference/agent-architecture.md) para detalhes de execução.

### Agentes de Programação como Nós de Workflow

O Heym inclui dois nós que executam um verdadeiro agente de programação como passo de workflow, e não uma conclusão de chat:

- **[Nó Codex](../nodes/codex-node.md)** – Executa a CLI do OpenAI Codex num espaço de trabalho Heym isolado contra um repositório GitHub. Suporta **Iniciar sessão com ChatGPT** (OAuth PKCE na sua subscrição Plus/Pro, sem custo de API por token) ou um token de acesso, clona o repositório, permite ao Codex editar código e devolve `summary`, `diff`, `changedFiles` e um `pullRequestUrl` em rascunho.
- **[Nó OpenCode Go](../nodes/opencode-go-node.md)** – O mesmo workflow de repositório através do gateway OpenCode agnóstico de fornecedor (Kimi, DeepSeek, Qwen e mais), executado num **contentor descartável reforçado**: todas as capacidades removidas, raiz só de leitura, limites de pid/memória/CPU. O token do GitHub permanece fora da sandbox: o Heym realiza todas as operações git e GitHub no lado do anfitrião, para que o código gerado não possa exfiltrar credenciais de push.

Isto significa que um workflow pode triar um bug a partir de um webhook, entregar o repositório a um agente de programação, aguardar pelo PR em rascunho e publicar a ligação no Slack, totalmente automatizado, com limites de recursos configuráveis por implementação.

### Pipeline RAG Integrado

O Heym inclui um [Nó RAG / Vector Store](../nodes/rag-node.md) e um separador gerido de [Vectorstores](../tabs/vectorstores-tab.md). Pode:

- Escolher o seu backend vetorial: **Qdrant** (servidor externo) ou **Postgres (pgvector)**, que armazena vetores na própria base de dados do Heym sem necessidade de executar um serviço adicional
- Inserir documentos num armazenamento vetorial diretamente a partir de um nó de workflow
- Realizar pesquisa semântica e alimentar os resultados num nó LLM ou de Agente
- Referenciar resultados com expressões como `$ragNode.results.map("item.payload.content").join("\n\n")`

No Heym, o RAG são dois nós com controlo total sobre embeddings e recuperação.

### Automação de Browser com Playwright

O [nó Playwright](../nodes/playwright-node.md) é automação de browser de primeira parte no canvas.

- **Modo de passos** – Componha ações de navegação, clique, escrita, preenchimento, captura de ecrã, extração e deslocamento visualmente
- **Passos de IA com auto-reparação** – Descreva uma ação em linguagem natural e um LLM gera as ações Playwright; os seletores falhados podem ser reparados automaticamente, e os passos gerados podem ser colocados em cache para evitar chamadas futuras ao LLM
- **Modo Executar Código** – Mude o nó para Playwright Python completo para fluxos complexos (desativado por predefinição; é executado na sandbox reforçada do Heym quando ativado)
- **Sessões autenticadas** – Restaure cookies/`storageState` antes de executar, verifique o início de sessão com uma verificação de seletor e recorra a passos de início de sessão por script
- **Captura de rede** – Recolha opcionalmente respostas JSON, cabeçalhos, cookies e armazenamento do browser juntamente com os resultados

O Heym trata o browser como um nó normal, com as mesmas expressões, credenciais e tratamento de erros que tudo o resto.

### Expression DSL

A [Expression DSL](../reference/expression-dsl.md) do Heym fornece uma sintaxe limpa e poderosa para referenciar dados de nós a montante:

- `$input.text` – Dados do nó de entrada
- `$nodeName.field` – Campo de saída de qualquer nó a montante
- `$global.variableName` – Variáveis globais persistentes
- Auxiliares de array: `.first()`, `.map("field")`, `.join("\n")`

As expressões funcionam em todos os campos de texto, incluindo prompts, cabeçalhos HTTP, condições e valores definidos, para que os dados se movam explicitamente entre passos. A DSL equilibra poder e legibilidade sem exigir conhecimento completo de JavaScript.

## Executar

### Triggers, Retries e Caminhos de Erro

Um workflow pode começar a partir de muitos locais. Os nós de [Entrada](../nodes/input-node.md) recebem [webhooks](../reference/webhooks.md) HTTP, o [Cron](../nodes/cron-node.md) é executado segundo um agendamento, e os [triggers](../reference/triggers.md) de eventos iniciam execuções a partir do Telegram, Discord, Slack, caixas de entrada IMAP, streams WebSocket, filas RabbitMQ, carregamentos de ficheiros e eventos da plataforma Heym.

As falhas são tratadas dentro do grafo. Qualquer nó pode repetir em caso de falha com um número definido de tentativas e uma espera entre elas, cada tentativa é registada no [histórico de execuções](../reference/execution-history.md), e um nó [Error Handler](../nodes/error-handler-node.md) é executado automaticamente quando um nó falha, pelo que a recuperação faz parte do próprio workflow.

### Execução Paralela de DAG

O executor de workflows do Heym utiliza um agendador de grafo acíclico dirigido (DAG). Os nós independentes são executados em paralelo automaticamente, sem necessidade de configuração.

- Os nós no mesmo nível de dependência são despachados em simultâneo para um pool de threads (`max_workers=8`)
- Assim que qualquer nó termina, os seus nós a jusante são agendados
- O [Nó de Merge](../nodes/merge-node.md) combina os resultados de ramos paralelos
- Várias execuções de workflow são executadas em simultâneo; cada execução é totalmente isolada

O paralelismo é o comportamento predefinido, determinado pela estrutura do grafo.

Consulte [Execução Paralela](../reference/parallel-execution.md).

### Escala entre Instâncias

Aponte uma segunda instância do Heym para a mesma base de dados PostgreSQL e esta junta-se como worker. As execuções em segundo plano são partilhadas entre instâncias pelos pesos que definir, um líder eleito mantém os agendamentos, a avaliação de alertas e a recuperação de falhas em execução através de um failover, e cada execução registra a instância que a executou. Consulte [Distribuição de Carga](../reference/cluster.md).

### Quadro Kanban Agêntico

O [separador Board](../tabs/board-tab.md) é um quadro Kanban integrado onde as próprias colunas executam workflows. Um cartão é uma tarefa agêntica persistente que transporta contexto, histórico de conversação, estado de execução, saídas e execuções de workflow.

- **Cadeias de workflow por coluna** – Mover um cartão para uma coluna desencadeia a cadeia de workflow dessa coluna; um **Modelo Kanban Agêntico** (a sua credencial + modelo) mapeia o conteúdo do cartão para as entradas do workflow e converte as saídas de volta em texto legível
- **Anexos de cartão** – Largue ficheiros sobre um cartão; os documentos são extraídos para texto e as imagens são passadas a modelos com capacidade de visão antes de cada execução
- **Canvas de execução em direto** – Abra a execução ativa dentro de um cartão e veja-a executar no canvas real do workflow, nó a nó
- **Partilha em equipa** – Partilhe quadros com utilizadores ou equipas com permissões de leitura/escrita; as cadeias em quadros partilhados são executadas com as credenciais do proprietário, pelo que os colaboradores nunca precisam das suas próprias
- **Visibilidade de falhas** – Os cartões falhados apresentam um indicador de histórico de erros, e as execuções de seguimento podem pausar para aguardar comentários

O quadro é uma superfície nativa da plataforma: cartões, workflows, credenciais e execuções em direto residem todos num único local.

### Heym Drive: Armazenamento de Ficheiros Integrado

O [separador Drive](../tabs/drive-tab.md) é um armazenamento de ficheiros integrado na plataforma. Os ficheiros gerados por skills e workflows (PDF, DOCX, CSV, imagens) ficam lá automaticamente, e os anexos dos cartões do quadro também são armazenados lá.

- **Ligações de partilha** – Ligações de download públicas ou protegidas por palavra-passe (Basic Auth) com expiração opcional e limites máximos de downloads
- **Partilha em equipa** – Partilhe ficheiros apenas para leitura com as suas equipas, e remova todas as partilhas de equipa numa única ação
- **Ações em massa** – Selecione vários com intervalos shift-click, agrupe seleções num único download ZIP, ou aplique uma definição de partilha/palavra-passe/eliminação a muitos ficheiros de uma só vez
- **Acesso de agentes** – As skills podem optar por ler ficheiros do Drive, para que um agente possa trabalhar sobre documentos que você ou outros workflows produziram

Os artefactos gerados obtêm um local permanente e partilhável dentro da plataforma.

## Observar

### Rastreios de LLM

O [Separador Traces](../tabs/traces-tab.md) fornece observabilidade total para cada chamada de LLM:

- Payloads de pedido e resposta
- Temporização por chamada: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Nomes de chamadas de ferramentas, argumentos e resultados
- Skills passadas ao modelo

O sistema de rastreio é concebido especificamente para depurar comportamento agêntico, com payloads completos de pedido e resposta e temporização por chamada.

### Rastreio de Custos de Tokens de LLM

Cada chamada de LLM no Heym tem um custo calculado automaticamente. O [Separador Rastreios](../tabs/traces-tab.md) apresenta as contagens de tokens de entrada e saída por rastreio, juntamente com um custo em USD em tempo real, derivado de uma tabela de preços sincronizada.

- **Custo por rastreio** – Tokens de entrada, tokens de saída e total em USD apresentados em cada linha de rastreio
- **Análise de custos** – Cartões de KPI e um gráfico de custos por modelo que é atualizado com o intervalo de tempo selecionado (1h / 24h / 7d / 30d / Tudo)
- **Tabela de Custos de LLM** – Uma tabela de sistema no [Separador Tabelas de dados](../tabs/datatable-tab.md) é preenchida a partir do Helicone a cada 24 horas; é possível substituir preços ou adicionar linhas personalizadas para modelos ainda não listados
- **Aviso de preço em falta** – Os rastreios de modelos sem entrada de preços apresentam um aviso em linha com uma ligação direta para a tabela de custos

Cada execução tem o seu próprio custo em USD, discriminado por modelo.

### Abrir Execuções de Produção num Canvas em Direto

Um workflow de produção permanece inspecionável depois de ser iniciado fora do editor. Abra qualquer entrada **Em execução** a partir de qualquer um dos diálogos de Histórico, ou abra a execução ativa dentro de um cartão do Agentic Kanban, e o Heym associa o editor de workflow normal a essa execução exata.

- Os nós que já terminaram aparecem imediatamente com os seus resultados
- O nó atual e os nós subsequentes pendentes continuam a pulsar à medida que a execução avança
- O painel de Depuração recebe os mesmos resultados incrementais dos nós que uma execução iniciada no canvas
- A saída final e os destaques da execução chegam sem polling nem iniciar uma execução duplicada
- Fechar o editor apenas desliga o observador; nunca cancela o workflow de produção

O observador utiliza SSE suportado por um snapshot de execução entre workers, pelo que funciona para triggers de webhook, agendamento, chat, MCP, integração e Board, mesmo quando outro worker de backend é o proprietário da execução.

### OpenTelemetry, Análise e Alertas

O Heym emite spans de [OpenTelemetry](../reference/opentelemetry.md) para cada execução de workflow, execução de nó e invocação de ferramenta de Agente, exportados via OTLP/HTTP para Jaeger, Grafana Tempo, Honeycomb, Datadog ou qualquer outro backend compatível.

O separador [Análise](../tabs/analytics-tab.md) acompanha contagens de execuções, taxa de sucesso, duração e tendências por workflow. Os [Alertas](../tabs/alerts-tab.md) monitorizam contagens de erros, duração da execução, gastos em tokens ou USD e volume de execuções num intervalo de tempo, e depois executam um workflow de notificação à sua escolha, para que um alerta chegue ao Slack, email, Telegram ou a qualquer outro local onde um nó consiga chegar.

## Avaliar

### Avaliações Integradas

O [Separador Avaliações](../tabs/evals-tab.md) permite definir conjuntos de testes e executá-los contra os seus workflows de agente:

- Crie casos de teste com entradas e saídas esperadas, ou gere-os a partir do prompt do conjunto
- Execute um conjunto contra vários modelos e compare as suas saídas lado a lado
- Pontue com Correspondência Exata, Contém, ou LLM-as-Judge com um modelo juiz independente
- Reveja aprovação/reprovação, real vs esperado e histórico de execuções

Altere um prompt ou um modelo, volte a executar o conjunto e compare os resultados antes de a alteração chegar à produção.

## Controlar

### Human-in-the-Loop (HITL)

O Heym tem um sistema integrado de [Human-in-the-Loop](../reference/human-in-the-loop.md) que permite aos agentes pausar a execução, solicitar revisão humana e retomar exatamente de onde pararam.

- **Pontos de verificação do agente** – Ative `hitlEnabled` em qualquer nó de Agente para lhe dar uma ferramenta `request_human_review`. O agente decide quando uma decisão necessita de supervisão humana e chama a ferramenta com um resumo e um rascunho.
- **URLs de revisão públicas** – Cada pedido de revisão gera uma ligação segura de utilização única em `/review/{token}` (TTL de 168 horas). Os revisores podem **aceitar**, **editar e continuar**, ou **recusar** sem iniciar sessão.
- **Snapshots de execução** – O workflow congela o seu estado completo (histórico de conversa, variáveis, resultados de ferramentas) para que retome exatamente onde pausou depois de o revisor responder.
- **Ramificação de notificação** – Uma saída opcional `review` permite ligar um fluxo de notificação (Slack, email, webhook) que é acionado quando é solicitada uma revisão.
- **Políticas de aprovação de ferramentas MCP** – As diretrizes HITL escritas são interpretadas em âmbitos de aprovação (`always` / `once` / `never`) para que o agente possa aprovar automaticamente ferramentas de baixo risco e escalar as de alto risco.
- **Múltiplos pontos de verificação** – Uma única execução de agente pode pausar para revisão várias vezes; cada ponto de verificação é independente.

Os URLs de revisão públicos, a edição e continuação, a ramificação de notificação e a retoma baseada em snapshot funcionam todos a partir do mesmo ponto de verificação do agente.

Consulte [Human-in-the-Loop](../reference/human-in-the-loop.md) para a referência completa.

### Guardrails de LLM

O Heym tem [Guardrails](../reference/guardrails.md) integrados tanto em nós [LLM](../nodes/llm-node.md) como em nós [Agente](../nodes/agent-node.md), para que possa bloquear conteúdo inseguro antes de uma resposta do modelo chegar aos passos subsequentes.

- **Alternância de segurança ao nível do nó** – Ative os guardrails diretamente no nó que gera ou processa conteúdo destinado ao utilizador
- **Cobertura abrangente de políticas** – Bloqueie violência, discurso de ódio, conteúdo sexual, NSFW/linguagem obscena, assédio, atividade ilegal, pedidos de dados pessoais e tentativas de injeção de prompt
- **Deteção multilingue** – Aplique as mesmas regras de segurança em turco, inglês, árabe, espanhol e outros idiomas
- **Fallback nativo do workflow** – Quando uma mensagem é bloqueada, o nó lança um erro de workflow tipado que pode encaminhar através de um [Error Handler](../nodes/error-handler-node.md)

A política de segurança reside diretamente na configuração do LLM e do Agente e liga-se diretamente à ramificação e ao tratamento de erros do workflow.

### Acesso, Credenciais e Auditoria

Os agentes atuam com credenciais reais, pelo que o acesso faz parte da governação. As [Credenciais](../reference/credentials.md) são encriptadas em repouso, mascaradas após a criação e partilháveis com utilizadores ou [equipas](../reference/teams.md), e as equipas também partilham workflows, variáveis, armazenamentos vetoriais e ficheiros do Drive. O [início de sessão único](../reference/sso.md) liga qualquer fornecedor OpenID Connect, incluindo Okta, Entra ID, Keycloak, Auth0 e Google. O [registo de auditoria](../reference/audit.md) registra cada ação relevante para a segurança com o seu autor, alvo e resultado, transmitido com os registos do seu contentor para o coletor de registos ou SIEM que já utiliza.

### Auto-Alojado, os Seus Dados Pertencem-lhe

O Heym é executado na sua infraestrutura. Os workflows, credenciais, histórico de execuções e rastreios residem na sua própria base de dados, e as chamadas aos modelos partem dos seus servidores para o fornecedor que escolher, ou para um modelo que aloja através do Ollama ou vLLM. Para agentes que processam documentos sensíveis, dados de clientes ou bases de conhecimento proprietárias, isto é frequentemente um requisito obrigatório.

O Heym está licenciado sob a **Licença MIT com a condição Commons Clause**. O código-fonte está disponível: pode utilizá-lo, modificá-lo e auto-alojá-lo livremente. A Commons Clause restringe a venda do software, incluindo a oferta de alojamento pago ou serviços de consultoria/suporte cujo valor derive substancialmente do Heym. Para licenciamento comercial, implementações empresariais ou suporte profissional, contacte [enterprise@heym.run](mailto:enterprise@heym.run).

## Expor

### APIs e Streaming

Os workflows são invocáveis por HTTP em `/api/workflows/{workflow_id}/execute`, que devolve JSON, e em `/api/workflows/{workflow_id}/execute/stream`, que transmite eventos de nós como Server-Sent Events à medida que a execução avança. Ambos partilham autenticação ao nível do workflow, limitação de taxa e cache de respostas. Consulte [Webhooks](../reference/webhooks.md) e [SSE Streaming](../reference/sse-streaming.md).

### Integração MCP (Model Context Protocol)

O Heym tem suporte nativo de [MCP](../tabs/mcp-tab.md) em ambos os lados:

- **Como cliente**: Os nós de agente ligam-se a servidores MCP externos (Filesystem, Browserbase, ferramentas personalizadas) via stdio ou SSE e consomem as suas ferramentas automaticamente
- **Como servidor**: Os workflows com MCP ativado tornam-se ferramentas no servidor predefinido em `/api/mcp/sse`, ou em servidores nomeados com o seu próprio URL e chave de API, para que o Claude Desktop, o Cursor e outros clientes MCP possam chamar diretamente os seus workflows Heym

Os agentes podem consumir vários servidores MCP em simultâneo, e qualquer workflow pode tornar-se uma ferramenta para um cliente MCP externo.

### Portal: Publicar Workflows como Interfaces de Chat

A funcionalidade [Portal](../reference/portal.md) transforma qualquer workflow numa interface de chat pública em `/chat/{slug}`:

- Autenticação opcional com credenciais por utilizador
- Execução em streaming (progresso dos nós em tempo real)
- Suporte para carregamento de ficheiros
- Histórico de conversas com múltiplos turnos

As equipas lançam ferramentas internas, chatbots para clientes e formulários com IA a partir de um workflow e um URL, sem escrever código de frontend.

### Dashboards com Workflows

O [separador Dashboard](../tabs/dashboard-tab.md) é uma superfície de relatórios criada pelo utilizador onde cada widget de gráfico é alimentado pelo seu próprio workflow Heym oculto. Um widget pode chamar APIs, consultar o BigQuery, pesquisar armazenamentos vetoriais/RAG, executar passos LLM, transformar linhas e terminar com um [Nó de Saída de Gráfico](../nodes/chart-output-node.md). Pode criar widgets manualmente, gerá-los com IA, ajustá-los posteriormente, colocar os resultados em cache e reorganizar a grelha visualmente.

## Comparação com Ferramentas de Automação de Workflows

Muitas equipas chegam ao Heym provenientes de ferramentas de automação de workflows. A tabela abaixo compara o Heym com o n8n, o Zapier e o Make.com nas capacidades que importam quando os agentes entram em produção, e as notas de rodapé abaixo citam a documentação oficial que sustenta a comparação. Para uma análise mais aprofundada de cada ferramenta individualmente, consulte as páginas de comparação em [heym.run/compare](https://heym.run/compare).

| Capacidade | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Nó LLM integrado | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + ramificações de estado | ✓ | limitado¹¹ | –¹¹ | limitado¹¹ |
| Nó de agente integrado (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Orquestração multiagente | ✓ | ✓ | limitado | limitado |
| Nós de agente de programação (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| RAG / armazenamento vetorial integrado | ✓ | ✓ | limitado¹ | plugin² |
| Leitura / escrita WebSocket | ✓ | limitado¹² | –¹³ | –¹⁴ |
| Construtor de workflows em linguagem natural | ✓ | limitado³ | ✓ | ✓ |
| Analisador de Workflows | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Abrir uma execução em curso no canvas em tempo real | ✓ | limitado¹⁹ | limitado¹⁹ | –¹⁹ |
| Dashboards alimentados por workflows | ✓ | limitado¹⁷ | limitado¹⁷ | limitado¹⁷ |
| Quadro Kanban agêntico | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Sistema de Skills para agentes | ✓ | – | – | – |
| Unidade de ficheiros integrada (ligações de partilha, equipas) | ✓ | limitado²² | limitado²² | –²² |
| Nó de automação de navegador (Playwright) | ✓ | limitado²³ | limitado²³ | –²³ |
| Inspeção de rastreios LLM | ✓ | limitado⁴ | – | ✓ |
| Exportação de rastreios OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Acompanhamento de custos de tokens LLM (USD) | ✓ | –¹⁵ | –¹⁵ | limitado¹⁵ |
| Avaliações integradas para workflows de IA | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | limitado⁶ | limitado⁷ |
| Guardrails LLM | ✓ | ✓⁸ | ✓⁸ | limitado⁸ |
| Compressão automática de contexto | ✓ | – | – | – |
| Execução paralela de DAG | ✓ | limitado⁹ | – | – |
| Auto-alojável, código-fonte disponível | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| DSL de expressões para dados dinâmicos | ✓ | ✓ | limitado | ✓ |

> **Notas de rodapé:** ¹ Zapier Knowledge Sources — sem armazenamento vetorial exposto ou controlo de embeddings. ² Make.com tem módulos Pinecone/Qdrant, mas nenhum nó RAG nativo. ³ O n8n AI Workflow Builder é uma beta apenas na cloud, com limites de créditos. ⁴ O n8n mostra passos intermédios; o rastreio completo exige ferramentas de terceiros. ⁵ O n8n suporta aprovações de chamadas de ferramentas de IA através de chat, e-mail e canais de colaboração, mas não captura nem retoma a execução completa da forma que o Heym faz. ⁶ O Zapier Human in the Loop suporta aprovações e recolha de dados dentro de Zaps, mas não é um sistema de pontos de verificação com revisão pública e retoma por snapshot. ⁷ O Make.com oferece o Human in the Loop como uma aplicação Enterprise com pedidos de revisão e resultados ajustados/aprovados/cancelados, mas continua limitado por plano e menos nativo para agentes. ⁸ O n8n disponibiliza um nó Guardrails dedicado, o Zapier disponibiliza AI Guardrails nos seus produtos de IA e o Make.com documenta regras de agentes e fluxos de revisão, mas não uma funcionalidade de guardrails autónoma comparável, pelo que o Make é marcado como limitado. ⁹ O n8n executa sequencialmente por predefinição; o paralelismo exige soluções alternativas com sub-workflows. ¹⁰ Sustainable Use License — gratuito para auto-alojamento em uso interno, redistribuição comercial restrita. ¹¹ A partir de 22 de abril de 2026, a documentação oficial do n8n descreve batching HTTP e padrões de loop/wait em vez de um ramo nativo de estado de lote de LLM, a documentação oficial da aplicação ChatGPT do Zapier não lista triggers e apenas uma beta genérica de API Request, e a página oficial de integração OpenAI do Make expõe ações em lote como create/watch completed, mas não um nó LLM de primeira classe com ramificação por estado, pelo que o n8n e o Make são marcados como limitados e o Zapier é marcado como indisponível para este padrão de workflow específico. ¹² A documentação oficial do n8n abrange os nós HTTP Webhook e HTTP Request, bem como a extensibilidade Code/custom/community, mas não foi possível encontrar um nó de trigger/send WebSocket de primeira linha, pelo que o n8n é marcado como limitado. ¹³ A documentação oficial do Zapier abrange webhooks de entrada e pedidos de webhook/API de saída apenas sobre HTTP, não passos nativos de trigger ou envio WebSocket. ¹⁴ A documentação oficial do Make abrange módulos Webhooks e módulos de pedido HTTP(S), mas não foi possível encontrar um trigger ou módulo de envio WebSocket nativo. ¹⁵ O n8n não tem rastreio nativo do custo de tokens de LLM; existem workflows alternativos da comunidade, mas exigem instalação manual e chamadas à API pós-execução (pedido de funcionalidade em aberto a partir de maio de 2026). O Zapier não expõe aos utilizadores qualquer contagem de tokens por execução nem custo em USD; os passos de IA consomem apenas tarefas. O painel de créditos do Make.com reflete parcialmente o consumo de tokens para IA alojada no Make (desde agosto de 2025), mas as ligações com chaves de API de terceiros são faturadas como 1 operação = 1 crédito, sem contagem de tokens; não está disponível qualquer detalhe de custo em USD por execução e por modelo. ¹⁶ O Heym emite spans OpenTelemetry nativos (um por execução de workflow mais um por nó) sobre OTLP/HTTP para qualquer backend compatível, com propagação de contexto de rastreio W3C e sem código de instrumentação, configurado através de variáveis de ambiente `HEYM_OTEL_*` e desativado por predefinição. O n8n tem uma integração documentada de rastreio OpenTelemetry para execuções de workflow e de nó. O Zapier e o Make.com não documentam a exportação OpenTelemetry das execuções dos seus workflows/cenários a partir de junho de 2026. ¹⁷ O n8n documenta um painel Insights para métricas de execução em produção, o Zapier documenta o Zap History mais o Task Usage e o Make.com documenta o Scenario History; estas são superfícies de monitorização/histórico, não widgets de dashboard personalizados suportados por lógica de workflow arbitrária como o separador Dashboard do Heym. ¹⁸ O Heym Workflow Analyzer executa o workflow quando possível, lê o resultado da execução e gera um relatório Markdown partilhado e editável que abrange áreas de melhoria, propósito e comportamento passo a passo. O n8n documenta o AI Workflow Builder para criar/refinar/depurar workflows, o Zapier documenta a resolução de problemas com IA para execuções de Zap com erros e o Make.com documenta o histórico de cenários mais os passos de raciocínio do agente de IA, mas a sua documentação pública não descreve o mesmo documento de análise de workflow partilhado e ciente da execução. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) lista execuções em curso e pode carregar dados de uma execução anterior para o editor, enquanto [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) expõe um estado em execução no seu editor. O [Make Scenario History](https://help.make.com/scenario-history) documenta o detalhe da execução e os registos. A sua documentação pública, verificada a 18 de julho de 2026, não descreve o fluxo exato do Heym: abrir uma execução de produção arbitrária em curso a partir do Histórico ou de um cartão Kanban, restaurar o snapshot atual do nó e continuar a receber animação de nós e registos de Debug no mesmo canvas. ²⁰ Os nós [Codex](../nodes/codex-node.md) e [OpenCode Go](../nodes/opencode-go-node.md) do Heym executam uma CLI real de agente de programação num espaço de trabalho Heym isolado contra um repositório GitHub — clonar, editar, produzir um diff, fazer push de um ramo, abrir um pull request — como um passo de workflow de primeira classe. A partir de 20 de julho de 2026, nenhum concorrente documenta um equivalente: o [nó OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) do n8n abrange chamadas à API de chat/assistant, não um agente de programação ao nível do repositório, e o suporte nativo ao Codex continua a ser um pedido da comunidade; o próprio blogue do Zapier documenta a direção inversa — [Codex a conduzir ferramentas do Zapier através do Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — não o Codex como passo de um Zap; os módulos OpenAI do Make.com expõem completions/assistants/ações em lote, não um agente de programação que clona repositórios e abre PRs. ²¹ O [separador Board](../tabs/board-tab.md) do Heym é um quadro Kanban agêntico incorporado cujas colunas executam workflows e cujos cartões transportam contexto, histórico de conversação, estado de execução e execuções. O n8n ([integração Kanban Tool](https://n8n.io/integrations/kanban-tool/)), o Zapier ([integrações Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) e o Make.com ([integração Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) apenas se ligam a aplicações kanban de terceiros, como Kanban Tool, Wekan ou NocoDB; nenhum documenta um quadro incorporado que execute os seus próprios workflows, a partir de 20 de julho de 2026. ²² O n8n armazena dados binários de execução internamente (opcionalmente em [armazenamento externo compatível com S3](https://docs.n8n.io/hosting/scaling/external-storage/)), mas não documenta qualquer unidade de ficheiros voltada para o utilizador com ligações de partilha ou partilha em equipa, pelo que é marcado como limitado. O [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) processa ficheiros apenas durante a execução de um Zap e o [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) guarda pequenos valores de texto, pelo que o Zapier é marcado como limitado. Os [data stores](https://help.make.com/l6du-data-stores) do Make.com guardam registos estruturados e o seu [tratamento de ficheiros](https://help.make.com/working-with-files) passa ficheiros entre aplicações sem armazenamento incorporado persistente, pelo que o Make é marcado como indisponível. ²³ O [nó Playwright](../nodes/playwright-node.md) do Heym é automação de browser de primeira linha com um modo visual de passos, passos gerados por IA e um modo de código completo. O n8n oferece apenas pacotes da comunidade como [n8n-playwright](https://github.com/toema/n8n-playwright) com um [pedido de funcionalidade ainda em aberto para nós nativos de automação de browser](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), pelo que é marcado como limitado. Os Zapier Agents podem [navegar e ler páginas através de navegação web e de uma extensão Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), mas o Zapier não documenta qualquer passo de automação de browser com scripts, pelo que é marcado como limitado. O Make.com documenta módulos HTTP e aplicações de scraping de terceiros em vez de qualquer módulo nativo de automação de browser, a partir de 20 de julho de 2026.

## Relacionado

- [Introdução](./introduction.md) – Visão geral da plataforma
- [Início Rápido](./quick-start.md) – Crie o seu primeiro workflow
- [Análise de Workflows](../reference/workflow-analysis.md) – Gere relatórios partilhados de workflows com reconhecimento de execuções e feedback de melhoria
- [Separador Dashboard](../tabs/dashboard-tab.md) – Crie dashboards suportados por workflows com widgets de gráficos gerados por IA
- [Nó de Agente](../nodes/agent-node.md) – Nó LLM com chamada de ferramentas, MCP e competências
- [Arquitetura de Agentes](../reference/agent-architecture.md) – Subagentes, orquestrador e despacho de ferramentas
- [Separador Board](../tabs/board-tab.md) – Quadro Kanban agêntico com colunas que executam workflows
- [Nó Codex](../nodes/codex-node.md) – Execute o agente de programação OpenAI Codex num repositório GitHub
- [Nó OpenCode Go](../nodes/opencode-go-node.md) – Agente de programação agnóstico de fornecedor num contentor reforçado
- [Separador Drive](../tabs/drive-tab.md) – Armazenamento de ficheiros integrado com ligações de partilha, equipas e ações em massa
- [Nó Playwright](../nodes/playwright-node.md) – Automação de navegador própria com passos de IA e modo de código
- [Nó RAG / Vector Store](../nodes/rag-node.md) – Pesquisa vetorial e inserção de documentos (Qdrant ou Postgres pgvector)
- [Assistente de IA](../reference/ai-assistant.md) – Construtor de workflows em linguagem natural
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Pontos de verificação de agentes com URLs de revisão públicas
- [Guardrails](../reference/guardrails.md) – Bloqueie prompts inseguros antes de chegarem aos seus modelos
- [Separador Rastreios](../tabs/traces-tab.md) – Observabilidade de chamadas LLM
- [Separador Avaliações](../tabs/evals-tab.md) – Conjuntos de testes para workflows de IA
- [Separador Alertas](../tabs/alerts-tab.md) – Alertas de limiar sobre erros, duração, custo e volume de execuções
- [Rastreio OpenTelemetry](../reference/opentelemetry.md) – Exporte spans de execuções, nós e ferramentas através de OTLP
- [Distribuição de Carga](../reference/cluster.md) – Partilhe execuções entre instâncias com failover de líder
- [Início de Sessão Único](../reference/sso.md) – Inicie sessão através de qualquer fornecedor OpenID Connect
- [Registo de Auditoria](../reference/audit.md) – Ações relevantes para a segurança com autor, alvo e resultado
- [Portal](../reference/portal.md) – Publique workflows como interfaces de chat públicas
- [Execução Paralela](../reference/parallel-execution.md) – Execução concorrente baseada em DAG
- [Separador MCP](../tabs/mcp-tab.md) – Configuração de servidor e cliente MCP
