# Uzel Linear

Uzel **Linear** propojuje workflow s Linear GraphQL API pro automatizaci issue a pracovního prostoru.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaje | Linear personal API key nebo OAuth2 |
| Výstup | `$nodeLabel.*` |

## Přihlašovací údaje

Vytvořte přihlašovací údaje **Linear** na kartě [Přihlašovací údaje](../tabs/credentials-tab.md). Zvolte jeden
režim autentizace:

**Personal API key**

1. V Linear otevřete **Settings → Security & Access → Personal API keys**.
2. Vytvořte klíč s přístupem k pracovnímu prostoru, který chcete automatizovat.
3. Vložte klíč do nových přihlašovacích údajů Linear v Heym a pomocí **Test Connection** ověřte jeho funkčnost.

**OAuth2**

1. Vytvořte OAuth aplikaci Linear.
2. Zaregistrujte `{FRONTEND_URL}/api/credentials/linear/oauth/callback` jako redirect URI.
3. V Heym zvolte **OAuth2**, zadejte Client ID a Client Secret a poté klikněte na **Connect**.

Personal API keys a OAuth tokeny jednají jako uživatel, který je vytvořil nebo autorizoval.

## Operace

| Operace | Povinná pole | Výstup |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; volitelně After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; volitelně After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; volitelně Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; volitelně After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID nebo identifikátor, například `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID nebo identifikátor a alespoň jedno změněné pole | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID nebo identifikátor | `deleted` |
| Add Issue Link | Issue ID nebo identifikátor, Link URL | `link` |
| Create Comment | Issue ID nebo identifikátor, Comment Body | `comment` |
| List Comments | Issue ID nebo identifikátor, Limit; volitelně After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Všechna textová pole podporují [expressions](../reference/expression-dsl.md).

## Pole issue

- **Team ID** a **Project ID** jsou Linear UUID. Pro jejich zjištění použijte List Teams nebo List Projects.
- **State ID** je UUID workflow-state používaný při vytváření nebo aktualizaci issue. Pro jeho zjištění použijte List Workflow States.
- **Assignee ID** je Linear user UUID. Pro jeho zjištění použijte List Team Members.
- **Priority** přijímá hodnoty `0` až `4`: no priority, urgent, high, normal a low.
- Volitelná pole pro aktualizaci ponechte prázdná, aby si zachovala své aktuální hodnoty.
- Nastavením pole pro aktualizaci na `null` vymažete description, project, assignee nebo state.
- **Link URL** přidá k issue odkaz na externí přílohu.
- **Comment ID** je Linear UUID existujícího komentáře. Pro jeho zjištění použijte List Comments.
- **Parent Comment ID** při vytváření komentáře odpovídá na existující komentář Linear.

## Stránkování

Operace výpisu mohou buď vrátit jednu stránku, nebo automaticky načíst všechny stránky:

- Ponechte **Return All** vypnuté, chcete-li používat `Limit` a `After Cursor` ručně.
- Zapněte **Return All**, chcete-li na straně serveru následovat Linear cursory, až do 10 000 výsledků.

Stránkované výsledky vracejí `pageInfo.hasNextPage` a `pageInfo.endCursor`. Při dalším spuštění uzlu předejte cursor do
**After Cursor**, chcete-li načíst další stránku, když je **Return All** vypnuté.

## Příklady

Vytvoření issue ze vstupu předchozího uzlu:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Přidání komentáře k vytvořenému issue:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: volitelné, při odpovědi na jiný komentář

Vyřešení vlákna komentářů:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Přidání externího odkazu k issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Stránkování členů týmu:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` při dalším spuštění, když je `hasNextPage` true

Zjištění ID workflow state před aktualizací issue:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Poté použijte `$listStates.states[0].id` jako **State ID** v **Update Issue**

## Výstup

Každá úspěšná operace nastaví:

- `$linear.success`
- `$linear.operation`

Operace výpisu navíc zpřístupňují `count` a případně `pageInfo`. Operace s issue zpřístupňují
kompletní Linear issue payload a pomocná pole, jako jsou `identifier` a `url`.
Mutace komentářů zpřístupňují kompletní `comment` payload, s výjimkou Delete Comment, která zpřístupňuje
`deleted` a `entityId`.

## Související

- [Karta Přihlašovací údaje](../tabs/credentials-tab.md)
- [Typy uzlů](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
