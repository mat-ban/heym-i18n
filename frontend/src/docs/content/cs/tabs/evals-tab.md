# Karta Evals

Karta **Evals** je samostatná stránka na adrese `/evals`. Umožňuje vám vytvářet evaluační sady, definovat testovací případy a spouštět evaluace proti vašim workflow [Agent](../nodes/agent-node.md). [Sada agenta](#agent-suites) spouští agenta nebo čte jeho reálné běhy a kontroluje volané nástroje, latenci, náklady v USD, tokeny a počet volání nástrojů.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Přehrát demo Evals</a></p>

## Přístup

- Klikněte na **Evals** v liště karet dashboardu
- Nebo přejděte na `/evals`
- Nebo použijte **Ctrl+K** (Cmd+K) a vyberte „Evals" z palety příkazů

## Evaluační sady

- **Nová sada** – Zvolte **Sada promptů** pro testování systémového promptu napříč modely, nebo **Sada agenta** pro kontrolu reálných běhů agenta (viz [Sady agenta](#agent-suites))
- **Výběr sady** – Zobrazuje sady promptů a agentů společně s typem vedle každého názvu; psaním vyhledávejte
- **Vytvořit sadu** – Definujte sadu s názvem a popisem
- **Vybrat workflow** – Zvolte, které workflow chcete evaluovat
- **Vybrat credential** – API klíč pro spuštění workflow
- **Systémový prompt** – Upravte systémový prompt na úrovni sady přímo v levém panelu
- **Optimalizovat prompt** – Požádejte LLM o vylepšení aktuálního systémového promptu

## Testovací případy

- Přidejte testovací případy se vstupními prompty a očekávanými výstupy
- Každý případ může mít vlastní očekávanou hodnotu pro porovnání
- Upravujte nebo mažte případy ze sady
- **Generovat testovací data** – Pomocí vybraného credential/modelu automaticky vytvořte testovací případy z promptu sady

## Spouštění evaluací

- **Vyberte jeden nebo více modelů** – Spusťte stejnou sadu proti více modelům v rámci jedné evaluace
- **Metoda skórování** – Zvolte `Exact Match`, `Contains` nebo `LLM-as-Judge`
- **Judge** – Pro `LLM-as-Judge` volitelně vyberte credential OpenAI, OpenAI kompatibilní (Custom), Gemini (Google) nebo [Decision Model](../nodes/decision-node.md) a zadejte model judge (například `gpt-4o-mini` nebo `jev-latest`) pro skórování nezávislým judge
- **Počet spuštění na test** – Opakujte každý testovací případ vícekrát v rámci jednoho běhu
- **Zapamatovaná nastavení** – Sada se otevírá s nastaveními svého nejnovějšího běhu: pověření, modely, metoda hodnocení a hodnotitel, teplota, úsilí při uvažování a počet běhů na test. Otevření dřívějšího běhu načte jeho nastavení, takže **Znovu spustit evaluace** zopakuje tentýž test
- **Temperature** – Nastavte temperature modelu (`Exact Match` a `Contains`)
- **Úsilí při uvažování** – Nastavte úsilí při uvažování pro uvažující modely, od Nízké po Velmi vysoké a Max stejně jako u uzlů LLM a Agent (`Exact Match` a `Contains`)

### LLM-as-Judge

S judge odpovídá každý model na testovací vstup pouze s promptem sady, poté judge ohodnotí, jak těsně odpověď odpovídá očekávanému výstupu, na škále 0 až 100:

- **Modelový judge** (OpenAI, OpenAI kompatibilní nebo Gemini) přečte otázku, očekávaný výstup a odpověď a vrátí skóre s jednořádkovým odůvodněním. Běží při temperature `0`, nebo při `low` reasoning effort pro reasoning model, takže stejná odpověď dostane stejný verdikt.
- **Judge typu decision model** hodnotí odpověď podle pětistupňového rubrika, od *Completely off* po *Fully matches*. Skóre je pravděpodobnostně vážená pozice na tomto rubriku, takže pochází z distribuce, kterou model vypočítal, nikoli z čísla, které napsal.

Karta při najetí myší na buňku zobrazuje odůvodnění hodnotitele nebo u rozhodovacího modelu úroveň, skóre a spolehlivost. Latence a tokeny popisují testovaný model; vlastní volání hodnotitele se zobrazují v [Trasách](./traces-tab.md) pod zdrojem **Evaluace**. Výběr hodnotitele vynechává pověření Model Router, protože hodnotitel musí být jeden pevný model. Pověřením pro testované modely může být [Model Router](../reference/credentials.md#model-router-auto-model): jeho model **Auto** vybírá model pro každý požadavek, stejně jako ve workflow.

Bez judge každý model odpovídá a skóruje svou vlastní odpověď v jediném požadavku.

Temperature a reasoning effort jsou v tomto režimu skryté a běh používá pevná nastavení: temperature `0.7` pro standardní modely a `medium` reasoning effort pro reasoning modely (`low`, když skórují své vlastní odpovědi).

## Výsledky

- Zobrazte pass/fail pro každý testovací případ
- Prohlédněte si skutečné vs. očekávané výstupy
- Porovnejte výstupy jednotlivých modelů vedle sebe, když běh zahrnuje více modelů
- Prohlédněte si historii běhů minulých evaluací; běh `LLM-as-Judge` zobrazuje svůj judge model v seznamu historie
- Otevírejte historické běhy z panelu výsledků a prohlížejte uložené snapshoty prompt/input/output
- Otevření minulého běhu načte jeho metodu skórování a judge do levého panelu, takže **Re-Run Evals** zopakuje stejnou evaluaci
- **Export** stáhne běh jako JSON včetně `judge_credential_id` a `judge_model`

## Agent Suites

Sada agenta ověřuje uzel [Agent](../nodes/agent-node.md) na základě jeho běhů. Načítá je z [Tras](./traces-tab.md), kde každý běh již zaznamenává svůj čas, tokeny, náklady a volání nástrojů, a může také spustit workflow za vás.

Vytvořte ji přes **Nová sada** → **Sada agenta** a postupujte ve třech krocích:

1. **Agent** – Vyberte workflow a poté jeho uzel agenta. Uvedena jsou pouze workflow s uzlem agenta; workflow nebo agent, který dosud neběžel, se zobrazí, ale nelze jej vybrat. Nastavení vybraného agenta (model, instrukce, nástroje a limity) se zobrazují vpravo a níže se zobrazí plátno workflow pouze pro čtení se zvýrazněným agentem.
2. **Baseline** – Posledních 10 běhů agenta: latence p50 a p95, náklady na běh, tokeny na běh a volání nástrojů na běh, které nástroje volal a jak často, a vlastní hodnoty každého běhu. Běhy ukončené chybou jsou uvedeny, ale z baseline jsou vynechány.
3. **Kontroly** – Označte každý nástroj jako **Must call**, **Must not call** nebo **Either**. Každý druh volání je uveden se svým typem: nástroje Pythonu a uzlů, nástroje **MCP** s jejich serverem, **podagenti** podle štítku, **dílčí workflow** podle názvu a **skills**. Přidejte nástroj podle druhu a názvu, pokud ještě neběžel, a odstraňte jej pomocí křížku **X**. Nastavte horní limity pro latenci, náklady, celkové tokeny a volání nástrojů; každý začíná 20 % nad p95 baseline a lze jej vypnout.

Uložená sada se otevírá na kartě **Výsledky**, vedle níž jsou karty **Baseline** a **Upravit kontroly**:

- **Spustit workflow** – Zvolte počet běhů (až 20); čtyři běží současně. Vstupy se předvyplní z nejnovějšího běhu workflow a lze je upravit, přičemž je použije každý běh. Zapněte **Generovat vstupy** (ikona jiskry) a poté vyberte pověření a model, aby model vytvořil pro každý běh jiný vstup. Čte systémové instrukce agenta a drží se blízko zadaných hodnot: zadání názvu města vygeneruje jiné názvy měst. Každý běh provede celé workflow jako jakýkoli jiný běh a je zapsán v Historii spuštění s triggerem `agent_suite`. Chcete-li přeskočit pozdější kroky, například odeslání e-mailu, otevřete workflow přes **Přejít do workflow** v panelu a tyto uzly nejprve deaktivujte. **Zastavit** ukončí běh sady: žádné nové běhy se nespustí a probíhající se zruší. Běh sady, jehož server se zastavil, například během restartu, se po minutě zobrazí jako přerušený, místo aby zůstal zablokovaný.
- **Výsledky** – Ve výchozím nastavení se hodnotí nejnovější běh sady. Každý běh sady je uchováván s datem ve výběru běhů, kde jej můžete otevřít nebo smazat; případně přepněte na posledních 10, 20 nebo 50 běhů agenta a zahrňte i jeho další běhy. Uvidíte míru úspěšnosti, jak často jednotlivé kontroly prošly, latenci, náklady, tokeny a volání nástrojů vedle uložené baseline, a také každý běh s důvodem selhání a odkazem na jeho trasu.
- **Přejít do workflow** otevře workflow agenta v nové záložce. V poli názvu klávesa **Esc** nebo křížek **X** vymaže text.

Jak se čísla interpretují:

- **Latence** je čas modelu plus doba volání nástrojů daného běhu.
- **Náklady** využívají stejné ceny jako Traces. Běh modelu bez nastavené ceny kontrolu nákladů přeskočí, místo aby selhal.
- Běh **uspěje**, pokud skončil bez chyby a prošly všechny kontroly.
- Sada čte pouze vaše vlastní trasy, podle stejného pravidla jako karta Traces.
- **Použít nejnovější běhy jako baseline** v **Upravit kontroly** nahradí uloženou baseline nejnovějšími běhy agenta.

Baseline sady pochází z jednoho ze tří zdrojů. **Upravit kontroly** ukazuje aktivní zdroj vedle **Uložená baseline**:

- nejnovější běhy agenta (výchozí stav a hodnota, kterou přebírá **Použít nejnovější běhy jako baseline**),
- jeden dokončený běh sady,
- ručně zadaná čísla.

Poslední dvě možnosti se nastavují z [Chatu](./chat-tab.md#working-with-evals) nebo přes API:

- `PATCH /api/evals/agent-suites/{id}` přijímá `baseline: {"source": "suite_run", "run_id": "…"}` nebo `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` přijímá `inputs_list`: jeden vstupní objekt na běh, až 20.

### Z Chatu a MCP

[Chat](./chat-tab.md#working-with-evals) a MCP nástroj `heym_chat` mohou vytvářet, upravovat a spouštět sady promptů i agentů:

- Samy navrhují testovací případy a vstupy pro běhy.
- Před vytvořením sady promptů se zeptají na pověření, pokud nevyhovuje právě jedno.
- Odkazují na každou sadu, kterou na této stránce zmíní.

## Nápady pro benchmark matici

Když sestavujete benchmark matici pro agent workflow, zahrňte HITL scénáře jako prvotřídní případy místo toho, abyste je považovali za okrajové případy.

- Pokryjte všechna tři rozhodnutí review: `accepted`, `edited` a `refused`
- Zahrňte více zdrojů triggerů, jako jsou spuštění z editoru, portál, curl/webhook a spuštění vyvolaná cron
- Přidejte scénáře opakovaného review, kde se jeden běh agenta pozastaví více než jednou
- Ověřte větve notifikací připojené k výstupu `review` agenta
- Ověřte downstream chování po odmítnutí, zejména pokud pozdější uzly větví na `$agent.decision`

## Související

- [Proč Heym](../getting-started/why-heym.md) – Evals jako testovací fáze životního cyklu agenta
- [Uzel Agent](../nodes/agent-node.md) – Workflow, která jsou evaluována
- [Karta Credentials](./credentials-tab.md) – Credentials pro běhy eval
- [Karta Traces](./traces-tab.md) – Podrobné prohlížení trace
- [Karta Workflows](./workflows-tab.md) – Vytvářejte workflow k evaluaci
- [Historie spuštění](../reference/execution-history.md) – Zobrazte minulé běhy (tlačítko History v hlavičce)
- [Kontextový showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkou dostupný na stránce evals
