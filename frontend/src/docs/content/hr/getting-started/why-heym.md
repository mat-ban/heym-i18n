# Zašto Heym

Heym je infrastruktura za pokretanje i upravljanje AI agentima u produkciji. Jedno samostalno hostano runtime okruženje pokriva svaku fazu životnog ciklusa agenta.

Prototip agenta treba model, prompt i nekoliko alata. Produkcijski agent također treba triggere i ponovne pokušaje, spremljeno stanje kada se pauzira zbog osobe, zapis svakog poziva modela i alata, trošak svakog pokretanja, testove prije nego što promjena bude isporučena i jasna ograničenja onoga što može činiti samostalno. Heym sve to drži na jednom mjestu, tako da je sustav koji dizajnirate na platnu upravo sustav koji se izvršava. Izgradite agentne sustave, a zatim ih pokrećite s povjerenjem.

## Jedno runtime okruženje za životni ciklus agenta

| Faza | Što Vam Heym omogućuje |
|---|---|
| **Izgradnja** | Sastavite agente i determinističke korake na platnu, generirajte ih pomoću [AI Assistant](../reference/ai-assistant.md) ili započnite s [Templates](../tabs/templates-tab.md) i prenosivim vještinama. |
| **Orkestracija** | Koordinirajte agente, [sub-agente](../reference/agent-architecture.md), coding agente, RAG, automatizaciju preglednika i alate s eksplicitnim tokom podataka i [paralelnim izvršavanjem](../reference/parallel-execution.md). |
| **Pokretanje** | Pokrenite izvršavanja putem [webhookova](../reference/webhooks.md), rasporeda i event [triggera](../reference/triggers.md), s ponovnim pokušajima po čvoru, [rukovanjem greškama](../nodes/error-handler-node.md) i [raspodjelom opterećenja](../reference/cluster.md) među instancama. |
| **Nadzor** | Pregledajte svako izvršavanje kroz [povijest](../reference/execution-history.md), [LLM traceove](../tabs/traces-tab.md), USD trošak po pokretanju, aktivna pokretanja na platnu, [analitiku](../tabs/analytics-tab.md), [alerts](../tabs/alerts-tab.md) i izvoz putem [OpenTelemetry](../reference/opentelemetry.md). |
| **Evaluacija** | Testirajte promptove i modele prema očekivanim izlazima u [Evals](../tabs/evals-tab.md), s LLM-as-Judge ocjenjivanjem i usporedbom modela jedan uz drugi. |
| **Kontrola** | Zadržite ljude u kontroli pomoću [kontrolnih točaka pregleda](../reference/human-in-the-loop.md) i [guardrailsa](../reference/guardrails.md), te upravljajte pristupom pomoću enkriptiranih [credentials](../reference/credentials.md), [timova](../reference/teams.md), [single sign-ona](../reference/sso.md) i [revizijskog traga](../reference/audit.md). |
| **Izlaganje** | Poslužite workflowe putem REST-a i [SSE-a](../reference/sse-streaming.md), kao [MCP](../tabs/mcp-tab.md) alate, kao [Portal](../reference/portal.md) chat sučelja i kao widgete na [dashboardu](../tabs/dashboard-tab.md). |

## Build

### AI Assistant: Izradite Workflowe prirodnim jezikom

[AI Assistant](../reference/ai-assistant.md) je chat panel unutar workflow editora. Opišite što želite, na primjer "create a workflow that takes user input, searches my knowledge base, and replies using GPT-4o", i assistant generira nodeove i edgeove koji se odmah primjenjuju na canvas.

- Koristi Vaš vlastiti LLM credential (bilo koji podržani model)
- Podržava **voice input** za dizajniranje workflowa bez korištenja ruku
- Automatski primjenjuje valjani workflow JSON iz AI odgovora na canvas
- Streama odgovore u stvarnom vremenu

Assistant radi izravno unutar editora i streama nodeove na canvas u stvarnom vremenu, a sve što generira ostaje uređivo kao nodeovi koje ste ručno postavili.

### Skills System

Skills su prenosivi paketi sposobnosti, datoteka s uputama `SKILL.md` plus opcionalne Python skripte, koji se mogu dodati na bilo koji Agent node.

- Upute skilla dodaju se na početak system prompta agenta
- Python datoteke u skillu postaju pozivni alati
- Skills su višekratno upotrebljivi u različitim workflowima i mogu se dijeliti kao `.zip` arhive

To je analogno tome da svom agentu date opis posla i alatnicu u jednom potezu.

### Workflow Analyzer: Povratne informacije svjesne izvršavanja

Panel [Workflow Analysis](../reference/workflow-analysis.md) je alat za dokumentaciju i povratne informacije svjestan izvršavanja, ugrađen u editor. Kliknite **Analyze**, odaberite LLM credential i model, a Heym generira uređivi Markdown izvještaj za trenutni workflow.

Za razliku od statične bilješke, analyzer najprije pokreće workflow kada je to moguće i uključuje rezultat izvršavanja u prompt. Izvještaj pokriva područja za poboljšanje, svrhu workflowa i objašnjenje korak po korak što nodeovi rade. Kada izvještaj već postoji, **Reanalyze** streama zaseban pregled kako biste mogli prihvatiti novu verziju ili zadržati trenutni zajednički dokument.

## Orkestracija

### Ugrađeni LLM i Agent čvorovi

Heymov [Agent Node](../nodes/agent-node.md) izvršava tijesno integriranu petlju pozivanja alata s inline Python alatima, MCP vezama i prijenosnim sustavom vještina, sve dizajnirano za produkcijske agente.

Heymov obični [LLM node](../nodes/llm-node.md) također nadilazi jednostavan korak prompt-odgovor. Za podržane OpenAI i OpenAI-kompatibilne endpointe može se prebaciti u **Batch API način rada** tako da jedan čvor pošalje niz promptova u provider-native batch zahtjevu niže cijene. Platno zatim izlaže namjensku `batchStatus` granu koja se aktivira dok batch prolazi kroz stanja kao što su `pending`, `processing` i `completed`.

To znači da LLM čvor može raditi dvije stvari istovremeno:

- Pokrenuti glavni batch zahtjev i vratiti konačne izlaze po stavci na normalnoj grani
- Aktivirajte logiku obavijesti ili bilježenja pri svakom značajnom ažuriranju statusa batcha bez pretvaranja toka u prilagođenu petlju anketiranja

Batch izvršavanje je prvoklasni LLM workflow primitive, s provjerama mogućnosti providera i modela u UI-ju čvora.

**Agent Node** je jezgra agent orkestracije u Heymu:

- **Pozivanje alata** – Agent iterira preko poziva alata u petlji dok ne proizvede konačni odgovor
- **Python alati** – Definirajte prilagođene alate inline s punim Pythonom; agent ih poziva tijekom izvršavanja
- **MCP veze** – Povežite se na bilo koji [Model Context Protocol](https://modelcontextprotocol.io/) poslužitelj (stdio ili SSE) i agent automatski dobiva sve njegove alate
- **Vještine** – Ispustite `.zip` ili `.md` datoteku na agenta kako biste proširili njegov sistemski kontekst i dodali Python alate
- **Pozivi pod-workflowa** – Agent može pozivati druge Heym workflowe kao alate, sastavljajući složeno ponašanje bez prilagođenog koda

Pogledajte [Agent Node](../nodes/agent-node.md) i [Agent Architecture](../reference/agent-architecture.md) za potpunu referencu.

### Multi-Agent orkestracija

Heym podržava **orchestrator pattern** s prvoklasnim vizualnim primitivima:

- Jedan agent djeluje kao **orchestrator** (`isOrchestrator: true`) i dobiva alat `call_sub_agent`
- Delegira zadatke imenovanim **sub-agentima** na istom platnu
- Sub-agenti sami mogu pozivati druge agente ili pod-workflowe (maksimalna dubina: 5)
- **Paralelno izvršavanje**: Kada orchestrator pozove više sub-agenata u jednom potezu, oni se izvršavaju paralelno za brže rezultate

To omogućuje arhitekture poput agenta za planiranje koji usmjerava posao istraživaču, programeru i sažimaču, sve vizualno povezano bez prilagođenog koda za orkestraciju.

Pogledajte [Agent Architecture](../reference/agent-architecture.md) za detalje izvršavanja.

### Coding agenti kao čvorovi workflowa

Heym isporučuje dva čvora koji pokreću pravi coding agent kao korak workflowa, a ne chat completion:

- **[Codex Node](../nodes/codex-node.md)** – Pokreće OpenAI Codex CLI u izoliranom Heym radnom prostoru nad GitHub repozitorijem. Podržava **Sign in with ChatGPT** (PKCE OAuth na vašoj Plus/Pro pretplati, bez troška API-ja po tokenu) ili pristupni token, klonira repo, dopušta Codexu uređivanje koda i vraća `summary`, `diff`, `changedFiles` i nacrt `pullRequestUrl`.
- **[OpenCode Go Node](../nodes/opencode-go-node.md)** – Isti workflow repozitorija kroz provider-agnostic OpenCode gateway (Kimi, DeepSeek, Qwen i više), izvršen u **očvrsnutom kontejneru za jednokratnu upotrebu**: sve mogućnosti uklonjene, root samo za čitanje, ograničenja pid/memorije/CPU-a. GitHub token ostaje izvan sandboxa: Heym obavlja svaku git i GitHub operaciju na strani hosta, tako da generirani kod ne može eksfiltrirati push vjerodajnice.

To znači da workflow može trijažirati bug iz webhooka, predati repo coding agentu, čekati nacrt PR-a i objaviti poveznicu na Slack, potpuno automatizirano, s ograničenjima resursa koja se mogu konfigurirati po deploymentu.

### Ugrađeni RAG pipeline

Heym uključuje [RAG / Vector Store Node](../nodes/rag-node.md) i upravljani [Vectorstores](../tabs/vectorstores-tab.md) tab. Možete:

- Odabrati svoj vektorski backend: **Qdrant** (vanjski poslužitelj) ili **Postgres (pgvector)**, koji pohranjuje vektore u Heymovoj vlastitoj bazi podataka bez dodatne usluge za pokretanje
- Umetnuti dokumente u vektorsku pohranu izravno iz čvora workflowa
- Izvršiti semantičko pretraživanje i prenijeti rezultate u LLM ili Agent čvor
- Referencirati rezultate izrazima poput `$ragNode.results.map("item.payload.content").join("\n\n")`

U Heymu je RAG dva čvora s punom kontrolom nad embeddingovima i dohvaćanjem.

### Automatizacija preglednika s Playwrightom

[Playwright node](../nodes/playwright-node.md) je first-party automatizacija preglednika na platnu.

- **Steps mode** – Vizualno sastavite navigaciju, klik, tipkanje, ispunjavanje, snimku zaslona, izdvajanje i pomicanje
- **AI koraci s auto-heal** – Opišite radnju prirodnim jezikom i LLM generira Playwright radnje; neuspjeli selektori mogu se automatski ispraviti, a generirani koraci mogu se predmemorirati kako bi se preskočili budući LLM pozivi
- **Run Code mode** – Prebacite čvor na puni Playwright Python za složene tokove (onemogućeno prema zadanim postavkama; izvršava se u Heymovom očvrsnutom sandboxu kada je omogućeno)
- **Autentificirane sesije** – Vratite kolačiće/`storageState` prije izvršavanja, provjerite prijavu provjerom selektora i vratite se na skriptirane korake prijave
- **Mrežno snimanje** – Opcionalno prikupite JSON odgovore, zaglavlja, kolačiće i pohranu preglednika uz rezultate

Heym tretira preglednik kao normalan čvor s istim izrazima, vjerodajnicama i rukovanjem pogreškama kao i sve ostalo.

### Expression DSL

Heymov [Expression DSL](../reference/expression-dsl.md) pruža čistu, moćnu sintaksu za referenciranje podataka uzvodnih čvorova:

- `$input.text` – Podaci ulaznog čvora
- `$nodeName.field` – Izlazno polje bilo kojeg uzvodnog čvora
- `$global.variableName` – Trajne globalne varijable
- Pomoćnici za polja: `.first()`, `.map("field")`, `.join("\n")`

Izrazi rade u svakom tekstualnom polju, uključujući promptove, HTTP zaglavlja, uvjete i postavljene vrijednosti, tako da se podaci kreću između koraka eksplicitno. DSL balansira moć i čitljivost bez potrebe za potpunim poznavanjem JavaScripta.

## Pokretanje

### Triggeri, ponovni pokušaji i putanje pogrešaka

Workflow može započeti s mnogo mjesta. [Input](../nodes/input-node.md) čvorovi primaju HTTP [webhookove](../reference/webhooks.md), [Cron](../nodes/cron-node.md) se izvršava prema rasporedu, a event [triggeri](../reference/triggers.md) pokreću izvršavanja iz Telegrama, Discorda, Slacka, IMAP sandučića, WebSocket streamova, RabbitMQ redova, uploada datoteka i Heym platform eventa.

Neuspjesi se obrađuju unutar grafa. Svaki čvor može ponoviti pokušaj pri neuspjehu s određenim brojem pokušaja i čekanjem između njih, svaki se pokušaj bilježi u [povijesti izvršavanja](../reference/execution-history.md), a [Error Handler](../nodes/error-handler-node.md) čvor pokreće se automatski kada čvor ne uspije, tako da je oporavak dio samog workflowa.

### Paralelno DAG izvršavanje

Heymov workflow executor koristi directed acyclic graph (DAG) scheduler. Neovisni čvorovi izvršavaju se paralelno automatski, bez potrebe za konfiguracijom.

- Čvorovi na istoj razini ovisnosti šalju se istovremeno u thread pool (`max_workers=8`)
- Čim bilo koji čvor završi, njegovi nizvodni čvorovi se zakazuju
- [Merge Node](../nodes/merge-node.md) kombinira rezultate paralelnih grana
- Više izvršavanja workflowa izvodi se istovremeno; svako izvršavanje je potpuno izolirano

Paralelnost je zadano ponašanje, određeno strukturom grafa.

Vidi [Paralelno izvršavanje](../reference/parallel-execution.md).

### Skaliranje kroz instance

Usmjerite drugu Heym instancu na istu PostgreSQL bazu podataka i ona se pridružuje kao worker. Pozadinska izvršavanja dijele se između instanci prema težinama koje postavite, jedan izabrani leader održava rasporede, evaluaciju alerta i oporavak od pada kroz failover, a svako izvršavanje bilježi instancu koja ga je izvršila. Vidi [Raspodjela opterećenja](../reference/cluster.md).

### Agentic Kanban ploča

[Board tab](../tabs/board-tab.md) ugrađena je Kanban ploča u kojoj sami stupci izvršavaju workflowe. Kartica je trajni agentic posao koji nosi kontekst, povijest razgovora, stanje izvršavanja, izlaze i izvršavanja workflowa.

- **Lanci workflowa stupaca** – Premještanje kartice u stupac pokreće lanac workflowa tog stupca; **Agentic Kanban Model** (vaš credential + model) mapira sadržaj kartice u inpute workflowa i pretvara izlaze natrag u čitljiv tekst
- **Privici kartica** – Ispustite datoteke na karticu; dokumenti se ekstrahiraju u tekst, a slike se prosljeđuju modelima s podrškom za vid prije svakog izvršavanja
- **Live run canvas** – Otvorite aktivno izvršavanje unutar kartice i promatrajte kako se izvodi na stvarnom workflow canvasu, čvor po čvor
- **Dijeljenje s timom** – Dijelite ploče s korisnicima ili timovima s dopuštenjima za čitanje/pisanje; lanci na dijeljenim pločama izvršavaju se s vjerodajnicama vlasnika, tako da suradnici nikada ne trebaju vlastite
- **Vidljivost neuspjeha** – Neuspjele kartice prikazuju indikator povijesti pogrešaka, a naknadna izvršavanja mogu se pauzirati kako bi čekala komentare

Ploča je nativna površina platforme: kartice, workflowi, vjerodajnice i live izvršavanja svi se nalaze na jednom mjestu.

### Heym Drive: ugrađena pohrana datoteka

[Drive tab](../tabs/drive-tab.md) je pohrana datoteka ugrađena u platformu. Datoteke koje generiraju skills i workflowi (PDF, DOCX, CSV, slike) automatski završavaju tamo, a privici kartica ploče također se tamo pohranjuju.

- **Linkovi za dijeljenje** – Javni ili zaštićeni lozinkom (Basic Auth) linkovi za preuzimanje s opcionalnim rokom trajanja i maksimalnim brojem preuzimanja
- **Dijeljenje s timom** – Dijelite datoteke samo za čitanje sa svojim timovima i uklonite sva dijeljenja s timovima jednom radnjom
- **Skupne radnje** – Višestruki odabir sa shift-click rasponima, grupirajte odabire u jedan ZIP download ili primijenite jednu postavku dijeljenja/lozinke/brisanja na više datoteka odjednom
- **Pristup agenta** – Skills se mogu uključiti za čitanje Drive datoteka, tako da agent može raditi na dokumentima koje ste proizveli vi ili drugi workflowi

Generirani artefakti dobivaju trajni dom koji se može dijeliti unutar platforme.

## Promatranje

### LLM tragovi

[Kartica Traces](../tabs/traces-tab.md) pruža potpunu vidljivost za svaki LLM poziv:

- Payloadi zahtjeva i odgovora
- Vrijeme po pozivu: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Nazivi poziva alata, argumenti i rezultati
- Skills proslijeđeni modelu

Sustav traga namjenski je izgrađen za otklanjanje pogrešaka agentnog ponašanja, s potpunim payloadima zahtjeva i odgovora te vremenom po pozivu.

### Praćenje troškova LLM Tokena

Svaki LLM poziv u Heymu automatski se naplaćuje. [Kartica Traces](../tabs/traces-tab.md) prikazuje broj ulaznih i izlaznih tokena po tragu uz USD trošak u stvarnom vremenu izveden iz sinkronizirane tablice cijena.

- **Trošak po tragu** – Ulazni tokeni, izlazni tokeni i ukupni USD prikazani na svakom retku traga
- **Analitika troškova** – KPI kartice i grafikon troškova po modelu ažuriraju se s odabranim vremenskim rasponom (1h / 24h / 7d / 30d / All)
- **LLM Cost Table** – Sustavna tablica u [kartici DataTable](../tabs/datatable-tab.md) puni se iz Heliconea svakih 24 sata; možete nadjačati cijene ili dodati prilagođene retke za modele koji još nisu navedeni
- **Upozorenje o nedostajućoj cijeni** – Tragovi za modele bez unosa cijene prikazuju umetnuto upozorenje s izravnom vezom na tablicu troškova

Svaka izvedba nosi vlastiti USD trošak, raščlanjen po modelu.

### Otvaranje produkcijskih izvršavanja na živom platnu

Produkcijski workflow ostaje pregledan nakon što se pokrene izvan editora. Otvorite bilo koji unos sa statusom **Running** iz bilo kojeg dijaloga History ili otvorite aktivno izvršavanje unutar Agentic Kanban kartice, i Heym će priključiti uobičajeni workflow editor na točno to izvršavanje.

- Čvorovi koji su već završili pojavljuju se odmah sa svojim rezultatima
- Trenutni čvor i čvorovi koji čekaju dalje nastavljaju pulsirati kako izvršavanje napreduje
- Debug panel prima iste inkrementalne rezultate čvorova kao izvršavanje pokrenuto s platna
- Konačni izlaz i oznake izvršavanja stižu bez pollinga ili pokretanja dvostrukog izvršavanja
- Zatvaranje editora samo odspaja promatrača; nikada ne otkazuje produkcijski workflow

Promatrač koristi SSE podržan snimkom izvršavanja između workera, tako da radi za webhook, schedule, chat, MCP, integration i Board triggere čak i kada izvršavanjem upravlja drugi backend worker.

### OpenTelemetry, analitika i upozorenja

Heym emitira [OpenTelemetry](../reference/opentelemetry.md) spanove za svako izvršavanje workflowa, izvršavanje čvora i poziv Agent alata, izvezene putem OTLP/HTTP u Jaeger, Grafana Tempo, Honeycomb, Datadog ili bilo koji drugi kompatibilni backend.

[Kartica Analytics](../tabs/analytics-tab.md) prati broj izvršavanja, stopu uspješnosti, trajanje i trendove po workflowu. [Alerts](../tabs/alerts-tab.md) prate broj pogrešaka, trajanje izvršavanja, potrošnju tokena ili USD te obujam izvršavanja unutar vremenskog okvira, a zatim pokreću notify workflow koji odaberete, tako da upozorenje stigne do Slacka, e-pošte, Telegrama ili bilo gdje drugdje gdje čvor može.

## Evaluate

### Ugrađene evaluacije

[Kartica Evals](../tabs/evals-tab.md) omogućuje Vam definiranje testnih paketa i njihovo pokretanje na Vašim agent workflowima:

- Izradite testne slučajeve s ulazima i očekivanim izlazima ili ih generirajte iz prompta paketa
- Pokrenite jedan paket na nekoliko modela i usporedite njihove izlaze jedan uz drugi
- Ocjenjujte pomoću Exact Match, Contains ili LLM-as-Judge s neovisnim modelom ocjenjivačem
- Pregledajte prolaz/pad, stvarno naspram očekivanog i povijest pokretanja

Promijenite prompt ili model, ponovno pokrenite paket i usporedite rezultate prije nego promjena dođe u produkciju.

## Control

### Human-in-the-Loop (HITL)

Heym ima ugrađen [Human-in-the-Loop](../reference/human-in-the-loop.md) sustav koji agentima omogućuje pauziranje izvršavanja, zahtijevanje ljudskog pregleda i nastavljanje točno od mjesta na kojem su stali.

- **Agent checkpoints** – Omogućite `hitlEnabled` na bilo kojem Agent nodeu kako bi dobio alat `request_human_review`. Agent odlučuje kada odluka zahtijeva ljudski nadzor i poziva alat sa sažetkom i nacrtom.
- **Javni URL-ovi za pregled** – Svaki zahtjev za pregled generira sigurnu jednokratnu poveznicu na `/review/{token}` (TTL od 168 sati). Pregledavatelji mogu **prihvatiti**, **urediti i nastaviti** ili **odbiti** bez prijave.
- **Snimke izvršavanja** – Workflow zamrzava svoje potpuno stanje (povijest razgovora, varijable, rezultate alata) tako da se nastavlja točno od mjesta na kojem je pauziran nakon što pregledavatelj odgovori.
- **Grana za obavijesti** – Neobavezni izlazni priključak `review` omogućuje Vam povezivanje toka obavijesti (Slack, e-pošta, webhook) koji se aktivira kada se zatraži pregled.
- **Pravila odobrenja MCP alata** – Pisane HITL smjernice interpretiraju se u opsege odobrenja (`always` / `once` / `never`) kako bi agent mogao automatski odobriti alate niskog rizika i eskalirati one visokog rizika.
- **Više checkpointa** – Jedno izvršavanje agenta može se pauzirati radi pregleda više puta; svaki checkpoint je neovisan.

Javni URL-ovi za pregled, uređivanje i nastavljanje, grananje obavijesti i nastavljanje na temelju snimki funkcioniraju iz istog agent checkpointa.

Pogledajte [Human-in-the-Loop](../reference/human-in-the-loop.md) za potpunu referencu.

### LLM Guardrails

Heym ima ugrađene [Guardrails](../reference/guardrails.md) na [LLM](../nodes/llm-node.md) i [Agent](../nodes/agent-node.md) nodeovima, tako da možete blokirati nesiguran sadržaj prije nego odgovor modela dođe do nizvodnih koraka.

- **Sigurnosni prekidač na razini nodea** – Omogućite guardrails izravno na nodeu koji generira ili obrađuje sadržaj namijenjen korisnicima
- **Široka pokrivenost pravila** – Blokirajte nasilje, govor mržnje, seksualni sadržaj, NSFW/profanost, uznemiravanje, nezakonite aktivnosti, zahtjeve za osobnim podacima i pokušaje prompt injectiona
- **Višejezično otkrivanje** – Primijenite ista sigurnosna pravila na turskom, engleskom, arapskom, španjolskom i drugim jezicima
- **Fallback prilagođen workflowu** – Kada je poruka blokirana, node baca tipiziranu workflow grešku koju možete usmjeriti kroz [Error Handler](../nodes/error-handler-node.md)

Sigurnosna pravila žive izravno unutar konfiguracije LLM-a i Agenta te se izravno uklapaju u grananje workflowa i rukovanje greškama.

### Pristup, vjerodajnice i revizija

Agenti djeluju sa stvarnim vjerodajnicama, pa je pristup dio upravljanja. [Vjerodajnice](../reference/credentials.md) su šifrirane u mirovanju, maskirane nakon izrade i mogu se dijeliti s korisnicima ili [timovima](../reference/teams.md), a timovi također dijele workflowe, varijable, vektorske pohrane i Drive datoteke. [Single sign-on](../reference/sso.md) povezuje bilo kojeg OpenID Connect pružatelja, uključujući Okta, Entra ID, Keycloak, Auth0 i Google. [Revizijski trag](../reference/audit.md) bilježi svaku sigurnosno relevantnu radnju s njezinim izvršiteljem, ciljem i ishodom, strujan s Vašim logovima kontejnera do log collectora ili SIEM-a koji već koristite.

### Self-Hosted, Vi posjedujete svoje podatke

Heym radi na Vašoj infrastrukturi. Workflowi, vjerodajnice, povijest izvršavanja i tragovi žive u Vašoj vlastitoj bazi podataka, a pozivi modela idu s Vaših poslužitelja do pružatelja kojeg odaberete ili do modela kojeg sami hostate putem Ollama ili vLLM. Za agente koji obrađuju osjetljive dokumente, podatke korisnika ili vlasničke baze znanja, to je često tvrdi uvjet.

Heym je licenciran pod **MIT License s uvjetom Commons Clause**. Izvorni kod je source-available: možete ga slobodno koristiti, mijenjati i self-hostati. Commons Clause ograničava prodaju softvera, uključujući pružanje plaćenog hostinga ili konzultantskih/uslužnih usluga podrške čija vrijednost u znatnoj mjeri proizlazi iz Heyma. Za komercijalno licenciranje, enterprise implementacije ili profesionalnu podršku kontaktirajte [enterprise@heym.run](mailto:enterprise@heym.run).

## Izlaganje

### API-ji i streaming

Workflowi se mogu pozivati putem HTTP-a na `/api/workflows/{workflow_id}/execute`, što vraća JSON, i na `/api/workflows/{workflow_id}/execute/stream`, što streama node evente kao Server-Sent Events dok izvođenje napreduje. Oba dijele autentifikaciju na razini Workflowa, ograničavanje brzine i cachiranje odgovora. Pogledajte [Webhooks](../reference/webhooks.md) i [SSE Streaming](../reference/sse-streaming.md).

### MCP (Model Context Protocol) integracija

Heym ima nativnu [MCP](../tabs/mcp-tab.md) podršku na obje strane:

- **Kao klijent**: Agent nodeovi se povezuju na vanjske MCP servere (Filesystem, Browserbase, prilagođeni alati) putem stdio ili SSE i automatski konzumiraju njihove alate
- **Kao server**: Workflowi s uključenim MCP-om postaju alati na zadanom serveru na `/api/mcp/sse`, ili na imenovanim serverima s vlastitim URL-om i API ključem, tako da Claude Desktop, Cursor i drugi MCP klijenti mogu izravno pozivati Vaše Heym Workflowe

Agenti mogu konzumirati nekoliko MCP servera istovremeno, a svaki Workflow može postati alat za vanjskog MCP klijenta.

### Portal: Objavite Workflowe kao chat sučelja

Značajka [Portal](../reference/portal.md) pretvara svaki Workflow u javno dostupno chat sučelje na `/chat/{slug}`:

- Neobavezna autentifikacija s vjerodajnicama po korisniku
- Streaming izvođenje (napredak nodeova u stvarnom vremenu)
- Podrška za upload datoteka
- Povijest razgovora s više izmjena

Timovi isporučuju interne alate, chatbotove za korisnike i AI-pokretane obrasce iz jednog Workflowa i URL-a, bez potrebe za pisanjem frontend koda.

### Dashboardi pokretani Workflowima

[Dashboard tab](../tabs/dashboard-tab.md) je korisnički izgrađena površina za izvještavanje gdje je svaki widget grafikona pokretan vlastitim skrivenim Heym Workflowom. Widget može pozivati API-je, upitovati BigQuery, pretraživati RAG/vektorske pohrane, pokretati LLM korake, transformirati retke i završiti s [Chart Output nodeom](../nodes/chart-output-node.md). Widgete možete stvarati ručno, generirati ih pomoću AI-ja, kasnije ih fino podesiti, cachirati rezultate i vizualno preurediti mrežu.

## Usporedba s alatima za automatizaciju Workflowa

Mnogi timovi dolaze u Heym iz alata za automatizaciju Workflowa. Tablica u nastavku uspoređuje Heym s n8n, Zapier i Make.com po mogućnostima koje postaju važne kada agenti rade u produkciji, a fusnote ispod nje navode službenu dokumentaciju na kojoj se temelji usporedba. Za dublji pregled pojedinačnih alata pogledajte stranice za usporedbu na [heym.run/compare](https://heym.run/compare).

| Mogućnost | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Ugrađeni LLM node | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + statusne grane | ✓ | ograničeno¹¹ | –¹¹ | ograničeno¹¹ |
| Ugrađeni Agent node (pozivanje alata) | ✓ | ✓ | ✓ | ✓ |
| Orkestracija više agenata | ✓ | ✓ | ograničeno | ograničeno |
| Nodeovi coding agenta (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Ugrađeni RAG / vector store | ✓ | ✓ | ograničeno¹ | plugin² |
| WebSocket čitanje / pisanje | ✓ | ograničeno¹² | –¹³ | –¹⁴ |
| Graditelj Workflowa prirodnim jezikom | ✓ | ograničeno³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Otvaranje pokrenutog izvršavanja na živom platnu | ✓ | ograničeno¹⁹ | ograničeno¹⁹ | –¹⁹ |
| Nadzorne ploče pokretane Workflowom | ✓ | ograničeno¹⁷ | ograničeno¹⁷ | ograničeno¹⁷ |
| Agentic Kanban ploča | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Sustav Skills za agente | ✓ | – | – | – |
| Ugrađeni file drive (linkovi za dijeljenje, timovi) | ✓ | ograničeno²² | ograničeno²² | –²² |
| Node za automatizaciju preglednika (Playwright) | ✓ | ograničeno²³ | ograničeno²³ | –²³ |
| Pregled LLM traceova | ✓ | ograničeno⁴ | – | ✓ |
| Izvoz OpenTelemetry tracinga | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Praćenje troška LLM tokena (USD) | ✓ | –¹⁵ | –¹⁵ | ograničeno¹⁵ |
| Ugrađeni evals za AI Workflowe | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | ograničeno⁶ | ograničeno⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | ograničeno⁸ |
| Automatska kompresija konteksta | ✓ | – | – | – |
| Paralelno DAG izvršavanje | ✓ | ograničeno⁹ | – | – |
| Mogućnost samostalnog hostanja, dostupan izvorni kod | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL za dinamičke podatke | ✓ | ✓ | ograničeno | ✓ |

> **Fusnote:** ¹ Zapier Knowledge Sources — nema izloženog vector storea ni kontrole embeddinga. ² Make.com ima Pinecone/Qdrant module, ali nema nativni RAG node. ³ n8n AI Workflow Builder je cloud-only beta s ograničenjem kredita. ⁴ n8n prikazuje međukorake; potpuni tracing zahtijeva alate trećih strana. ⁵ n8n podržava odobrenja AI poziva alata putem chata, e-pošte i kanala za suradnju, ali ne snima i ne nastavlja cijelo izvršavanje na način na koji to radi Heym. ⁶ Zapier Human in the Loop podržava odobrenja i prikupljanje podataka unutar Zapova, ali to nije sustav kontrolnih točaka s javnim pregledom i snimanjem/nastavljanjem. ⁷ Make.com nudi Human in the Loop kao Enterprise aplikaciju s zahtjevima za pregled i ishodima adjusted/approved/canceled, ali ostaje ograničen planom i manje agent-native. ⁸ n8n isporučuje namjenski Guardrails node, Zapier isporučuje AI Guardrails kroz svoje AI proizvode, a Make.com dokumentira pravila agenata i tokove pregleda, ali ne i usporedivu samostalnu značajku guardrailsa, pa je Make označen kao ograničen. ⁹ n8n prema zadanim postavkama izvršava sekvencijalno; paralelizam zahtijeva zaobilazna rješenja putem sub-workflowa. ¹⁰ Sustainable Use License — besplatno samostalno hostanje za internu upotrebu, komercijalna redistribucija ograničena. ¹¹ Od 22. travnja 2026. n8n službena dokumentacija opisuje HTTP batching i loop/wait obrasce, a ne nativnu LLM batch-status granu; službena dokumentacija Zapierove ChatGPT aplikacije ne navodi nikakve triggere i samo generičku beta verziju API Requesta; a službena stranica Makeove OpenAI integracije izlaže batch akcije poput create/watch completed, ali ne i prvoklasni LLM node sa statusnim grananjem, pa su n8n/Make označeni kao ograničeni, a Zapier kao nedostupan za ovaj konkretni obrazac Workflowa. ¹² n8n službena dokumentacija pokriva HTTP Webhook i HTTP Request nodeove te Code/custom/community proširivost, ali nisam mogao pronaći first-party WebSocket trigger/send node, pa je n8n označen kao ograničen. ¹³ Zapierova službena dokumentacija pokriva dolazne webhookove i odlazne webhook/API zahtjeve samo preko HTTP-a, a ne nativne WebSocket trigger ili send korake. ¹⁴ Makeova službena dokumentacija pokriva Webhooks module i HTTP(S) request module, ali nisam mogao pronaći nativni WebSocket trigger ili send modul. ¹⁵ n8n nema nativno praćenje troška LLM tokena; postoje community workaround Workflowi, ali zahtijevaju ručnu instalaciju i API pozive nakon izvršavanja (otvoren feature request od svibnja 2026.). Zapier ne izlaže korisnicima broj tokena ni USD trošak po izvršavanju; AI koraci troše samo zadatke. Make.comova nadzorna ploča kredita djelomično odražava potrošnju tokena za AI hostan na Makeu (od kolovoza 2025.), ali veze s API ključevima trećih strana naplaćuju se kao 1 operacija = 1 kredit bez brojanja tokena; nema raščlambe USD troška po modelu za pojedino izvršavanje. ¹⁶ Heym emitira nativne OpenTelemetry spanove (jedan po izvršavanju Workflowa plus jedan po nodeu) preko OTLP/HTTP na bilo koji kompatibilni backend, s W3C trace-context propagacijom i bez instrumentation koda, konfigurirano putem `HEYM_OTEL_*` env varijabli i prema zadanim postavkama onemogućeno. n8n ima dokumentiranu OpenTelemetry tracing integraciju za izvršavanja Workflowa i nodeova. Zapier i Make.com od lipnja 2026. ne dokumentiraju izvoz OpenTelemetryja za izvršavanja svojih Workflowa/scenarija. ¹⁷ n8n dokumentira Insights nadzornu ploču za metrike produkcijskog izvršavanja, Zapier dokumentira Zap History plus Task Usage, a Make.com dokumentira Scenario History; to su površine za nadzor/povijest, a ne prilagođeni widgeti nadzorne ploče podržani proizvoljnom logikom Workflowa poput Heymovog Dashboard taba. ¹⁸ Heym Workflow Analyzer pokreće Workflow kada je to moguće, čita rezultat izvršavanja i generira zajedničko izmjenjivo Markdown izvješće koje pokriva područja za poboljšanje, svrhu i ponašanje korak po korak. n8n dokumentira AI Workflow Builder za stvaranje/rafiniranje/debuggiranje Workflowa, Zapier dokumentira AI troubleshooting za Zap izvršavanja s greškama, a Make.com dokumentira povijest scenarija plus korake zaključivanja AI agenta, ali njihova javna dokumentacija ne opisuje isti dokument zajedničke analize Workflowa koji je svjestan izvršavanja. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) navodi izvršavanja koja su u tijeku i može učitati podatke iz prethodnog izvršavanja u editor, dok [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) izlaže stanje "running" u svom editoru. [Make Scenario History](https://help.make.com/scenario-history) dokumentira detalje izvršavanja i logove. Njihova javna dokumentacija, provjerena 18. srpnja 2026., ne opisuje Heymov točan tok: otvoriti proizvoljno produkcijsko izvršavanje u tijeku iz Historyja ili Kanban kartice, vratiti njegov trenutni snapshot nodea i nastaviti primati animaciju nodeova i Debug logove na istom platnu. ²⁰ Heymovi [Codex](../nodes/codex-node.md) i [OpenCode Go](../nodes/opencode-go-node.md) nodeovi pokreću pravi CLI coding agenta u izoliranom Heym radnom prostoru nad GitHub repozitorijem — clone, uređivanje, izrada diffa, push grane, otvaranje pull requesta — kao prvoklasni korak Workflowa. Od 20. srpnja 2026. nijedan konkurent ne dokumentira ekvivalent: n8n [OpenAI node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) pokriva chat/assistant API pozive, a ne coding agent na razini repozitorija, a nativna Codex podrška ostaje zahtjev zajednice; Zapierov vlastiti blog dokumentira obrnuti smjer — [Codex pokreće Zapier alate kroz Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — a ne Codex kao Zap korak; Make.comovi OpenAI moduli izlažu completions/assistants/batch akcije, a ne coding agent koji klonira repozitorije i otvara PR-ove. ²¹ Heymov [Board tab](../tabs/board-tab.md) ugrađena je agentic Kanban ploča čiji stupci izvršavaju Workflowe, a čije kartice nose kontekst, povijest razgovora, stanje izvršavanja i izvršavanja. n8n ([Kanban Tool integracija](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool integracije](https://zapier.com/apps/kanbantool/integrations)) i Make.com ([Kanban Tool integracija](https://www.make.com/en/integrations/kanban-tool)) samo se povezuju s kanban aplikacijama trećih strana poput Kanban Toola, Wekana ili NocoDB-a; nijedan od 20. srpnja 2026. ne dokumentira ugrađenu ploču koja pokreće vlastite Workflowe. ²² n8n interno pohranjuje binarne podatke izvršavanja (opcionalno na [S3-kompatibilnoj vanjskoj pohrani](https://docs.n8n.io/hosting/scaling/external-storage/)), ali ne dokumentira korisnički file drive s linkovima za dijeljenje ili timskim dijeljenjem, pa je označen kao ograničen. Zapierov [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) obrađuje datoteke samo tijekom izvršavanja Zapa, a [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) čuva male tekstualne vrijednosti, pa je Zapier označen kao ograničen. Make.comovi [data storeovi](https://help.make.com/l6du-data-stores) čuvaju strukturirane zapise, a njegovo [rukovanje datotekama](https://help.make.com/working-with-files) prenosi datoteke između aplikacija bez trajne ugrađene pohrane, pa je Make označen kao nedostupan. ²³ Heymov [Playwright node](../nodes/playwright-node.md) je first-party automatizacija preglednika s vizualnim načinom koraka, AI-generiranim koracima i načinom punog koda. n8n nudi samo community pakete poput [n8n-playwright](https://github.com/toema/n8n-playwright) uz još uvijek otvoren [feature request za nativne nodeove za automatizaciju preglednika](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), pa je označen kao ograničen. Zapier Agents mogu [pregledavati i čitati stranice putem web pregledavanja i Chrome ekstenzije](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), ali Zapier ne dokumentira nikakav skriptirani korak automatizacije preglednika, pa je označen kao ograničen. Make.com od 20. srpnja 2026. dokumentira HTTP module i aplikacije trećih strana za scraping, a ne bilo kakav nativni modul za automatizaciju preglednika.

## Povezano

- [Uvod](./introduction.md) – Pregled platforme
- [Brzi početak](./quick-start.md) – Izradite svoj prvi Workflow
- [Analiza Workflowa](../reference/workflow-analysis.md) – Generirajte zajednička izvješća o izvršavanju Workflowa i povratne informacije za poboljšanja
- [Kartica Dashboard](../tabs/dashboard-tab.md) – Izradite dashboarde podržane Workflowom s AI-generiranim widgetima za grafikone
- [Agent Node](../nodes/agent-node.md) – LLM Node s pozivanjem alata, MCP i vještinama
- [Arhitektura Agenta](../reference/agent-architecture.md) – Pod-agenti, orkestrator i dispečiranje alata
- [Kartica Board](../tabs/board-tab.md) – Agentna Kanban ploča sa stupcima koji izvršavaju Workflow
- [Codex Node](../nodes/codex-node.md) – Pokrenite OpenAI Codex coding agent na GitHub repozitoriju
- [OpenCode Go Node](../nodes/opencode-go-node.md) – Coding agent neovisan o pružatelju usluga u ojačanom kontejneru
- [Kartica Drive](../tabs/drive-tab.md) – Ugrađena pohrana datoteka s linkovima za dijeljenje, timovima i skupnim radnjama
- [Playwright Node](../nodes/playwright-node.md) – Automatizacija preglednika prvog reda s AI koracima i načinom rada s kodom
- [RAG / Vector Store Node](../nodes/rag-node.md) – Vektorska pretraga i umetanje dokumenata (Qdrant ili Postgres pgvector)
- [AI Assistant](../reference/ai-assistant.md) – Izrada Workflowa prirodnim jezikom
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Kontrolne točke Agenta s javnim URL-ovima za pregled
- [Guardrails](../reference/guardrails.md) – Blokirajte nesigurne Promptove prije nego stignu do vaših modela
- [Kartica Traces](../tabs/traces-tab.md) – Vidljivost LLM poziva
- [Kartica Evals](../tabs/evals-tab.md) – Testni paketi za AI Workflowe
- [Kartica Alerts](../tabs/alerts-tab.md) – Upozorenja o pragovima za greške, trajanje, troškove i obujam izvršavanja
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Izvoz spanova izvršavanja, Nodeova i alata putem OTLP-a
- [Raspodjela opterećenja](../reference/cluster.md) – Dijelite izvršavanja među instancama s prebacivanjem na lidera
- [Single Sign-On](../reference/sso.md) – Prijavite se putem bilo kojeg OpenID Connect pružatelja usluga
- [Audit Logging](../reference/audit.md) – Sigurnosno relevantne radnje s akterom, metom i ishodom
- [Portal](../reference/portal.md) – Objavite Workflowe kao javna chat sučelja
- [Paralelno izvršavanje](../reference/parallel-execution.md) – Istovremeno izvršavanje temeljeno na DAG-u
- [Kartica MCP](../tabs/mcp-tab.md) – Konfiguracija MCP poslužitelja i klijenta
