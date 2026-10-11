# Išvestis

**Išvesties** mazgas yra darbo eigos galinis taškas, kuris grąžina atsakymą skambinančiajam. Visada nurodykite ankstesnio mazgo etiketę – niekada nenaudokite `$input`.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 (pasirinktinė, asinchroniniam poapdorojimui) |
| Išvestis | Grąžina `message` skambinančiajam |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `message` | expression | Išvesties vertė. **Privalo** nurodyti ankstesnį mazgą: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Jei tiesa, mazgai po išvesties vykdomi asinchroniškai po atsakymo išsiuntimo |

## Agentų įrankių naudojimas

Kai Išvesties mazgas yra prijungtas prie [Agent Node](./agent-node.md) kaip drobės mazgo įrankis, `message` laukas gali būti pažymėtas kaip **agent-provided** su bot ikona. Agentas tada pateikia žinutę, kai jis kviečia įrankį. Jei Išvesties mazgas nėra prijungtas kaip agentų įrankis, bot ikona yra paslėpta.

## Kritinė taisyklė

**Niekada nenaudokite `$input` išvesties mazge.** Visada naudokite ankstesnio mazgo etiketę:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (kur `processData` yra ankstesnio mazgo etiketė)

## Asinchroninis poapdorojimas

Kai `allowDownstream: true`, atsakymas grąžinamas iš karto. Mazgai, prijungti po išvesties, vykdomi fone (pvz., Slack pranešimai, žurnalo įrašymas). Kadangi žemyn einantis mazgas gali užtrukti ilgiau, žemyn einanti klaida gali pakeisti užfiksuotą vykdymo būseną į `error` po to, kai ankstyvas atsakymas jau buvo grąžintas; galutinė istorija ir analizė atspindi tą vėlesnį rezultatą.

## Pavyzdys

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Pavyzdys – Su Asinchroniniu

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Tada prijunkite [Telegram](./telegram-node.md), [Slack](./slack-node.md) ar kitą mazgą po išvesties, kad gautumėte pranešimus be laukimo.

## Susiję

- [JSON išvesties žemėlapis](./json-output-mapper-node.md) – Pagrindinis JSON kūnas be `result` apvyniojimo, kai vienintelis terminalas
- [Mazgų tipai](../reference/node-types.md) – Visi mazgų tipų apžvalga
- [Išraiškų DSL](../reference/expression-dsl.md) – Mazgo išvesties nurodymas
- [Išraiškų vertinimo dialogas](../reference/expression-evaluation-dialog.md) – Išplečiamas redaktorius su gyvu backend peržiūra žinutei
- [Darbo eigos struktūra](../reference/workflow-structure.md) – JSON formatas
