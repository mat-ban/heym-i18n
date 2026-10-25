# Heym Pilns Funkcionalitātes Kopums

Visaptveroša pārskats par visām Heym iespējām. Katrs sections apraksta funkciju vai jēdzienu dažās teikumu.

---

## Sākt darbu

### [Ievads](../getting-started/introduction.md)

Heym ir infrastruktūra AI aģentu darbībai un pārvaldībai ražošanā. Jūs veidojat aģentus sistēmas uz vizuālas kanvas un darbojaties ar pārliecību: orķestrējiet aģentus, automatizējiet biznesa procesus, pārbaudiet katru izpildi un saglabājiet cilvēku kontroli uz savas infrastruktūras. Tā atbalsta vizuālos workflows, AI jaudīgus mezglus ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Palīgu](./ai-assistant.md), integrācijas ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), ienākošais [IMAP Trigger](../nodes/imap-trigger-node.md) e-pasts, izejošais [Send Email](../nodes/send-email-node.md)), plānošanu ar [Cron](../nodes/cron-node.md) un [Portal](./portal.md) čata portāliem gala lietotājiem.

Skatiet arī [Pamatjēdzieni](../getting-started/core-concepts.md), [Mezglu veidi](./node-types.md) un [Trešo pušu integrācijas](./integrations.md).

### [Kāpēc Heym](../getting-started/why-heym.md)

Kāpēc Heym izklāsta aģenta dzīves ciklu (veidošana, orķestrēšana, darbība, novērošana, novērtēšana, kontrole, ekspozīcija) un parāda, ko viens pašuzņēmuma izpildes laiks apstrādā katrā posmā. Tas aptver [LLM](../nodes/llm-node.md) mezglu un [Agent Node](../nodes/agent-node.md) ar rīku izsaukumiem, Python rīkiem, [MCP](../tabs/mcp-tab.md) savienojumiem, prasmēm un vairāku aģentu orķestrāciju; trigerus, atkārtojumus un [slodzes sadalījumu](./cluster.md); [Izpildes](../tabs/traces-tab.md) ar katras izpildes USD izmaksām un OpenTelemetry eksportu; [Novērtējumus](../tabs/evals-tab.md); [cilvēku pārbaudes punktus](./human-in-the-loop.md), aizsargjoslas, SSO un revīzijas pēdas; un REST, MCP un Portal galapunktus. Spēju salīdzinājums ar n8n, Zapier un Make.com noslēdz lapu.

Skatiet arī [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) un [Aģenta arhitektūra](./agent-architecture.md).

### [Ātrā sākšana](../getting-started/quick-start.md)

Iegūstiet savu pirmo workflow darbību dažu minūšu laikā: izveidojiet workflow no [Workflows](../tabs/workflows-tab.md) cilnes, pievienojiet [Input](../nodes/input-node.md) mezglu, [LLM](../nodes/llm-node.md) mezglu un [Output](../nodes/output-node.md) mezglu, pēc tam savienojiet tos. Konfigurējiet [LLM](../nodes/llm-node.md) ar akreditācijas datiem un iestatiet `userMessage` uz `$input.text`; izmantojiet Run vai [AI Palīgu](./ai-assistant.md), lai izpildītu vai ģenerētu workflows ar dabisko valodu.

Dabiski sader ar [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) un [Expression DSL](./expression-dsl.md).

### [Pamatjēdzieni](../getting-started/core-concepts.md)

Workflows ir virzīti grafi ar mezgliem, kas savienoti ar malām; izpilde plūst no trigeru mezgliem ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) caur apstrādes mezgliem uz [Output](../nodes/output-node.md) mezgliem. Katram mezglam ir tips, dati (konfigurācija) un ieejas/izejas; malas nosaka datu plūsmu. Mezgli atsaucas uz augšupvērstiem datiem, izmantojot [Expression DSL](./expression-dsl.md) izteiksmes, piemēram, `$nodeLabel.field`; neatkarīgi mezgli darbojas [paralēli](./parallel-execution.md) automātiski.

Skatiet arī [Triggers](./triggers.md), [Paralēlā izpilde](./parallel-execution.md) un [Workflow struktūra](./workflow-structure.md).

### [Darbība un izvietošana](../getting-started/running-and-deployment.md)

Heym nodrošina `run.sh` lokālai izstrādei (datubāze Docker, FastAPI aizmugure, Vite priekšpuse) un `deploy.sh` ražošanai ar Docker Compose. Abi izmanto `.env` failu; galvenie mainīgie ietver `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` un `ALLOW_REGISTER`. Izstrāde darbojas uz konfigurējamiem priekšpuses un aizmugures portiem; ražošana nodrošina API zem `/api` caur priekšpuses konteineru.

Skatiet arī [Drošība](./security.md), [Uzņēmējdarbība](./enterprise.md) un [Iestatījumi](./user-settings.md).

### [Migrēt uz Heym](../getting-started/migrate-to-heym.md)

AI Convert rīks pārvērš workflow no citas platformas (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) vai vienkāršas angļu valodas apraksta par Heym workflow, straumējot tiešraidē uz kanvas un gatavu [lejupielādei un importēšanai](./download-import.md). Tas veic AI drošības pārbaudi, pēc tam ģenerē DSL ar ievades un ātruma ierobežojumiem. Atveriet to pie [heym.run/convert](https://heym.run/convert).

Skatiet arī [Ātrā sākšana](../getting-started/quick-start.md), [Lejupielādēt un importēt](./download-import.md) un [AI Palīgs](./ai-assistant.md).

---

## Mezgli

### Trigeri
#### [Ievades mezgls](../nodes/input-node.md)

Ievades mezgls ir ieejas punkts darbplūsmām, kas saņem datus no lietotāja vai API izsaucēja. Tas atbalsta vienu vai vairākus ievades laukus un izsaka pieprasījuma metadatus (virsraksti, vaicājumu parametri). Piekļūstiet ķermeņa laukiem, izmantojot `$nodeLabel.body.fieldKey`, virsrakstiem, izmantojot `$nodeLabel.headers`, un vaicājumiem, izmantojot `$nodeLabel.query`.

Tas dabiski sader ar [Nosacījumu](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) un [Izvadi](../nodes/output-node.md). Par payload atsaucēm un lauku piekļuvi skatiet [Izteiksmju DSL](./expression-dsl.md) un [Webhookus](./webhooks.md).

#### [Cron mezgls](../nodes/cron-node.md)

Cron mezgls aktivizē darbplūsmu pēc grafika, izmantojot standarta piecu lauku cron izteiksmi. Lietotāja ievade nav nepieciešama — darbplūsma automātiski darbojas noteiktajos laikos (piemēram, katru stundu, katru dienu, ik pēc 15 minūtēm). Izvade ir aktivizēšanas notikums bez payload.

Skatiet arī [Aktivizētājus](./triggers.md), [Gaidīt](../nodes/wait-node.md) un [Izpildes vēsturi](./execution-history.md) plānotām un aizkavētām izpildēm.

#### [IMAP Aktivizētājs](../nodes/imap-trigger-node.md)

IMAP Aktivizētāja mezgls pārbauda iesūtnes uz konfigurējamu minūšu intervālu un sāk darbplūsmu katram jaunatklātajam e-pastam. Tas izvada analizētus virsrakstus, sūtītāju un saņēmēju sarakstus, parasto tekstu un HTML ķermeņus, pielikumu metadatus un aktivizēšanas laiku. Izmantojiet to atbalsta iesūtnes triāžai, pastkastes uz [Slack](../nodes/slack-node.md) maršrutēšanai vai e-pasta vadītām apstiprināšanas plūsmām ar [Cilvēku ciklā](./human-in-the-loop.md).

Tas sader ar [Sūtīt e-pastu](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) un [Slack](../nodes/slack-node.md) ienākošo triāžu un atbilžu darbplūsmām.

#### [Heym Aktivizētājs](../nodes/heym-trigger-node.md)

Heym Aktivizētāja mezgls sāk darbplūsmu, kad Heym pats publicē platformas notikumu: `heym.started`, `workflow.created`, `workflow.updated` vai `workflow.deleted`. Piegāde tiek grupēta - katrs notikums, kas publicēts vienā piecu sekunžu nosūtīšanas logā, ierodas vienā izpildē kā `$nodeLabel.events`, vienmēr masīvā. Katrs notikums tiek pieprasīts caur unikālu datu bāzes ierobežojumu, tāpēc tas tiek aktivizēts tieši vienu reizi katram abonējošajam mezglam, neatkarīgi no tā, cik daudz darbinieku, konteineru vai mašīnu darbojas. Izmantojiet to darbplūsmas izmaiņu audita takām, izvietošanas paziņojumiem un instanču veselības kopsavilkumiem.

Tas sader ar [Heym](../nodes/heym-node.md) mezglu, lai meklētu mainīto darbplūsmu, un ar [Ciklu](../nodes/loop-node.md), lai rīkotos reizi par notikumu.

#### [Heym mezgls](../nodes/heym-node.md)

Heym mezgls lasa Heym paša datus, izmantojot trīs operācijas: `listWorkflows` atgriež katru darbplūsmu, kuru īpašnieks var sasniegt ar mezglu skaitiem un laika zīmēm, `getWorkflow` atgriež vienas darbplūsmas mezglu un malas struktūru, un `getExecutionHistory` atgriež izpildes vēstures ierakstus jaunākos vispirms ar opcijām statusa, laika loga un ierobežojumu filtriem, kopā ar kopējām summām, kas grupētas pēc statusa. Rezultāti ir ierobežoti līdz darbplūsmas īpašniekam, kurā mezgls atrodas, tāpēc izpilde, ko uzsāka cron, portāls vai notikums, atgriež tos pašus datus kā manuāla izpilde. `getWorkflow` atgriež pilnu mezgla konfigurāciju, kas padara iespējamu darbplūsmas auditu par cieti kodētiem atslēgām vai tokeniem; tas neizsaka neko, ko darbplūsmas īpašnieks jau nevarētu atvērt redaktorā. Akreditācijas dati nav nepieciešami.

#### [WebSocket Aktivizētājs](../nodes/websocket-trigger-node.md)

WebSocket Aktivizētāja mezgls atver izejošo klienta savienojumu ar ārēju WebSocket serveri un sāk darbplūsmu uz `onMessage`, `onConnected` vai `onClosed`. Tas izsaka analizētus ziņojumu payload, atkārtotas savienojuma stāvokli, slēgšanas metadatus un socket URL tālākām izteiksmēm.

Tas sader ar [WebSocket Sūtīt](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) un [SSE Straumēšanu](./sse-streaming.md) reāllaika integrācijām.

#### [Telegram Aktivizētājs](../nodes/telegram-trigger-node.md)

Telegram Aktivizētāja mezgls saņem bot webhook atjauninājumus un nekavējoties sāk darbplūsmu. Tas izsaka pilnu atjauninājumu payload, galveno ziņojuma objektu, atbildes vaicājumus, sanitizētus virsrakstus un aktivizēšanas laiku. Izmantojiet to čatbotu, AI asistentu [Telegram](../nodes/telegram-node.md) un pogu vadītām plūsmām.

Tas sader ar [Telegram](../nodes/telegram-node.md), [Aģenta mezglu](../nodes/agent-node.md) un [Webhookiem](./webhooks.md) botu vadītām darbplūsmām.

#### [Slack Aktivizētājs](../nodes/slack-trigger-node.md)

Slack Aktivizētāja mezgls saņem Slack Events API webhookus un automātiski sāk darbplūsmu pēc pieprasījuma paraksta pārbaudes. Tas izsaka notikumu payload un sanitizētus virsrakstus tālākai maršrutēšanai, [LLM](../nodes/llm-node.md) balstītai klasifikācijai un atbilžu plūsmām.

Tas sader ar [Slack](../nodes/slack-node.md), [Aģenta mezglu](../nodes/agent-node.md) un [Trešo pušu integrācijām](./integrations.md).

#### [Discord Aktivizētājs](../nodes/discord-trigger-node.md)

Discord Aktivizētāja mezgls saņem Discord Interactions API webhookus, pārbauda Ed25519 parakstus ar izvēlēto `discord_trigger` akreditācijas datu, un sāk darbplūsmu. Tas izsaka pilnu mijiedarbības payload, komandu datus, sanitizētus virsrakstus un aktivizēšanas metadatus tālākai maršrutēšanai vai atbildēm.

Tas sader ar [Izvadi](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Aģenta mezglu](../nodes/agent-node.md) un [Trešo pušu integrācijām](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ mezgls sūta vai saņem ziņojumus no RabbitMQ rindām un apmaiņām. To izmanto ziņojumu vadītiem workflows un notikumu apstrādei. Sūtīšanas režīms publicē ziņojumu ar opciju aizkavēt; saņemšanas režīms darbojas kā [trigger](./triggers.md), tādējādi workflow sākas, kad ierodas ziņojums. Izvade ietver statusu, message_id un body.

Tas tiek kombinēts ar [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) un [Parallel Execution](./parallel-execution.md) notikumu vadītai apstrādei.

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler mezgls automātiski darbojas, kad jebkurš mezgls workflow neizdodas. Nav nepieciešamas ienākošās malas; to aktivizē dzinējs. Izvade ietver kļūdas ziņojumu, neizdevušā mezgla etiķeti, mezgla tipu un laika zīmogu. To var izmantot, lai sūtītu paziņojumus caur [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) vai [Send Email](../nodes/send-email-node.md), reģistrētu kļūdas vai atgrieztu pielāgotas kļūdu atbildes.

Kā alternatīva kļūdu apstrādei kanvā, workflow var arī deleģēt kļūdas uz atsevišķu workflow — skatiet [Error Workflow](#error-workflow). Ja kanvā jau ir Error Handler mezgls, kļūdu workflow **netiks** izsaukts (lokālais apstrādātājs ir prioritārs).

Biežākie paziņojumu mērķi ir [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) un [Send Email](../nodes/send-email-node.md); izpildes detaļas ir vieglāk pārbaudīt [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent mezgls ir [LLM](../nodes/llm-node.md) mezgls ar rīku izsaukšanu. Tas var darbināt Python rīkus, izsaukt savienotos kanvas mezglus kā rīkus, savienoties ar [MCP](../tabs/mcp-tab.md) serveriem, izmantot prasmes (instrukciju failus un opcionalus Python skriptus), darboties kā orķestrators, kas deleģē uz citiem aģentu mezgliem, un izsaukt citus workflows kā rīkus. Izvade ir pieejama kā `$nodeLabel.text`. Opcionālais **Extra Body** slēdzis pievieno JSON objektu ar pakalpojumu sniedzēja specifiskiem pieprasījuma parametriem katram pieprasījumam rīku izsaukšanas ciklā; tas pēc noklusējuma ir izslēgts. Opcionālais **Use Responses API** slēdzis novirza aģenta modeļa izsaukumus caur Responses API, kas saglabā modeļa loģiku rīku izsaukumu laikā, tādējādi loģikas modelis saglabā savu domāšanas ķēdi daudzsoļu ciklā; tas pēc noklusējuma ir izslēgts un darbojas ar OpenAI un pielāgotām akreditācijas datiem.

Kanvas mezglu rīki ļauj aģentam tieši izsaukt konfigurētos workflow mezglus no kanvas. Savienojiet atbalstītu mezglu ar aģenta rīku rokturi, pēc tam atzīmējiet konkrētus laukus kā aģenta nodrošinātus ar robota ikonu. Šie lauki kļūst par rīku parametriem izpildes laikā, kamēr akreditācijas dati un neatzīmētie lauki paliek fiksēti mezgla konfigurācijā.

Prasmju sadaļa tagad ietver **AI Build** jaunu prasmju izveidei, iekšējo AI rediģēšanas darbību esošām prasmēm, katras prasmes ZIP lejupielādi un opcionalo **Enable Drive files** slēdzi prasmēm, kas nepieciešamas, lai lasītu Heym Drive failus izpildes laikā. Prasmes veidotāja modālais logs straumē čata sarunu pa kreisi, pieņem drag-and-drop failus ar katru precizējuma komentāru, rāda tiešsaistes lasāmā priekšskatījuma versiju ģenerētajiem `SKILL.md` un `.py` failiem pa labi, var lejupielādēt šo priekšskatījumu kā ZIP un saglabā augšupielādētos precizējuma failus kā apvienotus prasmju aktīvus caur to pašu ZIP ievades plūsmu, ko izmanto manuālas augšupielādes.

Ar **[Agent Persistent Memory](./agent-persistent-memory.md)** iespējotu, katrs aģenta mezgls saglabā savu zināšanu grafu: fakti tiek ielādēti sistēmas promptā, kad tie nav tukši, un veiksmīgas izpildes aktivizē fona apvienošanu ar jauniem entītijiem un attiecībām. Apakšaģenti izmanto atsevišķus grafus. Jūs varat **dalīties** ar aģenta grafu ar citiem aģentiem (tādiem pašiem vai citiem workflows) ar lasīšanas vai lasīšanas/rakstīšanas piekļuvi no grafu dialoga. Kanvas smadzeņu kontrole atver grafu redaktoru.

Aģenta mezgli var arī ieiet [Human-in-the-Loop](./human-in-the-loop.md) režīmā. Šajā režīmā aģents saņem `request_human_review` rīku un var apstāties konkrētās apstiprinājuma nepieciešamajās darbībās, izveidot vienreizēju publisku pārskata saiti, atklāt `review` kanvas zaru paziņojumu plūsmām un gaidīt, līdz pārskatītājs pieņem, rediģē vai noraida Markdown pārskata tekstu. Mezgla HITL lauks darbojas kā apstiprinājuma vadlīnijas, kad jautāt, kamēr pārskatītāja kopsavilkums tiek ģenerēts no katra pārskata pieprasījuma. Attiecībā uz [MCP](../tabs/mcp-tab.md) rīkiem Heym izmanto modeli, lai interpretētu šos rakstiskos norādījumus kā `always`, `once` vai `never`, tādējādi brīvformāta apstiprinājuma valoda tiek kartota uz konkrētu izpildes politiku. Izpilde tiek atzīmēta kā `pending` un atsākas no saglabātā izpildes momentuzņēmuma pēc lēmuma saņemšanas, un tas pats aģenta izpildes process var apstāties vairāk nekā vienu reizi, ja vēlākas darbības arī prasa pārskatu.

Aģenta mezgli automātiski saspiest savu uzkrāto ziņojumu vēsturi, kad tā tuvojas 80% no modeļa konteksta loga. Sistēmas prompts, pirmais lietotāja ziņojums un visjaunākais lietotāja ziņojums vienmēr tiek saglabāti; viss starp tiem tiek kopsummēts, izmantojot to pašu modeli un akreditācijas datus. Saspiestās notikumi ir redzami Debug panelī, [Execution History](./execution-history.md) un [Traces](../tabs/traces-tab.md) cilnē.

Skatiet arī [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) un [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Codex mezgls darbojas ar OpenAI Codex CLI izolētā Heym darba vidē. Tas pieņem Codex akreditācijas datus (pierakstieties ar ChatGPT, lai izmantotu savu abonementu bez izmaksām par katru tokenu API, vai ielīmējiet piekļuves tokenu), GitHub akreditācijas datus, repozitorija URL, pamata filiāli, uzdevuma promptu, publikācijas režīmu (`diff_only` vai `draft_pr`), filiāles nosaukumu un laika ierobežojumu. Izpildītājs lokāli klonē repozitoriju, nodod ChatGPT tokenu komplektu vai `CODEX_ACCESS_TOKEN` tikai Codex procesam un atgriež strukturētu kopsavilkumu, validācijas piezīmes, mainītās failus, diff, lietošanas metadatus un opciju melnraksta PR URL.

Kad Codex atgriež `needs_input`, darba plūsma apstājas un tiek atklāta `question` filiāle. Savienojiet šo filiāli ar Slack, e-pastu vai citu paziņojumu mezglu; publiskais turpinājuma saite atsāk saglabāto izpildes momentuzņēmumu pēc atbildes iesniegšanas. Codex mezgls var tikt pievienots arī AI aģentam kā rīks, ļaujot aģentam deleģēt kodēšanas uzdevumus; kā rīks, `needs_input` rezultāts tiek atgriezts tieši aģentam, nevis apturot darba plūsmu.

Skatiet arī [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) un [Node Types](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go mezgls darbojas ar OpenCode CLI (Go) pret GitHub repozitoriju. Izolācija seko Codex paraugam: lokāli tas darbojas kā viesu apakšprocess, kamēr Docker izvietojumi to izpilda stingrā brāļa konteinerā, kas dalās ar darba vides apjomu. Tas pieņem OpenCode Go akreditācijas datus (vārtejas API atslēga ar opciju pamata URL), GitHub akreditācijas datus, repozitorija URL, pamata filiāli, uzdevuma promptu, publikācijas režīmu, filiāles nosaukumu, laika ierobežojumu un `opencode-go/<model>` modeli, kas izvēlēts no dzīvas, meklējamas modeļu saraksta (ar iebūvētu rezerves variantu). Heym veic visas git/GitHub operācijas uz viesdatora un nekad neievieto GitHub tokenu smilškastē; OpenCode tikai rediģē failus diskā. Mezgls atgriež strukturētu kopsavilkumu, validācijas piezīmes, mainītās failus, diff un opciju pieprasījuma URL. To var pievienot AI aģentam kā rīku.

Skatiet arī [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) un [Node Types](./node-types.md).

#### [LLM](../nodes/llm-node.md)

LLM mezgls apstrādā tekstu ar valodas modeli vai ģenerē attēlus. Tas atbalsta teksta ģenerēšanu, redzi (attēla ievadi), attēlu ģenerēšanu, strukturētu JSON izvadi, pakalpojumu sniedzēja vietējo Batch API izpildi atbalstītajiem OpenAI un OpenAI saderīgajiem galapunktiem, kā arī opciju **Use Responses API**, kas novirza izsaukumu caur Responses API, nevis Chat Completions (noklusējumā izslēgts; darbojas ar OpenAI un pielāgotām akreditācijām un nevar tikt apvienots ar Batch režīmu). Konfigurējiet akreditācijas datus, modeli, sistēmas un lietotāja ziņojumus, temperatūru un maksimālo tokenu skaitu; izmantojiet [Expression DSL](./expression-dsl.md) promptos. Batch režīmā `userMessage` jāatrisina kā masīvs, mezgls izvada `batchStatus` filiāli ar progresu, un galīgā izvade ietver rezultātus katram elementam. Opcija **Extra Body** pievieno JSON objektu ar pakalpojumu sniedzēja specifiskiem pieprasījuma parametriem (piemēram, `{"thinking": {"type": "disabled"}}`) katram API izsaukumam; noklusējumā izslēgts. Opcijas [Guardrails](./guardrails.md) bloķē nedrošu saturu pirms izsaukuma.

Dabiski sader ar [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) un [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Decision mezgls uzdod lēmumu modeli tipizētus jautājumus par izpildes stāvokli un atgriež varbūtības, nevis prozu. **State** lauks satur to, ko modelis jālasa — vienkārša izteiksme saglabā savu tipu, tāpēc `$input` nosūta objektu, nevis tā tekstu — un jautājumu saraksts satur spriedumus. Jautājumi nāk trīs formās: **noul** atbildes, vai nosacījums ir spēkā, **choice** izvēlas vienu opciju no definētā kopuma un atgriež pilnu sadalījumu, un **score** novērtē stāvokli pa kārtas līmeņiem un var atrasties starp tiem. Choice un score atbildes arī satur pārliecību, tāpēc [Switch](../nodes/switch-node.md) var novirzīt atbildi, kamēr [Condition](../nodes/condition-node.md) nosaka, cik pārliecināts tas bija. **Generate with AI** izstrādā stāvokļa veidni un jautājumu rindas no vienkāršas teikuma, un **Custom request body** nosūta roku rakstītu JSON uz galapunktu, kura līgums atšķiras. Pakalpojumu sniedzēja atbilde tiek nodota caur nesagrozītu, un katrs izsaukums tiek reģistrēts [Traces](../tabs/traces-tab.md).

Nepieciešama Decision Model akreditācija; dabiski sader ar [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) un [Agent Node](../nodes/agent-node.md).
#### [RAG / Vektoru krātuve](../nodes/rag-node.md)

RAG / Vektoru krātuves mezgls ievieto, atjauno, dzēš un meklē dokumentus vektoru krātuvē, lai veiktu atgūšanas uzlabotu ģenerāciju. Datubāzes nolaižamajā sarakstā tiek izvēlēts aizmugures risinājums — **Qdrant** (ārējais serveris) vai **Postgres (pgvector)** (Heym paša datubāze, bez ārējās pakalpojuma), noklusējuma iestatījums ir Qdrant. Izvēlieties vektoru krātuvi no [Vektoru krātuvēm](../tabs/vectorstores-tab.md) cilnes un iestatiet darbību uz ievietot, atjaunot, dzēst vai meklēt. Atjaunošana un dzēšana attiecas uz dokumentu, izmantojot unikālu id, kas glabājas payload — **Dokumenta ID lauks** nosaka šo lauku (noklusējums `doc_id`), un **Dokumenta ID** satur tā vērtību — tādējādi dokuments saglabā id, ko jau izmantojat savā sistēmā: atjaunošana aizstāj katru atbilstošo punktu pirms jaunās versijas saglabāšanas, un dzēšana ziņo, vai kaut kas atbilst. Dokumenta metadati pieņem izteiksmes savās vērtībās, tādējādi `{"url": "$start.url"}` saglabā to, ko izpilde radījusi. Meklēšana atbalsta metadatu filtrus, neobligātu **Hybrid Search** (vektoru līdzība apvienota ar BM25 atslēgvārdu atbilstību, lai precīzi termini, piemēram, ID un kļūdu kodi, tiktu atrasti blakus semantiskām atbilstībām) un neobligātu Cohere pārkārtošanu (reranking), un atgriež rezultātu masīvu ar text, score, metadata, reranked un hybrid karogiem un count izmantošanai [LLM](../nodes/llm-node.md) vai [Aģenta mezgla](../nodes/agent-node.md) plūsmās.

Biežākie lejupvērstie mezgli ir [LLM](../nodes/llm-node.md) un [Aģenta mezgls](../nodes/agent-node.md); vektoru krātuves iestatījumi atrodas [Vektoru krātuvēs](../tabs/vectorstores-tab.md).

#### [MCP Izsaukuma mezgls](../nodes/mcp-call-node.md)

MCP Izsaukuma mezgls tieši izsauc konkrētu [MCP](../tabs/mcp-tab.md) rīku, neļaujot LLM izlemt, kuru rīku izmantot. Izmantojiet to, kad precīzi zināt, kuru rīku palaist dizaina laikā — deterministiskai, vienas darbības MCP rīka izpildei darba plūsmā. Konfigurējiet savienojumu (SSE, Streamable HTTP vai stdio; tie paši lauki kā [Aģenta mezgla](../nodes/agent-node.md) MCP savienojumam), noklikšķiniet uz **Fetch Tools**, lai aizpildītu nolaižamo sarakstu, izvēlieties rīku un aizpildiet argumentu laukus, kas automātiski tiek attēloti no rīka ievades shēmas. Katrs arguments pieņem statisku vērtību vai [DSL izteiksmi](./expression-dsl.md), piemēram, `$userInput.body.text`. Rezultāts ir pieejams kā `$nodeLabel.result` (JSON objekts, ja to var analizēt, pretējā gadījumā virkne). MCP Izsaukuma mezgls nevar tikt savienots ar [Aģenta mezglu](../nodes/agent-node.md) kā kanvas rīks.

Skatiet arī [Aģenta mezglu](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) un [Izteiksmes DSL](./expression-dsl.md).

### Loģika

#### [Nosacījums](../nodes/condition-node.md)

Nosacījuma mezgls sadala darba plūsmu, pamatojoties uz if/else izteiksmi. Tam ir divi izejas rokturi: viens, kad nosacījums ir paties, un otrs, kad tas ir nepaties. Izmantojiet salīdzināšanas un loģiskos operatorus no [Izteiksmes DSL](./expression-dsl.md) nosacījuma izteiksmē; mezgls nodod ievadi izvēlētajai zarai.

Skatiet arī [Pārslēgt](../nodes/switch-node.md), [Izmest kļūdu](../nodes/throw-error-node.md) un [Izteiksmes DSL](./expression-dsl.md).

#### [Pārslēgt](../nodes/switch-node.md)

Pārslēgšanas mezgls novirza izpildi uz dažādiem ceļiem, salīdzinot vērtību ar gadījumiem. Konfigurējiet izteiksmi, ko novērtēt, un gadījumu vērtību sarakstu; katram gadījumam ir avota rokturis, un noklusējuma rokturis tiek izmantots neatsaucīgām vērtībām. Ievade tiek nodota atbilstošajai zarai.

Izmantojiet [Nosacījumu](../nodes/condition-node.md) binārajai dalīšanai un [Apvienošanu](../nodes/merge-node.md), lai atkal apvienotu novirzītos ceļus; atbilstības noteikumi ir aprakstīti [Izteiksmes DSL](./expression-dsl.md).

#### [Apvienot](../nodes/merge-node.md)

Apvienošanas mezgls gaida vairākas paralēlas ievades un apvieno tās vienā izejā. Iestatiet gaidāmo ievades skaitu; mezgls rada apvienotu objektu, kad visas zaras ir pabeigtas. Izmantojiet to, lai pievienotu rezultātus no paralēlām zarām pirms turpināšanas; neizmantojiet to, ja paralēlās zaras beidzas atsevišķos izejas mezglos.

Skatiet arī [Paralēla izpilde](./parallel-execution.md), [Cikls](../nodes/loop-node.md) un [Izeja](../nodes/output-node.md), kad atkārtoti apvienojat zaras.

#### [Cikls](../nodes/loop-node.md)

Cikla mezgls iterē pāri masīvam, izpildot lejupvērstos mezglus katram elementam. Tam ir nepieciešama atpakaļsavienojums no pēdējā mezgla iterācijas ķermenī, lai virzītos uz priekšu. Cikla ķermenī izmantojiet `item`, `index`, `total`, `isFirst` un `isLast`; ciklam ir atsevišķas izejas iterācijas ceļam un pabeigtajam ceļam.

Tas sader ar [Mainīgo](../nodes/variable-node.md), [Apvienošanu](../nodes/merge-node.md) un [Izteiksmes DSL](./expression-dsl.md) iteratīvām darba plūsmām.

### Dati

#### [Iestatīt](../nodes/set-node.md)

Iestatīšanas mezgls pārveido un kartē ievades datus uz pielāgotu izeju. Definējiet atslēgu-vērtību kartes, kur katra vērtība ir [Izteiksmes DSL](./expression-dsl.md) izteiksme. Izmantojiet to lielajiem burtiem, apakšvirknēm, konkatenācijai, nejaušiem skaitļiem un līdzīgām pārveidošanām. Piekļūstiet izejai pēc atslēgas (piemēram, `$setNode.keyName`). Kad tas ir savienots ar aģentu kā kanvas mezgla rīks, kartēšanas vērtības var tikt atzīmētas kā aģenta nodrošinātas, lai aģents tās aizpildītu izpildes laikā. Lai izsauktu citus darba plūsmus, izmantojiet [Izpildīt](../nodes/execute-node.md) mezglu.

Skatiet arī [Mainīgo](../nodes/variable-node.md), [Izpildīt](../nodes/execute-node.md) un [Izteiksmes DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Converter mezgls konvertē datus starp formātiem, neizmantojot kodu. Teksta konversijas ir `csvToJson` (CSV teksts uz rindu objektu masīvu vai masīviem, ja nav virsraksta), `jsonToCsv` (objektu/rindu masīvs uz CSV tekstu), `xmlToJson` (XML teksts uz objektu) un `jsonToXml` (objekts uz XML tekstu). Konfigurējiet konversijas virzienu un avota izteiksmi; CSV konversijām papildus tiek izmantots atdalītājs un virsraksta apstrāde, un `jsonToCsv` var noteikt skaidru kolonnu secību. Citēšana, iebūvēti atdalītāji un iebūvēti jauni rindiņas seko RFC 4180. XML atribūti izmanto `@` prefiksus, teksts, kas sajaukts ar atribūtiem, izmanto `#text`, atkārtoti elementi kļūst par masīviem, un XML entītiju paplašināšana ir atspējota. Tas pats mezgls darbojas arī ar uzglabātām failiem. `imageToText` un `pdfToText` izmanto Tesseract OCR, lasot failu no Heym Drive (`$Upload.file.id` no faila augšupielādes Trigger, Drive mezgla rezultāta vai aģenta ģenerēta faila), automātiski izvēloties valodu no atpazītā skripta vai izmantojot kodus, kurus norādāt, piemēram, `tur` vai `eng+tur`, un normalizējot tekstu uz UTF-8 pēc noklusējuma ar opciju NFC normalizāciju un šaurākiem rakstzīmju kopām, piemēram, `cp1254`. `fileConvert` pārraksta uzglabātu failu citā formātā, dokumentus caur pandoc un attēlus caur Pillow, un saglabā rezultātu kā jaunu Drive failu, neskarot oriģinālu. Rezultāts ir pieejams kā `$converterNode.result`, kopā ar `.language`, `.encoding`, `.page_count`, `.pages` un `.file` OCR izpildēm, un `.id`, `.filename` un `.download_url` `fileConvert`.

Skatiet arī [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) un [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Code mezgls izpilda Python kodu, ko Jūs rakstāt, ar savu `requirements.txt`, konteinerā, kas tiek izveidots un iznīcināts katras izpildes laikā. Jūsu kods definē `main(params)` funkciju un atgriež jebkuru JSON serializējamu vērtību, kas kļūst par `$codeNode.result`; viss, ko tas izdrukā, tiek atsevišķi saglabāts kā `$codeNode.logs`, un `$codeNode.install` ziņo, kurš rīks instalēja atkarības. Parametri tiek konfigurēti kā JSON objekts, kuru `$` izteiksmes tiek atrisinātas pirms izpildes, un kods tos lasa ar punktu notāciju, piemēram, `params.user.name` vai `params.orders[0].id`. Atkarības tiek instalētas ar `uv`, atkāpjoties uz `pip`, ja `uv` nevar apstrādāt pakotnes, bez kešatmiņas starp izpildēm; atstājot `requirements.txt` tukšu, tiek pilnībā izlaista instalācija un tas ir daudz ātrāk. Izpildes fāzē nav tīkla, ja `codeAllowNetwork` nav ieslēgts, kamēr atkarību instalācija vienmēr sasniedz PyPI. Sandboxes darbojas bez saknēm ar visām iespējām atslēgtām, lasāmā saknes failu sistēmā, bez Docker soketa un piekļuves aizmugures slepenajiem datiem, ierobežojot līdz 512 MB atmiņas, vienam CPU, 256 procesiem, 120 sekunžu instalācijai un 60 sekunžu izpildei. Docker ir nepieciešams, un nav rezerves režīma: bez sasniedzama deva mezgls neizdodas, nevis izpilda Jūsu kodu aizmugures procesā.

#### [Variable](../nodes/variable-node.md)

Variable mezgls iestata vai atjaunina darba plūsmas lokālo mainīgo (`$vars.variableName`) vai pastāvīgu [globālo mainīgo](./global-variables.md) (`$global.variableName`). Izmantojiet to skaitītājiem, uzkrātiem sarakstiem un kopīgai stāvokļa pārvaldībai. Konfigurējiet mainīgā nosaukumu, vērtības izteiksmi, tipa piespiedu pārvēršanu un vai uzglabāt globālajā krātuvē. Masīvu mainīgie atbalsta `$array()` un `.add()`.

Pāris ar [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) un [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Execute mezgls izsauc citu darba plūsmu (apakšdarba plūsmu) un nodod tai ievadi. Norādiet mērķa darba plūsmu pēc ID un sniedziet ievadi, izmantojot vienu izteiksmi vai atslēgu-vērtību kartēšanu. Izeja ietver workflow_id, statusu un izejas; izmantojiet to atkārtoti izmantojamai loģikai, nevis datu transformācijai (izmantojiet Set tam).

Skatiet arī [Canvas Features](./canvas-features.md) par Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) un [Output](../nodes/output-node.md).

### Integrations

#### [HTTP](../nodes/http-node.md)

HTTP mezgls veic HTTP pieprasījumus, izmantojot cURL stila konfigurāciju. Tas var būt darba plūsmas sākumpunkts (nav ienākošā malas) vai saņemt ievadi no augšupvērstiem mezgliem. Atbilde ir pieejama kā statuss, galvenes un ķermenis (parsēts JSON, ja piemērojams). Izmantojiet [Credentials](./credentials.md) Bearer vai pielāgotai galvenes autentifikācijai.

Pāris ar [Webhooks](./webhooks.md), [Credentials](./credentials.md) un [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

WebSocket Send mezgls atver izejošo klienta savienojumu, nosūta vienu teksta/JSON/binaru ziņojumu un to aizver. Izmantojiet to, lai publicētu darba plūsmas izeju reāllaika sistēmās, neveidojot Heym mitinātu soketa galapunktu.

Skatiet arī [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) un [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Telegram mezgls sūta bot ziņojumu uz čatu, grupu vai kanālu. Konfigurējiet Telegram [akreditācijas datus](./credentials.md), norādiet `chatId` un sastādiet izejošo `message` ar [Expression DSL](./expression-dsl.md) izteiksmēm. Tas dabiski sader ar [Telegram Trigger](../nodes/telegram-trigger-node.md) sarunu darbplūsmām un ar [Error Handler](../nodes/error-handler-node.md) operatoru brīdinājumiem.

Skatiet arī [Trešo pušu integrācijas](./integrations.md) un [Akreditācijas datus](./credentials.md) iestatīšanai un akreditācijas paraugiem.

#### [Slack](../nodes/slack-node.md)

Slack mezgls sūta ziņojumu uz Slack kanālu, izmantojot Ienākošo Webhook. Konfigurējiet Slack [akreditācijas datus](./credentials.md) un ziņojuma izteiksmi. Izmantojiet to paziņojumiem, brīdinājumiem un kļūdu ziņošanai; izeja tiek nodota caur ievadi.

Tas sader ar [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) un [Trešo pušu integrācijām](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Discord mezgls sūta ziņojumu uz Discord kanālu, izmantojot Ienākošo Webhook. Konfigurējiet Discord [akreditācijas datus](./credentials.md), sastādiet izejošo ziņojumu ar [Expression DSL](./expression-dsl.md) un, ja nepieciešams, norādiet webhook lietotājvārdu vai avataru.

Tas sader ar [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) un [Trešo pušu integrācijām](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Send Email mezgls sūta e-pastus, izmantojot SMTP. Konfigurējiet SMTP [akreditācijas datus](./credentials.md) un [Expression DSL](./expression-dsl.md) izteiksmes saņēmējiem, tēmai un saturam. Izmantojiet to paziņojumiem, brīdinājumiem un transakciju e-pastiem. Izeja ietver statusu, saņēmēju un tēmu.

[IMAP Trigger](../nodes/imap-trigger-node.md) papildina Send Email, apstrādājot ienākošo pastu. Kopā tie ļauj darbplūsmai lasīt ienākošo e-pastu no kopīgas iesūtnes, apkopot vai klasificēt to ar AI mezgliem un nosūtīt sekojošu vai eskalācijas ziņojumu. [Telegram Trigger](../nodes/telegram-trigger-node.md) un [Telegram mezgls](../nodes/telegram-node.md) nodrošina to pašu ienākošo/izejošo modeli bot vadītām sarunu darbplūsmām.

Divvirzienu paziņojumu plūsmām tas labi sader arī ar [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) un [Trešo pušu integrācijām](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Redis mezgls veic Redis operācijas: set, get, hasKey un deleteKey. Izmantojiet to kešatmiņai, ātruma ierobežošanai un atslēgu-vērtību glabāšanai. Konfigurējiet [akreditācijas datus](./credentials.md), operācijas veidu, atslēgas izteiksmi un, veicot set operācijas, vērtību un opcionalo TTL. Izeja atšķiras atkarībā no operācijas (vērtība, panākumi, eksistē, dzēsts).

Tas sader ar [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) un [Parallel Execution](./parallel-execution.md) kešatmiņai, ierobežošanai un koordinācijai.

#### [Grist](../nodes/grist-node.md)

Grist mezgls lasa, raksta un pārvalda datus Grist izklājlapās. Operācijas ietver getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables un listColumns. Norādiet dokumenta ID, tabulas ID un, veicot izveidi/atjaunināšanu, ieraksta datus, izmantojot kolonnas ID. Izmantojiet to CRUD, partijas atjauninājumiem un izklājlapu automatizācijai.

Skatiet arī [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) un [Trešo pušu integrācijas](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets mezgls lasa, raksta un pārvalda izklājlapu datus, izmantojot OAuth2. Izmantojiet to, lai lasītu ziņojumus, pievienotu darbplūsmas rezultātus, atjauninātu izsekošanas datus un notīrītu vai pārbaudītu lapu cilnes no darbplūsmas. Tāpat kā [BigQuery](../nodes/bigquery-node.md), tas izmanto Google atbalstītu integrācijas akreditāciju un labi iederas blakus [Grist](../nodes/grist-node.md), kad izklājlapu dati ir daļa no plūsmas.

Tas sader ar [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) un [Trešo pušu integrācijām](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery mezgls izpilda SQL vaicājumus un ievieto rindas Google BigQuery datu kopās, izmantojot OAuth2. Tas ir noderīgs analītikas darbplūsmām, ziņošanas cauruļvadiem un strukturētu notikumu datu rakstīšanai no darbplūsmu izpildēm. Tas bieži sader ar [Set](../nodes/set-node.md) rindas veidošanai un [Google Sheets](../nodes/google-sheets-node.md) vieglākai izklājlapu orientētai ziņošanai.

Tas sader ar [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) un [Trešo pušu integrācijām](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive mezgls uzskaita, lejupielādē, atjaunina un dzēš Drive failus un mapes, izmantojot OAuth2, un var kopēt Drive failu tieši uz [Heym Drive](../nodes/drive-node.md) ar tā `syncToHeymDrive` operāciju. Google Docs, Sheets un Slides nav lejupielādējamu baitus, tāpēc mezgls tos automātiski eksportē — Docs uz PDF, Sheets uz XLSX, Slides uz PPTX — ar mērķa formāta pārsniegšanu. Dzēšanas gadījumā vienumi tiek pārvietoti uz Drive atkritni, ja nav iespējota opcija "Dzēst pastāvīgi", un mezgls atsakās dzēst mapi, izmantojot faila operāciju vai otrādi. Tāpat kā [Google Sheets](../nodes/google-sheets-node.md), tas izmanto Google atbalstītu OAuth2 akreditācijas datu veidu; ņemiet vērā, ka šis pieprasa pilnīgu Drive piekļuvi, tāpēc pirms dalīšanās pārskatiet [Akreditācijas datu koplietošanu](./credentials-sharing.md).

Saderīgs ar [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) un [Trešo pušu integrācijām](./integrations.md).

#### [GitHub](../nodes/github-node.md)

GitHub mezgls nodrošina 40 vietējās GitHub REST darbības, kas aptver repozitorijus, organizācijas un lietotājus, problēmas, pull pieprasījumus, atsauksmes, izlaidumus, Actions workflows, satiksmes analīzi un repozitoriju failus. To var izmantot problēmu triāžai, atsauksmju automatizācijai, darba plūsmu izsaukšanai un pabeigšanas gaidīšanai, izlaidumu automatizācijai un repozitoriju failu atjaunināšanai bez nepieciešamības manuāli veidot HTTP pieprasījumus. Tas atbalsta GitHub.com un opciju GitHub Enterprise `base_url` akreditācijās.

Saderīgs ar [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) un [Trešo pušu integrācijām](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Jira mezgls savieno darba plūsmas ar Jira Cloud vai Jira Data Center / Server REST API, lai automatizētu projektus, problēmas, komentārus, pielikumus, lietotājus, paziņojumus un pārejas. Tas var uzskaitīt projektus, meklēt problēmas ar JQL, izveidot vai atjaunināt problēmas, pārbaudīt izmaiņu žurnālus, paziņot ieinteresētajām pusēm, pārvaldīt komentārus un pielikumus, iegūt vai pārvaldīt lietotājus, uzskaitīt pieejamās pārejas un pārvietot problēmas, izmantojot pārejas ID. Izmantojiet Jira akreditācijas datus ar Atlassian e-pastu, API tokenu, vietnes bāzes URL un izvietošanas režīmu.

Saderīgs ar [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) un [Trešo pušu integrācijām](./integrations.md) atbalsta pieņemšanai, kļūdu triāžai un izlaidumu darba plūsmām.

#### [Linear](../nodes/linear-node.md)

Linear mezgls savieno darba plūsmas ar Linear GraphQL API, lai automatizētu darba vietas un problēmas. Tas var uzskaitīt komandas, projektus, problēmas, darba plūsmas stāvokļus, komandas locekļus un komentārus; izveidot, atjaunināt, dzēst un saistīt problēmas; un izveidot, atjaunināt, atrisināt, neatrisināt vai dzēst komentārus. Izmantojiet Linear personīgo API atslēgu vai OAuth2 akreditācijas datus, pēc tam atklājiet komandas, projekta, stāvokļa un piešķirtā UUID no uzskaites operācijām pirms problēmu izveidošanas vai atjaunināšanas.

Saderīgs ar [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) un [Trešo pušu integrācijām](./integrations.md) pieņemšanai, triāžai un inženierijas uzkrājumu darba plūsmām.

#### [Supabase](../nodes/supabase-node.md)

Supabase mezgls lasa un maina tabulas, kas tiek izsniegtas caur Supabase PostgREST. Tas labi darbojas produktu aizmugurē, lietotāju/profila datiem, darba plūsmas stāvoklim un CRUD stila automatizācijām, kas vēlas piekļuvi datu bāzei bez pielāgotas HTTP pieprasījumu vadu izveides.

Saderīgs ar [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) un [Trešo pušu integrācijām](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse mezgls veic CRUD, skaitīšanas un neapstrādātu SQL operācijas pret ārējo ClickHouse datu bāzi, izmantojot tās HTTP saskarni. Tas ir piemērots analītikas cauruļvadiem, notikumu žurnālvēšanai un ziņošanas darba plūsmām: ievietojiet notikumus, kad tie notiek, pēc tam apkopojiet vai saskaitiet tos ar `query`/`count`. Tas atspoguļo [DataTable](../nodes/datatable-node.md) operāciju kopumu (find, getAll, count, getById, insert, update, remove, upsert) plus neapstrādātu SQL izbēgšanu, ar `update`/`remove`, kas darbojas kā ClickHouse mutācijas.

Saderīgs ar [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) plānotajiem ziņojumiem un [Trešo pušu integrācijām](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Notion mezgls pārvalda Notion datu bāzes, datu avotus, lapas un blokos, izmantojot pašreizējo Notion API (`2026-03-11`). Tas atbalsta meklēšanu, lapu CRUD, datu bāzes un datu avotu operācijas, bloku bērnus, pievienošanu/atjaunināšanu/dzēšanu blokus un atkritni/atjaunošanu. Izmantojiet iekšējo integrācijas tokenu vai Notion publiskās integrācijas OAuth akreditācijas datus. Redaktors var meklēt un lapot pieejamos datu avotus un vecākās lapas. Koplietotie akreditācijas dati darbojas tāpat kā īpašumā esošie akreditācijas dati darba plūsmu izpildei.

Pielāgotu REST izsaukumu gadījumā, `$credentials.YourNotionCredential` tiek atrisināts uz to pašu bearer token. Saderīgs ar [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) un [Trešo pušu integrācijām](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Sentry mezgls automatizē Sentry organizācijas, projektus, komandas, problēmas, notikumus un izlaidumus, izmantojot Sentry REST API. To var izmantot brīdinājumu triāžai, problēmu statusa atjauninājumiem, izlaidumu automatizācijai, notikumu meklēšanai un projektu/komandu iestatīšanai vai attīrīšanai. Tas atbalsta Sentry SaaS un pašuzņēmuma Sentry, izmantojot opciju akreditācijas datu bāzes URL.

Tas darbojas kopā ar [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) un [Third-Party Integrations](./integrations.md) incidentu un izlaidumu workflows.

#### [DataTable](../nodes/datatable-node.md)

DataTable mezgls lasa, raksta un pārvalda datus Heym DataTables (pirmās puses strukturētā glabāšanā). Operācijas ietver find, getAll, getById, insert, update, remove un upsert. Nav nepieciešami ārēji akreditācijas dati. Tabulas tiek pārvaldītas no [DataTable](../tabs/datatable-tab.md) informācijas paneļa cilnes un piekļūst tieši darba plūsmas īpašniekam.

Tas darbojas kopā ar [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) un [DataTable tab](../tabs/datatable-tab.md) pirmās puses strukturētai glabāšanai.

#### [Drive](../nodes/drive-node.md)

Drive mezgls pārvalda failus, kurus ģenerē prasmes tieši darba plūsmā. Operācijas ietver delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams un unshareWithMyTeams, lai pārvaldītu piekļuvi tikai lasīšanai komandām; formāta konversija tiek veikta [Converter](../nodes/converter-node.md) mezglā. Failu var atsaukt ar `$agentLabel._generated_files[0].id`; izejas ietver statusu, file_id, atjauninātu download_url saites ierobežojumiem un shared_team_count komandas koplietošanai. Tas ir īpaši noderīgi ar [Agent Node](../nodes/agent-node.md) workflows, kas izmanto [File Generation](./file-generation.md) un [Drive](./drive.md) atsauces modeli.

Bieži sastopamie partneri ir [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) un [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 mezgls veic objektu glabāšanas operācijas Amazon S3, izmantojot `s3` akreditāciju (piekļuves atslēga, slepenā atslēga, reģions, opcionalā sesijas atslēga). Operācijas ietver putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder un listBuckets. Teksta augšupielāde un teksta vai base64 lejupielāde tiek atbalstīta, ar bucket un key laukiem, kas pieņem [Expression DSL](./expression-dsl.md). To var izmantot, lai glabātu darba plūsmas izejas, arhivētu failus un lasītu objektus atpakaļ plūsmā.

Tas darbojas kopā ar [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) un [Third-Party Integrations](./integrations.md).

### Automatizācija

#### [Crawler](../nodes/crawler-node.md)

Crawler mezgls iegūst tīmekļa lapas, izmantojot FlareSolverr ar opciju HTML izvilkšanai, izmantojot CSS selektorus. Konfigurējiet FlareSolverr [akreditāciju](./credentials.md), URL izteiksmi, gaidīšanas laiku un opcionalos selektorus izvilkšanai. Izeja ir neapstrādāts HTML vai izvilktais saturs. To var izmantot tīmekļa skrāpēšanai un satura izvilkšanai.

Tas darbojas kopā ar [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) un [LLM](../nodes/llm-node.md) skrāpēšanas un analīzes plūsmām.

#### [Playwright](../nodes/playwright-node.md)

Playwright mezgls automatizē pārlūkprogrammas mijiedarbības ar konfigurējamiem soļiem (navigate, refresh, click, type, screenshot, extract, aiStep) vai **Run Code** režīmu pielāgotai Playwright Python (sandboxes; pēc noklusējuma izslēgts, izmantojot `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Tas atbalsta bezgalvas režīmu, opcionalo iestatījumu, kas samazina parastās Playwright automatizācijas signālus, laika ierobežojumus, opcionalo tīkla ierakstu (atbildes, sīkdatnes, localStorage, sessionStorage), sīkdatņu/glabāšanas stāvokļa autentifikācijas palaišanu no [Global Variables](./global-variables.md) izteiksmēm, piemēram, `$global.authState`, rezerves pieteikšanās soļus, kad autentifikācijas atjaunošana neizdodas, un AI soli ar Auto Heal, kad selektori neizdodas. To var izmantot tīmekļa skrāpēšanai, formu aizpildīšanai un pārlūkprogrammas balstītām darba plūsmām.

Skatiet arī [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) un [Execution History](./execution-history.md) pārlūkprogrammas automatizācijai un atkļūdošanai.

### Rīki

#### [Output](../nodes/output-node.md)

Output mezgls ir darba plūsmas galapunkts, kas atgriež atbildi izsaucējam. Iestatiet ziņojuma izteiksmi, lai atsauktos uz iepriekšējo mezglu pēc etiķetes (nekad neizmantojiet `$input` no [Input](../nodes/input-node.md) mezgla šeit). Opcionalais async downstream ļauj mezgliem pēc izejas darboties fonā pēc atbildes nosūtīšanas.

Biežie avoti ir [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) un [Execute](../nodes/execute-node.md); atbildes veidošana ir vieglāk atkļūdot [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper mezgls veido parastu JSON objektu no [Set](../nodes/set-node.md) stila atslēgu-vērtību kartējumiem un atgriež to darba plūsmas atbildes saknē. To izmanto, kad API izsaucējam jāsaņem neapstrādāta JSON ķermeņa atbilde, nevis standarta [Output](../nodes/output-node.md) mezgla apvalks.
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

HTML output mapper mezgls attēlo vienu HTML veidni, interpolējot `$nodeLabel.field` izteiksmes lapā. Kad tas ir darba plūsmas vienīgais terminālais mezgls, izpildes webhook atbild ar `text/html` un mezgla konfigurēto statusa kodu, nevis JSON ķermeni, tādējādi darba plūsma var tieši pasniegt lapu pārlūkprogrammā. Nosūtiet `X-Simple-Response: false`, lai saņemtu parasto JSON aploksni atpakaļ atkļūdošanai.

Pāris ar [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) un [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Chart Output mezgls ir terminālais mezgls [Dashboard](../tabs/dashboard-tab.md) logrīka darba plūsmā. Tas pārvērš augšupvērsto mezglu radītās rindas standartizētā diagrammas payload, ko attēlo dashboard. Izvēlieties `chartType` (stabiņš, līnija, laukums, pīrāgs, tabula, skaitlis, mērītājs, izkliedes, proporcija, stabiņa mērītājs, teksts vai HITL), kartējiet `labelField`/`valueField` (vai `series` vairāku sēriju gadījumā, vai `text` markdown ziņojumam) un novietojiet to pēdējā; tam nav izejas malas. HITL ignorē augšupvērstās rindas un uzskaita Jūsu gaidošās cilvēku atsauksmes. un citu kā saišu pogas, kas atver URL jaunā cilnē (`linkColumn`, ar `linkLabel` pogas tekstam)

Skatiet arī [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) un [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Wait mezgls aptur darba plūsmas izpildi uz noteiktu laiku milisekundēs, līdz 15 minūtēm. Izmantojiet to ātruma ierobežošanai, aizkavētām darbībām vai aptaukošanas intervāliem. Tas nodod ievadi nemainītu.

Pāris ar [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) un [Parallel Execution](./parallel-execution.md) tempu un aptaukošanai.

#### [Sticky Note](../nodes/sticky-note-node.md)

Sticky Note mezgls pievieno markdown piezīmes kanvai. Tas netiek izpildīts. Izmantojiet to dokumentācijai, instrukcijām vai darba plūsmas piezīmēm kopā ar citiem [Canvas Features](./canvas-features.md). Divreiz noklikšķiniet uz kanvas, lai rediģētu piezīmes saturu.

Skatiet arī [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) un [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Console Log mezgls reģistrē vērtību aizmugures (servera) konsolē. Izmantojiet to atkļūdošanai un pārbaudei izstrādes laikā. Reģistrācijas ziņojums atbalsta [Expression DSL](./expression-dsl.md) izteiksmes; izeja tiek nodota caur ievadi.

Pāris ar [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) un [Expression Evaluation Dialog](./expression-evaluation-dialog.md) atkļūdošanai.

#### [Disable Node](../nodes/disable-node.md)

Disable Node mezgls pastāvīgi atspējo citu mezglu darba plūsmā, iestādot tā `active` karogu uz false. Norādiet mērķa mezglu pēc etiķetes. Izmantojiet to vienreizējām operācijām, piemēram, [Cron](../nodes/cron-node.md) triggera apstādināšanai pēc nosacījuma izpildes.

Skatiet arī [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) un [Cron](../nodes/cron-node.md) darba plūsmas kontroles paraugiem.

#### [Enable Node](../nodes/enable-node.md)

Enable Node mezgls atkal ieslēdz citu mezglu, iestādot tā `active` karogu uz true un saglabājot izmaiņas. Norādiet mērķa mezglu pēc etiķetes. Izmantojiet to, lai atkārtoti aktivizētu atspējotu [Cron](../nodes/cron-node.md) triggeri no cita ieejas punkta vai lai ieslēgtu mezglu, kad nosacījums ir izpildīts. Mērķis, kas atrodas zem Enable Node un vēl nav izpildīts, arī tiek izpildīts pašreizējā izpildē.

Skatiet arī [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) un [Cron](../nodes/cron-node.md) darba plūsmas kontroles paraugiem.

#### [Throw Error](../nodes/throw-error-node.md)

Throw Error mezgls nekavējoties aptur darba plūsmas izpildi un atgriež kļūdas atbildi ar pielāgotu HTTP statusa kodu. Iestatiet kļūdas ziņojuma izteiksmi un statusa kodu (piemēram, 400, 401, 403, 404, 429, 500). Izmantojiet to validācijas kļūdām, neautorizētai piekļuvei vai citām kļūdu situācijām, īpaši, ja tas ir saistīts ar [Condition](../nodes/condition-node.md) un [Error Handler](../nodes/error-handler-node.md).

Pāris ar [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) un [Security](./security.md) skaidrām kļūdu ceļiem.

---

## Atsauce
### [Mezglu veidi](./node-types.md)

Heym piedāvā dažādus mezglu veidus: trigeri, piemēram, [Ievades mezgls](../nodes/input-node.md), [Cron mezgls](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) un [Kļūdu apstrādātājs](../nodes/error-handler-node.md); AI mezgli, piemēram, [LLM](../nodes/llm-node.md), [Lēmums](../nodes/decision-node.md), [Aģenta mezgls](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) un [MCP izsaukums](../nodes/mcp-call-node.md); loģikas mezgli, piemēram, [Nosacījums](../nodes/condition-node.md), [Pārslēgs](../nodes/switch-node.md), [Apvienot](../nodes/merge-node.md) un [Cikls](../nodes/loop-node.md); datu mezgli, piemēram, [Iestatīt](../nodes/set-node.md), [Pārvērstājs](../nodes/converter-node.md), [Kods](../nodes/code-node.md), [Mainīgais](../nodes/variable-node.md), [Izpildīt](../nodes/execute-node.md) un [Heym](../nodes/heym-node.md); integrācijas, piemēram, [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Sūtīt e-pastu](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Datu tabula](../nodes/datatable-node.md) un [Drive](../nodes/drive-node.md); automatizācijas mezgli, piemēram, [Crawler](../nodes/crawler-node.md) un [Playwright](../nodes/playwright-node.md); un utilītas, piemēram, [Gaidīt](../nodes/wait-node.md), [Izeja](../nodes/output-node.md), [JSON izejas kartotājs](../nodes/json-output-mapper-node.md), [HTML izejas kartotājs](../nodes/html-output-mapper-node.md), [Konsoles žurnāls](../nodes/console-log-node.md), [Izmest kļūdu](../nodes/throw-error-node.md), [Atspējot mezglu](../nodes/disable-node.md), [Iespējot mezglu](../nodes/enable-node.md) un [Piezīme](../nodes/sticky-note-node.md). Izmantojiet izteiksmes, piemēram, `$input.text` un `$nodeLabel.field` mezglu konfigurācijā.

Skatiet arī [Trigeri](./triggers.md), [Trešo pušu integrācijas](./integrations.md) un [Paralēlā izpilde](./parallel-execution.md).

### [Izteiksmes DSL](./expression-dsl.md)

Heym izmanto vienkāršu izteiksmju valodu, lai atsauktos uz datiem no augšupvērstajiem mezgliem. Izmantojiet `$input` [Ievades mezglam](../nodes/input-node.md), `$nodeLabel.field` jebkuram augšupvērstajam mezglam, `$credentials.CredentialName` akreditācijas datiem, un `$global.variableName` globālajiem mainīgajiem. Iebūvētās īpašās mainīgās ietver `$now`, `$UUID` un darba plūsmas metadatus: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` un `$executionId` (izpildes [Izpildes vēsture](./execution-history.md) id — `/workflows/{id}/{executionId}` atver šo izpildi kanvā; tikai izpildes laikā, tukšs izteiksmju priekšskatījuma dialogā). Atbalsts ietver literālus, aritmētiku, salīdzinājumus, [Cikla](../nodes/loop-node.md) kontekstu, ligzdotus laukus un virkņu/masīvu palīglīdzekļus (ieskaitot `$text.toJson()`, lai analizētu JSON virkni). Kad pilnā vērtība ir viens `$expr`, aizmugure saglabā masīvus, objektus, loģiskās vērtības un skaitļus kā dabiskos tipus.

Skatiet arī [Izteiksmju novērtēšanas dialogs](./expression-evaluation-dialog.md), [Globālie mainīgie](./global-variables.md) un [Darba plūsmas struktūra](./workflow-structure.md).

### [Globālie mainīgie](./global-variables.md)

Globālo mainīgo krātuve satur pastāvīgus, lietotāja apjoma atslēgu-vērtību datus, kas saglabājas darba plūsmu izpildes laikā. Izveidojiet mainīgos no [Mainīgo](../tabs/global-variables-tab.md) cilnes vai no [Mainīgā](../nodes/variable-node.md) mezgla ar "Saglabāt globālo mainīgo krātuvē" iespēju ieslēgtu. Piekļūstiet tiem ar `$global.variableName` izteiksmēs; tie var tikt kopīgoti ar citiem lietotājiem vai [komandām](./teams.md).

Pāri ar [Mainīgo](../nodes/variable-node.md), [Komandām](./teams.md) un [Akreditācijas datu koplietošanu](./credentials-sharing.md) kopīgai darba plūsmas stāvokļa pārvaldībai.
### [Izteiksmju novērtēšanas dialogs](./expression-evaluation-dialog.md)

Izteiksmju novērtēšanas dialogs ir paplašināms redaktors, kas parādās, kad Jūs noklikšķināt uz paplašināšanas pogas blakus izteiksmju laukiem. Tas atveras kā liels centrēts modāls logs, saglabā automātiskās pabeigšanas funkciju aktīvu un automātiski atsvaidzina aizmugures priekšskatījuma rezultātus pēc tam, kad Jūs pārtraucat rakstīšanu. Objektu un masīvu rezultātus var pārlūkot, izmantojot izejas ceļa izvēlni.Dialogs pieņem pilnas līnijas neapstrādātu punktu ceļu (piemēram, `myNode.output.field`), it kā tas būtu `$myNode.output.field`; skatiet [Izteiksmju DSL](./expression-dsl.md) novietojuma noteikumus.

Rīku joslā esošā poga **Izveidot ar AI** ļauj Jums aprakstīt izteiksmi, ko vēlaties, vienkāršā tekstā. Izvēlieties LLM [akreditācijas datus](./credentials.md) un modeli, ierakstiet aprakstu, piemēram, *"Iegūt klienta vārdu no API atbildes"*, un noklikšķiniet uz Ģenerēt. Aizmugure nosūta [Izteiksmju DSL](./expression-dsl.md) kontekstu un pēdējā izpildē iegūtos mezglus modelim un atgriež vienu izteiksmes virkni. Rezultāts tiek novērtēts nekavējoties, lai Jūs varētu to pārbaudīt pirms noklikšķināšanas uz Lietot.

Dabiski sader ar [Izteiksmju DSL](./expression-dsl.md), [Izeju](../nodes/output-node.md) un [JSON izejas kartētāju](../nodes/json-output-mapper-node.md).

### [Darba plūsmas struktūra](./workflow-structure.md)

Darba plūsmas tiek glabātas kā JSON ar mezgliem un malām. Darba plūsmas objekts ietver id, nosaukumu, aprakstu, mezglus, malas un autentifikācijas iestatījumus. Katram mezglam ir id, tips, pozīcija un dati (etiķete un tipam specifiska konfigurācija). Malas savieno avota un mērķa mezglu ID ar opcijām roktura ID. Izteiksmju sintakse datu laukos seko [Izteiksmju DSL](./expression-dsl.md), un šī pati struktūra tiek izmantota [Lejupielādei un importēšanai](./download-import.md).

Skatiet arī [Mezglu tipi](./node-types.md), [Izteiksmju DSL](./expression-dsl.md) un [Lejupielāde un importēšana](./download-import.md).

### [Kanvas funkcijas](./canvas-features.md)

Pārvietojiet kursoru virs jebkura nestabilā kanvas mezgla un noklikšķiniet uz **Izpildīt**, lai izpildītu līdz tam mezglam. Nepieciešamie ievadi tiek atvērti Izpildes panelī ar pirmo lauku fokusētu; ceļi bez ievadiem sākas nekavējoties. Skatiet [Izpildīt līdz mezglam](./canvas-features.md#run-to-node).

Darba plūsmas redaktors nodrošina Datu piespraudi (piespraust mezgla pēdējo izeju testēšanai lejupplūsmā bez atkārtotas izpildes), Izpildes žurnālus (reāllaika mezglu rezultāti un aģenta progress, kas papildina [Izpildes vēsturi](./execution-history.md)), Iespējot/Atspējot (izlaist mezglus izpildes laikā) un Izvilkt uz apakšdarba plūsmu (pārvietot izvēli uz jaunu darba plūsmu un aizstāt to ar [Izpildīt](../nodes/execute-node.md) mezglu). Darba plūsmas izpilde var tikt atvērta no Vēstures vai Board kartes; redaktors atjauno tās pašreizējo momentuzņēmumu, pieslēdzas SSE un saglabā kanvas animāciju un Debug žurnālus aktīvus. [Taustiņu īsinājumtaustiņi](./keyboard-shortcuts.md) atbalsta kopēšanu, ielīmēšanu, izpildi un iekļautā mezgla meklēšanu.

Skatiet arī [Taustiņu īsinājumtaustiņus](./keyboard-shortcuts.md), [Rediģēšanas vēsturi](./edit-history.md) un [Izpildes vēsturi](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Skatīt redaktora demonstrāciju</a></p>

### [Taustiņu īsinājumtaustiņi](./keyboard-shortcuts.md)

Heym nodrošina īsinājumtaustiņus visā redaktorā: Komandu palete (Ctrl+K), Izpildīt (Ctrl+Enter), Saglabāt (Ctrl+S), Atcelt/Atjaunot un Escape, lai aizvērtu. Kanvas: atlasīt visu, vairāku atlase, kopēt/izgriezt/ielīmēt, dzēst, pārslēgt mezgla iespējots (D), pārslēgt piesprausto datu (P) un iekļautā mezgla meklēšana, ierakstot. Īsinājumtaustiņi ir dokumentēti lietotnē un cieši sadarbojas ar [Kanvas funkcijām](./canvas-features.md), piemēram, Datu piespraudi un mezgla iespējot/atspējot.

Skatiet arī [Kanvas funkcijas](./canvas-features.md), [Ātrā atvilktne](./quick-drawer.md) un [Kontekstualizēta demonstrācija](./contextual-showcase.md).

### [AI asistents](./ai-assistant.md)

AI asistents ir čata panelis, kas atvērts no Debug paneļa, ļaujot Jums izveidot vai modificēt darba plūsmas ar dabisko valodu. Izvēlieties [akreditācijas datus](./credentials.md) un modeli, pēc tam aprakstiet, ko vēlaties; AI straumē atbildi, un jebkura derīga [darba plūsmas JSON](./workflow-structure.md) koda bloks tiek automātiski analizēts un piemērots kanvas. Balss ievade tiek atbalstīta saderīgās pārlūkprogrammās.

Ieslēdziet **YOLO režīmu** (Aģenta režīms, pēc noklusējuma izslēgts), un asistents pārbauda, ko tas izveido. Pēc katras izmaiņas tas izpilda darba plūsmu kanvas, lasa rezultātu un labo darba plūsmu, līdz tā dara to, ko Jūs lūdzāt, līdz 5 izpildēm uz ziņojumu. Tas jautā par testu ievadiem pirms pirmās izpildes, var izpildīt Jūsu citas darba plūsmas, kad tam nepieciešams to rezultāts, un rāda katru soli, kamēr tas strādā. Skatiet [AI asistents › YOLO režīms](./ai-assistant.md#yolo-mode).

Noklikšķiniet uz **AI** virs jebkura mezgla uz audekla, lai mainītu vai labotu tikai šo mezglu. Panelis parāda mezglu, kuru tas maina (ar tā pēdējo rezultātu pēc palaišanas), un piedāvā **Change this node as ...**, **Fix error in this node ...** un **Other**. Tiek atjaunināts tikai šis mezgls; pārējā workflow daļa un izkārtojums paliek nemainīgi. Skatiet [AI Assistant › Viena mezgla modificēšana](./ai-assistant.md#changing-one-node).

Kad darba plūsma glabā ierakstus, asistents jautā, kuru [datu tabulu](../tabs/datatable-tab.md) izmantot, vai izveido vienu ar kolonnām, kuras darba plūsma nepieciešama. Skatiet [AI asistents › Datu tabulas](./ai-assistant.md#data-tables).

Kad pašreizējā darba plūsmā ir [Aģenta mezgla](../nodes/agent-node.md) prasmes, asistents nosūta tikai katras prasmes `SKILL.md` darba plūsmas kontekstā. Pievienotie `.py` faili un binārie prasmju resursi tiek izslēgti pirms pieprasījuma, lai lieli prasmju komplekti nepārsniegtu modeļa konteksta logu.

Dabiski sader ar [Čats ar Heym](./chat-with-heym.md), [Aģenta arhitektūra](./agent-architecture.md) un [Izteiksmju DSL](./expression-dsl.md).
### [Saruna ar Heym](./chat-with-heym.md)

Saruna ar Heym ir dokumentācijas galvenes asistents produktu jautājumiem. Tas atveras centrētā dialogā, saglabā akreditācijas datu un modeļa izvēli redzamu augšpusē, injicē aktīvās dokumentācijas lapas ceļu kā kontekstu un notīra ziņu vēsturi, kad dialogs tiek aizvērts. Tas papildina plašāko [AI Assistant](./ai-assistant.md) un vieglāko [Contextual Showcase](./contextual-showcase.md).

Skatiet arī [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) un [Node Types](./node-types.md).

### [Workflow Organizācija](./workflow-organization.md)

Instanču administratori (`HEYM_ADMIN_EMAILS`) var piekļūt un rediģēt katru workflow, atrast īpašnieka workflows pēc e-pasta, pārbaudīt grafikus un izpildes vēsturi, apturēt un atsākt automātiskos triggerus, kā arī dzēst workflows, kad izpildes ir pabeigtas. Skatiet [Instance Administration](../tabs/workflows-tab.md#instance-administration) par offboarding plūsmu un atšķirību starp automātisko triggeru apturēšanu un visu izsaukumu bloķēšanu.

Workflows var organizēt mapēs un apakšmapēs koka struktūrā. Mapēm ir nosaukumi un opcionalais vecāks; workflows tiek piešķirti mapēm. Workflows var plānot dzēšanai (pārvietoti uz atkritumu zonu pirms pastāvīgas noņemšanas). API atbalsta workflows izveidi, atjaunināšanu, dzēšanu un pārvietošanu starp mapēm, un tāda pati organizācijas shēma parādās [Workflows](../tabs/workflows-tab.md) cilnē.

Skatiet arī [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) un [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer ir fiksēts labās puses ātrās izpildes panelis iekšējām ne-kanvas lapām. Tas ļauj meklēt [workflows](../tabs/workflows-tab.md), piespraust iecienītākos, izvēlēties ievades, izpildīt nekavējoties un pārbaudīt progresu vai rezultātus, neizverot redaktoru. Workflow ar [File Upload Trigger](../nodes/file-upload-trigger-node.md) pieņem ievilktu vai izvēlētu failu. Piesprausto kārtība un pēdējais izvēlētais workflow tiek saglabāti pārlūkprogrammā.

Skatiet arī [Workflow Organizācija](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) un [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase ir kompakts iekšējais ceļvedis autentificētām galvenajām virsmām, piemēram, informācijas paneļa cilnēm, [Evals](../tabs/evals-tab.md), Docs un workflow redaktoram. Tas pēc noklusējuma paliek aizvērts, vispirms sniedz īsu lapas kopsavilkumu, piedāvā nedaudz papildu informācijas pēc pieprasījuma un saista ar pilnu dokumentācijas rakstu, kad nepieciešama dziļāka vadība.

Tas sader ar [Saruna ar Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) un [AI Assistant](./ai-assistant.md) iekšējām vadības plūsmām.

### [Akreditācijas dati](./credentials.md)

Akreditācijas dati glabā API atslēgas un slepenos datus, kurus izmanto workflow mezgli. Pievienojiet tos [Credentials](../tabs/credentials-tab.md) cilnē un atsaucieties uz tiem pēc nosaukuma vai ID mezglos, piemēram, [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) un [Redis](../nodes/redis-node.md). Tie tiek šifrēti atpūtā, var tikt kopīgoti ar lietotājiem vai [teams](./teams.md), un tos var arī atsaukt [Expression DSL](./expression-dsl.md) caur `$credentials.Name`.

Skatiet arī [Akreditācijas dati](../tabs/credentials-tab.md), [Akreditāciju koplietošana](./credentials-sharing.md) un [Trešo pušu integrācijas](./integrations.md).

### [Akreditāciju koplietošana](./credentials-sharing.md)

Akreditācijas datus var koplietot ar citiem lietotājiem pa e-pastu vai ar komandām; visi komandas dalībnieki iegūst piekļuvi, kad akreditācija tiek koplietota ar komandu. Koplietotie akreditācijas dati parādās ar indikatoru [Credentials](../tabs/credentials-tab.md) cilnē. Izpildes laikā workflow īpašnieka konteksts apvieno īpašumā esošos, lietotāja koplietotos un komandas koplietotos akreditācijas datus. Izmantojiet `$credentials.CredentialName` izteiksmēs vai iestatiet credentialId mezgla datos.

Skatiet arī [Akreditācijas dati](./credentials.md), [Komandas](./teams.md) un [Trešo pušu integrācijas](./integrations.md).

### [Komandas](./teams.md)

Komandas ļauj koplietot workflows, akreditācijas datus, globālos mainīgos, vektoru krātuves un Drive failus ar grupu lietotāju vienlaikus. Izveidojiet komandas no [Teams](../tabs/teams-tab.md) cilnes un pievienojiet dalībniekus pa e-pastu. Koplietojiet resursus ar komandu no attiecīgajiem koplietošanas dialogiem; visi dalībnieki tad iegūst piekļuvi. Radītājs var rediģēt un dzēst komandu; dzēšot komandu, tiek noņemti visi komandas koplietošanas dati.

Tas sader ar [Akreditāciju koplietošana](./credentials-sharing.md), [Globālie mainīgie](./global-variables.md) un [Enterprise](./enterprise.md).

### [Paralēlā izpilde](./parallel-execution.md)

Heym izpilda mezglus paralēli, kad tiem nav atkarību cits no cita. Izpildītājs veido DAG un izpilda mezglus tajā pašā līmenī vienlaikus ar pavedienu baseinu; tiklīdz mezgls pabeidzas, tā apakšējie mezgli tiek plānoti. Izmantojiet [Merge](../nodes/merge-node.md) mezglu, lai apvienotu paralēlos zarus, kad tas nepieciešams. Vairāki workflow izpildes notiek vienlaikus; katra izpilde ir izolēta. [SSE Streaming](./sse-streaming.md) režīms izplata notikumus, kad mezgli pabeidzas.

Skatiet arī [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) un [Execution History](./execution-history.md).
### [Aģenta arhitektūra](./agent-architecture.md)

[Aģenta mezgls](../nodes/agent-node.md) atbalsta apakš-aģentus (orķestrators izsauc citus aģenta mezglus, izmantojot call_sub_agent), apakš-darbplūsmas (aģents izsauc citas darbplūsmas, izmantojot call_sub_workflow), prasmes (instrukciju saturs un Python rīki no .zip vai .md) un [MCP](../tabs/mcp-tab.md) klientu savienojumus. Orķestratora rīku izpildītājs maršrutē apakš-aģentu un apakš-darbplūsmu izsaukumus; citi rīki tiek novirzīti uz Python, MCP vai prasmju izpildītājiem. Maksimālais apakš-aģentu un apakš-darbplūsmu ligzdošanas dziļums ir 5. Rīku izsaukumu cikls ietver automātisku konteksta saspiešanu: pirms katras iterācijas tiek novērtēta token izmantošana, un, ja tā pārsniedz 80% no modeļa konteksta loga, vidējie ziņojumi tiek kopsavilkti, izmantojot to pašu modeli, saglabājot sistēmas prompt, pirmo lietotāja ziņojumu un pēdējo lietotāja ziņojumu neskartus.

Skatiet arī [Aģenta mezglu](../nodes/agent-node.md), [Aģenta pastāvīgo atmiņu](./agent-persistent-memory.md), [Cilvēks ciklā](./human-in-the-loop.md) un [MCP](../tabs/mcp-tab.md).

### [Aģenta pastāvīgā atmiņa](./agent-persistent-memory.md)

Pēc izvēles katra [Aģenta mezgla](../nodes/agent-node.md) zināšanu grafiks, kas glabājas Postgres: entītijas, tipi, īpašības un virzītas attiecības. Kad `persistentMemoryEnabled` ir patiesi, grafiks tiek kopsavilkots sistēmas promptā katrā izpildē; pēc veiksmīgas pabeigšanas [LLM](../nodes/llm-node.md) fona režīmā iegūst strukturētus atjauninājumus. REST CRUD atrodas zem `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Redaktors tiek atvērts no rozā smadzeņu kontroles uz mezgla.

Skatiet arī [Aģenta mezglu](../nodes/agent-node.md), [Aģenta arhitektūru](./agent-architecture.md) un [Izpildes](../tabs/traces-tab.md).

### [Cilvēks ciklā](./human-in-the-loop.md)

Cilvēks ciklā ļauj [Aģenta mezglam](../nodes/agent-node.md) pieprasīt apstiprinājumu noteiktos kontrolpunktos, izveidot publisku `/review/{token}` lapu un gaidīt, kamēr neautorizēts recenzents pieņem, rediģē vai noraida Markdown pārskata tekstu. HITL iespējotie aģenti arī izsaka `review` izejas rokturi, lai Jūs varētu paziņot [Slack](../nodes/slack-node.md), [Sūtīt e-pastu](../nodes/send-email-node.md) vai citus kanālus, kamēr izpilde ir gaidīšanas režīmā. Mezglu līmeņa HITL teksts tiek izmantots kā apstiprinājuma vadlīnijas, kamēr publiskās lapas kopsavilkums tiek ģenerēts no paša pārskata pieprasījuma. Gaidāmās izpildes parādās [Izpildes vēsturē](./execution-history.md) nekavējoties, var notikt vairāk nekā vienu reizi tajā pašā izpildē un atsākt no precīzi saglabātā darbplūsmas momentuzņēmuma, kad katra lēmuma iesniegšana ir pabeigta.

Skatiet arī [Aģenta mezglu](../nodes/agent-node.md), [Portālu](./portal.md), [Izpildes vēsturi](./execution-history.md) un [Sūtīt e-pastu](../nodes/send-email-node.md).

### [Webhooki](./webhooks.md)

Darbplūsmas var izsaukt, izmantojot [HTTP](../nodes/http-node.md) pie `POST /api/workflows/{workflow_id}/execute`, vai pakāpeniski straumēt no `POST /api/workflows/{workflow_id}/execute/stream`. Pieprasījuma ķermenis tiek nodots kā ķermenis [Ievades](../nodes/input-node.md) mezgliem; galvenes un vaicājuma parametri ir pieejami [Expression DSL](./expression-dsl.md) izteiksmēs. Konfigurējiet katrai darbplūsmai autentifikāciju: anonīma, JWT vai pielāgota galvene. Papildus atbildes kešatmiņai, ātruma ierobežošanai un redaktora "Izpildīt ar cURL" dialogam visi rīki atrodas uz darbplūsmas un attiecas uz abām režīmām. Ar [konkurences ierobežojumu](./webhooks.md#concurrency-limit-and-queued-runs) izsaukums, kuram jāgaida, tā vietā saņem `202 Accepted` ar izpildes ID un statusa URL.

Skatiet arī [Ievadi](../nodes/input-node.md), [Izpildes tokenus](./execution-tokens.md), [SSE straumēšanu](./sse-streaming.md), [HTTP](../nodes/http-node.md) un [Darbplūsmas struktūru](./workflow-structure.md).

### [Izpildes tokeni](./execution-tokens.md)

Izpildes tokeni ir JWT, kas piešķir piekļuvi vienas darbplūsmas izpildes un straumēšanas galapunktiem. Kad darbplūsma izmanto JWT autentifikāciju, tokeni ļauj ārējiem skriptiem, CI caurulēm un integrācijām izsaukt darbplūsmu, neizpaužot lietotāja sesiju. Katrs token nes `wid` prasību, kas to piesaista vienai darbplūsmai, `jti`, kas tiek izmantots tūlītējai atcelšanai, un konfigurējamu TTL (60 sekundes līdz 10 gadiem). Izveidojiet, izvēlieties un atceliet tokenus tieši no **Izpildīt ar cURL** dialoga — izvēlētais token tiek automātiski iekļauts ģenerētajā komandā.

Skatiet arī [Webhookus](./webhooks.md), [Drošību](./security.md) un [SSE straumēšanu](./sse-streaming.md).

### [SSE straumēšana](./sse-streaming.md)

cURL dialogs var pārslēgt [webhooku](./webhooks.md) izpildi uz Server-Sent Events režīmu. Tas reālā laikā ģenerē `execution_started`, `node_start`, `node_complete` un `execution_complete` notikumus, pievieno `--no-buffer` ģenerētajai cURL komandai un ļauj konfigurēt katra mezgla sākuma ziņojumus, piemēram, `[START] LLM` vai pielāgotu tekstu ārējiem termināļa patērētājiem.

Skatiet arī [Webhookus](./webhooks.md), [Izpildes vēsturi](./execution-history.md) un [LLM](../nodes/llm-node.md).
### [Ierosinājumi](./triggers.md)

Workflows tiek uzsākti ar ierosinājumu mezgliem ([Ievade](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) saņem) vai ieejas punktiem: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portāls](./portal.md), Cron plānotājs, Telegram webhook, Discord interakcijas webhook, IMAP ierosinājumu pārvaldnieks, RabbitMQ patērētājs vai Redaktora izpilde. Katram ierosinājumam ir savs endpoint vai fona process; [Cron](../nodes/cron-node.md) darbojas ik pēc 60 sekundēm, [Telegram Trigger](../nodes/telegram-trigger-node.md) mezgli saņem bot webhook, [Discord Trigger](../nodes/discord-trigger-node.md) mezgli saņem parakstītus interakcijas webhook, un [IMAP Trigger](../nodes/imap-trigger-node.md) mezgli darbojas saskaņā ar to konfigurēto aptaukošanas intervālu. [Ievade](../nodes/input-node.md) mezgli saņem ķermeni, galvenes un vaicājumus no webhook pieprasījumiem.

Skatiet arī [Mezglu veidi](./node-types.md), [Webhooks](./webhooks.md) un [Paralēlā izpilde](./parallel-execution.md).

### [Izpildes vēsture](./execution-history.md)

Izpildes vēsture reģistrē workflow izpildes: ievades, izejas, mezglu rezultātus, statusu un ierosinājuma avotu. Pieejama no Redaktora rīkjoslas, Dokumentu skata, Vadības paneļa galvenes vai [Novērtējumi](../tabs/evals-tab.md) skata. Katras workflow vēsture rāda izpildes atvērtajai workflow; visu vēstures skats rāda izpildes visās workflows un čatā. Pašreizējās izpildes parādās augšpusē abos dialogos ar **Atvērt tiešraidē** un **Atcelt** darbībām. Atvērt tiešraidē pievieno redaktoru esošajai izpildei, izmantojot [SSE](./sse-streaming.md), atjauno pabeigtos mezglus, pulsē pašreizējos un gaidošos mezglus un pievieno Debug žurnālus, nesākot jaunu izpildi. Pārvietot uz Kanvu ielādē pabeigtas izpildes ievades un mezglu izejas atkārtotai izpildei vai atkļūdošanai; dziļais saite `/workflows/{workflowId}/{executionId}` atbalsta gan tiešraides, gan pabeigtas izpildes. [Cilvēks ciklā](./human-in-the-loop.md) apturētās izpildes tiek nekavējoties saglabātas kā `pending`, tostarp publiskā pārskata URL un jebkuri paziņojumu mezgli, kas izpildīti no aģenta `review` zara. Ja serveris tiek restartēts izpildes laikā, pārtraukta izpilde tiek automātiski atjaunota: tās tiek atkārtoti izpildītas no jauna ar tām pašām ievadēm un tiek rādītas kā pabeigtas (atzīmētas kā **Atjaunotas**), ko kontrolē katras workflow **Automātiskā atjaunošana** slēdzis, kas var tās ierakstīt kā `skipped`.

Skatiet arī [SSE Streaming](./sse-streaming.md), [Cilvēks ciklā](./human-in-the-loop.md) un [Izsekošana](../tabs/traces-tab.md).

### Izpildes izcelšanās

Pēc tiešraides izpildes — vai pēc **Pārvietot uz Kanvu** — tiek parādīts aizverams **Izpildes izcelšanās** uznirstošais logs Kanvas augšējā labajā stūrī, kurā uzskaitīts, ko katrs mezgls radījis izpildes secībā. Tas ir ātrs veids, kā pārbaudīt katra mezgla izeju, neizverot katru mezglu; to var aizvērt ar **✕**, un tas atkal atveras nākamajā izpildē. Izcelšanās tiek rādīta arī vadības paneļa izpildēs. Skatiet [Izpildes vēsture](./execution-history.md) sīkākai informācijai.

### [Rediģēšanas vēsture](./edit-history.md)

Rediģēšanas vēsture izseko saglabātās versijas workflow (katra saglabāšana rada versiju). Skatiet sarakstu, atveriet versiju, lai redzētu atšķirību pret pašreizējo workflow ([mezgli](./workflow-structure.md), malas, konfigurācija), un Atgriezt, lai atjaunotu iepriekšējo versiju. Atšķirībā no [Izpildes vēstures](./execution-history.md), Rediģēšanas vēsture izseko struktūras izmaiņas, nevis izpildes.

Skatiet arī [Izpildes vēsture](./execution-history.md), [Workflow struktūra](./workflow-structure.md) un [Kanvas funkcijas](./canvas-features.md).

### Kļūdu workflow

Workflow var noteikt citu workflow, kas jāizpilda, kad tas neizdodas. Konfigurējiet to workflow līmeņa **Īpašību** panelī (parādās, kad nav izvēlēts neviens mezgls) sadaļā **Kļūdas gadījumā izpildīt workflow**. Tikai workflow īpašnieks var to iestatīt, mainīt vai notīrīt; skatiet [Īpašnieka iestatījumi](./workflow-organization.md#owner-only-settings). Kad augstākā līmeņa izpilde beidzas ar neapstrādātu kļūdu, izvēlētais kļūdu workflow tiek izpildīts un saņem kļūdas kontekstu (neizdotā workflow id un nosaukums, izpildes id, kļūdas ziņojums, neizdotā mezgla etiķete un tips, kā arī laika zīmogs). Ja kanva jau satur [Kļūdu apstrādātāja](../nodes/error-handler-node.md) mezglu, vietējais apstrādātājs ir prioritārs, un kļūdu workflow **netiek** izsaukts. Kļūdu workflow pats tiek izpildīts tieši, tāpēc tas nekad neizsauc savu kļūdu workflow.

Tas attiecas uz katru ne-testu augstākā līmeņa izpildi: gan izpildes endpointiem, [Portālu](./portal.md), gan katru ierosinājumu, tostarp [cron](../nodes/cron-node.md), čata platformas ierosinājumus, e-pastus, rindas, [MCP](../tabs/mcp-tab.md) un vadības paneļa logrīkus. Ar [Slodzes sadalījumu](./cluster.md) iespējotu tas nemainās, tostarp izpildes, ko veica darbinieks: neizdošanās mezgls atgriežas ar rezultātu, un kļūdu workflow tiek izplatīts kā jebkura cita izpilde, tāpēc mezgls iekšā, kas jāizpilda galvenajā instancē, joprojām darbojas. Divas situācijas ir apzināti izslēgtas, jo workflow paša iznākums vēl nav zināms: izpilde, ko neviena instance nekad nav izpildījusi, un gaidīšana, kas ir beigusies, kamēr izpilde var vēl turpināties. Tas arī **netiek** izsaukts manuālo kanvas testu izpildes laikā.
### Workflow Laika Limits

Katram workflow ir iespēja iestatīt **workflow laika limitu** sekundēs workflow līmeņa **Properties** panelī. `0` (noklusējums) to atspējo. Kad tas ir iestatīts, izpilde, kas pārsniedz limitu, tiek apturēta pie nākamā mezgla robežas un tiek reģistrēta kā neizdevusies izpilde ar "laiks beidzies" kļūdu. Laika limits attiecas uz manuālām, API un izsauktām izpildēm. Garie [Wait](../nodes/wait-node.md) mezgli tiek pārtraukti nekavējoties, nevis bloķēti uz visu to ilgumu.

### Konkurences ierobežojums

Katra darbplūsma var ierobežot, cik daudz produkcijas izpilžu tiek izpildīts vienlaikus, izmantojot **Konkurences ierobežojums** workflow līmeņa panelī **Properties**; īpašnieks un līdzstrādnieki ar rediģēšanas piekļuvi var to mainīt, un pēc noklusējuma tas ir izslēgts. Kad limits ir sasniegts, jaunas izpildes no [webhook](./webhooks.md#concurrency-limit-and-queued-runs) un [straumēšanas](./sse-streaming.md) endpointiem, [Portala](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) un katra [triggera](./triggers.md) gaida FIFO (pirmais iekšā, pirmais ārā) rindā, kas tiek skaitīta visās [klastera](./cluster.md) instancēs. Redaktora testa izpildes, apakš-workflow izsaukumi, [Evals](../tabs/evals-tab.md) un pārskatīšanas atsākšana nekad netiek ievietota rindā, un [Board](../tabs/board-tab.md) karšu izpildes, failu augšupielādes, AI asistenta run-workflow rīka sāktās izpildes un brīdinājumu paziņojumu workflow sākas, negaidot brīvu vietu. Webhook izsaukums, kuram jāgaida, nekavējoties saņem `202 Accepted` ar `execution_id`, statusa URL, kas atbild ar tiem pašiem akreditācijas datiem, savu pozīciju, rindas lielumu un strādājošo skaitu; MCP klients saņem to pašu un aptaujā rīku `heym_execution_status`. Neobligātais **Maksimālais rindas lielums** noraida papildu izsaukumus ar `429`, un neobligātais **Maksimālais gaidīšanas laiks** reģistrē izpildi, kas gaidīja pārāk ilgi, kā `expired`. Gaidošās izpildes parādās [Izpildes vēsturē](./execution-history.md) kā **Rindā n/m** un tur tās var atcelt.

### Ietaupītais Laiks

Katrs workflow var reģistrēt **aptuveno ietaupīto laiku uz izpildi** (minūtēs), kas iestatīts workflow līmeņa **Properties** panelī. [Analytics](../tabs/analytics-tab.md) cilne apkopo šo informāciju izvēlētajā diapazonā kā kopējo **Ietaupītais Laiks** statistiku (katra workflow aplēse × tās veiksmīgās izpildes summa). Most Used arī uzskaita šo summu katram workflow; **Not Set** atver aplēses lauku, kad tas nav iestatīts. [Workflow Analysis](./workflow-analysis.md) ziņojums iesaka iestatīt aplēsi, kad tā nav konfigurēta.

### [Iestatījumi](./user-settings.md)

Iestatījumu dialogs (atverams no Jūsu avatara galvenē) satur četras cilnes: Profils (Gravatar attēls, displeja nosaukums, Lietotāja noteikumi), [Drošība](./security.md) (mainīt paroli), Balss ([ElevenLabs TTS/STT](./chat-voice.md)) un Novērojamība (lasāmā [OpenTelemetry](./opentelemetry.md) statuss). Lietotāja noteikumi ir pielāgotas instrukcijas, kas tiek iekļautas katrā AI pieprasījumā, tostarp workflow veidotājā un [Chat](../tabs/chat-tab.md), tādējādi Jūs varat vienreiz iestatīt valodu, toni, kodēšanas stilu vai workflow konvencijas. Paroles politika un [MCP](../tabs/mcp-tab.md) API atslēgu pārvaldība ir pieejama arī.

Skatiet arī [Drošība](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) un [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym var izsūtīt OpenTelemetry izsekošanas datus katrai workflow izpildei un mezgla izpildei: katrai izpildei ir saknes `heym.workflow.execute` spans un katram mezglam ir bērnu `heym.node.execute` spans, pievienojot modeļa un token izmantošanu LLM un aģenta mezgliem. Spans tiek eksportēti caur OTLP/HTTP uz jebkuru saderīgu backend (Jaeger, Grafana Tempo, Honeycomb, Datadog), un W3C izsekošanas konteksts tiek izplatīts caur ienākošajiem webhook, izejošo HTTP un apakš-workflows. Izsekošana pēc noklusējuma ir atspējota un to konfigurē ar `HEYM_OTEL_*` [vides mainīgajiem](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); aktīvā statusa informācija tiek rādīta [Iestatījumu](./user-settings.md) Novērojamības cilnē.

Skatiet arī [Izpildes Vēsture](./execution-history.md), [Izsekošanas](../tabs/traces-tab.md) un [Webhook](./webhooks.md).

### [Lejupielāde un Importēšana](./download-import.md)

Eksportējiet pašreizējo workflow kā JSON no Redaktora rīkjoslas (Lejupielādes poga); fails ietver mezglus un malas. Importējiet, velkot JSON failu uz [Workflows](../tabs/workflows-tab.md) cilni (izveido jaunu workflow) vai uz kanvas (aizvieto vai apvieno). JSON ir jāietver mezglu masīvs; nosaukums un malas ir opcijas. Izmantojiet to rezerves kopēšanai, koplietošanai vai migrēšanai starp instancēm.

Skatiet arī [Workflow Struktūra](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) un [Kanvas Iespējas](./canvas-features.md).

### [Portāls](./portal.md)

Portāls izsaka workflows kā publiskas čata UI pie `/chat/{slug}`. Konfigurējiet portal_enabled, slug, opciju autentifikāciju (portāla lietotājiem), straumēšanu un failu augšupielādi katram workflow. Beigu lietotāji mijiedarbojas caur čata interfeisu, neielogojoties Heym; attēlu izvades var parādīt čatā. Portāla workflows var arī nodot [Human-in-the-Loop](./human-in-the-loop.md) pārskata lapām, kad [Agent Node](../nodes/agent-node.md) prasa apstiprinājumu, kamēr aģenta `review` zars nosūta paziņojumus uz citām kanālām. Izmantojiet to iekšējiem rīkiem, klientu čatbotam un AI vadītām veidlapām.

Skatiet arī [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) un [Drive](./drive.md).

### [Failu Ģenerēšana](./file-generation.md)

Prasmes var ģenerēt failus, piemēram, PDF, DOCX, CSV, JSON un attēlus izpildes laikā, rakstot uz `_OUTPUT_DIR` darba vietu. Heym automātiski sagūst šos failus, uzglabā tos un izsaka lejupielādes metadatus zem `_generated_files`, kurus pēc tam var pārvaldīt ar [Drive node](../nodes/drive-node.md) vai pārskatīt [Drive](../tabs/drive-tab.md) cilnē.

Skatiet arī [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) un [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive ir koplietošanas uzglabāšanas un koplietošanas slānis failiem, ko ģenerē prasmes. Tas ļauj Jums pārlūkot failus, izveidot publiskas vai ar paroli aizsargātas saites, piemērot derīguma termiņus un lejupielādes ierobežojumus, koplietot failus tikai lasīšanai ar Jūsu komandām un pārvaldīt šos failus programmatiski ar [Drive node](../nodes/drive-node.md) vai manuāli no [Drive](../tabs/drive-tab.md) cilnes.

Skatiet arī [Drive](../tabs/drive-tab.md), [Failu Ģenerēšana](./file-generation.md) un [Portāls](./portal.md).
### [Drošība](./security.md)

Heym ievēro paroli politiku (garums, lielie burti, mazie burti, cipari), glabā piekļuves tokenus HttpOnly sīkdatnēs un rotē atsvaidzināšanas tokenus to izmantošanas laikā. Ierobežojumi attiecībā uz piekļuves ātrumu attiecas uz pieteikšanos, reģistrāciju un [Portal](./portal.md) pieteikšanos. [Akreditācijas dati](./credentials.md) tiek šifrēti atpūtā ar AES-256 (Fernet). [MCP](../tabs/mcp-tab.md) API atslēga tiek izmantota klientu autentifikācijai; satura drošība ir pieejama, izmantojot [Guardrails](./guardrails.md) uz [LLM](../nodes/llm-node.md) un [Agent Node](../nodes/agent-node.md) mezgliem. [Izpildes tokeni](./execution-tokens.md) nodrošina per-workflow ierobežotus JWT ārējiem izsaucējiem.

Skatiet arī [Izpildes tokenus](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) un [Akreditācijas datus](./credentials.md).

### [Vienotā pieteikšanās](./sso.md)

Heym autentificē lietotājus pret jebkuru ārēju OpenID Connect pakalpojumu sniedzēju - Keycloak, Okta, Entra ID, Auth0, Google - kas tiek konfigurēts darbības laikā no **Iestatījumi → SSO**, ko veic instance administrators, kurš norādīts `HEYM_ADMIN_EMAILS`. Tiek ievadīta tikai izsniedzēja URL un klienta akreditācijas dati; katrs endpoint nāk no pakalpojumu sniedzēja atklāšanas dokumenta, tāpēc neviens pakalpojumu sniedzējs nav cieti ieprogrammēts. Pieteikšanās izmanto autorizācijas kodu ar PKCE, un ID token tiek pārbaudīts pret pakalpojumu sniedzēja publicētajām atslēgām. Konti tiek kartēti pēc `(issuer, subject)` vispirms un pārbaudītās e-pasta adreses otrajā vietā, ar opciju automātiskai piešķiršanai, kas ierobežota līdz e-pasta domēna atļauju sarakstam. Paroles pieteikšanās paliek pieejama līdzās SSO un var tikt izslēgta, kad savienojuma tests ir izturēts, ar `HEYM_ADMIN_EMAILS` kontiem, kas ir atbrīvoti, lai nepareizi konfigurēts pakalpojumu sniedzējs nevarētu bloķēt instanci.

Skatiet arī [Iestatījumus](./user-settings.md), [Drošību](./security.md) un [Audit Logging](./audit.md).

### [Slodzes sadalījums](./cluster.md)

Norādiet otro Heym instanci uz to pašu datu bāzi, un tā pievienosies kā darbinieks. Fona izpildes - cron, webhook, MCP rīku izsaukumi, čata triggeri - tiek koplietotas starp instancēm pēc procenta, ko iestata instance administrators sadaļā **Iestatījumi → Instances**, ar katras instances statusu, datu bāzes latentumu un versiju vienā tabulā. Instances nekad nesazinās savā starpā: Postgres veic darbu, tāpēc darbiniekam nav nepieciešams atvērts ports un nav ceļa atpakaļ uz galveno instanci. Darbs, kas skar vietējās failus, kodēšanas aģenta darba vietu vai instalētu spraudni, vienmēr tiek izpildīts uz galvenās instances, un panelis ziņo, cik daudz no pēdējām 24 stundām tas bija, lai operators varētu redzēt, kad procenti nevar palīdzēt. Katrs izpildījums vēsturē nosauc instanci, kas to izpildījusi, un abas vēstures dialoglodziņi var filtrēt pēc tā.

Skatiet arī [Iestatījumus](./user-settings.md), [Izpildes](../tabs/traces-tab.md) un [Analītiku](../tabs/analytics-tab.md).

### [Trešo pušu integrācijas](./integrations.md)

Heym savienojas ar ārējiem pakalpojumiem, izmantojot akreditācijas datus, kas glabāti [Akreditācijas datos](../tabs/credentials-tab.md) (šifrēti atpūtā). Atbalstītie veidi ietver OpenAI, Google, Lēmumu modeli [Lēmumu mezglam](../nodes/decision-node.md), Modeļa maršrutētāju automātiskai modeļa izvēlei (skatiet zemāk), GitHub [GitHub mezglam](../nodes/github-node.md) un MCP integrācijām, Jira [Jira mezglam](../nodes/jira-node.md), Notion [Notion mezglam](../nodes/notion-node.md), pielāgotu LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP [E-pasta sūtīšanai](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header un FlareSolverr [Crawler](../nodes/crawler-node.md). Katram tipam ir dokumentēti nepieciešamie lauki; akreditācijas datus var koplietot ar lietotājiem vai [komandām](./teams.md) un atsaukties uz tiem pēc nosaukuma mezglos vai kā `$credentials.Name` izteiksmēs.

### Modeļa maršrutētājs (Auto Model)

**Modeļa maršrutētāja** akreditācijas dati izvēlas modeli katram pieprasījumam, nevis turēt atslēgu. Tas glabā lēmumu modeļa akreditācijas datus, kā arī jūsu esošo OpenAI/Google/Pielāgoto akreditācijas datu sarakstu, katram ar kritērijiem, kas nosaka, kad to izmantot, un parādās katrā modeļa izvēles rīkā ar vienu modeli, ko sauc par **Auto**.

Izpildes, kanvas izpildes žurnāls un span skats rāda abas izvēles puses, piemēram, `Auto Model / GPT-5`, kamēr izmaksas paliek attiecinātas uz modeli, kas tika izpildīts. Auto Model nevar kombinēt ar Responses API, Batch režīmu vai attēla izvadi. Skatiet [Akreditācijas datus](./credentials.md) pilnīgai uzvedībai.

Skatiet arī [Akreditācijas datus](./credentials.md), [Akreditāciju koplietošanu](./credentials-sharing.md) un [Komandas](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails bloķē nedrošas vai nevēlamas lietotāju ziņas pirms tās sasniedz [LLM](../nodes/llm-node.md) vai [Agent Node](../nodes/agent-node.md). Iespējams tās aktivizēt katram mezglam un izvēlēties kategorijas, kuras bloķēt (piemēram, vardarbība, naida runa, seksuāls saturs, pašnāvība, uzmākšanās, nelikumīga darbība). Iestatiet jutīgumu (zems, vidējs, augsts). Kad tiek aktivizēts, mezgls izmet kļūdu, ko varat noķert ar [Kļūdu apstrādātāju](../nodes/error-handler-node.md). Atklāšana izmanto pakalpojumu sniedzēja moderēšanas API vai LLM klasifikāciju atkarībā no akreditācijas datu veida.

Skatiet arī [Drošību](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) un [Kļūdu apstrādātāju](../nodes/error-handler-node.md).
### [Uzņēmumiem](./enterprise.md)

Uzņēmumiem ir paredzēta komerciālā licencēšana, profesionālais atbalsts un izvietošanas pakalpojumi komandām, kas izmanto Heym ražošanā. Tas ietver darba plūsmu arhitektūras palīdzību, ievadīšanu, Kubernetes un mērogošanas vadlīnijas, prioritāro atbalstu un pielāgotu izstrādi ap uzlabotām funkcijām, piemēram, [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) un [Portal](./portal.md).

Skatiet arī [Izpilde un izvietošana](../getting-started/running-and-deployment.md), [Drošība](./security.md) un [Komandas](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work ir otrā saskarne biznesa komandām virs Heym. Lietotāji apraksta darbu, atbild uz dažiem jautājumiem un iegūst pārbaudītu workflow, pēc tam strādā no lapām, apstiprinājumiem un Aktivitāšu saraksta, kur katrai izpildei ir nosaukums. Instances administratori to savieno sadaļā **Iestatījumi → Heym Work**, norādot tā adresi un integrācijas atslēgu; tam ir sava Heym komandas licence.

Skatiet arī [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) un [Human-in-the-Loop](./human-in-the-loop.md).

---

## Informācijas panelis

### [Workflows](../tabs/workflows-tab.md)

Workflows cilne ir noklusējuma informācijas paneļa skats. Tā parāda divu paneļu sarakstu: darba plūsmas un mapes kā blīvas rindas pa kreisi, un izvēlētās darba plūsmas priekšskatījumu pa labi ar tās trigger, pēdējo izpildi un soļiem, kā arī Open Workflow un Run Now. Katru rindu pavada statusa čips (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), pēc kura Status nolaižamais saraksts var filtrēt. Darba plūsma bez trigger mezgla tiek marķēta atbilstoši tam, kā tā pēdējā izpilde sākās - API HTTP izsaukumam, SubWorker vecākai darba plūsmai, Portal tās publiskajam čatam - un paliek Manual līdz tā ir izpildīta. Mapes un apakšmapes apstrādā [organizāciju](./workflow-organization.md). Izveidojiet darba plūsmas ar New Workflow, velciet un nometiet JSON, lai [importētu](./download-import.md), un rediģējiet vai dzēsiet no rindas darbībām. Darba plūsmas var pārvietot starp mapēm; dzēšana tiek plānota (atkritumu) pirms pastāvīgas noņemšanas.

Skatiet arī [Darba plūsmu organizācija](./workflow-organization.md), [Lejupielāde un importēšana](./download-import.md) un [Ātrā atvilktne](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Skatīt Workflows demonstrāciju</a></p>

### [Board](../tabs/board-tab.md)

Aģentiska kanban dēlis, kur kartes ir pastāvīgi uzdevumi. Konfigurējiet katru kolonnu ar sakārtotu darba plūsmu ķēdi; pārvietojot karti kolonnā, tiek izpildīta ķēde ar kartes pilno kontekstu (saturs, komentāri, vēsture, iepriekšējie rezultāti). Rezultāti tiek ierakstīti atpakaļ kartē — zaļš panākumiem, sarkans neveiksmēm, dzeltens izpildes laikā. Sekojuma kārtas atkārto pašreizējās kolonnas ķēdi ar visu līdz šim uzkrāto, kas nodrošina iteratīvu plānošanu. Izpildes tiek ierakstītas [Izpildes vēsturē](./execution-history.md) ar `board` trigger avotu. Kamēr kartes izpilde ir aktīva, **Open live** atver tieši šo izpildi animētajā kanvā ar pakāpeniskiem Debug žurnāliem.

Skatiet arī [Darba plūsmas](../tabs/workflows-tab.md), [Izpildes vēsture](./execution-history.md) un [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Skatīt Board demonstrāciju</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Templates cilne ļauj Jums saglabāt un atkārtoti izmantot darba plūsmu veidnes (pilnas darba plūsmas) un mezglu veidnes (vienkārši konfigurēti mezgli). Izveidojiet darba plūsmu veidnes no redaktora (Share as Template) un mezglu veidnes, ar peles labo pogu noklikšķinot uz mezgla. Pārlūkojiet pēc redzamības (Visiem vai Noteiktiem lietotājiem/[komandām](./teams.md)), piemērojiet veidni, lai izveidotu jaunu darba plūsmu vai pievienotu mezglu kanvā, un pārvaldiet savas koplietotās veidnes.

Skatiet arī [Darba plūsmas](../tabs/workflows-tab.md), [Komandas](./teams.md) un [Kanvas funkcijas](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Skatīt Templates demonstrāciju</a></p>

### [Variables](../tabs/global-variables-tab.md)

Variables cilne pārvalda [Globālo mainīgo krātuvi](./global-variables.md). Izveidojiet, rediģējiet un dzēsiet globālos mainīgos; iestatiet nosaukumu, vērtību un vērtības tipu (Auto, String, Number, Boolean, Array, Object). Mainīgie ir lietotāja apjoma un saglabājas starp izpildēm. Atsaucieties uz tiem jebkurā darba plūsmā [izteiksmē](./expression-dsl.md) kā `$global.variableName`. Mainīgos var koplietot ar citiem lietotājiem vai [komandām](./teams.md).

Skatiet arī [Globālie mainīgie](./global-variables.md), [Mainīgais](../nodes/variable-node.md) un [Izteiksmju DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Skatīt Variables demonstrāciju</a></p>
### [Chat](../tabs/chat-tab.md)

Chat cilne ir Heym ilgstošā aģentu saskarne, kas ļauj darboties darba telpā, izmantojot sarunu. Izvēlieties [akreditācijas datus](./credentials.md) un modeli, pēc tam lūdziet Chat atbildēt uz jautājumiem, pārbaudīt workflow definīcijas, izpildīt esošos workflow, apkopt izpildes un grafikus, ziņot par viena workflow izpildes vēsturi (izpildes skaits, statusa sadalījums, pēdējā izpilde un vienas izpildes detaļas pēc pieprasījuma), ziņot par to, kuri izpildes šobrīd notiek (ar pagājušo laiku, pašreizējo mezglu un saiti uz katru aktīvo izpildi), atrisināt gaidošās cilvēku pārbaudes, izveidot un labot workflow, izmantojot to pašu AI Builder dzinēju, kas tiek izmantots redaktorā, vai pievienot kartes kanban dēļiem ar dabisko valodu. Jaunas kartes vienmēr sākas izvēlētā dēļa pirmajā kolonnā; kad ir pieejami vairāki dēļi un neviens nav nosaukts, Chat piedāvā dēļa izvēli pirms kartes izveides.

Chat turpina darboties fonā pēc pārlūkprogrammas aizvēršanas. Kamēr atbilde tiek straumēta, Jūs varat sūtīt vairāk ziņojumu; Heym tos saglabā datu bāzē balstītā rindā, ļauj Jums rediģēt vai dzēst rindā esošos ziņojumus pirms to sākšanas un izpilda tos secībā, kad pašreizējā atbilde beidzas. Ja asistentam ir nepieciešami plānošanas detalizējumi un tas atgriež precizējošus jautājumus, rinda apstājas, līdz Jūs atbildat uz šiem jautājumiem, pēc tam turpina pēc plānošanas atbildes.

Atbildes tiek straumētas ar markdown, iekļautām attēlu, workflow priekšskatījuma kartēm, sarakstā saraujamiem rīku izsaukumu kartēm, konteksta izmantošanu un automātisku konteksta saspiešanu. Chat atbalsta pielikumus, balss ievadi, lasīšanas atskaņošanu, kopēšanas darbības, ātrus promptus, Lietotāja noteikumus no [Iestatījumiem](./user-settings.md) un [globālajiem mainīgajiem](./global-variables.md) kā kontekstu.

Skatiet arī [AI Assistant](./ai-assistant.md), [Akreditācijas dati](./credentials.md) un [Iestatījumi](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Skatīt Chat demonstrāciju</a></p>

### [Credentials](../tabs/credentials-tab.md)

Akreditācijas datu cilne pārvalda API atslēgas un slepenos kodus, ko izmanto mezgli. Pievienojiet akreditācijas datus pēc veida (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere utt.), nosauciet tos un atsaucieties uz tiem workflow mezglos. Rediģējiet vai dzēsiet no kartes; dalieties ar lietotājiem pa e-pastu vai ar [komandām](./teams.md). Visi vērtības tiek šifrētas atpūtā un maskētas lietotāja saskarnē.

Skatiet arī [Akreditācijas dati](./credentials.md), [Akreditāciju koplietošana](./credentials-sharing.md) un [Trešo pušu integrācijas](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Skatīt Akreditāciju demonstrāciju</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Vektoru krātuves cilne pārvalda vektoru krātuves, ko izmanto [RAG](../nodes/rag-node.md) mezgli. Izveidojiet krātuvi ar nosaukumu un vektoru krātuves [akreditāciju](./credentials.md) — *RAG: Qdrant + OpenAI* (ārējais Qdrant) vai *RAG: Psql + OpenAI* (Heym paša Postgres, izmantojot pgvector), kas nosaka krātuves aizmuguri — opcionalizējiet kolekcijas nosaukumu, pēc tam augšupielādējiet dokumentus (PDF, TXT utt.). Pārvaldiet saturu (skats, dzēst avotus), rediģējiet krātuves detaļas un dalieties ar krātuvēm ar lietotājiem. [RAG](../nodes/rag-node.md) mezglā izvēlieties Datu bāzi, atlasiet vektoru krātuvi un veiciet ievietošanas, atjaunināšanas, dzēšanas vai meklēšanas operācijas.

Skatiet arī [Qdrant RAG](../nodes/rag-node.md), [Akreditācijas dati](./credentials.md) un [Komandas](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Skatīt Vektoru krātuves demonstrāciju</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP cilne konfigurē Model Context Protocol integrāciju. Heym atbalsta divus režīmus:

**Noklusējuma serveris** – Viens endpoints pie `/api/mcp/sse`, kas izsaka visus MCP iespējotos workflows. Apskatiet un atjaunojiet savu API atslēgu, kopējiet gatavu klienta JSON, pieslēdziet Cursor ar vienu klikšķi vai sekojiet Claude iestatīšanas plūsmai ar automātisku OAuth reģistrāciju.

**Nosaukti serveri** – Izveidojiet vairākus izolētus MCP endpointus, katram ar savu UUID balstītu URL (`/api/mcp/servers/{uuid}/sse`) un neatkarīgu API atslēgu. Piešķiriet konkrētus workflows katram serverim, lai dažādi AI klienti vai komandas redzētu tikai nepieciešamos rīkus. Katrs nosauktais serveris atbalsta tos pašus autentifikācijas veidus (API atslēga, Claude OAuth) un tam ir savi Copy JSON un Add to Cursor īsinājumtaustiņi. Abi endpointi atbalsta SSE transportu (GET) un Streamable HTTP transportu (POST). Pārslēdzot workflow iekšā nosauktajā serverī, tas tiek pārvietots uz saraksta augšu, lai mainītā rinda paliktu redzamā.

**Heym čata rīks** – Abos režīmos var arī izsist [Chat](../tabs/chat-tab.md) dzinēju kā vienu `heym_chat` rīku, kas tiek pārslēgts katrai virsmai ar savu LLM akreditācijas datu un modeļa iestatījumiem (iepriekš aizpildītiem no Jūsu izvēlētā modeļa [Iestatījumos](./user-settings.md)). MCP klients nosūta vienu dabiskās valodas `message`, un dzinējs veic pārējo: workflows veidošanu būvēšanas režīmā (saglabāšana, testa izpilde līdz piecām reizēm, labošana un verificēšana), workflows izpildi, analītiku, izpildes, tiešraides statusu, grafikus, dēļus un kartes, komandas, globālos mainīgos, dokumentācijas meklēšanu un cilvēka iejaukšanās lēmumus. Vēlāk pievienotās iespējas Chat ir pieejamas caur to pašu rīku bez papildu reģistrācijas. Katrs izsaukums tiek saglabāts Chat cilnes vēsturē kā plūstoša saruna un atgriež `conversation_id`, ko klients var nodot atpakaļ, lai turpinātu pavedienu.

Skatiet arī [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) un [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Skatīt MCP demonstrāciju</a></p>

### [Traces](../tabs/traces-tab.md)

Traces cilne rāda [LLM](../nodes/llm-node.md) izpildes pēdas. Statistikas virsraksts virs saraksta apkopo izvēlēto laika intervālu ar KPI kartēm (Izsaukumi, Tokeni, Izmaksas, Vidējā latentums, Kļūdu %) un trim diagrammām — Tokeni pēc modeļa, Izmaksas pēc modeļa un Izsaukumi laika gaitā (saliktie panākumi pret kļūdām). Viena **Laika intervāla** izvēlne (1h / 24h / 7d / 30d / Visi; noklusējums 7 dienas) filtrē gan diagrammas, gan sarakstu kopā. Izmaksas tiek aprēķinātas no lietotāja [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table); modeļi bez cenu informācijas parādās kā iekšēja brīdinājuma ziņojums, kas uz to norāda. Atveriet jebkuru pēdu, lai apskatītu pieprasījuma un atbildes payloads, laika sadalījumu (llm_ms, tools_ms, mcp_list_ms), rīku izsaukumus (nosaukums, argumenti, rezultāts) un iekļautās prasmes. Paplašinātie notikumi attēlo JSON — tostarp MCP un JSON-RPC payloads — kā salokāmu koku, kur pirmais līmenis ir atvērts pēc noklusējuma; **Koks / Neapstrādāts** pārslēdz atpakaļ uz oriģinālo tekstu, un nepareizs JSON paliek lasāms. Izmantojiet pēdas, lai atkļūdot [Agent Node](../nodes/agent-node.md) un [LLM](../nodes/llm-node.md) uzvedību un lai kopētu vai eksportētu payloads.

Skatiet arī [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) un [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Skatīt Traces demonstrāciju</a></p>
### [Brīdinājumi](../tabs/alerts-tab.md)

Brīdinājumu cilne nosaka sliekšņa nosacījumus laika logā un informē Jūs, kad tie tiek pārkāpti. Četri brīdinājumu veidi aptver jautājumus, kurus operatori faktiski uzdod: **kļūdas slieksnis** (vai šis neizdevās vairāk nekā N reizes laika logā), **darba plūsmas ilgums** (vai izpildes palēninājās, mērīts kā maksimālais, vidējais vai p95), **token / USD izmaksas** (vai izdevumi pārsniedza budžetu, kas tiek risināts caur to pašu cenu tabulu kā [Izpildes](../tabs/traces-tab.md)), un **izpildes skaits** (vai šī izpilde notika daudz biežāk, nekā tai vajadzētu). Katrs veids tiek vērtēts laika logā, ko Jūs izvēlaties, nekad uz vienu notikumu, jo viena neizdevusies izpilde ir troksnis, bet uzplūdi ir incidents. Brīdinājumi uzrauga vienu darba plūsmu vai visas darba plūsmas, kurām Jūs varat piekļūt.

Piecu soļu vednis iziet cauri veidam, apjomam, nosacījumam, atbildei un pārskatīšanai. Pārskatīšanas solis **atpakaļtestē** nosacījumu vispirms, ziņojot, cik bieži tas būtu aktivizējies pēdējās 24 stundās līdz 7 dienām, tādējādi slieksnis, kas ir pārāk zems, tiek atklāts pirms tā saglabāšanas, nevis pēc tam, kad kāds saņem paziņojumu. Aprakstiet, ko vēlaties, vienkāršā valodā, un AI aizpilda katru soli, atzīmējot savas pieņēmumus; daļēja pieprasījuma gadījumā vednis joprojām virzās uz priekšu, atverot pirmo soli, kuram joprojām nepieciešama lēmuma pieņemšana, nevis liekot Jums sākt no jauna. Noklusējuma iestatījumos brīdinājums tiek aktivizēts vienu reizi un paliek kluss, līdz metrika atjaunojas; Jūs varat izvēlēties, lai tas atkārtotos noteiktā intervālā.

Atbildes solī brīdinājums var izveidot un piešķirt jaunu darba plūsmu, kas jāizpilda, kad tas tiek aktivizēts, izmantot jau esošu vai neko nedarīt. Aktivizēšanas payload satur novēroto vērtību, slieksni, logu un darba plūsmas, kas veicināja skaitli, kas ir veids, kā brīdinājumi sasniedz Slack, e-pastu vai Telegram, izmantojot jau esošos mezglus. Aktivizēšanas vēsture reģistrē, kas bija patiesība katra brīdinājuma aktivizēšanas brīdī un tiek saglabāta 90 dienas; apstiprinot aktivizēšanu, badge tiek mainīts no Aktivizēts uz Apstiprināts, nevis izlikoties, ka nosacījums ir izpildīts. [Čata](../tabs/chat-tab.md) cilne var atbildēt uz to, kādi brīdinājumi pastāv un kāpēc vai kad viens tika aktivizēts. Brīdinājumus var dalīt ar lietotājiem un [komandām](../tabs/teams-tab.md).

Skatīt arī [Analītika](../tabs/analytics-tab.md), [Izpildes](../tabs/traces-tab.md) un [Izpildes vēsturi](./execution-history.md).

### [Analītika](../tabs/analytics-tab.md)

Analītikas cilne rāda izpildes metriku un tendences. Kopsavilkuma statistika ietver kopējās izpildes, panākumu līmeni, kļūdu līmeni, latentuma sadalījumus un kopējo **ietaupīto laiku** (katras darba plūsmas novērtēto minūšu ietaupījums par izpildi × tās veiksmīgās izpildes). Visbiežāk izmantotie saraksti ietver to pašu summu katrai darba plūsmai. Izvēlieties pamata laika intervālu (24h, 7d, 30d vai viss), pēc izvēles filtrējiet pēc darba plūsmas, pēc tam velciet pāri jebkuram diagrammai, lai izpētītu izvēlēto datu intervālu. Diagrammas un darba plūsmu tabulas tiek atjauninātas atbilstoši izvēlei, un automātiskā atjaunināšana uztur metrikas aktuālas. Tas papildina [Izpildes vēsturi](./execution-history.md) un [Grafikus](../tabs/scheduled-tab.md), kad Jums nepieciešami gan pagātnes rezultāti, gan gaidāmās izpildes.

Skatīt arī [Izpildes vēsturi](./execution-history.md), [Grafikus](../tabs/scheduled-tab.md) un [Novērtējumus](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Skatīt Analītikas demonstrāciju</a></p>

### [Darbvirsma](../tabs/dashboard-tab.md)

Darbvirsmas cilne ir Grafana stila telpa, kur Jūs veidojat diagrammu logrīku režģus, katrs tiek attēlots no savas slēptās Heym darba plūsmas. Saglabājiet tik daudz darbvirsmu, cik nepieciešams, un dalieties ar katru no tām ar lietotājiem vai komandām, tikai lasāms vai rediģējams; logrīki vienmēr darbojas ar īpašnieka akreditācijas datiem, tādējādi visi redz to pašu datus. Aprakstiet metriku vienkāršā valodā, un AI ģenerē logrīku, vai pievienojiet vienu manuāli un izvēlieties diagrammas veidu, kas tiek priekšskatīts ar paraugu datiem: stabiņu, līniju, laukumu, pīrāgu, tabulu, skaitlisku, mērītāju, izkliedi, proporciju, stabiņu mērītāju, tekstu vai HITL. HITL ir karuselis ar Jūsu gaidāmajām cilvēku pārbaudēm. Galvene rāda `1/n gaidāms`. Darba plūsmas nosaukums atver šo izpildi kanvā. **Apstiprināt**, **Pieprasīt izmaiņas** un **Noraidīt** to atrisina, un vēstures ikona blakus logrīka nosaukumam atver šo izpildi vēstures dialogā tajā pašā lapā. Logrīki kešē savus rezultātus, var tikt precizēti ar AI (katra izmaiņa tiek saglabāta [Rediģēšanas vēsturē](./edit-history.md)), kopēti kopā ar savu pilno darba plūsmu, pārkārtoti ar Tidy up un vilkti vai mainīti izmēros rediģēšanas režīmā. Tabulas var rādīt statusa birkas un saistīt savas rindas ar detalizētu informācijas paneli, kas nolasa noklikšķinātās rindas ierakstu kā `$page.record`, savukārt Run logrīks palaiž darba plūsmu no informācijas paneļa: ar ievilktu failu, ar tās ievades laukiem vai ar pogu Izpildīt. Tā kā katrs logrīks ir darba plūsma, jebkuri dati, ko Jūs varat iegūt — [HTTP](../nodes/http-node.md) pieprasījums, [BigQuery](../nodes/bigquery-node.md) vaicājums, [RAG](../nodes/rag-node.md) meklējums vai [LLM](../nodes/llm-node.md) izeja — var kļūt par diagrammu. HITL logrīka iestatījumi var to sašaurināt līdz vienas workflow pārskatīšanām vai aģenta vai Slack apstiprināšanas solim tajā; šāds logrīks tos parāda visiem, kas var atvērt šo workflow, un ir paslēpts no visiem, kas to nevar.

Skatīt arī [Diagrammas izejas mezglu](../nodes/chart-output-node.md), [Analītiku](../tabs/analytics-tab.md) un [Izpildes vēsturi](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Skatīt Darbvirsmas demonstrāciju</a></p>
### [Novērtējumi](../tabs/evals-tab.md)

Novērtējumu cilne (at `/evals`) ļauj Jums izveidot novērtējumu komplektus, pievienot vai ģenerēt testu gadījumus, optimizēt komplekta prompt un veikt novērtējumus pret [Agent Node](../nodes/agent-node.md) workflows. Izvēlieties vienu vai vairākus modeļus, izvēlieties vērtēšanas metodi (Precīza atbilstība, Satur, vai LLM-as-Judge), pēc izvēles ļaujiet atsevišķam modelim vai [Decision Model](../nodes/decision-node.md) novērtēt LLM-as-Judge atbildes, iestatiet izpildes skaitu katram testam (plus temperatūru un loģiskās domāšanas piepūli Precīzai atbilstībai un Saturam), pēc tam salīdziniet izpildes rezultātus un katra modeļa izejas. Pārskatiet izpildes vēsturi iepriekšējiem novērtējumiem, tostarp tiesnesi, kuru katra izpilde izmantoja, atkārtojiet vienu ar to pašu tiesnesi, eksportējiet to kā JSON, un pārbaudiet pamatuzvedību [Traces](../tabs/traces-tab.md).

Skatiet arī [Agent Node](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md) un [Izpildes vēsture](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Skatīt Novērtējumu demonstrāciju</a></p>

### [Komandas](../tabs/teams-tab.md)

Komandu cilne ļauj Jums izveidot un pārvaldīt komandas. Izveidojiet komandu, pievienojiet dalībniekus pēc e-pasta, un noņemiet dalībniekus (veidotāju nevar noņemt). Dalieties ar [workflows](../tabs/workflows-tab.md), [veidnēm](../tabs/templates-tab.md), [akreditācijas datiem](../tabs/credentials-tab.md), [mainīgajiem](../tabs/global-variables-tab.md), [vektoru krātuvēm](../tabs/vectorstores-tab.md) un [Drive failiem](../tabs/drive-tab.md) ar komandām no attiecīgajām koplietošanas dialoglodziņiem; visi komandas dalībnieki iegūst piekļuvi. Rediģējiet komandas nosaukumu un aprakstu vai dzēsiet komandu (noņem visus komandas koplietošanas datus).

Skatiet arī [Komandas](./teams.md), [Akreditācijas datu koplietošana](./credentials-sharing.md) un [Workflow organizācija](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Skatīt Komandu demonstrāciju</a></p>

### [Grafiki](../tabs/scheduled-tab.md)

Grafiku cilne parāda visus aktīvos [Cron](../nodes/cron-node.md) workflows vizuālā kalendārā. Pārslēdzieties starp dienas, nedēļas un mēneša skatiem, lai redzētu, kad Jūsu automatizācijas ir ieplānotas izpildei, pēc tam atgriezieties pie attiecīgā [workflow](../tabs/workflows-tab.md), kad nepieciešams rediģēt grafiku.

Skatiet arī [Cron](../nodes/cron-node.md), [Analītika](../tabs/analytics-tab.md) un [Izpildes vēsture](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Skatīt Grafiku demonstrāciju</a></p>

### [Žurnāli](../tabs/logs-tab.md)

Žurnālu cilne parāda Docker konteineru žurnālus Heym stekam (backend, frontend, PostgreSQL). Izvēlieties konteinerus, filtrējiet pēc žurnāla līmeņa (Visi, INFO, WARNING, ERROR, DEBUG) un meklējiet žurnālos. Izmantojiet to, lai veiktu atkļūdošanu un problēmu risināšanu. Lai iegūtu workflow izpildes žurnālus (mezgla rezultāti, izejas), izmantojiet [Izpildes vēsturi](./execution-history.md), [Traces](../tabs/traces-tab.md) vai Debug paneli redaktorā.

Skatiet arī [Izpildes vēsture](./execution-history.md), [Traces](../tabs/traces-tab.md) un [Kanvas funkcijas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Skatīt Žurnālu demonstrāciju</a></p>

### [Datu tabula](../tabs/datatable-tab.md)

Datu tabulas cilne ļauj Jums izveidot un pārvaldīt strukturētas datu tabulas Heym. Definējiet tipizētās kolonnas (virkne, skaitlis, boolean, datums, JSON), pārvaldiet rindas ar tiešsaistes dubultklikšķa rediģēšanu, importējiet/eksportējiet CSV un dalieties ar tabulām ar lietotājiem vai [komandām](./teams.md) ar lasīšanas/rakstīšanas atļaujām. Izmantojiet [DataTable node](../nodes/datatable-node.md), lai piekļūtu tabulām programmatiskā veidā workflows. Pinned **Sistēmas tabulu** sadaļa augšpusē satur **LLM izmaksu tabulu**: fiksēta shēmas skats par katra modeļa cenām, kas tiek iegūtas no Helicone fonā (24 stundu TTL, manuāla atsvaidzināšana), kur katrs lietotājs var pārrakstīt cenas vai pievienot pielāgotas rindas modeļiem, kurus Helicone neuzskaita. Šie cenu noteikšanas noteikumi nosaka izmaksu KPI un katra modeļa izmaksu diagrammu [Traces](../tabs/traces-tab.md) cilnē.

Skatiet arī [DataTable node](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Workflow struktūra](./workflow-structure.md) un [Komandas](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Skatīt Datu tabulas demonstrāciju</a></p>
### [Drive](../tabs/drive-tab.md)

Drive cilne parāda visus failus, kurus ģenerējušas prasmes Jūsu workflows. Tajā ir uzskaitīti katrs fails ar nosaukumu, tipu, izmēru, avota mezglu, izveides datumu un komandas koplietošanas stāvokli, kā arī ir pieejami meklēšanas, autentificētas lejupielādes, koplietošanas, dzēšanas un lapošanas kontroles. Tā ir informācijas panelis, kas papildina [Failu ģenerēšanu](./file-generation.md), [Drive](./drive.md) atsauci un [Drive mezglu](../nodes/drive-node.md).

Skatiet arī [Drive](./drive.md), [Failu ģenerēšanu](./file-generation.md) un [Drive mezglu](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Skatīt Drive demonstrāciju</a></p>

### [Sadarbība uz kanvas](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
