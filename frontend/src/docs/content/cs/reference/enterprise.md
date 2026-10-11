# Enterprise

Komerční licencování, profesionální podpora a služby nasazení pro platformu Heym.

## Přehled

Heym je zdarma k použití a k self-hostingu v rámci své source-available licence. Pro organizace, které potřebují komerční licencování, asistenci při nasazení v produkční kvalitě nebo dedikovanou podporu, nabízí plán Enterprise praktické služby od týmu Heym.

| Služba | Popis |
|---------|-------------|
| **Produkční podpora agentů** | Architektonické revize, poradenství při návrhu agentů a workflow a praktická pomoc při uvádění agentů do produkce |
| **Školení nástrojů** | Onboardingová sezení a školení pro Váš tým zahrnující workflow editor, AI uzly, agenty a integrace |
| **Heym Q&A** | Přímý přístup k inženýrskému týmu Heym pro dotazy k platformě, best practices a řešení problémů |
| **Nasazení Kubernetes** | Asistence při nastavení s více worker nody, sidecar kontejnery, strategie škálování a konfigurace clusteru |
| **Konzultace řešení** | Návrh řešení na míru pro Váš konkrétní případ použití včetně plánování integrací a architektonických doporučení |
| **Prioritní podpora a SLA** | Garantované doby odezvy a prioritní řešení problémů |
| **Vývoj na zakázku** | Vývoj funkcí a úpravy přizpůsobené požadavkům Vaší organizace |

## Produkční podpora agentů

Tým Heym Vám pomáhá navrhovat, sestavovat a zpevňovat agenty a workflow pro Vaše obchodní procesy. To zahrnuje revizi Vašich požadavků, doporučení konfigurací uzlů a zajištění toho, aby Vaše workflow dodržovaly best practices pro spolehlivost, observability a governance.

Podpora pokrývá všechny typy uzlů včetně [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) a [Cron](../nodes/cron-node.md) triggerů — stejně jako pokročilé vzory, jako je [multi-agent orchestration](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) kontrolní body a [paralelní provádění](./parallel-execution.md) napříč větvemi.

## Školení nástrojů

Praktická školení přizpůsobená úrovni dovedností a případům použití Vašeho týmu:

- Workflow editor a [funkce canvasu](./canvas-features.md)
- AI uzly: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Architektura agentů](./agent-architecture.md) a multi-agent orchestration
- Správa [přihlašovacích údajů](./credentials.md) a [integrace třetích stran](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) a plánování pomocí [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) a [globální proměnné](./global-variables.md)
- Spolupráce v [Teams](./teams.md) a [sdílení přihlašovacích údajů](./credentials-sharing.md)
- Nasazení [Portal](./portal.md) pro chat rozhraní určená zákazníkům
- [Spuštění](../tabs/traces-tab.md) a [Evaluace](../tabs/evals-tab.md) pro observability AI workflow

## Nasazení Kubernetes

Standardní průvodce [Provoz a nasazení](../getting-started/running-and-deployment.md) pokrývá Docker Compose pro produkční nastavení na jednom serveru. Zákazníci plánu Enterprise obdrží asistenci s produkčními nasazeními Kubernetes pro vysokou dostupnost a horizontální škálování:

- **Více worker nodů** — Distribuce backendových workerů Heym napříč více Kubernetes nody pro redundanci a vyvažování zátěže
- **Sidecar kontejnery** — Konfigurace sidecar vzorů pro sběr logů, monitorovací agenty, service meshes (Istio, Linkerd) a injektování secretů (Vault)
- **Plánování zdrojů** — Požadavky a limity CPU a paměti, pod disruption budgets a politiky horizontálního autoscalingu podů
- **Sítě** — Konfigurace Ingress controlleru, ukončení TLS a interní komunikace mezi pody backendu, frontendu a databáze
- **Perzistentní úložiště** — Zajištění svazků databáze a vektorového úložiště s odpovídající StorageClass a strategiemi zálohování
- **Monitoring** — Integrace s Prometheus, Grafana nebo Vaším stávajícím observability stackem pro metriky kontejnerů, logy a výstrahy

## Konzultace řešení

Každá organizace provozuje agenty proti různým systémům a omezením. Tým Heym poskytuje konzultace, které Vám pomohou:

- Vyhodnotit, zda Heym vyhovuje Vašemu konkrétnímu případu použití
- Navrhnout end-to-end architektury agentů a workflow
- Naplánovat integrace s Vaší stávající infrastrukturou a službami třetích stran
- Ladit složité workflow a řešit produkční problémy
- Migrovat stávající workflow z nástrojů, jako jsou n8n, Zapier nebo Make.com

## Kontakt

Kontaktujte enterprise tým na **enterprise@heym.run** pro dotazy k licencování, ceny nebo pro domluvení úvodního hovoru.

## Související

- [Provoz a nasazení](../getting-started/running-and-deployment.md) — Produkční nasazení s Docker Compose
- [Zabezpečení](./security.md) — Bezpečnostní postupy a konfigurace platformy
- [Paralelní provádění](./parallel-execution.md) — Model provádění s více workery
- [Teams](./teams.md) — Týmová spolupráce a sdílení zdrojů
- [Kompletní sada funkcí](./features.md) — Úplný přehled možností Heym
