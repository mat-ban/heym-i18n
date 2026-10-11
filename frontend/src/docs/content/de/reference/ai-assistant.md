# KI-Assistent

Der **AI Assistant** ist ein Chat-Panel, das sich aus dem Debug-Panel öffnet und unten rechts im Editor startet. Ziehe den Header, um es zu verschieben, und ziehe an einer Kante oder Ecke, um seine Breite oder Höhe zu ändern. Es schrumpft nicht unter 360×480 Pixel. Position und Größe werden in diesem Browser gespeichert. **Reset position and size** im Header setzt das Panel zurück in die untere rechte Ecke. Verwende natürliche Sprache, um Workflows zu erstellen oder zu ändern – beschreibe, was du möchtest, und die AI generiert Knoten und Kanten, die auf den Canvas angewendet werden.

Für Dokumentationsfragen außerhalb des Editors verwende [Chat mit Heym](./chat-with-heym.md). Diese Oberfläche ist für seitengenaue Produkthilfe optimiert statt für Workflow-Generierung.

## Öffnen des Panels

1. Öffne einen Workflow im Editor
2. Finde das **Debug-Panel** unten (Bereich für Ausführungsergebnisse)
3. Klicke auf die **AI**-Schaltfläche (Sparkles-Symbol) in der Symbolleiste des Panels
4. Das AI Assistant-Panel öffnet sich unten rechts. Ziehe seinen Header, um es zu verschieben, oder ziehe an einer Kante oder Ecke, um seine Breite und Höhe zu ändern.

Drücke `Ctrl + I` / `Cmd + I` an einer beliebigen Stelle im Editor, um das Panel zu öffnen oder zu schließen – die Tastenkombination funktioniert auch, während ein Texteingabefeld fokussiert ist. Siehe [Tastenkombinationen](./keyboard-shortcuts.md).

## Schließen des Panels

Klicke auf die **X**-Schaltfläche, drücke `Ctrl + I` / `Cmd + I` oder schalte die **AI**-Schaltfläche in der Symbolleiste des Debug-Panels um. Der Header verschiebt das Panel; er schließt es nicht.

## Konfiguration

Wähle vor dem Senden von Nachrichten:

| Einstellung | Beschreibung |
|---------|-------------|
| **Credential** | LLM-Anmeldedaten (API-Schlüssel) aus [Credentials](../tabs/credentials-tab.md) |
| **Model** | Modellname (z. B. `gpt-4o`, `gemini-2.5-flash`) |

Füge Anmeldedaten im [Reiter Anmeldedaten](../tabs/credentials-tab.md) hinzu. Die Modellliste wird aus den ausgewählten Anmeldedaten geladen.

## Agent Mode vs Ask Mode

Das Panel hat zwei Modi, die mit dem **Agent / Ask**-Chip im Panel-Header umgeschaltet werden.

| Modus | Standard | Verhalten |
|------|---------|-----------|
| **Agent** | ✓ | Erstellt und ändert den Canvas. Die AI generiert einen Workflow-JSON-Block, der automatisch auf den Canvas angewendet wird, wenn die Antwort abgeschlossen ist. |
| **Ask** | | Beantwortet nur Fragen. Der Canvas wird nie berührt. Verwende dies, um Fragen zu deinem Workflow, zu Heym-Funktionen zu stellen oder Ratschläge zu erhalten, ohne eine Canvas-Aktualisierung auszulösen. |

Wechsle die Modi jederzeit. Das Ändern des Modus löscht die Konversation nicht.

Im Agent-Modus lässt das Kontrollkästchen **YOLO mode** unter dem Nachrichtenfeld den Assistant ausführen und korrigieren, was er erstellt. Siehe [YOLO Mode](#yolo-mode).

## Verwenden des Chats

- Gib deine Anfrage in das Eingabefeld ein (z. B. „Erstelle einen Workflow, der Benutzereingaben entgegennimmt und sie an ein LLM sendet")
- Drücke **Enter** zum Senden (Shift+Enter für Zeilenumbruch)
- Die AI streamt ihre Antwort. Im **Agent**-Modus wird, wenn die Antwort einen Workflow in einem \`\`\`json-Codeblock enthält, dieser automatisch geparst und auf den Canvas angewendet. Im **Ask**-Modus wird der Canvas nie geändert.
- Verwende **Clear**, um die Konversation zurückzusetzen
- Fahre mit der Maus über eine Nachricht und klicke auf ihr Kopiersymbol, um den angezeigten Text zu kopieren, einschließlich etwaiger Workflow-JSON
- Ziehe die Linie über dem Nachrichtenfeld, um das Feld höher zu machen. Der Eingabebereich kann auf 60 % des Panels anwachsen und kehrt beim Neuladen der Seite zu seiner Standardhöhe zurück

## Workflow Auto-Apply

Wenn die AI-Antwort einen gültigen Workflow-JSON-Block (mit `nodes` und optional `edges`) in einem \`\`\`json-Codeblock enthält, wird Heym:

1. Das JSON aus der Antwort parsen
2. Den aktuellen Canvas durch die neuen Knoten und Kanten ersetzen
3. Das Knoten-Layout aufräumen
4. Den Workflow als ungespeichert markieren

Wenn das Parsen fehlschlägt, erscheint eine **Retry**-Schaltfläche, um die Antwort neu zu generieren.

## YOLO Mode

Der **YOLO mode** lässt den Assistant testen, was er erstellt. Aktiviere das Kontrollkästchen **YOLO mode** unter dem Nachrichtenfeld und sende dann deine Anfrage. Das Kontrollkästchen erscheint nur im Agent-Modus. Es ist standardmäßig deaktiviert und wird beim Neuladen der Seite auf deaktiviert zurückgesetzt. Fahre mit der Maus über das Info-Symbol daneben für eine kurze Zusammenfassung.

Mit aktiviertem YOLO mode stoppt der Assistant nicht, nachdem er einen Workflow angewendet hat:

1. Er wendet den Workflow auf den Canvas an.
2. Vor dem ersten Lauf fragt er nach Testeingaben. Die Karte listet die Eingabefelder des Workflows auf, gefüllt mit Werten, die der Assistant vorschlägt. Bearbeite sie und drücke **Run**. Spätere Läufe verwenden diese Werte erneut. Die Karte erscheint nur dann wieder, wenn sich die Eingabefelder ändern oder der Assistant andere Testdaten benötigt.
3. Er führt den Workflow auf dem Canvas genau wie die **Run**-Schaltfläche aus: ungespeicherte Änderungen werden zuerst gespeichert, Knoten leuchten auf, und der Lauf erscheint im Debug-Panel und in der [Ausführungsverlauf](./execution-history.md).
4. Er liest das Ergebnis. Wenn der Lauf das getan hat, was du verlangt hast, schließt er mit **Verified** und einer kurzen Zusammenfassung ab. Wenn nicht, korrigiert er den Workflow und führt ihn erneut aus.

Er führt höchstens **5 Läufe** pro Nachricht aus. Drücke jederzeit **Stop**, um die Schleife zu beenden und einen laufenden Lauf zu stoppen.

Jede Antwort zeigt ihre Schritte, während sie geschehen:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, mit einer `Executing <node>`-Zeile für jeden Knoten;
- das endgültige Urteil.

Nach jedem Lauf zeigt eine kurze Zeile wie *Attempt 1 result sent · error in 1.2s* an, dass das Ergebnis an den Assistant zurückgesendet wurde.

### Ausführen deiner anderen Workflows

Im YOLO mode kann der Assistant auch deine anderen Workflows ausführen, wenn er deren Ergebnis benötigt. Zum Beispiel kann er prüfen, was ein Workflow zurückgibt, bevor er ihn aus einem [Execute](../nodes/execute-node.md)-Knoten aufruft. Diese Läufe erscheinen als `Running workflow "<name>"...`-Schritte und werden in der Execution History mit der Trigger-Quelle `ai_assistant` aufgezeichnet. Der Workflow, der bearbeitet wird, wird immer auf dem Canvas getestet.
### Wenn er vorzeitig stoppt

| Situation | Was passiert |
|---|---|
| Der Assistent benötigt eine Entscheidung, eine Information, eine Anmeldedaten oder eine Datentabelle | Er fragt mit der üblichen Fragekarte nach. Das Beantworten setzt die Schleife fort. |
| Der Lauf wartet auf eine [menschliche Überprüfung](./human-in-the-loop.md) | Die Schleife stoppt. Genehmige die Überprüfung und sende dann eine Nachricht. |
| Der Workflow wartet auf einen Datei-Upload | Die Schleife stoppt. Der YOLO-Modus kann keine durch Upload ausgelösten Läufe testen. |
| Eine neuere Version des Workflows wurde an anderer Stelle gespeichert | Die Schleife stoppt. Löse den Speicherkonflikt und sende dann eine Nachricht. |

> **Läufe sind echt.** E-Mails, Nachrichten und API-Aufrufe im Workflow werden bei jedem Versuch tatsächlich gesendet, und Datentabellen-Knoten schreiben echte Zeilen. Jeder Lauf speichert den Workflow, sodass frühere Versionen im [Verlauf](./edit-history.md) erhalten bleiben.

## Spracheingabe

In unterstützten Browsern aktiviert eine **Voice**-Schaltfläche die Spracherkennung. Klicke, um die Aufnahme zu starten, klicke erneut, um sie zu stoppen. Der transkribierte Text wird zur Grammatikkorrektur an die KI gesendet, bevor du ihn absendest.

## Agent-Knoten vs. KI-Assistent

| | Agent-Knoten | KI-Assistent |
|---|------------|---------------|
| **Zweck** | LLM-Knoten innerhalb eines Workflows; läuft während der Ausführung | Chat-UI zum Erstellen von Workflows mit natürlicher Sprache |
| **Ort** | Canvas-Knoten | Debug-Panel → schwebendes Panel |
| **Wann** | Zur Laufzeit | Während der Bearbeitung |

Siehe [Agent-Knoten](../nodes/agent-node.md) für den Workflow-Knoten, der LLM-Aufrufe mit Tools und MCP ausführt.

## Wie es funktioniert (AI Builder DSL)

Der KI-Assistent wird von einer **Workflow-DSL** (domänenspezifische Sprache) angetrieben, die Knoten, Kanten und Ausdrücke beschreibt. Wenn du eine Nachricht sendest:

1. Deine Nachricht plus [Benutzerregeln](./user-settings.md) und der aktuelle Workflow (falls vorhanden) werden an das Backend gesendet.
2. Das Backend erstellt einen **System-Prompt**, der Folgendes enthält:
   - Die vollständige Workflow-DSL (Knotentypen, Ausdruckssyntax, Regeln, Beispiele)
   - Deine Benutzerregeln, angehängt als "User Custom Rules"
   - Das aktuelle Workflow-JSON, wenn du einen bestehenden Workflow bearbeitest
   - Die Liste der verfügbaren Workflows, wenn du den Execute-Knoten verwendest
   - Die Namen, Typen und IDs deiner eigenen Anmeldedaten (niemals deren Werte)
   - Die Namen, IDs, Beschreibungen und Spalten der Datentabellen, die du verwenden kannst (niemals deren Zeilen)
3. Das Modell gibt einen einzelnen Workflow-JSON-Block zurück (mit `nodes` und `edges`). Das Frontend parst ihn und wendet ihn auf den Canvas an.

### Anmeldedaten

Wenn ein Workflow eine Anmeldedaten benötigt, fragt der Assistent nach, bevor er ihn erstellt. Wenn du Anmeldedaten eines passenden Typs hast, listet er sie zusammen mit **Create a new credential** auf; wenn du keine hast, fragt er, ob eine erstellt werden soll. Bei jeder Frage kannst du auch ohne Anmeldedaten fortfahren.

Wenn du dich für das Erstellen entscheidest, öffnet sich das Anmeldedaten-Formular im Panel, voreingestellt auf den richtigen Typ und einen vorgeschlagenen Namen. Die Werte gehen direkt an Heym; der Assistent erfährt nur den Namen und Typ. OAuth-Anmeldedaten (Google Sheets, Google Drive, BigQuery, Linear, Notion) werden in einem Popup verbunden, und ein Link zur Autorisierungsseite erscheint, falls das Popup blockiert wird. Sobald die Anmeldedaten gespeichert sind, zeigt die Karte ihren Namen an und die Erstellen-Schaltfläche wird deaktiviert; drücke **Submit answers** und der Assistent setzt die neue Anmeldedaten auf den Knoten.

Du kannst auch allein nach einer Anmeldedaten fragen ("create a GitHub credential") oder darum bitten, eine dir gehörende zu ändern ("update my sheet credential", "reconnect my Google Sheets"). Der Assistent antwortet mit derselben Karte: Erstellen öffnet ein leeres Formular, Aktualisieren öffnet das Formular für diese Anmeldedaten mit maskierten Geheimnissen.

Der Assistent bevorzugt einen dedizierten Knoten. Wenn kein Knoten eine Operation abdeckt, wie das Hinzufügen eines Reiters zu einem Google Sheet, verwendet er eine HTTP-Anfrage und schreibt die Kopfzeile für die gewählte Anmeldedaten. Siehe [HTTP › Authentifizierung mit Anmeldedaten](../nodes/http-node.md#authenticating-with-credentials).

Klärungsfragen, auf die der Workflow verzichten kann, sind in ihrer Eingabe mit **Optional** gekennzeichnet und können übersprungen werden.

Die DSL erzwingt camelCase-Labels, einheitliche Ausdrucksregeln und knotenspezifische Felder. Wenn ein Feldwert ein einzelnes `$expr` ist, bewahrt das Backend den nativen Typ; wenn der Wert Prosa mit `$refs` vermischt, ist das Ergebnis ein String. Die Ein-`$`-Regel gilt weiterhin: kein `$` innerhalb von Klammern. [Einstellungen](./user-settings.md) Benutzerregeln werden in diesen System-Prompt eingefügt, sodass deine Präferenzen für jeden KI-generierten Workflow gelten.

Wenn der aktuelle Workflow Agent-Skills enthält, fügt der KI-Assistent nur die `SKILL.md` jedes Skills in diesen Workflow-Kontext ein. Angehängte `.py`-Dateien und binäre Skill-Assets werden vor der Anfrage entfernt, damit der Builder innerhalb der Modellkontextgrenzen bleibt, selbst wenn Skills große Implementierungen enthalten.

### Datentabellen

Wenn ein Workflow Datensätze speichert, ablegt oder nachschlägt und du keinen anderen Speicher benannt hast, verwendet der Assistent einen [DataTable](../nodes/datatable-node.md)-Knoten. Wenn du eine deiner Tabellen benennst und sie die Spalten hat, die der Workflow benötigt, verwendet der Assistent sie. Andernfalls fragt er, welche Tabelle verwendet werden soll. Die Karte listet die passenden Tabellen auf, jede mit ihrer Beschreibung und ihren Spaltentypen, plus **Create a new table** mit einem vorgeschlagenen Namen und Spalten. Mit dir geteilte Tabellen werden ebenfalls angeboten; eine, die du nur lesen kannst, wird nur zum Lesen angeboten.

Wähle die neue Tabelle und drücke **Submit answers**: Die Karte erstellt die Tabelle, und der Assistent setzt ihre ID auf den Knoten und verwendet ihre exakten Spaltennamen. Du kannst auch allein nach einer Tabelle fragen, zum Beispiel "create a table for my leads".

Der Assistent sieht Tabellennamen, Beschreibungen und Spalten, niemals Zeilen. Er ändert niemals die Spalten einer bestehenden Tabelle: Wenn einer Tabelle eine Spalte fehlt, die der Workflow benötigt, benennt er die Spalte und bietet stattdessen eine neue Tabelle an. Füge Spalten im [DataTable-Reiter](../tabs/datatable-tab.md) hinzu.
## Verwandte Themen

- [Warum Heym](../getting-started/why-heym.md) – Natural-Language-Building als erste Phase des Agenten-Lebenszyklus
- [Schnellstart](../getting-started/quick-start.md) – Erstelle deinen ersten Workflow
- [Einstellungen](./user-settings.md) – Benutzerregeln, die in den System-Prompt des AI Assistant injiziert werden
- [Chat mit Heym](./chat-with-heym.md) – Seitenbewusster Assistent innerhalb des Dokumentationsbereichs
- [Kernkonzepte](../getting-started/core-concepts.md) – Workflows, Knoten und Ausführungsfluss
- [Agent-Knoten](../nodes/agent-node.md) – LLM-Knoten mit Tools und MCP
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – API-Schlüssel für den AI Assistant hinzufügen
- [Workflow-Struktur](./workflow-structure.md) – JSON-Format für Workflows
