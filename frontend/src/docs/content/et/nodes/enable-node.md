# Node'i lubamine

**Node'i lubamine** node lülitab teise node'i uuesti sisse. Käivitamisel määrab see sihtnode'i `active` väärtuseks `true` ja salvestab muudatuse püsivalt. See on [Node'i keelamise](./disable-node.md) vastand: kasutage seda [Cron](./cron-node.md) triggeri või mis tahes väljalülitatud node'i uuesti aktiveerimiseks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Node'i identifikaator (camelCase) |
| `targetNodeLabel` | string | Lubatava node'i silt (nt `hourlyCheck`) |

## Käitumine

- Siht salvestatakse aktiivsena, nii et tulevased käivitused ja triggerid näevad seda. Uuesti lubatud Cron trigger käivitub taas oma järgmisel planeeritud ajal.
- Kui siht asub Node'i lubamise node'ist allavoolu ja pole veel käivitunud, käivitub see ka praeguses käivituses.
- Juba aktiivse node'i lubamine ei muuda midagi; väljund teatab endiselt `enabled: true`.
- Node nurjub veaga, kui `targetNodeLabel` on tühi või ühelgi node'il pole seda silti.

## Kasutusjuhtum

Käivitage [Cron](./cron-node.md) trigger nõudmisel. Salvestage Cron node väljalülitatuna ja andke workflow'le teine sisendpunkt, näiteks [Input](./input-node.md) trigger. Päring sellele sisendpunktile käivitab Node'i lubamise node'i ja Cron hakkab käivituma.

Väljalülitatud trigger ei käivita kunagi ise käivitust, seega peab Node'i lubamise node asuma sisendpunkti taga, mis suudab käivituda.

## Näide

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Voog: Input → Node'i lubamine (siht: cron) → Output. Cron node `hourlyCheck` on samas workflow's keelatuna salvestatud ja käivitab lubamise järel omaenda HTTP-kontrolli haru.

## Seotud

- [Node'i tüübid](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Node'i keelamine](./disable-node.md) – Node'i väljalülitamine workflow' seest
- [Cron node](./cron-node.md) – Trigger, mida lubada
- [Tingimuse node](./condition-node.md) – Hargnemine enne lubamist
- [Lõuendi funktsioonid](../reference/canvas-features.md) – Node'i käsitsi lubamine või keelamine
