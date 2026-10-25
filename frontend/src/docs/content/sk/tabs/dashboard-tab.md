# Dashboard

Karta **Dashboard** je priestor v štýle Grafany, kde vytvárate mriežky widgetov s grafmi. Každý widget sa vykresľuje z výstupu vlastného skrytého workflow v HeyMe, takže akékoľvek údaje, ktoré dokážete vytvoriť vo workflow — databázové dotazy, volania API, vyhľadávania RAG, výstup LLM — sa môžu stať grafom. Môžete mať niekoľko dashboardov a každý z nich zdieľať s ľuďmi alebo tímami.

## Dashboardy

Každý začína s jedným dashboardom, ktorý sa vytvorí pri prvom otvorení karty. Na prepínanie medzi dashboardmi použite selektor dashboardov v hornej časti karty a pomocou **+** vedľa neho vytvorte nový. Selektor najprv zobrazuje Vaše vlastné dashboardy, potom tie, ktoré sú s Vami zdieľané, označené menom osoby, ktorá ich zdieľala.

Karta znovu otvorí naposledy použitý dashboard a do adresného riadka sa prenáša otvorený dashboard (`?tab=dashboard&dashboard=<id>`), takže odkaz otvorí presne tento dashboard každému, kto k nemu má prístup.

Tlačidlo nastavení (len pre vlastníkov) premenuje dashboard, nastaví, ktoré záznamy prijíma ako [detailná stránka](#detail-pages), spravuje zdieľanie a odstráni ho. Odstránením dashboardu sa odstránia jeho widgety a ich workflowy. Vždy si zachováte aspoň jeden vlastný dashboard, takže posledný nie je možné odstrániť.

## Widgety

Widget je jeden graf v mriežke. Podporované typy grafov:

- **Bar** (vertikálny alebo horizontálny)
- **Line**
- **Area** (vyplnený trend, podporuje viacero sérií)
- **Pie**
- **Table** (posuvná; kliknutím na záhlavie stĺpca zoradíte vzostupne a ďalším kliknutím zostupne. Jeden stĺpec možno vykresliť ako [stavové čipy](../nodes/chart-output-node.md#status-chips), jeden stĺpec môže obsahovať [tlačidlá s odkazom](../nodes/chart-output-node.md#link-buttons), ktoré otvoria URL na novej karte, a riadky môžu otvoriť [detailnú stránku](#detailne-stranky))
- **Numeric** (jedna hodnota KPI s voliteľnou jednotkou)
- **Gauge** (jedna hodnota voči rozsahu min–max, napr. percento)
- **Scatter** (body X/Y pre korelačné grafy)
- **Proportion** (jeden pruh rozdelený na podiely s percentuálnou legendou, napr. rozpis jazykov)
- **Bar gauge** (jeden horizontálny gauge na riadok s prechodom červená→zelená a hodnotou, napr. voľné miesto na disku)
- **Text** (markdown správa, napr. stavová poznámka ako „Posledné spustenie o 19:47"; podporuje [interaktívne zaškrtávacie políčka](../nodes/chart-output-node.md#interactive-task-lists), keď je markdown statický, a [explicitné číslované zoznamy](../nodes/chart-output-node.md#numbered-lists) pre vlastné alebo zostupné číslovanie)
- **HITL** (Vaše čakajúce ľudské revízie. Hlavička zobrazuje `1/n pending`. Názov workflowu otvorí toto spustenie na plátne. **Approve**, **Request changes** a **Reject** ho vyriešia. Ikona histórie vedľa názvu widgetu otvorí toto spustenie v dialógu histórie na tejto stránke. Widget nepoužíva riadky z upstreamu a každá osoba vidí svoj vlastný front. Namiesto toho môže zobrazovať kontroly jedného Workflow, a to pre každého, kto môže tento Workflow otvoriť; pozrite [Widgety HITL](#widgety-hitl))

Okrem grafov spúšťa widget **Run a workflow** jeden z vašich workflowov priamo z dashboardu: so súborom presunutým myšou, s jeho vstupnými poľami alebo pomocou tlačidla Run; pozri [Spúšťacie widgety](#run-widgets).

Každý widget načítava svoje údaje asynchrónne pri otvorení karty, takže stránka zostáva responzívna, kým sa grafy napĺňajú.

## Pridanie widgetu

1. Kliknite na **Add widget**, zadajte mu názov a vyberte typ grafu. Pod výberom dialóg vykreslí príklad daného typu grafu s ukážkovými údajmi a pomenuje riadky, ktoré očakáva, takže môžete porovnať typy predtým, než čokoľvek vytvoríte.
2. Widget sa otvorí v editore workflowu so štartovacím grafom: uzol [Set](../nodes/set-node.md), ktorý vytvára riadky, prepojený s uzlom [Chart Output](../nodes/chart-output-node.md). Nahraďte uzol Set ľubovoľným zdrojom údajov. Widget **HITL** je len uzlom Chart Output; číta Vaše čakajúce revízie a nepotrebuje zdroj údajov.
3. Zostavte workflow tak, aby uzol napájajúci **Chart Output** vytváral pole riadkov, a potom nakonfigurujte mapovanie polí uzla Chart Output (pole označenia, pole hodnoty atď.).
4. Uložte, vráťte sa na kartu Dashboard a widget sa vykreslí.

Pre widget **Run a workflow** namiesto toho vyberte workflow, ktorý má spúšťať; výberové okno uvádza, ako widget každý z nich spustí. Widget sa pridá priamo do mriežky; nevytvára sa žiadny nový workflow.

Dvojkliknutím na widget (alebo pomocou jeho tlačidla úprav) kedykoľvek znovu otvoríte jeho workflow. Pomocou **Clone widget** v hlavičke widgetu duplikujte widget aj jeho kompletný workflow. Kópia sa umiestni pod originál a označí sa ako **(Copy)**, takže ju môžete upravovať nezávisle.

## Widgety HITL

Nový HITL widget zobrazuje všetky kontroly čakajúce vo vašom vlastnom fronte. Ak chcete zobraziť iba kontroly jedného Workflow, otvorte **Nastavenia** widgetu:

1. V poli **Workflow** vyberte Workflow. Zoznam obsahuje Workflow, ktoré môžete otvoriť, vaše alebo zdieľané s vami či vaším tímom, ktoré majú krok čakajúci na osobu: Agent s ľudskou kontrolou alebo krok Slack so schválením, tlačidlami či formulárom. Ikona vedľa otvorí tento Workflow na novej karte.
2. Ak má Workflow jediný takýto krok, vyberie sa automaticky. Ak ich má viac, **Select agent** ich vypíše podľa názvu uzla, pričom **All agents** je prvý; kroky Slack sú označené **(Slack)**.
3. Uložte. Údaj `1/n pending` v záhlaví počíta iba tieto kontroly. Vyberte **Všetky Workflowy**, ak chcete znova zobraziť vlastný front.

Rovnaká voľba je na plátne vo vlastnostiach uzla Chart Output. Môže ju urobiť aj **Vyladiť s AI** („zobraz iba schvaľovanie faktúr“), rovnako ako popis nového widgetu, ktorý Workflow pomenúva. Každá zmena je úprava Workflow, takže sa zobrazí v Edit History.

- **Kto vidí kontroly.** Widget filtrovaný na Workflow zobrazuje kontroly tohto Workflow každému, kto môže Workflow otvoriť, a títo ľudia môžu cez neho schvaľovať, žiadať o zmeny alebo zamietať, rovnako ako by mohli Workflow spustiť. Nefiltrovaný widget zobrazuje každému jeho vlastný front.
- **Kto vidí widget.** Kto vybraný Workflow otvoriť nemôže, widget vôbec nevidí, ani na dashboarde, ktorý je s ním zdieľaný. Ak vlastník dashboardu stratí k Workflow prístup alebo sa Workflow odstráni, vlastník vidí „You no longer have access to the workflow this widget shows“ a môže v **Nastaveniach** vybrať iný.
- **Iba dostupné voľby.** Workflow, ktorý nemôžete otvoriť, sa pri ukladaní widgetu odmietne, či už z nastavení, z plátna, alebo cez AI.

## Detailné stránky

Tabuľkový widget môže prepojiť svoje riadky s iným dashboardom, ktorý potom funguje ako detailná stránka: jeden dashboard slúžiaci pre každého zákazníka, faktúru alebo tiket.

1. Otvorte **Settings** tabuľkového widgetu a v časti **Row link** vyberte cieľový dashboard.
2. Zadajte **Record column**, teda stĺpec, ktorého hodnota identifikuje riadok (napríklad `id`), a voliteľne **Label column**, ktorý ho pomenúva (napríklad `name`).
3. Uložte. Kliknutím na riadok (alebo jeho zameraním a stlačením klávesu Enter) sa otvorí prepojený dashboard s parametrami `?record=<value>&label=<name>`.

Na detailnom dashboarde číta každý workflow widgetu túto hodnotu ako `$page.record` (pozri [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)) a stránka nad mriežkou zobrazuje `Dashboard / <label>` spolu s tlačidlom na vymazanie záznamu. Tlačidlo Späť vás vráti do tabuľky, z ktorej ste prišli.

- **Kto ju môže otvoriť.** Riadky sú klikateľné len pre používateľov, ktorí môžu otvoriť prepojený dashboard. Ostatní vidia rovnakú tabuľku bez odkazov.
- **Formát záznamu.** Záznam pochádza z URL, takže detailný dashboard rozhoduje o tom, čo prijme. V jeho nastaveniach je **Detail page records** jednou z možností: ID (písmená, číslice, `-`, `_` a `.`, až do 128 znakov; predvolené), čísla, UUID alebo e-mailové adresy. Akákoľvek iná hodnota je odmietnutá ešte pred spustením widgetu a widgety zobrazia „This page does not accept that record".
- **Stále beží pod vlastníkom.** Aj na detailnej stránke bežia widgety pod účtom vlastníka dashboardu. Tvorcovia by mali odovzdávať `$page.record` iba tam, kde ho uzol escapuje, nikdy priamo do textu dopytu.
- **Vyrovnávacia pamäť.** Každý widget ukladá svoj graf do vyrovnávacej pamäte pre každý záznam zvlášť, s rovnakou dobou platnosti (TTL) ako samotný widget, a uchováva 50 naposledy použitých záznamov.

## Spúšťacie widgety

Widget **Run a workflow** spustí jeden z vašich workflowov a zobrazí výsledok: stav, čas behu a výstupy. Čo zobrazí, závisí od toho, aké vstupy workflow prijíma:

- **Súbor.** Pri workflowe, ktorý začína uzlom [File Upload Trigger](../nodes/file-upload-trigger-node.md), naň presuňte súbor (alebo kliknutím vyberte súbor) a widget ho nahrá prostredníctvom jednorazového nahrávacieho odkazu daného triggera. Widget zobrazuje typy a veľkosť súborov, ktoré trigger prijíma, a ostatné pred nahraním odmietne. Keď workflow začína aj uzlom Text Input, zobrazí widget jeho polia vedľa oblasti na presunutie: vyberte súbor, vyplňte polia a tlačidlo **Run** odošle oboje. Hodnoty cestujú spolu s nahrávacím odkazom, ktorý widget vygeneruje, takže zdieľaný nahrávací odkaz ich nemôže nastaviť.
- **Vstupné polia.** Pri workflowe, ktorý začína uzlom Text Input, zobrazí widget jeho polia s predvolenými hodnotami; tlačidlo **Run** spustí workflow s vašimi hodnotami. Hodnoty pre polia, ktoré workflow nemá, sa zahodia.
- **Nič.** Workflow bez vstupov dostane tlačidlo **Run**.

Tlačidlo **Wrap** pri výsledku zalamuje dlhé riadky výstupu vo vnútri poľa; vypnite ho, ak chcete čítať rozloženie JSON výstupu.

- Každý, kto môže otvoriť dashboard, môže widget spustiť, rovnako ako každý môže obnoviť graf. Prístup k workflowu sa riadi vlastníkom dashboardu: pridanie widgetu vyžaduje workflow, ktorý môžete spustiť vy aj vlastník, a samotný beh používa prihlasovacie údaje vlastníka workflowu, rovnako ako akýkoľvek nahrávací odkaz.
- Výsledok zostáva na vašej obrazovke, kým stránku neopustíte; ostatní prehliadajúci nevidia vaše súbory, hodnoty ani výsledky. Beh sa zobrazí v histórii spustení s triggerom `dashboard`.
- Zdieľanie dashboardu nikdy neudeľuje prístup k samotnému workflowu. **Edit workflow** ho otvorí ľuďom, ktorí už prístup majú, a **Fine-tune with AI** sa neponúka.
- Súborové behy sa vykonávajú na hlavnej inštancii, kde sú uložené nahrané súbory, rovnako ako každý beh File Upload Triggera.

## Generovanie widgetu pomocou AI

Kliknite na **AI**, opíšte metriku, ktorú chcete (napríklad „miera úspešnosti workflowu za posledných 30 dní ako stĺpcový graf"), a vyberte prihlasovacie údaje LLM a model. Heym vygeneruje kompletný workflow widgetu končiaci uzlom Chart Output a pridá ho do mriežky. Príklady promptov pre jednotlivé typy grafov nájdete v časti [Chart Output](../nodes/chart-output-node.md#example-ai-prompts).

Widget dostane krátky názov z jedného alebo dvoch slov v jazyku vášho zadania, napríklad „Otvorené prípady“. Názov nikdy neobsahuje ID dátovej tabuľky; ak model pomenuje widget celou vetou, Heym ponechá jej prvé slová.

API widgetov dokáže vytvoriť **kartu s počtom** aj bez AI: widget `text` nad dátovou tabuľkou (`data_table_id`) s `count_column` a `count_value` zobrazí, koľko riadkov má danú hodnotu; názov widgetu uvádza hodnotu. Heym Work uvádza stránky vytvorené z dátovej tabuľky jednou kartou s počtom pre každý stav.

Pomocou tlačidla **Fine-tune with AI** daného widgetu upravte existujúci widget novým pokynom. Každé doladenie pomocou AI uloží snímku predchádzajúceho workflowu do **Edit History** widgetu, takže môžete zmeny skontrolovať alebo vrátiť z editora workflowu.

## Úprava rozloženia

Prepnite **Edit** na vstup do režimu úprav, kde môžete widgety presúvať a meniť ich veľkosť v mriežke s 12 stĺpcami. Zmeny rozloženia sa ukladajú automaticky. Názvy widgetov je možné upravovať priamo v hlavičke widgetu.

## Ukladanie do vyrovnávacej pamäte a obnovenie

Každý widget ukladá svoje naposledy vypočítané údaje do vyrovnávacej pamäte na serveri na konfigurovateľnú dobu životnosti (TTL). Kým je vyrovnávacia pamäť čerstvá, opätovné otvorenie dashboardu poskytne uložený výsledok namiesto opätovného spustenia workflowu. Vyrovnávacia pamäť sa nahradí na mieste vždy, keď sa údaje prepočítajú (jedna vyrovnávacia pamäť na widget, plus jedna na záznam na [detailnej stránke](#detail-pages)), a automaticky sa zneplatní pri úprave workflowu daného widgetu.

Pomocou tlačidla **Refresh** daného widgetu (alebo **Refresh** na paneli nástrojov) obídete vyrovnávaciu pamäť a okamžite prepočítate údaje.
## Zdieľanie

Vlastníci zdieľajú dashboard z jeho nastavení, a to s jednotlivými používateľmi (prostredníctvom e-mailu) alebo s ľubovoľným [tímom](teams-tab.md), do ktorého patria. Každé zdieľanie je typu **Read** alebo **Write**; ak má niekto pridelené osobné aj tímové zdieľanie, uplatní sa to silnejšie.

| Akcia | Vlastník | Write | Read |
|--------|:-----:|:-----:|:----:|
| Zobrazenie widgetov, ich obnovenie, použitie automatického obnovovania | ✓ | ✓ | ✓ |
| Otváranie detailných stránok, spúšťanie spúšťacích widgetov | ✓ | ✓ | ✓ |
| Pridávanie, klonovanie, odstraňovanie, premenovanie a zmena veľkosti widgetov; generovanie a doladenie pomocou AI; odškrtávanie položiek kontrolného zoznamu | ✓ | ✓ | |
| Otvorenie workflow widgetu v editore | ✓ | ✓ | |
| Premenovanie alebo odstránenie dashboardu, nastavenie formátu záznamu, správa zdieľania | ✓ | | |

**Widgety sa vždy spúšťajú ako vlastník dashboardu.** Bez ohľadu na to, kto sa na ne pozerá, widget používa prihlasovacie údaje a globálne premenné vlastníka a jeho spustenia sa zobrazujú v histórii spustení a v trasách vlastníka. Členovia tímu tak vidia rovnaké údaje bez prístupu k účtom, ktoré za nimi stoja, a všetci diváci zdieľajú jeden výsledok uložený v cache pre každý widget. Widgety, ktoré pridá alebo naklonuje spolupracovník s právom zápisu, tiež patria vlastníkovi.

Z tohto dôvodu **Write** nesie rovnakú mieru dôvery ako zdieľanie workflow na úpravy: spolupracovník s právom zápisu môže zmeniť to, čo sa spúšťa s Vašimi prihlasovacími údajmi. Prideľte ho len ľuďom, ktorým by ste dovolili upravovať svoje workflowy. Testovacie spustenie, ktoré spolupracovník spustí z editora workflowu, používa jeho vlastné prihlasovacie údaje, rovnako ako pri akomkoľvek zdieľanom workflowe; ako vlastník sa spúšťa iba samotný dashboard. **Read** neposkytuje žiadny prístup k workflowom widgetov a diváci s právom iba na čítanie dostanú samotný graf, ale nie podrobnosti o spustení jednotlivých uzlov, ktoré za ním stoja.

Odstránenie zdieľania alebo jeho zníženie z write na read nadobúda účinnosť okamžite.

## Súvisiace

- [Uzol Chart Output](../nodes/chart-output-node.md)
- [Karta Analytics](analytics-tab.md) — vstavané metriky spustení (odlišné od dashboardov vytvorených používateľmi)