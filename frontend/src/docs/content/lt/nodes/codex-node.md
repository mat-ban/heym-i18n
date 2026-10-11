# Codex mazgas

**Codex** mazgas vykdo OpenAI Codex CLI izoliuotoje Heym darbo erdvėje prieš GitHub saugyklą. Jis skirtas programavimo užduotims, tokioms kaip testų taisymas, failų redagavimas, pataisų kūrimas arba juodraščio pull request atidarymas.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1, plius `question` |
| Kredencialas | Codex prieigos token + GitHub |
| Išvestis | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentifikacija

**OpenAI Codex** kredencialas palaiko du autentifikacijos režimus:

| Režimas | Aprašymas |
|------|-------------|
| **Prisijungti su ChatGPT** (rekomenduojama) | OAuth (PKCE) prisijungimas, kuris naudoja Jūsų ChatGPT Plus/Pro prenumeratą, todėl vykdymai **ne** patiria API išlaidų už token. Paspauskite **Prisijungti su ChatGPT** kredencialų dialoge, įgalinkite naršyklėje, tada įklijuokite `localhost:1455` nukreipimo URL atgal į Heym. Heym saugo gautą token paketą ir automatiškai atnaujina jį, kai jis pasibaigia. |
| **Prieigos token** | Įklijuokite ChatGPT/Codex `access_token`, naudojamą tik vietiniam Codex vykdytojui. |

API raktai nėra priimami Codex kredencialui. Mazgas nesubmiss cloud Codex užduočių; jis klonuoja saugyklą Heym vykdymo metu, rašo ChatGPT token paketą į izoliuotą `auth.json` (arba perduoda `CODEX_ACCESS_TOKEN`) tik Codex procesui ir laiko token už `$credentials`.

Mazgas taip pat reikalauja **GitHub** kredencialo, kad galėtų klonuoti privačias saugyklas, įkelti darbo šaką ir kurti juodraščio pull request.

Docker diegimuose, Heym vykdo Codex tame pačiame konteineryje iš to paties Heym vaizdo (ne atskirame GHCR vaizde). Tas konteineris montuoja tik Codex darbo erdvės tūrį ir leidžia Codex savo bubblewrap smėlio dėžėje kurti vardų erdves ir šviežią `/proc`. Vykdytojas prideda `SYS_ADMIN`, neapribotą seccomp ir AppArmor, ir `systempaths=unconfined` (Docker Engine 25+). Be paskutinio parametro, kiekviena komanda nepavyksta prieš paleidimą su `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

OpenAI nuorodos:

- [Codex autentifikacija](https://developers.openai.com/codex/auth)
- [Codex prieigos tokenai](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex modeliai](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex neinteraktyvus režimas](https://developers.openai.com/codex/noninteractive)
- [Codex kainodara](https://developers.openai.com/codex/pricing)

## Laukai

| Laukas | Aprašymas |
|-------|-------------|
| Codex Kredencialas | OpenAI Codex kredencialas (ChatGPT prisijungimas arba `access_token`) |
| GitHub Kredencialas | GitHub PAT kredencialas, naudojamas saugyklos prieigai |
| Saugyklos URL | HTTPS GitHub saugyklos URL |
| Pagrindinė šaka | Šaka, kurią reikia klonuoti prieš Codex vykdymą, numatytoji `main` |
| Modelis | Pasirinktinai Codex modelis (redaguojamas išskleidžiamasis sąrašas, pvz., `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); tuščias naudoja Codex numatytąjį |
| Mąstymo pastangos | Codex mąstymo gylis: `low`, `medium`, `high`, `xhigh` (ypatingai aukštas), `max`, arba `ultra` (numatytoji `medium`) |
| Užduoties Prompt | Programavimo užduotis Codex; palaiko išraiškas, tokias kaip `$input.text` |
| Publikavimo režimas | Kaip pakeitimai pristatomi (žr. žemiau esančią lentelę) |
| Šakos pavadinimas | Darbo šaka PR/įsipareigojimų režimams, numatytoji `codex/$executionId` |
| Laiko limitas | Maksimalus Codex vykdymo laikas sekundėmis |

## Publikavimo režimai

| Režimas | Ką jis daro |
|------|--------------|
| `diff_only` | Redaguoja failus lokaliai ir grąžina pataisą bei pakeistų failų sąrašą. Nieko neįkelia. |
| `draft_pr` | Įsipareigoja šakai, ją įkelia ir atidaro juodraščio pull request. |
| `open_pr` | Įsipareigoja šakai, ją įkelia ir atidaro peržiūrai paruoštą (ne juodraštinį) pull request. |
| `commit_push` | Įsipareigoja šakai ir ją įkelia, neatsidarydamas pull request. |
| `direct_commit` | Įsipareigoja ir įkelia tiesiai į pagrindinę šaką (be atskiros šakos ar PR). |
| `open_or_update_pr` | Atnaujina agento esamą atvirą PR, kai toks egzistuoja — net jei šakos pavadinimas skiriasi, vykdytojas jį randa pagal autorių + pagrindinę — kitaip atidaro naują. Geriausia pakartotiniams vykdymams ir "atnaujinti atvirą PR" instrukcijoms. |
| `update_existing_pr` | Prideda įsipareigojimą prie esamos šakos/PR; atidaro vieną, jei dar nėra. |
| `patch_artifact` | Išsaugo pataisą kaip atsisiunčiamą failą ir grąžina `patchUrl`. Nieko neįkelia. |

## Išvestys

| Raktas | Aprašymas |
|-----|-------------|
| `status` | `completed` arba `needs_input` |
| `summary` | Codex santrauka |
| `validation` | Validacijos pastabos, testai ar patikrinimai, kuriuos praneša Codex |
| `diff` | Git pataisa, kai failai pasikeitė |
| `changedFiles` | Pakeistų failų keliai |
| `threadId` | Codex gijos/sesijos ID, kai jis yra prieinamas |
| `branchName` | Darbo šakos pavadinimas |
| `pullRequestUrl` | PR URL `draft_pr`, `open_pr`, `open_or_update_pr` ir `update_existing_pr` režimuose |
| `pushedBranch` | Šaka, kuri buvo įkelta į įsipareigojimų/PR režimus |
| `patchUrl` | Atsisiuntimo nuoroda pataisai `patch_artifact` režime |
| `usage` | Naudojimo metaduomenys, kuriuos praneša Codex CLI, kai jie yra prieinami |
## UI ekrano nuotraukos apie pull request'us

UI/frontend užduotims, Codex turėtų išsaugoti PNG ekrano nuotraukas gitignored kelyje, pavyzdžiui, `frontend/.e2e-artifacts/` (ne šaltinyje). Jei frontend priklausomybės trūksta, Codex gali vykdyti `bun install` (arba npm/pnpm install) ir pradėti trumpalaikį peržiūros/`bun run dev` procesą, kad užfiksuotų UI. Heym įkelia šias nuotraukas į vieną bendrą GitHub **prerelease** (`codex-pr-assets`) kaip turtą, pavadintą `<branch>-…`, tada įterpia jas į PR aprašymą **prieš atidarant pull request'ą**, taigi naujas PR sukuriamas jau turintis savo ekrano nuotraukas (esami PR atnaujinami vietoje). Codex taip pat turi nustatyti prasmingą `pull_request_title` (niekada nepalikite vietų, tokių kaip `Done.`).

Codex kartais užbaigia užduotį viduryje ("…Dabar leiskite man padaryti ekrano nuotrauką"), kas užbaigtų vykdymą prieš užfiksuojant ekrano nuotrauką. Norint to išvengti, vykdytojo promptas reikalauja užfiksuoti ekrano nuotraukas **prieš** galutinį rezultatą, o jei vykdymas vis tiek baigiasi be skelbtino santraukos arba su UI pakeitimu, bet be ekrano nuotraukos, Heym vykdo dar vieną Codex perėjimą toje pačioje darbo erdvėje, kad užbaigtų. Jei po UI pakeitimo vis dar nėra ekrano nuotraukos, į PR turinį pridedama matoma pastaba, kad spraga niekada nebūtų tyli.

## Kas skelbiama GitHub'e

Jūsų **Task Prompt** yra privatus įvestis, o ne PR turinys. Skelbiamos tik dvi dalys: `## Change Summary`, apibūdinanti, ką daro kodo pakeitimas, ir `## Screenshots` skyrius, kai buvo užfiksuotos ekrano nuotraukos. PR pavadinimas gaunamas tik iš pakeitimo santraukos.

Vykdytojo promptas nurodo šią politiką, o Heym taip pat ją įgyvendina po vykdymo: prieš ką nors įsipareigojant ar atidarant kaip pull request, jis pašalina prompto atkartojimo skyrius (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) ir bet kurią pastraipą, nukopijuotą žodžiu iš užduoties prompto, iš santraukos, PR turinio ir įsipareigojimo pranešimo. Žingsnių pasakojimas, pavyzdžiui, `Both pass. Let me do a final review:` taip pat atmetamas kaip PR pavadinimas ar įsipareigojimo tema.

## Sekantys klausimai

Jei Codex reikia trūkstamų reikalavimų ar produkto sprendimo, jis grąžina `needs_input`. Heym sustabdo vykdymą ir atskleidžia `question` išvesties rankeną. Prijunkite tą rankeną prie pranešimų šakos, pavyzdžiui, Slack arba Siųsti el. laišką, kad išsiųstumėte recenzentui viešą sekimo nuorodą.

Kai recenzentas atsako, Heym tęsia tą patį vykdymo momentinį vaizdą ir Codex giją iš išsaugotos darbo erdvės metaduomenų.

## Kaip agento įrankis

Codex mazgas gali būti prijungtas prie **AI Agent** mazgo įrankio rankenos, kad agentas galėtų deleguoti kodavimo užduotis. Sukonfigūruokite kredencialą, GitHub kredencialą ir saugyklą mazge, tada pažymėkite **Task Prompt** (ir pasirenkamai **Repository URL**) su agento pateiktu perjungikliu, kad agentas pateiktų juos skambinimo metu. Kai Codex veikia kaip įrankis, `needs_input` rezultatas grąžinamas tiesiogiai agentui, o ne sustabdant workflow, todėl agentas gali patikslinti užklausą ir vėl paskambinti Codex.

## Pavyzdys

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

## Susiję

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
