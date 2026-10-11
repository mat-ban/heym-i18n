# GitHubi node

**GitHubi** node lisab workflow'le natiivsed GitHubi REST-operatsioonid, sarnaselt mitme operatsiooniga GitHubi node'idele, mida võite tunda sellistest tööriistadest nagu n8n.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Mandaat | GitHub |
| Väljund | `$nodeLabel.*` |

## Toetatud operatsioonid

Node pakub praegu 40 tegevust:

| Ressurss | Tegevused |
|----------|---------|
| Hoidla | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organisatsioon / Kasutaja | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| Fail | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Mandaat

Looge **GitHubi** mandaat jaotises [Mandaatide vahekaart](../tabs/credentials-tab.md), kasutades:

- Isiklikku juurdepääsu tokenit
- Valikulist täielikku REST API baas-URL-i GitHub Enterprise Serveri jaoks

Jätke baas-URL tühjaks GitHub.comi jaoks. Soovitatav on kasutada peeneteralisi PAT-e.

GitHub Enterprise Serveri puhul sisestage täielik REST API endpoint, sealhulgas `/api/v3`, näiteks
`https://github.example.com/api/v3`. Ärge sisestage ainult veebiliidese juurt
(`https://github.example.com`).

Kui kasutate GitHub Enterprise Serverit ja muudate hiljem mandaati tokeni vahetamiseks, siis
`base_url` tühjaks jätmine säilitab olemasoleva Enterprise endpoint'i. Sisestage uus URL ainult siis, kui soovite
seda endpoint'i muuta.

## Ühised väljad

Enamik operatsioone kasutab:

- **Owner** – Hoidla omanik, organisatsiooni nimi või kasutajanimi
- **Repository** – Hoidla nimi

`List Organization Repositories` nõuab ainult **Owner**-it (organisatsiooni nimi) ega kasuta hoidla välja.

`List User Repositories` nõuab ainult **Owner**-it (kasutajanimi) ega kasuta hoidla välja.

`Get User Repositories` peegeldab n8n-i User → Get Repositories tegevust. `Get User Issues` tagastab
vaikimisi autenditud GitHubi kasutajale määratud issue'd. Seadke **Mentioned Filter** mis tahes
mittetühjale väärtusele, et tagastada hoopis autenditud kasutajat mainivaid issue'sid. See toetab ka
oleku, siltide, updated-since, sortimise, suuna ja lehekülje filtrite kasutamist. `Invite User` nõuab
organisatsiooni ja e-posti aadressi ega kasuta Owner-it ega Repository't.

## Hoidla

Hoidla operatsioonid hõlmavad metaandmeid, tuvastatud litsentsi sisu, kogukonna tervise profiili ja
liikluse ülevaateid. `List Popular Paths for Repository` ja
`List Top Referrers for Repository` tagastavad GitHubi populaarseimad liikluskirjed viimase 14 päeva kohta ja
nõuavad hoidla haldamise push-õigust.

`List Issues` toetab valikulisi assignee, creator, mentioned user, komadega eraldatud siltide,
updated-since ajatempli, sortimise ja suuna filtreid. `List Pull Requests` toetab oleku, sortimise,
suuna ja lehekülje juhtelemente.

`Get Repository Issues` ja `Get Repository Pull Requests` pakuvad samu API-sid, mis nende List
vastavad, selgesõnaliste n8n-iga ühilduvate hoidla tegevuste nimede all.

### Get Repository metaandmed

`Get Repository` salvestab GitHubi täieliku vastuse muutujasse `$github.repository` ja pakub ka
`$github.full_name`, `$github.default_branch`, `$github.private` ja `$github.url`.

Hoidla payload sisaldab tavaliselt:

- Identiteet ja omandisuhe: ID, nimi, täisnimi, kirjeldus, omanik ja nähtavus
- Hoidla olek: private, fork, archived, disabled ja vaikeharu
- URL-id: GitHubi leht, API, kloon, SSH ja Git URL-id
- Aktiivsus ja suurus: loomise, uuendamise ja push'i ajatemplid, suurus, tähed, jälgijad, fork'id, tellijad ja avatud issue'd
- Funktsioonid: issues, projects, wiki, Pages, discussions, topics, language ja homepage
- Litsents, ühendamise seaded, kutsuja õigused, turbeseaded ja fork'i parent/source metaandmed, kui need on saadaval

Mõned haldus-, õigus-, ühendamis- ja turbeväljad sõltuvad mandaadi hoidla
õigustest.

Näide:

- Owner: `heymrun`
- Repository: `heym`

## Issue'd

Issue operatsioonid toetavad title/body välju ja valikulisi JSON-massiivi välju siltide ja assignee'de jaoks.

`List Issues` tagastab ainult hoidla issue'sid. Pull request'id on välistatud; PR-tulemuste jaoks kasutage `List Pull Requests`.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Edit Issue väljade semantika

`Edit Issue` puhul saadetakse GitHubile ainult väljad, mille olete selgesõnaliselt määranud:

- **State** – Valige `Don't change`, `Open` või `Closed`. Jätke määramata, et säilitada praegune olek.
- **State Reason** – Valikuliselt määrake `Completed`, `Not Planned`, `Duplicate` või `Reopened`.
- **Title / Body** – Jätke tühjaks, et säilitada praegune väärtus.
- **Labels / Assignees** – Jätke väli tühjaks, et säilitada praegune väärtus. Kasutage `[]`, et tühjendada kõik sildid või assignee'd. Kasutage JSON-massiivi nagu `["bug"]`, et need asendada.

`Edit Issue` nõuab käitusajal vähemalt ühe välja muutmist. Kui esitate ainult issue numbri, siis käivitamine ebaõnnestub GitHubi API kihi valideerimisveaga.
## Lock Issue

`Lock Issue` aktsepteerib valikulist **Lock reason** väärtust. Kui see on esitatud, peab see olema üks GitHubi toetatud väärtustest:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Jätke põhjus tühjaks, et lukustada ilma konkreetse põhjuseta.

## Pull Requests

Create PR nõuab:

- Pealkiri
- Head branch
- Base branch
- Valikuline sisu
- Valikuline mustandi režiim

## Pull Request Reviews

Review-operatsioonid vastavad GitHubi pull request review API-le:

| Operatsioon | Nõutud väljad | Valikulised väljad |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request number, event | Body, commit ID |
| `Get Review` | Pull request number, review ID | — |
| `List Reviews` | Pull request number | Per page |
| `Update Review` | Pull request number, review ID, body | — |

`Create Review` toetab `Approve`, `Request Changes`, `Comment` ja `Pending`.
Body on nõutud `Request Changes` ja `Comment` puhul. Kui Commit ID on tühi, vaatab GitHub
üle pull requesti viimase commit'i.

## Releases

| Operatsioon | Nõutud väljad käitusajal | Tavaliselt valikulised |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` saab selgesõnaliselt määrata `draft` / `prerelease` väärtuseks kas `true` või `false`.

## Workflows

Workflow-operatsioonid toetavad:

- Hoidla workflow'de loetlemist
- Workflow' saamist numbrilise ID või workflow failinime järgi
- Workflow' lubamist või keelamist
- Arveldatava workflow kasutuse lugemist runneri operatsioonisüsteemi järgi
- Workflow' käivitamist ref'i või branch'i ning valikulise JSON inputs-objektiga

GitHub on sulgemas `Get Workflow Usage` endpoint'i. Workflow'd, mis seda operatsiooni kasutavad,
võivad vajada migreerimist, kui GitHub endpoint'i eemaldab.

`Dispatch Workflow` aktsepteerib mõlemat GitHubi vastusevormi: vanemat `204 No Content` ja uuemat
`200` vastust, mis sisaldab `workflow_run_id`, `run_url` ja `html_url`.

`Dispatch Workflow and Wait` käivitab workflow' ja küsib käivituse olekut, kuni selle staatus on
`completed`. Seadistage timeout ja polling-intervall sekundites. Heym kasutab
`workflow_run_id`-d, kui GitHub tagastab uuema `200` vastuse. Traditsioonilise `204 No
Content` vastuse puhul tuvastab Heym äsja loodud `workflow_dispatch` käivituse valitud
workflow' ja ref'i jaoks ning ootab seejärel seda käivitust.

## File Contents

`Get File` loeb hoidla faili GitHubi contents API kaudu ja dekodeerib tekstisisu, kui see on saadaval. Binaarfailid ja mitte-UTF-8 sisu võivad tagastada metaandmed ilma dekodeeritud `content` väljata.

`List Files` tagastab kataloogikirjed hoidla contents API-st antud kaustatee ja valikulise ref'i jaoks. Jätke **Directory Path** tühjaks, et loetleda hoidla juurkataloog.

`Create or Update File` kirjutab tekstisisu hoidla teele, kasutades:

- File path
- Commit message
- File content
- Valikuline branch

`Delete File` eemaldab hoidla tee, kasutades commit message'i ja valikulist branch'i. Kui fail on olemas, hangib Heym enne kustutamist automaatselt praeguse SHA.

Kui fail on juba olemas, hangib Heym enne uuendamist automaatselt praeguse SHA.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` ja `Get User Repositories` toetavad
**Per Page** (1–100). Heym pärib ühe lehe tulemusi; sama operatsiooni raames täiendavate lehtede
toomiseks puudub `page` väli.

## Output

Täpne kuju sõltub valitud operatsioonist. Tavalised väljad hõlmavad:

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

Asendage `github` oma node'i sildiga.

## Notes

- Labels ja assignees peavad olema kehtivad JSON-massiivid, kui need on esitatud.
- Workflow dispatch inputs peavad olema kehtiv JSON-objekt, kui see on esitatud.
- `Edit Issue` kasutab `state` väärtust ainult siis, kui määrate selle selgesõnaliselt; jätke see määramata, et säilitada issue praegune olek.
- GitHub API õigused sõltuvad tokeni skoopidest või peeneteralistest hoidla õigustest, mille annate.

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – GitHubi mandaatide lisamine ja haldamine
- [Third-Party Integrations](../reference/integrations.md) – GitHubi mandaadi seadistamine ja Enterprise `base_url`
- [Agent Node](./agent-node.md) – GitHubi mandaatide kasutamine koos `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Täielik node'ide kataloog
