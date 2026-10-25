# Heym Work

**Heym Work** è una seconda interfaccia per i team aziendali, creata su Heym. Gli utenti descrivono un'attività con le proprie parole, rispondono a poche domande e ottengono un workflow creato e testato da Heym. Lavorano su pagine create appositamente per loro, rispondono a richieste di revisione e visualizzano ogni esecuzione contrassegnata dal rispettivo responsabile. Heym esegue ogni attività in background.

Heym Work funziona come contenitore indipendente accanto a Heym, con una licenza separata fornita dal team di Heym. Per saperne di più e richiedere una versione di prova, consultare [heym.run/enterprise](https://heym.run/enterprise). Guardare il [video di Heym Work](https://youtu.be/5Z2gGo6bcpU) per una panoramica di due minuti.

## Cosa ottengono i team aziendali

| Area | Cosa fa |
|------|---------|
| **Chat** | Descrivere un'attività tramite testo o voce. Heym richiede le informazioni necessarie, crea il workflow, lo testa e lo contrassegna come Verificato. |
| **Flows** | Gli editor creano un flow da opzioni anziché su un canvas: cosa lo avvia, una bozza IA opzionale e azioni in Slack, Google Sheets ed e-mail. Le risposte di Slack proseguono l'esecuzione, e le approvazioni attendono anche in Attività. Vedi [Flows](#flows). |
| **Pagine** | Pagine fissate con widget: valori numerici, grafici, tabelle con chip di stato, aree di rilascio file e approvazioni. Una riga della tabella può aprire la propria pagina di dettaglio. |
| **Approvazioni** | Le revisioni provenienti dai passaggi [Human-in-the-Loop](./human-in-the-loop.md) attendono in Attività e sulle pagine, con le opzioni Approva, Richiedi modifiche e Rifiuta. |
| **Attività** | Ogni esecuzione, con l'indicazione di chi l'ha avviata e dell'istanza esecutrice. |
| **Ruoli** | Proprietario, Editor e Visualizzatore. L'accesso avviene tramite il [Single Sign-On](./sso.md) già configurato in Heym. |
| **Edizioni di settore** | Le edizioni per il settore legale, scolastico, finanziario, logistico, energetico ed e-commerce includono pagine preconfigurate, dati di esempio e workflow mirati. |

## Flows

**Flows** è presente nel menu di Heym Work per Editor e Proprietari. Un flow viene creato da scelte anziché da nodi, e Heym Work lo salva come normale workflow Heym tramite l'API Heym, per conto della persona che lo ha creato. Si applicano le regole di accesso, la cronologia modifiche e la sincronizzazione trigger di Heym come nell'editor, e ogni esecuzione appare in Attività come ogni altra.

| Parte | Opzioni |
|---|---|
| **Cosa lo avvia** | Su richiesta, in base a una pianificazione, su un messaggio Slack, quando cambia una scheda di Google Sheets (righe aggiunte, modificate o eliminate) o quando un'e-mail raggiunge una casella di posta. I trigger per fogli ed e-mail verificano ogni 1, 5, 15 o 60 minuti. |
| **Bozza IA** (opzionale) | Un modello e istruzioni trasformano ciò che ha avviato il flow in testo per i passaggi successivi. Un flow che non parte da un foglio o da un'e-mail può prima leggere i messaggi Slack recenti da un canale o thread. |
| **Cosa succede dopo** | Azioni in ordine, in uno qualsiasi dei tre strumenti, qualunque cosa abbia avviato il flow. **Slack:** messaggio di canale, messaggio diretto, modulo, messaggio con pulsanti, approvazione, risposta a thread, aggiornamento messaggio ed esito finale. **Google Sheets:** aggiungi una riga o aggiorna la riga modificata. **E-mail:** invia un'e-mail. |

- **Le risposte continuano l'esecuzione.** Un'approvazione, pulsanti o un modulo mettono in pausa l'esecuzione fino alla risposta di qualcuno in Slack. Un'approvazione attende anche in Attività, e una decisione presa in uno dei due punti rimuove i pulsanti dal messaggio Slack. I passaggi successivi di Slack rimangono nel thread del primo messaggio.
- **Una sola scheda Connessioni.** Ciascun flow mostra l'area di lavoro Slack, l'account Google Sheets e le caselle di posta da cui legge e invia. Sono credenziali Heym: **Slack Bot** (token bot, `xoxb-…`), **Google Sheets**, **IMAP** e **SMTP**; una credenziale mancante può essere aggiunta direttamente dal flow.
- **Un'unica app Slack per ogni flow.** Nell'app Slack, imposta l'URL richiesta interattività su `https://<tuo Heym>/api/slack/interactions/<id credenziale>` e l'URL richiesta sottoscrizioni eventi su `https://<tuo Heym>/api/slack/events/<id credenziale>`. Heym Work li mostra entrambi per la connessione scelta. Tutti i flow su quella credenziale li condividono.
- **I trigger Slack scelgono cosa ascoltare:** messaggi nei canali e nei DM, messaggi diretti al bot, menzioni del bot o messaggi in un singolo canale. I post del bot stesso non avviano mai un flow.
- **Requisiti.** I flow richiedono Heym 0.0.131 o versione successiva.

I passaggi creati da un flow sono gli stessi nodi che puoi usare sul canvas: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) e [Cron](../nodes/cron-node.md).

## Connessione di Heym Work

Guardare il [video di installazione](https://youtu.be/zXGfg1HPSLk) per l'intera procedura di configurazione, dal primo comando alla pagina iniziale.

La connessione viene configurata in **Impostazioni → Heym Work**. La scheda è visibile solo per gli amministratori dell'istanza indicati in `HEYM_ADMIN_EMAILS`.

| Campo | Cosa fa |
|-------|---------|
| **Indirizzo Heym Work** | L'indirizzo su cui viene eseguito Heym Work, ad esempio `https://work.example.com`. L'accesso rimanda a questo URL. Fare clic su **Salva**. |
| **Chiave di integrazione** | **Genera chiave** crea la chiave utilizzata da Heym Work per ogni richiesta inviata a Heym. Viene visualizzata una sola volta, con un pulsante di copia. Heym archivia unicamente il suo hash. |
| **Abilita Heym Work** | Attiva la connessione. Richiede preventivamente l'indirizzo e una chiave. |
| **Edizioni per settore e team** | Le edizioni per ambito legale, istruzione, finanza, logistica, energia ed e-commerce, oltre a edizioni IT, vendite, marketing e HR per team aziendali, si aprono con pagine, dati di esempio e workflow dedicati. |

Aprire quindi l'indirizzo di Heym Work e completare la configurazione:

1. **Licenza**: inserire la chiave di licenza fornita dal team di Heym.
2. **Heym**: specificare l'indirizzo di Heym e la chiave di integrazione.
3. **Proprietario**: accedere con un account configurato come Proprietario di Heym Work.

Viene visualizzata la pagina iniziale, pronta per il team.

### Rotazione della chiave

**Ruota chiave** sostituisce la chiave di integrazione. Heym Work smetterà di funzionare finché non verrà inserita la nuova chiave e tutti gli utenti collegati a Heym Work verranno disconnessi. Utilizzare questa opzione se si teme una compromissione della chiave o quando un collaboratore che ne era a conoscenza lascia l'azienda.

### Disattivazione della connessione

Disattivare **Abilita Heym Work** per interrompere il collegamento. Heym Work richiederà nuovamente la chiave di Heym. Heym continuerà comunque a elaborare tutti i workflow, le pianificazioni e i webhook.

## Modello di sicurezza

- **Ogni modifica passa attraverso Heym.** Heym Work recupera i dati visualizzati dal database di Heym e inoltra ogni azione a Heym attraverso un canale protetto da chiave, in cui Heym applica le proprie regole di autorizzazione. Heym Work mantiene i propri dati in uno schema separato denominato `heym_work`.
- **La chiave è protetta da hash a riposo.** Heym confronta l'hash della chiave fornita e non archivia mai la chiave in chiaro.
- **L'autenticazione resta su Heym.** Gli utenti eseguono l'accesso tramite Heym, sfruttando il proprio provider di identità quando è attivo il [SSO](./sso.md).
- **Le modifiche vengono registrate.** Il salvataggio della connessione e la rotazione della chiave generano le voci `work_integration.update` e `work_integration.key_rotate` nel [registro di audit](./audit.md).

## Licenze

Heym Work necessita di una chiave di licenza dedicata emessa dal team di Heym. Ogni giorno Heym Work trasmette a heym.run l'ID della licenza, l'ID dell'installazione, il conteggio degli utenti attivi negli ultimi 30 giorni, il numero totale di membri, le esecuzioni nelle ultime 24 ore e le versioni di Heym e Heym Work. I contenuti dei workflow, i dati in ingresso e in uscita e le credenziali rimangono sempre sui server locali.

Se la sincronizzazione giornaliera non riesce per 30 giorni, si avvia un periodo di tolleranza di 14 giorni, al termine del quale l'interfaccia di Heym Work richiederà una chiave a un Proprietario. Una versione di prova è valida fino all'ultimo giorno indicato e riprende quando il team di Heym la estende (è consentita una sola prova per installazione). Heym continua a operare regolarmente per l'intero periodo. Le reti isolate senza connessione Internet utilizzano una licenza offline richiedibile a enterprise@heym.run.

## Video

Tutti i video dedicati a Heym Work sono disponibili nella [playlist Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Argomenti correlati

- [Enterprise](./enterprise.md): Licenze commerciali e supporto
- [Single Sign-On](./sso.md): L'accesso utilizzato da Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Le revisioni visualizzate in Heym Work
- [Registro di audit](./audit.md): Le voci generate dalle modifiche alla connessione
- [Impostazioni](./user-settings.md): La scheda in cui è presente Heym Work
