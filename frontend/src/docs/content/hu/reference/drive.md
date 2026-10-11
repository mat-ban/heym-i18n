# Drive

A Drive fül központi helyet biztosít a skillek által generált összes fájl megtekintéséhez, kezeléséhez és megosztásához.

## A Drive elérése

Navigáljon a **Drive** fülre az irányítópulton. Az összes, a workflow-skillek által generált fájl itt jelenik meg, létrehozási dátum szerint rendezve.

## Fájllista

A fájllista a következőket mutatja:

- **Név** – Eredeti fájlnév típusra jellemző ikonnal
- **Típus** – A fájl MIME-típusa (pl. pdf, csv, docx)
- **Méret** – Ember által olvasható fájlméret
- **Forrás** – Annak a csomópontnak a címkéje, amely a fájlt generálta
- **Dátum** – A fájl létrehozásának időpontja
- **Műveletek** – Letöltés, megosztás és törlés gombok

## Tömeges műveletek

Minden Ön által birtokolt fájl sorának elején található egy jelölőnégyzet. A csapaton keresztül Önnel megosztott fájlok csak olvashatók, és nem jelölhetők ki. Jelöljön ki több fájlt (a Shift-kattintás egy összefüggő tartományt jelöl ki; a fejléc jelölőnégyzete az egész oldalt kijelöli), hogy megjelenjen a lista feletti tömeges műveletsáv, majd kattintson a **Tömeges műveletek** elemre egy olyan párbeszédablak megnyitásához, amely ugyanazt a beállítást alkalmazza minden kijelölt fájlra:

- **Megosztás az összes csapatommal** / **Csapatmegosztás eltávolítása** – egyszerre váltja a csapatmegosztást az összes kijelölt fájl esetében
- **Megosztási hivatkozás létrehozása minden fájlhoz** – minden kijelölt fájlon létrehoz egy megosztási hivatkozást ugyanazokkal a lejárati, jelszó- és maximális letöltési értékekkel

A párbeszédablak jelzi, hogy hány fájlra alkalmazta a beállítást; a nem Ön által birtokolt fájlok kimaradnak. A lista alján található oldalankénti sorszám-választó (25 / 50 / 100 / **Összes**) lehetővé teszi, hogy több fájlt töltsön be egy oldalra, így a teljes Drive-on át tud kijelölést végezni.

## Fájlok megosztása

Kattintson a **Megosztás** ikonra a megosztási párbeszédablak megnyitásához. Fájlonként több megosztási hivatkozást is létrehozhat különböző konfigurációkkal, és opcionálisan megoszthatja a fájlt a jelenlegi csapataival.

### Nyilvános hivatkozás (Token-alapú)

Hozzon létre egy megosztási hivatkozást jelszó nélkül. Bárki, aki rendelkezik a hivatkozással, letöltheti a fájlt.

### Jelszóval védett hivatkozás (Basic Auth)

Állítson be jelszót a megosztás létrehozásakor. A letöltési URL HTTP Basic Authentication-t használ – a böngészők a hivatkozás megnyitásakor kérik a felhasználónevet (`file`) és a jelszót.

### Hivatkozás beállításai

- **Lejárat (óra)** – Opcionálisan állítson be lejárati időt
- **Max. letöltések** – Opcionálisan korlátozza a letöltések számát
- Mindkettő kombinálható a maximális kontroll érdekében

### Megosztás a csapataimmal

Engedélyezze a **Megosztás a csapataimmal** beállítást, hogy csak olvasási hozzáférést adjon minden olyan csapatnak, amelynek jelenleg tagja. A csapattagok láthatják és letölthetik a fájlt a Drive-ból, valamint használhatják az olvasásorientált Drive csomópont-műveleteket, de csak a fájl tulajdonosa törölheti a fájlt, hozhat létre vagy vonhat vissza nyilvános hivatkozásokat, illetve módosíthatja a jelszót/TTL-t/letöltési korlátokat.

A beállítás fájlspecifikus. Ha később csatlakozik egy másik csapathoz vagy létrehoz egyet, kapcsolja be újra a megosztást, vagy futtassa a Drive csomópont `shareWithMyTeams` műveletét, hogy hozzáadja azt a csapatot. A `unshareWithMyTeams` használatával eltávolíthatja a csapatmegosztásokat a fájlból egy workflow-ban.

### Megosztások kezelése

A megosztási párbeszédablak az összes meglévő megosztási hivatkozást mutatja a következőkkel:
- Aktuális letöltésszám
- Lejárati állapot
- Hogy engedélyezve van-e a Basic Auth
- Másolás és visszavonás gombok

## Fájlhivatkozások a Chatben és a Portalon

Amikor egy skill fájlokat generál egy workflow-futtatás során a Portal chaten vagy a Quick Draweren keresztül, a letöltési hivatkozások automatikusan megjelennek a válaszban. A felhasználók kattintással közvetlenül letölthetik.

## Tárolás

A generált fájlok a szerver fájlrendszerén a `data/files/` alatt tárolódnak. Docker-telepítéseknél ez perzisztencia érdekében kötetként van csatolva.

## Fájlok kezelése workflow-kból

A [Drive csomópont](../nodes/drive-node.md) lehetővé teszi a Drive fájlok programozott kezelését egy workflow-n belül. Használja a következőkhöz:

- **Listázás** – fájlok listázása és metaadatok visszaadása, például fájlnév, MIME-típus, méret, forrás és letöltési URL
- **Törlés** – fájl törlése, miután eljuttatta a felhasználóhoz
- **Megosztás vagy megosztás visszavonása a csapataival** – hogy a csapattagok csak addig olvashassák és tölthessék le, amíg a csapatmegosztás létezik
- **Jelszó beállítása** a letöltési hivatkozáson
- **TTL beállítása**, hogy a hivatkozás N óra után lejárjon
- **Max. letöltések** korlátjának beállítása

Egy fájl más formátumba konvertálása a [Converter csomópont](../nodes/converter-node.md) feladata, `conversion: "fileConvert"` beállítással. Beolvassa a Drive fájlt, és a konvertált eredményt új fájlként tárolja.

Hivatkozzon a fájlra annak azonosítójával a skill kimenetéből: `$agentLabel._generated_files[0].id`

A konfigurációs részletekért lásd a [Drive csomópont dokumentációját](../nodes/drive-node.md).

## Drive fájlok olvasása skillekből

Az ügynök-skillek a skill-kártya **Enable Drive files** beállításával kapcsolhatják be a Drive-olvasást. Ha engedélyezve van, a skill futtatókörnyezete tartalmaz egy generált `heym_drive.py` segédfájlt. A skill kódja importálhat segédfüggvényeket, például `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` és `list_drive_files`.

A Drive-olvasás azokra a fájlokra korlátozódik, amelyek a workflow szereplője számára elérhetők: a birtokolt fájlokra és a szereplővel csapatokon keresztül megosztott fájlokra. Pontos kereséshez használjon fájl-azonosítót, vagy pontos fájlnevet, ha a felhasználó név szerint hivatkozik egy fájlra. A fájlnévkeresés az adott névvel rendelkező legújabb elérhető fájlt adja vissza; a `list_drive_files(filename="...")` az összes találatot visszaadja.

## Kapcsolódó

- [Drive csomópont](../nodes/drive-node.md) – Workflow-műveletek (listázás, lekérés, törlés, jelszó, TTL, max. letöltések, csapatmegosztás)
- [Drive fül](../tabs/drive-tab.md) – Fájlok böngészése az irányítópulton
- [Fájlgenerálás](./file-generation.md) – Hogyan jönnek létre a `_generated_files` és a letöltési URL-ek

## Karbantartás
A lejárt megosztási tokenek naponta automatikusan törlődnek. Maguk a fájlok addig maradnak meg, amíg manuálisan nem törlik őket a Drive fülön. A **Clear All** használatával egyetlen művelettel törölheti az összes fájlt és azok megosztási hivatkozásait.
