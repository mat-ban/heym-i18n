# Portal

**Portalen** exponerar Heym-workflows som publika chattgränssnitt. Slutanvändare kan köra workflows via en URL utan att logga in i Heym.

## Vad den gör

- **Publik URL**: `/chat/{slug}` (t.ex. `/chat/my-workflow`)
- **Chatgränssnitt**: Användare interagerar via ett chattgränssnitt (meddelanden, inmatningar, svar)
- **Valfri autentisering**: Om portal-användare är konfigurerade krävs inloggning; annars är portalen publik
- **Streaming**: Realtidsförlopp för noder under körning (när aktiverat)
- **Stoppa pågående körningar**: Användare kan stoppa en pågående portal-körning från chattens sidfot; den aktiva workflow-körningen avbryts även på serversidan
- **Filuppladdning**: Valfri filuppladdning (text, bilder etc.) per inmatningsfält
- **Överlämning till mänsklig granskning**: Portal-körningar kan visa [HITL-granskningslänkar](./human-in-the-loop.md) när en agent pausar för godkännande
- **Bildvisning**: Workflow-utdata som innehåller bilder (t.ex. från LLM-bildgenerering eller Playwright-skärmbilder) visas som miniatyrbilder i chatten. Klicka på en bild för att öppna en fullskärmsvisare; tryck på **Esc** eller använd enhetens bakåtknapp för att stänga

## Workflow-konfiguration

| Inställning | Beskrivning |
|---------|-------------|
| `portal_enabled` | Aktivera portalen för denna workflow |
| `portal_slug` | URL-slug (t.ex. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Använd streaming-körning |
| `portal_file_upload_enabled` | Tillåt filuppladdningar |
| `portal_file_config` | Filkonfiguration per fält (typer, gränser) |

Konfigureras i redigeraren: **Portal**-knappen i workflow-huvudet öppnar dialogrutan för portal-inställningar.

## Flöde

1. **Info**: `GET /api/portal/{slug}/info` – Returnerar workflow-metadata och inmatningsfält (ingen autentisering)
2. **Inloggning** (om det krävs): `POST /api/portal/{slug}/login` – Returnerar sessionstoken
3. **Kör**: `POST /api/portal/{slug}/execute` – Portalens chattgränssnitt anropar denna (eller dess streaming-variant internt när aktiverat); slutanvändare interagerar via chattgränssnittet, inte genom att anropa API:et direkt.
4. **Stoppa**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Anropas när användaren trycker på **Stoppa** under en aktiv portal-körning

## HITL i portal-körningar

Om en portal-workflow når en [Agent-nod](../nodes/agent-node.md) med [Human-in-the-Loop](./human-in-the-loop.md) aktiverat, visar portal-svaret en granskningslänk istället för att verka tomt.

- Workflow-körningens status blir `pending`
- Portalchatten visar gransknings-URL:en
- Noder som är kopplade till agentens `review`-utdata kan omedelbart meddela Slack, e-post eller andra kanaler
- En granskare fattar beslut på `/review/{token}` utan att logga in
- Efter granskning återupptas workflowen från den sparade ögonblicksbilden

Detta gör det möjligt att kombinera publika chattflöden med privata steg för mänskligt godkännande.

## Inmatningsfält

Inmatningsfält kommer från [Input](../nodes/input-node.md)-noder. API:et extraherar startnoder av typen `textInput` och deras `inputFields`. Körning använder samma motor som vanliga körningar; indata skickas som `body.inputs` och `conversation_history` för fleromgångsflöden.

## Autentisering och sessioner

- **WorkflowPortalUser**: Användarnamn/lösenord per workflow (när autentisering är aktiverad)
- **PortalSession**: Sessionstoken med 168 timmars TTL
- **Hastighetsbegränsning**: 3 misslyckade inloggningsförsök → 24 timmars ban per workflow+IP
- Utgångna sessioner rensas av ett cron-jobb

## Konfigurationsgränssnitt

**WebPortalSettingsDialog**-flikar:

1. **Allmänt**: Aktivera portalen, ange slug, kopiera portal-URL
2. **Användare**: Lägg till/ta bort portal-användare (användarnamn/lösenord)
3. **Alternativ**: Stream-läge, filuppladdning, visa inmatningsfält

## Relaterat

- [Varför Heym](../getting-started/why-heym.md) – Portalen som chattgränssnitt för agenter i produktion
- [Fliken Workflows](../tabs/workflows-tab.md) – Skapa workflows och aktivera portalen
- [Human-in-the-Loop](./human-in-the-loop.md) – Publika granskningssidor för väntande agent-utdata
- [Triggers](./triggers.md) – Portalen som ingångspunkt
- [Nodtyper](./node-types.md) – [Input](../nodes/input-node.md) för portal-indata
- [Workflow-struktur](./workflow-structure.md) – Noder och kanter
