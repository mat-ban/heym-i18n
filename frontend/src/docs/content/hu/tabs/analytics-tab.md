# Analytics fül

Az **Analytics** fül a workflow-k végrehajtási mutatóit és trendjeit jeleníti meg. Kövesse nyomon a használatot, a teljesítményt, és azonosítsa a szűk keresztmetszeteket.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Analytics demó megtekintése</a></p>

## Összesítő statisztikák

- **Összes futtatás** – A kiválasztott időszakban lezajlott workflow-futtatások száma
- **Sikerességi arány** – A sikeres futtatások százalékos aránya
- **Átlagos időtartam** – Átlagos végrehajtási idő
- **Megtakarított idő** – A becsült összes megtakarított idő: az egyes workflow-knál beállított futtatásonkénti megtakarított percek × a sikeres futtatások száma, a kiválasztott időablakra összegezve
- **Trendek** – Növekedést/csökkenést jelző indikátorok az előző időszakhoz képest

## Időtartomány

- **1h**, **3h**, **6h** – Utolsó 1 óra, 3 óra vagy 6 óra. Az elemzések óránként kerülnek rögzítésre, így a kezdő órát egészében számolják: az Utolsó óra 15:20-kor a 14:00-tól mostanáig tartó időszakot fedi le
- **24h** – Elmúlt 24 óra
- **7d** – Elmúlt 7 nap
- **30d** – Elmúlt 30 nap
- **All** – A teljes elérhető előzmény

## Workflow szűrő

- A mutatók szűrése egy adott workflow-ra
- **Összes workflow** – Összesítés az összes workflow-ra vonatkozóan

## Táblázatok

Két táblázat mutatja a workflow-k használatát: **Most Used** (szélesebb) és **Most Failed**.

- **Megtakarított idő** – A Most Used az egyes workflow-k összesített megtakarított idejét mutatja (futtatásonként megtakarított percek × sikeres futtatások). A **Not Set** azt jelenti, hogy a becslés hiányzik; kattintson rá, hogy megnyissa azt a mezőt a workflow-n.
- **Rendezhető oszlopok** – Kattintson egy oszlopfejlécre, hogy az adott oszlop szerint rendezze a táblázatot. Kattintson újra a növekvő/csökkenő sorrend váltásához. A nyíl indikátorok mutatják a rendezés irányát.
- **Mobil címkék** – Kis képernyőkön az oszlopcímkék rövidülnek (pl. „Executions" → „Runs", „Success" → „OK", „Error" → „Err"), hogy a táblázatok vízszintes görgetés nélkül elférjenek.

## Diagramok

- **Végrehajtási volumen az idő függvényében** – Vonaldiagram a futtatásokról időintervallumonként
- **Siker vs. hibaarány** – Területdiagram a sikeres és a sikertelen futtatások összehasonlításához
- **Átlagos késleltetés az idő függvényében** – Vonaldiagram a válaszidő változásairól
- **Húzással történő kijelölés** – Kattintson és húzza az egeret bármely diagramon egyéni dátumtartomány fókuszálásához. A kijelölésnek legalább két pontot kell lefednie a diagramon; egy egyszerű kattintás nem jelöl ki semmit
- **Kijelölési mód** – A kijelölt tartományok frissítik az összesítő kártyákat, a diagramokat és a workflow-táblázatokat anélkül, hogy az alapértelmezett beállítást megváltoztatnák
- **Kijelölés törlése** – Térjen vissza az előre beállított időablakhoz, amikor befejezte a részletes vizsgálódást

## Csomóponttípusok

A késleltetési percentilisek alatt három diagram mutatja be, hogy a csomóponti idő és a hibák hogyan oszlanak meg csomóponttípusok szerint (Agent, HTTP Request, Code stb.) a megjelenített workflow-kban:

- **A legtöbb időt igénylő csomópontok** – A 10 legnagyobb összegzett futásidejű csomóponttípus, hívásonkénti átlagos időtartamként ábrázolva. Egy olyan óra, amelyben nem történt az adott típusú hívás, a **Nincs hívás** feliratot jeleníti meg a tooltipben.
- **A legtöbb hibát produkáló csomóponttípusok** – A 10 legtöbb hibát (hiba vagy timeout) felhalmozó csomóponttípus, mindegyik a saját hibaszámával időintervallumonként.
- **A legtöbbször meghívott csomóponttípusok** – A 10 leggyakrabban lefutott csomóponttípus, mindegyik a saját hívásszámával időintervallumonként. A kihagyott csomópontok nem számítanak bele.

Vigye az egeret egy diagram fölé a mutató alatti csomóponttípus megtekintéséhez közvetlenül mellette. Az a csomóponttípus, amely túl kicsi ahhoz, hogy a diagram legnagyobb eleme mellett látható legyen (annak 1%-a alatti), kimarad a diagramból és annak jelmagyarázatából. A diagramok követik a workflow-szűrőt, az időtartományt és a diagramon kijelölt bármely szakaszt. A csomóponti analitika azon verzió óta rögzítésre kerül, amely bevezette azt, és a befejezett futás körülbelül egy percen belül megjelenik. A régebbi futások nem kerülnek beszámításra.

## Automatikus frissítés

- Engedélyezze az automatikus frissítést, hogy a mutatók manuális újratöltés nélkül naprakészek maradjanak

## Kapcsolódó

- [Workflows fül](./workflows-tab.md) – A mért workflow-k
- [Traces fül](./traces-tab.md) – Részletes trace-vizsgálat
- [Logs fül](./logs-tab.md) – Futásidejű naplók a hibakereséshez
- [Kontextuális bemutató](../reference/contextual-showcase.md) – Kompakt oldalútmutató az irányítópult felületeihez

Amikor egy diagram olyan trendet mutat, amelyről inkább értesítést szeretne kapni, mintsem figyelni rá, alakítsa át [riasztássá](./alerts-tab.md): a hibaszám, a futtatás időtartama, az LLM-költés és a végrehajtások száma mind kaphat küszöbértéket egy adott időablakra vonatkozóan.
