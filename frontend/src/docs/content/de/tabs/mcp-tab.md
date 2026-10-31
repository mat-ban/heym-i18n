# Reiter MCP / A2A / A2A

Der Reiter **MCP** konfiguriert die Integration des Model Context Protocol (MCP), sowie als [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) Server, an die andere Agenten Tasks delegieren können. Über MCP können KI-Clients (Claude, ChatGPT, Gemini, Cursor und jedes MCP-kompatible Tool) Ihre Heym-Workflows als Tools aufrufen.

Heym unterstützt zwei Modi: einen **Standard-Server**, der alle MCP-aktivierten Workflows unter einem einzigen Endpoint bereitstellt, und **benannte Server**, die jeder logischen Gruppe von Workflows eine eigene dedizierte URL und einen eigenen API-Key zuweisen.

Beide Modi können zwei Arten von Tools bereitstellen: einzelne **Workflows** sowie das **Heym Chat Tool** — die gesamte Engine des [Reiters Chat](./chat-tab.md) hinter einem einzigen Tool namens `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCP-Demo ansehen</a></p>

## Standard-MCP-Server

Der Standard-Server ist jederzeit unter `{origin}/api/mcp/sse` erreichbar. Alle Workflows mit aktiviertem MCP-Schalter erscheinen hier als Tools.

### MCP-API-Key

- Schlüssel werden als SHA-256-Prüfsummen gespeichert, sodass Heym Ihnen keinen bestehenden Schlüssel anzeigen kann. Der Reiter meldet nur, ob ein Schlüssel gesetzt ist, nicht wie er lautet.
- **Generate** / **Regenerate** – Der neue Schlüssel wird einmalig direkt nach der Erstellung angezeigt. Kopieren Sie ihn sofort; beim Neuladen des Reiters wird er dauerhaft ausgeblendet.
- Verwenden Sie diesen Schlüssel, wenn Sie Claude Desktop, Cursor oder andere MCP-Clients mit Heym verbinden
- Schlüssel verloren? Generieren Sie ihn neu. Der bisherige Schlüssel verliert sofort seine Gültigkeit.

### Verbindungsmethoden

- **API Key** – Verwenden Sie den MCP-API-Key für programmatische Verbindungen. Über den Reiter lässt sich eine gebrauchsfertige JSON-Konfiguration kopieren; zudem gibt es eine Schaltfläche **Add to Cursor** für die Ein-Klick-Einrichtung in Cursor.
- **Claude** – Der Reiter zeigt die MCP-Server-URL und die Einrichtungsschritte für Claude. Lassen Sie OAuth Client ID und Secret leer; Claude registriert sich automatisch und authentifiziert sich über Heym OAuth.
- **ChatGPT** – Der Reiter zeigt die MCP-Server-URL und die Einrichtungsschritte für eine ChatGPT-App. Aktivieren Sie den Entwicklermodus, erstellen Sie eine App mit der URL und wählen Sie OAuth; ChatGPT registriert sich automatisch.
- **Gemini** – Der Reiter zeigt die MCP-Server-URL und die Einrichtungsschritte für eine benutzerdefinierte Gemini-App: Öffnen Sie in gemini.google.com **Settings → Connected Apps → Add a custom app**, fügen Sie die URL ein und lassen Sie **Advanced features** geschlossen; Gemini registriert sich automatisch und authentifiziert sich über Heym OAuth. Nach der Verbindung funktioniert Heym auch in der mobilen Gemini-App.

### Workflow-MCP-Schalter

Jeder Workflow kann als MCP-Tool bereitgestellt werden:

- **Enable** – Die Tools des Workflows stehen allen mit dem Standard-Server verbundenen Clients zur Verfügung
- **Disable** – Der Workflow wird nicht bereitgestellt

Workflow-Karten zeigen die Beschreibung und eine Vorschau der Eingabefeldnamen, damit Sie vor der Aktivierung sehen, welche Parameter jedes Tool erwartet.


### Warteschlangen-Ausführungen und heym_execution_status

Ein Workflow mit einem [Parallelitätslimit](../reference/webhooks.md#concurrency-limit-and-queued-runs) kann ausgelastet sein, wenn ein Client ihn aufruft. Der Aufruf kehrt dann sofort mit einem Ergebnis zurück, das kein Fehler ist:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Der Client fragt das Tool `heym_execution_status` mit dieser `execution_id` ab. Es gibt denselben Body wie die [Status-URL](../reference/webhooks.md#status-url) zurück: `queued` mit der aktuellen Position, `running`, dann `success` oder `error` mit den Ausgaben. Es findet nur Ausführungen von Workflows, die derselbe Server bereitstellt. Das Tool wird auf dem Standard-Server und auf jedem benannten Server nur aufgeführt, solange mindestens einer seiner Workflows ein Parallelitätslimit hat. Wenn die Warteschlange des Workflows voll ist, gibt der Aufruf den Fehler „Concurrency queue is full“ zurück.
## Heym Agent

Der Abschnitt **Heym Capabilities** verwandelt die Engine des Reiters Chat in ein einziges MCP-Tool namens `heym_chat`. Aktivieren Sie es auf dem Standard-Server, auf einem beliebigen benannten Server oder auf beiden — jede Oberfläche verwaltet ihren eigenen Schalter und ihre eigene Modellauswahl.

Wenn es aktiviert ist, erscheint `heym_chat` in `tools/list` neben Ihren Workflow-Tools. Ein MCP-Client sendet eine einzelne natürlichsprachige Nachricht, und die Heym-Engine übernimmt ab dort mit denselben Fähigkeiten wie im Reiter Chat:

- Einen Workflow erstellen, mit Beispieleingaben testen, Fehler beheben und abschließen, sobald ein Lauf erfolgreich ist (siehe [Build-Modus](#build-mode))
- Bestehende Workflows inspizieren und ausführen
- Analysen, letzte Ausführungen und anstehende Cron-Zeitpläne abrufen
- Erklären, wo Workflows fehlschlagen und warum sie langsam sind: die Workflows, die am häufigsten liefen, am häufigsten fehlschlugen und am langsamsten sind, sowie die Knotentypen mit der meisten Zeit, Fehlern und Aufrufen über die letzten 1, 3 oder 6 Stunden, 24 Stunden, 7 oder 30 Tage oder die gesamte Zeit
- Den Ausführungsverlauf eines Workflows abrufen: wie oft er lief, Statuszahlen, Zeitpunkte sowie auf Anfrage die Eingaben, Ausgaben und Fehler pro Knoten eines einzelnen Laufs
- Abrufen, was gerade ausgeführt wird: wie viele Ausführungen aktiv sind, ihre Workflow-Namen, wie lange jede bereits läuft, bei welchem Knoten sie sich aktuell befindet, sowie einen Link zum Live-Lauf
- Boards auflisten, Karten erstellen und Kartendetails im [Reiter Board](./board-tab.md) lesen
- Auflisten Ihrer Dashboards (Seiten von Heym Work) samt Widgets, Ermitteln, auf welchem Dashboard sich ein Workflow befindet, Hinzufügen eines neuen Widgets zu einem Dashboard und Erstellen seines Workflows, Ablegen eines bestehenden Workflows als Widget auf einem Dashboard, Umbenennen oder Löschen von Widgets oder Aufräumen des Dashboard-Layouts (siehe [Dashboard › Aus Chat und MCP](./dashboard-tab.md#aus-chat-und-mcp))
- Datentabellen und Zeilen inspizieren, Tabellen erstellen, Spalten hinzufügen oder entfernen, Zeilen einfügen, aktualisieren oder löschen und Tabellen in Workflows einbinden
- Erstellen, Bearbeiten und Ausführen von Prompt- und Agent-[Eval-Suiten](./evals-tab.md#aus-chat-und-mcp), einschließlich der Baseline eines Agenten: berichtet, aus Läufen erstellt oder als Zahlen angegeben. Das Ergebnis führt den Evals-Link jeder im Aufruf gespeicherten Suite auf.
- Erstellen oder aktualisieren Sie Ihre Anmeldedaten auf Heyms eigener Seite (siehe [Anmeldedaten](#anmeldedaten))
- Teams und globale Variablen lesen sowie die Dokumentation durchsuchen
- Ausstehende Human-in-the-Loop-Prüfungen genehmigen, bearbeiten oder ablehnen

Fähigkeiten, die später zum Reiter Chat hinzugefügt werden, stehen automatisch über `heym_chat` zur Verfügung — es gibt keinen separaten Schalter pro Fähigkeit, der synchron gehalten werden müsste.

Diese Fähigkeiten laufen innerhalb von `heym_chat`: `tools/list` zeigt `heym_chat` und Ihre Workflow-Tools, niemals die internen Tools des Chats wie jene der Eval-Suiten.

### Build-Modus

`heym_chat` führt die Chat-Engine immer im Build-Modus aus. In einem einzigen Aufruf kann der Assistent einen neuen Workflow speichern, ihn mit realistischen Beispieleingaben ausführen, den Ausführungsbericht lesen, Fehler beheben und ihn erneut starten — mit bis zu fünf Testläufen pro Aufruf. Wenn der letzte Lauf der letzten Speicherung erfolgreich ist, schließt er mit einer einzeiligen Zusammenfassung ab, und die Antwort endet mit `Verified: the latest test run of the saved workflow passed.`

Erstellt oder bearbeitet ein Aufruf einen Workflow, listet die Antwort jeden einzelnen mit seinem vollständigen Editor-Link auf, wie z. B. `https://heym.example.com/workflows/<id>`, und die Links in der Antwort des Assistenten sind ebenfalls vollständige Links. Sie verwenden Ihre konfigurierte Heym-Adresse (`FRONTEND_URL`) und lassen sich von Personen öffnen, die bei Heym angemeldet sind und Zugriff auf diesen Workflow haben.

- Testläufe sind echte Ausführungen. Ihre Seiteneffekte treten tatsächlich ein, und sie erscheinen wie jeder andere Lauf im Ausführungsverlauf des Workflows.
- Speicherungen folgen dem Pfad des Editors: Eine Änderung am Graphen bewahrt den vorherigen Graphen im Bearbeitungsverlauf (*Edit History*) des Workflows.
- Um einen zuvor erstellten Workflow zu ändern, setzen Sie den Thread mit derselben `conversation_id` fort. Der Assistent aktualisiert diesen Workflow, anstatt einen neuen anzulegen, und ändert nur Workflows, die Sie bearbeiten dürfen.
- Sind die fünf Testläufe ausgeschöpft, stoppt der Assistent und erläutert, was weiterhin fehlschlägt.

`heym_chat` kann Ihre Tabellen und Zeilen inspizieren, Tabellen erstellen, Spalten hinzufügen oder entfernen sowie Zeilen einfügen, aktualisieren oder löschen. Nennen Sie ihm einen Tabellennamen, eine UUID oder einen DataTable-Link, zum Beispiel: „Füge zwei String-Spalten, Vorname und Nachname, zu https://heym.example/?tab=datatable/<table-id> hinzu.“ Er ändert die Tabelle direkt und behält beim Hinzufügen von Spalten bestehende Spalten und Werte bei.

`heym_chat` kann Ihre Tabellen und Zeilen inspizieren, Tabellen erstellen, Spalten hinzufügen oder entfernen sowie Zeilen einfügen, aktualisieren oder löschen. Nennen Sie ihm einen Tabellennamen, eine UUID oder einen DataTable-Link, zum Beispiel: „Füge zwei String-Spalten, Vorname und Nachname, zu https://heym.example/?tab=datatable/<table-id> hinzu.“ Er ändert die Tabelle direkt und behält beim Hinzufügen von Spalten bestehende Spalten und Werte bei.

Schreibzugriffe erfordern Eigentümerschaft oder **Schreibberechtigung** über eine direkte oder Team-Freigabe. Nur-Lese-Zugriff erlaubt die Inspektion. Zeilenschreibvorgänge nutzen die Typ-, Standardwert-, Pflichtfeld- und Eindeutigkeitsprüfungen des Reiters DataTable; Teilimporte melden abgewiesene Zeilen. Das Entfernen von Spalten löscht deren Werte aus jeder Zeile. Wie im Reiter DataTable erfordern das Entfernen von Spalten und das Leeren aller Zeilen zunächst eine Bestätigung; antworten Sie mit derselben `conversation_id`, um zu bestätigen. Das Löschen einer ausgewählten Zeile erfordert keine gesonderte Bestätigung.


### Anmeldedaten

`heym_chat` sieht Ihre eigenen und die mit Ihnen geteilten Anmeldedaten nach Name und Typ, genau wie der Reiter Chat. Wenn ein erstellter Workflow Anmeldedaten benötigt, fragt er als Rückfrage im Ergebnis, welche verwendet werden sollen. Antworten Sie mit derselben `conversation_id`.

Um Anmeldedaten hinzuzufügen oder eigene zu aktualisieren, öffnet der Assistent Heyms Anmeldedaten-Formular auf einer Heym-Seite, `/credentials/setup/<id>`. Sie melden sich dort bei Heym an, geben den Schlüssel ein oder verknüpfen das Konto und speichern. Der Wert geht direkt an Heym: Der MCP-Client und sein Modell erfahren nur Name und Typ der Anmeldedaten. Fügen Sie niemals Schlüssel in den MCP-Client ein; fragen Sie stattdessen nach dem Formular.

| Client | Verhalten |
|--------|-----------|
| Unterstützt MCP-URL-Elicitation | Der Client fordert Sie auf, die Heym-Seite zu öffnen. Der Aufruf wartet, während Sie das Formular ausfüllen (bis zu zehn Minuten), und fährt dann mit den neuen Anmeldedaten fort. |
| Alle anderen | Das Ergebnis enthält den Link und bittet den Client, `heym_chat` erneut mit `wait_for_credential_form` aufzurufen. Dieser Aufruf wartet bis zu fünf Minuten, während Sie das Formular ausfüllen, und setzt dann die Konversation fort. Wenn der Client nicht wartet, speichern Sie das Formular und antworten Sie mit derselben `conversation_id`; der nächste Aufruf erkennt, dass das Formular gespeichert wurde und welche Anmeldedaten erstellt wurden. |

Die Seite öffnet sich nur für das Heym-Konto, das die Anfrage gestartet hat, sodass ein weitergeleiteter Link für andere unbrauchbar ist. Ein Formular bleibt 24 Stunden lang geöffnet und kann auf der Seite abgelehnt werden. Sobald Sie es speichern oder ablehnen, zeigt der Schritt in der Konversation des Reiters Chat das Ergebnis.


### Anmeldedaten und Modell

`heym_chat` führt die Engine unter Ihrem Heym-Konto aus und benötigt daher eigene LLM-Anmeldedaten:

| Feld | Verhalten |
|-------|----------|
| **Credential** | Wählen Sie beliebige OpenAI-, Google- oder Custom-Anmeldedaten, auf die Sie Zugriff haben. Vorausgefüllt mit den bevorzugten Anmeldedaten aus den [Einstellungen](../reference/user-settings.md), sofern Sie noch keine Auswahl getroffen haben. |
| **Model** | Wird aus den gewählten Anmeldedaten geladen. Vorausgefüllt mit Ihrem bevorzugten Modell, wenn die Anmeldedaten übereinstimmen. |

Fehlt eine der beiden Angaben, erscheint das Tool zwar weiterhin in `tools/list`, jeder Aufruf gibt jedoch einen Fehler zurück, der Sie auffordert, die Einrichtung in diesem Reiter abzuschließen.


LLM- und Agent-Knoten in einem von `heym_chat` erstellten Workflow werden mit diesen Anmeldedaten und diesem Modell ausgeführt, einschließlich Anmeldedaten, die jemand mit Ihnen geteilt hat, sodass Testläufe ohne weiteren Einrichtungsschritt funktionieren. Bearbeitet `heym_chat` einen Workflow, behalten LLM- und Agent-Knoten, die bereits Anmeldedaten besitzen, diese zusammen mit ihrem Modell bei.
### Argumente und Verlauf

| Argument | Erforderlich | Beschreibung |
|----------|----------|-------------|
| `message` | Ja | Die Anweisung oder Frage in natürlicher Sprache. |
| `conversation_id` | Nein | Eine `conversation_id` aus einem vorherigen `heym_chat`-Ergebnis, um diesen Thread fortzusetzen. |
| `wait_for_credential_form` | Nein | Mit `conversation_id`: Warten, bis der Benutzer das vom Thread geöffnete Anmeldedaten-Formular speichert oder ablehnt, dann `message` senden. |

Jeder Aufruf wird als normale Unterhaltung in den Verlauf Ihres [Reiters Chat](./chat-tab.md) geschrieben und in der Konversationsliste mit einem Stecker-Symbol gekennzeichnet. Nachrichten, Tool-Karten und Rückfragepausen sehen genauso aus wie in einer selbst gestarteten Unterhaltung, und Sie können den Thread im Browser öffnen und dort weiterschreiben. Jedes Ergebnis gibt seine `conversation_id` zurück, sodass der MCP-Client denselben Thread fortsetzen kann, anstatt bei jedem Aufruf einen neuen zu öffnen.

Wenn der Assistent eine Rückfrage hat, pausiert er und teilt dies mit; antworten Sie mit den gewünschten Angaben unter Verwendung derselben `conversation_id`.

### A2A aktivieren

Solange der Heym Agent aktiv ist, zeigt die Karte ein Kontrollkästchen **A2A aktivieren**. Aktivieren Sie es, und andere Agenten können dem Heym Agent Tasks über das Agent2Agent-Protokoll (A2A 1.0) senden. Die Karte führt dann die URL der **Agent Card** und den **JSON-RPC-Endpoint** auf, jeweils mit einer Kopierschaltfläche, sowie ein `curl`, das die Card abruft. A2A nutzt denselben Key und OAuth-Login wie MCP. Das Deaktivieren des Agenten deaktiviert auch A2A. Siehe [A2A](../reference/a2a.md) für Methoden, Task-Status und ein Beispiel.

### Fortschritt

Ein langer `heym_chat`-Aufruf meldet die Aktionen des Agenten als MCP-Fortschritt (`notifications/progress`) in denselben Worten wie im Reiter Chat, zum Beispiel `Workflow wird getestet · Versuch 2/5`. Clients, die ihren Timeout bei Fortschritt zurücksetzen, warten weiter, während der Agent arbeitet.

## Benannte MCP-Server

Mit benannten Servern können Sie Workflows in isolierte MCP-Endpoints unterteilen. Jeder Server besitzt eine eigene URL und einen eigenen API-Key, sodass sich verschiedene KI-Clients, Teams oder Anwendungsfälle gezielt nur mit den Workflows verbinden können, die sie benötigen.

### Einen benannten Server erstellen

1. Geben Sie unten im Reiter MCP einen Namen in das Eingabefeld ein (z. B. **CRM Tools**)
2. Klicken Sie auf **Create** — eine neue Server-Karte erscheint sofort
3. Klicken Sie auf die Karte, um sie aufzuklappen

### Einstellungen pro Server

Jede Server-Karte zeigt:

| Einstellung | Beschreibung |
|---------|-------------|
| **SSE Endpoint** | Eindeutige URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Unabhängiger Schlüssel, der beim Generieren oder Neugenerieren einmalig angezeigt wird. Kopieren Sie ihn sofort; er wird gehasht gespeichert und kann später nicht erneut eingeblendet werden |
| **How to connect** | **Copy JSON** kopiert die einfügefertige MCP-Konfiguration; **Add to Cursor** installiert sie mit einem Klick |
| **Heym Capabilities** | Schaltet den Heym Agent (`heym_chat`) für diesen Server ein oder aus und wählt dessen Anmeldedaten und Modell |
| **A2A aktivieren** | Eigener A2A-Schalter dieses Servers mit eigener Agent Card unter `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **A2A aktivieren** | Eigener A2A-Schalter dieses Servers mit eigener Agent Card unter `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Assigned Workflows** | Legt fest, welche Ihrer Workflows dieser Server bereitstellt |

### Workflow-Zuweisung

Die Workflow-Zuweisung erfolgt pro Server und ist unabhängig vom Schalter des Standard-Servers. Ein Workflow kann gleichzeitig auf dem Standard-Server und auf mehreren benannten Servern aktiviert sein — oder auf keinem.

Beim Umschalten eines Workflows wandert dieser an den Anfang der Zuweisungsliste, sodass die gerade geänderte Zeile sichtbar bleibt, anstatt aus dem Sichtbereich zu scrollen.

### Authentifizierung

Benannte Server unterstützen dieselben Authentifizierungsmethoden wie der Standard-Server:

- **Header X-MCP-Key** – Übergeben Sie den API-Key des Servers direkt (API-Clients, Cursor). Nur als Header: Schlüssel werden nicht als Query-Parameter `?key=` akzeptiert, da URLs in Zugriffsprotokollen, Proxy-Logs und im Browserverlauf landen.
- **Claude, ChatGPT und Gemini OAuth** – Fügen Sie die Server-URL zu den Connectors oder benutzerdefinierten Apps des Clients hinzu; lassen Sie die Anmeldedaten leer, und der Client registriert sich automatisch per OAuth. Das Bearer-Token muss im Header `Authorization` übertragen werden, nicht als `?token=`.
- **Session-Token** – Wird während des SSE-Handshakes ausgestellt und ist auf den jeweiligen Server beschränkt, sodass Tokens eines benannten Servers nicht auf einen anderen zugreifen können. Dieser kurzlebige Parameter `?session=` bleibt davon unberührt.

### Einen benannten Server löschen

Klicken Sie auf das **X**-Symbol in der Kopfzeile einer Server-Karte. Durch das Löschen werden der Server und alle seine Workflow-Zuweisungen entfernt; die Workflows selbst bleiben unverändert erhalten.

## SSE-Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Beide Endpoints unterstützen den SSE-Transport (GET, MCP-Spezifikation 2024-11-05) sowie den Streamable-HTTP-Transport (POST, MCP-Spezifikation 2025-03-26). Claude, ChatGPT und Gemini nutzen auf beiden OAuth 2.1 / PKCE für eine sichere Anmeldung.

## Verwandte Themen

- [Warum Heym](../getting-started/why-heym.md) – MCP als erstklassiges Grundelement in Heym
- [Agent-Knoten](../nodes/agent-node.md) – Agent-Knoten mit MCP-Tool-Unterstützung
- [Agenten-Architektur](../reference/agent-architecture.md) – MCP-Client, Tool-Dispatch, Orchestrator
- [Trigger](../reference/triggers.md) – MCP als Workflow-Einstiegspunkt
- [Reiter Chat](./chat-tab.md) – Die Engine hinter dem Tool `heym_chat`
- [Reiter Workflows](./workflows-tab.md) – Workflows erstellen und verwalten
- [Knotentypen](../reference/node-types.md) – Übersicht der KI-Knoten
- [Kontextuelle Übersicht](../reference/contextual-showcase.md) – Kompakter Seitenleitfaden für Dashboard-Oberflächen