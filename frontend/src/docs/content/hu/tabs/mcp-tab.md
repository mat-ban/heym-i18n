# MCP lap

Az **MCP** lap a Model Context Protocol (MCP) integrációt konfigurálja. Az MCP lehetővé teszi, hogy az AI-kliensek (Claude, Cursor és bármely MCP-kompatibilis eszköz) az Ön Heym workflow-jait eszközként hívják meg.

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

### Workflow MCP kapcsoló

Minden workflow MCP-eszközként tehető elérhetővé:

- **Enable** – A workflow eszközei elérhetővé válnak az alapértelmezett szerverhez csatlakozó összes kliens számára
- **Disable** – A workflow nem kerül elérhetővé

A workflow-kártyák megjelenítik a leírást és a bemeneti mezőnevek előnézetét, így az engedélyezés előtt láthatja, mit vár el az egyes eszközök.

## Heym chat eszköz

A **Heym Capabilities** szakasz a Chat lap motorját egyetlen `heym_chat` nevű MCP-eszközzé alakítja. Engedélyezheti az alapértelmezett szerveren, bármely elnevezett szerveren vagy mindkettőn — minden felület saját kapcsolóval és modellválasztással rendelkezik.

Amikor be van kapcsolva, a `heym_chat` megjelenik a `tools/list` listában a workflow-eszközök mellett. Az MCP-kliens egyetlen természetes nyelvű üzenetet küld, és a Heym motor onnantól átveszi a feladatot, ugyanazokkal a képességekkel, amelyekkel a Chat lap rendelkezik:

- Workflow-k létrehozása, szerkesztése, vizsgálata és futtatása a Workflow AI Builder segítségével
- Analitikák, legutóbbi futtatások és közelgő cron ütemezések jelentése
- Egy workflow futási előzményeinek jelentése: hányszor futott, állapotszámok, mikor futott, valamint kérésre egyetlen futtatás bemenetei, kimenetei és csomópontonkénti hibái
- Annak jelentése, hogy mi fut éppen most: hány futtatás aktív, azok workflow-nevei, mennyi ideje futnak, melyik csomóponton vannak éppen, és egy hivatkozás az élő futtatásra
- Táblák listázása, kártyák létrehozása és kártyarészletek olvasása a [Board lapon](./board-tab.md)
- Adattáblák listázása oszlopaikkal együtt, újak létrehozása és beillesztése az általa épített workflow-kba
- Csapatok és globális változók olvasása, valamint a dokumentációban való keresés
- Függőben lévő human-in-the-loop felülvizsgálatok jóváhagyása, szerkesztése vagy elutasítása

A Chat laphoz később hozzáadott képességek automatikusan elérhetővé válnak a `heym_chat`-en keresztül — nincs szükség képességenkénti kapcsolóra, amelyet szinkronban kellene tartani.

A hitelesítési adatok a felületen maradnak: a `heym_chat` soha nem listázza, választja ki vagy hozza létre azokat. Amikor workflow-t épít vagy szerkeszt, a hitelesítési adatot igénylő új csomópontok üresen maradnak, és a válasz megnevezi azokat, így Ön beállíthatja őket a szerkesztőben.

Az adattáblák esetében ez másképp van. Egy tábla nem tartalmaz titkot, így a `heym_chat` listázhatja a tábláit, megkérdezheti, hogy egy workflow melyiket használja, és létrehozhat egy újat az oszlopaival együtt. Sorokat soha nem olvas vagy ír.

### Hitelesítési adat és modell

A `heym_chat` az Ön Heym-fiókján futtatja a motort, így saját LLM hitelesítési adatra van szüksége:

| Mező | Viselkedés |
|-------|----------|
| **Credential** | Válasszon bármely OpenAI, Google vagy Custom hitelesítési adatot, amelyhez hozzáfér. Előre kitöltve a [Settings](../reference/user-settings.md) részben beállított előnyben részesített hitelesítési adatból, ha még nem választott. |
| **Model** | A kiválasztott hitelesítési adatból töltődik be. Előre kitöltve az Ön előnyben részesített modelljéből, ha a hitelesítési adat egyezik. |

Ha bármelyik hiányzik, az eszköz továbbra is megjelenik a `tools/list` listában, de minden hívás hibát ad vissza, amely arra kéri, hogy fejezze be a beállítást ezen a lapon.

### Argumentumok és előzmények

| Argumentum | Kötelező | Leírás |
|----------|----------|-------------|
| `message` | Igen | Az utasítás vagy kérdés, természetes nyelven. |
| `conversation_id` | Nem | Egy `conversation_id` egy korábbi `heym_chat` eredményből, hogy folytassa azt a szálat. |

Minden hívás bekerül a [Chat lap](./chat-tab.md) előzményeibe normál beszélgetésként, amely a beszélgetéslistában egy dugó ikonnal van megjelölve. Az üzenetek, eszközkártyák és a tisztázási szünetek pontosan úgy néznek ki, mint egy Ön által indított beszélgetés, és a szálat a böngészőben megnyitva folytathatja a beszélgetést. Minden eredmény visszaadja a `conversation_id`-t, így az MCP-kliens ugyanazt a szálat folytathatja ahelyett, hogy minden hívásnál újat nyitna.

Amikor az asszisztensnek tisztázásra van szüksége, szünetet tart és jelzi ezt; válaszoljon a válaszokkal ugyanazon `conversation_id` használatával.
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
| **Heym Capabilities** | Kapcsolja be a `heym_chat` eszközt ehhez a szerverhez, és válassza ki a hitelesítési adatait és modelljét |
| **Assigned Workflows** | Kapcsolja be, hogy a workflow-k közül melyeket tegye elérhetővé ez a szerver |

### Workflow hozzárendelése

A workflow hozzárendelése szerverenként történik, és független az alapértelmezett szerver kapcsolójától. Egy workflow egyszerre engedélyezhető az alapértelmezett szerveren és több elnevezett szerveren is, vagy egyiken sem.

A workflow átkapcsolása a hozzárendelt lista tetejére mozgatja azt, így az éppen módosított sor látható marad ahelyett, hogy elgörgetne.

### Hitelesítés

Az elnevezett szerverek ugyanazokat a hitelesítési módszereket támogatják, mint az alapértelmezett szerver:

- **X-MCP-Key header** – Adja át közvetlenül a szerver API-kulcsát (API-kliensek, Cursor). Csak header: a kulcsok `?key=` query paraméterként nem elfogadottak, mert az URL-ek bekerülnek a hozzáférési naplókba, proxy naplókba és a böngésző előzményeibe.
- **Claude OAuth** – Adja hozzá a szerver URL-jét a Claude integrációkhoz; hagyja üresen a hitelesítési adatokat, és a Claude automatikusan regisztrál OAuth-on keresztül. A bearer tokennek az `Authorization` headerben kell utaznia, nem `?token=` formában.
- **Session token** – Az SSE handshake során kerül kiadásra; az adott szerverre van hatókörözve, így az egyik elnevezett szerverről származó tokenek nem férhetnek hozzá egy másikhoz. Ez a rövid élettartamú `?session=` paraméter nem érintett.

### Elnevezett szerver törlése

Kattintson az **X** ikonra a szerverkártya fejlécén. A törlés eltávolítja a szervert és annak összes workflow-hozzárendelését; maguk a workflow-k nem érintettek.

## SSE Endpoint

| Szerver | Endpoint |
|--------|----------|
| Alapértelmezett | `{origin}/api/mcp/sse` |
| Elnevezett | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Mindkét endpoint támogatja az SSE transportot (GET, MCP spec 2024-11-05) és a Streamable HTTP transportot (POST, MCP spec 2025-03-26). A Claude mindkettőn OAuth 2.1 / PKCE-t használ a biztonságos bejelentkezéshez.

## Kapcsolódó

- [Why Heym](../getting-started/why-heym.md) – Az MCP mint első osztályú primitív a Heymben
- [Agent Node](../nodes/agent-node.md) – Agent csomópont MCP eszköztámogatással
- [Agent Architecture](../reference/agent-architecture.md) – MCP-kliens, eszközdiszpécser, orchestrator
- [Triggers](../reference/triggers.md) – Az MCP mint workflow belépési pont
- [Chat Tab](./chat-tab.md) – A `heym_chat` eszköz mögötti motor
- [Workflows Tab](./workflows-tab.md) – Workflow-k létrehozása és kezelése
- [Node Types](../reference/node-types.md) – AI csomópontok áttekintése
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt oldalútmutató az irányítópult felületeihez
