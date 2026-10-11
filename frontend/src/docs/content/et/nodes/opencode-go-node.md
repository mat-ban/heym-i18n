# OpenCode Go sõlm

**OpenCode Go** sõlm käivitab [OpenCode](https://opencode.ai) CLI (Go) isoleeritud, karastatud Heymi konteineris GitHubi hoidla vastu. Nagu Codex sõlm, on see mõeldud kodeerimisülesannete jaoks, nagu testide parandamine, failide muutmine, patch'i loomine või pull request'i avamine — kuid see kasutab teenusepakkujast sõltumatut **OpenCode Go** mudelilüüsi OpenAI Codexi asemel.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Mandaat | OpenCode Go API võti + GitHub |
| Väljund | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentimine

**OpenCode Go** mandaat salvestab OpenCode Go lüüsi **API võtme** (aadressilt [opencode.ai/go](https://opencode.ai/go)) ja valikulise **Gateway Base URL**-i (vaikeväärtus `https://opencode.ai/zen/go/v1`; muutke ainult isemajutatud või puhverserveri kaudu käitatava lüüsi puhul).

Sõlm nõuab ka **GitHub** mandaati privaatsete hoidlate kloonimiseks, tööharu push'imiseks ja pull request'ide loomiseks. GitHubi token **ei asetata kunagi liivakasti konteinerisse** — Heym teostab kõik git- ja GitHubi-toimingud hostis, seega genereeritud kood ei saa push'imise mandaate välja viia.

## Isolatsioon ja turvalisus

Täitmise isolatsiooni valib `HEYM_OPENCODE_CLI_COMMAND`, täpselt nagu Codex sõlme puhul:

- **Kohalik arendus (`run.sh`)** jätab selle vaikeväärtusele `opencode`, seega OpenCode töötab hosti alamprotsessina kloonitud tööruumi vastu — Dockerit pole vaja, lisalippe pole vaja.
- **Dockeri juurutus (`deploy.sh` ja üksik GHCR image)** määrab selle väärtusele `/usr/local/bin/heym-opencode-docker`, mis on wrapper, mis käivitab `opencode run` **karastatud, ühekordses sõsarkonteineris**, mis jagab OpenCode'i tööruumi nimega volume'it.

Karastatud runner-konteiner eemaldab kõik Linuxi võimekused, seab `no-new-privileges`, kasutab kirjutuskaitstud juurt koos tmpfs-iga `/tmp` ja rakendab pid/mälu/CPU piiranguid. Võrgu väljuv liiklus on lubatud (OpenCode peab mudelilüüsini jõudma). **GitHubi token ei asetata kunagi konteineri sisse** — kõik git- ja GitHubi-toimingud töötavad hosti poolel, seega konteineri sees on alati ainult OpenCode API võti ja hoidla failid.

OpenCode muudab ainult faile kettal; Heym omab iga git/GitHubi toimingut.

## Mudelid

OpenCode Go mudelite nimekiri muutub sageli, seega **Model** väli täidetakse reaalajas lüüsi mudelite loendist (`GET https://opencode.ai/zen/go/v1/models`) ja kuvatakse otsitava rippmenüüna. Kui reaalajas loend pole saadaval, kasutatakse sisseehitatud varuloendit. Mudeli id-d kasutavad vormi `opencode-go/<model>` (näiteks `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` on OpenCode CLI teenusepakkuja id Go lüüsi jaoks. Jätke väli tühjaks, et kasutada runneri vaikeväärtust (`opencode-go/kimi-k3`). Vanemas vormis `opencode/<model>` salvestatud mudeli id-d kirjutatakse käivitamise ajal automaatselt ümber.

## Väljad

| Väli | Kirjeldus |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go mandaat (lüüsi API võti) |
| GitHub Credential | GitHub PAT mandaat, mida kasutatakse hoidla juurdepääsuks |
| Repository URL | HTTPS GitHubi hoidla URL; toetab avaldisi |
| Base Branch | Haru, mis kloonitakse enne OpenCode'i käivitamist, vaikeväärtus `main` |
| Model | OpenCode Go mudel (reaalajas otsitav rippmenüü, `opencode-go/<model>`); tühi kasutab runneri vaikeväärtust |
| Reasoning Variant | Valikuline; vastendub `opencode run --variant`-iga mudelitele, mis toetavad reasoning effort'it |
| Task Prompt | Kodeerimisülesanne OpenCode'ile; toetab avaldisi nagu `$input.text` |
| Publish Mode | Kuidas muudatused edastatakse (vt tabelit allpool) |
| Branch Name | Tööharu PR/commit režiimide jaoks, vaikeväärtus `opencode/$executionId` |
| Timeout | OpenCode'i maksimaalne täitmisaeg sekundites |

## Avaldamisrežiimid

| Režiim | Mida see teeb |
|------|--------------|
| `diff_only` | Muudab faile kohapeal ja tagastab patch'i ning muudetud failid. Midagi ei push'ita. |
| `draft_pr` | Commit'ib harule, push'ib selle ja avab draft pull request'i. |
| `open_pr` | Commit'ib harule, push'ib selle ja avab ülevaatamiseks valmis (mitte-draft) pull request'i. |
| `commit_push` | Commit'ib harule ja push'ib selle, ilma pull request'i avamata. |
| `direct_commit` | Commit'ib ja push'ib otse baasharule (eraldi haru ega PR puudub). |
| `open_or_update_pr` | Uuendab agendi olemasolevat avatud PR-i, kui see olemas on — isegi kui haru nimi erineb, leiab runner selle autori + baasharu järgi — vastasel juhul avab uue. Parim korduskäivituste ja "uuenda avatud PR-i" juhiste jaoks. |
| `update_existing_pr` | Lisab commit'i olemasolevale harule/PR-ile; avab ühe, kui ühtegi veel pole. |
| `patch_artifact` | Salvestab diff'i allalaaditava failina ja tagastab `patchUrl`. Midagi ei push'ita. |

## Väljundid

| Võti | Kirjeldus |
|-----|-------------|
| `status` | Alati `completed` (OpenCode Go sõlm ei peatu sisendi ootamiseks) |
| `summary` | OpenCode'i lõplik sõnum |
| `validation` | Valideerimise märkused, kui need on esitatud |
| `diff` | Git patch, kui failid muutusid |
| `changedFiles` | Muudetud failide teed |
| `branchName` | Tööharu nimi |
| `pullRequestUrl` | PR URL režiimides `draft_pr`, `open_pr`, `open_or_update_pr` ja `update_existing_pr` |
| `pushedBranch` | Haru, mis push'iti commit/PR režiimides |
| `patchUrl` | Allalaadimislink diff'ile režiimis `patch_artifact` |
## UI kuvatõmmised pull request'idel

UI/frontend ülesannete puhul peaks OpenCode salvestama PNG kuvatõmmised gitignore'itud asukohta nagu `frontend/.e2e-artifacts/` (mitte lähtekoodi). Kui frontendi sõltuvused puuduvad, lubab runner prompt sihitud paketi paigaldust (näiteks `bun install`) ning lühiajalist eelvaadet/`bun run dev` ainult UI jäädvustamiseks. Heym laadib need pildid üles ühte jagatud GitHubi **prerelease**'i (`opencode-pr-assets`) asset'idena nimega `<branch>-…` ning seejärel manustab need PR kirjeldusse **enne pull request'i avamist**, nii et uus PR luuakse juba oma kuvatõmmistega (olemasolevaid PR-e uuendatakse kohapeal).

OpenCode'i juhitakse ka lõpetama `PR_TITLE: …` reaga, et Heym saaks pull request'i avada sisuka pealkirjaga, mitte kohatäitjatega nagu `Done.`

OpenCode lõpetab mõnikord käigu keset ülesannet ("…Now let me take a screenshot"), mis lõpetaks käivituse enne kuvatõmmise jäädvustamist. Selle vältimiseks nõuab runner prompt kuvatõmmiste jäädvustamist **enne** lõplikku sõnumit, ja kui käivitus siiski lõpeb ilma avaldatava kokkuvõtteta või UI muudatusega ilma kuvatõmmiseta, käivitab Heym samas tööruumis veel ühe OpenCode'i käigu lõpetamiseks. Kui UI muudatusel pole ka pärast seda kuvatõmmist, lisatakse PR sisusse nähtav märkus, et lünk ei jääks kunagi märkamatuks.

## Mis avaldatakse GitHubi

Teie **Task Prompt** on privaatne sisend, mitte PR-i sisu. Avaldatakse ainult kaks asja: `## Change Summary`, mis kirjeldab, mida koodimuudatus teeb, ja `## Screenshots` sektsioon, kui kuvatõmmised jäädvustati. PR-i pealkiri tuletatakse üksnes muudatuse kokkuvõttest.

Runner prompt sätestab selle poliitika ja Heym rakendab seda ka pärast käivitust: enne millegi commit'imist või pull request'ina avamist eemaldab see kokkuvõttest, PR-i sisust ja commit-sõnumist prompti kaja sektsioonid (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) ning iga lõigu, mis on ülesande promptist sõna-sõnalt kopeeritud.

Heym loeb `## Change Summary` sektsiooni agendi sõnumitest, mitte ei võta seda, mida viimati öeldi, sest OpenCode väljastab iga sammu kohta sõnumi ja viimane on sageli käigu keskne kommentaar. Sammude jutustamine (`Both pass. Let me do a final review:`) lükatakse samuti tagasi PR-i pealkirja või commit'i teemana. Kui käivitus ei anna kasutatavat muudatuse kokkuvõtet, loetleb pull request selle asemel muudetud failid, mitte ei avalda kommentaare.

## Agendi tööriistana

OpenCode Go node'i saab kinnitada **AI Agent** node'i tööriista käepideme külge, et agent saaks kodeerimisülesandeid delegeerida. Konfigureerige node'il mandaat, GitHubi mandaat ja hoidla, seejärel märkige **Task Prompt** (ja valikuliselt **Repository URL**) agendi poolt pakutava lülitiga, et agent annaks need väljakutsumise ajal.

## Näide

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

## Seotud

- [Codex Node](./codex-node.md)
- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Mandaadid](../reference/credentials.md)
- [Mandaatide jagamine](../reference/credentials-sharing.md)
- [Node'i tüübid](../reference/node-types.md)
