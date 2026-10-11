# Agent-node

De **AI Agent**-node is een LLM-node met tool calling. Deze kan Python-tools uitvoeren, verbonden canvas-nodes als tools aanroepen, verbinding maken met MCP-servers, skills gebruiken, optioneel fungeren als orchestrator die delegeert naar andere agent-nodes, andere workflows als tools aanroepen en pauzeren voor [menselijke beoordeling](../reference/human-in-the-loop.md).

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1, plus optioneel `review` wanneer HITL is ingeschakeld |
| Uitvoer | `$nodeLabel.text`, `$nodeLabel.fieldName` (wanneer JSON-uitvoer is ingeschakeld), of een wachtende HITL-payload tijdens het wachten op beoordeling |

## Kernparameters

### Referentie en model

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | LLM-referentie (API-sleutel) uit Instellingen |
| `model` | string | Modelnaam (bijv. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (optioneel) | Fallback-referentie wanneer de primaire faalt |
| `fallbackModel` | string (optioneel) | Fallback-model wanneer de primaire faalt |

Voeg referenties toe in het tabblad [Referenties](../tabs/credentials-tab.md). De modellenlijst wordt geladen vanuit de geselecteerde referentie. Als de primaire referentie of het primaire model een fout retourneert, probeert de node automatisch opnieuw met de fallback-referentie en het fallback-model voordat deze faalt.

### Prompts

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `systemInstruction` | string | Systeem-prompt voor de AI. Ondersteunt [expressies](../reference/expression-dsl.md). |
| `userMessage` | string | Gebruikersbericht/prompt. Standaard: `$input.text` |
| `jsonOutputEnabled` | boolean | Gestructureerde JSON-uitvoer |
| `jsonOutputSchema` | string | JSON Schema voor gestructureerde uitvoer |
| `extraBodyEnabled` | boolean | Verzend provider-specifieke request-parameters (standaard: `false`) |
| `extraBody` | string | JSON-object dat wordt samengevoegd in elk API-request dat de agent doet |

Gebruik `$input.text`, `$nodeName.field` en andere [Expression DSL](../reference/expression-dsl.md)-syntaxis.

### Reasoning-modellen (o1, o3)

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (standaard: 0.7), voor standaardmodellen |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Reasoning-diepte voor reasoning-modellen |

Bij gebruik van een reasoning-model (bijv. o1, o3) toont de UI **Reasoning Effort** in plaats van Temperature. Voor standaardmodellen bepaalt **Temperature** de creativiteit.

**JSON-uitvoervoorbeeld:** Wanneer u gestructureerde gegevens van de agent nodig hebt (bijv. classificatie, extractie), schakelt u JSON-uitvoer in en geeft u een schema op. De agent retourneert JSON die overeenkomt met het schema; toegang tot velden op naam via de node-uitvoer:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Stroomafwaartse nodes kunnen `$agentLabel.status`, `$agentLabel.reason`, enz. gebruiken. Zelfde gedrag als de JSON-uitvoer van de [LLM-node](../nodes/llm-node.md).

## Menselijke beoordeling (HITL)

Gebruik HITL wanneer een agent op specifieke momenten goedkeuring nodig kan hebben voordat belangrijke acties worden uitgevoerd.

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Voegt controlepunten voor menselijke beoordeling toe aan de agent |
| `hitlSummary` | string | Goedkeuringsrichtlijnen die de agent vertellen wanneer menselijke beoordeling nodig is |

Wanneer HITL is ingeschakeld, ontvangt de agent een `request_human_review`-tool. Gebruik de systeem-prompt en dit richtlijnenveld om uit te leggen welke tool-aanroepen, sub-agents, sub-workflows, MCP-acties, skills of neveneffecten goedkeuring vereisen. De agent kan die tool alleen aanroepen wanneer nodig, inclusief meerdere keren in één uitvoering.

De samenvatting voor de beoordelaar op de openbare pagina wordt tijdens runtime gegenereerd op basis van het beoordelingsverzoek van de agent. Als de agent geen samenvatting expliciet opgeeft, leidt Heym er een af uit de Markdown-beoordelingstekst.

Voor MCP-tools vraagt Heym het model om uw geschreven HITL-instructies te interpreteren als een van drie scopes: `always`, `once` of `never`. Dat betekent dat vrije formuleringen zoals "voor elke aanroep", "slechts één keer" of "nooit vragen" worden genormaliseerd voordat runtime-gating wordt toegepast.

Elk HITL-controlepunt maakt een eenmalige openbare beoordelingslink aan op `/review/{token}`. Een beoordelaar kan:

- **Accepteren** — de oorspronkelijke Markdown-beoordelingstekst
- **Bewerken en doorgaan** — met aangepaste Markdown
- **Weigeren** — en doorgaan met `text: ""`

Wanneer HITL is ingeschakeld, toont de node ook een `review`-uitvoerhandle op het canvas. Verbind die vertakking met Slack, e-mail of andere notificatie-nodes als u de beoordelings-URL en samenvatting wilt uitzenden zodra de uitvoering pauzeert.

De uitvoering gaat naar `pending` totdat een beoordelaar reageert. De beoordelingstekst is één Markdown-body en de wachtende payload bevat ook deelbare linktekst voor externe overdracht. Nodes op de `review`-vertakking worden onmiddellijk uitgevoerd wanneer de pauze wordt aangemaakt; het normale uitvoerpad gaat pas verder na goedkeuring. Na goedkeuring hervat Heym vanuit de opgeslagen uitvoeringssnapshot en gaat de agent verder met de goedgekeurde context. Als een latere stap ook goedkeuring vereist, kan de agent een nieuw HITL-controlepunt aanmaken. Zie [Human-in-the-Loop](../reference/human-in-the-loop.md) voor de payload-vorm, het gedrag van de beoordelings-URL en de hervattingssemantiek.

HITL is alleen beschikbaar voor agent-uitvoer in tekstmodus. In v1 kan het niet worden gecombineerd met `jsonOutputEnabled`.
## Orchestrator-modus

Indien ingeschakeld kan de agent taken delegeren aan andere agent-nodes in de workflow. Als **Orchestrator-modus is uitgeschakeld**, kan de agent **geen agent→agent-verbindingen maken** op het canvas.

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Indien `true`, ontvangt de agent een `call_sub_agent`-tool |
| `subAgentLabels` | string[] | Labels van agent-nodes die deze orchestrator kan aanroepen |

**Sub-agents** moeten `$input.text` gebruiken in hun User Message, zodat zij de prompt van de orchestrator ontvangen.

Wanneer de orchestrator meerdere sub-agents in één beurt aanroept, worden deze parallel uitgevoerd. Zie [Agent-architectuur](../reference/agent-architecture.md) voor details.

## Sub-workflows

Indien geconfigureerd ontvangt de agent een `call_sub_workflow`-tool om andere workflows uit te voeren.

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID's van workflows die deze agent als tools kan aanroepen |

Selecteer workflows in de sectie Sub-workflows van de agentconfiguratie. De agent roept deze aan met `workflow_id` en `inputs` (object dat overeenkomt met de invoervelden van de doelworkflow). Maximale diepte: 5 geneste sub-workflow-aanroepen.

## Canvas-node-tools

U kunt een ondersteunde workflow-node verbinden met de **tools**-handle van een agent, zodat de agent die node tijdens runtime kan aanroepen. Hiermee worden bestaande canvas-acties en -transformaties omgezet in aanroepbare tools zonder Python te schrijven.

Gebruik canvas-node-tools wanneer u wilt dat de agent bepaalt wanneer een geconfigureerde node wordt uitgevoerd, terwijl referenties, statische velden en workflowspecifieke instellingen in de node-UI behouden blijven.

### Door de agent aangeleverde velden

Velden op een verbonden tool-node kunnen worden gemarkeerd met het bot-pictogram. Gemarkeerde velden worden verplichte tool-parameters die de agent moet aanleveren wanneer deze de node aanroept. Niet-gemarkeerde velden blijven vast en worden gelezen uit de nodeconfiguratie.

Bijvoorbeeld:

- Verbind een Slack-node als tool met een agent
- Houd de referentie vast in de Slack-node
- Markeer `message` als door de agent aangeleverd
- De agent ontvangt een Slack-tool waarbij deze tijdens runtime alleen het bericht aanlevert

Als de node niet als tool met een agent is verbonden, is het bot-pictogram verborgen en gedraagt de node zich als een normale workflowstap.

### Runtime-gedrag

Wanneer de agent een canvas-node-tool aanroept, voegt Heym de door de agent aangeleverde argumenten tijdelijk samen met de data van die node, voert de node uit, retourneert de node-uitvoer aan de agent en herstelt vervolgens de oorspronkelijke nodeconfiguratie. Tool-nodes worden niet als reguliere workflowstappen via normale planning uitgevoerd; zij worden alleen uitgevoerd wanneer de agent ze aanroept.

Canvas-node-tools zijn nuttig in combinatie met integratienodes zoals Slack, Telegram, HTTP, Send Email en datavormgevende nodes zoals [Set](./set-node.md). Trigger-nodes, control-flow-nodes en terminale output-mappers ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) kunnen niet als agent-tools worden gebruikt.

## Python-tools

Definieer aangepaste tools die de agent kan aanroepen. Elke tool heeft:

| Veld | Type | Beschrijving |
|-------|------|-------------|
| `name` | string | Toolnaam (bijv. `count_characters`) |
| `description` | string | Beschrijving voor de LLM |
| `parameters` | JSON Schema | OpenAI function-calling-schema (objectformaat) |
| `code` | string | Python-functiecode |

**Parameters** moeten een JSON-object zijn, geen string:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Voorbeeldtool:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python-tools worden standaard uitgevoerd als niet-vertrouwde code in een gehardende, geïsoleerde Docker-container (geen netwerk, geen Docker-socket, alleen-lezen bestandssysteem, niet-root). Imports zijn beperkt tot een allowlist van veilige standaardbibliotheekmodules. Zie [Beveiliging → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) voor configuratie (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Maximaal aantal seconden per tooluitvoering (standaard: 30) |
| `requestTimeoutSeconds` | number | Maximaal aantal seconden om op elke modelrespons te wachten voordat een timeout optreedt (standaard: 60). Verhoog deze waarde voor trage of zelfgehoste providers (LiteLLM, vLLM, lokale modellen) en langdurige meerstapsuitvoeringen. |
## MCP-verbindingen

Verbind met [Model Context Protocol](https://modelcontextprotocol.io/)-servers om hun tools beschikbaar te stellen aan de agent.

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Verbindingstype |
| `timeoutSeconds` | number | Timeout voor deze verbinding (standaard: 30) |
| `label` | string | Optionele weergavenaam |

**stdio** (lokaal proces):

| Veld | Beschrijving |
|-------|-------------|
| `command` | Uit te voeren opdracht (bijv. `npx`) |
| `args` | JSON-array (bijv. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON-object met omgevingsvariabelen die in het proces worden geïnjecteerd (bijv. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

De meeste stdio-servers met API-sleutels authenticeren via omgevingsvariabelen in plaats van opdrachtargumenten. Stel `env` per verbinding in, zodat elke agent-node een andere referentie kan gebruiken zonder de omgeving van de host aan te passen.

`env`-waarden ondersteunen [Expression DSL](../reference/expression-dsl.md), zodat u workflow-invoer als referenties kunt doorgeven in plaats van geheimen hard te coderen:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

De expressie `$userInput.pat` wordt tijdens runtime opgelost tegen de invoergegevens van de workflow voordat het MCP-proces start. Hierdoor kunt u tokens accepteren vanuit een trigger of invoer-node in plaats van ze in de workflowdefinitie op te nemen.

Voorbeeld — GitHub MCP met hardgecodeerd token:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Voorbeeld — GitHub MCP met dynamisch token uit workflow-invoer:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Voorbeeld — GitHub MCP met een Heym GitHub-referentie:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

De ingebouwde GitHub-referentie is momenteel gericht op authenticatie op basis van PAT. Als u toegang tot een organisatie nodig hebt, gebruik dan een PAT met de vereiste organisatie-/repositorymachtigingen.

Voorbeeld — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (externe server):

| Veld | Beschrijving |
|-------|-------------|
| `url` | SSE-endpoint-URL. Ondersteunt expressies (bijv. `$userInput.serverUrl`). |
| `headers` | JSON-object voor authenticatie-/aangepaste headers. Waarden ondersteunen expressies. |

**Streamable HTTP** (externe server):

| Veld | Beschrijving |
|-------|-------------|
| `url` | MCP-endpoint-URL (bijv. `https://example.com/mcp`). Ondersteunt expressies. |
| `headers` | JSON-object voor authenticatie-/aangepaste headers. Waarden ondersteunen expressies. |

## Skills

Skills zijn SKILL.md-instructies plus optionele Python-bestanden en meegeleverde assets. Ze breiden de systeemcontext van de agent uit en kunnen Python-tools toevoegen.

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `name` | string | Naam van de skill |
| `content` | string | SKILL.md-inhoud (instructies) |
| `timeoutSeconds` | number | Timeout voor Python-uitvoering van de skill (standaard: 30) |
| `driveFilesEnabled` | boolean | Schakelt de runtime-helper `heym_drive` voor deze skill in (standaard: false) |
| `files` | array | Optionele `{ path, content, encoding, mimeType }`-items (bijv. `.py`-scripts of binaire assets opgeslagen als base64) |

Skills kunnen worden toegevoegd door een `.zip`- of `.md`-bestand naar het Skills-gebied te slepen.
Nadat u een skill-kaart hebt uitgevouwen, kunt u een bestand naar die skill slepen om een meegeleverd bestand toe te voegen of te vervangen, inclusief binaire assets zoals PDF's en afbeeldingen.
Gebruik de downloadknop op een skill-kaart om die skill als `.zip`-archief te exporteren voor back-up of hergebruik in een andere workflow.

Schakel **Drive files** alleen in voor een skill wanneer de Python-code ervan bestanden uit Heym Drive moet lezen. Ingeschakelde skills ontvangen tijdens runtime een gegenereerde `heym_drive.py`-helper en kunnen `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` of `read_drive_base64` aanroepen met een Drive-bestands-id of exacte bestandsnaam. Opzoeken op bestandsnaam gebruikt de nieuwste toegankelijke overeenkomst. Uitgeschakelde skills ontvangen de helper niet.

Elke skill-kaart heeft vier acties op de rij onder de titel:

| Knop | Beschrijving |
|--------|-------------|
| **Edit with AI** | Opent Skill Builder om de skill te herzien op basis van een chat-prompt |
| **Download** | Exporteert de skill als een `.zip`-archief |
| **Remove** | Verwijdert de skill van deze agent-node |
| **History** | Opent de skill-geschiedenis afgeleid van [Edit History](../reference/edit-history.md) |
### Skill-geschiedenis

De Skill-geschiedenis wordt **niet** apart opgeslagen. Deze wordt afgeleid uit snapshots van de Geschiedenis van workflowbewerkingen: elke opgeslagen workflowversie bevat de volledige `skills`-array van de agent-node.

In het dialoogvenster Geschiedenis kunt u:

- **Preview** — een eerdere snapshot bekijken (SKILL.md en bestandenlijst)
- **Edit** — een snapshot in de skill-editor laden zonder de hele workflow terug te draaien
- **AI Fine-tune** — Skill Builder openen met die snapshot als startpunt
- **Revert** — alleen deze skill herstellen vanuit een eerdere versie (andere nodes blijven ongewijzigd)

De geschiedenis volgt dezelfde bewaartermijn van 7 dagen als de Geschiedenis van workflowbewerkingen. Het opslaan van de workflow na skill-bewerkingen maakt nieuwe geschiedenisvermeldingen aan.

De sectie Skills bevat ook **AI Build**:

- Klik op **AI Build** om een nieuwe skill te maken vanuit een chat-prompt
- Klik op de sparkle-knop bij een bestaande skill om deze met AI te herzien
- Sleep bestanden naar de prompt-composer om ze als bijlage aan de fine-tune-opmerking toe te voegen; die bestanden worden ook opgeslagen als meegeleverde skill-assets
- De modal streamt assistenttekst terwijl live previews van `SKILL.md`- en `.py`-bestanden worden getoond
- **Download ZIP** exporteert de huidige preview zonder deze aan de node toe te voegen
- **Save & Add** slaat de gegenereerde bestanden op via dezelfde ZIP-verwerkingsflow die bij handmatige uploads wordt gebruikt

Bij het bewerken met AI stuurt Heym alleen tekstuele `.md`- en `.py`-skillbestanden naar de builder. Binaire en andere niet-bewerkbare bijlagen blijven behouden en worden als padmetadata met de builder gedeeld, zodat gegenereerde Python-code relatieve bestandsverwijzingen correct kan houden.
Selecteer een bijgevoegd bestand in het rechterpaneel en schakel **Include this file in AI context** in wanneer de AI een meegeleverd sjabloon moet inspecteren. Tekst-, PDF- en DOCX-bestanden worden waar mogelijk in de prompt-context geëxtraheerd; Heym past geen aparte limiet voor de bijlagengrootte van Skill Builder toe naast de limiet voor de aanvraagbody van het platform.

## Extra Body

Sommige providers accepteren aanvraagparameters die de standaard OpenAI-compatibele velden niet
dekken, zoals het uitschakelen van de denkmodus van een model. Vink **Send extra request body** aan in de node-
eigenschappen en voer een JSON-object in.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Standaard uitgeschakeld.** Met het selectievakje uit wordt niets extra's verzonden.
- Toegepast op **elke** aanvraag in de tool-calling-lus, niet alleen de eerste beurt, plus de
  fallback-poging van het model. Niet toegepast op guardrail-controles, die een apart model gebruiken.
- Moet een JSON-**object** zijn. Een array, een scalair of ongeldige tekst laat de node mislukken met
  `Invalid extra body JSON` in plaats van stilzwijgend te worden genegeerd.
- `$`-expressies worden vóór het parsen opgelost. Omdat dit tekstuele substitutie is, levert een opgeloste
  waarde met een dubbele aanhalingsteken of een nieuwe regel ongeldige JSON op en laat de node mislukken.

Hetzelfde veld en gedrag als de extra body van de [LLM-node](./llm-node.md).

## Guardrails

Schakel **Guardrails** in bij de node-eigenschappen om onveilige gebruikersberichten te blokkeren voordat de agent wordt uitgevoerd. Zie [Guardrails](../reference/guardrails.md) voor de volledige referentie.

## Persistent memory (graph)

Optionele **per-agent-node** knowledge graph die in de database wordt opgeslagen. Indien ingeschakeld, voegt Heym vóór elke uitvoering een Markdown-samenvatting van onthouden entiteiten en relaties toe aan de **system instruction** (alleen als de graph niet leeg is). Na een **geslaagde** agent-voltooiing extraheert een achtergrondtaak nieuwe duurzame feiten uit het gesprek en voegt deze samen in de graph.

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Laad- en achtergrondextractie voor deze canvas-node inschakelen |

**Sub-agents** behouden hun **eigen** graph (gekoppeld aan hun node-id), gescheiden van de orchestrator.

Gebruik de roze **brain**-bediening op de node (wanneer geheugen aan staat of de modelrij wordt getoond) om de graph-editor en optionele **memory sharing** (andere workflows/agents) te openen. Volledig gedrag, REST-paden en JSON-exportdetails: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API en reasoning-continuïteit

Een selectievakje **Use Responses API** leidt de modelaanroepen van de agent via de
[Responses API](https://platform.openai.com/docs/api-reference/responses) in plaats van Chat
Completions. Het staat standaard uit.

Het is het belangrijkst bij een reasoning-model zoals `gpt-5` of de `o`-serie. De Responses API retourneert
de reasoning van het model naast elke tool-aanroep, en de agent voert die reasoning-items weer in bij
de volgende beurt, zodat het model zijn chain of thought behoudt gedurende een meerstaps tool-lus in plaats van
deze na elk tool-resultaat opnieuw af te leiden. De hele lus verloopt via hetzelfde pad, inclusief
[human review](#human-review-hitl) pauzeren en hervatten, [context compression](#context-compression),
en het uiteindelijke antwoord.

Het gesprek zelf blijft in Heym. Heym verzendt bij elke beurt de volledige invoer en draagt de
reasoning als een versleutelde blob met zich mee, zodat er niets aan de zijde van de provider tussen aanroepen wordt bewaard.
Reasoning-items binnen een span die context compression samenvat, worden daarmee samen verwijderd, aangezien
een versleutelde blob niet kan worden samengevat.

Het werkt met een OpenAI-referentie, en met een aangepaste referentie waarvan de gateway het
endpoint ondersteunt. Met een Google-referentie blijft het uitgeschakeld.
## Contextcompressie

Wanneer een agent vele tool-iteraties uitvoert met grote resultaten (webscraping, documentlezingen, uitvoer van sub-workflows), kan de opgebouwde berichtgeschiedenis de context window-limiet van het model naderen. Heym comprimeert de gespreksgeschiedenis automatisch tijdens de uitvoering om contextoverloop te voorkomen.

**Hoe het werkt:**

1. Vóór elke tool-iteratie schat Heym het huidige tokenaantal (~4 tekens per token).
2. Als de schatting **80%** van de context window van het model overschrijdt, wordt compressie geactiveerd.
3. De berichtgeschiedenis wordt opgesplitst in behouden en gecomprimeerde secties:
   - **Behouden**: system prompt, eerste gebruikersbericht, meest recente gebruikersbericht
   - **Gecomprimeerd**: alles daartussen (assistent-redeneerstappen, tool-aanroepen, tool-resultaten)
4. De middelste sectie wordt samengevat met het **zelfde model en dezelfde referentie** — geen extra configuratie nodig.
5. De gecomprimeerde samenvatting vervangt het midden als één enkel assistent-bericht.

**Observeerbaarheid:**

Compressiegebeurtenissen verschijnen als `Context compressed (N messages → summary)`-vermeldingen in:
- De **Debug panel**-toolaanroeplijst tijdens live uitvoering
- De **Uitvoeringsgeschiedenis**-run-detailweergave
- Het **Traces-tabblad** als een `context.compression`-tracevermelding

Compressie is automatisch en altijd actief voor Agent-nodes. Het is **niet** van toepassing op LLM-nodes, het Chat-tabblad of AI Assistant-sessies.

## Gerelateerd

- [Waarom Heym](../getting-started/why-heym.md) – Hoe agents draaien en beheerd blijven in productie
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – Kennisgraaf per agent-node, optionele deling, API, editor
- [Agent-architectuur](../reference/agent-architecture.md) – Sub-agents, orchestrator, skills, MCP, tool calling
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Openbare beoordelingspagina's, wachtende uitvoeringen, goedkeuren/bewerken/weigeren-flow
- [Guardrails](../reference/guardrails.md) – Onveilige inhoudscategorieën blokkeren
- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [AI Assistant](../reference/ai-assistant.md) – Chat-UI voor het bouwen van workflows met natuurlijke taal (verschilt van de Agent-node)
- [Expression DSL](../reference/expression-dsl.md) – Gegevens refereren in prompts
- [Workflow-structuur](../reference/workflow-structure.md) – Nodes, edges en DSL-formaat
- [Quick Start](../getting-started/quick-start.md) – Basisworkflow met LLM en expressies
- [Referenties-tabblad](../tabs/credentials-tab.md) – API-sleutels toevoegen voor de agent
- [MCP-tabblad](../tabs/mcp-tab.md) – MCP configureren voor workflow-tools
