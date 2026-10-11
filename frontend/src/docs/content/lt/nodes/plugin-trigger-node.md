# Plugin Trigger Mazgas

**Plugin Trigger** mazgas yra trigger tipo atitikmuo [Plugin mazgui](./plugin-node.md). Jis yra teikiamas įdiegtos papildomos programos, kurios `kind` yra `trigger`, ir generuoja pradinius duomenis, nuo kurių prasideda workflow.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.<keys returned by the plugin>` |

Trigger papildoma programa gali atstovauti bet kokį šaltinį — kitą programą, trečiosios šalies paslaugą ar kitą technologiją — jei tik papildomos programos tvarkyklė grąžina duomenis, nuo kurių turėtų prasidėti workflow.

## Kada Naudoti

Naudokite Plugin Trigger mazgą, kai įdiegta papildoma programa apibrėžia trigger, kuris pradeda Jūsų workflow. Jei papildoma programa atlieka veiksmą workflow viduryje, naudokite [Plugin mazgą](./plugin-node.md) vietoj to.

## Konfigūracija

Kaip ir Plugin mazgas, konfigūracijos forma generuojama iš papildomos programos manifestų laukų. Ne slapti tekstiniai laukai naudoja išraiškos įvestį, o slapti laukai yra maskuojami.

## Kaip Veikia Papildomos Programos

Papildomos programos kodas yra patikimas (Heym teikiamas, operatoriaus įdiegtas) ir veikia proceso viduje. Įdiegimas yra ribojamas `HEYM_PLUGIN_ADMIN_EMAILS`, o subsistema yra kontroliuojama `HEYM_PLUGINS_ENABLED`. Žr. [Veikimas ir Diegimas](../getting-started/running-and-deployment.md).

## Kurti Papildomas Programas

Norėdami sukurti trigger papildomos programos paketą, žr. [Papildomų Programų Kūrimas](../reference/plugin-authoring.md) dėl zip išdėstymo, manifestų laukų, tvarkyklės parašų, ikonų, priklausomybių ir vykdymo pasitikėjimo modelio.
