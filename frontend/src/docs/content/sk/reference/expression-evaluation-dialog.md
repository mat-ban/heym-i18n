# Dialóg hodnotenia výrazov

Dialóg hodnotenia výrazov je rozšírený editor pre polia podporujúce výrazy. Otvára sa z tlačidla rozšírenia vedľa vstupného poľa výrazu a poskytuje vám väčší pracovný priestor, automatické dopĺňanie, živý náhľad z backendu a prehliadanie výstupov na jednom mieste.

## Otvorenie dialógu

- Kliknite na tlačidlo rozšírenia vedľa poľa výrazu v paneli Vlastnosti.
- Viacriadkové polia zobrazujú tlačidlo vo vnútri vstupného poľa.
- Jednoriadkové polia zobrazujú tlačidlo napravo od vstupného poľa.

## Rozloženie dialógu

- Dialóg sa otvára ako vycentrované modálne okno s približne **80vw × 80vh**.
- Hlavička zobrazuje **Evaluate — {field name}**, keď je známy názov poľa.
- Editor zachováva automatické dopĺňanie, navigáciu medzi poľami a obvyklé akcie **Apply** / **Cancel**.
- Náhľad sa automaticky obnoví približne **300 ms** po tom, čo prestanete písať.
- Stlačením `Ctrl` / `Cmd` + `Enter` použijete aktuálny text späť do poľa a zatvoríte dialóg (rovnako ako **Apply**).

## Sekcia Výstup

Oblasť Výstup sa automaticky obnoví po tom, čo prestanete písať v editore.

### Hodnotenie

| Typ výrazu | Výsledok |
|---|---|
| Jediný `$expr` (celé pole) | Natívna hodnota sa zachová |
| Jediná holá bodková cesta (celé pole, bez `$`, bez vloženého zalomenia riadka) | Rovnaké ako `$` + táto cesta (backend normalizuje pre hodnotenie) |
| Text s vloženými `$refs` | Konečný výsledok je vždy reťazec |
| Literálny text (bez `$`, nie jediná bodková cesta) | Vrátený tak, ako je |

**Príklady**

| Vstup | Výsledok |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (rovnaké ako `$input.items`, keď je celá hodnota touto cestou) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Kontext hodnotenia sa zostavuje v tomto poradí:

- **Pinned data** na upstream uzloch
- **Last run outputs** z plátna
- `null`, keď nie sú dostupné žiadne upstream dáta

Ak má aktuálny uzol upstream závislosti, ale žiadna z nich nemá pinned data ani výsledok nedávneho spustenia, dialóg najprv vykoná testovacie spustenie na zostavenie kontextu a potom vyhodnotí aktuálny text.

### Výber cesty výstupu

Keď je výsledok z backendu objekt alebo pole, oblasť Výstup môže namiesto surového JSON zobraziť interaktívny výber cesty.

- Dvojkliknutím na riadok pripojíte danú cestu k aktuálnej referencii `$node.path`.
- Jedným kliknutím na rozbaliteľné riadky otvoríte alebo zatvoríte vetvy.
- Pomocou vstavaného vyhľadávacieho poľa môžete vyhľadávať kľúče, hodnoty a reťazce ciest.

## Automatické dopĺňanie

- Napíšte `$` na otvorenie návrhov pre upstream uzly, vstavané funkcie a metódy.
- Stlačením `Tab` alebo `Enter` vložíte vybraný návrh.
- Pomocou `↑` / `↓` sa pohybujete v zozname návrhov.

### Príklady odpovedí

Keď pokračujete v referencii `$…` bodkou, každý riadok návrhu zobrazuje odpoveď, ktorú by daný návrh vytvoril, tučným písmom napravo od riadka.

- Napísaním `$set.listItems.first().toString().u` sa zobrazia `upper`, `urlEncode`, `urlDecode` a `unescape`, každý s vyhodnoteným výsledkom — takže môžete vyberať podľa výsledku namiesto podľa názvu.
- Napísaním `$node.text.toJson()` sa parsuje JSON reťazec na objekt alebo pole. Po `.toJson()` môže automatické dopĺňanie ponúknuť parsované kľúče (napríklad `repoUrl`), keď je dostupný výstup z posledného spustenia alebo pinned output.
- Výsledky sa vyhodnocujú na backende proti rovnakým pinned dátam a výstupom z posledného spustenia, ktoré používa náhľad dialógu, takže zodpovedajú tomu, čo pole vytvorí.
- Vyhodnocujú sa iba návrhy, ktoré stoja samostatne: metódy s nulovým počtom argumentov (`upper()`, `first()`, `keys()`, `toJson()`) a jednoduché vlastnosti (`length`, `year`). Návrhy, ktoré najprv vyžadujú argumenty — `map`, `filter`, `sort`, `replace` — zostávajú prázdne.
- Riadok zostane prázdny, keď kandidát nevytvorí žiadnu odpoveď: chyba, `null` alebo metóda, ktorá sa na danú hodnotu nevzťahuje.
- Odpovede sa skracujú na jeden riadok. Prejdite myšou nad skrátenou odpoveďou, aby ste videli viac.

## Vytvorenie pomocou AI

Tlačidlo **Build with AI** sa zobrazuje v pravom hornom rohu dialógu hodnotenia, keď je načítaný workflow. Otvára vnorený modál, v ktorom môžete opísať požadovaný výraz v obyčajnom texte a nechať LLM, aby ho vygeneroval za vás.

### Ako to funguje

1. Kliknite na **Build with AI** na paneli nástrojov dialógu hodnotenia.
2. Vyberte prihlasovacie údaje LLM a model z rozbaľovacích zoznamov.
3. Napíšte opis v obyčajnom texte, čo chcete — napríklad *„Získaj meno zákazníka z odpovede API"*.
4. Kliknite na **Generate**. Modál zavolá backend, ktorý použije systémový prompt [Expression DSL](./expression-dsl.md) spolu s výstupmi z posledného spustenia workflow ako kontext a vráti jediný reťazec výrazu.
5. Vygenerovaný výraz sa okamžite vyhodnotí proti rovnakým dátam plátna, takže môžete vidieť výsledok pred použitím.
6. Kliknutím na **Apply** nahradíte obsah editora vygenerovaným výrazom alebo kliknutím na **Regenerate** skúsite znova.

### Použitý kontext

Generátor dostáva výstupy uzlov z posledného testovacieho spustenia na plátne. Ak workflow ešte nebolo spustené, LLM vygeneruje výraz s najlepším úsilím na základe označení uzlov a konvencií DSL.

### Požiadavky

- Prihlasovacie údaje LLM (OpenAI, Google alebo Custom) musia byť nakonfigurované na karte [Prihlasovacie údaje](./credentials.md).
- Workflow musí byť otvorené v editore.

## Klávesové skratky

| Skratka | Akcia |
|---|---|
| Pauza v písaní (~300 ms) | Obnoviť náhľad z backendu |
| `Ctrl` / `Cmd` + `Enter` | Použiť a zatvoriť dialóg |
| `Escape` | Najprv zavrieť automatické dopĺňanie, inak zavrieť dialóg |
## Vnorené `$` v argumentoch metód

Pre vyhodnotenie dialógu / backendu môžete odovzdať ďalšiu referenciu s vnoreným `$` v rámci volaní, ako napríklad `.get($other.field)`, keď potrebujete dynamický kľúč. Vo vnútri `.get(...)` môžete použiť aj holú cestu (napríklad `other.field`); backend ju vyhodnotí rovnakým spôsobom. Uložené polia workflowu by stále mali dodržiavať pravidlá [Expression DSL](./expression-dsl.md); evaluate API pre pohodlie akceptuje aj celoriadkovú holú bodkovú cestu (pozri tabuľku vyššie).

## Navigácia

Editory mapovania Set a Execute môžu zobrazovať tlačidlá **Prev** / **Next**, aby ste sa mohli pohybovať medzi poľami bez zatvorenia dialógu.

## Súvisiace

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Prihlasovacie údaje](./credentials.md) — vyžadované pre funkciu Build with AI
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
