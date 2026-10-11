# Vhodno vozlišče

**Vhodno vozlišče** je vstopna točka za workflows, ki prejemajo podatke od uporabnika ali klicatelja API. Podpira eno ali več vhodnih polj ter izpostavlja metapodatke zahtevka (glave, poizvedbene parametre).

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi    | 0        |
| Izhodi   | 1        |
| Izhod    | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametri

| Parameter     | Tip    | Opis                                   |
|---------------|--------|----------------------------------------|
| `label`       | niz   | Identifikator vozlišča (camelCase)    |
| `value`       | niz   | Privzeta vrednost za enotno besedilno vhodno polje (neobvezno) |
| `inputFields` | niz   | Določila vhodnih polj. Vsako: `{ key, defaultValue? }` |

### Vhodna polja

| Polje         | Tip    | Opis                                   |
|---------------|--------|----------------------------------------|
| `key`         | niz   | Ključ polja (npr. `text`, `imageUrl`, `base64`) |
| `defaultValue`| niz   | Privzeta vrednost, če ni navedena (neobvezno) |

## Dostop do vhodnih podatkov

**Polja telesa** (vedno uporabite `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – besedilno polje
- `$userInput.body.imageUrl` – URL slike
- `$userInput.body.userId` – z privzeto vrednostjo, če je nastavljena
- `$userInput.body.event.user.id` – gnezdeni JSON iz načina Generic webhook

**Metapodatki zahtevka** (ko se izvaja preko API):

- `$userInput.headers` – vse glave (ključi v malih črkah)
- `$userInput.headers.authorization` – specifična glava
- `$userInput.query` – poizvedbeni parametri
- `$userInput.query.param1` – specifičen poizvedbeni parameter

## Vhod datoteke v nadzorni plošči za izvajanje

V zavihku **Izvajanje** (način definiranja webhook) vsako vhodno polje podpira povleci in spusti ter nadzor za priponke (spodaj desno od polja):

- **Besedilne datoteke** (`.txt`, `.md`, `.json`, `.csv` in podobno) se berejo kot navadno besedilo.
- **Slike** (JPEG, PNG, GIF, WebP) se shranijo kot `data:` URL (base64) v vrednosti polja — uporabite ključe polja, kot sta `imageUrl` ali `base64`, ko spodnja vozlišča pričakujejo podatke o slikah.
- **PDF** datoteke se pretvorijo v izluščeno besedilo (maksimalna velikost datoteke 5 MB, 100k znakov vsebine).

Ena datoteka na polje. Še vedno lahko urejate besedilno območje po nalaganju datoteke. Način Generic webhook (surov JSON telo) ne prikazuje nadzorov za datoteke po poljih.

## Vhodna polja proti generičnim webhookom

`inputFields` še vedno opisujejo pričakovane vhode za obrazce v načinu definiranja, preslikavo pod-workflow in druge površine, ki temeljijo na metapodatkih.

Ko workflow uporablja način **Generic** webhook telesa, se prihajajoče HTTP telo ne preoblikuje iz `inputFields`. Namesto tega se surovi JSON payload prenese v `$nodeLabel.body`, kontrole za dodajanje/odstranjevanje vhodnih polj pa so skrite v nadzorni plošči vozlišča.

## Primeri

**Enotni vhod (privzeto):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Več vhodov:**

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

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Triggerji](../reference/triggers.md) – Vstopne točke (Vhod, Cron, RabbitMQ)
- [Izraz DSL](../reference/expression-dsl.md) – Sklicevanje na `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Izpostavite workflows kot chat UI
- [Webhooki](../reference/webhooks.md) – HTTP trigger za workflows
