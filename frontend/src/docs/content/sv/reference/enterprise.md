# Enterprise

Kommersiell licensiering, professionell support och driftsättningstjänster för Heym-plattformen.

## Översikt

Heym är fritt att använda och self-hosta under sin source-available-licens. För organisationer som behöver kommersiell licensiering, produktionsfärdig driftsättningshjälp eller dedikerad support erbjuder Enterprise-planen praktiska tjänster från Heym-teamet.

| Tjänst | Beskrivning |
|---------|-------------|
| **Produktionssupport för agenter** | Arkitekturgranskningar, vägledning för agent- och workflow-design samt praktisk hjälp med att ta agenter till produktion |
| **Verktygsutbildning** | Onboardingsessioner och utbildning för teamet som täcker workflow-editorn, AI-noder, agenter och integrationer |
| **Heym Q&A** | Direkt tillgång till Heyms ingenjörsteam för plattformsfrågor, bästa praxis och felsökning |
| **Kubernetes-driftsättning** | Hjälp med konfigurationer för flera worker-noder, sidecar-containrar, skalningsstrategier och cluster-konfiguration |
| **Lösningskonsulting** | Skräddarsydd lösningsdesign för det specifika användningsfallet, inklusive integrationsplanering och arkitekturrekommendationer |
| **Prioriterad support & SLA** | Garanterade svarstider och prioriterad ärendehantering |
| **Kundanpassad utveckling** | Funktionsutveckling och modifieringar anpassade efter organisationens krav |

## Heym Work

[Heym Work](./heym-work.md) är gränssnittet för affärsteam som körs ovanpå Heym. Användare beskriver en uppgift, svarar på några frågor och får ett testat workflow, arbetar från sidor byggda för dem och besvarar granskningar – med enkel inloggning (SSO), rollerna Owner, Editor och Viewer samt ett namn på varje körning. Det körs bredvid din Heym-instans med en egen licens; anslut det under **Settings → Heym Work**. Läs mer och begär en testversion på [heym.run/enterprise](https://heym.run/enterprise).

## Produktionssupport för agenter

Heym-teamet hjälper till att designa, bygga och härda agenter och workflows för affärsprocesser. Detta inkluderar granskning av krav, rekommendationer för nodkonfigurationer och säkerställande av att workflows följer bästa praxis för tillförlitlighet, observerbarhet och styrning.

Supporten täcker alla nodtyper, inklusive [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) och [Cron](../nodes/cron-node.md)-triggers — samt avancerade mönster som [multi-agent-orkestrering](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md)-checkpoints och [parallell exekvering](./parallel-execution.md) över grenar.

## Verktygsutbildning

Praktiska utbildningssessioner anpassade efter teamets kunskapsnivå och användningsfall:

- Workflow-editorn och [canvas-funktioner](./canvas-features.md)
- AI-drivna noder: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agent-arkitektur](./agent-architecture.md) och multi-agent-orkestrering
- Hantering av [Autentiseringsuppgifter](./credentials.md) och [tredjepartsintegrationer](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) och schemaläggning med [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) och [globala variabler](./global-variables.md)
- [Teams](./teams.md)-samarbete och [delning av autentiseringsuppgifter](./credentials-sharing.md)
- [Portal](./portal.md)-driftsättning för kundvända chattgränssnitt
- [Körningar](../tabs/traces-tab.md) och [Utvärdering](../tabs/evals-tab.md) för observerbarhet i AI-workflows

## Kubernetes-driftsättning

Standardsguiden [Köra & Driftsätta](../getting-started/running-and-deployment.md) täcker Docker Compose för produktionsuppsättningar på en server. Enterprise-kunder får hjälp med Kubernetes-driftsättningar i produktion för hög tillgänglighet och horisontell skalning:

- **Flera worker-noder** — Distribuering av Heyms backend-workers över flera Kubernetes-noder för redundans och lastbalansering
- **Sidecar-containrar** — Konfigurering av sidecar-mönster för logginsamling, övervakningsagenter, service mesh (Istio, Linkerd) och hemlighetsinjektion (Vault)
- **Resursplanering** — CPU- och minnesförfrågningar/gränser, pod disruption budgets och horisontella pod-autoskalningspolicyer
- **Nätverk** — Konfiguration av ingress controller, TLS-terminering och intern servicekommunikation mellan backend-, frontend- och databaspoddar
- **Beständig lagring** — Volymetablering för databas och vektorlager med lämplig StorageClass och säkerhetskopieringsstrategier
- **Övervakning** — Integration med Prometheus, Grafana eller befintlig observerbarhetsstack för containermetrik, loggar och varningar

## Lösningskonsulting

Varje organisation kör agenter mot olika system och begränsningar. Heym-teamet erbjuder konsulting för att hjälpa till att:

- Utvärdera om Heym passar det specifika användningsfallet
- Designa heltäckande agent- och workflow-arkitekturer
- Planera integrationer med befintlig infrastruktur och tredjepartstjänster
- Felsöka komplexa workflows och lösa produktionsproblem
- Migrera befintliga workflows från verktyg som n8n, Zapier eller Make.com

## Kontakt

Nå enterprise-teamet på **enterprise@heym.run** för licensfrågor, prissättning eller för att boka ett introduktionssamtal.

## Relaterat

- [Köra & Driftsätta](../getting-started/running-and-deployment.md) — Produktionsdriftsättning med Docker Compose
- [Säkerhet](./security.md) — Plattformens säkerhetspraxis och konfiguration
- [Parallell exekvering](./parallel-execution.md) — Exekveringsmodell med flera workers
- [Teams](./teams.md) — Teamsamarbete och resursdelning
- [Fullständig funktionsuppsättning](./features.md) — Komplett översikt över Heyms funktioner
- [Heym Work](./heym-work.md): gränssnittet för affärsteam och hur du ansluter det
