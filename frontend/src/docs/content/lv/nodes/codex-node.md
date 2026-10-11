# Codex mezgls

**Codex** mezgls palaiž OpenAI Codex CLI izolētā Heym darbvietā pret GitHub repozitoriju. Tas ir paredzēts kodēšanas uzdevumiem, piemēram, testu labošanai, failu rediģēšanai, ielāpa izveidei vai melnraksta pull request atvēršanai.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1, plus `question` |
| Akreditācijas dati | Codex access token + GitHub |
| Izvade | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentifikācija

**OpenAI Codex** akreditācijas dati atbalsta divus autentifikācijas režīmus:

| Režīms | Apraksts |
|------|-------------|
| **Sign in with ChatGPT** (ieteicams) | OAuth (PKCE) pierakstīšanās, kas izmanto Jūsu ChatGPT Plus/Pro abonementu, tāpēc izpildes **neizraisa** izmaksas par katru token. Akreditācijas datu dialogā noklikšķiniet uz **Sign in with ChatGPT**, autorizējieties pārlūkā un pēc tam ielīmējiet `localhost:1455` novirzīšanas URL atpakaļ Heym. Heym saglabā iegūto token kopumu un automātiski to atjauno, kad tas beidzas. |
| **Access token** | Ielīmējiet ChatGPT/Codex `access_token`, ko izmanto tikai lokālais Codex izpildītājs. |

Codex akreditācijas datiem API atslēgas netiek pieņemtas. Mezgls neiesniedz mākoņa Codex uzdevumus; tas klonē repozitoriju Heym izpildlaika vidē, ieraksta ChatGPT token kopumu izolētā `auth.json` (vai nodod `CODEX_ACCESS_TOKEN`) tikai Codex procesam un nepieļauj token iekļūšanu `$credentials`.

Mezglam ir nepieciešami arī **GitHub** akreditācijas dati, lai klonētu privātus repozitorijus, nosūtītu darba zaru un izveidotu melnraksta pull request.

Docker izvietojumos Heym palaiž Codex blakus esošā konteinerā no tā paša Heym attēla (nevis atsevišķa GHCR attēla). Šis konteiners montē tikai Codex darbvietas sējumu un ļauj Codex paša bubblewrap smilškastei izveidot nosaukumtelpas un svaigu `/proc`. Izpildītājs pievieno `SYS_ADMIN`, neierobežotu seccomp un AppArmor, kā arī `systempaths=unconfined` (Docker Engine 25+). Bez pēdējā karodziņa katra komanda neizdodas pirms palaišanas ar `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

OpenAI atsauces:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Lauki

| Lauks | Apraksts |
|-------|-------------|
| Codex Credential | OpenAI Codex akreditācijas dati (ChatGPT pierakstīšanās vai `access_token`) |
| GitHub Credential | GitHub PAT akreditācijas dati, ko izmanto repozitorija piekļuvei |
| Repository URL | HTTPS GitHub repozitorija URL |
| Base Branch | Zarš, kas jāklonē pirms Codex palaišanas, pēc noklusējuma `main` |
| Model | Neobligāts Codex modelis (rediģējams nolaižamais saraksts, piem., `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); tukšs izmanto Codex noklusējumu |
| Reasoning Effort | Codex spriešanas dziļums: `low`, `medium`, `high`, `xhigh` (Extra High), `max` vai `ultra` (pēc noklusējuma `medium`) |
| Task Prompt | Kodēšanas uzdevums Codex; atbalsta izteiksmes, piemēram, `$input.text` |
| Publish Mode | Kā tiek piegādātas izmaiņas (skatiet tabulu zemāk) |
| Branch Name | Darba zars PR/commit režīmiem, pēc noklusējuma `codex/$executionId` |
| Timeout | Maksimālais Codex izpildes laiks sekundēs |

## Publicēšanas režīmi

| Režīms | Ko tas dara |
|------|--------------|
| `diff_only` | Rediģē failus lokāli un atgriež ielāpu un mainītos failus. Nekas netiek nosūtīts. |
| `draft_pr` | Veic commit uz zaru, nosūta to un atver melnraksta pull request. |
| `open_pr` | Veic commit uz zaru, nosūta to un atver pārskatīšanai gatavu (ne-melnraksta) pull request. |
| `commit_push` | Veic commit uz zaru un nosūta to, neatverot pull request. |
| `direct_commit` | Veic commit un nosūta tieši uz bāzes zaru (bez atsevišķa zara vai PR). |
| `open_or_update_pr` | Atjaunina aģenta esošo atvērto PR, ja tāds pastāv — pat ja zara nosaukums atšķiras, izpildītājs to atrod pēc autora + bāzes — pretējā gadījumā atver jaunu. Vislabāk piemērots atkārtotām izpildēm un instrukcijām "atjaunināt atvērto PR". |
| `update_existing_pr` | Pievieno commit esošajam zaram/PR; atver jaunu, ja tāda vēl nav. |
| `patch_artifact` | Saglabā diff kā lejupielādējamu failu un atgriež `patchUrl`. Nekas netiek nosūtīts. |

## Izvades

| Atslēga | Apraksts |
|-----|-------------|
| `status` | `completed` vai `needs_input` |
| `summary` | Codex kopsavilkums |
| `validation` | Validācijas piezīmes, testi vai pārbaudes, ko ziņo Codex |
| `diff` | Git ielāps, kad faili ir mainīti |
| `changedFiles` | Mainīto failu ceļi |
| `threadId` | Codex pavediena/sesijas id, ja pieejams |
| `branchName` | Darba zara nosaukums |
| `pullRequestUrl` | PR URL režīmos `draft_pr`, `open_pr`, `open_or_update_pr` un `update_existing_pr` |
| `pushedBranch` | Zars, kas tika nosūtīts commit/PR režīmos |
| `patchUrl` | Lejupielādes saite diff failam režīmā `patch_artifact` |
| `usage` | Codex CLI ziņotā lietojuma metadati, ja pieejami |
## UI ekrānuzņēmumi pull request

UI/frontend uzdevumiem Codex ir jāsaglabā PNG ekrānuzņēmumi git ignorētā ceļā, piemēram, `frontend/.e2e-artifacts/` (nevis avota kodā). Ja frontend atkarības nav pieejamas, Codex drīkst palaist `bun install` (vai npm/pnpm install) un uzsākt īslaicīgu priekšskatījumu/`bun run dev` tikai ar mērķi uzņemt UI ekrānuzņēmumus. Heym augšupielādē šos attēlus vienā koplietotā GitHub **prerelease** (`codex-pr-assets`) kā resursus ar nosaukumiem `<branch>-…`, pēc tam iegulst tos PR aprakstā **pirms pull request atvēršanas**, tāpēc jauns PR tiek izveidots jau ar tajā iekļautiem ekrānuzņēmumiem (esošie PR tiek atjaunināti uz vietas). Codex arī jāiestata jēgpilns `pull_request_title` (nekad vietturis, piemēram, `Done.`).

Codex dažkārt pabeidz gājienu uzdevuma vidū ("…Now let me take a screenshot"), kas pabeigtu izpildi pirms ekrānuzņēmuma uzņemšanas. Lai to novērstu, runner prompt prasa uzņemt ekrānuzņēmumus **pirms** gala rezultāta, un, ja izpilde tomēr beidzas bez publicējama kopsavilkuma vai ar UI izmaiņām bez ekrānuzņēmuma, Heym palaiž vēl vienu Codex gājienu tajā pašā darbvietā, lai pabeigtu. Ja UI izmaiņām joprojām nav ekrānuzņēmuma, PR pamattekstā tiek pievienota redzama piezīme, lai šī nepilnība nekad nepaliktu nepamanīta.

## Kas tiek publicēts GitHub

Jūsu **Task Prompt** ir privāta ievade, nevis PR saturs. Tiek publicētas tikai divas lietas: `## Change Summary`, kas apraksta, ko veic koda izmaiņas, un `## Screenshots` sadaļa, ja ekrānuzņēmumi tika uzņemti. PR virsraksts tiek atvasināts tikai no izmaiņu kopsavilkuma.

Runner prompt nosaka šo politiku, un Heym to arī ievieš pēc izpildes: pirms jebkas tiek commitēts vai atvērts kā pull request, tas izņem prompt atbalss sadaļas (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) un jebkuru rindkopu, kas burtiski nokopēta no uzdevuma prompt, no kopsavilkuma, PR pamatteksta un commit ziņojuma. Soļu naratīvs, piemēram, `Both pass. Let me do a final review:`, arī tiek noraidīts kā PR virsraksts vai commit temats.

## Papildu jautājumi

Ja Codex nepieciešamas trūkstošas prasības vai produkta lēmums, tas atgriež `needs_input`. Heym aptur izpildi un atklāj `question` izvades rokturi. Savienojiet šo rokturi ar paziņojumu zaru, piemēram, Slack vai Send Email, lai nosūtītu recenzentam publisko papildu jautājumu saiti.

Kad recenzents atbild, Heym atsāk to pašu izpildes momentuzņēmumu un Codex pavedienu no saglabātās darbvietas metadatiem.

## Kā aģenta rīks

Codex mezglu var pievienot **AI Agent** mezgla rīku rokturim, lai aģents varētu deleģēt kodēšanas uzdevumus. Konfigurējiet akreditācijas datus, GitHub akreditācijas datus un repozitoriju mezglā, pēc tam atzīmējiet **Task Prompt** (un pēc izvēles **Repository URL**) ar aģenta nodrošināto slēdzi, lai aģents tos nodrošinātu izsaukuma laikā. Kad Codex darbojas kā rīks, `needs_input` rezultāts tiek atgriezts tieši aģentam, nevis aptur workflow, tāpēc aģents var precizēt pieprasījumu un izsaukt Codex vēlreiz.

## Piemērs

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

## Saistītais

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Akreditācijas dati](../reference/credentials.md)
- [Akreditācijas datu koplietošana](../reference/credentials-sharing.md)
- [Mezglu tipi](../reference/node-types.md)
