# Schnellstart

Bringen Sie Ihren ersten Heym-Workflow in wenigen Minuten zum Laufen.

Haben Sie Heym noch nicht installiert? Siehe [Betrieb & Deployment](./running-and-deployment.md) oder schauen Sie sich das Video-Tutorial an: [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Workflow erstellen

1. Wechseln Sie in den Reiter [Workflows](../tabs/workflows-tab.md)
2. Klicken Sie auf **Neuer Workflow**
3. Benennen Sie Ihren Workflow (z. B. „Hello World“)

## 2. Knoten hinzufügen

1. Öffnen Sie das Panel **Knoten** auf der linken Seite
2. Ziehen Sie einen [Eingabe-Knoten](../nodes/input-node.md) auf den Canvas
3. Ziehen Sie einen [LLM-Knoten](../nodes/llm-node.md) auf den Canvas und verbinden Sie ihn mit der Eingabe
4. Ziehen Sie einen [Ausgabe-Knoten](../nodes/output-node.md) auf den Canvas und verbinden Sie ihn mit dem LLM

```
[Input] --> [LLM] --> [Output]
```

Siehe [Knotentypen](../reference/node-types.md) für alle verfügbaren Knoten.

## 3. Konfigurieren

- **Eingabe**: Legen Sie einen Standardwert fest oder lassen Sie das Feld für Benutzereingaben leer (siehe [Eingabe-Knoten](../nodes/input-node.md))
- **LLM**: Wählen Sie [Anmeldedaten](../tabs/credentials-tab.md) und ein Modell aus, hinterlegen Sie eine System-Instruction und setzen Sie `userMessage` auf `$input.text` (siehe [LLM-Knoten](../nodes/llm-node.md))
- **Ausgabe**: Setzen Sie `message` auf `$llm.text`, um die Antwort des LLM weiterzuleiten (siehe [Ausgabe-Knoten](../nodes/output-node.md))

Nutzen Sie die Syntax der [Ausdrucks-DSL](../reference/expression-dsl.md) für `$input.text` und `$llm.text`. Klicken Sie auf den Vergrößern-Button in Ausdrucksfeldern, um den [Ausdrucksauswertungs-Dialog](../reference/expression-evaluation-dialog.md) mit Live-Backend-Vorschau zu öffnen.

## 4. Ausführen

Klicken Sie auf **Ausführen**, drücken Sie `Strg + Enter` oder nutzen Sie das Debug-Panel, um die Ausführung zu starten. Der Workflow wird vom Eingabe-Knoten über verbundene Knoten bis zur Ausgabe durchlaufen. Siehe [Trigger](../reference/triggers.md) für weitere Möglichkeiten, Workflows zu starten ([Webhook](../reference/webhooks.md), Portal, Cron etc.).

Vergangene Ausführungen finden Sie im **Verlauf** (Toolbar); nutzen Sie **Auf Canvas laden**, um einen Lauf mit identischen Eingaben erneut zu starten.

Auf Dokumentations-, Evaluierungs- und anderen internen Seiten außerhalb des Canvas können Sie zudem den [Quick Drawer](../reference/quick-drawer.md) verwenden, um einen angehefteten Workflow auszuwählen und auszuführen, ohne zum Editor zurückzukehren.

Wenn Sie beim Lesen der Dokumentation Fragen haben, öffnen Sie den Dialog [Chat mit Heym](../reference/chat-with-heym.md) im Header der Dokumentation, um kontextbezogene Fragen zu stellen.

Alternativ können Sie den [KI-Assistenten](../reference/ai-assistant.md) im Debug-Panel nutzen, um Workflows in natürlicher Sprache zu erstellen – beschreiben Sie Ihr Ziel und die KI generiert Knoten und Verbindungen.

Bauen Sie Automatisierungen bereits in einem anderen Tool? [Migration zu Heym](./migrate-to-heym.md) konvertiert Workflows aus n8n, Flowise, Dify, Langflow, sim.ai oder Activepieces in Heym-Workflows, die Sie direkt importieren können.

## Verwandte Themen

- [Kernkonzepte](./core-concepts.md) – Workflows, Knoten und Ausführungsfluss
- [Migration zu Heym](./migrate-to-heym.md) – Konvertieren Sie n8n-, Flowise-, Dify-, Langflow-, sim.ai- oder Activepieces-Workflows mit KI zu Heym
- [Betrieb & Deployment](./running-and-deployment.md) – Lokal starten mit `run.sh` oder deployen mit `deploy.sh`
- [Umgebungsvariablen](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Vollständige Konfigurationsreferenz
- [Einstellungen](../reference/user-settings.md) – Name, Benutzerregeln und Passwort konfigurieren
- [Canvas-Funktionen](../reference/canvas-features.md) – Daten anheften, Ausführungsprotokolle, aktivieren/deaktivieren, in Sub-Workflow extrahieren
- [Tastenkombinationen](../reference/keyboard-shortcuts.md) – Tastaturkürzel für Canvas und Editor
- [Ausdrucks-DSL](../reference/expression-dsl.md) – Daten in Knotenkonfigurationen referenzieren
- [Ausdrucksauswertungs-Dialog](../reference/expression-evaluation-dialog.md) – Erweiterter Editor mit Live-Backend-Vorschau
- [Trigger](../reference/triggers.md) – Alle Workflow-Einstiegspunkte ([Webhook](../reference/webhooks.md), Portal, Cron etc.)
- [Ausführungsverlauf](../reference/execution-history.md) – Vergangene Läufe einsehen und Auf Canvas laden
- [Quick Drawer](../reference/quick-drawer.md) – Angeheftete Workflows von jeder Seite ausführen
- [Chat mit Heym](../reference/chat-with-heym.md) – Kontextbezogene Fragen im Dokumentations-Header stellen
- [Reiter Workflows](../tabs/workflows-tab.md) – Workflows erstellen und verwalten
- [Reiter Anmeldedaten](../tabs/credentials-tab.md) – API-Keys für LLM-Knoten hinterlegen
- [KI-Assistent](../reference/ai-assistant.md) – Workflows mit natürlicher Sprache erstellen
