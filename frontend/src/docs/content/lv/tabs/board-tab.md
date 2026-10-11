# Board

**Board** cilne ir aģentiska kanbana dēlis. Darbs pārvietojas caur kolonnām, un katra kolonna var izpildīt Heym workflows. Karte nav tikai uzdevums — tā ir pastāvīga aģentiska darbība, kas nes kontekstu, sarunu vēsturi, izpildes stāvokli, izejas un workflow izpildes.

## Dēļi un kolonnas

- Jūs varat izveidot tik daudz dēļu, cik nepieciešams. Jauns dēlis sākas ar noklusējuma kolonnām **Atlikums → Plānošana → Izstrāde → Pabeigts**.
- Katram dēlim nepieciešams **Agentic Kanban Model** (akreditācijas dati plus modelis). Tas ir obligāts — Jaunā dēļa dialoglodziņš neizveidos dēli bez tā, un dēlis, kam tā nav, saglabā savas darbības atslēgtas — jo modelis karti pārvērš workflow ievades datos un atgriež to izejas kā lasāmu tekstu.
- Zobrata ikona dēļa galvenē atver dēļa iestatījumus: nosaukums, apraksts (parādīts zem galvenes) un Agentic Kanban Model.
- Kolonnas ir pilnībā rediģējamas: pievienojiet, pārdēvējiet, mainiet krāsu, pārkārtojiet vai dzēsiet tās no kolonnas iestatījumiem (kolonna jābūt tukšai, pirms to var dzēst).
- Kartes tiek kārtotas vertikāli pēc prioritātes — velciet, lai pārkārtotu.
- Jūs varat arī izveidot karti no [Chat cilnes](./chat-tab.md) ar dabiskās valodas pieprasījumu. Chat lūdz Jūs izvēlēties dēli, kad tas nepieciešams, un vienmēr pievieno karti šī dēļa pirmajai kolonnai.

## Dēļa koplietošana

Dēļa iestatījumi arī koplieto dēli ar **lietotājiem** (pa e-pastu) un **komandām**, ar `lasīšanas` vai `rakstīšanas` atļaujām:

- **lasīšana** — dēlis un tā kartes ir redzamas, bet nekas nevar tikt mainīts: nav jaunu karšu, nav pārvietojumu, nav komentāru, nav izpildes.
- **rakstīšana** — pilna dēļa izmantošana: kartes, pārvietojumi, komentāri un izpildes.
- Tikai **īpašnieks** redz zobrata un dzēšanas pogas, un tikai īpašnieks var mainīt dēļa iestatījumus, tā Agentic Kanban Model vai tās koplietošanu.

Ķēdes koplietotā dēlī vienmēr tiek izpildītas ar **īpašnieka** akreditācijas datiem un Agentic Kanban Model, tādējādi sadarbības partneriem nekad nav nepieciešami savi.

## Kartes pielikumi

Atveriet karti un izmantojiet **Pievienot failu**, lai pievienotu failus — nometiet tos kastē vai izvēlieties tos ar pogu, un noņemiet tos no tās pašas saraksta. Pielikumi tiek glabāti [Drive](./drive-tab.md).

Katrs izpildījums **atrisina pielikumus pirms workflow sākuma**, pēc veida:

- **Dokumenti** (pdf, markdown, csv, json, text) tiek izvilkti kā teksts, ierobežojot līdz 20,000 rakstzīmēm uz failu, pielikuma `text` laukā.
- **Attēli** tiek nodoti kā `url`, ko redzes ceļš ielādē tieši (LLM mezgla attēla ievade to pieņem tādā veidā).
- **Viss pārējais** tiek nodots kā vienkārša atsauce (`name`, `url`, `mime_type`).

Workflows tos lasa pie `$input.card.attachments` (un vienmēr pie `$input.board.attachments`, neatkarīgi no tā, kā mapperis ir kartējis). Agentic Kanban Model redz arī izvilkto tekstu un attēlu URL, tādējādi tas var tieši kartēt pielikumu laukā, ko workflow sagaida.

## Kolonnas workflow ķēdes

Katru kolonnu var konfigurēt ar **sakārtotu workflow sarakstu** (ķēdi). Kad karte pārvietojas uz kolonnu, kurai ir ķēde:

1. Ķēde automātiski sākas fona režīmā — pārvietošana pati par sevi nekad negaida.
2. Workflows tiek izpildīti **secīgi**. Katras workflow izeja tiek pievienota kartes kontekstam pirms nākamās sākuma.
3. Ja kāda workflow neizdodas, ķēde apstājas: atlikušās saites tiek izlaistas un karte kļūst **sarkana**.
4. Kad katra saite izdodas, karte kļūst **zaļa**. Kamēr ķēde darbojas, karte pulsē **dzintara** krāsā; izpilde, kas ir apturēta cilvēka pārskatīšanai, parāda statisku dzintara stāvokli.

Izpildes tiek reģistrētas [Izpildes vēsturē](../reference/execution-history.md) ar `board` trigger avotu, un katra karte saglabā savu izpildes sarakstu ar katras workflow izejām un kļūdām. Atveriet karti, kamēr workflow darbojas, un izvēlieties **Atvērt tiešsaistē** blakus izpildei, lai pievienotu redaktoru tieši šai izpildei. Tā pati kanvas animācija, pakāpeniskie Debug žurnāli un galīgais rezultāts parādās bez otrās izpildes uzsākšanas.
## Ko saņem workflows

Ķēde nodod standarta payload kā workflows ievadi. To var lasīt ar parastām
[izteiksmēm](../reference/expression-dsl.md), piemēram, `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — katrs komentārs par karti, sākot no vecākā.
- `history` — pilna aktivitāšu laika līnija (komentāri, pārvietojumi, iznākumi), ierobežota līdz pēdējiem 200 ierakstiem.
- `previous_outputs` — iznākumi no iepriekšējiem pabeigtajiem izpildījumiem (iepriekšējām kolonnām un turpmākajiem raundiem).
- `chain.previous_workflow_outputs` — iepriekšējo saišu iznākumi *pašreizējā* ķēdē.
- Turpmākajos raundos `move` ir `null` un `rerun` ir `true`.

## Plānošanas cikls (turpmākie raundi)

Izplatīta shēma ir novietot plānošanas workflow **otrajā kolonnā** (pēc noklusējuma nosaukta kā Plānošana — nosaukumam nav nozīmes; svarīga ir vieta). Šis workflow bagātina karti un uzdod turpmākos jautājumus:

1. Pārvietojiet karti otrajā kolonnā — workflow ieraksta bagātinātu plānu un tā jautājumus atpakaļ kartē kā iznākumu.
2. Atbildiet kartes komentāru pavedienā. Atbilde atbrīvo karti: tā pārvietojas uz nākamo kolonnu, kas to uzņem ar atbildi kontekstā. Otrās kolonnas ķēde netiek izpildīta atkārtoti.
3. Lai uzlabotu plānu vietā, nospiediet **Izpildīt turpmāko raundu**. Tā pati ķēde tiek izpildīta atkārtoti ar visiem uzkrātajiem kontekstiem, pēc tam karte gaida šajā kolonnā, līdz Jūs pievienojat komentāru, lai to atbrīvotu.

Plānošanas vārti ir pozicionāli, nevis nosaukuma balstīti: kreisākā kolonna un kolonna, kas atrodas tieši labajā pusē, nekad nepārvietojas pašas — tās izpilda savu ķēdi un gaida tur Jūs (komentārs atbrīvo otro kolonnu). Sākot no trešās kolonnas, veiksmīga ķēde pārvieto karti pa labi pati, līdz pēdējai kolonnai. Noklusējuma "Plānošanas" etiķetes pārdēvēšana vai noņemšana nemaina to, kura vieta ir vārti. Karte var būt tikai ar vienu aktīvu izpildījumu vienlaikus.

## Cilvēks ciklā un Codex jautājumi

Ja ķēdes workflow apstājas — uz [Cilvēks ciklā](../reference/human-in-the-loop.md) mezgla, uz aģenta HITL rīka, vai tāpēc, ka [Codex](../nodes/codex-node.md) mezglam nepieciešama papildu informācija — izpildījums tiek saglabāts kā gaidošs un karte rāda dzintara gaidošo stāvokli. Katrs apstāšanās saglabā savu atbildes virsmu: HITL pārskata saite HITL, Codex turpmākā ekrāna saite Codex.

Kad Jūs atbildat, ķēde turpina darboties pati: apstājusies workflow pabeidz, tās iznākums nonāk kartē, pārējā šīs kolonnas ķēde tiek izpildīta, un karte pārvietojas kā parasti. Ja atsāktā izpilde neizdodas, karte kļūst sarkana un atlikušās saites tiek izlaistas.

## Saistītie

- [Workflows](./workflows-tab.md)
- [Izpildes vēsture](../reference/execution-history.md)
- [Izteiksmju DSL](../reference/expression-dsl.md)
- [Cilvēks ciklā](../reference/human-in-the-loop.md)
