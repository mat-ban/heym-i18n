# Workflow-organisation

Heym giver mulighed for at organisere workflows i mapper, oprette undermapper og planlægge workflows til sletning. Se [Workflows-fanen](../tabs/workflows-tab.md) for en oversigt over brugergrænsefladen.

## Mapper og undermapper

Mapper danner en træstruktur. Hver mappe indeholder:

- **Navn** – Visningsnavn
- **Overordnet mappe** – `parent_id` henviser til en anden mappe; `null` betyder rodniveau
- **Workflows** – Workflows kan flyttes til mapper via `folder_id`

### API

| Endpoint | Formål |
|----------|---------|
| `GET /folders` | Kun rodmapper |
| `GET /folders/tree` | Fuld træstruktur (børn + workflows) |
| `GET /folders/{id}` | Enkelt mappe med indhold |
| `POST /folders` | Opret mappe (`parent_id` valgfri) |
| `PUT /folders/{id}` | Opdater navn eller `parent_id` |
| `DELETE /folders/{id}` | Slet mappe (kaskade) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Flyt workflow til mappe |
| `DELETE /folders/workflows/{workflow_id}/folder` | Fjern workflow fra mappe |
| `GET /folders/{id}/export` | Download mappe + alle undermapper som ZIP |

### Træstruktur

Træresponsen inkluderer `children` og `workflows` pr. mappe. Delte workflows kan vises i en mappe via `WorkflowShare.folder_id`.

## Delt workflows

Ved at åbne **Del** i workflow-editoren kan man invitere brugere via e-mail eller dele med et [team](./teams.md). Hver invitation og hver teamdeling indeholder en tilladelse:

| Tilladelse | Hvad samarbejdspartneren kan gøre |
|------------|------------------------------|
| **Læse** | Åbne workflowet, inspicere det, se kørselshistorik og køre det. Editoren åbnes i skrivebeskyttet tilstand: Gem er deaktiveret, og canvas kan ikke ændres. |
| **Skrive** | Alt hvad Læse tillader, plus redigere canvas, indstillinger, analysedokument og agenthukommelse. |

Tilladelsen vises ved hver post i delingsdialogen og kan ændres til enhver tid fra dropdown-menuen, uden at fjerne og tilføje delingen igen. Når en bruger har adgang til et workflow gennem flere stier (en direkte deling og et eller flere teams), gælder den **højeste** tilladelse. Delinger der eksisterede før tilladelser blev introduceret, har **Skrive**, og API-klienter der udelader `permission` får også **Skrive**.

Handlinger der kun er for ejeren, afhænger aldrig af tilladelsen: sletning af et workflow, tilbageførsel eller rydning af versioner, rydning af historik, håndtering af delinger og de [ejer-specifikke indstillinger](#ejer-specifikke-indstillinger) nedenfor forbliver hos ejeren, selv for **Skrive**-samarbejdspartnere. En **Læse**-samarbejdspartner der sender en redigering via API'en (`PUT /api/workflows/{id}`, analysenote, agenthukommelse, cache-rydning) eller via AI-assistenten, modtager `403` med `You have read-only access to this workflow`.

Ved deling af et workflow gives adgang til canvas, kørselshistorik og analysedokument. Det giver **ikke** automatisk adgang til:

- **Legitimationsoplysninger** refereret af noder i workflowet
- **Under-workflows** kaldet af [Execute](../nodes/execute-node.md)-noder eller agenter

Modtagerne skal have disse legitimationsoplysninger og under-workflows delt separat (med samme brugere eller teams). Legitimationsoplysninger deles fra [Legitimationsfanen](../tabs/credentials-tab.md); se [Deling af legitimationsoplysninger](./credentials-sharing.md). Hvert under-workflow deles fra dets egen editor-delingsdialog.

### Ejer-specifikke indstillinger

Hele **Kør med cURL**-konfigurationen forbliver hos ejeren efter deling. Samarbejdspartnere kan stadig åbne dialogen og kopiere det genererede kommando, men kontrollerne er skrivebeskyttede.

Ændring af nogen af disse som ikke-ejer afvises med `403`:

- **Godkendelse** (`auth_type`) og **Header-nøgle** (`auth_header_key`)
- **Request Body**-tilstand (`webhook_body_mode`) og **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) og **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header-værdi** (`auth_header_value`) opfører sig anderledes: den er helt skjult for samarbejdspartnere, og en samarbejdspartners skriveforsøg ignoreres i stedet for at blive afvist. Editoren viser feltet maskeret, så en `403` der ville bryde en almindelig gemning snarere end at signalere et angreb.

Godkendelse er grunden til at blokken er ejer-specifik: `Anonymous` lader uautentificerede kaldere køre workflowet, og en kørsel uden indlogget bruger løser legitimationsoplysninger og globale variable som **ejeren**, ikke kalderen. Resten af blokken er den publicerede requestkontrakt og ejerens omkostningskontroller, så den følger med.

**Ved fejl, kør workflow** (`error_workflow_id`) i workflow-niveauets **Egenskaber**-panel er ejer-specifik af samme grund: [fejl-workflowet](./features.md#error-workflow) kører med den fejlende kørsels legitimationsoplysninger og globale variable, som er ejerens for triggerede og anonyme kørsler. Samarbejdspartnere ser indstillingen skrivebeskyttet, og tilføjelse, udskiftning eller rydning som ikke-ejer afvises med `403`.

Redigering af canvas, navn og beskrivelse er upåvirket.

### Eksekveringstokens

En samarbejdspartner kan generere et eksekveringstoken for et workflow der er delt med dem. Kørslen tilskrives **den der genererede token**, så den bruger den brugers legitimationsoplysninger og globale variable, ikke ejerens. Kun et virkeligt anonymt kald – `auth_type: anonymous` uden kaldende bruger – kører i ejerens kontekst.

## Planlagt til sletning

Workflows kan planlægges til sletning i stedet for at blive fjernet med det samme.

- **Felt**: `scheduled_for_deletion` (nullable datetime)
- **Adfærd**: Når sat, flyttes workflowet til `folder_id = null` og vises i sektionen "Planlagt til sletning".
### API

| Endpoint | Formål |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Sæt `scheduled_for_deletion`, fjern `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Nulstil `scheduled_for_deletion` (gendan) |

### Brugergrænseflade

- **Træk til papirkurv** – Slip workflows i området "Planlagt til sletning" for at planlægge sletning
- **Gendan** – Fjern fra sletningsplan
- **Slet med det samme** – Papirkurvsikon til permanent fjernelse

### Oprydningslogik

En cron-job kører dagligt kl. **23:59** (konfigureret tidszone). Et workflow slettes kun, når:

- **Alle startnoder** (noder uden indgående kanter, eksklusiv sticky/errorHandler) har `active === false`

Hvis nogen startnode stadig er aktiv, forbliver workflowet indtil næste kørsel.

## Dashboard-brugergrænseflade

- **Mappelinjer** – Ny mappe, rekursiv mappetræ med udvid/sammenfold. Hver mappe indeholder en
  valgfri beskrivelse under navnet og en badge, der tæller de workflows den indeholder, inklusive undermapper.
- **Mappehandlinger** – Ny undermappe, Omdøb, Skift ikon, Download som ZIP og Slet vises inline
  på hver mappelinje; højrekliksmenuen tilbyder samme funktioner, og telefoner viser en enkelt menuknap.
- **Hovedområde** – Rodworkflows (ingen mappe, ikke planlagt) og Planlagt til sletning
- **Mappeslipforhåndsvisning** – Ved at trække et workflow fremhæves den præcise mappe eller undermappe og
  dens fulde sti vises i en kortstørrelsesforhåndsvisning. En sammenfoldet mappe udvides efter kort hover.
- **Stabil trækfeedback** – Kilden bruger et træk-spøgelse, og det aktive slipmål forbliver
  valgt under rulning eller ved passage af kontroller i samme mappe.
- **Destinationskontrol** – Den aktuelle mappe vises som **Allerede i mappe** og accepterer ikke
  en redundant flytning.
- **Andre slipzoner** – Rod og "Planlagt til sletning" fremhæves, når de kan acceptere det
  trækkede workflow.
- **ZIP-slip** – Slip en ZIP-fil på workflow-området for at importere en mappestruktur på rodniveau

## Relateret

- [Workflows-fane](../tabs/workflows-tab.md) – Opret og administrer workflows
- [Legitimationsoplysningsdeling](./credentials-sharing.md) – Del legitimationsoplysninger med workflow-samarbejdspartnere
- [Teams](./teams.md) – Del workflows og legitimationsoplysninger med teams
- [Kernebegreber](../getting-started/core-concepts.md) – Workflows, noder og kørsel
- [Workflow-struktur](./workflow-structure.md) – JSON-format for workflows
- [Triggers](./triggers.md) – Startnoder og indgangspunkter
