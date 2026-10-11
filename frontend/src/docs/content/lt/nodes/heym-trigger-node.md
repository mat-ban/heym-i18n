# Heym Trigger

**Heym Trigger** mazgas pradeda workflow, kai Heym pats paskelbia platformos įvykį. Tai yra nulinio įvesties trigger mazgas, skirtas automatizuoti Heym su Heym: keisti audito takus, skelbti pranešimus ir teikti instancijos sveikatos santraukas.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Kredencialai | Nereikia |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `eventNames` | String masyvas | Kuriuos įvykius prenumeruoti. Palikite tuščią, kad gautumėte kiekvieną įvykį. |

## Įvykiai

| Įvykis | Paskelbtas, kai | Apimtis |
|--------|----------------|---------|
| `heym.started` | Heym platforma pradeda | Visos instancijos: kiekvienas prenumeratorius jį gauna |
| `workflow.created` | Workflow sukuriamas | Tik workflow savininko prenumeratoriai |
| `workflow.updated` | Workflow išsaugomas | Tik workflow savininko prenumeratoriai |
| `workflow.deleted` | Workflow ištrinamas | Tik workflow savininko prenumeratoriai |

Dashboard widget'ai viduje saugomi kaip workflows, tačiau jie niekada nesukelia `workflow.*` įvykių.

## Pristatymas yra grupuojamas

Heym siunčia įvykius kas penkias sekundes. **Kiekvienas įvykis, kuris buvo užfiksuotas vieno pristatymo metu, atkeliauja į vieną workflow vykdymą**, kaip masyvas.

- Sukurkite du workflows per penkias sekundes → **vienas** vykdymas su dviem įvykiais.
- Sukurkite vieną workflow → **vienas** vykdymas su vieno elemento masyvu.

Forma niekada nesikeičia, todėl žemiau esančios išraiškos niekada neturi šakotis, ar atėjo vienas įvykis, ar daug. Kai reikia veikti vieną kartą kiekvienam įvykiui, uždėkite [Loop](./loop-node.md) mazgą ant `$nodeLabel.events`.

## Tikslus vieno karto pristatymas

Kiekvienas įvykis yra užfiksuojamas kiekvieno prenumeruojančio mazgo per unikalų duomenų bazės apribojimą prieš jį pristatant. Tai galioja visiems uvicorn darbuotojams, kiekvienam konteineriui ir kiekvienai mašinai: vykdant Heym ant dviejų serverių, įvykis nebus pristatomas du kartus. Jei užklausa negali būti užfiksuota, įvykis visai nebus pristatytas — dizainas užsidaro, o ne iššoka du kartus.

Du skirtingi `heymTrigger` mazgai, prenumeruojantys tą patį įvykį, kiekvienas gauna jį vieną kartą; jie nesivaržys dėl jo.

## Pristatymo langas

Pristatymo sistema apsvarsto tik įvykius, paskelbtus **paskutinėmis penkiomis minutėmis**. Senesni įvykiai lieka žurnale peržiūrai, tačiau niekada nėra pristatomi. Tai riboja, kas vyksta po neveikimo: atnaujinus Heym po valandos neveikimo, niekas nebus pakartotas, o ne iššokti valandos atidėjimo.

Įvykiai saugomi **7 dienas** ir tada ištrinami.

## Išvesties laukai

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.events` | Įvykių objektų masyvas, seniausias pirmas. Visada masyvas. |
| `$nodeLabel.events[0].id` | Įvykio UUID |
| `$nodeLabel.events[0].name` | Įvykio pavadinimas, pavyzdžiui, `workflow.created` |
| `$nodeLabel.events[0].payload` | Įvykio turinys |
| `$nodeLabel.events[0].workflow_id` | Subjekto workflow id, arba `null` už `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO laiko žymė, kada įvykis buvo paskelbtas |
| `$nodeLabel.count` | Įvykių skaičius šiame pakete |
| `$nodeLabel.triggered_at` | ISO laiko žymė workflow vykdymui |

### Payload formos

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Naktinis ataskaita",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` neša pavadinimą, užfiksuotą prieš ištrinant, kadangi workflow eilutė jau bus dingusi, kai skaitysite įvykį.

## Pavyzdinis Workflow

**Workflow keitimo audito takas**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** etiketė `platformEvents`, prenumeruojanti `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym** mazgas su `getWorkflow` ir `heymWorkflowId` nustatytu į `$platformEvents.events[0].workflow_id`
- **Slack** pranešimas: `"$platformEvents.count workflow keitimas(-ai), naujausias: $platformEvents.events[0].name"`

## Pastabos

- `heym.started` įvyksta **vieną kartą per platformos paleidimą**, o ne vieną kartą per darbuotoją, nors Heym veikia aštuonis darbuotojus per konteinerį. Kiekvienas konteineris, kuris pradeda daugiau nei penkių minučių skirtumu, kiekvienas paskelbia vieną įvykį.
- Vykdymai, sukelti šiuo būdu, istorijoje pasirodo su `trigger_source = "heym_event"`.
- Nustatykite **Įvykius** į nieką, o ne išvardinkite visus keturis, jei norite automatiškai gauti ateityje pridėtus įvykio tipus.

## Susiję

- [Heym](./heym-node.md) – Skaityti workflows ir vykdymo istoriją
- [Triggers](../reference/triggers.md) – Visų workflow įėjimo taškų apžvalga
- [Loop](./loop-node.md) – Veikti vieną kartą kiekvienam įvykiui grupėje
