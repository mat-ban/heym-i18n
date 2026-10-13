# Filă MCP

Fila **MCP** configurează integrarea Model Context Protocol (MCP). MCP permite clienților AI (Claude, ChatGPT, Gemini, Cursor și orice instrument compatibil MCP) să apeleze workflow-urile Heym ca instrumente.

Heym acceptă două moduri: un **server implicit** care expune toate workflow-urile cu MCP activat sub un singur endpoint și **servere denumite** care oferă fiecărui grup logic de workflow-uri propriul URL dedicat și propria cheie API.

Ambele moduri pot expune două tipuri de instrumente: **workflow-uri** individuale și **instrumentul de chat Heym** — întregul motor din [fila Chat](./chat-tab.md) în spatele unui singur instrument `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Urmăriți demonstrația MCP</a></p>

## Server MCP implicit

Serverul implicit este întotdeauna disponibil la `{origin}/api/mcp/sse`. Toate workflow-urile cu MCP activat apar aici ca instrumente.

### Cheie API MCP

- Cheile sunt stocate ca digesturi SHA-256, astfel încât Heym nu vă poate afișa o cheie existentă. Fila indică dacă una este setată, nu care este aceasta.
- **Generate** / **Regenerate** – Cheia nouă este afișată o singură dată, imediat după creare. Copiați-o atunci; reîncărcarea filei o ascunde definitiv.
- Utilizați această cheie la conectarea Claude Desktop, Cursor sau a altor clienți MCP la Heym
- Ați pierdut o cheie? Regenerați-o. Cheia anterioară încetează să funcționeze imediat.

### Metode de conectare

- **API Key** – Utilizați cheia API MCP pentru conexiuni programatice. Fila poate copia o configurație JSON gata de utilizare și include un buton **Add to Cursor** pentru configurarea Cursor cu un singur clic.
- **Claude** – Fila afișează URL-ul serverului MCP și pașii de configurare pentru Claude. Lăsați OAuth Client ID și Secret necompletate; Claude se înregistrează automat și se autentifică prin Heym OAuth.
- **ChatGPT** – Fila afișează URL-ul serverului MCP și pașii de configurare pentru o aplicație ChatGPT. Activați modul dezvoltator, creați o aplicație cu URL-ul respectiv și alegeți OAuth; ChatGPT se înregistrează automat.
- **Gemini** – Fila afișează URL-ul serverului MCP și pașii de configurare pentru o aplicație personalizată Gemini: în gemini.google.com, accesați **Settings → Connected Apps → Add a custom app**, inserați URL-ul și lăsați **Advanced features** închis; Gemini se înregistrează automat și se autentifică prin Heym OAuth. Odată conectat, Heym funcționează și în aplicația mobilă Gemini.

### Comutator MCP pentru workflow

Fiecare workflow poate fi expus ca instrument MCP:

- **Enable** – Instrumentele workflow-ului devin disponibile tuturor clienților conectați la serverul implicit
- **Disable** – Workflow-ul nu este expus

Cardurile workflow-urilor afișează descrierea și o previzualizare a numelor câmpurilor de intrare, astfel încât să puteți vedea ce așteaptă fiecare instrument înainte de a-l activa.

## Instrumentul de chat Heym

Secțiunea **Heym Capabilities** transformă motorul filei Chat într-un singur instrument MCP numit `heym_chat`. Activați-l pe serverul implicit, pe orice server denumit sau pe ambele — fiecare suprafață își păstrează propriul comutator și propria selecție de model.

Când este activ, `heym_chat` apare în `tools/list` alături de instrumentele workflow-urilor dumneavoastră. Un client MCP trimite un singur mesaj în limbaj natural, iar motorul Heym preia controlul de acolo, cu aceleași capacități pe care le are fila Chat:

- Construiește un workflow, îl rulează de test cu intrări eșantion, îl corectează și finalizează când o rulare reușește (vezi [Modul Build](#build-mode))
- Inspectează și rulează workflow-urile existente
- Raportează analize, execuții recente și programări cron viitoare
- Raportează istoricul de rulare al unui workflow: de câte ori a rulat, numărul de stări, când a rulat și, la cerere, intrările, ieșirile și erorile per nod ale unei singure rulări
- Raportează ce rulează în acest moment: câte execuții sunt active, numele workflow-urilor lor, de cât timp rulează fiecare, nodul pe care se află în prezent fiecare și un link către rularea live
- Listează board-uri, creează carduri și citește detaliile cardurilor în [fila Board](./board-tab.md)
- Listează tabelele de date cu coloanele lor, creează altele noi și le conectează în workflow-urile pe care le construiește
- Citește echipele și variabilele globale și caută în documentație
- Aprobă, editează sau refuză recenziile în așteptare human-in-the-loop

Capacitățile adăugate ulterior filei Chat devin disponibile automat prin `heym_chat` — nu există un comutator per capacitate de menținut sincronizat.

### Modul Build

`heym_chat` rulează întotdeauna motorul Chat în modul build. Într-un singur apel, asistentul poate salva un workflow nou, îl poate rula cu intrări eșantion realiste, poate citi raportul rulării, poate repara ceea ce a eșuat și îl poate rula din nou, până la cinci rulări de test per apel. Când ultima rulare a ultimei salvări reușește, acesta încheie cu un rezumat de o propoziție, iar răspunsul se termină cu `Verified: the latest test run of the saved workflow passed.`

- Rulările de test sunt rulări reale. Efectele lor secundare au loc și apar în istoricul rulărilor workflow-ului ca orice altă rulare.
- Salvările urmează calea editorului: o modificare a grafului păstrează graful anterior în **Edit History** al workflow-ului.
- Pentru a modifica un workflow construit anterior, continuați firul cu același `conversation_id`. Asistentul actualizează acel workflow în loc să creeze unul nou și modifică doar workflow-urile pe care le puteți edita.
- Când cele cinci rulări de test sunt epuizate, asistentul se oprește și explică ce anume eșuează în continuare.

Credențialele rămân în interfață: `heym_chat` nu le listează, nu le alege și nu le creează niciodată. Când construiește sau editează un workflow, nodurile noi care necesită o credențială sunt lăsate goale, iar răspunsul le numește, astfel încât să le puteți seta în editor.

Tabelele de date sunt diferite. Un tabel nu conține secrete, astfel încât `heym_chat` poate lista tabelele dumneavoastră, poate întreba pe care ar trebui să îl utilizeze un workflow și poate crea unul nou cu coloanele sale. Nu citește și nu scrie niciodată rânduri.

### Credențială și model

`heym_chat` rulează motorul pe contul dumneavoastră Heym, astfel încât are nevoie de o credențială LLM proprie:

| Câmp | Comportament |
|-------|----------|
| **Credential** | Alegeți orice credențială OpenAI, Google sau Custom la care aveți acces. Precompletată din credențiala preferată din [Settings](../reference/user-settings.md) atunci când nu ați ales una. |
| **Model** | Încărcat din credențiala selectată. Precompletat din modelul dumneavoastră preferat atunci când credențiala corespunde. |

Dacă oricare dintre ele lipsește, instrumentul apare în continuare în `tools/list`, dar fiecare apel returnează o eroare care vă indică să finalizați configurarea în această filă.

### Argumente și istoric

| Argument | Obligatoriu | Descriere |
|----------|----------|-------------|
| `message` | Da | Instrucțiunea sau întrebarea, în limbaj natural. |
| `conversation_id` | Nu | Un `conversation_id` dintr-un rezultat `heym_chat` anterior, pentru a continua acel fir. |

Fiecare apel este scris în istoricul [filei Chat](./chat-tab.md) ca o conversație normală, marcată cu o pictogramă de ștecher în lista de conversații. Mesajele, cardurile instrumentelor și pauzele de clarificare arată exact ca o conversație pe care ați început-o dumneavoastră, iar puteți deschide firul și continua discuția în browser. Fiecare rezultat returnează `conversation_id`-ul său, astfel încât clientul MCP să poată continua același fir în loc să deschidă unul nou la fiecare apel.

Când asistentul are nevoie de clarificări, face o pauză și anunță acest lucru; răspundeți cu răspunsurile utilizând același `conversation_id`.
## Servere MCP cu nume

Serverele cu nume permit segmentarea workflow-urilor în endpoint-uri MCP izolate. Fiecare server are propriul URL și propria cheie API, astfel încât diferiți clienți AI, echipe sau cazuri de utilizare se pot conecta exact la workflow-urile de care au nevoie.

### Crearea unui server cu nume

1. Introduceți un nume în câmpul de introducere din partea de jos a filei MCP (de ex. **CRM Tools**)
2. Faceți clic pe **Create** — un card de server nou apare imediat
3. Faceți clic pe card pentru a-l extinde

### Setări per server

Fiecare card de server afișează:

| Setare | Descriere |
|---------|-------------|
| **SSE Endpoint** | URL unic: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Cheie independentă, afișată o singură dată la generare sau regenerare. Copiați-o imediat; este stocată sub formă de hash și nu mai poate fi dezvăluită ulterior |
| **How to connect** | **Copy JSON** copiază configurația MCP gata de lipit; **Add to Cursor** o instalează cu un singur clic |
| **Heym Capabilities** | Activați/dezactivați instrumentul `heym_chat` pentru acest server și alegeți credențialele și modelul acestuia |
| **Assigned Workflows** | Activați/dezactivați care dintre workflow-urile dumneavoastră sunt expuse de acest server |

### Atribuirea workflow-urilor

Atribuirea workflow-urilor este per server și independentă de comutatorul serverului implicit. Un workflow poate fi activat simultan pe serverul implicit și pe mai multe servere cu nume, sau pe niciunul.

Comutarea unui workflow îl mută în partea de sus a listei atribuite, astfel încât rândul pe care tocmai l-ați modificat rămâne vizibil în loc să fie derulat în afara ecranului.

### Autentificare

Serverele cu nume acceptă aceleași metode de autentificare ca serverul implicit:

- **Header X-MCP-Key** – Transmiteți direct cheia API a serverului (clienți API, Cursor). Doar prin header: cheile nu sunt acceptate ca parametru de interogare `?key=`, deoarece URL-urile ajung în jurnalele de acces, jurnalele proxy și istoricul browserului.
- **Claude, ChatGPT și Gemini OAuth** – Adăugați URL-ul serverului în conectorii sau aplicațiile personalizate ale clientului; lăsați credențialele necompletate și clientul se înregistrează automat prin OAuth. Token-ul bearer trebuie transmis în header-ul `Authorization`, nu ca `?token=`.
- **Session token** – Emis în timpul handshake-ului SSE; limitat la serverul specific, astfel încât token-urile de la un server cu nume nu pot accesa altul. Acest parametru `?session=` de scurtă durată nu este afectat.

### Ștergerea unui server cu nume

Faceți clic pe pictograma **X** din antetul cardului serverului. Ștergerea elimină serverul și toate atribuirile sale de workflow-uri; workflow-urile în sine nu sunt afectate.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Ambele endpoint-uri acceptă transportul SSE (GET, MCP spec 2024-11-05) și transportul Streamable HTTP (POST, MCP spec 2025-03-26). Claude, ChatGPT și Gemini utilizează OAuth 2.1 / PKCE pentru autentificare securizată pe ambele.

## Resurse conexe

- [Why Heym](../getting-started/why-heym.md) – MCP ca primitiv de primă clasă în Heym
- [Agent Node](../nodes/agent-node.md) – Nod Agent cu suport pentru instrumente MCP
- [Agent Architecture](../reference/agent-architecture.md) – Client MCP, dispecerizarea instrumentelor, orchestrator
- [Triggers](../reference/triggers.md) – MCP ca punct de intrare în workflow
- [Chat Tab](./chat-tab.md) – Motorul din spatele instrumentului `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Crearea și gestionarea workflow-urilor
- [Node Types](../reference/node-types.md) – Prezentare generală a nodurilor AI
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid compact de pagină pentru suprafețele dashboard-ului
