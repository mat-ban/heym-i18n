# Uzol GitHub

Uzol **GitHub** pridáva do workflow natívne operácie GitHub REST, podobne ako viacoperačné uzly GitHub, ktoré môžete poznať z nástrojov ako n8n.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | GitHub |
| Výstup | `$nodeLabel.*` |

## Podporované operácie

Uzol v súčasnosti poskytuje 40 akcií:

| Zdroj | Akcie |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Prihlasovacie údaje

Vytvorte prihlasovacie údaje **GitHub** na karte [Prihlasovacie údaje](../tabs/credentials-tab.md) s:

- Osobným prístupovým tokenom
- Voliteľnou úplnou základnou URL REST API pre GitHub Enterprise Server

Pre GitHub.com ponechajte základnú URL prázdnu. Odporúčajú sa jemnozrnné PAT.

Pre GitHub Enterprise Server zadajte úplný endpoint REST API vrátane `/api/v3`, napríklad
`https://github.example.com/api/v3`. Nezadávajte iba koreň webového rozhrania
(`https://github.example.com`).

Ak používate GitHub Enterprise Server a neskôr upravíte prihlasovacie údaje za účelom rotácie tokenu, ponechanie
`base_url` prázdneho zachová existujúci Enterprise endpoint. Novú URL zadajte iba vtedy, keď chcete
tento endpoint zmeniť.

## Spoločné polia

Väčšina operácií používa:

- **Owner** – Vlastník repozitára, názov organizácie alebo používateľské meno
- **Repository** – Názov repozitára

`List Organization Repositories` vyžaduje iba **Owner** (názov organizácie) a nepoužíva pole repository.

`List User Repositories` vyžaduje iba **Owner** (používateľské meno) a nepoužíva pole repository.

`Get User Repositories` zrkadlí akciu User → Get Repositories z n8n. `Get User Issues` štandardne vracia
issues priradené autentifikovanému používateľovi GitHub. Nastavte **Mentioned Filter** na akúkoľvek
ne-prázdnu hodnotu, aby sa namiesto toho vrátili issues spomínajúce autentifikovaného používateľa. Podporuje tiež
filtre state, labels, updated-since, sort, direction a per-page. `Invite User` vyžaduje
organizáciu a e-mailovú adresu a nepoužíva Owner ani Repository.

## Repository

Operácie Repository zahŕňajú metadata, detekovaný obsah licencie, profil zdravia komunity a
prehľady návštevnosti. `List Popular Paths for Repository` a
`List Top Referrers for Repository` vracajú najlepšie záznamy návštevnosti GitHub za posledných 14 dní a
vyžadujú push prístup pre správu repozitára.

`List Issues` podporuje voliteľné filtre assignee, creator, mentioned user, čiarkou oddelené labels,
updated-since timestamp, sort a direction. `List Pull Requests` podporuje ovládacie prvky state, sort,
direction a per-page.

`Get Repository Issues` a `Get Repository Pull Requests` sprístupňujú rovnaké API ako ich náprotivky List
pod explicitnými názvami akcií repozitára kompatibilnými s n8n.

### Získanie metadát Repository

`Get Repository` ukladá úplnú odpoveď GitHub do `$github.repository` a tiež sprístupňuje
`$github.full_name`, `$github.default_branch`, `$github.private` a `$github.url`.

Payload repozitára bežne obsahuje:

- Identitu a vlastníctvo: ID, názov, celý názov, popis, vlastník a viditeľnosť
- Stav repozitára: private, fork, archived, disabled a default branch
- URL: stránka GitHub, API, clone, SSH a Git URL
- Aktivitu a veľkosť: časové značky vytvorenia, aktualizácie a push, veľkosť, stars, watchers, forks, subscribers a otvorené issues
- Funkcie: issues, projects, wiki, Pages, discussions, topics, jazyk a homepage
- Licenciu, nastavenia merge, oprávnenia volajúceho, bezpečnostné nastavenia a metadata fork parent/source, ak sú k dispozícii

Niektoré administratívne polia, polia oprávnení, merge a bezpečnostné polia závisia od oprávnení repozitára
prihlasovacích údajov.

Príklad:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Operácie Issue podporujú polia title/body a voliteľné polia JSON-array pre labels a assignees.

`List Issues` vracia iba issues repozitára. Pull requests sú vylúčené; pre výsledky PR použite `List Pull Requests`.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Sémantika polí Edit Issue

Pre `Edit Issue` sa do GitHub odosielajú iba polia, ktoré explicitne nastavíte:

- **State** – Vyberte `Don't change`, `Open` alebo `Closed`. Ponechajte nenastavené, aby sa zachoval aktuálny stav.
- **State Reason** – Voliteľne nastavte `Completed`, `Not Planned`, `Duplicate` alebo `Reopened`.
- **Title / Body** – Ponechajte prázdne, aby sa zachovala aktuálna hodnota.
- **Labels / Assignees** – Ponechajte pole prázdne, aby sa zachovala aktuálna hodnota. Použite `[]` na vymazanie všetkých labels alebo assignees. Použite JSON array, napríklad `["bug"]`, na ich nahradenie.

`Edit Issue` vyžaduje v čase spustenia aspoň jedno pole na zmenu. Ak zadáte iba číslo issue, spustenie zlyhá s validačnou chybou z vrstvy GitHub API.
## Problém so zámkom

`Lock Issue` akceptuje voliteľný **Dôvod zámku**. Ak je uvedený, musí byť jednou z podporovaných hodnôt GitHubu:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Ak chcete zamknúť bez konkrétneho dôvodu, ponechajte dôvod prázdny.

## Pull Requests

Vytvorenie PR vyžaduje:

- Názov
- Zdrojovú vetvu (Head branch)
- Cieľovú vetvu (Base branch)
- Voliteľné telo
- Voliteľný režim konceptu (draft mode)

## Recenzie Pull Requestov

Operácie recenzií zodpovedajú API pre recenzie pull requestov GitHubu:

| Operácia | Povinné polia | Voliteľné polia |
|-----------|-----------------|-----------------|
| `Create Review` | Číslo pull requestu, udalosť | Telo, ID commitu |
| `Get Review` | Číslo pull requestu, ID recenzie | — |
| `List Reviews` | Číslo pull requestu | Na stránku |
| `Update Review` | Číslo pull requestu, ID recenzie, telo | — |

`Create Review` podporuje `Approve`, `Request Changes`, `Comment` a `Pending`.
Telo je povinné pre `Request Changes` a `Comment`. Ak je ID commitu prázdne, GitHub
skontroluje najnovší commit pull requestu.

## Vydania

| Operácia | Povinné polia pri spustení | Zvyčajne voliteľné |
|-----------|---------------------------|-------------------|
| `Create Release` | Názov tagu | Názov vydania (titulok), telo, cieľová vetva, koncept, predbežné vydanie |
| `Update Release` | ID vydania | Názov tagu, názov vydania, telo, cieľová vetva, koncept, predbežné vydanie |
| `Get Release` / `Delete Release` | ID vydania | — |

`Update Release` môže explicitne nastaviť `draft` / `prerelease` na `true` alebo `false`.

## Workflowy

Operácie s workflowmi podporujú:

- Výpis workflowov repozitára
- Získanie workflowu podľa číselného ID alebo názvu súboru workflowu
- Povolenie alebo zakázanie workflowu
- Čítanie fakturovateľného využitia workflowu podľa operačného systému runnera
- Spustenie workflowu s ref alebo vetvou plus voliteľným objektom JSON vstupov

GitHub postupne ukončuje endpoint `Get Workflow Usage`. Workflowy používajúce
túto operáciu môže byť potrebné migrovať, keď GitHub endpoint odstráni.

`Dispatch Workflow` akceptuje obe formy odpovede GitHubu: staršiu `204 No Content` a novšiu
odpoveď `200` obsahujúcu `workflow_run_id`, `run_url` a `html_url`.

`Dispatch Workflow and Wait` spustí workflow a opakovane kontroluje beh, kým jeho stav nie je
`completed`. Časový limit a interval kontroly nakonfigurujte v sekundách. Heym používa
`workflow_run_id`, keď GitHub vráti novšiu odpoveď `200`. Pri tradičnej odpovedi `204 No
Content` Heym vyhľadá novo vytvorený beh `workflow_dispatch` pre vybraný
workflow a ref a potom počká na tento beh.

## Obsah súborov

`Get File` načíta súbor repozitára prostredníctvom API obsahu GitHubu a dekóduje textový obsah, ak je k dispozícii. Binárne súbory a obsah, ktorý nie je v UTF-8, môžu vrátiť metadata bez dekódovaného poľa `content`.

`List Files` vráti položky adresára z API obsahu repozitára pre danú cestu priečinka a voliteľný ref. Ak chcete vypísať koreň repozitára, ponechajte **Cestu k adresáru** prázdnu.

`Create or Update File` zapíše textový obsah do cesty v repozitári pomocou:

- Cesty k súboru
- Správy commitu
- Obsahu súboru
- Voliteľnej vetvy

`Delete File` odstráni cestu v repozitári pomocou správy commitu a voliteľnej vetvy. Ak súbor existuje, Heym pred jeho odstránením automaticky načíta aktuálny SHA.

Ak súbor už existuje, Heym pred jeho aktualizáciou automaticky načíta aktuálny SHA.

## Stránkovanie

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` a `Get User Repositories` podporujú
**Na stránku** (1–100). Heym vyžiada jednu stránku výsledkov; neexistuje pole `page` na načítanie
ďalších stránok v rámci tej istej operácie.


### Return all pages

Zapnite **Return all pages**, aby jedno spustenie prešlo všetky stránky, počnúc **Cursor**, ak je nastavený. Každá požiadavka žiada o 100 položiek bez ohľadu na hodnotu **Per Page**. Uzol sa zastaví po približne 1 000 položkách (alebo 100 požiadavkách): objekty issue majú každý okolo 6 KB, takže vyšší limit by vytváral veľmi veľké výstupy uzla. Ak sa zastaví skôr, vráti, čo má, s `has_more: true` a `next_cursor` namiesto vyvolania chyby a môžete pokračovať odovzdaním tohto kurzora ďalšiemu spusteniu. Zastavenie Workflow alebo dosiahnutie jeho časového limitu ukončí načítanie medzi stránkami.

## Výstup

Presný tvar závisí od vybranej operácie. Medzi bežné polia patria:

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

Nahraďte `github` názvom svojho uzla.

## Poznámky

- Štítky a priradení musia byť pri poskytnutí platnými poľami JSON.
- Vstupy spustenia workflowu musia byť pri poskytnutí platným objektom JSON.
- `Edit Issue` použije `state` len vtedy, keď ho explicitne nastavíte; ponechajte ho nenastavené, aby sa zachoval aktuálny stav issue.
- Povolenia API GitHubu závisia od rozsahov tokenu alebo podrobných povolení repozitára, ktoré udelíte.

## Súvisiace

- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie a správa prihlasovacích údajov GitHubu
- [Integrácie tretích strán](../reference/integrations.md) – Nastavenie prihlasovacích údajov GitHubu a Enterprise `base_url`
- [Uzol Agenta](./agent-node.md) – Použitie prihlasovacích údajov GitHubu s `@modelcontextprotocol/server-github`
- [Typy uzlov](../reference/node-types.md) – Úplný katalóg uzlov
