# OpenCode Go mezgls

**OpenCode Go** mezgls palaiž [OpenCode](https://opencode.ai) CLI (Go) izolētā, drošinātā Heym konteinerā pret GitHub repozitoriju. Tāpat kā Codex mezgls, tas ir paredzēts kodēšanas uzdevumiem, piemēram, testu labošanai, failu rediģēšanai, ielāpa izveidei vai pull request atvēršanai — taču tā vietā, lai izmantotu OpenAI Codex, tas izmanto no piegādātāja neatkarīgo **OpenCode Go** modeļu vārteju.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | OpenCode Go API atslēga + GitHub |
| Izvade | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentifikācija

**OpenCode Go** akreditācijas dati glabā OpenCode Go vārtejas **API atslēgu** (no [opencode.ai/go](https://opencode.ai/go)) un neobligātu **Gateway Base URL** (pēc noklusējuma `https://opencode.ai/zen/go/v1`; ignorējiet tikai pašmitinātai vai starpniekservera vārtejai).

Mezglam ir nepieciešami arī **GitHub** akreditācijas dati, lai klonētu privātus repozitorijus, nosūtītu darba zaru un izveidotu pull request. GitHub token nekad **netiek ievietots smilškastes konteinerā** — Heym veic visas git un GitHub darbības resursdatorā, tāpēc ģenerētais kods nevar noplūdināt push akreditācijas datus.

## Izolācija un drošība

Izpildes izolāciju nosaka `HEYM_OPENCODE_CLI_COMMAND`, tieši tāpat kā Codex mezglā:

- **Vietējā izstrāde (`run.sh`)** atstāj to noklusējuma vērtībā `opencode`, tāpēc OpenCode darbojas kā resursdatora apakšprocess pret klonēto darbvietu — nav nepieciešams Docker, nav papildu karodziņu.
- **Docker izvietojumi (`deploy.sh` un vienotais GHCR attēls)** iestata to uz `/usr/local/bin/heym-opencode-docker`, iesaiņotāju, kas palaiž `opencode run` **drošinātā, vienreizlietojamā blakus konteinerā**, kas koplieto OpenCode darbvietas nosaukto sējumu.

Drošinātais izpildītāja konteiners atmet visas Linux iespējas, iestata `no-new-privileges`, izmanto tikai lasāmu sakni ar tmpfs `/tmp` un piemēro pid/atmiņas/CPU ierobežojumus. Tīkla izeja ir atļauta (OpenCode ir jāsasniedz modeļu vārteja). **GitHub token nekad netiek ievietots konteinerā** — visas git un GitHub darbības tiek veiktas resursdatora pusē, tāpēc konteinerā vienmēr atrodas tikai OpenCode API atslēga un repozitorija faili.

OpenCode rediģē tikai failus diskā; Heym pārvalda katru git/GitHub darbību.

## Modeļi

OpenCode Go modeļu saraksts mainās bieži, tāpēc lauks **Model** tiek aizpildīts tiešsaistē no vārtejas modeļu saraksta (`GET https://opencode.ai/zen/go/v1/models`) un tiek parādīts kā meklējams nolaižamais saraksts. Ja tiešsaistes saraksts nav pieejams, tiek izmantots iebūvēts rezerves saraksts. Modeļu id izmanto formu `opencode-go/<model>` (piemēram, `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` ir OpenCode CLI piegādātāja id Go vārtejai. Atstājiet lauku tukšu, lai izmantotu izpildītāja noklusējumu (`opencode-go/kimi-k3`). Modeļu id, kas saglabāti vecākajā formā `opencode/<model>`, izpildes laikā tiek automātiski pārrakstīti.

## Lauki

| Lauks | Apraksts |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go akreditācijas dati (vārtejas API atslēga) |
| GitHub Credential | GitHub PAT akreditācijas dati, ko izmanto repozitorija piekļuvei |
| Repository URL | HTTPS GitHub repozitorija URL; atbalsta izteiksmes |
| Base Branch | Zarš, kas jāklonē pirms OpenCode palaišanas, pēc noklusējuma `main` |
| Model | OpenCode Go modelis (tiešsaistes meklējams nolaižamais saraksts, `opencode-go/<model>`); tukšs izmanto izpildītāja noklusējumu |
| Reasoning Variant | Neobligāts; kartē uz `opencode run --variant` modeļiem, kas atbalsta reasoning effort |
| Task Prompt | Kodēšanas uzdevums OpenCode; atbalsta izteiksmes, piemēram, `$input.text` |
| Publish Mode | Kā tiek piegādātas izmaiņas (skatiet tabulu zemāk) |
| Branch Name | Darba zars PR/commit režīmiem, pēc noklusējuma `opencode/$executionId` |
| Timeout | Maksimālais OpenCode izpildes laiks sekundēs |

## Publicēšanas režīmi

| Režīms | Ko tas dara |
|------|--------------|
| `diff_only` | Rediģē failus lokāli un atgriež ielāpu un mainītos failus. Nekas netiek nosūtīts. |
| `draft_pr` | Veic commit uz zaru, nosūta to un atver melnraksta pull request. |
| `open_pr` | Veic commit uz zaru, nosūta to un atver pārskatīšanai gatavu (ne-melnraksta) pull request. |
| `commit_push` | Veic commit uz zaru un nosūta to, neatverot pull request. |
| `direct_commit` | Veic commit un nosūta tieši uz bāzes zaru (bez atsevišķa zara vai PR). |
| `open_or_update_pr` | Atjaunina aģenta esošo atvērto PR, ja tāds pastāv — pat ja zara nosaukums atšķiras, izpildītājs to atrod pēc autora + bāzes — pretējā gadījumā atver jaunu. Vislabāk piemērots atkārtotām palaišanām un "atjaunināt atvērto PR" instrukcijām. |
| `update_existing_pr` | Pievieno commit esošajam zaram/PR; atver jaunu, ja tāda vēl nav. |
| `patch_artifact` | Saglabā diff kā lejupielādējamu failu un atgriež `patchUrl`. Nekas netiek nosūtīts. |

## Izvades

| Atslēga | Apraksts |
|-----|-------------|
| `status` | Vienmēr `completed` (OpenCode Go mezgls neaptur darbību, lai gaidītu ievadi) |
| `summary` | OpenCode galīgais ziņojums |
| `validation` | Validācijas piezīmes, ja tiek ziņots |
| `diff` | Git ielāps, ja faili tika mainīti |
| `changedFiles` | Mainīto failu ceļi |
| `branchName` | Darba zara nosaukums |
| `pullRequestUrl` | PR URL režīmos `draft_pr`, `open_pr`, `open_or_update_pr` un `update_existing_pr` |
| `pushedBranch` | Zars, kas tika nosūtīts commit/PR režīmos |
| `patchUrl` | Lejupielādes saite uz diff režīmā `patch_artifact` |
## UI ekrānuzņēmumi pull request

UI/frontend uzdevumiem OpenCode ir jāsaglabā PNG ekrānuzņēmumi gitignored ceļā, piemēram, `frontend/.e2e-artifacts/` (nevis avota kodā). Ja frontend atkarības nav pieejamas, runner prompt atļauj mērķētu pakotnes instalāciju (piemēram, `bun install`) un īslaicīgu priekšskatījumu/`bun run dev` tikai UI uzņemšanai. Heym augšupielādē šos attēlus vienā koplietotā GitHub **prerelease** (`opencode-pr-assets`) kā assetus ar nosaukumiem `<branch>-…`, pēc tam iegulst tos PR aprakstā **pirms pull request tiek atvērts**, tāpēc jauns PR tiek izveidots jau ar tajā iekļautiem ekrānuzņēmumiem (esošie PR tiek atjaunināti uz vietas).

OpenCode arī tiek instruēts pabeigt ar rindu `PR_TITLE: …`, lai Heym varētu atvērt pull request ar jēgpilnu tematu, nevis vietturiem, piemēram, `Done.`

OpenCode dažkārt pabeidz gājienu uzdevuma vidū ("…Now let me take a screenshot"), kas pabeigtu izpildi pirms ekrānuzņēmuma uzņemšanas. Lai to novērstu, runner prompt pieprasa uzņemt ekrānuzņēmumus **pirms** beigu ziņojuma, un, ja izpilde tomēr beidzas bez publicējama kopsavilkuma vai ar UI izmaiņām bez ekrānuzņēmuma, Heym palaiž vēl vienu OpenCode gājienu tajā pašā darbvietā, lai pabeigtu. Ja UI izmaiņām joprojām nav ekrānuzņēmuma pēc tam, PR pamattekstā tiek pievienota redzama piezīme, lai šī nepilnība nekad nepaliktu nepamanīta.

## Kas tiek publicēts GitHub

Jūsu **Task Prompt** ir privāta ievade, nevis PR saturs. Tiek publicētas tikai divas lietas: `## Change Summary`, kas apraksta, ko veic koda izmaiņas, un `## Screenshots` sadaļa, kad ekrānuzņēmumi tika uzņemti. PR virsraksts tiek atvasināts tikai no izmaiņu kopsavilkuma.

Runner prompt nosaka šo politiku, un Heym to arī ievieš pēc izpildes: pirms kaut kas tiek commitēts vai atvērts kā pull request, tas izņem prompt atbalss sadaļas (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) un jebkuru rindkopu, kas burtiski nokopēta no uzdevuma prompt, no kopsavilkuma, PR pamatteksta un commit ziņojuma.

Heym nolasa `## Change Summary` sadaļu no aģenta ziņojumiem, nevis ņem pēdējo teikto, jo OpenCode izvada ziņojumu katram solim un pēdējais bieži ir izpildes laika komentārs. Soļu naratīvs (`Both pass. Let me do a final review:`) arī tiek noraidīts kā PR virsraksts vai commit temats. Ja izpilde nesniedz lietojamu izmaiņu kopsavilkumu, pull request tā vietā norāda mainītos failus, nevis publicē komentārus.

## Kā aģenta rīks

OpenCode Go node var pievienot **AI Agent** node rīku rokturim, lai aģents varētu deleģēt kodēšanas uzdevumus. Konfigurējiet akreditācijas datus, GitHub akreditācijas datus un repozitoriju node, pēc tam atzīmējiet **Task Prompt** (un pēc izvēles **Repository URL**) ar aģenta nodrošināto slēdzi, lai aģents tos nodrošinātu izsaukuma laikā.

## Piemērs

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

## Saistītais

- [Codex Node](./codex-node.md)
- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Akreditācijas dati](../reference/credentials.md)
- [Akreditācijas datu koplietošana](../reference/credentials-sharing.md)
- [Node tipi](../reference/node-types.md)
