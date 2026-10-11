# Kód

Uzol **Kód** spúšťa Python, ktorý napíšete, s vlastným súborom `requirements.txt`, a vracia JSON. Každé spustenie dostane úplne nový kontajner, ktorý sa po dokončení behu zničí, takže jedno spustenie nikdy nemôže vidieť ani ovplyvniť iné.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.result` (čokoľvek, čo vrátila funkcia `main`), plus `$nodeLabel.logs` a `$nodeLabel.install` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `codeSource` | string | Zdrojový kód v Pythone. Musí definovať `main(params)` a vrátiť hodnotu serializovateľnú do JSON |
| `codeParameters` | expression | Objekt JSON, ktorý prepája dáta workflowu do kódu. Výrazy sa vyhodnotia pred spustením kódu |
| `codeRequirements` | string | Obsah súboru `requirements.txt`, jeden balík na riadok. Prázdna hodnota preskočí inštaláciu |
| `codeAllowNetwork` | boolean | Či samotný kód môže pristupovať k sieti (predvolené `false`) |

## Funkcia `main`

Váš kód musí definovať najvyššiu úroveň funkcie `main`, ktorá prijíma jeden argument:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Príkazy na úrovni modulu sa vykonajú, ale iba to, čo vráti `main`, sa stane výstupom uzla.

Editor zobrazuje čísla riadkov a tlačidlo rozšírenia vedľa **Format** otvorí väčší editor, ktorý sa zatvorí klávesom `Esc` — úpravy sa aplikujú priebežne počas písania, takže nie je čo ukladať. Tlačidlo **Format** preformátuje váš kód pomocou nástroja Ruff a zachová komentáre. Zároveň opraví poškodenie odsadenia, ktoré zvyčajne vzniká pri vkladaní: rovnomerne odsadený blok, tabulátory zmiešané s medzerami a riadok posunutý o jednu či dve medzery od svojho bloku sa opravia namiesto odmietnutia. Skutočná syntaktická chyba sa nahlási s uvedením riadku a stĺpca. Formátovanie prebieha v tom istom izolovanom kontajneri, v ktorom beží uzol — bez siete, bez prostredia backendu — takže rovnako ako spustenie vyžaduje Docker.

## Čítanie parametrov

`params` podporuje bodkovú notáciu, a to aj cez vnorené objekty a zoznamy:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` číta kľúče, ktoré nie sú platnými identifikátormi Pythonu
- `params.get("maybe")` vráti `None` namiesto vyvolania chyby, keď kľúč chýba
- `params.to_dict()` vráti obyčajný slovník
- Čítanie kľúča, ktorý nebol nikdy poskytnutý, vyvolá chybu s uvedením názvu kľúča a zoznamu dostupných možností

## Výstup

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — návratová hodnota funkcie `main`. Nadväzujúce uzly čítajú `$nodeLabel.result.message`
- `logs` — všetko, čo kód odoslal do `print`, zachytené oddelene, aby to nikdy nepoškodilo výsledok
- `install` — ktorý nástroj nainštaloval závislosti (`uv`, `pip` alebo `none`) a jeho výstup

## Závislosti

Uveďte balíky v súbore `requirements.txt` presne tak, ako by ste to urobili lokálne:

```
requests==2.32.3
feedparser
```

Balíky sa nainštalujú pomocou nástroja `uv` do dočasného adresára pred spustením kódu; ak `uv` nedokáže balík spracovať, Heym to zopakuje s nástrojom `pip`. Medzi behmi sa nič neukladá do vyrovnávacej pamäte, takže ťažké závislosti pridajú ku každému spusteniu niekoľko sekúnd. Ak ponecháte súbor `requirements.txt` prázdny, krok inštalácie sa úplne preskočí a je to výrazne rýchlejšie.

Balíky, ktoré neobsahujú wheel a vyžadujú kompilátor jazyka C, sa nepodarí nainštalovať. Dôvod sa zobrazí v `install.log`.

## Sieť

| Fáza | Sieť |
|-------|---------|
| Inštalácia závislostí | Vždy zapnutá — pip a uv musia dosiahnuť PyPI |
| Spustenie vášho kódu | Predvolene vypnutá. `codeAllowNetwork` ju zapne |

Pri vypnutom `codeAllowNetwork` odchádzajúce volanie, ako napríklad `requests.get(...)`, zlyhá s chybou pripojenia. To je zamýšľané predvolené správanie: väčšina uzlov Kód transformuje dáta, ktoré už načítal iný uzol. Uprednostnite načítanie pomocou uzla **HTTP** a odovzdanie tela cez `codeParameters`.

## Sandbox a limity

Váš kód beží ako používateľ bez oprávnení root v kontajneri so všetkými oprávneniami Linuxu odobranými, s nastavením `no-new-privileges` a s koreňovým systémom súborov iba na čítanie. Nedostáva prístup k socketu Dockeru ani k žiadnym tajomstvám či prostrediu backendu.

| Limit | Hodnota |
|-------|-------|
| Pamäť | 512 MB |
| CPU | 1 |
| Procesy | 256 |
| Časový limit inštalácie závislostí | 120 sekúnd |
| Časový limit spustenia | 60 sekúnd |

Toto sú pevné vlastnosti sandboxu, nie konfigurácia.

> **Vyžaduje sa Docker.** Na rozdiel od nástrojov a zručností Agent Python nemá uzol Kód žiadny lokálny záložný režim ani premennú prostredia na jeho uvoľnenie. Bez dostupného démona Docker uzol zlyhá s jasnou chybou namiesto spustenia vášho kódu v procese backendu. Pri vývoji pomocou natívneho `./run.sh` spustite Docker pred použitím tohto uzla. Pozrite si [Security → Code node sandbox](../reference/security.md#code-node-sandbox).

## Použite iný uzol, keď sa hodí

| Chcete | Použite |
|-------------|-----|
| Parsovať alebo zostaviť CSV, TSV, XML alebo vykonať OCR súboru | [Converter](converter-node.md) |
| Zavolať HTTP API | [HTTP](http-node.md) |
| Mapovať alebo premenovať polia | [Set](set-node.md) |
| Spustiť iný workflow | [Execute](execute-node.md) |

Po uzle **Kód** siahnite vtedy, keď sa logika naozaj nehodí na uvedené možnosti — vlastná matematika, špecifické parsovanie alebo algoritmus.
## Príklad

Skórovanie riadkov vytvorených predchádzajúcim uzlom:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

S `codeParameters` nastavenými na `{ "rows": "$fetchRows.result" }` čítajú nasledujúce uzly `$scoreRows.result.total`.
