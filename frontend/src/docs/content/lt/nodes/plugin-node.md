# Plugin mazgas

**Plugin** mazgas vykdo pasirinktą veiksmą, kurį pateikia įdiegtas papildinys. Papildiniai plečia Heym su naujais mazgų tipais — veiksmais, trečiųjų šalių integracijomis ar bet kuo, kas gali būti išreikšta Python — nekeičiant pagrindinės programos.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.<keys returned by the plugin>` |

Papildinio **paketas** (vienas zip) gali turėti **kelis mazgus** — bet kokią veiksmų ir triggerių kombinaciją. Kiekvienas mazgas pasirodo paletėje po **Plugins** su savo pavadinimu ir aprašymu. Vieno vilkimas ant drobės sukuria Plugin mazgą, susietą su tuo paketu (`pluginId`) ir mazgu (`pluginNodeKey`).

## Kada naudoti

Naudokite Plugin mazgą, kai operatorius įdiegė papildinį, kuris atlieka jums reikalingą veiksmą — pavyzdžiui, kviečiant privatų API, bendraujant su vidine sistema ar vykdant specialiai jūsų diegimui parašytą logiką.

Dėl triggerių stiliaus papildinių, kurie pradeda workflow, žr. [Plugin Trigger mazgas](./plugin-trigger-node.md).

## Konfigūracija

Mazgo konfigūracijos forma generuojama iš papildinio manifestacijos. Kiekvienas laukas, kurį deklaruoja papildinys (`string`, `number`, `boolean` arba `select`), automatiškai atvaizduojamas. Neslaptieji string laukai naudoja išraiškos įvestį, o išsaugoti string konfigūracijos vertės, prasidedančios nuo `$`, yra išsprendžiamos prieš paleidžiant papildinio tvarkyklę.

Slapti laukai (tokie kaip API raktai) UI yra maskuojami ir niekada nėra rašomi į žurnalus.

## Kaip veikia papildiniai

Papildiniai yra pristatomi Heym ir įdiegiami operatoriaus, todėl papildinio kodas yra **patikimas** ir veikia procese kaip įmontuotas mazgas, turintis visišką tinklo ir bibliotekų prieigą. Papildinys gali deklaruoti pip `dependencies`, kurios yra įdiegiamos į instanciją diegimo metu.

Papildinių diegimas ir šalinimas yra ribojamas operatoriams, kurių el. pašto adresai yra nurodyti `HEYM_PLUGIN_ADMIN_EMAILS`, o visa sistema yra kontroliuojama `HEYM_PLUGINS_ENABLED` (numatyta, kad išjungta). Žr. [Veikimas ir diegimas](../getting-started/running-and-deployment.md) dėl aplinkos kintamųjų.

## Pasirinktini ikonai

Papildinys gali turėti pasirinktinius SVG logotipus. Įdėkite `icon.svg` į paketo šaknį, kad nustatytumėte numatytą kiekvienam mazgui, ir/arba suteikite mazgui savo `"icon": "<file>.svg"` manifestacijoje. Ikona rodomas tiek paletės kortelėje, tiek drobės mazge; mazgai be ikonos grįžta prie numatyto dėlionės gabalo simbolio.

## AI kūrėjas

Įdiegti papildiniai yra matomi AI asistentui ir pokalbių drobėje, todėl galite paprašyti Heym "naudoti Acme CRM papildinį, kad sukurtumėte įrašą", ir jis sugeneruos Plugin mazgą su tinkamu `pluginId` ir `config`.

## Autorių papildiniai

Norėdami sukurti papildinio paketą, žr. [Plugin Authoring](../reference/plugin-authoring.md) dėl zip išdėstymo, manifestacijos laukų, tvarkyklės parašų, ikonų, priklausomybių ir vykdymo patikimumo modelio.
