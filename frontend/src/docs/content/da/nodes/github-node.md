# GitHub-node

**GitHub**-noden tilføjer native GitHub REST-operationer til et workflow, svarende til de multi-operationelle GitHub-noder, der kendes fra værktøjer som n8n.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | GitHub |
| Output | `$nodeLabel.*` |

## Understøttede operationer

Noden tilbyder i øjeblikket 40 handlinger:

| Ressource | Handlinger |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organisation / Bruger | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| Fil | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Legitimationsoplysninger

Opret en **GitHub**-legitimationsoplysning under [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) med:

- Et personligt adgangstoken (PAT)
- Valgfri fuld REST API-basis-URL for GitHub Enterprise Server

Lad basis-URL'en være tom for GitHub.com. Det anbefales at bruge fine-grained PATs.

For GitHub Enterprise Server indtastes den komplette REST API-endpoint inklusive `/api/v3`, f.eks. 
`https://github.example.com/api/v3`. Indtast ikke kun web UI-roden 
(`https://github.example.com`).

Hvis der anvendes GitHub Enterprise Server og legitimationsoplysningerne senere redigeres for at rotere tokenet, bevares den eksisterende Enterprise-endpoint ved at lade 
`base_url` stå tom. Indtast kun en ny URL, hvis endpointet skal ændres.

## Fælles felter

De fleste operationer bruger:

- **Owner** – Repository-ejer, organisationsnavn eller brugernavn
- **Repository** – Repository-navn

`List Organization Repositories` kræver kun **Owner** (organisationsnavnet) og bruger ikke repository-feltet.

`List User Repositories` kræver kun **Owner** (brugernavnet) og bruger ikke repository-feltet.

`Get User Repositories` spejler n8n's User → Get Repositories-handling. `Get User Issues` returnerer
som standard issues tildelt den autentificerede GitHub-bruger. Indstil **Mentioned Filter** til en
ikke-tom værdi for at returnere issues, der nævner den autentificerede bruger. Understøtter også
state, labels, updated-since, sort, direction og per-page-filtre. `Invite User` kræver en
organisation og e-mailadresse og bruger ikke Owner eller Repository.

## Repository

Repository-operationer inkluderer metadata, detekteret licensindhold, community health-profil og
trafikindsigter. `List Popular Paths for Repository` og
`List Top Referrers for Repository` returnerer GitHub's top trafikposter for de sidste 14 dage og
kræver repository-administrations push-adgang.

`List Issues` understøtter valgfri assignee, creator, mentioned user, kommaseparerede labels,
updated-since-timestamp, sort og direction-filtre. `List Pull Requests` understøtter state, sort,
direction og per-page-kontrol.

`Get Repository Issues` og `Get Repository Pull Requests` eksponerer de samme API'er som deres List-
modparter under eksplicitte n8n-kompatible repository-handlingsnavne.

### Hent Repository-metadata

`Get Repository` gemmer GitHub's komplette svar i `$github.repository` og eksponerer også
`$github.full_name`, `$github.default_branch`, `$github.private` og `$github.url`.

Repository-payload'en inkluderer typisk:

- Identitet og ejerskab: ID, navn, fuldt navn, beskrivelse, ejer og synlighed
- Repository-tilstand: private, fork, archived, disabled og default branch
- URL'er: GitHub-side, API, clone, SSH og Git-URL'er
- Aktivitet og størrelse: oprettelses-, opdaterings- og push-timestamps, størrelse, stars, watchers, forks, subscribers og open issues
- Funktioner: issues, projects, wiki, Pages, discussions, topics, sprog og homepage
- License, merge-indstillinger, caller-tilladelser, sikkerhedsindstillinger og fork parent/source-metadata, når tilgængelige

Nogle administrative, tilladelses-, merge- og sikkerhedsfelter afhænger af legitimationsoplysningernes repository-
tilladelser.

Eksempel:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue-operationer understøtter title/body-felter og valgfri JSON-array-felter for labels og assignees.

`List Issues` returnerer kun repository-issues. Pull requests udelukkes; brug `List Pull Requests` for PR-resultater.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Rediger Issue-feltsemantik

For `Edit Issue` sendes kun eksplicit angivne felter til GitHub:

- **State** – Vælg `Don't change`, `Open` eller `Closed`. Lad stå uændret for at bevare nuværende tilstand.
- **State Reason** – Valgfrit indstil `Completed`, `Not Planned`, `Duplicate` eller `Reopened`.
- **Title / Body** – Lad stå tomt for at bevare nuværende værdi.
- **Labels / Assignees** – Lad feltet stå tomt for at bevare nuværende værdi. Brug `[]` for at rydde alle labels eller assignees. Brug et JSON-array som `["bug"]` for at erstatte dem.

`Edit Issue` kræver mindst ét felt, der skal ændres under kørsel. Hvis der kun angives et issue-nummer, fejler kørslen med en valideringsfejl fra GitHub API-laget.
## Låsningsproblem

`Lock Issue` accepterer en valgfri **Låsningsårsag**. Hvis angivet, skal det være en af GitHub's understøttede værdier:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Lad årsagen være tom for at låse uden en specifik begrundelse.

## Pull Requests

Oprettelse af PR kræver:

- Titel
- Head branch
- Base branch
- Valgfri beskrivelse
- Valgfri kladde-tilstand

## Pull Request Reviews

Review-operationer matcher GitHub's pull request review API:

| Operation | Påkrævede felter | Valgfrie felter |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request-nummer, event | Beskrivelse, commit ID |
| `Get Review` | Pull request-nummer, review ID | — |
| `List Reviews` | Pull request-nummer | Per side |
| `Update Review` | Pull request-nummer, review ID, beskrivelse | — |

`Create Review` understøtter `Approve`, `Request Changes`, `Comment`, og `Pending`.
Beskrivelsen er påkrævet for `Request Changes` og `Comment`. Når Commit ID er tomt, gennemgår GitHub
pull request'ens seneste commit.

## Releases

| Operation | Påkrævede felter ved kørsel | Almindeligvis valgfrie |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag-navn | Release-navn (titel), beskrivelse, target branch, kladde, prerelease |
| `Update Release` | Release ID | Tag-navn, release-navn, beskrivelse, target branch, kladde, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` kan eksplicit angive `draft` / `prerelease` til enten `true` eller `false`.

## Workflows

Workflow-operationer understøtter:

- Listning af repository-workflows
- Hentning af et workflow ved numerisk ID eller workflow-filnavn
- Aktivering eller deaktivering af et workflow
- Læsning af fakturerbar workflow-brug efter runner-operativsystem
- Udsendelse af et workflow med en ref eller branch plus valgfrit JSON inputs-objekt

GitHub er i færd med at lukke `Get Workflow Usage`-endpointet. Workflows der bruger
denne operation kan blive nødt til at migrere, når GitHub fjerner endpointet.

`Dispatch Workflow` accepterer begge GitHub-svarformer: det ældre `204 No Content` og det nyere
`200`-svar indeholdende `workflow_run_id`, `run_url`, og `html_url`.

`Dispatch Workflow and Wait` udsender workflowet og afventer kørslen indtil dens status er
`completed`. Konfigurer timeout og polling-interval i sekunder. Heym bruger
`workflow_run_id` når GitHub returnerer det nyere `200`-svar. For det traditionelle `204 No
Content`-svar, finder Heym den nyligt oprettede `workflow_dispatch`-kørsel for det valgte
workflow og ref, og venter derefter på den kørsel.

## Filindhold

`Get File` læser en repository-fil gennem GitHub's contents-API og dekoder tekstindhold når tilgængeligt. Binære filer og ikke-UTF-8-indhold kan returnere metadata uden et dekodet `content`-felt.

`List Files` returnerer mappeindgange fra repository's contents-API for en given mappesti og valgfri ref. Lad **Directory Path** være tom for at liste repository-roden.

`Create or Update File` skriver tekstindhold til en repository-sti ved brug af:

- Filsti
- Commit-besked
- Filindhold
- Valgfri branch

`Delete File` fjerner en repository-sti ved brug af en commit-besked og valgfri branch. Hvis filen eksisterer, henter Heym den aktuelle SHA automatisk før sletning.

Hvis filen allerede eksisterer, henter Heym den aktuelle SHA automatisk før opdatering.

## Paginering

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories`, og `Get User Repositories` understøtter
**Per Side** (1–100). Heym anmoder om én side af resultater; der er intet `page`-felt til hentning af
yderligere sider i samme operation.


### Return all pages

Aktivér **Return all pages**, så én kørsel følger hver side, startende ved **Cursor**, når den er angivet. Hver anmodning beder om 100 elementer, uanset værdien af **Per Page**. Noden stopper efter cirka 1.000 elementer (eller 100 anmodninger): issue-objekter fylder cirka 6 KB hver, så en højere grænse ville give meget store node-output. Stopper den tidligt, returnerer den det, den har, med `has_more: true` og en `next_cursor` i stedet for at udløse en fejl, og hentningen kan fortsættes ved at give denne cursor videre til næste kørsel. Hvis Workflow stoppes, eller dets timeout nås, afsluttes hentningen mellem siderne.

## Output

Den præcise struktur afhænger af den valgte operation. Almindelige felter inkluderer:

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

Erstat `github` med nodens label.

## Noter

- Labels og assignees skal være gyldige JSON-arrays når angivet.
- Workflow dispatch inputs skal være et gyldigt JSON-objekt når angivet.
- `Edit Issue` bruger kun `state` når det eksplicit angives; lad det være uangivet for at bevare den nuværende issue-status.
- GitHub API-tilladelser afhænger af token-scopes eller fine-grained repository-tilladelser der tildeles.

## Relateret

- [Legitimationsoplysninger-fane](../tabs/credentials-tab.md) – Tilføj og håndter GitHub-legitimationsoplysninger
- [Tredjepartsintegrationer](../reference/integrations.md) – GitHub-legitimationsoplysningsopsætning og Enterprise `base_url`
- [Agent-node](./agent-node.md) – Brug GitHub-legitimationsoplysninger med `@modelcontextprotocol/server-github`
- [Node-typer](../reference/node-types.md) – Fuld nodekatalog
