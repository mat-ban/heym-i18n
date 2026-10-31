# MCP / A2A lap

Az **MCP** lap a Model Context Protocol (MCP) integrációt konfigurálja, valamint olyan [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) szerverként, amelyre más ágensek feladatokat delegálhatnak. Az MCP lehetővé teszi, hogy az AI-kliensek (Claude, ChatGPT, Gemini, Cursor és bármely MCP-kompatibilis eszköz) az Ön Heym workflow-jait eszközként hívják meg.

A Heym két módot támogat: egy **alapértelmezett szervert**, amely az összes MCP-vel engedélyezett workflow-t egyetlen endpoint alatt teszi elérhetővé, valamint **elnevezett szervereket**, amelyek minden logikai workflow-csoport számára saját dedikált URL-t és API-kulcsot biztosítanak.

Mindkét mód kétféle eszközt tehet elérhetővé: az egyes **workflow-kat** és a **Heym chat eszközt** — a teljes [Chat lap](./chat-tab.md) motort egyetlen `heym_chat` eszköz mögött.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCP demó megtekintése</a></p>

## Alapértelmezett MCP szerver

Az alapértelmezett szerver mindig elérhető a `{origin}/api/mcp/sse` címen. Minden workflow, amelynél az MCP be van kapcsolva, eszközként jelenik meg itt.

### MCP API-kulcs

- A kulcsok SHA-256 lenyomatként tárolódnak, így a Heym nem tudja megjeleníteni a meglévő kulcsot. A lap azt jelzi, hogy be van-e állítva egy kulcs, de azt nem, hogy mi az.
- **Generate** / **Regenerate** – Az új kulcs egyszer jelenik meg, közvetlenül a létrehozás után. Ekkor másolja ki; a lap újratöltése után véglegesen elrejtőzik.
- Ezt a kulcsot használja, amikor a Claude Desktopot, a Cursort vagy más MCP-klienseket csatlakoztatja a Heymhez.
- Elvesztette a kulcsot? Generálja újra. A korábbi kulcs azonnal érvénytelenné válik.

### Csatlakozási módok

- **API Key** – Az MCP API-kulcsot programozott csatlakozásokhoz használja. A lap képes egy használatra kész JSON konfigurációt másolni, és tartalmaz egy **Add to Cursor** gombot a Cursor egykattintásos beállításához.
- **Claude** – A lap megjeleníti az MCP szerver URL-jét és a Claude beállítási lépéseit. Az OAuth Client ID és Secret mezőket hagyja üresen; a Claude automatikusan regisztrál és a Heym OAuth-on keresztül hitelesít.
- **ChatGPT** – A lap megjeleníti az MCP-szerver URL-jét és a ChatGPT-alkalmazás beállítási lépéseit. Kapcsolja be a fejlesztői módot, hozzon létre egy alkalmazást az URL-lel, és válassza az OAuth lehetőséget; a ChatGPT automatikusan regisztrál.
- **Gemini** – A lap megjeleníti az MCP-szerver URL-jét és a Gemini egyéni alkalmazás beállítási lépéseit: a gemini.google.com oldalon válassza a **Settings → Connected Apps → Add a custom app** menüpontot, illessze be az URL-t, és hagyja zárva az **Advanced features** részt; a Gemini automatikusan regisztrál és hitelesít a Heym OAuth-on keresztül. A csatlakoztatás után a Heym a Gemini mobilalkalmazásban is működik.

### Workflow MCP kapcsoló

Minden workflow MCP-eszközként tehető elérhetővé:

- **Enable** – A workflow eszközei elérhetővé válnak az alapértelmezett szerverhez csatlakozó összes kliens számára
- **Disable** – A workflow nem kerül elérhetővé

A workflow-kártyák megjelenítik a leírást és a bemeneti mezőnevek előnézetét, így az engedélyezés előtt láthatja, mit vár el az egyes eszközök.


### Sorban álló futások és a heym_execution_status

Egy [párhuzamossági korláttal](../reference/webhooks.md#concurrency-limit-and-queued-runs) rendelkező workflow foglalt lehet, amikor egy kliens meghívja. A hívás ilyenkor azonnal visszatér egy olyan eredménnyel, amely nem hiba:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

A kliens lekérdezi a `heym_execution_status` eszközt ezzel az `execution_id`-val. Ugyanazt a törzset adja vissza, mint az [állapot URL](../reference/webhooks.md#status-url): `queued` az aktuális pozícióval, `running`, majd `success` vagy `error` a kimenetekkel. Csak azon workflow-k futásait találja meg, amelyeket ugyanaz a szerver tesz közzé. Az eszköz csak akkor szerepel az alapértelmezett és a megnevezett szervereken, amíg legalább az egyik workflow-ja párhuzamossági korláttal rendelkezik. Amikor a sor megtelik, a hívás a „Concurrency queue is full” hibát adja vissza.
## Heym Agent

A **Heym Capabilities** szakasz a Chat lap motorját egyetlen `heym_chat` nevű MCP-eszközzé alakítja. Engedélyezheti az alapértelmezett szerveren, bármely elnevezett szerveren vagy mindkettőn — minden felület saját kapcsolóval és modellválasztással rendelkezik.

Amikor be van kapcsolva, a `heym_chat` megjelenik a `tools/list` listában a workflow-eszközök mellett. Az MCP-kliens egyetlen természetes nyelvű üzenetet küld, és a Heym motor onnantól átveszi a feladatot, ugyanazokkal a képességekkel, amelyekkel a Chat lap rendelkezik:

- Workflow építése, tesztfuttatása mintabemenetekkel, javítása és befejezése, amikor egy futtatás sikeres (lásd: [Építési mód](#build-mode))
- Meglévő workflow-k vizsgálata és futtatása
- Analitikák, legutóbbi futtatások és közelgő cron ütemezések jelentése
- Elmagyarázza, hol hiúsulnak meg a workflow-k és miért lassúak: a legtöbbször futtatott, legtöbbször meghiúsult és leglassabb workflow-kat, valamint az elmúlt 1, 3 vagy 6 órában, 24 órában, 7 vagy 30 napban, illetve a teljes időtartam alatt legtöbb időt, hibát és hívást felhalmozó csomóponttípusokat
- Egy workflow futási előzményeinek jelentése: hányszor futott, állapotszámok, mikor futott, valamint kérésre egyetlen futtatás bemenetei, kimenetei és csomópontonkénti hibái
- Annak jelentése, hogy mi fut éppen most: hány futtatás aktív, azok workflow-nevei, mennyi ideje futnak, melyik csomóponton vannak éppen, és egy hivatkozás az élő futtatásra
- Táblák listázása, kártyák létrehozása és kártyarészletek olvasása a [Board lapon](./board-tab.md)
- Kilistázza az irányítópultokat (a Heym Work oldalait) és widgetjeiket, megkeresi, melyik irányítópulton található egy workflow, új widgetet ad hozzá és felépíti annak workflow-ját, meglévő workflow-t helyez el widgetként, átnevezi vagy törli a widgeteket, illetve rendezi az elrendezést (lásd [Dashboard › Chatből és MCP-ből](./dashboard-tab.md#from-chat-and-mcp))
- Megvizsgálja az adattáblákat és sorokat, táblákat hoz létre, oszlopokat ad hozzá vagy távolít el, sorokat szúr be, frissít vagy töröl, és beköti a táblákat a workflow-kba
- Létrehozza, szerkeszti és futtatja a prompt- és ágens-[kiértékelési csomagokat](./evals-tab.md#from-chat-and-mcp), beleértve az ágens alapértékeit: jelentve, futtatásokból felépítve vagy számszerűen megadva. Az eredmény felsorolja minden mentett csomag Evals hivatkozását.
- Hitelesítési adatok létrehozása vagy frissítése a Heym saját oldalán (lásd: [Hitelesítési adatok](#hitelesítési-adatok))
- Csapatok és globális változók olvasása, valamint a dokumentációban való keresés
- Függőben lévő human-in-the-loop felülvizsgálatok jóváhagyása, szerkesztése vagy elutasítása

A Chat laphoz később hozzáadott képességek automatikusan elérhetővé válnak a `heym_chat`-en keresztül — nincs szükség képességenkénti kapcsolóra, amelyet szinkronban kellene tartani.

Ezek a képességek a `heym_chat` belsejében futnak: a `tools/list` a `heym_chat`-et és az Ön workflow-eszközeit jeleníti meg, a chat belső eszközeit (például az értékelési csomagokéit) soha.

### Építési mód

A `heym_chat` mindig építési módban (build mode) futtatja a Chat motort. Egyetlen hívásban az asszisztens képes elmenteni egy új workflow-t, valósághű mintabemenetekkel lefuttatni, elolvasni a futási jelentést, kijavítani a hibát, majd újra lefuttatni — hívásonként legfeljebb öt tesztfuttatásig. Amikor a legutóbbi mentés legutóbbi futtatása sikeres, egy egymondatos összefoglalóval zár, és a válasz a következővel végződik: `Verified: the latest test run of the saved workflow passed.`

Amikor egy hívás létrehoz vagy szerkeszt egy workflow-t, a válasz mindegyiket felsorolja a teljes szerkesztői linkjével, mint például `https://heym.example.com/workflows/<id>`, és az asszisztens válaszában található linkek is teljes linkek. Ezek az Ön konfigurált Heym címét (`FRONTEND_URL`) használják, és a Heym-be bejelentkezett felhasználók számára nyílnak meg, akik hozzáférnek az adott workflow-hoz.

- A tesztfuttatások valódi futtatások. Mellékhatásaik megtörténnek, és bármely más futtatáshoz hasonlóan megjelennek a workflow futási előzményeiben.
- A mentések a szerkesztő útvonalát követik: a gráf módosítása megőrzi az előző gráfot a workflow szerkesztési előzményeiben (**Edit History**).
- Egy korábban épített workflow módosításához folytassa a szálat ugyanazzal a `conversation_id` értékkel. Az asszisztens új létrehozása helyett azt a workflow-t frissíti, és csak olyan workflow-kat módosít, amelyeket Ön szerkeszthet.
- Ha az öt tesztfuttatás elfogy, az asszisztens megáll, és elmagyarázza, mi hibázik még mindig.

Az adattáblák esetében ez másképp van. Egy tábla nem tartalmaz titkot, így a `heym_chat` listázhatja a tábláit, megkérdezheti, hogy egy workflow melyiket használja, és létrehozhat egy újat az oszlopaival együtt. Sorokat soha nem olvas vagy ír.

### Hitelesítési adatok

A `heym_chat` a saját és az Önnel megosztott hitelesítési adatokat név és típus szerint látja, ugyanúgy, mint a Chat lap. Amikor az általa épített workflow-nak hitelesítési adatra van szüksége, az eredményben feltett kérdésként megkérdezi, melyiket használja. Válaszoljon rá ugyanazzal a `conversation_id`-val.

Hitelesítési adat hozzáadásához vagy saját adat frissítéséhez az asszisztens megnyitja a Heym hitelesítési adat űrlapját a `/credentials/setup/<id>` Heym oldalon. Ott bejelentkezik a Heym-be, megadja a kulcsot vagy összekapcsolja a fiókot, majd a mentésre kattint. Az érték közvetlenül a Heym-be kerül: az MCP kliens és modellje csak a hitelesítési adat nevét és típusát ismeri meg. Soha ne illesszen be kulcsokat az MCP kliensbe; kérje inkább az űrlapot.

| Kliens | Mi történik |
|--------|-------------|
| Támogatja az MCP URL-bekérést | A kliens felkéri a Heym oldal megnyitására. A hívás megvárja az űrlap kitöltését (legfeljebb tíz percig), majd folytatja az új hitelesítési adattal. |
| Bármi más | Az eredmény tartalmazza a hivatkozást, és felkéri a klienst, hogy hívja meg újra a `heym_chat`-et a `wait_for_credential_form` paraméterrel. Ez a hívás legfeljebb öt percet vár az űrlap kitöltésére, majd folytatja a beszélgetést. Ha a kliens nem vár, mentse el az űrlapot, és válaszoljon ugyanazzal a `conversation_id`-val; a következő hívás tudni fogja, hogy az űrlap mentésre került és milyen hitelesítési adat jött létre. |

Az oldal csak ahhoz a Heym-fiókhoz nyílik meg, amelyik a kérést elindította, így a továbbított link más számára használhatatlan. Az űrlap 24 órán át marad nyitva, és elutasítható az oldalról. Miután elmentette vagy elutasította, a Chat lap beszélgetésében lévő lépés megjeleníti az eredményt.


### Hitelesítési adat és modell

A `heym_chat` az Ön Heym-fiókján futtatja a motort, így saját LLM hitelesítési adatra van szüksége:

| Mező | Viselkedés |
|-------|----------|
| **Credential** | Válasszon bármely OpenAI, Google vagy Custom hitelesítési adatot, amelyhez hozzáfér. Előre kitöltve a [Settings](../reference/user-settings.md) részben beállított előnyben részesített hitelesítési adatból, ha még nem választott. |
| **Model** | A kiválasztott hitelesítési adatból töltődik be. Előre kitöltve az Ön előnyben részesített modelljéből, ha a hitelesítési adat egyezik. |

Ha bármelyik hiányzik, az eszköz továbbra is megjelenik a `tools/list` listában, de minden hívás hibát ad vissza, amely arra kéri, hogy fejezze be a beállítást ezen a lapon.


A `heym_chat` által épített workflow-ban lévő LLM- és Agent-csomópontok ezzel a hitelesítési adattal és modellel futnak, beleértve a megosztott hitelesítési adatokat is, így a tesztfutások további beállítási lépés nélkül működnek. Amikor a `heym_chat` workflow-t szerkeszt, a már hitelesítési adattal rendelkező LLM- és Agent-csomópontok megtartják azt a modelljükkel együtt.
### Argumentumok és előzmények

| Argumentum | Kötelező | Leírás |
|----------|----------|-------------|
| `message` | Igen | Az utasítás vagy kérdés, természetes nyelven. |
| `conversation_id` | Nem | Egy `conversation_id` egy korábbi `heym_chat` eredményből, hogy folytassa azt a szálat. |
| `wait_for_credential_form` | Nem | `conversation_id`-val: várjon, amíg a felhasználó elmenti vagy elutasítja a szál által megnyitott hitelesítési adat űrlapot, majd küldje el a `message` üzenetet. |

Minden hívás bekerül a [Chat lap](./chat-tab.md) előzményeibe normál beszélgetésként, amely a beszélgetéslistában egy dugó ikonnal van megjelölve. Az üzenetek, eszközkártyák és a tisztázási szünetek pontosan úgy néznek ki, mint egy Ön által indított beszélgetés, és a szálat a böngészőben megnyitva folytathatja a beszélgetést. Minden eredmény visszaadja a `conversation_id`-t, így az MCP-kliens ugyanazt a szálat folytathatja ahelyett, hogy minden hívásnál újat nyitna.

Amikor az asszisztensnek tisztázásra van szüksége, szünetet tart és jelzi ezt; válaszoljon a válaszokkal ugyanazon `conversation_id` használatával.
### A2A engedélyezése

Amíg a Heym Agent be van kapcsolva, a kártyán megjelenik az **A2A engedélyezése** jelölőnégyzet. Jelölje be, és más ágensek feladatokat küldhetnek a Heym Agentnek az Agent2Agent protokollon (A2A 1.0) keresztül. A kártya ezután felsorolja az **Agent Card** URL-jét és a **JSON-RPC endpointot**, mindkettőt másolás gombbal, valamint egy `curl` parancsot a kártya lekéréséhez. Az A2A ugyanazt a kulcsot és OAuth-bejelentkezést használja, mint az MCP. Az ágens kikapcsolása az A2A-t is kikapcsolja. A módszerekről, feladatállapotokról és egy példáról lásd: [A2A](../reference/a2a.md).

### Előrehaladás

Egy hosszabb `heym_chat` hívás MCP-előrehaladásként (`notifications/progress`) jelenti az ágens tevékenységét, a Chat lapon látható megfogalmazásban, például `Workflow tesztelése · 2/5 kísérlet`. Azok az ügyfelek, amelyek az előrehaladás során visszaállítják az időtúllépési időzítőt, tovább várakoznak, amíg az ágens dolgozik.

## Elnevezett MCP-szerverek

Az elnevezett szerverek lehetővé teszik a workflow-k elkülönített MCP-végpontokra történő szegmentálását. Minden szerver saját URL-lel és API-kulccsal rendelkezik, így a különböző AI-kliensek, csapatok vagy felhasználási esetek pontosan azokhoz a workflow-khoz kapcsolódhatnak, amelyekre szükségük van.

### Elnevezett szerver létrehozása

1. Írjon be egy nevet az MCP fül alján található beviteli mezőbe (pl. **CRM Tools**)
2. Kattintson a **Create** gombra — azonnal megjelenik egy új szerverkártya
3. Kattintson a kártyára a kibontásához

### Szerverenkénti beállítások

Minden szerverkártya a következőket mutatja:

| Beállítás | Leírás |
|---------|-------------|
| **SSE Endpoint** | Egyedi URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Független kulcs, amely a létrehozásakor vagy újragenerálásakor egyszer jelenik meg. Azonnal másolja ki; hash-elve tárolódik, és később nem jeleníthető meg |
| **How to connect** | A **Copy JSON** a beillesztésre kész MCP-konfigurációt másolja; az **Add to Cursor** egy kattintással telepíti |
| **Heym Capabilities** | Kapcsolja be vagy ki a Heym Agentet (`heym_chat`) ehhez a szerverhez, és válassza ki a hitelesítő adatot és modellt |
| **A2A engedélyezése** | Ennek a szervernek a saját A2A kapcsolója, saját Agent Carddal a `{origin}/api/a2a/servers/{uuid}/agent-card.json` címen |
| **A2A engedélyezése** | Ennek a szervernek a saját A2A kapcsolója, saját Agent Carddal a `{origin}/api/a2a/servers/{uuid}/agent-card.json` címen |
| **Assigned Workflows** | Kapcsolja be, hogy a workflow-k közül melyeket tegye elérhetővé ez a szerver |

### Workflow hozzárendelése

A workflow hozzárendelése szerverenként történik, és független az alapértelmezett szerver kapcsolójától. Egy workflow egyszerre engedélyezhető az alapértelmezett szerveren és több elnevezett szerveren is, vagy egyiken sem.

A workflow átkapcsolása a hozzárendelt lista tetejére mozgatja azt, így az éppen módosított sor látható marad ahelyett, hogy elgörgetne.

### Hitelesítés

Az elnevezett szerverek ugyanazokat a hitelesítési módszereket támogatják, mint az alapértelmezett szerver:

- **X-MCP-Key header** – Adja át közvetlenül a szerver API-kulcsát (API-kliensek, Cursor). Csak header: a kulcsok `?key=` query paraméterként nem elfogadottak, mert az URL-ek bekerülnek a hozzáférési naplókba, proxy naplókba és a böngésző előzményeibe.
- **Claude, ChatGPT és Gemini OAuth** – Adja hozzá a szerver URL-jét a kliens csatlakozóihoz vagy egyéni alkalmazásaihoz; hagyja üresen a hitelesítési adatokat, és a kliens automatikusan regisztrál OAuth-on keresztül. A bearer tokennek az `Authorization` headerben kell utaznia, nem `?token=` formában.
- **Session token** – Az SSE handshake során kerül kiadásra; az adott szerverre van hatókörözve, így az egyik elnevezett szerverről származó tokenek nem férhetnek hozzá egy másikhoz. Ez a rövid élettartamú `?session=` paraméter nem érintett.

### Elnevezett szerver törlése

Kattintson az **X** ikonra a szerverkártya fejlécén. A törlés eltávolítja a szervert és annak összes workflow-hozzárendelését; maguk a workflow-k nem érintettek.

## SSE Endpoint

| Szerver | Endpoint |
|--------|----------|
| Alapértelmezett | `{origin}/api/mcp/sse` |
| Elnevezett | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Mindkét endpoint támogatja az SSE transportot (GET, MCP spec 2024-11-05) és a Streamable HTTP transportot (POST, MCP spec 2025-03-26). A Claude, a ChatGPT és a Gemini mindkettőn OAuth 2.1 / PKCE-t használ a biztonságos bejelentkezéshez.

## Kapcsolódó

- [Why Heym](../getting-started/why-heym.md) – Az MCP mint első osztályú primitív a Heymben
- [Agent Node](../nodes/agent-node.md) – Agent csomópont MCP eszköztámogatással
- [Agent Architecture](../reference/agent-architecture.md) – MCP-kliens, eszközdiszpécser, orchestrator
- [Triggers](../reference/triggers.md) – Az MCP mint workflow belépési pont
- [Chat Tab](./chat-tab.md) – A `heym_chat` eszköz mögötti motor
- [Workflows Tab](./workflows-tab.md) – Workflow-k létrehozása és kezelése
- [Node Types](../reference/node-types.md) – AI csomópontok áttekintése
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt oldalútmutató az irányítópult felületeihez