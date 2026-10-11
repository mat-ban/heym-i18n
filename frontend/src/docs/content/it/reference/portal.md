# Portal

Il **Portal** espone i workflow di Heym come interfacce chat pubbliche. Gli utenti finali possono eseguire i workflow tramite un URL senza effettuare l'accesso a Heym.

## Funzionalità

- **URL pubblico**: `/chat/{slug}` (ad es. `/chat/my-workflow`)
- **Interfaccia Chat**: gli utenti interagiscono tramite una UI di tipo chat (messaggi, input, risposte)
- **Autenticazione opzionale**: se sono configurati utenti del portal, è richiesto il login; in caso contrario il portal è pubblico
- **Streaming**: avanzamento dei nodi in tempo reale durante l'esecuzione (quando abilitato)
- **Arresto delle esecuzioni in corso**: gli utenti possono arrestare un'esecuzione del portal in corso dal footer della chat; l'esecuzione attiva del workflow viene annullata anche lato server
- **Caricamento file**: caricamenti di file opzionali (testo, immagini, ecc.) per ciascun campo di input
- **Passaggio alla revisione umana**: le esecuzioni del portal possono mostrare i [link di revisione HITL](./human-in-the-loop.md) quando un agente si mette in pausa in attesa di approvazione
- **Visualizzazione immagini**: gli output del workflow contenenti immagini (ad es. da generazione immagini tramite LLM o screenshot di Playwright) vengono mostrati come miniature nella chat. Fare clic su qualsiasi immagine per aprirla in un visualizzatore a schermo intero; premere **Esc** o utilizzare il pulsante indietro del dispositivo per chiudere

## Configurazione del Workflow

| Impostazione | Descrizione |
|---------|-------------|
| `portal_enabled` | Abilita il portal per questo workflow |
| `portal_slug` | Slug dell'URL (ad es. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Utilizza l'esecuzione in streaming |
| `portal_file_upload_enabled` | Consente il caricamento dei file |
| `portal_file_config` | Configurazione file per campo (tipi, limiti) |

Configurare nell'editor: il pulsante **Portal** nell'intestazione del workflow apre la finestra di dialogo delle impostazioni del portal.

## Flusso

1. **Info**: `GET /api/portal/{slug}/info` – Restituisce i metadati del workflow e i campi di input (nessuna autenticazione)
2. **Login** (se richiesto): `POST /api/portal/{slug}/login` – Restituisce il token di sessione
3. **Esecuzione**: `POST /api/portal/{slug}/execute` – La UI chat del portal richiama questo endpoint (o la sua variante in streaming internamente quando abilitata); gli utenti finali interagiscono tramite l'interfaccia chat, non chiamando direttamente l'API.
4. **Arresto**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Richiesto quando l'utente preme **Stop** durante un'esecuzione attiva del portal

## HITL nelle esecuzioni del Portal

Se un workflow del portal raggiunge un [Nodo Agent](../nodes/agent-node.md) con [Human-in-the-Loop](./human-in-the-loop.md) abilitato, la risposta del portal mostra un link di revisione invece di apparire vuota.

- Lo stato di esecuzione del workflow diventa `pending`
- La chat del portal visualizza l'URL di revisione
- Qualsiasi nodo connesso all'handle di output `review` dell'agente può notificare Slack, email o altri canali immediatamente
- Un revisore completa la decisione su `/review/{token}` senza effettuare l'accesso
- Dopo la revisione, il workflow riprende dallo snapshot memorizzato

Ciò consente di combinare flussi di chat pubblici con passaggi di approvazione umana privati.

## Campi di Input

I campi di input provengono dai nodi [Input](../nodes/input-node.md). L'API estrae i nodi di avvio di tipo `textInput` e i relativi `inputFields`. L'esecuzione utilizza lo stesso motore delle esecuzioni normali; gli input vengono passati come `body.inputs` e `conversation_history` per i flussi multi-turno.

## Autenticazione e Sessioni

- **WorkflowPortalUser**: nome utente/password per workflow (quando l'autenticazione è abilitata)
- **PortalSession**: token di sessione con TTL di 168 ore
- **Rate limiting**: 3 tentativi di login falliti → ban di 24 ore per workflow+IP
- Le sessioni scadute vengono rimosse da un cron job

## UI di Configurazione

Schede di **WebPortalSettingsDialog**:

1. **General**: abilitare il portal, impostare lo slug, copiare l'URL del portal
2. **Users**: aggiungere/rimuovere utenti del portal (nome utente/password)
3. **Options**: modalità streaming, caricamento file, visualizzazione campi di input

## Correlati

- [Why Heym](../getting-started/why-heym.md) – Il Portal come superficie chat per gli agenti in produzione
- [Workflows Tab](../tabs/workflows-tab.md) – Creare workflow e abilitare il portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Pagine di revisione pubbliche per gli output degli agenti in sospeso
- [Triggers](./triggers.md) – Il Portal come punto di ingresso
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md) per gli input del portal
- [Workflow Structure](./workflow-structure.md) – Nodi e archi