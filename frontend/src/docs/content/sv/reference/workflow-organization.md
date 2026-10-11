# Workflow-organisering

Heym gör det möjligt att organisera workflows i mappar, skapa undermappar och schemalägga workflows för borttagning. Se [Fliken Workflows](../tabs/workflows-tab.md) för en översikt av användargränssnittet.

## Mappar och undermappar

Mappar bildar ett träd. Varje mapp har:

- **Namn** – Visningsnamn
- **Överordnad** – `parent_id` länkar till en annan mapp; `null` innebär rot
- **Workflows** – Workflows kan flyttas in i mappar via `folder_id`

### API

| Endpoint | Syfte |
|----------|---------|
| `GET /folders` | Endast rotmappar |
| `GET /folders/tree` | Hela trädet (undermappar + workflows) |
| `GET /folders/{id}` | Enskild mapp med innehåll |
| `POST /folders` | Skapa mapp (`parent_id` valfritt) |
| `PUT /folders/{id}` | Uppdatera namn eller `parent_id` |
| `DELETE /folders/{id}` | Ta bort mapp (kaskad) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Flytta workflow till mapp |
| `DELETE /folders/workflows/{workflow_id}/folder` | Ta bort workflow från mapp |
| `GET /folders/{id}/export` | Ladda ner mapp + alla undermappar som ZIP |

### Trädstruktur

Trädets svar innehåller `children` och `workflows` per mapp. Delade workflows kan visas i en mapp via `WorkflowShare.folder_id`.

## Dela workflows

Öppna **Dela** i workflow-editorn för att bjuda in användare via e-post eller dela med ett [team](./teams.md). Varje inbjudan och varje teamdelning har en behörighet:

| Behörighet | Vad medarbetaren kan göra |
|------------|------------------------------|
| **Läs** | Öppna workflowen, granska den, visa körningshistorik och köra den. Editorn öppnas i skrivskyddat läge: Spara är inaktiverat och canvasen kan inte ändras. |
| **Skriv** | Allt som Läs tillåter, plus redigera canvasen, inställningar, analysdokumentet och agentminnet. |

Behörigheten visas bredvid varje post i dialogrutan Dela och kan ändras när som helst från den listrutan, utan att delningen tas bort och läggs till igen. När en användare når en workflow via flera vägar (en direkt delning och ett eller flera team) gäller den **högsta** behörigheten. Delningar som fanns innan behörigheter infördes är **Skriv**, och API-klienter som utelämnar `permission` får också **Skriv**.

Åtgärder som endast är tillgängliga för ägaren beror aldrig på behörigheten: att ta bort en workflow, återställa eller rensa versioner, rensa historik, hantera delningar och de [ägarspecifika inställningarna](#ägarspecifika-inställningar) nedan förblir hos ägaren även för **Skriv**-medarbetare. En **Läs**-medarbetare som skickar en redigering via API:et (`PUT /api/workflows/{id}`, analysanteckningen, agentminnet, cacherrensning) eller via AI-assistenten får `403` med `You have read-only access to this workflow`.

Att dela en workflow ger åtkomst till canvasen, körningshistoriken och analysdokumentet. Det delar **inte** automatiskt:

- **Autentiseringsuppgifter** som refereras av noder i workflowen
- **Underworkflows** som anropas av [Execute](../nodes/execute-node.md)-noder eller agenter

Mottagare behöver dessa autentiseringsuppgifter och underworkflows delade med sig separat (samma användare eller team). Dela autentiseringsuppgifter från [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md); se [Dela autentiseringsuppgifter](./credentials-sharing.md). Dela varje underworkflow från dess egen delningsdialog i editorn.

### Ägarspecifika inställningar

Hela konfigurationen för **Kör med cURL** förblir hos ägaren efter delning. Medarbetare kan fortfarande öppna dialogrutan och kopiera det genererade kommandot, men kontrollerna är skrivskyddade.

Att ändra något av följande som icke-ägare avvisas med `403`:

- **Autentisering** (`auth_type`) och **Header-nyckel** (`auth_header_key`)
- **Begärandetextens läge** (`webhook_body_mode`) och **Begärandemetod** (`http_method`)
- **Svars-cache** (`cache_ttl_seconds`) och **Hastighetsbegränsning** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE-strömning** (`sse_enabled`, `sse_node_config`)

**Header-värde** (`auth_header_value`) beter sig annorlunda: det är helt dolt för medarbetare, och en medarbetares skrivning ignoreras snarare än avvisas. Editorn visar fältet maskerat, så ett `403` där skulle bryta en vanlig sparåtgärd snarare än signalera en attack.

Autentisering är anledningen till att blocket är ägarspecifikt: `Anonymous` låter oautentiserade anropare köra workflowen, och en körning utan inloggad anropare löser autentiseringsuppgifter och globala variabler som **ägaren**, inte anroparen. Resten av blocket är det publicerade begärandekontraktet och ägarens kostnadskontroller, så det flyttar med.

**Vid fel, kör workflow** (`error_workflow_id`) i workflow-nivåns **Egenskaper**-panel är ägarspecifik av samma anledning: [felworkflowen](./features.md#error-workflow) körs med den misslyckade körningens autentiseringsuppgifter och globala variabler, vilka tillhör ägaren för utlösta och anonyma körningar. Medarbetare ser inställningen som skrivskyddad, och att lägga till, ersätta eller rensa den som icke-ägare avvisas med `403`.

Redigering av canvasen, namnet och beskrivningen påverkas inte.

### Körningstoken

En medarbetare kan skapa en körningstoken för en workflow som delats med dem. Körningen tillskrivs **den som skapade token**, så den använder den användarens autentiseringsuppgifter och globala variabler, inte ägarens. Endast ett genuint anonymt anrop — `auth_type: anonymous` utan anropare — körs i ägarens kontext.

## Schemalagd för borttagning

Workflows kan schemaläggas för borttagning istället för att tas bort omedelbart.

- **Fält**: `scheduled_for_deletion` (nullable datetime)
- **Beteende**: När det är inställt flyttas workflowen till `folder_id = null` och visas i avsnittet "Schemalagd för borttagning".
### API

| Endpoint | Syfte |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Anger `scheduled_for_deletion`, rensar `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Rensar `scheduled_for_deletion` (återställer) |

### Användargränssnitt

- **Dra till papperskorgen** – Släpp workflows i området "Schemalagda för borttagning" för att schemalägga dem
- **Återställ** – Ta bort från schemat
- **Ta bort omedelbart** – Papperskorgsikon för permanent borttagning

### Rensningslogik

Ett cron-jobb körs dagligen kl. **23:59** (konfigurerad tidszon). En workflow tas endast bort när:

- **Alla startnoder** (noder utan inkommande kanter, exklusive sticky/errorHandler) har `active === false`

Om någon startnod fortfarande är aktiv ligger workflowen kvar till nästa körning.

## Instrumentpanelens användargränssnitt

- **Mapprader** – Ny mapp, rekursiv mappträdstruktur med expandera/komprimera. Varje mapp har en
  valfri beskrivning under sitt namn och en badge som räknar antalet workflows den innehåller,
  inklusive undermappar.
- **Mappåtgärder** – Ny undermapp, Byt namn, Ändra ikon, Ladda ner som ZIP och Ta bort finns inline
  på varje mapprad; högerklicksmenyn erbjuder samma uppsättning, och telefoner visar en enda
  menyknapp.
- **Huvudområde** – Rotnivå-workflows (ingen mapp, inte schemalagda) och Schemalagda för borttagning
- **Förhandsvisning vid släpp i mapp** – När en workflow dras markeras den exakta mappen eller undermappen och
  dess fullständiga sökväg visas i en förhandsvisning i kortstorlek. En komprimerad mapp expanderas efter en kort hovring.
- **Stabil återkoppling vid dragning** – Källkortet använder en drag-ghost, och det aktiva släppmålet förblir
  markerat vid scrollning eller när kontroller passeras inom samma mapp.
- **Kontroll av mål** – Den aktuella mappen visas som **Redan i mapp** och accepterar
  inte en överflödig flytt.
- **Andra släppzoner** – Rotnivå och "Schemalagda för borttagning" markeras när de kan ta emot den
  dragna workflowen.
- **ZIP-släpp** – Släpp en ZIP-fil på workflowområdet för att importera en mappstruktur på rotnivå

## Relaterat

- [Fliken Workflows](../tabs/workflows-tab.md) – Skapa och hantera workflows
- [Delning av autentiseringsuppgifter](./credentials-sharing.md) – Dela autentiseringsuppgifter med medarbetare i workflows
- [Team](./teams.md) – Dela workflows och autentiseringsuppgifter med team
- [Grundläggande begrepp](../getting-started/core-concepts.md) – Workflows, noder och körning
- [Workflow-struktur](./workflow-structure.md) – JSON-format för workflows
- [Triggers](./triggers.md) – Startnoder och ingångspunkter
