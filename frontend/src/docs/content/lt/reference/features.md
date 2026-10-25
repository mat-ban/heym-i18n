# Heym Pilnas Funkcijų Rinkinys

Išsamus visų Heym galimybių apžvalga. Kiekviena skiltis aprašo funkciją arba koncepciją keliais sakiniais.

---

## Pradžia

### [Įvadas](../getting-started/introduction.md)

Heym yra infrastruktūra, skirta AI agentų vykdymui ir valdymui gamyboje. Jūs kuriate agentinius sistemas vizualioje drobėje ir jas vykdote su pasitikėjimu: orkestruokite agentus, automatizuokite verslo procesus, tikrinkite kiekvieną vykdymą ir išlaikykite žmones kontroloje savo infrastruktūroje. Ji palaiko vizualius workflows, AI varomus mazgus ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Assistant](./ai-assistant.md), integracijas ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), įeinančius [IMAP Trigger](../nodes/imap-trigger-node.md) el. laiškus, išeinančius [Send Email](../nodes/send-email-node.md) laiškus), planavimą su [Cron](../nodes/cron-node.md) ir [Portal](./portal.md) pokalbių portalus galutiniams vartotojams.

Taip pat žiūrėkite [Pagrindinės Koncepcijos](../getting-started/core-concepts.md), [Mazgų Tipai](./node-types.md) ir [Trečiųjų Šalių Integracijos](./integrations.md).

### [Kodėl Heym](../getting-started/why-heym.md)

Kodėl Heym aprašo agentų gyvavimo ciklą (kurti, orkestruoti, vykdyti, stebėti, vertinti, kontroliuoti, atskleisti) ir rodo, ką vienas savarankiškai talpinamas vykdymas apdoroja kiekviename etape. Tai apima [LLM](../nodes/llm-node.md) mazgą ir [Agent Node](../nodes/agent-node.md) su įrankių kvietimu, Python įrankiais, [MCP](../tabs/mcp-tab.md) ryšiais, įgūdžiais ir daugiagentine orkestracija; triggerius, pakartojimus ir [apkrovos paskirstymą](./cluster.md); [Traces](../tabs/traces-tab.md) su USD kaina už vykdymą ir OpenTelemetry eksportu; [Evals](../tabs/evals-tab.md); [žmonių peržiūros kontrolės taškus](./human-in-the-loop.md), apsaugos priemones, SSO ir auditą; bei REST, MCP ir Portal endpointus. Galimybių palyginimas su n8n, Zapier ir Make.com užbaigia puslapį.

Taip pat žiūrėkite [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) ir [Agentų Architektūra](./agent-architecture.md).

### [Greitas Pradėjimas](../getting-started/quick-start.md)

Paleiskite savo pirmąjį workflow per kelias minutes: sukurkite workflow iš [Workflows](../tabs/workflows-tab.md) skilties, pridėkite [Input](../nodes/input-node.md) mazgą, [LLM](../nodes/llm-node.md) mazgą ir [Output](../nodes/output-node.md) mazgą, tada juos sujunkite. Sukonfigūruokite [LLM](../nodes/llm-node.md) su kredencialu ir nustatykite `userMessage` į `$input.text`; naudokite Run arba [AI Assistant](./ai-assistant.md), kad vykdytumėte arba generuotumėte workflows su natūralia kalba.

Natūraliai derinasi su [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) ir [Expression DSL](./expression-dsl.md).

### [Pagrindinės Koncepcijos](../getting-started/core-concepts.md)

Workflows yra nukreipti grafai, kuriuose mazgai sujungti kraštinėmis; vykdymas teka iš trigger mazgų ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) per apdorojimo mazgus iki [Output](../nodes/output-node.md) mazgų. Kiekvienas mazgas turi tipą, duomenis (konfigūraciją) ir įvestis/išvestis; kraštinės apibrėžia duomenų srautą. Mazgai nurodo aukščiau esančius duomenis per [Expression DSL](./expression-dsl.md) išraiškas, tokias kaip `$nodeLabel.field`; nepriklausomi mazgai automatiškai vykdomi [paraleliai](./parallel-execution.md).

Taip pat žiūrėkite [Triggers](./triggers.md), [Paralelinis Vykdymas](./parallel-execution.md) ir [Workflow Struktūra](./workflow-structure.md).

### [Vykdymas ir Diegimas](../getting-started/running-and-deployment.md)

Heym teikia `run.sh` vietiniam vystymui (duomenų bazė Docker, FastAPI backend, Vite frontend) ir `deploy.sh` gamybai su Docker Compose. Abu naudoja `.env` failą; pagrindiniai kintamieji apima `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` ir `ALLOW_REGISTER`. Vystymas vykdomas konfigūruojamuose frontend ir backend prievaduose; gamyba teikia API po `/api` per frontend konteinerį.

Taip pat žiūrėkite [Saugumą](./security.md), [Įmonėms](./enterprise.md) ir [Nustatymus](./user-settings.md).

### [Migracija į Heym](../getting-started/migrate-to-heym.md)

AI Convert įrankis paverčia workflow iš kitos platformos (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) arba paprasto anglų kalbos aprašymo į Heym workflow, tiesiogiai transliuojamą į drobę ir paruoštą [atsisiųsti ir importuoti](./download-import.md). Jis vykdo AI saugumo patikrą, tada generuoja DSL su įvesties ir greičio ribomis. Atidarykite jį adresu [heym.run/convert](https://heym.run/convert).

Taip pat žiūrėkite [Greitas Pradėjimas](../getting-started/quick-start.md), [Atsisiųsti ir Importuoti](./download-import.md) ir [AI Assistant](./ai-assistant.md).

---

## Mazgai

### Triggeriai
#### [Įvesties mazgas](../nodes/input-node.md)

Įvesties mazgas yra įėjimo taškas Workflow, kurie gauna duomenis iš vartotojo arba API kvietėjo. Jis palaiko vieną arba kelis įvesties laukus ir atskleidžia užklausos metaduomenis (antraštes, užklausos parametrus). Pasiekite kūno laukus per `$nodeLabel.body.fieldKey`, antraštes per `$nodeLabel.headers`, ir užklausas per `$nodeLabel.query`.

Natūraliai derinamas su [Sąlyga](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) ir [Išvestis](../nodes/output-node.md). Dėl payload nuorodų ir laukų prieigos žr. [Išraiškų DSL](./expression-dsl.md) ir [Webhook](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Cron mazgas suaktyvina Workflow pagal grafiką, naudodamas standartinę penkių laukų cron išraišką. Vartotojo įvestis nereikalinga—Workflow vykdomas automatiškai nurodytu laiku (pvz., kas valandą, kasdien, kas 15 minučių). Išvestis yra suaktyvinimo įvykis be payload.

Taip pat žr. [Suaktyvinimai](./triggers.md), [Laukti](../nodes/wait-node.md) ir [Vykdymo istorija](./execution-history.md) suplanuotiems ir atidėtiems vykdymams.

#### [IMAP Suaktyvinimas](../nodes/imap-trigger-node.md)

IMAP Suaktyvinimo mazgas tikrina pašto dėžutę pagal konfigūruojamą minutės intervalą ir pradeda Workflow kiekvienam naujai aptiktam el. laiškui. Jis išveda išanalizuotas antraštes, siuntėjų ir gavėjų sąrašus, paprasto teksto ir HTML kūnus, priedų metaduomenis ir suaktyvinimo laiko žymę. Naudokite jį palaikymo pašto dėžutės triagavimui, pašto dėžutės į [Slack](../nodes/slack-node.md) maršrutizavimui arba el. laiškais pagrįstiems patvirtinimo srautams su [Žmogus cikle](./human-in-the-loop.md).

Derinamas su [Siųsti el. laišką](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) ir [Slack](../nodes/slack-node.md) įeinantiems triagavimo ir atsakymo Workflow.

#### [Heym Suaktyvinimas](../nodes/heym-trigger-node.md)

Heym Suaktyvinimo mazgas pradeda Workflow, kai Heym pats paskelbia platformos įvykį: `heym.started`, `workflow.created`, `workflow.updated` arba `workflow.deleted`. Pristatymas yra grupuojamas - kiekvienas įvykis, paskelbtas per vieną penkių sekundžių siuntimo langą, atkeliauja viename vykdyme kaip `$nodeLabel.events`, visada masyvas. Kiekvienas įvykis yra priskiriamas per unikalų duomenų bazės apribojimą, todėl jis įvyksta tik vieną kartą kiekvienam prenumeruojančiam mazgui, nesvarbu, kiek darbuotojų, konteinerių ar mašinų veikia. Naudokite jį Workflow pakeitimų audito takams, diegimo pranešimams ir instancijos sveikatos santraukoms.

Derinamas su [Heym](../nodes/heym-node.md) mazgu, kad būtų galima ieškoti pakeisto Workflow, ir su [Ciklas](../nodes/loop-node.md), kad veiktų vieną kartą per įvykį.

#### [Heym](../nodes/heym-node.md)

Heym mazgas skaito Heym duomenis per tris operacijas: `listWorkflows` grąžina kiekvieną Workflow, kurį savininkas gali pasiekti su mazgų skaičiais ir laiko žymėmis, `getWorkflow` grąžina vieno Workflow mazgų ir kraštų struktūrą, o `getExecutionHistory` grąžina vykdymo istorijos įrašus nuo naujausių iki seniausių su pasirenkamais statuso, laiko intervalo ir ribos filtrais, kartu su bendrais skaičiais, grupuotais pagal statusą. Rezultatai yra apriboti Workflow savininkui, kuriame gyvena mazgas, todėl vykdymas, pradėtas cron, portalo ar įvykio, grąžina tuos pačius duomenis kaip ir rankinis vykdymas. `getWorkflow` grąžina visą mazgo konfigūraciją, kas leidžia audituoti Workflow dėl kietai užkoduotų raktų ar token'ų; jis neatskleidžia nieko, ko Workflow savininkas negalėtų jau atidaryti redaktoriuje. Kredencialų nereikia.

#### [WebSocket Suaktyvinimas](../nodes/websocket-trigger-node.md)

WebSocket Suaktyvinimo mazgas atidaro išorinį klientų ryšį su WebSocket serveriu ir pradeda Workflow `onMessage`, `onConnected` arba `onClosed`. Jis atskleidžia išanalizuotus žinučių payload, atkūrimo būseną, uždarymo metaduomenis ir socket URL žemiau esančioms išraiškoms.

Derinamas su [WebSocket Siųsti](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) ir [SSE Streaming](./sse-streaming.md) realaus laiko integracijoms.

#### [Telegram Suaktyvinimas](../nodes/telegram-trigger-node.md)

Telegram Suaktyvinimo mazgas gauna bot webhook atnaujinimus ir iš karto pradeda Workflow. Jis atskleidžia visą atnaujinimo payload, pagrindinį žinutės objektą, atgalinius užklausimus, sanizuotas antraštes ir suaktyvinimo laiko žymę. Naudokite jį chatbot'ams, AI asistentams [Telegram](../nodes/telegram-node.md) ir mygtukais pagrįstiems srautams.

Derinamas su [Telegram](../nodes/telegram-node.md), [Agentų mazgu](../nodes/agent-node.md) ir [Webhook](./webhooks.md) bot'ais pagrįstiems Workflow.

#### [Slack Suaktyvinimas](../nodes/slack-trigger-node.md)

Slack Suaktyvinimo mazgas gauna Slack Events API webhook'us ir automatiškai pradeda Workflow po užklausos parašo patvirtinimo. Jis atskleidžia įvykio payload ir sanizuotas antraštes žemiau esančiam maršrutizavimui, [LLM](../nodes/llm-node.md) pagrindu klasifikacijai ir atsakymo srautams.

Derinamas su [Slack](../nodes/slack-node.md), [Agentų mazgu](../nodes/agent-node.md) ir [Trečiųjų šalių integracijomis](./integrations.md).

#### [Discord Suaktyvinimas](../nodes/discord-trigger-node.md)

Discord Suaktyvinimo mazgas gauna Discord Interactions API webhook'us, patvirtina Ed25519 parašus su pasirinkta `discord_trigger` kredencialu ir pradeda Workflow. Jis atskleidžia visą sąveikos payload, komandos duomenis, sanizuotas antraštes ir suaktyvinimo metaduomenis žemiau esančiam maršrutizavimui arba atsakymams.

Derinamas su [Išvestis](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agentų mazgu](../nodes/agent-node.md) ir [Trečiųjų šalių integracijomis](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ mazgas siunčia arba priima žinutes iš RabbitMQ eilučių ir mainų. Naudokite jį žinučių valdomiems workflows ir įvykių apdorojimui. Siuntimo režimas skelbia žinutę su pasirenkamu vėlavimu; gavimo režimas veikia kaip [trigger](./triggers.md), todėl workflow prasideda, kai atvyksta žinutė. Išvestis apima statusą, message_id ir turinį.

Jis derinamas su [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) ir [Parallel Execution](./parallel-execution.md) įvykių valdomam apdorojimui.

#### [Error Handler](../nodes/error-handler-node.md)

Error Handler mazgas veikia automatiškai, kai bet kuris mazgas workflow nepavyksta. Nereikia jokių įeinančių kraštų; jis yra aktyvuojamas variklio. Išvestis apima klaidos pranešimą, nepavykusio mazgo etiketę, mazgo tipą ir laiko žymę. Naudokite jį pranešimams siųsti per [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) arba [Send Email](../nodes/send-email-node.md), klaidų registravimui arba grąžinimui pritaikytų klaidų atsakymų.

Kaip alternatyva klaidų tvarkymui drobėje, workflow taip pat gali deleguoti nesėkmes atskiram workflow — žr. [Error Workflow](#error-workflow). Jei drobėje jau yra Error Handler mazgas, klaidų workflow **nėra** kviečiamas (vietinis tvarkytojas turi pirmenybę).

Dažniausi pranešimų tikslai yra [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) ir [Send Email](../nodes/send-email-node.md); vykdymo detales lengviau tikrinti [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent mazgas yra [LLM](../nodes/llm-node.md) mazgas su įrankių kvietimu. Jis gali vykdyti Python įrankius, kvieti prijungtus drobės mazgus kaip įrankius, prisijungti prie [MCP](../tabs/mcp-tab.md) serverių, naudoti įgūdžius (instrukcijų failus ir pasirenkamus Python scenarijus), veikti kaip orkestratorius, kuris deleguoja kitiems agentų mazgams, ir kvieti kitus workflows kaip įrankius. Išvestis yra prieinama kaip `$nodeLabel.text`. Pasirinktinė **Extra Body** jungiklis prideda JSON objektą su teikėjo specifiniais užklausos parametrais prie kiekvienos užklausos įrankių kvietimo cikle; jis pagal numatytuosius nustatymus yra išjungtas. Pasirinktinė **Use Responses API** jungiklis nukreipia agento modelio kvietimus per Responses API, kuris išlaiko modelio mąstymą per įrankių kvietimus, todėl mąstymo modelis išlaiko savo minties grandinę per daugiapakopį ciklą; jis pagal numatytuosius nustatymus yra išjungtas ir veikia su OpenAI ir pritaikytais kredencialais.

Drobės mazgų įrankiai leidžia agentui tiesiogiai kvieti sukonfigūruotus workflow mazgus iš drobės. Prijunkite palaikomą mazgą prie agento įrankių rankenos, tada pažymėkite konkrečius laukus kaip agento pateiktus su botų ikona. Šie laukai tampa įrankių parametrais vykdymo metu, o kredencialai ir nepažymėti laukai lieka fiksuoti mazgo konfigūracijoje.

Įgūdžių skyriuje dabar yra **AI Build** naujų įgūdžių kūrimui, įterptinė AI redagavimo veiksmas esamiems įgūdžiams, ZIP atsisiuntimas pagal įgūdžius ir pasirenkamas **Enable Drive files** jungiklis įgūdžiams, kuriems reikia skaityti Heym Drive failus vykdymo metu. Įgūdžių kūrimo modalas transliuoja pokalbį kairėje, priima drag-and-drop failus su kiekvienu tobulinimo komentaru, rodo gyvą tik skaitymui skirtą `SKILL.md` ir `.py` failų peržiūrą dešinėje, gali atsisiųsti tą peržiūrą kaip ZIP ir išsaugoti įkeltus tobulinimo failus kaip sujungtus įgūdžių turtus per tą patį ZIP įkėlimo srautą, naudojamą rankiniams įkėlimams.

Įgalinus **[Agent Persistent Memory](./agent-persistent-memory.md)**, kiekvienas agento mazgas išlaiko savo žinių grafiką: faktai įkeliami į sistemos promptą, kai jie nėra tušti, o sėkmingi vykdymai sukelia fono naujų subjektų ir ryšių sujungimą. Sub-agentai naudoja atskirus grafikus. Galite **dalintis** agento grafiku su kitais agentais (tais pačiais ar kitais workflows) su tik skaitymo arba skaitymo/rašymo prieiga iš grafiko dialogo. Drobės smegenų valdymas atidaro grafiko redaktorių.

Agentų mazgai taip pat gali įeiti į [Human-in-the-Loop](./human-in-the-loop.md) režimą. Šiame režime agentas gauna `request_human_review` įrankį ir gali sustoti specifiniuose patvirtinimo reikalaujančiuose žingsniuose, sukurti vienkartinę viešą peržiūros nuorodą, atskleisti `review` drobės šaką pranešimų srautams ir laukti, kol recenzentas priims, redaguos arba atsisakys Markdown peržiūros teksto. Mazgo HITL laukas veikia kaip patvirtinimo gairės, kada klausti, o recenzento santrauka generuojama iš kiekvieno peržiūros užklausimo. Dėl [MCP](../tabs/mcp-tab.md) įrankių, Heym naudoja modelį, kad interpretuotų tuos rašytinius nurodymus į `always`, `once` arba `never`, todėl laisvos formos patvirtinimo kalba atitinka konkretų vykdymo politiką. Vykdymas pažymimas kaip `pending` ir tęsiasi iš saugomos vykdymo nuotraukos, kai sprendimas atvyksta, o tas pats agento vykdymas gali sustoti daugiau nei vieną kartą, jei vėlesni žingsniai taip pat reikalauja peržiūros.

Agentų mazgai automatiškai suspaudžia savo sukauptą žinučių istoriją, kai ji priartėja prie 80% modelio konteksto lango. Sistemos promptas, pirmas vartotojo pranešimas ir naujausias vartotojo pranešimas visada išsaugomi; viskas tarp jų yra apibendrinama naudojant tą patį modelį ir kredencialus. Suspaudimo įvykiai yra matomi Debug panel, [Execution History](./execution-history.md) ir [Traces](../tabs/traces-tab.md) skirtuke.

Taip pat žr. [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) ir [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Codex mazgas vykdo OpenAI Codex CLI izoliuotoje Heym darbo erdvėje. Jis priima Codex kredencialą (prisijunkite su ChatGPT, kad galėtumėte naudoti savo prenumeratą be mokėjimo už kiekvieną API užklausą, arba įklijuokite prieigos tokeną), GitHub kredencialą, saugyklos URL, pagrindinę šaką, užduoties promptą, publikavimo režimą (`diff_only` arba `draft_pr`), šakos pavadinimą ir laiką. Vykdytojas vietoje klonuoja saugyklą, perduoda ChatGPT tokenų rinkinį arba `CODEX_ACCESS_TOKEN` tik Codex procesui ir grąžina struktūrizuotą santrauką, validacijos pastabas, pakeistus failus, diff, naudojimo metaduomenis ir neprivalomą juodraštinį PR URL.

Kai Codex grąžina `needs_input`, darbo eiga sustoja ir atskleidžia `question` šaką. Prijunkite tą šaką prie Slack, el. pašto ar kito pranešimų mazgo; viešas sekimo nuoroda atnaujina išsaugotą vykdymo momentinę nuotrauką po to, kai atsakymas pateikiamas. Codex mazgas taip pat gali būti prijungtas prie AI Agent kaip įrankis, leidžiantis agentui deleguoti kodavimo užduotis; kaip įrankis, `needs_input` rezultatas grąžinamas tiesiogiai agentui, o ne sustabdant darbo eigą.

Taip pat žr. [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) ir [Node Types](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go mazgas vykdo OpenCode CLI (Go) prieš GitHub saugyklą. Izoliacija vykdoma pagal Codex modelį: vietoje jis veikia kaip pagrindinis subprocess, o Docker diegimai vykdo jį viduje sustiprintoje seserų konteineryje, kuris dalijasi darbo erdvės tūriu. Jis priima OpenCode Go kredencialą (vartotojo API raktą su neprivalomu pagrindiniu URL), GitHub kredencialą, saugyklos URL, pagrindinę šaką, užduoties promptą, publikavimo režimą, šakos pavadinimą, laiką ir `opencode-go/<model>` modelį, pasirinktiną iš gyvo, paieškos galimybes turinčio modelių sąrašo (su įmontu atsarginiu variantu). Heym atlieka visas git/GitHub operacijas pagrindiniame kompiuteryje ir niekada neįdeda GitHub tokeno į smėlio dėžę; OpenCode tik redaguoja failus diske. Mazgas grąžina struktūrizuotą santrauką, validacijos pastabas, pakeistus failus, diff ir neprivalomą pull request URL. Jis gali būti prijungtas prie AI Agent kaip įrankis.

Taip pat žr. [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) ir [Node Types](./node-types.md).

#### [LLM](../nodes/llm-node.md)

LLM mazgas apdoroja tekstą su kalbos modeliu arba generuoja vaizdus. Jis palaiko teksto generavimą, viziją (vaizdo įvestis), vaizdų generavimą, struktūrizuotą JSON išvestį, tiekėjo natyvią Batch API vykdymą palaikomiems OpenAI ir OpenAI suderinamiems endpointams, ir neprivalomą **Use Responses API** perjungiklį, kuris nukreipia užklausą per Responses API vietoj Chat Completions (išjungtas pagal numatytuosius nustatymus; veikia su OpenAI ir pritaikytais kredencialais, ir negali būti derinamas su Batch režimu). Sukonfigūruokite kredencialą, modelį, sistemos ir vartotojo pranešimus, temperatūrą ir maksimalų tokenų skaičių; naudokite [Expression DSL](./expression-dsl.md) promptuose. Batch režimu `userMessage` turi būti išspręstas į masyvą, mazgas išmeta `batchStatus` šaką su pažangos atnaujinimais, o galutinė išvestis apima kiekvieno elemento batch rezultatus. Neprivalomas **Extra Body** perjungiklis prideda JSON objektą su tiekėjo specifiniais užklausos parametrais (pavyzdžiui, `{"thinking": {"type": "disabled"}}`) prie kiekvienos API užklausos; jis pagal numatytuosius nustatymus yra išjungtas. Neprivalomi [Guardrails](./guardrails.md) blokuoja nesaugią turinį prieš užklausą.

Natūraliai derinasi su [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) ir [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Decision mazgas užduoda sprendimų modelio tipizuotus klausimus apie vykdymo būseną ir grąžina tikimybę vietoj prozos. **State** laukas nurodo, ką modelis turėtų perskaityti — vienas išraiška išlaiko savo tipą, todėl `$input` siunčia objektą, o ne jo tekstą — ir klausimų sąrašas neša sprendimus. Klausimai būna trijų formų: **noul** atsako, ar sąlyga galioja, **choice** pasirenka vieną variantą iš nustatyto rinkinio ir grąžina visą pasiskirstymą, o **score** įvertina būseną pagal užsakytus lygius ir gali būti tarp jų. Choice ir score atsakymai taip pat neša pasitikėjimo lygį, todėl [Switch](../nodes/switch-node.md) gali nukreipti pagal atsakymą, o [Condition](../nodes/condition-node.md) gali uždaryti, kaip tikra buvo. **Generate with AI** parengia būsenos šabloną ir klausimų eiles iš paprasto sakinio, o **Custom request body** siunčia ranka rašytą JSON užklausai, kurios sutartis skiriasi. Tiekėjo atsakymas perduodamas nepakitęs, o kiekvienas skambutis įrašomas [Traces](../tabs/traces-tab.md).

Reikia Decision Model kredencialo; natūraliai derinasi su [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) ir [Agent Node](../nodes/agent-node.md).
#### [RAG / Vektorių saugykla](../nodes/rag-node.md)

RAG / Vektorių saugyklos mazgas įterpia, atnaujina, ištrina ir ieško dokumentų vektorių saugykloje, skirta atsižvelgimui į generavimą. Duomenų bazės išskleidžiamajame sąraše pasirenkamas backend — **Qdrant** (išorinis serveris) arba **Postgres (pgvector)** (Heym nuosava duomenų bazė, be išorinių paslaugų), numatytasis pasirinkimas yra Qdrant. Pasirinkite vektorių saugyklą iš [Vektorių saugyklų](../tabs/vectorstores-tab.md) skyriaus ir nustatykite operaciją įterpti, atnaujinti, ištrinti arba ieškoti. Atnaujinimas ir ištrynimas adresuoja dokumentą pagal unikalų id, saugomą payload — **Dokumento ID Laukas** nurodo tą lauką (numatytasis `doc_id`), o **Dokumento ID** neša jo vertę — taigi dokumentas išlaiko id, kurį jau naudoja jūsų sistema: atnaujinimas pakeičia kiekvieną atitinkantį tašką prieš saugant naują versiją, o ištrynimas praneša, ar kas nors atitiko. Dokumento metaduomenys priima išraiškas savo vertėse, taigi `{"url": "$start.url"}` saugo, ką sukūrė vykdymas. Paieška palaiko metaduomenų filtrus ir neprivalomą Cohere pergrupavimą, ir grąžina rezultatų masyvą su tekstu, balu, metaduomenimis, pergrupuoto žymekliu ir skaičiumi, skirtu naudoti [LLM](../nodes/llm-node.md) arba [Agent Node](../nodes/agent-node.md) darbo eigose.

Dažniausiai naudojami žemiau esantys mazgai yra [LLM](../nodes/llm-node.md) ir [Agent Node](../nodes/agent-node.md); vektorių saugyklos nustatymas yra [Vektorių saugyklų](../tabs/vectorstores-tab.md) skiltyje.

#### [MCP Skambinimo Mazgas](../nodes/mcp-call-node.md)

MCP Skambinimo mazgas tiesiogiai kviečia konkretų [MCP](../tabs/mcp-tab.md) įrankį, be LLM sprendimo, kurį įrankį naudoti. Naudokite jį, kai tiksliai žinote, kurį įrankį reikia vykdyti projektavimo metu — deterministiniam, vieno žingsnio MCP įrankio vykdymui darbo eigoje. Sukonfigūruokite ryšį (SSE, Streamable HTTP arba stdio; tie patys laukai kaip [Agent Node](../nodes/agent-node.md) MCP ryšys), spustelėkite **Gauti Įrankius**, kad užpildytumėte išskleidžiamąjį sąrašą, pasirinkite įrankį ir užpildykite argumentų laukus, kurie automatiškai sugeneruojami iš įrankio įvesties schemos. Kiekvienas argumentas priima statinę vertę arba [DSL išraišką](./expression-dsl.md), tokią kaip `$userInput.body.text`. Rezultatas yra prieinamas kaip `$nodeLabel.result` (JSON objektas, jei jį galima analizuoti, kitaip - eilutė). MCP Skambinimo mazgas negali būti prijungtas prie [Agent Node](../nodes/agent-node.md) kaip drobės įrankis.

Taip pat žr. [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) ir [Expression DSL](./expression-dsl.md).

### Logika

#### [Sąlyga](../nodes/condition-node.md)

Sąlygos mazgas šakoja darbo eigą pagal if/else išraišką. Jis turi du išvesties rankenas: vieną, kai sąlyga yra teisinga, ir vieną, kai ji yra klaidinga. Naudokite palyginimo ir loginės operacijas iš [Expression DSL](./expression-dsl.md) sąlygos išraiškoje; mazgas perduoda įvestį pasirinktam šakos keliui.

Taip pat žr. [Perjungti](../nodes/switch-node.md), [Klaidos metimas](../nodes/throw-error-node.md) ir [Expression DSL](./expression-dsl.md).

#### [Perjungti](../nodes/switch-node.md)

Perjungimo mazgas nukreipia vykdymą į skirtingus kelius, palygindamas vertę su atvejais. Suconfigure an expression to evaluate and a list of case values; each case gets a source handle and a default handle is used for non-matching values. Įvestis perduodama per atitinkamą šaką.

Naudokite [Sąlygą](../nodes/condition-node.md) dvejetainiam šakojimui ir [Sujungti](../nodes/merge-node.md) sujungti nukreiptus kelius; atitikimo taisyklės aprašytos [Expression DSL](./expression-dsl.md).

#### [Sujungti](../nodes/merge-node.md)

Sujungimo mazgas laukia kelių lygiagrečių įvesties ir sujungia jas į vieną išvestį. Nustatykite laukiamų įvesties skaičių; mazgas sukuria sujungtą objektą, kai visos šakos baigiasi. Naudokite jį sujungti rezultatus iš lygiagrečių šakų prieš tęsdami; nenaudokite, kai lygiagretūs šakai baigiasi atskiruose Išvesties mazguose.

Taip pat žr. [Lygiagretus vykdymas](./parallel-execution.md), [Ciklas](../nodes/loop-node.md) ir [Išvestis](../nodes/output-node.md), kai reikia sujungti šakas.

#### [Ciklas](../nodes/loop-node.md)

Ciklo mazgas iteruoja per masyvą, vykdydamas žemiau esančius mazgus kiekvienam elementui. Jis reikalauja atgalinio ryšio iš paskutinio mazgo iteracijos kūne, kad galėtų tęsti. Ciklo kūne naudokite `item`, `index`, `total`, `isFirst` ir `isLast`; ciklas turi atskiras išvestis iteracijos keliui ir baigimo keliui.

Pora su [Kintamuoju](../nodes/variable-node.md), [Sujungti](../nodes/merge-node.md) ir [Expression DSL](./expression-dsl.md) iteratyvioms darbo eigoms.

### Duomenys

#### [Nustatyti](../nodes/set-node.md)

Nustatymo mazgas transformuoja ir žemėlapiuoja įvesties duomenis į pasirinktą išvestį. Apibrėžkite raktų-vertės žemėlapius, kur kiekviena vertė yra [Expression DSL](./expression-dsl.md) išraiška. Naudokite jį didžiosioms raidėms, daliniams tekstams, sujungimui, atsitiktiniams skaičiams ir panašioms transformacijoms. Pasiekite išvestį pagal raktą (pvz., `$setNode.keyName`). Kai jis prijungtas prie agento kaip drobės mazgo įrankis, žemėlapio vertės gali būti pažymėtos kaip agento pateiktos, kad agentas užpildytų jas vykdymo metu. Norint kviesti kitus darbo eigas, naudokite [Vykdyti](../nodes/execute-node.md) mazgą.

Taip pat žr. [Kintamasis](../nodes/variable-node.md), [Vykdyti](../nodes/execute-node.md) ir [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Converter mazgas konvertuoja duomenis tarp formatų nerašant kodo. Teksto konversijos yra `csvToJson` (CSV tekstas į eilučių objektų masyvą arba masyvus, kai nėra antraštės), `jsonToCsv` (objektų/eilučių masyvas į CSV tekstą), `xmlToJson` (XML tekstas į objektą) ir `jsonToXml` (objektas į XML tekstą). Nurodykite konversijos kryptį ir šaltinio išraišką; CSV konversijoms papildomai naudojamas skyriklis ir antraštės tvarkymas, o `jsonToCsv` gali nustatyti aiškų stulpelių tvarką. Cituojant, įterptiems skyrikliams ir įterptiems naujiems eilučių simboliams taikoma RFC 4180. XML atributai naudoja `@` prefiksus, tekstas, sumaišytas su atributais, naudoja `#text`, pakartotiniai elementai tampa masyvais, o XML entitetų plėtra yra išjungta. Tas pats mazgas taip pat veikia su saugomais failais. `imageToText` ir `pdfToText` vykdo Tesseract OCR, skaitydami failą iš Heym Drive (`$Upload.file.id` iš failo įkėlimo trigger'io, Drive mazgo rezultato arba agento sugeneruoto failo), automatiškai parinkdami kalbą iš aptikto rašto arba naudodami kodus, kuriuos nurodote, pvz., `tur` arba `eng+tur`, ir normalizuodami tekstą į UTF-8 pagal nutylėjimą su pasirinktinėmis NFC normalizacijomis ir siauresniais simbolių rinkiniais, tokiais kaip `cp1254`. `fileConvert` perrašo saugomą failą kitu formatu, dokumentus per pandoc ir vaizdus per Pillow, ir išsaugo rezultatą kaip naują Drive failą, nepaliesdamas originalo. Rezultatas yra prieinamas kaip `$converterNode.result`, kartu su `.language`, `.encoding`, `.page_count`, `.pages` ir `.file` OCR vykdymams, ir `.id`, `.filename`, bei `.download_url` `fileConvert`.

Taip pat žr. [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) ir [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Code mazgas vykdo Jūsų rašytą Python kodą, turintį savo `requirements.txt`, konteineryje, kuris sukuriamas ir sunaikinamas kiekvienam vykdymui. Jūsų kodas apibrėžia `main(params)` funkciją ir grąžina bet kokią JSON serializuojamą reikšmę, kuri tampa `$codeNode.result`; bet kas, ką jis išspausdina, yra fiksuojama atskirai kaip `$codeNode.logs`, o `$codeNode.install` praneša, kuris įrankis įdiegė priklausomybės. Parametrai konfigūruojami kaip JSON objektas, kurio `$` išraiškos yra išsprendžiamos prieš vykdymą, o kodas juos skaito taško notacija, pvz., `params.user.name` arba `params.orders[0].id`. Priklausomybės yra diegiamos naudojant `uv`, grįžtant prie `pip`, jei paketai, kurių `uv` negali apdoroti, su jokiomis talpyklomis tarp vykdymų; palikus `requirements.txt` tuščią, diegimas visiškai praleidžiamas ir yra daug greitesnis. Vykdymo fazėje nėra tinklo, nebent `codeAllowNetwork` yra įjungtas, o priklausomybės diegimas visada pasiekia PyPI. Smėlio dėžė veikia be root teisių, su visomis galimybėmis atšauktomis, skaitymo režimu, be Docker lizdo ir be prieigos prie backend paslapčių, ribojama iki 512 MB atminties, vieno CPU, 256 procesų, 120 sekundžių diegimo ir 60 sekundžių vykdymo. Docker yra būtinas, ir nėra atsarginio režimo: be pasiekiamo demonų mazgas nepavyksta, o ne vykdo Jūsų kodo backend procese.

#### [Variable](../nodes/variable-node.md)

Variable mazgas nustato arba atnaujina workflow vietinį kintamąjį (`$vars.variableName`) arba nuolatinį [globalų kintamąjį](./global-variables.md) (`$global.variableName`). Naudokite jį skaičiavimams, sukauptoms sąrašams ir bendram būsenai. Konfigūruokite kintamojo pavadinimą, reikšmės išraišką, tipo konversiją ir ar saugoti globaliame saugykloje. Masyvų kintamieji palaiko `$array()` ir `.add()`.

Pora su [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) ir [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Execute mazgas kviečia kitą workflow (sub-workflow) ir perduoda jam įvestį. Nurodykite tikslinį workflow pagal ID ir pateikite įvestį per vieną išraišką arba raktų-reikšmių žemėlapius. Išvestis apima workflow_id, statusą ir išvestis; naudokite jį pakartotinai naudojamai logikai, o ne duomenų transformacijai (naudokite Set tam).

Taip pat žr. [Canvas Features](./canvas-features.md) dėl Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) ir [Output](../nodes/output-node.md).

### Integrations

#### [HTTP](../nodes/http-node.md)

HTTP mazgas atlieka HTTP užklausas naudodamas cURL stiliaus konfigūraciją. Jis gali būti workflow pradžios taškas (be įeinančio krašto) arba gauti įvestį iš aukščiau esančių mazgų. Atsakymas yra prieinamas kaip statusas, antraštės ir kūnas (išanalizuotas JSON, kai taikoma). Naudokite [Credentials](./credentials.md) dėl Bearer arba pasirinktinių antraščių autentifikavimo.

Pora su [Webhooks](./webhooks.md), [Credentials](./credentials.md) ir [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

WebSocket Send mazgas atidaro išėjimo kliento ryšį, siunčia vieną tekstinę/JSON/binary žinutę ir uždaro jį. Naudokite jį, kad paskelbtumėte workflow išvestį realaus laiko sistemoms, nesukurdami Heym-hosted socket endpoint.

Taip pat žr. [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) ir [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Telegram mazgas siunčia botų žinutes į pokalbį, grupę ar kanalą. Sukonfigūruokite Telegram [kredencialą](./credentials.md), nustatykite `chatId` ir sukurkite išeinančią `message` naudodami [Expression DSL](./expression-dsl.md) išraiškas. Jis natūraliai derinamas su [Telegram Trigger](../nodes/telegram-trigger-node.md) pokalbių darbo eigoms ir su [Error Handler](../nodes/error-handler-node.md) operatorių įspėjimams.

Taip pat žr. [Trečiųjų šalių integracijas](./integrations.md) ir [Kredencialus](./credentials.md) nustatymui ir kredencialų pavyzdžiams.

#### [Slack](../nodes/slack-node.md)

Slack mazgas siunčia žinutes į Slack kanalą per Incoming Webhook. Sukonfigūruokite Slack [kredencialą](./credentials.md) ir žinutės išraišką. Naudokite jį pranešimams, įspėjimams ir klaidų ataskaitoms; išvestis perduodama per įvestį.

Derinamas su [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) ir [Trečiųjų šalių integracijomis](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Discord mazgas siunčia žinutes į Discord kanalą per Incoming Webhook. Sukonfigūruokite Discord [kredencialą](./credentials.md), sukurkite išeinančią žinutę naudodami [Expression DSL](./expression-dsl.md) ir, jei reikia, nustatykite webhook vartotojo vardą arba avatarą.

Derinamas su [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) ir [Trečiųjų šalių integracijomis](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Send Email mazgas siunčia el. laiškus per SMTP. Sukonfigūruokite SMTP [kredencialą](./credentials.md) ir [Expression DSL](./expression-dsl.md) išraiškas gavėjams, temai ir turiniui. Naudokite jį pranešimams, įspėjimams ir transakciniams el. laiškams. Išvestis apima statusą, gavėją ir temą.

[IMAP Trigger](../nodes/imap-trigger-node.md) papildo Send Email, tvarkydamas gaunamus laiškus. Kartu jie leidžia darbo eigai skaityti gaunamus el. laiškus iš bendro pašto dėžutės, apibendrinti arba klasifikuoti juos su AI mazgais ir siųsti sekimo arba eskalavimo žinutę. [Telegram Trigger](../nodes/telegram-trigger-node.md) ir [Telegram mazgas](../nodes/telegram-node.md) suteikia tą pačią įeinančią/išeinančią struktūrą botų valdomiems pokalbių darbo eigoms.

Dvišalėms pranešimų srautams jis taip pat gerai derinamas su [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) ir [Trečiųjų šalių integracijomis](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Redis mazgas atlieka Redis operacijas: set, get, hasKey ir deleteKey. Naudokite jį talpinimui, greičio ribojimui ir raktų-vertės saugojimui. Sukonfigūruokite [kredencialą](./credentials.md), operacijos tipą, raktų išraišką, o set operacijoms - vertę ir pasirinktą TTL. Išvestis priklauso nuo operacijos (vertė, sėkmė, egzistuoja, ištrinta).

Derinamas su [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) ir [Parallel Execution](./parallel-execution.md) talpinimui, greičio ribojimui ir koordinavimui.

#### [Grist](../nodes/grist-node.md)

Grist mazgas skaito, rašo ir valdo duomenis Grist skaičiuoklėse. Operacijos apima getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables ir listColumns. Nurodykite dokumento ID, lentelės ID, o kuriant/atnaujinant - įrašų duomenis naudojant stulpelių ID. Naudokite jį CRUD, partijų atnaujinimams ir skaičiuoklių automatizavimui.

Taip pat žr. [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) ir [Trečiųjų šalių integracijas](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets mazgas skaito, rašo ir valdo skaičiuoklių duomenis per OAuth2. Naudokite jį ataskaitoms skaityti, darbo eigos rezultatams pridėti, sekikliams atnaujinti ir lapų skirtukams išvalyti arba apžiūrėti darbo eigoje. Kaip ir [BigQuery](../nodes/bigquery-node.md), jis naudoja Google palaikomą integracijos kredencialą ir gerai dera su [Grist](../nodes/grist-node.md), kai skaičiuoklių duomenys yra darbo eigos dalis.

Derinamas su [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) ir [Trečiųjų šalių integracijomis](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery mazgas vykdo SQL užklausas ir įterpia eiles į Google BigQuery duomenų rinkinius per OAuth2. Jis naudingas analitikos darbo eigoms, ataskaitų srautams ir struktūrizuotų įvykių duomenų rašymui iš darbo eigos vykdymų. Dažnai derinamas su [Set](../nodes/set-node.md) eilių formavimui ir [Google Sheets](../nodes/google-sheets-node.md) lengvesnėms skaičiuoklių ataskaitoms.

Derinamas su [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) ir [Trečiųjų šalių integracijomis](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive mazgas leidžia sąrašą, atsisiųsti, atnaujinti ir ištrinti Drive failus ir aplankus per OAuth2, taip pat gali kopijuoti Drive failą tiesiai į [Heym Drive](../nodes/drive-node.md) su `syncToHeymDrive` operacija. Google Docs, Sheets ir Slides neturi atsisiunčiamų baitų, todėl mazgas juos automatiškai eksportuoja — Docs į PDF, Sheets į XLSX, Slides į PPTX — su galimybe perrašyti tikslinį formatą. Ištrynimai perkelia elementus į Drive šiukšlių dėžę, nebent yra įjungta "Ištrinti visam laikui", o mazgas atsisako ištrinti aplanką per failo operaciją arba atvirkščiai. Kaip ir [Google Sheets](../nodes/google-sheets-node.md), jis naudoja Google palaikomus OAuth2 kredencialus; atkreipkite dėmesį, kad šie kredencialai reikalauja pilno Drive prieigos, todėl peržiūrėkite [Credential Sharing](./credentials-sharing.md) prieš dalindamiesi jais.

Pora su [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) ir [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

GitHub mazgas teikia 40 natūralių GitHub REST veiksmų, apimančių saugyklas, organizacijas ir vartotojus, problemas, pull request'us, atsiliepimus, išleidimus, Actions workflows, srauto įžvalgas ir saugyklos failus. Naudokite jį problemų triagavimui, atsiliepimų automatizavimui, darbo eigų iškvietimui ir užbaigimo laukimui, išleidimų automatizavimui ir saugyklos failų atnaujinimams be rankinio HTTP užklausų kūrimo. Jis palaiko GitHub.com ir pasirenkamą GitHub Enterprise `base_url` kredenciale.

Pora su [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) ir [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Jira mazgas jungia workflows su Jira Cloud arba Jira Data Center / Server REST API projektų, problemų, komentarų, priedų, vartotojų, pranešimų ir perėjimų automatizavimui. Jis gali sąrašą projektų, ieškoti problemų su JQL, kurti arba atnaujinti problemas, tikrinti pakeitimų žurnalus, informuoti suinteresuotąsias šalis, valdyti komentarus ir priedus, gauti arba valdyti vartotojus, sąrašą galimų perėjimų ir perkelti problemas per perėjimo ID. Naudokite Jira kredencialus su Atlassian el. pašto adresu, API žetonu, svetainės pagrindiniu URL ir diegimo režimu.

Pora su [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) ir [Third-Party Integrations](./integrations.md) palaikymo priėmimui, klaidų triagavimui ir išleidimų workflows.

#### [Linear](../nodes/linear-node.md)

Linear mazgas jungia workflows su Linear GraphQL API darbo vietos ir problemų automatizavimui. Jis gali sąrašą komandų, projektų, problemų, darbo eigos būsenų, komandos narių ir komentarų; kurti, atnaujinti, ištrinti ir susieti problemas; ir kurti, atnaujinti, išspręsti, atšaukti arba ištrinti komentarus. Naudokite Linear asmeninį API raktą arba OAuth2 kredencialą, tada atraskite komandos, projekto, būsenos ir atsakingo asmens UUID iš sąrašų operacijų prieš kuriant arba atnaujinant problemas.

Pora su [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) ir [Third-Party Integrations](./integrations.md) priėmimui, triagavimui ir inžinerijos užduočių workflows.

#### [Supabase](../nodes/supabase-node.md)

Supabase mazgas skaito ir keičia lenteles, kurios yra prieinamos per Supabase PostgREST. Jis puikiai tinka produktų backend'ams, vartotojų/profilio duomenims, darbo eigos būsenoms ir CRUD tipo automatizavimams, kurie nori prieigos prie duomenų bazės be individualaus HTTP užklausų kūrimo.

Pora su [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) ir [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse mazgas vykdo CRUD, skaičiavimo ir žaliųjų SQL operacijas prieš išorinę ClickHouse duomenų bazę per jos HTTP sąsają. Jis tinka analitikos srautams, įvykių registravimui ir ataskaitų workflows: įterpkite įvykius, kai jie įvyksta, tada agreguokite arba skaičiuokite juos su `query`/`count`. Jis atspindi [DataTable](../nodes/datatable-node.md) operacijų rinkinį (find, getAll, count, getById, insert, update, remove, upsert) plius žaliųjų SQL pabėgimo angą, su `update`/`remove` veikiančiais kaip ClickHouse mutacijos.

Pora su [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) suplanuotoms ataskaitoms ir [Third-Party Integrations](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Notion mazgas valdo Notion duomenų bazes, duomenų šaltinius, puslapius ir blokus per dabartinę Notion API (`2026-03-11`). Jis palaiko paiešką, puslapio CRUD, duomenų bazės ir duomenų šaltinių operacijas, blokų vaikus, blokų pridėjimą/atnaujinimą/ištrynimą ir šiukšlių dėžę/atkūrimą. Naudokite vidinį integracijos žetoną arba Notion viešos integracijos OAuth kredencialą. Redaktorius gali ieškoti ir puslapiuoti prieinamus duomenų šaltinius ir tėvų puslapius. Bendrinami kredencialai veikia taip pat kaip nuosavi kredencialai darbo eigos vykdymui.

Norint atlikti individualias REST užklausas, `$credentials.YourNotionCredential` išsprendžia į tą patį bearer token. Pora su [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) ir [Third-Party Integrations](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Sentry mazgas automatizuoja Sentry organizacijas, projektus, komandas, problemas, įvykius ir leidimus per Sentry REST API. Naudokite jį įspėjimų triagavimui, problemų būsenos atnaujinimams, leidimų automatizavimui, įvykių paieškai ir projektų/komandų nustatymui ar valymui. Jis palaiko Sentry SaaS ir savarankiškai talpinamą Sentry per pasirenkamą kredencialų pagrindinį URL.

Pora su [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) ir [Third-Party Integrations](./integrations.md) incidentų ir leidimų workflows.

#### [DataTable](../nodes/datatable-node.md)

DataTable mazgas skaito, rašo ir valdo duomenis Heym DataTables (pirmo lygio struktūrizuota saugykla). Operacijos apima find, getAll, getById, insert, update, remove ir upsert. Išoriniai kredencialai nereikalingi. Lentelės valdomos iš [DataTable](../tabs/datatable-tab.md) valdymo skyriaus ir tiesiogiai pasiekiamos darbo eigų savininko.

Pora su [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) ir [DataTable tab](../tabs/datatable-tab.md) pirmo lygio struktūrizuotai saugyklai.

#### [Drive](../nodes/drive-node.md)

Drive mazgas valdo failus, kuriuos generuoja įgūdžiai tiesiogiai iš darbo eigos. Operacijos apima delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams ir unshareWithMyTeams, skirtas skaitymo teisių valdymui komandoje; formatų konvertavimas vykdomas [Converter](../nodes/converter-node.md) mazge. Failą galima nurodyti su `$agentLabel._generated_files[0].id`; išvestys apima statusą, file_id, atnaujintą download_url nuorodų apribojimams ir shared_team_count komandos dalijimuisi. Tai ypač naudinga su [Agent Node](../nodes/agent-node.md) workflows, kurie naudoja [File Generation](./file-generation.md) ir [Drive](./drive.md) nuorodų modelį.

Dažnai naudojami partneriai yra [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) ir [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 mazgas vykdo objekto saugojimo operacijas Amazon S3 naudojant `s3` kredencialą (prieigos raktas, slaptažodis, regionas, pasirenkamas sesijos žetonas). Operacijos apima putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder ir listBuckets. Teksto įkėlimas ir teksto arba base64 atsisiuntimas yra palaikomi, o kibiro ir rakto laukai priima [Expression DSL](./expression-dsl.md). Naudokite jį darbo eigos išvestims saugoti, failams archyvuoti ir objektams perskaityti atgal į srautą.

Pora su [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) ir [Third-Party Integrations](./integrations.md).

### Automatizacija

#### [Crawler](../nodes/crawler-node.md)

Crawler mazgas renka duomenis iš interneto puslapių naudodamas FlareSolverr su pasirenkamu HTML ištraukimu per CSS selektorius. Sukonfigūruokite FlareSolverr [kredencialą](./credentials.md), URL išraišką, laukimo laiką ir pasirenkamus selektorius ištraukai. Išvestis yra žali HTML arba ištraukta turinys. Naudokite jį interneto duomenų rinkimui ir turinio ištraukai.

Pora su [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) ir [LLM](../nodes/llm-node.md) duomenų rinkimo ir analizės srautams.

#### [Playwright](../nodes/playwright-node.md)

Playwright mazgas automatizuoja naršyklės sąveikas su konfigūruojamais žingsniais (navigate, refresh, click, type, screenshot, extract, aiStep) arba **Run Code** režimu, skirtu individualiam Playwright Python (saugomam; pagal numatytuosius nustatymus išjungtam per `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Jis palaiko headless režimą, pasirenkamą nustatymą, kuris sumažina dažniausiai pasitaikančius Playwright automatizavimo signalus, laikinas ribas, pasirenkamą tinklo užfiksavimą (atsakymus, slapukus, localStorage, sessionStorage), slapuko/saugojimo būsenos autentifikavimo pradžią iš [Global Variables](./global-variables.md) išraiškų, tokių kaip `$global.authState`, atsarginius prisijungimo žingsnius, kai autentifikavimo atkūrimas nepavyksta, ir AI žingsnį su Auto Heal, kai selektoriai nepavyksta. Naudokite jį interneto duomenų rinkimui, formų užpildymui ir naršyklės pagrindu veikiančioms darbo eigoms.

Taip pat žr. [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) ir [Execution History](./execution-history.md) naršyklės automatizavimui ir derinimui.

### Įrankiai

#### [Output](../nodes/output-node.md)

Output mazgas yra darbo eigos galinis taškas, kuris grąžina atsakymą skambinančiajam. Nustatykite pranešimo išraišką, kad nurodytumėte ankstesnį mazgą pagal etiketę (niekada nenaudokite `$input` iš [Input](../nodes/input-node.md) mazgo čia). Pasirenkamas asinchroninis žemyn leidžia mazgams po išvesties veikti fone po atsakymo išsiuntimo.

Dažniausiai naudojami šaltiniai yra [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) ir [Execute](../nodes/execute-node.md); atsakymo formavimas yra lengviau derinamas [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper mazgas sukuria paprastą JSON objektą iš [Set](../nodes/set-node.md) stiliaus raktų-vertės atitikmenų ir grąžina jį darbo eigos atsakymo šaknyje. Naudokite jį, kai API skambinantysis turėtų gauti žalią JSON kūną, o ne standartinį [Output](../nodes/output-node.md) mazgo apvalkalą.
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

HTML output mapper mazgas atvaizduoja vieną HTML šabloną, interpoliuodamas `$nodeLabel.field` išraiškas į puslapį. Kai tai yra vienintelis workflow terminalinis mazgas, execute webhook atsako su `text/html` ir mazgo sukonfigūruotu statuso kodu vietoj JSON kūno, todėl workflow gali tiesiogiai pateikti puslapį naršyklei. Siųskite `X-Simple-Response: false`, kad gautumėte įprastą JSON apvalkalą atgal derinimui.

Pora su [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) ir [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Chart Output mazgas yra terminalinis mazgas [Dashboard](../tabs/dashboard-tab.md) valdiklio workflow. Jis paverčia aukščiau esančių mazgų sugeneruotas eilutes į standartizuotą chart payload, kurį atvaizduoja dashboard. Pasirinkite `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text, arba HITL), sužymėkite `labelField`/`valueField` (arba `series` daugeliui serijų, arba `text` markdown žinutei) ir įdėkite jį paskutinį; jis neturi išvesties krašto. HITL ignoruoja aukščiau esančias eilutes ir išvardija Jūsų laukiančius žmogiškus atsiliepimus. o kitą – kaip nuorodų mygtukus, atveriančius URL naujame skirtuke (`linkColumn`, su `linkLabel` mygtuko tekstui)

Taip pat žr. [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) ir [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Wait mazgas sustabdo workflow vykdymą nurodytam laikotarpiui milisekundėmis, iki 15 minučių. Naudokite jį greičio ribojimui, atidėtam veiksmui ar apklausų intervalams. Jis perduoda įvestį nepakitusią.

Pora su [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) ir [Parallel Execution](./parallel-execution.md) greičiui ir apklausoms.

#### [Sticky Note](../nodes/sticky-note-node.md)

Sticky Note mazgas prideda markdown pastabas prie drobės. Jis nėra vykdomas. Naudokite jį dokumentacijai, instrukcijoms ar workflow pastaboms kartu su kitomis [Canvas Features](./canvas-features.md). Dukart spustelėkite drobę, kad redaguotumėte pastabų turinį.

Taip pat žr. [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) ir [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Console Log mazgas registruoja vertę serverio konsolėje. Naudokite jį derinimui ir tikrinimui kūrimo metu. Žinutė registravimui palaiko [Expression DSL](./expression-dsl.md) išraiškas; išvestis perduodama nepakitusi.

Pora su [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) ir [Expression Evaluation Dialog](./expression-evaluation-dialog.md) derinimui.

#### [Disable Node](../nodes/disable-node.md)

Disable Node mazgas nuolat išjungia kitą mazgą workflow, nustatydamas jo `active` žymę į false. Nurodykite tikslinį mazgą pagal etiketę. Naudokite jį vienkartinėms operacijoms, pavyzdžiui, sustabdyti [Cron](../nodes/cron-node.md) trigger po sąlygos įvykdymo.

Taip pat žr. [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) ir [Cron](../nodes/cron-node.md) workflow valdymo modeliams.

#### [Enable Node](../nodes/enable-node.md)

Enable Node mazgas vėl įjungia kitą mazgą, nustatydamas jo `active` žymę į true ir išsaugodamas pakeitimą. Nurodykite tikslinį mazgą pagal etiketę. Naudokite jį, kad vėl įjungtumėte išjungtą [Cron](../nodes/cron-node.md) trigger iš kitos įėjimo vietos arba kad įjungtumėte mazgą, kai sąlyga yra įvykdyta. Tikslas, esantis žemiau Enable Node ir dar nevykdytas, taip pat bus vykdomas dabartiniame vykdyme.

Taip pat žr. [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) ir [Cron](../nodes/cron-node.md) workflow valdymo modeliams.

#### [Throw Error](../nodes/throw-error-node.md)

Throw Error mazgas nedelsiant sustabdo workflow vykdymą ir grąžina klaidos atsakymą su pasirinktiniu HTTP statuso kodu. Nustatykite klaidos žinutės išraišką ir statuso kodą (pvz., 400, 401, 403, 404, 429, 500). Naudokite jį validacijos nesėkmėms, neautorizuotam prieigai ar kitoms klaidų sąlygoms, ypač kai jis derinamas su [Condition](../nodes/condition-node.md) ir [Error Handler](../nodes/error-handler-node.md).

Pora su [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) ir [Security](./security.md) aiškiems nesėkmių keliams.

---

## Reference
### [Mazgų tipai](./node-types.md)

Heym siūlo įvairius mazgų tipus: triggere, tokius kaip [Įvesties mazgas](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) ir [Klaidų tvarkyklė](../nodes/error-handler-node.md); AI mazgai, tokie kaip [LLM](../nodes/llm-node.md), [Sprendimas](../nodes/decision-node.md), [Agentų mazgas](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) ir [MCP Call](../nodes/mcp-call-node.md); logikos mazgai, tokie kaip [Sąlyga](../nodes/condition-node.md), [Perjungiklis](../nodes/switch-node.md), [Sujungimas](../nodes/merge-node.md) ir [Ciklas](../nodes/loop-node.md); duomenų mazgai, tokie kaip [Nustatyti](../nodes/set-node.md), [Konverteris](../nodes/converter-node.md), [Kodas](../nodes/code-node.md), [Kintamasis](../nodes/variable-node.md), [Vykdyti](../nodes/execute-node.md) ir [Heym](../nodes/heym-node.md); integracijos, tokios kaip [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Siųsti el. laišką](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Duomenų lentelė](../nodes/datatable-node.md) ir [Drive](../nodes/drive-node.md); automatizavimo mazgai, tokie kaip [Crawler](../nodes/crawler-node.md) ir [Playwright](../nodes/playwright-node.md); ir įrankiai, tokie kaip [Laukti](../nodes/wait-node.md), [Išvestis](../nodes/output-node.md), [JSON išvesties žemėlapis](../nodes/json-output-mapper-node.md), [HTML išvesties žemėlapis](../nodes/html-output-mapper-node.md), [Konsolės žurnalas](../nodes/console-log-node.md), [Klaidų išmetimas](../nodes/throw-error-node.md), [Mazgo išjungimas](../nodes/disable-node.md), [Mazgo įjungimas](../nodes/enable-node.md) ir [Lipnusis užrašas](../nodes/sticky-note-node.md). Naudokite išraiškas, tokias kaip `$input.text` ir `$nodeLabel.field` mazgo konfigūracijoje.

Taip pat žr. [Triggere](./triggers.md), [Trečiųjų šalių integracijas](./integrations.md) ir [Lygiagrečią vykdymą](./parallel-execution.md).

### [Išraiškų DSL](./expression-dsl.md)

Heym naudoja paprastą išraiškų kalbą, kad galėtų nurodyti duomenis iš aukščiau esančių mazgų. Naudokite `$input` [Įvesties mazgo](../nodes/input-node.md) atveju, `$nodeLabel.field` bet kuriam aukščiau esančiam mazgui, `$credentials.CredentialName` [kredencialams](./credentials.md) ir `$global.variableName` [globaliems kintamiesiems](./global-variables.md). Įmontuoti specialūs kintamieji apima `$now`, `$UUID` ir darbo eigos metaduomenis: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` ir `$executionId` (vykdymo [Vykdymo istorijos](./execution-history.md) ID — `/workflows/{id}/{executionId}` atidaro tą vykdymą drobėje; tik vykdymo metu, tuščias išraiškos peržiūros dialoge). Palaikoma literaliai, aritmetika, palyginimai, [Ciklo](../nodes/loop-node.md) kontekstas, įdėtiniai laukai ir eilutės/masyvų pagalbiniai įrankiai (įskaitant `$text.toJson()`, kad būtų galima analizuoti JSON eilutę). Kai visas vertės yra vienas `$expr`, backendas išlaiko masyvus, objektus, boolean ir skaičius kaip natūralias tipus.

Taip pat žr. [Išraiškų vertinimo dialogą](./expression-evaluation-dialog.md), [Globalius kintamuosius](./global-variables.md) ir [Darbo eigos struktūrą](./workflow-structure.md).

### [Globalūs kintamieji](./global-variables.md)

Globalių kintamųjų saugykla laiko nuolatinius, vartotojo apibrėžtus raktų-vertės duomenis, kurie išlieka tarp darbo eigos vykdymų. Kintamuosius galima kurti iš [Kintamųjų](../tabs/global-variables-tab.md) skyriaus arba iš [Kintamojo](../nodes/variable-node.md) mazgo su įjungta "Išsaugoti globalių kintamųjų saugykloje" parinktimi. Pasiekite juos naudodami `$global.variableName` išraiškose; jie gali būti dalijami su kitais vartotojais arba [komandomis](./teams.md).

Pora su [Kintamuoju](../nodes/variable-node.md), [Komandomis](./teams.md) ir [Kredencialų dalijimusi](./credentials-sharing.md) bendram darbo eigos būsenai.
### [Išraiškos Vertinimo Dialogas](./expression-evaluation-dialog.md)

Išraiškos Vertinimo Dialogas yra išplečiamas redaktorius, kuris pasirodo, kai paspaudžiate plėtimo mygtuką šalia išraiškos laukų. Jis atsidaro kaip didelis centrinis modalas, išlaiko automatinio užpildymo funkciją aktyvią ir automatiškai atnaujina backend peržiūros išvesties rezultatus, kai sustabdote rašymą. Objektų ir masyvų rezultatus galima naršyti naudojant išvesties kelio pasirinkiklį. Dialogas priima pilno eilutės nuogą taško kelią (pavyzdžiui, `myNode.output.field`) taip, lyg tai būtų `$myNode.output.field`; žr. [Išraiškos DSL](./expression-dsl.md) vietos taisykles.

**Kurkite su AI** mygtukas įrankių juostoje leidžia Jums aprašyti norimą išraišką paprasta kalba. Pasirinkite LLM [kredencialą](./credentials.md) ir modelį, įveskite aprašymą, pavyzdžiui, *"Gauti kliento vardą iš API atsakymo"*, ir spustelėkite Generuoti. Backend siunčia [Išraiškos DSL](./expression-dsl.md) kontekstą ir paskutinio vykdymo mazgo išvestis modeliui ir grąžina vieną išraiškos eilutę. Rezultatas vertinamas iš karto, kad galėtumėte jį patikrinti prieš spustelėdami Taikyti.

Natūraliai derinasi su [Išraiškos DSL](./expression-dsl.md), [Išvestimi](../nodes/output-node.md) ir [JSON išvesties žemėlapiu](../nodes/json-output-mapper-node.md).

### [Workflow Struktūra](./workflow-structure.md)

Workflow yra saugomi kaip JSON su mazgais ir briaunomis. Workflow objektas apima id, pavadinimą, aprašymą, mazgus, briaunas ir autentifikavimo nustatymus. Kiekvienas mazgas turi id, tipą, poziciją ir duomenis (etiketę ir tipo specifinę konfigūraciją). Briaunos jungia šaltinio ir tikslo mazgo ID su pasirenkamais rankenų ID. Išraiškos sintaksė duomenų laukuose atitinka [Išraiškos DSL](./expression-dsl.md), ir ši pati struktūra naudojama [Atsisiųsti ir Importuoti](./download-import.md).

Taip pat žr. [Mazgų Tipai](./node-types.md), [Išraiškos DSL](./expression-dsl.md) ir [Atsisiųsti ir Importuoti](./download-import.md).

### [Drobės Funkcijos](./canvas-features.md)

Perveskite bet kurį nestabilų drobės mazgą ir spustelėkite **Vykdyti**, kad atliktumėte iki to mazgo. Reikalingi įvestys atsidaro Vykdymo panelėje su pirmuoju lauku, kuris yra fokusuotas; keliai be įvesties pradedami iš karto. Žr. [Vykdyti iki Mazgo](./canvas-features.md#run-to-node).

Workflow redaktorius suteikia Duomenų Pin (prikabinti mazgo paskutinę išvestį testavimui žemiau be pakartotinio vykdymo), Vykdymo Žurnalus (realiojo laiko mazgo rezultatus ir agento pažangą, kurie papildo [Vykdymo Istoriją](./execution-history.md)), Įjungti/Išjungti (praleisti mazgus vykdymo metu) ir Išskirti į Sub-Workflow (perkelti pasirinkimą į naują workflow ir pakeisti jį su [Vykdyti](../nodes/execute-node.md) mazgu). Veikiantis gamybos vykdymas gali būti atidarytas iš Istorijos arba Lentos kortelės; redaktorius atkūrė jo dabartinį momentinį vaizdą, prijungia prie SSE ir išlaiko drobės animaciją bei Debug žurnalus gyvus. [Klaviatūros Sparčiosios Klavišai](./keyboard-shortcuts.md) palaiko kopijavimą, įklijavimą, vykdymą ir įterptinį mazgo paiešką.

Taip pat žr. [Klaviatūros Sparčiosios Klavišai](./keyboard-shortcuts.md), [Redagavimo Istorija](./edit-history.md) ir [Vykdymo Istorija](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Žiūrėti Redaktoriaus demonstraciją</a></p>

### [Klaviatūros Sparčiosios Klavišai](./keyboard-shortcuts.md)

Heym teikia sparčiuosius klavišus visame redaktoriuje: Komandų Paletė (Ctrl+K), Vykdyti (Ctrl+Enter), Išsaugoti (Ctrl+S), Atšaukti/Perdaryti ir Escape, kad uždarytumėte. Drobėje: pasirinkti viską, daugiapasirinkimas, kopijuoti/kirpti/įklijuoti, ištrinti, perjungti mazgo įgalinimą (D), perjungti prikabintus duomenis (P) ir įterptinė mazgo paieška rašant. Sparčiuosius klavišus dokumentuoja programėlės nuoroda ir jie glaudžiai bendradarbiauja su [Drobės Funkcijomis](./canvas-features.md), tokiomis kaip Duomenų Pin ir mazgo įgalinimas/išjungimas.

Taip pat žr. [Drobės Funkcijos](./canvas-features.md), [Greitas Dėklas](./quick-drawer.md) ir [Kontekstinis Demonstravimas](./contextual-showcase.md).

### [AI Asistentas](./ai-assistant.md)

AI Asistentas yra pokalbių panelė, atidaroma iš Debug panelės, leidžianti Jums kurti arba keisti workflows natūralia kalba. Pasirinkite [kredencialą](./credentials.md) ir modelį, tada aprašykite, ko norite; AI transliuoja atsakymą, o bet koks galiojantis [workflow JSON](./workflow-structure.md) kodų bloke automatiškai analizuojamas ir taikomas drobėje. Balso įvestis palaikoma suderinamuose naršyklėse.

Įjunkite **YOLO režimą** (Agentų režimas, išjungtas pagal numatytuosius nustatymus) ir asistentas testuoja, ką sukuria. Po kiekvieno pakeitimo jis vykdo workflow drobėje, skaito rezultatą ir taiso workflow, kol jis atlieka tai, ko paprašėte, iki 5 vykdymų per žinutę. Prieš pirmąjį vykdymą jis prašo testinių įvesties, gali vykdyti Jūsų kitus workflows, kai jam reikia jų rezultato, ir rodo kiekvieną žingsnį, kai dirba. Žr. [AI Asistentas › YOLO Režimas](./ai-assistant.md#yolo-mode).

Spustelėkite **AI** virš bet kurio mazgo drobėje, kad pakeistumėte ar pataisytumėte tik tą mazgą. Skydelyje rodomas mazgas, kurį jis keičia (su paskutiniu jo rezultatu po vykdymo), ir siūloma **Change this node as ...**, **Fix error in this node ...** bei **Other**. Atnaujinamas tik tas mazgas; likusi workflow dalis ir išdėstymas lieka nepakitę. Žr. [AI Assistant › Vieno mazgo keitimas](./ai-assistant.md#changing-one-node).

Kai workflow saugo įrašus, asistentas klausia, kurią [duomenų lentelę](../tabs/datatable-tab.md) naudoti, arba sukuria vieną su stulpeliais, kurių reikia workflow. Žr. [AI Asistentas › Duomenų lentelės](./ai-assistant.md#data-tables).

Kai dabartinis workflow apima [Agentų Mazgo](../nodes/agent-node.md) įgūdžius, asistentas siunčia tik kiekvieno įgūdžio `SKILL.md` į workflow kontekstą. Prikabinti `.py` failai ir binariniai įgūdžių ištekliai yra neįtraukiami prieš užklausą, kad dideli įgūdžių paketai neperpildytų modelio konteksto lango.

Natūraliai derinasi su [Chat with Heym](./chat-with-heym.md), [Agentų Architektūra](./agent-architecture.md) ir [Išraiškos DSL](./expression-dsl.md).
### [Pokalbiai su Heym](./chat-with-heym.md)

Pokalbiai su Heym yra dokumentacijos antraštės asistentas produktų klausimams. Jis atsidaro centre esančiame dialoge, išlaiko kredencialų ir modelių pasirinkimą matomą viršuje, įterpia aktyvios dokumentacijos puslapio kelią kaip kontekstą ir išvalo žinučių istoriją, kai dialogas užsidaro. Tai papildo platesnį [AI Assistant](./ai-assistant.md) ir lengvesnį [Contextual Showcase](./contextual-showcase.md).

Taip pat žr. [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) ir [Mazgų tipai](./node-types.md).

### [Workflow Organizacija](./workflow-organization.md)

Instance administratoriai (`HEYM_ADMIN_EMAILS`) gali pasiekti ir redaguoti kiekvieną workflow, rasti savininko workflow pagal el. paštą, tikrinti tvarkaraščius ir vykdymo istoriją, sustabdyti ir atnaujinti automatinį trigger'į, ir ištrinti workflow, kai vykdymai baigiasi. Žr. [Instance Administration](../tabs/workflows-tab.md#instance-administration) dėl atleidimo proceso ir skirtumo tarp automatinio trigger'io sustabdymo ir visų skambučių blokavimo.

Workflow gali būti organizuojami aplankuose ir poaplankuose medžio struktūroje. Aplankai turi pavadinimus ir pasirinktinius tėvus; workflow priskiriami aplankams. Workflow gali būti suplanuoti ištrinti (perkelti į šiukšlių sritį prieš nuolatinį pašalinimą). API palaiko workflow kūrimą, atnaujinimą, ištrynimą ir perkėlimą tarp aplankų, o tas pats organizavimo modelis pasirodo [Workflows](../tabs/workflows-tab.md) skirtuke.

Taip pat žr. [Quick Drawer](./quick-drawer.md), [Atsisiųsti ir Importuoti](./download-import.md) ir [Redagavimo istorija](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer yra fiksuota dešinėje pusėje esanti greito vykdymo panelė vidinėms ne-drobės puslapio. Ji leidžia ieškoti [workflow](../tabs/workflows-tab.md), fiksuoti mėgstamiausius, pasirinkti įvestis, vykdyti iš karto ir tikrinti pažangą ar rezultatus neatsidarius redaktoriaus. Workflow su [File Upload Trigger](../nodes/file-upload-trigger-node.md) priima nuvilktą arba pasirinktą failą. Fiksavimo tvarka ir paskutinis pasirinktas workflow saugomi naršyklėje.

Taip pat žr. [Workflow Organizacija](./workflow-organization.md), [Klaviatūros spartieji klavišai](./keyboard-shortcuts.md) ir [Vykdymo istorija](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase yra kompaktiška programėlės viduje esanti gido juosta autentifikuotoms pagrindinėms paviršiams, tokiems kaip informacijos suvestinės skirtukai, [Evals](../tabs/evals-tab.md), Dokumentai ir workflow redaktorius. Ji išlieka uždaryta pagal numatytuosius nustatymus, pirmiausia pateikia trumpą puslapio santrauką, siūlo šiek tiek papildomos informacijos pagal poreikį ir nuorodą į visą dokumentacijos straipsnį, kai reikia gilesnės pagalbos.

Pora su [Pokalbiais su Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) ir [AI Assistant](./ai-assistant.md) programėlės viduje esantiems gido srautams.

### [Kredencialai](./credentials.md)

Kredencialai saugo API raktus ir slaptažodžius, naudojamus workflow mazguose. Juos pridėkite [Kredencialų](../tabs/credentials-tab.md) skirtuke ir nurodykite pagal pavadinimą arba ID tokiuose mazguose kaip [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Siųsti el. laišką](../nodes/send-email-node.md) ir [Redis](../nodes/redis-node.md). Jie yra užšifruoti, gali būti dalijami su vartotojais arba [komandomis](./teams.md) ir taip pat gali būti nurodyti [Expression DSL](./expression-dsl.md) per `$credentials.Name`.

Taip pat žr. [Kredencialai](../tabs/credentials-tab.md), [Kredencialų dalijimasis](./credentials-sharing.md) ir [Trečiųjų šalių integracijos](./integrations.md).

### [Kredencialų dalijimasis](./credentials-sharing.md)

Kredencialai gali būti dalijami su kitais vartotojais el. paštu arba su komandomis; visi komandos nariai gauna prieigą, kai kredencialas dalijamas su komanda. Bendrinami kredencialai pasirodo su indikatoriumi [Kredencialų](../tabs/credentials-tab.md) skirtuke. Vykdymo metu workflow savininko kontekstas sujungia nuosavas, vartotojų bendrinamas ir komandos bendrinamas kredencialus. Naudokite `$credentials.CredentialName` išraiškose arba nustatykite credentialId mazgo duomenyse.

Taip pat žr. [Kredencialai](./credentials.md), [Komandos](./teams.md) ir [Trečiųjų šalių integracijos](./integrations.md).

### [Komandos](./teams.md)

Komandos leidžia dalintis workflow, kredencialais, globaliais kintamaisiais, vektorių saugyklomis ir Drive failais su grupe vartotojų vienu metu. Sukurkite komandas [Komandų](../tabs/teams-tab.md) skirtuke ir pridėkite narius pagal el. paštą. Dalinkitės ištekliais su komanda iš atitinkamų dalijimosi dialogų; visi nariai tada turi prieigą. Kūrėjas gali redaguoti ir ištrinti komandą; ištrynus komandą, pašalinami visi komandos dalijimaisi.

Pora su [Kredencialų dalijimusi](./credentials-sharing.md), [Globaliais kintamaisiais](./global-variables.md) ir [Enterprise](./enterprise.md).

### [Lygiagretus vykdymas](./parallel-execution.md)

Heym vykdo mazgus lygiagrečiai, kai jie neturi priklausomybių vienas nuo kito. Vykdytojas sukuria DAG ir vykdo mazgus tame pačiame lygyje vienu metu su gijų baseinu; kai tik mazgas baigia darbą, jo žemyniniai mazgai yra suplanuojami. Naudokite [Merge](../nodes/merge-node.md) mazgą, kad sujungtumėte lygiagrečius šakas, kai to reikia. Kelios workflow vykdymo sesijos vykdomos vienu metu; kiekvienas vykdymas yra izoliuotas. [SSE Streaming](./sse-streaming.md) režimas skleidžia įvykius, kai mazgai baigia darbą.

Taip pat žr. [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) ir [Vykdymo istorija](./execution-history.md).
### [Agent Architektūra](./agent-architecture.md)

[Agent Node](../nodes/agent-node.md) palaiko sub-agentus (orkestratorius kviečia kitus agentų mazgus per call_sub_agent), sub-workflows (agentas kviečia kitus workflows per call_sub_workflow), įgūdžius (instrukcijų turinys ir Python įrankiai iš .zip arba .md) ir [MCP](../tabs/mcp-tab.md) kliento ryšius. Orkestratoriaus įrankių vykdytojas nukreipia sub-agentų ir sub-workflow kvietimus; kiti įrankiai eina į Python, MCP arba įgūdžių vykdytojus. Maksimalus sub-agentų ir sub-workflow įdėjimo gylis yra 5. Įrankių kvietimo ciklas apima automatinį konteksto suspaudimą: prieš kiekvieną iteraciją, token naudojimas yra įvertinamas, ir jei jis viršija 80% modelio konteksto lango, viduriniai pranešimai yra apibendrinami naudojant tą patį modelį, išlaikant sistemos promptą, pirmą vartotojo pranešimą ir paskutinį vartotojo pranešimą nepakitusius.

Taip pat žr. [Agent Node](../nodes/agent-node.md), [Agent Nuolatinė Atmintis](./agent-persistent-memory.md), [Žmogus Ciklo Viduje](./human-in-the-loop.md) ir [MCP](../tabs/mcp-tab.md).

### [Agent Nuolatinė Atmintis](./agent-persistent-memory.md)

Pasirinktinė per [Agent Node](../nodes/agent-node.md) žinių grafas, saugomas Postgres: subjektai, tipai, savybės ir nukreipti ryšiai. Kai `persistentMemoryEnabled` yra tiesa, grafas yra apibendrinamas į sistemos promptą kiekvieno vykdymo metu; po sėkmingų užbaigimų, [LLM](../nodes/llm-node.md) fone išgauna struktūrizuotus atnaujinimus. REST CRUD yra po `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Redaktorius atsidaro iš rožinės smegenų kontrolės mazge.

Taip pat žr. [Agent Node](../nodes/agent-node.md), [Agent Architektūra](./agent-architecture.md) ir [Vykdymai](../tabs/traces-tab.md).

### [Žmogus Ciklo Viduje](./human-in-the-loop.md)

Žmogus ciklo viduje leidžia [Agent Node](../nodes/agent-node.md) prašyti patvirtinimo tam tikruose kontroliniuose taškuose, sukurti viešą `/review/{token}` puslapį ir laukti, kol neprisijungęs recenzentas priims, redaguos arba atsisakys Markdown recenzijos teksto. HITL galintys agentai taip pat atskleidžia `review` išvesties rankeną, kad galėtumėte pranešti [Slack](../nodes/slack-node.md), [Siųsti El. Laišką](../nodes/send-email-node.md) arba kitiems kanalams, kol vykdymas laukia. Mazgo lygio HITL tekstas naudojamas kaip patvirtinimo gairės, o viešo puslapio santrauka generuojama iš recenzijos prašymo. Laukiantys vykdymai iš karto pasirodo [Vykdymo Istorijoje](./execution-history.md), gali įvykti daugiau nei vieną kartą tame pačiame vykdyme ir tęsti nuo tiksliai saugomo workflow nuotraukos, kai kiekvienas sprendimas yra pateiktas.

Taip pat žr. [Agent Node](../nodes/agent-node.md), [Portalas](./portal.md), [Vykdymo Istorija](./execution-history.md) ir [Siųsti El. Laišką](../nodes/send-email-node.md).

### [Webhook'ai](./webhooks.md)

Workflows gali būti aktyvuojami per [HTTP](../nodes/http-node.md) adresu `POST /api/workflows/{workflow_id}/execute`, arba srautu iš `POST /api/workflows/{workflow_id}/execute/stream`. Užklausos kūnas perduodamas kaip kūnas [Input](../nodes/input-node.md) mazgams; antraštės ir užklausos parametrai yra prieinami [Expression DSL](./expression-dsl.md) išraiškose. Konfigūruokite autentifikaciją pagal workflow: anoniminė, JWT arba pasirinktinis antraštė. Pasirinktinė atsakymo talpykla, greičio ribojimas ir redaktoriaus „Vykdyti su cURL“ dialogas visi yra workflow ir taikomi abiem režimams.

Taip pat žr. [Input](../nodes/input-node.md), [Vykdymo Tokenai](./execution-tokens.md), [SSE Srautas](./sse-streaming.md), [HTTP](../nodes/http-node.md) ir [Workflow Struktūra](./workflow-structure.md).

### [Vykdymo Tokenai](./execution-tokens.md)

Vykdymo tokenai yra apibrėžti JWT, kurie suteikia prieigą prie vieno workflow vykdyti ir srauto endpoint'ų. Kai workflow naudoja JWT autentifikaciją, tokenai leidžia išoriniams scenarijams, CI pipeline'ams ir integracijoms kvieti workflow be vartotojo sesijos dalijimosi. Kiekvienas tokenas turi `wid` teiginį, kuris jį priskiria vienam workflow, `jti`, naudojamą momentiniam atšaukimui, ir konfigūruojamą TTL (60 sekundžių iki 10 metų). Kurkite, pasirinkite ir atšaukite tokenus tiesiogiai iš **Vykdyti su cURL** dialogo — pasirinktas tokenas automatiškai įterpiamas į sugeneruotą komandą.

Taip pat žr. [Webhook'ai](./webhooks.md), [Saugumas](./security.md) ir [SSE Srautas](./sse-streaming.md).

### [SSE Srautas](./sse-streaming.md)

cURL dialogas gali perjungti [webhook](./webhooks.md) vykdymą į Server-Sent Events režimą. Tai generuoja `execution_started`, `node_start`, `node_complete` ir `execution_complete` įvykius realiu laiku, prideda `--no-buffer` prie sugeneruotos cURL komandos ir leidžia konfigūruoti kiekvieno mazgo pradžios pranešimus, tokius kaip `[START] LLM` arba pasirinktinis tekstas išoriniams terminalo vartotojams.

Taip pat žr. [Webhook'ai](./webhooks.md), [Vykdymo Istorija](./execution-history.md) ir [LLM](../nodes/llm-node.md).
### [Triggeriai](./triggers.md)

Workflow'ai pradedami naudojant trigger mazgus ([Įvestis](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) gauti) arba įėjimo taškus: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron tvarkaraštis, Telegram webhook, Discord interakcijos webhook, IMAP trigger valdymo priemonė, RabbitMQ vartotojas arba Redaktoriaus vykdymas. Kiekvienas trigger turi savo endpoint'ą arba fono procesą; [Cron](../nodes/cron-node.md) veikia kas 60 sekundžių, [Telegram Trigger](../nodes/telegram-trigger-node.md) mazgai gauna bot webhook'us, [Discord Trigger](../nodes/discord-trigger-node.md) mazgai gauna pasirašytus interakcijos webhook'us, o [IMAP Trigger](../nodes/imap-trigger-node.md) mazgai veikia pagal jų sukonfigūruotą apklausos intervalą. [Įvestis](../nodes/input-node.md) mazgai gauna kūną, antraštes ir užklausas iš webhook užklausų.

Taip pat žr. [Mazgų tipai](./node-types.md), [Webhook'ai](./webhooks.md) ir [Lygiagreti vykdymas](./parallel-execution.md).

### [Vykdymo istorija](./execution-history.md)

Vykdymo istorija registruoja workflow vykdymus: įvestis, išvestis, mazgų rezultatus, būseną ir trigger šaltinį. Prie jos galima prieiti iš Redaktoriaus įrankių juostos, Dokumentų peržiūros, Valdymo skydelio antraštės arba [Vertinimų](../tabs/evals-tab.md) peržiūros. Kiekvieno workflow istorija rodo vykdymus atvirame workflow; visos istorijos peržiūra rodo vykdymus tarp workflow ir pokalbių. Šiuo metu vykdomi vykdymai rodomi abiejose dialogo lango viršuje su **Atidaryti tiesiogiai** ir **Atšaukti** veiksmais. Atidaryti tiesiogiai prijungia redaktorių prie esamo vykdymo per [SSE](./sse-streaming.md), atkuriama užbaigti mazgai, pulsuoja dabartiniai ir laukiamieji mazgai, ir pridedami Debug žurnalai, nepradedant naujo vykdymo. Atnešti į Drobę įkelia užbaigto vykdymo įvestis ir mazgų išvestis pakartotiniam vykdymui arba derinimui; gili nuoroda `/workflows/{workflowId}/{executionId}` palaiko tiek tiesioginius, tiek užbaigtus vykdymus. [Žmogus cikle](./human-in-the-loop.md) sustabdyti vykdymai iš karto saugomi kaip `pending`, įskaitant viešą peržiūros URL ir bet kuriuos pranešimų mazgus, vykdomus iš agento `review` šakos. Jei serveris perkraunamas vykdymo metu, nutraukti vykdymai automatiškai atkuriami: jie vykdomi iš naujo su tais pačiais įvestimis ir rodomi kaip užbaigti (pažymėti **Atkurti**), kontroliuojami per workflow **Automatinis atkūrimas** perjungimo, kuris gali juos užregistruoti kaip `skipped`.

Taip pat žr. [SSE Streaming](./sse-streaming.md), [Žmogus cikle](./human-in-the-loop.md) ir [Vykdymo pėdsakai](../tabs/traces-tab.md).

### Vykdymo akcentai

Po tiesioginio vykdymo — arba po **Atnešti į Drobę** — atsiranda uždarinamas **Vykdymo akcentai** iššokantis langas, kuris rodomas dešiniajame viršutiniame Drobės kampe, nurodantis, ką kiekvienas mazgas pagamino vykdymo tvarka. Tai greitas būdas patikrinti kiekvieno mazgo išvestį, nesukeliant kiekvieno mazgo; uždarykite jį su **✕**, ir jis vėl atsidarys kitame vykdyme. Akcentai taip pat rodomi valdymo skydelio vykdymuose. Žr. [Vykdymo istorija](./execution-history.md) dėl detalių.

### [Redagavimo istorija](./edit-history.md)

Redagavimo istorija seka išsaugotas workflow versijas (kiekvienas Išsaugoti sukuria versiją). Peržiūrėkite sąrašą, atidarykite versiją, kad pamatytumėte skirtumą su dabartiniu workflow ([mazgai](./workflow-structure.md), briaunos, konfigūracija), ir Atkurti, kad atkurtumėte praeitą versiją. Skirtingai nuo [Vykdymo istorijos](./execution-history.md), Redagavimo istorija seka struktūros pokyčius, o ne vykdymus.

Taip pat žr. [Vykdymo istorija](./execution-history.md), [Workflow struktūra](./workflow-structure.md) ir [Drobės funkcijos](./canvas-features.md).

### Klaidos workflow

Workflow gali nurodyti kitą workflow, kuris bus vykdomas, kai jis nepavyksta. Sukonfigūruokite jį workflow lygio **Savybėse** (rodoma, kai jokio mazgo nepasirinkta) po **Klaidos atveju vykdyti workflow**. Tik workflow savininkas gali nustatyti, keisti ar išvalyti jį; žr. [Savininko nustatymai](./workflow-organization.md#owner-only-settings). Kai aukščiausio lygio vykdymas baigiasi su neapdorota klaida, pasirinktas klaidos workflow vykdomas ir gauna klaidos kontekstą (nesėkmingo workflow id ir pavadinimą, vykdymo id, klaidos pranešimą, nesėkmingo mazgo etiketę ir tipą bei laiko žymę). Jei drobėje jau yra [Klaidos tvarkyklė](../nodes/error-handler-node.md) mazgas, vietinis tvarkytojas turi pirmenybę, o klaidos workflow **nėra** kviečiamas. Klaidos workflow vykdomas tiesiogiai, todėl jis niekada nesukelia savo klaidos workflow.

Tai apima kiekvieną nebandymo aukščiausio lygio vykdymą: tiek vykdymo endpoint'us, [Portalą](./portal.md), tiek kiekvieną trigger, įskaitant [cron](../nodes/cron-node.md), pokalbių platformos triggerius, el. paštą, eiles, [MCP](../tabs/mcp-tab.md) ir valdymo skydelio valdiklius. Su [Krovimo paskirstymu](./cluster.md) įjungtu tai nesikeičia, įskaitant vykdymus, kuriuos atliko darbuotojas: nesėkmingas mazgas grįžta su rezultatu, o klaidos workflow tada paskirstomas kaip bet kuris kitas vykdymas, todėl mazgas jame, kuris turi būti vykdomas pagrindinėje instancijoje, vis tiek veikia. Dviem atvejais sąmoningai paliekama, nes workflow rezultatas dar nėra žinomas: vykdymas, kurio niekas niekada nevykdė, ir laukimas, kuris pasibaigė, kol vykdymas gali vis dar vykti. Taip pat **nėra** kviečiamas rankiniu būdu vykdomų drobės testų.
### Workflow Timeout

Kiekvienas workflow gali nustatyti **workflow timeout** sekundėmis workflow lygio **Properties** panelėje. `0` (numatytasis) jį išjungia. Kai nustatomas, vykdymas, kuris viršija limitą, yra sustabdytas prie kito mazgo ribos ir užfiksuojamas kaip nepavykęs vykdymas su "timed out" klaida. Timeout taikomas rankiniams, API ir trigger vykdymams. Ilgi [Wait](../nodes/wait-node.md) mazgai yra nutraukiami nedelsiant, o ne blokuojami visą jų trukmę.

### Time Saved

Kiekvienas workflow gali užfiksuoti **įvertintą sutaupytą laiką per vykdymą** (minutėmis), nustatytą workflow lygio **Properties** panelėje. [Analytics](../tabs/analytics-tab.md) skirtukas apibendrina tai per pasirinktą intervalą kaip bendrą **Time Saved** statistiką (kiekvieno workflow įvertinimo suma × jo sėkmingi vykdymai). Most Used taip pat nurodo tą sumą kiekvienam workflow; **Not Set** atidaro įvertinimo lauką, kai jis nėra nustatytas. [Workflow Analysis](./workflow-analysis.md) ataskaita rekomenduoja nustatyti įvertinimą, kai jis nėra sukonfigūruotas.

### [Settings](./user-settings.md)

Nustatymų dialogas (atidaromas iš Jūsų avataro antraštėje) turi keturis skirtukus: Profilis (Gravatar nuotrauka, rodymo vardas, Vartotojo taisyklės), [Security](./security.md) (keisti slaptažodį), Balsas ([ElevenLabs TTS/STT](./chat-voice.md)), ir Stebėjimas (tik skaitymui [OpenTelemetry](./opentelemetry.md) būsena). Vartotojo taisyklės yra individualios instrukcijos, įterpiamos į kiekvieną AI užklausą, įskaitant workflow kūrėją ir [Chat](../tabs/chat-tab.md), todėl galite nustatyti kalbą, toną, kodavimo stilių ar workflow konvencijas vieną kartą. Taip pat yra slaptažodžio politika ir [MCP](../tabs/mcp-tab.md) API raktų valdymas.

Taip pat žr. [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md), ir [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym gali generuoti OpenTelemetry pėdsakus kiekvienam workflow vykdymui ir mazgo vykdymui: šaknis `heym.workflow.execute` span kiekvienam vykdymui ir vaikas `heym.node.execute` span kiekvienam mazgui, su modelio ir token naudojimu, pridedamu prie LLM ir agentų mazgų. Spans eksportuojami per OTLP/HTTP į bet kurį suderinamą backend'ą (Jaeger, Grafana Tempo, Honeycomb, Datadog), o W3C pėdsako kontekstas perduodamas per įeinančius webhook'us, išeinančius HTTP ir sub-workflows. Pėdsakymas pagal numatytuosius nustatymus yra išjungtas ir konfigūruojamas naudojant `HEYM_OTEL_*` [aplinkos kintamuosius](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md); aktyvi būsena rodoma [Settings](./user-settings.md) Stebėjimo skirtuke.

Taip pat žr. [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), ir [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Eksportuokite dabartinį workflow kaip JSON iš Redaktoriaus įrankių juostos (Atsisiųsti mygtukas); failas apima mazgus ir briaunas. Importuokite vilkdami JSON failą į [Workflows](../tabs/workflows-tab.md) skirtuką (sukuria naują workflow) arba į drobę (pakeičia arba sujungia). JSON turi apimti mazgų masyvą; pavadinimas ir briaunos yra neprivalomos. Naudokite tai atsarginei kopijai, dalijimuisi ar migravimui tarp instancijų.

Taip pat žr. [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md), ir [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portalas atskleidžia workflows kaip viešas chat UI adresu `/chat/{slug}`. Konfigūruokite portal_enabled, slug, neprivalomą autentifikaciją (portal vartotojai), transliaciją ir failų įkėlimą kiekvienam workflow. Galutiniai vartotojai bendrauja per chat sąsają, nesiregistruodami į Heym; vaizdo išvestys gali būti rodomos chat'e. Portal workflows taip pat gali perduoti [Human-in-the-Loop](./human-in-the-loop.md) peržiūros puslapiams, kai [Agent Node](../nodes/agent-node.md) reikalauja patvirtinimo, tuo tarpu agento `review` šaka siunčia pranešimus į kitas kanalus. Naudokite tai vidiniams įrankiams, klientams skirtoms chatbot'ams ir AI valdomiems formoms.

Taip pat žr. [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md), ir [Drive](./drive.md).

### [File Generation](./file-generation.md)

Įgūdžiai gali generuoti failus, tokius kaip PDF, DOCX, CSV, JSON ir vaizdus vykdymo metu, rašydami į `_OUTPUT_DIR` darbo erdvę. Heym automatiškai užfiksuoja tuos failus, saugo juos ir atskleidžia atsisiuntimo metaduomenis po `_generated_files`, kurie vėliau gali būti valdomi naudojant [Drive node](../nodes/drive-node.md) arba peržiūrimi [Drive](../tabs/drive-tab.md) skirtuke.

Taip pat žr. [Agent Node](../nodes/agent-node.md), [Drive](./drive.md), ir [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive yra bendras saugojimo ir dalijimosi sluoksnis failams, kuriuos generuoja įgūdžiai. Jis leidžia naršyti failus, kurti viešus arba slaptažodžiu apsaugotus nuorodas, taikyti galiojimo ir atsisiuntimo apribojimus, dalintis failais tik skaitymui su savo komandomis ir valdyti tuos failus programiškai naudojant [Drive node](../nodes/drive-node.md) arba rankiniu būdu iš [Drive](../tabs/drive-tab.md) skirtuko.

Taip pat žr. [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md), ir [Portal](./portal.md).
### [Saugumas](./security.md)

Heym taiko slaptažodžių politiką (ilgis, didžiosios, mažosios raidės, skaičius), saugo prieigos žetonus HttpOnly slapukuose ir atnaujina atnaujinimo žetonus jų naudojimo metu. Greičio ribojimas taikomas prisijungimui, registracijai ir [Portal](./portal.md) prisijungimui. [Kredencialai](./credentials.md) yra šifruojami ramybėje naudojant AES-256 (Fernet). [MCP](../tabs/mcp-tab.md) API raktas naudojamas kliento autentifikacijai; turinio saugumas yra prieinamas per [Guardrails](./guardrails.md) [LLM](../nodes/llm-node.md) ir [Agent Node](../nodes/agent-node.md) mazguose. [Vykdymo žetonai](./execution-tokens.md) suteikia kiekvienam workflow ribotus JWT išorės skambintojams.

Taip pat žr. [Vykdymo žetonai](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) ir [Kredencialai](./credentials.md).

### [Vieningo prisijungimo sistema](./sso.md)

Heym autentifikuoja žmones prieš bet kurį išorinį OpenID Connect tiekėją - Keycloak, Okta, Entra ID, Auth0, Google - sukonfigūruotą vykdymo metu iš **Nustatymai → SSO** pagal instancijos administratorių, nurodytą `HEYM_ADMIN_EMAILS`. Įvedamas tik leidėjo URL ir kliento kredencialai; kiekvienas endpointas gaunamas iš tiekėjo atradimo dokumento, todėl joks tiekėjas nėra užkoduotas. Prisijungimas naudoja autorizacijos kodą su PKCE, o ID žetonas yra tikrinamas pagal tiekėjo paskelbtus raktus. Paskyros yra susiejamos pagal `(issuer, subject)` pirmiausia ir patvirtintą el. paštą antra, su pasirinktinai automatiškai teikiamomis paslaugomis, ribotomis iki el. pašto domeno leidimų sąrašo. Slaptažodžio prisijungimas lieka prieinamas kartu su SSO ir gali būti išjungtas, kai prisijungimo testas praeina, o `HEYM_ADMIN_EMAILS` paskyros yra išimtos, kad neteisingai sukonfigūruotas tiekėjas negalėtų užrakinti instancijos.

Taip pat žr. [Nustatymai](./user-settings.md), [Saugumas](./security.md) ir [Audito žurnalas](./audit.md).

### [Krovinių paskirstymas](./cluster.md)

Nukreipkite antrą Heym instanciją į tą pačią duomenų bazę ir ji prisijungs kaip darbuotojas. Fono vykdymai - cron, webhookai, MCP įrankių skambučiai, chat triggeriai - yra dalijami tarp instancijų pagal procentą, kurį nustato instancijos administratorius skiltyje **Nustatymai → Instancijos**, su kiekvienos instancijos būsena, duomenų bazės vėlavimu ir versija vienoje lentelėje. Instancijos niekada nekalba tarpusavyje: Postgres vykdo darbą, todėl darbuotojui nereikia atviro prievado ir jokio kelio atgal į pagrindinę instanciją. Darbas, kuris liečia vietinius failus, kodavimo agento darbo erdvę ar įdiegtą papildinį, visada vykdomas pagrindinėje instancijoje, o panelė rodo, kiek iš paskutinių 24 valandų tai buvo, kad operatorius galėtų matyti, kada procentai negali padėti. Kiekvienas vykdymas istorijoje nurodo instanciją, kuri jį vykdė, o abu istorijos dialogai gali filtruoti pagal tai.

Taip pat žr. [Nustatymai](./user-settings.md), [Vykdymai](../tabs/traces-tab.md) ir [Analitika](../tabs/analytics-tab.md).

### [Trečiųjų šalių integracijos](./integrations.md)

Heym jungiasi prie išorinių paslaugų per kredencialus, saugomus [Kredencialų](../tabs/credentials-tab.md) skiltyje (šifruojami ramybėje). Palaikomi tipai apima OpenAI, Google, sprendimų modelį [Sprendimų mazge](../nodes/decision-node.md), modelių maršrutizatorių automatinio modelio pasirinkimui (žr. žemiau), GitHub [GitHub mazge](../nodes/github-node.md) ir MCP integracijas, Jira [Jira mazge](../nodes/jira-node.md), Notion [Notion mazge](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP [Siųsti el. laišką](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header ir FlareSolverr [Crawler](../nodes/crawler-node.md). Kiekvienas tipas dokumentuoja reikalaujamus laukus; kredencialai gali būti dalijami su vartotojais arba [komandomis](./teams.md) ir nurodomi pagal pavadinimą mazguose arba kaip `$credentials.Name` išraiškose.

### Modelių maršrutizatorius (Auto Model)

**Modelių maršrutizatoriaus** kredencialas pasirenka modelį pagal užklausą, o ne laiko raktą. Jis saugo sprendimų modelio kredencialą ir jūsų esamų OpenAI/Google/Custom kredencialų sąrašą, kiekvienas su kriterijais, kada jis turėtų būti naudojamas, ir pasirodo kiekviename modelių pasirinkimo lange su vienu modeliu, pavadintu **Auto**.

Vykdymai, drobės vykdymo žurnalas ir span peržiūra rodo abi pasirinkimo puses, pavyzdžiui, `Auto Model / GPT-5`, o kaina lieka priskirta modeliui, kuris buvo vykdomas. Auto Model negali būti derinamas su Responses API, Batch režimu ar vaizdo išvestimi. Žr. [Kredencialai](./credentials.md) dėl viso elgesio.

Taip pat žr. [Kredencialai](./credentials.md), [Kredencialų dalijimasis](./credentials-sharing.md) ir [Komandos](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blokuoja nesaugias ar nepageidaujamas vartotojų žinutes prieš jas pasiekiant [LLM](../nodes/llm-node.md) ar [Agent Node](../nodes/agent-node.md). Įjunkite juos kiekvienam mazgui ir pasirinkite kategorijas, kurias norite blokuoti (pvz., smurtas, neapykantos kalba, seksualinis turinys, savižudybė, priekabiavimas, neteisėta veikla). Nustatykite jautrumą (žemas, vidutinis, aukštas). Kai jie aktyvuojami, mazgas išmeta klaidą, kurią galite sugauti su [Klaidos tvarkytuvu](../nodes/error-handler-node.md). Aptikimas naudoja tiekėjo moderavimo API arba LLM klasifikaciją, priklausomai nuo kredencialų tipo.

Taip pat žr. [Saugumas](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) ir [Klaidos tvarkytuvas](../nodes/error-handler-node.md).
### [Įmonė](./enterprise.md)

Įmonė apima komercinį licencijavimą, profesionalią paramą ir diegimo paslaugas komandoms, naudojančioms Heym gamyboje. Tai apima workflow architektūros pagalbą, įvedimą, Kubernetes ir mastelio didinimo gaires, prioritetinę paramą bei individualų vystymąsi aplink pažangias funkcijas, tokias kaip [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) ir [Portal](./portal.md).

Taip pat žr. [Vykdymas ir diegimas](../getting-started/running-and-deployment.md), [Saugumas](./security.md) ir [Komandos](./teams.md).

### [Heym Work](./heym-work.md)

„Heym Work“ yra antroji sąsaja verslo komandoms, sukurta ant „Heym“ pagrindo. Žmonės apibūdina darbą, atsako į kelis klausimus ir gauna išbandytą workflow, o tada dirba naudodami puslapius, patvirtinimus ir veiklos sąrašą, kuriame kiekvienas vykdymas turi pavadinimą. Egzemplioriaus administratoriai jį prijungia skiltyje **Nustatymai → Heym Work**, nurodydami jo adresą ir integracijos raktą; jis turi atskirą „Heym“ komandos licenciją.

Taip pat žr. [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) ir [Human-in-the-Loop](./human-in-the-loop.md).

---

## Valdymo skydelio skirtukai

### [Workflows](../tabs/workflows-tab.md)

Workflows skirtas yra numatytoji valdymo skydelio peržiūra. Jame rodomas dviejų panelių sąrašas: workflows ir aplankai kaip tankūs eilutės kairėje, ir pasirinkto workflow peržiūra dešinėje su jo trigger, paskutiniu vykdymu ir žingsniais, taip pat Open Workflow ir Run Now. Kiekviena eilutė turi statuso žetoną (Vykdomas, Planuojamas, Klausantis, Sustabdytas, API, SubWorker, Portal, Rankinis, Pašalinti suplanuotą), pagal kurį galima filtruoti Status dropdown. Workflow, neturintis trigger mazgo, žymimas pagal tai, kaip prasidėjo jo naujausias vykdymas - API už HTTP skambutį, SubWorker už tėvinį workflow, Portal už viešąjį chat - ir lieka Rankinis, kol nebus vykdomas. Aplankai ir poaplankiai tvarko [organizavimą](./workflow-organization.md). Sukurkite workflows su New Workflow, vilkite ir mesti JSON, kad [importuotumėte](./download-import.md), ir redaguokite arba pašalinkite iš eilutės veiksmų. Workflows gali būti perkeliami tarp aplankų; ištrynimas suplanuojamas (šiukšlių) prieš nuolatinį pašalinimą.

Taip pat žr. [Workflow organizavimas](./workflow-organization.md), [Atsisiųsti ir importuoti](./download-import.md) ir [Greitasis stalčius](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Žiūrėti Workflows demonstraciją</a></p>

### [Lenta](../tabs/board-tab.md)

Agentinė kanban lenta, kur kortelės yra nuolatiniai darbai. Sukonfigūruokite kiekvieną stulpelį su užsakytu workflow grandine; kortelės perkėlimas į stulpelį vykdo grandinę su kortelės pilnu kontekstu (turinys, komentarai, istorija, ankstesni rezultatai). Rezultatai grąžinami atgal į kortelę — žalia sėkmei, raudona nesėkmei, gintarinė vykdymo metu. Sekančios raundai pakartoja dabartinio stulpelio grandinę su viskuo, kas buvo sukaupta iki šiol, kas leidžia iteratyvų planavimą. Vykdymai registruojami [Vykdymo istorijoje](./execution-history.md) su `board` trigger šaltiniu. Kol kortelės vykdymas yra aktyvus, **Atidaryti gyvai** atidaro tą tikslų vykdymą animuotame drobėje su palaipsniui Debug žurnalais.

Taip pat žr. [Workflows](../tabs/workflows-tab.md), [Vykdymo istorija](./execution-history.md) ir [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Žiūrėti Lentos demonstraciją</a></p>
-->

### [Šablonai](../tabs/templates-tab.md)

Šablonų skirtas leidžia išsaugoti ir pakartotinai naudoti workflow šablonus (pilnus workflows) ir mazgo šablonus (vieną sukonfigūruotą mazgą). Sukurkite workflow šablonus iš redaktoriaus (Dalintis kaip šablonu) ir mazgo šablonus dešiniuoju pelės mygtuku spustelėdami mazgą. Naršykite pagal matomumą (Visiems arba Specifiniams vartotojams/[komandoms](./teams.md)), taikykite šabloną, kad sukurtumėte naują workflow arba pridėtumėte mazgą prie drobės, ir valdykite savo bendrinamus šablonus.

Taip pat žr. [Workflows](../tabs/workflows-tab.md), [Komandos](./teams.md) ir [Drobės funkcijos](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Žiūrėti Šablonų demonstraciją</a></p>

### [Kintamieji](../tabs/global-variables-tab.md)

Kintamųjų skirtas valdo [Global Variable Store](./global-variables.md). Kurkite, redaguokite ir šalinkite globalius kintamuosius; nustatykite pavadinimą, vertę ir vertės tipą (Auto, String, Number, Boolean, Array, Object). Kintamieji yra vartotojo apimties ir išlieka tarp vykdymų. Juos galima nurodyti bet kurioje workflow [išraiškoje](./expression-dsl.md) kaip `$global.variableName`. Kintamieji gali būti bendrinami su kitais vartotojais arba [komandomis](./teams.md).

Taip pat žr. [Globalūs kintamieji](./global-variables.md), [Kintamasis](../nodes/variable-node.md) ir [Išraiškų DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Žiūrėti Kintamųjų demonstraciją</a></p>
### [Chat](../tabs/chat-tab.md)

Chat skirtas Heym ilgalaikiams agentams, leidžiantiems valdyti darbo erdvę per pokalbį. Pasirinkite [kredencialą](./credentials.md) ir modelį, tada paprašykite Chat atsakyti į klausimus, apžiūrėti workflow apibrėžimus, vykdyti esamus workflow, apibendrinti vykdymus ir tvarkaraščius, pranešti apie vieno workflow vykdymo istoriją (vykdymo skaičius, statuso pasiskirstymas, paskutinis vykdymas ir vieno vykdymo detalės pagal užklausą), pranešti, kurie vykdymai šiuo metu vyksta (su praėjusiu laiku, dabartiniu mazgu ir nuoroda į kiekvieną gyvą vykdymą), išspręsti laukiančius žmogaus atsiliepimus, kurti ir keisti workflow naudojant tą patį AI Builder variklį, kuris naudojamas redaktoriuje, arba pridėti korteles prie kanban lentų natūralia kalba. Naujos kortelės visada prasideda pasirinktos lentos pirmame stulpelyje; kai yra kelios lentos ir nė viena nebuvo pavadinta, Chat pateikia lentos pasirinkimą prieš kuriant kortelę.

Chat veikia fone net ir uždarius naršyklę. Kol atsakymas transliuojamas, galite siųsti daugiau žinučių; Heym jas saugo duomenų bazės pagrindu veikiančioje eilėje, leidžia redaguoti arba ištrinti laukiančias žinutes prieš jas pradėdami, ir vykdo jas tvarkingai, kai dabartinis atsakymas baigiasi. Jei asistentui reikia planavimo detalių ir jis grąžina paaiškinimo klausimus, eilė sustoja, kol atsakysite į tuos klausimus, tada tęsiasi po planavimo atsakymo.

Atsakymai transliuojami su markdown, įterptomis nuotraukomis, workflow peržiūros kortelėmis, sulankstomomis įrankių skambinimo kortelėmis, konteksto naudojimu ir automatinio konteksto suspaudimu. Chat palaiko priedus, balso įvestį, skaitymo atkūrimą, kopijavimo veiksmus, greitus promptus, Vartotojo taisykles iš [Nustatymų](./user-settings.md) ir [globalius kintamuosius](./global-variables.md) kaip kontekstą.

Taip pat žr. [AI Assistant](./ai-assistant.md), [Kredencialai](./credentials.md) ir [Nustatymai](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Žiūrėti Chat demonstraciją</a></p>

### [Kredencialai](../tabs/credentials-tab.md)

Kredencialų skirtukas valdo API raktus ir slaptažodžius, naudojamus mazguose. Pridėkite kredencialus pagal tipą (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere ir kt.), pavadinkite juos ir nurodykite juos workflow mazguose. Redaguokite arba ištrinkite iš kortelės; dalinkitės su vartotojais el. paštu arba su [komandomis](./teams.md). Visi vertės yra šifruojamos ramybėje ir maskuojamos UI.

Taip pat žr. [Kredencialai](./credentials.md), [Kredencialų dalijimasis](./credentials-sharing.md) ir [Trečiųjų šalių integracijos](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Žiūrėti Kredencialų demonstraciją</a></p>

### [Vektorių saugyklos](../tabs/vectorstores-tab.md)

Vektorių saugyklų skirtukas valdo vektorių saugyklas, naudojamas [RAG](../nodes/rag-node.md) mazguose. Sukurkite saugyklą su pavadinimu ir vektorių saugyklos [kredencialu](./credentials.md) — *RAG: Qdrant + OpenAI* (išorinis Qdrant) arba *RAG: Psql + OpenAI* (Heym nuosavas Postgres per pgvector), kuris nustato saugyklos backend'ą — pasirenkamai nustatykite kolekcijos pavadinimą, tada įkelkite dokumentus (PDF, TXT ir kt.). Valdykite turinį (peržiūrėti, ištrinti šaltinius), redaguokite saugyklos detales ir dalinkitės saugyklomis su vartotojais. [RAG](../nodes/rag-node.md) mazge pasirinkite Duomenų bazę, pasirinkite vektorių saugyklą ir vykdykite įterpimo, atnaujinimo, ištrynimo ar paieškos operacijas.

Taip pat žr. [Qdrant RAG](../nodes/rag-node.md), [Kredencialai](./credentials.md) ir [Komandos](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Žiūrėti Vektorių saugyklų demonstraciją</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP skirtukas konfigūruoja Model Context Protocol integraciją. Heym palaiko du režimus:

**Numatytasis serveris** – Vienas endpointas adresu `/api/mcp/sse` atskleidžia visus MCP palaikomus Workflow. Peržiūrėkite ir regeneruokite savo API raktą, kopijuokite paruoštą naudoti klientų JSON, prijunkite Cursor vienu paspaudimu arba sekite Claude nustatymo srautą su automatinėmis OAuth registracijomis.

**Pavadinti serveriai** – Sukurkite kelis izoliuotus MCP endpointus, kiekvienas su savo UUID pagrindu sukurta URL (`/api/mcp/servers/{uuid}/sse`) ir nepriklausomu API raktu. Priskirkite specifinius Workflow kiekvienam serveriui, kad skirtingi AI klientai ar komandos matytų tik jiems reikalingus įrankius. Kiekvienas pavadintas serveris palaiko tas pačias autentifikavimo metodikas (API raktas, Claude OAuth) ir turi savo Copy JSON bei Add to Cursor sparčiuosius klavišus. Abu endpointai palaiko SSE transportą (GET) ir Streamable HTTP transportą (POST). Perjungiant Workflow pavadintame serveryje, jis perkeltas į pradinę priskirtos sąrašo vietą, kad pakeista eilutė išliktų matoma.

**Heym chat įrankis** – Bet kuris režimas taip pat gali atskleisti [Chat](../tabs/chat-tab.md) variklį kaip vieną `heym_chat` įrankį, perjungiamą pagal paviršių su savo LLM kredencialu ir modeliu (išankstiniu užpildymu iš Jūsų pageidaujamo modelio [Nustatymuose](./user-settings.md)). MCP klientas siunčia vieną natūralios kalbos `message`, o variklis atlieka likusius veiksmus: Workflow kūrimas konstravimo režimu (išsaugojimas, bandomasis vykdymas iki penkių kartų, taisymas ir patikrinimas), Workflow vykdymas, analizė, vykdymai, tiesioginio vykdymo būsena, tvarkaraščiai, lentos ir kortelės, komandos, globalūs kintamieji, dokumentacijos paieška ir sprendimai su žmogaus įsikišimu. Vėliau pridėtos galimybės Chat pasiekiamos per tą patį įrankį be papildomos registracijos. Kiekvienas skambutis saugomas Chat skirtuko istorijoje kaip žymėta pokalbio dalis ir grąžina `conversation_id`, kurį klientas gali perduoti, kad tęstų temą.

Taip pat žr. [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) ir [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Žiūrėti MCP demonstraciją</a></p>

### [Traces](../tabs/traces-tab.md)

Traces skirtukas rodo [LLM](../nodes/llm-node.md) vykdymo pėdsakus. Virš sąrašo esantis statistikos antraštė apibendrina pasirinktą laiko intervalą su KPI kortelėmis (Skambučiai, Tokenai, Kaina, Vidutinė latencija, Klaidos %) ir trimis diagramomis — Tokenai pagal modelį, Kaina pagal modelį ir Skambučiai per laiką (sukrauti sėkmingi vs klaidos). Vienas **Laiko intervalas** pasirinkiklis (1h / 24h / 7d / 30d / Visi; numatytasis 7 dienos) filtruoja tiek diagramas, tiek sąrašą kartu. Kaina apskaičiuojama pagal per vartotoją [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table); modeliai, neturintys kainos, rodomi kaip įspėjimas, kuris nuorodoja į jį. Atidarykite bet kurį pėdsaką, kad pamatytumėte užklausos ir atsakymo payloadus, laiką (llm_ms, tools_ms, mcp_list_ms), įrankių skambučius (pavadinimas, argumentai, rezultatas) ir įtrauktas įgūdžius. Išplėsti įvykiai rodo JSON — įskaitant MCP ir JSON-RPC payloadus — kaip suskleidžiamą medį, kurio pirmas lygis atidarytas pagal numatytuosius nustatymus; **Medis / Žaliava** grąžina prie originalaus teksto, o netinkamas JSON išlieka skaitomas. Naudokite pėdsakus, kad išspręstumėte [Agent Node](../nodes/agent-node.md) ir [LLM](../nodes/llm-node.md) elgseną bei kopijuotumėte ar eksportuotumėte payloadus.

Taip pat žr. [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) ir [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Žiūrėti Traces demonstraciją</a></p>
### [Įspėjimai](../tabs/alerts-tab.md)

Įspėjimų skirtukas apibrėžia slenkstines sąlygas per laiko intervalą ir praneša, kai jos yra viršijamos. Keturių tipų įspėjimai apima klausimus, kuriuos operatoriai iš tikrųjų užduoda: **klaidos slenkstis** (ar šis procesas nepavyko daugiau nei N kartų per intervalą), **workflow trukmė** (ar vykdymai tapo lėtesni, matuojama kaip maksimali, vidutinė arba p95), **token / USD kaina** (ar išlaidos viršijo biudžetą, nustatytą per tą pačią kainų lentelę kaip [Vykdymai](../tabs/traces-tab.md)), ir **vykdymo skaičius** (ar šis vykdymas įvyko daug dažniau nei turėtų). Kiekvienas tipas vertinamas per pasirinktą intervalą, niekada ne pagal vieną įvykį, nes vienas nepavykęs vykdymas yra triukšmas, o sprogimas yra incidentas. Įspėjimai stebi vieną workflow arba visus workflow, kuriuos galite pasiekti.

Penkių žingsnių vedlys praeina per tipą, apimtį, sąlygą, atsaką ir peržiūrą. Peržiūros žingsnis **atgaline data** patikrina sąlygą pirmiausia, pranešdamas, kaip dažnai ji būtų įsijungusi per pastarąsias 24 valandas iki 7 dienų, todėl slenkstis, kuris yra per žemas, yra pastebimas prieš jį išsaugant, o ne po to, kai jis praneša kam nors. Apibūdinkite, ko norite, paprasta kalba, ir AI užpildys kiekvieną žingsnį, pažymėdamas savo spėjimus; dalinis užklausimas vis tiek judina vedlį į priekį, atidarant pirmą žingsnį, kuriam vis dar reikia sprendimo, o ne priversdamas jus pradėti iš naujo. Pagal numatytuosius nustatymus įspėjimas įsijungia vieną kartą ir tyliai laukia, kol metrika atsigaus; galite pasirinkti, kad jis kartotųsi tam tikru intervalu.

Atsako žingsnyje įspėjimas gali sukurti ir priskirti naują workflow, kuris bus vykdomas, kai jis įsijungs, naudoti jau turimą arba nieko nedaryti. Įsijungimo payload neša stebimą vertę, slenkstį, intervalą ir workflow, kurie prisidėjo prie skaičiaus, o tai yra būdas, kaip įspėjimai pasiekia Slack, el. paštą ar Telegram, naudojant jau turimus mazgus. Įsijungimo istorija fiksuoja, kas buvo tiesa kiekvieno įspėjimo įsijungimo metu ir yra saugoma 90 dienų; pripažinimas, kad įspėjimas įsijungė, keičia ženklelį iš Įsijungęs į Pripažintas, nesukuriant iliuzijos, kad sąlyga buvo išspręsta. [Chat](../tabs/chat-tab.md) skirtukas gali atsakyti, kokie įspėjimai egzistuoja ir kodėl ar kada vienas buvo įjungtas. Įspėjimai gali būti dalijami su vartotojais ir [komandomis](../tabs/teams-tab.md).

Taip pat žr. [Analitika](../tabs/analytics-tab.md), [Vykdymai](../tabs/traces-tab.md) ir [Vykdymo istorija](./execution-history.md).

### [Analitika](../tabs/analytics-tab.md)

Analikos skirtukas rodo vykdymo metrikas ir tendencijas. Santraukos statistika apima bendrą vykdymų skaičių, sėkmės rodiklį, klaidų rodiklį, latencijos išskaidymus ir bendrą **Išsaugotą laiką** (kiekvieno workflow įvertintų išsaugotų minučių suma per vykdymą × sėkmingi vykdymai). Dažniausiai naudojami rodo tą pačią sumą kiekvienam workflow. Pasirinkite pagrindinį laiko intervalą (24 val., 7 d., 30 d. arba visi), pasirinktinai filtruokite pagal workflow, tada vilkite per bet kurį grafiką, kad išnagrinėtumėte pasirinktą datų intervalą. Grafikai ir workflow lentelės atnaujinamos pagal pasirinkimą, o automatinis atnaujinimas palaiko metrikas atnaujintas. Tai papildo [Vykdymo istoriją](./execution-history.md) ir [Tvarkaraščius](../tabs/scheduled-tab.md), kai reikia tiek praeities rezultatų, tiek artėjančių vykdymų.

Taip pat žr. [Vykdymo istorija](./execution-history.md), [Tvarkaraščiai](../tabs/scheduled-tab.md) ir [Vertinimai](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Žiūrėti Analikos demonstraciją</a></p>

### [Pultas](../tabs/dashboard-tab.md)

Pulto skirtukas yra Grafana stiliaus erdvė, kurioje galite kurti grafikų widget'ų tinklus, kiekvienas iš jų generuojamas iš savo paslėpto Heym workflow. Išlaikykite tiek pultų, kiek reikia, ir dalinkitės kiekvienu su vartotojais ar komandomis, skaitymo režimu arba redaguojamu; widget'ai visada veikia su savininko kredencialais, todėl visi mato tuos pačius duomenis. Apibūdinkite metriką paprasta kalba, ir AI sugeneruos widget'ą, arba pridėkite vieną rankiniu būdu ir pasirinkite grafikų tipą, peržiūrėtą su pavyzdiniais duomenimis: juostinis, linijinis, plotas, pyragas, lentelė, skaitmeninis, matuoklis, sklaidos, proporcijų, juostinis matuoklis, tekstas arba HITL. HITL yra karuselė jūsų laukiančių žmogaus peržiūrų. Antraštėje rodomas `1/n laukia`. Workflow pavadinimas atidaro tą vykdymą drobėje. **Patvirtinti**, **Prašyti pakeitimų** ir **Atmesti** išsprendžia tai, o istorijos piktograma šalia widget'o pavadinimo atidaro tą vykdymą istorijos dialoge toje pačioje pusėje. Widget'ai talpina savo rezultatus, gali būti tikslinami su AI (kiekvienas pakeitimas išsaugomas [Redagavimo istorijoje](./edit-history.md)), klonuojami kartu su savo pilnu workflow, pertvarkomi su Tidy up ir vilkami arba keičiasi dydžiu redagavimo režime. Lentelės gali rodyti būsenos žymas ir susieti savo eilutes su išsamia informacine suvestine, kuri nuskaito spustelėtos eilutės įrašą kaip `$page.record`, o „Run“ valdiklis paleidžia workflow iš informacinės suvestinės: su nuvilktu failu, su įvesties laukais arba mygtuku Vykdyti. Kadangi kiekvienas widget'as yra workflow, bet kokie duomenys, kuriuos galite gauti — [HTTP](../nodes/http-node.md) užklausa, [BigQuery](../nodes/bigquery-node.md) užklausa, [RAG](../nodes/rag-node.md) paieška arba [LLM](../nodes/llm-node.md) išvestis — gali tapti grafiku. HITL valdiklio nustatymai gali apriboti jį vieno workflow peržiūromis arba agento ar Slack patvirtinimo žingsniu jame; toks valdiklis rodo juos visiems, kurie gali atidaryti tą workflow, ir yra paslėptas nuo visų, kurie negali.

Taip pat žr. [Grafiko išvesties mazgas](../nodes/chart-output-node.md), [Analitika](../tabs/analytics-tab.md) ir [Vykdymo istorija](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Žiūrėti Pulto demonstraciją</a></p>
### [Vertinimai](../tabs/evals-tab.md)

Vertinimų skirtukas (adresu `/evals`) leidžia Jums kurti vertinimo rinkinius, pridėti arba generuoti testų atvejus, optimizuoti rinkinio prompt'ą ir vykdyti vertinimus prieš [Agent Node](../nodes/agent-node.md) workflows. Pasirinkite vieną ar kelis modelius, pasirinkite vertinimo metodą (Tiksli atitiktis, Turinio atitiktis arba LLM-as-Judge), pasirinktinai leiskite atskiram modeliui arba [Decision Model](../nodes/decision-node.md) vertinti LLM-as-Judge atsakymus, nustatykite vykdymus per testą (plius temperatūrą ir mąstymo pastangas Tiksliam atitikimui ir Turinio atitikimui), tada palyginkite praeitį/nepavyko ir kiekvieno modelio išvestis. Peržiūrėkite vykdymo istoriją už praėjusius vertinimus, įskaitant kiekvieno vykdymo naudotą vertintoją, pakartotinai vykdykite vieną su tuo pačiu vertintoju, eksportuokite jį kaip JSON ir patikrinkite pagrindinį elgesį [Traces](../tabs/traces-tab.md).

Taip pat žr. [Agent Node](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md) ir [Vykdymo istorija](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Žiūrėti Vertinimų demonstraciją</a></p>

### [Komandos](../tabs/teams-tab.md)

Komandų skirtukas leidžia Jums kurti ir valdyti komandas. Sukurkite komandą, pridėkite narius pagal el. paštą ir pašalinkite narius (kūrėjo pašalinti negalima). Dalinkitės [workflows](../tabs/workflows-tab.md), [šablonais](../tabs/templates-tab.md), [kredencialais](../tabs/credentials-tab.md), [kintamaisiais](../tabs/global-variables-tab.md), [vektorių saugyklomis](../tabs/vectorstores-tab.md) ir [Drive failais](../tabs/drive-tab.md) su komandomis iš atitinkamų dalijimosi dialogų; visi komandos nariai gauna prieigą. Redaguokite komandos pavadinimą ir aprašymą arba ištrinkite komandą (pašalina visus komandos dalijimus).

Taip pat žr. [Komandos](./teams.md), [Kredencialų dalijimas](./credentials-sharing.md) ir [Workflow organizavimas](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Žiūrėti Komandų demonstraciją</a></p>

### [Tvarkaraščiai](../tabs/scheduled-tab.md)

Tvarkaraščių skirtukas rodo visus aktyvius [Cron](../nodes/cron-node.md) workflows vizualiniame kalendoriuje. Perjunkite tarp dienos, savaitės ir mėnesio vaizdų, kad pamatytumėte, kada Jūsų automatizacijos yra suplanuotos vykdyti, tada grįžkite prie susijusio [workflow](../tabs/workflows-tab.md), kai reikia redaguoti tvarkaraštį.

Taip pat žr. [Cron](../nodes/cron-node.md), [Analitika](../tabs/analytics-tab.md) ir [Vykdymo istorija](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Žiūrėti Tvarkaraščių demonstraciją</a></p>

### [Žurnalai](../tabs/logs-tab.md)

Žurnalų skirtukas rodo Docker konteinerių žurnalus Heym stack'ui (backend, frontend, PostgreSQL). Pasirinkite konteinerius, filtruokite pagal žurnalo lygį (Visi, INFO, WARNING, ERROR, DEBUG) ir ieškokite žurnaluose. Naudokite tai derinimui ir problemų sprendimui. Workflow vykdymo žurnalams (mazgų rezultatai, išvestys) naudokite [Vykdymo istoriją](./execution-history.md), [Traces](../tabs/traces-tab.md) arba derinimo skydelį redaktoriuje.

Taip pat žr. [Vykdymo istorija](./execution-history.md), [Traces](../tabs/traces-tab.md) ir [Drobės funkcijos](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Žiūrėti Žurnalų demonstraciją</a></p>

### [Duomenų lentelė](../tabs/datatable-tab.md)

Duomenų lentelės skirtukas leidžia Jums kurti ir valdyti struktūrizuotas duomenų lenteles Heym. Nustatykite tipizuotus stulpelius (string, number, boolean, date, JSON), valdykite eiles su tiesioginiu dvigubu paspaudimu, importuokite/eksportuokite CSV ir dalinkitės lentelėmis su vartotojais arba [komandomis](./teams.md) su skaitymo/rašymo teisėmis. Naudokite [DataTable node](../nodes/datatable-node.md), kad programiškai pasiektumėte lenteles workflows. Prisegtas **Sistemos lentelių** skyrius viršuje talpina **LLM kainų lentelę**: fiksuotos schemos peržiūra pagal modelių kainas, gautas iš Helicone fone (24 valandų TTL, rankinis atnaujinimas), kur kiekvienas vartotojas gali pakeisti kainas arba pridėti pasirinktines eiles modeliams, kurių Helicone nenurodo. Šios kainų taisyklės lemia kaštų KPI ir kiekvieno modelio kainų diagramą [Traces](../tabs/traces-tab.md) skirtuke.

Taip pat žr. [DataTable node](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Workflow struktūra](./workflow-structure.md) ir [Komandos](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Žiūrėti Duomenų lentelės demonstraciją</a></p>
### [Drive](../tabs/drive-tab.md)

Drive skirtukas rodo visus failus, kuriuos sugeneravo įgūdžiai per Jūsų workflows. Jame pateikiamas kiekvieno failo pavadinimas, tipas, dydis, šaltinio mazgas, sukūrimo data ir komandos bendrinimo būsena, taip pat yra paieškos, autentifikuoto atsisiuntimo, bendrinimo, trynimo ir puslapiavimo valdikliai. Tai yra informacijos suvestinė, skirta [File Generation](./file-generation.md), [Drive](./drive.md) nuorodai ir [Drive mazgui](../nodes/drive-node.md).

Taip pat žr. [Drive](./drive.md), [File Generation](./file-generation.md) ir [Drive mazgą](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Žiūrėti Drive demonstraciją</a></p>
