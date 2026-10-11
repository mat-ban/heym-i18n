# Plugin Trigger csomópont

A **Plugin Trigger** csomópont a [Plugin csomópont](./plugin-node.md) trigger-stílusú megfelelője. Olyan telepített plugin biztosítja, amelynek `kind` értéke `trigger`, és előállítja azt a kezdeti adatot, amelyből egy workflow elindul.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.<keys returned by the plugin>` |

Egy trigger plugin bármilyen forrást képviselhet — egy másik alkalmazást, egy harmadik féltől származó szolgáltatást vagy egy másik technológiát —, amennyiben a plugin kezelője visszaadja azokat az adatokat, amelyekkel a workflow-nak el kell indulnia.

## Mikor érdemes használni

Akkor használjon Plugin Trigger csomópontot, ha egy telepített plugin olyan triggert definiál, amely elindítja a workflow-t. Azon pluginok esetében, amelyek a workflow közben hajtanak végre műveletet, használja helyette a [Plugin csomópontot](./plugin-node.md).

## Konfiguráció

A Plugin csomóponthoz hasonlóan a konfigurációs űrlap a plugin manifest mezőiből generálódik. A nem titkos karakterlánc típusú mezők az expression bemenetet használják, a titkos mezők pedig maszkolva vannak.

## A pluginok futtatása

A plugin kódja megbízható (Heym által szállított, üzemeltető által telepített), és in-process fut. A telepítés a `HEYM_PLUGIN_ADMIN_EMAILS` számára van korlátozva, az alrendszert pedig a `HEYM_PLUGINS_ENABLED` kapcsolja. Lásd: [Futtatás és telepítés](../getting-started/running-and-deployment.md).

## Pluginok készítése

Trigger plugin csomag létrehozásához lásd: [Plugin Authoring](../reference/plugin-authoring.md) a zip elrendezésről, a manifest mezőkről, a kezelő szignatúrákról, az ikonokról, a függőségekről és a futtatókörnyezeti bizalmi modellről.
