# Heym Incident Playbook (L0)

Verwenden Sie dieses Playbook, um einen Heym-Vorfall zu bestätigen, die Auswirkungen auf Benutzer zu bewerten, einen Schweregrad festzulegen und das passende Wiederherstellungsverfahren sowie den zuständigen Ansprechpartner zu ermitteln.

Detaillierte Verfahren: [Heym Runbook (L1)](./operations-runbook.md)

Zuletzt überprüft: 2026-11-10. Geltungsbereich: Self-Hosted Heym, Einzelinstanz oder Cluster, auf Docker Compose oder Kubernetes.

## Übergabe des Deployments (Handover)

Füllen Sie diese Tabelle für jede Umgebung aus, bevor Sie diese Dokumente im Bereitschaftsdienst (On-Call) verwenden. Namen, URLs, Kapazitätsziele und Wiederherstellungsziele sind deploymentspezifisch. Repository-Beispiele stellen kein Produktionsinventar dar.

| Element | Wert im Deployment |
| --- | --- |
| Umgebung und öffentliche Heym-URL | `<environment>`, `<public-url>` |
| Plattform-Bereitschaft und Stellvertretung | `<rotation-or-contact>`, `<backup-contact>` |
| Vorfallskanal und Vorfalls-Tracker | `<channel>`, `<tracker-url>` |
| Datenbank-Bereitschaft und Datenbank-Kennung | `<contact>`, `<database-id>` |
| Eigentümer für Infrastruktur, Netzwerk und Speicher | `<contacts>` |
| Release-Verantwortlicher und Deployment-System | `<contact>`, `<deployment-url>` |
| Dashboard für Anwendungsfehler, Latenz und Verfügbarkeit | `<dashboard-url>` |
| Dashboard für Host- oder Pod-CPU, Speicher, Festplatte und Neustarts | `<dashboard-url>` |
| Dashboard für PostgreSQL-Verbindungen, Sperren, Festplatte und Replikation | `<dashboard-url>` |
| Protokolle und optionales OTel-Trace-Backend | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose-Projekt/Dateien oder Kubernetes-Kontext/Namespace | `<exact-target>` |
| Standorte von Main, Workern, Datenbank und Speicher | `<services-or-deployments>`, `<storage-ids>` |
| Genehmigter Smoke-Workflow und erwartetes Ergebnis | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Sicherungsverfahren für Datenbank und Dateien, letzter Wiederherstellungstest | `<procedure-url>`, `<test-date>` |
| Vorgaben für Wiederherstellungszeit und Datenverlust (RTO, RPO) | `<RTO>`, `<RPO>` |

Bewahren Sie Kontakte und Dashboard-Links in der zugriffsgeschützten operativen Kopie des Deployments auf. Nachweise sollten IDs, Zeitstempel, Zählerstände und bereinigte Fehlermeldungen anstelle von Zugangsdaten oder Workflow-Payloads enthalten.

## Plattform-Inventar

| Komponente | Verantwortung | Auswirkung bei Vorfällen |
| --- | --- | --- |
| Frontend und Main-Backend | UI, API, MCP, Portal, interaktive Ausführung | Prüfen Sie die öffentliche Route und den Main-Prozess separat |
| PostgreSQL | Anwendungsstatus, Ausführungsregister, Run-Queue, Nebenläufigkeits-Slots, Koordination und Benachrichtigungen | Ein Datenbankausfall kann sowohl die Anfrageverarbeitung als auch die Hintergrundausführung stoppen |
| Worker-Instanzen, wenn Cluster-Modus aktiv ist | Zulässige Hintergrundläufe in der Warteschlange | Gesunde Worker ersetzen nicht die öffentlichen Endpoints der Main-Instanz |
| Gewählter Leader-Prozess | Cron, Alert-Auswertung, Hintergrundkoordination | Ein kompatibler Worker kann Leader werden; dies ändert nicht seine Rolle zu Main |
| Persistenter Speicher der Main-Instanz | Drive-Dateien, installierte Plugins und Arbeitsbereiche von Coding-Agents | Stellen Sie den Speicher zusammen mit Main wieder her; Ingress-Routing auf einen Worker stellt ihn nicht wieder her |
| Sandbox-Backend auf jeder ausführenden Instanz | Docker-Container oder Kubernetes-Pods für isolierte Ausführung | Ein fehlerhaftes Sandbox-Backend kann bestimmte Knoten beeinträchtigen, während die UI funktioniert |
| Workflow-Abhängigkeiten | Modell-Provider, MCP-Server, externe APIs, Datenspeicher und Messaging-Dienste | Ermitteln Sie, ob eine einzelne Abhängigkeit oder die gesamte Plattform ausfällt |
| Optionaler OTel-Collector | Exportierte Workflow-, Knoten- und Agent-Tool-Spans | Fehlende exportierte Traces allein beweisen nicht, dass die Ausführung fehlgeschlagen ist |

Die integrierte Run-Queue von Heym nutzt PostgreSQL. Redis, RabbitMQ und Vektorspeicher können Workflow-Abhängigkeiten sein; sie sind keine obligatorischen Dienste für die integrierte Warteschlange.

`GET /api/health` meldet ausschließlich Prozesszustand und Version. Er testet weder PostgreSQL, die Warteschlange, Leader-Wahl, Sandbox-Kapazität noch Credential-Synchronisation. Eine grüne Antwort ist eine einzelne Prüfung, keine Garantie für End-to-End-Betriebsbereitschaft.

## Die ersten fünf Minuten

| Schritt | Aktion | Entscheidung oder Nachweis |
| --- | --- | --- |
| 1 | Alert bestätigen und Umgebung, Dienst sowie Startzeit überprüfen | UTC-Zeitstempel und die letzte Release-/Konfigurationsänderung erfassen |
| 2 | Öffentliche UI und `/api/health` prüfen, anschließend das direkte Main-Backend | Öffentlicher Ausfall bei gesundem direktem Backend deutet auf Routing- oder Frontend-Probleme hin |
| 3 | PostgreSQL-Konnektivität und Verbindungsdruck prüfen | Datenbankfehler an L1 weiterleiten, bevor Anwendungsdienste neu gestartet werden |
| 4 | Container-/Pod-Status, CPU, Speicher, Festplatte und aktuelle Fehler prüfen | Infrastrukturfehler, Last und workflowsbezogene Fehler voneinander trennen |
| 5 | Im Cluster-Modus **Einstellungen > Instanzen**, Warteschlangenstatus und Leader-Nachweise prüfen | Ausfall von Main, offline/inkompatible Worker oder rein an Main gebundene Arbeiten identifizieren |
| 6 | Schweregrad zuweisen und eine Gegenmaßnahme aus der Routing-Tabelle starten | Bei P1/P2 sofort einen Vorfall eröffnen und den zuständigen Eigentümer hinzuziehen |
| 7 | Einen sicheren Workflow im Produktionsmodus verifizieren und die Erholung beobachten | Bestätigen, dass sich Alter der Warteschlange, Fehler und Ressourcen verbessern; nächsten Update-Zeitpunkt festlegen |

Fällt ein Release zeitlich mit dem Fehler zusammen, prüfen Sie [Fehlerhaftes Deployment oder Konfigurationsregression](./operations-runbook.md#bad-deployment-or-configuration-regression). Prüfen Sie vor einem Rollback die Schemakompatibilität.

## Schweregrad und Reaktion

Dies sind anfängliche Reaktionsziele. Wenden Sie die Vorfallsrichtlinien und geschäftlichen Auswirkungen des jeweiligen Deployments an, falls diese strenger sind.

| Schweregrad | Beispiele | Reaktion |
| --- | --- | --- |
| P1 | Main für alle Benutzer nicht verfügbar; Datenbank nicht verfügbar oder Schreibvorgänge schlagen fehl; weit verbreitete Ausführungsfehler; kritische Eingänge über alle Workflows hinweg nicht verfügbar | Sofortige Schadensbegrenzung, Vorfallsdokumentation, Plattform- und Abhängigkeits-Bereitschaft |
| P2 | Wachsender Rückstau; Verlust von Worker-Kapazität; drohende Verbindungserschöpfung; ein einzelner Workflow beeinträchtigt geteilte Kapazität; wiederholte OOM-Abstürze | Sofortige Gegenmaßnahmen starten, Eindämmung innerhalb von 15 Minuten anstreben, Vorfallsdokumentation |
| P3 | Isolierter Ausfall eines Workflows/Providers; begrenzte Auswirkung bei gesunder Plattformkapazität | Workflow- oder Komponentenverantwortlicher, nachverfolgte Folgeaufgabe und Notiz im Bereitschaftsdienst |
| P4 | Informelles Signal, erwarteter Kapazitätstrend, verifizierter Fehlalarm | Bestätigen, dokumentieren und Überwachung bei Bedarf anpassen |

## Signal-zu-L1-Routing

Verwenden Sie diese relativen Anker beim Konfigurieren von Alert-Links. Wenn ein Überwachungsdienst eine absolute URL benötigt, stellen Sie den Speicherort Ihrer gehosteten operativen Kopie voran.

| Signal | Hier starten |
| --- | --- |
| UI/API nicht verfügbar, öffentliche 5xx-Fehler, Prozessgesundheitsprüfung fehlgeschlagen | [UI oder API ausgefallen](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL nicht erreichbar, Verbindung verweigert, Schreibfehler | [Datenbank ausgefallen](./operations-runbook.md#postgresql-down-or-not-writable) |
| Zu viele Clients, Pool-Timeout, Sperrwartezeiten, Spitzen bei aktiven Verbindungen | [Datenbankverbindungen und Sperren](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Kontrollierter Neustart von Backend/Worker erforderlich | [Dienstneustart](./operations-runbook.md#controlled-service-restart) |
| Spitzen bei Ausführungsanzahl, Gesamtdauer, Token, CPU oder Arbeitsspeicher | [Ressourcenintensivste Workflows](./operations-runbook.md#most-resource-consuming-workflows) |
| Wachsende Warteschlange, wartende oder anscheinend hängengebliebene Durchläufe | [Warteschlangen-Rückstau](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instanz offline/inkompatibel, Worker im Leerlauf, Scheduler- oder Verteilungsproblem | [Cluster-Prüfungen](./operations-runbook.md#cluster-mode-checks) |
| Main verloren, während Worker weiterhin gesund sind | [Main-Instanz nicht verfügbar](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook-Fehler, MCP/Portal-Ausfälle, SSE-Verbindungsabbrüche | [Ingress- und Ausführungs-Endpoints](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, Festplatte voll, Fehler bei Persistent Volumes | [Container-, Pod- oder Speicherproblem](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Fehler bei Agent/LLM/MCP-Providern, 429, Credential-Fehler | [Modell- oder Integrationsfehler](./operations-runbook.md#model-credential-or-integration-failure) |
| Fehler in Sandboxes von Code/Playwright/Skill/Coding-Agent | [Sandbox-Fehler](./operations-runbook.md#sandbox-failure) |
| Wiederherstellungsziele können nicht eingehalten werden; Datenbank oder Dateien verloren | [Wiederherstellung und Notfallreaktion](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalation

| Feststellung | Hinzuziehen | Bereitstellen |
| --- | --- | --- |
| Mehrere Oberflächen oder Workflows betroffen | Plattform-Bereitschaft und Incident Lead | Umgebung, Umfang, Startzeit, Gegenmaßnahmen, nächstes Update |
| Datenbank nicht verfügbar, gesättigt, gesperrt oder Festplatte voll | Datenbank-Bereitschaft | Datenbank-ID, Verbindungsanzahl, blockierende PIDs, bereinigte Fehler, Speicherstatus |
| Pod-/Knotenausfall, Speicheranbindung, Sandbox-Kapazität | Infrastruktur-/Speicher-Verantwortlicher | Kontext, Namespace, Workload, Pod-Events, Ressourcendruck |
| Öffentliche Route schlägt fehl, während direktes Backend funktioniert | Netzwerk-/Ingress-Verantwortlicher | Betroffene Routen, Statuscodes, Latenz, Vergleich mit direktem Backend |
| Einzelner Workflow dominiert Last oder schlägt isoliert fehl | Workflow-Eigentümer | Workflow-/Run-IDs, Trigger-Quelle, Rate, Zeitfenster, temporäre Limits |
| Korrelierte Deployment- oder Konfigurationsänderung | Release-Verantwortlicher | Image-Digest, Rollout-Zeitpunkt, Schema-Revision, letztes bekanntes fehlerfreies Release |
| Provider-Kontingent, Authentifizierung oder Verfügbarkeit | Credential- oder Integrationsverantwortlicher | Provider, Modell/Dienst, Statuscode, Request-ID sofern sicher; keine Secret-Werte |

Bestehen die P1/P2-Auswirkungen nach der ersten Gegenmaßnahme fort, eskalieren Sie unverzüglich mit den bereits gesammelten Nachweisen. Warten Sie nicht auf die vollständige Ursachenanalyse.

## Erwartetes Ausfallverhalten

| Fehler | Was weiterlaufen kann | Erste Maßnahme |
| --- | --- | --- |
| PostgreSQL nicht verfügbar | Statisches Frontend kann noch laden | Datenbankpfad wiederherstellen; nicht jede Anwendungsinstanz neu starten |
| Main nicht verfügbar, Worker gesund | Zulässige Hintergrundarbeiten und Zeitpläne können fortgesetzt werden, wenn ein kompatibler Worker führt | Main mit seinem persistenten Speicher wiederherstellen; öffentliche UI/API/MCP/Portal bleiben nicht verfügbar |
| Worker nicht verfügbar | Andere zulässige Instanzen übernehmen Arbeiten aus der Warteschlange bei Neuzuweisung | Platzierung, freie Kapazität und Erholung prüfen, bevor Traffic hinzugefügt wird |
| Unterbrochener Durchlauf | Zulässige wiederherstellbare Durchläufe können einmalig von Beginn an neu starten | Automatische Wiederherstellung und externe Seiteneffekte vor manueller Wiederholung prüfen |
| Überlastung durch reine Main-Workloads | Worker können im Leerlauf bleiben | Belastenden Eingang reduzieren oder Main-Kapazität erhöhen; Gewichtungsänderungen können gebundene Arbeiten nicht verschieben |
| Interne Alarmierung nicht verfügbar | Externe Uptime-/DB-/Infra-Überwachung kann noch funktionieren | Überwachung außerhalb von Heym nutzen; Heym-Alerts hängen von derselben DB und demselben Scheduler ab |
| Sandbox oder Provider nicht verfügbar | Workflows ohne diese Abhängigkeit können funktionieren | Betroffene Workflows isolieren und die Abhängigkeit beheben |

## Wiederherstellung und Vorfallsabschluss

1. Überprüfen Sie den öffentlichen Zugriff, den Datenbankzugriff, die vorgesehene Instanzberechtigung und einen sicheren Smoke-Workflow im Produktionsmodus. Ein Test im Editor beweist keine Worker-Verteilung.
2. Beobachten Sie mindestens 10 Minuten lang stabile Fehlerraten, Latenzen, Ressourcennutzung und ein sinkendes Alter der Warteschlange. Beobachten Sie außerdem den nächsten erwarteten kritischen Zeitplan oder eine vereinbarte gleichwertige Smoke-Prüfung.
3. Stimmen Sie fehlgeschlagene, wiederhergestellte, übersprungene, abgelaufene und ausstehende Durchläufe mit den Workflow-Eigentümern ab. Prüfen Sie externe Seiteneffekte, bevor Sie Vorgänge erneut abspielen.
4. Heben Sie temporäre Trigger-Pausen, Limits und Worker-Gewichtungen schrittweise wieder auf. Weisen Sie jeder verbleibenden Einschränkung einen Verantwortlichen und einen Ablaufzeitpunkt zu.
5. Aktualisieren Sie den Vorfall mit Auswirkungen, UTC-Zeitachse, Maßnahmen, Nachweisen und verbleibenden Risiken. Weisen Sie für P1/P2 eine Ursachenanalyse (Post-Mortem) zu und aktualisieren Sie beide Dokumente, falls ein Verfahren gefehlt hat.

## Verwandte Betriebsreferenzen

- [L1 Befehlseinrichtung und Prüfungen](./operations-runbook.md#command-setup)
- [Betrieb und Deployment](../getting-started/running-and-deployment.md)
- [Lastverteilung](./cluster.md)
- [Kubernetes-Deployment](../getting-started/kubernetes.md)
- [Sicherheit und Schlüsselrotation](./security.md)
