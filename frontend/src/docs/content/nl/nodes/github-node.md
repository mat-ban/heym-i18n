# GitHub-node

De **GitHub**-node voegt native GitHub REST-operaties toe aan een workflow, vergelijkbaar met de multi-operation GitHub-nodes die u mogelijk kent van tools zoals n8n.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | GitHub |
| Uitvoer | `$nodeLabel.*` |

## Ondersteunde operaties

De node biedt momenteel 40 acties:

| Resource | Acties |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organisatie / Gebruiker | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| Bestand | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Referentie

Maak een **GitHub**-referentie aan in het tabblad [Referenties](../tabs/credentials-tab.md) met:

- Een personal access token
- Optionele volledige REST API-basis-URL voor GitHub Enterprise Server

Laat de basis-URL leeg voor GitHub.com. Fine-grained PAT's worden aanbevolen.

Voer voor GitHub Enterprise Server het volledige REST API-endpoint in, inclusief `/api/v3`, zoals
`https://github.example.com/api/v3`. Voer niet alleen de root van de web-UI in
(`https://github.example.com`).

Als u GitHub Enterprise Server gebruikt en de referentie later bewerkt om het token te roteren,
blijft het bestaande Enterprise-endpoint behouden wanneer u `base_url` leeg laat. Voer alleen een
nieuwe URL in wanneer u dat endpoint wilt wijzigen.

## Algemene velden

De meeste operaties gebruiken:

- **Owner** – Eigenaar van de repository, organisatienaam of gebruikersnaam
- **Repository** – Naam van de repository

`List Organization Repositories` vereist alleen **Owner** (de organisatienaam) en gebruikt het repository-veld niet.

`List User Repositories` vereist alleen **Owner** (de gebruikersnaam) en gebruikt het repository-veld niet.

`Get User Repositories` komt overeen met n8n's User → Get Repositories-actie. `Get User Issues` retourneert
standaard issues die zijn toegewezen aan de geauthenticeerde GitHub-gebruiker. Stel **Mentioned Filter** in op een
willekeurige niet-lege waarde om in plaats daarvan issues te retourneren waarin de geauthenticeerde gebruiker wordt genoemd. Deze ondersteunt ook
filters voor state, labels, updated-since, sort, direction en per-page. `Invite User` vereist een
organisatie en e-mailadres en gebruikt Owner of Repository niet.

## Repository

Repository-operaties omvatten metadata, gedetecteerde licentie-inhoud, community health profile en
traffic insights. `List Popular Paths for Repository` en
`List Top Referrers for Repository` retourneren GitHub's top traffic-vermeldingen van de laatste 14 dagen en
vereisen push-toegang voor repository-beheer.

`List Issues` ondersteunt optionele filters voor assignee, creator, genoemde gebruiker, door komma's gescheiden labels,
updated-since-timestamp, sort en direction. `List Pull Requests` ondersteunt besturingselementen voor state, sort,
direction en per-page.

`Get Repository Issues` en `Get Repository Pull Requests` bieden dezelfde API's als hun List-
tegenhangers onder expliciete n8n-compatibele repository-actienamen.

### Get Repository-metadata

`Get Repository` slaat GitHub's volledige respons op in `$github.repository` en biedt ook
`$github.full_name`, `$github.default_branch`, `$github.private` en `$github.url`.

De repository-payload bevat doorgaans:

- Identiteit en eigendom: ID, naam, volledige naam, beschrijving, eigenaar en zichtbaarheid
- Repository-status: private, fork, archived, disabled en default branch
- URL's: GitHub-pagina, API, clone, SSH en Git-URL's
- Activiteit en grootte: aanmaak-, update- en push-timestamps, grootte, stars, watchers, forks, subscribers en open issues
- Functies: issues, projects, wiki, Pages, discussions, topics, taal en homepage
- Licentie, merge-instellingen, machtigingen van de aanroeper, beveiligingsinstellingen en fork parent/source-metadata indien beschikbaar

Sommige administratieve, machtigings-, merge- en beveiligingsvelden zijn afhankelijk van de repository-
machtigingen van de referentie.

Voorbeeld:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue-operaties ondersteunen titel-/body-velden en optionele JSON-array-velden voor labels en assignees.

`List Issues` retourneert alleen repository-issues. Pull requests worden uitgesloten; gebruik `List Pull Requests` voor PR-resultaten.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Semantiek van Edit Issue-velden

Voor `Edit Issue` worden alleen velden die u expliciet instelt naar GitHub verzonden:

- **State** – Kies `Don't change`, `Open` of `Closed`. Laat leeg om de huidige state te behouden.
- **State Reason** – Stel optioneel `Completed`, `Not Planned`, `Duplicate` of `Reopened` in.
- **Title / Body** – Laat leeg om de huidige waarde te behouden.
- **Labels / Assignees** – Laat het veld leeg om de huidige waarde te behouden. Gebruik `[]` om alle labels of assignees te wissen. Gebruik een JSON-array zoals `["bug"]` om ze te vervangen.

`Edit Issue` vereist tijdens runtime ten minste één veld om te wijzigen. Als u alleen een issuenummer opgeeft, mislukt de uitvoering met een validatiefout vanuit de GitHub API-laag.
## Lock Issue

`Lock Issue` accepteert een optionele **Lock reason**. Indien opgegeven, moet deze een van de door GitHub ondersteunde waarden zijn:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Laat de reden leeg om te vergrendelen zonder specifieke reden.

## Pull Requests

Create PR vereist:

- Titel
- Head branch
- Base branch
- Optionele body
- Optionele draft-modus

## Pull Request Reviews

Review-operaties komen overeen met de pull request review API van GitHub:

| Operatie | Verplichte velden | Optionele velden |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request-nummer, event | Body, commit-ID |
| `Get Review` | Pull request-nummer, review-ID | — |
| `List Reviews` | Pull request-nummer | Per pagina |
| `Update Review` | Pull request-nummer, review-ID, body | — |

`Create Review` ondersteunt `Approve`, `Request Changes`, `Comment` en `Pending`.
De body is verplicht voor `Request Changes` en `Comment`. Wanneer Commit ID leeg is, beoordeelt GitHub
de laatste commit van de pull request.

## Releases

| Operatie | Verplichte velden tijdens uitvoering | Gangbaar optioneel |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (titel), body, target branch, draft, prerelease |
| `Update Release` | Release-ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release-ID | — |

`Update Release` kan `draft` / `prerelease` expliciet instellen op `true` of `false`.

## Workflows

Workflow-operaties ondersteunen:

- Het weergeven van repository-workflows
- Het ophalen van een workflow via numeriek ID of workflow-bestandsnaam
- Het in- of uitschakelen van een workflow
- Het lezen van factureerbaar workflow-gebruik per besturingssysteem van de runner
- Het dispatchen van een workflow met een ref of branch plus een optioneel JSON-inputs-object

GitHub is bezig met het uitfaseren van het `Get Workflow Usage`-endpoint. Workflows die
deze operatie gebruiken, moeten mogelijk migreren wanneer GitHub het endpoint verwijdert.

`Dispatch Workflow` accepteert beide GitHub-responsvormen: de legacy `204 No Content` en de nieuwere
`200`-respons met `workflow_run_id`, `run_url` en `html_url`.

`Dispatch Workflow and Wait` dispatcht de workflow en pollt de run tot de status
`completed` is. Configureer de timeout en het polling-interval in seconden. Heym gebruikt
`workflow_run_id` wanneer GitHub de nieuwere `200`-respons retourneert. Voor de traditionele `204 No
Content`-respons ontdekt Heym de nieuw aangemaakte `workflow_dispatch`-run voor de geselecteerde
workflow en ref, en wacht vervolgens op die run.

## File Contents

`Get File` leest een repository-bestand via de contents API van GitHub en decodeert tekstinhoud wanneer beschikbaar. Binaire bestanden en niet-UTF-8-inhoud kunnen metadata retourneren zonder een gedecodeerd `content`-veld.

`List Files` retourneert directory-items uit de repository contents API voor een opgegeven mappad en optionele ref. Laat **Directory Path** leeg om de repository-root weer te geven.

`Create or Update File` schrijft tekstinhoud naar een repository-pad met behulp van:

- Bestandspad
- Commit-bericht
- Bestandsinhoud
- Optionele branch

`Delete File` verwijdert een repository-pad met behulp van een commit-bericht en optionele branch. Als het bestand bestaat, haalt Heym automatisch de huidige SHA op voordat het wordt verwijderd.

Als het bestand al bestaat, haalt Heym automatisch de huidige SHA op voordat het wordt bijgewerkt.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` en `Get User Repositories` ondersteunen
**Per Page** (1–100). Heym vraagt één pagina met resultaten op; er is geen `page`-veld voor het ophalen
van aanvullende pagina's binnen dezelfde operatie.


### Return all pages

Schakel **Return all pages** in zodat één run elke pagina volgt, te beginnen bij **Cursor** als die is ingesteld. Elke aanvraag vraagt 100 items, ongeacht de waarde van **Per Page**. Het knooppunt stopt na ongeveer 1.000 items (of 100 aanvragen): issue-objecten zijn elk ongeveer 6 KB groot, dus een hogere limiet zou zeer grote knooppuntuitvoer opleveren. Stopt het eerder, dan geeft het terug wat het heeft met `has_more: true` en een `next_cursor` in plaats van een fout te veroorzaken, en u kunt doorgaan door die cursor aan de volgende run door te geven. Het stoppen van de Workflow of het bereiken van de Workflow-timeout beëindigt het ophalen tussen pagina's.

## Output

De exacte vorm is afhankelijk van de geselecteerde operatie. Gangbare velden zijn:

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

Vervang `github` door uw node-label.

## Notes

- Labels en assignees moeten geldige JSON-arrays zijn wanneer opgegeven.
- Workflow dispatch-inputs moeten een geldig JSON-object zijn wanneer opgegeven.
- `Edit Issue` gebruikt `state` alleen wanneer u dit expliciet instelt; laat het niet ingesteld om de huidige issue-status te behouden.
- GitHub API-machtigingen zijn afhankelijk van de token-scopes of fijnmazige repository-machtigingen die u verleent.

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – GitHub-referenties toevoegen en beheren
- [Third-Party Integrations](../reference/integrations.md) – GitHub-referentieconfiguratie en Enterprise `base_url`
- [Agent Node](./agent-node.md) – GitHub-referenties gebruiken met `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Volledige node-catalogus
