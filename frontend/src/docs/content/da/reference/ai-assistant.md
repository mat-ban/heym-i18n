# AI-assistent

**AI-assistenten** er en chatpanel, der åbnes fra Debug-panelet og starter i nederste højre hjørne af editoren. Træk i headeren for at flytte den, og træk i en kant eller et hjørne for at ændre bredden eller højden. Den kan ikke gøres mindre end 360×480 pixels. Positionen og størrelsen huskes i denne browser. **Nulstil position og størrelse** i headeren placerer panelet tilbage i nederste højre hjørne. Brug naturligt sprog til at oprette eller ændre workflows - beskriv hvad der ønskes, og AI'en genererer noder og kanter, der anvendes på canvas.

Til dokumentationsspørgsmål uden for editoren kan [Chat med Heym](./chat-with-heym.md) bruges. Denne overflade er optimeret til sidebevidst produkthelp i stedet for workflow-generering.

## Åbning af panelet

1. Åbn et workflow i editoren
2. Find **Debug-panelet** i bunden (kørselsresultatområdet)
3. Klik på **AI**-knappen (Glitter-ikon) i panelets værktøjslinje
4. AI-assistentpanelet åbnes i nederste højre hjørne. Træk i headeren for at flytte det, eller træk i en kant eller et hjørne for at ændre bredde og højde.

Tryk `Ctrl + I` / `Cmd + I` hvor som helst i editoren for at åbne eller lukke panelet - genvejen virker selv når et tekstinput har fokus. Se [Tastaturgenveje](./keyboard-shortcuts.md).

Hvis der skal arbejdes på en enkelt node, føres markøren hen over den på lærredet, og der klikkes på **AI** over den. Panelet åbnes fokuseret på denne node. Se [Ændring af en enkelt node](#changing-one-node).

## Lukning af panelet

Klik på **X**-knappen, tryk `Ctrl + I` / `Cmd + I`, eller skift **AI**-knappen i Debug-panelets værktøjslinje. Headeren flytter panelet; den lukker det ikke.

## Konfiguration

Før der sendes beskeder, skal følgende vælges:

| Indstilling | Beskrivelse |
|---------|-------------|
| **Legitimationsoplysninger** | LLM-legitimationsoplysninger (API-nøgle) fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| **Model** | Modelnavn (f.eks. `gpt-4o`, `gemini-2.5-flash`) |

Tilføj legitimationsoplysninger under [Legitimationsoplysningsfanen](../tabs/credentials-tab.md). Modellisten indlæses fra de valgte legitimationsoplysninger.

## Agent-tilstand vs Spørg-tilstand

Panelet har to tilstande, der skiftes med **Agent / Spørg**-chippen i panelets header.

| Tilstand | Standard | Adfærd |
|------|---------|-----------|
| **Agent** | ✓ | Bygger og ændrer på canvas. AI'en genererer et workflow-JSON-block, der automatisk anvendes på canvas når svaret er færdigt. |
| **Spørg** | | Besvarer kun spørgsmål. Canvas røres aldrig. Brug dette til at spørge om workflowet, Heym-funktioner eller få råd uden at udløse en canvas-opdatering. |

Skift tilstand når som helst. Ændring af tilstand rydder ikke samtalen.

I Agent-tilstand aktiveres **YOLO-tilstand** via boksen under beskedfeltet, hvilket får assistenten til at køre og rette det den bygger. Se [YOLO-tilstand](#yolo-tilstand).

## Brug af chatten

- Indtast anmodningen i inputfeltet (f.eks. "Opret et workflow der tager brugerinput og sender det til en LLM")
- Tryk **Enter** for at sende (Shift+Enter for linjeskift)
- AI'en streamer sit svar. I **Agent**-tilstand, hvis svaret indeholder et workflow i et \`\`\`json-kodeblock, parses det automatisk og anvendes på canvas. I **Spørg**-tilstand ændres canvas aldrig.
- Brug **Ryd** for at nulstille samtalen
- Hold musen over en besked og klik på kopieringsikonet for at kopiere den viste tekst, inklusive eventuelt workflow-JSON
- Træk i linjen over beskedfeltet for at gøre feltet højere. Inputområdet kan vokse til 60% af panelet og vender tilbage til standardhøjde når siden genindlæses

## Automatisk workflow-anvendelse

Når AI-svaret indeholder et gyldigt workflow-JSON-block (med `nodes` og eventuelt `edges`) i et \`\`\`json-kodeblock, gør Heym følgende:

1. Parser JSON'en fra svaret
2. Erstatter det nuværende canvas med de nye noder og kanter
3. Rydder op i node-layoutet
4. Marker workflowet som ikke-gemt

Hvis parsing fejler, vises en **Prøv igen**-knap til at regenerere svaret.

## Ændring af en enkelt node

Før markøren over en node på lærredet, og klik på **AI** over den. Panelet åbnes i Agent-tilstand med fokus på denne node og viser, hvilken node der ændres:

| Noden har... | Panelet viser |
|---|---|
| Intet resultat i den aktuelle kørsel | **Modifying Node:** i en kompakt række med nodens ikon og navn. Assistenten redigerer udelukkende ud fra nodens konfiguration; kør noden først, hvis den skal se outputtet |
| Et resultat i den aktuelle kørsel | **Modifying Node: (Has Node Output)** over selve noden: ikon, navn og type, seneste status og varighed samt fejlen, hvis den mislykkedes. Assistenten ser dette output og fejlen, når noden redigeres |

Før markøren over etiketten for at se, hvilken tilstand panelet befinder sig i.

Uanset panelets tilstand læser assistenten også nodens dokumentationsside, der findes bag bogikonet i nodens overskrift. Den bruger siden til at forstå nodens indstillinger og besvare spørgsmål om dem.

Under meddelelserne findes tre muligheder for at starte anmodningen:

| Mulighed | Hvad den gør |
|---|---|
| **Change this node as ...** | Udfylder meddelelsesfeltet med *Skift denne node til*, så sætningen kan fuldføres |
| **Fix error in this node ...** | Udfylder *Ret fejlen i denne node.* Assistenten læser denne nodes fejl fra seneste kørsel |
| **Other** | Fokuserer et tomt meddelelsesfelt |

Rediger teksten, og tryk på **Send**. Assistenten returnerer kun denne node, og Heym opdaterer den direkte: noden bevarer sit id, sin type og sit navn, så udtryk som `$checkLinkedIn.result` i andre noder fortsat fungerer. Andre noder, forbindelser og layoutet ændres ikke, og **Undo** gendanner den tidligere konfiguration.

Hvis anmodningen ikke kan rummes i noden – f.eks. hvis der kræves en anden nodetype eller en ny node – oplyser assistenten, hvad der skal ændres, i stedet for at foretage redigeringen. Luk nodefokusset med **X** på nodekortet for at redigere hele workflowet igen. Lukning af panelet fjerner også fokusset.

[YOLO-tilstand](#yolo-mode) fungerer med en fokuseret node: assistenten ændrer noden, kører workflowet og retter noden, indtil kørslen lykkes. I **Ask**-tilstand fortæller fokusset assistenten, hvilken node spørgsmålet drejer sig om, og lærredet ændres ikke.

## YOLO-tilstand

**YOLO-tilstand** lader assistenten teste det den bygger. Marker **YOLO-tilstand**-boksen under beskedfeltet, og send derefter anmodningen. Boksen vises kun i Agent-tilstand. Den er som standard slået fra og nulstilles ved siden genindlæses. Hold musen over info-ikonet ved siden af for en kort resumé.

Med YOLO-tilstand slået til, stopper assistenten ikke efter den anvender et workflow:

1. Den anvender workflowet på canvas.
2. Før første kørsel spørger den om testinputs. Kortet viser workflowets inputfelter, udfyldt med værdier assistenten foreslår. Rediger dem og tryk **Kør**. Senere kørsler genbruger disse værdier. Kortet kommer kun tilbage hvis inputfelterne ændres eller assistenten har brug for andre testdata.
3. Den kører workflowet på canvas præcis som **Kør**-knappen: ikke-gemte ændringer gemmes først, noder lyser op, og kørslen vises i Debug-panelet og [Kørselshistorik](./execution-history.md).
4. Den læser resultatet. Hvis kørslen gjorde hvad der blev bedt om, afsluttes den med **Bekræftet** og en kort resumé. Hvis ikke, retter den workflowet og kører det igen.

Den laver højst **5 kørsler** pr. besked. Tryk **Stop** når som helst for at afbryde løkken og stoppe en igangværende kørsel.

Hvert svar viser sine trin efterhånden som de sker:
- `Anvender ændringer på canvas`;
- `Kører workflow · forsøg 2/5`, med en `Udfører <node>`-række for hver node;
- den endelige vurdering.

Efter hver kørsel vises en kort linje som *Forsøg 1 resultat sendt · fejl på 1.2s*, der indikerer at resultatet blev sendt tilbage til assistenten.
### Kørsel af andre workflows

I YOLO-tilstand kan assistenten også køre andre workflows, når den har brug for deres resultat. For eksempel kan den kontrollere, hvad et workflow returnerer, før det kaldes fra en [Execute](../nodes/execute-node.md)-node. Disse kørsler vises som `Running workflow "<name>"...`-trin og registreres i Historik for kørsler med trigger-kilden `ai_assistant`. Workflowet, der redigeres, testes altid på canvas.

### Ved tidlig afbrydelse

| Situation | Hvad der sker |
|---|---|
| Assistenten har brug for en beslutning, information, legitimationsoplysninger eller en datatabel | Den spørger med det sædvanlige spørgsmålskort. Svar fortsætter løkken. |
| Kørslen venter på en [human review](./human-in-the-loop.md) | Løkken stopper. Godkend reviewen, og send derefter en besked. |
| Workflowet venter på filupload | Løkken stopper. YOLO-tilstand kan ikke teste upload-triggerede kørsler. |
| En nyere version af workflowet er gemt andetsteds | Løkken stopper. Løs gemmekonflikten, og send derefter en besked. |

> **Kørsler er ægte.** E-mails, beskeder og API-kald i workflowet sendes faktisk ved hvert forsøg, og DataTable-noder skriver rigtige rækker. Hver kørsel gemmer workflowet, så tidligere versioner forbliver i [Edit History](./edit-history.md).

## Taleindtastning

På understøttede browsere aktiverer en **Voice**-knap tale-til-tekst. Klik for at starte optagelse, klik igen for at stoppe. Den transkriberede tekst sendes til AI'en for grammatisk rettelse, før den sendes.

## Agent Node vs AI Assistant

| | Agent Node | AI Assistant |
|---|------------|---------------|
| **Formål** | LLM-node i et workflow; kører under eksekvering | Chat-brugergrænseflade til at bygge workflows med naturligt sprog |
| **Placering** | Canvas-node | Debug-panel → flydende panel |
| **Tidspunkt** | Under kørsel | Under redigering |

Se [Agent Node](../nodes/agent-node.md) for workflow-noden, der udfører LLM-kald med værktøjer og MCP.

## Sådan virker det (AI Builder DSL)

AI Assistant'en drives af et **workflow DSL** (domænespecifikt sprog), der beskriver noder, kanter og udtryk. Når der sendes en besked:

1. Beskeden plus [User Rules](./user-settings.md) og det aktuelle workflow (hvis relevant) sendes til backend.
2. Backend'en bygger en **system-prompt**, der inkluderer:
   - Det fulde workflow DSL (nodetyper, udtrykssyntaks, regler, eksempler)
   - Brugerregler tilføjet som "User Custom Rules"
   - Det aktuelle workflow i JSON-format, når der redigeres et eksisterende workflow
   - Listen over tilgængelige workflows, hvis Execute-noden bruges
   - Navne, typer og id'er for legitimationsoplysninger (aldrig deres værdier)
   - Navne, id'er, beskrivelser og kolonner for datatabeller, der kan bruges (aldrig deres rækker)
3. Modellen returnerer et enkelt workflow JSON-blok (med `nodes` og `edges`). Frontend'en parser det og anvender det på canvas.

### Legitimationsoplysninger

Når et workflow har brug for legitimationsoplysninger, spørger assistenten før opbygning. Hvis der findes legitimationsoplysninger af passende type, listes de sammen med **Create a new credential**; hvis der ikke er nogen, spørges der, om der skal oprettes. Hvert spørgsmål giver også mulighed for at fortsætte uden legitimationsoplysninger.

Valg af oprettelse åbner legitimationsformularen i panelet, forudindstillet til den rigtige type og med et foreslået navn. Værdierne sendes direkte til Heym; assistenten lærer kun navnet og typen. OAuth-legitimationsoplysninger (Google Sheets, Google Drive, BigQuery, Linear, Notion) forbindes i en popup, og et link til godkendelsessiden vises, hvis popuppen blokeres. Når legitimationsoplysningerne er gemt, viser kortet deres navn, og opret-knappen deaktiveres; tryk på **Submit answers**, og assistenten placerer de nye legitimationsoplysninger på noden.

Det er også muligt at anmode om legitimationsoplysninger alene ("opret en GitHub-legitimationsoplysning") eller om at ændre eksisterende ("opdater min sheet-legitimationsoplysning", "genforbind min Google Sheets"). Assistenten svarer med det samme kort: oprettelse åbner en tom formular, opdatering åbner formularen for den pågældende legitimationsoplysning med dens hemmeligheder maskeret.

Assistenten foretrækker en dedikeret node. Når ingen node dækker en operation, f.eks. tilføjelse af en fane til et Google Sheet, bruges en HTTP-anmodning med headerlinje for den valgte legitimationsoplysning. Se [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Afklaringsspørgsmål, som workflowet kan klare sig uden, markerer **Optional** i deres input og kan springes over.

DSL'en håndhæver camelCase-labels, ensartede udtryksregler og nodespecifikke felter. Hvis en feltværdi er et enkelt `$expr`, bevarer backend'en den native type; hvis værdien blander tekst med `$refs`, bliver resultatet en streng. Én-`$`-reglen gælder stadig: ingen `$` inden for parenteser. [Settings](./user-settings.md) User Rules injiceres i denne system-prompt, så præferencer gælder for hvert AI-genereret workflow.

Hvis det aktuelle workflow indeholder Agent-færdigheder, inkluderer AI Assistant kun hver færdigheds `SKILL.md` i den workflow-kontekst. Vedhæftede `.py`-filer og binære færdighedsaktiver fjernes før anmodningen, så byggeren forbliver inden for modelkontekstgrænser, selv når færdigheder indeholder store implementeringer.
### Datatabeller

Når et workflow gemmer, lagrer eller opsøger poster, og der ikke er navngivet et andet lager, anvender assistenten en [DataTable](../nodes/datatable-node.md)-node. Hvis en af tabellerne er navngivet og indeholder de nødvendige kolonner, bruges denne. Ellers spørger assistenten, hvilken tabel der skal anvendes. Kortet viser de relevante tabeller, hver med beskrivelse og kolonnetyper, samt **Opret ny tabel** med et foreslået navn og kolonner. Delte tabeller vises også; skrivebeskyttede tabeller tilbydes kun til læsning.

Vælg den nye tabel og tryk på **Indsend svar**: kortet opretter tabellen, og assistenten placerer dens id på noden samt bruger de præcise kolonnenavne. Det er også muligt at anmode om en tabel separat, f.eks. "opret en tabel til mine leads".

Assistenten ser tabelnavne, beskrivelser og kolonner, men aldrig rækker. Den ændrer aldrig kolonner i en eksisterende tabel: hvis en tabel mangler en nødvendig kolonne, navngives kolonnen og der tilbydes en ny tabel i stedet. Kolonner tilføjes under fanen [DataTable](../tabs/datatable-tab.md).

## Relateret

- [Hvorfor Heym](../getting-started/why-heym.md) – Naturlig sprogbyggeri som første fase i agentens livscyklus
- [Hurtig start](../getting-started/quick-start.md) – Byg det relevante første workflow
- [Indstillinger](./user-settings.md) – Brugerregler inkluderet i AI-assistentens system-prompt
- [Chat med Heym](./chat-with-heym.md) – Sidebevidst assistent i dokumentationsområdet
- [Kernebegreber](../getting-started/core-concepts.md) – Workflows, noder og eksekveringsflow
- [Agent Node](../nodes/agent-node.md) – LLM-node med værktøjer og MCP
- [Legitimationsoplysninger-fane](../tabs/credentials-tab.md) – Tilføj API-nøgler til AI-assistenten
- [Workflow-struktur](./workflow-structure.md) – JSON-format for workflows
