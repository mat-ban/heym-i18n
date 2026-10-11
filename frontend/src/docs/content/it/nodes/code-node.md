# Code

Il nodo **Code** esegue il codice Python da Lei scritto, con il relativo `requirements.txt`, e restituisce JSON. Ogni esecuzione riceve un container completamente nuovo, che viene distrutto al termine dell'esecuzione: un'esecuzione non può quindi mai vedere o influenzare un'altra.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.result` (ciò che `main` ha restituito), più `$nodeLabel.logs` e `$nodeLabel.install` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `codeSource` | string | Sorgente Python. Deve definire `main(params)` e restituire un valore serializzabile in JSON |
| `codeParameters` | expression | Un oggetto JSON che collega i dati del workflow al codice. Le espressioni vengono risolte prima dell'esecuzione del codice |
| `codeRequirements` | string | Contenuto di `requirements.txt`, un pacchetto per riga. Se vuoto, l'installazione viene saltata |
| `codeAllowNetwork` | boolean | Indica se il codice stesso può accedere alla rete (predefinito `false`) |

## La funzione `main`

Il codice deve definire una `main` di primo livello che accetta un argomento:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Le istruzioni a livello di modulo vengono eseguite, ma solo ciò che `main` restituisce diventa l'output del nodo.

L'editor mostra i numeri di riga e il pulsante di espansione accanto a **Format** ne apre uno più grande, che si chiude con `Esc`: le modifiche vengono applicate mentre si digita, quindi non c'è nulla da salvare. Il pulsante **Format** riformatta il codice con Ruff, preservando i commenti. Ripara inoltre i danni all'indentazione che di solito derivano dall'incollare il codice: un blocco indentato in modo uniforme, tabulazioni mescolate a spazi e una riga spostata di uno o due spazi rispetto al proprio blocco vengono tutti corretti anziché rifiutati. Un vero errore di sintassi viene invece segnalato con la relativa riga e colonna. La formattazione viene eseguita nello stesso container isolato in cui viene eseguito il nodo — senza rete e senza l'ambiente del backend — quindi richiede Docker esattamente come l'esecuzione.

## Lettura dei parametri

`params` supporta la notazione con punto, anche attraverso oggetti e liste annidati:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` legge le chiavi che non sono identificatori Python validi
- `params.get("maybe")` restituisce `None` invece di sollevare un'eccezione quando una chiave è assente
- `params.to_dict()` restituisce il dizionario semplice
- La lettura di una chiave mai fornita solleva un errore che indica la chiave e l'elenco di quelle disponibili

## Output

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — il valore restituito da `main`. I nodi a valle leggono `$nodeLabel.result.message`
- `logs` — tutto ciò che il codice ha inviato a `print`, catturato separatamente in modo che non corrompa mai il risultato
- `install` — quale strumento ha installato le dipendenze (`uv`, `pip` o `none`) e il relativo output

## Dipendenze

Elencare i pacchetti in `requirements.txt` esattamente come si farebbe in locale:

```
requests==2.32.3
feedparser
```

I pacchetti vengono installati con `uv` in una directory temporanea prima dell'esecuzione del codice; se `uv` non riesce a gestire un pacchetto, Heym riprova con `pip`. Nulla viene memorizzato nella cache tra un'esecuzione e l'altra, quindi le dipendenze pesanti aggiungono diversi secondi a ogni esecuzione. Lasciare `requirements.txt` vuoto salta del tutto la fase di installazione ed è sensibilmente più veloce.

I pacchetti che non forniscono un wheel e richiedono un compilatore C non verranno installati. Il motivo compare in `install.log`.

## Rete

| Fase | Rete |
|-------|---------|
| Installazione delle dipendenze | Sempre attiva — pip e uv devono raggiungere PyPI |
| Esecuzione del codice | Disattivata per impostazione predefinita. `codeAllowNetwork` la attiva |

Con `codeAllowNetwork` disattivato, una chiamata in uscita come `requests.get(...)` fallisce con un errore di connessione. È il comportamento predefinito previsto: la maggior parte dei nodi Code trasforma dati che un altro nodo ha già recuperato. Si preferisca recuperare i dati con un nodo **HTTP** e passare il body tramite `codeParameters`.

## Sandbox e limiti

Il codice viene eseguito come utente non root in un container con tutte le capability Linux rimosse, `no-new-privileges` impostato e un filesystem root di sola lettura. Non riceve alcun socket Docker né alcuno dei segreti o delle variabili d'ambiente del backend.

| Limite | Valore |
|-------|-------|
| Memoria | 512 MB |
| CPU | 1 |
| Processi | 256 |
| Timeout installazione dipendenze | 120 secondi |
| Timeout esecuzione | 60 secondi |

Queste sono proprietà fisse della sandbox, non configurabili.

> **Docker è necessario.** A differenza degli strumenti e delle skill Python dell'Agent, il nodo Code non ha alcuna modalità di fallback locale né una variabile d'ambiente per allentare il vincolo. Senza un daemon Docker raggiungibile, il nodo fallisce con un errore chiaro anziché eseguire il codice nel processo del backend. Nello sviluppo nativo con `./run.sh`, avviare Docker prima di utilizzare questo nodo. Vedere [Security → Code node sandbox](../reference/security.md#code-node-sandbox).
## Utilizzare un altro nodo quando uno è adeguato

| Se si desidera | Utilizzare |
|-------------|-----|
| Analizzare o costruire CSV, TSV, XML oppure eseguire OCR su un file | [Converter](converter-node.md) |
| Chiamare un'API HTTP | [HTTP](http-node.md) |
| Mappare o rinominare campi | [Set](set-node.md) |
| Eseguire un altro workflow | [Execute](execute-node.md) |

Ricorrere a **Code** quando la logica non si adatta genuinamente a tali nodi — calcoli personalizzati, parsing su misura o un algoritmo.

## Esempio

Assegnare un punteggio alle righe prodotte da un nodo a monte:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Con `codeParameters` impostato su `{ "rows": "$fetchRows.result" }`, i nodi a valle leggono `$scoreRows.result.total`.
