# Funktionsübersicht

Ein umfassender Überblick über alle Heym-Funktionen. Jeder Abschnitt beschreibt eine Funktion oder ein Konzept in wenigen Sätzen.

---

## Erste Schritte

### [Einführung](../getting-started/introduction.md)

Heym ist Infrastruktur zum Ausführen und Steuern von AI-Agenten in der Produktion. Du baust agentische Systeme auf einem visuellen Canvas und führst sie mit Zuversicht aus: Agenten orchestrieren, Geschäftsprozesse automatisieren, jede Ausführung inspizieren und Menschen auf deiner eigenen Infrastruktur die Kontrolle behalten. Es unterstützt visuelle Workflows, KI-gestützte Knoten ([LLM](../nodes/llm-node.md), [Agent-Knoten](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), einen [KI-Assistent](./ai-assistant.md), Integrationen ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), eingehende [IMAP Trigger](../nodes/imap-trigger-node.md)-E-Mail, ausgehende [Send Email](../nodes/send-email-node.md)), Zeitplanung mit [Cron](../nodes/cron-node.md) und [Portal](./portal.md)-Chat-Portale für Endbenutzer.

Siehe auch [Kernkonzepte](../getting-started/core-concepts.md), [Knotentypen](./node-types.md) und [Drittanbieter-Integrationen](./integrations.md).

### [Warum Heym](../getting-started/why-heym.md)

Warum Heym durchläuft den Agenten-Lebenszyklus (build, orchestrate, run, observe, evaluate, control, expose) und zeigt, was eine selbst gehostete Runtime in jeder Phase bewältigt. Das umfasst den [LLM](../nodes/llm-node.md)-Knoten und den [Agent-Knoten](../nodes/agent-node.md) mit Tool Calling, Python-Tools, [MCP](../tabs/mcp-tab.md)-Verbindungen, Skills und Multi-Agenten-Orchestrierung; Trigger, Retries und [Lastverteilung](./cluster.md); [Traces](../tabs/traces-tab.md) mit USD-Kosten pro Ausführung und OpenTelemetry-Export; [Evals](../tabs/evals-tab.md); [Human-Review-Checkpoints](./human-in-the-loop.md), Guardrails, SSO und einen Audit-Trail; sowie REST-, MCP- und Portal-Endpoints. Ein Funktionsvergleich mit n8n, Zapier und Make.com schließt die Seite ab.

Siehe auch [Agent-Knoten](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) und [Agenten-Architektur](./agent-architecture.md).

### [Schnellstart](../getting-started/quick-start.md)

Bringe deinen ersten Workflow in Minuten zum Laufen: Erstelle einen Workflow über den Reiter [Workflows](../tabs/workflows-tab.md), füge einen [Input](../nodes/input-node.md)-Knoten, einen [LLM](../nodes/llm-node.md)-Knoten und einen [Output](../nodes/output-node.md)-Knoten hinzu und verbinde sie. Konfiguriere den [LLM](../nodes/llm-node.md) mit einer Anmeldedaten und setze `userMessage` auf `$input.text`; verwende Run oder den [KI-Assistent](./ai-assistant.md), um Workflows mit natürlicher Sprache auszuführen oder zu generieren.

Passt natürlich zu [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) und [Ausdrucks-DSL](./expression-dsl.md).

### [Kernkonzepte](../getting-started/core-concepts.md)

Workflows sind gerichtete Graphen aus Knoten, die durch Kanten verbunden sind; die Ausführung fließt von Trigger-Knoten ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) über Verarbeitungsknoten zu [Output](../nodes/output-node.md)-Knoten. Jeder Knoten hat einen Typ, Daten (Konfiguration) und Ein-/Ausgaben; Kanten definieren den Datenfluss. Knoten referenzieren vorgelagerte Daten über [Ausdrucks-DSL](./expression-dsl.md)-Ausdrücke wie `$nodeLabel.field`; unabhängige Knoten laufen automatisch [parallel](./parallel-execution.md).

Siehe auch [Triggers](./triggers.md), [Parallele Ausführung](./parallel-execution.md) und [Workflow-Struktur](./workflow-structure.md).

### [Ausführung & Deployment](../getting-started/running-and-deployment.md)

Heym bietet `run.sh` für die lokale Entwicklung (Datenbank in Docker, FastAPI-Backend, Vite-Frontend) und `deploy.sh` für die Produktion mit Docker Compose. Beide verwenden eine `.env`-Datei; zu den wichtigsten Variablen gehören `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` und `ALLOW_REGISTER`. Die Entwicklung läuft auf konfigurierbaren Frontend- und Backend-Ports; die Produktion stellt die API unter `/api` über den Frontend-Container bereit.

Siehe auch [Security](./security.md), [Enterprise](./enterprise.md) und [Settings](./user-settings.md).

### [Zu Heym migrieren](../getting-started/migrate-to-heym.md)

Das AI Convert-Tool verwandelt einen Workflow von einer anderen Plattform (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) oder eine Beschreibung in einfachem Englisch in einen Heym-Workflow, der live auf einen Canvas gestreamt und bereit zum [Herunterladen und Importieren](./download-import.md) ist. Es führt eine KI-Sicherheitsprüfung durch und generiert dann die DSL mit Eingabe- und Ratenbegrenzungen. Öffne es unter [heym.run/convert](https://heym.run/convert).

Siehe auch [Schnellstart](../getting-started/quick-start.md), [Download & Import](./download-import.md) und [KI-Assistent](./ai-assistant.md).

---

## Knoten

### Trigger

#### [Input](../nodes/input-node.md)

Der Input-Knoten ist der Einstiegspunkt für Workflows, die Daten vom Benutzer oder API-Aufrufer empfangen. Er unterstützt einzelne oder mehrere Eingabefelder und stellt Request-Metadaten (Header, Query-Parameter) bereit. Greife auf Body-Felder über `$nodeLabel.body.fieldKey` zu, auf Header über `$nodeLabel.headers` und auf Query über `$nodeLabel.query`.

Passt natürlich zu [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) und [Output](../nodes/output-node.md). Für Payload-Referenzen und Feldzugriff siehe [Ausdrucks-DSL](./expression-dsl.md) und [Webhooks](./webhooks.md).
#### [Cron](../nodes/cron-node.md)

Der Cron-Knoten triggert einen Workflow nach Zeitplan mithilfe eines standardmäßigen Cron-Ausdrucks mit fünf Feldern. Es ist keine Benutzereingabe erforderlich—der Workflow läuft automatisch zu den angegebenen Zeiten (z. B. stündlich, täglich, alle 15 Minuten). Die Ausgabe ist ein Trigger-Ereignis ohne Payload.

Siehe auch [Trigger](./triggers.md), [Wait](../nodes/wait-node.md) und [Verlauf](./execution-history.md) für geplante und verzögerte Ausführungen.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Der IMAP Trigger-Knoten fragt ein Postfach in einem konfigurierbaren Minutenintervall ab und startet einen Workflow für jede neu erkannte E-Mail. Er gibt geparste Header, Absender- und Empfängerlisten, Klartext- und HTML-Inhalte, Anhangsmetadaten und einen Trigger-Zeitstempel aus. Verwende ihn für die Triage von Support-Postfächern, Mailbox-zu-[Slack](../nodes/slack-node.md)-Routing oder E-Mail-gesteuerte Genehmigungsabläufe mit [Human-in-the-Loop](./human-in-the-loop.md).

Kombiniert mit [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) und [Slack](../nodes/slack-node.md) für eingehende Triage- und Antwort-Workflows.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Der Heym Trigger-Knoten startet einen Workflow, wenn Heym selbst ein Plattform-Ereignis veröffentlicht: `heym.started`, `workflow.created`, `workflow.updated` oder `workflow.deleted`. Die Zustellung erfolgt gebündelt - jedes Ereignis, das innerhalb eines fünfsekündigen Dispatch-Fensters veröffentlicht wird, trifft in einem einzigen Lauf als `$nodeLabel.events` ein, immer als Array. Jedes Ereignis wird über eine eindeutige Datenbank-Constraint beansprucht, sodass es genau einmal pro abonnierendem Knoten ausgelöst wird, unabhängig davon, wie viele Worker, Container oder Maschinen laufen. Verwende es für Audit-Trails zu Workflow-Änderungen, Deploy-Ankündigungen und Instance-Health-Digests.

Kombiniert mit dem [Heym](../nodes/heym-node.md)-Knoten, um den geänderten Workflow nachzuschlagen, und mit [Loop](../nodes/loop-node.md), um einmal pro Ereignis zu handeln.

#### [Heym](../nodes/heym-node.md)

Der Heym-Knoten liest Heyms eigene Daten über drei Operationen: `listWorkflows` gibt jeden Workflow zurück, den der Eigentümer erreichen kann, mit Knotenanzahlen und Zeitstempeln, `getWorkflow` gibt die Knoten- und Kantenstruktur eines Workflows zurück, und `getExecutionHistory` gibt Einträge des Ausführungsverlaufs neueste zuerst zurück, mit optionalen Status-, Zeitfenster- und Limit-Filtern, zusammen mit nach Status gruppierten Summen. Die Ergebnisse sind auf den Eigentümer des Workflows beschränkt, in dem der Knoten lebt, sodass ein Lauf, der durch Cron, ein Portal oder ein Ereignis gestartet wurde, dieselben Daten zurückgibt wie ein manueller Lauf. `getWorkflow` gibt die vollständige Knotenkonfiguration zurück, was das Auditieren eines Workflows auf hartcodierte Schlüssel oder Token ermöglicht; es legt nichts offen, was der Workflow-Eigentümer nicht bereits im Editor öffnen könnte. Es ist keine Anmeldedaten erforderlich.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Der WebSocket Trigger-Knoten öffnet eine ausgehende Client-Verbindung zu einem externen WebSocket-Server und startet den Workflow bei `onMessage`, `onConnected` oder `onClosed`. Er stellt geparste Nachrichten-Payloads, Reconnect-Status, Close-Metadaten und die Socket-URL für nachgelagerte Ausdrücke bereit.

Kombiniert mit [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) und [SSE Streaming](./sse-streaming.md) für Echtzeit-Integrationen.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Der Telegram Trigger-Knoten empfängt Bot-Webhook-Updates und startet den Workflow sofort. Er stellt die vollständige Update-Payload, das primäre Nachrichtenobjekt, Callback-Queries, bereinigte Header und einen Trigger-Zeitstempel bereit. Verwende ihn für Chatbots, KI-Assistenten in [Telegram](../nodes/telegram-node.md) und button-gesteuerte Abläufe.

Kombiniert mit [Telegram](../nodes/telegram-node.md), [Agent-Knoten](../nodes/agent-node.md) und [Webhooks](./webhooks.md) für bot-gesteuerte Workflows.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Der Slack Trigger-Knoten empfängt Slack Events API-Webhooks und startet einen Workflow automatisch, nachdem die Request-Signatur verifiziert wurde. Er stellt die Ereignis-Payload und bereinigte Header für nachgelagertes Routing, [LLM](../nodes/llm-node.md)-basierte Klassifizierung und Antwort-Abläufe bereit.

Kombiniert mit [Slack](../nodes/slack-node.md), [Agent-Knoten](../nodes/agent-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Der Discord Trigger-Knoten empfängt Discord Interactions API-Webhooks, verifiziert Ed25519-Signaturen mit der ausgewählten `discord_trigger`-Anmeldedaten und startet den Workflow. Er stellt die vollständige Interaction-Payload, Command-Daten, bereinigte Header und Trigger-Metadaten für nachgelagertes Routing oder Antworten bereit.

Kombiniert mit [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent-Knoten](../nodes/agent-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [RabbitMQ](../nodes/rabbitmq-node.md)

Der RabbitMQ-Knoten sendet oder empfängt Nachrichten aus RabbitMQ-Queues und -Exchanges. Verwende ihn für nachrichtengesteuerte Workflows und Ereignisverarbeitung. Der Send-Modus veröffentlicht eine Nachricht mit optionaler Verzögerung; der Receive-Modus fungiert als [Trigger](./triggers.md), sodass der Workflow startet, wenn eine Nachricht eintrifft. Die Ausgabe umfasst Status, message_id und body.

Kombiniert mit [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) und [Parallele Ausführung](./parallel-execution.md) für ereignisgesteuerte Verarbeitung.
#### [Error Handler](../nodes/error-handler-node.md)

Der Error Handler-Knoten wird automatisch ausgeführt, wenn ein beliebiger Knoten im Workflow fehlschlägt. Es sind keine eingehenden Kanten erforderlich; er wird von der Engine ausgelöst. Die Ausgabe umfasst die Fehlermeldung, das Label des fehlgeschlagenen Knotens, den Knotentyp und den Zeitstempel. Verwende ihn, um Benachrichtigungen über [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) oder [Send Email](../nodes/send-email-node.md) zu versenden, Fehler zu protokollieren oder benutzerdefinierte Fehlerantworten zurückzugeben.

Als Alternative zur Fehlerbehandlung auf dem Canvas kann ein Workflow Fehler auch an einen separaten Workflow delegieren — siehe [Error Workflow](#error-workflow). Wenn der Canvas bereits einen Error Handler-Knoten enthält, wird der Error Workflow **nicht** aufgerufen (der lokale Handler hat Vorrang).

Übliche Benachrichtigungsziele sind [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) und [Send Email](../nodes/send-email-node.md); Ausführungsdetails lassen sich einfacher im [Verlauf](./execution-history.md) einsehen.

### AI

#### [Agent-Knoten](../nodes/agent-node.md)

Der AI Agent-Knoten ist ein [LLM](../nodes/llm-node.md)-Knoten mit Tool-Aufrufen. Er kann Python-Tools ausführen, verbundene Canvas-Knoten als Tools aufrufen, sich mit [MCP](../tabs/mcp-tab.md)-Servern verbinden, Skills verwenden (Instruktionsdateien und optionale Python-Skripte), als Orchestrator fungieren, der an andere Agent-Knoten delegiert, und andere Workflows als Tools aufrufen. Die Ausgabe ist als `$nodeLabel.text` verfügbar. Ein optionaler **Extra Body**-Schalter hängt ein JSON-Objekt mit anbieterspezifischen Anfrageparametern an jede Anfrage in der Tool-Aufruf-Schleife an; er ist standardmäßig deaktiviert. Ein optionaler **Use Responses API**-Schalter leitet die Modellaufrufe des Agenten über die Responses API, wodurch die Reasoning-Kette des Modells über Tool-Aufrufe hinweg erhalten bleibt, sodass ein Reasoning-Modell seinen Gedankengang durch eine mehrstufige Schleife beibehält; er ist standardmäßig deaktiviert und funktioniert mit OpenAI und benutzerdefinierten Anmeldedaten.

Canvas-Knoten-Tools ermöglichen es einem Agenten, konfigurierte Workflow-Knoten direkt vom Canvas aus aufzurufen. Verbinde einen unterstützten Knoten mit dem Tools-Handle des Agenten und markiere dann bestimmte Felder mit dem Bot-Symbol als vom Agenten bereitgestellt. Diese Felder werden zur Laufzeit zu Tool-Parametern, während Anmeldedaten und nicht markierte Felder in der Knotenkonfiguration fest bleiben.

Der Bereich Skills enthält jetzt **AI Build** zum Erstellen neuer Skills, eine Inline-AI-Bearbeitungsaktion für vorhandene Skills, den ZIP-Download pro Skill und einen optionalen **Enable Drive files**-Schalter für Skills, die zur Laufzeit Heym Drive-Dateien lesen müssen. Das Skill Builder-Modal streamt eine Chat-Konversation auf der linken Seite, akzeptiert Drag-and-Drop-Dateien mit jedem Fine-Tune-Kommentar, zeigt eine Live-Vorschau der generierten `SKILL.md`- und `.py`-Dateien schreibgeschützt auf der rechten Seite an, kann diese Vorschau als ZIP herunterladen und speichert hochgeladene Fine-Tune-Dateien über denselben ZIP-Ingestionsablauf, der auch bei manuellen Uploads verwendet wird, als gebündelte Skill-Assets zurück.

Wenn **[Persistenter Agenten-Speicher](./agent-persistent-memory.md)** aktiviert ist, führt jeder Agent-Knoten seinen eigenen Knowledge Graph: Fakten werden in den System-Prompt geladen, wenn er nicht leer ist, und erfolgreiche Ausführungen lösen im Hintergrund eine Zusammenführung neuer Entitäten und Beziehungen aus. Sub-Agenten verwenden separate Graphen. Du kannst den Graphen eines Agenten mit anderen Agenten (im selben oder in anderen Workflows) mit Lese- oder Lese-/Schreibzugriff über den Graph-Dialog **teilen**. Das Gehirn-Steuerelement auf dem Canvas öffnet den Graph-Editor.

Agent-Knoten können auch in den [Human-in-the-Loop](./human-in-the-loop.md)-Modus wechseln. In diesem Modus erhält der Agent ein `request_human_review`-Tool und kann an bestimmten genehmigungspflichtigen Schritten pausieren, einen einmaligen öffentlichen Review-Link erstellen, einen `review`-Canvas-Zweig für Benachrichtigungsflüsse bereitstellen und warten, bis ein Reviewer den Markdown-Review-Text akzeptiert, bearbeitet oder ablehnt. Das HITL-Feld des Knotens dient als Genehmigungsrichtlinie dafür, wann gefragt werden soll, während die für den Reviewer sichtbare Zusammenfassung aus jeder Review-Anfrage generiert wird. Bei [MCP](../tabs/mcp-tab.md)-Tools verwendet Heym das Modell, um diese schriftlichen Anweisungen in `always`, `once` oder `never` zu interpretieren, sodass freiformulierte Genehmigungssprache auf eine konkrete Laufzeitrichtlinie abgebildet wird. Die Ausführung wird als `pending` markiert und wird nach Eintreffen der Entscheidung aus dem gespeicherten Ausführungs-Snapshot fortgesetzt, und dieselbe Agent-Ausführung kann mehr als einmal pausieren, wenn spätere Schritte ebenfalls eine Überprüfung erfordern.

Agent-Knoten komprimieren ihren angesammelten Nachrichtenverlauf automatisch, wenn er sich 80 % des Kontextfensters des Modells nähert. Der System-Prompt, die erste Benutzernachricht und die neueste Benutzernachricht bleiben immer erhalten; alles dazwischen wird mit demselben Modell und denselben Anmeldedaten zusammengefasst. Komprimierungsereignisse sind im Debug-Panel, im [Verlauf](./execution-history.md) und im Reiter [Traces](../tabs/traces-tab.md) sichtbar.

Siehe auch [LLM](../nodes/llm-node.md), [Agenten-Architektur](./agent-architecture.md), [Persistenter Agenten-Speicher](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) und [Dateierstellung](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Der Codex-Knoten führt die OpenAI Codex CLI in einem isolierten Heym-Workspace aus. Er akzeptiert eine Codex-Anmeldedaten (melde dich mit ChatGPT an, um dein Abonnement ohne API-Kosten pro Token zu nutzen, oder füge ein Zugriffstoken ein), eine GitHub-Anmeldedaten, Repository-URL, Basis-Branch, Task-Prompt, Veröffentlichungsmodus (`diff_only` oder `draft_pr`), Branch-Namen und Timeout. Der Runner klont das Repository lokal, übergibt das ChatGPT-Token-Bundle oder `CODEX_ACCESS_TOKEN` nur an den Codex-Prozess und gibt eine strukturierte Zusammenfassung, Validierungshinweise, geänderte Dateien, Diff, Nutzungsmetadaten und eine optionale Draft-PR-URL zurück.

Wenn Codex `needs_input` zurückgibt, pausiert der Workflow und stellt den `question`-Branch bereit. Verbinde diesen Branch mit Slack, E-Mail oder einem anderen Benachrichtigungs-Knoten; der öffentliche Follow-up-Link setzt den gespeicherten Ausführungs-Snapshot fort, nachdem die Antwort übermittelt wurde. Der Codex-Knoten kann auch als Tool an einen AI Agent angehängt werden, sodass der Agent Coding-Aufgaben delegieren kann; als Tool wird ein `needs_input`-Ergebnis inline an den Agent zurückgegeben, anstatt den Workflow zu pausieren.

Siehe auch [GitHub](../nodes/github-node.md), [Anmeldedaten](./credentials.md), [Anmeldedaten-Sharing](./credentials-sharing.md) und [Knotentypen](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Der OpenCode Go-Knoten führt die OpenCode CLI (Go) gegen ein GitHub-Repository aus. Die Isolation folgt dem Codex-Muster: lokal läuft sie als Host-Subprozess, während Docker-Deployments sie in einem gehärteten Schwester-Container ausführen, der das Workspace-Volume teilt. Er akzeptiert eine OpenCode Go-Anmeldedaten (ein Gateway-API-Schlüssel mit optionaler Basis-URL), eine GitHub-Anmeldedaten, Repository-URL, Basis-Branch, Task-Prompt, Veröffentlichungsmodus, Branch-Namen, Timeout und ein `opencode-go/<model>`-Modell, das aus einer live durchsuchbaren Modellliste ausgewählt wird (mit integriertem Fallback). Heym führt alle git/GitHub-Operationen auf dem Host aus und platziert das GitHub-Token niemals innerhalb der Sandbox; OpenCode bearbeitet nur Dateien auf der Festplatte. Der Knoten gibt eine strukturierte Zusammenfassung, Validierungshinweise, geänderte Dateien, Diff und eine optionale Pull-Request-URL zurück. Er kann als Tool an einen AI Agent angehängt werden.

Siehe auch [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Anmeldedaten](./credentials.md), [Anmeldedaten-Sharing](./credentials-sharing.md) und [Knotentypen](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Der LLM-Knoten verarbeitet Text mit einem Sprachmodell oder generiert Bilder. Er unterstützt Textgenerierung, Vision (Bildeingabe), Bildgenerierung, strukturierte JSON-Ausgabe, provider-native Batch-API-Ausführung für unterstützte OpenAI- und OpenAI-kompatible Endpoints sowie einen optionalen **Use Responses API**-Schalter, der den Aufruf über die Responses API statt über Chat Completions leitet (standardmäßig aus; funktioniert mit OpenAI- und benutzerdefinierten Anmeldedaten und kann nicht mit dem Batch-Modus kombiniert werden). Konfiguriere Anmeldedaten, Modell, System- und Benutzernachrichten, Temperatur und maximale Token; verwende [Ausdrucks-DSL](./expression-dsl.md) in Prompts. Im Batch-Modus muss die `userMessage` zu einem Array aufgelöst werden, der Knoten gibt einen `batchStatus`-Branch mit Fortschrittsaktualisierungen aus, und die endgültige Ausgabe enthält Batch-Ergebnisse pro Element. Ein optionaler **Extra Body**-Schalter hängt ein JSON-Objekt mit providerspezifischen Anfrageparametern (zum Beispiel `{"thinking": {"type": "disabled"}}`) an jeden API-Aufruf an; er ist standardmäßig aus. Optionale [Guardrails](./guardrails.md) blockieren unsichere Inhalte vor dem Aufruf.

Passt natürlich zu [Qdrant RAG](../nodes/rag-node.md), [Agent-Knoten](../nodes/agent-node.md), [Guardrails](./guardrails.md) und [Ausdrucksauswertungs-Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Der Decision-Knoten stellt einem Entscheidungsmodell typisierte Fragen über den Zustand des Laufs und gibt Wahrscheinlichkeiten statt Prosa zurück. Ein **State**-Feld trägt das, was das Modell lesen soll — ein einzelner Ausdruck behält seinen eigenen Typ, sodass `$input` das Objekt statt seines Textes sendet — und eine Liste von Fragen trägt die Beurteilungen. Fragen gibt es in drei Formen: **noul** beantwortet, ob eine Bedingung zutrifft, **choice** wählt eine Option aus einer von dir definierten Menge und gibt die vollständige Verteilung zurück, und **score** bewertet den Zustand entlang geordneter Stufen und kann zwischen ihnen landen. Choice- und Score-Antworten tragen außerdem eine Konfidenz, sodass ein [Switch](../nodes/switch-node.md) auf der Antwort routen kann, während ein [Condition](../nodes/condition-node.md) auf der Sicherheit der Antwort gated. **Generate with AI** entwirft die State-Vorlage und die Fragenzeilen aus einem einfachen Satz, und **Custom request body** sendet handgeschriebenes JSON für einen Endpoint, dessen Vertrag abweicht. Die Provider-Antwort wird unverändert weitergegeben, und jeder Aufruf wird in [Traces](../tabs/traces-tab.md) aufgezeichnet.

Benötigt eine Decision Model-Anmeldedaten; passt natürlich zu [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) und [Agent-Knoten](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Der RAG / Vector Store-Knoten fügt Dokumente in einen Vektorspeicher ein, aktualisiert sie (Upsert), löscht sie und sucht sie für retrieval-augmentierte Generierung. Ein Datenbank-Dropdown wählt das Backend aus — **Qdrant** (externer Server) oder **Postgres (pgvector)** (Heyms eigene Datenbank, kein externer Dienst), standardmäßig Qdrant. Wähle einen Vektorspeicher aus dem Reiter [Vectorstores](../tabs/vectorstores-tab.md) und setze die Operation auf insert, upsert, delete oder search. Upsert und delete adressieren ein Dokument über eine eindeutige id, die im Payload gespeichert ist — ein **Document ID Field** benennt dieses Feld (Standard `doc_id`) und **Document ID** trägt seinen Wert — sodass ein Dokument die id behält, die dein eigenes System bereits verwendet: upsert ersetzt jeden passenden Punkt, bevor die neue Version gespeichert wird, und delete meldet, ob etwas übereingestimmt hat. Dokument-Metadaten akzeptieren Ausdrücke in ihren Werten, sodass `{"url": "$start.url"}` speichert, was der Lauf produziert hat. Die Suche unterstützt Metadaten-Filter und optionales Cohere-Reranking und gibt ein Array von Ergebnissen mit text, score, metadata, reranked-Flag und count zurück, zur Verwendung in [LLM](../nodes/llm-node.md)- oder [Agent-Knoten](../nodes/agent-node.md)-Flows.

Häufige nachgelagerte Knoten sind [LLM](../nodes/llm-node.md) und [Agent-Knoten](../nodes/agent-node.md); die Einrichtung des Vektorspeichers befindet sich in [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP-Aufruf-Knoten](../nodes/mcp-call-node.md)

Der MCP Call-Knoten ruft ein bestimmtes [MCP](../tabs/mcp-tab.md)-Tool direkt auf, ohne dass ein LLM entscheidet, welches Tool aufgerufen wird. Verwende ihn, wenn du zur Designzeit genau weißt, welches Tool ausgeführt werden soll — für deterministische, einstufige MCP-Tool-Ausführung in einem Workflow. Konfiguriere eine Verbindung (SSE, Streamable HTTP oder stdio; dieselben Felder wie die MCP-Verbindung des [Agent-Knoten](../nodes/agent-node.md)), klicke auf **Fetch Tools**, um ein Dropdown zu befüllen, wähle ein Tool aus und fülle Argumentfelder aus, die automatisch aus dem Eingabe-Schema des Tools gerendert werden. Jedes Argument akzeptiert einen statischen Wert oder einen [DSL-Ausdruck](./expression-dsl.md) wie `$userInput.body.text`. Das Ergebnis ist als `$nodeLabel.result` verfügbar (JSON-Objekt, falls parsebar, andernfalls String). Der MCP Call-Knoten kann nicht als Canvas-Tool mit einem [Agent-Knoten](../nodes/agent-node.md) verbunden werden.

Siehe auch [Agent-Knoten](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) und [Ausdrucks-DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Der Condition-Knoten verzweigt den Workflow basierend auf einem if/else-Ausdruck. Er hat zwei Ausgabe-Handles: einen für den Fall, dass die Bedingung truthy ist, und einen für falsy. Verwende Vergleichs- und logische Operatoren aus der [Ausdrucks-DSL](./expression-dsl.md) im Bedingungsausdruck; der Knoten leitet die Eingabe an den gewählten Zweig weiter.

Siehe auch [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) und [Ausdrucks-DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Der Switch-Knoten leitet die Ausführung durch Abgleich eines Werts mit Fällen auf verschiedene Pfade. Konfiguriere einen auszuwertenden Ausdruck und eine Liste von Fallwerten; jeder Fall erhält einen Source-Handle und ein Default-Handle wird für nicht übereinstimmende Werte verwendet. Die Eingabe wird an den übereinstimmenden Zweig weitergeleitet.

Verwende [Condition](../nodes/condition-node.md) für binäre Verzweigung und [Merge](../nodes/merge-node.md), um geroutete Pfade wieder zusammenzuführen; die Abgleichsregeln sind in [Ausdrucks-DSL](./expression-dsl.md) behandelt.

#### [Merge](../nodes/merge-node.md)

Der Merge-Knoten wartet auf mehrere parallele Eingaben und kombiniert sie zu einer einzigen Ausgabe. Lege die Anzahl der Eingaben fest, auf die gewartet werden soll; der Knoten erzeugt ein zusammengeführtes Objekt, sobald alle Zweige abgeschlossen sind. Verwende ihn, um Ergebnisse aus parallelen Zweigen zusammenzuführen, bevor du fortfährst; verwende ihn nicht, wenn parallele Zweige in separaten Output-Knoten enden.

Siehe auch [Parallele Ausführung](./parallel-execution.md), [Loop](../nodes/loop-node.md) und [Output](../nodes/output-node.md) beim Rekombinieren von Zweigen.

#### [Loop](../nodes/loop-node.md)

Der Loop-Knoten iteriert über ein Array und führt nachgelagerte Knoten für jedes Element aus. Er erfordert eine Rückverbindung vom letzten Knoten im Iterationskörper, um voranzuschreiten. Verwende innerhalb des Loop-Körpers `item`, `index`, `total`, `isFirst` und `isLast`; der Loop hat separate Ausgaben für den Iterationspfad und den Done-Pfad.

Passt zu [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) und [Ausdrucks-DSL](./expression-dsl.md) für iterative Workflows.

### Data

#### [Set](../nodes/set-node.md)

Der Set-Knoten transformiert und mappt Eingabedaten auf eine benutzerdefinierte Ausgabe. Definiere Key-Value-Mappings, bei denen jeder Wert ein [Ausdrucks-DSL](./expression-dsl.md)-Ausdruck ist. Verwende ihn für Großschreibung, Substring, Verkettung, Zufallszahlen und ähnliche Transformationen. Greife auf die Ausgabe per Key zu (z. B. `$setNode.keyName`). Wenn er als Canvas-Knoten-Tool mit einem Agenten verbunden ist, können Mapping-Werte als agent-provided markiert werden, sodass der Agent sie zur Laufzeit befüllt. Für den Aufruf anderer Workflows verwende stattdessen den [Execute](../nodes/execute-node.md)-Knoten.

Siehe auch [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) und [Ausdrucks-DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Der Converter-Knoten konvertiert Daten zwischen Formaten, ohne dass Code geschrieben werden muss. Textkonvertierungen sind `csvToJson` (CSV-Text in ein Array von Zeilenobjekten oder, wenn kein Header vorhanden ist, in Arrays), `jsonToCsv` (ein Array von Objekten/Zeilen in CSV-Text), `xmlToJson` (XML-Text in ein Objekt) und `jsonToXml` (ein Objekt in XML-Text). Konfiguriere die Konvertierungsrichtung und den Quellausdruck; CSV-Konvertierungen verwenden zusätzlich ein Trennzeichen und die Header-Behandlung, und `jsonToCsv` kann eine explizite Spaltenreihenfolge festlegen. Quoting, eingebettete Trennzeichen und eingebettete Zeilenumbrüche folgen RFC 4180. XML-Attribute verwenden `@`-Präfixe, Text gemischt mit Attributen verwendet `#text`, wiederholte Elemente werden zu Arrays, und die XML-Entity-Expansion ist deaktiviert. Derselbe Knoten arbeitet auch mit gespeicherten Dateien. `imageToText` und `pdfToText` führen Tesseract OCR aus, lesen eine Datei aus Heym Drive (`$Upload.file.id` von einem File upload-Trigger, ein Ergebnis eines Drive-Knotens oder eine von einem Agenten generierte Datei), wählen die Sprache automatisch anhand des erkannten Schriftsystems oder verwenden von dir angegebene Codes wie `tur` oder `eng+tur`, und normalisieren den Text standardmäßig auf UTF-8 mit optionaler NFC-Normalisierung und engeren Zeichensätzen wie `cp1254`. `fileConvert` schreibt eine gespeicherte Datei in ein anderes Format um, Dokumente über pandoc und Bilder über Pillow, und speichert das Ergebnis als neue Drive-Datei, ohne das Original anzutasten. Das Ergebnis ist als `$converterNode.result` verfügbar, mit `.language`, `.encoding`, `.page_count`, `.pages` und `.file` daneben für OCR-Läufe sowie `.id`, `.filename` und `.download_url` für `fileConvert`.

Siehe auch [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) und [Ausdrucks-DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Der Code-Knoten führt Python aus, das du schreibst, mit einer eigenen `requirements.txt`, in einem Container, der für jede Ausführung erstellt und zerstört wird. Dein Code definiert eine `main(params)`-Funktion und gibt einen beliebigen JSON-serialisierbaren Wert zurück, der zu `$codeNode.result` wird; alles, was er ausgibt, wird separat als `$codeNode.logs` erfasst, und `$codeNode.install` meldet, welches Tool die Abhängigkeiten installiert hat. Parameter werden als JSON-Objekt konfiguriert, dessen `$`-Ausdrücke vor dem Lauf aufgelöst werden, und der Code liest sie mit Punktnotation wie `params.user.name` oder `params.orders[0].id`. Abhängigkeiten werden mit `uv` installiert, mit Rückgriff auf `pip` für Pakete, die `uv` nicht verarbeiten kann, ohne Caching zwischen den Läufen; wenn `requirements.txt` leer bleibt, wird die Installation vollständig übersprungen und ist deutlich schneller. Die Ausführungsphase hat kein Netzwerk, es sei denn `codeAllowNetwork` ist aktiviert, während die Abhängigkeitsinstallation immer PyPI erreicht. Die Sandbox läuft als Non-Root mit allen entfernten Capabilities, einem schreibgeschützten Root-Dateisystem, ohne Docker-Socket und ohne Zugriff auf Backend-Secrets, begrenzt auf 512 MB Speicher, eine CPU, 256 Prozesse, eine 120-sekündige Installation und eine 60-sekündige Ausführung. Docker ist erforderlich und es gibt keinen Fallback-Modus: Ohne erreichbaren Daemon schlägt der Knoten fehl, anstatt deinen Code im Backend-Prozess auszuführen.

#### [Variable](../nodes/variable-node.md)

Der Variable-Knoten setzt oder aktualisiert eine workflow-lokale Variable (`$vars.variableName`) oder eine persistente [globale Variable](./global-variables.md) (`$global.variableName`). Verwende ihn für Zähler, akkumulierte Listen und gemeinsamen Zustand. Konfiguriere Variablenname, Wertausdruck, Typkonvertierung und ob im globalen Speicher abgelegt werden soll. Array-Variablen unterstützen `$array()` und `.add()`.

Passt zu [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) und [Globale Variablen](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Der Execute-Knoten ruft einen anderen Workflow (Sub-Workflow) auf und übergibt Eingaben an ihn. Gib den Ziel-Workflow per ID an und stelle Eingaben über einen einzelnen Ausdruck oder Key-Value-Zuordnungen bereit. Die Ausgabe enthält workflow_id, status und outputs; verwende ihn für wiederverwendbare Logik, nicht für Datentransformation (verwende dafür Set).

Siehe auch [Canvas-Funktionen](./canvas-features.md) für Extract to Sub-Workflow, [Workflow-Struktur](./workflow-structure.md) und [Output](../nodes/output-node.md).

### Integrations

#### [HTTP](../nodes/http-node.md)

Der HTTP-Knoten führt HTTP-Anfragen mit cURL-artiger Konfiguration aus. Er kann ein Workflow-Startpunkt sein (keine eingehende Kante) oder Eingaben von vorgelagerten Knoten empfangen. Die Antwort ist als status, headers und body verfügbar (geparstes JSON, wenn zutreffend). Verwende [Credentials](./credentials.md) für Bearer- oder benutzerdefinierte Header-Authentifizierung.

Passt zu [Webhooks](./webhooks.md), [Credentials](./credentials.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Der WebSocket Send-Knoten öffnet eine ausgehende Client-Verbindung, sendet eine Text-/JSON-/Binärnachricht und schließt sie. Verwende ihn, um Workflow-Ausgaben an Echtzeitsysteme zu veröffentlichen, ohne einen von Heym gehosteten Socket-Endpoint zu erstellen.

Siehe auch [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [Telegram](../nodes/telegram-node.md)

Der Telegram-Knoten sendet eine Bot-Nachricht an einen Chat, eine Gruppe oder einen Kanal. Konfiguriere eine Telegram-[credential](./credentials.md), setze `chatId` und verfasse die ausgehende `message` mit [Ausdrucks-DSL](./expression-dsl.md)-Ausdrücken. Er passt natürlich zu [Telegram Trigger](../nodes/telegram-trigger-node.md) für konversationelle Workflows und zu [Error Handler](../nodes/error-handler-node.md) für Betreiber-Warnungen.

Siehe auch [Drittanbieter-Integrationen](./integrations.md) und [Credentials](./credentials.md) für die Einrichtung und Credential-Muster.
#### [Slack](../nodes/slack-node.md)

Der Slack-Knoten sendet eine Nachricht über einen Incoming Webhook an einen Slack-Kanal. Konfiguriere eine Slack-[Anmeldedaten](./credentials.md) und einen Nachrichtenausdruck. Verwende ihn für Benachrichtigungen, Warnungen und Fehlerberichte; die Ausgabe wird unverändert durchgereicht.

Passt zu [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Der Discord-Knoten sendet eine Nachricht über einen Incoming Webhook an einen Discord-Kanal. Konfiguriere eine Discord-[Anmeldedaten](./credentials.md), verfasse die ausgehende Nachricht mit der [Ausdrucks-DSL](./expression-dsl.md) und lege optional Überschreibungen für Webhook-Benutzername oder Avatar fest.

Passt zu [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Der Send Email-Knoten versendet E-Mails über SMTP. Konfiguriere eine SMTP-[Anmeldedaten](./credentials.md) und [Ausdrucks-DSL](./expression-dsl.md)-Ausdrücke für Empfänger, Betreff und Nachrichtentext. Verwende ihn für Benachrichtigungen, Warnungen und transaktionale E-Mails. Die Ausgabe enthält Status, to und subject.

Der [IMAP Trigger](../nodes/imap-trigger-node.md) ergänzt Send Email durch die Verarbeitung eingehender E-Mails. Zusammen ermöglichen sie einem Workflow, eingehende E-Mails aus einem gemeinsamen Postfach zu lesen, sie mit AI-Knoten zusammenzufassen oder zu klassifizieren und eine Folge- oder Eskalationsnachricht zu senden. Der [Telegram Trigger](../nodes/telegram-trigger-node.md) und der [Telegram-Knoten](../nodes/telegram-node.md) bieten dasselbe Muster für eingehende und ausgehende Nachrichten bei bot-gesteuerten Chat-Workflows.

Für bidirektionale Benachrichtigungsflüsse passt er außerdem gut zu [LLM](../nodes/llm-node.md), [Agent-Knoten](../nodes/agent-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Der Redis-Knoten führt Redis-Operationen aus: set, get, hasKey und deleteKey. Verwende ihn für Caching, Rate Limiting und Key-Value-Speicherung. Konfiguriere eine [Anmeldedaten](./credentials.md), den Operationstyp, einen Key-Ausdruck und bei set-Operationen den Wert sowie optional eine TTL. Die Ausgabe variiert je nach Operation (value, success, exists, deleted).

Passt zu [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) und [Parallele Ausführung](./parallel-execution.md) für Caching, Drosselung und Koordination.

#### [Grist](../nodes/grist-node.md)

Der Grist-Knoten liest, schreibt und verwaltet Daten in Grist-Tabellen. Zu den Operationen gehören getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables und listColumns. Gib die Dokument-ID, die Tabellen-ID und bei create/update die Datensatzdaten anhand der Spalten-IDs an. Verwende ihn für CRUD, Batch-Updates und Tabellenkalkulations-Automatisierung.

Siehe auch [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Der Google Sheets-Knoten liest, schreibt und verwaltet Tabellendaten über OAuth2. Verwende ihn, um Berichte zu lesen, Workflow-Ergebnisse anzuhängen, Tracker zu aktualisieren und Tabellenblätter aus einem Workflow heraus zu leeren oder zu inspizieren. Wie [BigQuery](../nodes/bigquery-node.md) verwendet er eine von Google bereitgestellte Integrations-Anmeldedaten und passt gut neben [Grist](../nodes/grist-node.md), wenn Tabellendaten Teil des Flusses sind.

Passt zu [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

Der BigQuery-Knoten führt SQL-Abfragen aus und fügt Zeilen über OAuth2 in Google BigQuery-Datasets ein. Er ist nützlich für Analyse-Workflows, Reporting-Pipelines und das Schreiben strukturierter Ereignisdaten aus Workflow-Ausführungen. Er passt oft zu [Set](../nodes/set-node.md) zum Formen von Zeilen und zu [Google Sheets](../nodes/google-sheets-node.md) für leichteres, tabellenkalkulationsorientiertes Reporting.

Passt zu [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [Google Drive](../nodes/google-drive-node.md)

Der Google Drive-Knoten listet, lädt herunter, aktualisiert und löscht Drive-Dateien und -Ordner über OAuth2 und kann mit seiner `syncToHeymDrive`-Operation eine Drive-Datei direkt in [Heym Drive](../nodes/drive-node.md) kopieren. Google Docs, Sheets und Slides haben keine herunterladbaren Bytes, daher exportiert der Knoten sie automatisch — Docs nach PDF, Sheets nach XLSX, Slides nach PPTX — mit einer Überschreibung für das Zielformat. Löschungen verschieben Elemente in den Drive-Papierkorb, sofern nicht "Delete permanently" aktiviert ist, und der Knoten weigert sich, einen Ordner über die Dateioperation zu löschen oder umgekehrt. Wie [Google Sheets](../nodes/google-sheets-node.md) verwendet er eine von Google bereitgestellte OAuth2-Anmeldedaten; beachte, dass dieser vollständigen Drive-Zugriff anfordert, prüfe daher [Credential Sharing](./credentials-sharing.md), bevor du ihn teilst.

Passt zu [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Der GitHub-Knoten bietet 40 native GitHub-REST-Aktionen für Repositories, Organisationen und Benutzer, Issues, Pull Requests, Reviews, Releases, Actions-Workflows, Traffic-Insights und Repository-Dateien. Verwende ihn für Issue-Triage, Review-Automatisierung, Workflow-Dispatch und Warten auf Abschluss, Release-Automatisierung und Repo-Dateiaktualisierungen, ohne HTTP-Anfragen manuell zu erstellen. Er unterstützt GitHub.com und optional `base_url` für GitHub Enterprise in der Anmeldedaten.

Passt zu [Agent-Knoten](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) und [Drittanbieter-Integrationen](./integrations.md).
#### [Jira](../nodes/jira-node.md)

Der Jira-Knoten verbindet Workflows mit den REST-APIs von Jira Cloud oder Jira Data Center / Server für die Automatisierung von Projekten, Issues, Kommentaren, Anhängen, Benutzern, Benachrichtigungen und Übergängen. Er kann Projekte auflisten, Issues mit JQL suchen, Issues erstellen oder aktualisieren, Changelogs einsehen, Stakeholder benachrichtigen, Kommentare und Anhänge verwalten, Benutzer abrufen oder verwalten, verfügbare Übergänge auflisten und Issues über eine Transition-ID verschieben. Verwende eine Jira-Anmeldedaten mit Atlassian-E-Mail, API-Token, Site-Basis-URL und Deployment-Modus.

Kombiniert mit [LLM](../nodes/llm-node.md), [Agent-Knoten](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) und [Drittanbieter-Integrationen](./integrations.md) für Support-Annahme, Bug-Triage und Release-Workflows.

#### [Linear](../nodes/linear-node.md)

Der Linear-Knoten verbindet Workflows mit der GraphQL-API von Linear für die Automatisierung von Workspaces und Issues. Er kann Teams, Projekte, Issues, Workflow-Status, Teammitglieder und Kommentare auflisten; Issues erstellen, aktualisieren, löschen und verknüpfen; sowie Kommentare erstellen, aktualisieren, auflösen, die Auflösung aufheben oder löschen. Verwende einen persönlichen Linear-API-Schlüssel oder eine OAuth2-Anmeldedaten und ermittle anschließend die UUIDs von Team, Projekt, Status und Zugewiesenem aus Listenoperationen, bevor du Issues erstellst oder aktualisierst.

Kombiniert mit [LLM](../nodes/llm-node.md), [Agent-Knoten](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) und [Drittanbieter-Integrationen](./integrations.md) für Annahme-, Triage- und Engineering-Backlog-Workflows.

#### [Supabase](../nodes/supabase-node.md)

Der Supabase-Knoten liest und verändert Tabellen, die über Supabase PostgREST bereitgestellt werden. Er eignet sich gut für Produkt-Backends, Benutzer-/Profildaten, Workflow-Status und CRUD-Automatisierungen, die Datenbankzugriff ohne benutzerdefinierte HTTP-Request-Verdrahtung wünschen.

Kombiniert mit [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Der ClickHouse-Knoten führt CRUD-, Count- und Raw-SQL-Operationen gegen eine externe ClickHouse-Datenbank über deren HTTP-Schnittstelle aus. Er eignet sich für Analyse-Pipelines, Event-Logging und Reporting-Workflows: Ereignisse werden eingefügt, sobald sie auftreten, und anschließend mit `query`/`count` aggregiert oder gezählt. Er spiegelt den Operationsumfang des [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) plus einen Raw-SQL-Ausweg, wobei `update`/`remove` als ClickHouse-Mutationen ausgeführt werden.

Kombiniert mit [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) für geplante Berichte und [Drittanbieter-Integrationen](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Der Notion-Knoten verwaltet Notion-Datenbanken, Datenquellen, Seiten und Blöcke über die aktuelle Notion-API (`2026-03-11`). Er unterstützt Suche, Seiten-CRUD, Datenbank- und Datenquellenoperationen, Block-Kinder, Anhängen/Aktualisieren/Löschen von Blöcken sowie Papierkorb/Wiederherstellen. Verwende ein internes Integrationstoken oder eine OAuth-Anmeldedaten einer öffentlichen Notion-Integration. Der Editor kann zugängliche Datenquellen und übergeordnete Seiten durchsuchen und mit Cursor paginieren. Geteilte Anmeldedaten funktionieren für die Workflow-Ausführung genauso wie eigene Anmeldedaten.

Für benutzerdefinierte REST-Aufrufe löst `$credentials.YourNotionCredential` zum selben Bearer-Token auf. Kombiniert mit [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) und [Drittanbieter-Integrationen](./integrations.md).

#### [Sentry](../nodes/sentry-node.md)

Der Sentry-Knoten automatisiert Sentry-Organisationen, Projekte, Teams, Issues, Events und Releases über die Sentry-REST-API. Verwende ihn für Alert-Triage, Statusaktualisierungen von Issues, Release-Automatisierung, Event-Lookup sowie Projekt-/Team-Einrichtung oder -Bereinigung. Er unterstützt Sentry SaaS und selbstgehostetes Sentry über eine optionale Basis-URL in den Anmeldedaten.

Kombiniert mit [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) und [Drittanbieter-Integrationen](./integrations.md) für Incident- und Release-Workflows.

#### [DataTable](../nodes/datatable-node.md)

Der DataTable-Knoten liest, schreibt und verwaltet Daten in Heym DataTables (First-Party-strukturierte Speicherung). Zu den Operationen gehören find, getAll, getById, insert, update, remove und upsert. Keine externen Anmeldedaten erforderlich. Tabellen werden über den [DataTable](../tabs/datatable-tab.md)-Dashboard-Reiter verwaltet und direkt vom Workflow-Eigentümer aufgerufen.

Kombiniert mit [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) und dem [DataTable-Reiter](../tabs/datatable-tab.md) für First-Party-strukturierte Speicherung.

#### [Drive](../nodes/drive-node.md)

Der Drive-Knoten verwaltet Dateien, die von Skills generiert wurden, direkt aus einem Workflow heraus. Zu den Operationen gehören delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams und unshareWithMyTeams für die Verwaltung des schreibgeschützten Teamzugriffs; die Formatkonvertierung befindet sich stattdessen im [Converter](../nodes/converter-node.md)-Knoten. Referenziere die Datei mit `$agentLabel._generated_files[0].id`; die Ausgaben umfassen status, file_id, aktualisierte download_url für Link-Beschränkungen und shared_team_count für die Teamfreigabe. Dies ist besonders nützlich bei [Agent-Knoten](../nodes/agent-node.md)-Workflows, die [Dateierstellung](./file-generation.md) und das [Drive](./drive.md)-Referenzmodell verwenden.

Häufige Begleiter sind [Agent-Knoten](../nodes/agent-node.md), [Dateierstellung](./file-generation.md) und [Drive](./drive.md).
#### [Amazon S3](../nodes/amazon-s3-node.md)

Der Amazon S3-Knoten führt Objektspeicher-Operationen auf Amazon S3 unter Verwendung einer `s3`-Anmeldedaten (Access Key, Secret Key, Region, optionales Session-Token) aus. Zu den Operationen gehören putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder und listBuckets. Text-Upload sowie Text- oder Base64-Download werden unterstützt, wobei die Felder bucket und key [Ausdrucks-DSL](./expression-dsl.md) akzeptieren. Verwende ihn, um Workflow-Ausgaben zu speichern, Dateien zu archivieren und Objekte zurück in einen Flow zu lesen.

Passt zu [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Anmeldedaten](./credentials.md) und [Drittanbieter-Integrationen](./integrations.md).

### Automation

#### [Crawler](../nodes/crawler-node.md)

Der Crawler-Knoten scrapt Webseiten mit FlareSolverr und optionaler HTML-Extraktion über CSS-Selektoren. Konfiguriere eine FlareSolverr-[Anmeldedaten](./credentials.md), einen URL-Ausdruck, eine Wartezeit und optionale Selektoren für die Extraktion. Die Ausgabe ist das rohe HTML oder der extrahierte Inhalt. Verwende ihn für Web-Scraping und Inhaltsextraktion.

Passt zu [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) und [LLM](../nodes/llm-node.md) für Scrape-and-Analyze-Flows.

#### [Playwright](../nodes/playwright-node.md)

Der Playwright-Knoten automatisiert Browser-Interaktionen mit konfigurierbaren Schritten (navigate, refresh, click, type, screenshot, extract, aiStep) oder dem **Run Code**-Modus für benutzerdefiniertes Playwright-Python (sandboxed; standardmäßig deaktiviert über `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Er unterstützt den Headless-Modus, eine optionale Einstellung, die gängige Playwright-Automatisierungssignale reduziert, Timeouts, optionale Netzwerkaufzeichnung (responses, cookies, localStorage, sessionStorage), Cookie-/storageState-Auth-Bootstrap aus [Globale Variablen](./global-variables.md)-Ausdrücken wie `$global.authState`, Fallback-Login-Schritte, wenn die Auth-Wiederherstellung fehlschlägt, und einen AI-Schritt mit Auto Heal, wenn Selektoren fehlschlagen. Verwende ihn für Web-Scraping, Formularausfüllung und browserbasierte Workflows.

Siehe auch [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) und [Verlauf](./execution-history.md) für Browser-Automatisierung und Debugging.

### Utilities

#### [Output](../nodes/output-node.md)

Der Output-Knoten ist der Workflow-Endpoint, der die Antwort an den Aufrufer zurückgibt. Setze den Nachrichtenausdruck so, dass er den vorherigen Knoten über das Label referenziert (verwende hier niemals `$input` aus dem [Input](../nodes/input-node.md)-Knoten). Optionales asynchrones Downstream ermöglicht es Knoten nach dem Output, im Hintergrund ausgeführt zu werden, nachdem die Antwort gesendet wurde.

Häufige Upstream-Quellen sind [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) und [Execute](../nodes/execute-node.md); die Antwortformung lässt sich leichter im [Ausdrucksauswertungs-Dialog](./expression-evaluation-dialog.md) debuggen.

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Der JSON output mapper-Knoten erstellt ein einfaches JSON-Objekt aus Key-Value-Zuordnungen im [Set](../nodes/set-node.md)-Stil und gibt es an der Wurzel der Workflow-Antwort zurück. Verwende ihn, wenn ein API-Aufrufer einen rohen JSON-Body anstelle des standardmäßigen [Output](../nodes/output-node.md)-Knoten-Wrappers erhalten soll.

#### [HTML output mapper](../nodes/html-output-mapper-node.md)

Der HTML output mapper-Knoten rendert eine einzelne HTML-Vorlage und interpoliert `$nodeLabel.field`-Ausdrücke in die Seite. Wenn er der einzige terminale Knoten des Workflows ist, antwortet der execute-Webhook mit `text/html` und dem konfigurierten Statuscode des Knotens anstelle eines JSON-Bodys, sodass ein Workflow eine Seite direkt an einen Browser ausliefern kann. Sende `X-Simple-Response: false`, um zum Debuggen die übliche JSON-Hülle zurückzuerhalten.

Passt zu [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow-Struktur](./workflow-structure.md) und [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Der Chart Output-Knoten ist der terminale Knoten eines [Dashboard](../tabs/dashboard-tab.md)-Widget-Workflows. Er wandelt die von Upstream-Knoten erzeugten Zeilen in eine standardisierte Chart-Payload um, die das Dashboard rendert. Wähle einen `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text oder HITL), ordne `labelField`/`valueField` zu (oder `series` für Multi-Serie, oder `text` für eine Markdown-Nachricht) und platziere ihn zuletzt; er hat keine Ausgangskante. HITL ignoriert Upstream-Zeilen und listet deine ausstehenden menschlichen Reviews auf. und eine andere als Link-Buttons, die eine URL in einem neuen Tab öffnen (`linkColumn`, mit `linkLabel` für den Button-Text)

Siehe auch [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) und [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Der Wait-Knoten pausiert die Workflow-Ausführung für eine angegebene Dauer in Millisekunden, bis zu 15 Minuten. Verwende ihn für Rate Limiting, verzögerte Aktionen oder Polling-Intervalle. Er reicht die Eingabe unverändert durch.

Passt zu [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) und [Parallele Ausführung](./parallel-execution.md) für Taktung und Polling.

#### [Sticky Note](../nodes/sticky-note-node.md)

Der Sticky Note-Knoten fügt Markdown-Notizen zum Canvas hinzu. Er wird nicht ausgeführt. Verwende ihn für Dokumentation, Anweisungen oder Workflow-Notizen neben anderen [Canvas-Funktionen](./canvas-features.md). Doppelklicke auf den Canvas, um den Inhalt der Notiz zu bearbeiten.

Siehe auch [Canvas-Funktionen](./canvas-features.md), [Tastenkombinationen](./keyboard-shortcuts.md) und [Workflow-Organisation](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Der Console Log-Knoten protokolliert einen Wert in der Backend-(Server-)Konsole. Verwende ihn zum Debuggen und Inspizieren während der Entwicklung. Die Log-Nachricht unterstützt [Ausdrucks-DSL](./expression-dsl.md)-Ausdrücke; die Ausgabe reicht die Eingabe durch.

Passt zu [Verlauf](./execution-history.md), [Traces](../tabs/traces-tab.md) und [Ausdrucksauswertungs-Dialog](./expression-evaluation-dialog.md) zum Debuggen.
#### [Knoten deaktivieren](../nodes/disable-node.md)

Der Knoten „Knoten deaktivieren" deaktiviert dauerhaft einen anderen Knoten im Workflow, indem er dessen `active`-Flag auf false setzt. Gib den Zielknoten über sein Label an. Verwende ihn für einmalige Vorgänge, wie das Stoppen eines [Cron](../nodes/cron-node.md)-Triggers, nachdem eine Bedingung erfüllt wurde.

Siehe auch [Canvas-Funktionen](./canvas-features.md), [Bearbeitungsverlauf](./edit-history.md) und [Cron](../nodes/cron-node.md) für Workflow-Steuerungsmuster.

#### [Knoten aktivieren](../nodes/enable-node.md)

Der Knoten „Knoten aktivieren" schaltet einen anderen Knoten wieder ein, indem er dessen `active`-Flag auf true setzt und die Änderung speichert. Gib den Zielknoten über sein Label an. Verwende ihn, um einen deaktivierten [Cron](../nodes/cron-node.md)-Trigger von einem anderen Einstiegspunkt aus erneut zu aktivieren oder um einen Knoten einzuschalten, sobald eine Bedingung erfüllt ist. Ein Ziel, das sich stromabwärts des Knotens „Knoten aktivieren" befindet und noch nicht ausgeführt wurde, wird ebenfalls in der aktuellen Ausführung ausgeführt.

Siehe auch [Knoten deaktivieren](../nodes/disable-node.md), [Canvas-Funktionen](./canvas-features.md) und [Cron](../nodes/cron-node.md) für Workflow-Steuerungsmuster.

#### [Fehler auslösen](../nodes/throw-error-node.md)

Der Knoten „Fehler auslösen" stoppt die Workflow-Ausführung sofort und gibt eine Fehlerantwort mit einem benutzerdefinierten HTTP-Statuscode zurück. Lege den Ausdruck für die Fehlermeldung und den Statuscode fest (z. B. 400, 401, 403, 404, 429, 500). Verwende ihn für Validierungsfehler, unbefugten Zugriff oder andere Fehlerbedingungen, insbesondere in Kombination mit [Bedingung](../nodes/condition-node.md) und [Fehlerbehandler](../nodes/error-handler-node.md).

Passt zu [Bedingung](../nodes/condition-node.md), [Fehlerbehandler](../nodes/error-handler-node.md) und [Sicherheit](./security.md) für explizite Fehlerpfade.

---

## Referenz

### [Knotentypen](./node-types.md)

Heym bietet eine Vielzahl von Knotentypen: Trigger wie [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) und [Fehlerbehandler](../nodes/error-handler-node.md); AI-Knoten wie [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent-Knoten](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) und [MCP Call](../nodes/mcp-call-node.md); Logik-Knoten wie [Bedingung](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) und [Loop](../nodes/loop-node.md); Daten-Knoten wie [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) und [Heym](../nodes/heym-node.md); Integrationen wie [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [E-Mail senden](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) und [Drive](../nodes/drive-node.md); Automatisierungs-Knoten wie [Crawler](../nodes/crawler-node.md) und [Playwright](../nodes/playwright-node.md); sowie Hilfsmittel wie [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Fehler auslösen](../nodes/throw-error-node.md), [Knoten deaktivieren](../nodes/disable-node.md), [Knoten aktivieren](../nodes/enable-node.md) und [Sticky Note](../nodes/sticky-note-node.md). Verwende Ausdrücke wie `$input.text` und `$nodeLabel.field` in der Knotenkonfiguration.

Siehe auch [Trigger](./triggers.md), [Drittanbieter-Integrationen](./integrations.md) und [Parallele Ausführung](./parallel-execution.md).

### [Ausdrucks-DSL](./expression-dsl.md)

Heym verwendet eine einfache Ausdruckssprache, um auf Daten aus vorgelagerten Knoten zu verweisen. Verwende `$input` für den [Input](../nodes/input-node.md)-Knoten, `$nodeLabel.field` für jeden vorgelagerten Knoten, `$credentials.CredentialName` für [Anmeldedaten](./credentials.md) und `$global.variableName` für [globale Variablen](./global-variables.md). Zu den integrierten speziellen Variablen gehören `$now`, `$UUID` und Workflow-Metadaten: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` und `$executionId` (die ID des Laufs im [Ausführungsverlauf](./execution-history.md) — `/workflows/{id}/{executionId}` öffnet diesen Lauf auf dem Canvas; nur zur Laufzeit verfügbar, im Dialog zur Ausdrucksvorschau leer). Unterstützt werden Literale, Arithmetik, Vergleiche, [Loop](../nodes/loop-node.md)-Kontext, verschachtelte Felder und String-/Array-Hilfsfunktionen (einschließlich `$text.toJson()` zum Parsen eines JSON-Strings). Wenn der vollständige Wert ein einzelner `$expr` ist, bewahrt das Backend Arrays, Objekte, Booleans und Zahlen als native Typen.

Siehe auch [Dialog zur Ausdrucksauswertung](./expression-evaluation-dialog.md), [Globale Variablen](./global-variables.md) und [Workflow-Struktur](./workflow-structure.md).
### [Globale Variablen](./global-variables.md)

Der Globale Variablenspeicher enthält persistente, benutzerspezifische Schlüssel-Wert-Daten, die über Workflow-Ausführungen hinweg bestehen bleiben. Erstelle Variablen im Reiter [Variablen](../tabs/global-variables-tab.md) oder über einen [Variable](../nodes/variable-node.md)-Knoten mit aktivierter Option „Im Globalen Variablenspeicher speichern". Greife in Ausdrücken mit `$global.variableName` darauf zu; sie können mit anderen Benutzern oder [Teams](./teams.md) geteilt werden.

Passt zu [Variable](../nodes/variable-node.md), [Teams](./teams.md) und [Anmeldedaten-Freigabe](./credentials-sharing.md) für gemeinsamen Workflow-Zustand.

### [Dialog zur Ausdrucksauswertung](./expression-evaluation-dialog.md)

Der Dialog zur Ausdrucksauswertung ist ein erweiterbarer Editor, der erscheint, wenn du auf die Schaltfläche zum Erweitern neben Ausdrucksfeldern klickst. Er öffnet sich als großes zentriertes Modal, hält die Autovervollständigung aktiv und aktualisiert die Backend-Vorschauausgabe automatisch, nachdem du mit dem Tippen aufgehört hast. Objekt- und Array-Ergebnisse können mit dem Ausgabepfad-Auswähler durchsucht werden. Der Dialog akzeptiert einen vollzeiligen reinen Punktpfad (zum Beispiel `myNode.output.field`), als wäre er `$myNode.output.field`; siehe die Platzierungsregeln in [Ausdrucks-DSL](./expression-dsl.md).

Die Schaltfläche **Mit KI erstellen** in der Symbolleiste ermöglicht es dir, den gewünschten Ausdruck in Klartext zu beschreiben. Wähle eine LLM-[Anmeldedaten](./credentials.md) und ein Modell, gib eine Beschreibung wie *„Hole den Kundennamen aus der API-Antwort"* ein und klicke auf Generieren. Das Backend sendet den [Ausdrucks-DSL](./expression-dsl.md)-Kontext und die Knotenausgaben des letzten Laufs an das Modell und gibt eine einzelne Ausdruckszeichenfolge zurück. Das Ergebnis wird sofort ausgewertet, sodass du es überprüfen kannst, bevor du auf Anwenden klickst.

Passt natürlich zu [Ausdrucks-DSL](./expression-dsl.md), [Output](../nodes/output-node.md) und [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Workflow-Struktur](./workflow-structure.md)

Workflows werden als JSON mit Knoten und Kanten gespeichert. Das Workflow-Objekt enthält id, name, description, nodes, edges und Authentifizierungseinstellungen. Jeder Knoten hat id, type, position und data (Label und typspezifische Konfiguration). Kanten verbinden Quell- und Ziel-Knoten-IDs mit optionalen Handle-IDs. Die Ausdruckssyntax in Datenfeldern folgt der [Ausdrucks-DSL](./expression-dsl.md), und dieselbe Form wird von [Download & Import](./download-import.md) verwendet.

Siehe auch [Knotentypen](./node-types.md), [Ausdrucks-DSL](./expression-dsl.md) und [Download & Import](./download-import.md).

### [Canvas-Funktionen](./canvas-features.md)

Fahre mit der Maus über einen beliebigen Nicht-Sticky-Canvas-Knoten und klicke auf **Ausführen**, um bis zu diesem Knoten auszuführen. Erforderliche Eingaben öffnen sich im Ausführen-Panel mit dem ersten Feld im Fokus; Pfade ohne Eingaben starten sofort. Siehe [Bis zum Knoten ausführen](./canvas-features.md#run-to-node).

Der Workflow-Editor bietet Data Pin (die letzte Ausgabe eines Knotens anheften, um nachgelagerte Knoten zu testen, ohne erneut auszuführen), Ausführungsprotokolle (Echtzeit-Knotenergebnisse und Agenten-Fortschritt, die den [Ausführungsverlauf](./execution-history.md) ergänzen), Aktivieren/Deaktivieren (Knoten während der Ausführung überspringen) und In Sub-Workflow extrahieren (eine Auswahl in einen neuen Workflow verschieben und durch einen [Execute](../nodes/execute-node.md)-Knoten ersetzen). Eine laufende Produktionsausführung kann aus dem Verlauf oder einer Board-Karte geöffnet werden; der Editor stellt den aktuellen Snapshot wieder her, verbindet sich mit SSE und hält die Canvas-Animation und die Debug-Protokolle live. [Tastaturkürzel](./keyboard-shortcuts.md) unterstützen Kopieren, Einfügen, Ausführen und die Inline-Knotensuche.

Siehe auch [Tastaturkürzel](./keyboard-shortcuts.md), [Bearbeitungsverlauf](./edit-history.md) und [Ausführungsverlauf](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Editor-Demo ansehen</a></p>

### [Tastaturkürzel](./keyboard-shortcuts.md)

Heym bietet Kürzel im gesamten Editor: Befehlspalette (Ctrl+K), Ausführen (Ctrl+Enter), Speichern (Ctrl+S), Rückgängig/Wiederholen und Escape zum Schließen. Auf dem Canvas: Alles auswählen, Mehrfachauswahl, Kopieren/Ausschneiden/Einfügen, Löschen, Knoten aktivieren/deaktivieren umschalten (D), angeheftete Daten umschalten (P) und Inline-Knotensuche durch Tippen. Die Kürzel sind in der In-App-Referenz dokumentiert und arbeiten eng mit [Canvas-Funktionen](./canvas-features.md) wie Data Pin und Knoten aktivieren/deaktivieren zusammen.

Siehe auch [Canvas-Funktionen](./canvas-features.md), [Quick Drawer](./quick-drawer.md) und [Kontextueller Showcase](./contextual-showcase.md).
### [KI-Assistent](./ai-assistant.md)

Der AI Assistant ist ein Chat-Panel, das über das Debug-Panel geöffnet wird und es dir ermöglicht, Workflows mit natürlicher Sprache zu erstellen oder zu ändern. Wähle eine [Anmeldedaten](./credentials.md) und ein Modell aus und beschreibe dann, was du möchtest; die AI streamt eine Antwort und jedes gültige [Workflow-JSON](./workflow-structure.md) in einem Codeblock wird automatisch geparst und auf den Canvas angewendet. Spracheingabe wird in kompatiblen Browsern unterstützt.

Aktiviere den **YOLO-Modus** (Agent-Modus, standardmäßig deaktiviert) und der Assistant testet, was er erstellt. Nach jeder Änderung führt er den Workflow auf dem Canvas aus, liest das Ergebnis und korrigiert den Workflow, bis er das tut, was du verlangt hast, für bis zu 5 Ausführungen pro Nachricht. Er fragt vor der ersten Ausführung nach Testeingaben, kann deine anderen Workflows ausführen, wenn er deren Ergebnis benötigt, und zeigt jeden Schritt während der Arbeit an. Siehe [AI Assistant › YOLO-Modus](./ai-assistant.md#yolo-mode).

Klicken Sie über einem beliebigen Knoten auf der Arbeitsfläche auf **AI**, um genau diesen Knoten zu ändern oder zu reparieren. Das Panel zeigt den bearbeiteten Knoten an (mit seinem letzten Ergebnis, sobald er ausgeführt wurde) und bietet **Change this node as ...**, **Fix error in this node ...** und **Other**. Nur dieser Knoten wird aktualisiert; der Rest des Workflows und das Layout bleiben unverändert. Siehe [KI-Assistent › Einen einzelnen Knoten anpassen](./ai-assistant.md#changing-one-node).

Wenn ein Workflow Datensätze speichert, fragt der Assistant, welche [Datentabelle](../tabs/datatable-tab.md) verwendet werden soll, oder erstellt eine mit den Spalten, die der Workflow benötigt. Siehe [AI Assistant › Datentabellen](./ai-assistant.md#data-tables).

Wenn der aktuelle Workflow [Agent-Knoten](../nodes/agent-node.md)-Skills enthält, sendet der Assistant nur die `SKILL.md` jedes Skills in den Workflow-Kontext. Angehängte `.py`-Dateien und binäre Skill-Assets werden vor der Anfrage ausgeschlossen, damit große Skill-Bundles das Kontextfenster des Modells nicht überlaufen.

Passt gut zu [Chat mit Heym](./chat-with-heym.md), [Agenten-Architektur](./agent-architecture.md) und [Ausdrucks-DSL](./expression-dsl.md).

### [Chat mit Heym](./chat-with-heym.md)

Chat with Heym ist ein Assistant in der Dokumentationskopfzeile für Produktfragen. Er öffnet sich in einem zentrierten Dialog, hält die Anmeldedaten- und Modellauswahl oben sichtbar, fügt den Pfad der aktiven Dokumentationsseite als Kontext ein und löscht den Nachrichtenverlauf, wenn der Dialog geschlossen wird. Er ergänzt den umfassenderen [KI-Assistent](./ai-assistant.md) und den leichteren [Kontextueller Showcase](./contextual-showcase.md).

Siehe auch [KI-Assistent](./ai-assistant.md), [Kontextueller Showcase](./contextual-showcase.md) und [Knotentypen](./node-types.md).

### [Workflow-Organisation](./workflow-organization.md)

Instanzadministratoren (`HEYM_ADMIN_EMAILS`) können auf jeden Workflow zugreifen und ihn bearbeiten, die Workflows eines Eigentümers per E-Mail finden, Zeitpläne und Ausführungsverlauf einsehen, automatische Trigger pausieren und fortsetzen sowie Workflows löschen, sobald Ausführungen abgeschlossen sind. Siehe [Instance Administration](../tabs/workflows-tab.md#instance-administration) für den Offboarding-Ablauf und die Unterscheidung zwischen dem Pausieren automatischer Trigger und dem Blockieren aller Aufrufe.

Workflows können in Ordnern und Unterordnern in einer Baumstruktur organisiert werden. Ordner haben Namen und optional ein übergeordnetes Element; Workflows werden Ordnern zugewiesen. Workflows können zur Löschung geplant werden (in einen Papierkorbbereich verschoben, bevor sie endgültig entfernt werden). Die API unterstützt das Erstellen, Aktualisieren, Löschen und Verschieben von Workflows zwischen Ordnern, und dasselbe Organisationsmodell erscheint im Reiter [Workflows](../tabs/workflows-tab.md).

Siehe auch [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) und [Bearbeitungsverlauf](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Der Quick Drawer ist ein festes Schnellausführungs-Panel auf der rechten Seite für interne Nicht-Canvas-Seiten. Er ermöglicht es dir, [Workflows](../tabs/workflows-tab.md) zu durchsuchen, Favoriten anzuheften, Eingaben auszuwählen, sofort auszuführen und den Fortschritt oder die Ergebnisse zu prüfen, ohne den Editor zu öffnen. Ein Workflow mit einem [File Upload Trigger](../nodes/file-upload-trigger-node.md) nimmt eine abgelegte oder ausgewählte Datei entgegen. Die Reihenfolge der angehefteten Elemente und der zuletzt ausgewählte Workflow werden im Browser gespeichert.

Siehe auch [Workflow-Organisation](./workflow-organization.md), [Tastenkombinationen](./keyboard-shortcuts.md) und [Ausführungsverlauf](./execution-history.md).

### [Kontextueller Showcase](./contextual-showcase.md)

Der Contextual Showcase ist eine kompakte In-App-Führungsschiene für authentifizierte Hauptoberflächen wie Dashboard-Reiter, [Evals](../tabs/evals-tab.md), Docs und den Workflow-Editor. Er bleibt standardmäßig geschlossen, gibt zuerst eine kurze Seitenzusammenfassung, bietet bei Bedarf etwas mehr Detail und verlinkt auf den vollständigen Dokumentationsartikel, wenn du eine tiefergehende Anleitung wünschst.

Passt zu [Chat mit Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) und [KI-Assistent](./ai-assistant.md) für In-App-Führungsabläufe.

### [Credentials](./credentials.md)

Anmeldedaten speichern API-Schlüssel und Secrets, die von Workflow-Knoten verwendet werden. Füge sie im Reiter [Credentials](../tabs/credentials-tab.md) hinzu und referenziere sie per Name oder ID in Knoten wie [LLM](../nodes/llm-node.md), [Agent-Knoten](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) und [Redis](../nodes/redis-node.md). Sie werden im Ruhezustand verschlüsselt, können mit Benutzern oder [Teams](./teams.md) geteilt werden und können auch in [Ausdrucks-DSL](./expression-dsl.md) über `$credentials.Name` referenziert werden.

Siehe auch [Credentials](../tabs/credentials-tab.md), [Freigabe von Anmeldedaten](./credentials-sharing.md) und [Drittanbieter-Integrationen](./integrations.md).

### [Freigabe von Anmeldedaten](./credentials-sharing.md)

Anmeldedaten können per E-Mail mit anderen Benutzern oder mit Teams geteilt werden; alle Teammitglieder erhalten Zugriff, wenn eine Anmeldedaten mit einem Team geteilt wird. Geteilte Anmeldedaten erscheinen mit einem Indikator im Reiter [Credentials](../tabs/credentials-tab.md). Zur Laufzeit führt der Kontext des Workflow-Eigentümers eigene, benutzergeteilte und teamgeteilte Anmeldedaten zusammen. Verwende `$credentials.CredentialName` in Ausdrücken oder setze credentialId in den Knotendaten.

Siehe auch [Credentials](./credentials.md), [Teams](./teams.md) und [Drittanbieter-Integrationen](./integrations.md).
### [Teams](./teams.md)

Teams ermöglichen es dir, Workflows, Anmeldedaten, globale Variablen, Vektorspeicher und Drive-Dateien mit einer Gruppe von Benutzern gleichzeitig zu teilen. Erstelle Teams über den Reiter [Teams](../tabs/teams-tab.md) und füge Mitglieder per E-Mail hinzu. Teile Ressourcen über die entsprechenden Freigabe-Dialoge mit einem Team; alle Mitglieder haben dann Zugriff. Der Ersteller kann das Team bearbeiten und löschen; das Löschen eines Teams entfernt alle Team-Freigaben.

Passt zu [Freigabe von Anmeldedaten](./credentials-sharing.md), [Globale Variablen](./global-variables.md) und [Enterprise](./enterprise.md).

### [Parallele Ausführung](./parallel-execution.md)

Heym führt Knoten parallel aus, wenn sie keine Abhängigkeiten zueinander haben. Der Executor erstellt einen DAG und führt Knoten auf derselben Ebene gleichzeitig mit einem Thread-Pool aus; sobald ein Knoten fertig ist, werden seine nachgelagerten Knoten eingeplant. Verwende den [Merge](../nodes/merge-node.md)-Knoten, um parallele Zweige bei Bedarf zusammenzuführen. Mehrere Workflow-Ausführungen laufen gleichzeitig; jede Ausführung ist isoliert. Der [SSE Streaming](./sse-streaming.md)-Modus sendet Ereignisse, sobald Knoten abgeschlossen sind.

Siehe auch [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) und [Ausführungsverlauf](./execution-history.md).

### [Agenten-Architektur](./agent-architecture.md)

Der [Agent-Knoten](../nodes/agent-node.md) unterstützt Sub-Agenten (Orchestrator ruft andere Agent-Knoten über call_sub_agent auf), Sub-Workflows (Agent ruft andere Workflows über call_sub_workflow auf), Skills (Instruktionsinhalte und Python-Tools aus .zip oder .md) und [MCP](../tabs/mcp-tab.md)-Client-Verbindungen. Der Orchestrator-Tool-Executor leitet Sub-Agenten- und Sub-Workflow-Aufrufe weiter; andere Tools gehen an Python-, MCP- oder Skill-Executors. Die maximale Verschachtelungstiefe für Sub-Agenten und Sub-Workflows beträgt 5. Die Tool-Calling-Schleife beinhaltet automatische Kontextkomprimierung: Vor jeder Iteration wird die Token-Nutzung geschätzt, und wenn sie 80 % des Kontextfensters des Modells überschreitet, werden die mittleren Nachrichten mit demselben Modell zusammengefasst, wobei der System-Prompt, die erste Benutzernachricht und die letzte Benutzernachricht intakt bleiben.

Siehe auch [Agent-Knoten](../nodes/agent-node.md), [Persistenter Agenten-Speicher](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) und [MCP](../tabs/mcp-tab.md).

### [Persistenter Agenten-Speicher](./agent-persistent-memory.md)

Optionaler Wissensgraph pro [Agent-Knoten](../nodes/agent-node.md), der in Postgres gespeichert wird: Entitäten, Typen, Eigenschaften und gerichtete Beziehungen. Wenn `persistentMemoryEnabled` true ist, wird der Graph bei jeder Ausführung in den System-Prompt zusammengefasst; nach erfolgreichen Abschlüssen extrahiert ein [LLM](../nodes/llm-node.md) im Hintergrund strukturierte Aktualisierungen. REST-CRUD befindet sich unter `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Der Editor öffnet sich über das pinke Gehirn-Steuerelement am Knoten.

Siehe auch [Agent-Knoten](../nodes/agent-node.md), [Agenten-Architektur](./agent-architecture.md) und [Traces](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop ermöglicht es einem [Agent-Knoten](../nodes/agent-node.md), an bestimmten Checkpoints eine Genehmigung anzufordern, eine öffentliche `/review/{token}`-Seite zu erstellen und auf einen nicht angemeldeten Prüfer zu warten, der den Markdown-Prüftext akzeptiert, bearbeitet oder ablehnt. HITL-fähige Agenten stellen außerdem einen `review`-Ausgabe-Handle bereit, sodass du [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) oder andere Kanäle benachrichtigen kannst, während die Ausführung aussteht. Der HITL-Text auf Knotenebene wird als Genehmigungsrichtlinien verwendet, während die Zusammenfassung der öffentlichen Seite aus der Prüfanforderung selbst generiert wird. Ausstehende Ausführungen erscheinen sofort im [Ausführungsverlauf](./execution-history.md), können mehr als einmal in derselben Ausführung auftreten und werden aus dem exakt gespeicherten Workflow-Snapshot fortgesetzt, sobald jede Entscheidung übermittelt wurde.

Siehe auch [Agent-Knoten](../nodes/agent-node.md), [Portal](./portal.md), [Ausführungsverlauf](./execution-history.md) und [Send Email](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Workflows können über [HTTP](../nodes/http-node.md) unter `POST /api/workflows/{workflow_id}/execute` ausgelöst oder inkrementell von `POST /api/workflows/{workflow_id}/execute/stream` gestreamt werden. Der Request-Body wird als body an [Input](../nodes/input-node.md)-Knoten übergeben; Header und Query-Parameter sind in [Ausdrucks-DSL](./expression-dsl.md)-Ausdrücken verfügbar. Konfiguriere die Authentifizierung pro Workflow: anonym, JWT oder benutzerdefinierter Header. Optionales Response-Caching, Rate Limiting und der Dialog „Run with cURL" des Editors befinden sich alle am Workflow und gelten für beide Modi.

Siehe auch [Input](../nodes/input-node.md), [Ausführungs-Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) und [Workflow-Struktur](./workflow-structure.md).

### [Ausführungs-Tokens](./execution-tokens.md)

Execution Tokens sind bereichsgebundene JWTs, die Zugriff auf die Execute- und Stream-Endpoints eines einzelnen Workflows gewähren. Wenn ein Workflow die JWT-Authentifizierung verwendet, ermöglichen Tokens externen Skripten, CI-Pipelines und Integrationen, den Workflow aufzurufen, ohne eine Benutzersitzung zu teilen. Jedes Token trägt einen `wid`-Claim, der es an einen Workflow bindet, ein `jti`, das für sofortigen Widerruf verwendet wird, und eine konfigurierbare TTL (60 Sekunden bis 10 Jahre). Erstelle, wähle aus und widerrufe Tokens direkt im Dialog **Run with cURL** — das ausgewählte Token wird automatisch in den generierten Befehl eingebettet.

Siehe auch [Webhooks](./webhooks.md), [Security](./security.md) und [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

Der cURL-Dialog kann die [webhook](./webhooks.md)-Ausführung in den Server-Sent Events-Modus umschalten. Dies erzeugt `execution_started`-, `node_start`-, `node_complete`- und `execution_complete`-Ereignisse in Echtzeit, fügt `--no-buffer` zum generierten cURL-Befehl hinzu und ermöglicht es dir, Startnachrichten pro Knoten wie `[START] LLM` oder benutzerdefinierten Text für externe Terminal-Konsumenten zu konfigurieren.

Siehe auch [Webhooks](./webhooks.md), [Ausführungsverlauf](./execution-history.md) und [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflows werden durch Trigger-Knoten ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), RabbitMQ-Empfang) oder Einstiegspunkte gestartet: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron-Scheduler, Telegram-Webhook, Discord-Interaction-Webhook, IMAP-Trigger-Manager, RabbitMQ-Consumer oder Editor-Ausführung. Jeder Trigger hat seinen eigenen Endpoint oder Hintergrundprozess; [Cron](../nodes/cron-node.md) läuft alle 60 Sekunden, [Telegram Trigger](../nodes/telegram-trigger-node.md)-Knoten empfangen Bot-Webhooks, [Discord Trigger](../nodes/discord-trigger-node.md)-Knoten empfangen signierte Interaction-Webhooks, und [IMAP Trigger](../nodes/imap-trigger-node.md)-Knoten laufen in ihrem konfigurierten Polling-Intervall. [Input](../nodes/input-node.md)-Knoten empfangen Body, Headers und Query aus Webhook-Anfragen.

Siehe auch [Knotentypen](./node-types.md), [Webhooks](./webhooks.md) und [Parallele Ausführung](./parallel-execution.md).

### [Ausführungsverlauf](./execution-history.md)

Der Ausführungsverlauf zeichnet Workflow-Läufe auf: Eingaben, Ausgaben, Knotenergebnisse, Status und Trigger-Quelle. Zugriff erhältst du über die Editor-Toolbar, die Docs-Ansicht, den Dashboard-Header oder die [Evals](../tabs/evals-tab.md)-Ansicht. Der Verlauf pro Workflow zeigt Läufe für den geöffneten Workflow; die All-History-Ansicht zeigt Läufe über Workflows und Chat hinweg. Aktuell laufende Ausführungen erscheinen oben in beiden Dialogen mit den Aktionen **Open live** und **Cancel**. Open live verbindet den Editor über [SSE](./sse-streaming.md) mit der bestehenden Ausführung, stellt abgeschlossene Knoten wieder her, pulsiert die aktuellen und ausstehenden Knoten und hängt Debug-Logs an, ohne einen weiteren Lauf zu starten. Bring to Canvas lädt die Eingaben und Knotenausgaben eines abgeschlossenen Laufs zum erneuten Ausführen oder Debuggen; der Deep-Link `/workflows/{workflowId}/{executionId}` unterstützt sowohl Live- als auch abgeschlossene Ausführungen. Durch [Human-in-the-Loop](./human-in-the-loop.md) pausierte Läufe werden sofort als `pending` gespeichert, einschließlich der öffentlichen Review-URL und aller Benachrichtigungs-Knoten, die aus dem `review`-Branch des Agenten ausgeführt wurden. Wenn der Server mitten im Lauf neu startet, werden unterbrochene Läufe automatisch wiederhergestellt: Sie werden von Grund auf mit denselben Eingaben erneut ausgeführt und als abgeschlossen angezeigt (markiert mit **Recovered**), gesteuert durch einen **Auto-recover runs**-Schalter pro Workflow, der sie stattdessen als `skipped` aufzeichnen kann.

Siehe auch [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) und [Traces](../tabs/traces-tab.md).

### Execution Highlights

Nach einem Live-Lauf — oder nach **Bring to Canvas** — erscheint ein ausblendbares **Execution Highlights**-Popup oben rechts auf dem Canvas, das auflistet, was jeder Knoten in Ausführungsreihenfolge produziert hat. Es ist eine schnelle Möglichkeit, die Ausgabe pro Knoten zu prüfen, ohne jeden Knoten zu öffnen; schließe es mit dem **✕**, und es öffnet sich beim nächsten Lauf erneut. Highlights werden auch bei Dashboard-Läufen angezeigt. Siehe [Ausführungsverlauf](./execution-history.md) für Details.

### [Bearbeitungsverlauf](./edit-history.md)

Der Bearbeitungsverlauf verfolgt gespeicherte Versionen eines Workflows (jedes Speichern erstellt eine Version). Zeige die Liste an, öffne eine Version, um einen Diff gegen den aktuellen Workflow zu sehen ([Knoten](./workflow-structure.md), Kanten, Konfiguration), und stelle mit Revert eine frühere Version wieder her. Anders als der [Ausführungsverlauf](./execution-history.md) verfolgt der Bearbeitungsverlauf Strukturänderungen, nicht Läufe.

Siehe auch [Ausführungsverlauf](./execution-history.md), [Workflow-Struktur](./workflow-structure.md) und [Canvas-Funktionen](./canvas-features.md).

### Error Workflow

Ein Workflow kann einen anderen Workflow bestimmen, der bei einem Fehler ausgeführt wird. Konfiguriere ihn im **Properties**-Panel auf Workflow-Ebene (angezeigt, wenn kein Knoten ausgewählt ist) unter **On error, run workflow**. Nur der Workflow-Eigentümer kann ihn festlegen, ändern oder löschen; siehe [Owner-only settings](./workflow-organization.md#owner-only-settings). Wenn ein Top-Level-Lauf mit einem unbehandelten Fehler endet, wird der ausgewählte Error Workflow ausgeführt und erhält den Fehlerkontext (ID und Name des fehlgeschlagenen Workflows, Lauf-ID, Fehlermeldung, Label und Typ des fehlgeschlagenen Knotens sowie einen Zeitstempel). Wenn der Canvas bereits einen [Error Handler](../nodes/error-handler-node.md)-Knoten enthält, hat der lokale Handler Vorrang und der Error Workflow wird **nicht** aufgerufen. Der Error Workflow selbst läuft direkt, sodass er niemals seinen eigenen Error Workflow auslöst.

Er deckt jeden Nicht-Test-Top-Level-Lauf ab: beide Execute-Endpoints, das [Portal](./portal.md) und jeden Trigger, einschließlich [Cron](../nodes/cron-node.md), der Chat-Plattform-Trigger, E-Mail, Queues, [MCP](../tabs/mcp-tab.md) und Dashboard-Widgets. Mit aktivierter [Lastverteilung](./cluster.md) bleibt dies unverändert, einschließlich Läufen, die ein Worker ausgeführt hat: Der fehlgeschlagene Knoten wird mit dem Ergebnis zurückübertragen, und der Error Workflow wird dann wie jeder andere Lauf verteilt, sodass ein Knoten darin, der auf der Hauptinstanz laufen muss, dies weiterhin tut. Zwei Fälle sind bewusst ausgenommen, weil das Ergebnis des Workflows selbst noch nicht bekannt ist: ein Lauf, den keine Instanz jemals ausgeführt hat, und ein Wait, das abgelaufen ist, während der Lauf möglicherweise noch läuft. Er wird auch **nicht** durch manuelle Canvas-Testläufe ausgelöst.

### Workflow Timeout

Jeder Workflow kann im **Properties**-Panel auf Workflow-Ebene ein **workflow timeout** in Sekunden festlegen. `0` (der Standard) deaktiviert es. Wenn gesetzt, wird ein Lauf, der das Limit überschreitet, an der nächsten Knotengrenze gestoppt und als fehlgeschlagener Lauf mit einem "timed out"-Fehler aufgezeichnet. Das Timeout gilt für manuelle, API- und getriggerte Läufe. Lange [Wait](../nodes/wait-node.md)-Knoten werden zügig unterbrochen, anstatt für ihre volle Dauer zu blockieren.
### Eingesparte Zeit

Jeder Workflow kann eine **geschätzte eingesparte Zeit pro Ausführung** (in Minuten) erfassen, die im **Properties**-Panel auf Workflow-Ebene festgelegt wird. Der Reiter [Analytics](../tabs/analytics-tab.md) aggregiert diese über den ausgewählten Bereich als Gesamtstatistik **Eingesparte Zeit** (Summe der Schätzung jedes Workflows × seiner erfolgreichen Ausführungen). Most Used listet diese Summe ebenfalls pro Workflow auf; **Not Set** öffnet das Schätzungsfeld, wenn es nicht gesetzt ist. Der Bericht [Workflow-Analyse](./workflow-analysis.md) empfiehlt, eine Schätzung festzulegen, wenn keine konfiguriert ist.

### [Einstellungen](./user-settings.md)

Der Dialog Einstellungen (geöffnet über deinen Avatar in der Kopfzeile) hat vier Reiter: Profile (Gravatar-Bild, Anzeigename, User Rules), [Security](./security.md) (Passwort ändern), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) und Observability (schreibgeschützter [OpenTelemetry](./opentelemetry.md)-Status). User Rules sind benutzerdefinierte Anweisungen, die in jede AI-Anfrage eingefügt werden, einschließlich des Workflow-Builders und des [Chat](../tabs/chat-tab.md), sodass du Sprache, Ton, Codestil oder Workflow-Konventionen einmalig festlegen kannst. Passwortrichtlinie und [MCP](../tabs/mcp-tab.md)-API-Key-Verwaltung sind ebenfalls verfügbar.

Siehe auch [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) und [KI-Assistent](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym kann OpenTelemetry-Traces für jede Workflow-Ausführung und jede Knoten-Ausführung ausgeben: einen Root-Span `heym.workflow.execute` pro Ausführung und einen Child-Span `heym.node.execute` pro Knoten, wobei Modell- und Token-Nutzung an LLM- und Agent-Knoten angehängt werden. Spans werden über OTLP/HTTP an jedes kompatible Backend exportiert (Jaeger, Grafana Tempo, Honeycomb, Datadog), und der W3C-Trace-Kontext wird über eingehende Webhooks, ausgehendes HTTP und Sub-Workflows hinweg propagiert. Tracing ist standardmäßig deaktiviert und wird mit `HEYM_OTEL_*` [Umgebungsvariablen](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) konfiguriert; der aktive Status wird im Reiter Observability der [Einstellungen](./user-settings.md) angezeigt.

Siehe auch [Ausführungsverlauf](./execution-history.md), [Traces](../tabs/traces-tab.md) und [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Exportiere den aktuellen Workflow als JSON aus der Editor-Toolbar (Download-Schaltfläche); die Datei enthält Knoten und Kanten. Importiere, indem du eine JSON-Datei auf den Reiter [Workflows](../tabs/workflows-tab.md) ziehst (erstellt einen neuen Workflow) oder auf den Canvas (ersetzt oder führt zusammen). Die JSON muss ein nodes-Array enthalten; name und edges sind optional. Verwende es für Backup, Freigabe oder Migration zwischen Instanzen.

Siehe auch [Workflow-Struktur](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) und [Canvas-Funktionen](./canvas-features.md).

### [Portal](./portal.md)

Das Portal stellt Workflows als öffentliche Chat-UIs unter `/chat/{slug}` bereit. Konfiguriere portal_enabled, slug, optionale Authentifizierung (Portal-Benutzer), Streaming und Datei-Upload pro Workflow. Endbenutzer interagieren über eine Chat-Oberfläche, ohne sich bei Heym anzumelden; Bildausgaben können im Chat angezeigt werden. Portal-Workflows können auch an [Human-in-the-Loop](./human-in-the-loop.md)-Überprüfungsseiten übergeben werden, wenn ein [Agent-Knoten](../nodes/agent-node.md) eine Genehmigung erfordert, während der `review`-Zweig des Agenten Benachrichtigungen an andere Kanäle sendet. Verwende es für interne Tools, kundenorientierte Chatbots und AI-gestützte Formulare.

Siehe auch [Human-in-the-Loop](./human-in-the-loop.md), [Agent-Knoten](../nodes/agent-node.md) und [Drive](./drive.md).

### [Dateigenerierung](./file-generation.md)

Skills können während der Ausführung Dateien wie PDF, DOCX, CSV, JSON und Bilder generieren, indem sie in den `_OUTPUT_DIR`-Workspace schreiben. Heym erfasst diese Dateien automatisch, speichert sie und stellt Download-Metadaten unter `_generated_files` bereit, die dann mit dem [Drive-Knoten](../nodes/drive-node.md) verwaltet oder im Reiter [Drive](../tabs/drive-tab.md) eingesehen werden können.

Siehe auch [Agent-Knoten](../nodes/agent-node.md), [Drive](./drive.md) und [Drive-Knoten](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive ist die gemeinsame Speicher- und Freigabeschicht für Dateien, die von Skills generiert werden. Es ermöglicht dir, Dateien zu durchsuchen, öffentliche oder passwortgeschützte Links zu erstellen, Ablauf- und Download-Limits anzuwenden, Dateien schreibgeschützt mit deinen Teams zu teilen und diese Dateien programmatisch mit dem [Drive-Knoten](../nodes/drive-node.md) oder manuell über den Reiter [Drive](../tabs/drive-tab.md) zu verwalten.

Siehe auch [Drive](../tabs/drive-tab.md), [Dateigenerierung](./file-generation.md) und [Portal](./portal.md).

### [Security](./security.md)

Heym erzwingt eine Passwortrichtlinie (Länge, Großbuchstaben, Kleinbuchstaben, Ziffer), speichert Zugriffstokens in HttpOnly-Cookies und rotiert Refresh-Tokens bei Verwendung. Rate Limiting gilt für Login, Registrierung und [Portal](./portal.md)-Login. [Anmeldedaten](./credentials.md) werden at rest mit AES-256 (Fernet) verschlüsselt. Der [MCP](../tabs/mcp-tab.md)-API-Key wird für die Client-Authentifizierung verwendet; Inhaltssicherheit ist über [Guardrails](./guardrails.md) an [LLM](../nodes/llm-node.md)- und [Agent-Knoten](../nodes/agent-node.md)-Knoten verfügbar. [Ausführungs-Tokens](./execution-tokens.md) bieten pro Workflow begrenzte JWTs für externe Aufrufer.

Siehe auch [Ausführungs-Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) und [Anmeldedaten](./credentials.md).
### [Single Sign-On](./sso.md)

Heym authentifiziert Personen gegenüber jedem externen OpenID Connect-Anbieter - Keycloak, Okta, Entra ID, Auth0, Google - der zur Laufzeit über **Einstellungen → SSO** von einem Instanz-Administrator konfiguriert wird, der in `HEYM_ADMIN_EMAILS` aufgeführt ist. Es werden nur eine Issuer-URL und Client-Anmeldedaten eingegeben; jeder Endpoint stammt aus dem Discovery-Dokument des Anbieters, sodass kein Anbieter fest verdrahtet ist. Die Anmeldung verwendet Authorization Code mit PKCE, und das ID-Token wird gegen die veröffentlichten Schlüssel des Anbieters verifiziert. Konten werden zuerst über `(issuer, subject)` und zweitens über die verifizierte E-Mail zugeordnet, wobei die optionale automatische Bereitstellung auf eine Allowlist von E-Mail-Domains beschränkt ist. Die Passwort-Anmeldung bleibt neben SSO verfügbar und kann deaktiviert werden, sobald ein Verbindungstest erfolgreich ist, wobei Konten aus `HEYM_ADMIN_EMAILS` ausgenommen sind, damit ein falsch konfigurierter Anbieter die Instanz nicht aussperren kann.

Siehe auch [Einstellungen](./user-settings.md), [Sicherheit](./security.md) und [Audit-Protokollierung](./audit.md).

### [Lastverteilung](./cluster.md)

Richte eine zweite Heym-Instanz auf dieselbe Datenbank und sie tritt als Worker bei. Hintergrundausführungen - Cron, Webhooks, MCP-Tool-Aufrufe, Chat-Trigger - werden zwischen den Instanzen nach einem Prozentsatz aufgeteilt, den ein Instanz-Administrator unter **Einstellungen → Instanzen** festlegt, wobei Status, Datenbanklatenz und Version jeder Instanz in einer Tabelle angezeigt werden. Die Instanzen kommunizieren nie miteinander: Postgres trägt die Arbeit, sodass ein Worker keinen offenen Port und keine Route zurück zur Hauptinstanz benötigt. Arbeit, die lokale Dateien, einen Coding-Agent-Workspace oder ein installiertes Plugin berührt, läuft immer auf der Hauptinstanz, und das Panel meldet, wie viel der letzten 24 Stunden das war, sodass ein Betreiber sehen kann, wann Prozentsätze nicht helfen können. Jede Ausführung im Verlauf nennt die Instanz, die sie ausgeführt hat, und beide Verlaufsdialoge können danach filtern.

Siehe auch [Einstellungen](./user-settings.md), [Ausführungen](../tabs/traces-tab.md) und [Analytik](../tabs/analytics-tab.md).

### [Drittanbieter-Integrationen](./integrations.md)

Heym verbindet sich mit externen Diensten über Anmeldedaten, die im Reiter [Anmeldedaten](../tabs/credentials-tab.md) gespeichert sind (im Ruhezustand verschlüsselt). Unterstützte Typen umfassen OpenAI, Google, Decision Model für den [Decision-Knoten](../nodes/decision-node.md), Model Router für die automatische Modellauswahl (siehe unten), GitHub für den [GitHub-Knoten](../nodes/github-node.md) und MCP-Integrationen, Jira für den [Jira-Knoten](../nodes/jira-node.md), Notion für den [Notion-Knoten](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP für [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header und FlareSolverr für [Crawler](../nodes/crawler-node.md). Jeder Typ dokumentiert die erforderlichen Felder; Anmeldedaten können mit Benutzern oder [Teams](./teams.md) geteilt und in Knoten über den Namen oder als `$credentials.Name` in Ausdrücken referenziert werden.

### Model Router (Auto Model)

Eine **Model Router**-Anmeldedaten wählt das Modell pro Anfrage aus, anstatt einen Schlüssel zu halten. Sie
speichert eine Decision-Model-Anmeldedaten plus eine Liste deiner vorhandenen OpenAI/Google/Custom-
Anmeldedaten, jeweils mit Kriterien, die angeben, wann sie verwendet werden sollen, und erscheint in jedem Modell-
Picker mit einem einzigen Modell namens **Auto**.

Ausführungen, das Canvas Execution Log und die Span View zeigen beide Hälften
der Auswahl, zum Beispiel `Auto Model / GPT-5`, während die Kosten weiterhin dem Modell zugeordnet bleiben, das ausgeführt wurde. Auto
Model kann nicht mit der Responses API, dem Batch-Modus oder der Bildausgabe kombiniert werden. Siehe
[Anmeldedaten](./credentials.md) für das vollständige Verhalten.

Siehe auch [Anmeldedaten](./credentials.md), [Anmeldedaten-Freigabe](./credentials-sharing.md) und [Teams](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blockieren unsichere oder unerwünschte Benutzernachrichten, bevor sie einen [LLM](../nodes/llm-node.md) oder [Agent-Knoten](../nodes/agent-node.md) erreichen. Aktiviere sie pro Knoten und wähle Kategorien zum Blockieren aus (z. B. Gewalt, Hassrede, sexuelle Inhalte, Selbstverletzung, Belästigung, illegale Aktivitäten). Lege die Sensitivität fest (niedrig, mittel, hoch). Wenn sie ausgelöst werden, wirft der Knoten einen Fehler, den du mit einem [Error Handler](../nodes/error-handler-node.md) abfangen kannst. Die Erkennung verwendet je nach Anmeldedaten-Typ die Moderation-API des Anbieters oder die LLM-Klassifizierung.

Siehe auch [Sicherheit](./security.md), [LLM](../nodes/llm-node.md), [Agent-Knoten](../nodes/agent-node.md) und [Error Handler](../nodes/error-handler-node.md).

### [Enterprise](./enterprise.md)

Enterprise umfasst kommerzielle Lizenzierung, professionellen Support und Deployment-Dienste für Teams, die Heym in der Produktion betreiben. Es beinhaltet Hilfe bei der Workflow-Architektur, Onboarding, Kubernetes- und Skalierungsberatung, Priority-Support und kundenspezifische Entwicklung rund um erweiterte Funktionen wie [Agent-Knoten](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallele Ausführung](./parallel-execution.md) und [Portal](./portal.md).

Siehe auch [Betrieb & Deployment](../getting-started/running-and-deployment.md), [Sicherheit](./security.md) und [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work ist eine zweite Oberfläche für Business-Teams auf Basis von Heym. Nutzer beschreiben eine Aufgabe, beantworten ein paar Fragen und erhalten einen getesteten Workflow – anschließend arbeiten sie über Seiten, Freigaben und eine Aktivitätsliste, in der jeder Lauf einen Namen trägt. Instanz-Administratoren verbinden es unter **Einstellungen → Heym Work** über seine Adresse und einen Integrationsschlüssel; es verfügt über eine eigene Lizenz vom Heym-Team.

Siehe auch [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) und [Human-in-the-Loop](./human-in-the-loop.md).

---

## Dashboard-Reiter
### [Workflows](../tabs/workflows-tab.md)

Der Reiter Workflows ist die Standard-Dashboard-Ansicht. Er zeigt eine zweigeteilte Auflistung: Workflows und Ordner als kompakte Zeilen auf der linken Seite und eine Vorschau des ausgewählten Workflows auf der rechten Seite mit seinem Trigger, der letzten Ausführung und den Schritten sowie Open Workflow und Run Now. Jede Zeile trägt ein Status-Chip (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), nach dem das Status-Dropdown filtern kann. Ein Workflow ohne Trigger-Knoten wird danach benannt, wie seine letzte Ausführung gestartet wurde – API für einen HTTP-Aufruf, SubWorker für einen übergeordneten Workflow, Portal für seinen öffentlichen Chat – und bleibt Manual, bis er ausgeführt wurde. Ordner und Unterordner übernehmen die [Organisation](./workflow-organization.md). Erstelle Workflows mit New Workflow, ziehe JSON per Drag and Drop zum [Importieren](./download-import.md) hinein und bearbeite oder lösche sie über die Zeilenaktionen. Workflows können zwischen Ordnern verschoben werden; das Löschen wird geplant (Papierkorb) vor der endgültigen Entfernung.

Siehe auch [Workflow-Organisation](./workflow-organization.md), [Download & Import](./download-import.md) und [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Workflows-Demo ansehen</a></p>

### [Board](../tabs/board-tab.md)

Ein agentisches Kanban-Board, bei dem Karten dauerhafte Jobs sind. Konfiguriere jede Spalte mit einer geordneten Workflow-Kette; das Verschieben einer Karte in die Spalte führt die Kette mit dem vollständigen Kontext der Karte aus (Inhalt, Kommentare, Verlauf, vorherige Ausgaben). Ergebnisse werden auf die Karte zurückgeschrieben – grün bei Erfolg, rot bei Fehler, bernsteinfarben während der Ausführung. Folge-Runden führen die Kette der aktuellen Spalte mit allem bisher Angesammelten erneut aus, was iteratives Planen ermöglicht. Ausführungen werden im [Ausführungsverlauf](./execution-history.md) mit der Trigger-Quelle `board` aufgezeichnet. Während eine Kartenausführung aktiv ist, öffnet **Open live** genau diese Ausführung auf dem animierten Canvas mit inkrementellen Debug-Logs.

Siehe auch [Workflows](../tabs/workflows-tab.md), [Ausführungsverlauf](./execution-history.md) und [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Vorlagen](../tabs/templates-tab.md)

Der Reiter Vorlagen ermöglicht es dir, Workflow-Vorlagen (vollständige Workflows) und Knoten-Vorlagen (einzelne konfigurierte Knoten) zu speichern und wiederzuverwenden. Erstelle Workflow-Vorlagen aus dem Editor (Share as Template) und Knoten-Vorlagen durch Rechtsklick auf einen Knoten. Durchstöbere nach Sichtbarkeit (Everyone oder Specific users/[Teams](./teams.md)), wende eine Vorlage an, um einen neuen Workflow zu erstellen oder einen Knoten zum Canvas hinzuzufügen, und verwalte deine geteilten Vorlagen.

Siehe auch [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) und [Canvas-Funktionen](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Vorlagen-Demo ansehen</a></p>

### [Variablen](../tabs/global-variables-tab.md)

Der Reiter Variablen verwaltet den [Globalen Variablenspeicher](./global-variables.md). Erstelle, bearbeite und lösche globale Variablen; lege Name, Wert und Werttyp fest (Auto, String, Number, Boolean, Array, Object). Variablen sind benutzerspezifisch und bleiben über Ausführungen hinweg erhalten. Referenziere sie in jedem Workflow-[Ausdruck](./expression-dsl.md) als `$global.variableName`. Variablen können mit anderen Benutzern oder [Teams](./teams.md) geteilt werden.

Siehe auch [Globale Variablen](./global-variables.md), [Variable](../nodes/variable-node.md) und [Ausdrucks-DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Variablen-Demo ansehen</a></p>
### [Chat](../tabs/chat-tab.md)

Der Reiter Chat ist Heyms Oberfläche für langlaufende Agenten, um den Workspace per Konversation zu bedienen. Wähle eine [Anmeldedaten](./credentials.md) und ein Modell aus und bitte dann den Chat, Fragen zu beantworten, Workflow-Definitionen zu inspizieren, bestehende Workflows auszuführen, Ausführungen und Zeitpläne zusammenzufassen, den Verlauf der Ausführungen eines einzelnen Workflows zu melden (Anzahl der Ausführungen, Statusaufschlüsselung, letzte Ausführung und auf Anfrage die Details einer Ausführung), zu melden, welche Ausführungen gerade jetzt laufen (mit verstrichener Zeit, aktuellem Knoten und einem Link zu jeder laufenden Ausführung), ausstehende menschliche Reviews aufzulösen, Workflows mit derselben AI Builder-Engine zu erstellen und zu überarbeiten, die auch im Editor verwendet wird, oder Karten in natürlicher Sprache zu Kanban-Boards hinzuzufügen. Neue Karten beginnen immer in der ersten Spalte des ausgewählten Boards; wenn mehrere Boards verfügbar sind und keines genannt wurde, zeigt der Chat vor dem Erstellen der Karte eine Board-Auswahl an.

Der Chat läuft im Backend weiter, nachdem der Browser geschlossen wurde. Während eine Antwort gestreamt wird, kannst du weitere Nachrichten senden; Heym speichert sie in einer datenbankgestützten Warteschlange, lässt dich in der Warteschlange befindliche Nachrichten bearbeiten oder löschen, bevor sie starten, und führt sie der Reihe nach aus, wenn die aktuelle Antwort abgeschlossen ist. Wenn der Assistent Planungsdetails benötigt und Klärungsfragen zurückgibt, pausiert die Warteschlange, bis du diese Fragen beantwortest, und wird dann nach der Planungsantwort fortgesetzt.

Antworten werden mit Markdown, Inline-Bildern, Workflow-Vorschaukarten, einklappbaren Tool-Call-Karten, Kontextnutzung und automatischer Kontextkomprimierung gestreamt. Der Chat unterstützt Anhänge, Spracheingabe, Vorlese-Wiedergabe, Kopieraktionen, Schnell-Prompts, Benutzerregeln aus den [Einstellungen](./user-settings.md) und [globale Variablen](./global-variables.md) als Kontext.

Siehe auch [KI-Assistent](./ai-assistant.md), [Anmeldedaten](./credentials.md) und [Einstellungen](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Chat-Demo ansehen</a></p>

### [Anmeldedaten](../tabs/credentials-tab.md)

Der Reiter Anmeldedaten verwaltet API-Schlüssel und Secrets, die von Knoten verwendet werden. Füge Anmeldedaten nach Typ hinzu (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere usw.), benenne sie und referenziere sie in Workflow-Knoten. Bearbeite oder lösche sie über die Karte; teile sie mit Benutzern per E-Mail oder mit [Teams](./teams.md). Alle Werte werden im Ruhezustand verschlüsselt und in der UI maskiert.

Siehe auch [Anmeldedaten](./credentials.md), [Anmeldedaten teilen](./credentials-sharing.md) und [Drittanbieter-Integrationen](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Anmeldedaten-Demo ansehen</a></p>

### [Vektorspeicher](../tabs/vectorstores-tab.md)

Der Reiter Vektorspeicher verwaltet Vektorspeicher, die von [RAG](../nodes/rag-node.md)-Knoten verwendet werden. Erstelle einen Speicher mit einem Namen und einer Vektorspeicher-[Anmeldedaten](./credentials.md) — *RAG: Qdrant + OpenAI* (externes Qdrant) oder *RAG: Psql + OpenAI* (Heyms eigenes Postgres via pgvector), was das Backend des Speichers festlegt — lege optional einen Collection-Namen fest und lade dann Dokumente hoch (PDF, TXT usw.). Verwalte Inhalte (Quellen anzeigen, löschen), bearbeite Speicherdetails und teile Speicher mit Benutzern. Wähle in einem [RAG](../nodes/rag-node.md)-Knoten die Database aus, wähle den Vektorspeicher und führe Insert-, Upsert-, Delete- oder Search-Operationen aus.

Siehe auch [Qdrant RAG](../nodes/rag-node.md), [Anmeldedaten](./credentials.md) und [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vektorspeicher-Demo ansehen</a></p>
### [MCP](../tabs/mcp-tab.md)

Der MCP-Reiter konfiguriert die Integration des Model Context Protocol. Heym unterstützt zwei Modi:

**Standard-Server** – Ein einzelner Endpoint unter `/api/mcp/sse` stellt alle MCP-fähigen Workflows bereit. Zeige deinen API-Schlüssel an und generiere ihn neu, kopiere einsatzbereites Client-JSON, verbinde Cursor mit einem Klick oder folge dem Claude-Einrichtungsablauf mit automatischer OAuth-Registrierung.

**Benannte Server** – Erstelle mehrere isolierte MCP-Endpoints, jeder mit seiner eigenen UUID-basierten URL (`/api/mcp/servers/{uuid}/sse`) und einem unabhängigen API-Schlüssel. Weise jedem Server bestimmte Workflows zu, sodass verschiedene AI-Clients oder Teams nur die Tools sehen, die sie benötigen. Jeder benannte Server unterstützt dieselben Authentifizierungsmethoden (API-Schlüssel, Claude OAuth) und verfügt über eigene Verknüpfungen zum Kopieren von JSON und zum Hinzufügen zu Cursor. Beide Endpoints unterstützen SSE-Transport (GET) und Streamable HTTP-Transport (POST). Das Umschalten eines Workflows innerhalb eines benannten Servers verschiebt ihn an den Anfang der zugewiesenen Liste, damit die geänderte Zeile im Blick bleibt.

**Heym-Chat-Tool** – Beide Modi können außerdem die [Chat](../tabs/chat-tab.md)-Engine als einzelnes `heym_chat`-Tool bereitstellen, pro Oberfläche umschaltbar mit eigener LLM-Anmeldedaten und eigenem Modell (vorbefüllt aus deinem bevorzugten Modell in den [Einstellungen](./user-settings.md)). Ein MCP-Client sendet eine einzige natürlichsprachliche `message` und die Engine erledigt den Rest: Erstellen von Workflows im Build-Modus (Speichern, bis zu fünfmaliges Testen, Korrigieren und Verifizieren), Ausführen von Workflows, Analytics, Ausführungen, Live-Ausführungsstatus, Zeitpläne, Boards und Karten, Teams, globale Variablen, Dokumentationssuche und Human-in-the-Loop-Entscheidungen. Funktionen, die später zum Chat hinzugefügt werden, sind über dasselbe Tool ohne zusätzliche Registrierung erreichbar. Jeder Aufruf wird im Verlauf des Chat-Reiters als mit einem Stecker markierte Konversation gespeichert und gibt eine `conversation_id` zurück, die der Client übergeben kann, um den Thread fortzusetzen.

Siehe auch [Agenten-Architektur](./agent-architecture.md), [Agent-Knoten](../nodes/agent-node.md) und [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCP-Demo ansehen</a></p>

### [Traces](../tabs/traces-tab.md)

Der Traces-Reiter zeigt [LLM](../nodes/llm-node.md)-Ausführungs-Traces. Ein Statistik-Header über der Liste fasst den ausgewählten Zeitraum mit KPI-Karten zusammen (Aufrufe, Tokens, Kosten, Durchschnittliche Latenz, Fehler-%) sowie drei Diagrammen — Tokens nach Modell, Kosten nach Modell und Aufrufe im Zeitverlauf (gestapelt Erfolg vs. Fehler). Ein einzelner **Zeitraum**-Selektor (1h / 24h / 7d / 30d / Alle; Standard 7 Tage) filtert sowohl die Diagramme als auch die Liste gemeinsam. Die Kosten werden aus der benutzerspezifischen [LLM-Kostentabelle](../tabs/datatable-tab.md#llm-cost-table-system-table) berechnet; Modelle ohne Preisangabe werden als Inline-Warnung angezeigt, die dorthin verlinkt. Öffne einen beliebigen Trace, um Request- und Response-Payloads, die zeitliche Aufschlüsselung (llm_ms, tools_ms, mcp_list_ms), Tool-Aufrufe (Name, Argumente, Ergebnis) und enthaltene Skills zu sehen. Erweiterte Ereignisse zeigen JSON — einschließlich MCP- und JSON-RPC-Payloads — als zusammenklappbaren Baum mit standardmäßig geöffneter erster Ebene; **Tree / Raw** wechselt zurück zum Originaltext und fehlerhaftes JSON bleibt lesbar. Verwende Traces, um das Verhalten von [Agent-Knoten](../nodes/agent-node.md) und [LLM](../nodes/llm-node.md) zu debuggen und Payloads zu kopieren oder zu exportieren.

Siehe auch [Ausführungsverlauf](./execution-history.md), [Agent-Knoten](../nodes/agent-node.md) und [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Traces-Demo ansehen</a></p>

### [Alerts](../tabs/alerts-tab.md)

Der Alerts-Reiter definiert Schwellenwertbedingungen über ein Zeitfenster und teilt dir mit, wenn sie überschritten werden. Vier Warnungstypen decken die Fragen ab, die Betreiber tatsächlich stellen: **Fehlerschwellenwert** (ist dies mehr als N-mal im Fenster fehlgeschlagen), **Workflow-Dauer** (wurden die Ausführungen langsamer, gemessen als Maximum, Durchschnitt oder p95), **Token- / USD-Kosten** (hat die Ausgabe ein Budget überschritten, aufgelöst über dieselbe Preistabelle wie bei [Traces](../tabs/traces-tab.md)) und **Ausführungsanzahl** (lief dies viel häufiger als es sollte). Jeder Typ wird über ein von dir gewähltes Fenster beurteilt, niemals anhand eines einzelnen Ereignisses, denn eine fehlgeschlagene Ausführung ist Rauschen und ein Ausbruch ist ein Vorfall. Warnungen überwachen einen Workflow oder jeden Workflow, auf den du zugreifen kannst.

Ein fünfstufiger Assistent führt durch Typ, Umfang, Bedingung, Reaktion und Überprüfung. Der Überprüfungsschritt **backtestet** die Bedingung zuerst und meldet, wie oft sie in den letzten 24 Stunden bis 7 Tagen ausgelöst hätte, sodass ein viel zu niedriger Schwellenwert erkannt wird, bevor er gespeichert wird, statt danach jemanden zu benachrichtigen. Beschreibe in einfacher Sprache, was du möchtest, und AI füllt jeden Schritt aus, den sie kann, und markiert ihre Vermutungen; eine teilweise Anfrage bringt den Assistenten trotzdem voran und öffnet bei dem ersten Schritt, der noch eine Entscheidung benötigt, statt dich von vorne beginnen zu lassen. Standardmäßig löst eine Warnung einmal aus und bleibt still, bis sich die Metrik erholt; alternativ kannst du sie in einem Intervall wiederholen lassen.

Im Reaktionsschritt kann eine Warnung einen neuen Workflow erstellen und zuweisen, der beim Auslösen ausgeführt wird, einen bereits vorhandenen verwenden oder nichts tun. Die auslösende Payload enthält den beobachteten Wert, den Schwellenwert, das Fenster und die Workflows, die zu der Zahl beigetragen haben, wodurch Warnungen Slack, E-Mail oder Telegram über Knoten erreichen, die du bereits hast. Der Auslöseverlauf zeichnet auf, was in dem Moment wahr war, als jede Warnung ausgelöst wurde, und wird 90 Tage lang aufbewahrt; das Bestätigen einer Auslösung ändert das Badge von Firing zu Acknowledged, ohne vorzutäuschen, dass die Bedingung geklärt ist. Der [Chat](../tabs/chat-tab.md)-Reiter kann beantworten, welche Warnungen existieren und warum oder wann eine ausgelöst wurde. Warnungen können mit Benutzern und [Teams](../tabs/teams-tab.md) geteilt werden.

Siehe auch [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md) und [Ausführungsverlauf](./execution-history.md).
### [Analytics](../tabs/analytics-tab.md)

Der Reiter Analytics zeigt Ausführungsmetriken und Trends. Die Zusammenfassungsstatistiken umfassen Gesamtausführungen, Erfolgsrate, Fehlerrate, Latenzaufschlüsselungen und die gesamte **Time Saved** (die Summe der geschätzten eingesparten Minuten pro Lauf jedes Workflows × seine erfolgreichen Läufe). Most Used listet dieselbe Summe pro Workflow auf. Wähle einen Basiszeitraum (24h, 7d, 30d oder alle), filtere optional nach Workflow und ziehe dann über ein beliebiges Diagramm, um in einen ausgewählten Datumsbereich einzutauchen. Diagramme und Workflow-Tabellen werden auf die Auswahl aktualisiert, und die automatische Aktualisierung hält die Metriken aktuell. Sie ergänzt den [Ausführungsverlauf](./execution-history.md) und die [Scheduled](../tabs/scheduled-tab.md)-Ansicht, wenn du sowohl vergangene Ergebnisse als auch bevorstehende Läufe benötigst.

Siehe auch [Ausführungsverlauf](./execution-history.md), [Scheduled](../tabs/scheduled-tab.md) und [Evals](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Analytics-Demo ansehen</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Der Reiter Dashboard ist ein Bereich im Grafana-Stil, in dem du Raster aus Chart-Widgets erstellst, die jeweils aus einem eigenen verborgenen Heym-Workflow gerendert werden. Halte so viele Dashboards, wie du benötigst, und teile jedes einzelne mit Benutzern oder Teams, schreibgeschützt oder bearbeitbar; Widgets werden immer mit den Anmeldedaten des Eigentümers ausgeführt, sodass jeder dieselben Daten sieht. Beschreibe eine Metrik in einfacher Sprache und die KI generiert das Widget, oder füge eines manuell hinzu und wähle einen Diagrammtyp, der mit Beispieldaten in der Vorschau angezeigt wird: Balken, Linie, Fläche, Kreis, Tabelle, numerisch, Gauge, Streudiagramm, Proportion, Balken-Gauge, Text oder HITL. HITL ist ein Karussell deiner ausstehenden menschlichen Überprüfungen. Die Kopfzeile zeigt `1/n pending`. Der Workflow-Name öffnet diesen Lauf auf dem Canvas. **Approve**, **Request changes** und **Reject** lösen ihn auf, und das Verlaufssymbol neben dem Widget-Titel öffnet diesen Lauf im Verlaufsdialog auf derselben Seite. Widgets cachen ihre Ergebnisse, können mit KI feinabgestimmt werden (jede Änderung wird im [Bearbeitungsverlauf](./edit-history.md) gespeichert), zusammen mit ihrem vollständigen Workflow geklont, mit Tidy up neu angeordnet und im Bearbeitungsmodus gezogen oder in der Größe geändert werden. Tabellen können Status-Chips anzeigen und ihre Zeilen mit einem Detail-Dashboard verknüpfen, das den Datensatz der angeklickten Zeile als `$page.record` liest, und ein Run-Widget führt einen Workflow direkt vom Dashboard aus: über eine abgelegte Datei, mit seinen Eingabefeldern oder über eine Schaltfläche „Ausführen“. Da jedes Widget ein Workflow ist, können alle Daten, die du abrufen kannst – ein [HTTP](../nodes/http-node.md)-Aufruf, eine [BigQuery](../nodes/bigquery-node.md)-Abfrage, ein [RAG](../nodes/rag-node.md)-Lookup oder eine [LLM](../nodes/llm-node.md)-Ausgabe – zu einem Diagramm werden. Die Einstellungen eines HITL-Widgets können es auf die Prüfungen eines einzelnen Workflows oder auf einen Agent- oder Slack-Freigabeschritt darin eingrenzen; ein solches Widget zeigt sie allen an, die diesen Workflow öffnen können, und ist für alle anderen verborgen.

Siehe auch [Diagramm-Ausgabe](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md) und [Ausführungsverlauf](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Dashboard-Demo ansehen</a></p>

### [Evals](../tabs/evals-tab.md)

Der Reiter Evals (unter `/evals`) ermöglicht es dir, Evaluierungs-Suites zu erstellen, Testfälle hinzuzufügen oder zu generieren, den Suite-Prompt zu optimieren und Evaluierungen gegen [Agent-Knoten](../nodes/agent-node.md)-Workflows auszuführen. Wähle ein oder mehrere Modelle, wähle eine Bewertungsmethode (Exact Match, Contains oder LLM-as-Judge), lasse optional ein separates Modell oder ein [Decision Model](../nodes/decision-node.md) die LLM-as-Judge-Antworten bewerten, lege Läufe pro Test fest (plus Temperatur und Reasoning-Aufwand für Exact Match und Contains) und vergleiche dann Bestanden/Nicht bestanden und die Ausgaben pro Modell. Überprüfe den Ausführungsverlauf vergangener Evaluierungen, einschließlich des Judges, den jeder Lauf verwendet hat, führe einen mit demselben Judge erneut aus, exportiere ihn als JSON und überprüfe das zugrunde liegende Verhalten in [Traces](../tabs/traces-tab.md).

Siehe auch [Agent-Knoten](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md) und [Ausführungsverlauf](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evals-Demo ansehen</a></p>

### [Teams](../tabs/teams-tab.md)

Der Reiter Teams ermöglicht es dir, Teams zu erstellen und zu verwalten. Erstelle ein Team, füge Mitglieder per E-Mail hinzu und entferne Mitglieder (der Ersteller kann nicht entfernt werden). Teile [workflows](../tabs/workflows-tab.md), [templates](../tabs/templates-tab.md), [credentials](../tabs/credentials-tab.md), [Variablen](../tabs/global-variables-tab.md), [vector stores](../tabs/vectorstores-tab.md) und [Drive files](../tabs/drive-tab.md) mit Teams über ihre jeweiligen Freigabedialoge; alle Teammitglieder erhalten Zugriff. Bearbeite den Teamnamen und die Beschreibung oder lösche das Team (entfernt alle Team-Freigaben).

Siehe auch [Teams](./teams.md), [Freigabe von Anmeldedaten](./credentials-sharing.md) und [Workflow-Organisation](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Teams-Demo ansehen</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

Der Reiter Scheduled zeigt alle aktiven [Cron](../nodes/cron-node.md)-Workflows in einem visuellen Kalender. Wechsle zwischen Tages-, Wochen- und Monatsansicht, um zu sehen, wann deine Automatisierungen zur Ausführung geplant sind, und springe dann zurück zum zugehörigen [workflow](../tabs/workflows-tab.md), wenn du den Zeitplan bearbeiten musst.

Siehe auch [Cron](../nodes/cron-node.md), [Analytics](../tabs/analytics-tab.md) und [Ausführungsverlauf](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Scheduled-Demo ansehen</a></p>
### [Logs](../tabs/logs-tab.md)

Der Reiter Logs zeigt Docker-Container-Logs für den Heym-Stack (Backend, Frontend, PostgreSQL). Wähle Container aus, filtere nach Log-Level (All, INFO, WARNING, ERROR, DEBUG) und suche innerhalb der Logs. Verwende ihn zum Debuggen und zur Fehlerbehebung. Für Workflow-Ausführungslogs (Knoten-Ergebnisse, Ausgaben) verwende stattdessen den [Ausführungsverlauf](./execution-history.md), [Traces](../tabs/traces-tab.md) oder das Debug-Panel im Editor.

Siehe auch [Ausführungsverlauf](./execution-history.md), [Traces](../tabs/traces-tab.md) und [Canvas-Funktionen](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Logs-Demo ansehen</a></p>

### [DataTable](../tabs/datatable-tab.md)

Der Reiter DataTable ermöglicht es dir, strukturierte Datentabellen innerhalb von Heym zu erstellen und zu verwalten. Definiere typisierte Spalten (string, number, boolean, date, JSON), verwalte Zeilen mit Inline-Bearbeitung per Doppelklick, importiere/exportiere CSV und teile Tabellen mit Benutzern oder [Teams](./teams.md) mit Lese-/Schreibberechtigungen. Verwende den [DataTable-Knoten](../nodes/datatable-node.md), um programmatisch in Workflows auf Tabellen zuzugreifen. Ein angepinnter Abschnitt **System tables** oben beherbergt die **LLM Cost Table**: eine Ansicht mit festem Schema der Preise pro Modell, die im Hintergrund von Helicone befüllt wird (24-Stunden-TTL, manuelles Refresh), wobei jeder Benutzer Preise überschreiben oder benutzerdefinierte Zeilen für Modelle hinzufügen kann, die Helicone nicht auflistet. Diese Preisregeln steuern die Kosten-KPI und das Kosten-diagramm pro Modell im Reiter [Traces](../tabs/traces-tab.md).

Siehe auch [DataTable-Knoten](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Workflow-Struktur](./workflow-structure.md) und [Teams](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ DataTable-Demo ansehen</a></p>

### [Drive](../tabs/drive-tab.md)

Der Reiter Drive zeigt alle Dateien, die von Skills in deinen Workflows generiert wurden. Er listet jede Datei mit Name, Typ, Größe, Quell-Knoten, Erstellungsdatum und Team-Sharing-Status auf und bietet Suche, authentifizierten Download, Teilen, Löschen und Paginierungssteuerung. Er ist der Dashboard-Begleiter zu [Dateigenerierung](./file-generation.md), der [Drive](./drive.md)-Referenz und dem [Drive-Knoten](../nodes/drive-node.md).

Siehe auch [Drive](./drive.md), [Dateigenerierung](./file-generation.md) und [Drive-Knoten](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Drive-Demo ansehen</a></p>
