# Enterprise

Komerčné licencovanie, profesionálna podpora a služby nasadenia pre platformu Heym.

## Prehľad

Heym je možné bezplatne používať a self-hostovať na základe jeho source-available licencie. Pre organizácie, ktoré potrebujú komerčné licencovanie, pomoc s nasadením v produkčnej kvalite alebo vyhradenú podporu, poskytuje plán Enterprise praktické služby od tímu Heym.

| Služba | Popis |
|---------|-------------|
| **Production Agent Support** | Architektonické revízie, usmernenia pri návrhu agentov a workflowov a praktická pomoc pri uvádzaní agentov do produkcie |
| **Tool Training** | Onboardingové stretnutia a školenia pre Váš tím pokrývajúce editor workflowov, AI uzly, agentov a integrácie |
| **Heym Q&A** | Priamy prístup k inžinierskemu tímu Heym pre otázky týkajúce sa platformy, osvedčené postupy a riešenie problémov |
| **Kubernetes Deployment** | Pomoc s nastaveniami s viacerými worker uzlami, sidecar kontajnermi, stratégiami škálovania a konfiguráciou clusteru |
| **Solution Consulting** | Návrh riešení na mieru pre Váš konkrétny prípad použitia vrátane plánovania integrácií a architektonických odporúčaní |
| **Priority Support & SLA** | Garantované časy odozvy a prioritné riešenie problémov |
| **Custom Development** | Vývoj funkcií a úpravy prispôsobené požiadavkám Vašej organizácie |

## Production Agent Support

Tím Heym Vám pomáha navrhovať, vytvárať a spevňovať agentov a workflowy pre Vaše obchodné procesy. Zahŕňa to revíziu Vašich požiadaviek, odporúčanie konfigurácií uzlov a zabezpečenie toho, aby Vaše workflowy dodržiavali osvedčené postupy pre spoľahlivosť, observability a governance.

Podpora pokrýva všetky typy uzlov vrátane [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) a [Cron](../nodes/cron-node.md) triggerov — ako aj pokročilé vzory, ako napríklad [multi-agent orchestration](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) kontrolné body a [paralelné vykonávanie](./parallel-execution.md) naprieč vetvami.

## Tool Training

Praktické školiace stretnutia prispôsobené úrovni zručností a prípadom použitia Vášho tímu:

- Editor workflowov a [funkcie plátna](./canvas-features.md)
- AI-powered uzly: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Architektúra agentov](./agent-architecture.md) a multi-agent orchestration
- Správa [prihlasovacích údajov](./credentials.md) a [integrácie tretích strán](./integrations.md)
- [Triggers](./triggers.md), [webhooky](./webhooks.md) a plánovanie pomocou [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) a [globálne premenné](./global-variables.md)
- Kolaborácia v [Teams](./teams.md) a [zdieľanie prihlasovacích údajov](./credentials-sharing.md)
- Nasadenie [Portalu](./portal.md) pre chat rozhrania určené zákazníkom
- [Spustenia](../tabs/traces-tab.md) a [Hodnotenia](../tabs/evals-tab.md) pre observability AI workflowov

## Kubernetes Deployment

Štandardný návod [Spustenie a nasadenie](../getting-started/running-and-deployment.md) pokrýva Docker Compose pre produkčné nastavenia na jednom serveri. Zákazníci plánu Enterprise dostávajú pomoc s produkčnými nasadeniami Kubernetes pre vysokú dostupnosť a horizontálne škálovanie:

- **Viaceré worker uzly** — Distribúcia backendových workerov Heym naprieč viacerými uzlami Kubernetes pre redundanciu a vyvažovanie záťaže
- **Sidecar kontajnery** — Konfigurácia sidecar vzorov pre zber logov, monitorovacích agentov, service meshes (Istio, Linkerd) a injektovanie secretov (Vault)
- **Plánovanie zdrojov** — Požiadavky/limity CPU a pamäte, pod disruption budgets a politiky horizontálneho autoskalovania podov
- **Sieťovanie** — Konfigurácia Ingress controllera, ukončenie TLS a interná komunikácia služieb medzi backendovými, frontendovými a databázovými podmi
- **Perzistentné úložisko** — Poskytovanie zväzkov databázy a vektorového úložiska s vhodnou StorageClass a stratégiami zálohovania
- **Monitoring** — Integrácia s Prometheus, Grafana alebo Vaším existujúcim observability stackom pre metriky kontajnerov, logy a upozornenia

## Solution Consulting

Každá organizácia prevádzkuje agentov proti rôznym systémom a obmedzeniam. Tím Heym poskytuje konzultácie, ktoré Vám pomôžu:

- Vyhodnotiť, či Heym vyhovuje Vášmu konkrétnemu prípadu použitia
- Navrhnúť end-to-end architektúry agentov a workflowov
- Naplánovať integrácie s Vašou existujúcou infraštruktúrou a službami tretích strán
- Ladiť komplexné workflowy a riešiť produkčné problémy
- Migrovať existujúce workflowy z nástrojov, ako sú n8n, Zapier alebo Make.com

## Kontakt

Obráťte sa na enterprise tím na **enterprise@heym.run** pre otázky týkajúce sa licencovania, cien alebo na dohodnutie úvodného hovoru.

## Súvisiace

- [Spustenie a nasadenie](../getting-started/running-and-deployment.md) — Produkčné nasadenie s Docker Compose
- [Zabezpečenie](./security.md) — Postupy a konfigurácia zabezpečenia platformy
- [Paralelné vykonávanie](./parallel-execution.md) — Model vykonávania s viacerými workermi
- [Teams](./teams.md) — Kolaborácia tímu a zdieľanie zdrojov
- [Úplná sada funkcií](./features.md) — Kompletný prehľad možností Heym
