# Scheda Variabili

La scheda **Variabili** gestisce l'**Archivio Globale delle Variabili** – dati persistenti chiave-valore condivisi tra tutti i workflow.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Guarda la demo delle Variabili</a></p>

## Panoramica

- Creare, modificare ed eliminare variabili globali
- Le variabili sono associate all'utente e persistono tra le esecuzioni dei workflow
- Fare riferimento nelle espressioni tramite `$global.variableName`

## Creazione di una Variabile

1. Fare clic su **Nuova Variabile**
2. Inserire un **nome** (utilizzato nelle espressioni)
3. Impostare il **valore** (stringa, numero, booleano, array o oggetto)
4. Scegliere il **tipo di valore** (Auto, String, Number, Boolean, Array, Object)

## Modifica ed Eliminazione

- **Modifica** – Fare clic sull'icona di modifica sulla riga della variabile
- **Eliminazione** – Fare clic sull'icona del cestino; i workflow che la utilizzano necessiteranno di una sostituzione
- **Eliminazione multipla** – Selezionare più variabili e utilizzare **Elimina selezionate**

## Utilizzo nei Workflow

Fare riferimento alle variabili in qualsiasi espressione:

```
$global.environment
$global.settings.baseUrl
```

È inoltre possibile impostare variabili globali da un [Nodo Variable](../nodes/variable-node.md) abilitando **Store in Global Variable Store**.

## Correlati

- [Variabili Globali](../reference/global-variables.md) – Guida di riferimento
- [Nodo Variable](../nodes/variable-node.md) – Impostare variabili con `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Sintassi `$global`
- [Scheda Chat](./chat-tab.md) – La Chat può accedere alle variabili globali
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida compatta per le superfici della dashboard
