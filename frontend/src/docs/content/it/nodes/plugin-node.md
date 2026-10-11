# Nodo Plugin

Il nodo **Plugin** esegue un'azione personalizzata fornita da un plugin installato. I plugin estendono Heym con nuovi tipi di nodo — azioni, integrazioni di terze parti o qualsiasi cosa esprimibile in Python — senza modificare l'applicazione core.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.<keys returned by the plugin>` |

Un **pacchetto** plugin (un file zip) può includere **più nodi** — qualsiasi combinazione di azioni e trigger. Ogni nodo appare nella palette sotto **Plugins** con il proprio nome e la propria descrizione. Trascinandone uno sul canvas si crea un nodo Plugin associato a quel pacchetto (`pluginId`) e a quel nodo (`pluginNodeKey`).

## Quando utilizzarlo

Utilizzare un nodo Plugin quando un operatore ha installato un plugin che esegue l'azione desiderata — ad esempio la chiamata a un'API privata, la comunicazione con un sistema interno o l'esecuzione di logica personalizzata scritta per la propria installazione.

Per i plugin di tipo trigger che avviano un workflow, consultare il [nodo Plugin Trigger](./plugin-trigger-node.md).

## Configurazione

Il modulo di configurazione del nodo viene generato dal manifest del plugin. Ogni campo dichiarato dal plugin (`string`, `number`, `boolean` o `select`) viene renderizzato automaticamente. I campi stringa non segreti utilizzano l'input per espressioni, e i valori di configurazione stringa salvati che iniziano con `$` vengono risolti prima dell'esecuzione dell'handler del plugin.

I campi segreti (come le chiavi API) sono mascherati nell'interfaccia e non vengono mai scritti nei log.

## Come vengono eseguiti i plugin

I plugin sono forniti da Heym e installati da un operatore, pertanto il codice dei plugin è **considerato attendibile** e viene eseguito in-process come un nodo integrato, con accesso completo alla rete e alle librerie. Un plugin può dichiarare `dependencies` pip che vengono installate nell'istanza al momento dell'installazione.

L'installazione e la rimozione dei plugin sono riservate agli operatori il cui indirizzo email è elencato in `HEYM_PLUGIN_ADMIN_EMAILS`, e l'intero sottosistema è controllato da `HEYM_PLUGINS_ENABLED` (disabilitato per impostazione predefinita). Consultare [Esecuzione e distribuzione](../getting-started/running-and-deployment.md) per le variabili d'ambiente.

## Icone personalizzate

Un plugin può includere loghi SVG personalizzati. Posizionare un file `icon.svg` nella radice del pacchetto per impostare un valore predefinito per ogni nodo e/o assegnare a un nodo il proprio `"icon": "<file>.svg"` nel manifest. L'icona viene mostrata sia sulla scheda della palette sia sul nodo del canvas; i nodi privi di icona utilizzano il glifo predefinito a forma di pezzo di puzzle.

## AI Builder

I plugin installati sono resi disponibili all'assistente IA e al canvas della chat, pertanto è possibile chiedere a Heym di "utilizzare il plugin Acme CRM per creare un record" e questo genererà il nodo Plugin con il `pluginId` e la `config` corretti.

## Creare plugin

Per realizzare un pacchetto plugin, consultare [Creazione di plugin](../reference/plugin-authoring.md) per la struttura dello zip, i campi del manifest, le firme degli handler, le icone, le dipendenze e il modello di attendibilità a runtime.