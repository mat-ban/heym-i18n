# Heym Incident Playbook (L0)

Brug denne playbook til at bekræfte en Heym-hændelse, vurdere brugerpåvirkningen, vælge alvorsgrad (severity) samt nå frem til den rette genopretningsprocedure og ansvarlige ejer.

Detaljerede procedurer: [Heym Runbook (L1)](./operations-runbook.md)

Sidst gennemgået: 2026-11-10. Omfang: selvhostet Heym, enkeltinstans eller cluster, på Docker Compose eller Kubernetes.

## Overdragelse af udrulning (Deployment handover)

Udfyld denne tabel for hvert miljø før disse dokumenter anvendes under tilkaldevagt (on-call). Navne, URL'er, kapacitetsmål og genopretningsmål er specifikke for den enkelte udrulning. Eksemplerne i arkivet udgør ikke en produktionsbeholdning.

| Element | Værdi i udrulningen |
| --- | --- |
| Miljø og offentlig Heym-URL | `<environment>`, `<public-url>` |
| Platforms-vagthavende og stedfortræder | `<rotation-or-contact>`, `<backup-contact>` |
| Hændelseskanal og hændelsessporing | `<channel>`, `<tracker-url>` |
| Database-vagthavende og database-identifikator | `<contact>`, `<database-id>` |
| Ejere for infrastruktur, netværk og lagring | `<contacts>` |
| Releaseansvarlig og udrulningssystem | `<contact>`, `<deployment-url>` |
| Dashboard for applikationsfejl, latenstid og tilgængelighed | `<dashboard-url>` |
| Dashboard for vært- eller pod-CPU, hukommelse, disk og genstarter | `<dashboard-url>` |
| Dashboard for PostgreSQL-forbindelser, låse, disk og replikering | `<dashboard-url>` |
| Logfiler og valgfri OTel-sporingsbackend | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose-projekt/filer eller Kubernetes-kontekst/namespace | `<exact-target>` |
| Placeringer for main, workers, database og lagring | `<services-or-deployments>`, `<storage-ids>` |
| Godkendt test-workflow (smoke) og forventet resultat | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Sikkerhedskopieringsprocedure for database og filer, seneste gendannelsestest | `<procedure-url>`, `<test-date>` |
| Mål for genopretningstid (RTO) og genopretningspunkt (RPO) | `<RTO>`, `<RPO>` |

Opbevar kontakter og dashboardlinks i udrulningens begrænsede driftskopi. Beviser bør indeholde identifikatorer, tidsstempler, tællere og rensede fejl i stedet for credentials eller workflow-payloads.

## Platformsfortegnelse

| Komponent | Ansvar | Betydning ved hændelse |
| --- | --- | --- |
| Frontend og hovedbackend (main) | UI, API, MCP, Portal, interaktiv eksekvering | Kontroller den offentlige rute og hovedprocessen separat |
| PostgreSQL | Applikationstilstand, eksekveringsregister, kørselsskø, samtidighedsslots, koordinering og meddelelser | Et databasenedbrud kan standse både anmodningshåndtering og baggrundskørsel |
| Worker-instanser, når cluster-tilstand er aktiveret | Kvalificerede baggrundskørsler i køen | Raske workers erstatter ikke main-instansens offentlige endpoints |
| Valgt lederproces (leader) | Cron, evaluering af advarsler, baggrundskoordinering | En kompatibel worker kan blive leder; dette ændrer ikke dens rolle til main |
| Main-instansens permanente lagring | Drive-filer, installerede plugins og kodningsagenters arbejdsområder | Gendan lagringen sammen med main; dirigering af ingress til en worker gendanner den ikke |
| Sandbox-backend på hver eksekverende instans | Docker-containere eller Kubernetes-pods til isoleret eksekvering | En fejlbehæftet sandbox-backend kan påvirke udvalgte noder, mens UI fungerer |
| Workflow-afhængigheder | Modelleverandører, MCP-servere, eksterne API'er, datalagre og beskedtjenester | Fastslå om en enkelt afhængighed eller hele platformen svigter |
| Valgfri OTel-indsamler | Eksporterede spænd for workflow, noder og Agent-værktøjer | Manglende eksporterede spor beviser ikke i sig selv, at en kørsel mislykkedes |

Heyms indbyggede kørselsskø benytter PostgreSQL. Redis, RabbitMQ og vektorlagre kan være workflow-afhængigheder; de er ikke obligatoriske tjenester for den indbyggede kø.

`GET /api/health` rapporterer udelukkende procestilstand og version. Den tester ikke PostgreSQL, køen, ledervalg, sandbox-kapacitet eller synkronisering af credentials. Et positivt svar er et enkelt tjek, ikke en garanti for fuldstændig driftsberedskab.

## Første fem minutter

| Trin | Handling | Beslutning eller bevis |
| --- | --- | --- |
| 1 | Bekræft advarslen og verificer miljø, tjeneste og starttidspunkt | Registrer UTC-tidsstempler og den seneste release-/konfigurationsændring |
| 2 | Kontroller offentlig UI og `/api/health`, derefter den direkte main-backend | Offentlig fejl med en rask direkte backend peger på rute- eller frontend-problemer |
| 3 | Kontroller PostgreSQL-forbindelse og forbindelsesbelastning | Diriger databasefejl til L1 før genstart af applikationstjenester |
| 4 | Kontroller container-/pod-tilstand, CPU, hukommelse, lagring og nylige fejl | Adskil infrastrukturfejl, overbelastning og workflow-specifikke fejl |
| 5 | I cluster-tilstand kontrolleres **Indstillinger > Instanser**, køtilstande og lederbevis | Identificer tab af main, offline/inkompatible workers eller main-bundne opgaver |
| 6 | Tildel alvorsgrad og igangsæt en afbødende handling fra dirigeringstabellen | Ved P1/P2 åbnes straks en hændelse, og den relevante ejer involveres |
| 7 | Verificer en sikker workflow-kørsel i produktionsmodus og observer genopretningen | Bekræft at køalder, fejl og ressourcer forbedres; fastlæg tidspunkt for næste opdatering |

Hvis en release falder sammen med fejlen, undersøges [Fejlbehæftet udrulning eller konfigurationsregression](./operations-runbook.md#bad-deployment-or-configuration-regression). Kontroller schemakompatibilitet før tilbagerulning (rollback).

## Alvorsgrad og respons

Dette er indledende responssmål. Anvend udrulningens hændelsespolitik og forretningsmæssige påvirkning, hvis disse er strengere.

| Alvorsgrad | Eksempler | Respons |
| --- | --- | --- |
| P1 | Main utilgængelig for alle brugere; database utilgængelig eller skrivninger mislykkes; udbredt eksekveringsfejl; kritisk indtag utilgængeligt på tværs af workflows | Øjeblikkelig afbødning, hændelsesrapport, platforms- og afhængighedsvagt |
| P2 | Voksende køpukkel; tab af worker-kapacitet; faretruende forbindelsesudtømning; et workflow forringer delt kapacitet; gentagne OOM-nedbrud | Påbegynd afbødning straks, mål om inddæmning inden for 15 minutter, hændelsesrapport |
| P3 | Isoleret fejl i workflow eller hos leverandør; begrænset påvirkning med sund platforms-kapacitet | Ansvarlig for workflow eller komponent, sporet opfølgning og vagtnotat |
| P4 | Informationssignal, forventet kapacitetstendens, bekræftet falsk alarm | Tag til efterretning, dokumenter og tilpas overvågning om nødvendigt |

## Dirigering af signaler til L1

Brug disse relative ankre ved konfiguration af advarselslinks. Hvor en overvågningstjeneste kræver en absolut URL, indsættes placeringen af din driftskopi som præfiks.

| Signal | Start her |
| --- | --- |
| UI/API utilgængelig, offentlige 5xx-fejl, fejl ved procestilstandskontrol | [UI eller API nede](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL utilgængelig, forbindelse afvist, skrivefejl | [Database nede](./operations-runbook.md#postgresql-down-or-not-writable) |
| For mange klienter, pool-timeout, låseventetider, spidsbelastning i aktive forbindelser | [Databaseforbindelser og låse](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Kontrolleret genstart af backend eller workers påkrævet | [Tjenestegenstart](./operations-runbook.md#controlled-service-restart) |
| Spidsbelastning i kørselstal, samlet varighed, tokens, CPU eller hukommelse | [Mest ressourcekrævende workflows](./operations-runbook.md#most-resource-consuming-workflows) |
| Voksende kø, kørsler der venter eller tilsyneladende sidder fast | [Køpukkel (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instans offline eller inkompatibel, inaktiv worker, planlægnings- eller distributionsproblem | [Kontroller af cluster-tilstand](./operations-runbook.md#cluster-mode-checks) |
| Main tabt mens workers forbliver raske | [Main-instans utilgængelig](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook-fejl, MCP/Portal-nedbrud, afbrydelser i SSE-streaming | [Endpoints for ingress og eksekvering](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, fuld disk, fejl på Persistent Volume | [Problem med container, pod eller lagring](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Fejl hos Agent/LLM/MCP-leverandør, kode 429, fejl på credentials | [Model- eller integrationsfejl](./operations-runbook.md#model-credential-or-integration-failure) |
| Sandbox-fejl ved Code, Playwright, skill eller kodningsagent | [Sandbox-fejl](./operations-runbook.md#sandbox-failure) |
| Genopretning kan ikke nå målene; database eller filer tabt | [Genopretning og katastrofehåndtering](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalering

| Observation | Inddrag | Fremlæg |
| --- | --- | --- |
| Flere grænseflader eller workflows påvirket | Platformsvagt og hændelsesleder | Miljø, omfang, starttidspunkt, afbødende tiltag, næste opdatering |
| Database utilgængelig, mættet, låst eller tør for diskplads | Databasevagt | Database-ID, forbindelsestal, blokerende PID'er, rensede fejl, lagringstilstand |
| Pod-/nodefejl, lagringstilknytning, sandbox-kapacitet | Infrastruktur-/lagringsejer | Kontekst, namespace, arbejdsbelastning, pod-hændelser, ressourcepres |
| Offentlig rute fejler mens direkte backend fungerer | Netværks-/ingressejer | Berørte ruter, statuskoder, latenstid, sammenligning med backend |
| Et enkelt workflow dominerer belastningen eller fejler isoleret | Ejer af pågældende workflow | Workflow-/kørsels-ID'er, trigger-kilde, frekvens, tidsvindue, midlertidige grænser |
| Korreleret udrulnings- eller konfigurationsændring | Releaseansvarlig | Digest for aktivt image, udrulningstidspunkt, schemarevision, seneste gode version |
| Leverandørkvote, godkendelse eller tilgængelighed | Credential- eller integrationsansvarlig | Leverandør, model/tjeneste, statuskode, anmodnings-ID hvis sikkert; ingen hemmelige værdier |

Hvis påvirkning på P1/P2-niveau varer ved efter det første afbødende tiltag, eskaleres straks med de allerede indsamlede beviser. Afvent ikke en fuldstændig rodårsagsanalyse.

## Forventet adfærd ved fejl

| Fejl | Hvad der kan fortsætte | Første handling |
| --- | --- | --- |
| PostgreSQL utilgængelig | Statisk frontend kan stadig indlæses | Gendan databasestien; genstart ikke hver eneste applikationsinstans |
| Main utilgængelig, workers raske | Berettigede baggrundsopgaver og planlægning kan fortsætte, hvis en kompatibel worker fører an | Gendan main med dens permanente lagring; offentlige UI/API/MCP/Portal forbliver utilgængelige |
| Worker utilgængelig | Andre berettigede instanser overtager køede opgaver i takt med omfordeling | Kontroller placering, reservekapacitet og genopretning før trafik genindføres |
| Afbrudt kørsel | Berettigede genoprettelige kørsler kan genstarte fra begyndelsen, én enkelt gang | Kontroller automatisk genopretning og eksterne bivirkninger før manuel genkørsel |
| Overbelastning fra opgaver udelukkende til main | Workers kan forblive inaktive | Reducer det problematiske indtag eller forøg kapaciteten på main; vægtændringer flytter ikke fastlåst arbejde |
| Intern alarmering utilgængelig | Ekstern overvågning af oppetid/database/infrastruktur kan fortsat fungere | Benyt overvågning uden for Heym; Heym-advarsler afhænger af den samme database og planlægger |
| Sandbox eller leverantør utilgængelig | Workflows uden denne afhængighed kan fungere | Isoler berørte workflows og reparer afhængigheden |

## Genopretning og afslutning af hændelse

1. Verificer offentlig adgang, databaseadgang, tiltænkt instansberettigelse og et sikkert produktions-workflow (smoke). En test i editoren beviser ikke uddelegering til workers.
2. Observer mindst 10 minutters stabile fejlniveauer, latenstid, ressourceforbrug og aftagende køalder. Observer også den næste forventede kritiske kørsel eller en aftalt tilsvarende kontrol.
3. Afstem mislykkede, genoprettede, udeladte, udløbne og afventende kørsler med workflow-ejerne. Kontroller eksterne bivirkninger før genudførelse af operationer.
4. Ophæv gradvist midlertidige trigger-pauser, grænser og worker-vægtninger. Tildel en ejer og et udløbstidspunkt til hver resterende begrænsning.
5. Opdater hændelsen med påvirkning, UTC-tidslinje, handlinger, beviser og udestående risici. Tildel en rodårsagsanalyse (post-mortem) for P1/P2 og opdater begge dokumenter, hvis en procedure manglede.

## Relaterede driftsreferencer

- [L1-kommandokonfiguration og kontroller](./operations-runbook.md#command-setup)
- [Drift og udrulning](../getting-started/running-and-deployment.md)
- [Belastningsfordeling](./cluster.md)
- [Udrulning på Kubernetes](../getting-started/kubernetes.md)
- [Sikkerhed og nøglerotation](./security.md)
