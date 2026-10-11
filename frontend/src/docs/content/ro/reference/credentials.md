# Credentials

Credentialele stochează chei API și secrete utilizate de nodurile workflow-ului. Acestea se adaugă în [Credentials Tab](../tabs/credentials-tab.md) și se referențiază prin nume în configurația nodului.

## Ce sunt Credentialele

- **Stocate per utilizator** – Fiecare credential aparține unui utilizator și poate fi [partajat](./credentials-sharing.md) cu alți utilizatori sau cu [Teams](./teams.md).
- **Criptate în repaus** – Valorile sensibile sunt criptate; interfața le maschează după creare.
- **Referențiate prin nume** – Nodurile selectează un credential prin nume (sau ID). Motorul de execuție rezolvă credentialul pentru proprietarul workflow-ului la momentul rulării.

## Cum le utilizează nodurile

| Tip de nod | Credential tipic | Scop |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | Cheie API pentru model |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | URL-ul de bază al unui endpoint de model de decizie, plus o cheie API opțională |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Selectează care dintre modelele dumneavoastră deservește fiecare cerere, utilizând un model de decizie |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Autentificare prin abonament ChatGPT (OAuth) sau un token de acces Codex pentru runner, plus un PAT GitHub pentru operațiuni pe repository |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | O cheie API pentru gateway-ul OpenCode Go (URL de bază opțional) pentru runner, plus un PAT GitHub pentru operațiuni pe repository |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | Token de acces personal GitHub (PAT) pentru apeluri API GitHub, operațiuni ale nodului GitHub și integrări MCP |
| [Jira](../nodes/jira-node.md) | Jira | Email/token API Cloud sau utilizator/parolă Data Center, URL-ul de bază al site-ului Jira, modul de implementare și versiunea REST API opțională |
| [Linear](../nodes/linear-node.md) | Linear | Cheie API personală sau OAuth2 pentru echipe, proiecte, issues și comentarii |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autentificare pentru cereri |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Token de bot și secret webhook opțional |
| [Discord](../nodes/discord-node.md) | Discord | URL de webhook incoming |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Cheie publică a aplicației pentru verificarea semnăturii |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Conexiune la vector store (Qdrant extern sau Postgres propriu Heym prin pgvector), cu OpenAI sau orice endpoint de embedding compatibil OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook sau token API |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Conexiune la căsuța poștală de intrare |
| [Send Email](../nodes/send-email-node.md) | SMTP | Server de mail |
| [Redis](../nodes/redis-node.md) | Redis | Conexiune |
| [Grist](../nodes/grist-node.md) | Grist | Cheie API + URL server |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + consimțământ OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + consimțământ OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + consimțământ OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL proiect + cheie API (+ schemă implicită opțională) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + utilizator/parolă + bază de date (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Token de integrare internă sau Client ID + Client Secret + consimțământ OAuth pentru integrare publică |
| [Sentry](../nodes/sentry-node.md) | Sentry | Token de autentificare plus URL de bază opțional pentru self-hosted |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Cheie de acces, cheie secretă, regiune |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL AMQP |

Pentru configurare detaliată (hosturi, porturi, câmpuri specifice furnizorului), consultați [Third-Party Integrations](./integrations.md). Aceasta include configurarea botului Telegram, email de intrare prin IMAP și email de ieșire prin SMTP.

Credentialele GitHub pot include, de asemenea, un `base_url` opțional atunci când vizați GitHub
Enterprise Server în loc de GitHub.com. Când editați un credential GitHub pentru a rota token-ul,
lăsarea `base_url` gol păstrează endpoint-ul Enterprise existent. Introduceți un URL nou doar când
doriți să modificați acel endpoint.

Credentialele Jira, Linear, Supabase, Notion, Sentry și ClickHouse expun **Test Connection** în dialogul de credential. Pentru Jira, verificarea apelează endpoint-ul utilizatorului curent din Jira. Pentru Linear,
verificarea apelează API-ul Linear cu `getViewer` și confirmă că cheia API sau token-ul OAuth este valid.
La editare, puteți testa fără a reintroduce cheia API dacă secretul stocat este încă prezent. Pentru Notion,
alegeți **Internal token** sau **OAuth** în dialog; OAuth utilizează Client ID și Client Secret
din integrarea publică Notion. Consultați [Third-Party Integrations](./integrations.md#notion) pentru
detalii de configurare Notion.
## Utilizarea pachetului de codare

Fila **AI Defaults** din [Settings](./user-settings.md) afișează utilizarea rămasă a pachetului de codare pentru credențialele dumneavoastră Codex (deținute și partajate). Pentru fiecare credențial Codex, aceasta afișează o bară orizontală pentru fiecare fereastră activă de limitare a ratei — de obicei o fereastră de **5 ore** și/sau **Săptămânală**, în funcție de planul dumneavoastră — cu procentul de cotă rămasă și o numărătoare inversă până la resetare. Datele provin din anteturile de răspuns privind limitarea ratei ale backend-ului Codex, preluate la cerere.

Credențialele OpenCode Go sunt de asemenea listate acolo, dar marcate ca **„utilizare indisponibilă"**: gateway-ul OpenCode zen nu expune date privind cota rămasă, astfel încât nu poate fi afișată nicio bară.

## În expresii

Unele noduri permit expresii pentru autentificare. Utilizați [Expression DSL](./expression-dsl.md) cu `$credentials.CredentialName` pentru a face referire la secretul rezolvat al unui credențial în interiorul unei expresii. Pentru linia de antet de care are nevoie fiecare tip de credențial într-o cerere HTTP, consultați [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Credențialele Codex sunt excluse în mod intenționat din `$credentials`. Indiferent dacă vă autentificați cu ChatGPT (abonament, fără cost API per token) sau lipiți un `access_token` Codex, tokenurile sunt transmise doar procesului local de rulare Codex. Tokenurile de autentificare ChatGPT sunt reînnoite automat la expirare.

Credențialele Jira sunt de asemenea excluse din `$credentials`. [Nodul Jira](../nodes/jira-node.md) încarcă credențialul după `credentialId` în momentul rulării. Pentru apeluri REST Jira personalizate neacoperite de nodul Jira, utilizați [nodul HTTP](../nodes/http-node.md) cu Jira Basic Auth (`email:api_token` pentru Jira Cloud sau `username:password` pentru Data Center / Server), de exemplu `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Puteți utiliza de asemenea un credențial [Header](../nodes/http-node.md) cu `Authorization: Basic <base64(user:secret)>`. Tokenurile de acces personal Jira Data Center / Server și autentificarea Bearer nu sunt încă acceptate de credențialul Jira.

| Tip de credențial | Valoare expusă către `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Șir de token Bearer |
| Header | Linie completă `header key: header value`, gata de inserat într-un argument cURL `-H` |
| GitHub | Token de acces personal |
| Notion | `api_token` intern sau `access_token` OAuth (token Bearer pentru apeluri API Notion) |
| Sentry | Token de autentificare Sentry |
| Discord / Slack | URL Webhook |

Exemplu:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Utilizați **nodul** Notion pentru operațiuni native pe baze de date, pagini și blocuri. Utilizați `$credentials` atunci când o cerere [HTTP](../nodes/http-node.md) personalizată are nevoie de același token Bearer Notion.

## Crearea credențialelor din Chat

[AI Assistant](./ai-assistant.md#credentials), [fila Chat](../tabs/chat-tab.md) și [Chat with Heym](./chat-with-heym.md) pot crea un credențial atunci când un workflow are nevoie de unul sau oricând solicitați unul. Asistentul sugerează tipul și un nume, iar formularul obișnuit de credențial se deschide în conversație. Solicitați actualizarea unui credențial pe care îl dețineți și același formular se deschide pe acesta, cu secretele sale mascate. Asistentul vede doar numele și tipul. `heym_chat` prin [MCP](../tabs/mcp-tab.md) nu poate crea, actualiza sau alege credențiale.

## Resurse conexe

- [Credentials Tab](../tabs/credentials-tab.md) – Adăugarea, editarea, ștergerea credențialelor
- [GitHub Node](../nodes/github-node.md) – Operațiuni REST GitHub native
- [Jira Node](../nodes/jira-node.md) – Automatizarea proiectelor, tichetelor, comentariilor, atașamentelor, utilizatorilor, notificărilor și tranzițiilor Jira
- [Linear Node](../nodes/linear-node.md) – Automatizarea spațiilor de lucru și tichetelor Linear GraphQL
- [Notion Node](../nodes/notion-node.md) – Căutarea și gestionarea conținutului Notion
- [Sentry Node](../nodes/sentry-node.md) – Automatizarea organizațiilor, proiectelor, echipelor, tichetelor, evenimentelor și versiunilor Sentry
- [Credentials Sharing](./credentials-sharing.md) – Partajarea cu utilizatori și echipe
- [Third-Party Integrations](./integrations.md) – Ghid de configurare pentru fiecare tip de credențial
- [Expression DSL](./expression-dsl.md) – `$credentials` în expresii

## Model Router (Auto Model)

Un Model Router nu deține nicio cheie. Acesta deține un **credențial de model de decizie**, o listă de **opțiuni de model** — fiecare fiind un credențial OpenAI, Google sau Custom existent plus un model — și, pentru fiecare opțiune, text liber care indică când ar trebui utilizată acea opțiune.

Acesta apare în fiecare selector care oferă un model: nodurile [LLM](../nodes/llm-node.md) și [Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboards, constructorul de expresii și Data Tables. Singurul său model este **Auto**. Selectați-l, iar modelul de decizie citește fiecare cerere și o direcționează. [Evals](../tabs/evals-tab.md) îl omite, deoarece un eval compară modele specifice, iar un router își alege singur modelul.

Un agent redirecționează pe măsură ce bucla sa de instrumente avansează, astfel încât un model ieftin poate prelua primele ture, iar unul mai puternic tura care are nevoie de el. Intrările identice reutilizează decizia anterioară, astfel încât o buclă plătește pentru o decizie doar atunci când conversația s-a schimbat efectiv.

### Ce nu poate face

Auto Model nu poate fi combinat cu **Responses API**, **Batch mode** sau **image output**. Acele comutatoare se dezactivează singure atunci când este selectat un router, iar fiecare explică de ce. Verificările Guardrail și clasificatorul politicii de revizuire umană sunt apeluri fixe cu un singur model și nu sunt niciodată direcționate.
### Când rutarea eșuează

Marcați o opțiune **Use this option when routing fails** și o întrerupere a modelului de decizie nu va opri niciodată o execuție; se utilizează opțiunea de rezervă, iar motivul este înregistrat în cadrul execuției. În absența acesteia, nodul eșuează în loc să facă presupuneri.

### Vizualizarea traseului unei cereri

Traces afișează `Auto Model / GPT-5` în loc de modelul singular, iar costul rămâne atribuit modelului care a rulat efectiv. Execution Log și Span View din canvas afișează aceeași pereche, iar Span View enumeră care turn a mers unde.
