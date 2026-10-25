# Funkce plátna

Editor workflow nabízí několik funkcí pro ladění, testování a organizaci uzlů: **Spustit do uzlu**, **AI na uzlu**, **Připnutí dat**, **Protokoly spuštění**, **Povolit/Zakázat** a **Extrahovat do pod-workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

## Spustit do uzlu

Najeďte myší na libovolný uzel kromě sticky note a klikněte na **Run** pod ním. Heym spustí tento uzel a jeho nadřazené závislosti, přičemž ponechá následné uzly a nesouvisející větve nedotčené. Využívá se přitom testovací režim plátna včetně připnutých výstupů a běžných podmínek větvení workflow.

Pokud má vybraná cesta vstupní pole, otevře se pravý panel **Run** a zaměří první pole. Zadejte hodnoty a klikněte na **Run to _označení uzlu_** nebo stiskněte **Ctrl+Enter** (Cmd+Enter na macOS). Režim obecného těla zaměří editor JSON těla. Cesty bez vstupních polí se spustí okamžitě bez otevření panelu. Připnuté vstupní uzly znovu použijí svůj připnutý výstup, aniž by vyžadovaly vstup.

Panel si zachová vybraný cíl pro následná spuštění. Zvolte **Run full workflow** pro vymazání cíle. Tlačítka spuštění jsou během aktivního spuštění zakázána. Cíl uvnitř smyčky zastaví běh při prvním dosažení tohoto uzlu; výběr uzlu za smyčkou spustí kompletní nadřazenou smyčku.

## AI na uzlu

Najeďte na libovolný uzel kromě lístku s poznámkou a klikněte na **AI** nad ním. [AI Assistant](./ai-assistant.md) se otevře na daném uzlu a nabídne **Change this node as ...**, **Fix error in this node ...** a **Other**. V režimu Agent asistent mění pouze tento uzel; ostatní uzly, propojení a rozložení zůstávají beze změny. Viz [AI Assistant › Změna jednoho uzlu](./ai-assistant.md#changing-one-node).

Tlačítko je skryté u workflow, které můžete pouze prohlížet.

## Připnutí dat

Připnutí dat umožňuje připnout výstup uzlu z posledního spuštění, abyste mohli testovat následné uzly bez opětovného spuštění připnutého uzlu.

### Kde jej najít

- **Panel vlastností** – Vyberte uzel a přejděte dolů k sekci **Pinned Data**
- **Odznak uzlu** – Když jsou data připnuta, zobrazí se na uzlu ikona připnutí

### Akce

| Akce | Popis |
|--------|-------------|
| **Pin** | Připne výstup posledního spuštění uzlu (dostupné po spuštění) |
| **Clear** | Odstraní připnutá data |
| **Edit** | Upravte připnutý JSON přímo; kliknutím na Save použijte změny |

### Chování v testovacím režimu

Při spuštění workflow v testovacím režimu uzly s `pinnedData` přeskočí spuštění a místo toho použijí připnutý výstup. Využijte to k:

- Testování následné logiky bez volání externích API
- Ladění výrazů, které odkazují na výstup uzlu
- Iteraci na promptech nebo podmínkách s pevnými vzorovými daty

Doplňování výrazů v editoru využívá připnutá data, jsou-li k dispozici, k návrhu polí.

## Protokoly spuštění

Panel **Debug** (spodní zásuvka) zobrazuje protokoly spuštění v reálném čase během běhu workflow. Můžete
také otevřít běžící produkční spuštění buď z dialogu History, nebo z karty Board. Editor
se připojí k SSE streamu tohoto běhu, obnoví výsledky dokončených uzlů a nadále
zobrazuje animace uzlů a protokoly, jak nové uzly začínají a končí.

### Co zobrazuje

- **Výsledky uzlů** – Stav jednotlivých uzlů (`success`, `error`, `skipped`, `running`), doba spuštění a výstup
- **Konečné výstupy** – Agregované výstupy z uzlů [Output](../nodes/output-node.md)
- **Průběh agenta** – U uzlů [Agent](../nodes/agent-node.md) volání nástrojů krok za krokem a uvažování

### Akce

- **Copy as JSON** – Zkopíruje celý protokol spuštění do schránky
- **Open in JSON editor** – Otevře protokol v JSON Hero nebo JSON Editor Online pro kontrolu
- **Download generated files** – Pokud skill vytvořil soubory ke stažení (`_generated_files`), zobrazí se tlačítko Download. Jediný soubor se stáhne přímo; více souborů otevře popup pro výběr.

### Rozdíl oproti kartě Logs

Panel Debug zobrazuje protokoly **spuštění workflow** (výsledky uzlů, výstupy). Karta [Logs Tab](../tabs/logs-tab.md) zobrazuje protokoly **Docker kontejneru** (backend, frontend, databáze). <!-- pragma: allowlist secret -->

## Povolit / Zakázat

Uzly můžete zakázat, aby byly během spuštění přeskočeny. Zakázané uzly zobrazují odznak „off" a jsou zobrazeny ztlumeně.

### Jak přepnout

| Metoda | Popis |
|--------|-------------|
| **Panel vlastností** | Vyberte uzel → ikona napájení (vpravo nahoře) |
| **Kontextová nabídka** | Klikněte pravým tlačítkem na uzel/uzly → Disable nebo Enable |
| **Klávesnice** | Vyberte uzel/uzly → stiskněte **D** (viz [Keyboard Shortcuts](./keyboard-shortcuts.md)) |

### Vícenásobný výběr

Je-li vybráno více uzlů, použije se Enable/Disable na všechny. Kontextová nabídka zobrazuje „Enable", pokud je některý z vybraných uzlů zakázán, „Disable", pokud jsou všechny povoleny.

### Chování za běhu

Uzly s `active: false` jsou přeskočeny. Následné uzly nedostávají žádná data z přeskočených uzlů. Využijte to k dočasnému vyloučení uzlů bez jejich smazání.

Chcete-li uzel zapnout nebo vypnout zevnitř workflow místo ručně, použijte [Disable Node](../nodes/disable-node.md) a [Enable Node](../nodes/enable-node.md).
## Graf paměti agenta

Uzly [Agenta](../nodes/agent-node.md) s povolenou **[persistentní pamětí](./agent-persistent-memory.md)** zobrazují na uzlu růžový ovládací prvek **mozku**. Kliknutím na něj otevřete editor grafu paměti: entity se vykreslují jako animovaný, silově orientovaný graf seskupený podle typu entity, s prohledávatelnými výběry Zdroj/Cíl pro přidávání vztahů a panelem připojení pro přeskakování mezi propojenými entitami. Stejný dialog obsahuje volbu **Sdílet paměť s dalšími agenty** (workflow → agent → čtení nebo čtení/zápis) pro [sdílení paměti mezi agenty](./agent-persistent-memory.md#sharing-with-other-agents). Dokud je dialog otevřený, je undo/redo hlavního plátna odloženo, aby si úpravy grafu zachovaly vlastní historii.

**Filtrování grafu.** V levém horním rohu plátna je ovládací prvek vyhledávání, sbalený na tlačítko zkratky, dokud na něj nekliknete nebo nestisknete **Ctrl/Cmd+F**. Porovnává název entity, její typ a každý klíč a hodnotu atributu, stejně jako typ vztahu (`parent_of`) a jeho vlastnosti; nalezený vztah přináší i obě své entity. Všechny termíny oddělené mezerou musí odpovídat. Nalezená entita přináší celé své okolí — každý vztah, kterého se účastní, a entitu na druhé straně každého z nich — takže nalezená položka nikdy nezůstane jako nepřipojený bod. Nalezený vztah přináší pouze dvě entity, které spojuje, a tam končí, protože hledání typu vztahu je otázkou na tento vztah, nikoli na vše, k čemu jsou jeho konce připojeny. Vše ostatní je na plátně a v seznamu **Všechny hrany** zcela skryto — nikoli ztlumeno — a odznak ukazuje, kolik z celkového počtu entit zbývá. **✕** uvnitř pole nejprve vymaže dotaz, při druhém stisknutí pole zavře. Escape se odvíjí stejným způsobem, od nejvnitřnější vrstvy: vymaže dotaz, poté zavře vyhledávací pole, poté opustí rozšířené zobrazení plátna a dialog zavře teprve tehdy, když není otevřena žádná z těchto vrstev. Vymazání obnoví celý graf se všemi entitami zpět na jejich místě.

**Ruční umisťování entit.** Přetažením entity ji připnete tam, kam ji upustíte, takže automatické rozvržení uspořádá zbytek grafu kolem ní, místo aby ji táhlo zpět. Přetažením vybrané entity přesunete spolu s ní i entity přímo propojené, čímž zachováte tvar clusteru; přetažením jakékoli jiné entity přesunete pouze ji. **Uspořádat rozvržení** (tlačítko s hůlkou) uvolní všechny připnuté entity a znovu spustí automatické rozvržení.

## Extrahovat do pod-workflow

Převeďte vybrané uzly na znovupoužitelné pod-workflow a nahraďte je uzlem [Execute](../nodes/execute-node.md).

### Jak používat

1. Vyberte jeden nebo více uzlů na plátně
2. Klikněte pravým tlačítkem → **Extrahovat do pod-workflow**
3. Zadejte název (a volitelný popis) nového workflow
4. Klikněte na **Extrahovat**

### Co se stane

- Vytvoří se nové workflow s vybranými uzly
- Externí vstupy (hrany z vnějšku výběru) se stanou poli [Input](../nodes/input-node.md) pod-workflow
- Externí výstupy (hrany k uzlům mimo výběr) se namapují na [Output](../nodes/output-node.md) pod-workflow
- Vybrané uzly se nahradí jediným uzlem [Execute](../nodes/execute-node.md), který volá nové workflow
- Mapování vstupů/výstupů se zachová automaticky

### Případy použití

- Znovupoužití sekvence uzlů napříč více workflow
- Zjednodušení komplexního workflow seskupením související logiky
- Vytváření modulárních, testovatelných pod-workflow

## Spuštění pomocí cURL

Tlačítko **cURL** na panelu nástrojů editoru (vpravo nahoře) otevře dialog pro sestavení a zkopírování příkazu cURL pro spuštění workflow přes API.

- Zvolte režim těla požadavku workflow (`Defined` nebo `Generic`)
- Nastavte typ ověřování (Anonymous, JWT nebo Header Auth)
- Nakonfigurujte ukládání odpovědí do mezipaměti a omezení rychlosti
- Přepněte streamování SSE a přizpůsobte zprávy o spuštění pro jednotlivé uzly
- Upravte tělo požadavku
- V režimu Generic používá panel spuštění na plátně stejné surové JSON tělo jako dialog cURL
- Kliknutím na **Kopírovat cURL** zkopírujete příkaz připravený ke spuštění

Úplné podrobnosti o dialogu najdete v části [Webhooks](./webhooks.md#run-with-curl-dialog) a protokol událostí v části [SSE Streaming](./sse-streaming.md).

## Související

- [Klávesové zkratky](./keyboard-shortcuts.md) – Všechny zkratky plátna a editoru
- [Persistentní paměť agenta](./agent-persistent-memory.md) – Chování grafu paměti a API
- [Uzel Execute](../nodes/execute-node.md) – Volá pod-workflow
- [Expression DSL](./expression-dsl.md) – Reference a připnutá data
- [Struktura workflow](./workflow-structure.md) – Formát uzlů a hran
- [Stažení a import](./download-import.md) – Export a import workflow jako JSON
- [Typy uzlů](./node-types.md) – Všechny typy uzlů
- [Záložka Logs](../tabs/logs-tab.md) – Logy kontejneru Docker
- [Historie spuštění](./execution-history.md) – Minulá spuštění
- [Šablony](../tabs/templates-tab.md) – Ukládání a opětovné použití workflow a uzlů
- [Kontextová nápověda](./contextual-showcase.md) – Stručný průvodce stránkou dostupný v editoru

- [Spolupráce na plátně](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
