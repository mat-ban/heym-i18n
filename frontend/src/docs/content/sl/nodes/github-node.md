# GitHub Vozlišče

Vozlišče **GitHub** dodaja nativne GitHub REST operacije v workflow, podobno kot večoperacijska GitHub vozlišča, ki jih morda poznate iz orodij, kot je n8n.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | GitHub |
| Izhod | `$nodeLabel.*` |

## Podprte Operacije

Vozlišče trenutno nudi 40 dejanj:

| Vir | Dejanji |
|----------|---------|
| Repozitorij | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organizacija / Uporabnik | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Težava | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Pregled | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Izdaja | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| Datoteka | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Poverilnica

Ustvarite **GitHub** poverilnico na [Zavihek Poverilnice](../tabs/credentials-tab.md) z:

- Osebno dostopno žetono
- Neobvezno polno osnovno URL za REST API za GitHub Enterprise Server

Pustite osnovni URL prazen za GitHub.com. Priporočamo uporabo natančnih PAT-ov.

Za GitHub Enterprise Server vnesite celoten REST API endpoint, vključno z `/api/v3`, na primer
`https://github.example.com/api/v3`. Ne vnašajte samo korenskega URL-ja spletnega vmesnika
(`https://github.example.com`).

Če uporabljate GitHub Enterprise Server in kasneje uredite poverilnico za rotacijo žetona, pustite
`base_url` prazen, da ohranite obstoječi Enterprise endpoint. Vnesite nov URL le, ko želite
spremeniti ta endpoint.

## Skupna Polja

Večina operacij uporablja:

- **Lastnik** – Lastnik repozitorija, ime organizacije ali uporabniško ime
- **Repozitorij** – Ime repozitorija

`List Organization Repositories` zahteva le **Lastnika** (ime organizacije) in ne uporablja polja repozitorija.

`List User Repositories` zahteva le **Lastnika** (uporabniško ime) in ne uporablja polja repozitorija.

`Get User Repositories` odraža n8n-ovo dejanje Uporabnik → Get Repositories. `Get User Issues` privzeto vrača
težave, dodeljene overjenemu uporabniku GitHub. Nastavite **Mentioned Filter** na katero koli
neprazno vrednost, da vrnete težave, ki omenjajo overjenega uporabnika. Prav tako podpira
filtre za stanje, oznake, časovno oznako posodobitve, razvrščanje, smer in število na stran. `Invite User` zahteva
organizacijo in e-poštni naslov ter ne uporablja Lastnika ali Repozitorija.

## Repozitorij

Operacije repozitorija vključujejo metapodatke, zaznano vsebino licence, profil skupnosti in
vpoglede v promet. `List Popular Paths for Repository` in
`List Top Referrers for Repository` vračata najboljše prometne vnose GitHub za zadnjih 14 dni in
zahtevata dostop do upravljanja repozitorija.

`List Issues` podpira neobvezne dodelitve, ustvarjalce, omenjene uporabnike, oznake ločene z vejicami,
časovno oznako posodobitve, razvrščanje in smerne filtre. `List Pull Requests` podpira stanje, razvrščanje,
smer in nadzor nad številom na stran.

`Get Repository Issues` in `Get Repository Pull Requests` izpostavljata iste API-je kot njihovi Seznam
ustrezniki pod eksplicitnimi imeni dejanj, združljivimi z n8n.

### Get Repository metapodatki

`Get Repository` shrani celoten odgovor GitHub v `$github.repository` in prav tako izpostavi
`$github.full_name`, `$github.default_branch`, `$github.private` in `$github.url`.

Payload repozitorija običajno vključuje:

- Identiteta in lastništvo: ID, ime, polno ime, opis, lastnik in vidnost
- Stanje repozitorija: zasebno, fork, arhivirano, onemogočeno in privzeta veja
- URL-ji: GitHub stran, API, klon, SSH in Git URL-ji
- Aktivnost in velikost: časovne oznake ustvarjanja, posodobitve in potiska, velikost, zvezde, gledalci, forki, naročniki in odprte težave
- Značilnosti: težave, projekti, wiki, strani, razprave, teme, jezik in domača stran
- Licenca, nastavitve združevanja, dovoljenja klicatelja, varnostne nastavitve in metapodatki o starševskem/izvoru fork, kadar so na voljo

Nekatera administrativna, dovoljenja, združevanja in varnostna polja so odvisna od dovoljenj repozitorija poverilnice.

Primer:

- Lastnik: `heymrun`
- Repozitorij: `heym`

## Težave

Operacije težav podpirajo polja naslov/telo in neobvezna polja JSON-array za oznake in dodelitve.

`List Issues` vrača le težave repozitorija. Pull requesti so izključeni; uporabite `List Pull Requests` za rezultate PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Semantika polj za Urejanje Težave

Za `Edit Issue` se pošljejo le polja, ki jih izrecno nastavite:

- **Stanje** – Izberite `Don't change`, `Open` ali `Closed`. Pustite ne nastavljeno, da ohranite trenutno stanje.
- **Razlog za stanje** – Neobvezno nastavite `Completed`, `Not Planned`, `Duplicate` ali `Reopened`.
- **Naslov / Telo** – Pustite prazno, da ohranite trenutno vrednost.
- **Oznake / Dodelitve** – Pustite polje prazno, da ohranite trenutno vrednost. Uporabite `[]`, da izbrišete vse oznake ali dodelitve. Uporabite JSON array, kot je `["bug"]`, da jih zamenjate.

`Edit Issue` zahteva vsaj eno polje, ki se spremeni med izvajanjem. Če zagotovite le številko težave, se izvajanje konča z napako validacije iz plasti API GitHub.
## Težava z zaklepanjem

`Težava z zaklepanjem` sprejema neobvezni **Razlog za zaklepanje**. Ko je naveden, mora biti eden od podprtih vrednosti GitHub-a:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Pustite razlog prazen, da zaklenete brez specifičnega razloga.

## Pull Requesti

Ustvarjanje PR zahteva:

- Naslov
- Glavna veja
- Osnovna veja
- Neobvezno telo
- Neobvezni osnutek

## Pregledi Pull Requestov

Operacije pregleda ustrezajo GitHub-ovemu API-ju za pregled pull requestov:

| Operacija | Obvezna polja | Neobvezna polja |
|-----------|-----------------|-----------------|
| `Ustvari pregled` | Številka pull requesta, dogodek | Telo, ID commit-a |
| `Pridobi pregled` | Številka pull requesta, ID pregleda | — |
| `Seznam pregledov` | Številka pull requesta | Na stran |
| `Posodobi pregled` | Številka pull requesta, ID pregleda, telo | — |

`Ustvari pregled` podpira `Odobri`, `Zahtevaj spremembe`, `Komentiraj` in `V teku`.
Telo je obvezno za `Zahtevaj spremembe` in `Komentiraj`. Ko je ID commit-a prazen, GitHub
pregleda zadnji commit pull requesta.

## Izdaje

| Operacija | Obvezna polja ob izvajanju | Pogosto neobvezna |
|-----------|---------------------------|-------------------|
| `Ustvari izdajo` | Ime oznake | Ime izdaje (naslov), telo, ciljna veja, osnutek, predizdaja |
| `Posodobi izdajo` | ID izdaje | Ime oznake, ime izdaje, telo, ciljna veja, osnutek, predizdaja |
| `Pridobi izdajo` / `Izbriši izdajo` | ID izdaje | — |

`Posodobi izdajo` lahko izrecno nastavi `osnutek` / `predizdaja` na `true` ali `false`.

## Workflows

Operacije workflow podpirajo:

- Seznam workflow-ov repozitorija
- Pridobitev workflow-a po numerični ID ali imenu datoteke workflow-a
- Omogočanje ali onemogočanje workflow-a
- Branje obračunljive uporabe workflow-a po operacijskem sistemu izvajalca
- Pošiljanje workflow-a z ref ali vejo ter neobveznim objektom JSON vhodov

GitHub je v postopku zapiranja `Pridobi uporabo workflow-a` endpoint-a. Workflows, ki uporabljajo
to operacijo, bodo morda morali migrirati, ko GitHub odstrani endpoint.

`Pošlji workflow` sprejema obe obliki odgovorov GitHub-a: starejši `204 No Content` in novejši
`200` odgovor, ki vsebuje `workflow_run_id`, `run_url` in `html_url`.

`Pošlji workflow in počakaj` pošlje workflow in preverja stanje izvajanja, dokler ni
`zaključeno`. Konfigurirajte časovno omejitev in interval preverjanja v sekundah. Heym uporablja
`workflow_run_id`, ko GitHub vrne novejši `200` odgovor. Za tradicionalni `204 No Content`
odgovor, Heym odkrije novo ustvarjeno `workflow_dispatch` izvajanje za izbrani
workflow in ref, nato čaka na to izvajanje.

## Vsebina datotek

`Pridobi datoteko` prebere datoteko repozitorija preko GitHub-ovega API-ja za vsebine in dekodira besedilno vsebino, ko je na voljo. Dvobitne datoteke in vsebina, ki ni UTF-8, lahko vrnejo metapodatke brez dekodiranega polja `content`.

`Seznam datotek` vrne vnose imenika iz GitHub-ovega API-ja za vsebine za dano pot mape in neobvezni ref. Pustite **Pot do imenika** prazno, da prikažete koren repozitorija.

`Ustvari ali posodobi datoteko` zapiše besedilno vsebino na pot repozitorija z uporabo:

- Pot do datoteke
- Sporočilo o commit-u
- Vsebina datoteke
- Neobvezna veja

`Izbriši datoteko` odstrani pot repozitorija z uporabo sporočila o commit-u in neobvezne veje. Če datoteka obstaja, Heym samodejno pridobi trenutni SHA pred njenim brisanjem.

Če datoteka že obstaja, Heym samodejno pridobi trenutni SHA pred njeno posodobitvijo.

## Paginarjenje

`Seznam težav`, `Pridobi težave repozitorija`, `Pridobi težave uporabnika`, `Seznam pull requestov`,
`Pridobi pull requeste repozitorija`, `Seznam pregledov`, `Seznam izdaj`, `Seznam workflow-ov`,
`Seznam repozitorijev organizacije`, `Seznam repozitorijev uporabnika` in `Pridobi repozitorije uporabnika` podpirajo
**Na stran** (1–100). Heym zahteva eno stran rezultatov; ni polja `page` za pridobivanje
dodatnih strani v isti operaciji.


### Return all pages

Vklopite **Return all pages**, da eno izvajanje sledi vsem straneh, začenši pri **Cursor**, če je nastavljen. Vsaka zahteva zahteva 100 elementov, ne glede na vrednost **Per Page**. Vozlišče se ustavi po približno 1.000 elementih (ali 100 zahtevah): objekti issue merijo vsak okoli 6 KB, zato bi višja omejitev ustvarila zelo velike izhode vozlišča. Če se ustavi prej, namesto napake vrne, kar ima, z `has_more: true` in `next_cursor`, nadaljujete pa lahko tako, da ta kazalec posredujete naslednjemu izvajanju. Ustavitev Workflowa ali dosežena časovna omejitev Workflowa prekine pridobivanje med stranmi.

## Izhod

Natančna oblika je odvisna od izbrane operacije. Pogosta polja vključujejo:

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

Zamenjajte `github` z oznako vašega vozlišča.

## Opombe

- Oznake in dodelitve morajo biti veljavne JSON tabele, ko so navedene.
- Vhodi za pošiljanje workflow-a morajo biti veljaven JSON objekt, ko so navedeni.
- `Uredi težavo` uporablja `state` le, ko jo izrecno nastavite; pustite jo ne nastavljeno, da obdržite trenutno stanje težave.
- Dovoljenja GitHub API-ja so odvisna od obsega žetonov ali natančno določenih dovoljenj repozitorija, ki jih dodelite.

## Sorodno

- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte in upravljajte GitHub poverilnice
- [Integracije tretjih oseb](../reference/integrations.md) – Nastavitev GitHub poverilnic in Enterprise `base_url`
- [Agent Node](./agent-node.md) – Uporabite GitHub poverilnice z `@modelcontextprotocol/server-github`
- [Vrste vozlišč](../reference/node-types.md) – Celoten katalog vozlišč
