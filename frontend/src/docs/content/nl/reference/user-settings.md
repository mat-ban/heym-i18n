# Instellingen

Het dialoogvenster Instellingen biedt de mogelijkheid om uw profiel te beheren, persistente AI-instructies in te stellen, uw accountwachtwoord bij te werken, chatstem te configureren, uw standaard AI-referentie en -model in te stellen en de observability-status te bekijken. Open het door op **uw avatar en naam** in de rechterbovenhoek van de header te klikken.

## Het dialoogvenster openen

Klik op **uw avatar en naam** in de rechterbovenhoek van de header. Het dialoogvenster wordt geopend met de volgende tabbladen: **Profiel**, **Beveiliging**, **Stem**, **AI-standaarden** en **Observability**. Beheerders van de instantie zien ook een tabblad **SSO**.

## Tabblad Profiel

### Profielfoto

Heym toont uw [Gravatar](https://gravatar.com)-foto voor het e-mailadres van uw account in de header, naast uw berichten in [Chat](../tabs/chat-tab.md) en **Chat met Heym**, bij opmerkingen op [Board](../tabs/board-tab.md), en naast uw naam in deelvensters en ledenlijsten van teams. Om deze te wijzigen, werkt u de foto bij op Gravatar; Heym neemt de nieuwe binnen enkele uren over. Zonder Gravatar-foto toont Heym de eerste letter van uw naam.

De foto wordt opgehaald door de Heym-server en daar gecached, zodat uw browser nooit contact opneemt met Gravatar. Als de server Gravatar niet kan bereiken, blijven alle gebruikers initialen zien.

### Naam

Uw weergavenaam die in de hele applicatie wordt getoond. Dit veld is verplicht en mag niet leeg blijven.

### Gebruikersregels

Gebruikersregels zijn aangepaste instructies die automatisch worden toegevoegd aan elke AI-aanvraag—zowel in de workflow builder als in de dashboard-chat. In de **workflow builder** ([AI Assistant](./ai-assistant.md)) worden ze toegevoegd aan de system prompt die wordt gebruikt om workflow-JSON te genereren. In de **dashboard-chat** worden ze toegepast als context op systeemniveau. U schrijft ze één keer en ze worden globaal toegepast zonder ze bij elke prompt te herhalen.

**Veelvoorkomende toepassingen:**

- Taal of toon: `Always respond in English. Keep responses concise.`
- Programmeerstijl: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Workflow-conventies: `Include error handling in all workflows. Use descriptive node labels.`
- Antwoordformaat: `Use bullet points. Avoid lengthy explanations.`

**Waar ze van toepassing zijn:**

| Context | Beschrijving |
|---------|-------------|
| **Workflow builder** | [AI Assistant](./ai-assistant.md)-aanvragen voor het genereren of wijzigen van workflows |
| **Dashboard-chat** | Alle gesprekken in het tabblad [Chat](../tabs/chat-tab.md) |

Gebruikersregels worden op systeemniveau toegevoegd—ze worden automatisch vóór elke prompt uitgevoerd, zonder extra configuratie per workflow of gesprek.

### Profielwijzigingen opslaan

Klik op **Wijzigingen opslaan** om toe te passen. Wijzigingen worden onmiddellijk van kracht voor alle nieuwe AI-aanvragen.

## Tabblad Beveiliging

### Wachtwoord wijzigen

Gebruik het tabblad Beveiliging om het wachtwoord van uw account bij te werken.

**Vereisten:**

| Regel | Vereiste |
|-------|----------|
| Minimale lengte | 8 tekens |
| Hoofdletters | Ten minste één hoofdletter (A–Z) |
| Kleine letters | Ten minste één kleine letter (a–z) |
| Cijfer | Ten minste één cijfer (0–9) |

Het wachtwoord moet ook verschillen van uw huidige wachtwoord. Deze regels worden zowel aan de frontend als aan de backend afgedwongen.

**Stappen:**

1. Voer uw **Huidige wachtwoord** in
2. Voer uw **Nieuwe wachtwoord** in (moet aan alle bovenstaande vereisten voldoen)
3. Voer het opnieuw in bij **Nieuw wachtwoord bevestigen**
4. Klik op **Wachtwoord bijwerken**

Als het huidige wachtwoord onjuist is, wordt een inline foutmelding getoond. Bij succes verschijnt een bevestigingsbericht en wordt het formulier automatisch gereset.

## Tabblad Stem

Het tabblad Stem configureert gesproken stem voor het tabblad [Chat](../tabs/chat-tab.md): kies een **ElevenLabs-referentie** (of voeg er inline een toe), kies een **Stem** uit uw ElevenLabs-account en klik op **Steminstellingen opslaan**. Dit maakt voorlezen per bericht en interactieve spraakmodus mogelijk. Zie [Chatstem (TTS & STT)](./chat-voice.md) voor de volledige flow.

## Tabblad AI-standaarden

Het tabblad AI-standaarden heeft twee secties.

### Voorkeursreferentie en -model

Kies een **voorkeursreferentie voor LLM** en een **model** daaruit. Dit wordt de startstandaard voor elke AI-functie in de applicatie — chat, de [AI Assistant](./ai-assistant.md) (builder, analyzer en workflowcreatie), board mapper, AI-dashboardwidgets, [docs-chat](../tabs/chat-tab.md), de AI-schemahulp voor gegevenstabellen, de expressiebouwer en evaluaties — telkens wanneer dat oppervlak geen eigen opgeslagen selectie heeft.

De selectieregel die elk oppervlak volgt is:

1. **Opgeslagen selectie** — een keuze die u al op dat oppervlak hebt gemaakt (bijvoorbeeld het laatste model van een chatgesprek) heeft altijd voorrang.
2. **Voorkeur** — gebruikt wanneer er geen opgeslagen selectie is.
3. **Eerste beschikbare referentie** — de terugvaloptie wanneer u geen voorkeur hebt ingesteld.

U kunt de referentie en het model op elk oppervlak nog steeds op elk moment wijzigen; de voorkeur vult alleen de initiële standaard. Laat de referentie op **Geen voorkeur** staan om het eerdere gedrag van de eerste referentie te behouden. Als uw voorkeursreferentie later wordt verwijderd of niet meer wordt gedeeld, toont het tabblad een melding en vallen de oppervlakken stilzwijgend terug op de eerste beschikbare referentie.

### Gebruik van het coding-pakket

Voor elke **Codex**-referentie (inclusief gedeelde referenties) toont het tabblad het resterende rate-limit-gebruik als een horizontale balk per actief venster — bijvoorbeeld een venster van **5 uur** en/of een **Wekelijks** venster, afhankelijk van uw abonnement. Elke balk toont het percentage resterend quotum en een aftelling tot reset. Een knop **Vernieuwen** haalt de gegevens op verzoek opnieuw op (resultaten worden kort op de server gecachet).

Voor elke **OpenCode**-referentie toont het tabblad de abonnementsvensters van OpenCode Go — **5 uur**, **Wekelijks** en **Maandelijks** — in dezelfde balkstijl, uitgelezen via het geauthenticeerde usage-endpoint van de gateway met de API-sleutel van die referentie. Een venster dat zijn limiet heeft bereikt, wordt weergegeven als **"limiet bereikt"** in amber. Als de sleutel ongeldig is of de workspace geen Go-abonnement heeft, vermeldt de kaart de reden in plaats van balken te tonen.

## Tabblad Observability

Het tabblad Observability toont de alleen-lezen status van [OpenTelemetry Tracing](./opentelemetry.md) voor deze instantie: of tracing is ingeschakeld, het OTLP-endpoint, de servicenaam, de sampler-ratio en welke spans worden uitgezonden. Tracing wordt geconfigureerd via `HEYM_OTEL_*`-omgevingsvariabelen op de backend, dus dit tabblad bewerkt niets. Wanneer tracing is uitgeschakeld, vermeldt het tabblad de omgevingsvariabelen die nodig zijn om het in te schakelen. Geheimen zoals OTLP-authenticatieheaders worden hier nooit getoond. Zie [Omgevingsvariabelen](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) voor de volledige configuratiereferentie.

## Tabblad SSO

Alleen zichtbaar voor instantiebeheerders — de accounts die in `HEYM_ADMIN_EMAILS` zijn vermeld. Dit tabblad verbindt Heym met een externe OpenID Connect-provider, zodat gebruikers zich aanmelden met de accounts die zij al hebben. Voer een issuer-URL en client-referenties in, kopieer de alleen-lezen redirect-URI naar uw provider en voer **Verbinding testen** uit voordat u het inschakelt. Aanmelden met wachtwoord kan hier worden uitgeschakeld zodra de test slaagt. Zie [Single Sign-On](./sso.md) voor de volledige installatie.

## Tabblad Instances

Alleen zichtbaar voor instantiebeheerders — de accounts die in `HEYM_ADMIN_EMAILS` zijn vermeld. Dit tabblad vermeldt de Heym-instanties die met deze database zijn verbonden en stelt in hoe achtergronduitvoeringen tussen hen worden verdeeld. Elke rij toont de bewerkbare naam van de instantie, de rol, of de instantie live is, de gemeten latentie naar de database, een aan/uit-schakelaar en het gewicht. Gewichten zijn aandelen van de instanties die op dat moment werk kunnen aannemen, geen percentages van 100: bij `41 / 26 / 33` en de derde instantie uit ontvangen de eerste twee werkelijk 61% en 39%. Het paneel toont die effectieve verdeling onder de tabel en weigert alleen op te slaan wanneer geen enkele ingeschakelde instantie een gewicht heeft.

**Geef nieuwe instanties automatisch een aandeel** staat standaard aan: een instantie die toetreedt, zou anders op gewicht 0 blijven staan en niets ontvangen, dus geeft de leader deze eenmalig een gelijk aandeel en schaalt de bestaande gewichten naar beneden met behoud van hun verhoudingen. Een instantie waarvan u het gewicht zelf hebt ingesteld, wordt nooit aangepast.

Het paneel rapporteert ook hoeveel van de uitvoeringen van de afgelopen 24 uur alleen op de hoofdinstantie konden worden uitgevoerd. Wanneer dat aandeel hoog is, kunnen de gewichten daaronder dat werk niet verplaatsen. Zie [Load Distribution](./cluster.md) voor wat op de hoofdinstantie blijft en hoe u de getallen kiest.

## Wat niet in dit dialoogvenster staat

| Functie | Waar te vinden |
|---------|-----------------|
| **API-sleutelbeheer (MCP)** | [Tabblad MCP](../tabs/mcp-tab.md) – bekijk, kopieer en regenereer uw MCP-server-API-sleutel |
| **Thema (donker / licht)** | Zon/Maan-schakelknop in de header (naast de gebruikersbadge) |
| **E-mailadres wijzigen** | Momenteel niet ondersteund |

## Gerelateerd

- [AI Assistant](./ai-assistant.md) – Chat van de Workflow-builder die User Rules gebruikt
- [Tabblad Chat](../tabs/chat-tab.md) – Dashboardchat die User Rules gebruikt
- [Chat Voice (TTS & STT)](./chat-voice.md) – ElevenLabs-stem geconfigureerd op het tabblad Voice
- [Tabblad MCP](../tabs/mcp-tab.md) – MCP-server-API-sleutel en het beschikbaar stellen van workflow-tools
- [Tabblad Credentials](../tabs/credentials-tab.md) – API-sleutels voor AI-knooppunten en integraties
- [Security](./security.md) – Sessiebeheer, rate limiting, versleuteling van referenties
- [Single Sign-On](./sso.md) – Verbind een externe OpenID Connect-provider
- [OpenTelemetry Tracing](./opentelemetry.md) – Gedistribueerde tracing voor workflow- en knooppuntuitvoeringen
