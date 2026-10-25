# Dashboard

Der Reiter **Dashboard** ist ein Arbeitsbereich im Grafana-Stil, in dem Sie Raster aus Diagramm-Widgets zusammenstellen. Jedes Widget wird aus der Ausgabe seines eigenen verdeckten Heym-Workflows gerendert — alle Daten, die Sie in einem Workflow erzeugen können (Datenbankabfragen, API-Aufrufe, RAG-Abfragen, LLM-Ausgaben), lassen sich so als Diagramm darstellen. Sie können mehrere Dashboards verwalten und jedes davon mit einzelnen Personen oder Teams teilen.

## Dashboards

Jeder Benutzer beginnt mit einem Dashboard, das beim ersten Öffnen des Reiters automatisch angelegt wird. Über die Dashboard-Auswahl oben im Reiter wechseln Sie zwischen Dashboards, und mit **+** daneben erstellen Sie ein neues. Die Auswahl listet zuerst Ihre eigenen Dashboards auf und danach die mit Ihnen geteilten, versehen mit dem Namen der Person, die sie freigegeben hat.

Der Reiter öffnet beim Aufruf das zuletzt verwendete Dashboard erneut, und die Adresszeile enthält das geöffnete Dashboard (`?tab=dashboard&dashboard=<id>`), sodass ein Link für alle Berechtigten genau dieses Dashboard öffnet.

Über die Einstellungsschaltfläche (nur für Eigentümer) lässt sich das Dashboard umbenennen, festlegen, welche Datensätze es als [Detailseite](#detail-pages) akzeptiert, die Freigabe verwalten und das Dashboard löschen. Beim Löschen eines Dashboards werden dessen Widgets und ihre zugehörigen Workflows entfernt. Sie behalten immer mindestens ein eigenes Dashboard; das letzte kann daher nicht gelöscht werden.

## Widgets

Ein Widget ist ein einzelnes Diagramm im Raster. Unterstützte Diagrammtypen:

- **Bar** (Balken-/Säulendiagramm, vertikal oder horizontal)
- **Line** (Liniendiagramm)
- **Area** (Flächendiagramm mit gefülltem Trend, unterstützt mehrere Datenreihen)
- **Pie** (Kreisdiagramm)
- **Table** (scrollbar; klicken Sie auf eine Spaltenüberschrift, um aufsteigend zu sortieren, und erneut, um absteigend zu sortieren. Eine Spalte kann als [Status-Chips](../nodes/chart-output-node.md#status-chips) dargestellt werden, eine Spalte kann [Link-Schaltflächen](../nodes/chart-output-node.md#link-buttons) enthalten, die eine URL in einem neuen Tab öffnen, und Zeilen können eine [Detailseite](#detailseiten) öffnen)
- **Numeric** (ein einzelner KPI-Wert mit optionaler Einheit)
- **Gauge** (ein einzelner Wert innerhalb eines Min–Max-Bereichs, z. B. ein Prozentsatz)
- **Scatter** (X/Y-Punkte für Korrelationsdiagramme)
- **Proportion** (ein in Anteile unterteilter Balken mit Prozent-Legende, z. B. eine Sprachverteilung)
- **Bar gauge** (eine horizontale Anzeige pro Zeile mit Rot→Grün-Verlauf und Wert, z. B. freier Speicherplatz)
- **Text** (eine Markdown-Nachricht, z. B. eine Statusnotiz wie „Letzte Ausführung um 19:47"; unterstützt [interaktive Kontrollkästchen](../nodes/chart-output-node.md#interactive-task-lists) bei statischem Markdown sowie [explizite nummerierte Listen](../nodes/chart-output-node.md#numbered-lists) für benutzerdefinierte oder absteigende Nummerierung)
- **HITL** (Ihre ausstehenden menschlichen Prüfungen. Die Kopfzeile zeigt `1/n pending`. Der Workflow-Name öffnet diesen Lauf auf der Arbeitsfläche. **Approve**, **Request changes** und **Reject** schließen ihn ab. Das Verlaufssymbol neben dem Widget-Titel öffnet diesen Lauf im Verlaufsdialog auf dieser Seite. Das Widget verwendet keine vorgelagerten Zeilen, und jede Person sieht ihre eigene Warteschlange. Es kann stattdessen die Prüfungen eines Workflows anzeigen, für alle, die diesen Workflow öffnen können; siehe [HITL-Widgets](#hitl-widgets))

Neben Diagrammen führt ein **Run a workflow**-Widget einen Ihrer Workflows direkt über das Dashboard aus: über eine abgelegte Datei, über seine Eingabefelder oder über eine Schaltfläche **Run**; siehe [Ausführungs-Widgets](#run-widgets).

Jedes Widget lädt seine Daten beim Öffnen des Reiters asynchron, sodass die Seite reaktionsfähig bleibt, während sich die Diagramme füllen.

## Ein Widget hinzufügen

1. Klicken Sie auf **Add widget**, vergeben Sie einen Titel und wählen Sie einen Diagrammtyp. Unterhalb der Auswahl zeichnet der Dialog ein Beispiel dieses Diagrammtyps mit Beispieldaten und benennt die erwarteten Zeilen, sodass Sie die Typen vergleichen können, bevor Sie etwas erstellen.
2. Das Widget öffnet sich im Workflow-Editor mit einem Startgraphen: einem [Set](../nodes/set-node.md)-Knoten, der die Zeilen erzeugt, verbunden mit einem [Chart Output](../nodes/chart-output-node.md)-Knoten. Ersetzen Sie den Set-Knoten durch eine beliebige Datenquelle. Ein **HITL**-Widget besteht nur aus dem Chart-Output-Knoten; es liest Ihre ausstehenden Prüfungen und benötigt keine Datenquelle.
3. Bauen Sie den Workflow so auf, dass der Knoten vor **Chart Output** ein Array von Zeilen liefert, und konfigurieren Sie anschließend die Feldzuordnung des Chart-Output-Knotens (Beschriftungsfeld, Wertfeld usw.).
4. Speichern Sie, kehren Sie zum Reiter Dashboard zurück, und das Widget wird gerendert.

Für ein **Run a workflow**-Widget wählen Sie stattdessen den auszuführenden Workflow aus; die Auswahl zeigt an, wie das Widget den jeweiligen Workflow startet. Das Widget wird direkt in das Raster eingefügt, ohne dass ein neuer Workflow gebaut werden muss.

Doppelklicken Sie jederzeit auf ein Widget (oder nutzen Sie dessen Bearbeiten-Schaltfläche), um seinen Workflow erneut zu öffnen. Verwenden Sie **Clone
widget** in der Kopfzeile des Widgets, um sowohl das Widget als auch seinen gesamten Workflow zu duplizieren. Die Kopie wird
unter dem Original platziert und mit **(Copy)** gekennzeichnet, sodass Sie sie unabhängig bearbeiten können.

## HITL-Widgets

Ein neues HITL-Widget zeigt jede Prüfung, die in Ihrer eigenen Warteschlange wartet. Um nur die eines Workflows anzuzeigen, öffnen Sie die **Einstellungen** des Widgets:

1. Wählen Sie unter **Workflow** den Workflow aus. Die Liste enthält die Workflows, die Sie öffnen können – Ihre eigenen oder mit Ihnen oder Ihrem Team geteilte –, die einen Schritt haben, der auf eine Person wartet: einen Agent mit menschlicher Prüfung oder einen Slack-Freigabe-, Schaltflächen- oder Formularschritt. Das Symbol daneben öffnet diesen Workflow in einem neuen Tab.
2. Hat der Workflow genau einen solchen Schritt, wird er automatisch mit ausgewählt. Hat er mehrere, listet **Select agent** sie nach Knotenname auf, mit **All agents** an erster Stelle; Slack-Schritte sind mit **(Slack)** markiert.
3. Speichern Sie. Die `1/n pending`-Anzeige in der Kopfzeile zählt nur diese Prüfungen. Wählen Sie **Alle Workflows**, um wieder Ihre eigene Warteschlange anzuzeigen.

Dieselbe Auswahl gibt es auf der Arbeitsfläche in den Eigenschaften des Chart-Output-Knotens. **Mit KI verfeinern** kann sie vornehmen („nur die Rechnungsfreigaben anzeigen“), ebenso die Beschreibung eines neuen Widgets, die den Workflow nennt. Jede Änderung ist eine Workflow-Bearbeitung und erscheint daher im Edit History.

- **Wer die Prüfungen sieht.** Ein auf einen Workflow gefiltertes Widget zeigt die Prüfungen dieses Workflows allen, die den Workflow öffnen können; sie können darüber genehmigen, Änderungen anfordern oder ablehnen, so wie sie den Workflow ausführen könnten. Ein ungefiltertes Widget zeigt jeder Person ihre eigene Warteschlange.
- **Wer das Widget sieht.** Wer den gewählten Workflow nicht öffnen kann, sieht das Widget gar nicht, auch nicht auf einem mit ihm geteilten Dashboard. Verliert der Eigentümer des Dashboards den Zugriff darauf oder wird es gelöscht, sieht der Eigentümer „You no longer have access to the workflow this widget shows“ und kann in den **Einstellungen** einen anderen auswählen.
- **Nur erreichbare Auswahl.** Ein Workflow, den Sie nicht öffnen können, wird beim Speichern des Widgets abgelehnt, ob über die Einstellungen, die Arbeitsfläche oder die KI.

## Detailseiten

Ein Tabellen-Widget kann seine Zeilen mit einem anderen Dashboard verknüpfen, das dann als Detailseite fungiert: ein einziges Dashboard für jeden Kunden, jede Rechnung oder jedes Ticket.

1. Öffnen Sie die **Settings** des Tabellen-Widgets und wählen Sie unter **Row link** das Ziel-Dashboard aus.
2. Geben Sie die **Record column** ein — also die Spalte, deren Wert die Zeile eindeutig identifiziert (beispielsweise `id`) — sowie optional eine **Label column** zur Benennung (beispielsweise `name`).
3. Speichern Sie. Ein Klick auf eine Zeile (oder das Fokussieren und Drücken der Eingabetaste) öffnet das verknüpfte Dashboard mit `?record=<value>&label=<name>`.

Auf dem Detail-Dashboard liest jeder Widget-Workflow den Wert als `$page.record` (siehe [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), und über dem Raster wird `Dashboard / <label>` samt einer Schaltfläche zum Zurücksetzen des Datensatzes angezeigt. Über „Zurück" gelangen Sie wieder zur Ausgangstabelle.

- **Wer sie öffnen kann.** Zeilen sind nur für Betrachter anklickbar, die auch Zugriff auf das verknüpfte Dashboard haben. Andere sehen dieselbe Tabelle ohne Links.
- **Datensatzformat.** Da der Datensatz aus der URL stammt, legt das Detail-Dashboard fest, welche Werte es akzeptiert. In seinen Einstellungen ist **Detail page records** eine der folgenden Optionen: IDs (Buchstaben, Ziffern, `-`, `_` und `.`, bis zu 128 Zeichen; Standard), Zahlen, UUIDs oder E-Mail-Adressen. Jeder andere Wert wird abgelehnt, bevor ein Widget startet, und die Widgets zeigen „This page does not accept that record".
- **Weiterhin Ausführung als Eigentümer.** Auch auf einer Detailseite laufen Widgets unter dem Konto des Dashboard-Eigentümers. Ersteller sollten `$page.record` nur dort übergeben, wo ein Knoten den Wert maskiert/escaped, niemals direkt in Abfragetext.
- **Caching.** Jedes Widget speichert sein Diagramm pro Datensatz für dieselbe Gültigkeitsdauer (TTL) wie das Widget im Cache und behält die 50 zuletzt verwendeten Datensätze.

## Ausführungs-Widgets

Ein **Run a workflow**-Widget führt einen Ihrer Workflows aus und zeigt das Ergebnis an: Status, Laufzeit und Ausgaben. Was dargestellt wird, hängt von den Eingaben des Workflows ab:

- **Eine Datei.** Bei einem Workflow, der mit einem [File Upload Trigger](../nodes/file-upload-trigger-node.md) beginnt, ziehen Sie eine Datei darauf (oder klicken zur Auswahl), woraufhin das Widget sie über den Einmal-Upload-Link des Triggers hochlädt. Das Widget zeigt die vom Trigger akzeptierten Dateitypen und die maximale Dateigröße an und weist andere Dateien vor dem Upload ab. Beginnt der Workflow zusätzlich mit einem Text-Input-Knoten, blendet das Widget dessen Felder neben dem Ablagebereich ein: Wählen Sie eine Datei, füllen Sie die Felder aus, und **Run** sendet beides. Die Werte werden zusammen mit dem vom Widget erzeugten Upload-Link übertragen, sodass ein geteilter Upload-Link sie nicht überschreiben kann.
- **Eingabefelder.** Bei einem Workflow, der mit einem Text-Input-Knoten beginnt, zeigt das Widget dessen Felder samt Standardwerten an; **Run** startet den Workflow mit Ihren Werten. Werte für Felder, die im Workflow nicht vorhanden sind, werden verworfen.
- **Keine Eingaben.** Ein Workflow ohne Eingaben erhält eine Schaltfläche **Run**.

Die Schaltfläche **Wrap** im Ergebnisbereich bricht lange Ausgabezeilen innerhalb des Feldes um; deaktivieren Sie sie, um das JSON-Layout der Ausgabe unverändert zu lesen.

- Jeder, der das Dashboard öffnen kann, darf das Widget ausführen — genauso wie jeder ein Diagramm aktualisieren kann. Maßgeblich für den Workflow-Zugriff ist der Dashboard-Eigentümer: Zum Hinzufügen des Widgets ist ein Workflow erforderlich, den sowohl Sie als auch der Eigentümer ausführen dürfen, und der Lauf selbst nutzt wie jeder Upload-Link die Anmeldedaten des Workflow-Eigentümers.
- Das Ergebnis bleibt auf Ihrem Bildschirm, bis Sie die Seite verlassen; andere Betrachter sehen weder Ihre Dateien noch Ihre Eingabewerte oder Ergebnisse. Der Lauf erscheint im Ausführungsverlauf mit dem Trigger `dashboard`.
- Eine Dashboard-Freigabe gewährt niemals Zugriff auf den Workflow selbst. **Edit workflow** öffnet ihn nur für Personen, die bereits Zugriff besitzen, und **Fine-tune with AI** wird nicht angeboten.
- Dateiläufe werden auf der Hauptinstanz ausgeführt, auf der hochgeladene Dateien gespeichert sind — wie bei jedem Lauf eines File Upload Triggers.

## Ein Widget mit KI generieren

Klicken Sie auf **AI**, beschreiben Sie die gewünschte Kennzahl (beispielsweise „Workflow-Erfolgsrate der letzten 30 Tage als Balkendiagramm") und wählen Sie LLM-Anmeldedaten sowie ein Modell aus. Heym generiert einen vollständigen Widget-Workflow, der in einem Chart-Output-Knoten endet, und fügt ihn dem Raster hinzu. Beispiele für Prompts je Diagrammtyp finden Sie unter [Chart Output](../nodes/chart-output-node.md#example-ai-prompts).

Das Widget erhält einen kurzen Titel aus ein oder zwei Wörtern in der Sprache Ihrer Anfrage, etwa „Offene Fälle“. Ein Titel enthält nie die ID einer Datentabelle; benennt das Modell das Widget mit einem Satz, behält Heym dessen erste Wörter.

Die Widget-API kann auch ohne KI eine **Zähler-Karte** erstellen: Ein `text`-Widget auf einer Datentabelle (`data_table_id`) mit `count_column` und `count_value` zeigt an, wie viele Zeilen diesen Wert haben; der Titel des Widgets nennt den Wert. Heym Work stellt Seiten, die aus einer Datentabelle erstellt wurden, eine Zähler-Karte pro Status voran.

Mit der Schaltfläche **Fine-tune with AI** eines Widgets passen Sie ein bestehendes Widget per neuer Anweisung an. Jede KI-Verfeinerung speichert vorab einen Snapshot des bisherigen Workflows im **Edit History**-Verlauf des Widgets, sodass Sie Änderungen im Workflow-Editor überprüfen oder zurücksetzen können.

## Layout bearbeiten

Schalten Sie **Edit** ein, um in den Bearbeitungsmodus zu wechseln, in dem Sie Widgets auf einem 12-Spalten-Raster verschieben und in der Größe ändern können. Layoutänderungen werden automatisch gespeichert. Widget-Titel lassen sich direkt in der Kopfzeile des Widgets bearbeiten.

## Caching und Aktualisierung

Jedes Widget speichert seine zuletzt berechneten Daten für eine konfigurierbare Gültigkeitsdauer (Time-to-Live, TTL) auf dem Server zwischen. Solange der Cache aktuell ist, liefert das erneute Öffnen des Dashboards das gespeicherte Ergebnis, anstatt den Workflow neu auszuführen. Der Cache wird bei jeder Neuberechnung der Daten direkt ersetzt (ein Cache pro Widget sowie zusätzlich einer pro Datensatz auf einer [Detailseite](#detail-pages)) und automatisch invalidiert, sobald Sie den Workflow des Widgets bearbeiten.

Über die Schaltfläche **Refresh** eines Widgets (oder **Refresh** in der Werkzeugleiste) umgehen Sie den Cache und berechnen die Daten sofort neu.

## Teilen

Eigentümer teilen ein Dashboard über dessen Einstellungen mit einzelnen Benutzern (per E-Mail) oder mit jedem [Team](teams-tab.md), dem sie angehören. Jede Freigabe gilt für **Read** (Lesen) oder **Write** (Schreiben); besitzt jemand sowohl eine persönliche als auch eine Team-Freigabe, gilt die weitergehende Berechtigung.

| Aktion | Eigentümer | Schreiben | Lesen |
|--------|:-----:|:-----:|:----:|
| Widgets ansehen, aktualisieren, Auto-Refresh nutzen | ✓ | ✓ | ✓ |
| Detailseiten öffnen, Ausführungs-Widgets starten | ✓ | ✓ | ✓ |
| Widgets hinzufügen, klonen, löschen, umbenennen und skalieren; per KI generieren und verfeinern; Checklistenpunkte abhaken | ✓ | ✓ | |
| Workflow eines Widgets im Editor öffnen | ✓ | ✓ | |
| Dashboard umbenennen oder löschen, Datensatzformat festlegen, Freigaben verwalten | ✓ | | |

**Widgets werden immer im Kontext des Dashboard-Eigentümers ausgeführt.** Unabhängig davon, wer das Dashboard betrachtet, nutzt ein Widget die Anmeldedaten und globalen Variablen des Eigentümers, und seine Läufe erscheinen im Ausführungsverlauf und in den Traces des Eigentümers. Teammitglieder sehen daher dieselben Daten, ohne Zugriff auf die dahinterliegenden Konten zu benötigen, und alle Betrachter teilen sich dasselbe zwischengespeicherte Ergebnis pro Widget. Widgets, die ein Mitarbeiter mit Schreibzugriff hinzufügt oder klont, gehören ebenfalls dem Eigentümer.

Aus diesem Grund erfordert **Write** dasselbe Vertrauen wie das Teilen eines Workflows zur Bearbeitung: Ein Mitarbeiter mit Schreibzugriff kann ändern, was mit Ihren Anmeldedaten ausgeführt wird. Vergeben Sie Schreibrechte nur an Personen, denen Sie auch die Bearbeitung Ihrer Workflows erlauben würden. Ein Testlauf, den ein Mitarbeiter im Workflow-Editor startet, verwendet wie bei jedem geteilten Workflow dessen eigene Anmeldedaten; nur das Dashboard selbst läuft unter dem Eigentümer. **Read** gewährt keinen Zugriff auf die Widget-Workflows, und Betrachter mit Lesezugriff erhalten lediglich das Diagramm selbst, nicht jedoch die Ausführungsdetails der einzelnen Knoten.

Das Entfernen einer Freigabe oder das Herabstufen von Schreiben auf Lesen wird sofort wirksam.

## Verwandte Themen

- [Chart-Output-Knoten](../nodes/chart-output-node.md)
- [Reiter Analysen](analytics-tab.md) — integrierte Ausführungsmetriken (unabhängig von benutzererstellten Dashboards)