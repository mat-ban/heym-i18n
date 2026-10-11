# Filă Credentials

Fila **Credentials** gestionează cheile API și secretele utilizate de noduri. Adăugați credențiale aici și faceți referire la ele prin nume în nodurile workflow-ului. Pentru o prezentare generală a ceea ce sunt credențialele și modul în care nodurile le utilizează, consultați [Credentials](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

## Tipuri de credențiale

| Tip | Caz de utilizare |
|------|----------|
| **OpenAI** | Cheie API OpenAI pentru noduri LLM, Agent și RAG |
| **Google** | Cheie API Google AI (Gemini) |
| **GitHub** | Token de acces personal GitHub (PAT) pentru GitHub API, workflow-uri cu nod GitHub, servere MCP și workflow-uri cu agenți; `base_url` opțional pentru GitHub Enterprise |
| **Linear** | Cheie API personală Linear sau OAuth2 pentru echipe, proiecte, probleme și comentarii |
| **Notion** | Token de integrare internă sau autorizare de workspace OAuth pentru integrare publică |
| **Custom** | Endpoint-uri LLM personalizate |
| **Bearer** | Token Bearer pentru autentificare HTTP |
| **Header** | Pereche cheie-valoare de header personalizat pentru cereri HTTP |
| **Telegram** | Token de bot Telegram și secret webhook opțional |
| **Slack** | URL de webhook incoming Slack |
| **Discord** | URL de webhook incoming Discord |
| **Discord Trigger** | Cheie publică de aplicație Discord |
| **IMAP** | Credențiale pentru trigger de căsuță poștală de intrare |
| **SMTP** | Credențiale pentru trimiterea de e-mailuri |
| **Redis** | Conexiune Redis |
| **RAG: Qdrant + OpenAI** | Vector store pentru noduri RAG, susținut de un server Qdrant extern |
| **RAG: Psql + OpenAI** | Vector store pentru noduri RAG, susținut de baza de date Postgres proprie Heym (pgvector) — fără serviciu extern |
| **RAG: Custom Embeddings** | Vector store pentru noduri RAG care utilizează orice endpoint de embeddings compatibil OpenAI, cu Qdrant sau Postgres (pgvector) ca store |
| **Cohere** | API Cohere pentru embeddings |

## Adăugarea credențialelor

1. Faceți clic pe **Add Credential**
2. Alegeți tipul de credențial
3. Introduceți valorile necesare (cheie API, URL etc.)
4. Acordați-i un nume pentru referință în noduri

Pentru GitHub, fluxul actual de credențiale se bazează pe PAT. Sunt recomandate PAT-urile cu permisiuni granulare. Fluxurile de instalare GitHub App nu sunt de primă clasă în interfața actuală. Dacă utilizați GitHub Enterprise Server, puteți seta și un URL de bază opțional pentru GitHub API, cum ar fi `https://github.example.com/api/v3`.

Pentru Linear, alegeți **Personal API key** sau **OAuth2** în dialog. Cheile API personale sunt create
în **Settings → Security & Access → Personal API keys** în Linear. OAuth2 utilizează un Client ID și
Client Secret de aplicație OAuth Linear, cu `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
înregistrat ca URI de redirecționare. Credențialul acționează cu permisiunile utilizatorului Linear care
l-a creat sau autorizat. Utilizați **Test Connection** în dialogul de credențiale pentru a verifica cheia API sau
tokenul OAuth înainte de salvare.

Pentru **Notion**, alegeți **Internal token** sau **OAuth** în dialog. OAuth utilizează Client ID și
Client Secret din integrarea publică Notion; Heym le stochează criptat în credențial.
Utilizați **Test Connection** pentru a verifica credențialele Supabase, Linear sau Notion înainte de a salva un workflow. Consultați
[Third-Party Integrations](../reference/integrations.md#notion) pentru detalii despre configurarea Notion.

Credențialele OAuth deschid pagina de autorizare a furnizorului într-o fereastră popup. Dacă browserul o blochează, utilizați linkul **Open the authorization page** de sub butonul Connect; dialogul detectează când conexiunea se finalizează. Odată ce un credențial nou este conectat, butonul afișează **Connected**.

## Editare și ștergere

- **Edit** – Actualizați valorile credențialului (valorile sensibile sunt mascate)
- **Delete** – Eliminați un credențial; workflow-urile care îl utilizează vor avea nevoie de un înlocuitor

La editarea unui credențial **GitHub** pe GitHub Enterprise Server, lăsarea câmpului opțional **GitHub
API Base URL** gol păstrează endpoint-ul Enterprise existent. Introduceți un URL nou doar când
doriți să modificați acel endpoint.

## Partajare

- [Partajați credențiale](../reference/credentials-sharing.md) cu alți utilizatori prin e-mail sau cu [Teams](../reference/teams.md)
- Credențialele partajate apar cu un indicator
- Revocați partajarea din meniul cardului de credențial
## Utilizarea în noduri

Faceți referire la credențiale prin nume în configurația nodului. De exemplu:
- [Nod LLM](../nodes/llm-node.md) – Selectați credențialul pentru API-ul modelului
- [Nod HTTP](../nodes/http-node.md) – Utilizați credențiale Bearer sau Header pentru autentificare
- [Nod Agent](../nodes/agent-node.md) – Transmiteți tokenuri GitHub în variabilele de mediu ale serverului MCP, precum `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Nod GitHub](../nodes/github-node.md) – Executați operațiuni native pe repository, utilizator, issue, review, release, workflow, trafic și fișiere GitHub
- [Nod Linear](../nodes/linear-node.md) – Citiți metadatele spațiului de lucru și automatizați issue-urile și comentariile Linear
- [Nod Notion](../nodes/notion-node.md) – Gestionați bazele de date, sursele de date, paginile și blocurile Notion
- [Nod RAG](../nodes/rag-node.md) – Utilizați un credențial Qdrant sau Postgres (pgvector) pentru vector store
- [Nod Telegram Trigger](../nodes/telegram-trigger-node.md) – Primiți webhook-uri de la botul Telegram
- [Nod Telegram](../nodes/telegram-node.md) – Trimiteți mesaje prin botul Telegram
- [Nod Discord Trigger](../nodes/discord-trigger-node.md) – Primiți webhook-uri de interacțiune Discord
- [Nod Discord](../nodes/discord-node.md) – Trimiteți mesaje prin webhook Discord
- [Nod IMAP Trigger](../nodes/imap-trigger-node.md) – Interogați o căsuță poștală partajată pentru emailuri noi

Consultați [Expression DSL](../reference/expression-dsl.md) pentru referirea valorilor bazate pe credențiale în expresii.

## Resurse conexe

- [Integrări terțe](../reference/integrations.md) – Ghid detaliat de configurare pentru fiecare tip de credențial (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack și altele)
- [Partajarea credențialelor](../reference/credentials-sharing.md) – Partajați credențiale cu alți utilizatori
- [Securitate](../reference/security.md) – Criptare în repaus, gestionarea sesiunilor, limitarea ratei
- [Tipuri de noduri](../reference/node-types.md) – Noduri care utilizează credențiale ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Fila Vectorstores](./vectorstores-tab.md) – Utilizează credențiale Qdrant sau Postgres (pgvector)
- [Fila Chat](./chat-tab.md) – Utilizează credențiale OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid compact de pagină pentru suprafețele dashboard-ului
