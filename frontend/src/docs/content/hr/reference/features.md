# Heym Cjeloviti Skup Značajki

Sveobuhvatan pregled svih mogućnosti Heym-a. Svaki odjeljak opisuje značajku ili koncept u nekoliko rečenica.

---

## Uvod

### [Uvod](../getting-started/introduction.md)

Heym je infrastruktura za pokretanje i upravljanje AI agentima u produkciji. Gradite agentske sustave na vizualnom platnu i pokrećete ih s povjerenjem: orkestrirajte agente, automatizirajte poslovne procese, pregledavajte svako izvršavanje i zadržite ljudsku kontrolu na vlastitoj infrastrukturi. Podržava vizualne workflows, AI-pokretane čvorove ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Asistenta](./ai-assistant.md), integracije ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), dolazne [IMAP Trigger](../nodes/imap-trigger-node.md) e-pošte, odlazne [Send Email](../nodes/send-email-node.md)), raspoređivanje s [Cron](../nodes/cron-node.md) i [Portal](./portal.md) chat portale za krajnje korisnike.

Pogledajte također [Osnovni Koncepti](../getting-started/core-concepts.md), [Tipovi Čvorova](./node-types.md) i [Integracije Trećih Strana](./integrations.md).

### [Zašto Heym](../getting-started/why-heym.md)

Zašto Heym prati životni ciklus agenta (izgradnja, orkestracija, pokretanje, promatranje, evaluacija, kontrola, izlaganje) i pokazuje što jedan samostalno hostani runtime obrađuje u svakoj fazi. To pokriva [LLM](../nodes/llm-node.md) čvor i [Agent Node](../nodes/agent-node.md) s pozivima alata, Python alatima, [MCP](../tabs/mcp-tab.md) vezama, vještinama i višekratnom orkestracijom agenata; okidače, ponovne pokušaje i [distribuciju opterećenja](./cluster.md); [Izvršavanja](../tabs/traces-tab.md) s troškom po izvođenju u USD i OpenTelemetry izvoz; [Evaluacije](../tabs/evals-tab.md); [kontrolne točke ljudske revizije](./human-in-the-loop.md), zaštitne mjere, SSO i trag revizije; te REST, MCP i Portal krajnje točke. Usporedba mogućnosti s n8n, Zapier i Make.com zatvara stranicu.

Pogledajte također [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) i [Arhitektura Agenta](./agent-architecture.md).

### [Brzi Početak](../getting-started/quick-start.md)

Pokrenite svoj prvi workflow u nekoliko minuta: kreirajte workflow iz [Workflows](../tabs/workflows-tab.md) taba, dodajte [Input](../nodes/input-node.md) čvor, [LLM](../nodes/llm-node.md) čvor i [Output](../nodes/output-node.md) čvor, a zatim ih povežite. Konfigurirajte [LLM](../nodes/llm-node.md) s vjerodajnicom i postavite `userMessage` na `$input.text`; koristite Run ili [AI Asistenta](./ai-assistant.md) za izvršavanje ili generiranje workflows-a s prirodnim jezikom.

Prirodno se kombinira s [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) i [Expression DSL](./expression-dsl.md).

### [Osnovni Koncepti](../getting-started/core-concepts.md)

Workflows su usmjereni grafovi čvorova povezani rubovima; izvršavanje teče od okidačkih čvorova ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) kroz procesne čvorove do [Output](../nodes/output-node.md) čvorova. Svaki čvor ima tip, podatke (konfiguraciju) i ulaze/izlaze; rubovi definiraju protok podataka. Čvorovi referenciraju uzvodne podatke putem [Expression DSL](./expression-dsl.md) izraza kao što su `$nodeLabel.field`; neovisni čvorovi automatski se izvršavaju u [paraleli](./parallel-execution.md).

Pogledajte također [Okidače](./triggers.md), [Paralelno Izvršavanje](./parallel-execution.md) i [Struktura Workflows-a](./workflow-structure.md).

### [Pokretanje i Implementacija](../getting-started/running-and-deployment.md)

Heym pruža `run.sh` za lokalni razvoj (baza podataka u Dockeru, FastAPI backend, Vite frontend) i `deploy.sh` za produkciju s Docker Compose. Oba koriste `.env` datoteku; ključne varijable uključuju `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` i `ALLOW_REGISTER`. Razvoj se odvija na konfigurabilnim frontend i backend portovima; produkcija poslužuje API pod `/api` kroz frontend kontejner.

Pogledajte također [Sigurnost](./security.md), [Poduzeće](./enterprise.md) i [Postavke](./user-settings.md).

### [Migracija na Heym](../getting-started/migrate-to-heym.md)

AI Convert alat pretvara workflow s druge platforme (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) ili opis na običnom engleskom jeziku u Heym workflow, koji se uživo prenosi na platnu i spreman je za [preuzimanje i uvoz](./download-import.md). Provodi AI sigurnosnu provjeru, a zatim generira DSL s postavljenim ulaznim i ograničenjima brzine. Otvorite ga na [heym.run/convert](https://heym.run/convert).

Pogledajte također [Brzi Početak](../getting-started/quick-start.md), [Preuzimanje i Uvoz](./download-import.md) i [AI Asistenta](./ai-assistant.md).

---

## Čvorovi

### Okidači
#### [Input](../nodes/input-node.md)

Input čvor je ulazna točka za workflows koji primaju podatke od korisnika ili API pozivača. Podržava jedno ili više ulaznih polja i izlaže metapodatke zahtjeva (zaglavlja, parametre upita). Pristupite poljima tijela putem `$nodeLabel.body.fieldKey`, zaglavljima putem `$nodeLabel.headers`, a parametrima upita putem `$nodeLabel.query`.

Prirodno se kombinira s [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) i [Output](../nodes/output-node.md). Za reference na payload i pristup poljima, pogledajte [Expression DSL](./expression-dsl.md) i [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Cron čvor pokreće workflow prema rasporedu koristeći standardni izraz cron s pet polja. Nema potrebe za korisničkim unosom—workflow se automatski pokreće u određeno vrijeme (npr. svakih sat vremena, dnevno, svake 15 minuta). Izlaz je događaj okidača bez payloada.

Pogledajte također [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) i [Execution History](./execution-history.md) za raspoređene i odgođene izvršavanja.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

IMAP Trigger čvor provjerava inbox u konfigurabilnom minutnom intervalu i pokreće workflow za svaki novodetekti email. Izlaz su analizirana zaglavlja, popisi pošiljatelja i primatelja, plain-text i HTML tijela, metapodaci o privicima i vremenska oznaka okidača. Koristite ga za triage podrške, usmjeravanje mailbox-a na [Slack](../nodes/slack-node.md) ili odobravanje putem emaila s [Human-in-the-Loop](./human-in-the-loop.md).

Prirodno se kombinira s [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) i [Slack](../nodes/slack-node.md) za inbound triage i odgovarajuće workflows.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Heym Trigger čvor pokreće workflow kada Heym sam objavi događaj platforme: `heym.started`, `workflow.created`, `workflow.updated` ili `workflow.deleted`. Dostava je grupirana - svaki događaj objavljen unutar jednog petosekundnog prozora dolazi u jednom izvršavanju kao `$nodeLabel.events`, uvijek kao niz. Svaki događaj se preuzima putem jedinstvene baze podataka, tako da se aktivira točno jednom po čvoru koji se pretplatio, bez obzira na to koliko radnika, kontejnera ili strojeva radi. Koristite ga za revizijske tragove promjena workflow-a, obavijesti o implementaciji i sažetke zdravlja instance.

Prirodno se kombinira s [Heym](../nodes/heym-node.md) čvorom za pretraživanje promijenjenog workflow-a, i s [Loop](../nodes/loop-node.md) za djelovanje jednom po događaju.

#### [Heym](../nodes/heym-node.md)

Heym čvor čita vlastite podatke Heyma kroz tri operacije: `listWorkflows` vraća svaki workflow kojem vlasnik može pristupiti s brojem čvorova i vremenskim oznakama, `getWorkflow` vraća strukturu čvora i rubova jednog workflow-a, a `getExecutionHistory` vraća unose povijesti izvršavanja, najnovije prvo, s opcionalnim filtrima za status, vremenski prozor i ograničenje, uz ukupne rezultate grupirane prema statusu. Rezultati su ograničeni na vlasnika workflow-a u kojem se čvor nalazi, tako da izvršavanje pokrenuto cron-om, portalom ili događajem vraća iste podatke kao ručno izvršavanje. `getWorkflow` vraća punu konfiguraciju čvora, što omogućava reviziju workflow-a za hardkodirane ključeve ili tokene; ne izlaže ništa što vlasnik workflow-a već ne bi mogao otvoriti u uređivaču. Nema potrebe za vjerodajnicama.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

WebSocket Trigger čvor otvara izlaznu klijentsku vezu s vanjskim WebSocket poslužiteljem i pokreće workflow na `onMessage`, `onConnected` ili `onClosed`. Izlaže analizirane payload poruke, stanje ponovnog povezivanja, metapodatke o zatvaranju i URL soketa za downstream izraze.

Prirodno se kombinira s [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) i [SSE Streaming](./sse-streaming.md) za integracije u stvarnom vremenu.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Telegram Trigger čvor prima ažuriranja bot webhook-a i odmah pokreće workflow. Izlaže puni payload ažuriranja, primarni objekt poruke, povratne upite, sanitizirana zaglavlja i vremensku oznaku okidača. Koristite ga za chatbote, AI asistente u [Telegram](../nodes/telegram-node.md) i tokove vođene gumbima.

Prirodno se kombinira s [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) i [Webhooks](./webhooks.md) za workflow-e vođene botovima.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Slack Trigger čvor prima webhooks Slack Events API-ja i automatski pokreće workflow nakon provjere potpisa zahtjeva. Izlaže payload događaja i sanitizirana zaglavlja za downstream usmjeravanje, [LLM](../nodes/llm-node.md)-temeljenu klasifikaciju i tokove odgovora.

Prirodno se kombinira s [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) i [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Discord Trigger čvor prima webhooks Discord Interactions API-ja, provjerava Ed25519 potpise s odabranom vjerodajnicom `discord_trigger` i pokreće workflow. Izlaže puni payload interakcije, podatke o naredbi, sanitizirana zaglavlja i metapodatke okidača za downstream usmjeravanje ili odgovore.

Prirodno se kombinira s [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) i [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ čvor šalje ili prima poruke iz RabbitMQ redova i razmjena. Koristite ga za workflows vođene porukama i obradu događaja. Način slanja objavljuje poruku s opcionalnim kašnjenjem; način primanja djeluje kao [trigger](./triggers.md) tako da workflow započinje kada poruka stigne. Izlaz uključuje status, message_id i tijelo.

Uparuje se s [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) i [Parallel Execution](./parallel-execution.md) za obradu vođenu događajima.

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler čvor automatski se pokreće kada bilo koji čvor u workflow-u ne uspije. Nema potrebe za dolaznim rubovima; aktivira ga motor. Izlaz uključuje poruku o grešci, oznaku neuspjelog čvora, tip čvora i vremensku oznaku. Koristite ga za slanje obavijesti putem [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) ili [Send Email](../nodes/send-email-node.md), bilježenje grešaka ili vraćanje prilagođenih odgovora na greške.

Kao alternativu rješavanju grešaka na platnu, workflow također može delegirati neuspjehe na zaseban workflow — pogledajte [Error Workflow](#error-workflow). Ako platno već sadrži Error Handler čvor, error workflow se **ne** poziva (lokalni handler ima prednost).

Uobičajeni ciljevi obavijesti su [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) i [Send Email](../nodes/send-email-node.md); detalje izvođenja lakše je pregledati u [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent čvor je [LLM](../nodes/llm-node.md) čvor s pozivima alata. Može pokretati Python alate, pozivati povezane čvorove na platnu kao alate, povezivati se s [MCP](../tabs/mcp-tab.md) poslužiteljima, koristiti vještine (datoteke s uputama i opcionalne Python skripte), djelovati kao orkestrator koji delegira drugim agent čvorovima i pozivati druge workflows kao alate. Izlaz je dostupan kao `$nodeLabel.text`. Opcionalni **Extra Body** prekidač pridružuje JSON objekt specifičnih parametara zahtjeva za pružatelje svakoj zahtjevu u petlji poziva alata; prema zadanim postavkama je isključen. Opcionalni **Use Responses API** prekidač usmjerava pozive modela agenta kroz Responses API, koji čuva razmišljanje modela tijekom poziva alata tako da model razmišljanja zadržava svoj tijek misli kroz višekratnu petlju; prema zadanim postavkama je isključen i radi s OpenAI i prilagođenim vjerodajnicama.

Alati čvora na platnu omogućuju agentu da izravno poziva konfigurirane čvorove workflow-a s platna. Povežite podržani čvor s alatom agenta, a zatim označite određena polja kao polja koja pruža agent s ikonom bota. Ta polja postaju parametri alata tijekom izvođenja, dok vjerodajnice i neoznačena polja ostaju fiksna u konfiguraciji čvora.

Odjeljak Vještine sada uključuje **AI Build** za stvaranje novih vještina, akciju za uređivanje AI u retku za postojeće vještine, preuzimanje ZIP-a po vještini i opcionalni **Enable Drive files** prekidač za vještine koje trebaju čitati Heym Drive datoteke tijekom izvođenja. Modalni prozor Skill Builder struji razgovor u chatu s lijeve strane, prihvaća datoteke povlačenjem i ispuštanjem uz svaki komentar za fino podešavanje, prikazuje pregled generiranih `SKILL.md` i `.py` datoteka s desne strane u načinu samo za čitanje, može preuzeti taj pregled kao ZIP i sprema učitane datoteke za fino podešavanje kao povezane vještine kroz isti postupak unosa ZIP-a koji se koristi za ručna učitavanja.

Uz **[Agent Persistent Memory](./agent-persistent-memory.md)** omogućeno, svaki agent čvor zadržava vlastitu grafikon znanja: činjenice se učitavaju u sustavnu uputu kada nisu prazne, a uspješni izvozi pokreću pozadinsko spajanje novih entiteta i odnosa. Pod-agenti koriste odvojene grafove. Možete **dijeliti** graf agenta s drugim agentima (istim ili drugim workflow-ima) s pristupom samo za čitanje ili čitanje/pisanje iz dijaloga grafova. Kontrola mozga platna otvara uređivač grafova.

Agent čvorovi također mogu ući u [Human-in-the-Loop](./human-in-the-loop.md) način rada. U ovom načinu agent dobiva `request_human_review` alat i može pauzirati na specifičnim koracima koji zahtijevaju odobrenje, stvoriti jednokratnu javnu vezu za pregled, izložiti `review` granu platna za tokove obavijesti i čekati dok recenzent ne prihvati, izmijeni ili odbije tekst pregleda u Markdown-u. HITL polje čvora djeluje kao smjernice za odobrenje kada pitati, dok se sažetak usmjeren prema recenzentu generira iz svakog zahtjeva za pregled. Za [MCP](../tabs/mcp-tab.md) alate, Heym koristi model za tumačenje tih pisanih uputa u `always`, `once` ili `never`, tako da slobodni jezik odobrenja mapira na konkretne politike izvođenja. Izvođenje je označeno kao `pending` i nastavlja se iz pohranjene snimke izvođenja nakon što odluka stigne, a isto izvođenje agenta može pauzirati više od jednom ako kasniji koraci također zahtijevaju pregled.

Agent čvorovi automatski komprimiraju svoju akumuliranu povijest poruka kada se približi 80% kontekstnog prozora modela. Sustavna uputa, prva korisnička poruka i najnovija korisnička poruka uvijek se čuvaju; sve između se sažima koristeći isti model i vjerodajnice. Događaji kompresije vidljivi su u Debug panelu, [Execution History](./execution-history.md) i na [Traces](../tabs/traces-tab.md) kartici.

Pogledajte također [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) i [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Codex čvor pokreće OpenAI Codex CLI unutar izoliranog Heym radnog prostora. Prihvaća Codex vjerodajnicu (prijavite se s ChatGPT-om kako biste koristili svoju pretplatu bez troškova API-a po tokenu, ili zalijepite pristupni token), GitHub vjerodajnicu, URL repozitorija, osnovnu granu, zadatak prompt, način objave (`diff_only` ili `draft_pr`), naziv grane i vrijeme trajanja. Izvršitelj lokalno klonira repozitorij, prosljeđuje paket tokena ChatGPT-a ili `CODEX_ACCESS_TOKEN` samo Codex procesu, i vraća strukturirani sažetak, bilješke o validaciji, promijenjene datoteke, diff, metapodatke o korištenju i opcionalni URL za nacrt PR-a.

Kada Codex vrati `needs_input`, workflow se pauzira i izlaže `question` granu. Povežite tu granu sa Slack-om, e-poštom ili drugim čvorom za obavijesti; javna poveznica za nastavak ponovo pokreće spremljenu snimku izvršenja nakon što je odgovor poslan. Codex čvor se također može povezati s AI Agentom kao alat, omogućujući agentu da delegira zadatke kodiranja; kao alat, rezultat `needs_input` se vraća unutar agenta umjesto da pauzira workflow.

Pogledajte također [GitHub](../nodes/github-node.md), [Vjerodajnice](./credentials.md), [Dijeljenje vjerodajnica](./credentials-sharing.md) i [Tipovi čvorova](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go čvor pokreće OpenCode CLI (Go) protiv GitHub repozitorija. Izolacija slijedi Codex obrazac: lokalno se pokreće kao podproces domaćina, dok Docker implementacije pokreću unutar ojačanog kontejnera koji dijeli volumen radnog prostora. Prihvaća OpenCode Go vjerodajnicu (ključ API-a s opcionalnim osnovnim URL-om), GitHub vjerodajnicu, URL repozitorija, osnovnu granu, zadatak prompt, način objave, naziv grane, vrijeme trajanja i model `opencode-go/<model>` odabran iz aktivnog, pretraživog popisa modela (s ugrađenim rezervnim rješenjem). Heym obavlja sve git/GitHub operacije na domaćinu i nikada ne stavlja GitHub token unutar sandbox-a; OpenCode samo uređuje datoteke na disku. Čvor vraća strukturirani sažetak, bilješke o validaciji, promijenjene datoteke, diff i opcionalni URL za pull request. Može se povezati s AI Agentom kao alat.

Pogledajte također [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Vjerodajnice](./credentials.md), [Dijeljenje vjerodajnica](./credentials-sharing.md) i [Tipovi čvorova](./node-types.md).

#### [LLM](../nodes/llm-node.md)

LLM čvor obrađuje tekst s jezičnim modelom ili generira slike. Podržava generaciju teksta, viziju (ulaz slike), generaciju slika, strukturirani JSON izlaz, izvršavanje Batch API-a specifičnog za pružatelja za podržane OpenAI i OpenAI-kompatibilne krajnje točke, i opcionalni **Use Responses API** prekidač koji usmjerava poziv kroz Responses API umjesto Chat Completions (isključeno prema zadanim postavkama; radi s OpenAI i prilagođenim vjerodajnicama, i ne može se kombinirati s Batch načinom). Konfigurirajte vjerodajnicu, model, sistemske i korisničke poruke, temperaturu i maksimalne tokene; koristite [Expression DSL](./expression-dsl.md) u promptima. U batch načinu `userMessage` mora se riješiti u niz, čvor emitira `batchStatus` granu s ažuriranjima napretka, a konačni izlaz uključuje rezultate po stavci. Opcionalni **Extra Body** prekidač pridružuje JSON objekt specifičnih parametara zahtjeva pružatelja (na primjer `{"thinking": {"type": "disabled"}}`) svakom API pozivu; prema zadanim postavkama je isključen. Opcionalni [Guardrails](./guardrails.md) blokiraju nesiguran sadržaj prije poziva.

Prirodno se povezuje s [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) i [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Decision čvor postavlja modelu odluka tipizirana pitanja o stanju izvršenja i vraća vjerojatnosti umjesto proze. **State** polje nosi ono što model treba pročitati — pojedinačni izraz zadržava svoj vlastiti tip, tako da `$input` šalje objekt umjesto njegovog teksta — a popis pitanja nosi prosudbe. Pitanja dolaze u tri oblika: **noul** odgovara na to drži li uvjet, **choice** bira jednu opciju iz skupa koji definirate i vraća cijelu distribuciju, a **score** ocjenjuje stanje duž uređenih razina i može se nalaziti između njih. Odgovori choice i score također nose povjerenje, tako da [Switch](../nodes/switch-node.md) može usmjeriti na odgovor dok [Condition](../nodes/condition-node.md) kontrolira koliko je sigurno bilo. **Generate with AI** sastavlja predložak stanja i redove pitanja iz obične rečenice, a **Custom request body** šalje ručno napisani JSON za krajnju točku čiji se ugovor razlikuje. Odgovor pružatelja se prosljeđuje nepromijenjen, a svaki poziv se bilježi u [Izvršavanjima](../tabs/traces-tab.md).

Potrebna je Decision Model vjerodajnica; prirodno se povezuje s [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) i [Agent Node](../nodes/agent-node.md).
#### [RAG / Vektorska spremišta](../nodes/rag-node.md)

RAG / Vektorska spremišta čvor umetne, ažurira, briše i pretražuje dokumente u vektorskoj spremištu za generaciju obogaćenu preuzimanjem. Padajući izbornik Baza podataka odabire pozadinu — **Qdrant** (vanjski poslužitelj) ili **Postgres (pgvector)** (vlastita baza podataka Heyma, bez vanjske usluge), s zadanim postavkama na Qdrant. Odaberite vektorsku spremištu iz [Vektorskih spremišta](../tabs/vectorstores-tab.md) kartice i postavite operaciju na umetanje, ažuriranje, brisanje ili pretraživanje. Ažuriranje i brisanje obrađuju dokument prema jedinstvenom id-u pohranjenom unutar payload-a — **Polje ID dokumenta** imenuje to polje (zadano `doc_id`), a **ID dokumenta** nosi njegovu vrijednost — tako da dokument zadržava id koji vaš sustav već koristi: ažuriranje zamjenjuje svaku odgovarajuću točku prije pohrane nove verzije, a brisanje izvještava je li nešto odgovaralo. Metapodaci dokumenta prihvaćaju izraze u svojim vrijednostima, tako da `{"url": "$start.url"}` pohranjuje ono što je izvršenje proizvelo. Pretraživanje podržava filtre metapodataka, opcionalno **Hybrid Search** (vektorska sličnost spojena s podudaranjem ključnih riječi BM25, tako da se točni pojmovi poput ID-ova i kodova pogrešaka pronalaze uz semantička podudaranja) i opcionalno Cohere ponovno rangiranje (reranking) te vraća niz rezultata s poljima text, score, metadata, zastavicama reranked i hybrid te count za korištenje u [LLM](../nodes/llm-node.md) ili [Agent Node](../nodes/agent-node.md) tokovima.

Uobičajeni downstream čvorovi su [LLM](../nodes/llm-node.md) i [Agent Node](../nodes/agent-node.md); postavke vektorske spremišta nalaze se u [Vektorskim spremištima](../tabs/vectorstores-tab.md).

#### [MCP Poziv Čvora](../nodes/mcp-call-node.md)

MCP Poziv čvor izravno poziva određeni [MCP](../tabs/mcp-tab.md) alat, bez LLM-a koji odlučuje koji alat pozvati. Koristite ga kada točno znate koji alat pokrenuti u vrijeme dizajniranja — za determinističku, jednostepenu MCP alatnu izvršavanje u workflow-u. Konfigurirajte vezu (SSE, Streamable HTTP ili stdio; ista polja kao u [Agent Node](../nodes/agent-node.md) MCP vezi), kliknite **Preuzmi alate** da popunite padajući izbornik, odaberite alat i ispunite polja argumenata koja se automatski prikazuju prema ulaznoj shemi alata. Svaki argument prihvaća statičku vrijednost ili [DSL izraz](./expression-dsl.md) poput `$userInput.body.text`. Rezultat je dostupan kao `$nodeLabel.result` (JSON objekt ako je moguće obraditi, inače string). MCP Poziv čvor ne može se povezati s [Agent Node](../nodes/agent-node.md) kao alat na platnu.

Pogledajte također [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) i [Expression DSL](./expression-dsl.md).

### Logika

#### [Uvjet](../nodes/condition-node.md)

Uvjet čvor grana workflow na temelju if/else izraza. Ima dva izlazna ručka: jedan za kada je uvjet istinit, a drugi za kada je neistinit. Koristite usporedne i logičke operatore iz [Expression DSL](./expression-dsl.md) u uvjetnom izrazu; čvor propušta ulaz u odabranu granu.

Pogledajte također [Switch](../nodes/switch-node.md), [Baci Grešku](../nodes/throw-error-node.md) i [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Switch čvor usmjerava izvršavanje na različite putanje uspoređujući vrijednost s slučajevima. Konfigurirajte izraz za evaluaciju i popis vrijednosti slučajeva; svaki slučaj dobiva izvorni ručak, a zadani ručak se koristi za neusklađene vrijednosti. Ulaz se propušta u usklađenu granu.

Koristite [Uvjet](../nodes/condition-node.md) za binarno grananje i [Merge](../nodes/merge-node.md) za ponovno spajanje usmjerenih putanja; pravila usklađivanja pokrivena su u [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Merge čvor čeka na više paralelnih ulaza i kombinira ih u jedan izlaz. Postavite broj ulaza na koje treba čekati; čvor proizvodi spojeni objekt kada su sve grane završene. Koristite ga za spajanje rezultata iz paralelnih grana prije nastavka; nemojte ga koristiti kada paralelne grane završavaju u odvojenim Output čvorovima.

Pogledajte također [Paralelno Izvršavanje](./parallel-execution.md), [Petlja](../nodes/loop-node.md) i [Izlaz](../nodes/output-node.md) prilikom ponovnog kombiniranja grana.

#### [Petlja](../nodes/loop-node.md)

Petlja čvor iterira kroz niz, izvršavajući downstream čvorove za svaki element. Potrebna je povratna veza od posljednjeg čvora u tijelu iteracije za napredovanje. Unutar tijela petlje koristite `item`, `index`, `total`, `isFirst` i `isLast`; petlja ima odvojene izlaze za putanju iteracije i putanju završetka.

Pari se s [Varijablom](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) i [Expression DSL](./expression-dsl.md) za iterativne workflow-e.

### Podaci

#### [Postavi](../nodes/set-node.md)

Postavi čvor transformira i mapira ulazne podatke u prilagođeni izlaz. Definirajte mapiranja ključ-vrijednost gdje je svaka vrijednost [Expression DSL](./expression-dsl.md) izraz. Koristite ga za velika slova, podniz, spajanje, nasumične brojeve i slične transformacije. Pristupite izlazu prema ključu (npr. `$setNode.keyName`). Kada je povezan s agentom kao alat na platnu, mapirane vrijednosti mogu biti označene kao agentom pružene tako da agent ispuni te vrijednosti tijekom izvođenja. Za pozivanje drugih workflow-a koristite [Izvrši](../nodes/execute-node.md) čvor umjesto toga.

Pogledajte također [Varijabla](../nodes/variable-node.md), [Izvrši](../nodes/execute-node.md) i [Expression DSL](./expression-dsl.md).
#### [Pretvarač](../nodes/converter-node.md)

Čvor Pretvarač konvertira podatke između formata bez pisanja koda. Konverzije teksta su `csvToJson` (CSV tekst u niz objekata redaka, ili nizove kada nema zaglavlja), `jsonToCsv` (niz objekata/redaka u CSV tekst), `xmlToJson` (XML tekst u objekt), i `jsonToXml` (objekt u XML tekst). Konfigurirajte smjer konverzije i izvorni izraz; CSV konverzije dodatno koriste delimiter i obradu zaglavlja, a `jsonToCsv` može odrediti eksplicitni redoslijed stupaca. Citiranje, ugrađeni delimiters i ugrađeni novi redovi slijede RFC 4180. XML atributi koriste `@` prefikse, tekst pomiješan s atributima koristi `#text`, ponovljeni elementi postaju nizovi, a ekspanzija XML entiteta je onemogućena. Isti čvor također radi na pohranjenim datotekama. `imageToText` i `pdfToText` pokreću Tesseract OCR, čitajući datoteku iz Heym Drive (`$Upload.file.id` iz okidača za prijenos datoteka, rezultat čvora Drive, ili datoteka generirana od strane agenta), automatski birajući jezik iz detektiranog pisma ili koristeći kodove koje navedete kao što su `tur` ili `eng+tur`, i normalizirajući tekst na UTF-8 prema zadanim postavkama s opcionalnom NFC normalizacijom i užim skupovima znakova poput `cp1254`. `fileConvert` prepisuje pohranjenu datoteku u drugi format, dokumente putem pandoca i slike putem Pillow-a, te sprema rezultat kao novu datoteku na Drive bez dodirivanja originala. Rezultat je dostupan kao `$converterNode.result`, uz `.language`, `.encoding`, `.page_count`, `.pages`, i `.file` uz njega za OCR pokretanja, te `.id`, `.filename`, i `.download_url` za `fileConvert`.

Pogledajte također [Postavi](../nodes/set-node.md), [Tablica podataka](../nodes/datatable-node.md), i [Izraz DSL](./expression-dsl.md).

#### [Kod](../nodes/code-node.md)

Čvor Kod pokreće Python koji napišete, s vlastitim `requirements.txt`, u kontejneru koji se stvara i uništava za svako izvršavanje. Vaš kod definira funkciju `main(params)` i vraća bilo koju vrijednost koja se može serijalizirati u JSON, koja postaje `$codeNode.result`; sve što ispisuje se odvojeno bilježi kao `$codeNode.logs`, a `$codeNode.install` izvještava koji alat je instalirao ovisnosti. Parametri se konfiguriraju kao JSON objekt čiji se `$` izrazi rješavaju prije pokretanja, a kod ih čita s notacijom točke kao što su `params.user.name` ili `params.orders[0].id`. Ovisnosti se instaliraju s `uv`, vraćajući se na `pip` za pakete koje `uv` ne može obraditi, bez keširanja između pokretanja; ostavljanje `requirements.txt` praznim potpuno preskoči instalaciju i znatno je brže. Faza izvršavanja nema mrežu osim ako `codeAllowNetwork` nije uključen, dok instalacija ovisnosti uvijek doseže PyPI. Sandbox radi bez root privilegija s uklonjenim svim mogućnostima, samo za čitanje root datotečnog sustava, bez Docker socket-a, i bez pristupa tajnama pozadinskog sustava, ograničen na 512 MB memorije, jedan CPU, 256 procesa, 120 sekundi za instalaciju, i 60 sekundi za izvršavanje. Docker je obavezan i ne postoji način povratka: bez dostupnog demona čvor ne uspijeva umjesto da pokrene vaš kod u pozadinskom procesu.

#### [Varijabla](../nodes/variable-node.md)

Čvor Varijabla postavlja ili ažurira lokalnu varijablu u workflow-u (`$vars.variableName`) ili trajnu [globalnu varijablu](./global-variables.md) (`$global.variableName`). Koristite ga za brojače, akumulirane popise i dijeljeno stanje. Konfigurirajte naziv varijable, izraz vrijednosti, tip konverzije, i hoće li se pohraniti u globalnu pohranu. Varijable niza podržavaju `$array()` i `.add()`.

Uparuje se s [Postavi](../nodes/set-node.md), [Petlja](../nodes/loop-node.md), i [Globalne varijable](./global-variables.md).

#### [Izvrši](../nodes/execute-node.md)

Čvor Izvrši poziva drugi workflow (pod-workflow) i prosljeđuje mu ulaz. Odredite ciljni workflow prema ID-u i pružite ulaz putem jednog izraza ili mapiranja ključ-vrijednost. Izlaz uključuje workflow_id, status, i izlaze; koristite ga za ponovljivu logiku, a ne za transformaciju podataka (za to koristite Postavi).

Pogledajte također [Značajke platna](./canvas-features.md) za Ekstrakt u Pod-Workflow, [Struktura workflow-a](./workflow-structure.md), i [Izlaz](../nodes/output-node.md).

### Integracije

#### [HTTP](../nodes/http-node.md)

Čvor HTTP izvršava HTTP zahtjeve koristeći cURL-stil konfiguraciju. Može biti početna točka workflow-a (bez dolazne ivice) ili primati ulaz od uzvodnih čvorova. Odgovor je dostupan kao status, zaglavlja, i tijelo (parsirani JSON kada je primjenjivo). Koristite [Vjerodajnice](./credentials.md) za Bearer ili prilagođenu autentifikaciju zaglavlja.

Uparuje se s [Webhookovima](./webhooks.md), [Vjerodajnicama](./credentials.md), i [Integracijama trećih strana](./integrations.md).

#### [WebSocket Pošalji](../nodes/websocket-send-node.md)

Čvor WebSocket Pošalji otvara izlaznu klijentsku vezu, šalje jednu tekstnu/JSON/binarne poruke, i zatvara je. Koristite ga za objavljivanje izlaza workflow-a u sustave u stvarnom vremenu bez stvaranja Heym-hostane socket točke.

Pogledajte također [WebSocket Okidač](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md), i [Integracije trećih strana](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Telegram čvor šalje poruku bota u chat, grupu ili kanal. Konfigurirajte Telegram [vjerodajnicu](./credentials.md), postavite `chatId` i sastavite odlaznu `poruku` koristeći [Expression DSL](./expression-dsl.md) izraze. Prirodno se povezuje s [Telegram Trigger](../nodes/telegram-trigger-node.md) za konverzacijske workflows i s [Error Handler](../nodes/error-handler-node.md) za upozorenja operatera.

Pogledajte također [Integracije trećih strana](./integrations.md) i [Vjerodajnice](./credentials.md) za postavke i obrasce vjerodajnica.

#### [Slack](../nodes/slack-node.md)

Slack čvor šalje poruku u Slack kanal putem Incoming Webhook-a. Konfigurirajte Slack [vjerodajnicu](./credentials.md) i izraz poruke. Koristite ga za obavijesti, upozorenja i izvještavanje o pogreškama; izlaz prolazi kroz ulaz.

Povezuje se s [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) i [Integracijama trećih strana](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Discord čvor šalje poruku u Discord kanal putem Incoming Webhook-a. Konfigurirajte Discord [vjerodajnicu](./credentials.md), sastavite odlaznu poruku koristeći [Expression DSL](./expression-dsl.md), i opcionalno postavite korisničko ime ili avatar za webhook.

Povezuje se s [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) i [Integracijama trećih strana](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Send Email čvor šalje e-poštu putem SMTP-a. Konfigurirajte SMTP [vjerodajnicu](./credentials.md) i [Expression DSL](./expression-dsl.md) izraze za primatelje, predmet i tijelo. Koristite ga za obavijesti, upozorenja i transakcijske e-pošte. Izlaz uključuje status, primatelja i predmet.

[IMAP Trigger](../nodes/imap-trigger-node.md) dopunjuje Send Email tako što obrađuje dolaznu poštu. Zajedno omogućuju workflow-u da čita dolaznu e-poštu iz zajedničke pristigle pošte, sažima ili klasificira pomoću AI čvorova, i šalje poruku za praćenje ili eskalaciju. [Telegram Trigger](../nodes/telegram-trigger-node.md) i [Telegram čvor](../nodes/telegram-node.md) pružaju isti obrazac ulaza/izlaza za chat workflows vođene botovima.

Za dvosmjerne tokove obavijesti, također se dobro povezuje s [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) i [Integracijama trećih strana](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Redis čvor izvodi Redis operacije: set, get, hasKey i deleteKey. Koristite ga za keširanje, ograničavanje brzine i pohranu ključ-vrijednost. Konfigurirajte [vjerodajnicu](./credentials.md), tip operacije, izraz ključa, a za set operacije vrijednost i opcionalni TTL. Izlaz varira ovisno o operaciji (vrijednost, uspjeh, postoji, obrisano).

Povezuje se s [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) i [Parallel Execution](./parallel-execution.md) za keširanje, ograničavanje i koordinaciju.

#### [Grist](../nodes/grist-node.md)

Grist čvor čita, piše i upravlja podacima u Grist proračunskim tablicama. Operacije uključuju getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables i listColumns. Pružite ID dokumenta, ID tablice, a za kreiranje/izmjenu podatke o zapisu koristeći ID-ove kolona. Koristite ga za CRUD, grupne izmjene i automatizaciju proračunskih tablica.

Pogledajte također [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) i [Integracije trećih strana](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets čvor čita, piše i upravlja podacima proračunskih tablica putem OAuth2. Koristite ga za čitanje izvještaja, dodavanje rezultata workflow-a, ažuriranje tragača i brisanje ili inspekciju kartica iz proračunske tablice unutar workflow-a. Kao [BigQuery](../nodes/bigquery-node.md), koristi Google-ovu integracijsku vjerodajnicu i dobro se uklapa uz [Grist](../nodes/grist-node.md) kada su podaci proračunskih tablica dio toka.

Povezuje se s [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) i [Integracijama trećih strana](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery čvor izvršava SQL upite i umetne redove u Google BigQuery skupove podataka putem OAuth2. Koristan je za analitičke workflows, izvještajne pipeline i pisanje strukturiranih podataka o događajima iz izvršavanja workflow-a. Često se povezuje s [Set](../nodes/set-node.md) za oblikovanje redova i [Google Sheets](../nodes/google-sheets-node.md) za lakše izvještavanje orijentirano na proračunske tablice.

Povezuje se s [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) i [Integracijama trećih strana](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive čvor omogućuje popisivanje, preuzimanje, ažuriranje i brisanje datoteka i mapa na Driveu putem OAuth2, te može kopirati datoteku s Drivea izravno u [Heym Drive](../nodes/drive-node.md) s operacijom `syncToHeymDrive`. Google Docs, Sheets i Slides nemaju preuzimljive bajtove, stoga čvor automatski izvozi te datoteke — Docs u PDF, Sheets u XLSX, Slides u PPTX — s mogućnošću prepisivanja ciljnog formata. Brisanja premještaju stavke u smeće na Driveu osim ako nije omogućena opcija "Trajno obriši", a čvor odbija brisati mapu putem operacije datoteke ili obrnuto. Kao i [Google Sheets](../nodes/google-sheets-node.md), koristi vjerodajnice za OAuth2 koje podržava Google; imajte na umu da ova zahtijeva potpuni pristup Driveu, stoga pregledajte [Dijeljenje vjerodajnica](./credentials-sharing.md) prije dijeljenja.

Uparuje se s [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) i [Integracijama trećih strana](./integrations.md).

#### [GitHub](../nodes/github-node.md)

GitHub čvor pruža 40 izvornih GitHub REST akcija koje pokrivaju repozitorije, organizacije i korisnike, probleme, pull zahtjeve, recenzije, izdanja, Actions workflows, uvide u promet i datoteke repozitorija. Koristite ga za triage problema, automatizaciju recenzija, pokretanje workflows i čekanje na dovršetak, automatizaciju izdanja i ažuriranje datoteka repozitorija bez ručnog sastavljanja HTTP zahtjeva. Podržava GitHub.com i opcionalni `base_url` za GitHub Enterprise na vjerodajnici.

Uparuje se s [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) i [Integracijama trećih strana](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Jira čvor povezuje workflows s Jira Cloud ili Jira Data Center / Server REST API-ima za automatizaciju projekata, problema, komentara, privitaka, korisnika, obavijesti i prijelaza. Može popisivati projekte, pretraživati probleme pomoću JQL-a, kreirati ili ažurirati probleme, pregledavati promjene, obavještavati dionike, upravljati komentarima i privicima, dohvaćati ili upravljati korisnicima, popisivati dostupne prijelaze i premještati probleme putem ID-a prijelaza. Koristite Jira vjerodajnicu s Atlassian e-poštom, API tokenom, osnovnom URL adresom stranice i načinom implementacije.

Uparuje se s [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) i [Integracijama trećih strana](./integrations.md) za unos, triage i workflows izdanja.

#### [Linear](../nodes/linear-node.md)

Linear čvor povezuje workflows s Linearovim GraphQL API-jem za automatizaciju radnog prostora i problema. Može popisivati timove, projekte, probleme, stanja workflows, članove tima i komentare; kreirati, ažurirati, brisati i povezivati probleme; te kreirati, ažurirati, rješavati, poništavati ili brisati komentare. Koristite osobni API ključ ili OAuth2 vjerodajnicu za Linear, a zatim otkrijte UUID-ove tima, projekta, stanja i dodijeljenog korisnika iz operacija popisa prije kreiranja ili ažuriranja problema.

Uparuje se s [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) i [Integracijama trećih strana](./integrations.md) za unos, triage i workflows inženjerskog backlog-a.

#### [Supabase](../nodes/supabase-node.md)

Supabase čvor čita i mijenja tablice izložene putem Supabase PostgREST-a. Dobro funkcionira za backend proizvoda, podatke o korisnicima/profilima, stanje workflows i CRUD stil automatizacija koje žele pristup bazi podataka bez prilagođenog povezivanja HTTP zahtjeva.

Uparuje se s [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) i [Integracijama trećih strana](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse čvor izvršava CRUD, count i sirove SQL operacije protiv vanjske ClickHouse baze podataka putem njenog HTTP sučelja. Prikladan je za analitičke cijevi, evidentiranje događaja i workflows izvještavanja: umetnite događaje dok se događaju, a zatim ih agregirajte ili prebrojite s `query`/`count`. Oponaša skup operacija [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) plus sirovi SQL izlaz, s `update`/`remove` koji se izvršavaju kao ClickHouse mutacije.

Uparuje se s [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) za zakazane izvještaje, i [Integracijama trećih strana](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Notion čvor upravlja Notion bazama podataka, izvorima podataka, stranicama i blokovima putem trenutnog Notion API-ja (`2026-03-11`). Podržava pretraživanje, CRUD stranica, operacije s bazama podataka i izvorima podataka, djecu blokova, dodavanje/ažuriranje/brisanju blokova, te smeće/obnavljanje. Koristite interni integracijski token ili Notion javnu integracijsku OAuth vjerodajnicu. Urednik može pretraživati i paginirati dostupne izvore podataka i roditeljske stranice. Dijeljene vjerodajnice funkcioniraju isto kao i posjedovane vjerodajnice za izvršavanje workflows.

Za prilagođene REST pozive, `$credentials.YourNotionCredential` rješava se u isti bearer token. Uparuje se s [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) i [Integracijama trećih strana](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Sentry čvor automatizira Sentry organizacije, projekte, timove, probleme, događaje i izdanja putem Sentry REST API-ja. Koristite ga za triage upozorenja, ažuriranja statusa problema, automatizaciju izdanja, pretraživanje događaja te postavljanje ili čišćenje projekata/timova. Podržava Sentry SaaS i samostalno hostani Sentry putem opcionalne URL adrese za vjerodajnice.

Uparuje se s [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) i [Third-Party Integrations](./integrations.md) za incidentne i radne tokove izdanja.

#### [DataTable](../nodes/datatable-node.md)

DataTable čvor čita, piše i upravlja podacima u Heym DataTables (prvo-strana strukturirana pohrana). Operacije uključuju find, getAll, getById, insert, update, remove i upsert. Nema potrebe za vanjskim vjerodajnicama. Tablice se upravljaju s [DataTable](../tabs/datatable-tab.md) nadzorne ploče i izravno ih pristupa vlasnik radnog toka.

Uparuje se s [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) i [DataTable tab](../tabs/datatable-tab.md) za prvo-stranu strukturiranu pohranu.

#### [Drive](../nodes/drive-node.md)

Drive čvor upravlja datotekama generiranim od strane vještina izravno unutar radnog toka. Operacije uključuju delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams i unshareWithMyTeams za upravljanje pristupom timovima samo za čitanje; konverzija formata se nalazi u [Converter](../nodes/converter-node.md) čvoru. Referencirajte datoteku s `$agentLabel._generated_files[0].id`; izlazi uključuju status, file_id, ažurirani download_url za ograničenja poveznica i shared_team_count za dijeljenje s timovima. Ovo je posebno korisno s [Agent Node](../nodes/agent-node.md) radnim tokovima koji koriste [File Generation](./file-generation.md) i referentni model [Drive](./drive.md).

Uobičajeni suputnici su [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) i [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 čvor izvršava operacije pohrane objekata na Amazon S3 koristeći `s3` vjerodajnicu (pristupni ključ, tajni ključ, regija, opcionalni sesijski token). Operacije uključuju putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder i listBuckets. Podržano je učitavanje teksta i preuzimanje teksta ili base64, s poljima za kantu i ključ koja prihvaćaju [Expression DSL](./expression-dsl.md). Koristite ga za pohranu izlaza radnog toka, arhiviranje datoteka i ponovno čitanje objekata u tok.

Uparuje se s [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) i [Third-Party Integrations](./integrations.md).

### Automatizacija

#### [Crawler](../nodes/crawler-node.md)

Crawler čvor pretražuje web stranice koristeći FlareSolverr s opcionalnom HTML ekstrakcijom putem CSS selektora. Konfigurirajte FlareSolverr [vjerodajnicu](./credentials.md), URL izraz, vrijeme čekanja i opcionalne selektore za ekstrakciju. Izlaz je sirovi HTML ili ekstraktirani sadržaj. Koristite ga za web scraping i ekstrakciju sadržaja.

Uparuje se s [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) i [LLM](../nodes/llm-node.md) za tokove pretraživanja i analize.

#### [Playwright](../nodes/playwright-node.md)

Playwright čvor automatizira interakcije s preglednikom s konfigurabilnim koracima (navigacija, osvježavanje, klik, upis, snimka zaslona, ekstrakcija, aiStep) ili **Run Code** načinom za prilagođeni Playwright Python (sandboxed; isključeno prema zadanim postavkama putem `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Podržava headless način, opcionalnu postavku koja smanjuje uobičajene signale automatizacije Playwrighta, vremenska ograničenja, opcionalno snimanje mreže (odgovori, kolačići, localStorage, sessionStorage), autentifikaciju putem kolačića/storageState iz [Global Variables](./global-variables.md) izraza kao što je `$global.authState`, korake prijave u slučaju neuspjeha obnove autentifikacije i AI korak s Auto Heal kada selektori ne uspiju. Koristite ga za web scraping, ispunjavanje obrazaca i radne tokove temeljene na pregledniku.

Pogledajte također [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) i [Execution History](./execution-history.md) za automatizaciju preglednika i otklanjanje pogrešaka.

### Alati

#### [Output](../nodes/output-node.md)

Output čvor je krajnja točka radnog toka koja vraća odgovor pozivatelju. Postavite izraz poruke da referencira prethodni čvor prema oznaci (nikada ne koristite `$input` iz [Input](../nodes/input-node.md) čvora ovdje). Opcionalni async downstream omogućuje čvorovima nakon izlaza da se izvršavaju u pozadini nakon slanja odgovora.

Uobičajeni izvori uzvodno su [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) i [Execute](../nodes/execute-node.md); oblikovanje odgovora je lakše otkloniti u [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper čvor gradi običan JSON objekt iz [Set](../nodes/set-node.md)-stilskih ključ-vrijednost mapa i vraća ga na vrhu odgovora radnog toka. Koristite ga kada API pozivatelj treba primiti sirovi JSON tijelo umjesto standardnog [Output](../nodes/output-node.md) čvora.
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

Čvor HTML output mapper prikazuje jedan HTML predložak, interpolirajući izraze `$nodeLabel.field` u stranicu. Kada je to jedini terminalni čvor u workflowu, execute webhook odgovara s `text/html` i konfiguriranom statusnom kodom čvora umjesto JSON tijela, tako da workflow može izravno poslužiti stranicu pregledniku. Pošaljite `X-Simple-Response: false` kako biste dobili uobičajeni JSON envelope natrag za otklanjanje pogrešaka.

Uparuje se s [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) i [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Čvor Chart Output je terminalni čvor widget workflowa [Dashboard](../tabs/dashboard-tab.md). Pretvara redove koje proizvode uzvodni čvorovi u standardizirani chart payload koji dashboard prikazuje. Odaberite `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text ili HITL), mapirajte `labelField`/`valueField` (ili `series` za višestruke serije, ili `text` za markdown poruku) i stavite ga na kraj; nema izlaznog ruba. HITL ignorira uzvodne redove i navodi Vaše čekajuće ljudske recenzije. a drugu kao gumbe veze koji otvaraju URL u novoj kartici (`linkColumn`, s `linkLabel` za tekst gumba)

Pogledajte također [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) i [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Čvor Wait pauzira izvršavanje workflowa na određeno trajanje u milisekundama, do 15 minuta. Koristite ga za ograničavanje brzine, odgođene akcije ili intervale anketiranja. Prolazi kroz ulaz nepromijenjen.

Uparuje se s [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) i [Parallel Execution](./parallel-execution.md) za tempiranje i anketiranje.

#### [Sticky Note](../nodes/sticky-note-node.md)

Čvor Sticky Note dodaje markdown bilješke na platno. Ne izvršava se. Koristite ga za dokumentaciju, upute ili bilješke o workflowu uz druge [Canvas Features](./canvas-features.md). Dvaput kliknite na platno da biste uredili sadržaj bilješke.

Pogledajte također [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) i [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Čvor Console Log bilježi vrijednost u konzolu backend (poslužitelja). Koristite ga za otklanjanje pogrešaka i inspekciju tijekom razvoja. Poruka u dnevniku podržava [Expression DSL](./expression-dsl.md) izraze; izlaz prolazi kroz ulaz.

Uparuje se s [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) i [Expression Evaluation Dialog](./expression-evaluation-dialog.md) za otklanjanje pogrešaka.

#### [Disable Node](../nodes/disable-node.md)

Čvor Disable Node trajno onemogućava drugi čvor u workflowu postavljanjem njegovog `active` oznake na false. Odredite ciljni čvor prema oznaci. Koristite ga za jednokratne operacije kao što je zaustavljanje [Cron](../nodes/cron-node.md) triggera nakon što je uvjet ispunjen.

Pogledajte također [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) i [Cron](../nodes/cron-node.md) za obrasce kontrole workflowa.

#### [Enable Node](../nodes/enable-node.md)

Čvor Enable Node ponovno uključuje drugi čvor postavljanjem njegove `active` oznake na true i spremanjem promjene. Odredite ciljni čvor prema oznaci. Koristite ga za ponovno aktiviranje onemogućenog [Cron](../nodes/cron-node.md) triggera iz druge ulazne točke, ili za uključivanje čvora kada je uvjet ispunjen. Cilj koji se nalazi nizvodno od Enable Node i još nije izvršen također će se izvršiti u trenutnom izvršavanju.

Pogledajte također [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) i [Cron](../nodes/cron-node.md) za obrasce kontrole workflowa.

#### [Throw Error](../nodes/throw-error-node.md)

Čvor Throw Error odmah zaustavlja izvršavanje workflowa i vraća odgovor o pogrešci s prilagođenim HTTP statusnim kodom. Postavite izraz poruke o pogrešci i statusni kod (npr. 400, 401, 403, 404, 429, 500). Koristite ga za neuspjehe validacije, neovlašteni pristup ili druge uvjete pogreke, posebno kada je uparen s [Condition](../nodes/condition-node.md) i [Error Handler](../nodes/error-handler-node.md).

Uparuje se s [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) i [Security](./security.md) za eksplicitne putanje neuspjeha.

---

## Reference
### [Tipovi čvorova](./node-types.md)

Heym nudi razne tipove čvorova: okidače poput [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) i [Error Handler](../nodes/error-handler-node.md); AI čvorove poput [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) i [MCP Call](../nodes/mcp-call-node.md); logičke čvorove kao što su [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) i [Loop](../nodes/loop-node.md); podatkovne čvorove poput [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) i [Heym](../nodes/heym-node.md); integracije poput [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) i [Drive](../nodes/drive-node.md); čvorove za automatizaciju poput [Crawler](../nodes/crawler-node.md) i [Playwright](../nodes/playwright-node.md); te alate poput [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) i [Sticky Note](../nodes/sticky-note-node.md). Koristite izraze poput `$input.text` i `$nodeLabel.field` u konfiguraciji čvora.

Pogledajte također [Triggers](./triggers.md), [Integracije trećih strana](./integrations.md) i [Paralelna izvršavanja](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym koristi jednostavni jezik izraza za referenciranje podataka iz uzvodnih čvorova. Koristite `$input` za [Input](../nodes/input-node.md) čvor, `$nodeLabel.field` za bilo koji uzvodni čvor, `$credentials.CredentialName` za [vjerodajnice](./credentials.md) i `$global.variableName` za [globalne varijable](./global-variables.md). Ugrađene posebne varijable uključuju `$now`, `$UUID` i metapodatke workflowa: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` i `$executionId` (id [Izvršne povijesti](./execution-history.md) izvođenja — `/workflows/{id}/{executionId}` otvara to izvođenje na platnu; samo za vrijeme izvođenja, prazno u dijalogu za pregled izraza). Podrška uključuje literale, aritmetiku, usporedbe, kontekst [Loop](../nodes/loop-node.md), ugniježdene polja i pomoćne funkcije za stringove/nizove (uključujući `$text.toJson()` za parsiranje JSON stringa). Kada je puna vrijednost jedan `$expr`, backend čuva nizove, objekte, booleane i brojeve kao izvorne tipove.

Pogledajte također [Dijalog za evaluaciju izraza](./expression-evaluation-dialog.md), [Globalne varijable](./global-variables.md) i [Struktura workflowa](./workflow-structure.md).

### [Globalne varijable](./global-variables.md)

Globalno spremište varijabli drži trajne, korisnički definirane ključ-vrijednost podatke koji opstaju kroz izvršavanja workflowa. Kreirajte varijable iz taba [Variables](../tabs/global-variables-tab.md) ili iz [Variable](../nodes/variable-node.md) čvora s omogućenom opcijom "Store in Global Variable Store". Pristupite im s `$global.variableName` u izrazima; mogu se dijeliti s drugim korisnicima ili [timovima](./teams.md).

Parovi s [Variable](../nodes/variable-node.md), [Teams](./teams.md) i [Credentials Sharing](./credentials-sharing.md) za dijeljeno stanje workflowa.
### [Dijalog za Evaluaciju Izraza](./expression-evaluation-dialog.md)

Dijalog za Evaluaciju Izraza je proširivi uređivač koji se pojavljuje kada kliknete na gumb za proširenje pored polja izraza. Otvara se kao veliki centrirani modal, održava aktivnu automatsku dopunu i automatski osvježava izlazni pregled s backend-a nakon što prestanete tipkati. Rezultate objekata i nizova možete pregledavati pomoću odabira izlaznog puta. Dijalog prihvaća punu liniju golog točkastog puta (na primjer `myNode.output.field`) kao da je to `$myNode.output.field`; pogledajte pravila postavljanja [Expression DSL](./expression-dsl.md).

Gumb **Izgradite s AI** u alatnoj traci omogućuje Vam da opišete izraz koji želite u običnom tekstu. Odaberite LLM [vjerodajnicu](./credentials.md) i model, upišite opis poput *"Dohvati ime kupca iz API odgovora"*, i kliknite Generiraj. Backend šalje [Expression DSL](./expression-dsl.md) kontekst i izlaze posljednjeg izvršenog čvora modelu i vraća jedan izraz kao string. Rezultat se odmah evaluira kako biste ga mogli provjeriti prije nego što kliknete Primijeni.

Prirodno se kombinira s [Expression DSL](./expression-dsl.md), [Izlaz](../nodes/output-node.md) i [JSON izlaznim mapperom](../nodes/json-output-mapper-node.md).

### [Struktura Workflows-a](./workflow-structure.md)

Workflows se pohranjuju kao JSON s čvorovima i rubovima. Objekt workflow-a uključuje id, naziv, opis, čvorove, rubove i postavke autentifikacije. Svaki čvor ima id, tip, poziciju i podatke (oznaku i konfiguraciju specifičnu za tip). Rubovi povezuju ID-ove izvornog i ciljnog čvora s opcionalnim ID-ovima ručki. Sintaksa izraza u poljima podataka slijedi [Expression DSL](./expression-dsl.md), a ovaj isti oblik koristi se u [Preuzimanju i Uvozu](./download-import.md).

Pogledajte također [Tipove Čvorova](./node-types.md), [Expression DSL](./expression-dsl.md) i [Preuzimanje i Uvoz](./download-import.md).

### [Značajke Platna](./canvas-features.md)

Pređite mišem preko bilo kojeg ne-ljepljivog čvora na platnu i kliknite **Pokreni** da izvršite do tog čvora. Potrebni ulazi otvaraju se u panelu za pokretanje s prvim poljem fokusiranim; putanje bez ulaza započinju odmah. Pogledajte [Pokreni do Čvora](./canvas-features.md#run-to-node).

Uređivač workflow-a pruža Data Pin (prikvači posljednji izlaz čvora za testiranje nizvodno bez ponovnog pokretanja), Izvršne Dnevnike (rezultate čvora u stvarnom vremenu i napredak agenta koji dopunjuju [Povijest Izvršenja](./execution-history.md)), Omogući/Onemogući (preskoči čvorove tijekom izvršenja) i Izvuci u Pod-Workflow (premjesti odabir u novi workflow i zamijeni ga s [Izvrši](../nodes/execute-node.md) čvorom). Aktivno izvršenje u produkciji može se otvoriti iz Povijesti ili kartice na Odboru; uređivač obnavlja njegov trenutni snimak, povezuje se na SSE i održava animaciju platna i Debug dnevnike aktivnima. [Prečaci na Tipkovnici](./keyboard-shortcuts.md) podržavaju kopiranje, lijepljenje, pokretanje i pretraživanje čvorova u liniji.

Pogledajte također [Prečace na Tipkovnici](./keyboard-shortcuts.md), [Povijest Uređivanja](./edit-history.md) i [Povijest Izvršenja](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Pogledajte demo Uređivača</a></p>

### [Prečaci na Tipkovnici](./keyboard-shortcuts.md)

Heym pruža prečace kroz uređivač: Command Palette (Ctrl+K), Pokreni (Ctrl+Enter), Spremi (Ctrl+S), Poništi/Ponovi, i Escape za zatvaranje. Na platnu: odaberi sve, višestruki odabir, kopiraj/izreži/lijepi, izbriši, preklopi omogućeni čvor (D), preklopi prikvačene podatke (P), i pretraživanje čvorova u liniji tipkanjem. Prečaci su dokumentirani u referenci unutar aplikacije i blisko surađuju s [Značajkama Platna](./canvas-features.md) poput Data Pin i omogućavanja/onemogućavanja čvora.

Pogledajte također [Značajke Platna](./canvas-features.md), [Brzi Ladica](./quick-drawer.md) i [Kontekstualna Izložba](./contextual-showcase.md).

### [AI Asistent](./ai-assistant.md)

AI Asistent je chat panel otvoren iz Debug panela koji Vam omogućuje da kreirate ili modificirate workflows prirodnim jezikom. Odaberite [vjerodajnicu](./credentials.md) i model, zatim opišite što želite; AI streama odgovor i svaki valjani [workflow JSON](./workflow-structure.md) u kodnom bloku automatski se analizira i primjenjuje na platnu. Podrška za glasovni unos dostupna je na kompatibilnim preglednicima.

Uključite **YOLO način** (Agent način, isključen prema zadanim postavkama) i asistent testira ono što gradi. Nakon svake promjene pokreće workflow na platnu, čita rezultat i ispravlja workflow dok ne postigne ono što ste tražili, do 5 izvršenja po poruci. Pita za testne ulaze prije prvog izvršenja, može pokrenuti Vaše druge workflows kada mu zatreba njihov rezultat, i prikazuje svaki korak dok radi. Pogledajte [AI Asistent › YOLO Način](./ai-assistant.md#yolo-mode).

Kliknite **AI** iznad bilo kojeg čvora na canvasu kako biste promijenili ili popravili samo taj čvor. Ploča prikazuje čvor koji mijenja (s njegovim zadnjim rezultatom nakon izvođenja) i nudi **Change this node as ...**, **Fix error in this node ...** i **Other**. Ažurira se samo taj čvor; ostatak workflowa i izgled ostaju kakvi jesu. Pogledajte [AI Assistant › Izmjena jednog čvora](./ai-assistant.md#changing-one-node).

Kada workflow pohranjuje zapise, asistent pita koju [tablicu podataka](../tabs/datatable-tab.md) koristiti, ili stvara novu s kolonama koje workflow treba. Pogledajte [AI Asistent › Tablice podataka](./ai-assistant.md#data-tables).

Kada trenutni workflow sadrži vještine [Agent Node](../nodes/agent-node.md), asistent šalje samo `SKILL.md` svake vještine u kontekst workflow-a. Priložene `.py` datoteke i binarni resursi vještina isključeni su prije zahtjeva kako veliki paketi vještina ne bi preplavili prozor konteksta modela.

Prirodno se kombinira s [Chat s Heym](./chat-with-heym.md), [Arhitekturom Agenta](./agent-architecture.md) i [Expression DSL](./expression-dsl.md).
### [Chat s Heym](./chat-with-heym.md)

Chat s Heym je asistent za dokumentaciju koji odgovara na pitanja o proizvodu. Otvara se u centriranom dijalogu, zadržava vidljivost odabira vjerodajnica i modela na vrhu, injektira putanju aktivne stranice dokumentacije kao kontekst i briše povijest poruka kada se dijalog zatvori. Dodatak je širem [AI Assistant](./ai-assistant.md) i lakšoj verziji [Contextual Showcase](./contextual-showcase.md).

Pogledajte također [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) i [Tipovi čvorova](./node-types.md).

### [Organizacija Workflows-a](./workflow-organization.md)

Administratori instanci (`HEYM_ADMIN_EMAILS`) mogu pristupiti i uređivati svaki workflow, pronaći workflow-e vlasnika prema e-mailu, pregledati rasporede i povijest izvršavanja, pauzirati i nastaviti automatske triggere te brisati workflow-e nakon što se izvršenja završe. Pogledajte [Administracija instance](../tabs/workflows-tab.md#instance-administration) za postupak isključivanja i razliku između pauziranja automatskih triggera i blokiranja svih poziva.

Workflows se mogu organizirati u mape i podmape u strukturi stabla. Mape imaju nazive i opcionalnog roditelja; workflow-i se dodjeljuju mapama. Workflow-i se mogu zakazati za brisanje (premještaju se u područje smeća prije trajnog uklanjanja). API podržava kreiranje, ažuriranje, brisanje i premještanje workflow-a između mapa, a isti model organizacije pojavljuje se na kartici [Workflows](../tabs/workflows-tab.md).

Pogledajte također [Brzi izbornik](./quick-drawer.md), [Preuzimanje i uvoz](./download-import.md) i [Povijest uređivanja](./edit-history.md).

### [Brzi izbornik](./quick-drawer.md)

Brzi izbornik je fiksna bočna ploča za brze radnje s desne strane za interne stranice koje nisu na platnu. Omogućuje pretraživanje [workflows-a](../tabs/workflows-tab.md), pričvršćivanje omiljenih, odabir ulaza, trenutnu izvedbu i pregled napretka ili rezultata bez otvaranja uređivača. Workflow s čvorom [File Upload Trigger](../nodes/file-upload-trigger-node.md) prima ispuštenu ili odabranu datoteku. Redoslijed pričvršćenih i posljednje odabrani workflow pohranjuju se u pregledniku.

Pogledajte također [Organizacija Workflows-a](./workflow-organization.md), [Prečaci na tipkovnici](./keyboard-shortcuts.md) i [Povijest izvršavanja](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase je kompaktna vodička traka unutar aplikacije za autentificirane glavne površine kao što su kartice nadzorne ploče, [Evaluacije](../tabs/evals-tab.md), Dokumenti i uređivač workflow-a. Po defaultu ostaje zatvoren, daje kratak sažetak stranice, nudi dodatne detalje na zahtjev i povezuje na cijeli članak dokumentacije kada želite dublje upute.

Uparuje se s [Chat s Heym](./chat-with-heym.md), [Brzi izbornik](./quick-drawer.md) i [AI Assistant](./ai-assistant.md) za tokove uputa unutar aplikacije.

### [Vjerodajnice](./credentials.md)

Vjerodajnice pohranjuju API ključeve i tajne koje koriste čvorovi workflow-a. Dodajte ih na kartici [Vjerodajnice](../tabs/credentials-tab.md) i referencirajte ih po imenu ili ID-u u čvorovima kao što su [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) i [Redis](../nodes/redis-node.md). Šifrirane su u mirovanju, mogu se dijeliti s korisnicima ili [timovima](./teams.md), a također se mogu referencirati u [Expression DSL](./expression-dsl.md) putem `$credentials.Name`.

Pogledajte također [Vjerodajnice](../tabs/credentials-tab.md), [Dijeljenje vjerodajnica](./credentials-sharing.md) i [Integracije trećih strana](./integrations.md).

### [Dijeljenje vjerodajnica](./credentials-sharing.md)

Vjerodajnice se mogu dijeliti s drugim korisnicima putem e-maila ili s timovima; svi članovi tima dobivaju pristup kada se vjerodajnica dijeli s timom. Dijeljene vjerodajnice pojavljuju se s indikatorom na kartici [Vjerodajnice](../tabs/credentials-tab.md). Tijekom izvođenja, kontekst vlasnika workflow-a spaja vlastite, korisnički dijeljene i timski dijeljene vjerodajnice. Koristite `$credentials.CredentialName` u izrazima ili postavite credentialId u podacima čvora.

Pogledajte također [Vjerodajnice](./credentials.md), [Timovi](./teams.md) i [Integracije trećih strana](./integrations.md).

### [Timovi](./teams.md)

Timovi omogućuju dijeljenje workflow-a, vjerodajnica, globalnih varijabli, vektorskih spremišta i datoteka s Drive-a s grupom korisnika odjednom. Kreirajte timove s kartice [Timovi](../tabs/teams-tab.md) i dodajte članove putem e-maila. Dijelite resurse s timom iz relevantnih dijaloških okvira za dijeljenje; svi članovi tada imaju pristup. Kreator može uređivati i brisati tim; brisanje tima uklanja sve dijeljene resurse tima.

Uparuje se s [Dijeljenjem vjerodajnica](./credentials-sharing.md), [Globalnim varijablama](./global-variables.md) i [Enterprise](./enterprise.md).

### [Paralelno izvršavanje](./parallel-execution.md)

Heym izvršava čvorove paralelno kada nemaju međusobne ovisnosti. Izvršitelj gradi DAG i izvršava čvorove na istoj razini istovremeno s grupom niti; čim jedan čvor završi, njegovi downstream čvorovi se zakazuju. Koristite čvor [Merge](../nodes/merge-node.md) za kombiniranje paralelnih grana kada je to potrebno. Više izvršavanja workflow-a izvršava se istovremeno; svako izvršavanje je izolirano. [SSE Streaming](./sse-streaming.md) način emitira događaje kada čvorovi završe. 

Pogledajte također [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) i [Povijest izvršavanja](./execution-history.md).
### [Arhitektura Agenta](./agent-architecture.md)

[Agent Node](../nodes/agent-node.md) podržava podagente (orchestrator poziva druge agent čvorove putem call_sub_agent), pod-workflows (agent poziva druge workflows putem call_sub_workflow), vještine (sadržaj instrukcija i Python alati iz .zip ili .md), te [MCP](../tabs/mcp-tab.md) klijentske veze. Orkestrator alat izvršava pozive podagenta i pod-workflowa; ostali alati idu na Python, MCP ili izvršitelje vještina. Maksimalna dubina ugniježdenosti za podagente i pod-workflows je 5. Petlja pozivanja alata uključuje automatsku kompresiju konteksta: prije svake iteracije, procjenjuje se korištenje tokena i ako premaši 80% prozora konteksta modela, srednje poruke se sažimaju koristeći isti model, zadržavajući sustavni prompt, prvu korisničku poruku i posljednju korisničku poruku netaknutima.

Pogledajte također [Agent Node](../nodes/agent-node.md), [Trajna Memorija Agenta](./agent-persistent-memory.md), [Čovjek u Petlji](./human-in-the-loop.md) i [MCP](../tabs/mcp-tab.md).

### [Trajna Memorija Agenta](./agent-persistent-memory.md)

Opcionalni per-[Agent Node](../nodes/agent-node.md) graf znanja pohranjen u Postgresu: entiteti, tipovi, svojstva i usmjereni odnosi. Kada je `persistentMemoryEnabled` postavljen na true, graf se sažima u sustavni prompt pri svakom izvođenju; nakon uspješnih završetaka, [LLM](../nodes/llm-node.md) u pozadini izvlači strukturirane ažuriranja. REST CRUD se nalazi pod `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Uređivač se otvara iz ružičaste kontrole mozga na čvoru.

Pogledajte također [Agent Node](../nodes/agent-node.md), [Arhitektura Agenta](./agent-architecture.md) i [Izvršavanja](../tabs/traces-tab.md).

### [Čovjek u Petlji](./human-in-the-loop.md)

Čovjek u petlji omogućuje [Agent Node](../nodes/agent-node.md) da zatraži odobrenje na specifičnim kontrolnim točkama, stvara javnu stranicu `/review/{token}` i čeka da ne-prijavljeni recenzent prihvati, izmijeni ili odbije tekst recenzije u Markdown formatu. HITL-om omogućeni agenti također izlažu `review` izlaznu ruku kako biste mogli obavijestiti [Slack](../nodes/slack-node.md), [Pošalji Email](../nodes/send-email-node.md) ili druge kanale dok je izvođenje na čekanju. Tekst HITL na razini čvora koristi se kao smjernice za odobrenje, dok se sažetak javne stranice generira iz samog zahtjeva za recenziju. Čekajući izvođenja pojavljuju se u [Povijesti Izvršavanja](./execution-history.md) odmah, mogu se dogoditi više od jednom u istom izvođenju i nastavljaju se iz točno pohranjenog snimka workflowa nakon što je svaka odluka podnesena.

Pogledajte također [Agent Node](../nodes/agent-node.md), [Portal](./portal.md), [Povijest Izvršavanja](./execution-history.md) i [Pošalji Email](../nodes/send-email-node.md).

### [Webhookovi](./webhooks.md)

Workflows se mogu aktivirati putem [HTTP](../nodes/http-node.md) na `POST /api/workflows/{workflow_id}/execute`, ili se streamaju inkrementalno s `POST /api/workflows/{workflow_id}/execute/stream`. Tijelo zahtjeva se prosljeđuje kao tijelo [Input](../nodes/input-node.md) čvorovima; zaglavlja i parametri upita dostupni su u [Expression DSL](./expression-dsl.md) izrazima. Konfigurirajte autentifikaciju po workflowu: anonimno, JWT ili prilagođeni zaglavlje. Opcionalno keširanje odgovora, ograničavanje brzine i dijalog Uredi s cURL alatom svi se nalaze na workflowu i primjenjuju se na oba načina. Uz [ograničenje istodobnosti](./webhooks.md#concurrency-limit-and-queued-runs), poziv koji mora čekati umjesto toga prima `202 Accepted` s ID-om izvođenja i URL-om statusa.

Pogledajte također [Input](../nodes/input-node.md), [Izvršni Tokeni](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) i [Struktura Workflowsa](./workflow-structure.md).

### [Izvršni Tokeni](./execution-tokens.md)

Izvršni tokeni su scoped JWT-ovi koji omogućuju pristup izvršavanju i stream endpointima jednog workflowa. Kada workflow koristi JWT autentifikaciju, tokeni omogućuju vanjskim skriptama, CI pipeline-ima i integracijama da pozivaju workflow bez dijeljenja korisničke sesije. Svaki token nosi `wid` claim koji ga veže za jedan workflow, `jti` koji se koristi za trenutnu opoziv, i konfigurabilni TTL (60 sekundi do 10 godina). Kreirajte, odaberite i opozovite tokene izravno iz dijaloga **Run with cURL** — odabrani token automatski se ugrađuje u generiranu naredbu.

Pogledajte također [Webhookovi](./webhooks.md), [Sigurnost](./security.md) i [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

cURL dijalog može prebaciti [webhook](./webhooks.md) izvršavanje u način rada Server-Sent Events. Ovo proizvodi `execution_started`, `node_start`, `node_complete` i `execution_complete` događaje u stvarnom vremenu, dodaje `--no-buffer` u generiranu cURL naredbu, i omogućuje vam konfiguriranje poruka za početak po čvorovima kao što su `[START] LLM` ili prilagođeni tekst za vanjske terminalne korisnike.

Pogledajte također [Webhookovi](./webhooks.md), [Povijest Izvršavanja](./execution-history.md) i [LLM](../nodes/llm-node.md).
### [Okidači](./triggers.md)

Workflows se pokreću putem okidačkih čvorova ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) primatelji) ili ulaznih točaka: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron raspored, Telegram webhook, Discord interakcijski webhook, IMAP upravitelj okidača, RabbitMQ potrošač ili pokretanje uređivača. Svaki okidač ima svoj vlastiti endpoint ili pozadinski proces; [Cron](../nodes/cron-node.md) se pokreće svake 60 sekundi, [Telegram Trigger](../nodes/telegram-trigger-node.md) čvorovi primaju webhookove bota, [Discord Trigger](../nodes/discord-trigger-node.md) čvorovi primaju potpisane interakcijske webhookove, a [IMAP Trigger](../nodes/imap-trigger-node.md) čvorovi rade na svom konfiguriranom intervalu provjere. [Input](../nodes/input-node.md) čvorovi primaju tijelo, zaglavlja i upite iz webhook zahtjeva.

Pogledajte također [Tipovi čvorova](./node-types.md), [Webhooks](./webhooks.md) i [Paralelna izvršavanja](./parallel-execution.md).

### [Povijest izvršavanja](./execution-history.md)

Povijest izvršavanja bilježi pokretanja workflows-a: ulaze, izlaze, rezultate čvorova, status i izvor okidača. Pristupite joj iz alatne trake uređivača, prikaza dokumenata, zaglavlja nadzorne ploče ili prikaza [Evaluacija](../tabs/evals-tab.md). Povijest po workflow-u prikazuje pokretanja za otvoreni workflow; prikaz cjelokupne povijesti pokazuje pokretanja kroz workflows i chat. Trenutno pokrenuta izvršavanja pojavljuju se na vrhu oba dijaloga s akcijama **Otvorite uživo** i **Otkaži**. Otvorite uživo povezuje uređivač s postojećim izvršavanjem putem [SSE](./sse-streaming.md), obnavlja dovršene čvorove, pulsira trenutne i čekajuće čvorove te dodaje Debug logove bez pokretanja novog izvršavanja. Donesite na Canvas učitava ulaze i izlaze čvorova dovršenog pokretanja za ponovno pokretanje ili otklanjanje pogrešaka; duboka poveznica `/workflows/{workflowId}/{executionId}` podržava i uživo i dovršena izvršavanja. Pokretanja koja su pauzirana uz [Human-in-the-Loop](./human-in-the-loop.md) odmah se pohranjuju kao `pending`, uključujući javnu URL adresu za pregled i sve obavijesne čvorove izvršene iz agentove `review` grane. Ako se poslužitelj ponovno pokrene usred izvršavanja, prekinuta izvršavanja se automatski oporavljaju: ponovo se pokreću od nule s istim ulazima i prikazuju se kao dovršena (označena **Oporavljeno**), kontrolirana prekidačem **Auto-recover runs** po workflow-u koji može umjesto toga zabilježiti kao `skipped`.

Pogledajte također [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) i [Izvršenja](../tabs/traces-tab.md).

### Istaknuta izvršavanja

Nakon uživo izvršavanja — ili nakon **Donesite na Canvas** — pojavljuje se odbačivi **Istaknuti izvršavanja** iskačući prozor u gornjem desnom kutu Platna, navodeći što je svaki čvor proizveo u redoslijedu izvršavanja. To je brz način za pregled izlaza po čvorovima bez otvaranja svakog čvora; zatvorite ga s **✕**, a ponovno se otvara pri sljedećem izvršavanju. Istaknuti izlazi također se prikazuju na pokretanjima nadzorne ploče. Pogledajte [Povijest izvršavanja](./execution-history.md) za detalje.

### [Povijest izmjena](./edit-history.md)

Povijest izmjena prati spremljene verzije workflows-a (svako spremanje stvara verziju). Pregledajte popis, otvorite verziju da biste vidjeli razliku u odnosu na trenutni workflow ([čvorovi](./workflow-structure.md), rubovi, konfiguracija) i Vratite se da biste obnovili prethodnu verziju. Za razliku od [Povijesti izvršavanja](./execution-history.md), Povijest izmjena prati promjene strukture, a ne pokretanja.

Pogledajte također [Povijest izvršavanja](./execution-history.md), [Struktura workflows-a](./workflow-structure.md) i [Značajke Platna](./canvas-features.md).

### Workflow pogreške

Workflow može odrediti drugi workflow koji će se pokrenuti kada dođe do pogreške. Konfigurirajte ga u panelu **Svojstva** na razini workflow-a (prikazan kada nijedan čvor nije odabran) pod **U slučaju pogreške, pokreni workflow**. Samo vlasnik workflow-a može postaviti, promijeniti ili ukloniti ovu opciju; pogledajte [Postavke samo za vlasnike](./workflow-organization.md#owner-only-settings). Kada se pokretanje na najvišoj razini završi s neobrađenom pogreškom, odabrani workflow pogreške se pokreće i prima kontekst pogreške (id i naziv neuspješnog workflow-a, id pokretanja, poruku o pogrešci, oznaku i tip neuspješnog čvora te vremensku oznaku). Ako platno već sadrži čvor [Error Handler](../nodes/error-handler-node.md), lokalni upravitelj ima prednost i workflow pogreške se **ne** poziva. Sam workflow pogreške se pokreće izravno, tako da nikada ne pokreće vlastiti workflow pogreške.

Obuhvaća svako ne-test pokretanje na najvišoj razini: oba izvršna endpointa, [Portal](./portal.md) i svaki okidač, uključujući [cron](../nodes/cron-node.md), okidače chat platformi, e-poštu, redove, [MCP](../tabs/mcp-tab.md) i widgete nadzorne ploče. Uz omogućenu [Distribuciju opterećenja](./cluster.md) ovo ostaje nepromijenjeno, uključujući pokretanja koja je izvršio radnik: neuspješni čvor se vraća s rezultatom, a workflow pogreške se tada distribuira kao i svako drugo pokretanje, tako da čvor unutar njega koji mora raditi na glavnoj instanci i dalje radi. Dva slučaja su namjerno izostavljena, jer ishod workflow-a još nije poznat: pokretanje koje nijedna instanca nikada nije izvršila i čekanje koje je isteklo dok se pokretanje možda još odvija. Također se **ne** pokreće ručnim testnim pokretanjima na platnu.
### Workflow Timeout

Svaki workflow može postaviti **workflow timeout** u sekundama u panelu **Svojstva** na razini workflowa. `0` (zadano) onemogućuje ovu opciju. Kada je postavljen, izvršavanje koje premaši postavljeni limit zaustavlja se na sljedećoj granici čvora i bilježi se kao neuspješno izvršavanje s greškom "timed out". Timeout se primjenjuje na ručna, API i pokrenuta izvršavanja. Dugi [Wait](../nodes/wait-node.md) čvorovi se odmah prekidaju umjesto da blokiraju tijekom cijelog trajanja.

### Ograničenje istodobnosti

Svaki workflow može ograničiti koliko se produkcijskih izvođenja izvršava odjednom pomoću opcije **Ograničenje istodobnosti** na ploči **Properties** na razini workflowa; vlasnik i suradnici s pristupom za uređivanje mogu to promijeniti, a prema zadanim je postavkama isključeno. Kada se dosegne ograničenje, nova izvođenja s [webhook](./webhooks.md#concurrency-limit-and-queued-runs) i [streaming](./sse-streaming.md) endpointa, iz [Portala](./portal.md), iz [Quick Drawera](./quick-drawer.md), iz [MCP-a](../tabs/mcp-tab.md) i svakog [triggera](./triggers.md) čekaju u FIFO (prvi unutra, prvi van) redu čekanja, koji se broji na svim instancama [clustera](./cluster.md). Testna izvođenja editora, pozivi pod-workflowa, [Evals](../tabs/evals-tab.md) i nastavci nakon pregleda nikada se ne stavljaju u red čekanja, a izvođenja kartica na [Boardu](../tabs/board-tab.md), prijenosi datoteka, izvođenja pokrenuta alatom run-workflow AI asistenta i workflowi obavijesti o upozorenjima pokreću se bez čekanja na mjesto. Poziv webhooka koji mora čekati odmah dobiva `202 Accepted` s `execution_id`, URL-om statusa koji odgovara istim vjerodajnicama, svojim položajem, veličinom reda čekanja i brojem pokrenutih izvođenja; MCP klijent dobiva isto i ispituje alat `heym_execution_status`. Opcionalna **Maksimalna veličina reda** odbija dodatne pozive s `429`, a opcionalno **Maksimalno čekanje** bilježi izvođenje koje je predugo čekalo kao `expired`. Izvođenja na čekanju pojavljuju se u [Povijesti izvršavanja](./execution-history.md) kao **U redu n/m** i tamo se mogu otkazati.

### Ušteđeno Vrijeme

Svaki workflow može zabilježiti **procijenjeno vrijeme ušteđeno po izvršavanju** (u minutama), postavljeno u panelu **Svojstva** na razini workflowa. [Analytics](../tabs/analytics-tab.md) kartica agregira ovo kroz odabrani raspon kao ukupnu statistiku **Ušteđeno Vrijeme** (zbroj procjena svakog workflowa × njegovih uspješnih izvršavanja). Najviše korišteno također navodi taj zbroj po workflowu; **Nije postavljeno** otvara polje za procjenu kada nije postavljeno. [Workflow Analysis](./workflow-analysis.md) izvještaj preporučuje postavljanje procjene kada nijedna nije konfigurirana.

### [Postavke](./user-settings.md)

Dijalog Postavke (otvoren iz Vaše avatar slike u zaglavlju) ima četiri kartice: Profil (Gravatar slika, prikazano ime, Pravila korisnika), [Sigurnost](./security.md) (promjena lozinke), Glas ([ElevenLabs TTS/STT](./chat-voice.md)), i Promatranje (samo za čitanje [OpenTelemetry](./opentelemetry.md) status). Pravila korisnika su prilagođene upute umetnute u svaki AI zahtjev, uključujući graditelja workflowa i [Chat](../tabs/chat-tab.md), tako da možete jednom postaviti jezik, ton, stil kodiranja ili konvencije workflowa. Politika lozinki i upravljanje [MCP](../tabs/mcp-tab.md) API ključem također su dostupni.

Pogledajte također [Sigurnost](./security.md), [Chat Glas](./chat-voice.md), [OpenTelemetry Praćenje](./opentelemetry.md), i [AI Asistent](./ai-assistant.md).

### [OpenTelemetry Praćenje](./opentelemetry.md)

Heym može emitirati OpenTelemetry tragove za svako izvršavanje workflowa i izvršavanje čvora: korijenski `heym.workflow.execute` span po izvršavanju i dječji `heym.node.execute` span po čvoru, s korištenjem modela i tokena vezanim uz LLM i agent čvorove. Spans se izvoze putem OTLP/HTTP na bilo koji kompatibilni backend (Jaeger, Grafana Tempo, Honeycomb, Datadog), a W3C kontekst traganja propagira se kroz dolazne webhooks, odlazni HTTP i pod-workflows. Praćenje je prema zadanim postavkama onemogućeno i konfigurira se s `HEYM_OTEL_*` [varijablama okruženja](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); aktivni status prikazuje se na kartici Promatranje u [Postavkama](./user-settings.md).

Pogledajte također [Povijest Izvršavanja](./execution-history.md), [Tragovi](../tabs/traces-tab.md), i [Webhooks](./webhooks.md).

### [Preuzimanje i Uvoz](./download-import.md)

Izvezite trenutni workflow kao JSON iz alatne trake Urednika (gumb Preuzmi); datoteka uključuje čvorove i rubove. Uvezite povlačenjem JSON datoteke na karticu [Workflows](../tabs/workflows-tab.md) (stvara novi workflow) ili na platno (zamjenjuje ili spaja). JSON mora uključivati niz čvorova; naziv i rubovi su opcionalni. Koristite ga za sigurnosne kopije, dijeljenje ili migraciju između instanci.

Pogledajte također [Struktura Workflowa](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md), i [Značajke Platna](./canvas-features.md).

### [Portal](./portal.md)

Portal izlaže workflowe kao javne chat UI-eve na `/chat/{slug}`. Konfigurirajte portal_enabled, slug, opcionalnu autentifikaciju (korisnici portala), streaming i prijenos datoteka po workflowu. Krajnji korisnici komuniciraju putem chat sučelja bez prijave u Heym; izlazi slika mogu se prikazati u chatu. Workflowi u portalu također mogu prebaciti na [Human-in-the-Loop](./human-in-the-loop.md) stranice za pregled kada [Agent Node](../nodes/agent-node.md) zahtijeva odobrenje, dok agentova `review` grana šalje obavijesti na druge kanale. Koristite ga za interne alate, chatbote usmjerene na korisnike i obrasce pokretane AI-jem.

Pogledajte također [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md), i [Drive](./drive.md).

### [Generiranje Datoteka](./file-generation.md)

Vještine mogu generirati datoteke kao što su PDF, DOCX, CSV, JSON i slike tijekom izvršavanja pisanjem u `_OUTPUT_DIR` radni prostor. Heym automatski bilježi te datoteke, pohranjuje ih i izlaže metapodatke o preuzimanju pod `_generated_files`, koji se zatim mogu upravljati s [Drive node](../nodes/drive-node.md) ili pregledati na kartici [Drive](../tabs/drive-tab.md).

Pogledajte također [Agent Node](../nodes/agent-node.md), [Drive](./drive.md), i [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive je zajednička pohrana i sloj dijeljenja za datoteke generirane vještinama. Omogućuje pregledavanje datoteka, stvaranje javnih ili lozinkom zaštićenih veza, primjenu ograničenja trajanja i preuzimanja, dijeljenje datoteka samo za čitanje s Vašim timovima, i upravljanje tim datotekama programatski s [Drive node](../nodes/drive-node.md) ili ručno s kartice [Drive](../tabs/drive-tab.md).

Pogledajte također [Drive](../tabs/drive-tab.md), [Generiranje Datoteka](./file-generation.md), i [Portal](./portal.md).
### [Sigurnost](./security.md)

Heym provodi politiku lozinki (duljina, velika slova, mala slova, brojke), pohranjuje pristupne tokene u HttpOnly kolačićima i rotira osvježavajuće tokene prilikom korištenja. Ograničenje brzine primjenjuje se na prijavu, registraciju i [Portal](./portal.md) prijavu. [Vjerodajnice](./credentials.md) su šifrirane u mirovanju s AES-256 (Fernet). [MCP](../tabs/mcp-tab.md) API ključ koristi se za autentifikaciju klijenata; sigurnost sadržaja dostupna je putem [Guardrails](./guardrails.md) na [LLM](../nodes/llm-node.md) i [Agent Node](../nodes/agent-node.md) čvorovima. [Tokeni izvršavanja](./execution-tokens.md) pružaju JWT-ove ograničene na svaki workflow za vanjske pozivatelje.

Pogledajte također [Tokeni izvršavanja](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) i [Vjerodajnice](./credentials.md).

### [Jedinstvena prijava](./sso.md)

Heym autentificira korisnike prema bilo kojem vanjskom OpenID Connect pružatelju - Keycloak, Okta, Entra ID, Auth0, Google - konfiguriranom u vrijeme izvođenja putem **Postavki → SSO** od strane administratora instance navedenog u `HEYM_ADMIN_EMAILS`. Unose se samo URL izdavatelja i vjerodajnice klijenta; svaki endpoint dolazi iz dokumenta za otkrivanje pružatelja, tako da nijedan pružatelj nije hardkodiran. Prijava koristi Authorization Code s PKCE, a ID token se verificira prema objavljenim ključevima pružatelja. Računi se mapiraju prema `(issuer, subject)` prvo, a verificirana e-pošta drugo, s opcionalnim automatskim dodjeljivanjem ograničenim na dozvoljenu domenu e-pošte. Prijava putem lozinke ostaje dostupna uz SSO i može se isključiti nakon uspješnog testa veze, pri čemu su računi iz `HEYM_ADMIN_EMAILS` izuzeti kako neispravno konfigurirani pružatelj ne bi mogao zaključati instancu.

Pogledajte također [Postavke](./user-settings.md), [Sigurnost](./security.md) i [Revizijski zapis](./audit.md).

### [Distribucija opterećenja](./cluster.md)

Usmjerite drugu Heym instancu na istu bazu podataka i ona se pridružuje kao radnik. Pozadinski zadaci - cron, webhookovi, pozivi MCP alata, okidači chata - dijele se između instanci prema postotku koji administrator instance postavlja pod **Postavke → Instance**, s statusom svake instance, latencijom baze podataka i verzijom u jednoj tablici. Instance nikada ne komuniciraju međusobno: Postgres nosi rad, tako da radnik ne treba otvoreni port niti put natrag do glavne instance. Rad koji dodiruje lokalne datoteke, radno okruženje kodnog agenta ili instalirani dodatak uvijek se izvršava na glavnoj instanci, a panel izvještava koliko je to trajalo u posljednja 24 sata, tako da operater može vidjeti kada postotci ne mogu pomoći. Svako izvršavanje u povijesti imenuje instancu koja ga je izvršila, a oba dijaloga povijesti mogu se filtrirati prema tome.

Pogledajte također [Postavke](./user-settings.md), [Izvršavanja](../tabs/traces-tab.md) i [Analitika](../tabs/analytics-tab.md).

### [Integracije trećih strana](./integrations.md)

Heym se povezuje s vanjskim uslugama putem vjerodajnica pohranjenih na kartici [Vjerodajnice](../tabs/credentials-tab.md) (šifrirane u mirovanju). Podržani tipovi uključuju OpenAI, Google, Decision Model za [Decision node](../nodes/decision-node.md), Model Router za automatski odabir modela (vidi dolje), GitHub za [GitHub node](../nodes/github-node.md) i MCP integracije, Jira za [Jira node](../nodes/jira-node.md), Notion za [Notion node](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP za [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header i FlareSolverr za [Crawler](../nodes/crawler-node.md). Svaki tip dokumentira potrebna polja; vjerodajnice se mogu dijeliti s korisnicima ili [timovima](./teams.md) i referencirati po imenu u čvorovima ili kao `$credentials.Name` u izrazima.

### Model Router (Automatski model)

**Model Router** vjerodajnica odabire model po zahtjevu umjesto da drži ključ. Pohranjuje vjerodajnicu modela odluke plus popis vaših postojećih OpenAI/Google/Custom vjerodajnica, svaka s kriterijima koji govore kada se treba koristiti, i pojavljuje se u svakom odabira modela s jednim modelom nazvanim **Automatski**.

Izvršavanja, dnevnik izvršavanja na platnu i prikaz raspona prikazuju obje polovice izbora, na primjer `Automatski model / GPT-5`, dok se trošak pripisuje modelu koji je izvršen. Automatski model se ne može kombinirati s Responses API, Batch načinom ili izlazom slika. Pogledajte [Vjerodajnice](./credentials.md) za potpuno ponašanje.

Pogledajte također [Vjerodajnice](./credentials.md), [Dijeljenje vjerodajnica](./credentials-sharing.md) i [Timove](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blokiraju nesigurne ili neželjene poruke korisnika prije nego što dođu do [LLM](../nodes/llm-node.md) ili [Agent Node](../nodes/agent-node.md). Omogućite ih po čvoru i odaberite kategorije koje treba blokirati (npr. nasilje, govora mržnje, seksualni sadržaj, samopovređivanje, uznemiravanje, ilegalne aktivnosti). Postavite osjetljivost (niska, srednja, visoka). Kada se aktiviraju, čvor baca grešku koju možete uhvatiti s [Handlerom grešaka](../nodes/error-handler-node.md). Detekcija koristi API za moderaciju pružatelja ili klasifikaciju LLM-a ovisno o vrsti vjerodajnica.

Pogledajte također [Sigurnost](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) i [Handler grešaka](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise pokriva komercijalno licenciranje, profesionalnu podršku i usluge implementacije za timove koji koriste Heym u produkciji. Uključuje pomoć u arhitekturi workflow-a, onboarding, smjernice za Kubernetes i skaliranje, prioritetnu podršku te prilagođeni razvoj naprednih značajki kao što su [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) i [Portal](./portal.md).

Također pogledajte [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) i [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work je drugo sučelje za poslovne timove izgrađeno povrh Heyma. Korisnici opišu posao, odgovore na nekoliko pitanja i dobiju testirani workflow, a zatim rade putem stranica, odobrenja i popisa Aktivnosti gdje svako izvršavanje nosi naziv. Administratori instance povezuju ga u **Postavke → Heym Work** pomoću njegove adrese i integracijskog ključa; ima vlastitu licencu Heym tima.

Također pogledajte [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) i [Human-in-the-Loop](./human-in-the-loop.md).

---

## Kartice nadzorne ploče

### [Workflows](../tabs/workflows-tab.md)

Kartica Workflows je zadani prikaz nadzorne ploče. Prikazuje popis u dva okna: workflow-e i mape kao gusti redovi s lijeve strane, te pregled odabranog workflow-a s desne strane s njegovim trigger-om, posljednjim izvršavanjem i koracima, uz Open Workflow i Run Now. Svaki redak nosi oznaku statusa (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) po kojoj se može filtrirati putem padajućeg izbornika Status. Workflow bez trigger čvora označen je prema načinu na koji je njegovo najnovije izvršavanje započelo - API za HTTP poziv, SubWorker za roditeljski workflow, Portal za njegov javni chat - i ostaje Manual dok se ne izvrši. Mape i podmape upravljaju [organizacijom](./workflow-organization.md). Kreirajte workflow-e s New Workflow, povucite i ispustite JSON za [uvoz](./download-import.md), te uređujte ili brišite iz akcija u redu. Workflow-i se mogu premještati između mapa; brisanje se zakazuje (kanta) prije trajnog uklanjanja.

Također pogledajte [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) i [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Pogledajte demo Workflows</a></p>

### [Board](../tabs/board-tab.md)

Agentički kanban board gdje su kartice trajni poslovi. Konfigurirajte svaku kolonu s narudžbom workflow lanca; premještanjem kartice u kolonu pokreće se lanac s punim kontekstom kartice (sadržaj, komentari, povijest, prethodni izlazi). Rezultati se vraćaju na karticu — zeleni za uspjeh, crveni za neuspjeh, žuti tijekom izvršavanja. Naknadni krugovi ponovo pokreću trenutni lanac kolone sa svime što je do sada prikupljeno, što omogućuje iterativno planiranje. Izvršavanja se bilježe u [Execution History](./execution-history.md) s `board` trigger izvorom. Dok je izvršavanje kartice aktivno, **Open live** otvara točno to izvršavanje na animiranom platnu s inkrementalnim Debug zapisima.

Također pogledajte [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) i [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Pogledajte demo Board</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Kartica Templates omogućuje vam spremanje i ponovnu upotrebu predložaka workflow-a (cjelovitih workflow-a) i predložaka čvorova (jednostavno konfigurirani čvorovi). Kreirajte predloške workflow-a iz uređivača (Share as Template) i predloške čvorova desnim klikom na čvor. Pretražujte prema vidljivosti (Svi ili Specifični korisnici/[timovi](./teams.md)), primijenite predložak za kreiranje novog workflow-a ili dodajte čvor na platno, te upravljajte svojim dijeljenim predlošcima.

Također pogledajte [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) i [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Pogledajte demo Templates</a></p>

### [Variables](../tabs/global-variables-tab.md)

Kartica Variables upravlja [Global Variable Store](./global-variables.md). Kreirajte, uređujte i brišite globalne varijable; postavite ime, vrijednost i tip vrijednosti (Auto, String, Number, Boolean, Array, Object). Varijable su korisnički opsežne i traju kroz izvršavanja. Referencirajte ih u bilo kojem workflow [izrazu](./expression-dsl.md) kao `$global.variableName`. Varijable se mogu dijeliti s drugim korisnicima ili [timovima](./teams.md).

Također pogledajte [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) i [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Pogledajte demo Variables</a></p>
### [Chat](../tabs/chat-tab.md)

Zavičajni tab Chat predstavlja Heymovu dugotrajnu površinu za rad s agentima koja omogućuje upravljanje radnim prostorom putem razgovora. Odaberite [vjerodajnicu](./credentials.md) i model, a zatim zatražite od Chata da odgovori na pitanja, pregleda definicije workflow-a, pokrene postojeće workflow-e, sažme izvršavanja i rasporede, izvijesti o povijesti rada pojedinog workflow-a (broj izvršavanja, razdjelu statusa, posljednje izvršavanje i detalje jednog izvršavanja na zahtjev), izvijesti koji se izvršavanja trenutno odvijaju (s proteklim vremenom, trenutnim čvorom i poveznicom na svako aktivno izvršavanje), riješi neodgovorene ljudske recenzije, stvara i revidira workflow-e koristeći isti AI Builder motor koji se koristi u uređivaču, ili dodaje kartice na kanban ploče koristeći prirodni jezik. Nove kartice uvijek započinju u prvom stupcu odabrane ploče; kada su dostupne više ploča i nijedna nije imenovana, Chat prikazuje odabir ploče prije nego što stvori karticu.

Chat nastavlja raditi u pozadini nakon zatvaranja preglednika. Dok se odgovor prenosi, možete slati dodatne poruke; Heym ih pohranjuje u red čekanja podržan bazom podataka, omogućuje vam uređivanje ili brisanje poruka u redu prije nego što započnu, i izvršava ih redom kada trenutni odgovor završi. Ako asistent treba detalje o planiranju i postavi pojašnjavajuća pitanja, red čekanja se pauzira dok ne odgovorite na ta pitanja, a zatim se nastavlja nakon odgovora o planiranju.

Odgovori se prenose s markdown-om, inline slikama, karticama za pregled workflow-a, sklopivim karticama za pozivanje alata, korištenjem konteksta i automatskom kompresijom konteksta. Chat podržava privitke, glasovni unos, reprodukciju naglas, akcije kopiranja, brze upite, Pravila korisnika iz [Postavki](./user-settings.md), i [globalne varijable](./global-variables.md) kao kontekst.

Pogledajte također [AI Assistant](./ai-assistant.md), [Vjerodajnice](./credentials.md) i [Postavke](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Pogledajte Chat demo</a></p>

### [Vjerodajnice](../tabs/credentials-tab.md)

Tab Vjerodajnice upravlja API ključevima i tajnama koje koriste čvorovi. Dodajte vjerodajnice prema vrsti (OpenAI, Google, Prilagođeno, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere itd.), imenujte ih i referencirajte ih u čvorovima workflow-a. Uredite ili obrišite s kartice; dijelite s korisnicima putem e-pošte ili s [timovima](./teams.md). Sve vrijednosti su šifrirane u mirovanju i maskirane u korisničkom sučelju.

Pogledajte također [Vjerodajnice](./credentials.md), [Dijeljenje vjerodajnica](./credentials-sharing.md) i [Integracije trećih strana](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Pogledajte demo Vjerodajnica</a></p>

### [Vektorska spremišta](../tabs/vectorstores-tab.md)

Tab Vektorska spremišta upravlja vektorskim spremištima koja koriste [RAG](../nodes/rag-node.md) čvorovi. Stvorite spremište s imenom i vektorskom spremišnom [vjerodajnicom](./credentials.md) — *RAG: Qdrant + OpenAI* (vanjski Qdrant) ili *RAG: Psql + OpenAI* (Heymov vlastiti Postgres putem pgvector), što određuje pozadinu spremišta — opcionalno postavite naziv kolekcije, a zatim učitajte dokumente (PDF, TXT itd.). Upravljajte sadržajem (pregled, brisanje izvora), uredite detalje spremišta i dijelite spremišta s korisnicima. U [RAG](../nodes/rag-node.md) čvoru, odaberite Bazu podataka, odaberite vektorsko spremište i izvršite operacije umetanja, ažuriranja, brisanja ili pretraživanja.

Pogledajte također [Qdrant RAG](../nodes/rag-node.md), [Vjerodajnice](./credentials.md) i [Timove](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Pogledajte demo Vektorskih spremišta</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP kartica konfigurira integraciju Model Context Protocol. Heym podržava dva načina rada:

**Zadani poslužitelj** – Jedan jedini endpoint na `/api/mcp/sse` izlaže sve workflows omogućene za MCP. Pregledajte i regenerirajte svoj API ključ, kopirajte JSON klijent spreman za korištenje, povežite Cursor jednim klikom ili slijedite Claude postupak postavljanja s automatskom OAuth registracijom.

**Imenovani poslužitelji** – Kreirajte više izoliranih MCP endpointa, svaki s vlastitim URL-om temeljenim na UUID-u (`/api/mcp/servers/{uuid}/sse`) i neovisnim API ključem. Dodijelite specifične workflows svakom poslužitelju kako bi različiti AI klijenti ili timovi vidjeli samo alate koji su im potrebni. Svaki imenovani poslužitelj podržava iste metode autentifikacije (API ključ, Claude OAuth) i ima vlastite prečace za Copy JSON i Add to Cursor. Oba endpointa podržavaju SSE transport (GET) i Streamable HTTP transport (POST). Prebacivanje workflowa unutar imenovanog poslužitelja pomiče ga na vrh dodijeljenog popisa kako bi se promijenjeni redak zadržao u vidnom polju.

**Heym chat alat** – Bilo koji način rada također može izložiti [Chat](../tabs/chat-tab.md) motor kao jedan `heym_chat` alat, prebacujući se po površini s vlastitim LLM vjerodajnicama i modelom (automatski popunjenim iz Vašeg preferiranog modela u [Postavkama](./user-settings.md)). MCP klijent šalje jednu poruku na prirodnom jeziku `message`, a motor obavlja ostatak: izgradnju workflows u načinu izgradnje (spremanje, probno pokretanje do pet puta, popravak i provjera), pokretanje workflows, analitiku, izvršavanja, status uživo, rasporede, ploče i kartice, timove, globalne varijable, pretraživanje dokumentacije i odluke s ljudskim nadzorom. Mogućnosti dodane u Chat kasnije dostupne su kroz isti alat bez dodatne registracije. Svaki poziv pohranjuje se u povijesti Chat kartice kao razgovor označen oznakom i vraća `conversation_id` koji klijent može proslijediti za nastavak razgovora.

Pogledajte također [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) i [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Pogledajte MCP demonstraciju</a></p>

### [Izvršavanja](../tabs/traces-tab.md)

Kartica Izvršavanja prikazuje [LLM](../nodes/llm-node.md) tragove izvršavanja. Statistički zaglavlje iznad popisa sažima odabrani vremenski raspon s KPI karticama (Pozivi, Tokeni, Trošak, Prosječna Latencija, Postotak Grešaka) i tri grafikona — Tokeni po Modelu, Trošak po Modelu i Pozivi tijekom Vremena (složeni uspjeh naspram greške). Jedan **Odabir vremenskog raspona** (1h / 24h / 7d / 30d / Sve; zadano 7 dana) filtrira i grafikone i popis zajedno. Trošak se izračunava iz [LLM Troškovne Tablice](../tabs/datatable-tab.md#llm-cost-table-system-table) po korisniku; modeli bez cijena pojavljuju se kao upozorenje unutar linije koje se povezuje s njom. Otvorite bilo koji trag kako biste vidjeli zahtjeve i odgovore payloada, raspodjelu vremena (llm_ms, tools_ms, mcp_list_ms), pozive alata (ime, argumenti, rezultat) i uključene vještine. Prošireni događaji prikazuju JSON — uključujući MCP i JSON-RPC payloadove — kao sklopivo stablo s prvim nivoom otvorenim prema zadanim postavkama; **Stablo / Sirovo** vraća se na izvorni tekst, a neispravan JSON ostaje čitljiv. Koristite tragove za otklanjanje pogrešaka u ponašanju [Agent Node](../nodes/agent-node.md) i [LLM](../nodes/llm-node.md) te za kopiranje ili izvoz payloadova.

Pogledajte također [Povijest Izvršavanja](./execution-history.md), [Agent Node](../nodes/agent-node.md) i [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Pogledajte demonstraciju Izvršavanja</a></p>
### [Upozorenja](../tabs/alerts-tab.md)

Zavičaj Upozorenja definira pragovne uvjete unutar vremenskog okvira i obavještava Vas kada su ti uvjeti prekoračeni. Četiri vrste upozorenja pokrivaju pitanja koja operateri zapravo postavljaju: **prag greške** (je li došlo do neuspjeha više od N puta unutar okvira), **trajanje workflow-a** (jesu li izvršenja postala sporija, mjereno kao maksimalno, prosječno ili p95), **trošak tokena / USD** (je li potrošnja prekoračila proračun, riješeno kroz istu cjenovnu tablicu kao [Izvršenja](../tabs/traces-tab.md)), i **broj izvršenja** (je li se ovo izvršavalo daleko češće nego što bi trebalo). Svaka vrsta se ocjenjuje unutar okvira koji odaberete, nikada na temelju jednog događaja, jer jedan neuspješan rad predstavlja šum, a iznenadni porast je incident. Upozorenja prate jedan workflow ili svaki workflow kojem možete pristupiti.

Čarobnjak s pet koraka vodi Vas kroz vrstu, opseg, uvjet, odgovor i pregled. Korak Pregled **testira unatrag** uvjet prvo, izvještavajući koliko bi često bio aktiviran tijekom posljednjih 24 sata do 7 dana, tako da se prag koji je previše nizak uhvati prije nego što se spremi, a ne nakon što nekoga obavijesti. Opisujte što želite jednostavnim jezikom, a AI popunjava svaki korak koji može, označavajući svoje pretpostavke; djelomični zahtjev i dalje pomiče čarobnjaka naprijed, otvarajući prvi korak koji još treba odluku umjesto da Vas tjera da počnete iznova. Prema zadanim postavkama, upozorenje se aktivira jednom i ostaje tiho dok se metrika ne oporavi; umjesto toga, možete ga postaviti da se ponavlja u intervalima.

Na koraku odgovora, upozorenje može stvoriti i dodijeliti novi workflow koji će se izvršiti kada se aktivira, koristiti jedan koji već imate ili ne učiniti ništa. Aktivni payload nosi zabilježenu vrijednost, prag, okvir i workflow-e koji su doprinijeli broju, što je način na koji upozorenja dolaze do Slack-a, e-pošte ili Telegram-a koristeći čvorove koje već imate. Povijest aktiviranja bilježi što je bilo istinito u trenutku kada je svako upozorenje aktivirano i čuva se 90 dana; priznavanje aktiviranja mijenja oznaku iz Aktivno u Priznato bez pretvaranja da je uvjet ispunjen. [Chat](../tabs/chat-tab.md) kartica može odgovoriti na to koja upozorenja postoje i zašto ili kada je jedno aktivirano. Upozorenja se mogu dijeliti s korisnicima i [timovima](../tabs/teams-tab.md).

Pogledajte također [Analitiku](../tabs/analytics-tab.md), [Izvršenja](../tabs/traces-tab.md) i [Povijest izvršenja](./execution-history.md).

### [Analitika](../tabs/analytics-tab.md)

Kartica Analitika prikazuje metrike izvršenja i trendove. Sažeti statistički podaci uključuju ukupna izvršenja, stopu uspjeha, stopu grešaka, razdiobe latencije i ukupno **Vrijeme Ušteđeno** (zbroj procijenjenih minuta ušteđenih po izvršenju svakog workflow-a pomnoženih s njegovim uspješnim izvršenjima). Najčešće korištene prikazuju taj isti zbroj po workflow-u. Odaberite osnovni vremenski raspon (24h, 7d, 30d ili sve), opcionalno filtrirajte po workflow-u, a zatim povucite preko bilo kojeg grafikona kako biste istražili odabrani vremenski raspon. Grafikon i tablice workflow-a osvježavaju se prema odabiru, a automatsko osvježavanje održava metrike ažurnima. To dopunjuje [Povijest izvršenja](./execution-history.md) i [Raspoređeno](../tabs/scheduled-tab.md) prikaz kada trebate i prošle rezultate i nadolazeća izvršenja.

Pogledajte također [Povijest izvršenja](./execution-history.md), [Raspoređeno](../tabs/scheduled-tab.md) i [Evaluacije](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Pogledajte demo Analitike</a></p>

### [Nadzorna ploča](../tabs/dashboard-tab.md)

Kartica Nadzorna ploča je prostor u stilu Grafana gdje gradite mreže widgeta grafikona, svaki prikazan iz vlastitog skrivenog Heym workflow-a. Možete zadržati onoliko nadzornih ploča koliko trebate i dijeliti svaku s korisnicima ili timovima, u načinu samo za čitanje ili uređivanja; widgeti uvijek rade s vjerodajnicama vlasnika, tako da svi vide iste podatke. Opisujte metriku jednostavnim jezikom, a AI generira widget, ili dodajte jedan ručno i odaberite vrstu grafikona, pregledanu s uzorkom podataka: stupčasti, linijski, površinski, tortni, tablični, numerički, mjerač, raspršeni, proporcija, mjerač stupca, tekst ili HITL. HITL je karusel Vaših čekajućih ljudskih pregleda. Zaslon prikazuje `1/n na čekanju`. Ime workflow-a otvara to izvršenje na platnu. **Odobri**, **Zatraži promjene** i **Odbaci** rješavaju to, a ikona povijesti pored naslova widgeta otvara to izvršenje u dijalogu povijesti na istoj stranici. Widgeti pohranjuju svoje rezultate, mogu se fino podešavati s AI (svaka promjena se sprema u [Povijest izmjena](./edit-history.md)), klonirati zajedno s cijelim workflow-om, preurediti s Uredi, i povući ili promijeniti veličinu u načinu uređivanja. Tablice mogu prikazivati oznake statusa i povezivati svoje retke s detaljnom nadzornom pločom koja čita zapis kliknutog retka kao `$page.record`, a widget Run pokreće workflow s nadzorne ploče: na ispuštenoj datoteci, sa svojim ulaznim poljima ili pomoću gumba Pokreni. Budući da je svaki widget workflow, bilo koji podaci koje možete dohvatiti — [HTTP](../nodes/http-node.md) poziv, [BigQuery](../nodes/bigquery-node.md) upit, [RAG](../nodes/rag-node.md) pretraživanje ili [LLM](../nodes/llm-node.md) izlaz — mogu postati grafikon. Postavke widgeta HITL mogu ga suziti na preglede jednog workflowa ili na korak agenta ili Slack odobrenja u njemu; takav widget ih prikazuje svima koji mogu otvoriti taj workflow i skriven je od svih koji to ne mogu.

Pogledajte također [Čvor izlaza grafikona](../nodes/chart-output-node.md), [Analitiku](../tabs/analytics-tab.md) i [Povijest izvršenja](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Pogledajte demo Nadzorne ploče</a></p>
### [Evaluacije](../tabs/evals-tab.md)

Zavičaj Evaluacije (na `/evals`) omogućuje Vam stvaranje evaluacijskih paketa, dodavanje ili generiranje testnih slučajeva, optimizaciju prompta paketa i izvođenje evaluacija protiv [Agent Node](../nodes/agent-node.md) workflows. Odaberite jedan ili više modela, odaberite metodu ocjenjivanja (Točna podudarnost, Sadrži ili LLM-as-Judge), opcionalno dopustite da zaseban model ili [Decision Model](../nodes/decision-node.md) ocjenjuje odgovore LLM-as-Judge, postavite broj izvođenja po testu (uz temperaturu i napor razmišljanja za Točnu podudarnost i Sadrži), a zatim usporedite prolaz/neprolaz i izlaze po modelima. Pregledajte povijest izvođenja za prethodne evaluacije, uključujući suca koji je korišten u svakom izvođenju, ponovo pokrenite jedno s istim sucem, izvezite ga kao JSON i provjerite temeljno ponašanje u [Izvršavanjima](../tabs/traces-tab.md).

Pogledajte također [Agent Node](../nodes/agent-node.md), [Izvršavanja](../tabs/traces-tab.md) i [Povijest izvršavanja](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Pogledajte demo Evaluacija</a></p>

### [Timovi](../tabs/teams-tab.md)

Zavičaj Timovi omogućuje Vam stvaranje i upravljanje timovima. Stvorite tim, dodajte članove putem e-pošte i uklonite članove (kreator se ne može ukloniti). Dijelite [workflows](../tabs/workflows-tab.md), [predloške](../tabs/templates-tab.md), [vjerodajnice](../tabs/credentials-tab.md), [varijable](../tabs/global-variables-tab.md), [vektorska spremišta](../tabs/vectorstores-tab.md) i [Datoteke s diska](../tabs/drive-tab.md) s timovima iz njihovih dijaloga za dijeljenje; svi članovi tima dobivaju pristup. Uredite naziv i opis tima ili izbrišite tim (uklanja sve dijelove tima).

Pogledajte također [Timovi](./teams.md), [Dijeljenje vjerodajnica](./credentials-sharing.md) i [Organizacija workflows](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Pogledajte demo Timova</a></p>

### [Rasporedi](../tabs/scheduled-tab.md)

Zavičaj Rasporedi prikazuje sve aktivne [Cron](../nodes/cron-node.md) workflows na vizualnom kalendaru. Prebacite se između prikaza dana, tjedna i mjeseca kako biste vidjeli kada su Vaše automatizacije zakazane za izvođenje, a zatim se vratite na povezani [workflow](../tabs/workflows-tab.md) kada trebate urediti raspored.

Pogledajte također [Cron](../nodes/cron-node.md), [Analitika](../tabs/analytics-tab.md) i [Povijest izvršavanja](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Pogledajte demo Rasporeda</a></p>

### [Dnevnici](../tabs/logs-tab.md)

Zavičaj Dnevnici prikazuje Docker logs kontejnera za Heym stack (backend, frontend, PostgreSQL). Odaberite kontejner(e), filtrirajte prema razini loga (Sve, INFO, WARNING, ERROR, DEBUG) i pretražujte unutar logova. Koristite ga za otklanjanje pogrešaka i rješavanje problema. Za logove izvršavanja workflows (rezultati čvora, izlazi), koristite [Povijest izvršavanja](./execution-history.md), [Izvršavanja](../tabs/traces-tab.md) ili Debug panel u uređivaču umjesto toga.

Pogledajte također [Povijest izvršavanja](./execution-history.md), [Izvršavanja](../tabs/traces-tab.md) i [Značajke platna](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Pogledajte demo Dnevnika</a></p>

### [Tablica podataka](../tabs/datatable-tab.md)

Zavičaj Tablica podataka omogućuje Vam stvaranje i upravljanje strukturiranim tablicama podataka unutar Heym-a. Definirajte tipizirane stupce (string, broj, boolean, datum, JSON), upravljajte redovima s inline uređivanjem putem dvostrukog klika, uvezite/izvezite CSV i dijelite tablice s korisnicima ili [timovima](./teams.md) s pravima čitanja/pisanja. Koristite [DataTable node](../nodes/datatable-node.md) za pristup tablicama programatski u workflows. Prikvačeni **Sustav tablica** odjeljak na vrhu sadrži **LLM Troškovnu tablicu**: fiksno-shema prikaz cijena po modelu koji se učitava iz Helicone u pozadini (24-satni TTL, ručno osvježavanje), gdje svaki korisnik može nadjačati cijene ili dodati prilagođene redove za modele koje Helicone ne navodi. Ova pravila cijena pokreću KPI troškova i grafikon troškova po modelu na [Izvršavanjima](../tabs/traces-tab.md) zavičaju.

Pogledajte također [DataTable node](../nodes/datatable-node.md), [Izvršavanja](../tabs/traces-tab.md), [Struktura workflows](./workflow-structure.md) i [Timovi](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Pogledajte demo Tablice podataka</a></p>
### [Drive](../tabs/drive-tab.md)

Zavičajni kartica prikazuje sve datoteke generirane vještinama unutar Vaših workflows. Navodi svaku datoteku s imenom, tipom, veličinom, izvorom čvora, datumom stvaranja i stanjem dijeljenja s timom, te pruža kontrole za pretraživanje, autentificirano preuzimanje, dijeljenje, brisanje i paginaciju. To je nadzorna ploča koja prati [Generiranje datoteka](./file-generation.md), referencu [Drive](./drive.md) i [Drive čvor](../nodes/drive-node.md).

Pogledajte također [Drive](./drive.md), [Generiranje datoteka](./file-generation.md) i [Drive čvor](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Pogledajte Drive demonstraciju</a></p>

### [Suradnja na Platnu](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
