# Enterprise

Komerciālā licencēšana, profesionālais atbalsts un izvietošanas pakalpojumi Heym platformai.

## Pārskats

Heym ir bezmaksas lietošanai un pašizvietošanai saskaņā ar tā source-available licenci. Organizācijām, kurām nepieciešama komerciālā licencēšana, ražošanas līmeņa izvietošanas palīdzība vai īpašs atbalsts, Enterprise plāns nodrošina praktiskus pakalpojumus no Heym komandas.

| Pakalpojums | Apraksts |
|---------|-------------|
| **Production Agent Support** | Arhitektūras pārskati, aģentu un workflow dizaina vadlīnijas un praktiska palīdzība aģentu ieviešanā ražošanā |
| **Tool Training** | Ievadapmācības sesijas un apmācības Jūsu komandai par workflow redaktoru, AI mezgliem, aģentiem un integrācijām |
| **Heym Q&A** | Tieša piekļuve Heym inženieru komandai platformas jautājumos, labākajās praksēs un problēmu risināšanā |
| **Kubernetes Deployment** | Palīdzība ar multi-worker-node iestatījumiem, sidecar konteineriem, mērogošanas stratēģijām un cluster konfigurāciju |
| **Solution Consulting** | Pielāgota risinājuma dizains Jūsu konkrētajam lietošanas gadījumam, tostarp integrācijas plānošana un arhitektūras ieteikumi |
| **Priority Support & SLA** | Garantēti atbildes laiki un prioritāra problēmu risināšana |
| **Custom Development** | Funkciju izstrāde un modifikācijas, kas pielāgotas Jūsu organizācijas prasībām |

## Production Agent Support

Heym komanda palīdz Jums izstrādāt, veidot un nostiprināt aģentus un workflow Jūsu biznesa procesiem. Tas ietver Jūsu prasību pārskatīšanu, mezglu konfigurāciju ieteikšanu un pārliecināšanos, ka Jūsu workflow atbilst labākajām praksēm uzticamības, novērojamības un pārvaldības jomā.

Atbalsts aptver visus mezglu veidus, tostarp [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) un [Cron](../nodes/cron-node.md) trigger — kā arī progresīvus modeļus, piemēram, [multi-agent orchestration](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) kontrolpunktus un [parallel execution](./parallel-execution.md) starp zariem.

## Tool Training

Praktiskas apmācību sesijas, kas pielāgotas Jūsu komandas prasmju līmenim un lietošanas gadījumiem:

- Workflow redaktors un [canvas features](./canvas-features.md)
- AI-powered mezgli: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agent architecture](./agent-architecture.md) un multi-agent orchestration
- [Credentials](./credentials.md) pārvaldība un [third-party integrations](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) un plānošana ar [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) un [global variables](./global-variables.md)
- [Teams](./teams.md) sadarbība un [credentials sharing](./credentials-sharing.md)
- [Portal](./portal.md) izvietošana klientiem paredzētām chat saskarnēm
- [Traces](../tabs/traces-tab.md) un [Evals](../tabs/evals-tab.md) AI workflow novērojamībai

## Kubernetes Deployment

Standarta [Running & Deployment](../getting-started/running-and-deployment.md) rokasgrāmata aptver Docker Compose vienas servera ražošanas iestatījumiem. Enterprise klienti saņem palīdzību ar ražošanas Kubernetes izvietošanu augstai pieejamībai un horizontālai mērogošanai:

- **Multiple worker nodes** — Heym backend worker izkliedēšana pa vairākiem Kubernetes mezgliem dublēšanai un slodzes balansēšanai
- **Sidecar containers** — Sidecar modeļu konfigurēšana žurnālu vākšanai, monitoringa aģentiem, service meshes (Istio, Linkerd) un secret injection (Vault)
- **Resource planning** — CPU un atmiņas pieprasījumi/limiti, pod disruption budgets un horizontālās pod autoscaling politikas
- **Networking** — Ingress controller konfigurācija, TLS termination un iekšējā servisa komunikācija starp backend, frontend un datubāzes podiem
- **Persistent storage** — Datubāzes un vektoru krātuves apjomu nodrošināšana ar atbilstošu StorageClass un dublēšanas stratēģijām
- **Monitoring** — Integrācija ar Prometheus, Grafana vai Jūsu esošo novērojamības stack konteineru metrikai, žurnāliem un brīdinājumiem

## Solution Consulting

Katra organizācija darbina aģentus pret dažādām sistēmām un ierobežojumiem. Heym komanda nodrošina konsultācijas, lai palīdzētu Jums:

- Novērtēt, vai Heym atbilst Jūsu konkrētajam lietošanas gadījumam
- Izstrādāt end-to-end aģentu un workflow arhitektūras
- Plānot integrācijas ar Jūsu esošo infrastruktūru un trešo pušu pakalpojumiem
- Atkļūdot sarežģītus workflow un risināt ražošanas problēmas
- Migrēt esošos workflow no tādiem rīkiem kā n8n, Zapier vai Make.com

## Kontakti

Sazinieties ar enterprise komandu **enterprise@heym.run**, lai uzzinātu par licencēšanu, cenām vai ieplānotu iepazīšanās zvanu.

## Saistītie

- [Running & Deployment](../getting-started/running-and-deployment.md) — Ražošanas izvietošana ar Docker Compose
- [Security](./security.md) — Platformas drošības prakses un konfigurācija
- [Parallel Execution](./parallel-execution.md) — Multi-worker izpildes modelis
- [Teams](./teams.md) — Komandas sadarbība un resursu koplietošana
- [Full Feature Set](./features.md) — Pilnīgs Heym iespēju pārskats
