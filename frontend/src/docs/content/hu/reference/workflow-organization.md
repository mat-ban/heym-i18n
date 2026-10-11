# Workflow-szervezés

A Heym lehetővé teszi a workflow-k mappákba rendezését, almappák létrehozását és a workflow-k törlésre ütemezését. A felhasználói felület áttekintését lásd a [Workflow-k lap](../tabs/workflows-tab.md) oldalon.

## Mappák és almappák

A mappák fastruktúrát alkotnak. Minden mappa a következőkkel rendelkezik:

- **Név** – Megjelenített név
- **Szülő** – A `parent_id` egy másik mappára mutat; a `null` a gyökeret jelenti
- **Workflow-k** – A workflow-k a `folder_id` segítségével helyezhetők mappákba

### API

| Endpoint | Cél |
|----------|---------|
| `GET /folders` | Csak a gyökérmappák |
| `GET /folders/tree` | Teljes fastruktúra (gyermekek + workflow-k) |
| `GET /folders/{id}` | Egyetlen mappa a tartalmával |
| `POST /folders` | Mappa létrehozása (`parent_id` opcionális) |
| `PUT /folders/{id}` | Név vagy `parent_id` módosítása |
| `DELETE /folders/{id}` | Mappa törlése (kaszkádolt) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Workflow áthelyezése mappába |
| `DELETE /folders/workflows/{workflow_id}/folder` | Workflow eltávolítása a mappából |
| `GET /folders/{id}/export` | Mappa és az összes almappa letöltése ZIP formátumban |

### Fastruktúra

A fastruktúra válasza mappánként tartalmazza a `children` és `workflows` elemeket. A megosztott workflow-k a `WorkflowShare.folder_id` segítségével jelenhetnek meg egy mappában.

## Workflow-k megosztása

Nyissa meg a **Megosztás** lehetőséget a workflow-szerkesztőben, hogy e-mail-cím alapján hívjon meg felhasználókat, vagy osszon meg egy [csapattal](./teams.md). Minden meghívás és minden csapatmegosztás rendelkezik egy jogosultsággal:

| Jogosultság | Mit tehet a közreműködő |
|------------|------------------------------|
| **Olvasás** | Megnyitja a workflow-t, megvizsgálja, megtekinti a futtatási előzményeket és futtatja. A szerkesztő csak olvasható módban nyílik meg: a Mentés le van tiltva, és a vászon nem módosítható. |
| **Írás** | Mindent, amit az Olvasás engedélyez, valamint a vászon, a beállítások, az elemzési dokumentum és az ügynök memóriájának szerkesztését. |

A jogosultság a Megosztás párbeszédablak minden bejegyzése mellett látható, és bármikor módosítható arról a legördülő menüből anélkül, hogy a megosztást el kellene távolítani és újra hozzáadni. Ha egy felhasználó több útvonalon keresztül ér el egy workflow-t (közvetlen megosztás és egy vagy több csapat), a **legmagasabb** jogosultság érvényesül. A jogosultságok bevezetése előtt létező megosztások **Írás** jogosultságot kapnak, és azok az API-kliensek is **Írást** kapnak, amelyek kihagyják a `permission` mezőt.

A csak tulajdonosra vonatkozó műveletek soha nem függenek a jogosultságtól: a workflow törlése, a verziók visszaállítása vagy törlése, az előzmények törlése, a megosztások kezelése és az alábbi [csak tulajdonosra vonatkozó beállítások](#csak-tulajdonosra-vonatkozó-beállítások) a tulajdonosnál maradnak még az **Írás** jogosultságú közreműködők esetében is. Az **Olvasás** jogosultságú közreműködő, aki az API-n keresztül (`PUT /api/workflows/{id}`, az elemzési megjegyzés, az ügynök memóriája, a gyorsítótár törlése) vagy az AI Asszisztensen keresztül szerkesztést küld, `403` hibát kap a következő üzenettel: `You have read-only access to this workflow`.

Egy workflow megosztása hozzáférést biztosít a vászonhoz, a futtatási előzményekhez és az elemzési dokumentumhoz. **Nem** osztja meg automatikusan a következőket:

- A workflow csomópontjai által hivatkozott **Hitelesítési adatok**
- Az [Execute](../nodes/execute-node.md) csomópontok vagy ügynökök által meghívott **Al-workflow-k**

A címzetteknek ezeket a hitelesítési adatokat és al-workflow-kat külön kell megosztani velük (ugyanazokkal a felhasználókkal vagy csapatokkal). A hitelesítési adatokat a [Hitelesítési adatok lap](../tabs/credentials-tab.md) oldalon ossza meg; lásd a [Hitelesítési adatok megosztása](./credentials-sharing.md) részt. Minden al-workflow-t a saját szerkesztőjének megosztás párbeszédablakából osszon meg.

### Csak tulajdonosra vonatkozó beállítások

A teljes **Futtatás cURL-lel** konfiguráció a tulajdonosnál marad a megosztás után. A közreműködők továbbra is megnyitják a párbeszédablakot és másolják a generált parancsot, de a vezérlők csak olvashatók.

Ha nem tulajdonosként módosítja ezeket, az `403` hibát eredményez:

- **Hitelesítés** (`auth_type`) és **Fejléc kulcs** (`auth_header_key`)
- **Kérés törzse** mód (`webhook_body_mode`) és **Kérés metódusa** (`http_method`)
- **Válasz gyorsítótár** (`cache_ttl_seconds`) és **Sebességkorlát** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

A **Fejléc értéke** (`auth_header_value`) másképp viselkedik: teljesen el van rejtve a közreműködők elől, és a közreműködő írása figyelmen kívül marad, nem pedig elutasításra kerül. A szerkesztő maszkoltként jeleníti meg a mezőt, így egy `403` ott egy hétköznapi mentést törne meg, nem pedig támadást jelezne.

A hitelesítés az oka annak, hogy a blokk csak tulajdonosra vonatkozik: az `Anonymous` lehetővé teszi, hogy hitelesítés nélküli hívók futtassák a workflow-t, és egy bejelentkezett hívó nélküli futtatás a hitelesítési adatokat és a globális változókat a **tulajdonosként** oldja fel, nem pedig a hívóként. A blokk többi része a közzétett kérési szerződés és a tulajdonos költségkontrolljai, ezért együtt mozog.

A **Hiba esetén workflow futtatása** (`error_workflow_id`) a workflow-szintű **Tulajdonságok** panelen ugyanezen okból csak tulajdonosra vonatkozik: a [hiba workflow](./features.md#error-workflow) a sikertelen futtatás hitelesítési adataival és globális változóival fut, amelyek a tulajdonoséi a triggerelt és névtelen futtatások esetében. A közreműködők csak olvashatóként látják a beállítást, és annak hozzáadása, cseréje vagy törlése nem tulajdonosként `403` hibát eredményez.

A vászon, a név és a leírás szerkesztését ez nem érinti.

### Futtatási tokenek

A közreműködő futtatási tokent bocsáthat ki egy vele megosztott workflow-hoz. A futtatás **ahhoz a felhasználóhoz** kerül hozzárendelésre, aki a tokent kibocsátotta, így az adott felhasználó hitelesítési adatait és globális változóit használja, nem a tulajdonosét. Csak egy valóban névtelen hívás – `auth_type: anonymous` hívó nélkül – fut a tulajdonos kontextusában.

## Törlésre ütemezve

A workflow-k azonnali eltávolítás helyett törlésre ütemezhetők.

- **Mező**: `scheduled_for_deletion` (nullázható datetime)
- **Viselkedés**: Ha be van állítva, a workflow a `folder_id = null` értékre kerül, és megjelenik a „Törlésre ütemezve" szakaszban.
### API

| Endpoint | Cél |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | A `scheduled_for_deletion` beállítása, a `folder_id` törlése |
| `DELETE /workflows/{id}/schedule-deletion` | A `scheduled_for_deletion` törlése (visszaállítás) |

### UI

- **Húzás a kukába** – A workflow-kat a „Törlésre ütemezve" területre húzva ütemezheti azokat
- **Visszaállítás** – Eltávolítás az ütemezésből
- **Azonnali törlés** – Kuka ikon a végleges eltávolításhoz

### Tisztítási logika

Egy cron job naponta **23:59**-kor fut (a beállított időzóna szerint). Egy workflow csak akkor törlődik, ha:

- **Minden kezdő csomópont** (olyan csomópontok, amelyeknek nincs bejövő éle, kivéve a sticky/errorHandler) `active === false` értékkel rendelkezik

Ha bármely kezdő csomópont továbbra is aktív, a workflow a következő futásig megmarad.

## Dashboard UI

- **Mappasorok** – Új mappa, rekurzív mappafa kibontással/összecsukással. Minden mappa a neve alatt
  opcionális leírást tartalmaz, valamint egy jelvényt, amely az általa tartalmazott workflow-kat számolja,
  az almappákkal együtt.
- **Mappaműveletek** – Új almappa, Átnevezés, Ikon módosítása, Letöltés ZIP-ként és Törlés közvetlenül
  minden mappasorban megtalálható; a jobb gombos helyi menü ugyanezt a készletet kínálja, a telefonok
  pedig egyetlen menügombot jelenítenek meg.
- **Fő terület** – Gyökér workflow-k (mappa nélkül, nem ütemezett) és Törlésre ütemezve
- **Mappa ejtési előnézet** – Egy workflow húzásakor a pontos mappa vagy almappa kiemelésre kerül, és
  egy kártya méretű előnézetben megjelenik annak teljes elérési útja. Az összecsukott mappa rövid
  rámutatás után kibomlik.
- **Stabil húzási visszajelzés** – A forráskártya húzási szellemképet használ, az aktív ejtési célpont
  pedig kijelölve marad görgetés közben vagy ugyanazon mappán belüli vezérlőkön való áthaladáskor.
- **Cél ellenőrzése** – Az aktuális mappa **Már a mappában** jelzéssel jelenik meg, és nem fogad el
  felesleges áthelyezést.
- **Egyéb ejtési zónák** – A gyökér és a „Törlésre ütemezve" kiemelésre kerül, amikor képesek fogadni
  a húzott workflow-t.
- **ZIP ejtése** – Egy ZIP fájl ejtése a workflow területre mappastruktúra importálásához gyökér szinten

## Kapcsolódó

- [Workflows fül](../tabs/workflows-tab.md) – Workflow-k létrehozása és kezelése
- [Hitelesítési adatok megosztása](./credentials-sharing.md) – Hitelesítési adatok megosztása workflow közreműködőkkel
- [Csapatok](./teams.md) – Workflow-k és hitelesítési adatok megosztása csapatokkal
- [Alapfogalmak](../getting-started/core-concepts.md) – Workflow-k, csomópontok és végrehajtás
- [Workflow struktúra](./workflow-structure.md) – JSON formátum a workflow-khoz
- [Triggerek](./triggers.md) – Kezdő csomópontok és belépési pontok
