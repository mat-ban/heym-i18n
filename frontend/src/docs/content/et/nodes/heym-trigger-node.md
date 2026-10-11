# Heym Trigger

**Heym Trigger** node käivitab workflow, kui Heym ise avaldab platvormi sündmuse. See on null-sisendiga trigger-node Heymi automatiseerimiseks Heymiga: muudatuste auditeerimisjäljed, juurutusteated ja instantsi tervise kokkuvõtted.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Mandaat | Pole vajalik |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `eventNames` | String array | Millistele sündmustele tellida. Jätke tühjaks, et saada kõik sündmused. |

## Sündmused

| Sündmus | Avaldatakse, kui | Ulatus |
|-------|----------------|-------|
| `heym.started` | Heymi platvorm käivitub | Instantsiülene: iga tellija saab selle kätte |
| `workflow.created` | Workflow luuakse | Ainult workflow omaniku tellijad |
| `workflow.updated` | Workflow salvestatakse | Ainult workflow omaniku tellijad |
| `workflow.deleted` | Workflow kustutatakse | Ainult workflow omaniku tellijad |

Armatuurlaudade vidinad salvestatakse sisemiselt workflow'dena, kuid need ei tekita kunagi `workflow.*` sündmusi.

## Kohaletoimetamine on pakettidena

Heym saadab sündmusi iga viie sekundi tagant. **Iga sündmus, mis ühe saatmistsükli jooksul kätte saadakse, saabub ühes workflow käivituses**, massiivina.

- Looge kaks workflow'd viie sekundi jooksul → **üks** käivitus kahe sündmusega.
- Looge üks workflow → **üks** käivitus üheelemendilise massiiviga.

Kuju ei muutu kunagi, seega allavoolu avaldised ei pea kunagi harunema selle põhjal, kas saabus üks või mitu sündmust. Kui on vaja tegutseda üks kord iga sündmuse kohta, asetage [Loop](./loop-node.md) node `$nodeLabel.events` kohale.

## Täpselt-üks-kordne kohaletoimetamine

Iga sündmus võetakse kätte iga telliva node'i kohta unikaalse andmebaasipiirangu kaudu enne selle kohaletoimetamist. See kehtib iga uvicorn töötaja, iga konteineri ja iga masina kohta: Heymi käitamine kahel serveril ei toimeta sündmust kaks korda. Kui kättesaamist ei saa registreerida, ei toimetata sündmust üldse kohale — disain ebaõnnestub suletult, mitte ei käivitu kaks korda.

Kaks erinevat `heymTrigger` node'i, mis tellivad sama sündmust, saavad selle kumbki üks kord; nad ei konkureeri selle pärast.

## Saatmisaken

Saatja arvestab ainult sündmusi, mis on avaldatud **viimase viie minuti** jooksul. Vanemad sündmused jäävad logisse ülevaatamiseks, kuid neid ei toimetata kunagi kohale. See piirab seda, mis juhtub pärast seisakut: Heymi taaskäivitamine pärast tund aega võrguühenduseta olemist ei taasesita midagi, selle asemel et käivitada korraga tund aega mahajäämust.

Sündmusi hoitakse **7 päeva** ja seejärel kustutatakse.

## Väljundväljad

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.events` | Sündmusobjektide massiiv, vanimad esimesena. Alati massiiv. |
| `$nodeLabel.events[0].id` | Sündmuse UUID |
| `$nodeLabel.events[0].name` | Sündmuse nimi, näiteks `workflow.created` |
| `$nodeLabel.events[0].payload` | Sündmuse sisu |
| `$nodeLabel.events[0].workflow_id` | Subjekti workflow id või `null` sündmuse `heym.started` korral |
| `$nodeLabel.events[0].created_at` | ISO ajatempel selle kohta, millal sündmus avaldati |
| `$nodeLabel.count` | Sündmuste arv selles paketis |
| `$nodeLabel.triggered_at` | ISO ajatempel workflow käivituse kohta |

### Payload'i kujud

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` sisaldab nime, mis jäädvustati vahetult enne kustutamist, kuna workflow rida on sündmuse lugemise ajaks kadunud.

## Näidis-workflow

**Workflow muudatuste auditeerimisjälg**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** sildiga `platformEvents`, tellitud sündmustele `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym** node'iga `getWorkflow` ja `heymWorkflowId` seatud väärtusele `$platformEvents.events[0].workflow_id`
- **Slack** sõnum: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Märkused

- `heym.started` käivitub **üks kord platvormi käivitamise kohta**, mitte üks kord töötaja kohta, kuigi Heym käitab kaheksat töötajat konteineri kohta. Konteinerid, mis käivituvad rohkem kui viie minuti vahega, avaldavad igaüks ühe sündmuse.
- Sel viisil käivitatud käivitused ilmuvad ajalukku kirjega `trigger_source = "heym_event"`.
- Seadke **Events** mitte millelegi, selle asemel et loetleda kõik neli, kui soovite automaatselt haarata tulevastes versioonides lisatud sündmustüüpe.

## Seotud

- [Heym](./heym-node.md) – Lugege workflow'sid ja käivituste ajalugu
- [Triggers](../reference/triggers.md) – Ülevaade kõigist workflow sisendpunktidest
- [Loop](./loop-node.md) – Tegutsege üks kord iga sündmuse kohta paketis
