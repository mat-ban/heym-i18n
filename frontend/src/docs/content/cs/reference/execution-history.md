# Historie spuštění

Historie spuštění zaznamenává běhy workflow: vstupy, výstupy, výsledky uzlů, stav a zdroj Triggeru.
Použijte ji ke sledování aktivního produkčního běhu, kontrole minulých běhů, ladění chyb nebo opětovnému spuštění
se stejnými vstupy pomocí funkce **Bring to Canvas**.

## Přehled

Každé spuštění ukládá:

| Pole | Popis |
|-------|-------------|
| **Inputs** | Tělo požadavku nebo vstupy běhu (např. `text` pro vstupní uzel) |
| **Outputs** | Výstupy na úrovni workflow |
| **Node results** | Výstupy jednotlivých uzlů, stav a doba provádění |
| **Status** | `success`, `error`, `pending`, `skipped` nebo `failed` (viz [Obnova po pádu](#obnova-po-pádu)) |
| **trigger_source** | Způsob spuštění běhu (viz [Triggers](./triggers.md)) |

## Přístup k historii

| Umístění | Rozsah |
|----------|-------|
| Panel nástrojů **Editoru** | Pouze aktuální workflow |
| Záhlaví zobrazení **Docs** | Pouze aktuální workflow |
| Záhlaví **Dashboardu** (karta Chat) | Všechna workflow + běhy chatu/asistenta |
| Záhlaví zobrazení **Evals** | Všechna workflow + běhy chatu/asistenta |

Kliknutím na tlačítko **History** (ikona hodin) otevřete dialog.

## Historie podle workflow vs. veškerá historie

- **Podle workflow** (Editor, Docs): Zobrazuje běhy pro otevřené workflow. Pomocí **Clear history** odstraníte běhy pouze pro toto workflow.
- **Veškerá historie** (Dashboard, Evals): Zobrazuje běhy napříč všemi workflow a relacemi chatu/asistenta. Rozsah odpovídá přístupu k workflow: workflow, které vlastníte, workflow sdílená s vámi přímo a workflow sdílená s týmem, jehož jste členem. Pomocí **Clear all history** odstraníte všechny záznamy, které vlastníte. Historie sdílených workflow bude zachována.

## Bring to Canvas

**Bring to Canvas** načte vstupy a výstupy uzlů vybraného běhu do aktuálního workflow.

### Co se načte

- **Inputs** → Panel vstupů běhu (např. `text` pro vstupní uzel nebo vlastní pole)
- **Node results** → Panel výsledků provádění zobrazuje minulé výstupy jednotlivých uzlů
- **Execution result** → Stav, výstupy a časování z daného běhu

### Chování podle kontextu

- **V Editoru** (historie podle workflow): Aplikuje se okamžitě na otevřené workflow a zavře dialog.
- **Z veškeré historie** (Dashboard/Evals): Přejde do editoru workflow a poté aplikuje data při načtení editoru. K dispozici pouze pro běhy workflow – nikoli pro běhy chatu/asistenta.

### Přímý odkaz na spuštění

Otevření workflow na adrese `/workflows/{workflowId}/{executionId}` automaticky načte dané spuštění na plátno – stejně jako výběr běhu a volba **Bring to Canvas**. Díky tomu lze konkrétní minulý běh sdílet jako URL. Pokud spuštění nelze nalézt (chybné nebo smazané id), editor se vrátí k načtení samotného workflow.

### Případy použití

- Opětovné spuštění workflow se stejnými vstupy
- Ladění neúspěšného běhu kontrolou vstupů a výstupů uzlů
- Porovnání výstupů napříč běhy

## Zeptat se AI

Oba dialogy historie mají vedle názvu tlačítko **Zeptat se AI** (ikona jiskry). Otevře [kartu Chat](../tabs/chat-tab.md#asking-about-a-run) v nové konverzaci s přiloženým workflow a vybraným spuštěním jako odnímatelnými čipy. Zeptejte se, proč byl běh pomalý, co selhalo, nebo nechte Chat workflow opravit. Chat čte přesně toto spuštění, včetně jeho trasování a chyb po uzlech.

V dialogu All History se **Zeptat se AI** zobrazuje pouze při vybraném spuštění workflow; běhy chatu a asistenta jej nezobrazují.

## Časová osa běhu

V detailu spuštění tlačítko **Časová osa** (ikona stopek) vedle **Rozbalit vše** vymění seznam **Kroky** za časovou osu spanů. Když se časová osa zobrazuje, stejné tlačítko nese nápis **Protokoly**; kliknutím se vrátíte k seznamu. V All History se tlačítko zobrazuje pouze pro běhy workflow. Časová osa vykresluje jeden pruh pro každý uzel v čase jeho spuštění, takže vidíte, který uzel trval jak dlouho a které běžely paralelně. Přejetím přes pruh zobrazíte dobu trvání; kliknutím otevřete stejný inspektor podrobností jako [časová osa spuštění](#execution-timeline-details) v editoru. Zvolené zobrazení zůstává aktivní, dokud je dialog otevřený.

Spuštění zaznamenaná dříve, než byly ukládány časy spuštění uzlů, jsou řazena za sebou podle doby trvání.

## Přehledy spuštění

Po živém běhu – nebo po **Bring to Canvas** – se v **pravém horním rohu plátna** zobrazí zavíratelné okno **Execution Highlights**. Je to rychlý způsob, jak zjistit, *co který uzel vytvořil*, seřazené shora dolů v pořadí provádění. Zavřete jej pomocí **✕**; při dalším běhu se znovu otevře.

### Co se zobrazuje

| Záznam | Zdroj | Automaticky? |
|--------|--------|-------|
| **Input** | Vstupní parametry běhu (vstupní/trigger uzel) | Ano |
| **Output** | Výsledek výstupního uzlu – nebo, pokud žádný není, zpráva posledního uzlu | Ano |
| **Agent / LLM** | Výstup každého agenta nebo LLM uzlu | Ano |
| **Output** | Jakýkoli jiný uzel s povolenou volbou **Highlight Node Output** | Volitelně |

Uzly, které jsou již automaticky zvýrazněny (vstupní / výstupní / poslední / agent / llm), se nikdy nezobrazí dvakrát, i když přepínač také zapnete.

### Každý záznam

- Zobrazuje `Node — message…` s prvními **250 znaky**; kliknutím na řádek jej rozbalíte a vykreslíte **celou zprávu jako Markdown** s tlačítkem **Copy**.
- Uzel, který se spustil vícekrát (např. ve smyčce), zobrazuje `Node (N)` s přepínačem `‹ i / N ›` – vyberte, který běh chcete zobrazit; přepínač každého uzlu je nezávislý.

### Highlight Node Output

Každý uzel **kromě Agent a LLM** má ve svém panelu vlastností zaškrtávací políčko **Highlight Node Output** (výchozí vypnuto). Zapnutím přidáte výstup daného uzlu do okna. Na plátně se u zvýrazněných uzlů zobrazí malý odznak ✦. V [workflow DSL](./expression-dsl.md) se jedná o pole dat uzlu `"highlight": true` (výchozí hodnota `false`).

### Na dashboardech

Karty widgetů dashboardu, které spustily workflow, zobrazují v záhlaví karty tlačítko ✦ **Execution highlights**; kliknutím otevřete stejné okno pro běh daného widgetu, přičemž jako hlavní záznam se zobrazí výstup vykreslený widgetem.
## Spouštění executions

Oba dialogy historie zobrazují **aktuálně běžící executions** v horní části seznamu, před minulými spuštěními.

- Zobrazí se rotující indikátor a označení **Running** s časem spuštění
- Kliknutím na **Open live** připojíte editor k přesně tomuto běhu bez jeho restartování
- Plátno nejprve obnoví uzly, které již byly dokončeny, a poté přijímá události
  `node_start`, `node_complete` a finální události execution přes SSE
- Aktuální uzel na plátně pulzuje, navazující uzly si zachovávají čekající animaci a
  panel Debug přidává každý výsledek, jakmile dorazí—stejně jako u běhu spuštěného z editoru
- Kliknutím na **Cancel** execution okamžitě zastavíte
- Zrušení z jakéhokoli dialogu (Editor nebo Dashboard) také uzavře aktivní SSE stream v jakékoli otevřené kartě plátna pro daný workflow, takže se stav editoru čistě resetuje
- Po zrušení běžící záznam zmizí při příštím obnovení; seznam aktualizujete ručně stisknutím **Refresh**
- Pokud zrušíte běh, který již skončil, požadavek nemá žádný efekt

Běhy čekající na [slot souběhu](./webhooks.md#concurrency-limit-and-queued-runs) jsou uvedeny ve stejné sekci s popiskem **Queued 2/5**, svým místem ve frontě a velikostí fronty. Nemají tlačítko **Open live**, protože zatím nic neběží; **Cancel** vyjme čekající běh z fronty a zaznamená jej jako `cancelled`. Běh, který čekal déle než maximální doba čekání workflow, je zaznamenán jako `expired`, a běh odmítnutý plnou frontou jako `queue_full`; oba mají v seznamu běhů svůj vlastní odznak.

Live URL je `/workflows/{workflowId}/{executionId}`. Observer je pouze pro čtení: opuštění
editoru pouze odpojí danou kartu prohlížeče a nikdy nezastaví workflow. Aktivní snapshoty
jsou sdíleny přes PostgreSQL, takže otevření běhu stále funguje, i když trigger a požadavek
editoru přistanou na různých backendových workerech.

## Obnova po pádu

Pokud se server restartuje (deploy, restart kontejneru nebo pád) během běhu workflow, worker tohoto běhu se zastaví uprostřed provádění. Heym tyto přerušené běhy automaticky obnoví, místo aby je nechal zaseknuté ve stavu **Running**.

- Při příštím spuštění zvolený leader proces detekuje osiřelé běhy — okamžitě při řádném restartu, nebo do ~60 sekund při tvrdém pádu (jakmile heartbeaty jasně přestanou).
- Obnovené běhy jsou **spuštěny znovu od začátku se stejnými vstupy** (nikoli pokračováním od místa zastavení) s použitím aktuální definice workflow. Po dokončení zaznamenají běžný koncový záznam (např. `success`), takže historie zobrazuje běh jako dokončený.
- Běh je opakován **jednou**. Pokud je pokus o obnovu také přerušen — nebo bylo workflow mezitím smazáno — záznam se uloží jako `failed`.
- Toto funguje stejně v rámci jednoho kontejneru i v nasazeních s více workery; obnovu provádí pouze leader, takže běh nikdy neobnoví dvakrát různé workery.

### Přepínač Auto-recover

Panel **Execution Log** (run) v editoru má zaškrtávací políčko **Auto-recover**, ve výchozím stavu **zapnuté** pro každý workflow.

- **Zapnuto**: přerušené běhy tohoto workflow jsou znovu spuštěny, jak je popsáno výše.
- **Vypnuto**: přerušené běhy nejsou znovu spuštěny a jsou zaznamenány se stavem `skipped`.

> Běhy sub-workflow nejsou obnovovány nezávisle — jsou znovu řízeny svým obnoveným nadřazeným během. Triggery s vlastním opětovným doručením (RabbitMQ, plánované/cron, IMAP) mohou při restartu také znovu doručit, takže obnovený běh může občas proběhnout dvakrát.

## Čekající na lidské schválení

Běhy, které se pozastaví kvůli schválení [Human-in-the-Loop](./human-in-the-loop.md), jsou do historie zapsány okamžitě se stavem `pending`.

- Uzel čekajícího agenta ukládá payload pro review včetně `reviewUrl`, `draftText` a `expiresAt`
- Jakékoli uzly připojené k handle `review` agenta mohou také běžet před odpovědí člověka a jejich výsledky uzlů jsou uloženy ve stejném čekajícím záznamu historie
- Dialogy historie zobrazují odkaz na review, aby jej vlastníci mohli zkopírovat nebo otevřít
- Dialogy historie a panel Debug v editoru zobrazují konečné rozhodnutí člověka po obnovení běhu
- Když reviewer návrh přijme, upraví nebo odmítne, stejný záznam historie je aktualizován konečným výsledkem execution
- Pokud se stejný běh pozastaví kvůli HITL vícekrát, záznam historie zůstává stejný, zatímco každý checkpoint získá vlastní jednorázový odkaz na review

To je obzvláště užitečné pro běhy portálu a dlouho běžící workflow, které mohou čekat hodiny nebo dny, než budou pokračovat.

## Kopírování

Pomocí **Copy** vedle Inputs nebo Outputs zkopírujete JSON do schránky.

## Vymazání historie

- **Pro jednotlivý workflow**: V dialogu historie editoru klikněte na **Clear history** pro odstranění běhů aktuálního workflow.
- **Celá historie**: V dialogu historie Dashboard/Evals klikněte na **Clear all history** pro odstranění všech záznamů execution, které vlastníte. Běhy ze sdílených workflow jsou zachovány. Tuto akci nelze vrátit zpět.

## Podrobnosti časové osy execution

Když je v editoru otevřen **Execution Log**, kliknutím na tlačítko časovače zobrazíte časovou osu execution. Vyberte úsek pro otevření inline inspektoru podrobností, který převezme oblast řádků. Zobrazuje stav vybraného kroku, trvání, počet pokusů, informace o opakování, chyby, trace ID a kompaktní náhled výstupu. Výstupy objektů a polí používají stejný prohlížeč `JsonTree` jako zbytek panelu Debug; skalární hodnoty používají textový náhled. Když krok vydává obrázky (snímky obrazovky Playwright, generované obrázky, soubory obrázků nebo obrázky base64 v těle požadavku nalezené kdekoli ve výstupu), zobrazí se jako náhledy nad výstupem a JSON zobrazuje krátký zástupný symbol místo surového base64. Kliknutím na náhled jej otevřete v lightboxu; tlačítka se šipkami nebo klávesy ←/→ procházejí všechny obrázky v běhu s počítadlem, jako je `2 / 5`. Použijte **Open trace** pro LLM a Agent spany, když je k dispozici trace ID.
## Detail uzlu na mobilním zařízení

V telefonu editor místo volného plátna zobrazuje přes celou obrazovku strom workflow. Klepnutím na uzel stromu se zaznamenaným výsledkem otevřete jeho spuštění jako detail přes celou obrazovku. Zobrazení nabízí samostatné karty **Input Data**, **Output Data** a **Errors**. Karta výstupu zobrazuje zaznamenaný výsledek a nabízí **Copy Output**; karta vstupu zobrazuje konfiguraci vybraného uzlu a karta chyb zobrazuje zaznamenanou chybu, pokud uzel selhal. Pomocí **Back to workflow** nebo tlačítka zavření se vrátíte do stromu.

Dialogy historie plátna a dashboardu udržují ovládací prvky spuštění v jednom řádku a dostupné filtry značek a instancí umisťují do responzivní mřížky. Jejich nabídky filtrů používají stejný selektor v rámci aplikace, takže zaškrtnutí u vybrané položky má konzistentní odsazení a účaří se všemi popisky možností.

## Související

- [Triggers](./triggers.md) – Jak se workflows spouštějí; historie zaznamenává `trigger_source` (včetně `board` pro spuštění zahájená přesuny karet na [Board](../tabs/board-tab.md) a navazujícími akcemi)
- [Human-in-the-Loop](./human-in-the-loop.md) – Adresy URL čekající na kontrolu a chování při obnovení
- [Edit History](./edit-history.md) – Správa verzí uložení workflow (vrácení, diff)
- [Quick Start](../getting-started/quick-start.md) – Vytvořte a spusťte své první workflow
- [Workflows Tab](../tabs/workflows-tab.md) – Vytvářejte a spravujte workflows
