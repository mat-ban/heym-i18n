# Gyors fiók

A **Gyors fiók** egy jobb oldali gyorsfuttató panel a workflow-khoz. Hitelesített oldalakon jelenik meg, például az irányítópult [Workflow-k lapján](../tabs/workflows-tab.md), a Docs és az Evals oldalakon.

## Hozzáférés

- Kattintson a képernyő jobb középső szélén lévő rögzített **Quick / Workflows** triggerre
- Amikor a [Contextual Showcase](./contextual-showcase.md) is elérhető, annak **Page Guide** triggere a Quick Workflows felett helyezkedik el
- A fiók jobbról nyílik meg, és az aktuális oldalt finom átméretezéssel balra tolja
- Mobilon a Gyors fiók rejtett
- A fiók nem jelenik meg a workflow szerkesztőben, a bejelentkezés/regisztráció oldalakon, a portálon vagy a HITL review oldalakon

## Workflow keresése

A fiók tetején lévő szűrőmezővel kereshet workflow-kat az alábbiak szerint:

- Workflow neve
- Workflow leírása

A keresés nem kis- és nagybetűérzékeny, és azonnal frissíti a listát.

## Rögzített workflow-k

Rögzítse a workflow-kat, hogy a fiók tetején maradjanak.

- A rögzített workflow-k saját szakaszban jelennek meg a teljes lista felett
- Az új rögzítések a tetejére kerülnek
- A rögzítési sorrend a böngésző tárolójában az újratöltések során is megmarad

## Workflow-k futtatása

Válasszon ki egy workflow-t a bemeneti űrlapjának megnyitásához.

- A bemeneti mezők függőlegesen, a fiók sorrendjében jelennek meg
- Kattintson a **Run Workflow** gombra a kiválasztott workflow végrehajtásához
- Kattintson a **Stop Workflow** gombra a futó futtatás megszakításához a fiókból
- A bemeneti mezők nélküli workflow-k közvetlenül is futtathatók

A fiók ugyanazt a workflow végrehajtási API-t használja, mint a Heym többi futtatási felülete, így a kimenetek és a futásidejű viselkedés konzisztens marad.

A futtatás leállítása a fiókból egyben megszakítja az aktív backend végrehajtást is, beleértve az adott workflow futtatáshoz tartozó esetleges folyamatban lévő Playwright böngészőfeladatot is.

## Folyamat és eredmények

A futtatás elindítása után a fiók az alábbiakat mutatja:

- A csomópontok streamelt lépésfolyamatát, ahogy elindulnak és befejeződnek
- Végleges állapot: `success`, `error` vagy `pending`
- Végleges kimenetek egy kompakt JSON panelben
- `Quick Drawer` címkével ellátott Előzmények bejegyzések

A `pending` azt jelenti, hogy a workflow egy későbbi műveletre vár, például emberi felülvizsgálatra.

## Böngésző tároló

A Gyors fiók a személyes beállításokat a `localStorage`-ban tárolja:

- Rögzített workflow ID-k
- Utoljára kiválasztott workflow

A fiók ebben a verzióban **nem** tárolja a bemeneti értékeket.

## Hatókör

A Gyors fiók szándékosan egy könnyűsúlyú végrehajtási felület.

- Tartalmazza: keresés, rögzítés, kiválasztás, bemenet, futtatás, folyamat, eredmény
- Nem tartalmazza: workflow létrehozása, szerkesztése, mappakezelés és vászon műveletek

## Kapcsolódó

- [Workflow-k lap](../tabs/workflows-tab.md) – Fő workflow lista, mappák és kezelés
- [Quick Start](../getting-started/quick-start.md) – Építse meg és futtassa első workflow-ját
- [Futtatási előzmények](./execution-history.md) – Korábbi futtatások áttekintése
- [Webhooks](./webhooks.md) – Workflow-k indítása HTTP-n keresztül
- [Contextual Showcase](./contextual-showcase.md) – Oldalszintű útmutató sáv, amely kiegészíti a Gyors fiókot
