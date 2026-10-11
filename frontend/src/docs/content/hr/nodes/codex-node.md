# Codex čvor

**Codex** čvor pokreće OpenAI Codex CLI u izoliranom Heym radnom prostoru nad GitHub repozitorijem. Namijenjen je programerskim zadacima poput ispravljanja testova, uređivanja datoteka, izrade zakrpe ili otvaranja draft pull requesta.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1, plus `question` |
| Vjerodajnica | Codex pristupni token + GitHub |
| Izlaz | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentifikacija

**OpenAI Codex** vjerodajnica podržava dva načina autentifikacije:

| Način | Opis |
|------|-------------|
| **Prijava putem ChatGPT-a** (preporučeno) | OAuth (PKCE) prijava koja koristi Vašu ChatGPT Plus/Pro pretplatu, tako da izvršavanja **ne** stvaraju troškove API-ja po tokenu. Kliknite **Prijava putem ChatGPT-a** u dijalogu za vjerodajnice, autorizirajte u pregledniku, a zatim zalijepite URL preusmjeravanja s `localhost:1455` natrag u Heym. Heym pohranjuje dobiveni paket tokena i automatski ga osvježava po isteku. |
| **Pristupni token** | Zalijepite ChatGPT/Codex `access_token` koji koristi isključivo lokalni Codex runner. |

API ključevi nisu prihvaćeni za Codex vjerodajnicu. Čvor ne šalje cloud Codex zadatke; klonira repozitorij unutar Heym runtimea, zapisuje ChatGPT paket tokena u izolirani `auth.json` (ili prosljeđuje `CODEX_ACCESS_TOKEN`) samo Codex procesu te drži token izvan `$credentials`.

Čvor također zahtijeva **GitHub** vjerodajnicu za kloniranje privatnih repozitorija, push radne grane i stvaranje draft pull requestova.

U Docker implementacijama, Heym pokreće Codex unutar sestrinskog kontejnera iz iste Heym slike (ne zasebne GHCR slike). Taj kontejner montira samo Codex radni volumen i dopušta Codexovom vlastitom bubblewrap sandboxu stvaranje namespaceova i svježeg `/proc`. Runner dodaje `SYS_ADMIN`, neograničeni seccomp i AppArmor te `systempaths=unconfined` (Docker Engine 25+). Bez posljednje zastavice svaka naredba ne uspije prije pokretanja s `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

OpenAI reference:

- [Codex autentifikacija](https://developers.openai.com/codex/auth)
- [Codex pristupni tokeni](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex modeli](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex neinteraktivni način rada](https://developers.openai.com/codex/noninteractive)
- [Codex cijene](https://developers.openai.com/codex/pricing)

## Polja

| Polje | Opis |
|-------|-------------|
| Codex vjerodajnica | OpenAI Codex vjerodajnica (ChatGPT prijava ili `access_token`) |
| GitHub vjerodajnica | GitHub PAT vjerodajnica koja se koristi za pristup repozitoriju |
| URL repozitorija | HTTPS URL GitHub repozitorija |
| Osnovna grana | Grana koja se klonira prije pokretanja Codexa, zadano `main` |
| Model | Neobavezni Codex model (padajući izbornik koji se može uređivati, npr. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); prazno koristi Codexov zadani model |
| Dubina zaključivanja | Codex dubina zaključivanja: `low`, `medium`, `high`, `xhigh` (Extra High), `max` ili `ultra` (zadano `medium`) |
| Prompt zadatka | Programerski zadatak za Codex; podržava izraze poput `$input.text` |
| Način objavljivanja | Kako se promjene dostavljaju (vidi tablicu u nastavku) |
| Naziv grane | Radna grana za PR/commit načine rada, zadano `codex/$executionId` |
| Vremensko ograničenje | Maksimalno vrijeme izvršavanja Codexa u sekundama |

## Načini objavljivanja

| Način | Što radi |
|------|--------------|
| `diff_only` | Uređuje datoteke lokalno i vraća zakrpu i promijenjene datoteke. Ništa se ne pusha. |
| `draft_pr` | Commita na granu, pusha je i otvara draft pull request. |
| `open_pr` | Commita na granu, pusha je i otvara pull request spreman za pregled (nije draft). |
| `commit_push` | Commita na granu i pusha je, bez otvaranja pull requesta. |
| `direct_commit` | Commita i pusha izravno na osnovnu granu (bez zasebne grane ili PR-a). |
| `open_or_update_pr` | Ažurira agentov postojeći otvoreni PR kada postoji — čak i ako se naziv grane razlikuje, runner ga pronalazi prema autoru + osnovi — inače otvara novi. Najbolje za ponovna izvršavanja i upute poput "ažuriraj otvoreni PR". |
| `update_existing_pr` | Dodaje commit na postojeću granu/PR; otvara ga ako još ne postoji. |
| `patch_artifact` | Sprema diff kao datoteku za preuzimanje i vraća `patchUrl`. Ništa se ne pusha. |

## Izlazi

| Ključ | Opis |
|-----|-------------|
| `status` | `completed` ili `needs_input` |
| `summary` | Codexov sažetak |
| `validation` | Napomene o validaciji, testovi ili provjere koje je prijavio Codex |
| `diff` | Git zakrpa kada su datoteke promijenjene |
| `changedFiles` | Putanje promijenjenih datoteka |
| `threadId` | Codex ID niti/sesije kada je dostupan |
| `branchName` | Naziv radne grane |
| `pullRequestUrl` | URL PR-a u načinima rada `draft_pr`, `open_pr`, `open_or_update_pr` i `update_existing_pr` |
| `pushedBranch` | Grana koja je pushana u commit/PR načinima rada |
| `patchUrl` | Veza za preuzimanje diffa u načinu rada `patch_artifact` |
| `usage` | Metapodaci o korištenju koje prijavljuje Codex CLI kada su dostupni |
## UI snimke zaslona u pull requestovima

Za UI/frontend zadatke, Codex treba spremiti PNG snimke zaslona pod gitignored putanjom kao što je `frontend/.e2e-artifacts/` (ne u izvorni kod). Ako frontend ovisnosti nedostaju, Codex može pokrenuti `bun install` (ili npm/pnpm install) i pokrenuti kratkotrajni preview/`bun run dev` isključivo radi snimanja UI-a. Heym učitava te slike u jedan zajednički GitHub **prerelease** (`codex-pr-assets`) kao assete nazvane `<branch>-…`, zatim ih ugrađuje u opis PR-a **prije nego što se pull request otvori**, tako da se novi PR kreira već sa svojim snimkama zaslona (postojeći PR-ovi se ažuriraju na mjestu). Codex također mora postaviti smislen `pull_request_title` (nikada placeholdere poput `Done.`).

Codex ponekad završi potez usred zadatka ("…Now let me take a screenshot"), što bi finaliziralo izvršavanje prije nego što se snimka zaslona zabilježi. Kako bi se to spriječilo, prompt runnera zahtijeva snimanje zaslona **prije** konačnog rezultata, a ako izvršavanje ipak završi bez sažetka koji se može objaviti ili s UI promjenom ali bez snimke zaslona, Heym pokreće još jedan Codex prolaz u istom radnom prostoru kako bi dovršio posao. Ako UI promjena i dalje nema snimku zaslona nakon toga, vidljiva napomena dodaje se u tijelo PR-a kako taj nedostatak nikada ne bi ostao neprimijećen.

## Što se objavljuje na GitHub

Vaš **Task Prompt** je privatan unos, a ne sadržaj PR-a. Objavljuju se samo dvije stvari: `## Change Summary` koji opisuje što promjena koda radi, i odjeljak `## Screenshots` kada su snimke zaslona zabilježene. Naslov PR-a izvodi se isključivo iz sažetka promjena.

Prompt runnera navodi ovo pravilo, a Heym ga također provodi nakon izvršavanja: prije nego što se bilo što commita ili otvori kao pull request, uklanja odjeljke koji odjekuju prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) i svaki odlomak doslovno kopiran iz task prompta iz sažetka, tijela PR-a i commit poruke. Pripovijedanje koraka poput `Both pass. Let me do a final review:` također se odbija kao naslov PR-a ili predmet commita.

## Dodatna pitanja

Ako Codex treba nedostajuće zahtjeve ili odluku o proizvodu, vraća `needs_input`. Heym pauzira izvršavanje i izlaže `question` izlazni handle. Povežite taj handle s granom za obavijesti, na primjer Slack ili Send Email, kako biste recenzentu poslali javnu poveznicu za dodatna pitanja.

Kada recenzent odgovori, Heym nastavlja isto izvršavanje iz snimke i Codex thread iz spremljenih metapodataka radnog prostora.

## Kao alat agenta

Codex čvor može se priključiti na tool handle **AI Agent** čvora kako bi agent mogao delegirati zadatke kodiranja. Konfigurirajte vjerodajnicu, GitHub vjerodajnicu i repozitorij na čvoru, zatim označite **Task Prompt** (i opcionalno **Repository URL**) agent-provided prekidačem kako bi ih agent dostavio u trenutku poziva. Kada Codex radi kao alat, rezultat `needs_input` vraća se inline agentu umjesto pauziranja workflowa, tako da agent može precizirati zahtjev i ponovno pozvati Codex.

## Primjer

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

## Povezano

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Vjerodajnice](../reference/credentials.md)
- [Dijeljenje vjerodajnica](../reference/credentials-sharing.md)
- [Vrste čvorova](../reference/node-types.md)
