# Dashboard

Záložka **Dashboard** je prostor ve stylu Grafanu, kde sestavujete mřížky s widgety grafů. Každý widget se vykresluje z výstupu vlastního skrytého Heym workflow, takže jakákoli data, která dokážete ve workflow vytvořit — databázové dotazy, volání API, RAG vyhledávání, výstup LLM — se mohou stát grafem. Můžete mít několik dashboardů a každý z nich sdílet s lidmi nebo týmy.

## Dashboardy

Každý začíná s jedním dashboardem, který se vytvoří při prvním otevření záložky. Mezi dashboardy přepínejte pomocí selektoru v horní části záložky a nový vytvořte pomocí **+** vedle něj. Selektor nejprve vypisuje vaše vlastní dashboardy, poté ty, které jsou s vámi sdílené, označené jménem osoby, která je sdílela.

Záložka znovu otevře naposledy použitý dashboard a adresní řádek nese otevřený dashboard (`?tab=dashboard&dashboard=<id>`), takže odkaz otevře přesně tento dashboard každému, kdo k němu má přístup.

Tlačítko nastavení (pouze pro vlastníky) umožňuje dashboard přejmenovat, nastavit, které záznamy přijímá jako [detailní stránka](#detail-pages), spravovat sdílení a smazat jej. Smazáním dashboardu se odstraní jeho widgety a jejich workflow. Vždy vám zůstává alespoň jeden vlastní dashboard, takže poslední nelze smazat.

## Widgety

Widget je jediný graf v mřížce. Podporované typy grafů:

- **Bar** (svislý nebo vodorovný)
- **Line**
- **Area** (vyplněný trend, podporuje více sérií)
- **Pie**
- **Table** (posuvná; kliknutím na záhlaví sloupce seřadíte vzestupně a dalším kliknutím sestupně. Jeden sloupec lze vykreslit jako [stavové čipy](../nodes/chart-output-node.md#status-chips), jeden sloupec může obsahovat [tlačítka s odkazem](../nodes/chart-output-node.md#link-buttons), která otevřou URL na nové kartě, a řádky mohou otevřít [detailní stránku](#detailni-stranky))
- **Numeric** (jediná hodnota KPI s volitelnou jednotkou)
- **Gauge** (jediná hodnota vůči rozsahu min–max, např. procento)
- **Scatter** (body X/Y pro korelační grafy)
- **Proportion** (jeden pruh rozdělený na podíly s procentuální legendou, např. rozložení jazyků)
- **Bar gauge** (jeden vodorovný gauge na řádek s přechodem červená→zelená a hodnotou, např. volné místo na disku)
- **Text** (markdown zpráva, např. stavová poznámka jako „Poslední spuštění v 19:47"; podporuje [interaktivní zaškrtávací políčka](../nodes/chart-output-node.md#interactive-task-lists), když je markdown statický, a [explicitní číslované seznamy](../nodes/chart-output-node.md#numbered-lists) pro vlastní nebo sestupné číslování)
- **HITL** (vaše čekající lidské revize. Záhlaví zobrazuje `1/n pending`. Název workflow otevře daný běh na plátně. **Approve**, **Request changes** a **Reject** jej vyřeší. Ikona historie vedle názvu widgetu otevře daný běh v dialogu historie na této stránce. Widget nepoužívá řádky z upstreamu a každý vidí svou vlastní frontu. Může místo toho zobrazovat kontroly jediného Workflow pro každého, kdo může daný Workflow otevřít; viz [Widgety HITL](#widgety-hitl))

Kromě grafů spouští widget **Run a workflow** jeden z vašich workflow přímo z dashboardu: nad přetaženým souborem, s jeho vstupními poli nebo pomocí tlačítka Run; viz [Spouštěcí widgety](#run-widgets).

Každý widget načítá svá data asynchronně při otevření záložky, takže stránka zůstává responzivní, zatímco se grafy plní.

## Přidání widgetu

1. Klikněte na **Add widget**, zadejte název a vyberte typ grafu. Pod voličem dialog vykreslí příklad daného typu grafu s ukázkovými daty a pojmenuje řádky, které očekává, takže můžete typy porovnat, než cokoli vytvoříte.
2. Widget se otevře v editoru workflow se základním grafem: uzel [Set](../nodes/set-node.md), který vytváří řádky, propojený s uzlem [Chart Output](../nodes/chart-output-node.md). Nahraďte uzel Set libovolným zdrojem dat. Widget **HITL** je pouze uzel Chart Output; čte vaše čekající revize a nepotřebuje zdroj dat.
3. Sestavte workflow tak, aby uzel napájející **Chart Output** vytvářel pole řádků, a poté nakonfigurujte mapování polí uzlu Chart Output (pole popisku, pole hodnoty atd.).
4. Uložte, vraťte se na záložku Dashboard a widget se vykreslí.

Pro widget **Run a workflow** místo toho vyberte workflow, který má spouštět; výběrové okno uvádí, jakým způsobem widget jednotlivé workflow spustí. Widget se přidá přímo do mřížky; nevytváří se žádný nový workflow.

Dvojklikem na widget (nebo pomocí jeho tlačítka úprav) kdykoli znovu otevřete jeho workflow. Pomocí **Clone widget** v záhlaví widgetu zduplikujete jak widget, tak jeho kompletní workflow. Kopie se umístí pod originál a označí se **(Copy)**, takže ji můžete upravovat nezávisle.

## Widgety HITL

Nový HITL widget zobrazuje všechny kontroly čekající ve vaší vlastní frontě. Chcete-li zobrazit pouze kontroly jednoho Workflow, otevřete **Nastavení** widgetu:

1. V poli **Workflow** vyberte Workflow. Seznam obsahuje Workflow, které můžete otevřít, vaše nebo sdílené s vámi či vaším týmem, jež mají krok čekající na osobu: Agent s lidskou kontrolou nebo krok Slack se schválením, tlačítky či formulářem. Ikona vedle otevře tento Workflow na nové kartě.
2. Pokud má Workflow jediný takový krok, vybere se automaticky. Pokud jich má více, **Select agent** je vypíše podle názvu uzlu, přičemž **All agents** je první; kroky Slack jsou označeny **(Slack)**.
3. Uložte. Údaj `1/n pending` v záhlaví počítá pouze tyto kontroly. Vyberte **Všechny Workflowy**, chcete-li znovu zobrazit vlastní frontu.

Stejná volba je na plátně ve vlastnostech uzlu Chart Output. Může ji provést i **Vyladit pomocí AI** („zobraz pouze schvalování faktur“), stejně jako popis nového widgetu, který Workflow pojmenuje. Každá změna je úprava Workflow, takže se zobrazí v Edit History.

- **Kdo vidí kontroly.** Widget filtrovaný na Workflow zobrazuje kontroly tohoto Workflow každému, kdo může Workflow otevřít, a tito lidé mohou přes něj schvalovat, žádat o změny nebo zamítat, stejně jako by mohli Workflow spustit. Nefiltrovaný widget zobrazuje každému jeho vlastní frontu.
- **Kdo vidí widget.** Kdo vybraný Workflow otevřít nemůže, widget vůbec nevidí, ani na dashboardu, který je s ním sdílen. Pokud vlastník dashboardu ztratí k Workflow přístup nebo je Workflow smazán, vlastník vidí „You no longer have access to the workflow this widget shows“ a může v **Nastavení** vybrat jiný.
- **Pouze dostupné volby.** Workflow, který nemůžete otevřít, je při ukládání widgetu odmítnut, ať už z nastavení, z plátna, nebo přes AI.

## Detailní stránky

Tabulkový widget může propojit své řádky s jiným dashboardem, který pak funguje jako detailní stránka: jeden dashboard sloužící pro každého zákazníka, fakturu nebo tiket.

1. Otevřete **Settings** tabulkového widgetu a v části **Row link** vyberte cílový dashboard.
2. Zadejte **Record column**, tedy sloupec, jehož hodnota identifikuje řádek (například `id`), a volitelně **Label column**, který jej pojmenovává (například `name`).
3. Uložte. Kliknutím na řádek (nebo jeho zaměřením a stisknutím klávesy Enter) se otevře propojený dashboard s parametry `?record=<value>&label=<name>`.

Na detailním dashboardu čte každý workflow widgetu tuto hodnotu jako `$page.record` (viz [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)) a stránka nad mřížkou zobrazuje `Dashboard / <label>` spolu s tlačítkem pro vymazání záznamu. Tlačítko Zpět vás vrátí do tabulky, ze které jste přišli.

- **Kdo ji může otevřít.** Řádky jsou klikatelné pouze pro prohlížející, kteří mohou otevřít propojený dashboard. Ostatní vidí stejnou tabulku bez odkazů.
- **Formát záznamu.** Záznam pochází z URL, takže detailní dashboard rozhoduje o tom, co přijme. V jeho nastavení je **Detail page records** jednou z možností: ID (písmena, číslice, `-`, `_` a `.`, až 128 znaků; výchozí), čísla, UUID nebo e-mailové adresy. Jakákoli jiná hodnota je odmítnuta ještě před spuštěním widgetu a widgety zobrazí „This page does not accept that record".
- **Stále běží pod vlastníkem.** I na detailní stránce běží widgety pod účtem vlastníka dashboardu. Tvůrci by měli předávat `$page.record` pouze tam, kde jej uzel escapuje, nikdy přímo do textu dotazu.
- **Mezipaměť.** Každý widget ukládá svůj graf do mezipaměti pro každý záznam zvlášť, se stejnou dobou platnosti (TTL) jako samotný widget, a uchovává 50 naposledy použitých záznamů.

## Spouštěcí widgety

Widget **Run a workflow** spustí jeden z vašich workflow a zobrazí výsledek: stav, dobu běhu a výstupy. Co zobrazí, závisí na tom, jaké vstupy workflow přijímá:

- **Soubor.** U workflow, který začíná uzlem [File Upload Trigger](../nodes/file-upload-trigger-node.md), na něj přetáhněte soubor (nebo kliknutím vyberte soubor) a widget jej nahraje prostřednictvím jednorázového nahrávacího odkazu daného triggeru. Widget zobrazuje typy a velikost souborů, které trigger přijímá, a ostatní před nahráním odmítne. Pokud workflow začíná také uzlem Text Input, zobrazí widget jeho pole vedle oblasti pro přetažení: vyberte soubor, vyplňte pole a tlačítko **Run** odešle obojí. Hodnoty cestují spolu s nahrávacím odkazem, který widget vygeneruje, takže sdílený nahrávací odkaz je nemůže nastavit.
- **Vstupní pole.** U workflow, který začíná uzlem Text Input, zobrazí widget jeho pole s výchozími hodnotami; tlačítko **Run** spustí workflow s vašimi hodnotami. Hodnoty pro pole, která workflow nemá, jsou zahozeny.
- **Nic.** Workflow bez vstupů dostane tlačítko **Run**.

Tlačítko **Wrap** u výsledku zalamuje dlouhé řádky výstupu uvnitř pole; vypněte jej, chcete-li číst rozvržení JSON výstupu.

- Kdokoli, kdo může otevřít dashboard, může widget spustit, stejně jako kdokoli může obnovit graf. Přístup k workflow se řídí vlastníkem dashboardu: přidání widgetu vyžaduje workflow, který můžete spustit vy i vlastník, a samotný běh používá přihlašovací údaje vlastníka workflow, stejně jako jakýkoli nahrávací odkaz.
- Výsledek zůstává na vaší obrazovce, dokud stránku neopustíte; ostatní prohlížející nevidí vaše soubory, hodnoty ani výsledky. Běh se zobrazí v historii spuštění s triggerem `dashboard`.
- Sdílení dashboardu nikdy neuděluje přístup k samotnému workflow. **Edit workflow** jej otevře lidem, kteří již přístup mají, a **Fine-tune with AI** se nenabízí.
- Souborové běhy se provádějí na hlavní instanci, kde jsou uloženy nahrané soubory, stejně jako každý běh File Upload Triggeru.

## Generování widgetu pomocí AI

Klikněte na **AI**, popište metriku, kterou chcete (například „míra úspěšnosti workflow za posledních 30 dní jako sloupcový graf"), a vyberte přihlašovací údaje LLM a model. Heym vygeneruje kompletní workflow widgetu zakončené uzlem Chart Output a přidá jej do mřížky. Příklady promptů pro jednotlivé typy grafů najdete v části [Chart Output](../nodes/chart-output-node.md#example-ai-prompts).

Widget dostane krátký název o jednom nebo dvou slovech v jazyce vašeho zadání, například „Otevřené případy“. Název nikdy neobsahuje ID datové tabulky; pokud model pojmenuje widget celou větou, Heym ponechá její první slova.

API widgetů dokáže vytvořit **kartu s počtem** i bez AI: widget `text` nad datovou tabulkou (`data_table_id`) s `count_column` a `count_value` zobrazí, kolik řádků má danou hodnotu; název widgetu uvádí hodnotu. Heym Work uvádí stránky vytvořené z datové tabulky jednou kartou s počtem pro každý stav.

Pomocí tlačítka **Fine-tune with AI** u widgetu upravte existující widget novým pokynem. Každé doladění pomocí AI uloží snímek předchozího workflow do **Edit History** widgetu, takže můžete změny zkontrolovat nebo vrátit zpět z editoru workflow.

## Úprava rozvržení

Přepnutím **Edit** vstoupíte do režimu úprav, kde můžete widgety přetahovat a měnit jejich velikost v mřížce o 12 sloupcích. Změny rozvržení se ukládají automaticky. Názvy widgetů lze upravovat přímo v záhlaví widgetu.

## Ukládání do mezipaměti a obnovení

Každý widget ukládá svá poslední vypočtená data do mezipaměti na serveru po konfigurovatelnou dobu životnosti (TTL). Dokud je mezipaměť čerstvá, znovuotevření dashboardu poskytne uložený výsledek místo opětovného spuštění workflow. Mezipaměť se nahrazuje na místě při každém přepočtu dat (jedna mezipaměť na widget, plus jedna na záznam na [detailní stránce](#detail-pages)) a automaticky se zneplatní při úpravě workflow widgetu.

Pomocí tlačítka **Refresh** u widgetu (nebo **Refresh** na panelu nástrojů) obejdete mezipaměť a přepočítáte data okamžitě.
## Sdílení

Vlastníci sdílejí dashboard z jeho nastavení, a to s jednotlivými uživateli (prostřednictvím e-mailu) nebo s libovolným [týmem](teams-tab.md), jehož jsou členem. Každé sdílení je typu **Read** nebo **Write**; pokud má někdo jak osobní, tak týmové sdílení, uplatní se silnější z nich.

| Akce | Vlastník | Write | Read |
|--------|:-----:|:-----:|:----:|
| Zobrazovat widgety, obnovovat je, používat automatické obnovování | ✓ | ✓ | ✓ |
| Otevírat detailní stránky, spouštět spouštěcí widgety | ✓ | ✓ | ✓ |
| Přidávat, klonovat, mazat, přejmenovávat a měnit velikost widgetů; generovat a doladit pomocí AI; odškrtávat položky kontrolního seznamu | ✓ | ✓ | |
| Otevřít workflow widgetu v editoru | ✓ | ✓ | |
| Přejmenovat nebo smazat dashboard, nastavit formát záznamu, spravovat sdílení | ✓ | | |

**Widgety vždy běží jako vlastník dashboardu.** Bez ohledu na to, kdo se na ně dívá, widget používá přihlašovací údaje a globální proměnné vlastníka a jeho běhy se zobrazují v historii spuštění a tracech vlastníka. Členové týmu tak vidí stejná data, aniž by měli přístup k účtům, které za nimi stojí, a všichni diváci sdílejí jeden cachovaný výsledek na widget. Widgety, které přidá nebo naklonuje spolupracovník s právem zápisu, rovněž patří vlastníkovi.

Z tohoto důvodu **Write** nese stejnou míru důvěry jako sdílení workflow pro úpravy: spolupracovník s právem zápisu může změnit, co se spouští s vašimi přihlašovacími údaji. Udělte jej pouze lidem, kterým byste dovolili upravovat vaše workflow. Testovací běh, který spolupracovník spustí z editoru workflow, používá jeho vlastní přihlašovací údaje, stejně jako u jakéhokoli sdíleného workflow; jako vlastník běží pouze samotný dashboard. **Read** neposkytuje žádný přístup k workflow widgetů a diváci pouze pro čtení obdrží samotný graf, ale nikoli podrobnosti o spuštění jednotlivých uzlů, které za ním stojí.

Odebrání sdílení nebo jeho snížení z write na read nabývá účinnosti okamžitě.

## Související

- [Uzel Chart Output](../nodes/chart-output-node.md)
- [Záložka Analytics](analytics-tab.md) — vestavěné metriky spuštění (odlišné od uživatelsky vytvářených dashboardů)