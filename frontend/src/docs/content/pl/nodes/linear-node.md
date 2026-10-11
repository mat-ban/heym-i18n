# Węzeł Linear

Węzeł **Linear** łączy workflow z API GraphQL Linear w celu automatyzacji zgłoszeń i przestrzeni roboczych.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | Linear personal API key lub OAuth2 |
| Wyjście | `$nodeLabel.*` |

## Dane logowania

Utwórz dane logowania **Linear** w zakładce [Dane logowania](../tabs/credentials-tab.md). Wybierz jeden
tryb uwierzytelniania:

**Personal API key**

1. W Linear otwórz **Settings → Security & Access → Personal API keys**.
2. Utwórz klucz z dostępem do przestrzeni roboczej, którą chcesz automatyzować.
3. Wklej klucz do nowych danych logowania Linear w Heym i użyj **Test Connection**, aby go zweryfikować.

**OAuth2**

1. Utwórz aplikację OAuth w Linear.
2. Zarejestruj `{FRONTEND_URL}/api/credentials/linear/oauth/callback` jako redirect URI.
3. W Heym wybierz **OAuth2**, wprowadź Client ID i Client Secret, a następnie kliknij **Connect**.

Personal API keys i tokeny OAuth działają w kontekście użytkownika, który je utworzył lub autoryzował.

## Operacje

| Operacja | Wymagane pola | Wyjście |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; opcjonalnie After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; opcjonalnie After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; opcjonalnie Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; opcjonalnie After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID lub identyfikator taki jak `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID lub identyfikator oraz co najmniej jedno zmienione pole | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID lub identyfikator | `deleted` |
| Add Issue Link | Issue ID lub identyfikator, Link URL | `link` |
| Create Comment | Issue ID lub identyfikator, Comment Body | `comment` |
| List Comments | Issue ID lub identyfikator, Limit; opcjonalnie After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Wszystkie pola tekstowe obsługują [wyrażenia](../reference/expression-dsl.md).

## Pola zgłoszenia

- **Team ID** i **Project ID** to identyfikatory UUID Linear. Aby je odnaleźć, użyj List Teams lub List Projects.
- **State ID** to UUID stanu workflow używanego podczas tworzenia lub aktualizacji zgłoszenia. Aby go odnaleźć, użyj List Workflow States.
- **Assignee ID** to UUID użytkownika Linear. Aby go odnaleźć, użyj List Team Members.
- **Priority** przyjmuje wartości od `0` do `4`: brak priorytetu, pilny, wysoki, normalny i niski.
- Pozostaw opcjonalne pola aktualizacji puste, aby zachować ich bieżące wartości.
- Ustaw pole aktualizacji na `null`, aby wyczyścić opis, projekt, assignee lub stan.
- **Link URL** dodaje link do zewnętrznego załącznika w zgłoszeniu.
- **Comment ID** to UUID Linear dla istniejącego komentarza. Aby go odnaleźć, użyj List Comments.
- **Parent Comment ID** tworzy odpowiedź na istniejący komentarz Linear podczas tworzenia komentarza.

## Paginacja

Operacje listy mogą zwracać jedną stronę lub automatycznie pobierać wszystkie strony:

- Pozostaw **Return All** wyłączone, aby ręcznie używać `Limit` i `After Cursor`.
- Włącz **Return All**, aby podążać za kursorami Linear po stronie serwera, do 10 000 wyników.

Wyniki stronicowane zwracają `pageInfo.hasNextPage` i `pageInfo.endCursor`. Przekaż kursor do
**After Cursor** przy następnym uruchomieniu węzła, aby pobrać kolejną stronę, gdy **Return All** jest wyłączone.

## Przykłady

Utwórz zgłoszenie na podstawie danych wejściowych z poprzedniego węzła:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Dodaj komentarz do utworzonego zgłoszenia:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: opcjonalnie, gdy odpowiadasz na inny komentarz

Rozwiąż wątek komentarzy:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Dodaj zewnętrzny link do zgłoszenia:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Stronicuj listę członków zespołu:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` przy następnym uruchomieniu, gdy `hasNextPage` ma wartość true

Odkryj identyfikatory stanów workflow przed aktualizacją zgłoszenia:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Następnie użyj `$listStates.states[0].id` jako **State ID** w **Update Issue**

## Wyjście

Każda udana operacja ustawia:

- `$linear.success`
- `$linear.operation`

Operacje listy udostępniają również `count` oraz, tam gdzie ma to zastosowanie, `pageInfo`. Operacje na zgłoszeniach udostępniają
kompletny payload zgłoszenia Linear oraz pola pomocnicze, takie jak `identifier` i `url`.
Mutacje komentarzy udostępniają kompletny payload `comment`, z wyjątkiem Delete Comment, który udostępnia
`deleted` i `entityId`.

## Powiązane

- [Zakładka Dane logowania](../tabs/credentials-tab.md)
- [Typy węzłów](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
