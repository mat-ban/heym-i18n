# Linear uzol

Uzol **Linear** prepája workflowy s Linear GraphQL API pre automatizáciu issue a pracovného priestoru.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | Linear personal API key alebo OAuth2 |
| Výstup | `$nodeLabel.*` |

## Prihlasovacie údaje

Vytvorte prihlasovacie údaje **Linear** na karte [Prihlasovacie údaje](../tabs/credentials-tab.md). Zvoľte jeden
režim autentifikácie:

**Personal API key**

1. V Linear otvorte **Settings → Security & Access → Personal API keys**.
2. Vytvorte kľúč s prístupom k pracovnému priestoru, ktorý chcete automatizovať.
3. Vložte kľúč do nových prihlasovacích údajov Linear v Heym a overte ho pomocou **Test Connection**.

**OAuth2**

1. Vytvorte Linear OAuth aplikáciu.
2. Zaregistrujte `{FRONTEND_URL}/api/credentials/linear/oauth/callback` ako redirect URI.
3. V Heym zvoľte **OAuth2**, zadajte Client ID a Client Secret a kliknite na **Connect**.

Personal API keys a OAuth tokeny konajú ako používateľ, ktorý ich vytvoril alebo autorizoval.

## Operácie

| Operácia | Povinné polia | Výstup |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; voliteľne After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; voliteľne After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; voliteľne Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; voliteľne After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID alebo identifikátor, napríklad `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID alebo identifikátor a aspoň jedno zmenené pole | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID alebo identifikátor | `deleted` |
| Add Issue Link | Issue ID alebo identifikátor, Link URL | `link` |
| Create Comment | Issue ID alebo identifikátor, Comment Body | `comment` |
| List Comments | Issue ID alebo identifikátor, Limit; voliteľne After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Všetky textové polia podporujú [expressions](../reference/expression-dsl.md).

## Polia issue

- **Team ID** a **Project ID** sú Linear UUID. Na ich zistenie použite List Teams alebo List Projects.
- **State ID** je UUID workflow-state, ktorý sa používa pri vytváraní alebo aktualizácii issue. Na jeho zistenie použite List Workflow States.
- **Assignee ID** je Linear user UUID. Na jeho zistenie použite List Team Members.
- **Priority** akceptuje hodnoty `0` až `4`: žiadna priorita, urgentná, vysoká, normálna a nízka.
- Voliteľné polia aktualizácie ponechajte prázdne, aby sa zachovali ich aktuálne hodnoty.
- Nastavením poľa aktualizácie na `null` vymažete description, project, assignee alebo state.
- **Link URL** pridá k issue odkaz na externú prílohu.
- **Comment ID** je Linear UUID existujúceho komentára. Na jeho zistenie použite List Comments.
- **Parent Comment ID** odpovedá na existujúci Linear komentár pri vytváraní komentára.

## Stránkovanie

Operácie zoznamu môžu buď vrátiť jednu stránku, alebo automaticky načítať všetky stránky:

- Ponechajte **Return All** vypnuté, ak chcete používať `Limit` a `After Cursor` manuálne.
- Zapnite **Return All**, aby sa Linear cursors sledovali na strane servera, až do 10 000 výsledkov.

Stránkované výsledky vracajú `pageInfo.hasNextPage` a `pageInfo.endCursor`. Pri ďalšom spustení uzla odovzdajte cursor do
**After Cursor**, aby sa načítala ďalšia stránka, keď je **Return All** vypnuté.

## Príklady

Vytvorenie issue zo vstupu z predchádzajúceho uzla:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Pridanie komentára k vytvorenému issue:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: voliteľné, pri odpovedi na iný komentár

Vyriešenie vlákna komentárov:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Pridanie externého odkazu k issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Stránkovanie cez členov tímu:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` pri ďalšom spustení, keď je `hasNextPage` true

Zistenie ID workflow states pred aktualizáciou issue:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Potom použite `$listStates.states[0].id` ako **State ID** v **Update Issue**

## Výstup

Každá úspešná operácia nastaví:

- `$linear.success`
- `$linear.operation`

Operácie zoznamu tiež poskytujú `count` a tam, kde je to relevantné, `pageInfo`. Operácie s issue poskytujú
kompletný Linear issue payload a pomocné polia, ako napríklad `identifier` a `url`.
Mutačné operácie s komentármi poskytujú kompletný `comment` payload, okrem Delete Comment, ktorá poskytuje
`deleted` a `entityId`.

## Súvisiace

- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md)
- [Typy uzlov](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
