# Code

De **Code**-node voert Python uit dat u zelf schrijft, met een eigen `requirements.txt`, en retourneert JSON. Elke uitvoering krijgt een gloednieuwe container die wordt vernietigd zodra de run is voltooid, zodat de ene uitvoering nooit de andere kan zien of beïnvloeden.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.result` (wat `main` heeft geretourneerd), plus `$nodeLabel.logs` en `$nodeLabel.install` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `codeSource` | string | Python-broncode. Moet `main(params)` definiëren en een JSON-serialiseerbare waarde retourneren |
| `codeParameters` | expression | Een JSON-object dat workflowgegevens aan de code koppelt. Expressies worden opgelost voordat de code wordt uitgevoerd |
| `codeRequirements` | string | Inhoud van `requirements.txt`, één pakket per regel. Leeg slaat de installatie over |
| `codeAllowNetwork` | boolean | Of de code zelf het netwerk mag bereiken (standaard `false`) |

## De functie `main`

Uw code moet een top-level `main` definiëren die één argument accepteert:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Statements op moduleniveau worden wel uitgevoerd, maar alleen wat `main` retourneert wordt de uitvoer van de node.

De editor toont regelnummers, en de uitvouwknop naast **Format** opent een grotere editor die sluit met `Esc` — bewerkingen worden direct toegepast terwijl u typt, dus er is niets op te slaan. De knop **Format** herformatteert uw code met Ruff, waarbij opmerkingen behouden blijven. Het herstelt ook de inspringingsschade die plakken meestal veroorzaakt: een uniform ingesprongen blok, tabs vermengd met spaties, en een regel die een spatie of twee naast zijn blok staat worden allemaal gerepareerd in plaats van geweigerd. Een echte syntaxisfout wordt gemeld met de bijbehorende regel en kolom. Formatteren wordt uitgevoerd in dezelfde geïsoleerde container waarin de node draait — geen netwerk, geen backend-omgeving — dus het vereist Docker, net als de uitvoering.

## Parameters lezen

`params` ondersteunt puntnotatie, ook door geneste objecten en lijsten:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` leest sleutels die geen geldige Python-identificaties zijn
- `params.get("maybe")` retourneert `None` in plaats van een fout te geven wanneer een sleutel ontbreekt
- `params.to_dict()` retourneert het platte woordenboek
- Het lezen van een sleutel die nooit is opgegeven geeft een fout die de sleutel benoemt en vermeldt wat beschikbaar is

## Uitvoer

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — de retourwaarde van `main`. Stroomafwaartse nodes lezen `$nodeLabel.result.message`
- `logs` — alles wat de code naar `print` heeft gestuurd, apart vastgelegd zodat het het resultaat nooit aantast
- `install` — welke tool de afhankelijkheden heeft geïnstalleerd (`uv`, `pip`, of `none`) en de bijbehorende uitvoer

## Afhankelijkheden

Vermeld pakketten in `requirements.txt` precies zoals u dat lokaal zou doen:

```
requests==2.32.3
feedparser
```

Pakketten worden met `uv` geïnstalleerd in een tijdelijke map voordat de code wordt uitgevoerd; als `uv` een pakket niet aankan, probeert Heym het opnieuw met `pip`. Er wordt niets gecachet tussen runs, dus zware afhankelijkheden voegen enkele seconden toe aan elke uitvoering. `requirements.txt` leeg laten slaat de installatiestap volledig over en is merkbaar sneller.

Pakketten die geen wheel leveren en een C-compiler nodig hebben, zullen niet kunnen worden geïnstalleerd. De reden verschijnt in `install.log`.

## Netwerk

| Fase | Netwerk |
|-------|---------|
| Afhankelijkheden installeren | Altijd aan — pip en uv moeten PyPI kunnen bereiken |
| Uw code uitvoeren | Standaard uit. `codeAllowNetwork` schakelt het in |

Met `codeAllowNetwork` uit mislukt een uitgaande aanroep zoals `requests.get(...)` met een verbindingsfout. Dat is de bedoelde standaard: de meeste Code-nodes transformeren gegevens die een andere node al heeft opgehaald. Haal gegevens liever op met een **HTTP**-node en geef de body door via `codeParameters`.

## Sandbox en limieten

Uw code draait als een niet-root gebruiker in een container waarin alle Linux-capabilities zijn ingetrokken, `no-new-privileges` is ingesteld en het root-bestandssysteem alleen-lezen is. De code ontvangt geen Docker-socket en geen van de secrets of omgevingsvariabelen van de backend.

| Limiet | Waarde |
|-------|-------|
| Geheugen | 512 MB |
| CPU's | 1 |
| Processen | 256 |
| Time-out voor installatie van afhankelijkheden | 120 seconden |
| Time-out voor uitvoering | 60 seconden |

Dit zijn vaste eigenschappen van de sandbox, geen configuratie.

> **Docker is vereist.** Anders dan bij Agent Python-tools en skills heeft de Code-node geen lokale fallbackmodus en geen omgevingsvariabele om dit te versoepelen. Zonder bereikbare Docker-daemon mislukt de node met een duidelijke fout in plaats van uw code in het backend-proces uit te voeren. Start bij native `./run.sh`-ontwikkeling Docker voordat u deze node gebruikt. Zie [Security → Code node sandbox](../reference/security.md#code-node-sandbox).

## Gebruik een andere node wanneer die past

| U wilt | Gebruik |
|-------------|-----|
| CSV, TSV, XML parseren of opbouwen, of OCR op een bestand uitvoeren | [Converter](converter-node.md) |
| Een HTTP API aanroepen | [HTTP](http-node.md) |
| Velden mappen of hernoemen | [Set](set-node.md) |
| Een andere workflow uitvoeren | [Execute](execute-node.md) |

Grijp naar **Code** wanneer de logica echt niet in die nodes past — aangepaste wiskunde, specifieke parsing of een algoritme.
## Voorbeeld

Score-rijen die door een upstream-node worden geproduceerd:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Met `codeParameters` ingesteld op `{ "rows": "$fetchRows.result" }`, lezen downstream-nodes `$scoreRows.result.total`.
