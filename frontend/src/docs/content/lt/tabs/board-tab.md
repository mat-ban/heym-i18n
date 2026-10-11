# Lenta

**Lentos** skirtas agentiniam kanban valdymui. Darbas juda per stulpelius, o kiekvienas stulpelis gali vykdyti Heym workflows. Kortelė nėra tik užduotis — tai nuolatinis agentinis darbas, kuris neša kontekstą, pokalbių istoriją, vykdymo būseną, išvestis ir workflow vykdymus.

## Lentų ir stulpelių kūrimas

- Galite sukurti tiek lentų, kiek Jums reikia. Nauja lenta prasideda su numatytais stulpeliais **Atidėta → Planavimas → Vystymas → Baigta**.
- Kiekvienai lentei reikalingas **Agentinis Kanban Modelis** (kredencialas plius modelis). Tai yra privaloma — naujos lentos dialogas nesukurs lentos be jo, o lenta, neturinti modelio, išlaiko savo veiksmus neaktyvius — nes būtent modelis priskiria kiekvieną kortelę prie workflows įvesties ir paverčia jų išvestį į skaitomą tekstą.
- Pavaros piktograma lentos antraštėje atidaro lentos nustatymus: pavadinimą, aprašymą (rodoma po antrašte) ir Agentinį Kanban Modelį.
- Stulpeliai yra visiškai redaguojami: pridėkite, pervadinkite, pakeiskite spalvą, pertvarkykite arba ištrinkite juos iš stulpelių nustatymų (stulpelis turi būti tuščias, kad būtų galima jį ištrinti).
- Kortelės yra išdėstytos vertikaliai pagal prioritetą — vilkite, kad pertvarkytumėte.
- Taip pat galite sukurti kortelę iš [Chat skirtuko](./chat-tab.md) su natūralios kalbos užklausa. Chat paprašys Jūsų pasirinkti lentą, kai to prireiks, ir visada pridės kortelę prie tos lentos pirmo stulpelio.

## Lentų dalijimasis

Lentos nustatymai taip pat leidžia dalintis lenta su **naudotojais** (pagal el. paštą) ir su **komandomis**, suteikiant `read` arba `write` teises:

- **read** — lenta ir jos kortelės yra matomos, tačiau nieko negalima keisti: jokių naujų kortelių, jokių judesių, jokių komentarų, jokių vykdymų.
- **write** — visiškas lentos naudojimas: kortelės, judesiai, komentarai ir vykdymai.
- Tik **savininkas** mato pavaros ir ištrynimo mygtukus, ir tik savininkas gali keisti lentos nustatymus, jos Agentinį Kanban Modelį arba dalijimosi nustatymus.

Grandinės bendroje lentoje visada vykdomos su **savininko** kredencialais ir Agentiniu Kanban Modeliu, todėl bendradarbiams niekada nereikia savo.

## Kortelių priedai

Atidarykite kortelę ir naudokite **Pridėti failą**, kad pridėtumėte failus — vilkite juos į dėžutę arba pasirinkite juos mygtuku, ir pašalinkite juos iš tos pačios sąrašo. Priedai saugomi [Drive](./drive-tab.md).

Kiekvienas vykdymas **išsprendžia priedus prieš pradedant workflows**, pagal tipą:

- **Dokumentai** (pdf, markdown, csv, json, text) yra ištraukiami į tekstą, ribojant iki 20,000 simbolių vienam failui, priedo `text` lauke.
- **Vaizdai** perduodami kaip `url`, kurį vizijos mazgo įvestis priima tiesiogiai (LLM mazgo vaizdo įvestis priima jį tokį, koks yra).
- **Kiti failai** perduodami kaip paprastas nuoroda (`name`, `url`, `mime_type`).

Workflows juos skaito adresu `$input.card.attachments` (ir visada adresu `$input.board.attachments`, nesvarbu, kaip mapperis juos priskyrė). Agentinis Kanban Modelis mato ištrauktą tekstą ir vaizdų URL, todėl gali priskirti priedą tiesiai į lauką, kurio tikisi workflow.

## Stulpelių workflow grandinės

Kiekvienas stulpelis gali būti sukonfigūruotas su **užsakytų workflows sąrašu** (grandine). Kai kortelė juda į stulpelį, kuriame yra grandinė:

1. Grandinė automatiškai prasideda fone — judėjimas niekada nesulaukia.
2. Workflows vykdomi **nuosekliai**. Kiekvieno workflow išvestis pridedama prie kortelės konteksto prieš pradedant kitą.
3. Jei workflow nepavyksta, grandinė sustoja: likusios nuorodos praleidžiamos, o kortelė tampa **raudona**.
4. Kai kiekviena nuoroda pavyksta, kortelė tampa **žalia**. Kol grandinė vykdoma, kortelė pulsuoja **geltonai**; vykdymas, sustabdytas žmogaus peržiūrai, rodo statišką geltoną būseną.

Vykdymai registruojami [Vykdymo istorijoje](../reference/execution-history.md) su `board` trigger šaltiniu, o kiekviena kortelė išlaiko savo vykdymo sąrašą su kiekvieno workflow išvestimis ir klaidomis. Atidarykite kortelę, kol vyksta workflow, ir pasirinkite **Atidaryti gyvai** šalia vykdymo, kad prijungtumėte redaktorių prie to tikslaus vykdymo. Ta pati drobės animacija, palaipsniui Debug žurnalai ir galutinis rezultatas pasirodo be antro vykdymo pradėjimo.
## Ką gauna workflows

Grandinė perduoda standartinį payload kaip workflow įvestį. Ją galima perskaityti naudojant įprastas
[expressions](../reference/expression-dsl.md), tokias kaip `$input.card.title`:

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

- `comments` — kiekvienas komentaras kortelėje, nuo seniausio iki naujausio.
- `history` — visa veiklos laiko juosta (komentarai, judėjimai, išvestys), apribota iki
  200 naujausių įrašų.
- `previous_outputs` — ankstesnių užbaigtų vykdymų išvestys (ankstesnės kolonos ir
  sekantys raundai).
- `chain.previous_workflow_outputs` — ankstesnių nuorodų išvestys *dabartinėje*
  grandinėje.
- Sekančiuose raunduose `move` yra `null`, o `rerun` yra `true`.

## Planavimo ciklas (sekantys raundai)

Įprasta schema yra įdėti planavimo workflow į **antrą koloną** (pagal numatytuosius nustatymus
vadinama Planavimas — pavadinimas nėra svarbus; svarbu yra vieta). Tas workflow praturtina
kortelę ir užduoda sekantį klausimą:

1. Perkelkite kortelę į antrą koloną — workflow rašo praturtintą planą ir jo
   klausimus atgal į kortelę kaip išvestį.
2. Atsakykite kortelės komentarų srityje. Atsakymas išlaisvina kortelę: ji pereina į
   kitą koloną, kuri ją paima su atsakymu kontekste. Antros kolonos grandinė nebebus vykdoma.
3. Norint patobulinti planą vietoje, paspauskite **Vykdyti sekantį raundą**. Ta pati
   grandinė vėl vykdoma su visais sukauptais kontekstais, tada kortelė laukia toje kolonoje,
   kol pridėsite komentarą, kad ją išlaisvintumėte.

Planavimo vartai yra poziciniai, o ne pavadinimo pagrindu: kairiausia kolona ir kolona
tiesiai dešinėje niekada nesikels pačios — jos vykdo savo grandinę ir laukia
jūsų (komentaras išlaisvina antrą koloną). Nuo trečios kolonos sėkminga grandinė
pati perkelia kortelę į dešinę, visą kelią iki paskutinės kolonos. Pervadinimas ar
šalinti numatytąjį "Planavimo" etiketę nekeičia, kuri vieta yra vartai. Kortelė gali turėti
tik vieną aktyvų vykdymą vienu metu.

## Žmogus cikle ir Codex klausimai

Jei grandinės workflow sustoja — ant [Human-in-the-Loop](../reference/human-in-the-loop.md)
mazgo, ant agento HITL įrankio, arba todėl, kad [Codex](../nodes/codex-node.md) mazgas
reikia daugiau informacijos — vykdymas išsaugomas kaip laukiamas, o kortelė rodo
oranžinę laukimo būseną. Kiekvienas sustojimas turi savo atsakymo paviršių: HITL
peržiūros nuorodą HITL, Codex sekimo ekraną Codex.

Kai atsakote, grandinė tęsiasi pati: sustabdytas workflow baigiasi, jo išvestis
nukeliauja į kortelę, likusi tos kolonos grandinė vykdoma, ir kortelė juda kaip įprasta.
Jei atnaujintas vykdymas nepavyksta, kortelė tampa raudona, o likusios nuorodos
yra praleidžiamos.

## Susiję

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
