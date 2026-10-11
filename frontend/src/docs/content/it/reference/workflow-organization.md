# Organizzazione dei Workflow

Heym consente di organizzare i workflow in cartelle, creare sotto-cartelle e pianificare l'eliminazione dei workflow. Per una panoramica dell'interfaccia, consultare [Workflows Tab](../tabs/workflows-tab.md).

## Cartelle e sotto-cartelle

Le cartelle formano una struttura ad albero. Ogni cartella presenta:

- **Name** – Nome visualizzato
- **Parent** – `parent_id` rimanda a un'altra cartella; `null` indica la radice
- **Workflows** – I workflow possono essere spostati all'interno delle cartelle tramite `folder_id`

### API

| Endpoint | Scopo |
|----------|---------|
| `GET /folders` | Solo cartelle radice |
| `GET /folders/tree` | Albero completo (figli + workflow) |
| `GET /folders/{id}` | Singola cartella con il relativo contenuto |
| `POST /folders` | Crea una cartella (`parent_id` opzionale) |
| `PUT /folders/{id}` | Aggiorna il nome o `parent_id` |
| `DELETE /folders/{id}` | Elimina la cartella (a cascata) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Sposta il workflow nella cartella |
| `DELETE /folders/workflows/{workflow_id}/folder` | Rimuove il workflow dalla cartella |
| `GET /folders/{id}/export` | Scarica la cartella e tutte le sotto-cartelle come ZIP |

### Struttura ad albero

La risposta dell'albero include `children` e `workflows` per ciascuna cartella. I workflow condivisi possono comparire in una cartella tramite `WorkflowShare.folder_id`.

## Condivisione dei Workflow

Aprire **Share** nell'editor del workflow per invitare utenti tramite email o condividere con un [team](./teams.md). Ogni invito e ogni condivisione con un team comporta un'autorizzazione:

| Autorizzazione | Cosa può fare il collaboratore |
|------------|------------------------------|
| **Read** | Aprire il workflow, esaminarlo, visualizzare la cronologia delle esecuzioni ed eseguirlo. L'editor si apre in modalità di sola lettura: Save è disabilitato e il canvas non può essere modificato. |
| **Write** | Tutto ciò che consente Read, più la modifica del canvas, delle impostazioni, del documento di analisi e della memoria dell'agente. |

L'autorizzazione è mostrata accanto a ogni voce nella finestra di dialogo Share e può essere modificata in qualsiasi momento da quel menu a discesa, senza rimuovere e riaggiungere la condivisione. Quando un utente raggiunge un workflow attraverso più percorsi (una condivisione diretta e uno o più team), prevale l'autorizzazione **più elevata**. Le condivisioni esistenti prima dell'introduzione delle autorizzazioni sono **Write**, e i client API che omettono `permission` ottengono anch'essi **Write**.

Le azioni riservate al proprietario non dipendono mai dall'autorizzazione: l'eliminazione di un workflow, il ripristino o la cancellazione delle versioni, la cancellazione della cronologia, la gestione delle condivisioni e le [impostazioni riservate al proprietario](#impostazioni-riservate-al-proprietario) di seguito restano di competenza del proprietario anche per i collaboratori con **Write**. Un collaboratore con **Read** che invia una modifica tramite l'API (`PUT /api/workflows/{id}`, la nota di analisi, la memoria dell'agente, la cancellazione della cache) o tramite l'AI Assistant riceve `403` con `You have read-only access to this workflow`.

La condivisione di un workflow concede l'accesso al canvas, alla cronologia delle esecuzioni e al documento di analisi. **Non** condivide automaticamente:

- Le **Credenziali** referenziate dai nodi nel workflow
- I **sotto-workflow** richiamati dai nodi [Execute](../nodes/execute-node.md) o dagli agenti

I destinatari devono disporre di tali credenziali e dei workflow figli condivisi separatamente (stessi utenti o team). Condividere le credenziali dalla [Credentials tab](../tabs/credentials-tab.md); consultare [Credentials Sharing](./credentials-sharing.md). Condividere ciascun sotto-workflow dalla relativa finestra di dialogo di condivisione dell'editor.

### Impostazioni riservate al proprietario

L'intera configurazione **Run with cURL** resta di competenza del proprietario dopo la condivisione. I collaboratori possono comunque aprire la finestra di dialogo e copiare il comando generato, ma i controlli sono di sola lettura.

La modifica di uno qualsiasi di questi elementi da parte di un non proprietario viene rifiutata con `403`:

- **Authentication** (`auth_type`) e **Header Key** (`auth_header_key`)
- Modalità **Request Body** (`webhook_body_mode`) e **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) e **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) si comporta diversamente: è completamente nascosto ai collaboratori e una scrittura da parte di un collaboratore viene ignorata anziché rifiutata. L'editor mostra il campo mascherato, quindi un `403` in quel punto interromperebbe un normale salvataggio anziché segnalare un attacco.

L'autenticazione è il motivo per cui il blocco è riservato al proprietario: `Anonymous` consente a chiamanti non autenticati di eseguire il workflow, e un'esecuzione senza un chiamante autenticato risolve le credenziali e le variabili globali come il **proprietario**, non come il chiamante. Il resto del blocco costituisce il contratto della richiesta pubblicata e i controlli sui costi del proprietario, quindi si sposta insieme ad esso.

**On error, run workflow** (`error_workflow_id`) nel pannello **Properties** a livello di workflow è riservato al proprietario per lo stesso motivo: il [error workflow](./features.md#error-workflow) viene eseguito con le credenziali e le variabili globali dell'esecuzione non riuscita, che appartengono al proprietario per le esecuzioni attivate e anonime. I collaboratori vedono l'impostazione in sola lettura, e l'aggiunta, la sostituzione o la cancellazione della stessa da parte di un non proprietario viene rifiutata con `403`.

La modifica del canvas, del nome e della descrizione non è interessata.
### Token di esecuzione

Un collaboratore può generare un token di esecuzione per un workflow condiviso con lui. L'esecuzione viene attribuita a **chi ha generato il token**, pertanto utilizza le credenziali e le variabili globali di tale utente, non quelle del proprietario. Solo una chiamata realmente anonima — `auth_type: anonymous` senza alcun chiamante — viene eseguita nel contesto del proprietario.

## Pianificati per l'eliminazione

I workflow possono essere pianificati per l'eliminazione anziché essere rimossi immediatamente.

- **Campo**: `scheduled_for_deletion` (datetime nullable)
- **Comportamento**: quando impostato, il workflow viene spostato in `folder_id = null` e compare nella sezione "Pianificati per l'eliminazione".

### API

| Endpoint | Scopo |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Imposta `scheduled_for_deletion`, azzera `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Azzera `scheduled_for_deletion` (ripristino) |

### UI

- **Trascinamento nel cestino** – Rilasciare i workflow nell'area "Pianificati per l'eliminazione" per pianificarne la rimozione
- **Ripristino** – Rimuove dalla pianificazione
- **Eliminazione immediata** – Icona del cestino per la rimozione permanente

### Logica di pulizia

Un cron job viene eseguito quotidianamente alle **23:59** (fuso orario configurato). Un workflow viene eliminato solo quando:

- **Tutti i nodi di avvio** (nodi privi di archi entranti, esclusi sticky/errorHandler) hanno `active === false`

Se un qualsiasi nodo di avvio è ancora attivo, il workflow rimane fino all'esecuzione successiva.

## UI della dashboard

- **Righe delle cartelle** – Nuova cartella, albero ricorsivo delle cartelle con espansione/collasso. Ogni cartella riporta una
  descrizione opzionale sotto il proprio nome e un badge che conta i workflow contenuti, incluse le
  sotto-cartelle.
- **Azioni sulle cartelle** – Nuova sotto-cartella, Rinomina, Cambia icona, Scarica come ZIP ed Elimina sono disponibili inline
  su ogni riga di cartella; il menu contestuale con clic destro offre lo stesso set, e sui telefoni viene mostrato un unico
  pulsante di menu.
- **Area principale** – Workflow radice (senza cartella, non pianificati) e Pianificati per l'eliminazione
- **Anteprima di rilascio sulla cartella** – Il trascinamento di un workflow evidenzia la cartella o sotto-cartella esatta e
  mostra il percorso completo in un'anteprima delle dimensioni di una scheda. Una cartella compressa si espande dopo un breve passaggio del puntatore.
- **Feedback di trascinamento stabile** – La scheda di origine utilizza un drag ghost, e il target di rilascio attivo rimane
  selezionato durante lo scorrimento o l'attraversamento dei controlli all'interno della stessa cartella.
- **Verifica della destinazione** – La cartella corrente viene mostrata come **Già nella cartella** e non accetta
  uno spostamento ridondante.
- **Altre aree di rilascio** – La radice e "Pianificati per l'eliminazione" si evidenziano quando possono accettare il
  workflow trascinato.
- **Rilascio di ZIP** – Rilasciare un file ZIP sull'area dei workflow per importare una struttura di cartelle a livello di radice

## Correlati

- [Scheda Workflows](../tabs/workflows-tab.md) – Creare e gestire i workflow
- [Condivisione delle credenziali](./credentials-sharing.md) – Condividere le credenziali con i collaboratori dei workflow
- [Team](./teams.md) – Condividere workflow e credenziali con i team
- [Concetti fondamentali](../getting-started/core-concepts.md) – Workflow, nodi ed esecuzione
- [Struttura del workflow](./workflow-structure.md) – Formato JSON per i workflow
- [Trigger](./triggers.md) – Nodi di avvio e punti di ingresso
