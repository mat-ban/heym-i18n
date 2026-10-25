# GitHub-solmu

**GitHub**-solmu lisää työnkulkuihin natiiveja GitHub REST -operaatioita, samankaltaisesti kuin monitoimiset GitHub-solmut, joita saatat tuntea työkaluista kuten n8n.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | GitHub |
| Tuloste | `$nodeLabel.*` |

## Tuetut toiminnot

Solmu tarjoaa tällä hetkellä 40 toimintoa:

| Resurssi | Toiminnot |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Tunnistetiedot

Luo **GitHub**-tunnistetiedot [Tunnistetiedot-välilehdessä](../tabs/credentials-tab.md) seuraavin tiedoin:

- Henkilökohtainen käyttöoikeustunniste (personal access token)
- Valinnainen täydellinen REST API -päätepiste GitHub Enterprise Serverille

Jätä päätepiste tyhjäksi GitHub.com -käyttöön. Suosittelemme hienojakoisia PAT-tunnisteita.

GitHub Enterprise Server -käyttöön syötä täydellinen REST API -päätepiste, mukaan lukien `/api/v3`, esimerkiksi `https://github.example.com/api/v3`. Älä syötä vain verkkokäyttöliittymän juuriosoitetta (`https://github.example.com`).

Jos käytät GitHub Enterprise Serveria ja myöhemmin muokkaat tunnistetietoja uuden tunnisteen luomiseksi, tyhjän `base_url` -kentän jättäminen säilyttää olemassa olevan Enterprise-päätepisteen. Syötä uusi URL-osoite vain, kun haluat muuttaa kyseistä päätepistettä.

## Yleiset kentät

Useimmat toiminnot käyttävät:

- **Owner** – Repositorion omistaja, organisaation nimi tai käyttäjätunnus
- **Repository** – Repositorion nimi

`List Organization Repositories` vaatii vain **Owner** -kenttään organisaation nimen eikä käytä repositoriokenttää.

`List User Repositories` vaatii vain **Owner** -kenttään käyttäjätunnuksen eikä käytä repositoriokenttää.

`Get User Repositories` vastaa n8n:n User → Get Repositories -toimintoa. `Get User Issues` palauttaa oletusarvoisesti GitHub-käyttäjälle määritetyt ongelmat. Aseta **Mentioned Filter** -kenttään mikä tahansa ei-tyhjä arvo palauttaaksesi käyttäjää koskevat ongelmat. Se tukee myös tilaa, tunnisteita, päivitysajankohtaa, lajittelua, suuntaa ja sivukohtaista suodatusta. `Invite User` vaatii organisaation ja sähköpostiosoitteen eikä käytä Owner- tai Repository-kenttiä.

## Repository

Repository-toiminnot sisältävät metatiedot, havaittua lisenssisisältöä, yhteisön terveysprofiilia ja liikennetietoja. `List Popular Paths for Repository` ja `List Top Referrers for Repository` palauttavat GitHubin suosituimmat liikennetapahtumat viimeisen 14 päivän ajalta ja vaativat repositorion hallintaoikeudet.

`List Issues` tukee valinnaisia määrittelykenttiä kuten vastuuhenkilö, luoja, mainittu käyttäjä, pilkuilla erotetut tunnisteet, päivitysajankohta, lajittelu ja suunta. `List Pull Requests` tukee tilaa, lajittelua, suuntaa ja sivukohtaista hallintaa.

`Get Repository Issues` ja `Get Repository Pull Requests` tarjoavat samat API:t kuin niiden List-versiot n8n-yhteensopivina repositoriotoimintoina.

### Get Repository -metatiedot

`Get Repository` tallentaa GitHubin täydellisen vastauksen muuttujaan `$github.repository` ja paljastaa myös `$github.full_name`, `$github.default_branch`, `$github.private` ja `$github.url`.

Repositorion payload sisältää yleisesti:

- Identiteetti ja omistus: ID, nimi, täydellinen nimi, kuvaus, omistaja ja näkyvyys
- Repositorion tila: yksityinen, haara, arkistoitu, pois käytöstä ja oletushaara
- URL-osoitteet: GitHub-sivu, API, kloonaus, SSH ja Git-URL-osoitteet
- Aktiivisuus ja koko: luontiaika, päivitys- ja push-ajankohdat, koko, tähdet, tarkkailijat, haarat ja avoimet ongelmat
- Ominaisuudet: ongelmat, projektit, wiki, Pages, keskustelut, aiheet, kieli ja kotisivu
- Lisenssi, yhdistämisasetukset, kutsuvan käyttäjän oikeudet, turvallisuusasetukset ja haaran vanhempi/lähdemetatiedot, kun saatavilla

Jotkut hallinnolliset, käyttöoikeudet, yhdistämis- ja turvallisuuskentät riippuvat tunnistetietojen repositorio-oikeuksista.

Esimerkki:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue-toiminnot tukevat otsikko/teksti-kenttiä ja valinnaisia JSON-taulukkokenttiä tunnisteille ja vastuuhenkilöille.

`List Issues` palauttaa vain repositorion ongelmat. Pull requestit jätetään pois; käytä `List Pull Requests` -toimintoa PR-tulosten hakemiseen.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Edit Issue -kenttien semantiikka

`Edit Issue` -toiminnossa vain nimenomaisesti asetetut kentät lähetetään GitHubille:

- **State** – Valitse `Don't change`, `Open` tai `Closed`. Jätä asettamatta säilyttääksesi nykyisen tilan.
- **State Reason** – Aseta valinnaisesti `Completed`, `Not Planned`, `Duplicate` tai `Reopened`.
- **Title / Body** – Jätä tyhjäksi säilyttääksesi nykyisen arvon.
- **Labels / Assignees** – Jätä kenttä tyhjäksi säilyttääksesi nykyiset arvot. Käytä `[]` poistaaksesi kaikki tunnisteet tai vastuuhenkilöt. Käytä JSON-taulukkoa, kuten `["bug"]`, korvataksesi ne.

`Edit Issue` vaatii vähintään yhden muutettavan kentän suoritusaikana. Jos annat vain ongelmanumeron, suoritus epäonnistuu GitHub API -kerroksen validointivirheen vuoksi.
## Lukitse Issue

`Lock Issue` hyväksyy valinnaisen **Lukitus syyn**. Kun syy annetaan, sen on oltava yksi GitHubin tukemista arvoista:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Jätä syöte tyhjäksi lukitaksesi ilman erityistä syytä.

## Pull Requests

Pull Requestin luominen vaatii:

- Otsikon
- Head-haaran
- Base-haaran
- Valinnaisen tekstin
- Valinnaisen luonnos-tilan

## Pull Request -arvostelut

Arvosteluoperaatiot vastaavat GitHubin pull request -arvostelu API:a:

| Operaatio | Pakolliset kentät | Valinnaiset kentät |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request -numero, tapahtuma | Teksti, commit ID |
| `Get Review` | Pull request -numero, arvostelun ID | — |
| `List Reviews` | Pull request -numero | Per sivu |
| `Update Review` | Pull request -numero, arvostelun ID, teksti | — |

`Create Review` tukee `Approve`, `Request Changes`, `Comment` ja `Pending`.
Teksti on pakollinen `Request Changes` ja `Comment` -toiminnoille. Kun Commit ID on tyhjä, GitHub
arvioi pull requestin viimeisimmän commitin.

## Julkaisut

| Operaatio | Pakolliset kentät ajonaikana | Yleisesti valinnaiset |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag-nimi | Julkaisun nimi (otsikko), teksti, kohdehaara, luonnos, esijulkaisu |
| `Update Release` | Julkaisun ID | Tag-nimi, julkaisun nimi, teksti, kohdehaara, luonnos, esijulkaisu |
| `Get Release` / `Delete Release` | Julkaisun ID | — |

`Update Release` voi asettaa `draft` / `prerelease` eksplisiittisesti joko `true` tai `false`.

## Workflowt

Workflow-operaatiot tukevat:

- Repositoryn workflowjen listaus
- Workflown haku numeerisella ID:llä tai workflow-tiedoston nimellä
- Workflown käyttöönotto tai poisto käytöstä
- Workflown käyttö laskutettavana runner-käyttöjärjestelmän mukaan
- Workflown käynnistäminen ref- tai haara-arvolla sekä valinnaisella JSON-inputs-objektilla

GitHub on sulkemassa `Get Workflow Usage` -endpointin. Tätä operaatiota käyttävät workflowt
saattavat joutua migroimaan, kun GitHub poistaa endpointin.

`Dispatch Workflow` hyväksyy molemmat GitHubin vastausmuodot: vanhentuneen `204 No Content` ja uudemman
`200` vastauksen, joka sisältää `workflow_run_id`, `run_url` ja `html_url`.

`Dispatch Workflow and Wait` käynnistää workflown ja kyselyttää suorituksen, kunnes sen tila on
`completed`. Määritä aikakatkaisu ja kyselyväli sekunteina. Heym käyttää
`workflow_run_id`:tä, kun GitHub palauttaa uudemman `200` vastauksen. Perinteisellä `204 No
Content` vastauksella Heym löytää uuden `workflow_dispatch` -suorituksen valitulle workflowlle ja haaralle, odottaa sitten kyseistä suoritusta.

## Tiedostosisällöt

`Get File` lukee repositoryn tiedoston GitHubin sisältö-API:n kautta ja dekoodaa tekstisisällön, kun se on saatavilla. Binääritiedostot ja ei-UTF-8 sisällöt voivat palauttaa metatietoja ilman dekoodattua `content` -kenttää.

`List Files` palauttaa hakemiston sisällöt repositoryn sisältö-API:sta tietylle polulle ja valinnaiselle ref:lle. Jätä **Directory Path** tyhjäksi listataksesi repositoryn juuren.

`Create or Update File` kirjoittaa tekstisisällön repositoryn polkuun käyttäen:

- Tiedoston polkua
- Commit-viestiä
- Tiedoston sisältöä
- Valinnaista haaraa

`Delete File` poistaa repositoryn polun käyttäen commit-viestiä ja valinnaista haaraa. Jos tiedosto on olemassa, Heym hakee nykyisen SHA:n automaattisesti ennen sen poistamista.

Jos tiedosto on jo olemassa, Heym hakee nykyisen SHA:n automaattisesti ennen sen päivittämistä.

## Sivutus

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` ja `Get User Repositories` tukevat
**Per Page** (1–100). Heym pyytää yhden sivun tuloksia; samassa operaatiossa ei ole `page` -kenttää lisäsivujen hakemiseen.


### Return all pages

Ota **Return all pages** käyttöön, jotta yksi suoritus seuraa kaikkia sivuja alkaen kohdasta **Cursor**, jos se on asetettu. Jokainen pyyntö pyytää 100 kohdetta riippumatta **Per Page** -arvosta. Solmu pysähtyy noin 1 000 kohteen (tai 100 pyynnön) jälkeen: issue-objektit ovat noin 6 KB kukin, joten suurempi raja tuottaisi hyvin suuria solmun tulosteita. Jos se pysähtyy aiemmin, se palauttaa keräämänsä tiedot arvoilla `has_more: true` ja `next_cursor` virheen sijaan, ja voit jatkaa antamalla tämän kursorin seuraavalle suoritukselle. Workflow'n pysäyttäminen tai sen aikakatkaisun saavuttaminen päättää noudon sivujen välillä.

## Tuloste

Tarkka muoto riippuu valitusta operaatiosta. Yleisiä kenttiä ovat:

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

Korvaa `github` solmun nimikkeelläsi.

## Huomioita

- Otsikoiden ja vastuullisten on oltava kelvollisia JSON-taulukoita, kun ne annetaan.
- Workflow-dispatch-inputien on oltava kelvollinen JSON-objekti, kun ne annetaan.
- `Edit Issue` käyttää `state` -kenttää vain, kun se asetetaan eksplisiittisesti; jätä se asettamatta säilyttääksesi nykyisen issuen tilan.
- GitHub API -oikeudet riippuvat tokenin skooppista tai hienorakeisista repository-oikeuksista, jotka myönnät.

## Liittyvät

- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää ja hallinnoi GitHub-tunnistetietoja
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – GitHub-tunnistetietojen asennus ja Enterprise `base_url`
- [Agentti-solmu](./agent-node.md) – Käytä GitHub-tunnistetietoja `@modelcontextprotocol/server-github` -solmun kanssa
- [Solmutyypit](../reference/node-types.md) – Täysi solmukatalogi
