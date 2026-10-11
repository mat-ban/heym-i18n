# Set

El node **Set** transforma i mapeja les dades d'entrada a una sortida personalitzada. Utilitzeu-lo per a majúscules, subcadenes, concatenació, nombres aleatoris i qualsevol transformació de dades—no per cridar workflows (per a això feu servir [Execute](./execute-node.md)).

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.keyName` per a cada clau de mapeig |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `mappings` | array | Parells clau-valor. Cadascun: `{ key, value }` on `value` és una [expressió](../reference/expression-dsl.md) |

## Ús com a eina d'agent

Quan un node Set es connecta a un [Node Agent](./agent-node.md) com a eina de node al canvas, cada valor de mapeig es pot marcar com a **proporcionat per l'agent** amb la icona del bot. Els valors de mapeig marcats esdevenen paràmetres d'eina que l'agent omple en temps d'execució. Els mapejos no marcats romanen fixos a la configuració del node.

La icona del bot apareix només quan el node Set està connectat a la maneta d'eines d'un agent. Un node Set independent no mostra controls de valors proporcionats per l'agent.

## Regles d'expressió

- Referencieu nodes anteriors: `$nodeName.text`, `$nodeName.body.field`
- Utilitzeu funcions: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` exclou `b`; retorna un error si `a > b`.
- Només un `$` a l'inici de l'expressió—mai dins dels parèntesis
- Accediu a la sortida per clau: `$setNode.randomNumber`, `$setNode.text`

## Exemple

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Els nodes posteriors hi accedeixen mitjançant `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Relacionat

- [Mapejador de sortida JSON](./json-output-mapper-node.md) – Mateixos mapejos; l'únic terminal retorna el JSON arrel per a webhooks/execucions
- [Tipus de node](../reference/node-types.md) – Visió general de tots els tipus de node
- [Node Execute](./execute-node.md) – Crida workflows (no transformació de dades)
- [DSL d'expressions](../reference/expression-dsl.md) – Funcions i sintaxi
- [Diàleg d'avaluació d'expressions](../reference/expression-evaluation-dialog.md) – Editor ampliable amb previsualització en directe del backend i Anterior/Següent per als mapejos