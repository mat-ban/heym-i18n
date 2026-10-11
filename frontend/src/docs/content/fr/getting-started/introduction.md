# Introduction

**Build agentic systems. Run them with confidence.**

Heym est une infrastructure permettant d'exécuter et de gouverner des agents IA en production. Orchestrez des agents, automatisez des processus métier, inspectez chaque exécution et gardez le contrôle humain. Déployez Heym sur votre propre infrastructure.

Dans Heym, un workflow définit la manière dont les agents, les étapes déterministes, les outils et les données interagissent. Le runtime exécute ce graphe, enregistre chaque exécution et s'interrompt pour une revue humaine là où vous le demandez. Le canvas visuel est l'endroit où vous construisez et inspectez les workflows, et ces mêmes workflows s'exécutent également depuis des API, des planifications, des triggers d'événements, des clients MCP et des chats Portal. Consultez [heym.run](https://heym.run) pour le site produit, et reportez-vous à [Why Heym](./why-heym.md) pour découvrir ce que Heym prend en charge à chaque étape du cycle de vie des agents.

## Ce que vous pouvez faire

- **Construire** – Composez des agents et des étapes déterministes sur le [canvas](../reference/canvas-features.md) dans l'onglet [Workflows](../tabs/workflows-tab.md), décrivez-les à l'[AI Assistant](../reference/ai-assistant.md), ou partez de [Templates](../tabs/templates-tab.md)
- **Orchestrer** – Coordonnez les nœuds [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) et [RAG](../nodes/rag-node.md), les [sub-agents](../reference/agent-architecture.md), les outils MCP et les [intégrations](../reference/integrations.md) telles que HTTP, Slack et l'e-mail, avec [parallel execution](../reference/parallel-execution.md) lorsque les dépendances le permettent
- **Exécuter** – Lancez des workflows depuis des [webhooks](../reference/webhooks.md), des planifications [Cron](../nodes/cron-node.md) et des [triggers](../reference/triggers.md) d'événements, avec des retries par nœud, la [gestion des erreurs](../nodes/error-handler-node.md) et la [répartition de charge](../reference/cluster.md) entre les instances
- **Observer** – Inspectez l'[historique des exécutions](../reference/execution-history.md), les [traces LLM](../tabs/traces-tab.md) avec les coûts en tokens, les [analytics](../tabs/analytics-tab.md) et les [alertes](../tabs/alerts-tab.md), et exportez les traces [OpenTelemetry](../reference/opentelemetry.md)
- **Évaluer** – Testez les prompts et les modèles par rapport aux sorties attendues dans l'onglet [Evals](../tabs/evals-tab.md)
- **Contrôler** – Mettez les agents en pause pour une [revue humaine](../reference/human-in-the-loop.md), bloquez les contenus dangereux avec les [guardrails](../reference/guardrails.md), et gérez les accès avec les [identifiants](../tabs/credentials-tab.md), les [équipes](../reference/teams.md), le [single sign-on](../reference/sso.md) et une [piste d'audit](../reference/audit.md)
- **Exposer** – Servez les workflows via REST et le [streaming SSE](../reference/sse-streaming.md), en tant qu'outils [MCP](../tabs/mcp-tab.md) et en tant qu'interfaces de chat [Portal](../reference/portal.md) pour les utilisateurs finaux ; utilisez l'onglet [Chat](../tabs/chat-tab.md) pour tester les modèles directement
- **Discuter avec Heym** – Posez des questions produit contextuelles à la page depuis la boîte de dialogue [Chat with Heym](../reference/chat-with-heym.md) dans la documentation

## Concepts clés

- **Workflows** – Un graphe orienté de nœuds et d'arêtes. Gérez-les dans l'onglet [Workflows](../tabs/workflows-tab.md). Voir [Workflow Structure](../reference/workflow-structure.md).
- **Nœuds** – Unités de traitement ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), etc.). Voir [Node Types](../reference/node-types.md).
- **Arêtes** – Connexions qui définissent le flux d'exécution
- **Identifiants** – Clés API et secrets stockés dans l'onglet [Credentials](../tabs/credentials-tab.md), référencés par les nœuds.
- **Variables** – Données clé-valeur persistantes dans l'onglet [Variables](../tabs/global-variables-tab.md), accessibles via `$global.variableName`. Voir [Global Variables](../reference/global-variables.md).
- **Expressions** – Référencez les données en amont avec `$input` et `$nodeName.field`. Voir [Expression DSL](../reference/expression-dsl.md).

## Pour aller plus loin

- [Why Heym](./why-heym.md) – Ce que Heym prend en charge à chaque étape du cycle de vie des agents
- [Quick Start](./quick-start.md) – Construisez votre premier workflow
- [Running & Deployment](./running-and-deployment.md) – Démarrez localement avec `run.sh` ou déployez avec `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Créez des workflows en langage naturel
- [Chat with Heym](../reference/chat-with-heym.md) – Posez des questions complémentaires pendant la lecture de la documentation
- [Core Concepts](./core-concepts.md) – Workflows, nœuds et flux d'exécution
- [Workflows Tab](../tabs/workflows-tab.md) – Gérez les workflows et les dossiers
- [Credentials Tab](../tabs/credentials-tab.md) – Ajoutez des clés API pour les nœuds
