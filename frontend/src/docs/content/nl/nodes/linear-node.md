# Linear-node

De **Linear**-node verbindt workflows met de Linear GraphQL API voor automatisering van issues en workspaces.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | Linear persoonlijke API-sleutel of OAuth2 |
| Uitvoer | `$nodeLabel.*` |

## Referentie

Maak een **Linear**-referentie aan in het tabblad [Referenties](../tabs/credentials-tab.md). Kies één
authenticatiemodus:

**Persoonlijke API-sleutel**

1. Open in Linear **Settings → Security & Access → Personal API keys**.
2. Maak een sleutel aan met toegang tot de workspace die u wilt automatiseren.
3. Plak de sleutel in een nieuwe Linear-referentie in Heym en gebruik **Test Connection** om deze te verifiëren.

**OAuth2**

1. Maak een Linear OAuth-applicatie aan.
2. Registreer `{FRONTEND_URL}/api/credentials/linear/oauth/callback` als de redirect-URI.
3. Kies in Heym **OAuth2**, voer de Client ID en Client Secret in en klik op **Connect**.

Persoonlijke API-sleutels en OAuth-tokens handelen als de gebruiker die ze heeft aangemaakt of geautoriseerd.

## Bewerkingen

| Bewerking | Verplichte velden | Uitvoer |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; optioneel After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; optioneel After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; optioneel Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; optioneel After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID of identificatie zoals `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID of identificatie en ten minste één gewijzigd veld | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID of identificatie | `deleted` |
| Add Issue Link | Issue ID of identificatie, Link URL | `link` |
| Create Comment | Issue ID of identificatie, Comment Body | `comment` |
| List Comments | Issue ID of identificatie, Limit; optioneel After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Alle tekstvelden ondersteunen [expressies](../reference/expression-dsl.md).

## Issue-velden

- **Team ID** en **Project ID** zijn Linear UUID's. Gebruik List Teams of List Projects om ze te vinden.
- **State ID** is de workflow-state UUID die wordt gebruikt bij het aanmaken of bijwerken van een issue. Gebruik List Workflow States om deze te vinden.
- **Assignee ID** is een Linear gebruikers-UUID. Gebruik List Team Members om deze te vinden.
- **Priority** accepteert `0` tot en met `4`: geen prioriteit, urgent, hoog, normaal en laag.
- Laat optionele update-velden leeg om hun huidige waarden te behouden.
- Stel een update-veld in op `null` om description, project, assignee of state te wissen.
- **Link URL** voegt een externe bijlagelink toe aan een issue.
- **Comment ID** is de Linear UUID voor een bestaande opmerking. Gebruik List Comments om deze te vinden.
- **Parent Comment ID** reageert op een bestaande Linear-opmerking bij het aanmaken van een opmerking.

## Paginering

Lijstbewerkingen kunnen ofwel één pagina retourneren ofwel automatisch elke pagina ophalen:

- Laat **Return All** uitgeschakeld om `Limit` en `After Cursor` handmatig te gebruiken.
- Schakel **Return All** in om Linear-cursors server-side te volgen, tot 10.000 resultaten.

Gepagineerde resultaten retourneren `pageInfo.hasNextPage` en `pageInfo.endCursor`. Geef de cursor door
aan **After Cursor** bij de volgende node-run om de volgende pagina op te halen wanneer **Return All** is uitgeschakeld.

## Voorbeelden

Een issue aanmaken op basis van upstream-invoer:

- Bewerking: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Een opmerking toevoegen aan een aangemaakt issue:

- Bewerking: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: optioneel, bij het reageren op een andere opmerking

Een opmerkingenthread oplossen:

- Bewerking: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Een externe link toevoegen aan een issue:

- Bewerking: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Pagineren door teamleden:

- Bewerking: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` bij de volgende run wanneer `hasNextPage` waar is

Workflow-state-ID's vinden voordat een issue wordt bijgewerkt:

- Bewerking: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Gebruik vervolgens `$listStates.states[0].id` als **State ID** in **Update Issue**

## Uitvoer

Elke geslaagde bewerking stelt het volgende in:

- `$linear.success`
- `$linear.operation`

Lijstbewerkingen stellen ook `count` beschikbaar en, waar van toepassing, `pageInfo`. Issue-bewerkingen stellen de
volledige Linear issue-payload beschikbaar en gemaksvelden zoals `identifier` en `url`.
Comment-mutaties stellen de volledige `comment`-payload beschikbaar, behalve Delete Comment, dat
`deleted` en `entityId` beschikbaar stelt.

## Gerelateerd

- [Referenties-tabblad](../tabs/credentials-tab.md)
- [Node-typen](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
