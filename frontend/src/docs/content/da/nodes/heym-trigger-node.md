# Heym Trigger

**Heym Trigger**-noden starter et workflow, når Heym selv udgiver en platformbegivenhed. Det er en zero-input trigger-node til automatisering af Heym med Heym: ændringslogfiler, deploy-meddelelser og instanshelbredsoversigter.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Legitimationsoplysninger | Kræves ikke |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `eventNames` | String-array | Hvilke begivenheder der skal abonneres på. Lad stå tomt for at modtage alle begivenheder. |

## Begivenheder

| Begivenhed | Udgivet når | Scope |
|-------|----------------|-------|
| `heym.started` | Heym-platformen starter | Instansomfattende: alle abonnenter modtager den |
| `workflow.created` | Et workflow oprettes | Kun abonnenter, der ejer workflowet |
| `workflow.updated` | Et workflow gemmes | Kun abonnenter, der ejer workflowet |
| `workflow.deleted` | Et workflow slettes | Kun abonnenter, der ejer workflowet |

Dashboard-widgets gemmes internt som workflows, men de udløser aldrig `workflow.*`-begivenheder.

## Levering er batchvis

Heym afsender begivenheder hvert femte sekund. **Alle begivenheder, der registreres i én dispatch-cyklus, ankommer i en enkelt workflow-kørsel** som en array.

- Opret to workflows inden for fem sekunder → **én** kørsel med to begivenheder.
- Opret ét workflow → **én** kørsel med en array med ét element.

Strukturen ændres aldrig, så nedstrømsudtryk behøver ikke at håndtere, om der ankom én eller flere begivenheder. Hvis der skal handles pr. begivenhed, kan en [Loop](./loop-node.md)-node anvendes på `$nodeLabel.events`.

## Exactly-Once Levering

Hver begivenhed registreres pr. abonnerende node gennem en unik databasebegrænsning, før den leveres. Dette gælder på tværs af alle uvicorn-workers, containere og maskiner: kørsel af Heym på to servere resulterer ikke i dobbeltlevering. Hvis en registrering mislykkes, leveres begivenheden slet ikke - designet fejler i lukket tilstand i stedet for at udløse to gange.

To forskellige `heymTrigger`-noder, der abonnerer på samme begivenhed, modtager hver én kopi; de konkurrerer ikke om den.

## Dispatch-vinduet

Dispatcheren overvejer kun begivenheder udgivet inden for de **seneste fem minutter**. Ældre begivenheder forbliver i loggen til inspektion, men leveres aldrig. Dette begrænser konsekvenserne af nedetid: når Heym genstartes efter en times nedetid, genafspilles intet, i stedet for at afvikle en times backlog på én gang.

Begivenheder beholdes i **7 dage** og slettes derefter.

## Output-felter

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.events` | Array af begivenhedsobjekter, ældste først. Altid en array. |
| `$nodeLabel.events[0].id` | Begivenhedens UUID |
| `$nodeLabel.events[0].name` | Begivenhedsnavn, f.eks. `workflow.created` |
| `$nodeLabel.events[0].payload` | Begivenhedens indhold |
| `$nodeLabel.events[0].workflow_id` | Det relevante workflows id, eller `null` for `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO-tidsstempel for, hvornår begivenheden blev udgivet |
| `$nodeLabel.count` | Antal begivenheder i denne batch |
| `$nodeLabel.triggered_at` | ISO-tidsstempel for workflow-udførelsen |

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

`workflow.deleted` indeholder navnet lige før sletning, da workflow-rækken er væk, når begivenheden læses.

## Eksempel-workflow

**Workflow-ændringslog**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** med label `platformEvents`, abonnerer på `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym**-node med `getWorkflow` og `heymWorkflowId` sat til `$platformEvents.events[0].workflow_id`
- **Slack**-besked: `"$platformEvents.count workflow-ændring(er), seneste: $platformEvents.events[0].name"`

## Bemærkninger

- `heym.started` udløses **én gang pr. platformstart**, ikke én gang pr. worker, selvom Heym kører otte workers pr. container. Containere, der starter mere end fem minutter fra hinanden, udgiver hver én begivenhed.
- Kørsler udløst på denne måde vises i historikken med `trigger_source = "heym_event"`.
- Sæt **Events** til ingen i stedet for at liste alle fire, hvis der ønskes automatisk at modtage fremtidige begivenhedstyper.

## Relateret

- [Heym](./heym-node.md) – Læs workflows og kørselshistorik
- [Triggers](../reference/triggers.md) – Oversigt over alle workflow-startpunkter
- [Loop](./loop-node.md) – Håndter hver begivenhed i en batch individuelt
