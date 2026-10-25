# Heym

**Heym** node loeb Heymi enda andmeid: workflow'sid, millele teil on juurdepääs, ühe workflow struktuuri ja selle käivituste ajalugu. See on viis, kuidas luua meta-workflow'sid — instantsi inventuure, käivituste kokkuvõtteid ja terviseraporteid Heymi enda kohta.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Operatsioonid | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Mandaat | Pole vajalik |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `heymOperation` | Valik | Millist lugemist teostada |
| `heymWorkflowId` | UUID | Määrake see `getExecutionHistory` puhul väärtusele `all`, et lugeda iga ligipääsetavat Workflow'd. |
| `heymLimit` | String | Maksimaalne tagastatavate ridade arv. **Jätke tühjaks või sisestage `0`, et tagastada kõik** — see on vaikeväärtus. Toetab avaldisi. |
| `heymStatus` | String | Valikuline olekufilter `getExecutionHistory` jaoks. Toetab avaldisi. |
| `heymSinceDays` | String | Valikuline tagasivaade päevades `getExecutionHistory` jaoks. Toetab avaldisi. |

Workflow valija on otsitav rippmenüü, mis loetleb kõik workflow'd, millele teil on juurdepääs.

## Juurdepääsu ulatus

Tulemused on piiratud **selle workflow omanikuga, milles node asub** — mitte sellega, kes käivituse algatas. Nähtav kogum on:

- workflow'd, mille omanik on omanik,
- workflow'd, mis on otseselt omanikuga jagatud,
- workflow'd, mis on jagatud meeskonnaga, kuhu omanik kuulub.

Omanikupõhine piiramine tagab, et node käitub ühtemoodi olenemata sellest, kas käivitus algatati käsitsi, cron'i poolt, portaalist või platvormi sündmuse poolt. Tegutsejapõhine piiramine tagastaks tühja tulemuse igal järelevalveta käivitusel. See on sama reegel, mida Heym juba kasutab mandaatide ja globaalsete muutujate puhul.

Workflow, millele teil puudub juurdepääs, ja workflow, mida ei eksisteeri, annavad sama veateate, seega ei saa node'i kasutada workflow'de id-de sondeerimiseks.

## Operatsioonid

### Workflow'de loetlemine

Tagastab iga workflow, millele omanikul on juurdepääs, kõige hiljuti uuendatud esimesena.

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.workflows` | Workflow kokkuvõtete massiiv |
| `$nodeLabel.workflows[0].id` | Workflow UUID |
| `$nodeLabel.workflows[0].name` | Workflow nimi |
| `$nodeLabel.workflows[0].description` | Kirjeldus või `null` |
| `$nodeLabel.workflows[0].active` | Kas workflow on aktiivne |
| `$nodeLabel.workflows[0].folder_id` | Kausta UUID või `null` |
| `$nodeLabel.workflows[0].updated_at` | Viimase salvestamise ISO ajatempel |
| `$nodeLabel.workflows[0].node_count` | Mitu node'i workflow sisaldab |
| `$nodeLabel.total` | Täielik juurdepääsetav arv **enne** limiidi rakendamist |

`total` on tahtlikult piiramata arv, seega `$inventory.total` raporteerib endiselt tegelikku suurust ka siis, kui piirate tagastatavaid ridu. **Limit** välja tühjendamine või selle seadmine väärtusele `0` tagastab iga workflow — mis on vaikeväärtus.

### Workflow hankimine

Tagastab ühe workflow identiteedi ja kuju.

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflow identiteet |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflow metaandmed |
| `$nodeLabel.node_count` | Node'ide arv |
| `$nodeLabel.nodes` | Massiiv kujul `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Massiiv kujul `{ id, source, target, sourceHandle, targetHandle }` |

`data` on **täielik node'i konfiguratsioon** — iga väli nii, nagu see salvestati. Just see teeb auditeerimise võimalikuks: te ei saa workflow'd skaneerida API võtme osas, mille keegi väljale kleepis, kui node keeldub välja näitamast.

See ei anna juurdepääsu, mida kutsujal juba ei olnud. Node on piiratud workflow'dega, mille omanik saab niikuinii redaktoris avada, ja salvestatud mandaadi saladused ei ole endiselt siin: node'i andmed sisaldavad ainult mandaadi **id-sid**, samal ajal kui saladused ise asuvad krüpteeritult mandaatide tabelis.

### Kõvakodeeritud saladuste skaneerimine

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Andke agendile `$detail.nodes` ja paluge tal märkida iga `data` väärtus, mis näeb välja nagu elus võti või token. Väljad, mida tasub jälgida, on vabatekstilised — `curl` HTTP node'idel, `userMessage` ja `systemInstruction` LLM ja Agent node'idel ning Python tööriistade kehad — sest mandaadi id on kahjutu UUID, kuid kleepitud `sk-…` ei ole.
### Käivituste ajaloo hankimine

Tagastab ühe workflow käivituste ajaloo kirjed, uusimad esimesena.

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.executions` | Ajalookirjete massiiv |
| `$nodeLabel.executions[0].id` | Käivituse UUID |
| `$nodeLabel.executions[0].status` | `success`, `error` jne |
| `$nodeLabel.executions[0].started_at` | ISO ajatempel |
| `$nodeLabel.executions[0].execution_time_ms` | Tegelik kestus |
| `$nodeLabel.executions[0].trigger_source` | Mis käivituse algatas, näiteks `cron` või `heym_event` |
| `$nodeLabel.executions[0].recovered` | Kas käivitus taastati pärast kokkujooksmist |
| `$nodeLabel.executions[0].inputs` | Mida käivitus vastu võttis – triggeri payload või kutsuja sisend |
| `$nodeLabel.executions[0].outputs` | Workflow väljund selle käivituse kohta |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow, kuhu ajalugu kuulub, või `null` valikuga **{AW}** |
`null` valikuga **{AW}** |
| `$nodeLabel.total` | Sobivate käivituste koguarv **enne** limiiti |
| `$nodeLabel.by| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Valikuga **{AW}** Workflow, kuhu iga käivitus kuulub |
_status` | Loendid staatuse kaupa, näiteks `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Akna algus või `null` kogu ajaloo korral |

Kirjed sisaldavad nii `inputs` kui ka `outputs` – mida käivitus vastu võttis ja mida tagastas –, kuid mitte kunagi `node_results`: iga sõlme jälg on tabeli suurim veerg ja varjutaks kõik allavoolu jääva. Kui vajate täielikku jälge, hankige üksik käivitus API kaudu.

`total` ja `by_status` kirjeldavad alati **kogu** sobivat ajalugu, isegi kui **Limit** piirab tagastatavate kirjete arvu — seega saate hankida viis viimast käivitust ja siiski esitada täpse veaarvu.

Jätke **Since (days)** tühjaks, et hõlmata kõike, **Status filter** tühjaks, et kaasata kõik staatused, ning **Limit** tühjaks või `0`, et tagastada iga kirje.

## Näidis-workflow

**Igapäevane instantsi kokkuvõte**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` sildiga `inventory`
- **Loop** üle `$inventory.workflows`
- **Heym** `getExecutionHistory`, kus `heymWorkflowId` on seatud loopi üksuse `id`-le, `heymSinceDays` on `1` ja `heymLimit` on `5`
- **LLM** muudab kogutud käivitused ja staatuste loendid loetavaks kokkuvõtteks

## Märkused

- Mandaati pole vaja; sõlm loeb samast andmebaasist, millel Heym töötab.
- **Limit** on sama väli mõlema loendioperatsiooni jaoks ja tähendab mõlemas sama: tühi või `0` tagastab kõik.
- Sõlm võtab vastu tavalise sisendi ja seda saab lisada Agent-sõlmele tööriistana, nii et agent saab vastata küsimustele teie Heymi instantsi kohta — või seda auditeerida.
- `getWorkflow` payloadid kasvavad koos workflow'ga: pikad promptid ja Python-tööriistade sisu liiguvad kõik `data` sees.
- Paigutage see koos [Heym Triggeriga](./heym-trigger-node.md), et reageerida workflow muudatustele nende toimumise hetkel, mitte ajakava alusel küsida.

## Seotud

- [Heym Trigger](./heym-trigger-node.md) – Käivita workflow platvormi sündmustest
- [Execute](./execute-node.md) – Käivita teine workflow, mitte kirjelda seda
- [Loop](./loop-node.md) – Itereeri tagastatud workflow'de loendi üle
