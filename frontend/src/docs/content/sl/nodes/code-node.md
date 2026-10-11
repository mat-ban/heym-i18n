# Koda

**Koda** vozlišče izvaja Python kodo, ki jo napišete, z lastnim `requirements.txt`, in vrača JSON. Vsako izvajanje dobi povsem nov kontejner, ki se uniči, ko se izvajanje konča, zato eno izvajanje nikoli ne more videti ali vplivati na drugo.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.result` (kar koli je vrnila `main`), plus `$nodeLabel.logs` in `$nodeLabel.install` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `codeSource` | niz | Python izvor. Mora definirati `main(params)` in vrniti vrednost, ki jo je mogoče serializirati v JSON |
| `codeParameters` | izraz | JSON objekt, ki povezuje podatke workflow z kodo. Izrazi se razrešijo pred izvajanjem kode |
| `codeRequirements` | niz | Vsebina `requirements.txt`, en paket na vrstico. Prazno preskoči namestitev |
| `codeAllowNetwork` | boolean | Ali lahko koda sama dostopa do omrežja (privzeto `false`) |

## Funkcija `main`

Vaša koda mora definirati vrhnjo funkcijo `main`, ki sprejme en argument:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Izjave na ravni modula se izvajajo, vendar samo tisto, kar vrne `main`, postane izhod vozlišča.

Urejevalnik prikazuje številke vrstic, gumb za širitev poleg **Format** pa odpre večjega, ki se zapre z `Esc` — spremembe se uporabijo, ko tipkate, zato ni treba shranjevati. Gumb **Format** preoblikuje vašo kodo z Ruff, pri čemer ohrani komentarje. Prav tako popravi poškodbe zamika, ki jih običajno povzroči lepljenje: enotno zamaknjen blok, tabulatorji pomešani s presledki in vrstica, ki je nekoliko odmaknjena od svojega bloka, so vsi popravljeni namesto zavrnjeni. Prava napaka v sintaksi se poroča z njeno vrstico in stolpcem. Oblikovanje se izvaja v istem izoliranem kontejnerju, v katerem se izvaja vozlišče — brez omrežja, brez okolja v ozadju — zato potrebuje Docker, prav tako kot izvajanje.

## Branje parametrov

`params` podpira dot notacijo, vključno skozi gnezdene objekte in sezname:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` prebere ključe, ki niso veljavni Python identifikatorji
- `params.get("maybe")` vrne `None` namesto, da bi sprožila napako, ko ključ ni prisoten
- `params.to_dict()` vrne navaden slovar
- Branje ključa, ki nikoli ni bil posredovan, sproži napako, ki imenuje ključ in našteva, kaj je na voljo

## Izhod

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — vrnjena vrednost `main`. Spodnja vozlišča preberejo `$nodeLabel.result.message`
- `logs` — vse, kar je koda poslala na `print`, zajeto ločeno, da nikoli ne pokvari rezultata
- `install` — kateri orodje je namestilo odvisnosti (`uv`, `pip` ali `none`) in njegov izhod

## Odvisnosti

Seznam paketov v `requirements.txt` natančno tako, kot bi to storili lokalno:

```
requests==2.32.3
feedparser
```

Paketi se namestijo z `uv` v začasni imenik pred izvajanjem kode; če `uv` ne more obvladati paketa, Heym poskusi z `pip`. Nič ni predpomnjeno med izvajanji, zato težke odvisnosti dodajo več sekund vsakemu izvajanju. Pustitev `requirements.txt` praznega popolnoma preskoči korak namestitve in je opazno hitrejša.

Paketi, ki ne dostavijo nobene wheel in potrebujejo C prevajalnik, ne bodo uspeli pri namestitvi. Razlog se prikaže v `install.log`.

## Omrežje

| Fazna | Omrežje |
|-------|---------|
| Namestitev odvisnosti | Vedno vklopljeno — pip in uv morata doseči PyPI |
| Izvajanje vaše kode | Privzeto izklopljeno. `codeAllowNetwork` ga vklopi |

Ko je `codeAllowNetwork` izklopljen, izhodni klic, kot je `requests.get(...)`, ne uspe z napako povezave. To je predvideni privzeti način: večina Code vozlišč transformira podatke, ki jih je že pridobilo drugo vozlišče. Raje pridobite s **HTTP** vozliščem in prenesite telo skozi `codeParameters`.

## Sandbox in omejitve

Vaša koda se izvaja kot uporabnik brez korenskih pravic v kontejnerju z vsemi Linux zmožnostmi odstranjeni, nastavljeno `no-new-privileges` in z datotečnim sistemom samo za branje. Ne prejme nobenega Docker vtičnika in nobenih skrivnosti ali okolja v ozadju.

| Omejitev | Vrednost |
|----------|----------|
| Pomnilnik | 512 MB |
| CPU-ji | 1 |
| Procesi | 256 |
| Časovna omejitev namestitve odvisnosti | 120 sekund |
| Časovna omejitev izvajanja | 60 sekund |

To so fiksne lastnosti sandboxa, ne konfiguracija.

> **Docker je obvezen.** Za razliko od Agent Python orodij in veščin, Code vozlišče nima lokalnega načina povratka in nobene okoljske spremenljivke za sprostitev. Brez dostopnega Docker demona vozlišče ne uspe z jasnim sporočilom o napaki, namesto da bi izvajalo vašo kodo v procesu v ozadju. Pri lokalnem razvoju `./run.sh` zaženite Docker pred uporabo tega vozlišča. Oglejte si [Varnost → Sandbox vozlišča](../reference/security.md#code-node-sandbox).

## Uporabite drugo vozlišče, ko eno ustreza

| Želite | Uporabite |
|--------|-----------|
| Razčleniti ali zgraditi CSV, TSV, XML ali OCR datoteko | [Converter](converter-node.md) |
| Klicati HTTP API | [HTTP](http-node.md) |
| Preslikati ali preimenovati polja | [Set](set-node.md) |
| Izvesti drugo delovno pot | [Execute](execute-node.md) |

Segnite po **Koda**, ko logika resnično ne ustreza tem — prilagojena matematika, posebna razčlenitev ali algoritem.
## Primer

Ocenite vrstice, ki jih ustvari zgornje vozlišče:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Z nastavitvijo `codeParameters` na `{ "rows": "$fetchRows.result" }` spodnja vozlišča berejo `$scoreRows.result.total`.
