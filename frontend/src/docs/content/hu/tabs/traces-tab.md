# Nyomkövetések lap

A **Nyomkövetések** lap az LLM-végrehajtások nyomkövetéseit jeleníti meg. Vizsgálja meg a kérés/válasz payloadokat, az időzítést, az eszközhívásokat, és hibakeresést végezhet az [Agent](../nodes/agent-node.md) és [LLM](../reference/node-types.md) csomópontok viselkedésében, valamint összesített metrikákat tekinthet meg (hívások, tokenek, költség, késleltetés, hibaarány) bármely időablakban.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Nyomkövetések demó megtekintése</a></p>

## Statisztikai fejléc

Az oldal a nyomkövetési lista felett egy statisztikai összegzéssel nyílik meg, amely a kiválasztott időtartomány és a többi aktív szűrő alapján kerül kiszámításra:

- **KPI-kártyák** – Összes hívás, Összes token, Összes költség (USD), Átlagos késleltetés, Hiba %
- **Tokenek modellenként** – Fánkdiagram a tokenmennyiségről modellenként
- **Költség modellenként** – Fánkdiagram az USD-költésről modellenként. Az árazással nem rendelkező modellek egy „Árazás konfigurálása” hivatkozást jelenítenek meg az [LLM-költségtáblához](./datatable-tab.md#llm-cost-table-system-table)
- **Hívások időbeli alakulása** – Halmozott területdiagram a sikeres és sikertelen hívásokról gyűjtőkategóriánként (5 perc / 1 óra / 6 óra / 1 nap, a tartomány alapján automatikusan kiválasztva)
- **Árazás nélküli modellek figyelmeztetése** – A diagramok alatt jelenik meg, ha egyes nyomkövetett modellekhez nem tartozik árazási sor, és az LLM-költségtáblára hivatkozik

## Időtartomány

A szűrősáv tetején található egyetlen **Időtartomány** választó vezérli mind a statisztikai fejlécet, mind a nyomkövetési listát. Lehetőségek: Előző 1 óra, Előző 24 óra, Előző 7 nap (alapértelmezett), Előző 30 nap, Teljes időszak. A tartomány módosítása visszaállítja a lapozást, és egyszerre tölti újra a diagramokat és a listát.

## Nyomkövetési lista

- A kiválasztott időtartományon belüli legutóbbi nyomkövetések lapozható listája
- Minden nyomkövetés a következőket mutatja: workflow, csomópont, hitelesítési adatok, időbélyeg, időtartam
- Kattintson egy nyomkövetésre a részletes nézet megnyitásához
- A **Előző / Következő** gombokkal a részletes párbeszédpanelen belül válthat a nyomkövetések között anélkül, hogy bezárná azt

## Szűrés

- **Időtartomány** – 1ó / 24ó / 7n / 30n / Összes; a diagramokat és a listát együtt szűri
- **Hitelesítési adatok** – Szűrés a használt hitelesítési adatok (API-kulcs) alapján
- **Forrás** – Szűrés workflow vagy végrehajtási forrás alapján
- **Keresés** – Keresés modell, workflow, hitelesítési adatok vagy csomópontcímke alapján
- **Frissítés** – A nyomkövetések aktuális oldalának újratöltése

## Nyomkövetés részletei

Amikor megnyit egy nyomkövetést:

- **Lépések** – Egy fentről lefelé haladó idővonal, amely a nyomkövetést rendezett láncként olvassa: System → User → Assistant → Tool → Answer. Minden lépés összecsukható; egy lépés kinyitása egy olvasható részletet mutat (üzenetszöveg, vagy egy eszköz argumentumai és eredménye), amelyet az adott lépés JSON-ja követ. A JSON-tartalom minden eseménytípusban—beleértve az MCP-hívásokat és a JSON-RPC payloadokat—alapértelmezés szerint egy kinyitható fában nyílik meg, az első szint kinyitva. A **Tree / Raw** gombokkal válthat a formázott struktúra és az eredeti szöveg között. A hibás JSON egyszerű szövegként marad látható. Az eszközlépések megjelenítik azok időtartamát és adott esetben egy MCP/Skill jelvényt, valamint a függőben / időtúllépés / megszakítva jelvényeket, amikor az eszközhívás állapota be van állítva. Az Answer lépés összesített `tool_metrics` jelvényeket mutathat (hívásszámok állapot szerint és teljes eszközidőtartam). Amikor egy nyomkövetés minden modellhívást rögzít, ahogy egy Dashboard Chat üzenet és egy irányított agent tesz, egy **LLM** lépés helyezkedik el a kért hívások eszközei előtt, és az **Időtartam-bontás** egyetlen idővonalon fejti ki az összes modellhívást, eszközt és irányítási döntést. Egy Dashboard Chat üzenet egyetlen nyomkövetés, függetlenül attól, hány eszközkörre volt szükség. Az üzenetlánc nélküli nyomkövetések (például képgenerálás) egy minimális Request → Response idővonalat mutatnak.
- **Request** – Az LLM-hez küldött teljes kérés-payload, **Tree / Raw** JSON-nézetekkel
- **Response** – A modell válasza, beleértve az esetleges eszközhívásokat, **Tree / Raw** JSON-nézetekkel
- **Eszközmetrikák** – Ha jelen vannak a válaszban, az eszközhívásszámok (`success` / `error` / `pending` / `timeout` / `cancelled`) és a teljes eszközidőtartam tömör összegzése
- **Időzítés-bontás** – `llm_ms`, `tools_ms`, `mcp_list_ms` a teljesítményelemzéshez
- **Eszközhívások** – Eszköz neve, argumentumai, eredménye, állapota és eltelt idő
- **Tartalmazott skillek** – A kérésben a modellnek átadott skillek
- **Ugrás a workflow-hoz** – Közvetlen ugrás a kapcsolódó workflow-hoz a nyomkövetés részletei párbeszédpanelről

## Másolás és exportálás

- A kérés vagy válasz JSON másolása a vágólapra; a másolás mindig a teljes nyers payloadot használja, függetlenül az aktív nézettől
- Hibakereséshez vagy az ügyfélszolgálattal való megosztáshoz használható

## Karbantartás

- **Összes törlése** – Az összes mentett nyomkövetés törlése megerősítés után
- A lapozásvezérlők az aktuális látható tartományt mutatják (például `1-25 of 240`)

## Kapcsolódó

- [Miért a Heym](../getting-started/why-heym.md) – LLM-megfigyelhetőség az agent életciklusa során
- [Agent csomópont](../nodes/agent-node.md) – Agent csomópont eszközhívással
- [Csomóponttípusok](../reference/node-types.md) – LLM és Agent csomópontok
- [Hitelesítési adatok lap](./credentials-tab.md) – A nyomkövetésekben használt hitelesítési adatok
- [OpenTelemetry nyomkövetés](../reference/opentelemetry.md) – Opcionális OTel-export workflow-, csomópont- és Agent-eszközspanelekhez
- [Adattáblák lap](./datatable-tab.md) – Az költségdiagram által használt LLM-költségtáblát tartalmazza
- [Kontextuális bemutató](../reference/contextual-showcase.md) – Kompakt oldalútmutató a dashboard felületeihez
