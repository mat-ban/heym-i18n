# Introdução

**Construa sistemas agênticos. Execute-os com confiança.**

Heym é a infraestrutura para executar e governar agentes de IA em produção. Orquestre agentes, automatize processos de negócio, inspecione cada execução e mantenha os humanos no controle. Implante o Heym na sua própria infraestrutura.

No Heym, um workflow define como agentes, etapas determinísticas, ferramentas e dados trabalham em conjunto. O runtime executa esse grafo, registra cada execução e pausa para revisão humana onde você solicitar. O canvas visual é onde você constrói e inspeciona workflows, e os mesmos workflows também são executados a partir de APIs, agendamentos, triggers de eventos, clientes MCP e chats do Portal. Visite [heym.run](https://heym.run) para o site do produto e consulte [Por que Heym](./why-heym.md) para saber o que o Heym gerencia em cada estágio do ciclo de vida do agente.

## O Que Você Pode Fazer

- **Construir** – Componha agentes e etapas determinísticas no [canvas](../reference/canvas-features.md) na aba [Workflows](../tabs/workflows-tab.md), descreva-os para o [AI Assistant](../reference/ai-assistant.md) ou comece a partir de [Templates](../tabs/templates-tab.md)
- **Orquestrar** – Coordene nós [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) e [RAG](../nodes/rag-node.md), [sub-agentes](../reference/agent-architecture.md), ferramentas MCP e [integrações](../reference/integrations.md) como HTTP, Slack e email, com [execução paralela](../reference/parallel-execution.md) onde as dependências permitirem
- **Executar** – Inicie workflows a partir de [webhooks](../reference/webhooks.md), agendamentos [Cron](../nodes/cron-node.md) e [triggers](../reference/triggers.md) de eventos, com retentativas por nó, [tratamento de erros](../nodes/error-handler-node.md) e [distribuição de carga](../reference/cluster.md) entre instâncias
- **Observar** – Inspecione o [histórico de execução](../reference/execution-history.md), [traces de LLM](../tabs/traces-tab.md) com custos de token, [analytics](../tabs/analytics-tab.md) e [alertas](../tabs/alerts-tab.md), e exporte traces [OpenTelemetry](../reference/opentelemetry.md)
- **Avaliar** – Teste prompts e modelos em relação a saídas esperadas na aba [Evals](../tabs/evals-tab.md)
- **Controlar** – Pause agentes para [revisão humana](../reference/human-in-the-loop.md), bloqueie conteúdo inseguro com [guardrails](../reference/guardrails.md) e gerencie o acesso com [credenciais](../tabs/credentials-tab.md), [equipes](../reference/teams.md), [single sign-on](../reference/sso.md) e uma [trilha de auditoria](../reference/audit.md)
- **Expor** – Disponibilize workflows via REST e [streaming SSE](../reference/sse-streaming.md), como ferramentas [MCP](../tabs/mcp-tab.md) e como interfaces de chat do [Portal](../reference/portal.md) para usuários finais; use a aba [Chat](../tabs/chat-tab.md) para testar modelos diretamente
- **Converse com o Heym** – Faça perguntas sobre o produto com reconhecimento de página a partir do diálogo [Chat with Heym](../reference/chat-with-heym.md) na documentação

## Conceitos-Chave

- **Workflows** – Um grafo direcionado de nós e arestas. Gerencie-os na aba [Workflows](../tabs/workflows-tab.md). Consulte [Estrutura de Workflow](../reference/workflow-structure.md).
- **Nós** – Unidades de processamento ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), etc.). Consulte [Tipos de Nó](../reference/node-types.md).
- **Arestas** – Conexões que definem o fluxo de execução
- **Credenciais** – Chaves de API e segredos armazenados na aba [Credentials](../tabs/credentials-tab.md), referenciados pelos nós.
- **Variáveis** – Dados persistentes de chave-valor na aba [Variables](../tabs/global-variables-tab.md), acessíveis via `$global.variableName`. Consulte [Variáveis Globais](../reference/global-variables.md).
- **Expressões** – Referencie dados upstream com `$input` e `$nodeName.field`. Consulte [Expression DSL](../reference/expression-dsl.md).

## Relacionados

- [Por que Heym](./why-heym.md) – O que o Heym gerencia em cada estágio do ciclo de vida do agente
- [Início Rápido](./quick-start.md) – Construa seu primeiro workflow
- [Execução e Implantação](./running-and-deployment.md) – Inicie localmente com `run.sh` ou implante com `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Crie workflows com linguagem natural
- [Chat with Heym](../reference/chat-with-heym.md) – Faça perguntas de acompanhamento enquanto lê a documentação
- [Conceitos Fundamentais](./core-concepts.md) – Workflows, nós e fluxo de execução
- [Aba Workflows](../tabs/workflows-tab.md) – Gerencie workflows e pastas
- [Aba Credentials](../tabs/credentials-tab.md) – Adicione chaves de API para os nós
