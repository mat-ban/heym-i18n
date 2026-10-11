# Záložka Scheduled

Záložka **Scheduled** zobrazuje všechny aktivní cron workflows v přehledném kalendáři. Přepínejte mezi denním, týdenním a měsíčním zobrazením a sledujte, kdy jsou vaše automatizace naplánovány ke spuštění.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

## Zobrazení

- **Day** – Hodinová časová osa pro vybraný den; každý výskyt se zobrazí jako blok v naplánovaném čase
- **Week** – Mřížka o sedmi sloupcích zahrnující aktuální týden; bloky se vrství, pokud se v jedné hodině spouští více workflows
- **Month** – Mřížka celého měsíce; každá buňka uvádí workflows naplánované ke spuštění v daný den

## Bloky workflow

Každý blok zobrazuje:

- **Název workflow** – Kliknutím otevřete přímo plátno workflow
- **Cron výraz** – Zobrazí se při najetí myší a ukazuje surový plán (např. `0 9 * * 1-5`)

## Navigace

Správci instance uvedení v `HEYM_ADMIN_EMAILS` vidí plány všech vlastníků, pokud je zaškrtnuto **Show all workflows**. Odškrtnutím zobrazí pouze své vlastní workflows. Ostatní uživatelé mají k dispozici volbu **Show shared with me**. Chcete-li vyřadit automatizaci zaměstnance, použijte [ovládací prvky správy instance](./workflows-tab.md#instance-administration) v náhledu Workflows k pozastavení nebo obnovení triggerů.

- Pomocí šipek **previous / next** se pohybujte mezi dny, týdny nebo měsíci
- Tlačítko **Today** vás okamžitě vrátí na aktuální datum

## Související

- [Cron Node](../nodes/cron-node.md) – Konfigurace naplánovaných triggerů na plátně
- [Workflows Tab](./workflows-tab.md) – Správa a organizace všech workflows
- [Analytics Tab](./analytics-tab.md) – Metriky spouštění a trendy
