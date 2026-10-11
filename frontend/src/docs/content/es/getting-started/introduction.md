# Introducción

**Construya sistemas agénticos. Ejecútelos con confianza.**

Heym es infraestructura para ejecutar y gobernar agentes de IA en producción. Orqueste agentes, automatice procesos de negocio, inspeccione cada ejecución y mantenga a las personas en control. Despliegue Heym en su propia infraestructura.

En Heym, un workflow define cómo los agentes, los pasos deterministas, las herramientas y los datos trabajan en conjunto. El runtime ejecuta ese grafo, registra cada ejecución y se detiene para revisión humana donde usted lo indique. El canvas visual es donde se construyen e inspeccionan los workflows, y esos mismos workflows también se ejecutan desde APIs, programaciones, triggers de eventos, clientes MCP y chats de Portal. Visite [heym.run](https://heym.run) para el sitio del producto, y consulte [Por qué Heym](./why-heym.md) para conocer qué gestiona Heym en cada etapa del ciclo de vida del agente.

## Qué puede hacer

- **Construir** – Componga agentes y pasos deterministas en el [canvas](../reference/canvas-features.md) dentro de la pestaña [Workflows](../tabs/workflows-tab.md), descríbalos al [AI Assistant](../reference/ai-assistant.md) o comience desde las [Plantillas](../tabs/templates-tab.md)
- **Orquestar** – Coordine nodos [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) y [RAG](../nodes/rag-node.md), [sub-agentes](../reference/agent-architecture.md), herramientas MCP e [integraciones](../reference/integrations.md) como HTTP, Slack y correo electrónico, con [ejecución en paralelo](../reference/parallel-execution.md) donde las dependencias lo permitan
- **Ejecutar** – Inicie workflows desde [webhooks](../reference/webhooks.md), programaciones [Cron](../nodes/cron-node.md) y [triggers](../reference/triggers.md) de eventos, con reintentos por nodo, [manejo de errores](../nodes/error-handler-node.md) y [distribución de carga](../reference/cluster.md) entre instancias
- **Observar** – Inspeccione el [historial de ejecuciones](../reference/execution-history.md), las [trazas de LLM](../tabs/traces-tab.md) con costos de tokens, la [analítica](../tabs/analytics-tab.md) y las [alertas](../tabs/alerts-tab.md), y exporte trazas de [OpenTelemetry](../reference/opentelemetry.md)
- **Evaluar** – Pruebe prompts y modelos contra salidas esperadas en la pestaña [Evaluaciones](../tabs/evals-tab.md)
- **Controlar** – Pause agentes para [revisión humana](../reference/human-in-the-loop.md), bloquee contenido inseguro con [guardrails](../reference/guardrails.md) y gestione el acceso con [credenciales](../tabs/credentials-tab.md), [equipos](../reference/teams.md), [inicio de sesión único](../reference/sso.md) y una [pista de auditoría](../reference/audit.md)
- **Exponer** – Sirva workflows mediante REST y [streaming SSE](../reference/sse-streaming.md), como herramientas [MCP](../tabs/mcp-tab.md) y como interfaces de chat de [Portal](../reference/portal.md) para usuarios finales; use la pestaña [Chat](../tabs/chat-tab.md) para probar modelos directamente
- **Chatear con Heym** – Formule preguntas sobre el producto con reconocimiento de la página desde el diálogo [Chat with Heym](../reference/chat-with-heym.md) en la documentación

## Conceptos clave

- **Workflows** – Un grafo dirigido de nodos y aristas. Gestiónelos en la pestaña [Workflows](../tabs/workflows-tab.md). Consulte [Estructura de un workflow](../reference/workflow-structure.md).
- **Nodos** – Unidades de procesamiento ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), etc.). Consulte [Tipos de nodo](../reference/node-types.md).
- **Aristas** – Conexiones que definen el flujo de ejecución
- **Credenciales** – Claves de API y secretos almacenados en la pestaña [Credenciales](../tabs/credentials-tab.md), referenciados por los nodos.
- **Variables** – Datos persistentes de clave-valor en la pestaña [Variables](../tabs/global-variables-tab.md), accesibles mediante `$global.variableName`. Consulte [Variables globales](../reference/global-variables.md).
- **Expresiones** – Referencie datos anteriores con `$input` y `$nodeName.field`. Consulte [DSL de expresiones](../reference/expression-dsl.md).

## Relacionado

- [Por qué Heym](./why-heym.md) – Qué gestiona Heym en cada etapa del ciclo de vida del agente
- [Inicio rápido](./quick-start.md) – Construya su primer workflow
- [Ejecución y despliegue](./running-and-deployment.md) – Inicie localmente con `run.sh` o despliegue con `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Cree workflows con lenguaje natural
- [Chat with Heym](../reference/chat-with-heym.md) – Formule preguntas de seguimiento mientras lee la documentación
- [Conceptos fundamentales](./core-concepts.md) – Workflows, nodos y flujo de ejecución
- [Pestaña Workflows](../tabs/workflows-tab.md) – Gestione workflows y carpetas
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añada claves de API para los nodos
