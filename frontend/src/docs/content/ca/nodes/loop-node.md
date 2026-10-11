# Loop

El node **Loop** itera sobre un array i executa els nodes posteriors per a cada element. Requereix una connexió de retorn des de l'últim node del cos de la iteració per avançar.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 2 (per defecte + retorn del loop) |
| Sortides | 2 (loop, done) |
| Sortida | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `arrayExpression` | expression | Expressió que es resol en un array (p. ex. `$input.items`) |

## Handles de les arestes

- **Origen `loop`** – Connecta amb els nodes que processen cada element (s'executa a cada iteració)
- **Origen `done`** – Connecta amb els nodes que s'executen un cop finalitzades totes les iteracions
- **Destí default** – Rep les dades inicials que contenen l'array
- **Destí `loop`** – Rep la connexió de retorn des de l'últim node del cos de la iteració

## Context del loop (al cos de la iteració)

- `$loopNode.item` – Element actual
- `$loopNode.index` – Índex basat en 0
- `$loopNode.total` – Total d'elements
- `$loopNode.isFirst` – Booleà
- `$loopNode.isLast` – Booleà

## Regles crítiques

1. **Connexió de retorn obligatòria:** L'últim node del cos de la iteració HA de connectar de tornada al handle d'entrada `loop` del loop.
2. **Sense sortida al cos del loop:** Els nodes [Output](./output-node.md) estan prohibits dins del cos del loop. Utilitzeu [Set](./set-node.md) o [Variable](./variable-node.md) per als resultats intermedis.
3. **Sense resultats automàtics:** El loop no recull resultats. Utilitzeu nodes Variable amb `$array()` i `.add()` per acumular-los.

## Exemple

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Flux: loop → node de processament → (retorn al loop) → loop → branca done → sortida.

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Variable Node](./variable-node.md) – Recollir elements en un loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, mètodes d'array