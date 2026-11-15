# Heym Incident Playbook (L0)

Utilitzeu aquest playbook per a confirmar un incident de Heym, avaluar l'impacte en els usuaris, determinar la gravetat i accedir al procediment de recuperació i al responsable adequats.

Procediments detallats: [Heym Runbook (L1)](./operations-runbook.md)

Darrera revisió: 2026-11-10. Àmbit: Heym autoallotjat, instància única o clúster, a Docker Compose o Kubernetes.

## Traspàs del desplegament (Handover)

Empleneu aquesta taula per a cada entorn abans d'utilitzar aquests documents durant les guàrdies (on-call). Els noms, les URL, els objectius de capacitat i els objectius de recuperació són específics de cada desplegament. Els exemples del repositori no constitueixen un inventari de producció.

| Element | Valor del desplegament |
| --- | --- |
| Entorn i URL pública de Heym | `<environment>`, `<public-url>` |
| Guàrdia de plataforma i suplent | `<rotation-or-contact>`, `<backup-contact>` |
| Canal de l'incident i gestor d'incidents | `<channel>`, `<tracker-url>` |
| Guàrdia de base de dades i identificador de base de dades | `<contact>`, `<database-id>` |
| Responsables d'infraestructura, xarxes i emmagatzematge | `<contacts>` |
| Responsable de release i sistema de desplegament | `<contact>`, `<deployment-url>` |
| Tauler d'errors de l'aplicació, latència i disponibilitat | `<dashboard-url>` |
| Tauler de CPU, memòria, disc i reinicis de l'amfitrió o pod | `<dashboard-url>` |
| Tauler de connexions, bloquejos, disc i replicació de PostgreSQL | `<dashboard-url>` |
| Registres i backend de traces OTel opcional | `<logs-url>`, `<trace-url-or-disabled>` |
| Projecte/fitxers Compose o context/namespace de Kubernetes | `<exact-target>` |
| Ubicacions de main, workers, base de dades i emmagatzematge | `<services-or-deployments>`, `<storage-ids>` |
| Workflow de prova (smoke) aprovat i resultat esperat | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Procediment de còpia de seguretat de BD i fitxers, darrera prova de restauració | `<procedure-url>`, `<test-date>` |
| Objectius de temps de recuperació (RTO) i punt de recuperació (RPO) | `<RTO>`, `<RPO>` |

Conserveu els contactes i els enllaços als taulers a la còpia operativa restringida del desplegament. Les evidències han de contenir identificadors, marques de temps, recomptes i errors depurats en lloc de credentials o payloads de workflows.

## Inventari de la plataforma

| Component | Responsabilitat | Implicació en incidents |
| --- | --- | --- |
| Frontend i backend principal (main) | UI, API, MCP, Portal, execució interactiva | Verifiqueu la ruta pública i el procés principal per separat |
| PostgreSQL | Estat de l'aplicació, registre d'execucions, cua d'execucions, ranures de concurrència, coordinació i notificacions | Una caiguda de la base de dades pot aturar tant l'atenció de peticions com l'execució en segon pla |
| Instàncies worker, quan el mode clúster està actiu | Execucions en segon pla en cua elegibles | Els workers en bon estat no substitueixen els endpoints públics de la instància principal |
| Procés líder electe | Cron, avaluació d'alertes, coordinació en segon pla | Un worker compatible pot esdevenir líder; això no canvia el seu rol a main |
| Emmagatzematge persistent de main | Fitxers de Drive, plugins instal·lats i espais de treball d'agents de codi | Recupereu l'emmagatzematge juntament amb main; encaminar l'ingress cap a un worker no el recupera |
| Backend de sandbox a cada instància d'execució | Contenidors Docker o pods de Kubernetes per a execució aïllada | Una fallada al backend de sandbox pot afectar nodes concrets mentre la UI funciona |
| Dependències de workflows | Proveïdors de models, servidors MCP, API externes, magatzems de dades i serveis de missatgeria | Determineu si està fallant una dependència aïllada o tota la plataforma |
| Colector OTel opcional | Spans exportats de workflows, nodes i eines d'Agent | L'absència de traces exportades no demostra per si sola la fallada d'una execució |

La cua d'execucions integrada de Heym utilitza PostgreSQL. Redis, RabbitMQ i els magatzems vectorials poden ser dependències de workflows; no són serveis obligatoris per a la cua integrada.

`GET /api/health` informa exclusivament de l'estat de salut del procés i de la seva versió. No prova PostgreSQL, la cua, l'elecció de líder, la capacitat de les sandboxes ni la sincronització de credentials. Una resposta satisfactòria és una comprovació puntual, no una garantia de disponibilitat d'extrem a extrem.

## Primers cinc minuts

| Pas | Acció | Decisió o evidència |
| --- | --- | --- |
| 1 | Reconèixer l'alerta i verificar l'entorn, el servei i l'hora d'inici | Enregistrar marques de temps UTC i el canvi de release/configuració més recent |
| 2 | Comprovar la UI pública i `/api/health`, després el backend principal directe | Una fallada pública amb un backend directe en bon estat suggereix problemes d'encaminament o frontend |
| 3 | Verificar la connectivitat de PostgreSQL i la pressió de connexions | Encaminar les fallades de base de dades a L1 abans de reiniciar els serveis d'aplicació |
| 4 | Comprovar l'estat de contenidors/pods, CPU, memòria, emmagatzematge i errors recents | Separar fallades d'infraestructura, sobrecàrrega i fallades específiques de workflows |
| 5 | En mode clúster, comprovar **Configuració > Instàncies**, estats de cues i evidències de líder | Identificar caiguda de main, workers desconnectats/incompatibles o tasques exclusives de main |
| 6 | Assignar gravetat i iniciar una mitigació segons la taula d'encaminament | Per a P1/P2, obrir un incident i involucrar immediatament el responsable corresponent |
| 7 | Verificar l'execució d'un workflow segur en mode producció i supervisar la recuperació | Confirmar que milloren l'antiguitat de la cua, els errors i els recursos; fixar la propera actualització |

Si una release coincideix amb la fallada, inspeccioneu [Desplegament defectuós o regressió de configuració](./operations-runbook.md#bad-deployment-or-configuration-regression). Comproveu la compatibilitat de l'esquema abans de revertir.

## Gravetat i resposta

Aquests són objectius inicials de resposta. Apliqueu la política d'incidents i l'impacte comercial del desplegament quan siguin més estrictes.

| Gravetat | Exemples | Resposta |
| --- | --- | --- |
| P1 | Instància main no disponible per a tots els usuaris; base de dades no disponible o escriptures fallides; fallada generalitzada d'execucions; entrades crítiques no disponibles en múltiples workflows | Mitigació immediata, registre d'incident, guàrdia de plataforma i dependències |
| P2 | Cua creixent; pèrdua de capacitat de workers; esgotament imminent de connexions; un workflow degradant la capacitat compartida; reinicis repetits per OOM | Iniciar mitigació immediatament, objectiu de contenció en 15 minuts, registre d'incident |
| P3 | Fallada aïllada de workflow o proveïdor; impacte limitat amb capacitat general de plataforma en bon estat | Responsable de workflow o component, seguiment registrat i nota de guàrdia |
| P4 | Senyal informatiu, tendència esperada de capacitat, fals positiu verificat | Reconèixer, documentar i ajustar la monitorització si cal |

## Encaminament de senyals a L1

Utilitzeu aquestes àncores relatives en configurar els enllaços d'alerta. Quan un servei de monitorització requereixi una URL absoluta, anteposeu la ubicació de la vostra còpia operativa allotjada.

| Senyal | Comenceu aquí |
| --- | --- |
| UI/API no disponible, 5xx públics, fallada de salut del procés | [UI o API caigudes](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL inabastable, connexió rebutjada, fallada d'escriptura | [Base de dades caiguda](./operations-runbook.md#postgresql-down-or-not-writable) |
| Massa clients, esgotament del pool, esperes de bloqueig, pic de connexions actives | [Connexions i bloquejos de base de dades](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Es requereix un reinici controlat de backend/workers | [Reinici de servei](./operations-runbook.md#controlled-service-restart) |
| Pic en recompte d'execucions, durada total, tokens, CPU o memòria | [Workflows amb més consum de recursos](./operations-runbook.md#most-resource-consuming-workflows) |
| Cua creixent, execucions en espera o aparentment encallades | [Retard a la cua (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instància desconnectada o incompatible, worker inactiu, problema de planificador o distribució | [Comprovacions del mode clúster](./operations-runbook.md#cluster-mode-checks) |
| Caiguda de main mentre els workers romanen en bon estat | [Instància principal no disponible](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Errors de Webhook, fallades de MCP/Portal, desconnexions de SSE | [Endpoints d'ingress i execució](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, disc ple, fallada de volums persistents | [Problema de contenidor, pod o emmagatzematge](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Errors de proveïdors d'Agent/LLM/MCP, 429, fallada de credentials | [Fallada de model o integració](./operations-runbook.md#model-credential-or-integration-failure) |
| Fallades en sandboxes de Code/Playwright/skill/agent de codi | [Fallada de sandbox](./operations-runbook.md#sandbox-failure) |
| La recuperació no compleix els objectius; pèrdua de base de dades o fitxers | [Recuperació i resposta davant desastres](./operations-runbook.md#recovery-and-disaster-response) |

## Escalat

| Constatació | Convocar | Proporcionar |
| --- | --- | --- |
| Múltiples interfícies o workflows afectats | Guàrdia de plataforma i líder de l'incident | Entorn, abast, hora d'inici, mitigació, propera actualització |
| Base de dades no disponible, saturada, bloquejada o sense espai en disc | Guàrdia de base de dades | ID de BD, recomptes de connexions, PID bloquejadors, errors depurats, estat de l'emmagatzematge |
| Fallada de pod/node, vinculació d'emmagatzematge, capacitat de sandbox | Responsable d'infraestructura/emmagatzematge | Context, namespace, càrrega de treball, esdeveniments de pod, pressió de recursos |
| La ruta pública falla mentre el backend directe funciona | Responsable de xarxa/ingress | Rutes afectades, codis d'estat, latència, comparació amb backend |
| Un únic workflow domina la càrrega o falla aïlladament | Propietari del workflow | ID de workflow/execució, origen del trigger, taxa, finestra de temps, límits temporals |
| Canvi de desplegament o configuració correlacionat | Responsable de release | Digest de la imatge en execució, hora de desplegament, revisió d'esquema, darrera versió correcta |
| Quota, autenticació o disponibilitat del proveïdor | Responsable de credential o integració | Proveïdor, model/servei, codi d'estat, ID de petició si és segur; cap valor secret |

Si l'impacte de nivell P1/P2 persisteix després de la primera mitigació, escaleu immediatament amb les evidències ja recopilades. No espereu a disposar de l'anàlisi de causa arrel complet.

## Comportament esperat en fallades

| Fallada | Què pot continuar | Primera acció |
| --- | --- | --- |
| PostgreSQL no disponible | El frontend estàtic encara pot carregar | Restaurar la ruta a la base de dades; no reiniciar cada instància de l'aplicació |
| Main no disponible, workers sans | El treball en segon pla elegible i la programació poden continuar si lidera un worker compatible | Restaurar main amb el seu emmagatzematge persistent; UI/API/MCP/Portal públics continuen no disponibles |
| Worker no disponible | Altres instàncies elegibles assumeixen el treball en cua a mesura que es reassigna | Verificar ubicació, capacitat de reserva i recuperació abans d'afegir trànsit |
| Execució interrompuda | Les execucions recuperables elegibles poden reiniciar-se des de l'inici, un sol cop | Comprovar la recuperació automàtica i els efectes secundaris externs abans de repetir manualment |
| Sobrecàrrega de treball exclusiu de main | Els workers poden romandre inactius | Reduir l'entrada conflictiva o augmentar la capacitat de main; els canvis de pes no traslladen treball fixat |
| Alertes internes no disponibles | La monitorització externa de disponibilitat/BD/infraestructura pot continuar funcionant | Utilitzar monitorització externa a Heym; les alertes de Heym depenen de la mateixa BD i planificador |
| Sandbox o proveïdor no disponible | Els workflows sense aquesta dependència poden funcionar | Aïllar els workflows afectats i reparar la dependència |

## Recuperació i tancament de l'incident

1. Verifiqueu l'accés públic, l'accés a la base de dades, l'elegibilitat prevista de les instàncies i un workflow de prova (smoke) segur en mode producció. Una prova a l'editor no demostra el despatx a workers.
2. Observeu almenys 10 minuts d'errors estables, latència controlada, ús de recursos i disminució de l'antiguitat de la cua. Observeu també la següent programació crítica esperada o una comprovació equivalent acordada.
3. Reconcilieu les execucions fallides, recuperades, omeses, expirades i pendents amb els propietaris dels workflows. Comproveu els efectes secundaris externs abans de repetir qualsevol acció.
4. Restaureu gradualment les pauses temporals de triggers, els límits i les ponderacions de workers. Assigneu un responsable i una data d'expiració a cada restricció romanent.
5. Actualitzeu l'incident amb l'impacte, la cronologia UTC, les accions, les evidències i els riscos pendents. Assigneu una revisió de causa arrel per a P1/P2 i actualitzeu ambdós documents si faltava algun procediment.

## Referències operatives relacionades

- [Configuració de comandes i comprovacions L1](./operations-runbook.md#command-setup)
- [Execució i desplegament](../getting-started/running-and-deployment.md)
- [Distribució de càrrega](./cluster.md)
- [Desplegament a Kubernetes](../getting-started/kubernetes.md)
- [Seguretat i rotació de claus](./security.md)
