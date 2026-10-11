# MCP cilne

**MCP** cilne konfigurē Model Context Protocol (MCP) integrāciju. MCP ļauj AI klientiem (Claude, Cursor un jebkuram MCP saderīgam rīkam) izsaukt Jūsu Heym workflows kā rīkus.

Heym atbalsta divus režīmus: **noklusējuma serveri**, kas izsaka visus MCP iespējotos workflows zem viena endpoint, un **nosauktus serverus**, kas katrai loģiskajai grupai no workflows piešķir savu veltītu URL un API atslēgu.

Abi režīmi var izsist divu veidu rīkus: individuālus **workflows** un **Heym chat tool** — visu [Chat cilnes](./chat-tab.md) dzinēju aiz viena `heym_chat` rīka.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Skatīt MCP demonstrāciju</a></p>

## Noklusējuma MCP serveris

Noklusējuma serveris vienmēr ir pieejams adresē `{origin}/api/mcp/sse`. Visi workflows ar MCP ieslēgtu parādās kā rīki šeit.

### MCP API atslēga

- Atslēgas tiek glabātas kā SHA-256 kopsavilkumi, tāpēc Heym nevar parādīt esošo atslēgu. Ciltne ziņo, vai viena ir iestatīta, nevis kāda tā ir.
- **Izveidot** / **Atjaunot** – Jaunā atslēga tiek parādīta vienu reizi, tūlīt pēc tās izveidošanas. Nokopējiet to tad; cilnes atkārtota ielāde to uz visiem laikiem paslēpj.
- Izmantojiet šo atslēgu, kad savienojat Claude Desktop, Cursor vai citus MCP klientus ar Heym.
- Pazaudējāt atslēgu? Atjaunojiet to. Iepriekšējā atslēga pārstāj darboties nekavējoties.

### Savienojuma metodes

- **API atslēga** – Izmantojiet MCP API atslēgu programmatiskām savienojumiem. Ciltne var nokopēt gatavu JSON konfigurāciju un iekļauj **Pievienot Cursor** pogu vienas klikšķa Cursor iestatīšanai.
- **Claude** – Ciltne parāda MCP servera URL un iestatīšanas soļus Claude. Atstājiet OAuth klienta ID un slepeno lauku tukšus; Claude reģistrējas automātiski un autentificējas, izmantojot Heym OAuth.

### Workflow MCP slēdzis

Katru workflow var izsist kā MCP rīku:

- **Ieslēgt** – Workflow rīki kļūst pieejami visiem klientiem, kas savienoti ar noklusējuma serveri.
- **Izslēgt** – Workflow netiek izsists.

Workflow kartes rāda aprakstu un ievades lauku nosaukumu priekšskatījumu, lai Jūs varētu redzēt, ko katrs rīks sagaida pirms tā aktivizēšanas.

## Heym Chat rīks

**Heym Capabilities** sadaļa pārvērš Chat cilnes dzinēju par vienu MCP rīku ar nosaukumu `heym_chat`. Ieslēdziet to noklusējuma serverī, jebkurā nosauktajā serverī vai abos — katra virsma saglabā savu slēdzi un modeļa izvēli.

Kad tas ir ieslēgts, `heym_chat` parādās `tools/list` kopā ar Jūsu workflow rīkiem. MCP klients nosūta vienu dabiskās valodas ziņu, un Heym dzinējs to pārņem, ar tām pašām spējām, kādas ir Chat cilnei:

- Izveidot, rediģēt, pārbaudīt un izpildīt workflows, izmantojot Workflow AI Builder.
- Ziņot par analītiku, nesenajām izpildēm un gaidāmajām cron grafikām.
- Ziņot par viena workflow izpildes vēsturi: cik reizes tas ir izpildīts, statusa skaitļi, kad tas tika izpildīts, un pēc pieprasījuma ievades, izejas un katra mezgla kļūdas vienas izpildes laikā.
- Ziņot par to, kas šobrīd tiek izpildīts: cik izpildes ir aktīvas, to workflow nosaukumi, cik ilgi katra ir darbojusi, uz kura mezgla katra pašlaik atrodas, un saite uz tiešo izpildi.
- Sarakstīt dēļus, izveidot kartes un lasīt kartes detaļas [Board cilnē](./board-tab.md).
- Sarakstīt savas datu tabulas ar to kolonnām, izveidot jaunas un savienot tās ar workflows, ko tas veido.
- Lasīt komandas un globālos mainīgos, un meklēt dokumentāciju.
- Apstiprināt, rediģēt vai atteikt gaidošās cilvēku atsauksmes.

Spējas, kas vēlāk pievienotas Chat cilnei, automātiski kļūst pieejamas caur `heym_chat` — nav nepieciešama atsevišķa slēdzis katrai spējai, lai saglabātu sinhronizāciju.

Akreditācijas dati paliek UI: `heym_chat` nekad neuzskaita, neizvēlas vai neizveido tos. Kad tas veido vai rediģē workflow, jauni mezgli, kuriem nepieciešama akreditācija, paliek tukši, un atbildes nosauc tos, lai Jūs varētu iestatīt tos redaktorā.

Datu tabulas ir atšķirīgas. Tabula nesatur noslēpumus, tāpēc `heym_chat` var uzskaitīt Jūsu tabulas, jautāt, kuru no tām workflow vajadzētu izmantot, un izveidot jaunu ar tās kolonnām. Tā nekad nelasa vai neieraksta rindas.

### Akreditācija un modelis

`heym_chat` darbojas uz Jūsu Heym konta, tāpēc tai nepieciešama sava LLM akreditācija:

| Lauks | Uzvedība |
|-------|----------|
| **Akreditācija** | Izvēlieties jebkuru OpenAI, Google vai Custom akreditāciju, kurai Jūs varat piekļūt. Iepriekš aizpildīts no preferētās akreditācijas [Iestatījumos](../reference/user-settings.md), kad Jūs neesat izvēlējušies nevienu. |
| **Modelis** | Ielādēts no izvēlētās akreditācijas. Iepriekš aizpildīts no Jūsu preferētā modeļa, kad akreditācija sakrīt. |

Ja kāds no tiem trūkst, rīks joprojām parādās `tools/list`, bet katrs izsaukums atgriež kļūdu, kas informē Jūs pabeigt iestatīšanu šajā cilnē.

### Argumenti un vēsture

| Arguments | Nepieciešams | Apraksts |
|-----------|--------------|----------|
| `message` | Jā | Instrukcija vai jautājums, dabiskā valodā. |
| `conversation_id` | Nē | `conversation_id` no iepriekšējā `heym_chat` rezultāta, lai turpinātu šo pavedienu. |

Katrs izsaukums tiek pierakstīts Jūsu [Chat cilnes](./chat-tab.md) vēsturē kā parasta saruna, atzīmēta ar kontaktdakšas ikonu sarunu sarakstā. Ziņas, rīku kartes un precizēšanas pauzes izskatās tieši tāpat kā saruna, ko Jūs uzsākat paši, un Jūs varat atvērt pavedienu un turpināt runāt pārlūkā. Katrs rezultāts atgriež savu `conversation_id`, lai MCP klients varētu turpināt to pašu pavedienu, nevis atvērt jaunu katrā izsaukumā.

Kad asistents prasa precizējumu, tas apstājas un to norāda; atbildiet ar atbildēm, izmantojot to pašu `conversation_id`.
## Nosaukti MCP Serveri

Nosaukti serveri ļauj Jums segmentēt workflows izolētos MCP endpointos. Katram serverim ir sava URL un API atslēga, tādējādi dažādi AI klienti, komandas vai lietošanas gadījumi var savienoties tieši ar tiem workflows, kas viņiem nepieciešami.

### Nosaukta Servera Izveide

1. Ievadiet nosaukumu ievades laukā MCP cilnē (piemēram, **CRM Tools**)
2. Noklikšķiniet uz **Izveidot** — jauna servera karte parādās nekavējoties
3. Noklikšķiniet uz kartes, lai to paplašinātu

### Iestatījumi Katram Serverim

Katras servera kartes informācija:

| Iestatījums | Apraksts |
|-------------|----------|
| **SSE Endpoint** | Unikāla URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Atslēga** | Neatkarīga atslēga, kas tiek rādīta tikai vienu reizi, kad tā tiek ģenerēta vai atjaunota. Nokopējiet to uzreiz; tā tiek glabāta hashētā veidā un vēlāk nevar tikt atklāta |
| **Kā savienoties** | **Kopēt JSON** kopē gatavo MCP konfigurāciju, ko var ielīmēt; **Pievienot Kursoram** instalē to ar vienu klikšķi |
| **Heym Iespējas** | Pārslēdziet `heym_chat` rīku šim serverim un izvēlieties tā akreditācijas datus un modeli |
| **Piešķirtie Workflows** | Pārslēdziet, kuri no Jūsu workflows šis serveris izsaka |

### Workflow Piešķiršana

Workflow piešķiršana ir katram serverim un neatkarīga no noklusējuma servera pārslēga. Workflow var būt iespējots noklusējuma serverī un vairākos nosauktos serveros vienlaikus vai nevienā.

Pārslēdzot workflow, tas tiek pārvietots uz piešķirto saraksta augšu, tādējādi rinda, ko Jūs tikko mainījāt, paliek redzama, nevis pazūd.

### Autentifikācija

Nosaukti serveri atbalsta tās pašas autentifikācijas metodes kā noklusējuma serveris:

- **X-MCP-Key header** – Tieši nododiet servera API atslēgu (API klienti, Kursors). Tikai galvene: atslēgas netiek pieņemtas kā `?key=` vaicājuma parametrs, jo URL nonāk piekļuves žurnālos, starpniekservera žurnālos un pārlūkprogrammas vēsturē.
- **Claude OAuth** – Pievienojiet servera URL Claude integrācijām; atstājiet akreditācijas datus tukšus, un Claude reģistrējas automātiski, izmantojot OAuth. Bearer token jānosūta `Authorization` galvenē, nevis kā `?token=`.
- **Sesijas token** – Izsniegts SSE handshake laikā; ierobežots uz konkrēto serveri, tādējādi token no viena nosaukta servera nevar piekļūt citam. Šis īslaicīgais `?session=` parametrs netiek ietekmēts.

### Nosauktā Servera Dzēšana

Noklikšķiniet uz **X** ikonas servera kartes galvenē. Dzēšana noņem serveri un visus tā workflow piešķīrumus; paši workflows netiek ietekmēti.

## SSE Endpoint

| Serveris | Endpoint |
|----------|----------|
| Noklusējuma | `{origin}/api/mcp/sse` |
| Nosaukts | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Abi endpointi atbalsta SSE transportu (GET, MCP specifikācija 2024-11-05) un Streamable HTTP transportu (POST, MCP specifikācija 2025-03-26). Claude izmanto OAuth 2.1 / PKCE drošai pieteikšanās procedūrai abos.

## Saistītie

- [Kāpēc Heym](../getting-started/why-heym.md) – MCP kā pirmšķirīga primitīva Heym
- [Aģenta Mezgls](../nodes/agent-node.md) – Aģenta mezgls ar MCP rīku atbalstu
- [Aģenta Arhitektūra](../reference/agent-architecture.md) – MCP klients, rīku izsniegšana, orķestrators
- [Triggeri](../reference/triggers.md) – MCP kā workflow ievades punkts
- [Čata Cilne](./chat-tab.md) – Dzinējs aiz `heym_chat` rīka
- [Workflows Cilne](./workflows-tab.md) – Izveidojiet un pārvaldiet workflows
- [Mezglu Veidi](../reference/node-types.md) – AI mezglu pārskats
- [Kontekstuālais Paraugs](../reference/contextual-showcase.md) – Kompakta lapas rokasgrāmata informācijas paneļa virsmām
