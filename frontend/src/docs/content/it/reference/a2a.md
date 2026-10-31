# A2A

Heym rende disponibile l'**Heym Agent** tramite il protocollo Agent2Agent (A2A 1.0, binding JSON-RPC). L'Heym Agent costituisce il motore alla base della [Scheda Chat](../tabs/chat-tab.md); i client MCP raggiungono lo stesso agent tramite il tool `heym_chat` (vedere la [Scheda MCP / A2A](../tabs/mcp-tab.md)). Con A2A attivo, un altro agent può inviargli una Task in linguaggio naturale e riceverne la risposta, disponendo delle medesime funzionalità di Chat.

## Attivazione

1. Apra la scheda **MCP / A2A**.
2. Attivi l'**Heym Agent** sul server predefinito o su un server denominato, quindi ne selezioni le credenziali e il modello.
3. Selezioni **Abilita A2A**. La scheda visualizza l'URL dell'**Agent Card** e l'**Endpoint JSON-RPC**.

A2A si appoggia all'Heym Agent: disattivare l'agent disattiva contestualmente anche A2A.

## Endpoints

| | Server predefinito | Server denominato |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

L'Agent Card non richiede credenziali e non menziona alcun utente, server o Workflow. Esiste solo fintanto che A2A rimane abilitato: la card di dominio finché almeno un utente ha A2A attivo sul server predefinito, la card di un server denominato finché A2A è attivo su quel server. Negli altri casi l'indirizzo risponde con 404.

## Autenticazione

Invii le medesime credenziali di MCP, unicamente negli header:

- `X-MCP-Key: <key>`: la chiave del server predefinito o la chiave del server denominato
- `Authorization: Bearer <token>`: un Token OAuth rilasciato dal server OAuth di Heym

Le credenziali fornite nell'URL vengono rifiutate. L'Agent Card dichiara entrambi gli schemi, consentendo a un client A2A di leggerli direttamente dalla card.

## Metodi

| Metodo | Descrizione |
|---|---|
| `SendMessage` | Avvia una Task o ne riprende una in attesa di input. Attende la risposta a meno che `configuration.returnImmediately` non sia impostato su `true`. |
| `SendStreamingMessage` | Come sopra, sotto forma di flusso Server-Sent Events con l'avanzamento e il risultato della Task. |
| `GetTask` | Stato, risposta e cronologia di una Task (`historyLength` limita la dimensione della cronologia). |
| `ListTasks` | Le Sue Task su questo server, dalla più recente, filtrate per `contextId` o `status`, con `pageSize` e `pageToken`. |
| `CancelTask` | Arresta una Task ancora in esecuzione o in attesa. |
| `SubscribeToTask` | Monitora una Task ancora in esecuzione. |
| `GetExtendedAgentCard` | La card con il nome del server e i relativi Workflow assegnati sotto forma di skill. |

Le notifiche push non sono supportate: la card indica `pushNotifications: false`, e i metodi push restituiscono `PushNotificationNotSupportedError`. Le richieste utilizzano A2A 1.0; trasmettere `A2A-Version: 1.0`. I metodi di A2A 0.3 come `message/send` rispondono con `VersionNotSupportedError`.

## Task e conversazioni

Ogni Task costituisce una conversazione nella scheda Chat, contraddistinta da un'icona di rete. Il `contextId` della Task rappresenta tale conversazione: invii un nuovo messaggio con lo stesso `contextId` e senza `taskId` per proseguirla.

| Azione dell'agent | Stato della Task |
|---|---|
| Ha risposto | `TASK_STATE_COMPLETED`, con la risposta in formato testo e, se salvati, i link ai Workflow e alle suite di valutazione come dati |
| Ha formulato una domanda di chiarimento | `TASK_STATE_INPUT_REQUIRED`: rispondere specificando il medesimo `taskId` |
| Richiede credenziali | `TASK_STATE_AUTH_REQUIRED`: il messaggio di stato contiene un link alla pagina credenziali di Heym. L'utente lo apre in un browser autenticato su Heym; il valore non transita mai attraverso l'altro agent. Invii poi un messaggio sulla stessa Task per proseguire. |
| Ha rilevato un errore | `TASK_STATE_FAILED`, con la motivazione |
| È stata annullata | `TASK_STATE_CANCELED` |

Un messaggio inviato a una Task completata o ancora in elaborazione viene rifiutato con `UnsupportedOperationError`. I messaggi accettano parti `text` e `data`, per un totale massimo combinato di 20.000 caratteri; le parti file vengono rifiutate, pertanto trasmetta i file come link.

## Avanzamento

Durante l'esecuzione di una Task, lo stream trasmette un aggiornamento di stato per ogni passaggio con le stesse diciture visibili nella scheda Chat, ad esempio `Running workflow "Invoice Parser"` o `Testing the workflow · attempt 2/5`. I client MCP ricevono i medesimi passaggi come `notifications/progress` da `heym_chat`.

## Esempio

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Limitazioni

- `CancelTask` arresta immediatamente un turno in corso sull'istanza Heym che lo sta eseguendo, proprio come il comando Stop nella scheda Chat. Altrove la Task viene contrassegnata come annullata e il risultato tardivo non viene registrato.
- Nessuna notifica push, nessun binding REST o gRPC, nessuna Agent Card firmata.

## Correlati

- [Scheda MCP / A2A](../tabs/mcp-tab.md): abilitare Heym Agent e A2A
- [Scheda Chat](../tabs/chat-tab.md): il motore alla base dell'agent
- [Sicurezza](./security.md): modalità di conservazione delle chiavi
