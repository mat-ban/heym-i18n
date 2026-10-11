# Linear čvor

**Linear** čvor povezuje workflows s Linear GraphQL API-jem za automatizaciju issues i radnog prostora.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnica | Linear personal API key ili OAuth2 |
| Izlaz | `$nodeLabel.*` |

## Vjerodajnica

Izradite **Linear** vjerodajnicu u [Credentials Tab](../tabs/credentials-tab.md). Odaberite jedan
način autentifikacije:

**Personal API key**

1. U Linearu otvorite **Settings → Security & Access → Personal API keys**.
2. Izradite ključ s pristupom radnom prostoru koji želite automatizirati.
3. Zalijepite ključ u novu Linear vjerodajnicu u Heymu i upotrijebite **Test Connection** za provjeru.

**OAuth2**

1. Izradite Linear OAuth aplikaciju.
2. Registrirajte `{FRONTEND_URL}/api/credentials/linear/oauth/callback` kao redirect URI.
3. U Heymu odaberite **OAuth2**, unesite Client ID i Client Secret, zatim kliknite **Connect**.

Personal API keys i OAuth tokeni djeluju kao korisnik koji ih je izradio ili autorizirao.

## Operacije

| Operacija | Obavezna polja | Izlaz |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; neobavezno After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; neobavezno After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; neobavezno Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; neobavezno After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID ili identifikator poput `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID ili identifikator i najmanje jedno promijenjeno polje | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID ili identifikator | `deleted` |
| Add Issue Link | Issue ID ili identifikator, Link URL | `link` |
| Create Comment | Issue ID ili identifikator, Comment Body | `comment` |
| List Comments | Issue ID ili identifikator, Limit; neobavezno After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Sva tekstualna polja podržavaju [expressions](../reference/expression-dsl.md).

## Polja issues

- **Team ID** i **Project ID** su Linear UUID-ovi. Upotrijebite List Teams ili List Projects za njihovo pronalaženje.
- **State ID** je UUID workflow-stanja koji se koristi pri izradi ili ažuriranju issues. Upotrijebite List Workflow States za njegovo pronalaženje.
- **Assignee ID** je Linear user UUID. Upotrijebite List Team Members za njegovo pronalaženje.
- **Priority** prihvaća vrijednosti `0` do `4`: bez prioriteta, urgentno, visoko, normalno i nisko.
- Ostavite neobavezna polja za ažuriranje praznima kako biste sačuvali njihove trenutne vrijednosti.
- Postavite polje za ažuriranje na `null` kako biste obrisali description, project, assignee ili state.
- **Link URL** dodaje vanjsku poveznicu privitka na issue.
- **Comment ID** je Linear UUID postojećeg komentara. Upotrijebite List Comments za njegovo pronalaženje.
- **Parent Comment ID** odgovara na postojeći Linear komentar pri izradi komentara.

## Paginacija

Operacije popisa mogu vratiti jednu stranicu ili automatski dohvatiti svaku stranicu:

- Ostavite **Return All** isključenim za ručno korištenje `Limit` i `After Cursor`.
- Uključite **Return All** za praćenje Linear cursora na strani poslužitelja, do 10.000 rezultata.

Straničani rezultati vraćaju `pageInfo.hasNextPage` i `pageInfo.endCursor`. Prenesite cursor u
**After Cursor** pri sljedećem pokretanju čvora za dohvat sljedeće stranice kada je **Return All** isključen.

## Primjeri

Izradite issue iz ulaznih podataka:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Dodajte komentar na izrađeni issue:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: neobavezno, kada odgovarate na drugi komentar

Riješite nit komentara:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Dodajte vanjsku poveznicu na issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Straničite kroz članove tima:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` pri sljedećem pokretanju kada je `hasNextPage` istinit

Pronađite ID-ove workflow stanja prije ažuriranja issues:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Zatim upotrijebite `$listStates.states[0].id` kao **State ID** u **Update Issue**

## Izlaz

Svaka uspješna operacija postavlja:

- `$linear.success`
- `$linear.operation`

Operacije popisa također izlažu `count` i, gdje je primjenjivo, `pageInfo`. Operacije issues izlažu
kompletan Linear issue payload i praktična polja poput `identifier` i `url`.
Mutacije komentara izlažu kompletan `comment` payload, osim Delete Comment, koji izlaže
`deleted` i `entityId`.

## Povezano

- [Credentials Tab](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
