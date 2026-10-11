# Dashboard

Záložka **Dashboard** je prostor ve stylu Grafanu, kde sestavujete mřížky s widgety grafů. Každý widget se vykresluje z výstupu vlastního skrytého Heym workflow, takže jakákoli data, která dokážete ve workflow vytvořit — databázové dotazy, volání API, RAG vyhledávání, výstup LLM — se mohou stát grafem. Můžete mít několik dashboardů a každý z nich sdílet s lidmi nebo týmy.

## Dashboardy

Každý začíná s jedním dashboardem, který se vytvoří při prvním otevření záložky. Mezi dashboardy přepínejte pomocí selektoru v horní části záložky a nový vytvořte pomocí **+** vedle něj. Selektor nejprve vypisuje vaše vlastní dashboardy, poté ty, které jsou s vámi sdílené, označené jménem osoby, která je sdílela.

Záložka znovu otevře naposledy použitý dashboard a adresní řádek nese otevřený dashboard (`?tab=dashboard&dashboard=<id>`), takže odkaz otevře přesně tento dashboard každému, kdo k němu má přístup.

Tlačítko nastavení (pouze pro vlastníky) umožňuje dashboard přejmenovat, spravovat sdílení a smazat jej. Smazáním dashboardu se odstraní jeho widgety a jejich workflow. Vždy vám zůstává alespoň jeden vlastní dashboard, takže poslední nelze smazat.

## Widgety

Widget je jediný graf v mřížce. Podporované typy grafů:

- **Bar** (svislý nebo vodorovný)
- **Line**
- **Area** (vyplněný trend, podporuje více sérií)
- **Pie**
- **Table** (posuvná)
- **Numeric** (jediná hodnota KPI s volitelnou jednotkou)
- **Gauge** (jediná hodnota vůči rozsahu min–max, např. procento)
- **Scatter** (body X/Y pro korelační grafy)
- **Proportion** (jeden pruh rozdělený na podíly s procentuální legendou, např. rozložení jazyků)
- **Bar gauge** (jeden vodorovný gauge na řádek s přechodem červená→zelená a hodnotou, např. volné místo na disku)
- **Text** (markdown zpráva, např. stavová poznámka jako „Poslední spuštění v 19:47"; podporuje [interaktivní zaškrtávací políčka](../nodes/chart-output-node.md#interactive-task-lists), když je markdown statický, a [explicitní číslované seznamy](../nodes/chart-output-node.md#numbered-lists) pro vlastní nebo sestupné číslování)
- **HITL** (vaše čekající lidské revize. Záhlaví zobrazuje `1/n pending`. Název workflow otevře daný běh na plátně. **Approve**, **Request changes** a **Reject** jej vyřeší. Ikona historie vedle názvu widgetu otevře daný běh v dialogu historie na této stránce. Widget nepoužívá řádky z upstreamu a každý vidí svou vlastní frontu)

Každý widget načítá svá data asynchronně při otevření záložky, takže stránka zůstává responzivní, zatímco se grafy plní.

## Přidání widgetu

1. Klikněte na **Add widget**, zadejte název a vyberte typ grafu. Pod voličem dialog vykreslí příklad daného typu grafu s ukázkovými daty a pojmenuje řádky, které očekává, takže můžete typy porovnat, než cokoli vytvoříte.
2. Widget se otevře v editoru workflow se základním grafem: uzel [Set](../nodes/set-node.md), který vytváří řádky, propojený s uzlem [Chart Output](../nodes/chart-output-node.md). Nahraďte uzel Set libovolným zdrojem dat. Widget **HITL** je pouze uzel Chart Output; čte vaše čekající revize a nepotřebuje zdroj dat.
3. Sestavte workflow tak, aby uzel napájející **Chart Output** vytvářel pole řádků, a poté nakonfigurujte mapování polí uzlu Chart Output (pole popisku, pole hodnoty atd.).
4. Uložte, vraťte se na záložku Dashboard a widget se vykreslí.

Dvojklikem na widget (nebo pomocí jeho tlačítka úprav) kdykoli znovu otevřete jeho workflow. Pomocí **Clone widget** v záhlaví widgetu zduplikujete jak widget, tak jeho kompletní workflow. Kopie se umístí pod originál a označí se **(Copy)**, takže ji můžete upravovat nezávisle.

## Generování widgetu pomocí AI

Klikněte na **AI**, popište metriku, kterou chcete (například „míra úspěšnosti workflow za posledních 30 dní jako sloupcový graf"), a vyberte přihlašovací údaje LLM a model. Heym vygeneruje kompletní workflow widgetu zakončené uzlem Chart Output a přidá jej do mřížky. Příklady promptů pro jednotlivé typy grafů najdete v části [Chart Output](../nodes/chart-output-node.md#example-ai-prompts).

Pomocí tlačítka **Fine-tune with AI** u widgetu upravte existující widget novým pokynem. Každé doladění pomocí AI uloží snímek předchozího workflow do **Edit History** widgetu, takže můžete změny zkontrolovat nebo vrátit zpět z editoru workflow.

## Úprava rozvržení

Přepnutím **Edit** vstoupíte do režimu úprav, kde můžete widgety přetahovat a měnit jejich velikost v mřížce o 12 sloupcích. Změny rozvržení se ukládají automaticky. Názvy widgetů lze upravovat přímo v záhlaví widgetu.

## Ukládání do mezipaměti a obnovení

Každý widget ukládá svá poslední vypočtená data do mezipaměti na serveru po konfigurovatelnou dobu životnosti (TTL). Dokud je mezipaměť čerstvá, znovuotevření dashboardu poskytne uložený výsledek místo opětovného spuštění workflow. Mezipaměť se nahrazuje na místě při každém přepočtu dat (jedna mezipaměť na widget) a automaticky se zneplatní při úpravě workflow widgetu.

Pomocí tlačítka **Refresh** u widgetu (nebo **Refresh** na panelu nástrojů) obejdete mezipaměť a přepočítáte data okamžitě.
## Sdílení

Vlastníci sdílejí dashboard z jeho nastavení, a to s jednotlivými uživateli (prostřednictvím e-mailu) nebo s libovolným [týmem](teams-tab.md), jehož jsou členem. Každé sdílení je typu **Read** nebo **Write**; pokud má někdo jak osobní, tak týmové sdílení, uplatní se silnější z nich.

| Akce | Vlastník | Write | Read |
|--------|:-----:|:-----:|:----:|
| Zobrazovat widgety, obnovovat je, používat automatické obnovování | ✓ | ✓ | ✓ |
| Přidávat, klonovat, mazat, přejmenovávat a měnit velikost widgetů; generovat a doladit pomocí AI; odškrtávat položky kontrolního seznamu | ✓ | ✓ | |
| Otevřít workflow widgetu v editoru | ✓ | ✓ | |
| Přejmenovat nebo smazat dashboard, spravovat sdílení | ✓ | | |

**Widgety vždy běží jako vlastník dashboardu.** Bez ohledu na to, kdo se na ně dívá, widget používá přihlašovací údaje a globální proměnné vlastníka a jeho běhy se zobrazují v historii spuštění a tracech vlastníka. Členové týmu tak vidí stejná data, aniž by měli přístup k účtům, které za nimi stojí, a všichni diváci sdílejí jeden cachovaný výsledek na widget. Widgety, které přidá nebo naklonuje spolupracovník s právem zápisu, rovněž patří vlastníkovi.

Z tohoto důvodu **Write** nese stejnou míru důvěry jako sdílení workflow pro úpravy: spolupracovník s právem zápisu může změnit, co se spouští s vašimi přihlašovacími údaji. Udělte jej pouze lidem, kterým byste dovolili upravovat vaše workflow. Testovací běh, který spolupracovník spustí z editoru workflow, používá jeho vlastní přihlašovací údaje, stejně jako u jakéhokoli sdíleného workflow; jako vlastník běží pouze samotný dashboard. **Read** neposkytuje žádný přístup k workflow widgetů a diváci pouze pro čtení obdrží samotný graf, ale nikoli podrobnosti o spuštění jednotlivých uzlů, které za ním stojí.

Odebrání sdílení nebo jeho snížení z write na read nabývá účinnosti okamžitě.

## Související

- [Uzel Chart Output](../nodes/chart-output-node.md)
- [Záložka Analytics](analytics-tab.md) — vestavěné metriky spuštění (odlišné od uživatelsky vytvářených dashboardů)
