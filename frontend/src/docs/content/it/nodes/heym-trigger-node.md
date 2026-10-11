# Heym Trigger

Il nodo **Heym Trigger** avvia un workflow quando Heym stesso pubblica un evento di piattaforma. Si tratta di un nodo trigger a zero input per automatizzare Heym con Heym: audit trail delle modifiche, annunci di deploy e riepiloghi sullo stato dell'istanza.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Credenziale | Nessuna richiesta |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `eventNames` | Array di stringhe | Quali eventi sottoscrivere. Lasciare vuoto per ricevere ogni evento. |

## Eventi

| Evento | Pubblicato quando | Ambito |
|-------|----------------|-------|
| `heym.started` | La piattaforma Heym si avvia | A livello di istanza: ogni sottoscrittore lo riceve |
| `workflow.created` | Viene creato un workflow | Solo i sottoscrittori del proprietario del workflow |
| `workflow.updated` | Viene salvato un workflow | Solo i sottoscrittori del proprietario del workflow |
| `workflow.deleted` | Viene eliminato un workflow | Solo i sottoscrittori del proprietario del workflow |

I widget della dashboard sono memorizzati internamente come workflow, ma non producono mai eventi `workflow.*`.

## La consegna è raggruppata in batch

Heym invia gli eventi ogni cinque secondi. **Ogni evento acquisito in un singolo passaggio di dispatch arriva in una sola esecuzione del workflow**, sotto forma di array.

- Creare due workflow a distanza di cinque secondi l'uno dall'altro → **una** esecuzione con due eventi.
- Creare un workflow → **una** esecuzione con un array di un solo elemento.

La struttura non cambia mai, quindi le espressioni a valle non devono mai ramificarsi a seconda che sia arrivato un evento o molti. Quando occorre agire una volta per evento, inserire un nodo [Loop](./loop-node.md) su `$nodeLabel.events`.

## Consegna exactly-once

Ogni evento viene acquisito per nodo sottoscrittore tramite un vincolo univoco sul database prima di essere consegnato. Questo vale per ogni worker uvicorn, ogni container e ogni macchina: eseguire Heym su due server non consegna un evento due volte. Se non è possibile registrare un'acquisizione, l'evento non viene consegnato affatto — il design fallisce in modo chiuso anziché attivarsi due volte.

Due nodi `heymTrigger` diversi sottoscritti allo stesso evento lo ricevono ciascuno una volta; non competono per esso.

## La finestra di dispatch

Il dispatcher considera solo gli eventi pubblicati negli **ultimi cinque minuti**. Gli eventi più vecchi restano nel log per ispezione ma non vengono mai consegnati. Questo delimita ciò che accade dopo un periodo di inattività: riavviare Heym dopo un'ora offline non riproduce nulla, invece di attivare un'ora di arretrati in una sola volta.

Gli eventi vengono conservati per **7 giorni** e poi eliminati.

## Campi di output

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.events` | Array di oggetti evento, dal più vecchio al più recente. Sempre un array. |
| `$nodeLabel.events[0].id` | UUID dell'evento |
| `$nodeLabel.events[0].name` | Nome dell'evento, ad esempio `workflow.created` |
| `$nodeLabel.events[0].payload` | Corpo dell'evento |
| `$nodeLabel.events[0].workflow_id` | Id del workflow oggetto, oppure `null` per `heym.started` |
| `$nodeLabel.events[0].created_at` | Timestamp ISO di quando l'evento è stato pubblicato |
| `$nodeLabel.count` | Numero di eventi in questo batch |
| `$nodeLabel.triggered_at` | Timestamp ISO dell'esecuzione del workflow |

### Strutture del payload

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` riporta il nome acquisito appena prima dell'eliminazione, poiché la riga del workflow è già scomparsa nel momento in cui si legge l'evento.

## Workflow di esempio

**Audit trail delle modifiche ai workflow**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** con label `platformEvents`, sottoscritto a `workflow.created`, `workflow.updated`, `workflow.deleted`
- Nodo **Heym** con `getWorkflow` e `heymWorkflowId` impostato su `$platformEvents.events[0].workflow_id`
- Messaggio **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Note

- `heym.started` si attiva **una volta per avvio della piattaforma**, non una volta per worker, anche se Heym esegue otto worker per container. I container che si avviano a più di cinque minuti di distanza pubblicano ciascuno un evento.
- Le esecuzioni attivate in questo modo compaiono nella cronologia con `trigger_source = "heym_event"`.
- Impostare **Events** su nessun evento anziché elencare tutti e quattro se si desidera acquisire automaticamente i tipi di evento aggiunti nelle versioni future.

## Correlati

- [Heym](./heym-node.md) – Leggere workflow e cronologia delle esecuzioni
- [Triggers](../reference/triggers.md) – Panoramica di tutti i punti di ingresso dei workflow
- [Loop](./loop-node.md) – Agire una volta per evento in un batch