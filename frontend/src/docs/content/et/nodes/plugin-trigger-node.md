# Plugin Trigger Node

**Plugin Trigger** node on [Plugin node'i](./plugin-node.md) trigger-stiilis vaste. Selle pakub installitud plugin, mille `kind` on `trigger`, ja see toodab algandmed, millest workflow algab.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.<keys returned by the plugin>` |

Trigger-plugin võib esindada mis tahes allikat — teist rakendust, kolmanda osapoole teenust või muud tehnoloogiat — seni, kuni plugina handler tagastab andmed, millega workflow peaks algama.

## Millal kasutada

Kasutage Plugin Trigger node'i, kui installitud plugin määratleb triggeri, mis käivitab teie workflow. Pluginate puhul, mis sooritavad toimingu workflow keskel, kasutage selle asemel [Plugin node'i](./plugin-node.md).

## Konfiguratsioon

Nagu Plugin node'i puhul, genereeritakse konfiguratsioonivorm plugina manifesti väljadest. Mitte-salajased string-väljad kasutavad avaldise sisendit ja salajased väljad on maskeeritud.

## Kuidas pluginad töötavad

Plugina kood on usaldusväärne (Heymi poolt tarnitud, operaatori poolt installitud) ja töötab protsessis. Installimine on piiratud `HEYM_PLUGIN_ADMIN_EMAILS`-iga ja alamsüsteemi reguleerib `HEYM_PLUGINS_ENABLED`. Vt [Käitamine ja juurutamine](../getting-started/running-and-deployment.md).

## Pluginate autorlus

Trigger-plugina paketi loomiseks vt [Pluginate autorlus](../reference/plugin-authoring.md), mis kirjeldab zip-faili paigutust, manifesti välju, handleri signatuure, ikoone, sõltuvusi ja käitusaegset usaldusmudelit.
