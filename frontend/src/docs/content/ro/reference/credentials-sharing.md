# Partajarea Acreditărilor

Acreditările pot fi partajate cu alți utilizatori, astfel încât workflow-urile acestora să poată utiliza cheile dvs. API. Consultați [Acreditări](./credentials.md) pentru o prezentare generală și [Fila Acreditări](../tabs/credentials-tab.md) pentru adăugarea și gestionarea acreditărilor.

## Partajarea Acreditărilor cu un LLM

Pentru a permite unui LLM sau unui agent AI să utilizeze o cheie API, stocați cheia ca acreditare și lăsați nodul care efectuează cererea să o atașeze. Modelul decide ce să apeleze; nodul autentifică apelul în momentul executării.

- **Stocați secretul ca acreditare.** Valorile sensibile sunt criptate în repaus și mascate în interfața utilizator după creare.
- **Referiți-o acolo unde se efectuează cererea.** Nodurile [LLM](../nodes/llm-node.md) și [Agent](../nodes/agent-node.md) își selectează acreditarea de model după ID, iar cererile HTTP plasează `$credentials.CredentialName` în antetul de autentificare. Nu includeți secrete în câmpurile de prompt, deoarece tot conținutul unui prompt este trimis furnizorului de model ca text.
- **Oferiți agentului instrumente, nu chei.** Când un Agent apelează un nod HTTP, un server MCP sau un sub-workflow ca instrument, acreditarea este aplicată în interiorul acelui instrument, iar modelul primește rezultatul instrumentului.
- **Rezultatele sunt mascate.** Când o valoare de acreditare mai lungă de șapte caractere apare în rezultatul unui nod, se păstrează doar primele șapte caractere, astfel încât un răspuns care returnează o cheie afișează doar acel prefix în rezultate și în execuții. Consultați [Mascarea Rezultatelor](#output-masking).
- **Lăsați asistentul să creeze acreditări.** Când [Asistentul AI](./ai-assistant.md#credentials) sau fila Chat creează o acreditare, acesta vede doar numele și tipul, iar dvs. introduceți secretul în formularul obișnuit de acreditare.
- **Partajați cu persoane în același mod.** Partajați acreditarea cu un utilizator sau o echipă, după cum se descrie mai jos, iar workflow-urile acestora pot utiliza cheia dvs. prin propriile noduri LLM și Agent.

## Modelul de Partajare

- **CredentialShare** – Leagă `credential_id` de `user_id` (unic per pereche)
- **Partajare prin email** – `POST /api/credentials/{credential_id}/shares` cu email; utilizatorul este căutat și adăugat
- **Revocare** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

De asemenea, puteți partaja acreditări cu [Echipe](./teams.md):

- **CredentialTeamShare** – Leagă `credential_id` de `team_id`; toți membrii echipei obțin acces
- **Partajare cu echipa** – `POST /api/credentials/{credential_id}/team-shares` cu `team_id`
- **Revocare partajare cu echipa** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Acreditările partajate afișează un indicator în interfața [Fila Acreditări](../tabs/credentials-tab.md).

## Acreditări cu Domeniu Extins

Partajarea unei acreditări acordă destinatarului tot ceea ce acea acreditare poate face. Pentru majoritatea integrărilor, acest lucru este limitat la un singur workspace sau la permisiunile unei singure chei API, dar unele acreditări sunt mult mai extinse.

> **Acreditările Google Drive acordă acces complet la Drive.** Acreditarea [Google Drive](../nodes/google-drive-node.md) este autorizată cu scopul `https://www.googleapis.com/auth/drive`, astfel încât nodul să poată opera asupra fișierelor pe care le dețineți deja. Partajarea acesteia cu un utilizator sau o echipă le oferă fiecăruia dintre ei capacitatea de a **citi, modifica și șterge definitiv orice din Google Drive-ul dvs.** printr-un workflow — nu doar fișierele la care v-ați gândit. Partajați-o doar cu persoane cărora le-ați acorda direct acces complet la Drive.

Dacă trebuie să limitați expunerea, creați un cont Google dedicat cu acces doar la folderele de care are nevoie workflow-ul și conectați acreditarea cu acel cont în locul contului dvs. principal.

O acreditare **Decision Model** conține endpoint-ul și, atunci când este setată, o cheie API. Partajarea acesteia permite destinatarului să consume din acea cheie din orice workflow pe care îl poate rula, exact ca o acreditare LLM.

O acreditare **Model Router** partajează tot ceea ce rutează. Persoanele cu care o partajați pot rula cereri către fiecare acreditare din lista sa de opțiuni, iar acele cereri consumă cheile dvs. Acestea nu pot citi cheile, iar acreditările nu apar în propria lor listă de acreditări.

Acesta este același grant ca partajarea directă a unei acreditări OpenAI și este ceea ce face un router util pentru o echipă. Dacă nu doriți acest lucru, partajați acreditările individuale în schimb și lăsați fiecare persoană să aleagă un model.

## Partajarea cu Colaboratorii Workflow-ului

Când partajați un workflow, colaboratorii îl pot deschide și rula, dar nu pot utiliza acreditările dvs. decât dacă le partajați și aceste acreditări. Acest lucru se aplică acreditărilor din workflow-ul principal și din orice sub-workflow-uri pe care le apelează. Partajați fiecare acreditare cu aceiași utilizatori sau echipe pe care i-ați invitat la workflow. Sub-workflow-urile trebuie, de asemenea, partajate separat din editorul workflow-ului copil. Consultați [Organizarea Workflow-urilor](./workflow-organization.md#sharing-workflows).

## Contextul de Execuție

Când un workflow rulează, acreditările sunt rezolvate pentru **proprietarul workflow-ului** (sau utilizatorul curent în momentul rulării). `get_credentials_context()` îmbină:

1. **Acreditări deținute** – `Credential.owner_id == user_id`
2. **Acreditări partajate cu utilizatorul** – `CredentialShare` unde `CredentialShare.user_id == user_id`
3. **Acreditări partajate cu echipa** – `CredentialTeamShare` unde utilizatorul este membru al echipei

Toate sunt îmbinate într-un singur dicționar de context indexat după numele acreditării.

## Utilizarea în Workflow-uri
### După Nume (Expression DSL)

Acreditările sunt expuse ca `$credentials.CredentialName` în [Expression DSL](./expression-dsl.md). Utilizați această metodă pentru:

- Noduri HTTP (autentificare Bearer/Header)
- Noduri Telegram
- Noduri Slack
- Token-uri bearer Notion în cereri HTTP personalizate (token intern sau token de acces OAuth)
- Orice nod care acceptă expresii pentru autentificare

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### După ID (credentialId)

Unele noduri stochează `credentialId` (UUID) în `node.data`:

| Tip Nod | Câmp | Descriere |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Acreditare API LLM |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Acreditare token de acces Codex și acreditare GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Acreditare gateway OpenCode Go și acreditare GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Acreditare email/token API Jira Cloud sau acreditare utilizator/parolă Data Center |
| [Notion](../nodes/notion-node.md) | `credentialId` | Acreditare token intern Notion sau acreditare workspace OAuth |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Token de autentificare Sentry și URL de bază opțional |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL proiect Supabase și cheie API |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Detalii de conexiune ClickHouse (host, port, autentificare, bază de date) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Acreditare bot Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Acreditare cheie publică Discord sau webhook |
| Vector Store | `credential_id` | Bază de date vectorială Qdrant sau Postgres (pgvector), prin intermediul unei acreditări RAG Qdrant, Psql sau Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Acreditare model; o acreditare model sau Decision Model pentru judecătorul LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) pas AI | `credentialId` | Model LLM/Vision (pentru pasul AI și [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Executorul încarcă acreditarea direct din baza de date după ID și decriptează configurația.

## Mascarea Rezultatelor

După execuție, `mask_sensitive_output()` maschează valorile acreditărilor în rezultate, păstrând primele șapte caractere ale fiecărui secret mai lung de șapte caractere și înlocuind restul cu `**`, astfel încât secretele să nu fie expuse în rezultate sau în Execuții.

## Resurse Asociate

- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați și partajați acreditări
- [Integrări Terțe](./integrations.md) – Configurare detaliată pentru fiecare tip de acreditare
- [Echipe](./teams.md) – Partajare cu echipe
- [Expression DSL](./expression-dsl.md) – Sintaxa `$credentials`
- [Tipuri de Noduri](./node-types.md) – Noduri care utilizează acreditări ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Nod Agent](../nodes/agent-node.md) – Utilizează `credentialId` pentru LLM
