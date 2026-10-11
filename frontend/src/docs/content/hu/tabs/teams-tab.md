# Teams lap

A **Teams** lap lehetővé teszi csapatok létrehozását és kezelését workflow-k, hitelesítési adatok, változók, vektortárolók és Drive fájlok megosztásához felhasználói csoportokkal.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

## Csapat létrehozása

1. Kattintson az **Új csapat** elemre
2. Adjon meg egy nevet és opcionálisan egy leírást
3. Kattintson a **Létrehozás** gombra

Ön automatikusan a csapat létrehozója és első tagja lesz.

## Tagok kezelése

- **Tag hozzáadása** – Adjon meg egy felhasználói e-mail-címet a csapat részleteit tartalmazó párbeszédablakban, majd kattintson a **Hozzáadás** gombra
- **Tag eltávolítása** – Kattintson a tag melletti X jelre (a létrehozó nem távolítható el)
- **Csapat szerkesztése** – A létrehozók szerkeszthetik a nevet és a leírást
- **Csapat törlése** – A létrehozók törölhetik a csapatot; a csapattal való összes megosztás megszűnik
- **Megosztott erőforrások** – A csapat részleteit tartalmazó párbeszédablak megjeleníti a csapattal megosztott workflow-kat, hitelesítési adatokat, változókat, vektortárolókat, Drive fájlokat, workflow sablonokat és csomópont sablonokat. Kattintson egy workflow-ra a szerkesztőben való megnyitáshoz; a többi erőforráshoz váltson a megfelelő lapra.

## Megosztás csapatokkal

Erőforrások megosztása csapatokkal az alábbi helyekről:

- **Workflow-k** – Megosztás párbeszédablak a workflow szerkesztőben
- **Workflow sablonok** – Megosztás párbeszédablak workflow sablon létrehozásakor/szerkesztésekor (láthatóság: Adott felhasználók)
- **Csomópont sablonok** – Megosztás párbeszédablak csomópont sablon létrehozásakor/szerkesztésekor (láthatóság: Adott felhasználók)
- **Hitelesítési adatok** – Megosztás párbeszédablak a Hitelesítési adatok lapon
- **Változók** – Megosztás párbeszédablak a Változók lapon
- **Vektortárolók** – Megosztás párbeszédablak a Vektorok lapon
- **Irányítópultok** – Irányítópult beállítások az Irányítópult lapon (olvasás vagy írás)
- **Drive fájlok** – Megosztás párbeszédablak a Drive lapon vagy a Drive csomópont `shareWithMyTeams` / `unshareWithMyTeams` műveletei

Amikor egy csapattal oszt meg valamit, minden csapattag hozzáférést kap. A részletekért lásd a [Teams](../reference/teams.md) oldalt.

Amikor egy workflow-t oszt meg egy csapattal, ossza meg ugyanazzal a csapattal azokat a hitelesítési adatokat és al-workflow-kat is, amelyektől az adott workflow függ. A workflow-hoz való hozzáférés önmagában nem biztosít hozzáférést a hitelesítési adatokhoz vagy a gyermek workflow-khoz.

## Chat integráció

A [Chat lap](./chat-tab.md) AI asszisztense képes listázni a csapatait. Kérdezze meg, hogy „my teams", hogy lássa, mely csapatokhoz tartozik.

## Kapcsolódó tartalmak

- [Teams](../reference/teams.md) – Teams referencia és megosztási modell
- [Hitelesítési adatok megosztása](../reference/credentials-sharing.md) – Hitelesítési adatok megosztása felhasználókkal és csapatokkal
- [Workflow szervezés](../reference/workflow-organization.md) – Mappák és megosztás
- [Kontextuális bemutató](../reference/contextual-showcase.md) – Kompakt oldalútmutató az irányítópult felületeihez
