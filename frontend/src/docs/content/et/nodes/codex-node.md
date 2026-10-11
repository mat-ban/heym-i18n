# Codex Node

**Codex** node käivitab OpenAI Codex CLI isoleeritud Heymi tööruumis GitHubi repositooriumi vastu. See on mõeldud kodeerimisülesannete jaoks, nagu testide parandamine, failide muutmine, patch'i loomine või draft pull request'i avamine.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1, lisaks `question` |
| Mandaat | Codexi access token + GitHub |
| Väljund | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentimine

**OpenAI Codex** mandaat toetab kahte autentimisrežiimi:

| Režiim | Kirjeldus |
|------|-------------|
| **Sign in with ChatGPT** (soovitatav) | OAuth (PKCE) sisselogimine, mis kasutab Teie ChatGPT Plus/Pro tellimust, seega käivitused **ei** tekita tokenipõhiseid API kulusid. Klõpsake mandaadi dialoogis **Sign in with ChatGPT**, autoriseerige brauseris, seejärel kleepige `localhost:1455` ümbersuunamise URL tagasi Heymi. Heym salvestab saadud tokeni komplekti ja värskendab seda automaatselt selle aegumisel. |
| **Access token** | Kleepige ChatGPT/Codexi `access_token`, mida kasutab ainult kohalik Codexi runner. |

Codexi mandaadi jaoks API võtmeid ei aktsepteerita. Node ei esita pilve Codexi ülesandeid; see kloonib repositooriumi Heymi runtime'i sees, kirjutab ChatGPT tokeni komplekti isoleeritud `auth.json` faili (või edastab `CODEX_ACCESS_TOKEN`) ainult Codexi protsessile ning hoiab tokeni `$credentials`-st eemal.

Node nõuab ka **GitHub** mandaati privaatsete repositooriumide kloonimiseks, tööharu push'imiseks ja draft pull request'ide loomiseks.

Dockeri juurutustes käivitab Heym Codexi õdekontaineris samast Heymi imagest (mitte eraldi GHCR imagest). See konteiner mountib ainult Codexi tööruumi volume'i ja laseb Codexi enda bubblewrap sandbox'il luua nimeruume ja värske `/proc`. Runner lisab `SYS_ADMIN`, piiramata seccomp ja AppArmor ning `systempaths=unconfined` (Docker Engine 25+). Ilma viimase liputa ebaõnnestub iga käsk enne käivitamist veaga `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

OpenAI viited:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Väljad

| Väli | Kirjeldus |
|-------|-------------|
| Codex Credential | OpenAI Codexi mandaat (ChatGPT sisselogimine või `access_token`) |
| GitHub Credential | GitHub PAT mandaat, mida kasutatakse repositooriumile juurdepääsuks |
| Repository URL | HTTPS GitHubi repositooriumi URL |
| Base Branch | Haru, mis kloonitakse enne Codexi käivitamist, vaikimisi `main` |
| Model | Valikuline Codexi mudel (muudetav rippmenüü, nt `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); tühi kasutab Codexi vaikimisi mudelit |
| Reasoning Effort | Codexi arutlemise sügavus: `low`, `medium`, `high`, `xhigh` (Extra High), `max` või `ultra` (vaikimisi `medium`) |
| Task Prompt | Kodeerimisülesanne Codexile; toetab avaldisi nagu `$input.text` |
| Publish Mode | Kuidas muudatused edastatakse (vt tabelit allpool) |
| Branch Name | Tööharu PR/commit režiimide jaoks, vaikimisi `codex/$executionId` |
| Timeout | Codexi maksimaalne täitmisaeg sekundites |

## Publish Modes

| Režiim | Mida see teeb |
|------|--------------|
| `diff_only` | Muudab faile lokaalselt ning tagastab patch'i ja muudetud failid. Midagi ei push'ita. |
| `draft_pr` | Commit'ib harule, push'ib selle ja avab draft pull request'i. |
| `open_pr` | Commit'ib harule, push'ib selle ja avab ülevaatamiseks valmis (mitte-draft) pull request'i. |
| `commit_push` | Commit'ib harule ja push'ib selle, ilma pull request'i avamata. |
| `direct_commit` | Commit'ib ja push'ib otse baasharule (eraldi haru ega PR puudub). |
| `open_or_update_pr` | Värskendab agendi olemasolevat avatud PR-i, kui see on olemas — isegi kui haru nimi erineb, leiab runner selle autori + baasharu järgi — vastasel juhul avab uue. Parim korduskäivituste ja "update the open PR" juhiste jaoks. |
| `update_existing_pr` | Lisab commit'i olemasolevale harule/PR-ile; avab ühe, kui ühtegi veel ei ole. |
| `patch_artifact` | Salvestab diff'i allalaaditava failina ja tagastab `patchUrl`. Midagi ei push'ita. |

## Väljundid

| Võti | Kirjeldus |
|-----|-------------|
| `status` | `completed` või `needs_input` |
| `summary` | Codexi kokkuvõte |
| `validation` | Valideerimise märkmed, testid või kontrollid, millest Codex teatas |
| `diff` | Git patch, kui faile muudeti |
| `changedFiles` | Muudetud failide teed |
| `threadId` | Codexi thread/sessiooni id, kui saadaval |
| `branchName` | Tööharu nimi |
| `pullRequestUrl` | PR URL režiimides `draft_pr`, `open_pr`, `open_or_update_pr` ja `update_existing_pr` |
| `pushedBranch` | Haru, mis push'iti commit/PR režiimides |
| `patchUrl` | Allalaadimise link diff'ile režiimis `patch_artifact` |
| `usage` | Codex CLI teatatud kasutusmetaandmed, kui saadaval |
## UI kuvatõmmised pull request'idel

UI/frontend ülesannete puhul peaks Codex salvestama PNG-kuvatõmmised gitignore'itud kausta, näiteks `frontend/.e2e-artifacts/` (mitte lähtekoodi). Kui frontendi sõltuvused puuduvad, võib Codex käivitada `bun install` (või npm/pnpm install) ja käivitada lühiajalise eelvaate/`bun run dev` ainult UI jäädvustamiseks. Heym laadib need pildid üles ühte jagatud GitHubi **prerelease**'i (`codex-pr-assets`) asset'idena nimega `<branch>-…`, seejärel manustab need PR-i kirjeldusse **enne pull request'i avamist**, nii et uus PR luuakse juba oma kuvatõmmistega (olemasolevaid PR-e uuendatakse kohapeal). Codex peab määrama ka sisuka `pull_request_title` (mitte kunagi kohatäitjaid nagu `Done.`).

Codex lõpetab mõnikord käigu keset ülesannet ("…Now let me take a screenshot"), mis lõpetaks käivituse enne kuvatõmmise jäädvustamist. Selle vältimiseks nõuab runner prompt kuvatõmmiste jäädvustamist **enne** lõpptulemust, ja kui käivitus siiski lõpeb ilma avaldatava kokkuvõtteta või UI muudatusega, millel pole kuvatõmmist, käivitab Heym samas tööruumis veel ühe Codexi käigu lõpetamiseks. Kui UI muudatusel pole pärast seda ikka kuvatõmmist, lisatakse PR-i kirjesse nähtav märkus, et lünk ei jääks kunagi märkamatuks.

## Mis avaldatakse GitHubi

Teie **Task Prompt** on privaatne sisend, mitte PR-i sisu. Avaldatakse ainult kaks asja: `## Change Summary`, mis kirjeldab, mida koodimuudatus teeb, ja `## Screenshots` sektsioon, kui kuvatõmmised jäädvustati. PR-i pealkiri tuletatakse üksnes muudatuse kokkuvõttest.

Runner prompt sätestab selle poliitika ja Heym rakendab seda ka pärast käivitust: enne kui midagi commit'itakse või pull request'ina avatakse, eemaldab see prompti kaja sektsioonid (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) ja ükskõik millise lõigu, mis on ülesande promptist sõna-sõnalt kopeeritud, kokkuvõttest, PR-i kirjast ja commit-sõnumist. Sammude jutustamine nagu `Both pass. Let me do a final review:` lükatakse samuti tagasi PR-i pealkirjana või commit'i teemana.

## Järelküsimused

Kui Codex vajab puuduvaid nõudeid või tooteotsust, tagastab see `needs_input`. Heym peatab käivituse ja pakub välja `question` väljundkäepideme. Ühendage see käepide teavitusharuga, näiteks Slack või Send Email, et saata ülevaatajale avalik järelküsimuse link.

Kui ülevaataja vastab, jätkab Heym sama käivituse hetktõmmise ja Codexi lõimega salvestatud tööruumi metaandmetest.

## Agendi tööriistana

Codexi node'i saab kinnitada **AI Agent** node'i tööriista käepideme külge, et agent saaks kodeerimisülesandeid delegeerida. Konfigureerige node'il mandaat, GitHubi mandaat ja hoidla, seejärel märkige **Task Prompt** (ja valikuliselt **Repository URL**) agendi pakutava lülitiga, et agent esitaks need kutse ajal. Kui Codex töötab tööriistana, tagastatakse `needs_input` tulemus agentile reasiseselt, selle asemel et workflow'd peatada, nii et agent saab taotlust täpsustada ja Codexit uuesti kutsuda.

## Näide

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

## Seotud

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
