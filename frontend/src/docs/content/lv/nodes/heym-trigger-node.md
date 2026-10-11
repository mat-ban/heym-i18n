# Heym Trigger

**Heym Trigger** mezgls palaiž workflow, kad pats Heym publicē platformas notikumu. Tas ir trigger mezgls bez ievades datiem, kas paredzēts Heym automatizēšanai ar Heym palīdzību: izmaiņu audita žurnāliem, izvietošanas paziņojumiem un instances veselības kopsavilkumiem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Akreditācijas dati | Nav nepieciešami |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `eventNames` | String masīvs | Kuriem notikumiem abonēt. Atstājiet tukšu, lai saņemtu visus notikumus. |

## Notikumi

| Notikums | Tiek publicēts, kad | Tvērums |
|-------|----------------|-------|
| `heym.started` | Heym platforma tiek palaista | Visai instancei: katrs abonents to saņem |
| `workflow.created` | Tiek izveidots workflow | Tikai workflow īpašnieka abonenti |
| `workflow.updated` | Workflow tiek saglabāts | Tikai workflow īpašnieka abonenti |
| `workflow.deleted` | Workflow tiek dzēsts | Tikai workflow īpašnieka abonenti |

Informācijas paneļa logrīki iekšēji tiek glabāti kā workflow, taču tie nekad neģenerē `workflow.*` notikumus.

## Piegāde tiek veikta paketēs

Heym nosūta notikumus ik pēc piecām sekundēm. **Katrs notikums, kas tiek pieprasīts vienā nosūtīšanas ciklā, nonāk vienā workflow izpildē**, kā masīvs.

- Izveidojiet divus workflow piecu sekunžu laikā vienu pēc otra → **viena** izpilde ar diviem notikumiem.
- Izveidojiet vienu workflow → **viena** izpilde ar viena elementa masīvu.

Struktūra nekad nemainās, tāpēc lejupstraumes izteiksmēm nekad nav jāzaro, vai ienāca viens notikums vai vairāki. Ja nepieciešams veikt darbību vienu reizi uz notikumu, ievietojiet [Loop](./loop-node.md) mezglu virs `$nodeLabel.events`.

## Piegāde tieši vienu reizi

Katrs notikums tiek pieprasīts katram abonējošajam mezglam, izmantojot unikālu datubāzes ierobežojumu, pirms tas tiek piegādāts. Tas tiek ievērots visos uvicorn worker, visos konteineros un visās mašīnās: Heym darbināšana uz diviem serveriem nepiegādā notikumu divreiz. Ja pieprasījumu nav iespējams reģistrēt, notikums netiek piegādāts vispār — dizains sabojājas droši, nevis nostrādā divreiz.

Divi dažādi `heymTrigger` mezgli, kas abonē vienu un to pašu notikumu, katrs to saņem vienu reizi; tie nekonkurē par to.

## Nosūtīšanas logs

Dispečers ņem vērā tikai notikumus, kas publicēti **pēdējo piecu minūšu** laikā. Vecāki notikumi paliek žurnālā apskatei, bet nekad netiek piegādāti. Tas ierobežo to, kas notiek pēc dīkstāves: Heym atjaunošana pēc stundu ilgas bezsaistes neatskaņo neko, tā vietā nenosūtot stundas garu uzkrājumu uzreiz.

Notikumi tiek glabāti **7 dienas** un pēc tam tiek dzēsti.

## Izvades lauki

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.events` | Notikumu objektu masīvs, vecākais pirmais. Vienmēr masīvs. |
| `$nodeLabel.events[0].id` | Notikuma UUID |
| `$nodeLabel.events[0].name` | Notikuma nosaukums, piemēram, `workflow.created` |
| `$nodeLabel.events[0].payload` | Notikuma pamatteksts |
| `$nodeLabel.events[0].workflow_id` | Attiecīgā workflow id vai `null` attiecībā uz `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO laika zīmogs, kad notikums tika publicēts |
| `$nodeLabel.count` | Notikumu skaits šajā paketē |
| `$nodeLabel.triggered_at` | ISO laika zīmogs workflow izpildei |

### Payload struktūras

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

`workflow.deleted` satur nosaukumu, kas tika fiksēts tieši pirms dzēšanas, jo workflow ieraksts jau ir pazudis brīdī, kad Jūs nolasāt notikumu.

## Workflow piemērs

**Workflow izmaiņu audita žurnāls**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** ar apzīmējumu `platformEvents`, abonēts uz `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym** mezgls ar `getWorkflow` un `heymWorkflowId` iestatītu uz `$platformEvents.events[0].workflow_id`
- **Slack** ziņojums: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Piezīmes

- `heym.started` nostrādā **vienu reizi uz platformas palaišanu**, nevis vienu reizi uz worker, lai gan Heym darbojas ar astoņiem worker uz konteineru. Konteineri, kas tiek palaisti vairāk nekā piecas minūtes viens no otra, katrs publicē vienu notikumu.
- Šādā veidā aktivizētās izpildes parādās vēsturē ar `trigger_source = "heym_event"`.
- Iestatiet **Events** uz nevienu, nevis uzskaitiet visus četrus, ja vēlaties automātiski uztvert nākamajās versijās pievienotos notikumu tipus.

## Saistītie

- [Heym](./heym-node.md) – Lasīt workflow un izpildes vēsturi
- [Triggers](../reference/triggers.md) – Visu workflow ieejas punktu pārskats
- [Loop](./loop-node.md) – Veikt darbību vienu reizi uz notikumu paketē
