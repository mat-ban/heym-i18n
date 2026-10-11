# Omogući čvor

Čvor **Omogući čvor** ponovno uključuje drugi čvor. Kada se izvrši, postavlja `active` ciljnog čvora na `true` i trajno pohranjuje promjenu. To je pandan čvoru [Onemogući čvor](./disable-node.md): koristite ga za ponovno aktiviranje [Cron](./cron-node.md) triggera ili bilo kojeg čvora koji je bio isključen.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `targetNodeLabel` | string | Oznaka čvora koji se omogućuje (npr. `hourlyCheck`) |

## Ponašanje

- Cilj se pohranjuje kao aktivan, tako da ga buduća izvršavanja i triggeri vide. Ponovno omogućen Cron trigger ponovno se aktivira u sljedećem zakazanom terminu.
- Ako se cilj nalazi nizvodno od čvora Omogući čvor i još nije pokrenut, pokreće se i u trenutnom izvršavanju.
- Omogućavanje čvora koji je već aktivan ne mijenja ništa; izlaz i dalje prijavljuje `enabled: true`.
- Čvor ne uspijeva s greškom kada je `targetNodeLabel` prazan ili nijedan čvor ne nosi tu oznaku.

## Primjer upotrebe

Pokrenite [Cron](./cron-node.md) trigger na zahtjev. Pohranite Cron čvor isključenim i dodijelite workflowu drugu ulaznu točku kao što je [Input](./input-node.md) trigger. Zahtjev na tu ulaznu točku pokreće čvor Omogući čvor i Cron se počinje aktivirati.

Isključeni trigger nikada sam ne pokreće izvršavanje, pa čvor Omogući čvor mora stajati iza ulazne točke koja se može pokrenuti.

## Primjer

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Tijek: Input → Omogući čvor (cilj: cron) → Output. Cron čvor `hourlyCheck` pohranjen je kao onemogućen u istom workflowu i pokreće vlastitu granu HTTP provjere nakon što se omogući.

## Povezano

- [Vrste čvorova](../reference/node-types.md) – Pregled svih vrsta čvorova
- [Onemogući čvor](./disable-node.md) – Isključivanje čvora iz unutrašnjosti workflowa
- [Cron čvor](./cron-node.md) – Trigger koji se omogućuje
- [Condition čvor](./condition-node.md) – Grananje prije omogućavanja
- [Značajke platna](../reference/canvas-features.md) – Ručno omogućavanje ili onemogućavanje čvora
