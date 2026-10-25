# GitHub čvor

**GitHub** čvor dodaje nativne GitHub REST operacije u workflow, slično višekratnim GitHub čvorovima koje možda poznajete iz alata poput n8n.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnice | GitHub |
| Izlaz | `$nodeLabel.*` |

## Podržane Operacije

Čvor trenutno pruža 40 akcija:

| Resurs | Akcije |
|--------|--------|
| Repozitorij | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organizacija / Korisnik | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Problem | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Recenzija | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Izdanje | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| Datoteka | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Vjerodajnice

Kreirajte **GitHub** vjerodajnicu u [Kartici Vjerodajnice](../tabs/credentials-tab.md) s:

- Osobnim pristupnim tokenom
- Opcionalnom punom REST API osnovnom URL adresom za GitHub Enterprise Server

Ostavite osnovnu URL adresu praznom za GitHub.com. Preporučuju se fine-grained PATs.

Za GitHub Enterprise Server, unesite potpunu REST API putanju uključujući `/api/v3`, kao što je
`https://github.example.com/api/v3`. Ne unosite samo korijensku URL adresu web sučelja
(`https://github.example.com`).

Ako koristite GitHub Enterprise Server i kasnije uređujete vjerodajnicu za rotaciju tokena, ostavljanje
`base_url` praznim čuva postojeću Enterprise putanju. Unesite novu URL adresu samo kada želite
promijeniti tu putanju.

## Uobičajena Polja

Većina operacija koristi:

- **Vlasnik** – Vlasnik repozitorija, naziv organizacije ili korisničko ime
- **Repozitorij** – Naziv repozitorija

`List Organization Repositories` zahtijeva samo **Vlasnika** (naziv organizacije) i ne koristi polje repozitorija.

`List User Repositories` zahtijeva samo **Vlasnika** (korisničko ime) i ne koristi polje repozitorija.

`Get User Repositories` odražava n8n-ovu akciju Korisnik → Dobij Repozitorije. `Get User Issues` vraća
probleme dodijeljene autentificiranom GitHub korisniku prema zadanim postavkama. Postavite **Mentioned Filter** na bilo koju
nepraznu vrijednost kako biste vratili probleme koji spominju autentificiranog korisnika. Također podržava
filtre za stanje, oznake, ažurirano-od, sortiranje, smjer i po-stranici. `Invite User` zahtijeva
organizaciju i adresu e-pošte i ne koristi Vlasnika ili Repozitorij.

## Repozitorij

Operacije repozitorija uključuju metapodatke, otkrivene sadržaje licenci, profil zajednice i
uvid u promet. `List Popular Paths for Repository` i
`List Top Referrers for Repository` vraćaju GitHubove najpopularnije prometne unose za posljednjih 14 dana i
zahtijevaju pristup za administraciju repozitorija.

`List Issues` podržava opcionalne dodijeljene, kreatore, spomenute korisnike, oznake odvojene zarezom,
vremensku oznaku ažurirano-od, sortiranje i smjer. `List Pull Requests` podržava stanje, sortiranje,
smjer i kontrole po-stranici.

`Get Repository Issues` i `Get Repository Pull Requests` izlažu iste API-je kao njihovi List
odgovarajući nazivi akcija kompatibilni s n8n.

### Dobijte Metapodatke Repozitorija

`Get Repository` pohranjuje GitHubov cjeloviti odgovor u `$github.repository` i također izlaže
`$github.full_name`, `$github.default_branch`, `$github.private` i `$github.url`.

Payload repozitorija obično uključuje:

- Identitet i vlasništvo: ID, naziv, puni naziv, opis, vlasnik i vidljivost
- Stanje repozitorija: privatno, fork, arhivirano, onemogućeno i zadana grana
- URL-ovi: GitHub stranica, API, klon, SSH i Git URL-ovi
- Aktivnost i veličina: vremenske oznake stvaranja, ažuriranja i push-a, veličina, zvjezdice, promatrači, forkovi, pretplatnici i otvoreni problemi
- Značajke: problemi, projekti, wiki, Pages, rasprave, teme, jezik i početna stranica
- Licenca, postavke spajanja, dopuštenja pozivatelja, sigurnosne postavke i metapodaci o roditeljskom/izvornom forku kada su dostupni

Neka administrativna, dopuštenja, spajanja i sigurnosna polja ovise o dopuštenjima repozitorija vjerodajnice.

Primjer:

- Vlasnik: `heymrun`
- Repozitorij: `heym`

## Problemi

Operacije problema podržavaju polja naslova/tijela i opcionalna JSON-niz polja za oznake i dodijeljene.

`List Issues` vraća probleme repozitorija samo. Pull requestovi su isključeni; koristite `List Pull Requests` za PR rezultate.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Semantika Polja za Uređivanje Problema

Za `Edit Issue`, samo polja koja izričito postavite šalju se GitHubu:

- **Stanje** – Odaberite `Nemoj mijenjati`, `Otvoreno` ili `Zatvoreno`. Ostavite nepostavljeno kako biste zadržali trenutno stanje.
- **Razlog Stanja** – Opcionalno postavite `Završeno`, `Nije planirano`, `Duplikat` ili `Ponovno otvoreno`.
- **Naslov / Tijelo** – Ostavite prazno kako biste zadržali trenutnu vrijednost.
- **Oznake / Dodijeljeni** – Ostavite polje prazno kako biste zadržali trenutnu vrijednost. Koristite `[]` za brisanje svih oznaka ili dodijeljenih. Koristite JSON niz poput `["bug"]` za njihovu zamjenu.

`Edit Issue` zahtijeva najmanje jedno polje za promjenu u vrijeme izvođenja. Ako pružite samo broj problema, izvršenje će neuspjeti s greškom validacije iz GitHub API sloja.
## Problem s zaključavanjem

`Lock Issue` prihvaća opcionalni **Razlog zaključavanja**. Kada je naveden, mora biti jedan od podržanih vrijednosti GitHub-a:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Ostavite razlog praznim kako biste zaključali bez specifičnog razloga.

## Pull Requests

Kreiranje PR zahtijeva:

- Naslov
- Glavnu granu
- Osnovnu granu
- Opcionalno tijelo
- Opcionalni način nacrta

## Recenzije Pull Request-a

Operacije recenzije odgovaraju GitHub-ovom API-ju za recenziju pull request-a:

| Operacija | Obavezna polja | Opcionalna polja |
|-----------|-----------------|-----------------|
| `Create Review` | Broj pull request-a, događaj | Tijelo, ID commit-a |
| `Get Review` | Broj pull request-a, ID recenzije | — |
| `List Reviews` | Broj pull request-a | Po stranici |
| `Update Review` | Broj pull request-a, ID recenzije, tijelo | — |

`Create Review` podržava `Approve`, `Request Changes`, `Comment` i `Pending`.
Tijelo je obavezno za `Request Changes` i `Comment`. Kada je ID commit-a prazan, GitHub
pregleda najnoviji commit pull request-a.

## Izdanja

| Operacija | Obavezna polja u vrijeme izvođenja | Često opcionalna |
|-----------|---------------------------|-------------------|
| `Create Release` | Ime oznake | Ime izdanja (naslov), tijelo, ciljana grana, nacrt, prerelease |
| `Update Release` | ID izdanja | Ime oznake, ime izdanja, tijelo, ciljana grana, nacrt, prerelease |
| `Get Release` / `Delete Release` | ID izdanja | — |

`Update Release` može eksplicitno postaviti `draft` / `prerelease` na `true` ili `false`.

## Workflows

Operacije workflow-a podržavaju:

- Popis workflow-a repozitorija
- Dobivanje workflow-a prema numeričkom ID-u ili nazivu datoteke workflow-a
- Omogućavanje ili onemogućavanje workflow-a
- Čitanje naplate korištenja workflow-a prema operativnom sustavu runner-a
- Pokretanje workflow-a s ref-om ili granom uz opcionalni JSON ulazni objekt

GitHub je u procesu zatvaranja `Get Workflow Usage` endpoint-a. Workflows koji koriste
ovu operaciju možda će se morati migrirati kada GitHub ukloni endpoint.

`Dispatch Workflow` prihvaća oba oblika odgovora GitHub-a: legacy `204 No Content` i noviji
`200` odgovor koji sadrži `workflow_run_id`, `run_url` i `html_url`.

`Dispatch Workflow and Wait` pokreće workflow i prati izvršenje dok njegov status ne postane
`completed`. Konfigurirajte vrijeme čekanja i interval provjere u sekundama. Heym koristi
`workflow_run_id` kada GitHub vrati noviji `200` odgovor. Za tradicionalni `204 No Content`
odgovor, Heym otkriva novo stvoreni `workflow_dispatch` izvršenje za odabrani
workflow i ref, a zatim čeka na to izvršenje.

## Sadržaj datoteka

`Get File` čita datoteku repozitorija putem GitHub-ovog contents API-ja i dekodira tekstualni sadržaj kada je dostupan. Binarne datoteke i ne-UTF-8 sadržaj mogu vratiti metapodatke bez dekodiranog `content` polja.

`List Files` vraća unose direktorija iz GitHub-ovog contents API-ja za zadanu putanju mape i opcionalni ref. Ostavite **Putanju direktorija** praznom kako biste popisali korijen repozitorija.

`Create or Update File` zapisuje tekstualni sadržaj na putanju repozitorija koristeći:

- Putanja datoteke
- Poruka commit-a
- Sadržaj datoteke
- Opcionalna grana

`Delete File` uklanja putanju repozitorija koristeći poruku commit-a i opcionalnu granu. Ako datoteka postoji, Heym automatski dohvaća trenutni SHA prije nego što je obriše.

Ako datoteka već postoji, Heym automatski dohvaća trenutni SHA prije nego što je ažurira.

## Paginacija

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` i `Get User Repositories` podržavaju
**Per Page** (1–100). Heym traži jednu stranicu rezultata; ne postoji `page` polje za dohvaćanje
dodatnih stranica u istoj operaciji.


### Return all pages

Uključite **Return all pages** kako bi jedno izvršavanje slijedilo svaku stranicu, počevši od **Cursor** ako je postavljen. Svaki zahtjev traži 100 stavki, bez obzira na vrijednost **Per Page**. Čvor staje nakon otprilike 1.000 stavki (ili 100 zahtjeva): issue objekti imaju oko 6 KB svaki, pa bi veće ograničenje stvaralo vrlo velike izlaze čvora. Ako stane ranije, vraća ono što ima uz `has_more: true` i `next_cursor` umjesto da izazove pogrešku, a nastaviti možete prosljeđivanjem tog kursora sljedećem izvršavanju. Zaustavljanje Workflowa ili dosezanje njegova vremenskog ograničenja prekida dohvaćanje između stranica.

## Izlaz

Točan oblik ovisi o odabranoj operaciji. Uobičajena polja uključuju:

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

Zamijenite `github` s oznakom Vašeg čvora.

## Napomene

- Oznake i dodijeljeni korisnici moraju biti valjane JSON nizove kada su navedeni.
- Ulazi za pokretanje workflow-a moraju biti valjani JSON objekt kada su navedeni.
- `Edit Issue` koristi `state` samo kada ga izričito postavite; ostavite ga nepostavljenim kako biste zadržali trenutnu stanje problema.
- GitHub API dozvole ovise o opsegu tokena ili finim dozvolama repozitorija koje dodijelite.

## Povezano

- [Tablica vjerodajnica](../tabs/credentials-tab.md) – Dodajte i upravljajte GitHub vjerodajnicama
- [Integracije trećih strana](../reference/integrations.md) – Postavljanje GitHub vjerodajnica i Enterprise `base_url`
- [Agent Node](./agent-node.md) – Koristite GitHub vjerodajnice s `@modelcontextprotocol/server-github`
- [Tipovi čvorova](../reference/node-types.md) – Potpuni katalog čvorova
