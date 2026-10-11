# Aģenta pastāvīgā atmiņa

Aģenta mezgli var uzturēt **katram mezglam specifisku zināšanu grafiku**, kas tiek glabāts datubāzē: entītijas (ar tipiem un īpašībām) un attiecības starp tām. Kad šī funkcija ir iespējota, Heym **katrā izpildē sistēmas promptā ievieto šī grafika kopsavilkumu** (ja grafiks nav tukšs). Pēc veiksmīgas izpildes **LLM ekstrakcijas darbs** fonā apvieno jaunus faktus no sarunas ar grafiku.

Apakšaģenti un orķestratori pēc noklusējuma izmanto grafiku, kas piesaistīts **viņu pašu kanvas mezglam**. Jūs varat arī **piešķirt citiem aģentiem lasīšanas vai lasīšanas/rakstīšanas piekļuvi** šī mezgla grafikam (tostarp aģentiem **citos workflow**, kas pieder Jums) — skatiet [Kopīgošana ar citiem aģentiem](#sharing-with-other-agents).

## Iespējošana

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Kad `true`, ielādē šī mezgla grafiku sistēmas promptā un plāno pēc-izpildes ekstrakciju šī mezgla grafikam |
| `memoryShares` | array (neobligāts) | Piešķir citiem aģenta mezgliem piekļuvi **šī** mezgla atmiņas grafikam; skatiet [Kopīgošana](#sharing-with-other-agents) |

Iespējojiet to aģenta mezgla rekvizītos (**Persistent memory (graph)**). Rozā **smadzeņu** ikona uz mezgla atver grafika redaktoru, kad atmiņa ir iespējota (vai kad tiek rādīts modelis).

## Grafika redaktors

Dialogs attēlo entītijas kā animētu, spēku virzītu grafiku — krāsainus apļus, kuru izmērs atbilst savienojumu skaitam un kas sagrupēti pēc entītijas tipa — kā arī rediģēšanu un navigāciju (skata pielāgošana, sakārtošana, tastatūras saīsnes). Jūs varat **pievienot, rediģēt vai dzēst** mezglus un šķautnes manuāli; Source/Target attiecību atlasītāji ir meklējami grafikiem ar daudzām entītijām. Atlasot mezglu, tiek parādīti tā izejošie un ienākošie savienojumi, un uz katra no tiem var noklikšķināt, lai pārietu uz attiecīgo mezglu. Izmaiņas attiecas tikai uz **šī** aģenta grafiku (grafiku kanvas mezglam, kura smadzenes Jūs atvērāt).

## Kopīgošana ar citiem aģentiem

Atmiņas grafika dialogā **Share memory with other agents** ļauj pievienot **līdziniekus**, kas izpildes laikā var izmantot šo grafiku:

1. Izvēlieties **workflow** (jebkuru workflow, ko varat atvērt redaktorā).
2. Izvēlieties **aģenta** mezglu šajā workflow.
3. Iestatiet **Read only** vai **Read & write**.

| Atļauja | Ietekme |
|------------|--------|
| Read only | Kad **līdzinieka** aģents darbojas, šis grafiks tiek apvienots ar līdzinieka sistēmas promptu (ja tam ir entītijas). Ekstrakcija šajā grafikā no līdzinieka izpildes netiek veikta. |
| Read & write | Tāda pati prompta darbība kā lasīšanai, un pēc **veiksmīgas** līdzinieka pabeigšanas parastā atmiņas ekstrakcija var arī **apvienot ar šo (īpašnieka) grafiku**, izmantojot līdzinieka izpildes akreditācijas datus. |

Līdzinieki tiek glabāti katram īpašnieka mezglam kā `memoryShares` ieraksti ar `peerWorkflowId` un `peerCanvasNodeId` (un `permission`). Vecākos workflow var trūkt `peerWorkflowId` līdziniekiem **tajā pašā** workflow; redaktors to uzskata par pašreizējo workflow.

**Starp-workflow kopīgošana** izpildes laikā tiek atrisināta, skenējot workflow, **kas pieder Jums**. Izpildes bez autentificēta lietotāja konteksta atrisina tikai tās koplietošanas, kas definētas **pašreizējā** workflow JSON (tajā pašā kanvā).

## Izpildes laika darbība

### Paša grafiks (`persistentMemoryEnabled`)

1. **Pirms LLM izsaukuma** — Ja grafikā ir entītijas, sistēmas instrukcijai tiek pievienots bloks, kas paskaidro, ka tie ir fakti no iepriekšējām izpildēm (var būt nepilnīgi; konflikta gadījumā uzvar pašreizējais lietotāja ziņojums).
2. **Pēc veiksmīgas pabeigšanas** — Fona darbs pieprasa modelim (ar tādiem pašiem akreditācijas datiem kā aģenta izpildei) strukturētu JSON (entītijas + attiecības). Šis payload tiek apvienots ar datubāzi (dažiem tipiem, piemēram, nodarbinātības stila šķautnēm, tiek piemērota dedublēšana un attiecību tīrīšana).

### Līdzinieks, kas saņem koplietotos grafikus

Kad aģents darbojas, sistēma atrod **īpašnieka** mezglus (jebkurā no Jūsu workflow, ja iespējams), kuru `memoryShares` norāda uz šīs izpildes workflow un kanvas mezglu. Katram atbilstības gadījumam šī īpašnieka grafiks tiek pievienots kā **koplietotās atmiņas** sadaļa sistēmas promptā. **Read & write** līdzinieki papildus plāno ekstrakcijas mērķus **īpašnieka** workflow/grafikam, kad izpilde ir veiksmīga.

Ekstrakcija **netiek** veikta, ja izpilde beidzas ar kļūdu vai nonāk HITL gaidošā stāvoklī.

## Workflow JSON (`data` lauks)

Tiek saglabāts aģenta mezglā tāpat kā citi iestatījumi:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` ir `"read"` vai `"write"`. Izlaidiet `memoryShares` vai izmantojiet `[]`, ja kopīgošana nav nepieciešama.

Pilnu mezgla objekta formu skatiet [Workflow Structure](./workflow-structure.md).

## Saistītais

- [Agent Node](../nodes/agent-node.md) — Pilna aģenta konfigurācija
- [Agent Architecture](./agent-architecture.md) — Orķestrators, apakšaģenti, rīki
- [Workflow Structure](./workflow-structure.md) — JSON workflow formāts
- [Canvas Features](./canvas-features.md) — Smadzeņu vadība un grafika dialogs
- [Traces tab](../tabs/traces-tab.md) — LLM pieprasījumu/atbilžu novērojamība
