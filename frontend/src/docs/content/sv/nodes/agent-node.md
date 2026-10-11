# Agent-nod

**AI Agent**-noden är en LLM-nod med verktygsanrop. Den kan köra Python-verktyg, anropa anslutna canvas-noder som verktyg, ansluta till MCP-servrar, använda skills, valfritt agera som en orkestrerare som delegerar till andra agent-noder, anropa andra workflows som verktyg samt pausa för [mänsklig granskning](../reference/human-in-the-loop.md).

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1, plus valfri `review` när HITL är aktiverat |
| Utdata | `$nodeLabel.text`, `$nodeLabel.fieldName` (när JSON-utdata är aktiverat), eller en väntande HITL-payload medan granskning pågår |

## Kärnparametrar

### Autentiseringsuppgifter och modell

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | LLM-autentiseringsuppgift (API-nyckel) från Inställningar |
| `model` | string | Modellnamn (t.ex. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (valfritt) | Reservautentiseringsuppgift när den primära misslyckas |
| `fallbackModel` | string (valfritt) | Reservmodell när den primära misslyckas |

Autentiseringsuppgifter läggs till i fliken [Autentiseringsuppgifter](../tabs/credentials-tab.md). Modellistan läses in från den valda autentiseringsuppgiften. Om den primära autentiseringsuppgiften eller modellen returnerar ett fel försöker noden automatiskt igen med reservautentiseringsuppgiften och reservmodellen innan den misslyckas.

### Prompts

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `systemInstruction` | string | Systemprompt för AI:n. Stöder [uttryck](../reference/expression-dsl.md). |
| `userMessage` | string | Användarmeddelande/prompt. Standard: `$input.text` |
| `jsonOutputEnabled` | boolean | Strukturerad JSON-utdata |
| `jsonOutputSchema` | string | JSON Schema för strukturerad utdata |
| `extraBodyEnabled` | boolean | Skicka leverantörsspecifika begärandeparametrar (standard: `false`) |
| `extraBody` | string | JSON-objekt som sammanfogas med varje API-begäran agenten gör |

Använd `$input.text`, `$nodeName.field` och annan syntax från [Expression DSL](../reference/expression-dsl.md).

### Reasoning-modeller (o1, o3)

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `temperature` | number | 0,0–2,0 (standard: 0,7), för standardmodeller |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Reasoning-djup för reasoning-modeller |

Vid användning av en reasoning-modell (t.ex. o1, o3) visar gränssnittet **Reasoning Effort** i stället för Temperature. För standardmodeller styr **Temperature** kreativiteten.

**Exempel på JSON-utdata:** När strukturerad data behövs från agenten (t.ex. klassificering, extrahering) aktiveras JSON-utdata och ett schema anges. Agenten returnerar JSON som matchar schemat; fält nås via namn på nodens utdata:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Nedströms noder kan använda `$agentLabel.status`, `$agentLabel.reason` etc. Samma beteende som JSON-utdata för [LLM-noden](../nodes/llm-node.md).

## Mänsklig granskning (HITL)

Använd HITL när en agent kan behöva godkännande vid specifika tillfällen före viktiga åtgärder.

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `hitlEnabled` | boolean | Lägger till kontrollpunkter för mänsklig granskning i agenten |
| `hitlSummary` | string | Riktlinjer för godkännande som talar om för agenten när mänsklig granskning behövs |

När HITL är aktiverat får agenten ett `request_human_review`-verktyg. Använd systemprompten och
detta riktlinjefält för att förklara vilka verktygsanrop, subagenter, subworkflows, MCP-åtgärder, skills
eller sidoeffekter som kräver godkännande. Agenten kan anropa det verktyget endast vid behov, inklusive flera
gånger i en och samma körning.

Den granskarvända sammanfattningen på den publika sidan genereras från agentens granskningsbegäran vid
körning. Om agenten inte uttryckligen anger en sammanfattning härleder Heym en från Markdown-texten
i granskningen.

För MCP-verktyg ber Heym modellen tolka de skrivna HITL-instruktionerna som en av tre
omfattningar: `always`, `once` eller `never`. Det innebär att fritextformuleringar som "för varje anrop", "endast
en gång" eller "fråga aldrig" normaliseras innan körningsbegränsningen tillämpas.

Varje HITL-kontrollpunkt skapar en engångslänk för publik granskning på `/review/{token}`. En granskare kan:

- **Acceptera** den ursprungliga Markdown-texten för granskningen
- **Redigera och fortsätt** med modifierad Markdown
- **Avböja** och fortsätta med `text: ""`

När HITL är aktiverat exponerar noden även ett `review`-utdatahandtag på canvas. Anslut den grenen till Slack, e-post eller andra aviseringsnoder för att sända ut gransknings-URL:en och sammanfattningen så snart körningen pausar.

Körningen övergår till `pending` tills en granskare svarar. Granskningstexten är en enda Markdown-text, och den väntande payloaden innehåller även delbar länktext för extern överlämning. Noder på `review`-grenen körs omedelbart när pausen skapas; den normala utdatavägen fortsätter först efter godkännande. Efter godkännande återupptas körningen från den sparade ögonblicksbilden och agenten fortsätter med det godkända sammanhanget. Om ett senare steg också behöver godkännande kan agenten skapa ytterligare en HITL-kontrollpunkt. Se [Human-in-the-Loop](../reference/human-in-the-loop.md) för payloadens utformning, beteende för gransknings-URL och återupptagandesemantik.

HITL är endast tillgängligt för agentutdata i textläge. I v1 kan det inte kombineras med `jsonOutputEnabled`.
## Orchestrator-läge

När detta är aktiverat kan agenten delegera uppgifter till andra agentnoder i workflowet. Om **Orchestrator-läget är inaktiverat** kan agenten **inte skapa agent→agent-kopplingar** i canvas.

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `isOrchestrator` | boolean | När `true` får agenten ett `call_sub_agent`-verktyg |
| `subAgentLabels` | string[] | Etiketter för agentnoder som denna orchestrator kan anropa |

**Sub-agenter** måste använda `$input.text` i sitt User Message för att ta emot orchestratorns prompt.

När orchestratorn anropar flera sub-agenter i en och samma tur körs de parallellt. Se [Agentarkitektur](../reference/agent-architecture.md) för detaljer.

## Sub-Workflows

När detta är konfigurerat får agenten ett `call_sub_workflow`-verktyg för att köra andra workflows.

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID:n för workflows som denna agent kan anropa som verktyg |

Välj workflows i avsnittet Sub-Workflows i agentkonfigurationen. Agenten anropar dem med `workflow_id` och `inputs` (ett objekt som matchar målworkflowets inmatningsfält). Maxdjup: 5 nästlade sub-workflow-anrop.

## Canvas-nodverktyg

En workflow-nod som stöds kan kopplas till en agents **tools**-handtag så att agenten kan anropa noden vid körning. Detta omvandlar befintliga canvas-åtgärder och -transformer till anropbara verktyg utan att skriva Python.

Använd canvas-nodverktyg när agenten ska avgöra när en konfigurerad nod körs, samtidigt som autentiseringsuppgifter, statiska fält och workflow-specifika inställningar behålls i nodens UI.

### Agent-tillhandahållna fält

Fält på en ansluten verktygsnod kan markeras med botikonen. Markerade fält blir obligatoriska verktygsparametrar som agenten måste tillhandahålla när den anropar noden. Omarkerade fält förblir fasta och läses från nodkonfigurationen.

Till exempel:

- Koppla en Slack-nod till en agent som ett verktyg
- Behåll autentiseringsuppgiften fast i Slack-noden
- Markera `message` som agent-tillhandahållet
- Agenten får ett Slack-verktyg där endast meddelandet tillhandahålls vid körning

Om noden inte är kopplad till en agent som ett verktyg döljs botikonen och noden beter sig som ett vanligt workflow-steg.

### Beteende vid körning

När agenten anropar ett canvas-nodverktyg sammanfogar Heym tillfälligt de agent-tillhandahållna argumenten med nodens data, kör noden, returnerar nodens utdata till agenten och återställer sedan den ursprungliga nodkonfigurationen. Verktygsnoder körs inte som vanliga workflow-steg via normal schemaläggning; de körs endast när agenten anropar dem.

Canvas-nodverktyg är användbara med integrationsnoder som Slack, Telegram, HTTP, Send Email och databearbetande noder som [Set](./set-node.md). Trigger-noder, kontrollflödesnoder och terminala utdatamappare ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) kan inte användas som agentverktyg.

## Python-verktyg

Definiera anpassade verktyg som agenten kan anropa. Varje verktyg har:

| Fält | Typ | Beskrivning |
|-------|------|-------------|
| `name` | string | Verktygsnamn (t.ex. `count_characters`) |
| `description` | string | Beskrivning för LLM:en |
| `parameters` | JSON Schema | OpenAI function-calling-schema (objektformat) |
| `code` | string | Python-funktionskod |

**Parameters** måste vara ett JSON-objekt, inte en sträng:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Exempelverktyg:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python-verktyg körs som ej betrodd kod i en härdad, isolerad Docker-container som standard (inget nätverk, ingen Docker-socket, skrivskyddat filsystem, icke-root). Importer är begränsade till en allowlist med säkra standardbiblioteksmoduler. Se [Säkerhet → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) för konfiguration (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Max antal sekunder per verktygskörning (standard: 30) |
| `requestTimeoutSeconds` | number | Max antal sekunder att vänta på varje modellsvar innan timeout (standard: 60). Höj värdet för långsamma eller egenhostade leverantörer (LiteLLM, vLLM, lokala modeller) och långa flerstegskörningar. |
## MCP-anslutningar

Anslut till [Model Context Protocol](https://modelcontextprotocol.io/)-servrar för att exponera deras verktyg för agenten.

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Anslutningstyp |
| `timeoutSeconds` | number | Timeout för denna anslutning (standard: 30) |
| `label` | string | Valfritt visningsnamn |

**stdio** (lokal process):

| Fält | Beskrivning |
|-------|-------------|
| `command` | Kommando att köra (t.ex. `npx`) |
| `args` | JSON-array (t.ex. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON-objekt med miljövariabler som injiceras i processen (t.ex. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

De flesta stdio-servrar som använder API-nycklar autentiserar via miljövariabler snarare än kommandoparametrar. Ange `env` per anslutning så att varje agentnod kan använda en annan autentiseringsuppgift utan att påverka värdmiljön.

Värden i `env` stöder [Expression DSL](../reference/expression-dsl.md), vilket gör det möjligt att skicka workflow-indata som autentiseringsuppgifter i stället för att hårdkoda hemligheter:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Uttrycket `$userInput.pat` löses upp vid körning mot workflowets indata innan MCP-processen startar. Detta gör det möjligt att ta emot tokens från en trigger eller inmatningsnod i stället för att bädda in dem i workflowdefinitionen.

Exempel — GitHub MCP med hårdkodad token:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Exempel — GitHub MCP med dynamisk token från workflow-indata:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Exempel — GitHub MCP med en Heym GitHub-autentiseringsuppgift:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Den inbyggda GitHub-autentiseringsuppgiften riktar sig för närvarande mot PAT-baserad autentisering. Om åtkomst till en organisation krävs används en PAT med nödvändiga behörigheter för organisationen/repositoriet.

Exempel — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (fjärrserver):

| Fält | Beskrivning |
|-------|-------------|
| `url` | URL till SSE-endpoint. Stöder uttryck (t.ex. `$userInput.serverUrl`). |
| `headers` | JSON-objekt för autentisering/anpassade headers. Värden stöder uttryck. |

**Streamable HTTP** (fjärrserver):

| Fält | Beskrivning |
|-------|-------------|
| `url` | URL till MCP-endpoint (t.ex. `https://example.com/mcp`). Stöder uttryck. |
| `headers` | JSON-objekt för autentisering/anpassade headers. Värden stöder uttryck. |

## Skills

Skills är SKILL.md-instruktioner plus valfria Python-filer och medföljande resurser. De utökar agentens systemkontext och kan lägga till Python-verktyg.

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `name` | string | Skill-namn |
| `content` | string | SKILL.md-innehåll (instruktioner) |
| `timeoutSeconds` | number | Timeout för skillens Python-körning (standard: 30) |
| `driveFilesEnabled` | boolean | Aktiverar runtime-hjälparen `heym_drive` för denna skill (standard: false) |
| `files` | array | Valfria poster `{ path, content, encoding, mimeType }` (t.ex. `.py`-skript eller binära resurser lagrade som base64) |

Skills kan läggas till genom att släppa en `.zip`- eller `.md`-fil i Skills-området.
Efter att ett skill-kort har expanderats kan valfri fil släppas på skillen för att bifoga eller ersätta en medföljande fil, inklusive binära resurser som PDF-filer och bilder.
Använd nedladdningsknappen på ett skill-kort för att exportera skillen som ett `.zip`-arkiv för säkerhetskopiering eller återanvändning i ett annat workflow.

Aktivera **Drive files** på en skill endast när dess Python-kod behöver läsa filer från Heym Drive. Aktiverade skills får en genererad `heym_drive.py`-hjälpare vid körning och kan anropa `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` eller `read_drive_base64` med ett Drive-fil-id eller ett exakt filnamn. Filnamnssökning använder den nyaste tillgängliga träffen. Inaktiverade skills får inte hjälparen.

Varje skill-kort har fyra åtgärder på raden under titeln:

| Knapp | Beskrivning |
|--------|-------------|
| **Edit with AI** | Öppna Skill Builder för att revidera skillen från en chat-prompt |
| **Download** | Exportera skillen som ett `.zip`-arkiv |
| **Remove** | Ta bort skillen från denna agentnod |
| **History** | Öppna skill-historik härledd från [Edit History](../reference/edit-history.md) |
### Skill-historik

Skill-historik lagras **inte** separat. Den härleds från snapshots i workflowets redigeringshistorik: varje sparad workflow-version innehåller agentnodens fullständiga `skills`-array.

I dialogrutan Historik går det att:

- **Förhandsgranska** ett tidigare snapshot (SKILL.md och fillista)
- **Redigera** — läsa in ett snapshot i skill-redigeraren utan att återställa hela workflowet
- **AI-finjustering** — öppna Skill Builder med det snapshottet som utgångspunkt
- **Återställa** — återställa endast denna skill från en tidigare version (övriga noder förblir oförändrade)

Historiken följer samma 7-dagarslagring som workflowets redigeringshistorik. När workflowet sparas efter skill-redigeringar skapas nya historikposter.

Avsnittet Skills innehåller även **AI Build**:

- Klicka på **AI Build** för att skapa en ny skill från en chat-prompt
- Klicka på gnist-knappen på en befintlig skill för att revidera den med AI
- Släpp filer i promptfältet för att bifoga dem till finjusteringskommentaren; dessa filer sparas även som medföljande skill-tillgångar
- Modalen strömmar assistenttext medan förhandsgranskningar av `SKILL.md` och `.py`-filer visas live
- **Download ZIP** exporterar den aktuella förhandsgranskningen utan att lägga till den i noden
- **Save & Add** sparar de genererade filerna via samma ZIP-tolkningsflöde som används vid manuella uppladdningar

Vid redigering med AI skickar Heym endast textbaserade `.md`- och `.py`-skill-filer till byggaren. Binära och andra icke-redigerbara bilagor bevaras och delas med byggaren som sökvägsmetadata, så att genererad Python-kod kan behålla korrekta relativa filreferenser.
Välj en bifogad fil i den högra panelen och aktivera **Include this file in AI context** när AI:n behöver granska en medföljande mall. Text-, PDF- och DOCX-filer extraheras till promptkontexten när det är möjligt; Heym tillämpar ingen separat storleksgräns för Skill Builder-bilagor utöver plattformens gräns för förfrågningskroppen.

## Extra Body

Vissa leverantörer accepterar förfrågningsparametrar som de standardiserade OpenAI-kompatibla fälten inte täcker, till exempel att inaktivera en modells tankeläge. Markera **Send extra request body** i nodegenskaperna och ange ett JSON-objekt.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Inaktiverat som standard.** Med kryssrutan avmarkerad skickas inget extra.
- Tillämpas på **varje** förfrågan i verktygsanropsloopen, inte bara första turen, samt på försöket med reservmodellen. Tillämpas inte på guardrail-kontroller, som använder en separat modell.
- Måste vara ett JSON-**objekt**. En array, en skalär eller felformad text gör att noden misslyckas med `Invalid extra body JSON` i stället för att tyst ignoreras.
- `$`-uttryck löses upp före tolkning. Eftersom detta är textuell substitution producerar ett upplöst värde som innehåller ett citattecken eller en radbrytning ogiltig JSON och gör att noden misslyckas.

Samma fält och beteende som extra body för [LLM-noden](./llm-node.md).

## Guardrails

Aktivera **Guardrails** i nodegenskaperna för att blockera osäkra användarmeddelanden innan agenten körs. Se [Guardrails](../reference/guardrails.md) för fullständig referens.

## Persistent minne (graf)

Valfri **per-agentnod**-kunskapsgraf som lagras i databasen. När den är aktiverad lägger Heym till en Markdown-sammanfattning av ihågkomna entiteter och relationer i **systeminstruktionen** före varje körning (endast om grafen är icke-tom). Efter en **lyckad** agentkörning extraherar ett bakgrundsjobb nya varaktiga fakta från konversationen och sammanfogar dem i grafen.

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Aktivera inläsning + bakgrundsextrahering för denna canvas-nod |

**Sub-agenter** behåller sin **egen** graf (nycklad efter sin nod-id), separat från orkestreraren.

Använd den rosa **hjärn**-kontrollen på noden (när minnet är på eller modellraden visas) för att öppna grafredigeraren och valfri **minnesdelning** (andra workflows/agenter). Fullständigt beteende, REST-sökvägar och information om JSON-export: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API och resonemangskontinuitet

En kryssruta **Use Responses API** dirigerar agentens modellanrop genom
[Responses API](https://platform.openai.com/docs/api-reference/responses) i stället för Chat
Completions. Den är avstängd som standard.

Den har störst betydelse för en resonemangsmodell som `gpt-5` eller `o`-serien. Responses API returnerar modellens resonemang tillsammans med varje verktygsanrop, och agenten matar tillbaka dessa resonemangsobjekt vid nästa tur, så att modellen behåller sin tankekedja genom en flerstegs verktygsloop i stället för att härleda den på nytt efter varje verktygsresultat. Hela loopen körs på samma sökväg, inklusive
[human review](#human-review-hitl) paus och återupptagning, [kontextkomprimering](#context-compression),
och det slutliga svaret.

Själva konversationen stannar i Heym. Heym skickar hela indata vid varje tur och bär resonemanget som en krypterad blob, så inget behålls på leverantörens sida mellan anrop.
Resonemangsobjekt inom ett spann som kontextkomprimeringen sammanfattar tas bort tillsammans med det, eftersom en krypterad blob inte kan sammanfattas.

Det fungerar med en OpenAI-autentiseringsuppgift, och med en anpassad autentiseringsuppgift vars gateway stöder endpointen. Med en Google-autentiseringsuppgift förblir det inaktiverat.
## Kontextkomprimering

När en agent kör många verktygsiterationer med stora resultat (webbskrapning, dokumentläsning, utdata från under-workflows) kan den ackumulerade meddelandehistoriken närma sig modellens gräns för kontextfönstret. Heym komprimerar automatiskt konversationshistoriken under körningen för att förhindra kontextöverskridande.

**Så fungerar det:**

1. Före varje verktygsiteration uppskattar Heym det aktuella tokenantalet (~4 tecken per token).
2. Om uppskattningen överstiger **80 %** av modellens kontextfönster utlöses komprimering.
3. Meddelandehistoriken delas upp i bevarade och komprimerade avsnitt:
   - **Bevarat**: system-prompt, första användarmeddelandet, senaste användarmeddelandet
   - **Komprimerat**: allt däremellan (assistentens resonemangssteg, verktygsanrop, verktygsresultat)
4. Det mellersta avsnittet sammanfattas med **samma modell och autentiseringsuppgift** – ingen ytterligare konfiguration krävs.
5. Den komprimerade sammanfattningen ersätter det mellersta avsnittet som ett enda assistentmeddelande.

**Observerbarhet:**

Komprimeringshändelser visas som `Context compressed (N messages → summary)`-poster i:
- **Debug-panelens** verktygsanropslista under live-körning
- **Körningshistorikens** detaljvy för körningar
- **Fliken Traces** som en `context.compression`-trace-post

Komprimering är automatiskt och alltid aktivt för Agent-noder. Det gäller **inte** för LLM-noder, fliken Chat eller AI Assistant-sessioner.

## Relaterat

- [Varför Heym](../getting-started/why-heym.md) – Hur agenter körs och förblir styrda i produktion
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – Kunskapsgraf per agent-nod, valfri delning, API, redigerare
- [Agent-arkitektur](../reference/agent-architecture.md) – Under-agenter, orkestrerare, skills, MCP, verktygsanrop
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Offentliga granskningssidor, väntande körningar, flöde för godkännande/redigering/avslag
- [Guardrails](../reference/guardrails.md) – Blockera osäkra innehållskategorier
- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [AI Assistant](../reference/ai-assistant.md) – Chat-gränssnitt för att bygga workflows med naturligt språk (skilt från Agent-noden)
- [Expression DSL](../reference/expression-dsl.md) – Referera till data i prompts
- [Workflow-struktur](../reference/workflow-structure.md) – Noder, kanter och DSL-format
- [Snabbstart](../getting-started/quick-start.md) – Grundläggande workflow med LLM och uttryck
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till API-nycklar för agenten
- [Fliken MCP](../tabs/mcp-tab.md) – Konfigurera MCP för workflow-verktyg
