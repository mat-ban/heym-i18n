# Scheda Pianificazioni

La scheda **Pianificazioni** mostra tutti i workflow cron attivi su un calendario visuale. Passare tra le viste giorno, settimana e mese per vedere quando sono pianificate le esecuzioni delle automazioni.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Guarda la demo delle Pianificazioni</a></p>

## Viste

- **Giorno** – Timeline ora per ora per il giorno selezionato; ogni occorrenza appare come un blocco all'orario pianificato
- **Settimana** – Griglia a sette colonne che copre la settimana corrente; i blocchi si sovrappongono quando più workflow vengono attivati nella stessa ora
- **Mese** – Griglia dell'intero mese; ogni cella elenca i workflow pianificati per quel giorno

## Blocchi dei workflow

Ogni blocco mostra:

- **Nome del workflow** – Fare clic per aprire direttamente il canvas del workflow
- **Espressione cron** – Visibile al passaggio del mouse, mostra la pianificazione grezza (es. `0 9 * * 1-5`)

## Navigazione

Gli amministratori dell'istanza elencati in `HEYM_ADMIN_EMAILS` vedono le pianificazioni di tutti i proprietari quando **Mostra tutti i workflow** è selezionato. Deselezionare l'opzione per vedere solo i propri workflow. Gli altri utenti mantengono l'opzione **Mostra condivisi con me**. Per disattivare l'automazione di un dipendente, utilizzare i [controlli di amministrazione dell'istanza](./workflows-tab.md#instance-administration) nell'anteprima dei Workflows per mettere in pausa o riprendere i trigger.

- Utilizzare le frecce **precedente / successivo** per spostarsi tra giorni, settimane o mesi
- Il pulsante **Oggi** riporta istantaneamente alla data corrente

## Correlati

- [Nodo Cron](../nodes/cron-node.md) – Configurare i trigger pianificati sul canvas
- [Scheda Workflows](./workflows-tab.md) – Gestire e organizzare tutti i workflow
- [Scheda Analytics](./analytics-tab.md) – Metriche di esecuzione e tendenze
