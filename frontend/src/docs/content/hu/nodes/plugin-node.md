# Plugin csomópont

A **Plugin** csomópont egy telepített plugin által biztosított egyedi műveletet futtat. A pluginok új csomóponttípusokkal bővítik a Heymet — műveletekkel, harmadik féltől származó integrációkkal vagy bármivel, ami Pythonban kifejezhető — anélkül, hogy a core alkalmazást módosítanák.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.<keys returned by the plugin>` |

Egy plugin **csomag** (egy zip) **több csomópontot** is szállíthat — műveletek és triggerek bármilyen kombinációját. Minden csomópont a **Plugins** alatt jelenik meg a palettán a saját nevével és leírásával. Ha egyet a vászonra húz, létrejön egy Plugin csomópont, amely az adott csomaghoz (`pluginId`) és csomóponthoz (`pluginNodeKey`) van kötve.

## Mikor használja

Akkor használjon Plugin csomópontot, ha egy operátor telepített egy plugint, amely elvégzi a szükséges műveletet — például egy privát API-t hív meg, egy belső rendszerrel kommunikál, vagy az Ön telepítéséhez írt egyedi logikát futtat.

A workflow-t indító trigger-stílusú pluginokhoz lásd a
[Plugin Trigger csomópontot](./plugin-trigger-node.md).

## Konfiguráció

A csomópont konfigurációs űrlapja a plugin manifestjéből generálódik. A plugin által deklarált minden mező (`string`, `number`, `boolean` vagy `select`) automatikusan renderelődik. A nem titkos string mezők az expression bemenetet használják, és a mentett, `$` karakterrel kezdődő string konfigurációs értékek feloldódnak, mielőtt a plugin handler lefut.

A titkos mezők (például API kulcsok) maszkolva vannak a UI-ban, és soha nem íródnak a logokba.

## Hogyan futnak a pluginok

A pluginokat a Heym szállítja, és egy operátor telepíti őket, így a plugin kódja **megbízható**, és a beépített csomópontokhoz hasonlóan in-process fut, teljes hálózati és könyvtárhozzáféréssel. Egy plugin deklarálhat pip `dependencies`-eket, amelyek a telepítés során az instance-be kerülnek.

A pluginok telepítése és eltávolítása azon operátorokra korlátozódik, akiknek az email címe szerepel a `HEYM_PLUGIN_ADMIN_EMAILS` listában, és a teljes alrendszert a `HEYM_PLUGINS_ENABLED` kapcsolja (alapértelmezés szerint letiltva). A környezeti változókat lásd a
[Futtatás és telepítés](../getting-started/running-and-deployment.md) oldalon.

## Egyedi ikonok

Egy plugin egyedi SVG logókat szállíthat. Helyezzen egy `icon.svg` fájlt a csomag gyökérkönyvtárába, hogy minden csomóponthoz beállítson egy alapértelmezettet, és/vagy adjon egy csomópontnak saját `"icon": "<file>.svg"` bejegyzést a manifestben. Az ikon megjelenik mind a paletta kártyáján, mind a vászon csomópontján; az ikon nélküli csomópontok az alapértelmezett kirakósdarab glyphre esnek vissza.

## AI Builder

A telepített pluginok megjelennek az AI asszisztens és a chat vászon számára, így megkérheti a Heymet, hogy „használja az Acme CRM plugint egy rekord létrehozásához", és az generálja a Plugin csomópontot a megfelelő `pluginId` és `config` értékekkel.

## Pluginok készítése

Plugin csomag készítéséhez lásd a
[Plugin Authoring](../reference/plugin-authoring.md) oldalt a zip elrendezéshez, manifest mezőkhöz, handler szignatúrákhoz, ikonokhoz, függőségekhez és a futásidejű bizalmi modellhez.
