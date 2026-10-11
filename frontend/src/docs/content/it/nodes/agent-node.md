# Nodo Agent

Il nodo **AI Agent** è un nodo LLM con tool calling. Può eseguire tool Python, richiamare nodi collegati del canvas come tool, connettersi a server MCP, utilizzare skills, agire opzionalmente come orchestratore che delega ad altri nodi agent, richiamare altri workflow come tool e sospendersi per la [revisione umana](../reference/human-in-the-loop.md).

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1, più l'output opzionale `review` quando HITL è abilitato |
| Output | `$nodeLabel.text`, `$nodeLabel.fieldName` (quando l'output JSON è abilitato), oppure un payload HITL in sospeso durante l'attesa della revisione |

## Parametri principali

### Credenziale e modello

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale LLM (API key) dalle Impostazioni |
| `model` | string | Nome del modello (es. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opzionale) | Credenziale di fallback quando quella primaria non funziona |
| `fallbackModel` | string (opzionale) | Modello di fallback quando quello primario non funziona |

Aggiungere le credenziali nella scheda [Credenziali](../tabs/credentials-tab.md). L'elenco dei modelli viene caricato dalla credenziale selezionata. Se la credenziale o il modello primario restituisce un errore, il nodo ritenta automaticamente con la credenziale e il modello di fallback prima di fallire.

### Prompt

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt di sistema per l'IA. Supporta le [espressioni](../reference/expression-dsl.md). |
| `userMessage` | string | Messaggio/prompt utente. Predefinito: `$input.text` |
| `jsonOutputEnabled` | boolean | Output JSON strutturato |
| `jsonOutputSchema` | string | JSON Schema per l'output strutturato |
| `extraBodyEnabled` | boolean | Invia parametri di richiesta specifici del provider (predefinito: `false`) |
| `extraBody` | string | Oggetto JSON unito a ogni richiesta API effettuata dall'agent |

Utilizzare `$input.text`, `$nodeName.field` e altre sintassi dell'[Expression DSL](../reference/expression-dsl.md).

### Modelli di reasoning (o1, o3)

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (predefinito: 0.7), per i modelli standard |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profondità di reasoning per i modelli di reasoning |

Quando si utilizza un modello di reasoning (es. o1, o3), l'interfaccia mostra **Reasoning Effort** invece di Temperature. Per i modelli standard, **Temperature** controlla la creatività.

**Esempio di output JSON:** Quando occorre ottenere dati strutturati dall'agent (es. classificazione, estrazione), abilitare l'output JSON e fornire uno schema. L'agent restituisce JSON conforme allo schema; accedere ai campi per nome sull'output del nodo:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

I nodi a valle possono utilizzare `$agentLabel.status`, `$agentLabel.reason`, ecc. Stesso comportamento dell'output JSON del [nodo LLM](../nodes/llm-node.md).
## Human Review (HITL)

Utilizzare HITL quando un agente può richiedere un'approvazione in momenti specifici prima di azioni importanti.

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Aggiunge checkpoint di revisione umana all'agente |
| `hitlSummary` | string | Linee guida di approvazione che indicano all'agente quando è necessaria la revisione umana |

Quando HITL è abilitato, l'agente riceve uno strumento `request_human_review`. Utilizzare il system prompt e
questo campo di linee guida per spiegare quali chiamate di strumenti, sub-agenti, sub-workflow, azioni MCP, skill
o effetti collaterali richiedono approvazione. L'agente può chiamare tale strumento solo quando necessario, anche più
volte in una singola esecuzione.

Il riepilogo rivolto al revisore sulla pagina pubblica viene generato dalla richiesta di revisione dell'agente in
fase di esecuzione. Se l'agente non fornisce un riepilogo esplicito, Heym ne deriva uno dal corpo della revisione
in Markdown.

Per gli strumenti MCP, Heym chiede al modello di interpretare le istruzioni HITL scritte come uno di tre
ambiti: `always`, `once` o `never`. Ciò significa che formulazioni libere come "for each call", "only
one time" o "never ask" vengono normalizzate prima che venga applicato il gating in fase di esecuzione.

Ogni checkpoint HITL crea un link di revisione pubblica monouso su `/review/{token}`. Un revisore può:

- **Accept** il testo di revisione originale in Markdown
- **Edit & Continue** con Markdown modificato
- **Refuse** e continuare con `text: ""`

Quando HITL è abilitato, il nodo espone anche un handle di output `review` sul canvas. Collegare quel ramo a Slack, email o altri nodi di notifica se si desidera trasmettere l'URL di revisione e il riepilogo non appena l'esecuzione si mette in pausa.

L'esecuzione passa a `pending` finché un revisore non risponde. Il testo di revisione è un singolo corpo Markdown, e il payload in sospeso include anche il testo del link condivisibile per il passaggio esterno. I nodi sul ramo `review` vengono eseguiti immediatamente quando viene creata la pausa; il percorso di output normale prosegue solo dopo l'approvazione. Dopo l'approvazione, Heym riprende dallo snapshot di esecuzione memorizzato e l'agente continua con il contesto approvato. Se un passaggio successivo richiede anch'esso approvazione, l'agente può creare un altro checkpoint HITL. Consultare [Human-in-the-Loop](../reference/human-in-the-loop.md) per la struttura del payload, il comportamento dell'URL di revisione e la semantica di ripresa.

HITL è disponibile solo per l'output dell'agente in modalità testo. Nella v1 non può essere combinato con `jsonOutputEnabled`.


## Orchestrator Mode

Quando è abilitato, l'agente può delegare attività ad altri nodi agente nel workflow. Se la **modalità Orchestrator è disabilitata**, l'agente **non può creare connessioni agente→agente** nel canvas.

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Quando è `true`, l'agente riceve uno strumento `call_sub_agent` |
| `subAgentLabels` | string[] | Etichette dei nodi agente che questo orchestrator può chiamare |

I **sub-agenti** devono utilizzare `$input.text` nel loro User Message affinché ricevano il prompt dell'orchestrator.

Quando l'orchestrator chiama più sub-agenti in un singolo turno, questi vengono eseguiti in parallelo. Consultare [Agent Architecture](../reference/agent-architecture.md) per i dettagli.

## Sub-Workflows

Quando configurato, l'agente riceve uno strumento `call_sub_workflow` per eseguire altri workflow.

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID dei workflow che questo agente può chiamare come strumenti |

Selezionare i workflow nella sezione Sub-Workflows della configurazione dell'agente. L'agente li chiamerà con `workflow_id` e `inputs` (oggetto corrispondente ai campi di input del workflow di destinazione). Profondità massima: 5 chiamate di sub-workflow annidate.

## Canvas Node Tools

È possibile collegare un nodo workflow supportato all'handle **tools** di un agente affinché l'agente possa chiamare quel nodo in fase di esecuzione. Questo trasforma azioni e trasformazioni esistenti del canvas in strumenti richiamabili senza scrivere Python.

Utilizzare i canvas node tools quando si desidera che l'agente decida quando eseguire un nodo configurato, mantenendo al contempo credenziali, campi statici e impostazioni specifiche del workflow nella UI del nodo.

### Campi forniti dall'agente

I campi su un nodo strumento collegato possono essere contrassegnati con l'icona del bot. I campi contrassegnati diventano parametri obbligatori dello strumento che l'agente deve fornire quando chiama il nodo. I campi non contrassegnati rimangono fissi e vengono letti dalla configurazione del nodo.

Ad esempio:

- Collegare un nodo Slack a un agente come strumento
- Mantenere la credenziale fissa nel nodo Slack
- Contrassegnare `message` come fornito dall'agente
- L'agente riceve uno strumento Slack in cui fornisce solo il messaggio in fase di esecuzione

Se il nodo non è collegato a un agente come strumento, l'icona del bot è nascosta e il nodo si comporta come un normale passaggio del workflow.
### Comportamento di runtime

Quando l'agente richiama lo strumento di un nodo del canvas, Heym unisce temporaneamente gli argomenti forniti dall'agente ai dati di quel nodo, esegue il nodo, restituisce l'output del nodo all'agente, quindi ripristina la configurazione originale del nodo. I nodi strumento non vengono eseguiti come normali passaggi del workflow tramite la pianificazione ordinaria; vengono eseguiti solo quando l'agente li richiama.

Gli strumenti basati sui nodi del canvas sono utili con nodi di integrazione quali Slack, Telegram, HTTP, Send Email e nodi di trasformazione dei dati come [Set](./set-node.md). I nodi Trigger, i nodi di controllo del flusso e i mapper di output terminale ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) non possono essere utilizzati come strumenti dell'agente.

## Strumenti Python

Definire strumenti personalizzati che l'agente può richiamare. Ogni strumento presenta:

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `name` | string | Nome dello strumento (es. `count_characters`) |
| `description` | string | Descrizione per l'LLM |
| `parameters` | JSON Schema | Schema di function-calling OpenAI (formato oggetto) |
| `code` | string | Codice della funzione Python |

**Parameters** deve essere un oggetto JSON, non una stringa:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Strumento di esempio:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Gli strumenti Python vengono eseguiti come codice non attendibile in un container Docker isolato e rafforzato per impostazione predefinita (nessuna rete, nessun socket Docker, filesystem in sola lettura, utente non root). Le importazioni sono limitate a un elenco di moduli della libreria standard considerati sicuri. Consultare [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) per la configurazione (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Numero massimo di secondi per l'esecuzione di uno strumento (predefinito: 30) |
| `requestTimeoutSeconds` | number | Numero massimo di secondi di attesa per ciascuna risposta del modello prima del timeout (predefinito: 60). Aumentare questo valore per provider lenti o self-hosted (LiteLLM, vLLM, modelli locali) e per esecuzioni lunghe a più passaggi. |
## Connessioni MCP

Consentono di collegarsi ai server [Model Context Protocol](https://modelcontextprotocol.io/) per esporre i relativi strumenti all'agente.

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Tipo di connessione |
| `timeoutSeconds` | number | Timeout per questa connessione (predefinito: 30) |
| `label` | string | Nome visualizzato opzionale |

**stdio** (processo locale):

| Campo | Descrizione |
|-------|-------------|
| `command` | Comando da eseguire (es. `npx`) |
| `args` | Array JSON (es. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Oggetto JSON delle variabili d'ambiente iniettate nel processo (es. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

La maggior parte dei server stdio basati su API key si autentica tramite variabili d'ambiente anziché argomenti del comando. Impostare `env` per singola connessione in modo che ciascun nodo agente possa utilizzare una credenziale diversa senza intervenire sull'ambiente host.

I valori di `env` supportano [Expression DSL](../reference/expression-dsl.md), consentendo di passare input del workflow come credenziali anziché codificare i segreti in modo statico:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

L'espressione `$userInput.pat` viene risolta a runtime rispetto ai dati di input del workflow prima dell'avvio del processo MCP. Ciò consente di accettare token da un trigger o da un nodo di input anziché incorporarli nella definizione del workflow.

Esempio — GitHub MCP con token statico:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Esempio — GitHub MCP con token dinamico dall'input del workflow:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Esempio — GitHub MCP con una credenziale GitHub di Heym:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

La credenziale GitHub integrata attualmente supporta l'autenticazione basata su PAT. Qualora sia necessario l'accesso a livello di organizzazione, utilizzare un PAT con i permessi richiesti per l'organizzazione o il repository.

Esempio — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (server remoto):

| Campo | Descrizione |
|-------|-------------|
| `url` | URL dell'endpoint SSE. Supporta espressioni (es. `$userInput.serverUrl`). |
| `headers` | Oggetto JSON per header di autenticazione o personalizzati. I valori supportano espressioni. |

**Streamable HTTP** (server remoto):

| Campo | Descrizione |
|-------|-------------|
| `url` | URL dell'endpoint MCP (es. `https://example.com/mcp`). Supporta espressioni. |
| `headers` | Oggetto JSON per header di autenticazione o personalizzati. I valori supportano espressioni. |

## Skills

Le Skills sono istruzioni contenute in SKILL.md, con eventuali file Python opzionali e asset inclusi. Estendono il contesto di sistema dell'agente e possono aggiungere strumenti Python.

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `name` | string | Nome della skill |
| `content` | string | Contenuto di SKILL.md (istruzioni) |
| `timeoutSeconds` | number | Timeout per l'esecuzione Python della skill (predefinito: 30) |
| `driveFilesEnabled` | boolean | Abilita l'helper `heym_drive` a runtime per questa skill (predefinito: false) |
| `files` | array | Voci opzionali `{ path, content, encoding, mimeType }` (es. script `.py` o asset binari memorizzati come base64) |

Le Skills possono essere aggiunte trascinando un file `.zip` o `.md` nell'area Skills.
Dopo aver espanso la scheda di una skill, è possibile trascinare qualsiasi file su quella skill per allegare o sostituire un file incluso, compresi asset binari come PDF e immagini.
Utilizzare il pulsante di download sulla scheda di una skill per esportarla come archivio `.zip` a fini di backup o riutilizzo in un altro workflow.

Abilitare **Drive files** su una skill solo quando il relativo codice Python deve leggere file da Heym Drive. Le skill abilitate ricevono a runtime un helper `heym_drive.py` generato e possono invocare `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` o `read_drive_base64` con un id di file Drive o un nome file esatto. La ricerca per nome file utilizza la corrispondenza accessibile più recente. Le skill disabilitate non ricevono l'helper.

Ciascuna scheda di skill presenta quattro azioni nella riga sottostante il titolo:

| Pulsante | Descrizione |
|----------|-------------|
| **Edit with AI** | Apre Skill Builder per revisionare la skill a partire da un prompt in chat |
| **Download** | Esporta la skill come archivio `.zip` |
| **Remove** | Elimina la skill da questo nodo agente |
| **History** | Apre la cronologia della skill derivata da [Edit History](../reference/edit-history.md) |
### Cronologia delle skill

La cronologia delle skill **non** viene memorizzata separatamente. È derivata dagli snapshot della Cronologia delle modifiche del workflow: ogni versione salvata del workflow include l'array completo `skills` del nodo agente.

Dalla finestra di dialogo Cronologia è possibile:

- **Anteprima** di uno snapshot precedente (SKILL.md ed elenco dei file)
- **Modifica** — caricare uno snapshot nell'editor delle skill senza ripristinare l'intero workflow
- **AI Fine-tune** — aprire Skill Builder con quello snapshot come punto di partenza
- **Ripristina** — ripristinare solo questa skill da una versione precedente (gli altri nodi rimangono invariati)

La Cronologia segue la stessa conservazione di 7 giorni della Cronologia delle modifiche del workflow. Il salvataggio del workflow dopo le modifiche alle skill crea nuove voci nella cronologia.

La sezione Skills include anche **AI Build**:

- Fare clic su **AI Build** per creare una nuova skill da un prompt in chat
- Fare clic sul pulsante scintilla su una skill esistente per revisionarla con l'IA
- Trascinare i file nel compositore del prompt per allegarli al commento di fine-tune; tali file vengono anche salvati come asset della skill inclusi nel pacchetto
- La finestra modale trasmette in streaming il testo dell'assistente mostrando in tempo reale le anteprime dei file `SKILL.md` e `.py`
- **Download ZIP** esporta l'anteprima corrente senza aggiungerla al nodo
- **Save & Add** salva i file generati attraverso lo stesso flusso di analisi ZIP utilizzato per i caricamenti manuali

Durante la modifica con l'IA, Heym invia al builder solo i file di skill testuali `.md` e `.py`. Gli allegati binari e gli altri allegati non modificabili vengono preservati e condivisi con il builder come metadati di percorso, in modo che il codice Python generato possa mantenere corretti i riferimenti relativi ai file.
Selezionare un file allegato nel pannello di destra e abilitare **Include this file in AI context** quando l'IA deve ispezionare un modello incluso nel pacchetto. I file di testo, PDF e DOCX vengono estratti nel contesto del prompt quando possibile; Heym non applica un limite separato di dimensione degli allegati di Skill Builder oltre al limite del corpo della richiesta della piattaforma.

## Extra Body

Alcuni provider accettano parametri di richiesta che i campi standard compatibili con OpenAI non
coprono, come la disattivazione della modalità di pensiero di un modello. Selezionare **Send extra request body** nelle proprietà del nodo
e inserire un oggetto JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Disabilitato per impostazione predefinita.** Con la casella di controllo deselezionata, non viene inviato nulla di aggiuntivo.
- Applicato a **ogni** richiesta nel ciclo di chiamata degli strumenti, non solo al primo turno, oltre al
  tentativo con il modello di fallback. Non applicato ai controlli dei guardrail, che utilizzano un modello separato.
- Deve essere un **oggetto** JSON. Un array, uno scalare o un testo malformato fanno fallire il nodo con
  `Invalid extra body JSON` anziché essere ignorati silenziosamente.
- Le espressioni `$` vengono risolte prima dell'analisi. Poiché si tratta di sostituzione testuale, un valore risolto
  contenente un doppio apice o un carattere di nuova riga produce JSON non valido e fa fallire il nodo.

Stesso campo e stesso comportamento dell'extra body del [nodo LLM](./llm-node.md).

## Guardrail

Abilitare **Guardrails** nelle proprietà del nodo per bloccare i messaggi utente non sicuri prima dell'esecuzione dell'agente. Consultare [Guardrails](../reference/guardrails.md) per il riferimento completo.

## Memoria persistente (grafo)

Grafo di conoscenza opzionale **per singolo nodo agente** memorizzato nel database. Quando abilitato, Heym aggiunge un riepilogo Markdown delle entità e delle relazioni memorizzate alle **istruzioni di sistema** prima di ogni esecuzione (solo se il grafo non è vuoto). Dopo il completamento **positivo** dell'agente, un processo in background estrae nuovi fatti durevoli dalla conversazione e li unisce al grafo.

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Abilita il caricamento + l'estrazione in background per questo nodo del canvas |

I **sub-agenti** mantengono il **proprio** grafo (identificato dal loro node id), separato da quello dell'orchestratore.

Utilizzare il controllo rosa **brain** sul nodo (quando la memoria è attiva o la riga del modello è visualizzata) per aprire l'editor del grafo e l'opzionale **condivisione della memoria** (altri workflow/agenti). Comportamento completo, percorsi REST e dettagli sull'esportazione JSON: [Memoria persistente dell'agente](../reference/agent-persistent-memory.md).
## API Responses e continuità del ragionamento

Una casella di controllo **Use Responses API** indirizza le chiamate al modello dell'agente attraverso la
[Responses API](https://platform.openai.com/docs/api-reference/responses) anziché Chat
Completions. È disattivata per impostazione predefinita.

Risulta particolarmente rilevante su un modello di ragionamento come `gpt-5` o la serie `o`. La Responses API restituisce
il ragionamento del modello insieme a ciascuna chiamata di strumento, e l'agente rimanda tali elementi di ragionamento
al turno successivo, così il modello mantiene la propria catena di pensiero attraverso un ciclo multi-step di strumenti
anziché ridefinirla dopo ogni risultato di strumento. L'intero ciclo viene eseguito sullo stesso percorso, inclusi
la pausa e la ripresa della [revisione umana](#human-review-hitl), la [compressione del contesto](#context-compression)
e la risposta finale.

La conversazione stessa rimane in Heym. Heym invia l'input completo a ogni turno e trasporta il
ragionamento come blob cifrato, pertanto nulla viene conservato lato provider tra una chiamata e l'altra.
Gli elementi di ragionamento all'interno di uno span che la compressione del contesto riassume vengono eliminati insieme ad esso, poiché
un blob cifrato non può essere riassunto.

Funziona con una credenziale OpenAI e con una credenziale personalizzata il cui gateway supporta
l'endpoint. Con una credenziale Google rimane disattivata.

## Compressione del contesto

Quando un agente esegue molte iterazioni di strumenti con risultati di grandi dimensioni (web scraping, letture di documenti, output di sub-workflow), la cronologia dei messaggi accumulata può avvicinarsi al limite della finestra di contesto del modello. Heym comprime automaticamente la cronologia della conversazione durante l'esecuzione per prevenire l'overflow del contesto.

**Come funziona:**

1. Prima di ogni iterazione di strumenti, Heym stima il conteggio attuale dei token (~4 caratteri per token).
2. Se la stima supera l'**80%** della finestra di contesto del modello, viene attivata la compressione.
3. La cronologia dei messaggi viene suddivisa in sezioni conservate e compresse:
   - **Conservate**: prompt di sistema, primo messaggio utente, messaggio utente più recente
   - **Compresse**: tutto ciò che sta in mezzo (turni di ragionamento dell'assistente, chiamate di strumenti, risultati di strumenti)
4. La sezione intermedia viene riassunta utilizzando lo **stesso modello e la stessa credenziale** — nessuna configurazione aggiuntiva necessaria.
5. Il riassunto compresso sostituisce la parte intermedia come singolo messaggio dell'assistente.

**Osservabilità:**

Gli eventi di compressione compaiono come voci `Context compressed (N messages → summary)` in:
- L'elenco delle chiamate di strumenti nel **Debug panel** durante l'esecuzione in tempo reale
- La vista di dettaglio dell'esecuzione nella **Cronologia delle esecuzioni**
- La **scheda Traces** come voce di trace `context.compression`

La compressione è automatica e sempre attiva per i nodi Agent. **Non** si applica ai nodi LLM, alla scheda Chat o alle sessioni dell'AI Assistant.

## Correlati

- [Perché Heym](../getting-started/why-heym.md) – Come gli agenti vengono eseguiti e rimangono governati in produzione
- [Memoria persistente dell'agente](../reference/agent-persistent-memory.md) – Grafo di conoscenza per nodo Agent, condivisione opzionale, API, editor
- [Architettura dell'agente](../reference/agent-architecture.md) – Sub-agenti, orchestratore, competenze, MCP, chiamata di strumenti
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Pagine di revisione pubbliche, esecuzioni in sospeso, flusso di approvazione/modifica/rifiuto
- [Guardrail](../reference/guardrails.md) – Blocca categorie di contenuti non sicuri
- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [AI Assistant](../reference/ai-assistant.md) – Interfaccia Chat per costruire workflow con linguaggio naturale (distinta dal nodo Agent)
- [Expression DSL](../reference/expression-dsl.md) – Riferimento ai dati nei prompt
- [Struttura del workflow](../reference/workflow-structure.md) – Nodi, archi e formato DSL
- [Guida rapida](../getting-started/quick-start.md) – Workflow di base con LLM ed espressioni
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere chiavi API per l'agente
- [Scheda MCP](../tabs/mcp-tab.md) – Configurare MCP per gli strumenti del workflow
