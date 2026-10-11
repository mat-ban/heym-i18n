# Scheda Drive

La scheda Drive mostra tutti i file generati dalle skill all'interno dei workflow.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Guarda la demo di Drive</a></p>

## Panoramica

I file generati dalle skill (PDF, DOCX, CSV, immagini, ecc.) vengono archiviati e elencati automaticamente nella scheda Drive. Per ciascun file sono mostrati il nome, il tipo, la dimensione, il nodo di origine, la data di creazione e lo stato di condivisione con i team.

## Funzionalità

- **Ricerca** - Filtrare i file per nome, tipo o nodo di origine
- **Copia ID file** - Copiare l'UUID del file negli appunti, pronto per essere incollato in un nodo [Drive](../nodes/drive-node.md) o [Converter](../nodes/converter-node.md)
- **Download** - Download autenticato dei propri file e dei file condivisi tramite i team
- **Condivisione** - Creare link di download condivisibili con protezione tramite password ed expirazione opzionali, oppure condividere un file in sola lettura con i team di appartenenza
- **Eliminazione** - Rimuovere i file e i relativi link di condivisione
- **Cancella tutto** - Eliminare tutti i file e i relativi link di condivisione previa conferma
- **Azioni in blocco** - Selezionare più file tramite le caselle di controllo (Shift-click per selezionare un intervallo) e applicare la stessa azione a tutti contemporaneamente
- **Paginazione** - Sfogliare raccolte di file di grandi dimensioni, con un selettore di righe per pagina (25 / 50 / 100 / Tutti)

## Azioni in blocco

I file di proprietà mostrano una casella di controllo all'inizio della riga (i file condivisi tramite un team sono in sola lettura e non selezionabili). Selezionare più righe — oppure utilizzare la casella di controllo dell'intestazione per selezionare l'intera pagina, e **Shift-click** per selezionare un intervallo — quindi utilizzare la barra delle azioni in blocco che appare sopra l'elenco:

- **Download ZIP** raggruppa tutti i file selezionati in un unico archivio ZIP e lo scarica
- **Azioni in blocco** apre un'unica finestra di dialogo per applicare un'impostazione a tutti i file selezionati:
  - **Condividi tutti con i miei team** / **Rimuovi condivisione con i team** con un solo clic
  - **Crea link di condivisione per ciascun file** utilizzando le stesse impostazioni di password, expirazione e download massimi
- **Elimina** rimuove tutti i file selezionati e i relativi link di condivisione previa conferma
- **Cancella selezione** deseleziona tutto

La finestra di dialogo indica a quanti file è stata applicata l'azione (i file di cui non si è proprietari vengono ignorati). Utilizzare l'opzione **Tutti** del selettore di righe per pagina per caricare tutti i file in un'unica pagina e selezionare sull'intero Drive. Digitando nella casella di ricerca il selettore di righe per pagina passa automaticamente a **Tutti**, in modo che la ricerca copra ogni file e non solo la pagina corrente; cancellando la ricerca viene ripristinata la selezione precedente.

## Condivisione

Creare link di condivisione con:
- **Nessuna autenticazione** - URL di download pubblico basato su token
- **Basic Auth** - Link protetto da password (nome utente: `file`)
- **Expirazione** - Expirazione opzionale basata sul tempo
- **Limiti di download** - Numero massimo di download opzionale

Abilitare **Condividi con i miei team** su un file per renderlo visibile a tutti i team di appartenenza. I membri dei team con cui è condiviso ottengono accesso in sola lettura; le azioni di gestione restano riservate al proprietario.

## Accesso alle skill dell'Agent

Le skill sul nodo Agent possono abilitare la lettura dei file di Drive. Quando **Abilita file Drive** è attivo per una skill, il relativo codice Python può leggere i file di Drive accessibili tramite ID file o nome file esatto attraverso l'helper generato `heym_drive.py`. L'impostazione è disattivata per impostazione predefinita.

Per tutti i dettagli, consultare il [riferimento Drive](../reference/drive.md).

## Correlati

- [Nodo Drive](../nodes/drive-node.md) - Elencare file, recuperare metadati, condividere con i team o modificare i vincoli di condivisione da un workflow
- [Generazione di file](../reference/file-generation.md) - Come le skill generano i file
- [Riferimento Drive](../reference/drive.md) - Link di condivisione, token e pulizia
- [Portale](../reference/portal.md) - Link ai file nelle risposte della chat del portale
