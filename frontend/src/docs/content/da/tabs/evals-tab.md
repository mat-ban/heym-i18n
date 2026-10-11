# Evalueringer-fane

**Evalueringer**-fanen er en separat side på `/evals`. Her kan man oprette evalueringssuiter, definere testcases og køre evalueringer af [Agent](../nodes/agent-node.md)-workflows.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Se Evalueringer-demo</a></p>

## Adgang

- Klik på **Evalueringer** i dashboardets fanebjælke
- Eller naviger til `/evals`
- Eller brug **Ctrl+K** (Cmd+K) og vælg "Evalueringer" fra kommandopaletten

## Evalueringer-suiter

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
- **Temperatur** – Indstil modeltemperatur (`Exact Match` og `Contains`)
- **Ræsonneringsindsats** – Indstil ræsonneringsindsats for ræsonneringsmodeller (`Exact Match` og `Contains`)

### LLM-as-Judge

Med en dommer svarer hver model på testinputtet med kun suite-prompten, hvorefter dommeren vurderer hvor tæt svaret matcher det forventede output på en skala fra 0 til 100:

- **En modeldommer** (OpenAI, OpenAI-kompatibel eller Gemini) læser spørgsmålet, det forventede output og svaret, og returnerer en score med en en-linjes begrundelse. Den kører ved temperatur `0`, eller ved `low` ræsonneringsindsats for en ræsonneringsmodel, så det samme svar får samme vurdering.
- **En beslutningsmodeldommer** bedømmer svaret på en fem-niveaus rubrik, fra *Helt forkert* til *Fuldstændig match*. Scoren er den sandsynlighedsvejede position på rubrikken, så den kommer fra en distribution som modellen har beregnet snarere end et tal den har skrevet.

Hover-kortet på cellen viser dommerens begrundelse, eller for en beslutningsmodel niveauet, scoren og dens tillid. Latens og tokens beskriver den testede model; dommerens egne kald vises i [Kørsler](./traces-tab.md) under kilden **Evalueringer**. Modelvælgeren udelader Model Router-legitimationsoplysninger, da en evaluering sammenligner specifikke modeller.

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
