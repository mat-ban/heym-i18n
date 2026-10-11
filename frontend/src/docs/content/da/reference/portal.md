# Portal

**Portalen** gør Heym-workflows tilgængelige som offentlige chat-lignende brugergrænseflader. Slutbrugere kan køre workflows via en URL uden at logge ind i Heym.

## Funktionalitet

- **Offentlig URL**: `/chat/{slug}` (f.eks. `/chat/mit-workflow`)
- **Chat-interface**: Brugere interagerer via en chat-brugergrænseflade (beskeder, input, svar)
- **Valgfri godkendelse**: Hvis portal-brugere er konfigureret, kræves login; ellers er portalen offentlig
- **Streaming**: Realtidsopdateringer af node-status under kørsel (når aktiveret)
- **Stop kørsler**: Det er muligt at stoppe en igangværende portal-kørsel fra chat-foden; den aktive workflow-kørsel annulleres også på serversiden
- **Filupload**: Valgfri filupload (tekst, billeder osv.) pr. inputfelt
- **Menneskelig gennemsyn**: Portal-kørsler kan vise [HITL-gennemsynslinks](./human-in-the-loop.md) når en agent venter på godkendelse
- **Billedvisning**: Workflow-outputs der indeholder billeder (f.eks. fra LLM-billedgenerering eller Playwright-skærmbilleder) vises som miniaturebilleder i chatten. Klik på et billede for at åbne en fuldskærmsviser; tryk på **Esc** eller brug enhedens tilbageknap for at lukke

## Workflow-konfiguration

| Indstilling | Beskrivelse |
|---------|-------------|
| `portal_enabled` | Aktiver portalen for dette workflow |
| `portal_slug` | URL-slug (f.eks. `mit-workflow` → `/chat/mit-workflow`) |
| `portal_stream_enabled` | Brug streaming-kørsel |
| `portal_file_upload_enabled` | Tillad filupload |
| `portal_file_config` | Filkonfiguration pr. felt (typer, begrænsninger) |

Konfigureres i editoren: Knappen **Portal** i workflow-headeren åbner portal-indstillingsdialogen.

## Flow

1. **Info**: `GET /api/portal/{slug}/info` – Returnerer workflow-metadata og inputfelter (uden godkendelse)
2. **Login** (hvis nødvendigt): `POST /api/portal/{slug}/login` – Returnerer sessionstoken
3. **Kør**: `POST /api/portal/{slug}/execute` – Portal-chat-brugergrænsefladen kalder dette (eller dens streaming-variant internt når aktiveret); slutbrugere interagerer via chat-interfacet, ikke ved direkte API-kald.
4. **Stop**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Anmodes når brugeren trykker på **Stop** under en aktiv portal-kørsel

## HITL i portal-kørsler

Hvis et portal-workflow når en [Agent Node](../nodes/agent-node.md) med [Human-in-the-Loop](./human-in-the-loop.md) aktiveret, viser portal-svaret et gennemsynslink i stedet for at vises tomt.

- Workflow-kørselsstatus bliver `pending`
- Portal-chatten viser gennemsyns-URL'en
- Noder forbundet til agentens `review`-output kan straks underrette Slack, email eller andre kanaler
- En gennemsynsfullmægtig fuldfører beslutningen på `/review/{token}` uden login
- Efter gennemsyn genoptages workflowet fra det gemte snapshot

Dette gør det muligt at kombinere offentlige chatflows med private menneskelige godkendelsestrin.

## Inputfelter

Inputfelter kommer fra [Input](../nodes/input-node.md)-noder. API'en udtrækker startnoder af typen `textInput` og deres `inputFields`. Kørsel bruger samme motor som normale kørsler; inputs sendes som `body.inputs` og `conversation_history` for fler-trins flows.

## Godkendelse og sessioner

- **WorkflowPortalUser**: Brugernavn/adgangskode pr. workflow (når godkendelse er aktiveret)
- **PortalSession**: Sessionstokens med 168-timers levetid
- **Rate limiting**: 3 mislykkede login-forsøg → 24-timers blokering pr. workflow+IP
- Udløbne sessioner ryddes af et cron-job

## Konfigurations-brugergrænseflade

**WebPortalSettingsDialog**-faner:

1. **Generelt**: Aktiver portal, indstil slug, kopier portal-URL
2. **Brugere**: Tilføj/fjern portal-brugere (brugernavn/adgangskode)
3. **Valgmuligheder**: Streaming-tilstand, filupload, vis inputfelter

## Relateret

- [Why Heym](../getting-started/why-heym.md) – Portal som chat-overflade til agenter i produktion
- [Workflows Tab](../tabs/workflows-tab.md) – Opret workflows og aktiver portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Offentlige gennemsynssider til ventende agent-outputs
- [Triggers](./triggers.md) – Portal som indgangspunkt
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md) til portal-inputs
- [Workflow Structure](./workflow-structure.md) – Noder og kanter
