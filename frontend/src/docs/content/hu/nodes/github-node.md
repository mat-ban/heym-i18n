# GitHub csomópont

A **GitHub** csomópont natív GitHub REST műveleteket ad egy workflow-hoz, hasonlóan a többműveletes GitHub csomópontokhoz, amelyeket olyan eszközökből ismerhet, mint az n8n.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adat | GitHub |
| Kimenet | `$nodeLabel.*` |

## Támogatott műveletek

A csomópont jelenleg 40 műveletet biztosít:

| Erőforrás | Műveletek |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Hitelesítési adat

Hozzon létre egy **GitHub** hitelesítési adatot a [Hitelesítési adatok fülön](../tabs/credentials-tab.md) a következőkkel:

- Személyes hozzáférési token
- Opcionális teljes REST API alap URL GitHub Enterprise Server esetén

A GitHub.com használatához hagyja üresen az alap URL-t. A finomhangolt PAT-ok használata javasolt.

GitHub Enterprise Server esetén adja meg a teljes REST API endpointot, beleértve a `/api/v3` részt is, például
`https://github.example.com/api/v3`. Ne csak a webes felület gyökerét adja meg
(`https://github.example.com`).

Ha GitHub Enterprise Servert használ, és később a token rotálásához szerkeszti a hitelesítési adatot, a
`base_url` üresen hagyása megőrzi a meglévő Enterprise endpointot. Csak akkor adjon meg új URL-t, ha
módosítani szeretné ezt az endpointot.

## Gyakori mezők

A legtöbb művelet a következőket használja:

- **Owner** – Repository tulajdonos, szervezet neve vagy felhasználónév
- **Repository** – Repository neve

A `List Organization Repositories` csak az **Owner** (a szervezet neve) megadását igényli, és nem használja a repository mezőt.

A `List User Repositories` csak az **Owner** (a felhasználónév) megadását igényli, és nem használja a repository mezőt.

A `Get User Repositories` az n8n User → Get Repositories műveletét tükrözi. A `Get User Issues` alapértelmezés szerint
a hitelesített GitHub felhasználóhoz rendelt issue-kat adja vissza. Állítsa a **Mentioned Filter** mezőt bármilyen
nem üres értékre, hogy inkább a hitelesített felhasználót említő issue-kat adja vissza. Támogatja továbbá
a state, labels, updated-since, sort, direction és per-page szűrőket. Az `Invite User` egy
szervezetet és e-mail címet igényel, és nem használja az Owner vagy Repository mezőt.

## Repository

A Repository műveletek metaadatokat, észlelt licenc tartalmat, közösségi állapotprofilt és
forgalmi betekintéseket tartalmaznak. A `List Popular Paths for Repository` és
a `List Top Referrers for Repository` a GitHub elmúlt 14 napra vonatkozó legnépszerűbb forgalmi bejegyzéseit
adja vissza, és repository adminisztrátori push hozzáférést igényel.

A `List Issues` támogatja az opcionális assignee, creator, mentioned user, vesszővel elválasztott labels,
updated-since időbélyeg, sort és direction szűrőket. A `List Pull Requests` támogatja a state, sort,
direction és per-page vezérlőket.

A `Get Repository Issues` és a `Get Repository Pull Requests` ugyanazokat az API-kat teszi elérhetővé, mint a List
megfelelőik, explicit n8n-kompatibilis repository műveletnevek alatt.

### Get Repository metaadatok

A `Get Repository` a GitHub teljes válaszát a `$github.repository` változóban tárolja, és elérhetővé teszi
a `$github.full_name`, `$github.default_branch`, `$github.private` és `$github.url` értékeket is.

A repository payload általában a következőket tartalmazza:

- Identitás és tulajdonjog: ID, név, teljes név, leírás, tulajdonos és láthatóság
- Repository állapot: private, fork, archived, disabled és default branch
- URL-ek: GitHub oldal, API, clone, SSH és Git URL-ek
- Aktivitás és méret: létrehozási, frissítési és push időbélyegek, méret, stars, watchers, forks, subscribers és nyitott issue-k
- Funkciók: issues, projects, wiki, Pages, discussions, topics, language és homepage
- Licenc, merge beállítások, hívói jogosultságok, biztonsági beállítások és fork szülő/forrás metaadatok, amikor elérhetők

Egyes adminisztratív, jogosultsági, merge és biztonsági mezők a hitelesítési adat repository
jogosultságaitól függenek.

Példa:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Az Issue műveletek támogatják a title/body mezőket és az opcionális JSON-tömb mezőket a labels és assignees számára.

A `List Issues` csak repository issue-kat ad vissza. A pull requestek ki vannak zárva; PR eredményekhez használja a `List Pull Requests` műveletet.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Edit Issue mező szemantika

Az `Edit Issue` esetén csak a kifejezetten beállított mezők kerülnek elküldésre a GitHubnak:

- **State** – Válassza a `Don't change`, `Open` vagy `Closed` lehetőséget. Hagyja beállítatlanul az aktuális állapot megtartásához.
- **State Reason** – Opcionálisan állítsa be a `Completed`, `Not Planned`, `Duplicate` vagy `Reopened` értéket.
- **Title / Body** – Hagyja üresen az aktuális érték megtartásához.
- **Labels / Assignees** – Hagyja üresen a mezőt az aktuális érték megtartásához. Használja a `[]` értéket az összes label vagy assignee törléséhez. Használjon JSON-tömböt, például `["bug"]`, a lecserélésükhöz.

Az `Edit Issue` futásidőben legalább egy módosítandó mezőt igényel. Ha csak egy issue számot ad meg, a végrehajtás a GitHub API réteg validációs hibájával meghiúsul.
## Issue zárolása

A `Lock Issue` elfogad egy opcionális **Zárolás oka** paramétert. Ha meg van adva, a GitHub által támogatott értékek egyikének kell lennie:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Hagyja üresen az okot, ha konkrét indoklás nélkül kívánja zárolni.

## Pull requestek

A PR létrehozásához az alábbiak szükségesek:

- Cím
- Forráság (head branch)
- Célág (base branch)
- Opcionális törzs (body)
- Opcionális piszkozat mód

## Pull request értékelések

Az értékelési műveletek megegyeznek a GitHub pull request review API-jával:

| Művelet | Kötelező mezők | Opcionális mezők |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request száma, esemény | Törzs, commit ID |
| `Get Review` | Pull request száma, review ID | — |
| `List Reviews` | Pull request száma | Oldalanként |
| `Update Review` | Pull request száma, review ID, törzs | — |

A `Create Review` támogatja az `Approve`, `Request Changes`, `Comment` és `Pending` értékeket.
A törzs kötelező a `Request Changes` és `Comment` esetében. Ha a Commit ID üres, a GitHub
a pull request legutóbbi commitját értékeli.

## Kiadások

| Művelet | Futásidőben kötelező mezők | Általában opcionális |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag név | Kiadás neve (cím), törzs, célág, piszkozat, előzetes kiadás |
| `Update Release` | Kiadás ID | Tag név, kiadás neve, törzs, célág, piszkozat, előzetes kiadás |
| `Get Release` / `Delete Release` | Kiadás ID | — |

Az `Update Release` kifejezetten `true` vagy `false` értékre állíthatja a `draft` / `prerelease` mezőket.

## Workflow-k

A workflow műveletek támogatják:

- A repository workflow-k listázását
- Egy workflow lekérését numerikus ID vagy workflow fájlnév alapján
- Egy workflow engedélyezését vagy letiltását
- A számlázható workflow-használat beolvasását futtató operációs rendszer szerint
- Egy workflow elindítását ref vagy branch, valamint opcionális JSON inputs objektum megadásával

A GitHub éppen kivezeti a `Get Workflow Usage` endpointot. Előfordulhat, hogy a műveletet használó
workflow-knak migrálniuk kell, amikor a GitHub eltávolítja az endpointot.

A `Dispatch Workflow` mindkét GitHub válaszformátumot elfogadja: a régi `204 No Content` és az újabb
`200` választ, amely `workflow_run_id`, `run_url` és `html_url` mezőket tartalmaz.

A `Dispatch Workflow and Wait` elindítja a workflow-t, és addig kérdezi le a futtatást, amíg annak állapota
`completed` nem lesz. A timeout és a lekérdezési intervallum másodpercben állítható be. A Heym a
`workflow_run_id` értéket használja, amikor a GitHub az újabb `200` választ adja vissza. A hagyományos `204 No
Content` válasz esetén a Heym felkutatja az újonnan létrehozott `workflow_dispatch` futtatást a kiválasztott
workflow-hoz és ref-hez, majd megvárja azt a futtatást.

## Fájltartalmak

A `Get File` a GitHub contents API-ján keresztül olvassa be a repository fájlt, és dekódolja a szöveges tartalmat, ha elérhető. A bináris fájlok és a nem UTF-8 tartalom metaadatokkal térhetnek vissza dekódolt `content` mező nélkül.

A `List Files` a repository contents API-ból adja vissza a könyvtárbejegyzéseket egy adott mappapálya és opcionális ref alapján. Hagyja üresen a **Könyvtár útvonala** mezőt a repository gyökérkönyvtárának listázásához.

A `Create or Update File` szöveges tartalmat ír egy repository útvonalra az alábbiak használatával:

- Fájl útvonala
- Commit üzenet
- Fájl tartalma
- Opcionális branch

A `Delete File` eltávolít egy repository útvonalat egy commit üzenet és opcionális branch használatával. Ha a fájl létezik, a Heym a törlés előtt automatikusan lekéri az aktuális SHA-t.

Ha a fájl már létezik, a Heym a frissítés előtt automatikusan lekéri az aktuális SHA-t.

## Lapozás

A `List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` és `Get User Repositories` támogatja
az **Oldalanként** (1–100) paramétert. A Heym egy oldalnyi eredményt kér le; nincs `page` mező további
oldalak lekéréséhez ugyanabban a műveletben.


### Return all pages

Kapcsolja be a **Return all pages** opciót, hogy egy futtatás minden oldalt végigkövessen, a **Cursor** értékétől kezdve, ha az be van állítva. Minden kérés 100 elemet kér, a **Per Page** értékétől függetlenül. A csomópont körülbelül 1000 elem (vagy 100 kérés) után leáll: az issue objektumok egyenként nagyjából 6 KB méretűek, ezért egy magasabb korlát nagyon nagy csomópont-kimenetet eredményezne. Ha korábban leáll, hiba helyett visszaadja a addig begyűjtött adatokat `has_more: true` értékkel és egy `next_cursor` értékkel, és a folytatáshoz ezt a kurzort kell átadni a következő futtatásnak. A Workflow leállítása vagy a Workflow időkorlátjának elérése az oldalak között megszakítja a lekérést.

## Kimenet

A pontos szerkezet a kiválasztott művelettől függ. A gyakori mezők a következők:

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

A `github` részt cserélje le a csomópont címkéjére.

## Megjegyzések

- A címkéknek és a hozzárendelteknek érvényes JSON tömböknek kell lenniük, ha meg vannak adva.
- A workflow indítási inputoknak érvényes JSON objektumnak kell lenniük, ha meg vannak adva.
- Az `Edit Issue` csak akkor használja a `state` mezőt, ha Ön kifejezetten beállítja; hagyja beállítatlanul az issue aktuális állapotának megtartásához.
- A GitHub API jogosultságai az Ön által megadott token scope-októl vagy finomhangolt repository jogosultságoktól függenek.

## Kapcsolódó

- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – GitHub hitelesítési adatok hozzáadása és kezelése
- [Külső integrációk](../reference/integrations.md) – GitHub hitelesítési adatok beállítása és Enterprise `base_url`
- [Agent csomópont](./agent-node.md) – GitHub hitelesítési adatok használata a `@modelcontextprotocol/server-github`-tal
- [Csomóponttípusok](../reference/node-types.md) – Teljes csomópontkatalógus
