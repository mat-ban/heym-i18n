# Enterprise

Llicències comercials, suport professional i serveis de desplegament per a la plataforma Heym.

## Visió general

Heym és d'ús gratuït i es pot autoallotjar sota la seva llicència de codi disponible. Per a les organitzacions que necessiten llicències comercials, assistència en el desplegament per a entorns de producció o suport dedicat, el pla Enterprise ofereix serveis pràctics de la mà de l'equip de Heym.

| Servei | Descripció |
|---------|-------------|
| **Suport per a agents en producció** | Revisions d'arquitectura, orientació en el disseny d'agents i workflows, i ajuda pràctica per portar els agents a producció |
| **Formació en eines** | Sessions d'acollida i formació per al vostre equip sobre l'editor de workflows, els nodes d'IA, els agents i les integracions |
| **Preguntes i respostes sobre Heym** | Accés directe a l'equip d'enginyeria de Heym per a consultes sobre la plataforma, bones pràctiques i resolució de problemes |
| **Desplegament a Kubernetes** | Assistència amb configuracions de múltiples nodes de treball, contenidors sidecar, estratègies d'escalat i configuració de clústers |
| **Consultoria de solucions** | Disseny de solucions personalitzades per al vostre cas d'ús específic, incloent-hi la planificació d'integracions i recomanacions d'arquitectura |
| **Suport prioritari i SLA** | Temps de resposta garantits i resolució prioritària d'incidències |
| **Desenvolupament personalitzat** | Desenvolupament de funcionalitats i modificacions adaptades als requisits de la vostra organització |

## Heym Work

[Heym Work](./heym-work.md) és la interfície per a equips de negoci que s'executa sobre Heym. Les persones descriuen una tasca, responen unes quantes preguntes i obtenen un workflow provat, treballen des de pàgines creades per a elles i responen revisions, amb inici de sessió únic (SSO), rols Owner, Editor i Viewer, i un nom a cada execució. S'executa al costat del vostre Heym amb la seva pròpia llicència; connecteu-lo a **Settings → Heym Work**. Obteniu més informació i sol·liciteu una prova a [heym.run/enterprise](https://heym.run/enterprise).

## Suport per a agents en producció

L'equip de Heym us ajuda a dissenyar, construir i consolidar agents i workflows per als vostres processos de negoci. Això inclou la revisió dels vostres requisits, la recomanació de configuracions de nodes i assegurar que els vostres workflows segueixin les bones pràctiques de fiabilitat, observabilitat i governança.

El suport cobreix tots els tipus de nodes, incloent-hi [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) i Triggers de [Cron](../nodes/cron-node.md), així com patrons avançats com ara [orquestració multiagent](./agent-architecture.md), punts de control [Human-in-the-Loop](./human-in-the-loop.md) i [execució en paral·lel](./parallel-execution.md) entre branques.

## Formació en eines

Sessions de formació pràctica adaptades al nivell d'habilitat i als casos d'ús del vostre equip:

- Editor de workflows i [funcionalitats del canvas](./canvas-features.md)
- Nodes amb IA: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Arquitectura d'agents](./agent-architecture.md) i orquestració multiagent
- Gestió de [credencials](./credentials.md) i [integracions de tercers](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) i programació amb [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) i [variables globals](./global-variables.md)
- Col·laboració amb [equips](./teams.md) i [compartició de credencials](./credentials-sharing.md)
- Desplegament del [Portal](./portal.md) per a interfícies de chat orientades al client
- [Execucions](../tabs/traces-tab.md) i [Avaluacions](../tabs/evals-tab.md) per a l'observabilitat de workflows d'IA

## Desplegament a Kubernetes

La guia estàndard d'[Execució i desplegament](../getting-started/running-and-deployment.md) cobreix Docker Compose per a configuracions de producció en un sol servidor. Els clients Enterprise reben assistència amb desplegaments de Kubernetes en producció per a alta disponibilitat i escalat horitzontal:

- **Múltiples nodes de treball** — Distribuir els workers del backend de Heym entre diversos nodes de Kubernetes per a redundància i equilibri de càrrega
- **Contenidors sidecar** — Configurar patrons sidecar per a la recollida de logs, agents de monitoratge, malles de serveis (Istio, Linkerd) i injecció de secrets (Vault)
- **Planificació de recursos** — Sol·licituds i límits de CPU i memòria, pressupostos de pertorbació de pods i polítiques d'escalat horitzontal automàtic de pods
- **Xarxes** — Configuració del controlador d'Ingress, terminació TLS i comunicació interna de serveis entre els pods de backend, frontend i base de dades
- **Emmagatzematge persistent** — Aprovisionament de volums per a la base de dades i el magatzem vectorial amb la StorageClass adequada i estratègies de còpia de seguretat
- **Monitoratge** — Integració amb Prometheus, Grafana o la vostra pila d'observabilitat existent per a mètriques de contenidors, logs i alertes

## Consultoria de solucions

Cada organització executa agents contra sistemes i restriccions diferents. L'equip de Heym ofereix consultoria per ajudar-vos a:

- Avaluar si Heym s'adapta al vostre cas d'ús específic
- Dissenyar arquitectures d'agents i workflows d'extrem a extrem
- Planificar integracions amb la vostra infraestructura existent i serveis de tercers
- Depurar workflows complexos i resoldre incidències en producció
- Migrar workflows existents des d'eines com n8n, Zapier o Make.com

## Contacte

Podeu contactar amb l'equip enterprise a **enterprise@heym.run** per a consultes sobre llicències, preus o per programar una trucada introductòria.
## Relacionat

- [Execució i desplegament](../getting-started/running-and-deployment.md) — Desplegament en producció amb Docker Compose
- [Seguretat](./security.md) — Pràctiques i configuració de seguretat de la plataforma
- [Execució en paral·lel](./parallel-execution.md) — Model d'execució multi-worker
- [Equips](./teams.md) — Col·laboració en equip i compartició de recursos
- [Conjunt complet de funcionalitats](./features.md) — Visió general completa de les capacitats de Heym
- [Heym Work](./heym-work.md): la interfície per a equips de negoci i com connectar-la
