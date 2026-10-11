# Linear-nod

**Linear**-noden ansluter workflows till Linear GraphQL API för automatisering av ärenden och arbetsytor.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgift | Linear personlig API-nyckel eller OAuth2 |
| Utdata | `$nodeLabel.*` |

## Autentiseringsuppgift

Skapa en **Linear**-autentiseringsuppgift i fliken [Autentiseringsuppgifter](../tabs/credentials-tab.md). Välj ett
autentiseringsläge:

**Personlig API-nyckel**

1. Öppna **Settings → Security & Access → Personal API keys** i Linear.
2. Skapa en nyckel med åtkomst till den arbetsyta som ska automatiseras.
3. Klistra in nyckeln i en ny Linear-autentiseringsuppgift i Heym och använd **Test Connection** för att verifiera den.

**OAuth2**

1. Skapa ett Linear OAuth-program.
2. Registrera `{FRONTEND_URL}/api/credentials/linear/oauth/callback` som omdirigerings-URI.
3. Välj **OAuth2** i Heym, ange Client ID och Client Secret och klicka sedan på **Connect**.

Personliga API-nycklar och OAuth-token agerar som den användare som skapade eller auktoriserade dem.

## Åtgärder

| Åtgärd | Obligatoriska fält | Utdata |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; valfritt After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; valfritt After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; valfritt Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; valfritt After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID eller identifierare såsom `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID eller identifierare samt minst ett ändrat fält | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID eller identifierare | `deleted` |
| Add Issue Link | Issue ID eller identifierare, Link URL | `link` |
| Create Comment | Issue ID eller identifierare, Comment Body | `comment` |
| List Comments | Issue ID eller identifierare, Limit; valfritt After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Alla textfält stöder [uttryck](../reference/expression-dsl.md).

## Ärendefält

- **Team ID** och **Project ID** är Linear-UUID:er. Använd List Teams eller List Projects för att hämta dem.
- **State ID** är UUID för workflow-tillståndet som används vid skapande eller uppdatering av ett ärende. Använd List Workflow States för att hämta det.
- **Assignee ID** är en Linear-användar-UUID. Använd List Team Members för att hämta den.
- **Priority** accepterar `0` till `4`: ingen prioritet, brådskande, hög, normal och låg.
- Lämna valfria uppdateringsfält tomma för att bevara deras nuvarande värden.
- Ange ett uppdateringsfält till `null` för att rensa beskrivning, projekt, tilldelad eller tillstånd.
- **Link URL** lägger till en extern bilagelänk till ett ärende.
- **Comment ID** är Linear-UUID för en befintlig kommentar. Använd List Comments för att hämta det.
- **Parent Comment ID** svarar på en befintlig Linear-kommentar vid skapande av en kommentar.

## Paginering

List-åtgärder kan antingen returnera en sida eller automatiskt hämta varje sida:

- Lämna **Return All** avstängt för att använda `Limit` och `After Cursor` manuellt.
- Slå på **Return All** för att följa Linear-markörer på serversidan, upp till 10 000 resultat.

Sidindelade resultat returnerar `pageInfo.hasNextPage` och `pageInfo.endCursor`. Skicka markören till
**After Cursor** vid nästa nodkörning för att hämta nästa sida när **Return All** är avstängt.

## Exempel

Skapa ett ärende från indata uppströms:

- Åtgärd: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Lägg till en kommentar till ett skapat ärende:

- Åtgärd: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: valfritt, vid svar på en annan kommentar

Lös en kommentarstråd:

- Åtgärd: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Lägg till en extern länk till ett ärende:

- Åtgärd: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Paginera genom teammedlemmar:

- Åtgärd: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` vid nästa körning när `hasNextPage` är sant

Hämta workflow-tillstånds-ID:n innan ett ärende uppdateras:

- Åtgärd: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Använd sedan `$listStates.states[0].id` som **State ID** i **Update Issue**

## Utdata

Varje lyckad åtgärd anger:

- `$linear.success`
- `$linear.operation`

List-åtgärder exponerar även `count` och, där tillämpligt, `pageInfo`. Ärendeåtgärder exponerar den
kompletta Linear-ärende-payloaden samt bekvämlighetsfält såsom `identifier` och `url`.
Kommentarsmutationer exponerar den kompletta `comment`-payloaden, förutom Delete Comment, som exponerar
`deleted` och `entityId`.

## Relaterat

- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md)
- [Nodtyper](../reference/node-types.md)
- [Uttrycks-DSL](../reference/expression-dsl.md)
