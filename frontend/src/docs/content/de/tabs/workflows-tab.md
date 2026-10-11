# Reiter Workflows

Der Reiter **Workflows** ist die zentrale Standardansicht des Dashboards. Er zeigt Ihre Workflow-Liste, die Ordnerstruktur und ermöglicht das Erstellen, Bearbeiten, Organisieren und Überwachen von Automatisierungen.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Video-Demo zu Workflows ansehen</a></p>

## Chat starten

Oberhalb der Workflow-Liste befindet sich ein interaktives Chat-Eingabefeld, das Sie namentlich begrüßt und fragt, was Sie automatisieren möchten. Geben Sie einen Prompt ein, hängen Sie optional eine Datei an und wählen Sie Anmeldedaten und Modell. Beide Dropdowns unterstützen die Suche und starten mit Ihren [Standard-KI-Einstellungen](../reference/user-settings.md).

Durch das Absenden wird eine neue Konversation erstellt und im Reiter [Chat](./chat-tab.md) geöffnet, wo die Antwort in Echtzeit gestreamt wird. Unterstützte Dateianhänge sind Textdateien, Bilder und PDFs (eine Datei pro Nachricht).

Falls Sie noch keine LLM-Anmeldedaten hinterlegt haben, verlinkt das Feld direkt auf den Reiter [Anmeldedaten](./credentials-tab.md) und das Absenden bleibt deaktiviert.

Über das **x** können Sie das Eingabefeld ausblenden. Über die Schaltfläche **KI fragen** neben der Workflows-Überschrift blenden Sie es jederzeit wieder ein. Die Einstellung wird in Ihrem Browser gespeichert.

## Workflow-Liste

Die Liste ist als Zwei-Spalten-Ansicht aufgebaut: links Workflows und Ordner, rechts die interaktive Vorschau des ausgewählten Workflows.

- Jede Zeile zeigt Icon, Name, Beschreibung, Aktualisierungszeitpunkt und ein [Status-Badge](#workflow-status)
- Workflows können sich im Hauptverzeichnis oder in Ordnern befinden; angeheftete Workflows erscheinen ganz oben in der Gruppe **Angeheftet**
- **Klick**: Wählt eine Zeile aus und lädt die Detailvorschau auf der rechten Seite
- **Doppelklick** oder **Enter**: Öffnet den Workflow direkt im [Editor](../getting-started/quick-start.md)
- **Strg+Klick** (oder **Cmd+Klick**): Öffnet den Workflow in einem neuen Browser-Tab
- Jede Zeile bietet Aktionen zum Bearbeiten, Duplizieren, Anheften und Löschen auf der rechten Seite. Auf Mobilgeräten werden diese platzsparend verborgen; durch **langes Drücken** öffnen Sie dort das Aktionsblatt
- Heften Sie häufig genutzte Workflows im [Quick Drawer](../reference/quick-drawer.md) an, um sie schnell aus verschiedenen Ansichten heraus auszuführen

## Workflow-Vorschau

Die Auswahl eines Workflows befüllt das Vorschau-Panel rechts neben der Liste. Auf Bildschirmen unter 1280px Breite öffnet sich dieses Panel stattdessen als modales Blatt von unten.

Das Vorschau-Panel zeigt:

- Name, Ersteller, Erstellungsdatum und Zeitpunkt der letzten Bearbeitung
- **Workflow öffnen** – Öffnet den Workflow im Canvas-Editor
- **Jetzt ausführen** – Öffnet den Workflow im [Quick Drawer](../reference/quick-drawer.md), wo Sie Eingabeparameter eingeben und den Lauf direkt starten können
- **Beschreibung** – Die hinterlegte Funktionsbeschreibung
- **Trigger-Konfiguration** – Der Zeitplan für Cron-Workflows oder der lauschende Trigger für Event-Workflows. Bei HTTP-Workflows wird eine Schaltfläche **cURL kopieren** angezeigt: Sie kopiert eine vollständige Anfrage inklusive URL, Headern, Platzhaltern und JSON-Body basierend auf den Eingabefeldern. Ist ein [Portal](../reference/portal.md) aktiviert, erscheint hier auch der öffentliche Chat-Link
- **Details des letzten Laufs** – Ergebnis und Dauer der jüngsten Ausführung oder ein Hinweis, dass der Workflow noch nie ausgeführt wurde
- **Workflow-Schritte & Sub-Agenten** – Alle Knoten in Ausführungsreihenfolge mit Modell, Operation oder Zeitplan sowie einem Aktivitätsindikator. Durch Klick auf einen Schritt öffnet sich der Knoten direkt im Editor mit geöffnetem Eigenschaften-Panel

Das Panel bleibt beim Scrollen fixiert, sodass es auch in langen Listen stets lesbar bleibt.

## Instanz-Administration

Benutzerkonten, die in `HEYM_ADMIN_EMAILS` aufgeführt sind, können jeden Workflow auf der Instanz auflisten, öffnen, bearbeiten, dessen Verlauf einsehen und löschen – unabhängig von Besitzrechten oder Freigaben. Die Einstellung ist eine kommagetrennte Liste von E-Mail-Adressen.

Administratoren sehen die E-Mail-Adresse des Besitzers in der Liste und können danach suchen. Die Auswahl eines Workflows öffnet die **Instanz-Administration** im Vorschau-Panel:

1. **Trigger pausieren** – Wird für Workflows mit Cron-Knoten angezeigt. Es deaktiviert automatische Trigger über eine versionierte Speicherung. Laufende Ausführungen können beendet werden; manuelle, API-, Portal- und Sub-Workflow-Aufrufe bleiben weiterhin möglich.
2. **Trigger fortsetzen** – Reaktiviert die vom Administrator pausierten Trigger.
3. **Workflow löschen** – Löscht den Workflow nach Abschluss laufender Prozesse.

Administrative Aktionen werden mit handelndem Administrator und Besitzer lückenlos im [Audit-Protokoll](../reference/audit.md) erfasst.

## Workflow-Status

Jeder Workflow besitzt ein Status-Badge:

| Status | Bedeutung |
|---|---|
| **Aktiv** | Der Workflow ist einsatzbereit und Trigger reagieren auf Ereignisse |
| **Pausiert** | Automatische Trigger sind temporär angehalten |
| **Entwurf** | Der Workflow befindet sich im Aufbau |

## Ordner & Organisation

- Erstellen Sie Ordner zur logischen Trennung von Umgebungen, Teams oder Kunden
- Verschieben Sie Workflows bequem per Drag & Drop
- Löschen Sie Ordner mit Sicherheitsabfrage (enthaltene Workflows können verschoben oder gelöscht werden)

## Verwandte Themen

- [Einführung](../getting-started/introduction.md) – Grundlagen der Plattform
- [Schnellstart](../getting-started/quick-start.md) – Ersten Workflow bauen
- [Canvas-Funktionen](../reference/canvas-features.md) – Werkzeuge des Workflow-Editors
- [Reiter Vorlagen](./templates-tab.md) – Vorgefertigte Workflows nutzen
- [Quick Drawer](../reference/quick-drawer.md) – Schnellausführung von Workflows\n