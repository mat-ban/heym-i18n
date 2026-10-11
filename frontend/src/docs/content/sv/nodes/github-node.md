# GitHub-nod

**GitHub**-noden lägger till inbyggda GitHub REST-åtgärder i en workflow, liknande de fleroperations-GitHub-noder som kan vara bekanta från verktyg som n8n.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgift | GitHub |
| Utdata | `$nodeLabel.*` |

## Åtgärder som stöds

Noden tillhandahåller för närvarande 40 åtgärder:

| Resurs | Åtgärder |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Autentiseringsuppgift

Skapa en **GitHub**-autentiseringsuppgift i fliken [Autentiseringsuppgifter](../tabs/credentials-tab.md) med:

- En personlig åtkomsttoken
- Valfri fullständig REST API-bas-URL för GitHub Enterprise Server

Lämna bas-URL:en tom för GitHub.com. Fine-grained PAT rekommenderas.

För GitHub Enterprise Server anges den fullständiga REST API-endpointen inklusive `/api/v3`, till exempel
`https://github.example.com/api/v3`. Ange inte enbart webbgränssnittets rot
(`https://github.example.com`).

Om GitHub Enterprise Server används och autentiseringsuppgiften senare redigeras för att rotera token,
bevarar en tom `base_url` den befintliga Enterprise-endpointen. Ange en ny URL endast när
endpointen ska ändras.

## Vanliga fält

De flesta åtgärder använder:

- **Owner** – Repository-ägare, organisationsnamn eller användarnamn
- **Repository** – Repository-namn

`List Organization Repositories` kräver endast **Owner** (organisationsnamnet) och använder inte repository-fältet.

`List User Repositories` kräver endast **Owner** (användarnamnet) och använder inte repository-fältet.

`Get User Repositories` motsvarar n8n:s User → Get Repositories-åtgärd. `Get User Issues` returnerar
som standard ärenden som tilldelats den autentiserade GitHub-användaren. Ange **Mentioned Filter** till ett
icke-tomt värde för att i stället returnera ärenden som nämner den autentiserade användaren. Den stöder även
filter för state, labels, updated-since, sort, direction och per-page. `Invite User` kräver en
organisation och e-postadress och använder inte Owner eller Repository.

## Repository

Repository-åtgärder omfattar metadata, upptäckt licensinnehåll, community health-profil och
trafikinsikter. `List Popular Paths for Repository` och
`List Top Referrers for Repository` returnerar GitHubs främsta trafikposter för de senaste 14 dagarna och
kräver push-åtkomst för repository-administration.

`List Issues` stöder valfria filter för assignee, creator, mentioned user, kommaavgränsade labels,
updated-since-tidsstämpel, sort och direction. `List Pull Requests` stöder state, sort,
direction och per-page-kontroller.

`Get Repository Issues` och `Get Repository Pull Requests` exponerar samma API:er som sina List-
motsvarigheter under explicita n8n-kompatibla repository-åtgärdsnamn.

### Hämta Repository-metadata

`Get Repository` lagrar GitHubs fullständiga svar i `$github.repository` och exponerar
även `$github.full_name`, `$github.default_branch`, `$github.private` och `$github.url`.

Repository-payloaden innehåller vanligtvis:

- Identitet och ägarskap: ID, namn, fullständigt namn, beskrivning, ägare och synlighet
- Repository-tillstånd: private, fork, archived, disabled och default branch
- URL:er: GitHub-sida, API, clone, SSH och Git-URL:er
- Aktivitet och storlek: tidsstämplar för skapande, uppdatering och push, storlek, stars, watchers, forks, subscribers och öppna ärenden
- Funktioner: issues, projects, wiki, Pages, discussions, topics, language och homepage
- Licens, merge-inställningar, anroparens behörigheter, säkerhetsinställningar och metadata för fork parent/source när tillgängligt

Vissa administrativa fält, behörighetsfält, merge-fält och säkerhetsfält beror på autentiseringsuppgiftens repository-
behörigheter.

Exempel:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue-åtgärder stöder fält för title/body och valfria JSON-array-fält för labels och assignees.

`List Issues` returnerar endast repository-ärenden. Pull requests exkluderas; använd `List Pull Requests` för PR-resultat.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Fältsemantik för Edit Issue

För `Edit Issue` skickas endast fält som uttryckligen angetts till GitHub:

- **State** – Välj `Don't change`, `Open` eller `Closed`. Lämna oangivet för att behålla aktuellt tillstånd.
- **State Reason** – Ange valfritt `Completed`, `Not Planned`, `Duplicate` eller `Reopened`.
- **Title / Body** – Lämna tomt för att behålla aktuellt värde.
- **Labels / Assignees** – Lämna fältet tomt för att behålla aktuellt värde. Använd `[]` för att rensa alla labels eller assignees. Använd en JSON-array som `["bug"]` för att ersätta dem.

`Edit Issue` kräver minst ett fält som ändras vid körning. Om endast ett issue-nummer anges misslyckas
körningen med ett valideringsfel från GitHub API-lagret.
## Lås ärende

`Lock Issue` accepterar en valfri **Lock reason**. När den anges måste den vara ett av GitHubs värden som stöds:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Lämna orsaken tom för att låsa utan en specifik anledning.

## Pull Requests

Skapa PR kräver:

- Titel
- Head branch
- Base branch
- Valfri body
- Valfritt draft-läge

## Pull Request-granskningar

Granskningsåtgärder matchar GitHubs API för pull request-granskningar:

| Åtgärd | Obligatoriska fält | Valfria fält |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request-nummer, event | Body, commit-ID |
| `Get Review` | Pull request-nummer, review-ID | — |
| `List Reviews` | Pull request-nummer | Per sida |
| `Update Review` | Pull request-nummer, review-ID, body | — |

`Create Review` stöder `Approve`, `Request Changes`, `Comment` och `Pending`.
Body krävs för `Request Changes` och `Comment`. När Commit ID är tomt granskar GitHub
pull requestens senaste commit.

## Releases

| Åtgärd | Obligatoriska fält vid körning | Vanligtvis valfria |
|-----------|---------------------------|-------------------|
| `Create Release` | Taggnamn | Release-namn (titel), body, målbranch, draft, prerelease |
| `Update Release` | Release-ID | Taggnamn, release-namn, body, målbranch, draft, prerelease |
| `Get Release` / `Delete Release` | Release-ID | — |

`Update Release` kan uttryckligen ange `draft` / `prerelease` till antingen `true` eller `false`.

## Workflows

Workflow-åtgärder stöder:

- Lista arkivets workflows
- Hämta en workflow via numeriskt ID eller workflow-filnamn
- Aktivera eller inaktivera en workflow
- Läsa fakturerbar workflow-användning per runner-operativsystem
- Starta en workflow med en ref eller branch samt ett valfritt JSON-inputobjekt

GitHub håller på att stänga ner endpointen `Get Workflow Usage`. Workflows som använder
denna åtgärd kan behöva migreras när GitHub tar bort endpointen.

`Dispatch Workflow` accepterar båda GitHubs svarsformer: äldre `204 No Content` och det nyare
`200`-svaret som innehåller `workflow_run_id`, `run_url` och `html_url`.

`Dispatch Workflow and Wait` startar workflowen och pollar körningen tills dess status är
`completed`. Konfigurera timeout och pollningsintervall i sekunder. Heym använder
`workflow_run_id` när GitHub returnerar det nyare `200`-svaret. För det traditionella `204 No
Content`-svaret identifierar Heym den nyskapade `workflow_dispatch`-körningen för den valda
workflowen och ref, och väntar sedan på den körningen.

## Filinnehåll

`Get File` läser en arkivfil via GitHubs contents-API och avkodar textinnehåll när det är tillgängligt. Binära filer och innehåll som inte är UTF-8 kan returnera metadata utan ett avkodat `content`-fält.

`List Files` returnerar katalogposter från arkivets contents-API för en given mappsökväg och valfri ref. Lämna **Directory Path** tomt för att lista arkivets rot.

`Create or Update File` skriver textinnehåll till en arkivsökväg med hjälp av:

- Filsökväg
- Commit-meddelande
- Filinnehåll
- Valfri branch

`Delete File` tar bort en arkivsökväg med ett commit-meddelande och valfri branch. Om filen finns hämtar Heym automatiskt aktuell SHA innan den tas bort.

Om filen redan finns hämtar Heym automatiskt aktuell SHA innan den uppdateras.

## Paginering

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` och `Get User Repositories` stöder
**Per Page** (1–100). Heym begär en sida med resultat; det finns inget `page`-fält för att hämta
ytterligare sidor i samma åtgärd.

## Utdata

Den exakta formen beror på den valda åtgärden. Vanliga fält inkluderar:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

Ersätt `github` med nodens etikett.

## Anteckningar

- Etiketter och tilldelade måste vara giltiga JSON-arrayer när de anges.
- Inputs för workflow-dispatch måste vara ett giltigt JSON-objekt när det anges.
- `Edit Issue` använder `state` endast när det uttryckligen anges; lämna det oangivet för att behålla ärendets aktuella status.
- GitHub API-behörigheter beror på de token-scopes eller finjusterade arkivbehörigheter som beviljas.

## Relaterat

- [Autentiseringsuppgifter-fliken](../tabs/credentials-tab.md) – Lägg till och hantera GitHub-autentiseringsuppgifter
- [Tredjepartsintegrationer](../reference/integrations.md) – Konfigurering av GitHub-autentiseringsuppgifter och Enterprise `base_url`
- [Agent-nod](./agent-node.md) – Använd GitHub-autentiseringsuppgifter med `@modelcontextprotocol/server-github`
- [Nodtyper](../reference/node-types.md) – Fullständig nodkatalog
