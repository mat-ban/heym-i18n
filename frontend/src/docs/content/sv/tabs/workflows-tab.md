# Fliken Workflows

Fliken **Workflows** är standardvyn i instrumentpanelen. Den visar workflowlistan, mappstrukturen och gör det möjligt att skapa, redigera och organisera workflows.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Se demo av Workflows</a></p>

## Starta en chatt

Ovanför workflowlistan finns en chattruta som hälsar med namn och frågar vad som ska automatiseras. Ange en prompt, bifoga eventuellt en fil och välj önskad credential och modell. Båda rullgardinsmenyerna är sökbara och utgår från [AI-standardinställningarna](../reference/user-settings.md).

När meddelandet skickas skapas en ny konversation som öppnas i [fliken Chat](./chat-tab.md), där svaret strömmas in. Tillgängliga bilagor är textfiler, bilder och PDF:er, en per meddelande, på samma sätt som i chattens inmatningsfält.

Om ingen LLM-credential finns ännu visas en länk till [fliken Credentials](./credentials-tab.md) i rutan och det går inte att skicka.

Klicka på **x** för att dölja rutan. En knapp **Ask AI** visas då bredvid rubriken Workflows och tar tillbaka rutan. Valet sparas i webbläsaren.

## Workflowlista

Listan är en vy med två paneler: workflows och mappar till vänster, en förhandsvisning av den valda workflowen till höger.

- Varje rad visar workflowens ikon, namn, beskrivning, när den senast uppdaterades och en [statuschip](#workflow-status)
- Workflows kan ligga i roten eller inuti mappar, och fästa workflows visas i en egen grupp **Pinned** högst upp
- **Klicka** på en rad för att markera den och läsa in förhandsvisningen till höger
- **Dubbelklicka** på en rad, eller tryck på **Enter** när den är fokuserad, för att öppna den i [editorn](../getting-started/quick-start.md)
- Använd **Ctrl+klick** (eller **Cmd+klick**) för att öppna i en ny flik
- Varje rad har sina åtgärder för redigering, kopiering, fästning och borttagning till höger. På telefoner döljs de så att namnet behåller full bredd; **håll in** en rad där för att öppna åtgärdsbladet
- Fäst ofta använda workflows i [Quick Drawer](../reference/quick-drawer.md) så att de snabbt kan köras från fliken Workflows och andra interna sidor

## Förhandsvisning av workflow

När en workflow markeras fylls förhandsvisningspanelen bredvid listan. På skärmar smalare än 1280px öppnas samma panel som ett blad från skärmens nederkant i stället.

Panelen visar:

- Workflowens namn, vem som skapade den och när, samt när den senast redigerades
- **Open Workflow** – öppnar workflowen i editorn
- **Run Now** – öppnar workflowen i [Quick Drawer](../reference/quick-drawer.md), där dess indata fylls i och körningen startas utan att lämna listan
- **Description** – workflowens beskrivning
- **Trigger Configuration** – schemat för en cron-workflow, eller den lyssnande triggern för en event-workflow. Workflows som anropas över HTTP visar i stället en knapp **Copy cURL** i stället för den råa endpointen och autentiseringstexten: den kopierar en komplett förfrågan med rätt URL, headers, autentiseringsplatshållare och en body byggd från workflowens indatafält. När workflowen publicerar en [portal](../reference/portal.md) visas dess publika chattlänk här också
- **Last Run Details** – resultatet och varaktigheten för den senaste körningen, eller en notis om att workflowen aldrig har körts
- **Workflow Steps & Sub-agents** – noderna i körordning, var och en med sin modell, operation eller sitt schema och en punkt som visar om den är aktiv. Om en nod väljs öppnas den i editorn med egenskapspanelen redan öppen

Panelen förblir fäst bredvid listan medan det rullas, så den förblir läsbar i en lång workflowlista.
## Instansadministration

Konton som listas i `HEYM_ADMIN_EMAILS` kan lista, öppna, redigera, granska körningshistorik och ta bort valfritt workflow på instansen utan delning eller ägaröverföring. Inställningen är en kommaseparerad lista med e-postadresser som matchas skiftlägesokänsligt. En tom lista ger ingen denna åtkomst. Starta om backend efter ändring.

Administratörer ser ägarens e-postadress i workflow-listan och kan söka på den adressen. Välj ett workflow för att öppna **Instansadministration** i förhandsgranskningen:

1. **Pausa triggers** visas endast för workflows som innehåller en Cron-nod. Det inaktiverar workflowets Cron och andra automatiska trigger-noder genom en normal versionshanterad sparning. Pågående körningar kan slutföras. Manuella anrop, API-, portal- och sub-workflow-anrop är fortfarande tillgängliga; åtgärden är inte ett workflow-omfattande körningslås.
2. Knappen ändras till **Återuppta triggers** medan pausad, även efter en sidomladdning. Återuppta återaktiverar de triggers som pausades av administratören och lämnar triggers som redan var inaktiverade oförändrade. För äldre pausade workflows utan ett sparat administratörspausläge aktiverar Återuppta deras automatiska triggers.
3. Använd workflow-radens **Ta bort workflow**-åtgärd när körningar har avslutats. Borttagning returnerar en konflikt medan pågående, köade eller väntande granskningsarbeten återstår. Schemalagd borttagning tillämpar samma kontroll.

Pausa triggers och låt pågående körningar slutföras innan borttagning. En trigger som redan skickats när pausningen skedde kan fortfarande slutföras. Använd borttagning när workflowet inte längre får vara anropbart.

Endast-ägarens webhook-hemligheter och autentiseringsinställningar behåller sina befintliga skydd. Administration överför inte ägarskap eller delar ägarens autentiseringsposter. Administrativa paus-, återuppta-, borttagnings- och schemaläggningsåtgärder visas i [granskningsloggen](../reference/audit.md) med den agerande administratören och workflowets ägare.

## Workflow-status

Varje rad har en statusmarkering som härleds från workflowets trigger-noder, dess aktiva körningstillstånd,
och — för workflows utan trigger-nod — hur dess senaste körning startades:

| Status | Betydelse |
| --- | --- |
| **Running** | Workflowet har en körning pågående just nu |
| **Scheduled** | Det har en aktiv [cron](../nodes/cron-node.md)-trigger |
| **Listening** | Det har en aktiv händelsetrigger, såsom en Slack-, Telegram-, IMAP- eller WebSocket-trigger |
| **Paused** | Det har trigger-noder, men samtliga är inaktiverade |
| **API** | Det har inga trigger-noder och kördes senast av ett HTTP-anrop till dess execute-endpoint |
| **SubWorker** | Det har inga trigger-noder och kördes senast som ett sub-workflow av ett överordnat workflow |
| **Portal** | Det har inga trigger-noder och kördes senast från dess [portal](../reference/portal.md) |
| **WEB** | Det har inga trigger-noder och dess enda terminal är en [HTML output mapper](../nodes/html-output-mapper-node.md), så anrop returnerar en renderad webbsida |
| **Manual** | Det har inga trigger-noder och har aldrig körts, eller så kom dess senaste körning från någon annanstans |
| **Remove Scheduled** | Det är [schemalagt för borttagning](../reference/workflow-organization.md) |

Statusarna API, SubWorker och Portal läser den enskilt senaste posten i workflowets
[körningshistorik](./logs-tab.md), så ett workflow som anropas på två sätt visar det som kom
sist. **WEB** avgörs från grafen istället, så det har företräde framför dessa tre: ett
sidbetjänande workflow visas som WEB även efter att det anropats över HTTP. Trigger-noder vinner alltid
över dem alla: ett cron-workflow som någon även anropar över HTTP förblir **Scheduled**.

Använd rullgardinsmenyn **Status** bredvid sökfältet för att endast visa en status. Rullgardinsmenyn listar hur många workflows som för närvarande matchar var och en. Ett statusfilter når även in i mappar: mappar med en matchning expanderas automatiskt, och mappar utan en döljs tills filtret rensas.

## Aktiva workflows

På skrivbordet visar den cirkulära brickan i det övre verktygsfältet hur många workflows som för närvarande
körs och uppdateras automatiskt var 10:e sekund. Klicka på en bricka som inte är noll för att öppna listan över aktiva
workflows, som visar upp till fyra rader innan rullning. Välj ett workflow-namn för att koppla
redigeraren till den körningens livevy. Nollbrickan är informativ och kan inte öppnas, och
brickan är dold på mobila skärmar.

## Sökning

Använd workflowets sökfält bredvid **Status**, eller tryck **Ctrl+F** (eller **Cmd+F**), för att filtrera workflows efter titel eller beskrivning. Matchande workflows inuti mappar visas med sina mappgrenar expanderade. Tryck **Escape** för att rensa sökningen.
## Mappar

- Organisera workflows i [mappar och undermappar](../reference/workflow-organization.md)
- Skapa mappar med knappen **New Folder** och ange ett namn och en valfri beskrivning som visas under namnet i listan
- Varje mapprad visar hur många workflows den innehåller, inklusive undermappar, tillsammans med åtgärderna för ny undermapp, byt namn, ändra ikon, ladda ner som ZIP och ta bort. På telefoner visas i stället en enda menyknapp
- Dra en workflow över en mapp eller undermapp för att se en förhandsvisning av målet i kortstorlek. Den
  markerade förhandsvisningen visar hela mappsökvägen innan släppet, och att hovra över en ihopfälld
  mapp expanderar den tillfälligt så att nästlade mappar kan nås.
- Dra workflows mellan mappar eller till roten. Det dragna kortet förblir synligt som en skugga,
  och det aktiva målet förblir markerat vid scrollning.
- Att släppa en workflow tillbaka i dess nuvarande mapp är inaktiverat och markeras med **Already in Folder**.
- Byt namn på en mapp, eller ändra dess beskrivning, via åtgärden för namnbyte eller högerklicksmenyn

## Skapa workflows

1. Klicka på **New Workflow**
2. Ange ett namn och en valfri beskrivning
3. Workflowen öppnas i editorn

## Import

Dra och släpp en JSON-workflowfil till workflowområdet för att skapa en ny workflow. De importerade noderna och kanterna används för att skapa workflowen; namnet hämtas från fältet `name` i JSON-filen eller från filnamnet. Se [Download & Import](../reference/download-import.md) för JSON-formatet och importalternativ.

## Delning

Öppna en workflow i editorn och klicka på **Share** för att bjuda in användare via e-post eller dela med ett [team](./teams-tab.md). Välj **Read** (visa och köra) eller **Write** (även redigera) för varje användare eller team, och ändra det senare från rullgardinsmenyn bredvid posten. Credentials och sub-workflows delas inte automatiskt; dela dessa separat med samma användare eller team. Se [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) och [Credentials Sharing](../reference/credentials-sharing.md).

## Redigering och borttagning

- **Edit** – Ändra workflowens namn och beskrivning via radens redigeringsåtgärd
- **Delete** – Workflows [schemaläggs för borttagning](../reference/workflow-organization.md); de flyttas till ett papperskorgsområde innan permanent borttagning

## Samtidiga redigeringar

Vid sparande skickas den revision som redigeringarna baseras på, och servern avvisar skrivningen om workflowen har ändrats under tiden — till exempel för att en teammedlem har sparat den, eller för att samma workflow lämnats öppen i en andra flik. Heym visar då en dialogruta med **Stale Workflow Detected** och två val:

- **Cancel** – Behåller osparade ändringar i editorn så att de kan läsas in på nytt i en annan flik och stämmas av
- **Override** – Sparar ändå och ersätter den andra personens version

Att **köra** en workflow sparar den först, så samma kontroll görs. Om workflowen har ändrats under tiden pausas körningen på dialogrutan i stället för att skriva över tyst: **Override and Run** sparar versionen och startar körningen, **Cancel Run** avbryter båda och lämnar redigeringarna orörda.

Kontrollen är en del av själva sparandeförfrågan, så den kostar ingen extra rundtur och det finns inget fönster där ett sparande kan slinka igenom. Egna ändringar från andra delar av appen — ett namnbyte, en inställningsändring, en växling i egenskapspanelen — räknas aldrig som en konflikt.

## Kommandopalett

Tryck på **Ctrl+K** (eller **Cmd+K**) för att öppna kommandopaletten. Det går att:
- Söka efter workflows via namn
- Hoppa till valfri [dashboardflik](./credentials-tab.md)
- Öppna senaste workflows

## Relaterat

- [Quick Start](../getting-started/quick-start.md) – Bygg den första workflowen
- [Workflow Organization](../reference/workflow-organization.md) – Mappar, undermappar och schemalagd borttagning
- [Workflow Structure](../reference/workflow-structure.md) – JSON-format för workflows
- [Download & Import](../reference/download-import.md) – Exportera och importera workflows som JSON
- [Portal](../reference/portal.md) – Exponera workflows som publika chattgränssnitt
- [Board](./board-tab.md) – Kör workflows från kanban-kort via kolumnkedjor
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, noder och exekvering
- [Execution History](../reference/execution-history.md) – Visa tidigare körningar och Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Fäst och kör workflows från dashboard, docs och andra sidor utanför editorn
- [Contextual Showcase](../reference/contextual-showcase.md) – Kort sidguide för dashboardytor
