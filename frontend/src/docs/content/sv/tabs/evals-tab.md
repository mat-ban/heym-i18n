# Fliken Evals

Fliken **Evals** är en separat sida på `/evals`. Den gör det möjligt att skapa utvärderingssviter, definiera testfall och köra utvärderingar mot [Agent](../nodes/agent-node.md)-workflows. En [agentsvit](#agent-suites) kör en agent eller läser dess verkliga körningar samt kontrollerar de verktyg den anropar, dess latens, dess kostnad i USD, dess tokens och dess antal verktygsanrop.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

## Åtkomst

- Klicka på **Evals** i dashboardens flikrad
- Eller navigera till `/evals`
- Eller använd **Ctrl+K** (Cmd+K) och välj "Evals" från kommandopaletten

## Utvärderingssviter

- **Ny svit** – Välj **Promptsvit** för att testa en systemprompt över modeller, eller **Agentsvit** för att kontrollera en agents verkliga körningar (se [Agentsviter](#agent-suites))
- **Svitväljare** – Listar prompt- och agentsviter tillsammans med typen bredvid varje namn; skriv för att söka
- **Skapa svit** – Definiera en svit med ett namn och en beskrivning
- **Välj workflow** – Välj vilken workflow som ska utvärderas
- **Välj credential** – API-nyckel för att köra workflowen
- **System prompt** – Redigera svitens system prompt direkt i den vänstra panelen
- **Optimize Prompt** – Be en LLM förbättra den aktuella system prompten

## Testfall

- Lägg till testfall med indata-prompts och förväntade utdata
- Varje fall kan ha ett anpassat förväntat värde för jämförelse
- Redigera eller ta bort fall från sviten
- **Generate Test Data** – Använd den valda credentialen/modellen för att automatiskt skapa testfall från svitens prompt

## Köra utvärderingar

- **Välj en eller flera modeller** – Kör samma svit mot flera modeller i en utvärdering
- **Poängsättningsmetod** – Välj `Exact Match`, `Contains` eller `LLM-as-Judge`
- **Judge** – För `LLM-as-Judge`, välj valfritt en OpenAI-, OpenAI-kompatibel (Custom)-, Gemini (Google)- eller [Decision Model](../nodes/decision-node.md)-credential och ange judgens modell (till exempel `gpt-4o-mini` eller `jev-latest`) för att poängsätta med en oberoende judge
- **Körningar per test** – Upprepa varje testfall flera gånger i en körning
- **Sparade inställningar** – En svit öppnas med inställningarna från sin senaste körning: autentiseringsuppgift, modeller, bedömningsmetod och domare, temperatur, resonemangsinsats och körningar per test. Att öppna en tidigare körning laddar dess inställningar, så **Kör utvärderingar igen** upprepar samma test
- **Temperature** – Ange modellens temperature (`Exact Match` och `Contains`)
- **Resonemangsinsats** – Ställ in resonemangsinsats för resonemangsmodeller, från Låg till Extra hög och Max precis som för LLM- och Agent-noder (`Exact Match` och `Contains`)

### LLM-as-Judge

Med en judge svarar varje modell på testindata med enbart svitens prompt, och därefter bedömer judgen hur väl svaret matchar det förväntade utfallet från 0 till 100:

- **En modelljudge** (OpenAI, OpenAI-kompatibel eller Gemini) läser frågan, det förväntade utfallet och svaret, och returnerar en poäng med en enradig motivering. Den körs vid temperature `0`, eller vid `low` reasoning effort för en reasoning-modell, så att samma svar får samma bedömning.
- **En decision model-judge** bedömer svaret enligt en femgradig rubric, från *Completely off* till *Fully matches*. Poängen är den sannolikhetsviktade positionen på denna rubric, så den kommer från en fördelning som modellen har beräknat snarare än ett tal den har skrivit.

Cellens hovringskort visar domarens motivering eller, för en beslutsmodell, nivån, poängen och dess konfidensgrad. Latens och tokens beskriver modellen som testas; domarens egna anrop visas i [Spårningar](./traces-tab.md) under källan **Utvärderingar**. Domarväljaren utesluter Model Router-autentiseringsuppgifter, eftersom en domare måste vara en fast modell. Autentiseringsuppgiften för modellerna som testas kan vara en [Model Router](../reference/credentials.md#model-router-auto-model): dess **Auto**-modell väljer en modell per förfrågan, på samma sätt som i ett workflow.

Utan en judge svarar varje modell och poängsätter sitt eget svar i en enda förfrågan.

Temperature och reasoning effort är dolda i detta läge, och körningen använder fasta inställningar: temperature `0.7` för standardmodeller, och `medium` reasoning effort för reasoning-modeller (`low` när de poängsätter sina egna svar).

## Resultat

- Visa godkänt/underkänt per testfall
- Granska faktiska kontra förväntade utdata
- Jämför utdata per modell sida vid sida när en körning omfattar flera modeller
- Granska körningshistorik för tidigare utvärderingar; en `LLM-as-Judge`-körning visar sin judge-modell i historiklistan
- Öppna historiska körningar från resultatpanelen och granska sparade prompt-/indata-/utdata-ögonblicksbilder
- Att öppna en tidigare körning laddar dess poängsättningsmetod och judge i den vänstra panelen, så **Re-Run Evals** upprepar samma utvärdering
- **Export** laddar ner körningen som JSON, inklusive `judge_credential_id` och `judge_model`

## Agent Suites

En agentsvit kontrollerar en [Agent](../nodes/agent-node.md)-nod mot dess körningar. Den läser dem från [Spårningar](./traces-tab.md), där varje körning redan registrerar tid, tokens, kostnad och verktygsanrop, och den kan även köra workflowet åt en.

Skapa en via **Ny svit** → **Agentsvit** och följ tre steg:

1. **Agent** – Välj workflow och därefter dess agentnod. Endast workflow med en agentnod listas; ett workflow eller en agent som ännu inte har körts visas men kan inte väljas. Inställningarna för den valda agenten (modell, instruktioner, verktyg och gränser) visas till höger, och en skrivskyddad arbetsyta av dess workflow med agenten markerad visas nedanför.
2. **Baseline** – Agentens senaste 10 körningar: latens p50 och p95, kostnad per körning, tokens per körning och verktygsanrop per körning, vilka verktyg som anropades och hur ofta, samt varje körnings egna siffror. Körningar som slutade med fel listas men utesluts från baseline.
3. **Kontroller** – Markera varje verktyg som **Must call**, **Must not call** eller **Either**. Varje typ av anrop listas med sin typ: Python- och nodverktyg, **MCP**-verktyg med sin server, **underagenter** efter etikett, **underordnade workflow** efter namn samt **skills**. Lägg till ett verktyg efter typ och namn om det inte har körts ännu, och ta bort det med dess **X**. Ange övre gränser för latens, kostnad, totala tokens och verktygsanrop; varje gräns börjar 20 % över baseline-p95 och kan inaktiveras.

En sparad svit öppnas på **Resultat**, med **Baseline** och **Redigera kontroller** bredvid:

- **Kör workflowet** – Välj antal körningar (upp till 20); fyra körs samtidigt. Indata fylls i från workflowets senaste körning och kan redigeras, och varje körning använder dem. Aktivera **Generera indata** (gnistrikonen) och välj sedan en autentiseringsuppgift och modell för att låta modellen skapa olika indata för varje körning. Den läser agentens systeminstruktioner och håller sig nära de inmatade värdena: inmatning av ett stadsnamn ger andra stadsnamn. Varje körning kör hela workflowet precis som alla vanliga körningar och listas i Körningshistorik med triggern `agent_suite`. För att hoppa över senare steg, såsom att skicka e-post, öppna workflowet med **Gå till workflow** i panelen och inaktivera dessa noder först. **Stoppa** avslutar en svitkörning: inga nya körningar startas och pågående körningar avbryts. En svitkörning vars server stängdes av, till exempel vid en omstart, visas som avbruten efter en minut i stället för att förbli blockerad.
- **Resultat** – Den senaste svitkörningen bedöms som standard. Varje svitkörning sparas med sitt datum i körningsväljaren, där den kan öppnas eller tas bort; eller växla till de senaste 10, 20 eller 50 körningarna för agenten för att inkludera dess övriga körningar. Här visas godkännandegraden, hur ofta varje kontroll godkändes, latens, kostnad, tokens och verktygsanrop bredvid den sparade baseline, samt varje körning med anledningen till felet och en länk till dess spårning.
- **Gå till workflow** öppnar agentens workflow i en ny flik. I namnfältet raderar **Esc** eller **X** texten.

Hur siffrorna tolkas:

- **Latens** är modellens tid plus tiden för körningens verktygsanrop.
- **Kostnad** använder samma priser som Traces. En körning med en modell utan pris hoppar över kostnadskontrollen i stället för att misslyckas.
- En körning **godkänns** när den slutfördes utan fel och alla kontroller passerades.
- Sviten läser enbart egna spårningar, enligt samma regel som fliken Spårningar.
- **Använd senaste körningar som baseline** i **Redigera kontroller** ersätter den sparade baseline med agentens senaste körningar.

En svits baseline hämtas från en av tre källor. **Redigera kontroller** visar vilken som är aktiv bredvid **Sparad baseline**:

- agentens senaste körningar (standard och vad **Använd senaste körningar som baseline** hämtar),
- en slutförd svitkörning,
- manuellt inmatade siffror.

De två sista ställs in från [Chat](./chat-tab.md#working-with-evals) eller via API:

- `PATCH /api/evals/agent-suites/{id}` tar emot `baseline: {"source": "suite_run", "run_id": "…"}` eller `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` tar emot `inputs_list`: ett indataobjekt per körning, upp till 20.

### Från Chat och MCP

[Chat](./chat-tab.md#working-with-evals) och MCP-verktyget `heym_chat` kan skapa, ändra och köra prompt- och agentsviter:

- De formulerar testfall och körindata själva.
- De frågar vilken autentiseringsuppgift som ska användas innan en promptsvit skapas, såvida inte enbart en passar.
- De länkar till varje svit som nämns på denna sida.

## Idéer för benchmark-matriser

När en benchmark-matris byggs för agent-workflows bör HITL-scenarier inkluderas som förstklassiga fall istället för att behandlas som kantfall.

- Täck alla tre granskningsbeslut: `accepted`, `edited` och `refused`
- Inkludera flera trigger-källor såsom editor-körningar, portal, curl/webhook och cron-triggade körningar
- Lägg till scenarier med upprepad granskning där en agent-körning pausar mer än en gång
- Verifiera notifieringsgrenar kopplade till agentens `review`-utdata
- Kontrollera nedströmsbeteende efter refusal, särskilt om senare noder förgrenar sig på `$agent.decision`

## Relaterat

- [Why Heym](../getting-started/why-heym.md) – Evals som teststadiet i agentens livscykel
- [Agent Node](../nodes/agent-node.md) – Workflows som utvärderas
- [Credentials Tab](./credentials-tab.md) – Credentials för eval-körningar
- [Traces Tab](./traces-tab.md) – Detaljerad trace-granskning
- [Workflows Tab](./workflows-tab.md) – Skapa workflows att utvärdera
- [Execution History](../reference/execution-history.md) – Visa tidigare körningar (History-knappen i sidhuvudet)
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt sidguide tillgänglig på evals-sidan
