# Canvas-Funktionen

Der Workflow-Editor bietet mehrere Funktionen zum Debuggen, Testen und Organisieren von Knoten: **Bis zum Knoten ausführen**, **KI an einem Knoten**, **Data Pin**, **Ausführungsprotokolle**, **Aktivieren/Deaktivieren** und **In Sub-Workflow extrahieren**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Editor-Demo ansehen</a></p>

## Bis zum Knoten ausführen

Fahre mit der Maus über einen beliebigen Knoten (außer einer Haftnotiz) und klicke auf **Ausführen** darunter. Heym führt diesen Knoten und seine vorgelagerten Abhängigkeiten aus und lässt nachgelagerte Knoten und nicht verbundene Zweige unberührt. Dabei wird der Canvas-Testmodus verwendet, einschließlich gepinnter Ausgaben und der normalen Verzweigungsbedingungen des Workflows.

Wenn der ausgewählte Pfad Eingabefelder enthält, öffnet sich das rechte **Ausführen**-Panel und fokussiert das erste Feld. Gib die Werte ein und klicke dann auf **Bis zu _Knotenbezeichnung_ ausführen** oder drücke **Strg+Enter** (Cmd+Enter unter macOS). Der generische Body-Modus fokussiert den JSON-Body-Editor. Pfade ohne Eingabefelder werden sofort ausgeführt, ohne dass das Panel geöffnet wird. Gepinnte Eingabe-Knoten verwenden ihre gepinnte Ausgabe erneut, ohne nach einer Eingabe zu fragen.

Das Panel behält das ausgewählte Ziel für nachfolgende Ausführungen bei. Wähle **Vollständigen Workflow ausführen**, um das Ziel zu löschen. Die Ausführen-Schaltflächen sind deaktiviert, während eine Ausführung aktiv ist. Ein Ziel innerhalb einer Schleife stoppt die Ausführung, sobald dieser Knoten zum ersten Mal erreicht wird; wenn du einen Knoten nach der Schleife auswählst, wird die vollständige vorgelagerte Schleife ausgeführt.

## KI an einem Knoten

Bewegen Sie den Mauszeiger über einen beliebigen Knoten außer einer Notiz und klicken Sie darüber auf **AI**. Der [KI-Assistent](./ai-assistant.md) öffnet sich für diesen Knoten und bietet **Change this node as ...**, **Fix error in this node ...** und **Other**. Im Agent-Modus ändert der Assistent nur diesen Knoten; andere Knoten, Verbindungen und das Layout bleiben unverändert. Siehe [KI-Assistent › Einen einzelnen Knoten anpassen](./ai-assistant.md#changing-one-node).

Die Schaltfläche ist bei Workflows ausgeblendet, die Sie nur anzeigen können.

## Data Pin

Mit Data Pin kannst du die Ausgabe eines Knotens aus der letzten Ausführung pinnen, sodass du nachgelagerte Knoten testen kannst, ohne den gepinnten Knoten erneut auszuführen.

### Wo du es findest

- **Eigenschaften-Panel** – Wähle einen Knoten aus und scrolle zum Abschnitt **Gepinnte Daten**
- **Knoten-Badge** – Ein Pin-Symbol erscheint am Knoten, wenn Daten gepinnt sind

### Aktionen

| Aktion | Beschreibung |
|--------|-------------|
| **Pinnen** | Pinnt die letzte Ausführungsausgabe des Knotens (verfügbar nach einer Ausführung) |
| **Löschen** | Entfernt gepinnte Daten |
| **Bearbeiten** | Bearbeite das gepinnte JSON direkt; klicke auf Speichern, um es anzuwenden |

### Verhalten im Testmodus

Beim Ausführen eines Workflows im Testmodus überspringen Knoten mit `pinnedData` die Ausführung und verwenden stattdessen die gepinnte Ausgabe. Verwende dies, um:

- nachgelagerte Logik zu testen, ohne externe APIs aufzurufen
- Ausdrücke zu debuggen, die auf die Ausgabe des Knotens verweisen
- Prompts oder Bedingungen mit festen Beispieldaten zu iterieren

Die Ausdrucksvervollständigung im Editor verwendet gepinnte Daten, sofern verfügbar, um Felder vorzuschlagen.

## Ausführungsprotokolle

Das **Debug-Panel** (untere Auslade) zeigt Echtzeit-Ausführungsprotokolle während Workflow-Ausführungen. Du
kannst auch eine laufende Produktionsausführung entweder über den Verlauf-Dialog oder eine Board-Karte öffnen. Der
Editor verbindet sich mit dem SSE-Stream dieser Ausführung, stellt abgeschlossene Knotenergebnisse wieder her und zeigt
weiterhin Knotenanimationen und Protokolle an, wenn neue Knoten starten und abgeschlossen werden.

### Was es anzeigt

- **Knotenergebnisse** – Status pro Knoten (`success`, `error`, `skipped`, `running`), Ausführungszeit und Ausgabe
- **Endgültige Ausgaben** – Aggregierte Ausgaben von [Ausgabe](../nodes/output-node.md)-Knoten
- **Agent-Fortschritt** – Bei [Agent](../nodes/agent-node.md)-Knoten schrittweise Tool-Aufrufe und Reasoning

### Aktionen

- **Als JSON kopieren** – Kopiert das vollständige Ausführungsprotokoll in die Zwischenablage
- **Im JSON-Editor öffnen** – Öffnet das Protokoll in JSON Hero oder JSON Editor Online zur Überprüfung
- **Generierte Dateien herunterladen** – Wenn ein Skill herunterladbare Dateien erzeugt hat (`_generated_files`), erscheint eine Download-Schaltfläche. Eine einzelne Datei wird direkt heruntergeladen; bei mehreren Dateien öffnet sich ein Auswahl-Popup.

### Abgrenzung zum Logs-Reiter

Das Debug-Panel zeigt **Workflow-Ausführungs**protokolle (Knotenergebnisse, Ausgaben). Der [Logs-Reiter](../tabs/logs-tab.md) zeigt **Docker-Container**-Protokolle (Backend, Frontend, Datenbank). <!-- pragma: allowlist secret -->

## Aktivieren / Deaktivieren

Du kannst Knoten deaktivieren, sodass sie während der Ausführung übersprungen werden. Deaktivierte Knoten zeigen ein „Aus"-Badge und erscheinen abgeblendet.

### So schaltest du um

| Methode | Beschreibung |
|--------|-------------|
| **Eigenschaften-Panel** | Knoten auswählen → Power-Symbol (oben rechts) |
| **Kontextmenü** | Rechtsklick auf Knoten → Deaktivieren oder Aktivieren |
| **Tastatur** | Knoten auswählen → **D** drücken (siehe [Tastaturkürzel](./keyboard-shortcuts.md)) |

### Mehrfachauswahl

Wenn mehrere Knoten ausgewählt sind, wird Aktivieren/Deaktivieren auf alle angewendet. Das Kontextmenü zeigt „Aktivieren", wenn ein ausgewählter Knoten deaktiviert ist, und „Deaktivieren", wenn alle aktiviert sind.

### Laufzeitverhalten

Knoten mit `active: false` werden übersprungen. Nachgelagerte Knoten erhalten keine Daten von übersprungenen Knoten. Verwende dies, um Knoten vorübergehend auszuschließen, ohne sie zu löschen.

Um einen Knoten von innerhalb eines Workflows statt manuell ein- oder auszuschalten, verwende [Knoten deaktivieren](../nodes/disable-node.md) und [Knoten aktivieren](../nodes/enable-node.md).
## Agent-Speichergraph

[Agent](../nodes/agent-node.md)-Knoten mit aktiviertem **[persistenten Speicher](./agent-persistent-memory.md)** zeigen ein pinkfarbenes **Gehirn**-Steuerelement am Knoten. Klicke darauf, um den Speichergraph-Editor zu öffnen: Entitäten werden als animierter, kraftgerichteter Graph dargestellt, gruppiert nach Entitätstyp, mit durchsuchbaren Source/Target-Auswahlfeldern zum Hinzufügen von Beziehungen und einem Verbindungsbereich zum Springen zwischen verknüpften Entitäten. Derselbe Dialog enthält **Speicher mit anderen Agenten teilen** (Workflow → Agent → Lesen oder Lesen/Schreiben) für [agentenübergreifende Speicherfreigabe](./agent-persistent-memory.md#sharing-with-other-agents). Während der Dialog geöffnet ist, wird das Rückgängig/Wiederholen des Haupt-Canvas zurückgestellt, damit die Graphbearbeitung ihre eigene Historie behält.

**Den Graphen filtern.** Oben links auf dem Canvas befindet sich ein Suchsteuerelement, das zu einer Shortcut-Schaltfläche zusammengeklappt ist, bis du darauf klickst oder **Strg/Cmd+F** drückst. Es gleicht den Namen einer Entität, ihren Typ sowie jeden Attributschlüssel und -wert ab, ebenso den Typ einer Beziehung (`parent_of`) und deren Eigenschaften; eine übereinstimmende Beziehung bringt beide ihrer Entitäten mit. Alle durch Leerzeichen getrennten Begriffe müssen übereinstimmen. Eine übereinstimmende Entität bringt ihre gesamte Nachbarschaft mit — jede Beziehung, an der sie beteiligt ist, und die Entität auf der anderen Seite jeder dieser Beziehungen —, sodass eine Übereinstimmung niemals als unverbundener Punkt zurückbleibt. Eine übereinstimmende Beziehung bringt nur die beiden Entitäten mit, die sie verbindet, und endet dort, da die Suche nach einem Beziehungstyp eine Frage nach dieser Beziehung ist und nicht nach allem, woran ihre Enden hängen. Alles andere wird auf dem Canvas und in der Liste **Alle Kanten** vollständig ausgeblendet — nicht abgeschwächt —, und ein Badge zeigt an, wie viele der gesamten Entitäten übrig sind. Das **✕** im Feld löscht zuerst die Abfrage und schließt das Feld beim zweiten Drücken. Escape geht in derselben Weise zurück, von innen nach außen: Es löscht die Abfrage, schließt dann das Suchfeld, verlässt dann die erweiterte Canvas-Ansicht und schließt erst dann den Dialog, wenn nichts davon geöffnet ist. Das Zurücksetzen stellt den vollständigen Graphen wieder her, wobei jede Entität an ihren ursprünglichen Platz zurückkehrt.

**Entitäten von Hand platzieren.** Das Ziehen einer Entität fixiert sie dort, wo du sie ablegst, sodass das Auto-Layout den Rest des Graphen um sie herum anordnet, anstatt sie zurückzuziehen. Das Ziehen der ausgewählten Entität bewegt ihre direkt verbundenen Entitäten mit und behält die Form des Clusters bei; das Ziehen einer anderen Entität bewegt nur diese eine. **Layout aufräumen** (die Zauberstab-Schaltfläche) löst jede fixierte Entität und führt das Auto-Layout erneut aus.

## In Sub-Workflow extrahieren

Wandle ausgewählte Knoten in einen wiederverwendbaren Sub-Workflow um und ersetze sie durch einen [Execute](../nodes/execute-node.md)-Knoten.

### Verwendung

1. Wähle einen oder mehrere Knoten auf dem Canvas aus
2. Rechtsklick → **In Sub-Workflow extrahieren**
3. Gib einen Namen (und eine optionale Beschreibung) für den neuen Workflow ein
4. Klicke auf **Extrahieren**

### Was passiert

- Ein neuer Workflow wird mit den ausgewählten Knoten erstellt
- Externe Eingaben (Kanten von außerhalb der Auswahl) werden zu den [Input](../nodes/input-node.md)-Feldern des Sub-Workflows
- Externe Ausgaben (Kanten zu Knoten außerhalb der Auswahl) werden auf den [Output](../nodes/output-node.md) des Sub-Workflows abgebildet
- Die ausgewählten Knoten werden durch einen einzelnen [Execute](../nodes/execute-node.md)-Knoten ersetzt, der den neuen Workflow aufruft
- Eingabe-/Ausgabezuordnungen bleiben automatisch erhalten

### Anwendungsfälle

- Eine Abfolge von Knoten über mehrere Workflows hinweg wiederverwenden
- Einen komplexen Workflow vereinfachen, indem zusammengehörige Logik gruppiert wird
- Modulare, testbare Sub-Workflows erstellen

## Mit cURL ausführen

Die **cURL**-Schaltfläche in der Editor-Symbolleiste (oben rechts) öffnet einen Dialog zum Erstellen und Kopieren eines cURL-Befehls zum Auslösen des Workflows über die API.

- Wähle den Request-Body-Modus des Workflows (`Defined` oder `Generic`)
- Lege den Authentifizierungstyp fest (Anonymous, JWT oder Header Auth)
- Konfiguriere Antwort-Caching und Rate Limiting
- Schalte SSE-Streaming um und passe die Startnachrichten pro Knoten an
- Bearbeite den Request-Body
- Im Generic-Modus verwendet das Ausführungs-Panel des Canvas denselben rohen JSON-Body wie der cURL-Dialog
- Klicke auf **cURL kopieren**, um den ausführbereiten Befehl zu kopieren

Siehe [Webhooks](./webhooks.md#run-with-curl-dialog) für vollständige Dialogdetails und [SSE-Streaming](./sse-streaming.md) für das Ereignisprotokoll.

## Verwandte Themen

- [Tastaturkürzel](./keyboard-shortcuts.md) – Alle Canvas- und Editor-Tastaturkürzel
- [Persistenter Agent-Speicher](./agent-persistent-memory.md) – Verhalten und API des Speichergraphen
- [Execute-Knoten](../nodes/execute-node.md) – Ruft Sub-Workflows auf
- [Ausdrucks-DSL](./expression-dsl.md) – Referenzen und fixierte Daten
- [Workflow-Struktur](./workflow-structure.md) – Knoten- und Kantenformat
- [Herunterladen & Importieren](./download-import.md) – Workflows als JSON exportieren und importieren
- [Knotentypen](./node-types.md) – Alle Knotentypen
- [Logs-Reiter](../tabs/logs-tab.md) – Docker-Container-Logs
- [Ausführungsverlauf](./execution-history.md) – Vergangene Ausführungen
- [Vorlagen](../tabs/templates-tab.md) – Workflows und Knoten speichern und wiederverwenden
- [Kontextbezogene Showcase](./contextual-showcase.md) – Kompakte Seitenanleitung, die im Editor verfügbar ist
