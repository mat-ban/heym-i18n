# Codex Vozlišče

Vozlišče **Codex** izvaja OpenAI Codex CLI v izoliranem Heym delovnem prostoru proti GitHub repozitoriju. Namenjeno je nalogam kodiranja, kot so popravljanje testov, urejanje datotek, ustvarjanje popravkov ali odpiranje osnutka pull requesta.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1, plus `question` |
| Poverilnica | Codex dostopni token + GitHub |
| Izhod | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Avtentikacija

Poverilnica **OpenAI Codex** podpira dva načina avtentikacije:

| Način | Opis |
|------|-------------|
| **Prijava z ChatGPT** (priporočeno) | OAuth (PKCE) prijava, ki uporablja vašo naročnino ChatGPT Plus/Pro, zato izvajanja **ne** povzročajo stroškov API na podlagi števila tokenov. Kliknite **Prijava z ChatGPT** v pogovornem oknu poverilnice, avtorizirajte v svojem brskalniku, nato prilepite URL za preusmeritev `localhost:1455` nazaj v Heym. Heym shrani nastali paket tokenov in ga samodejno osveži, ko poteče. |
| **Dostopni token** | Prilepite ChatGPT/Codex `access_token`, ki se uporablja samo z lokalnim Codex izvajalnikom. |

API ključi niso sprejeti za Codex poverilnico. Vozlišče ne oddaja nalog Codex v oblaku; klonira repozitorij znotraj Heym izvajalnega okolja, zapiše paket ChatGPT tokenov v izolirano `auth.json` (ali prenese `CODEX_ACCESS_TOKEN`) samo procesu Codex in drži token stran od `$credentials`.

Vozlišče prav tako zahteva **GitHub** poverilnico za kloniranje zasebnih repozitorijev, potiskanje delovne veje in ustvarjanje osnutkov pull requestov.

V Docker namestitvah Heym izvaja Codex znotraj sosednjega kontejnerja iz istega Heym slike (ne ločene GHCR slike). Ta kontejner montira samo volumen Codex delovnega prostora in omogoča Codexovemu lastnemu bubblewrap peskovniku ustvarjanje prostorov imen in svežega `/proc`. Izvajalnik doda `SYS_ADMIN`, neomejen seccomp in AppArmor ter `systempaths=unconfined` (Docker Engine 25+). Brez zadnjega zastavice vsak ukaz ne uspe pred zagon s sporočilom `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Reference OpenAI:

- [Codex avtentikacija](https://developers.openai.com/codex/auth)
- [Codex dostopni tokeni](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex modeli](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex neinteraktivni način](https://developers.openai.com/codex/noninteractive)
- [Codex cene](https://developers.openai.com/codex/pricing)

## Polja

| Polje | Opis |
|-------|-------------|
| Codex Poverilnica | OpenAI Codex poverilnica (prijava ChatGPT ali `access_token`) |
| GitHub Poverilnica | GitHub PAT poverilnica, uporabljena za dostop do repozitorija |
| URL repozitorija | HTTPS URL GitHub repozitorija |
| Osnovna veja | Veja, ki se klonira pred izvajanjem Codex, privzeto `main` |
| Model | Neobvezen Codex model (ureditveni spustni meni, npr. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); prazno uporablja privzeti Codex |
| Napor razmišljanja | Globina razmišljanja Codex: `low`, `medium`, `high`, `xhigh` (Ekstra visoko), `max`, ali `ultra` (privzeto `medium`) |
| Naloga Prompt | Naloga kodiranja za Codex; podpira izraze, kot je `$input.text` |
| Način objave | Kako se spremembe dostavijo (glejte spodnjo tabelo) |
| Ime veje | Delovna veja za PR/commit načine, privzeto `codex/$executionId` |
| Časovna omejitev | Maksimalni čas izvajanja Codex v sekundah |

## Načini objave

| Način | Kaj počne |
|------|--------------|
| `diff_only` | Ureja datoteke lokalno in vrne popravke ter spremenjene datoteke. Nič ni potisnjeno. |
| `draft_pr` | Zaveže na vejo, jo potisne in odpre osnutek pull requesta. |
| `open_pr` | Zaveže na vejo, jo potisne in odpre pull request, pripravljen za pregled (ne-osnutek). |
| `commit_push` | Zaveže na vejo in jo potisne, brez odpiranja pull requesta. |
| `direct_commit` | Zaveže in potisne neposredno na osnovno vejo (brez ločene veje ali PR). |
| `open_or_update_pr` | Posodobi obstoječi odprti PR agenta, ko ta obstaja — tudi če se ime veje razlikuje, ga izvajalnik najde po avtorju + osnovi — sicer odpre novega. Najboljše za ponovne izvajanja in "posodobi odprti PR" navodila. |
| `update_existing_pr` | Doda zavezo obstoječi veji/PR; odpre enega, če še ne obstaja. |
| `patch_artifact` | Shrani popravke kot prenosno datoteko in vrne `patchUrl`. Nič ni potisnjeno. |

## Izhodi

| Ključ | Opis |
|-----|-------------|
| `status` | `completed` ali `needs_input` |
| `summary` | Povzetek Codex-a |
| `validation` | Opombe o validaciji, testi ali preverjanja, ki jih poroča Codex |
| `diff` | Git popravki, ko so se datoteke spremenile |
| `changedFiles` | Pot do spremenjenih datotek |
| `threadId` | ID niti/seje Codex, ko je na voljo |
| `branchName` | Ime delovne veje |
| `pullRequestUrl` | URL PR v načinih `draft_pr`, `open_pr`, `open_or_update_pr` in `update_existing_pr` |
| `pushedBranch` | Veja, ki je bila potisnjena v načinih commit/PR |
| `patchUrl` | Povezava za prenos popravkov v načinu `patch_artifact` |
| `usage` | Metapodatki o uporabi, ki jih poroča Codex CLI, ko so na voljo |
## Posnetki uporabniškega vmesnika na pull requestih

Za naloge v zvezi z uporabniškim vmesnikom/frontendom naj Codex shrani PNG posnetke zaslona pod potjo, ki je izključena iz git-a, kot je `frontend/.e2e-artifacts/` (ne v vir). Če manjkajo odvisnosti za frontend, lahko Codex izvede `bun install` (ali npm/pnpm install) in zažene kratkotrajni predogled/`bun run dev` zgolj za zajem posnetka uporabniškega vmesnika. Heym naloži te slike v enoten skupni GitHub **prerelease** (`codex-pr-assets`) kot sredstva z imeni `<branch>-…`, nato pa jih vključi v opis PR **pred odprtjem pull requesta**, tako da se ustvari nov PR, ki že vsebuje svoje posnetke zaslona (obstoječi PR-ji se posodobijo na mestu). Codex mora prav tako nastaviti smiselno `pull_request_title` (nikoli nadomestne oznake, kot je `Končano.`).

Codex včasih konča krog sredi naloge ("…Sedaj naj vzamem posnetek zaslona"), kar bi zaključilo izvajanje, preden je posnetek zaslona zajet. Da bi to preprečili, zahteva poziv izvajalca zajem posnetkov zaslona **pred** končnim rezultatom, in če se izvajanje še vedno konča brez objavljivega povzetka ali s spremembo v uporabniškem vmesniku, vendar brez posnetka zaslona, Heym izvede še en prehod Codex v istem delovnem prostoru, da dokonča. Če sprememba v uporabniškem vmesniku še vedno nima posnetka zaslona, se v telo PR doda vidna opomba, tako da vrzel nikoli ne ostane tiha.

## Kaj se objavi na GitHub

Vaš **Task Prompt** je zasebni vhod, ne vsebina PR. Objavljeni sta le dve stvari: `## Change Summary`, ki opisuje, kaj sprememba kode počne, in odsek `## Screenshots`, ko so bili zajeti posnetki zaslona. Naslov PR izhaja iz povzetka spremembe.

Poziv izvajalca navaja to politiko, Heym pa jo tudi uveljavlja po zaključku izvajanja: preden je karkoli zavezanega ali odprtega kot pull request, odstrani odseke ponovnega poziva (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) in vsak odstavek, ki je dobesedno kopiran iz naloge, iz povzetka, telesa PR in sporočila o zavezi. Korak pripovedovanja, kot je `Oba sta uspešna. Dovolite mi, da naredim končni pregled:`, je prav tako zavrnjen kot naslov PR ali predmet zaveze.

## Dodatna vprašanja

Če Codex potrebuje manjkajoče zahteve ali odločitev o izdelku, vrne `needs_input`. Heym ustavi izvajanje in izpostavi `question` izhodno ročico. Povežite to ročico z obvestilno vejo, na primer Slack ali Pošlji e-pošto, da pošljete pregledovalcu javno povezavo za nadaljnje vprašanje.

Ko pregledovalec odgovori, Heym nadaljuje z istim posnetkom izvajanja in nitjo Codex iz shranjenih metapodatkov delovnega prostora.

## Kot orodje agenta

Node Codex se lahko pritrdi na orodno ročico **AI Agent** vozlišča, tako da lahko agent delegira naloge kodiranja. Konfigurirajte poverilnico, poverilnico GitHub in repozitorij na vozlišču, nato označite **Task Prompt** (in po želji **Repository URL**) z nastavitvijo, ki jo zagotovi agent, tako da agent te podatke zagotovi ob klicu. Ko Codex deluje kot orodje, se rezultat `needs_input` vrne v vrstici agenta namesto da bi ustavil workflow, tako da lahko agent izpopolni zahtevo in ponovno pokliče Codex.

## Primer

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

## Sorodno

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Poverilnice](../reference/credentials.md)
- [Deljenje poverilnic](../reference/credentials-sharing.md)
- [Vrste vozlišč](../reference/node-types.md)
