# Išmesti Klaidą

**Išmesti Klaidą** mazgas nedelsiant sustabdo workflow vykdymą ir grąžina klaidos atsakymą su pasirinktu HTTP statuso kodu. Naudokite jį validacijos klaidoms, neautorizuotam prieigai ar kitoms klaidų sąlygoms.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 0 |
| Išvestis | Workflow sustabdomas; klaidos atsakymas grąžinamas skambinančiam |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `errorMessage` | expression | Klaidos pranešimas (palaiko išraiškas) |
| `httpStatusCode` | number | HTTP statuso kodas (pvz., 400, 401, 403, 404, 429, 500) |

## Dažniausiai naudojami statuso kodai

| Kodas | Naudojimo atvejis |
|-------|-------------------|
| 400 | Bloga užklausa (neteisinga įvestis) |
| 401 | Neautorizuota (reikalinga autentifikacija) |
| 403 | Uždrausta (prieiga atšaukta) |
| 404 | Nerasta (išteklius trūksta) |
| 422 | Neapdorojama entitetas (validacijos klaida) |
| 429 | Per daug užklausų (greičio limitas) |
| 500 | Vidinė serverio klaida |

## Pavyzdys

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Teksto įvestis yra privaloma",
    "httpStatusCode": 400
  }
}
```

Naudokite su [Sąlyga](./condition-node.md) įvesties validacijai ir išmeskite klaidą tik tada, kai įvestis neteisinga:
- Sąlyga teisinga → tęsti iki Išvesties
- Sąlyga neteisinga → Išmesti Klaidą

## Susiję

- [Mazgų Tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Sąlygos Mazgas](./condition-node.md) – Validuoti prieš išmetant
- [Klaidų Apdorotojas](./error-handler-node.md) – Sugauti klaidas iš kitų mazgų
