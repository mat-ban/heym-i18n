# Heymi täielik funktsioonide kogum

Põhjalik ülevaade kõigist Heymi võimalustest. Iga jaotis kirjeldab funktsiooni või kontseptsiooni mõne lausega.

---

## Alustamine

### [Sissejuhatus](../getting-started/introduction.md)

Heym on taristu AI-agentide käitamiseks ja haldamiseks tootmiskeskkonnas. Agentpõhiseid süsteeme luuakse visuaalsel lõuendil ja käitatakse kindlustundega: orkestreerige agente, automatiseerige äriprotsesse, uurige iga käivitust ja hoidke inimkontroll oma taristul. See toetab visuaalseid workflow'sid, AI-toega sõlmi ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Assistant'i](./ai-assistant.md), integratsioone ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), sissetulevat [IMAP Trigger](../nodes/imap-trigger-node.md) e-posti, väljuvat [Send Email](../nodes/send-email-node.md)), ajastamist [Cron'iga](../nodes/cron-node.md) ja [Portal'i](./portal.md) chat-portaale lõppkasutajatele.

Vt ka [Põhikontseptsioonid](../getting-started/core-concepts.md), [Sõlmede tüübid](./node-types.md) ja [Kolmandate osapoolte integratsioonid](./integrations.md).

### [Miks Heym](../getting-started/why-heym.md)

Miks Heym lehekülg käsitleb agentide elutsüklit (loomine, orkestreerimine, käitamine, jälgimine, hindamine, kontrollimine, avalikustamine) ja näitab, mida üks isemajutatud runtime igas etapis haldab. See hõlmab [LLM](../nodes/llm-node.md) sõlme ja [Agent Node'i](../nodes/agent-node.md) koos tööriistade kutsumise, Python-tööriistade, [MCP](../tabs/mcp-tab.md) ühenduste, oskuste ja mitme agendi orkestreerimisega; triggereid, uuesti proovimisi ja [koormuse jaotamist](./cluster.md); [Traces'eid](../tabs/traces-tab.md) koos käivituse USD-kulu ja OpenTelemetry ekspordiga; [Hindamisi](../tabs/evals-tab.md); [inimülevaatuse kontrollpunkte](./human-in-the-loop.md), guardrails'e, SSO-d ja auditijälge; ning REST-, MCP- ja Portal-endpointe. Võrdlus n8n-i, Zapier'i ja Make.com-iga lõpetab lehekülje.

Vt ka [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) ja [Agendi arhitektuur](./agent-architecture.md).

### [Kiire algus](../getting-started/quick-start.md)

Pange oma esimene workflow käima mõne minutiga: looge workflow [Workflows](../tabs/workflows-tab.md) vahekaardil, lisage [Input](../nodes/input-node.md) sõlm, [LLM](../nodes/llm-node.md) sõlm ja [Output](../nodes/output-node.md) sõlm, seejärel ühendage need. Konfigureerige [LLM](../nodes/llm-node.md) mandaadiga ja määrake `userMessage` väärtuseks `$input.text`; kasutage Run'i või [AI Assistant'i](./ai-assistant.md), et workflow'sid käivitada või loomulikus keeles genereerida.

Sobib loomulikult kokku [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) ja [Expression DSL'iga](./expression-dsl.md).

### [Põhikontseptsioonid](../getting-started/core-concepts.md)

Workflow'd on suunatud graafid sõlmedest, mis on ühendatud servadega; käivitamine liigub trigger-sõlmedest ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) läbi töötlevate sõlmede [Output](../nodes/output-node.md) sõlmedeni. Igal sõlmel on tüüp, andmed (konfiguratsioon) ning sisendid/väljundid; servad määratlevad andmevoo. Sõlmed viitavad ülesvoolu andmetele [Expression DSL'i](./expression-dsl.md) avaldiste kaudu nagu `$nodeLabel.field`; sõltumatud sõlmed käivituvad automaatselt [paralleelselt](./parallel-execution.md).

Vt ka [Triggerid](./triggers.md), [Paralleelne käivitamine](./parallel-execution.md) ja [Workflow struktuur](./workflow-structure.md).

### [Käitamine ja juurutamine](../getting-started/running-and-deployment.md)

Heym pakub `run.sh`-i kohalikuks arenduseks (andmebaas Dockeris, FastAPI backend, Vite frontend) ja `deploy.sh`-i tootmiskeskkonnaks Docker Compose'iga. Mõlemad kasutavad `.env` faili; võtmemuutujate hulka kuuluvad `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` ja `ALLOW_REGISTER`. Arendus käivitub konfigureeritavatel frontend- ja backend-portidel; tootmiskeskkonnas serveeritakse API-t `/api` all frontend-konteineri kaudu.

Vt ka [Turvalisus](./security.md), [Enterprise](./enterprise.md) ja [Seaded](./user-settings.md).

### [Üleminek Heymile](../getting-started/migrate-to-heym.md)

AI Convert tööriist muudab workflow teiselt platvormilt (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) või lihtsas inglise keeles kirjelduse Heymi workflow'ks, mis voogedastatakse reaalajas lõuendile ja on valmis [allalaadimiseks ja importimiseks](./download-import.md). See käivitab AI turvakontrolli, seejärel genereerib DSL-i koos sisendi ja kiirusepiirangutega. Avage see aadressil [heym.run/convert](https://heym.run/convert).

Vt ka [Kiire algus](../getting-started/quick-start.md), [Allalaadimine ja importimine](./download-import.md) ja [AI Assistant](./ai-assistant.md).

---

## Sõlmed

### Triggerid
#### [Input](../nodes/input-node.md)

Input-sõlm on workflow'de sisendpunkt, mis võtab vastu andmeid kasutajalt või API-kutsujalt. See toetab üksikuid või mitut sisendvälja ning avalikustab päringu metaandmed (headers, query params). Juurdepääs body väljadele käib `$nodeLabel.body.fieldKey` kaudu, headers'itele `$nodeLabel.headers` kaudu ja query'le `$nodeLabel.query` kaudu.

Sobib loomulikult kokku [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) ja [Output](../nodes/output-node.md) sõlmedega. Payload'i viidete ja väljadele juurdepääsu kohta vaadake [Expression DSL](./expression-dsl.md) ja [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Cron-sõlm käivitab workflow'i ajakava alusel, kasutades standardset viieväljalist cron-avaldist. Kasutaja sisendit ei ole vaja—workflow käivitub automaatselt määratud aegadel (nt iga tund, iga päev, iga 15 minuti järel). Väljundiks on trigger-sündmus ilma payload'ita.

Vaadake ka [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) ja [Execution History](./execution-history.md) ajastatud ja viivitatud käivituste kohta.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

IMAP Trigger-sõlm küsib postkasti reguleeritava minutite intervalliga ja käivitab workflow'i iga vastuvõetud e-kirja kohta. See väljastab parsitud headers'id, saatja ja saajate loendid, plain-text ja HTML body'd, manuste metaandmed ning trigger'i ajatempli. Kasutage seda tugipostkasti triaažiks, postkastist [Slack](../nodes/slack-node.md)i suunamiseks või e-kirjapõhisteks kinnitusevoogudeks koos [Human-in-the-Loop](./human-in-the-loop.md)iga.

Sobib kokku [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) ja [Slack](../nodes/slack-node.md) sõlmedega sissetuleva triaaži ja vastusevoogude jaoks.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Heym Trigger-sõlm käivitab workflow'i, kui Heym ise avaldab platvormi sündmuse: `heym.started`, `workflow.created`, `workflow.updated` või `workflow.deleted`. Kohaletoimetamine on partiidena—iga sündmus, mis avaldatakse ühe viiesekundilise saatmisakna jooksul, saabub ühe käivitusena kujul `$nodeLabel.events`, alati massiivina. Iga sündmus võetakse vastu unikaalse andmebaasipiirangu kaudu, seega see käivitub täpselt üks kord iga telliva sõlme kohta, olenemata sellest, kui palju töötajaid, konteinereid või masinaid töötab. Kasutage seda workflow'de muudatuste auditijälgede, juurutusteatedete ja instantsi tervise kokkuvõtete jaoks.

Sobib kokku [Heym](../nodes/heym-node.md) sõlmega muudetud workflow'i otsimiseks ja [Loop](../nodes/loop-node.md)iga, et tegutseda üks kord iga sündmuse kohta.

#### [Heym](../nodes/heym-node.md)

Heym-sõlm loeb Heymi enda andmeid kolme operatsiooni kaudu: `listWorkflows` tagastab iga workflow'i, millele omanik ligi pääseb, koos sõlmede arvude ja ajatemplitega, `getWorkflow` tagastab ühe workflow'i sõlmede ja servade struktuuri ning `getExecutionHistory` tagastab käivituste ajaloo kirjed uusimast vanimani koos valikuliste staatuse-, ajavahemiku- ja limiidifiltritega, lisaks staatuseti rühmitatud kogusummad. Tulemused on piiratud selle workflow'i omanikuga, milles sõlm asub, seega cron'i, portaali või sündmuse käivitatud käivitus tagastab samad andmed nagu käsitsi käivitus. `getWorkflow` tagastab täieliku sõlme konfiguratsiooni, mis teeb võimalikuks workflow'i auditeerimise kõvakodeeritud võtmete või tokenite osas; see ei avalda midagi, mida workflow'i omanik ei saaks juba redaktoris avada. Mandaati ei ole vaja.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

WebSocket Trigger-sõlm avab väljamineva kliendiühenduse välisele WebSocket-serverile ja käivitab workflow'i sündmustel `onMessage`, `onConnected` või `onClosed`. See avalikustab parsitud sõnumi payload'id, taasühenduse oleku, sulgemise metaandmed ja socketi URL-i allavoolu avaldiste jaoks.

Sobib kokku [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) ja [SSE Streaming](./sse-streaming.md)iga reaalaja integratsioonide jaoks.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Telegram Trigger-sõlm võtab vastu boti webhooki uuendusi ja käivitab workflow'i kohe. See avalikustab täieliku uuenduse payload'i, peamise sõnumiobjekti, callback query'd, puhastatud headers'id ja trigger'i ajatempli. Kasutage seda vestlusbotide, AI-assistentide jaoks [Telegram](../nodes/telegram-node.md)is ja nupupõhiste voogude jaoks.

Sobib kokku [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) ja [Webhooks](./webhooks.md)iga botipõhiste workflow'de jaoks.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Slack Trigger-sõlm võtab vastu Slack Events API webhooke ja käivitab workflow'i automaatselt pärast päringu allkirja kontrollimist. See avalikustab sündmuse payload'i ja puhastatud headers'id allavoolu suunamise, [LLM](../nodes/llm-node.md)-põhise klassifitseerimise ja vastusevoogude jaoks.

Sobib kokku [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) ja [Third-Party Integrations](./integrations.md)iga.

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Discord Trigger-sõlm võtab vastu Discord Interactions API webhooke, kontrollib Ed25519 allkirju valitud `discord_trigger` mandaadiga ja käivitab workflow'i. See avalikustab täieliku interaktsiooni payload'i, käsudata, puhastatud headers'id ja trigger'i metaandmed allavoolu suunamise või vastuste jaoks.

Sobib kokku [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) ja [Third-Party Integrations](./integrations.md)iga.
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ sõlm saadab või võtab vastu sõnumeid RabbitMQ järjekordadest ja exchange'idest. Kasutage seda sõnumipõhiste workflow'de ja sündmuste töötlemise jaoks. Saatmise režiim avaldab sõnumi valikulise viivitusega; vastuvõtmise režiim toimib [triggerina](./triggers.md), nii et workflow käivitub, kui sõnum saabub. Väljund sisaldab staatust, message_id-d ja body't.

Sobib kokku [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) ja [Parallel Execution](./parallel-execution.md) sõlmega sündmuspõhiseks töötlemiseks.

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler sõlm käivitub automaatselt, kui mis tahes sõlm workflow's ebaõnnestub. Sissetulevaid ühendusi pole vaja; selle käivitab mootor. Väljund sisaldab veateadet, ebaõnnestunud sõlme silti, sõlme tüüpi ja ajatemplit. Kasutage seda teavituste saatmiseks [Slacki](../nodes/slack-node.md), [Telegrami](../nodes/telegram-node.md) või [Send Emaili](../nodes/send-email-node.md) kaudu, vigade logimiseks või kohandatud veavastuste tagastamiseks.

Alternatiivina vigade käsitlemisele lõuendil saab workflow delegeerida tõrked ka eraldi workflow'le — vt [Error Workflow](#error-workflow). Kui lõuend sisaldab juba Error Handler sõlme, siis error workflow'i **ei** kutsuta (kohalik handler on ülimuslik).

Levinumad teavituste sihtmärgid on [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) ja [Send Email](../nodes/send-email-node.md); käivituse üksikasju on lihtsam uurida jaotises [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent sõlm on [LLM](../nodes/llm-node.md) sõlm koos tool calling'uga. See suudab käivitada Python tööriistu, kutsuda ühendatud lõuendi sõlmi tööriistadena, ühenduda [MCP](../tabs/mcp-tab.md) serveritega, kasutada oskusi (juhiste failid ja valikulised Python skriptid), toimida orkestraatorina, mis delegeerib teistele agent sõlmedele, ning kutsuda teisi workflow'sid tööriistadena. Väljund on saadaval kujul `$nodeLabel.text`. Valikuline **Extra Body** lüliti lisab igale päringule tool-calling tsüklis JSON-objekti teenusepakkuja-spetsiifiliste päringuparameetritega; see on vaikimisi välja lülitatud. Valikuline **Use Responses API** lüliti suunab agendi mudelikutsed läbi Responses API, mis säilitab mudeli arutluskäigu tool callide vahel, nii et arutlusmudel hoiab oma mõtteahelat mitmeastmelises tsüklis; see on vaikimisi välja lülitatud ja töötab OpenAI ja kohandatud mandaatidega.

Lõuendi sõlme tööriistad võimaldavad agendil kutsuda konfigureeritud workflow sõlmi otse lõuendilt. Ühendage toetatud sõlm agendi tööriistade handle'iga, seejärel märkige konkreetsed väljad agendi poolt pakutavateks bot-ikooniga. Need väljad muutuvad käitusajal tööriista parameetriteks, samas kui mandaadid ja märgistamata väljad jäävad sõlme konfiguratsioonis fikseerituks.

Oskuste jaotis sisaldab nüüd **AI Build** funktsiooni uute oskuste loomiseks, inline AI redigeerimise toimingut olemasolevate oskuste jaoks, oskusepõhist ZIP allalaadimist ja valikulist **Enable Drive files** lülitit oskuste jaoks, mis vajavad käitusajal Heym Drive failide lugemist. Skill Builder modaal voogedastab vestlust vasakul, võtab vastu drag-and-drop faile iga peenhäälestuse kommentaariga, näitab paremal genereeritud `SKILL.md` ja `.py` failide reaalajas kirjutuskaitstud eelvaadet, suudab selle eelvaate ZIP-ina alla laadida ja salvestab üleslaaditud peenhäälestusfailid tagasi komplekteeritud oskuse varadena sama ZIP-i importimise voo kaudu, mida kasutatakse käsitsi üleslaadimisel.

Kui **[Agent Persistent Memory](./agent-persistent-memory.md)** on lubatud, hoiab iga agent sõlm oma teadmiste graafi: faktid laaditakse süsteemi prompti, kui need pole tühjad, ja edukad käivitused käivitavad taustal uute olemite ja seoste ühendamise. Alam-agendid kasutavad eraldi graafe. Saate agendi graafi **jagada** teiste agentidega (samas või teises workflow's) kirjutuskaitstud või lugemis-/kirjutamisõigusega graafi dialoogist. Lõuendi brain control avab graafi redaktori.

Agent sõlmed võivad samuti lülituda [Human-in-the-Loop](./human-in-the-loop.md) režiimi. Selles režiimis saab agent `request_human_review` tööriista ja suudab peatuda konkreetsetes kinnitust nõudvates sammudes, luua ühekordse avaliku ülevaatamise lingi, paljastada `review` lõuendi haru teavituste voogude jaoks ja oodata, kuni ülevaataja aktsepteerib, redigeerib või keeldub Markdown ülevaatamise tekstist. Sõlme HITL väli toimib kinnituse juhistena, millal küsida, samas kui ülevaatajale suunatud kokkuvõte genereeritakse igast ülevaatamise taotlusest. [MCP](../tabs/mcp-tab.md) tööriistade puhul kasutab Heym mudelit nende kirjalike juhiste tõlgendamiseks väärtusteks `always`, `once` või `never`, nii et vabas vormis kinnituse keel kaardistub konkreetseks käitusaja poliitikaks. Käivitus märgitakse olekusse `pending` ja jätkub salvestatud käivituse hetktõmmisest pärast otsuse saabumist ning sama agent käivitus võib peatuda rohkem kui üks kord, kui hilisemad sammud nõuavad samuti ülevaatamist.

Agent sõlmed pakivad automaatselt oma kogunenud sõnumiajaloo kokku, kui see läheneb 80%-le mudeli kontekstiaknast. Süsteemi prompt, esimene kasutaja sõnum ja kõige värskem kasutaja sõnum säilitatakse alati; kõik nende vahepealne võetakse kokku sama mudeli ja mandaadi abil. Pakkimise sündmused on nähtavad Debug paneelis, [Execution History](./execution-history.md) vaates ja [Traces](../tabs/traces-tab.md) vahekaardil.

Vt ka [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) ja [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Codex node käivitab OpenAI Codex CLI isoleeritud Heymi tööruumis. See võtab vastu Codexi mandaadi (logige sisse ChatGPT-ga, et kasutada oma tellimust ilma tokenipõhiste API-kuludeta, või kleepige juurdepääsu token), GitHubi mandaadi, hoidla URL-i, baasharu, ülesande prompti, avaldamisrežiimi (`diff_only` või `draft_pr`), haru nime ja ajalõpu. Käivitaja kloonib hoidla lokaalselt, edastab ChatGPT tokenikomplekti või `CODEX_ACCESS_TOKEN` ainult Codexi protsessile ning tagastab struktureeritud kokkuvõtte, valideerimismärkused, muudetud failid, diffi, kasutusmetaandmed ja valikulise draft PR URL-i.

Kui Codex tagastab `needs_input`, peatub workflow ja avaldub `question` haru. Ühendage see haru Slacki, e-posti või muu teavitusnode'iga; avalik järelmeetme link jätkab salvestatud käivituse hetktõmmise pärast vastuse esitamist. Codex node'i saab siduda ka AI Agentiga tööriistana, võimaldades agentil kodeerimisülesandeid delegeerida; tööriistana tagastatakse `needs_input` tulemus agentile reasiseselt, mitte ei peatata workflow'd.

Vt ka [GitHub](../nodes/github-node.md), [Mandaadid](./credentials.md), [Mandaatide jagamine](./credentials-sharing.md) ja [Node'i tüübid](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go node käivitab OpenCode CLI (Go) GitHubi hoidla vastu. Isolatsioon järgib Codexi mustrit: lokaalselt töötab see hosti alamprotsessina, samas kui Dockeri juurutused käivitavad selle karastatud õvekonteineris, mis jagab tööruumi mahtu. See võtab vastu OpenCode Go mandaadi (lüüsi API võti valikulise baas-URL-iga), GitHubi mandaadi, hoidla URL-i, baasharu, ülesande prompti, avaldamisrežiimi, haru nime, ajalõpu ja `opencode-go/<model>` mudeli, mis on valitud reaalajas otsitavast mudelite loendist (sisseehitatud varuvariandiga). Heym teostab kõik git/GitHubi toimingud hostis ega paiguta GitHubi tokenit kunagi liivakasti; OpenCode muudab ainult faile kettal. Node tagastab struktureeritud kokkuvõtte, valideerimismärkused, muudetud failid, diffi ja valikulise pull request URL-i. Seda saab siduda AI Agentiga tööriistana.

Vt ka [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Mandaadid](./credentials.md), [Mandaatide jagamine](./credentials-sharing.md) ja [Node'i tüübid](./node-types.md).

#### [LLM](../nodes/llm-node.md)

LLM node töötleb teksti keelemudeliga või genereerib pilte. See toetab tekstigeneratsiooni, nägemist (pildi sisend), pildigeneratsiooni, struktureeritud JSON väljundit, teenusepakkuja natiivset Batch API täitmist toetatud OpenAI ja OpenAI-ga ühilduvate endpointide jaoks ning valikulist **Use Responses API** lülitit, mis suunab kõne Responses API kaudu Chat Completionsi asemel (vaikimisi väljas; töötab OpenAI ja kohandatud mandaatidega ning seda ei saa kombineerida Batch režiimiga). Konfigureerige mandaat, mudel, süsteemi- ja kasutajateated, temperatuur ja maksimaalsed tokenid; kasutage promptides [Expression DSL-i](./expression-dsl.md). Batch režiimis peab `userMessage` lahenema massiiviks, node väljastab `batchStatus` haru edenemise värskendustega ning lõplik väljund sisaldab üksuse kaupa batch tulemusi. Valikuline **Extra Body** lüliti lisab igale API-kõnele JSON-objekti teenusepakkuja spetsiifiliste päringuparameetritega (näiteks `{"thinking": {"type": "disabled"}}`); see on vaikimisi väljas. Valikulised [Guardrails](./guardrails.md) blokeerivad ebaturvalise sisu enne kõnet.

Sobib loomulikult kokku [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) ja [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Decision node esitab otsustusmudelile trükitud küsimusi käivituse oleku kohta ja tagastab proosa asemel tõenäosused. **State** väli kannab seda, mida mudel peaks lugema — üksik avaldis säilitab oma tüübi, seega `$input` saadab objekti, mitte selle teksti — ja küsimuste loend kannab hinnanguid. Küsimused esinevad kolmes vormis: **noul** vastab, kas tingimus kehtib, **choice** valib ühe valiku teie määratud hulgast ja tagastab täieliku jaotuse ning **score** hindab olekut järjestatud tasemetel ja võib langeda nende vahele. Choice ja score vastused kannavad ka kindlustunnet, seega [Switch](../nodes/switch-node.md) saab marsruutida vastuse järgi, samas kui [Condition](../nodes/condition-node.md) väravdab selle järgi, kui kindel see oli. **Generate with AI** koostab oleku malli ja küsimuste read lihtsast lausest ning **Custom request body** saadab käsitsi kirjutatud JSON-i endpointile, mille leping erineb. Teenusepakkuja vastus edastatakse muutmata kujul ja iga kõne salvestatakse [Käivitustesse](../tabs/traces-tab.md).

Vajab Decision Model mandaati; sobib loomulikult kokku [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) ja [Agent Node](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

RAG / Vector Store node lisab, uuendab (upsert), kustutab ja otsib dokumente vektorhoidlas, et toetada otsingupõhist genereerimist (retrieval-augmented generation). Andmebaasi rippmenüü valib taustsüsteemi — **Qdrant** (väline server) või **Postgres (pgvector)** (Heymi enda andmebaas, välist teenust pole vaja) — vaikeväärtusega Qdrant. Valige vektorhoidla vahekaardilt [Vectorstores](../tabs/vectorstores-tab.md) ja määrake toiminguks insert, upsert, delete või search. Upsert ja delete adresseerivad dokumenti unikaalse id järgi, mis on salvestatud payload'i sees — **Document ID Field** määrab selle välja nime (vaikimisi `doc_id`) ja **Document ID** kannab selle väärtust — nii säilitab dokument id, mida teie enda süsteem juba kasutab: upsert asendab kõik vastavad punktid enne uue versiooni salvestamist ning delete teatab, kas midagi vastas. Dokumendi metaandmed lubavad väärtustes avaldisi, seega `{"url": "$start.url"}` salvestab selle, mille käivitus tekitas. Search toetab metaandmete filtreid, valikulist **Hybrid Search** otsingut (vektorite sarnasus kombineeritud BM25 märksõnade sobitamisega, nii et täpsed terminid, nagu ID-d ja veakoodid, leitakse semantiliste vastete kõrval) ja valikulist Cohere ümberjärjestamist (reranking), tagastades tulemuste massiivi väljadega text, score, metadata, lipud reranked ja hybrid ning count, mida saab kasutada [LLM](../nodes/llm-node.md) või [Agent Node](../nodes/agent-node.md) voogudes.

Levinumad järgnevad sõlmed on [LLM](../nodes/llm-node.md) ja [Agent Node](../nodes/agent-node.md); vektorhoidla seadistamine asub vahekaardil [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

MCP Call node kutsub konkreetset [MCP](../tabs/mcp-tab.md) tööriista otse, ilma et LLM otsustaks, millist tööriista kasutada. Kasutage seda, kui teate täpselt, millist tööriista disaini ajal käivitada — deterministlikuks üheastmeliseks MCP tööriista täitmiseks workflow's. Konfigureerige ühendus (SSE, Streamable HTTP või stdio; samad väljad nagu [Agent Node](../nodes/agent-node.md) MCP ühendusel), klõpsake **Fetch Tools**, et täita rippmenüü, valige tööriist ja täitke argumendi väljad, mis renderdatakse automaatselt tööriista sisendskeemist. Iga argument võtab vastu staatilise väärtuse või [DSL avaldise](./expression-dsl.md), näiteks `$userInput.body.text`. Tulemus on saadaval kujul `$nodeLabel.result` (JSON objekt, kui parsitav, vastasel juhul string). MCP Call node'i ei saa lõuendil tööriistana ühendada [Agent Node](../nodes/agent-node.md)-iga.

Vt ka [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) ja [Expression DSL](./expression-dsl.md).

### Loogika

#### [Condition](../nodes/condition-node.md)

Condition node hargneb workflow'd if/else avaldise põhjal. Sellel on kaks väljundkäepidet: üks tõese (truthy) tingimuse jaoks ja üks väärale (falsy). Kasutage tingimuse avaldises [Expression DSL](./expression-dsl.md) võrdlus- ja loogikaoperaatoreid; node edastab sisendi valitud harule.

Vt ka [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) ja [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Switch node suunab täitmise erinevatele teedele, sobitades väärtust juhtumitega (cases). Konfigureerige hinnatav avaldis ja juhtumite väärtuste loend; iga juhtum saab allika käepideme ja vaikekäepidet kasutatakse mittevastavate väärtuste jaoks. Sisend edastatakse sobitatud harule.

Kasutage binaarseks hargnemiseks [Condition](../nodes/condition-node.md) ja suunatud teede taasühendamiseks [Merge](../nodes/merge-node.md); sobitamise reeglid on kirjeldatud jaotises [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Merge node ootab mitut paralleelset sisendit ja ühendab need üheks väljundiks. Määrake oodatavate sisendite arv; node loob ühendatud objekti, kui kõik harud on lõpetanud. Kasutage seda paralleelsete harude tulemuste ühendamiseks enne jätkamist; ärge kasutage seda, kui paralleelsed harud lõpevad eraldi Output node'idega.

Vt ka [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) ja [Output](../nodes/output-node.md) harude taasühendamisel.

#### [Loop](../nodes/loop-node.md)

Loop node itereerib üle massiivi, täites iga üksuse jaoks järgnevaid node'e. See nõuab tagasiühendust iteratsiooni keha viimasest node'ist, et edasi liikuda. Loop'i keha sees kasutage `item`, `index`, `total`, `isFirst` ja `isLast`; loop'il on eraldi väljundid iteratsioonitee ja lõpetamistee (done) jaoks.

Sobib kokku [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) ja [Expression DSL](./expression-dsl.md) iteratiivsete workflow'de jaoks.

### Andmed

#### [Set](../nodes/set-node.md)

Set node teisendab ja kaardistab sisendandmed kohandatud väljundiks. Määratlege võti-väärtus kaardistused, kus iga väärtus on [Expression DSL](./expression-dsl.md) avaldis. Kasutage seda suurtähtede, alamstringide, konkatenatsiooni, juhuslike arvude ja sarnaste teisenduste jaoks. Juurdepääs väljundile võtme järgi (nt `$setNode.keyName`). Kui node on agendiga ühendatud lõuendi node'i tööriistana, saab kaardistuse väärtusi märkida agendi poolt esitatavateks, et agent täidaks need käitusajal. Teiste workflow'de kutsumiseks kasutage hoopis [Execute](../nodes/execute-node.md) node'i.

Vt ka [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) ja [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Converter-node teisendab andmeid formaatide vahel ilma koodi kirjutamata. Teksti teisendused on `csvToJson` (CSV-tekst reaobjektide massiiviks või massiivideks, kui päist pole), `jsonToCsv` (objektide/ridade massiiv CSV-tekstiks), `xmlToJson` (XML-tekst objektiks) ja `jsonToXml` (objekt XML-tekstiks). Konfigureerige teisenduse suund ja lähteavaldise; CSV-teisendused kasutavad lisaks eraldajat ja päise käsitlemist ning `jsonToCsv` saab määrata kindla veerujärjestuse. Jutumärgid, manustatud eraldajad ja manustatud reavahetused järgivad RFC 4180. XML-atribuudid kasutavad eesliidet `@`, atribuutidega segatud tekst kasutab `#text`, korduvad elemendid muutuvad massiivideks ning XML-üksuste laiendamine on keelatud. Sama node töötab ka salvestatud failidega. `imageToText` ja `pdfToText` käivitavad Tesseract OCR-i, lugedes faili Heym Drive'ist (`$Upload.file.id` File upload triggerist, Drive node'i tulemusest või agendi genereeritud failist), valides keele automaatselt tuvastatud kirjaviisist või kasutades teie määratud koode nagu `tur` või `eng+tur`, ning normaliseerides teksti vaikimisi UTF-8-sse, valikulise NFC-normaliseerimise ja kitsamate kooditabelitega nagu `cp1254`. `fileConvert` kirjutab salvestatud faili teises formaadis ümber, dokumente pandoc'i ja pilte Pillow kaudu, ning salvestab tulemuse uue Drive-failina, puutumata originaali. Tulemus on saadaval kujul `$converterNode.result`, mille kõrval on OCR-käivituste puhul `.language`, `.encoding`, `.page_count`, `.pages` ja `.file` ning `fileConvert`-i puhul `.id`, `.filename` ja `.download_url`.

Vt ka [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) ja [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Code-node käivitab teie kirjutatud Pythoni koodi koos oma `requirements.txt`-iga konteineris, mis luuakse ja hävitatakse iga käivituse jaoks. Teie kood defineerib funktsiooni `main(params)` ja tagastab mis tahes JSON-serialiseeritava väärtuse, millest saab `$codeNode.result`; kõik, mida see välja prindib, salvestatakse eraldi kujul `$codeNode.logs`, ja `$codeNode.install` teatab, milline tööriist sõltuvused paigaldas. Parameetrid konfigureeritakse JSON-objektina, mille `$`-avaldised lahendatakse enne käivitust, ning kood loeb neid punktnotatsiooniga nagu `params.user.name` või `params.orders[0].id`. Sõltuvused paigaldatakse `uv`-ga, langedes tagasi `pip`-ile pakettide puhul, mida `uv` ei suuda käsitleda, ilma vahemällu salvestamiseta käivituste vahel; `requirements.txt` tühjaks jätmine jätab paigalduse täielikult vahele ja on palju kiirem. Käivitusfaasil puudub võrguühendus, välja arvatud juhul, kui `codeAllowNetwork` on sisse lülitatud, samas kui sõltuvuste paigaldus jõuab alati PyPI-sse. Sandbox töötab mitte-root-kasutajana, kõik võimekused on eemaldatud, juurfailisüsteem on kirjutuskaitstud, Dockeri socket puudub ja puudub juurdepääs backend'i saladustele, piiratud 512 MB mäluga, ühe CPU-ga, 256 protsessiga, 120-sekundilise paigalduse ja 60-sekundilise käivitusega. Docker on nõutav ja tagasilangusrežiimi pole: ilma kättesaadava daemonita node ebaõnnestub, selle asemel et käivitada teie kood backend'i protsessis.

#### [Variable](../nodes/variable-node.md)

Variable-node määrab või uuendab workflow-lokaalset muutujat (`$vars.variableName`) või püsivat [globaalset muutujat](./global-variables.md) (`$global.variableName`). Kasutage seda loendurite, kogutud loendite ja jagatud oleku jaoks. Konfigureerige muutuja nimi, väärtuse avaldis, tüübi teisendamine ja kas salvestada globaalsesse hoidlasse. Massiivi muutujad toetavad `$array()` ja `.add()`.

Sobib kokku [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) ja [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Execute-node kutsub välja teise workflow (alam-workflow) ja edastab sellele sisendi. Määrake siht-workflow ID järgi ja esitage sisend kas ühe avaldisena või võti-väärtus vastendustena. Väljund sisaldab workflow_id, status ja outputs; kasutage seda korduvkasutatava loogika jaoks, mitte andmete teisendamiseks (selleks kasutage Set-i).

Vt ka [Canvas Features](./canvas-features.md) jaotist Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) ja [Output](../nodes/output-node.md).

### Integratsioonid

#### [HTTP](../nodes/http-node.md)

HTTP-node teeb HTTP-päringuid cURL-stiilis konfiguratsiooni abil. See võib olla workflow alguspunkt (ilma sissetuleva servata) või võtta vastu sisendit ülemvoolu node'idelt. Vastus on saadaval kujul status, headers ja body (parsitud JSON, kui asjakohane). Kasutage Bearer- või kohandatud päise autentimiseks [Credentials](./credentials.md).

Sobib kokku [Webhooks](./webhooks.md), [Credentials](./credentials.md) ja [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

WebSocket Send-node avab väljamineva kliendiühenduse, saadab ühe tekst-/JSON-/binaarse sõnumi ja sulgeb selle. Kasutage seda workflow väljundi avaldamiseks reaalajas süsteemidesse ilma Heym-hostitud socket-endpointi loomata.

Vt ka [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) ja [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Telegrami node saadab boti sõnumi chat'i, gruppi või kanalisse. Konfigureerige Telegrami [mandaat](./credentials.md), määrake `chatId` ja koostage väljuv `message` kasutades [Expression DSL](./expression-dsl.md) avaldisi. See sobib loomulikult kokku [Telegram Triggeriga](../nodes/telegram-trigger-node.md) vestluslike workflow'de jaoks ja [Error Handleriga](../nodes/error-handler-node.md) operaatorite teavituste jaoks.

Vt ka [Third-Party Integrations](./integrations.md) ja [Mandaadid](./credentials.md) seadistamise ja mandaatide mustrite kohta.

#### [Slack](../nodes/slack-node.md)

Slacki node saadab sõnumi Slacki kanalisse Incoming Webhooki kaudu. Konfigureerige Slacki [mandaat](./credentials.md) ja sõnumi avaldis. Kasutage seda teavituste, hoiatuste ja vigade raporteerimise jaoks; väljund läbib sisendi.

Sobib kokku [Slack Triggeriga](../nodes/slack-trigger-node.md), [Error Handleriga](../nodes/error-handler-node.md) ja [Third-Party Integrationsiga](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Discordi node saadab sõnumi Discordi kanalisse Incoming Webhooki kaudu. Konfigureerige Discordi [mandaat](./credentials.md), koostage väljuv sõnum [Expression DSL](./expression-dsl.md) abil ja valikuliselt määrake webhooki kasutajanime või avatari ülekirjutused.

Sobib kokku [Discord Triggeriga](../nodes/discord-trigger-node.md), [Outputiga](../nodes/output-node.md), [Error Handleriga](../nodes/error-handler-node.md) ja [Third-Party Integrationsiga](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Send Email node saadab e-kirju SMTP kaudu. Konfigureerige SMTP [mandaat](./credentials.md) ja [Expression DSL](./expression-dsl.md) avaldised saaja(te), teema ja sisu jaoks. Kasutage seda teavituste, hoiatuste ja tehinguliste e-kirjade jaoks. Väljund sisaldab staatust, saajat ja teemat.

[IMAP Trigger](../nodes/imap-trigger-node.md) täiendab Send Emaili, käsitledes sissetulevat posti. Koos võimaldavad need workflow'l lugeda sissetulevat e-kirja jagatud postkastist, teha selle kokkuvõtte või klassifitseerida seda AI node'idega ning saata järelmeetme- või eskaleerimissõnumi. [Telegram Trigger](../nodes/telegram-trigger-node.md) ja [Telegrami node](../nodes/telegram-node.md) pakuvad sama sissetuleva/väljuva mustrit botipõhiste chat-workflow'de jaoks.

Kahesuunaliste teavituste voogude jaoks sobib see hästi ka kokku [LLM-iga](../nodes/llm-node.md), [Agent Node'iga](../nodes/agent-node.md) ja [Third-Party Integrationsiga](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Redis node teostab Redise operatsioone: set, get, hasKey ja deleteKey. Kasutage seda vahemällu salvestamise, kiirusepiirangu ja võti-väärtus salvestuse jaoks. Konfigureerige [mandaat](./credentials.md), operatsiooni tüüp, võtme avaldis ning set-operatsioonide jaoks väärtus ja valikuline TTL. Väljund varieerub sõltuvalt operatsioonist (value, success, exists, deleted).

Sobib kokku [Waitiga](../nodes/wait-node.md), [Variable'iga](../nodes/variable-node.md) ja [Parallel Executioniga](./parallel-execution.md) vahemällu salvestamise, piiramise ja koordineerimise jaoks.

#### [Grist](../nodes/grist-node.md)

Grist node loeb, kirjutab ja haldab andmeid Gristi arvutustabelites. Operatsioonid hõlmavad getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables ja listColumns. Esitage dokumendi ID, tabeli ID ning create/update puhul kirje andmed veergude ID-de abil. Kasutage seda CRUD-i, partiivärskenduste ja arvutustabelite automatiseerimise jaoks.

Vt ka [Google Sheetsi](../nodes/google-sheets-node.md), [DataTable'i](../nodes/datatable-node.md) ja [Third-Party Integrationsi](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheetsi node loeb, kirjutab ja haldab arvutustabeli andmeid OAuth2 kaudu. Kasutage seda aruannete lugemiseks, workflow' tulemuste lisamiseks, jälgijate värskendamiseks ning lehtede tühjendamiseks või kontrollimiseks workflow' sees. Nagu [BigQuery](../nodes/bigquery-node.md), kasutab see Google'i toega integratsiooni mandaati ja sobib hästi [Gristi](../nodes/grist-node.md) kõrvale, kui arvutustabeli andmed on voo osa.

Sobib kokku [Gristiga](../nodes/grist-node.md), [DataTable'iga](../nodes/datatable-node.md) ja [Third-Party Integrationsiga](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery node käivitab SQL-päringuid ja lisab ridu Google BigQuery andmekogumitesse OAuth2 kaudu. See on kasulik analüütika workflow'de, aruandluse torustike ja workflow' käivituste struktureeritud sündmuste andmete kirjutamise jaoks. Sageli sobib see kokku [Setiga](../nodes/set-node.md) ridade kujundamiseks ja [Google Sheetsiga](../nodes/google-sheets-node.md) kergema arvutustabelipõhise aruandluse jaoks.

Sobib kokku [Setiga](../nodes/set-node.md), [LLM-iga](../nodes/llm-node.md), [Google Sheetsiga](../nodes/google-sheets-node.md) ja [Third-Party Integrationsiga](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive'i node loetleb, laadib alla, uuendab ja kustutab Drive'i faile ning kaustu OAuth2 kaudu ning suudab kopeerida Drive'i faili otse [Heym Drive'i](../nodes/drive-node.md) selle `syncToHeymDrive` operatsiooniga. Google Docs, Sheets ja Slides ei oma allalaaditavaid baite, seega node ekspordib need automaatselt — Docs PDF-iks, Sheets XLSX-iks, Slides PPTX-iks — koos sihtvormingu ülekirjutamise võimalusega. Kustutamised viivad üksused Drive'i prügikasti, välja arvatud juhul, kui "Delete permanently" on lubatud, ning node keeldub kustutamast kausta failioperatsiooni kaudu või vastupidi. Nagu [Google Sheets](../nodes/google-sheets-node.md), kasutab see Google'i poolt toetatud OAuth2 mandaati; pange tähele, et see taotleb täielikku Drive'i juurdepääsu, seega vaadake enne selle jagamist üle [Mandaatide jagamine](./credentials-sharing.md).

Sobib kokku [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) ja [Kolmandate osapoolte integratsioonidega](./integrations.md).

#### [GitHub](../nodes/github-node.md)

GitHub node pakub 40 natiivset GitHub REST tegevust, mis katavad hoidlaid, organisatsioone ja kasutajaid, issuesid, pull request'e, ülevaatusi, väljalaskeid, Actions workflow'sid, liikluse ülevaateid ja hoidla faile. Kasutage seda issue'de triaažiks, ülevaatuste automatiseerimiseks, workflow'de käivitamiseks ja lõpetamise ootamiseks, väljalaske automatiseerimiseks ning hoidla failide uuendamiseks ilma käsitsi HTTP-päringute koostamiseta. See toetab GitHub.com'i ja valikulist GitHub Enterprise `base_url`-i mandaadil.

Sobib kokku [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) ja [Kolmandate osapoolte integratsioonidega](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Jira node ühendab workflow'd Jira Cloud'i või Jira Data Center / Server REST API-dega projektide, issue'de, kommentaaride, manuste, kasutajate, teavituste ja üleminekute automatiseerimiseks. See suudab loetleda projekte, otsida issue'sid JQL-iga, luua või uuendada issue'sid, uurida muudatuste logisid, teavitada huvirühmi, hallata kommentaare ja manuseid, hankida või hallata kasutajaid, loetleda saadaolevaid üleminekuid ning liigutada issue'sid ülemineku ID kaudu. Kasutage Jira mandaati koos Atlassiani e-posti, API tokeni, saidi baas-URL-i ja juurutusrežiimiga.

Sobib kokku [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) ja [Kolmandate osapoolte integratsioonidega](./integrations.md) toe vastuvõtu, vigade triaaži ja väljalaske workflow'de jaoks.

#### [Linear](../nodes/linear-node.md)

Linear node ühendab workflow'd Linear'i GraphQL API-ga tööruumi ja issue'de automatiseerimiseks. See suudab loetleda meeskondi, projekte, issue'sid, workflow' olekuid, meeskonnaliikmeid ja kommentaare; luua, uuendada, kustutada ja linkida issue'sid; ning luua, uuendada, lahendada, lahendamata jätta või kustutada kommentaare. Kasutage Linear'i isiklikku API võtit või OAuth2 mandaati, seejärel avastage meeskonna, projekti, oleku ja määratud isiku UUID-d loendioperatsioonide kaudu enne issue'de loomist või uuendamist.

Sobib kokku [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) ja [Kolmandate osapoolte integratsioonidega](./integrations.md) vastuvõtu, triaaži ja inseneride töödejärjekorra workflow'de jaoks.

#### [Supabase](../nodes/supabase-node.md)

Supabase node loeb ja muudab tabeleid, mis on avatud Supabase PostgREST kaudu. See sobib hästi toote taustarakendustele, kasutaja/profiili andmetele, workflow' olekule ja CRUD-stiilis automatiseerimistele, mis soovivad andmebaasi juurdepääsu ilma kohandatud HTTP-päringute ühendamiseta.

Sobib kokku [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) ja [Kolmandate osapoolte integratsioonidega](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse node käitab CRUD-, loendus- ja toor-SQL operatsioone välise ClickHouse'i andmebaasi vastu selle HTTP-liidese kaudu. See sobib analüütika torujuhtmetele, sündmuste logimisele ja aruandluse workflow'dele: sisestage sündmusi nende toimumise ajal, seejärel koondage või loendage neid `query`/`count`-iga. See peegeldab [DataTable](../nodes/datatable-node.md) operatsioonide komplekti (find, getAll, count, getById, insert, update, remove, upsert) pluss toor-SQL pääsuteed, kus `update`/`remove` töötavad ClickHouse'i mutatsioonidena.

Sobib kokku [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) ajastatud aruannete jaoks ja [Kolmandate osapoolte integratsioonidega](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Notion node haldab Notioni andmebaase, andmeallikaid, lehti ja plokke praeguse Notioni API (`2026-03-11`) kaudu. See toetab otsingut, lehe CRUD-i, andmebaasi ja andmeallika operatsioone, ploki alamelemente, plokkide lisamist/uuendamist/kustutamist ning prügikasti taastamist. Kasutage sisemise integratsiooni tokenit või Notioni avaliku integratsiooni OAuth2 mandaati. Redaktor saab otsida ja kursoriga lehtsedada juurdepääsetavaid andmeallikaid ja ülemlehti. Jagatud mandaadid töötavad workflow' käitamisel samamoodi nagu omatud mandaadid.

Kohandatud REST-päringute jaoks laheneb `$credentials.YourNotionCredential` samale bearer-tokenile. Sobib kokku [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) ja [Kolmandate osapoolte integratsioonidega](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Sentry sõlm automatiseerib Sentry organisatsioone, projekte, meeskondi, probleeme, sündmusi ja väljalaskeid Sentry REST API kaudu. Kasutage seda teavituste triaažiks, probleemide oleku uuendamiseks, väljalaske automatiseerimiseks, sündmuste otsimiseks ning projektide/meeskondade seadistamiseks või koristamiseks. See toetab Sentry SaaS-i ja isemajutatud Sentryt valikulise mandaadi baas-URL-i kaudu.

Sobib kokku [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) ja [Third-Party Integrations](./integrations.md) sõlmedega intsidentide ja väljalaske workflow'de jaoks.

#### [DataTable](../nodes/datatable-node.md)

DataTable sõlm loeb, kirjutab ja haldab andmeid Heym DataTables'ides (esmase osapoole struktureeritud salvestusruum). Toimingute hulka kuuluvad find, getAll, getById, insert, update, remove ja upsert. Väliseid mandaate pole vaja. Tabeleid hallatakse [DataTable](../tabs/datatable-tab.md) juhtpaneeli vahekaardilt ja neile pääseb otse ligi workflow omanik.

Sobib kokku [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) ja [DataTable vahekaardiga](../tabs/datatable-tab.md) esmase osapoole struktureeritud salvestusruumi jaoks.

#### [Drive](../nodes/drive-node.md)

Drive sõlm haldab skillide poolt genereeritud faile otse workflow'st. Toimingute hulka kuuluvad delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams ja unshareWithMyTeams kirjutuskaitstud meeskonnaligipääsu haldamiseks; formaadi teisendamine asub hoopis [Converter](../nodes/converter-node.md) sõlmes. Viidake failile `$agentLabel._generated_files[0].id` kaudu; väljundite hulka kuuluvad status, file_id, lingi piirangute jaoks uuendatud download_url ja meeskonnaga jagamiseks shared_team_count. See on eriti kasulik [Agent Node](../nodes/agent-node.md) workflow'de puhul, mis kasutavad [File Generation](./file-generation.md) funktsiooni ja [Drive](./drive.md) viitemudelit.

Levinumad kaaslased on [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) ja [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 sõlm teostab objektisalvestuse toiminguid Amazon S3-s, kasutades `s3` mandaati (access key, secret key, region, valikuline session token). Toimingute hulka kuuluvad putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder ja listBuckets. Teksti üleslaadimine ja teksti või base64 allalaadimine on toetatud, kusjuures bucket ja key väljad aktsepteerivad [Expression DSL](./expression-dsl.md)-i. Kasutage seda workflow'de väljundite salvestamiseks, failide arhiveerimiseks ja objektide tagasi voogu lugemiseks.

Sobib kokku [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) ja [Third-Party Integrations](./integrations.md) sõlmedega.

### Automatiseerimine

#### [Crawler](../nodes/crawler-node.md)

Crawler sõlm kraabib veebilehti, kasutades FlareSolverri koos valikulise HTML-i eraldamisega CSS-selektorite kaudu. Konfigureerige FlareSolverr [mandaat](./credentials.md), URL-i avaldis, ooteaeg ja valikulised selektorid eraldamiseks. Väljundiks on töötlemata HTML või eraldatud sisu. Kasutage seda veebikraapimiseks ja sisu eraldamiseks.

Sobib kokku [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) ja [LLM](../nodes/llm-node.md) sõlmedega kraabi-ja-analuusi voogude jaoks.

#### [Playwright](../nodes/playwright-node.md)

Playwright sõlm automatiseerib brauseri interaktsioone konfigureeritavate sammudega (navigate, refresh, click, type, screenshot, extract, aiStep) või **Run Code** režiimiga kohandatud Playwright Pythoni jaoks (sandboxed; vaikimisi väljas `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED` kaudu). See toetab headless režiimi, valikulist seadistust, mis vähendab levinud Playwright automatiseerimise signaale, ajalõppe, valikulist võrgu püüdmist (responses, cookies, localStorage, sessionStorage), cookie/storageState autentimise alglaadimist [Global Variables](./global-variables.md) avaldistest nagu `$global.authState`, varulogimise samme, kui autentimise taastamine ebaõnnestub, ja AI sammu koos Auto Heal-iga, kui selektorid ebaõnnestuvad. Kasutage seda veebikraapimiseks, vormide täitmiseks ja brauseripõhiste workflow'de jaoks.

Vt ka [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) ja [Execution History](./execution-history.md) brauseri automatiseerimise ja silumise jaoks.

### Utiliidid

#### [Output](../nodes/output-node.md)

Output sõlm on workflow endpoint, mis tagastab vastuse kutsujale. Määrake sõnumi avaldis, et viidata eelmisele sõlmele sildi järgi (ärge kunagi kasutage siin [Input](../nodes/input-node.md) sõlme `$input`-i). Valikuline asünkroonne allavool võimaldab väljundi järel olevatel sõlmedel taustal töötada pärast vastuse saatmist.

Levinumad ülesvoolu allikad on [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) ja [Execute](../nodes/execute-node.md); vastuse kujundamist on lihtsam siluda [Expression Evaluation Dialog](./expression-evaluation-dialog.md)-is.

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper sõlm ehitab lihtsa JSON-objekti [Set](../nodes/set-node.md)-stiilis võtme-väärtuse vastendustest ja tagastab selle workflow vastuse juurtasemel. Kasutage seda, kui API kutsuja peaks saama töötlemata JSON-keha standardse [Output](../nodes/output-node.md) sõlme ümbriskuva asemel.
#### [HTML-väljundi mapper](../nodes/html-output-mapper-node.md)

HTML-väljundi mapper node renderdab ühe HTML-malli, interpoleerides `$nodeLabel.field` avaldised lehele. Kui see on workflow ainus lõppsõlm, vastab execute webhook `text/html`-iga ja node'i konfigureeritud olekukoodiga JSON-keha asemel, nii et workflow saab teenindada lehte otse brauserile. Saatke `X-Simple-Response: false`, et saada tavaline JSON-ümbrik tagasi silumiseks.

Sobib kokku [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) ja [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Chart Output node on [Dashboard](../tabs/dashboard-tab.md) vidina workflow lõppsõlm. See muudab ülesvoolu sõlmede poolt toodetud read standardiseeritud chart payload'iks, mida dashboard renderdab. Valige `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text või HITL), map'ige `labelField`/`valueField` (või `series` mitme seeria jaoks või `text` markdown-sõnumi jaoks) ja asetage see viimaseks; sellel puudub väljundserv. HITL eirab ülesvoolu ridu ja loetleb Teie ootel inimülevaatused. ja teist linginuppudena, mis avavad URL-i uuel vahekaardil (`linkColumn`, koos `linkLabel` nupu teksti jaoks)

Vt ka [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) ja [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Wait node peatab workflow täitmise määratud kestuseks millisekundites, kuni 15 minutit. Kasutage seda kiiruse piiramiseks, viivitatud toiminguteks või pollimisintervallideks. See edastab sisendi muutumatuna.

Sobib kokku [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) ja [Parallel Execution](./parallel-execution.md) tempokuse ja pollimise jaoks.

#### [Sticky Note](../nodes/sticky-note-node.md)

Sticky Note node lisab lõuendile markdown-märkmeid. Seda ei täideta. Kasutage seda dokumentatsiooniks, juhisteks või workflow märkmeteks koos teiste [Canvas Features](./canvas-features.md)-iga. Märkme sisu muutmiseks tehke lõuendil topeltklõps.

Vt ka [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) ja [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Console Log node logib väärtuse backend'i (serveri) konsooli. Kasutage seda silumiseks ja uurimiseks arenduse ajal. Logisõnum toetab [Expression DSL](./expression-dsl.md) avaldisi; väljund edastab sisendi muutumatuna.

Sobib kokku [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) ja [Expression Evaluation Dialog](./expression-evaluation-dialog.md) silumiseks.

#### [Disable Node](../nodes/disable-node.md)

Disable Node node keelab jäädavalt teise node'i workflow's, seades selle `active` lipu väärtuseks false. Määrake sihtnode sildi järgi. Kasutage seda ühekordsete toimingute jaoks, näiteks [Cron](../nodes/cron-node.md) triggeri peatamiseks pärast tingimuse täitumist.

Vt ka [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) ja [Cron](../nodes/cron-node.md) workflow juhtimise mustrite jaoks.

#### [Enable Node](../nodes/enable-node.md)

Enable Node node lülitab teise node'i uuesti sisse, seades selle `active` lipu väärtuseks true ja salvestades muudatuse. Määrake sihtnode sildi järgi. Kasutage seda keelatud [Cron](../nodes/cron-node.md) triggeri uuesti aktiveerimiseks teisest sisendpunktist või node'i sisselülitamiseks, kui tingimus on täidetud. Siht, mis asub Enable Node'ist allavoolu ja pole veel käivitunud, käivitub samuti praeguses täitmises.

Vt ka [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) ja [Cron](../nodes/cron-node.md) workflow juhtimise mustrite jaoks.

#### [Throw Error](../nodes/throw-error-node.md)

Throw Error node peatab workflow täitmise kohe ja tagastab veavastuse kohandatud HTTP olekukoodiga. Määrake veateate avaldis ja olekukood (nt 400, 401, 403, 404, 429, 500). Kasutage seda valideerimise ebaõnnestumiste, volitamata juurdepääsu või muude veatingimuste jaoks, eriti koos [Condition](../nodes/condition-node.md) ja [Error Handler](../nodes/error-handler-node.md)-iga.

Sobib kokku [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) ja [Security](./security.md) selgete ebaõnnestumisteede jaoks.

---

## Viide
### [Node Types](./node-types.md)

Heym pakub mitmesuguseid node-tüüpe: triggerid nagu [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) ja [Error Handler](../nodes/error-handler-node.md); AI-node'id nagu [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) ja [MCP Call](../nodes/mcp-call-node.md); loogikanode'id nagu [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) ja [Loop](../nodes/loop-node.md); andmenode'id nagu [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) ja [Heym](../nodes/heym-node.md); integratsioonid nagu [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) ja [Drive](../nodes/drive-node.md); automatiseerimisnode'id nagu [Crawler](../nodes/crawler-node.md) ja [Playwright](../nodes/playwright-node.md); ning utiliidid nagu [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) ja [Sticky Note](../nodes/sticky-note-node.md). Kasutage node'i konfiguratsioonis avaldisi nagu `$input.text` ja `$nodeLabel.field`.

Vt ka [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) ja [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym kasutab lihtsat avaldiskeelt, et viidata andmetele ülemvoolu node'idest. Kasutage `$input` [Input](../nodes/input-node.md) node'i jaoks, `$nodeLabel.field` mis tahes ülemvoolu node'i jaoks, `$credentials.CredentialName` [mandaatide](./credentials.md) jaoks ja `$global.variableName` [globaalsete muutujate](./global-variables.md) jaoks. Sisseehitatud erimuutujate hulka kuuluvad `$now`, `$UUID` ja workflow metaandmed: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` ja `$executionId` (käivituse [Execution History](./execution-history.md) id — `/workflows/{id}/{executionId}` avab selle käivituse lõuendil; ainult käitusaegne, tühi avaldise eelvaate dialoogis). Toetus hõlmab literaale, aritmeetikat, võrdlusi, [Loop](../nodes/loop-node.md) konteksti, pesastatud välju ning stringi/massiivi abifunktsioone (sealhulgas `$text.toJson()` JSON-stringi parsimiseks). Kui kogu väärtus on üksik `$expr`, säilitab taustsüsteem massiivid, objektid, tõeväärtused ja numbrid natiivsete tüüpidena.

Vt ka [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) ja [Workflow Structure](./workflow-structure.md).

### [Global Variables](./global-variables.md)

Globaalsete muutujate hoidla sisaldab püsivaid, kasutajapõhiseid võti-väärtus andmeid, mis püsivad üle workflow'de käivituste. Looge muutujaid vahekaardil [Variables](../tabs/global-variables-tab.md) või [Variable](../nodes/variable-node.md) node'ist, millel on lubatud "Store in Global Variable Store". Juurdepääsuks kasutage avaldistes `$global.variableName`; neid saab jagada teiste kasutajatega või [tiimidega](./teams.md).

Sobib kokku [Variable](../nodes/variable-node.md), [Teams](./teams.md) ja [Credentials Sharing](./credentials-sharing.md) ühise workflow oleku jaoks.
### [Avaldise hindamise dialoog](./expression-evaluation-dialog.md)

Avaldise hindamise dialoog on laiendatav redaktor, mis kuvatakse, kui klõpsate avaldise väljade kõrval asuvat laiendamise nuppu. See avaneb suure tsentreeritud modaalina, hoiab automaatse täiendamise aktiivsena ja värskendab taustaprogrammi eelvaate väljundit automaatselt pärast trükkimise pausi. Objekti- ja massiivitulemusi saab sirvida väljundi tee valijaga. Dialoog aktsepteerib täisrea paljast punktteed (näiteks `myNode.output.field`) nii, nagu see oleks `$myNode.output.field`; vt [Avaldise DSL](./expression-dsl.md) paigutuse reegleid.

Tööriistariba nupp **Build with AI** võimaldab teil kirjeldada soovitud avaldist lihttekstina. Valige LLM-i [mandaat](./credentials.md) ja mudel, sisestage kirjeldus nagu *"Get the customer name from the API response"* ja klõpsake Generate. Taustaprogramm saadab mudelile [Avaldise DSL](./expression-dsl.md) konteksti ja viimase käivituse sõlmede väljundid ning tagastab üksiku avaldise stringi. Tulemus hinnatakse kohe, et saaksite seda enne Apply klõpsamist kontrollida.

Sobib loomulikult kokku [Avaldise DSL](./expression-dsl.md), [Output](../nodes/output-node.md) ja [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Workflow struktuur](./workflow-structure.md)

Workflow'd salvestatakse JSON-ina koos sõlmede ja servadega. Workflow objekt sisaldab id, name, description, nodes, edges ja auth seadeid. Igal sõlmel on id, type, position ja data (label ja tüübispetsiifiline config). Servad ühendavad allika- ja sihtsõlmede ID-sid valikuliste handle ID-dega. Avaldise süntaks andmeväljades järgib [Avaldise DSL](./expression-dsl.md) ja sama kuju kasutab ka [Download & Import](./download-import.md).

Vt ka [Sõlmede tüübid](./node-types.md), [Avaldise DSL](./expression-dsl.md) ja [Download & Import](./download-import.md).

### [Lõuendi funktsioonid](./canvas-features.md)

Hõljutage kursorit mis tahes mitte-kleepuva lõuendi sõlme kohal ja klõpsake **Run**, et käivitada kuni selle sõlmeni. Nõutavad sisendid avanevad Run paneelis esimese välja fookusega; teed ilma sisenditeta käivituvad kohe. Vt [Run to Node](./canvas-features.md#run-to-node).

Workflow redaktor pakub Data Pin (kinnita sõlme viimane väljund testimaks allavoolu ilma uuesti käivitamata), Execution Logs (reaalajas sõlmede tulemused ja agendi edenemine, mis täiendavad [Käivituste ajalugu](./execution-history.md)), Enable/Disable (jätke sõlmed käivitamise ajal vahele) ja Extract to Sub-Workflow (teisaldage valik uude workflow'sse ja asendage see [Execute](../nodes/execute-node.md) sõlmega). Töötavat produktsiooni käivitust saab avada Ajaloo või Tahvli kaardi kaudu; redaktor taastab selle praeguse hetktõmmise, ühendub SSE-ga ja hoiab lõuendi animatsiooni ja Debug logisid reaalajas. [Klaviatuuri kiirklahvid](./keyboard-shortcuts.md) toetavad kopeerimist, kleepimist, käivitamist ja reasisest sõlmede otsingut.

Vt ka [Klaviatuuri kiirklahvid](./keyboard-shortcuts.md), [Muudatuste ajalugu](./edit-history.md) ja [Käivituste ajalugu](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Klaviatuuri kiirklahvid](./keyboard-shortcuts.md)

Heym pakub kiirklahve üle kogu redaktori: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo ja Escape sulgemiseks. Lõuendil: vali kõik, mitmikvalik, kopeeri/lõika/kleebi, kustuta, lülita sõlme lubatuks (D), lülita kinnitatud andmeid (P) ja reasisene sõlmede otsing trükkides. Kiirklahvid on dokumenteeritud rakendusesiseses viites ja töötavad tihedalt koos [Lõuendi funktsioonidega](./canvas-features.md) nagu Data Pin ja sõlmede lubamine/keelamine.

Vt ka [Lõuendi funktsioonid](./canvas-features.md), [Kiirsahtel](./quick-drawer.md) ja [Kontekstuaalne showcase](./contextual-showcase.md).

### [AI assistent](./ai-assistant.md)

AI assistent on Chat paneel, mis avatakse Debug paneelilt ja võimaldab teil luua või muuta workflow'sid loomulikus keeles. Valige [mandaat](./credentials.md) ja mudel, seejärel kirjeldage, mida soovite; AI edastab voogesituses vastuse ja iga kehtiv [workflow JSON](./workflow-structure.md) koodiplokis parsitakse automaatselt ning rakendatakse lõuendile. Häälensisend on toetatud ühilduvates brauserites.

Lülitage sisse **YOLO mode** (Agent mode, vaikimisi väljas) ja assistent testib seda, mida ehitab. Pärast iga muudatust käivitab see workflow lõuendil, loeb tulemust ja parandab workflow'd, kuni see teeb seda, mida palusite, kuni 5 käivitust sõnumi kohta. See küsib testisisendeid enne esimest käivitust, saab käivitada teie teisi workflow'sid, kui vajab nende tulemust, ja näitab iga sammu selle töötamise ajal. Vt [AI assistent › YOLO režiim](./ai-assistant.md#yolo-mode).

Klõpsake lõuendil mis tahes sõlme kohal **AI**, et muuta või parandada ainult seda sõlme. Paneel näitab sõlme, mida see muudab (koos selle viimase tulemusega pärast käitamist), ja pakub valikuid **Change this node as ...**, **Fix error in this node ...** ja **Other**. Uuendatakse ainult seda sõlme; ülejäänud workflow ja paigutus jäävad samaks. Vaadake [AI Assistant › Ühe sõlme muutmine](./ai-assistant.md#changing-one-node).

Kui workflow salvestab kirjeid, küsib assistent, millist [andmetabelit](../tabs/datatable-tab.md) kasutada, või loob ühe veergudega, mida workflow vajab. Vt [AI assistent › Andmetabelid](./ai-assistant.md#data-tables).

Kui praegune workflow sisaldab [Agendi sõlme](../nodes/agent-node.md) oskusi, saadab assistent workflow konteksti ainult iga oskuse `SKILL.md`. Manustatud `.py` failid ja binaarsed oskuste varad jäetakse enne päringut välja, et suured oskuste paketid ei ületaks mudeli kontekstiakent.

Sobib hästi kokku [Chat with Heym](./chat-with-heym.md), [Agendi arhitektuur](./agent-architecture.md) ja [Avaldise DSL](./expression-dsl.md).
### [Chat Heymiga](./chat-with-heym.md)

Chat Heymiga on dokumentatsiooni päise assistent tootealaste küsimuste jaoks. See avaneb tsentreeritud dialoogis, hoiab mandaatide ja mudeli valiku nähtavana ülaosas, sisestab kontekstina aktiivse dokumentatsioonilehe tee ning tühjendab sõnumite ajaloo, kui dialoog sulgub. See täiendab laiemat [AI Assistant](./ai-assistant.md) ja kergemat [Contextual Showcase](./contextual-showcase.md).

Vt ka [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) ja [Node Types](./node-types.md).

### [Workflow'de korraldamine](./workflow-organization.md)

Instantsi administraatorid (`HEYM_ADMIN_EMAILS`) saavad juurde pääseda ja redigeerida iga workflow'd, leida omaniku workflow'sid e-posti järgi, uurida ajakavasid ja käivituste ajalugu, peatada ja jätkata automaatseid triggereid ning kustutada workflow'sid, kui käivitused on lõppenud. Vt [Instance Administration](../tabs/workflows-tab.md#instance-administration) offboarding-voogude ja automaatsete triggerite peatamise ning kõigi kõnede blokeerimise eristamise kohta.

Workflow'sid saab korraldada kaustades ja alamkaustades puustruktuurina. Kaustadel on nimed ja valikuline ülemkaust; workflow'd määratakse kaustadele. Workflow'sid saab planeerida kustutamiseks (teisaldatakse enne jäädavat eemaldamist prügikasti alale). API toetab workflow'de loomist, uuendamist, kustutamist ja teisaldamist kaustade vahel ning sama korraldusmudel ilmneb ka vahekaardil [Workflows](../tabs/workflows-tab.md).

Vt ka [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) ja [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer on fikseeritud parempoolne kiirkäivituse paneel sisemiste mitte-lõuendi lehtede jaoks. See võimaldab otsida [workflow'sid](../tabs/workflows-tab.md), kinnitada lemmikuid, valida sisendeid, käivitada kohe ning uurida edenemist või tulemusi ilma redaktorit avamata. [File Upload Trigger](../nodes/file-upload-trigger-node.md) sõlmega workflow võtab vastu lohistatud või valitud faili. Kinnituste järjekord ja viimati valitud workflow salvestatakse brauseris.

Vt ka [Workflow'de korraldamine](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) ja [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase on kompaktne rakendusesisene juhendriba autenditud põhipindade jaoks, nagu armatuurlaua vahekaardid, [Evals](../tabs/evals-tab.md), Docs ja workflow redaktor. See on vaikimisi suletud, annab esmalt lühikese lehe kokkuvõtte, pakub nõudmisel veidi lisateavet ning lingib täielikule dokumentatsiooniartiklile, kui soovite põhjalikumat juhendamist.

Sobib kokku [Chat Heymiga](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) ja [AI Assistant](./ai-assistant.md) rakendusesiseste juhendamisvoogude jaoks.

### [Mandaadid](./credentials.md)

Mandaadid salvestavad API võtmeid ja saladusi, mida workflow sõlmed kasutavad. Lisage need vahekaardil [Credentials](../tabs/credentials-tab.md) ja viidake neile nime või ID järgi sõlmedes nagu [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) ja [Redis](../nodes/redis-node.md). Need on salvestamisel krüpteeritud, neid saab jagada kasutajatega või [tiimidega](./teams.md) ning neile saab viidata ka [Expression DSL](./expression-dsl.md) kaudu, kasutades `$credentials.Name`.

Vt ka [Credentials](../tabs/credentials-tab.md), [Mandaatide jagamine](./credentials-sharing.md) ja [Third-Party Integrations](./integrations.md).

### [Mandaatide jagamine](./credentials-sharing.md)

Mandaate saab jagada teiste kasutajatega e-posti teel või tiimidega; kui mandaat on tiimiga jagatud, saavad kõik tiimiliikmed juurdepääsu. Jagatud mandaadid kuvatakse vahekaardil [Credentials](../tabs/credentials-tab.md) indikaatoriga. Käitusajal ühendab workflow omaniku kontekst omatud, kasutajaga jagatud ja tiimiga jagatud mandaadid. Kasutage avaldistes `$credentials.CredentialName` või määrake sõlme andmetes credentialId.

Vt ka [Mandaadid](./credentials.md), [Tiimid](./teams.md) ja [Third-Party Integrations](./integrations.md).

### [Tiimid](./teams.md)

Tiimid võimaldavad jagada workflow'sid, mandaate, globaalseid muutujaid, vektorhoidlaid ja Drive faile korraga kasutajate rühmaga. Looge tiime vahekaardil [Teams](../tabs/teams-tab.md) ja lisage liikmeid e-posti teel. Jagage ressursse tiimiga vastavatest jagamisdialoogidest; seejärel on kõigil liikmetel juurdepääs. Looja saab tiimi redigeerida ja kustutada; tiimi kustutamine eemaldab kõik tiimi jagamised.

Sobib kokku [Mandaatide jagamisega](./credentials-sharing.md), [Global Variables](./global-variables.md) ja [Enterprise](./enterprise.md).

### [Paralleelne käivitamine](./parallel-execution.md)

Heym käivitab sõlmi paralleelselt, kui neil puuduvad üksteisest sõltuvused. Täitja koostab DAG-i ja käivitab samal tasemel olevaid sõlmi üheaegselt lõimede basseiniga; niipea kui sõlm lõpetab, planeeritakse selle allavoolu sõlmed. Kasutage [Merge](../nodes/merge-node.md) sõlme paralleelsete harude ühendamiseks, kui see on vajalik. Mitu workflow käivitust täidetakse üheaegselt; iga käivitus on isoleeritud. [SSE Streaming](./sse-streaming.md) režiim edastab sündmusi sõlmede lõpetamisel.

Vt ka [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) ja [Execution History](./execution-history.md).
### [Agendi arhitektuur](./agent-architecture.md)

[Agendi sõlm](../nodes/agent-node.md) toetab alam-agente (orkestraator kutsub teisi agendi sõlmi välja `call_sub_agent` kaudu), alam-workflow'sid (agent kutsub teisi workflow'sid välja `call_sub_workflow` kaudu), oskusi (juhiste sisu ja Pythoni tööriistad .zip või .md failist) ning [MCP](../tabs/mcp-tab.md) kliendiühendusi. Orkestraatori tööriistade täitja suunab alam-agendi ja alam-workflow kutsed; muud tööriistad suunatakse Pythoni, MCP või oskuste täitjatele. Alam-agentide ja alam-workflow'de maksimaalne pesastussügavus on 5. Tööriistade kutsumise tsükkel sisaldab automaatset konteksti tihendamist: enne iga iteratsiooni hinnatakse tokeni kasutust ja kui see ületab 80% mudeli kontekstiaknast, võetakse keskmised sõnumid sama mudeli abil kokku, jättes puutumata süsteemi prompti, esimese kasutaja sõnumi ja viimase kasutaja sõnumi.

Vt ka [Agendi sõlm](../nodes/agent-node.md), [Agendi püsiv mälu](./agent-persistent-memory.md), [Inimene tsüklis](./human-in-the-loop.md) ja [MCP](../tabs/mcp-tab.md).

### [Agendi püsiv mälu](./agent-persistent-memory.md)

Valikuline iga [Agendi sõlme](../nodes/agent-node.md) kohta Postgresis hoitav teadmiste graaf: olemid, tüübid, omadused ja suunatud seosed. Kui `persistentMemoryEnabled` on true, võetakse graaf igal käivitusel süsteemi prompti kokku; pärast edukat lõpetamist eraldab [LLM](../nodes/llm-node.md) taustal struktureeritud uuendused. REST CRUD asub aadressil `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Redaktor avaneb sõlme roosal ajukontrollil.

Vt ka [Agendi sõlm](../nodes/agent-node.md), [Agendi arhitektuur](./agent-architecture.md) ja [Käivitused](../tabs/traces-tab.md).

### [Inimene tsüklis](./human-in-the-loop.md)

Inimene tsüklis võimaldab [Agendi sõlmel](../nodes/agent-node.md) taotleda kinnitust kindlates kontrollpunktides, luua avaliku lehe `/review/{token}` ja oodata sisselogimata ülevaataja otsust Markdowni ülevaatusteksti aktsepteerimiseks, muutmiseks või tagasilükkamiseks. HITL-toega agendid pakuvad ka `review` väljundkäepidet, et saaksite käivituse ootel olles teavitada [Slacki](../nodes/slack-node.md), [E-kirja saatmise](../nodes/send-email-node.md) sõlme või muid kanaleid. Sõlme tasemel HITL-teksti kasutatakse kinnituse juhistena, samas kui avaliku lehe kokkuvõte genereeritakse ülevaatuspäringust endast. Ootel käivitused ilmuvad kohe [Käivituste ajalukku](./execution-history.md), võivad samas käivituses toimuda rohkem kui üks kord ja jätkuvad täpselt salvestatud workflow' snapšotist, kui iga otsus on esitatud.

Vt ka [Agendi sõlm](../nodes/agent-node.md), [Portal](./portal.md), [Käivituste ajalugu](./execution-history.md) ja [E-kirja saatmine](../nodes/send-email-node.md).

### [Webhookid](./webhooks.md)

Workflow'sid saab käivitada [HTTP](../nodes/http-node.md) kaudu aadressil `POST /api/workflows/{workflow_id}/execute` või voogesitada järk-järgult aadressilt `POST /api/workflows/{workflow_id}/execute/stream`. Päringu keha edastatakse body'na [Sisendsõlmedele](../nodes/input-node.md); päised ja päringuparameetrid on saadaval [Avaldise DSL-i](./expression-dsl.md) avaldistes. Konfigureerige workflow-põhine autentimine: anonüümne, JWT või kohandatud päis. Valikuline vastuse vahemällu salvestamine, kiirusepiirang ja redaktori dialoog "Käivita cURL-iga" asuvad kõik workflow' juures ning kehtivad mõlemale režiimile. [Paralleelsuse limiidiga](./webhooks.md#concurrency-limit-and-queued-runs) saab väljakutse, mis peab ootama, selle asemel vastuse `202 Accepted` koos täitmise ID ja oleku URL-iga.

Vt ka [Sisend](../nodes/input-node.md), [Käivituse tokenid](./execution-tokens.md), [SSE voogesitus](./sse-streaming.md), [HTTP](../nodes/http-node.md) ja [Workflow struktuur](./workflow-structure.md).

### [Käivituse tokenid](./execution-tokens.md)

Käivituse tokenid on piiratud ulatusega JWT-d, mis annavad juurdepääsu ühe workflow' execute- ja stream-endpointidele. Kui workflow kasutab JWT autentimist, võimaldavad tokenid välistel skriptidel, CI torujuhtmetel ja integratsioonidel workflow'd välja kutsuda ilma kasutajaseanssi jagamata. Iga token kannab `wid` väidet, mis seob selle ühe workflow'ga, `jti`-d, mida kasutatakse koheseks tühistamiseks, ja konfigureeritavat TTL-i (60 sekundit kuni 10 aastat). Looge, valige ja tühistage tokeneid otse dialoogist **Käivita cURL-iga** — valitud token lisatakse genereeritud käsklusse automaatselt.

Vt ka [Webhookid](./webhooks.md), [Turvalisus](./security.md) ja [SSE voogesitus](./sse-streaming.md).

### [SSE voogesitus](./sse-streaming.md)

cURL dialoog saab lülitada [webhooki](./webhooks.md) käivituse Server-Sent Events režiimi. See tekitab reaalajas sündmused `execution_started`, `node_start`, `node_complete` ja `execution_complete`, lisab genereeritud cURL käsule `--no-buffer` ning võimaldab konfigureerida sõlmepõhiseid algteateid nagu `[START] LLM` või kohandatud teksti välistele terminalitarbijatele.

Vt ka [Webhookid](./webhooks.md), [Käivituste ajalugu](./execution-history.md) ja [LLM](../nodes/llm-node.md).
### [Triggerid](./triggers.md)

Workflow'd käivitatakse trigger-noodide ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) vastuvõtt) või sisendpunktide kaudu: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron-ajastaja, Telegrami webhook, Discordi interaktsiooni webhook, IMAP trigger-haldur, RabbitMQ tarbija või redaktori käivitus. Igal triggeril on oma endpoint või taustaprotsess; [Cron](../nodes/cron-node.md) käivitub iga 60 sekundi järel, [Telegram Trigger](../nodes/telegram-trigger-node.md) noodid võtavad vastu boti webhooke, [Discord Trigger](../nodes/discord-trigger-node.md) noodid võtavad vastu allkirjastatud interaktsiooni webhooke ning [IMAP Trigger](../nodes/imap-trigger-node.md) noodid töötavad konfigureeritud päringuintervalliga. [Input](../nodes/input-node.md) noodid võtavad webhook-päringutest vastu body, headers ja query.

Vt ka [Node Types](./node-types.md), [Webhooks](./webhooks.md) ja [Parallel Execution](./parallel-execution.md).

### [Käivituste ajalugu](./execution-history.md)

Käivituste ajalugu salvestab workflow'de käivitusi: sisendid, väljundid, node'i tulemused, oleku ja triggeri allika. Sellele pääseb ligi redaktori tööriistaribalt, Docs-vaatest, Dashboardi päisest või [Evals](../tabs/evals-tab.md) vaatest. Workflow-põhine ajalugu näitab avatud workflow' käivitusi; kogu ajaloo vaade näitab käivitusi üle workflow'de ja chat'i. Praegu töötavad käivitused kuvatakse mõlema dialoogi ülaosas koos **Open live** ja **Cancel** toimingutega. Open live ühendab redaktori olemasoleva käivitusega üle [SSE](./sse-streaming.md), taastab lõpetatud noodid, pulseerib praegust ja ootel olevaid noode ning lisab Debug-logisid ilma uut käivitust alustamata. Bring to Canvas laadib lõpetatud käivituse sisendid ja node'i väljundid uuesti käivitamiseks või silumiseks; deep link `/workflows/{workflowId}/{executionId}` toetab nii reaalajas kui ka lõpetatud käivitusi. [Human-in-the-Loop](./human-in-the-loop.md) poolt pausile pandud käivitused salvestatakse kohe olekuga `pending`, sealhulgas avalik ülevaatamise URL ja kõik teavituse-noodid, mis käivitati agendi `review` harust. Kui server taaskäivitub keset käivitust, taastatakse katkestatud käivitused automaatselt: need käivitatakse uuesti algusest samade sisenditega ja kuvatakse lõpetatuna (märgitud **Recovered**), mida juhitakse workflow-põhise **Auto-recover runs** lülitiga, mis võib need selle asemel salvestada olekuga `skipped`.

Vt ka [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) ja [Traces](../tabs/traces-tab.md).

### Käivituste esiletõstmine

Pärast reaalajas käivitust — või pärast **Bring to Canvas** — kuvatakse lõuendi ülanurgas sulgemist võimaldav **Execution Highlights** hüpikaken, mis loetleb iga node'i poolt toodetud tulemused käivituse järjekorras. See on kiire viis node-põhise väljundi uurimiseks ilma iga node'i avamata; sulgege see **✕**-iga ja see avaneb uuesti järgmisel käivitusel. Esiletõstmised kuvatakse ka dashboardi käivitustel. Üksikasju vt [Execution History](./execution-history.md).

### [Muudatuste ajalugu](./edit-history.md)

Muudatuste ajalugu jälgib workflow' salvestatud versioone (iga Salvestamine loob versiooni). Vaadake nimekirja, avage versioon, et näha erinevusi praeguse workflow' suhtes ([nodes](./workflow-structure.md), servad, konfiguratsioon), ja taastage varasem versioon funktsiooniga Revert. Erinevalt [Execution History](./execution-history.md)-st jälgib muudatuste ajalugu struktuurimuudatusi, mitte käivitusi.

Vt ka [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) ja [Canvas Features](./canvas-features.md).

### Vea-workflow

Workflow saab määrata teise workflow', mis käivitub selle nurjumisel. Konfigureerige seda workflow-tasemel **Properties** paneelil (kuvatakse, kui ükski node pole valitud) jaotises **On error, run workflow**. Ainult workflow' omanik saab seda määrata, muuta või tühistada; vt [Owner-only settings](./workflow-organization.md#owner-only-settings). Kui ülatasemel käivitus lõpeb käsitlemata veaga, käivitub valitud vea-workflow ja saab vea konteksti (nurjunud workflow' id ja nimi, käivituse id, veateade, nurjunud node'i silt ja tüüp ning ajatempel). Kui lõuendil on juba [Error Handler](../nodes/error-handler-node.md) node, on kohalikul käsitlejal prioriteet ja vea-workflow'i **ei** kutsuta. Vea-workflow ise käivitub otse, seega see ei käivita kunagi omaenda vea-workflow'i.

See hõlmab iga mitte-test-ülatasemel käivitust: mõlemad execute-endpointid, [Portal](./portal.md) ja iga trigger, sealhulgas [cron](../nodes/cron-node.md), chat-platvormi triggerid, e-post, järjekorrad, [MCP](../tabs/mcp-tab.md) ja dashboardi vidinad. Kui [Load Distribution](./cluster.md) on lubatud, jääb see muutumatuks, sealhulgas worker'i poolt käivitatud käivitused: nurjuv node rändab tulemusega tagasi ja vea-workflow jaotatakse seejärel nagu iga teine käivitus, seega node, mis peab töötama põhiinstantsil, töötab ikkagi. Kaks juhtumit on teadlikult välja jäetud, kuna workflow' enda tulemus pole veel teada: käivitus, mida ükski instants kunagi ei käivitanud, ja ootamine, mis aegus, samal ajal kui käivitus võib veel jätkuda. Seda **ei** käivitata ka käsitsi lõuendi testkäivituste poolt.
### Workflow'i ajalõpp

Iga workflow saab workflow-tasandi **Properties** paneelis määrata **workflow'i ajalõpu** sekundites. `0` (vaikeväärtus) lülitab selle välja. Kui see on määratud, peatatakse käivitus, mis ületab limiidi, järgmise sõlme piiril ja registreeritakse ebaõnnestunud käivitusena veaga "timed out". Ajalõpp kehtib käsitsi, API ja triggeriga käivitamiste puhul. Pikad [Wait](../nodes/wait-node.md) sõlmed katkestatakse viivitamatult, selle asemel et blokeerida kogu nende kestuse jooksul.

### Paralleelsuse limiit

Iga workflow saab piirata korraga toimuvate produktsioonikäivituste arvu valikuga **Paralleelsuse limiit** workflow taseme **Properties** paneelil; omanik ja muutmisõigusega kaastöötajad saavad seda muuta ning see on vaikimisi välja lülitatud. Kui limiit on saavutatud, ootavad uued käivitused [webhooki](./webhooks.md#concurrency-limit-and-queued-runs) ja [voogesituse](./sse-streaming.md) endpointidest, [Portalist](./portal.md), [Quick Drawerist](./quick-drawer.md), [MCP-st](../tabs/mcp-tab.md) ja igast [triggerist](./triggers.md) FIFO-järjekorras (esimesena sisse, esimesena välja), mida arvestatakse kõigi [klastri](./cluster.md) instantside lõikes. Redaktori testkäivitusi, alam-workflowde väljakutseid, [Evals-teste](../tabs/evals-tab.md) ja ülevaatuste jätkamisi ei panda kunagi järjekorda ning [Boardi](../tabs/board-tab.md) kaardikäivitused, failiüleslaadimised, tehisintellekti assistendi run-workflow tööriista käivitatud käivitused ja hoiatusteatiste workflowd algavad ilma vaba pesa ootamata. Webhooki väljakutse, mis peab ootama, saab kohe vastuse `202 Accepted` koos parameetriga `execution_id`, samade mandaatidega vastava oleku URL-iga, oma positsiooniga, järjekorra suurusega ja töötavate käivituste arvuga; MCP klient saab sama ja pärib tööriista `heym_execution_status`. Valikuline **Järjekorra maksimaalne suurus** lükkab lisapäringud tagasi koodiga `429` ja valikuline **Maksimaalne ooteaeg** märgib liiga kaua oodanud käivituse olekuks `expired`. Ootel käivitused kuvatakse [Käivituste ajaloos](./execution-history.md) märkega **Järjekorras n/m** ja neid saab seal tühistada.

### Säästetud aeg

Iga workflow saab salvestada **hinnangulise säästetud aja käivituse kohta** (minutites), mis määratakse workflow-tasandi **Properties** paneelis. Vahekaart [Analytics](../tabs/analytics-tab.md) koondab selle valitud vahemikus kogu **Time Saved** statistikaks (iga workflow hinnangu × selle edukate käivituste summa). Most Used loetleb samuti selle summa iga workflow kohta; **Not Set** avab hinnangu välja, kui see on määramata. Aruanne [Workflow Analysis](./workflow-analysis.md) soovitab hinnangut määrata, kui ükski pole konfigureeritud.

### [Settings](./user-settings.md)

Settings dialoogil (avatakse teie avatari kaudu päises) on neli vahekaarti: Profile (Gravatari pilt, kuvatav nimi, User Rules), [Security](./security.md) (parooli muutmine), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) ja Observability (kirjutuskaitstud [OpenTelemetry](./opentelemetry.md) olek). User Rules on kohandatud juhised, mis sisestatakse igasse AI-päringusse, sealhulgas workflow builder'isse ja [Chat](../tabs/chat-tab.md), nii et saate keele, tooni, koodimisstiili või workflow'de tavad ühe korra määrata. Paroolipoliitika ja [MCP](../tabs/mcp-tab.md) API võtme haldamine on samuti saadaval.

Vt ka [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) ja [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym saab väljastada OpenTelemetry jälgimisandmeid iga workflow käivituse ja sõlme täitmise kohta: juur-`heym.workflow.execute` span iga käivituse kohta ja alam-`heym.node.execute` span iga sõlme kohta, kusjuures mudeli ja tokeni kasutus on lisatud LLM- ja agent-sõlmedele. Spanid eksporditakse OTLP/HTTP kaudu mis tahes ühilduvasse taustsüsteemi (Jaeger, Grafana Tempo, Honeycomb, Datadog) ning W3C trace context levib sissetulevate webhookide, väljamineva HTTP ja alam-workflow'de vahel. Jälgimine on vaikimisi välja lülitatud ja konfigureeritakse `HEYM_OTEL_*` [keskkonnamuutujatega](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); aktiivne olek on näidatud [Settings](./user-settings.md) Observability vahekaardil.

Vt ka [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) ja [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Eksportige praegune workflow JSON-ina redaktori tööriistaribalt (Download nupp); fail sisaldab sõlmi ja servi. Importige, lohistades JSON-faili vahekaardile [Workflows](../tabs/workflows-tab.md) (loob uue workflow) või lõuendile (asendab või ühendab). JSON peab sisaldama nodes massiivi; nimi ja edges on valikulised. Kasutage seda varundamiseks, jagamiseks või instantside vahel migreerimiseks.

Vt ka [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) ja [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portal avalikustab workflow'd avalike chat-liidestena aadressil `/chat/{slug}`. Konfigureerige portal_enabled, slug, valikuline autentimine (portaali kasutajad), streaming ja faili üleslaadimine iga workflow kohta. Lõppkasutajad suhtlevad chat-liidese kaudu ilma Heymi sisse logimata; pildi väljundeid saab chat'is kuvada. Portaali workflow'd saavad samuti üle anda [Human-in-the-Loop](./human-in-the-loop.md) ülevaatamise lehtedele, kui [Agent Node](../nodes/agent-node.md) nõuab kinnitust, samal ajal kui agendi `review` haru saadab teavitusi teistele kanalitele. Kasutage seda sisemiste tööriistade, kliendile suunatud chatbotide ja AI-põhiste vormide jaoks.

Vt ka [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) ja [Drive](./drive.md).

### [File Generation](./file-generation.md)

Skills saavad täitmise ajal genereerida faile nagu PDF, DOCX, CSV, JSON ja pilte, kirjutades `_OUTPUT_DIR` tööruumi. Heym tabab need failid automaatselt, salvestab need ja avalikustab allalaadimise metaandmed `_generated_files` all, mida saab seejärel hallata [Drive node](../nodes/drive-node.md) abil või üle vaadata vahekaardil [Drive](../tabs/drive-tab.md).

Vt ka [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) ja [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive on jagatud salvestus- ja jagamiskihi skillide poolt genereeritud failide jaoks. See võimaldab teil sirvida faile, luua avalikke või parooliga kaitstud linke, rakendada aegumist ja allalaadimise limiite, jagada faile kirjutuskaitstud režiimis oma tiimidega ning hallata neid faile programmiliselt [Drive node](../nodes/drive-node.md) abil või käsitsi vahekaardil [Drive](../tabs/drive-tab.md).

Vt ka [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) ja [Portal](./portal.md).
### [Turvalisus](./security.md)

Heym rakendab paroolipoliitikat (pikkus, suurtähed, väiketähed, number), hoiustab access tokeneid HttpOnly küpsistes ja pöörab refresh tokeneid kasutamisel. Kiirusepiirang kehtib sisselogimisele, registreerimisele ja [Portali](./portal.md) sisselogimisele. [Mandaadid](./credentials.md) on krüpteeritud salvestatud kujul AES-256-ga (Fernet). [MCP](../tabs/mcp-tab.md) API võti on kliendi autentimiseks; sisu turvalisus on saadaval [Guardrails](./guardrails.md) kaudu [LLM](../nodes/llm-node.md) ja [Agent Node](../nodes/agent-node.md) sõlmedel. [Execution Tokens](./execution-tokens.md) pakuvad iga workflow' jaoks skoobitud JWT-sid välistele kutsujatele.

Vt ka [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) ja [Mandaadid](./credentials.md).

### [Ühekordne sisselogimine](./sso.md)

Heym autendib inimesi mis tahes välise OpenID Connect pakkuja vastu - Keycloak, Okta, Entra ID, Auth0, Google - mis on käitusajal konfigureeritud jaotises **Settings → SSO** instantsi administraatori poolt, kes on loetletud `HEYM_ADMIN_EMAILS`-is. Sisestatakse ainult issuer URL ja kliendi mandaadid; iga endpoint pärineb pakkuja discovery dokumendist, seega ükski pakkuja ei ole kõvakodeeritud. Sisselogimine kasutab Authorization Code'i koos PKCE-ga ning ID tokenit kontrollitakse pakkuja avaldatud võtmete vastu. Kontod kaardistatakse esmalt `(issuer, subject)` järgi ja teiseks kinnitatud e-posti järgi, kusjuures valikuline automaatne loomine on piiratud e-posti domeeni lubatud loendiga. Parooliga sisselogimine jääb SSO kõrval saadavale ja seda saab välja lülitada, kui ühenduse test on läbitud, kusjuures `HEYM_ADMIN_EMAILS` kontod on erandiks, et valesti konfigureeritud pakkuja ei saaks instantsi lukustada.

Vt ka [Settings](./user-settings.md), [Turvalisus](./security.md) ja [Audit Logging](./audit.md).

### [Koormuse jaotamine](./cluster.md)

Suunake teine Heym instants samale andmebaasile ja see liitub worker'ina. Taustaprotsessid - cron, webhookid, MCP tööriistakutsed, chat triggerid - jagatakse instantside vahel protsendi järgi, mille instantsi administraator määrab jaotises **Settings → Instances**, kusjuures iga instantsi olek, andmebaasi latentsus ja versioon on ühes tabelis. Instantsid ei suhtle omavahel kunagi: Postgres kannab tööd, seega worker ei vaja avatud porti ega marsruuti tagasi põhiinstantsi. Töö, mis puudutab kohalikke faile, coding-agendi tööruumi või paigaldatud pluginat, käivitub alati põhiinstantsil ning paneel näitab, kui suur osa viimasest 24 tunnist see oli, et operaator näeks, millal protsendid ei aita. Iga käivitus ajaloos nimetab instantsi, mis selle täitis, ja mõlemad ajaloo dialoogid saavad selle järgi filtreerida.

Vt ka [Settings](./user-settings.md), [Traces](../tabs/traces-tab.md) ja [Analytics](../tabs/analytics-tab.md).

### [Kolmandate osapoolte integratsioonid](./integrations.md)

Heym ühendub välisteenustega mandaatide kaudu, mis on salvestatud [Mandaadid](../tabs/credentials-tab.md) vahekaardil (krüpteeritud salvestatud kujul). Toetatud tüübid hõlmavad OpenAI, Google, Decision Model [Decision node](../nodes/decision-node.md) jaoks, Model Router automaatseks mudeli valikuks (vt allpool), GitHub [GitHub node](../nodes/github-node.md) ja MCP integratsioonide jaoks, Jira [Jira node](../nodes/jira-node.md) jaoks, Notion [Notion node](../nodes/notion-node.md) jaoks, Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP [Send Email](../nodes/send-email-node.md) jaoks, [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header ja FlareSolverr [Crawler](../nodes/crawler-node.md) jaoks. Iga tüüp dokumenteerib nõutavad väljad; mandaate saab jagada kasutajatega või [tiimidega](./teams.md) ning neile saab viidata nime järgi sõlmedes või avaldistes kujul `$credentials.Name`.

### Model Router (Auto Model)

**Model Router** mandaat valib mudeli iga päringu jaoks, selle asemel et hoida võtit. See
salvestab decision model mandaadi pluss loendi teie olemasolevatest OpenAI/Google/Custom
mandaatidest, millest igaühel on kriteeriumid, millal seda kasutada, ja ilmub igas mudeli
valikus ühe mudeliga nimega **Auto**.

Traces, lõuendi Execution Log ja Span View näitavad valiku mõlemat poolt, näiteks
`Auto Model / GPT-5`, samal ajal kui kulu omistatakse mudelile, mis töötas. Auto
Model ei saa kombineerida Responses API, Batch režiimi ega pildiväljundiga. Täieliku
käitumise kohta vt [Mandaadid](./credentials.md).

Vt ka [Mandaadid](./credentials.md), [Credentials Sharing](./credentials-sharing.md) ja [Tiimid](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blokeerivad ohtlikud või soovimatud kasutaja sõnumid enne, kui need jõuavad [LLM](../nodes/llm-node.md) või [Agent Node](../nodes/agent-node.md) sõlmeni. Lubage need iga sõlme jaoks ja valige blokeeritavad kategooriad (nt vägivald, vihakõne, seksuaalne sisu, enesevigastamine, ahistamine, ebaseaduslik tegevus). Määrake tundlikkus (madal, keskmine, kõrge). Käivitumisel viskab sõlm vea, mille saate püüda [Error Handler](../nodes/error-handler-node.md) abil. Tuvastus kasutab pakkuja moderation API-t või LLM klassifitseerimist sõltuvalt mandaadi tüübist.

Vt ka [Turvalisus](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) ja [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise hõlmab kommertsiaalset litsentsimist, professionaalset tuge ja juurutusteenuseid meeskondadele, kes kasutavad Heymi tootmiskeskkonnas. See sisaldab workflow'de arhitektuuri abi, onboardingut, Kubernetes'e ja skaleerimise juhiseid, prioriteetset tuge ning kohandatud arendust arenenud funktsioonide ümber, nagu [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) ja [Portal](./portal.md).

Vt ka [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) ja [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work on Heymi peale ehitatud teine liides ärimeeskondadele. Inimesed kirjeldavad tööd, vastavad mõnele küsimusele ja saavad testitud workflow, seejärel töötavad lehtede, kinnituste ja tegevuste loendi kaudu, kus igal käivitusel on nimi. Eksemplari administraatorid ühendavad selle jaotises **Seaded → Heym Work** selle aadressi ja integratsioonivõtmega; sellel on Heymi meeskonnalt oma litsents.

Vt ka [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) ja [Human-in-the-Loop](./human-in-the-loop.md).

---

## Töölaua vahelehed

### [Workflows](../tabs/workflows-tab.md)

Workflows vaheleht on töölaua vaikevaade. See kuvab kahe paneeliga loendit: workflow'd ja kaustad tihedate ridadena vasakul ning valitud workflow eelvaade paremal koos selle triggeri, viimase käivituse ja sammudega, lisaks Open Workflow ja Run Now. Igal real on olekuribа (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), mille järgi saab Status rippmenüü filtreerida. Workflow'd, millel pole trigger-nodet, tähistatakse selle järgi, kuidas selle viimane käivitus algas – API HTTP-kutse korral, SubWorker vanem-workflow korral, Portal selle avaliku chat'i korral – ja see jääb Manual olekusse kuni käivitamiseni. Kaustad ja alamkaustad haldavad [organisatsiooni](./workflow-organization.md). Looge workflow'sid New Workflow abil, lohistage ja kukutage JSON [importimiseks](./download-import.md) ning redigeerige või kustutage rea toimingute kaudu. Workflow'sid saab kaustade vahel liigutada; kustutamine on ajastatud (prügikast) enne jäädavat eemaldamist.

Vt ka [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) ja [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Tahvel](../tabs/board-tab.md)

Agentne kanban-tahvel, kus kaardid on püsivad tööd. Konfigureerige iga veerg järjestatud workflow-ahelaga; kaardi liigutamine veergu käivitab ahela kaardi täieliku kontekstiga (sisu, kommentaarid, ajalugu, varasemad väljundid). Tulemused kirjutatakse tagasi kaardile – roheline õnnestumise korral, punane ebaõnnestumise korral, merevaigukollane käivitamise ajal. Järelvoorud käivitavad uuesti praeguse veeru ahela kõige seni kogunenuga, mis toetab iteratiivset planeerimist. Käivitused salvestatakse [Execution History](./execution-history.md) `board` triggeri allikaga. Kui kaardi käivitus on aktiivne, avab **Open live** täpselt selle käivituse animeeritud lõuendil koos astmeliste Debug-logidega.

Vt ka [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) ja [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Mallid](../tabs/templates-tab.md)

Mallid vaheleht võimaldab salvestada ja taaskasutada workflow-malle (täielikud workflow'd) ja node-malle (üksikud konfigureeritud node'id). Looge workflow-malle redaktorist (Share as Template) ja node-malle, tehes paremklõpsu node'il. Sirvige nähtavuse järgi (Everyone või Specific users/[teams](./teams.md)), rakendage mall uue workflow loomiseks või node'i lisamiseks lõuendile ning hallake oma jagatud malle.

Vt ka [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) ja [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Muutujad](../tabs/global-variables-tab.md)

Muutujad vaheleht haldab [Global Variable Store](./global-variables.md). Looge, redigeerige ja kustutage globaalseid muutujaid; määrake nimi, väärtus ja väärtuse tüüp (Auto, String, Number, Boolean, Array, Object). Muutujad on kasutajapõhised ja püsivad käivituste vahel. Viidake neile mis tahes workflow [avaldises](./expression-dsl.md) kujul `$global.variableName`. Muutujaid saab jagada teiste kasutajate või [meeskondadega](./teams.md).

Vt ka [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) ja [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Chat'i vahekaart on Heymi pikaajaliselt töötav agent-liides, mille abil saab tööruumi vestluse kaudu juhtida. Valige [mandaat](./credentials.md) ja mudel, seejärel paluge Chat'il vastata küsimustele, uurida workflow'de definitsioone, käivitada olemasolevaid workflow'sid, teha kokkuvõtteid käivitustest ja ajakavadest, esitada ühe workflow käivituste ajalugu (käivituste arv, olekute jaotus, viimane käivitus ja ühe käivituse üksikasjad nõudmisel), teatada, millised käivitused parasjagu töötavad (koos kulunud aja, praeguse sõlme ja lingiga iga aktiivse käivituse juurde), lahendada ootel inimhindamisi, luua ja täiendada workflow'sid sama AI Builderi mootoriga, mida kasutatakse redaktoris, või lisada kaarte kanban-tahvlitele loomulikus keeles. Uued kaardid algavad alati valitud tahvli esimeses veerus; kui saadaval on mitu tahvlit ja ühtegi ei nimetatud, esitab Chat enne kaardi loomist tahvli valiku.

Chat jätkab taustal töötamist ka pärast brauseri sulgemist. Vastuse voogedastuse ajal saate saata rohkem sõnumeid; Heym salvestab need andmebaasipõhisesse järjekorda, võimaldab teil järjekorras olevaid sõnumeid enne nende käivitumist muuta või kustutada ning käivitab need järjekorras, kui praegune vastus on lõppenud. Kui assistent vajab planeerimise üksikasju ja tagastab täpsustavaid küsimusi, peatub järjekord, kuni vastate nendele küsimustele, ja jätkub seejärel pärast planeerimisvastust.

Vastused voogedastatakse markdowni, reasiseste piltide, workflow eelvaatekaartide, kokkuklapitavate tööriistakutse kaartide, konteksti kasutuse ja automaatse konteksti tihendamisega. Chat toetab manuseid, häälensisestust, ettelugemise taasesitust, kopeerimistoiminguid, kiirprompte, kasutaja reegleid jaotisest [Settings](./user-settings.md) ja [globaalseid muutujaid](./global-variables.md) kontekstina.

Vt ka [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md) ja [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Credentials](../tabs/credentials-tab.md)

Mandaatide vahekaart haldab API võtmeid ja saladusi, mida sõlmed kasutavad. Lisage mandaate tüübi järgi (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere jne), andke neile nimed ja viidake neile workflow sõlmedes. Muutke või kustutage kaardilt; jagage kasutajatega e-posti teel või [tiimidega](./teams.md). Kõik väärtused on salvestamisel krüpteeritud ja liideses maskeeritud.

Vt ka [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) ja [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Vektorhoidlate vahekaart haldab vektorhoidlaid, mida kasutavad [RAG](../nodes/rag-node.md) sõlmed. Looge hoidla nime ja vektorhoidla [mandaadiga](./credentials.md) — *RAG: Qdrant + OpenAI* (väline Qdrant) või *RAG: Psql + OpenAI* (Heymi enda Postgres pgvectori kaudu), mis määrab hoidla taustsüsteemi — soovi korral määrake kogu nimi, seejärel laadige üles dokumendid (PDF, TXT jne). Hallake sisu (vaadake, kustutage allikaid), muutke hoidla üksikasju ja jagage hoidlaid kasutajatega. [RAG](../nodes/rag-node.md) sõlmes valige Database, valige vektorhoidla ning käivitage insert, upsert, delete või search toiminguid.

Vt ka [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md) ja [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP vahekaart konfigureerib Model Context Protocoli integratsiooni. Heym toetab kahte režiimi:

**Vaikimisi server** – Üks endpoint aadressil `/api/mcp/sse` eksponeerib kõiki MCP-toega workflow'sid. Vaadake ja genereerige uuesti oma API võtit, kopeerige kasutamisvalmis kliendi JSON, ühendage Cursor ühe klikiga või järgige Claude'i seadistamise voogu automaatse OAuth registreerimisega.

**Nimega serverid** – Looge mitu isoleeritud MCP endpointi, millest igaühel on oma UUID-põhine URL (`/api/mcp/servers/{uuid}/sse`) ja sõltumatu API võti. Määrake igale serverile kindlad workflow'd, et erinevad AI kliendid või meeskonnad näeksid ainult neile vajalikke tööriistu. Iga nimega server toetab samu autentimismeetodeid (API võti, Claude OAuth) ning sellel on oma Copy JSON ja Add to Cursor otseteed. Mõlemad endpointid toetavad SSE transporti (GET) ja Streamable HTTP transporti (POST). Workflow'de lülitamine nimega serveri sees viib selle määratud loendi algusesse, et muudetud rida jääks vaatevälja.

**Heym chat tööriist** – Kumbki režiim võib samuti eksponeerida [Chat](../tabs/chat-tab.md) mootorit ühe `heym_chat` tööriistana, mida lülitatakse iga pinna jaoks eraldi koos oma LLM mandaadi ja mudeliga (eeltäidetud teie eelistatud mudeliga jaotises [Settings](./user-settings.md)). MCP klient saadab ühe loomulikus keeles `message` ja mootor teeb ülejäänu: ehitab workflow'sid ehitusrežiimis (salvestamine, kuni viis testkäivitust, parandamine ja kontrollimine), käivitab workflow'sid, teostab analüütikat, käivitusi, reaalajas käivituse olekut, ajakavasid, tahvleid ja kaarte, meeskondi, globaalseid muutujaid, dokumentatsiooni otsingut ja inimest kaasavaid otsuseid. Hiljem Chatile lisatud võimalused on kättesaadavad sama tööriista kaudu ilma täiendava registreerimiseta. Iga kutse salvestatakse Chat vahekaardi ajalukku pistikuga märgitud vestlusena ja tagastab `conversation_id`, mille klient saab edasi anda lõime jätkamiseks.

Vt ka [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) ja [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Traces vahekaart näitab [LLM](../nodes/llm-node.md) käivituste jälgi. Loendi kohal olev statistikapäis võtab valitud ajavahemiku kokku KPI kaartidega (Calls, Tokens, Cost, Avg Latency, Error %) ja kolme diagrammiga — Tokens by Model, Cost by Model ja Calls Over Time (virnastatud õnnestumine vs viga). Üks **Time range** valija (1h / 24h / 7d / 30d / All; vaikimisi 7 päeva) filtreerib nii diagramme kui ka loendit koos. Kulu arvutatakse kasutajapõhisest [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table)-ist; mudelid, millel puudub hinnakujundus, kuvatakse reasisese hoiatusena, mis viitab sellele. Avage mis tahes jälg, et näha päringu ja vastuse payload'sid, ajastuse jaotust (llm_ms, tools_ms, mcp_list_ms), tööriistakutseid (nimi, argumendid, tulemus) ja kaasatud oskusi. Laiendatud sündmused kuvavad JSON-i—sealhulgas MCP ja JSON-RPC payload'sid—ahendatava puuna, mille esimene tase on vaikimisi avatud; **Tree / Raw** lülitab tagasi algse teksti juurde ja vigane JSON jääb loetavaks. Kasutage jälgi [Agent Node](../nodes/agent-node.md) ja [LLM](../nodes/llm-node.md) käitumise silumiseks ning payload'de kopeerimiseks või eksportimiseks.

Vt ka [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) ja [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Teavitused](../tabs/alerts-tab.md)

Teavituste vahekaart määratleb läviväärtuste tingimused ajaakna jooksul ja teatab, kui need ületatakse. Neli teavituse tüüpi katavad küsimused, mida operaatorid tegelikult küsivad: **vea läviväärtus** (kas see ebaõnnestus aknas rohkem kui N korda), **workflow kestus** (kas käivitused muutusid aeglasemaks, mõõdetuna maksimumi, keskmise või p95-na), **token / USD kulu** (kas kulutus ületas eelarve, arvutatuna sama hinnatabeli kaudu nagu [Käivitused](../tabs/traces-tab.md)) ja **käivituste arv** (kas see käivitus palju sagedamini kui peaks). Iga tüüpi hinnatakse teie valitud akna jooksul, mitte kunagi üksiku sündmuse põhjal, sest üks ebaõnnestunud käivitus on müra ja puhang on intsident. Teavitused jälgivad ühte workflow'd või kõiki workflow'sid, millele teil on juurdepääs.

Viie sammu viisard juhatab läbi tüübi, ulatuse, tingimuse, vastuse ja ülevaatamise. Ülevaatamise samm **tagasitestib** tingimuse esmalt, teatades, kui sageli oleks see viimase 24 tunni kuni 7 päeva jooksul käivitunud, nii et liiga madal läviväärtus püütakse kinni enne salvestamist, mitte pärast seda, kui see kellelegi teate saatis. Kirjeldage soovitut lihtsas keeles ja AI täidab iga sammu, mida suudab, märkides oma oletused; osaline taotlus liigutab viisardit siiski edasi, avades esimesel sammul, mis vajab veel otsust, mitte ei sunni teid otsast alustama. Vaikimisi käivitub teavitus üks kord ja jääb vaikseks, kuni mõõdik taastub; selle asemel võite lasta sellel korrata intervalliga.

Vastuse sammul saab teavitus luua ja määrata uue workflow, mis käivitub selle vallandumisel, kasutada olemasolevat või mitte teha midagi. Vallandumise payload sisaldab vaadeldud väärtust, läviväärtust, akent ja workflow'sid, mis arvu panustasid, mille kaudu teavitused jõuavad Slacki, e-postile või Telegrami, kasutades node'sid, mis teil juba olemas on. Vallandumiste ajalugu salvestab, mis oli tõsi iga teavituse vallandumise hetkel, ja seda hoitakse 90 päeva; vallandumise kinnitamine muudab märgi olekust Vallandub olekusse Kinnitatud, teeseldes, et tingimus on kadunud. [Chat](../tabs/chat-tab.md) vahekaart suudab vastata, millised teavitused eksisteerivad ja miks või millal üks käivitus. Teavitusi saab jagada kasutajate ja [tiimidega](../tabs/teams-tab.md).

Vt ka [Analüütika](../tabs/analytics-tab.md), [Käivitused](../tabs/traces-tab.md) ja [Käivituste ajalugu](./execution-history.md).

### [Analüütika](../tabs/analytics-tab.md)

Analüütika vahekaart näitab käivituste mõõdikuid ja trende. Kokkuvõtlikud näitajad hõlmavad käivituste koguarvu, õnnestumise määra, vigade määra, latentsuse jaotusi ja kogu **Säästetud aega** (iga workflow hinnanguliste säästetud minutite summa käivituse kohta × selle õnnestunud käivitused). Enim kasutatud loetleb sama summat workflow'de kaupa. Valige baasaja vahemik (24h, 7d, 30d või kõik), soovi korral filtreerige workflow järgi, seejärel lohistage üle mis tahes diagrammi, et süveneda valitud kuupäevavahemikku. Diagrammid ja workflow tabelid värskenduvad vastavalt valikule ning automaatne värskendamine hoiab mõõdikud ajakohastena. See täiendab [Käivituste ajalugu](./execution-history.md) ja [Ajakavade](../tabs/scheduled-tab.md) vaadet, kui vajate nii varasemaid tulemusi kui ka tulevasi käivitusi.

Vt ka [Käivituste ajalugu](./execution-history.md), [Ajakavad](../tabs/scheduled-tab.md) ja [Hindamised](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Vaadake analüütika demot</a></p>

### [Tahvel](../tabs/dashboard-tab.md)

Tahvli vahekaart on Grafana-stiilis ruum, kus ehitate diagrammi vidinate ruudustikke, millest igaüks on renderdatud oma peidetud Heym workflow'st. Hoidke nii palju tahvleid kui vajate ja jagage igaüht kasutajate või tiimidega, kirjutuskaitstuna või muudetavana; vidinad töötavad alati omaniku mandaatidega, nii et kõik näevad samu andmeid. Kirjeldage mõõdikut lihtsas keeles ja AI genereerib vidina, või lisage üks käsitsi ja valige diagrammi tüüp, eelvaadatuna näidisandmetega: tulp, joon, ala, sektor, tabel, numbriline, näidik, hajuvus, proportsioon, tulbanäidik, tekst või HITL. HITL on karussell teie ootel inimülevaatustest. Päis näitab `1/n ootel`. Workflow nimi avab selle käivituse lõuendil. **Kinnita**, **Taotle muudatusi** ja **Lükka tagasi** lahendavad selle ning vidina pealkirja kõrval olev ajaloo ikoon avab selle käivituse ajaloo dialoogis samal lehel. Vidinad vahemällu salvestavad oma tulemused, neid saab AI-ga peenhäälestada (iga muudatus salvestatakse [Muudatuste ajalukku](./edit-history.md)), kloonida koos nende täieliku workflow'ga, ümber korraldada käsuga Korrasta ning lohistada või suurust muuta redigeerimisrežiimis. Tabelid võivad kuvada olekusilte ja siduda oma read üksikasjaliku töölaudaga, mis loeb klõpsatud rea kirjet kui `$page.record`, ning Run-vidin käivitab workflow otse töölaualt: lohistatud failil, oma sisendväljadega või nupuga Käivita. Kuna iga vidin on workflow, saab mis tahes andmeid, mida suudate hankida — [HTTP](../nodes/http-node.md) päring, [BigQuery](../nodes/bigquery-node.md) päring, [RAG](../nodes/rag-node.md) otsing või [LLM](../nodes/llm-node.md) väljund — muuta diagrammiks. HITL-vidina seaded võivad kitsendada selle ühe workflow ülevaatustele või selles olevale agendi või Slacki kinnitusetapile; selline vidin näitab neid kõigile, kes saavad selle workflow avada, ja on peidetud kõigile, kes seda ei saa.

Vt ka [Diagrammi väljundi node](../nodes/chart-output-node.md), [Analüütika](../tabs/analytics-tab.md) ja [Käivituste ajalugu](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Vaadake tahvli demot</a></p>
### [Hindamised](../tabs/evals-tab.md)

Vahekaart Hindamised (asub `/evals`) võimaldab luua hindamiskomplekte, lisada või genereerida testjuhtumeid, optimeerida komplekti prompti ning käivitada hindamisi [Agent Node](../nodes/agent-node.md) workflow'de vastu. Valige üks või mitu mudelit, valige hindamismeetod (Exact Match, Contains või LLM-as-Judge), soovi korral laske eraldi mudelil või [Decision Model](../nodes/decision-node.md) sõlmel hinnata LLM-as-Judge vastuseid, määrake käivituste arv testi kohta (lisaks temperature ja reasoning effort Exact Match'i ja Contains'i puhul), seejärel võrrelge läbimist/ebaõnnestumist ja iga mudeli väljundeid. Vaadake varasemate hindamiste käivituste ajalugu, sealhulgas iga käivituse juures kasutatud hindajat, käivitage üks uuesti sama hindajaga, eksportige see JSON-ina ning kontrollige aluseks olevat käitumist jaotises [Käivitused](../tabs/traces-tab.md).

Vt ka [Agent Node](../nodes/agent-node.md), [Käivitused](../tabs/traces-tab.md) ja [Käivituste ajalugu](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Meeskonnad](../tabs/teams-tab.md)

Vahekaart Meeskonnad võimaldab luua ja hallata meeskondi. Looge meeskond, lisage liikmeid e-posti teel ja eemaldage liikmeid (looja eemaldamine ei ole võimalik). Jagage [workflow'sid](../tabs/workflows-tab.md), [malle](../tabs/templates-tab.md), [mandaate](../tabs/credentials-tab.md), [muutujaid](../tabs/global-variables-tab.md), [vektorhoidlaid](../tabs/vectorstores-tab.md) ja [Drive'i faile](../tabs/drive-tab.md) meeskondadega nende vastavate jagamisdialoogide kaudu; kõik meeskonnaliikmed saavad juurdepääsu. Muutke meeskonna nime ja kirjeldust või kustutage meeskond (eemaldab kõik meeskonna jagamised).

Vt ka [Meeskonnad](./teams.md), [Mandaatide jagamine](./credentials-sharing.md) ja [Workflow'de korraldamine](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Ajakavad](../tabs/scheduled-tab.md)

Vahekaart Ajakavad kuvab kõiki aktiivseid [Cron](../nodes/cron-node.md) workflow'sid visuaalsel kalendril. Vahetage päeva, nädala ja kuu vaadete vahel, et näha, millal teie automatiseerimised on käivitamiseks ajastatud, seejärel hüpake tagasi seotud [workflow](../tabs/workflows-tab.md) juurde, kui on vaja ajakava muuta.

Vt ka [Cron](../nodes/cron-node.md), [Analüütika](../tabs/analytics-tab.md) ja [Käivituste ajalugu](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

### [Logid](../tabs/logs-tab.md)

Vahekaart Logid kuvab Heymi stack'i (backend, frontend, PostgreSQL) Docker-konteinerite logisid. Valige konteiner(id), filtreerige logitaseme järgi (All, INFO, WARNING, ERROR, DEBUG) ja otsige logide seest. Kasutage seda silumiseks ja tõrkeotsinguks. Workflow'de käivitamise logide (sõlmede tulemused, väljundid) jaoks kasutage selle asemel [Käivituste ajalugu](./execution-history.md), [Käivitused](../tabs/traces-tab.md) või redaktori Debug-paneeli.

Vt ka [Käivituste ajalugu](./execution-history.md), [Käivitused](../tabs/traces-tab.md) ja [Lõuendi funktsioonid](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

### [Andmetabel](../tabs/datatable-tab.md)

Vahekaart Andmetabel võimaldab luua ja hallata struktureeritud andmetabeleid Heymi sees. Määratlege tüpiseeritud veerud (string, number, boolean, date, JSON), hallake ridu reasisese topeltklõpsuga redigeerimisega, importige/eksportige CSV-d ning jagage tabeleid kasutajate või [meeskondadega](./teams.md) lugemis-/kirjutamisõigustega. Kasutage [DataTable node](../nodes/datatable-node.md) sõlme, et tabelitele workflow'des programmiliselt juurde pääseda. Kinnitatud jaotis **System tables** ülaosas majutab **LLM Cost Table**'it: fikseeritud skeemiga vaade mudelipõhistele hindadele, mis on taustal Helicone'ist alglaaditud (24-tunnine TTL, käsitsi Refresh), kus iga kasutaja saab hindu üle kirjutada või lisada kohandatud ridu mudelitele, mida Helicone ei loetle. Need hinnareeglid juhivad kulude KPI-d ja mudelipõhist kulugraafikut [Käivitused](../tabs/traces-tab.md) vahekaardil.

Vt ka [DataTable node](../nodes/datatable-node.md), [Käivitused](../tabs/traces-tab.md), [Workflow struktuur](./workflow-structure.md) ja [Meeskonnad](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>
### [Drive](../tabs/drive-tab.md)

Vahekaart Drive kuvab kõiki faile, mille skillid on teie workflow'de käigus genereerinud. See loetleb iga faili nime, tüübi, suuruse, lähtesõlme, loomiskuupäeva ja meeskonnaga jagamise oleku ning pakub otsingu-, autenditud allalaadimise, jagamise, kustutamise ja lehekülgedeks jaotamise juhtelemente. See on armatuurlaua kaaslane dokumentidele [File Generation](./file-generation.md), [Drive](./drive.md) viide ja [Drive node](../nodes/drive-node.md).

Vt ka [Drive](./drive.md), [File Generation](./file-generation.md) ja [Drive node](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Vaadake Drive demo</a></p>

### [Koostöö lõuendil](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
