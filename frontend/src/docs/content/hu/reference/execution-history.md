# Végrehajtási előzmények

A végrehajtási előzmények rögzítik a workflow-futtatásokat: bemeneteket, kimeneteket, csomópont-eredményeket, állapotot és a trigger forrását. Használja aktív éles futtatás nyomon követéséhez, korábbi futtatások vizsgálatához, hibakereséshez vagy ugyanazon bemenetekkel történő újrafuttatáshoz a **Bring to Canvas** funkcióval.

## Áttekintés

Minden végrehajtás a következőket tárolja:

| Mező | Leírás |
|-------|-------------|
| **Inputs** | Kérés törzse vagy futtatási bemenetek (pl. `text` a Bemeneti csomópont esetén) |
| **Outputs** | Workflow-szintű kimenetek |
| **Node results** | Csomópontonkénti kimenetek, állapot és végrehajtási idő |
| **Status** | `success`, `error`, `pending`, `skipped` vagy `failed` (lásd [Crash Recovery](#crash-recovery)) |
| **trigger_source** | A futtatás kiváltásának módja (lásd [Triggers](./triggers.md)) |

## Az előzmények elérése

| Hely | Hatókör |
|----------|-------|
| **Editor** eszköztár | Csak az aktuális workflow |
| **Docs** nézet fejléce | Csak az aktuális workflow |
| **Dashboard** fejléc (Chat fül) | Az összes workflow + chat/asszisztens futtatások |
| **Evals** nézet fejléce | Az összes workflow + chat/asszisztens futtatások |

Kattintson a **History** gombra (óra ikon) a párbeszédpanel megnyitásához.

## Workflow-nkénti vs. összes előzmény

- **Workflow-nkénti** (Editor, Docs): A megnyitott workflow futtatásait mutatja. A **Clear history** használatával csak az adott workflow futtatásait távolíthatja el.
- **All History** (Dashboard, Evals): Az összes workflow és chat/asszisztens munkamenet futtatásait mutatja. A lefedettség megegyezik a workflow-hozzáféréssel: az Ön által birtokolt workflow-k, a közvetlenül Önnel megosztott workflow-k, valamint azon workflow-k, amelyeket egy Önhöz tartozó csapattal osztottak meg. A **Clear all history** használatával az Ön által birtokolt összes rekordot eltávolíthatja. A megosztott workflow-k előzményei megmaradnak.

## Bring to Canvas

A **Bring to Canvas** betölti egy kiválasztott futtatás bemeneteit és csomópont-kimeneteit az aktuális workflow-ba.

### Mit tölt be

- **Inputs** → Futtatási bemeneti panel (pl. `text` a Bemeneti csomópont esetén, vagy egyéni mezők)
- **Node results** → A végrehajtási eredmény panel csomópontonkénti korábbi kimeneteket mutat
- **Execution result** → Állapot, kimenetek és időzítés a futtatásból

### Viselkedés kontextus szerint

- **Editorban** (workflow-nkénti előzmények): Azonnal alkalmazza a megnyitott workflow-ra, és bezárja a párbeszédpanelt.
- **All Historyból** (Dashboard/Evals): A workflow szerkesztőjébe navigál, majd betöltéskor alkalmazza az adatokat. Csak workflow-futtatásokhoz érhető el – chat/asszisztens futtatásokhoz nem.

### Végrehajtás deep link

Egy workflow megnyitása a `/workflows/{workflowId}/{executionId}` címen automatikusan a vászonra hozza az adott végrehajtást – ugyanúgy, mint a futtatás kiválasztása és a **Bring to Canvas** választása. Ez lehetővé teszi egy adott korábbi futtatás URL-ként történő megosztását. Ha a végrehajtás nem található (hibás vagy törölt azonosító), a szerkesztő visszaáll a sima workflow betöltésére.

### Használati esetek

Tartsa lenyomva a Ctrl/Cmd billentyűt és kattintson egy futtatásra a két előzménylista bármelyikében, hogy a közvetlen linket egy új böngészőlapon nyissa meg. Az aktuális lap és a megnyitott párbeszédpanel változatlan marad. A chat- és asszisztensfuttatások nem rendelkeznek workflow-val, így a billentyűparancs csupán kijelöli őket, akárcsak egy sima kattintás.

- Workflow újrafuttatása ugyanazokkal a bemenetekkel
- Sikertelen futtatás hibakeresése a bemenetek és csomópont-kimenetek vizsgálatával
- Kimenetek összehasonlítása a futtatások között

## Kérdezze az AI-t

Mindkét előzmény párbeszédpanelen található egy **Kérdezze az AI-t** gomb (szikra ikon) a cím mellett. Ez megnyitja a [Chat lapot](../tabs/chat-tab.md#asking-about-a-run) egy új beszélgetésben, a workflow-val és a kiválasztott futással eltávolítható chipekként csatolva. Kérdezze meg, miért volt lassú a futás, mi hibásodott meg, vagy kérje meg a Chatet a workflow javítására. A Chat pontosan azt a futást olvassa be, beleértve a csomópontonkénti nyomkövetést és a hibákat.

Az All History párbeszédpanelen a **Kérdezze az AI-t** csak akkor jelenik meg, ha egy workflow-futás van kiválasztva; a chat- és asszisztensfutások nem jelenítik meg.

## Futtatási idővonal

A futás részleteiben az **Idővonal** gomb (stopperóra ikon) az **Összes kibontása** mellett a **Lépések** listát span idővonalra cseréli. Amíg az idővonal látható, ugyanaz a gomb **Naplók** feliratot visel; kattintson rá a listához való visszatéréshez. Az All History ablakban a gomb csak workflow-futások esetén jelenik meg. Az idővonal egy sávot rajzol minden csomóponthoz a kezdésének időpontjában, így láthatja, melyik csomópont mennyi ideig tartott, és melyek futottak párhuzamosan. Vigye az egeret egy sáv fölé az időtartamért; kattintson rá ugyanazon részletvizsgáló megnyitásához, mint a szerkesztő [futtatási idővonala](#execution-timeline-details). A kiválasztott nézet mindaddig megmarad, amíg a párbeszédpanel nyitva van.

A csomópontok kezdési időpontjának tárolása előtt rögzített futások időtartam szerint egymás után kerülnek elrendezésre.

## Végrehajtási kiemelések

Élő futtatás után – vagy a **Bring to Canvas** használata után – egy elutasítható **Execution Highlights** felugró ablak jelenik meg a **vászon jobb felső sarkában**. Ez gyors módja annak, hogy lássa, *mit állított elő az egyes csomópontok*, felülről lefelé, végrehajtási sorrendben. Zárja be a **✕** gombbal; a következő futtatáskor újra megnyílik.

### Mit mutat

| Rekord | Forrás | Automatikus? |
|--------|--------|-------|
| **Input** | A futtatás bemeneti paraméterei (input/trigger csomópont) | Igen |
| **Output** | A kimeneti csomópont eredménye – vagy ha nincs ilyen, az utolsó csomópont üzenete | Igen |
| **Agent / LLM** | Az egyes agent vagy LLM csomópontok kimenete | Igen |
| **Output** | Bármely más csomópont, amelynél a **Highlight Node Output** engedélyezve van | Opcionális |

Azok a csomópontok, amelyek már automatikusan ki vannak emelve (input / output / last / agent / llm), soha nem jelennek meg kétszer, még akkor sem, ha a kapcsolót is engedélyezi.

### Az egyes rekordok

- `Node — message…` formában jelennek meg az első **250 karakterrel**; kattintson egy sorra a kibontáshoz, amely a **teljes üzenetet Markdownként** jeleníti meg, egy **Copy** gombbal.
- Egy csomópont, amely többször futott (pl. egy cikluson belül), `Node (N)` formában jelenik meg egy `‹ i / N ›` választóval – válassza ki, melyik futtatást szeretné megtekinteni; az egyes csomópontok választói függetlenek.

### Highlight Node Output

Minden csomópontnak – **az Agent és LLM kivételével** – van egy **Highlight Node Output** jelölőnégyzete a tulajdonságpaneljén (alapértelmezésben kikapcsolva). Engedélyezze, hogy a csomópont kimenete bekerüljön a felugró ablakba. Egy kis ✦ jelvény jelenik meg a kiemelt csomópontokon a vásznon. A [workflow DSL](./expression-dsl.md) szintaxisban ez a csomópont-adat `"highlight": true` mezője (alapértelmezésben `false`).

### Irányítópultokon

Azok az irányítópult widget-kártyák, amelyek workflow-t futtattak, egy ✦ **Execution highlights** gombot mutatnak a kártya fejlécében; kattintson rá ugyanazon felugró ablak megnyitásához az adott widget futtatásához, a widget rajzolt kimenetével mint kiemelt rekorddal.
## Futtatások futtatása

Mindkét előzmény párbeszédablak a lista tetején, a korábbi futtatások előtt jeleníti meg a **jelenleg futó futtatásokat**.

- Egy forgó indikátor és a **Fut** címke jelenik meg a kezdési időponttal együtt
- Kattintson az **Élő megnyitása** lehetőségre, hogy a szerkesztőt pontosan ehhez a futtatáshoz csatlakoztassa anélkül, hogy újraindítaná azt
- A vászon először visszaállítja a már befejezett csomópontokat, majd SSE-n keresztül fogadja a
  `node_start`, `node_complete` és a végső futtatási eseményeket
- Az aktuális csomópont pulzál a vásznon, a downstream csomópontok megtartják a függőben lévő animációjukat, és
  a Debug panel minden eredményt hozzáad, amint megérkezik – csakúgy, mint a szerkesztőből indított futtatás esetén
- Kattintson a **Mégse** lehetőségre a futtatás azonnali leállításához
- A bármelyik párbeszédablakból (Szerkesztő vagy Irányítópult) történő megszakítás bezárja az aktív SSE streamet is az adott workflow bármely nyitott vászonfülében, így a szerkesztő állapota tisztán visszaáll
- A megszakítás után a futó bejegyzés eltűnik a következő frissítéskor; nyomja meg a **Frissítés** gombot a lista manuális frissítéséhez
- Ha egy már befejezett futtatást szakít meg, a kérés nem hajt végre műveletet

A [párhuzamossági helyre](./webhooks.md#concurrency-limit-and-queued-runs) várakozó futtatások ugyanabban a szakaszban jelennek meg a **Queued 2/5** címkével, a sorban elfoglalt helyükkel és a sor méretével. Nincs **Open live** gombjuk, mert még semmi sem fut; a **Cancel** eltávolítja a várakozó futtatást a sorból, és `cancelled` állapotként rögzíti. Az a futtatás, amely hosszabb ideig várt, mint a workflow maximális várakozási ideje, `expired` állapotként kerül rögzítésre, a megtelt sor miatt elutasított futtatás pedig `queue_full` állapotként; mindkettő saját jelvénnyel rendelkezik a futtatási listában.

Az élő URL a `/workflows/{workflowId}/{executionId}`. A megfigyelő csak olvasható: a szerkesztő
elhagyása csak azt a böngészőfület kapcsolja le, és soha nem állítja le a workflow-t. Az aktív pillanatképek
a PostgreSQL-en keresztül vannak megosztva, így egy futtatás megnyitása akkor is működik, ha a trigger és a szerkesztő
kérése különböző backend workerekre érkezik.

## Összeomlás utáni helyreállítás

Ha a szerver újraindul (deploy, konténer újraindítás vagy összeomlás) egy workflow futása közben, az adott futtatás workere a végrehajtás közepén leáll. A Heym automatikusan helyreállítja ezeket a megszakított futtatásokat ahelyett, hogy **Fut** állapotban ragadnának.

- A következő indításkor a megválasztott leader folyamat felismeri az árva futtatásokat – azonnal egy szabályos újraindítás esetén, vagy körülbelül 60 másodpercen belül egy kemény összeomlás esetén (amint a heartbeat-ek egyértelműen leállnak).
- A helyreállított futtatások **elölről, ugyanazokkal a bemenetekkel futnak újra** (nem onnan folytatódnak, ahol leálltak), az aktuális workflow definíciót használva. Befejezéskor egy normál terminális bejegyzést rögzítenek (pl. `success`), így az előzmények a futtatást befejezettként mutatják.
- Egy futtatás **egyszer** kerül újrapróbálásra. Ha a helyreállítási kísérlet is megszakad – vagy a workflow azóta törlésre került –, a bejegyzés `failed` állapotban kerül rögzítésre.
- Ez ugyanúgy működik egyetlen konténer és több workeres telepítések esetén is; csak a leader végzi a helyreállítást, így egy futtatás soha nem kerül kétszer helyreállításra különböző workerek által.

### Automatikus helyreállítás kapcsoló

A szerkesztő **Execution Log** (futtatás) paneljén van egy **Auto-recover** jelölőnégyzet, amely workflow-nként **alapértelmezés szerint be van kapcsolva**.

- **Be**: a workflow megszakított futtatásai a fent leírt módon újrafutnak.
- **Ki**: a megszakított futtatások nem futnak újra, és `skipped` állapotban kerülnek rögzítésre.

> Az al-workflow futtatások nem kerülnek önállóan helyreállításra – azokat a helyreállított szülő futtatás vezérli újra. A saját újrakézbesítéssel rendelkező triggerek (RabbitMQ, ütemezett/cron, IMAP) újraindításkor szintén újrakézbesíthetnek, így egy helyreállított futtatás alkalmanként kétszer is végrehajtódhat.

## Függőben lévő emberi felülvizsgálat

A [Human-in-the-Loop](./human-in-the-loop.md) jóváhagyás miatt szünetelő futtatások azonnal `pending` állapotban kerülnek az előzményekbe.

- A függőben lévő agent csomópont egy felülvizsgálati payloadot tárol, amely tartalmazza a `reviewUrl`, `draftText` és `expiresAt` mezőket
- Az agent `review` handle-jéhez kapcsolódó bármely csomópont szintén futhat, mielőtt az ember válaszol, és ezek csomópont-eredményei ugyanabban a függőben lévő előzménybejegyzésben tárolódnak
- Az előzmény párbeszédablakok megjelenítik a felülvizsgálati linket, így a tulajdonosok másolhatják vagy megnyithatják azt
- Az előzmény párbeszédablakok és a szerkesztő Debug panelje a futtatás folytatása után megjelenítik a végső emberi döntést
- Amikor egy felülvizsgáló elfogadja, szerkeszti vagy elutasítja a piszkozatot, ugyanaz az előzménybejegyzés frissül a végső futtatási eredménnyel
- Ha ugyanaz a futtatás többször is szünetel HITL miatt, az előzménybejegyzés változatlan marad, míg minden ellenőrzési pont saját egyszeri felülvizsgálati linket kap

Ez különösen hasznos portál futtatások és hosszú életű workflow-k esetén, amelyek órákig vagy napokig várhatnak a folytatás előtt.

## Másolás

A **Másolás** gombot használja a Bemenetek vagy Kimenetek mellett a JSON vágólapra másolásához.

## Előzmények törlése

- **Workflow-nként**: A Szerkesztő előzmény párbeszédablakában kattintson az **Előzmények törlése** lehetőségre az aktuális workflow futtatásainak eltávolításához.
- **Minden előzmény**: Az Irányítópult/Evals előzmény párbeszédablakában kattintson a **Minden előzmény törlése** lehetőségre az Ön tulajdonában lévő összes futtatási rekord eltávolításához. A megosztott workflow-kból származó futtatások megmaradnak. Ez a művelet nem vonható vissza.

## A futtatás idővonalának részletei

Amikor a szerkesztő **Execution Log** panelje nyitva van, kattintson az időzítő gombra a futtatás idővonalának megjelenítéséhez. Válasszon ki egy szakaszt egy beágyazott részletek ellenőrző megnyitásához, amely átveszi a sorok területét. Megjeleníti a kiválasztott lépés állapotát, időtartamát, kísérleteinek számát, újrapróbálkozási információit, hibáit, trace ID-ját és egy tömör kimeneti előnézetet. Az objektum- és tömbkimenetek ugyanazt a `JsonTree` megjelenítőt használják, mint a Debug panel többi része; a skaláris értékek szöveges előnézetet használnak. Amikor egy lépés képeket ad ki (Playwright képernyőképek, generált képek, képfájlok vagy base64 képek a kérés törzsében, bárhol a kimenetben), azok bélyegképként jelennek meg a kimenet felett, és a JSON egy rövid helyőrzőt mutat a nyers base64 helyett. Kattintson egy bélyegképre a lightboxban való megnyitásához; a nyílgombok vagy a ←/→ billentyűk végiglépkednek a futtatás minden képén, egy `2 / 5` típusú számlálóval. Használja az **Open trace** lehetőséget LLM és Agent szakaszokhoz, amikor egy trace ID elérhető.
## Mobile csomópont részletei

Telefonon a szerkesztő a szabadformájú vászon helyett egy teljes képernyős workflow-fát jelenít meg. Koppintson egy rögzített eredménnyel rendelkező fa csomópontra, hogy annak futtatását teljes képernyős részletként megnyissa. A nézet külön **Input Data**, **Output Data** és **Errors** füleket kínál. Az output fül megjeleníti a rögzített eredményt és felkínálja a **Copy Output** lehetőséget; az input fül a kiválasztott csomópont konfigurációját mutatja, az errors fül pedig a rögzített hibát jeleníti meg, amikor a csomópont meghiúsult. A **Back to workflow** gombbal vagy a bezárás gombbal térhet vissza a fához.

A vászon és az irányítópult előzményei párbeszédablakai egy sorban tartják a futtatás vezérlőelemeit, és a rendelkezésre álló címke- és példányszűrőket egy reszponzív rácsban helyezik el. A szűrőmenüik ugyanazt az alkalmazáson belüli választót használják, így a kiválasztott pipa egységes margóval és alapvonallal rendelkezik minden opciócímkével.

## Kapcsolódó

- [Triggers](./triggers.md) – Hogyan indulnak el a workflow-k; az előzmények rögzítik a `trigger_source` értéket (beleértve a `board` értéket a [Board](../tabs/board-tab.md) kártyamozgatásai és utókövetései által indított futtatásokhoz)
- [Human-in-the-Loop](./human-in-the-loop.md) – Függőben lévő felülvizsgálati URL-ek és folytatási viselkedés
- [Edit History](./edit-history.md) – Verziókezelés a workflow-mentésekhez (visszaállítás, diff)
- [Quick Start](../getting-started/quick-start.md) – Építse meg és futtassa első workflow-ját
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow-k létrehozása és kezelése
