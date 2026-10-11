# Uzol OpenCode Go

Uzol **OpenCode Go** spúšťa CLI nástroj [OpenCode](https://opencode.ai) (Go) v izolovanom, zabezpečenom kontajneri Heym proti GitHub repozitáru. Rovnako ako uzol Codex je navrhnutý na kódovacie úlohy, ako je oprava testov, úprava súborov, vytvorenie patche alebo otvorenie pull requestu — namiesto OpenAI Codex však používa na poskytovateľovi nezávislú modelovú bránu **OpenCode Go**.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | OpenCode Go API key + GitHub |
| Výstup | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentifikácia

Prihlasovacie údaje **OpenCode Go** uchovávajú **API key** brány OpenCode Go (z [opencode.ai/go](https://opencode.ai/go)) a voliteľnú **Gateway Base URL** (predvolene `https://opencode.ai/zen/go/v1`; prepíšte iba pre self-hosted alebo proxovanú bránu).

Uzol tiež vyžaduje prihlasovacie údaje **GitHub** na klonovanie súkromných repozitárov, pushovanie pracovnej vetvy a vytváranie pull requestov. GitHub token **nie je nikdy umiestnený vnútri sandbox kontajnera** — Heym vykonáva všetky git a GitHub operácie na hostiteľovi, takže vygenerovaný kód nemôže exfiltrovať push prihlasovacie údaje.

## Izolácia a bezpečnosť

Izoláciu vykonávania vyberá `HEYM_OPENCODE_CLI_COMMAND`, presne ako pri uzle Codex:

- **Lokálny vývoj (`run.sh`)** ho ponecháva na predvolenej hodnote `opencode`, takže OpenCode beží ako podproces hostiteľa proti naklonovanému pracovnému priestoru — nie je potrebný Docker ani žiadne ďalšie prepínače.
- **Docker nasadenia (`deploy.sh` a jediný GHCR image)** ho nastavujú na `/usr/local/bin/heym-opencode-docker`, wrapper, ktorý spúšťa `opencode run` vnútri **zabezpečeného, jednorazového súrodeného kontajnera** zdieľajúceho pomenovaný volume pracovného priestoru OpenCode.

Zabezpečený runner kontajner odoberá všetky Linux capabilities, nastavuje `no-new-privileges`, používa read-only root s tmpfs `/tmp` a aplikuje limity na pid/pamäť/CPU. Sieťový egress je povolený (OpenCode musí dosiahnuť modelovú bránu). **GitHub token nie je nikdy umiestnený vnútri kontajnera** — všetky git a GitHub operácie bežia na strane hostiteľa, takže vnútri je vždy iba OpenCode API key a súbory repozitára.

OpenCode iba upravuje súbory na disku; Heym vlastní každú git/GitHub akciu.

## Modely

Zoznam modelov OpenCode Go sa často mení, preto je pole **Model** naplnené naživo zo zoznamu modelov brány (`GET https://opencode.ai/zen/go/v1/models`) a zobrazené ako prehľadávateľný dropdown. Ak naživo zoznam nie je dostupný, použije sa vstavaný záložný zoznam. ID modelov používajú formát `opencode-go/<model>` (napríklad `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` je ID poskytovateľa CLI OpenCode pre bránu Go. Ponechajte pole prázdne na použitie predvolenej hodnoty runnera (`opencode-go/kimi-k3`). ID modelov uložené v staršom formáte `opencode/<model>` sa pri spustení automaticky prepíšu.

## Polia

| Pole | Popis |
|-------|-------------|
| OpenCode Go Credential | Prihlasovacie údaje OpenCode Go (API key brány) |
| GitHub Credential | Prihlasovacie údaje GitHub PAT používané na prístup k repozitáru |
| Repository URL | HTTPS URL GitHub repozitára; podporuje výrazy |
| Base Branch | Vetva na klonovanie pred spustením OpenCode, predvolene `main` |
| Model | Model OpenCode Go (naživo prehľadávateľný dropdown, `opencode-go/<model>`); prázdne použije predvolenú hodnotu runnera |
| Reasoning Variant | Voliteľné; mapuje sa na `opencode run --variant` pre modely, ktoré podporujú reasoning effort |
| Task Prompt | Kódovacia úloha pre OpenCode; podporuje výrazy ako `$input.text` |
| Publish Mode | Ako sú zmeny doručené (pozri tabuľku nižšie) |
| Branch Name | Pracovná vetva pre PR/commit režimy, predvolene `opencode/$executionId` |
| Timeout | Maximálny čas vykonávania OpenCode v sekundách |

## Režimy publikovania

| Režim | Čo robí |
|------|--------------|
| `diff_only` | Upraví súbory lokálne a vráti patch a zmenené súbory. Nič sa nepushuje. |
| `draft_pr` | Commitne do vetvy, pushne ju a otvorí draft pull request. |
| `open_pr` | Commitne do vetvy, pushne ju a otvorí pull request pripravený na review (nie draft). |
| `commit_push` | Commitne do vetvy a pushne ju bez otvorenia pull requestu. |
| `direct_commit` | Commitne a pushne priamo do základnej vetvy (žiadna samostatná vetva ani PR). |
| `open_or_update_pr` | Aktualizuje existujúci otvorený PR agenta, ak existuje — aj keď sa názov vetvy líši, runner ho nájde podľa autora + základnej vetvy — inak otvorí nový. Najlepšie pre opakované spustenia a pokyny „aktualizuj otvorený PR". |
| `update_existing_pr` | Pridá commit do existujúcej vetvy/PR; otvorí jeden, ak ešte žiadny neexistuje. |
| `patch_artifact` | Uloží diff ako stiahnuteľný súbor a vráti `patchUrl`. Nič sa nepushuje. |

## Výstupy

| Kľúč | Popis |
|-----|-------------|
| `status` | Vždy `completed` (uzol OpenCode Go sa nepozastavuje pre vstup) |
| `summary` | Záverečná správa OpenCode |
| `validation` | Poznámky k validácii, ak boli nahlásené |
| `diff` | Git patch, ak sa zmenili súbory |
| `changedFiles` | Cesty zmenených súborov |
| `branchName` | Názov pracovnej vetvy |
| `pullRequestUrl` | URL PR v režimoch `draft_pr`, `open_pr`, `open_or_update_pr` a `update_existing_pr` |
| `pushedBranch` | Vetva, ktorá bola pushnutá v commit/PR režimoch |
| `patchUrl` | Odkaz na stiahnutie diffu v režime `patch_artifact` |
## Snímky obrazovky používateľského rozhrania v pull requestoch

Pri úlohách týkajúcich sa používateľského rozhrania/frontendu by mal OpenCode ukladať snímky obrazovky PNG do cesty ignorovanej gitom, ako napríklad `frontend/.e2e-artifacts/` (nie do zdrojového kódu). Ak chýbajú závislosti frontendu, prompt runnera povoľuje cielenú inštaláciu balíkov (napríklad `bun install`) plus krátkodobý náhľad/`bun run dev` výhradne na zachytenie používateľského rozhrania. Heym nahrá tieto obrázky do jedného zdieľaného GitHub **prerelease** (`opencode-pr-assets`) ako assety pomenované `<branch>-…`, potom ich vloží do popisu PR **pred otvorením pull requestu**, takže nový PR sa vytvorí už so svojimi snímkami obrazovky (existujúce PR sa aktualizujú na mieste).

OpenCode je tiež inštruovaný, aby ukončil s riadkom `PR_TITLE: …`, aby Heym mohol otvoriť pull request so zmysluplným predmetom namiesto zástupných symbolov, ako napríklad `Done.`

OpenCode niekedy ukončí kolo uprostred úlohy („…Now let me take a screenshot“), čo by ukončilo beh pred zachytením snímky obrazovky. Aby sa tomu zabránilo, prompt runnera vyžaduje zachytenie snímok obrazovky **pred** záverečnou správou, a ak sa beh napriek tomu dokončí bez publikovateľného zhrnutia alebo so zmenou používateľského rozhrania bez snímky obrazovky, Heym spustí ešte jeden priechod OpenCode v tom istom pracovnom priestore na dokončenie. Ak zmena používateľského rozhrania stále nemá snímku obrazovky, do tela PR sa pridá viditeľná poznámka, aby táto medzera nikdy nezostala ticho prehliadnutá.

## Čo sa publikuje na GitHub

Váš **Task Prompt** je súkromný vstup, nie obsah PR. Publikujú sa iba dve veci: `## Change Summary` opisujúce, čo zmena kódu robí, a sekcia `## Screenshots`, ak boli zachytené snímky obrazovky. Názov PR je odvodený výhradne zo zhrnutia zmien.

Prompt runnera uvádza túto politiku a Heym ju tiež vynucuje po behu: predtým, než sa čokoľvek commitne alebo otvorí ako pull request, odstráni zo zhrnutia, tela PR a správy commitu sekcie ozveny promptu (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) a akýkoľvek odsek doslovne skopírovaný z task promptu.

Heym číta sekciu `## Change Summary` zo správ agenta namiesto toho, aby vzal to, čo povedal naposledy, pretože OpenCode vydáva jednu správu na krok a posledná je často komentár uprostred behu. Rozprávanie krokov (`Both pass. Let me do a final review:`) sa tiež odmieta ako názov PR alebo predmet commitu. Ak beh nevyprodukuje použiteľné zhrnutie zmien, pull request sa namiesto publikovania komentára vráti k zoznamu zmenených súborov.

## Ako nástroj agenta

Uzol OpenCode Go je možné pripojiť k rukoväti nástroja uzla **AI Agent**, aby agent mohol delegovať úlohy kódovania. Nakonfigurujte prihlasovacie údaje, prihlasovacie údaje GitHub a repozitár na uzle, potom označte **Task Prompt** (a voliteľne **Repository URL**) prepínačom poskytovaným agentom, aby ich agent dodal v čase volania.

## Príklad

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

## Súvisiace

- [Uzol Codex](./codex-node.md)
- [Uzol GitHub](./github-node.md)
- [Uzol Agent](./agent-node.md)
- [Prihlasovacie údaje](../reference/credentials.md)
- [Zdieľanie prihlasovacích údajov](../reference/credentials-sharing.md)
- [Typy uzlov](../reference/node-types.md)
