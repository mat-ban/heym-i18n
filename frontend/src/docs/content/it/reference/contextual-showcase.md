# Contextual Showcase

Il **Contextual Showcase** è una guida contestuale leggera integrata nell'applicazione che illustra la pagina attualmente visualizzata senza indirizzare immediatamente l'utente verso un flusso documentale completo.

## Funzionalità

- Mostra un breve riepilogo della pagina corrente
- Mantiene il primo livello conciso per evitare sovraccarichi informativi
- Consente di espandere un limitato quantitativo di dettagli aggiuntivi solo quando necessario
- Fornisce link alla pagina completa della documentazione per un approfondimento

## Dove Appare

Nella v1, il showcase è disponibile sulle superfici principali autenticate di Heym:

- Schede della Dashboard
- [Evals](../tabs/evals-tab.md)
- [Documentazione](../getting-started/introduction.md)
- Il canvas dell'editor dei workflow

Le pagine pubbliche quali login, registrazione, portale Chat e revisione HITL non mostrano il showcase.

## Accesso

### Desktop

- Un trigger fisso **Page Guide** appare sul bordo destro dello schermo
- Il showcase si apre come drawer laterale destro
- Rimane chiuso per impostazione predefinita
- Un teaser una tantum contribuisce a segnalare l'esistenza della guida senza forzarne l'apertura

### Mobile

- Il medesimo contenuto è disponibile tramite un pulsante flottante **Page Guide**
- Si apre in un bottom sheet anziché in una barra laterale destra

## Modello dei Contenuti

Ogni voce del showcase utilizza una definizione strutturata anziché un componente completamente personalizzato.

- **Titolo** – Che cos'è questa pagina
- **Riepilogo** – Una breve spiegazione
- **Elenchi puntati** – Alcuni riferimenti di rapida consultazione
- **Highlights** – Piccole card per valore chiave o pattern di utilizzo
- **More Detail** – Sezioni comprimibili per contesto aggiuntivo
- **Azioni** – Generalmente uno o due link, il più delle volte alla documentazione completa

Ciò mantiene il sistema flessibile evitando pannelli di aiuto lunghi e ridondanti.

## Consapevolezza del Contesto

Il showcase cambia in base alla superficie corrente.

- Ogni scheda della Dashboard dispone di un proprio riepilogo
- L'editor rimanda a [Canvas Features](./canvas-features.md)
- La pagina della documentazione utilizza una panoramica generica della documentazione e, ove possibile, rimanda all'articolo corrente già aperto

## Persistenza

Il showcase memorizza una piccola quantità di stato personale dell'interfaccia nello storage del browser:

- Se il pannello o il bottom sheet era aperto da ultimo
- Quali contesti di pagina hanno già mostrato il teaser
- L'ultima sezione di dettaglio espansa per ciascun contesto

## Finalità

L'obiettivo è rendere Heym più semplice da apprendere senza aggiungere ulteriori elementi pesanti all'interfaccia.

- Guida breve e sempre a portata di mano per l'orientamento
- Percorso chiaro verso la documentazione approfondita
- Bassa interruzione per gli utenti esperti

## Correlati

- [Workflows Tab](../tabs/workflows-tab.md) – Superficie principale della Dashboard
- [Evals Tab](../tabs/evals-tab.md) – Workflow di valutazione
- [Canvas Features](./canvas-features.md) – Comportamento dell'editor e debug
- [Quick Drawer](./quick-drawer.md) – L'altra superficie di utilità fissa sul lato destro