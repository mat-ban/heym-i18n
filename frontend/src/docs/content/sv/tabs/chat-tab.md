# Chat-fliken

**Chat**-fliken tillhandahåller ett direkt LLM-chattgränssnitt. Använd den för att testa modeller, ställa frågor, köra befintliga Workflows eller skapa en ny Workflow från en begäran i naturligt språk.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

## Konfiguration

1. Välj en [credential](./credentials-tab.md) (API-nyckel för OpenAI, Google, etc.)
2. Välj en modell från listmenyn (modeller laddas från den valda credentialen)
3. Börja skriva för att skicka meddelanden

En konversation kan även startas från chattrutan på [Workflows-fliken](./workflows-tab.md). Den skickar det första meddelandet och öppnar den nya konversationen här med svaret redan strömmande.

## Funktioner

- **Kontext för globala variabler** – [Global Variables](../reference/global-variables.md) är tillgängliga för LLM:en, så det går att ställa frågor om eller referera till lagrade värden
- **Kontext för workspace-mallar** – Delade Workflow- och nodmallar i den aktuella arbetsytan inkluderas som kontext, så Chat kan svara på frågor om tillgängliga mallar
- **Långkörande agent** – Chat fortsätter arbeta i backend även om webbläsaren stängs, så det går att återvända från en annan enhet och fortsätta samma konversation
- **Skapa Workflow** – Be Chat skapa eller konfigurera en Workflow, och den använder samma Workflow AI Builder-motor som redigeringsassistenten för att generera och spara Workflowen
- **Skapa Kanban-uppgift** – Be naturligt om att lägga till en uppgift eller skapa ett kort. Chat lägger till det i den första kolumnen på den begärda tavlan; när det finns flera tavlor och ingen namnges visar Chat en tavlväljare innan kortet skapas
- **Köade uppföljningar** – Skicka fler meddelanden medan ett svar strömmar. Köade meddelanden sparas, kan redigeras eller tas bort innan de startar och körs i ordning efter det aktiva svaret
- **Planeringspauser** – När Chat behöver planeringsdetaljer ställer den förtydligandefrågor och pausar köade uppföljningar tills de besvaras. När planeringssvaret är klart återupptas köade meddelanden
- **Credentials** – När en Workflow som Chat skapar eller redigerar behöver en credential frågar Chat vilken som ska användas, erbjuder att skapa en ny i konversationen eller låter användaren fortsätta utan. Det går även att be Chat skapa en credential eller uppdatera en befintlig; den öppnar credential-formuläret i konversationen. Modellen ser credentialens namn och typ, aldrig dess värden, för autentiseringsuppgifter du äger och de som delats med dig. LLM- och Agent-noder som Chat lägger till körs med den autentiseringsuppgift och modell som valts för chatten, inklusive delade autentiseringsuppgifter; när Chat redigerar ett workflow behåller befintliga LLM- och Agent-noder sin autentiseringsuppgift och modell. Se [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Datatabeller** – När en Workflow som Chat skapar eller redigerar lagrar poster frågar Chat vilken [datatabell](./datatable-tab.md) som ska användas eller erbjuder att skapa en med de kolumner som Workflowen behöver. Den kan även lista befintliga tabeller och deras kolumner. Den läser eller skriver aldrig rader. Se [AI Assistant › Data tables](../reference/ai-assistant.md#data-tables)
- **Strömmande svar** – Se modellens utdata medan de strömmar
- **Stoppa svar** – Avbryt det aktuella strömmande svaret när som helst; att stoppa rensar även köade meddelanden för den konversationen
- **Markdown-rendering** – Svar stöder markdown-formatering, inklusive inline-bilder
- **Bildvisning** – Bilder inbäddade i svar (t.ex. från LLM-bildgenerering) visas inline; klicka på en bild för att visa den i fullskärm. Tryck på **Esc** eller bakåtknappen (mobil) för att stänga fullskärmsvyn
- **Kopiera meddelanden** – Kopiera valfritt meddelande till urklipp
- **Rensa chat** – Starta en ny konversation
- **Röstinmatning** – Använd mikrofonknappen för tal-till-text (webbläsarstödd). När inspelningen stoppas kan Heym göra en lätt rensning av transkriptionen innan den skickas
- **Schemalagda Workflows** – Fråga när cron-Workflows körs (idag, denna vecka, denna månad eller ett anpassat datumintervall). Assistenten använder samma schemadata som fliken [Scheduled](./scheduled-tab.md) och kan begränsa resultaten till Workflows som ägs eller inkludera de som delats
- **Körningshistorik för Workflows** – Fråga om en specifik Workflow ("hur många gånger kördes den dagliga rapporten?", "misslyckades den?", "när kördes den senast?"). Chat slår upp Workflowen via dess ID och svarar utifrån dess körningsantal, statusfördelning, första och senaste körningstid samt genomsnittlig varaktighet. Fråga varför en körning misslyckades eller vad den returnerade, och Chat öppnar då den enskilda körningen för att läsa dess indata, utdata och fel per nod
- **Live-körningsstatus** – Fråga vad som körs just nu och Chat svarar med antalet, Workflow-namnen, hur länge varje körning har pågått, vilken nod den är på och en direktlänk till live-körningen
## Använda Chat från en MCP-klient

Chat-motorn kan även nås utanför webbläsaren. Aktivera **Heym Chat Tool** på fliken [MCP](./mcp-tab.md) och MCP-klienter — Claude, Cursor och allt annat som talar MCP — får ett enda `heym_chat`-verktyg som kör samma motor med alla dess funktioner.

Dessa konversationer hamnar i denna fliks historik och markeras med en pluggikon i konversationslistan. Öppna en för att läsa vad klienten frågade, se de verktygskort som den utlöste och fortsätt tråden själv. Att besvara en klargörandefråga fungerar på samma sätt oavsett om turen startade här eller från en MCP-klient.

Över MCP listar, väljer eller skapar Chat inga autentiseringsuppgifter. Workflows som den bygger lämnar fält för autentiseringsuppgifter tomma, och svaret namnger de noder som behöver en autentiseringsuppgift så att dessa kan anges i editorn.

Datatabeller fungerar även över MCP: Chat listar tabeller, skapar nya och kopplar in dem i de workflows som den bygger. Dess tabellfråga anländer som text i resultatet, så besvara den med samma `conversation_id`.

## Kontextgräns

Chatten behåller upp till 25 senaste meddelanden i kontexten. Äldre meddelanden trimmas för att hålla sig inom modellens gränser.

## Skapa workflows

När Chat ombeds att skapa, bygga, generera eller sätta upp en workflow skapas en ny sparad workflow med ett genererat namn och en genererad beskrivning. Svaret innehåller en skrivskyddad förhandsvisning av canvasen med de genererade noderna och kanterna, plus en länk **Öppna workflow** som öppnar workflow-editorn i en ny webbläsarflik. Använd förhandsvisningskortets knapp **Kör** när workflowen ska köras.

Uppföljande feedback i samma chatt redigerar den workflowen istället för att skapa en ny. Efter att Chat har skapat en workflow går det till exempel att säga "lägg till ett godkännandesteg", "ändra utdataformatet" eller "şöyle yap" och Chat uppdaterar den sparade workflowen och uppdaterar förhandsvisningen.

Detta är bäst för förfrågningar där arbetet ska utföras som en återanvändbar automatisering, inte bara som ett engångssvar.

## Skapa Kanban-uppgifter

Fråga Chat i vanligt språk, till exempel "Lägg till en uppgift som heter Fix login bug" eller
"Skapa ett nytt kort Update documentation på tavlan Launch." En beskrivning kan inkluderas i
samma förfrågan. Chat skapar alltid kortet i den valda tavlans första kolumn.

Om arbetsytan har flera tavlor och ingen anges pausar Chat med en
envals-tavlväljare. Välj en tavla för att slutföra skapandet av kortet. Inget slash-kommando
eller särskilt meddelandeformat krävs.

## Fråga vad som körs

Fråga i vanligt språk — "vad körs?", "hur många workflows är aktiva just nu?",
"vilken nod är nattrapporten på?" — och Chat rapporterar den aktuella bilden:

- **Hur många** körningar som pågår, uppdelat i körande och väntande på mänsklig granskning
- **Vilka workflows** de tillhör, med namn
- **Hur länge** varje körning har pågått (till exempel `1m 35s`, `3h 25m`)
- **Vilken nod** som körs just nu, med dess canvas-etikett, plus den senaste noden som slutfördes
- **En länk** till varje aktiv körning, som öppnar canvasen med den körningen som uppspelning

Körningar som pausats för en [Human-in-the-Loop](../reference/human-in-the-loop.md) eller Codex-granskning rapporteras som
väntande på godkännande, inte som körande. Detta är samma data som aktiv-körningar-brickan i sidhuvudet,
så Chat och brickan är aldrig oense. För körningar som redan har slutförts, fråga efter senaste körningarna
istället — det läser [Execution History](../reference/execution-history.md).

## Fråga om en körning

Välj en Workflow-körning i [Execution History](../reference/execution-history.md#ask-ai), från redigeraren eller från All History, och klicka på **Fråga AI** bredvid dialogrutans titel. Chat öppnar en ny konversation med två chips ovanför meddelanderutan:

- **Workflow:** namnet på Workflow
- **Execution:** de första tecknen i den valda körningens id

Ta bort ett chip med dess **×** för att utesluta det. Ställ sedan en fråga, till exempel ”varför tog den här körningen så lång tid?”, ”vad misslyckades här?” eller ”kan du åtgärda det?”. De återstående chipsen bifogas meddelandet med fullständiga id:n, så att Chat läser indata, utdata och nodspårning direkt istället för att söka efter Workflow. För att åtgärda Workflow sparar, testkör och verifierar Chat ändringen enligt beskrivningen i [Skapa Workflows](#skapa-workflows).

Det skickade meddelandet visar chipsen under frågan. De tillhör endast det meddelandet; uppföljningsfrågor i samma konversation behåller sammanhanget från historiken.

## Fråga om aviseringar

Chat kan besvara frågor om de [aviseringar](./alerts-tab.md) som har definierats:

- **Vad som finns** — "vilka aviseringar har jag?", "finns det en avisering på invoice-workflowen?",
  "vilka aviseringar utlöses just nu?"
- **Hur en är konfigurerad** — "vad är tröskelvärdet på kostnadsaviseringen?", "hur är den konfigurerad?"
- **Varför och när den utlöstes** — "varför utlöstes kostnadsaviseringen?", "när utlöstes den senast?"

För en fråga om "varför utlöstes den" läser Chat utlösningsposten och citerar det faktiska observerade
värdet, tröskelvärdet och det exakta fönster som utvärderades, plus den bidragande detaljen:
misslyckade körnings-id:n och felmeddelanden för felaviseringar, utgifter per modell för kostnadsaviseringar, eller
uppdelningen per trigger-källa för aviseringar om antal körningar. Den rapporterar vad som var sant när aviseringen
utlöstes istället för att räkna om fönstret, eftersom fönstret har passerat och en ny beräkning
kan ge ett annat svar.

## Användarregler

[Användarregler](../reference/user-settings.md) (konfigurerade i Inställningar) injiceras automatiskt i varje Chat-konversation som systemnivåinstruktioner. Ange dem en gång för att tillämpa beständiga preferenser på alla chattförfrågningar.
## Relaterat

- [MCP-fliken](./mcp-tab.md) – Exponera denna motor för MCP-klienter som verktyget `heym_chat`
- [Inställningar](../reference/user-settings.md) – Ange användarregler som tillämpas på alla chattförfrågningar
- [Fliken Autentiseringsuppgifter](./credentials-tab.md) – Lägg till och hantera API-nycklar
- [Fliken Variabler](./global-variables-tab.md) – Globala variabler tillgängliga för Chat
- [Nodtyper](../reference/node-types.md) – LLM- och Agent-noder för workflows
- [Agent-nod](../nodes/agent-node.md) – AI-agent med verktygsanrop
- [AI-assistent](../reference/ai-assistant.md) – Redigeringsassistent som drivs av samma workflow-byggare DSL
- [Körningshistorik](../reference/execution-history.md) – Visa tidigare körningar (History-knappen i sidhuvudet)
- [Fliken Schemalagt](./scheduled-tab.md) – Kalender över kommande cron-körningar (samma data som Chat kan sammanfatta)
- [Fliken Aviseringar](./alerts-tab.md) – Tröskelvärdesaviseringar som Chat kan lista och förklara
- [Kontextuell visning](../reference/contextual-showcase.md) – Kompakt orientering i appen för denna sida
- [Chat-röst (TTS & STT)](../reference/chat-voice.md) – Läs meddelanden högt och tala handsfree med ElevenLabs

## Verktygsanrop och kontextstorlek

Varje gång assistenten anropar ett verktyg (kör en workflow, listar körningar, bygger en ny workflow) visas ett ihopfällbart kort i konversationen. Kortet expanderas automatiskt medan verktyget körs och visar de exakta argumenten. När verktyget är klart fälls kortet ihop till en sammanfattning på en rad med förfluten tid. Klicka på valfritt kort för att expandera argumenten och svarsammanfattningen igen.

En liten ringmarkering under inmatningsfältet visar aktuell kontextanvändning som en procentandel av modellens fönster (t.ex. `12% · ~9.2k`). Håll muspekaren över markeringen för att se en uppdelning: systemprompt, AGENTS.md, workflows-block, användarregler, historik och den egna utkastinmatningen. När användningen passerar 80 % blir ringen bärnstensfärgad; vid 95 % blir den röd.

Om användningen närmar sig gränsen komprimerar Heym automatiskt äldre meddelanden till en kort sammanfattning med samma mekanism som agent-noder använder. Ett "Context compressed"-kort visas inline för att visa vad som hände.
