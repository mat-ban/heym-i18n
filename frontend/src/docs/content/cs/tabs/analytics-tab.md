# Záložka Analytics

Záložka **Analytics** zobrazuje metriky provádění a trendy pro vaše workflow. Sledujte využití, výkon a identifikujte úzká místa.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

## Souhrnné statistiky

- **Celkový počet spuštění** – Počet spuštění workflow za zvolené období
- **Míra úspěšnosti** – Procento úspěšných spuštění
- **Průměrná doba trvání** – Průměrná doba provádění
- **Ušetřený čas** – Celkový odhadovaný ušetřený čas: nakonfigurované minuty ušetřené na jedno spuštění daného workflow × jeho úspěšná spuštění, sečteno za zvolené období
- **Trendy** – Indikátory růstu/poklesu oproti předchozímu období

## Časové rozmezí

- **24h** – Posledních 24 hodin
- **7d** – Posledních 7 dní
- **30d** – Posledních 30 dní
- **All** – Celá dostupná historie

## Filtr workflow

- Filtrování metrik podle konkrétního workflow
- **Všechna workflow** – Agregace napříč všemi workflow

## Tabulky

Dvě tabulky zobrazují využití workflow: **Nejpoužívanější** (širší) a **Nejvíce selhání**.

- **Ušetřený čas** – Nejpoužívanější zobrazuje souhrnný ušetřený čas jednotlivých workflow (ušetřené minuty na spuštění × úspěšná spuštění). **Not Set** znamená, že odhad chybí; kliknutím otevřete příslušné pole ve workflow.
- **Seřaditelné sloupce** – Kliknutím na záhlaví sloupce seřadíte podle daného sloupce. Dalším kliknutím přepnete vzestupné/sestupné řazení. Šipky ukazují směr řazení.
- **Popisky na mobilu** – Na malých obrazovkách jsou popisky sloupců zkráceny (např. „Executions" → „Runs", „Success" → „OK", „Error" → „Err"), aby se tabulky vešly bez horizontálního posouvání.

## Grafy

- **Objem spuštění v čase** – Spojnicový graf spuštění za časový interval
- **Míra úspěchu vs. chybovosti** – Plošný graf porovnávající úspěšná a neúspěšná spuštění
- **Průměrná latence v čase** – Spojnicový graf zobrazující změny doby odezvy
- **Tažením vyberte** – Kliknutím a tažením v libovolném grafu zaměřte vlastní časové rozmezí
- **Režim výběru** – Vybraná rozmezí aktualizují souhrnné karty, grafy a tabulky workflow, aniž by se změnil základní preset
- **Zrušit výběr** – Návrat k přednastavenému časovému oknu, jakmile dokončíte podrobné zkoumání

## Automatická aktualizace

- Zapněte automatickou aktualizaci, aby metriky zůstaly aktuální bez ručního načítání

## Související

- [Záložka Workflows](./workflows-tab.md) – Měřená workflow
- [Záložka Traces](./traces-tab.md) – Podrobné zkoumání trace
- [Záložka Logs](./logs-tab.md) – Runtime logy pro ladění
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkou pro dashboardy

Když graf zobrazuje trend, o kterém chcete být informováni, místo abyste ho sledovali, přeměňte ho na [alert](./alerts-tab.md): počet chyb, doba trvání spuštění, výdaje za LLM a počet spuštění – to vše lze opatřit prahovou hodnotou v rámci časového okna.
