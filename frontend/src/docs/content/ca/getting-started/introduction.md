# Introducció

**Construïu sistemes agèntics. Executeu-los amb confiança.**

Heym és la infraestructura per executar i governar agents d'IA en producció. Orquestreu agents, automatitzeu processos de negoci, inspeccioneu cada execució i manteniu les persones en control. Desplegueu Heym a la vostra pròpia infraestructura.

A Heym, un workflow defineix com els agents, els passos deterministes, les eines i les dades treballen junts. El runtime executa aquest graf, enregistra cada execució i es pausa per a la revisió humana allà on ho indiqueu. El canvas visual és on construïu i inspeccioneu workflows, i els mateixos workflows també s'executen des d'APIs, planificacions, triggers d'esdeveniments, clients MCP i xats de Portal. Visiteu [heym.run](https://heym.run) per al lloc del producte, i consulteu [Per què Heym](./why-heym.md) per saber què gestiona Heym a cada etapa del cicle de vida de l'agent.

## Què podeu fer

- **Construir** – Composeu agents i passos deterministes al [canvas](../reference/canvas-features.md) de la pestanya [Workflows](../tabs/workflows-tab.md), descriviu-los a l'[Assistent d'IA](../reference/ai-assistant.md) o comenceu des de [Plantilles](../tabs/templates-tab.md)
- **Orquestrar** – Coordineu nodes [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) i [RAG](../nodes/rag-node.md), [sub-agents](../reference/agent-architecture.md), eines MCP i [integracions](../reference/integrations.md) com HTTP, Slack i correu electrònic, amb [execució en paral·lel](../reference/parallel-execution.md) allà on les dependències ho permetin
- **Executar** – Inicieu workflows des de [webhooks](../reference/webhooks.md), planificacions [Cron](../nodes/cron-node.md) i [triggers](../reference/triggers.md) d'esdeveniments, amb reintents per node, [gestió d'errors](../nodes/error-handler-node.md) i [distribució de càrrega](../reference/cluster.md) entre instàncies
- **Observar** – Inspeccioneu l'[historial d'execucions](../reference/execution-history.md), les [traces d'LLM](../tabs/traces-tab.md) amb costos de tokens, les [analítiques](../tabs/analytics-tab.md) i les [alertes](../tabs/alerts-tab.md), i exporteu traces d'[OpenTelemetry](../reference/opentelemetry.md)
- **Avaluar** – Proveu prompts i models contra sortides esperades a la pestanya [Evals](../tabs/evals-tab.md)
- **Controlar** – Pauseu agents per a la [revisió humana](../reference/human-in-the-loop.md), bloquegeu contingut insegur amb [guardrails](../reference/guardrails.md) i gestioneu l'accés amb [credencials](../tabs/credentials-tab.md), [equips](../reference/teams.md), [inici de sessió únic](../reference/sso.md) i una [traça d'auditoria](../reference/audit.md)
- **Exposar** – Serviu workflows per REST i [streaming SSE](../reference/sse-streaming.md), com a eines [MCP](../tabs/mcp-tab.md) i com a interfícies de xat de [Portal](../reference/portal.md) per als usuaris finals; utilitzeu la pestanya [Chat](../tabs/chat-tab.md) per provar models directament
- **Xatejar amb Heym** – Feu preguntes sobre el producte amb coneixement de la pàgina des del diàleg [Xateja amb Heym](../reference/chat-with-heym.md) a la documentació

## Conceptes clau

- **Workflows** – Un graf dirigit de nodes i arestes. Gestioneu-los a la pestanya [Workflows](../tabs/workflows-tab.md). Vegeu [Estructura del workflow](../reference/workflow-structure.md).
- **Nodes** – Unitats de processament ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), etc.). Vegeu [Tipus de nodes](../reference/node-types.md).
- **Arestes** – Connexions que defineixen el flux d'execució
- **Credencials** – Claus d'API i secrets emmagatzemats a la pestanya [Credencials](../tabs/credentials-tab.md), referenciats pels nodes.
- **Variables** – Dades persistents de clau-valor a la pestanya [Variables](../tabs/global-variables-tab.md), accessibles mitjançant `$global.variableName`. Vegeu [Variables globals](../reference/global-variables.md).
- **Expressions** – Referencieu dades d'origen amb `$input` i `$nodeName.field`. Vegeu [DSL d'expressions](../reference/expression-dsl.md).

## Relacionat

- [Per què Heym](./why-heym.md) – Què gestiona Heym a cada etapa del cicle de vida de l'agent
- [Inici ràpid](./quick-start.md) – Construïu el vostre primer workflow
- [Execució i desplegament](./running-and-deployment.md) – Comenceu localment amb `run.sh` o desplegueu amb `deploy.sh`
- [Assistent d'IA](../reference/ai-assistant.md) – Creeu workflows amb llenguatge natural
- [Xateja amb Heym](../reference/chat-with-heym.md) – Feu preguntes de seguiment mentre llegiu la documentació
- [Conceptes bàsics](./core-concepts.md) – Workflows, nodes i flux d'execució
- [Pestanya Workflows](../tabs/workflows-tab.md) – Gestioneu workflows i carpetes
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegiu claus d'API per als nodes
