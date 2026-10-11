# Ehto

**Ehto**-solmu haarauttaa workflown if/else-lausekkeen perusteella. Ohjaa joko true- tai false-haaraan riippuen lausekkeen tuloksesta.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Lähtöportit | 2 (true, false) |
| Lähtö | Läpäisee syötteen valittuun haaraan |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `condition` | lauseke | JavaScript-tyylinen lauseke (esim. `$input.text.length > 0`) |

## Reunakahvat

- **Lähdekahva `true`** – kun ehto evaluoituu todeksi
- **Lähdekahva `false`** – kun ehto evaluoituu epätodeksi

## Lausekeoperaattorit

Tuetut operaattorit: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` jne. Katso [Expression DSL](../reference/expression-dsl.md).

## Esimerkki

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Yhdistä reunat `sourceHandle: "true"` tai `sourceHandle: "false"` -asetuksilla ohjataksesi eri haaroihin.

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Switch-solmu](./switch-node.md) – Monihaarainen reititys arvon perusteella
- [Expression DSL](../reference/expression-dsl.md) – Ehdon syntaksi
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Laajennettava editori reaaliaikaisella backend-esikatselulla ehdon testaamiseen
