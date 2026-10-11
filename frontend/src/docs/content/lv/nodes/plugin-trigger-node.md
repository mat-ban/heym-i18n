# Plugin Trigger mezgls

**Plugin Trigger** mezgls ir trigera tipa counterparts
[Plugin mezglam](./plugin-node.md). To nodrošina instalēts spraudnis, kura
`kind` ir `trigger`, un tas ģenerē sākotnējos datus, ar kuriem sākas workflow.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | `$nodeLabel.<keys returned by the plugin>` |

Trigeru spraudnis var attēlot jebkuru avotu — citu lietojumprogrammu, trešās puses
pakalpojumu vai citu tehnoloģiju — ja vien spraudņa apstrādātājs atgriež datus,
ar kuriem workflow ir jāsāk.

## Kad izmantot

Izmantojiet Plugin Trigger mezglu, ja instalēts spraudnis definē trigeri, kas sāk
jūsu workflow. Spraudņiem, kas veic darbību workflow laikā, izmantojiet
[Plugin mezglu](./plugin-node.md).

## Konfigurācija

Tāpat kā Plugin mezglā, konfigurācijas forma tiek ģenerēta no spraudņa
manifesta laukiem. Ne slepenie virkņu lauki izmanto izteiksmes ievadi, un slepenie
lauki tiek maskēti.

## Kā darbojas spraudņi

Spraudņa kods ir uzticams (Heym piegādāts, operators instalēts) un darbojas procesā.
Instalēšana ir ierobežota ar `HEYM_PLUGIN_ADMIN_EMAILS`, un apakšsistēmu
kontrolē `HEYM_PLUGINS_ENABLED`. Skatiet
[Palaišana un izvietošana](../getting-started/running-and-deployment.md).

## Spraudņu autorēšana

Lai izveidotu trigera spraudņa pakotni, skatiet
[Spraudņu autorēšana](../reference/plugin-authoring.md) par zip izkārtojumu,
manifesta laukiem, apstrādātāju parakstiem, ikonām, atkarībām un izpildlaika uzticības
modeli.
