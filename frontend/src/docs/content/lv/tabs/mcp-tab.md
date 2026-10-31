# MCP / A2A cilne

**MCP** cilne konfigurē Model Context Protocol (MCP) integrāciju, un kā [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) serverus, kuriem citi aģenti var deleģēt uzdevumus. MCP ļauj AI klientiem (Claude, ChatGPT, Gemini, Cursor un jebkuram MCP saderīgam rīkam) izsaukt Jūsu Heym workflows kā rīkus.

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
- **ChatGPT** – Cilnē tiek rādīts MCP servera URL un iestatīšanas darbības ChatGPT lietotnei. Ieslēdziet izstrādātāja režīmu (Developer mode), izveidojiet lietotni ar šo URL un izvēlieties OAuth; ChatGPT reģistrējas automātiski.
- **Gemini** – Cilnē tiek rādīts MCP servera URL un iestatīšanas darbības pielāgotai Gemini lietotnei: vietnē gemini.google.com atveriet **Settings → Connected Apps → Add a custom app**, ielīmējiet URL un atstājiet **Advanced features** aizvērtu; Gemini reģistrējas automātiski un autentificējas, izmantojot Heym OAuth. Pēc savienošanas Heym darbojas arī Gemini mobilajā lietotnē.

### Workflow MCP slēdzis

Katru workflow var izsist kā MCP rīku:

- **Ieslēgt** – Workflow rīki kļūst pieejami visiem klientiem, kas savienoti ar noklusējuma serveri.
- **Izslēgt** – Workflow netiek izsists.

Workflow kartes rāda aprakstu un ievades lauku nosaukumu priekšskatījumu, lai Jūs varētu redzēt, ko katrs rīks sagaida pirms tā aktivizēšanas.


### Rindā ievietotie palaidumi un heym_execution_status

Workflow ar [vienlaicības ierobežojumu](../reference/webhooks.md#concurrency-limit-and-queued-runs) var būt aizņemts, kad klients to izsauc. Pēc tam izsaukums nekavējoties atgriež rezultātu, kas nav kļūda:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Klients aptaujā rīku `heym_execution_status` ar šo `execution_id`. Tas atgriež to pašu pamattekstu kā [statusa URL](../reference/webhooks.md#status-url): `queued` ar pašreizējo pozīciju, `running`, pēc tam `success` vai `error` ar rezultātiem. Tas atrod tikai to workflows palaidumus, kurus atklāj viens un tas pats serveris. Rīks tiek rādīts noklusējuma serverī un katrā nosauktajā serverī tikai tik ilgi, kamēr vismaz vienam no tā workflows ir vienlaicības ierobežojums. Kad rinda ir pilna, izsaukums atgriež kļūdu "Concurrency queue is full".
## Heym aģents

**Heym Capabilities** sadaļa pārvērš Chat cilnes dzinēju par vienu MCP rīku ar nosaukumu `heym_chat`. Ieslēdziet to noklusējuma serverī, jebkurā nosauktajā serverī vai abos — katra virsma saglabā savu slēdzi un modeļa izvēli.

Kad tas ir ieslēgts, `heym_chat` parādās `tools/list` kopā ar Jūsu workflow rīkiem. MCP klients nosūta vienu dabiskās valodas ziņu, un Heym dzinējs to pārņem, ar tām pašām spējām, kādas ir Chat cilnei:

- Izveidot workflow, veikt tā testa izpildi ar parauga ievaddatiem, izlabot to un pabeigt, kad izpilde ir veiksmīga (skatiet [Izveides režīms](#build-mode))
- Pārbaudīt un izpildīt Jūsu esošos workflows
- Ziņot par analītiku, nesenajām izpildēm un gaidāmajām cron grafikām.
- Paskaidro, kur darbplūsmas neizdodas un kāpēc tās ir lēnas: darbplūsmas, kas palaistas visbiežāk, visvairāk cietušas neveiksmi un ir vislēnākās, kā arī mezglu tipus ar vislielāko laiku, kļūdām un izsaukumiem pēdējo 1, 3 vai 6 stundu, 24 stundu, 7 vai 30 dienu laikā vai visā periodā
- Ziņot par viena workflow izpildes vēsturi: cik reizes tas ir izpildīts, statusa skaitļi, kad tas tika izpildīts, un pēc pieprasījuma ievades, izejas un katra mezgla kļūdas vienas izpildes laikā.
- Ziņot par to, kas šobrīd tiek izpildīts: cik izpildes ir aktīvas, to workflow nosaukumi, cik ilgi katra ir darbojusi, uz kura mezgla katra pašlaik atrodas, un saite uz tiešo izpildi.
- Sarakstīt dēļus, izveidot kartes un lasīt kartes detaļas [Board cilnē](./board-tab.md).
- Uzskaita informācijas paneļus (Heym Work lapas) un to logrīkus, noskaidro, kurā panelī atrodas darbplūsma, pievieno jaunu logrīku un izveido tā darbplūsmu, ievieto esošu darbplūsmu kā logrīku, pārdēvē vai dzēš logrīkus vai sakārto izkārtojumu (sk. [Dashboard › No Chat un MCP](./dashboard-tab.md#from-chat-and-mcp))
- Pārbauda datu tabulas un rindas, izveido tabulas, pievieno vai noņem kolonnas, ievieto, atjaunina vai dzēš rindas un savieno tabulas darbplūsmās
- Izveido, rediģē un izpilda uzvedņu un aģentu novērtēšanas komplektus ([Eval suites](./evals-tab.md#from-chat-and-mcp)), tostarp aģenta bāzes līniju: ziņotu, izveidotu no izpildēm vai norādītu skaitliski. Rezultātā tiek norādīta saite Evals katram saglabātajam komplektam.
- Izveidojiet vai atjauniniet savus akreditācijas datus Heym lapā (skatiet [Akreditācijas dati](#akreditācijas-dati))
- Lasīt komandas un globālos mainīgos, un meklēt dokumentāciju.
- Apstiprināt, rediģēt vai atteikt gaidošās cilvēku atsauksmes.

Spējas, kas vēlāk pievienotas Chat cilnei, automātiski kļūst pieejamas caur `heym_chat` — nav nepieciešama atsevišķa slēdzis katrai spējai, lai saglabātu sinhronizāciju.

Šīs iespējas darbojas rīkā `heym_chat`: `tools/list` parāda `heym_chat` un jūsu darbplūsmas rīkus, nekad tērzēšanas iekšējos rīkus, piemēram, novērtēšanas komplektus.

### Izveides režīms

`heym_chat` vienmēr darbina Chat dzinēju izveides režīmā (build mode). Vienā izsaukumā asistents var saglabāt jaunu workflow, palaist to ar reālistiskiem parauga ievaddatiem, izlasīt izpildes pārskatu, izlabot radušās kļūdas un palaist to vēlreiz — līdz piecām testa izpildēm vienā izsaukumā. Kad pēdējās saglabātās versijas jaunākā izpilde ir veiksmīga, tas noslēdz darbu ar viena teikuma kopsavilkumu, un atbilde beidzas ar `Verified: the latest test run of the saved workflow passed.`

Kad izsaukums izveido vai rediģē workflow, atbildē katrs tiek uzskaitīts ar pilnu redaktora saiti, piemēram, `https://heym.example.com/workflows/<id>`, un saites asistenta atbildē arī ir pilnas saites. Tās izmanto jūsu konfigurēto Heym adresi (`FRONTEND_URL`) un atveras Heym ielogotām personām, kurām ir piekļuve šim workflow.

- Testa izpildes ir reālas izpildes. To blakusefekti patiešām notiek, un tās parādās workflow izpildes vēsturē tāpat kā jebkura cita izpilde.
- Saglabāšana notiek pa redaktora ceļu: grafa izmaiņas saglabā iepriekšējo grafu workflow rediģēšanas vēsturē (**Edit History**).
- Lai mainītu iepriekš izveidotu workflow, turpiniet pavedienu ar to pašu `conversation_id`. Asistents atjaunina šo workflow, nevis izveido jaunu, un maina tikai tos workflows, kurus Jums ir tiesības rediģēt.
- Kad piecas testa izpildes ir izsmeltas, asistents apstājas un paskaidro, kas joprojām neizdodas.

`heym_chat` var pārbaudīt jūsu tabulas un rindas, izveidot tabulas, pievienot vai noņemt kolonnas, kā arī ievietot, atjaunināt vai dzēst rindas. Norādiet tabulas nosaukumu, UUID vai DataTable saiti, piemēram: „Pievienot divas teksta kolonnas, vārdu un uzvārdu, vietnē https://heym.example/?tab=datatable/<table-id>”. Tas tieši maina tabulu un saglabā esošās kolonnas un vērtības, pievienojot jaunas kolonnas.

`heym_chat` var pārbaudīt jūsu tabulas un rindas, izveidot tabulas, pievienot vai noņemt kolonnas, kā arī ievietot, atjaunināt vai dzēst rindas. Norādiet tabulas nosaukumu, UUID vai DataTable saiti, piemēram: „Pievienot divas teksta kolonnas, vārdu un uzvārdu, vietnē https://heym.example/?tab=datatable/<table-id>”. Tas tieši maina tabulu un saglabā esošās kolonnas un vērtības, pievienojot jaunas kolonnas.

Rakstīšanas darbībām ir nepieciešamas īpašumtiesības vai **rakstīšanas** piekļuve, izmantojot tiešo vai komandas koplietošanu. Tikai lasīšanas piekļuve ļauj veikt pārbaudi. Rindu rakstīšanā tiek izmantotas cilnes DataTable tipa, noklusējuma vērtības, obligātuma un unikalitātes pārbaudes; daļējs imports ziņo par noraidītajām rindām. Kolonnu noņemšana dzēš to vērtības no katras rindas. Tāpat kā cilnē DataTable, kolonnu noņemšanai un visu rindu dzēšanai vispirms nepieciešams apstiprinājums; atbildiet ar to pašu `conversation_id`, lai apstiprinātu. Atlasītās rindas dzēšanai nav nepieciešams papildu apstiprinājums.


### Akreditācijas dati

`heym_chat` redz jūsu īpašumā esošos un ar jums kopīgotos akreditācijas datus pēc nosaukuma un veida tāpat kā cilne Čats. Kad tā veidotajam workflow ir nepieciešami akreditācijas dati, tas rezultātā uzdod jautājumu, kurus izmantot. Atbildiet ar to pašu `conversation_id`.

Lai pievienotu akreditācijas datus vai atjauninātu sev piederošos, asistents atver Heym akreditācijas datu veidlapu Heym lapā, `/credentials/setup/<id>`. Jūs tur piesakāties Heym, ievadāt atslēgu vai pievienojat kontu un saglabājat. Vērtība nonāk tieši Heym: MCP klients un tā modelis uzzina tikai akreditācijas datu nosaukumu un veidu. Neielīmējiet atslēgas MCP klientā; tā vietā pieprasiet veidlapu.

| Klients | Kas notiek |
|---------|------------|
| Atbalsta MCP URL izgūšanu | Klients aicina atvērt Heym lapu. Izsaukums gaida veidlapas aizpildīšanu (līdz desmit minūtēm), pēc tam turpina ar jaunajiem akreditācijas datiem. |
| Viss pārējais | Rezultāts satur saiti un lūdz klientam vēlreiz izsaukt `heym_chat` ar `wait_for_credential_form`. Šis izsaukums gaida līdz piecām minūtēm veidlapas aizpildīšanas laikā un pēc tam atsāk sarunu. Ja klients negaida, saglabājiet veidlapu un atbildiet ar to pašu `conversation_id`; nākamais izsaukums zinās, ka veidlapa tika saglabāta un kādi akreditācijas dati tika izveidoti. |

Lapa tiek atvērta tikai tam Heym kontam, kas uzsāka pieprasījumu, tāpēc pāradresēta saite ir nederīga citiem. Veidlapa paliek atvērta 24 stundas un to var noraidīt no lapas. Tiklīdz saglabājat vai noraidāt, solis cilnes Čats sarunā parāda rezultātu.


### Akreditācija un modelis

`heym_chat` darbojas uz Jūsu Heym konta, tāpēc tai nepieciešama sava LLM akreditācija:

| Lauks | Uzvedība |
|-------|----------|
| **Akreditācija** | Izvēlieties jebkuru OpenAI, Google vai Custom akreditāciju, kurai Jūs varat piekļūt. Iepriekš aizpildīts no preferētās akreditācijas [Iestatījumos](../reference/user-settings.md), kad Jūs neesat izvēlējušies nevienu. |
| **Modelis** | Ielādēts no izvēlētās akreditācijas. Iepriekš aizpildīts no Jūsu preferētā modeļa, kad akreditācija sakrīt. |

Ja kāds no tiem trūkst, rīks joprojām parādās `tools/list`, bet katrs izsaukums atgriež kļūdu, kas informē Jūs pabeigt iestatīšanu šajā cilnē.


LLM un Agent mezgli `heym_chat` veidotajā workflow darbojas ar šiem akreditācijas datiem un modeli, ieskaitot akreditācijas datus, ko kāds ir kopīgojis ar jums, tāpēc testa palaidumi darbojas bez papildu iestatīšanas soļa. Kad `heym_chat` rediģē workflow, LLM un Agent mezgli, kuriem jau ir akreditācijas dati, saglabā tos kopā ar savu modeli.
### Argumenti un vēsture

| Arguments | Nepieciešams | Apraksts |
|-----------|--------------|----------|
| `message` | Jā | Instrukcija vai jautājums, dabiskā valodā. |
| `conversation_id` | Nē | `conversation_id` no iepriekšējā `heym_chat` rezultāta, lai turpinātu šo pavedienu. |
| `wait_for_credential_form` | Nē | Ar `conversation_id`: pagaidiet, līdz lietotājs saglabā vai noraida pavediena atvērto akreditācijas datu veidlapu, pēc tam nosūtiet `message`. |

Katrs izsaukums tiek pierakstīts Jūsu [Chat cilnes](./chat-tab.md) vēsturē kā parasta saruna, atzīmēta ar kontaktdakšas ikonu sarunu sarakstā. Ziņas, rīku kartes un precizēšanas pauzes izskatās tieši tāpat kā saruna, ko Jūs uzsākat paši, un Jūs varat atvērt pavedienu un turpināt runāt pārlūkā. Katrs rezultāts atgriež savu `conversation_id`, lai MCP klients varētu turpināt to pašu pavedienu, nevis atvērt jaunu katrā izsaukumā.

Kad asistents prasa precizējumu, tas apstājas un to norāda; atbildiet ar atbildēm, izmantojot to pašu `conversation_id`.
### Iespējot A2A

Kamēr Heym aģents ir ieslēgts, kartītē ir redzama izvēles rūtiņa **Iespējot A2A**. Atzīmējiet to, un citi aģenti varēs nosūtīt uzdevumus Heym aģentam, izmantojot Agent2Agent protokolu (A2A 1.0). Pēc tam kartītē tiek parādīts **Agent Card** URL un **JSON-RPC endpoint**, katrs ar kopēšanas pogu, kā arī komanda `curl` kartītes iegūšanai. A2A izmanto to pašu atslēgu un OAuth pieteikšanos, ko MCP. Izslēdzot aģentu, tiek izslēgts arī A2A. Skatiet [A2A](../reference/a2a.md) par metodēm, uzdevumu stāvokļiem un piemēru.

### Progress

Ilgstošs `heym_chat` izsaukums ziņo par aģenta darbībām kā MCP progresu (`notifications/progress`), lietojot tos pašus vārdus, kas redzami cilnē Chat, piemēram, `Darbplūsmas testēšana · 2/5 mēģinājums`. Klienti, kuri atiestata noildzi pēc progresa saņemšanas, turpina gaidīt, kamēr aģents strādā.

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
| **Heym Capabilities** | Pārslēdziet Heym aģentu (`heym_chat`) šim serverim un izvēlieties tā akreditācijas datus un modeli |
| **Iespējot A2A** | Šī servera personīgais A2A slēdzis ar savu Agent Card adresē `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Iespējot A2A** | Šī servera personīgais A2A slēdzis ar savu Agent Card adresē `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Piešķirtie Workflows** | Pārslēdziet, kuri no Jūsu workflows šis serveris izsaka |

### Workflow Piešķiršana

Workflow piešķiršana ir katram serverim un neatkarīga no noklusējuma servera pārslēga. Workflow var būt iespējots noklusējuma serverī un vairākos nosauktos serveros vienlaikus vai nevienā.

Pārslēdzot workflow, tas tiek pārvietots uz piešķirto saraksta augšu, tādējādi rinda, ko Jūs tikko mainījāt, paliek redzama, nevis pazūd.

### Autentifikācija

Nosaukti serveri atbalsta tās pašas autentifikācijas metodes kā noklusējuma serveris:

- **X-MCP-Key header** – Tieši nododiet servera API atslēgu (API klienti, Kursors). Tikai galvene: atslēgas netiek pieņemtas kā `?key=` vaicājuma parametrs, jo URL nonāk piekļuves žurnālos, starpniekservera žurnālos un pārlūkprogrammas vēsturē.
- **Claude, ChatGPT un Gemini OAuth** – Pievienojiet servera URL klienta savienotājiem vai pielāgotajām lietotnēm; atstājiet akreditācijas datus tukšus, un klients reģistrējas automātiski, izmantojot OAuth. Bearer token jānosūta `Authorization` galvenē, nevis kā `?token=`.
- **Sesijas token** – Izsniegts SSE handshake laikā; ierobežots uz konkrēto serveri, tādējādi token no viena nosaukta servera nevar piekļūt citam. Šis īslaicīgais `?session=` parametrs netiek ietekmēts.

### Nosauktā Servera Dzēšana

Noklikšķiniet uz **X** ikonas servera kartes galvenē. Dzēšana noņem serveri un visus tā workflow piešķīrumus; paši workflows netiek ietekmēti.

## SSE Endpoint

| Serveris | Endpoint |
|----------|----------|
| Noklusējuma | `{origin}/api/mcp/sse` |
| Nosaukts | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Abi endpointi atbalsta SSE transportu (GET, MCP specifikācija 2024-11-05) un Streamable HTTP transportu (POST, MCP specifikācija 2025-03-26). Claude, ChatGPT un Gemini izmanto OAuth 2.1 / PKCE drošai pieteikšanās procedūrai abos.

## Saistītie

- [Kāpēc Heym](../getting-started/why-heym.md) – MCP kā pirmšķirīga primitīva Heym
- [Aģenta Mezgls](../nodes/agent-node.md) – Aģenta mezgls ar MCP rīku atbalstu
- [Aģenta Arhitektūra](../reference/agent-architecture.md) – MCP klients, rīku izsniegšana, orķestrators
- [Triggeri](../reference/triggers.md) – MCP kā workflow ievades punkts
- [Čata Cilne](./chat-tab.md) – Dzinējs aiz `heym_chat` rīka
- [Workflows Cilne](./workflows-tab.md) – Izveidojiet un pārvaldiet workflows
- [Mezglu Veidi](../reference/node-types.md) – AI mezglu pārskats
- [Kontekstuālais Paraugs](../reference/contextual-showcase.md) – Kompakta lapas rokasgrāmata informācijas paneļa virsmām