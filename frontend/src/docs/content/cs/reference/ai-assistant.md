# AI Assistant

**AI Assistant** je chatovací panel, který se otevírá z Debug panelu a zobrazuje se v pravém dolním rohu editoru. Přetažením záhlaví jej přesunete, přetažením okraje nebo rohu změníte jeho šířku či výšku. Panel se nezmenší pod 360×480 pixelů. Pozice a velikost se ukládají v tomto prohlížeči. Volba **Reset position and size** v záhlaví vrátí panel zpět do pravého dolního rohu. Pomocí přirozeného jazyka můžete vytvářet nebo upravovat workflow – popište, co chcete, a AI vygeneruje uzly a hrany, které se aplikují na canvas.

Pro dotazy k dokumentaci mimo editor použijte [Chat with Heym](./chat-with-heym.md). Toto rozhraní je optimalizováno pro kontextovou nápovědu k produktu namísto generování workflow.

## Otevření panelu

1. Otevřete workflow v editoru
2. Vyhledejte **Debug panel** ve spodní části (oblast výsledků spuštění)
3. Klikněte na tlačítko **AI** (ikona Sparkles) na panelu nástrojů
4. Panel AI Assistant se otevře v pravém dolním rohu. Přetažením jeho záhlaví jej přesunete, přetažením okraje nebo rohu změníte jeho šířku či výšku.

Stisknutím `Ctrl + I` / `Cmd + I` kdekoli v editoru panel otevřete nebo zavřete – zkratka funguje i tehdy, když je aktivní textové pole. Viz [Keyboard Shortcuts](./keyboard-shortcuts.md).

Chcete-li pracovat na jednom uzlu, najeďte na něj na plátně myší a klikněte na **AI** nad ním. Panel se otevře se zaměřením na tento uzel. Viz [Změna jednoho uzlu](#changing-one-node).

## Zavření panelu

Klikněte na tlačítko **X**, stiskněte `Ctrl + I` / `Cmd + I` nebo přepněte tlačítko **AI** na panelu nástrojů Debug panelu. Přetažením záhlaví panel přesunete, nikoli zavřete.

## Konfigurace

Před odesláním zpráv vyberte:

| Nastavení | Popis |
|---------|-------------|
| **Credential** | Přihlašovací údaj LLM (API klíč) z [Credentials](../tabs/credentials-tab.md) |
| **Model** | Název modelu (např. `gpt-4o`, `gemini-2.5-flash`) |

Přihlašovací údaje přidejte v [Credentials Tab](../tabs/credentials-tab.md). Seznam modelů se načte z vybraného přihlašovacího údaje.

## Agent Mode vs Ask Mode

Panel má dva režimy, které přepínáte pomocí přepínače **Agent / Ask** v záhlaví panelu.

| Režim | Výchozí | Chování |
|------|---------|-----------|
| **Agent** | ✓ | Sestavuje a upravuje canvas. AI vygeneruje blok JSON s workflow, který se po dokončení odpovědi automaticky aplikuje na canvas. |
| **Ask** | | Pouze odpovídá na dotazy. Canvas zůstane nedotčen. Použijte jej pro dotazy k vašemu workflow, funkcím Heym nebo pro získání rady bez aktualizace canvasu. |

Režimy můžete kdykoli přepnout. Změna režimu nevymaže konverzaci.

V režimu Agent pole **YOLO mode** pod polem pro zprávu způsobí, že asistent spustí a opraví to, co sestaví. Viz [YOLO Mode](#yolo-mode).

## Používání chatu

- Napište svůj požadavek do vstupního pole (např. „Create a workflow that takes user input and sends it to an LLM“)
- Odeslání provedete stisknutím **Enter** (Shift+Enter pro nový řádek)
- AI streamuje svou odpověď. V režimu **Agent**, pokud odpověď obsahuje workflow v bloku kódu \`\`\`json, automaticky se zpracuje a aplikuje na canvas. V režimu **Ask** se canvas nikdy neupravuje.
- Pomocí **Clear** resetujte konverzaci
- Přejeďte myší nad zprávou a klikněte na její ikonu kopírování pro zkopírování zobrazeného textu včetně případného JSON s workflow
- Přetažením řádku nad polem pro zprávu pole zvětšíte. Vstupní oblast může narůst až na 60 % panelu a při opětovném načtení stránky se vrátí do výchozí výšky

## Automatická aplikace workflow

Pokud odpověď AI obsahuje platný blok JSON s workflow (s `nodes` a volitelně `edges`) v bloku kódu \`\`\`json, Heym:

1. Zpracuje JSON z odpovědi
2. Nahradí aktuální canvas novými uzly a hranami
3. Uspořádá rozvržení uzlů
4. Označí workflow jako neuložené

Pokud zpracování selže, zobrazí se tlačítko **Retry** pro opětovné vygenerování odpovědi.

## Změna jednoho uzlu

Najeďte na uzel na plátně myší a klikněte na **AI** nad ním. Panel se otevře v režimu Agent se zaměřením na tento uzel a ukáže, který uzel mění:

| Uzel má... | Panel zobrazuje |
|---|---|
| Žádný výsledek v aktuálním běhu | **Modifying Node:** v kompaktním řádku s ikonou a názvem uzlu. Asistent upravuje pouze z konfigurace uzlu; pokud má vidět výstup, spusťte uzel nejprve |
| Výsledek v aktuálním běhu | **Modifying Node: (Has Node Output)** nad samotným uzlem: ikona, název a typ, poslední stav a doba trvání a chyba, pokud selhal. Asistent vidí tento výstup a chybu při úpravě uzlu |

Najeďte na štítek, abyste viděli, v jakém stavu se panel nachází.

Ať je panel v jakémkoli stavu, asistent čte také dokumentační stránku uzlu pod ikonou knihy v záhlaví uzlu. Využívá ji k pochopení možností uzlu a k zodpovězení dotazů k nim.

Pod zprávami zahajují požadavek tři možnosti:

| Možnost | Co dělá |
|---|---|
| **Change this node as ...** | Vyplní pole zprávy textem *Změň tento uzel na*, abyste větu dokončili |
| **Fix error in this node ...** | Vyplní *Oprav chybu v tomto uzlu.* Asistent přečte chybu tohoto uzlu z posledního běhu |
| **Other** | Zaměří prázdné pole zprávy |

Upravte text a stiskněte **Send**. Asistent vrátí pouze tento uzel a Heym jej aktualizuje na místě: uzel si zachová své id, typ a název, takže výrazy jako `$checkLinkedIn.result` v jiných uzlech fungují dál. Ostatní uzly, propojení a rozložení se nemění a **Undo** obnoví předchozí konfiguraci.

Pokud se požadavek do uzlu nevejde, například vyžaduje jiný typ uzlu nebo nový uzel, asistent uvede, co by se mělo změnit, namísto úpravy. Zavřením zaměření uzlu pomocí **X** na kartě uzlu můžete znovu upravit celý workflow. Zavřením panelu se zaměření také vymaže.

[Režim YOLO](#yolo-mode) funguje se zaměřeným uzlem: asistent mění uzel, spouští workflow a opravuje uzel, dokud běh neuspěje. V režimu **Ask** zaměření sděluje asistentovi, o jaký uzel se váš dotaz opírá, a plátno se nemění.

## YOLO Mode

**YOLO mode** umožňuje asistentovi otestovat to, co sestaví. Zaškrtněte pole **YOLO mode** pod polem pro zprávu a odešlete svůj požadavek. Pole se zobrazuje pouze v režimu Agent. Ve výchozím stavu je vypnuté a při opětovném načtení stránky se vrátí do vypnutého stavu. Pro krátké shrnutí přejeďte myší nad ikonou informace vedle něj.

Při zapnutém režimu YOLO asistent po aplikaci workflow nekončí:

1. Aplikuje workflow na canvas.
2. Před prvním spuštěním si vyžádá testovací vstupy. Karta zobrazuje vstupní pole workflow vyplněná hodnotami, které asistent navrhuje. Upravte je a stiskněte **Run**. Při dalších spuštěních se tyto hodnoty znovu použijí. Karta se zobrazí znovu pouze tehdy, když se změní vstupní pole nebo asistent potřebuje jiná testovací data.
3. Spustí workflow na canvasu přesně jako tlačítko **Run**: neuložené změny se nejprve uloží, uzly se rozsvítí a spuštění se zobrazí v Debug panelu a [Execution History](./execution-history.md).
4. Přečte výsledek. Pokud spuštění udělalo to, co jste požadovali, dokončí práci se stavem **Verified** a krátkým shrnutím. Pokud ne, opraví workflow a spustí jej znovu.

Provede maximálně **5 spuštění** na zprávu. Stisknutím **Stop** kdykoli ukončíte smyčku a zastavíte probíhající spuštění.

Každá odpověď zobrazuje své kroky tak, jak probíhají:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5` s řádkem `Executing <node>` pro každý uzel;
- konečný verdikt.

Po každém spuštění se zobrazí krátký řádek, například *Attempt 1 result sent · error in 1.2s*, který signalizuje, že výsledek byl odeslán zpět asistentovi.
### Spouštění dalších workflow

V režimu YOLO může asistent také spouštět Vaše další workflow, když potřebuje jejich výsledek. Může například zkontrolovat, co workflow vrací, než jej zavolá z uzlu [Execute](../nodes/execute-node.md). Tato spuštění se zobrazují jako kroky `Running workflow "<name>"...` a jsou zaznamenána v Historii spuštění se zdrojem triggeru `ai_assistant`. Workflow, které právě upravujete, je vždy testováno na canvasu.

### Když se zastaví předčasně

| Situace | Co se stane |
|---|---|
| Asistent potřebuje rozhodnutí, informaci, přihlašovací údaj nebo datovou tabulku | Zeptá se pomocí obvyklé karty s otázkou. Odpověď pokračuje ve smyčce. |
| Spuštění čeká na [lidskou kontrolu](./human-in-the-loop.md) | Smyčka se zastaví. Schvalte kontrolu a poté odešlete zprávu. |
| Workflow čeká na nahrání souboru | Smyčka se zastaví. Režim YOLO nedokáže testovat spuštění vyvolaná nahráním souboru. |
| Novější verze workflow byla uložena jinde | Smyčka se zastaví. Vyřešte konflikt ukládání a poté odešlete zprávu. |

> **Spuštění jsou skutečná.** E-maily, zprávy a volání API ve workflow jsou při každém pokusu skutečně odeslány a uzly DataTable zapisují skutečné řádky. Každé spuštění ukládá workflow, takže dřívější verze zůstávají v [Historii úprav](./edit-history.md).

## Hlasový vstup

V podporovaných prohlížečích tlačítko **Voice** aktivuje převod řeči na text. Kliknutím zahájíte nahrávání, dalším kliknutím jej zastavíte. Přepsaný text je před odesláním odeslán AI ke korekci gramatiky.

## Uzel Agent vs AI Assistant

| | Uzel Agent | AI Assistant |
|---|------------|---------------|
| **Účel** | Uzel LLM uvnitř workflow; spouští se během provádění | Chat UI pro tvorbu workflow přirozeným jazykem |
| **Umístění** | Uzel na canvasu | Panel ladění → plovoucí panel |
| **Kdy** | Za běhu | Během úprav |

Uzel workflow, který provádí volání LLM s nástroji a MCP, najdete v části [Uzel Agent](../nodes/agent-node.md).

## Jak to funguje (AI Builder DSL)

AI Assistant je poháněn **workflow DSL** (doménově specifickým jazykem), který popisuje uzly, hrany a výrazy. Když odešlete zprávu:

1. Vaše zpráva spolu s [Uživatelskými pravidly](./user-settings.md) a aktuálním workflow (pokud existuje) jsou odeslány na backend.
2. Backend sestaví **systémový prompt**, který obsahuje:
   - Úplné workflow DSL (typy uzlů, syntaxe výrazů, pravidla, příklady)
   - Vaše Uživatelská pravidla připojená jako "User Custom Rules"
   - JSON aktuálního workflow, když upravujete existující workflow
   - Seznam dostupných workflow, pokud používáte uzel Execute
   - Názvy, typy a id přihlašovacích údajů, které vlastníte nebo které s Vámi byly sdíleny (nikdy jejich hodnoty)
   - Názvy, id, popisy a sloupce datových tabulek, které můžete použít (nikdy jejich řádky)
3. Model vrátí jediný blok JSON workflow (s `nodes` a `edges`). Frontend jej zpracuje a aplikuje na canvas.

### Přihlašovací údaje

Když workflow potřebuje přihlašovací údaj, asistent se před jeho sestavením zeptá. Pokud máte přihlašovací údaje vhodného typu, vypíše je spolu s možností **Create a new credential**; pokud žádné nemáte, zeptá se, zda nějaký vytvořit. Každá otázka Vám také umožňuje pokračovat bez přihlašovacího údaje.

Volba vytvořit nový otevře formulář přihlašovacího údaje v panelu, přednastavený na správný typ a navrhovaný název. Hodnoty jdou přímo do Heym; asistent se dozví pouze název a typ. OAuth přihlašovací údaje (Google Sheets, Google Drive, BigQuery, Linear, Notion) se připojují v popupu a v případě, že je popup zablokován, se zobrazí odkaz na autorizační stránku. Jakmile je přihlašovací údaj uložen, karta zobrazí jeho název a tlačítko pro vytvoření se vypne; stiskněte **Submit answers** a asistent umístí nový přihlašovací údaj na uzel.

Můžete také požádat o přihlašovací údaj samostatně ("create a GitHub credential") nebo požádat o změnu toho, který vlastníte ("update my sheet credential", "reconnect my Google Sheets"). Asistent odpoví stejnou kartou: vytvoření otevře prázdný formulář, aktualizace otevře formulář s tímto přihlašovacím údajem a jeho tajemstvími maskovanými.

Asistent upřednostňuje vyhrazený uzel. Pokud žádný uzel nepokrývá danou operaci, například přidání listu do Google Sheet, použije HTTP požadavek a zapíše řádek hlavičky pro zvolený přihlašovací údaj. Viz [HTTP › Autentizace pomocí přihlašovacích údajů](../nodes/http-node.md#authenticating-with-credentials).

Doplňující otázky, bez kterých se workflow obejde, mají ve svém vstupu označení **Optional** a lze je přeskočit.

DSL vynucuje popisky v camelCase, sjednocená pravidla výrazů a pole specifická pro jednotlivé uzly. Pokud je hodnotou pole jediný `$expr`, backend zachová nativní typ; pokud hodnota míchá prózu s `$refs`, výsledkem je řetězec. Stále platí pravidlo jednoho `$`: žádné `$` uvnitř závorek. Uživatelská pravidla v [Nastavení](./user-settings.md) jsou vložena do tohoto systémového promptu, takže Vaše preference platí pro každé workflow vygenerované AI.

Pokud aktuální workflow obsahuje dovednosti Agent, AI Assistant zahrne do kontextu tohoto workflow pouze `SKILL.md` každé dovednosti. Přiložené soubory `.py` a binární prostředky dovedností jsou před požadavkem odstraněny, aby se builder udržel v limitech kontextu modelu, i když dovednosti obsahují rozsáhlé implementace.
### Datové tabulky

Když workflow ukládá, uchovává nebo vyhledává záznamy a nepojmenovali jste jiné úložiště, asistent použije uzel [DataTable](../nodes/datatable-node.md). Pokud pojmenujete jednu ze svých tabulek a ta obsahuje sloupce, které workflow potřebuje, asistent ji použije. V opačném případě se zeptá, kterou tabulku použít. Karta vypíše tabulky, které vyhovují, každou s jejím popisem a typy sloupců, a dále **Vytvořit novou tabulku** s navrženým názvem a sloupci. Nabízeny jsou i tabulky, které s Vámi byly sdíleny; tabulka, kterou můžete pouze číst, je nabízena pouze pro čtení.

Vyberte novou tabulku a stiskněte **Odeslat odpovědi**: karta tabulku vytvoří a asistent na uzel umístí její id a použije její přesné názvy sloupců. Můžete také požádat o tabulku samostatně, například „vytvoř tabulku pro moje leady".

Asistent vidí názvy tabulek, popisy a sloupce, nikdy ne řádky. Nikdy nemění sloupce existující tabulky: pokud tabulce chybí sloupec, který workflow potřebuje, pojmenuje tento sloupec a místo toho nabídne novou tabulku. Sloupce přidávejte na kartě [DataTable](../tabs/datatable-tab.md).

## Související

- [Proč Heym](../getting-started/why-heym.md) – Tvorba v přirozeném jazyce jako první fáze životního cyklu agenta
- [Rychlý start](../getting-started/quick-start.md) – Vytvořte své první workflow
- [Nastavení](./user-settings.md) – Uživatelská pravidla vložená do systémového promptu AI Assistant
- [Chat s Heym](./chat-with-heym.md) – Asistent vnímající stránku v oblasti dokumentace
- [Základní koncepty](../getting-started/core-concepts.md) – Workflows, uzly a průběh spuštění
- [Uzel Agent](../nodes/agent-node.md) – Uzel LLM s nástroji a MCP
- [Karta Přihlašovací údaje](../tabs/credentials-tab.md) – Přidejte API klíče pro AI Assistant
- [Struktura workflow](./workflow-structure.md) – JSON formát pro workflows
