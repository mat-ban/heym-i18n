# OpenCode Go Vozlišče

Vozlišče **OpenCode Go** izvaja [OpenCode](https://opencode.ai) CLI (Go) v izoliranem, utrjenem Heym vsebniku proti GitHub repozitoriju. Tako kot vozlišče Codex je zasnovano za naloge kodiranja, kot so popravljanje testov, urejanje datotek, ustvarjanje popravkov ali odpiranje pull requestov — vendar uporablja ponudniku neodvisen **OpenCode Go** modelni prehod namesto OpenAI Codex.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | OpenCode Go API ključ + GitHub |
| Izhod | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Avtentikacija

Poverilnica **OpenCode Go** shranjuje **API ključ** za OpenCode Go prehod (iz [opencode.ai/go](https://opencode.ai/go)) in opcijski **Osnovni URL prehoda** (privzeto `https://opencode.ai/zen/go/v1`; nadomestite le za samostojno gostovan ali posredovan prehod).

Vozlišče prav tako zahteva **GitHub** poverilnico za kloniranje zasebnih repozitorijev, potiskanje delovne veje in ustvarjanje pull requestov. GitHub token **nikoli ni postavljen znotraj vsebinske peskovnika** — Heym izvaja vse git in GitHub operacije na gostitelju, tako da ustvarjena koda ne more izvesti poverilnic za potiskanje.

## Izolacija in varnost

Izolacija izvajanja je izbrana z `HEYM_OPENCODE_CLI_COMMAND`, prav tako kot pri vozlišču Codex:

- **Lokalni razvoj (`run.sh`)** ga pusti na privzetem `opencode`, tako da OpenCode deluje kot podproces gostitelja proti kloniranemu delovnemu prostoru — Docker ni potreben, brez dodatnih zastavic.
- **Docker implementacije (`deploy.sh` in enotna slika GHCR)** ga nastavijo na `/usr/local/bin/heym-opencode-docker`, ovitek, ki izvaja `opencode run` znotraj **utrjenega, enkratnega sosednjega vsebnika**, ki deli volumen delovnega prostora OpenCode.

Utrjen izvajalni vsebnik odstrani vse Linux zmogljivosti, nastavi `no-new-privileges`, uporablja samo za branje koren z tmpfs `/tmp` in uporablja omejitve za pid/memory/CPU. Omogočen je izhod omrežja (OpenCode mora doseči modelni prehod). **GitHub token nikoli ni postavljen znotraj vsebnika** — vse git in GitHub operacije se izvajajo na strani gostitelja, tako da so znotraj le API ključ OpenCode in datoteke repozitorija.

OpenCode le ureja datoteke na disku; Heym upravlja z vsakim git/GitHub dejanjem.

## Modeli

Seznam modelov OpenCode Go se pogosto spreminja, zato je polje **Model** napolnjeno v živo iz seznama modelov prehoda (`GET https://opencode.ai/zen/go/v1/models`) in prikazano kot iskalni spustni seznam. Če živi seznam ni na voljo, se uporabi vgrajen seznam rezerv. Id-ji modelov uporabljajo obliko `opencode-go/<model>` (na primer `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` je identifikator ponudnika OpenCode CLI za Go prehod. Pustite polje prazno, da uporabite privzeto vrednost izvajalca (`opencode-go/kimi-k3`). Id-ji modelov, shranjeni v starejši obliki `opencode/<model>`, se samodejno prepišejo med izvajanjem.

## Polja

| Polje | Opis |
|-------|-------------|
| Poverilnica OpenCode Go | Poverilnica OpenCode Go (API ključ prehoda) |
| Poverilnica GitHub | Poverilnica GitHub PAT, uporabljena za dostop do repozitorija |
| URL repozitorija | HTTPS URL GitHub repozitorija; podpira izraze |
| Osnovna veja | Veja, ki jo je treba klonirati pred izvajanjem OpenCode, privzeto `main` |
| Model | OpenCode Go model (živi iskalni spustni seznam, `opencode-go/<model>`); prazno uporablja privzeto vrednost izvajalca |
| Različica razmišljanja | Opcionalno; preslika na `opencode run --variant` za modele, ki podpirajo napor razmišljanja |
| Naloga Prompt | Naloga kodiranja za OpenCode; podpira izraze, kot je `$input.text` |
| Način objave | Kako se dostavljajo spremembe (glejte spodnjo tabelo) |
| Ime veje | Delovna veja za načine PR/commit, privzeto `opencode/$executionId` |
| Časovna omejitev | Maksimalni čas izvajanja OpenCode v sekundah |

## Načini objave

| Način | Kaj počne |
|------|--------------|
| `diff_only` | Ureja datoteke lokalno in vrne popravek ter spremenjene datoteke. Nič ni potisnjeno. |
| `draft_pr` | Zavezuje na vejo, jo potisne in odpre osnutek pull requesta. |
| `open_pr` | Zavezuje na vejo, jo potisne in odpre pull request, pripravljen za pregled (ne-osnutek). |
| `commit_push` | Zavezuje na vejo in jo potisne, brez odpiranja pull requesta. |
| `direct_commit` | Zavezuje in potisne neposredno na osnovno vejo (brez ločene veje ali PR). |
| `open_or_update_pr` | Posodobi obstoječi odprti PR agenta, ko ta obstaja — tudi če se ime veje razlikuje, ga izvajalec najde po avtorju + osnovi — sicer odpre novega. Najboljše za ponovne izvajanja in "posodobi odprti PR" navodila. |
| `update_existing_pr` | Doda zavezo obstoječi veji/PR; odpre enega, če še ne obstaja. |
| `patch_artifact` | Shrani popravek kot prenosno datoteko in vrne `patchUrl`. Nič ni potisnjeno. |

## Izhodi

| Ključ | Opis |
|-----|-------------|
| `status` | Vedno `completed` (vozlišče OpenCode Go ne čaka na vhod) |
| `summary` | Končna sporočilo OpenCode |
| `validation` | Opombe o validaciji, ko so poročane |
| `diff` | Git popravek, ko so se datoteke spremenile |
| `changedFiles` | Pot do spremenjenih datotek |
| `branchName` | Ime delovne veje |
| `pullRequestUrl` | URL PR v načinih `draft_pr`, `open_pr`, `open_or_update_pr` in `update_existing_pr` |
| `pushedBranch` | Veja, ki je bila potisnjena v načinih commit/PR |
| `patchUrl` | Povezava za prenos popravka v načinu `patch_artifact` |
## Posnetki uporabniškega vmesnika na pull requestih

Za naloge v zvezi z uporabniškim vmesnikom/frontendom naj OpenCode shrani PNG posnetke zaslona pod potjo, ki je izključena iz git-a, kot je `frontend/.e2e-artifacts/` (ne v vir). Če manjkajo odvisnosti za frontend, poziv izvajalca omogoča ciljno namestitev paketa (na primer `bun install`) ter kratkotrajni predogled/`bun run dev`, ki je namenjen izključno zajemu uporabniškega vmesnika. Heym naloži te slike v enoten skupni GitHub **prerelease** (`opencode-pr-assets`) kot sredstva, imenovana `<branch>-…`, nato pa jih vključi v opis PR **pred odprtjem pull requesta**, tako da je nov PR ustvarjen že s posnetki zaslona (obstoječi PR-ji se posodobijo na mestu).

OpenCode je prav tako navodeno, da se konča z vrstico `PR_TITLE: …`, tako da lahko Heym odpre pull request z smiselno temo namesto s splošnimi oznakami, kot je `Done.`

OpenCode včasih konča obrat sredi naloge ("…Sedaj naj vzamem posnetek zaslona"), kar bi zaključilo izvajanje, preden je posnetek zaslona zajet. Da bi to preprečili, poziv izvajalca zahteva zajem posnetkov zaslona **pred** končno sporočilo, in če se izvajanje še vedno konča brez objavljivega povzetka ali z spremembo uporabniškega vmesnika, a brez posnetka zaslona, Heym izvede še en krog OpenCode v istem delovnem prostoru, da zaključi. Če sprememba uporabniškega vmesnika še vedno nima posnetka zaslona, se v telo PR doda vidna opomba, tako da vrzel nikoli ne ostane tiha.

## Kaj se objavi na GitHub

Vaš **Task Prompt** je zasebni vhod, ne vsebina PR. Objavljeni sta le dve stvari: `## Change Summary`, ki opisuje, kaj sprememba kode počne, in odsek `## Screenshots`, ko so bili zajeti posnetki zaslona. Naslov PR izhaja iz povzetka spremembe.

Poziv izvajalca navaja to politiko, Heym pa jo tudi uveljavlja po zaključku izvajanja: preden je karkoli zavezanega ali odprtega kot pull request, odstrani odseke, ki ponavljajo poziv (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) in vsak odstavek, ki je dobesedno kopiran iz poziva naloge, iz povzetka, telesa PR in sporočila o zavezi.

Heym prebere odsek `## Change Summary` iz sporočil agenta, namesto da bi vzel karkoli, kar je zadnje povedal, ker OpenCode odda sporočilo za vsak korak, končno pa je pogosto komentar sredi izvajanja. Pripovedovanje korakov (`Oba sta uspešna. Dajte mi narediti končni pregled:`) je prav tako zavrnjeno kot naslov PR ali predmet zaveze. Če izvajanje ne ustvari uporabnega povzetka spremembe, se pull request vrne k seznamu spremenjenih datotek namesto objavljanju komentarjev.

## Kot orodje agenta

Node OpenCode Go se lahko pritrdi na orodno ročico **AI Agent** vozlišča, tako da lahko agent delegira naloge kodiranja. Konfigurirajte poverilnico, poverilnico GitHub in repozitorij na vozlišču, nato označite **Task Prompt** (in po želji **Repository URL**) z nastavitvijo, ki jo zagotovi agent, tako da agent te podatke posreduje ob klicu.

## Primer

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

## Sorodno

- [Codex Node](./codex-node.md)
- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
