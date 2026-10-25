# GitHub mazgas

**GitHub** mazgas prideda natūralias GitHub REST operacijas prie workflow, panašiai kaip daugiapakopiai GitHub mazgai, kuriuos galite žinoti iš tokių įrankių kaip n8n.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | GitHub |
| Išvestis | `$nodeLabel.*` |

## Palaikomos operacijos

Šiuo metu mazgas teikia 40 veiksmų:

| Ištekliai | Veiksmai |
|-----------|----------|
| Saugykla | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organizacija / Vartotojas | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Problema | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Apžvalga | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Išleidimas | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| Failas | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Kredencialas

Sukurkite **GitHub** kredencialą [Kredencialų skirtuke](../tabs/credentials-tab.md) su:

- Asmeniniu prieigos žetonu
- Pasirinktinai pilnu REST API pagrindiniu URL GitHub Enterprise Server

Palikite pagrindinį URL tuščią GitHub.com. Rekomenduojami smulkūs PAT.

GitHub Enterprise Server atveju įveskite visą REST API galinį tašką, įskaitant `/api/v3`, pavyzdžiui,
`https://github.example.com/api/v3`. Nenaudokite tik žiniatinklio UI šaknies
(`https://github.example.com`).

Jei naudojate GitHub Enterprise Server ir vėliau redaguojate kredencialą, kad pakeistumėte žetoną, palikdami
`base_url` tuščią, išsaugosite esamą Enterprise galinį tašką. Naują URL įveskite tik tada, kai norite
pakeisti tą galinį tašką.

## Bendri laukai

Dauguma operacijų naudoja:

- **Savininkas** – Saugyklos savininkas, organizacijos pavadinimas arba vartotojo vardas
- **Saugykla** – Saugyklos pavadinimas

`List Organization Repositories` reikalauja tik **Savininko** (organizacijos pavadinimo) ir nenaudoja saugyklos lauko.

`List User Repositories` reikalauja tik **Savininko** (vartotojo vardo) ir nenaudoja saugyklos lauko.

`Get User Repositories` atitinka n8n vartotojo → gauti saugyklas veiksmą. `Get User Issues` grąžina
problemas, priskirtas autentifikuotam GitHub vartotojui pagal numatytuosius nustatymus. Nustatykite **Mentioned Filter** į bet kokią
ne tuščią reikšmę, kad grąžintumėte problemas, kuriose minimas autentifikuotas vartotojas. Taip pat palaiko
būsenos, žymų, atnaujinimo nuo, rūšiavimo, krypties ir puslapyje esančių filtrų nustatymus. `Invite User` reikalauja
organizacijos ir el. pašto adreso ir nenaudoja Savininko ar Saugyklos.

## Saugykla

Saugyklos operacijos apima metaduomenis, aptiktą licencijos turinį, bendruomenės sveikatos profilį ir
srauto įžvalgas. `List Popular Paths for Repository` ir
`List Top Referrers for Repository` grąžina GitHub geriausius srauto įrašus per pastarąsias 14 dienų ir
reikalauja saugyklos administravimo stūmimo prieigos.

`List Issues` palaiko pasirenkamus priskirtus asmenis, kūrėjus, minėtus vartotojus, kableliais atskirtas žymas,
atnaujinimo nuo laiko žymę, rūšiavimą ir krypties filtrus. `List Pull Requests` palaiko būseną, rūšiavimą,
kryptį ir puslapyje esančių kontrolės nustatymus.

`Get Repository Issues` ir `Get Repository Pull Requests` atskleidžia tas pačias API kaip jų sąrašo
analogiški n8n suderinami saugyklos veiksmų pavadinimai.

### Gauti saugyklos metaduomenis

`Get Repository` saugo GitHub visą atsakymą `$github.repository` ir taip pat atskleidžia
`$github.full_name`, `$github.default_branch`, `$github.private` ir `$github.url`.

Saugyklos payload dažnai apima:

- Tapatybė ir nuosavybė: ID, pavadinimas, visas pavadinimas, aprašymas, savininkas ir matomumas
- Saugyklos būsena: privati, fork, archyvuota, išjungta ir numatytoji šaka
- URL: GitHub puslapis, API, klonavimo, SSH ir Git URL
- Veikla ir dydis: sukūrimo, atnaujinimo ir stūmimo laiko žymės, dydis, žvaigždės, stebėtojai, forkai, prenumeratoriai ir atviros problemos
- Funkcijos: problemos, projektai, wiki, Pages, diskusijos, temos, kalba ir pagrindinis puslapis
- Licencija, sujungimo nustatymai, skambinančiojo leidimai, saugumo nustatymai ir fork tėvo/šaltinio metaduomenys, kai jie yra prieinami

Kai kurie administraciniai, leidimų, sujungimo ir saugumo laukai priklauso nuo kredencialo saugyklos
leidimų.

Pavyzdys:

- Savininkas: `heymrun`
- Saugykla: `heym`

## Problemos

Problemos operacijos palaiko pavadinimo/kūno laukus ir pasirenkamus JSON masyvo laukus žymoms ir priskirties asmenims.

`List Issues` grąžina tik saugyklos problemas. Pull requestai yra neįtraukiami; naudokite `List Pull Requests` PR rezultatams.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Redaguoti problemos laukų semantiką

`Edit Issue` atveju siunčiami tik tie laukai, kuriuos aiškiai nustatote:

- **Būsena** – Pasirinkite `Don't change`, `Open` arba `Closed`. Palikite nenustatytą, kad išlaikytumėte dabartinę būseną.
- **Būsenos priežastis** – Pasirinktinai nustatykite `Completed`, `Not Planned`, `Duplicate` arba `Reopened`.
- **Pavadinimas / Kūnas** – Palikite tuščią, kad išlaikytumėte dabartinę reikšmę.
- **Žymos / Priskirtieji asmenys** – Palikite lauką tuščią, kad išlaikytumėte dabartinę reikšmę. Naudokite `[]`, kad išvalytumėte visas žymas arba priskirtuosius asmenis. Naudokite JSON masyvą, pavyzdžiui, `["bug"]`, kad juos pakeistumėte.

`Edit Issue` reikalauja, kad bent vienas laukas būtų pakeistas vykdymo metu. Jei pateiksite tik problemos numerį, vykdymas nepavyks su GitHub API sluoksnio validacijos klaida.
## Užrakto Problema

`Lock Issue` priima neprivalomą **Užrakto priežastį**. Jei ji pateikiama, ji turi būti viena iš GitHub palaikomų reikšmių:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Palikite priežastį tuščią, kad užrakintumėte be konkrečios priežasties.

## Pull Request'ai

Sukurti PR reikalauja:

- Pavadinimo
- Head branch
- Base branch
- Neprivalomo turinio
- Neprivalomo juodraščio režimo

## Pull Request Apžvalgos

Apžvalgos operacijos atitinka GitHub pull request apžvalgos API:

| Operacija | Reikalingi laukai | Neprivalomi laukai |
|-----------|-------------------|---------------------|
| `Create Review` | Pull request numeris, įvykis | Turinio, commit ID |
| `Get Review` | Pull request numeris, apžvalgos ID | — |
| `List Reviews` | Pull request numeris | Per puslapį |
| `Update Review` | Pull request numeris, apžvalgos ID, turinys | — |

`Create Review` palaiko `Approve`, `Request Changes`, `Comment` ir `Pending`.
Turinys yra privalomas `Request Changes` ir `Comment`. Kai Commit ID yra tuščias, GitHub
apžvelgia paskutinį pull request commit.

## Išleidimai

| Operacija | Reikalingi laukai vykdymo metu | Dažnai neprivalomi |
|-----------|-------------------------------|---------------------|
| `Create Release` | Tag name | Išleidimo pavadinimas (title), turinys, tikslinė šaka, juodraštis, išankstinis leidimas |
| `Update Release` | Išleidimo ID | Tag name, išleidimo pavadinimas, turinys, tikslinė šaka, juodraštis, išankstinis leidimas |
| `Get Release` / `Delete Release` | Išleidimo ID | — |

`Update Release` gali aiškiai nustatyti `draft` / `prerelease` kaip `true` arba `false`.

## Workflows

Workflow operacijos palaiko:

- Repozitorijos workflows sąrašą
- Workflow gavimą pagal numerinį ID arba workflow failo pavadinimą
- Workflow įgalinimą arba išjungimą
- Apmokestinamo workflow naudojimo skaitymą pagal runner operacinę sistemą
- Workflow iškvietimą su ref arba šaka plius neprivalomas JSON įvesties objektas

GitHub šiuo metu uždaro `Get Workflow Usage` endpoint'ą. Workflows, naudojantys
šią operaciją, gali tekti migruoti, kai GitHub pašalins endpoint'ą.

`Dispatch Workflow` priima abi GitHub atsakymo formas: seną `204 No Content` ir naujesnį
`200` atsakymą, kuriame yra `workflow_run_id`, `run_url` ir `html_url`.

`Dispatch Workflow and Wait` iškviečia workflow ir stebi vykdymą, kol jo būsena bus
`completed`. Nustatykite laiką ir stebėjimo intervalą sekundėmis. Heym naudoja
`workflow_run_id`, kai GitHub grąžina naujesnį `200` atsakymą. Tradiciniam `204 No
Content` atsakymui, Heym atranda naujai sukurtą `workflow_dispatch` vykdymą pasirinktam
workflow ir ref, tada laukia to vykdymo.

## Failų Turinys

`Get File` skaito repozitorijos failą per GitHub turinio API ir dekoduoja teksto turinį, kai jis yra prieinamas. Dvejetainiai failai ir ne-UTF-8 turinys gali grąžinti metaduomenis be dekoduoto `content` lauko.

`List Files` grąžina katalogo įrašus iš repozitorijos turinio API nurodytam aplankui ir neprivalomam ref. Palikite **Directory Path** tuščią, kad išvardintumėte repozitorijos šaknį.

`Create or Update File` rašo teksto turinį į repozitorijos kelią naudojant:

- Failo kelią
- Commit žinutę
- Failo turinį
- Neprivalomą šaką

`Delete File` pašalina repozitorijos kelią naudodamas commit žinutę ir neprivalomą šaką. Jei failas egzistuoja, Heym automatiškai gauna dabartinį SHA prieš jį pašalindamas.

Jei failas jau egzistuoja, Heym automatiškai gauna dabartinį SHA prieš jį atnaujindamas.

## Puslapiavimas

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` ir `Get User Repositories` palaiko
**Per Page** (1–100). Heym prašo vieno puslapio rezultatų; nėra `page` lauko, skirto papildomiems puslapiams gauti toje pačioje operacijoje.


### Return all pages

Įjunkite **Return all pages**, kad vienas vykdymas sektų visus puslapius, pradedant nuo **Cursor**, jei jis nustatytas. Kiekviena užklausa prašo 100 elementų, nepriklausomai nuo **Per Page** reikšmės. Mazgas sustoja po maždaug 1 000 elementų (arba 100 užklausų): issue objektai yra maždaug po 6 KB, todėl didesnė riba sukurtų labai dideles mazgo išvestis. Jei sustoja anksčiau, vietoj klaidos grąžina tai, ką turi, su `has_more: true` ir `next_cursor`, o tęsti galite perduodami šį žymeklį kitam vykdymui. Sustabdžius Workflow arba pasiekus jo skirtąjį laiką, gavimas nutraukiamas tarp puslapių.

## Išvestis

Tiksli forma priklauso nuo pasirinktos operacijos. Dažni laukai apima:

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

Pakeiskite `github` su savo mazgo etikete.

## Pastabos

- Etiketės ir priskyrimai turi būti galiojančios JSON masyvai, kai pateikiami.
- Workflow iškvietimo įvestys turi būti galiojantis JSON objektas, kai pateikiamos.
- `Edit Issue` naudoja `state` tik tada, kai aiškiai nustatote; palikite jį nenustatytą, kad išlaikytumėte dabartinę problemos būseną.
- GitHub API leidimai priklauso nuo token apimčių arba smulkiai apibrėžtų repozitorijos leidimų, kuriuos suteikiate.

## Susiję

- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti ir valdyti GitHub kredencialus
- [Trečiųjų šalių integracijos](../reference/integrations.md) – GitHub kredencialų nustatymas ir Enterprise `base_url`
- [Agentų Mazgas](./agent-node.md) – Naudokite GitHub kredencialus su `@modelcontextprotocol/server-github`
- [Mazgų Tipai](../reference/node-types.md) – Pilnas mazgų katalogas
