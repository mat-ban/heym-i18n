# Node Linear

El node **Linear** connecta els workflows a l'API GraphQL de Linear per a l'automatització d'incidències i espais de treball.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | Clau d'API personal de Linear o OAuth2 |
| Sortida | `$nodeLabel.*` |

## Credencial

Creeu una credencial **Linear** a la [Pestanya de credencials](../tabs/credentials-tab.md). Trieu un
mode d'autenticació:

**Clau d'API personal**

1. A Linear, obriu **Settings → Security & Access → Personal API keys**.
2. Creeu una clau amb accés a l'espai de treball que voleu automatitzar.
3. Enganxeu la clau en una credencial Linear nova a Heym i utilitzeu **Test Connection** per verificar-la.

**OAuth2**

1. Creeu una aplicació OAuth de Linear.
2. Registreu `{FRONTEND_URL}/api/credentials/linear/oauth/callback` com a URI de redirecció.
3. A Heym, trieu **OAuth2**, introduïu el Client ID i el Client Secret i feu clic a **Connect**.

Les claus d'API personals i els tokens OAuth actuen com l'usuari que els ha creat o autoritzat.

## Operacions

| Operació | Camps obligatoris | Sortida |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; opcional After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; opcional After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; opcional Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; opcional After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID o identificador com ara `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID o identificador i com a mínim un camp modificat | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID o identificador | `deleted` |
| Add Issue Link | Issue ID o identificador, Link URL | `link` |
| Create Comment | Issue ID o identificador, Comment Body | `comment` |
| List Comments | Issue ID o identificador, Limit; opcional After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Tots els camps de text admeten [expressions](../reference/expression-dsl.md).

## Camps d'incidència

- **Team ID** i **Project ID** són UUID de Linear. Utilitzeu List Teams o List Projects per descobrir-los.
- **State ID** és l'UUID de l'estat del workflow que s'utilitza en crear o actualitzar una incidència. Utilitzeu List Workflow States per descobrir-lo.
- **Assignee ID** és un UUID d'usuari de Linear. Utilitzeu List Team Members per descobrir-lo.
- **Priority** accepta valors de `0` a `4`: sense prioritat, urgent, alta, normal i baixa.
- Deixeu els camps opcionals d'actualització buits per conservar-ne els valors actuals.
- Establiu un camp d'actualització a `null` per esborrar la descripció, el projecte, l'assignat o l'estat.
- **Link URL** afegeix un enllaç adjunt extern a una incidència.
- **Comment ID** és l'UUID de Linear d'un comentari existent. Utilitzeu List Comments per descobrir-lo.
- **Parent Comment ID** respon a un comentari de Linear existent en crear un comentari.

## Paginació

Les operacions de llista poden retornar una sola pàgina o obtenir automàticament totes les pàgines:

- Deixeu **Return All** desactivat per utilitzar `Limit` i `After Cursor` manualment.
- Activeu **Return All** per seguir els cursors de Linear al costat del servidor, fins a 10.000 resultats.

Els resultats paginats retornen `pageInfo.hasNextPage` i `pageInfo.endCursor`. Introduïu el cursor a
**After Cursor** a l'execució següent del node per obtenir la pàgina següent quan **Return All** estigui desactivat.

## Exemples

Creeu una incidència a partir de l'entrada anterior:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Afegiu un comentari a una incidència creada:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: opcional, quan es respon a un altre comentari

Resoleu un fil de comentaris:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Afegiu un enllaç extern a una incidència:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Pagineu pels membres de l'equip:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` a l'execució següent quan `hasNextPage` sigui cert

Descobriu els ID d'estat del workflow abans d'actualitzar una incidència:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- A continuació, utilitzeu `$listStates.states[0].id` com a **State ID** a **Update Issue**
## Sortida

Cada operació completada correctament estableix:

- `$linear.success`
- `$linear.operation`

Les operacions de llista també exposen `count` i, quan escau, `pageInfo`. Les operacions d'incidències exposen
el payload complet d'incidència de Linear i camps de conveniència com ara `identifier` i `url`.
Les mutacions de comentaris exposen el payload complet de `comment`, excepte Delete Comment, que exposa
`deleted` i `entityId`.

## Relacionat

- [Pestanya Credencials](../tabs/credentials-tab.md)
- [Tipus de node](../reference/node-types.md)
- [DSL d'expressions](../reference/expression-dsl.md)
