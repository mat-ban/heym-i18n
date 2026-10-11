# Workflow-analys

**Workflow-analys** är en panel på vänster sida som innehåller ett delat, redigerbart Markdown-dokument per workflow. Den används för att beskriva vad en workflow gör och för att samla förbättringsidéer — och AI kan generera ett första utkast.

Dokumentet är delat: alla som har åtkomst till workflowen kan läsa och redigera det. Det lagras tillsammans med workflowen och tas bort automatiskt när workflowen tas bort.

## Öppna panelen

1. Öppna en workflow i redigeraren.
2. Klicka på **Analyze** (gnistikon) i redigerarens verktygsfält.
3. Panelen öppnas till vänster. Nodpaletten (vänsterpanelen) fälls ihop medan den är öppen; när nodpaletten öppnas igen stängs analyspanelen.

Panelen är endast tillgänglig för sparade workflows. På en helt ny, osparad workflow måste den sparas först.

## Dokumentet

Panelen visar ett enda Markdown-dokument med två vyer, som växlas med knapparna **Edit** (penna) och **Preview** (öga):

| Vy | Syfte |
|------|---------|
| **Edit** | Enkel Markdown-redigerare (textarea). |
| **Preview** | Renderad Markdown. |

Rubriken visar **vem som senast redigerade** dokumentet och när.

### Spara

Klicka på **Save** för att spara ändringarna. Save är endast aktiverat när det finns osparade ändringar.

Eftersom dokumentet är delat används optimistisk samtidighetskontroll vid sparande:

- Om någon annan har sparat en nyare version sedan panelen öppnades avvisas sparandet och en varning visas med namnet på den andra redigeraren.
- Därefter går det att välja **Reload (discard mine)** för att ta serverversionen, eller **Overwrite** för att tvinga fram en sparning av den egna versionen över den andras.

## AI-analys

Välj en LLM-**Credential** och **Model** högst upp i panelen (modellistan laddas från den valda credentialen — se [Credentials](../tabs/credentials-tab.md)). Kör sedan analysen:

- **Analyze my workflow** — visas när dokumentet är tomt. En AI-genererad Markdown-rapport streamas direkt in i redigeraren som ett osparat utkast. Granska och redigera den, och klicka sedan på **Save**.
- **Reanalyze** — visas när dokumentet redan har innehåll. En ny rapport streamas in i en separat **förhandsvisning**, utan att det aktuella dokumentet påverkas. Välj **Accept** för att ersätta redigerarens innehåll med den nya analysen, eller **Discard** för att behålla det befintliga.

Båda åtgärderna **kör först workflowen** (när den är giltig och körbar) och inkluderar körningsresultaten i analysprompten, så att rapporten återspeglar hur workflowen faktiskt beter sig. Om workflowen inte kan köras fortsätter analysen utifrån dess statiska struktur i stället.

Den genererade rapporten omfattar tre avsnitt, i ordning: **Improvement areas** (konkreta förslag, inklusive en **säkerhetsaspekt** när workflowen hanterar autentiseringsuppgifter, användarinmatning, externa anrop eller dataexponering), workflowens **Purpose** och **What it does** (en steg-för-steg-genomgång av noderna).

Avsnittet **Improvement areas** utför alltid fyra explicita kontroller:

1. **Error coverage** — om canvasen saknar en [Error Handler](../nodes/error-handler-node.md)-nod och ingen felhanterings-workflow är konfigurerad påpekar rapporten detta och rekommenderar att felhantering läggs till.
2. **Time saved** — om ingen uppskattad tidsbesparing per körning är angiven rekommenderar rapporten att en sådan konfigureras så att måttet **Time Saved** i [Analytics](../tabs/analytics-tab.md) kan fyllas i.
3. **Network nodes** — för noder som gör nätverksanrop (som [HTTP](../nodes/http-node.md) och integrationsnoder) rekommenderar rapporten nodspecifik felhantering (retry och/eller continue-on-error) på dessa noder.
4. **Alerts** — när inga [alerts](../tabs/alerts-tab.md) är konfigurerade för workflowen rekommenderar rapporten att aviseringar ställs in innan den går till produktion.

### Kör Analyzer från Properties

När en workflow har noder på canvasen men ännu inget analysdokument visas en knapp **Run Analyzer** i panelen [Properties](./canvas-features.md) på workflownivå (visas när ingen nod är markerad). Den öppnar denna Workflow-analyspanel så att en credential och modell kan väljas och rapporten genereras.

Varje analyskörning registreras i [Traces](../tabs/traces-tab.md) under källan **Workflow Analysis**.

Om ingen LLM-credential är konfigurerad är Analyze-knappen inaktiverad — lägg till en i [Credentials Tab](../tabs/credentials-tab.md).

## Relaterat

- [AI Assistant](./ai-assistant.md) — generera eller ändra workflow-noder utifrån naturligt språk.
- [Sticky Note](../nodes/sticky-note-node.md) — för korta anteckningar fästa direkt på canvasen.
