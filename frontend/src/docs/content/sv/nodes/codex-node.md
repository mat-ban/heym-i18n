# Codex-nod

**Codex**-noden kör OpenAI Codex CLI i en isolerad Heym-arbetsyta mot ett GitHub-arkiv. Den är utformad för kodningsuppgifter som att åtgärda tester, redigera filer, producera en patch eller öppna en draft pull request.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1, plus `question` |
| Autentiseringsuppgift | Codex access token + GitHub |
| Utdata | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentisering

Autentiseringsuppgiften **OpenAI Codex** stöder två autentiseringslägen:

| Läge | Beskrivning |
|------|-------------|
| **Sign in with ChatGPT** (rekommenderas) | OAuth-inloggning (PKCE) som använder en ChatGPT Plus/Pro-prenumeration, vilket innebär att körningar **inte** medför API-kostnader per token. Klicka på **Sign in with ChatGPT** i dialogrutan för autentiseringsuppgifter, auktorisera i webbläsaren och klistra sedan in omdirigerings-URL:en för `localhost:1455` tillbaka i Heym. Heym lagrar det resulterande token-paketet och uppdaterar det automatiskt när det upphör att gälla. |
| **Access token** | Klistra in en ChatGPT/Codex `access_token` som endast används av den lokala Codex-runnern. |

API-nycklar accepteras inte för Codex-autentiseringsuppgiften. Noden skickar inte in molnbaserade Codex-uppgifter; den klonar arkivet i Heym-runtime-miljön, skriver ChatGPT-token-paketet till en isolerad `auth.json` (eller skickar `CODEX_ACCESS_TOKEN`) endast till Codex-processen och håller token utanför `$credentials`.

Noden kräver även en **GitHub**-autentiseringsuppgift för att klona privata arkiv, pusha arbetsgrenen och skapa draft pull requests.

I Docker-distributioner kör Heym Codex inuti en syskoncontainer från samma Heym-avbildning (inte en separat GHCR-avbildning). Den containern monterar endast Codex-arbetsytans volym och låter Codex egen bubblewrap-sandbox skapa namespaces och en ny `/proc`. Runnern lägger till `SYS_ADMIN`, oinskränkt seccomp och AppArmor samt `systempaths=unconfined` (Docker Engine 25+). Utan den sista flaggan misslyckas varje kommando före start med `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

OpenAI-referenser:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Fält

| Fält | Beskrivning |
|-------|-------------|
| Codex Credential | OpenAI Codex-autentiseringsuppgift (ChatGPT-inloggning eller `access_token`) |
| GitHub Credential | GitHub PAT-autentiseringsuppgift som används för åtkomst till arkivet |
| Repository URL | HTTPS-URL till GitHub-arkiv |
| Base Branch | Gren att klona innan Codex körs, standard `main` |
| Model | Valfri Codex-modell (redigerbar rullgardinsmeny, t.ex. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); tom använder Codex standard |
| Reasoning Effort | Codex resonemangsdjup: `low`, `medium`, `high`, `xhigh` (Extra High), `max` eller `ultra` (standard `medium`) |
| Task Prompt | Kodningsuppgift för Codex; stöder uttryck som `$input.text` |
| Publish Mode | Hur ändringar levereras (se tabellen nedan) |
| Branch Name | Arbetsgren för PR-/commit-lägen, standard `codex/$executionId` |
| Timeout | Maximal körtid för Codex i sekunder |

## Publiceringslägen

| Läge | Vad det gör |
|------|--------------|
| `diff_only` | Redigerar filer lokalt och returnerar patchen och ändrade filer. Inget pushas. |
| `draft_pr` | Committar till grenen, pushar den och öppnar en draft pull request. |
| `open_pr` | Committar till grenen, pushar den och öppnar en granskningsklar (icke-draft) pull request. |
| `commit_push` | Committar till grenen och pushar den, utan att öppna en pull request. |
| `direct_commit` | Committar och pushar direkt till basgrenen (ingen separat gren eller PR). |
| `open_or_update_pr` | Uppdaterar agentens befintliga öppna PR när en sådan finns — även om grennamnet skiljer sig hittar runnern den via författare + bas — annars öppnas en ny. Bäst för omkörningar och instruktioner som "uppdatera den öppna PR:en". |
| `update_existing_pr` | Lägger till en commit på den befintliga grenen/PR:en; öppnar en om ingen finns ännu. |
| `patch_artifact` | Sparar diffen som en nedladdningsbar fil och returnerar `patchUrl`. Inget pushas. |

## Utdata

| Nyckel | Beskrivning |
|-----|-------------|
| `status` | `completed` eller `needs_input` |
| `summary` | Codex sammanfattning |
| `validation` | Valideringsanteckningar, tester eller kontroller som rapporterats av Codex |
| `diff` | Git-patch när filer ändrats |
| `changedFiles` | Sökvägar till ändrade filer |
| `threadId` | Codex tråd-/sessions-id när tillgängligt |
| `branchName` | Arbetsgrenens namn |
| `pullRequestUrl` | PR-URL i lägena `draft_pr`, `open_pr`, `open_or_update_pr` och `update_existing_pr` |
| `pushedBranch` | Grenen som pushades i commit-/PR-lägen |
| `patchUrl` | Nedladdningslänk för diffen i läget `patch_artifact` |
| `usage` | Användningsmetadata som rapporterats av Codex CLI när tillgängligt |
## UI-skärmbilder i pull requests

För UI-/frontend-uppgifter bör Codex spara PNG-skärmbilder under en gitignorerad sökväg såsom `frontend/.e2e-artifacts/` (inte i källkoden). Om frontend-beroenden saknas får Codex köra `bun install` (eller npm/pnpm install) och starta en kortlivad förhandsvisning/`bun run dev` enbart för att fånga gränssnittet. Heym laddar upp dessa bilder till en enda delad GitHub-**prerelease** (`codex-pr-assets`) som assets med namn `<branch>-…` och bäddar sedan in dem i PR-beskrivningen **innan pull requesten öppnas**, så att en ny PR skapas med sina skärmbilder redan inkluderade (befintliga PR:er uppdateras på plats). Codex måste även ange en meningsfull `pull_request_title` (aldrig platshållare såsom `Done.`).

Codex avslutar ibland en tur mitt i en uppgift ("…Now let me take a screenshot"), vilket skulle slutföra körningen innan skärmbilden har fångats. För att förhindra detta kräver runner-prompten att skärmbilder fångas **före** slutresultatet, och om körningen ändå avslutas utan en publicerbar sammanfattning eller med en UI-ändring men utan skärmbild, kör Heym ytterligare en Codex-omgång i samma workspace för att slutföra. Om en UI-ändring fortfarande saknar skärmbild efteråt läggs en synlig not till i PR-texten så att luckan aldrig är tyst.

## Vad som publiceras till GitHub

Angiven **Task Prompt** är privat indata, inte PR-innehåll. Endast två saker publiceras: en `## Change Summary` som beskriver vad kodändringen gör, och ett `## Screenshots`-avsnitt när skärmbilder har fångats. PR-titeln härleds enbart från ändringssammanfattningen.

Runner-prompten anger denna policy, och Heym upprätthåller den även efter körningen: innan något committas eller öppnas som en pull request tar den bort prompt-ekoavsnitt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) och alla stycken som kopierats ordagrant från uppgiftsprompten ur sammanfattningen, PR-texten och commit-meddelandet. Stegbeskrivningar såsom `Both pass. Let me do a final review:` avvisas också som PR-titel eller commit-ämne.

## Uppföljningsfrågor

Om Codex behöver saknade krav eller ett produktbeslut returnerar den `needs_input`. Heym pausar körningen och exponerar en `question`-utdatahake. Anslut den haken till en aviseringsgren, till exempel Slack eller Send Email, för att skicka den publika uppföljningslänken till granskaren.

När granskaren svarar återupptar Heym samma körningsögonblicksbild och Codex-tråd från den sparade workspace-metadatan.

## Som ett agentverktyg

Codex-noden kan kopplas till en **AI Agent**-nodes verktygshake så att agenten kan delegera kodningsuppgifter. Konfigurera autentiseringsuppgiften, GitHub-autentiseringsuppgiften och repositoryt på noden, markera sedan **Task Prompt** (och valfritt **Repository URL**) med den agent-tillhandahållna växeln så att agenten tillhandahåller dem vid anropstillfället. När Codex körs som ett verktyg returneras ett `needs_input`-resultat inline till agenten istället för att pausa workflowet, så att agenten kan förfina begäran och anropa Codex igen.

## Exempel

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

## Relaterat

- [GitHub-nod](./github-node.md)
- [Agent-nod](./agent-node.md)
- [Autentiseringsuppgifter](../reference/credentials.md)
- [Delning av autentiseringsuppgifter](../reference/credentials-sharing.md)
- [Nodtyper](../reference/node-types.md)
