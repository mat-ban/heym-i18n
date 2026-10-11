# Evals fül

Az **Evals** fül egy külön oldal a `/evals` útvonalon. Itt értékelési csomagokat hozhat létre, teszteseteket definiálhat, és értékeléseket futtathat az [Agent](../nodes/agent-node.md) workflow-jain.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evals demó megtekintése</a></p>

## Hozzáférés

- Kattintson az **Evals** elemre az irányítópult fül sávjában
- Vagy navigáljon a `/evals` útvonalra
- Vagy használja a **Ctrl+K** (Cmd+K) billentyűkombinációt, és válassza az "Evals" opciót a parancspalettáról

## Értékelési csomagok

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
- **Temperature** – Állítsa be a modell temperature értékét (`Exact Match` és `Contains`)
- **Reasoning effort** – Állítsa be a reasoning effort értékét reasoning modellekhez (`Exact Match` és `Contains`)

### LLM-as-Judge

Judge használatával minden modell a csomag promptjával egyedül válaszol a teszt bemenetére, majd a judge 0 és 100 között értékeli, mennyire illeszkedik a válasz az elvárt kimenethez:

- **A modell judge** (OpenAI, OpenAI kompatibilis vagy Gemini) elolvassa a kérdést, az elvárt kimenetet és a választ, majd egy pontszámot ad vissza egysoros indoklással. Temperature `0` értéken fut, vagy reasoning modell esetén `low` reasoning effort értéken, így ugyanaz a válasz ugyanazt az ítéletet kapja.
- **A decision model judge** egy ötszintű rubrika alapján értékeli a választ, a *Teljesen téves* kategóriától a *Teljesen illeszkedik* kategóriáig. A pontszám a rubrikán elfoglalt valószínűséggel súlyozott pozíció, így egy eloszlásból származik, amelyet a modell számított, nem pedig egy számból, amelyet leírt.

A cella hover kártyája megmutatja a judge indoklását, vagy decision model esetén a szintet, a pontszámot és annak konfidenciáját. A Latency és a tokenek a tesztelt modellt írják le; a judge saját hívásai a [Traces](./traces-tab.md) alatt, az **Evals** forrásnál jelennek meg. A modellválasztó kihagyja a Model Router hitelesítési adatokat, mert az eval konkrét modelleket hasonlít össze.

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
