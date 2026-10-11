# Workflows-fanen

**Workflows**-fanen er standarddashboardet. Den viser workflow-listen, mappestrukturen og giver mulighed for at oprette, redigere og organisere workflows.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Se Workflows-demo</a></p>

## Start en Chat

Over workflow-listen findes en chatboks, der hilser ved navn og spørger, hvad der ønskes automatiseret. Indtast en prompt, vedhæft eventuelt én fil, og vælg de ønskede legitimationsoplysninger og model. Begge dropdown-lister er søgbare og starter med de [standardindstillinger for AI](../reference/user-settings.md).

Ved afsendelse oprettes en ny samtale, der åbnes i [Chat-fanen](./chat-tab.md), hvor svaret streames ind. Understøttede vedhæftninger er tekstfiler, billeder og PDF'er - én pr. besked, som i chatkomponisten.

Hvis der ikke er konfigureret nogen LLM-legitimationsoplysninger, vises et link til [Legitimationsoplysninger-fanen](./credentials-tab.md), og afsendelse deaktiveres.

Klik på **x** for at skjule boksen. En **Ask AI**-knap vises derefter ved siden af Workflows-overskriften for at genåbne den. Valget gemmes i browseren.

## Workflow-liste

Listen vises som to paneler: workflows og mapper til venstre, en forhåndsvisning af det valgte workflow til højre.

- Hver række viser workflow-ikonet, navn, beskrivelse, seneste opdateringstidspunkt og en [statusmarkør](#workflow-status)
- Workflows kan placeres i roden eller i mapper, og fastgjorte workflows vises i en separat **Pinned**-gruppe øverst
- **Klik** på en række for at vælge den og indlæse forhåndsvisningen til højre
- **Dobbeltklik** på en række, eller tryk på **Enter** når den er i fokus, for at åbne den i [editoren](../getting-started/quick-start.md)
- Brug **Ctrl+klik** (eller **Cmd+klik**) for at åbne i en ny fane
- Hver række indeholder redigerings-, kopierings-, fastgørelses- og sletningshandlinger til højre. På telefoner skjules disse, så navnet fylder hele bredden; **langt tryk** på en række åbner handlingsarket
- Fastgør ofte brugte workflows i [Quick Drawer](../reference/quick-drawer.md) for hurtig adgang fra Workflows-fanen og andre interne sider

## Workflow-forhåndsvisning

Ved valg af et workflow indlæses forhåndsvisningspanelet ved siden af listen. På skærme smallere end 1280px åbnes panelet som et ark fra skærmens bund i stedet.

Panelet viser:

- Workflow-navn, opretter og oprettelsestidspunkt samt seneste redigering
- **Open Workflow** - åbner workflowet i editoren
- **Run Now** - åbner workflowet i [Quick Drawer](../reference/quick-drawer.md), hvor input udfyldes og køres uden at forlade listen
- **Description** - workflow-beskrivelsen
- **Trigger Configuration** - tidsplanen for cron-workflows eller triggeren for event-workflows. Workflows, der aktiveres via HTTP, viser en **Copy cURL**-knap i stedet for raw endpoint og auth-tekst: den kopierer en komplet anmodning med korrekt URL, headers, auth-placeholder og en body baseret på workflowets inputfelter. Når workflowet publicerer et [portal](../reference/portal.md), vises dets offentlige chatlink også her
- **Last Run Details** - resultatet og varigheden af den seneste kørsel, eller en note om at workflowet aldrig er kørt
- **Workflow Steps & Sub-agents** - noderne i udførelsesrækkefølge, hver med sin model, operation eller tidsplan og en prik, der viser om den er aktiv. Valg af et trin åbner den pågældende node i editoren med dens egenskabspanel allerede åbent

Panelet forbliver fastgjort ved siden af listen under rulning, så det altid er læsbart selv i lange workflow-lister.
## Instansadministration

Konti angivet i `HEYM_ADMIN_EMAILS` kan liste, åbne, redigere, inspicere kørselshistorik og slette ethvert workflow på instansen uden deling eller ejerskabsoverdragelse. Indstillingen er en kommasepareret liste af e-mailadresser, der matches uden hensyn til store og små bogstaver. En tom liste giver ingen adgang. Backend skal genstartes efter ændring.

Administratorer ser ejerens e-mail i workflow-listen og kan søge efter denne adresse. Ved at vælge et workflow åbnes **Instansadministration** i dets forhåndsvisning:

1. **Pause triggers** vises kun for workflows, der indeholder en Cron-node. Det deaktiverer workflowets Cron- og andre automatiske trigger-noder gennem en normal versioneret gemning. Eksisterende kørsler kan afsluttes. Manuel, API, portal- og sub-workflow-kald forbliver tilgængelige; denne handling er ikke en workflow-låsning.
2. Knappen ændres til **Resume triggers** under pause, også efter en sidegenindlæsning. Genoptagelse aktiverer de triggers, der er blevet sat på pause af administratoren, og lader allerede deaktiverede triggers være uændrede. For ældre pausede workflows uden gemt admin-pausetilstand aktiverer Genoptagelse deres automatiske triggers.
3. Brug **Delete workflow**-handlingen i workflow-rækken, når kørsler er afsluttet. Sletning returnerer en konflikt, hvis der stadig kører, venter i kø eller afventer gennemgang. Planlagt sletning anvender samme kontrol.

Paus triggers og lad eksisterende kørsler afsluttes før sletning. En trigger, der allerede er afsendt under pause, kan stadig afsluttes. Brug sletning, når workflowet ikke længere må kunne kaldes.

Ejer-specifikke webhook-hemmeligheder og godkendelsesindstillinger bevarer deres eksisterende beskyttelse. Administration overfører ikke ejerskab eller deler ejerens legitimationsoplysninger. Administrative pauser, genoptagelser, sletninger og planlægninger vises i [revisionsloggen](../reference/audit.md) med den handlende administrator og workflow-ejer.

## Workflow-status

Hver række indeholder en statuschip afledt af workflowets trigger-noder, dets aktive kørselsstatus og - for workflows uden trigger-node - hvordan dets seneste kørsel blev startet:

| Status | Betydning |
| --- | --- |
| **Running** | Workflowet har en kørsel i gang lige nu |
| **Scheduled** | Har en aktiv [cron](../nodes/cron-node.md)-trigger |
| **Listening** | Har en aktiv begivenhedstrigger, f.eks. Slack, Telegram, IMAP eller WebSocket-trigger |
| **Paused** | Har trigger-noder, men alle er deaktiveret |
| **API** | Har ingen trigger-noder og blev senest kørt via HTTP-kald til dets execute-endpoint |
| **SubWorker** | Har ingen trigger-noder og blev senest kørt som sub-workflow af et overordnet workflow |
| **Portal** | Har ingen trigger-noder og blev senest kørt fra dets [portal](../reference/portal.md) |
| **WEB** | Har ingen trigger-noder og dets eneste terminal er en [HTML output mapper](../nodes/html-output-mapper-node.md), så kald returnerer en renderet webside |
| **Manual** | Har ingen trigger-noder og har aldrig kørt, eller dets seneste kørsel kom fra anden kilde |
| **Remove Scheduled** | Er [planlagt til sletning](../reference/workflow-organization.md) |

API-, SubWorker- og Portal-chips læser det seneste enkelte indslag i workflowets [kørselshistorik](./logs-tab.md), så et workflow, der kaldes på to måder, viser den seneste. **WEB** bestemmes fra grafen, så den har forrang: en side-leverende workflow viser WEB selv efter HTTP-kald. Trigger-noder har altid højeste prioritet: et cron-workflow, der også kaldes via HTTP, forbliver **Scheduled**.

Brug **Status**-dropdown ved søgefeltet for kun at vise én status. Dropdown viser antallet af workflows, der matcher hver status. Statusfilter virker også i mapper: mapper med match udvides automatisk, og mapper uden skjules indtil filteret fjernes.

## Aktive workflows

På desktop viser den cirkulære badge i værktøjslinjen øverst, hvor mange workflows der kører, og opdateres automatisk hvert 10. sekund. Klik på en ikke-nul badge for at åbne listen over aktive workflows, der viser op til fire rækker før scrolling. Vælg et workflow-navn for at tilknytte editoren til den kørsels live-visning. Nul-badgen er informativ og kan ikke åbnes, og badgen skjules på mobile skærme.

## Søgning

Brug workflow-søgefeltet ved siden af **Status**, eller tryk **Ctrl+F** (eller **Cmd+F**), for at filtrere workflows efter titel eller beskrivelse. Matchende workflows i mapper vises med deres mappegren udvidet. Tryk **Escape** for at rydde søgningen.
## Mapper

- Organiser workflows i [mapper og undermapper](../reference/workflow-organization.md)
- Opret mapper med knappen **Ny mappe**, hvor hver mappe gives et navn og en valgfri beskrivelse, der vises under navnet i listen
- Hver mapperække viser, hvor mange workflows den indeholder, inklusive undermapper, sammen med handlinger til at oprette undermappe, omdøbe, ændre ikon, downloade som ZIP og slette. På telefoner vises rækken med en enkelt menuknap i stedet
- Træk et workflow over en mappe eller undermappe for at se en kortstørrelses forhåndsvisning af destinationen. Den markerede forhåndsvisning viser den fulde mappesti, før der slippes, og ved at holde markøren over en sammenfoldet mappe udvides den kortvarigt, så det er muligt at nå indlejrede mapper
- Træk workflows mellem mapper eller til roden. Det trække kort forbliver synligt som et spøgelse, og den aktive destination forbliver markeret, mens der scrolles
- Det er deaktiveret at slippe et workflow tilbage i den nuværende mappe, og det markeres med **Allerede i mappe**
- Omdøb en mappe eller ændr dens beskrivelse via omdøbningshandlingen eller højreklik-menuen

## Oprettelse af workflows

1. Klik på **Nyt workflow**
2. Indtast et navn og en valgfri beskrivelse
3. Workflowet åbnes i editoren

## Import

Træk og slip en JSON-workflowfil over workflowområdet for at oprette et nyt workflow. De importerede noder og kanaler bruges til at oprette workflowet; navnet hentes fra `name`-feltet i JSON'en eller filnavnet. Se [Download & Import](../reference/download-import.md) for JSON-formatet og importmuligheder.

## Deling

Åbn et workflow i editoren og klik på **Del** for at invitere brugere via e-mail eller dele med et [team](./teams-tab.md). Vælg **Læse** (vis og kør) eller **Skrive** (også rediger) for hver bruger eller team, og ændr det senere fra dropdown-menuen ved siden af posten. Legitimationsoplysninger og under-workflows deles ikke automatisk; del disse separat med de samme brugere eller teams. Se [Workflow-organisation](../reference/workflow-organization.md#sharing-workflows) og [Deling af legitimationsoplysninger](../reference/credentials-sharing.md).

## Redigering og sletning

- **Rediger** – Ændr workflow-navn og beskrivelse via redigeringshandlingen i rækken
- **Slet** – Workflows [planlægges til sletning](../reference/workflow-organization.md); de flyttes til en papirkurv, før de fjernes permanent

## Samtidige redigeringer

Gemning sender den revision, som redigeringerne er baseret på, og serveren afviser skrivningen, hvis workflowet er ændret i mellemtiden – for eksempel fordi en teamkollega har gemt det, eller det samme workflow er åbnet i en anden fane. Heym viser derefter en dialogboks **Forældet workflow detekteret** med to valgmuligheder:

- **Annuller** – Beholder de ugemte ændringer i editoren, så de kan genindlæses i en anden fane og afstemmes
- **Tilsidesæt** – Gemmer alligevel og erstatter den anden persons version

**Kørsel** af et workflow gemmer det først, så den gennemgår den samme kontrol. Hvis workflowet er ændret undervejs, pauses kørslen på dialogboksen i stedet for at overskrive stille: **Tilsidesæt og kør** gemmer versionen og starter kørslen, **Annuller kørsel** afbryder begge og lader redigeringerne være urørte.

Kontrollen er en del af selve anmodningen om at gemme, så den kræver ingen ekstra omgang, og der er intet vindue, hvor en gemning kunne undgå den. Egne ændringer fra andre steder i appen – omdøbning, indstillingsændring, en egenskabspanel-toggle – tæller aldrig som en konflikt.

## Kommandopalette

Tryk **Ctrl+K** (eller **Cmd+K**) for at åbne kommandopaletten. Det er muligt at:
- Søge efter workflows efter navn
- Springe til enhver [dashboard-fane](./credentials-tab.md)
- Åbne nylige workflows

## Relateret

- [Hurtig start](../getting-started/quick-start.md) – Byg det første workflow
- [Workflow-organisation](../reference/workflow-organization.md) – Mapper, undermapper og planlagt sletning
- [Workflow-struktur](../reference/workflow-structure.md) – JSON-format for workflows
- [Download & Import](../reference/download-import.md) – Eksport og import af workflows som JSON
- [Portal](../reference/portal.md) – Fremvis workflows som offentlige chat-brugergrænseflader
- [Board](./board-tab.md) – Kør workflows fra kanban-kort via kolonnekæder
- [Kernebegreber](../getting-started/core-concepts.md) – Workflows, noder og eksekvering
- [Eksekveringshistorik](../reference/execution-history.md) – Se tidligere kørsler og Bring to Canvas
- [Hurtigskuffe](../reference/quick-drawer.md) – Fastgør og kør workflows fra dashboard, dokumentation og andre ikke-editor-sider
- [Kontekstuel fremvisning](../reference/contextual-showcase.md) – Kort sideguide til dashboard-overflader
