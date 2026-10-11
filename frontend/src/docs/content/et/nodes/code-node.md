# Code

**Code**-sõlm käivitab teie kirjutatud Pythoni koodi, millel on oma `requirements.txt`, ja tagastab JSON-i. Iga käivitus saab täiesti uue konteineri, mis hävitatakse käivituse lõppedes, seega üks käivitus ei saa kunagi näha ega mõjutada teist.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.result` (see, mida `main` tagastas), lisaks `$nodeLabel.logs` ja `$nodeLabel.install` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `codeSource` | string | Pythoni lähtekood. Peab defineerima `main(params)` ja tagastama JSON-serialiseeritava väärtuse |
| `codeParameters` | expression | JSON-objekt, mis ühendab workflow andmed koodiga. Avaldised lahendatakse enne koodi käivitamist |
| `codeRequirements` | string | `requirements.txt` sisu, üks pakett rea kohta. Tühi jätab installi vahele |
| `codeAllowNetwork` | boolean | Kas kood ise võib võrku pääseda (vaikimisi `false`) |

## Funktsioon `main`

Teie kood peab defineerima ülatasemel `main`-funktsiooni, mis võtab ühe argumendi:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Mooduli tasemel laused käivituvad, kuid sõlme väljundiks saab ainult see, mida `main` tagastab.

Redaktor kuvab reanumbrid ja **Format** nupu kõrval olev laiendusnupp avab suurema redaktori, mille saab sulgeda klahviga `Esc` — muudatused rakenduvad kirjutamise ajal, seega pole midagi salvestada. Nupp **Format** vormindab teie koodi ümber Ruffiga, säilitades kommentaarid. See parandab ka taandete (indentation) kahjustused, mida kleepimine tavaliselt põhjustab: ühtlaselt taandatud plokk, tabulaatorid segamini tühikutega ja rida, mis on oma plokist ühe või kahe tühiku võrra nihkes, parandatakse kõik, mitte ei lükata tagasi. Tõeline süntaksiviga teatatakse selle rea ja veeruga. Vormindamine toimub samas isoleeritud konteineris, milles sõlm käivitub — ilma võrguta, ilma backend-keskkonnata — seega vajab see Dockerit täpselt nagu käivitaminegi.

## Parameetrite lugemine

`params` toetab punktnotatsiooni, sealhulgas läbi pesastatud objektide ja loendite:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` loeb võtmeid, mis ei ole kehtivad Pythoni identifikaatorid
- `params.get("maybe")` tagastab `None`, selle asemel et visata erandit, kui võti puudub
- `params.to_dict()` tagastab tavalise sõnastiku
- Kunagi esitamata võtme lugemine viskab erandi, mis nimetab võtme ja loetleb saadaolevad

## Väljund

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — funktsiooni `main` tagastusväärtus. Edasised sõlmed loevad `$nodeLabel.result.message`
- `logs` — kõik, mille kood saatis `print`-i, eraldi jäädvustatud, et see ei rikuks kunagi tulemust
- `install` — milline tööriist sõltuvused installis (`uv`, `pip` või `none`) ja selle väljund

## Sõltuvused

Loetlege paketid failis `requirements.txt` täpselt nii, nagu teeksite seda lokaalselt:

```
requests==2.32.3
feedparser
```

Paketid installitakse tööriistaga `uv` ühekordselt kasutatavasse kataloogi enne koodi käivitamist; kui `uv` ei suuda paketti käsitleda, proovib Heym uuesti tööriistaga `pip`. Käivituste vahel ei vahemällu salvestata midagi, seega rasked sõltuvused lisavad igale käivitusele mitu sekundit. Faili `requirements.txt` tühjaks jätmine jätab installietapi täielikult vahele ja on märgatavalt kiirem.

Paketid, millel pole wheel-faili ja mis vajavad C-kompilaatorit, ei installi. Põhjus ilmub väljundisse `install.log`.

## Võrk

| Etapp | Võrk |
|-------|---------|
| Sõltuvuste installimine | Alati sees — pip ja uv peavad jõudma PyPI-sse |
| Teie koodi käivitamine | Vaikimisi väljas. `codeAllowNetwork` lülitab selle sisse |

Kui `codeAllowNetwork` on väljas, ebaõnnestub väljuv päring nagu `requests.get(...)` ühenduse veaga. See on kavandatud vaikeväärtus: enamik Code-sõlmi teisendab andmeid, mille mõni teine sõlm on juba hankinud. Eelistage hankimist **HTTP**-sõlmega ja sisu edastamist `codeParameters` kaudu.

## Sandbox ja piirangud

Teie kood käivitub mitte-root kasutajana konteineris, kus on eemaldatud kõik Linuxi võimekused (capabilities), seatud `no-new-privileges` ja kirjutuskaitstud juurfailisüsteem. See ei saa Dockeri socketit ega ühtegi backend-i saladust ega keskkonnamuutujat.

| Piirang | Väärtus |
|-------|-------|
| Mälu | 512 MB |
| CPU-d | 1 |
| Protsessid | 256 |
| Sõltuvuste installi ajalõpp | 120 sekundit |
| Käivituse ajalõpp | 60 sekundit |

Need on sandbox'i fikseeritud omadused, mitte konfiguratsioon.

> **Docker on nõutav.** Erinevalt Agendi Pythoni tööriistadest ja oskustest ei ole Code-sõlmel lokaalset varurežiimi ega keskkonnamuutujat selle leevendamiseks. Ilma kättesaadava Dockeri daemonita ebaõnnestub sõlm selge veaga, selle asemel et käivitada teie kood backend-protsessis. Natiivse `./run.sh` arenduse korral käivitage Docker enne selle sõlme kasutamist. Vt [Turvalisus → Code-sõlme sandbox](../reference/security.md#code-node-sandbox).

## Kasutage teist sõlme, kui see sobib

| Soovite | Kasutage |
|-------------|-----|
| Parsida või koostada CSV-d, TSV-d, XML-i või teha failile OCR-i | [Converter](converter-node.md) |
| Kutsuda HTTP API-t | [HTTP](http-node.md) |
| Välju kaardistada või ümber nimetada | [Set](set-node.md) |
| Käivitada teist workflow'd | [Execute](execute-node.md) |

Kasutage **Code**-sõlme, kui loogika tõesti ei sobi nendega — kohandatud matemaatika, eripärane parsimine või algoritm.
## Näide

Ülemvoolu sõlme poolt loodud skooriread:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Kui `codeParameters` on seatud väärtusele `{ "rows": "$fetchRows.result" }`, loevad allavoolu sõlmed `$scoreRows.result.total`.
