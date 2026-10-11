# Miks Heym

Heym on infrastruktuur AI-agentide käitamiseks ja haldamiseks tootmiskeskkonnas. Üks isemajutatud runtime katab kogu agentide elutsükli.

Prototüüp-agent vajab mudelit, prompt'i ja mõnda tööriista. Tootmisagent vajab lisaks triggereid ja uuesti proovimist, salvestatud olekut, kui see peatub inimese järele ootamiseks, kirjet iga mudeli- ja tööriistakutse kohta, iga käivituse kulu, teste enne muudatuse juurutamist ning selgeid piiranguid sellele, mida agent võib iseseisvalt teha. Heym hoiab seda kõike ühes kohas, nii et süsteem, mille te lõuendil kavandate, ongi see süsteem, mis töötab. Ehitage agentseid süsteeme ja käitage neid kindlustundega.

## Üks runtime agentide elutsükli jaoks

| Etapp | Mida Heym teile pakub |
|---|---|
| **Ehita** | Koostage agente ja deterministlikke samme lõuendil, genereerige neid [AI Assistanti](../reference/ai-assistant.md) abil või alustage [Templates'ist](../tabs/templates-tab.md) ja teisaldatavatest oskustest. |
| **Orkestreeri** | Koordineerige agente, [alam-agente](../reference/agent-architecture.md), koodimisagente, RAG-i, brauseri automatiseerimist ja tööriistu selge andmevoo ja [paralleelse täitmisega](../reference/parallel-execution.md). |
| **Käita** | Käivitage run'e [webhook'ide](../reference/webhooks.md), ajakavade ja sündmuste [triggerite](../reference/triggers.md) kaudu, koos sõlmedepõhise uuesti proovimisega, [veakäsitlusega](../nodes/error-handler-node.md) ja [koormuse jaotamisega](../reference/cluster.md) instantside vahel. |
| **Jälgi** | Uurige iga täitmist [ajaloo](../reference/execution-history.md), [LLM trace'ide](../tabs/traces-tab.md), käivituse USD-kulu, lõuendil toimuvate reaalajas run'ide, [analüütika](../tabs/analytics-tab.md), [teavituste](../tabs/alerts-tab.md) ja [OpenTelemetry](../reference/opentelemetry.md) ekspordi kaudu. |
| **Hinda** | Testige prompt'e ja mudeleid oodatud väljundite vastu [Evals'is](../tabs/evals-tab.md), kasutades LLM-as-Judge hindamist ja mudelite kõrvuti võrdlemist. |
| **Kontrolli** | Hoidke inimesed kontrolli all [ülevaatuse kontrollpunktide](../reference/human-in-the-loop.md) ja [guardrail'idega](../reference/guardrails.md) ning haldake juurdepääsu krüpteeritud [credentials'ite](../reference/credentials.md), [tiimide](../reference/teams.md), [ühekordse sisselogimise](../reference/sso.md) ja [auditijälje](../reference/audit.md) abil. |
| **Eksponeeri** | Pakkuge workflow'sid REST-i ja [SSE](../reference/sse-streaming.md) kaudu, [MCP](../tabs/mcp-tab.md) tööriistadena, [Portali](../reference/portal.md) vestlusliidestena ja [töölaua](../tabs/dashboard-tab.md) vidinatena. |

## Build

### AI Assistant: ehitage Workflow'sid loomulikus keeles

[AI Assistant](../reference/ai-assistant.md) on vestluspanel workflow redaktori sees. Kirjeldage, mida soovite, näiteks "loo workflow, mis võtab kasutaja sisendi, otsib minu teadmistebaasist ja vastab GPT-4o abil", ning assistent genereerib noded ja edge'id, mis rakendatakse kohe lõuendile.

- Kasutab teie enda LLM credential'it (mis tahes toetatud mudel)
- Toetab **häälensisestust** käed-vabad workflow disainimiseks
- Rakendab automaatselt kehtiva workflow JSON-i AI vastusest lõuendile
- Voogedastab vastuseid reaalajas

Assistent töötab otse redaktori sees ja voogedastab noded lõuendile reaalajas ning kõik, mida see genereerib, jääb muudetavaks nagu käsitsi paigutatud noded.

### Skills System

Skill'id on teisaldatavad võimekuspaketid, `SKILL.md` juhendfail pluss valikulised Python-skriptid, mida saab paigutada mis tahes Agent node'ile.

- Skill'i juhised lisatakse agent'i süsteemse prompt'i ette
- Python-failid skill'is muutuvad kutsutavateks tööriistadeks
- Skill'id on korduvkasutatavad workflow'de vahel ja jagatavad `.zip` arhiividena

See on analoogne sellele, nagu annaksite oma agent'ile ühe hoobiga ametijuhendi ja tööriistakasti.

### Workflow Analyzer: käitusest teadlik tagasiside

[Workflow Analysis](../reference/workflow-analysis.md) paneel on redaktorisse sisse ehitatud käitusest teadlik dokumentatsiooni- ja tagasisidetööriist. Klõpsake **Analyze**, valige LLM credential ja mudel ning Heym genereerib redigeeritava Markdown-aruande praeguse workflow kohta.

Erinevalt staatilisest märkmest käitab analüsaator esmalt workflow'd, kui see on võimalik, ja lisab käivitustulemuse prompt'i. Aruanne hõlmab parendusvaldkondi, workflow eesmärki ja samm-sammulist selgitust, mida noded teevad. Kui aruanne on juba olemas, voogedastab **Reanalyze** eraldi eelvaate, et saaksite uue versiooni vastu võtta või jätta praeguse jagatud dokumendi alles.

## Orkestreerimine

### Sisseehitatud LLM- ja agendisõlmed

Heymi [agendisõlm](../nodes/agent-node.md) käitab tihedalt integreeritud tööriistakutsumise tsüklit, mis ühendab inline Pythoni tööriistu, MCP-ühendusi ja portatiivset oskuste süsteemi – kõik loodud tootmiskeskkonna agentide jaoks.

Heymi tavaline [LLM-sõlm](../nodes/llm-node.md) läheb samuti kaugemale üksikust prompt-vastuse sammust. Toetatud OpenAI ja OpenAI-ga ühilduvate endpointide puhul saab see lülituda **Batch API režiimi**, nii et üks sõlm esitab massiivi promptidest soodsama hinnaga teenusepakkuja-põhises batch-päringus. Lõuend paljastab seejärel spetsiaalse `batchStatus` haru, mis käivitub, kui batch liigub olekute nagu `pending`, `processing` ja `completed` vahel.

See tähendab, et LLM-sõlm saab teha kahte asja korraga:

- Käitada peamist batch-päringut ja tagastada lõplikud üksuste kaupa väljundid tavalisel harul
- Käivitada teavituse või logimise loogikat iga olulise batch-oleku uuenduse korral, ilma et voog muutuks kohandatud pollimistsükliks

Batch-täitmine on esmaklassiline LLM workflow primitiiv, mille teenusepakkuja ja mudeli võimekuse kontrollid asuvad sõlme kasutajaliideses.

**Agendisõlm** on Heymi agendi orkestreerimise tuum:

- **Tööriistakutsumine** – Agent kordab tööriistakutseid tsüklis, kuni jõuab lõpliku vastuseni
- **Pythoni tööriistad** – Määratlege kohandatud tööriistu inline täieliku Pythoniga; agent kutsub neid käitusajal
- **MCP-ühendused** – Ühenduge mis tahes [Model Context Protocol](https://modelcontextprotocol.io/) serveriga (stdio või SSE) ja agent saab automaatselt kõik selle tööriistad
- **Oskused** – Kukutage `.zip` või `.md` fail agendile, et laiendada selle süsteemikonteksti ja lisada Pythoni tööriistu
- **Alam-workflow kutsed** – Agent saab kutsuda teisi Heymi workflow'sid tööriistadena, komponeerides keerukat käitumist ilma kohandatud koodita

Täieliku viite leiate jaotisest [Agendisõlm](../nodes/agent-node.md) ja [Agendi arhitektuur](../reference/agent-architecture.md).

### Mitme agendi orkestreerimine

Heym toetab **orkestreerija mustrit** esmaklassiliste visuaalsete primitiividega:

- Üks agent toimib **orkestreerijana** (`isOrchestrator: true`) ja saab `call_sub_agent` tööriista
- See delegeerib ülesandeid nimetatud **alam-agentidele** samal lõuendil
- Alam-agendid saavad ise kutsuda teisi agente või alam-workflow'sid (maksimaalne sügavus: 5)
- **Paralleelne täitmine**: kui orkestreerija kutsub ühe käigu jooksul mitut alam-agenti, käivituvad need kiiremate tulemuste saavutamiseks paralleelselt

See võimaldab arhitektuure nagu planeeriv agent, mis suunab tööd uurijale, kodeerijale ja kokkuvõttele – kõik visuaalselt ühendatud ilma kohandatud orkestreerimiskoodita.

Täitmise üksikasju leiate jaotisest [Agendi arhitektuur](../reference/agent-architecture.md).

### Kodeerimisagendid workflow sõlmedena

Heym pakub kahte sõlme, mis käitavad tõelist kodeerimisagenti workflow sammuna, mitte vestluse lõpetamisena:

- **[Codex sõlm](../nodes/codex-node.md)** – Käitab OpenAI Codex CLI-d isoleeritud Heymi tööruumis GitHubi repositooriumi vastu. Toetab **Sign in with ChatGPT** (PKCE OAuth teie Plus/Pro tellimusel, ilma tokenipõhise API kuluta) või access tokenit, kloonib repo, laseb Codexil koodi muuta ja tagastab `summary`, `diff`, `changedFiles` ja mustandi `pullRequestUrl`.
- **[OpenCode Go sõlm](../nodes/opencode-go-node.md)** – Sama repositooriumi workflow läbi teenusepakkuja-sõltumatu OpenCode värava (Kimi, DeepSeek, Qwen ja teised), käivitatuna **karastatud ühekordses konteineris**: kõik võimekused eemaldatud, kirjutuskaitstud juur, pid/mälu/CPU piirangud. GitHubi token jääb sandboxist väljapoole: Heym teostab iga git- ja GitHub-operatsiooni hosti poolel, nii et genereeritud kood ei saa push-mandaate välja viia.

See tähendab, et workflow saab webhook'ist vea triaažida, anda repo kodeerimisagendile, oodata mustand-PR-i ja postitada lingi Slacki – täielikult automatiseeritult, ressursipiirangutega, mida saab iga juurutuse jaoks konfigureerida.

### Sisseehitatud RAG-torustik

Heym sisaldab [RAG / vektorpoe sõlme](../nodes/rag-node.md) ja hallatavat [Vektorpoed](../tabs/vectorstores-tab.md) vahekaarti. Saate:

- Valida oma vektori taustsüsteemi: **Qdrant** (väline server) või **Postgres (pgvector)**, mis salvestab vektorid Heymi enda andmebaasi ilma täiendava teenuse käitamiseta
- Sisestada dokumente vektorpoodi otse workflow sõlmest
- Teostada semantilist otsingut ja suunata tulemused LLM- või agendisõlme
- Viidata tulemustele avaldistega nagu `$ragNode.results.map("item.payload.content").join("\n\n")`

Heymis on RAG kaks sõlme, millel on täielik kontroll embeddingute ja päringute üle.

### Brauseri automatiseerimine Playwrightiga

[Playwrighti sõlm](../nodes/playwright-node.md) on esmaosalusega brauseri automatiseerimine lõuendil.

- **Sammude režiim** – Koostage navigeerimise, klõpsamise, tippimise, täitmise, ekraanipildi, eraldamise ja kerimise toiminguid visuaalselt
- **AI sammud automaatse parandamisega** – Kirjeldage toimingut loomulikus keeles ja LLM genereerib Playwrighti toimingud; ebaõnnestunud selektorid saab automaatselt parandada ja genereeritud samme saab vahemällu salvestada, et vältida tulevasi LLM-kutseid
- **Koodi käitamise režiim** – Lülitage sõlm täielikule Playwright Pythonile keerukate voogude jaoks (vaikimisi keelatud; lubamisel käitub Heymi karastatud sandboxis)
- **Autenditud sessioonid** – Taastage küpsised/`storageState` enne käitamist, kontrollige sisselogimist selektori kontrolliga ja kasutage tagavaraks skriptitud sisselogimise samme
- **Võrgu püüdmine** – Valikuliselt koguge JSON-vastuseid, päiseid, küpsiseid ja brauseri salvestusruumi koos tulemustega

Heym kohtleb brauserit tavalise sõlmena, millel on samad avaldised, mandaadid ja veakäsitlus nagu kõigel muul.

### Avaldise DSL

Heymi [avaldise DSL](../reference/expression-dsl.md) pakub puhast ja võimsat süntaksit ülesvoolu sõlmeandmetele viitamiseks:

- `$input.text` – Sisendsõlme andmed
- `$nodeName.field` – Mis tahes ülesvoolu sõlme väljundväli
- `$global.variableName` – Püsivad globaalsed muutujad
- Massiivi abifunktsioonid: `.first()`, `.map("field")`, `.join("\n")`

Avaldised töötavad igas string-väljas, sealhulgas promptides, HTTP-päistes, tingimustes ja seatud väärtustes, nii et andmed liiguvad sammude vahel selgelt. DSL tasakaalustab võimsust ja loetavust ilma, et oleks vaja täielikku JavaScripti teadmisi.

## Käivitamine

### Triggerid, uuesti proovimised ja veateed

Workflow võib alata paljudest kohtadest. [Input](../nodes/input-node.md) nodes võtavad vastu HTTP [webhooke](../reference/webhooks.md), [Cron](../nodes/cron-node.md) töötab ajakava alusel ning sündmuste [triggerid](../reference/triggers.md) käivitavad töid Telegramist, Discordist, Slackist, IMAP-postkastidest, WebSocket-voogudest, RabbitMQ-järjekordadest, failiüleslaadimistest ja Heymi platvormi sündmustest.

Tõrkeid käsitletakse graafi sees. Iga node saab tõrke korral uuesti proovida kindla arvu katsete ja nendevahelise ooteajaga, iga katse salvestatakse [execution history](../reference/execution-history.md) vaatesse ning [Error Handler](../nodes/error-handler-node.md) node käivitub automaatselt, kui node ebaõnnestub, nii et taastumine on workflow' enda osa.

### Paralleelne DAG-täitmine

Heymi workflow-täitja kasutab suunatud atsüklilise graafi (DAG) plaanurit. Sõltumatud noded töötavad automaatselt paralleelselt, ilma et oleks vaja midagi seadistada.

- Samal sõltuvustasemel olevad noded saadetakse üheaegselt lõimedevahemikku (`max_workers=8`)
- Niipea kui mõni node lõpetab, ajastatakse selle allavoolu noded
- [Merge Node](../nodes/merge-node.md) ühendab paralleelsete harude tulemused
- Mitu workflow-käivitust täidetakse üheaegselt; iga käivitus on täielikult isoleeritud

Paralleelsus on vaikekäitumine, mille määrab graafi struktuur.

Vt [Parallel Execution](../reference/parallel-execution.md).

### Skaalumine mitme instantsi vahel

Suunake teine Heymi instants samale PostgreSQL-andmebaasile ja see liitub worker'ina. Taustakäivitused jagatakse instantside vahel teie määratud kaalude järgi, üks valitud leader hoiab ajakavasid, hoiatuste hindamist ja kokkujooksmisest taastumist töös üle failover'i ning iga käivitus salvestab instantsi, mis selle täitis. Vt [Load Distribution](../reference/cluster.md).

### Agentne Kanbani tahvel

[Board tab](../tabs/board-tab.md) on sisseehitatud Kanbani tahvel, kus veerud ise täidavad workflow'sid. Kaart on püsiv agentne töö, mis kannab konteksti, vestlusajalugu, täitmise olekut, väljundeid ja workflow-käivitusi.

- **Veeru workflow-ahelad** – Kaardi viimine veergu käivitab selle veeru workflow-ahela; **Agentic Kanban Model** (teie credential + mudel) vastendab kaardi sisu workflow' sisenditeks ja muudab väljundid tagasi loetavaks tekstiks
- **Kaardi manused** – Kukutage failid kaardile; dokumendid ekstraktitakse tekstiks ja pildid edastatakse visioonivõimelistele mudelitele enne iga käivitust
- **Reaalajas käivituse lõuend** – Avage kaardi sees aktiivne käivitus ja jälgige selle täitmist päris workflow-lõuendil, node node haaval
- **Meeskonna jagamine** – Jagage tahvleid kasutajate või meeskondadega lugemis-/kirjutamisõigustega; jagatud tahvlite ahelad töötavad omaniku credential'itega, nii et kaastöötajad ei vaja kunagi enda omi
- **Tõrgete nähtavus** – Ebaõnnestunud kaardid toovad esile veaajaloo indikaatori ning järelkäivitused võivad peatuda kommentaaride ootamiseks

Tahvel on platvormi natiivne pind: kaardid, workflow'd, credential'id ja reaalajas käivitused asuvad kõik ühes kohas.

### Heym Drive: sisseehitatud failihoidla

[Drive tab](../tabs/drive-tab.md) on platvormi sisse ehitatud failihoidla. Skillide ja workflow'de genereeritud failid (PDF, DOCX, CSV, pildid) maanduvad sinna automaatselt ning ka tahvli kaartide manused salvestatakse sinna.

- **Jagamislingid** – Avalikud või parooliga kaitstud (Basic Auth) allalaadimislingid valikulise aegumise ja maksimaalse allalaadimiste arvuga
- **Meeskonna jagamine** – Jagage faile oma meeskondadega kirjutuskaitstult ning eemaldage kõik meeskonnajagamised ühe toiminguga
- **Hulgioperatsioonid** – Mitmikvalik shift-klõpsuga vahemike kaupa, valikute koondamine üheks ZIP-allalaadimiseks või ühe jagamise/parooli/kustutamise seade rakendamine paljudele failidele korraga
- **Agendi juurdepääs** – Skillid saavad valida Drive'i failide lugemise, nii et agent saab töötada dokumentidega, mille olete loonud teie või teised workflow'd

Genereeritud artefaktid saavad platvormi sees püsiva, jagatava kodu.

## Jälgimine

### LLM-i jäljed

[Traces Tab](../tabs/traces-tab.md) pakub täielikku jälgitavust iga LLM-i kutse kohta:

- Päringu ja vastuse payloadid
- Kutse kaupa ajastus: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Tööriistakutsete nimed, argumendid ja tulemused
- Mudelile edastatud Skills

Jälgisüsteem on loodud spetsiaalselt agentsema käitumise silumiseks, pakkudes täielikke päringu ja vastuse payloadisid ning kutse kaupa ajastust.

### LLM-i tokenite kulude jälgimine

Iga LLM-i kutse Heymis arvutatakse automaatselt. [Traces Tab](../tabs/traces-tab.md) kuvab iga jälje sisend- ja väljundtokenite arvu koos reaalajas USD kuluga, mis on tuletatud sünkroonitud hinnatabelist.

- **Kulu jälje kohta** – Sisendtokenid, väljundtokenid ja kogu USD summa kuvatakse igal jäljereal
- **Kuluanalüütika** – KPI-kaardid ja mudelipõhine kulugraafik uuenevad vastavalt valitud ajavahemikule (1h / 24h / 7d / 30d / Kõik)
- **LLM Cost Table** – Süsteemitabel [DataTable tab](../tabs/datatable-tab.md) täiendatakse Helicone'ist iga 24 tunni tagant; saate hindu üle kirjutada või lisada kohandatud ridu mudelitele, mida veel loetletud pole
- **Puuduva hinna hoiatus** – Mudelite jäljed, millel puudub hinnakirje, kuvavad reasisese hoiatuse otselingiga kulutabelile

Igal täitmisel on oma USD kulu, mis on jaotatud mudeli kaupa.

### Ava tootmiskäivitusi reaalajas lõuendil

Tootmise workflow jääb pärast redaktorist väljumist algatamist uuritavaks. Avage mis tahes **Running** kirje kummastki History dialoogist või avage aktiivne käivitus Agentic Kanban kaardi sees, ja Heym ühendab tavalise workflow redaktori täpselt selle täitmisega.

- Juba lõpetatud sõlmed kuvatakse kohe koos oma tulemustega
- Praegune sõlm ja ootel allavoolu sõlmed pulseerivad jätkuvalt, kui täitmine edeneb
- Debug paneel saab samad järkjärgulised sõlmetulemused nagu lõuendilt algatatud käivitus
- Lõplik väljund ja täitmise esiletõstmised saabuvad ilma pollimise või duplikaatkäivituse algatamiseta
- Redaktori sulgemine ainult katkestab jälgija ühenduse; see ei tühista kunagi tootmise workflow'd

Jälgija kasutab SSE-d, mida toetab töötajatevaheline täitmise hetktõmmis, seega see töötab webhook, schedule, chat, MCP, integration ja Board triggerite puhul isegi siis, kui käivitust haldab teine backend-töötaja.

### OpenTelemetry, analüütika ja hoiatused

Heym väljastab [OpenTelemetry](../reference/opentelemetry.md) spane iga workflow käivituse, sõlme täitmise ja Agent tööriista kutsumise kohta, eksportides need OTLP/HTTP kaudu Jaegerisse, Grafana Temposse, Honeycombi, Datadogi või mis tahes muusse ühilduvasse backendi.

[Analytics](../tabs/analytics-tab.md) vahekaart jälgib käivituste arvu, õnnestumismäära, kestust ja trende workflow kaupa. [Alerts](../tabs/alerts-tab.md) jälgivad vigade arvu, käivituse kestust, tokenite või USD kulu ja täitmise mahtu ajaaknas ning käivitavad seejärel teie valitud teavituse workflow, nii jõuab hoiatus Slacki, e-postile, Telegrami või kuhu iganes, kuhu sõlm ulatub.

## Hindamine

### Sisseehitatud hindamised

[Evals Tab](../tabs/evals-tab.md) võimaldab teil määratleda testkomplekte ja käivitada neid oma agendi workflow'de vastu:

- Looge testjuhtumeid sisendite ja oodatud väljunditega või genereerige need suite'i prompt'i põhjal
- Käivitage üks suite mitme mudeli vastu ja võrrelge nende väljundeid kõrvuti
- Hindamiseks kasutage Exact Match'i, Contains'i või LLM-as-Judge'i sõltumatu kohtuniku-mudeliga
- Vaadake üle pass/fail, tegelik vs oodatud ning käivituste ajalugu

Muutke prompt'i või mudelit, käivitage suite uuesti ja võrrelge tulemusi enne, kui muudatus jõuab produktsiooni.

## Kontroll

### Human-in-the-Loop (HITL)

Heymil on sisseehitatud [Human-in-the-Loop](../reference/human-in-the-loop.md) süsteem, mis võimaldab agentidel täitmist peatada, taotleda inimülevaatust ja jätkata täpselt sealt, kus pooleli jäeti.

- **Agendi kontrollpunktid** – Lubage `hitlEnabled` mis tahes Agent-node'is, et anda sellele `request_human_review` tööriist. Agent otsustab, millal vajab otsus inimjärelevalvet, ja kutsub tööriista välja koos kokkuvõtte ja mustandiga.
- **Avalikud ülevaatuse URL-id** – Iga ülevaatustaotlus genereerib turvalise ühekordse lingi aadressil `/review/{token}` (168-tunnine TTL). Ülevaatajad saavad **accept**, **edit & continue** või **refuse** ilma sisse logimata.
- **Täitmise hetktõmmised** – Workflow külmutab oma täieliku oleku (vestluse ajalugu, muutujad, tööriistade tulemused), et jätkata täpselt seal, kus see peatus, pärast seda, kui ülevaataja on vastanud.
- **Teavitusharu** – Valikuline `review` väljundkäepide võimaldab teil ühendada teavitusvoo (Slack, e-post, webhook), mis käivitub, kui ülevaatust taotletakse.
- **MCP tööriistade kinnitamise poliitikad** – Kirjalikud HITL juhised tõlgendatakse kinnitamise ulatusteks (`always` / `once` / `never`), et agent saaks madala riskiga tööriistu automaatselt kinnitada ja kõrge riskiga tööriistu eskaleerida.
- **Mitu kontrollpunkti** – Üks agendi käivitus võib ülevaatuseks peatuda mitu korda; iga kontrollpunkt on sõltumatu.

Avalikud ülevaatuse URL-id, edit-and-continue, teavitus harustamine ja hetktõmmisel põhinev jätkamine töötavad kõik samast agendi kontrollpunktist.

Täieliku viite leiate jaotisest [Human-in-the-Loop](../reference/human-in-the-loop.md).

### LLM Guardrails

Heymil on sisseehitatud [Guardrails](../reference/guardrails.md) nii [LLM](../nodes/llm-node.md) kui ka [Agent](../nodes/agent-node.md) node'idel, et saaksite blokeerida ebaturvalist sisu enne, kui mudeli vastus jõuab allavoolu sammudeni.

- **Node-tasemel turvalisuse lüliti** – Lubage guardrails otse node'il, mis genereerib või töötleb kasutajale suunatud sisu
- **Lai poliitika katvus** – Blokeerige vägivald, vihakõne, seksuaalne sisu, NSFW/roppused, ahistamine, ebaseaduslik tegevus, isikuandmete päringud ja prompt injection katsed
- **Mitmekeelne tuvastus** – Rakendage samu turvareegleid türgi, inglise, araabia, hispaania ja teistes keeltes
- **Workflow-loomsuline varulahendus** – Kui sõnum blokeeritakse, viskab node tüübistatud workflow-vigastuse, mille saate suunata läbi [Error Handler](../nodes/error-handler-node.md)

Turvapoliitika asub otse LLM-i ja Agendi konfiguratsioonis ning ühendub otse workflow harustamise ja vigade käsitlemisega.

### Juurdepääs, mandaadid ja audit

Agendid tegutsevad tõeliste mandaatidega, seega on juurdepääs osa haldusest. [Credentials](../reference/credentials.md) on salvestatud krüpteeritult, maskeeritud pärast loomist ja jagatavad kasutajate või [tiimidega](../reference/teams.md), ning tiimid jagavad ka workflow'sid, muutujaid, vektorhoidlaid ja Drive-faile. [Single sign-on](../reference/sso.md) ühendab mis tahes OpenID Connect pakkujaga, sealhulgas Okta, Entra ID, Keycloak, Auth0 ja Google. [Audit trail](../reference/audit.md) salvestab iga turvalisusega seotud toimingu koos selle sooritaja, sihtmärgi ja tulemusega, voogedes koos teie konteineri logidega logikogujasse või SIEM-i, mida te juba kasutate.

### Ise hostitud, teie oma andmed

Heym töötab teie infrastruktuuril. Workflow'd, mandaadid, täitmise ajalugu ja jäljed asuvad teie enda andmebaasis ning mudelikutsed lähevad teie serveritest teie valitud pakkujale või mudelile, mida te ise hostite Ollama või vLLM kaudu. Agentide puhul, mis töötlevad tundlikke dokumente, kliendiandmeid või patenteeritud teadmusbaase, on see sageli kohustuslik nõue.

Heym on litsentsitud **MIT License with the Commons Clause condition** alusel. Lähtekood on source-available: saate seda vabalt kasutada, muuta ja ise hostida. Commons Clause piirab tarkvara müümist, sealhulgas tasulise hostimise või konsultatsiooni-/tugiteenuste pakkumist, mille väärtus tuleneb olulisel määral Heymist. Kommertslitsentsi, ettevõtte juurutuste või professionaalse toe saamiseks võtke ühendust [enterprise@heym.run](mailto:enterprise@heym.run).

## Avaldamine

### API-d ja voogedastus

Workflow'd on HTTP kaudu kutsutavad aadressil `/api/workflows/{workflow_id}/execute`, mis tagastab JSON-i, ning aadressil `/api/workflows/{workflow_id}/execute/stream`, mis edastab node'i sündmusi Server-Sent Events'ina käivituse ajal. Mõlemad jagavad workflow-tasemel autentimist, rate limiting'ut ja vastuste vahemällu salvestamist. Vt [Webhooks](../reference/webhooks.md) ja [SSE Streaming](../reference/sse-streaming.md).

### MCP (Model Context Protocol) integratsioon

Heym toetab natiivselt [MCP-d](../tabs/mcp-tab.md) mõlemal pool:

- **Kliendina**: Agent node'id ühenduvad väliste MCP serveritega (Filesystem, Browserbase, kohandatud tööriistad) stdio või SSE kaudu ja kasutavad nende tööriistu automaatselt
- **Serverina**: Workflow'd, millel on MCP sisse lülitatud, muutuvad tööriistadeks vaikeserveris aadressil `/api/mcp/sse` või nimetatud serverites, millel on oma URL ja API key, nii et Claude Desktop, Cursor ja teised MCP kliendid saavad teie Heym workflow'sid otse kutsuda

Agent'id saavad kasutada mitut MCP serverit korraga ja iga workflow võib saada tööriistaks välisele MCP kliendile.

### Portal: workflow'de avaldamine vestlusliidestena

[Portal](../reference/portal.md) funktsioon muudab iga workflow avalikuks vestlusliideseks aadressil `/chat/{slug}`:

- Valikuline autentimine kasutajapõhiste mandaatidega
- Voogedastusega käivitamine (node'ide edenemine reaalajas)
- Failide üleslaadimise tugi
- Mitme vooru vestlusajalugu

Meeskonnad saavad käivitada sisemisi tööriistu, kliendile suunatud vestlusroboteid ja AI-põhiseid vorme ühest workflow'st ja URL-ist, ilma et peaks kirjutama frontend koodi.

### Workflow-põhised armatuurlaud

[Dashboard vahekaart](../tabs/dashboard-tab.md) on kasutaja loodud aruandluskeskkond, kus iga diagrammi vidin on toidetud oma peidetud Heym workflow'st. Vidin saab kutsuda API-sid, pärida BigQuery'st, otsida RAG/vektorsalvestustest, käivitada LLM samme, teisendada ridu ja lõpetada [Chart Output node'iga](../nodes/chart-output-node.md). Vidinad saate luua käsitsi, genereerida need AI-ga, hiljem peenhäälestada, tulemusi vahemällu salvestada ja ruudustikku visuaalselt ümber korraldada.

## Võrdlus Workflow automatiseerimise tööriistadega

Paljud meeskonnad jõuavad Heymi juurde Workflow automatiseerimise tööriistadest. Allolev tabel võrdleb Heymi n8n-i, Zapieri ja Make.com-iga nende võimekuste osas, mis loevad siis, kui agendid töötavad produktsioonis, ning selle all olevad joonealused märkused viitavad ametlikele dokumentidele, millel võrdlus põhineb. Ühe tööriista põhjalikumaks vaatlemiseks vaadake võrdluslehti aadressil [heym.run/compare](https://heym.run/compare).

| Võimekus | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Sisseehitatud LLM node | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + oleku harud | ✓ | piiratud¹¹ | –¹¹ | piiratud¹¹ |
| Sisseehitatud Agent node (tööriistade kutsumine) | ✓ | ✓ | ✓ | ✓ |
| Mitme agendi orkestreerimine | ✓ | ✓ | piiratud | piiratud |
| Kodeeriva agendi noded (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Sisseehitatud RAG / vektorandmebaas | ✓ | ✓ | piiratud¹ | plugin² |
| WebSocketi lugemine / kirjutamine | ✓ | piiratud¹² | –¹³ | –¹⁴ |
| Loomuliku keele Workflow koostaja | ✓ | piiratud³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Käimasoleva käivituse avamine reaalajas lõuendil | ✓ | piiratud¹⁹ | piiratud¹⁹ | –¹⁹ |
| Workflow-põhised armatuurlaud | ✓ | piiratud¹⁷ | piiratud¹⁷ | piiratud¹⁷ |
| Agentic Kanbani tahvel | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Oskuste süsteem agentidele | ✓ | – | – | – |
| Sisseehitatud failikett (jagamislingid, meeskonnad) | ✓ | piiratud²² | piiratud²² | –²² |
| Brauseri automatiseerimise node (Playwright) | ✓ | piiratud²³ | piiratud²³ | –²³ |
| LLM-i jälgimise inspekteerimine | ✓ | piiratud⁴ | – | ✓ |
| OpenTelemetry jälgimise eksport | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM-i Tokeni kulude jälgimine (USD) | ✓ | –¹⁵ | –¹⁵ | piiratud¹⁵ |
| Sisseehitatud eval-id AI Workflow'dele | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | piiratud⁶ | piiratud⁷ |
| LLM-i turvapiirangud | ✓ | ✓⁸ | ✓⁸ | piiratud⁸ |
| Konteksti automaatne kompressioon | ✓ | – | – | – |
| Paralleelne DAG-täitmine | ✓ | piiratud⁹ | – | – |
| Isehostitav, lähtekood saadaval | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Avaldise DSL dünaamiliste andmete jaoks | ✓ | ✓ | piiratud | ✓ |

> **Joonealused märkused:** ¹ Zapier Knowledge Sources — puudub avatud vektorandmebaas või embeddingute kontroll. ² Make.com-il on Pinecone/Qdrant moodulid, kuid puudub natiivne RAG node. ³ n8n AI Workflow Builder on ainult pilvepõhine beeta, millel on krediidipiirangud. ⁴ n8n kuvab vaheetappe; täielik jälgimine nõuab kolmandate osapoolte tööriistu. ⁵ n8n toetab AI tööriistakutsete kinnitamist vestluse, e-posti ja koostöökanalite kaudu, kuid see ei tee tervest täitmisest hetktõmmist ega jätka seda nii nagu Heym. ⁶ Zapier Human in the Loop toetab kinnitamisi ja andmete kogumist Zapi sees, kuid see ei ole avaliku ülevaatamise, hetktõmmise-jätkamise kontrollpunktisüsteem. ⁷ Make.com pakub Human in the Loop'i Enterprise rakendusena koos ülevaatusnõuetega ja kohandatud/heakskiidetud/tühistatud tulemustega, kuid see on endiselt plaanipõhiselt piiratud ja vähem agent-natiivne. ⁸ n8n-il on spetsiaalne Guardrails node, Zapieril on AI Guardrails kõigis oma AI toodetes ning Make.com dokumenteerib agendi reeglid ja ülevaatusvood, kuid mitte võrreldavat eraldiseisvat turvapiirangute funktsiooni, seega on Make märgitud piiratuks. ⁹ n8n täidab vaikimisi järjestikku; paralleelsus nõuab alam-Workflow'de lahendusi. ¹⁰ Sustainable Use License — tasuta isehostimine sisemiseks kasutamiseks, kommertsiaalne edasilevitamine on piiratud. ¹¹ Seisuga 22. aprill 2026 kirjeldavad n8n-i ametlikud dokumendid HTTP-partiide töötlemist ja loop/wait mustreid, mitte natiivset LLM-i partii-oleku haru, Zapieri ametlikud ChatGPT rakenduse dokumendid ei loetle ühtegi Trigger'it ja ainult üldist API Request beetat ning Make'i ametlik OpenAI integratsiooni leht pakub partii-tegevusi nagu create/watch completed, kuid mitte esmaklassalist oleku-harustamisega LLM node'i, seega on n8n/Make märgitud piiratuks ja Zapier on selle konkreetse Workflow mustri jaoks märgitud mitteolemasolevaks. ¹² n8n-i ametlikud dokumendid hõlmavad HTTP Webhook ja HTTP Request node'e ning Code/custom/community laiendatavust, kuid ma ei leidnud esimese osapoole WebSocketi Trigger'i/saatmise node'i, seega on n8n märgitud piiratuks. ¹³ Zapieri ametlikud dokumendid hõlmavad sissetulevaid Webhook'e ja väljaminevaid Webhook/API päringuid ainult HTTP kaudu, mitte natiivseid WebSocketi Trigger'i või saatmise samme. ¹⁴ Make'i ametlikud dokumendid hõlmavad Webhookide mooduleid ja HTTP(S) päringu mooduleid, kuid ma ei leidnud natiivset WebSocketi Trigger'it ega saatmise moodulit. ¹⁵ n8n-il puudub natiivne LLM-i Tokeni kulude jälgimine; kogukonna lahenduste Workflow'd on olemas, kuid nõuavad käsitsi installimist ja täitmisjärgseid API kutseid (avatud funktsioonisoov seisuga mai 2026). Zapier ei avalda kasutajatele Tokenite arvu ega USD kulu täitmise kohta; AI sammud tarbivad ainult ülesandeid. Make.com-i krediidiarmatuurlaud kajastab osaliselt Tokenite tarbimist Make'i hostitud AI puhul (alates augustist 2025), kuid kolmandate osapoolte API võtme ühenduste eest arveldatakse 1 operatsioon = 1 krediit ilma Tokenite loendamiseta; mudelipõhist USD jaotust täitmise kohta ei ole saadaval. ¹⁶ Heym edastab natiivseid OpenTelemetry span'e (üks Workflow käivituse kohta pluss üks iga node'i kohta) OTLP/HTTP kaudu mis tahes ühilduvasse taustsüsteemi, W3C trace-context levitamisega ja ilma instrumenteerimiskoodita, seadistatav `HEYM_OTEL_*` keskkonnamuutujate kaudu ja vaikimisi välja lülitatud. n8n-il on dokumenteeritud OpenTelemetry jälgimise integratsioon Workflow'de ja node'ide täitmise jaoks. Zapier ja Make.com ei dokumenteeri oma Workflow'/stsenaariumite täitmiste OpenTelemetry eksporti seisuga juuni 2026. ¹⁷ n8n dokumenteerib Insights armatuurlaua produktsiooni täitmise mõõdikute jaoks, Zapier dokumenteerib Zap History pluss Task Usage ning Make.com dokumenteerib Scenario History; need on jälgimise/ajaloo pinnad, mitte kohandatud armatuurlaua vidinad, mida toetab suvaline Workflow loogika nagu Heymi Dashboard vahekaart. ¹⁸ Heym Workflow Analyzer käivitab Workflow, kui võimalik, loeb täitmise tulemust ja genereerib jagatud redigeeritava Markdown raporti, mis hõlmab parendusvaldkondi, eesmärki ja samm-sammulist käitumist. n8n dokumenteerib AI Workflow Builder'it Workflow'de loomiseks/viimistlemiseks/silumiseks, Zapier dokumenteerib AI tõrkeotsingut vigaste Zap käivituste jaoks ning Make.com dokumenteerib stsenaariumi ajalugu pluss AI agendi arutlussamme, kuid nende avalikud dokumendid ei kirjelda sama käivitusteadlikku jagatud Workflow analüüsi dokumenti. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) loetleb käimasolevaid täitmisi ja suudab laadida andmeid eelmisest täitmisest redaktorisse, samas kui [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) avaldab redaktoris töötava oleku. [Make Scenario History](https://help.make.com/scenario-history) dokumenteerib käivituse üksikasjad ja logid. Nende avalik dokumentatsioon, kontrollitud 18. juulil 2026, ei kirjelda Heymi täpset voogu: avage suvaline käimasolev produktsiooni käivitus History'st või Kanbani kaardilt, taastage selle praegune node'i hetktõmmis ja jätkake node'i animatsiooni ja Debug logide vastuvõtmist samal lõuendil. ²⁰ Heymi [Codex](../nodes/codex-node.md) ja [OpenCode Go](../nodes/opencode-go-node.md) node'id käivitavad tõelise kodeeriva agendi CLI isoleeritud Heymi tööruumis GitHubi hoidla vastu — klooni, redigeeri, koosta diff, lükka haru, ava pull request — esmaklassalise Workflow sammuna. Seisuga 20. juuli 2026 ei dokumenteeri ükski konkurent samaväärset: n8n-i [OpenAI node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) hõlmab chat/assistant API kutsed, mitte hoidla tasemel kodeerivat agenti, ja natiivne Codexi tugi on endiselt kogukonna soov; Zapieri enda blogi dokumenteerib vastupidist suunda — [Codex juhib Zapieri tööriistu Zapier MCP kaudu](https://zapier.com/blog/automate-codex-zapier-mcp/) — mitte Codexi kui Zapi sammu; Make.com-i OpenAI moodulid pakuvad completions/assistants/batch tegevusi, mitte kodeerivat agenti, mis kloonib hoidlaid ja avab PR-e. ²¹ Heymi [Board vahekaart](../tabs/board-tab.md) on sisseehitatud agentic Kanbani tahvel, mille veerud täidavad Workflow'sid ja mille kaardid kannavad konteksti, vestluse ajalugu, täitmise olekut ja käivitusi. n8n ([Kanban Tool integratsioon](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool integratsioonid](https://zapier.com/apps/kanbantool/integrations)) ja Make.com ([Kanban Tool integratsioon](https://www.make.com/en/integrations/kanban-tool)) ühenduvad ainult kolmandate osapoolte kanbani rakendustega nagu Kanban Tool, Wekan või NocoDB; ükski ei dokumenteeri sisseehitatud tahvlit, mis käitab oma Workflow'sid, seisuga 20. juuli 2026. ²² n8n salvestab täitmise binaarandmeid sisemiselt (valikuliselt [S3-ühilduvas välises salvestusruumis](https://docs.n8n.io/hosting/scaling/external-storage/)), kuid ei dokumenteeri kasutajale nähtavat failiketta jagamislinkide või meeskonnaga jagamisega, seega on see märgitud piiratuks. Zapieri [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) töötleb faile ainult Zapi käivituse kestel ja [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) hoiab väikeseid tekstiväärtusi, seega on Zapier märgitud piiratuks. Make.com-i [andmehoidlad](https://help.make.com/l6du-data-stores) hoiavad struktureeritud kirjeid ja selle [failitöötlus](https://help.make.com/working-with-files) edastab faile rakenduste vahel ilma püsiva sisseehitatud salvestusruumita, seega on Make märgitud mitteolemasolevaks. ²³ Heymi [Playwright node](../nodes/playwright-node.md) on esimese osapoole brauseri automatiseerimine visuaalse sammurežiimiga, AI-genereeritud sammudega ja täiskoodi režiimiga. n8n pakub ainult kogukonna pakette nagu [n8n-playwright](https://github.com/toema/n8n-playwright) veel avatud [funktsioonisooviga natiivsete brauseri automatiseerimise node'ide jaoks](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), seega on see märgitud piiratuks. Zapier Agents suudab [lehti sirvida ja lugeda veebisirvimise ja Chrome'i laienduse kaudu](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), kuid Zapier ei dokumenteeri skriptitud brauseri automatiseerimise sammu, seega on see märgitud piiratuks. Make.com dokumenteerib HTTP mooduleid ja kolmandate osapoolte scraping rakendusi, mitte ühtegi natiivset brauseri automatiseerimise moodulit, seisuga 20. juuli 2026.

## Seotud

- [Sissejuhatus](./introduction.md) – Platvormi ülevaade
- [Kiire algus](./quick-start.md) – Ehitage oma esimene workflow
- [Workflow analüüs](../reference/workflow-analysis.md) – Genereerige jagatud käivituspõhiseid workflow aruandeid ja täiustamisettepanekuid
- [Dashboard vahekaart](../tabs/dashboard-tab.md) – Ehitage workflow-põhiseid dashboarde AI-genereeritud diagrammi vidinatega
- [Agent Node](../nodes/agent-node.md) – LLM node tööriistakutsete, MCP ja oskustega
- [Agendi arhitektuur](../reference/agent-architecture.md) – Alamagendid, orkestraator ja tööriistade suunamine
- [Board vahekaart](../tabs/board-tab.md) – Agentne Kanban tahvel workflow'd käivitavate veergudega
- [Codex Node](../nodes/codex-node.md) – Käivitage OpenAI Codex kodeerimisagent GitHubi repositooriumi vastu
- [OpenCode Go Node](../nodes/opencode-go-node.md) – Teenusepakkujast sõltumatu kodeerimisagent karastatud konteineris
- [Drive vahekaart](../tabs/drive-tab.md) – Sisseehitatud failihoidla jagamislinkide, meeskondade ja hulgioperatsioonidega
- [Playwright Node](../nodes/playwright-node.md) – Esmase osapoole brauseri automatiseerimine AI sammude ja koodirežiimiga
- [RAG / Vector Store Node](../nodes/rag-node.md) – Vektoriotsing ja dokumentide sisestamine (Qdrant või Postgres pgvector)
- [AI assistent](../reference/ai-assistant.md) – Loomuliku keele workflow ehitaja
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Agendi kontrollpunktid avalike ülevaatamis-URL-idega
- [Guardrails](../reference/guardrails.md) – Blokeerige ohtlikud prompt'id enne, kui need teie mudeliteni jõuavad
- [Traces vahekaart](../tabs/traces-tab.md) – LLM kutsete jälgitavus
- [Evals vahekaart](../tabs/evals-tab.md) – Testkomplektid AI workflow'dele
- [Alerts vahekaart](../tabs/alerts-tab.md) – Lävendipõhised hoiatused vigade, kestuse, kulude ja käivituste mahu kohta
- [OpenTelemetry jälgimine](../reference/opentelemetry.md) – Eksportige käivituste, node'ide ja tööriistade span'id üle OTLP
- [Koormuse jaotamine](../reference/cluster.md) – Jagage käivitusi instantside vahel koos leader failover'iga
- [Ühekordne sisselogimine](../reference/sso.md) – Logige sisse mis tahes OpenID Connect teenusepakkuja kaudu
- [Auditlogimine](../reference/audit.md) – Turvalisusega seotud toimingud koos tegija, sihtmärgi ja tulemusega
- [Portal](../reference/portal.md) – Avaldage workflow'sid avalike vestlusliidestena
- [Paralleelne täitmine](../reference/parallel-execution.md) – DAG-põhine samaaegne täitmine
- [MCP vahekaart](../tabs/mcp-tab.md) – MCP serveri ja kliendi konfiguratsioon
