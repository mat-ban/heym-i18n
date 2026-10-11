# Kód

A **Kód** csomópont az Ön által írt Python kódot futtatja, saját `requirements.txt` fájllal, és JSON-t ad vissza. Minden futtatás egy vadonatúj konténert kap, amely a futás befejeztével megsemmisül, így az egyik futtatás soha nem láthatja és nem befolyásolhatja a másikat.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.result` (amit a `main` visszaadott), valamint `$nodeLabel.logs` és `$nodeLabel.install` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `codeSource` | string | Python forráskód. Meg kell határoznia a `main(params)` függvényt, és JSON-szerializálható értéket kell visszaadnia |
| `codeParameters` | expression | Egy JSON objektum, amely a workflow adatait köti be a kódba. A kifejezések a kód futtatása előtt kerülnek kiértékelésre |
| `codeRequirements` | string | A `requirements.txt` tartalma, soronként egy csomaggal. Üresen hagyva kihagyja a telepítést |
| `codeAllowNetwork` | boolean | Engedélyezheti-e a kód számára a hálózati elérést (alapértelmezett: `false`) |

## A `main` függvény

A kódnak definiálnia kell egy felső szintű `main` függvényt, amely egy argumentumot fogad:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

A modul szintű utasítások lefutnak, de csak az lesz a csomópont kimenete, amit a `main` visszaad.

A szerkesztő sorszámokat jelenít meg, a **Format** melletti kibontás gomb pedig egy nagyobb szerkesztőt nyit meg, amely `Esc` billentyűvel zárható be — a módosítások gépelés közben érvénybe lépnek, így nincs mit menteni. A **Format** gomb a Ruff segítségével újraformázza a kódot, megőrizve a megjegyzéseket. Kijavítja a beillesztés során gyakran keletkező behúzási hibákat is: az egységesen behúzott blokkokat, a tabulátorok és szóközök keveredését, valamint az egy-két szóközzel elcsúszott sorokat is javítja a visszautasítás helyett. Valódi szintaktikai hiba esetén a sor- és oszlopszámmal együtt jelzi a hibát. A formázás ugyanabban az izolált konténerben fut, amelyben a csomópont is fut — hálózat és backend környezet nélkül —, így a futtatáshoz hasonlóan Docker szükséges hozzá.

## Paraméterek olvasása

A `params` támogatja a pontnotációt, beleértve a beágyazott objektumokat és listákat is:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` olyan kulcsokat olvas be, amelyek nem érvényes Python azonosítók
- `params.get("maybe")` `None` értéket ad vissza a hiba dobása helyett, ha a kulcs hiányzik
- `params.to_dict()` visszaadja a sima szótárat
- Egy soha meg nem adott kulcs beolvasása hibát dob, amely megnevezi a kulcsot és felsorolja az elérhetőket

## Kimenet

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — a `main` visszatérési értéke. A downstream csomópontok a `$nodeLabel.result.message` útvonalon olvassák
- `logs` — minden, amit a kód a `print` számára küldött, külön rögzítve, hogy soha ne sérüljön az eredmény
- `install` — melyik eszköz telepítette a függőségeket (`uv`, `pip` vagy `none`), és annak kimenete

## Függőségek

Sorolja fel a csomagokat a `requirements.txt` fájlban pontosan úgy, ahogy helyben tenné:

```
requests==2.32.3
feedparser
```

A csomagok telepítése az `uv` segítségével egy eldobható könyvtárba történik a kód futtatása előtt; ha az `uv` nem tud kezelni egy csomagot, a Heym újrapróbálja a `pip`-pel. A futtatások között semmi nem kerül gyorsítótárba, így a nagy függőségek több másodpercet adnak minden futtatáshoz. A `requirements.txt` üresen hagyása teljesen kihagyja a telepítési lépést, és érezhetően gyorsabb.

A wheel nélkül érkező, C fordítót igénylő csomagok telepítése sikertelen lesz. Az ok az `install.log` fájlban jelenik meg.

## Hálózat

| Fázis | Hálózat |
|-------|---------|
| Függőségek telepítése | Mindig bekapcsolva — a pip-nek és az uv-nak el kell érnie a PyPI-t |
| A kód futtatása | Alapértelmezésben kikapcsolva. A `codeAllowNetwork` kapcsolja be |

Ha a `codeAllowNetwork` ki van kapcsolva, egy kimenő hívás, például a `requests.get(...)`, kapcsolódási hibával meghiúsul. Ez a szándékos alapértelmezés: a legtöbb Kód csomópont olyan adatokat alakít át, amelyeket egy másik csomópont már lekért. Részesítse előnyben a lekérést egy **HTTP** csomóponttal, és adja át a törzset a `codeParameters` segítségével.

## Sandbox és korlátok

A kód nem root felhasználóként fut egy konténerben, ahol minden Linux capability el van véve, a `no-new-privileges` be van állítva, és a root fájlrendszer csak olvasható. Nem kap Docker socketet, sem a backend titkait vagy környezetét.

| Korlát | Érték |
|-------|-------|
| Memória | 512 MB |
| CPU-k | 1 |
| Folyamatok | 256 |
| Függőségtelepítési időtúllépés | 120 másodperc |
| Futtatási időtúllépés | 60 másodperc |

Ezek a sandbox rögzített tulajdonságai, nem konfigurálhatók.

> **Docker szükséges.** Az Agent Python eszközökkel és skillekkel ellentétben a Kód csomópontnak nincs helyi tartalék módja, és nincs környezeti változó a lazítására. Elérhető Docker daemon nélkül a csomópont egyértelmű hibával meghiúsul, ahelyett hogy a backend folyamatban futtatná a kódot. Natív `./run.sh` fejlesztés esetén indítsa el a Dockert a csomópont használata előtt. Lásd: [Biztonság → Kód csomópont sandbox](../reference/security.md#code-node-sandbox).

## Használjon másik csomópontot, ha az illik

| Szeretné | Használja |
|-------------|-----|
| CSV, TSV, XML feldolgozása vagy létrehozása, vagy fájl OCR-ezése | [Converter](converter-node.md) |
| HTTP API hívása | [HTTP](http-node.md) |
| Mezők leképezése vagy átnevezése | [Set](set-node.md) |
| Egy másik workflow futtatása | [Execute](execute-node.md) |

Akkor forduljon a **Kód** csomóponthoz, ha a logika valóban nem illik ezekhez — egyedi matematika, speciális feldolgozás vagy egy algoritmus.
## Példa

Egy felsőbb csomópont által előállított pontszám-sorok:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Ha a `codeParameters` értéke `{ "rows": "$fetchRows.result" }`, az alsóbb csomópontok a `$scoreRows.result.total` értéket olvassák.
