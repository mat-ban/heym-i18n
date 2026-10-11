# Linear-Knoten

Der **Linear**-Knoten verbindet Workflows mit der Linear GraphQL API für Issue- und Workspace-Automatisierung.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | Linear persönlicher API-Schlüssel oder OAuth2 |
| Ausgabe | `$nodeLabel.*` |

## Anmeldedaten

Erstelle eine **Linear**-Anmeldedaten im [Reiter „Anmeldedaten"](../tabs/credentials-tab.md). Wähle einen
Authentifizierungsmodus:

**Persönlicher API-Schlüssel**

1. Öffne in Linear **Settings → Security & Access → Personal API keys**.
2. Erstelle einen Schlüssel mit Zugriff auf den Workspace, den du automatisieren möchtest.
3. Füge den Schlüssel in eine neue Linear-Anmeldedaten in Heym ein und verwende **Test Connection**, um ihn zu überprüfen.

**OAuth2**

1. Erstelle eine Linear OAuth-Anwendung.
2. Registriere `{FRONTEND_URL}/api/credentials/linear/oauth/callback` als Redirect-URI.
3. Wähle in Heym **OAuth2**, gib die Client ID und das Client Secret ein und klicke dann auf **Connect**.

Persönliche API-Schlüssel und OAuth-Token agieren als der Benutzer, der sie erstellt oder autorisiert hat.

## Operationen

| Operation | Erforderliche Felder | Ausgabe |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; optional After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; optional After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; optional Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; optional After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID oder Identifier wie `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID oder Identifier und mindestens ein geändertes Feld | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID oder Identifier | `deleted` |
| Add Issue Link | Issue ID oder Identifier, Link URL | `link` |
| Create Comment | Issue ID oder Identifier, Comment Body | `comment` |
| List Comments | Issue ID oder Identifier, Limit; optional After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Alle Textfelder unterstützen [Ausdrücke](../reference/expression-dsl.md).

## Issue-Felder

- **Team ID** und **Project ID** sind Linear-UUIDs. Verwende List Teams oder List Projects, um sie zu ermitteln.
- **State ID** ist die Workflow-State-UUID, die beim Erstellen oder Aktualisieren eines Issues verwendet wird. Verwende List Workflow States, um sie zu ermitteln.
- **Assignee ID** ist eine Linear-Benutzer-UUID. Verwende List Team Members, um sie zu ermitteln.
- **Priority** akzeptiert `0` bis `4`: keine Priorität, dringend, hoch, normal und niedrig.
- Lasse optionale Aktualisierungsfelder leer, um ihre aktuellen Werte beizubehalten.
- Setze ein Aktualisierungsfeld auf `null`, um Beschreibung, Projekt, Assignee oder Status zu löschen.
- **Link URL** fügt einem Issue einen externen Anhang-Link hinzu.
- **Comment ID** ist die Linear-UUID für einen vorhandenen Kommentar. Verwende List Comments, um sie zu ermitteln.
- **Parent Comment ID** antwortet auf einen vorhandenen Linear-Kommentar, wenn ein Kommentar erstellt wird.

## Paginierung

Listenoperationen können entweder eine Seite zurückgeben oder automatisch jede Seite abrufen:

- Lasse **Return All** ausgeschaltet, um `Limit` und `After Cursor` manuell zu verwenden.
- Schalte **Return All** ein, um Linear-Cursors serverseitig zu folgen, bis zu 10.000 Ergebnisse.

Seitennummerierte Ergebnisse geben `pageInfo.hasNextPage` und `pageInfo.endCursor` zurück. Übergib den Cursor in
**After Cursor** beim nächsten Knotenlauf, um die nächste Seite abzurufen, wenn **Return All** ausgeschaltet ist.

## Beispiele

Erstelle ein Issue aus einer vorgelagerten Eingabe:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Füge einem erstellten Issue einen Kommentar hinzu:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: optional, wenn auf einen anderen Kommentar geantwortet wird

Löse einen Kommentar-Thread auf:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Füge einem Issue einen externen Link hinzu:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Durchlaufe Teammitglieder mit Paginierung:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` beim nächsten Lauf, wenn `hasNextPage` true ist

Ermittle Workflow-State-IDs, bevor du ein Issue aktualisierst:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Verwende dann `$listStates.states[0].id` als **State ID** in **Update Issue**

## Ausgabe

Jede erfolgreiche Operation setzt:

- `$linear.success`
- `$linear.operation`

Listenoperationen stellen außerdem `count` und, sofern zutreffend, `pageInfo` bereit. Issue-Operationen stellen die
vollständige Linear-Issue-Payload und Komfortfelder wie `identifier` und `url` bereit.
Kommentar-Mutationen stellen die vollständige `comment`-Payload bereit, außer Delete Comment, das
`deleted` und `entityId` bereitstellt.

## Verwandte Themen

- [Reiter „Anmeldedaten"](../tabs/credentials-tab.md)
- [Knotentypen](../reference/node-types.md)
- [Ausdrucks-DSL](../reference/expression-dsl.md)
