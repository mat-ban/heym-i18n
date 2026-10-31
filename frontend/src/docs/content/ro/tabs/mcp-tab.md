# Filă MCP / A2A / A2A

Fila **MCP** configurează integrarea Model Context Protocol (MCP), și ca servere [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) cărora alți agenți le pot delega sarcini. MCP permite clienților AI (Claude, ChatGPT, Gemini, Cursor și orice instrument compatibil MCP) să apeleze workflow-urile Heym ca instrumente.

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


### Rulări în coadă și heym_execution_status

Un workflow cu o [limită de concurență](../reference/webhooks.md#concurrency-limit-and-queued-runs) poate fi ocupat atunci când un client îl apelează. Apelul returnează imediat un rezultat care nu este o eroare:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Clientul interoghează instrumentul `heym_execution_status` cu acel `execution_id`. Acesta returnează același corp ca și [URL-ul de stare](../reference/webhooks.md#status-url): `queued` cu poziția curentă, `running`, apoi `success` sau `error` cu ieșirile. Găsește doar rulările workflow-urilor expuse de același server. Instrumentul este afișat pe serverul implicit și pe fiecare server numit doar atâta timp cât cel puțin unul dintre workflow-urile sale are o limită de concurență. Când coada este plină, apelul returnează eroarea „Concurrency queue is full”.
## Agent Heym

Secțiunea **Heym Capabilities** transformă motorul filei Chat într-un singur instrument MCP numit `heym_chat`. Activați-l pe serverul implicit, pe orice server denumit sau pe ambele — fiecare suprafață își păstrează propriul comutator și propria selecție de model.

Când este activ, `heym_chat` apare în `tools/list` alături de instrumentele workflow-urilor dumneavoastră. Un client MCP trimite un singur mesaj în limbaj natural, iar motorul Heym preia controlul de acolo, cu aceleași capacități pe care le are fila Chat:

- Construiește un workflow, îl rulează de test cu intrări eșantion, îl corectează și finalizează când o rulare reușește (vezi [Modul Build](#build-mode))
- Inspectează și rulează workflow-urile existente
- Raportează analize, execuții recente și programări cron viitoare
- Explicarea locurilor unde eșuează fluxurile de lucru și a motivelor pentru care sunt lente: fluxurile cele mai rulate, cu cele mai multe eșecuri și cele mai lente, precum și tipurile de noduri cu cel mai mult timp, erori și apeluri în ultimele 1, 3 sau 6 ore, 24 de ore, 7 sau 30 de zile sau din toate timpurile
- Raportează istoricul de rulare al unui workflow: de câte ori a rulat, numărul de stări, când a rulat și, la cerere, intrările, ieșirile și erorile per nod ale unei singure rulări
- Raportează ce rulează în acest moment: câte execuții sunt active, numele workflow-urilor lor, de cât timp rulează fiecare, nodul pe care se află în prezent fiecare și un link către rularea live
- Listează board-uri, creează carduri și citește detaliile cardurilor în [fila Board](./board-tab.md)
- Listarea tablourilor de bord (paginile Heym Work) și a widgeturilor acestora, identificarea tabloului de bord pe care se află un flux de lucru, adăugarea unui nou widget și construirea fluxului său de lucru, plasarea unui flux de lucru existent ca widget, redenumirea sau ștergerea widgeturilor ori organizarea aspectului (consultați [Dashboard › Din Chat și MCP](./dashboard-tab.md#from-chat-and-mcp))
- Inspectarea tabelelor de date și a rândurilor, crearea tabelelor, adăugarea sau eliminarea coloanelor, inserarea, actualizarea sau ștergerea rândurilor și conectarea tabelelor în fluxurile de lucru
- Crearea, editarea și rularea suitelor de evaluare a prompturilor și a agenților ([Eval suites](./evals-tab.md#from-chat-and-mcp)), inclusiv linia de bază a unui agent: raportată, construită din rulări sau specificată numeric. Rezultatul listează linkul Evals al fiecărei suite salvate.
- Creați sau actualizați credențialele pe pagina dedicată Heym (consultați [Credențiale](#credențiale))
- Citește echipele și variabilele globale și caută în documentație
- Aprobă, editează sau refuză recenziile în așteptare human-in-the-loop

Capacitățile adăugate ulterior filei Chat devin disponibile automat prin `heym_chat` — nu există un comutator per capacitate de menținut sincronizat.

Aceste capacități rulează în interiorul `heym_chat`: `tools/list` afișează `heym_chat` și instrumentele fluxurilor dvs. de lucru, niciodată instrumentele interne ale chatului, cum ar fi cele ale suitelor de evaluare.

### Modul Build

`heym_chat` rulează întotdeauna motorul Chat în modul build. Într-un singur apel, asistentul poate salva un workflow nou, îl poate rula cu intrări eșantion realiste, poate citi raportul rulării, poate repara ceea ce a eșuat și îl poate rula din nou, până la cinci rulări de test per apel. Când ultima rulare a ultimei salvări reușește, acesta încheie cu un rezumat de o propoziție, iar răspunsul se termină cu `Verified: the latest test run of the saved workflow passed.`

Când un apel creează sau editează un workflow, răspunsul listează fiecare dintre ele cu linkul său complet către editor, cum ar fi `https://heym.example.com/workflows/<id>`, iar linkurile din răspunsul asistentului sunt, de asemenea, linkuri complete. Acestea folosesc adresa dvs. Heym configurată (`FRONTEND_URL`) și se deschid pentru persoanele conectate la Heym care au acces la acel workflow.

- Rulările de test sunt rulări reale. Efectele lor secundare au loc și apar în istoricul rulărilor workflow-ului ca orice altă rulare.
- Salvările urmează calea editorului: o modificare a grafului păstrează graful anterior în **Edit History** al workflow-ului.
- Pentru a modifica un workflow construit anterior, continuați firul cu același `conversation_id`. Asistentul actualizează acel workflow în loc să creeze unul nou și modifică doar workflow-urile pe care le puteți edita.
- Când cele cinci rulări de test sunt epuizate, asistentul se oprește și explică ce anume eșuează în continuare.

Tabelele de date sunt diferite. Un tabel nu conține secrete, astfel încât `heym_chat` poate lista tabelele dumneavoastră, poate întreba pe care ar trebui să îl utilizeze un workflow și poate crea unul nou cu coloanele sale. Nu citește și nu scrie niciodată rânduri.

### Credențiale

`heym_chat` vede credențialele pe care le dețineți și pe cele partajate cu dvs., după nume și tip, la fel ca fila Chat. Când un workflow pe care îl construiește are nevoie de o credențială, întreabă pe care să o folosească printr-o întrebare în rezultat. Răspundeți cu același `conversation_id`.

Pentru a adăuga o credențială sau pentru a actualiza una proprie, asistentul deschide formularul de credențiale Heym pe o pagină Heym, `/credentials/setup/<id>`. Vă conectați acolo la Heym, introduceți cheia sau conectați contul și salvați. Valoarea merge direct la Heym: clientul MCP și modelul său află doar numele și tipul credențialei. Nu lipiți chei în clientul MCP; cereți în schimb formularul.

| Client | Ce se întâmplă |
|--------|----------------|
| Suportă elicitarea URL MCP | Clientul vă solicită să deschideți pagina Heym. Apelul așteaptă în timp ce completați formularul, până la zece minute, apoi continuă cu noua credențială. |
| Oricare altul | Rezultatul conține linkul și solicită clientului să apeleze din nou `heym_chat` cu `wait_for_credential_form`. Acel apel așteaptă până la cinci minute în timp ce completați formularul, apoi reia conversația. Dacă clientul nu așteaptă, salvați formularul și răspundeți cu același `conversation_id`; următorul apel va ști că formularul a fost salvat și ce credențială a creat. |

Pagina se deschide doar pentru contul Heym care a inițiat cererea, astfel încât un link redirecționat este inutil pentru oricine altcineva. Un formular rămâne deschis timp de 24 de ore și îl puteți refuza de pe pagină. Odată ce îl salvați sau îl refuzați, pasul din conversația filei Chat arată rezultatul.


### Credențială și model

`heym_chat` rulează motorul pe contul dumneavoastră Heym, astfel încât are nevoie de o credențială LLM proprie:

| Câmp | Comportament |
|-------|----------|
| **Credential** | Alegeți orice credențială OpenAI, Google sau Custom la care aveți acces. Precompletată din credențiala preferată din [Settings](../reference/user-settings.md) atunci când nu ați ales una. |
| **Model** | Încărcat din credențiala selectată. Precompletat din modelul dumneavoastră preferat atunci când credențiala corespunde. |

Dacă oricare dintre ele lipsește, instrumentul apare în continuare în `tools/list`, dar fiecare apel returnează o eroare care vă indică să finalizați configurarea în această filă.


Nodurile LLM și Agent dintr-un workflow construit de `heym_chat` rulează pe această credențială și acest model, inclusiv o credențială partajată cu dvs., astfel încât rulările de testare să funcționeze fără un alt pas de configurare. Când `heym_chat` editează un workflow, nodurile LLM și Agent care au deja o credențială o păstrează împreună cu modelul lor.
### Argumente și istoric

| Argument | Obligatoriu | Descriere |
|----------|----------|-------------|
| `message` | Da | Instrucțiunea sau întrebarea, în limbaj natural. |
| `conversation_id` | Nu | Un `conversation_id` dintr-un rezultat `heym_chat` anterior, pentru a continua acel fir. |
| `wait_for_credential_form` | Nu | Cu `conversation_id`: așteptați până când utilizatorul salvează sau refuză formularul de credențiale deschis de fir, apoi trimiteți `message`. |

Fiecare apel este scris în istoricul [filei Chat](./chat-tab.md) ca o conversație normală, marcată cu o pictogramă de ștecher în lista de conversații. Mesajele, cardurile instrumentelor și pauzele de clarificare arată exact ca o conversație pe care ați început-o dumneavoastră, iar puteți deschide firul și continua discuția în browser. Fiecare rezultat returnează `conversation_id`-ul său, astfel încât clientul MCP să poată continua același fir în loc să deschidă unul nou la fiecare apel.

Când asistentul are nevoie de clarificări, face o pauză și anunță acest lucru; răspundeți cu răspunsurile utilizând același `conversation_id`.
### Activați A2A

Cât timp Agentul Heym este activat, cardul afișează caseta de selectare **Activați A2A**. Bifați-o și alți agenți vor putea trimite sarcini Agentului Heym prin protocolul Agent2Agent (A2A 1.0). Cardul listează apoi adresa URL a **Agent Card** și **endpoint-ul JSON-RPC**, fiecare cu un buton de copiere, și o comandă `curl` care preia cardul. A2A utilizează aceeași cheie și conectare OAuth ca MCP. Dezactivarea agentului dezactivează și A2A. Consultați [A2A](../reference/a2a.md) pentru metode, stările sarcinilor și un exemplu practic.

### Progres

Un apel prelungit `heym_chat` raportează activitatea agentului ca progres MCP (`notifications/progress`), în aceiași termeni afișați în fila Chat, de exemplu `Se testează fluxul de lucru · încercarea 2/5`. Clienții care își resetează timpul de expirare la fiecare notificare de progres continuă să aștepte în timp ce agentul lucrează.

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
| **Heym Capabilities** | Comutați Agentul Heym (`heym_chat`) pentru acest server și alegeți credențialul și modelul |
| **Activați A2A** | Comutator A2A dedicat acestui server, cu propriul său Agent Card la `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Activați A2A** | Comutator A2A dedicat acestui server, cu propriul său Agent Card la `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
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