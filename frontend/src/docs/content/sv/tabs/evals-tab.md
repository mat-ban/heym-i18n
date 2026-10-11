# Fliken Evals

Fliken **Evals** är en separat sida på `/evals`. Den gör det möjligt att skapa utvärderingssviter, definiera testfall och köra utvärderingar mot [Agent](../nodes/agent-node.md)-workflows.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

## Åtkomst

- Klicka på **Evals** i dashboardens flikrad
- Eller navigera till `/evals`
- Eller använd **Ctrl+K** (Cmd+K) och välj "Evals" från kommandopaletten

## Utvärderingssviter

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
- **Temperature** – Ange modellens temperature (`Exact Match` och `Contains`)
- **Reasoning effort** – Ange reasoning effort för reasoning-modeller (`Exact Match` och `Contains`)

### LLM-as-Judge

Med en judge svarar varje modell på testindata med enbart svitens prompt, och därefter bedömer judgen hur väl svaret matchar det förväntade utfallet från 0 till 100:

- **En modelljudge** (OpenAI, OpenAI-kompatibel eller Gemini) läser frågan, det förväntade utfallet och svaret, och returnerar en poäng med en enradig motivering. Den körs vid temperature `0`, eller vid `low` reasoning effort för en reasoning-modell, så att samma svar får samma bedömning.
- **En decision model-judge** bedömer svaret enligt en femgradig rubric, från *Completely off* till *Fully matches*. Poängen är den sannolikhetsviktade positionen på denna rubric, så den kommer från en fördelning som modellen har beräknat snarare än ett tal den har skrivit.

Cellens hover-kort visar judgens motivering, eller för en decision model nivån, poängen och dess konfidens. Latency och tokens beskriver modellen som testas; judgens egna anrop visas i [Traces](./traces-tab.md) under källan **Evals**. Modellväljaren utelämnar Model Router-credentials, eftersom en eval jämför specifika modeller.

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
