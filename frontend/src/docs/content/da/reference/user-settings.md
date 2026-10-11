# Indstillinger

Dialogboksen Indstillinger giver mulighed for at administrere profilen, definere vedvarende AI-instruktioner, opdatere adgangskoden, konfigurere chatstemme, angive standardlegitimationsoplysninger og model til AI samt gennemgå overvågningsstatus. Åbn den ved at klikke på **avatar og navn** i øverste højre hjørne af headeren.

## Åbning af dialogboksen

Klik på **avatar og navn** i øverste højre hjørne af headeren. Dialogboksen åbnes med følgende faner: **Profil**, **Sikkerhed**, **Stemme**, **AI-standarder** og **Overvågning**. Instansadministratorer ser også en **SSO**-fane.

## Profil-fanen

### Profilbillede

Heym viser [Gravatar](https://gravatar.com)-billedet for kontoens e-mail i headeren, ved siden af beskeder i [Chat](../tabs/chat-tab.md) og **Chat med Heym**, på [Board](../tabs/board-tab.md)-kommentarer og ved siden af navnet i delingsdialoger og teammedlemslister. For at ændre det skal billedet opdateres på Gravatar; Heym indhenter det nye billede inden for få timer. Uden et Gravatar-billede viser Heym det første bogstav i navnet.

Billedet hentes af Heym-serveren og caches der, så browseren aldrig kontakter Gravatar. Hvis serveren ikke kan nå Gravatar, vises initialer for alle brugere.

### Navn

Det visningsnavn, der vises i hele applikationen. Dette felt er obligatorisk og må ikke efterlades tomt.

### Brugerregler

Brugerregler er brugerdefinerede instruktioner, der automatisk indsættes i enhver AI-anmodning – både i workflow-builderen og dashboard-chatten. I **workflow-builderen** ([AI Assistant](./ai-assistant.md)) tilføjes de til systemprompten, der bruges til at generere workflow-JSON. I **dashboard-chatten** anvendes de som systemniveau-kontekst. De skrives én gang og gælder globalt uden gentagelse i hver enkelt prompt.

**Almindelige anvendelser:**

- Sprog eller tone: `Altid svar på engelsk. Hold svar kortfattede.`
- Kodestil: `Brug async/await-mønstre. Foretræk TypeScript-interfacer frem for typer.`
- Workflow-konventioner: `Inkluder fejlhåndtering i alle workflows. Brug beskrivende node-etiketter.`
- Svarformat: `Brug punktform. Undgå lange forklaringer.`

**Hvor de anvendes:**

| Kontekst | Beskrivelse |
|---------|-------------|
| **Workflow-builder** | Anmodninger til [AI Assistant](./ai-assistant.md) for generering eller ændring af workflows |
| **Dashboard-chat** | Alle samtaler i [Chat-fanen](../tabs/chat-tab.md) |

Brugerregler injiceres på systemniveau – de kører automatisk før hver prompt uden yderligere konfiguration pr. workflow eller samtale.

### Gemning af profilændringer

Klik på **Gem ændringer** for at anvende dem. Ændringerne træder i kraft med det samme for alle nye AI-anmodninger.

## Sikkerhed-fanen

### Skift adgangskode

Brug Sikkerhed-fanen til at opdatere kontoens adgangskode.

**Krav:**

| Regel | Krav |
|------|-------------|
| Minimumslængde | 8 tegn |
| Store bogstaver | Mindst ét stort bogstav (A–Z) |
| Små bogstaver | Mindst ét lille bogstav (a–z) |
| Ciffer | Mindst ét tal (0–9) |

Adgangskoden skal også være forskellig fra den nuværende adgangskode. Disse regler håndhæves både på frontend og backend.

**Trin:**

1. Indtast **Nuværende adgangskode**
2. Indtast **Ny adgangskode** (skal opfylde alle ovenstående krav)
3. Gentag i **Bekræft ny adgangskode**
4. Klik på **Opdater adgangskode**

Hvis den nuværende adgangskode er forkert, vises en inline-fejlmeddelelse. Ved succes vises en bekræftelsesmeddelelse, og formularen nulstilles automatisk.

## Stemme-fanen

Stemme-fanen konfigurerer talestemme til [Chat-fanen](../tabs/chat-tab.md): vælg en **ElevenLabs-legitimationsoplysning** (eller tilføj en inline), vælg en **Stemme** fra ElevenLabs-kontoen og **Gem stemmeindstillinger**. Dette aktiverer oplæsning pr. besked og interaktiv stemmetilstand. Se [Chatstemme (TTS & STT)](./chat-voice.md) for den fulde flowbeskrivelse.

## AI-standarder-fanen

AI-standarder-fanen har to sektioner.

### Foretrukne legitimationsoplysninger og model

Vælg en **foretrukken LLM-legitimationsoplysning** og en **model** fra den. Dette bliver startstandard for alle AI-funktioner i appen – chat, [AI Assistant](./ai-assistant.md) (builder, analyzer og workflow-oprettelse), board-mapper, AI-dashboard-widgets, [docs-chat](../tabs/chat-tab.md), data-table AI-skemahjælperen, udtryksbuilderen og evalueringer – når overfladen ikke har en gemt valgmulighed.

Valgreglen for hver overflade er:

1. **Gemt valg** – et tidligere valg på overfladen (f.eks. en chat-samtales seneste model) har altid højeste prioritet.
2. **Foretrukken** – bruges, når der ikke er noget gemt valg.
3. **Første tilgængelige legitimationsoplysning** – fallback, når der ikke er angivet nogen præference.

Det er muligt at ændre legitimationsoplysninger og model pr. overflade til enhver tid; præferencen angiver kun den indledende standard. Lad legitimationsoplysningerne stå som **Ingen præference** for at bevare den tidligere adfærd med første legitimationsoplysning. Hvis de foretrukne legitimationsoplysninger senere slettes eller fjernes fra deling, viser fanen en meddelelse, og overflader falder automatisk tilbage til den første tilgængelige legitimationsoplysning.
### Brug af kodepakke

For hver **Codex**-legitimationsoplysning (inklusive delte) viser fanen den resterende rate-limit-brug som en vandret linje pr. aktivt vindue — f.eks. et **5-timers** vindue og/eller et **ugentligt** vindue, afhængigt af abonnementet. Hver linje viser den tilbageværende kvote i procent og en nedtælling til nulstilling. En **Opdater**-knap henter data på anmodning (resultater cachelagres kortvarigt på serveren).

For hver **OpenCode**-legitimationsoplysning viser fanen OpenCode Go-abonnementsvinduerne — **5 timer**, **ugentligt** og **månedligt** — som samme type linje, hentet fra gatewayens autentificerede brugsendepunkt med API-nøglen for den pågældende legitimationsoplysning. Et vindue, der har nået sin grænse, vises som **"grænse nået"** i ravfarvet tekst. Hvis nøglen er ugyldig, eller workspace ikke har et Go-abonnement, viser kortet årsagen i stedet for at vise linjer.

## Observability-fane

Observability-fanen viser den skrivebeskyttede status for [OpenTelemetry Tracing](./opentelemetry.md) på denne instans: om tracing er aktiveret, OTLP-endepunktet, servicenavn, sampler-forhold og hvilke spans der udsendes. Tracing konfigureres via `HEYM_OTEL_*`-miljøvariabler på backend, så denne fane redigerer ikke noget. Når tracing er deaktiveret, viser fanen de nødvendige miljøvariabler for at aktivere det. Hemmeligheder som OTLP-auth-headers vises aldrig her. Se [Miljøvariabler](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) for den fulde konfigurationsreference.

## SSO-fane

Kun synlig for instansadministratorer — de kontorer, der er listet i `HEYM_ADMIN_EMAILS`. Denne fane forbinder Heym med en ekstern OpenID Connect-udbyder, så brugerne logger ind med deres eksisterende konti. Indtast en issuer-URL og klientlegitimationsoplysninger, kopier den skrivebeskyttede omdirigerings-URI ind i udbyderen, og kør **Test forbindelse** før aktivering. Adgangskode-login kan deaktiveres herfra, når testen er bestået. Se [Single Sign-On](./sso.md) for den fulde opsætning.

## Instanser-fane

Kun synlig for instansadministratorer — de kontorer, der er listet i `HEYM_ADMIN_EMAILS`. Denne fane viser de Heym-instanser, der er forbundet til denne database, og konfigurerer, hvordan baggrundskørsler fordeles mellem dem. Hver række viser instansens redigerbare navn, dens rolle, om den er aktiv, dens målte latenstid til databasen, en tænd/sluk-knap og dens vægt. Vægte er andele af de instanser, der i øjeblikket kan modtage arbejde, ikke procenter af 100: med `41 / 26 / 33` og den tredje instans slukket modtager de første to reelt 61% og 39%. Panelet viser denne effektive fordeling under tabellen og nægter kun at gemme, når ingen aktiveret instans har en vægt overhovedet.

**Giv nye instanser en andel automatisk** er aktiveret som standard: en instans, der tilføjes, ville ellers stå med vægt 0 og modtage intet, så lederen giver den én gang en lige stor andel og skalerer de eksisterende vægte ned, mens deres forhold bevares. Den rører aldrig en instans, hvis vægt er indstillet manuelt.

Panelet rapporterer også, hvor stor en del af de seneste 24 timers kørsler, der kun kunne udføres på hovedinstansen. Når denne andel er høj, kan vægtene under ikke flytte dette arbejde. Se [Load Distribution](./cluster.md) for, hvad der forbliver på hovedinstansen, og hvordan man vælger tallene.

## Hvad der ikke er i denne dialog

| Funktion | Hvor den findes |
|---------|-----------------|
| **API-nøgleadministration (MCP)** | [MCP-fane](../tabs/mcp-tab.md) – vis, kopier og generer MCP-serverens API-nøgle igen |
| **Tema (mørk/lys)** | Sol/måne-knap i headeren (ved siden af brugerbadget) |
| **Ændring af e-mail** | Understøttes ikke i øjeblikket |

## Relateret

- [AI-assistent](./ai-assistant.md) – Workflow-bygger-chat, der bruger brugerregler
- [Chat-fane](../tabs/chat-tab.md) – Dashboard-chat, der bruger brugerregler
- [Chat-stemme (TTS & STT)](./chat-voice.md) – ElevenLabs-stemme konfigureret i Voice-fanen
- [MCP-fane](../tabs/mcp-tab.md) – MCP-serverens API-nøgle og workflow-værktøjseksponering
- [Legitimationsoplysninger-fane](../tabs/credentials-tab.md) – API-nøgler til AI-noder og integrationer
- [Sikkerhed](./security.md) – Sessionhåndtering, rate limiting, kryptering af legitimationsoplysninger
- [Single Sign-On](./sso.md) – Forbind en ekstern OpenID Connect-udbyder
- [OpenTelemetry Tracing](./opentelemetry.md) – Distribueret tracing for workflow- og nodekørsler
