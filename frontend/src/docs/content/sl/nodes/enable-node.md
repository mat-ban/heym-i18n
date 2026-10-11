# Omogoči vozlišče

Vozlišče **Omogoči vozlišče** ponovno vklopi drugo vozlišče. Ko se izvede, nastavi `active` ciljnega vozlišča na `true` in spremembo ohrani. Je nasprotje [Onemogoči vozlišče](./disable-node.md): uporabite ga za ponovno aktiviranje [Cron](./cron-node.md) sprožilca ali katerega koli vozlišča, ki je bilo izklopljeno.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `targetNodeLabel` | niz | Oznaka vozlišča, ki ga je treba omogočiti (npr. `hourlyCheck`) |

## Obnašanje

- Ciljno vozlišče je shranjeno kot aktivno, tako da ga bodo prihodnji zagon in sprožilci videli. Ponovno omogočen Cron sprožilec se ponovno aktivira ob naslednjem načrtovanem času.
- Če je cilj downstream od Omogoči vozlišče in še ni bil izveden, se prav tako izvede v trenutni izvršitvi.
- Omogočanje vozlišča, ki je že aktivno, ne spremeni ničesar; izhod še vedno poroča `enabled: true`.
- Vozlišče ne uspe z napako, ko je `targetNodeLabel` prazno ali nobeno vozlišče nima te oznake.

## Uporabniški primer

Začnite [Cron](./cron-node.md) sprožilec na zahtevo. Shranite Cron vozlišče izklopljeno in dajte delovnemu toku drugo vstopno točko, kot je [Vhod](./input-node.md) sprožilec. Zahteva na tej vstopni točki izvede Omogoči vozlišče, in Cron se začne sprožati.

Izklopljen sprožilec nikoli ne začne izvajanja samostojno, zato mora Omogoči vozlišče sedeti za vstopno točko, ki lahko teče.

## Primer

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Tok: Vhod → Omogoči vozlišče (cilj: cron) → Izhod. Cron vozlišče `hourlyCheck` je shranjeno kot onemogočeno v istem delovnem toku in izvede svojo lastno HTTP preverjanje, ko je omogočeno.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Onemogoči vozlišče](./disable-node.md) – Izklopi vozlišče znotraj delovnega toka
- [Cron vozlišče](./cron-node.md) – Sprožilec za omogočanje
- [Pogojno vozlišče](./condition-node.md) – Veji pred omogočanjem
- [Funkcije platna](../reference/canvas-features.md) – Omogočite ali onemogočite vozlišče ročno
