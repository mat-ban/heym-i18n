# Cronologia

La Cronologia tiene traccia delle versioni salvate di un workflow. La si utilizza per visualizzare le modifiche nel tempo, confrontare le versioni o ripristinare uno stato precedente.

**Nota:** La Cronologia è diversa dalla [Cronologia delle esecuzioni](./execution-history.md). La Cronologia tiene traccia dei **salvataggi** (modifiche alla struttura del workflow); la Cronologia delle esecuzioni tiene traccia delle **esecuzioni** (esecuzioni passate).

## Dove trovarla

**Barra degli strumenti dell'editor** → **Cronologia** (icona GitBranch)

## Versioni

Una nuova versione viene creata ogni volta che si **salva** il workflow. L'elenco mostra:

- **Corrente** – L'ultimo stato salvato (quello visualizzato sul canvas)
- **Versione N** – Salvataggi precedenti con marca temporale

Le versioni prive di modifiche rispetto alla precedente sono nascoste.

## Vista delle differenze

Selezionare una versione per visualizzare le modifiche rispetto al workflow corrente:

| Tipo di modifica | Descrizione |
|-------------|--------------|
| **Nodi** | Nodi aggiunti, rimossi o modificati |
| **Connessioni** | Connessioni aggiunte, rimosse o modificate |
| **Configurazione** | Impostazioni a livello di workflow (autenticazione, limiti di frequenza, ecc.) |

Espandere ciascuna modifica per visualizzare le differenze a livello di campo (ad esempio, quali proprietà del nodo sono cambiate).

## Anteprima

Per visualizzare l'aspetto del workflow in una versione precedente, fare clic su **Anteprima** accanto a Ripristina.

Si apre un canvas in sola lettura che mostra i nodi e le connessioni di quella versione. È possibile eseguire pan e zoom per esplorare il layout; da questa vista non è possibile apportare modifiche.

## Ripristino

Per ripristinare una versione precedente:

1. Selezionare la versione desiderata
2. Fare clic su **Ripristina**
3. Confermare l'azione
4. Il workflow corrente viene sostituito con la versione selezionata; la pagina si ricarica

Il ripristino crea un nuovo stato "corrente": è possibile ripristinare nuovamente se necessario.

## Cancellazione della cronologia

Fare clic sull'icona del cestino nell'intestazione della finestra di dialogo per rimuovere tutta la cronologia delle versioni. Questa azione non può essere annullata. Il workflow corrente rimane invariato; vengono eliminate solo le versioni precedenti.

## Quando vengono create le versioni

Le versioni vengono create solo quando si **salva** (Ctrl/Cmd+S o il pulsante Salva). Le modifiche non salvate non vengono memorizzate nella Cronologia finché non si salva.

Le modifiche alle competenze degli agenti sono incluse in queste istantanee. Per sfogliare o ripristinare una singola competenza senza ripristinare l'intero workflow, utilizzare il pulsante **Cronologia** sulla scheda di tale competenza nel pannello delle proprietà del Nodo Agent. Vedere [Nodo Agent](../nodes/agent-node.md#skill-history).

## Correlati

- [Cronologia delle esecuzioni](./execution-history.md) – Esecuzioni passate e Bring to Canvas
- [Struttura del workflow](./workflow-structure.md) – Formato di nodi e connessioni
- [Scheda Workflows](../tabs/workflows-tab.md) – Creare e gestire i workflow