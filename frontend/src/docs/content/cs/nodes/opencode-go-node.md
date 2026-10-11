# Uzel OpenCode Go

Uzel **OpenCode Go** spouští CLI nástroj [OpenCode](https://opencode.ai) (Go) v izolovaném, zabezpečeném kontejneru Heym proti repozitáři GitHub. Stejně jako uzel Codex je navržen pro úlohy programování, jako je oprava testů, úprava souborů, vytváření patche nebo otevírání pull requestu — místo OpenAI Codex však používá na poskytovateli nezávislou modelovou bránu **OpenCode Go**.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaj | OpenCode Go API klíč + GitHub |
| Výstup | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentizace

Přihlašovací údaj **OpenCode Go** ukládá **API klíč** brány OpenCode Go (z [opencode.ai/go](https://opencode.ai/go)) a volitelnou **Gateway Base URL** (výchozí hodnota je `https://opencode.ai/zen/go/v1`; přepište pouze pro vlastní hostovanou nebo proxy bránu).

Uzel také vyžaduje přihlašovací údaj **GitHub** pro klonování soukromých repozitářů, nahrávání pracovní větve a vytváření pull requestů. GitHub token **není nikdy umístěn uvnitř sandbox kontejneru** — všechny operace git a GitHub provádí Heym na hostiteli, takže generovaný kód nemůže odcizit přihlašovací údaje pro nahrávání.

## Izolace a zabezpečení

Izolace spouštění se volí pomocí `HEYM_OPENCODE_CLI_COMMAND`, přesně jako u uzlu Codex:

- **Lokální vývoj (`run.sh`)** jej ponechává na výchozí hodnotě `opencode`, takže OpenCode běží jako podproces hostitele proti naklonovanému pracovnímu prostoru — není vyžadován Docker, žádné další přepínače.
- **Nasazení v Dockeru (`deploy.sh` a jediný obraz GHCR)** jej nastavují na `/usr/local/bin/heym-opencode-docker`, wrapper, který spouští `opencode run` uvnitř **zabezpečeného, dočasného sourozeneckého kontejneru** sdílejícího pojmenovaný svazek pracovního prostoru OpenCode.

Zabezpečený kontejner runneru ruší všechny linuxové schopnosti (capabilities), nastavuje `no-new-privileges`, používá kořenový systém souborů pouze pro čtení s tmpfs `/tmp` a uplatňuje limity na pid/paměť/CPU. Síťový výstup je povolen (OpenCode musí dosáhnout na modelovou bránu). **GitHub token není nikdy umístěn uvnitř kontejneru** — všechny operace git a GitHub běží na straně hostitele, takže uvnitř je vždy pouze API klíč OpenCode a soubory repozitáře.

OpenCode upravuje pouze soubory na disku; veškeré akce git/GitHub vlastní Heym.

## Modely

Nabídka modelů OpenCode Go se často mění, proto je pole **Model** naplňováno živě ze seznamu modelů brány (`GET https://opencode.ai/zen/go/v1/models`) a zobrazuje se jako prohledávatelný rozbalovací seznam. Pokud živý seznam není dostupný, použije se vestavěný záložní seznam. ID modelů používají formát `opencode-go/<model>` (například `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` je ID poskytovatele CLI OpenCode pro bránu Go. Ponechte pole prázdné pro použití výchozí hodnoty runneru (`opencode-go/kimi-k3`). ID modelů uložená ve starším formátu `opencode/<model>` jsou za běhu automaticky přepsána.

## Pole

| Pole | Popis |
|-------|-------------|
| OpenCode Go Credential | Přihlašovací údaj OpenCode Go (API klíč brány) |
| GitHub Credential | Přihlašovací údaj GitHub PAT používaný pro přístup k repozitáři |
| Repository URL | HTTPS URL repozitáře GitHub; podporuje výrazy |
| Base Branch | Větev pro klonování před spuštěním OpenCode, výchozí `main` |
| Model | Model OpenCode Go (živý prohledávatelný rozbalovací seznam, `opencode-go/<model>`); prázdné použije výchozí hodnotu runneru |
| Reasoning Variant | Volitelné; mapuje se na `opencode run --variant` pro modely, které podporují úsilí o uvažování (reasoning effort) |
| Task Prompt | Úloha programování pro OpenCode; podporuje výrazy jako `$input.text` |
| Publish Mode | Jak jsou změny doručeny (viz tabulka níže) |
| Branch Name | Pracovní větev pro režimy PR/commit, výchozí `opencode/$executionId` |
| Timeout | Maximální doba spuštění OpenCode v sekundách |

## Režimy publikování

| Režim | Co dělá |
|------|--------------|
| `diff_only` | Upraví soubory lokálně a vrátí patch a změněné soubory. Nic se nenahrává. |
| `draft_pr` | Zapíše změny do větve, nahraje ji a otevře koncept pull requestu. |
| `open_pr` | Zapíše změny do větve, nahraje ji a otevře pull request připravený k revizi (nikoli koncept). |
| `commit_push` | Zapíše změny do větve a nahraje ji, aniž by otevřel pull request. |
| `direct_commit` | Zapíše změny a nahraje je přímo do základní větve (bez samostatné větve nebo PR). |
| `open_or_update_pr` | Aktualizuje existující otevřený PR agenta, pokud nějaký existuje — i když se název větve liší, runner jej najde podle autora + základní větve — jinak otevře nový. Nejlepší pro opakovaná spuštění a pokyny „aktualizuj otevřený PR". |
| `update_existing_pr` | Přidá commit do existující větve/PR; otevře jeden, pokud ještě žádný neexistuje. |
| `patch_artifact` | Uloží diff jako soubor ke stažení a vrátí `patchUrl`. Nic se nenahrává. |

## Výstupy

| Klíč | Popis |
|-----|-------------|
| `status` | Vždy `completed` (uzel OpenCode Go se nezastavuje pro vstup) |
| `summary` | Závěrečná zpráva OpenCode |
| `validation` | Poznámky k validaci, pokud jsou hlášeny |
| `diff` | Git patch, pokud byly soubory změněny |
| `changedFiles` | Cesty změněných souborů |
| `branchName` | Název pracovní větve |
| `pullRequestUrl` | URL PR v režimech `draft_pr`, `open_pr`, `open_or_update_pr` a `update_existing_pr` |
| `pushedBranch` | Větev, která byla nahrána v režimech commit/PR |
| `patchUrl` | Odkaz ke stažení diffu v režimu `patch_artifact` |
## Snímky obrazovky UI v pull requestech

Pro úlohy týkající se UI/frontendu by měl OpenCode ukládat snímky obrazovky ve formátu PNG do cesty ignorované systémem git, například `frontend/.e2e-artifacts/` (nikoli do zdrojových souborů). Pokud chybí závislosti frontendu, prompt runneru povoluje cílenou instalaci balíčků (například `bun install`) a krátkodobý náhled/`bun run dev` výhradně za účelem zachycení UI. Heym nahrává tyto obrázky do jednoho sdíleného GitHub **prerelease** (`opencode-pr-assets`) jako assety pojmenované `<branch>-…` a poté je vloží do popisu PR **před otevřením pull requestu**, takže nový PR je vytvořen již se svými snímky obrazovky (existující PR jsou aktualizovány na místě).

OpenCode je rovněž instruován, aby zakončil řádkem `PR_TITLE: …`, aby Heym mohl otevřít pull request s smysluplným předmětem namísto zástupných textů, jako je `Done.`

OpenCode někdy ukončí tah uprostřed úlohy („…Now let me take a screenshot“), což by dokončilo běh před zachycením snímku obrazovky. Aby se tomu zabránilo, prompt runneru vyžaduje zachycení snímků obrazovky **před** závěrečnou zprávou, a pokud běh přesto skončí bez publikovatelného shrnutí nebo se změnou UI, ale bez snímku obrazovky, spustí Heym ještě jeden průchod OpenCode ve stejném pracovním prostoru, aby jej dokončil. Pokud změna UI stále nemá snímek obrazovky, přidá se do těla PR viditelná poznámka, aby tato mezera nikdy nezůstala skryta.

## Co se publikuje na GitHub

Váš **Task Prompt** je soukromý vstup, nikoli obsah PR. Publikují se pouze dvě věci: `## Change Summary` popisující, co změna kódu dělá, a sekce `## Screenshots`, pokud byly snímky obrazovky zachyceny. Název PR je odvozen výhradně ze shrnutí změn.

Prompt runneru toto pravidlo uvádí a Heym jej také vynucuje po běhu: před tím, než je cokoli commitnuto nebo otevřeno jako pull request, odstraní ze shrnutí, těla PR a zprávy commitu sekce ozvěny promptu (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) a jakýkoli odstavec doslovně zkopírovaný z task promptu.

Heym čte sekci `## Change Summary` ze zpráv agenta, místo aby vzal to, co bylo řečeno naposledy, protože OpenCode vydává zprávu za každý krok a poslední z nich je často komentář uprostřed běhu. Vyprávění kroků (`Both pass. Let me do a final review:`) je rovněž odmítnuto jako název PR nebo předmět commitu. Pokud běh nevyprodukuje použitelné shrnutí změn, pull request se místo publikování komentářů uchýlí k výpisu změněných souborů.

## Jako nástroj agenta

Uzel OpenCode Go lze připojit k handle nástroje uzlu **AI Agent**, aby agent mohl delegovat úlohy kódování. Na uzlu nakonfigurujte přihlašovací údaje, GitHub přihlašovací údaje a repozitář, poté označte **Task Prompt** (a volitelně **Repository URL**) přepínačem poskytovaným agentem, aby je agent dodal v době volání.

## Příklad

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Související

- [Uzel Codex](./codex-node.md)
- [Uzel GitHub](./github-node.md)
- [Uzel Agent](./agent-node.md)
- [Přihlašovací údaje](../reference/credentials.md)
- [Sdílení přihlašovacích údajů](../reference/credentials-sharing.md)
- [Typy uzlů](../reference/node-types.md)
