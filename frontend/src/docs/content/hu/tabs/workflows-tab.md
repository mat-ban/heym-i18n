# Workflow-k fül

A **Workflow-k** fül az alapértelmezett irányítópult-nézet. Itt látható a workflow-listája, a mappastruktúra, valamint innen hozhat létre, szerkeszthet és rendezhet workflow-kat.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ A Workflow-k demó megtekintése</a></p>

## Chat indítása

A workflow-lista felett egy chat-doboz található, amely név szerint üdvözli Önt, és megkérdezi, mit szeretne automatizálni. Írjon be egy promptot, opcionálisan csatoljon egy fájlt, majd válassza ki a kívánt hitelesítési adatokat és modellt. Mindkét legördülő lista kereshető, és az [AI alapértelmezésekkel](../reference/user-settings.md) indul.

A küldés új beszélgetést hoz létre, és megnyitja azt a [Chat fülön](./chat-tab.md), ahol a válasz streamelve érkezik. A támogatott mellékletek szöveges fájlok, képek és PDF-ek, üzenetenként egy, ugyanúgy, mint a chat-szerkesztőben.

Ha még nem rendelkezik LLM hitelesítési adatokkal, a doboz egy hivatkozást jelenít meg a [Hitelesítési adatok fülre](./credentials-tab.md), és a küldés letiltva marad.

Kattintson az **x** gombra a doboz elrejtéséhez. Ekkor egy **Ask AI** gomb jelenik meg a Workflow-k címsor mellett, amely visszahozza azt. A választás a böngészőben kerül megjegyzésre.

## Workflow-lista

A lista kétpaneles nézet: a workflow-k és mappák a bal oldalon, a kiválasztott workflow előnézete a jobb oldalon.

- Minden sor mutatja a workflow ikonját, nevét, leírását, a legutóbbi frissítés időpontját és egy [állapotjelző címkét](#workflow-status)
- A workflow-k lehetnek a gyökérben vagy mappákban, a kitűzött workflow-k pedig a saját **Kitűzött** csoportjukban jelennek meg felül
- **Kattintson** egy sorra a kiválasztáshoz és az előnézet betöltéséhez a jobb oldalon
- **Kattintson duplán** egy sorra, vagy nyomja meg az **Enter** billentyűt, amikor az fókuszban van, hogy megnyissa a [szerkesztőben](../getting-started/quick-start.md)
- Használja a **Ctrl+kattintást** (vagy **Cmd+kattintást**) új lapon való megnyitáshoz
- Minden sor a jobb oldalon hordozza a szerkesztési, másolási, kitűzési és törlési műveleteit. Telefonokon ezek rejtve vannak, hogy a név a teljes szélességet kitöltse; ott **hosszan nyomja meg** a sort a műveletpanel megnyitásához
- Tűzze ki a gyakran használt workflow-kat a [Gyorselőhívóba](../reference/quick-drawer.md), hogy gyorsan futtathassa őket a Workflow-k fülről és más belső oldalakról

## Workflow előnézet

Egy workflow kiválasztása kitölti a lista melletti előnézeti panelt. A 1280px-nél keskenyebb képernyőkön ugyanez a panel a képernyő aljáról nyílik meg lapként.

A panel a következőket mutatja:

- A workflow nevét, hogy ki hozta létre és mikor, valamint a legutóbbi szerkesztés időpontját
- **Workflow megnyitása** – megnyitja a workflow-t a szerkesztőben
- **Futtatás most** – megnyitja a workflow-t a [Gyorselőhívóban](../reference/quick-drawer.md), ahol kitöltheti a bemeneteit és elindíthatja a futtatást anélkül, hogy elhagyná a listát
- **Leírás** – a workflow leírása
- **Trigger konfiguráció** – a cron workflow ütemezése, vagy az eseményvezérelt workflow figyelő triggerje. A HTTP-n keresztül meghívott workflow-k a nyers endpoint és hitelesítési szöveg helyett egy **cURL másolása** gombot jelenítenek meg: ez egy teljes kérést másol a megfelelő URL-lel, fejlécekkel, hitelesítési helyőrzővel és a workflow bemeneti mezőiből felépített törzstel. Amikor a workflow közzétesz egy [portált](../reference/portal.md), annak nyilvános chat-hivatkozása is itt jelenik meg
- **Legutóbbi futtatás részletei** – a legutóbbi futtatás eredménye és időtartama, vagy egy megjegyzés, hogy a workflow még soha nem futott
- **Workflow lépések és alügynökök** – a csomópontok végrehajtási sorrendben, mindegyik a modelljével, műveletével vagy ütemezésével, valamint egy ponttal, amely mutatja, hogy aktív-e. Egy lépés kiválasztása megnyitja azt a csomópontot a szerkesztőben, a tulajdonságpanel már megnyitva

A panel a lista mellett rögzítve marad, miközben Ön görget, így egy hosszú workflow-listában is olvasható marad.
## Instance adminisztráció

A `HEYM_ADMIN_EMAILS` listában szereplő fiókok megnyithatják, szerkeszthetik, megtekinthetik a futtatási előzményeket és törölhetik az instance bármely workflow-ját anélkül, hogy megosztásra vagy tulajdonjog-átruházásra lenne szükség. A beállítás egy vesszővel elválasztott e-mail-címekből álló lista, amelynél a rendszer nem tesz különbséget a kis- és nagybetűk között. Az üres lista senkinek sem biztosítja ezt a hozzáférést. A módosítás után indítsa újra a backendet.

Az adminisztrátorok látják a tulajdonos e-mail-címét a workflow-listában, és kereshetnek arra a címre. Válasszon ki egy workflow-t, hogy megnyissa az **Instance adminisztráció** panelt az előnézetében:

1. A **Trigger szüneteltetése** csak a Cron csomópontot tartalmazó workflow-knál jelenik meg. Egy szokásos, verziózott mentésen keresztül letiltja a workflow Cron és egyéb automatikus trigger csomópontjait. A meglévő futtatások befejeződhetnek. A manuális, API-, portál- és al-workflow hívások továbbra is elérhetők; ez a művelet nem a teljes workflow-ra vonatkozó végrehajtási zár.
2. A gomb **Trigger folytatása** feliratra változik, amíg szüneteltetve van, az oldal újratöltése után is. A folytatás újra engedélyezi az adminisztrátor által szüneteltetett triggereket, és változatlanul hagyja a már letiltott triggereket. A régebbi, mentett adminisztrátori szüneteltetési állapot nélküli szüneteltetett workflow-k esetében a folytatás engedélyezi az automatikus triggereket.
3. Használja a workflow sorában a **Workflow törlése** műveletet, miután a futtatások lezárultak. A törlés konfliktust ad vissza, amíg futó, sorban álló vagy felülvizsgálatra váró munka van. Az ütemezett törlés ugyanezt az ellenőrzést alkalmazza.

Szüneteltesse a triggereket, és hagyja, hogy a meglévő futtatások befejeződjenek a törlés előtt. Egy már elküldött trigger a szüneteltetés után is befejeződhet. Akkor használja a törlést, amikor a workflow-nak már nem szabad hívhatónak lennie.

A csak tulajdonos számára elérhető webhook titkos kulcsok és hitelesítési beállítások megőrzik a meglévő védelmüket. Az adminisztráció nem ruházza át a tulajdonjogot, és nem osztja meg a tulajdonos hitelesítési adat-rekordjait. Az adminisztrátori szüneteltetési, folytatási, törlési és ütemezési műveletek megjelennek az [auditnaplóban](../reference/audit.md) az eljáró adminisztrátorral és a workflow tulajdonosával együtt.

## Workflow állapota

Minden sor egy állapotjelvényt visel, amely a workflow trigger csomópontjaiból, annak élő futtatási állapotából, valamint — a trigger csomóponttal nem rendelkező workflow-k esetében — a legutóbbi futtatás elindításának módjából származik:

| Állapot | Jelentés |
| --- | --- |
| **Fut** | A workflow-nak éppen most van folyamatban lévő végrehajtása |
| **Ütemezett** | Aktív [cron](../nodes/cron-node.md) triggerrel rendelkezik |
| **Figyel** | Aktív eseménytriggerrel rendelkezik, például Slack, Telegram, IMAP vagy WebSocket triggerrel |
| **Szüneteltetve** | Vannak trigger csomópontjai, de mindegyikük le van tiltva |
| **API** | Nincsenek trigger csomópontjai, és legutóbb az execute endpointjára érkező HTTP-hívás futtatta |
| **SubWorker** | Nincsenek trigger csomópontjai, és legutóbb egy szülő workflow al-workflow-ként futtatta |
| **Portál** | Nincsenek trigger csomópontjai, és legutóbb a [portáljáról](../reference/portal.md) futtatták |
| **WEB** | Nincsenek trigger csomópontjai, és egyetlen terminálja egy [HTML kimeneti mapper](../nodes/html-output-mapper-node.md), így a hívása egy renderelt weboldalt ad vissza |
| **Manuális** | Nincsenek trigger csomópontjai, és soha nem futott, vagy a legutóbbi futtatása máshonnan indult |
| **Ütemezett eltávolítás** | [Törlésre van ütemezve](../reference/workflow-organization.md) |

Az API, a SubWorker és a Portál jelvények a workflow [futtatási előzményeinek](./logs-tab.md) egyetlen legutóbbi bejegyzését olvassák, így egy kétféleképpen hívott workflow azt mutatja, amelyik utolsóként következett be. A **WEB** ehelyett a gráfból kerül meghatározásra, így elsőbbséget élvez e hárommal szemben: egy oldalt kiszolgáló workflow WEB-et mutat akkor is, ha HTTP-n keresztül hívták. A trigger csomópontok mindig mindegyikük fölé kerekednek: egy cron workflow, amelyet valaki HTTP-n keresztül is hív, **Ütemezett** marad.

A keresőmező melletti **Állapot** legördülő menüvel csak egy állapotot jeleníthet meg. A legördülő menü felsorolja, hogy jelenleg hány workflow felel meg az egyes állapotoknak. Az állapotszűrő a mappák belsejébe is elér: az egyezést tartalmazó mappák automatikusan ki lesznek nyitva, az egyezést nem tartalmazók pedig rejtve maradnak, amíg törli a szűrőt.

## Aktív workflow-k

Asztali nézetben a felső eszköztár kör alakú jelvénye mutatja, hogy jelenleg hány workflow fut, és 10 másodpercenként automatikusan frissül. Kattintson egy nem nulla értékű jelvényre az aktív workflow-k listájának megnyitásához, amely görgetés előtt legfeljebb négy sort mutat. Válassza ki egy workflow nevét, hogy a szerkesztőt annak a futtatásnak az élő nézetéhez csatolja. A nulla értékű jelvény tájékoztató jellegű, és nem nyitható meg, a jelvény pedig mobil képernyőkön rejtve van.

## Keresés

A **Állapot** melletti workflow keresőmezővel, vagy a **Ctrl+F** (illetve **Cmd+F**) lenyomásával szűrheti a workflow-kat cím vagy leírás szerint. A mappákon belüli egyező workflow-k a mappák ágainak kinyitásával jelennek meg. A keresés törléséhez nyomja le az **Escape** billentyűt.
## Mappák

- Rendezze a workflow-kat [mappákba és almappákba](../reference/workflow-organization.md)
- Hozzon létre mappákat a **New Folder** gombbal, mindegyiknek adjon nevet és opcionális leírást, amely a neve alatt jelenik meg a listában
- Minden mappasor mutatja, hány workflow-t tartalmaz az almappákkal együtt, valamint az új almappa, átnevezés, ikon módosítása, ZIP-ként letöltés és törlés műveleteket. Telefonon a sor helyett egyetlen menügomb jelenik meg
- Húzzon egy workflow-t egy mappa vagy almappa fölé, hogy egy kártya méretű cél-előnézetet lásson. A
  kiemelt előnézet a teljes mappaútvonalat mutatja az elengedés előtt, és egy összecsukott
  mappa fölé húzva az rövid időre kinyílik, így elérheti a beágyazott mappákat.
- Húzza a workflow-kat mappák között vagy a gyökérbe. A húzott kártya szellemként látható marad,
  és az aktív cél kiemelve marad, miközben görget.
- Egy workflow visszahúzása a jelenlegi mappájába le van tiltva, és **Already in Folder** jelölést kap.
- Nevezze át a mappát, vagy módosítsa a leírását az átnevezés műveletből vagy a jobb gombos helyi menüből

## Workflow-k létrehozása

1. Kattintson a **New Workflow** gombra
2. Adjon meg egy nevet és opcionális leírást
3. A workflow a szerkesztőben nyílik meg

## Importálás

Húzzon egy JSON workflow-fájlt a workflow-területre egy új workflow létrehozásához. Az importált csomópontok és élek alapján jön létre a workflow; a név a JSON `name` mezőjéből vagy a fájlnévből származik. A JSON formátumról és az importálási beállításokról lásd a [Download & Import](../reference/download-import.md) oldalt.

## Megosztás

Nyissa meg a workflow-t a szerkesztőben, és kattintson a **Share** gombra, hogy e-mail-cím alapján hívjon meg felhasználókat, vagy ossza meg egy [team](./teams-tab.md) számára. Válassza a **Read** (megtekintés és futtatás) vagy a **Write** (szerkesztés is) lehetőséget minden felhasználóhoz vagy teamhez, és később módosítsa a bejegyzés melletti legördülő menüből. A hitelesítési adatok és az al-workflow-k nem oszthatók meg automatikusan; azokat külön ossza meg ugyanazokkal a felhasználókkal vagy teamekkel. Lásd a [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) és a [Credentials Sharing](../reference/credentials-sharing.md) oldalt.

## Szerkesztés és törlés

- **Edit** – Módosítsa a workflow nevét és leírását a sor szerkesztés műveletéből
- **Delete** – A workflow-k [törlésre vannak ütemezve](../reference/workflow-organization.md); a végleges eltávolítás előtt egy kukaterületre kerülnek

## Egyidejű szerkesztések

Mentéskor a rendszer elküldi azt a revíziót, amelyen a szerkesztései alapulnak, és a szerver elutasítja az írást, ha a workflow közben megváltozott — például mert egy csapattárs elmentette, vagy Ön ugyanazt a workflow-t egy második lapon nyitva hagyta. A Heym ekkor egy **Stale Workflow Detected** párbeszédablakot jelenít meg két lehetőséggel:

- **Cancel** – A nem mentett módosításait a szerkesztőben tartja, így egy másik lapon újratöltheti és összeegyeztetheti azokat
- **Override** – Mindenképpen ment, felülírva a másik személy verzióját

Egy workflow **futtatása** először elmenti azt, így ugyanezen az ellenőrzésen esik át. Ha a workflow közben megváltozott, a futtatás megáll a párbeszédablaknál ahelyett, hogy csendben felülírná: az **Override and Run** elmenti az Ön verzióját és elindítja a futtatást, a **Cancel Run** pedig mindkettőt elveti, és a szerkesztéseit érintetlenül hagyja.

Az ellenőrzés magának a mentési kérésnek a része, így nem igényel külön oda-vissza kommunikációt, és nincs olyan időablak, amelyben egy mentés kicsúszhatna alóla. Az alkalmazás más részeiből származó saját módosításai — egy átnevezés, egy beállításmódosítás, egy tulajdonságpanel-kapcsoló — soha nem számítanak ütközésnek.

## Command Palette

Nyomja meg a **Ctrl+K** (vagy **Cmd+K**) billentyűkombinációt a command palette megnyitásához. A következőket teheti:
- Workflow-k keresése név szerint
- Ugrás bármelyik [dashboard fülre](./credentials-tab.md)
- Legutóbbi workflow-k megnyitása

## Kapcsolódó

- [Quick Start](../getting-started/quick-start.md) – Építse meg az első workflow-ját
- [Workflow Organization](../reference/workflow-organization.md) – Mappák, almappák és ütemezett törlés
- [Workflow Structure](../reference/workflow-structure.md) – A workflow-k JSON formátuma
- [Download & Import](../reference/download-import.md) – Workflow-k exportálása és importálása JSON-ként
- [Portal](../reference/portal.md) – Workflow-k közzététele nyilvános chat felületekként
- [Board](./board-tab.md) – Workflow-k futtatása kanban kártyákról oszlopláncokon keresztül
- [Core Concepts](../getting-started/core-concepts.md) – Workflow-k, csomópontok és végrehajtás
- [Execution History](../reference/execution-history.md) – Korábbi futtatások megtekintése és Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Workflow-k rögzítése és futtatása a dashboardról, a dokumentációból és más, nem szerkesztő oldalakról
- [Contextual Showcase](../reference/contextual-showcase.md) – Rövid oldalútmutató a dashboard felületeihez
