# Tracciamento OpenTelemetry

Heym può emettere tracce [OpenTelemetry](https://opentelemetry.io/) per ogni esecuzione di workflow, esecuzione di nodo e invocazione di strumento dell'Agent. Ogni esecuzione produce uno span radice con span figli per ciascun nodo e strumento dell'Agent, consentendo di individuare quale passaggio ha fallito, quanto tempo ha impiegato, cosa ha invocato e cosa è stato restituito. Gli span vengono esportati tramite OTLP/HTTP verso qualsiasi backend compatibile come Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic o Grafana Cloud.

Il tracciamento è **disabilitato per impostazione predefinita**. Quando è disattivato non vi è alcun overhead misurabile e non viene creato alcuno span.

## Abilitazione del tracciamento

Impostare le seguenti variabili d'ambiente sul backend, quindi riavviarlo:

Per l'elenco completo delle variabili d'ambiente, consultare [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabile | Predefinito | Descrizione |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Interruttore principale. Impostare a `true` per attivare il tracciamento. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Endpoint base OTLP/HTTP, ad esempio `http://collector:4318`. Heym invia gli span a `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Header `key=value` separati da virgola per l'autenticazione dell'exporter, ad esempio `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | L'attributo di risorsa `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Rapporto di campionamento head compreso tra `0.0` e `1.0`, applicato con un sampler basato sul parent. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Quando `true`, allega ai nodi span i payload di input e output troncati. Disattivato per impostazione predefinita per motivi di privacy. |

Esempio minimo:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

È possibile confermare la configurazione attiva nell'app sotto **Settings → Observability** (aprirla dall'avatar nell'header). Quel pannello è di sola lettura e non mostra mai i segreti dell'exporter.

## Cosa viene tracciato

### Span radice del workflow

Nome: `heym.workflow.execute`

| Attributo | Descrizione |
|-----------|-------------|
| `heym.workflow.id` | L'UUID del workflow. |
| `heym.node.count` | Numero di nodi nel workflow. |
| `heym.workflow.test_mode` | `true` per le esecuzioni di test. |
| `heym.sub_workflow.depth` | Profondità di annidamento quando invocato come sub-workflow. |
| `heym.workflow.status` | Stato finale dell'esecuzione. Un'esecuzione fallita imposta lo stato dello span a `ERROR`. |

### Span del nodo

Nome: `heym.node.execute`, creato come figlio dello span del workflow.

| Attributo | Descrizione |
|-----------|-------------|
| `heym.node.id` | L'id del nodo. |
| `heym.node.type` | Il tipo di nodo, ad esempio `agent`, `llm`, `http`. |
| `heym.node.label` | L'etichetta del nodo mostrata sul canvas. |
| `heym.node.status` | `success` o `error`. Gli errori impostano lo stato dello span a `ERROR`. |
| `heym.node.duration_ms` | Tempo di esecuzione del nodo in millisecondi. |
| `heym.llm.model` | Nome del modello per i nodi LLM e Agent, quando disponibile. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Utilizzo dei Token per i nodi LLM e Agent, quando disponibile. |

Gli span dei nodi si annidano correttamente sotto lo span del workflow anche quando i nodi vengono eseguiti in parallelo, poiché il contesto del workflow viene propagato nei thread di lavoro.

### Span dello strumento dell'Agent

Nome: `heym.agent.tool.execute`, creato sotto lo span del nodo Agent attivo.

| Attributo | Descrizione |
|-----------|-------------|
| `heym.agent.tool.name` | Nome dello strumento selezionato dal modello. |
| `heym.agent.tool.call_id` | Id della tool-call del provider, quando disponibile. |
| `heym.agent.tool.source` | Origine dello strumento come `node_tool`, `mcp`, `skill` o `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Etichetta del server MCP, quando applicabile. |
| `heym.agent.tool.iteration` | Iterazione del ciclo degli strumenti dell'Agent. |
| `heym.agent.tool.args_bytes` | Dimensione UTF-8 degli argomenti dello strumento serializzati. |
| `heym.agent.tool.result_bytes` | Dimensione UTF-8 del risultato dello strumento serializzato. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` o `cancelled`. Gli errori dello strumento impostano lo stato dello span a `ERROR`. |

Gli argomenti e i risultati grezzi degli strumenti non vengono allegati agli span per impostazione predefinita.

## Sicurezza dei payload degli strumenti dell'Agent

I payload di osservabilità dell'Agent persistiti vengono redatti e troncati nel codice (`4096` caratteri per stringa, profondità `6`, `32768` caratteri totali per ogni scrittura di traccia LLM). Il budget totale della traccia viene suddiviso tra i record degli strumenti, in modo che un risultato iniziale di grandi dimensioni non possa nascondere l'identità e lo stato del ciclo di vita delle chiamate successive. I metadati di download limitati di `_generated_files` sono riservati separatamente dall'output voluminoso delle skill:

- Sezioni degli strumenti `request` / `response` della traccia LLM, incluse le copie `_hitl_pending` scritte nell'archivio delle tracce
- Record `tool_calls` del risultato dell'Agent mostrati nella cronologia delle esecuzioni
- Eventi dei risultati degli strumenti del pannello Live Debug, che riutilizzano lo stesso record sanificato e limitato

L'esecuzione degli strumenti in tempo reale, i messaggi degli strumenti associati al modello e lo stato di ripresa HITL in memoria (`_hitl_pending.agent_state.messages` / `tool_arguments`) mantengono i valori originali, in modo che la ripresa e la corrispondenza esatta degli argomenti continuino a funzionare. Solo le copie di osservabilità memorizzate vengono sanificate.

## Propagazione del contesto di traccia

Heym segue lo standard [W3C Trace Context](https://www.w3.org/TR/trace-context/) affinché le tracce rimangano collegate attraverso i confini dei servizi.

- **Webhook in ingresso:** quando una richiesta in arrivo contiene un header `traceparent`, l'esecuzione del workflow viene registrata come figlia di quella traccia. Questo collega le esecuzioni di Heym al sistema a monte che le ha attivate.
- **HTTP in uscita:** il nodo HTTP inietta `traceparent` nelle richieste effettuate, consentendo ai servizi a valle di proseguire la stessa traccia.
- **Sotto-workflow:** l'esecuzione di un sotto-workflow è associata come figlia al nodo che l'ha invocata, preservando la gerarchia delle chiamate in un'unica traccia.

I Trigger privi di un contesto in ingresso (come Cron, IMAP, RabbitMQ e WebSocket) avviano una nuova traccia per ogni esecuzione.

## Affidabilità

- Un collector lento o irraggiungibile non blocca mai l'esecuzione del workflow. Gli span vengono raggruppati ed esportati in background.
- Se l'inizializzazione del tracing non riesce (ad esempio, a causa di un endpoint errato), il backend registra l'errore e prosegue con il tracing disabilitato anziché non avviarsi.
- Gli header di autenticazione OTLP vengono letti esclusivamente dall'ambiente. Non sono mai memorizzati nel database e non vengono mai restituiti dall'API di stato.

## Correlati

- [Impostazioni](./user-settings.md) – La scheda Observability che mostra lo stato del tracing
- [Variabili d'ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Riferimento completo alla configurazione
- [Trigger](./triggers.md) – Come si avviano i workflow, inclusi i webhook
- [Cronologia delle esecuzioni](./execution-history.md) – La vista integrata di Heym per la cronologia di ogni esecuzione
- [HTTP](../nodes/http-node.md) – Il nodo che propaga il contesto di traccia alle chiamate a valle
