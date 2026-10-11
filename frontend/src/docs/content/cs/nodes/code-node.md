# Kód

Uzel **Kód** spouští Python, který sami napíšete, s vlastním souborem `requirements.txt`, a vrací JSON. Každé spuštění dostane zcela nový kontejner, který se po dokončení běhu zničí, takže jedno spuštění nikdy nemůže vidět ani ovlivnit jiné.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.result` (cokoli, co vrátila funkce `main`), plus `$nodeLabel.logs` a `$nodeLabel.install` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `codeSource` | string | Zdrojový kód v Pythonu. Musí definovat `main(params)` a vracet hodnotu serializovatelnou do JSON |
| `codeParameters` | expression | Objekt JSON propojující data workflow do kódu. Výrazy se vyhodnotí před spuštěním kódu |
| `codeRequirements` | string | Obsah souboru `requirements.txt`, jeden balíček na řádek. Prázdná hodnota přeskočí instalaci |
| `codeAllowNetwork` | boolean | Zda kód sám smí přistupovat k síti (výchozí `false`) |

## Funkce `main`

Váš kód musí definovat funkci `main` na nejvyšší úrovni, která přijímá jeden argument:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Příkazy na úrovni modulu se sice spustí, ale výstupem uzlu se stane pouze to, co vrátí funkce `main`.

Editor zobrazuje čísla řádků a tlačítko pro rozšíření vedle tlačítka **Format** otevře větší editor, který se zavírá klávesou `Esc` — úpravy se aplikují průběžně při psaní, takže není co ukládat. Tlačítko **Format** přeformátuje váš kód pomocí nástroje Ruff a zachová komentáře. Opravuje také poškození odsazení, které obvykle vzniká vložením kódu: rovnoměrně odsazený blok, tabulátory smíchané s mezerami i řádek posunutý o jednu či dvě mezery mimo svůj blok se opraví, nikoli odmítnou. Skutečná syntaktická chyba je nahlášena s uvedením řádku a sloupce. Formátování probíhá ve stejném izolovaném kontejneru, ve kterém běží uzel — bez sítě, bez prostředí backendu — takže stejně jako spuštění vyžaduje Docker.

## Čtení parametrů

`params` podporuje tečkovou notaci, a to i přes vnořené objekty a seznamy:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` čte klíče, které nejsou platnými identifikátory Pythonu
- `params.get("maybe")` vrátí `None` místo vyvolání chyby, když klíč chybí
- `params.to_dict()` vrátí prostý slovník
- Čtení klíče, který nebyl nikdy poskytnut, vyvolá chybu s názvem klíče a seznamem dostupných klíčů

## Výstup

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — návratová hodnota funkce `main`. Následné uzly čtou `$nodeLabel.result.message`
- `logs` — vše, co kód odeslal do `print`, zachyceno odděleně, aby nikdy nepoškodilo výsledek
- `install` — který nástroj nainstaloval závislosti (`uv`, `pip`, nebo `none`) a jeho výstup

## Závislosti

Uveďte balíčky v souboru `requirements.txt` přesně tak, jak byste je uvedli lokálně:

```
requests==2.32.3
feedparser
```

Balíčky se před spuštěním kódu nainstalují pomocí `uv` do dočasného adresáře; pokud `uv` nedokáže balíček zpracovat, Heym to zkusí znovu s `pip`. Mezi běhy se nic neukládá do mezipaměti, takže těžké závislosti přidávají ke každému spuštění několik sekund. Ponechání prázdného souboru `requirements.txt` zcela přeskočí krok instalace a je znatelně rychlejší.

Balíčky, které nedodávají wheel a vyžadují C kompilátor, se nepodaří nainstalovat. Důvod se objeví v `install.log`.

## Síť

| Fáze | Síť |
|-------|---------|
| Instalace závislostí | Vždy zapnutá — pip a uv se musí dostat na PyPI |
| Spuštění vašeho kódu | Ve výchozím stavu vypnutá. `codeAllowNetwork` ji zapne |

Když je `codeAllowNetwork` vypnuté, odchozí volání, jako je `requests.get(...)`, selže s chybou připojení. To je zamýšlené výchozí chování: většina uzlů Kód transformuje data, která už načetl jiný uzel. Upřednostněte načítání pomocí uzlu **HTTP** a předejte tělo přes `codeParameters`.

## Sandbox a limity

Váš kód běží jako uživatel bez oprávnění root v kontejneru se všemi odebranými schopnostmi Linuxu, nastaveným `no-new-privileges` a kořenovým souborovým systémem pouze pro čtení. Nedostává přístup k Docker socketu ani k žádným tajemstvím či prostředí backendu.

| Limit | Hodnota |
|-------|-------|
| Paměť | 512 MB |
| CPU | 1 |
| Procesy | 256 |
| Časový limit instalace závislostí | 120 sekund |
| Časový limit spuštění | 60 sekund |

Toto jsou pevné vlastnosti sandboxu, nikoli konfigurace.

> **Docker je vyžadován.** Na rozdíl od nástrojů a dovedností Agent Python nemá uzel Kód žádný lokální záložní režim ani proměnnou prostředí, která by jej uvolnila. Bez dostupného démona Docker uzel selže s jasnou chybou, místo aby spustil váš kód v procesu backendu. Při vývoji nativně přes `./run.sh` spusťte Docker před použitím tohoto uzlu. Viz [Zabezpečení → Sandbox uzlu Kód](../reference/security.md#code-node-sandbox).

## Použijte jiný uzel, když se hodí

| Chcete | Použijte |
|-------------|-----|
| Parsovat nebo sestavit CSV, TSV, XML, nebo provést OCR souboru | [Converter](converter-node.md) |
| Zavolat HTTP API | [HTTP](http-node.md) |
| Namapovat nebo přejmenovat pole | [Set](set-node.md) |
| Spustit jiný workflow | [Execute](execute-node.md) |

Sáhněte po uzlu **Kód**, když se logika skutečně nehodí do těchto možností — vlastní matematika, specifické parsování nebo algoritmus.
## Příklad

Skóre řádků vytvořených upstream uzlem:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

S `codeParameters` nastavenými na `{ "rows": "$fetchRows.result" }` mohou downstream uzly číst `$scoreRows.result.total`.
