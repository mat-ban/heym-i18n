# Workflow organizēšana

Heym ļauj organizēt workflow mapēs, veidot apakšmapes un ieplānot workflow dzēšanu. UI pārskatu skatiet sadaļā [Workflows Tab](../tabs/workflows-tab.md).

## Mapes un apakšmapes

Mapes veido koku. Katrai mapei ir:

- **Name** – Parādāmais nosaukums
- **Parent** – `parent_id` saista ar citu mapi; `null` nozīmē sakni
- **Workflows** – Workflow var pārvietot mapēs, izmantojot `folder_id`

### API

| Endpoint | Mērķis |
|----------|---------|
| `GET /folders` | Tikai saknes mapes |
| `GET /folders/tree` | Pilns koks (apakšmapes + workflow) |
| `GET /folders/{id}` | Viena mape ar saturu |
| `POST /folders` | Izveidot mapi (`parent_id` nav obligāts) |
| `PUT /folders/{id}` | Atjaunināt nosaukumu vai `parent_id` |
| `DELETE /folders/{id}` | Dzēst mapi (kaskādes veidā) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Pārvietot workflow mapē |
| `DELETE /folders/workflows/{workflow_id}/folder` | Noņemt workflow no mapes |
| `GET /folders/{id}/export` | Lejupielādēt mapi + visas apakšmapes kā ZIP |

### Koka struktūra

Koka atbildē katrai mapei ir iekļauti `children` un `workflows`. Koplietotie workflow var parādīties mapē, izmantojot `WorkflowShare.folder_id`.

## Workflow koplietošana

Atveriet **Share** workflow redaktorā, lai uzaicinātu lietotājus pēc e-pasta vai koplietotu ar [komandu](./teams.md). Katram uzaicinājumam un katram komandas koplietojumam ir piešķirta atļauja:

| Atļauja | Ko līdzstrādnieks var darīt |
|------------|------------------------------|
| **Read** | Atvērt workflow, apskatīt to, skatīt izpildes vēsturi un palaist to. Redaktors tiek atvērts tikai lasīšanas režīmā: Saglabāšana ir atspējota, un kanvu nevar mainīt. |
| **Write** | Viss, ko pieļauj Read, kā arī kanvas, iestatījumu, analīzes dokumenta un aģenta atmiņas rediģēšana. |

Atļauja tiek parādīta blakus katram ierakstam dialoglodziņā Share, un to jebkurā laikā var mainīt no šī nolaižamā saraksta, nenoņemot un atkārtoti nepievienojot koplietojumu. Ja lietotājs sasniedz workflow pa vairākiem ceļiem (tiešs koplietojums un viena vai vairākas komandas), uzvar **augstākā** atļauja. Koplietojumi, kas pastāvēja pirms atļauju ieviešanas, ir **Write**, un API klienti, kas izlaiž `permission`, arī saņem **Write**.

Tikai īpašniekam pieejamās darbības nekad nav atkarīgas no atļaujas: workflow dzēšana, versiju atgriešana vai notīrīšana, vēstures notīrīšana, koplietojumu pārvaldība un tālāk norādītie [tikai īpašniekam pieejamie iestatījumi](#owner-only-settings) paliek īpašniekam pat **Write** līdzstrādniekiem. **Read** līdzstrādnieks, kurš nosūta rediģējumu caur API (`PUT /api/workflows/{id}`, analīzes piezīmi, aģenta atmiņu, kešatmiņas notīrīšanu) vai caur AI Assistant, saņem `403` ar `You have read-only access to this workflow`.

Workflow koplietošana piešķir piekļuvi kanvai, izpildes vēsturei un analīzes dokumentam. Tā **automātiski nekoplieto**:

- **Akreditācijas datus**, uz kuriem atsaucas workflow mezgli
- **Apakš-workflow**, ko izsauc [Execute](../nodes/execute-node.md) mezgli vai aģenti

Saņēmējiem šie akreditācijas dati un pakārtotie workflow ir jākoplieto atsevišķi (tie paši lietotāji vai komandas). Koplietojiet akreditācijas datus no [Credentials tab](../tabs/credentials-tab.md); skatiet [Credentials Sharing](./credentials-sharing.md). Koplietojiet katru apakš-workflow no tā paša redaktora koplietošanas dialoglodziņa.

### Tikai īpašniekam pieejamie iestatījumi

Visa **Run with cURL** konfigurācija pēc koplietošanas paliek īpašniekam. Līdzstrādnieki joprojām var atvērt dialoglodziņu un nokopēt ģenerēto komandu, bet vadīklas ir tikai lasāmas.

Jebkura no šiem mainīšana, ja lietotājs nav īpašnieks, tiek noraidīta ar `403`:

- **Authentication** (`auth_type`) un **Header Key** (`auth_header_key`)
- **Request Body** režīms (`webhook_body_mode`) un **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) un **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) darbojas citādi: tas ir pilnībā paslēpts no līdzstrādniekiem, un līdzstrādnieka rakstīšana tiek ignorēta, nevis noraidīta. Redaktors attēlo lauku maskētu, tāpēc `403` šeit salauztu parastu saglabāšanu, nevis signalizētu par uzbrukumu.

Autentifikācija ir iemesls, kāpēc šis bloks ir pieejams tikai īpašniekam: `Anonymous` ļauj neautentificētiem izsaucējiem palaist workflow, un palaišana bez pierakstīta izsaucēja atrisina akreditācijas datus un globālos mainīgos kā **īpašnieks**, nevis izsaucējs. Pārējais bloks ir publicētais pieprasījuma līgums un īpašnieka izmaksu kontroles, tāpēc tas pārvietojas kopā ar to.

**On error, run workflow** (`error_workflow_id`) workflow līmeņa **Properties** panelī ir pieejams tikai īpašniekam tā paša iemesla dēļ: [error workflow](./features.md#error-workflow) darbojas ar neizdevušās palaišanas akreditācijas datiem un globālajiem mainīgajiem, kas triggered un anonīmām palaišanām pieder īpašniekam. Līdzstrādnieki šo iestatījumu redz tikai lasāmu, un tā pievienošana, aizstāšana vai notīrīšana, ja lietotājs nav īpašnieks, tiek noraidīta ar `403`.

Kanvas, nosaukuma un apraksta rediģēšana netiek ietekmēta.

### Izpildes token

Līdzstrādnieks var izgūt izpildes token workflow, kas ar viņu koplietots. Palaišana tiek attiecināta uz **to, kurš izgūst token**, tāpēc tā izmanto šī lietotāja akreditācijas datus un globālos mainīgos, nevis īpašnieka. Tikai patiesi anonīms izsaukums — `auth_type: anonymous` bez izsaucēja — darbojas īpašnieka kontekstā.

## Ieplānots dzēšanai

Workflow var ieplānot dzēšanai, nevis noņemt nekavējoties.

- **Lauks**: `scheduled_for_deletion` (nullable datetime)
- **Darbība**: Kad iestatīts, workflow pārvietojas uz `folder_id = null` un parādās sadaļā "Scheduled for Deletion".
### API

| Endpoint | Mērķis |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Iestata `scheduled_for_deletion`, notīra `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Notīra `scheduled_for_deletion` (atjauno) |

### UI

- **Vilkšana uz miskasti** – Nometiet workflows zonā "Scheduled for Deletion", lai tos ieplānotu dzēšanai
- **Atjaunot** – Noņem no grafika
- **Dzēst nekavējoties** – Miskastes ikona pilnīgai noņemšanai

### Tīrīšanas loģika

Cron job tiek palaists katru dienu plkst. **23:59** (konfigurētajā laika joslā). Workflow tiek dzēsts tikai tad, ja:

- **Visiem sākuma mezgliem** (mezgliem bez ienākošām malām, izņemot sticky/errorHandler) ir `active === false`

Ja kāds sākuma mezgls joprojām ir aktīvs, workflow paliek līdz nākamajai palaišanai.

## Dashboard UI

- **Mapju rindas** – New Folder, rekursīvs mapju koks ar izvēršanu/sakļaušanu. Katrai mapei zem
  nosaukuma ir neobligāts apraksts un badge, kas uzskaita tajā esošos workflows, ieskaitot
  apakšmapes.
- **Mapju darbības** – New Subfolder, Rename, Change icon, Download as ZIP un Delete atrodas
  tieši katrā mapju rindā; ar peles labo pogu atveramajā kontekstizvēlnē ir pieejams tas pats
  kopums, un tālruņos tiek rādīta viena izvēlnes poga.
- **Galvenā zona** – Saknes workflows (bez mapes, nav ieplānoti) un Scheduled for Deletion
- **Mapes nomešanas priekšskatījums** – Velkot workflow, tiek izcelta precīzā mape vai apakšmape
  un tiek parādīts tās pilnais ceļš kartītes izmēra priekšskatījumā. Sakļauta mape tiek izvērsta
  pēc īsas uzkavēšanās.
- **Stabila vilkšanas atgriezeniskā saite** – Avota kartīte izmanto vilkšanas ghost, un aktīvais
  nomešanas mērķis paliek atlasīts, ritinot vai šķērsojot vadīklas tajā pašā mapē.
- **Galamērķa pārbaude** – Pašreizējā mape tiek parādīta kā **Already in Folder** un nepieņem
  lieku pārvietošanu.
- **Citas nomešanas zonas** – Sakne un "Scheduled for Deletion" tiek izceltas, kad tās var
  pieņemt velkamo workflow.
- **ZIP nomešana** – Nometiet ZIP failu uz workflow zonas, lai importētu mapju struktūru saknes līmenī

## Saistītie

- [Workflows Tab](../tabs/workflows-tab.md) – Izveidojiet un pārvaldiet workflows
- [Credentials Sharing](./credentials-sharing.md) – Kopīgojiet akreditācijas datus ar workflow līdzstrādniekiem
- [Teams](./teams.md) – Kopīgojiet workflows un akreditācijas datus ar komandām
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, mezgli un izpilde
- [Workflow Structure](./workflow-structure.md) – JSON formāts workflows
- [Triggers](./triggers.md) – Sākuma mezgli un ieejas punkti
