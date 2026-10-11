# OpenCode Go-nod

**OpenCode Go**-noden kör [OpenCode](https://opencode.ai)-CLI:n (Go) i en isolerad, härdad Heym-container mot ett GitHub-arkiv. Precis som Codex-noden är den utformad för kodningsuppgifter såsom att åtgärda tester, redigera filer, producera en patch eller öppna en pull request — men den använder den leverantörsoberoende modellgatewayen **OpenCode Go** i stället för OpenAI Codex.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgift | OpenCode Go API-nyckel + GitHub |
| Utdata | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentisering

Autentiseringsuppgiften **OpenCode Go** lagrar en **API-nyckel** för OpenCode Go-gatewayen (från [opencode.ai/go](https://opencode.ai/go)) samt en valfri **Gateway Base URL** (standardvärdet är `https://opencode.ai/zen/go/v1`; åsidosätt endast för en egenhostad eller proxad gateway).

Noden kräver även en **GitHub**-autentiseringsuppgift för att klona privata arkiv, pusha arbetsgrenen och skapa pull requests. GitHub-token placeras **aldrig inuti sandbox-containern** — Heym utför alla git- och GitHub-operationer på värden, så genererad kod kan inte läcka push-autentiseringsuppgifter.

## Isolering och säkerhet

Körningsisolering väljs via `HEYM_OPENCODE_CLI_COMMAND`, precis som för Codex-noden:

- **Lokal utveckling (`run.sh`)** lämnar den vid standardvärdet `opencode`, så OpenCode körs som en värdsubprocess mot den klonade arbetsytan — ingen Docker krävs, inga extra flaggor.
- **Docker-distributioner (`deploy.sh` och den enskilda GHCR-avbildningen)** sätter den till `/usr/local/bin/heym-opencode-docker`, en wrapper som kör `opencode run` inuti en **härdad, tillfällig syskoncontainer** som delar den namngivna volymen för OpenCode-arbetsytan.

Den härdade runner-containern tar bort alla Linux-capabilities, sätter `no-new-privileges`, använder en skrivskyddad rot med en tmpfs `/tmp` samt tillämpar pid-/minnes-/CPU-gränser. Nätverksutgång tillåts (OpenCode måste nå modellgatewayen). **GitHub-token placeras aldrig inuti containern** — alla git- och GitHub-operationer körs på värdsidan, så endast OpenCode API-nyckeln och arkivfilerna finns någonsin inuti.

OpenCode redigerar endast filer på disk; Heym äger varje git-/GitHub-åtgärd.

## Modeller

OpenCode Gos modellutbud ändras ofta, så fältet **Model** fylls i live från gatewayens modellista (`GET https://opencode.ai/zen/go/v1/models`) och visas som en sökbar rullgardinsmeny. Om den live-listan inte är tillgänglig används en inbyggd reservlista. Modell-id:n använder formen `opencode-go/<model>` (till exempel `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` är OpenCode-CLI:ns leverantörs-id för Go-gatewayen. Lämna fältet tomt för att använda runner-standardvärdet (`opencode-go/kimi-k3`). Modell-id:n som sparats i den äldre formen `opencode/<model>` skrivs om automatiskt vid körning.

## Fält

| Fält | Beskrivning |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go-autentiseringsuppgift (gateway-API-nyckel) |
| GitHub Credential | GitHub PAT-autentiseringsuppgift som används för arkivåtkomst |
| Repository URL | HTTPS-URL till GitHub-arkiv; stöder uttryck |
| Base Branch | Gren att klona innan OpenCode körs, standard `main` |
| Model | OpenCode Go-modell (live-sökbar rullgardinsmeny, `opencode-go/<model>`); tomt använder runner-standardvärdet |
| Reasoning Variant | Valfritt; mappas till `opencode run --variant` för modeller som stöder reasoning effort |
| Task Prompt | Kodningsuppgift för OpenCode; stöder uttryck såsom `$input.text` |
| Publish Mode | Hur ändringar levereras (se tabellen nedan) |
| Branch Name | Arbetsgren för PR-/commit-lägen, standard `opencode/$executionId` |
| Timeout | Maximal körningstid för OpenCode i sekunder |

## Publiceringslägen

| Läge | Vad det gör |
|------|--------------|
| `diff_only` | Redigerar filer lokalt och returnerar patchen och ändrade filer. Inget pushas. |
| `draft_pr` | Committar till grenen, pushar den och öppnar en draft-pull request. |
| `open_pr` | Committar till grenen, pushar den och öppnar en granskningsklar (icke-draft) pull request. |
| `commit_push` | Committar till grenen och pushar den, utan att öppna en pull request. |
| `direct_commit` | Committar och pushar direkt till basgrenen (ingen separat gren eller PR). |
| `open_or_update_pr` | Uppdaterar agentens befintliga öppna PR när en sådan finns — även om grennamnet skiljer sig hittar runnern den via författare + bas — annars öppnas en ny. Bäst för omkörningar och instruktioner av typen "uppdatera den öppna PR:en". |
| `update_existing_pr` | Lägger till en commit på den befintliga grenen/PR:en; öppnar en om ingen finns ännu. |
| `patch_artifact` | Sparar diffen som en nedladdningsbar fil och returnerar `patchUrl`. Inget pushas. |

## Utdata

| Nyckel | Beskrivning |
|-----|-------------|
| `status` | Alltid `completed` (OpenCode Go-noden pausar inte för indata) |
| `summary` | OpenCodes slutliga meddelande |
| `validation` | Valideringsanteckningar när sådana rapporteras |
| `diff` | Git-patch när filer ändrats |
| `changedFiles` | Sökvägar till ändrade filer |
| `branchName` | Arbetsgrenens namn |
| `pullRequestUrl` | PR-URL i lägena `draft_pr`, `open_pr`, `open_or_update_pr` och `update_existing_pr` |
| `pushedBranch` | Grenen som pushades i commit-/PR-lägen |
| `patchUrl` | Nedladdningslänk för diffen i läget `patch_artifact` |
## UI-skärmbilder i pull requests

För UI-/frontend-uppgifter bör OpenCode spara PNG-skärmbilder under en gitignorerad sökväg såsom `frontend/.e2e-artifacts/` (inte i källkoden). Om frontend-beroenden saknas tillåter runner-prompten en riktad paketinstallation (till exempel `bun install`) samt en kortlivad förhandsvisning/`bun run dev` enbart för att fånga gränssnittet. Heym laddar upp dessa bilder till en enda delad GitHub-**prerelease** (`opencode-pr-assets`) som assets med namnet `<branch>-…` och bäddar sedan in dem i PR-beskrivningen **innan pull requesten öppnas**, så att en ny PR skapas med sina skärmbilder redan inkluderade (befintliga PR:er uppdateras på plats).

OpenCode instrueras även att avsluta med en rad `PR_TITLE: …` så att Heym kan öppna pull requesten med ett meningsfullt ämne i stället för platshållare som `Done.`

OpenCode avslutar ibland en tur mitt i en uppgift ("…Now let me take a screenshot"), vilket skulle slutföra körningen innan skärmbilden har fångats. För att förhindra detta kräver runner-prompten att skärmbilder fångas **före** det slutliga meddelandet, och om körningen ändå avslutas utan en publicerbar sammanfattning eller med en UI-ändring men utan skärmbild, kör Heym ytterligare en OpenCode-omgång i samma workspace för att slutföra. Om en UI-ändring fortfarande saknar skärmbild därefter läggs en synlig not till i PR-texten så att luckan aldrig förblir tyst.

## Vad som publiceras till GitHub

Angiven **Task Prompt** är privat indata, inte PR-innehåll. Endast två saker publiceras: en `## Change Summary` som beskriver vad kodändringen gör, och ett `## Screenshots`-avsnitt när skärmbilder har fångats. PR-titeln härleds enbart från ändringssammanfattningen.

Runner-prompten anger denna policy, och Heym upprätthåller den även efter körningen: innan något committas eller öppnas som en pull request tar den bort prompt-eko-avsnitt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) och alla stycken som kopierats ordagrant från uppgiftsprompten ur sammanfattningen, PR-texten och commit-meddelandet.

Heym läser avsnittet `## Change Summary` ur agentens meddelanden i stället för att ta det som sades sist, eftersom OpenCode skickar ett meddelande per steg och det sista ofta är en kommentar mitt i körningen. Stegberättande (`Both pass. Let me do a final review:`) avvisas också som PR-titel eller commit-ämne. Om körningen inte producerar någon användbar ändringssammanfattning faller pull requesten tillbaka på att lista de ändrade filerna i stället för att publicera kommentarer.

## Som ett agentverktyg

Noden OpenCode Go kan kopplas till en **AI Agent**-nods verktygshandtag så att agenten kan delegera kodningsuppgifter. Konfigurera autentiseringsuppgiften, GitHub-autentiseringsuppgiften och repositoryt på noden, markera sedan **Task Prompt** (och valfritt **Repository URL**) med reglaget för agent-tillhandahållna värden så att agenten tillhandahåller dem vid anropstillfället.

## Exempel

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

## Relaterat

- [Codex-nod](./codex-node.md)
- [GitHub-nod](./github-node.md)
- [Agent-nod](./agent-node.md)
- [Autentiseringsuppgifter](../reference/credentials.md)
- [Delning av autentiseringsuppgifter](../reference/credentials-sharing.md)
- [Nodtyper](../reference/node-types.md)
