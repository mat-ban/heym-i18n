# Evals fül

Az **Evals** fül egy külön oldal a `/evals` útvonalon. Itt értékelési csomagokat hozhat létre, teszteseteket definiálhat, és értékeléseket futtathat az [Agent](../nodes/agent-node.md) workflow-jain. Az [ügynökcsomag](#agent-suites) futtat egy agenst vagy beolvassa a valós futásait, és ellenőrzi az általa meghívott eszközöket, a késleltetést, az USD-költséget, a tokeneket és az eszközhívások számát.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evals demó megtekintése</a></p>

## Hozzáférés

- Kattintson az **Evals** elemre az irányítópult fül sávjában
- Vagy navigáljon a `/evals` útvonalra
- Vagy használja a **Ctrl+K** (Cmd+K) billentyűkombinációt, és válassza az "Evals" opciót a parancspalettáról

## Értékelési csomagok

- **Új csomag** – Válassza a **Prompt-csomag** lehetőséget egy rendszer-prompt modellek közötti teszteléséhez, vagy az **Ügynökcsomag** lehetőséget egy agens valós futásainak ellenőrzéséhez (lásd: [Ügynökcsomagok](#agent-suites))
- **Csomagválasztó** – Együtt listázza a prompt- és ügynökcsomagokat a típusukkal a nevük mellett; gépeljen a kereséshez
- **Csomag létrehozása** – Definiáljon egy csomagot névvel és leírással
- **Workflow kiválasztása** – Válassza ki, melyik workflow-t szeretné értékelni
- **Hitelesítési adatok kiválasztása** – API kulcs a workflow futtatásához
- **Rendszer prompt** – Szerkessze a csomag szintű rendszer promptot közvetlenül a bal oldali panelen
- **Prompt optimalizálása** – Kérjen meg egy LLM-et a jelenlegi rendszer prompt javítására

## Tesztesetek

- Adjon hozzá teszteseteket bemeneti promptokkal és elvárt kimenetekkel
- Minden esethez tartozhat egyéni elvárt érték az összehasonlításhoz
- Szerkessze vagy törölje az eseteket a csomagból
- **Tesztadatok generálása** – A kiválasztott hitelesítési adatok/model használatával automatikusan hozzon létre teszteseteket a csomag promptjából

## Értékelések futtatása

- **Válasszon ki egy vagy több modellt** – Futtassa ugyanazt a csomagot több modellel egy értékelésben
- **Pontozási módszer** – Válassza az `Exact Match`, `Contains` vagy `LLM-as-Judge` opciót
- **Judge** – Az `LLM-as-Judge` esetén opcionálisan válasszon egy OpenAI, OpenAI kompatibilis (Custom), Gemini (Google) vagy [Decision Model](../nodes/decision-node.md) hitelesítési adatot, és adja meg a judge modelljét (például `gpt-4o-mini` vagy `jev-latest`), hogy egy független judge pontozzon
- **Futtatások tesztelésenként** – Ismételje meg minden tesztesetet többször egy futtatásban
- **Megjegyzett beállítások** – A csomag a legutóbbi futtatásának beállításaival nyílik meg: hitelesítési adat, modellek, pontozási módszer és bíráló, hőmérséklet, érvelési erőfeszítés és tesztenkénti futtatások száma. Egy korábbi futtatás megnyitása betölti annak beállításait, így az **Értékelések újrafuttatása** megismétli ugyanazt a tesztet
- **Temperature** – Állítsa be a modell temperature értékét (`Exact Match` és `Contains`)
- **Érvelési erőfeszítés** – Állítsa be az érvelési erőfeszítést az érvelő modellekhez az Alacsonytól a Nagyon magasig és Max értékig, hasonlóan az LLM és Agent csomópontokhoz (`Exact Match` és `Contains`)

### LLM-as-Judge

Judge használatával minden modell a csomag promptjával egyedül válaszol a teszt bemenetére, majd a judge 0 és 100 között értékeli, mennyire illeszkedik a válasz az elvárt kimenethez:

- **A modell judge** (OpenAI, OpenAI kompatibilis vagy Gemini) elolvassa a kérdést, az elvárt kimenetet és a választ, majd egy pontszámot ad vissza egysoros indoklással. Temperature `0` értéken fut, vagy reasoning modell esetén `low` reasoning effort értéken, így ugyanaz a válasz ugyanazt az ítéletet kapja.
- **A decision model judge** egy ötszintű rubrika alapján értékeli a választ, a *Teljesen téves* kategóriától a *Teljesen illeszkedik* kategóriáig. A pontszám a rubrikán elfoglalt valószínűséggel súlyozott pozíció, így egy eloszlásból származik, amelyet a modell számított, nem pedig egy számból, amelyet leírt.

A cellára mutatva megjelenő kártya a bíráló indoklását mutatja, döntési modell esetén pedig a szintet, a pontszámot és annak megbízhatóságát. A késleltetés és a tokenek a tesztelt modellt írják le; magának a bírálónak a hívásai a [Nyomkövetések](./traces-tab.md) alatt jelennek meg az **Értékelések** forrás alatt. A bírálóválasztó kihagyja a Model Router hitelesítési adatait, mert a bírálónak egyetlen rögzített modellnek kell lennie. A tesztelt modellek hitelesítési adata lehet egy [Model Router](../reference/credentials.md#model-router-auto-model): annak **Auto** modellje kérésenként választ modellt, ugyanúgy, mint egy workflow-ban.

Judge nélkül minden modell egyetlen kérésben válaszol és pontozza a saját válaszát.

Ebben a módban a temperature és a reasoning effort rejtve van, és a futtatás rögzített beállításokat használ: temperature `0.7` a standard modellekhez, és `medium` reasoning effort a reasoning modellekhez (`low`, amikor a saját válaszaikat pontozzák).

## Eredmények

- Tekintse meg a sikeres/sikertelen eredményt tesztesetenként
- Vizsgálja meg a tényleges és az elvárt kimeneteket
- Hasonlítsa össze a modellek kimeneteit egymás mellett, ha egy futtatás több modellt tartalmaz
- Tekintse át a korábbi értékelések futtatási előzményeit; egy `LLM-as-Judge` futtatás megmutatja a judge modelljét az előzménylistában
- Nyissa meg a korábbi futtatásokat az eredménypanelről, és vizsgálja meg a mentett prompt/bemenet/kimenet pillanatképeket
- Egy korábbi futtatás megnyitása betölti annak pontozási módszerét és judge-át a bal oldali panelre, így a **Re-Run Evals** ugyanazt az értékelést ismétli meg
- Az **Export** JSON formátumban tölti le a futtatást, beleértve a `judge_credential_id` és `judge_model` mezőket

## Agent Suites

Az ügynökcsomag egy [Agent](../nodes/agent-node.md) csomópontot ellenőriz a futásai alapján. Beolvassa azokat a [Nyomkövetésekből](./traces-tab.md), ahol minden futás rögzíti az idejét, a tokeneket, a költséget és az eszközhívásokat, valamint le is futtathatja a workflow-t Ön helyett.

Hozzon létre egyet az **Új csomag** → **Ügynökcsomag** menüpontban, három lépést követve:

1. **Agens** – Válassza ki a workflow-t, majd annak agens csomópontját. Csak az agens csomóponttal rendelkező workflow-k jelennek meg; a még nem futott workflow vagy agens látható, de nem választható ki. A kiválasztott agens beállításai (modell, utasítások, eszközök és korlátok) a jobb oldalon jelennek meg, alatta pedig a workflow írásvédett vászna látható a kiemelt agenssel.
2. **Baseline** – Az agens legutóbbi 10 futása: p50 és p95 késleltetés, futásonkénti költség, futásonkénti tokenek és eszközhívások száma, milyen eszközöket hívott meg és milyen gyakran, valamint az egyes futások egyedi értékei. A hibával végződő futások listázva vannak, de kimaradnak a baseline-ból.
3. **Ellenőrzések** – Jelölje meg az egyes eszközöket **Must call**, **Must not call** vagy **Either** minősítéssel. Minden hívástípus megjelenik a típusával: Python és csomópont-eszközök, **MCP** eszközök a szerverükkel, **alágensek** címke szerint, **rész-workflow-k** név szerint és **skills**. Adjon hozzá egyet típus és név alapján, ha még nem futott, majd távolítsa el az **X** gombbal. Állítson be felső határokat a késleltetésre, költségre, összes tokenre és eszközhívásra; mindegyik 20%-kal a baseline p95 értéke felett indul, és kikapcsolható.

A mentett csomag az **Eredmények** felületen nyílik meg, mellette a **Baseline** és a **Hívások szerkesztése** lehetőséggel:

- **Workflow futtatása** – Válassza ki a futtatások számát (legfeljebb 20); egyszerre négy fut. A bemenetek a workflow legutóbbi futásából töltődnek be és szerkeszthetők, és minden futás ezeket használja. Kapcsolja be a **Bemenetek generálása** funkciót (a csillogás ikont), majd válasszon hitelesítési adatot és modellt, hogy a modell minden futáshoz eltérő bemenetet generáljon. Beolvassa az agens rendszerutasításait, és közel marad a beírt értékekhez: egy városnév beírása más városneveket eredményez. Minden futás a teljes workflow-t végrehajtja, mint bármely normál futás, és megjelenik a Futtatási előzményekben az `agent_suite` triggerrel. A későbbi lépések – például e-mail küldése – kihagyásához nyissa meg a workflow-t az **Ugrás a workflow-hoz** gombbal a panelen, és először tiltsa le ezeket a csomópontokat. A **Leállítás** befejezi a csomag futását: új futások nem indulnak el, a folyamatban lévők pedig megszakadnak. Az a futás, amelynek szervere leállt (például újraindításkor), egy perc múlva megszakítottként jelenik meg ahelyett, hogy elakadva maradna.
- **Eredmények** – Alapértelmezés szerint a legutóbbi futtatás értékelése jelenik meg. Minden futtatás a dátumával együtt megmarad a futtatásválasztóban, ahol megnyithatja vagy törölheti; vagy váltson az agens legutóbbi 10, 20 vagy 50 futására a többi futás bevonásához. Láthatja a megfelelési arányt, az egyes ellenőrzések sikerességének gyakoriságát, a késleltetést, a költséget, a tokeneket és az eszközhívásokat a mentett baseline mellett, valamint az egyes futásokat a hiba okával és a nyomkövetési hivatkozással.
- Az **Ugrás a workflow-hoz** új lapon nyitja meg az agens workflow-ját. A név mezőben az **Esc** vagy az **X** törli a beírt szöveget.

Hogyan értelmezendők az értékek:

- A **késleltetés** a modell ideje plusz a futás eszközhívásainak időtartama.
- A **költség** ugyanazokat az árakat használja, mint a Traces. Az ár nélküli modell futása kihagyja a költségellenőrzést ahelyett, hogy hibát jelezne.
- Egy futás akkor **megfelelő**, ha hiba nélkül fejeződött be, és minden ellenőrzés sikeres volt.
- A csomag csak a saját nyomkövetéseit olvassa, ugyanúgy, mint a Traces lap.
- A **Legutóbbi futások használata baseline-ként** a **Hívások szerkesztése** menüben a mentett baseline-t az agens legutóbbi futásaival helyettesíti.

A csomag baseline-ja három forrás egyikéből származik. A **Hívások szerkesztése** menü mutatja, hogy melyik aktív a **Mentett baseline** mellett:

- az agens legfrissebb futásai (az alapértelmezett, és amit a **Legutóbbi futások használata baseline-ként** átvesz),
- egy befejezett csomagfuttatás,
- kézzel megadott számok.

Az utóbbi kettő a [Chat](./chat-tab.md#working-with-evals) felületéről vagy az API-n keresztül állítható be:

- `PATCH /api/evals/agent-suites/{id}` fogadja a `baseline: {"source": "suite_run", "run_id": "…"}` vagy `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}` adatot.
- `POST /api/evals/agent-suites/{id}/runs` fogadja az `inputs_list` tömböt: futásonként egy bemeneti objektum, legfeljebb 20.

### Chat és MCP használatával

A [Chat](./chat-tab.md#working-with-evals) és az MCP `heym_chat` eszköz képes prompt- és ügynökcsomagok létrehozására, módosítására és futtatására:

- Önállóan készítenek teszteseteket és futási bemeneteket.
- Megkérdezik, melyik hitelesítési adatot használják a prompt-csomag létrehozása előtt, kivéve, ha csak egyetlen adat felel meg.
- Hivatkoznak minden olyan csomagra, amelyet ezen az oldalon megemlítenek.

## Benchmark mátrix ötletek

Amikor benchmark mátrixot épít agent workflow-khoz, a HITL forgatókönyveket első osztályú esetekként vegye fel, ne kezelje őket edge case-ként.

- Fedje le mindhárom review döntést: `accepted`, `edited` és `refused`
- Tartalmazzon több trigger forrást, például szerkesztői futtatásokat, portált, curl/webhook és cron-vezérelt futtatásokat
- Adjon hozzá ismételt review forgatókönyveket, ahol egy agent futtatás többször is szünetel
- Ellenőrizze az agent `review` kimenetéhez kapcsolódó értesítési ágakat
- Igazolja a visszautasítás utáni downstream viselkedést, különösen ha a későbbi csomópontok a `$agent.decision` alapján ágaznak el

## Kapcsolódó

- [Miért a Heym](../getting-started/why-heym.md) – Az Evals mint az agent életciklus teszt szakasza
- [Agent csomópont](../nodes/agent-node.md) – Az értékelt workflow-k
- [Hitelesítési adatok fül](./credentials-tab.md) – Hitelesítési adatok az eval futtatásokhoz
- [Traces fül](./traces-tab.md) – Részletes trace vizsgálat
- [Workflows fül](./workflows-tab.md) – Hozzon létre workflow-kat az értékeléshez
- [Futtatási előzmények](../reference/execution-history.md) – Korábbi futtatások megtekintése (History gomb a fejlécben)
- [Kontextuális bemutató](../reference/contextual-showcase.md) – Kompakt oldalútmutató, amely elérhető az evals oldalon
