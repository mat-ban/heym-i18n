# Dialog pro vyhodnocení výrazů

Dialog pro vyhodnocení výrazů je rozšířený editor pro pole, která podporují výrazy. Otevírá se tlačítkem pro rozšíření vedle vstupního pole výrazu a nabízí větší pracovní prostor, automatické doplňování, živý náhled ze serveru a procházení výstupů na jednom místě.

## Otevření dialogu

- Klikněte na tlačítko pro rozšíření vedle pole výrazu v panelu Vlastnosti.
- U víceřádkových polí se tlačítko zobrazuje uvnitř vstupního pole.
- U jednořádkových polí se tlačítko zobrazuje napravo od vstupního pole.

## Rozvržení dialogu

- Dialog se otevírá jako modální okno vycentrované na ploše o velikosti přibližně **80vw × 80vh**.
- Záhlaví zobrazuje **Vyhodnotit — {název pole}**, pokud je název pole znám.
- Editor zachovává automatické doplňování, navigaci mezi poli a obvyklé akce **Použít** / **Zrušit**.
- Náhled se automaticky obnoví přibližně **300 ms** poté, co přestanete psát.
- Stisknutím `Ctrl` / `Cmd` + `Enter` použijete aktuální text zpět do pole a zavřete dialog (stejně jako **Použít**).

## Sekce Výstup

Oblast Výstup se automaticky obnoví poté, co v editoru přestanete psát.

### Vyhodnocení

| Typ výrazu | Výsledek |
|---|---|
| Jediný `$expr` (celé pole) | Nativní hodnota je zachována |
| Jediná holá tečková cesta (celé pole, bez `$`, bez vloženého zalomení řádku) | Stejné jako `$` + tato cesta (server normalizuje pro vyhodnocení) |
| Text s vloženými `$refs` | Konečný výsledek je vždy řetězec |
| Literální text (bez `$`, není jediná tečková cesta) | Vrácen tak, jak je |

**Příklady**

| Vstup | Výsledek |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (stejné jako `$input.items`, když je celá hodnota touto cestou) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Kontext vyhodnocení se sestavuje v tomto pořadí:

- **Připnutá data** na uzlech proti proudu
- **Výstupy posledního spuštění** z canvasu
- `null`, pokud nejsou k dispozici žádná data z uzlů proti proudu

Pokud má aktuální uzel závislosti proti proudu, ale žádná z nich nemá připnutá data ani výsledek nedávného spuštění, dialog nejprve provede testovací spuštění pro sestavení kontextu a poté vyhodnotí aktuální text.

### Výběr cesty výstupu

Když je výsledkem ze serveru objekt nebo pole, oblast Výstup může místo surového JSON zobrazit interaktivní výběr cesty.

- Dvojklikem na řádek připojíte danou cestu k aktuálnímu odkazu `$node.path`.
- Jedním kliknutím na rozbalitelné řádky otevřete nebo zavřete větve.
- Pomocí vestavěného vyhledávacího pole prohledávejte klíče, hodnoty a řetězce cest.

## Automatické doplňování

- Napište `$` pro otevření návrhů uzlů proti proudu, vestavěných funkcí a metod.
- Stisknutím `Tab` nebo `Enter` vložíte vybraný návrh.
- Pomocí `↑` / `↓` se pohybujete v seznamu návrhů.

### Ukázkové odpovědi

Když pokračujete v odkazu `$…` tečkou, každý řádek návrhu zobrazuje odpověď, kterou by daný návrh vytvořil, tučně napravo od řádku.

- Napsáním `$set.listItems.first().toString().u` se zobrazí `upper`, `urlEncode`, `urlDecode` a `unescape`, každý s vyhodnoceným výsledkem — takže můžete vybírat podle výsledku místo podle názvu.
- Napsáním `$node.text.toJson()` se řetězec JSON parsuje na objekt nebo pole. Po `.toJson()` může automatické doplňování nabídnout parsované klíče (například `repoUrl`), pokud je k dispozici výstup posledního spuštění nebo připnutá data.
- Výsledky se vyhodnocují na serveru proti stejným připnutým datům a výstupům posledního spuštění, které používá náhled dialogu, takže odpovídají tomu, co pole vytvoří.
- Vyhodnocují se pouze návrhy, které obstojí samostatně: metody bez argumentů (`upper()`, `first()`, `keys()`, `toJson()`) a prosté vlastnosti (`length`, `year`). Návrhy, které nejprve vyžadují argumenty — `map`, `filter`, `sort`, `replace` — zůstávají prázdné.
- Řádek zůstává prázdný, když kandidát nevytvoří žádnou odpověď: chybu, `null` nebo metodu, která se na danou hodnotu nevztahuje.
- Odpovědi jsou zkráceny na jeden řádek. Přejetím myší nad zkrácenou odpovědí zobrazíte více.

## Sestavení pomocí AI

Tlačítko **Sestavit pomocí AI** se zobrazuje v pravém horním rohu dialogu pro vyhodnocení, když je načten workflow. Otevírá vnořené modální okno, kde můžete popsat požadovaný výraz v prostém textu a nechat jej vygenerovat LLM.

### Jak to funguje

1. Klikněte na **Sestavit pomocí AI** na panelu nástrojů dialogu pro vyhodnocení.
2. Vyberte přihlašovací údaje LLM a model z rozbalovacích seznamů.
3. Napište popis toho, co chcete, v prostém textu — například *„Získej jméno zákazníka z odpovědi API"*.
4. Klikněte na **Vygenerovat**. Modální okno zavolá server, který použije systémový prompt [Expression DSL](./expression-dsl.md) spolu s výstupy posledního spuštění workflow jako kontext, a vrátí jediný řetězec výrazu.
5. Vygenerovaný výraz se okamžitě vyhodnotí proti stejným datům canvasu, takže výsledek uvidíte před použitím.
6. Kliknutím na **Použít** nahradíte obsah editoru vygenerovaným výrazem, nebo kliknutím na **Vygenerovat znovu** zkusíte další pokus.

### Použitý kontext

Generátor obdrží výstupy uzlů z posledního testovacího spuštění na canvasu. Pokud workflow ještě nebyl spuštěn, LLM vygeneruje výraz s nejlepším úsilím na základě názvů uzlů a konvencí DSL.

### Požadavky

- V záložce [Přihlašovací údaje](./credentials.md) musí být nakonfigurovány přihlašovací údaje LLM (OpenAI, Google nebo Custom).
- Workflow musí být otevřen v editoru.

## Klávesové zkratky

| Zkratka | Akce |
|---|---|
| Pauza při psaní (~300 ms) | Obnovit náhled ze serveru |
| `Ctrl` / `Cmd` + `Enter` | Použít a zavřít dialog |
| `Escape` | Nejprve zavřít automatické doplňování, jinak zavřít dialog |
## Vnořené `$` v argumentech metod

Pro vyhodnocení v dialogu / na backendu můžete předat další referenci s vnořeným `$` uvnitř volání, jako je `.get($other.field)`, když potřebujete dynamický klíč. Uvnitř `.get(...)` lze také použít holou cestu (například `other.field`); backend ji vyhodnotí stejným způsobem. Uložená pole workflow by stále měla dodržovat pravidla [Expression DSL](./expression-dsl.md); API pro vyhodnocení navíc pro pohodlí přijímá i celořádkovou holou tečkovou cestu (viz tabulka výše).

## Navigace

Editory mapování Set a Execute mohou zobrazovat tlačítka **Prev** / **Next**, abyste se mohli pohybovat mezi poli, aniž byste zavírali dialog.

## Související

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — vyžadováno pro funkci Build with AI
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
