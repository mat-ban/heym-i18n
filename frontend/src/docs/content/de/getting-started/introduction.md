# Einführung

**Erstellen Sie agentenbasierte Systeme. Betreiben Sie sie mit Zuverlässigkeit.**

Heym ist die Infrastruktur für den Betrieb und die Steuerung von KI-Agenten in Produktionsumgebungen. Orchestrieren Sie Agenten, automatisieren Sie Geschäftsprozesse, überprüfen Sie jede Ausführung und behalten Sie stets die menschliche Kontrolle. Deployen Sie Heym auf Ihrer eigenen Infrastruktur.

In Heym definiert ein Workflow, wie Agenten, deterministische Schritte, Tools und Daten zusammenarbeiten. Die Laufzeitumgebung führt diesen Graphen aus, zeichnet jeden Lauf auf und pausiert für ein menschliches Review (Human-in-the-Loop), wo immer Sie es festlegen. Auf dem visuellen Canvas erstellen und inspizieren Sie Workflows, und dieselben Workflows laufen auch über APIs, Zeitpläne, Event-Trigger, MCP-Clients und Portal-Chats. Besuchen Sie [heym.run](https://heym.run) für die Produktseite und lesen Sie [Warum Heym](./why-heym.md) darüber, was Heym in jeder Phase des Agenten-Lebenszyklus leistet.

## Was Sie tun können

- **Erstellen** – Kombinieren Sie Agenten und deterministische Schritte auf dem [Canvas](../reference/canvas-features.md) im Reiter [Workflows](../tabs/workflows-tab.md), beschreiben Sie sie dem [KI-Assistenten](../reference/ai-assistant.md) oder starten Sie mit [Vorlagen](../tabs/templates-tab.md)
- **Orchestrieren** – Koordinieren Sie [Agent-](../nodes/agent-node.md), [LLM-](../nodes/llm-node.md) und [RAG-Knoten](../nodes/rag-node.md), [Sub-Agenten](../reference/agent-architecture.md), MCP-Tools und [Integrationen](../reference/integrations.md) wie HTTP, Slack und E-Mail mit [paralleler Ausführung](../reference/parallel-execution.md), wo immer Abhängigkeiten dies zulassen
- **Ausführen** – Starten Sie Workflows über [Webhooks](../reference/webhooks.md), [Cron-](../nodes/cron-node.md) Zeitpläne und Event-[Trigger](../reference/triggers.md) mit Wiederholungsversuchen pro Knoten, [Fehlerbehandlung](../nodes/error-handler-node.md) und [Lastverteilung](../reference/cluster.md) über Instanzen hinweg
- **Beobachten** – Untersuchen Sie den [Ausführungsverlauf](../reference/execution-history.md), [LLM-Traces](../tabs/traces-tab.md) inklusive Token-Kosten, [Analysen](../tabs/analytics-tab.md) und [Warnungen](../tabs/alerts-tab.md) und exportieren Sie [OpenTelemetry-](../reference/opentelemetry.md) Traces
- **Evaluieren** – Testen Sie Prompts und Modelle gegen erwartete Ausgaben im Reiter [Evaluierung](../tabs/evals-tab.md)
- **Steuern** – Pausieren Sie Agenten für ein [menschliches Review](../reference/human-in-the-loop.md), blockieren Sie unsichere Inhalte mit [Guardrails](../reference/guardrails.md) und verwalten Sie Zugriffsrechte über [Anmeldedaten](../tabs/credentials-tab.md), [Teams](../reference/teams.md), [Single Sign-On](../reference/sso.md) und ein [Audit-Protokoll](../reference/audit.md)
- **Bereitstellen** – Stellen Sie Workflows über REST und [SSE Streaming](../reference/sse-streaming.md), als [MCP-](../tabs/mcp-tab.md) Tools sowie als [Portal-](../reference/portal.md) Chat-Oberflächen für Endbenutzer bereit; nutzen Sie den Reiter [Chat](../tabs/chat-tab.md), um Modelle direkt zu testen
- **Chat mit Heym** – Stellen Sie kontextbezogene Produktfragen direkt über den Dialog [Chat mit Heym](../reference/chat-with-heym.md) in der Dokumentation

## Kernkonzepte

- **Workflows** – Ein gerichteter Graph aus Knoten und Kanten. Verwalten Sie diese im Reiter [Workflows](../tabs/workflows-tab.md). Siehe [Workflow-Struktur](../reference/workflow-structure.md).
- **Knoten** – Verarbeitungseinheiten ([Eingabe](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Bedingung](../nodes/condition-node.md) etc.). Siehe [Knotentypen](../reference/node-types.md).
- **Kanten** – Verbindungen, die den Ausführungsfluss definieren
- **Anmeldedaten** – API-Keys und Secrets, die im Reiter [Anmeldedaten](../tabs/credentials-tab.md) hinterlegt und von Knoten referenziert werden.
- **Variablen** – Persistente Schlüssel-Wert-Daten im Reiter [Variablen](../tabs/global-variables-tab.md), erreichbar über `$global.variableName`. Siehe [Globale Variablen](../reference/global-variables.md).
- **Ausdrücke** – Referenzieren Sie Daten vorgelagerter Knoten mit `$input` und `$nodeName.field`. Siehe [Ausdrucks-DSL](../reference/expression-dsl.md).

## Verwandte Themen

- [Warum Heym](./why-heym.md) – Was Heym in jeder Phase des Agenten-Lebenszyklus leistet
- [Schnellstart](./quick-start.md) – Erstellen Sie Ihren ersten Workflow
- [Betrieb & Deployment](./running-and-deployment.md) – Lokal starten mit `run.sh` oder deployen mit `deploy.sh`
- [KI-Assistent](../reference/ai-assistant.md) – Workflows in natürlicher Sprache erstellen
- [Chat mit Heym](../reference/chat-with-heym.md) – Fragen beim Lesen der Dokumentation stellen
- [Kernkonzepte](./core-concepts.md) – Workflows, Knoten und Ausführungsfluss
- [Reiter Workflows](../tabs/workflows-tab.md) – Workflows und Ordner verwalten
- [Reiter Anmeldedaten](../tabs/credentials-tab.md) – API-Keys für Knoten hinterlegen
