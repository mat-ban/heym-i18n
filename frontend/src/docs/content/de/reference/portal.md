# Portal

Das **Portal** stellt Heym-Workflows als öffentliche Chat-Oberflächen bereit. Endnutzer können Workflows über eine URL ausführen, ohne sich bei Heym anzumelden.

## Was es tut

- **Öffentliche URL**: `/chat/{slug}` (z. B. `/chat/my-workflow`)
- **Chat-Oberfläche**: Nutzer interagieren über eine Chat-UI (Nachrichten, Eingaben, Antworten)
- **Optionale Authentifizierung**: Wenn Portal-Nutzer konfiguriert sind, ist eine Anmeldung erforderlich; andernfalls ist das Portal öffentlich
- **Streaming**: Echtzeit-Knotenfortschritt während der Ausführung (wenn aktiviert)
- **Laufende Ausführungen stoppen**: Nutzer können einen laufenden Portal-Durchlauf über die Chat-Fußzeile stoppen; die aktive Workflow-Ausführung wird auch serverseitig abgebrochen
- **Datei-Upload**: Optionale Datei-Uploads (Text, Bilder usw.) pro Eingabefeld
- **Übergabe an menschliche Prüfung**: Portal-Durchläufe können [HITL-Review-Links](./human-in-the-loop.md) anzeigen, wenn ein Agent für eine Genehmigung pausiert
- **Bildanzeige**: Workflow-Ausgaben, die Bilder enthalten (z. B. aus LLM-Bildgenerierung oder Playwright-Screenshots), erscheinen als Miniaturansichten im Chat. Klicken Sie auf ein beliebiges Bild, um einen Vollbild-Viewer zu öffnen; drücken Sie **Esc** oder verwenden Sie die Zurück-Taste des Geräts, um ihn zu schließen

## Workflow-Konfiguration

| Einstellung | Beschreibung |
|---------|-------------|
| `portal_enabled` | Portal für diesen Workflow aktivieren |
| `portal_slug` | URL-Slug (z. B. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Streaming-Ausführung verwenden |
| `portal_file_upload_enabled` | Datei-Uploads erlauben |
| `portal_file_config` | Datei-Konfiguration pro Feld (Typen, Limits) |

Konfiguration im Editor: Die Schaltfläche **Portal** in der Workflow-Kopfzeile öffnet den Dialog für die Portal-Einstellungen.

## Ablauf

1. **Info**: `GET /api/portal/{slug}/info` – Gibt Workflow-Metadaten und Eingabefelder zurück (keine Authentifizierung)
2. **Anmeldung** (falls erforderlich): `POST /api/portal/{slug}/login` – Gibt ein Session-Token zurück
3. **Ausführen**: `POST /api/portal/{slug}/execute` – Die Portal-Chat-UI ruft dies auf (oder intern die Streaming-Variante, wenn aktiviert); Endnutzer interagieren über die Chat-Oberfläche, nicht durch direktes Aufrufen der API.
4. **Stoppen**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Wird angefordert, wenn der Nutzer während eines aktiven Portal-Durchlaufs **Stop** drückt

## HITL in Portal-Durchläufen

Wenn ein Portal-Workflow einen [Agent-Knoten](../nodes/agent-node.md) mit aktiviertem [Human-in-the-Loop](./human-in-the-loop.md) erreicht, zeigt die Portal-Antwort einen Review-Link an, statt leer zu erscheinen.

- Der Workflow-Ausführungsstatus wird zu `pending`
- Der Portal-Chat zeigt die Review-URL an
- Alle Knoten, die mit dem `review`-Ausgangs-Handle des Agenten verbunden sind, können sofort Slack, E-Mail oder andere Kanäle benachrichtigen
- Ein Prüfer schließt die Entscheidung unter `/review/{token}` ab, ohne sich anzumelden
- Nach der Prüfung wird der Workflow aus dem gespeicherten Snapshot fortgesetzt

Dies ermöglicht es, öffentliche Chat-Abläufe mit privaten Schritten zur menschlichen Genehmigung zu kombinieren.

## Eingabefelder

Eingabefelder stammen aus [Input](../nodes/input-node.md)-Knoten. Die API extrahiert Startknoten vom Typ `textInput` und deren `inputFields`. Die Ausführung verwendet dieselbe Engine wie normale Durchläufe; Eingaben werden als `body.inputs` und `conversation_history` für Multi-Turn-Abläufe übergeben.

## Authentifizierung und Sessions

- **WorkflowPortalUser**: Benutzername/Passwort pro Workflow (wenn Authentifizierung aktiviert ist)
- **Letzten Benutzer entfernen**: Wenn das Portal aktiviert ist, macht das Löschen des letzten Portalbenutzers das Portal wieder öffentlich; der Einstellungsdialog bittet zuvor um Bestätigung
- **PortalSession**: Session-Token mit 168 Stunden TTL
- **Rate Limiting**: 3 fehlgeschlagene Anmeldeversuche → 24h Sperre pro Workflow+IP
- Abgelaufene Sessions werden durch einen Cron-Job bereinigt

## Konfigurations-UI

**WebPortalSettingsDialog**-Reiter:

1. **Allgemein**: Portal aktivieren, Slug festlegen, Portal-URL kopieren
2. **Benutzer**: Portal-Nutzer hinzufügen/entfernen (Benutzername/Passwort)
3. **Optionen**: Stream-Modus, Datei-Upload, Eingabefelder anzeigen

## Verwandte Themen

- [Warum Heym](../getting-started/why-heym.md) – Portal als Chat-Oberfläche für Agenten in der Produktion
- [Workflows-Reiter](../tabs/workflows-tab.md) – Workflows erstellen und Portal aktivieren
- [Human-in-the-Loop](./human-in-the-loop.md) – Öffentliche Review-Seiten für ausstehende Agent-Ausgaben
- [Trigger](./triggers.md) – Portal als Einstiegspunkt
- [Knotentypen](./node-types.md) – [Input](../nodes/input-node.md) für Portal-Eingaben
- [Workflow-Struktur](./workflow-structure.md) – Knoten und Kanten
