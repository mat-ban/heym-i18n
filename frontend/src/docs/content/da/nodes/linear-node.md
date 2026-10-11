# Linear Node

**Linear**-noden forbinder workflows med Linear GraphQL API'en til automatisering af issues og arbejdsområder.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | Personlig Linear API-nøgle eller OAuth2 |
| Output | `$nodeLabel.*` |

## Legitimationsoplysninger

Opret en **Linear**-legitimationsoplysning under [Legitimationsfanen](../tabs/credentials-tab.md). Vælg én autentifikationsmetode:

**Personlig API-nøgle**

1. I Linear, åbn **Indstillinger → Sikkerhed & Adgang → Personlige API-nøgler**.
2. Opret en nøgle med adgang til det arbejdsområde, der skal automatiseres.
3. Indsæt nøglen i en ny Linear-legitimationsoplysning i Heym og brug **Test Forbindelse** til at verificere den.

**OAuth2**

1. Opret en Linear OAuth-applikation.
2. Registrer `{FRONTEND_URL}/api/credentials/linear/oauth/callback` som omdirigerings-URI.
3. I Heym, vælg **OAuth2**, indtast Client ID og Client Secret, og klik på **Forbind**.

Personlige API-nøgler og OAuth-tokens fungerer som den bruger, der oprettede eller godkendte dem.

## Operationer

| Operation | Påkrævede felter | Output |
|-----------|-----------------|--------|
| Hent Viewer | — | `viewer` |
| List Teams | Limit; valgfrit After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; valgfrit After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; valgfrit Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; valgfrit After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID eller identifikator som `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID eller identifikator og mindst ét ændret felt | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID eller identifikator | `deleted` |
| Add Issue Link | Issue ID eller identifikator, Link URL | `link` |
| Create Comment | Issue ID eller identifikator, Comment Body | `comment` |
| List Comments | Issue ID eller identifikator, Limit; valgfrit After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Alle tekstfelter understøtter [udtryk](../reference/expression-dsl.md).

## Issue-felter

- **Team ID** og **Project ID** er Linear UUID'er. Brug List Teams eller List Projects til at finde dem.
- **State ID** er workflow-state UUID'en, der bruges ved oprettelse eller opdatering af et issue. Brug List Workflow States til at finde den.
- **Assignee ID** er en Linear bruger-UUID. Brug List Team Members til at finde den.
- **Priority** accepterer `0` til `4`: ingen prioritet, urgent, high, normal og low.
- Lad valgfrie opdateringsfelter være tomme for at bevare deres nuværende værdier.
- Sæt et opdateringsfelt til `null` for at rydde beskrivelse, projekt, assignee eller state.
- **Link URL** tilføjer et eksternt vedhæftningslink til et issue.
- **Comment ID** er Linear UUID'en for en eksisterende kommentar. Brug List Comments til at finde den.
- **Parent Comment ID** svarer på en eksisterende Linear-kommentar, når der oprettes en kommentar.

## Paginering

List-operationer kan enten returnere én side eller automatisk hente alle sider:

- Lad **Return All** være slået fra for manuelt at bruge `Limit` og `After Cursor`.
- Slå **Return All** til for at følge Linear-cursorer serverside, op til 10.000 resultater.

Paginerede resultater returnerer `pageInfo.hasNextPage` og `pageInfo.endCursor`. Overfør cursoren til **After Cursor** ved næste node-kørsel for at hente næste side, når **Return All** er slået fra.

## Eksempler

Opret et issue fra upstream-input:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Tilføj en kommentar til et oprettet issue:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: valgfrit, når der svares på en anden kommentar

Afslut en kommentartråd:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Tilføj et eksternt link til et issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Paginer gennem teammedlemmer:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` ved næste kørsel, når `hasNextPage` er sand

Find workflow-state ID'er før opdatering af et issue:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Brug derefter `$listStates.states[0].id` som **State ID** i **Update Issue**

## Output

Ved hver succesfuld operation sættes:

- `$linear.success`
- `$linear.operation`

List-operationer eksponerer også `count` og, hvor relevant, `pageInfo`. Issue-operationer eksponerer den komplette Linear issue-payload og bekvemmelighedsfelter som `identifier` og `url`. Kommentarmutationer eksponerer den komplette `comment`-payload, bortset fra Delete Comment, som eksponerer `deleted` og `entityId`.

## Relateret

- [Legitimationsfanen](../tabs/credentials-tab.md)
- [Node-typer](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
