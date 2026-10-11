# Drive lap

A Drive lap az összes olyan fájlt megjeleníti, amelyet a skillek a workflow-k során előállítottak.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ A Drive demó megtekintése</a></p>

## Áttekintés

A skillek által előállított fájlok (PDF, DOCX, CSV, képek stb.) automatikusan tárolásra kerülnek és megjelennek a Drive lapon. Minden fájl esetében látható a név, a típus, a méret, a forrás csomópont, a létrehozás dátuma és a csapattal való megosztás állapota.

## Funkciók

- **Keresés** – Fájlok szűrése név, típus vagy forrás csomópont szerint
- **Fájl ID másolása** – A fájl UUID azonosítójának vágólapra másolása, így az közvetlenül beilleszthető egy [Drive](../nodes/drive-node.md) vagy [Converter](../nodes/converter-node.md) csomópontba
- **Letöltés** – Hitelesített letöltés az Ön fájljaihoz és a csapatokon keresztül Önnel megosztott fájlokhoz
- **Megosztás** – Megosztható letöltési linkek létrehozása opcionális jelszóvédelemmel és lejárattal, vagy egy fájl írásvédett megosztása az aktuális csapataival
- **Törlés** – Fájlok és a hozzájuk tartozó megosztási linkek eltávolítása
- **Összes törlése** – Az összes fájl és a hozzájuk tartozó megosztási linkek törlése megerősítés után
- **Tömeges műveletek** – Több fájl kijelölése jelölőnégyzetekkel (Shift-kattintással tartomány kijelölése), majd ugyanazon művelet alkalmazása mindegyikre egyszerre
- **Lapozás** – Nagy fájlgyűjtemények böngészése, oldalankénti sorszám-választóval (25 / 50 / 100 / Összes)

## Tömeges műveletek

Az Ön tulajdonában lévő fájlok sorának elején egy jelölőnégyzet jelenik meg (a csapaton keresztül Önnel megosztott fájlok írásvédettek, és nem jelölhetők ki). Jelöljön ki több sort – vagy használja a fejléc jelölőnégyzetét az egész oldal kijelöléséhez, illetve **Shift-kattintással** jelöljön ki egy tartományt –, majd használja a lista felett megjelenő tömeges műveletsávot:

- **ZIP letöltése** – Az összes kijelölt fájl egyetlen ZIP archívumba csomagolása és letöltése
- **Tömeges műveletek** – Egyetlen párbeszédablak megnyitása, amely egy beállítást alkalmaz az összes kijelölt fájlra:
  - **Összes megosztása a csapataimmal** / **Csapatmegosztás eltávolítása** egy kattintással
  - **Megosztási link létrehozása minden fájlhoz** ugyanazon jelszó-, lejárat- és maximális letöltésszám-beállításokkal
- **Törlés** – Az összes kijelölt fájl és a hozzájuk tartozó megosztási linkek eltávolítása megerősítés után
- **Kijelölés törlése** – Minden kijelölés megszüntetése

A párbeszédablak jelzi, hogy hány fájlra alkalmazta a műveletet (a nem Ön tulajdonában lévő fájlok kihagyásra kerülnek). Az oldalankénti sorszám-választó **Összes** opciójával az összes fájl betölthető egy oldalra, és a teljes Drive-on átívelő kijelölés végezhető. A keresőmezőbe való beírás automatikusan **Összes**-re váltja az oldalankénti sorszám-választót, így a keresés minden fájlra kiterjed, nem csak az aktuális oldalra; a keresés törlése visszaállítja a korábbi beállítást.

## Megosztás

Megosztási linkek létrehozása a következőkkel:
- **Hitelesítés nélkül** – Nyilvános, token-alapú letöltési URL
- **Basic Auth** – Jelszóval védett link (felhasználónév: `file`)
- **Lejárat** – Opcionális időalapú lejárat
- **Letöltési korlátok** – Opcionális maximális letöltésszám

A **Megosztás a csapataimmal** bekapcsolása egy fájlon láthatóvá teszi azt minden olyan csapat számára, amelynek Ön jelenleg tagja. A megosztott csapattagok írásvédett hozzáférést kapnak; a kezelési műveletek kizárólag a tulajdonos számára maradnak elérhetők.

## Agent Skill hozzáférés

Az Agent csomóponton lévő skillek bekapcsolhatják a Drive fájlok olvasását. Amikor egy skill esetében az **Enable Drive files** be van kapcsolva, annak Python kódja a generált `heym_drive.py` segédfájlon keresztül fájl ID vagy pontos fájlnév alapján olvashatja az elérhető Drive fájlokat. A beállítás alapértelmezés szerint ki van kapcsolva.

A teljes részletekért lásd a [Drive referenciát](../reference/drive.md).

## Kapcsolódó

- [Drive csomópont](../nodes/drive-node.md) – Fájlok listázása, metaadatok lekérése, megosztás csapatokkal vagy a megosztási megkötések módosítása egy workflow-ból
- [Fájlgenerálás](../reference/file-generation.md) – Hogyan állítanak elő fájlokat a skillek
- [Drive referencia](../reference/drive.md) – Megosztási linkek, tokenek és tisztítás
- [Portál](../reference/portal.md) – Fájllinkek a portál chat válaszaiban
