# Ausführungsverlauf

Der Ausführungsverlauf zeichnet Workflow-Läufe auf: Eingaben, Ausgaben, Knotenergebnisse, Status und Trigger-Quelle. Verwende ihn, um einen aktiven Produktionslauf zu beobachten, vergangene Läufe zu inspizieren, Fehler zu debuggen oder mit denselben Eingaben über **Auf Canvas übertragen** erneut auszuführen.

## Übersicht

Jede Ausführung speichert:

| Feld | Beschreibung |
|-------|-------------|
| **Eingaben** | Request-Body oder Lauf-Eingaben (z. B. `text` für den Eingabe-Knoten) |
| **Ausgaben** | Ausgaben auf Workflow-Ebene |
| **Knotenergebnisse** | Ausgaben pro Knoten, Status und Ausführungszeit |
| **Status** | `success`, `error`, `pending`, `skipped` oder `failed` (siehe [Absturzwiederherstellung](#crash-recovery)) |
| **trigger_source** | Wie der Lauf ausgelöst wurde (siehe [Trigger](./triggers.md)) |

## Zugriff auf den Verlauf

| Ort | Umfang |
|----------|-------|
| **Editor**-Symbolleiste | Nur aktueller Workflow |
| **Docs**-Ansichtskopf | Nur aktueller Workflow |
| **Dashboard**-Kopf (Chat-Reiter) | Alle Workflows + Chat-/Assistenten-Läufe |
| **Evaluierung**-Ansichtskopf | Alle Workflows + Chat-/Assistenten-Läufe |

Klicke auf die Schaltfläche **Verlauf** (Uhr-Symbol), um den Dialog zu öffnen.

## Pro-Workflow vs. Gesamter Verlauf

- **Pro-Workflow** (Editor, Docs): Zeigt Läufe für den Workflow, den du geöffnet hast. Verwende **Verlauf löschen**, um Läufe nur für diesen Workflow zu entfernen.
- **Gesamter Verlauf** (Dashboard, Evaluierung): Zeigt Läufe über alle Workflows und Chat-/Assistenten-Sitzungen hinweg. Die Abdeckung entspricht dem Workflow-Zugriff: Workflows, die dir gehören, Workflows, die direkt mit dir geteilt wurden, und Workflows, die mit einem Team geteilt wurden, dem du angehörst. Verwende **Gesamten Verlauf löschen**, um alle Datensätze zu entfernen, die dir gehören. Der Verlauf für geteilte Workflows bleibt erhalten.

## Auf Canvas übertragen

**Auf Canvas übertragen** lädt die Eingaben und Knotenausgaben eines ausgewählten Laufs in den aktuellen Workflow.

### Was geladen wird

- **Eingaben** → Lauf-Eingabebereich (z. B. `text` für den Eingabe-Knoten oder benutzerdefinierte Felder)
- **Knotenergebnisse** → Der Ausführungsergebnisbereich zeigt vergangene Ausgaben pro Knoten
- **Ausführungsergebnis** → Status, Ausgaben und Timing aus dem Lauf

### Verhalten je nach Kontext

- **Im Editor** (Pro-Workflow-Verlauf): Wird sofort auf den geöffneten Workflow angewendet und schließt den Dialog.
- **Aus dem Gesamten Verlauf** (Dashboard/Evaluierung): Navigiert zum Workflow-Editor und wendet die Daten an, sobald der Editor geladen ist. Nur für Workflow-Läufe verfügbar – nicht für Chat-/Assistenten-Läufe.

### Ausführungs-Deep-Link

Das Öffnen eines Workflows unter `/workflows/{workflowId}/{executionId}` bringt diese Ausführung automatisch auf den Canvas – genau wie das Auswählen des Laufs und **Auf Canvas übertragen**. Dadurch kann ein bestimmter vergangener Lauf als URL geteilt werden. Wenn die Ausführung nicht gefunden werden kann (falsche oder gelöschte ID), fällt der Editor auf das Laden des einfachen Workflows zurück.

### Anwendungsfälle

Halten Sie Strg/Cmd gedrückt und klicken Sie auf eine Ausführung in einer der Verlaufslisten, um diesen Deep-Link in einem neuen Browser-Tab zu öffnen. Der aktuelle Tab und der geöffnete Dialog bleiben unverändert. Chat- und Assistentenläufe besitzen keinen Workflow; der Kurzbefehl wählt sie daher wie ein normaler Klick lediglich aus.

- Einen Workflow mit denselben Eingaben erneut ausführen
- Einen fehlgeschlagenen Lauf debuggen, indem Eingaben und Knotenausgaben inspiziert werden
- Ausgaben über Läufe hinweg vergleichen

## KI fragen

Beide Verlaufsdialoge verfügen über eine Schaltfläche **KI fragen** (Glitzersymbol) neben ihrem Titel. Sie öffnet den [Reiter Chat](../tabs/chat-tab.md#asking-about-a-run) in einer neuen Unterhaltung, an die der Workflow und der ausgewählte Lauf als entfernbare Chips angehängt sind. Fragen Sie, warum der Lauf langsam war, was fehlgeschlagen ist, oder lassen Sie Chat den Workflow reparieren. Chat liest genau diesen Lauf, einschließlich des Traces und der Fehler pro Knoten.

Im Dialog „Gesamter Verlauf“ erscheint **KI fragen** nur, wenn ein Workflow-Lauf ausgewählt ist; Chat- und Assistentenläufe zeigen ihn nicht an.

## Lauf-Zeitleiste

In den Laufdetails tauscht die Schaltfläche **Zeitleiste** (Timer-Symbol) neben **Alle aufklappen** die Liste **Schritte** gegen eine Span-Zeitleiste aus. Während die Zeitleiste angezeigt wird, lautet dieselbe Schaltfläche **Protokolle**; klicken Sie darauf, um zur Liste zurückzukehren. Im gesamten Verlauf erscheint die Schaltfläche nur für Workflow-Läufe. Die Zeitleiste zeichnet einen Balken pro Knoten zu dem Zeitpunkt, an dem er gestartet wurde, sodass Sie sehen können, welcher Knoten wie lange gedauert hat und welche parallel liefen. Bewegen Sie den Mauszeiger über einen Balken für seine Dauer; klicken Sie darauf, um denselben Detail-Inspektor wie in der [Ausführungs-Zeitleiste](#execution-timeline-details) des Editors zu öffnen. Die gewählte Ansicht bleibt erhalten, solange der Dialog geöffnet ist.

Läufe, die aufgezeichnet wurden, bevor Knotenstartzeiten gespeichert wurden, werden nach Dauer hintereinander angeordnet.

## Ausführungs-Highlights

Nach einem Live-Lauf – oder nach **Auf Canvas übertragen** – erscheint ein ausblendbares **Ausführungs-Highlights**-Popup in der **oberen rechten Ecke des Canvas**. Es ist eine schnelle Möglichkeit zu sehen, *was jeder Knoten produziert hat*, aufgelistet von oben nach unten in Ausführungsreihenfolge. Schließe es mit dem **✕**; es öffnet sich beim nächsten Lauf erneut.

### Was angezeigt wird

| Datensatz | Quelle | Automatisch? |
|--------|--------|-------|
| **Eingabe** | Die Eingabeparameter des Laufs (Eingabe-/Trigger-Knoten) | Ja |
| **Ausgabe** | Das Ergebnis des Ausgabe-Knotens – oder, falls keiner vorhanden ist, die Nachricht des letzten Knotens | Ja |
| **Agent / LLM** | Die Ausgabe jedes Agent- oder LLM-Knotens | Ja |
| **Ausgabe** | Jeder andere Knoten mit aktivierter Option **Knotenausgabe hervorheben** | Opt-in |

Knoten, die bereits automatisch hervorgehoben werden (Eingabe / Ausgabe / letzter / Agent / LLM), erscheinen nie doppelt, selbst wenn du den Schalter zusätzlich aktivierst.

### Jeder Datensatz

- Zeigt `Knoten — Nachricht…` mit den ersten **250 Zeichen**; klicke auf eine Zeile, um sie zu erweitern und die **vollständige Nachricht als Markdown** darzustellen, mit einer **Kopieren**-Schaltfläche.
- Ein Knoten, der mehrfach ausgeführt wurde (z. B. innerhalb einer Schleife), zeigt `Knoten (N)` mit einem `‹ i / N ›`-Selektor – wähle aus, welchen Lauf du anzeigen möchtest; der Selektor jedes Knotens ist unabhängig.

### Knotenausgabe hervorheben

Jeder Knoten **außer Agent und LLM** hat ein Kontrollkästchen **Knotenausgabe hervorheben** in seinem Eigenschaftenbereich (standardmäßig aus). Aktiviere es, um die Ausgabe dieses Knotens zum Popup hinzuzufügen. Ein kleines ✦-Abzeichen erscheint auf hervorgehobenen Knoten auf dem Canvas. In der [Workflow-DSL](./expression-dsl.md) ist dies das Knotendatenfeld `"highlight": true` (standardmäßig `false`).

### Auf Dashboards

Dashboard-Widget-Karten, die einen Workflow ausgeführt haben, zeigen eine ✦-**Ausführungs-Highlights**-Schaltfläche im Kartenkopf; klicke darauf, um dasselbe Popup für den Lauf dieses Widgets zu öffnen, wobei die gezeichnete Ausgabe des Widgets als hervorgehobener Datensatz dient.

## Laufende Ausführungen

Beide Verlaufsdialoge zeigen **aktuell laufende Ausführungen** oben in der Liste, vor vergangenen Läufen.

- Ein drehender Indikator und das Label **Läuft** erscheinen mit der Startzeit
- Klicke auf **Live öffnen**, um den Editor an genau diesen Lauf anzuhängen, ohne ihn neu zu starten
- Der Canvas stellt zuerst Knoten wieder her, die bereits abgeschlossen sind, und empfängt dann
  `node_start`-, `node_complete`- und abschließende Ausführungsereignisse über SSE
- Der aktuelle Knoten pulsiert auf dem Canvas, nachgelagerte Knoten behalten ihre Pending-Animation, und
  das Debug-Panel fügt jedes Ergebnis hinzu, sobald es eintrifft – genau wie bei einem vom Editor gestarteten Lauf
- Klicke auf **Abbrechen**, um die Ausführung sofort zu stoppen
- Das Abbrechen aus einem beliebigen Dialog (Editor oder Dashboard) schließt auch den aktiven SSE-Stream in jedem geöffneten Canvas-Reiter für diesen Workflow, sodass der Editor-Zustand sauber zurückgesetzt wird
- Nach dem Abbrechen verschwindet der laufende Eintrag beim nächsten Aktualisieren; drücke **Aktualisieren**, um die Liste manuell zu aktualisieren
- Wenn du einen Lauf abbrichst, der bereits beendet ist, ist die Anfrage ein No-op

Läufe, die auf einen [Concurrency-Slot](./webhooks.md#concurrency-limit-and-queued-runs) warten, werden im selben Abschnitt mit der Kennzeichnung **Queued 2/5**, ihrem Platz in der Warteschlange und der Warteschlangengröße aufgeführt. Sie haben keine Schaltfläche **Live öffnen**, da noch nichts ausgeführt wird; **Abbrechen** nimmt einen wartenden Lauf aus der Warteschlange und zeichnet ihn als `cancelled` auf. Ein Lauf, der länger als die maximale Wartezeit des Workflows gewartet hat, wird als `expired` erfasst, und ein Lauf, der von einer vollen Warteschlange abgewiesen wurde, als `queue_full`; beide verfügen über ein eigenes Badge in der Ausführungsliste.

Die Live-URL ist `/workflows/{workflowId}/{executionId}`. Der Beobachter ist schreibgeschützt: Das Verlassen
des Editors trennt nur diesen Browser-Reiter und stoppt niemals den Workflow. Aktive Snapshots
werden über PostgreSQL geteilt, sodass das Öffnen eines Laufs auch dann funktioniert, wenn der Trigger und die Editor-
Anfrage auf verschiedenen Backend-Workern landen.
## Crash Recovery

Wenn der Server neu startet (Deploy, Container-Neustart oder Absturz), während ein Workflow läuft, stoppt der Worker dieses Laufs mitten in der Ausführung. Heym stellt diese unterbrochenen Läufe automatisch wieder her, anstatt sie als **Running** hängen zu lassen.

- Beim nächsten Start erkennt der gewählte Leader-Prozess verwaiste Läufe — sofort bei einem ordnungsgemäßen Neustart oder innerhalb von ~60 Sekunden bei einem harten Absturz (sobald die Heartbeats eindeutig aufhören).
- Wiederhergestellte Läufe werden **von Grund auf mit denselben Eingaben neu ausgeführt** (nicht dort fortgesetzt, wo sie gestoppt wurden), unter Verwendung der aktuellen Workflow-Definition. Bei Abschluss wird ein normaler terminaler Eintrag aufgezeichnet (z. B. `success`), sodass der Verlauf den Lauf als abgeschlossen anzeigt.
- Ein Lauf wird **einmal** erneut versucht. Wenn auch der Wiederherstellungsversuch unterbrochen wird — oder der Workflow inzwischen gelöscht wurde — wird der Eintrag als `failed` aufgezeichnet.
- Dies funktioniert gleichermaßen bei einem einzelnen Container und bei Multi-Worker-Deployments; nur der Leader führt die Wiederherstellung durch, sodass ein Lauf niemals zweimal von verschiedenen Workern wiederhergestellt wird.

### Auto-recover-Umschalter

Das **Execution Log**-Panel (Lauf) des Editors hat ein Kontrollkästchen **Auto-recover**, das pro Workflow **standardmäßig aktiviert** ist.

- **An**: Unterbrochene Läufe dieses Workflows werden wie oben beschrieben neu ausgeführt.
- **Aus**: Unterbrochene Läufe werden nicht neu ausgeführt und mit dem Status `skipped` aufgezeichnet.

> Sub-Workflow-Läufe werden nicht unabhängig wiederhergestellt — sie werden von ihrem wiederhergestellten übergeordneten Lauf erneut angetrieben. Trigger mit eigener Redelivery (RabbitMQ, scheduled/cron, IMAP) können beim Neustart ebenfalls erneut zustellen, sodass ein wiederhergestellter Lauf gelegentlich zweimal ausgeführt werden kann.

## Pending Human Review

Läufe, die für eine [Human-in-the-Loop](./human-in-the-loop.md)-Genehmigung pausieren, werden sofort mit dem Status `pending` in den Verlauf geschrieben.

- Der wartende Agent-Knoten speichert ein Review-Payload mit `reviewUrl`, `draftText` und `expiresAt`
- Alle Knoten, die mit dem `review`-Handle des Agenten verbunden sind, können ebenfalls ausgeführt werden, bevor der Mensch antwortet, und ihre Knotenergebnisse werden im selben Pending-Verlaufseintrag gespeichert
- Verlaufsdialoge zeigen den Review-Link an, damit Eigentümer ihn kopieren oder öffnen können
- Verlaufsdialoge und das Debug-Panel des Editors zeigen die endgültige menschliche Entscheidung, nachdem der Lauf fortgesetzt wurde
- Wenn ein Reviewer den Entwurf akzeptiert, bearbeitet oder ablehnt, wird derselbe Verlaufseintrag mit dem endgültigen Ausführungsergebnis aktualisiert
- Wenn derselbe Lauf mehr als einmal für HITL pausiert, bleibt der Verlaufseintrag derselbe, während jeder Checkpoint seinen eigenen einmaligen Review-Link erhält

Dies ist besonders nützlich für Portal-Läufe und langlebige Workflows, die Stunden oder Tage warten können, bevor sie fortgesetzt werden.

## Copy

Verwende **Copy** neben Inputs oder Outputs, um das JSON in die Zwischenablage zu kopieren.

## Clear History

- **Pro Workflow**: Klicke im Verlaufsdialog des Editors auf **Clear history**, um Läufe für den aktuellen Workflow zu entfernen.
- **Gesamter Verlauf**: Klicke im Verlaufsdialog des Dashboards/Evals auf **Clear all history**, um alle Ausführungsdatensätze zu entfernen, die dir gehören. Läufe aus geteilten Workflows bleiben erhalten. Diese Aktion kann nicht rückgängig gemacht werden.

## Details zur Ausführungs-Timeline

Wenn das **Execution Log** des Editors geöffnet ist, klicke auf die Timer-Schaltfläche, um die Ausführungs-Timeline anzuzeigen. Wähle eine Spanne aus, um einen Inline-Detail-Inspektor zu öffnen, der den Zeilenbereich übernimmt. Er zeigt den Status des ausgewählten Schritts, die Dauer, die Anzahl der Versuche, Retry-Informationen, Fehler, die Trace-ID und eine kompakte Ausgabevorschau. Objekt- und Array-Ausgaben verwenden denselben `JsonTree`-Viewer wie der Rest des Debug-Panels; skalare Werte verwenden eine Textvorschau. Wenn ein Schritt Bilder ausgibt (Playwright-Screenshots, generierte Bilder, Bilddateien oder Base64-Bilder in einem Request-Body, die irgendwo in der Ausgabe gefunden werden), erscheinen sie als Thumbnails über der Ausgabe, und das JSON zeigt einen kurzen Platzhalter anstelle des rohen base64. Klicke auf ein Thumbnail, um es in einer Lightbox zu öffnen; die Pfeiltasten-Schaltflächen oder ←/→-Tasten wechseln durch jedes Bild im Lauf, mit einem Zähler wie `2 / 5`. Verwende **Open trace** für LLM- und Agent-Spannen, wenn eine Trace-ID verfügbar ist.

## Mobile Knotendetail

Auf einem Telefon zeigt der Editor einen Vollbild-Workflow-Baum anstelle des freien Canvas. Tippe auf einen Baumknoten mit einem aufgezeichneten Ergebnis, um seine Ausführung als Vollbild-Detail zu öffnen. Die Ansicht bietet separate Reiter **Input Data**, **Output Data** und **Errors**. Der Output-Reiter zeigt das aufgezeichnete Ergebnis und bietet **Copy Output**; der Input-Reiter zeigt die Konfiguration des ausgewählten Knotens, und der Errors-Reiter zeigt den aufgezeichneten Fehler, wenn der Knoten fehlgeschlagen ist. Verwende **Back to workflow** oder die Schließen-Schaltfläche, um zum Baum zurückzukehren.

Die Verlaufsdialoge von Canvas und Dashboard behalten ihre Lauf-Steuerelemente in einer Zeile und platzieren die verfügbaren Tag- und Instanz-Filter in einem responsiven Raster. Ihre Filtermenüs verwenden denselben In-App-Selektor, sodass das ausgewählte Häkchen einen konsistenten Abstand und eine konsistente Grundlinie mit jedem Optionslabel hat.

## Verwandte Themen

- [Triggers](./triggers.md) – Wie Workflows gestartet werden; der Verlauf zeichnet `trigger_source` auf (einschließlich `board` für Läufe, die durch [Board](../tabs/board-tab.md)-Kartenverschiebungen und Follow-ups gestartet wurden)
- [Human-in-the-Loop](./human-in-the-loop.md) – Pending-Review-URLs und Resume-Verhalten
- [Bearbeitungsverlauf](./edit-history.md) – Versionskontrolle für Workflow-Speicherungen (Revert, Diff)
- [Schnellstart](../getting-started/quick-start.md) – Erstelle und führe deinen ersten Workflow aus
- [Reiter Workflows](../tabs/workflows-tab.md) – Workflows erstellen und verwalten
