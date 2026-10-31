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

- **1h**, **3h**, **6h** – Poslední hodina, 3 hodiny nebo 6 hodin. Analytika se uchovává po hodinách, takže tyto volby počítají počáteční hodinu okna jako celou: Poslední hodina v 15:20 pokrývá čas od 14:00 do teď
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
- **Výběr přetažením** – Kliknutím a tažením na libovolném grafu zaměříte vlastní rozsah dat. Výběr musí pokrývat alespoň dva body na grafu; pouhé kliknutí nevybere nic
- **Režim výběru** – Vybraná rozmezí aktualizují souhrnné karty, grafy a tabulky workflow, aniž by se změnil základní preset
- **Zrušit výběr** – Návrat k přednastavenému časovému oknu, jakmile dokončíte podrobné zkoumání

## Typy uzlů

Pod percentily latence ukazují tři grafy, kam směřuje čas a chyby uzlů, seskupené podle typu uzlu (Agent, HTTP Request, Code atd.) napříč zobrazenými workflow:

- **Časově nejnáročnější uzly** – 10 typů uzlů s nejdelším celkovým časem běhu, vykreslených jako průměrná doba trvání na volání. Hodina bez volání daného typu zobrazuje v tooltipu **Žádná volání**.
- **Nejčastěji chybující typy uzlů** – 10 typů uzlů s největším počtem chyb (chyba nebo timeout), každý s vlastním počtem chyb za daný časový úsek.
- **Nejvíce volané typy uzlů** – 10 typů uzlů, které běžely nejčastěji, každý s vlastním počtem volání za časový úsek. Přeskočené uzly se nepočítají.

Najeďte myší na graf a uvidíte typ uzlu pod ukazatelem přímo vedle něj. Typ uzlu příliš malý na to, aby byl vedle největšího na grafu viditelný (pod 1 % z něj), je z grafu i jeho legendy vynechán. Grafy respektují filtr workflow, časový rozsah i jakýkoli rozsah vybraný přetažením. Analytika uzlů se zaznamenává pro běhy od verze, která ji zavedla; dokončený běh se objeví zhruba do minuty. Starší běhy se nezapočítávají.

## Automatická aktualizace

- Zapněte automatickou aktualizaci, aby metriky zůstaly aktuální bez ručního načítání

## Související

- [Záložka Workflows](./workflows-tab.md) – Měřená workflow
- [Záložka Traces](./traces-tab.md) – Podrobné zkoumání trace
- [Záložka Logs](./logs-tab.md) – Runtime logy pro ladění
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkou pro dashboardy

Když graf zobrazuje trend, o kterém chcete být informováni, místo abyste ho sledovali, přeměňte ho na [alert](./alerts-tab.md): počet chyb, doba trvání spuštění, výdaje za LLM a počet spuštění – to vše lze opatřit prahovou hodnotou v rámci časového okna.
