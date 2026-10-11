# Migration zu Heym

Sie haben bereits Workflows in einem anderen Tool? **KI-Konvertierung** wandelt diese automatisch in Heym-Workflows um. Fügen Sie einen Workflow aus n8n, Flowise, Dify, Langflow, sim.ai oder Activepieces ein – oder beschreiben Sie einfach in eigenen Worten, was Sie möchten – und Heym erstellt den passenden Workflow auf einem interaktiven Canvas, den Sie herunterladen und importieren können.

Öffnen Sie das Tool unter **[heym.run/convert](https://heym.run/convert)** oder nutzen Sie die Schaltfläche **✨ KI-Konvertierung** im Website-Header.

## So funktioniert es

1. **Quell-Tool wählen** (optional) – n8n, Flowise, Dify, Langflow, sim.ai, Activepieces oder belassen Sie die Auswahl auf *Auto*.
2. **Workflow bereitstellen** – Fügen Sie das exportierte JSON aus Ihrem bisherigen Tool ein oder verfassen Sie eine Beschreibung der gewünschten Automatisierung.
3. **Generieren** – Heym streamt das Ergebnis auf den Canvas und zeichnet Knoten sowie Verbindungen während der Erstellung.
4. **Herunterladen oder Kopieren** des generierten Workflows als JSON.
5. **In Heym importieren** – Nutzen Sie den [Download & Import](../reference/download-import.md) Ablauf, um das JSON in Ihren Canvas einzufügen und auszuführen.

Die Konvertierung fügt zudem eine kleine *Notiz* auf dem Canvas hinzu, die den Workflow als von Heym generiert kennzeichnet – diese können Sie jederzeit löschen.

## Das Ergebnis

Der Konverter bildet Quellkonzepte auf native Heym-Knoten ab – Trigger, [LLM-Schritte](../nodes/llm-node.md), [HTTP-Aufrufe](../nodes/http-node.md), [Slack-](../nodes/slack-node.md)/[Telegram-Aktionen](../nodes/telegram-node.md), [Schleifen](../nodes/loop-node.md), [Bedingungen](../nodes/condition-node.md) und [Ausgaben](../nodes/output-node.md). Überprüfen Sie das Ergebnis auf dem Canvas, verknüpfen Sie Ihre [Anmeldedaten](../reference/credentials.md) und passen Sie Details an, die das Quell-Tool abweichend modelliert hat.

> Die KI-Konvertierung ist ein hervorragender Ausgangspunkt, ersetzt aber nicht das menschliche Review. Überprüfen Sie den generierten Workflow stets vor dem produktiven Einsatz.

## Wissenswertes

- **KI-gestützt:** Konvertierungen werden von einem Large Language Model durchgeführt, daher können Ergebnisse variieren. Generieren Sie den Workflow erneut, falls das erste Ergebnis noch nicht optimal ist.
- **Eingabegröße:** Der eingefügte Text ist auf ca. **25.000 Tokens** begrenzt. Kürzen Sie sehr umfangreiche Exporte vor der Konvertierung.
- **Rate-Limits:** Um den Dienst für alle verfügbar zu halten, sind Anfragen auf **1 pro Minute, 5 pro Stunde und 10 pro Tag** pro Besucher beschränkt.
- **Sicherheit:** Anfragen werden gefiltert und ausschließlich Anfragen zur Workflow-Erstellung verarbeitet.

## Nächste Schritte

- Neu auf dem Canvas? Beginnen Sie mit dem [Schnellstart](./quick-start.md).
- Erfahren Sie mehr über den Import unter [Download & Import](../reference/download-import.md).
- Self-Hosting von Heym? Siehe [Umgebungsvariablen](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) für die Konfigurationsreferenz.
- Neu aufbauen mit dem integrierten [KI-Assistenten](../reference/ai-assistant.md).
