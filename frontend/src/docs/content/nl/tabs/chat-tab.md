# Chat-tabblad

Het **Chat**-tabblad biedt een directe LLM-chatinterface. Gebruik het om modellen te testen, vragen te stellen, bestaande workflows uit te voeren of een nieuwe workflow te maken op basis van een natuurlijk taalverzoek.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Bekijk Chat-demo</a></p>

## Configuratie

1. Selecteer een [referentie](./credentials-tab.md) (API-key voor OpenAI, Google, enz.)
2. Kies een model uit de vervolgkeuzelijst (modellen worden geladen op basis van de geselecteerde referentie)
3. Begin te typen om berichten te verzenden

Er kan ook een gesprek worden gestart vanuit het chatvak op het tabblad [Workflows](./workflows-tab.md). Dit verzendt het eerste bericht en opent het nieuwe gesprek hier, waarbij het antwoord al streamt.

## Functies

- **Context van globale variabelen** – De [Globale variabelen](../reference/global-variables.md) zijn beschikbaar voor het LLM, zodat vragen gesteld kunnen worden over opgeslagen waarden of er naar verwezen kan worden
- **Context van workspace-sjablonen** – Gedeelde workflow- en node-sjablonen in de workspace worden als context meegenomen, zodat Chat vragen kan beantwoorden over beschikbare sjablonen
- **Langdurig werkende agent** – Chat blijft op de achtergrond doorwerken, zelfs als de browser wordt gesloten, zodat vanaf een ander apparaat hetzelfde gesprek kan worden voortgezet
- **Workflow aanmaken** – Vraag Chat om een workflow te maken of in te stellen; het gebruikt dezelfde Workflow AI Builder-engine als de editor-assistent om de workflow te genereren en op te slaan
- **Kanban-taak aanmaken** – Vraag in natuurlijke taal om een taak toe te voegen of een kaart te maken. Chat voegt deze toe aan de eerste kolom van het opgegeven board; bij meerdere boards zonder opgave van een specifiek board toont Chat eerst een board-kiezer voordat de kaart wordt aangemaakt
- **Follow-ups in wachtrij** – Er kunnen meer berichten worden verzonden terwijl een antwoord streamt. Berichten in de wachtrij worden opgeslagen, kunnen worden bewerkt of verwijderd voordat ze starten, en worden in volgorde na het actieve antwoord uitgevoerd
- **Pauzes tijdens planning** – Wanneer Chat planningsdetails nodig heeft, stelt het verduidelijkingsvragen en pauzeert het follow-ups in de wachtrij totdat deze zijn beantwoord. Nadat het planningsantwoord is afgerond, worden de berichten in de wachtrij hervat
- **Referenties** – Wanneer een workflow die Chat maakt of bewerkt een referentie nodig heeft, vraagt Chat welke gebruikt moet worden, biedt het aan een nieuwe in het gesprek aan te maken, of kan er zonder worden doorgegaan. Er kan ook gevraagd worden om een referentie aan te maken of een bestaande bij te werken; Chat opent het referentieformulier in het gesprek. Het model ziet de naam en het type van de referentie, nooit de waarden, voor referenties die u bezit en referenties die met u zijn gedeeld. LLM- en Agent-knooppunten die Chat toevoegt, worden uitgevoerd met de referentie en het model die voor de chat zijn geselecteerd, inclusief gedeelde referenties; wanneer Chat een workflow bewerkt, behouden de bestaande LLM- en Agent-knooppunten hun referentie en model. Zie [AI-assistent › Referenties](../reference/ai-assistant.md#credentials)
- **Gegevenstabellen** – Wanneer een workflow die Chat maakt of bewerkt records opslaat, vraagt Chat welke [gegevenstabel](./datatable-tab.md) gebruikt moet worden of biedt het aan er een aan te maken met de kolommen die de workflow nodig heeft. Chat kan ook de tabellen en hun kolommen weergeven. Chat leest of schrijft nooit rijen. Zie [AI-assistent › Gegevenstabellen](../reference/ai-assistant.md#data-tables)
- **Streamende antwoorden** – De uitvoer van het model is zichtbaar terwijl deze streamt
- **Antwoord stoppen** – Onderbreek het huidige streamende antwoord op elk moment; bij stoppen worden ook de berichten in de wachtrij voor dat gesprek gewist
- **Markdown-weergave** – Antwoorden ondersteunen markdown-opmaak, inclusief inline afbeeldingen
- **Afbeeldingsweergave** – Afbeeldingen in antwoorden (bijv. van LLM-afbeeldingsgeneratie) verschijnen inline; klik op een afbeelding om deze volledig scherm te bekijken. Druk op **Esc** of de terugknop (mobiel) om de volledige schermweergave te sluiten
- **Berichten kopiëren** – Kopieer elk bericht naar het klembord
- **Chat wissen** – Start een nieuw gesprek
- **Spraakinvoer** – Gebruik de microfoonknop voor spraak-naar-tekst (door browser ondersteund). Wanneer de opname stopt, kan Heym het transcript licht opschonen voordat het verzonden wordt
- **Geplande workflows** – Vraag wanneer cron-workflows worden uitgevoerd (vandaag, deze week, deze maand of een aangepast datumbereik). De assistent gebruikt dezelfde planningsgegevens als het tabblad [Gepland](./scheduled-tab.md) en kan resultaten beperken tot workflows die eigendom zijn van de gebruiker of gedeelde workflows meenemen
- **Uitvoeringsgeschiedenis van workflows** – Vraag naar één specifieke workflow ("hoe vaak is het dagelijkse rapport uitgevoerd?", "is het mislukt?", "wanneer is het voor het laatst uitgevoerd?"). Chat zoekt de workflow op via het ID en antwoordt op basis van het aantal uitvoeringen, de statusverdeling, de eerste en laatste uitvoeringstijd en de gemiddelde duur. Vraag waarom een uitvoering is mislukt of wat deze heeft geretourneerd, en Chat opent die specifieke uitvoering om de invoer, uitvoer en fouten per knooppunt te lezen
- **Live uitvoeringsstatus** – Vraag wat er nu wordt uitgevoerd en Chat antwoordt met het aantal, de workflownamen, hoe lang elke uitvoering al bezig is, op welk knooppunt deze zich bevindt en een directe link naar de live uitvoering

- **Run-contextchips** – **AI vragen** in de [Execution History](../reference/execution-history.md#ask-ai) opent een nieuw gesprek met de geselecteerde Workflow-run als chips bijgevoegd. Zie [Vragen over een run](#vragen-over-een-run)

## Chat gebruiken vanuit een MCP-client

De Chat-engine kan ook buiten de browser worden bereikt. Schakel de **Heym Chat Tool** in op het tabblad [MCP](./mcp-tab.md) in en MCP-clients — Claude, Cursor en al het andere dat MCP ondersteunt — krijgen één `heym_chat`-tool die deze zelfde engine met al zijn mogelijkheden uitvoert.

Die gesprekken komen terecht in de geschiedenis van dit tabblad, gemarkeerd met een stekkerpictogram in de gesprekkenlijst. Open er een om te lezen wat de client heeft gevraagd, de toolkaarten te bekijken die zijn geactiveerd en de thread zelf voort te zetten. Het beantwoorden van een verduidelijkingsvraag werkt hetzelfde, ongeacht of de beurt hier of vanuit een MCP-client is gestart.

Via MCP worden in Chat geen inloggegevens weergegeven, gekozen of aangemaakt. Workflows die het bouwt, laten velden voor inloggegevens leeg, en het antwoord vermeldt de knooppunten die een inloggegeven nodig hebben, zodat u deze in de editor kunt instellen.

Gegevenstabellen werken ook via MCP: Chat toont uw tabellen, maakt nieuwe aan en verbindt deze met de workflows die het bouwt. De vraag over de tabel verschijnt als tekst in het resultaat, dus beantwoord deze met dezelfde `conversation_id`.

## Contextlimiet

De chat houdt maximaal 25 recente berichten in de context. Oudere berichten worden ingekort om binnen de modellimieten te blijven.

## Workflows aanmaken

Wanneer u Chat vraagt een workflow aan te maken, te bouwen, te genereren of in te stellen, maakt het een nieuwe opgeslagen workflow met een gegenereerde naam en beschrijving. Het antwoord bevat een alleen-lezen canvasvoorbeeld van de gegenereerde knooppunten en verbindingen, plus een **Open workflow**-link die de workflow-editor in een nieuw browsertabblad opent. Gebruik de **Run**-knop van de voorbeeldkaart wanneer u de workflow wilt uitvoeren.

Vervolgfeedback in dezelfde chat bewerkt die workflow in plaats van een nieuwe aan te maken. Na het aanmaken van een workflow door Chat kunt u bijvoorbeeld zeggen "voeg een goedkeuringsstap toe", "wijzig het uitvoerformaat" of "şöyle yap" en Chat werkt de opgeslagen workflow bij en vernieuwt het voorbeeld.

Dit is het meest geschikt voor verzoeken waarbij u het werk wilt laten uitvoeren als een herbruikbare automatisering, niet alleen als een eenmalig antwoord.

## Kanban-taken aanmaken

Vraag het Chat in gewone taal, bijvoorbeeld "Voeg een taak toe met de naam Fix login bug" of
"Maak een nieuwe kaart Update documentation aan op het bord Launch." U kunt een
beschrijving in hetzelfde verzoek opnemen. Chat maakt de kaart altijd aan in de eerste kolom van het geselecteerde bord.

Als uw werkruimte meerdere borden heeft en u er geen aanwijst, pauzeert Chat met een
bordkiezer met één keuze. Selecteer een bord om het aanmaken van de kaart te voltooien. Er is geen slash-commando
of speciaal berichtformaat vereist.

## Vragen wat er actief is

Vraag het in gewone taal — "wat is er actief?", "hoeveel workflows zijn er nu actief?",
"op welk knooppunt staat het nightly report?" — en Chat rapporteert het actuele beeld:

- **Hoeveel** uitvoeringen er gaande zijn, opgesplitst in actief en wachtend op menselijke beoordeling
- **Bij welke workflows** ze horen, op naam
- **Hoe lang** elke uitvoering al bezig is (bijvoorbeeld `1m 35s`, `3h 25m`)
- **Welk knooppunt** nu wordt uitgevoerd, op basis van het canvaslabel, plus het laatst voltooide knooppunt
- **Een link** naar elke actieve uitvoering, die het canvas opent met die uitvoering die opnieuw wordt afgespeeld

Uitvoeringen die zijn gepauzeerd voor een [Human-in-the-Loop](../reference/human-in-the-loop.md)- of Codex-beoordeling worden gerapporteerd als wachtend op u, niet als actief. Dit zijn dezelfde gegevens als de badge voor actieve uitvoeringen in de koptekst, dus Chat en de badge zijn nooit met elkaar in tegenspraak. Vraag voor uitvoeringen die al zijn voltooid om recente uitvoeringen — dat leest de [Execution History](../reference/execution-history.md).

## Vragen over een run

Selecteer een Workflow-run in de [Execution History](../reference/execution-history.md#ask-ai), vanuit de editor of vanuit All History, en klik op **AI vragen** naast de titel van het dialoogvenster. Chat opent een nieuw gesprek met twee chips boven het berichtvak:

- **Workflow:** de naam van de Workflow
- **Execution:** de eerste tekens van de id van de geselecteerde run

Verwijder een chip met de bijbehorende **×** om hem weg te laten. Stel daarna uw vraag, bijvoorbeeld “waarom duurde deze run zo lang?”, “wat is hier mislukt?” of “kunt u dit oplossen?”. De resterende chips worden met de volledige id's aan dat bericht gekoppeld, zodat Chat de invoer, uitvoer en trace per node van de run rechtstreeks leest in plaats van naar de Workflow te zoeken. Om de Workflow te herstellen slaat Chat de wijziging op, test hij deze en controleert hij deze zoals beschreven in [Workflows maken](#workflows-maken).

Het verzonden bericht toont de chips onder uw vraag. Ze horen alleen bij dat bericht; vervolgvragen in hetzelfde gesprek behouden de context uit de geschiedenis.

## Vragen over waarschuwingen

Chat kan vragen beantwoorden over de [waarschuwingen](./alerts-tab.md) die u hebt gedefinieerd:

- **Wat er bestaat** — "welke waarschuwingen heb ik?", "is er een waarschuwing op de factuurworkflow?",
  "welke waarschuwingen worden nu geactiveerd?"
- **Hoe een waarschuwing is ingesteld** — "wat is de drempelwaarde van de kostwaarschuwing?", "hoe is dat geconfigureerd?"
- **Waarom en wanneer deze is geactiveerd** — "waarom is de kostwaarschuwing geactiveerd?", "wanneer is deze voor het laatst getriggerd?"

Voor een vraag als "waarom is deze geactiveerd" leest Chat het activeringsrecord en citeert de daadwerkelijk waargenomen
waarde, de drempelwaarde en het exacte venster dat is geëvalueerd, plus de bijdragende details:
mislukte uitvoerings-id's en foutmeldingen voor foutwaarschuwingen, uitgaven per model voor kostwaarschuwingen, of
de uitsplitsing naar triggerbron voor waarschuwingen op uitvoeringsaantal. Het rapporteert wat waar was toen de waarschuwing
afging in plaats van het venster opnieuw te berekenen, omdat het venster is verstreken en een nieuwe berekening
een ander antwoord kan geven.

## Gebruikersregels

[Gebruikersregels](../reference/user-settings.md) (geconfigureerd in Instellingen) worden automatisch in elk Chat-gesprek geïnjecteerd als instructies op systeemniveau. Stel ze één keer in om persistente voorkeuren toe te passen op alle chatverzoeken.

## Gerelateerd

- [MCP-tabblad](./mcp-tab.md) – Stel deze engine beschikbaar aan MCP-clients als de `heym_chat`-tool
- [Instellingen](../reference/user-settings.md) – Stel Gebruikersregels in die op alle chatverzoeken worden toegepast
- [Tabblad Referenties](./credentials-tab.md) – API-sleutels toevoegen en beheren
- [Tabblad Variabelen](./global-variables-tab.md) – Globale variabelen beschikbaar voor Chat
- [Knooppunttypen](../reference/node-types.md) – LLM- en Agent-knooppunten voor workflows
- [Agent-knooppunt](../nodes/agent-node.md) – AI-agent met tool calling
- [AI-assistent](../reference/ai-assistant.md) – Editor-assistent aangedreven door dezelfde workflow builder DSL
- [Uitvoeringsgeschiedenis](../reference/execution-history.md) – Bekijk eerdere uitvoeringen (knop Geschiedenis in de koptekst)
- [Tabblad Schema's](./scheduled-tab.md) – Kalender van aankomende cron-uitvoeringen (dezelfde gegevens die Chat kan samenvatten)
- [Tabblad Waarschuwingen](./alerts-tab.md) – Drempelwaarschuwingen die Chat kan weergeven en toelichten
- [Contextuele showcase](../reference/contextual-showcase.md) – Compacte oriëntatie in de app voor deze pagina
- [Chat-stem (TTS & STT)](../reference/chat-voice.md) – Lees berichten voor en communiceer handsfree met ElevenLabs

## Tool-aanroepen en contextgrootte

Telkens wanneer de assistent een tool aanroept (een workflow uitvoeren, uitvoeringen weergeven, een nieuwe workflow bouwen), verschijnt een inklapbare kaart in het gesprek. De kaart klapt automatisch uit terwijl de tool wordt uitgevoerd en toont de exacte argumenten. Wanneer de tool klaar is, klapt de kaart in tot een samenvatting van één regel met de verstreken tijd. Klik op een kaart om de argumenten en de samenvatting van het antwoord opnieuw uit te klappen.

Een kleine ringbadge onder het invoerveld toont het huidige contextgebruik als een percentage van het venster van het model (bijv. `12% · ~9.2k`). Beweeg de muis over de badge om een uitsplitsing te zien: systeem-prompt, AGENTS.md, workflows-blok, gebruikersregels, geschiedenis en uw conceptinvoer. Wanneer het gebruik 80% overschrijdt, wordt de ring amberkleurig; bij 95% wordt deze rood.

Als het gebruik de limiet nadert, comprimeert Heym automatisch oudere berichten tot een korte samenvatting met hetzelfde mechanisme dat agent-knooppunten gebruiken. Een kaart "Context gecomprimeerd" verschijnt inline om te tonen wat er is gebeurd.
