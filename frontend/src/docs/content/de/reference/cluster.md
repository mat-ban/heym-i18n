# Lastverteilung

Richte eine zweite Heym-Instanz auf dieselbe PostgreSQL-Datenbank und sie tritt als Worker bei. Hintergrund-Workflow-Ausführungen werden dann zwischen den Instanzen nach einem von dir festgelegten Prozentsatz aufgeteilt, sodass die Maschine, die die UI und die API bedient, nicht auch die einzige Maschine ist, die jeden Workflow ausführt.

Die Instanzen kommunizieren nie miteinander. Postgres trägt die Arbeit, daher benötigt ein Worker keinen offenen Port, kein Zertifikat und keine Route zurück zur Hauptinstanz — nur Datenbankzugriff.

## Rollen

Eine Instanz ist **main**, festgelegt durch eine Umgebungsvariable. Sie bedient die UI, die API, MCP und das Chat-Portal und besitzt den Dateispeicher und die installierten Plugins. Jede andere Instanz ist ein **Worker**: Sie erreicht nur die Datenbank und führt Hintergrundausführungen aus.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

Die main-Rolle ist getrennt von der Leader-Wahl. Heym wählt bereits einen Leader über den Cluster, um Cron, Warnungs-Evaluierung und Absturz-Wiederherstellung zu verwalten; wenn main ausfällt, wandert die Führung innerhalb weniger Sekunden zu einem Worker und geplante Ausführungen werden weiterhin ausgelöst. Die main-Rolle wandert nicht, da der Dateispeicher nicht mitwandern kann.

## Was die Hauptinstanz verlassen kann

Die Platzierung wird anhand der Knoten des Workflows entschieden, bevor die Ausführung beginnt. Eine Ausführung bleibt auf main, wenn irgendein Knoten darin — einschließlich Knoten innerhalb von Sub-Workflows, die sie aufruft — etwas berührt, das nur auf einer Maschine existiert:

| Knoten | Warum er auf main bleibt |
|---|---|
| Codex, OpenCode Go | Der Coding-Agent-Workspace bleibt auf der lokalen Festplatte, damit ein Folgeaufruf darin fortgesetzt werden kann |
| Agent mit angehängtem Skill | Der Skill-Code liest und schreibt Heym Drive |
| Drive, Converter, Google Drive | Sie lesen und schreiben generierte Dateien |
| File Upload-Trigger | Der Upload landet auf der Festplatte von main |
| Send Email | Unternehmens-SMTP-Relays erlauben üblicherweise nur eine Quelladresse |
| Plugin-Knoten | Ein Plugin ist auf der Festplatte einer Instanz installiert |

**Alles andere wird verteilt** — einschließlich des Code-Knotens, Playwright und Agent Python-Tools. Jede Instanz führt dasselbe Image mit ihrem eigenen Docker-Socket aus, daher ist eine Sandbox kein Grund, eine Ausführung auf main zu behalten, und dies sind die CPU-hungrigsten Knoten im Produkt.

Ein Workflow, dessen Sub-Workflow durch einen Ausdruck gewählt wird, kann nicht im Voraus inspiziert werden, daher bleibt er auf main.

## Prozentsätze wählen

Gewichtungen sind ganze Zahlen, die unter **Einstellungen → Instanzen** festgelegt werden. Sie sind **Anteile der Instanzen, die derzeit Arbeit annehmen können**, nicht Prozentsätze von 100: Der Scheduler teilt durch die eigene Summe dieses Pools.

Dieser Unterschied zeigt sich, sobald eine Instanz ausfällt. Mit `Main 41, Worker A 26, Worker B 33` hinterlässt das Ausschalten von Worker B einen Pool von 67, sodass Main tatsächlich 41/67 = **61%** und Worker A 26/67 = **39%** erhält. Das Panel druckt die effektive Aufteilung unter der Tabelle genau aus diesem Grund aus, und das Speichern wird nie blockiert, weil die Zahlen nicht 100 ergeben — nur eine Aufteilung, bei der keine aktivierte Instanz eine Gewichtung hat, wird abgelehnt.

Zwei weitere Dinge sind leicht falsch zu verstehen.

**Ein Prozentsatz ist kein Anteil an Maschinenleistung.** Er deckt nur Ausführungen ab, die durch die Warteschlange gehen. Das Bedienen der UI und der API, das Streaming von Editor- und Portal-Ausführungen und die Handhabung von Datei-Uploads sind alles Arbeit von main, und nichts davon wird gezählt. Main leistet mehr, als seine Zahl aussagt.

**Der Prozentsatz von main ist eine Obergrenze, keine Untergrenze.** Ausführungen, die nur auf main ausgeführt werden können, werden gegen sein Kontingent angerechnet, sodass, sobald dieses Kontingent aufgebraucht ist, die verbleibenden verteilbaren Ausführungen an die Worker fallen. Mains Zahl niedrig zu setzen ist sicher — Arbeit, die dort ausgeführt werden muss, wird trotzdem dort ausgeführt. Sie hoch zu setzen hungert die Worker aus.

Bei einem starken main und einem kleineren Worker beginne also eher bei 60/40 als beim rohen Verhältnis der Maschinen und vergleiche dann echte Ausführungsdauern im Reiter Ausführungen und passe an.

Gewichtungen werden über die derzeit aktiven und aktivierten Instanzen renormalisiert. Mit `main=70, A=15, B=15` wird die Aufteilung, wenn A offline geht, zu 70/85 und 15/85 zwischen main und B und kehrt zu 70/15/15 zurück, wenn A wieder da ist.

**Eine Instanz, die zurückkommt, hat keinen Anspruch auf die verpassten Ausführungen.** Zeit, die Offline, Deaktiviert oder auf einer nicht übereinstimmenden Version verbracht wurde, wird nicht gegen sie gezählt, sodass ein Worker, der eine Nacht nicht verfügbar war, an der aktuellen Position des Pools wieder beitritt und die Aufteilung ab seiner ersten Ausführung wieder 70/30 anzeigt — er absorbiert nicht jede Ausführung, bis er aufgeholt hat. Ein Worker, der die ganze Zeit verfügbar war, holt trotzdem auf, was den Prozentsatz von main zu einer Obergrenze macht.

### Eine neue Instanz tritt bei null bei

Eine Instanz, der nie eine Gewichtung gegeben wurde, startet bei 0, was sie Live, Aktiviert und nichts empfangend zurücklassen würde. **Neuen Instanzen automatisch einen Anteil geben** — standardmäßig aktiviert, unter der Instanzen-Tabelle — behebt das: Beim nächsten Durchlauf des Leaders erhält der Neuankömmling einen gleichen Anteil am Pool, und die bestehenden Gewichtungen werden herunterskaliert, wobei ihre Verhältnisse zueinander erhalten bleiben, sodass ein bewusstes 70/30 danach immer noch ungefähr als 70/30 gelesen wird. Die Summe bleibt exakt 100.

Dies läuft **einmal pro Instanz**. Sowohl der automatische Durchlauf als auch deine eigene Bearbeitung markieren die Instanz als konfiguriert, sodass eine Instanz, die du selbst festgelegt hast, nie hinter deinem Rücken geändert wird — einschließlich einer, die du bewusst auf 0 gesetzt hast. Schalte die Einstellung aus, wenn du es vorziehst, dass jede neue Maschine auf dich wartet.

Nur aktivierte, aktive und kompatible Instanzen nehmen teil. Einem Rechner einen Anteil zu geben, der nichts ausführen kann, würde diesen Anteil stranden lassen.

### Wann Prozentsätze nicht helfen können

Das Einstellungs-Panel meldet, wie viele der Ausführungen der letzten 24 Stunden nur auf main ausgeführt werden konnten. Wenn diese Zahl hoch ist — eine Codex-lastige oder Drive-lastige Arbeitslast —, werden die Worker untätig bleiben, egal was die Gewichtungen sagen, und die Antwort ist eine größere main-Instanz statt mehr von ihnen.
## Dimensionierung von PostgreSQL für einen Cluster

Verbindungen skalieren mit Instanzen, nicht nur mit Benutzern. Jede Instanz führt mehrere uvicorn-Prozesse aus, und jeder Prozess hält einen Verbindungspool plus vier `LISTEN`-Verbindungen (Abbruch, Queue-Aufweckungen, Ausführungsergebnisse, Chat-Streams). Offene Chat-Streams teilen sich die eine Chat-Verbindung, daher fügen sie keine Datenbankverbindungen hinzu. Ein Cluster mit drei Instanzen läuft bei der Standardeinstellung `max_connections = 100` aus dem Ruder, und Heym kann dann seine eigene Datenbank nicht mehr erreichen.

Kalkuliere grob `Instanzen x Prozesse x (async Pool + sync Pool + 4)` und setze `max_connections` darüber.

Verkleinere die Pools, statt nur die Obergrenze anzuheben. Ein einzelnes Deployment verwendet standardmäßig 10+20 async und 5+10 sync Verbindungen pro Prozess, was für eine Maschine großzügig und für einen Cluster viel zu viel ist:

| Variable | Einzelinstanz | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Die Beispiel-Compose-Datei setzt diese Werte und `max_connections = 300`. Das bringt einen Cluster mit zwei Instanzen von einer Obergrenze von 768 Verbindungen auf 192 herunter, wobei drei Instanzen noch unter 300 bleiben.

## Anforderungen, die der Cluster nicht für dich durchsetzen kann

**Jede Instanz muss denselben `SECRET_KEY` und `ENCRYPTION_KEY` verwenden.** Ein Worker mit einem anderen `ENCRYPTION_KEY` kann Anmeldedaten nicht entschlüsseln, und jede Ausführung, die Anmeldedaten verwendet, würde mit einem Fehler fehlschlagen, der nichts Nützliches benennt. Heym vergleicht bei jedem Heartbeat einen Digest beider Schlüssel zusammen mit der App-Version und der Datenbankrevision und markiert eine nicht übereinstimmende Instanz als **Mismatch**, sodass sie überhaupt keine Arbeit erhält. Die Last fällt auf main zurück, bis du das Problem behebst.

Das definiert auch die Upgrade-Reihenfolge. Ein Upgrade von main zuerst markiert jeden Worker als inkompatibel; die Arbeit kehrt zu main zurück, und jeder Worker tritt wieder bei, sobald er aktualisiert wird. Langsamer, sichtbar und umkehrbar.

**Richte Ingress nur auf die main-Instanz aus.** Ein Round-Robin des Benutzerverkehrs über die Instanzen würde einen Datei-Upload an eine Maschine und dessen Download an eine andere senden. Nichts im Code verhindert dies, da ein Worker dasselbe Image ausführt und jede Anfrage beantworten wird, die er erhält.

**Jede Instanz benötigt `FRONTEND_URL`, gesetzt auf dieselbe öffentliche Adresse.** Eine Ausführung, die für eine menschliche Überprüfung pausiert, erzeugt ihren Überprüfungslink auf der Instanz, die sie ausgeführt hat, nicht auf main, und dasselbe gilt für Codex-Follow-up-Links und für die Download-URLs generierter Dateien. Ein Worker, der ohne diese Einstellung bleibt, baut diese Links gegen seine eigene lokale Adresse, und wer auch immer einen erhält, kann ihn nicht öffnen.

**Worker-Instanzen haben eine andere ausgehende IP.** Jede API, die Quelladressen auf eine Allowlist setzt, sieht die neue. Send Email läuft aus genau diesem Grund auf main; für den HTTP-Knoten gib entweder dem Cluster eine einzelne NAT-Egress-Adresse oder setze jede Instanz auf die Allowlist.

## Hinzufügen eines Workers auf einer anderen Maschine

`docker-compose.worker.yml` im Repository-Stammverzeichnis führt einen Worker auf seinem eigenen Host aus. Er hat keine Datenbank und keine UI: Er erreicht das PostgreSQL der main-Instanz und übernimmt seinen Anteil der Hintergrundausführungen.

Fülle eine `.env` daneben aus – Image-Tag, Datenbank-Host und Anmeldedaten, beide Schlüssel und eine Instanz-ID – und starte ihn. Compose weigert sich zu starten, bis jeder erforderliche Wert gesetzt ist, statt mit einem Platzhalter hochzukommen, der später auf schwer lesbare Weise fehlschlägt.

Das Image-Tag muss die Version sein, die main ausführt, und beide Schlüssel müssen exakt kopiert werden. Eine Abweichung bei einem von beiden zeigt den Worker als Mismatch an, und er erhält keine Arbeit.

## Lesen der Instances-Tabelle

| Spalte | Bedeutung |
|---|---|
| Name | Bearbeitbares Label; es wird auf jede Ausführung gestempelt, die diese Instanz ausführt |
| Role | `main` oder `worker`, aus der Umgebung |
| Status | **Live** mit einem frischen Heartbeat, **Offline** nach 30 Sekunden Stille, **Mismatch**, wenn die Version, die Datenbankrevision oder die Schlüssel von denen von main abweichen |
| ms | Round Trip von dieser Instanz zur Datenbank, von der Instanz selbst gemessen |
| On | Nimm einen Worker aus der Rotation, ohne ihn zu stoppen — laufende Ausführungen werden beendet, keine neuen werden zugewiesen. Für die main-Instanz fest eingerastet: Datei-, Plugin- und Coding-Agent-Arbeit läuft dort, unabhängig davon, was der Schalter sagt |
| Weight | Sein Anteil an verteilbaren Ausführungen |

## Concurrency-Limits in einem Cluster

Das [Concurrency-Limit](./webhooks.md#concurrency-limit-and-queued-runs) eines Workflows wird in PostgreSQL gezählt, sodass es über jede Instanz und jeden Prozess hinweg gilt: Zwei Instanzen führen niemals mehr Läufe eines Workflows aus, als das Limit erlaubt. Ein Lauf, der auf einen Slot gewartet hat, wird beim Start nach denselben Regeln wie jeder andere Lauf platziert, sodass ein Lauf, der auf main bleiben muss, dies weiterhin tut. Der Queue-Worker, der diese Läufe ausführt, startet nun bei jeder Installation, einschließlich einer Einzelinstanz, wo er nur die Läufe beansprucht, die seine eigene Instanz eingereiht hat. Das bedeutet, dass eine Einzelinstanz auch die Queue-Aufweck-`LISTEN`-Verbindung in jedem Prozess hält; budgetiere deren Verbindungen daher genauso wie bei einer Cluster-Instanz.

## Ausführungsverlauf

Jede Ausführung im Ausführungsverlauf benennt die Instanz, die sie ausgeführt hat, und beide Verlaufsdialoge können auf eine Instanz gefiltert werden. Der Filter gleicht auf die ID der Instanz ab, während er ihren Namen anzeigt, sodass das Umbenennen einer Instanz nicht umschreibt, was alte Ausführungen sagen.

Nichts davon erscheint bei einer Einzelinstanz-Installation: Die Felder sind leer, kein Label wird angezeigt und kein Filter wird angeboten.

## Fehlerverhalten

**Wenn ein Worker mitten in einer Ausführung stirbt**, wird sein Heartbeat veraltet, und der bestehende Recovery-Sweep des Leaders führt die Ausführung auf einer lebenden Instanz erneut aus. Die Queue-Zeile, die er beansprucht hatte, wird separat zurückgezogen: Sobald keine aktive Ausführung für sie existiert und eine zweiminütige Karenzzeit verstrichen ist, lässt der Leader die Zeile fehlschlagen und weckt jeden, der auf das Ergebnis gewartet hat. Das Alter allein ist niemals der Grund dafür, sodass eine legitim lange Ausführung in Ruhe gelassen wird; und die Zeile wird fehlschlagen gelassen statt erneut in die Queue gestellt, weil die Wiederherstellung bereits die erneute Ausführung besitzt und ein erneutes Einreihen denselben Workflow zweimal ausführen würde.

**Wenn main ausfällt**, feuert cron weiter von einem Worker, und verteilbare Ausführungen werden weiter ausgeführt. Ausführungen, die main benötigen, reihen sich ein und warten und werden abgearbeitet, wenn es zurückkehrt — aber nur innerhalb des Misfire-Karenzfensters (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, standardmäßig 600 Sekunden). Alles Ältere wird als übersprungen geschlossen, mit aufgezeichnetem Grund, statt stundenlangen Rückstand auf einmal nachzuspielen.

Die UI, die API, MCP und der Editor sind nicht verfügbar, während main ausgefallen ist, weil Ingress dorthin zeigt.
## Verwandte Themen

- [Ausführung & Deployment](../getting-started/running-and-deployment.md) – Stelle zuerst eine einzelne Instanz bereit; die Umgebungsvariablen und die wichtigste Einrichtung findest du dort
- [Einstellungen](./user-settings.md) – Der Reiter Instances und wer ihn sehen kann
- [Ausführungen](../tabs/traces-tab.md) – Vergleiche die tatsächlichen Laufzeiten zwischen Instanzen, bevor du die Aufteilung änderst
- [Sicherheit](./security.md) – Warum jede Instanz `SECRET_KEY` und `ENCRYPTION_KEY` gemeinsam nutzen muss
