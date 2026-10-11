# Nodul Codex

Nodul **Codex** rulează OpenAI Codex CLI într-un spațiu de lucru Heym izolat, împotriva unui depozit GitHub. Este conceput pentru sarcini de programare precum repararea testelor, editarea fișierelor, producerea unui patch sau deschiderea unui pull request draft.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1, plus `question` |
| Acreditare | Token de acces Codex + GitHub |
| Ieșire | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentificare

Acreditarea **OpenAI Codex** acceptă două moduri de autentificare:

| Mod | Descriere |
|------|-------------|
| **Sign in with ChatGPT** (recomandat) | Autentificare OAuth (PKCE) care utilizează abonamentul dvs. ChatGPT Plus/Pro, astfel încât execuțiile **nu** generează costuri API per token. Faceți clic pe **Sign in with ChatGPT** în dialogul de acreditare, autorizați în browser, apoi lipiți URL-ul de redirecționare `localhost:1455` înapoi în Heym. Heym stochează pachetul de token-uri rezultat și îl reîmprospătează automat pe măsură ce expiră. |
| **Access token** | Lipiți un `access_token` ChatGPT/Codex utilizat exclusiv de runner-ul Codex local. |

Cheile API nu sunt acceptate pentru acreditarea Codex. Nodul nu trimite sarcini Codex în cloud; acesta clonează depozitul în interiorul runtime-ului Heym, scrie pachetul de token-uri ChatGPT într-un `auth.json` izolat (sau transmite `CODEX_ACCESS_TOKEN`) doar către procesul Codex și menține token-ul în afara `$credentials`.

Nodul necesită, de asemenea, o acreditare **GitHub** pentru clonarea depozitelor private, împingerea branch-ului de lucru și crearea pull request-urilor draft.

În implementările Docker, Heym rulează Codex într-un container frate din aceeași imagine Heym (nu o imagine GHCR separată). Acel container montează doar volumul spațiului de lucru Codex și permite sandbox-ului bubblewrap propriu Codex să creeze namespace-uri și un `/proc` nou. Runner-ul adaugă `SYS_ADMIN`, seccomp și AppArmor neconfinement, și `systempaths=unconfined` (Docker Engine 25+). Fără ultimul flag, fiecare comandă eșuează înainte de lansare cu `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Referințe OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Câmpuri

| Câmp | Descriere |
|-------|-------------|
| Codex Credential | Acreditare OpenAI Codex (autentificare ChatGPT sau `access_token`) |
| GitHub Credential | Acreditare GitHub PAT utilizată pentru accesul la depozit |
| Repository URL | URL HTTPS al depozitului GitHub |
| Base Branch | Branch-ul de clonat înainte de rularea Codex, implicit `main` |
| Model | Model Codex opțional (dropdown editabil, de ex. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); gol folosește valoarea implicită Codex |
| Reasoning Effort | Adâncimea de raționament Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max` sau `ultra` (implicit `medium`) |
| Task Prompt | Sarcină de programare pentru Codex; acceptă expresii precum `$input.text` |
| Publish Mode | Modul în care sunt livrate modificările (consultați tabelul de mai jos) |
| Branch Name | Branch-ul de lucru pentru modurile PR/commit, implicit `codex/$executionId` |
| Timeout | Timpul maxim de execuție Codex în secunde |

## Moduri de publicare

| Mod | Ce face |
|------|--------------|
| `diff_only` | Editează fișierele local și returnează patch-ul și fișierele modificate. Nimic nu este împins. |
| `draft_pr` | Face commit pe branch, îl împinge și deschide un pull request draft. |
| `open_pr` | Face commit pe branch, îl împinge și deschide un pull request pregătit pentru recenzie (non-draft). |
| `commit_push` | Face commit pe branch și îl împinge, fără a deschide un pull request. |
| `direct_commit` | Face commit și împinge direct pe branch-ul de bază (fără branch separat sau PR). |
| `open_or_update_pr` | Actualizează PR-ul deschis existent al agentului atunci când există unul — chiar dacă numele branch-ului diferă, runner-ul îl găsește după autor + bază — altfel deschide unul nou. Ideal pentru re-rulări și instrucțiuni de tipul „actualizează PR-ul deschis”. |
| `update_existing_pr` | Adaugă un commit pe branch-ul/PR-ul existent; deschide unul dacă nu există încă. |
| `patch_artifact` | Salvează diff-ul ca fișier descărcabil și returnează `patchUrl`. Nimic nu este împins. |

## Ieșiri

| Cheie | Descriere |
|-----|-------------|
| `status` | `completed` sau `needs_input` |
| `summary` | Rezumatul Codex |
| `validation` | Note de validare, teste sau verificări raportate de Codex |
| `diff` | Patch Git atunci când fișierele au fost modificate |
| `changedFiles` | Căi ale fișierelor modificate |
| `threadId` | Id-ul firului/sesiunii Codex atunci când este disponibil |
| `branchName` | Numele branch-ului de lucru |
| `pullRequestUrl` | URL-ul PR în modurile `draft_pr`, `open_pr`, `open_or_update_pr` și `update_existing_pr` |
| `pushedBranch` | Branch-ul care a fost împins în modurile commit/PR |
| `patchUrl` | Link de descărcare pentru diff în modul `patch_artifact` |
| `usage` | Metadate de utilizare raportate de Codex CLI atunci când sunt disponibile |
## Capturi de ecran UI în pull request-uri

Pentru sarcinile de UI/frontend, Codex ar trebui să salveze capturile de ecran PNG într-o cale ignorată de git, precum `frontend/.e2e-artifacts/` (nu în sursă). Dacă dependențele de frontend lipsesc, Codex poate rula `bun install` (sau npm/pnpm install) și poate porni o previzualizare de scurtă durată/`bun run dev` exclusiv pentru a captura UI-ul. Heym încarcă acele imagini într-un singur **prerelease** GitHub partajat (`codex-pr-assets`) ca active denumite `<branch>-…`, apoi le încorporează în descrierea PR **înainte ca pull request-ul să fie deschis**, astfel încât un PR nou este creat deja conținând capturile sale de ecran (PR-urile existente sunt actualizate pe loc). Codex trebuie, de asemenea, să seteze un `pull_request_title` semnificativ (niciodată substituenți precum `Done.`).

Codex încheie uneori un tur la mijlocul sarcinii ("…Acum permiteți-mi să fac o captură de ecran"), ceea ce ar finaliza execuția înainte ca captura de ecran să fie realizată. Pentru a preveni acest lucru, promptul runner-ului solicită capturarea capturilor de ecran **înainte** de rezultatul final, iar dacă execuția se termină totuși fără un rezumat publicabil sau cu o modificare UI dar fără captură de ecran, Heym rulează încă o trecere Codex în același spațiu de lucru pentru a finaliza. Dacă o modificare UI încă nu are captură de ecran după aceea, o notă vizibilă este adăugată în corpul PR, astfel încât lipsa să nu fie niciodată silențioasă.

## Ce se publică pe GitHub

**Task Prompt**-ul dvs. este input privat, nu conținut PR. Doar două lucruri sunt publicate: un `## Change Summary` care descrie ce face modificarea de cod și o secțiune `## Screenshots` atunci când au fost capturate capturi de ecran. Titlul PR este derivat exclusiv din rezumatul modificării.

Promptul runner-ului declară această politică, iar Heym o aplică și după execuție: înainte ca orice să fie commit-at sau deschis ca pull request, acesta elimină secțiunile de ecou ale promptului (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) și orice paragraf copiat textual din promptul sarcinii din rezumat, corpul PR și mesajul de commit. Narațiunea pas cu pas precum `Both pass. Let me do a final review:` este de asemenea respinsă ca titlu PR sau subiect de commit.

## Întrebări de continuare

Dacă Codex are nevoie de cerințe lipsă sau de o decizie de produs, acesta returnează `needs_input`. Heym suspendă execuția și expune un handle de ieșire `question`. Conectați acel handle la o ramură de notificare, de exemplu Slack sau Send Email, pentru a trimite recenzentului linkul public de continuare.

Când recenzentul răspunde, Heym reia același instantaneu de execuție și firul Codex din metadatele spațiului de lucru salvat.

## Ca instrument de agent

Nodul Codex poate fi atașat la handle-ul de instrument al unui nod **AI Agent**, astfel încât agentul să poată delega sarcini de codare. Configurați acreditarea, acreditarea GitHub și repository-ul pe nod, apoi marcați **Task Prompt** (și opțional **Repository URL**) cu comutatorul furnizat de agent, astfel încât agentul să le furnizeze la momentul apelului. Când Codex rulează ca instrument, un rezultat `needs_input` este returnat inline agentului în loc să suspende workflow-ul, astfel încât agentul poate rafina cererea și apela Codex din nou.

## Exemplu

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

## Asociate

- [Nodul GitHub](./github-node.md)
- [Nodul Agent](./agent-node.md)
- [Acreditări](../reference/credentials.md)
- [Partajarea acreditărilor](../reference/credentials-sharing.md)
- [Tipuri de noduri](../reference/node-types.md)
