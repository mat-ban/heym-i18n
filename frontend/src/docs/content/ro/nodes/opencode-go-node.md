# Nodul OpenCode Go

Nodul **OpenCode Go** rulează CLI-ul [OpenCode](https://opencode.ai) (Go) într-un container Heym izolat și securizat, împotriva unui depozit GitHub. La fel ca nodul Codex, este conceput pentru sarcini de programare precum corectarea testelor, editarea fișierelor, producerea unui patch sau deschiderea unui pull request — dar utilizează gateway-ul de modele **OpenCode Go**, agnostic față de furnizor, în locul OpenAI Codex.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditare | Cheie API OpenCode Go + GitHub |
| Ieșire | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentificare

Acreditarea **OpenCode Go** stochează o **cheie API** pentru gateway-ul OpenCode Go (de la [opencode.ai/go](https://opencode.ai/go)) și un **Gateway Base URL** opțional (implicit `https://opencode.ai/zen/go/v1`; se suprascrie doar pentru un gateway self-hosted sau proxy).

Nodul necesită, de asemenea, o acreditare **GitHub** pentru clonarea depozitelor private, publicarea branch-ului de lucru și crearea pull request-urilor. Token-ul GitHub **nu este niciodată plasat în containerul sandbox** — Heym efectuează toate operațiunile git și GitHub pe host, astfel încât codul generat nu poate exfiltra acreditările de publicare.

## Izolare și securitate

Izolarea execuției este aleasă prin `HEYM_OPENCODE_CLI_COMMAND`, exact ca la nodul Codex:

- **Dezvoltarea locală (`run.sh`)** îl lasă la valoarea implicită `opencode`, astfel încât OpenCode rulează ca subproces pe host împotriva spațiului de lucru clonat — nu este necesar Docker, fără flag-uri suplimentare.
- **Implementările Docker (`deploy.sh` și imaginea unică GHCR)** îl setează la `/usr/local/bin/heym-opencode-docker`, un wrapper care rulează `opencode run` în interiorul unui **container frate efemer și securizat**, care partajează volumul numit al spațiului de lucru OpenCode.

Containerul de rulare securizat elimină toate capabilitățile Linux, setează `no-new-privileges`, utilizează un root read-only cu un tmpfs `/tmp` și aplică limite de pid/memorie/CPU. Egress-ul de rețea este permis (OpenCode trebuie să atingă gateway-ul de modele). **Token-ul GitHub nu este niciodată plasat în interiorul containerului** — toate operațiunile git și GitHub rulează pe host, astfel încât doar cheia API OpenCode și fișierele depozitului se află vreodată în interior.

OpenCode editează doar fișiere pe disc; Heym deține controlul fiecărei acțiuni git/GitHub.

## Modele

Lista de modele a OpenCode Go se schimbă frecvent, astfel încât câmpul **Model** este populat în timp real din lista de modele a gateway-ului (`GET https://opencode.ai/zen/go/v1/models`) și afișat ca un dropdown căutabil. Dacă lista în timp real nu este disponibilă, se utilizează o listă de rezervă integrată. ID-urile de model folosesc forma `opencode-go/<model>` (de exemplu `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` este ID-ul de furnizor al CLI-ului OpenCode pentru gateway-ul Go. Lăsați câmpul gol pentru a utiliza valoarea implicită a runner-ului (`opencode-go/kimi-k3`). ID-urile de model salvate în forma mai veche `opencode/<model>` sunt rescrise automat la momentul rulării.

## Câmpuri

| Câmp | Descriere |
|-------|-------------|
| OpenCode Go Credential | Acreditare OpenCode Go (cheie API gateway) |
| GitHub Credential | Acreditare PAT GitHub utilizată pentru accesul la depozit |
| Repository URL | URL HTTPS al depozitului GitHub; acceptă expresii |
| Base Branch | Branch-ul de clonat înainte de rularea OpenCode, implicit `main` |
| Model | Model OpenCode Go (dropdown căutabil în timp real, `opencode-go/<model>`); gol folosește valoarea implicită a runner-ului |
| Reasoning Variant | Opțional; se mapează la `opencode run --variant` pentru modelele care acceptă efort de raționament |
| Task Prompt | Sarcină de programare pentru OpenCode; acceptă expresii precum `$input.text` |
| Publish Mode | Modul în care sunt livrate modificările (consultați tabelul de mai jos) |
| Branch Name | Branch-ul de lucru pentru modurile PR/commit, implicit `opencode/$executionId` |
| Timeout | Timpul maxim de execuție OpenCode în secunde |

## Moduri de publicare

| Mod | Ce face |
|------|--------------|
| `diff_only` | Editează fișierele local și returnează patch-ul și fișierele modificate. Nimic nu este publicat. |
| `draft_pr` | Face commit pe branch, îl publică și deschide un pull request draft. |
| `open_pr` | Face commit pe branch, îl publică și deschide un pull request pregătit pentru recenzie (non-draft). |
| `commit_push` | Face commit pe branch și îl publică, fără a deschide un pull request. |
| `direct_commit` | Face commit și publică direct pe branch-ul de bază (fără branch separat sau PR). |
| `open_or_update_pr` | Actualizează PR-ul deschis existent al agentului atunci când există unul — chiar dacă numele branch-ului diferă, runner-ul îl găsește după autor + bază — altfel deschide unul nou. Ideal pentru rerulări și instrucțiuni de tipul „actualizează PR-ul deschis”. |
| `update_existing_pr` | Adaugă un commit pe branch-ul/PR-ul existent; deschide unul dacă nu există încă. |
| `patch_artifact` | Salvează diff-ul ca fișier descărcabil și returnează `patchUrl`. Nimic nu este publicat. |

## Ieșiri

| Cheie | Descriere |
|-----|-------------|
| `status` | Întotdeauna `completed` (nodul OpenCode Go nu se opune pentru intrare) |
| `summary` | Mesajul final al OpenCode |
| `validation` | Note de validare atunci când sunt raportate |
| `diff` | Patch git atunci când fișierele s-au modificat |
| `changedFiles` | Căile fișierelor modificate |
| `branchName` | Numele branch-ului de lucru |
| `pullRequestUrl` | URL-ul PR în modurile `draft_pr`, `open_pr`, `open_or_update_pr` și `update_existing_pr` |
| `pushedBranch` | Branch-ul care a fost publicat în modurile commit/PR |
| `patchUrl` | Link de descărcare pentru diff în modul `patch_artifact` |
## Capturi de ecran UI în pull request-uri

Pentru sarcinile de UI/frontend, OpenCode ar trebui să salveze capturi de ecran PNG într-o cale ignorată de git, precum `frontend/.e2e-artifacts/` (nu în sursă). Dacă dependențele de frontend lipsesc, promptul runner-ului permite o instalare țintită de pachete (de exemplu `bun install`) plus o previzualizare de scurtă durată/`bun run dev` exclusiv pentru a captura UI-ul. Heym încarcă acele imagini într-un singur **prerelease** GitHub partajat (`opencode-pr-assets`) ca active denumite `<branch>-…`, apoi le încorporează în descrierea PR-ului **înainte ca pull request-ul să fie deschis**, astfel încât un PR nou este creat deja conținând capturile sale de ecran (PR-urile existente sunt actualizate pe loc).

De asemenea, OpenCode este instruit să încheie cu o linie `PR_TITLE: …` pentru ca Heym să poată deschide pull request-ul cu un subiect semnificativ în locul unor substituenți precum `Done.`

Uneori OpenCode încheie o rundă la mijlocul sarcinii ("…Now let me take a screenshot"), ceea ce ar finaliza execuția înainte ca captura de ecran să fie realizată. Pentru a preveni acest lucru, promptul runner-ului impune capturarea capturilor de ecran **înainte** de mesajul final, iar dacă execuția se încheie totuși fără un rezumat publicabil sau cu o modificare de UI dar fără captură de ecran, Heym rulează încă o trecere OpenCode în același workspace pentru a finaliza. Dacă o modificare de UI rămâne fără captură de ecran după aceea, o notă vizibilă este adăugată în corpul PR-ului, astfel încât lipsa să nu rămână niciodată nesemnalată.

## Ce se publică pe GitHub

**Task Prompt**-ul dvs. este un input privat, nu conținut de PR. Doar două lucruri sunt publicate: o secțiune `## Change Summary` care descrie ce face modificarea de cod și o secțiune `## Screenshots` atunci când au fost capturate capturi de ecran. Titlul PR-ului este derivat exclusiv din rezumatul modificării.

Promptul runner-ului declară această politică, iar Heym o aplică și după execuție: înainte ca orice să fie comis sau deschis ca pull request, acesta elimină secțiunile de ecou ale promptului (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) și orice paragraf copiat textual din promptul sarcinii din rezumat, corpul PR-ului și mesajul de commit.

Heym citește secțiunea `## Change Summary` din mesajele agentului în loc să ia ceea ce a spus ultima dată, deoarece OpenCode emite un mesaj pe pas și ultimul este adesea un comentariu de la mijlocul execuției. Narațiunea pașilor (`Both pass. Let me do a final review:`) este de asemenea respinsă ca titlu de PR sau subiect de commit. Dacă execuția nu produce niciun rezumat de modificare utilizabil, pull request-ul revine la listarea fișierelor modificate în loc să publice comentarii.

## Ca instrument de agent

Nodul OpenCode Go poate fi atașat la mânerul de instrument al unui nod **AI Agent** pentru ca agentul să poată delega sarcini de codare. Configurați acreditarea, acreditarea GitHub și repository-ul pe nod, apoi marcați **Task Prompt** (și opțional **Repository URL**) cu comutatorul furnizat de agent, astfel încât agentul să le furnizeze la momentul apelului.

## Exemplu

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

## Asociate

- [Nodul Codex](./codex-node.md)
- [Nodul GitHub](./github-node.md)
- [Nodul Agent](./agent-node.md)
- [Acreditări](../reference/credentials.md)
- [Partajarea acreditărilor](../reference/credentials-sharing.md)
- [Tipuri de noduri](../reference/node-types.md)
