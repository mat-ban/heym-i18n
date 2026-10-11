# Združitev

Vozlišče **Združitev** čaka na več vzporednih vhodov in jih združi v en sam izhod. Uporabite ga, kadar potrebujete združitev rezultatov iz vzporednih vej pred nadaljevanjem.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi    | n (konfigurabilno) |
| Izhodi   | 1 |
| Izhod    | `$nodeLabel.merged` – objekt z vhodi iz vsake veje |

## Parametri

| Parameter    | Tip    | Opis                          |
|--------------|--------|-------------------------------|
| `label`      | niz   | Identifikator vozlišča (camelCase) |
| `inputCount` | število | Število vhodov, na katere je treba počakati (privzeto: 2) |

## Kdaj uporabiti

- Uporabite, kadar potrebujete **združitev** ali **priključitev** rezultatov iz vzporednih vej
- **Ne** uporabljajte za vzporedne workflows, ki se končajo z ločenimi [Izhodnimi](./output-node.md) vozlišči
- Vsaka vhodna veja prispeva k združenemu izhodu

## Primer

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Povežite več vej z vozliščem združitve. Vozlišče čaka na vse vhode, preden ustvari izhod.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Vzporedno izvajanje](../reference/parallel-execution.md) – Kako delujejo vzporedne veje
- [Struktura workflows](../reference/workflow-structure.md) – Robovi in ročaji
