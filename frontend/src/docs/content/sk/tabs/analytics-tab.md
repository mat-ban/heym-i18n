# Karta Analytics

Karta **Analytics** zobrazuje metriky spustení a trendy pre Vaše workflowy. Sledujte využitie, výkon a identifikujte úzke miesta.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Pozrite si ukážku Analytics</a></p>

## Súhrnné štatistiky

- **Celkový počet spustení** – Počet behov workflowu v zvolenom období
- **Miera úspešnosti** – Percento úspešných behov
- **Priemerné trvanie** – Priemerný čas spustenia
- **Ušetrený čas** – Celkový odhadovaný ušetrený čas: nakonfigurované minúty ušetrené na jedno spustenie × počet úspešných spustení pre každý workflow, sčítané za zvolené obdobie
- **Trendy** – Indikátory rastu/poklesu v porovnaní s predchádzajúcim obdobím

## Časové rozpätie

- **1h**, **3h**, **6h** – Posledná hodina, 3 hodiny alebo 6 hodín. Analytika sa uchováva po hodinách, takže tieto voľby počítajú počiatočnú hodinu okna ako celú: Posledná hodina o 15:20 pokrýva čas od 14:00 do teraz
- **24h** – Posledných 24 hodín
- **7d** – Posledných 7 dní
- **30d** – Posledných 30 dní
- **All** – Celá dostupná história

## Filter workflowov

- Filtrovanie metrík podľa konkrétneho workflowu
- **All workflows** – Agregácia naprieč všetkými workflowmi

## Tabuľky

Dve tabuľky zobrazujú využitie workflowov: **Most Used** (širšia) a **Most Failed**.

- **Time Saved** – Most Used zobrazuje súhrnný ušetrený čas pre každý workflow (minúty ušetrené na jedno spustenie × úspešné spustenia). **Not Set** znamená, že odhad chýba; kliknutím otvoríte príslušné pole vo workflowe.
- **Zoraditeľné stĺpce** – Kliknutím na hlavičku stĺpca zoradíte podľa daného stĺpca. Opätovným kliknutím prepnete vzostupné/zostupné poradie. Šípky indikujú smer zoradenia.
- **Označenia na mobilných zariadeniach** – Na malých obrazovkách sú označenia stĺpcov skrátené (napr. „Executions" → „Runs", „Success" → „OK", „Error" → „Err"), aby sa tabuľky zmestili bez horizontálneho posúvania.

## Grafy

- **Execution Volume Over Time** – Čiarový graf spustení za časový interval
- **Success vs Error Rate** – Plošný graf porovnávajúci úspešné a neúspešné behy
- **Average Latency Over Time** – Čiarový graf zobrazujúci zmeny času odozvy
- **Výber potiahnutím** – Kliknutím a potiahnutím na ľubovoľnom grafe zameriate vlastný rozsah dátumov. Výber musí pokrývať aspoň dva body na grafe; jednoduché kliknutie nevyberie nič
- **Režim výberu** – Vybrané rozpätia obnovia súhrnné karty, grafy a tabuľky workflowov bez zmeny základného prednastavenia
- **Clear Selection** – Návrat k prednastavenému časovému oknu po dokončení podrobného skúmania

## Typy uzlov

Pod percentilmi latencie ukazujú tri grafy, kam smeruje čas a chyby uzlov, zoskupené podľa typu uzla (Agent, HTTP Request, Code atď.) naprieč zobrazenými workflow:

- **Časovo najnáročnejšie uzly** – 10 typov uzlov s najdlhším celkovým časom behu, vykreslených ako priemerná doba trvania na volanie. Hodina bez volaní daného typu zobrazuje v tooltipe **Žiadne volania**.
- **Najčastejšie chybujúce typy uzlov** – 10 typov uzlov s najväčším počtom chýb (chyba alebo timeout), každý s vlastným počtom chýb za daný časový úsek.
- **Najviac volané typy uzlov** – 10 typov uzlov, ktoré bežali najčastejšie, každý s vlastným počtom volaní za časový úsek. Preskočené uzly sa nepočítajú.

Prejdite myšou na graf a uvidíte typ uzla pod ukazovateľom priamo vedľa neho. Typ uzla príliš malý na to, aby bol vedľa najväčšieho na grafe viditeľný (pod 1 % z neho), je z grafu aj jeho legendy vynechaný. Grafy rešpektujú filter workflow, časový rozsah aj akýkoľvek rozsah vybraný potiahnutím. Analytika uzlov sa zaznamenáva pre behy od verzie, ktorá ju zaviedla; dokončený beh sa objaví zhruba do minúty. Staršie behy sa nezapočítavajú.

## Automatické obnovovanie

- Zapnite automatické obnovovanie, aby metriky zostali aktualizované bez manuálneho načítania

## Súvisiace

- [Workflows Tab](./workflows-tab.md) – Merané workflowy
- [Traces Tab](./traces-tab.md) – Podrobná kontrola spustení
- [Logs Tab](./logs-tab.md) – Runtime logy na ladenie
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkami pre povrchy dashboardu

Keď graf zobrazuje trend, o ktorom chcete byť informovaní namiesto jeho sledovania, premeňte ho na [upozornenie](./alerts-tab.md): počet chýb, trvanie behu, výdavky na LLM a počet spustení – pre všetky je možné nastaviť prahovú hodnotu v rámci časového okna.
