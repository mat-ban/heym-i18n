# Heym Trigger

De **Heym Trigger**-node start een workflow wanneer Heym zelf een platformgebeurtenis publiceert. Het is een trigger-node zonder invoer voor het automatiseren van Heym met Heym: wijzigingsaudittrails, deploymentaankondigingen en health-overzichten van de instantie.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Referentie | Geen vereist |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `eventNames` | String array | Op welke gebeurtenissen u zich wilt abonneren. Laat leeg om elke gebeurtenis te ontvangen. |

## Gebeurtenissen

| Gebeurtenis | Gepubliceerd wanneer | Bereik |
|-------|----------------|-------|
| `heym.started` | Het Heym-platform start | Instantiebreed: elke abonnee ontvangt deze |
| `workflow.created` | Een workflow wordt aangemaakt | Alleen abonnees van de workflow-eigenaar |
| `workflow.updated` | Een workflow wordt opgeslagen | Alleen abonnees van de workflow-eigenaar |
| `workflow.deleted` | Een workflow wordt verwijderd | Alleen abonnees van de workflow-eigenaar |

Dashboardwidgets worden intern opgeslagen als workflows, maar produceren nooit `workflow.*`-gebeurtenissen.

## Levering is gebundeld

Heym verzendt gebeurtenissen elke vijf seconden. **Elke gebeurtenis die in één verzendronde wordt opgeëist, arriveert in één enkele workflow-uitvoering**, als een array.

- Maak twee workflows binnen vijf seconden van elkaar aan → **één** uitvoering met twee gebeurtenissen.
- Maak één workflow aan → **één** uitvoering met een array van één element.

De vorm verandert nooit, dus downstream-expressies hoeven nooit te vertakken op basis van of er één of meerdere gebeurtenissen zijn aangekomen. Wanneer u één keer per gebeurtenis wilt handelen, plaatst u een [Loop](./loop-node.md)-node over `$nodeLabel.events`.

## Exactly-once-levering

Elke gebeurtenis wordt per abonnerende node opgeëist via een unieke databasebeperking voordat deze wordt geleverd. Dit geldt voor elke uvicorn-worker, elke container en elke machine: het draaien van Heym op twee servers levert een gebeurtenis niet tweemaal. Als een claim niet kan worden vastgelegd, wordt de gebeurtenis helemaal niet geleverd — het ontwerp faalt gesloten in plaats van tweemaal af te vuren.

Twee verschillende `heymTrigger`-nodes die zich op dezelfde gebeurtenis abonneren, ontvangen deze elk één keer; ze concurreren er niet om.

## Het verzendvenster

De dispatcher beschouwt alleen gebeurtenissen die in de **afgelopen vijf minuten** zijn gepubliceerd. Oudere gebeurtenissen blijven in het logboek voor inspectie, maar worden nooit geleverd. Dit begrenst wat er gebeurt na downtime: het opnieuw opstarten van Heym na een uur offline speelt niets opnieuw af, in plaats van een uur aan achterstand in één keer af te vuren.

Gebeurtenissen worden **7 dagen** bewaard en daarna verwijderd.

## Uitvoervelden

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.events` | Array van gebeurtenisobjecten, oudste eerst. Altijd een array. |
| `$nodeLabel.events[0].id` | Gebeurtenis-UUID |
| `$nodeLabel.events[0].name` | Naam van de gebeurtenis, bijvoorbeeld `workflow.created` |
| `$nodeLabel.events[0].payload` | Gebeurtenisbody |
| `$nodeLabel.events[0].workflow_id` | Id van de betreffende workflow, of `null` voor `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO-tijdstempel voor wanneer de gebeurtenis is gepubliceerd |
| `$nodeLabel.count` | Aantal gebeurtenissen in deze batch |
| `$nodeLabel.triggered_at` | ISO-tijdstempel voor de workflow-uitvoering |

### Payload-vormen

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

`workflow.deleted` bevat de naam die vlak vóór verwijdering is vastgelegd, aangezien de workflow-rij verdwenen is op het moment dat u de gebeurtenis leest.

## Voorbeeldworkflow

**Audittrail van workflowwijzigingen**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** label `platformEvents`, geabonneerd op `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym**-node met `getWorkflow` en `heymWorkflowId` ingesteld op `$platformEvents.events[0].workflow_id`
- **Slack**-bericht: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Opmerkingen

- `heym.started` wordt **één keer per platformstart** afgevuurd, niet één keer per worker, ook al draait Heym acht workers per container. Containers die meer dan vijf minuten na elkaar starten, publiceren elk één gebeurtenis.
- Uitvoeringen die op deze manier worden getriggerd, verschijnen in de geschiedenis met `trigger_source = "heym_event"`.
- Stel **Events** in op geen in plaats van alle vier op te sommen als u gebeurtenistypen die in toekomstige versies worden toegevoegd automatisch wilt oppikken.

## Gerelateerd

- [Heym](./heym-node.md) – Workflows en uitvoeringsgeschiedenis lezen
- [Triggers](../reference/triggers.md) – Overzicht van alle workflow-entrypoints
- [Loop](./loop-node.md) – Eén keer per gebeurtenis in een batch handelen
