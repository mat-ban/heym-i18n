# Tabblad Evaluaties

Het tabblad **Evaluaties** is een aparte pagina op `/evals`. Hiermee kunnen evaluatiesuites worden aangemaakt, testcases worden gedefinieerd en evaluaties worden uitgevoerd op uw [Agent](../nodes/agent-node.md)-workflows. Een [agent-suite](#agent-suites) voert een agent uit of leest de werkelijke uitvoeringen ervan en controleert de aangeroepen tools, latentie, kosten in USD, tokens en het aantal tool-aanroepen.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Bekijk de Evaluaties-demo</a></p>

## Toegang

- Klik op **Evaluaties** in de tabbalk van het dashboard
- Of navigeer naar `/evals`
- Of gebruik **Ctrl+K** (Cmd+K) en selecteer "Evaluaties" in het opdrachtenpalet

## Evaluatiesuites

- **Nieuwe suite** – Kies **Prompt-suite** om een systeem-prompt te testen voor meerdere modellen, of **Agent-suite** om de werkelijke uitvoeringen van een agent te controleren (zie [Agent-suites](#agent-suites))
- **Suite-kiezer** – Toont prompt- en agent-suites samen met het type naast elke naam; typ om te zoeken
- **Suite aanmaken** – Definieer een suite met een naam en beschrijving
- **Workflow selecteren** – Kies welke workflow moet worden geëvalueerd
- **Referentie selecteren** – API-key voor het uitvoeren van de workflow
- **Systeemprompt** – Bewerk de systeemprompt op suiteniveau direct in het linkerpaneel
- **Prompt optimaliseren** – Vraag een LLM om de huidige systeemprompt te verbeteren

## Testcases

- Voeg testcases toe met invoerprompts en verwachte uitvoer
- Elke case kan een aangepaste verwachte waarde voor vergelijking hebben
- Bewerk of verwijder cases uit de suite
- **Testgegevens genereren** – Gebruik de geselecteerde referentie/model om automatisch testcases te maken op basis van de suiteprompt

## Evaluaties uitvoeren

- **Selecteer een of meer modellen** – Voer dezelfde suite tegen meerdere modellen uit in één evaluatie
- **Scoremethode** – Kies `Exact Match`, `Contains` of `LLM-as-Judge`
- **Judge** – Kies voor `LLM-as-Judge` optioneel een OpenAI-, OpenAI-compatibele (Custom)-, Gemini (Google)- of [Decision Model](../nodes/decision-node.md)-referentie en typ het model van de judge (bijvoorbeeld `gpt-4o-mini` of `jev-latest`) om met een onafhankelijke judge te scoren
- **Runs per test** – Herhaal elke testcase meerdere keren in één run
- **Onthouden instellingen** – Een suite opent met de instellingen van de nieuwste uitvoering: inloggegeven, modellen, scoremethode en beoordelaar, temperatuur, redeneerinspanning en uitvoeringen per test. Het openen van een eerdere uitvoering laadt die instellingen, zodat **Evaluaties opnieuw uitvoeren** dezelfde herhaalt
- **Temperatuur** – Stel de modeltemperatuur in (`Exact Match` en `Contains`)
- **Redeneerinspanning** – Stel de redeneerinspanning in voor redeneermodellen, van Laag tot Extra hoog en Max net als bij de LLM- en Agent-nodes (`Exact Match` en `Contains`)

### LLM-as-Judge

Met een judge beantwoordt elk model de testinvoer met alleen de suiteprompt, waarna de judge beoordeelt hoe nauw het antwoord overeenkomt met de verwachte uitvoer, van 0 tot 100:

- **Een model-judge** (OpenAI, OpenAI-compatibel of Gemini) leest de vraag, de verwachte uitvoer en het antwoord, en retourneert een score met een reden van één regel. Deze draait op temperatuur `0`, of op `low` reasoning effort voor een reasoning-model, zodat hetzelfde antwoord hetzelfde oordeel krijgt.
- **Een decision model-judge** beoordeelt het antwoord op een rubric met vijf niveaus, van *Compleet naast* tot *Komt volledig overeen*. De score is de waarschijnlijkheidsgewogen positie op die rubric, dus afkomstig uit een verdeling die het model heeft berekend in plaats van een getal dat het heeft geschreven.

De hover-kaart van de cel toont de reden van de beoordelaar of, bij een beslissingsmodel, het niveau, de score en de betrouwbaarheid. Latentie en tokens beschrijven het geteste model; de eigen aanroepen van de beoordelaar verschijnen in [Traces](./traces-tab.md) onder de bron **Evaluaties**. De beoordelaarkiezer sluit Model Router-inloggegevens uit, omdat een beoordelaar één vast model moet zijn. Het inloggegeven voor de geteste modellen kan een [Model Router](../reference/credentials.md#model-router-auto-model) zijn: het **Auto**-model kiest een model per verzoek, op dezelfde manier als in een workflow.

Zonder judge beantwoordt elk model de vraag en scoort het zijn eigen antwoord in één verzoek.

Temperatuur en reasoning effort zijn verborgen in deze modus, en de run gebruikt vaste instellingen: temperatuur `0.7` voor standaardmodellen, en `medium` reasoning effort voor reasoning-modellen (`low` wanneer ze hun eigen antwoorden scoren).

## Resultaten

- Bekijk pass/fail per testcase
- Inspecteer werkelijke versus verwachte uitvoer
- Vergelijk uitvoer per model naast elkaar wanneer een run meerdere modellen bevat
- Bekijk de run-geschiedenis van eerdere evaluaties; een `LLM-as-Judge`-run toont het judge-model in de geschiedenislijst
- Open historische runs vanuit het resultatenpaneel en inspecteer opgeslagen snapshots van prompt/invoer/uitvoer
- Het openen van een eerdere run laadt de scoringsmethode en judge in het linkerpaneel, zodat **Evaluaties opnieuw uitvoeren** dezelfde evaluatie herhaalt
- **Exporteren** downloadt de run als JSON, inclusief `judge_credential_id` en `judge_model`

## Agent Suites

Een agent-suite controleert een [Agent](../nodes/agent-node.md)-node aan de hand van de uitvoeringen ervan. De suite leest deze uit [Traces](./traces-tab.md), waar elke uitvoering al tijd, tokens, kosten en tool-aanroepen registreert, en kan de workflow ook voor u uitvoeren.

Maak er een aan via **Nieuwe suite** → **Agent-suite** en volg drie stappen:

1. **Agent** – Kies de workflow en vervolgens de agent-node ervan. Alleen workflows met een agent-node worden weergegeven; een workflow of agent die nog niet is uitgevoerd, wordt getoond maar kan niet worden gekozen. De instellingen van de gekozen agent (model, instructies, tools en limieten) verschijnen aan de rechterkant, en daaronder wordt een alleen-lezen canvas van de workflow weergegeven waarin de agent is gemarkeerd.
2. **Baseline** – De laatste 10 uitvoeringen van de agent: latentie p50 en p95, kosten per uitvoering, tokens per uitvoering en tool-aanroepen per uitvoering, welke tools zijn aangeroepen en hoe vaak, en de eigen waarden van elke uitvoering. Uitvoeringen die in een fout eindigden, worden vermeld maar buiten de baseline gelaten.
3. **Controles** – Markeer elke tool als **Must call**, **Must not call** of **Either**. Elk type aanroep wordt met het type vermeld: Python- en node-tools, **MCP**-tools met hun server, **sub-agents** op label, **sub-workflows** op naam en **skills**. Voeg er een toe op type en naam wanneer deze nog niet is uitgevoerd, en verwijder deze weer met de **X**. Stel bovengrenzen in voor latentie, kosten, totale tokens en tool-aanroepen; elk begint 20% boven de p95 van de baseline en kan worden uitgeschakeld.

Een opgeslagen suite opent op **Resultaten**, met daarnaast **Baseline** en **Controles bewerken**:

- **Workflow uitvoeren** – Kies het aantal uitvoeringen (tot 20); er worden er vier tegelijk uitgevoerd. De invoer wordt overgenomen uit de meest recente uitvoering van de workflow en kan worden bewerkt; elke uitvoering maakt hiervan gebruik. Schakel **Invoer genereren** in (het fonkelsymbool) en kies vervolgens een inloggegeven en model, zodat het model voor elke uitvoering een andere invoer opstelt. Het model leest de systeeminstructies van de agent en blijft dicht bij de door u ingevoerde waarden; het invoeren van een stadsnaam levert bijvoorbeeld andere stadsnamen op. Elke uitvoering doorloopt de gehele workflow zoals elke andere uitvoering en wordt vermeld in de Uitvoeringsgeschiedenis met de trigger `agent_suite`. Om latere stappen over te slaan, zoals het verzenden van e-mail, opent u de workflow via **Naar workflow** in het paneel en schakelt u die nodes eerst uit. **Stoppen** beëindigt een suite-uitvoering: er starten geen nieuwe uitvoeringen en actieve uitvoeringen worden geannuleerd. Een suite-uitvoering waarvan de server is gestopt, bijvoorbeeld tijdens een herstart, wordt na een minuut als onderbroken gemarkeerd in plaats van vast te blijven staan.
- **Resultaten** – De meest recente suite-uitvoering wordt standaard beoordeeld. Elke suite-uitvoering wordt met datum bewaard in de uitvoeringskiezer, waar u deze kunt openen of verwijderen; of schakel over naar de laatste 10, 20 of 50 uitvoeringen van de agent om ook andere uitvoeringen mee te nemen. U ziet het slagingspercentage, hoe vaak elke controle slaagde, latentie, kosten, tokens en tool-aanroepen naast de opgeslagen baseline, evenals elke uitvoering met de reden van mislukking en een link naar de trace.
- **Naar workflow** opent de workflow van de agent in een nieuw tabblad. In het naamveld wist **Esc** of de **X** de tekst.

Hoe de getallen worden geïnterpreteerd:

- **Latentie** is de tijd van het model plus de tijd van de tool-aanroepen van de uitvoering.
- **Kosten** hanteren dezelfde tarieven als Traces. Een uitvoering van een model zonder prijs slaat de kostencontrole over in plaats van te mislukken.
- Een uitvoering **slaagt** wanneer deze zonder fouten is voltooid en elke controle is goedgekeurd.
- De suite leest uitsluitend uw eigen traces, volgens dezelfde regel als het tabblad Traces.
- **Laatste uitvoeringen als baseline gebruiken** in **Controles bewerken** vervangt de opgeslagen baseline door de meest recente uitvoeringen van de agent.

De baseline van een suite is afkomstig uit een van drie bronnen. **Controles bewerken** toont naast **Opgeslagen baseline** welke actief is:

- de meest recente uitvoeringen van de agent (de standaardwaarde, en wat **Laatste uitvoeringen als baseline gebruiken** overneemt),
- een voltooide suite-uitvoering,
- handmatig ingevoerde waarden.

De laatste twee worden ingesteld via [Chat](./chat-tab.md#working-with-evals) of de API:

- `PATCH /api/evals/agent-suites/{id}` accepteert `baseline: {"source": "suite_run", "run_id": "…"}` of `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` accepteert `inputs_list`: één invoerobject per uitvoering, tot 20.

### Vanuit Chat en MCP

[Chat](./chat-tab.md#working-with-evals) en de MCP-tool `heym_chat` kunnen prompt- en agent-suites maken, aanpassen en uitvoeren:

- Ze stellen zelf testcases en invoergegevens op.
- Ze vragen welk inloggegeven moet worden gebruikt voordat een prompt-suite wordt aangemaakt, tenzij er slechts één geschikt is.
- Ze koppelen elke suite die ze op deze pagina vermelden.

## Ideeën voor benchmarkmatrices

Bij het bouwen van een benchmarkmatrix voor agent-workflows moeten HITL-scenario's als volwaardige cases worden opgenomen in plaats van als randgevallen.

- Dek alle drie de reviewbeslissingen: `accepted`, `edited` en `refused`
- Neem meerdere triggerbronnen op, zoals editor-runs, portal, curl/webhook en cron-getriggerde uitvoeringen
- Voeg scenario's met herhaalde reviews toe waarin één agent-run meer dan eens pauzeert
- Verifieer notificatievertakkingen die zijn verbonden met de `review`-uitvoer van de agent
- Controleer downstream-gedrag na weigering, vooral als latere knooppunten vertakken op `$agent.decision`

## Gerelateerd

- [Waarom Heym](../getting-started/why-heym.md) – Evaluaties als de testfase van de agent-levenscyclus
- [Agent-knooppunt](../nodes/agent-node.md) – Workflows die worden geëvalueerd
- [Tabblad Referenties](./credentials-tab.md) – Referenties voor evaluatieruns
- [Tabblad Traces](./traces-tab.md) – Gedetailleerde trace-inspectie
- [Tabblad Workflows](./workflows-tab.md) – Workflows aanmaken om te evalueren
- [Uitvoeringsgeschiedenis](../reference/execution-history.md) – Bekijk eerdere runs (knop Geschiedenis in de koptekst)
- [Contextuele showcase](../reference/contextual-showcase.md) – Compacte paginagids beschikbaar op de evaluaties-pagina
