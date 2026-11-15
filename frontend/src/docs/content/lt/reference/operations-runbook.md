# Heym Runbook (L1)

Vykdykite šias procedūras, kad diagnozuotumėte ir atkurtumėte „Heym“ paslaugas, „PostgreSQL“ ryšius, workflow eiles, klasterio talpą ir vykdymą sandbox.

Pradėkite nuo [Heym Incident Playbook (L0)](./incident-playbook.md) dėl sunkumo, kontaktų ir diegimo aprašo.

Paskutinį kartą peržiūrėta: 2026-11-10. Opdrachten komen overeen met de repository op het moment van beoordeling. Bevestig de geïmplementeerde release en topologie vóór gebruik. Alle onderstaande servicewijzigende opdrachten zijn instructies voor een operator, geen automatische herstelmaatregelen.

## Procedūrų rodyklė

| Incident |
| --- |
| [UI of API niet beschikbaar](#ui-of-api-niet-beschikbaar) |
| [PostgreSQL niet beschikbaar of niet beschrijfbaar](#postgresql-niet-beschikbaar-of-niet-beschrijfbaar) |
| [Actieve DB-verbindingen, pool-verzadiging en vergrendelingen](#actieve-db-verbindingen-pool-verzadiging-en-vergrendelingen) |
| [Gecontroleerde herstart van services](#gecontroleerde-herstart-van-services) |
| [Meest bronverslindende workflows](#meest-bronverslindende-workflows) |
| [Wachtrij-achterstand of schijnbaar vastgelopen uitvoeringen](#wachtrij-achterstand-of-schijnbaar-vastgelopen-uitvoeringen) |
| [Controles van clustermodus](#controles-van-clustermodus) |
| [Main-instantie niet beschikbaar terwijl workers actief zijn](#main-instantie-niet-beschikbaar-terwijl-workers-actief-zijn) |
| [Webhook-, MCP-, Portal- of streaming-fouten](#webhook--mcp--portal--of-streaming-fouten) |
| [Container-, pod-, OOM- of opslagproblemen](#container--pod--oom--of-opslagproblemen) |
| [Foutieve implementatie of configuratieregressie](#foutieve-implementatie-of-configuratieregressie) |
| [Model-, referentie- of integratiefout](#model--referentie--of-integratiefout) |
| [Sandbox-fout](#sandbox-fout) |
| [Avarijos atkūrimas ir reagavimas į nelaimes](#disaster-recovery-en-reactie-op-noodgevallen) |

## Komandų sąranka

Werk vanuit de geïmplementeerde checkout of implementatietools. Selecteer alleen de topologie die daadwerkelijk wordt uitgevoerd in de getroffen omgeving. Gebruik geen voorbeeldproject om een productie-incident aan te pakken.

### Docker Compose

Definieer deze shell-helper voor de standaard Compose-installatie:
```bash
heym_compose() { docker compose -f docker-compose.yml "$@"; }
HEYM_MAIN_SERVICE=backend
HEYM_FRONTEND_SERVICE=frontend
```

Gebruik voor het clustervoorbeeld van de repository in plaats daarvan deze definitie:
```bash
heym_compose() { docker compose -f docker-compose.cluster.yml "$@"; }
HEYM_MAIN_SERVICE=main
HEYM_WORKER_SERVICE=worker-a
```

Voor een zelfstandige worker op een eigen host gebruikt u `docker compose -f docker-compose.worker.yml` en de service `worker`. Deze heeft geen lokale PostgreSQL- of frontend-service. Neem de werkelijke projectnaam van de implementatie, override-bestanden en het omgevingsbestand op in de helper als deze worden gebruikt.
```bash
heym_compose ps
heym_compose images
heym_compose logs --since 15m --tail 200 "$HEYM_MAIN_SERVICE"
docker stats --no-stream
```

De standaard Compose-stack publiceert de frontend standaard op hostpoort `4017` en PostgreSQL op `6543`. De backendpoort `10105` is intern. Het clustervoorbeeld publiceert de API van main op `10105`, de API van worker-a op `10111` en PostgreSQL op `6544`. Een release-image combineert frontend en backend in één container. Controleer poorttoewijzingen met `ps`.

Voor een directe backend-procescontrole binnen een Compose main-container:
```bash
heym_compose exec -T "$HEYM_MAIN_SERVICE" uv run python -c \
  'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:10105/api/health", timeout=5).read().decode())'
```

### Kubernetes

Stel de werkelijke context-, namespace- en werklastnamen in. Deze implementatienamen komen uitsluitend overeen met de voorbeelden in de repository.
```bash
HEYM_KUBE_CONTEXT='<actual-context>'
HEYM_NAMESPACE=heym
HEYM_MAIN_DEPLOYMENT=heym
HEYM_WORKER_DEPLOYMENT=heym-worker
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get deployments,pods,svc,pvc
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get events --sort-by=.lastTimestamp
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --all-containers=true --since=15m --tail=200
```

De basisimplementatie bestaat uit één main-replica met strategie `Recreate`, persistente opslag en een readiness probe op `/api/health`. De openbare containerpoort is `4017`; een worker die alleen backend is, gebruikt `10105`. Ga er niet van uit dat een herstart of uitrol zonder downtime verloopt. Zie [Kubernetes Deployment-gedrag](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#recreate-deployment).

### Status en API-toegang
```bash
HEYM_PUBLIC_URL='https://your-heym-host.example'
curl --fail --silent --show-error --connect-timeout 3 --max-time 10 \
  "$HEYM_PUBLIC_URL/api/health"
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/"
```

`/api/health` retourneert `status`, `service` en `version`; het voert geen afhankelijkheidscontrole uit. Bevestig de database en een goedgekeurde end-to-end workflow afzonderlijk.

Onderstaande geverifieerde voorbeelden gebruiken een curl-configuratiebestand dat buiten deze repository is ingericht op `$HEYM_CURL_CONFIG`, met de `Authorization`-header van de operator. Beperk de machtigingen tot de operator, houd het buiten versiebeheer en verwijder tijdelijke kopieën na gebruik. Plak geen tokens in opdrachten, URL's, logs of incidentnotities. Gebruik waar mogelijk een bestaande geverifieerde UI-sessie. Inspecteer statuscodes en het geïmplementeerde OpenAPI-schema op backend `/docs` voordat u een mislukte mutatie opnieuw probeert.

### SQL-toegang en querylimieten

Open voor de meegeleverde Compose-database een sessie met de geconfigureerde identiteit van de databasecontainer:
```bash
heym_compose exec postgres sh -c \
  'exec psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Voor een externe database gebruikt u een goedgekeurde `psql`-servicedefinitie en wachtwoordbestand of de console van de databaseprovider. Een libpq-verbinding gebruikt `postgresql://`, niet SQLAlchemy's `postgresql+asyncpg://`. Test zowel vanuit het netwerkpad van de getroffen applicatie als via het DBA-pad.

Voer diagnostische SQL waar mogelijk uit met een alleen-lezen rol. Aan het begin van elke diagnostische sessie:
```sql
SET default_transaction_read_only = on;
SET statement_timeout = '5s';
SET lock_timeout = '1s';
SELECT now() AS observed_at, current_database(), pg_is_in_recovery();
```

Gebruik de beoogde beschrijfbare primaire instantie voor applicatiecontroles. Een replica kan antwoorden op `SELECT 1` terwijl het schrijfpad niet beschikbaar is. `pg_stat_activity`-details vereisen mogelijk privileges voor databasemonitoring; verborgen rijen of NULL-velden zijn geen bewijs van inactiviteit. De onderstaande diagnostische query's laten payloads, secrets en SQL-tekst weg. Ze werken geen Heym-tabellen bij. Zie [PostgreSQL-activiteit en -zichtbaarheid](https://www.postgresql.org/docs/16/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW).

## Bendras patikrinimas

Controleer na elke mitigatie de openbare toegang, de responsiviteit van de database, een goedgekeurde smoke-workflow en de relevante capaciteits-/backlog-statistieken. Gebruik een veilige productiemodustrigger bij het verifiëren van clusterverzending: testuitvoeringen van de editor blijven op de ontvangende instantie. Bewaak gedurende ten minste 10 minuten, plus het volgende verwachte kritieke schema of een overeengekomen gelijkwaardige controle. Leg wijzigingen vast en wijs een verantwoordelijke/tijdstip toe om tijdelijke beperkingen terug te draaien.

## UI of API niet beschikbaar

**Sunkumas:** P1 voor wijdverbreide niet-beschikbaarheid in productie; P2 voor gedeeltelijke degradatie.

**Diagnozė**

1. Vergelijk de openbare gebruikersinterface, de openbare `/api/health` en de directe backendcontrole van main via [Opdrachtconfiguratie](#opdrachtconfiguratie).
2. Inspecteer de status van de main/frontend-container of pod, recente fouten en CPU/geheugen/schijf. Het laden van een statische UI bewijst niet dat de API werkt.
3. Voer de [databasecontrole](#postgresql-niet-beschikbaar-of-niet-beschrijfbaar) uit. Inspecteer de laatste release en wijzigingen in ingress/proxy.
4. Als alleen geauthenticeerde verzoeken mislukken, onderscheid dan verlopen sessies/SSO van een algemene API-storing. Reset geen gedeelde sleutels om het inloggen te testen.

**Poveikio mažinimas**

1. Herstel eerst database- of opslagafhankelijkheden wanneer deze de fout verklaren.
2. Als de directe backend werkt, herstelt u de frontend/proxy/ingress-route. Ingress moet in clustermodus naar main verwijzen.
3. Als main vastloopt en de afhankelijkheden in orde zijn, volgt u [Gecontroleerde herstart van services](#gecontroleerde-herstart-van-services). Herstel alleen de getroffen frontend-service als dat het defecte onderdeel is.
4. Volg bij een release-regressie [Foutieve implementatie](#foutieve-implementatie-of-configuratieregressie).

**Patikrinimas:** De openbare UI laadt, geauthenticeerde API-toegang slaagt en een smoke-workflow wordt voltooid. Een groen proces-endpoint alleen is onvoldoende.

**Eskalavimas:** Platform-wachtdienst bij backend-storingen; netwerk-/ingress-beheerder wanneer alleen het openbare pad faalt; database- of opslagbeheerder wanneer afhankelijkheidscontroles mislukken.

## PostgreSQL niet beschikbaar of niet beschrijfbaar

**Sunkumas:** P1 wanneer productieverbindingen of schrijfbewerkingen mislukken; P2 voor periodieke degradatie.

**Diagnozė**

Voor gebundelde PostgreSQL:
```bash
heym_compose ps postgres
heym_compose logs --since 15m --tail 150 postgres
heym_compose exec -T postgres sh -c \
  'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

1. `pg_isready` controleert of de server verbindingen accepteert. Bevestig geauthenticeerde SQL-toegang en primaire status via [SQL-toegang](#opdrachtconfiguratie).
2. Controleer vanaf de getroffen instantie DNS, routering, database-endpoint/-poort, TLS en netwerkbeleid. Een lokale DBA-verbinding garandeert geen bereikbaarheid voor de applicatie.
3. Lees de geschoonde foutmelding: verbinding geweigerd/time-out, authenticatiefout, uitputting van verbindingen, alleen-lezen transactie, opslaguitputting of migratiefout.
4. Controleer schijf/inodes van de databasehost, databaselogs, failover-/replicatiestatus en onderhoudsgebeurtenissen. Gebruik [Verbindingen en vergrendelingen](#actieve-db-verbindingen-pool-verzadiging-en-vergrendelingen) bij verzadiging.

**Poveikio mažinimas**

1. Verminder de opname van producenten en stormen van nieuwe pogingen. Pauzeer storende automatische triggers via Heym als de API werkt; coördineer anders de vermindering van het stroomopwaartse verkeer. Vermijd bulk-herhalingen.
2. Voor een gestopte gebundelde database met geverifieerde intacte opslag en zonder actieve failover-/herstelbewerking start u alleen de bestaande service:
```bash
   heym_compose start postgres
   ```

3. Gebruik voor beheerde PostgreSQL, netwerkstoringen, volle schijf, corruptie of failover de herstelprocedure van de databasebeheerder. Bewaar het bestaande databasevolume en sleutelmateriaal.
4. Zodra de beschrijfbare primaire instantie bereikbaar is, laat u pools/listeners opnieuw verbinding maken. Herstart een applicatie-instantie alleen als deze nog steeds faalt nadat het databasepad is hersteld.
5. Initialiseer nooit een lege vervangende database bij een incident, verwijder geen WAL-bestanden en voer geen `docker compose down -v` uit. Herstel volgt [Disaster recovery](#disaster-recovery-en-reactie-op-noodgevallen).

**Patikrinimas:** Applicatiepad-SQL werkt tegen de beoogde primaire instantie, normale applicatieschrijfbewerkingen slagen via de smoke-workflow, verbindingsfouten stoppen, heartbeats worden hervat en de wachtrij-leeftijd daalt.

**Eskalavimas:** Database-wachtdienst onmiddellijk voor P1, primaire/failover-problemen, datacorruptie of uitgeputte opslag. Verzend endpoint-identiteit, tijdstempels, status-/foutklasse en opslag-/verbindingsbewijs zonder inloggegevens.

## Actieve DB-verbindingen, pool-verzadiging en vergrendelingen

**Sunkumas:** P1 als er geen nuttig werk kan worden verbonden; P2 als druk of blokkades de uitvoering belemmeren.

**Diagnozė**

Voer dit uit op de getroffen PostgreSQL-server. Het totaal geldt serverbreed omdat andere databases dezelfde verbindingslimiet gebruiken. `active` voert een query uit; `idle` is verbonden zonder huidige query. Beide verbruiken een slot. PostgreSQL reserveert enkele slots, waardoor gewone clients kunnen worden geweigerd voordat het totaal `max_connections` bereikt.
```sql
SELECT current_setting('max_connections')::int AS max_connections,
       current_setting('superuser_reserved_connections')::int AS superuser_reserved,
       current_setting('reserved_connections', true) AS reserved_connections,
       count(*) FILTER (WHERE backend_type = 'client backend') AS client_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state = 'active') AS active_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state LIKE 'idle in transaction%') AS idle_in_transaction
FROM pg_stat_activity;

SELECT datname, application_name, usename, client_addr, state,
       wait_event_type, wait_event, count(*) AS connections
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY datname, application_name, usename, client_addr, state,
         wait_event_type, wait_event
ORDER BY connections DESC
LIMIT 50;
```

Heym tagt pool- en listener-verbindingen met `heym-<instance-id>`. Vergelijk de verbindingsgroep met instantie-heartbeats en het aantal processen. Een inactieve pool is normaal. Een groeiende `idle in transaction`-populatie vereist nader onderzoek.
```sql
SELECT pid, application_name, state,
       now() - xact_start AS transaction_age,
       CASE WHEN state = 'active' THEN now() - query_start END AS active_query_age,
       wait_event_type, wait_event, pg_blocking_pids(pid) AS blocking_pids
FROM pg_stat_activity
WHERE datname = current_database()
  AND backend_type = 'client backend'
  AND pid <> pg_backend_pid()
  AND (state = 'active' OR state LIKE 'idle in transaction%')
ORDER BY xact_start ASC NULLS LAST
LIMIT 30;
```

Onderscheid serveruitputting (`too many clients`) van een time-out van de lokale SQLAlchemy-pool. Een lokale pool kan verzadigd raken doordat verzoeken verbindingen vasthouden of wachten op vergrendelingen, zelfs wanneer de server vrije slots heeft.

Begroot de geconfigureerde piekbelasting, inclusief overflow en elk uvicorn-proces:
```text
sum over instances:
  process_count * (async_pool_size + async_max_overflow
                   + sync_pool_size + sync_max_overflow + 4 listeners)
then add other clients, monitoring, and operational headroom
```

Standaardwaarden per proces zijn `HEYM_DB_POOL_SIZE=10`, `HEYM_DB_MAX_OVERFLOW=20`, `HEYM_DB_SYNC_POOL_SIZE=5` en `HEYM_DB_SYNC_MAX_OVERFLOW=10`. Het standaard backend-startpunt start 8 processen: de theoretische piek is `8 * (10 + 20 + 5 + 10 + 4) = 392`, vóór andere clients. Pools groeien op aanvraag; dit is een plafond, niet het verwachte open aantal. De toegewijde sessie van de leider wordt vastgehouden vanuit de asynchrone pool. Er bestaan vier listener-verbindingen per proces, zelfs op een installatie met één instantie; chat-streams delen een listener.

Lees werkelijke instellingen uit het geïmplementeerde manifest. Voorbeeldbestanden overschrijven enkele standaardwaarden en processen. Het toevoegen van workers voegt ook pools en listeners toe; dit kan de databasedruk verhogen.

**Poveikio mažinimas**

1. Beperk de geïdentificeerde werklast/producenten. Behoud een DBA-toegangspad en operationele marge.
2. Vraag de databasebeheerder om individuele blokkades/lange transacties te inspecteren. Sluit Heym-sessies niet massaal af: listeners en de advisory-lock-sessie van de leider zijn essentiële coördinatiepaden. Query-annulering en sessiebeëindiging hebben verschillende effecten; de DBA moet zich richten op een bevestigde boosdoener. Zie [PostgreSQL-serversignalen](https://www.postgresql.org/docs/16/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL).
3. Als de capaciteit dit vereist, verlaagt u de pool-/overflow-groottes of het aantal processen via de implementatieconfiguratie, en draineert/herstelt u instanties vervolgens één voor één. Controleer de API-belasting en executor-capaciteit na de reductie. Een poolwijziging vereist procesvervanging; `restart` past gewijzigde Compose-omgevingswaarden niet toe.
4. `docker-compose.yml` stuurt de vier poolvariabelen niet expliciet door. Voeg goedgekeurde omgevingsoverschrijvingen toe aan de werkelijke implementatieconfiguratie in plaats van aan te nemen dat een hostvermelding in `.env` de container bereikt. Cluster- en worker-voorbeelden hebben hun eigen toewijzingen.
5. Coördineer elke verhoging van `max_connections` met de databasebeheerder en het geheugenbudget. Vermijd gelijktijdige herverbindingen over de hele vloot.

**Patikrinimas:** De totale clientverbindingen stabiliseren zich met marge, poolfouten stoppen, blokkades verdwijnen, listener-/heartbeat-fouten houden op en de smoke-workflow slaagt.

**Eskalavimas:** Databasebeheerder voor interventie bij blokkades of wijzigingen in de verbindingslimiet; platformbeheerder voor verbindingslekken, pool-uithongering of herhaalde herverbindingsstormen.

## Gecontroleerde herstart van services

**Sunkumas:** Erft de ernst van het incident. Het herstarten van main onderbreekt de openbare dienstverlening in de gedocumenteerde topologie.

**Vóór herstarten**

1. Bevestig de doelinstantie/-service en verzamel logs, image-digest, reden voor herstart en actieve/wachtrij-uitvoerings-ID's. Bevestig dat PostgreSQL en opslag in orde zijn.
2. Verminder nieuwe instroom. Schakel voor een worker **On** uit onder **Instellingen > Instanties** in de UI of stel het gewicht in op 0. Laat lopende werkzaamheden weglopen vóór het herstarten.
3. Raadpleeg [Herstel en annulering van uitvoeringen](#foutieve-implementatie-of-configuratieregressie). Heym hervat onvolledige uitvoeringen door in aanmerking komende workflows vanaf het begin opnieuw uit te voeren.
4. Verwijder geen volumes, laat geen omgevingsbestanden weg en voer geen kaal `docker compose down` uit.

**Eén service herstarten met ongewijzigde configuratie**
```bash
# Compose main. Use the existing topology helper.
heym_compose restart -t 60 "$HEYM_MAIN_SERVICE"
heym_compose ps "$HEYM_MAIN_SERVICE"
heym_compose logs --since 5m --tail 150 "$HEYM_MAIN_SERVICE"
```

Voor een leeggemaakte worker uit het clustervoorbeeld vervangt u `$HEYM_WORKER_SERVICE`. De stop-time-out van 60 seconden zorgt ervoor dat lopende uitvoeringen kunnen worden voltooid of een schone pauzestatus bereiken vóór SIGKILL.

**Volledige Compose-stack herstarten**

Geef de voorkeur aan herstarts per afzonderlijke service. Een stackherstart stopt de hele Compose-stack, inclusief PostgreSQL.
```bash
# Kubernetes main. Recreate strategy can cause downtime.
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout restart \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
```

Vervang `$HEYM_WORKER_DEPLOYMENT` voor een leeggemaakte worker. Een Deployment met meerdere replica's kan een rolling herstart uitvoeren. Strategie `Recreate` op main beëindigt de oude pod voordat de nieuwe wordt gepland: verwacht downtime gelijk aan afsluiten, planning, opnieuw koppelen van volume en opstarten.

**Patikrinimas:** Status-endpoints van processen reageren, PostgreSQL-verbindingen herstellen zich, worker-heartbeats worden hervat in **Instellingen > Instanties** en de smoke-workflow wordt voltooid.

**Eskalavimas:** Platform-wachtdienst als het opstarten vastloopt of probes mislukken; database-wachtdienst als het opstarten blijft hangen in migraties.

## Meest bronverslindende workflows

**Sunkumas:** P2 wanneer workflow-belasting de responstijden verslechtert; P1 als dit de beschikbaarheid van database, worker of openbare toegang bedreigt.

**Diagnozė**

Recente workflows gerangschikt op totale geregistreerde verstreken duur:
```sql
SELECT h.workflow_id, w.name, w.owner_id,
       count(*) AS recorded_runs,
       count(*) FILTER (WHERE h.status IN ('error', 'failed', 'timeout')) AS failed_runs,
       round((sum(h.execution_time_ms) / 1000.0)::numeric, 1) AS total_elapsed_seconds,
       round((max(h.execution_time_ms) / 1000.0)::numeric, 1) AS max_elapsed_seconds
FROM execution_history h
JOIN workflows w ON w.id = h.workflow_id
WHERE h.started_at >= now() - interval '1 hour'
GROUP BY h.workflow_id, w.name, w.owner_id
ORDER BY total_elapsed_seconds DESC
LIMIT 20;
```

Om workflows met een hoog volume te identificeren, voert u dezelfde query opnieuw uit met `ORDER BY recorded_runs DESC`.

Recente workflows gerangschikt op gemiddelde duur met ten minste 5 uitvoeringen:
```sql
SELECT a.execution_id, a.workflow_id, w.name,
       a.executed_by_instance_id, a.trigger_source,
       now() - a.started_at AS run_age,
       now() - a.heartbeat_at AS heartbeat_age,
       a.running_node_ids, a.attempt, a.recoverable, a.cancel_requested_at
FROM active_workflow_executions a
JOIN workflows w ON w.id = a.workflow_id
ORDER BY a.started_at
LIMIT 50;

SELECT t.workflow_id, w.name, count(*) AS trace_records,
       sum(coalesce(t.total_tokens, 0)) AS tokens
FROM llm_traces t
LEFT JOIN workflows w ON w.id = t.workflow_id
WHERE t.created_at >= now() - interval '1 hour'
GROUP BY t.workflow_id, w.name
ORDER BY tokens DESC
LIMIT 20;
```

NULL-workflow-ID's kunnen chat- of assistent-activiteit vertegenwoordigen. Trace-records worden niet gegenereerd voor niet-opgeslagen testuitvoeringen in de canvas-editor.

Correleer databasetijd met uitvoering op knooppuntniveau. Bekijk knooppunt-knelpunten op het [tabblad Traces](../tabs/traces-tab.md). Correleer workflow-uitvoering met pieken in host-/pod-CPU, geheugen en databaseverbindingen.

**Poveikio mažinimas**

1. Bij een storm van externe producenten beperkt u de webhook- of API-verbruiker bij de ingress of API-gateway voordat u workflow-definities wijzigt.
2. Een instantiebeheerder met toegang tot de workflow kan automatische triggers pauzeren via het ondersteunde endpoint:
```bash
   HEYM_WORKFLOW_ID='<workflow-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --output /dev/null --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/pause-triggers"
   ```

   Het pauzeren van automatische triggers stopt reeds lopende of in de wachtrij geplaatste werkzaamheden niet. Het stopt toekomstige aanroepen via schema, webhook en polling.

3. Voor een clusterinstallatie stelt u de worker-capaciteit in onder **Instellingen > Instanties** of verplaatst u verkeer door worker-gewichten aan te passen.
4. Als een geïdentificeerde actieve uitvoering moet stoppen, vraagt u annulering aan met het exacte uitvoerings-ID:
```bash
   HEYM_EXECUTION_ID='<execution-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/executions/$HEYM_EXECUTION_ID/cancel"
   ```

   Bevestig de uiteindelijke historiestatus en verwijdering uit het register. `cancel_requested` is asynchroon: coöperatieve knooppunten stoppen bij stapgrenzen, terwijl langdurige HTTP- of LLM-aanroepen hun huidige verzoek voltooien alvorens te stoppen.

**Patikrinimas:** Uitvoeringsfrequentie daalt, worker-CPU en -geheugen keren terug naar de basislijn, het aantal databaseverbindingen stabiliseert en workflows met normale prioriteit worden volgens schema hervat.

**Eskalavimas:** Workflow-eigenaar om de logica te inspecteren of de planningsfrequentie te verlagen; platform-wachtdienst als annulering de uitvoering niet stopt.

## Wachtrij-achterstand of schijnbaar vastgelopen uitvoeringen

**Sunkumas:** P2 wanneer wachtrij-latentie zakelijke drempels overschrijdt; P1 wanneer wachtrij-groei opslag- of databaseverbindingslimieten bedreigt.

**Diagnozė**

Maak een momentopname van onvoltooide wachtrijrijen. Het statusfilter omvat ouder onvoltooid werk, niet alleen recente binnenkomsten.
```sql
SELECT status, placement, target_instance_id, count(*) AS runs,
       min(enqueued_at) AS oldest_enqueued_at,
       max(now() - enqueued_at) AS oldest_age
FROM workflow_run_queue
WHERE status IN ('held', 'queued', 'waiting_for_main', 'claimed')
GROUP BY status, placement, target_instance_id
ORDER BY oldest_enqueued_at;

SELECT q.execution_id, q.workflow_id, w.name, q.status, q.placement,
       q.target_instance_id, q.enqueued_at, q.not_after, q.expires_at,
       q.claimed_at, a.heartbeat_at, a.cancel_requested_at
FROM workflow_run_queue q
JOIN workflows w ON w.id = q.workflow_id
LEFT JOIN active_workflow_executions a ON a.execution_id = q.execution_id
WHERE q.status IN ('held', 'queued', 'waiting_for_main', 'claimed')
ORDER BY q.enqueued_at
LIMIT 50;
```

| Status | Interpretatie | Actie |
| --- | --- | --- |
| `held` | Wacht op het productie-gelijktijdigheidsslot van de workflow | Inspecteer de gelijktijdigheidslimiet van die workflow in de instellingen |
| `pending` | Wacht op worker-toewijzing | Controleer worker-geschiktheid en aantal actieve instanties hieronder |
| `running` | Toegewezen aan een worker, uitvoering actief | Controleer worker-heartbeat en thread-gezondheid |
| `waiting_hitl` | Gepauzeerd voor menselijke goedkeuring | Verwachte status; stem af met workflow-eigenaar |
| `cancel_requested` | Annulering bevestigd, wacht op stapgrens | Bewaak stopzetting; escaleer bij vastlopen |

Controleer op verouderde of verweesde uitvoeringen waarvan de toegewezen worker is gestopt met heartbeats:

1. Bevestig bij installaties met één instantie dat de main-service over resterende gelijktijdigheidscapaciteit beschikt.
2. Open **Instellingen > Instanties** als instantiebeheerder, of vraag op:
```bash
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/api/admin/cluster"
   ```

3. Controleer `cluster_enabled`, `live`, `compatible`, `enabled`, `weight`, `credentials_synced`, heartbeat-leeftijd, DB-latentie en sandbox-beschikbaarheid (`docker_ok`). Een instantie heeft zowel geschiktheid als liveness nodig om gedistribueerd werk te ontvangen. De historische naam `docker_ok` dekt ook de bereikbaarheid van de Kubernetes-sandbox.
```sql
SELECT id, name, role, enabled, weight, weight_configured,
       version, schema_revision, docker_ok, db_latency_ms,
       now() - heartbeat_at AS heartbeat_age,
       now() - credentials_synced_at AS credential_sync_age
FROM cluster_instances
ORDER BY role, id;

SELECT executed_by_instance_id, status, count(*) AS recorded_runs
FROM execution_history
WHERE started_at >= now() - interval '1 hour'
GROUP BY executed_by_instance_id, status
ORDER BY executed_by_instance_id, status;
```

De SQL-heartbeat-weergave is bewijs, geen volledige compatibiliteitsberekening. Gebruik de beheer-API voor compatibiliteits- en sleutelrotatielogica. Heartbeats worden elke 10 seconden uitgevoerd; een heartbeat-leeftijd van meer dan 30 seconden duidt op netwerkpartitionering of vastgelopen worker-processen.

**Poveikio mažinimas**

1. Als workers gezond maar verzadigd zijn, schaalt u worker-replica's of voegt u instanties toe volgens [Clusterschaling](#controles-van-clustermodus).
2. Voor een verweesde uitvoering op een uitgevallen worker start u herstel of annuleert u de uitvoering via [Herstel van uitvoering](#gecontroleerde-herstart-van-services).
3. Als wachtende uitvoeringen wachten op een uitgeschakelde of incompatibele worker, schakelt u de worker opnieuw in of werkt u zijn inloggegevens bij onder **Instellingen > Instanties**.
4. Als de wachtrij wordt overspoeld met dubbele verzoeken door een externe storm van nieuwe pogingen, pauzeert u de trigger bij de ingress of gebruikt u [Workflow pauzeren](#meest-bronverslindende-workflows).

**Patikrinimas:** Wachtrijlengte vertoont een dalende lijn, wachtende uitvoeringen gaan binnen de verwachte latentie over naar running en heartbeats tonen actieve worker-capaciteit.

**Eskalavimas:** Platform-wachtdienst voor blokkades in scheduler-verzending; database-wachtdienst als wachtrij-pollingquery's vergrendelingsconflicten vertonen.

## Controles van clustermodus

**Sunkumas:** P2 voor worker offline of verminderde capaciteit; P1 als clustercoördinatie volledig faalt.

**Diagnozė**

De SQL-heartbeat-weergave biedt een overzicht van alle instanties.

Belangrijke velden:

- `compatible`: Moet `true` zijn. Een incompatibele worker wordt uitgesloten van toewijzing.
- `heartbeat_age_seconds`: Waarden boven 30 seconden duiden op mogelijke netwerkpartities of vastgelopen worker-processen.
- `weight`: Relatieve worker-capaciteit. Een gewicht van 0 schakelt toewijzing naar die instantie uit.
- `credentials_complete`: Moet `true` zijn voor workflows die gedeelde inloggegevens vereisen.

**Poveikio mažinimas**

1. Voor een offline worker controleert u pod-/containerstatus en logs op de worker-host. Volg [Serviceherstart](#gecontroleerde-herstart-van-services).
2. Voor een incompatibele worker controleert u image-versies op alle clusterinstanties. Alle instanties moeten dezelfde release draaien. Volg [Foutieve implementatie](#foutieve-implementatie-of-configuratieregressie).
3. Werk bij ontbrekende inloggegevens gedeelde gegevens bij vanuit de main-instantie onder **Instellingen > Referenties**.
4. Om een worker netjes leeg te laten lopen voor onderhoud, stelt u zijn gewicht in op 0 of zet u **On** op uit onder **Instellingen > Instanties**. Laat lopend werk voltooien vóór het stoppen.

**Patikrinimas:** Worker-heartbeat hervat binnen 30 seconden, `compatible` is `true` en testworkflow wordt verzonden naar de herstelde worker.

**Eskalavimas:** Platform-wachtdienst voor netwerkpartities tussen instanties of conflicten rond gedeelde databasevergrendelingen.

## Main-instantie niet beschikbaar terwijl workers actief zijn

**Sunkumas:** P1. Main coördineert planning, bedient de UI/API en beheert de clusterstatus.

**Diagnozė**

1. Bevestig de processtatus van main en het brongebruik via [Opdrachtconfiguratie](#opdrachtconfiguratie).
2. Controleer databaseconnectiviteit vanaf de main-host. Workers kunnen doorgaan met het verwerken van lokaal gecachete uitvoeringen terwijl main onbereikbaar is.
3. Controleer reverse proxy / ingress-routering naar de main-instantie.

**Poveikio mažinimas**

1. Als main is gecrasht door OOM of een niet-afgehandelde uitzondering, herstart u main volgens [Gecontroleerde herstart van services](#gecontroleerde-herstart-van-services).
2. Als main wacht op een databasevergrendeling die wordt vastgehouden door een uitgevallen worker, volgt u [Verbindingen en vergrendelingen](#actieve-db-verbindingen-pool-verzadiging-en-vergrendelingen).
3. Controleer in Kubernetes of de `Recreate`-strategie de pod-beëindiging heeft voltooid voordat de vervanger werd gepland.

**Patikrinimas:** De openbare UI laadt, de status-endpoint van de API retourneert HTTP 200, cluster-worker-heartbeats rapporteren weer aan main en het editor-canvas werkt correct.

**Eskalavimas:** Incident Commander onmiddellijk; platform-wachtdienst voor opslag- of knooppuntstoringen.

## Webhook-, MCP-, Portal- of streaming-fouten

**Sunkumas:** P2 voor endpoint-specifieke degradatie; P1 als openbare webhooks geruisloos falen in alle workflows.

**Diagnozė**

1. Controleer bij webhook-fouten ingress-routering, SSL-beëindiging en padvoorvoegselconfiguratie. Bevestig dat het webhook-endpoint bestaat en actief is.
2. Controleer bij SSE-streamingfouten de proxy-bufferinstellingen. Ingress-proxies (nginx, traefik, envoy) moeten responsbuffering (`X-Accel-Buffering: no` of gelijkwaardig) uitschakelen voor `/api/chat/stream` en het streamen van workflow-uitvoeringen.
3. Controleer bij MCP-fouten de geldigheid van de MCP-API-sleutel, transportconfiguratie (SSE vs stdio) en toolregistratie in **Instellingen > MCP**.
4. Bekijk foutenlogs op main op autorisatiefouten, ongeldige JSON-payloads of afwijzingen bij schemavalidatie.

**Poveikio mažinimas**

1. Schakel proxybuffering op streamingpaden uit op het ingress- of reverse proxy-niveau.
2. Controleer bij afwijzing van webhook-payloads de JSON-structuur tegen de specificatie van de workflow-trigger. Werk de externe aanroeper bij als payloads onjuist zijn gevormd.
3. Herstart bij verbroken MCP-verbindingen de getroffen MCP-clientsessie of verifieer opnieuw met een nieuw token.

**Patikrinimas:** Test-webhook reageert met HTTP 200/202, SSE-stream levert incrementele chunks zonder vastlopen en MCP-client vermeldt tools met succes.

**Eskalavimas:** Netwerk-wachtdienst voor ingress-/bufferproblemen; workflow-auteur voor inconsistenties in het payload-schema.

## Container-, pod-, OOM- of opslagproblemen

**Sunkumas:** P1 als main of de database is getroffen; P2 voor geïsoleerde worker-herstarts.

**Diagnozė**
```bash
# Compose container state and host filesystem pressure.
heym_compose ps
docker stats --no-stream
df -h
df -i
```

Controleer zowel het werkelijke bestandssysteem van het gegevensvolume en de databasehost als de shell-host. Alleen-lezen containerstatus zonder omgevingswaarden:
```bash
HEYM_CONTAINER_ID='<affected-container-id>'
docker inspect --format \
  '{{.Name}} status={{.State.Status}} oom={{.State.OOMKilled}} exit={{.State.ExitCode}} restarts={{.RestartCount}}' \
  "$HEYM_CONTAINER_ID"
```

```bash
HEYM_POD='<affected-pod>'
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" describe pod "$HEYM_POD"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs "$HEYM_POD" \
  --all-containers=true --previous --tail=150
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" top pods --containers
```

Inspecteer OOMKilled versus mislukte probes, ophalen van images, Pending-planning, knooppuntdruk en koppelings-/koppelingsfouten van volumes. Eerdere logs bestaan alleen wanneer de pod opnieuw is opgestart zonder opnieuw te zijn gepland.

## Foutieve implementatie of configuratieregressie

**Sunkumas:** P1 als productieverbindingen, taakverwerking of migraties mislukken; P2 voor geïsoleerde functieregressies.

**Diagnozė:** Vergelijk de begintijd van de fout met de uitrol, werkelijke image-digests, configuratie-/geheimenrevisie, migratiestatus en de laatste bevestigde wijziging. Inspecteer implementatiegeschiedenis en geschoonde diffs. Plak nooit volledige omgevingsvariabelen, door Compose gerenderde geheimen of Kubernetes Secret-gegevens in een incidentrapport.
```sql
SELECT version_num FROM alembic_version;
```

```bash
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout history \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
```

**Poveikio mažinimas**

1. Stop de uitrol en scherm extern verkeer af als fouten de gegevensintegriteit bedreigen of doorwerken naar afhankelijkheden.
2. Controleer de laatst bekende werkende image-digest, Git-commit en Helm-/manifestrevisie. Inspecteer recente diffs van ConfigMap, Secret en omgeving.
3. Als het schema compatibel is, herstelt u de goedgekeurde image/configuratie met behulp van de implementatietools. Rol terug naar een specifieke geteste revisie, niet naar een aangenomen vorige:
```bash
   HEYM_ROLLBACK_REVISION='<approved-revision-number>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout undo \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --to-revision="$HEYM_ROLLBACK_REVISION"
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
   ```

4. Een rollback van een Deployment herstelt het pod-sjabloon; het herstelt geen externe Secret- of ConfigMap-waarden als deze zijn overschreven. Draai configuratiewijzigingen parallel terug.
5. Downgrade nooit een release-image over een incompatibele databaseschemamigratie heen. Als een migratie onomkeerbare tabel- of kolomwijzigingen heeft aangebracht, repareer dan voorwaarts met een geteste hotfix of herstel de database via [Disaster recovery](#disaster-recovery-en-reactie-op-noodgevallen).
6. Herstart na de rollback afhankelijke workers om ervoor te zorgen dat de hele vloot dezelfde release-versie uitvoert.

**Patikrinimas:** Gezondheidscontroles reageren met 200, workers melden dezelfde release-versie in **Instellingen > Instanties**, schemamigratieversie komt overeen met de doelrelease en smoke-workflow slaagt.

**Eskalavimas:** Incident Lead en release engineer onmiddellijk voor P1. Betrek de databasebeheerder als migratieopschoning of schemaherstel vereist is.

## Model-, referentie- of integratiefout

**Sunkumas:** P2 bij uitval van een specifieke provider of snelheidslimieten; P1 als geen enkel geconfigureerd model reageert voor workflows.

**Diagnozė**

1. Maak onderscheid tussen storing aan de providerzijde, verlopen/ingetrokken inloggegevens, snelheidslimieten (HTTP 429) en netwerktime-outs.
2. Controleer statuspagina's van providers (OpenAI, Anthropic, Google AI, enz.).
3. Test de geldigheid van inloggegevens via **Instellingen > Referenties** met de ingebouwde testknop.
4. Bekijk applicatielogs om de foutclassificatie te identificeren: `RateLimitError`, `AuthenticationError`, `InvalidRequestError` of `APIConnectionError`.

**Poveikio mažinimas**

1. Voor snelheidslimieten (429) schakelt u workflow-knooppunten om naar uitwijk-inloggegevens of een providermodel met beschikbaar quotum.
2. Roteer voor verlopen inloggegevens de sleutel in **Instellingen > Referenties**. Heym werkt gedeelde inloggegevens bij op alle cluster-workers.
3. Pauzeer bij storingen van upstream-providers tijdelijk de getroffen workflows of configureer alternatieve modelroutering.

**Patikrinimas:** Testen van referenties slaagt in de UI, agent-uitvoering wordt voltooid zonder HTTP 4xx/5xx-fouten en wachttijden voor snelheidslimieten lossen op.

**Eskalavimas:** Eigenaar van inloggegevens / teamleider voor facturering of sleutelvernieuwing; ondersteuning van externe provider bij grootschalige storingen.

## Sandbox-fout

**Sunkumas:** P2 voor geïsoleerde fouten van code-knooppunten; P1 als sandbox-uitvoering vereist is voor bedrijfskritische workflows.

**Diagnozė**

1. Identificeer de sandbox-uitvoeringsmodus: lokaal proces, Docker-container of Kubernetes-pod-sandbox.
2. Controleer de responsiviteit van de Docker-daemon op de sandbox-host of de planning van Kubernetes-sandbox-pods.
3. Kubernetes: inspecteer sandbox-pods in de geconfigureerde sandbox-namespace, hun gebeurtenissen en NetworkPolicies. Sandboxes kunnen een afzonderlijke namespace gebruiken:
```bash
   HEYM_SANDBOX_NAMESPACE='<actual-sandbox-namespace>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_SANDBOX_NAMESPACE" get pods \
     -l app.kubernetes.io/managed-by=heym -L heym.run/sandbox,heym.run/instance
   ```

4. Controleer de geconfigureerde `HEYM_SANDBOX_BACKEND` en typespecifieke sandbox-instellingen in de omgevingsvariabelen.
5. Als Docker-containers falen, controleer dan of de Docker-socket is gekoppeld en de Heym-gebruiker machtigingen heeft om met de daemon te communiceren.
6. Zorg er bij Kubernetes-sandboxes voor dat het ServiceAccount over machtigingen beschikt om pods in de sandbox-namespace aan te maken en te beheren.

**Patikrinimas:** Het code-knooppunt wordt succesvol uitgevoerd in de geïsoleerde sandbox, retourneert verwachte uitvoer en sandbox-bronnen worden na uitvoering opgeruimd.

**Eskalavimas:** Platform-wachtdienst voor problemen met de Docker-daemon op hostniveau of storingen in de Kubernetes-sandboxinfrastructuur.

## Avarijos atkūrimas ir reagavimas į nelaimes

**Sunkumas:** P1 voor catastrofaal gegevensverlies, hostuitval of volledige vernietiging van de omgeving.

**Procedure**

1. Roep het noodincident uit en wijs een Incident Commander aan. Informeer belanghebbenden via vastgestelde noodkanalen.
2. Isoleer de beschadigde omgeving om verder gegevensverlies of conflicterende schrijfbewerkingen te voorkomen. Voorkom dat oude en nieuwe installaties tegelijkertijd dezelfde werklast verwerken.
3. Herstel PostgreSQL via de geteste back-up-/PITR-procedure in de beoogde herstelomgeving. Herstel de bijbehorende bestands-/plugin-/code-werkruimtegegevens van de main-instantie samen met de vereiste versleutelingssleutelbos en het ondertekeningsgeheim vanaf een veilige back-up. Een back-up van alleen de database bevat geen bestandsbytes.
4. Start één enkele beoogde main-instantie met een release die compatibel is met het herstelde schema. Inspecteer migraties vóór het opstarten, aangezien het startpunt van main deze uitvoert. Workers mogen geen migratieconflicten veroorzaken.
5. Houd productie-ingress en producenten geïsoleerd tijdens de controles. Een gestarte main-instantie kan een leider kiezen en herstelde schema's/herstelbewerkingen uitvoeren; gebruik vóór het opstarten de gedocumenteerde netwerkbeperkingen en workflow-trigger-/herstelcontroles van de noodomgeving. Het herstellen van gegevens is geen passieve voorvertoning.
6. Stem actieve/in de wachtrij geplaatste/openstaande records en eventuele automatische herhalingen af met de eigenaren. Herstel start in aanmerking komende uitvoeringen vanaf het begin opnieuw en kan stroomafwaartse effecten niet ongedaan maken. Voer niet elke mislukte of overgeslagen rij opnieuw uit.
7. Valideer DB-lees-/schrijfbewerkingen, aanmelding, ontsleuteling van inloggegevens, Drive-bestanden, plugins, werkruimtetoegang van codeer-agents en goedgekeurde smoke-workflows (alleen main en distribueerbaar). Voeg compatibele workers geleidelijk toe en open vervolgens de inname en ingress weer.
8. Registreer het werkelijke gegevensverliesinterval, de herstelduur, overgeslagen werkzaamheden en openstaande afstemming. Plan een nieuwe hersteltest als deze procedure een leemte aan het licht heeft gebracht.

**Patikrinimas:** De gedeelde verificatiepoort slaagt, kritieke schema's worden hervat, eigenaren accepteren de afstemming en back-up-/herstelmonitoring is hersteld. Een gezonde lege installatie is geen herstel.

**Eskalavimas:** Incident Lead samen met database-, opslag- en platformbeheerders te allen tijde. Improviseer geen destructieve gegevensmapreparaties of dubbele-locatie-activaties.

## Įrodymų ir perdavimo šablonas
```text
Incident / severity / environment:
Impact and first observed time (UTC):
Main / worker / database / deployment identifiers:
Last release or configuration change:
Affected workflow IDs and execution IDs:
Public health / direct health / DB check:
Connection totals, blocker PIDs, queue depth and oldest age:
Instance eligibility, leader evidence, CPU / memory / disk:
Action taken, timestamp, operator, expected effect:
Verification result and observation window:
Temporary restrictions, reversal owner, expiry:
Skipped / failed / recovered work requiring reconciliation:
Next action, owner, next update time:
```

Verzamel begrensde logs en ID's; verwijder inloggegevens, verificatieheaders, capability-links, gebruikerspayloads en SQL-parametergegevens alvorens bewijsmateriaal toe te voegen. Router-auditgebeurtenissen bevinden zich op stdout van main. De uitvoeringsgeschiedenis registreert de uitvoerende instantie; uitvoeringsfouten kunnen daarom logs van zowel workers als main vereisen.

## Įgyvendinimo nuorodos

Deze paden identificeren de implementatie die is gecontroleerd tijdens het schrijven van dit runbook. Valideer ze opnieuw wanneer het gedrag van uitvoering, implementatie of schema verandert.

| Onderwerp | Bron |
| --- | --- |
| Status- en opstartservices | [main.py](https://github.com/heymrun/heym/blob/main/backend/app/main.py) |
| Pool-instellingen en verbindingstags | [config.py](https://github.com/heymrun/heym/blob/main/backend/app/config.py), [session.py](https://github.com/heymrun/heym/blob/main/backend/app/db/session.py) |
| Aantal processen en migraties | [Backend-startpunt](https://github.com/heymrun/heym/blob/main/backend/entrypoint.sh), [Release-startpunt](https://github.com/heymrun/heym/blob/main/docker/release-entrypoint.sh) |
| Implementatietopologie en werkelijke omgevingstoewijzingen | [Compose](https://github.com/heymrun/heym/blob/main/docker-compose.yml), [Clustervoorbeeld](https://github.com/heymrun/heym/blob/main/docker-compose.cluster.yml), [Workervoorbeeld](https://github.com/heymrun/heym/blob/main/docker-compose.worker.yml), [Kubernetes](../getting-started/kubernetes.md) |
| Geschiktheid en liveness van register | [registry.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/registry.py), [Cluster-API](https://github.com/heymrun/heym/blob/main/backend/app/api/admin_cluster.py) |
| Plaatsing, wachtrijstatussen en verzending | [node_placement.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/node_placement.py), [run_queue.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/run_queue.py), [dispatch.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/dispatch.py) |
| Leiderschap en onderhoud | [distributed_lock.py](https://github.com/heymrun/heym/blob/main/backend/app/services/distributed_lock.py), [cron_scheduler.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cron_scheduler.py) |
| Herstel en annulering | [execution_recovery.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_recovery.py), [execution_cancellation.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_cancellation.py) |
| Endpoints voor pauzeren/hervatten/annuleren van workflows | [workflows.py](https://github.com/heymrun/heym/blob/main/backend/app/api/workflows.py), [workflow_lifecycle.py](https://github.com/heymrun/heym/blob/main/backend/app/services/workflow_lifecycle.py) |
| Definities van diagnostische tabellen en kolommen | [models.py](https://github.com/heymrun/heym/blob/main/backend/app/db/models.py) |
| Capaciteits- en kosteninterpretatie | [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md), [Alerts](../tabs/alerts-tab.md) |
