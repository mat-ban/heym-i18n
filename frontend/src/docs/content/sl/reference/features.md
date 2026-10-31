# Heym Celoten Nabor Funkcij

Obsežen pregled vseh zmožnosti Heym. Vsak razdelek opisuje funkcijo ali koncept v nekaj stavkih.

---

## Začetek

### [Uvod](../getting-started/introduction.md)

Heym je infrastruktura za izvajanje in upravljanje AI agentov v produkciji. Zgradite agentne sisteme na vizualnem platnu in jih izvajajte s samozavestjo: orkestrirajte agente, avtomatizirajte poslovne procese, pregledujte vsako izvajanje in ohranjajte nadzor nad svojo infrastrukturo. Podpira vizualne workflows, AI-podprta vozlišča ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI asistent](./ai-assistant.md), integracije ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), vhodni [IMAP Trigger](../nodes/imap-trigger-node.md) e-pošti, odhodni [Send Email](../nodes/send-email-node.md)), načrtovanje z [Cron](../nodes/cron-node.md) in [Portal](./portal.md) klepetalnice za končne uporabnike.

Oglejte si tudi [Osnovni koncepti](../getting-started/core-concepts.md), [Vrste vozlišč](./node-types.md) in [Integracije tretjih oseb](./integrations.md).

### [Zakaj Heym](../getting-started/why-heym.md)

Zakaj Heym prehaja skozi življenjski cikel agenta (zgraditi, orkestrirati, izvajati, opazovati, vrednotiti, nadzorovati, izpostaviti) in prikazuje, kaj en samostojno gostovan runtime obravnava v vsaki fazi. To vključuje [LLM](../nodes/llm-node.md) vozlišče in [Agent Node](../nodes/agent-node.md) z klici orodij, Python orodji, [MCP](../tabs/mcp-tab.md) povezavami, veščinami in orkestracijo več agentov; sprožilce, ponovne poskuse in [porazdelitev obremenitve](./cluster.md); [Izvajanja](../tabs/traces-tab.md) z USD stroški na izvajanje in OpenTelemetry izvozom; [Vrednotenja](../tabs/evals-tab.md); [človeške preglede](./human-in-the-loop.md), zaščitne mehanizme, SSO in revizijske sledi; ter REST, MCP in Portal končne točke. Primerjava zmožnosti z n8n, Zapier in Make.com zaključi stran.

Oglejte si tudi [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) in [Arhitektura agenta](./agent-architecture.md).

### [Hiter začetek](../getting-started/quick-start.md)

Prvi workflow zaženite v nekaj minutah: ustvarite workflow na zavihku [Workflows](../tabs/workflows-tab.md), dodajte [Input](../nodes/input-node.md) vozlišče, [LLM](../nodes/llm-node.md) vozlišče in [Output](../nodes/output-node.md) vozlišče, nato jih povežite. Konfigurirajte [LLM](../nodes/llm-node.md) s poverilnico in nastavite `userMessage` na `$input.text`; uporabite Run ali [AI asistenta](./ai-assistant.md) za izvajanje ali generiranje workflows z naravnim jezikom.

Naravno se povezuje z [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) in [Expression DSL](./expression-dsl.md).

### [Osnovni koncepti](../getting-started/core-concepts.md)

Workflows so usmerjeni grafi vozlišč, povezanih z robovi; izvajanje poteka od sprožilnih vozlišč ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) skozi obdelovalna vozlišča do [Output](../nodes/output-node.md) vozlišč. Vsako vozlišče ima vrsto, podatke (konfiguracijo) in vhode/izhode; robovi definirajo pretok podatkov. Vozlišča se sklicujejo na zgornje podatke preko izrazov [Expression DSL](./expression-dsl.md), kot je `$nodeLabel.field`; neodvisna vozlišča se samodejno izvajajo [paralelno](./parallel-execution.md).

Oglejte si tudi [Sprožilci](./triggers.md), [Paralelno izvajanje](./parallel-execution.md) in [Struktura workflows](./workflow-structure.md).

### [Zagon in namestitev](../getting-started/running-and-deployment.md)

Heym zagotavlja `run.sh` za lokalni razvoj (baza podatkov v Dockerju, FastAPI backend, Vite frontend) in `deploy.sh` za produkcijo z Docker Compose. Obe skripti uporabljata datoteko `.env`; ključne spremenljivke vključujejo `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` in `ALLOW_REGISTER`. Razvoj poteka na konfigurabilnih frontend in backend vratih; produkcija ponuja API pod `/api` preko frontend vsebnika.

Oglejte si tudi [Varnost](./security.md), [Podjetje](./enterprise.md) in [Nastavitve](./user-settings.md).

### [Migracija na Heym](../getting-started/migrate-to-heym.md)

Orodje AI Convert pretvori workflow z druge platforme (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) ali opis v preprostem jeziku v Heym workflow, ki se v živo pretaka na platno in je pripravljen za [prenos in uvoz](./download-import.md). Izvede preverjanje varnosti AI, nato generira DSL z vnosnimi in hitrostnimi omejitvami. Odprite ga na [heym.run/convert](https://heym.run/convert).

Oglejte si tudi [Hiter začetek](../getting-started/quick-start.md), [Prenos in uvoz](./download-import.md) in [AI asistenta](./ai-assistant.md).

---

## Vozlišča

### Sprožilci
#### [Vhodno vozlišče](../nodes/input-node.md)

Vhodno vozlišče je vstopna točka za workflows, ki prejemajo podatke od uporabnika ali API klicatelja. Podpira eno ali več vhodnih polj ter izpostavlja metapodatke zahtev (glave, poizvedbene parametre). Dostopajte do polj telesa preko `$nodeLabel.body.fieldKey`, do glav preko `$nodeLabel.headers` in do poizvedb preko `$nodeLabel.query`.

Naravno se povezuje z [Pogoji](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) in [Izhodom](../nodes/output-node.md). Za reference na payload in dostop do polj si oglejte [Expression DSL](./expression-dsl.md) in [Webhooke](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Cron vozlišče sproži workflow po urniku z uporabo standardnega izraza cron s petimi polji. Ni potrebnega vnosa uporabnika—workflow se samodejno izvaja ob določenih časih (npr. na uro, dnevno, vsakih 15 minut). Izhod je sprožilni dogodek brez payloada.

Oglejte si tudi [Sprožilce](./triggers.md), [Čakanje](../nodes/wait-node.md) in [Zgodovino izvajanja](./execution-history.md) za načrtovane in zamujene izvedbe.

#### [IMAP Sprožilec](../nodes/imap-trigger-node.md)

IMAP sprožilec redno preverja vhodno pošto v nastavljeni minutni interval in za vsak nov zaznan e-poštni naslov zažene workflow. Izhaja razčlenjene glave, sezname pošiljateljev in prejemnikov, besedila v navadni in HTML obliki, metapodatke o priponkah ter časovni žig sprožitve. Uporabite ga za razporejanje podpore, usmerjanje pošte v [Slack](../nodes/slack-node.md) ali odobritvene tokove, ki jih vodi e-pošta z [Človekom v procesu](./human-in-the-loop.md).

Naravno se povezuje z [Pošlji e-pošto](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) in [Slack](../nodes/slack-node.md) za vhodno razporejanje in odzivne workflows.

#### [Heym Sprožilec](../nodes/heym-trigger-node.md)

Heym sprožilec zažene workflow, ko Heym sam objavi dogodek platforme: `heym.started`, `workflow.created`, `workflow.updated` ali `workflow.deleted`. Dostava je serijska - vsak dogodek, objavljen v enem petsekundnem oknu, prispe v eni izvedbi kot `$nodeLabel.events`, vedno v obliki tabele. Vsak dogodek je prevzet preko edinstvene omejitve baze podatkov, tako da se sproži natančno enkrat na naročeno vozlišče, ne glede na število delavcev, kontejnerjev ali naprav, ki delujejo. Uporabite ga za revizijske sledi sprememb workflow, napovedi uvedb in povzetke zdravja instanc.

Naravno se povezuje z [Heym](../nodes/heym-node.md) vozliščem za iskanje spremenjenega workflow in z [Zanko](../nodes/loop-node.md) za delovanje enkrat na dogodek.

#### [Heym](../nodes/heym-node.md)

Heym vozlišče bere lastne podatke Heym preko treh operacij: `listWorkflows` vrne vsak workflow, do katerega ima lastnik dostop, skupaj s številom vozlišč in časovnimi žigi, `getWorkflow` vrne strukturo vozlišč in povezav enega workflow, `getExecutionHistory` pa vrne vnose zgodovine izvajanja, najprej najnovejše, z opcijskimi filtri za status, časovno okno in omejitve, skupaj s skupnimi podatki razvrščenimi po statusu. Rezultati so omejeni na lastnika workflow, v katerem se vozlišče nahaja, tako da izvedba, ki jo sproži cron, portal ali dogodek, vrne iste podatke kot ročna izvedba. `getWorkflow` vrne celotno konfiguracijo vozlišča, kar omogoča revizijo workflow za trdo kodirane ključe ali tokene; ne izpostavi ničesar, kar lastnik workflow ne bi mogel že odpreti v urejevalniku. Poverilnice niso potrebne.

#### [WebSocket Sprožilec](../nodes/websocket-trigger-node.md)

WebSocket sprožilec odpre izhodno povezavo odjemalca do zunanjega WebSocket strežnika in zažene workflow ob `onMessage`, `onConnected` ali `onClosed`. Izpostavlja razčlenjene payloade sporočil, stanje ponovnega povezovanja, metapodatke o zapiranju in URL vtičnika za nadaljnje izraze.

Naravno se povezuje z [WebSocket Pošlji](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) in [SSE Streaming](./sse-streaming.md) za integracije v realnem času.

#### [Telegram Sprožilec](../nodes/telegram-trigger-node.md)

Telegram sprožilec prejema posodobitve webhookov bota in takoj zažene workflow. Izpostavlja celoten payload posodobitve, glavni objekt sporočila, povratne poizvedbe, sanirane glave in časovni žig sprožitve. Uporabite ga za chatbot-e, AI asistente v [Telegramu](../nodes/telegram-node.md) in tokove, ki jih vodijo gumbi.

Naravno se povezuje z [Telegram](../nodes/telegram-node.md), [Agent vozlišče](../nodes/agent-node.md) in [Webhooki](./webhooks.md) za workflow, ki jih vodi bot.

#### [Slack Sprožilec](../nodes/slack-trigger-node.md)

Slack sprožilec prejema webhooke Slack Events API in samodejno zažene workflow po preverjanju podpisa zahtevka. Izpostavlja payload dogodka in sanirane glave za nadaljnje usmerjanje, klasifikacijo na osnovi [LLM](../nodes/llm-node.md) in tokove odgovorov.

Naravno se povezuje z [Slack](../nodes/slack-node.md), [Agent vozlišče](../nodes/agent-node.md) in [Integracijami tretjih oseb](./integrations.md).

#### [Discord Sprožilec](../nodes/discord-trigger-node.md)

Discord sprožilec prejema webhooke Discord Interactions API, preverja podpise Ed25519 z izbrano poverilnico `discord_trigger` in zažene workflow. Izpostavlja celoten payload interakcije, podatke o ukazu, sanirane glave in metapodatke sprožitve za nadaljnje usmerjanje ali odgovore.

Naravno se povezuje z [Izhodom](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent vozlišče](../nodes/agent-node.md) in [Integracijami tretjih oseb](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

Node RabbitMQ pošilja ali prejema sporočila iz RabbitMQ vrstic in izmenjav. Uporabite ga za workflows, ki temeljijo na sporočilih, in obdelavo dogodkov. Način pošiljanja objavi sporočilo z opcijskim zamikom; način prejemanja deluje kot [trigger](./triggers.md), tako da se workflow začne, ko sporočilo prispe. Izhod vključuje status, message_id in telo.

Povezuje se z [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) in [Parallel Execution](./parallel-execution.md) za obdelavo, ki temelji na dogodkih.

#### [Error Handler](../nodes/error-handler-node.md)

Node Error Handler se samodejno zažene, ko katerikoli node v workflow-u ne uspe. Ni potrebnih vhodnih robov; sproži ga motor. Izhod vključuje sporočilo o napaki, oznako neuspelega vozlišča, tip vozlišča in časovni žig. Uporabite ga za pošiljanje obvestil preko [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) ali [Send Email](../nodes/send-email-node.md), beleženje napak ali vračanje prilagojenih odgovorov o napakah.

Kot alternativo obravnavi napak na platnu lahko workflow tudi prenese napake na ločen workflow — glejte [Error Workflow](#error-workflow). Če platno že vsebuje node Error Handler, se napaka **ne** obravnava (lokalni obravnavalec ima prednost).

Pogosti cilji obvestil so [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) in [Send Email](../nodes/send-email-node.md); podrobnosti o izvajanju je lažje pregledovati v [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

Node AI Agent je node [LLM](../nodes/llm-node.md) z klicanjem orodij. Lahko izvaja Python orodja, kliče povezane node na platnu kot orodja, se povezuje z [MCP](../tabs/mcp-tab.md) strežniki, uporablja veščine (datoteke z navodili in opcijske Python skripte), deluje kot orkestrator, ki delegira drugim agentnim vozliščem, in kliče druge workflows kot orodja. Izhod je na voljo kot `$nodeLabel.text`. Opcijski preklop **Extra Body** priloži JSON objekt specifičnih parametrov zahtevkov za ponudnike vsaki zahtevi v zanki klicanja orodij; privzeto je izklopljen. Opcijski preklop **Use Responses API** usmerja klice modela agenta skozi Responses API, kar ohranja razmišljanje modela med klici orodij, tako da razmišljajoči model ohrani svoj tok misli skozi večstopenjsko zanko; privzeto je izklopljen in deluje z OpenAI in prilagojenimi poverilnicami.

Orodja node na platnu omogočajo agentu, da neposredno kliče konfigurirane vozlišča workflow-a iz platna. Povežite podprto vozlišče z ročajem orodij agenta, nato označite specifična polja kot agenta, ki jih zagotavlja bot ikona. Ta polja postanejo parametri orodij med izvajanjem, medtem ko poverilnice in neoznačena polja ostanejo fiksna v konfiguraciji vozlišča.

Oddelek Veščine zdaj vključuje **AI Build** za ustvarjanje novih veščin, akcijo za urejanje AI za obstoječe veščine, prenos ZIP za vsako veščino in opcijski preklop **Enable Drive files** za veščine, ki potrebujejo dostop do datotek Heym Drive med izvajanjem. Modalna okna Skill Builder predvaja pogovor v klepetu na levi, sprejema datoteke s povleci in spusti z vsakim komentarjem za fino nastavitev, prikazuje živo predogled brez možnosti urejanja generiranih datotek `SKILL.md` in `.py` na desni, omogoča prenos tega predogleda kot ZIP in shranjuje naložene datoteke za fino nastavitev nazaj kot združene veščine preko istega postopka prenosa ZIP, ki se uporablja za ročne naložbe.

Z omogočenim **[Agent Persistent Memory](./agent-persistent-memory.md)** vsak agent node ohranja svoj lasten graf znanja: dejstva se naložijo v sistemski poziv, ko niso prazna, in uspešni zagon sproži ozadje združevanja novih entitet in odnosov. Podagenti uporabljajo ločene grafe. Graf agenta lahko **delite** z drugimi agenti (isto ali druge workflows) z dostopom samo za branje ali branje/pisanje iz pogovora o grafu. Nadzor nad platnom odpre urejevalnik grafov.

Agentni vozli lahko tudi vstopijo v način [Human-in-the-Loop](./human-in-the-loop.md). V tem načinu agent dobi orodje `request_human_review` in se lahko ustavi pri specifičnih korakih, ki zahtevajo odobritev, ustvari enkratno javno povezavo za pregled, izpostavi `review` vejo platna za obvestilne tokove in čaka, dokler recenzent ne sprejme, spremeni ali zavrne besedilo pregleda v Markdownu. Polje HITL vozlišča deluje kot smernice za odobritev, kdaj vprašati, medtem ko je povzetek, usmerjen proti recenzentu, generiran iz vsake zahteve za pregled. Za orodja [MCP](../tabs/mcp-tab.md) Heym uporablja model za interpretacijo teh pisnih navodil v `always`, `once` ali `never`, tako da prosta jezikovna odobritev ustreza konkretni politiki izvajanja. Zagon je označen kot `pending` in se nadaljuje iz shranjenega posnetka izvajanja, ko odločitev prispe, in isti zagon agenta se lahko ustavi več kot enkrat, če kasnejši koraki prav tako zahtevajo pregled.

Agentni vozli samodejno stisnejo svojo akumulirano zgodovino sporočil, ko ta doseže 80 % okna konteksta modela. Sistemskega poziva, prvega uporabniškega sporočila in najnovejšega uporabniškega sporočila vedno ohranimo; vse vmes je povzeto z uporabo istega modela in poverilnic. Dogodki stiskanja so vidni v Debug panelu, [Execution History](./execution-history.md) in na zavihku [Traces](../tabs/traces-tab.md).

Glejte tudi [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) in [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Vozlišče Codex izvaja OpenAI Codex CLI znotraj izoliranega delovnega prostora Heym. Sprejema poverilnico Codex (prijavite se s ChatGPT, da uporabite svojo naročnino brez stroškov API na osnovi števila tokenov, ali prilepite dostopni token), poverilnico GitHub, URL repozitorija, osnovno vejo, nalogo prompt, način objave (`diff_only` ali `draft_pr`), ime veje in časovno omejitev. Izvajalec lokalno klonira repozitorij, prenese paket tokenov ChatGPT ali `CODEX_ACCESS_TOKEN` samo na proces Codex ter vrne strukturirano povzetek, opombe o validaciji, spremenjene datoteke, razliko, metapodatke o uporabi in opcijski URL osnutka PR.

Ko Codex vrne `needs_input`, se workflow ustavi in izpostavi vejo `question`. Povežite to vejo s Slackom, elektronsko pošto ali drugim obvestilnim vozliščem; javna povezava za nadaljevanje obnovi shranjeno izvršitev po oddaji odgovora. Vozlišče Codex je mogoče tudi povezati z AI Agentom kot orodjem, kar omogoča agentu, da delegira naloge kodiranja; kot orodje se rezultat `needs_input` vrne neposredno agentu namesto da bi ustavil workflow.

Oglejte si tudi [GitHub](../nodes/github-node.md), [Poverilnice](./credentials.md), [Deljenje poverilnic](./credentials-sharing.md) in [Vrste vozlišč](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Vozlišče OpenCode Go izvaja OpenCode CLI (Go) proti repozitoriju GitHub. Izolacija sledi vzorcu Codex: lokalno deluje kot podproces gostitelja, medtem ko Docker implementacije izvajajo znotraj utrjenega sosednjega kontejnerja, ki deli volumen delovnega prostora. Sprejema poverilnico OpenCode Go (ključ API za prehod z opcijskim osnovnim URL-jem), poverilnico GitHub, URL repozitorija, osnovno vejo, nalogo prompt, način objave, ime veje, časovno omejitev in model `opencode-go/<model>`, izbran iz živega, iskalnega seznama modelov (s vgrajenim varnostnim kopiranjem). Heym izvaja vse git/GitHub operacije na gostitelju in nikoli ne postavi GitHub tokena znotraj peskovnika; OpenCode samo ureja datoteke na disku. Vozlišče vrne strukturirano povzetek, opombe o validaciji, spremenjene datoteke, razliko in opcijski URL pull requesta. Lahko se poveže z AI Agentom kot orodjem.

Oglejte si tudi [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Poverilnice](./credentials.md), [Deljenje poverilnic](./credentials-sharing.md) in [Vrste vozlišč](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Vozlišče LLM obdeluje besedilo z jezikovnim modelom ali generira slike. Podpira generacijo besedila, vizijo (vhodne slike), generacijo slik, strukturiran JSON izhod, izvajanje API Batch, ki ga navajajo ponudniki za podprte OpenAI in OpenAI-kompatibilne končne točke, ter opcijski **Uporabi Responses API** preklop, ki usmeri klic skozi Responses API namesto Chat Completions (privzeto izklopljen; deluje z OpenAI in prilagojenimi poverilnicami ter se ne more kombinirati z načinom Batch). Konfigurirajte poverilnico, model, sistemske in uporabniške sporočila, temperaturo in največje število tokenov; uporabite [Expression DSL](./expression-dsl.md) v promptih. V načinu Batch mora `userMessage` biti razrešen v tabelo, vozlišče odda vejo `batchStatus` s posodobitvami napredka, končni izhod pa vključuje rezultate po posameznih elementih. Opcijski **Dodatno telo** preklop priloži JSON objekt specifičnih parametrov zahtevka ponudnika (na primer `{"thinking": {"type": "disabled"}}`) vsakemu API klicu; privzeto je izklopljen. Opcijski [Guardrails](./guardrails.md) blokirajo nevarno vsebino pred klicem.

Naravno se povezuje z [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) in [Dialog za oceno izrazov](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Vozlišče Decision postavlja vprašanja modelu odločanja o stanju izvajanja in vrača verjetnosti namesto besedila. Polje **State** nosi tisto, kar naj model prebere — osamljena izraz ohrani svojo vrsto, tako da `$input` pošlje objekt namesto njegovega besedila — in seznam vprašanj nosi presoje. Vprašanja so v treh oblikah: **noul** odgovarja, ali pogoj drži, **choice** izbere eno možnost iz niza, ki ga definirate, in vrne celotno porazdelitev, ter **score** ocenjuje stanje po urejenih ravneh in lahko pristane med njimi. Odgovori choice in score prav tako nosijo zaupanje, tako da lahko [Switch](../nodes/switch-node.md) usmeri na odgovor, medtem ko [Condition](../nodes/condition-node.md) odloča, kako prepričani so bili. **Generate with AI** osnutek predloge stanja in vrstic vprašanj iz navadne povedi, **Custom request body** pa pošlje ročno napisani JSON za končno točko, katere pogodba se razlikuje. Odgovor ponudnika se prenese nespremenjen, vsak klic pa se zabeleži v [Izvedbah](../tabs/traces-tab.md).

Potrebna je poverilnica Decision Model; naravno se povezuje z [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) in [Agent Node](../nodes/agent-node.md).
#### [RAG / Vektorska shramba](../nodes/rag-node.md)

Vozlišče RAG / Vektorska shramba vstavi, posodobi, izbriše in išče dokumente v vektorski shrambi za generacijo, obogateno z iskanjem. Spustni meni za bazo podatkov izbere ozadje — **Qdrant** (zunanji strežnik) ali **Postgres (pgvector)** (lastna baza Heym, brez zunanje storitve), privzeto na Qdrant. Izberite vektorsko shrambo iz zavihka [Vektorske shrambe](../tabs/vectorstores-tab.md) in nastavite operacijo na vstavljanje, posodobitev, brisanje ali iskanje. Posodobitev in brisanje obravnavata dokument po edinstvenem id-ju, shranjenem v payloadu — **Polje ID dokumenta** imenuje to polje (privzeto `doc_id`), **ID dokumenta** pa nosi njegovo vrednost — tako dokument ohrani id, ki ga že uporablja vaš sistem: posodobitev nadomesti vsako ujemajočo točko pred shranjevanjem nove različice, brisanje pa poroča, ali je bilo kaj ujemajočega. Metapodatki dokumenta sprejemajo izraze v svojih vrednostih, tako da `{"url": "$start.url"}` shrani, kar je izvajanje proizvedlo. Iskanje podpira filtre metapodatkov, izbirno **Hybrid Search** (vektorska podobnost, združena z ujemanjem ključnih besed BM25, tako da se natančni izrazi, kot so identifikatorji in kode napak, najdejo poleg semantičnih ujemanj) in izbirno ponovno razvrščanje Cohere (reranking) ter vrne polje rezultatov s text, score, metadata, zastavicami reranked in hybrid ter count za uporabo v [LLM](../nodes/llm-node.md) ali [Agent Node](../nodes/agent-node.md) tokovih.

Pogosta spodnja vozlišča so [LLM](../nodes/llm-node.md) in [Agent Node](../nodes/agent-node.md); nastavitev vektorske shrambe se nahaja v [Vektorskih shrambah](../tabs/vectorstores-tab.md).

#### [MCP Klicno vozlišče](../nodes/mcp-call-node.md)

MCP Klicno vozlišče neposredno pokliče določen [MCP](../tabs/mcp-tab.md) pripomoček, brez LLM, ki bi odločal, kateri pripomoček naj se pokliče. Uporabite ga, ko natančno veste, kateri pripomoček želite izvesti v času načrtovanja — za deterministično, enostopenjsko izvajanje MCP pripomočka v workflow. Konfigurirajte povezavo (SSE, Streamable HTTP ali stdio; ista polja kot pri povezavi MCP [Agent Node](../nodes/agent-node.md)), kliknite **Fetch Tools**, da napolnite spustni meni, izberite pripomoček in izpolnite argumentna polja, ki se samodejno prikažejo iz vhodne sheme pripomočka. Vsak argument sprejema statično vrednost ali [DSL izraz](./expression-dsl.md), kot je `$userInput.body.text`. Rezultat je na voljo kot `$nodeLabel.result` (JSON objekt, če je mogoče analizirati, sicer niz). MCP Klicno vozlišče se ne more povezati z [Agent Node](../nodes/agent-node.md) kot pripomoček na platnu.

Glejte tudi [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) in [Expression DSL](./expression-dsl.md).

### Logika

#### [Pogoj](../nodes/condition-node.md)

Pogojno vozlišče razveja workflow na podlagi izraza if/else. Ima dve izhodni ročici: eno za primer, ko je pogoj resničen, in eno za lažno. Uporabite primerjalne in logične operatorje iz [Expression DSL](./expression-dsl.md) v pogojnem izrazu; vozlišče prenese vhod v izbrano vejo.

Glejte tudi [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) in [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Switch vozlišče usmerja izvajanje na različne poti z ujemanjem vrednosti z primeri. Konfigurirajte izraz za oceno in seznam primerjalnih vrednosti; vsak primer dobi izvorno ročico, privzeta ročica pa se uporablja za neujemajoče vrednosti. Vhod se prenese v ujemajočo vejo.

Uporabite [Pogoj](../nodes/condition-node.md) za binarno razvejanje in [Merge](../nodes/merge-node.md) za ponovno združitev usmerjenih poti; pravila ujemanja so obravnavana v [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Merge vozlišče čaka na več vzporednih vhodov in jih združi v en sam izhod. Nastavite število vhodov, na katere je treba počakati; vozlišče ustvari združen objekt, ko so vse veje zaključene. Uporabite ga za združitev rezultatov iz vzporednih vej pred nadaljevanjem; ne uporabljajte ga, ko vzporedne veje končajo v ločenih Output vozliščih.

Glejte tudi [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) in [Output](../nodes/output-node.md) pri ponovnem združevanju vej.

#### [Loop](../nodes/loop-node.md)

Loop vozlišče iterira po nizu, izvaja spodnja vozlišča za vsak element. Zahteva povratno povezavo z zadnjim vozliščem v telesu iteracije za napredovanje. Znotraj telesa zanke uporabite `item`, `index`, `total`, `isFirst` in `isLast`; zanka ima ločene izhode za pot iteracije in pot končanja.

Povezuje se z [Spremenljivka](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) in [Expression DSL](./expression-dsl.md) za iterativne workflows.

### Podatki

#### [Nastavi](../nodes/set-node.md)

Nastavi vozlišče transformira in preslika vhodne podatke v prilagojen izhod. Določite preslikave ključ-vrednost, kjer je vsaka vrednost izraz [Expression DSL](./expression-dsl.md). Uporabite ga za velike črke, podnize, konkatenacijo, naključne številke in podobne transformacije. Dostopajte do izhoda po ključu (npr. `$setNode.keyName`). Ko je povezano z agentom kot pripomoček na platnu, lahko vrednosti preslikave označite kot agentom dodeljene, tako da agent izpolni te vrednosti med izvajanjem. Za klicanje drugih workflow-ov uporabite vozlišče [Execute](../nodes/execute-node.md) namesto tega.

Glejte tudi [Spremenljivka](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) in [Expression DSL](./expression-dsl.md).
#### [Pretvornik](../nodes/converter-node.md)

Pretvornik pretvarja podatke med formati brez pisanja kode. Pretvorbe besedila vključujejo `csvToJson` (CSV besedilo v tabelo objektov vrstic ali tabel, kadar ni glave), `jsonToCsv` (tabela objektov/vrstic v CSV besedilo), `xmlToJson` (XML besedilo v objekt) in `jsonToXml` (objekt v XML besedilo). Konfigurirajte smer pretvorbe in izraz vira; CSV pretvorbe dodatno uporabljajo ločilo in obravnavo glave, `jsonToCsv` pa lahko določi eksplicitno zaporedje stolpcev. Oznake, vgrajena ločila in vgrajene nove vrstice sledijo RFC 4180. XML atributi uporabljajo predpone `@`, besedilo, mešano z atributi, uporablja `#text`, ponovljeni elementi postanejo tabele, razširitev XML entitet pa je onemogočena. Enak vozlišče deluje tudi na shranjenih datotekah. `imageToText` in `pdfToText` izvajata Tesseract OCR, ki prebere datoteko iz Heym Drive (`$Upload.file.id` iz sprožilca nalaganja datotek, rezultat vozlišča Drive ali datoteko, ki jo ustvari agent), samodejno izbere jezik iz zaznane pisave ali uporabi kode, ki jih navedete, kot so `tur` ali `eng+tur`, in privzeto normalizira besedilo v UTF-8 z možnostjo NFC normalizacije in ožjimi znakovnimi nabori, kot je `cp1254`. `fileConvert` prepiše shranjeno datoteko v drug format, dokumente preko pandoc in slike preko Pillow, ter shrani rezultat kot novo datoteko v Drive brez dotikanja izvirnika. Rezultat je na voljo kot `$converterNode.result`, skupaj z `.language`, `.encoding`, `.page_count`, `.pages` in `.file` za OCR izvajanja ter `.id`, `.filename` in `.download_url` za `fileConvert`.

Oglejte si tudi [Nastavi](../nodes/set-node.md), [Podatkovna tabela](../nodes/datatable-node.md) in [Izrazni DSL](./expression-dsl.md).

#### [Koda](../nodes/code-node.md)

Koda vozlišča izvaja Python, ki ga napišete, s svojim `requirements.txt`, v vsebniku, ki se ustvari in uniči za vsako izvajanje. Vaša koda definira funkcijo `main(params)` in vrne katero koli vrednost, ki jo je mogoče serializirati v JSON, kar postane `$codeNode.result`; vse, kar natisne, se ločeno zajame kot `$codeNode.logs`, in `$codeNode.install` poroča, kateri orodje je namestilo odvisnosti. Parametri so konfigurirani kot JSON objekt, katerih `$` izrazi se razrešijo pred izvajanjem, koda pa jih bere z notacijo pika, kot je `params.user.name` ali `params.orders[0].id`. Odvisnosti se namestijo z `uv`, pri čemer se za pakete, ki jih `uv` ne more obvladati, uporabi `pip`, brez predpomnjenja med izvajanji; pustitev `requirements.txt` praznega popolnoma preskoči namestitev in je veliko hitrejša. Faza izvajanja nima omrežja, razen če je `codeAllowNetwork` vklopljen, medtem ko namestitev odvisnosti vedno doseže PyPI. Peskovnik deluje brez korenskih pravic z vsemi zmožnostmi onemogočenimi, z datotečnim sistemom samo za branje, brez Docker vtičnice in brez dostopa do skrivnosti v ozadju, omejen na 512 MB pomnilnika, en CPU, 256 procesov, 120-sekundno namestitev in 60-sekundno izvajanje. Docker je obvezen in ni načina za povrnitev: brez dosegljivega demona vozlišče ne uspe, namesto da bi izvajalo vašo kodo v procesu v ozadju.

#### [Spremenljivka](../nodes/variable-node.md)

Vozlišče Spremenljivka nastavi ali posodobi lokalno spremenljivko v workflowu (`$vars.variableName`) ali trajno [globalno spremenljivko](./global-variables.md) (`$global.variableName`). Uporabite ga za števce, akumulirane sezname in skupno stanje. Konfigurirajte ime spremenljivke, izraz vrednosti, prisilitev tipa in ali shraniti v globalno shrambo. Tabele spremenljivke podpirajo `$array()` in `.add()`.

Povezuje se z [Nastavi](../nodes/set-node.md), [Zanka](../nodes/loop-node.md) in [Globalne spremenljivke](./global-variables.md).

#### [Izvedi](../nodes/execute-node.md)

Vozlišče Izvedi kliče drug workflow (pod-workflow) in mu posreduje vhod. Določite ciljni workflow z ID-jem in zagotovite vhod preko enega samega izraza ali preslikav ključ-vrednost. Izhod vključuje workflow_id, status in izhode; uporabite ga za ponovno uporabno logiko, ne za transformacijo podatkov (za to uporabite Nastavi).

Oglejte si tudi [Funkcije platna](./canvas-features.md) za Izvleči v pod-workflow, [Struktura workflowa](./workflow-structure.md) in [Izhod](../nodes/output-node.md).

### Integracije

#### [HTTP](../nodes/http-node.md)

Vozlišče HTTP izvaja HTTP poizvedbe z uporabo konfiguracije v slogu cURL. Lahko je izhodišče workflowa (brez prihajajoče povezave) ali prejme vhod iz zgornjih vozlišč. Odgovor je na voljo kot status, glave in telo (razčlenjen JSON, kadar je to primerno). Uporabite [Poverilnice](./credentials.md) za Bearer ali prilagojeno avtentikacijo z glavo.

Povezuje se z [Webhooki](./webhooks.md), [Poverilnicami](./credentials.md) in [Integracijami tretjih oseb](./integrations.md).

#### [WebSocket Pošlji](../nodes/websocket-send-node.md)

Vozlišče WebSocket Pošlji odpre odhodno odjemalsko povezavo, pošlje eno besedilno/JSON/binarno sporočilo in jo zapre. Uporabite ga za objavo izhoda workflowa v sistemih v realnem času brez ustvarjanja Heym-gostiteljske socket končne točke.

Oglejte si tudi [WebSocket Sprožilec](../nodes/websocket-trigger-node.md), [SSE Pretakanje](./sse-streaming.md) in [Integracije tretjih oseb](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Telegram vozlišče pošilja sporočilo bota v klepet, skupino ali kanal. Konfigurirajte Telegram [poverenje](./credentials.md), nastavite `chatId` in sestavite odhodno `sporočilo` z izrazi [Expression DSL](./expression-dsl.md). Naravno se povezuje z [Telegram Trigger](../nodes/telegram-trigger-node.md) za pogovorne workflows in z [Error Handler](../nodes/error-handler-node.md) za opozorila operaterjev.

Oglejte si tudi [Integracije tretjih oseb](./integrations.md) in [Poverilnice](./credentials.md) za nastavitve in vzorce poverilnic.

#### [Slack](../nodes/slack-node.md)

Slack vozlišče pošilja sporočilo v Slack kanal prek Incoming Webhook. Konfigurirajte Slack [poverenje](./credentials.md) in izraz sporočila. Uporabite ga za obvestila, opozorila in poročanje o napakah; izhod prehaja skozi vhod.

Povezuje se z [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) in [Integracijami tretjih oseb](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Discord vozlišče pošilja sporočilo v Discord kanal prek Incoming Webhook. Konfigurirajte Discord [poverenje](./credentials.md), sestavite odhodno sporočilo z [Expression DSL](./expression-dsl.md) in po želji nastavite nadomestne vrednosti za uporabniško ime ali avatar webhooka.

Povezuje se z [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) in [Integracijami tretjih oseb](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Send Email vozlišče pošilja e-pošto prek SMTP. Konfigurirajte SMTP [poverenje](./credentials.md) in izraze [Expression DSL](./expression-dsl.md) za prejemnike, zadevo in telo. Uporabite ga za obvestila, opozorila in transakcijska e-poštna sporočila. Izhod vključuje status, prejemnika in zadevo.

[IMAP Trigger](../nodes/imap-trigger-node.md) dopolnjuje Send Email z obravnavo dohodne pošte. Skupaj omogočata workflow-u branje dohodne e-pošte iz skupne nabiralnika, povzemanje ali razvrščanje z AI vozlišči ter pošiljanje nadaljnjega ali eskalacijskega sporočila. [Telegram Trigger](../nodes/telegram-trigger-node.md) in [Telegram vozlišče](../nodes/telegram-node.md) zagotavljata enak vzorec dohodnega/odhodnega za pogovorne workflows, ki jih vodi bot.

Za dvosmerne tokove obvestil se dobro povezuje tudi z [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) in [Integracijami tretjih oseb](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Redis vozlišče izvaja operacije Redis: set, get, hasKey in deleteKey. Uporabite ga za predpomnjenje, omejevanje hitrosti in shranjevanje ključ-vrednost. Konfigurirajte [poverenje](./credentials.md), vrsto operacije, izraz ključa in za operacije set vrednost ter neobvezni TTL. Izhod se razlikuje glede na operacijo (vrednost, uspeh, obstaja, izbrisan).

Povezuje se z [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) in [Parallel Execution](./parallel-execution.md) za predpomnjenje, omejevanje in usklajevanje.

#### [Grist](../nodes/grist-node.md)

Grist vozlišče bere, piše in upravlja podatke v Grist preglednicah. Operacije vključujejo getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables in listColumns. Zagotovite ID dokumenta, ID tabele in za ustvarjanje/posodabljanje podatke o zapisu z uporabo ID-jev stolpcev. Uporabite ga za CRUD, serijske posodobitve in avtomatizacijo preglednic.

Oglejte si tudi [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) in [Integracije tretjih oseb](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets vozlišče bere, piše in upravlja podatke preglednic prek OAuth2. Uporabite ga za branje poročil, dodajanje rezultatov workflow-a, posodabljanje sledilnikov ter čiščenje ali pregledovanje zavihkov preglednic znotraj workflow-a. Tako kot [BigQuery](../nodes/bigquery-node.md) uporablja poverilnico, ki jo podpira Google, in se dobro ujema z [Grist](../nodes/grist-node.md), ko so podatki preglednic del toka.

Povezuje se z [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) in [Integracijami tretjih oseb](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery vozlišče izvaja SQL poizvedbe in vstavi vrstice v Google BigQuery zbirke podatkov prek OAuth2. Uporabno je za analitične workflows, poročevalske pipeline in pisanje strukturiranih podatkov dogodkov iz izvajanj workflow-a. Pogosto se povezuje z [Set](../nodes/set-node.md) za oblikovanje vrstic in [Google Sheets](../nodes/google-sheets-node.md) za lažje poročanje, usmerjeno na preglednice.

Povezuje se z [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) in [Integracijami tretjih oseb](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Vozlišče Google Drive omogoča seznam, prenos, posodabljanje in brisanje datotek ter map na Drive-u prek OAuth2, ter lahko neposredno kopira datoteko Drive v [Heym Drive](../nodes/drive-node.md) z operacijo `syncToHeymDrive`. Google Docs, Sheets in Slides nimajo prenosnih bajtov, zato vozlišče samodejno izvozi te datoteke — Docs v PDF, Sheets v XLSX, Slides v PPTX — z možnostjo nadzora nad ciljno obliko. Brisanja premaknejo elemente v smeti Drive, razen če je omogočeno "Trajno brisanje", vozlišče pa zavrne brisanje mape prek operacije datoteke ali obratno. Tako kot [Google Sheets](../nodes/google-sheets-node.md) uporablja poverilnico OAuth2, ki jo podpira Google; upoštevajte, da ta zahteva popoln dostop do Drive-a, zato pred deljenjem preglejte [Deljenje poverilnic](./credentials-sharing.md).

Povezuje se z [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) in [Integracijami tretjih oseb](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Vozlišče GitHub ponuja 40 naravnih REST akcij GitHub, ki pokrivajo repozitorije, organizacije in uporabnike, težave, pull requeste, preglede, izdaje, delovne tokove Actions, vpoglede v promet in datoteke repozitorijev. Uporabite ga za triage težav, avtomatizacijo pregledov, sprožitev delovnih tokov in čakanje na dokončanje, avtomatizacijo izdaj in posodobitve datotek repozitorijev brez ročnega sestavljanja HTTP zahtevkov. Podpira GitHub.com in opcionalni `base_url` za GitHub Enterprise na poverilnici.

Povezuje se z [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) in [Integracijami tretjih oseb](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Vozlišče Jira povezuje delovne tokove z REST API-ji Jira Cloud ali Jira Data Center / Server za avtomatizacijo projektov, težav, komentarjev, priponk, uporabnikov, obvestil in prehodov. Lahko našteva projekte, išče težave z JQL, ustvarja ali posodablja težave, pregleduje zgodovino sprememb, obvešča deležnike, upravlja s komentarji in priponkami, pridobiva ali upravlja uporabnike, našteva razpoložljive prehode in premika težave prek ID prehoda. Uporabite poverilnico Jira z Atlassian e-pošto, API žetonom, osnovnim URL-jem spletnega mesta in načinom namestitve.

Povezuje se z [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) in [Integracijami tretjih oseb](./integrations.md) za podporo, triage napak in delovne tokove izdaj.

#### [Linear](../nodes/linear-node.md)

Vozlišče Linear povezuje delovne tokove z GraphQL API-jem Linear za avtomatizacijo delovnih prostorov in težav. Lahko našteva ekipe, projekte, težave, stanja delovnih tokov, člane ekipe in komentarje; ustvarja, posodablja, briše in povezuje težave; ter ustvarja, posodablja, rešuje, razrešuje ali briše komentarje. Uporabite osebni API ključ Linear ali poverilnico OAuth2, nato odkrijte UUID-je ekipe, projekta, stanja in dodeljenega uporabnika iz operacij naštevanja pred ustvarjanjem ali posodabljanjem težav.

Povezuje se z [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) in [Integracijami tretjih oseb](./integrations.md) za sprejem, triage in delovne tokove inženiringa.

#### [Supabase](../nodes/supabase-node.md)

Vozlišče Supabase bere in spreminja tabele, ki jih izpostavlja Supabase PostgREST. Dobro deluje za backende produktov, podatke o uporabnikih/profilih, stanje delovnih tokov in avtomatizacije v slogu CRUD, ki želijo dostop do podatkovne baze brez prilagajanja HTTP zahtevkov.

Povezuje se z [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) in [Integracijami tretjih oseb](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Vozlišče ClickHouse izvaja CRUD, štetje in surove SQL operacije proti zunanji ClickHouse podatkovni bazi prek njenega HTTP vmesnika. Primerno je za analitične pipeline, beleženje dogodkov in delovne tokove poročanja: vstavite dogodke, ko se zgodijo, nato jih agregirajte ali preštejte z `query`/`count`. Odraža niz operacij [DataTable](../nodes/datatable-node.md) (najdi, getAll, count, getById, insert, update, remove, upsert) plus surov SQL izhod, pri čemer `update`/`remove` deluje kot ClickHouse mutacije.

Povezuje se z [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) za načrtovana poročila in [Integracijami tretjih oseb](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Vozlišče Notion upravlja z Notion bazami podatkov, podatkovnimi viri, stranmi in bloki prek trenutnega Notion API-ja (`2026-03-11`). Podpira iskanje, CRUD strani, operacije baz podatkov in podatkovnih virov, otroke blokov, dodajanje/posodabljanje/brisenje blokov ter smeti/obnavljanje. Uporabite notranji integracijski žeton ali poverilnico OAuth za javno integracijo Notion. Urejevalnik lahko išče in paginira dostopne podatkovne vire in matične strani. Deljene poverilnice delujejo enako kot lastniške poverilnice za izvajanje delovnih tokov.

Za prilagojene REST klice se `$credentials.YourNotionCredential` razreši v isti žeton nosilca. Povezuje se z [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) in [Integracijami tretjih oseb](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Sentry vozlišče avtomatizira organizacije, projekte, ekipe, težave, dogodke in izdaje Sentry preko Sentry REST API. Uporabite ga za trižo opozoril, posodobitve statusa težav, avtomatizacijo izdaj, iskanje dogodkov ter nastavitev ali čiščenje projektov/ekip. Podpira Sentry SaaS in samostojno gostovanje Sentry preko opcijskega URL-ja poverilnic.

Povezuje se z [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) in [Third-Party Integrations](./integrations.md) za delovne tokove incidentov in izdaj.

#### [DataTable](../nodes/datatable-node.md)

DataTable vozlišče bere, piše in upravlja podatke v Heym DataTables (prva stranka strukturirana shrambe). Operacije vključujejo iskanje, pridobivanje vseh, pridobivanje po ID-ju, vstavljanje, posodabljanje, odstranjevanje in upsert. Zunanje poverilnice niso potrebne. Tabele se upravljajo iz zavihka [DataTable](../tabs/datatable-tab.md) nadzorne plošče in so dostopne neposredno lastniku delovnega toka.

Povezuje se z [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) in [DataTable tab](../tabs/datatable-tab.md) za prvo stranko strukturirano shrambo.

#### [Drive](../nodes/drive-node.md)

Drive vozlišče upravlja datoteke, ki jih generirajo veščine neposredno znotraj delovnega toka. Operacije vključujejo brisanje, nastavitev gesla, nastavitev TTL, nastavitev največjega števila prenosov, deljenje z mojimi ekipami in prenehanje deljenja z mojimi ekipami za upravljanje dostopa do branja; pretvorba formatov se nahaja v vozlišču [Converter](../nodes/converter-node.md). Datoteko lahko referencirate z `$agentLabel._generated_files[0].id`; izhodi vključujejo status, file_id, posodobljen download_url za omejitve povezav in shared_team_count za deljenje z ekipami. To je še posebej uporabno pri [Agent Node](../nodes/agent-node.md) delovnih tokov, ki uporabljajo [File Generation](./file-generation.md) in referenčni model [Drive](./drive.md).

Pogosti spremljevalci so [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) in [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 vozlišče izvaja operacije shranjevanja objektov na Amazon S3 z uporabo `s3` poverilnice (dostopna ključ, skrivni ključ, regija, opcijski sejni žeton). Operacije vključujejo putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder in listBuckets. Podprti so nalogi besedila in prenos besedila ali base64, pri čemer polja za vedro in ključ sprejemajo [Expression DSL](./expression-dsl.md). Uporabite ga za shranjevanje izhodov delovnega toka, arhiviranje datotek in branje objektov nazaj v tok.

Povezuje se z [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) in [Third-Party Integrations](./integrations.md).

### Avtomatizacija

#### [Crawler](../nodes/crawler-node.md)

Crawler vozlišče strga spletne strani z uporabo FlareSolverr z opcijskim HTML ekstrakcijo preko CSS selektorjev. Konfigurirajte FlareSolverr [poverilnico](./credentials.md), izraz URL, čas čakanja in opcijske selektorje za ekstrakcijo. Izhod je surov HTML ali ekstraktirana vsebina. Uporabite ga za strganje spletnih strani in ekstrakcijo vsebine.

Povezuje se z [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) in [LLM](../nodes/llm-node.md) za tokove strganja in analize.

#### [Playwright](../nodes/playwright-node.md)

Playwright vozlišče avtomatizira interakcije z brskalnikom s konfigurabilnimi koraki (navigacija, osvežitev, klik, vnos, posnetek zaslona, ekstrakcija, aiStep) ali **Run Code** načinom za prilagojeno Playwright Python (v peskovniku; privzeto izklopljen preko `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Podpira brezglavi način, opcijska nastavitev, ki zmanjšuje običajne signale avtomatizacije Playwright, časovne omejitve, opcijsko zajemanje omrežja (odzivi, piškotki, localStorage, sessionStorage), avtentikacijo iz piškotkov/storageState iz [Global Variables](./global-variables.md) izrazov, kot je `$global.authState`, korake prijave v primeru neuspeha obnavljanja avtentikacije ter AI korak z Auto Heal, ko selektorji ne uspejo. Uporabite ga za strganje spletnih strani, izpolnjevanje obrazcev in delovne tokove, ki temeljijo na brskalniku.

Glejte tudi [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) in [Execution History](./execution-history.md) za avtomatizacijo brskalnika in odpravljanje napak.

### Orodja

#### [Output](../nodes/output-node.md)

Output vozlišče je končna točka delovnega toka, ki vrača odgovor klicatelju. Nastavite izraz sporočila, da se sklicuje na prejšnje vozlišče po oznaki (nikoli ne uporabljajte `$input` iz [Input](../nodes/input-node.md) vozlišča tukaj). Opcijski asinhroni tokovi omogočajo, da vozlišča po izhodu delujejo v ozadju, potem ko je odgovor poslan.

Pogosti viški so [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) in [Execute](../nodes/execute-node.md); oblikovanje odgovorov je lažje za odpravljanje napak v [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper vozlišče gradi navaden JSON objekt iz [Set](../nodes/set-node.md)-stil ključ-vrednost mapiranj in ga vrača na vrhu odgovora delovnega toka. Uporabite ga, ko naj bi API klicatelj prejel surovo JSON telo namesto standardnega ovitka [Output](../nodes/output-node.md) vozlišča.
#### [HTML izhodni mapper](../nodes/html-output-mapper-node.md)

HTML izhodni mapper vozlišče upodablja en sam HTML predlogo, interpolira izraze `$nodeLabel.field` v stran. Ko je to edino terminalno vozlišče v workflow-u, webhook za izvajanje odgovori z `text/html` in konfigurirano statusno kodo vozlišča namesto JSON telesa, tako da lahko workflow neposredno služi stran brskalniku. Pošljite `X-Simple-Response: false`, da dobite običajen JSON ovoj za odpravljanje napak.

Povezuje se z [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Struktura workflow-a](./workflow-structure.md) in [Webhooki](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Chart Output vozlišče je terminalno vozlišče [Dashboard](../tabs/dashboard-tab.md) widget workflow-a. Pretvori vrstice, ki jih proizvedejo zgornja vozlišča, v standardiziran chart payload, ki ga dashboard upodablja. Izberite `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, Gantt, entity relationships, text ali HITL), preslikajte `labelField`/`valueField` (ali `series` za več serij, ali `text` za markdown sporočilo) in ga postavite na konec; nima izhodne robne povezave. Gantt bere vrstice opravil z začetnimi/končnimi datumi ISO, napredkom in ID-ji odvisnosti. Entity relationships bere grafni objekt z entitetami, polji, ključi PK/FK in relacijami. Oboje se upodablja tudi na straneh Heym Work in v predogledih predlogov gradnikov. HITL ignorira zgornje vrstice in navaja vaše čakajoče človeške preglede. in drugo kot gumbe povezav, ki odprejo URL v novem zavihku (`linkColumn`, z `linkLabel` za besedilo gumba)

Glejte tudi [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) in [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Wait vozlišče ustavi izvajanje workflow-a za določen čas v milisekundah, do 15 minut. Uporabite ga za omejevanje hitrosti, zamujene akcije ali intervale anketiranja. Prepušča vhod nespremenjen.

Povezuje se z [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) in [Paralelno izvajanje](./parallel-execution.md) za usklajevanje in anketiranje.

#### [Sticky Note](../nodes/sticky-note-node.md)

Sticky Note vozlišče dodaja markdown opombe na platno. Ni izvršeno. Uporabite ga za dokumentacijo, navodila ali opombe o workflow-u poleg drugih [Canvas Features](./canvas-features.md). Dvakrat kliknite na platno, da uredite vsebino opombe.

Glejte tudi [Canvas Features](./canvas-features.md), [Kratice na tipkovnici](./keyboard-shortcuts.md) in [Organizacija workflow-a](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Console Log vozlišče beleži vrednost v konzolo backend-a (strežnika). Uporabite ga za odpravljanje napak in pregledovanje med razvojem. Sporočilo v dnevniku podpira izraze [Expression DSL](./expression-dsl.md); izhod prepušča vhod.

Povezuje se z [Zgodovina izvajanja](./execution-history.md), [Izvajanja](../tabs/traces-tab.md) in [Dialog za vrednotenje izrazov](./expression-evaluation-dialog.md) za odpravljanje napak.

#### [Disable Node](../nodes/disable-node.md)

Disable Node vozlišče trajno onemogoči drugo vozlišče v workflow-u tako, da nastavi njegov `active` zastavico na false. Določite ciljno vozlišče po oznaki. Uporabite ga za enkratne operacije, kot je ustavitev [Cron](../nodes/cron-node.md) triggerja po izpolnitvi pogoja.

Glejte tudi [Canvas Features](./canvas-features.md), [Zgodovina urejanja](./edit-history.md) in [Cron](../nodes/cron-node.md) za vzorce nadzora workflow-a.

#### [Enable Node](../nodes/enable-node.md)

Enable Node vozlišče ponovno vklopi drugo vozlišče tako, da nastavi njegov `active` zastavico na true in shrani spremembo. Določite ciljno vozlišče po oznaki. Uporabite ga za ponovno aktiviranje onemogočenega [Cron](../nodes/cron-node.md) triggerja iz drugega vstopnega mesta ali za vklop vozlišča, ko je izpolnjen pogoj. Cilj, ki se nahaja downstream od Enable Node in še ni bil izveden, se prav tako izvede v trenutnem izvajanju.

Glejte tudi [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) in [Cron](../nodes/cron-node.md) za vzorce nadzora workflow-a.

#### [Throw Error](../nodes/throw-error-node.md)

Throw Error vozlišče takoj ustavi izvajanje workflow-a in vrne odgovor o napaki s prilagojeno HTTP statusno kodo. Nastavite izraz za sporočilo o napaki in statusno kodo (npr. 400, 401, 403, 404, 429, 500). Uporabite ga za napake pri validaciji, nepooblaščen dostop ali druge pogoje napak, še posebej v kombinaciji z [Condition](../nodes/condition-node.md) in [Error Handler](../nodes/error-handler-node.md).

Povezuje se z [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) in [Varnost](./security.md) za eksplicitne poti neuspeha.

---

## Referenca
### [Vrste vozlišč](./node-types.md)

Heym ponuja različne vrste vozlišč: sprožilce, kot so [Vhodno vozlišče](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) in [Obvladovalec napak](../nodes/error-handler-node.md); AI vozlišča, kot so [LLM](../nodes/llm-node.md), [Odločitev](../nodes/decision-node.md), [Agent vozlišče](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) in [MCP Klic](../nodes/mcp-call-node.md); logična vozlišča, kot so [Pogoj](../nodes/condition-node.md), [Preklop](../nodes/switch-node.md), [Združitev](../nodes/merge-node.md) in [Zanka](../nodes/loop-node.md); podatkovna vozlišča, kot so [Nastavi](../nodes/set-node.md), [Pretvornik](../nodes/converter-node.md), [Koda](../nodes/code-node.md), [Spremenljivka](../nodes/variable-node.md), [Izvedi](../nodes/execute-node.md) in [Heym](../nodes/heym-node.md); integracije, kot so [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Pošlji e-pošto](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Podatkovna tabela](../nodes/datatable-node.md) in [Drive](../nodes/drive-node.md); avtomatizacijska vozlišča, kot sta [Crawler](../nodes/crawler-node.md) in [Playwright](../nodes/playwright-node.md); ter pripomočki, kot so [Počakaj](../nodes/wait-node.md), [Izhod](../nodes/output-node.md), [JSON izhodni mapper](../nodes/json-output-mapper-node.md), [HTML izhodni mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Vrzi napako](../nodes/throw-error-node.md), [Onemogoči vozlišče](../nodes/disable-node.md), [Omogoči vozlišče](../nodes/enable-node.md) in [Sticky Note](../nodes/sticky-note-node.md). Uporabite izraze, kot so `$input.text` in `$nodeLabel.field` v konfiguraciji vozlišč.

Oglejte si tudi [Sprožilci](./triggers.md), [Integracije tretjih oseb](./integrations.md) in [Paralelna izvajanja](./parallel-execution.md).

### [Izrazni DSL](./expression-dsl.md)

Heym uporablja preprost izrazni jezik za sklicevanje na podatke iz zgornjih vozlišč. Uporabite `$input` za [Vhodno vozlišče](../nodes/input-node.md), `$nodeLabel.field` za katero koli zgornje vozlišče, `$credentials.CredentialName` za [poverilnice](./credentials.md) in `$global.variableName` za [globalne spremenljivke](./global-variables.md). Vgrajene posebne spremenljivke vključujejo `$now`, `$UUID` in metapodatke delovnega toka: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` in `$executionId` (id [Zgodovine izvajanja](./execution-history.md) teka — `/workflows/{id}/{executionId}` odpre ta tek na platnu; samo v času izvajanja, prazen v pogovornem oknu za predogled izrazov). Podpora vključuje literale, aritmetiko, primerjave, kontekst [Zanke](../nodes/loop-node.md), gnezdene polja in pomožne funkcije za nize/array (vključno z `$text.toJson()` za razčlenitev JSON niza). Ko je celotna vrednost en sam `$expr`, backend ohrani tabele, objekte, booleane in števila kot naravne tipe.

Oglejte si tudi [Pogovorno okno za vrednotenje izrazov](./expression-evaluation-dialog.md), [Globalne spremenljivke](./global-variables.md) in [Struktura delovnega toka](./workflow-structure.md).

### [Globalne spremenljivke](./global-variables.md)

Shramba globalnih spremenljivk hrani trajne, uporabniško obsežne podatke v obliki ključ-vrednost, ki preživijo med izvajanji delovnih tokov. Ustvarite spremenljivke iz zavihka [Spremenljivke](../tabs/global-variables-tab.md) ali iz [Spremenljivke](../nodes/variable-node.md) z omogočeno možnostjo "Shrani v shrambo globalnih spremenljivk". Dostopate lahko do njih z `$global.variableName` v izrazih; deliti jih je mogoče z drugimi uporabniki ali [skupinami](./teams.md).

Povezuje se s [Spremenljivko](../nodes/variable-node.md), [Skupinami](./teams.md) in [Deljenjem poverilnic](./credentials-sharing.md) za skupno stanje delovnega toka.
### [Dialog za Vrednotenje Izrazov](./expression-evaluation-dialog.md)

Dialog za vrednotenje izrazov je razširljiv urejevalnik, ki se prikaže, ko kliknete gumb za razširitev poleg polj izrazov. Odpre se kot velik osrednji modal, ohranja aktivno samodejno dopolnjevanje in samodejno osveži izhod predogleda v ozadju, ko prenehate tipkati. Rezultate objektov in tabel lahko pregledujete s pomočjo izbire poti izhoda. Dialog sprejema polno vrstično golo pot z piko (na primer `myNode.output.field`), kot da bi bila `$myNode.output.field`; glejte pravila postavitve [Expression DSL](./expression-dsl.md).

Gumb **Zgradite z AI** v orodni vrstici vam omogoča, da v preprostem besedilu opišete izraz, ki ga želite. Izberite [poverenje](./credentials.md) LLM in model, vnesite opis, kot je *"Pridobite ime stranke iz odgovora API"*, in kliknite Generiraj. Ozadje pošlje kontekst [Expression DSL](./expression-dsl.md) in izhode zadnjega izvajanja vozlišča modelu ter vrne en sam izraz. Rezultat se takoj oceni, tako da ga lahko preverite, preden kliknete Uporabi.

Naravno se povezuje z [Expression DSL](./expression-dsl.md), [Izhod](../nodes/output-node.md) in [JSON izhodnim mapperjem](../nodes/json-output-mapper-node.md).

### [Struktura Workflowa](./workflow-structure.md)

Workflows so shranjeni kot JSON z vozlišči in robovi. Objekt workflow vključuje id, ime, opis, vozlišča, robove in nastavitve avtentikacije. Vsako vozlišče ima id, tip, položaj in podatke (označbo in konfiguracijo specifično za tip). Robovi povezujejo ID-je izvornih in ciljanih vozlišč z neobveznimi ID-ji ročajev. Sintaksa izrazov v podatkovnih poljih sledi [Expression DSL](./expression-dsl.md), in ta ista oblika se uporablja pri [Prenos & Uvozu](./download-import.md).

Glejte tudi [Tipi vozlišč](./node-types.md), [Expression DSL](./expression-dsl.md) in [Prenos & Uvoz](./download-import.md).

### [Značilnosti Platna](./canvas-features.md)

Preletite katero koli nestikajoče vozlišče na platnu in kliknite **Zaženi**, da izvedete do tega vozlišča. Zahtevani vnosi se odprejo v panele za izvajanje, pri čemer je prvo polje osredotočeno; poti brez vhodov se začnejo takoj. Glejte [Zaženi do vozlišča](./canvas-features.md#run-to-node).

Urejevalnik workflowa ponuja Data Pin (pripnite zadnji izhod vozlišča za testiranje downstream brez ponovnega izvajanja), Izvršitvene dnevnike (rezultate vozlišč v realnem času in napredek agenta, ki dopolnjujejo [Zgodovino izvajanja](./execution-history.md)), Omogoči/Onemogoči (preskočite vozlišča med izvajanjem) in Izvleči v pod-workflow (premaknite izbiro v nov workflow in jo nadomestite z [Izvrši](../nodes/execute-node.md) vozliščem). Izvajanje v produkciji se lahko odpre iz Zgodovine ali kartice na plošči; urejevalnik obnovi trenutno stanje, se poveže s SSE in ohrani animacijo platna ter dnevnike odprtih napak. [Kratice na tipkovnici](./keyboard-shortcuts.md) podpirajo kopiranje, lepljenje, izvajanje in iskanje vozlišč v vrstici.

Glejte tudi [Kratice na tipkovnici](./keyboard-shortcuts.md), [Zgodovina urejanja](./edit-history.md) in [Zgodovina izvajanja](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Oglejte si predstavitev urejevalnika</a></p>

### [Kratice na Tipkovnici](./keyboard-shortcuts.md)

Heym ponuja kratice po celotnem urejevalniku: Paleta ukazov (Ctrl+K), Zaženi (Ctrl+Enter), Shrani (Ctrl+S), Razveljavi/Ponovi, in Escape za zaprtje. Na platnu: izberite vse, večkratna izbira, kopiraj/izreži/lepi, izbriši, preklopi omogočeno vozlišče (D), preklopi pripeta podatka (P) in iskanje vozlišč v vrstici s tipkanjem. Kratice so dokumentirane v referenci znotraj aplikacije in tesno sodelujejo z [Značilnostmi platna](./canvas-features.md), kot sta Data Pin in omogočanje/onemogočanje vozlišč.

Glejte tudi [Značilnosti platna](./canvas-features.md), [Hitri predal](./quick-drawer.md) in [Kontekstna predstavitev](./contextual-showcase.md).

### [AI Pomočnik](./ai-assistant.md)

AI Pomočnik je klepetalna plošča, ki se odpre iz plošče za odpravljanje napak in vam omogoča, da ustvarite ali spremenite workflows z naravnim jezikom. Izberite [poverenje](./credentials.md) in model, nato opišite, kaj želite; AI pretaka odgovor in vsak veljaven [workflow JSON](./workflow-structure.md) v blokih kode se samodejno analizira in uporabi na platnu. Podpora za glasovni vnos je na voljo v združljivih brskalnikih.

Vklopite **YOLO način** (način agenta, privzeto izklopljen) in pomočnik testira, kar gradi. Po vsaki spremembi izvede workflow na platnu, prebere rezultat in popravi workflow, dokler ne stori, kar ste zahtevali, do 5 izvajanj na sporočilo. Pred prvo izvedbo vpraša po testnih vhodih, lahko izvede vaše druge workflows, ko potrebuje njihov rezultat, in prikazuje vsak korak, ko dela. Glejte [AI Pomočnik › YOLO način](./ai-assistant.md#yolo-mode).

Kliknite **AI** nad katerim koli vozliščem na canvasu, da spremenite ali popravite samo to vozlišče. Plošča prikazuje vozlišče, ki ga spreminja (z njegovim zadnjim rezultatom po zagonu), in ponuja **Change this node as ...**, **Fix error in this node ...** in **Other**. Posodobi se samo to vozlišče; preostali del workflowa in postavitev ostaneta nespremenjena. Glejte [AI Assistant › Spreminjanje posameznega vozlišča](./ai-assistant.md#changing-one-node).

Ko workflow shranjuje zapise, pomočnik vpraša, katero [podatkovno tabelo](../tabs/datatable-tab.md) naj uporabi, ali ustvari novo s stolpci, ki jih workflow potrebuje. Glejte [AI Pomočnik › Podatkovne tabele](./Chat in MCP `heym_chat` lahko tudi neposredno urejata stolpce in vrstice z lastniškim dostopom ali dostopom za pisanje, s potrditvijo pred odstranitvijo stolpcev ali brisanjem vseh vrstic. Chat in MCP `heym_chat` lahko tudi neposredno urejata stolpce in vrstice z lastniškim dostopom ali dostopom za pisanje, s potrditvijo pred odstranitvijo stolpcev ali brisanjem vseh vrstic. ai-assistant.md#data-tables).

Ko trenutni workflow vsebuje veščine [Agent Node](../nodes/agent-node.md), pomočnik pošlje le `SKILL.md` vsake veščine v kontekst workflowa. Priložene datoteke `.py` in binarni viri veščin so izključeni pred zahtevo, tako da veliki paketi veščin ne preplavijo okna konteksta modela.

Naravno se povezuje z [Klepetajte z Heym](./chat-with-heym.md), [Arhitektura agenta](./agent-architecture.md) in [Expression DSL](./expression-dsl.md).
### [Pogovorite se z Heym](./chat-with-heym.md)

Pogovorite se z Heym je pomočnik za dokumentacijo, namenjen vprašanjem o izdelku. Odpre se v osrednjem pogovornem oknu, ohranja vidne poverilnice in izbiro modela na vrhu, vbrizga pot do aktivne strani dokumentacije kot kontekst ter izbriše zgodovino sporočil, ko se pogovorno okno zapre. Dopolnjuje širši [AI Assistant](./ai-assistant.md) in lažjo [Contextual Showcase](./contextual-showcase.md).

Oglejte si tudi [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) in [Vrste vozlišč](./node-types.md).

### [Organizacija Workflow-ov](./workflow-organization.md)

Administratorji instanc (`HEYM_ADMIN_EMAILS`) lahko dostopajo do vseh workflow-ov, najdejo workflow-e lastnika po e-pošti, pregledujejo urnike in zgodovino izvajanja, ustavijo in nadaljujejo samodejne triggere ter izbrišejo workflow-e, ko se izvajanja končajo. Oglejte si [Upravljanje instanc](../tabs/workflows-tab.md#instance-administration) za postopek odjave in razliko med ustavitvijo samodejnih triggerjev in blokiranjem vseh klicev.

Workflow-e je mogoče organizirati v mape in podmape v drevesni strukturi. Mape imajo imena in opcionalne nadrejene mape; workflow-e so dodeljeni mapam. Workflow-e je mogoče načrtovati za izbris (premik v smetnjak pred trajnim odstranjevanjem). API podpira ustvarjanje, posodabljanje, brisanje in premikanje workflow-ov med mapami, enak model organizacije pa se pojavi na zavihku [Workflows](../tabs/workflows-tab.md).

Oglejte si tudi [Hitri predal](./quick-drawer.md), [Prenos in uvoz](./download-import.md) ter [Zgodovina urejanja](./edit-history.md).

### [Hitri predal](./quick-drawer.md)

Hitri predal je fiksna desna stran hitrega izvajanja za notranje strani, ki niso platno. Omogoča iskanje [workflow-ov](../tabs/workflows-tab.md), pripenjanje priljubljenih, izbiro vhodov, takojšnje izvajanje ter pregled napredka ali rezultatov brez odpiranja urejevalnika. Workflow z vozliščem [File Upload Trigger](../nodes/file-upload-trigger-node.md) sprejme odloženo ali izbrano datoteko. Redosled pripenjanja in zadnji izbrani workflow se shranita v brskalniku.

Oglejte si tudi [Organizacijo Workflow-ov](./workflow-organization.md), [Kratice na tipkovnici](./keyboard-shortcuts.md) in [Zgodovino izvajanja](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase je kompakten vodnik znotraj aplikacije za overjene glavne površine, kot so zavihki nadzorne plošče, [Vrednotenja](../tabs/evals-tab.md), dokumenti in urejevalnik workflow-ov. Privzeto ostane zaprt, najprej ponudi kratek povzetek strani, nato pa na zahtevo ponudi malo dodatnih podrobnosti in poveže na celoten članek dokumentacije, ko potrebujete globlje usmeritve.

Doplnjuje [Pogovorite se z Heym](./chat-with-heym.md), [Hitri predal](./quick-drawer.md) in [AI Assistant](./ai-assistant.md) za tokove usmeritev znotraj aplikacije.

### [Poverilnice](./credentials.md)

Poverilnice shranjujejo API ključe in skrivnosti, ki jih uporabljajo vozlišča workflow-ov. Dodajte jih na zavihku [Poverilnice](../tabs/credentials-tab.md) in jih navajajte po imenu ali ID-ju v vozliščih, kot so [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Pošlji e-pošto](../nodes/send-email-node.md) in [Redis](../nodes/redis-node.md). Šifrirane so v mirovanju, lahko jih delite z uporabniki ali [skupinami](./teams.md) in jih lahko tudi navajate v [Expression DSL](./expression-dsl.md) preko `$credentials.Name`.

Oglejte si tudi [Poverilnice](../tabs/credentials-tab.md), [Deljenje poverilnic](./credentials-sharing.md) in [Integracije s tretjimi osebami](./integrations.md).

### [Deljenje poverilnic](./credentials-sharing.md)

Poverilnice je mogoče deliti z drugimi uporabniki po e-pošti ali s skupinami; vsi člani skupine pridobijo dostop, ko je poverilnica deljena s skupino. Deljene poverilnice se prikažejo z indikatorjem na zavihku [Poverilnice](../tabs/credentials-tab.md). Med izvajanjem se kontekst lastnika workflow-a združi z lastnimi, uporabniško deljenimi in skupinsko deljenimi poverilnicami. Uporabite `$credentials.CredentialName` v izrazih ali nastavite credentialId v podatkih vozlišča.

Oglejte si tudi [Poverilnice](./credentials.md), [Skupine](./teams.md) in [Integracije s tretjimi osebami](./integrations.md).

### [Skupine](./teams.md)

Skupine vam omogočajo, da delite workflow-e, poverilnice, globalne spremenljivke, vektorske shrambe in datoteke Drive z več uporabniki hkrati. Ustvarite skupine na zavihku [Skupine](../tabs/teams-tab.md) in dodajte člane po e-pošti. Delite vire s skupino iz ustreznih delilnih pogovorov; vsi člani nato pridobijo dostop. Ustvarjalec lahko ureja in briše skupino; brisanje skupine odstrani vse delitve skupine.

Doplnjuje [Deljenje poverilnic](./credentials-sharing.md), [Globalne spremenljivke](./global-variables.md) in [Podjetje](./enterprise.md).

### [Paralelno izvajanje](./parallel-execution.md)

Heym izvaja vozlišča paralelno, ko med seboj nimajo odvisnosti. Izvajalec gradi DAG in izvaja vozlišča na isti ravni hkrati s pomočjo naborov niti; takoj ko vozlišče konča, se načrtujejo njegova spodnja vozlišča. Uporabite vozlišče [Merge](../nodes/merge-node.md) za združitev paralelnih vej, ko je to potrebno. Več izvajanj workflow-ov se izvaja hkrati; vsako izvajanje je izolirano. Način [SSE Streaming](./sse-streaming.md) oddaja dogodke, ko vozlišča dokončajo.

Oglejte si tudi [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) in [Zgodovino izvajanja](./execution-history.md).
### [Arhitektura agenta](./agent-architecture.md)

[Agent Node](../nodes/agent-node.md) podpira podagente (orchestrator kliče druge agentne vozlišča preko call_sub_agent), pod-workflows (agent kliče druge workflows preko call_sub_workflow), veščine (vsebina navodil in Python orodja iz .zip ali .md) ter povezave s [MCP](../tabs/mcp-tab.md) odjemalci. Orodje za izvajanje orchestratorja usmerja klice podagentov in pod-workflows; druga orodja gredo v Python, MCP ali izvajalce veščin. Maksimalna globina gnezdenja za podagente in pod-workflows je 5. Zanka klicanja orodij vključuje samodejno stiskanje konteksta: pred vsako iteracijo se oceni uporaba tokenov in če preseže 80 % kontekstnega okna modela, se srednje sporočila povzamejo z uporabo istega modela, pri čemer ostanejo sistemski prompt, prvo uporabniško sporočilo in zadnje uporabniško sporočilo nedotaknjeni.

Oglejte si tudi [Agent Node](../nodes/agent-node.md), [Trajna pomnilnika agenta](./agent-persistent-memory.md), [Človek v zanki](./human-in-the-loop.md) in [MCP](../tabs/mcp-tab.md).

### [Trajna pomnilnika agenta](./agent-persistent-memory.md)

Neobvezna znanstvena grafika za vsak [Agent Node](../nodes/agent-node.md), shranjena v Postgres: entitete, tipi, lastnosti in usmerjene povezave. Ko je `persistentMemoryEnabled` nastavljen na true, se grafika povzame v sistemski prompt pri vsakem zagonu; po uspešnih zaključkih [LLM](../nodes/llm-node.md) v ozadju pridobi strukturirane posodobitve. REST CRUD se nahaja pod `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Urejevalnik se odpre iz rožnatega nadzora nad možgani na vozlišču.

Oglejte si tudi [Agent Node](../nodes/agent-node.md), [Arhitektura agenta](./agent-architecture.md) in [Izvajanja](../tabs/traces-tab.md).

### [Človek v zanki](./human-in-the-loop.md)

Človek v zanki omogoča [Agent Node](../nodes/agent-node.md), da zahteva odobritev na določenih kontrolnih točkah, ustvari javno stran `/review/{token}` in čaka, da neprijavljen recenzent sprejme, ureja ali zavrne besedilo pregleda v Markdownu. Agenti, omogočeni za HITL, prav tako izpostavljajo izhodno obravnavo `review`, tako da lahko obvestite [Slack](../nodes/slack-node.md), [Pošlji e-pošto](../nodes/send-email-node.md) ali druge kanale, medtem ko je izvajanje v teku. Besedilo HITL na ravni vozlišča se uporablja kot smernice za odobritev, medtem ko se povzetek javne strani generira iz same zahteve za pregled. Čakajoča izvajanja se takoj prikažejo v [Zgodovini izvajanja](./execution-history.md), lahko se zgodijo večkrat v istem izvajanju in se nadaljujejo iz natančnega shranjenega posnetka delovnega toka, ko je vsaka odločitev oddana.

Oglejte si tudi [Agent Node](../nodes/agent-node.md), [Portal](./portal.md), [Zgodovina izvajanja](./execution-history.md) in [Pošlji e-pošto](../nodes/send-email-node.md).

### [Webhooki](./webhooks.md)

Workflows se lahko sprožijo preko [HTTP](../nodes/http-node.md) na `POST /api/workflows/{workflow_id}/execute`, ali se postopoma prenašajo iz `POST /api/workflows/{workflow_id}/execute/stream`. Telo zahteve se prenese kot telo v [Input](../nodes/input-node.md) vozlišča; glave in poizvedbeni parametri so na voljo v izrazih [Expression DSL](./expression-dsl.md). Konfigurirajte avtentikacijo za vsak workflow: anonimno, JWT ali po meri. Neobvezno predpomnjenje odgovorov, omejevanje hitrosti in pogovorno okno Uredi z cURL so na voljo na delovnem toku in veljajo za oba načina. Z [omejitvijo sočasnosti](./webhooks.md#concurrency-limit-and-queued-runs) klic, ki mora počakati, namesto tega prejme `202 Accepted` z ID-jem izvedbe in URL-jem stanja.

Oglejte si tudi [Input](../nodes/input-node.md), [Izvršni tokeni](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) in [Struktura delovnega toka](./workflow-structure.md).

### [Izvršni tokeni](./execution-tokens.md)

Izvršni tokeni so obsežni JWT-ji, ki omogočajo dostop do izvajanja in tokovnih končnih točk enega delovnega toka. Ko delovni tok uporablja JWT avtentikacijo, tokeni omogočajo zunanjim skriptam, CI cevovodom in integracijam klic delovnega toka brez deljenja uporabniške seje. Vsak token nosi zahtevo `wid`, ki ga veže na en delovni tok, `jti`, ki se uporablja za takojšnje preklicanje, in nastavljivo TTL (60 sekund do 10 let). Ustvarite, izberite in prekličite tokene neposredno iz pogovornega okna **Uredi z cURL** — izbrani token je samodejno vključen v generirano ukaz.

Oglejte si tudi [Webhooki](./webhooks.md), [Varnost](./security.md) in [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

Pogovorno okno cURL lahko preklopi izvajanje [webhook](./webhooks.md) v način Server-Sent Events. To proizvaja dogodke `execution_started`, `node_start`, `node_complete` in `execution_complete` v realnem času, doda `--no-buffer` v generirani cURL ukaz in omogoča konfiguracijo sporočil ob zagonu za vsako vozlišče, kot so `[START] LLM` ali po meri besedilo za zunanje terminalske porabnike.

Oglejte si tudi [Webhooki](./webhooks.md), [Zgodovina izvajanja](./execution-history.md) in [LLM](../nodes/llm-node.md).
### [Triggerji](./triggers.md)

Workflows se začnejo z vozlišči za sprožitev ([Vhod](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) prejem) ali vstopnimi točkami: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron urnik, Telegram webhook, Discord interakcijski webhook, IMAP upravljalnik sprožitev, RabbitMQ porabnik ali izvajanje v urejevalniku. Vsak sprožilec ima svoj endpoint ali ozadje; [Cron](../nodes/cron-node.md) se izvaja vsakih 60 sekund, vozlišča [Telegram Trigger](../nodes/telegram-trigger-node.md) prejemajo webhooke bota, vozlišča [Discord Trigger](../nodes/discord-trigger-node.md) prejemajo podpisane interakcijske webhooke, in vozlišča [IMAP Trigger](../nodes/imap-trigger-node.md) delujejo na svojem konfiguriranem intervalu preverjanja. Vozlišča [Vhod](../nodes/input-node.md) prejemajo telo, glave in poizvedbe iz zahtevkov webhook.

Oglejte si tudi [Vrste vozlišč](./node-types.md), [Webhooke](./webhooks.md) in [Paralelno izvajanje](./parallel-execution.md).

### [Zgodovina izvajanja](./execution-history.md)

Zgodovina izvajanja beleži izvajanja workflow: vhodne podatke, izhodne podatke, rezultate vozlišč, stanje in vir sprožitve. Dostopate lahko do nje iz orodne vrstice urejevalnika, pogleda dokumentov, glave nadzorne plošče ali pogleda [Vrednotenja](../tabs/evals-tab.md). Zgodovina za posamezen workflow prikazuje izvajanja za odprti workflow; pogled celotne zgodovine prikazuje izvajanja čez workflows in klepet. Trenutno izvajanja se prikažejo na vrhu obeh pogovornih okensk s funkcijama **Odpri v živo** in **Prekliči**. Odpri v živo poveže urejevalnik z obstoječim izvajanjem preko [SSE](./sse-streaming.md), obnovi zaključena vozlišča, pulzira trenutna in čakajoča vozlišča ter doda Debug dnevnike brez začetka novega izvajanja. Prinesi na Platno naloži vhodne podatke in izhode vozlišč zaključene izvedbe za ponovno izvajanje ali odpravljanje napak; globoka povezava `/workflows/{workflowId}/{executionId}` podpira tako živa kot zaključena izvajanja. Izvajanja, ki so bila ustavljena zaradi [Human-in-the-Loop](./human-in-the-loop.md), se takoj shranijo kot `pending`, vključno z javnim URL-jem za pregled in vsemi obvestilnimi vozlišči, ki so bila izvedena iz agentovega `review` veje. Če se strežnik znova zažene med izvajanjem, se prekinjena izvajanja samodejno obnovijo: ponovno se izvedejo od začetka s istimi vhodnimi podatki in se prikažejo kot zaključena (označena **Obnovljena**), kar nadzira preklopnik **Samodejno obnavljanje izvajanj** za posamezen workflow, ki jih lahko namesto tega zabeleži kot `skipped`.

Oglejte si tudi [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) in [Sledi](../tabs/traces-tab.md).

### Poudarki izvajanja

Po izvajanju v živo — ali po **Prinesi na Platno** — se v zgornjem desnem kotu Platna prikaže odklopljiv pojavna okna **Poudarki izvajanja**, ki navaja, kaj je vsako vozlišče proizvedlo v vrstnem redu izvajanja. To je hiter način za pregled izhoda po vozliščih brez odpiranja vsakega vozlišča; zaprite ga z **✕**, in se ponovno odpre pri naslednjem izvajanju. Poudarki so prav tako prikazani pri izvajanju na nadzorni plošči. Oglejte si [Zgodovina izvajanja](./execution-history.md) za podrobnosti.

### [Zgodovina urejanja](./edit-history.md)

Zgodovina urejanja sledi shranjenim različicam workflow (vsako shranjevanje ustvari različico). Oglejte si seznam, odprite različico, da vidite razliko v primerjavi s trenutnim workflow ([vozlišča](./workflow-structure.md), robovi, konfiguracija), in Ponovno vrni, da obnovite prejšnjo različico. Za razliko od [Zgodovine izvajanja](./execution-history.md) Zgodovina urejanja sledi spremembam strukture, ne izvajanjem.

Oglejte si tudi [Zgodovina izvajanja](./execution-history.md), [Struktura workflow](./workflow-structure.md) in [Funkcije Platna](./canvas-features.md).

### Napaka v workflow

Workflow lahko določi drug workflow, ki se izvede, ko pride do napake. To konfigurirate v panelu **Lastnosti** na ravni workflow (prikazanem, ko ni izbrano nobeno vozlišče) pod **Ob napaki, zaženi workflow**. Le lastnik workflow lahko nastavi, spremeni ali izbriše to nastavitev; glejte [Nastavitve samo za lastnika](./workflow-organization.md#owner-only-settings). Ko se izvajanje na najvišji ravni konča z neobravnavano napako, se izvede izbrani workflow za napake in prejme kontekst napake (id in ime neuspelega workflow, id izvajanja, sporočilo o napaki, oznaka in tip neuspelega vozlišča ter časovni žig). Če platno že vsebuje vozlišče [Obravnava napak](../nodes/error-handler-node.md), lokalni obravnavalec prevlada in workflow za napake **ni** poklican. Sam workflow za napake se izvede neposredno, zato nikoli ne sproži svojega workflow za napake.

Pokrije vsako ne-testno izvajanje na najvišji ravni: tako izvajanje endpointov, [Portal](./portal.md) in vsak sprožilec, vključno z [cron](../nodes/cron-node.md), sprožilci platforme za klepet, e-pošto, vrste, [MCP](../tabs/mcp-tab.md) in pripomočke nadzorne plošče. Z omogočeno [Porazdelitev obremenitve](./cluster.md) to ostaja nespremenjeno, vključno z izvajanji, ki jih je izvedel delavec: neuspešno vozlišče se vrne z rezultatom, workflow za napake pa se nato porazdeli kot katero koli drugo izvajanje, tako da vozlišče znotraj njega, ki mora delovati na glavni instanci, še vedno deluje. Dva primera sta namerno izključena, ker izid workflow še ni znan: izvajanje, ki ga nobena instanca nikoli ni izvedla, in čakanje, ki je poteklo, medtem ko se izvajanje morda še vedno izvaja. Prav tako **ni** sproženo z ročnimi testnimi izvajanji na platnu.
### Timeout delovanja

Vsak workflow lahko nastavi **timeout delovanja** v sekundah v razdelku **Lastnosti** na ravni workflow. `0` (privzeto) ga onemogoči. Ko je nastavljen, se izvajanje, ki preseže omejitev, ustavi ob naslednji meji vozlišča in se zabeleži kot neuspešno izvajanje z napako "timeout". Timeout se uporablja za ročna, API in sprožena izvajanja. Dolgi [Wait](../nodes/wait-node.md) vozlišča se takoj prekinjajo, namesto da bi blokirala celotno trajanje.

### Omejitev sočasnosti

Vsak workflow lahko omeji število produkcijskih izvajanj, ki tečejo hkrati, z **Omejitvijo sočasnosti** na plošči **Properties** na ravni workflowa; lastnik in sodelavci z dostopom za urejanje jo lahko spremenijo, privzeto pa je izklopljena. Ko je omejitev dosežena, nova izvajanja iz endpointov [webhook](./webhooks.md#concurrency-limit-and-queued-runs) in [pretočnega predvajanja](./sse-streaming.md), iz [Portala](./portal.md), iz [Quick Drawer](./quick-drawer.md), iz [MCP](../tabs/mcp-tab.md) in vsakega [triggerja](./triggers.md) čakajo v čakalni vrsti FIFO (prvi noter, prvi ven), ki se šteje v vseh instancah [klastra](./cluster.md). Preizkusna izvajanja urejevalnika, klici podrejenih workflowov, [Evals](../tabs/evals-tab.md) in nadaljevanja pregledov se nikoli ne uvrstijo v čakalno vrsto, izvajanja kartic [Board](../tabs/board-tab.md), nalaganja datotek, izvajanja, ki jih zažene orodje run-workflow pomočnika AI, in workflowi za obveščanje o opozorilih pa se zaženejo brez čakanja na režo. Klic webhooka, ki mora počakati, takoj prejme `202 Accepted` z `execution_id`, URL-jem stanja, ki odgovarja z istimi poverilnicami, svojim položajem, velikostjo čakalne vrste in številom izvajanj; odjemalec MCP prejme enako in poizveduje po orodju `heym_execution_status`. Izbirna **Največja velikost čakalne vrste** zavrne dodatne klice z `429`, izbirno **Najdaljše čakanje** pa zabeleži izvajanje, ki je čakalo predolgo, kot `expired`. Čakajoča izvajanja se prikažejo v [Zgodovini izvajanja](./execution-history.md) kot **V vrsti n/m** in jih je tam mogoče preklicati.

### Prihranjen čas

Vsak workflow lahko zabeleži **ocenjen prihranjen čas na izvajanje** (v minutah), nastavljen v razdelku **Lastnosti** na ravni workflow. Zavihek [Analytics](../tabs/analytics-tab.md) to agregira v izbranem razponu kot skupno statistiko **Prihranjen čas** (vsota ocene vsakega workflow × njegovi uspešni zagon). Najbolj uporabljeni prav tako navaja to vsoto na ravni workflow; **Ni nastavljeno** odpre polje za oceno, ko ni nastavljeno. Poročilo [Analiza workflow](./workflow-analysis.md) priporoča nastavitev ocene, ko ta ni konfigurirana.

### [Nastavitve](./user-settings.md)

Pogovor o nastavitvah (odprt iz vašega avatarja v glavi) ima štiri zavihke: Profil (slika Gravatar, prikazno ime, uporabniška pravila), [Varnost](./security.md) (sprememba gesla), Glas ([ElevenLabs TTS/STT](./chat-voice.md)) in Opazovanje (samo za branje [OpenTelemetry](./opentelemetry.md) status). Uporabniška pravila so prilagojena navodila, ki se vstavijo v vsako zahtevo AI, vključno z graditeljem workflow in [Chat](../tabs/chat-tab.md), tako da lahko enkrat nastavite jezik, ton, slog kodiranja ali konvencije workflow. Politika gesel in upravljanje [MCP](../tabs/mcp-tab.md) API ključev sta prav tako na voljo.

Oglejte si tudi [Varnost](./security.md), [Glas za klepet](./chat-voice.md), [OpenTelemetry sledenje](./opentelemetry.md) in [AI asistent](./ai-assistant.md).

### [OpenTelemetry sledenje](./opentelemetry.md)

Heym lahko oddaja OpenTelemetry sledi za vsako izvajanje workflow in izvajanje vozlišča: korenski `heym.workflow.execute` razpon na vsako izvajanje in otroški `heym.node.execute` razpon na vsako vozlišče, z uporabo modela in tokena, priloženima vozliščem LLM in agentom. Razponi se izvažajo preko OTLP/HTTP v katerikoli združljiv backend (Jaeger, Grafana Tempo, Honeycomb, Datadog), in W3C kontekst sledenja se prenaša preko vhodnih webhookov, izhodnega HTTP in pod-workflow. Sledenje je privzeto onemogočeno in se konfigurira z `HEYM_OTEL_*` [okoljskimi spremenljivkami](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); aktivni status je prikazan v zavihku Opazovanje v [Nastavitvah](./user-settings.md).

Oglejte si tudi [Zgodovina izvajanja](./execution-history.md), [Sledi](../tabs/traces-tab.md) in [Webhooki](./webhooks.md).

### [Prenos in uvoz](./download-import.md)

Izvozite trenutni workflow kot JSON iz orodne vrstice urejevalnika (gumb Prenos); datoteka vključuje vozlišča in robove. Uvozite tako, da povlečete JSON datoteko na zavihek [Workflows](../tabs/workflows-tab.md) (ustvari nov workflow) ali na platno (zamenja ali združi). JSON mora vključevati tabelo vozlišč; ime in robovi so neobvezni. Uporabite ga za varnostno kopiranje, deljenje ali migracijo med primerki.

Oglejte si tudi [Struktura workflow](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) in [Značilnosti platna](./canvas-features.md).

### [Portal](./portal.md)

Portal izpostavlja workflow kot javne klepetalne uporabniške vmesnike na `/chat/{slug}`. Konfigurirajte portal_enabled, slug, neobvezno avtentikacijo (uporabniki portala), pretakanje in nalaganje datotek za vsak workflow. Končni uporabniki komunicirajo preko klepetalnega vmesnika brez prijave v Heym; izhodne slike se lahko prikažejo v klepetu. Workflow portala lahko prav tako preusmeri na strani za pregled [Human-in-the-Loop](./human-in-the-loop.md), ko [Agent Node](../nodes/agent-node.md) zahteva odobritev, medtem ko agentova veja `review` pošilja obvestila v druge kanale. Uporabite ga za notranja orodja, klepetalne robote za stranke in obrazce, podprte z AI.

Oglejte si tudi [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) in [Drive](./drive.md).

### [Generiranje datotek](./file-generation.md)

Sposobnosti lahko med izvajanjem generirajo datoteke, kot so PDF, DOCX, CSV, JSON in slike, tako da pišejo v delovno okolje `_OUTPUT_DIR`. Heym te datoteke samodejno zajame, shrani in izpostavi metapodatke o prenosu pod `_generated_files`, ki jih je mogoče upravljati z [Drive vozliščem](../nodes/drive-node.md) ali pregledovati v zavihku [Drive](../tabs/drive-tab.md).

Oglejte si tudi [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) in [Drive vozlišče](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive je skupna shramba in plast za deljenje datotek, ki jih generirajo sposobnosti. Omogoča vam brskanje po datotekah, ustvarjanje javnih ali z geslom zaščitenih povezav, uporaba omejitev poteka in prenosa, deljenje datotek samo za branje s svojimi ekipami ter upravljanje teh datotek programatično z [Drive vozliščem](../nodes/drive-node.md) ali ročno iz zavihka [Drive](../tabs/drive-tab.md).

Oglejte si tudi [Drive](../tabs/drive-tab.md), [Generiranje datotek](./file-generation.md) in [Portal](./portal.md).
### [Varnost](./security.md)

Heym izvaja politiko gesel (dolžina, velika črka, mala črka, številka), shranjuje dostopne tokene v HttpOnly piškotkih in ob uporabi obrača osvežitvene tokene. Omejevanje hitrosti se uporablja pri prijavi, registraciji in [Portal](./portal.md) prijavi. [Poverilnice](./credentials.md) so šifrirane v mirovanju z AES-256 (Fernet). Ključ API za [MCP](../tabs/mcp-tab.md) se uporablja za avtentikacijo strank; varnost vsebine je na voljo preko [Guardrails](./guardrails.md) na [LLM](../nodes/llm-node.md) in [Agent Node](../nodes/agent-node.md) vozliščih. [Execution Tokens](./execution-tokens.md) zagotavljajo JWT-je, specifične za vsak workflow, za zunanje klice.

Oglejte si tudi [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) in [Poverilnice](./credentials.md).

### [Enotna prijava](./sso.md)

Heym avtenticira uporabnike proti kateremu koli zunanjemu ponudniku OpenID Connect - Keycloak, Okta, Entra ID, Auth0, Google - ki je konfiguriran med izvajanjem v **Nastavitve → SSO** s strani skrbnika instance, navedenega v `HEYM_ADMIN_EMAILS`. Vneseta se le URL izdajatelja in poverilnice stranke; vsak endpoint prihaja iz dokumenta za odkrivanje ponudnika, zato noben ponudnik ni trdo kodiran. Prijava uporablja Avtorizacijsko kodo s PKCE, ID žeton pa se preveri proti objavljenim ključem ponudnika. Računi se povezujejo po `(issuer, subject)` najprej in preverjenem e-poštnem naslovu drugič, z možnostjo samodejnega zagotavljanja, omejenega na belo listo domen e-pošte. Prijava z geslom ostaja na voljo poleg SSO in jo je mogoče izklopiti, ko test povezave uspe, pri čemer so računi `HEYM_ADMIN_EMAILS` izvzeti, da napačno konfiguriran ponudnik ne more zakleniti instance.

Oglejte si tudi [Nastavitve](./user-settings.md), [Varnost](./security.md) in [Revizijske dnevnike](./audit.md).

### [Porazdelitev obremenitve](./cluster.md)

Usmerite drugo instanco Heym na isto bazo podatkov in se pridruži kot delavec. Ozadnji procesi - cron, webhooki, klici orodij MCP, sprožilci klepeta - se delijo med instancami v odstotku, ki ga nastavi skrbnik instance pod **Nastavitve → Instance**, pri čemer so status, latenca baze podatkov in različica vsake instance prikazani v eni tabeli. Instance nikoli ne komunicirajo med seboj: Postgres prenaša delo, zato delavec ne potrebuje odprtega porta in poti nazaj do glavne instance. Delo, ki se dotika lokalnih datotek, delovnega prostora kodirnega agenta ali nameščenega vtičnika, vedno teče na glavni instanci, panel pa poroča, koliko od zadnjih 24 ur je bilo takšnega, da lahko operater vidi, kdaj odstotki ne morejo pomagati. Vsako izvajanje v zgodovini imenuje instanco, ki ga je izvedla, in oba pogovorna okna zgodovine lahko filtrirata po tem.

Oglejte si tudi [Nastavitve](./user-settings.md), [Izvajanja](../tabs/traces-tab.md) in [Analitiko](../tabs/analytics-tab.md).

### [Integracije tretjih oseb](./integrations.md)

Heym se povezuje z zunanjimi storitvami preko poverilnic, shranjenih v zavihku [Poverilnice](../tabs/credentials-tab.md) (šifrirane v mirovanju). Podprte vrste vključujejo OpenAI, Google, Odločitveni model za [Odločitveno vozlišče](../nodes/decision-node.md), Model Router za samodejno izbiro modela (glejte spodaj), GitHub za [GitHub vozlišče](../nodes/github-node.md) in integracije MCP, Jira za [Jira vozlišče](../nodes/jira-node.md), Notion za [Notion vozlišče](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP za [Pošlji e-pošto](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header in FlareSolverr za [Crawler](../nodes/crawler-node.md). Vsaka vrsta dokumentira zahtevana polja; poverilnice je mogoče deliti z uporabniki ali [skupinami](./teams.md) in jih omenjati po imenu v vozliščih ali kot `$credentials.Name` v izrazih.

### Model Router (Samodejni model)

Poverilnica **Model Router** izbere model na podlagi zahteve namesto da bi imela ključ. Shranjuje poverilnico odločitvenega modela ter seznam vaših obstoječih OpenAI/Google/Custom poverilnic, vsaka z merili, ki določajo, kdaj naj se uporabi, in se pojavi v vsakem izbirniku modelov z enim samim modelom, imenovanim **Samodejno**.

Izvajanja, dnevnik izvajanja na platnu in pogled razpona prikazujejo obe polovici izbire, na primer `Samodejni model / GPT-5`, medtem ko stroški ostajajo pripisani modelu, ki je bil izveden. Samodejni model ni mogoče kombinirati z API-jem za odgovore, načinom serijskega izvajanja ali izhodom slik. Oglejte si [Poverilnice](./credentials.md) za celotno obnašanje.

Oglejte si tudi [Poverilnice](./credentials.md), [Deljenje poverilnic](./credentials-sharing.md) in [Skupine](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blokirajo nevarna ali nezaželena sporočila uporabnikov, preden dosežejo [LLM](../nodes/llm-node.md) ali [Agent Node](../nodes/agent-node.md). Omogočite jih za vsako vozlišče in izberite kategorije za blokiranje (npr. nasilje, sovražni govor, spolna vsebina, samopoškodovanje, nadlegovanje, nezakonite dejavnosti). Nastavite občutljivost (nizka, srednja, visoka). Ko se sprožijo, vozlišče vrže napako, ki jo lahko ujamete z [Obvladovalcem napak](../nodes/error-handler-node.md). Odkritje uporablja API za moderiranje ponudnika ali klasifikacijo LLM, odvisno od vrste poverilnice.

Oglejte si tudi [Varnost](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) in [Obvladovalec napak](../nodes/error-handler-node.md).
### [Podjetje](./enterprise.md)

Podjetje pokriva komercialno licenciranje, profesionalno podporo in storitve uvajanja za ekipe, ki uporabljajo Heym v produkciji. Vključuje pomoč pri arhitekturi workflow, uvajanje, usmeritve za Kubernetes in skaliranje, prednostno podporo ter prilagojeni razvoj naprednih funkcij, kot so [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) in [Portal](./portal.md).

Oglejte si tudi [Zagon in uvajanje](../getting-started/running-and-deployment.md), [Varnost](./security.md) in [Ekipe](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work je drugi vmesnik za poslovne ekipe, zgrajen nad platformo Heym. Uporabniki opišejo opravilo, odgovorijo na nekaj vprašanj in dobijo preizkušen workflow, nato pa delajo prek strani, odobritev in seznama dejavnosti, kjer ima vsak zagon svoje ime. Skrbniki instance ga povežejo v **Nastavitve → Heym Work** z njegovim naslovom in integracijskim ključem; ima lastno licenco ekipe Heym.

Oglejte si tudi [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) in [Human-in-the-Loop](./human-in-the-loop.md).

---

## Zavihek nadzorne plošče

### [Workflows](../tabs/workflows-tab.md)

Zavihek Workflows je privzeti pogled nadzorne plošče. Prikazuje seznam v dveh delih: workflows in mape kot gosto razporejene vrstice na levi strani ter predogled izbranega workflow na desni strani z njegovim triggerjem, zadnjim izvajanjem in koraki, poleg tega pa tudi Open Workflow in Run Now. Vsaka vrstica nosi oznako stanja (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), po kateri lahko filtrirate v spustnem meniju Status. Workflow brez trigger vozlišča je označen glede na to, kako se je njegovo zadnje izvajanje začelo - API za HTTP klic, SubWorker za nadrejeni workflow, Portal za javni klepet - in ostane Manual, dokler ne teče. Mape in podmape obravnavajo [organizacijo](./workflow-organization.md). Ustvarite workflows z New Workflow, povlecite in spustite JSON za [uvoz](./download-import.md) ter urejajte ali brišite iz dejanj vrstice. Workflows je mogoče premikati med mapami; brisanje je načrtovano (smetnjak) pred trajnim odstranjevanjem.

Oglejte si tudi [Organizacija workflow](./workflow-organization.md), [Prenos in uvoz](./download-import.md) ter [Hitri predal](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Oglejte si demo Workflows</a></p>

### [Board](../tabs/board-tab.md)

Agentni kanban plošča, kjer so kartice trajni nalogi. Konfigurirajte vsako stolpec z urejenim verižnim workflow; premikanje kartice v stolpec zažene verigo z vsemi konteksti kartice (vsebina, komentarji, zgodovina, prejšnji izhodi). Rezultati se zapišejo nazaj na kartico — zeleni ob uspehu, rdeči ob neuspehu, jantarni med izvajanjem. Nadaljnji krogi ponovno zaženejo verigo trenutnega stolpca z vsemi doslej zbranimi podatki, kar omogoča iterativno načrtovanje. Izvajanja so zabeležena v [Zgodovini izvajanja](./execution-history.md) z izvorom triggerja `board`. Medtem ko je izvajanje kartice aktivno, **Open live** odpre točno to izvajanje na animiranem platnu z inkrementalnimi dnevniškimi zapisi za odpravljanje napak.

Oglejte si tudi [Workflows](../tabs/workflows-tab.md), [Zgodovina izvajanja](./execution-history.md) in [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Oglejte si demo Board</a></p>
-->

### [Predloge](../tabs/templates-tab.md)

Zavihek Predloge vam omogoča shranjevanje in ponovno uporabo predlog workflow (celotni workflows) in predlog vozlišč (posamezno konfigurirana vozlišča). Ustvarite predloge workflow iz urejevalnika (Deli kot predlogo) in predloge vozlišč tako, da z desno miškino tipko kliknete na vozlišče. Brskajte po vidnosti (Vsi ali Določeni uporabniki/[ekipe](./teams.md)), uporabite predlogo za ustvarjanje novega workflow ali dodajte vozlišče na platno ter upravljajte s svojimi skupnimi predlogami.

Oglejte si tudi [Workflows](../tabs/workflows-tab.md), [Ekipe](./teams.md) in [Funkcije platna](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Oglejte si demo Predloge</a></p>

### [Spremenljivke](../tabs/global-variables-tab.md)

Zavihek Spremenljivke upravlja [Global Variable Store](./global-variables.md). Ustvarite, uredite in izbrišite globalne spremenljivke; nastavite ime, vrednost in tip vrednosti (Auto, String, Number, Boolean, Array, Object). Spremenljivke so uporabniško obsežne in trajajo skozi izvajanja. Sklicujte se nanje v katerem koli workflow [izrazu](./expression-dsl.md) kot `$global.variableName`. Spremenljivke je mogoče deliti z drugimi uporabniki ali [ekipami](./teams.md).

Oglejte si tudi [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) in [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Oglejte si demo Spremenljivke</a></p>
### [Chat](../tabs/chat-tab.md)

Zavihek Chat je dolgotrajna površina agenta Heym za upravljanje delovnim prostorom preko pogovora. Izberite [poverenje](./credentials.md) in model, nato pa vprašajte Chat, naj odgovori na vprašanja, pregleda definicije workflow-ov, izvede obstoječe workflow-e, povzame izvajanja in urnike, poroča o zgodovini izvajanja enega samega workflow-a (število izvajanj, razčlenitev stanja, zadnje izvajanje in podrobnosti enega izvajanja na zahtevo), poroča, kateri izvajanja trenutno potekajo (s pretečenim časom, trenutnim vozliščem in povezavo do vsakega aktivnega izvajanja), reši čakajoče človeške preglede, ustvari in spremeni workflow-e z enakim AI Builder motorjem, ki se uporablja v urejevalniku, ali doda kartice na kanban plošče z naravnim jezikom. Nove kartice vedno začnejo v prvem stolpcu izbrane plošče; ko je na voljo več plošč in nobena ni poimenovana, Chat predstavi izbiro plošče pred ustvarjanjem kartice.

Chat nadaljuje z delovanjem v ozadju, tudi ko se brskalnik zapre. Medtem ko se odgovor pretaka, lahko pošljete več sporočil; Heym jih shrani v vrsto, podprto z bazo podatkov, omogoča vam, da uredite ali izbrišete sporočila v vrsti pred njihovim začetkom, in jih izvede v vrstnem redu, ko se trenutni odgovor konča. Če asistent potrebuje podrobnosti o načrtovanju in vrne pojasnjevalna vprašanja, se vrsta ustavi, dokler ne odgovorite na ta vprašanja, nato pa se nadaljuje po odgovoru o načrtovanju.

Odgovori se pretakajo z markdownom, slikami v besedilu, predogledi workflow-ov, zložljivimi karticami za klice orodij, uporabo konteksta in samodejnim stiskanjem konteksta. Chat podpira priponke, glasovni vnos, predvajanje na glas, akcije kopiranja, hitre pozive, uporabniška pravila iz [Nastavitev](./user-settings.md) in [globalne spremenljivke](./global-variables.md) kot kontekst.

Oglejte si tudi [AI Assistant](./ai-assistant.md), [Poverilnice](./credentials.md) in [Nastavitve](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Oglejte si demo Chat</a></p>

### [Poverilnice](../tabs/credentials-tab.md)

Zavihek Poverilnice upravlja API ključe in skrivnosti, ki jih uporabljajo vozlišča. Dodajte poverilnice po vrsti (OpenAI, Google, Po meri, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere itd.), jih poimenujte in jih navajajte v vozliščih workflow-a. Uredite ali izbrišite iz kartice; delite z uporabniki po elektronski pošti ali z [skupinami](./teams.md). Vse vrednosti so šifrirane v mirovanju in zakrite v uporabniškem vmesniku.

Oglejte si tudi [Poverilnice](./credentials.md), [Deljenje poverilnic](./credentials-sharing.md) in [Integracije tretjih oseb](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Oglejte si demo Poverilnic</a></p>

### [Vektorske shrambe](../tabs/vectorstores-tab.md)

Zavihek Vektorske shrambe upravlja vektorske shrambe, ki jih uporabljajo [RAG](../nodes/rag-node.md) vozlišča. Ustvarite shrambo z imenom in vektorsko shrambo [poverenja](./credentials.md) — *RAG: Qdrant + OpenAI* (zunanji Qdrant) ali *RAG: Psql + OpenAI* (Heym-ov lastni Postgres preko pgvector), kar določa ozadje shrambe — po želji nastavite ime zbirke, nato pa naložite dokumente (PDF, TXT itd.). Upravljajte vsebino (ogled, izbris virov), uredite podrobnosti shrambe in delite shrambe z uporabniki. V [RAG](../nodes/rag-node.md) vozlišču izberite bazo podatkov, izberite vektorsko shrambo in izvedite operacije vstavljanja, posodabljanja, brisanja ali iskanja.

Oglejte si tudi [Qdrant RAG](../nodes/rag-node.md), [Poverilnice](./credentials.md) in [Skupine](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Oglejte si demo Vektorskih shranb</a></p>
### [MCP](../tabs/mcp-tab.md)

Zavihek MCP konfigurira integracijo Model Context Protocol. Heym podpira dva načina:

**Privzeti strežnik** – En sam endpoint na `/api/mcp/sse` izpostavi vse workflows, ki podpirajo MCP. Ogledate si lahko in regenerirate svoj API ključ, kopirate JSON za stranke, se povežete s Cursorjem z enim klikom ali sledite postopku nastavitve Claude z avtomatsko registracijo OAuth.

**Poimenovani strežniki** – Ustvarite lahko več izoliranih MCP endpointov, vsak z lastnim URL-jem, temelječim na UUID (`/api/mcp/servers/{uuid}/sse`), in neodvisnim API ključem. Določite specifične workflows za vsak strežnik, tako da različni AI odjemalci ali ekipe vidijo le orodja, ki jih potrebujejo. Vsak poimenovani strežnik podpira iste metode avtentikacije (API ključ, Claude OAuth) in ima svoje bližnjice za Copy JSON in Add to Cursor. Oba endpointa podpirata SSE transport (GET) in Streamable HTTP transport (POST). Preklapljanje workflowa znotraj poimenovanega strežnika ga premakne na vrh dodeljenega seznama, tako da ostane spremenjena vrstica vidna.

**Orodje za klepet Heym** – Oba načina lahko izpostavita tudi [Chat](../tabs/chat-tab.md) motor kot enotno orodje `heym_chat`, ki ga lahko preklapljate po površinah z lastnimi poverilnicami LLM in modelom (predizpolnjenim iz vašega preferiranega modela v [Nastavitvah](./user-settings.md)). MCP odjemalec pošlje eno naravno jezikovno `message`, motor pa opravi ostalo: gradi workflows v načinu gradnje (shranjevanje, do pet preizkusnih zagonov, popravilo in preverjanje), izvaja workflows, analitiko, izvajanja, stanje v živo, urnike, table in kartice, ekipe, globalne spremenljivke, iskanje po dokumentaciji ter odločitve s človekom v procesu. Zmožnosti, dodane Chat kasneje, so dostopne preko istega orodja brez dodatne registracije. Vsak klic se shrani v zgodovino zavihek Chat kot pogovor s plug-označbo in vrne `conversation_id`, ki ga lahko odjemalec vrne nazaj za nadaljevanje niti.

Oglejte si tudi [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) in [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Oglejte si MCP predstavitev</a></p>

### [Izvajanja](../tabs/traces-tab.md)

Zavihek Izvajanja prikazuje sledi izvajanja [LLM](../nodes/llm-node.md). Glava s statistiko nad seznamom povzema izbrano časovno obdobje s KPI karticami (Klici, Tokeni, Stroški, Povprečna latenca, Napaka %) in tremi grafikoni — Tokeni po modelu, Stroški po modelu in Klici skozi čas (uspehi proti napakam). En sam **Izbira časovnega obdobja** (1h / 24h / 7d / 30d / Vse; privzeto 7 dni) filtrira tako grafikone kot seznam skupaj. Stroški se izračunajo iz [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) na uporabnika; modeli brez cen se prikažejo kot opozorilo, ki se povezuje nanj. Odprite katero koli sledi, da si ogledate zahteve in odgovore payloadov, razčlenitev časa (llm_ms, tools_ms, mcp_list_ms), klice orodij (ime, argumenti, rezultat) in vključene veščine. Razširjeni dogodki prikazujejo JSON — vključno z MCP in JSON-RPC payloadi — kot zložen drevo, pri čemer je prvi nivo privzeto odprt; **Drevo / Surovo** se vrne na izvirno besedilo, medtem ko ostane slabo oblikovan JSON berljiv. Uporabite sledi za odpravljanje napak v [Agent Node](../nodes/agent-node.md) in [LLM](../nodes/llm-node.md) obnašanju ter za kopiranje ali izvoz payloadov.

Oglejte si tudi [Zgodovina izvajanja](./execution-history.md), [Agent Node](../nodes/agent-node.md) in [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Oglejte si predstavitev Izvajanj</a></p>
### [Opozorila](../tabs/alerts-tab.md)

Zavihek Opozorila določa mejne pogoje v časovnem oknu in vas obvešča, ko so ti prekoračeni. Štiri vrste opozoril pokrivajo vprašanja, ki jih operaterji dejansko postavljajo: **mejna vrednost napak** (ali je prišlo do neuspeha več kot N-krat v oknu), **trajanje workflow-a** (ali so se izvajanja upočasnila, merjeno kot maksimum, povprečje ali p95), **strošek tokenov / USD** (ali so stroški presegli proračun, kar se rešuje preko iste cenovne tabele kot [Izvajanja](../tabs/traces-tab.md)), in **število izvajanj** (ali se je to izvajanje zgodilo veliko pogosteje, kot bi se moralo). Vsaka vrsta se ocenjuje v oknu, ki ga izberete, nikoli na podlagi enega samega dogodka, saj je en neuspešen zagon šum, medtem ko je izbruh incident. Opozorila spremljajo en workflow ali vse workflow-e, do katerih imate dostop.

Petstopenjski čarovnik vas vodi skozi vrsto, obseg, pogoj, odziv in pregled. Korak Pregled **nazaj testira** pogoj najprej, poroča, kako pogosto bi se sprožil v zadnjih 24 urah do 7 dni, tako da se ujame mejna vrednost, ki je preveč nizka, preden se shrani, namesto da bi nekoga obvestila po strani. Opisujte, kar želite, v preprostem jeziku, in AI izpolni vsak korak, ki ga lahko, označujeta svoja ugibanja; delni zahtevek še vedno premakne čarovnika naprej, odpre se na prvem koraku, ki še potrebuje odločitev, namesto da bi vas prisilil, da začnete znova. Privzeto se opozorilo sproži enkrat in ostane tiho, dokler se metrika ne obnovi; lahko pa ga nastavite, da se ponavlja v intervalih.

Na koraku odziva lahko opozorilo ustvari in dodeli nov workflow, ki se izvede, ko se sproži, uporabi enega, ki ga že imate, ali ne stori ničesar. Sproženi payload prenaša opazovano vrednost, mejo, okno in workflow-e, ki so prispevali k številu, kar je način, kako opozorila dosežejo Slack, e-pošto ali Telegram z uporabo vozlišč, ki jih že imate. Zgodovina sprožitev beleži, kaj je bilo res v trenutku, ko se je vsako opozorilo sprožilo, in se hrani 90 dni; potrditev sprožitve spremeni oznako iz Sproženo v Potrjeno, ne da bi se pretvarjali, da je pogoj izpolnjen. Zavihek [Chat](../tabs/chat-tab.md) lahko odgovori, katera opozorila obstajajo in zakaj ali kdaj je eno sproženo. Opozorila lahko delite z uporabniki in [skupinami](../tabs/teams-tab.md).

Glejte tudi [Analitika](../tabs/analytics-tab.md), [Izvajanja](../tabs/traces-tab.md) in [Zgodovina izvajanj](./execution-history.md).

### [Analitika](../tabs/analytics-tab.md)

Zavihek Analitika prikazuje metrike in trende izvajanja. Povzetne statistike vključujejo skupno število izvajanj, stopnjo uspešnosti, stopnjo napak, razčlenitev latence in skupni **Prihranjen čas** (vsota ocenjenih minut, prihranjenih na vsakem workflow-u na zagon × uspešna izvajanja). Najbolj uporabljeni seznam prikazuje isto vsoto po workflow-u. Izberite osnovno časovno obdobje (24h, 7d, 30d ali vse), po želji filtrirajte po workflow-u, nato pa povlecite po katerem koli grafu, da se poglobite v izbrano časovno obdobje. Grafi in tabele workflow-ov se osvežijo glede na izbiro, samodejna osvežitev pa ohranja metrike posodobljene. Dopolnjuje [Zgodovino izvajanj](./execution-history.md) in pogled [Urniki](../tabs/scheduled-tab.md), ko potrebujete tako pretekle rezultate kot prihajajoča izvajanja.

Glejte tudi [Zgodovino izvajanj](./execution-history.md), [Urniki](../tabs/scheduled-tab.md) in [Vrednotenja](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Oglejte si demo analitike</a></p>

### [Nadzorna plošča](../tabs/dashboard-tab.md)

Zavihek Nadzorna plošča je prostor v slogu Grafana, kjer gradite mreže grafičnih pripomočkov, vsak prikazan iz svojega skritega Heym workflow-a. Ohranite toliko nadzornih plošč, kolikor jih potrebujete, in delite vsako z uporabniki ali skupinami, v načinu samo za branje ali urejanja; pripomočki vedno delujejo z poverilnicami lastnika, tako da vsi vidijo iste podatke. Opisujte metriko v preprostem jeziku in AI generira pripomoček, ali pa dodajte enega ročno in izberite vrsto grafika, ki je predogledan s testnimi podatki: stolpčni, črtni, površinski, tortni, tabelarični, numerični, merilni, razpršeni, deležni, stolpčni merilni, besedilni ali HITL. HITL je karusel vaših čakajočih človeških pregledov. Zgornji del prikazuje `1/n čakajočih`. Ime workflow-a odpre ta zagon na platnu. **Odobri**, **Zahtevaj spremembe** in **Zavrni** rešujejo to, ikona zgodovine poleg naslova pripomočka pa odpre ta zagon v pogovoru o zgodovini na isti strani. Pripomočki shranjujejo svoje rezultate v predpomnilniku, jih je mogoče natančno prilagoditi z AI (vsaka sprememba se shrani v [Zgodovino urejanja](./edit-history.md)), klonirati skupaj z njihovim celotnim workflow-om, preurediti z Uredi in jih povleči ali spremeniti velikost v načinu urejanja. Tabele lahko prikazujejo značke stanja in povezujejo svoje vrstice s podrobno nadzorno ploščo, ki prebere zapis kliknjene vrstice kot `$page.record`, pripomoček Run pa zažene workflow z nadzorne plošče: na odloženi datoteki, s svojimi vnosnimi polji ali z gumbom Zaženi. Ker je vsak pripomoček workflow, lahko postane vsak podatek, ki ga lahko pridobite — [HTTP](../nodes/http-node.md) klic, [BigQuery](../nodes/bigquery-node.md) poizvedba, [RAG](../nodes/rag-node.md) iskanje ali [LLM](../nodes/llm-node.md) izhod — graf. Nastavitve gradnika HITL ga lahko zožijo na preglede posameznega workflowa ali na korak agenta ali odobritve Slack v njem; tak gradnik jih prikazuje vsem, ki lahko odprejo ta workflow, in je skrit za vse, ki ga ne morejo. [Chat](../tabs/chat-tab.md) in orodje MCP `heym_chat` navedeta vaše nadzorne plošče z njihovimi gradniki, sporočita, na kateri nadzorni plošči je delovni potek, dodata nov gradnik (najprej prazen gradnik, katerega delovni potek Chat nato zgradi in preizkusi), postavita obstoječi potek kot gradnik na nadzorno ploščo, preimenujeta ali izbrišeta gradnike ter uredita postavitev, tako kot to stori gumb Uredi.

Glejte tudi [Node za izhod grafov](../nodes/chart-output-node.md), [Analitiko](../tabs/analytics-tab.md) in [Zgodovino izvajanj](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Oglejte si demo nadzorne plošče</a></p>
### [Vrednotenja](../tabs/evals-tab.md)

Zavihek Vrednotenja (na `/evals`) vam omogoča ustvarjanje naborov za vrednotenje, dodajanje ali generiranje testnih primerov, optimizacijo poziva niza in izvajanje vrednotenj proti [Agent Node](../nodes/agent-node.md) workflows. Izberite enega ali več modelov, izberite metodo ocenjevanja (Natančno ujemanje, Vsebuje ali LLM-as-Judge), po želji dovolite, da ločen model ali [Odločitveni model](../nodes/decision-node.md) oceni odgovore LLM-as-Judge, nastavite število izvajanj na test (plus temperatura in napor razmišljanja za Natančno ujemanje in Vsebuje), nato primerjajte izhode uspeha/neuspeha in po modelih. Preglejte zgodovino izvajanj prejšnjih vrednotenj, vključno z ocenjevalcem, ki ga je vsako izvajanje uporabilo, ponovno zaženite eno z istim ocenjevalcem, izvozite jo kot JSON in preverite osnovno vedenje v [Zgodovina](../tabs/traces-tab.md).

**Zbirka agenta** namesto tega preveri eno samo vozlišče agenta: prikazuje osnovno zakasnitev agenta, stroške v USD, žetone in klice orodij iz njegovih resničnih izvajanj, omogoča označitev vsakega orodja, orodja MCP, podagenta, podtoka ali spretnosti kot elementa, ki ga agent mora ali ne sme poklicati, postavi zgornje meje 20 % nad izhodišče, izvede delovni potek izbrano število krat z vhodi zadnjega zagona ali vhodi, ki jih je napisal AI, ter oceni vsako izvedbo z navedbo razloga za neuspeh. Izbirnik zbirk navaja obe vrsti z njunim tipom in omogoča iskanje, poročilo [Workflow Analysis](./workflow-analysis.md) pa predlaga zbirko za delovne tokove z vozlišči agenta ali LLM.

Oglejte si tudi [Agent Node](../nodes/agent-node.md), [Zgodovina](../tabs/traces-tab.md) in [Zgodovina izvajanja](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Oglejte si demo Vrednotenj</a></p>

### [Ekipe](../tabs/teams-tab.md)

Zavihek Ekipe vam omogoča ustvarjanje in upravljanje ekip. Ustvarite ekipo, dodajte člane po e-pošti in odstranite člane (ustvarjalca ni mogoče odstraniti). Delite [workflows](../tabs/workflows-tab.md), [predloge](../tabs/templates-tab.md), [poverenja](../tabs/credentials-tab.md), [spremenljivke](../tabs/global-variables-tab.md), [vektorske shrambe](../tabs/vectorstores-tab.md) in [datoteke iz Drive](../tabs/drive-tab.md) z ekipami iz njihovih ustreznih dialogov za deljenje; vsi člani ekipe pridobijo dostop. Uredite ime in opis ekipe ali izbrišite ekipo (izbriše vse delitve ekipe).

Oglejte si tudi [Ekipe](./teams.md), [Deljenje poverilnic](./credentials-sharing.md) in [Organizacija workflows](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Oglejte si demo Ekip</a></p>

### [Načrtovano](../tabs/scheduled-tab.md)

Zavihek Načrtovano prikazuje vse aktivne [Cron](../nodes/cron-node.md) workflows na vizualnem koledarju. Preklapljajte med dnevnim, tedenskim in mesečnim prikazom, da vidite, kdaj so vaše avtomatizacije načrtovane za izvajanje, nato se vrnite na ustrezen [workflow](../tabs/workflows-tab.md), ko potrebujete urediti urnik.

Oglejte si tudi [Cron](../nodes/cron-node.md), [Analitika](../tabs/analytics-tab.md) in [Zgodovina izvajanja](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Oglejte si demo Načrtovano</a></p>

### [Dnevniki](../tabs/logs-tab.md)

Zavihek Dnevniki prikazuje dnevnike Docker kontejnerjev za Heym sklad (backend, frontend, PostgreSQL). Izberite kontejner(e), filtrirajte po ravni dnevnika (Vse, INFO, OPOZORILO, NAPAKA, DEBUG) in iščite znotraj dnevnikov. Uporabite ga za odpravljanje napak in reševanje težav. Za dnevnike izvajanja workflows (rezultati vozlišča, izhodi) uporabite [Zgodovina izvajanja](./execution-history.md), [Zgodovina](../tabs/traces-tab.md) ali panel za odpravljanje napak v urejevalniku.

Oglejte si tudi [Zgodovina izvajanja](./execution-history.md), [Zgodovina](../tabs/traces-tab.md) in [Funkcije platna](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Oglejte si demo Dnevniki</a></p>

### [Podatkovna tabela](../tabs/datatable-tab.md)

Zavihek Podatkovna tabela vam omogoča ustvarjanje in upravljanje strukturiranih podatkovnih tabel znotraj Heym. Določite tipizirane stolpce (niz, številka, logična vrednost, datum, JSON), upravljajte vrstice z urejanjem ob dvojnem kliku, uvozite/izvozite CSV in delite tabele z uporabniki ali [ekipami](./teams.md) z dovoljenji za branje/pisanje. Uporabite [Podatkovno tabelo vozlišča](../nodes/datatable-node.md) za dostop do tabel programatično v workflows. Prikazana je **Oddelek sistemskih tabel** na vrhu, ki gosti **Tabela stroškov LLM**: pogled s fiksno shemo o cenah po modelih, ki se v ozadju pridobiva iz Helicone (24-urna TTL, ročno osveževanje), kjer lahko vsak uporabnik prekliče cene ali doda prilagojene vrstice za modele, ki jih Helicone ne navaja. Ta pravila cen vplivajo na KPI stroškov in graf stroškov po modelih na zavihku [Zgodovina](../tabs/traces-tab.md).

Oglejte si tudi [Podatkovno tabelo vozlišča](../nodes/datatable-node.md), [Zgodovina](../tabs/traces-tab.md), [Struktura workflows](./workflow-structure.md) in [Ekipe](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Oglejte si demo Podatkovna tabela</a></p>
### [Drive](../tabs/drive-tab.md)

Zavihek Drive prikazuje vse datoteke, ki jih generirajo veščine v vaših workflows. Na voljo je seznam vsake datoteke z imenom, tipom, velikostjo, izvorom vozlišča, datumom ustvarjanja in stanjem deljenja s timom, ter omogoča iskanje, avtenticirano prenos, deljenje, brisanje in nadzor paginacije. Je nadzorna plošča, ki dopolnjuje [Generacijo datotek](./file-generation.md), referenco [Drive](./drive.md) in [Drive vozlišče](../nodes/drive-node.md).

Oglejte si tudi [Drive](./drive.md), [Generacijo datotek](./file-generation.md) in [Drive vozlišče](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Oglejte si demo Drive</a></p>

### [Sodelovanje na Platnu](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
