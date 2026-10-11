# Inställningar

Dialogrutan Inställningar gör det möjligt att hantera profilen, ange beständiga AI-instruktioner, uppdatera kontolösenordet, konfigurera chattröst, ange standarduppgifter för AI och modell samt granska observerbarhetsstatus. Öppna den genom att klicka på **avataren och namnet** i det övre högra hörnet av sidhuvudet.

## Öppna dialogrutan

Klicka på **avataren och namnet** i det övre högra hörnet av sidhuvudet. Dialogrutan öppnas med flikarna: **Profil**, **Säkerhet**, **Röst**, **AI-standardvärden** och **Observerbarhet**. Instansadministratörer ser även en flik för **SSO**.

## Fliken Profil

### Profilbild

Heym visar [Gravatar](https://gravatar.com)-bilden för kontots e-postadress i sidhuvudet, bredvid meddelanden i [Chatt](../tabs/chat-tab.md) och **Chatta med Heym**, på kommentarer i [Anslagstavlan](../tabs/board-tab.md) samt bredvid namnet i delningsdialogrutor och listor över teammedlemmar. För att ändra bilden uppdateras bilden på Gravatar; Heym hämtar den nya inom några timmar. Utan en Gravatar-bild visar Heym första bokstaven i namnet.

Bilden hämtas av Heym-servern och cachelagras där, så webbläsaren kontaktar aldrig Gravatar. Om servern inte kan nå Gravatar visas initialer för alla.

### Namn

Visningsnamnet som visas i hela appen. Fältet är obligatoriskt och får inte lämnas tomt.

### Användarregler

Användarregler är anpassade instruktioner som automatiskt injiceras i varje AI-begäran – både i Workflow-byggaren och i dashboardchatten. I **Workflow-byggaren** ([AI-assistenten](./ai-assistant.md)) läggs de till i systemprompten som används för att generera Workflow-JSON. I **dashboardchatten** tillämpas de som systemnivåkontext. De skrivs en gång och tillämpas globalt utan att upprepas i varje prompt.

**Vanliga användningsområden:**

- Språk eller ton: `Always respond in English. Keep responses concise.`
- Kodstil: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Workflow-konventioner: `Include error handling in all workflows. Use descriptive node labels.`
- Svarsformat: `Use bullet points. Avoid lengthy explanations.`

**Var de tillämpas:**

| Kontext | Beskrivning |
|---------|-------------|
| **Workflow-byggaren** | [AI-assistenten](./ai-assistant.md) begär generering eller ändring av Workflows |
| **Dashboardchatten** | Alla konversationer i [fliken Chatt](../tabs/chat-tab.md) |

Användarregler injiceras på systemnivå – de körs automatiskt före varje prompt, utan extra konfiguration per Workflow eller konversation.

### Spara profiländringar

Klicka på **Spara ändringar** för att tillämpa. Ändringarna träder i kraft omedelbart för alla nya AI-begäranden.

## Fliken Säkerhet

### Ändra lösenord

Använd fliken Säkerhet för att uppdatera kontots lösenord.

**Krav:**

| Regel | Krav |
|-------|------|
| Minsta längd | 8 tecken |
| Versaler | Minst en versal (A–Z) |
| Gemener | Minst en gemen (a–z) |
| Siffra | Minst en siffra (0–9) |

Lösenordet måste även skilja sig från det nuvarande lösenordet. Dessa regler tillämpas både i gränssnittet och i backend.

**Steg:**

1. Ange **nuvarande lösenord**
2. Ange **nytt lösenord** (måste uppfylla alla krav ovan)
3. Ange igen i **Bekräfta nytt lösenord**
4. Klicka på **Uppdatera lösenord**

Om det nuvarande lösenordet är felaktigt visas ett felmeddelande direkt i formuläret. Vid lyckat resultat visas ett bekräftelsemeddelande och formuläret återställs automatiskt.

## Fliken Röst

Fliken Röst konfigurerar talad röst för [fliken Chatt](../tabs/chat-tab.md): välj en **ElevenLabs-uppgift** (eller lägg till en direkt), välj en **röst** från ElevenLabs-kontot och klicka på **Spara röstinställningar**. Detta aktiverar uppläsning per meddelande och interaktivt röstläge. Se [Chattröst (TTS och STT)](./chat-voice.md) för hela flödet.

## Fliken AI-standardvärden

Fliken AI-standardvärden har två avsnitt.

### Föredragen uppgift och modell

Välj en **föredragen LLM-uppgift** och en **modell** från den. Detta blir startvärdet för alla AI-funktioner i appen – chatt, [AI-assistenten](./ai-assistant.md) (byggare, analysator och Workflow-skapande), board-mapper, AI-dashboardwidgets, [docs-chatt](../tabs/chat-tab.md), AI-schemahjälpen för datatabeller, uttrycksbyggaren och evals – närhelst den ytan inte har ett eget sparat val.

Urvalsregeln som varje yta följer är:

1. **Sparat val** – ett val som redan gjorts på den ytan (till exempel en chattkonversations senaste modell) har alltid prioritet.
2. **Föredragen** – används när det inte finns något sparat val.
3. **Första tillgängliga uppgift** – reservalternativet när ingen preferens har angetts.

Uppgiften och modellen kan fortfarande ändras per yta när som helst; preferensen fyller endast startvärdet. Lämna uppgiften som **Ingen preferens** för att behålla det tidigare beteendet med första uppgiften. Om den föredragna uppgiften senare tas bort eller slutar delas visas ett meddelande på fliken och ytorna faller tyst tillbaka till den första tillgängliga uppgiften.
### Användning av kodningspaket

För varje **Codex**-autentiseringsuppgift (inklusive delade sådana) visar fliken återstående användning av hastighetsbegränsning som en horisontell stapel per aktivt fönster — till exempel ett **5 timmar**-fönster och/eller ett **Veckovis**-fönster, beroende på plan. Varje stapel visar procentandelen återstående kvot och en nedräkning till återställning. En **Uppdatera**-knapp hämtar på nytt vid behov (resultat cachas kortvarigt på servern).

För varje **OpenCode**-autentiseringsuppgift visar fliken OpenCode Go-prenumerationsfönstren — **5 timmar**, **Veckovis** och **Månadsvis** — som samma typ av stapel, lästa från gatewayens autentiserade användnings-endpoint med den autentiseringsuppgiftens API-nyckel. Ett fönster som har nått sin gräns visas som **"limit reached"** i bärnstensfärg. Om nyckeln är ogiltig eller arbetsytan inte har någon Go-prenumeration visar kortet varför istället för att visa staplar.

## Observability-fliken

Observability-fliken visar den skrivskyddade statusen för [OpenTelemetry Tracing](./opentelemetry.md) för denna instans: huruvida spårning är aktiverad, OTLP-endpointen, tjänstenamnet, sampler-kvoten och vilka spans som sänds ut. Spårning konfigureras genom `HEYM_OTEL_*`-miljövariabler på backend, så denna flik redigerar ingenting. När spårning är inaktiverad listar fliken de miljövariabler som behövs för att aktivera den. Hemligheter såsom OTLP-autentiseringshuvuden visas aldrig här. Se [Miljövariabler](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) för den fullständiga konfigurationsreferensen.

## SSO-fliken

Endast synlig för instansadministratörer — kontona som listas i `HEYM_ADMIN_EMAILS`. Denna flik ansluter Heym till en extern OpenID Connect-leverantör så att personer loggar in med de konton de redan har. Ange en issuer-URL och klientautentiseringsuppgifter, kopiera den skrivskyddade omdirigerings-URI:n till leverantören och kör **Testa anslutning** innan den aktiveras. Lösenordsinloggning kan stängas av härifrån när testet har godkänts. Se [Single Sign-On](./sso.md) för den fullständiga installationen.

## Instances-fliken

Endast synlig för instansadministratörer — kontona som listas i `HEYM_ADMIN_EMAILS`. Denna flik listar de Heym-instanser som är anslutna till denna databas och anger hur bakgrundskörningar fördelas mellan dem. Varje rad visar instansens redigerbara namn, dess roll, huruvida den är aktiv, dess uppmätta latens till databasen, en på/av-brytare och dess vikt. Vikter är andelar av de instanser som för närvarande kan ta arbete, inte procentandelar av 100: med `41 / 26 / 33` och den tredje instansen avstängd tar de två första faktiskt emot 61 % och 39 %. Panelen visar den effektiva fördelningen under tabellen och vägrar endast att spara när ingen aktiverad instans har någon vikt alls.

**Ge nya instanser en andel automatiskt** är på som standard: en instans som ansluter skulle annars hamna på vikt 0 och inte ta emot något, så ledaren ger den en lika stor andel en gång och skalar ned de befintliga vikterna med bibehållna proportioner. Den rör aldrig en instans vars vikt har angetts manuellt.

Panelen rapporterar också hur många av de senaste 24 timmarnas körningar som endast kunde köras på huvudinstansen. När den andelen är hög kan vikterna nedanför den inte flytta det arbetet. Se [Lastfördelning](./cluster.md) för vad som stannar på huvudinstansen och hur siffrorna väljs.

## Vad som inte finns i denna dialog

| Funktion | Var den hittas |
|---------|-----------------|
| **API-nyckelhantering (MCP)** | [MCP-fliken](../tabs/mcp-tab.md) – visa, kopiera och återskapa aktuell MCP-server-API-nyckel |
| **Tema (mörkt / ljust)** | Sol/Måne-växlingsknapp i sidhuvudet (bredvid användarbadgen) |
| **E-poständring** | Stöds för närvarande inte |

## Relaterat

- [AI-assistent](./ai-assistant.md) – Workflow builder-chatt som använder användarregler
- [Chat-fliken](../tabs/chat-tab.md) – Dashboard-chatt som använder användarregler
- [Chat Voice (TTS & STT)](./chat-voice.md) – ElevenLabs-röst konfigurerad i Voice-fliken
- [MCP-fliken](../tabs/mcp-tab.md) – MCP-server-API-nyckel och exponering av workflow-verktyg
- [Credentials-fliken](../tabs/credentials-tab.md) – API-nycklar för AI-noder och integrationer
- [Säkerhet](./security.md) – Sessionshantering, hastighetsbegränsning, kryptering av autentiseringsuppgifter
- [Single Sign-On](./sso.md) – Anslut en extern OpenID Connect-leverantör
- [OpenTelemetry Tracing](./opentelemetry.md) – Distribuerad spårning för workflow- och nodexekveringar
