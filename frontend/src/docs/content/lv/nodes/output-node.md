# Izvade

**Izvades** mezgls ir workflow galapunkts, kas atgriež atbildi izsaucējam. Vienmēr atsaucieties uz iepriekšējo mezglu pēc tā apzīmējuma (label)—nekad neizmantojiet `$input`.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 (neobligāta, asinhronai pēcapstrādei) |
| Izvade | Atgriež `message` izsaucējam |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `message` | expression | Izvades vērtība. **Jābūt** atsaucei uz iepriekšējo mezglu: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Ja true, mezgli pēc izvades tiek izpildīti asinhroni pēc atbildes nosūtīšanas |

## Aģenta rīka izmantošana

Kad Izvades mezgls ir savienots ar [Aģenta mezglu](./agent-node.md) kā kanvas mezgla rīks, lauku `message` var atzīmēt kā **aģenta nodrošinātu** ar bota ikonu. Aģents pēc tam nodrošina ziņojumu, kad tas izsauc rīku. Ja Izvades mezgls nav savienots kā aģenta rīks, bota ikona tiek paslēpta.

## Kritisks noteikums

**Nekad neizmantojiet `$input` izvades mezglā.** Vienmēr izmantojiet iepriekšējā mezgla apzīmējumu:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (kur `processData` ir iepriekšējā mezgla apzīmējums)

## Asinhronā pēcapstrāde

Kad `allowDownstream: true`, atbilde tiek atgriezta nekavējoties. Mezgli, kas savienoti pēc izvades, darbojas fonā (piem., Slack paziņojumi, žurnālēšana). Tā kā lejupstraumes daļa var pabeigties vēlāk, lejupstraumes kļūme var mainīt ierakstīto izpildes statusu uz `error` pēc tam, kad agrīnā atbilde jau ir atgriezta; galīgā vēsture un analītika atspoguļo šo vēlāko iznākumu.

## Piemērs

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Piemērs – ar asinhrono izpildi

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

Pēc tam savienojiet [Telegram](./telegram-node.md), [Slack](./slack-node.md) vai citu mezglu pēc izvades, lai nodrošinātu paziņojumus bez gaidīšanas.

## Saistītie

- [JSON izvades kartētājs](./json-output-mapper-node.md) – Saknes JSON pamatteksts bez `result` ietīšanas, ja tas ir vienīgais terminālis
- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Izteiksmju DSL](../reference/expression-dsl.md) – Atsauce uz mezgla izvadi
- [Izteiksmes novērtēšanas dialogs](../reference/expression-evaluation-dialog.md) – Paplašināms redaktors ar tiešu backend priekšskatījumu ziņojumam
- [Workflow struktūra](../reference/workflow-structure.md) – JSON formāts
