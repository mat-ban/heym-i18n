# Enterprise

Kommerciel licensering, professionel support og implementeringstjenester til Heym-platformen.

## Oversigt

Heym er gratis at bruge og selv-host under dens kildekode-tilgængelige licens. For organisationer, der har brug for kommerciel licensering, produktionsklar implementeringsassistance eller dedikeret support, tilbyder Enterprise-planen praktiske tjenester fra Heym-teamet.

| Tjeneste | Beskrivelse |
|---------|-------------|
| **Produktionsagent-support** | Arkitekturgennemgange, agent- og workflow-designvejledning samt praktisk hjælp til at tage agenter i produktion |
| **Værktøjstræning** | Onboarding-sessioner og træning til teamet, der dækker workflow-editoren, AI-noder, agenter og integrationer |
| **Heym Q&A** | Direkte adgang til Heym-ingeniørteamet til platformspørgsmål, bedste praksis og fejlfinding |
| **Kubernetes-implementering** | Assistance med opsætning af flere worker-noder, sidecar-containere, skaleringstrategier og cluster-konfiguration |
| **Løsningskonsulent** | Brugerdefineret løsningsdesign til specifikke brugsscenarier, herunder integrationsplanlægning og arkitekturanbefalinger |
| **Prioriteret support & SLA** | Garanterede responstider og prioriteret fejlhåndtering |
| **Brugerdefineret udvikling** | Funktionsudvikling og tilpasninger skræddersyet til organisationens behov |

## Heym Work

[Heym Work](./heym-work.md) er grænsefladen til forretningsteams, der kører oven på Heym. Brugere beskriver en opgave, besvarer et par spørgsmål og får et testet workflow, arbejder fra sider bygget til dem og besvarer gennemgange – med single sign-on (SSO), rollerne Owner, Editor og Viewer samt et navn på hver kørsel. Det kører ved siden af din Heym-instans med sin egen licens; tilslut det under **Settings → Heym Work**. Læs mere og anmod om en prøveversion på [heym.run/enterprise](https://heym.run/enterprise).

## Produktionsagent-support

Heym-teamet hjælper med at designe, bygge og styrke agenter og workflows til forretningsprocesser. Dette inkluderer gennemgang af krav, anbefalinger til nodekonfigurationer og sikring af, at workflows følger bedste praksis for pålidelighed, observerbarhed og governance.

Support dækker alle nodetyper inklusive [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) og [Cron](../nodes/cron-node.md) triggers - samt avancerede mønstre som [multi-agent-orchestering](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) checkpoints og [parallel eksekvering](./parallel-execution.md) på tværs af grene.

## Værktøjstræning

Praktiske træningssessioner skræddersyet til teamets kompetenceniveau og brugsscenarier:

- Workflow-editor og [canvas-funktioner](./canvas-features.md)
- AI-drevne noder: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agentarkitektur](./agent-architecture.md) og multi-agent-orchestering
- [Legitimationsoplysninger](./credentials.md)-håndtering og [tredjepartsintegrationer](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) og planlægning med [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) og [globale variabler](./global-variables.md)
- [Teams](./teams.md)-samarbejde og [deling af legitimationsoplysninger](./credentials-sharing.md)
- [Portal](./portal.md)-implementering til kundevendte chatgrænseflader
- [Kørsler](../tabs/traces-tab.md) og [evalueringer](../tabs/evals-tab.md) til AI-workflow-observabilitet

## Kubernetes-implementering

Den standard [Kørsel & Implementering](../getting-started/running-and-deployment.md)-vejledning dækker Docker Compose til single-server-produktionsopsætninger. Enterprise-kunder modtager assistance med produktionsklar Kubernetes-implementering til høj tilgængelighed og horisontal skalering:

- **Flere worker-noder** - Fordeling af Heym-backend-workers på tværs af flere Kubernetes-noder til redundans og belastningsfordeling
- **Sidecar-containere** - Konfiguration af sidecar-mønstre til logindsamling, monitoreringsagenter, service-meshes (Istio, Linkerd) og hemmelighedsinjektion (Vault)
- **Ressourceplanlægning** - CPU- og hukommelsesanmodninger/grænser, pod-disruptionsbudgetter og horisontale pod-autoskaleringpolitikker
- **Netværk** - Ingress-controller-konfiguration, TLS-terminering og intern servicekommunikation mellem backend-, frontend- og database-pods
- **Persistent lagring** - Database- og vektorlager-volumeprovisionering med passende StorageClass og backupstrategier
- **Overvågning** - Integration med Prometheus, Grafana eller eksisterende observerbarhedsstack til containermetrics, logs og advarsler

## Løsningskonsulent

Hver organisation kører agenter mod forskellige systemer og begrænsninger. Heym-teamet yder konsulentbistand til at hjælpe med:

- Vurdering af Heyms egnethed til specifikke brugsscenarier
- Design af end-to-end agent- og workflowarkitekturer
- Planlægning af integrationer med eksisterende infrastruktur og tredjepartstjenester
- Fejlfinding af komplekse workflows og løsning af produktionsproblemer
- Migration af eksisterende workflows fra værktøjer som n8n, Zapier eller Make.com

## Kontakt

Kontakt enterprise-teamet på **enterprise@heym.run** for licensforespørgsler, priser eller for at aftale et introduktionsmøde.

## Relateret

- [Kørsel & Implementering](../getting-started/running-and-deployment.md) - Produktionsimplementering med Docker Compose
- [Sikkerhed](./security.md) - Platformsikkerhedspraksis og konfiguration
- [Parallel Eksekvering](./parallel-execution.md) - Multi-worker-eksekveringsmodel
- [Teams](./teams.md) - Teamsamarbejde og ressourcefællesskab
- [Fuld funktionsoversigt](./features.md) - Komplet oversigt over Heyms egenskaber
- [Heym Work](./heym-work.md): grænsefladen til forretningsteams, og hvordan du tilslutter den
