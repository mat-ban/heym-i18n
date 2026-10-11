# Sablonok lap

A Sablonok lap lehetővé teszi teljes workflow-k és egyedi csomópontok mentését, böngészését és újrafelhasználását. Ossza meg egyszer, amit egyszer elkészített, és egyetlen kattintással alkalmazza új projektekben.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ A Sablonok bemutató megtekintése</a></p>

## Áttekintés

Kétféle sablon létezik:

- **Workflow-sablonok** — egy teljes workflow (az összes csomópont és kapcsolat) mentése újrafelhasználható kiindulópontként.
- **Csomópont-sablonok** — egyetlen konfigurált csomópont (pl. egy hangolt LLM csomópont vagy egy egyedi HTTP csomópont) mentése különböző workflow-kban való újrafelhasználásra.

A lap tetején található **Workflows / Nodes** váltóval válthat a kettő között.

A keresősáv segítségével név, leírás, címkék vagy csomóponttípus szerint szűrheti a látható sablonokat.

---

## Sablon létrehozása

### Workflow-sablon

1. Nyissa meg a szerkesztőben a megosztani kívánt workflow-t.
2. Kattintson a **Share as Template** gombra a felső eszköztáron.
3. Adja meg a nevet, a leírást és az opcionális címkéket.
4. Válassza ki a láthatóságot: **Everyone** (minden felhasználó) vagy **Specific users** (adja meg a felhasználóneveket és/vagy válasszon csapatokat).
5. Kattintson a **Share** gombra. Egy zöld értesítés igazolja a sikert.

### Csomópont-sablon

1. Kattintson jobb gombbal bármelyik csomópontra a vásznon.
2. Válassza a **Share as Template** lehetőséget a helyi menüből.
3. Töltse ki az űrlapot, majd kattintson a **Share** gombra.

---

## Sablon használata

### Workflow-sablon

1. Nyissa meg a **Templates** lapot, és győződjön meg róla, hogy a **Workflows** van kiválasztva.
2. Kattintson egy kártyára az előnézethez, vagy kattintson közvetlenül a **Use** gombra.
3. A workflow egy új workflow-ba kerül klónozásra, amely a szerkesztőben nyílik meg.

### Csomópont-sablon

1. Nyissa meg a **Templates** lapot, és válassza a **Nodes** lehetőséget.
2. Kattintson a **Use** gombra egy csomópont-sablon kártyáján.
3. Megjelenik egy párbeszédablak — válassza ki, hová szeretné hozzáadni a csomópontot:
   - **New workflow** — létrehoz egy új workflow-t, amely csak ezt a csomópontot tartalmazza.
   - **Existing workflow** — válasszon a workflow-listájából; a csomópont automatikusan beillesztésre kerül, amikor a szerkesztő megnyílik.

---

## Előnézet

Kattintson bármelyik sablonkártyára a teljes előnézet megnyitásához:

- **Kártya-bélyegképek** — a sablonkártyák egy illesztett, csak olvasható vászon-pillanatképet jelenítenek meg mind a workflow-k, mind az egycsomópontos sablonok esetében.
- **Workflow-sablonok** — egy csak olvasható vászon, amely megegyezik az előzmények előnézetének stílusával, beleértve a mozgatást és a nagyítást.
- **Csomópont-sablonok** — a mentett csomópont ugyanazon a csak olvasható vásznon nyílik meg, egycsomópontos előnézetként.
- **Csomópont részletei** — kattintson bármelyik csomópontra az előnézetben, hogy megtekintse a mentett konfigurációját az oldalpanelen.
- A címkék, a használati szám és a **tulajdonos** minden sablonnál megjelennek.

Az előnézet bezárásához nyomja meg az **ESC** billentyűt, vagy kattintson a területen kívülre.

---

## Sablonok kezelése

- **Edit** – Ha Ön a sablon tulajdonosa, vigye az egérmutatót a kártya fölé, és kattintson a ceruza ikonra a név, leírás, címkék vagy láthatóság módosításához
- **Delete** – Ha Ön a sablon tulajdonosa, vigye az egérmutatót a kártya fölé, és a megerősítő kérdés után törölje a sablont
- **Csak tulajdonosi műveletek** – A szerkesztési és törlési vezérlők csak az Ön által létrehozott sablonoknál jelennek meg

---

## Parancspaletta (CTRL+K)

A sablonok (mind a workflow-, mind a csomópont-sablonok) kereshetők a **CTRL+K** parancspalettáról. Válasszon ki egy sablont az azonnali használathoz — a workflow-sablonok a szerkesztőben nyílnak meg, a csomópont-sablonok pedig a cél kiválasztását kérik.

---

## Sablonok a Chatben

Kérdezheti az AI-t a sablonjaival kapcsolatban — ismeri a munkaterületén található összes sablont.

---

## Láthatóság

| Beállítás | Ki láthatja |
|---|---|
| Everyone | A platform összes felhasználója |
| Specific users | Az Ön által név szerint felsorolt felhasználók és/vagy az Ön által kiválasztott csapatok — minden csapattag hozzáférést kap |

Amikor **Specific users** beállítással oszt meg, hozzáadhat egyéni felhasználókat (név szerint) és csapatokat is. A csapattagok látják a sablont a Sablonok lapon, és használhatják azt.

---

## Kapcsolódó

- [Teams](../reference/teams.md) – Sablonok megosztása csapatokkal
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Rövid oldalútmutató az irányítópult lapjaihoz
