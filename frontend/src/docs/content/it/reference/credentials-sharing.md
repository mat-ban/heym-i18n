# Condivisione delle Credenziali

Le Credenziali possono essere condivise con altri utenti affinché i loro workflow possano utilizzare le Sue chiavi API. Per una panoramica, consultare [Credenziali](./credentials.md); per l'aggiunta e la gestione delle credenziali, consultare [Scheda Credenziali](../tabs/credentials-tab.md).

## Condivisione delle Credenziali con un LLM

Per consentire a un LLM o a un agente IA di utilizzare una chiave API, memorizzare la chiave come credenziale e lasciare che il nodo che effettua la richiesta la associ. Il modello decide cosa invocare; il nodo autentica la chiamata al momento dell'esecuzione.

- **Memorizzare il segreto come credenziale.** I valori sensibili sono cifrati a riposo e mascherati nell'interfaccia utente dopo la creazione.
- **Farvi riferimento nel punto in cui viene effettuata la richiesta.** I nodi [LLM](../nodes/llm-node.md) e [Agent](../nodes/agent-node.md) selezionano la credenziale del modello tramite ID, mentre le richieste HTTP inseriscono `$credentials.CredentialName` nell'header di autenticazione. Tenere i segreti al di fuori dei campi prompt, poiché tutto ciò che è contenuto in un prompt viene inviato al provider del modello come testo.
- **Fornire all'agente strumenti, non chiavi.** Quando un Agent richiama un nodo HTTP, un server MCP o un sub-workflow come strumento, la credenziale viene applicata all'interno di tale strumento e il modello riceve il risultato dello strumento.
- **Gli output sono mascherati.** Quando un valore di credenziale più lungo di sette caratteri compare nell'output di un nodo, vengono mantenuti solo i primi sette caratteri; pertanto, una risposta che riporta una chiave mostra solo tale prefisso nei risultati e nelle esecuzioni. Consultare [Mascheramento dell'Output](#output-masking).
- **Consentire all'assistente di creare credenziali.** Quando l'[Assistente IA](./ai-assistant.md#credentials) o la scheda Chat crea una credenziale, vede soltanto il nome e il tipo; il segreto viene inserito da Lei nel modulo di credenziale standard.
- **Condividere con le persone allo stesso modo.** Condivida la credenziale con un utente o un team, come descritto di seguito, e i loro workflow potranno utilizzare la Sua chiave attraverso i rispettivi nodi LLM e Agent.

## Modello di Condivisione

- **CredentialShare** – Collega `credential_id` a `user_id` (univoco per coppia)
- **Condivisione tramite email** – `POST /api/credentials/{credential_id}/shares` con email; l'utente viene individuato e aggiunto
- **Revoca** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

È inoltre possibile condividere le credenziali con i [Team](./teams.md):

- **CredentialTeamShare** – Collega `credential_id` a `team_id`; tutti i membri del team ottengono l'accesso
- **Condivisione con team** – `POST /api/credentials/{credential_id}/team-shares` con `team_id`
- **Revoca condivisione team** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Le credenziali condivise mostrano un indicatore nell'interfaccia della [Scheda Credenziali](../tabs/credentials-tab.md).

## Credenziali ad Ampio Spettro

La condivisione di una credenziale concede al destinatario tutto ciò che tale credenziale è in grado di fare. Per la maggior parte delle integrazioni, ciò è limitato a un workspace o ai permessi di una singola chiave API, ma alcune credenziali hanno una portata ben più ampia.

> **Le credenziali Google Drive concedono l'accesso completo a Drive.** La credenziale [Google Drive](../nodes/google-drive-node.md) è autorizzata con lo scope `https://www.googleapis.com/auth/drive`, affinché il nodo possa operare sui file di cui Lei è già proprietario. Condividerla con un utente o un team conferisce a ciascuno di essi la capacità di **leggere, modificare ed eliminare in modo permanente qualsiasi elemento del Suo Google Drive** tramite un workflow — non soltanto i file a cui aveva pensato. La condivida esclusivamente con persone a cui concederebbe direttamente l'accesso completo a Drive.

Qualora sia necessario limitare l'esposizione, crei un account Google dedicato con accesso unicamente alle cartelle richieste dal workflow e colleghi la credenziale a tale account anziché a quello principale.

Una credenziale **Decision Model** contiene l'endpoint e, se impostata, una chiave API. Condividerla consente al destinatario di utilizzare tale chiave da qualsiasi workflow possa eseguire, esattamente come una credenziale LLM.

Una credenziale **Model Router** condivide tutto ciò verso cui effettua il routing. Le persone con cui la condivide possono eseguire richieste verso ogni credenziale presente nel suo elenco di opzioni, e tali richieste consumano le Sue chiavi. Non possono leggere le chiavi e le credenziali non compaiono nel loro elenco personale di credenziali.

Si tratta della stessa concessione della condivisione diretta di una credenziale OpenAI, ed è ciò che rende utile un router per un team. Qualora non lo desideri, condivida le singole credenziali e lasci che ciascuno selezioni il proprio modello.

## Condivisione con i Collaboratori del Workflow

Quando condivide un workflow, i collaboratori possono aprirlo ed eseguirlo, ma non possono utilizzare le Sue credenziali a meno che Lei non condivida tali credenziali anche con loro. Ciò vale per le credenziali nel workflow principale e in qualsiasi sub-workflow da esso richiamato. Condivida ciascuna credenziale con gli stessi utenti o team che ha invitato al workflow. I sub-workflow devono inoltre essere condivisi separatamente dall'editor del workflow figlio. Consultare [Organizzazione dei Workflow](./workflow-organization.md#sharing-workflows).
## Contesto di esecuzione

Quando un workflow viene eseguito, le credenziali vengono risolte per il **proprietario del workflow** (o per l'utente corrente al momento dell'esecuzione). `get_credentials_context()` unisce:

1. **Credenziali possedute** – `Credential.owner_id == user_id`
2. **Credenziali condivise con l'utente** – `CredentialShare` dove `CredentialShare.user_id == user_id`
3. **Credenziali condivise con il team** – `CredentialTeamShare` dove l'utente è membro del team

Tutte vengono unite in un unico dizionario di contesto indicizzato per nome della credenziale.

## Utilizzo nei workflow

### Per nome (Expression DSL)

Le credenziali sono esposte come `$credentials.CredentialName` nella [Expression DSL](./expression-dsl.md). Utilizzare questa modalità per:

- Nodi HTTP (autenticazione Bearer/Header)
- Nodi Telegram
- Nodi Slack
- Token bearer Notion nelle richieste HTTP personalizzate (token interno o access token OAuth)
- Qualsiasi nodo che accetta espressioni per l'autenticazione

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Per ID (credentialId)

Alcuni nodi memorizzano `credentialId` (UUID) in `node.data`:

| Tipo di nodo | Campo | Descrizione |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Credenziale API LLM |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Credenziale access token Codex e credenziale GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Credenziale gateway OpenCode Go e credenziale GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Credenziale email/API token Jira Cloud o username/password Data Center |
| [Notion](../nodes/notion-node.md) | `credentialId` | Credenziale token interno Notion o workspace OAuth |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Token di autenticazione Sentry e base URL opzionale |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL progetto Supabase e chiave API |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Dettagli di connessione ClickHouse (host, porta, autenticazione, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Credenziale bot Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Credenziale chiave pubblica Discord o webhook |
| Vector Store | `credential_id` | Vector DB Qdrant o Postgres (pgvector), tramite una credenziale RAG Qdrant, Psql o Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Credenziale modello; una credenziale modello o Decision Model per il giudice LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) step AI | `credentialId` | Modello LLM/Vision (per lo step AI e [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

L'executor carica la credenziale direttamente dal database tramite ID e decripta la configurazione.

## Mascheramento dell'output

Dopo l'esecuzione, `mask_sensitive_output()` maschera i valori delle credenziali negli output, mantenendo i primi sette caratteri di ogni segreto più lungo di sette caratteri e sostituendo il resto con `**`, in modo che i segreti non siano esposti nei risultati o nelle esecuzioni.

## Correlati

- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere e condividere credenziali
- [Integrazioni di terze parti](./integrations.md) – Configurazione dettagliata per ciascun tipo di credenziale
- [Team](./teams.md) – Condivisione con i team
- [Expression DSL](./expression-dsl.md) – Sintassi `$credentials`
- [Tipi di nodo](./node-types.md) – Nodi che utilizzano credenziali ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Nodo Agent](../nodes/agent-node.md) – Utilizza `credentialId` per LLM
