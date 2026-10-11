# Code

**Code**-noden kører Python-kode, som skrives manuelt, med et tilhørende `requirements.txt`, og returnerer JSON. Hver kørsel får en helt ny container, som ødelægges, når kørslen er afsluttet, hvilket sikrer, at én kørsel aldrig kan se eller påvirke en anden.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.result` (hvad end `main` returnerer), plus `$nodeLabel.logs` og `$nodeLabel.install` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `codeSource` | string | Python-kildekode. Skal definere `main(params)` og returnere en JSON-serialiserbar værdi |
| `codeParameters` | expression | Et JSON-objekt, der forbinder workflow-data med koden. Udtryk løses, før koden kører |
| `codeRequirements` | string | Indhold af `requirements.txt`, én pakke pr. linje. Tomt springer installationen over |
| `codeAllowNetwork` | boolean | Om koden selv må tilgå netværket (standard `false`) |

## `main`-funktionen

Koden skal definere en top-level `main`, der tager ét argument:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Modulniveau-sætninger kører også, men kun det, som `main` returnerer, bliver nodens output.

Editoren viser linjenumre, og udvidelsesknappen ved siden af **Format** åbner en større editor, der lukkes med `Esc` — ændringer anvendes, mens der skrives, så der er intet at gemme. **Format**-knappen reformaterer koden med Ruff og bevarer kommentarer. Den reparerer også den indrykningsskade, som indsættelse typisk forårsager: et ensartet indrykket blok, tabs blandet med mellemrum og en linje, der sidder et mellemrum eller to fra sin blok, bliver alle rettet i stedet for afvist. En ægte syntaksfejl rapporteres med dens linje og kolonne i stedet. Formatering kører i den samme isolerede container, som noden kører i — intet netværk, ingen backend-miljø — så den kræver Docker ligesom kørsel gør.

## Læsning af parametre

`params` understøtter punktnotation, inklusive gennem nestede objekter og lister:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` læser nøgler, der ikke er gyldige Python-identifikatorer
- `params.get("maybe")` returnerer `None` i stedet for at give en fejl, når en nøgle mangler
- `params.to_dict()` returnerer det almindelige dictionary
- Læsning af en nøgle, der aldrig blev angivet, giver en fejl, der navngiver nøglen og lister, hvad der er tilgængeligt

## Output

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — returværdien fra `main`. Downstream-noder læser `$nodeLabel.result.message`
- `logs` — alt, hvad koden sendte til `print`, fanges separat, så det aldrig korrumperer resultatet
- `install` — hvilket værktøj der installerede afhængighederne (`uv`, `pip` eller `none`) og dets output

## Afhængigheder

Pakker skal listes i `requirements.txt` præcis som lokalt:

```
requests==2.32.3
feedparser
```

Pakker installeres med `uv` i en midlertidig mappe, før koden kører; hvis `uv` ikke kan håndtere en pakke, prøver Heym igen med `pip`. Intet caches mellem kørsler, så tunge afhængigheder tilføjer flere sekunder til hver kørsel. Hvis `requirements.txt` er tomt, springes installationsprocessen helt over, hvilket er mærkbart hurtigere.

Pakker, der ikke leverer noget wheel og har brug for en C-compiler, vil fejle under installationen. Årsagen vises i `install.log`.

## Netværk

| Fase | Netværk |
|-------|---------|
| Installation af afhængigheder | Altid tilgængeligt — pip og uv skal kunne nå PyPI |
| Kørsel af koden | Fravalgt som standard. `codeAllowNetwork` aktiverer det |

Når `codeAllowNetwork` er fravalgt, vil en udgående forespørgsel som `requests.get(...)` fejle med en forbindelsesfejl. Det er den tilsigtede standard: de fleste Code-noder transformerer data, som en anden node allerede har hentet. Foretræk at hente med en **HTTP**-node og sende body'en ind gennem `codeParameters`.

## Sandkasse og begrænsninger

Koden kører som en ikke-root-bruger i en container, hvor alle Linux-capabilities er fjernet, `no-new-privileges` er sat, og root-filsystemet er skrivebeskyttet. Den modtager ingen Docker-socket og ingen af backendens hemmeligheder eller miljø.

| Begrænsning | Værdi |
|-------|-------|
| Hukommelse | 512 MB |
| CPU'er | 1 |
| Processer | 256 |
| Timeout for installationsafhængigheder | 120 sekunder |
| Timeout for kørsel | 60 sekunder |

Disse er faste egenskaber ved sandkassen, ikke konfiguration.

> **Docker er påkrævet.** I modsætning til Agent Python-værktøjer og færdigheder har Code-noden ingen lokal fallback-tilstand og ingen miljøvariabel til at lempe på det. Uden en tilgængelig Docker-daemon fejler noden med en klar fejl i stedet for at køre koden i backend-processen. Ved native `./run.sh`-udvikling skal Docker startes, før denne node bruges. Se [Sikkerhed → Code-node sandkasse](../reference/security.md#code-node-sandbox).

## Brug en anden node, når det passer

| Ønskes | Brug |
|-------------|-----|
| Parsning eller opbygning af CSV, TSV, XML eller OCR af en fil | [Converter](converter-node.md) |
| Kald af en HTTP-API | [HTTP](http-node.md) |
| Mapping eller omdøbning af felter | [Set](set-node.md) |
| Kørsel af et andet workflow | [Execute](execute-node.md) |

Brug **Code**, når logikken virkelig ikke passer ind i disse — brugerdefineret matematik, skræddersyet parsing eller en algoritme.
## Eksempel

Score rækker produceret af en upstream-node:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Med `codeParameters` sat til `{ "rows": "$fetchRows.result" }`, kan downstream-noder læse `$scoreRows.result.total`.
