# JSON izhodni mapper

**JSON izhodni mapper** vozlišče gradi JSON objekt iz ključ/vrednost [mapiranj](./set-node.md) (enak model kot [Set](./set-node.md)). Uporabite ga, kadar naj klicatelji prejmejo **navaden JSON telo** na vrhu odgovora.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 0 (sinko) |
| Izhod v času izvajanja | Objekt zgrajen iz `mappings` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `mappings` | tabela | `{ "key": "fieldName", "value": "expression" }` vnosi (enako kot Set) |

## Uporaba orodja agenta

Ni podprto. To vozlišče je terminalni sinko, zato ga ni mogoče povezati z obvladovanjem [Agent Node](./agent-node.md). Uporabite [Set](./set-node.md) vozlišče, kadar agent potrebuje oblikovati vrednosti med pogovorom.

## Obnašanje Webhook in izvajanja

Ko je to vozlišče **edini** terminalni izhod delovnega toka, so **izhodi** izvajanja sami mapirani objekt: ključi iz `mappings` se pojavijo na **najvišji ravni** JSON-a. Ni **nobene** zunanje ovojnice, ki bi bila ključena z oznako vozlišča in **nobene** `{ "result": ... }` objekta (za razliko od [Output](./output-node.md) vozlišča).

Če več terminalnih vozlišč proizvaja izhode (na primer [Output](./output-node.md) plus JSON izhodni mapper, ali več vej), Heym uporablja običajno obliko: vsako terminalno vozlišče je ključeno z njegovo `label`.

## Omejitev zank

Enaka pravila kot pri [Output](./output-node.md): tega vozlišča ne postavljajte znotraj veje iteracije zanke—samo po veji `done` zanke. Glejte [Loop](./loop-node.md).

## Primer

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Sorodno

- [Set](./set-node.md) – Enaka mehanika mapiranja za vmesne transformacije
- [Output](./output-node.md) – Sporočilo ali odgovor na podlagi sheme z `result` ovojnico
- [Node Types](../reference/node-types.md) – Vse vrste vozlišč
- [Workflow Structure](../reference/workflow-structure.md) – JSON format delovnega toka
- [Webhooks](../reference/webhooks.md) – Izvedba končne točke in odgovori
