# DataTable

A **DataTable** lap lehetővé teszi strukturált adattáblák létrehozását és kezelését közvetlenül a Heymben. A táblák workflow-kban a [DataTable csomópont](../nodes/datatable-node.md) segítségével használhatók programozott CRUD-műveletekhez.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>

## Tábla létrehozása

1. Nyissa meg a DataTable lapot az irányítópultról
2. Kattintson a **Create DataTable** gombra
3. Adjon meg egy nevet és opcionálisan egy leírást
4. Adjon hozzá oszlopokat az oszlopszerkesztővel

## Oszlopok

Minden oszlop a következő tulajdonságokkal rendelkezik:

| Tulajdonság | Leírás |
|----------|-------------|
| Name | Az oszlop megjelenített neve |
| Type | `string`, `number`, `boolean`, `date` vagy `json` |
| Required | Meg kell-e adni ezt az oszlopot az új sorokban |
| Unique | Az értékeknek egyedinek kell-e lenniük a sorok között |
| Default Value | Automatikusan kitöltődik, ha egy sor kihagyja ezt az oszlopot |

Oszlopokat a tábla részletes nézetének fejlécében adhat hozzá, szerkeszthet vagy távolíthat el.

## Oszlopok generálása AI-val

Ahelyett, hogy kézzel adná hozzá az oszlopokat, leírhatja a táblát természetes nyelven (vagy beilleszthet egy minta JSON-t), és egy LLM javasolhatja a sémát. Mindkét belépési pont ugyanazt a párbeszédablakot nyitja meg:

- **Generate with AI** (a DataTable lista fejlécében) — teljesen új táblát hoz létre a leírása alapján.
- **AI columns** (a tábla részletes nézetében, az oszlopvezérlők mellett) — *új* oszlopokat javasol a megnyitott táblához való hozzáfűzéshez.

### Hogyan működik

1. Válasszon egy **LLM hitelesítési adatot** és **modellt** (alapértelmezésben az első LLM hitelesítési adat és annak legfrissebb modellje).
2. Írjon be egy leírást — például *"A table of books with title, author, page count, and whether I've read it"* — vagy illesszen be egy JSON-mintát/sémát.
3. Kattintson a **Generate** gombra. A modell visszaad egy javasolt sémát.
4. Tekintse át a generált oszlopokat egy szerkeszthető űrlapon: módosítsa mindegyik **nevét**, **típusát**, **alapértelmezett értékét**, **unique** és **notEmpty** (kötelező) beállítását, törölje a nem kívánt oszlopokat, vagy adjon hozzá manuálisan egy oszlopot az **Add column** gombbal. Új tábla esetén az AI által javasolt **nevet** és **leírást** is szerkesztheti.
5. Kattintson a **Create Table** (új tábla) vagy az **Add Columns** (meglévő tábla) gombra a mentéshez. A párbeszédablakot bármikor bezárhatja az **Esc** lenyomásával.

### Csak hozzáfűzés meglévő táblákhoz

Amikor egy meglévő táblához generál oszlopokat, a modell kontextusként látja a jelenlegi oszlopokat, és **csak új** oszlopokat javasol. A meglévő oszlopok és azok adatai soha nem módosulnak és nem törlődnek — a generált oszlopok hozzáfűződnek. Az ismétlődő nevek (kis- és nagybetűtől függetlenül) automatikusan eltávolításra kerülnek.

> LLM hitelesítési adat (OpenAI, Google vagy Custom) szükséges. Ha nem rendelkezik ilyennel, először adjon hozzá egyet a Settings menüben.

## Sorok kezelése

- **Sor hozzáadása**: Kattintson a hozzáadás gombra egy új sor létrehozásához
- **Beágyazott szerkesztés**: Kattintson duplán bármely cellára az érték szerkesztéséhez. A mentéshez nyomja le az Enter billentyűt vagy kattintson máshová, a megszakításhoz az Escape billentyűt
- **Sor törlése**: A sor műveletmenüjével távolíthat el egy sort
- **Lapozás**: A sorok oldalanként 25-ösével jelennek meg, oldalnavigációval

## CSV import/export

### Importálás
1. Kattintson az **Import CSV** gombra a tábla részletes nézetében
2. Válasszon ki egy feltöltendő CSV-fájlt
3. Tekintse át az első 5 sort és az oszlopok hozzárendelését
4. A zöld oszlopok a meglévő táblaoszlopokhoz vannak rendelve; a sárgák nincsenek hozzárendelve
5. Kattintson az Import gombra a sorok tömeges beszúrásához

### Exportálás
Kattintson az **Export CSV** gombra az összes sor CSV-fájlként való letöltéséhez.

## Megosztás

Ossza meg a táblákat más felhasználókkal vagy csapatokkal:

1. Nyissa meg a megosztási párbeszédablakot a tábla részletes nézetéből
2. Adjon hozzá felhasználókat e-mail-cím alapján **read** vagy **write** jogosultsággal
3. Adjon hozzá csapatokat **read** vagy **write** jogosultsággal
4. A csak olvasási jogosultsággal rendelkező felhasználók megtekinthetik az adatokat; az írási jogosultsággal rendelkezők módosíthatják a sorokat

## Táblák létrehozása az AI Assistant segítségével

A vászon [AI Assistant](../reference/ai-assistant.md#data-tables), a [Chat](./chat-tab.md) és az [MCP lap](./mcp-tab.md) `heym_chat` eszköze kiválaszthatja az egyik tábláját egy általuk épített workflow-hoz, vagy létrehozhat egy újat. Javasolnak egy nevet és oszlopokat, és a táblát a kérdéskártya beküldésekor hozzák létre. Soha nem módosítják egy meglévő tábla oszlopait és nem nyúlnak annak soraihoz: az oszlopokat itt adhatja hozzá vagy szerkesztheti.

## Használat workflow-kban

A [DataTable csomópont](../nodes/datatable-node.md) összekapcsolja a táblákat a workflow-kkal. A műveletek közé tartozik a find, getAll, getById, insert, update, remove és upsert. Nem szükségesek hitelesítési adatok.

## LLM Cost Table (rendszertábla)

A felhasználó által létrehozott táblák felett egy rögzített **System tables** szakasz jelenik meg egyetlen bejegyzéssel: **LLM Cost Table**. Ez a [Traces](./traces-tab.md) költségdiagramjai által használt, modellenkénti árazás rögzített sémájú, felhasználónként szerkeszthető nézete.

### Honnan származnak az adatok

A Heym egy globális, modellenkénti árazási táblát tart fenn, amely a Helicone nyilvános árazási endpointjából (`https://www.helicone.ai/api/llm-costs`) származó adatokkal van feltöltve. A szinkronizálás a háttérben fut, amikor először megnyitja a táblát vagy a Traces lapot, és 24 óránként egy lekérésre van korlátozva. A **Refresh** gomb megnyomásával azonnali újraszinkronizálást kényszeríthet ki. A Helicone által a felsőbb szintű listából eltávolított elemek helyben nem törlődnek, így a korábbi költségkeresések stabilak maradnak.

### Séma (csak olvasható oszlopok)

| Oszlop | Jelentés |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (tájékoztató jellegű, a Helicone használja) |
| Model | A `trace.model` értékével egyeztetett modellazonosító |
| Op | Egyeztetési operátor: `equals`, `startsWith` vagy `includes` |
| Input $/1M | USD per 1 millió prompt token |
| Output $/1M | USD per 1 millió completion token |
| Source | `helicone`, `seed` vagy `user` |
### Árazás testreszabása

- **Sor szerkesztése** a sor árainak felülírásához. A felülírás felhasználónként érvényes, és egy `Customized` jelvény jelöli; a jövőbeli Helicone-szinkronizálások érintetlenül hagyják.
- **Visszaállítás alapértelmezettre** eltávolítja a felülírást, és visszaállítja a sor globális értékét.
- **Egyéni modell hozzáadása** egy párbeszédablakot nyit meg egy csak felhasználói sor létrehozásához (például egy privát, finomhangolt modellhez, amelyet a Helicone nem listáz). Az egyéni sorokat a `User added` jelölés jelzi, és törlésükkel teljesen eltávolíthatók.

### Egyeztetés a nyomkövetésekkel (traces)

Amikor a Traces irányítópult kiszámítja a költséget, minden `trace.model` értéket a következőkkel vet össze:

1. Először az Ön felülírásaival (pontos egyezés a modell nevére)
2. Ellenkező esetben a globális táblázattal — az `equals` pontos egyezés elsőbbséget élvez a `startsWith`/`includes` operátorokkal szemben; az azonos operátoron belüli egyezések esetén a leghosszabb egyező modell-előtag/részstring dönt

Ha egyetlen sor sem egyezik, a modell a Traces oldalon az **Unpriced models** figyelmeztetés alatt jelenik meg; költséghozzájárulása nulla mindaddig, amíg Ön nem ad hozzá egyéni sort, vagy nem ír felül egyet.

## Kapcsolódó

- [DataTable csomópont](../nodes/datatable-node.md) – Workflow csomópont-referencia
- [Traces lap](./traces-tab.md) – Az LLM Cost Table-t használja a költség-fánkdiagramhoz és a KPI-kártyákhoz
- [Grist csomópont](../nodes/grist-node.md) – Külső táblázatkezelő alternatíva
- [Változók lap](./global-variables-tab.md) – Kulcs-érték tárolási alternatíva
