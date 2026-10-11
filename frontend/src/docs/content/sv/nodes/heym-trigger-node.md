# Heym Trigger

Noden **Heym Trigger** startar en workflow när Heym självt publicerar en plattformshändelse. Det är en trigger-nod utan indata för att automatisera Heym med Heym: ändringar i granskningsloggar, distributionsmeddelanden och sammanställningar av instansens hälsotillstånd.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 0 |
| Utdata | 1 |
| Utdata | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Autentiseringsuppgifter | Inga krävs |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `eventNames` | Strängarray | Vilka händelser som ska prenumereras på. Lämna tomt för att ta emot samtliga händelser. |

## Händelser

| Händelse | Publiceras när | Omfattning |
|----------|----------------|------------|
| `heym.started` | Heym-plattformen startar | Instansövergripande: samtliga prenumeranter tar emot den |
| `workflow.created` | En workflow skapas | Endast workflowens ägares prenumeranter |
| `workflow.updated` | En workflow sparas | Endast workflowens ägares prenumeranter |
| `workflow.deleted` | En workflow raderas | Endast workflowens ägares prenumeranter |

Instrumentpanelswidgetar lagras internt som workflows, men de producerar aldrig `workflow.*`-händelser.

## Leverans sker i batchar

Heym skickar händelser var femte sekund. **Samtliga händelser som hämtas i en och samma leveransomgång anländer i en enda workflow-körning**, som en array.

- Skapa två workflows inom fem sekunder från varandra → **en** körning med två händelser.
- Skapa en workflow → **en** körning med en array med ett element.

Formen förändras aldrig, så nedströmsuttryck behöver aldrig förgrena sig beroende på om en eller flera händelser anlände. När en åtgärd behöver utföras en gång per händelse placeras en [Loop](./loop-node.md)-nod över `$nodeLabel.events`.

## Leverans exakt en gång

Varje händelse hämtas per prenumererande nod via en unik databasbegränsning innan den levereras. Detta gäller över samtliga uvicorn-arbetare, samtliga containrar och samtliga maskiner: att köra Heym på två servrar levererar inte en händelse två gånger. Om en hämtning inte kan registreras levereras händelsen inte alls — konstruktionen misslyckas stängt i stället för att utlösas två gånger.

Två olika `heymTrigger`-noder som prenumererar på samma händelse tar emot den en gång var; de konkurrerar inte om den.

## Leveransfönstret

Leveransfunktionen beaktar endast händelser som publicerats under de **senaste fem minuterna**. Äldre händelser finns kvar i loggen för granskning men levereras aldrig. Detta begränsar vad som händer efter driftstopp: att starta Heym igen efter en timmes frånvaro spelar inte upp något, i stället för att skicka en timmes eftersläpning på en gång.

Händelser sparas i **7 dagar** och raderas därefter.

## Utdatafält

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.events` | Array med händelseobjekt, äldst först. Alltid en array. |
| `$nodeLabel.events[0].id` | Händelsens UUID |
| `$nodeLabel.events[0].name` | Händelsenamn, till exempel `workflow.created` |
| `$nodeLabel.events[0].payload` | Händelsens innehåll |
| `$nodeLabel.events[0].workflow_id` | Den berörda workflowens id, eller `null` för `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO-tidsstämpel för när händelsen publicerades |
| `$nodeLabel.count` | Antal händelser i denna batch |
| `$nodeLabel.triggered_at` | ISO-tidsstämpel för workflow-körningen |

### Payload-strukturer

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

`workflow.deleted` innehåller det namn som fångades precis före raderingen, eftersom workflow-raden är borta när händelsen läses.

## Exempel på workflow

**Granskningslogg för workflow-ändringar**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** med etiketten `platformEvents`, prenumererar på `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym**-nod med `getWorkflow` och `heymWorkflowId` satt till `$platformEvents.events[0].workflow_id`
- **Slack**-meddelande: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Anmärkningar

- `heym.started` utlöses **en gång per plattformsstart**, inte en gång per arbetare, trots att Heym kör åtta arbetare per container. Containrar som startar mer än fem minuter isär publicerar var sin händelse.
- Körningar som utlöses på detta sätt visas i historiken med `trigger_source = "heym_event"`.
- Ange **Events** till inga i stället för att lista alla fyra om händelsetyper som tillkommer i framtida versioner automatiskt ska fångas upp.

## Relaterat

- [Heym](./heym-node.md) – Läs workflows och körningshistorik
- [Triggers](../reference/triggers.md) – Översikt över samtliga workflow-ingångspunkter
- [Loop](./loop-node.md) – Utför en åtgärd en gång per händelse i en batch
