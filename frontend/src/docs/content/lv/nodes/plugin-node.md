# Plugin mezgls

**Plugin** mezgls izpilda pielāgotu darbību, ko nodrošina instalēts spraudnis. Spraudņi
paplašina Heym ar jauniem mezglu tipiem — darbībām, trešo pušu integrācijām vai jebko,
ko iespējams izteikt Python valodā — bez pamata lietotnes modificēšanas.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.<keys returned by the plugin>` |

Spraudņa **pakotne** (viens zip fails) var saturēt **vairākus mezglus** — jebkādu darbību
un triggeru kombināciju. Katrs mezgls parādās paletē sadaļā **Plugins** ar savu
nosaukumu un aprakstu. Velkot vienu no tiem uz kanvas, tiek izveidots Plugin mezgls, kas piesaistīts
attiecīgajai pakotnei (`pluginId`) un mezglam (`pluginNodeKey`).

## Kad izmantot

Izmantojiet Plugin mezglu, ja operators ir instalējis spraudni, kas veic nepieciešamo
darbību — piemēram, izsauc privātu API, sazinās ar iekšēju sistēmu vai
izpilda pielāgotu loģiku, kas rakstīta Jūsu izvietojumam.

Lai uzzinātu par triggera tipa spraudņiem, kas uzsāk workflow, skatiet
[Plugin Trigger mezglu](./plugin-trigger-node.md).

## Konfigurācija

Mezgla konfigurācijas forma tiek ģenerēta no spraudņa manifesta. Katrs lauks,
ko deklarē spraudnis (`string`, `number`, `boolean` vai `select`), tiek attēlots
automātiski. String lauki, kas nav slepeni, izmanto izteiksmes ievadi, un saglabātās
string konfigurācijas vērtības, kas sākas ar `$`, tiek atrisinātas pirms spraudņa apstrādātāja
izpildes.

Slepenie lauki (piemēram, API atslēgas) tiek maskēti UI un nekad netiek ierakstīti žurnālos.

## Kā spraudņi darbojas

Spraudņus piegādā Heym un instalē operators, tāpēc spraudņa kods ir
**uzticams** un darbojas procesā tāpat kā iebūvēts mezgls, ar pilnu tīkla un
bibliotēku piekļuvi. Spraudnis var deklarēt pip `dependencies`, kas tiek instalētas
instancē instalēšanas laikā.

Spraudņu instalēšana un noņemšana ir ierobežota operatoriem, kuru e-pasts ir norādīts
`HEYM_PLUGIN_ADMIN_EMAILS`, un visa apakšsistēma ir kontrolēta ar
`HEYM_PLUGINS_ENABLED` (pēc noklusējuma atspējota). Skatiet
[Palaišana un izvietošana](../getting-started/running-and-deployment.md) par
vides mainīgajiem.

## Pielāgotas ikonas

Spraudnis var saturēt pielāgotus SVG logotipus. Ievietojiet `icon.svg` pakotnes saknē, lai iestatītu
noklusējumu katram mezglam, un/vai piešķiriet mezglam savu `"icon": "<file>.svg"`
manifestā. Ikona tiek parādīta gan paletes kartītē, gan kanvas mezglā; mezgli
bez ikonas izmanto noklusējuma puzles gabaliņa simbolu.

## AI Builder

Instalētie spraudņi tiek nodoti AI asistentam un chat kanvas, tāpēc Jūs varat lūgt
Heym "izmantot Acme CRM spraudni, lai izveidotu ierakstu", un tas ģenerēs
Plugin mezglu ar pareizo `pluginId` un `config`.

## Spraudņu autorēšana

Lai izveidotu spraudņa pakotni, skatiet
[Spraudņu autorēšana](../reference/plugin-authoring.md) par zip izkārtojumu,
manifesta laukiem, apstrādātāju parakstiem, ikonām, atkarībām un izpildlaika uzticamības
modeli.
