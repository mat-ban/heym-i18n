# Enterprise

Commerciële licenties, professionele ondersteuning en deployment-diensten voor het Heym-platform.

## Overzicht

Heym is gratis te gebruiken en zelf te hosten onder de source-available licentie. Voor organisaties die commerciële licenties, productieklare deployment-ondersteuning of toegewijde ondersteuning nodig hebben, biedt het Enterprise-plan hands-on diensten van het Heym-team.

| Dienst | Beschrijving |
|---------|-------------|
| **Productie Agent-ondersteuning** | Architectuurbeoordelingen, begeleiding bij agent- en workflow-ontwerp, en hands-on hulp bij het naar productie brengen van agents |
| **Tool Training** | Onboardingssessies en training voor uw team over de workflow-editor, AI-nodes, agents en integraties |
| **Heym Q&A** | Directe toegang tot het Heym-engineeringteam voor platformvragen, best practices en probleemoplossing |
| **Kubernetes Deployment** | Ondersteuning bij multi-worker-node-opstellingen, sidecar-containers, schaalstrategieën en clusterconfiguratie |
| **Solution Consulting** | Ontwerp van maatwerkoplossingen voor uw specifieke use case, inclusief integratieplanning en architectuuradviezen |
| **Priority Support & SLA** | Gegarandeerde reactietijden en prioriteitsafhandeling van issues |
| **Custom Development** | Feature-ontwikkeling en aanpassingen op maat van de vereisten van uw organisatie |

## Productie Agent-ondersteuning

Het Heym-team helpt u bij het ontwerpen, bouwen en verstevigen van agents en workflows voor uw bedrijfsprocessen. Dit omvat het beoordelen van uw vereisten, het aanbevelen van node-configuraties en het waarborgen dat uw workflows best practices volgen voor betrouwbaarheid, observability en governance.

Ondersteuning dekt alle node-typen, waaronder [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) en [Cron](../nodes/cron-node.md)-triggers — evenals geavanceerde patronen zoals [multi-agent orkestratie](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md)-checkpoints en [parallelle uitvoering](./parallel-execution.md) over branches.

## Tool Training

Hands-on trainingssessies afgestemd op het vaardigheidsniveau en de use cases van uw team:

- Workflow-editor en [canvas-functies](./canvas-features.md)
- AI-aangedreven nodes: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agent-architectuur](./agent-architecture.md) en multi-agent orkestratie
- Beheer van [Referenties](./credentials.md) en [integraties met derden](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) en planning met [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) en [globale variabelen](./global-variables.md)
- [Teams](./teams.md)-samenwerking en [delen van referenties](./credentials-sharing.md)
- [Portal](./portal.md)-deployment voor klantgerichte chatinterfaces
- [Uitvoeringen](../tabs/traces-tab.md) en [Evaluatie](../tabs/evals-tab.md) voor observability van AI-workflows

## Kubernetes Deployment

De standaardgids [Running & Deployment](../getting-started/running-and-deployment.md) behandelt Docker Compose voor productieopstellingen op één server. Enterprise-klanten ontvangen ondersteuning bij productie-Kubernetes-deployments voor hoge beschikbaarheid en horizontale schaalbaarheid:

- **Meerdere worker-nodes** — Het verdelen van Heym-backend-workers over meerdere Kubernetes-nodes voor redundantie en load balancing
- **Sidecar-containers** — Het configureren van sidecar-patronen voor logverzameling, monitoring-agents, service meshes (Istio, Linkerd) en secret injection (Vault)
- **Resourceplanning** — CPU- en geheugen-requests/limits, pod disruption budgets en horizontal pod autoscaling-beleid
- **Networking** — Configuratie van ingress controllers, TLS-terminatie en interne servicecommunicatie tussen backend-, frontend- en database-pods
- **Persistente opslag** — Provisioning van database- en vectorstore-volumes met passende StorageClass en back-upstrategieën
- **Monitoring** — Integratie met Prometheus, Grafana of uw bestaande observability-stack voor containermetrieken, logs en waarschuwingen

## Solution Consulting

Elke organisatie voert agents uit tegen verschillende systemen en beperkingen. Het Heym-team biedt consulting om u te helpen bij:

- Het beoordelen of Heym past bij uw specifieke use case
- Het ontwerpen van end-to-end agent- en workflow-architecturen
- Het plannen van integraties met uw bestaande infrastructuur en diensten van derden
- Het debuggen van complexe workflows en het oplossen van productie-issues
- Het migreren van bestaande workflows vanuit tools zoals n8n, Zapier of Make.com

## Contact

Bereik het enterprise-team via **enterprise@heym.run** voor licentieaanvragen, prijsinformatie of om een introductiegesprek in te plannen.

## Gerelateerd

- [Running & Deployment](../getting-started/running-and-deployment.md) — Productie-deployment met Docker Compose
- [Security](./security.md) — Beveiligingspraktijken en -configuratie van het platform
- [Parallelle uitvoering](./parallel-execution.md) — Uitvoeringsmodel met meerdere workers
- [Teams](./teams.md) — Teamsamenwerking en het delen van resources
- [Volledige functieset](./features.md) — Compleet overzicht van de mogelijkheden van Heym
