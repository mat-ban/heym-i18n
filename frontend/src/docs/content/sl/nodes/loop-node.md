# Zanka

**Zanka** vozlišče iterira preko tabele, izvaja spodnja vozlišča za vsak element. Zahteva povratno povezavo z zadnjim vozliščem v telesu iteracije za napredovanje.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 2 (privzeto + povratna povezava) |
| Izhodi | 2 (zanka, končano) |
| Izhod | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `arrayExpression` | izraz | Izraz, ki se razreši v tabelo (npr. `$input.items`) |

## Robni ročaji

- **Vir `loop`** – Povezuje se z vozlišči, ki obdelujejo vsak element (izvaja se pri vsaki iteraciji)
- **Vir `done`** – Povezuje se z vozlišči, ki se izvajajo po zaključku vseh iteracij
- **Cilj privzeto** – Prejme začetne podatke, ki vsebujejo tabelo
- **Cilj `loop`** – Prejme povratno povezavo z zadnjim vozliščem telesa iteracije

## Kontekst zanke (v telesu iteracije)

- `$loopNode.item` – Trenutni element
- `$loopNode.index` – Indeks, ki se začne z 0
- `$loopNode.total` – Skupno število elementov
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritična pravila

1. **Povratna povezava je obvezna:** Zadnje vozlišče v telesu iteracije MORDA povezuje nazaj na vhodni ročaj `loop` zanke.
2. **Brez izhoda v telesu zanke:** [Izhod](./output-node.md) vozlišča so prepovedana znotraj telesa zanke. Uporabite [Set](./set-node.md) ali [Variable](./variable-node.md) za vmesne rezultate.
3. **Brez samodejnih rezultatov:** Zanka ne zbira rezultatov. Uporabite vozlišča Variable z `$array()` in `.add()` za akumulacijo.

## Primer

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Tok: zanka → procesno vozlišče → (nazaj na zanko) → zanka → končana veja → izhod.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Vozlišče Variable](./variable-node.md) – Zbiranje elementov v zanki
- [Izraz DSL](../reference/expression-dsl.md) – `item`, `index`, metode tabel
