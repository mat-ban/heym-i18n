# Impostazioni

La finestra di dialogo Impostazioni consente di gestire il profilo, impostare istruzioni IA persistenti, aggiornare la password dell'account, configurare la voce della chat, impostare la credenziale e il modello IA predefiniti e verificare lo stato di osservabilità. Per aprirla, fare clic su **avatar e nome** nell'angolo in alto a destra dell'intestazione.

## Apertura della finestra di dialogo

Fare clic su **avatar e nome** in alto a destra nell'intestazione. La finestra di dialogo si apre con le seguenti schede: **Profilo**, **Sicurezza**, **Voce**, **Impostazioni predefinite IA** e **Osservabilità**. Gli amministratori dell'istanza visualizzano anche una scheda **SSO**.

## Scheda Profilo

### Immagine del profilo

Heym mostra l'immagine [Gravatar](https://gravatar.com) associata all'email dell'account nell'intestazione, accanto ai messaggi in [Chat](../tabs/chat-tab.md) e **Chat with Heym**, nei commenti della [Board](../tabs/board-tab.md) e accanto al nome nelle finestre di condivisione e negli elenchi dei membri del team. Per modificarla, aggiornare l'immagine su Gravatar; Heym acquisisce quella nuova entro poche ore. In assenza di un'immagine Gravatar, Heym mostra la prima lettera del nome.

L'immagine viene recuperata dal server Heym e memorizzata nella cache del server, pertanto il browser non contatta mai Gravatar. Se il server non riesce a raggiungere Gravatar, tutti continuano a visualizzare le iniziali.

### Nome

Il nome visualizzato nell'applicazione. Questo campo è obbligatorio e non può essere lasciato vuoto.

### Regole utente

Le Regole utente sono istruzioni personalizzate iniettate automaticamente in ogni richiesta IA, sia nel workflow builder sia nella chat della dashboard. Nel **workflow builder** ([AI Assistant](./ai-assistant.md)), vengono aggiunte al system prompt utilizzato per generare il JSON del workflow. Nella **chat della dashboard**, vengono applicate come contesto a livello di sistema. È sufficiente scriverle una volta e si applicano globalmente, senza doverle ripetere in ogni prompt.

**Utilizzi comuni:**

- Lingua o tono: `Rispondi sempre in italiano. Mantieni le risposte concise.`
- Stile di programmazione: `Usa pattern async/await. Preferisci le interfacce TypeScript ai type.`
- Convenzioni dei workflow: `Includi la gestione degli errori in tutti i workflow. Usa etichette descrittive per i nodi.`
- Formato delle risposte: `Usa elenchi puntati. Evita spiegazioni prolisse.`

**Dove si applicano:**

| Contesto | Descrizione |
|---------|-------------|
| **Workflow builder** | Richieste dell'[AI Assistant](./ai-assistant.md) per generare o modificare workflow |
| **Chat della dashboard** | Tutte le conversazioni della [scheda Chat](../tabs/chat-tab.md) |

Le Regole utente vengono iniettate a livello di sistema: vengono eseguite automaticamente prima di ogni prompt, senza alcuna configurazione aggiuntiva per workflow o conversazioni.

### Salvataggio delle modifiche al profilo

Fare clic su **Save Changes** per applicare. Le modifiche hanno effetto immediato per tutte le nuove richieste IA.

## Scheda Sicurezza

### Modifica della password

Utilizzare la scheda Sicurezza per aggiornare la password dell'account.

**Requisiti:**

| Regola | Requisito |
|------|-------------|
| Lunghezza minima | 8 caratteri |
| Maiuscole | Almeno una lettera maiuscola (A–Z) |
| Minuscole | Almeno una lettera minuscola (a–z) |
| Cifra | Almeno un numero (0–9) |

La password deve inoltre essere diversa da quella corrente. Queste regole vengono applicate sia sul frontend sia sul backend.

**Passaggi:**

1. Inserire la **Password corrente**
2. Inserire la **Nuova password** (deve soddisfare tutti i requisiti sopra indicati)
3. Reinserirla in **Conferma nuova password**
4. Fare clic su **Update Password**

Se la password corrente non è corretta, viene mostrato un messaggio di errore inline. In caso di successo, viene visualizzato un messaggio di conferma e il modulo si reimposta automaticamente.

## Scheda Voce

La scheda Voce configura la voce parlata per la [scheda Chat](../tabs/chat-tab.md): selezionare una **credenziale ElevenLabs** (oppure aggiungerne una inline), scegliere una **Voce** dall'account ElevenLabs e fare clic su **Save Voice Settings**. Ciò abilita la lettura ad alta voce per singolo messaggio e la modalità vocale interattiva. Per il flusso completo, consultare [Chat Voice (TTS & STT)](./chat-voice.md).

## Scheda Impostazioni predefinite IA

La scheda Impostazioni predefinite IA presenta due sezioni.

### Credenziale e modello preferiti

Selezionare una **credenziale LLM preferita** e un **modello** dalla stessa. Questa diventa l'impostazione predefinita di partenza per ogni funzionalità IA dell'applicazione — chat, [AI Assistant](./ai-assistant.md) (builder, analyzer e creazione di workflow), board mapper, widget IA della dashboard, [docs chat](../tabs/chat-tab.md), helper dello schema IA delle tabelle dati, expression builder ed evals — ogni volta che tale superficie non dispone di una selezione salvata propria.

La regola di selezione seguita da ciascuna superficie è la seguente:

1. **Selezione salvata** — una scelta già effettuata su quella superficie (ad esempio l'ultimo modello di una conversazione in chat) ha sempre la precedenza.
2. **Preferita** — utilizzata quando non esiste una selezione salvata.
3. **Prima credenziale disponibile** — il fallback quando non è stata impostata alcuna preferenza.

È comunque possibile modificare la credenziale e il modello per singola superficie in qualsiasi momento; la preferenza determina solo l'impostazione predefinita iniziale. Lasciare la credenziale su **No preference** per mantenere il precedente comportamento basato sulla prima credenziale disponibile. Se la credenziale preferita viene successivamente eliminata o la condivisione viene revocata, la scheda mostra un avviso e le superfici tornano silenziosamente alla prima credenziale disponibile.

### Utilizzo del pacchetto di codifica

Per ciascuna credenziale **Codex** (incluse quelle condivise) la scheda mostra l'utilizzo residuo del limite di frequenza come barra orizzontale per ogni finestra attiva — ad esempio una finestra di **5 ore** e/o una finestra **Settimanale**, in base al piano sottoscritto. Ogni barra indica la percentuale di quota residua e un conto alla rovescia per il ripristino. Un pulsante **Aggiorna** esegue una nuova richiesta su domanda (i risultati vengono memorizzati brevemente nella cache sul server).

Per ciascuna credenziale **OpenCode** la scheda mostra le finestre di sottoscrizione di OpenCode Go — **5 ore**, **Settimanale** e **Mensile** — con lo stesso stile di barra, lette dall'endpoint di utilizzo autenticato del gateway tramite la chiave API di quella credenziale. Una finestra che ha raggiunto il proprio limite viene mostrata come **"limite raggiunto"** in ambra. Se la chiave non è valida o il workspace non dispone di una sottoscrizione Go, la scheda indica il motivo anziché mostrare le barre.

## Scheda Observability

La scheda Observability mostra lo stato di sola lettura di [OpenTelemetry Tracing](./opentelemetry.md) per questa istanza: se il tracciamento è abilitato, l'endpoint OTLP, il nome del servizio, il rapporto del sampler e quali span vengono emessi. Il tracciamento viene configurato tramite le variabili d'ambiente `HEYM_OTEL_*` sul backend, pertanto questa scheda non modifica nulla. Quando il tracciamento è disabilitato, la scheda elenca le variabili d'ambiente necessarie per abilitarlo. I segreti come le intestazioni di autenticazione OTLP non vengono mai mostrati qui. Consultare [Variabili d'ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) per il riferimento completo alla configurazione.

## Scheda SSO

Visibile solo agli amministratori dell'istanza — gli account elencati in `HEYM_ADMIN_EMAILS`. Questa scheda connette Heym a un provider OpenID Connect esterno, in modo che gli utenti accedano con gli account di cui già dispongono. Inserire un URL dell'issuer e le credenziali del client, copiare l'URI di reindirizzamento di sola lettura nel provider ed eseguire **Verifica connessione** prima di abilitarla. Una volta superato il test, da qui è possibile disattivare l'accesso tramite password. Consultare [Single Sign-On](./sso.md) per la configurazione completa.

## Scheda Instances

Visibile solo agli amministratori dell'istanza — gli account elencati in `HEYM_ADMIN_EMAILS`. Questa scheda elenca le istanze Heym connesse a questo database e imposta come le esecuzioni in background vengono suddivise tra esse. Ogni riga mostra il nome modificabile dell'istanza, il suo ruolo, se è attiva, la latenza misurata verso il database, un interruttore on/off e il suo peso. I pesi sono quote delle istanze che possono attualmente accettare lavoro, non percentuali su 100: con `41 / 26 / 33` e la terza istanza disattivata, le prime due ricevono effettivamente il 61% e il 39%. Il pannello stampa tale suddivisione effettiva sotto la tabella e rifiuta il salvataggio solo quando nessuna istanza abilitata ha un peso.

**Assegna automaticamente una quota alle nuove istanze** è attivo per impostazione predefinita: un'istanza che si aggiunge rimarrebbe altrimenti con peso 0 e non riceverebbe nulla, quindi il leader le assegna una quota uguale una sola volta e ridimensiona i pesi esistenti verso il basso mantenendone i rapporti. Non interviene mai su un'istanza il cui peso è stato impostato manualmente.

Il pannello riporta inoltre quante delle esecuzioni delle ultime 24 ore hanno potuto essere eseguite solo sull'istanza principale. Quando tale quota è elevata, i pesi sottostanti non possono spostare quel lavoro. Consultare [Distribuzione del carico](./cluster.md) per sapere cosa rimane sull'istanza principale e come scegliere i valori numerici.

## Cosa non è presente in questa finestra di dialogo

| Funzionalità | Dove trovarla |
|---------|-----------------|
| **Gestione chiavi API (MCP)** | [Scheda MCP](../tabs/mcp-tab.md) – visualizzare, copiare e rigenerare la chiave API del server MCP |
| **Tema (scuro / chiaro)** | Pulsante di attivazione Sole/Luna nell'intestazione (accanto al badge utente) |
| **Modifica email** | Attualmente non supportata |

## Correlati

- [Assistente IA](./ai-assistant.md) – Chat del builder di Workflow che utilizza le Regole utente
- [Scheda Chat](../tabs/chat-tab.md) – Chat della dashboard che utilizza le Regole utente
- [Chat vocale (TTS e STT)](./chat-voice.md) – Voce ElevenLabs configurata nella scheda Voice
- [Scheda MCP](../tabs/mcp-tab.md) – Chiave API del server MCP ed esposizione degli strumenti di workflow
- [Scheda Credentials](../tabs/credentials-tab.md) – Chiavi API per i nodi IA e le integrazioni
- [Sicurezza](./security.md) – Gestione delle sessioni, limitazione della frequenza, crittografia delle credenziali
- [Single Sign-On](./sso.md) – Connettere un provider OpenID Connect esterno
- [OpenTelemetry Tracing](./opentelemetry.md) – Tracciamento distribuito per le esecuzioni di workflow e nodi
