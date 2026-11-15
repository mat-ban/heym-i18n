# Heym Incident Playbook (L0)

Gebruik dit playbook om een Heym-incident te bevestigen, de impact op gebruikers te beoordelen, een prioriteit te kiezen en de juiste herstelprocedure en verantwoordelijke te bereiken.

Gedetailleerde procedures: [Heym Runbook (L1)](./operations-runbook.md)

Laatst beoordeeld: 2026-11-10. Reikwijdte: self-hosted Heym, enkele instantie of cluster, op Docker Compose of Kubernetes.

## Overdracht van implementatie (Handover)

Vul deze tabel in voor elke omgeving voordat u deze documenten tijdens de wachtdienst (on-call) gebruikt. Namen, URL's, capaciteitsdoelen en hersteldoelstellingen zijn specifiek voor de implementatie. Repository-voorbeelden vormen geen productie-inventaris.

| Item | Waarde in implementatie |
| --- | --- |
| Omgeving en openbare Heym-URL | `<environment>`, `<public-url>` |
| Platform-wachtdienst en back-up | `<rotation-or-contact>`, `<backup-contact>` |
| Incidentkanaal en incident-tracker | `<channel>`, `<tracker-url>` |
| Database-wachtdienst en database-identificatie | `<contact>`, `<database-id>` |
| Eigenaren voor infrastructuur, netwerk en opslag | `<contacts>` |
| Release-eigenaar en implementatiesysteem | `<contact>`, `<deployment-url>` |
| Dashboard voor applicatiefouten, latentie en beschikbaarheid | `<dashboard-url>` |
| Dashboard voor host- of pod-CPU, geheugen, schijf en herstarts | `<dashboard-url>` |
| Dashboard voor PostgreSQL-verbindingen, vergrendelingen, schijf en replicatie | `<dashboard-url>` |
| Logboeken en optionele OTel-trace-backend | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose-project/bestanden of Kubernetes-context/namespace | `<exact-target>` |
| Locaties van main, workers, database en opslag | `<services-or-deployments>`, `<storage-ids>` |
| Goedgekeurde smoke-workflow en verwacht resultaat | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Back-upprocedure voor database en bestanden, laatste hersteltest | `<procedure-url>`, `<test-date>` |
| Doelstellingen voor hersteltijd (RTO) en herstelpunt (RPO) | `<RTO>`, `<RPO>` |

Bewaar contactpersonen en dashboardkoppelingen in het afgeschermde operationele exemplaar van de implementatie. Bewijsmateriaal moet ID's, tijdstempels, tellingen en gezuiverde fouten bevatten in plaats van credentials of workflow-payloads.

## Platform-inventaris

| Component | Verantwoordelijkheid | Implicatie bij incident |
| --- | --- | --- |
| Frontend en main-backend | UI, API, MCP, Portal, interactieve uitvoering | Controleer de openbare route en het hoofdproces afzonderlijk |
| PostgreSQL | Applicatiestatus, uitvoeringsregister, run-wachtrij, concurrency-slots, coördinatie en meldingen | Een database-uitval kan zowel de verwerking van verzoeken als de uitvoering op de achtergrond stoppen |
| Worker-instanties, wanneer clustermodus is ingeschakeld | Geschikte achtergronduitvoeringen in de wachtrij | Gezonde workers vervangen de openbare endpoints van main niet |
| Gekozen leader-proces | Cron, evaluatie van waarschuwingen, achtergrondcoördinatie | Een compatibele worker kan leader worden; dit verandert zijn rol niet in main |
| Permanente opslag van main | Drive-bestanden, geïnstalleerde plugins en werkruimten van code-agents | Herstel de opslag samen met main; ingress routeren naar een worker herstelt deze niet |
| Sandbox-backend op elke uitvoerende instantie | Docker-containers of Kubernetes-pods voor geïsoleerde uitvoering | Een defecte sandbox-backend kan specifieke nodes beïnvloeden terwijl de UI blijft werken |
| Workflow-afhankelijkheden | Model-providers, MCP-servers, externe API's, gegevensopslag en berichtendiensten | Bepaal of één afhankelijkheid dan wel het hele platform faalt |
| Optionele OTel-collector | Geëxporteerde workflow-, node- en Agent-tool-spans | Het ontbreken van geëxporteerde traces alleen bewijst niet dat de uitvoering is mislukt |

Heym's ingebouwde run-wachtrij gebruikt PostgreSQL. Redis, RabbitMQ en vector stores kunnen workflow-afhankelijkheden zijn; het zijn geen verplichte services voor de ingebouwde wachtrij.

`GET /api/health` rapporteert uitsluitend processtatus en versie. Het test PostgreSQL, de wachtrij, leader-verkiezing, sandbox-capaciteit of credential-synchronisatie niet. Een groen antwoord is een momentopname, geen garantie voor end-to-end gereedheid.

## Eerste vijf minuten

| Stap | Actie | Beslissing of bewijsmateriaal |
| --- | --- | --- |
| 1 | Bevestig de waarschuwing en controleer omgeving, service en starttijd | Noteer UTC-tijdstempels en de meest recente release-/configuratiewijziging |
| 2 | Controleer de openbare UI en `/api/health`, daarna de directe main-backend | Openbare fout met een gezonde directe backend duidt op routing- of frontend-problemen |
| 3 | Controleer PostgreSQL-connectiviteit en verbindingsdruk | Stuur databasefouten door naar L1 voordat u applicatieservices herstart |
| 4 | Controleer container-/pod-status, CPU, geheugen, opslag en recente fouten | Maak onderscheid tussen infrastructuurfouten, belasting en workflow-specifieke fouten |
| 5 | Controleer in clustermodus **Instellingen > Instanties**, wachtrijstatussen en leader-bewijs | Identificeer uitval van main, offline/incompatibele workers of taken die aan main zijn gebonden |
| 6 | Wijs een prioriteit toe en start één maatregel uit de routeringstabel | Open voor P1/P2 direct een incident en betrek onmiddellijk de relevante eigenaar |
| 7 | Verifieer een veilige workflow-run in productiemodus en observeer het herstel | Bevestig dat wachtrijleeftijd, fouten en bronnen verbeteren; stel het volgende updatetijdstip vast |

Als een release samenvalt met de storing, inspecteer dan [Foutieve implementatie of configuratieregressie](./operations-runbook.md#bad-deployment-or-configuration-regression). Controleer schemacompatibiliteit vóór een rollback.

## Prioriteit en respons

Dit zijn initiële responstargets. Hanteer het incidentbeleid en de bedrijfsimpact van de implementatie als deze strenger zijn.

| Prioriteit | Voorbeelden | Respons |
| --- | --- | --- |
| P1 | Main niet beschikbaar voor alle gebruikers; database niet beschikbaar of schrijfopdrachten mislukken; wijdverbreide uitvoeringsfouten; kritieke invoer niet beschikbaar over workflows heen | Onmiddellijke mitigatie, incidentdossier, platform- en afhankelijkheidswachtdienst |
| P2 | Groeiende wachtrijachterstand; verlies van worker-capaciteit; uitputting van verbindingen dreigt; één workflow degradeert gedeelde capaciteit; herhaalde OOM-fouten | Start direct met mitigatie, streef naar indamming binnen 15 minuten, incidentdossier |
| P3 | Geïsoleerde workflow- of providerstoring; beperkte impact met gezonde platformcapaciteit | Workflow- of componentverantwoordelijke, geregistreerde follow-up en aantekening voor wachtdienst |
| P4 | Informatief signaal, verwachte capaciteitstrend, geverifieerde fout-positieve melding | Bevestigen, documenteren en monitoring zo nodig bijstellen |

## Routering van signalen naar L1

Gebruik deze relatieve ankers bij het configureren van waarschuwingskoppelingen. Waar een monitoringservice een absolute URL vereist, plaatst u de locatie van uw gehoste operationele kopie vooraan.

| Signaal | Begin hier |
| --- | --- |
| UI/API niet beschikbaar, openbare 5xx-fouten, processtatus mislukt | [UI of API niet beschikbaar](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL onbereikbaar, verbinding geweigerd, schrijffout | [Database niet beschikbaar](./operations-runbook.md#postgresql-down-or-not-writable) |
| Te veel clients, pool-time-out, wachtrij op vergrendelingen, piek in actieve verbindingen | [Databaseverbindingen en vergrendelingen](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Gecontroleerde herstart van backend/worker vereist | [Service-herstart](./operations-runbook.md#controlled-service-restart) |
| Piek in uitvoeringsaantal, totale duur, tokens, CPU of geheugen | [Meest bronverslindende workflows](./operations-runbook.md#most-resource-consuming-workflows) |
| Groeiende wachtrij, wachtende of schijnbaar vastgelopen runs | [Wachtrijachterstand](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instantie offline of incompatibel, worker inactief, scheduler- of distributieprobleem | [Clustermodus-controles](./operations-runbook.md#cluster-mode-checks) |
| Main verloren terwijl workers gezond blijven | [Main-instantie niet beschikbaar](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook-fouten, MCP/Portal-storingen, SSE-verbindingsverlies | [Ingress- en uitvoeringseindpunten](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, schijf vol, PersistentVolume-fout | [Container-, pod- of opslagprobleem](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Fouten bij Agent/LLM/MCP-provider, 429, credential-fout | [Model- of integratiefout](./operations-runbook.md#model-credential-or-integration-failure) |
| Sandbox-fouten bij Code, Playwright, skill of code-agent | [Sandbox-storing](./operations-runbook.md#sandbox-failure) |
| Herstel kan doelstellingen niet halen; database of bestanden verloren | [Herstel en rampenrespons](./operations-runbook.md#recovery-and-disaster-response) |

## Escalatie

| Bevinding | Betrekken | Aanleveren |
| --- | --- | --- |
| Meerdere interfaces of workflows getroffen | Platform-wachtdienst en incident lead | Omgeving, reikwijdte, starttijd, mitigatie, volgende update |
| Database niet beschikbaar, verzadigd, vergrendeld of schijf vol | Database-wachtdienst | Database-ID, aantal verbindingen, blokkerende PID's, gezuiverde fouten, opslagstatus |
| Pod-/node-fout, opslagkoppeling, sandbox-capaciteit | Infrastructuur-/opslageigenaar | Context, namespace, werklast, pod-events, bronnendruk |
| Openbare route faalt terwijl directe backend werkt | Netwerk-/ingress-eigenaar | Betroffen routes, statuscodes, latentie, backend-vergelijking |
| Eén workflow domineert de belasting of faalt geïsoleerd | Workflow-eigenaar | Workflow-/run-ID's, trigger-bron, frequentie, tijdvenster, tijdelijke limieten |
| Gecorreleerde implementatie- of configuratiewijziging | Release-eigenaar | Actieve image-digest, uitroltijd, schemarevisie, laatst bekende goede release |
| Provider-quotum, authenticatie of beschikbaarheid | Credential- of integratie-eigenaar | Provider, model/service, statuscode, aanvraag-ID indien veilig; geen geheime waarden |

Als de impact van P1/P2 aanhoudt na de eerste mitigatiemaatregel, escaleer dan direct met het reeds verzamelde bewijsmateriaal. Wacht niet op een volledige hoofdoorzaakanalyse.

## Verwacht gedrag bij uitval

| Storing | Wat kan doorgaan | Eerste actie |
| --- | --- | --- |
| PostgreSQL niet beschikbaar | Statische frontend kan nog steeds laden | Herstel het databasepad; herstart niet elke applicatie-instantie |
| Main niet beschikbaar, workers gezond | Geschikte achtergrondtaken en planning kunnen doorgaan als een compatibele worker de leiding heeft | Herstel main met de permanente opslag; openbare UI/API/MCP/Portal blijven niet beschikbaar |
| Worker niet beschikbaar | Andere geschikte instanties nemen taken in de wachtrij over zodra deze opnieuw worden toegewezen | Controleer plaatsing, reservecapaciteit en herstel voordat er weer verkeer wordt toegevoegd |
| Onderbroken run | Geschikte herstelbare runs kunnen eenmalig vanaf het begin opnieuw starten | Controleer automatisch herstel en externe neveneffecten vóór handmatig opnieuw afspelen |
| Overbelasting door taken die uitsluitend op main draaien | Workers kunnen inactief blijven | Verminder de veroorzakende invoer of verhoog de capaciteit van main; gewichtswijzigingen verplaatsen geen vastgezette taken |
| Interne alarmering niet beschikbaar | Externe uptime-/DB-/infrastructuurmonitoring kan blijven werken | Gebruik monitoring buiten Heym; Heym-meldingen zijn afhankelijk van dezelfde DB en scheduler |
| Sandbox of provider niet beschikbaar | Workflows zonder die afhankelijkheid kunnen blijven werken | Isoleer getroffen workflows en herstel de afhankelijkheid |

## Herstel en afsluiting van incident

1. Verifieer openbare toegang, databasetoegang, de beoogde geschiktheid van instanties en een veilige smoke-workflow in productiemodus. Een test in de editor bewijst geen worker-verzending.
2. Observeer ten minste 10 minuten stabiele fouten, latentie, brongebruik en een afnemende leeftijd van de wachtrij. Observeer ook het volgende verwachte kritieke schema of een afgesproken gelijkwaardige controle.
3. Stem mislukte, herstelde, overgeslagen, verlopen en openstaande runs af met workflow-eigenaren. Controleer externe neveneffecten voordat u iets opnieuw afspeelt.
4. Hef tijdelijke trigger-pauzes, limieten en worker-gewichten geleidelijk op. Geef elke resterende beperking een eigenaar en vervaltijd.
5. Werk het incident bij met impact, UTC-tijdlijn, acties, bewijsmateriaal en openstaande risico's. Wijs een evaluatie van de hoofdoorzaak toe voor P1/P2 en werk beide documenten bij als er een procedure ontbrak.

## Gerelateerde operationele documentatie

- [L1 commando-installatie en controles](./operations-runbook.md#command-setup)
- [Beheer en implementatie](../getting-started/running-and-deployment.md)
- [Lastverdeling](./cluster.md)
- [Kubernetes-implementatie](../getting-started/kubernetes.md)
- [Beveiliging en sleutelrotatie](./security.md)
