# Nodul Linear

Nodul **Linear** conectează workflow-urile la API-ul GraphQL Linear pentru automatizarea problemelor și a spațiilor de lucru.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditare | Cheie API personală Linear sau OAuth2 |
| Ieșire | `$nodeLabel.*` |

## Acreditare

Creați o acreditare **Linear** în [Fila Acreditări](../tabs/credentials-tab.md). Alegeți un mod
de autentificare:

**Cheie API personală**

1. În Linear, deschideți **Settings → Security & Access → Personal API keys**.
2. Creați o cheie cu acces la spațiul de lucru pe care doriți să îl automatizați.
3. Lipiți cheia într-o acreditare Linear nouă în Heym și utilizați **Test Connection** pentru a o verifica.

**OAuth2**

1. Creați o aplicație OAuth Linear.
2. Înregistrați `{FRONTEND_URL}/api/credentials/linear/oauth/callback` ca URI de redirecționare.
3. În Heym, alegeți **OAuth2**, introduceți Client ID și Client Secret, apoi faceți clic pe **Connect**.

Cheile API personale și token-urile OAuth acționează în numele utilizatorului care le-a creat sau autorizat.

## Operațiuni

| Operațiune | Câmpuri obligatorii | Ieșire |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; opțional After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; opțional After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; opțional Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; opțional After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID sau identificator precum `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID sau identificator și cel puțin un câmp modificat | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID sau identificator | `deleted` |
| Add Issue Link | Issue ID sau identificator, Link URL | `link` |
| Create Comment | Issue ID sau identificator, Comment Body | `comment` |
| List Comments | Issue ID sau identificator, Limit; opțional After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Toate câmpurile text acceptă [expresii](../reference/expression-dsl.md).

## Câmpuri pentru probleme

- **Team ID** și **Project ID** sunt UUID-uri Linear. Utilizați List Teams sau List Projects pentru a le descoperi.
- **State ID** este UUID-ul stării workflow-ului utilizat la crearea sau actualizarea unei probleme. Utilizați List Workflow States pentru a-l descoperi.
- **Assignee ID** este un UUID de utilizator Linear. Utilizați List Team Members pentru a-l descoperi.
- **Priority** acceptă valori de la `0` la `4`: fără prioritate, urgentă, ridicată, normală și scăzută.
- Lăsați câmpurile opționale de actualizare goale pentru a le păstra valorile curente.
- Setați un câmp de actualizare la `null` pentru a goli descrierea, proiectul, responsabilul sau starea.
- **Link URL** adaugă un link de atașament extern la o problemă.
- **Comment ID** este UUID-ul Linear pentru un comentariu existent. Utilizați List Comments pentru a-l descoperi.
- **Parent Comment ID** răspunde la un comentariu Linear existent la crearea unui comentariu.

## Paginare

Operațiunile de listare pot fie să returneze o singură pagină, fie să preia automat fiecare pagină:

- Lăsați **Return All** dezactivat pentru a utiliza manual `Limit` și `After Cursor`.
- Activați **Return All** pentru a urmări cursorii Linear pe partea de server, până la 10.000 de rezultate.

Rezultatele paginate returnează `pageInfo.hasNextPage` și `pageInfo.endCursor`. Transmiteți cursorul în
**After Cursor** la următoarea rulare a nodului pentru a prelua pagina următoare când **Return All** este dezactivat.

## Exemple

Creați o problemă din intrarea upstream:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Adăugați un comentariu la o problemă creată:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: opțional, când răspundeți la un alt comentariu

Rezolvați un fir de comentarii:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Adăugați un link extern la o problemă:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Paginați prin membrii echipei:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` la următoarea rulare când `hasNextPage` este true

Descoperiți ID-urile stărilor workflow-ului înainte de a actualiza o problemă:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Apoi utilizați `$listStates.states[0].id` ca **State ID** în **Update Issue**

## Ieșire

Fiecare operațiune reușită setează:

- `$linear.success`
- `$linear.operation`

Operațiunile de listare expun de asemenea `count` și, acolo unde este cazul, `pageInfo`. Operațiunile pe probleme expun
payload-ul complet al problemei Linear și câmpuri de confort precum `identifier` și `url`.
Mutațiile de comentarii expun payload-ul complet `comment`, cu excepția Delete Comment, care expune
`deleted` și `entityId`.

## Resurse conexe

- [Fila Acreditări](../tabs/credentials-tab.md)
- [Tipuri de noduri](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
