# Tabblad Evaluaties

Het tabblad **Evaluaties** is een aparte pagina op `/evals`. Hiermee kunnen evaluatiesuites worden aangemaakt, testcases worden gedefinieerd en evaluaties worden uitgevoerd op uw [Agent](../nodes/agent-node.md)-workflows.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Bekijk de Evaluaties-demo</a></p>

## Toegang

- Klik op **Evaluaties** in de tabbalk van het dashboard
- Of navigeer naar `/evals`
- Of gebruik **Ctrl+K** (Cmd+K) en selecteer "Evaluaties" in het opdrachtenpalet

## Evaluatiesuites

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
- **Temperatuur** – Stel de modeltemperatuur in (`Exact Match` en `Contains`)
- **Reasoning effort** – Stel de reasoning effort in voor reasoning-modellen (`Exact Match` en `Contains`)

### LLM-as-Judge

Met een judge beantwoordt elk model de testinvoer met alleen de suiteprompt, waarna de judge beoordeelt hoe nauw het antwoord overeenkomt met de verwachte uitvoer, van 0 tot 100:

- **Een model-judge** (OpenAI, OpenAI-compatibel of Gemini) leest de vraag, de verwachte uitvoer en het antwoord, en retourneert een score met een reden van één regel. Deze draait op temperatuur `0`, of op `low` reasoning effort voor een reasoning-model, zodat hetzelfde antwoord hetzelfde oordeel krijgt.
- **Een decision model-judge** beoordeelt het antwoord op een rubric met vijf niveaus, van *Compleet naast* tot *Komt volledig overeen*. De score is de waarschijnlijkheidsgewogen positie op die rubric, dus afkomstig uit een verdeling die het model heeft berekend in plaats van een getal dat het heeft geschreven.

De hover-kaart van de cel toont de reden van de judge, of bij een decision model het niveau, de score en de betrouwbaarheid. Latency en tokens beschrijven het model dat wordt getest; de eigen aanroepen van de judge verschijnen in [Traces](./traces-tab.md) onder de bron **Evaluaties**. De modelkiezer laat Model Router-referenties weg, omdat een evaluatie specifieke modellen vergelijkt.

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
