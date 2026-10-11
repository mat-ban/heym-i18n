# OpenCode Go mazgas

**OpenCode Go** mazgas vykdo [OpenCode](https://opencode.ai) CLI (Go) izoliuotame, sustiprintame Heym konteinery, dirbančiame su GitHub saugykla. Kaip ir Codex mazgas, jis skirtas programavimo užduotims, tokioms kaip testų taisymas, failų redagavimas, pataisos kūrimas ar pull request atidarymas — tačiau naudoja tiekėjui nepriklausomą **OpenCode Go** modelio vartotojo sąsają, o ne OpenAI Codex.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | OpenCode Go API raktas + GitHub |
| Išvestis | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentifikacija

**OpenCode Go** kredencialas saugo OpenCode Go vartotojo sąsajos **API raktą** (iš [opencode.ai/go](https://opencode.ai/go)) ir neprivalomą **Vartotojo sąsajos pagrindo URL** (numatytoji reikšmė `https://opencode.ai/zen/go/v1`; perrašykite tik savarankiškai talpinamam arba per proxy vartotojo sąsajos).

Mazgas taip pat reikalauja **GitHub** kredencialo, kad galėtų klonuoti privačias saugyklas, stumti darbo šaką ir kurti pull request. GitHub tokenas **niekada nėra dedamas į smėlio dėžės konteinerį** — Heym atlieka visus git ir GitHub veiksmus šeimininke, todėl sugeneruotas kodas negali ištraukti stumimo kredencialų.

## Izoliacija ir saugumas

Vykdymo izoliacija pasirenkama naudojant `HEYM_OPENCODE_CLI_COMMAND`, lygiai taip pat kaip ir Codex mazge:

- **Vietinis vystymas (`run.sh`)** palieka numatytąją reikšmę `opencode`, todėl OpenCode veikia kaip šeimininko subprocessas prieš klonuotą darbo aplinką — Docker nereikalingas, jokių papildomų vėliavų.
- **Docker diegimai (`deploy.sh` ir vienas GHCR vaizdas)** nustato ją į `/usr/local/bin/heym-opencode-docker`, apvalkalą, kuris vykdo `opencode run` viduje **sustiprinto, laikino brolio konteinerio**, dalijantis OpenCode darbo aplinkos pavadinimu.

Sustiprintas vykdytojo konteineris atmeta visas Linux galimybes, nustato `no-new-privileges`, naudoja tik skaitymo režimo šaknį su tmpfs `/tmp` ir taiko pid/memory/CPU apribojimus. Tinklo išėjimas leidžiamas (OpenCode turi pasiekti modelio vartotojo sąsają). **GitHub tokenas niekada nėra dedamas į konteinerį** — visi git ir GitHub veiksmai vykdomi šeimininko pusėje, todėl tik OpenCode API raktas ir saugyklos failai yra viduje.

OpenCode tik redaguoja failus diske; Heym valdo kiekvieną git/GitHub veiksmą.

## Modeliai

OpenCode Go modelių sąrašas dažnai keičiasi, todėl **Modelio** laukas užpildomas gyvai iš vartotojo sąsajos modelių sąrašo (`GET https://opencode.ai/zen/go/v1/models`) ir rodomas kaip paieškos išskleidžiamasis sąrašas. Jei gyvas sąrašas nėra pasiekiamas, naudojamas įmontuotas atsarginis sąrašas. Modelių id naudoja `opencode-go/<model>` formą (pavyzdžiui, `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` yra OpenCode CLI tiekėjo id Go vartotojo sąsajai. Palikite lauką tuščią, kad naudotumėte vykdytojo numatytąją reikšmę (`opencode-go/kimi-k3`). Senesnės `opencode/<model>` formos modelių id automatiškai perrašomos vykdymo metu.

## Laukai

| Laukas | Aprašymas |
|-------|-------------|
| OpenCode Go Kredencialas | OpenCode Go kredencialas (vartotojo sąsajos API raktas) |
| GitHub Kredencialas | GitHub PAT kredencialas, naudojamas saugyklos prieigai |
| Saugyklos URL | HTTPS GitHub saugyklos URL; palaiko išraiškas |
| Pagrindinė šaka | Šaka, kurią reikia klonuoti prieš OpenCode vykdymą, numatytoji `main` |
| Modelis | OpenCode Go modelis (gyvas paieškos išskleidžiamasis sąrašas, `opencode-go/<model>`); tuščias naudoja vykdytojo numatytąją reikšmę |
| Mąstymo variantas | Neprivalomas; atitinka `opencode run --variant` modeliams, kurie palaiko mąstymo pastangas |
| Uždavinio Prompt | Programavimo užduotis OpenCode; palaiko išraiškas, tokias kaip `$input.text` |
| Publikavimo režimas | Kaip pakeitimai pristatomi (žr. žemiau esančią lentelę) |
| Šakos pavadinimas | Darbo šaka PR/commit režimuose, numatytoji `opencode/$executionId` |
| Laiko limitas | Maksimalus OpenCode vykdymo laikas sekundėmis |

## Publikavimo režimai

| Režimas | Ką jis daro |
|------|--------------|
| `diff_only` | Redaguoja failus lokaliai ir grąžina pataisą bei pakeistus failus. Nieko nesistumti. |
| `draft_pr` | Įsipareigoja šakai, stumia ją ir atidaro juodraštinį pull request. |
| `open_pr` | Įsipareigoja šakai, stumia ją ir atidaro peržiūrai paruoštą (ne juodraštinį) pull request. |
| `commit_push` | Įsipareigoja šakai ir stumia ją, neatsidarant pull request. |
| `direct_commit` | Įsipareigoja ir stumia tiesiai į pagrindinę šaką (be atskiros šakos ar PR). |
| `open_or_update_pr` | Atidaro agento esamą atvirą PR, kai toks egzistuoja — net jei šakos pavadinimas skiriasi, vykdytojas jį randa pagal autorių + pagrindą — kitaip atidaro naują. Geriausia pakartotiniams vykdymams ir "atnaujinti atvirą PR" instrukcijoms. |
| `update_existing_pr` | Prideda įsipareigojimą prie esamos šakos/PR; atidaro vieną, jei dar nėra. |
| `patch_artifact` | Išsaugo pataisą kaip atsisiunčiamą failą ir grąžina `patchUrl`. Nieko nesistumti. |

## Išvestys

| Raktas | Aprašymas |
|-----|-------------|
| `status` | Visada `completed` (OpenCode Go mazgas nesustoja laukdamas įvesties) |
| `summary` | Galutinis OpenCode pranešimas |
| `validation` | Patikros pastabos, kai pranešama |
| `diff` | Git pataisa, kai failai pasikeitė |
| `changedFiles` | Pakeistų failų keliai |
| `branchName` | Darbo šakos pavadinimas |
| `pullRequestUrl` | PR URL `draft_pr`, `open_pr`, `open_or_update_pr` ir `update_existing_pr` režimuose |
| `pushedBranch` | Šaka, kuri buvo stumta commit/PR režimuose |
| `patchUrl` | Atsisiuntimo nuoroda pataisai `patch_artifact` režimuose |
## UI ekrano nuotraukos apie pull request'us

UI/frontend užduotims, OpenCode turėtų išsaugoti PNG ekrano nuotraukas gitignored kelyje, pavyzdžiui, `frontend/.e2e-artifacts/` (ne šaltinyje). Jei frontend priklausomybės trūksta, vykdytojo promptas leidžia atlikti tikslinį paketo įdiegimą (pavyzdžiui, `bun install`) ir trumpalaikį peržiūros/`bun run dev` vykdymą, skirtą tik UI užfiksavimui. Heym įkelia šias nuotraukas į vieną bendrą GitHub **prerelease** (`opencode-pr-assets`) kaip turtą, pavadintą `<branch>-…`, tada įterpia jas į PR aprašymą **prieš atidarant pull request'ą**, taigi naujas PR sukuriamas jau su savo ekrano nuotraukomis (esami PR atnaujinami vietoje).

OpenCode taip pat nurodoma baigti su `PR_TITLE: …` eilute, kad Heym galėtų atidaryti pull request'ą su prasmingu pavadinimu, o ne užpildais, tokiais kaip `Done.`

OpenCode kartais užbaigia veiksmą viduryje užduoties ("…Dabar leiskite man padaryti ekrano nuotrauką"), kas užbaigtų vykdymą prieš užfiksuojant ekrano nuotrauką. Norint to išvengti, vykdytojo promptas reikalauja užfiksuoti ekrano nuotraukas **prieš** galutinį pranešimą, o jei vykdymas vis tiek baigiasi be skelbtino santraukos arba su UI pakeitimu, bet be ekrano nuotraukos, Heym atlieka dar vieną OpenCode perėjimą toje pačioje darbo erdvėje, kad užbaigtų. Jei UI pakeitimas vis dar neturi ekrano nuotraukos, PR kūne pridedama matoma pastaba, kad spraga niekada nebūtų tyli.

## Kas skelbiama GitHub'e

Jūsų **Task Prompt** yra privatus įvestis, o ne PR turinys. Skelbiamos tik dvi dalykai: `## Change Summary`, apibūdinantis, ką daro kodo pakeitimas, ir `## Screenshots` skyrius, kai buvo užfiksuotos ekrano nuotraukos. PR pavadinimas gaunamas tik iš pakeitimo santraukos.

Vykdytojo promptas nurodo šią politiką, o Heym taip pat ją įgyvendina po vykdymo: prieš ką nors įsipareigojant ar atidarant kaip pull request'ą, jis pašalina prompto atspindžio skyrius (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) ir bet kurią pastraipą, nukopijuotą žodžiu iš užduoties prompto, iš santraukos, PR kūno ir įsipareigojimo pranešimo.

Heym skaito `## Change Summary` skyrių iš agento pranešimų, o ne imasi to, ką jis pasakė paskutinį kartą, nes OpenCode išmeta pranešimą kiekviename žingsnyje, o paskutinis dažnai būna vidurio vykdymo komentaras. Žingsnių pasakojimas (`Both pass. Let me do a final review:`) taip pat atmetamas kaip PR pavadinimas ar įsipareigojimo tema. Jei vykdymas nesukuria naudingo pakeitimo santraukos, pull request'as grįžta prie pakeistų failų sąrašo, o ne skelbia komentarus.

## Kaip agento įrankis

OpenCode Go mazgas gali būti prijungtas prie **AI Agent** mazgo įrankio rankenos, kad agentas galėtų deleguoti kodavimo užduotis. Sukonfigūruokite kredencialą, GitHub kredencialą ir saugyklą mazge, tada pažymėkite **Task Prompt** (ir pasirenkamai **Repository URL**) su agento pateiktu perjungikliu, kad agentas juos pateiktų skambinimo metu.

## Pavyzdys

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

## Susiję

- [Codex Node](./codex-node.md)
- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
