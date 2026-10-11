# Vektortárolók lap

A **Vektortárolók** lap a [RAG](../nodes/rag-node.md) csomópontok által használt vektortárolókat kezeli. Hozzon létre tárolókat, töltsön fel dokumentumokat, és ossza meg azokat a csapatával.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vektortárolók bemutató megtekintése</a></p>

## Vektortároló létrehozása

1. Kattintson az **Új vektortároló** elemre
2. Adjon meg egy nevet és opcionálisan egy leírást
3. Válasszon egy vektortároló **hitelesítési adatot** – *RAG: Qdrant + OpenAI* (külső Qdrant szerver), *RAG: Psql + OpenAI* (a Heym saját Postgres adatbázisa pgvector segítségével), vagy *RAG: Custom Embeddings* (bármely OpenAI-kompatibilis embedding endpoint, amely a két háttérrendszer valamelyikét célozza). A hitelesítési adat határozza meg a tároló háttérrendszerét.
4. Opcionálisan állítson be egy egyedi collection nevet (alapértelmezésben automatikusan generált)
5. Mentés

> A tároló háttérrendszerét a létrehozáskor a hitelesítési adata rögzíti. Egy RAG csomópontban a **Database** legördülő menü a tárolókat a megfelelő háttérrendszerre szűri.

## Dokumentumok feltöltése

- **Fájlok feltöltése** – Húzzon be vagy válasszon ki fájlokat (PDF, TXT stb.)
- **Duplikátumok kezelése** – Válassza a duplikált fájlnevek felülírását vagy kihagyását
- **Folyamatjelző** – A feltöltés folyamata megjelenik a betöltés során

## Tartalom kezelése

- **Elemek megtekintése** – Tekintse meg a forráscsoportokat és a dokumentumszámokat tárolónként. A feltöltött fájlok a fájlnevük alá csoportosulnak; azok a dokumentumok, amelyeket egy [RAG csomópont](../nodes/rag-node.md) saját `source` nélkül tárolt, az **Added workflow: _name_** alá csoportosulnak, megnevezve az őket író workflow-t
- **Források törlése** – Távolítson el adott fájlokat vagy forráscsoportokat egy tárolóból, beleértve mindazt, amit egy workflow hozzáadott
- **Tároló szerkesztése** – Módosítsa a nevet, a leírást vagy a hitelesítési adatot

## Megosztás

- Ossza meg a vektortárolókat más felhasználókkal e-mailben
- A megosztott tárolók jelöléssel jelennek meg
- A megosztás visszavonása a tároló kártyájának menüjéből

## Használat workflow-kban

Egy [RAG csomópontban](../nodes/rag-node.md) válassza ki a vektortárolót név szerint. A csomópont lekéri a releváns chunkokat, és kiegészíti velük az LLM kontextusát.

## Kapcsolódó

- [Hitelesítési adatok lap](./credentials-tab.md) – Vektortároló hitelesítési adatainak beállítása (Qdrant, Postgres vagy egyedi embeddingek)
- [RAG csomópont](../nodes/rag-node.md) – Csomópont-referencia
- [Workflow-k lap](./workflows-tab.md) – Hozzon létre RAG-ot használó workflow-kat
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt oldalútmutató az irányítópult felületeihez
