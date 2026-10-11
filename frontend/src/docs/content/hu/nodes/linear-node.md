# Linear csomópont

A **Linear** csomópont a workflow-kat a Linear GraphQL API-hoz kapcsolja issue- és workspace-automatizáláshoz.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adatok | Linear személyes API-kulcs vagy OAuth2 |
| Kimenet | `$nodeLabel.*` |

## Hitelesítési adatok

Hozzon létre egy **Linear** hitelesítési adatot a [Hitelesítési adatok fülön](../tabs/credentials-tab.md). Válasszon egy
hitelesítési módot:

**Személyes API-kulcs**

1. A Linear felületén nyissa meg a **Settings → Security & Access → Personal API keys** menüpontot.
2. Hozzon létre egy kulcsot azzal a workspace-szel, amelyet automatizálni szeretne.
3. Illessze be a kulcsot egy új Linear hitelesítési adatba a Heym-ben, majd a **Test Connection** segítségével ellenőrizze azt.

**OAuth2**

1. Hozzon létre egy Linear OAuth alkalmazást.
2. Regisztrálja a `{FRONTEND_URL}/api/credentials/linear/oauth/callback` címet átirányítási URI-ként.
3. A Heym-ben válassza az **OAuth2** lehetőséget, adja meg a Client ID és Client Secret értékeket, majd kattintson a **Connect** gombra.

A személyes API-kulcsok és az OAuth tokenek annak a felhasználónak a nevében működnek, aki létrehozta vagy engedélyezte azokat.

## Műveletek

| Művelet | Kötelező mezők | Kimenet |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; opcionális After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; opcionális After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; opcionális Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; opcionális After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID vagy azonosító, például `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID vagy azonosító és legalább egy módosított mező | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID vagy azonosító | `deleted` |
| Add Issue Link | Issue ID vagy azonosító, Link URL | `link` |
| Create Comment | Issue ID vagy azonosító, Comment Body | `comment` |
| List Comments | Issue ID vagy azonosító, Limit; opcionális After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Minden szöveges mező támogatja a [kifejezéseket](../reference/expression-dsl.md).

## Issue mezők

- A **Team ID** és a **Project ID** Linear UUID-k. A List Teams vagy a List Projects művelettel derítheti fel őket.
- A **State ID** az a workflow-state UUID, amelyet issue létrehozásakor vagy frissítésekor használ. A List Workflow States művelettel derítheti fel.
- Az **Assignee ID** egy Linear felhasználói UUID. A List Team Members művelettel derítheti fel.
- A **Priority** a `0` és `4` közötti értékeket fogadja el: nincs prioritás, sürgős, magas, normál és alacsony.
- Az opcionális frissítési mezőket hagyja üresen, hogy megőrizze azok aktuális értékét.
- Állítson egy frissítési mezőt `null` értékre a description, a project, az assignee vagy a state törléséhez.
- A **Link URL** külső melléklet-hivatkozást ad az issue-hoz.
- A **Comment ID** egy létező hozzászólás Linear UUID-je. A List Comments művelettel derítheti fel.
- A **Parent Comment ID** egy létező Linear hozzászólásra válaszol hozzászólás létrehozásakor.

## Lapozás

A listázó műveletek vagy egyetlen oldalt adnak vissza, vagy automatikusan lekérnek minden oldalt:

- Ha a **Return All** ki van kapcsolva, a `Limit` és az `After Cursor` manuális használatával dolgozhat.
- Ha a **Return All** be van kapcsolva, a rendszer szerveroldalon követi a Linear cursorokat, legfeljebb 10 000 találatig.

A lapozott eredmények visszaadják a `pageInfo.hasNextPage` és a `pageInfo.endCursor` értékeket. Adja át a cursort
az **After Cursor** mezőnek a következő csomópontfuttatáskor a következő oldal lekéréséhez, ha a **Return All** ki van kapcsolva.

## Példák

Issue létrehozása egy korábbi csomópont bemenetéből:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Hozzászólás hozzáadása egy létrehozott issue-hoz:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: opcionális, ha egy másik hozzászólásra válaszol

Hozzászólásszál feloldása:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Külső hivatkozás hozzáadása egy issue-hoz:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Lapozás a csapattagok között:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` a következő futtatáskor, ha a `hasNextPage` igaz

Workflow state ID-k felderítése issue frissítése előtt:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Ezután használja a `$listStates.states[0].id` értéket **State ID**-ként az **Update Issue** műveletben

## Kimenet

Minden sikeres művelet beállítja:

- `$linear.success`
- `$linear.operation`

A listázó műveletek emellett `count` értéket, és ahol alkalmazható, `pageInfo` értéket is elérhetővé tesznek. Az issue-műveletek
a teljes Linear issue payloadot és kényelmi mezőket, például `identifier` és `url` értékeket tesznek elérhetővé.
A hozzászólás-módosítások a teljes `comment` payloadot teszik elérhetővé, kivéve a Delete Comment műveletet, amely
`deleted` és `entityId` értékeket tesz elérhetővé.

## Kapcsolódó

- [Hitelesítési adatok fül](../tabs/credentials-tab.md)
- [Csomóponttípusok](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
