# Workflow-Analyse

Die **Workflow-Analyse** ist ein linkes Panel, das ein gemeinsames, bearbeitbares Markdown-Dokument pro Workflow enthält. Verwende es, um zu erklären, was ein Workflow tut, und um Verbesserungsideen festzuhalten – und lasse KI einen ersten Entwurf für dich generieren.

Das Dokument ist gemeinsam genutzt: Jeder, der auf den Workflow zugreifen kann, kann es lesen und bearbeiten. Es wird mit dem Workflow gespeichert und automatisch gelöscht, wenn der Workflow gelöscht wird.

## Öffnen des Panels

1. Öffne einen Workflow im Editor.
2. Klicke in der Editor-Symbolleiste auf **Analysieren** (Sparkles-Symbol).
3. Das Panel öffnet sich auf der linken Seite. Die Knoten-Palette (linkes Panel) wird eingeklappt, während es geöffnet ist; das erneute Öffnen der Knoten-Palette schließt das Analyse-Panel.

Das Panel ist nur für gespeicherte Workflows verfügbar. Bei einem brandneuen, ungespeicherten Workflow speichere ihn zuerst.

## Das Dokument

Das Panel zeigt ein einzelnes Markdown-Dokument mit zwei Ansichten, die über die Schaltflächen **Bearbeiten** (Stift) und **Vorschau** (Auge) umgeschaltet werden:

| Ansicht | Zweck |
|------|---------|
| **Bearbeiten** | Einfacher Markdown-Editor (Textarea). |
| **Vorschau** | Gerendertes Markdown. |

Die Kopfzeile zeigt, **wer zuletzt bearbeitet** hat und wann.

### Speichern

Klicke auf **Speichern**, um deine Änderungen zu persistieren. Speichern ist nur aktiviert, wenn ungespeicherte Änderungen vorhanden sind.

Da das Dokument gemeinsam genutzt wird, verwenden Speichervorgänge optimistische Nebenläufigkeit:

- Wenn jemand anderes seit dem Öffnen des Panels eine neuere Version gespeichert hat, wird dein Speichervorgang abgelehnt und eine Warnung erscheint, die den anderen Bearbeiter nennt.
- Du kannst dann **Neu laden (meine verwerfen)** wählen, um die Serverversion zu übernehmen, oder **Überschreiben**, um deine Version über die andere zu erzwingen.

## KI-Analyse

Wähle oben im Panel eine LLM-**Anmeldedaten** und ein **Modell** aus (die Modellliste wird aus den ausgewählten Anmeldedaten geladen – siehe [Anmeldedaten](../tabs/credentials-tab.md)). Führe dann die Analyse aus:

- **Meinen Workflow analysieren** – wird angezeigt, wenn das Dokument leer ist. Es streamt einen KI-generierten Markdown-Bericht direkt als ungespeicherten Entwurf in den Editor. Überprüfe und bearbeite ihn, dann **Speichern**.
- **Erneut analysieren** – wird angezeigt, wenn das Dokument bereits Inhalt hat. Es streamt einen frischen Bericht in eine separate **Vorschau**, wobei dein aktuelles Dokument unangetastet bleibt. Wähle **Übernehmen**, um den Editor-Inhalt durch die neue Analyse zu ersetzen, oder **Verwerfen**, um das zu behalten, was du hattest.

Beide Aktionen **führen zuerst den Workflow aus** (wenn er gültig und ausführbar ist) und beziehen die Ausführungsergebnisse in den Analyse-Prompt ein, sodass der Bericht widerspiegelt, wie sich der Workflow tatsächlich verhält. Wenn der Workflow nicht ausgeführt werden kann, fährt die Analyse stattdessen mit seiner statischen Struktur fort.

Der generierte Bericht deckt drei Abschnitte ab, in dieser Reihenfolge: **Verbesserungsbereiche** (konkrete Vorschläge, einschließlich eines **Sicherheits**-Aspekts, wann immer der Workflow Anmeldedaten, Benutzereingaben, externe Anfragen oder Datenexposition berührt), den **Zweck** des Workflows und **Was er tut** (ein schrittweiser Durchgang durch die Knoten).

Der Abschnitt **Verbesserungsbereiche** führt immer fünf explizite Prüfungen durch:

1. **Fehlerabdeckung** – wenn der Canvas keinen [Error Handler](../nodes/error-handler-node.md)-Knoten hat und kein Fehler-Workflow konfiguriert ist, weist der Bericht darauf hin und empfiehlt, Fehlerbehandlung hinzuzufügen.
2. **Eingesparte Zeit** – wenn keine geschätzte eingesparte Zeit pro Ausführung festgelegt ist, empfiehlt der Bericht, eine zu konfigurieren, damit die **Eingesparte Zeit**-Metrik der [Analytik](../tabs/analytics-tab.md) befüllt werden kann.
3. **Netzwerk-Knoten** – für Knoten, die Netzwerkaufrufe durchführen (wie [HTTP](../nodes/http-node.md) und Integrations-Knoten), empfiehlt der Bericht knotenspezifische Fehlerbehandlung (Retry und/oder Continue-on-Error) auf diesen Knoten.
4. **Warnungen** – wenn keine [Warnungen](../tabs/alerts-tab.md) für den Workflow konfiguriert sind, empfiehlt der Bericht, Warnungen einzurichten, bevor es in die Produktion geht.

5. **Evals**: Wenn der Workflow einen [Agent](../nodes/agent-node.md)-Knoten ohne Agent-Suite enthält, empfiehlt der Bericht eine **Agent Suite** (oder eine **Prompt Suite**) in [Evals](../tabs/evals-tab.md#agent-suites); besitzt er einen [LLM](../nodes/llm-node.md)-Knoten, empfiehlt er eine **Prompt Suite**, um diesen Prompt modellübergreifend zu testen.

### Analyzer aus den Eigenschaften ausführen

Wenn ein Workflow Knoten auf dem Canvas hat, aber noch kein Analyse-Dokument, erscheint eine Schaltfläche **Analyzer ausführen** im Workflow-weiten [Eigenschaften](./canvas-features.md)-Panel (angezeigt, wenn kein Knoten ausgewählt ist). Sie öffnet dieses Workflow-Analyse-Panel, damit du Anmeldedaten und Modell auswählen und den Bericht generieren kannst.

Jeder Analyse-Durchlauf wird in [Traces](../tabs/traces-tab.md) unter der Quelle **Workflow-Analyse** aufgezeichnet.

Wenn keine LLM-Anmeldedaten konfiguriert sind, ist die Schaltfläche Analysieren deaktiviert – füge eine im [Anmeldedaten-Reiter](../tabs/credentials-tab.md) hinzu.

## Verwandtes

- [KI-Assistent](./ai-assistant.md) – generiere oder ändere Workflow-Knoten aus natürlicher Sprache.
- [Sticky Note](../nodes/sticky-note-node.md) – für kurze Notizen, die direkt auf dem Canvas angeheftet werden.
