# GitHub mezgls

**GitHub** mezgls pievieno workflow darbplūsmai native GitHub REST operācijas, līdzīgi daudzoperāciju GitHub mezgliem, ko varat pazīt no tādiem rīkiem kā n8n.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | GitHub |
| Izvade | `$nodeLabel.*` |

## Atbalstītās operācijas

Mezgls pašlaik nodrošina 40 darbības:

| Resurss | Darbības |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Akreditācijas dati

Izveidojiet **GitHub** akreditācijas datus sadaļā [Akreditācijas datu cilne](../tabs/credentials-tab.md) ar:

- Personīgo piekļuves token
- Neobligātu pilnu REST API bāzes URL GitHub Enterprise Server videi

Atstājiet bāzes URL tukšu GitHub.com videi. Ieteicams izmantot precīzi konfigurētus PAT (fine-grained PATs).

GitHub Enterprise Server videi ievadiet pilnu REST API endpoint, iekļaujot `/api/v3`, piemēram,
`https://github.example.com/api/v3`. Neievadiet tikai tīmekļa saskarnes sakni
(`https://github.example.com`).

Ja izmantojat GitHub Enterprise Server un vēlāk rediģējat akreditācijas datus, lai nomainītu token, atstājot
`base_url` tukšu, tiek saglabāts esošais Enterprise endpoint. Ievadiet jaunu URL tikai tad, ja vēlaties
mainīt šo endpoint.

## Biežāk izmantotie lauki

Lielākā daļa operāciju izmanto:

- **Owner** – Repository īpašnieks, organizācijas nosaukums vai lietotājvārds
- **Repository** – Repository nosaukums

`List Organization Repositories` prasa tikai **Owner** (organizācijas nosaukumu) un neizmanto repository lauku.

`List User Repositories` prasa tikai **Owner** (lietotājvārdu) un neizmanto repository lauku.

`Get User Repositories` atspoguļo n8n User → Get Repositories darbību. `Get User Issues` pēc noklusējuma atgriež
issue, kas piešķirti autentificētajam GitHub lietotājam. Iestatiet **Mentioned Filter** uz jebkuru
ne tukšu vērtību, lai tā vietā atgrieztu issue, kas piemin autentificēto lietotāju. Tas arī atbalsta
state, labels, updated-since, sort, direction un per-page filtrus. `Invite User` prasa
organizāciju un e-pasta adresi un neizmanto Owner vai Repository.

## Repository

Repository operācijas ietver metadatus, noteikto licences saturu, kopienas veselības profilu un
satiksmes ieskatus. `List Popular Paths for Repository` un
`List Top Referrers for Repository` atgriež GitHub populārākās satiksmes vienības par pēdējām 14 dienām un
prasa repository administrēšanas push piekļuvi.

`List Issues` atbalsta neobligātus assignee, creator, mentioned user, ar komatu atdalītus labels,
updated-since laika zīmogu, sort un direction filtrus. `List Pull Requests` atbalsta state, sort,
direction un per-page vadīklas.

`Get Repository Issues` un `Get Repository Pull Requests` nodrošina tās pašas API kā to List
līdzinieki ar skaidriem n8n saderīgiem repository darbību nosaukumiem.

### Get Repository metadati

`Get Repository` saglabā GitHub pilno atbildi `$github.repository` un arī nodrošina
`$github.full_name`, `$github.default_branch`, `$github.private` un `$github.url`.

Repository payload parasti ietver:

- Identitāti un piederību: ID, nosaukums, pilnais nosaukums, apraksts, īpašnieks un redzamība
- Repository stāvokli: private, fork, archived, disabled un default branch
- URL: GitHub lapa, API, clone, SSH un Git URL
- Aktivitāti un izmēru: izveides, atjaunināšanas un push laika zīmogi, izmērs, stars, watchers, forks, subscribers un open issues
- Funkcijas: issues, projects, wiki, Pages, discussions, topics, language un homepage
- Licenci, merge iestatījumus, izsaucēja atļaujas, drošības iestatījumus un fork parent/source metadatus, ja pieejami

Daži administratīvie, atļauju, merge un drošības lauki ir atkarīgi no akreditācijas datu repository
atļaujām.

Piemērs:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue operācijas atbalsta title/body laukus un neobligātus JSON masīva laukus labels un assignees.

`List Issues` atgriež tikai repository issue. Pull request tiek izslēgti; PR rezultātiem izmantojiet `List Pull Requests`.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Edit Issue lauku semantika

`Edit Issue` gadījumā GitHub tiek nosūtīti tikai tie lauki, kurus esat skaidri iestatījis:

- **State** – Izvēlieties `Don't change`, `Open` vai `Closed`. Atstājiet neiestatītu, lai saglabātu pašreizējo stāvokli.
- **State Reason** – Neobligāti iestatiet `Completed`, `Not Planned`, `Duplicate` vai `Reopened`.
- **Title / Body** – Atstājiet tukšu, lai saglabātu pašreizējo vērtību.
- **Labels / Assignees** – Atstājiet lauku tukšu, lai saglabātu pašreizējo vērtību. Izmantojiet `[]`, lai notīrītu visus labels vai assignees. Izmantojiet JSON masīvu, piemēram, `["bug"]`, lai tos aizstātu.

`Edit Issue` izpildes laikā prasa vismaz vienu maināmu lauku. Ja norādāt tikai issue numuru, izpilde neizdodas ar validācijas kļūdu no GitHub API slāņa.
## Lock Issue

`Lock Issue` pieņem neobligātu **Lock reason**. Ja tas ir norādīts, tam ir jābūt vienam no GitHub atbalstītajiem lielumiem:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Atstājiet iemeslu tukšu, lai bloķētu bez konkrēta iemesla.

## Pull Requests

Create PR prasa:

- Title
- Head branch
- Base branch
- Neobligātu body
- Neobligātu draft režīmu

## Pull Request Reviews

Review darbības atbilst GitHub pull request review API:

| Darbība | Obligātie lauki | Neobligātie lauki |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request numurs, event | Body, commit ID |
| `Get Review` | Pull request numurs, review ID | — |
| `List Reviews` | Pull request numurs | Per page |
| `Update Review` | Pull request numurs, review ID, body | — |

`Create Review` atbalsta `Approve`, `Request Changes`, `Comment` un `Pending`.
Body ir obligāts `Request Changes` un `Comment`. Ja Commit ID ir tukšs, GitHub
pārskata pull request jaunāko commit.

## Releases

| Darbība | Obligātie lauki izpildes laikā | Parasti neobligātie |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` var skaidri iestatīt `draft` / `prerelease` uz `true` vai `false`.

## Workflows

Workflow darbības atbalsta:

- Repozitorija workflow uzskaitīšanu
- Workflow iegūšanu pēc ciparu ID vai workflow faila nosaukuma
- Workflow iespējošanu vai atspējošanu
- Apmaksājamā workflow lietojuma nolasīšanu pēc runner operētājsistēmas
- Workflow palaišanu ar ref vai branch un neobligātu JSON inputs objektu

GitHub ir procesā, lai slēgtu `Get Workflow Usage` endpoint. Workflows, kas izmanto
šo darbību, var būt jāmigrē, kad GitHub noņems endpoint.

`Dispatch Workflow` pieņem abas GitHub atbildes formas: mantoto `204 No Content` un jaunāko
`200` atbildi, kas satur `workflow_run_id`, `run_url` un `html_url`.

`Dispatch Workflow and Wait` palaiž workflow un aptaujā run, līdz tā statuss ir
`completed`. Konfigurējiet timeout un aptaujas intervālu sekundēs. Heym izmanto
`workflow_run_id`, kad GitHub atgriež jaunāko `200` atbildi. Tradicionālajai `204 No
Content` atbildei Heym atklāj jaunizveidoto `workflow_dispatch` run atlasītajam
workflow un ref, pēc tam gaida šo run.

## File Contents

`Get File` nolasa repozitorija failu, izmantojot GitHub contents API, un atkodē teksta saturu, ja tas ir pieejams. Binārie faili un saturs, kas nav UTF-8, var atgriezt metadatus bez atkodēta `content` lauka.

`List Files` atgriež direktorijas ierakstus no repozitorija contents API norādītajai mapes path un neobligātam ref. Atstājiet **Directory Path** tukšu, lai uzskaitītu repozitorija sakni.

`Create or Update File` ieraksta teksta saturu repozitorija path, izmantojot:

- File path
- Commit message
- File content
- Neobligātu branch

`Delete File` noņem repozitorija path, izmantojot commit message un neobligātu branch. Ja fails pastāv, Heym automātiski iegūst pašreizējo SHA pirms tā dzēšanas.

Ja fails jau pastāv, Heym automātiski iegūst pašreizējo SHA pirms tā atjaunināšanas.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` un `Get User Repositories` atbalsta
**Per Page** (1–100). Heym pieprasa vienu rezultātu lapu; nav `page` lauka, lai iegūtu
papildu lapas tajā pašā darbībā.


### Return all pages

Ieslēdziet **Return all pages**, lai viena izpilde sekotu visām lapām, sākot no **Cursor**, ja tas ir iestatīts. Katrs pieprasījums prasa 100 vienumus neatkarīgi no **Per Page** vērtības. Mezgls apstājas pēc aptuveni 1000 vienumiem (vai 100 pieprasījumiem): issue objekti ir aptuveni 6 KB katrs, tāpēc lielāks ierobežojums radītu ļoti lielas mezgla izvades. Ja tas apstājas agrāk, tas kļūdas vietā atgriež sasniegto ar `has_more: true` un `next_cursor`, un varat turpināt, nododot šo kursoru nākamajai izpildei. Workflow apturēšana vai tā taimauta sasniegšana pārtrauc ielādi starp lapām.

## Output

Precīzā forma ir atkarīga no atlasītās darbības. Biežāk izmantotie lauki ietver:

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

Aizstājiet `github` ar sava node label.

## Notes

- Labels un assignees ir jābūt derīgiem JSON masīviem, ja tie ir norādīti.
- Workflow dispatch inputs ir jābūt derīgam JSON objektam, ja tas ir norādīts.
- `Edit Issue` izmanto `state` tikai tad, kad to skaidri iestatāt; atstājiet to neiestatītu, lai saglabātu pašreizējo issue state.
- GitHub API atļaujas ir atkarīgas no token scopes vai fine-grained repository atļaujām, ko piešķirat.

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – Pievienojiet un pārvaldiet GitHub akreditācijas datus
- [Third-Party Integrations](../reference/integrations.md) – GitHub akreditācijas datu iestatīšana un Enterprise `base_url`
- [Agent Node](./agent-node.md) – Izmantojiet GitHub akreditācijas datus ar `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Pilns node katalogs
