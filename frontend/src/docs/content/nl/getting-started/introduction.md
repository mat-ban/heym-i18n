# Introductie

**Bouw agentische systemen. Voer ze met vertrouwen uit.**

Heym is infrastructuur voor het uitvoeren en beheren van AI-agenten in productie. Orkestreer agenten, automatiseer bedrijfsprocessen, inspecteer elke uitvoering en houd mensen in controle. Implementeer Heym op uw eigen infrastructuur.

In Heym definieert een workflow hoe agenten, deterministische stappen, tools en gegevens samenwerken. De runtime voert die grafiek uit, registreert elke uitvoering en pauzeert voor menselijke beoordeling waar u dat aangeeft. Het visuele canvas is waar u workflows bouwt en inspecteert, en dezelfde workflows worden ook uitgevoerd vanuit API's, schema's, event-triggers, MCP-clients en Portal-chats. Bezoek [heym.run](https://heym.run) voor de productwebsite en zie [Waarom Heym](./why-heym.md) voor wat Heym behandelt in elke fase van de agent-levenscyclus.

## Wat u kunt doen

- **Bouwen** – Stel agenten en deterministische stappen samen op het [canvas](../reference/canvas-features.md) in het tabblad [Workflows](../tabs/workflows-tab.md), beschrijf ze aan de [AI Assistant](../reference/ai-assistant.md) of begin vanuit [Sjablonen](../tabs/templates-tab.md)
- **Orkestreren** – Coördineer [Agent](../nodes/agent-node.md)-, [LLM](../nodes/llm-node.md)- en [RAG](../nodes/rag-node.md)-knooppunten, [sub-agenten](../reference/agent-architecture.md), MCP-tools en [integraties](../reference/integrations.md) zoals HTTP, Slack en e-mail, met [parallelle uitvoering](../reference/parallel-execution.md) waar afhankelijkheden dit toelaten
- **Uitvoeren** – Start workflows vanuit [webhooks](../reference/webhooks.md), [Cron](../nodes/cron-node.md)-schema's en event-[triggers](../reference/triggers.md), met herhaalpogingen per knooppunt, [foutafhandeling](../nodes/error-handler-node.md) en [belastingsverdeling](../reference/cluster.md) over instanties
- **Observeren** – Inspecteer [uitvoeringsgeschiedenis](../reference/execution-history.md), [LLM-traces](../tabs/traces-tab.md) met tokenkosten, [analytics](../tabs/analytics-tab.md) en [waarschuwingen](../tabs/alerts-tab.md), en exporteer [OpenTelemetry](../reference/opentelemetry.md)-traces
- **Evalueren** – Test prompts en modellen tegen verwachte uitvoer in het tabblad [Evaluaties](../tabs/evals-tab.md)
- **Beheren** – Pauzeer agenten voor [menselijke beoordeling](../reference/human-in-the-loop.md), blokkeer onveilige inhoud met [guardrails](../reference/guardrails.md) en beheer toegang met [inloggegevens](../tabs/credentials-tab.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md) en een [audittrail](../reference/audit.md)
- **Beschikbaar stellen** – Serveer workflows via REST en [SSE-streaming](../reference/sse-streaming.md), als [MCP](../tabs/mcp-tab.md)-tools en als [Portal](../reference/portal.md)-chatinterfaces voor eindgebruikers; gebruik het tabblad [Chat](../tabs/chat-tab.md) om modellen rechtstreeks te testen
- **Chatten met Heym** – Stel paginabewuste productvragen vanuit het dialoogvenster [Chatten met Heym](../reference/chat-with-heym.md) in de documentatie

## Kernconcepten

- **Workflows** – Een gerichte grafiek van knooppunten en edges. Beheer ze in het tabblad [Workflows](../tabs/workflows-tab.md). Zie [Workflowstructuur](../reference/workflow-structure.md).
- **Knooppunten** – Verwerkingseenheden ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), enz.). Zie [Knooppunttypen](../reference/node-types.md).
- **Edges** – Verbindingen die de uitvoeringsstroom definiëren
- **Inloggegevens** – API-sleutels en secrets opgeslagen in het tabblad [Inloggegevens](../tabs/credentials-tab.md), waarnaar knooppunten verwijzen.
- **Variabelen** – Persistente key-value-gegevens in het tabblad [Variabelen](../tabs/global-variables-tab.md), toegankelijk via `$global.variableName`. Zie [Globale variabelen](../reference/global-variables.md).
- **Expressies** – Verwijs naar gegevens van bovenliggende knooppunten met `$input` en `$nodeName.field`. Zie [Expression DSL](../reference/expression-dsl.md).

## Gerelateerd

- [Waarom Heym](./why-heym.md) – Wat Heym behandelt in elke fase van de agent-levenscyclus
- [Snelstart](./quick-start.md) – Bouw uw eerste workflow
- [Uitvoeren en implementeren](./running-and-deployment.md) – Start lokaal met `run.sh` of implementeer met `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Maak workflows met natuurlijke taal
- [Chatten met Heym](../reference/chat-with-heym.md) – Stel vervolgvragen tijdens het lezen van de documentatie
- [Kernconcepten](./core-concepts.md) – Workflows, knooppunten en uitvoeringsstroom
- [Tabblad Workflows](../tabs/workflows-tab.md) – Beheer workflows en mappen
- [Tabblad Inloggegevens](../tabs/credentials-tab.md) – Voeg API-sleutels toe voor knooppunten
