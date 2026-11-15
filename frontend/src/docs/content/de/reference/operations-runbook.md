# Heym Runbook (L1)

Befolgen Sie diese Verfahren zur Diagnose und Wiederherstellung von Heym-Diensten, PostgreSQL-Verbindungen, Workflow-Warteschlangen, Cluster-Kapazitäten und der Sandbox-Ausführung.

Beginnen Sie mit dem [Heym Incident Playbook (L0)](./incident-playbook.md) für Schweregrade, Ansprechpartner und das Bereitstellungsinventar.

Zuletzt überprüft: 2026-11-10. Die Befehle entsprechen dem Repository zum Überprüfungszeitpunkt. Bestätigen Sie das bereitgestellte Release und die Topologie vor der Verwendung. Alle unten aufgeführten dienständernden Befehle sind Anweisungen für Operatoren, keine automatische Fehlerbehebung.

## Prozedurindex

| Vorfall |
| --- |
| [UI oder API ausgefallen](#ui-oder-api-ausgefallen) |
| [PostgreSQL ausgefallen oder nicht beschreibbar](#postgresql-ausgefallen-oder-nicht-beschreibbar) |
| [Aktive DB-Verbindungen, Pool-Sättigung und Sperren](#aktive-db-verbindungen-pool-sättigung-und-sperren) |
| [Kontrollierter Dienst-Neustart](#kontrollierter-dienst-neustart) |
| [Workflows mit dem höchsten Ressourcenverbrauch](#workflows-mit-dem-höchsten-ressourcenverbrauch) |
| [Warteschlangen-Rückstau oder scheinbar blockierte Läufe](#warteschlangen-rückstau-oder-scheinbar-blockierte-läufe) |
| [Cluster-Modus-Prüfungen](#cluster-modus-prüfungen) |
| [Hauptinstanz nicht verfügbar, während Worker aktiv sind](#hauptinstanz-nicht-verfügbar-während-worker-aktiv-sind) |
| [Webhook-, MCP-, Portal- oder Streaming-Fehler](#webhook--mcp--portal--oder-streaming-fehler) |
| [Container-, Pod-, OOM- oder Speicherprobleme](#container--pod--oom--oder-speicherprobleme) |
| [Fehlerhafte Bereitstellung oder Konfigurationsregression](#fehlerhafte-bereitstellung-oder-konfigurationsregression) |
| [Modell-, Anmeldedaten- oder Integrationsfehler](#modell--anmeldedaten--oder-integrationsfehler) |
| [Sandbox-Fehler](#sandbox-fehler) |
| [Notfallwiederherstellung und Disaster Response](#notfallwiederherstellung-und-disaster-response) |

## Befehlseinrichtung

Arbeiten Sie aus dem bereitgestellten Checkout oder den Deployment-Werkzeugen heraus. Wählen Sie nur die Topologie aus, die in der betroffenen Umgebung tatsächlich ausgeführt wird. Verwenden Sie niemals ein Beispielprojekt, um einen Produktionsvorfall zu behandeln.

### Docker Compose

Definieren Sie diesen Shell-Helper für die Standard-Compose-Installation:
```bash
heym_compose() { docker compose -f docker-compose.yml "$@"; }
HEYM_MAIN_SERVICE=backend
HEYM_FRONTEND_SERVICE=frontend
```

Für das Cluster-Beispiel des Repositories verwenden Sie stattdessen diese Definition:
```bash
heym_compose() { docker compose -f docker-compose.cluster.yml "$@"; }
HEYM_MAIN_SERVICE=main
HEYM_WORKER_SERVICE=worker-a
```

Für einen eigenständigen Worker auf einem eigenen Host verwenden Sie `docker compose -f docker-compose.worker.yml` und den Dienst `worker`. Er verfügt über keinen lokalen PostgreSQL- oder Frontend-Dienst. Fügen Sie den tatsächlichen Projektnamen, Override-Dateien und die Umgebungsdatei der Bereitstellung in den Helper ein, falls verwendet.
```bash
heym_compose ps
heym_compose images
heym_compose logs --since 15m --tail 200 "$HEYM_MAIN_SERVICE"
docker stats --no-stream
```

Der standardmäßige Compose-Stack veröffentlicht das Frontend standardmäßig auf Host-Port `4017` und PostgreSQL auf `6543`. Sein Backend-Port `10105` ist intern. Das Cluster-Beispiel veröffentlicht die API der Hauptinstanz auf `10105`, die API von worker-a auf `10111` und PostgreSQL auf `6544`. Ein Release-Image kombiniert Frontend und Backend in einem einzigen Container. Überprüfen Sie Port-Zuordnungen mit `ps`.

Für eine direkte Backend-Prozessprüfung innerhalb eines Compose-Hauptcontainers:
```bash
heym_compose exec -T "$HEYM_MAIN_SERVICE" uv run python -c \
  'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:10105/api/health", timeout=5).read().decode())'
```

### Kubernetes

Legen Sie den tatsächlichen Kontext, Namespace und die Workload-Namen fest. Diese Deployment-Namen entsprechen ausschließlich den Beispielen im Repository.
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

Die Basis-Bereitstellung besteht aus einem einzigen Haupt-Replikat mit der Strategie `Recreate`, persistentem Speicher und einer Readiness-Probe auf `/api/health`. Der öffentliche Container-Port ist `4017`; ein reiner Backend-Worker verwendet `10105`. Gehen Sie nicht davon aus, dass ein Neustart oder Rollout ohne Ausfallzeit erfolgt. Siehe [Kubernetes Deployment-Verhalten](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#recreate-deployment).

### Status- und API-Zugriff
```bash
HEYM_PUBLIC_URL='https://your-heym-host.example'
curl --fail --silent --show-error --connect-timeout 3 --max-time 10 \
  "$HEYM_PUBLIC_URL/api/health"
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/"
```

`/api/health` gibt `status`, `service` und `version` zurück; es führt keine Abhängigkeitsprüfung durch. Bestätigen Sie die Datenbank und einen freigegebenen End-to-End-Workflow separat.

Die folgenden authentifizierten Beispiele verwenden eine cURL-Konfigurationsdatei außerhalb dieses Repositories unter `$HEYM_CURL_CONFIG`, die den `Authorization`-Header des Operators enthält. Beschränken Sie deren Berechtigungen auf den Operator, halten Sie sie von der Versionsverwaltung fern und entfernen Sie temporäre Kopien nach der Verwendung. Fügen Sie niemals Token in Befehle, URLs, Protokolle oder Vorfallnotizen ein. Nutzen Sie nach Möglichkeit eine bestehende authentifizierte UI-Sitzung. Überprüfen Sie Statuscodes und das bereitgestellte OpenAPI-Schema im Backend unter `/docs`, bevor Sie eine fehlgeschlagene Mutation wiederholen.

### SQL-Zugriff und Abfragegrenzen

Für die mitgelieferte Compose-Datenbank öffnen Sie eine Sitzung mit der konfigurierten Identität des Datenbankcontainers:
```bash
heym_compose exec postgres sh -c \
  'exec psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Für eine externe Datenbank verwenden Sie eine freigegebene `psql`-Dienstdefinition und Passwortdatei oder die Konsole des Datenbankanbieters. Eine libpq-Verbindung verwendet `postgresql://`, nicht SQLAlchemys `postgresql+asyncpg://`. Testen Sie sowohl über den Netzwerkpfad der betroffenen Anwendung als auch über den DBA-Pfad.

Führen Sie diagnostisches SQL nach Möglichkeit mit einer schreibgeschützten Rolle aus. Zu Beginn jeder Diagnosesitzung:
```sql
SET default_transaction_read_only = on;
SET statement_timeout = '5s';
SET lock_timeout = '1s';
SELECT now() AS observed_at, current_database(), pg_is_in_recovery();
```

Verwenden Sie die vorgesehene beschreibbare primäre Instanz für Anwendungsprüfungen. Ein Replikat antwortet möglicherweise auf `SELECT 1`, während der Schreibpfad nicht verfügbar ist. Details aus `pg_stat_activity` erfordern möglicherweise Datenbanküberwachungsrechte; ausgeblendete Zeilen oder NULL-Felder sind kein Beweis für Inaktivität. Die folgenden Diagnoseabfragen lassen Payloads, Secrets und SQL-Texte aus. Sie aktualisieren keine Heym-Tabellen. Siehe [PostgreSQL Aktivität und Sichtbarkeit](https://www.postgresql.org/docs/16/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW).

## Gemeinsame Verifizierung

Überprüfen Sie nach jeder Gegenmaßnahme den öffentlichen Zugriff, die Reaktionsfähigkeit der Datenbank, einen genehmigten Smoke-Workflow und die relevanten Kapazitäts-/Backlog-Metriken. Verwenden Sie einen sicheren Produktionsmodus-Trigger bei der Überprüfung des Cluster-Dispatches: Editor-Testläufe verbleiben auf der empfangenden Instanz. Beobachten Sie das System mindestens 10 Minuten lang sowie während des nächsten erwarteten kritischen Zeitplans oder einer vereinbarten gleichwertigen Prüfung. Erfassen Sie Änderungen und vereinbaren Sie Verantwortliche/Zeitpunkte zur Aufhebung temporärer Einschränkungen.

## UI oder API ausgefallen

**Schweregrad:** P1 bei weitreichender Nichtverfügbarkeit in der Produktion; P2 bei teilweiser Beeinträchtigung.

**Diagnose**

1. Vergleichen Sie die öffentliche Benutzeroberfläche, das öffentliche `/api/health` und die direkte Prüfung des Haupt-Backends aus der [Befehlseinrichtung](#befehlseinrichtung).
2. Überprüfen Sie den Status des Haupt-/Frontend-Containers oder Pods, aktuelle Fehler sowie CPU/Speicher/Festplatte. Ein statisches Laden der Benutzeroberfläche beweist nicht, dass die API funktioniert.
3. Führen Sie die [Datenbankprüfung](#postgresql-ausgefallen-oder-nicht-beschreibbar) durch. Überprüfen Sie die letzten Release- und Ingress-/Proxy-Änderungen.
4. Wenn nur authentifizierte Anfragen fehlschlagen, unterscheiden Sie abgelaufene Sitzungen/SSO von einem allgemeinen API-Fehler. Setzen Sie keine gemeinsam genutzten Schlüssel zurück, um den Login zu testen.

**Behebung**

1. Beheben Sie zuerst Datenbank- oder Speicherabhängigkeiten, wenn diese den Fehler erklären.
2. Wenn das direkte Backend funktioniert, stellen Sie die Frontend-/Proxy-/Ingress-Route wieder her. Der Ingress muss im Cluster-Modus auf die Hauptinstanz verweisen.
3. Wenn die Hauptinstanz blockiert ist und die Abhängigkeiten fehlerfrei sind, folgen Sie dem [Dienst-Neustart](#kontrollierter-dienst-neustart). Stellen Sie nur den betroffenen Frontend-Dienst wieder her, wenn dieser die fehlerhafte Komponente ist.
4. Bei einer Release-Regression folgen Sie der [Fehlerhaften Bereitstellung](#fehlerhafte-bereitstellung-oder-konfigurationsregression).

**Verifizierung:** Öffentliche Benutzeroberfläche lädt, authentifizierter API-Zugriff ist erfolgreich und ein Smoke-Workflow wird abgeschlossen. Ein grüner Prozess-Endpoint allein reicht nicht aus.

**Eskalation:** Plattform-Bereitschaft bei Backend-Fehlern; Netzwerk-/Ingress-Verantwortliche, wenn nur der öffentliche Pfad fehlschlägt; Datenbank- oder Speicher-Verantwortliche, wenn Abhängigkeitsprüfungen fehlschlagen.

## PostgreSQL ausgefallen oder nicht beschreibbar

**Schweregrad:** P1, wenn Produktionsverbindungen oder Schreibvorgänge fehlschlagen; P2 bei periodischen Beeinträchtigungen.

**Diagnose**

Für mitgeliefertes PostgreSQL:
```bash
heym_compose ps postgres
heym_compose logs --since 15m --tail 150 postgres
heym_compose exec -T postgres sh -c \
  'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

1. `pg_isready` prüft, ob der Server Verbindungen annimmt. Bestätigen Sie den authentifizierten SQL-Zugriff und den Primärstatus mithilfe des [SQL-Zugriffs](#befehlseinrichtung).
2. Prüfen Sie von der betroffenen Instanz aus DNS, Routing, Datenbank-Endpoint/-Port, TLS und Netzwerkrichtlinien. Eine lokale DBA-Verbindung garantiert keine Erreichbarkeit durch die Anwendung.
3. Lesen Sie die bereinigte Fehlermeldung: Verbindung abgelehnt/Timeout, Authentifizierungsfehler, Verbindungserschöpfung, schreibgeschützte Transaktion, Speichererschöpfung oder Migrationsfehler.
4. Überprüfen Sie Festplatte/Inodes des Datenbank-Hosts, Datenbankprotokolle, Failover-/Replikationsstatus und Wartungsereignisse. Nutzen Sie [Verbindungen und Sperren](#aktive-db-verbindungen-pool-sättigung-und-sperren) bei Sättigung.

**Behebung**

1. Reduzieren Sie die Produzentenaufnahme und Wiederholungsstürme. Pausieren Sie störende automatische Trigger über Heym, falls die API funktioniert; koordinieren Sie andernfalls eine Reduzierung des vorgelagerten Datenverkehrs. Vermeiden Sie Massenwiederholungen.
2. Bei einer gestoppten mitgelieferten Datenbank mit verifiziert intaktem Speicher und ohne aktive Failover-/Wiederherstellungsoperation starten Sie ausschließlich den bestehenden Dienst:
```bash
   heym_compose start postgres
   ```

3. Bei verwaltetem PostgreSQL, Netzwerkfehlern, voller Festplatte, Datenbeschädigung oder Failover wenden Sie das Wiederherstellungsverfahren des Datenbankverantwortlichen an. Bewahren Sie das vorhandene Datenbank-Volume und Schlüsselmaterial auf.
4. Sobald die beschreibbare primäre Instanz erreichbar ist, erlauben Sie Pools/Listenern die Wiederverbindung. Starten Sie nur dann eine Anwendungsinstanz neu, wenn diese nach Wiederherstellung des DB-Pfads weiterhin fehlschlägt.
5. Initialisieren Sie niemals eine leere Ersatzdatenbank über einem Vorfall, löschen Sie keine WAL-Dateien und führen Sie kein `docker compose down -v` aus. Wiederherstellungen folgen der [Notfallwiederherstellung](#notfallwiederherstellung-und-disaster-response).

**Verifizierung:** SQL über den Anwendungspfad funktioniert gegen die vorgesehene primäre Instanz, normale Anwendungsschreibvorgänge gelingen über den Smoke-Workflow, Verbindungsfehler stoppen, Heartbeats werden wieder aufgenommen und das Alter der Warteschlange sinkt.

**Eskalation:** Datenbank-Bereitschaft sofort bei P1, Primär-/Failover-Problemen, Datenbeschädigung oder erschöpftem Speicher. Senden Sie Endpoint-Identität, Zeitstempel, Status-/Fehlerklasse und Speicher-/Verbindungsnachweise ohne vertrauliche Anmeldedaten.

## Aktive DB-Verbindungen, Pool-Sättigung und Sperren

**Schweregrad:** P1, wenn keine produktive Arbeit verbinden kann; P2, wenn Auslastung oder Blockaden die Ausführung beeinträchtigen.

**Diagnose**

Führen Sie dies auf dem betroffenen PostgreSQL-Server aus. Die Gesamtsumme gilt serverweit, da andere Datenbanken dasselbe Verbindungslimit beanspruchen. `active` führt eine Abfrage aus; `idle` ist verbunden ohne aktuelle Abfrage. Beide belegen einen Slot. PostgreSQL reserviert einige Slots, sodass normale Clients abgewiesen werden können, bevor die Gesamtzahl `max_connections` erreicht.
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

Heym kennzeichnet Pool- und Listener-Verbindungen mit `heym-<instance-id>`. Vergleichen Sie die Verbindungsgruppe mit den Instanz-Heartbeats und der Prozessanzahl. Ein Idle-Pool ist normal. Eine wachsende `idle in transaction`-Population erfordert eine Untersuchung.
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

Unterscheiden Sie Server-Erschöpfung (`too many clients`) von einem lokalen SQLAlchemy-Pool-Timeout. Ein lokaler Pool kann sättigen, weil Anforderungen Verbindungen halten oder auf Sperren warten, selbst wenn der Server noch freie Slots hat.

Kalkulieren Sie die konfigurierte Spitzenlast, einschließlich Overflow und aller uvicorn-Prozesse:
```text
sum over instances:
  process_count * (async_pool_size + async_max_overflow
                   + sync_pool_size + sync_max_overflow + 4 listeners)
then add other clients, monitoring, and operational headroom
```

Standardwerte pro Prozess sind `HEYM_DB_POOL_SIZE=10`, `HEYM_DB_MAX_OVERFLOW=20`, `HEYM_DB_SYNC_POOL_SIZE=5` und `HEYM_DB_SYNC_MAX_OVERFLOW=10`. Der Standard-Backend-Einstiegspunkt startet 8 Prozesse: Die theoretische Spitze beträgt `8 * (10 + 20 + 5 + 10 + 4) = 392`, vor anderen Clients. Pools wachsen nach Bedarf; dies ist eine Obergrenze, nicht der erwartete offene Zähler. Die dedizierte Sitzung des Leaders wird aus dem asynchronen Pool gehalten. Vier Listener-Verbindungen existieren pro Prozess selbst bei einer Einzelinstanz-Installation; Chat-Streams teilen sich einen Listener.

Lesen Sie die tatsächlichen Einstellungen aus dem bereitgestellten Manifest ab. Beispieldateien überschreiben einige Standardwerte und Prozesszahlen. Das Hinzufügen von Workern fügt auch Pools und Listener hinzu; dies kann den DB-Druck verschärfen.

**Behebung**

1. Drosseln Sie die identifizierten Workloads/Produzenten. Bewahren Sie einen DBA-Zugriffspfad und betrieblichen Spielraum.
2. Bitten Sie den Datenbankverantwortlichen, einzelne Blockierer/lange Transaktionen zu untersuchen. Beenden Sie Heym-Sitzungen nicht massenhaft: Listener und die Advisory-Lock-Sitzung des Leaders sind wesentliche Koordinationspfade. Abfrageabbruch und Sitzungsbeendigung haben unterschiedliche Auswirkungen; der DBA sollte einen bestätigten Verursacher gezielt ansteuern. Siehe [PostgreSQL Serversignale](https://www.postgresql.org/docs/16/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL).
3. Wenn die Kapazität es erfordert, reduzieren Sie Pool-/Overflow-Größen oder die Prozessanzahl über die Bereitstellungskonfiguration und leeren/erstellen Sie Instanzen nacheinander neu. Überprüfen Sie API-Last und Executor-Kapazität nach der Reduzierung. Eine Pooländerung erfordert einen Prozessaustausch; `restart` wendet geänderte Compose-Umgebungswerte nicht an.
4. `docker-compose.yml` leitet die vier Pool-Variablen nicht explizit weiter. Fügen Sie freigegebene Umgebungsüberschreibungen in der tatsächlichen Bereitstellungskonfiguration hinzu, anstatt davon auszugehen, dass ein Host-Eintrag in `.env` den Container erreicht. Cluster- und Worker-Beispiele haben eigene Zuordnungen.
5. Koordinieren Sie jede Erhöhung von `max_connections` mit dem Datenbankverantwortlichen und dem Speicherbudget. Vermeiden Sie gleichzeitige Wiederverbindungen über die gesamte Flotte.

**Verifizierung:** Gesamte Client-Verbindungen stabilisieren sich mit Puffer, Pool-Fehler hören auf, Blockaden lösen sich auf, Listener-/Heartbeat-Fehler stoppen und der Smoke-Workflow ist erfolgreich.

**Eskalation:** Datenbankverantwortliche bei Blockierer-Interventionen oder Verbindungslimit-Änderungen; Plattformverantwortliche bei Verbindungslecks, Pool-Aushungerung oder wiederholten Reconnect-Stürmen.

## Kontrollierter Dienst-Neustart

**Schweregrad:** Erbt den Schweregrad des Vorfalls. Der Neustart der Hauptinstanz unterbricht den öffentlichen Dienst in der dokumentierten Topologie.

**Vor dem Neustart**

1. Bestätigen Sie die Zielinstanz/den Zieldienst und erfassen Sie Protokolle, Image-Digest, Neustartgrund sowie aktive/in der Warteschlange befindliche Lauf-IDs. Bestätigen Sie, dass PostgreSQL und Speicher intakt sind.
2. Reduzieren Sie neue Eingänge. Schalten Sie für einen Worker **On** unter **Einstellungen > Instanzen** in der Benutzeroberfläche aus oder setzen Sie sein Gewicht auf 0. Lassen Sie laufende Arbeiten vor dem Neustart ablaufen.
3. Überprüfen Sie [Ausführungswiederherstellung und -abbruch](#fehlerhafte-bereitstellung-oder-konfigurationsregression). Heym nimmt unvollständige Läufe wieder auf, indem berechtigte Workflows von Anfang an neu ausgeführt werden.
4. Löschen Sie keine Volumes, lassen Sie Umgebungsdateien nicht weg und führen Sie kein reines `docker compose down` aus.

**Einen Dienst mit unveränderter Konfiguration neu starten**
```bash
# Compose main. Use the existing topology helper.
heym_compose restart -t 60 "$HEYM_MAIN_SERVICE"
heym_compose ps "$HEYM_MAIN_SERVICE"
heym_compose logs --since 5m --tail 150 "$HEYM_MAIN_SERVICE"
```

Für einen entleerten Worker des Cluster-Beispiels setzen Sie `$HEYM_WORKER_SERVICE` ein. Das 60-Sekunden-Stopp-Timeout ermöglicht es laufenden Ausführungen, abgeschlossen zu werden oder vor SIGKILL einen sauberen Pausenzustand zu erreichen.

**Vollständiger Compose-Stack-Neustart**

Bevorzugen Sie Einzeldienst-Neustarts. Ein Stack-Neustart stoppt den gesamten Compose-Stack einschließlich PostgreSQL.
```bash
# Kubernetes main. Recreate strategy can cause downtime.
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout restart \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
```

Ersetzen Sie `$HEYM_WORKER_DEPLOYMENT` für einen entleerten Worker. Ein Deployment mit mehreren Replikaten kann einen Rolling-Neustart durchführen. Die Strategie `Recreate` auf der Hauptinstanz beendet den alten Pod vor der Planung des neuen: Erwarten Sie eine Ausfallzeit in Höhe von Herunterfahren, Planung, Volume-Neueinbindung und Start.

**Verifizierung:** Prozess-Gesundheits-Endpoints antworten, PostgreSQL-Verbindungen werden wiederhergestellt, Worker-Heartbeats werden unter **Einstellungen > Instanzen** wieder aufgenommen und der Smoke-Workflow wird abgeschlossen.

**Eskalation:** Plattform-Bereitschaft, wenn der Start hängt oder Probes fehlschlagen; Datenbank-Bereitschaft, wenn der Start in Migrationsschleifen gerät.

## Workflows mit dem höchsten Ressourcenverbrauch

**Schweregrad:** P2, wenn Workflow-Last die Antwortzeiten verschlechtert; P1, wenn Datenbank-, Worker- oder öffentliche Verfügbarkeit bedroht sind.

**Diagnose**

Aktuelle Workflows sortiert nach der gesamten erfassten verstrichenen Dauer:
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

Um Workflows mit hohem Volumen zu identifizieren, führen Sie dieselbe Abfrage mit `ORDER BY recorded_runs DESC` erneut aus.

Aktuelle Workflows sortiert nach durchschnittlicher Dauer mit mindestens 5 Läufen:
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

NULL-Workflow-IDs können Chat- oder Assistentenaktivitäten darstellen. Trace-Datensätze werden für nicht persistent gespeicherte Testläufe im Canvas-Editor nicht generiert.

Setzen Sie die Datenbankzeit mit der Ausführung auf Knotenebene in Beziehung. Zeigen Sie Knotenengpässe im [Reiter Traces](../tabs/traces-tab.md) an. Korrelieren Sie die Workflow-Ausführung mit Spitzen bei Host-/Pod-CPU, Speicher und Datenbankverbindungen.

**Behebung**

1. Bei einem Sturm externer Produzenten drosseln Sie den Webhook- oder API-Konsumenten am Ingress oder API-Gateway, bevor Sie Workflow-Definitionen ändern.
2. Ein Instanzadministrator, der auf den Workflow zugreifen kann, kann dessen automatische Trigger über den unterstützten Endpoint pausieren:
```bash
   HEYM_WORKFLOW_ID='<workflow-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --output /dev/null --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/pause-triggers"
   ```

   Das Pausieren automatischer Trigger stoppt keine bereits laufenden oder in der Warteschlange befindlichen Arbeiten. Es verhindert zukünftige Zeitplan-, Webhook- und Polling-Aufrufe.

3. Bei einer Cluster-Installation legen Sie die Worker-Kapazität unter **Einstellungen > Instanzen** fest oder verlagern Sie den Datenverkehr durch Anpassen der Worker-Gewichtungen.
4. Wenn ein identifizierter aktiver Lauf gestoppt werden muss, fordern Sie den Abbruch unter Verwendung seiner genauen Ausführungs-ID an:
```bash
   HEYM_EXECUTION_ID='<execution-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/executions/$HEYM_EXECUTION_ID/cancel"
   ```

   Bestätigen Sie den endgültigen Verlaufsstatus und die Entfernung aus der Registry. `cancel_requested` arbeitet asynchron: Kooperative Knoten stoppen an Schrittgrenzen, während lang andauernde HTTP- oder LLM-Aufrufe ihre aktuelle Anforderung vor dem Beenden abschließen.

**Verifizierung:** Ausführungshäufigkeit sinkt, Worker-CPU und -Speicher kehren zur Baseline zurück, die Anzahl der Datenbankverbindungen stabilisiert sich und Workflows mit normaler Priorität werden planmäßig wieder aufgenommen.

**Eskalation:** Workflow-Eigentümer zur Überprüfung der Logik oder Reduzierung der Planungshäufigkeit; Plattform-Bereitschaft, wenn der Abbruch die Ausführung nicht beendet.

## Warteschlangen-Rückstau oder scheinbar blockierte Läufe

**Schweregrad:** P2, wenn die Warteschlangenlatenz geschäftliche Schwellenwerte überschreitet; P1, wenn das Warteschlangenwachstum Speicher- oder Datenbankverbindungslimits gefährdet.

**Diagnose**

Führen Sie eine Momentaufnahme unfertiger Warteschlangenzeilen aus. Der Statusfilter schließt ältere unfertige Arbeiten ein, nicht nur kürzliche Neuzugänge.
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

| Status | Interpretation | Maßnahme |
| --- | --- | --- |
| `held` | Wartet auf den Concurrency-Slot des Workflows | Überprüfen Sie das Limit dieses Workflows in den Einstellungen |
| `pending` | Wartet auf Worker-Zuweisung | Worker-Berechtigung und Anzahl aktiver Instanzen unten prüfen |
| `running` | Einem Worker zugewiesen, Ausführung aktiv | Worker-Heartbeat und Thread-Gesundheit prüfen |
| `waiting_hitl` | Pausiert für menschliche Freigabe | Erwarteter Status; mit Workflow-Eigentümer abstimmen |
| `cancel_requested` | Abbruch bestätigt, wartet auf Schrittgrenze | Auf Beendigung überwachen; eskalieren bei Stillstand |

Prüfen Sie auf veraltete oder verwaiste Läufe, deren zugewiesener Worker keine Heartbeats mehr sendet:

1. In Einzelinstanz-Installationen bestätigen Sie, dass der Hauptdienst über verbleibende Concurrency-Kapazität verfügt.
2. Öffnen Sie **Einstellungen > Instanzen** als Instanzadministrator oder fordern Sie Folgendes an:
```bash
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/api/admin/cluster"
   ```

3. Prüfen Sie `cluster_enabled`, `live`, `compatible`, `enabled`, `weight`, `credentials_synced`, das Heartbeat-Alter, die DB-Latenz und die Sandbox-Verfügbarkeit (`docker_ok`). Eine Instanz benötigt sowohl Eignung als auch Liveness, um verteilte Arbeit zu erhalten. Der historische Name `docker_ok` deckt auch die Erreichbarkeit der Kubernetes-Sandbox ab.
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

Die SQL-Heartbeat-Ansicht ist ein Beleg, keine vollständige Kompatibilitätsberechnung. Nutzen Sie die administrative API für Kompatibilitäts- und Schlüsselrotationslogik. Heartbeats laufen alle 10 Sekunden; ein Heartbeat-Alter über 30 Sekunden weist auf Netzwerkpartitionierung oder blockierte Worker-Prozesse hin.

**Behebung**

1. Wenn Worker fehlerfrei, aber ausgelastet sind, skalieren Sie Worker-Replikate oder fügen Sie Instanzen gemäß [Cluster-Skalierung](#cluster-modus-prüfungen) hinzu.
2. Bei einem verwaisten Lauf auf einem ausgefallenen Worker lösen Sie die Wiederherstellung aus oder brechen Sie die Ausführung mithilfe der [Ausführungswiederherstellung](#kontrollierter-dienst-neustart) ab.
3. Wenn anstehende Läufe auf einem deaktivierten oder inkompatiblen Worker warten, aktivieren Sie den Worker erneut oder aktualisieren Sie seine Anmeldedaten unter **Einstellungen > Instanzen**.
4. Wenn die Warteschlange durch einen externen Wiederholungssturm mit doppelten Anforderungen überflutet wird, pausieren Sie den Trigger am Ingress oder nutzen Sie [Workflow pausieren](#workflows-mit-dem-höchsten-ressourcenverbrauch).

**Verifizierung:** Die Warteschlangenlänge tendiert nach unten, ausstehende Läufe wechseln innerhalb der erwarteten Latenz zu 'running' und Heartbeats zeigen aktive Worker-Kapazität.

**Eskalation:** Plattform-Bereitschaft bei Blockaden des Scheduler-Dispatches; Datenbank-Bereitschaft, wenn Abfragen zur Warteschlangenabfrage Sperrkonflikte aufweisen.

## Cluster-Modus-Prüfungen

**Schweregrad:** P2 bei Offline-Workern oder verminderter Kapazität; P1, wenn die Cluster-Koordination vollständig ausfällt.

**Diagnose**

Die SQL-Heartbeat-Ansicht liefert eine Übersicht über alle Instanzen.

Wichtige Felder:

- `compatible`: Muss `true` sein. Ein inkompatibler Worker wird von der Platzierung ausgeschlossen.
- `heartbeat_age_seconds`: Werte über 30 Sekunden weisen auf potenzielle Netzwerkpartitionen oder blockierte Worker-Prozesse hin.
- `weight`: Relative Worker-Kapazität. Ein Gewicht von 0 deaktiviert die Platzierung auf dieser Instanz.
- `credentials_complete`: Muss für Workflows, die freigegebene Anmeldedaten erfordern, `true` sein.

**Behebung**

1. Bei einem Offline-Worker prüfen Sie den Pod-/Container-Status und die Protokolle auf dem Worker-Host. Folgen Sie dem [Dienst-Neustart](#kontrollierter-dienst-neustart).
2. Bei einem inkompatiblen Worker überprüfen Sie die Image-Versionen über alle Cluster-Instanzen hinweg. Alle Instanzen müssen dasselbe Release ausführen. Folgen Sie der [Fehlerhaften Bereitstellung](#fehlerhafte-bereitstellung-oder-konfigurationsregression).
3. Bei fehlenden Anmeldedaten aktualisieren Sie freigegebene Anmeldedaten von der Hauptinstanz aus unter **Einstellungen > Anmeldedaten**.
4. Um einen Worker für Wartungsarbeiten kontrolliert zu entleeren, setzen Sie dessen Gewicht auf 0 oder schalten Sie **On** unter **Einstellungen > Instanzen** aus. Lassen Sie laufende Arbeiten vor dem Stoppen beenden.

**Verifizierung:** Der Worker-Heartbeat setzt innerhalb von 30 Sekunden wieder ein, `compatible` ist `true` und ein Test-Workflow wird an den wiederhergestellten Worker disponiert.

**Eskalation:** Plattform-Bereitschaft bei Netzwerkpartitionen zwischen Instanzen oder Konflikten um geteilte Datenbanksperren.

## Hauptinstanz nicht verfügbar, während Worker aktiv sind

**Schweregrad:** P1. Die Hauptinstanz koordiniert die Zeitplanung, stellt UI/API bereit und verwaltet den Cluster-Status.

**Diagnose**

1. Bestätigen Sie den Prozessstatus und die Ressourcennutzung der Hauptinstanz mithilfe der [Befehlseinrichtung](#befehlseinrichtung).
2. Überprüfen Sie die Datenbankkonnektivität vom Host der Hauptinstanz aus. Worker können lokal zwischengespeicherte Läufe weiterverarbeiten, während die Hauptinstanz nicht erreichbar ist.
3. Überprüfen Sie das Reverse-Proxy- / Ingress-Routing zur Hauptinstanz.

**Behebung**

1. Wenn die Hauptinstanz aufgrund von OOM oder einer unbehandelten Ausnahme abgestürzt ist, starten Sie sie gemäß [Kontrollierter Dienst-Neustart](#kontrollierter-dienst-neustart) neu.
2. Wenn die Hauptinstanz auf eine Datenbanksperre wartet, die von einem ausgefallenen Worker gehalten wird, folgen Sie [Verbindungen und Sperren](#aktive-db-verbindungen-pool-sättigung-und-sperren).
3. Überprüfen Sie in Kubernetes, ob die Strategie `Recreate` die Pod-Beendigung abgeschlossen hat, bevor der Ersatz geplant wurde.

**Verifizierung:** Die öffentliche Benutzeroberfläche lädt, der API-Gesundheits-Endpoint gibt HTTP 200 zurück, Worker-Heartbeats im Cluster melden sich wieder bei der Hauptinstanz und die Editor-Arbeitsfläche funktioniert ordnungsgemäß.

**Eskalation:** Incident Commander unverzüglich; Plattform-Bereitschaft bei Speicher- oder Node-Fehlern.

## Webhook-, MCP-, Portal- oder Streaming-Fehler

**Schweregrad:** P2 bei endpoint-spezifischer Beeinträchtigung; P1, wenn öffentliche Webhooks über alle Workflows hinweg stillschweigend fehlschlagen.

**Diagnose**

1. Bei Webhook-Fehlern überprüfen Sie Ingress-Routing, SSL-Terminierung und die Pfadpräfix-Konfiguration. Bestätigen Sie, dass der Webhook-Endpoint existiert und aktiv ist.
2. Bei SSE-Streaming-Fehlern prüfen Sie die Proxy-Pufferungseinstellungen. Ingress-Proxys (nginx, traefik, envoy) müssen die Antwortpufferung (`X-Accel-Buffering: no` oder gleichwertig) für `/api/chat/stream` und das Streaming von Workflow-Ausführungen deaktivieren.
3. Bei MCP-Fehlern überprüfen Sie die Gültigkeit des MCP-API-Keys, die Transportkonfiguration (SSE vs. stdio) und die Tool-Registrierung unter **Einstellungen > MCP**.
4. Überprüfen Sie die Fehlerprotokolle auf der Hauptinstanz auf Autorisierungsfehler, ungültige JSON-Payloads oder Ablehnungen bei der Schemavalidierung.

**Behebung**

1. Deaktivieren Sie die Proxy-Pufferung auf Streaming-Pfaden auf der Ingress- oder Reverse-Proxy-Ebene.
2. Bei Ablehnung von Webhook-Payloads überprüfen Sie die JSON-Struktur anhand der Spezifikation des Workflow-Triggers. Aktualisieren Sie externe Aufrufer, falls Payloads fehlerhaft sind.
3. Bei MCP-Verbindungsabbrüchen starten Sie die betroffene MCP-Client-Sitzung neu oder authentifizieren Sie sich mit einem frischen Token erneut.

**Verifizierung:** Test-Webhook antwortet mit HTTP 200/202, SSE-Stream liefert inkrementelle Chunks ohne Stillstand und der MCP-Client listet Tools erfolgreich auf.

**Eskalation:** Netzwerk-Bereitschaft bei Ingress-/Pufferungsproblemen; Workflow-Autor bei Diskrepanzen im Payload-Schema.

## Container-, Pod-, OOM- oder Speicherprobleme

**Schweregrad:** P1, wenn Hauptinstanz oder Datenbank betroffen sind; P2 bei isolierten Worker-Neustarts.

**Diagnose**
```bash
# Compose container state and host filesystem pressure.
heym_compose ps
docker stats --no-stream
df -h
df -i
```

Überprüfen Sie sowohl das tatsächliche Dateisystem des Daten-Volumes und den Datenbank-Host als auch den Shell-Host. Schreibgeschützter Container-Status ohne Umgebungswerte:
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

Untersuchen Sie OOMKilled im Vergleich zu fehlgeschlagenen Probes, Image-Pulls, ausstehender Planung (Pending), Node-Druck und Volume-Attach-/-Mount-Fehlern. Vorherige Protokolle existieren nur, wenn der Pod neu gestartet wurde, ohne neu geplant zu werden.

## Fehlerhafte Bereitstellung oder Konfigurationsregression

**Schweregrad:** P1, wenn Produktionsverbindungen, Auftragsverarbeitung oder Migrationen fehlschlagen; P2 bei isolierten Funktionsregressionen.

**Diagnose:** Vergleichen Sie den Fehlerbeginn mit dem Rollout, den tatsächlichen Image-Digests, der Konfigurations-/Geheimnisrevision, dem Migrationsstatus und der letzten bestätigten Änderung. Prüfen Sie den Bereitstellungsverlauf und bereinigte Diffs. Fügen Sie niemals vollständige Umgebungsvariablen, gerenderte Compose-Secrets oder Kubernetes-Secret-Daten in einen Vorfallbericht ein.
```sql
SELECT version_num FROM alembic_version;
```

```bash
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout history \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
```

**Behebung**

1. Stoppen Sie den Rollout und riegeln Sie externen Datenverkehr ab, wenn Fehler die Datenintegrität gefährden oder auf Abhängigkeiten übergreifen.
2. Überprüfen Sie den letzten bekannten funktionierenden Image-Digest, den Git-Commit und die Helm-/Manifest-Revision. Prüfen Sie jüngste ConfigMap-, Secret- und Umgebungs-Diffs.
3. Wenn schemakompatibel, stellen Sie das freigegebene Image bzw. die Konfiguration über die Bereitstellungswerkzeuge wieder her. Rollen Sie auf eine bestimmte geprüfte Revision zurück, nicht auf eine angenommene vorherige:
```bash
   HEYM_ROLLBACK_REVISION='<approved-revision-number>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout undo \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --to-revision="$HEYM_ROLLBACK_REVISION"
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
   ```

4. Ein Deployment-Rollback stellt das Pod-Template wieder her; es stellt keine externen Secret- oder ConfigMap-Werte wieder her, wenn diese überschrieben wurden. Machen Sie Konfigurationsänderungen parallel rückgängig.
5. Führen Sie niemals ein Downgrade eines Release-Images über eine inkompatible Datenbankschemamigration hinweg durch. Wenn eine Migration irreversible Tabellen- oder Spaltenänderungen vorgenommen hat, beheben Sie den Fehler vorwärts mit einem getesteten Hotfix oder stellen Sie die Datenbank über [Notfallwiederherstellung](#notfallwiederherstellung-und-disaster-response) wieder her.
6. Starten Sie nach dem Rollback abhängige Worker neu, um sicherzustellen, dass die gesamte Flotte denselben Release-Stand ausführt.

**Verifizierung:** Gesundheitsprüfungen antworten mit 200, Worker melden dieselbe Release-Version in **Einstellungen > Instanzen**, Schema-Migrationsversion entspricht dem Ziel-Release und der Smoke-Workflow ist erfolgreich.

**Eskalation:** Incident Lead und Release Engineer sofort bei P1. Binden Sie den Datenbankadministrator ein, wenn Migrationsbereinigung oder Schemawiederherstellung erforderlich ist.

## Modell-, Anmeldedaten- oder Integrationsfehler

**Schweregrad:** P2 bei Ausfall einzelner Anbieter oder Ratenbegrenzungen; P1, wenn kein konfiguriertes Modell für Workflows antwortet.

**Diagnose**

1. Unterscheiden Sie zwischen anbieterseitigem Ausfall, Ablauf/Widerruf von Anmeldedaten, Ratenbegrenzung (HTTP 429) und Netzwerk-Timeouts.
2. Prüfen Sie die Statusseiten der Anbieter (OpenAI, Anthropic, Google AI etc.).
3. Testen Sie die Gültigkeit von Anmeldedaten unter **Einstellungen > Anmeldedaten** über die integrierte Test-Schaltfläche.
4. Überprüfen Sie die Anwendungsprotokolle auf Fehlerklassifizierungen: `RateLimitError`, `AuthenticationError`, `InvalidRequestError` oder `APIConnectionError`.

**Behebung**

1. Bei Ratenbegrenzung (429) schalten Sie Workflow-Knoten auf Ausweich-Anmeldedaten oder ein Anbietermodell mit verfügbarer Quote um.
2. Bei abgelaufenen Anmeldedaten rotieren Sie den Schlüssel unter **Einstellungen > Anmeldedaten**. Heym aktualisiert gemeinsam genutzte Anmeldedaten über alle Cluster-Worker hinweg.
3. Bei Ausfällen vorgelagerter Anbieter pausieren Sie betroffene Workflows vorübergehend oder konfigurieren Sie ein alternatives Modell-Routing.

**Verifizierung:** Der Test der Anmeldedaten ist in der Benutzeroberfläche erfolgreich, die Agent-Ausführung wird ohne HTTP 4xx/5xx-Fehler abgeschlossen und die Wiederholungsverzögerungen bei Ratenbegrenzungen lösen sich auf.

**Eskalation:** Eigentümer der Anmeldedaten / Teamleiter für Abrechnung oder Schlüsselerneuerung; externer Anbietersupport bei großflächigen Ausfällen.

## Sandbox-Fehler

**Schweregrad:** P2 bei isolierten Fehlern von Code-Knoten; P1, wenn die Sandbox-Ausführung für geschäftskritische Workflows erforderlich ist.

**Diagnose**

1. Identifizieren Sie den Sandbox-Ausführungsmodus: lokaler Prozess, Docker-Container oder Kubernetes-Pod-Sandbox.
2. Überprüfen Sie die Reaktionsfähigkeit des Docker-Daemons auf dem Sandbox-Host oder die Planung der Kubernetes-Sandbox-Pods.
3. Kubernetes: Überprüfen Sie Sandbox-Pods im konfigurierten Sandbox-Namespace, deren Ereignisse und Netzwerkrichtlinien. Sandboxes können einen separaten Namespace verwenden:
```bash
   HEYM_SANDBOX_NAMESPACE='<actual-sandbox-namespace>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_SANDBOX_NAMESPACE" get pods \
     -l app.kubernetes.io/managed-by=heym -L heym.run/sandbox,heym.run/instance
   ```

4. Überprüfen Sie das konfigurierte `HEYM_SANDBOX_BACKEND` und typspezifische Sandbox-Einstellungen in den Umgebungsvariablen.
5. Wenn Docker-Container fehlschlagen, stellen Sie sicher, dass der Docker-Socket gemountet ist und der Heym-Benutzer über Berechtigungen zur Interaktion mit dem Daemon verfügt.
6. Stellen Sie bei Kubernetes-Sandboxes sicher, dass das Dienstkonto über Berechtigungen zum Erstellen und Verwalten von Pods im Sandbox-Namespace verfügt.

**Verifizierung:** Der Code-Knoten wird erfolgreich in der isolierten Sandbox ausgeführt, gibt erwartete Ergebnisse zurück und Sandbox-Ressourcen werden nach der Ausführung ordnungsgemäß bereinigt.

**Eskalation:** Plattform-Bereitschaft bei Host-Level-Docker-Daemon-Problemen oder Ausfällen der Kubernetes-Sandbox-Infrastruktur.

## Notfallwiederherstellung und Disaster Response

**Schweregrad:** P1 für katastrophalen Datenverlust, Host-Ausfall oder vollständige Zerstörung der Umgebung.

**Vorgehensweise**

1. Deklarieren Sie den Notfallvorfall und benennen Sie einen Incident Commander. Benachrichtigen Sie alle Beteiligten über bestehende Notfallkanäle.
2. Isolieren Sie die beschädigte Umgebung, um weiteren Datenverlust oder widersprüchliche Schreibvorgänge zu verhindern. Verhindern Sie, dass alte und neue Installationen gleichzeitig denselben Workload verarbeiten.
3. Stellen Sie PostgreSQL über das getestete Backup-/PITR-Verfahren in der vorgesehenen Wiederherstellungsumgebung wieder her. Stellen Sie die passenden Datei-/Plugin-/Coding-Workspace-Daten der Hauptinstanz sowie den erforderlichen Verschlüsselungsschlüsselbund und das Signierungsgeheimnis aus dem sicheren Backup wieder her. Ein reines Datenbank-Backup enthält keine Dateibytekontingente.
4. Starten Sie eine einzelne vorgesehene Hauptinstanz unter Verwendung eines mit dem wiederhergestellten Schema kompatiblen Releases. Überprüfen Sie Migrationen vor dem Start, da der Einstiegspunkt der Hauptinstanz diese ausführt. Worker dürfen keine Migrationskonflikte verursachen.
5. Halten Sie den Produktions-Ingress und Produzenten während der Prüfungen isoliert. Eine gestartete Hauptinstanz kann einen Leader wählen und wiederhergestellte Zeitpläne/Wiederherstellungen ausführen; nutzen Sie vor dem Start die dokumentierten Netzwerkbeschränkungen und Workflow-Trigger-/Wiederherstellungskontrollen der Wiederherstellungsumgebung. Das Wiederherstellen von Daten ist keine passive Vorschau.
6. Gleichen Sie aktive/in Warteschlange befindliche/ausstehende Datensätze und etwaige automatische Wiederholungen mit den Eigentümern ab. Die Wiederherstellung startet berechtigte Läufe von Anfang an neu und kann nachgelagerte Auswirkungen nicht rückgängig machen. Führen Sie nicht jede fehlgeschlagene oder übersprungene Zeile erneut aus.
7. Validieren Sie DB-Lese-/Schreibvorgänge, Login, Entschlüsselung von Anmeldedaten, Drive-Dateien, Plugins, Workspace-Zugriff von Coding-Agents und genehmigte nur-Hauptinstanz-/verteilbare Smoke-Workflows. Fügen Sie kompatible Worker schrittweise hinzu und öffnen Sie anschließend Eingang und Ingress wieder.
8. Erfassen Sie das tatsächliche Datenverlustintervall, die Wiederherstellungsdauer, übersprungene Arbeiten und ausstehende Abgleiche. Vereinbaren Sie einen weiteren Wiederherstellungstest, falls dieses Verfahren Lücken aufgedeckt hat.

**Verifizierung:** Das gemeinsame Verifizierungs-Gate wird bestanden, kritische Zeitpläne werden wieder aufgenommen, Eigentümer akzeptieren den Abgleich und die Backup-/Wiederherstellungsüberwachung ist wiederhergestellt. Eine intakte leere Installation ist keine Wiederherstellung.

**Eskalation:** Incident Lead sowie Datenbank-, Speicher- und Plattformverantwortliche durchgehend einbinden. Improvisieren Sie keine destruktiven Datenverzeichnis-Reparaturen oder Dual-Site-Aktivierungen.

## Vorlage für Nachweise und Übergabe
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

Erfassen Sie begrenzte Protokolle und IDs; entfernen Sie Werte von Anmeldedaten, Auth-Header, Capability-Links, Benutzer-Payloads und SQL-Parameterdaten, bevor Sie Nachweise anhängen. Router-Audit-Ereignisse befinden sich auf stdout der Hauptinstanz. Der Ausführungsverlauf zeichnet die ausführende Instanz auf; Ausführungsfehler können daher Protokolle sowohl von Workern als auch von der Hauptinstanz erfordern.

## Implementierungsreferenzen

Diese Pfade identifizieren die Implementierung, die beim Verfassen dieses Runbooks überprüft wurde. Validieren Sie diese erneut, wenn sich Ausführungs-, Bereitstellungs- oder Schemaverhalten ändern.

| Gegenstand | Quelle |
| --- | --- |
| Status- und Startdienste | [main.py](https://github.com/heymrun/heym/blob/main/backend/app/main.py) |
| Pool-Einstellungen und Verbindungskennungen | [config.py](https://github.com/heymrun/heym/blob/main/backend/app/config.py), [session.py](https://github.com/heymrun/heym/blob/main/backend/app/db/session.py) |
| Prozessanzahl und Migrationen | [Backend-Einstiegspunkt](https://github.com/heymrun/heym/blob/main/backend/entrypoint.sh), [Release-Einstiegspunkt](https://github.com/heymrun/heym/blob/main/docker/release-entrypoint.sh) |
| Bereitstellungstopologie und tatsächliche Umgebungsausprägungen | [Compose](https://github.com/heymrun/heym/blob/main/docker-compose.yml), [Cluster-Beispiel](https://github.com/heymrun/heym/blob/main/docker-compose.cluster.yml), [Worker-Beispiel](https://github.com/heymrun/heym/blob/main/docker-compose.worker.yml), [Kubernetes](../getting-started/kubernetes.md) |
| Registry-Berechtigung und Liveness | [registry.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/registry.py), [Cluster-API](https://github.com/heymrun/heym/blob/main/backend/app/api/admin_cluster.py) |
| Platzierung, Warteschlangenstatus und Dispatch | [node_placement.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/node_placement.py), [run_queue.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/run_queue.py), [dispatch.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/dispatch.py) |
| Leadership und Wartung | [distributed_lock.py](https://github.com/heymrun/heym/blob/main/backend/app/services/distributed_lock.py), [cron_scheduler.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cron_scheduler.py) |
| Wiederherstellung und Abbruch | [execution_recovery.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_recovery.py), [execution_cancellation.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_cancellation.py) |
| Endpoints zum Pausieren/Fortsetzen/Abbrechen von Workflows | [workflows.py](https://github.com/heymrun/heym/blob/main/backend/app/api/workflows.py), [workflow_lifecycle.py](https://github.com/heymrun/heym/blob/main/backend/app/services/workflow_lifecycle.py) |
| Diagnosetabellen- und Spaltendefinitionen | [models.py](https://github.com/heymrun/heym/blob/main/backend/app/db/models.py) |
| Kapazitäts- und Kosteninterpretation | [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md), [Alerts](../tabs/alerts-tab.md) |
