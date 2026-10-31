# Evalueringer-fane

**Evalueringer**-fanen er en separat side på `/evals`. Her kan man oprette evalueringssuiter, definere testcases og køre evalueringer af [Agent](../nodes/agent-node.md)-workflows. En [agentsuite](#agent-suites) kører en agent eller læser dens reelle kørsler samt kontrollerer de værktøjer, den kalder, dens latenstid, dens omkostning i USD, dens tokens og dens antal værktøjskald.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Se Evalueringer-demo</a></p>

## Adgang

- Klik på **Evalueringer** i dashboardets fanebjælke
- Eller naviger til `/evals`
- Eller brug **Ctrl+K** (Cmd+K) og vælg "Evalueringer" fra kommandopaletten

## Evalueringer-suiter

- **Ny suite** – Vælg **Promptsuite** for at teste en systemprompt på tværs af modeller, eller **Agentsuite** for at kontrollere en agents reelle kørsler (se [Agentsuiter](#agent-suites))
- **Suitevælger** – Viser prompt- og agentsuiter sammen med typen ved siden af hvert navn; skriv for at søge
- **Opret suite** – Definer en suite med navn og beskrivelse
- **Vælg workflow** – Vælg hvilket workflow der skal evalueres
- **Vælg legitimationsoplysninger** – API-nøgle til at køre workflowet
- **System-prompt** – Rediger suite-niveauets system-prompt direkte i venstre panel
- **Optimér Prompt** – Bed en LLM om at forbedre den aktuelle system-prompt

## Testcases

- Tilføj testcases med input-prompts og forventede outputs
- Hver case kan have en brugerdefineret forventet værdi til sammenligning
- Rediger eller slet cases fra suiten
- **Generer testdata** – Brug de valgte legitimationsoplysninger/model til automatisk at oprette testcases fra suite-prompten

## Kørsel af evalueringer

- **Vælg en eller flere modeller** – Kør samme suite mod flere modeller i én evaluering
- **Scoringsmetode** – Vælg mellem `Exact Match`, `Contains` eller `LLM-as-Judge`
- **Dommer** – For `LLM-as-Judge` kan der valgfrit vælges en OpenAI, OpenAI-kompatibel (Custom), Gemini (Google) eller [Decision Model](../nodes/decision-node.md)-legitimationsoplysning og indtastes dommerens model (f.eks. `gpt-4o-mini` eller `jev-latest`) for at score med en uafhængig dommer
- **Kørsler pr. test** – Gentag hver testcase flere gange i én kørsel
- **Huskede indstillinger** – En suite åbner med indstillingerne fra dens seneste kørsel: legitimationsoplysning, modeller, scoringsmetode og dommer, temperatur, ræsonneringsindsats og kørsler pr. test. Åbning af en tidligere kørsel indlæser dens indstillinger, så **Genkør evalueringer** gentager samme test
- **Temperatur** – Indstil modeltemperatur (`Exact Match` og `Contains`)
- **Ræsonneringsindsats** – Indstil ræsonneringsindsats for ræsonnerende modeller, fra Lav til Ekstra høj og Maks ligesom ved LLM- og Agent-knuder (`Exact Match` og `Contains`)

### LLM-as-Judge

Med en dommer svarer hver model på testinputtet med kun suite-prompten, hvorefter dommeren vurderer hvor tæt svaret matcher det forventede output på en skala fra 0 til 100:

- **En modeldommer** (OpenAI, OpenAI-kompatibel eller Gemini) læser spørgsmålet, det forventede output og svaret, og returnerer en score med en en-linjes begrundelse. Den kører ved temperatur `0`, eller ved `low` ræsonneringsindsats for en ræsonneringsmodel, så det samme svar får samme vurdering.
- **En beslutningsmodeldommer** bedømmer svaret på en fem-niveaus rubrik, fra *Helt forkert* til *Fuldstændig match*. Scoren er den sandsynlighedsvejede position på rubrikken, så den kommer fra en distribution som modellen har beregnet snarere end et tal den har skrevet.

Cellens svævekort viser dommerens begrundelse eller, for en beslutningsmodel, niveauet, scoren og dens konfidensgrad. Latenstid og tokens beskriver modellen, der testes; dommerens egne kald vises i [Sporinger](./traces-tab.md) under kilden **Evalueringer**. Dommervælgeren udelader Model Router-legitimationsoplysninger, da en dommer skal være én fast model. Legitimationsoplysningen for modellerne, der testes, kan være en [Model Router](../reference/credentials.md#model-router-auto-model): dens **Auto**-model vælger en model pr. anmodning på samme måde som i et workflow.

Uden dommer svarer hver model og scorer sit eget svar i en enkelt anmodning.

Temperatur og ræsonneringsindsats er skjulte i denne tilstand, og kørslen bruger faste indstillinger: temperatur `0.7` for standardmodeller og `medium` ræsonneringsindsats for ræsonneringsmodeller (`low` når de scorer deres egne svar).

## Resultater

- Se bestået/ikke bestået pr. testcase
- Inspicer faktiske vs forventede outputs
- Sammenlign outputs pr. model side om side, når en kørsel inkluderer flere modeller
- Gennemgå kørselshistorik for tidligere evalueringer; en `LLM-as-Judge`-kørsel viser sin dommermodel i historiklisten
- Åbn tidligere kørsler fra resultatpanelet og inspicer gemte prompt/input/output-snapshots
- Ved åbning af en tidligere kørsel indlæses dens scoringsmetode og dommer i venstre panel, så **Kør Evalueringer Igen** gentager den samme evaluering
- **Eksportér** downloader kørslen som JSON, inklusive `judge_credential_id` og `judge_model`

## Agent Suites

En agentsuite kontrollerer en [Agent](../nodes/agent-node.md)-knude i forhold til dens kørsler. Den læser dem fra [Sporinger](./traces-tab.md), hvor hver kørsel allerede registrerer tid, tokens, omkostninger og værktøjskald, og den kan også køre workflowet for én.

Opret en via **Ny suite** → **Agentsuite** og følg tre trin:

1. **Agent** – Vælg workflowet og derefter dets agentknude. Kun workflow med en agentknude vises; et workflow eller en agent, der endnu ikke har kørt, vises, men kan ikke vælges. Indstillingerne for den valgte agent (model, instruktioner, værktøjer og grænser) vises til højre, og et skrivebeskyttet lærred af dens workflow med agenten fremhævet vises nedenfor.
2. **Baseline** – Agentens seneste 10 kørsler: latenstid p50 og p95, omkostning pr. kørsel, tokens pr. kørsel og værktøjskald pr. kørsel, hvilke værktøjer der blev kaldt og hvor ofte, samt hver kørsels egne tal. Kørsler, der endte med en fejl, vises, men udelades fra baseline.
3. **Kontroller** – Markér hvert værktøj som **Must call**, **Must not call** eller **Either**. Hver type kald er angivet med sin type: Python- og knudeværktøjer, **MCP**-værktøjer med deres server, **underagenter** efter etiket, **underordnede workflow** efter navn samt **skills**. Tilføj et værktøj efter type og navn, hvis det endnu ikke har kørt, og fjern det med dets **X**. Indstil øvre grænser for latenstid, omkostninger, samlede tokens og værktøjskald; hver starter 20 % over baseline-p95 og kan deaktiveres.

En gemt suite åbner på **Resultater** med **Baseline** og **Rediger kontroller** ved siden af:

- **Kør workflowet** – Vælg antallet af kørsler (op til 20); fire kører samtidigt. Inddata udfyldes fra workflowets seneste kørsel og kan redigeres, og hver kørsel anvender dem. Slå **Generer inddata** til (stjerneikonet), og vælg derefter en legitimationsoplysning og model for at lade modellen generere forskellige inddata for hver kørsel. Den læser agentens systeminstruktioner og holder sig tæt til de indtastede værdier: indtastning af et bynavn giver andre bynavne. Hver kørsel udfører hele workflowet ligesom enhver normal kørsel og vises i Kørselshistorik med triggeren `agent_suite`. For at springe senere trin over, f.eks. afsendelse af e-mail, åbn workflowet med **Gå til workflow** i panelet og deaktiver disse knuder først. **Stop** afslutter en suitekørsel: ingen nye kørsler starter, og igangværende kørsler annulleres. En suitekørsel, hvis server stoppede, for eksempel under en genstart, vises som afbrudt efter et minut i stedet for at forblive blokeret.
- **Resultater** – Den seneste suitekørsel bedømmes som standard. Hver suitekørsel bevares med sin dato i kørselvælgeren, hvor den kan åbnes eller slettes; eller skift til de seneste 10, 20 eller 50 kørsler for agenten for at inkludere dens øvrige kørsler. Man ser beståelsesprocenten, hvor ofte hver kontrol bestod, latenstid, omkostninger, tokens og værktøjskald ved siden af den gemte baseline, samt hver kørsel med årsagen til fejl og et link til dens sporing.
- **Gå til workflow** åbner agentens workflow i en ny fane. I navnefeltet sletter **Esc** eller **X** teksten.

Hvordan tallene fortolkes:

- **Latenstid** er modellens tid plus tiden for kørslens værktøjskald.
- **Omkostning** anvender samme priser som Traces. En kørsel med en model uden pris springer omkostningskontrollen over i stedet for at fejle.
- En kørsel **består**, når den er afsluttet uden fejl, og alle kontroller er godkendt.
- Suiten læser udelukkende egne sporinger, i henhold til samme regel som fanen Sporinger.
- **Brug seneste kørsler som baseline** i **Rediger kontroller** erstatter den gemte baseline med agentens seneste kørsler.

En suites baseline stammer fra én af tre kilder. **Rediger kontroller** viser, hvilken der er aktiv ved siden af **Gemt baseline**:

- agentens seneste kørsler (standarden og hvad **Brug seneste kørsler som baseline** tager),
- en afsluttet suitekørsel,
- manuelt indtastede tal.

De to sidstnævnte indstilles fra [Chat](./chat-tab.md#working-with-evals) eller via API:

- `PATCH /api/evals/agent-suites/{id}` modtager `baseline: {"source": "suite_run", "run_id": "…"}` eller `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` modtager `inputs_list`: ét inddataobjekt pr. kørsel, op til 20.

### Fra Chat og MCP

[Chat](./chat-tab.md#working-with-evals) og MCP-værktøjet `heym_chat` kan oprette, ændre og køre prompt- og agentsuiter:

- De udformer selv testtilfælde og kørselsinddata.
- De spørger, hvilken legitimationsoplysning der skal anvendes, før en promptsuite oprettes, medmindre kun én passer.
- De linker til hver suite, de nævner på denne side.

## Benchmark Matrix-ideer

Når der bygges en benchmark matrix for agent-workflows, skal HITL-scenarier inkluderes som førsteklasses cases i stedet for at behandle dem som edge cases.

- Dæk alle tre beslutningstyper: `accepted`, `edited` og `refused`
- Inkluder flere triggerkilder såsom editor-kørsler, portal, curl/webhook og cron-triggerede kørsler
- Tilføj gentagne-review-scenarier hvor en agent-kørsel sættes på pause mere end én gang
- Verificer notifikationsgrene forbundet til agentens `review`-output
- Bekræft downstream-adfærd efter afvisning, især hvis senere noder forgrener sig på `$agent.decision`

## Relateret

- [Hvorfor Heym](../getting-started/why-heym.md) – Evalueringer som teststadiet i agentens livscyklus
- [Agent Node](../nodes/agent-node.md) – Workflows der evalueres
- [Legitimationsoplysninger-fane](./credentials-tab.md) – Legitimationsoplysninger til evalueringskørsler
- [Kørsler-fane](./traces-tab.md) – Detaljeret kørselseftersyn
- [Workflows-fane](./workflows-tab.md) – Opret workflows til evaluering
- [Kørselshistorik](../reference/execution-history.md) – Se tidligere kørsler (Historik-knap i header)
- [Kontekstuel Showcase](../reference/contextual-showcase.md) – Kompakt sideguide tilgængelig på evalueringssiden
