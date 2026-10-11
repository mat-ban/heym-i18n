# Uzel Codex

Uzel **Codex** spouští OpenAI Codex CLI v izolovaném pracovním prostoru Heym proti repozitáři GitHub. Je navržen pro programátorské úlohy, jako je oprava testů, úprava souborů, vytvoření patche nebo otevření konceptu pull requestu.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1, plus `question` |
| Přihlašovací údaje | Codex access token + GitHub |
| Výstup | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentizace

Přihlašovací údaje **OpenAI Codex** podporují dva režimy autentizace:

| Režim | Popis |
|------|-------------|
| **Přihlášení přes ChatGPT** (doporučeno) | Přihlášení pomocí OAuth (PKCE), které využívá Vaše předplatné ChatGPT Plus/Pro, takže spuštění **nevytvářejí** náklady na API za jednotlivé tokeny. V dialogu přihlašovacích údajů klikněte na **Sign in with ChatGPT**, autorizujte v prohlížeči a poté vložte přesměrovací URL `localhost:1455` zpět do Heym. Heym uloží výsledný token bundle a automaticky jej obnovuje při vypršení platnosti. |
| **Access token** | Vložte ChatGPT/Codex `access_token`, který používá pouze lokální Codex runner. |

Pro přihlašovací údaje Codex nejsou akceptovány API klíče. Uzel neodesílá cloudové úlohy Codex; naklonuje repozitář uvnitř runtime Heym, zapíše token bundle ChatGPT do izolovaného `auth.json` (nebo předá `CODEX_ACCESS_TOKEN`) pouze procesu Codex a udržuje token mimo `$credentials`.

Uzel rovněž vyžaduje přihlašovací údaje **GitHub** pro klonování soukromých repozitářů, odesílání pracovní větve a vytváření konceptů pull requestů.

V nasazeních Docker spouští Heym Codex uvnitř sourozeneckého kontejneru ze stejného image Heym (nikoli ze samostatného image GHCR). Tento kontejner připojuje pouze svazek pracovního prostoru Codex a umožňuje vlastnímu sandboxu bubblewrap nástroje Codex vytvářet namespaces a čerstvý `/proc`. Runner přidává `SYS_ADMIN`, neomezený seccomp a AppArmor a `systempaths=unconfined` (Docker Engine 25+). Bez posledního příznaku každý příkaz selže ještě před spuštěním s chybou `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Odkazy OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Pole

| Pole | Popis |
|-------|-------------|
| Codex Credential | Přihlašovací údaje OpenAI Codex (přihlášení přes ChatGPT nebo `access_token`) |
| GitHub Credential | Přihlašovací údaje GitHub PAT používané pro přístup k repozitáři |
| Repository URL | HTTPS URL repozitáře GitHub |
| Base Branch | Větev, která se naklonuje před spuštěním Codex, výchozí `main` |
| Model | Volitelný model Codex (upravitelný dropdown, např. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); prázdné použije výchozí model Codex |
| Reasoning Effort | Hloubka uvažování Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` nebo `ultra` (výchozí `medium`) |
| Task Prompt | Programátorská úloha pro Codex; podporuje výrazy jako `$input.text` |
| Publish Mode | Způsob doručení změn (viz tabulka níže) |
| Branch Name | Pracovní větev pro režimy PR/commit, výchozí `codex/$executionId` |
| Timeout | Maximální doba spuštění Codex v sekundách |

## Režimy publikování

| Režim | Co dělá |
|------|--------------|
| `diff_only` | Upraví soubory lokálně a vrátí patch a změněné soubory. Nic se neodešle. |
| `draft_pr` | Zapíše změny do větve, odešle ji a otevře koncept pull requestu. |
| `open_pr` | Zapíše změny do větve, odešle ji a otevře pull request připravený k revizi (nikoli koncept). |
| `commit_push` | Zapíše změny do větve a odešle ji, aniž by otevřel pull request. |
| `direct_commit` | Zapíše změny a odešle je přímo do základní větve (bez samostatné větve nebo PR). |
| `open_or_update_pr` | Aktualizuje existující otevřený PR agenta, pokud nějaký existuje — i když se název větve liší, runner jej najde podle autora + základní větve — jinak otevře nový. Nejlepší pro opakovaná spuštění a pokyny „aktualizuj otevřený PR". |
| `update_existing_pr` | Přidá commit do existující větve/PR; pokud žádný neexistuje, otevře jeden. |
| `patch_artifact` | Uloží diff jako soubor ke stažení a vrátí `patchUrl`. Nic se neodešle. |

## Výstupy

| Klíč | Popis |
|-----|-------------|
| `status` | `completed` nebo `needs_input` |
| `summary` | Shrnutí od Codex |
| `validation` | Poznámky k validaci, testy nebo kontroly hlášené Codex |
| `diff` | Git patch při změně souborů |
| `changedFiles` | Cesty změněných souborů |
| `threadId` | ID vlákna/relace Codex, pokud je k dispozici |
| `branchName` | Název pracovní větve |
| `pullRequestUrl` | URL PR v režimech `draft_pr`, `open_pr`, `open_or_update_pr` a `update_existing_pr` |
| `pushedBranch` | Větev, která byla odeslána v režimech commit/PR |
| `patchUrl` | Odkaz ke stažení diffu v režimu `patch_artifact` |
| `usage` | Metadata o využití hlášená Codex CLI, pokud jsou k dispozici |
## Snímky obrazovky UI v pull requestech

Pro úlohy týkající se UI/frontendu by měl Codex ukládat snímky obrazovky ve formátu PNG do cesty ignorované systémem git, například `frontend/.e2e-artifacts/` (nikoli do zdrojových souborů). Pokud chybí závislosti frontendu, může Codex spustit `bun install` (nebo npm/pnpm install) a spustit krátkodobý náhled/`bun run dev` výhradně za účelem zachycení UI. Heym nahraje tyto obrázky do jednoho sdíleného GitHub **prerelease** (`codex-pr-assets`) jako assety pojmenované `<branch>-…` a poté je vloží do popisu PR **před otevřením pull requestu**, takže nový PR je vytvořen již se svými snímky obrazovky (existující PR jsou aktualizovány na místě). Codex musí také nastavit smysluplný `pull_request_title` (nikdy zástupné texty jako `Done.`).

Codex někdy ukončí tah uprostřed úlohy („…Nyní mi dovolte pořídit snímek obrazovky"), což by finalizovalo běh před zachycením snímku obrazovky. Aby se tomu zabránilo, prompt runneru vyžaduje zachycení snímků obrazovky **před** konečným výsledkem, a pokud běh přesto skončí bez publikovatelného shrnutí nebo se změnou UI, ale bez snímku obrazovky, Heym spustí ještě jeden průchod Codexu ve stejném pracovním prostoru, aby jej dokončil. Pokud změna UI stále nemá snímek obrazovky, přidá se do těla PR viditelná poznámka, aby mezera nikdy nezůstala skrytá.

## Co se publikuje na GitHub

Váš **Task Prompt** je soukromý vstup, nikoli obsah PR. Publikují se pouze dvě věci: `## Change Summary` popisující, co změna kódu dělá, a sekce `## Screenshots`, pokud byly snímky obrazovky zachyceny. Název PR je odvozen výhradně ze shrnutí změn.

Prompt runneru uvádí tuto zásadu a Heym ji také vynucuje po běhu: předtím, než je cokoli potvrzeno nebo otevřeno jako pull request, odstraní sekce ozvěny promptu (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) a jakýkoli odstavec zkopírovaný doslovně z task promptu ze shrnutí, těla PR a zprávy commitu. Vyprávění kroků, jako například `Both pass. Let me do a final review:`, je také odmítnuto jako název PR nebo předmět commitu.

## Následné otázky

Pokud Codex potřebuje chybějící požadavky nebo produktové rozhodnutí, vrátí `needs_input`. Heym pozastaví spuštění a zpřístupní výstupní handle `question`. Připojte tento handle k větvi oznámení, například Slack nebo Send Email, abyste recenzentovi odeslali veřejný odkaz pro následné otázky.

Když recenzent odpoví, Heym obnoví stejný snímek spuštění a vlákno Codexu z uložených metadat pracovního prostoru.

## Jako nástroj agenta

Uzel Codex lze připojit k handle nástroje uzlu **AI Agent**, aby agent mohl delegovat kódovací úlohy. Na uzlu nakonfigurujte přihlašovací údaje, přihlašovací údaje GitHub a repozitář, poté označte **Task Prompt** (a volitelně **Repository URL**) přepínačem poskytnutým agentem, aby je agent dodal v době volání. Když Codex běží jako nástroj, výsledek `needs_input` je vrácen inline agentovi místo pozastavení workflow, takže agent může upřesnit požadavek a zavolat Codex znovu.

## Příklad

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

## Související

- [Uzel GitHub](./github-node.md)
- [Uzel Agent](./agent-node.md)
- [Přihlašovací údaje](../reference/credentials.md)
- [Sdílení přihlašovacích údajů](../reference/credentials-sharing.md)
- [Typy uzlů](../reference/node-types.md)
