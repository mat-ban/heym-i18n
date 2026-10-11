# Guardrails

I Guardrails consentono di bloccare messaggi utente non sicuri o indesiderati prima che raggiungano un nodo [LLM](../nodes/llm-node.md) o [Agent](../nodes/agent-node.md). Quando un messaggio corrisponde a una categoria bloccata, il nodo genera un errore anziché essere eseguito; tale errore può essere intercettato con un nodo [Error Handler](../nodes/error-handler-node.md).

## Abilitazione dei Guardrails

Aprire il pannello delle proprietà di un nodo **LLM** o **AI Agent** e scorrere fino all'interruttore **Enable Guardrails** (icona a forma di scudo). Selezionando la casella viene visualizzata la sezione di configurazione.

## Credenziale e modello per i Guardrails

Quando i guardrails sono abilitati, è **obbligatorio** selezionare una **credenziale e un modello** per la sicurezza dei contenuti. Il controllo dei guardrails utilizza la credenziale e il modello selezionati nel nodo — nessun fallback, nessuna variabile d'ambiente. Utilizzare una credenziale OpenAI o Google per un filtraggio affidabile dei contenuti, soprattutto quando il modello principale utilizza un provider personalizzato (ad es. Zhipu, GLM) che potrebbe non supportare i guardrails o restituire errori API (ad es. 404).

Il workflow non può essere eseguito finché non sono stati selezionati sia Guardrail Credential sia Guardrail Model.

## Categorie bloccate

Selezionare una o più categorie da bloccare. Un messaggio che corrisponde a una qualsiasi categoria selezionata viene rifiutato.

| Categoria | Cosa blocca |
|---|---|
| **Violence** | Contenuti violenti, minacciosi o fisicamente dannosi |
| **Hate Speech** | Discriminazione, razzismo o intolleranza |
| **Sexual Content** | Contenuti o scenari sessuali espliciti |
| **NSFW / Profanity** | Linguaggio volgare, bestemmie, insulti espliciti e slang per adulti in qualsiasi lingua |
| **Self-Harm** | Suicidio, autolesionismo o contenuti correlati |
| **Harassment** | Attacchi personali, insulti, bullismo o intimidazione |
| **Illegal Activity** | Istruzioni per commettere atti illegali |
| **Political Extremism** | Contenuti politici estremisti o propaganda violenta |
| **Spam / Phishing** | Spam, phishing o ingegneria sociale |
| **Personal Data Request** | Richiesta di informazioni private o personalmente identificabili |
| **Prompt Injection** | Tentativi di sovrascrivere le istruzioni di sistema, iniettare prompt malevoli o manipolare il comportamento del modello |

## Sensibilità

L'impostazione **Sensitivity** controlla quanto rigorosamente vengono rilevate le violazioni:

| Livello | Comportamento |
|---|---|
| **Low** | Segnala anche i casi limite o ambigui |
| **Medium** *(predefinito)* | Segnala le violazioni evidenti; ignora i casi limite |
| **High** | Segnala solo le violazioni estreme e inequivocabili |

## Come funziona il rilevamento

Il rilevamento utilizza la **credenziale e il modello dei guardrails selezionati**:

- **Credenziali OpenAI** — utilizza la [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (gratuita, veloce, senza consumo di token) per le cinque categorie supportate nativamente (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Le categorie rimanenti vengono verificate tramite una chiamata di classificazione LLM utilizzando il modello dei guardrails selezionato.
- **Credenziali Google / personalizzate** — tutte le categorie vengono verificate tramite una chiamata di classificazione LLM utilizzando la credenziale e il modello dei guardrails selezionati.

Quando il modello principale utilizza un provider personalizzato (ad es. Zhipu, Cerebras) che potrebbe restituire 404 o altri errori API, selezionare una **credenziale OpenAI o Google** per i guardrails.

## Formato dell'errore

Quando un guardrail viene attivato, il nodo genera un errore con il seguente messaggio:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Il campo `output` del risultato del nodo include inoltre `guardrail_violated_categories` (array delle etichette delle categorie violate), in modo che il Debug Panel e la Cronologia delle esecuzioni possano mostrare chiaramente "Blocked by: X, Y".

Utilizzare l'opzione **Continue on error** del nodo (o un nodo [Error Handler](../nodes/error-handler-node.md)) per indirizzare il workflow verso un ramo di fallback quando i guardrails vengono attivati.

## Workflow di esempio

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Note

- **Nessun nuovo tentativo**: le violazioni dei guardrails sono blocchi intenzionali e non vengono mai ritentate, anche se il nodo ha l'opzione "Retry on failure" abilitata.
- Non è richiesta alcuna migrazione del database — le impostazioni dei guardrails sono memorizzate nel JSON del nodo del workflow insieme agli altri dati del nodo.
- I guardrails verificano il **messaggio utente** risolto (dopo la valutazione delle espressioni di template), non il template grezzo.
- Impostare **nessuna categoria** con i guardrails abilitati equivale ad averli disabilitati — non viene eseguito alcun controllo.
- Con severità **Low**, la classificazione LLM viene sempre eseguita (copertura multilingue ottimale). Le credenziali OpenAI eseguono inoltre la Moderation API.
- Con severità **Medium/High**, le credenziali OpenAI utilizzano la Moderation API per le categorie supportate nativamente e la classificazione LLM per le restanti. Le credenziali Google/personalizzate utilizzano sempre la classificazione LLM.
- La classificazione LLM è **indipendente dalla lingua** — rileva violazioni in turco, arabo, russo, spagnolo e altre lingue.