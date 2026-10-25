# Chat-fane

**Chat**-fanen giver en direkte LLM-chatgrænseflade. Den kan anvendes til at teste modeller, stille spørgsmål, køre eksisterende workflows eller oprette et nyt workflow ud fra en anmodning i naturligt sprog.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Se Chat-demo</a></p>

## Opsætning

1. Vælg en [legitimationsoplysning](./credentials-tab.md) (API-nøgle til OpenAI, Google osv.)
2. Vælg en model fra rullemenuen (modeller indlæses fra den valgte legitimationsoplysning)
3. Begynd at skrive for at sende beskeder

En samtale kan også startes fra chatfeltet på [Workflows-fanen](./workflows-tab.md). Første besked sendes, og den nye samtale åbnes her med svaret, der allerede streames.

## Funktioner

- **Kontekst for globale variabler** – [Globale variabler](../reference/global-variables.md) er tilgængelige for LLM'en, så der kan spørges til eller refereres til lagrede værdier
- **Kontekst for workspace-skabeloner** – Delte workflow- og node-skabeloner i workspacet inkluderes som kontekst, så Chat kan besvare spørgsmål om tilgængelige skabeloner
- **Langvarig agent** – Chat fortsætter med at arbejde på backend, selv om browseren lukkes, så en samtale kan genoptages fra en anden enhed
- **Oprettelse af workflows** – Chat kan anmodes om at oprette eller sætte et workflow op, og den anvender samme Workflow AI Builder-motor som editorassistenten til at generere og gemme workflowet
- **Oprettelse af Kanban-opgaver** – Der kan naturligt anmodes om at tilføje en opgave eller oprette et kort. Chat tilføjer det til første kolonne på det ønskede board; når der findes flere boards og intet board navngives, viser Chat en board-vælger, før kortet oprettes
- **Opkøede opfølgninger** – Flere beskeder kan sendes, mens et svar streames. Opkøede beskeder bevares, kan redigeres eller slettes før start og køres i rækkefølge efter det aktive svar
- **Planlægningspauser** – Når Chat har brug for planlægningsdetaljer, stilles afklarende spørgsmål, og opkøede opfølgninger sættes på pause, indtil der svares. Når planlægningssvaret er færdigt, genoptages opkøede beskeder
- **Legitimationsoplysninger** – Når et workflow, som Chat opretter eller redigerer, har brug for en legitimationsoplysning, spørger Chat hvilken der skal anvendes, tilbyder at oprette en ny i samtalen eller lader arbejdet fortsætte uden. Chat kan også anmodes om at oprette en legitimationsoplysning eller opdatere en, der ejes; den åbner legitimationsformularen i samtalen. Modellen ser kun legitimationsoplysningens navn og type, aldrig dens værdier, både for legitimationsoplysninger, du ejer, og dem, der er delt med dig. LLM- og Agent-noder, som Chat tilføjer, kører på de legitimationsoplysninger og den model, der er valgt til chatten, inklusive delte legitimationsoplysninger; når Chat redigerer et workflow, beholder dets eksisterende LLM- og Agent-noder deres legitimationsoplysninger og model. Se [AI-assistent › Legitimationsoplysninger](../reference/ai-assistant.md#credentials)
- **Datatabeller** – Når et workflow, som Chat opretter eller redigerer, gemmer poster, spørger Chat hvilken [datatabel](./datatable-tab.md) der skal anvendes, eller tilbyder at oprette en med de kolonner, workflowet har brug for. Chat kan også liste tabeller og deres kolonner. Den læser eller skriver aldrig rækker. Se [AI-assistent › Datatabeller](../reference/ai-assistant.md#data-tables)
- **Streaming-svar** – Modellens output vises, mens det streames
- **Stop svar** – Det aktuelle streaming-svar kan afbrydes til enhver tid; stop rydder også opkøede beskeder for den pågældende samtale
- **Markdown-gengivelse** – Svar understøtter markdown-formatering, herunder inline-billeder
- **Billedvisning** – Billeder indlejret i svar (f.eks. fra LLM-billedgenerering) vises inline; klik på et billede for at se det i fuldskærm. Tryk på **Esc** eller tilbage-knappen (mobil) for at lukke fuldskærmsvisningen
- **Kopier beskeder** – Enhver besked kan kopieres til udklipsholderen
- **Ryd chat** – Start en ny samtale
- **Stemmeinput** – Anvend mikrofonknappen til tale-til-tekst (understøttet af browseren). Når optagelsen stopper, kan Heym let rense transskriptionen, før den sendes
- **Tidsplanlagte workflows** – Spørg hvornår cron-workflows kører (i dag, denne uge, denne måned eller et brugerdefineret datointerval). Assistenten anvender samme tidsplandata som [Tidsplaner](./scheduled-tab.md)-fanen og kan begrænse resultater til egne workflows eller inkludere dem, der er delt. 
- **Kørselshistorik for workflows** – Spørg til et enkelt workflow ("hvor mange gange kørte den daglige rapport?", "fejlede den?", "hvornår kørte den sidst?"). Chat slår workflowet op via dets ID og svarer ud fra antal kørsler, statusfordeling, første og sidste kørselstidspunkt samt gennemsnitlig varighed. Spørg hvorfor en kørsel fejlede, eller hvad den returnerede, og Chat åbner den pågældende kørsel for at læse input, output og fejl pr. node
- **Live kørselsstatus** – Spørg hvad der kører lige nu, og Chat svarer med antallet, workflow-navnene, hvor længe hver kørsel har været i gang, hvilken node den er på, samt et direkte link til den aktive kørsel
## Brug af Chat fra en MCP-klient

Chat-motoren kan også tilgås udefra browseren. Aktivér **Heym Chat-værktøjet** i [MCP-fanen](./mcp-tab.md), hvorefter MCP-klienter — Claude, Cursor og alt andet, der taler MCP — får et enkelt `heym_chat`-værktøj, som kører denne samme motor med alle dens funktioner.

Disse samtaler lander i denne fanes historik og markeres med et stikikon i samtalelisten. Åbn en for at læse, hvad klienten spurgte om, se de værktøjskort, den udløste, og fortsæt selv tråden. Besvarelse af et afklarende spørgsmål fungerer på samme måde, uanset om turen startede her eller fra en MCP-klient.

Over MCP viser Chat ikke, vælger ikke og opretter ikke legitimationsoplysninger. Workflows, som den bygger, efterlader legitimationsfelter tomme, og svaret navngiver de noder, der kræver en legitimationsoplysning, så de kan angives i editoren.

Datatabeller fungerer også over MCP: Chat viser de relevante tabeller, opretter nye og forbinder dem til de workflows, den bygger. Dets tabelspørgsmål ankommer som tekst i resultatet, så det besvares med samme `conversation_id`.

## Kontekstgrænse

Chatten holder op til 25 seneste beskeder i kontekst. Ældre beskeder trimmes for at overholde modellens grænser.

## Oprettelse af Workflows

Når Chat anmodes om at oprette, bygge, generere eller sætte en workflow op, oprettes en ny gemt workflow med et genereret navn og en genereret beskrivelse. Svaret indeholder en skrivebeskyttet canvas-forhåndsvisning af de genererede noder og kanter samt et **Åbn workflow**-link, der åbner workflow-editoren i en ny browserfane. Brug forhåndsvisningskortets **Kør**-knap, når workflowen ønskes eksekveret.

Opfølgende feedback i samme chat redigerer denne workflow i stedet for at oprette en ny. Efter at Chat har oprettet en workflow, kan der eksempelvis siges "tilføj et godkendelsestrin", "ændr outputformatet" eller "şöyle yap", hvorefter Chat opdaterer den gemte workflow og genindlæser forhåndsvisningen.

Dette er bedst til anmodninger, hvor arbejdet ønskes udført som en genanvendelig automatisering, ikke blot som et enkeltstående svar.

## Oprettelse af Kanban-opgaver

Anmod Chat i almindeligt sprog, for eksempel "Tilføj en opgave kaldet Fix login bug" eller
"Opret et nyt kort Update documentation på tavlen Launch." En beskrivelse kan inkluderes i
samme anmodning. Chat opretter altid kortet i den valgte tavles første kolonne.

Hvis arbejdsområdet har flere tavler, og ingen identificeres, sætter Chat pause med en
enkeltvalgs-tavlevælger. Vælg en tavle for at færdiggøre oprettelsen af kortet. Der kræves
ingen slash-kommando eller særligt beskedformat.

## Forespørgsel om, hvad der kører

Spørg i almindeligt sprog — "hvad kører?", "hvor mange workflows er aktive lige nu?",
"hvilken node er den natlige rapport på?" — og Chat rapporterer det aktuelle billede:

- **Hvor mange** kørsler der er i gang, opdelt i kørende og afventende menneskelig gennemgang
- **Hvilke workflows** de tilhører, ved navn
- **Hvor længe** hver kørsel har været i gang (for eksempel `1m 35s`, `3h 25m`)
- **Hvilken node** der eksekverer lige nu, ved dens canvas-label, plus den seneste node, der blev færdig
- **Et link** til hver aktiv kørsel, som åbner canvas med denne kørsel afspillet

Kørsler, der er sat på pause til en [Human-in-the-Loop](../reference/human-in-the-loop.md) eller Codex-gennemgang, rapporteres som afventende, ikke som kørende. Dette er de samme data som aktiv-kørsler-badgen i headeren, så Chat og badgen er aldrig uenige. For kørsler, der allerede er afsluttet, spørges der i stedet til seneste kørsler — dette læser [Kørselshistorik](../reference/execution-history.md).

## Forespørgsel om en kørsel

Vælg en Workflow-kørsel i [Execution History](../reference/execution-history.md#ask-ai), fra editoren eller fra All History, og klik på **Spørg AI** ved siden af dialogens titel. Chat åbner en ny samtale med to chips over meddelelsesfeltet:

- **Workflow:** navnet på Workflow
- **Execution:** de første tegn i det valgte kørsels-id

Fjern et chip med dets **×** for at udelade det. Stil derefter spørgsmålet, for eksempel ”hvorfor tog denne kørsel så lang tid?”, ”hvad fejlede her?” eller ”kan du rette det?”. De resterende chips vedhæftes denne meddelelse med fulde id'er, så Chat læser kørslens input, output og nodetrace direkte i stedet for at søge efter Workflow. For at rette Workflow gemmer, testkører og verificerer Chat ændringen som beskrevet i [Oprettelse af workflows](#oprettelse-af-workflows).

Den sendte meddelelse viser chipsene under spørgsmålet. De tilhører kun denne meddelelse; opfølgende spørgsmål i samme samtale bevarer konteksten fra historikken.

## Forespørgsel om advarsler

Chat kan besvare spørgsmål om de [advarsler](./alerts-tab.md), der er defineret:

- **Hvad findes** — "hvilke advarsler har jeg?", "er der en advarsel på faktura-workflowen?",
  "hvilke advarsler udløses lige nu?"
- **Hvordan en er sat op** — "hvad er tærsklen på omkostningsadvarslen?", "hvordan er den konfigureret?"
- **Hvorfor og hvornår den blev udløst** — "hvorfor blev omkostningsadvarslen udløst?", "hvornår blev denne senest udløst?"

Ved et "hvorfor blev den udløst"-spørgsmål læser Chat udløsningsregistreringen og citerer den faktisk observerede værdi, tærsklen og det præcise evaluerede vindue samt de bidragende detaljer: fejlende kørsels-id'er og fejlmeddelelser for fejladvarsler, forbrug pr. model for omkostningsadvarsler eller trigger-kildeopdelingen for advarsler om antal kørsler. Det rapporteres, hvad der var sandt, da advarslen blev udløst, i stedet for at genberegne vinduet, fordi vinduet er passeret, og en ny beregning kan give et andet svar.

## Brugerregler

[Brugerregler](../reference/user-settings.md) (konfigureret i Indstillinger) injiceres automatisk i hver Chat-samtale som instruktioner på systemniveau. Angiv dem én gang for at anvende vedvarende præferencer på alle chat-anmodninger.
## Relateret

- [MCP-fane](./mcp-tab.md) – Eksponér denne engine for MCP-klienter som `heym_chat`-værktøjet
- [Indstillinger](../reference/user-settings.md) – Angiv brugerregler, der anvendes på alle chatforespørgsler
- [Legitimationsoplysninger-fane](./credentials-tab.md) – Tilføj og administrer API-nøgler
- [Variabler-fane](./global-variables-tab.md) – Globale variabler tilgængelige for Chat
- [Node-typer](../reference/node-types.md) – LLM- og Agent-noder til workflows
- [Agent-node](../nodes/agent-node.md) – AI-agent med værktøjskald
- [AI-assistent](../reference/ai-assistant.md) – Editorassistent drevet af den samme workflow-builder-DSL
- [Kørselshistorik](../reference/execution-history.md) – Se tidligere kørsler (Historik-knappen i headeren)
- [Tidsplaner-fane](./scheduled-tab.md) – Kalender over kommende cron-kørsler (samme data, som Chat kan opsummere)
- [Advarsler-fane](./alerts-tab.md) – Tærskeladvarsler, som Chat kan liste og forklare
- [Kontekstuel præsentation](../reference/contextual-showcase.md) – Kompakt orientering i appen til denne side
- [Chat-stemme (TTS & STT)](../reference/chat-voice.md) – Læs beskeder højt, og tal håndfrit med ElevenLabs

## Værktøjskald og kontekststørrelse

Hver gang assistenten kalder et værktøj (kører et workflow, viser kørsler, opbygger et nyt workflow), vises et sammenklappeligt kort i samtalen. Kortet udvides automatisk, mens værktøjet kører, og viser de præcise argumenter. Når værktøjet afsluttes, klappes kortet sammen til et resumé på én linje med den forbrugte tid. Der kan klikkes på et vilkårligt kort for at udvide argumenterne og resumésvaret igen.

Et lille ringmærke under inputfeltet viser den aktuelle kontekstanvendelse som en procentdel af modellens vindue (f.eks. `12% · ~9.2k`). Hold musen over mærket for at se en opdeling: systemprompt, AGENTS.md, workflows-blok, brugerregler, historik og det indtastede udkast. Når anvendelsen overstiger 80%, skifter ringen til ravfarve; ved 95% skifter den til rød.

Hvis anvendelsen nærmer sig grænsen, komprimerer Heym automatisk ældre beskeder til et kort resumé ved hjælp af samme mekanisme, som agent-noder anvender. Et "Kontekst komprimeret"-kort vises inline for at vise, hvad der er sket.
