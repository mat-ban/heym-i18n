# DataTable

Karta **DataTable** umožňuje vytvářet a spravovat strukturované datové tabulky přímo v Heymu. Tabulky lze používat ve workflow prostřednictvím [uzlu DataTable](../nodes/datatable-node.md) pro programové CRUD operace.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>

## Vytvoření tabulky

1. Přejděte na kartu DataTable z dashboardu
2. Klikněte na **Create DataTable**
3. Zadejte název a volitelný popis
4. Přidejte sloupce pomocí editoru sloupců

## Sloupce

Každý sloupec má:

| Vlastnost | Popis |
|----------|-------------|
| Name | Zobrazovaný název sloupce |
| Type | `string`, `number`, `boolean`, `date` nebo `json` |
| Required | Zda nové řádky musí tento sloupec obsahovat |
| Unique | Zda hodnoty musí být v rámci řádků jedinečné |
| Default Value | Automaticky vyplněno, pokud řádek tento sloupec vynechá |

Sloupce přidávejte, upravujte nebo odebírejte v záhlaví detailu tabulky.

## Generování sloupců pomocí AI

Namísto ručního přidávání sloupců můžete tabulku popsat přirozeným jazykem (nebo vložit ukázkový JSON) a nechat LLM navrhnout schéma. Oba vstupní body otevírají stejný dialog:

- **Generate with AI** (záhlaví seznamu DataTable) — vytvoří zcela novou tabulku z vašeho popisu.
- **AI columns** (detail tabulky, vedle ovládacích prvků sloupců) — navrhne *nové* sloupce k přidání do otevřené tabulky.

### Jak to funguje

1. Vyberte **LLM credential** a **model** (výchozí je váš první LLM credential a jeho nejnovější model).
2. Napište popis — například *„Tabulka knih s názvem, autorem, počtem stránek a informací, zda jsem ji přečetl"* — nebo vložte ukázkový JSON/schéma.
3. Klikněte na **Generate**. Model vrátí navrhované schéma.
4. Zkontrolujte vygenerované sloupce v editovatelném formuláři: změňte **name**, **type**, **default**, **unique** a **notEmpty** (required) u každého z nich, odstraňte nechtěné sloupce nebo ručně **Add column**. U nové tabulky můžete také upravit AI navržený **name** a **description**.
5. Klikněte na **Create Table** (nová tabulka) nebo **Add Columns** (existující tabulka) pro uložení. Dialog kdykoli zavřete stisknutím **Esc**.

### Pouze přidávání u existujících tabulek

Při generování sloupců pro existující tabulku model vidí vaše aktuální sloupce jako kontext a navrhuje **pouze nové** sloupce. Existující sloupce a jejich data nejsou nikdy upravovány ani odstraňovány — vygenerované sloupce jsou přidány. Duplicitní názvy (bez rozlišení velikosti písmen) jsou automaticky vyřazeny.

> Je vyžadován LLM credential (OpenAI, Google nebo Custom). Pokud žádný nemáte, nejprve jej přidejte v Settings.

## Správa řádků

- **Přidání řádku**: Kliknutím na tlačítko přidání vytvoříte nový řádek
- **Inline editace**: Dvojklikem na libovolnou buňku upravíte její hodnotu. Stisknutím Enter nebo kliknutím mimo buňku uložíte, Escape zruší
- **Smazání řádku**: Pomocí menu akcí řádku řádek odstraníte
- **Stránkování**: Řádky se zobrazují po 25 na stránku s navigací mezi stránkami

## Import/Export CSV

### Import
1. Klikněte na **Import CSV** v detailu tabulky
2. Vyberte soubor CSV k nahrání
3. Zobrazte náhled prvních 5 řádků a mapování sloupců
4. Zelené sloupce jsou spárovány s existujícími sloupci tabulky; žluté jsou nespárované
5. Kliknutím na Import hromadně vložíte řádky

### Export
Kliknutím na **Export CSV** stáhnete všechny řádky jako soubor CSV.

## Sdílení

Sdílejte tabulky s dalšími uživateli nebo týmy:

1. Otevřete dialog sdílení z detailu tabulky
2. Přidejte uživatele podle e-mailu s oprávněním **read** nebo **write**
3. Přidejte týmy s oprávněním **read** nebo **write**
4. Uživatelé s právem pouze pro čtení mohou data zobrazovat; uživatelé s právem zápisu mohou upravovat řádky

## Vytváření tabulek z AI Assistant

Canvas [AI Assistant](../reference/ai-assistant.md#data-tables), [Chat](./chat-tab.md) a nástroj `heym_chat` na kartě [MCP](./mcp-tab.md) mohou vybrat jednu z vašich tabulek pro workflow, které vytvářejí, nebo vytvořit novou. Navrhnou název a sloupce a tabulku vytvoří, když odešlete kartu s dotazem. Nikdy nemění sloupce existující tabulky ani se nedotýkají jejích řádků: sloupce přidávejte nebo upravujte zde.

## Použití ve workflow

[Uzel DataTable](../nodes/datatable-node.md) propojuje tabulky s workflow. Operace zahrnují find, getAll, getById, insert, update, remove a upsert. Nejsou vyžadovány žádné credentials.

## Tabulka nákladů LLM (systémová tabulka)

Nad vašimi uživatelsky vytvořenými tabulkami se zobrazuje připnutá sekce **System tables** s jedinou položkou: **LLM Cost Table**. Jedná se o zobrazení ceny za model s pevným schématem, editovatelné jednotlivými uživateli, které používají cenové grafy v [Traces](./traces-tab.md).

### Odkud data pocházejí

Heym udržuje globální tabulku cen za model naplněnou z veřejného cenového endpointu Helicone (`https://www.helicone.ai/api/llm-costs`). Synchronizace probíhá na pozadí při prvním otevření tabulky nebo Traces a je omezena na jeden fetch za 24 hodin. Stisknutím **Refresh** vynutíte okamžitou opětovnou synchronizaci. Položky odstraněné z upstream seznamu Helicone nejsou lokálně mazány, takže vyhledávání historických nákladů zůstává stabilní.

### Schéma (sloupce pouze pro čtení)

| Sloupec | Význam |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informativní, používá Helicone) |
| Model | Identifikátor modelu porovnávaný s `trace.model` |
| Op | Operátor porovnání: `equals`, `startsWith` nebo `includes` |
| Input $/1M | USD za 1 milion prompt tokenů |
| Output $/1M | USD za 1 milion completion tokenů |
| Source | `helicone`, `seed` nebo `user` |
### Přizpůsobení cen

- **Upravit řádek** pro přepsání jeho cen. Vaše přepsání je určeno pro konkrétního uživatele a je označeno odznakem `Customized`; budoucí synchronizace Helicone jej ponechají beze změny.
- **Obnovit výchozí** odstraní přepsání a obnoví globální hodnotu pro daný řádek.
- **Přidat vlastní model** otevře dialog pro vytvoření řádku pouze pro uživatele (například soukromý doladěný model, který Helicone neuvádí). Vlastní řádky jsou označeny `User added` a jejich smazáním se zcela odstraní.

### Párování s traces

Když dashboard Traces vypočítává náklady, páruje každý `trace.model` proti:

1. Vašim přepsáním (přesná shoda názvu modelu) nejprve
2. Jinak globální tabulce — přesná shoda `equals` má prioritu před `startsWith`/`includes`; shody v rámci stejného operátoru se řeší nejdelší shodnou předponou/podřetězcem modelu

Pokud žádný řádek neodpovídá, model je uveden v upozornění **Unpriced models** na stránce Traces; jeho příspěvek k nákladům je nulový, dokud nepřidáte vlastní řádek nebo nepřepíšete existující.

## Související

- [DataTable Node](../nodes/datatable-node.md) - Reference uzlu Workflow
- [Traces Tab](./traces-tab.md) - Používá LLM Cost Table pro donut nákladů a KPI karty
- [Grist Node](../nodes/grist-node.md) - Alternativa externí tabulky
- [Variables Tab](./global-variables-tab.md) - Alternativa úložiště klíč-hodnota
