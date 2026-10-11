# Kod

**Kod**-noden kör Python som skrivs av användaren, med sin egen `requirements.txt`, och returnerar JSON. Varje körning får en helt ny container som förstörs när körningen avslutas, så en körning kan aldrig se eller påverka en annan.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.result` (det `main` returnerade), plus `$nodeLabel.logs` och `$nodeLabel.install` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `codeSource` | string | Python-källkod. Måste definiera `main(params)` och returnera ett JSON-serialiserbart värde |
| `codeParameters` | expression | Ett JSON-objekt som kopplar workflow-data in i koden. Uttryck löses upp innan koden körs |
| `codeRequirements` | string | Innehållet i `requirements.txt`, ett paket per rad. Tomt hoppar över installationen |
| `codeAllowNetwork` | boolean | Huruvida koden själv får nå nätverket (standard `false`) |

## Funktionen `main`

Koden måste definiera en `main` på toppnivå som tar ett argument:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Satser på modulnivå körs, men endast det `main` returnerar blir nodens utdata.

Redigeraren visar radnummer, och expanderingsknappen bredvid **Format** öppnar en större redigerare som stängs med `Esc` — ändringar tillämpas medan text skrivs, så det finns inget att spara. Knappen **Format** formaterar om koden med Ruff och bevarar kommentarer. Den reparerar även den indenteringsskada som inklistring vanligtvis orsakar: ett enhetligt indenterat block, tabbar blandade med mellanslag och en rad som ligger ett eller två mellanslag fel i förhållande till sitt block åtgärdas istället för att avvisas. Ett genuint syntaxfel rapporteras istället med sin rad och kolumn. Formatering körs i samma isolerade container som noden körs i — inget nätverk, ingen backend-miljö — så det kräver Docker precis som körning gör.

## Läsa parametrar

`params` stöder punktnotation, även genom nästlade objekt och listor:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` läser nycklar som inte är giltiga Python-identifierare
- `params.get("maybe")` returnerar `None` istället för att kasta ett fel när en nyckel saknas
- `params.to_dict()` returnerar den vanliga ordboken
- Att läsa en nyckel som aldrig angetts kastar ett fel som namnger nyckeln och listar vad som är tillgängligt

## Utdata

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — returvärdet från `main`. Nedströms noder läser `$nodeLabel.result.message`
- `logs` — allt koden skickade till `print`, fångat separat så att det aldrig förstör resultatet
- `install` — vilket verktyg som installerade beroendena (`uv`, `pip` eller `none`) och dess utdata

## Beroenden

Lista paket i `requirements.txt` precis som lokalt:

```
requests==2.32.3
feedparser
```

Paket installeras med `uv` i en tillfällig katalog innan koden körs; om `uv` inte kan hantera ett paket försöker Heym igen med `pip`. Inget cachas mellan körningar, så tunga beroenden lägger till flera sekunder på varje körning. Att lämna `requirements.txt` tomt hoppar över installationssteget helt och är märkbart snabbare.

Paket som inte levereras med någon wheel och kräver en C-kompilator misslyckas med installationen. Orsaken visas i `install.log`.

## Nätverk

| Fas | Nätverk |
|-----|---------|
| Installera beroenden | Alltid på — pip och uv måste nå PyPI |
| Köra koden | Av som standard. `codeAllowNetwork` slår på det |

Med `codeAllowNetwork` avstängt misslyckas ett utgående anrop som `requests.get(...)` med ett anslutningsfel. Det är standardbeteendet och avsiktligt: de flesta Kod-noder transformerar data som en annan nod redan hämtat. Föredra att hämta med en **HTTP**-nod och skicka in body via `codeParameters`.

## Sandbox och gränser

Koden körs som en icke-root-användare i en container med alla Linux-capabilities borttagna, `no-new-privileges` satt och ett skrivskyddat rotfilsystem. Den tar emot ingen Docker-socket och inga av backendens hemligheter eller miljövariabler.

| Gräns | Värde |
|-------|-------|
| Minne | 512 MB |
| CPU:er | 1 |
| Processer | 256 |
| Timeout för beroendeinstallation | 120 sekunder |
| Timeout för körning | 60 sekunder |

Dessa är fasta egenskaper hos sandboxen, inte konfiguration.

> **Docker krävs.** Till skillnad från Agent Python-verktyg och skills har Kod-noden inget lokalt reservläge och ingen miljövariabel för att lätta på kravet. Utan en nåbar Docker-daemon misslyckas noden med ett tydligt fel istället för att köra koden i backend-processen. Vid utveckling med inbyggt `./run.sh` måste Docker startas innan denna nod används. Se [Säkerhet → Kod-nodens sandbox](../reference/security.md#code-node-sandbox).

## Använd en annan nod när en passar

| Om syftet är att | Använd |
|------------------|--------|
| Tolka eller bygga CSV, TSV, XML eller OCR:a en fil | [Converter](converter-node.md) |
| Anropa ett HTTP-API | [HTTP](http-node.md) |
| Mappa eller byta namn på fält | [Set](set-node.md) |
| Köra en annan workflow | [Execute](execute-node.md) |

Använd **Kod** när logiken genuint inte passar dessa — anpassad matematik, skräddarsydd tolkning eller en algoritm.
## Exempel

Poängrader som produceras av en uppströmsnod:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Med `codeParameters` satt till `{ "rows": "$fetchRows.result" }` läser nedströmsnoder `$scoreRows.result.total`.
