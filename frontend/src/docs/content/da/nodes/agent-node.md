# Agent Node

**AI Agent**-noden er en LLM-node med tool calling-funktionalitet. Den kan køre Python-værktøjer, kalde tilsluttede canvas-noder som værktøjer, forbinde til MCP-servere, bruge færdigheder, eventuelt fungere som en orchestrator, der delegerer til andre agent-noder, kalde andre workflows som værktøjer og pause til [menneskelig gennemgang](../reference/human-in-the-loop.md).

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1, plus valgfri `review`, når HITL er aktiveret |
| Output | `$nodeLabel.text`, `$nodeLabel.fieldName` (når JSON-output er aktiveret), eller en afventende HITL-payload, mens der ventes på gennemgang |

## Kerneparametre

### Legitimationsoplysninger & Model

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | LLM-legitimationsoplysninger (API-nøgle) fra Indstillinger |
| `model` | string | Modelnavn (f.eks. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (valgfri) | Fallback-legitimationsoplysninger, når den primære fejler |
| `fallbackModel` | string (valgfri) | Fallback-model, når den primære fejler |

Legitimationsoplysninger tilføjes under fanen [Legitimationsoplysninger](../tabs/credentials-tab.md). Modellisten indlæses fra de valgte legitimationsoplysninger. Hvis den primære legitimationsoplysninger eller model returnerer en fejl, forsøger noden automatisk med fallback-legitimationsoplysningerne og modellen, før den fejler.

### Prompts

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `systemInstruction` | string | Systemprompt til AI'en. Understøtter [udtryk](../reference/expression-dsl.md). |
| `userMessage` | string | Brugerbesked/prompt. Standard: `$input.text` |
| `jsonOutputEnabled` | boolean | Struktureret JSON-output |
| `jsonOutputSchema` | string | JSON Schema for struktureret output |
| `extraBodyEnabled` | boolean | Send providerspecifikke anmodningsparametre (standard: `false`) |
| `extraBody` | string | JSON-objekt, der flettes ind i hver API-anmodning, som agenten foretager |

Brug `$input.text`, `$nodeName.field` og anden [Expression DSL](../reference/expression-dsl.md)-syntaks.

### Ræsonneringsmodeller (o1, o3)

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `temperature` | tal | 0.0–2.0 (standard: 0.7), for standardmodeller |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Ræsonneringsdybde for ræsonneringsmodeller |

Når der bruges en ræsonneringsmodel (f.eks. o1, o3), viser brugergrænsefladen **Reasoning Effort** i stedet for Temperature. For standardmodeller styrer **Temperature** kreativiteten.

**JSON-output eksempel:** Når der er behov for struktureret data fra agenten (f.eks. klassifikation, ekstraktion), aktiveres JSON-output og der angives et schema. Agenten returnerer JSON, der matcher schemat; felterne tilgås ved navn på node-output:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Downstream-noder kan bruge `$agentLabel.status`, `$agentLabel.reason` osv. Samme adfærd som [LLM-node](../nodes/llm-node.md)s JSON-output.

## Menneskelig gennemgang (HITL)

Brug HITL, når en agent muligvis har brug for godkendelse på specifikke tidspunkter før vigtige handlinger.

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Tilføjer menneskelige gennemgangskontrolpunkter til agenten |
| `hitlSummary` | string | Godkendelsesretningslinjer, der fortæller agenten, hvornår menneskelig gennemgang er nødvendig |

Når HITL er aktiveret, modtager agenten et `request_human_review`-værktøj. Brug systemprompten og dette retningslinjefelt til at forklare, hvilke tool calls, sub-agenter, sub-workflows, MCP-handlinger, færdigheder eller sideeffekter, der kræver godkendelse. Agenten kan kun kalde det værktøj, når det er nødvendigt, inklusive flere gange i én kørsel.

Den gennemgangsorienterede oversigt på den offentlige side genereres fra agentens gennemgangsanmodning ved kørselstidspunktet. Hvis agenten ikke eksplicit angiver en oversigt, udleder Heym en fra Markdown-gennemgangsteksten.

For MCP-værktøjer beder Heym modellen om at fortolke de skrevne HITL-instruktioner som en af tre scopes: `always`, `once` eller `never`. Det betyder, at fri formulering såsom "for each call", "only one time" eller "never ask" normaliseres, før runtime-gating anvendes.

Hvert HITL-kontrolpunkt skaber et engangs offentligt gennemgangslink på `/review/{token}`. En gennemgangsperson kan:

- **Acceptere** den originale Markdown-gennemgangstekst
- **Redigere & Fortsætte** med modificeret Markdown
- **Afvise** og fortsætte med `text: ""`

Når HITL er aktiveret, eksponerer noden også en `review`-output-håndtag på canvas. Tilslut den gren til Slack, e-mail eller andre notifikationsnoder, hvis der ønskes at udsende gennemgangs-URL'en og oversigten, så snart kørslen pauses.

Kørslen flyttes til `pending`, indtil en gennemgangsperson svarer. Gennemgangsteksten er en enkelt Markdown-body, og den afventende payload inkluderer også delbar linktekst til ekstern overdragelse. Noder på `review`-grenen kører umiddelbart, når pausen oprettes; den normale outputsti fortsætter kun efter godkendelse. Efter godkendelse genoptager Heym fra det gemte kørselssnapshot, og agenten fortsætter med den godkendte kontekst. Hvis et senere trin også kræver godkendelse, kan agenten oprette et andet HITL-kontrolpunkt. Se [Human-in-the-Loop](../reference/human-in-the-loop.md) for payload-form, gennemgangs-URL-adfærd og genoptagelsessemantik.

HITL er tilgængelig for tekstmode-agentoutput kun. I v1 kan det ikke kombineres med `jsonOutputEnabled`.
## Orchestrator-tilstand

Når denne tilstand er aktiveret, kan agenten delegere opgaver til andre agent-noder i workflowet. Hvis **Orchestrator-tilstand er deaktiveret**, kan agenten **ikke oprette agent→agent-forbindelser** på canvas.

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Når `true`, får agenten et `call_sub_agent`-værktøj |
| `subAgentLabels` | string[] | Etiketter for agent-noder, som denne orchestrator kan kalde |

**Underagenter** skal bruge `$input.text` i deres brugerbesked for at modtage orchestratorens prompt.

Når orchestratoren kalder flere underagenter i en enkelt omgang, udføres de parallelt. Se [Agentarkitektur](../reference/agent-architecture.md) for detaljer.

## Underworkflows

Når denne funktion er konfigureret, modtager agenten et `call_sub_workflow`-værktøj til at udføre andre workflows.

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID'er for workflows, som denne agent kan kalde som værktøjer |

Vælg workflows i sektionen Underworkflows i agentkonfigurationen. Agenten vil kalde dem med `workflow_id` og `inputs` (objekt, der matcher målets inputfelter). Maksimal dybde: 5 nestede underworkflow-kald.

## Canvas-nodeværktøjer

Det er muligt at forbinde en understøttet workflow-node til en agents **værktøjshåndtag**, så agenten kan kalde denne node under kørsel. Dette omdanner eksisterende canvas-handlinger og transformationer til kaldbare værktøjer uden at skrive Python.

Brug canvas-nodeværktøjer, når det ønskes, at agenten skal beslutte, hvornår en konfigureret node skal køres, mens legitimationsoplysninger, statiske felter og workflowspecifikke indstillinger forbliver i node-brugergrænsefladen.

### Agentleverede felter

Felter på et forbundet værktøjsnode kan markeres med bot-ikonet. Markerede felter bliver påkrævede værktøjsparametre, som agenten skal levere, når den kalder noden. Umarkerede felter forbliver faste og læses fra nodekonfigurationen.

Eksempel:

- Forbind en Slack-node til en agent som værktøj
- Behold legitimationsoplysningerne faste i Slack-noden
- Marker `message` som agentleveret
- Agenten modtager et Slack-værktøj, hvor den kun skal angive beskeden under kørsel

Hvis noden ikke er forbundet til en agent som værktøj, er bot-ikonet skjult, og noden opfører sig som et normalt workflow-trin.

### Kørselsadfærd

Når agenten kalder et canvas-nodeværktøj, fusionerer Heym midlertidigt de agentleverede argumenter ind i nodens data, udfører noden, returnerer node-outputtet til agenten og gendanner derefter den oprindelige nodekonfiguration. Værktøjsnoder kører ikke som almindelige workflow-trin gennem normal tidsplanlægning; de kører kun, når agenten kalder dem.

Canvas-nodeværktøjer er nyttige med integrationsnoder som Slack, Telegram, HTTP, Send Email og dataformningsnoder som [Set](./set-node.md). Trigger-noder, kontrolflow-noder og terminal output-mappere ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) kan ikke bruges som agentværktøjer.

## Python-værktøjer

Definer brugerdefinerede værktøjer, som agenten kan kalde. Hvert værktøj har:

| Felt | Type | Beskrivelse |
|-------|------|-------------|
| `name` | string | Værktøjsnavn (f.eks. `count_characters`) |
| `description` | string | Beskrivelse til LLM |
| `parameters` | JSON Schema | OpenAI-funktionskaldsskema (objektformat) |
| `code` | string | Python-funktionskode |

**Parametre** skal være et JSON-objekt, ikke en streng:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Tekst, der skal tælles" }
  },
  "required": ["text"]
}
```

**Eksempel på værktøj:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandkasse.** Python-værktøjer kører som ikke-pålidelig kode i en forhærdet, isoleret Docker-container som standard (intet netværk, ingen Docker-socket, skrivebeskyttet filsystem, ikke-root). Import er begrænset til en tilladelsesliste af sikre standardbiblioteksmoduler. Se [Sikkerhed → Python-værktøjssandkasse](../reference/security.md#python-tool-sandbox) for konfiguration (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Maksimalt antal sekunder pr. værktøjsudførelse (standard: 30) |
| `requestTimeoutSeconds` | number | Maksimalt antal sekunder at vente på hvert modelrespons før timeout (standard: 60). Øg dette for langsomme eller selvhostede udbydere (LiteLLM, vLLM, lokale modeller) og lange multi-step-kørsler. |
## MCP-forbindelser

Forbind til [Model Context Protocol](https://modelcontextprotocol.io/) servere for at eksponere deres værktøjer for agenten.

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Forbindelsestype |
| `timeoutSeconds` | number | Timeout for denne forbindelse (standard: 30) |
| `label` | string | Valgfrit visningsnavn |

**stdio** (lokal proces):

| Felt | Beskrivelse |
|-------|-------------|
| `command` | Kommando, der skal køres (f.eks. `npx`) |
| `args` | JSON-array (f.eks. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON-objekt med miljøvariabler, der injiceres i processen (f.eks. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

De fleste stdio-servere med API-nøglegodkendelse bruger miljøvariabler i stedet for kommandolinjeargumenter. Angiv `env` pr. forbindelse, så hver agent-node kan bruge forskellige legitimationsoplysninger uden at ændre værtsmiljøet.

`env`-værdier understøtter [Expression DSL](../reference/expression-dsl.md), hvilket gør det muligt at videregive workflow-input som legitimationsoplysninger i stedet for at hardkode hemmeligheder:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Udtrykket `$userInput.pat` løses under kørsel mod workflowets inputdata, før MCP-processen starter. Dette gør det muligt at acceptere tokens fra en trigger eller input-node i stedet for at indlejre dem i workflow-definitionen.

Eksempel — GitHub MCP med hardkodet token:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Eksempel — GitHub MCP med dynamisk token fra workflow-input:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Eksempel — GitHub MCP med Heym GitHub-legitimationsoplysninger:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Den indbyggede GitHub-legitimationsoplysning understøtter i øjeblikket PAT-baseret godkendelse. Hvis der er behov for organisationsadgang, skal der bruges en PAT med de nødvendige org/repository-tilladelser.

Eksempel — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (fjernserver):

| Felt | Beskrivelse |
|-------|-------------|
| `url` | SSE-endpoint-URL. Understøtter udtryk (f.eks. `$userInput.serverUrl`). |
| `headers` | JSON-objekt til godkendelse/brugerdefinerede headers. Værdier understøtter udtryk. |

**Streamable HTTP** (fjernserver):

| Felt | Beskrivelse |
|-------|-------------|
| `url` | MCP-endpoint-URL (f.eks. `https://example.com/mcp`). Understøtter udtryk. |
| `headers` | JSON-objekt til godkendelse/brugerdefinerede headers. Værdier understøtter udtryk. |

## Færdigheder

Færdigheder er SKILL.md-instruktioner plus valgfrie Python-filer og tilknyttede aktiver. De udvider agentens systemkontekst og kan tilføje Python-værktøjer.

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `name` | string | Færdighedsnavn |
| `content` | string | SKILL.md-indhold (instruktioner) |
| `timeoutSeconds` | number | Timeout for Python-udførelse af færdighed (standard: 30) |
| `driveFilesEnabled` | boolean | Aktiverer runtime-helperen `heym_drive` for denne færdighed (standard: false) |
| `files` | array | Valgfrie `{ path, content, encoding, mimeType }`-poster (f.eks. `.py`-scripts eller binære aktiver gemt som base64) |

Færdigheder kan tilføjes ved at trække en `.zip`- eller `.md`-fil ind i færdighedsområdet.
Efter udvidelse af en færdighedskort kan der trækkes en fil ind på færdigheden for at vedhæfte eller erstatte en tilknyttet fil, herunder binære aktiver som PDF'er og billeder.
Brug download-knappen på et færdighedskort til at eksportere færdigheden som en `.zip`-arkivfil til sikkerhedskopiering eller genbrug i et andet workflow.

Aktiver **Drive-filer** på en færdighed kun, når dens Python-kode har brug for at læse filer fra Heym Drive. Aktiverede færdigheder modtager en genereret `heym_drive.py`-helper under kørsel og kan kalde `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` eller `read_drive_base64` med en Drive-fil-id eller et eksakt filnavn. Filnavnssøgning bruger den nyeste tilgængelige match. Deaktiverede færdigheder modtager ikke helperen.

Hvert færdighedskort har fire handlinger på rækken under titlen:

| Knap | Beskrivelse |
|--------|-------------|
| **Rediger med AI** | Åbn Skill Builder for at revidere færdigheden fra en chat-prompt |
| **Download** | Eksporter færdigheden som en `.zip`-arkivfil |
| **Fjern** | Slet færdigheden fra denne agent-node |
| **Historik** | Åbn færdighedshistorik afledt af [Redigeringshistorik](../reference/edit-history.md) |
### Færdighedshistorik

Færdighedshistorik gemmes **ikke** separat. Den udledes fra snapshots af workflow-redigeringshistorikken: hver gemt workflow-version indeholder den fulde `skills`-array for agent-noden.

Fra historikdialogen er det muligt at:

- **Forhåndsvise** et tidligere snapshot (SKILL.md og filliste)
- **Redigere** — indlæse et snapshot i færdighedseditoren uden at rulle hele workflowet tilbage
- **AI-fintune** — åbne Skill Builder med det pågældende snapshot som udgangspunkt
- **Tilbagefør** — gendanne kun denne færdighed fra en tidligere version (andre noder forbliver uændrede)

Historik følger samme 7-dages opbevaringspolitik som workflow-redigeringshistorikken. Gemning af workflowet efter færdighedsredigeringer opretter nye historikposter.

Færdighedssektionen inkluderer også **AI Build**:

- Klik på **AI Build** for at oprette en ny færdighed ud fra en chat-prompt
- Klik på glimmerknappen på en eksisterende færdighed for at revidere den med AI
- Slip filer ind i promptkomponisten for at vedhæfte dem til fintuningskommentaren; disse filer gemmes også som bundlede færdighedsaktiver
- Modalen streamer assistenttekst samtidig med at den viser live `SKILL.md` og `.py` filforhåndsvisninger
- **Download ZIP** eksporterer den aktuelle forhåndsvisning uden at tilføje den til noden
- **Gem & Tilføj** gemmer de genererede filer tilbage gennem samme ZIP-parseringsflow, der bruges ved manuel upload

Ved AI-redigering sender Heym kun tekstfiler `.md` og `.py` til builderen. Binære og andre ikke-redigerbare vedhæftninger bevares og deles med builderen som stimetadata, så genereret Python-kode kan bevare relative filreferencer korrekte.
Vælg en vedhæftet fil i højrepanel og aktiver **Inkluder denne fil i AI-kontekst**, når AI'en skal inspicere en bundled skabelon. Tekst-, PDF- og DOCX-filer ekstraheres til promptkontekst, hvor muligt; Heym anvender ikke en separat størrelsesbegrænsning for Skill Builder-vedhæftninger ud over platformens request body-grænse.

## Ekstra request body

Nogle udbydere accepterer request-parametre, som de standard OpenAI-kompatible felter ikke dækker, f.eks. deaktivering af en models tænketilstand. Marker **Send ekstra request body** i node-egenskaberne og indtast et JSON-objekt.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Deaktiveret som standard.** Når afkrydsningsfeltet er fra, sendes intet ekstra.
- Anvendes på **hver** request i tool-calling-loopet, ikke kun første omgang, plus forsøget med fallback-modellen. Anvendes ikke på guardrail-tjek, som bruger en separat model.
- Skal være et JSON-**objekt**. En array, en skalar eller malformateret tekst får noden til at fejle med `Invalid extra body JSON` i stedet for at blive droppet stille.
- `$`-udtryk løses før parsing. Da dette er tekstsubstitution, vil en løst værdi, der indeholder dobbeltanførselstegn eller linjeskift, producere ugyldig JSON og få noden til at fejle.

Samme felt og adfærd som [LLM-node](./llm-node.md)s ekstra body.

## Guardrails

Aktiver **Guardrails** i node-egenskaberne for at blokere usikre brugerbeskeder før agenten kører. Se [Guardrails](../reference/guardrails.md) for den fulde reference.

## Vedvarende hukommelse (graf)

Valgfri **per-agent-node** vidensgraf gemt i databasen. Når aktiveret, tilføjer Heym en Markdown-resumé af huskede enheder og relationer til **systeminstruktionen** før hver kørsel (kun hvis grafen ikke er tom). Efter en **vellykket** agentafslutning ekstraherer en baggrundsjob nye vedvarende fakta fra samtalen og fusionerer dem ind i grafen.

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Aktiver indlæsning + baggrundsekstrahering for denne canvas-node |

**Underagenter** har deres **egne** grafer (nøglet efter deres node-id), adskilt fra orchestratoren.

Brug den lyserøde **hjerne**-kontrol på noden (når hukommelse er tændt eller modelrækken vises) for at åbne grafeditoren og valgfri **hukommelsesdeling** (andre workflows/agenter). Fulde adfærd, REST-stier og JSON-eksportdetaljer: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API og ræsonneringskontinuitet

En **Use Responses API**-afkrydsningsboks dirigerer agentens modelkald gennem [Responses API](https://platform.openai.com/docs/api-reference/responses) i stedet for Chat Completions. Den er fra som standard.

Det betyder mest for en ræsonneringsmodel som `gpt-5` eller `o`-serien. Responses API returnerer modellens ræsonneringer sammen med hvert tool call, og agenten fodrer disse ræsonneringselementer tilbage i næste omgang, så modellen bevarer sin tankekæde gennem et multi-step tool-loop i stedet for at genaflede den efter hvert tool-resultat. Hele loopet kører på samme sti, inklusive [human review](#human-review-hitl)-pause og -genoptagelse, [context compression](#context-compression) og det endelige svar.

Samtalen selv forbliver i Heym. Heym sender fuld input på hver omgang og bærer ræsonneringen som en krypteret blob, så intet bevares på udbyderens side mellem kald. Ræsonneringselementer inden for et span, som context compression resumerer, droppes sammen med det, da en krypteret blob ikke kan resumeres.

Det fungerer med en OpenAI-legitimationsoplysning og med en brugerdefineret legitimationsoplysning, hvis gateway understøtter endpointet. Med en Google-legitimationsoplysning forbliver det deaktiveret.
## Kontekstkomprimering

Når en agent udfører mange værktøjsiterationer med store resultater (webscraping, dokumentlæsninger, sub-workflow-output), kan den akkumulerede beskedhistorik nærme sig modellens kontekstvinduesgrænse. Heym komprimerer automatisk samtalehistorikken under kørsel for at forhindre kontekstoverløb.

**Funktionsmåde:**

1. Før hver værktøjsiteration estimerer Heym det aktuelle tokenantal (~4 tegn per token).
2. Hvis estimatet overstiger **80%** af modellens kontekstvindue, aktiveres komprimering.
3. Beskedhistorikken opdeles i bevarede og komprimerede sektioner:
   - **Bevaret**: system-prompt, første brugerbesked, seneste brugerbesked
   - **Komprimeret**: alt derimellem (assistant-ræsonnementer, værktøjskald, værktøjsresultater)
4. Midterdelen sammenfattes ved brug af den **samme model og legitimationsoplysninger** – ingen yderligere konfiguration nødvendig.
5. Den komprimerede sammenfatning erstatter midterdelen som en enkelt assistant-besked.

**Overvågningsmuligheder:**

Komprimeringshændelser vises som `Context compressed (N messages → summary)`-poster i:
- **Debug-panelets** værktøjskaldeliste under livekørsel
- **Kørselshistorikkens** detaljevisning
- **Traces-fanen** som en `context.compression` trace-post

Komprimering er automatisk og altid aktiv for Agent-noder. Den gælder **ikke** for LLM-noder, Chat-fanen eller AI Assistant-sessioner.

## Relateret

- [Hvorfor Heym](../getting-started/why-heym.md) – Hvordan agenter kører og forbliver styret i produktion
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – Videngraf per agent-node, valgfri deling, API, editor
- [Agentarkitektur](../reference/agent-architecture.md) – Sub-agenter, orkestrator, færdigheder, MCP, værktøjskald
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Offentlige gennemgangssider, afventende kørsler, godkend/rediger/afvis-flow
- [Guardrails](../reference/guardrails.md) – Bloker usikre indholdskategorier
- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [AI Assistant](../reference/ai-assistant.md) – Chat-brugergrænseflade til workflow-opbygning med naturligt sprog (forskellig fra Agent-node)
- [Expression DSL](../reference/expression-dsl.md) – Referering af data i prompts
- [Workflow-struktur](../reference/workflow-structure.md) – Noder, kanter og DSL-format
- [Hurtig start](../getting-started/quick-start.md) – Basisworkflow med LLM og udtryk
- [Legitimationsoplysninger-fane](../tabs/credentials-tab.md) – Tilføj API-nøgler til agenten
- [MCP-fane](../tabs/mcp-tab.md) – Konfigurer MCP for workflow-værktøjer
