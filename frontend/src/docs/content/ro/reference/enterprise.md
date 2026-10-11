# Enterprise

Licențiere comercială, suport profesional și servicii de implementare pentru platforma Heym.

## Prezentare generală

Heym poate fi utilizat gratuit și găzduit pe cont propriu sub licența sa cu cod sursă disponibil. Pentru organizațiile care necesită licențiere comercială, asistență pentru implementare în producție sau suport dedicat, planul Enterprise oferă servicii practice din partea echipei Heym.

| Serviciu | Descriere |
|---------|-------------|
| **Suport pentru agenți în producție** | Revizuiri de arhitectură, îndrumare pentru proiectarea agenților și workflow-urilor și asistență practică pentru aducerea agenților în producție |
| **Instruire pentru instrumente** | Sesiuni de onboarding și instruire pentru echipa dvs., acoperind editorul de workflow-uri, nodurile AI, agenții și integrările |
| **Sesiuni de întrebări și răspunsuri Heym** | Acces direct la echipa de inginerie Heym pentru întrebări despre platformă, bune practici și depanare |
| **Implementare Kubernetes** | Asistență pentru configurații cu mai multe noduri worker, containere sidecar, strategii de scalare și configurarea cluster-ului |
| **Consultanță pentru soluții** | Proiectarea de soluții personalizate pentru cazul dvs. specific de utilizare, inclusiv planificarea integrărilor și recomandări de arhitectură |
| **Suport prioritar și SLA** | Timpi de răspuns garantați și rezolvarea prioritară a problemelor |
| **Dezvoltare personalizată** | Dezvoltarea de funcționalități și modificări adaptate cerințelor organizației dvs. |

## Suport pentru agenți în producție

Echipa Heym vă ajută să proiectați, să construiți și să consolidați agenți și workflow-uri pentru procesele dvs. de business. Aceasta include revizuirea cerințelor dvs., recomandarea configurațiilor de noduri și asigurarea faptului că workflow-urile dvs. respectă bunele practici pentru fiabilitate, observabilitate și guvernanță.

Suportul acoperă toate tipurile de noduri, inclusiv [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) și trigger-ele [Cron](../nodes/cron-node.md) — precum și modele avansate precum [orchestrarea multi-agent](./agent-architecture.md), punctele de control [Human-in-the-Loop](./human-in-the-loop.md) și [execuția paralelă](./parallel-execution.md) pe ramuri.

## Instruire pentru instrumente

Sesiuni de instruire practică adaptate nivelului de competență și cazurilor de utilizare ale echipei dvs.:

- Editorul de workflow-uri și [funcționalitățile canvas-ului](./canvas-features.md)
- Noduri bazate pe AI: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Arhitectura agenților](./agent-architecture.md) și orchestrarea multi-agent
- Gestionarea [acreditărilor](./credentials.md) și [integrările terțe](./integrations.md)
- [Trigger-e](./triggers.md), [webhook-uri](./webhooks.md) și programarea cu [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) și [variabile globale](./global-variables.md)
- Colaborarea în [Echipe](./teams.md) și [partajarea acreditărilor](./credentials-sharing.md)
- Implementarea [Portalului](./portal.md) pentru interfețe de chat destinate clienților
- [Execuții](../tabs/traces-tab.md) și [Evaluări](../tabs/evals-tab.md) pentru observabilitatea workflow-urilor AI

## Implementare Kubernetes

Ghidul standard [Rulare și implementare](../getting-started/running-and-deployment.md) acoperă Docker Compose pentru configurații de producție pe un singur server. Clienții Enterprise primesc asistență pentru implementări Kubernetes în producție, pentru disponibilitate ridicată și scalare orizontală:

- **Mai multe noduri worker** — Distribuirea workerilor backend Heym pe mai multe noduri Kubernetes pentru redundanță și echilibrare a încărcării
- **Containere sidecar** — Configurarea modelelor sidecar pentru colectarea jurnalelor, agenți de monitorizare, service mesh-uri (Istio, Linkerd) și injectarea secretelor (Vault)
- **Planificarea resurselor** — Cereri/limite de CPU și memorie, bugete de întrerupere a pod-urilor și politici de autoscalare orizontală a pod-urilor
- **Rețelistică** — Configurarea controller-ului Ingress, terminarea TLS și comunicarea internă între servicii între pod-urile de backend, frontend și baze de date
- **Stocare persistentă** — Provisionarea volumelor pentru baze de date și depozite vectoriale cu StorageClass și strategii de backup adecvate
- **Monitorizare** — Integrarea cu Prometheus, Grafana sau stiva dvs. existentă de observabilitate pentru metrici, jurnale și alerte la nivel de container

## Consultanță pentru soluții

Fiecare organizație rulează agenți împotriva unor sisteme și constrângeri diferite. Echipa Heym oferă consultanță pentru a vă ajuta să:

- Evaluați dacă Heym se potrivește cazului dvs. specific de utilizare
- Proiectați arhitecturi complete de agenți și workflow-uri
- Planificați integrările cu infrastructura dvs. existentă și serviciile terțe
- Depanați workflow-uri complexe și rezolvați problemele din producție
- Migrați workflow-urile existente din instrumente precum n8n, Zapier sau Make.com

## Contact

Contactați echipa enterprise la **enterprise@heym.run** pentru întrebări privind licențierea, prețurile sau pentru a programa un apel introductiv.

## Resurse conexe

- [Rulare și implementare](../getting-started/running-and-deployment.md) — Implementare în producție cu Docker Compose
- [Securitate](./security.md) — Practici și configurare pentru securitatea platformei
- [Execuție paralelă](./parallel-execution.md) — Model de execuție cu mai mulți workeri
- [Echipe](./teams.md) — Colaborare în echipă și partajarea resurselor
- [Set complet de funcționalități](./features.md) — Prezentare completă a capabilităților Heym
