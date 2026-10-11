# Workflow-organisatie

Met Heym kunt u workflows in mappen organiseren, sub-mappen aanmaken en workflows inplannen voor verwijdering. Zie [Workflows Tab](../tabs/workflows-tab.md) voor het UI-overzicht.

## Mappen en sub-mappen

Mappen vormen een boomstructuur. Elke map heeft:

- **Naam** – Weergavenaam
- **Parent** – `parent_id` verwijst naar een andere map; `null` betekent root
- **Workflows** – Workflows kunnen via `folder_id` naar mappen worden verplaatst

### API

| Endpoint | Doel |
|----------|---------|
| `GET /folders` | Alleen root-mappen |
| `GET /folders/tree` | Volledige boomstructuur (children + workflows) |
| `GET /folders/{id}` | Enkele map met inhoud |
| `POST /folders` | Map aanmaken (`parent_id` optioneel) |
| `PUT /folders/{id}` | Naam of `parent_id` bijwerken |
| `DELETE /folders/{id}` | Map verwijderen (cascade) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Workflow naar map verplaatsen |
| `DELETE /folders/workflows/{workflow_id}/folder` | Workflow uit map verwijderen |
| `GET /folders/{id}/export` | Map + alle sub-mappen downloaden als ZIP |

### Boomstructuur

De tree-response bevat `children` en `workflows` per map. Gedeelde workflows kunnen via `WorkflowShare.folder_id` in een map verschijnen.

## Workflows delen

Open **Share** in de workflow-editor om gebruikers per e-mail uit te nodigen of te delen met een [team](./teams.md). Elke uitnodiging en elke teamshare heeft een permissie:

| Permissie | Wat de collaborator kan doen |
|------------|------------------------------|
| **Read** | De workflow openen, inspecteren, de uitvoeringsgeschiedenis bekijken en deze uitvoeren. De editor opent in alleen-lezen modus: Opslaan is uitgeschakeld en het canvas kan niet worden gewijzigd. |
| **Write** | Alles wat Read toestaat, plus het bewerken van het canvas, instellingen, analysedocument en agentgeheugen. |

De permissie wordt naast elke vermelding in het Share-dialoogvenster weergegeven en kan op elk moment via die dropdown worden gewijzigd, zonder de share te verwijderen en opnieuw toe te voegen. Wanneer een gebruiker een workflow via meerdere paden bereikt (een directe share en een of meer teams), wint de **hoogste** permissie. Shares die bestonden voordat permissies werden geïntroduceerd zijn **Write**, en API-clients die `permission` weglaten krijgen ook **Write**.

Acties die alleen voor de eigenaar zijn, zijn nooit afhankelijk van de permissie: het verwijderen van een workflow, het terugdraaien of wissen van versies, het wissen van de geschiedenis, het beheren van shares en de [owner-only settings](#owner-only-settings) hieronder blijven bij de eigenaar, zelfs voor **Write**-collaborators. Een **Read**-collaborator die een bewerking via de API verstuurt (`PUT /api/workflows/{id}`, de analysenotitie, agentgeheugen, cache wissen) of via de AI Assistant, ontvangt `403` met `You have read-only access to this workflow`.

Het delen van een workflow verleent toegang tot het canvas, de uitvoeringsgeschiedenis en het analysedocument. Het deelt **niet** automatisch:

- **Referenties** waarnaar nodes in de workflow verwijzen
- **Sub-workflows** die worden aangeroepen door [Execute](../nodes/execute-node.md)-nodes of agents

Ontvangers hebben die referenties en child-workflows apart met hen gedeeld nodig (dezelfde gebruikers of teams). Deel referenties vanuit het [Credentials tab](../tabs/credentials-tab.md); zie [Credentials Sharing](./credentials-sharing.md). Deel elke sub-workflow vanuit het eigen share-dialoogvenster van de editor.

### Owner-only settings

De volledige **Run with cURL**-configuratie blijft bij de eigenaar na het delen. Collaborators openen nog steeds het dialoogvenster en kopiëren het gegenereerde commando, maar de bedieningselementen zijn alleen-lezen.

Het wijzigen van een van deze als niet-eigenaar wordt geweigerd met `403`:

- **Authentication** (`auth_type`) en **Header Key** (`auth_header_key`)
- **Request Body**-modus (`webhook_body_mode`) en **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) en **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) gedraagt zich anders: deze is volledig verborgen voor collaborators, en een schrijfactie van een collaborator wordt genegeerd in plaats van geweigerd. De editor toont het veld gemaskeerd, dus een `403` daar zou een gewone opslagactie verstoren in plaats van een aanval te signaleren.

Authenticatie is de reden dat het blok owner-only is: `Anonymous` laat niet-geauthenticeerde aanroepers de workflow uitvoeren, en een run zonder ingelogde aanroeper resolveert referenties en globale variabelen als de **eigenaar**, niet de aanroeper. De rest van het blok is het gepubliceerde request-contract en de kostenbeheersing van de eigenaar, dus het verplaatst mee.

**On error, run workflow** (`error_workflow_id`) in het workflow-niveau **Properties**-paneel is owner-only om dezelfde reden: de [error workflow](./features.md#error-workflow) draait met de referenties en globale variabelen van de mislukte run, die van de eigenaar zijn voor getriggerde en anonieme runs. Collaborators zien de instelling alleen-lezen, en het toevoegen, vervangen of wissen ervan als niet-eigenaar wordt geweigerd met `403`.

Het bewerken van het canvas, de naam en de beschrijving wordt niet beïnvloed.

### Execution tokens

Een collaborator kan een execution token aanmaken voor een workflow die met hen is gedeeld. De run wordt toegeschreven aan **degene die het token heeft aangemaakt**, dus gebruikt de referenties en globale variabelen van die gebruiker, niet die van de eigenaar. Alleen een werkelijk anonieme aanroep — `auth_type: anonymous` zonder aanroeper — draait in de context van de eigenaar.

## Scheduled for Deletion

Workflows kunnen worden ingepland voor verwijdering in plaats van onmiddellijk te worden verwijderd.

- **Veld**: `scheduled_for_deletion` (nullable datetime)
- **Gedrag**: Wanneer ingesteld, verplaatst de workflow naar `folder_id = null` en verschijnt in de sectie "Scheduled for Deletion".
### API

| Endpoint | Doel |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Stel `scheduled_for_deletion` in, wis `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Wis `scheduled_for_deletion` (herstel) |

### UI

- **Naar prullenbak slepen** – Sleep workflows naar het gebied "Gepland voor verwijdering" om ze in te plannen
- **Herstellen** – Verwijder uit de planning
- **Onmiddellijk verwijderen** – Prullenbakpictogram voor permanente verwijdering

### Opruimlogica

Een cron job wordt dagelijks uitgevoerd om **23:59** (geconfigureerde tijdzone). Een workflow wordt alleen verwijderd wanneer:

- **Alle start-nodes** (nodes zonder inkomende edges, met uitzondering van sticky/errorHandler) `active === false` hebben

Als een start-node nog actief is, blijft de workflow behouden tot de volgende uitvoering.

## Dashboard UI

- **Maprijen** – Nieuwe map, recursieve mapstructuur met uitklappen/inklappen. Elke map heeft een
  optionele beschrijving onder de naam en een badge die het aantal workflows toont dat deze bevat,
  inclusief submappen.
- **Mapacties** – Nieuwe submap, Naam wijzigen, Pictogram wijzigen, Downloaden als ZIP en Verwijderen
  staan inline op elke maprij; het rechtermuisknopcontextmenu biedt dezelfde set, en telefoons tonen
  één menuknop.
- **Hoofdgebied** – Root-workflows (geen map, niet gepland) en Gepland voor verwijdering
- **Voorbeeld van map bij neerzetten** – Bij het slepen van een workflow wordt de exacte map of submap
  gemarkeerd en wordt het volledige pad weergegeven in een voorbeeld op kaartformaat. Een ingeklapte
  map klapt na korte hover uit.
- **Stabiele sleepfeedback** – De bronkaart gebruikt een sleepspook, en het actieve neerzetdoel blijft
  geselecteerd tijdens scrollen of het passeren van bedieningselementen binnen dezelfde map.
- **Bestemmingscontrole** – De huidige map wordt weergegeven als **Al in map** en accepteert geen
  overbodige verplaatsing.
- **Overige neerzetgebieden** – Root en "Gepland voor verwijdering" worden gemarkeerd wanneer ze de
  gesleepte workflow kunnen accepteren.
- **ZIP neerzetten** – Sleep een ZIP-bestand naar het workflowgebied om een mapstructuur op rootniveau
  te importeren

## Gerelateerd

- [Workflows Tab](../tabs/workflows-tab.md) – Workflows aanmaken en beheren
- [Credentials Sharing](./credentials-sharing.md) – Referenties delen met workflowmedewerkers
- [Teams](./teams.md) – Workflows en referenties delen met teams
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nodes en uitvoering
- [Workflow Structure](./workflow-structure.md) – JSON-formaat voor workflows
- [Triggers](./triggers.md) – Start-nodes en toegangspunten
