# OpenCode Go Node

**OpenCode Go**-noden kører [OpenCode](https://opencode.ai) CLI (Go) i en isoleret, sikker Heym-container mod en GitHub-repository. Ligesom Codex-noden er den designet til kodningsopgaver som at rette tests, redigere filer, producere en patch eller åbne en pull request – men den bruger den provider-uafhængige **OpenCode Go** model-gateway i stedet for OpenAI Codex.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | OpenCode Go API-nøgle + GitHub |
| Output | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentificering

**OpenCode Go**-legitimationsoplysningerne gemmer en OpenCode Go gateway **API-nøgle** (fra [opencode.ai/go](https://opencode.ai/go)) og en valgfri **Gateway Base URL** (standard er `https://opencode.ai/zen/go/v1`; overskrives kun ved selvhostet eller proxy-gateway).

Noden kræver også **GitHub**-legitimationsoplysninger for at klone private repositories, pushe arbejdsgrenen og oprette pull requests. GitHub-tokenet placeres **aldrig i sandkassecontaineren** – Heym udfører alle git- og GitHub-operationer på værten, så genereret kode ikke kan eksfiltrere push-legitimationsoplysninger.

## Isolation og sikkerhed

Eksekveringsisolation vælges via `HEYM_OPENCODE_CLI_COMMAND`, præcis som med Codex-noden:

- **Lokal udvikling (`run.sh`)** lader den være standard `opencode`, så OpenCode kører som en subproces på værten mod den klonede arbejdsmappe – ingen Docker nødvendig, ingen ekstra flag.
- **Docker-deployment (`deploy.sh` og det enkelte GHCR-image)** sætter den til `/usr/local/bin/heym-opencode-docker`, en wrapper der kører `opencode run` i en **hærdet, engangsbrugbar sibling-container** der deler OpenCode-arbejdsmappens navngivne volumen.

Den hærdede runner-container dropper alle Linux-capabilities, sætter `no-new-privileges`, bruger en read-only root med en tmpfs `/tmp`, og anvender pid/hukommelse/CPU-begrænsninger. Netværksegress er tilladt (OpenCode skal kunne nå model-gatewayen). **GitHub-tokenet placeres aldrig i containeren** – alle git- og GitHub-operationer kører på værtsiden, så kun OpenCode API-nøglen og repository-filerne nogensinde er inde i containeren.

OpenCode redigerer kun filer på disken; Heym står for alle git/GitHub-handlinger.

## Modeller

OpenCode Go's modeludvalg ændrer sig ofte, så **Model**-feltet udfyldes live fra gatewayens modeliste (`GET https://opencode.ai/zen/go/v1/models`) og vises som en søgbar dropdown. Hvis den live liste ikke er tilgængelig, bruges en indbygget fallback-liste. Model-id'er bruger formen `opencode-go/<model>` (f.eks. `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) – `opencode-go` er OpenCode CLI's provider-id for Go-gatewayen. Lad feltet være tomt for at bruge runner-standard (`opencode-go/kimi-k3`). Model-id'er gemt i den ældre `opencode/<model>`-form omskrives automatisk ved kørsel.

## Felter

| Felt | Beskrivelse |
|-------|-------------|
| OpenCode Go-legitimationsoplysninger | OpenCode Go-legitimationsoplysninger (gateway API-nøgle) |
| GitHub-legitimationsoplysninger | GitHub PAT-legitimationsoplysninger brugt til repository-adgang |
| Repository-URL | HTTPS GitHub repository-URL; understøtter udtryk |
| Base Branch | Gren der klones før OpenCode kører, standard `main` |
| Model | OpenCode Go-model (live søgbar dropdown, `opencode-go/<model>`); tom bruger runner-standard |
| Reasoning Variant | Valgfri; mapper til `opencode run --variant` for modeller der understøtter reasoning-effort |
| Task Prompt | Kodningsopgave til OpenCode; understøtter udtryk som `$input.text` |
| Publish Mode | Hvordan ændringer leveres (se tabel nedenfor) |
| Branch Name | Arbejdsgren for PR/commit-tilstande, standard `opencode/$executionId` |
| Timeout | Maksimal OpenCode-eksekveringstid i sekunder |

## Publish Modes

| Mode | Handling |
|------|--------------|
| `diff_only` | Redigerer filer lokalt og returnerer patchen og ændrede filer. Intet pushes. |
| `draft_pr` | Committer til grenen, pusher den og åbner en draft pull request. |
| `open_pr` | Committer til grenen, pusher den og åbner en review-klar (ikke-draft) pull request. |
| `commit_push` | Committer til grenen og pusher den, uden at åbne en pull request. |
| `direct_commit` | Committer og pusher direkte til base-grenen (ingen separat gren eller PR). |
| `open_or_update_pr` | Opdaterer agentens eksisterende åbne PR når en findes – selv hvis grennavnet er forskelligt, finder runneren den via forfatter + base – ellers åbnes en ny. Bedst til genkørsler og "opdater den åbne PR"-instruktioner. |
| `update_existing_pr` | Tilføjer en commit til den eksisterende gren/PR; åbner en hvis ingen eksisterer endnu. |
| `patch_artifact` | Gemmer diff'en som en downloadbar fil og returnerer `patchUrl`. Intet pushes. |

## Outputs

| Nøgle | Beskrivelse |
|-----|-------------|
| `status` | Altid `completed` (OpenCode Go-noden venter ikke på input) |
| `summary` | OpenCodes sidste besked |
| `validation` | Valideringsnoter når rapporteret |
| `diff` | Git-patch når filer er ændret |
| `changedFiles` | Ændrede filstier |
| `branchName` | Arbejdsgrennavn |
| `pullRequestUrl` | PR-URL i `draft_pr`, `open_pr`, `open_or_update_pr` og `update_existing_pr`-tilstande |
| `pushedBranch` | Gren der blev pushet i commit/PR-tilstande |
| `patchUrl` | Download-link til diff'en i `patch_artifact`-tilstand |
## UI-screenshots på pull requests

For UI/frontend-opgaver skal OpenCode gemme PNG-screenshots under en gitignoreret sti såsom `frontend/.e2e-artifacts/` (ikke i kildekoden). Hvis frontend-afhængigheder mangler, tillader runner-prompt'en en målrettet pakkeinstallation (for eksempel `bun install`) plus en kortvarig forhåndsvisning/`bun run dev` udelukkende for at fange UI'et. Heym uploader disse billeder til en enkelt delt GitHub **prerelease** (`opencode-pr-assets`) som assets med navne som `<branch>-…`, og integrerer dem derefter i PR-beskrivelsen **før pull request'en åbnes**, så en ny PR oprettes allerede med sine screenshots (eksisterende PR'er opdateres på pladsen).

OpenCode instrueres også til at afslutte med en `PR_TITLE: …`-linje, så Heym kan åbne pull request'en med et meningsfuldt emne i stedet for pladsholdere som `Done.`

OpenCode afslutter undertiden en tur midt i en opgave ("…Now let me take a screenshot"), hvilket ville afslutte kørslen før screenshot'et er fanget. For at forhindre dette kræver runner-prompt'en, at screenshots fanges **før** den sidste besked, og hvis kørslen stadig afsluttes uden en publicerbar sammenfattning eller med en UI-ændring men intet screenshot, kører Heym endnu en OpenCode-runde i samme arbejdsområde for at afslutte. Hvis en UI-ændring stadig ikke har et screenshot bagefter, tilføjes en synlig note til PR-body'en, så manglen aldrig er tavs.

## Hvad der publiceres til GitHub

**Task Prompt** er privat input, ikke PR-indhold. Kun to ting publiceres: en `## Change Summary`, der beskriver, hvad kodeændringen gør, og en `## Screenshots`-sektion, når screenshots er fanget. PR-titlen er udledt udelukkende fra ændringssammenfatningen.

Runner-prompt'en angiver denne politik, og Heym håndhæver den også efter kørslen: før noget committes eller åbnes som en pull request, fjernes prompt-echo-sektioner (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) og ethvert afsnit kopieret ordret fra task-prompt'en fra sammenfattningen, PR-body'en og commit-beskeden.

Heym læser `## Change Summary`-sektionen ud af agentens beskeder i stedet for at tage hvad den sagde sidst, fordi OpenCode udsender en besked pr. trin, og den sidste er ofte midt i kørslen. Trin-narration (`Both pass. Let me do a final review:`) afvises også som PR-titel eller commit-subjekt. Hvis kørslen ikke producerer en brugbar ændringssammenfatning, falder pull request'en tilbage til at liste de ændrede filer i stedet for at publicere kommentarer.

## Som et agentværktøj

OpenCode Go-noden kan tilknyttes et **AI Agent**-nodes værktøjshåndtag, så agenten kan delegere kodningsopgaver. Konfigurer legitimationsoplysningerne, GitHub-legitimationsoplysningerne og repository'et på noden, og marker derefter **Task Prompt** (og eventuelt **Repository URL**) med agent-leveret toggle, så agenten leverer dem ved opkaldstidspunktet.

## Eksempel

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

## Relateret

- [Codex Node](./codex-node.md)
- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Legitimationsoplysninger](../reference/credentials.md)
- [Deling af legitimationsoplysninger](../reference/credentials-sharing.md)
- [Node-typer](../reference/node-types.md)
