# OpenCode Go-node

De **OpenCode Go**-node voert de [OpenCode](https://opencode.ai) CLI (Go) uit in een geïsoleerde, gehardende Heym-container tegen een GitHub-repository. Net als de Codex-node is deze ontworpen voor coderingstaken zoals het repareren van tests, het bewerken van bestanden, het produceren van een patch of het openen van een pull request — maar gebruikt deze de provider-agnostische **OpenCode Go**-modelgateway in plaats van OpenAI Codex.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | OpenCode Go API-key + GitHub |
| Uitvoer | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Authenticatie

De **OpenCode Go**-referentie slaat een OpenCode Go-gateway **API-key** op (van [opencode.ai/go](https://opencode.ai/go)) en een optionele **Gateway Base URL** (standaard `https://opencode.ai/zen/go/v1`; overschrijf alleen voor een zelf-gehoste of via proxy geleide gateway).

De node vereist tevens een **GitHub**-referentie voor het klonen van privérepositories, het pushen van de werkbranch en het aanmaken van pull requests. Het GitHub-token wordt **nooit in de sandbox-container geplaatst** — Heym voert alle git- en GitHub-operaties uit op de host, zodat gegenereerde code geen push-referenties kan exfiltreren.

## Isolatie en beveiliging

De uitvoeringsisolatie wordt gekozen via `HEYM_OPENCODE_CLI_COMMAND`, precies zoals bij de Codex-node:

- **Lokale ontwikkeling (`run.sh`)** laat deze op de standaardwaarde `opencode`, zodat OpenCode als host-subproces draait tegen de gekloonde werkruimte — geen Docker vereist, geen extra flags.
- **Docker-implementaties (`deploy.sh` en de enkele GHCR-image)** stellen deze in op `/usr/local/bin/heym-opencode-docker`, een wrapper die `opencode run` uitvoert in een **gehardende, wegwerpbare zustercontainer** die het OpenCode-werkruimtevolume met een naam deelt.

De gehardende runner-container verwijdert alle Linux-capabilities, stelt `no-new-privileges` in, gebruikt een alleen-lezen root met een tmpfs `/tmp`, en past pid-/geheugen-/CPU-limieten toe. Netwerk-egress is toegestaan (OpenCode moet de modelgateway kunnen bereiken). Het **GitHub-token wordt nooit in de container geplaatst** — alle git- en GitHub-operaties draaien aan de hostzijde, zodat alleen de OpenCode API-key en repositorybestanden zich ooit binnenin bevinden.

OpenCode bewerkt alleen bestanden op schijf; Heym is eigenaar van elke git-/GitHub-actie.

## Modellen

Het modellenassortiment van OpenCode Go verandert vaak, dus het veld **Model** wordt live gevuld vanuit de modellenlijst van de gateway (`GET https://opencode.ai/zen/go/v1/models`) en weergegeven als een doorzoekbare dropdown. Als de live lijst niet beschikbaar is, wordt een ingebouwde fallback-lijst gebruikt. Model-id's gebruiken de vorm `opencode-go/<model>` (bijvoorbeeld `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` is de provider-id van de OpenCode CLI voor de Go-gateway. Laat het veld leeg om de runner-standaard te gebruiken (`opencode-go/kimi-k3`). Model-id's die zijn opgeslagen in de oudere vorm `opencode/<model>` worden tijdens de uitvoering automatisch herschreven.

## Velden

| Veld | Beschrijving |
|-------|-------------|
| OpenCode Go-referentie | OpenCode Go-referentie (gateway API-key) |
| GitHub-referentie | GitHub PAT-referentie gebruikt voor repositorytoegang |
| Repository-URL | HTTPS GitHub-repository-URL; ondersteunt expressies |
| Base Branch | Branch om te klonen voordat OpenCode draait, standaard `main` |
| Model | OpenCode Go-model (live doorzoekbare dropdown, `opencode-go/<model>`); leeg gebruikt de runner-standaard |
| Reasoning-variant | Optioneel; verwijst naar `opencode run --variant` voor modellen die reasoning-inspanning ondersteunen |
| Taakprompt | Coderingstaak voor OpenCode; ondersteunt expressies zoals `$input.text` |
| Publicatiemodus | Hoe wijzigingen worden geleverd (zie onderstaande tabel) |
| Branchnaam | Werkbranch voor PR-/commit-modi, standaard `opencode/$executionId` |
| Time-out | Maximale OpenCode-uitvoeringstijd in seconden |

## Publicatiemodi

| Modus | Wat het doet |
|------|--------------|
| `diff_only` | Bewerkt bestanden lokaal en retourneert de patch en gewijzigde bestanden. Er wordt niets gepusht. |
| `draft_pr` | Commit naar de branch, pusht deze en opent een concept-pull request. |
| `open_pr` | Commit naar de branch, pusht deze en opent een review-gereed (niet-concept) pull request. |
| `commit_push` | Commit naar de branch en pusht deze, zonder een pull request te openen. |
| `direct_commit` | Commit en pusht rechtstreeks naar de base branch (geen aparte branch of PR). |
| `open_or_update_pr` | Werkt de bestaande open PR van de agent bij wanneer deze bestaat — zelfs als de branchnaam afwijkt, vindt de runner deze op auteur + base — anders opent deze een nieuwe. Het beste voor heruitvoeringen en "update de open PR"-instructies. |
| `update_existing_pr` | Voegt een commit toe aan de bestaande branch/PR; opent er een als er nog geen bestaat. |
| `patch_artifact` | Slaat de diff op als een downloadbaar bestand en retourneert `patchUrl`. Er wordt niets gepusht. |

## Uitvoer

| Sleutel | Beschrijving |
|-----|-------------|
| `status` | Altijd `completed` (de OpenCode Go-node pauzeert niet voor invoer) |
| `summary` | Het eindbericht van OpenCode |
| `validation` | Validatienotities wanneer gerapporteerd |
| `diff` | Git-patch wanneer bestanden zijn gewijzigd |
| `changedFiles` | Paden van gewijzigde bestanden |
| `branchName` | Naam van de werkbranch |
| `pullRequestUrl` | PR-URL in de modi `draft_pr`, `open_pr`, `open_or_update_pr` en `update_existing_pr` |
| `pushedBranch` | Branch die is gepusht in commit-/PR-modi |
| `patchUrl` | Downloadlink voor de diff in de modus `patch_artifact` |
## UI-screenshots bij pull requests

Voor UI/frontend-taken dient OpenCode PNG-screenshots op te slaan onder een gitignored pad zoals `frontend/.e2e-artifacts/` (niet in de broncode). Als frontend-afhankelijkheden ontbreken, staat de runner-prompt een gerichte package-installatie toe (bijvoorbeeld `bun install`) plus een kortstondige preview/`bun run dev`, uitsluitend om de UI vast te leggen. Heym uploadt die afbeeldingen naar één gedeelde GitHub-**prerelease** (`opencode-pr-assets`) als assets met de naam `<branch>-…`, en sluit ze vervolgens in de PR-beschrijving in **voordat de pull request wordt geopend**, zodat een nieuwe PR direct met de bijbehorende screenshots wordt aangemaakt (bestaande PR's worden ter plaatse bijgewerkt).

OpenCode krijgt tevens de instructie om af te sluiten met een regel `PR_TITLE: …`, zodat Heym de pull request kan openen met een betekenisvol onderwerp in plaats van placeholders zoals `Done.`

OpenCode beëindigt een beurt soms midden in een taak ("…Now let me take a screenshot"), waardoor de uitvoering zou worden afgerond voordat de screenshot is vastgelegd. Om dit te voorkomen, vereist de runner-prompt dat screenshots **vóór** het definitieve bericht worden vastgelegd. Als de uitvoering desondanks eindigt zonder publiceerbare samenvatting, of met een UI-wijziging maar zonder screenshot, voert Heym nog één OpenCode-pass uit in dezelfde workspace om af te ronden. Als een UI-wijziging daarna nog steeds geen screenshot heeft, wordt een zichtbare opmerking aan de PR-body toegevoegd, zodat het ontbreken nooit onopgemerkt blijft.

## Wat naar GitHub wordt gepubliceerd

Uw **Task Prompt** is privé-invoer, geen PR-inhoud. Slechts twee zaken worden gepubliceerd: een `## Change Summary` die beschrijft wat de codewijziging doet, en een sectie `## Screenshots` wanneer er screenshots zijn vastgelegd. De PR-titel wordt uitsluitend afgeleid van de change summary.

De runner-prompt vermeldt dit beleid, en Heym handhaaft het ook na de uitvoering: voordat er iets wordt gecommit of als pull request wordt geopend, verwijdert het prompt-echo-secties (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) en elke alinea die letterlijk uit de task prompt is gekopieerd, uit de summary, de PR-body en het commit-bericht.

Heym leest de sectie `## Change Summary` uit de berichten van de agent, in plaats van te nemen wat deze als laatste zei, omdat OpenCode per stap een bericht uitstuurt en het laatste vaak commentaar midden in de uitvoering is. Stap-narratie (`Both pass. Let me do a final review:`) wordt eveneens afgewezen als PR-titel of commit-onderwerp. Als de uitvoering geen bruikbare change summary oplevert, valt de pull request terug op het opsommen van de gewijzigde bestanden in plaats van het publiceren van commentaar.

## Als agent-tool

De OpenCode Go-node kan aan de tool-handle van een **AI Agent**-node worden gekoppeld, zodat de agent coderingstaken kan delegeren. Configureer de referentie, de GitHub-referentie en de repository op de node, en markeer vervolgens **Task Prompt** (en optioneel **Repository URL**) met de door de agent verstrekte toggle, zodat de agent deze tijdens de aanroep aanlevert.

## Voorbeeld

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

## Gerelateerd

- [Codex Node](./codex-node.md)
- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Referenties](../reference/credentials.md)
- [Referenties delen](../reference/credentials-sharing.md)
- [Node-typen](../reference/node-types.md)
