# Human-in-the-Loop

Human-in-the-loop (HITL) consente a un [Nodo Agent](../nodes/agent-node.md) di richiedere un'approvazione in momenti specifici, attendere una decisione umana e poi proseguire il workflow dallo stesso snapshot di esecuzione.

## Funzionalità

- Aggiunge checkpoint di approvazione espliciti a un agent senza dover costruire un workflow di approvazione separato
- Crea un URL pubblico di revisione monouso su `/review/{token}`
- Consente a un revisore di scegliere `Accept`, `Edit & Continue` o `Refuse`
- Contrassegna l'esecuzione come `pending` finché non arriva una decisione
- Riprende l'esecuzione in pausa e consente all'agent di proseguire dopo l'approvazione
- Supporta più checkpoint HITL sequenziali nella stessa esecuzione dell'agent

## Configurazione dell'Agent

Abilitare HITL nel pannello delle proprietà dell'agent.

| Impostazione | Descrizione |
|---------|-------------|
| `hitlEnabled` | Attiva la revisione umana per questo agent |
| `hitlSummary` | Linee guida di approvazione per stabilire quando l'agent deve richiedere la revisione umana |

HITL aggiunge all'agent uno strumento `request_human_review`. Utilizzare il system prompt e le linee guida `hitlSummary` per indicare all'agent quali azioni richiedono approvazione. Quando l'agent ritiene che un checkpoint necessiti di revisione, invia al revisore un singolo testo di revisione in Markdown. Il riepilogo mostrato al revisore viene generato dalla richiesta dell'agent a runtime; se l'agent lo omette, Heym ne deriva uno dal corpo Markdown. Nella v1, HITL supporta solo output dell'agent in modalità testo, quindi non può essere combinato con `jsonOutputEnabled`.

Per gli strumenti MCP, Heym chiede al modello di interpretare le istruzioni HITL scritte in uno dei tre ambiti di approvazione:

- `always` per espressioni come "always", "on each" o "for each"
- `once` per espressioni come "once" o "only one time"
- `never` per espressioni come "never", "do not ask" o "already approved"

Tale interpretazione controlla se le chiamate MCP ripetute mettono nuovamente in pausa, restano approvate una sola volta o saltano del tutto la revisione umana.

Quando HITL è abilitato, l'agent espone anche un secondo handle di output sul canvas etichettato `review`. Utilizzare quel ramo per inviare l'URL di revisione in sospeso e il riepilogo a Slack, email, logging o qualsiasi altro flusso di notifica mentre l'esecuzione principale attende una persona.

## Flusso di revisione

1. L'agent raggiunge un passaggio che richiede approvazione e chiama `request_human_review`
2. Heym crea una richiesta di revisione pubblica e restituisce un URL di revisione
3. Qualsiasi nodo collegato all'handle `review` dell'agent viene eseguito immediatamente con il payload HITL in sospeso
4. L'esecuzione del workflow passa a `pending`
5. Un revisore apre `/review/{token}` senza effettuare l'accesso
6. Il revisore sceglie una delle azioni:
   - `Accept` prosegue con il Markdown originale
   - `Edit & Continue` prosegue con il Markdown modificato
   - `Refuse` prosegue con `decision: "refused"` e salta ulteriori azioni dell'agent
7. Heym riprende il workflow dallo snapshot memorizzato e consente all'agent di proseguire con il contesto Markdown approvato
8. Se un passaggio successivo richiede anch'esso approvazione, l'agent può chiamare nuovamente HITL e creare un altro checkpoint in sospeso

I link di revisione scadono dopo 168 ore se nessuno risponde.

## Pagina pubblica di revisione

La pagina pubblica di revisione mostra:

- Il nome del workflow e l'etichetta dell'agent
- Un riepilogo per il revisore generato automaticamente dalla richiesta di revisione dell'agent
- Il testo di revisione in Markdown per primo, come contenuto principale
- Una casella di modifica che si apre solo dopo che il revisore ha fatto clic su `Edit`
- Un'anteprima Markdown in tempo reale durante la modifica
- Pulsanti di azione per `Accept`, `Edit & Continue` e `Refuse`

Una volta inviata una decisione, il token viene bloccato e non può essere riutilizzato.

## Output e stato di esecuzione

In attesa della revisione, l'output dell'agent contiene un payload in sospeso:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Dopo che il revisore ha risposto e il workflow è ripreso, l'output finale dell'agent include i metadati della decisione:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Utilizzare `$agentLabel.decision` nei nodi a valle per diramare in base agli esiti accepted, edited o refused.

## Ramo di revisione sul Canvas

L'handle di output `review` è disponibile solo quando `hitlEnabled` è attivo per un agent.

- Viene eseguito prima che arrivi la decisione umana
- Riceve il payload HITL in sospeso, inclusi `summary`, `draftText`, `reviewUrl`, `shareText` e `shareMarkdown`
- È destinato a passaggi di notifica o handoff quali Slack, email o logging di audit
- Viene eseguito una volta per ciascun checkpoint HITL
- Non viene eseguito nuovamente dopo che il revisore ha risposto; solo il normale percorso di output dell'agent prosegue alla ripresa

## Dove Appare

- La [Cronologia delle esecuzioni](./execution-history.md) mostra immediatamente le esecuzioni in stato `pending` e memorizza l'URL di revisione nei risultati del nodo
- Le risposte della chat del [Portale](./portal.md) mostrano il link di revisione umana al posto di una risposta vuota
- Il pannello di Debug e le finestre di dialogo della cronologia mostrano la decisione finale HITL e il testo revisionato
- L'handle di output della revisione può notificare canali esterni anche quando il workflow è stato attivato da cron, curl o traffico del portale
- Più checkpoint HITL riutilizzano la stessa voce della cronologia delle esecuzioni, creando al contempo un nuovo link di revisione monouso per ogni pausa

## Limiti Attuali

- HITL è disponibile solo sui nodi Agent
- HITL utilizza l'output testuale dell'agente e non supporta output JSON nella v1
- Un'esecuzione in pausa riprende dallo snapshot del workflow memorizzato, non dalla versione del workflow modificata più di recente
- I sotto-workflow annidati non possono entrare in uno stato HITL in sospeso nella v1; richiedere la revisione dall'agente padre prima di richiamarli

## Correlati

- [Nodo Agent](../nodes/agent-node.md) - Configurare HITL su un agente
- [Architettura degli agenti](./agent-architecture.md) - Come agenti, strumenti, sotto-agenti e HITL si integrano tra loro
- [Cronologia delle esecuzioni](./execution-history.md) - Ispezionare le esecuzioni in sospeso e riprese
- [Board](../tabs/board-tab.md) - Le esecuzioni della catena Board mettono in pausa la card in uno stato in sospeso (ambra) su HITL
- [Portale](./portal.md) - Flussi di chat pubblici e link di revisione HITL
