# Kørselshistorik

Kørselshistorik registrerer workflow-kørsler: inputs, outputs, node-resultater, status og triggerkilde. Den kan bruges til at overvåge en aktiv produktionskørsel, inspicere tidligere kørsler, fejlfinde fejl eller genkøre med de samme inputs via **Bring to Canvas**.

## Oversigt

Hver kørsel gemmer:

| Felt | Beskrivelse |
|-------|-------------|
| **Inputs** | Request-body eller kørselsinputs (f.eks. `text` for Input-node) |
| **Outputs** | Outputs på workflow-niveau |
| **Node-resultater** | Outputs, status og eksekveringstid pr. node |
| **Status** | `success`, `error`, `pending`, `skipped` eller `failed` (se [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Hvordan kørslen blev udløst (se [Triggers](./triggers.md)) |

## Adgang til historik

| Placering | Omfang |
|----------|-------|
| **Editor**-værktøjslinje | Kun det aktuelle workflow |
| **Docs**-visningshoved | Kun det aktuelle workflow |
| **Dashboard**-hoved (Chat-fane) | Alle workflows + chat/assistant-kørsler |
| **Evals**-visningshoved | Alle workflows + chat/assistant-kørsler |

Klik på **History**-knappen (ur-ikon) for at åbne dialogen.

## Pr. workflow vs. al historik

- **Pr. workflow** (Editor, Docs): Viser kørsler for det åbne workflow. Brug **Clear history** for at fjerne kørsler kun for det pågældende workflow.
- **Al historik** (Dashboard, Evals): Viser kørsler på tværs af alle workflows og chat/assistant-sessioner. Dækning matcher workflow-adgang: workflows der ejes, workflows delt direkte, og workflows delt med et team man tilhører. Brug **Clear all history** for at fjerne alle egne poster. Historik for delte workflows bevares.

## Bring to Canvas

**Bring to Canvas** indlæser en valgt kørsels inputs og node-outputs i det aktuelle workflow.

### Hvad der indlæses

- **Inputs** → Run input-panel (f.eks. `text` for Input-node eller brugerdefinerede felter)
- **Node-resultater** → Execution result-panel viser tidligere outputs pr. node
- **Kørselsresultat** → Status, outputs og timing fra kørslen

### Adfærd efter kontekst

- **I Editor** (pr. workflow-historik): Anvendes umiddelbart på det åbne workflow og lukker dialogen.
- **Fra al historik** (Dashboard/Evals): Navigatorer til workflow-editoren og anvender derefter dataene når editoren indlæses. Kun tilgængelig for workflow-kørsler - ikke for chat/assistant-kørsler.

### Deep link til kørsel

Ved åbning af et workflow på `/workflows/{workflowId}/{executionId}` bringes den pågældende kørsel automatisk på canvas - det samme som at vælge kørslen og vælge **Bring to Canvas**. Dette gør en specifik tidligere kørsel delbar som en URL. Hvis kørslen ikke kan findes (forkert eller slettet id), falder editoren tilbage til at indlæse det almindelige workflow.

### Anvendelsestilfælde

- Genkør et workflow med de samme inputs
- Fejlfinding af en mislykket kørsel ved inspektion af inputs og node-outputs
- Sammenligning af outputs på tværs af kørsler

## Spørg AI

Begge historikdialoger har en **Spørg AI**-knap (stjerneikon) ved siden af titlen. Den åbner [fanen Chat](../tabs/chat-tab.md#asking-about-a-run) i en ny samtale med workflowet og den valgte kørsel vedhæftet som fjernbare brikker. Spørg om, hvorfor kørslen var langsom, hvad der fejlede, eller få Chat til at rette workflowet. Chat læser præcis denne kørsel, herunder dens sporing og fejl pr. node.

I dialogen All History vises **Spørg AI** kun, når en workflow-kørsel er valgt; chat- og assistentkørsler viser den ikke.

## Tidslinje for kørsel

I kørselsdetaljerne bytter knappen **Tidslinje** (stopursikon) ved siden af **Udvid alle** listen **Trin** ud med en span-tidslinje. Mens tidslinjen vises, hedder den samme knap **Logfiler**; klik på den for at vende tilbage til listen. I All History vises knappen kun for workflow-kørsler. Tidslinjen tegner en bjælke pr. node på det tidspunkt, den startede, så det er tydeligt, hvilken node der tog hvor lang tid, og hvilke der kørte parallelt. Før markøren over en bjælke for at se dens varighed; klik på den for at åbne det samme detaljeinspektionspanel som editorens [kørselstidslinje](#execution-timeline-details). Den valgte visning bevares, så længe dialogen er åben.

Kørsler, der er registreret før noders starttidspunkter blev gemt, vises efter hinanden i rækkefølge efter varighed.

## Kørselshøjdepunkter

Efter en live-kørsel - eller efter **Bring to Canvas** - vises en afviselig **Execution Highlights**-popup i **øverste højre hjørne af Canvas**. Det er en hurtig måde at se *hvad hver node producerede*, listet fra top til bund i kørselsrækkefølge. Luk den med **✕**; den genåbnes ved næste kørsel.

### Hvad der vises

| Post | Kilde | Auto? |
|--------|--------|-------|
| **Input** | Kørslens inputparametre (input/trigger-node) | Ja |
| **Output** | Output-nodens resultat - eller, hvis ingen findes, den sidste nodes besked | Ja |
| **Agent / LLM** | Hver agent- eller LLM-nodes output | Ja |
| **Output** | Enhver anden node med **Highlight Node Output** aktiveret | Opt-in |

Noder der allerede er auto-fremhævet (input/output/sidste/agent/llm) vises aldrig to gange, selv hvis toggle også aktiveres.

### Hver post

- Viser `Node — message…` med de første **250 tegn**; klik på en række for at udvide den og gengive den **fulde besked som Markdown**, med en **Copy**-knap.
- En node der kørte flere gange (f.eks. i en løkke) viser `Node (N)` med en `‹ i / N ›`-vælger - vælg hvilken kørsel der skal vises; hver nodes vælger er uafhængig.

### Highlight Node Output

Hver node **undtagen Agent og LLM** har en **Highlight Node Output**-afkrydsningsboks i dens egenskabspanel (standard fravalgt). Aktiver den for at tilføje nodens output til popuppen. Et lille ✦-mærke vises på fremhævede noder på canvas. I [workflow DSL](./expression-dsl.md) er dette node-datafeltet `"highlight": true` (standard `false`).

### På dashboards

Dashboard-widgetkort der kørte et workflow viser en ✦ **Execution highlights**-knap i korthovedet; klik på den for at åbne samme popup for den widgets kørsel, med widgetens tegnede output som den fremtrædende post.
## Kørsler i gang

Begge historik-dialoger viser **kørsler i gang** øverst på listen, før tidligere kørsler.

- En roterende indikator og etiketten **Kører** vises sammen med starttiden
- Klik på **Åben live** for at tilknytte editoren til den pågældende kørsel uden at genstarte den
- Canvas'en gendanner først noder, der allerede er afsluttet, og modtager derefter
  `node_start`, `node_complete` og afsluttende kørselshændelser via SSE
- Den aktuelle node pulserer på canvas'en, nedstrømsnoder bevarer deres afventende animation, og
  Debug-panelet tilføjer hvert resultat, når det ankommer – præcis som ved en kørsel startet fra editoren
- Klik på **Annuller** for at stoppe kørslen med det samme
- Annullering fra enhver dialog (Editor eller Dashboard) lukker også den aktive SSE-strøm i enhver åben canvas-fane for det pågældende workflow, så editor-tilstanden nulstilles korrekt
- Efter annullering forsvinder den kørende post ved næste opdatering; tryk på **Opdater** for at opdatere listen manuelt
- Hvis en allerede afsluttet kørsel annulleres, har anmodningen ingen effekt

Kørsler, der venter på en [samtidigheds-slot](./webhooks.md#concurrency-limit-and-queued-runs), er opført i samme sektion med en **Queued 2/5**-etiket, deres placering i køen og køens størrelse. De har ingen **Open live**-knap, fordi intet kører endnu; **Cancel** fjerner en ventende kørsel fra køen og registrerer den som `cancelled`. En kørsel, der ventede længere end workflowets maksimale ventetid, registreres som `expired`, og en kørsel afvist af en fuld kø som `queue_full`; begge har deres eget badge på kørselslisten.

Den live URL er `/workflows/{workflowId}/{executionId}`. Observatøren er skrivebeskyttet: ved at forlade
editoren afbrydes kun den browserfane og workflowet stoppes aldrig. Aktive snapshots
deles via PostgreSQL, så det stadig er muligt at åbne en kørsel, selv når triggeren og editor-anmodningen
lande på forskellige backend-arbejdere.

## Genoprettelse efter nedbrud

Hvis serveren genstartes (deployment, container-genstart eller nedbrud) under en workflow-kørsel, stopper den pågældende kørsel midt i eksekveringen. Heym genopretter automatisk disse afbrudte kørsler i stedet for at lade dem hænge som **Kører**.

- Ved næste opstart registrerer den valgte lederproces forældreløse kørsler – øjeblikkeligt ved en elegant genstart eller inden for ~60 sekunder ved et hårdt nedbrud (når hjerteslag tydeligt er stoppet).
- Genoprettede kørsler **køres forfra med de samme input** (ikke genoptages fra hvor de stoppede) ved hjælp af den aktuelle workflow-definition. Ved afslutning registreres en normal terminalpost (f.eks. `success`), så historikken viser kørslen som afsluttet.
- En kørsel genforsøges **én gang**. Hvis genopretningsforsøget også afbrydes – eller workflowet er blevet slettet siden – registreres posten som `failed`.
- Dette fungerer ens på tværs af en enkelt container og multi-worker-deployments; kun lederen udfører genoprettelse, så en kørsel aldrig genoprettes to gange af forskellige arbejdere.

### Automatisk genoprettelse-tilvalg

Editor-panelet **Kørselslog** har en **Auto-recover**-afkrydsningsboks, som **standard er aktiveret** per workflow.

- **Til**: Afbrudte kørsler af dette workflow genkøres som beskrevet ovenfor.
- **Fra**: Afbrudte kørsler genkøres ikke og registreres med status `skipped`.

> Underworkflow-kørsler genoprettes ikke uafhængigt – de genkøres af deres genoprettede overordnede kørsel. Triggers med egen leveringsgaranti (RabbitMQ, scheduled/cron, IMAP) kan også levere igen ved genstart, så en genoprettet kørsel lejlighedsvis kan eksekveres to gange.

## Afventer menneskelig gennemgang

Kørsler, der sættes på pause til [Human-in-the-Loop](./human-in-the-loop.md)-godkendelse, skrives straks til historikken med status `pending`.

- Den afventende agent-node gemmer en gennemgangs-payload inklusive `reviewUrl`, `draftText` og `expiresAt`
- Eventuelle noder forbundet til agentens `review`-håndtag kan også køre, før mennesket svarer, og deres node-resultater gemmes i samme afventende historikpost
- Historik-dialoger viser gennemgangslinket, så ejere kan kopiere eller åbne det
- Historik-dialoger og editorens Debug-panel viser den endelige menneskelige beslutning, efter kørslen genoptages
- Når en gennemganger accepterer, redigerer eller afviser kladden, opdateres den samme historikpost med det endelige kørselsresultat
- Hvis den samme kørsel sættes på pause til HITL flere gange, forbliver historikposten den samme, mens hvert checkpoint får sit eget engangs-gennemgangslink

Dette er særligt nyttigt til portal-kørsler og langtids-workflows, der måske venter timer eller dage, før de fortsætter.

## Kopier

Brug **Kopier** ved siden af Inputs eller Outputs for at kopiere JSON'en til udklipsholderen.

## Ryd historik

- **Per workflow**: I Editor-historik-dialogen klikkes på **Ryd historik** for at fjerne kørsler for det aktuelle workflow.
- **Hele historikken**: I Dashboard/Evals-historik-dialogen klikkes på **Ryd alt historik** for at fjerne alle kørselsposter, der ejes. Kørsler fra delte workflows bevares. Denne handling kan ikke fortrydes.

## Detaljer for kørsels-tidslinje

Når editor-panelet **Kørselslog** er åbent, klikkes på timer-knappen for at vise kørsels-tidslinjen. Vælg et interval for at åbne en inline-detaljeinspector, der overtager rækkeområdet. Den viser det valgte trins status, varighed, antal forsøg, genforsøgsinformation, fejl, trace-ID og en kompakt output-eksempel. Objekt- og array-output bruger den samme `JsonTree`-fremviser som resten af Debug-panelet; skalarværdier bruger en tekst-eksempel. Når et trin outputter billeder (Playwright-skærmbilleder, genererede billeder, billedfiler eller base64-billeder i en anmodningskrop, fundet hvor som helst i outputtet), vises de som miniaturebilleder over outputtet, og JSON'en viser en kort pladsholder i stedet for den rå base64. Klik på et miniaturebillede for at åbne det i en lightbox; pileknapperne eller ←/→-tasterne gennemgår alle billeder i kørslen med en tæller som f.eks. `2 / 5`. Brug **Åben trace** til LLM- og Agent-intervaller, når en trace-ID er tilgængelig.
## Node-detaljer på mobil

På en telefon viser editoren et workflow-træ i fuld skærm i stedet for det fritformede canvas. Ved at trykke på en tree-node med et registreret resultat åbnes kørslen som en fuldskærmsdetalje. Visningen giver adgang til separate faner for **Input Data**, **Output Data** og **Errors**. Output-fanen viser det registrerede resultat og tilbyder **Copy Output**; input-fanen viser nodens konfiguration, og errors-fanen viser den registrerede fejl, hvis noden fejlede. Brug **Back to workflow** eller luk-knappen for at vende tilbage til træet.

Canvas og dashboardets historik-dialoger beholder deres kørselskontroller på én række og placerer de tilgængelige tag- og instansfiltre i et responsivt grid. Deres filtermenuer bruger den samme in-app-vælger, så det valgte markeringstegn har en konsistent margen og basislinje med hver enkelt optionslabel.

## Relateret

- [Triggers](./triggers.md) – Sådan startes workflows; historikken registrerer `trigger_source` (inklusive `board` for kørsler startet af [Board](../tabs/board-tab.md)-kortflytninger og opfølgninger)
- [Human-in-the-Loop](./human-in-the-loop.md) – Afventende gennemgangs-URL'er og genoptagelsesadfærd
- [Redigeringshistorik](./edit-history.md) – Versionskontrol for workflow-gemninger (tilbagefør, diff)
- [Hurtig start](../getting-started/quick-start.md) – Byg og kør det første workflow
- [Workflows-fanen](../tabs/workflows-tab.md) – Opret og administrer workflows
