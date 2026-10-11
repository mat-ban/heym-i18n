# Decision

Il nodo **Decision** pone a un modello decisionale domande tipizzate sullo stato corrente dell'esecuzione e restituisce probabilità. Non genera testo. Lo si utilizza quando un workflow necessita di un giudizio sul quale diramarsi — routing, triage, ranking, verifica o controllo di un passaggio che non può essere annullato.

I modelli decisionali (detti anche modelli *System One*) sono un tipo di modello diverso da un LLM. Non vi è alcun prompt, alcuna istruzione di sistema, alcuna temperatura e alcuna chiamata a strumenti. Si invia uno **stato** insieme a una mappa di **domande**, e ciascuna risposta ritorna come un numero con una distribuzione di probabilità sottostante. Poiché una risposta è composta da pochi token, questi modelli sono veloci ed economici rispetto al richiedere a un [LLM](./llm-node.md) di produrre JSON e analizzarlo.

Per la generazione di testo, utilizzare il nodo [LLM](./llm-node.md). Per un modello che richiama strumenti, utilizzare il [Nodo Agent](./agent-node.md).

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | La risposta del provider testualmente — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Una credenziale di tipo *Decision Model*. Non una credenziale LLM. |
| `model` | string | Nome del modello, ad esempio `jev-latest` |
| `state` | expression | Ciò che il modello deve leggere (predefinito `$input.text`) |
| `questions` | array | Righe di domande ordinate; almeno una |
| `customBodyEnabled` | boolean | Invia un corpo della richiesta scritto manualmente anziché il modulo |
| `customBody` | expression (JSON) | Il corpo da inviare quando l'opzione è attiva |
| `requestTimeoutSeconds` | number | Secondi massimi di attesa (predefinito: 60) |

### Stato

Lo **Stato** è la situazione che il modello valuta. Accetta una stringa, un oggetto o un array.

Un campo contenente esattamente un'espressione mantiene il proprio tipo, quindi `$input` invia l'oggetto stesso anziché il suo testo. Un modello con un'espressione al suo interno (`Ticket: $input.text`) si risolve in una stringa. Fornire a ciascuna domanda elementi sufficienti per rispondere: testo di origine, identità, relazioni, policy e fatti correnti.

## Tipi di domanda

Ciascuna domanda ha un `id`, un `type`, delle `instructions` e criteri che dipendono dal tipo.

L'`id` è il modo in cui il workflow rilegge la risposta. **Non viene mai inviato al modello**, quindi l'intero significato deve risiedere nelle `instructions`. Scrivere `id: is_urgent` con `instructions: "Is it?"` non fornisce al modello alcun elemento su cui lavorare.

### Noul

Se una condizione è soddisfatta. Restituisce la probabilità che la risposta sia affermativa, da 0 a 1.

I criteri sono opzionali: **Yes means** e **No means** descrivono cosa copre ciascun lato. Un valore prossimo a 0,5 significa che il modello ritiene sì e no all'incirca ugualmente probabili — non "intensità media".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Lo si legge con `$triage.answers.is_urgent.noul`.

### Choice

Seleziona un'opzione da un insieme definito dall'utente. Restituisce l'opzione scelta, la distribuzione completa e una confidenza derivata da essa.

Aggiungere un'opzione che copra "nessuna di queste" ogni qualvolta nulla possa essere adatto — il modello non può scegliere un'opzione che non è stata offerta.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Lo si legge con `$triage.answers.department.choice`, `.probabilities.billing` e `.confidence`.

### Score

Valuta lo stato lungo una rubrica ordinata. Restituisce un valore ponderato per probabilità che può collocarsi **tra** i livelli, oltre alla legenda e alla distribuzione.

I livelli vanno dal più basso al più alto, almeno due e al massimo dieci. Ciascun livello dovrebbe descrivere una situazione concreta ed essere autosufficiente.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Lo si legge con `$triage.answers.frustration.score`, `.legend` e `.confidence`.
## Generazione con IA

**Generazione con IA** trasforma una semplice frase in un modello di stato suggerito e in un insieme di righe di domande. Descriva ciò che desidera valutare — "classificare un ticket di supporto in arrivo: quanto è urgente, quale team se ne occupa e quanto il cliente appare frustrato" — e riveda il risultato prima di aggiungerlo al nodo.

La bozza viene redatta da un LLM, pertanto la finestra di dialogo richiede una credenziale LLM. Il modello decisionale risponderà alle domande in un secondo momento, durante l'esecuzione del workflow. Gli id generati vengono deduplicati rispetto alle righe già presenti nel nodo, così una doppia generazione non sovrascrive mai una chiave di risposta esistente.

Ogni generazione viene registrata nella scheda [Esecuzioni](../tabs/traces-tab.md) sotto la sorgente **Decision Questions**, insieme alle tracce `decision.systemone` scritte dal nodo stesso in fase di esecuzione.

## Corpo della richiesta personalizzato

Attivi **Corpo della richiesta personalizzato** per inviare JSON scritto autonomamente anziché il modulo. Lo utilizzi per un endpoint il cui contratto differisce da quello costruito dal modulo.

L'editor viene inizializzato dal modulo corrente e le espressioni in esso contenute vengono risolte prima dell'invio della richiesta. Finché l'interruttore è attivo, il campo State e le righe delle domande vengono ignorati. La risposta viene trasmessa invariata in entrambi i casi, pertanto un contratto diverso produrrà semplicemente una struttura diversa che le Sue espressioni dovranno interpretare.

## Output

Il nodo restituisce esattamente ciò che ha restituito il provider. Nulla viene rinominato o appiattito.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Diramazione su una risposta

Un nodo [Switch](./switch-node.md) instrada sull'opzione scelta, mentre un nodo [Condition](./condition-node.md) può inviare i casi a bassa confidenza dove una persona possa vederli:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Una risposta tipizzata garantisce la struttura, non la verità. Scelga le soglie in base ai propri dati e alle proprie conseguenze anziché copiare un numero da un esempio.

## Credenziale

Crei una credenziale **Decision Model** nella scheda [Credenziali](../tabs/credentials-tab.md) con:

- **Base URL** — l'endpoint, ad esempio `https://api.typesafe.ai`. Heym aggiunge `/v1/systemone`.
- **API Key** — opzionale. Gli endpoint che non richiedono alcuna chiave possono essere lasciati vuoti.

La modifica di una credenziale conserva la chiave memorizzata quando il campo della chiave viene lasciato vuoto; la reinserisca solo per sostituirla.

La stessa credenziale può valutare le esecuzioni delle [Valutazioni](../tabs/evals-tab.md): con **LLM-as-Judge** selezionato, la scelga come giudice e il modello decisionale assegnerà un punteggio a ogni risposta rispetto all'output atteso.

Heym blocca per impostazione predefinita le richieste in uscita verso indirizzi privati e di loopback, pertanto un endpoint decisionale eseguito autonomamente su `localhost` o su un intervallo privato richiede `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

I modelli decisionali non compaiono nelle tabelle di prezzo degli LLM sincronizzate da Heym, quindi la colonna **Costo** in [Esecuzioni](../tabs/traces-tab.md) rimane vuota per queste chiamate. I conteggi dei token vengono comunque registrati ed è possibile aggiungere un prezzo personalizzato tramite un override dei prezzi.

## Errori

| Situazione | Cosa accade |
|-----------|--------------|
| API key non valida | Il nodo fallisce con un messaggio che indica la credenziale |
| Domanda malformata | Il messaggio a livello di campo del provider viene riportato nell'errore del nodo |
| Limite di frequenza o sovraccarico | Il nodo fallisce con un messaggio che indica che la condizione è transitoria — attivi il [retry](../reference/features.md) per questo nodo per superarla |
| Id domanda duplicato o vuoto | Il nodo fallisce prima dell'invio di qualsiasi richiesta |

## Correlati

- [Nodo LLM](./llm-node.md) – Genera testo anziché un giudizio
- [Nodo Agent](./agent-node.md) – Raccoglie evidenze con gli strumenti, poi le valuta qui
- [Nodo Switch](./switch-node.md) – Instrada sull'opzione scelta
- [Nodo Condition](./condition-node.md) – Filtra in base alla confidenza
- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Credenziali](../reference/credentials.md) – Tipi e campi delle credenziali
- [Scheda Esecuzioni](../tabs/traces-tab.md) – Ispeziona le chiamate decisionali e l'utilizzo dei token
