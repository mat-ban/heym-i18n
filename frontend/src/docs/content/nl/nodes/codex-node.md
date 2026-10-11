# Codex-node

De **Codex**-node voert de OpenAI Codex CLI uit in een geïsoleerde Heym-werkruimte tegen een GitHub-repository. De node is ontworpen voor coderingstaken zoals het repareren van tests, het bewerken van bestanden, het produceren van een patch of het openen van een concept-pull-request.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1, plus `question` |
| Referentie | Codex access token + GitHub |
| Uitvoer | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Authenticatie

De **OpenAI Codex**-referentie ondersteunt twee authenticatiemodi:

| Modus | Beschrijving |
|------|-------------|
| **Aanmelden met ChatGPT** (aanbevolen) | OAuth (PKCE)-aanmelding die gebruikmaakt van uw ChatGPT Plus/Pro-abonnement, zodat uitvoeringen **geen** kosten per token via de API met zich meebrengen. Klik op **Aanmelden met ChatGPT** in het referentiedialoogvenster, autoriseer in uw browser en plak vervolgens de `localhost:1455`-redirect-URL terug in Heym. Heym slaat het resulterende token-bundel op en vernieuwt dit automatisch wanneer het verloopt. |
| **Access token** | Plak een ChatGPT/Codex `access_token` die alleen door de lokale Codex-runner wordt gebruikt. |

API-sleutels worden niet geaccepteerd voor de Codex-referentie. De node dient geen cloud-Codex-taken in; de node kloont de repository binnen de Heym-runtime, schrijft het ChatGPT-token-bundel naar een geïsoleerd `auth.json` (of geeft `CODEX_ACCESS_TOKEN` door) uitsluitend aan het Codex-proces, en houdt het token buiten `$credentials`.

De node vereist tevens een **GitHub**-referentie voor het klonen van privérepositories, het pushen van de werkbranch en het aanmaken van concept-pull-requests.

In Docker-implementaties voert Heym Codex uit in een zustercontainer vanuit dezelfde Heym-image (geen aparte GHCR-image). Die container koppelt alleen het Codex-werkruimtevolume en laat Codex' eigen bubblewrap-sandbox namespaces en een verse `/proc` aanmaken. De runner voegt `SYS_ADMIN`, unconfined seccomp en AppArmor, en `systempaths=unconfined` toe (Docker Engine 25+). Zonder de laatste flag mislukt elk commando vóór de start met `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

OpenAI-referenties:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Velden

| Veld | Beschrijving |
|-------|-------------|
| Codex Credential | OpenAI Codex-referentie (ChatGPT-aanmelding of `access_token`) |
| GitHub Credential | GitHub PAT-referentie voor toegang tot de repository |
| Repository URL | HTTPS-URL van de GitHub-repository |
| Base Branch | Branch om te klonen voordat Codex wordt uitgevoerd, standaard `main` |
| Model | Optioneel Codex-model (bewerkbare dropdown, bijv. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); leeg gebruikt de standaardwaarde van Codex |
| Reasoning Effort | Codex-redeneerdiepte: `low`, `medium`, `high`, `xhigh` (Extra High), `max`, of `ultra` (standaard `medium`) |
| Task Prompt | Coderingstaak voor Codex; ondersteunt expressies zoals `$input.text` |
| Publish Mode | Hoe wijzigingen worden geleverd (zie onderstaande tabel) |
| Branch Name | Werkbranch voor PR/commit-modi, standaard `codex/$executionId` |
| Timeout | Maximale uitvoeringstijd van Codex in seconden |

## Publish-modi

| Modus | Wat het doet |
|------|--------------|
| `diff_only` | Bewerkt bestanden lokaal en retourneert de patch en gewijzigde bestanden. Er wordt niets gepusht. |
| `draft_pr` | Commit naar de branch, pusht deze en opent een concept-pull-request. |
| `open_pr` | Commit naar de branch, pusht deze en opent een review-gereed (niet-concept) pull-request. |
| `commit_push` | Commit naar de branch en pusht deze, zonder een pull-request te openen. |
| `direct_commit` | Commit en pusht rechtstreeks naar de base branch (geen aparte branch of PR). |
| `open_or_update_pr` | Werkt de bestaande open PR van de agent bij wanneer deze bestaat — zelfs als de branchnaam afwijkt, vindt de runner deze op basis van auteur + base — anders opent de runner een nieuwe. Het meest geschikt voor heruitvoeringen en instructies zoals "werk de open PR bij". |
| `update_existing_pr` | Voegt een commit toe aan de bestaande branch/PR; opent er een als er nog geen bestaat. |
| `patch_artifact` | Slaat de diff op als een downloadbaar bestand en retourneert `patchUrl`. Er wordt niets gepusht. |

## Uitvoer

| Sleutel | Beschrijving |
|-----|-------------|
| `status` | `completed` of `needs_input` |
| `summary` | Samenvatting van Codex |
| `validation` | Validatienotities, tests of controles gerapporteerd door Codex |
| `diff` | Git-patch wanneer bestanden zijn gewijzigd |
| `changedFiles` | Paden van gewijzigde bestanden |
| `threadId` | Codex thread-/sessie-id indien beschikbaar |
| `branchName` | Naam van de werkbranch |
| `pullRequestUrl` | PR-URL in de modi `draft_pr`, `open_pr`, `open_or_update_pr` en `update_existing_pr` |
| `pushedBranch` | Branch die is gepusht in commit-/PR-modi |
| `patchUrl` | Downloadlink voor de diff in de modus `patch_artifact` |
| `usage` | Gebruiksmetadata gerapporteerd door Codex CLI indien beschikbaar |
## UI-screenshots bij pull requests

Voor UI/frontend-taken dient Codex PNG-screenshots op te slaan onder een gitignored pad zoals `frontend/.e2e-artifacts/` (niet in de broncode). Als frontend-afhankelijkheden ontbreken, mag Codex `bun install` (of npm/pnpm install) uitvoeren en een kortstondige preview/`bun run dev` starten, uitsluitend om de UI vast te leggen. Heym uploadt die afbeeldingen naar één gedeelde GitHub-**prerelease** (`codex-pr-assets`) als assets met de naam `<branch>-…`, en sluit ze vervolgens in de PR-beschrijving in **voordat de pull request wordt geopend**, zodat een nieuwe PR al direct de bijbehorende screenshots bevat (bestaande PR's worden ter plaatse bijgewerkt). Codex moet tevens een betekenisvolle `pull_request_title` instellen (nooit placeholders zoals `Done.`).

Soms beëindigt Codex een beurt midden in een taak ("…Laat me nu een screenshot maken"), waardoor de uitvoering wordt afgerond voordat de screenshot is vastgelegd. Om dit te voorkomen, vereist de runner-prompt dat screenshots **vóór** het eindresultaat worden vastgelegd. Als de uitvoering alsnog eindigt zonder publiceerbare samenvatting, of met een UI-wijziging maar zonder screenshot, voert Heym nog één Codex-pass uit in dezelfde workspace om het af te ronden. Als een UI-wijziging daarna nog steeds geen screenshot heeft, wordt een zichtbare opmerking aan de PR-body toegevoegd, zodat het ontbreken nooit onopgemerkt blijft.

## Wat naar GitHub wordt gepubliceerd

Uw **Task Prompt** is privé-invoer, geen PR-inhoud. Slechts twee zaken worden gepubliceerd: een `## Change Summary` die beschrijft wat de codewijziging doet, en een sectie `## Screenshots` wanneer screenshots zijn vastgelegd. De PR-titel wordt uitsluitend afgeleid van de change summary.

De runner-prompt vermeldt dit beleid en Heym handhaaft het ook na de uitvoering: voordat er iets wordt gecommit of als pull request wordt geopend, verwijdert het prompt-echo-secties (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) en elke alinea die letterlijk uit de task prompt is gekopieerd, uit de samenvatting, de PR-body en het commit-bericht. Stap-narratie zoals `Both pass. Let me do a final review:` wordt eveneens geweigerd als PR-titel of commit-onderwerp.

## Vervolgvragen

Als Codex ontbrekende vereisten of een productbeslissing nodig heeft, retourneert het `needs_input`. Heym pauzeert de uitvoering en stelt een `question`-output-handle beschikbaar. Verbind die handle met een notificatiebranch, bijvoorbeeld Slack of Send Email, om de reviewer de publieke vervolglink te sturen.

Wanneer de reviewer antwoordt, hervat Heym dezelfde uitvoeringssnapshot en Codex-thread vanuit de opgeslagen workspace-metadata.

## Als agent-tool

De Codex-node kan aan de tool-handle van een **AI Agent**-node worden gekoppeld, zodat de agent coderingstaken kan delegeren. Configureer de referentie, GitHub-referentie en repository op de node, en markeer vervolgens **Task Prompt** (en optioneel **Repository URL**) met de door de agent geleverde toggle, zodat de agent deze tijdens de aanroep aanlevert. Wanneer Codex als tool wordt uitgevoerd, wordt een `needs_input`-resultaat inline aan de agent geretourneerd in plaats van de workflow te pauzeren, zodat de agent het verzoek kan verfijnen en Codex opnieuw kan aanroepen.

## Voorbeeld

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

## Gerelateerd

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Referenties](../reference/credentials.md)
- [Referenties delen](../reference/credentials-sharing.md)
- [Node-typen](../reference/node-types.md)
