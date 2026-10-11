# Linear mezgls

**Linear** mezgls savieno workflow ar Linear GraphQL API, lai automatizētu issue un workspace darbības.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | Linear personīgā API atslēga vai OAuth2 |
| Izvade | `$nodeLabel.*` |

## Akreditācijas dati

Izveidojiet **Linear** akreditācijas datus sadaļā [Akreditācijas datu cilne](../tabs/credentials-tab.md). Izvēlieties vienu
autentifikācijas režīmu:

**Personīgā API atslēga**

1. Linear atveriet **Settings → Security & Access → Personal API keys**.
2. Izveidojiet atslēgu ar piekļuvi workspace, kuru vēlaties automatizēt.
3. Ielīmējiet atslēgu jaunos Linear akreditācijas datos Heym un izmantojiet **Test Connection**, lai to pārbaudītu.

**OAuth2**

1. Izveidojiet Linear OAuth lietojumprogrammu.
2. Reģistrējiet `{FRONTEND_URL}/api/credentials/linear/oauth/callback` kā novirzīšanas URI.
3. Heym izvēlieties **OAuth2**, ievadiet Client ID un Client Secret, pēc tam noklikšķiniet uz **Connect**.

Personīgās API atslēgas un OAuth token darbojas kā lietotājs, kurš tās izveidoja vai autorizēja.

## Darbības

| Darbība | Obligātie lauki | Izvade |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; neobligāts After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; neobligāts After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; neobligāts Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; neobligāts After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID vai identifikators, piemēram, `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID vai identifikators un vismaz viens mainīts lauks | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID vai identifikators | `deleted` |
| Add Issue Link | Issue ID vai identifikators, Link URL | `link` |
| Create Comment | Issue ID vai identifikators, Comment Body | `comment` |
| List Comments | Issue ID vai identifikators, Limit; neobligāts After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Visi teksta lauki atbalsta [izteiksmes](../reference/expression-dsl.md).

## Issue lauki

- **Team ID** un **Project ID** ir Linear UUID. Izmantojiet List Teams vai List Projects, lai tos atrastu.
- **State ID** ir workflow-state UUID, ko izmanto, veidojot vai atjauninot issue. Izmantojiet List Workflow States, lai to atrastu.
- **Assignee ID** ir Linear lietotāja UUID. Izmantojiet List Team Members, lai to atrastu.
- **Priority** pieņem vērtības no `0` līdz `4`: nav prioritātes, steidzams, augsts, parasts un zems.
- Atstājiet neobligātos atjaunināšanas laukus tukšus, lai saglabātu to pašreizējās vērtības.
- Iestatiet atjaunināšanas lauku uz `null`, lai notīrītu description, project, assignee vai state.
- **Link URL** pievieno issue ārēju pielikuma saiti.
- **Comment ID** ir Linear UUID esošam comment. Izmantojiet List Comments, lai to atrastu.
- **Parent Comment ID** atbild uz esošu Linear comment, veidojot comment.

## Lapošana

Saraksta darbības var vai nu atgriezt vienu lapu, vai automātiski iegūt katru lapu:

- Atstājiet **Return All** izslēgtu, lai manuāli izmantotu `Limit` un `After Cursor`.
- Ieslēdziet **Return All**, lai servera pusē sekotu Linear kursoriem līdz pat 10 000 rezultātiem.

Lapotie rezultāti atgriež `pageInfo.hasNextPage` un `pageInfo.endCursor`. Nododiet kursoru
**After Cursor** nākamajā mezgla izpildē, lai iegūtu nākamo lapu, kad **Return All** ir izslēgts.

## Piemēri

Izveidojiet issue no iepriekšējās ievades:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Pievienojiet comment izveidotam issue:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: neobligāts, atbildot uz citu comment

Atrisiniet comment pavedienu:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Pievienojiet issue ārēju saiti:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Lapojiet cauri team members:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` nākamajā izpildē, kad `hasNextPage` ir true

Atklājiet workflow state ID pirms issue atjaunināšanas:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Pēc tam izmantojiet `$listStates.states[0].id` kā **State ID** sadaļā **Update Issue**

## Izvade

Katra veiksmīga darbība iestata:

- `$linear.success`
- `$linear.operation`

Saraksta darbības arī atklāj `count` un, ja piemērojams, `pageInfo`. Issue darbības atklāj
pilnu Linear issue payload un ērtības laukus, piemēram, `identifier` un `url`.
Comment mutācijas atklāj pilnu `comment` payload, izņemot Delete Comment, kas atklāj
`deleted` un `entityId`.

## Saistītais

- [Akreditācijas datu cilne](../tabs/credentials-tab.md)
- [Mezglu tipi](../reference/node-types.md)
- [Izteiksmju DSL](../reference/expression-dsl.md)
