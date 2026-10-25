# AI Assistant

Az **AI Assistant** egy chat panel, amely a Debug panelből nyílik meg, és a szerkesztő jobb alsó sarkában jelenik meg. A fejléc húzásával áthelyezheti, a szél vagy a sarok húzásával pedig módosíthatja a szélességét vagy a magasságát. 360×480 pixel alá nem zsugorodik. A pozíció és a méret ebben a böngészőben megjegyződik. A fejlécben található **Reset position and size** visszahelyezi a panelt a jobb alsó sarokba. Természetes nyelv használatával hozhat létre vagy módosíthat workflow-kat—írja le, mit szeretne, és az AI olyan csomópontokat és éleket generál, amelyek a vászonra kerülnek.

A szerkesztőn kívüli dokumentációs kérdésekhez használja a [Chat with Heym](./chat-with-heym.md) felületet. Az a felület az oldalfüggő terméktámogatásra van optimalizálva a workflow-generálás helyett.

## A panel megnyitása

1. Nyisson meg egy workflow-t a szerkesztőben
2. Keresse meg a **Debug panel**t alul (a futtatási eredmények területe)
3. Kattintson az **AI** gombra (Sparkles ikon) a panel eszköztárában
4. Az AI Assistant panel a jobb alsó sarokban nyílik meg. Húzza a fejlécét az áthelyezéshez, vagy húzza a szélét vagy a sarkát a szélesség és magasság módosításához.

Nyomja meg a `Ctrl + I` / `Cmd + I` billentyűkombinációt a szerkesztő bármely pontján a panel megnyitásához vagy bezárásához — a gyorsbillentyű akkor is működik, ha egy szövegbeviteli mező van fókuszban. Lásd: [Keyboard Shortcuts](./keyboard-shortcuts.md).

Ha egyetlen csomóponton szeretne dolgozni, vigye fölé az egeret a vásznon, és kattintson a felette lévő **AI** gombra. A panel erre a csomópontra fókuszálva nyílik meg. Lásd: [Egyetlen csomópont módosítása](#changing-one-node).

## A panel bezárása

Kattintson az **X** gombra, nyomja meg a `Ctrl + I` / `Cmd + I` billentyűkombinációt, vagy kapcsolja ki az **AI** gombot a Debug panel eszköztárában. A fejléc a panelt húzza; nem zárja be azt.

## Konfiguráció

Az üzenetek küldése előtt válassza ki a következőket:

| Beállítás | Leírás |
|---------|-------------|
| **Credential** | LLM hitelesítési adat (API key) a [Credentials](../tabs/credentials-tab.md) menüből |
| **Model** | Modellnév (pl. `gpt-4o`, `gemini-2.5-flash`) |

Adjon hozzá hitelesítési adatokat a [Credentials Tab](../tabs/credentials-tab.md) felületen. A modellista a kiválasztott hitelesítési adatból töltődik be.

## Agent mód vs Ask mód

A panelnek két módja van, amelyek a panel fejlécében található **Agent / Ask** kapcsolóval válthatók.

| Mód | Alapértelmezett | Viselkedés |
|------|---------|-----------|
| **Agent** | ✓ | Felépíti és módosítja a vásznat. Az AI generál egy workflow JSON blokkot, amely automatikusan a vászonra kerül, amikor a válasz befejeződik. |
| **Ask** | | Csak kérdésekre válaszol. A vászon soha nem módosul. Ezt használja, ha a workflow-járól, a Heym funkcióiról szeretne kérdezni, vagy tanácsot kérni anélkül, hogy a vászon frissülne. |

A módok bármikor válthatók. A mód váltása nem törli a beszélgetést.

Agent módban az üzenetmező alatti **YOLO mode** jelölőnégyzet hatására az asszisztens futtatja és javítja azt, amit felépít. Lásd: [YOLO Mode](#yolo-mode).

## A Chat használata

- Írja be a kérését a beviteli mezőbe (pl. „Create a workflow that takes user input and sends it to an LLM")
- Nyomja meg az **Enter** billentyűt a küldéshez (Shift+Enter az új sorhoz)
- Az AI streameli a válaszát. **Agent** módban, ha a válasz tartalmaz egy workflow-t egy \`\`\`json kódblokkban, az automatikusan feldolgozásra kerül és a vászonra kerül. **Ask** módban a vászon soha nem módosul.
- A **Clear** gombbal állíthatja vissza a beszélgetést
- Vigye az egérmutatót egy üzenet fölé, és kattintson a másolás ikonjára a megjelenített szöveg másolásához, beleértve a workflow JSON-t is
- Húzza az üzenetmező feletti vonalat a mező magasabbá tételéhez. A beviteli terület a panel 60%-áig növekedhet, és az oldal újratöltésekor visszaáll az alapértelmezett magasságára

## Workflow automatikus alkalmazása

Amikor az AI válasza tartalmaz egy érvényes workflow JSON blokkot (`nodes` és opcionálisan `edges` mezőkkel) egy \`\`\`json kódblokkban, a Heym:

1. Feldolgozza a JSON-t a válaszból
2. Lecseréli az aktuális vásznat az új csomópontokkal és élekkel
3. Rendbe teszi a csomópontok elrendezését
4. Nem mentettként jelöli meg a workflow-t

Ha a feldolgozás sikertelen, megjelenik egy **Retry** gomb a válasz újragenerálásához.

## Egyetlen csomópont módosítása

Vigye a kurzort a vásznon lévő csomópont fölé, és kattintson a felette lévő **AI** gombra. A panel Agent módban nyílik meg, erre a csomópontra fókuszálva, és mutatja, melyik csomópontot módosítja:

| A csomópont... | A panel ezt mutatja |
|---|---|
| Nincs eredmény a jelenlegi futásban | **Modifying Node:** kompakt sorban a csomópont ikonjával és nevével. Az asszisztens kizárólag a csomópont konfigurációjából szerkeszt; először futtassa a csomópontot, ha látnia kell a kimenetet |
| Eredmény a jelenlegi futásban | **Modifying Node: (Has Node Output)** maga a csomópont felett: ikon, név és típus, a legutóbbi állapot és időtartam, valamint a hiba, ha sikertelen volt. Az asszisztens látja ezt a kimenetet és hibát a csomópont szerkesztésekor |

Vigye a kurzort a címke fölé, hogy lássa, milyen állapotban van a panel.

Bármelyik állapotban van is a panel, az asszisztens a csomópont fejlécében lévő könyv ikon mögötti dokumentációs oldalt is elolvassa. Ezt használja a csomópont beállításainak megértéséhez és az azokkal kapcsolatos kérdések megválaszolásához.

Az üzenetek alatt három opció indítja a kérést:

| Opció | Mit csinál |
|---|---|
| **Change this node as ...** | Kitölti az üzenetmezőt a *Módosítsd ezt a csomópontot a következőre:* szöveggel, hogy befejezhesse a mondatot |
| **Fix error in this node ...** | Kitölti a *Javítsd ki a hibát ebben a csomópontban.* szöveggel. Az asszisztens beolvassa a csomópont hibáját a legutóbbi futásból |
| **Other** | Fókuszba helyez egy üres üzenetmezőt |

Módosítsa a szöveget, és nyomja meg a **Send** gombot. Az asszisztens csak ezt a csomópontot adja vissza, és a Heym helyben frissíti azt: a csomópont megőrzi azonosítóját, típusát és nevét, így a más csomópontokban lévő kifejezések, mint például a `$checkLinkedIn.result`, továbbra is működnek. Más csomópontok, kapcsolatok és az elrendezés nem változnak, és az **Undo** visszaállítja az előző konfigurációt.

Ha a kérés nem fér el a csomóponton belül, például más csomóponttípust vagy új csomópontot igényel, az asszisztens a szerkesztés helyett megmondja, mit kellene módosítani. Zárja be a csomópont fókuszát a csomópont kártyáján lévő **X** gombbal a teljes workflow újbóli szerkesztéséhez. A panel bezárása szintén törli a fókuszt.

A [YOLO mód](#yolo-mode) fókuszált csomóponttal működik: az asszisztens módosítja a csomópontot, futtatja a workflow-t, és javítja a csomópontot, amíg a futás sikeres nem lesz. **Ask** módban a fókusz jelzi az asszisztensnek, hogy melyik csomópontra vonatkozik a kérdése, és a vászon nem módosul.

## YOLO mód

A **YOLO mode** lehetővé teszi, hogy az asszisztens tesztelje azt, amit felépít. Jelölje be a **YOLO mode** jelölőnégyzetet az üzenetmező alatt, majd küldje el a kérését. A jelölőnégyzet csak Agent módban jelenik meg. Alapértelmezés szerint ki van kapcsolva, és az oldal újratöltésekor visszaáll kikapcsolt állapotba. Vigye az egérmutatót a mellette lévő info ikon fölé egy rövid összefoglalóért.

YOLO mód bekapcsolásával az asszisztens nem áll meg, miután alkalmazott egy workflow-t:

1. Alkalmazza a workflow-t a vászonra.
2. Az első futtatás előtt bekéri a teszt bemeneteket. A kártya felsorolja a workflow bemeneti mezőit, az asszisztens által javasolt értékekkel kitöltve. Szerkessze őket, és nyomja meg a **Run** gombot. A későbbi futtatások újrahasználják ezeket az értékeket. A kártya csak akkor jelenik meg újra, ha a bemeneti mezők megváltoznak, vagy az asszisztensnek más tesztadatokra van szüksége.
3. Pontosan úgy futtatja a workflow-t a vásznon, mint a **Run** gomb: a nem mentett változtatások először mentésre kerülnek, a csomópontok kivilágosodnak, és a futtatás megjelenik a Debug panelben és az [Execution History](./execution-history.md) felületen.
4. Elolvassa az eredményt. Ha a futtatás azt tette, amit kért, **Verified** üzenettel és egy rövid összefoglalóval fejezi be. Ha nem, kijavítja a workflow-t, és újra futtatja.

Üzenetenként legfeljebb **5 futtatást** végez. A **Stop** gombbal bármikor befejezheti a ciklust, és leállíthatja a folyamatban lévő futtatást.

Minden válasz megjeleníti a lépéseit, ahogy azok megtörténnek:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, minden csomóponthoz egy `Executing <node>` sorral;
- a végső ítélet.

Minden futtatás után egy rövid sor, például *Attempt 1 result sent · error in 1.2s* jelzi, hogy az eredmény visszakerült az asszisztenshez.
### Egyéb workflow-k futtatása

YOLO módban az asszisztens az Ön egyéb workflow-it is futtathatja, amikor szüksége van azok eredményére. Például ellenőrizheti, mit ad vissza egy workflow, mielőtt egy [Execute](../nodes/execute-node.md) csomópontból meghívná. Ezek a futtatások `Running workflow "<name>"...` lépésekként jelennek meg, és a Futtatások előzményeiben az `ai_assistant` trigger forrással kerülnek rögzítésre. A szerkesztett workflow mindig a vásznon kerül tesztelésre.

### Amikor korán leáll

| Helyzet | Mi történik |
|---|---|
| Az asszisztensnek döntésre, információra, hitelesítési adatra vagy adattáblára van szüksége | A szokásos kérdéskártyával kérdez. A válaszadás folytatja a ciklust. |
| A futtatás [emberi ellenőrzésre](./human-in-the-loop.md) vár | A ciklus leáll. Hagyja jóvá az ellenőrzést, majd küldjön üzenetet. |
| A workflow fájlfeltöltésre vár | A ciklus leáll. A YOLO mód nem tud feltöltéssel indított futtatásokat tesztelni. |
| A workflow egy újabb verziója máshol került mentésre | A ciklus leáll. Oldja fel a mentési ütközést, majd küldjön üzenetet. |

> **A futtatások valódiak.** A workflow-ban szereplő e-mailek, üzenetek és API-hívások minden kísérletnél ténylegesen elküldésre kerülnek, és az Adattábla csomópontok valódi sorokat írnak. Minden futtatás menti a workflow-t, így a korábbi verziók az [Előzményekben](./edit-history.md) maradnak.

## Hangbevitel

A támogatott böngészőkben egy **Voice** gomb engedélyezi a beszédfelismerést. Kattintson a felvétel indításához, kattintson ismét a leállításhoz. Az átírt szöveg elküldés előtt nyelvtani javításra kerül az AI-hoz.

## Agent csomópont vs AI asszisztens

| | Agent csomópont | AI asszisztens |
|---|------------|---------------|
| **Cél** | LLM csomópont egy workflow-n belül; végrehajtás során fut | Chat felület workflow-k természetes nyelvű felépítéséhez |
| **Elhelyezkedés** | Vászon csomópont | Debug panel → lebegő panel |
| **Mikor** | Futásidőben | Szerkesztés közben |

A workflow csomópontról, amely LLM-hívásokat hajt végre eszközökkel és MCP-vel, lásd: [Agent csomópont](../nodes/agent-node.md).

## Hogyan működik (AI Builder DSL)

Az AI asszisztenst egy **workflow DSL** (domain-specifikus nyelv) működteti, amely csomópontokat, éleket és kifejezéseket ír le. Amikor üzenetet küld:

1. Az üzenete, valamint a [Felhasználói szabályok](./user-settings.md) és az aktuális workflow (ha van) elküldésre kerülnek a backendnek.
2. A backend felépít egy **system promptot**, amely tartalmazza:
   - A teljes workflow DSL-t (csomóponttípusok, kifejezés szintaxis, szabályok, példák)
   - Az Ön Felhasználói szabályait "User Custom Rules" néven hozzáfűzve
   - Az aktuális workflow JSON-t, amikor egy meglévő workflow-t szerkeszt
   - Az elérhető workflow-k listáját, ha az Execute csomópontot használja
   - Az Ön saját hitelesítési adatainak nevét, típusát és id-jét (soha nem az értékeiket)
   - Az Ön által használható adattáblák nevét, id-jét, leírását és oszlopait (soha nem a soraikat)
3. A modell egyetlen workflow JSON blokkot ad vissza (`nodes` és `edges` mezőkkel). A frontend elemzi, és alkalmazza a vászonra.

### Hitelesítési adatok

Amikor egy workflow-nak hitelesítési adatra van szüksége, az asszisztens a felépítés előtt kérdez. Ha rendelkezik megfelelő típusú hitelesítési adatokkal, azokat a **Create a new credential** lehetőséggel együtt listázza; ha nincs ilyenje, megkérdezi, hogy létre kíván-e hozni egyet. Minden kérdésnél lehetőség van a hitelesítési adat nélküli folytatásra is.

A létrehozás választása megnyitja a hitelesítési adat űrlapját a panelben, a megfelelő típusra előre beállítva és egy javasolt névvel. Az értékek közvetlenül a Heymbe kerülnek; az asszisztens csak a nevet és a típust ismeri meg. Az OAuth hitelesítési adatok (Google Sheets, Google Drive, BigQuery, Linear, Notion) felugró ablakban kapcsolódnak össze, és megjelenik egy hivatkozás az engedélyezési oldalra arra az esetre, ha a felugró ablak blokkolva van. Amint a hitelesítési adat mentésre kerül, a kártya megjeleníti annak nevét, és a létrehozás gomb kikapcsol; nyomja meg a **Submit answers** gombot, és az asszisztens ráhelyezi az új hitelesítési adatot a csomópontra.

Önállóan is kérhet hitelesítési adatot ("create a GitHub credential"), vagy kérheti egy meglévő módosítását ("update my sheet credential", "reconnect my Google Sheets"). Az asszisztens ugyanazzal a kártyával válaszol: a létrehozás egy üres űrlapot nyit meg, a frissítés pedig azt a hitelesítési adatot nyitja meg az űrlapon, annak titkos értékeit maszkolva.

Az asszisztens a dedikált csomópontot részesíti előnyben. Amikor egyetlen csomópont sem fed le egy műveletet, például egy lap hozzáadását egy Google Sheethez, HTTP-kérést használ, és megírja a fejlécsort a kiválasztott hitelesítési adathoz. Lásd: [HTTP › Hitelesítés hitelesítési adatokkal](../nodes/http-node.md#authenticating-with-credentials).

Azok a tisztázó kérdések, amelyek nélkül a workflow elboldogul, a bemenetükben **Optional** jelölést kapnak, és kihagyhatók.

A DSL camelCase címkéket, egységes kifejezésszabályokat és csomópont-specifikus mezőket kényszerít ki. Ha egy mező értéke egyetlen `$expr`, a backend megőrzi a natív típust; ha az érték prózát kever `$refs`-ekkel, az eredmény egy string. Az egy-`$` szabály továbbra is érvényes: zárójeleken belül nem lehet `$`. A [Beállítások](./user-settings.md) Felhasználói szabályai bekerülnek ebbe a system promptba, így az Ön preferenciái minden AI által generált workflow-ra érvényesek.

Ha az aktuális workflow Agent skilleket tartalmaz, az AI asszisztens csak az egyes skillek `SKILL.md` fájlját foglalja bele abba a workflow kontextusba. A csatolt `.py` fájlok és bináris skill-erőforrások a kérés előtt eltávolításra kerülnek, így a builder a modell kontextushatárain belül marad akkor is, ha a skillek nagy implementációkat tartalmaznak.
### Adattáblák

Amikor egy workflow rekordokat ment, tárol vagy keres ki, és Ön nem nevezett meg más tárolót, az asszisztens egy [DataTable](../nodes/datatable-node.md) csomópontot használ. Ha megnevezi az egyik tábláját, és az rendelkezik a workflow által igényelt oszlopokkal, az asszisztens azt használja. Ellenkező esetben megkérdezi, melyik táblát kell használni. A kártya felsorolja a megfelelő táblákat, mindegyiket a leírásával és az oszloptípusaival együtt, valamint a **Create a new table** lehetőséget egy javasolt névvel és oszlopokkal. Az Önnel megosztott táblák is felajánlásra kerülnek; az a tábla, amelyet csak olvasni tud, kizárólag olvasásra kerül felajánlásra.

Válassza ki az új táblát, és nyomja meg a **Submit answers** gombot: a kártya létrehozza a táblát, az asszisztens pedig ráhelyezi annak id-jét a csomópontra, és annak pontos oszlopneveit használja. Ön önállóan is kérhet táblát, például: „create a table for my leads”.

Az asszisztens a táblaneveket, leírásokat és oszlopokat látja, a sorokat soha. Soha nem módosítja egy meglévő tábla oszlopait: ha egy táblából hiányzik a workflow által igényelt oszlop, megnevezi az oszlopot, és helyette egy új táblát ajánl fel. Oszlopokat a [DataTable tab](../tabs/datatable-tab.md) felületen adhat hozzá.

## Kapcsolódó

- [Why Heym](../getting-started/why-heym.md) – Natural-language building as the first stage of the agent lifecycle
- [Quick Start](../getting-started/quick-start.md) – Build your first workflow
- [Settings](./user-settings.md) – User Rules injected into AI Assistant system prompt
- [Chat with Heym](./chat-with-heym.md) – Page-aware assistant inside the documentation area
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nodes, and execution flow
- [Agent Node](../nodes/agent-node.md) – LLM node with tools and MCP
- [Credentials Tab](../tabs/credentials-tab.md) – Add API keys for the AI Assistant
- [Workflow Structure](./workflow-structure.md) – JSON format for workflows
