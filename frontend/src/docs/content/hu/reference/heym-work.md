# Heym Work

A **Heym Work** egy második felület az üzleti csapatok számára, amely a Heym platformra épül. A felhasználók saját szavaikkal írnak le egy feladatot, válaszolnak néhány kérdésre, és megkapják a Heym által felépített és tesztelt workflow-t. A kifejezetten számukra tervezett oldalakon dolgoznak, felülvizsgálatokat kezelnek, és minden futtatást a felelős nevével ellátva látnak. A Heym minden feladatot a háttérben hajt végre.

A Heym Work külön tárolóként fut a Heym mellett, a Heym csapatától származó külön licenccel. További információkért és próbaverzió igényléséhez látogasson el a [heym.run/enterprise](https://heym.run/enterprise) oldalra. Tekintse meg a [Heym Work bemutató videót](https://youtu.be/5Z2gGo6bcpU) egy kétperces összefoglalóért.

## Mit kapnak az üzleti csapatok

| Terület | Funkció |
|---------|---------|
| **Chat** | Írja le a feladatot szövegesen vagy hanggal. A Heym megkérdezi a szükséges adatokat, felépíti a workflow-t, teszteli, és Ellenőrzött jelöléssel látja el. |
| **Flows** | A szerkesztők vászon helyett választási lehetőségekből építenek fel egy flow-t: mi indítja el, egy opcionális AI-vázlat és műveletek a Slackben, a Google Sheetsben és az e-mailben. A Slackből érkező válaszok folytatják a futást, és a jóváhagyások a Tevékenységben is várakoznak. Lásd: [Flows](#flows). |
| **Oldalak** | Rögzített widget-oldalak: számadatok, diagramok, állapotjelző címkékkel ellátott táblázatok, fájlfeltöltési mezők és jóváhagyások. Egy táblázat sora saját részletező oldalt nyithat meg. |
| **Jóváhagyások** | A [Human-in-the-Loop](./human-in-the-loop.md) lépésekből érkező felülvizsgálatok a Tevékenység lapon és az oldalakon várnak, Jóváhagyás, Módosítás kérése és Elutasítás lehetőségekkel. |
| **Tevékenység** | Minden futtatás, feltüntetve az indító személyt és a végrehajtó példányt. |
| **Szerepkörök** | Tulajdonos, Szerkesztő és Megtekintő. A bejelentkezés a Heym által már használt [Single Sign-On](./sso.md) rendszeren keresztül történik. |
| **Iparági kiadások** | A jogi, oktatási, pénzügyi, logisztikai, energetikai és e-kereskedelmi kiadások az adott ágazatra szabott oldalakkal, mintákkal és workflow-kkal nyílnak meg. |

## Flows

A **Flows** a Heym Work menüjében található a Szerkesztők és Tulajdonosok számára. A flow csomópontok helyett választási lehetőségekből áll, és a Heym Work a Heym API-n keresztül szokásos Heym workflow-ként menti el a létrehozó személy nevében. A Heym hozzáférési szabályai, a szerkesztési előzmények és a trigger-szinkronizálás ugyanúgy érvényesek, mint a szerkesztőben, és minden futás úgy jelenik meg a Tevékenységben, mint bármelyik másik.

| Rész | Választási lehetőségek |
|---|---|
| **Mi indítja el** | Igény szerint, ütemezés szerint, Slack üzenetre, Google Sheets lap változásakor (sorok hozzáadva, módosítva vagy törölve), vagy amikor e-mail érkezik egy beérkező levelek mappába. A táblázat- és e-mail triggerek 1, 5, 15 vagy 60 percenként ellenőriznek. |
| **AI-vázlat** (opcionális) | Egy modell és az utasítások szöveggé alakítják a flow-t elindító eseményt a későbbi lépésekhez. Egy olyan flow, amely nem táblázatból vagy e-mailből indul, először beolvashatja a legutóbbi Slack üzeneteket egy csatornából vagy szálból. |
| **Mi történik ezután** | Műveletek sorrendben a három eszköz bármelyikében, függetlenül attól, hogy mi indította el a flow-t. **Slack:** csatornaüzenet, közvetlen üzenet, űrlap, üzenet gombokkal, jóváhagyás, válasz a szálban, üzenetfrissítés és végeredmény. **Google Sheets:** sor hozzáadása vagy a megváltozott sor frissítése. **E-mail:** e-mail küldése. |

- **A válaszok folytatják a futást.** Egy jóváhagyás, gombok vagy egy űrlap szünetelteti a futást, amíg valaki nem válaszol a Slackben. A jóváhagyás a Tevékenységben is várakozik, és a döntés bármelyik helyen eltávolítja a gombokat a Slack üzenetből. A későbbi Slack lépések az első üzenet szálában maradnak.
- **Egyetlen Kapcsolatok kártya.** Minden flow megjeleníti a Slack munkaterületet, a Google Sheets fiókot és a postaládákat, amelyekből olvas és amelyekkel küld. Ezek Heym hitelesítő adatok: **Slack Bot** (bot token, `xoxb-…`), **Google Sheets**, **IMAP** és **SMTP**; a hiányzó hitelesítő adat közvetlenül magából a flow-ból adható hozzá.
- **Egyetlen Slack alkalmazás minden flow-hoz.** A Slack alkalmazásban állítsa az Interaktivitási kérelem URL-jét a következőre: `https://<az Ön Heymje>/api/slack/interactions/<hitelesítő azonosító>`, az Esemény-előfizetések kérelem URL-jét pedig a következőre: `https://<az Ön Heymje>/api/slack/events/<hitelesítő azonosító>`. A Heym Work mindkettőt megjeleníti a kiválasztott kapcsolathoz. Az adott hitelesítő adathoz tartozó összes flow megosztja ezeket.
- **A Slack triggerek kiválasztják, mit figyelnek:** üzeneteket a csatornákon és a közvetlen üzenetekben, közvetlen üzeneteket a botnak, a bot említéseit vagy üzeneteket egyetlen csatornán. A bot saját bejegyzései soha nem indítanak el flow-t.
- **Követelmények.** A Flows a Heym 0.0.131 vagy újabb verzióját igényli.

A flow által felépített lépések ugyanazok a csomópontok, amelyeket a vásznon használhat: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) és [Cron](../nodes/cron-node.md).

## A Heym Work csatlakoztatása

A teljes beállítási folyamatot – az első parancstól a kezdőlapig – tekintse meg a [telepítési videóban](https://youtu.be/zXGfg1HPSLk).

A kapcsolat a **Beállítások → Heym Work** menüpontban konfigurálható. A lap csak azon példányadminisztrátorok számára jelenik meg, akik szerepelnek a `HEYM_ADMIN_EMAILS` listában.

| Mező | Funkció |
|------|---------|
| **Heym Work címe** | Ahol a Heym Work fut, például `https://work.example.com`. A bejelentkezés ide irányít vissza. Kattintson a **Mentés** gombra. |
| **Integrációs kulcs** | A **Kulcs generálása** gomb létrehozza azt a kulcsot, amelyet a Heym Work használ minden Heym felé küldött kéréshez. Csak egyszer jelenik meg egy másolás gomb kíséretében. A Heym kizárólag a kulcs hash értékét tárolja. |
| **Heym Work engedélyezése** | Bekapcsolja a kapcsolatot. Előzetesen megköveteli a cím és a kulcs megadását. |
| **Iparági és csapatkiadások** | A jogi, oktatási, pénzügyi, logisztikai, energetikai és e-kereskedelmi kiadások, valamint a vállalati csapatok számára készült IT, értékesítési, marketing és HR kiadások az adott munkához kapcsolódó oldalakkal, mintákkal és workflow-kkal nyílnak meg. |

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
