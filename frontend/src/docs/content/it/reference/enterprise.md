# Enterprise

Licenze commerciali, supporto professionale e servizi di deployment per la piattaforma Heym.

## Panoramica

Heym è gratuito da utilizzare e self-host sotto la sua licenza source-available. Per le organizzazioni che necessitano di licenze commerciali, assistenza al deployment di livello produttivo o supporto dedicato, il piano Enterprise fornisce servizi hands-on da parte del team Heym.

| Servizio | Descrizione |
|---------|-------------|
| **Supporto Agenti in Produzione** | Revisioni architetturali, consulenza sulla progettazione di agenti e workflow e supporto hands-on per portare gli agenti in produzione |
| **Formazione sugli Strumenti** | Sessioni di onboarding e formazione per il Suo team che coprono l'editor dei workflow, i nodi IA, gli agenti e le integrazioni |
| **Heym Q&A** | Accesso diretto al team di ingegneria Heym per domande sulla piattaforma, best practice e risoluzione dei problemi |
| **Deployment Kubernetes** | Assistenza con configurazioni multi-worker-node, container sidecar, strategie di scalabilità e configurazione del cluster |
| **Consulenza Soluzioni** | Progettazione di soluzioni personalizzate per il Suo caso d'uso specifico, inclusa la pianificazione delle integrazioni e raccomandazioni architetturali |
| **Supporto Prioritario e SLA** | Tempi di risposta garantiti e risoluzione prioritaria dei problemi |
| **Sviluppo Personalizzato** | Sviluppo di funzionalità e modifiche su misura per i requisiti della Sua organizzazione |

## Supporto Agenti in Produzione

Il team Heym La assiste nella progettazione, realizzazione e messa in sicurezza di agenti e workflow per i Suoi processi aziendali. Ciò include la revisione dei Suoi requisiti, la raccomandazione di configurazioni dei nodi e la verifica che i Suoi workflow seguano le best practice per affidabilità, osservabilità e governance.

Il supporto copre tutti i tipi di nodo, inclusi [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) e Trigger [Cron](../nodes/cron-node.md) — nonché pattern avanzati come l'[orchestrazione multi-agente](./agent-architecture.md), i checkpoint [Human-in-the-Loop](./human-in-the-loop.md) e l'[esecuzione parallela](./parallel-execution.md) tra i rami.

## Formazione sugli Strumenti

Sessioni di formazione hands-on personalizzate in base al livello di competenza e ai casi d'uso del Suo team:

- Editor dei workflow e [funzionalità del canvas](./canvas-features.md)
- Nodi basati su IA: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Architettura degli agenti](./agent-architecture.md) e orchestrazione multi-agente
- Gestione delle [Credenziali](./credentials.md) e [integrazioni di terze parti](./integrations.md)
- [Trigger](./triggers.md), [webhook](./webhooks.md) e pianificazione con [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) e [variabili globali](./global-variables.md)
- Collaborazione tramite [Teams](./teams.md) e [condivisione delle credenziali](./credentials-sharing.md)
- Deployment del [Portal](./portal.md) per interfacce chat rivolte ai clienti
- [Esecuzioni](../tabs/traces-tab.md) e [Valutazioni](../tabs/evals-tab.md) per l'osservabilità dei workflow IA

## Deployment Kubernetes

La guida standard [Running & Deployment](../getting-started/running-and-deployment.md) copre Docker Compose per configurazioni di produzione su singolo server. I clienti Enterprise ricevono assistenza per deployment Kubernetes di produzione finalizzati ad alta disponibilità e scalabilità orizzontale:

- **Worker node multipli** — Distribuzione dei worker backend di Heym su più nodi Kubernetes per ridondanza e bilanciamento del carico
- **Container sidecar** — Configurazione di pattern sidecar per la raccolta dei log, agenti di monitoraggio, service mesh (Istio, Linkerd) e iniezione dei segreti (Vault)
- **Pianificazione delle risorse** — Richieste/limiti di CPU e memoria, pod disruption budget e politiche di autoscaling orizzontale dei pod
- **Networking** — Configurazione del controller Ingress, terminazione TLS e comunicazione interna tra i servizi tra i pod di backend, frontend e database
- **Storage persistente** — Provisioning dei volumi per database e archivi vettoriali con StorageClass e strategie di backup appropriate
- **Monitoraggio** — Integrazione con Prometheus, Grafana o il Suo stack di osservabilità esistente per metriche dei container, log e avvisi

## Consulenza Soluzioni

Ogni organizzazione esegue agenti su sistemi e vincoli differenti. Il team Heym fornisce consulenza per aiutarLa a:

- Valutare se Heym è adatto al Suo caso d'uso specifico
- Progettare architetture end-to-end di agenti e workflow
- Pianificare integrazioni con la Sua infrastruttura esistente e servizi di terze parti
- Eseguire il debug di workflow complessi e risolvere problemi in produzione
- Migrare workflow esistenti da strumenti quali n8n, Zapier o Make.com

## Contatti

Contatti il team enterprise all'indirizzo **enterprise@heym.run** per richieste di licenza, informazioni sui prezzi o per programmare una call introduttiva.
## Correlati

- [Esecuzione e distribuzione](../getting-started/running-and-deployment.md) — Distribuzione in produzione con Docker Compose
- [Sicurezza](./security.md) — Pratiche di sicurezza della piattaforma e configurazione
- [Esecuzione parallela](./parallel-execution.md) — Modello di esecuzione multi-worker
- [Team](./teams.md) — Collaborazione tra team e condivisione delle risorse
- [Set completo di funzionalità](./features.md) — Panoramica completa delle capacità di Heym
