# Workflow-Organisation

Heym ermöglicht es dir, Workflows in Ordnern zu organisieren, Unterordner zu erstellen und Workflows zur Löschung zu planen. Siehe [Workflows-Reiter](../tabs/workflows-tab.md) für die UI-Übersicht.

## Ordner und Unterordner

Ordner bilden einen Baum. Jeder Ordner hat:

- **Name** – Anzeigename
- **Parent** – `parent_id` verweist auf einen anderen Ordner; `null` bedeutet Root
- **Workflows** – Workflows können über `folder_id` in Ordner verschoben werden

### API

| Endpoint | Zweck |
|----------|---------|
| `GET /folders` | Nur Root-Ordner |
| `GET /folders/tree` | Vollständiger Baum (Unterordner + Workflows) |
| `GET /folders/{id}` | Einzelner Ordner mit Inhalten |
| `POST /folders` | Ordner erstellen (`parent_id` optional) |
| `PUT /folders/{id}` | Name oder `parent_id` aktualisieren |
| `DELETE /folders/{id}` | Ordner löschen (kaskadierend) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Workflow in Ordner verschieben |
| `DELETE /folders/workflows/{workflow_id}/folder` | Workflow aus Ordner entfernen |
| `GET /folders/{id}/export` | Ordner + alle Unterordner als ZIP herunterladen |

### Baumstruktur

Die Baum-Antwort enthält `children` und `workflows` pro Ordner. Geteilte Workflows können über `WorkflowShare.folder_id` in einem Ordner erscheinen.

## Workflows teilen

Öffne **Teilen** im Workflow-Editor, um Benutzer per E-Mail einzuladen oder mit einem [Team](./teams.md) zu teilen. Jede Einladung und jede Team-Freigabe trägt eine Berechtigung:

| Berechtigung | Was der Mitarbeiter tun kann |
|------------|------------------------------|
| **Read** | Den Workflow öffnen, ihn einsehen, den Ausführungsverlauf anzeigen und ihn ausführen. Der Editor öffnet sich im schreibgeschützten Modus: Speichern ist deaktiviert und der Canvas kann nicht geändert werden. |
| **Write** | Alles, was Read erlaubt, plus Bearbeiten des Canvas, der Einstellungen, des Analyse-Dokuments und des Agenten-Gedächtnisses. |

Die Berechtigung wird neben jedem Eintrag im Teilen-Dialog angezeigt und kann jederzeit über dieses Dropdown geändert werden, ohne die Freigabe zu entfernen und erneut hinzuzufügen. Wenn ein Benutzer einen Workflow über mehrere Pfade erreicht (eine direkte Freigabe und ein oder mehrere Teams), gewinnt die **höchste** Berechtigung. Freigaben, die vor der Einführung von Berechtigungen existierten, sind **Write**, und API-Clients, die `permission` weglassen, erhalten ebenfalls **Write**.

Nur-Eigentümer-Aktionen hängen niemals von der Berechtigung ab: Das Löschen eines Workflows, das Zurücksetzen oder Leeren von Versionen, das Leeren des Verlaufs, das Verwalten von Freigaben und die unten stehenden [Nur-Eigentümer-Einstellungen](#owner-only-settings) bleiben beim Eigentümer, selbst bei **Write**-Mitarbeitern. Ein **Read**-Mitarbeiter, der eine Bearbeitung über die API (`PUT /api/workflows/{id}`, die Analyse-Notiz, das Agenten-Gedächtnis, das Leeren des Caches) oder über den AI Assistant sendet, erhält `403` mit `You have read-only access to this workflow`.

Das Teilen eines Workflows gewährt Zugriff auf den Canvas, den Ausführungsverlauf und das Analyse-Dokument. Es teilt **nicht** automatisch:

- **Anmeldedaten**, auf die von Knoten im Workflow verwiesen wird
- **Sub-Workflows**, die von [Execute](../nodes/execute-node.md)-Knoten oder Agenten aufgerufen werden

Empfänger benötigen diese Anmeldedaten und untergeordneten Workflows separat für sich freigegeben (dieselben Benutzer oder Teams). Teile Anmeldedaten über den [Anmeldedaten-Reiter](../tabs/credentials-tab.md); siehe [Anmeldedaten teilen](./credentials-sharing.md). Teile jeden Sub-Workflow über seinen eigenen Editor-Teilen-Dialog.

### Nur-Eigentümer-Einstellungen

Die gesamte **Mit cURL ausführen**-Konfiguration bleibt nach dem Teilen beim Eigentümer. Mitarbeiter öffnen den Dialog weiterhin und kopieren den generierten Befehl, aber die Steuerelemente sind schreibgeschützt.

Das Ändern eines dieser Punkte als Nicht-Eigentümer wird mit `403` abgelehnt:

- **Authentication** (`auth_type`) und **Header Key** (`auth_header_key`)
- **Request Body**-Modus (`webhook_body_mode`) und **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) und **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) verhält sich anders: Es wird vor Mitarbeitern vollständig verborgen, und ein Schreibzugriff eines Mitarbeiters wird ignoriert statt abgelehnt. Der Editor stellt das Feld maskiert dar, sodass ein `403` dort ein normales Speichern brechen würde, statt einen Angriff zu signalisieren.

Authentication ist der Grund, warum der Block nur für den Eigentümer bestimmt ist: `Anonymous` lässt nicht authentifizierte Aufrufer den Workflow ausführen, und eine Ausführung ohne angemeldeten Aufrufer löst Anmeldedaten und globale Variablen als **Eigentümer** auf, nicht als Aufrufer. Der Rest des Blocks ist der veröffentlichte Anfrage-Vertrag und die Kostenkontrollen des Eigentümers, sodass er mitwandert.

**On error, run workflow** (`error_workflow_id`) im Workflow-weiten **Properties**-Panel ist aus demselben Grund nur für den Eigentümer bestimmt: Der [Fehler-Workflow](./features.md#error-workflow) läuft mit den Anmeldedaten und globalen Variablen der fehlgeschlagenen Ausführung, die bei getriggerten und anonymen Ausführungen dem Eigentümer gehören. Mitarbeiter sehen die Einstellung schreibgeschützt, und das Hinzufügen, Ersetzen oder Leeren als Nicht-Eigentümer wird mit `403` abgelehnt.

Das Bearbeiten des Canvas, des Namens und der Beschreibung ist nicht betroffen.

### Ausführungs-Token

Ein Mitarbeiter kann ein Ausführungs-Token für einen mit ihm geteilten Workflow erzeugen. Die Ausführung wird **demjenigen zugeschrieben, der das Token erzeugt hat**, sodass sie die Anmeldedaten und globalen Variablen dieses Benutzers verwendet, nicht die des Eigentümers. Nur ein wirklich anonymer Aufruf – `auth_type: anonymous` ohne Aufrufer – läuft im Kontext des Eigentümers.

## Zur Löschung geplant

Workflows können zur Löschung geplant werden, anstatt sofort entfernt zu werden.

- **Feld**: `scheduled_for_deletion` (nullable datetime)
- **Verhalten**: Wenn gesetzt, verschiebt sich der Workflow nach `folder_id = null` und erscheint im Abschnitt "Scheduled for Deletion".

### API

| Endpoint | Zweck |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | `scheduled_for_deletion` setzen, `folder_id` leeren |
| `DELETE /workflows/{id}/schedule-deletion` | `scheduled_for_deletion` leeren (wiederherstellen) |

### UI

- **In den Papierkorb ziehen** – Workflows in den Bereich "Scheduled for Deletion" ziehen, um sie zu planen
- **Wiederherstellen** – Aus dem Zeitplan entfernen
- **Sofort löschen** – Papierkorb-Symbol für dauerhaftes Entfernen
### Bereinigungslogik

Ein Cron-Job läuft täglich um **23:59** (konfigurierte Zeitzone). Ein Workflow wird nur gelöscht, wenn:

- **Alle Start-Knoten** (Knoten ohne eingehende Kanten, ausgenommen sticky/errorHandler) `active === false` haben

Wenn ein Start-Knoten noch aktiv ist, bleibt der Workflow bis zum nächsten Lauf bestehen.

## Dashboard UI

- **Ordnerzeilen** – Neuer Ordner, rekursiver Ordnerbaum mit Expand/Collapse. Jeder Ordner trägt eine
  optionale Beschreibung unter seinem Namen und ein Badge, das die Anzahl der enthaltenen Workflows zählt,
  Unterordner eingeschlossen.
- **Ordneraktionen** – Neuer Unterordner, Umbenennen, Icon ändern, Als ZIP herunterladen und Löschen befinden sich inline
  in jeder Ordnerzeile; das Kontextmenü per Rechtsklick bietet dieselbe Auswahl, und Telefone zeigen eine einzelne
  Menüschaltfläche.
- **Hauptbereich** – Root-Workflows (kein Ordner, nicht geplant) und Zur Löschung geplant
- **Ordner-Drop-Vorschau** – Beim Ziehen eines Workflows wird der genaue Ordner oder Unterordner hervorgehoben und
  sein vollständiger Pfad in einer kartengroßen Vorschau angezeigt. Ein eingeklappter Ordner wird nach kurzem Verweilen aufgeklappt.
- **Stabiles Drag-Feedback** – Die Quellkarte verwendet einen Drag-Ghost, und das aktive Drop-Ziel bleibt
  ausgewählt, während gescrollt oder über Steuerelemente innerhalb desselben Ordners gefahren wird.
- **Zielprüfung** – Der aktuelle Ordner wird als **Already in Folder** angezeigt und akzeptiert
  keine redundante Verschiebung.
- **Andere Drop-Zonen** – Root und "Zur Löschung geplant" werden hervorgehoben, wenn sie den
  gezogenen Workflow akzeptieren können.
- **ZIP-Drop** – Legen Sie eine ZIP-Datei auf dem Workflow-Bereich ab, um eine Ordnerstruktur auf Root-Ebene zu importieren

## Verwandte Themen

- [Workflows-Reiter](../tabs/workflows-tab.md) – Workflows erstellen und verwalten
- [Anmeldedaten-Freigabe](./credentials-sharing.md) – Anmeldedaten mit Workflow-Mitarbeitern teilen
- [Teams](./teams.md) – Workflows und Anmeldedaten mit Teams teilen
- [Kernkonzepte](../getting-started/core-concepts.md) – Workflows, Knoten und Ausführung
- [Workflow-Struktur](./workflow-structure.md) – JSON-Format für Workflows
- [Trigger](./triggers.md) – Start-Knoten und Einstiegspunkte
