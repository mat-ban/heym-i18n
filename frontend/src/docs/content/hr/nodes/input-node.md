# Ulaz

**Input** čvor je ulazna točka za workflows koji primaju podatke od korisnika ili API poziva. Podržava jedno ili više ulaznih polja i izlaže metapodatke zahtjeva (zaglavlja, parametre upita).

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `value` | string | Zadana vrijednost za jedno tekstualno ulazno polje (opcionalno) |
| `inputFields` | array | Definicije ulaznih polja. Svako: `{ key, defaultValue? }` |

### Ulazna Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `key` | string | Ključ polja (npr. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Zadana vrijednost ako nije navedena (opcionalno) |

## Pristupanje Ulaznim Podacima

**Polja tijela** (uvijek koristite `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – tekstualno polje
- `$userInput.body.imageUrl` – URL slike
- `$userInput.body.userId` – s zadanom vrijednošću ako je konfigurirana
- `$userInput.body.event.user.id` – ugniježđeni JSON iz generičkog webhook moda

**Metapodaci zahtjeva** (kada se izvršava putem API-ja):

- `$userInput.headers` – sva zaglavlja (ključevi malim slovima)
- `$userInput.headers.authorization` – specifično zaglavlje
- `$userInput.query` – parametri upita
- `$userInput.query.param1` – specifični parametar upita

## Ulaz Datoteka u Panelu Izvršavanja

U kartici **Izvršavanje** (Definirani webhook mod), svako ulazno polje podržava povlačenje i ispuštanje te inline kontrolu za privitke (donji desni kut polja):

- **Tekstualne datoteke** (`.txt`, `.md`, `.json`, `.csv` i slične) se čitaju kao običan tekst.
- **Slike** (JPEG, PNG, GIF, WebP) se pohranjuju kao `data:` URL (base64) u vrijednosti polja — koristite ključeve polja kao što su `imageUrl` ili `base64` kada dolazni čvorovi očekuju podatke o slikama.
- **PDF** datoteke se pretvaraju u izdvojeni tekst (maksimalna veličina datoteke 5 MB, 100k znakova sadržaja).

Jedna datoteka po polju. I dalje možete uređivati tekstualno područje nakon učitavanja datoteke. Generički webhook mod (sirovi JSON tijelo) ne prikazuje kontrole za datoteke po polju.

## Ulazna Polja naspram Generičkih Webhookova

`inputFields` i dalje opisuju očekivane ulaze za obrasce u definiranoj mod editoru, mapiranje pod-workflowa i druge površine vođene metapodacima.

Kada workflow koristi **Generički** webhook mod tijela, dolazno HTTP tijelo se ne preoblikuje iz `inputFields`. Umjesto toga, sirovi JSON payload se prosljeđuje kroz `$nodeLabel.body`, a kontrole za dodavanje/uklanjanje ulaznog čvora su skrivene u panelu čvora.

## Primjeri

**Jedan ulaz (zadano):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Više ulaza:**

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

## Povezano

- [Tipovi Čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Okidači](../reference/triggers.md) – Ulazne točke (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Referenciranje `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Izlaganje workflows kao chat UI
- [Webhooks](../reference/webhooks.md) – HTTP okidač za workflows
