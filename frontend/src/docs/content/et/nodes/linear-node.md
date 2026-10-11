# Linear Node

**Linear** node ühendab workflow'd Linear GraphQL API-ga issue'de ja workspace'i automatiseerimiseks.

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Linear personal API key või OAuth2 |
| Output | `$nodeLabel.*` |

## Credential

Looge **Linear** credential jaotises [Credentials Tab](../tabs/credentials-tab.md). Valige üks autentimisviis:

**Personal API key**

1. Avage Linear'is **Settings → Security & Access → Personal API keys**.
2. Looge key, millel on juurdepääs workspace'ile, mida soovite automatiseerida.
3. Kleepige key Heym'is uue Linear credential'i sisse ja kasutage kinnitamiseks **Test Connection**.

**OAuth2**

1. Looge Linear OAuth rakendus.
2. Registreerige `{FRONTEND_URL}/api/credentials/linear/oauth/callback` redirect URI-na.
3. Valige Heym'is **OAuth2**, sisestage Client ID ja Client Secret, seejärel klõpsake **Connect**.

Personal API key'd ja OAuth tokenid toimivad kasutajana, kes need lõi või autoriseeris.

## Operations

| Operation | Required fields | Output |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; optional After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; optional After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; optional Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; optional After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID või identifier nagu `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID või identifier ja vähemalt üks muudetud väli | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID või identifier | `deleted` |
| Add Issue Link | Issue ID või identifier, Link URL | `link` |
| Create Comment | Issue ID või identifier, Comment Body | `comment` |
| List Comments | Issue ID või identifier, Limit; optional After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Kõik tekstiväljad toetavad [expressions](../reference/expression-dsl.md).

## Issue fields

- **Team ID** ja **Project ID** on Linear UUID-d. Kasutage nende leidmiseks List Teams või List Projects.
- **State ID** on workflow-state UUID, mida kasutatakse issue loomisel või uuendamisel. Kasutage selle leidmiseks List Workflow States.
- **Assignee ID** on Linear kasutaja UUID. Kasutage selle leidmiseks List Team Members.
- **Priority** aktsepteerib väärtusi `0` kuni `4`: no priority, urgent, high, normal ja low.
- Jätke valikulised uuendamise väljad tühjaks, et säilitada nende praegused väärtused.
- Määrake uuendamise väli väärtusele `null`, et tühjendada description, project, assignee või state.
- **Link URL** lisab issue'le välise manuse lingi.
- **Comment ID** on olemasoleva kommentaari Linear UUID. Kasutage selle leidmiseks List Comments.
- **Parent Comment ID** vastab olemasolevale Linear kommentaarile kommentaari loomisel.

## Pagination

List operations saavad kas tagastada ühe lehe või automaatselt hankida iga lehe:

- Jätke **Return All** välja lülitatuks, et kasutada käsitsi `Limit` ja `After Cursor`.
- Lülitage **Return All** sisse, et järgida Linear cursoreid serveripoolselt, kuni 10 000 tulemuseni.

Leheküljestatud tulemused tagastavad `pageInfo.hasNextPage` ja `pageInfo.endCursor`. Edastage cursor
**After Cursor** väljale järgmisel node'i käivitusel, et hankida järgmine leht, kui **Return All** on välja lülitatud.

## Examples

Looge issue upstream input'ist:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Lisage kommentaar loodud issue'le:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: valikuline, kui vastate teisele kommentaarile

Lahendage kommentaari lõim:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Lisage issue'le väline link:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Leheküljestage läbi team member'ite:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` järgmisel käivitusel, kui `hasNextPage` on tõene

Avastage workflow state ID-d enne issue uuendamist:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Seejärel kasutage `$listStates.states[0].id` väärtusena **State ID** väljal **Update Issue**

## Output

Iga edukas operation määrab:

- `$linear.success`
- `$linear.operation`

List operations eksponeerivad ka `count` ja vajadusel `pageInfo`. Issue operations eksponeerivad
täieliku Linear issue payload'i ja mugavusvälju nagu `identifier` ja `url`.
Comment mutatsioonid eksponeerivad täielikku `comment` payload'i, välja arvatud Delete Comment, mis eksponeerib
`deleted` ja `entityId`.

## Related

- [Credentials Tab](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
