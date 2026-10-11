# Drive

La scheda Drive offre uno spazio centralizzato per visualizzare, gestire e condividere tutti i file generati dalle skill.

## Accesso a Drive

Accedere alla scheda **Drive** nella dashboard. Tutti i file generati dalle skill del workflow vengono visualizzati qui, ordinati per data di creazione.

## Elenco dei file

L'elenco dei file mostra:

- **Nome** - Nome file originale con un'icona specifica per il tipo
- **Tipo** - Tipo MIME del file (ad es. pdf, csv, docx)
- **Dimensione** - Dimensione del file in formato leggibile
- **Origine** - L'etichetta del nodo che ha generato il file
- **Data** - Data di creazione del file
- **Azioni** - Pulsanti di download, condivisione ed eliminazione

## Azioni in blocco

Ogni file di proprietà dell'utente presenta una casella di selezione all'inizio della riga. I file condivisi tramite un team sono di sola lettura e non possono essere selezionati. Selezionare più file (con Shift-clic si seleziona un intervallo contiguo; la casella di selezione nell'intestazione seleziona l'intera pagina) per visualizzare la barra delle azioni in blocco sopra l'elenco, quindi fare clic su **Azioni in blocco** per aprire un'unica finestra di dialogo che applica la stessa impostazione a ogni file selezionato:

- **Condividi tutti con i miei team** / **Rimuovi condivisione team** — attiva o disattiva la condivisione con i team per tutti i file selezionati contemporaneamente
- **Crea link di condivisione per ogni file** — crea un link di condivisione su ogni file selezionato utilizzando gli stessi valori di scadenza, password e download massimi

La finestra di dialogo indica a quanti file è stata applicata l'operazione; i file di cui non si è proprietari vengono ignorati. Il selettore delle righe per pagina (25 / 50 / 100 / **Tutti**) in fondo all'elenco consente di caricare più file su una singola pagina, così da poter selezionare file nell'intero Drive.

## Condivisione dei file

Fare clic sull'icona **Condividi** per aprire la finestra di dialogo di condivisione. È possibile creare più link di condivisione per file con configurazioni diverse e, facoltativamente, condividere il file con i team di appartenenza correnti.

### Link pubblico (basato su Token)

Creare un link di condivisione senza password. Chiunque disponga del link può scaricare il file.

### Link protetto da password (Basic Auth)

Impostare una password al momento della creazione della condivisione. L'URL di download utilizza l'autenticazione HTTP Basic: i browser richiederanno nome utente (`file`) e password all'apertura del link.

### Opzioni del link

- **Scadenza (ore)** - Impostare facoltativamente un tempo di scadenza
- **Download massimi** - Limitare facoltativamente il numero di download
- Entrambe le opzioni possono essere combinate per il massimo controllo

### Condividi con i miei team

Abilitare **Condividi con i miei team** per concedere accesso in sola lettura a tutti i team di cui si è attualmente membri. I membri del team possono visualizzare e scaricare il file da Drive e utilizzare le operazioni del nodo Drive orientate alla lettura, ma solo il proprietario del file può eliminarlo, creare o revocare link pubblici oppure modificare password, TTL e limiti di download.

L'impostazione è specifica per singolo file. Se in seguito si aderisce a un altro team o se ne crea uno nuovo, attivare nuovamente la condivisione oppure eseguire l'operazione `shareWithMyTeams` del nodo Drive per aggiungere quel team. Utilizzare `unshareWithMyTeams` per rimuovere le condivisioni team dal file all'interno di un workflow.

### Gestione delle condivisioni

La finestra di dialogo di condivisione mostra tutti i link di condivisione esistenti con:
- Conteggio dei download corrente
- Stato di scadenza
- Indicazione se Basic Auth è abilitata
- Pulsanti di copia e revoca

## Link ai file in Chat e Portal

Quando una skill genera file durante l'esecuzione di un workflow tramite la chat del Portal o il Quick Drawer, i link di download compaiono automaticamente nella risposta. Gli utenti possono fare clic per scaricare direttamente.

## Archiviazione

I file generati sono archiviati nel filesystem del server sotto `data/files/`. Nelle distribuzioni Docker, questa directory è montata come volume per garantirne la persistenza.

## Gestione dei file dai workflow

Il [nodo Drive](../nodes/drive-node.md) consente di gestire i file di Drive in modo programmatico dall'interno di un workflow. Utilizzarlo per:

- **Elencare** i file e restituire metadati quali nome file, tipo MIME, dimensione, origine e URL di download
- **Eliminare** un file dopo che è stato consegnato all'utente
- **Condividere o annullare la condivisione con i team** affinché i membri del team possano leggerlo e scaricarlo solo finché la condivisione team è attiva
- **Impostare una password** sul link di download
- **Impostare un TTL** affinché il link scada dopo N ore
- **Impostare un limite di download massimi**

La conversione di un file in un altro formato è compito del [nodo Converter](../nodes/converter-node.md), con `conversion: "fileConvert"`. Esso legge un file di Drive e archivia il risultato convertito come nuovo file.

Fare riferimento al file tramite il suo ID dall'output della skill: `$agentLabel._generated_files[0].id`

Consultare la [documentazione del nodo Drive](../nodes/drive-node.md) per i dettagli di configurazione.

## Lettura dei file di Drive dalle skill

Le skill degli agenti possono abilitare la lettura da Drive tramite l'impostazione **Abilita file Drive** nella scheda della skill. Quando è abilitata, il runtime della skill include un helper generato `heym_drive.py`. Il codice della skill può importare helper quali `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` e `list_drive_files`.

Le letture da Drive sono limitate ai file accessibili all'attore del workflow: file di proprietà e file condivisi con l'attore tramite i team. Utilizzare un ID file per una ricerca esatta, oppure un nome file esatto quando l'utente fa riferimento a un file per nome. La ricerca per nome file restituisce il file accessibile più recente con quel nome; `list_drive_files(filename="...")` restituisce tutte le corrispondenze.
## Correlati

- [Nodo Drive](../nodes/drive-node.md) - Operazioni del Workflow (elenco, recupero, eliminazione, password, TTL, download massimi, condivisione team)
- [Scheda Drive](../tabs/drive-tab.md) - Sfogliare i file nella dashboard
- [Generazione file](./file-generation.md) - Come vengono prodotti `_generated_files` e gli URL di download

## Pulizia
I token di condivisione scaduti vengono eliminati automaticamente ogni giorno. I file stessi persistono fino all'eliminazione manuale tramite la scheda Drive. Utilizzare **Clear All** per eliminare tutti i file e i relativi link di condivisione con una sola azione.
