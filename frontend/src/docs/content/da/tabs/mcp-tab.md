# MCP-fanen

**MCP**-fanen konfigurerer integration af Model Context Protocol (MCP). MCP gør det muligt for AI-klienter (Claude, ChatGPT, Gemini, Cursor og andre MCP-kompatible værktøjer) at kalde Heym-workflows som værktøjer.

Heym understøtter to tilstande: en **standardserver**, der eksponerer alle MCP-aktiverede workflows under et enkelt endpoint, og **navngivne servere**, der giver hver logisk gruppe af workflows sin egen dedikerede URL og API-nøgle.

Begge tilstande kan eksponere to typer værktøjer: individuelle **workflows** og **Heym Chat-værktøjet** – hele [Chat-fanens](./chat-tab.md) motor bag ét `heym_chat`-værktøj.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Se MCP-demo</a></p>

## Standardserver for MCP

Standardserveren er altid tilgængelig på `{origin}/api/mcp/sse`. Alle workflows med MCP aktiveret vises som værktøjer her.

### MCP API-nøgle

- Nøgler gemmes som SHA-256-digests, så Heym kan ikke vise en eksisterende nøgle. Fanen rapporterer kun, om der er angivet en, ikke hvad den er.
- **Generer** / **Regenerer** – Den nye nøgle vises én gang, lige efter oprettelse. Kopier den her; genindlæsning af fanen skjuler den permanent.
- Anvend denne nøgle, når Claude Desktop, Cursor eller andre MCP-klienter skal forbindes til Heym
- Mistet en nøgle? Regenerer den. Den forrige nøgle ophører med at virke med det samme.

### Forbindelsesmetoder

- **API-nøgle** – Brug MCP API-nøglen til programmatiske forbindelser. Fanen kan kopiere en klar-til-brug JSON-konfiguration og inkluderer en **Tilføj til Cursor**-knap til opsætning med ét klik i Cursor.
- **Claude** – Fanen viser MCP-serverens URL og opsætningsinstruktioner til Claude. Efterlad OAuth Client ID og Secret tomme; Claude registrerer automatisk og autentificerer via Heym OAuth.
- **ChatGPT** – Fanen viser MCP-serverens URL og opsætningstrin for en ChatGPT-app. Slå udviklertilstand til, opret en app med URL'en, og vælg OAuth; ChatGPT registrerer sig automatisk.
- **Gemini** – Fanen viser MCP-serverens URL og opsætningstrin for en brugerdefineret Gemini-app: i gemini.google.com skal du vælge **Settings → Connected Apps → Add a custom app**, indsætte URL'en og lade **Advanced features** være lukket; Gemini registrerer sig automatisk og godkender via Heym OAuth. Når forbindelsen er oprettet, fungerer Heym også i Gemini-mobilappen.

### MCP-toggle for workflow

Hvert workflow kan eksponeres som et MCP-værktøj:

- **Aktivér** – Workflowets værktøjer bliver tilgængelige for alle klienter forbundet til standardserveren
- **Deaktivér** – Workflowet eksponeres ikke

Workflow-kort viser beskrivelsen og en forhåndsvisning af inputfeltnavne, så det er muligt at se, hvad hvert værktøj forventer, før det aktiveres.

## Heym Chat-værktøj

Sektionen **Heym-funktioner** omdanner Chat-fanens motor til ét MCP-værktøj ved navn `heym_chat`. Aktiver det på standardserveren, på enhver navngiven server eller på begge – hver overflade har sin egen toggle og modelvalg.

Når det er aktiveret, vises `heym_chat` i `tools/list` sammen med workflow-værktøjerne. En MCP-klient sender én besked på naturligt sprog, og Heym-motoren tager det derfra med samme evner som Chat-fanen har:

- Opret et workflow, testkør det med eksempelinput, ret det til, og afslut når en kørsel gennemføres (se [Build-tilstand](#build-mode))
- Inspicer og kør dine eksisterende workflows
- Rapporter analytics, seneste kørsler og kommende cron-planer
- Rapporter kørehistorikken for ét workflow: hvor mange gange det er kørt, statusfordeling, hvornår det kørte, og på anmodning input, output og fejl pr. node for en enkelt kørsel
- Rapporter, hvad der kører lige nu: hvor mange eksekveringer der er aktive, deres workflownavne, hvor længe hver har kørt, hvilken node hver er på, og et link til den aktive kørsel
- List boards, opret kort og læs kortdetaljer på [Board-fanen](./board-tab.md)
- List datatabeller med deres kolonner, opret nye og forbind dem til de workflows, den bygger
- Læs teams og globale variabler, og søg i dokumentationen
- Godkend, rediger eller afvis afventende human-in-the-loop-godkendelser

Funktioner tilføjet til Chat-fanen senere bliver automatisk tilgængelige via `heym_chat` – der er ingen per-funktions-toggle at holde synkroniseret.

### Build-tilstand

`heym_chat` kører altid Chat-motoren i build-tilstand. I ét kald kan assistenten gemme et nyt workflow, køre det med realistiske eksempelinput, læse kørselsrapporten, rette det der fejlede og køre det igen – op til fem testkørsler pr. kald. Når den seneste kørsel af den seneste gemte version gennemføres, afslutter den med et resumé på én sætning, og svaret slutter med `Verified: the latest test run of the saved workflow passed.`

- Testkørsler er rigtige kørsler. Deres sideeffekter udføres, og de fremgår af workflowets kørselshistorik som enhver anden kørsel.
- Gem handlinger følger editorens sti: en ændring af grafen bevarer den tidligere graf i workflowets **Edit History**.
- For at ændre et workflow, den tidligere har oprettet, skal du fortsætte tråden med samme `conversation_id`. Assistenten opdaterer det pågældende workflow i stedet for at oprette et nyt, og den ændrer kun workflows, du har rettigheder til at redigere.
- Når de fem testkørsler er brugt op, stopper assistenten og forklarer, hvad der stadig fejler.

Legitimationsoplysninger forbliver i brugergrænsefladen: `heym_chat` lister dem aldrig op, vælger eller opretter dem. Når den bygger eller redigerer et workflow, efterlades nye noder, der kræver legitimationsoplysninger, tomme, og svaret navngiver dem, så det er muligt at angive dem i editoren.

Datatabeller er anderledes. En tabel indeholder ingen hemmeligheder, så `heym_chat` kan liste tabellerne, spørge hvilken et workflow skal bruge, og oprette en ny med dens kolonner. Den læser eller skriver aldrig rækker.

### Legitimationsoplysninger og model

`heym_chat` kører motoren på Heym-kontoen, så den har brug for sin egen LLM-legitimationsoplysning:

| Felt | Adfærd |
|-------|----------|
| **Legitimationsoplysninger** | Vælg enhver OpenAI-, Google- eller Brugerdefineret legitimationsoplysning, der er tilgængelig. Forududfyldt fra den foretrukne legitimationsoplysning i [Indstillinger](../reference/user-settings.md), når der ikke er valgt en. |
| **Model** | Indlæst fra den valgte legitimationsoplysning. Forududfyldt fra den foretrukne model, når legitimationsoplysningen matcher. |

Hvis noget mangler, vises værktøjet stadig i `tools/list`, men hvert kald returnerer en fejl, der beder om at fuldføre opsætningen i denne fane.

### Argumenter og historik

| Argument | Påkrævet | Beskrivelse |
|----------|----------|-------------|
| `message` | Ja | Instruktionen eller spørgsmålet på naturligt sprog. |
| `conversation_id` | Nej | En `conversation_id` fra et tidligere `heym_chat`-resultat for at fortsætte den tråd. |

Hvert kald skrives til [Chat-fanens](./chat-tab.md) historik som en normal samtale, markeret med et stik-ikon i samtaleoversigten. Beskeder, værktøjskort og afklaringspauser ser nøjagtigt ud som en samtale startet manuelt, og det er muligt at åbne tråden og fortsætte samtalen i browseren. Hvert resultat returnerer sin `conversation_id`, så MCP-klienten kan fortsætte den samme tråd i stedet for at åbne en ny ved hvert kald.

Når assistenten har brug for afklaring, pauser den og gør opmærksom på det; svar med oplysningerne ved at bruge den samme `conversation_id`.
## Navngivne MCP-servere

Navngivne servere gør det muligt at segmentere workflows i isolerede MCP-endpoints. Hver server har sin egen URL og API-nøgle, så forskellige AI-klienter, teams eller brugsscenarier kan forbinde til præcis de workflows, de har brug for.

### Oprettelse af navngiven server

1. Indtast et navn i inputfeltet i bunden af MCP-fanen (f.eks. **CRM-værktøjer**)
2. Klik på **Opret** – en ny serverkort vises umiddelbart
3. Klik på kortet for at udvide det

### Indstillinger pr. server

Hvert serverkort viser:

| Indstilling | Beskrivelse |
|---------|-------------|
| **SSE-endpoint** | Unik URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API-nøgle** | Uafhængig nøgle, vises kun én gang ved generering eller regenerering. Kopier den med det samme; den lagres hashet og kan ikke vises senere |
| **Sådan forbindes** | **Kopier JSON** kopierer den klar-til-indsættelse MCP-konfiguration; **Tilføj til Cursor** installerer den med ét klik |
| **Heym-funktioner** | Slå `heym_chat`-værktøjet til for denne server og vælg dens legitimationsoplysninger og model |
| **Tildelte workflows** | Vælg hvilke af workflowene denne server skal eksponere |

### Workflow-tildeling

Workflow-tildeling er pr. server og uafhængig af standardserverens tilknytning. Et workflow kan være aktiveret på standardserveren og på flere navngivne servere samtidigt, eller på ingen af dem.

Ved at slå et workflow til eller fra flyttes det til toppen af den tildelte liste, så den række, der lige er ændret, forbliver synlig i stedet for at forsvinde ved scrolling.

### Autentificering

Navngivne servere understøtter de samme autentificeringsmetoder som standardserveren:

- **X-MCP-Key-header** – Send serverens API-nøgle direkte (API-klienter, Cursor). Kun header: nøgler accepteres ikke som en `?key=`-forespørgselsparameter, da URL'er ender i adgangslogs, proxy-logs og browserhistorik.
- **Claude, ChatGPT og Gemini OAuth** – Tilføj serverens URL til klientens connectors eller brugerdefinerede apps; lad legitimationsoplysninger være tomme, og klienten registrerer sig automatisk via OAuth. Bearer-tokenet skal sendes i `Authorization`-headeren, ikke som `?token=`.
- **Session-token** – Udstedt under SSE-håndtrykket; begrænset til den specifikke server, så tokens fra én navngiven server ikke kan få adgang til en anden. Denne kortlivede `?session=`-parameter påvirkes ikke.

### Sletning af navngiven server

Klik på **X**-ikonet på en serverkorts header. Sletning fjerner serveren og alle dens workflow-tildelinger; workflowene selv påvirkes ikke.

## SSE-endpoint

| Server | Endpoint |
|--------|----------|
| Standard | `{origin}/api/mcp/sse` |
| Navngiven | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Begge endpoints understøtter SSE-transport (GET, MCP-specifikation 2024-11-05) og Streamable HTTP-transport (POST, MCP-specifikation 2025-03-26). Claude, ChatGPT og Gemini bruger OAuth 2.1 / PKCE til sikker login på begge.

## Relateret

- [Hvorfor Heym](../getting-started/why-heym.md) – MCP som førsteklasses primitiv i Heym
- [Agent-node](../nodes/agent-node.md) – Agent-node med MCP-værktøjsunderstøttelse
- [Agentarkitektur](../reference/agent-architecture.md) – MCP-klient, værktøjsdistribution, orchestrator
- [Triggers](../reference/triggers.md) – MCP som workflow-indgangspunkt
- [Chat-fane](./chat-tab.md) – Motoren bag `heym_chat`-værktøjet
- [Workflows-fane](./workflows-tab.md) – Opret og administrer workflows
- [Nodetyper](../reference/node-types.md) – Oversigt over AI-noder
- [Kontekstuel showcase](../reference/contextual-showcase.md) – Kompakt sidevejledning til dashboard-overflader
