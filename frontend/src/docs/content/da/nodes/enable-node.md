# Enable Node

**Enable Node**-noden aktiverer en anden node igen. Når den udføres, sættes `active` for mål-noden til `true`, og ændringen gemmes. Den er modstykket til [Disable Node](./disable-node.md): den kan bruges til at genaktivere en [Cron](./cron-node.md)-trigger eller enhver node, der er blevet deaktiveret.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `targetNodeLabel` | string | Label for den node, der skal aktiveres (f.eks. `hourlyCheck`) |

## Adfærd

- Mål-noden gemmes som aktiv, så fremtidige kørsler og triggers registrerer den. En genaktiveret Cron-trigger udløses igen ved dens næste planlagte tidspunkt.
- Hvis mål-noden ligger nedstrøms af Enable Node og endnu ikke er kørt, køres den også i den aktuelle execution.
- Aktivering af en node, der allerede er aktiv, ændrer intet; outputtet rapporterer stadig `enabled: true`.
- Noden fejler med en fejl, hvis `targetNodeLabel` er tom eller ingen node har det label.

## Anvendelsestilfælde

Start en [Cron](./cron-node.md)-trigger efter behov. Gem Cron-noden som deaktiveret, og giv workflowet et sekundært indgangspunkt, f.eks. en [Input](./input-node.md)-trigger. En anmodning til det indgangspunkt udfører Enable Node, og Cron'en begynder at udløse.

En deaktiveret trigger starter aldrig en kørsel af sig selv, så Enable Node skal placeres efter et indgangspunkt, der kan køre.

## Eksempel

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flow: Input → Enable Node (target: cron) → Output. Cron-noden `hourlyCheck` gemmes som deaktiveret i samme workflow og kører sin egen HTTP-check-gren, når den er aktiveret.

## Relateret

- [Node Types](../reference/node-types.md) – Oversigt over alle nodetyper
- [Disable Node](./disable-node.md) – Deaktiver en node fra et workflow
- [Cron Node](./cron-node.md) – Trigger, der kan aktiveres
- [Condition Node](./condition-node.md) – Gren, der kan bruges før aktivering
- [Canvas Features](../reference/canvas-features.md) – Aktiver eller deaktiver en node manuelt
