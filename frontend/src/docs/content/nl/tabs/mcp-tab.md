# MCP-tabblad

Het tabblad **MCP** configureert de integratie van het Model Context Protocol (MCP). Met MCP kunnen AI-clients (Claude, Cursor en elk MCP-compatibel hulpmiddel) uw Heym-workflows als tools aanroepen.

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

### MCP-schakelaar per workflow

Elke workflow kan als MCP-tool beschikbaar worden gesteld:

- **Inschakelen** – De tools van de workflow worden beschikbaar voor alle clients die met de standaardserver zijn verbonden
- **Uitschakelen** – De workflow wordt niet beschikbaar gesteld

Workflowkaarten tonen de beschrijving en een voorbeeld van de namen van invoervelden, zodat u kunt zien wat elke tool verwacht voordat u deze inschakelt.

## Heym chat-tool

De sectie **Heym Capabilities** verandert de engine van het Chat-tabblad in één MCP-tool met de naam `heym_chat`. Schakel deze in op de standaardserver, op een benoemde server, of op beide — elk oppervlak behoudt zijn eigen schakelaar en modelselectie.

Wanneer deze is ingeschakeld, verschijnt `heym_chat` in `tools/list` naast uw workflow-tools. Een MCP-client stuurt één bericht in natuurlijke taal en de Heym-engine neemt het vanaf daar over, met dezelfde mogelijkheden als het Chat-tabblad:

- Workflows bouwen, bewerken, inspecteren en uitvoeren via de Workflow AI Builder
- Analytics, recente uitvoeringen en aankomende cron-schema's rapporteren
- De uitvoeringsgeschiedenis van één workflow rapporteren: hoe vaak deze is uitgevoerd, statusaantallen, wanneer deze is uitgevoerd, en op verzoek de inputs, outputs en fouten per knooppunt van één uitvoering
- Rapporteren wat er nu actief is: hoeveel uitvoeringen actief zijn, hun workflownamen, hoe lang elk al draait, op welk knooppunt elk zich momenteel bevindt, en een link naar de live uitvoering
- Boards weergeven, kaarten aanmaken en kaartdetails lezen op het [Board-tabblad](./board-tab.md)
- Uw gegevenstabellen met hun kolommen weergeven, nieuwe aanmaken en deze in de workflows verwerken die het bouwt
- Teams en globale variabelen lezen, en de documentatie doorzoeken
- Openstaande human-in-the-loop-reviews goedkeuren, bewerken of weigeren

Mogelijkheden die later aan het Chat-tabblad worden toegevoegd, worden automatisch beschikbaar via `heym_chat` — er is geen schakelaar per mogelijkheid die gesynchroniseerd moet blijven.

Referenties blijven in de UI: `heym_chat` vermeldt, kiest of maakt deze nooit. Wanneer het een workflow bouwt of bewerkt, blijven nieuwe knooppunten die een referentie nodig hebben leeg en noemt het antwoord deze, zodat u ze in de editor kunt instellen.

Gegevenstabellen zijn anders. Een tabel bevat geen geheim, dus `heym_chat` kan uw tabellen weergeven, vragen welke een workflow moet gebruiken, en een nieuwe aanmaken met de bijbehorende kolommen. Het leest of schrijft nooit rijen.

### Referentie en model

`heym_chat` voert de engine uit op uw Heym-account, dus het heeft een eigen LLM-referentie nodig:

| Veld | Gedrag |
|-------|----------|
| **Referentie** | Kies een OpenAI-, Google- of Custom-referentie waartoe u toegang hebt. Vooraf ingevuld op basis van de voorkeursreferentie in [Instellingen](../reference/user-settings.md) wanneer u er nog geen hebt gekozen. |
| **Model** | Geladen op basis van de geselecteerde referentie. Vooraf ingevuld op basis van uw voorkeursmodel wanneer de referentie overeenkomt. |

Als een van beide ontbreekt, verschijnt de tool nog steeds in `tools/list`, maar elke aanroep retourneert een fout die aangeeft dat u de configuratie op dit tabblad moet voltooien.

### Argumenten en geschiedenis

| Argument | Vereist | Beschrijving |
|----------|----------|-------------|
| `message` | Ja | De instructie of vraag, in natuurlijke taal. |
| `conversation_id` | Nee | Een `conversation_id` uit een eerder `heym_chat`-resultaat, om dat gesprek voort te zetten. |

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
- **Claude OAuth** – Voeg de server-URL toe aan Claude-integraties; laat de referenties leeg en Claude registreert automatisch via OAuth. Het bearer token moet worden meegestuurd in de `Authorization`-header, niet als `?token=`.
- **Session token** – Uitgegeven tijdens de SSE-handshake; gebonden aan de specifieke server, zodat tokens van de ene benoemde server geen toegang krijgen tot een andere. Deze kortlevende `?session=`-parameter wordt niet beïnvloed.

### Een benoemde server verwijderen

Klik op het **X**-pictogram in de koptekst van een serverkaart. Verwijdering verwijdert de server en alle bijbehorende workflow-toewijzingen; de workflows zelf worden niet beïnvloed.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Beide endpoints ondersteunen het SSE-transport (GET, MCP-specificatie 2024-11-05) en het Streamable HTTP-transport (POST, MCP-specificatie 2025-03-26). Claude gebruikt OAuth 2.1 / PKCE voor veilige aanmelding op beide.

## Gerelateerd

- [Why Heym](../getting-started/why-heym.md) – MCP als eersteklas primitief in Heym
- [Agent Node](../nodes/agent-node.md) – Agent-knooppunt met MCP-toolondersteuning
- [Agent Architecture](../reference/agent-architecture.md) – MCP-client, tool-dispatch, orchestrator
- [Triggers](../reference/triggers.md) – MCP als workflow-entrypoint
- [Chat Tab](./chat-tab.md) – De engine achter de `heym_chat`-tool
- [Workflows Tab](./workflows-tab.md) – Workflows aanmaken en beheren
- [Node Types](../reference/node-types.md) – Overzicht van AI-knooppunten
- [Contextual Showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboard-oppervlakken
