# Plugin čvor

**Plugin** čvor izvršava prilagođenu akciju koju pruža instalirani plugin. Pluginovi proširuju Heym novim tipovima čvorova — akcijama, integracijama trećih strana ili bilo čim što se može izraziti kao Python — bez izmjene osnovne aplikacije.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.<ključevi koje vraća plugin>` |

Plugin **paket** (jedan zip) može sadržavati **više čvorova** — bilo koju kombinaciju akcija i triggera. Svaki čvor pojavljuje se u paleti pod **Plugins** s vlastitim imenom i opisom. Povlačenjem jednog na platno stvara se Plugin čvor vezan uz taj paket (`pluginId`) i čvor (`pluginNodeKey`).

## Kada koristiti

Koristite Plugin čvor kada je operator instalirao plugin koji izvršava potrebnu akciju — na primjer, pozivanje privatnog API-ja, komunikaciju s internim sustavom ili izvođenje prilagođene logike napisane za Vašu implementaciju.

Za pluginove u stilu triggera koji pokreću workflow, pogledajte
[Plugin Trigger čvor](./plugin-trigger-node.md).

## Konfiguracija

Obrazac za konfiguraciju čvora generira se iz manifestacije plugina. Svako polje koje je deklarirao plugin (`string`, `number`, `boolean` ili `select`) automatski se prikazuje. Polja s neosjetljivim stringovima koriste unos izraza, a spremljene vrijednosti string konfiguracije koje započinju s `$` rješavaju se prije nego što se izvrši handler plugina.

Osjetljiva polja (kao što su API ključevi) su maskirana u korisničkom sučelju i nikada se ne bilježe u logove.

## Kako se pluginovi izvršavaju

Pluginovi se isporučuju od strane Heym-a i instaliraju ih operatori, tako da je kod plugina **pouzdan** i izvršava se unutar procesa poput ugrađenog čvora, s punim pristupom mreži i knjižnicama. Plugin može deklarirati pip `dependencies` koje se instaliraju u instancu prilikom instalacije.

Instalacija i uklanjanje pluginova ograničeni su na operatore čija su e-pošta navedena u `HEYM_PLUGIN_ADMIN_EMAILS`, a cijeli podsustav je ograničen s `HEYM_PLUGINS_ENABLED` (zadano onemogućeno). Pogledajte
[Pokretanje i implementacija](../getting-started/running-and-deployment.md) za varijable okruženja.

## Prilagođene ikone

Plugin može isporučiti prilagođene SVG logotipe. Stavite `icon.svg` u korijen paketa kako biste postavili zadanu ikonu za svaki čvor, i/ili dajte čvoru vlastitu `"icon": "<file>.svg"` u manifestu. Ikona se prikazuje na kartici palete i na čvoru na platnu; čvorovi bez ikone vraćaju se na zadani simbol slagalice.

## AI Builder

Instalirani pluginovi su dostupni AI asistentu i chat platnu, tako da možete zatražiti od Heym-a da "koristi Acme CRM plugin za stvaranje zapisa" i on će generirati Plugin čvor s pravim `pluginId` i `config`.

## Autor pluginova

Za izradu plugin paketa, pogledajte
[Plugin Authoring](../reference/plugin-authoring.md) za raspored zip-a, polja manifestacije, potpise handlera, ikone, ovisnosti i model povjerenja u vrijeme izvođenja.
