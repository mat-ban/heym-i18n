# Terheléselosztás

Mutasson egy második Heym példányt ugyanarra a PostgreSQL adatbázisra, és az workerként csatlakozik. A háttérben futó workflow-k ezután az Ön által beállított százalékos arány szerint oszlanak meg a példányok között, így a UI-t és az API-t kiszolgáló gép nem az egyetlen gép, amely az összes workflow-t futtatja.

A példányok soha nem kommunikálnak egymással. A munkát a Postgres szállítja, így egy workernek nincs szüksége nyitott portra, tanúsítványra vagy visszavezető útvonalra a fő példány felé — kizárólag adatbázis-hozzáférésre.

## Szerepkörök

Az egyik példány a **main**, amelyet egy környezeti változó rögzít. Ez szolgálja ki a UI-t, az API-t, az MCP-t és a chat portált, valamint ez birtokolja a fájltárolást és a telepített pluginokat. Minden más példány **worker**: csak az adatbázist éri el, és háttérben futó futtatásokat hajt végre.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

A main szerepkör elkülönül a leader-választástól. A Heym már választ egy leadert a cluster egészében, amely a cron-t, a riasztások kiértékelését és az összeomlás utáni helyreállítást birtokolja; ha a main leáll, a vezetés néhány másodpercen belül egy workerre száll át, és az ütemezett futtatások továbbra is elindulnak. A main szerepkör nem mozdul el, mert a fájltárolás nem tud vele együtt mozogni.

## Mi hagyhatja el a main példányt

Az elhelyezést a workflow csomópontjai alapján dönti el a rendszer a futtatás megkezdése előtt. Egy futtatás a mainen marad, ha bármely csomópontja — beleértve az általa hívott al-workflow-kban lévő csomópontokat is — olyan erőforráshoz nyúl, amely csak egy gépen létezik:

| Csomópont | Miért marad a mainen |
|---|---|
| Codex, OpenCode Go | A coding-agent munkaterület a helyi lemezen marad, hogy egy utólagos futtatás folytatni tudja |
| Agent csatolt skill-lel | A skill kódja a Heym Drive-ot olvassa és írja |
| Drive, Converter, Google Drive | Generált fájlokat olvasnak és írnak |
| File Upload trigger | A feltöltés a main lemezére kerül |
| Send Email | A vállalati SMTP relay-ek jellemzően egy forráscímet engedélyeznek |
| Plugin csomópontok | A plugin egy példány lemezére van telepítve |

**Minden más elosztásra kerül** — beleértve a Code csomópontot, a Playwrightot és az Agent Python eszközöket. Minden példány ugyanazt az image-et futtatja a saját Docker socketjével, így a sandbox nem indok arra, hogy egy futtatás a mainen maradjon, márpedig ezek a termék leginkább CPU-igényes csomópontjai.

Egy olyan workflow, amelynek al-workflow-ját egy kifejezés választja ki, nem vizsgálható előre, ezért a mainen marad.

## A százalékok megválasztása

A súlyok egész számok, amelyek a **Settings → Instances** alatt állíthatók be. Ezek **az éppen munkát vállalni képes példányok közötti részesedések**, nem 100 százalékai: az ütemező a pool saját összegével oszt.

Ez a különbség azonnal megmutatkozik, amint egy példány kiesik. `Main 41, Worker A 26, Worker B 33` esetén a Worker B kikapcsolása egy 67-es poolt hagy, így a Main valójában 41/67 = **61%**-ot kap, a Worker A pedig 26/67 = **39%**-ot. A panel pontosan ezért nyomtatja ki a tényleges felosztást a táblázat alatt, és a mentést soha nem blokkolja az, hogy a számok nem adnak ki 100-at — csak azt a felosztást utasítja el, amelyben egyetlen engedélyezett példánynak sincs súlya.

Két további dolgot könnyű elrontani.

**Egy százalék nem a gépi teljesítmény részesedése.** Csak azokat a futtatásokat fedi le, amelyek a soron mennek keresztül. A UI és az API kiszolgálása, a szerkesztő és a portál futtatásainak streamelése, valamint a fájlfeltöltések kezelése mind a main munkája, és ebből semmi sem számít bele. A main többet végez, mint amit a száma mutat.

**A main százaléka plafon, nem padló.** A csak a mainen végrehajtható futtatások a kvótáját terhelik, így amint ez a kvóta elfogy, a fennmaradó elosztható futtatások a workerekre szállnak. A main számának alacsonyra állítása biztonságos — a munkának, amelynek ott kell futnia, ott is fog futni. A magasra állítása éhezteti a workereket.

Tehát egy erős main és egy kisebb worker esetén a gépek nyers arányánál közelebb kezdjen a 60/40-hez, majd hasonlítsa össze a valós futtatási időtartamokat a Traces fülön, és igazítson.

A súlyok újranormalizálódnak az éppen élő és engedélyezett példányok között. `main=70, A=15, B=15` esetén, ha A offline állapotba kerül, a felosztás 70/85 és 15/85 lesz a main és B között, majd visszaáll 70/15/15-re, amikor A visszatér.

**Egy visszatérő példány nem követelheti a kihagyott futtatásokat.** Az Offline, Disabled vagy eltérő verzió miatt eltöltött idő nem számít bele, így egy worker, amely egy éjszakát elérhetetlenül tölt, a pool aktuális pozícióján csatlakozik újra, és a felosztás az első futtatásától ismét 70/30-at mutat — nem nyeli el az összes futtatást, amíg be nem hozza a lemaradást. Egy worker, amely végig elérhető volt, továbbra is behozza a lemaradást, és éppen ez teszi a main százalékát plafonná.

### Egy új példány nulláról csatlakozik

Egy példány, amely soha nem kapott súlyt, 0-ról indul, ami azt eredményezné, hogy Live, Enabled állapotban van, mégis semmit sem kap. **Give new instances a share automatically** — alapértelmezés szerint bekapcsolva, a példányok táblázata alatt — orvosolja ezt: a leader következő körében az újonc egyenlő részesedést kap a poolból, és a meglévő súlyok lefelé skálázódnak, megtartva egymáshoz viszonyított arányaikat, így egy szándékos 70/30 utána is nagyjából 70/30-at mutat. Az összeg pontosan 100 marad.

Ez **példányonként egyszer** fut le. Mind az automatikus kör, mind az Ön saját szerkesztése konfiguráltként jelöli meg a példányt, így egy Ön által beállított példány soha nem változik meg a háta mögött — beleértve azt is, amelyet szándékosan 0-ra állított. Kapcsolja ki a beállítást, ha inkább azt szeretné, hogy minden új gép Önre várjon.

Csak az engedélyezett, élő és kompatibilis példányok vesznek részt. Ha olyan gépnek adna részesedést, amely semmit sem tud végrehajtani, az a részesedés elveszne.
### Amikor a százalékok nem segítenek

A beállítások panel jelzi, hogy az elmúlt 24 óra futtatásaiból mennyi tudott csak a main példányon végrehajtódni. Ha ez a szám magas — Codex- vagy Drive-igényes munkaterhelés esetén —, a workerek tétlenül fognak állni, bármit is mondanak a súlyok, és a megoldás inkább egy nagyobb main példány, mintsem több worker.

## A PostgreSQL méretezése klaszterhez

A kapcsolatok a példányok számával skálázódnak, nem csupán a felhasználókéval. Minden példány több uvicorn folyamatot futtat, és minden folyamat fenntart egy kapcsolatkészletet, valamint négy `LISTEN` kapcsolatot (lemondás, sorébresztés, futtatási eredmények, chat streamek). A nyitott chat streamek az egyetlen chat kapcsolatot osztják meg, így nem adnak hozzá további adatbázis-kapcsolatokat. Egy három példányból álló klaszter az alapértelmezett `max_connections = 100` értékkel kimerül, és a Heym ekkor nem éri el a saját adatbázisát.

Számoljon nagyjából `instances x processes x (async pool + sync pool + 4)` értékkel, és állítsa a `max_connections` értékét ez fölé.

Inkább csökkentse a készleteket, mintsem csupán a plafont emelje. Egy önálló telepítés alapértelmezésben 10+20 async és 5+10 sync kapcsolatot használ folyamatonként, ami egyetlen géphez bőséges, egy klaszterhez viszont messze túl sok:

| Változó | Egy példány | Klaszter |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

A példa compose fájl beállítja ezeket, valamint a `max_connections = 300` értéket. Ez egy két példányból álló klasztert 768 kapcsolatos plafonról 192-re visz le, három példány esetén pedig még mindig 300 alatt marad.

## Követelmények, amelyeket a klaszter nem tud Ön helyett kikényszeríteni

**Minden példánynak ugyanazt a `SECRET_KEY` és `ENCRYPTION_KEY` értéket kell használnia.** Egy eltérő `ENCRYPTION_KEY`-jel rendelkező worker nem tudja visszafejteni a hitelesítési adatokat, és minden hitelesítési adatot használó futtatás olyan hibával hiúsulna meg, amely semmi hasznosra nem utal. A Heym minden heartbeat alkalmával összehasonlítja mindkét kulcs lenyomatát, valamint az alkalmazás verzióját és az adatbázis revízióját, és egy eltérő példányt **Mismatch** állapotúnak jelöl meg, így az egyáltalán nem kap munkát. A terhelés a main példányra esik vissza, amíg Ön ezt ki nem javítja.

Ez egyben meghatározza a frissítési sorrendet is. A main először történő frissítése minden workert inkompatibilisként jelöl meg; a munka visszakerül a main példányra, és minden worker akkor csatlakozik újra, amikor frissítik. Lassabb, látható és visszafordítható.

**A bejövő forgalmat kizárólag a main példányra irányítsa.** A felhasználói forgalom round-robin elosztása a példányok között egy fájlfeltöltést az egyik gépre, annak letöltését pedig egy másikra irányítaná. Ezt semmi sem akadályozza meg a kódban, mivel a worker ugyanazt az image-et futtatja, és minden beérkező kérésre válaszol.

**Minden példánynak szüksége van a `FRONTEND_URL` értékre, ugyanarra a nyilvános címre beállítva.** Egy emberi felülvizsgálat miatt szünetelő futtatás a felülvizsgálati linkjét azon a példányon állítja elő, amely végrehajtotta, nem a main példányon, és ugyanez érvényes a Codex nyomon követési linkjeire, valamint a generált fájlok letöltési URL-jeire. Egy e nélkül hagyott worker ezeket a linkeket a saját helyi címére építi fel, és aki egyet is megkap, nem tudja megnyitni.

**A worker példányok kimenő IP-címe eltérő.** Minden olyan API, amely engedélyezési listán tartja a forráscímeket, látni fogja az újat. A Send Email éppen ezért fut a main példányon; az HTTP csomópont esetében vagy adjon a klaszternek egyetlen NAT kimenő címet, vagy vegyen fel minden példányt az engedélyezési listára.

## Worker hozzáadása egy másik gépen

A repository gyökerében található `docker-compose.worker.yml` egy workert futtat a saját hosztján. Nincs adatbázisa és nincs felülete: eléri a main példány PostgreSQL-jét, és kiveszi a részét a háttérben futó futtatásokból.

Töltsön ki mellé egy `.env` fájlt — image tag, adatbázis hoszt és hitelesítési adatok, mindkét kulcs, valamint egy példány-azonosító —, és indítsa el. A Compose nem indul el, amíg minden kötelező érték nincs beállítva, ahelyett hogy egy helyőrző értékkel indulna el, amely később nehezen olvasható módon hiúsulna meg.

Az image tagnek annak a verziónak kell lennie, amelyet a main futtat, és mindkét kulcsot pontosan kell átmásolni. Bármelyik eltérése esetén a worker Mismatch állapotúnak jelenik meg, és nem kap munkát.

## Az Instances táblázat értelmezése

| Oszlop | Jelentés |
|---|---|
| Name | Szerkeszthető címke; rányomódik minden futtatásra, amelyet ez a példány végrehajt |
| Role | `main` vagy `worker`, a környezetből |
| Status | **Live** friss heartbeat esetén, **Offline** 30 másodpercnyi csend után, **Mismatch**, amikor a verzió, az adatbázis revíziója vagy a kulcsok eltérnek a main példányétól |
| ms | A példány és az adatbázis közötti oda-vissza út, amelyet maga a példány mér |
| On | Vegyen ki egy workert a rotációból anélkül, hogy leállítaná — a futó végrehajtások befejeződnek, újak nem kerülnek kiosztásra. A main példány esetében zárolva bekapcsolva: a fájl-, plugin- és coding-agent munka ott fut, bármit is mond a kapcsoló |
| Weight | A kiosztható futtatásokból való részesedése |

## Futtatási előzmények

A végrehajtási előzményekben minden futtatás megnevezi azt a példányt, amely végrehajtotta, és mindkét előzmény-párbeszédpanel szűrhető egyetlen példányra. A szűrő a példány azonosítójára illeszkedik, miközben a nevét jeleníti meg, így a példány átnevezése nem írja át azt, amit a régi futtatások mutatnak.

Mindebből semmi sem jelenik meg egy egyetlen példányos telepítésen: a mezők üresek, semmilyen címke nem látható, és semmilyen szűrő nem érhető el.
## Hiba esetén tanúsított viselkedés

**Ha egy worker futás közben leáll**, a heartbeat elavulttá válik, és a leader meglévő helyreállítási folyamata (recovery sweep) újrafuttatja az executiont egy élő instance-en. Az általa lefoglalt queue-sor külön kerül nyugdíjazásra: amint nem létezik aktív execution hozzá, és eltelt egy kétperces türelmi idő, a leader hibásnak jelöli a sort, és felébreszti azt, aki az eredményre várt. Kizárólag az életkor soha nem trigger, így egy jogosan hosszú futás érintetlen marad; a sor pedig hibásnak jelölődik az újra sorba állítás helyett, mert a helyreállítás már birtokolja az újrafuttatást, és az újra sorba állítás kétszer futtatná ugyanazt a workflow-t.

**Ha a main leáll**, a cron továbbra is tüzel egy workerből, és a distributable futások továbbra is végrehajtódnak. A main-t igénylő futások sorba állnak és várnak, majd annak visszatérésekor kiürülnek — de csak a misfire türelmi ablakon belül (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, alapértelmezés szerint 600 másodperc). A régebbi elemek kihagyottként záródnak le, az ok rögzítésével, ahelyett hogy óráknyi elmaradást egyszerre játszanának vissza.

A UI, az API, az MCP és a szerkesztő nem érhető el, amíg a main le van állva, mert az ingress oda mutat.

## Kapcsolódó

- [Futtatás és telepítés](../getting-started/running-and-deployment.md) – Először egyetlen instance-t telepítsen; a környezeti változók és a kulcsbeállítás ott találhatók
- [Beállítások](./user-settings.md) – Az Instances fül, és hogy ki láthatja
- [Futtatások](../tabs/traces-tab.md) – Hasonlítsa össze a valós futási időtartamokat az instance-ek között, mielőtt módosítaná a felosztást
- [Biztonság](./security.md) – Miért kell minden instance-nak osztoznia a `SECRET_KEY` és `ENCRYPTION_KEY` értékeken
