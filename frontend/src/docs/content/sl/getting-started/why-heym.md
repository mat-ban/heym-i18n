# Zakaj Heym

Heym je infrastruktura za izvajanje in upravljanje AI agentov v produkciji. En samostojno gostovan runtime pokriva vsako fazo življenjskega cikla agenta.

Prototip agenta potrebuje model, prompt in nekaj orodij. Produkcijski agent potrebuje tudi triggerje in ponovne poskuse, shranjeno stanje, ko se ustavi zaradi človeka, zapis vsakega klica modela in orodja, strošek vsakega zagona, teste preden sprememba pride v produkcijo, in jasne omejitve, kaj sme početi samostojno. Heym vse to hrani na enem mestu, tako da je sistem, ki ga oblikujete na platnu, sistem, ki se izvaja. Zgradite agentske sisteme in jih nato zaženite samozavestno.

## En runtime za življenjski cikel agenta

| Faza | Kaj vam ponuja Heym |
|---|---|
| **Gradnja** | Sestavite agente in deterministične korake na platnu, jih generirajte z [AI Assistant](../reference/ai-assistant.md) ali začnite s [Templates](../tabs/templates-tab.md) in prenosnimi veščinami. |
| **Orkestracija** | Usmerjajte agente, [pod-agente](../reference/agent-architecture.md), coding agente, RAG, brskalniško avtomatizacijo in orodja z eksplicitnim pretokom podatkov in [vzporednim izvajanjem](../reference/parallel-execution.md). |
| **Izvajanje** | Zaženite zagone prek [webhookov](../reference/webhooks.md), urnikov in dogodkovnih [triggerjev](../reference/triggers.md), s ponovnimi poskusi na vozlišče, [obravnavo napak](../nodes/error-handler-node.md) in [porazdelitvijo obremenitve](../reference/cluster.md) med instancami. |
| **Opazovanje** | Preglejte vsako izvajanje prek [zgodovine](../reference/execution-history.md), [LLM sledi](../tabs/traces-tab.md), stroška USD na zagon, zagona v živo na platnu, [analitike](../tabs/analytics-tab.md), [opozoril](../tabs/alerts-tab.md) in izvoza [OpenTelemetry](../reference/opentelemetry.md). |
| **Vrednotenje** | Testirajte prompte in modele glede na pričakovane izhode v [Evals](../tabs/evals-tab.md), z ocenjevanjem LLM-as-Judge in primerjavo modelov drug ob drugem. |
| **Nadzor** | Ohranite ljudi na nadzoru s [kontrolnimi točkami pregleda](../reference/human-in-the-loop.md) in [varovali](../reference/guardrails.md), ter upravljajte dostop s šifriranimi [poverilnicami](../reference/credentials.md), [ekipami](../reference/teams.md), [enotno prijavo](../reference/sso.md) in [revizijsko sledjo](../reference/audit.md). |
| **Izpostavljanje** | Strežite workflowe prek REST in [SSE](../reference/sse-streaming.md), kot [MCP](../tabs/mcp-tab.md) orodja, kot [Portal](../reference/portal.md) klepetalne UI in kot [dashboard](../tabs/dashboard-tab.md) gradnike. |

## Gradnja

### AI Assistant: Gradnja Workflow-ov z naravnim jezikom

[AI Assistant](../reference/ai-assistant.md) je klepetalni panel znotraj urejevalnika Workflow-ov. Opišite, kaj želite, na primer »ustvari Workflow, ki sprejme uporabniški vnos, preišče mojo bazo znanja in odgovori z uporabo GPT-4o«, in asistent ustvari vozlišča in povezave, ki se takoj uporabijo na platnu.

- Uporablja vaše lastne LLM poverilnice (kateri koli podprt model)
- Podpira **glasovni vnos** za oblikovanje Workflow-ov brez uporabe rok
- Samodejno uporabi veljaven Workflow JSON iz odgovora AI na platnu
- Pretaka odgovore v realnem času

Asistent deluje neposredno znotraj urejevalnika in pretaka vozlišča na platno v realnem času, vse, kar ustvari, pa ostane urejljivo kot vozlišča, ki ste jih postavili ročno.

### Sistem veščin

Veščine so prenosljivi svežnji zmogljivosti, datoteka z navodili `SKILL.md` in neobvezne Python skripte, ki jih lahko spustite na katero koli Agent vozlišče.

- Navodila veščine se dodajo na začetek sistemskega Prompt-a agenta
- Python datoteke v veščini postanejo klicna orodja
- Veščine so večkrat uporabne med Workflow-i in jih je mogoče deliti kot `.zip` arhive

To je analogno temu, da svojemu agentu v enem koraku daste opis delovnega mesta in zbirko orodij.

### Workflow Analyzer: Povratne informacije glede na izvajanje

Panel [Workflow Analysis](../reference/workflow-analysis.md) je orodje za dokumentacijo in povratne informacije, ki se zaveda izvajanja in je vgrajeno v urejevalnik. Kliknite **Analyze**, izberite LLM poverilnice in model, in Heym ustvari urejljivo Markdown poročilo za trenutni Workflow.

Za razliko od statične opombe analizator najprej zažene Workflow, kadar je to mogoče, in v Prompt vključi rezultat izvajanja. Poročilo zajema področja za izboljšave, namen Workflow-a in razlago po korakih, kaj vozlišča počnejo. Ko poročilo že obstaja, **Reanalyze** pretaka ločen predogled, tako da lahko sprejmete novo različico ali obdržite trenutni deljeni dokument.

## Orkestracija

### Vgrajeni LLM in Agent vozlišča

Heymov [Agent Node](../nodes/agent-node.md) izvaja tesno integrirano zanko klicev orodij z vgrajenimi Python orodji, MCP povezavami in prenosnim sistemom veščin, vse zasnovano za produkcijske agente.

Heymovo navadno [LLM vozlišče](../nodes/llm-node.md) prav tako presega preprost korak poziv-odgovor. Za podprte OpenAI in OpenAI-združljive Endpoint-e lahko preklopi v **način Batch API**, tako da eno vozlišče odda matriko Prompt-ov v cenejši, ponudniku lasten batch request. Platno nato izpostavi namensko vejo `batchStatus`, ki se sproži, ko batch prehaja skozi stanja, kot so `pending`, `processing` in `completed`.

To pomeni, da lahko LLM vozlišče opravi dve stvari hkrati:

- Izvede glavni batch request in vrne končne rezultate za posamezne elemente na običajni veji
- Sproži logiko obveščanja ali beleženja ob vsaki pomembni posodobitvi statusa batch-a, ne da bi tok spremenili v zanko ročnega poizvedovanja

Batch izvajanje je prvovrstni LLM Workflow primitiv, s preverjanjem zmogljivosti ponudnika in modela v UI vozlišča.

**Agent Node** je jedro orkestracije agentov v Heymu:

- **Klicanje orodij** – Agent iterira skozi klice orodij v zanki, dokler ne ustvari končnega odgovora
- **Python orodja** – Definirajte lastna orodja vgrajeno s polnim Python-om; agent jih kliče med izvajanjem
- **MCP povezave** – Povežite se s katerim koli [Model Context Protocol](https://modelcontextprotocol.io/) strežnikom (stdio ali SSE) in agent samodejno pridobi vsa njegova orodja
- **Veščine** – Spustite datoteko `.zip` ali `.md` na agenta, da razširite njegov sistemski kontekst in dodate Python orodja
- **Klici pod-Workflow-ov** – Agent lahko prikliče druge Heym Workflow-e kot orodja, s čimer sestavi kompleksno vedenje brez kode po meri

Za popolno referenco glejte [Agent Node](../nodes/agent-node.md) in [Agent Architecture](../reference/agent-architecture.md).

### Orkestracija več agentov

Heym podpira **vzorec orkestratorja** s prvovrstnimi vizualnimi primitivi:

- En agent deluje kot **orkestrator** (`isOrchestrator: true`) in prejme orodje `call_sub_agent`
- Naloge delegira imenovanim **pod-agentom** na istem platnu
- Pod-agenti lahko sami kličejo druge agente ali pod-Workflow-e (največja globina: 5)
- **Vzporedno izvajanje**: Ko orkestrator v enem obratu pokliče več pod-agentov, se ti izvajajo vzporedno za hitrejše rezultate

To omogoča arhitekture, kot je načrtovalni agent, ki usmerja delo k raziskovalcu, programerju in povzemalcu, vse vizualno povezano brez kode za orkestracijo po meri.

Za podrobnosti izvajanja glejte [Agent Architecture](../reference/agent-architecture.md).

### Kodirni agenti kot vozlišča Workflow-a

Heym prinaša dve vozlišči, ki izvajata pravega kodirnega agenta kot korak Workflow-a, ne kot klepet:

- **[Codex Node](../nodes/codex-node.md)** – Izvaja OpenAI Codex CLI v izoliranem Heym delovnem prostoru proti GitHub repozitoriju. Podpira **Sign in with ChatGPT** (PKCE OAuth na vaši Plus/Pro naročnini, brez stroškov API na Token) ali dostopni Token, klonira repo, dovoli Codex-u urejanje kode in vrne `summary`, `diff`, `changedFiles` in osnutek `pullRequestUrl`.
- **[OpenCode Go Node](../nodes/opencode-go-node.md)** – Enak potek dela z repozitorijem prek ponudniško nevtralnega OpenCode prehoda (Kimi, DeepSeek, Qwen in drugo), izveden v **utrjenem vsebniku za enkratno uporabo**: vse zmogljivosti odstranjene, korenski sistem samo za branje, omejitve pid/pomnilnik/CPU. GitHub Token ostane zunaj peskovnika: Heym izvede vsako git in GitHub operacijo na gostitelju, tako da ustvarjena koda ne more izvleči poverilnic za push.

To pomeni, da lahko Workflow obravnava hrošča iz Webhook-a, preda repo kodirnemu agentu, počaka na osnutek PR in objavi povezavo v Slack, popolnoma samodejno, z omejitvami virov, nastavljivimi za vsako namestitev.

### Vgrajen RAG Pipeline

Heym vključuje [RAG / Vector Store Node](../nodes/rag-node.md) in upravljani zavihek [Vectorstores](../tabs/vectorstores-tab.md). Lahko:

- Izberete svoj vektorski backend: **Qdrant** (zunanji strežnik) ali **Postgres (pgvector)**, ki shranjuje vektorje v Heymovi lastni bazi podatkov brez dodatne storitve za zagon
- Vstavite dokumente v vektorsko shrambo neposredno iz vozlišča Workflow-a
- Izvedete semantično iskanje in rezultate posredujete v LLM ali Agent vozlišče
- Sklicujete se na rezultate z izrazi, kot je `$ragNode.results.map("item.payload.content").join("\n\n")`

V Heymu je RAG dve vozlišči s popolnim nadzorom nad vdelavami in pridobivanjem.

### Avtomatizacija brskalnika s Playwright

[Playwright vozlišče](../nodes/playwright-node.md) je prvovrstna avtomatizacija brskalnika na platnu.

- **Način korakov** – Vizualno sestavite dejanja navigacije, klika, tipkanja, izpolnjevanja, posnetka zaslona, izvleka in drsenja
- **AI koraki s samodejnim popravljanjem** – Opišite dejanje v naravnem jeziku in LLM ustvari Playwright dejanja; neuspele selektorje je mogoče samodejno popraviti, ustvarjene korake pa je mogoče predpomniti, da se izognejo prihodnjim LLM klicem
- **Način Run Code** – Preklopite vozlišče v polni Playwright Python za kompleksne tokove (privzeto onemogočeno; ob omogočitvi se izvaja v Heymovem utrjenem peskovniku)
- **Avtentificirane seje** – Obnovite piškotke/`storageState` pred izvajanjem, preverite prijavo s preverjanjem selektorja in se po potrebi vrnite na skriptirane korake prijave
- **Zajem omrežja** – Neobvezno zberite JSON odgovore, glave, piškotke in shrambo brskalnika skupaj z rezultati

Heym obravnava brskalnik kot običajno vozlišče z enakimi izrazi, poverilnicami in obravnavo napak kot vse drugo.

### Expression DSL

Heymov [Expression DSL](../reference/expression-dsl.md) ponuja čisto, zmogljivo sintakso za sklicevanje na podatke nadrejenih vozlišč:

- `$input.text` – Podatki vhodnega vozlišča
- `$nodeName.field` – Polje izhoda katerega koli nadrejenega vozlišča
- `$global.variableName` – Trajne globalne spremenljivke
- Pomožne funkcije za matrike: `.first()`, `.map("field")`, `.join("\n")`

Izrazi delujejo v vsakem besedilnem polju, vključno s Prompt-i, HTTP glavami, pogoji in nastavljenimi vrednostmi, tako da se podatki premikajo med koraki eksplicitno. DSL uravnoteži zmogljivost in berljivost, ne da bi zahteval popolno znanje JavaScript-a.

## Zagon

### Triggerji, ponovni poskusi in poti napak

Workflow se lahko začne z mnogih mest. Vozlišča [Input](../nodes/input-node.md) prejemajo HTTP [webhooke](../reference/webhooks.md), [Cron](../nodes/cron-node.md) se izvaja po urniku, dogodkovni [triggerji](../reference/triggers.md) pa začnejo izvajanja iz Telegrama, Discorda, Slacka, IMAP predalov, WebSocket tokov, RabbitMQ vrst, nalaganj datotek in dogodkov platforme Heym.

Napake se obravnavajo znotraj grafa. Vsako vozlišče lahko ob napaki ponovi poskus z določenim številom poskusov in čakanjem med njimi, vsak poskus se zabeleži v [zgodovino izvajanja](../reference/execution-history.md), vozlišče [Error Handler](../nodes/error-handler-node.md) pa se zažene samodejno, ko vozlišče odpove, tako da je obnovitev del samega workflowa.

### Vzporedno izvajanje DAG

Heymov izvajalnik workflowov uporablja razporejevalnik usmerjenega acikličnega grafa (DAG). Neodvisna vozlišča se izvajajo vzporedno samodejno, brez potrebne konfiguracije.

- Vozlišča na isti ravni odvisnosti se hkrati razporedijo v nabor niti (`max_workers=8`)
- Takoj ko katero koli vozlišče konča, se njegova nadaljnja vozlišča razporedijo
- [Merge Node](../nodes/merge-node.md) združi rezultate vzporednih vej
- Več izvajanj workflowa se izvaja hkrati; vsako izvajanje je popolnoma izolirano

Vzporednost je privzeto vedenje, določeno s strukturo grafa.

Glejte [Vzporedno izvajanje](../reference/parallel-execution.md).

### Razširitev čez instance

Usmerite drugo instanco Heyma na isto PostgreSQL podatkovno bazo in pridružila se bo kot delovni proces. Izvajanja v ozadju so razdeljena med instance glede na uteži, ki jih nastavite, en izvoljeni vodja ohranja urnike, ocenjevanje opozoril in obnovitev po zrušitvi med preklopom ob napaki, vsako izvajanje pa zabeleži instanco, ki ga je izvedla. Glejte [Porazdelitev obremenitve](../reference/cluster.md).

### Agentic Kanban tabla

[Zavihek Board](../tabs/board-tab.md) je vgrajena Kanban tabla, kjer stolpci sami izvajajo workflowe. Kartica je trajnostno agentsko opravilo, ki nosi kontekst, zgodovino pogovora, stanje izvajanja, izhode in izvajanja workflowa.

- **Verige workflowov stolpcev** – Premik kartice v stolpec sproži verigo workflowa tega stolpca; **Agentic Kanban Model** (vaša poverilnica + model) preslika vsebino kartice v vhode workflowa in izhode spremeni nazaj v berljivo besedilo
- **Priloge kartic** – Spustite datoteke na kartico; dokumenti se izluščijo v besedilo, slike pa se posredujejo modelom, ki podpirajo vid, pred vsakim izvajanjem
- **Platno izvajanja v živo** – Odprite aktivno izvajanje znotraj kartice in ga opazujte, kako se izvaja na pravem platnu workflowa, vozlišče za vozliščem
- **Skupna raba v ekipi** – Delite table z uporabniki ali ekipami s pravicami branja/pisanja; verige na deljenih tablah se izvajajo s poverilnicami lastnika, tako da sodelavci nikoli ne potrebujejo svojih
- **Vidnost napak** – Neuspele kartice prikažejo indikator zgodovine napak, nadaljnja izvajanja pa se lahko ustavijo in počakajo na komentarje

Tabla je izvorna površina platforme: kartice, workflowi, poverilnice in izvajanja v živo so vsi na enem mestu.

### Heym Drive: vgrajeno shranjevanje datotek

[Zavihek Drive](../tabs/drive-tab.md) je shramba datotek, vgrajena v platformo. Datoteke, ki jih ustvarijo spretnosti in workflowi (PDF, DOCX, CSV, slike), pristanejo tam samodejno, priloge kartic table pa so prav tako shranjene tam.

- **Povezave za deljenje** – Javne ali z geslom zaščitene (Basic Auth) povezave za prenos z neobveznim potekom in omejitvami največjega števila prenosov
- **Skupna raba v ekipi** – Delite datoteke samo za branje s svojimi ekipami in odstranite vse ekipne delitve z enim dejanjem
- **Množična dejanja** – Večkratni izbor z razponi s shift-klikom, združite izbore v en prenos ZIP ali uporabite eno nastavitev deljenja/gesla/brisanja za več datotek hkrati
- **Dostop agenta** – Spretnosti se lahko odločijo za branje datotek v Driveu, tako da lahko agent dela z dokumenti, ki ste jih ustvarili vi ali drugi workflowi

Ustvarjeni izdelki dobijo trajen, deljiv dom znotraj platforme.

## Opazovanje

### Sledi LLM

[Zavihek Sledi](../tabs/traces-tab.md) omogoča popolno opazljivost vsakega klica LLM:

- Payloadi zahtev in odgovorov
- Časovni podatki na klic: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Imena klicev orodij, argumenti in rezultati
- Skills, poslani modelu

Sistem sledenja je namensko zgrajen za razhroščevanje agentnega vedenja, s popolnimi payloadi zahtev in odgovorov ter časovnimi podatki na klic.

### Sledenje stroškom žetonov LLM

Vsak klic LLM v Heymu je samodejno obračunan. [Zavihek Sledi](../tabs/traces-tab.md) prikazuje število vhodnih in izhodnih žetonov na sled skupaj s sprotnim stroškom v USD, izpeljanim iz sinhronizirane cenovne tabele.

- **Strošek na sled** – Vhodni žetoni, izhodni žetoni in skupni USD so prikazani v vsaki vrstici sledi
- **Analitika stroškov** – KPI kartice in graf stroškov po modelu se posodabljajo z izbranim časovnim obdobjem (1h / 24h / 7d / 30d / All)
- **Tabela stroškov LLM** – Sistemska tabela v [zavihku DataTable](../tabs/datatable-tab.md) se osveži iz Helicone vsakih 24 ur; cene lahko prepišete ali dodate lastne vrstice za modele, ki še niso navedeni
- **Opozorilo o manjkajoči ceni** – Sledi za modele brez vnosa cene prikažejo vgrajeno opozorilo z neposredno povezavo do tabele stroškov

Vsaka izvedba nosi svoj strošek v USD, razčlenjen po modelu.

### Odpiranje produkcijskih zagonov na živem platnu

Produkcijski Workflow ostane pregleden tudi po tem, ko se zažene zunaj urejevalnika. Odprite kateri koli vnos s statusom **Running** iz katerega koli pogovornega okna History ali odprite aktivni zagon znotraj kartice Agentic Kanban in Heym bo običajni urejevalnik Workflow priložil točno tej izvedbi.

- Vozlišča, ki so že zaključena, se takoj prikažejo s svojimi rezultati
- Trenutno vozlišče in čakajoča vozlišča dolvodno še naprej utripajo, ko izvajanje napreduje
- Debug panel prejme enake inkrementalne rezultate vozlišč kot zagon, začet na platnu
- Končni izhod in poudarki izvedbe prispejo brez pollinga ali zagona podvojenega zagona
- Zaprtje urejevalnika le prekine povezavo opazovalca; nikoli ne prekliče produkcijskega Workflow

Opazovalec uporablja SSE, podprt s posnetkom izvedbe med delavci (cross-worker execution snapshot), zato deluje za Webhook, Schedule, Chat, MCP, Integration in Board Triggerje, tudi ko zagon upravlja drug backend delavec.

### OpenTelemetry, analitika in opozorila

Heym oddaja [OpenTelemetry](../reference/opentelemetry.md) span-e za vsak zagon Workflow, izvedbo vozlišča in priklic orodja Agent, izvožene prek OTLP/HTTP v Jaeger, Grafana Tempo, Honeycomb, Datadog ali kateri koli drug združljiv backend.

Zavihek [Analytics](../tabs/analytics-tab.md) spremlja število zagonov, stopnjo uspešnosti, trajanje in trende po Workflow. [Alerts](../tabs/alerts-tab.md) spremljajo število napak, trajanje zagona, porabo žetonov ali USD in obseg izvajanja v časovnem oknu, nato pa zaženejo notify Workflow, ki ga izberete, tako da opozorilo doseže Slack, e-pošto, Telegram ali kamor koli, kamor lahko doseže vozlišče.

## Evalvacija

### Vgrajene evalvacije

[Zavihek Evalvacije](../tabs/evals-tab.md) Vam omogoča, da definirate testne suite in jih izvajate na svojih agentnih Workflow-ih:

- Ustvarite testne primere z vhodi in pričakovanimi izhodi ali jih generirajte iz Prompt-a suite
- Zaženite eno suito na več modelih in primerjajte njihove izhode vzporedno
- Ocenjujte z Exact Match, Contains ali LLM-as-Judge z neodvisnim modelom sodnikom
- Preglejte uspeh/neuspeh, dejansko proti pričakovanemu in zgodovino izvajanj

Spremenite Prompt ali model, znova zaženite suito in primerjajte rezultate, preden sprememba doseže produkcijo.

## Nadzor

### Human-in-the-Loop (HITL)

Heym ima vgrajen sistem [Human-in-the-Loop](../reference/human-in-the-loop.md), ki agentom omogoča, da začasno ustavijo izvajanje, zahtevajo človeški pregled in nadaljujejo točno tam, kjer so se ustavili.

- **Kontrolne točke agenta** – Omogočite `hitlEnabled` na katerem koli Agent vozlišču, da mu dodelite orodje `request_human_review`. Agent se sam odloči, kdaj odločitev potrebuje človeški nadzor, in pokliče orodje s povzetkom in osnutkom.
- **Javni URL-ji za pregled** – Vsaka zahteva za pregled ustvari varno enkratno povezavo na `/review/{token}` (168-urni TTL). Pregledovalci lahko **sprejmejo**, **uredijo in nadaljujejo** ali **zavrnejo** brez prijave.
- **Posnetki izvajanja** – Workflow zamrzne svoje celotno stanje (zgodovino pogovora, spremenljivke, rezultate orodij), tako da se nadaljuje točno tam, kjer se je ustavil, ko se pregledovalec odzove.
- **Veja za obvestila** – Neobvezni izhodni priključek `review` Vam omogoča, da povežete tok obvestil (Slack, e-pošta, Webhook), ki se sproži, ko je zahtevan pregled.
- **Pravilniki odobritve orodij MCP** – Pisne smernice HITL se interpretirajo v obsege odobritve (`always` / `once` / `never`), tako da lahko agent samodejno odobri orodja z nizkim tveganjem in stopnjuje tista z visokim tveganjem.
- **Več kontrolnih točk** – Eno izvajanje agenta se lahko ustavi za pregled večkrat; vsaka kontrolna točka je neodvisna.

Javni URL-ji za pregled, urejanje in nadaljevanje, razvejanje obvestil in nadaljevanje na podlagi posnetkov delujejo vsi iz iste kontrolne točke agenta.

Za celotno referenco glejte [Human-in-the-Loop](../reference/human-in-the-loop.md).

### LLM varovala

Heym ima vgrajena [varovala](../reference/guardrails.md) na obeh vozliščih [LLM](../nodes/llm-node.md) in [Agent](../nodes/agent-node.md), tako da lahko blokirate nevarne vsebine, preden odgovor modela doseže nadaljnje korake.

- **Varnostno stikalo na ravni vozlišča** – Omogočite varovala neposredno na vozlišču, ki generira ali obdeluje vsebino, namenjeno uporabnikom
- **Široka pokritost pravilnikov** – Blokirajte nasilje, sovražni govor, spolne vsebine, NSFW/kletvice, nadlegovanje, nezakonite dejavnosti, zahteve po osebnih podatkih in poskuse Prompt injection
- **Večjezično zaznavanje** – Uporabite ista varnostna pravila v turščini, angleščini, arabščini, španščini in drugih jezikih
- **Workflow-native fallback** – Ko je sporočilo blokirano, vozlišče vrže tipizirano napako Workflow-a, ki jo lahko usmerite skozi [Error Handler](../nodes/error-handler-node.md)

Varnostni pravilnik živi neposredno znotraj konfiguracije LLM in Agent ter se neposredno priključi na razvejanje Workflow-a in obravnavo napak.

### Dostop, poverilnice in revizija

Agenti delujejo s pravimi poverilnicami, zato je dostop del upravljanja. [Poverilnice](../reference/credentials.md) so šifrirane v mirovanju, po ustvarjanju maskirane in jih je mogoče deliti z uporabniki ali [ekipami](../reference/teams.md), ekipe pa si delijo tudi Workflow-e, spremenljivke, vektorske shrambe in datoteke Drive. [Enkratna prijava](../reference/sso.md) poveže katerega koli ponudnika OpenID Connect, vključno z Okta, Entra ID, Keycloak, Auth0 in Google. [Revizijska sled](../reference/audit.md) beleži vsako varnostno pomembno dejanje z njegovim izvajalcem, ciljem in izidom, pretakano z dnevniškimi zapisi Vašega vsebnika do zbiralnika dnevnikov ali SIEM-a, ki ga že uporabljate.

### Samostojno gostovanje, Vaši podatki so Vaši

Heym deluje na Vaši infrastrukturi. Workflow-i, poverilnice, zgodovina izvajanj in sledi živijo v Vaši lastni bazi podatkov, klici modelov pa gredo z Vaših strežnikov do ponudnika, ki ga izberete, ali do modela, ki ga gostite sami prek Ollama ali vLLM. Za agente, ki obdelujejo občutljive dokumente, podatke strank ali lastniške baze znanja, je to pogosto trda zahteva.

Heym je licenciran pod **licenco MIT s pogojem Commons Clause**. Izvorna koda je na voljo: lahko jo prosto uporabljate, spreminjate in gostite sami. Commons Clause omejuje prodajo programske opreme, vključno s ponujanjem plačanega gostovanja ali svetovalnih/podpornih storitev, katerih vrednost izhaja v veliki meri iz Heym-a. Za komercialno licenciranje, poslovne namestitve ali profesionalno podporo kontaktirajte [enterprise@heym.run](mailto:enterprise@heym.run).

## Izpostavljanje

### API-ji in pretakanje

Workflowi so klicljivi prek HTTP na `/api/workflows/{workflow_id}/execute`, ki vrne JSON, in na `/api/workflows/{workflow_id}/execute/stream`, ki pretaka dogodke vozlišč kot Server-Sent Events med potekom izvajanja. Oba si delita preverjanje pristnosti na ravni Workflowa, omejevanje hitrosti in predpomnjenje odgovorov. Glejte [Webhooks](../reference/webhooks.md) in [SSE Streaming](../reference/sse-streaming.md).

### Integracija MCP (Model Context Protocol)

Heym ima vgrajeno podporo za [MCP](../tabs/mcp-tab.md) na obeh straneh:

- **Kot odjemalec**: Agent nodes se povežejo z zunanjimi MCP strežniki (Filesystem, Browserbase, orodja po meri) prek stdio ali SSE in samodejno uporabljajo njihova orodja
- **Kot strežnik**: Workflowi z vklopljenim MCP postanejo orodja na privzetem strežniku na `/api/mcp/sse` ali na imenovanih strežnikih z lastnim URL-jem in API ključem, tako da lahko Claude Desktop, Cursor in drugi MCP odjemalci neposredno kličejo Vaše Heym Workflowe

Agenti lahko uporabljajo več MCP strežnikov hkrati, vsak Workflow pa lahko postane orodje za zunanjega MCP odjemalca.

### Portal: Objavljanje Workflowov kot klepetalnih vmesnikov

Funkcija [Portal](../reference/portal.md) spremeni vsak Workflow v javni klepetalni vmesnik na `/chat/{slug}`:

- Neobvezno preverjanje pristnosti s poverilnicami za posameznega uporabnika
- Pretakajoče izvajanje (napredek vozlišč v realnem času)
- Podpora za nalaganje datotek
- Zgodovina večkratnih izmenjav

Ekipe dostavijo interna orodja, klepetalne robote za stranke in obrazce, ki jih poganja AI, iz enega Workflowa in URL-ja, brez pisanja kode za frontend.

### Nadzorne plošče, ki jih poganjajo Workflowi

Zavihek [Dashboard](../tabs/dashboard-tab.md) je poročevalska površina, ki jo zgradi uporabnik, kjer vsak gradnik grafikona poganja lasten skriti Heym Workflow. Gradnik lahko kliče API-je, poizveduje po BigQuery, išče po RAG/vektorskih shrambah, izvaja korake LLM, preoblikuje vrstice in zaključi z [Chart Output node](../nodes/chart-output-node.md). Gradnike lahko ustvarite ročno, jih generirate z AI, jih pozneje natančno prilagodite, predpomnite rezultate in vizualno preuredite mrežo.

## Primerjava z orodji za avtomatizacijo Workflow

Mnoge ekipe pridejo v Heym iz orodij za avtomatizacijo Workflow. Spodnja tabela primerja Heym z n8n, Zapier in Make.com glede zmožnosti, ki so pomembne, ko agenti tečejo v produkciji, opombe pod njo pa navajajo uradno dokumentacijo, na kateri temelji primerjava. Za podrobnejši pogled na posamezno orodje glejte primerjalne strani na [heym.run/compare](https://heym.run/compare).

| Zmožnost | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Vgrajeno vozlišče LLM | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + statusne veje | ✓ | omejeno¹¹ | –¹¹ | omejeno¹¹ |
| Vgrajeno vozlišče Agent (klicanje orodij) | ✓ | ✓ | ✓ | ✓ |
| Orkestracija več agentov | ✓ | ✓ | omejeno | omejeno |
| Vozlišča kodirnih agentov (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Vgrajen RAG / vektorska shramba | ✓ | ✓ | omejeno¹ | plugin² |
| Branje / pisanje WebSocket | ✓ | omejeno¹² | –¹³ | –¹⁴ |
| Graditelj Workflow v naravnem jeziku | ✓ | omejeno³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Odpiranje tekoče izvedbe na živem platnu | ✓ | omejeno¹⁹ | omejeno¹⁹ | –¹⁹ |
| Nadzorne plošče, ki jih poganja Workflow | ✓ | omejeno¹⁷ | omejeno¹⁷ | omejeno¹⁷ |
| Agentic Kanban tabla | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Sistem Skills za agente | ✓ | – | – | – |
| Vgrajen file drive (povezave za deljenje, ekipe) | ✓ | omejeno²² | omejeno²² | –²² |
| Vozlišče za avtomatizacijo brskalnika (Playwright) | ✓ | omejeno²³ | omejeno²³ | –²³ |
| Pregledovanje sledi LLM | ✓ | omejeno⁴ | – | ✓ |
| Izvoz sledenja OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Sledenje stroškom žetonov LLM (USD) | ✓ | –¹⁵ | –¹⁵ | omejeno¹⁵ |
| Vgrajene evalvacije za AI Workflow | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | omejeno⁶ | omejeno⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | omejeno⁸ |
| Samodejno stiskanje konteksta | ✓ | – | – | – |
| Vzporedno izvajanje DAG | ✓ | omejeno⁹ | – | – |
| Samostojno gostovanje, izvorna koda na voljo | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL za dinamične podatke | ✓ | ✓ | omejeno | ✓ |

> **Opombe:** ¹ Zapier Knowledge Sources — ni izpostavljene vektorske shrambe ali nadzora vdelav. ² Make.com ima module Pinecone/Qdrant, a nima izvornega vozlišča RAG. ³ n8n AI Workflow Builder je samo v oblaku, v beta različici in z omejitvami kreditov. ⁴ n8n prikazuje vmesne korake; popolno sledenje zahteva orodja tretjih oseb. ⁵ n8n podpira odobritve klicev AI orodij prek klepeta, e-pošte in kanalov za sodelovanje, vendar ne shrani posnetka in ne nadaljuje celotne izvedbe tako kot Heym. ⁶ Zapier Human in the Loop podpira odobritve in zbiranje podatkov znotraj Zap-ov, vendar ni sistem kontrolnih točk s posnetkom in nadaljevanjem za javni pregled. ⁷ Make.com ponuja Human in the Loop kot aplikacijo Enterprise s prošnjami za pregled in izidi adjusted/approved/canceled, vendar ostaja omejen na paket in manj agent-nativen. ⁸ n8n ponuja namensko vozlišče Guardrails, Zapier ponuja AI Guardrails v svojih AI izdelkih, Make.com pa dokumentira pravila agentov in tokove pregleda, ne pa primerljive samostojne funkcije guardrails, zato je Make označen kot omejeno. ⁹ n8n privzeto izvaja zaporedno; vzporednost zahteva obhode s pod-Workflow. ¹⁰ Sustainable Use License — brezplačno samostojno gostovanje za interno uporabo, komercialna redistribucija omejena. ¹¹ Od 22. aprila 2026 uradna dokumentacija n8n opisuje paketno obdelavo HTTP in vzorce zank/čakanja, ne pa izvorne statusne veje LLM batch, uradna dokumentacija aplikacije ChatGPT pri Zapierju ne navaja sprožilcev in le generično beta različico API Request, uradna stran integracije OpenAI pri Make pa izpostavlja paketna dejanja, kot je create/watch completed, ne pa prvovrstnega vozlišča LLM s statusnim razvejanjem, zato sta n8n/Make označena kot omejeno, Zapier pa kot nedostopen za ta specifični vzorec Workflow. ¹² Uradna dokumentacija n8n pokriva vozlišči HTTP Webhook in HTTP Request ter razširljivost s Code/custom/community, vendar nisem našel lastniškega sprožilca/vozlišča za pošiljanje WebSocket, zato je n8n označen kot omejeno. ¹³ Uradna dokumentacija Zapierja pokriva dohodne webhook-e in odhodne webhook/API zahteve samo prek HTTP, ne pa izvornih korakov sprožanja ali pošiljanja WebSocket. ¹⁴ Uradna dokumentacija Make pokriva module Webhooks in module HTTP(S) request, vendar nisem našel izvornega modula za sprožanje ali pošiljanje WebSocket. ¹⁵ n8n nima izvornega sledenja stroškom žetonov LLM; obstajajo obhodni Workflow-i skupnosti, vendar zahtevajo ročno namestitev in klice API po izvedbi (odprta zahteva za funkcijo od maja 2026). Zapier uporabnikom ne izpostavlja števila žetonov na izvedbo ali stroškov v USD; koraki AI porabljajo le opravila. Nadzorna plošča kreditov Make.com delno odraža porabo žetonov za AI, gostovan pri Make (od avgusta 2025), vendar se povezave s ključi API tretjih oseb obračunavajo kot 1 operacija = 1 kredit brez štetja žetonov; razčlenitev stroškov v USD po modelu na izvedbo ni na voljo. ¹⁶ Heym oddaja izvorne razpone OpenTelemetry (enega na zagon Workflow in enega na vozlišče) prek OTLP/HTTP v kateri koli združljiv backend, s širjenjem W3C trace-context in brez instrumentacijske kode, konfigurirano prek okoljskih spremenljivk `HEYM_OTEL_*` in privzeto onemogočeno. n8n ima dokumentirano integracijo sledenja OpenTelemetry za izvedbe Workflow in vozlišč. Zapier in Make.com od junija 2026 ne dokumentirata izvoza OpenTelemetry svojih izvedb Workflow/scenarijev. ¹⁷ n8n dokumentira nadzorno ploščo Insights za metrike produkcijskih izvedb, Zapier dokumentira Zap History in Task Usage, Make.com pa dokumentira Scenario History; to so površine za spremljanje/zgodovino, ne pa pripomočki nadzorne plošče po meri, podprti s poljubno logiko Workflow, kot je zavihek Dashboard pri Heymu. ¹⁸ Heym Workflow Analyzer, kadar je mogoče, zažene Workflow, prebere rezultat izvedbe in ustvari skupno urejivo poročilo Markdown, ki pokriva področja za izboljšave, namen in vedenje po korakih. n8n dokumentira AI Workflow Builder za ustvarjanje/izpopolnjevanje/odpravljanje napak v Workflow-ih, Zapier dokumentira odpravljanje napak z AI za zagnane Zap-e z napakami, Make.com pa dokumentira zgodovino scenarijev in korake sklepanja AI agenta, vendar njihova javna dokumentacija ne opisuje istega skupnega dokumenta za analizo Workflow, ki se zaveda izvedbe. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) navaja tekoče izvedbe in lahko naloži podatke iz prejšnje izvedbe v urejevalnik, medtem ko [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) izpostavlja stanje running v svojem urejevalniku. [Make Scenario History](https://help.make.com/scenario-history) dokumentira podrobnosti zagona in dnevnike. Njihova javna dokumentacija, pregledana 18. julija 2026, ne opisuje natančnega toka Heyma: odpreti poljubno tekočo produkcijsko izvedbo iz History ali kartice Kanban, obnoviti njen trenutni posnetek vozlišča in še naprej prejemati animacijo vozlišč in dnevnike Debug na istem platnu. ²⁰ Heymova vozlišča [Codex](../nodes/codex-node.md) in [OpenCode Go](../nodes/opencode-go-node.md) zaženeta pravi CLI kodirnega agenta v izoliranem delovnem prostoru Heym proti repozitoriju GitHub — kloniranje, urejanje, ustvarjanje diff-a, potiskanje veje, odpiranje pull request-a — kot prvovrstni korak Workflow. Od 20. julija 2026 noben konkurent ne dokumentira enakovrednega: [vozlišče OpenAI pri n8n](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) pokriva klice API chat/assistant, ne pa kodirnega agenta na ravni repozitorija, in izvorna podpora za Codex ostaja zahteva skupnosti; lastni blog Zapierja dokumentira obratno smer — [Codex poganja orodja Zapier prek Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — ne pa Codex kot korak Zap; moduli OpenAI pri Make.com izpostavljajo completions/assistants/batch actions, ne pa kodirnega agenta, ki klonira repozitorije in odpira PR-je. ²¹ [Zavihek Board](../tabs/board-tab.md) pri Heymu je vgrajena agentic Kanban tabla, katere stolpci izvajajo Workflow-e in katerih kartice nosijo kontekst, zgodovino pogovorov, stanje izvedbe in zagone. n8n ([integracija Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([integracije Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) in Make.com ([integracija Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) se povezujejo le z aplikacijami kanban tretjih oseb, kot so Kanban Tool, Wekan ali NocoDB; noben od 20. julija 2026 ne dokumentira vgrajene table, ki bi poganjala lastne Workflow-e. ²² n8n shranjuje binarne podatke izvedb interno (neobvezno na [zunanji shrambi, združljivi s S3](https://docs.n8n.io/hosting/scaling/external-storage/)), vendar ne dokumentira uporabniku vidnega file drive-a s povezavami za deljenje ali deljenjem z ekipo, zato je označen kot omejeno. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) obdeluje datoteke le za čas zagona Zap-a, [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) pa hrani majhne besedilne vrednosti, zato je Zapier označen kot omejeno. [Podatkovne shrambe](https://help.make.com/l6du-data-stores) pri Make.com hranijo strukturirane zapise, njegovo [ravnanje z datotekami](https://help.make.com/working-with-files) pa prenaša datoteke med aplikacijami brez trajne vgrajene shrambe, zato je Make označen kot nedostopen. ²³ [Vozlišče Playwright](../nodes/playwright-node.md) pri Heymu je lastniška avtomatizacija brskalnika z vizualnim načinom korakov, koraki, ki jih ustvari AI, in načinom s polno kodo. n8n ponuja le pakete skupnosti, kot je [n8n-playwright](https://github.com/toema/n8n-playwright), z [zahtevo za funkcijo za izvorna vozlišča za avtomatizacijo brskalnika](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), ki je še vedno odprta, zato je označen kot omejeno. Zapier Agents lahko [brskajo in berejo strani prek spletnega brskanja in razširitve Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), vendar Zapier ne dokumentira nobenega skriptnega koraka za avtomatizacijo brskalnika, zato je označen kot omejeno. Make.com od 20. julija 2026 dokumentira module HTTP in aplikacije tretjih oseb za scraping, ne pa nobenega izvornega modula za avtomatizacijo brskalnika.

## Povezane teme

- [Uvod](./introduction.md) – Pregled platforme
- [Hiter začetek](./quick-start.md) – Zgradite svoj prvi Workflow
- [Analiza Workflow](../reference/workflow-analysis.md) – Ustvarite skupna poročila o izvajanju Workflow in povratne informacije za izboljšave
- [Zavihek Dashboard](../tabs/dashboard-tab.md) – Zgradite nadzorne plošče, podprte z Workflow, z AI-generiranimi gradniki grafikonov
- [Vozlišče Agent](../nodes/agent-node.md) – Vozlišče LLM s klicanjem orodij, MCP in veščinami
- [Arhitektura agenta](../reference/agent-architecture.md) – Podagenti, orkestrator in razpošiljanje orodij
- [Zavihek Board](../tabs/board-tab.md) – Agentska Kanban tabla s stolpci, ki izvajajo Workflow
- [Vozlišče Codex](../nodes/codex-node.md) – Zaženite kodirnega agenta OpenAI Codex na GitHub repozitoriju
- [Vozlišče OpenCode Go](../nodes/opencode-go-node.md) – Ponudniku neodvisen kodirni agent v utrjenem vsebniku
- [Zavihek Drive](../tabs/drive-tab.md) – Vgrajeno shranjevanje datotek z povezavami za deljenje, ekipami in množičnimi dejanji
- [Vozlišče Playwright](../nodes/playwright-node.md) – Lastna avtomatizacija brskalnika z AI-koraki in kodnim načinom
- [Vozlišče RAG / Vector Store](../nodes/rag-node.md) – Vektorsko iskanje in vstavljanje dokumentov (Qdrant ali Postgres pgvector)
- [AI Assistant](../reference/ai-assistant.md) – Graditelj Workflow v naravnem jeziku
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Kontrolne točke agenta z javnimi URL-ji za pregled
- [Guardrails](../reference/guardrails.md) – Blokirajte nevarne Prompt-e, preden dosežejo vaše modele
- [Zavihek Traces](../tabs/traces-tab.md) – Opazovanje klicev LLM
- [Zavihek Evals](../tabs/evals-tab.md) – Testni nizi za AI Workflow
- [Zavihek Alerts](../tabs/alerts-tab.md) – Opozorila o pragovih pri napakah, trajanju, stroških in obsegu izvajanja
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Izvoz razponov izvajanja, vozlišč in orodij prek OTLP
- [Porazdelitev obremenitve](../reference/cluster.md) – Delite izvajanja med instancami s preklopom vodje ob napaki
- [Enotna prijava](../reference/sso.md) – Prijavite se prek katerega koli ponudnika OpenID Connect
- [Revizijsko beleženje](../reference/audit.md) – Varnostno pomembna dejanja z akterjem, ciljem in izidom
- [Portal](../reference/portal.md) – Objavite Workflow kot javne klepetalne UI
- [Vzporedno izvajanje](../reference/parallel-execution.md) – Sočasno izvajanje na podlagi DAG
- [Zavihek MCP](../tabs/mcp-tab.md) – Konfiguracija strežnika in odjemalca MCP
