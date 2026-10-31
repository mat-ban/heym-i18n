# Reiter Analysen

Der Reiter **Analysen** (Analytics) zeigt Ausführungsmetriken und Trends für Ihre Workflows. Überwachen Sie Auslastung, Performance und identifizieren Sie Engpässe.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Video-Demo zu Analysen ansehen</a></p>

## Zusammenfassende Statistiken

- **Total executions** – Anzahl der Workflow-Ausführungen im ausgewählten Zeitraum
- **Success rate** – Prozentsatz erfolgreicher Durchläufe
- **Average duration** – Durchschnittliche Ausführungsdauer
- **Time saved** – Gesamte geschätzte Zeitersparnis: die für jeden Workflow konfigurierten eingesparten Minuten pro Durchlauf × seine erfolgreichen Ausführungen, summiert über das gewählte Zeitfenster
- **Trends** – Auf-/Ab-Indikatoren im Vergleich zum vorherigen Zeitraum

## Zeitbereich

- **1h**, **3h**, **6h** – Letzte Stunde, 3 Stunden oder 6 Stunden. Analysen werden stundenweise erfasst, daher zählen diese die angefangene Stunde des Fensters voll: Letzte Stunde um 15:20 umfasst den Zeitraum von 14:00 bis jetzt
- **24h** – Letzte 24 Stunden
- **7d** – Letzte 7 Tage
- **30d** – Letzte 30 Tage
- **All** – Gesamter verfügbarer Verlauf

## Workflow-Filter

- Filtern Sie Metriken nach einem bestimmten Workflow
- **All workflows** – Aggregation über alle Workflows

## Tabellen

Zwei Tabellen zeigen die Workflow-Nutzung: **Most Used** (breiter) und **Most Failed**.

- **Time Saved** – Most Used zeigt die summierte Zeitersparnis jedes Workflows (eingesparte Minuten pro Durchlauf × erfolgreiche Ausführungen). **Not Set** bedeutet, dass die Schätzung fehlt; klicken Sie darauf, um dieses Feld im Workflow zu öffnen.
- **Sortierbare Spalten** – Klicken Sie auf eine Spaltenüberschrift, um nach dieser Spalte zu sortieren. Klicken Sie erneut, um zwischen aufsteigend/absteigend zu wechseln. Pfeilsymbole zeigen die Sortierrichtung an.
- **Mobile Beschriftungen** – Auf kleinen Bildschirmen werden Spaltenbeschriftungen gekürzt (z. B. „Executions“ → „Runs“, „Success“ → „OK“, „Error“ → „Err“), damit die Tabellen ohne horizontales Scrollen passen.

## Diagramme

- **Execution Volume Over Time** – Liniendiagramm der Ausführungen pro Zeitintervall
- **Success vs Error Rate** – Flächendiagramm zum Vergleich fehlerfreier und fehlgeschlagener Durchläufe
- **Average Latency Over Time** – Liniendiagramm zur Darstellung der Antwortzeitverläufe
- **Drag to select** – Klicken und ziehen Sie in einem beliebigen Diagramm, um einen benutzerdefinierten Datumsbereich zu fokussieren. Eine Auswahl muss mindestens zwei Punkte auf dem Diagramm abdecken; ein einfacher Klick wählt nichts aus
- **Selection mode** – Ausgewählte Bereiche aktualisieren die Übersichtskarten, Diagramme und Workflow-Tabellen, ohne das Basis-Preset zu ändern
- **Clear Selection** – Kehren Sie zum voreingestellten Zeitfenster zurück, wenn Sie mit der Detailanalyse fertig sind

## Knotentypen

Unterhalb der Latenz-Perzentile zeigen drei Diagramme, worauf Knotenzeit und Fehler entfallen, gruppiert nach Knotentyp (Agent, HTTP Request, Code usw.) über alle angezeigten Workflows hinweg:

- **Most Time Taken Nodes** – Die 10 Knotentypen mit der meisten Gesamtlaufzeit, dargestellt als durchschnittliche Dauer pro Aufruf. Eine Stunde ohne Aufrufe eines Typs zeigt **No calls** im Tooltip.
- **Most Failed Node Types** – Die 10 Knotentypen mit den meisten Fehlern (Fehler oder Timeout), jeweils mit eigener Fehleranzahl pro Zeitintervall.
- **Most Called Node Types** – Die 10 Knotentypen, die am häufigsten ausgeführt wurden, jeweils mit eigener Aufrufanzahl pro Zeitintervall. Übersprungene Knoten werden nicht gezählt.

Fahren Sie mit der Maus über ein Diagramm, um den Knotentyp unter dem Mauszeiger direkt daneben zu sehen. Ein Knotentyp, der im Vergleich zum größten Typ auf einem Diagramm zu klein ist (unter 1 %), wird aus diesem Diagramm und seiner Legende ausgeblendet. Die Diagramme berücksichtigen den Workflow-Filter, den Zeitbereich und jeden Bereich, den Sie auf einem Diagramm aufziehen. Knotenanalysen werden für Durchläufe ab dem Release erfasst, das diese Funktion eingeführt hat; ein beendeter Durchlauf erscheint innerhalb von etwa einer Minute. Ältere Durchläufe werden nicht gezählt.

## Automatische Aktualisierung

- Aktivieren Sie die automatische Aktualisierung, um Metriken ohne manuelles Neuladen aktuell zu halten

## Verwandte Themen

- [Reiter Workflows](./workflows-tab.md) – Gemessene Workflows
- [Reiter Ausführungen](./traces-tab.md) – Detaillierte Trace-Inspektion
- [Reiter Logs](./logs-tab.md) – Laufzeit-Logs zur Fehlerbehebung
- [Kontextuelle Feature-Tour](../reference/contextual-showcase.md) – Kompakter Seitenleitfaden für Dashboard-Oberflächen

Wenn ein Diagramm einen Trend zeigt, über den Sie informiert werden möchten, anstatt ihn manuell zu beobachten, wandeln Sie ihn in eine [Warnung](./alerts-tab.md) um: Fehleranzahl, Laufzeit, LLM-Kosten und Ausführungsanzahl können jeweils mit einem Schwellenwert über ein Zeitfenster versehen werden.
