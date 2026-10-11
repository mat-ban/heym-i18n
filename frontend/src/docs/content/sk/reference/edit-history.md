# História úprav

História úprav sleduje uložené verzie workflowu. Použite ju na zobrazenie zmien v čase, porovnanie verzií alebo návrat do predchádzajúceho stavu.

**Poznámka:** História úprav sa líši od [Histórie spustení](./execution-history.md). História úprav sleduje **uloženia** (zmeny štruktúry workflowu); História spustení sleduje **spustenia** (predchádzajúce behy).

## Kde ju nájsť

**Panel nástrojov editora** → **História úprav** (ikona GitBranch)

## Verzie

Nová verzia sa vytvorí pri každom **uložení** workflowu. Zoznam zobrazuje:

- **Aktuálna** – Najnovší uložený stav (to, čo vidíte na plátne)
- **Verzia N** – Predchádzajúce uloženia s časovými značkami

Verzie bez zmien oproti predchádzajúcej verzii sú skryté.

## Zobrazenie rozdielov

Vyberte verziu a zobrazte, čo sa zmenilo oproti aktuálnemu workflowu:

| Typ zmeny | Popis |
|-------------|--------------|
| **Uzly** | Pridané, odstránené alebo upravené uzly |
| **Hrany** | Pridané, odstránené alebo upravené prepojenia |
| **Konfigurácia** | Nastavenia na úrovni workflowu (autentifikácia, limity požiadaviek atď.) |

Rozbaľte jednotlivé zmeny a zobrazte rozdiely na úrovni polí (napr. ktoré vlastnosti uzla sa zmenili).

## Náhľad

Ak chcete vidieť, ako workflow vyzeral v predchádzajúcej verzii, kliknite na **Náhľad** vedľa tlačidla Vrátiť.

Otvorí sa plátno iba na čítanie zobrazujúce uzly a hrany danej verzie. Môžete posúvať a približovať zobrazenie a preskúmať rozloženie; v tomto zobrazení nie je možné vykonávať žiadne zmeny.

## Vrátenie

Obnovenie predchádzajúcej verzie:

1. Vyberte verziu, ktorú chcete obnoviť
2. Kliknite na **Vrátiť**
3. Potvrďte akciu
4. Aktuálny workflow sa nahradí vybranou verziou; stránka sa znovu načíta

Vrátením sa vytvorí nový „aktuálny" stav – v prípade potreby môžete vrátiť zmeny znova.

## Vymazanie histórie

Kliknutím na ikonu koša v záhlaví dialógového okna odstránite celú históriu verzií. Túto akciu nie je možné vrátiť. Aktuálny workflow zostane zachovaný; odstránia sa iba predchádzajúce verzie.

## Kedy sa verzie vytvárajú

Verzie sa vytvárajú iba pri **uložení** (Ctrl/Cmd+S alebo tlačidlo Uložiť). Neuložené zmeny sa v Histórii úprav neukladajú, kým ich neuložíte.

Úpravy zručností agenta sú zahrnuté v týchto snímkach. Ak chcete prezerať alebo obnoviť jednu zručnosť bez vrátenia celého workflowu, použite tlačidlo **História** na karte danej zručnosti v paneli vlastností uzla Agenta. Pozrite si [Uzol Agenta](../nodes/agent-node.md#skill-history).

## Súvisiace

- [História spustení](./execution-history.md) – Predchádzajúce behy a Prenesenie na plátno
- [Štruktúra workflowu](./workflow-structure.md) – Formát uzlov a hrán
- [Karta Workflowy](../tabs/workflows-tab.md) – Vytváranie a správa workflowov
