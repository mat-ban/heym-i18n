# Plugin Trigger čvor

**Plugin Trigger** čvor je trigger‑ovski pandan
[Plugin čvora](./plugin-node.md). Omogućuje ga instalirani plugin čiji je
`kind` postavljen na `trigger` te proizvodi početne podatke od kojih workflow započinje.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.<keys returned by the plugin>` |

Trigger plugin može predstavljati bilo koji izvor — drugu aplikaciju, uslugu treće strane ili neku drugu tehnologiju — sve dok handler plugina vraća podatke s kojima workflow treba započeti.

## Kada koristiti

Koristite Plugin Trigger čvor kada instalirani plugin definira trigger koji pokreće
vaš workflow. Za plugine koji izvršavaju radnju tijekom workflowa koristite
[Plugin čvor](./plugin-node.md).

## Konfiguracija

Kao i kod Plugin čvora, obrazac za konfiguraciju generira se iz polja
manifesta plugina. Ne-tajna polja tipa string koriste izrazni unos, a tajna
polja su maskirana.

## Kako se pluginovi izvršavaju

Kod plugina je pouzdan (isporučuje ga Heym, instalira operator) i izvršava se unutar procesa.
Instalacija je ograničena na `HEYM_PLUGIN_ADMIN_EMAILS`, a podsustav je
kontroliran putem `HEYM_PLUGINS_ENABLED`. Pogledajte
[Pokretanje i implementacija](../getting-started/running-and-deployment.md).

## Autoriranje pluginova

Za izradu paketa trigger plugina pogledajte
[Autoriranje pluginova](../reference/plugin-authoring.md) za raspored zip datoteka,
polja manifesta, potpise handlera, ikone, ovisnosti i model pouzdanosti izvršnog okruženja.
