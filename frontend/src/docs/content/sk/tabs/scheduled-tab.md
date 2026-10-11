# Karta Plány

Karta **Plány** zobrazuje všetky aktívne cron workflowy v prehľadnom kalendári. Prepínajte medzi zobrazením dňa, týždňa a mesiaca a sledujte, kedy sú Vaše automatizácie naplánované na spustenie.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Pozrieť ukážku Plánov</a></p>

## Zobrazenia

- **Deň** – Časová os po hodinách pre zvolený deň; každý výskyt sa zobrazí ako blok v naplánovanom čase
- **Týždeň** – Mriežka so siedmimi stĺpcami pokrývajúca aktuálny týždeň; bloky sa ukladajú na seba, keď sa v tej istej hodine spustí viacero workflowov
- **Mesiac** – Mriežka celého mesiaca; každá bunka zobrazuje zoznam workflowov naplánovaných na daný deň

## Bloky workflowov

Každý blok zobrazuje:

- **Názov workflowu** – Kliknutím otvoríte priamo plátno workflowu
- **Cron výraz** – Zobrazí sa pri prejdení myšou a ukazuje surový plán (napr. `0 9 * * 1-5`)

## Navigácia

Správcovia inštancie uvedení v `HEYM_ADMIN_EMAILS` vidia plány všetkých vlastníkov, keď je zaškrtnuté **Zobraziť všetky workflowy**. Odškrtnutím zobrazia iba svoje vlastné workflowy. Ostatní používatelia majú k dispozícii možnosť **Zobraziť zdieľané so mnou**. Ak chcete vyradiť automatizáciu zamestnanca, použite [ovládacie prvky správy inštancie](./workflows-tab.md#instance-administration) v náhľade Workflows na pozastavenie alebo obnovenie triggerov.

- Pomocou šípok **predchádzajúci / nasledujúci** sa pohybujete medzi dňami, týždňami alebo mesiacmi
- Tlačidlo **Dnes** Vás okamžite vráti na aktuálny dátum

## Súvisiace

- [Cron uzol](../nodes/cron-node.md) – Konfigurácia naplánovaných triggerov na plátne
- [Karta Workflows](./workflows-tab.md) – Správa a organizácia všetkých workflowov
- [Karta Analytika](./analytics-tab.md) – Metriky spustení a trendy
