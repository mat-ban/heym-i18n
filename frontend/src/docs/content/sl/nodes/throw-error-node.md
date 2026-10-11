# Vrzi Napako

Vozlišče **Vrzi Napako** takoj ustavi izvajanje workflow-a in vrne odgovor o napaki s prilagojeno HTTP statusno kodo. Uporabite ga za napake pri validaciji, nepooblaščen dostop ali druge pogoje napake.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 0 |
| Izhod | Workflow se ustavi; odgovor o napaki se vrne klicatelju |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `errorMessage` | izraz | Sporočilo o napaki (podpira izraze) |
| `httpStatusCode` | število | HTTP statusna koda (npr. 400, 401, 403, 404, 429, 500) |

## Pogoste Statusne Kode

| Koda | Uporaba |
|------|----------|
| 400 | Slaba zahteva (neveljaven vhod) |
| 401 | Neavtorizirano (zahteva se avtentikacija) |
| 403 | Prepovedano (dostop zavrnjen) |
| 404 | Ni najdeno (vir manjka) |
| 422 | Neobdelana entiteta (napaka pri validaciji) |
| 429 | Preveč zahtev (omejitev hitrosti) |
| 500 | Notranja napaka strežnika |

## Primer

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Vnos besedila je obvezen",
    "httpStatusCode": 400
  }
}
```

Uporabite z [Pogoji](./condition-node.md) za validacijo vnosa in vrzite napako le, ko je neveljavna:
- Pogoji resnični → nadaljujte do Izhoda
- Pogoji neresnični → Vrzi Napako

## Sorodno

- [Vrste Vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Vozlišče Pogoji](./condition-node.md) – Validacija pred vrženjem
- [Obvladovalec Napak](./error-handler-node.md) – Ujemanje napak iz drugih vozlišč
