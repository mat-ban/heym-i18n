# Codex Node

**Codex**-noden kører OpenAI Codex CLI i et isoleret Heym-workspace mod en GitHub-repository. Den er designet til kodningsopgaber som f.eks. at rette tests, redigere filer, producere en patch eller åbne en udkast-pull request.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1, plus `question` |
| Legitimationsoplysninger | Codex access token + GitHub |
| Output | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentificering

**OpenAI Codex**-legitimationsoplysningerne understøtter to autentificeringstilstande:

| Tilstand | Beskrivelse |
|------|-------------|
| **Sign in with ChatGPT** (anbefales) | OAuth (PKCE) sign-in, der bruger ChatGPT Plus/Pro-abonnementet, så kørsler **ikke** medfører per-token API-omkostninger. Klik på **Sign in with ChatGPT** i legitimationsdialogvinduet, godkend i browseren, og indsæt derefter `localhost:1455`-omdirigerings-URL'en tilbage i Heym. Heym gemmer den resulterende token-bundt og opdaterer den automatisk, når den udløber. |
| **Access token** | Indsæt en ChatGPT/Codex `access_token`, der kun bruges af den lokale Codex-runner. |

API-nøgler accepteres ikke for Codex-legitimationsoplysningerne. Noden indsender ikke cloud Codex-opgaver; den kloner repository'et inde i Heym-runtime, skriver ChatGPT-token-bundten til en isoleret `auth.json` (eller sender `CODEX_ACCESS_TOKEN`) kun til Codex-processen og holder token'et ude af `$credentials`.

Noden kræver også **GitHub**-legitimationsoplysninger for at klone private repositories, pushe arbejdsgrenen og oprette udkast-pull requests.

I Docker-installationer kører Heym Codex i en søstercontainer fra den samme Heym-image (ikke en separat GHCR-image). Den container monterer kun Codex-workspace-volumen og lader Codex's egen bubblewrap-sandkasse oprette namespaces og en frisk `/proc`. Runneren tilføjer `SYS_ADMIN`, ubegrænset seccomp og AppArmor samt `systempaths=unconfined` (Docker Engine 25+). Uden det sidste flag fejler hver kommando før lancering med `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

OpenAI-referencer:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Felter

| Felt | Beskrivelse |
|-------|-------------|
| Codex-legitimationsoplysninger | OpenAI Codex-legitimationsoplysninger (ChatGPT-sign-in eller `access_token`) |
| GitHub-legitimationsoplysninger | GitHub PAT-legitimationsoplysninger, der bruges til repository-adgang |
| Repository-URL | HTTPS GitHub-repository-URL |
| Base-gren | Gren, der skal klones før Codex-kørsler, standard `main` |
| Model | Valgfri Codex-model (redigerbar dropdown, f.eks. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); tom bruger Codex's standard |
| Reasoning Effort | Codex's ræsonnementstiefde: `low`, `medium`, `high`, `xhigh` (Extra High), `max`, eller `ultra` (standard `medium`) |
| Task Prompt | Kodningsopgave for Codex; understøtter udtryk som `$input.text` |
| Publish Mode | Hvordan ændringer leveres (se tabel nedenfor) |
| Branch Name | Arbejdsgren for PR/commit-tilstande, standard `codex/$executionId` |
| Timeout | Maksimal Codex-eksekveringstid i sekunder |

## Publish Modes

| Tilstand | Hvad den gør |
|------|--------------|
| `diff_only` | Redigerer filer lokalt og returnerer patchen og ændrede filer. Intet pushes. |
| `draft_pr` | Committer til grenen, pusher den og åbner en udkast-pull request. |
| `open_pr` | Committer til grenen, pusher den og åbner en klar til gennemgang (ikke-udkast) pull request. |
| `commit_push` | Committer til grenen og pusher den uden at åbne en pull request. |
| `direct_commit` | Committer og pusher direkte til base-grenen (ingen separat gren eller PR). |
| `open_or_update_pr` | Opdaterer agentens eksisterende åbne PR, hvis en eksisterer — selvom grennavnet er forskelligt, finder runneren den via forfatter + base — ellers åbnes en ny. Bedst til genkørsler og "opdater den åbne PR"-instruktioner. |
| `update_existing_pr` | Tilføjer en commit til den eksisterende gren/PR; åbner en, hvis ingen eksisterer endnu. |
| `patch_artifact` | Gemmer diff'en som en downloadbar fil og returnerer `patchUrl`. Intet pushes. |

## Outputs

| Nøgle | Beskrivelse |
|-----|-------------|
| `status` | `completed` eller `needs_input` |
| `summary` | Codex's resumé |
| `validation` | Valideringsnoter, tests eller checks rapporteret af Codex |
| `diff` | Git-patch, når filer er ændret |
| `changedFiles` | Ændrede filstier |
| `threadId` | Codex-tråd/session-id, når tilgængelig |
| `branchName` | Arbejdsgrennavn |
| `pullRequestUrl` | PR-URL i `draft_pr`, `open_pr`, `open_or_update_pr` og `update_existing_pr`-tilstande |
| `pushedBranch` | Gren, der blev pushet i commit/PR-tilstande |
| `patchUrl` | Downloadlink til diff'en i `patch_artifact`-tilstand |
| `usage` | Brugsmetadata rapporteret af Codex CLI, når tilgængelig |
## UI-screenshots på pull requests

For UI/frontend-opgaver skal Codex gemme PNG-screenshots under en gitignoreret sti som `frontend/.e2e-artifacts/` (ikke i kildekoden). Hvis frontend-afhængigheder mangler, kan Codex køre `bun install` (eller npm/pnpm install) og starte en kortvarig preview/`bun run dev` udelukkende for at indfange UI'en. Heym uploader disse billeder til en fælles GitHub **prerelease** (`codex-pr-assets`) som aktiver med navnet `<branch>-…`, hvorefter de indlejres i PR-beskrivelsen **før pull request'en åbnes**, så en ny PR oprettes med screenshots inkluderet fra starten (eksisterende PR'er opdateres på plads). Codex skal også angive en meningsfuld `pull_request_title` (aldrig pladsholdere som `Done.`).

Codex afslutter nogle gange en tur midt i en opgave ("…Lad mig nu tage et screenshot"), hvilket ville afslutte kørslen før screenshotet er taget. For at forhindre dette kræver runner-prompten, at screenshots tages **før** det endelige resultat, og hvis kørslen alligevel afsluttes uden et publicerbart resumé eller med en UI-ændring uden screenshot, kører Heym endnu en Codex-gennemgang i samme arbejdsområde for at afslutte. Hvis en UI-ændring stadig mangler screenshot tilføjes en synlig note til PR-body'en, så manglen aldrig forbliver ukommenteret.

## Hvad publiceres til GitHub

**Task Prompt** er privat input, ikke PR-indhold. Kun to ting publiceres: en `## Change Summary`, der beskriver hvad kodeændringen gør, og en `## Screenshots`-sektion når screenshots er taget. PR-titlen afledes udelukkende fra ændringssummeringen.

Runner-prompten angiver denne politik, og Heym håndhæver den også efter kørslen: før noget committes eller åbnes som pull request, fjernes prompt-echo-sektioner (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) og enhver paragraf kopieret direkte fra task-prompten fra summeringen, PR-body'en og commit-beskeden. Trin-narration som `Both pass. Let me do a final review:` afvises også som PR-titel eller commit-emne.

## Opfølgende spørgsmål

Hvis Codex har brug for manglende krav eller en produktbeslutning, returneres `needs_input`. Heym sætter kørslen på pause og eksponerer et `question` output-handle. Forbind dette handle med en notifikationsgren, f.eks. Slack eller Send Email, for at sende anmelderen det offentlige opfølgningslink.

Når anmelderen svarer, genoptager Heym den samme execution-snapshot og Codex-tråd fra de gemte arbejdsområdemetadata.

## Som agentværktøj

Codex-noden kan tilsluttes et **AI Agent**-nodes tool-handle, så agenten kan delegere kodningsopgaver. Konfigurer credential, GitHub-credential og repository på noden, og marker derefter **Task Prompt** (og valgfrit **Repository URL**) med agent-leveret toggle, så agenten leverer dem ved kaldtid. Når Codex kører som værktøj, returneres et `needs_input`-resultat inline til agenten i stedet for at sætte workflowet på pause, så agenten kan præcisere anmodningen og kalde Codex igen.

## Eksempel

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

## Relateret

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Legitimationsoplysninger](../reference/credentials.md)
- [Deling af legitimationsoplysninger](../reference/credentials-sharing.md)
- [Nodetyper](../reference/node-types.md)
