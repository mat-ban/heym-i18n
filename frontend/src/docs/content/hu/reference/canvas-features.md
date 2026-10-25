# Vászon funkciók

A workflow-szerkesztő számos funkciót kínál a csomópontok hibakereséséhez, teszteléséhez és rendszerezéséhez: **Futtatás csomópontig**, **AI egy csomóponton**, **Adatrögzítés**, **Végrehajtási naplók**, **Engedélyezés/Letiltás** és **Kinyerés al-workflow-ba**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Szerkesztő demó megtekintése</a></p>

## Futtatás csomópontig

Vigye az egérmutatót bármely csomópont fölé egy ragadós jegyzet kivételével, majd kattintson az alatta lévő **Futtatás** gombra. A Heym végrehajtja az adott csomópontot és annak felsőbb függőségeit, az alsóbb csomópontokat és a nem kapcsolódó ágakat érintetlenül hagyva. Ez a vászon tesztmódját használja, beleértve a rögzített kimeneteket és a workflow normál elágazási feltételeit.

Ha a kiválasztott útvonal bemeneti mezőkkel rendelkezik, a jobb oldali **Futtatás** panel megnyílik, és az első mezőre fókuszál. Adja meg az értékeket, majd kattintson a **Futtatás a(z) _csomópont címkéig_** gombra, vagy nyomja meg a **Ctrl+Enter** (macOS esetén Cmd+Enter) billentyűkombinációt. Az általános body mód a JSON body szerkesztőre fókuszál. A bemeneti mezők nélküli útvonalak azonnal futnak, a panel megnyitása nélkül. A rögzített Bemeneti csomópontok a rögzített kimenetüket használják újra, bemenet kérése nélkül.

A panel a kiválasztott célpontot a további futtatásokhoz is megtartja. Válassza a **Teljes workflow futtatása** lehetőséget a célpont törléséhez. A Futtatás gombok letiltottak, amíg egy végrehajtás aktív. Egy cikluson belüli célpont leállítja a futtatást, amikor az adott csomópont először elérésre kerül; a ciklus utáni csomópont kiválasztása a teljes felsőbb ciklust lefuttatja.

## AI egy csomóponton

Vigye a kurzort bármely csomópont fölé egy öntapadós jegyzet kivételével, és kattintson a felette lévő **AI** gombra. Az [AI Assistant](./ai-assistant.md) megnyílik az adott csomóponton, és felajánlja a **Change this node as ...**, **Fix error in this node ...** és **Other** lehetőségeket. Agent módban az asszisztens csak ezt a csomópontot módosítja; a többi csomópont, kapcsolat és az elrendezés változatlan marad. Lásd: [AI Assistant › Egyetlen csomópont módosítása](./ai-assistant.md#changing-one-node).

A gomb rejtve van az olyan workflow-kban, amelyeket csak megtekinteni jogosult.

## Adatrögzítés

Az Adatrögzítés lehetővé teszi egy csomópont kimenetének rögzítését az utolsó futtatásból, így az alsóbb csomópontokat a rögzített csomópont újrafuttatása nélkül tesztelheti.

### Hol található

- **Tulajdonságok panel** – Válasszon ki egy csomópontot, és görgessen a **Rögzített adatok** szakaszhoz
- **Csomópont jelvény** – A csomóponton egy tű ikon jelenik meg, amikor adat van rögzítve

### Műveletek

| Művelet | Leírás |
|--------|-------------|
| **Rögzítés** | Rögzíti a csomópont utolsó végrehajtási kimenetét (futtatás után érhető el) |
| **Törlés** | Eltávolítja a rögzített adatokat |
| **Szerkesztés** | A rögzített JSON közvetlen szerkesztése; kattintson a Mentés gombra az alkalmazáshoz |

### Tesztmód viselkedése

Amikor egy workflow-t tesztmódban futtat, a `pinnedData`-val rendelkező csomópontok kihagyják a végrehajtást, és a rögzített kimenetet használják helyette. Ezt a következőkre használhatja:

- Alsóbb logika tesztelése külső API-k hívása nélkül
- A csomópont kimenetére hivatkozó kifejezések hibakeresése
- Promptok vagy feltételek iterálása rögzített mintadatokkal

A szerkesztőben a kifejezés-kiegészítés a rögzített adatokat használja, amikor elérhetők, a mezők javaslásához.

## Végrehajtási naplók

A **Hibakeresési panel** (alsó fiók) valós idejű végrehajtási naplókat mutat a workflow futása közben. Egy futó éles végrehajtást is megnyithat az Előzmények párbeszédpanelről vagy egy Board kártyáról. A szerkesztő csatlakozik az adott futtatás SSE streamjéhez, visszaállítja a befejezett csomópontok eredményeit, és továbbra is mutatja a csomópont animációkat és naplókat, ahogy az új csomópontok elindulnak és befejeződnek.

### Mit mutat

- **Csomópont eredmények** – Csomópontonkénti állapot (`success`, `error`, `skipped`, `running`), végrehajtási idő és kimenet
- **Végső kimenetek** – Az [Output](../nodes/output-node.md) csomópontok összesített kimenetei
- **Agent előrehaladás** – Az [Agent](../nodes/agent-node.md) csomópontok esetében lépésenkénti eszközhívások és érvelés

### Műveletek

- **Másolás JSON-ként** – A teljes végrehajtási napló vágólapra másolása
- **Megnyitás JSON szerkesztőben** – A napló megnyitása JSON Hero-ban vagy JSON Editor Online-ban ellenőrzéshez
- **Generált fájlok letöltése** – Ha egy skill letölthető fájlokat állított elő (`_generated_files`), egy Letöltés gomb jelenik meg. Egyetlen fájl közvetlenül letöltődik; több fájl esetén egy kiválasztási felugró ablak nyílik meg.

### Megkülönböztetés a Naplók fültől

A Hibakeresési panel **workflow végrehajtási** naplókat mutat (csomópont eredmények, kimenetek). A [Naplók fül](../tabs/logs-tab.md) **Docker konténer** naplókat mutat (backend, frontend, adatbázis). <!-- pragma: allowlist secret -->

## Engedélyezés / Letiltás

Letilthatja a csomópontokat, hogy a végrehajtás során kihagyásra kerüljenek. A letiltott csomópontok egy "off" jelvényt mutatnak, és halványan jelennek meg.

### Átváltás módja

| Módszer | Leírás |
|--------|-------------|
| **Tulajdonságok panel** | Válassza ki a csomópontot → Power ikon (jobb felső sarok) |
| **Helyi menü** | Kattintson jobb gombbal a csomópont(ok)ra → Letiltás vagy Engedélyezés |
| **Billentyűzet** | Válassza ki a csomópont(oka)t → nyomja meg a **D** billentyűt (lásd [Billentyűparancsok](./keyboard-shortcuts.md)) |

### Többszörös kijelölés

Amikor több csomópont van kijelölve, az Engedélyezés/Letiltás mindegyikre vonatkozik. A helyi menü az "Engedélyezés" opciót mutatja, ha bármely kijelölt csomópont le van tiltva, és a "Letiltás" opciót, ha mindegyik engedélyezve van.

### Futásidejű viselkedés

A `active: false` értékkel rendelkező csomópontok kihagyásra kerülnek. Az alsóbb csomópontok nem kapnak adatot a kihagyott csomópontoktól. Ezt arra használhatja, hogy ideiglenesen kizárjon csomópontokat anélkül, hogy törölné őket.

Ha egy csomópontot egy workflow-n belülről szeretne be- vagy kikapcsolni a kézi művelet helyett, használja a [Csomópont letiltása](../nodes/disable-node.md) és a [Csomópont engedélyezése](../nodes/enable-node.md) lehetőségeket.
## Agent memória gráf

A **[perzisztens memóriával](./agent-persistent-memory.md)** engedélyezett [Agent](../nodes/agent-node.md) csomópontok rózsaszín **agy** vezérlőt jelenítenek meg a csomóponton. Kattintson rá a memória gráf szerkesztő megnyitásához: az entitások animált, erővezérelt gráfként jelennek meg, entitástípus szerint csoportosítva, kereshető Forrás/Cél választókkal a kapcsolatok hozzáadásához, valamint egy kapcsolatok panellel a hivatkozott entitások közötti ugráshoz. Ugyanez a párbeszédpanel tartalmazza a **Memória megosztása más agentekkel** (workflow → agent → olvasás vagy olvasás/írás) lehetőséget a [agentek közötti memóriamegosztáshoz](./agent-persistent-memory.md#sharing-with-other-agents). Amíg a párbeszédpanel nyitva van, a fő vászon visszavonása/újrafelvétele elhalasztódik, így a gráfszerkesztés megőrzi a saját előzményeit.

**A gráf szűrése.** A vászon bal felső sarkában található egy keresővezérlő, amely egy gyorsgombra csukódik össze, amíg rá nem kattint vagy meg nem nyomja a **Ctrl/Cmd+F** billentyűkombinációt. Az entitás nevére, típusára, valamint minden attribútumkulcsra és -értékre illeszkedik, továbbá egy kapcsolat típusára (`parent_of`) és annak tulajdonságaira; egy illeszkedő kapcsolat mindkét entitását magával hozza. Minden szóközzel elválasztott kifejezésnek illeszkednie kell. Egy illeszkedő entitás magával hozza a teljes szomszédságát — minden kapcsolatot, amelyben részt vesz, és minden egyes kapcsolat túloldalán lévő entitást —, így egy találat soha nem marad kapcsolat nélküli pontként. Egy illeszkedő kapcsolat csak az általa összekötött két entitást hozza magával, és ott megáll, mivel egy relációtípus keresése inkább az adott relációra vonatkozó kérdés, mintsem mindarra, amihez a végpontjai kapcsolódnak. Minden más egyértelműen elrejtésre kerül — nem halványul el — a vásznon és az **Összes él** listában, és egy jelvény mutatja, hogy a teljes entitások közül hány maradt meg. A mezőben lévő **✕** először törli a lekérdezést, majd egy második megnyomásra bezárja a mezőt. Az Escape ugyanígy bontja vissza a rétegeket, a legbelsőtől kezdve: törli a lekérdezést, majd bezárja a keresőmezőt, majd elhagyja a kibővített vászonnézetet, és csak akkor zárja be a párbeszédpanelt, ha ezek egyike sem nyitott. A törlés visszaállítja a teljes gráfot, minden entitást oda, ahol volt.

**Entitások kézi elhelyezése.** Egy entitás húzása rögzíti azt ott, ahol elengedi, így az automatikus elrendezés a gráf többi részét rendezi körülötte, ahelyett hogy visszahúzná. A kijelölt entitás húzása a közvetlenül kapcsolódó entitásokat is magával mozgatja, megőrizve a klaszter alakját; bármely más entitás húzása csak azt az egyet mozgatja. A **Rendezett elrendezés** (a varázspálca gomb) elengedi az összes rögzített entitást, és újrafuttatja az automatikus elrendezést.

## Kinyerés al-workflow-ba

A kijelölt csomópontok átalakítása újrafelhasználható al-workflow-vá, és lecserélése egy [Execute](../nodes/execute-node.md) csomópontra.

### Használat

1. Jelöljön ki egy vagy több csomópontot a vásznon
2. Jobb kattintás → **Kinyerés al-workflow-ba**
3. Adjon meg egy nevet (és opcionális leírást) az új workflow-hoz
4. Kattintson a **Kinyerés** gombra

### Mi történik

- Létrejön egy új workflow a kijelölt csomópontokkal
- A külső bemenetek (a kijelölésen kívülről érkező élek) az al-workflow [Input](../nodes/input-node.md) mezőivé válnak
- A külső kimenetek (a kijelölésen kívüli csomópontokhoz vezető élek) az al-workflow [Output](../nodes/output-node.md) eleméhez lesznek hozzárendelve
- A kijelölt csomópontok egyetlen [Execute](../nodes/execute-node.md) csomópontra cserélődnek, amely az új workflow-t hívja
- A bemeneti/kimeneti hozzárendelések automatikusan megőrződnek

### Használati esetek

- Csomópontok sorozatának újrafelhasználása több workflow között
- Egy összetett workflow egyszerűsítése a kapcsolódó logika csoportosításával
- Moduláris, tesztelhető al-workflow-k létrehozása

## Futtatás cURL-lel

A szerkesztő eszköztárában (jobb felső sarok) található **cURL** gomb egy párbeszédpanelt nyit meg, amellyel cURL parancsot lehet összeállítani és másolni a workflow API-n keresztüli indításához.

- Válassza ki a workflow kérés törzsének módját (`Defined` vagy `Generic`)
- Állítsa be a hitelesítés típusát (Anonymous, JWT vagy Header Auth)
- Konfigurálja a válasz gyorsítótárazását és a sebességkorlátozást
- Kapcsolja be/ki az SSE streaminget, és szabja testre a csomópontonkénti indítási üzeneteket
- Szerkessze a kérés törzsét
- Generic módban a vászon futtatási panelje ugyanazt a nyers JSON törzset használja, mint a cURL párbeszédpanel
- Kattintson a **cURL másolása** gombra a futtatásra kész parancs másolásához

A párbeszédpanel teljes részleteiért lásd a [Webhookok](./webhooks.md#run-with-curl-dialog) oldalt, az eseményprotokollért pedig az [SSE Streaming](./sse-streaming.md) oldalt.

## Kapcsolódó

- [Billentyűparancsok](./keyboard-shortcuts.md) – Az összes vászon- és szerkesztőparancs
- [Agent perzisztens memória](./agent-persistent-memory.md) – A memória gráf viselkedése és API-ja
- [Execute csomópont](../nodes/execute-node.md) – Al-workflow-kat hív
- [Expression DSL](./expression-dsl.md) – Hivatkozások és rögzített adatok
- [Workflow struktúra](./workflow-structure.md) – Csomópont- és élformátum
- [Letöltés és importálás](./download-import.md) – Workflow-k exportálása és importálása JSON formátumban
- [Csomóponttípusok](./node-types.md) – Az összes csomóponttípus
- [Naplók lap](../tabs/logs-tab.md) – Docker konténer naplók
- [Futtatási előzmények](./execution-history.md) – Korábbi futtatások
- [Sablonok](../tabs/templates-tab.md) – Workflow-k és csomópontok mentése és újrafelhasználása
- [Kontextuális bemutató](./contextual-showcase.md) – Kompakt oldalútmutató, amely a szerkesztőben érhető el

- [Együttműködés a vásznon](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
