# Teams

Teams ermöglichen es dir, Workflows, Anmeldedaten, globale Variablen, Vektorspeicher und Drive-Dateien gleichzeitig mit einer Gruppe von Benutzern zu teilen.

## Überblick

- **Team** – Eine benannte Gruppe mit einem Ersteller und Mitgliedern
- **Ersteller** – Immer ein Mitglied; kann das Team bearbeiten, das Team löschen und Mitglieder hinzufügen
- **Mitglied** – Kann andere Mitglieder hinzufügen und entfernen (außer den Ersteller); hat Zugriff auf Ressourcen, die mit dem Team geteilt wurden

## Teams erstellen und verwalten

Erstelle Teams über den [Teams-Reiter](../tabs/teams-tab.md). Füge Mitglieder per E-Mail hinzu; sie müssen ein Konto haben. Der Ersteller kann nicht entfernt werden. Das Löschen eines Teams entfernt alle Team-Freigaben.

## Freigabemodell

Ressourcen können geteilt werden mit:

1. **Einzelnen Benutzern** – Per E-Mail (Benutzer-zu-Benutzer-Freigabe)
2. **Teams** – Durch Auswahl eines Teams (Team-Freigabe)

Beide Modelle sind additiv. Ein Benutzer erhält Zugriff, wenn er entweder:

- direkt freigegeben wurde (Benutzer-Freigabe), oder
- Mitglied eines Teams ist, das eine Team-Freigabe hat

## Was mit Teams geteilt werden kann

| Ressource | Freigabeort |
|----------|----------------|
| Workflows | Freigabedialog im Workflow-Editor |
| Workflow-Vorlagen | Freigabedialog beim Erstellen/Bearbeiten einer Workflow-Vorlage |
| Knoten-Vorlagen | Freigabedialog beim Erstellen/Bearbeiten einer Knoten-Vorlage |
| Anmeldedaten | Freigabedialog im Anmeldedaten-Reiter |
| Globale Variablen | Freigabedialog im Variablen-Reiter |
| Vektorspeicher | Freigabedialog im Vektoren-Reiter |
| Drive-Dateien | Freigabedialog im Drive-Reiter oder Drive-Knoten `shareWithMyTeams` / `unshareWithMyTeams`-Operationen |

Bei Vorlagen kannst du, wenn die Sichtbarkeit auf **Bestimmte Benutzer** gesetzt ist, auch Teams auswählen. Alle Mitglieder der ausgewählten Teams erhalten Zugriff auf die Vorlage.
Team-Freigaben von Drive-Dateien sind für Teammitglieder schreibgeschützt; der Dateieigentümer behält die Verwaltungsberechtigungen.

## API-Endpoints

- `GET /api/teams` – Teams auflisten, zu denen der Benutzer gehört
- `GET /api/teams/{id}` – Team-Details mit Mitgliedern abrufen
- `GET /api/teams/{id}/shared-entities` – Gibt Entitäten zurück, die mit dem Team geteilt wurden (Workflows, Anmeldedaten, globale Variablen, Vektorspeicher, Dateien, Workflow-Vorlagen, Knoten-Vorlagen)
- `POST /api/teams` – Team erstellen
- `PATCH /api/teams/{id}` – Team aktualisieren
- `DELETE /api/teams/{id}` – Team löschen (nur Ersteller)
- `POST /api/teams/{id}/members` – Mitglied hinzufügen (Body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Mitglied entfernen

Team-Freigaben pro Ressource:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – der POST-Body akzeptiert `permission` (`read` oder `write`, Standard `write`); das erneute Posten eines bestehenden Teams aktualisiert dessen Berechtigung
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Verwandte Themen

- [Teams-Reiter](../tabs/teams-tab.md) – Teams erstellen und verwalten
- [Vorlagen-Reiter](../tabs/templates-tab.md) – Workflow- und Knoten-Vorlagen mit Teams teilen
- [Anmeldedaten-Freigabe](./credentials-sharing.md) – Anmeldedaten mit Benutzern und Teams teilen
- [Workflow-Organisation](./workflow-organization.md) – Ordner und Workflow-Freigabe
