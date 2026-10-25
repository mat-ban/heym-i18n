# Load Distribution

Wijs een tweede Heym-instantie aan dezelfde PostgreSQL-database toe en deze sluit aan als worker. Achtergrond-workflowuitvoeringen worden vervolgens tussen de instanties verdeeld op basis van een door u ingesteld percentage, zodat de machine die de UI en de API bedient niet tevens de enige machine is die elke workflow uitvoert.

De instanties communiceren nooit met elkaar. Postgres draagt het werk, dus een worker heeft geen open poort, geen certificaat en geen route terug naar de hoofdinstantie nodig — alleen databasetoegang.

## Rollen

Eén instantie is **main**, vastgelegd via een omgevingsvariabele. Deze bedient de UI, de API, MCP en het chatportaal, en is eigenaar van bestandsopslag en geïnstalleerde plugins. Elke andere instantie is een **worker**: deze bereikt alleen de database en voert achtergronduitvoeringen uit.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

De main-rol staat los van leader election. Heym kiest al één leader binnen het cluster voor cron, waarschuwingsevaluatie en crashherstel; als main uitvalt, verschuift het leiderschap binnen enkele seconden naar een worker en blijven geplande uitvoeringen starten. De main-rol verschuift niet, omdat bestandsopslag niet mee kan verhuizen.

## Wat de hoofdinstantie kan verlaten

De plaatsing wordt bepaald op basis van de nodes van de workflow voordat de uitvoering start. Een uitvoering blijft op main wanneer een node daarin — inclusief nodes binnen sub-workflows die deze aanroept — iets aanraakt dat slechts op één machine bestaat:

| Node | Waarom deze op main blijft |
|---|---|
| Codex, OpenCode Go | De coding-agent-workspace blijft op de lokale schijf staan, zodat een vervolgstap daarin kan hervatten |
| Agent met een gekoppelde skill | Skill-code leest en schrijft Heym Drive |
| Drive, Converter, Google Drive | Deze lezen en schrijven gegenereerde bestanden |
| File Upload-trigger | De upload komt terecht op de schijf van main |
| Send Email | Bedrijfsmatige SMTP-relays staan doorgaans slechts één bronadres toe |
| Plugin-nodes | Een plugin is geïnstalleerd op de schijf van één instantie |

**Al het overige wordt gedistribueerd** — inclusief de Code-node, Playwright en Agent Python-tools. Elke instantie draait dezelfde image met een eigen Docker-socket, dus een sandbox is geen reden om een uitvoering op main te houden, en dit zijn de meest CPU-intensieve nodes in het product.

Een workflow waarvan de sub-workflow via een expressie wordt gekozen, kan niet vooraf worden geïnspecteerd en blijft daarom op main.

## Percentages kiezen

Weights zijn gehele getallen die worden ingesteld onder **Settings → Instances**. Het zijn **aandelen van de instanties die op dat moment werk kunnen aannemen**, geen percentages van 100: de scheduler deelt door het eigen totaal van die pool.

Dat onderscheid wordt direct zichtbaar zodra één instantie wegvalt. Met `Main 41, Worker A 26, Worker B 33` blijft bij het uitschakelen van Worker B een pool van 67 over, dus Main ontvangt feitelijk 41/67 = **61%** en Worker A 26/67 = **39%**. Het paneel toont de effectieve verdeling onder de tabel precies om deze reden, en opslaan wordt nooit geblokkeerd omdat de getallen niet optellen tot 100 — alleen een verdeling waarin geen enkele ingeschakelde instantie een weight heeft, wordt geweigerd.

Twee andere zaken gaan gemakkelijk mis.

**Een percentage is geen aandeel in machinekracht.** Het dekt alleen uitvoeringen die via de wachtrij gaan. Het bedienen van de UI en de API, het streamen van editor- en portaal-uitvoeringen en het verwerken van bestandsuploads zijn allemaal werk van main en niets daarvan wordt meegeteld. Main doet meer dan het getal aangeeft.

**Het percentage van main is een plafond, geen ondergrens.** Uitvoeringen die alleen op main kunnen worden uitgevoerd, worden op het quotum van main afgeboekt, dus zodra dat quotum is verbruikt, vallen de resterende distribueerbare uitvoeringen toe aan de workers. Het getal van main laag instellen is veilig — werk dat daar moet draaien, draait daar nog steeds. Het hoog instellen laat de workers verhongeren.

Begin dus bij een sterke main en een kleinere worker eerder bij 60/40 dan bij de ruwe verhouding van de machines, en vergelijk vervolgens werkelijke uitvoeringsduren in het tabblad Traces en pas aan.

Weights worden gehernormaliseerd over de instanties die op dat moment live en ingeschakeld zijn. Met `main=70, A=15, B=15` wordt de verdeling bij het offline gaan van A 70/85 en 15/85 tussen main en B, en keert deze terug naar 70/15/15 wanneer A terugkomt.

**Een instantie die terugkomt, krijgt de gemiste uitvoeringen niet nabetaald.** Tijd die Offline, Disabled of op een afwijkende versie is doorgebracht, wordt niet tegen de instantie gerekend, dus een worker die een nacht niet beschikbaar was, sluit weer aan op de huidige positie van de pool en de verdeling leest vanaf de eerste uitvoering weer 70/30 — deze absorbeert niet elke uitvoering totdat deze is bijgewerkt. Een worker die de hele tijd beschikbaar was, haalt nog steeds in, en dat is wat het percentage van main tot een plafond maakt.

### Een nieuwe instantie sluit aan op nul

Een instantie waaraan nooit een weight is toegekend, begint op 0, waardoor deze Live en Enabled zou zijn maar niets zou ontvangen. **Give new instances a share automatically** — standaard ingeschakeld, onder de instantietabel — lost dat op: bij de volgende ronde van de leader krijgt de nieuwkomer een gelijk aandeel in de pool, en de bestaande weights worden naar beneden geschaald met behoud van hun onderlinge verhoudingen, zodat een bewuste 70/30 daarna nog steeds ongeveer als 70/30 leest. Het totaal blijft exact 100.

Dit wordt **eenmalig per instantie** uitgevoerd. Zowel de automatische ronde als uw eigen bewerking markeert de instantie als geconfigureerd, dus een instantie die u zelf hebt ingesteld, wordt nooit achter uw rug gewijzigd — inclusief een instantie die u bewust op 0 hebt gezet. Schakel de instelling uit als u liever wilt dat elke nieuwe machine op u wacht.

Alleen ingeschakelde, live en compatibele instanties nemen deel. Een aandeel toekennen aan een machine die niets kan uitvoeren, zou dat aandeel laten verkommeren.
### Wanneer percentages niet kunnen helpen

Het instellingenpaneel meldt hoeveel van de uitvoeringen van de afgelopen 24 uur alleen op main konden worden uitgevoerd. Als dat aantal hoog is — een Codex-zware of Drive-zware workload — zullen de workers niets doen, wat de gewichten ook zeggen, en het antwoord is een grotere main-instantie in plaats van meer instanties.

## PostgreSQL dimensioneren voor een cluster

Verbindingen schalen met instanties, niet alleen met gebruikers. Elke instantie draait meerdere uvicorn-processen, en elk proces houdt een connection pool plus vier `LISTEN`-verbindingen aan (cancellation, queue wake-ups, run results, chat streams). Open chat streams delen de ene chat-verbinding, dus zij voegen geen databaseverbindingen toe. Een cluster van drie instanties op de standaard `max_connections = 100` raakt uitgeput, en Heym kan dan zijn eigen database niet meer bereiken.

Begroot ongeveer `instances x processes x (async pool + sync pool + 4)` en stel `max_connections` daarboven in.

Verklein de pools in plaats van alleen het plafond te verhogen. Een enkele deployment gebruikt standaard 10+20 async- en 5+10 sync-verbindingen per proces, wat ruim is voor één machine en veel te veel voor een cluster:

| Variabele | Enkele instantie | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Het voorbeeld-composebestand stelt deze en `max_connections = 300` in. Dat brengt een cluster van twee instanties van een plafond van 768 verbindingen terug naar 192, terwijl drie instanties nog steeds onder 300 blijven.

## Vereisten die het cluster niet voor u kan afdwingen

**Elke instantie moet dezelfde `SECRET_KEY` en `ENCRYPTION_KEY` gebruiken.** Een worker met een andere `ENCRYPTION_KEY` kan referenties niet ontsleutelen, en elke uitvoering die referenties gebruikt zou mislukken met een fout die niets nuttigs vermeldt. Heym vergelijkt een digest van beide sleutels bij elke heartbeat, samen met de app-versie en de database-revisie, en markeert een niet-overeenkomende instantie als **Mismatch**, zodat deze helemaal geen werk ontvangt. De belasting valt terug naar main totdat u dit oplost.

Dat bepaalt ook de upgrade-volgorde. Als u main eerst upgradet, wordt elke worker incompatibel gemarkeerd; het werk keert terug naar main, en elke worker voegt zich weer toe zodra deze is geüpgraded. Langzamer, zichtbaar en omkeerbaar.

**Richt ingress alleen op de main-instantie.** Round-robin van gebruikersverkeer over instanties zou een bestandsupload naar de ene machine sturen en de download ervan naar een andere. Niets in de code voorkomt dit, omdat een worker dezelfde image draait en elk verzoek beantwoordt dat deze ontvangt.

**Elke instantie heeft `FRONTEND_URL` nodig, ingesteld op hetzelfde openbare adres.** Een uitvoering die pauzeert voor menselijke beoordeling, genereert de beoordelingslink op de instantie die deze heeft uitgevoerd, niet op main, en hetzelfde geldt voor Codex follow-up-links en voor de download-URL's van gegenereerde bestanden. Een worker zonder deze instelling bouwt die links op basis van zijn eigen lokale adres, en wie er een ontvangt, kan deze niet openen.

**Worker-instanties hebben een ander uitgaand IP.** Elke API die bronadressen op een allowlist zet, ziet het nieuwe adres. Send Email draait precies om deze reden op main; geef voor de HTTP-node het cluster ofwel één NAT-egressadres, of zet elke instantie op de allowlist.

## Een worker toevoegen op een andere machine

`docker-compose.worker.yml` in de hoofdmap van de repository draait een worker op zijn eigen host. Deze heeft geen database en geen UI: hij bereikt de PostgreSQL van de main-instantie en neemt zijn deel van de achtergronduitvoeringen voor zijn rekening.

Vul een `.env` ernaast in — image-tag, databasehost en -referenties, beide sleutels en een instantie-id — en start deze. Compose weigert te starten totdat elke vereiste waarde is ingesteld, in plaats van op te komen met een tijdelijke waarde die later op een moeilijk leesbare manier mislukt.

De image-tag moet de versie zijn die main draait, en beide sleutels moeten exact worden gekopieerd. Een verschil in een van beide toont de worker als Mismatch en deze ontvangt geen werk.

## De tabel Instanties lezen

| Kolom | Betekenis |
|---|---|
| Naam | Bewerkbaar label; het wordt gestempeld op elke uitvoering die deze instantie uitvoert |
| Rol | `main` of `worker`, uit de omgeving |
| Status | **Live** met een recente heartbeat, **Offline** na 30 seconden stilte, **Mismatch** wanneer de versie, database-revisie of sleutels afwijken van die van main |
| ms | Round trip van die instantie naar de database, gemeten door de instantie zelf |
| Aan | Haal een worker uit de rotatie zonder deze te stoppen — lopende uitvoeringen worden afgerond, geen nieuwe worden toegewezen. Vergrendeld aan voor de main-instantie: werk voor bestanden, plugins en coding-agents draait daar wat de schakelaar ook zegt |
| Gewicht | Het aandeel in de verdeelbare uitvoeringen |

## Concurrency-limieten in een cluster

De [concurrency-limiet](./webhooks.md#concurrency-limit-and-queued-runs) van een workflow wordt geteld in PostgreSQL en geldt dus voor elke instantie en elk proces: twee instanties voeren nooit meer uitvoeringen van één workflow uit dan de limiet toestaat. Een uitvoering die op een slot heeft gewacht, wordt bij het starten volgens dezelfde regels geplaatst als elke andere uitvoering, zodat een uitvoering die op main moet blijven dat nog steeds doet. De queue-worker die deze uitvoeringen verwerkt, start nu op elke installatie, inclusief een enkele instantie, waar deze alleen de uitvoeringen claimt die door de eigen instantie in de wachtrij zijn geplaatst. Dit betekent dat een enkele instantie ook de queue wake-up `LISTEN`-verbinding in elk proces vasthoudt; begroot de verbindingen daarom op dezelfde manier als voor een cluster-instantie.

## Uitvoeringsgeschiedenis

Elke uitvoering in de uitvoeringsgeschiedenis vermeldt de instantie die deze heeft uitgevoerd, en beide geschiedenisdialogen kunnen filteren op één instantie. Het filter matcht op de id van de instantie terwijl de naam wordt getoond, dus het hernoemen van een instantie herschrijft niet wat oude uitvoeringen vermelden.

Niets hiervan verschijnt op een installatie met één instantie: de velden zijn leeg, er wordt geen label getoond en er wordt geen filter aangeboden.
## Faalgedrag

**Als een worker tijdens een uitvoering uitvalt**, veroudert de heartbeat en voert de bestaande herstel-sweep van de leader de uitvoering opnieuw uit op een actieve instantie. De queuerij die deze had geclaimd, wordt afzonderlijk afgehandeld: zodra er geen actieve uitvoering meer voor bestaat en een respijtperiode van twee minuten is verstreken, markeert de leader de rij als mislukt en wekt iedereen die op het resultaat wachtte. Leeftijd alleen is nooit de trigger, zodat een legitiem langdurige uitvoering met rust wordt gelaten; en de rij wordt als mislukt gemarkeerd in plaats van opnieuw in de wachtrij te worden geplaatst, omdat het herstel al eigenaar is van de heruitvoering en het opnieuw in de wachtrij plaatsen dezelfde workflow tweemaal zou uitvoeren.

**Als main uitvalt**, blijft cron vanaf een worker vuren en blijven distribueerbare uitvoeringen doorlopen. Uitvoeringen die main nodig hebben, worden in de wachtrij geplaatst en wachten, en worden afgehandeld zodra main terugkeert — maar alleen binnen het respijtvenster voor gemiste vuringen (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, standaard 600 seconden). Alles wat ouder is, wordt gesloten als overgeslagen, met de reden vastgelegd, in plaats van uren aan achterstand in één keer opnieuw af te spelen.

De UI, de API, MCP en de editor zijn niet beschikbaar zolang main uitvalt, omdat de ingress daar naartoe wijst.

## Gerelateerd

- [Uitvoeren & Deployment](../getting-started/running-and-deployment.md) – Implementeer eerst één instantie; de omgevingsvariabelen en de belangrijkste configuratie staan daar
- [Instellingen](./user-settings.md) – Het tabblad Instanties, en wie dit kan zien
- [Uitvoeringen](../tabs/traces-tab.md) – Vergelijk werkelijke uitvoeringsduren tussen instanties voordat u de verdeling wijzigt
- [Beveiliging](./security.md) – Waarom elke instantie `SECRET_KEY` en `ENCRYPTION_KEY` moet delen
