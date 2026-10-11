# Uzol Codex

Uzol **Codex** spúšťa OpenAI Codex CLI v izolovanom pracovnom priestore Heym proti GitHub repozitáru. Je navrhnutý pre kódovacie úlohy, ako je oprava testov, úprava súborov, vytvorenie patche alebo otvorenie draft pull requestu.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1, plus `question` |
| Prihlasovacie údaje | Codex access token + GitHub |
| Výstup | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentifikácia

Prihlasovacie údaje **OpenAI Codex** podporujú dva režimy autentifikácie:

| Režim | Popis |
|------|-------------|
| **Sign in with ChatGPT** (odporúčané) | Prihlásenie cez OAuth (PKCE), ktoré využíva Vaše predplatné ChatGPT Plus/Pro, takže spustenia **nevytvárajú** náklady na API za jednotlivé tokeny. Kliknite na **Sign in with ChatGPT** v dialógovom okne prihlasovacích údajov, autorizujte v prehliadači a potom vložte presmerovaciu URL `localhost:1455` späť do Heym. Heym uloží výsledný token bundle a automaticky ho obnovuje, keď vyprší. |
| **Access token** | Vložte ChatGPT/Codex `access_token`, ktorý používa výhradne lokálny Codex runner. |

Pre prihlasovacie údaje Codex sa neakceptujú API kľúče. Uzol neodosiela cloudové Codex úlohy; klonuje repozitár v rámci Heym runtime, zapisuje ChatGPT token bundle do izolovaného `auth.json` (alebo odovzdáva `CODEX_ACCESS_TOKEN`) iba procesu Codex a udržiava token mimo `$credentials`.

Uzol tiež vyžaduje prihlasovacie údaje **GitHub** na klonovanie súkromných repozitárov, push pracovnej vetvy a vytváranie draft pull requestov.

V Docker nasadeniach Heym spúšťa Codex vnútri súbežného kontajnera z rovnakého Heym image (nie samostatného GHCR image). Tento kontajner pripája iba Codex workspace volume a umožňuje vlastnému bubblewrap sandboxu Codex vytvárať namespaces a nový `/proc`. Runner pridáva `SYS_ADMIN`, unconfined seccomp a AppArmor a `systempaths=unconfined` (Docker Engine 25+). Bez posledného flagu každý príkaz zlyhá pred spustením s `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Odkazy na OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Polia

| Pole | Popis |
|-------|-------------|
| Codex Credential | Prihlasovacie údaje OpenAI Codex (prihlásenie ChatGPT alebo `access_token`) |
| GitHub Credential | Prihlasovacie údaje GitHub PAT používané na prístup k repozitáru |
| Repository URL | HTTPS URL GitHub repozitára |
| Base Branch | Vetva na klonovanie pred spustením Codex, predvolená `main` |
| Model | Voliteľný model Codex (upraviteľný dropdown, napr. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); prázdne použije predvolený model Codex |
| Reasoning Effort | Hĺbka uvažovania Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` alebo `ultra` (predvolené `medium`) |
| Task Prompt | Kódovacia úloha pre Codex; podporuje výrazy ako `$input.text` |
| Publish Mode | Ako sa zmeny doručujú (pozri tabuľku nižšie) |
| Branch Name | Pracovná vetva pre režimy PR/commit, predvolená `codex/$executionId` |
| Timeout | Maximálny čas spustenia Codex v sekundách |

## Režimy publikovania

| Režim | Čo robí |
|------|--------------|
| `diff_only` | Upraví súbory lokálne a vráti patch a zmenené súbory. Nič sa nepushuje. |
| `draft_pr` | Commitne do vetvy, pushne ju a otvorí draft pull request. |
| `open_pr` | Commitne do vetvy, pushne ju a otvorí pull request pripravený na kontrolu (nie draft). |
| `commit_push` | Commitne do vetvy a pushne ju bez otvorenia pull requestu. |
| `direct_commit` | Commitne a pushne priamo do základnej vetvy (žiadna samostatná vetva ani PR). |
| `open_or_update_pr` | Aktualizuje existujúci otvorený PR agenta, ak existuje — aj keď sa názov vetvy líši, runner ho nájde podľa autora + základnej vetvy — inak otvorí nový. Najlepšie pre opakované spustenia a pokyny „aktualizuj otvorený PR". |
| `update_existing_pr` | Pridá commit do existujúcej vetvy/PR; ak zatiaľ žiadny neexistuje, otvorí jeden. |
| `patch_artifact` | Uloží diff ako stiahnuteľný súbor a vráti `patchUrl`. Nič sa nepushuje. |

## Výstupy

| Kľúč | Popis |
|-----|-------------|
| `status` | `completed` alebo `needs_input` |
| `summary` | Súhrn od Codex |
| `validation` | Poznámky k validácii, testy alebo kontroly hlásené Codex |
| `diff` | Git patch, keď sa zmenili súbory |
| `changedFiles` | Cesty zmenených súborov |
| `threadId` | ID vlákna/relácie Codex, ak je k dispozícii |
| `branchName` | Názov pracovnej vetvy |
| `pullRequestUrl` | URL PR v režimoch `draft_pr`, `open_pr`, `open_or_update_pr` a `update_existing_pr` |
| `pushedBranch` | Vetva, ktorá bola pushnutá v režimoch commit/PR |
| `patchUrl` | Odkaz na stiahnutie diffu v režime `patch_artifact` |
| `usage` | Metadáta o využití hlásené Codex CLI, ak sú k dispozícii |
## Snímky obrazovky používateľského rozhrania pri pull requestoch

Pri úlohách týkajúcich sa používateľského rozhrania/frontendu by mal Codex ukladať snímky obrazovky vo formáte PNG do cesty ignorovanej systémom git, napríklad `frontend/.e2e-artifacts/` (nie do zdrojového kódu). Ak chýbajú závislosti frontendu, Codex môže spustiť `bun install` (alebo npm/pnpm install) a spustiť krátkodobý náhľad/`bun run dev` výhradne na zachytenie používateľského rozhrania. Heym nahrá tieto obrázky do jedného zdieľaného GitHub **prerelease** (`codex-pr-assets`) ako assety pomenované `<branch>-…`, potom ich vloží do popisu PR **pred otvorením pull requestu**, takže nový PR sa vytvorí už so svojimi snímkami obrazovky (existujúce PR sa aktualizujú na mieste). Codex musí tiež nastaviť zmysluplný `pull_request_title` (nikdy zástupné symboly ako `Done.`).

Codex niekedy ukončí kolo uprostred úlohy („…Teraz urobím snímku obrazovky“), čo by ukončilo beh pred zachytením snímky obrazovky. Aby sa tomu zabránilo, prompt runnera vyžaduje zachytenie snímok obrazovky **pred** konečným výsledkom, a ak sa beh napriek tomu skončí bez publikovateľného zhrnutia alebo so zmenou používateľského rozhrania bez snímky obrazovky, Heym spustí ešte jeden priechod Codexu v tom istom pracovnom priestore na dokončenie. Ak zmena používateľského rozhrania stále nemá snímku obrazovky, do tela PR sa pridá viditeľná poznámka, aby táto medzera nikdy nebola tichá.

## Čo sa publikuje na GitHub

Váš **Task Prompt** je súkromný vstup, nie obsah PR. Publikujú sa iba dve veci: `## Change Summary` opisujúce, čo zmena kódu robí, a sekcia `## Screenshots`, keď boli zachytené snímky obrazovky. Názov PR je odvodený výhradne zo zhrnutia zmien.

Prompt runnera uvádza túto zásadu a Heym ju tiež vynucuje po behu: predtým, než sa čokoľvek commitne alebo otvorí ako pull request, odstráni sekcie ozývajúce prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) a akýkoľvek odsek skopírovaný doslovne z task promptu zo zhrnutia, tela PR a správy commitu. Rozprávanie krokov, ako napríklad `Both pass. Let me do a final review:`, sa tiež odmietne ako názov PR alebo predmet commitu.

## Následné otázky

Ak Codex potrebuje chýbajúce požiadavky alebo produktové rozhodnutie, vráti `needs_input`. Heym pozastaví vykonávanie a sprístupní výstupný handle `question`. Pripojte tento handle k vetve oznámenia, napríklad Slack alebo Send Email, aby ste recenzentovi poslali verejný odkaz na následné otázky.

Keď recenzent odpovie, Heym obnoví ten istý snímok vykonávania a vlákno Codexu z uložených metadát pracovného priestoru.

## Ako nástroj agenta

Uzol Codex je možné pripojiť k handle nástroja uzla **AI Agent**, aby agent mohol delegovať kódovacie úlohy. Nakonfigurujte prihlasovacie údaje, GitHub prihlasovacie údaje a repozitár na uzle, potom označte **Task Prompt** (a voliteľne **Repository URL**) prepínačom poskytnutým agentom, aby ich agent dodal v čase volania. Keď Codex beží ako nástroj, výsledok `needs_input` sa vráti priamo agentovi namiesto pozastavenia workflow, takže agent môže požiadavku spresniť a zavolať Codex znova.

## Príklad

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Súvisiace

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
