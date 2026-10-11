# Változók lap

A **Változók** lap kezeli a **Globális Változótárat** – az összes workflow között megosztott, tartós kulcs-érték adatokat.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Változók demó megtekintése</a></p>

## Áttekintés

- Globális változók létrehozása, szerkesztése és törlése
- A változók felhasználói hatókörűek, és a workflow-futtatások között is megmaradnak
- Kifejezésekben a `$global.variableName` szintaxissal hivatkozhat rájuk

## Változó létrehozása

1. Kattintson az **Új változó** gombra
2. Adja meg a **nevet** (kifejezésekben használatos)
3. Állítsa be az **értéket** (string, number, boolean, array vagy object)
4. Válassza ki az **értéktípust** (Auto, String, Number, Boolean, Array, Object)

## Szerkesztés és törlés

- **Szerkesztés** – Kattintson a szerkesztés ikonra a változó sorában
- **Törlés** – Kattintson a kuka ikonra; az ezt használó workflow-knál helyettesítésre lesz szükség
- **Tömeges törlés** – Jelöljön ki több változót, és használja a **Kijelöltek törlése** lehetőséget

## Használat workflow-kban

Hivatkozzon a változókra bármely kifejezésben:

```
$global.environment
$global.settings.baseUrl
```

Globális változókat egy [Változó csomópontból](../nodes/variable-node.md) is beállíthat, ha engedélyezi a **Tárolás a Globális Változótárban** opciót.

## Kapcsolódó

- [Globális változók](../reference/global-variables.md) – Referenciaútmutató
- [Változó csomópont](../nodes/variable-node.md) – Változók beállítása `isGlobal` használatával
- [Kifejezés DSL](../reference/expression-dsl.md) – `$global` szintaxis
- [Chat lap](./chat-tab.md) – A Chat hozzáférhet a globális változókhoz
- [Kontextuális bemutató](../reference/contextual-showcase.md) – Kompakt oldalútmutató az irányítópult felületeihez
