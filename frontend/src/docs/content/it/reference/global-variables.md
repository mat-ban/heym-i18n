# Variabili Globali

Il **Global Variable Store** contiene dati chiave-valore persistenti, con ambito utente, che sopravvivono tra le esecuzioni dei workflow. Utilizzarlo per configurazioni, feature flag, contatori o stato condiviso necessario a più workflow.

> **Non archiviare segreti in questa sede.** Le variabili globali non costituiscono una cassaforte per i segreti: i valori sono memorizzati non cifrati, vengono restituiti integralmente a chiunque ne condivida l'accesso e i collaboratori possono modificarli. Le chiavi API, le password e i token appartengono alle [Credenziali](./credentials.md), che li cifrano a riposo e non restituiscono mai il segreto al client.

## Locali vs Globali

| Store | Sintassi | Ambito | Persistenza |
|-------|--------|-------|-------------|
| **Workflow-local** | `$vars.variableName` | Solo esecuzione corrente | In memoria, persa al termine dell'esecuzione |
| **Globale** | `$global.variableName` | Tutti i workflow dell'utente | Persistita nel database |

## Creazione delle Variabili Globali

1. **Dalla scheda Variables** – [Variables Tab](../tabs/global-variables-tab.md): creare, modificare ed eliminare variabili direttamente.
2. **Da un Nodo Variable** – Abilitare **Store in Global Variable Store** (`isGlobal: true`) nelle proprietà del nodo. La variabile viene scritta nello store all'esecuzione del workflow.

## Utilizzo nelle Espressioni

Accedere alle variabili globali con `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Utilizzare gli stessi metodi delle variabili workflow-local (ad es. `.upper()`, `.length`, `.add()` per gli array).

## Tipi di Valore

Tipi supportati: `string`, `number`, `boolean`, `array`, `object`. Selezionare il tipo al momento della creazione o modifica di una variabile.

## Condivisione delle Variabili Globali

È possibile condividere una variabile globale con altri utenti o [Team](./teams.md), affinché possano utilizzarla nei propri workflow.

- **Condivisione con un utente** – Fare clic sull'icona di condivisione accanto a una variabile di proprietà, inserire l'email del destinatario e fare clic su **Share**. Il destinatario visualizzerà la variabile nel proprio elenco Global Variables con un badge **Shared** e un'etichetta "Shared by &lt;your email&gt;".
- **Condivisione con un team** – Nella finestra di condivisione, selezionare un team e fare clic su **Add**. Tutti i membri del team ottengono l'accesso.
- **Accesso in modifica** – I destinatari possono visualizzare, modificare e referenziare la variabile condivisa tramite `$global.variableName` nei propri workflow. Solo il proprietario può condividere, revocare la condivisione o eliminare la variabile.
- **Conflitti di nome** – Se un destinatario possiede già una variabile con lo stesso nome, la propria variabile prevale su quella condivisa.
- **Revoca della condivisione** – Aprire la finestra di condivisione della variabile e fare clic sul pulsante **×** accanto all'utente di cui si desidera rimuovere l'accesso.

## Integrazione con la Chat

Le variabili globali sono disponibili per l'assistente [Chat](../tabs/chat-tab.md). Il LLM può referenziarle quando risponde a domande o genera contenuti.

## Correlati

- [Variables Tab](../tabs/global-variables-tab.md) – Gestire le variabili globali nell'interfaccia
- [Variable Node](../nodes/variable-node.md) – Impostare variabili con `isGlobal`
- [Expression DSL](./expression-dsl.md) – Sintassi `$global`