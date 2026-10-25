# Portaal

Het **Portaal** stelt Heym-workflows beschikbaar als openbare chat-interfaces. Eindgebruikers kunnen workflows via een URL uitvoeren zonder in te loggen bij Heym.

## Wat het doet

- **Openbare URL**: `/chat/{slug}` (bijv. `/chat/my-workflow`)
- **Chat-interface**: Gebruikers communiceren via een chat-UI (berichten, invoer, antwoorden)
- **Optionele authenticatie**: Als portaalgebruikers zijn geconfigureerd, is inloggen vereist; anders is het portaal openbaar
- **Streaming**: Realtime voortgang van nodes tijdens uitvoering (indien ingeschakeld)
- **Actieve uitvoeringen stoppen**: Gebruikers kunnen een lopende portaal-uitvoering stoppen vanuit de chat-footer; de actieve workflow-uitvoering wordt ook server-side geannuleerd
- **Bestandsupload**: Optionele bestandsuploads (tekst, afbeeldingen, enz.) per invoerveld
- **Overdracht naar menselijke beoordeling**: Portaal-uitvoeringen kunnen [HITL-reviewlinks](./human-in-the-loop.md) tonen wanneer een agent pauzeert voor goedkeuring
- **Weergave van afbeeldingen**: Workflow-uitvoer met afbeeldingen (bijv. van LLM-beeldgeneratie of Playwright-screenshots) verschijnt als miniaturen in de chat. Klik op een afbeelding om een volledig scherm te openen; druk op **Esc** of gebruik de terugknop van het apparaat om te sluiten

## Workflow-configuratie

| Instelling | Beschrijving |
|---------|-------------|
| `portal_enabled` | Portaal inschakelen voor deze workflow |
| `portal_slug` | URL-slug (bijv. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Streaming-uitvoering gebruiken |
| `portal_file_upload_enabled` | Bestandsuploads toestaan |
| `portal_file_config` | Bestandsconfiguratie per veld (typen, limieten) |

Configureer in de editor: de knop **Portaal** in de workflow-header opent het dialoogvenster voor portaalinstellingen.

## Flow

1. **Info**: `GET /api/portal/{slug}/info` – Retourneert workflow-metadata en invoervelden (geen authenticatie)
2. **Inloggen** (indien vereist): `POST /api/portal/{slug}/login` – Retourneert een sessietoken
3. **Uitvoeren**: `POST /api/portal/{slug}/execute` – De portaal-chat-UI roept dit aan (of intern de streaming-variant wanneer ingeschakeld); eindgebruikers communiceren via de chat-interface en roepen de API niet rechtstreeks aan.
4. **Stoppen**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Aangeroepen wanneer de gebruiker op **Stop** drukt tijdens een actieve portaal-uitvoering

## HITL in portaal-uitvoeringen

Als een portaal-workflow een [Agent-node](../nodes/agent-node.md) bereikt met [Human-in-the-Loop](./human-in-the-loop.md) ingeschakeld, toont het portaal-antwoord een reviewlink in plaats van leeg te blijven.

- De status van de workflow-uitvoering wordt `pending`
- De portaal-chat toont de review-URL
- Alle nodes die zijn verbonden met de `review`-uitvoerhandle van de agent kunnen onmiddellijk Slack, e-mail of andere kanalen informeren
- Een reviewer voltooit de beslissing op `/review/{token}` zonder in te loggen
- Na de review wordt de workflow hervat vanuit de opgeslagen snapshot

Dit maakt het mogelijk om openbare chat-flows te combineren met besloten stappen voor menselijke goedkeuring.

## Invoervelden

Invoervelden zijn afkomstig van [Invoer](../nodes/input-node.md)-nodes. De API extraheert startnodes van het type `textInput` en hun `inputFields`. Uitvoering gebruikt dezelfde engine als normale uitvoeringen; invoer wordt doorgegeven als `body.inputs` en `conversation_history` voor multi-turn-flows.

## Authenticatie en sessies

- **WorkflowPortalUser**: Gebruikersnaam/wachtwoord per workflow (wanneer authenticatie is ingeschakeld)
- **De laatste gebruiker verwijderen**: Als het portaal is ingeschakeld, maakt het verwijderen van de laatste portaalgebruiker het portaal weer openbaar; het instellingenvenster vraagt eerst om bevestiging
- **PortalSession**: Sessietokens met een TTL van 168 uur
- **Rate limiting**: 3 mislukte inlogpogingen → 24 uur ban per workflow+IP
- Verlopen sessies worden opgeruimd door een cron-job

## Configuratie-UI

Tabbladen van **WebPortalSettingsDialog**:

1. **Algemeen**: Portaal inschakelen, slug instellen, portaal-URL kopiëren
2. **Gebruikers**: Portaalgebruikers toevoegen/verwijderen (gebruikersnaam/wachtwoord)
3. **Opties**: Streaming-modus, bestandsupload, invoervelden bekijken

## Gerelateerd

- [Waarom Heym](../getting-started/why-heym.md) – Portaal als chat-oppervlak voor agents in productie
- [Tabblad Workflows](../tabs/workflows-tab.md) – Workflows maken en portaal inschakelen
- [Human-in-the-Loop](./human-in-the-loop.md) – Openbare reviewpagina's voor wachtende agent-uitvoer
- [Triggers](./triggers.md) – Portaal als toegangspunt
- [Node-typen](./node-types.md) – [Invoer](../nodes/input-node.md) voor portaal-invoer
- [Workflow-structuur](./workflow-structure.md) – Nodes en edges
