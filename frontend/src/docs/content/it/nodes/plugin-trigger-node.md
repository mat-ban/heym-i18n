# Nodo Plugin Trigger

Il nodo **Plugin Trigger** è la controparte di tipo trigger del
[nodo Plugin](./plugin-node.md). È fornito da un plugin installato il cui
`kind` è `trigger` e produce i dati iniziali da cui un workflow prende avvio.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.<keys returned by the plugin>` |

Un plugin di tipo trigger può rappresentare qualsiasi sorgente — un'applicazione diversa, un servizio
di terze parti o un'altra tecnologia — purché l'handler del plugin restituisca i dati
con cui il workflow deve iniziare.

## Quando utilizzarlo

Utilizzare un nodo Plugin Trigger quando un plugin installato definisce un trigger che avvia
il workflow. Per i plugin che eseguono un'azione durante il workflow, utilizzare invece il
[nodo Plugin](./plugin-node.md).

## Configurazione

Come per il nodo Plugin, il modulo di configurazione viene generato a partire dai campi del manifest del plugin. I campi stringa non segreti utilizzano l'input per le espressioni, mentre i campi segreti sono mascherati.

## Come vengono eseguiti i plugin

Il codice dei plugin è considerato attendibile (fornito da Heym, installato dall'operatore) e viene eseguito in-process.
L'installazione è limitata a `HEYM_PLUGIN_ADMIN_EMAILS` e il sottosistema è
controllato da `HEYM_PLUGINS_ENABLED`. Consultare
[Esecuzione e distribuzione](../getting-started/running-and-deployment.md).

## Creare plugin

Per realizzare un pacchetto di plugin di tipo trigger, consultare
[Creazione di plugin](../reference/plugin-authoring.md) per la struttura dello zip,
i campi del manifest, le firme degli handler, le icone, le dipendenze e il modello di attendibilità
a runtime.