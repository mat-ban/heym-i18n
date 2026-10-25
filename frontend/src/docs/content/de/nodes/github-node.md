# GitHub-Knoten

Der **GitHub**-Knoten fügt native GitHub-REST-Operationen zu einem Workflow hinzu, ähnlich wie die Multi-Operations-GitHub-Knoten, die Sie aus Tools wie n8n kennen.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | GitHub |
| Ausgabe | `$nodeLabel.*` |

## Unterstützte Operationen

Der Knoten bietet derzeit 40 Aktionen:

| Ressource | Aktionen |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organisation / Benutzer | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull Request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| Datei | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Anmeldedaten

Erstellen Sie eine **GitHub**-Anmeldedaten im [Reiter „Anmeldedaten"](../tabs/credentials-tab.md) mit:

- Einem persönlichen Zugriffstoken
- Optionaler vollständiger REST-API-Basis-URL für GitHub Enterprise Server

Lassen Sie die Basis-URL für GitHub.com leer. Fein abgestufte PATs werden empfohlen.

Geben Sie für GitHub Enterprise Server den vollständigen REST-API-Endpoint einschließlich `/api/v3` ein, wie zum Beispiel
`https://github.example.com/api/v3`. Geben Sie nicht nur das Web-UI-Stammverzeichnis ein
(`https://github.example.com`).

Wenn Sie GitHub Enterprise Server verwenden und später die Anmeldedaten bearbeiten, um das Token zu rotieren, bleibt durch ein leeres
`base_url` der bestehende Enterprise-Endpoint erhalten. Geben Sie nur dann eine neue URL ein, wenn Sie diesen Endpoint
ändern möchten.

## Häufige Felder

Die meisten Operationen verwenden:

- **Owner** – Repository-Eigentümer, Organisationsname oder Benutzername
- **Repository** – Repository-Name

`List Organization Repositories` erfordert nur **Owner** (den Organisationsnamen) und verwendet das Repository-Feld nicht.

`List User Repositories` erfordert nur **Owner** (den Benutzernamen) und verwendet das Repository-Feld nicht.

`Get User Repositories` entspricht der n8n-Aktion User → Get Repositories. `Get User Issues` gibt
standardmäßig Issues zurück, die dem authentifizierten GitHub-Benutzer zugewiesen sind. Setzen Sie **Mentioned Filter** auf einen beliebigen
nicht leeren Wert, um stattdessen Issues zurückzugeben, die den authentifizierten Benutzer erwähnen. Es unterstützt außerdem
Filter für Status, Labels, aktualisiert-seit, Sortierung, Richtung und pro Seite. `Invite User` erfordert eine
Organisation und E-Mail-Adresse und verwendet weder Owner noch Repository.

## Repository

Repository-Operationen umfassen Metadaten, erkannten Lizenzinhalt, Community-Health-Profil und
Traffic-Insights. `List Popular Paths for Repository` und
`List Top Referrers for Repository` geben GitHubs Top-Traffic-Einträge der letzten 14 Tage zurück und
erfordern Push-Zugriff zur Repository-Administration.

`List Issues` unterstützt optionale Filter für Assignee, Creator, erwähnten Benutzer, kommagetrennte Labels,
aktualisiert-seit-Zeitstempel, Sortierung und Richtung. `List Pull Requests` unterstützt Steuerelemente für Status, Sortierung,
Richtung und pro Seite.

`Get Repository Issues` und `Get Repository Pull Requests` stellen dieselben APIs wie ihre List-
Gegenstücke unter expliziten n8n-kompatiblen Repository-Aktionsnamen bereit.

### Get Repository-Metadaten

`Get Repository` speichert GitHubs vollständige Antwort in `$github.repository` und stellt außerdem
`$github.full_name`, `$github.default_branch`, `$github.private` und `$github.url` bereit.

Die Repository-Payload enthält üblicherweise:

- Identität und Eigentümerschaft: ID, Name, vollständiger Name, Beschreibung, Owner und Sichtbarkeit
- Repository-Status: privat, Fork, archiviert, deaktiviert und Standard-Branch
- URLs: GitHub-Seite, API, Clone-, SSH- und Git-URLs
- Aktivität und Größe: Erstellungs-, Aktualisierungs- und Push-Zeitstempel, Größe, Stars, Watcher, Forks, Abonnenten und offene Issues
- Funktionen: Issues, Projekte, Wiki, Pages, Diskussionen, Themen, Sprache und Homepage
- Lizenz, Merge-Einstellungen, Aufrufer-Berechtigungen, Sicherheitseinstellungen und Fork-Parent/Source-Metadaten, sofern verfügbar

Einige administrative, Berechtigungs-, Merge- und Sicherheitsfelder hängen von den Repository-
Berechtigungen der Anmeldedaten ab.

Beispiel:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue-Operationen unterstützen Titel-/Body-Felder und optionale JSON-Array-Felder für Labels und Assignees.

`List Issues` gibt nur Repository-Issues zurück. Pull Requests sind ausgeschlossen; verwenden Sie `List Pull Requests` für PR-Ergebnisse.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Feld-Semantik von Edit Issue

Für `Edit Issue` werden nur Felder, die Sie explizit setzen, an GitHub gesendet:

- **State** – Wählen Sie `Don't change`, `Open` oder `Closed`. Lassen Sie das Feld ungesetzt, um den aktuellen Status beizubehalten.
- **State Reason** – Legen Sie optional `Completed`, `Not Planned`, `Duplicate` oder `Reopened` fest.
- **Title / Body** – Leer lassen, um den aktuellen Wert beizubehalten.
- **Labels / Assignees** – Lassen Sie das Feld leer, um den aktuellen Wert beizubehalten. Verwenden Sie `[]`, um alle Labels oder Assignees zu löschen. Verwenden Sie ein JSON-Array wie `["bug"]`, um sie zu ersetzen.

`Edit Issue` erfordert zur Laufzeit mindestens ein zu änderndes Feld. Wenn Sie nur eine Issue-Nummer angeben, schlägt die Ausführung mit einem Validierungsfehler aus der GitHub-API-Schicht fehl.

## Lock Issue

`Lock Issue` akzeptiert einen optionalen **Lock reason**. Wenn angegeben, muss er einer von GitHubs unterstützten Werten sein:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Lassen Sie den Grund leer, um ohne spezifischen Grund zu sperren.

## Pull Requests

Create PR erfordert:

- Titel
- Head-Branch
- Base-Branch
- Optionaler Body
- Optionaler Draft-Modus
## Pull Request Reviews

Review-Operationen entsprechen der Pull-Request-Review-API von GitHub:

| Operation | Erforderliche Felder | Optionale Felder |
|-----------|-----------------|-----------------|
| `Create Review` | Pull-Request-Nummer, Event | Body, Commit-ID |
| `Get Review` | Pull-Request-Nummer, Review-ID | — |
| `List Reviews` | Pull-Request-Nummer | Pro Seite |
| `Update Review` | Pull-Request-Nummer, Review-ID, Body | — |

`Create Review` unterstützt `Approve`, `Request Changes`, `Comment` und `Pending`.
Der Body ist für `Request Changes` und `Comment` erforderlich. Wenn die Commit-ID leer ist, prüft GitHub
den neuesten Commit des Pull Requests.

## Releases

| Operation | Erforderliche Felder zur Laufzeit | Häufig optional |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag-Name | Release-Name (Titel), Body, Ziel-Branch, Draft, Prerelease |
| `Update Release` | Release-ID | Tag-Name, Release-Name, Body, Ziel-Branch, Draft, Prerelease |
| `Get Release` / `Delete Release` | Release-ID | — |

`Update Release` kann `draft` / `prerelease` explizit entweder auf `true` oder `false` setzen.

## Workflows

Workflow-Operationen unterstützen:

- Auflisten der Repository-Workflows
- Abrufen eines Workflows über numerische ID oder Workflow-Dateinamen
- Aktivieren oder Deaktivieren eines Workflows
- Auslesen der abrechenbaren Workflow-Nutzung nach Betriebssystem des Runners
- Auslösen eines Workflows mit einem Ref oder Branch plus optionalem JSON-Inputs-Objekt

GitHub ist dabei, den `Get Workflow Usage`-Endpoint abzuschalten. Workflows, die
diese Operation verwenden, müssen möglicherweise migrieren, wenn GitHub den Endpoint entfernt.

`Dispatch Workflow` akzeptiert beide GitHub-Antwortformen: das Legacy-`204 No Content` und die neuere
`200`-Antwort mit `workflow_run_id`, `run_url` und `html_url`.

`Dispatch Workflow and Wait` löst den Workflow aus und pollt den Run, bis sein Status
`completed` ist. Konfigurieren Sie das Timeout und das Polling-Intervall in Sekunden. Heym verwendet
`workflow_run_id`, wenn GitHub die neuere `200`-Antwort zurückgibt. Bei der traditionellen `204 No
Content`-Antwort ermittelt Heym den neu erstellten `workflow_dispatch`-Run für den ausgewählten
Workflow und Ref und wartet dann auf diesen Run.

## File Contents

`Get File` liest eine Repository-Datei über die Contents-API von GitHub und dekodiert Textinhalte, wenn verfügbar. Binärdateien und Nicht-UTF-8-Inhalte können Metadaten ohne dekodiertes `content`-Feld zurückgeben.

`List Files` gibt Verzeichniseinträge aus der Repository-Contents-API für einen bestimmten Ordnerpfad und optionalen Ref zurück. Lassen Sie **Directory Path** leer, um das Repository-Stammverzeichnis aufzulisten.

`Create or Update File` schreibt Textinhalte in einen Repository-Pfad unter Verwendung von:

- Dateipfad
- Commit-Nachricht
- Dateiinhalt
- Optionalem Branch

`Delete File` entfernt einen Repository-Pfad unter Verwendung einer Commit-Nachricht und eines optionalen Branch. Wenn die Datei existiert, ruft Heym den aktuellen SHA automatisch ab, bevor sie gelöscht wird.

Wenn die Datei bereits existiert, ruft Heym den aktuellen SHA automatisch ab, bevor sie aktualisiert wird.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` und `Get User Repositories` unterstützen
**Per Page** (1–100). Heym fordert eine Ergebnisseite an; es gibt kein `page`-Feld, um
zusätzliche Seiten in derselben Operation abzurufen.


### Return all pages

Aktivieren Sie **Return all pages**, damit ein Lauf jeder Seite folgt, beginnend bei **Cursor**, sofern gesetzt. Jede Anfrage fordert 100 Einträge an, unabhängig vom Wert von **Per Page**. Der Knoten stoppt nach etwa 1.000 Einträgen (oder 100 Anfragen): Issue-Objekte sind jeweils etwa 6 KB groß, eine höhere Grenze würde sehr große Knotenausgaben erzeugen. Stoppt er vorzeitig, gibt er das bisher Gesammelte mit `has_more: true` und einem `next_cursor` zurück, statt einen Fehler auszulösen, und Sie können mit diesem Cursor im nächsten Lauf fortfahren. Das Stoppen des Workflows oder das Erreichen des Workflow-Timeouts beendet den Abruf zwischen den Seiten.

## Output

Die genaue Form hängt von der ausgewählten Operation ab. Häufige Felder sind:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

Ersetzen Sie `github` durch Ihr Knoten-Label.

## Notes

- Labels und Assignees müssen gültige JSON-Arrays sein, wenn sie angegeben werden.
- Workflow-Dispatch-Inputs müssen ein gültiges JSON-Objekt sein, wenn sie angegeben werden.
- `Edit Issue` verwendet `state` nur, wenn Sie es explizit setzen; lassen Sie es ungesetzt, um den aktuellen Issue-Status beizubehalten.
- Die GitHub-API-Berechtigungen hängen von den Token-Scopes oder fein granulierten Repository-Berechtigungen ab, die Sie gewähren.

## Related

- [Reiter Anmeldedaten](../tabs/credentials-tab.md) – GitHub-Anmeldedaten hinzufügen und verwalten
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung von GitHub-Anmeldedaten und Enterprise-`base_url`
- [Agent-Knoten](./agent-node.md) – GitHub-Anmeldedaten mit `@modelcontextprotocol/server-github` verwenden
- [Knotentypen](../reference/node-types.md) – Vollständiger Knoten-Katalog
