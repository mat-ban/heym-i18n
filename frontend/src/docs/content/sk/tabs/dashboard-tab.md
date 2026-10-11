# Dashboard

Karta **Dashboard** je priestor v štýle Grafany, kde vytvárate mriežky widgetov s grafmi. Každý widget sa vykresľuje z výstupu vlastného skrytého workflow v HeyMe, takže akékoľvek údaje, ktoré dokážete vytvoriť vo workflow — databázové dotazy, volania API, vyhľadávania RAG, výstup LLM — sa môžu stať grafom. Môžete mať niekoľko dashboardov a každý z nich zdieľať s ľuďmi alebo tímami.

## Dashboardy

Každý začína s jedným dashboardom, ktorý sa vytvorí pri prvom otvorení karty. Na prepínanie medzi dashboardmi použite selektor dashboardov v hornej časti karty a pomocou **+** vedľa neho vytvorte nový. Selektor najprv zobrazuje Vaše vlastné dashboardy, potom tie, ktoré sú s Vami zdieľané, označené menom osoby, ktorá ich zdieľala.

Karta znovu otvorí naposledy použitý dashboard a do adresného riadka sa prenáša otvorený dashboard (`?tab=dashboard&dashboard=<id>`), takže odkaz otvorí presne tento dashboard každému, kto k nemu má prístup.

Tlačidlo nastavení (len pre vlastníkov) premenuje dashboard, spravuje zdieľanie a odstráni ho. Odstránením dashboardu sa odstránia jeho widgety a ich workflowy. Vždy si zachováte aspoň jeden vlastný dashboard, takže posledný nie je možné odstrániť.

## Widgety

Widget je jeden graf v mriežke. Podporované typy grafov:

- **Bar** (vertikálny alebo horizontálny)
- **Line**
- **Area** (vyplnený trend, podporuje viacero sérií)
- **Pie**
- **Table** (posúvateľná)
- **Numeric** (jedna hodnota KPI s voliteľnou jednotkou)
- **Gauge** (jedna hodnota voči rozsahu min–max, napr. percento)
- **Scatter** (body X/Y pre korelačné grafy)
- **Proportion** (jeden pruh rozdelený na podiely s percentuálnou legendou, napr. rozpis jazykov)
- **Bar gauge** (jeden horizontálny gauge na riadok s prechodom červená→zelená a hodnotou, napr. voľné miesto na disku)
- **Text** (markdown správa, napr. stavová poznámka ako „Posledné spustenie o 19:47"; podporuje [interaktívne zaškrtávacie políčka](../nodes/chart-output-node.md#interactive-task-lists), keď je markdown statický, a [explicitné číslované zoznamy](../nodes/chart-output-node.md#numbered-lists) pre vlastné alebo zostupné číslovanie)
- **HITL** (Vaše čakajúce ľudské revízie. Hlavička zobrazuje `1/n pending`. Názov workflowu otvorí toto spustenie na plátne. **Approve**, **Request changes** a **Reject** ho vyriešia. Ikona histórie vedľa názvu widgetu otvorí toto spustenie v dialógu histórie na tejto stránke. Widget nepoužíva riadky z upstreamu a každá osoba vidí svoj vlastný front)

Každý widget načítava svoje údaje asynchrónne pri otvorení karty, takže stránka zostáva responzívna, kým sa grafy napĺňajú.

## Pridanie widgetu

1. Kliknite na **Add widget**, zadajte mu názov a vyberte typ grafu. Pod výberom dialóg vykreslí príklad daného typu grafu s ukážkovými údajmi a pomenuje riadky, ktoré očakáva, takže môžete porovnať typy predtým, než čokoľvek vytvoríte.
2. Widget sa otvorí v editore workflowu so štartovacím grafom: uzol [Set](../nodes/set-node.md), ktorý vytvára riadky, prepojený s uzlom [Chart Output](../nodes/chart-output-node.md). Nahraďte uzol Set ľubovoľným zdrojom údajov. Widget **HITL** je len uzlom Chart Output; číta Vaše čakajúce revízie a nepotrebuje zdroj údajov.
3. Zostavte workflow tak, aby uzol napájajúci **Chart Output** vytváral pole riadkov, a potom nakonfigurujte mapovanie polí uzla Chart Output (pole označenia, pole hodnoty atď.).
4. Uložte, vráťte sa na kartu Dashboard a widget sa vykreslí.

Dvojkliknutím na widget (alebo pomocou jeho tlačidla úprav) kedykoľvek znovu otvoríte jeho workflow. Pomocou **Clone widget** v hlavičke widgetu duplikujte widget aj jeho kompletný workflow. Kópia sa umiestni pod originál a označí sa ako **(Copy)**, takže ju môžete upravovať nezávisle.

## Generovanie widgetu pomocou AI

Kliknite na **AI**, opíšte metriku, ktorú chcete (napríklad „miera úspešnosti workflowu za posledných 30 dní ako stĺpcový graf"), a vyberte prihlasovacie údaje LLM a model. Heym vygeneruje kompletný workflow widgetu končiaci uzlom Chart Output a pridá ho do mriežky. Príklady promptov pre jednotlivé typy grafov nájdete v časti [Chart Output](../nodes/chart-output-node.md#example-ai-prompts).

Pomocou tlačidla **Fine-tune with AI** daného widgetu upravte existujúci widget novým pokynom. Každé doladenie pomocou AI uloží snímku predchádzajúceho workflowu do **Edit History** widgetu, takže môžete zmeny skontrolovať alebo vrátiť z editora workflowu.

## Úprava rozloženia

Prepnite **Edit** na vstup do režimu úprav, kde môžete widgety presúvať a meniť ich veľkosť v mriežke s 12 stĺpcami. Zmeny rozloženia sa ukladajú automaticky. Názvy widgetov je možné upravovať priamo v hlavičke widgetu.

## Ukladanie do vyrovnávacej pamäte a obnovenie

Každý widget ukladá svoje naposledy vypočítané údaje do vyrovnávacej pamäte na serveri na konfigurovateľnú dobu životnosti (TTL). Kým je vyrovnávacia pamäť čerstvá, opätovné otvorenie dashboardu poskytne uložený výsledok namiesto opätovného spustenia workflowu. Vyrovnávacia pamäť sa nahradí na mieste vždy, keď sa údaje prepočítajú (jedna vyrovnávacia pamäť na widget), a automaticky sa zneplatní pri úprave workflowu daného widgetu.

Pomocou tlačidla **Refresh** daného widgetu (alebo **Refresh** na paneli nástrojov) obídete vyrovnávaciu pamäť a okamžite prepočítate údaje.
## Zdieľanie

Vlastníci zdieľajú dashboard z jeho nastavení, a to s jednotlivými používateľmi (prostredníctvom e-mailu) alebo s ľubovoľným [tímom](teams-tab.md), do ktorého patria. Každé zdieľanie je typu **Read** alebo **Write**; ak má niekto pridelené osobné aj tímové zdieľanie, uplatní sa to silnejšie.

| Akcia | Vlastník | Write | Read |
|--------|:-----:|:-----:|:----:|
| Zobrazenie widgetov, ich obnovenie, použitie automatického obnovovania | ✓ | ✓ | ✓ |
| Pridávanie, klonovanie, odstraňovanie, premenovanie a zmena veľkosti widgetov; generovanie a doladenie pomocou AI; odškrtávanie položiek kontrolného zoznamu | ✓ | ✓ | |
| Otvorenie workflow widgetu v editore | ✓ | ✓ | |
| Premenovanie alebo odstránenie dashboardu, správa zdieľania | ✓ | | |

**Widgety sa vždy spúšťajú ako vlastník dashboardu.** Bez ohľadu na to, kto sa na ne pozerá, widget používa prihlasovacie údaje a globálne premenné vlastníka a jeho spustenia sa zobrazujú v histórii spustení a v trasách vlastníka. Členovia tímu tak vidia rovnaké údaje bez prístupu k účtom, ktoré za nimi stoja, a všetci diváci zdieľajú jeden výsledok uložený v cache pre každý widget. Widgety, ktoré pridá alebo naklonuje spolupracovník s právom zápisu, tiež patria vlastníkovi.

Z tohto dôvodu **Write** nesie rovnakú mieru dôvery ako zdieľanie workflow na úpravy: spolupracovník s právom zápisu môže zmeniť to, čo sa spúšťa s Vašimi prihlasovacími údajmi. Prideľte ho len ľuďom, ktorým by ste dovolili upravovať svoje workflowy. Testovacie spustenie, ktoré spolupracovník spustí z editora workflowu, používa jeho vlastné prihlasovacie údaje, rovnako ako pri akomkoľvek zdieľanom workflowe; ako vlastník sa spúšťa iba samotný dashboard. **Read** neposkytuje žiadny prístup k workflowom widgetov a diváci s právom iba na čítanie dostanú samotný graf, ale nie podrobnosti o spustení jednotlivých uzlov, ktoré za ním stoja.

Odstránenie zdieľania alebo jeho zníženie z write na read nadobúda účinnosť okamžite.

## Súvisiace

- [Uzol Chart Output](../nodes/chart-output-node.md)
- [Karta Analytics](analytics-tab.md) — vstavané metriky spustení (odlišné od dashboardov vytvorených používateľmi)
