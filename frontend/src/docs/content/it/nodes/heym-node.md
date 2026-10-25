# Heym

Il nodo **Heym** legge i dati di Heym stesso: i workflow a cui è possibile accedere, la struttura di un singolo workflow e la relativa cronologia delle Esecuzioni. È lo strumento con cui si costruiscono meta-workflow — inventari delle istanze, riepiloghi delle Esecuzioni e report sullo stato di salute di Heym stesso.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Operazioni | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Credenziali | Nessuna richiesta |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `heymOperation` | Select | Quale lettura eseguire |
| `heymWorkflowId` | UUID | Lo imposti su `all` in `getExecutionHistory` per leggere ogni Workflow raggiungibile. |
| `heymLimit` | String | Numero massimo di righe da restituire. **Lasciare vuoto o inserire `0` per restituire tutto** — è il valore predefinito. Supporta le espressioni. |
| `heymStatus` | String | Filtro di stato opzionale per `getExecutionHistory`. Supporta le espressioni. |
| `heymSinceDays` | String | Intervallo di ricerca opzionale in giorni per `getExecutionHistory`. Supporta le espressioni. |

Il selettore del workflow è un menu a tendina ricercabile che elenca ogni workflow a cui è possibile accedere.

## Ambito di accesso

I risultati sono limitati al **proprietario del workflow in cui risiede il nodo** — non a chi ha avviato l'esecuzione. L'insieme visibile comprende:

- i workflow di proprietà del proprietario,
- i workflow condivisi direttamente con il proprietario,
- i workflow condivisi con un team di cui il proprietario fa parte.

L'ambito basato sul proprietario è ciò che rende il nodo identico nel comportamento sia che un'esecuzione venga avviata manualmente, da cron, da un portale o da un evento della piattaforma. Un ambito basato sull'attore non restituirebbe nulla in ogni esecuzione non presidiata. È la stessa regola che Heym applica già alle Credenziali e alle variabili globali.

Un workflow a cui non è possibile accedere e un workflow inesistente producono lo stesso messaggio di errore, pertanto il nodo non può essere utilizzato per sondare gli id dei workflow.

## Operazioni

### List Workflows

Restituisce ogni workflow a cui il proprietario può accedere, con il più recentemente aggiornato per primo.

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.workflows` | Array di riepiloghi dei workflow |
| `$nodeLabel.workflows[0].id` | UUID del workflow |
| `$nodeLabel.workflows[0].name` | Nome del workflow |
| `$nodeLabel.workflows[0].description` | Descrizione, oppure `null` |
| `$nodeLabel.workflows[0].active` | Indica se il workflow è attivo |
| `$nodeLabel.workflows[0].folder_id` | UUID della cartella, oppure `null` |
| `$nodeLabel.workflows[0].updated_at` | Timestamp ISO dell'ultimo salvataggio |
| `$nodeLabel.workflows[0].node_count` | Numero di nodi contenuti nel workflow |
| `$nodeLabel.total` | Conteggio completo degli elementi accessibili **prima** dell'applicazione del limite |

`total` è deliberatamente il conteggio senza limiti, così `$inventory.total` continua a riportare la dimensione reale anche quando si limita il numero di righe restituite. Svuotando **Limit**, o impostandolo a `0`, si restituiscono tutti i workflow — che è il valore predefinito.

### Get Workflow

Restituisce l'identità e la struttura di un workflow.

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identità del workflow |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadati del workflow |
| `$nodeLabel.node_count` | Numero di nodi |
| `$nodeLabel.nodes` | Array di `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array di `{ id, source, target, sourceHandle, targetHandle }` |

`data` è la **configurazione completa del nodo** — ogni campo così come è stato salvato. È ciò che rende possibile l'audit: non si può scansionare un workflow alla ricerca di una chiave API che qualcuno ha incollato in un campo se il nodo si rifiuta di mostrare il campo.

Ciò non concede alcun accesso che il chiamante non avesse già. Il nodo è limitato ai workflow che il proprietario può comunque aprire nell'editor, e i segreti delle Credenziali memorizzati non sono comunque presenti: i dati del nodo contengono solo gli **id** delle Credenziali, mentre i segreti stessi risiedono cifrati nella tabella delle Credenziali.

### Scansione alla ricerca di segreti hardcoded

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Fornire all'agent `$detail.nodes` e chiedergli di segnalare qualsiasi valore in `data` che sembri una chiave o un Token attivo. I campi da tenere d'occhio sono quelli a testo libero — `curl` sui nodi HTTP, `userMessage` e `systemInstruction` sui nodi LLM e Agent, e i corpi degli strumenti Python — perché un id di Credenziale è un UUID innocuo, ma un `sk-…` incollato non lo è.
### Ottenere la Cronologia delle Esecuzioni

Restituisce le voci della cronologia delle esecuzioni per un Workflow, dalla più recente.

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.executions` | Array delle voci della cronologia |
| `$nodeLabel.executions[0].id` | UUID dell'esecuzione |
| `$nodeLabel.executions[0].status` | `success`, `error`, e così via |
| `$nodeLabel.executions[0].started_at` | Timestamp ISO |
| `$nodeLabel.executions[0].execution_time_ms` | Durata effettiva |
| `$nodeLabel.executions[0].trigger_source` | Ciò che ha avviato l'esecuzione, ad esempio `cron` o `heym_event` |
| `$nodeLabel.executions[0].recovered` | Indica se l'esecuzione è stata recuperata dopo un crash |
| `$nodeLabel.executions[0].inputs` | Ciò che l'esecuzione ha ricevuto - il payload del trigger o l'input del chiamante |
| `$nodeLabel.executions[0].outputs` | L'output del Workflow per quell'esecuzione |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Il Workflow a cui appartiene la cronologia, oppure `null` con **{AW}** |
ppure `null` con **{AW}** |
| `$nodeLabel.total` | Totale delle esecuzioni corrispondenti **prima** del limite |
| `$nodeL| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Con **{AW}**, il Workflow a cui appartiene ciascuna esecuzione |
abel.by_status` | Conteggi indicizzati per stato, ad esempio `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Inizio dell'intervallo, oppure `null` per la cronologia completa |

Le voci contengono sia `inputs` che `outputs` - ciò che l'esecuzione ha ricevuto e ciò che ha restituito - ma mai `node_results`: la traccia per singolo nodo è la colonna più grande della tabella e sovrasterebbe tutto ciò che segue. Recuperare una singola esecuzione tramite l'API quando è necessaria la traccia completa.

`total` e `by_status` descrivono sempre la cronologia corrispondente **completa**, anche quando **Limit** limita le voci restituite — in questo modo è possibile estrarre le cinque esecuzioni più recenti e riportare comunque un conteggio accurato degli errori.

Lasciare **Since (days)** vuoto per coprire tutto, **Status filter** vuoto per includere ogni stato, e **Limit** vuoto o `0` per restituire ogni voce.

## Workflow di Esempio

**Digest giornaliero delle istanze**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` etichettato `inventory`
- **Loop** su `$inventory.workflows`
- **Heym** `getExecutionHistory` con `heymWorkflowId` impostato sull'`id` dell'elemento del loop, `heymSinceDays` pari a `1` e `heymLimit` pari a `5`
- **LLM** trasforma le esecuzioni raccolte e i conteggi di stato in un riepilogo leggibile

## Note

- Non è necessaria alcuna credenziale; il nodo legge lo stesso database su cui viene eseguito Heym.
- **Limit** è lo stesso campo per entrambe le operazioni di elenco e significa la stessa cosa in entrambe: vuoto o `0` restituisce tutto.
- Il nodo accetta un input normale e può essere collegato a un Nodo Agent come strumento, così un agente può rispondere a domande sulla propria istanza Heym — o sottoporla a verifica.
- I payload di `getWorkflow` crescono con il Workflow: prompt lunghi e corpi degli strumenti Python viaggiano tutti all'interno di `data`.
- Abbinarlo a [Heym Trigger](./heym-trigger-node.md) per reagire ai cambiamenti del Workflow nel momento in cui si verificano, invece di eseguire polling su una pianificazione.

## Correlati

- [Heym Trigger](./heym-trigger-node.md) – Avvia un Workflow dagli eventi della piattaforma
- [Execute](./execute-node.md) – Esegue un altro Workflow anziché descriverlo
- [Loop](./loop-node.md) – Itera sull'elenco dei Workflow restituito
