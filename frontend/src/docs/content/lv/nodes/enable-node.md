# Enable Node

**Enable Node** mezgls atkal ieslēdz citu mezglu. Kad tas tiek izpildīts, tas iestata mērķa mezgla `active` uz `true` un saglabā izmaiņas. Tas ir pretējais [Disable Node](./disable-node.md): izmantojiet to, lai atkārtoti aktivizētu [Cron](./cron-node.md) trigger vai jebkuru mezglu, kas tika izslēgts.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `targetNodeLabel` | string | Iespējojamā mezgla label (piem., `hourlyCheck`) |

## Darbība

- Mērķis tiek saglabāts kā aktīvs, tāpēc turpmākās izpildes un trigger to redz. Atkārtoti iespējots Cron trigger atkal nostrādā savā nākamajā ieplānotajā laikā.
- Ja mērķis atrodas lejup pa straumi no Enable Node un vēl nav izpildīts, tas arī tiek izpildīts pašreizējā izpildē.
- Jau aktīva mezgla iespējošana neko nemaina; izvade joprojām norāda `enabled: true`.
- Mezgls neizdodas ar kļūdu, ja `targetNodeLabel` ir tukšs vai nevienam mezglam nav šāda label.

## Lietošanas gadījums

Palaidiet [Cron](./cron-node.md) trigger pēc pieprasījuma. Saglabājiet Cron mezglu izslēgtu un piešķiriet workflow otru ieejas punktu, piemēram, [Input](./input-node.md) trigger. Pieprasījums uz šo ieejas punktu izpilda Enable Node, un Cron sāk darboties.

Izslēgts trigger nekad pats neuzsāk izpildi, tāpēc Enable Node ir jāatrodas aiz ieejas punkta, kas var darboties.

## Piemērs

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Plūsma: Input → Enable Node (mērķis: cron) → Output. Cron mezgls `hourlyCheck` tajā pašā workflow tiek saglabāts kā izslēgts un pēc iespējošanas izpilda savu HTTP pārbaudes zaru.

## Saistītais

- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Disable Node](./disable-node.md) – Izslēdziet mezglu no workflow iekšienes
- [Cron Node](./cron-node.md) – Iespējojamais trigger
- [Condition Node](./condition-node.md) – Sazarojums pirms iespējošanas
- [Canvas Features](../reference/canvas-features.md) – Iespējojiet vai izslēdziet mezglu manuāli
