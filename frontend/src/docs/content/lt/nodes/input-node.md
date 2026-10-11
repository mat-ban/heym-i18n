# Įvestis

**Įvesties** mazgas yra darbo eigų, gaunančių duomenis iš vartotojo arba API kvietėjo, įėjimo taškas. Jis palaiko vieną arba kelis įvesties laukus ir atskleidžia užklausos metaduomenis (antraštes, užklausos parametrus).

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `value` | string | Numatytoji vertė vienam teksto įvedimui (neprivaloma) |
| `inputFields` | array | Įvesties laukų apibrėžimai. Kiekvienas: `{ key, defaultValue? }` |

### Įvesties Laukai

| Laukas | Tipas | Aprašymas |
|--------|-------|-----------|
| `key` | string | Lauko raktas (pvz., `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Numatytoji vertė, jei nenurodyta (neprivaloma) |

## Prieiga prie Įvesties Duomenų

**Kūno laukai** (visada naudokite `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – teksto laukas
- `$userInput.body.imageUrl` – vaizdo URL
- `$userInput.body.userId` – su numatyta verte, jei sukonfigūruota
- `$userInput.body.event.user.id` – įdėtas JSON iš bendro webhook režimo

**Užklausos metaduomenys** (kai vykdoma per API):

- `$userInput.headers` – visos antraštės (raktai mažosiomis raidėmis)
- `$userInput.headers.authorization` – konkreti antraštė
- `$userInput.query` – užklausos parametrai
- `$userInput.query.param1` – konkretus užklausos parametras

## Vykdymo Skydelio Failo Įvestis

Redaktoriaus **Vykdymo** skirtuke (apibrėžtas webhook režimas) kiekvienas įvesties laukas palaiko vilkimo ir numetimo funkciją bei įterptą priedų valdymą (lauko apatiniame dešiniajame kampe):

- **Teksto failai** (`.txt`, `.md`, `.json`, `.csv` ir panašūs) skaitomi kaip paprastas tekstas.
- **Vaizdai** (JPEG, PNG, GIF, WebP) saugomi kaip `data:` URL (base64) lauko vertėje — naudokite lauko raktus, tokius kaip `imageUrl` arba `base64`, kai žemyn srauto mazgai tikisi vaizdo duomenų.
- **PDF** failai konvertuojami į išgautą tekstą (maksimalus 5 MB failas, 100k simbolių turinys).

Vienas failas vienam laukui. Po failo įkėlimo vis tiek galite redaguoti teksto sritį. Bendro webhook režimas (žali JSON kūnai) nerodo atskirų laukų failų valdymo.

## Įvesties Laukai vs Bendrieji Webhookai

`inputFields` vis dar apibūdina laukiamas įvestis apibrėžto režimo redaktoriaus formoms, sub-darbo eigų žemėlapiams ir kitiems metaduomenimis pagrįstiems paviršiams.

Kai darbo eiga naudoja **Bendro** webhook kūno režimą, įeinantis HTTP kūnas nėra pertvarkomas iš `inputFields`. Vietoj to, žali JSON payload perduodamas per `$nodeLabel.body`, o Įvesties mazgo lauko pridėjimo/šalinimo valdymas paslėptas mazgo skydelyje.

## Pavyzdžiai

**Viena įvestis (numatytoji):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Kelios įvestys:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Susiję

- [Mazgų Tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Triggeriai](../reference/triggers.md) – Įėjimo taškai (Įvestis, Cron, RabbitMQ)
- [Išraiškų DSL](../reference/expression-dsl.md) – Nuorodos į `$nodeLabel.body`, `$nodeLabel.query`
- [Portalas](../reference/portal.md) – Darbo eigų atskleidimas kaip pokalbių UI
- [Webhookai](../reference/webhooks.md) – HTTP triggeris darbo eigoms
