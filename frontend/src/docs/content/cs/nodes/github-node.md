# Uzel GitHub

Uzel **GitHub** přidává do workflow nativní operace GitHub REST, podobně jako víceoperační uzly GitHub, které můžete znát z nástrojů, jako je n8n.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaje | GitHub |
| Výstup | `$nodeLabel.*` |

## Podporované operace

Uzel v současnosti poskytuje 40 akcí:

| Zdroj | Akce |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Přihlašovací údaje

Vytvořte přihlašovací údaje **GitHub** na kartě [Přihlašovací údaje](../tabs/credentials-tab.md) s:

- Osobním přístupovým tokenem
- Volitelnou úplnou základní adresou REST API pro GitHub Enterprise Server

Pro GitHub.com ponechte základní adresu URL prázdnou. Doporučují se jemnozrnné PAT.

Pro GitHub Enterprise Server zadejte úplný endpoint REST API včetně `/api/v3`, například
`https://github.example.com/api/v3`. Nezadávejte pouze kořen webového rozhraní
(`https://github.example.com`).

Pokud používáte GitHub Enterprise Server a později upravíte přihlašovací údaje za účelem rotace tokenu, ponechání
`base_url` prázdné zachová stávající endpoint Enterprise. Novou adresu URL zadejte pouze tehdy, když chcete
tento endpoint změnit.

## Společná pole

Většina operací používá:

- **Owner** – Vlastník repozitáře, název organizace nebo uživatelské jméno
- **Repository** – Název repozitáře

`List Organization Repositories` vyžaduje pouze **Owner** (název organizace) a nepoužívá pole repozitáře.

`List User Repositories` vyžaduje pouze **Owner** (uživatelské jméno) a nepoužívá pole repozitáře.

`Get User Repositories` odpovídá akci User → Get Repositories v n8n. `Get User Issues` ve výchozím nastavení vrací
issues přiřazené ověřenému uživateli GitHubu. Nastavte **Mentioned Filter** na jakoukoli
neprázdnou hodnotu, chcete-li místo toho vrátit issues zmiňující ověřeného uživatele. Podporuje také
filtry state, labels, updated-since, sort, direction a per-page. `Invite User` vyžaduje
organizaci a e-mailovou adresu a nepoužívá Owner ani Repository.

## Repository

Operace s repozitářem zahrnují metadata, obsah zjištěné licence, profil zdraví komunity a
přehledy návštěvnosti. `List Popular Paths for Repository` a
`List Top Referrers for Repository` vrací nejlepší záznamy návštěvnosti GitHubu za posledních 14 dní a
vyžadují push přístup správce repozitáře.

`List Issues` podporuje volitelné filtry assignee, creator, mentioned user, čárkou oddělené labels,
updated-since timestamp, sort a direction. `List Pull Requests` podporuje ovládací prvky state, sort,
direction a per-page.

`Get Repository Issues` a `Get Repository Pull Requests` zpřístupňují stejná API jako jejich protějšky List
pod explicitními názvy akcí repozitáře kompatibilními s n8n.

### Získání metadat repozitáře

`Get Repository` ukládá úplnou odpověď GitHubu do `$github.repository` a také zpřístupňuje
`$github.full_name`, `$github.default_branch`, `$github.private` a `$github.url`.

Payload repozitáře obvykle obsahuje:

- Identitu a vlastnictví: ID, název, celý název, popis, vlastníka a viditelnost
- Stav repozitáře: private, fork, archived, disabled a výchozí větev
- Adresy URL: stránka GitHubu, API, clone, SSH a Git URL
- Aktivitu a velikost: časová razítka vytvoření, aktualizace a push, velikost, stars, watchers, forks, subscribers a otevřené issues
- Funkce: issues, projects, wiki, Pages, discussions, topics, jazyk a domovská stránka
- Licenci, nastavení sloučení, oprávnění volajícího, nastavení zabezpečení a metadata nadřazeného/zdrojového forku, pokud jsou k dispozici

Některá administrativní pole, pole oprávnění, sloučení a zabezpečení závisí na oprávněních repozitáře
daných přihlašovacími údaji.

Příklad:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Operace s issues podporují pole title/body a volitelná pole JSON-array pro labels a assignees.

`List Issues` vrací pouze issues repozitáře. Pull requesty jsou vyloučeny; pro výsledky PR použijte `List Pull Requests`.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Sémantika polí Edit Issue

U `Edit Issue` jsou do GitHubu odeslána pouze pole, která výslovně nastavíte:

- **State** – Zvolte `Don't change`, `Open` nebo `Closed`. Ponechte nenastavené pro zachování aktuálního stavu.
- **State Reason** – Volitelně nastavte `Completed`, `Not Planned`, `Duplicate` nebo `Reopened`.
- **Title / Body** – Ponechte prázdné pro zachování aktuální hodnoty.
- **Labels / Assignees** – Ponechte pole prázdné pro zachování aktuální hodnoty. Pomocí `[]` vymažete všechny labels nebo assignees. Pomocí pole JSON, jako je `["bug"]`, je nahradíte.

`Edit Issue` vyžaduje za běhu alespoň jedno pole ke změně. Pokud zadáte pouze číslo issue, spuštění selže s validační chybou z vrstvy GitHub API.
## Problém se zámkem

`Lock Issue` přijímá volitelný **Důvod uzamčení**. Pokud je zadán, musí být jednou z hodnot podporovaných GitHubem:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Ponechte důvod prázdný, chcete-li uzamknout bez konkrétního důvodu.

## Pull Requesty

Vytvoření PR vyžaduje:

- Název
- Zdrojovou větev
- Cílovou větev
- Volitelné tělo
- Volitelný režim konceptu

## Recenze pull requestů

Operace recenzí odpovídají API pro recenze pull requestů na GitHubu:

| Operace | Povinná pole | Volitelná pole |
|-----------|-----------------|-----------------|
| `Create Review` | Číslo pull requestu, událost | Tělo, ID commitu |
| `Get Review` | Číslo pull requestu, ID recenze | — |
| `List Reviews` | Číslo pull requestu | Na stránku |
| `Update Review` | Číslo pull requestu, ID recenze, tělo | — |

`Create Review` podporuje `Approve`, `Request Changes`, `Comment` a `Pending`.
Tělo je povinné pro `Request Changes` a `Comment`. Pokud je ID commitu prázdné, GitHub
recenzuje nejnovější commit pull requestu.

## Vydání

| Operace | Povinná pole za běhu | Obvykle volitelná |
|-----------|---------------------------|-------------------|
| `Create Release` | Název tagu | Název vydání (titulek), tělo, cílová větev, koncept, předběžné vydání |
| `Update Release` | ID vydání | Název tagu, název vydání, tělo, cílová větev, koncept, předběžné vydání |
| `Get Release` / `Delete Release` | ID vydání | — |

`Update Release` může explicitně nastavit `draft` / `prerelease` na `true` nebo `false`.

## Workflow

Operace s workflow podporují:

- Výpis workflow v repozitáři
- Získání workflow podle číselného ID nebo názvu souboru workflow
- Povolení nebo zakázání workflow
- Čtení fakturovatelného využití workflow podle operačního systému runneru
- Spuštění workflow s ref nebo větví a volitelným objektem JSON vstupů

GitHub postupně ukončuje endpoint `Get Workflow Usage`. Workflow používající
tuto operaci bude možná nutné migrovat, až GitHub endpoint odstraní.

`Dispatch Workflow` přijímá obě formy odpovědi GitHubu: starší `204 No Content` a novější
odpověď `200` obsahující `workflow_run_id`, `run_url` a `html_url`.

`Dispatch Workflow and Wait` spustí workflow a dotazuje se na běh, dokud jeho stav není
`completed`. Nakonfigurujte časový limit a interval dotazování v sekundách. Heym použije
`workflow_run_id`, když GitHub vrátí novější odpověď `200`. U tradiční odpovědi `204 No
Content` Heym vyhledá nově vytvořený běh `workflow_dispatch` pro vybrané
workflow a ref a poté na tento běh počká.

## Obsah souborů

`Get File` načte soubor z repozitáře prostřednictvím API pro obsah na GitHubu a dekóduje textový obsah, pokud je k dispozici. Binární soubory a obsah, který není v UTF-8, mohou vrátit metadata bez dekódovaného pole `content`.

`List Files` vrací položky adresáře z API pro obsah repozitáře pro danou cestu ke složce a volitelný ref. Ponechte **Cestu k adresáři** prázdnou, chcete-li vypsat kořen repozitáře.

`Create or Update File` zapisuje textový obsah do cesty v repozitáři pomocí:

- Cesty k souboru
- Zprávy commitu
- Obsahu souboru
- Volitelné větve

`Delete File` odstraní cestu v repozitáři pomocí zprávy commitu a volitelné větve. Pokud soubor existuje, Heym před smazáním automaticky načte aktuální SHA.

Pokud soubor již existuje, Heym před aktualizací automaticky načte aktuální SHA.

## Stránkování

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` a `Get User Repositories` podporují
**Na stránku** (1–100). Heym požaduje jednu stránku výsledků; ve stejné operaci neexistuje pole `page` pro načtení dalších stránek.

## Výstup

Přesný tvar závisí na zvolené operaci. Mezi běžná pole patří:

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

Nahraďte `github` názvem svého uzlu.

## Poznámky

- Štítky a přiřazení musí být při zadání platná pole JSON.
- Vstupy pro spuštění workflow musí být při zadání platný objekt JSON.
- `Edit Issue` použije `state` pouze tehdy, když jej explicitně nastavíte; ponechte jej nenastavené, chcete-li zachovat aktuální stav issue.
- Oprávnění GitHub API závisí na rozsazích tokenu nebo jemných oprávněních repozitáře, která udělíte.

## Související

- [Karta Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání a správa přihlašovacích údajů GitHub
- [Integrace třetích stran](../reference/integrations.md) – Nastavení přihlašovacích údajů GitHub a Enterprise `base_url`
- [Uzel Agent](./agent-node.md) – Použití přihlašovacích údajů GitHub s `@modelcontextprotocol/server-github`
- [Typy uzlů](../reference/node-types.md) – Úplný katalog uzlů
