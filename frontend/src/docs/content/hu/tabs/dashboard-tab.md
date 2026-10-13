# Irányítópult

Az **Irányítópult** fül egy Grafana-stílusú felület, ahol diagram widgetekből álló rácsokat építhet. Minden widget a saját rejtett Heym workflow-jának kimenetéből renderelődik, így bármilyen adat, amelyet workflow-ban elő tud állítani — adatbázis-lekérdezések, API-hívások, RAG-keresések, LLM-kimenet — diagrammá alakítható. Több irányítópultot is fenntarthat, és mindegyiket megoszthatja személyekkel vagy csapatokkal.

## Irányítópultok

Mindenki egy irányítópulttal kezd, amely az első megnyitáskor jön létre. A fül tetején található irányítópult-választóval válthat az irányítópultok között, a mellette lévő **+** gombbal pedig újat hozhat létre. A választó először a saját irányítópultjait listázza, majd az Önnel megosztottakat, amelyek annak a személynek a nevével vannak jelölve, aki megosztotta őket.

A fül újra megnyitja az utoljára használt irányítópultot, és a címsáv tartalmazza a nyitott irányítópultot (`?tab=dashboard&dashboard=<id>`), így egy hivatkozás pontosan azt az irányítópultot nyitja meg mindenki számára, aki hozzáfér.

A beállítások gomb (csak tulajdonosoknak) átnevezi az irányítópultot, beállítja, hogy milyen rekordokat fogad el [részletező oldalként](#detail-pages), kezeli a megosztást és törli azt. Az irányítópult törlése eltávolítja annak widgetjeit és azok workflow-jait. Mindig megmarad legalább egy saját irányítópultja, így az utolsó nem törölhető.

## Widgetek

A widget egyetlen diagram a rácson. Támogatott diagramtípusok:

- **Bar** (függőleges vagy vízszintes)
- **Line**
- **Area** (kitöltött trend, több sorozatot támogat)
- **Pie**
- **Table** (görgethető; egy oszlop megjeleníthető [állapotcímkékként](../nodes/chart-output-node.md#status-chips), a sorok pedig megnyithatnak egy [részletező oldalt](#detail-pages))
- **Numeric** (egyetlen KPI-érték opcionális mértékegységgel)
- **Gauge** (egyetlen érték egy min–max tartományhoz viszonyítva, pl. egy százalék)
- **Scatter** (X/Y pontok korrelációs ábrázoláshoz)
- **Proportion** (egy sáv részekre osztva százalékos jelmagyarázattal, pl. nyelvi megoszlás)
- **Bar gauge** (egy vízszintes gauge soronként piros→zöld színátmenettel és egy értékkel, pl. szabad lemezterület)
- **Text** (markdown üzenet, pl. egy állapotjelző megjegyzés, mint „Utolsó futtatás 19:47-kor"; támogatja az [interaktív jelölőnégyzeteket](../nodes/chart-output-node.md#interactive-task-lists), ha a markdown statikus, valamint a [kifejezett számozott listákat](../nodes/chart-output-node.md#numbered-lists) egyéni vagy csökkenő számozáshoz)
- **HITL** (az Ön függőben lévő emberi felülvizsgálatai. A fejléc `1/n pending` értéket mutat. A workflow neve megnyitja azt a futtatást a vásznon. Az **Approve**, a **Request changes** és a **Reject** gombok lezárják. A widget címe melletti előzmények ikon megnyitja azt a futtatást az előzmények párbeszédablakban ezen az oldalon. A widget nem használ upstream sorokat, és mindenki a saját sorát látja)

A diagramok mellett a **Run a workflow** widget közvetlenül az irányítópultról futtatja az egyik workflow-ját: egy ráhúzott fájlon, a bemeneti mezőivel vagy egy Run gombbal; lásd: [Futtató widgetek](#run-widgets).

Minden widget aszinkron módon tölti be az adatait a fül megnyitásakor, így az oldal reszponzív marad, amíg a diagramok feltöltődnek.

## Widget hozzáadása

1. Kattintson az **Add widget** gombra, adjon neki címet, és válasszon diagramtípust. A választó alatt a párbeszédablak egy példát rajzol az adott diagramtípusra mintaadatokkal, és megnevezi az elvárt sorokat, így összehasonlíthatja a típusokat, mielőtt bármit építene.
2. A widget megnyílik a workflow-szerkesztőben egy kezdő gráffal: egy [Set](../nodes/set-node.md) csomópont, amely előállítja a sorokat, összekapcsolva egy [Chart Output](../nodes/chart-output-node.md) csomóponttal. Cserélje le a Set csomópontot bármilyen adatforrásra. A **HITL** widget csak a Chart Output csomópont; a függőben lévő felülvizsgálatait olvassa, és nem igényel adatforrást.
3. Építse fel a workflow-t úgy, hogy a **Chart Output** csomópontot tápláló csomópont sorok tömbjét állítsa elő, majd konfigurálja a Chart Output csomópont mezőleképezését (címke mező, érték mező stb.).
4. Mentse el, térjen vissza az Irányítópult fülre, és a widget renderelődik.

Egy **Run a workflow** widget esetében válassza ki inkább a futtatandó workflow-t; a választó megmutatja, hogyan fogja a widget futtatni az egyes workflow-kat. A widget közvetlenül aul a rácsra kerül; nincs szükség új workflow építésére.

Kattintson duplán egy widgetre (vagy használja a szerkesztés gombját) a workflow újbóli megnyitásához bármikor. Használja a **Clone widget** lehetőséget a widget fejlécében a widget és a teljes workflow-jának duplikálásához. A másolat az eredeti alá kerül, és a **(Copy)** címkével van ellátva, így önállóan szerkesztheti.

## Részletező oldalak

Egy táblázat widget összekapcsolhatja sorait egy másik irányítópulttal, amely így részletező oldalként működik: egyetlen irányítópult, amely minden ügyfelet, számlát vagy jegyet kiszolgál.

1. Nyissa meg a táblázat widget **Settings** menüjét, és válassza ki az irányítópultot a **Row link** alatt.
2. Adja meg a **Record column** mezőt — azt az oszlopot, amelynek értéke azonosítja a sort (például `id`) —, és opcionálisan egy **Label column** mezőt, amely megnevezi azt (például `name`).
3. Mentse el. Egy sorra kattintva (vagy ráállva a fókusszal és megnyomva az Entert) megnyílik a hivatkozott irányítópult a `?record=<value>&label=<name>` paraméterekkel.

A részletező irányítópulton minden widget workflow-ja `$page.record` néven olvassa ki az értéket (lásd: [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), az oldal pedig a rács felett megjeleníti a `Dashboard / <label>` feliratot egy gombbal a rekord törléséhez. A Vissza gomb visszavisz ahhoz a táblázathoz, ahonnan érkezett.

- **Ki nyithatja meg.** A sorok csak azon megtekintők számára kattinthatók, akik meg tudják nyitni a hivatkozott irányítópultot. Mások ugyanazt a táblázatot látják hivatkozások nélkül.
- **Rekordformátum.** A rekord az URL-ből származik, így a részletező irányítópult dönti el, mit fogad el. A beállításaiban a **Detail page records** az alábbiak egyike lehet: azonosítók (betűk, számjegyek, `-`, `_` és `.`, legfeljebb 128 karakter; ez az alapértelmezett), számok, UUID-k vagy e-mail-címek. Bármely más értéket a rendszer még a widget futtatása előtt elutasít, és a widgetek a „This page does not accept that record" üzenetet jelenítik meg.
- **Továbbra is a tulajdonos futtatása.** A részletező oldalon is az irányítópult tulajdonosaként futnak a widgetek. A készítőknek csak ott szabad átadniuk a `$page.record` értéket, ahol a csomópont escape-eli azt, lekérdezésszövegbe közvetlenül soha.
- **Gyorsítótárazás.** Minden widget rekordonként gyorsítótárazza a diagramját, a widgettel azonos élettartamig (TTL), és megtartja a legutóbb használt 50 rekordot.

## Futtató widgetek

A **Run a workflow** widget lefuttatja az egyik workflow-ját, és megjeleníti az eredményt: az állapotot, a futási időt és a kimeneteket. A megjelenített tartalom attól függ, mit vár a workflow:

- **Egy fájl.** Ha a workflow egy [File Upload Trigger](../nodes/file-upload-trigger-node.md) csomóponttal indul, húzzon rá egy fájlt (vagy kattintson a kiválasztáshoz), és a widget feltölti azt a trigger egyszer használatos feltöltési hivatkozásán keresztül. A widget megjeleníti a trigger által elfogadott fájltípusokat és méretet, a többit pedig még feltöltés előtt elutasítja. Ha a workflow egy Text Input csomóponttal is indul, a widget a mezőket a célterület mellett jeleníti meg: válasszon fájlt, töltse ki a mezőket, és a **Run** mindkettőt elküldi. Az értékek a widget által létrehozott feltöltési hivatkozással együtt utaznak, így egy megosztott feltöltési hivatkozás nem tudja beállítani őket.
- **Bemeneti mezők.** Ha a workflow egy Text Input csomóponttal indul, a widget megjeleníti annak mezőit az alapértelmezett értékekkel; a **Run** az Ön értékeivel futtatja a workflow-t. A workflow-ban nem szereplő mezők értékeit a rendszer eldobja.
- **Semmi.** A bemenet nélküli workflow egy **Run** gombot kap.

Az eredmény **Wrap** gombja a dobozon belül tördeli a hosszú kimeneti sorokat; kapcsolja ki a kimenet JSON-elrendezésének olvasásához.

- Bárki, aki meg tudja nyitni az irányítópultot, futtathatja a widgetet, ahogyan bárki frissíthet egy diagramot is. A workflow-hoz való hozzáférés az irányítópult tulajdonosáé: a widget hozzáadásához olyan workflow szükséges, amelyet Ön és a tulajdonos is futtathat, maga a futtatás pedig a workflow tulajdonosának hitelesítési adatait használja, mint bármely feltöltési hivatkozás.
- Az eredmény addig marad a képernyőjén, amíg el nem hagyja az oldalt; más megtekintők nem látják az Ön fájljait, értékeit vagy eredményeit. A futtatás a végrehajtási előzményekben `dashboard` triggerrel jelenik meg.
- Az irányítópult megosztása soha nem ad hozzáférést magához a workflow-hoz. Az **Edit workflow** megnyitja azt azoknak, akiknek már van hozzáférésük, a **Fine-tune with AI** pedig nem érhető el.
- A fájlos futtatások a fő példányon hajtódnak végre, ahol a feltöltött fájlok tárolódnak, ahogyan minden File Upload Trigger futtatás is.

## Widget létrehozása AI-val

Kattintson az **AI** gombra, írja le a kívánt metrikát (például „workflow sikerességi arány az elmúlt 30 napban sávdiagramként"), és válasszon egy LLM hitelesítési adatot és modellt. A Heym létrehoz egy teljes widget-workflow-t, amely egy Chart Output csomópontban végződik, és hozzáadja a rácshoz. A diagramtípusonkénti példa promptokért lásd a [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) részt.

Használja egy widget **Fine-tune with AI** gombját egy meglévő widget új utasítással történő módosításához. Minden AI finomhangolás pillanatképet készít az előző workflow-ról a widget **Edit History** részébe, így a workflow-szerkesztőből áttekintheti vagy visszaállíthatja a változtatásokat.

## Az elrendezés szerkesztése

Kapcsolja be az **Edit** módot a szerkesztési módba lépéshez, ahol widgeteket húzhat és méretezhet egy 12 oszlopos rácson. Az elrendezés módosításai automatikusan mentődnek. A widget címek soron belül szerkeszthetők a widget fejlécéből.

## Gyorsítótárazás és frissítés

Minden widget a szerveren gyorsítótárazza az utoljára kiszámított adatait egy konfigurálható élettartamra (TTL). Amíg a gyorsítótár friss, az irányítópult újbóli megnyitása a tárolt eredményt szolgálja ki a workflow újbóli futtatása helyett. A gyorsítótár minden alkalommal helyben cserélődik, amikor az adatok újraszámításra kerülnek (egy gyorsítótár widgetenként, plusz egy rekordonként a [részletező oldalon](#detail-pages)), és automatikusan érvénytelenítődik, amikor szerkeszti a widget workflow-ját.

Használja egy widget **Refresh** gombját (vagy az eszköztár **Refresh** gombját) a gyorsítótár megkerüléséhez és az azonnali újraszámításhoz.
## Megosztás

A tulajdonosok a beállításokból osztják meg az irányítópultot, egyes felhasználókkal (e-mail cím alapján) vagy bármely [csapattal](teams-tab.md), amelyhez tartoznak. Minden megosztás **Olvasás** vagy **Írás**; ha valakinek egyszerre van személyes és csapatmegosztása is, a erősebb érvényesül.

| Művelet | Tulajdonos | Írás | Olvasás |
|--------|:-----:|:-----:|:----:|
| Widgetek megtekintése, frissítése, automatikus frissítés használata | ✓ | ✓ | ✓ |
| Részletező oldalak megnyitása, futtató widgetek indítása | ✓ | ✓ | ✓ |
| Widgetek hozzáadása, klónozása, törlése, átnevezése és átméretezése; AI-generálás és finomhangolás; ellenőrzőlista-elemek bejelölése | ✓ | ✓ | |
| Egy widget workflow-jának megnyitása a szerkesztőben | ✓ | ✓ | |
| Az irányítópult átnevezése vagy törlése, rekordformátumának beállítása, a megosztás kezelése | ✓ | | |

**A widgetek mindig az irányítópult tulajdonosaként futnak.** Függetlenül attól, hogy ki nézi, a widget a tulajdonos hitelesítési adatait és globális változóit használja, és a futtatásai a tulajdonos futtatási előzményeiben és nyomaiban jelennek meg. A csapattársak így ugyanazokat az adatokat látják anélkül, hogy hozzáférnének a mögöttük lévő fiókokhoz, és minden néző ugyanazt az egy gyorsítótárazott eredményt kapja widgetenként. Azok a widgetek, amelyeket egy írás jogosultságú közreműködő ad hozzá vagy klónoz, szintén a tulajdonoshoz tartoznak.

Emiatt az **Írás** ugyanolyan bizalmat igényel, mint egy workflow szerkesztésre való megosztása: az írás jogosultsággal rendelkező közreműködő megváltoztathatja, mi fut az Ön hitelesítési adataival. Csak olyan személyeknek adjon írás jogosultságot, akiknek megengedné, hogy szerkesszék a workflow-jait. Az a tesztfuttatás, amelyet egy közreműködő a workflow-szerkesztőből indít, a saját hitelesítési adatait használja, mint bármely megosztott workflow esetében; csak maga az irányítópult fut a tulajdonosként. Az **Olvasás** nem biztosít hozzáférést a widgetek workflow-jaihoz, és a csak olvasási jogosultságú nézők magát a diagramot kapják meg, de a mögötte lévő csomópontonkénti futtatási részleteket nem.

Egy megosztás eltávolítása vagy írásról olvasásra való csökkentése azonnal életbe lép.

## Kapcsolódó

- [Chart Output csomópont](../nodes/chart-output-node.md)
- [Analytics lap](analytics-tab.md) — beépített futtatási metrikák (a felhasználók által épített irányítópultoktól eltérően)
