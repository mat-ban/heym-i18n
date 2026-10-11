# Reiter Chat

Der Reiter **Chat** bietet eine vollwertige Konversationsoberfläche mit Ihren konfigurierten Sprachmodellen. Nutzen Sie ihn zum Testen von Prompts, zur Recherche, zum Starten bestehender Workflows oder zum automatischen Generieren neuer Workflows aus natürlicher Sprache.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Video-Demo zum Chat ansehen</a></p>

## Einrichtung & Start

1. Wählen Sie Ihre [Anmeldedaten](./credentials-tab.md) (OpenAI, Google, DeepSeek etc.)
2. Wählen Sie das gewünschte Modell aus dem Dropdown-Menü
3. Geben Sie Ihre Nachricht ein oder nutzen Sie die Spracheingabe

Sie können Konversationen auch direkt aus dem Chat-Feld des Reiters [Workflows](./workflows-tab.md) starten.

## Funktionen

- **Echtzeit-Streaming** – Antworten werden Wort für Wort live übertragen
- **Workflow-Erstellung** – Bitten Sie den Chat, einen Workflow zu erstellen. Heym generiert den Graphen, zeigt eine Vorschau und speichert ihn in Ihrem Account
- **Kanban-Aufgaben erstellen** – Bitten Sie den Chat, ein Ticket oder eine Karte zu erstellen. Chat platziert sie automatisch in der ersten Spalte des gewählten Boards
- **Nachrichten-Warteschlange (Queued Follow-ups)** – Senden Sie weitere Anweisungen, während die vorherige Antwort noch generiert wird; sie werden nacheinander abgearbeitet
- **Laufende Prozesse abfragen** – Fragen Sie: *„Welche Workflows laufen gerade?“* und der Chat liefert Status, Laufzeit und Links zu den Live-Ausführungen
- **Warnungen abfragen** – Fragen Sie: *„Warum hat der Alarm ausgelöst?“* und der Chat analysiert Schwellenwert und Ausführungsdaten
- **Dateianhänge & Vision** – Laden Sie Bilder, PDFs oder Textdateien hoch; multimodale Modelle analysieren diese direkt im Kontext
- **Spracheingabe** – Integrierte Speech-to-Text-Funktion für freihändige Bedienung

## Chat über MCP-Clients nutzen

Das Chat-System kann auch außerhalb des Browsers aufgerufen werden. Aktivieren Sie das **Heym Chat Tool** im Reiter [MCP](./mcp-tab.md), um Claude Desktop, Cursor oder beliebigen MCP-Clients das Werkzeug `heym_chat` bereitzustellen. Alle Anfragen fließen nahtlos in den Konversationsverlauf dieses Reiters ein.

## Verwandte Themen

- [Reiter Workflows](./workflows-tab.md) – Schnellstart per Chat
- [Reiter MCP](./mcp-tab.md) – Externe MCP-Clients anbinden
- [Reiter Board](./board-tab.md) – Aufgaben aus dem Chat verwalten\n