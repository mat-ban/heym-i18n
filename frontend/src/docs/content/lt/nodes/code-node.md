# Kodo mazgas

**Kodo** mazgas vykdo Jūsų rašomą Python kodą, turintį savo `requirements.txt`, ir grąžina JSON. Kiekvienas vykdymas gauna visiškai naują konteinerį, kuris sunaikinamas, kai vykdymas baigiasi, todėl vienas vykdymas niekada negali matyti ar paveikti kito.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.result` (bet kas, ką grąžino `main`), plius `$nodeLabel.logs` ir `$nodeLabel.install` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `codeSource` | string | Python šaltinis. Privalo apibrėžti `main(params)` ir grąžinti JSON serializuojamą vertę |
| `codeParameters` | expression | JSON objektas, jungiantis darbo eigą su kodu. Išraiškos išsprendžiamos prieš vykdant kodą |
| `codeRequirements` | string | `requirements.txt` turinys, po vieną paketą kiekvienoje eilutėje. Tuščias praleidžia diegimą |
| `codeAllowNetwork` | boolean | Ar kodas gali pasiekti tinklą (numatytoji reikšmė `false`) |

## `main` funkcija

Jūsų kodas privalo apibrėžti viršutinio lygio `main`, kuris priima vieną argumentą:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Modulio lygio teiginiai vykdomi, tačiau tik tai, ką grąžina `main`, tampa mazgo išvestimi.

Redaktorius rodo eilučių numerius, o šalia **Format** esantis plėtimo mygtukas atidaro didesnį redaktorių, kuris užsidaro paspaudus `Esc` — redagavimai taikomi rašant, todėl nieko nereikia išsaugoti. **Format** mygtukas performatuoja Jūsų kodą su Ruff, išsaugodamas komentarus. Jis taip pat taiso įtraukimo sugadinimus, kuriuos paprastai sukelia kopijavimas: vienodai įtraukta blokas, tabuliacijos maišymas su tarpais ir eilutė, sėdinti vienu ar dviem tarpais nuo savo bloko, visi yra taisomi, o ne atmesti. Tikra sintaksės klaida pranešama su jos eilute ir stulpeliu. Formatavimas vykdomas tame pačiame izoliuotame konteineryje, kuriame vykdomas mazgas — be tinklo, be backend aplinkos — todėl jam reikia Docker, kaip ir vykdymui.

## Parametrų skaitymas

`params` palaiko taško notaciją, įskaitant per įdėtus objektus ir sąrašus:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` skaito raktus, kurie nėra galiojantys Python identifikatoriai
- `params.get("maybe")` grąžina `None`, kai raktas yra nebuvęs
- `params.to_dict()` grąžina paprastą žodyną
- Skaitymas raktą, kuris niekada nebuvo pateiktas, sukelia klaidą, nurodančią raktą ir išvardinant, kas yra prieinama

## Išvestis

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — `main` grąžinta vertė. Žemiau esantys mazgai skaito `$nodeLabel.result.message`
- `logs` — viskas, ką kodas išsiuntė į `print`, užfiksuota atskirai, kad niekada nesugadintų rezultato
- `install` — kuris įrankis įdiegė priklausomybę (`uv`, `pip` ar `none`) ir jo išvestis

## Priklausomybės

Surašykite paketus `requirements.txt` tiksliai taip, kaip darytumėte vietoje:

```
requests==2.32.3
feedparser
```

Paketai diegiami su `uv` į laikinas direktorijas prieš vykdant kodą; jei `uv` negali apdoroti paketo, Heym bando su `pip`. Nieko nėra talpinama tarp vykdymų, todėl sunkios priklausomybės prideda kelias sekundes prie kiekvieno vykdymo. Palikdami `requirements.txt` tuščią, visiškai praleidžiate diegimo žingsnį ir tai yra pastebimai greičiau.

Paketai, kurie neturi jokio wheel ir reikalauja C kompiliatoriaus, nepavyks įdiegti. Priežastis pasirodo `install.log`.

## Tinklas

| Fazė | Tinklas |
|------|---------|
| Priklausomybių diegimas | Visada įjungtas — pip ir uv turi pasiekti PyPI |
| Jūsų kodo vykdymas | Numatyta, kad išjungta. `codeAllowNetwork` ją įjungia |

Kai `codeAllowNetwork` išjungtas, išorinė užklausa, tokia kaip `requests.get(...)`, nepavyksta su ryšio klaida. Tai yra numatyta numatytoji reikšmė: dauguma Kodo mazgų transformuoja duomenis, kuriuos jau gavo kitas mazgas. Rekomenduojama gauti su **HTTP** mazgu ir perduoti kūną per `codeParameters`.

## Smėlio dėžė ir ribos

Jūsų kodas vykdomas kaip ne root vartotojas konteineryje, kuriame visos Linux galimybės yra pašalintos, nustatytas `no-new-privileges` ir skaitymo režimu veikianti šakninė failų sistema. Jis negauna Docker lizdo ir jokių backend paslapčių ar aplinkos.

| Riba | Vertė |
|------|-------|
| Atmintis | 512 MB |
| CPU | 1 |
| Procesai | 256 |
| Priklausomybės diegimo laiko limitas | 120 sekundžių |
| Vykdymo laiko limitas | 60 sekundžių |

Tai yra fiksuoti smėlio dėžės ypatumai, o ne konfigūracija.

> **Docker yra būtinas.** Skirtingai nuo Agent Python įrankių ir įgūdžių, Kodo mazgas neturi vietinio atsarginio režimo ir jokios aplinkos kintamojo, kad jį sušvelnintų. Be pasiekiamo Docker demonas mazgas nepavyksta su aiškia klaida, o ne vykdo Jūsų kodo backend procese. Naudojant natyvų `./run.sh` kūrimą, prieš naudojant šį mazgą paleiskite Docker. Žr. [Saugumas → Kodo mazgo smėlio dėžė](../reference/security.md#code-node-sandbox).

## Naudokite kitą mazgą, kai vienas tinka

| Jūs norite | Naudokite |
|------------|-----------|
| Išanalizuoti arba sukurti CSV, TSV, XML, arba OCR failą | [Converter](converter-node.md) |
| Kviesti HTTP API | [HTTP](http-node.md) |
| Žemėlapiuoti arba pervadinti laukus | [Set](set-node.md) |
| Vykdyti kitą darbo eigą | [Execute](execute-node.md) |

Pasirinkite **Kodo** mazgą, kai logika tikrai netinka šiems — individualūs matematiniai skaičiavimai, specializuotas analizavimas ar algoritmas.
## Pavyzdys

Įvertinkite eilučių rezultatus, kuriuos pateikia aukščiau esantis mazgas:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Nustatę `codeParameters` kaip `{ "rows": "$fetchRows.result" }`, žemiau esantys mazgai skaito `$scoreRows.result.total`.
