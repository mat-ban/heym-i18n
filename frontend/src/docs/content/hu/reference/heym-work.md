# Heym Work

A **Heym Work** egy második felület az üzleti csapatok számára, amely a Heym platformra épül. A felhasználók saját szavaikkal írnak le egy feladatot, válaszolnak néhány kérdésre, és megkapják a Heym által felépített és tesztelt workflow-t. A kifejezetten számukra tervezett oldalakon dolgoznak, felülvizsgálatokat kezelnek, és minden futtatást a felelős nevével ellátva látnak. A Heym minden feladatot a háttérben hajt végre.

A Heym Work külön tárolóként fut a Heym mellett, a Heym csapatától származó külön licenccel. További információkért és próbaverzió igényléséhez látogasson el a [heym.run/enterprise](https://heym.run/enterprise) oldalra. Tekintse meg a [Heym Work bemutató videót](https://youtu.be/5Z2gGo6bcpU) egy kétperces összefoglalóért.

## Mit kapnak az üzleti csapatok

| Terület | Funkció |
|---------|---------|
| **Chat** | Írja le a feladatot szövegesen vagy hanggal. A Heym megkérdezi a szükséges adatokat, felépíti a workflow-t, teszteli, és Ellenőrzött jelöléssel látja el. |
| **Oldalak** | Rögzített widget-oldalak: számadatok, diagramok, állapotjelző címkékkel ellátott táblázatok, fájlfeltöltési mezők és jóváhagyások. Egy táblázat sora saját részletező oldalt nyithat meg. |
| **Jóváhagyások** | A [Human-in-the-Loop](./human-in-the-loop.md) lépésekből érkező felülvizsgálatok a Tevékenység lapon és az oldalakon várnak, Jóváhagyás, Módosítás kérése és Elutasítás lehetőségekkel. |
| **Tevékenység** | Minden futtatás, feltüntetve az indító személyt és a végrehajtó példányt. |
| **Szerepkörök** | Tulajdonos, Szerkesztő és Megtekintő. A bejelentkezés a Heym által már használt [Single Sign-On](./sso.md) rendszeren keresztül történik. |
| **Iparági kiadások** | A jogi, oktatási, pénzügyi, logisztikai, energetikai és e-kereskedelmi kiadások az adott ágazatra szabott oldalakkal, mintákkal és workflow-kkal nyílnak meg. |

## A Heym Work csatlakoztatása

A teljes beállítási folyamatot – az első parancstól a kezdőlapig – tekintse meg a [telepítési videóban](https://youtu.be/zXGfg1HPSLk).

A kapcsolat a **Beállítások → Heym Work** menüpontban konfigurálható. A lap csak azon példányadminisztrátorok számára jelenik meg, akik szerepelnek a `HEYM_ADMIN_EMAILS` listában.

| Mező | Funkció |
|------|---------|
| **Heym Work címe** | Ahol a Heym Work fut, például `https://work.example.com`. A bejelentkezés ide irányít vissza. Kattintson a **Mentés** gombra. |
| **Integrációs kulcs** | A **Kulcs generálása** gomb létrehozza azt a kulcsot, amelyet a Heym Work használ minden Heym felé küldött kéréshez. Csak egyszer jelenik meg egy másolás gomb kíséretében. A Heym kizárólag a kulcs hash értékét tárolja. |
| **Heym Work engedélyezése** | Bekapcsolja a kapcsolatot. Előzetesen megköveteli a cím és a kulcs megadását. |
| Állapot | **Utoljára látva**, **Work verzió** és **Licenc**, a Heym Work legutóbbi jelentése alapján. |

Ezután nyissa meg a Heym Work címét, és fejezze be a beállítást:

1. **Licenc**: adja meg a Heym csapatától kapott licenckulcsot.
2. **Heym**: adja meg a Heym címét és az integrációs kulcsot.
3. **Tulajdonos**: jelentkezzen be a Heym Work tulajdonosként megjelölt fiókkal.

Megnyílik a kezdőlap, készen a csapat munkájára.

### A kulcs rotálása

A **Kulcs rotálása** gomb lecseréli az integrációs kulcsot. A Heym Work működése leáll, amíg az új kulcsot ott meg nem adják, és a Heym Work rendszerbe bejelentkezett összes felhasználó kijelentkezik. Használja ezt a funkciót, ha a kulcs kiszivároghatott, vagy ha egy hozzáféréssel rendelkező munkatárs távozik.

### A kapcsolat letiltása

A kapcsolat megszakításához kapcsolja ki a **Heym Work engedélyezése** opciót. A Heym Work ekkor ismét kérni fogja a Heym kulcsát. A Heym mindkét esetben zavartalanul futtat minden workflow-t, ütemezést és webhookot.

## Biztonsági modell

- **Minden módosítás a Heym rendszeren halad át.** A Heym Work a Heym adatbázisából olvassa a megjelenített adatokat, és minden műveletet kulccsal védett csatornán továbbít a Heym felé, ahol a Heym saját hozzáférési szabályait érvényesíti. A Heym Work külön `heym_work` sémában tárolja a saját adatait.
- **A kulcs hash formájában tárolódik.** A Heym összehasonlítja a megadott kulcs hash értékét, és magát a nyers kulcsot soha nem menti el.
- **A bejelentkezés a Heym feladatköre marad.** A felhasználók a Heym-en keresztül jelentkeznek be a saját identitásszolgáltatójukkal, ha az [SSO](./sso.md) aktív.
- **A változások naplózásra kerülnek.** A kapcsolat mentése és a kulcs rotálása `work_integration.update` és `work_integration.key_rotate` bejegyzéseket ír az [auditnaplóba](./audit.md).

## Licencelés

A Heym Work saját, a Heym csapata által kiállított licenckulcsot igényel. A Heym Work naponta elküldi a heym.run számára a licencazonosítót, a telepítési azonosítót, az elmúlt 30 nap aktív felhasználóinak számát, a tagok teljes számát, az elmúlt 24 óra futtatásainak számát, valamint a Heym és Heym Work verzióit. A workflow tartalmak, bemenetek, kimenetek és hitelesítő adatok kizárólag a helyi kiszolgálókon maradnak.

Ha a napi szinkronizálás 30 napon keresztül meghiúsul, 14 napos türelmi időszak kezdődik, amely után a Heym Work felület kulcsot kér a Tulajdonostól. A próbaverzió az utolsó napig érvényes, és újraindul, amint a Heym csapata meghosszabbítja (telepítésenként egy próbaverzió engedélyezett). Maga a Heym mindvégig folyamatosan működik. Az internet-hozzáférés nélküli hálózatok az enterprise@heym.run címen elérhető offline licencet használhatnak.

## Videók

Minden Heym Work videó megtalálható a [Heym Work lejátszási listában](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Kapcsolódó témakörök

- [Enterprise](./enterprise.md): Kereskedelmi licencelés és támogatás
- [Single Sign-On](./sso.md): A Heym Work által használt bejelentkezési rendszer
- [Human-in-the-Loop](./human-in-the-loop.md): A Heym Work felületen megjelenő jóváhagyási lépések
- [Auditnaplózás](./audit.md): A kapcsolat módosításakor keletkező bejegyzések
- [Beállítások](./user-settings.md): A Heym Work fül elérhetősége
