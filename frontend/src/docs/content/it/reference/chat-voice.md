# Chat Voice (TTS e STT)

La scheda Chat può leggere i messaggi ad alta voce e attivare una modalità vocale interattiva a mani libere, basata su [ElevenLabs](https://elevenlabs.io). Entrambe le direzioni utilizzano un'unica credenziale ElevenLabs: **text-to-speech** per la riproduzione e **Scribe speech-to-text** per il microfono.

## Configurazione

1. Aprire **Impostazioni** (il proprio avatar, in alto a destra) → scheda **Voce**.
2. Selezionare una **credenziale ElevenLabs** oppure fare clic su **Aggiungi credenziale** per crearne una. La chiave API deve disporre delle autorizzazioni **Text to Speech**, **Speech to Text** e **Voices** abilitate nel proprio account ElevenLabs.
3. Scegliere una **Voce** dal proprio account ElevenLabs.
4. Fare clic su **Salva impostazioni voce**.

Se si preme un pulsante vocale prima di aver completato questa configurazione, la scheda Voce si apre automaticamente per consentire di terminare la configurazione.

La chiave API di ElevenLabs viene memorizzata in forma cifrata e non raggiunge mai il browser: tutte le chiamate sono inoltrate tramite il backend di Heym. Vedere [Credenziali](./credentials.md) e [Impostazioni](./user-settings.md).

## Leggere un messaggio ad alta voce

Ogni fumetto di messaggio (sia proprio che dell'assistente) presenta un pulsante altoparlante accanto a **Copia**. Fare clic su di esso per riprodurre il messaggio; fare nuovamente clic — oppure riprodurre un altro messaggio — per interrompere. La riproduzione utilizza il modello multilingue di ElevenLabs, pertanto la lingua del testo viene rilevata automaticamente.

## Modalità vocale interattiva

Il pulsante a forma d'onda nell'input della chat apre una modalità vocale a schermo intero e a mani libere (compatibile con tema chiaro/scuro e dispositivi mobili):

1. Ascolta attraverso il microfono e rileva quando si smette di parlare.
2. Il parlato viene trascritto con **Scribe** (lingua rilevata automaticamente — nessun interruttore manuale TR/EN).
3. La trascrizione viene inviata come normale messaggio di chat nella **stessa conversazione**.
4. La risposta dell'assistente viene riprodotta ad alta voce, quindi la modalità riprende ad ascoltare.

Utilizzare il pulsante **muto** per sospendere l'ascolto e la **✕** per uscire (operazione che rilascia il microfono). La registrazione funziona in tutti i browser moderni, incluso Firefox.

## Note

- La selezione della voce e della credenziale costituisce una preferenza per singolo utente; la conversazione attiva, il modello e la credenziale per l'LLM rimangono invariati.
- L'utilizzo di ElevenLabs (sia TTS che STT) viene fatturato sul proprio account ElevenLabs.

## Correlati

- [Scheda Chat](../tabs/chat-tab.md) – La chat della dashboard in cui risiede la funzione vocale
- [Credenziali](./credentials.md) – Come vengono memorizzate e referenziate le chiavi API
- [Impostazioni](./user-settings.md) – Dove si trova la scheda Voce