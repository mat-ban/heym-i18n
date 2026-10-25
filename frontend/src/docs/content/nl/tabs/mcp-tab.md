# MCP-tabblad

Het tabblad **MCP** configureert de integratie van het Model Context Protocol (MCP). Met MCP kunnen AI-clients (Claude, ChatGPT, Gemini, Cursor en elk MCP-compatibel hulpmiddel) uw Heym-workflows als tools aanroepen.

Heym ondersteunt twee modi: een **standaardserver** die alle MCP-ingeschakelde workflows onder één endpoint beschikbaar stelt, en **benoemde servers** die elke logische groep workflows een eigen URL en API-key geven.

Beide modi kunnen twee soorten tools beschikbaar stellen: afzonderlijke **workflows**, en de **Heym chat-tool** — de volledige engine van het [Chat-tabblad](./chat-tab.md) achter één `heym_chat`-tool.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ MCP-demo bekijken</a></p>

## Standaard MCP-server

De standaardserver is altijd beschikbaar op `{origin}/api/mcp/sse`. Alle workflows waarvoor MCP is ingeschakeld, verschijnen hier als tools.

### MCP API-key

- Keys worden opgeslagen als SHA-256-digests, dus Heym kan een bestaande key niet aan u tonen. Het tabblad meldt of er een is ingesteld, niet wat deze is.
- **Genereren** / **Opnieuw genereren** – De nieuwe key wordt één keer weergegeven, direct nadat u deze aanmaakt. Kopieer deze dan; bij het herladen van het tabblad wordt deze definitief verborgen.
- Gebruik deze key bij het verbinden van Claude Desktop, Cursor of andere MCP-clients met Heym
- Key kwijt? Genereer deze opnieuw. De vorige key werkt onmiddellijk niet meer.

### Verbindingsmethoden

- **API-key** – Gebruik de MCP API-key voor programmatische verbindingen. Het tabblad kan een kant-en-klare JSON-configuratie kopiëren en bevat een knop **Toevoegen aan Cursor** voor eenmalige Cursor-installatie.
- **Claude** – Het tabblad toont de MCP-server-URL en de installatiestappen voor Claude. Laat OAuth Client ID en Secret leeg; Claude registreert zich automatisch en authenticeert via Heym OAuth.
- **ChatGPT** – Het tabblad toont de MCP-server-URL en de instellingsstappen voor een ChatGPT-app. Schakel de ontwikkelaarsmodus in, maak een app aan met de URL en kies OAuth; ChatGPT registreert zich automatisch.
- **Gemini** – Het tabblad toont de MCP-server-URL en de instellingsstappen voor een aangepaste Gemini-app: ga in gemini.google.com naar **Settings → Connected Apps → Add a custom app**, plak de URL en laat **Advanced features** gesloten; Gemini registreert zich automatisch en authenticeert via Heym OAuth. Eenmaal verbonden werkt Heym ook in de mobiele Gemini-app.

### MCP-schakelaar per workflow

Elke workflow kan als MCP-tool beschikbaar worden gesteld:

- **Inschakelen** – De tools van de workflow worden beschikbaar voor alle clients die met de standaardserver zijn verbonden
- **Uitschakelen** – De workflow wordt niet beschikbaar gesteld

Workflowkaarten tonen de beschrijving en een voorbeeld van de namen van invoervelden, zodat u kunt zien wat elke tool verwacht voordat u deze inschakelt.


### Uitvoeringen in de wachtrij en heym_execution_status

Een workflow met een [gelijktijdigheidslimiet](../reference/webhooks.md#concurrency-limit-and-queued-runs) kan bezet zijn wanneer een client deze aanroept. De aanroep retourneert dan direct een resultaat dat geen fout is:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

De client pollt de tool `heym_execution_status` met dat `execution_id`. Het retourneert dezelfde body als de [status-URL](../reference/webhooks.md#status-url): `queued` met de huidige positie, `running`, en vervolgens `success` of `error` met de uitvoer. Het vindt alleen uitvoeringen van workflows die dezelfde server beschikbaar stelt. De tool wordt alleen vermeld op de standaardserver en op elke benoemde server zolang ten minste één van de workflows een gelijktijdigheidslimiet heeft. Wanneer de wachtrij vol is, retourneert de aanroep de fout "Concurrency queue is full".
## Heym chat-tool

De sectie **Heym Capabilities** verandert de engine van het Chat-tabblad in één MCP-tool met de naam `heym_chat`. Schakel deze in op de standaardserver, op een benoemde server, of op beide — elk oppervlak behoudt zijn eigen schakelaar en modelselectie.

Wanneer deze is ingeschakeld, verschijnt `heym_chat` in `tools/list` naast uw workflow-tools. Een MCP-client stuurt één bericht in natuurlijke taal en de Heym-engine neemt het vanaf daar over, met dezelfde mogelijkheden als het Chat-tabblad:

- Een workflow bouwen, testen met voorbeeldinvoer, corrigeren en voltooien zodra een uitvoering slaagt (zie [Build-modus](#build-mode))
- Uw bestaande workflows inspecteren en uitvoeren
- Analytics, recente uitvoeringen en aankomende cron-schema's rapporteren
- De uitvoeringsgeschiedenis van één workflow rapporteren: hoe vaak deze is uitgevoerd, statusaantallen, wanneer deze is uitgevoerd, en op verzoek de inputs, outputs en fouten per knooppunt van één uitvoering
- Rapporteren wat er nu actief is: hoeveel uitvoeringen actief zijn, hun workflownamen, hoe lang elk al draait, op welk knooppunt elk zich momenteel bevindt, en een link naar de live uitvoering
- Boards weergeven, kaarten aanmaken en kaartdetails lezen op het [Board-tabblad](./board-tab.md)
- Uw gegevenstabellen met hun kolommen weergeven, nieuwe aanmaken en deze in de workflows verwerken die het bouwt
- Referenties aanmaken of bijwerken op Heyms eigen pagina (zie [Referenties](#referenties))
- Teams en globale variabelen lezen, en de documentatie doorzoeken
- Openstaande human-in-the-loop-reviews goedkeuren, bewerken of weigeren

Mogelijkheden die later aan het Chat-tabblad worden toegevoegd, worden automatisch beschikbaar via `heym_chat` — er is geen schakelaar per mogelijkheid die gesynchroniseerd moet blijven.

### Build-modus

`heym_chat` voert de Chat-engine altijd uit in de build-modus. In één aanroep kan de assistent een nieuwe workflow opslaan, deze uitvoeren met realistische voorbeeldinvoer, het uitvoeringsrapport lezen, herstellen wat mislukte en de workflow opnieuw uitvoeren, tot maximaal vijf testruns per aanroep. Wanneer de laatste uitvoering van de laatste opslag slaagt, rondt hij af met een samenvatting van één zin en eindigt het antwoord met `Verified: the latest test run of the saved workflow passed.`

Wanneer een aanroep een workflow maakt of bewerkt, vermeldt het antwoord elk van hen met de volledige editor-link, zoals `https://heym.example.com/workflows/<id>`, en de links in het antwoord van de assistent zijn ook volledige links. Ze gebruiken uw geconfigureerde Heym-adres (`FRONTEND_URL`) en openen voor mensen die zijn aangemeld bij Heym en toegang hebben tot die workflow.

- Testruns zijn echte uitvoeringen. De neveneffecten vinden daadwerkelijk plaats en ze verschijnen net als elke andere uitvoering in de uitvoeringsgeschiedenis van de workflow.
- Opslagacties volgen het pad van de editor: een wijziging in de grafiek behoudt de vorige grafiek in de **Edit History** van de workflow.
- Om een eerder gebouwde workflow te wijzigen, zet u de thread voort met dezelfde `conversation_id`. De assistent werkt die workflow bij in plaats van een nieuwe aan te maken, en wijzigt alleen workflows die u mag bewerken.
- Wanneer de vijf testruns zijn verbruikt, stopt de assistent en legt hij uit wat er nog steeds mislukt.

Gegevenstabellen zijn anders. Een tabel bevat geen geheim, dus `heym_chat` kan uw tabellen weergeven, vragen welke een workflow moet gebruiken, en een nieuwe aanmaken met de bijbehorende kolommen. Het leest of schrijft nooit rijen.

### Referenties

`heym_chat` ziet de referenties die u bezit en de referenties die met u zijn gedeeld, op naam en type, op dezelfde manier als het tabblad Chat. Wanneer een workflow die het bouwt een referentie nodig heeft, vraagt het als vraag in het resultaat welke moet worden gebruikt. Beantwoord dit met hetzelfde `conversation_id`.

Om een referentie toe te voegen of een eigen referentie bij te werken, opent de assistent Heyms referentieformulier op een Heym-pagina, `/credentials/setup/<id>`. U meldt zich daar aan bij Heym, voert de sleutel in of koppelt het account en slaat op. De waarde gaat rechtstreeks naar Heym: de MCP-client en zijn model leren alleen de naam en het type van de referentie kennen. Plak geen sleutels in de MCP-client; vraag in plaats daarvan om het formulier.

| Client | Wat er gebeurt |
|--------|----------------|
| Ondersteunt MCP-URL-elicitatie | De client vraagt u om de Heym-pagina te openen. De aanroep wacht terwijl u het formulier invult (maximaal tien minuten) en gaat dan verder met de nieuwe referentie. |
| Alle andere | Het resultaat bevat de link en vraagt de client om `heym_chat` opnieuw aan te roepen met `wait_for_credential_form`. Die aanroep wacht maximaal vijf minuten terwijl u het formulier invult en hervat vervolgens het gesprek. Als de client niet wacht, sla het formulier dan op en antwoord met hetzelfde `conversation_id`; de volgende aanroep weet dat het formulier is opgeslagen en welke referentie is aangemaakt. |

De pagina opent alleen voor het Heym-account dat het verzoek heeft gestart, dus een doorgestuurde link is voor niemand anders bruikbaar. Een formulier blijft 24 uur open en kan vanaf de pagina worden afgewezen. Zodra u het opslaat of afwijst, toont de stap in het gesprek van het tabblad Chat het resultaat.


### Referentie en model

`heym_chat` voert de engine uit op uw Heym-account, dus het heeft een eigen LLM-referentie nodig:

| Veld | Gedrag |
|-------|----------|
| **Referentie** | Kies een OpenAI-, Google- of Custom-referentie waartoe u toegang hebt. Vooraf ingevuld op basis van de voorkeursreferentie in [Instellingen](../reference/user-settings.md) wanneer u er nog geen hebt gekozen. |
| **Model** | Geladen op basis van de geselecteerde referentie. Vooraf ingevuld op basis van uw voorkeursmodel wanneer de referentie overeenkomt. |

Als een van beide ontbreekt, verschijnt de tool nog steeds in `tools/list`, maar elke aanroep retourneert een fout die aangeeft dat u de configuratie op dit tabblad moet voltooien.


LLM- en Agent-knooppunten in een workflow die `heym_chat` bouwt, worden uitgevoerd met deze referentie en dit model, inclusief referenties die iemand met u heeft gedeeld, zodat testuitvoeringen werken zonder verdere instellingsstap. Wanneer `heym_chat` een workflow bewerkt, behouden LLM- en Agent-knooppunten die al een referentie hebben deze samen met hun model.
### Argumenten en geschiedenis

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `message` | Ja | De instructie of vraag, in natuurlijke taal. |
| `conversation_id` | Nee | Een `conversation_id` uit een eerder `heym_chat`-resultaat, om dat gesprek voort te zetten. |
| `wait_for_credential_form` | Nee | Met `conversation_id`: wachten tot de gebruiker het referentieformulier dat de thread heeft geopend opslaat of weigert, en vervolgens `message` verzenden. |

Elke aanroep wordt als een normaal gesprek in de geschiedenis van uw [Chat-tabblad](./chat-tab.md) vastgelegd, gemarkeerd met een stekkerpictogram in de gesprekkenlijst. Berichten, toolkaarten en verduidelijkingspauzes zien er precies zo uit als een gesprek dat u zelf bent begonnen, en u kunt het gesprek openen en in de browser blijven praten. Elk resultaat retourneert zijn `conversation_id`, zodat de MCP-client hetzelfde gesprek kan voortzetten in plaats van bij elke aanroep een nieuw gesprek te openen.

Wanneer de assistent verduidelijking nodig heeft, pauzeert deze en geeft dit aan; antwoord met de antwoorden via hetzelfde `conversation_id`.

## Benoemde MCP-servers

Met benoemde servers kunt u workflows opsplitsen in geïsoleerde MCP-endpoints. Elke server heeft een eigen URL en API-key, zodat verschillende AI-clients, teams of use cases verbinding kunnen maken met precies de workflows die zij nodig hebben.

### Een benoemde server aanmaken

1. Typ een naam in het invoerveld onderaan het tabblad MCP (bijv. **CRM Tools**)
2. Klik op **Create** — er verschijnt direct een nieuwe serverkaart
3. Klik op de kaart om deze uit te klappen

### Instellingen per server

Elke serverkaart toont:

| Instelling | Beschrijving |
|---------|-------------|
| **SSE Endpoint** | Unieke URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Onafhankelijke key, eenmalig getoond bij generatie of regeneratie. Kopieer deze direct; de key wordt gehasht opgeslagen en kan later niet meer worden onthuld |
| **How to connect** | **Copy JSON** kopieert de direct te plakken MCP-configuratie; **Add to Cursor** installeert deze met één klik |
| **Heym Capabilities** | Schakel de `heym_chat`-tool voor deze server in en kies de bijbehorende referentie en het model |
| **Assigned Workflows** | Schakel in welke van uw workflows deze server beschikbaar stelt |

### Workflow-toewijzing

Workflow-toewijzing is per server en onafhankelijk van de schakelaar van de standaardserver. Een workflow kan tegelijkertijd ingeschakeld zijn op de standaardserver en op meerdere benoemde servers, of op geen enkele.

Bij het in- of uitschakelen van een workflow verplaatst deze naar de bovenkant van de toegewezen lijst, zodat de regel die zojuist is gewijzigd zichtbaar blijft in plaats van uit het beeld te scrollen.

### Authenticatie

Benoemde servers ondersteunen dezelfde authenticatiemethoden als de standaardserver:

- **X-MCP-Key header** – Geef de API-key van de server direct door (API-clients, Cursor). Alleen als header: keys worden niet geaccepteerd als `?key=`-queryparameter, omdat URL's terechtkomen in access logs, proxy logs en browsergeschiedenis.
- **Claude, ChatGPT en Gemini OAuth** – Voeg de server-URL toe aan de connectoren of aangepaste apps van de client; laat de referenties leeg en de client registreert zich automatisch via OAuth. Het bearer token moet worden meegestuurd in de `Authorization`-header, niet als `?token=`.
- **Session token** – Uitgegeven tijdens de SSE-handshake; gebonden aan de specifieke server, zodat tokens van de ene benoemde server geen toegang krijgen tot een andere. Deze kortlevende `?session=`-parameter wordt niet beïnvloed.

### Een benoemde server verwijderen

Klik op het **X**-pictogram in de koptekst van een serverkaart. Verwijdering verwijdert de server en alle bijbehorende workflow-toewijzingen; de workflows zelf worden niet beïnvloed.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Beide endpoints ondersteunen het SSE-transport (GET, MCP-specificatie 2024-11-05) en het Streamable HTTP-transport (POST, MCP-specificatie 2025-03-26). Claude, ChatGPT en Gemini gebruiken OAuth 2.1 / PKCE voor veilige aanmelding op beide.

## Gerelateerd

- [Why Heym](../getting-started/why-heym.md) – MCP als eersteklas primitief in Heym
- [Agent Node](../nodes/agent-node.md) – Agent-knooppunt met MCP-toolondersteuning
- [Agent Architecture](../reference/agent-architecture.md) – MCP-client, tool-dispatch, orchestrator
- [Triggers](../reference/triggers.md) – MCP als workflow-entrypoint
- [Chat Tab](./chat-tab.md) – De engine achter de `heym_chat`-tool
- [Workflows Tab](./workflows-tab.md) – Workflows aanmaken en beheren
- [Node Types](../reference/node-types.md) – Overzicht van AI-knooppunten
- [Contextual Showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboard-oppervlakken
