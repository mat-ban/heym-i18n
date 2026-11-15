# Heym Incident Playbook (L0)

Använd denna playbook för att bekräfta en Heym-incident, bedöma användarpåverkan, välja allvarlighetsgrad (severity) samt nå rätt återställningsprocedur och ansvarig ägare.

Detaljerade procedurer: [Heym Runbook (L1)](./operations-runbook.md)

Senast granskad: 2026-11-10. Omfattning: självhostad Heym, enskild instans eller cluster, på Docker Compose eller Kubernetes.

## Överlämning av distribution (Deployment handover)

Fyll i denna tabell för varje miljö innan dessa dokument används i beredskap (on-call). Namn, URL:er, kapacitetsmål och återställningsmål är distributionsspecifika. Exemplen i databasen utgör inte ett produktionsinventarium.

| Parameter | Värde i distributionen |
| --- | --- |
| Miljö och publik Heym-URL | `<environment>`, `<public-url>` |
| Plattformens beredskapsansvarig och ersättare | `<rotation-or-contact>`, `<backup-contact>` |
| Incidentkanal och incidenthanteringssystem | `<channel>`, `<tracker-url>` |
| Databasens beredskapsansvarig och databasidentifierare | `<contact>`, `<database-id>` |
| Ägare för infrastruktur, nätverk och lagring | `<contacts>` |
| Releaseansvarig och distributionssystem | `<contact>`, `<deployment-url>` |
| Instrumentpanel för applikationsfel, latens och tillgänglighet | `<dashboard-url>` |
| Instrumentpanel för värd- eller pod-CPU, minne, disk och omstarter | `<dashboard-url>` |
| Instrumentpanel för PostgreSQL-anslutningar, lås, disk och replikering | `<dashboard-url>` |
| Loggar och valfritt OTel-spårningsbackend | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose-projekt/filer eller Kubernetes-kontext/namespace | `<exact-target>` |
| Platser för main, workers, databas och lagring | `<services-or-deployments>`, `<storage-ids>` |
| Godkänt test-workflow (smoke) och förväntat resultat | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Säkerhetskopieringsprocedur för databas och filer, senaste återställningstest | `<procedure-url>`, `<test-date>` |
| Mål för återställningstid (RTO) och återställningspunkt (RPO) | `<RTO>`, `<RPO>` |

Förvara kontakter och instrumentpanellänkar i distributionens skyddade driftskopia. Bevis ska innehålla ID:n, tidsstämplar, räknare och rensade felmeddelanden snarare än credentials eller workflow-payloads.

## Plattformsförteckning

| Komponent | Ansvar | Påverkan vid incident |
| --- | --- | --- |
| Frontend och huvudbackend (main) | UI, API, MCP, Portal, interaktiv exekvering | Kontrollera den publika rutten och huvudprocessen separat |
| PostgreSQL | Applikationstillstånd, körningsregister, arbetskör, samtidighetsslots, samordning och aviseringar | Ett databasavbrott kan stoppa både begäranshantering och bakgrundskörningar |
| Worker-instanser, när cluster-läge är aktiverat | Berättigade bakgrundskörningar i kön | Friska workers ersätter inte main-instansens publika endpoints |
| Vald ledarprocess (leader) | Cron, larmutvärdering, bakgrundssamordning | En kompatibel worker kan bli ledare; detta ändrar inte dess roll till main |
| Main-instansens beständiga lagring | Drive-filer, installerade insticksprogram och kodningsagenters arbetsytor | Återställ lagringen tillsammans med main; att dirigera ingress till en worker återställer den inte |
| Sandbox-backend på varje exekverande instans | Docker-containrar eller Kubernetes-poddar för isolerad exekvering | En felande sandbox-backend kan påverka valda noder medan UI fungerar |
| Beroenden för workflow | Modell-leverantörer, MCP-servrar, externa API:er, datalager och meddelandetjänster | Fastställ om ett enskilt beroende eller hela plattformen fallerar |
| Valfri OTel-insamlare | Exporterade spann för workflow, noder och Agent-verktyg | Att exporterade spår saknas bevisar i sig inte att en körning misslyckats |

Heyms inbyggda körkö använder PostgreSQL. Redis, RabbitMQ och vektorlager kan vara beroenden för workflows; de är inte obligatoriska tjänster för den inbyggda kön.

`GET /api/health` rapporterar endast processtillstånd och version. Den testar inte PostgreSQL, kön, ledarval, sandbox-kapacitet eller synkronisering av credentials. Ett positivt svar är en enskild kontroll, inte en garanti för fullständig driftsberedskap.

## Första fem minuterna

| Steg | Åtgärd | Beslut eller bevis |
| --- | --- | --- |
| 1 | Bekräfta larmet och verifiera miljö, tjänst och starttid | Registrera UTC-tidsstämplar och den senaste release-/konfigurationsändringen |
| 2 | Kontrollera publikt UI och `/api/health`, därefter den direkta main-backenden | Publikt fel med en frisk direkt backend tyder på dirigerings- eller frontend-problem |
| 3 | Kontrollera PostgreSQL-anslutning och anslutningsbelastning | Dirigera databasfel till L1 innan applikationstjänster startas om |
| 4 | Kontrollera container-/pod-tillstånd, CPU, minne, lagring och nyligen inträffade fel | Skilj mellan infrastrukturfel, överbelastning och workflow-specifika fel |
| 5 | I cluster-läge, kontrollera **Inställningar > Instanser**, köstatus och ledarbevis | Identifiera förlust av main, offline/inkompatibla workers eller main-låsta arbeten |
| 6 | Tilldela allvarlighetsgrad och påbörja en åtgärd från dirigeringstabellen | För P1/P2, öppna omedelbart en incident och involvera relevant ägare |
| 7 | Verifiera en säker workflow-körning i produktionsläge och observera återhämtningen | Bekräfta att köns ålder, fel och resursanvändning förbättras; fastställ tid för nästa uppdatering |

Om en release sammanfaller med felet, undersök [Felaktig distribution eller konfigurationsregression](./operations-runbook.md#bad-deployment-or-configuration-regression). Kontrollera schemakompatibilitet före tillbakarullning (rollback).

## Allvarlighetsgrad och respons

Dessa är inledande responssmål. Tillämpa distributionens incidentpolicy och affärspåverkan om de är striktare.

| Allvarlighetsgrad | Exempel | Respons |
| --- | --- | --- |
| P1 | Main otillgänglig för alla användare; databas otillgänglig eller skrivningar misslyckas; utbredda exekveringsfel; kritiskt intag otillgängligt i alla workflows | Omedelbar begränsning, incidentrapport, plattforms- och beroendeberedskap |
| P2 | Växande eftersläpning i kön; förlorad worker-kapacitet; hotande anslutningsbrist; ett workflow försämrar delad kapacitet; upprepade OOM-krascher | Påbörja åtgärder omedelbart, mål för inneslutning inom 15 minuter, incidentrapport |
| P3 | Isolerat fel i workflow eller hos leverantör; begränsad påverkan med bevarad plattformskapacitet | Ägare för workflow eller komponent, spårad uppföljning och beredskapsnotering |
| P4 | Informationssignal, förväntad kapacitetstrend, bekräftat falsklarm | Bekräfta, dokumentera och justera övervakningen vid behov |

## Dirigering av signaler till L1

Använd dessa relativa ankare när larm-länkar konfigureras. Om en övervakningstjänst kräver en absolut URL, lägg till platsen för din driftskopia som prefix.

| Signal | Börja här |
| --- | --- |
| UI/API otillgängligt, publika 5xx-fel, fel vid hälsokontroll av process | [UI eller API nere](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL kan inte nås, anslutning nekad, skrivfel | [Databas nere](./operations-runbook.md#postgresql-down-or-not-writable) |
| För många klienter, pool-timeout, låsväntetider, topp i aktiva anslutningar | [Databasanslutningar och lås](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Kontrollerad omstart av backend/workers krävs | [Tjänsteomstart](./operations-runbook.md#controlled-service-restart) |
| Topp i körningsantal, total varaktighet, tokens, CPU eller minne | [De mest resurskrävande arbetsflödena](./operations-runbook.md#most-resource-consuming-workflows) |
| Växande kö, körningar som väntar eller verkar ha fastnat | [Köeftersläpning (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instans offline eller inkompatibel, inaktiv worker, schemaläggnings- eller distributionsproblem | [Kontroller av cluster-läge](./operations-runbook.md#cluster-mode-checks) |
| Main förlorad medan workers förblir friska | [Main-instans otillgänglig](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook-fel, MCP/Portal-avbrott, avbruten SSE-strömning | [Endpoints för ingress och exekvering](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, full disk, fel på Persistent Volume | [Problem med container, pod eller lagring](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Fel hos Agent/LLM/MCP-leverantör, kod 429, fel på credentials | [Modell- eller integrationsfel](./operations-runbook.md#model-credential-or-integration-failure) |
| Sandbox-fel för Code, Playwright, skill eller kodningsagent | [Sandbox-fel](./operations-runbook.md#sandbox-failure) |
| Återställning kan inte nå målen; databas eller filer förlorade | [Återställning och katastrofhantering](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalering

| Iakttagelse | Involvera | Tillhandahåll |
| --- | --- | --- |
| Flera gränssnitt eller workflows påverkas | Plattformsberedskap och incidentledare | Miljö, omfattning, starttid, begränsningsåtgärder, nästa uppdatering |
| Databas otillgänglig, mättad, låst eller slut på diskutrymme | Databasberedskap | Databas-ID, antal anslutningar, blockerande PID:er, rensade fel, lagringsstatus |
| Pod-/nodfel, lagringsanslutning, sandbox-kapacitet | Infrastruktur-/lagringsägare | Kontext, namespace, arbetsbelastning, pod-händelser, resurstryck |
| Publik rutt fallerar medan direkt backend fungerar | Nätverks-/ingressägare | Påverkade rutter, statuskoder, latens, jämförelse med backend |
| Ett enskilt workflow dominerar belastningen eller fallerar isolerat | Workflow-ägare | Workflow-/körnings-ID:n, trigger-källa, frekvens, tidsfönster, tillfälliga gränser |
| Korrelerad distributions- eller konfigurationsändring | Releaseansvarig | Digest för aktiv image, distributionstid, schemarevision, senaste kända fungerande version |
| Leverantörskvot, autentisering eller tillgänglighet | Credential- eller integrationsansvarig | Leverantör, modell/tjänst, statuskod, förfrågnings-ID om säkert; inga hemliga värden |

Om P1/P2-påverkan kvarstår efter den första åtgärden, eskalera omedelbart med de bevis som redan samlats in. Vänta inte på en fullständig grundorsaksanalys.

## Förväntat beteende vid fel

| Fel | Vad som kan fortsätta | Första åtgärd |
| --- | --- | --- |
| PostgreSQL otillgänglig | Statisk frontend kan fortfarande laddas | Återställ databassökvägen; starta inte om varje applikationsinstans |
| Main otillgänglig, workers friska | Berättigat bakgrundsarbete och schemaläggning kan fortsätta om en kompatibel worker leder | Återställ main med dess beständiga lagring; publika UI/API/MCP/Portal förblir otillgängliga |
| Worker otillgänglig | Andra berättigade instanser tar över köade uppgifter när de omfördelas | Kontrollera placering, reservkapacitet och återhämtning innan trafik återinförs |
| Avbruten körning | Berättigade återställningsbara körningar kan starta om från början, en gång | Kontrollera automatisk återställning och externa sidoeffekter före manuell omkörning |
| Överbelastning av main-exklusiva arbetslaster | Workers kan förbli inaktiva | Minska det felande intaget eller öka main-kapaciteten; viktändringar flyttar inte låsta arbeten |
| Internt larmsystem otillgängligt | Extern övervakning av drifttid/databas/infrastruktur kan fortsätta fungera | Använd övervakning utanför Heym; Heym-larm är beroende av samma databas och schemaläggare |
| Sandbox eller leverantör otillgänglig | Workflows utan detta beroende kan fungera | Isolera påverkade workflows och reparera beroendet |

## Återställning och incidentavslut

1. Verifiera publik åtkomst, databasåtkomst, avsedd instansbehörighet och ett säkert produktions-workflow (smoke). Ett test i redigeraren bevisar inte vidarebefordran till workers.
2. Observera minst 10 minuters stabila felnivåer, latens, resursanvändning och minskande ålder i kön. Observera även nästa förväntade kritiska schemalagda körning eller en överenskommen likvärdig kontroll.
3. Stäm av misslyckade, återställda, överhoppade, utgångna och väntande körningar med workflow-ägarna. Kontrollera externa sidoeffekter innan några operationer körs på nytt.
4. Återställ gradvis tillfälliga trigger-pauser, gränser och worker-vikter. Tilldela en ansvarig och ett utgångsdatum för varje kvarvarande begränsning.
5. Uppdatera incidenten med påverkan, UTC-tidslinje, åtgärder, bevis och kvarstående risker. Tilldela en grundorsaksanalys (post-mortem) för P1/P2 och uppdatera båda dokumenten om en procedur saknades.

## Relaterade driftsreferenser

- [L1-kommandokonfiguration och kontroller](./operations-runbook.md#command-setup)
- [Drift och distribution](../getting-started/running-and-deployment.md)
- [Lastfördelning](./cluster.md)
- [Kubernetes-distribution](../getting-started/kubernetes.md)
- [Säkerhet och nyckelrotation](./security.md)
