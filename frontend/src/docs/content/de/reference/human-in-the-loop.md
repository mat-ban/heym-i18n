# Human-in-the-Loop

Human-in-the-Loop (HITL) ermöglicht es einem [Agent-Knoten](../nodes/agent-node.md), an bestimmten Punkten eine Genehmigung anzufordern, auf eine menschliche Entscheidung zu warten und dann den Workflow aus demselben Ausführungs-Snapshot fortzusetzen.

## Was es bewirkt

- Fügt einem Agenten explizite Genehmigungs-Checkpoints hinzu, ohne einen separaten Genehmigungs-Workflow zu erstellen
- Erstellt eine einmalige öffentliche Review-URL unter `/review/{token}`
- Ermöglicht einem Prüfer `Accept`, `Edit & Continue` oder `Refuse`
- Markiert die Ausführung als `pending`, bis eine Entscheidung eintrifft
- Setzt die pausierte Ausführung fort und lässt den Agenten nach der Genehmigung weiterarbeiten
- Unterstützt mehrere aufeinanderfolgende HITL-Checkpoints im selben Agentenlauf

## Agent-Konfiguration

Aktiviere HITL im Eigenschaftenbereich des Agenten.

| Einstellung | Beschreibung |
|---------|-------------|
| `hitlEnabled` | Aktiviert die menschliche Prüfung für diesen Agenten |
| `hitlSummary` | Genehmigungsrichtlinien dafür, wann der Agent eine menschliche Prüfung anfordern soll |

HITL fügt dem Agenten ein `request_human_review`-Tool hinzu. Verwende den System-Prompt und die `hitlSummary`-Richtlinien, um dem Agenten mitzuteilen, welche Aktionen eine Genehmigung benötigen. Wenn der Agent entscheidet, dass ein Checkpoint geprüft werden muss, sendet er einen einzelnen Markdown-Review-Text an den Menschen. Die prüferseitige Zusammenfassung wird zur Laufzeit aus der Anfrage des Agenten generiert; wenn der Agent sie weglässt, leitet Heym eine aus dem Markdown-Body ab. In v1 unterstützt HITL nur Agenten-Ausgaben im Textmodus und kann daher nicht mit `jsonOutputEnabled` kombiniert werden.

Bei MCP-Tools bittet Heym das Modell, die geschriebenen HITL-Anweisungen in einen von drei Genehmigungsbereichen zu interpretieren:

- `always` für Formulierungen wie "always", "on each" oder "for each"
- `once` für Formulierungen wie "once" oder "only one time"
- `never` für Formulierungen wie "never", "do not ask" oder "already approved"

Diese Interpretation steuert, ob wiederholte MCP-Aufrufe erneut pausieren, einmal genehmigt bleiben oder die menschliche Prüfung vollständig überspringen.

Wenn HITL aktiviert ist, stellt der Agent außerdem einen zweiten Canvas-Ausgabe-Handle mit der Bezeichnung `review` bereit. Verwende diesen Zweig, um die ausstehende Review-URL und Zusammenfassung an Slack, E-Mail, Logging oder einen anderen Benachrichtigungsfluss zu senden, während die Hauptausführung auf eine Person wartet.

## Review-Ablauf

1. Der Agent erreicht einen genehmigungspflichtigen Schritt und ruft `request_human_review` auf
2. Heym erstellt eine öffentliche Review-Anfrage und gibt eine Review-URL zurück
3. Alle Knoten, die mit dem `review`-Handle des Agenten verbunden sind, werden sofort mit dem ausstehenden HITL-Payload ausgeführt
4. Die Workflow-Ausführung wechselt zu `pending`
5. Ein Prüfer öffnet `/review/{token}` ohne Anmeldung
6. Der Prüfer wählt eine Aktion:
   - `Accept` fährt mit dem ursprünglichen Markdown fort
   - `Edit & Continue` fährt mit dem bearbeiteten Markdown fort
   - `Refuse` fährt mit `decision: "refused"` fort und überspringt weitere Agentenaktionen
7. Heym setzt den Workflow aus dem gespeicherten Snapshot fort und lässt den Agenten mit dem genehmigten Markdown-Kontext weiterarbeiten
8. Wenn ein späterer Schritt ebenfalls eine Genehmigung erfordert, kann der Agent HITL erneut aufrufen und einen weiteren ausstehenden Checkpoint erstellen

Review-Links laufen nach 168 Stunden ab, wenn niemand antwortet.

## Öffentliche Review-Seite

Die öffentliche Review-Seite zeigt:

- Den Workflow-Namen und das Agenten-Label
- Eine automatisch generierte Prüfer-Zusammenfassung aus der Review-Anfrage des Agenten
- Den Markdown-Review-Text zuerst, als Hauptinhalt
- Ein Bearbeitungsfeld, das sich erst öffnet, nachdem der Prüfer auf `Edit` klickt
- Eine Live-Markdown-Vorschau während der Bearbeitung
- Aktionsschaltflächen für `Accept`, `Edit & Continue` und `Refuse`

Sobald eine Entscheidung übermittelt wurde, wird der Token gesperrt und kann nicht wiederverwendet werden.

## Ausgaben und Ausführungszustand

Während des Wartens auf die Prüfung enthält die Agenten-Ausgabe einen ausstehenden Payload:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Nachdem der Prüfer geantwortet hat und der Workflow fortgesetzt wird, enthält die endgültige Agenten-Ausgabe die Entscheidungs-Metadaten:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Verwende `$agentLabel.decision` in nachgelagerten Knoten, um anhand von akzeptierten, bearbeiteten oder abgelehnten Ergebnissen zu verzweigen.

## Canvas-Review-Zweig

Der `review`-Ausgabe-Handle ist nur verfügbar, wenn `hitlEnabled` für einen Agenten aktiviert ist.

- Er wird ausgeführt, bevor die menschliche Entscheidung eintrifft
- Er empfängt den ausstehenden HITL-Payload, einschließlich `summary`, `draftText`, `reviewUrl`, `shareText` und `shareMarkdown`
- Er ist für Benachrichtigungs- oder Übergabeschritte wie Slack, E-Mail oder Audit-Logging gedacht
- Er wird einmal pro HITL-Checkpoint ausgeführt
- Er wird nach der Antwort des Prüfers nicht erneut ausgeführt; nur der normale Agenten-Ausgabepfad wird bei der Fortsetzung weitergeführt

## Wo es erscheint

- [Ausführungsverlauf](./execution-history.md) zeigt `pending`-Läufe sofort an und speichert die Review-URL in den Knotenergebnissen
- [Portal](./portal.md)-Chat-Antworten zeigen den Human-Review-Link anstelle einer leeren Antwort
- Das Debug-Panel und die Verlaufsdialoge zeigen die endgültige HITL-Entscheidung und den geprüften Text
- Der Review-Ausgabe-Handle kann externe Kanäle benachrichtigen, selbst wenn der Workflow durch Cron, curl oder Portal-Traffic ausgelöst wurde
- Mehrere HITL-Checkpoints verwenden denselben Eintrag im Ausführungsverlauf wieder, während für jede Pause ein neuer einmaliger Review-Link erstellt wird

## Aktuelle Einschränkungen

- HITL ist nur auf Agent-Knoten verfügbar
- HITL verwendet die Textausgabe des Agenten und unterstützt in v1 keine JSON-Ausgabe
- Eine pausierte Ausführung wird aus dem gespeicherten Workflow-Snapshot fortgesetzt, nicht aus der zuletzt bearbeiteten Workflow-Version
- Verschachtelte Sub-Workflows können in v1 keinen ausstehenden HITL-Zustand erreichen; fordere die Prüfung vom übergeordneten Agenten an, bevor du sie aufrufst
## Verwandte Themen

- [Agent-Knoten](../nodes/agent-node.md) - HITL auf einem Agenten konfigurieren
- [Agent-Architektur](./agent-architecture.md) - Wie Agenten, Tools, Sub-Agenten und HITL zusammenpassen
- [Ausführungsverlauf](./execution-history.md) - Ausstehende und fortgesetzte Ausführungen prüfen
- [Board](../tabs/board-tab.md) - Board-Kettenausführungen pausieren die Karte bei HITL in einem ausstehenden (gelben) Zustand
- [Portal](./portal.md) - Öffentliche Chat-Flows und HITL-Review-Links
