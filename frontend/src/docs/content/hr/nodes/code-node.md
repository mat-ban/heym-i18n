# Kod

**Code** čvor izvršava Python koji sami napišete, s vlastitim `requirements.txt`, i vraća JSON. Svako izvršavanje dobiva potpuno novi kontejner koji se uništi kada izvršavanje završi, tako da jedno izvršavanje nikada ne može vidjeti niti utjecati na drugo.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.result` (što god je `main` vratio), plus `$nodeLabel.logs` i `$nodeLabel.install` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `codeSource` | string | Python izvorni kod. Mora definirati `main(params)` i vratiti JSON-serijalizirajuću vrijednost |
| `codeParameters` | expression | JSON objekt koji povezuje podatke workflowa s kodom. Izrazi se razrješavaju prije nego što se kod pokrene |
| `codeRequirements` | string | Sadržaj `requirements.txt`, jedan paket po retku. Prazno preskače instalaciju |
| `codeAllowNetwork` | boolean | Može li kod sam pristupiti mreži (zadano `false`) |

## Funkcija `main`

Vaš kod mora definirati `main` na najvišoj razini koji prima jedan argument:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Naredbe na razini modula se izvršavaju, ali samo ono što `main` vrati postaje izlaz čvora.

Uređivač prikazuje brojeve redaka, a gumb za proširenje pokraj **Format** otvara veći uređivač koji se zatvara tipkom `Esc` — izmjene se primjenjuju dok tipkate, tako da nema ničega za spremiti. Gumb **Format** preoblikuje vaš kod pomoću Ruffa, čuvajući komentare. Također popravlja oštećenja uvlačenja koja obično nastaju lijepljenjem: jednoliko uvučen blok, tabulatori pomiješani s razmacima i redak koji odstupa jedan ili dva razmaka od svog bloka svi se popravljaju umjesto odbacivanja. Stvarna sintaktička pogreška prijavljuje se s brojem retka i stupca. Formatiranje se izvodi u istom izoliranom kontejneru u kojem se čvor izvršava — bez mreže, bez pozadinskog okruženja — pa zahtijeva Docker jednako kao i izvršavanje.

## Čitanje parametara

`params` podržava točkastu notaciju, uključujući kroz ugniježđene objekte i liste:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` čita ključeve koji nisu valjani Python identifikatori
- `params.get("maybe")` vraća `None` umjesto da podigne iznimku kada ključ nije prisutan
- `params.to_dict()` vraća obični rječnik
- Čitanje ključa koji nikada nije bio naveden podiže pogrešku koja imenuje ključ i navodi što je dostupno

## Izlaz

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — povratna vrijednost funkcije `main`. Nizvodni čvorovi čitaju `$nodeLabel.result.message`
- `logs` — sve što je kod poslao u `print`, zabilježeno odvojeno kako nikada ne bi pokvarilo rezultat
- `install` — koji je alat instalirao ovisnosti (`uv`, `pip` ili `none`) i njegov izlaz

## Ovisnosti

Navedite pakete u `requirements.txt` točno onako kako biste ih naveli lokalno:

```
requests==2.32.3
feedparser
```

Paketi se instaliraju pomoću `uv` u privremeni direktorij prije nego što se kod pokrene; ako `uv` ne može obraditi paket, Heym ponovno pokušava s `pip`. Ništa se ne predmemorira između izvršavanja, pa teške ovisnosti dodaju nekoliko sekundi svakom izvršavanju. Ostavljanje `requirements.txt` praznim u potpunosti preskače korak instalacije i primjetno je brže.

Paketi koji ne dolaze s wheelom i zahtijevaju C kompilator neće se moći instalirati. Razlog se pojavljuje u `install.log`.

## Mreža

| Faza | Mreža |
|-------|---------|
| Instaliranje ovisnosti | Uvijek uključena — pip i uv moraju dosegnuti PyPI |
| Izvršavanje vašeg koda | Isključena prema zadanim postavkama. `codeAllowNetwork` je uključuje |

Kada je `codeAllowNetwork` isključen, odlazni poziv poput `requests.get(...)` ne uspijeva s pogreškom veze. To je namjeravano zadano ponašanje: većina Code čvorova transformira podatke koje je drugi čvor već dohvatio. Radije dohvatite podatke pomoću **HTTP** čvora i proslijedite tijelo kroz `codeParameters`.

## Sandbox i ograničenja

Vaš kod se izvršava kao ne-root korisnik u kontejneru sa svim uklonjenim Linux sposobnostima, postavljenim `no-new-privileges` i korijenskim datotečnim sustavom samo za čitanje. Ne prima Docker socket niti bilo kakve pozadinske tajne ili okruženje.

| Ograničenje | Vrijednost |
|-------|-------|
| Memorija | 512 MB |
| CPU-i | 1 |
| Procesi | 256 |
| Vremensko ograničenje instalacije ovisnosti | 120 sekundi |
| Vremensko ograničenje izvršavanja | 60 sekundi |

Ovo su fiksna svojstva sandboxa, a ne konfiguracija.

> **Docker je potreban.** Za razliku od Agent Python alata i vještina, Code čvor nema lokalni način rada kao rezervu niti varijablu okruženja za njegovo ublažavanje. Bez dostupnog Docker daemona čvor ne uspijeva s jasnom pogreškom umjesto da izvršava vaš kod u pozadinskom procesu. Pri razvoju s izvornim `./run.sh`, pokrenite Docker prije korištenja ovog čvora. Pogledajte [Security → Code node sandbox](../reference/security.md#code-node-sandbox).

## Koristite drugi čvor kada neki odgovara

| Želite | Koristite |
|-------------|-----|
| Parsirati ili izgraditi CSV, TSV, XML ili OCR datoteku | [Converter](converter-node.md) |
| Pozvati HTTP API | [HTTP](http-node.md) |
| Mapirati ili preimenovati polja | [Set](set-node.md) |
| Pokrenuti drugi workflow | [Execute](execute-node.md) |

Posegnite za **Code** kada logika doista ne odgovara navedenima — prilagođena matematika, specifično parsiranje ili algoritam.
## Primjer

Redci s rezultatima koje proizvodi uzvodni čvor:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Kada je `codeParameters` postavljen na `{ "rows": "$fetchRows.result" }`, nizvodni čvorovi čitaju `$scoreRows.result.total`.
