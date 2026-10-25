# Reiter Chat

Der Reiter **Chat** bietet eine direkte LLM-Chatoberfläche. Nutzen Sie ihn, um Modelle zu testen, Fragen zu stellen, bestehende Workflows auszuführen oder aus einer natürlichsprachlichen Anfrage einen neuen Workflow zu erstellen.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Video-Demo zum Chat ansehen</a></p>

## Einrichtung & Start

1. Wählen Sie Ihre [Anmeldedaten](./credentials-tab.md) (API-Key für OpenAI, Google, DeepSeek etc.)
2. Wählen Sie ein Modell aus dem Dropdown-Menü (Modelle werden aus den gewählten Anmeldedaten geladen)
3. Beginnen Sie mit der Eingabe, um Nachrichten zu senden

Sie können eine Konversation auch über das Chat-Eingabefeld im Reiter [Workflows](./workflows-tab.md) starten. Dadurch wird Ihre erste Nachricht gesendet und die neue Konversation hier geöffnet, während die Antwort bereits gestreamt wird.

## Funktionen

- **Kontext globaler Variablen** – Ihre [globalen Variablen](../reference/global-variables.md) stehen dem LLM zur Verfügung, sodass Sie gespeicherte Werte abfragen oder darauf verweisen können
- **Kontext von Arbeitsbereichsvorlagen** – Geteilte Workflow- und Knotenvorlagen in Ihrem Arbeitsbereich werden als Kontext einbezogen, sodass Chat Fragen zu verfügbaren Vorlagen beantworten kann
- **Langlebiger Agent** – Chat arbeitet im Backend weiter, selbst wenn der Browser geschlossen wird, sodass Sie von einem anderen Gerät zurückkehren und dieselbe Konversation fortsetzen können
- **Workflow-Erstellung** – Bitten Sie Chat, einen Workflow zu erstellen oder zu ändern; er speichert den Workflow, führt Testläufe mit realistischen Beispieldaten durch, behebt Fehler und schließt ab, sobald ein Durchlauf erfolgreich ist. Siehe [Workflows erstellen](#workflows-erstellen)
- **Kanban-Aufgaben erstellen** – Bitten Sie in natürlicher Sprache darum, eine Aufgabe hinzuzufügen oder eine Karte zu erstellen. Chat fügt sie in die erste Spalte des gewünschten Boards ein; haben Sie mehrere Boards und nennen keines, blendet Chat vor dem Erstellen eine Board-Auswahl ein
- **Nachrichten-Warteschlange (Queued Follow-ups)** – Senden Sie weitere Nachrichten, während eine Antwort gestreamt wird. Eingereihte Nachrichten werden persistent gespeichert, können vor ihrem Start bearbeitet oder gelöscht werden und werden der Reihe nach nach der aktiven Antwort abgearbeitet
- **Planungspausen** – Benötigt Chat Details für die Planung, stellt er Rückfragen und pausiert eingereihte Folgenachrichten, bis Sie antworten. Nach Abschluss der Planungsantwort werden die eingereihten Nachrichten fortgesetzt
- **Anmeldedaten** – Benötigt ein von Chat erstellter oder bearbeiteter Workflow Anmeldedaten, fragt Chat, welche verwendet werden sollen, bietet an, neue in der Konversation anzulegen, oder lässt Sie ohne fortfahren. Sie können Chat auch bitten, Anmeldedaten zu erstellen oder eigene zu aktualisieren; das Anmeldedaten-Formular öffnet sich direkt in der Konversation. Das Modell sieht Name und Typ der Anmeldedaten, niemals deren Werte, sowohl für eigene als auch für mit Ihnen geteilte Anmeldedaten. Von Chat hinzugefügte LLM- und Agent-Knoten verwenden die für den Chat ausgewählten Anmeldedaten und das Modell, einschließlich geteilter Anmeldedaten; bearbeitet Chat einen Workflow, behalten dessen bestehende LLM- und Agent-Knoten ihre Anmeldedaten und ihr Modell. Siehe [AI Assistant › Anmeldedaten](../reference/ai-assistant.md#credentials)
- **Datentabellen** – Speichert ein von Chat erstellter oder bearbeiteter Workflow Datensätze, fragt Chat, welche [Datentabelle](./datatable-tab.md) verwendet werden soll, oder bietet an, eine mit den benötigten Spalten zu erstellen. Er kann auch Ihre Tabellen und Spalten auflisten. Er liest oder schreibt niemals Zeilen. Siehe [AI Assistant › Datentabellen](../reference/ai-assistant.md#data-tables)
- **Streaming-Antworten** – Sehen Sie die Ausgabe des Modells, während sie gestreamt wird
- **Antwort stoppen** – Unterbrechen Sie die laufende Streaming-Antwort jederzeit; das Stoppen leert auch die eingereihten Nachrichten für diese Konversation
- **Markdown-Formatierung** – Antworten unterstützen Markdown-Formatierung inklusive Inline-Bildern
- **Bildanzeige** – In Antworten eingebettete Bilder (z. B. aus LLM-Bildgenerierung) erscheinen inline; klicken Sie auf ein Bild, um es im Vollbildmodus anzuzeigen. Drücken Sie **Esc** oder die Zurück-Taste (mobil), um die Vollbildansicht zu schließen
- **Nachrichten kopieren** – Kopieren Sie beliebige Nachrichten in die Zwischenablage
- **Chat leeren** – Starten Sie eine neue Konversation
- **Spracheingabe** – Nutzen Sie das Mikrofon-Symbol für Speech-to-Text (browserunterstützt). Nach Beenden der Aufnahme kann Heym das Transkript vor dem Senden bereinigen
- **Geplante Workflows** – Fragen Sie, wann Cron-Workflows ausgeführt werden (heute, diese Woche, diesen Monat oder in einem benutzerdefinierten Zeitraum). Der Assistent nutzt dieselben Zeitplandaten wie der Reiter [Zeitpläne](./scheduled-tab.md) und kann die Ergebnisse auf Ihre eigenen Workflows beschränken oder geteilte einschließen
- **Workflow-Ausführungsverlauf** – Fragen Sie nach einem bestimmten Workflow („Wie oft lief der Tagesbericht?“, „Gab es Fehler?“, „Wann lief er zuletzt?“). Chat schlägt den Workflow anhand seiner ID nach und antwortet basierend auf Ausführungsanzahl, Statusaufschlüsselung, Start- und Endzeit sowie durchschnittlicher Dauer. Fragen Sie, warum ein Lauf fehlschlug oder was er zurückgab, und Chat öffnet diesen Einzellauf, um Eingaben, Ausgaben und knotenspezifische Fehler auszulesen
- **Live-Ausführungsstatus** – Fragen Sie, was gerade läuft, und Chat antwortet mit der Anzahl, den Workflow-Namen, der bisherigen Laufzeit jedes Laufs, dem aktuellen Knoten und einem direkten Link zum Live-Lauf
- **Lauf-Kontext-Chips** – **KI fragen** im [Ausführungsverlauf](../reference/execution-history.md#ask-ai) öffnet eine neue Unterhaltung, an die der ausgewählte Workflow-Lauf als Chips angehängt ist. Siehe [Fragen zu einem Lauf](#fragen-zu-einem-lauf)

## Chat über einen MCP-Client nutzen

Das Chat-System kann auch außerhalb des Browsers aufgerufen werden. Aktivieren Sie das **Heym Chat Tool** im Reiter [MCP](./mcp-tab.md), und MCP-Clients – Claude, Cursor und alle anderen Werkzeuge mit MCP-Unterstützung – erhalten das Werkzeug `heym_chat`, das dieselbe Engine mit allen Funktionen ausführt.

Diese Konversationen landen im Verlauf dieses Reiters, markiert mit einem Stecker-Symbol in der Konversationsliste. Öffnen Sie eine, um zu lesen, was der Client gefragt hat, die ausgelösten Tool-Karten zu sehen und die Unterhaltung selbst fortzuführen. Das Beantworten von Klärungsfragen funktioniert genauso, unabhängig davon, ob die Konversation hier oder über einen MCP-Client gestartet wurde.

Über MCP fragt Chat als Rückfrage im Ergebnis, welche Anmeldedaten ein Workflow verwenden soll. Zum Erstellen oder Aktualisieren von Anmeldedaten öffnet er das Anmeldedaten-Formular auf einer Heym-Seite in Ihrem Browser, sodass die geheimen Werte niemals über den MCP-Client laufen. Siehe [Reiter MCP › Anmeldedaten](./mcp-tab.md#credentials).

Datentabellen funktionieren ebenfalls über MCP: Chat listet Ihre Tabellen auf, erstellt neue und bindet sie in die erstellten Workflows ein. Seine Tabellenfrage erscheint als Text im Ergebnis; antworten Sie darauf einfach mit derselben `conversation_id`.

## Kontext-Limit

Der Chat behält bis zu 25 aktuelle Nachrichten im Kontext. Ältere Nachrichten werden gekürzt, um innerhalb der Modellgrenzen zu bleiben.

## Workflows erstellen

Wenn Sie Chat bitten, einen Workflow zu erstellen, zu bauen, zu generieren oder einzurichten, speichert er einen neuen Workflow mit generiertem Namen und Beschreibung und testet ihn im selben Zug:

1. **Speichern:** Chat speichert den vollständigen Workflow. Die Antwort zeigt eine schreibgeschützte Canvas-Vorschau seiner Knoten und Verbindungen sowie einen Link **Workflow öffnen**, der den Editor in einem neuen Browser-Tab öffnet.
2. **Testen:** Chat führt den gespeicherten Workflow mit realistischen Beispieldaten aus und liest den Ausführungsbericht: den Status, die Knotenergebnisse und die Ausgaben.
3. **Korrigieren:** Wenn der Lauf fehlschlug oder das falsche Ergebnis lieferte, ändert Chat nur das, was der Bericht als fehlerhaft ausweist, speichert erneut und führt den Workflow nochmals aus.
4. **Abschließen:** Wenn der letzte Lauf des letzten Speicherstands erfolgreich ist, beendet Chat den Zug mit einem Satz darüber, was der Workflow nun tut.

Jeder Schritt erscheint als Zeile in der Unterhaltung: **Workflow speichern**, **Workflow testen · Versuch 1/5** und **Abschließen** mit dem Ergebnis **Verifiziert**.

- Testläufe sind echte Ausführungen. Ihre Nebenwirkungen treten auf, und sie erscheinen wie jeder andere Lauf im Ausführungsverlauf des Workflows.
- Ein Zug umfasst höchstens fünf Testläufe. Sind sie aufgebraucht, stoppt Chat und teilt Ihnen mit, was weiterhin fehlschlägt und was als Nächstes geändert werden sollte.
- Speichervorgänge nutzen den Mechanismus des Editors: Eine Änderung des Graphen behält den vorherigen Graphen in der Edit History des Workflows.
- Benötigt Chat etwas von Ihnen – etwa Anmeldedaten, eine Datentabelle oder eine Entscheidung –, fragt er nach und pausiert. Der Zug wird fortgesetzt, sobald Sie antworten.

Folge-Feedback im selben Chat ändert diesen Workflow, statt einen neuen zu erstellen. Sagen Sie beispielsweise nach der Erstellung „Füge einen Freigabeschritt hinzu“ oder „Ändere das Ausgabeformat“, speichert, testet und korrigiert Chat ihn erneut. Chat kann auch einen bestehenden Workflow ändern, den Sie beim Namen nennen, sofern Sie Bearbeitungsrechte besitzen.

Dies eignet sich am besten für Aufgaben, bei denen Sie das Ergebnis als wiederverwendbare Automatisierung wünschen, nicht nur als einmalige Antwort.

## Kanban-Aufgaben erstellen

Bitten Sie Chat in gewöhnlicher Sprache, beispielsweise: „Füge eine Aufgabe namens Login-Bug beheben hinzu“ oder „Erstelle eine neue Karte Dokumentation aktualisieren auf dem Launch-Board“. Sie können in derselben Anfrage eine Beschreibung mitgeben. Chat erstellt die Karte immer in der ersten Spalte des ausgewählten Boards.

Hat Ihr Arbeitsbereich mehrere Boards und Sie nennen keines, pausiert Chat mit einer Einzelauswahl. Wählen Sie ein Board, um die Erstellung der Karte abzuschließen. Es ist kein Slash-Befehl oder spezielles Nachrichtenformat erforderlich.

## Laufende Prozesse abfragen

Fragen Sie in gewöhnlicher Sprache – „Was läuft gerade?“, „Wie viele Workflows sind derzeit aktiv?“, „Bei welchem Knoten steht der nächtliche Bericht?“ – und Chat liefert das aktuelle Live-Bild:

- **Wie viele** Ausführungen im Gange sind, aufgeteilt in laufende und auf menschliche Prüfung wartende
- **Zu welchen Workflows** sie gehören, nach Name
- **Wie lange** jeder Lauf bereits läuft (z. B. `1m 35s`, `3h 25m`)
- **Welcher Knoten** gerade ausgeführt wird (nach Canvas-Beschriftung) sowie der zuletzt abgeschlossene Knoten
- **Ein Link** zu jedem Live-Lauf, der das Canvas mit der Wiedergabe dieser Ausführung öffnet

Läufe, die für eine [Human-in-the-Loop](../reference/human-in-the-loop.md)- oder Codex-Prüfung pausiert sind, werden als auf Sie wartend gemeldet, nicht als laufend. Dies entspricht exakt der Anzeige der aktiven Läufe in der Kopfzeile, sodass Chat und die Kennzeichnung immer übereinstimmen. Fragen Sie für bereits beendete Läufe stattdessen nach den letzten Ausführungen – dies liest den [Ausführungsverlauf](../reference/execution-history.md) aus.

## Fragen zu einem Lauf

Wählen Sie im [Ausführungsverlauf](../reference/execution-history.md#ask-ai) einen Workflow-Lauf aus, im Editor oder in All History, und klicken Sie neben dem Dialogtitel auf **KI fragen**. Chat öffnet eine neue Unterhaltung mit zwei Chips über dem Nachrichtenfeld:

- **Workflow:** der Name des Workflows
- **Ausführung:** die ersten Zeichen der ID des ausgewählten Laufs

Entfernen Sie einen Chip mit seinem **×**, um ihn wegzulassen. Stellen Sie danach Ihre Frage, zum Beispiel „Warum hat dieser Lauf so lange gedauert?“, „Was ist hier fehlgeschlagen?“ oder „Können Sie das beheben?“. Die verbleibenden Chips werden mit den vollständigen IDs an diese Nachricht angehängt, sodass Chat die Eingaben, Ausgaben und den Trace pro Knoten des Laufs direkt liest, statt nach dem Workflow zu suchen. Um den Workflow zu korrigieren, speichert Chat die Änderung, führt einen Testlauf durch und verifiziert sie wie in [Workflows erstellen](#workflows-erstellen) beschrieben.

Die gesendete Nachricht zeigt die Chips unter Ihrer Frage. Sie gehören nur zu dieser Nachricht; Folgefragen in derselben Unterhaltung behalten den Kontext aus dem Verlauf.

## Fragen zu Warnungen

Chat kann Fragen zu den von Ihnen definierten [Warnungen](./alerts-tab.md) beantworten:

- **Was vorhanden ist** – „Welche Warnungen habe ich?“, „Gibt es eine Warnung für den Rechnungs-Workflow?“, „Welche Warnungen schlagen gerade an?“
- **Wie eine Warnung eingerichtet ist** – „Wie hoch ist der Schwellenwert der Kostenwarnung?“, „Wie ist sie konfiguriert?“
- **Warum und wann sie ausgelöst wurde** – „Warum hat die Kostenwarnung ausgelöst?“, „Wann hat diese Warnung zuletzt ausgelöst?“

Bei einer Frage nach dem Grund liest Chat den Auslösungsdatensatz und nennt den tatsächlich beobachteten Wert, den Schwellenwert und das exakte Zeitfenster, das ausgewertet wurde, plus die beitragenden Details: fehlgeschlagene Ausführungs-IDs und Fehlermeldungen bei Fehlerwarnungen, Ausgaben pro Modell bei Kostenwarnungen oder die Aufschlüsselung nach Trigger-Quelle bei Ausführungsanzahl-Warnungen. Er berichtet, was beim Auslösen der Warnung galt, statt das Fenster neu zu berechnen, da das Fenster vergangen ist und eine Neuberechnung ein anderes Ergebnis liefern könnte.

## Benutzerregeln

In den Einstellungen konfigurierte [Benutzerregeln](../reference/user-settings.md) werden automatisch als Anweisungen auf Systemebene in jede Chat-Konversation eingebunden. Konfigurieren Sie diese einmalig, um dauerhafte Präferenzen für alle Chat-Anfragen anzuwenden.

## Verwandte Themen

- [Reiter MCP](./mcp-tab.md) – Diese Engine als `heym_chat`-Werkzeug für MCP-Clients bereitstellen
- [Einstellungen](../reference/user-settings.md) – Benutzerregeln für alle Chat-Anfragen festlegen
- [Reiter Anmeldedaten](./credentials-tab.md) – API-Keys hinzufügen und verwalten
- [Reiter Variablen](./global-variables-tab.md) – Globale Variablen, die Chat zur Verfügung stehen
- [Knotentypen](../reference/node-types.md) – LLM- und Agent-Knoten für Workflows
- [Agent-Knoten](../nodes/agent-node.md) – KI-Agent mit Werkzeugaufrufen
- [AI Assistant](../reference/ai-assistant.md) – Editor-Assistent auf Basis derselben Workflow-Builder-DSL
- [Ausführungsverlauf](../reference/execution-history.md) – Vergangene Ausführungen anzeigen (Verlauf-Schaltfläche in der Kopfzeile)
- [Reiter Zeitpläne](./scheduled-tab.md) – Kalender anstehender Cron-Läufe (dieselben Daten, die Chat zusammenfassen kann)
- [Reiter Warnungen](./alerts-tab.md) – Schwellenwert-Warnungen, die Chat auflisten und erklären kann
- [Kontextuelle Einbindung](../reference/contextual-showcase.md) – Kompakte In-App-Orientierung für diese Seite
- [Chat-Sprachausgabe (TTS & STT)](../reference/chat-voice.md) – Nachrichten laut vorlesen und freihändig mit ElevenLabs sprechen

## Tool-Aufrufe und Kontextgröße

Jedes Mal, wenn der Assistent ein Tool aufruft (Ausführen eines Workflows, Auflisten von Ausführungen, Erstellen eines neuen Workflows), erscheint eine einklappbare Karte in der Konversation. Die Karte klappt automatisch auf, während das Tool läuft, und zeigt die genauen Argumente. Wenn das Tool beendet ist, klappt die Karte zu einer einzeiligen Zusammenfassung mit der verstrichenen Zeit zusammen. Klicken Sie auf eine beliebige Karte, um die Argumente und die Antwortzusammenfassung erneut aufzuklappen.

Ein kleines Kreis-Badge unter der Eingabe zeigt die aktuelle Kontextnutzung als Prozentsatz des Modellfensters an (z. B. `12% · ~9.2k`). Fahren Sie mit der Maus über das Badge, um eine Aufschlüsselung zu sehen: System-Prompt, AGENTS.md, Workflows-Block, Benutzerregeln, Verlauf und Ihr Eingabeentwurf. Wenn die Auslastung 80 % überschreitet, wird der Kreis bernsteinfarben; bei 95 % wird er rot.

Wenn die Nutzung an die Grenze stößt, komprimiert Heym ältere Nachrichten automatisch zu einer kurzen Zusammenfassung mit demselben Mechanismus, den auch Agent-Knoten verwenden. Eine Karte „Kontext komprimiert“ erscheint inline, um zu zeigen, was geschehen ist.

## OpenCode-Go-Modelle

Mit benutzerdefinierten Anmeldedaten, die auf das OpenCode-Go-Gateway (`opencode.ai`) verweisen, rufen Chat, [Chat mit Heym](../reference/chat-with-heym.md), das `heym_chat`-MCP-Werkzeug und der [AI Assistant](../reference/ai-assistant.md) jedes Modell über die API auf, über die das Gateway es bereitstellt: GPT und Grok über Responses, Claude und MiniMax M2.7 über Anthropic Messages, Gemini über Googles `generateContent`, alles andere über Chat Completions. Modelle auf den ersten drei APIs antworten in einer vollständigen Antwort statt Wort für Wort im Streaming, und ältere Nachrichten werden für sie nicht automatisch komprimiert.
