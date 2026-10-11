# Code

**Code**-solmu suorittaa käyttäjän kirjoittamaa Python-koodia omassa `requirements.txt`-ympäristössään ja palauttaa JSON-muotoisen tuloksen. Jokainen suoritus saa käyttöönsä uuden kontainerin, joka tuhotaan suorituksen päätyttyä, joten eri suoritukset eivät voi nähdä tai vaikuttaa toisiinsa.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.result` (mitä `main` palautti), lisäksi `$nodeLabel.logs` ja `$nodeLabel.install` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `codeSource` | merkkijono | Python-lähdekoodi. Täytyy määritellä `main(params)` ja palauttaa JSON-serialisoitava arvo |
| `codeParameters` | lauseke | JSON-objekti, joka yhdistää workflow-datan koodiin. Lausekkeet evaluoidaan ennen koodin suoritusta |
| `codeRequirements` | merkkijono | `requirements.txt`-sisältö, yksi paketti per rivi. Tyhjä ohittaa asennuksen |
| `codeAllowNetwork` | totuusarvo | Sallitaanko koodille verkkoyhteydet (oletus `false`) |

## `main`-funktio

Koodisi täytyy määritellä ylimmällä tasolla `main`-funktio, joka ottaa yhden argumentin:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Moduulin tasolla olevat lauseet suoritetaan, mutta vain `main`-funktion palauttama arvo tulee solmun tulosteeksi.

Editori näyttää rivinumeroita, ja **Format**-painikkeen vieressä oleva laajennuspainike avaa suuremman editorin, joka sulkeutuu `Esc`-näppäimellä. Muutokset tallentuvat automaattisesti kirjoittaessa, joten erillistä tallennustoimintoa ei ole. **Format**-painike muotoilee koodisi Ruff-työkalulla säilyttäen kommentit. Se myös korjaa yleisimmät sisennysongelmat, kuten epätasaisen lohkon, sekaisin olevat välilyönnit ja tabulaattorit sekä väärälle tasolle siirtyneen rivin. Aito syntaksivirhe ilmoitetaan rivin ja sarakkeen numerolla. Muotoilu suoritetaan samassa eristetyssä kontainerissa kuin itse koodi – ei verkkoyhteyttä eikä taustajärjestelmän ympäristöä – joten se vaatii Dockerin kuten suorituskin.

## Parametrien lukeminen

`params` tukee pistenotaatiota, myös sisäkkäisten objektien ja listojen läpi:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` lukee avaimia, jotka eivät ole kelvollisia Python-identifikaattoreita
- `params.get("maybe")` palauttaa `None` virheen sijasta, kun avain puuttuu
- `params.to_dict()` palauttaa tavallisen sanakirjan
- Puuttuvan avaimen lukeminen aiheuttaa virheen, joka listaa saatavilla olevat avaimet

## Tuloste

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — `main`-funktion palautusarvo. Alaspäin olevat solmut lukevat `$nodeLabel.result.message`
- `logs` — kaikki koodin `print`-lauseilla tulostama, erikseen tallennettuna, jotta se ei sotke tulosta
- `install` — käytetty riippuvuuksien asennustyökalu (`uv`, `pip` tai `none`) ja sen tuloste

## Riippuvuudet

Listaa paketit `requirements.txt`-tiedostossa kuten paikallisesti:

```
requests==2.32.3
feedparser
```

Paketit asennetaan `uv`-työkalulla hylätävään hakemistoon ennen koodin suoritusta. Jos `uv` ei käsittele pakettia, Heym yrittää `pip`:llä. Mitään ei välimuistieta suoritusten välillä, joten suurten riippuvuuksien asennus hidastaa jokaista suoritusta useilla sekunneilla. Tyhjä `requirements.txt` ohittaa asennuksen kokonaan ja on huomattavasti nopeampi.

Paketit, jotka eivät sisällä wheel-tiedostoa ja vaativat C-kääntäjän, epäonnistuvat asennuksessa. Syy näkyy `install.log`-tiedostossa.

## Verkko

| Vaihe | Verkkoyhteys |
|-------|---------|
| Riippuvuuksien asennus | Aina päällä – pip ja uv tarvitsevat yhteyden PyPI:hin |
| Koodin suoritus | Oletuksena pois päältä. `codeAllowNetwork` ottaa yhteyden käyttöön |

Kun `codeAllowNetwork` on pois päältä, ulkoiset yhteydet kuten `requests.get(...)` epäonnistuvat yhteyden virheellä. Tämä on tarkoituksellinen oletus: useimmat Code-solmut muokkaavat toisen solmun jo hakemaa dataa. Suosittelemme datan hakemista **HTTP**-solmulla ja välittämistä `codeParameters`-kautta.

## Hiekkalaatikko ja rajoitukset

Koodisi suoritetaan ei-pääkäyttäjänä kontainerissa, jossa kaikki Linux-kyvyt on poistettu, `no-new-privileges` on käytössä ja juurihakemisto on vain luku -tilassa. Se ei saa Docker-socketia eikä taustajärjestelmän salaisuuksia tai ympäristömuuttujia.

| Rajoitus | Arvo |
|-------|-------|
| Muisti | 512 MB |
| Suorittimet | 1 |
| Prosessit | 256 |
| Riippuvuuksien asennuksen aikakatkaisu | 120 sekuntia |
| Suorituksen aikakatkaisu | 60 sekuntia |

Nämä ovat hiekkalaatikon kiinteitä ominaisuuksia, eivätkä ne ole muokattavissa.

> **Docker vaaditaan.** Toisin kuin Agent Python -työkalut ja taidot, Code-solmulla ei ole paikallista varatilaa eikä ympäristömuuttujaa, joka lieventäisi rajoituksia. Jos Docker-daemoni ei ole käytettävissä, solmu epäonnistuu selkeällä virheellä sen sijaan, että suorittaisi koodisi taustaprosessissa. Kehitysympäristössä (`./run.sh`) varmista, että Docker on käynnissä ennen tämän solmun käyttöä. Katso lisää [Security → Code node sandbox](../reference/security.md#code-node-sandbox).

## Käytä toista solmua, jos sopiva löytyy

| Haluatko | Käytä |
|-------------|-----|
| Jäsentää tai rakentaa CSV-, TSV-, XML-tiedostoja tai tehdä OCR:ää tiedostolle | [Converter](converter-node.md) |
| Kutsua HTTP-APIa | [HTTP](http-node.md) |
| Muokata tai nimetä kenttiä uudelleen | [Set](set-node.md) |
| Suorittaa toisen workflowin | [Execute](execute-node.md) |

Käytä **Code**-solmua, kun logiikka ei todellakaan sovi yllä oleviin – mukautetut matemaattiset operaatiot, erikoisjäsennys tai algoritmit.
## Esimerkki

Ylävirran solmun tuottamat pistemäärärivit:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Kun `codeParameters` on asetettu arvoon `{ "rows": "$fetchRows.result" }`, alavirran solmut lukevat arvon `$scoreRows.result.total`.
