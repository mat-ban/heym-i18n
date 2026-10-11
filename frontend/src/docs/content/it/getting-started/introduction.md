# Introduzione

**Creare sistemi agentici. Eseguirli con sicurezza.**

Heym è l'infrastruttura per eseguire e governare agenti IA in produzione. Orchestrare agenti, automatizzare processi aziendali, ispezionare ogni esecuzione e mantenere il controllo umano. Distribuire Heym sulla propria infrastruttura.

In Heym, un workflow definisce come agenti, passaggi deterministici, strumenti e dati collaborano tra loro. Il runtime esegue quel grafo, registra ogni esecuzione e si mette in pausa per la revisione umana nei punti in cui viene richiesto. Il canvas visuale è il luogo in cui si costruiscono e si ispezionano i workflow, e gli stessi workflow possono essere eseguiti anche da API, pianificazioni, trigger di eventi, client MCP e chat del Portale. Visitare [heym.run](https://heym.run) per il sito del prodotto e consultare [Perché Heym](./why-heym.md) per scoprire cosa gestisce Heym in ogni fase del ciclo di vita degli agenti.

## Cosa è possibile fare

- **Creare** – Comporre agenti e passaggi deterministici sul [canvas](../reference/canvas-features.md) nella scheda [Workflows](../tabs/workflows-tab.md), descriverli all'[Assistente IA](../reference/ai-assistant.md) oppure partire dai [Modelli](../tabs/templates-tab.md)
- **Orchestrare** – Coordinare i nodi [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) e [RAG](../nodes/rag-node.md), [sub-agenti](../reference/agent-architecture.md), strumenti MCP e [integrazioni](../reference/integrations.md) come HTTP, Slack ed email, con [esecuzione parallela](../reference/parallel-execution.md) dove le dipendenze lo consentono
- **Eseguire** – Avviare workflow da [webhook](../reference/webhooks.md), pianificazioni [Cron](../nodes/cron-node.md) e [trigger](../reference/triggers.md) di eventi, con retry per nodo, [gestione degli errori](../nodes/error-handler-node.md) e [distribuzione del carico](../reference/cluster.md) tra le istanze
- **Osservare** – Ispezionare la [cronologia delle esecuzioni](../reference/execution-history.md), le [tracce LLM](../tabs/traces-tab.md) con i costi in token, le [analytics](../tabs/analytics-tab.md) e gli [avvisi](../tabs/alerts-tab.md), ed esportare le tracce [OpenTelemetry](../reference/opentelemetry.md)
- **Valutare** – Testare prompt e modelli rispetto agli output attesi nella scheda [Valutazioni](../tabs/evals-tab.md)
- **Controllare** – Mettere in pausa gli agenti per la [revisione umana](../reference/human-in-the-loop.md), bloccare contenuti non sicuri con i [guardrail](../reference/guardrails.md) e gestire gli accessi con [credenziali](../tabs/credentials-tab.md), [team](../reference/teams.md), [single sign-on](../reference/sso.md) e una [traccia di audit](../reference/audit.md)
- **Esporre** – Servire i workflow tramite REST e [streaming SSE](../reference/sse-streaming.md), come strumenti [MCP](../tabs/mcp-tab.md) e come interfacce di chat del [Portale](../reference/portal.md) per gli utenti finali; utilizzare la scheda [Chat](../tabs/chat-tab.md) per testare i modelli direttamente
- **Chattare con Heym** – Porre domande sul prodotto con riconoscimento della pagina dalla finestra di dialogo [Chat with Heym](../reference/chat-with-heym.md) nella documentazione

## Concetti chiave

- **Workflows** – Un grafo orientato di nodi e archi. Gestirli nella scheda [Workflows](../tabs/workflows-tab.md). Consultare [Struttura del Workflow](../reference/workflow-structure.md).
- **Nodi** – Unità di elaborazione ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), ecc.). Consultare [Tipi di Nodo](../reference/node-types.md).
- **Archi** – Connessioni che definiscono il flusso di esecuzione
- **Credenziali** – Chiavi API e segreti memorizzati nella scheda [Credenziali](../tabs/credentials-tab.md), referenziati dai nodi.
- **Variabili** – Dati chiave-valore persistenti nella scheda [Variabili](../tabs/global-variables-tab.md), accessibili tramite `$global.variableName`. Consultare [Variabili Globali](../reference/global-variables.md).
- **Espressioni** – Riferirsi ai dati a monte con `$input` e `$nodeName.field`. Consultare [Expression DSL](../reference/expression-dsl.md).

## Correlati

- [Perché Heym](./why-heym.md) – Cosa gestisce Heym in ogni fase del ciclo di vita degli agenti
- [Avvio rapido](./quick-start.md) – Creare il primo workflow
- [Esecuzione e distribuzione](./running-and-deployment.md) – Avviare localmente con `run.sh` oppure distribuire con `deploy.sh`
- [Assistente IA](../reference/ai-assistant.md) – Creare workflow con il linguaggio naturale
- [Chat with Heym](../reference/chat-with-heym.md) – Porre domande di approfondimento durante la lettura della documentazione
- [Concetti fondamentali](./core-concepts.md) – Workflow, nodi e flusso di esecuzione
- [Scheda Workflows](../tabs/workflows-tab.md) – Gestire workflow e cartelle
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere chiavi API per i nodi
