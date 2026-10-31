# Kompletná sada funkcií Heym

Komplexný prehľad všetkých možností Heym. Každá sekcia popisuje funkciu alebo koncept v niekoľkých vetách.

---

## Začíname

### [Úvod](../getting-started/introduction.md)

Heym je infraštruktúra na spúšťanie a správu AI agentov v produkcii. Agentické systémy vytvárate na vizuálnom plátne a spúšťate ich s istotou: orchestrácia agentov, automatizácia obchodných procesov, kontrola každého spustenia a zachovanie kontroly človeka na vašej vlastnej infraštruktúre. Podporuje vizuálne workflowy, AI uzly ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Assistant](./ai-assistant.md), integrácie ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), prichádzajúci [IMAP Trigger](../nodes/imap-trigger-node.md) e-mail, odchádzajúci [Send Email](../nodes/send-email-node.md)), plánovanie pomocou [Cron](../nodes/cron-node.md) a chat portály [Portal](./portal.md) pre koncových používateľov.

Pozrite si tiež [Core Concepts](../getting-started/core-concepts.md), [Node Types](./node-types.md) a [Third-Party Integrations](./integrations.md).

### [Prečo Heym](../getting-started/why-heym.md)

Prečo Heym prechádza životným cyklom agenta (tvorba, orchestrácia, spustenie, pozorovanie, hodnotenie, kontrola, sprístupnenie) a ukazuje, čo jedna self-hosted runtime zvládne v každej fáze. Zahŕňa to uzol [LLM](../nodes/llm-node.md) a [Agent Node](../nodes/agent-node.md) s volaním nástrojov, Python nástrojmi, [MCP](../tabs/mcp-tab.md) pripojeniami, zručnosťami a multi-agentnou orchestráciou; triggery, opakovania a [rozloženie záťaže](./cluster.md); [Traces](../tabs/traces-tab.md) s cenou v USD za spustenie a exportom OpenTelemetry; [Evals](../tabs/evals-tab.md); [kontrolné body ľudského posúdenia](./human-in-the-loop.md), guardrails, SSO a audit trail; a REST, MCP a Portal endpointy. Porovnanie možností s n8n, Zapier a Make.com uzatvára stránku.

Pozrite si tiež [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) a [Agent Architecture](./agent-architecture.md).

### [Rýchly štart](../getting-started/quick-start.md)

Spustite svoj prvý workflow za pár minút: vytvorte workflow na karte [Workflows](../tabs/workflows-tab.md), pridajte uzol [Input](../nodes/input-node.md), uzol [LLM](../nodes/llm-node.md) a uzol [Output](../nodes/output-node.md), potom ich prepojte. Nakonfigurujte [LLM](../nodes/llm-node.md) s prihlasovacími údajmi a nastavte `userMessage` na `$input.text`; použite Run alebo [AI Assistant](./ai-assistant.md) na spustenie alebo generovanie workflowov prirodzeným jazykom.

Prirodzene sa kombinuje s [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) a [Expression DSL](./expression-dsl.md).

### [Core Concepts](../getting-started/core-concepts.md)

Workflowy sú orientované grafy uzlov prepojených hranami; spustenie prechádza od trigger uzlov ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) cez spracovateľské uzly až po uzly [Output](../nodes/output-node.md). Každý uzol má typ, dáta (konfiguráciu) a vstupy/výstupy; hrany definujú tok dát. Uzly odkazujú na dáta predchádzajúcich uzlov pomocou výrazov [Expression DSL](./expression-dsl.md), ako napríklad `$nodeLabel.field`; nezávislé uzly sa spúšťajú automaticky [paralelne](./parallel-execution.md).

Pozrite si tiež [Triggers](./triggers.md), [Parallel Execution](./parallel-execution.md) a [Workflow Structure](./workflow-structure.md).

### [Spúšťanie a nasadenie](../getting-started/running-and-deployment.md)

Heym poskytuje `run.sh` pre lokálny vývoj (databáza v Docker, FastAPI backend, Vite frontend) a `deploy.sh` pre produkciu s Docker Compose. Oba používajú súbor `.env`; kľúčové premenné zahŕňajú `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` a `ALLOW_REGISTER`. Vývoj beží na konfigurovateľných portoch frontendu a backendu; produkcia obsluhuje API pod `/api` prostredníctvom kontajnera frontendu.

Pozrite si tiež [Security](./security.md), [Enterprise](./enterprise.md) a [Settings](./user-settings.md).

### [Migrácia do Heym](../getting-started/migrate-to-heym.md)

Nástroj AI Convert premení workflow z inej platformy (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) alebo popis v prirodzenom jazyku na workflow Heym, streamovaný naživo na plátno a pripravený na [stiahnutie a import](./download-import.md). Spustí AI bezpečnostnú kontrolu a potom vygeneruje DSL s nastavenými limitmi vstupu a rýchlosti. Otvorte ho na [heym.run/convert](https://heym.run/convert).

Pozrite si tiež [Quick Start](../getting-started/quick-start.md), [Download & Import](./download-import.md) a [AI Assistant](./ai-assistant.md).

---

## Uzly

### Triggers
#### [Vstupný uzol](../nodes/input-node.md)

Vstupný uzol je vstupným bodom pre workflowy, ktoré prijímajú dáta od používateľa alebo volajúceho API. Podporuje jedno alebo viac vstupných polí a sprístupňuje metadata požiadavky (hlavičky, query parametre). K poliam tela pristupujte cez `$nodeLabel.body.fieldKey`, k hlavičkám cez `$nodeLabel.headers` a k query cez `$nodeLabel.query`.

Prirodzene sa kombinuje s uzlami [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) a [Output](../nodes/output-node.md). Pre referencie na payload a prístup k poliam si pozrite [Expression DSL](./expression-dsl.md) a [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Uzol Cron spúšťa workflow podľa plánu pomocou štandardného päťpoľového cron výrazu. Nie je potrebný žiadny vstup od používateľa – workflow sa spustí automaticky v určených časoch (napr. každú hodinu, denne, každých 15 minút). Výstupom je trigger udalosť bez payloadu.

Pozrite si tiež [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) a [Execution History](./execution-history.md) pre plánované a oneskorené spustenia.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Uzol IMAP Trigger pravidelne kontroluje schránku v nastaviteľnom minútovom intervale a spúšťa workflow pre každý novozistený e-mail. Na výstupe poskytuje spracované hlavičky, zoznamy odosielateľov a príjemcov, telo v čistom texte a HTML, metadata príloh a časovú značku triggera. Využite ho na triage podporných schránok, smerovanie zo schránky do [Slack](../nodes/slack-node.md) alebo na schvaľovacie toky riadené e-mailom pomocou [Human-in-the-Loop](./human-in-the-loop.md).

Kombinuje sa s uzlami [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) a [Slack](../nodes/slack-node.md) pre workflowy prichádzajúceho triage a odpovedí.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Uzol Heym Trigger spúšťa workflow, keď samotný Heym publikuje platformovú udalosť: `heym.started`, `workflow.created`, `workflow.updated` alebo `workflow.deleted`. Doručenie je dávkované – každá udalosť publikovaná v rámci jedného päťsekundového dispatch okna dorazí v jedinom spustení ako `$nodeLabel.events`, vždy ako pole. Každá udalosť je nárokovaná prostredníctvom jedinečného databázového obmedzenia, takže sa spustí presne raz na odoberajúci uzol bez ohľadu na to, koľko workerov, kontajnerov alebo strojov beží. Využite ho na audit zmien workflowov, oznámenia o nasadení a prehľady o zdraví inštancie.

Kombinuje sa s uzlom [Heym](../nodes/heym-node.md) na vyhľadanie zmeneného workflowu a s uzlom [Loop](../nodes/loop-node.md) na vykonanie akcie raz za udalosť.

#### [Heym](../nodes/heym-node.md)

Uzol Heym číta vlastné dáta Heymu prostredníctvom troch operácií: `listWorkflows` vracia každý workflow, ku ktorému má vlastník prístup, s počtami uzlov a časovými značkami, `getWorkflow` vracia štruktúru uzlov a hrán jedného workflowu a `getExecutionHistory` vracia záznamy histórie spustení od najnovších s voliteľnými filtrami podľa stavu, časového okna a limitu, spolu s celkovými súčtami zoskupenými podľa stavu. Výsledky sú obmedzené na vlastníka workflowu, v ktorom sa uzol nachádza, takže spustenie iniciované cez cron, portál alebo udalosť vracia rovnaké dáta ako manuálne spustenie. `getWorkflow` vracia úplnú konfiguráciu uzlov, čo umožňuje auditovať workflow na pevne zakódované kľúče alebo tokeny; neodhaľuje nič, čo by vlastník workflowu už nemohol otvoriť v editore. Nevyžaduje sa žiadny prihlasovací údaj.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Uzol WebSocket Trigger otvára odchádzajúce klientske pripojenie k externému WebSocket serveru a spúšťa workflow pri `onMessage`, `onConnected` alebo `onClosed`. Sprístupňuje spracované payloady správ, stav opätovného pripojenia, metadata zatvorenia a URL socketu pre downstream výrazy.

Kombinuje sa s uzlami [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) a [SSE Streaming](./sse-streaming.md) pre realtime integrácie.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Uzol Telegram Trigger prijíma webhook aktualizácie bota a okamžite spúšťa workflow. Sprístupňuje úplný payload aktualizácie, primárny objekt správy, callback queries, sanitizované hlavičky a časovú značku triggera. Využite ho pre chatbotov, AI asistentov v [Telegram](../nodes/telegram-node.md) a toky riadené tlačidlami.

Kombinuje sa s uzlami [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) a [Webhooks](./webhooks.md) pre workflowy riadené botom.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Uzol Slack Trigger prijíma webhooky Slack Events API a po overení podpisu požiadavky automaticky spúšťa workflow. Sprístupňuje payload udalosti a sanitizované hlavičky pre downstream smerovanie, klasifikáciu pomocou [LLM](../nodes/llm-node.md) a toky odpovedí.

Kombinuje sa s uzlami [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) a [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Uzol Discord Trigger prijíma webhooky Discord Interactions API, overuje Ed25519 podpisy pomocou zvoleného prihlasovacieho údaja `discord_trigger` a spúšťa workflow. Sprístupňuje úplný payload interakcie, dáta príkazu, sanitizované hlavičky a metadata triggera pre downstream smerovanie alebo odpovede.

Kombinuje sa s uzlami [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) a [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

Uzol RabbitMQ odosiela alebo prijíma správy z frontov a výmen RabbitMQ. Použite ho pre workflowy riadené správami a spracovanie udalostí. Režim odosielania publikuje správu s voliteľným oneskorením; režim prijímania funguje ako [trigger](./triggers.md), takže workflow sa spustí pri príchode správy. Výstup obsahuje stav, message_id a telo.

V kombinácii s uzlami [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) a [Parallel Execution](./parallel-execution.md) slúži na spracovanie riadené udalosťami.

#### [Error Handler](../nodes/error-handler-node.md)

Uzol Error Handler sa spustí automaticky, keď zlyhá ktorýkoľvek uzol vo workflow. Nevyžaduje žiadne vstupné hrany; spúšťa ho engine. Výstup obsahuje chybovú správu, označenie zlyhaného uzla, typ uzla a časovú značku. Použite ho na odosielanie upozornení cez [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) alebo [Send Email](../nodes/send-email-node.md), na zaznamenávanie chýb alebo na vrátenie vlastných chybových odpovedí.

Ako alternatívu k spracovaniu chýb na plátne môže workflow delegovať zlyhania aj na samostatný workflow — pozrite si [Error Workflow](#error-workflow). Ak plátno už obsahuje uzol Error Handler, error workflow sa **nevolá** (lokálny handler má prednosť).

Bežnými cieľmi upozornení sú [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) a [Send Email](../nodes/send-email-node.md); podrobnosti o spusteniach sa pohodlnejšie skúmajú v [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

Uzol AI Agent je uzol [LLM](../nodes/llm-node.md) s volaním nástrojov. Dokáže spúšťať Python nástroje, volať pripojené uzly plátna ako nástroje, pripájať sa k serverom [MCP](../tabs/mcp-tab.md), používať zručnosti (inštrukčné súbory a voliteľné Python skripty), pôsobiť ako orchestrátor, ktorý deleguje na iné agent uzly, a volať iné workflowy ako nástroje. Výstup je dostupný ako `$nodeLabel.text`. Voliteľný prepínač **Extra Body** pripája JSON objekt s parametrami požiadavky špecifickými pre poskytovateľa ku každej požiadavke v slučke volania nástrojov; predvolene je vypnutý. Voliteľný prepínač **Use Responses API** smeruje volania modelu agenta cez Responses API, ktoré zachováva uvažovanie modelu naprieč volaniami nástrojov, takže reasoning model si udrží svoj reťazec myšlienok počas viackrokovej slučky; predvolene je vypnutý a funguje s OpenAI a vlastnými prihlasovacími údajmi.

Nástroje uzlov plátna umožňujú agentovi volať nakonfigurované uzly workflow priamo z plátna. Pripojte podporovaný uzol k handle nástrojov agenta a potom označte konkrétne polia ako poskytované agentom pomocou ikony robota. Tieto polia sa za behu stanú parametrami nástroja, zatiaľ čo prihlasovacie údaje a neoznačené polia zostávajú pevne dané v konfigurácii uzla.

Sekcia Skills teraz obsahuje **AI Build** na vytváranie nových zručností, inline akciu úpravy pomocou AI pre existujúce zručnosti, stiahnutie jednotlivých zručností ako ZIP a voliteľný prepínač **Enable Drive files** pre zručnosti, ktoré potrebujú za behu čítať súbory z Heym Drive. Modálne okno Skill Builder streamuje chat konverzáciu na ľavej strane, prijíma súbory pomocou drag-and-drop s každým komentárom k doladeniu, zobrazuje živý náhľad iba na čítanie vygenerovaných súborov `SKILL.md` a `.py` na pravej strane, umožňuje stiahnuť tento náhľad ako ZIP a ukladá nahrané súbory na doladenie späť ako priložené aktíva zručnosti prostredníctvom rovnakého toku spracovania ZIP, aký sa používa pri manuálnych nahrávaniach.

S povolenou funkciou **[Agent Persistent Memory](./agent-persistent-memory.md)** si každý agent uzol udržiava vlastný znalostný graf: fakty sa načítajú do systémového promptu, keď nie sú prázdne, a úspešné spustenia spustia na pozadí zlúčenie nových entít a vzťahov. Sub-agenti používajú samostatné grafy. Graf agenta môžete **zdieľať** s inými agentmi (v tom istom alebo inom workflow) s prístupom iba na čítanie alebo na čítanie a zápis z dialógového okna grafu. Ovládací prvok mozgu na plátne otvára editor grafu.

Agent uzly môžu tiež vstúpiť do režimu [Human-in-the-Loop](./human-in-the-loop.md). V tomto režime agent získa nástroj `request_human_review` a môže sa pozastaviť na konkrétnych krokoch vyžadujúcich schválenie, vytvoriť jednorazový verejný odkaz na kontrolu, sprístupniť vetvu plátna `review` pre toky upozornení a čakať, kým recenzent prijme, upraví alebo odmietne text kontroly v Markdown. Pole HITL uzla slúži ako usmernenia na schválenie, kedy sa má požiadať, zatiaľ čo súhrn pre recenzenta sa generuje z každej žiadosti o kontrolu. Pre nástroje [MCP](../tabs/mcp-tab.md) Heym používa model na interpretáciu týchto písomných pokynov na `always`, `once` alebo `never`, takže voľne formulovaný jazyk schvaľovania sa mapuje na konkrétnu politiku za behu. Spustenie je označené ako `pending` a po prijatí rozhodnutia pokračuje z uloženého snímku spustenia a to isté spustenie agenta sa môže pozastaviť viackrát, ak si neskoršie kroky tiež vyžadujú kontrolu.

Agent uzly automaticky komprimujú svoju nahromadenú históriu správ, keď sa priblíži k 80 % kontextového okna modelu. Systémový prompt, prvá používateľská správa a najnovšia používateľská správa sú vždy zachované; všetko medzi tým sa sumarizuje pomocou rovnakého modelu a prihlasovacích údajov. Udalosti kompresie sú viditeľné v paneli Debug, v [Execution History](./execution-history.md) a na karte [Traces](../tabs/traces-tab.md).

Pozrite si tiež [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) a [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Uzol Codex spúšťa OpenAI Codex CLI v izolovanom pracovnom priestore Heym. Prijíma prihlasovacie údaje Codex (prihláste sa cez ChatGPT, aby ste využili svoje predplatné bez nákladov na API za token, alebo vložte access token), prihlasovacie údaje GitHub, URL repozitára, základnú vetvu, prompt úlohy, režim publikovania (`diff_only` alebo `draft_pr`), názov vetvy a časový limit. Runner naklonuje repozitár lokálne, odovzdá ChatGPT token bundle alebo `CODEX_ACCESS_TOKEN` iba procesu Codex a vráti štruktúrované zhrnutie, poznámky k validácii, zmenené súbory, diff, metadata o využití a voliteľnú URL draft PR.

Keď Codex vráti `needs_input`, workflow sa pozastaví a sprístupní vetvu `question`. Pripojte túto vetvu k uzlu Slack, e-mailu alebo inému oznamovaciemu uzlu; verejný odkaz na nadviazanie obnoví uložený snapshot spustenia po odoslaní odpovede. Uzol Codex je možné pripojiť aj k AI Agentovi ako nástroj, čím agentovi umožníte delegovať úlohy programovania; ako nástroj sa výsledok `needs_input` vráti agentovi priamo, namiesto pozastavenia workflow.

Pozrite si tiež [GitHub](../nodes/github-node.md), [Prihlasovacie údaje](./credentials.md), [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) a [Typy uzlov](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Uzol OpenCode Go spúšťa OpenCode CLI (Go) proti repozitáru GitHub. Izolácia sa riadi vzorom Codex: lokálne beží ako podproces hostiteľa, zatiaľ čo nasadenia v Dockeri ho spúšťajú v zabezpečenom súrodenom kontajneri, ktorý zdieľa zväzok pracovného priestoru. Prijíma prihlasovacie údaje OpenCode Go (API kľúč brány s voliteľnou základnou URL), prihlasovacie údaje GitHub, URL repozitára, základnú vetvu, prompt úlohy, režim publikovania, názov vetvy, časový limit a model `opencode-go/<model>` vybraný z živého, prehľadávateľného zoznamu modelov (so vstavanou záložnou možnosťou). Heym vykonáva všetky operácie git/GitHub na hostiteľovi a nikdy neumiestňuje token GitHub do sandboxu; OpenCode iba upravuje súbory na disku. Uzol vráti štruktúrované zhrnutie, poznámky k validácii, zmenené súbory, diff a voliteľnú URL pull requestu. Je možné ho pripojiť k AI Agentovi ako nástroj.

Pozrite si tiež [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Prihlasovacie údaje](./credentials.md), [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) a [Typy uzlov](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Uzol LLM spracúva text pomocou jazykového modelu alebo generuje obrázky. Podporuje generovanie textu, vision (vstup obrázka), generovanie obrázkov, štruktúrovaný výstup JSON, natívne spúšťanie Batch API poskytovateľa pre podporované endpointy OpenAI a OpenAI-kompatibilné endpointy a voliteľný prepínač **Use Responses API**, ktorý smeruje volanie cez Responses API namiesto Chat Completions (predvolene vypnutý; funguje s OpenAI a vlastnými prihlasovacími údajmi a nie je možné ho kombinovať s režimom Batch). Nakonfigurujte prihlasovacie údaje, model, systémové a používateľské správy, teplotu a maximálny počet tokenov; v promptoch použite [Expression DSL](./expression-dsl.md). V režime batch sa `userMessage` musí vyhodnotiť na pole, uzol emituje vetvu `batchStatus` s aktualizáciami priebehu a konečný výstup obsahuje výsledky batchu pre jednotlivé položky. Voliteľný prepínač **Extra Body** pripája k každému volaniu API objekt JSON s parametrami požiadavky špecifickými pre poskytovateľa (napríklad `{"thinking": {"type": "disabled"}}`); predvolene je vypnutý. Voliteľné [Guardrails](./guardrails.md) blokujú nebezpečný obsah pred volaním.

Prirodzene sa kombinuje s [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) a [Dialógom vyhodnotenia výrazu](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Uzol Decision kladie modelu rozhodovania otázky týkajúce sa stavu spustenia a vracia pravdepodobnosti namiesto prózy. Pole **State** nesie to, čo má model čítať — osamotený výraz si zachováva vlastný typ, takže `$input` odošle objekt namiesto jeho textu — a zoznam otázok nesie úsudky. Otázky majú tri podoby: **noul** odpovedá, či podmienka platí, **choice** vyberá jednu možnosť z množiny, ktorú definujete, a vracia celé rozdelenie a **score** hodnotí stav pozdĺž usporiadaných úrovní a môže sa ocitnúť medzi nimi. Odpovede choice a score nesú aj mieru istoty, takže [Switch](../nodes/switch-node.md) môže smerovať na základe odpovede, zatiaľ čo [Condition](../nodes/condition-node.md) filtruje podľa toho, aká istá bola. **Generate with AI** navrhne šablónu stavu a riadky otázok z jednoduchej vety a **Custom request body** odošle ručne napísaný JSON pre endpoint, ktorého kontrakt sa líši. Odpoveď poskytovateľa sa odovzdáva nezmenená a každé volanie sa zaznamená v [Spusteniach](../tabs/traces-tab.md).

Vyžaduje prihlasovacie údaje Decision Model; prirodzene sa kombinuje s [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) a [Agent Node](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Uzol RAG / Vector Store vkladá, aktualizuje (upsert), odstraňuje a vyhľadáva dokumenty vo vektorovom úložisku pre retrieval-augmented generation. Rozbaľovací zoznam Database vyberá backend — **Qdrant** (externý server) alebo **Postgres (pgvector)** (vlastná databáza Heym, bez externých služieb), pričom predvolenou možnosťou je Qdrant. Vyberte vektorové úložisko na karte [Vectorstores](../tabs/vectorstores-tab.md) a nastavte operáciu na insert, upsert, delete alebo search. Operácie upsert a delete adresujú dokument prostredníctvom jedinečného id uloženého v payload — pole **Document ID Field** pomenúva toto pole (predvolene `doc_id`) a pole **Document ID** nesie jeho hodnotu — takže dokument si zachováva id, ktoré už používa Váš vlastný systém: upsert nahradí každý zodpovedajúci bod pred uložením novej verzie a delete hlási, či sa našla zhoda. Metadata dokumentu akceptujú vo svojich hodnotách výrazy, takže `{"url": "$start.url"}` uloží to, čo dané spustenie vytvorilo. Vyhľadávanie podporuje filtre metadát, voliteľné **Hybrid Search** (vektorová podobnosť spojená s hľadaním kľúčových slov BM25, takže presné výrazy ako identifikátory a chybové kódy sa nájdu popri sémantických zhodách) a voliteľné preradenie Cohere (reranking) a vracia pole výsledkov s text, score, metadata, príznakmi reranked a hybrid a počtom count na použitie v tokoch [LLM](../nodes/llm-node.md) alebo [Agent Node](../nodes/agent-node.md).

Bežnými nadväznými uzlami sú [LLM](../nodes/llm-node.md) a [Agent Node](../nodes/agent-node.md); nastavenie vektorového úložiska nájdete v [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Uzol MCP Call volá konkrétny nástroj [MCP](../tabs/mcp-tab.md) priamo, bez toho, aby LLM rozhodoval o tom, ktorý nástroj vyvolať. Použite ho, keď v čase návrhu presne viete, ktorý nástroj spustiť — pre deterministické, jednokrokové vykonanie nástroja MCP vo workflow. Nakonfigurujte pripojenie (SSE, Streamable HTTP alebo stdio; rovnaké polia ako pripojenie MCP v [Agent Node](../nodes/agent-node.md)), kliknutím na **Fetch Tools** naplňte rozbaľovací zoznam, vyberte nástroj a vyplňte polia argumentov, ktoré sa automaticky vykreslia zo vstupnej schémy nástroja. Každý argument akceptuje statickú hodnotu alebo [výraz DSL](./expression-dsl.md), napríklad `$userInput.body.text`. Výsledok je dostupný ako `$nodeLabel.result` (objekt JSON, ak je parsovateľný, inak reťazec). Uzol MCP Call nie je možné pripojiť k [Agent Node](../nodes/agent-node.md) ako nástroj na plátne.

Pozri tiež [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) a [Expression DSL](./expression-dsl.md).

### Logika

#### [Condition](../nodes/condition-node.md)

Uzol Condition vetví workflow na základe výrazu if/else. Má dva výstupné handly: jeden pre prípad, keď je podmienka pravdivá, a jeden pre nepravdivú. Vo výraze podmienky použite porovnávacie a logické operátory z [Expression DSL](./expression-dsl.md); uzol prepúšťa vstup do zvolenej vetvy.

Pozri tiež [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) a [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Uzol Switch smeruje vykonávanie do rôznych ciest porovnaním hodnoty s jednotlivými prípadmi. Nakonfigurujte výraz na vyhodnotenie a zoznam hodnôt prípadov; každý prípad získa zdrojový handle a pre nezhodujúce sa hodnoty sa použije predvolený handle. Vstup sa prepúšťa do zodpovedajúcej vetvy.

Pre binárne vetvenie použite [Condition](../nodes/condition-node.md) a na opätovné spojenie rozvetvených ciest [Merge](../nodes/merge-node.md); pravidlá porovnávania sú pokryté v [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Uzol Merge čaká na viacero paralelných vstupov a kombinuje ich do jedného výstupu. Nastavte počet vstupov, na ktoré sa má čakať; uzol vytvorí zlúčený objekt, keď sa dokončia všetky vetvy. Použite ho na spojenie výsledkov z paralelných vetiev pred pokračovaním; nepoužívajte ho, keď paralelné vetvy končia v samostatných uzloch Output.

Pozri tiež [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) a [Output](../nodes/output-node.md) pri opätovnom spájaní vetiev.

#### [Loop](../nodes/loop-node.md)

Uzol Loop iteruje cez pole a pre každú položku vykonáva nadväzné uzly. Na posun vpred vyžaduje spätné prepojenie z posledného uzla v tele iterácie. V tele cyklu použite `item`, `index`, `total`, `isFirst` a `isLast`; cyklus má samostatné výstupy pre cestu iterácie a cestu done.

V kombinácii s [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) a [Expression DSL](./expression-dsl.md) pre iteratívne workflowy.

### Dáta

#### [Set](../nodes/set-node.md)

Uzol Set transformuje a mapuje vstupné dáta na vlastný výstup. Definujte mapovania kľúč-hodnota, kde každá hodnota je výraz [Expression DSL](./expression-dsl.md). Použite ho na prevod na veľké písmená, podreťazce, zreťazenie, náhodné čísla a podobné transformácie. K výstupu pristupujte podľa kľúča (napr. `$setNode.keyName`). Pri pripojení k agentovi ako nástroj uzla na plátne je možné hodnoty mapovania označiť ako poskytované agentom, aby ich agent vyplnil za behu. Na volanie iných workflowov použite namiesto toho uzol [Execute](../nodes/execute-node.md).

Pozri tiež [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) a [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Uzol Converter konvertuje dáta medzi formátmi bez potreby písať kód. Textové konverzie sú `csvToJson` (CSV text na pole objektov riadkov alebo na polia, ak neexistuje hlavička), `jsonToCsv` (pole objektov/riadkov na CSV text), `xmlToJson` (XML text na objekt) a `jsonToXml` (objekt na XML text). Nakonfigurujte smer konverzie a zdrojový výraz; CSV konverzie navyše používajú oddeľovač a spracovanie hlavičky a `jsonToCsv` môže určiť explicitné poradie stĺpcov. Úvodzovky, vložené oddeľovače a vložené zalomenia riadkov sa riadia normou RFC 4180. XML atribúty používajú predpony `@`, text zmiešaný s atribútmi používa `#text`, opakujúce sa elementy sa stávajú poľami a rozširovanie XML entít je vypnuté. Ten istý uzol pracuje aj s uloženými súbormi. `imageToText` a `pdfToText` spúšťajú Tesseract OCR, čítajú súbor z Heym Drive (`$Upload.file.id` z File upload triggera, výsledok uzla Drive alebo súbor vygenerovaný agentom), pričom jazyk vyberajú automaticky z rozpoznaného písma alebo používajú kódy, ktoré zadáte, ako napríklad `tur` alebo `eng+tur`, a text štandardne normalizujú na UTF-8 s voliteľnou normalizáciou NFC a užšími znakovými sadami ako `cp1254`. `fileConvert` prepíše uložený súbor do iného formátu, dokumenty prostredníctvom pandoc a obrázky prostredníctvom Pillow, a výsledok uloží ako nový súbor na Drive bez toho, aby sa dotkol originálu. Výsledok je dostupný ako `$converterNode.result`, pričom pri OCR behoch sú k dispozícii aj `.language`, `.encoding`, `.page_count`, `.pages` a `.file` a pri `fileConvert` aj `.id`, `.filename` a `.download_url`.

Pozri tiež [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) a [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Uzol Code spúšťa Python, ktorý napíšete, s vlastným `requirements.txt`, v kontajneri, ktorý sa vytvorí a zničí pri každom spustení. Váš kód definuje funkciu `main(params)` a vracia ľubovoľnú hodnotu serializovateľnú do JSON, ktorá sa stane `$codeNode.result`; čokoľvek, čo vypíše, sa zachytí oddelene ako `$codeNode.logs` a `$codeNode.install` hlási, ktorý nástroj nainštaloval závislosti. Parametre sa konfigurujú ako objekt JSON, ktorého výrazy `$` sa vyhodnotia pred spustením, a kód ich číta pomocou bodkovej notácie, ako napríklad `params.user.name` alebo `params.orders[0].id`. Závislosti sa inštalujú pomocou `uv` s návratom na `pip` pre balíčky, ktoré `uv` nedokáže spracovať, bez medzipamäte medzi behmi; ponechanie prázdneho `requirements.txt` úplne preskočí inštaláciu a je oveľa rýchlejšie. Fáza vykonávania nemá prístup k sieti, pokiaľ nie je zapnuté `codeAllowNetwork`, zatiaľ čo inštalácia závislostí vždy dosiahne PyPI. Sandbox beží ako non-root so všetkými odobranými oprávneniami, s koreňovým súborovým systémom iba na čítanie, bez Docker socketu a bez prístupu k backendovým tajomstvám, s limitom 512 MB pamäte, jedného CPU, 256 procesov, 120 sekúnd na inštaláciu a 60 sekúnd na vykonanie. Docker je vyžadovaný a neexistuje žiadny náhradný režim: bez dostupného daemona uzol zlyhá namiesto spustenia vášho kódu v backendovom procese.

#### [Variable](../nodes/variable-node.md)

Uzol Variable nastavuje alebo aktualizuje premennú lokálnu pre workflow (`$vars.variableName`) alebo trvalú [globálnu premennú](./global-variables.md) (`$global.variableName`). Použite ho na počítadlá, akumulované zoznamy a zdieľaný stav. Nakonfigurujte názov premennej, výraz hodnoty, prevod typu a či sa má uložiť do globálneho úložiska. Pole premenných podporuje `$array()` a `.add()`.

Spolupracuje s [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) a [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Uzol Execute volá iný workflow (pod-workflow) a odovzdáva mu vstup. Cieľový workflow zadajte pomocou ID a vstup poskytnite prostredníctvom jedného výrazu alebo mapovania kľúč-hodnota. Výstup obsahuje workflow_id, status a outputs; použite ho na opakovane použiteľnú logiku, nie na transformáciu dát (na to použite Set).

Pozri tiež [Canvas Features](./canvas-features.md) pre Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) a [Output](../nodes/output-node.md).

### Integrácie

#### [HTTP](../nodes/http-node.md)

Uzol HTTP vykonáva HTTP požiadavky pomocou konfigurácie v štýle cURL. Môže byť východiskovým bodom workflow (bez prichádzajúcej hrany) alebo prijímať vstup z predchádzajúcich uzlov. Odpoveď je dostupná ako status, headers a body (parsované JSON, ak je to možné). Na autentifikáciu Bearer alebo vlastnou hlavičkou použite [Credentials](./credentials.md).

Spolupracuje s [Webhooks](./webhooks.md), [Credentials](./credentials.md) a [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Uzol WebSocket Send otvára odchádzajúce klientske pripojenie, odošle jednu textovú/JSON/binárnu správu a zatvorí ho. Použite ho na publikovanie výstupu workflow do realtime systémov bez vytvárania socket endpointu hostovaného v HeyMe.

Pozri tiež [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) a [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Uzol Telegram odosiela správu bota do chatu, skupiny alebo kanála. Nakonfigurujte Telegram [prihlasovacie údaje](./credentials.md), nastavte `chatId` a zostavte odchádzajúcu `message` pomocou výrazov [Expression DSL](./expression-dsl.md). Prirodzene sa spája s [Telegram Trigger](../nodes/telegram-trigger-node.md) pre konverzačné workflowy a s [Error Handler](../nodes/error-handler-node.md) pre upozornenia operátorov.

Pozrite si tiež [Third-Party Integrations](./integrations.md) a [Prihlasovacie údaje](./credentials.md) pre nastavenie a vzory prihlasovacích údajov.

#### [Slack](../nodes/slack-node.md)

Uzol Slack odosiela správu do kanála Slack prostredníctvom Incoming Webhook. Nakonfigurujte Slack [prihlasovacie údaje](./credentials.md) a výraz pre správu. Použite ho na notifikácie, upozornenia a hlásenie chýb; výstup prechádza cez vstup.

Spája sa s [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) a [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Uzol Discord odosiela správu do kanála Discord prostredníctvom Incoming Webhook. Nakonfigurujte Discord [prihlasovacie údaje](./credentials.md), zostavte odchádzajúcu správu pomocou [Expression DSL](./expression-dsl.md) a voliteľne nastavte prepísanie používateľského mena alebo avatara webhooku.

Spája sa s [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) a [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Uzol Send Email odosiela e-maily prostredníctvom SMTP. Nakonfigurujte SMTP [prihlasovacie údaje](./credentials.md) a výrazy [Expression DSL](./expression-dsl.md) pre príjemcu(ov), predmet a telo správy. Použite ho na notifikácie, upozornenia a transakčné e-maily. Výstup obsahuje stav, príjemcu a predmet.

[IMAP Trigger](../nodes/imap-trigger-node.md) dopĺňa Send Email spracovaním prichádzajúcej pošty. Spoločne umožňujú workflowu čítať prichádzajúce e-maily zo zdieľanej schránky, sumarizovať alebo klasifikovať ich pomocou AI uzlov a odoslať následnú alebo eskalačnú správu. [Telegram Trigger](../nodes/telegram-trigger-node.md) a [uzol Telegram](../nodes/telegram-node.md) poskytujú rovnaký vzor prichádzajúcej/odchádzajúcej komunikácie pre chatové workflowy riadené botom.

Pre obojsmerné toky notifikácií sa dobre spája aj s [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) a [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Uzol Redis vykonáva operácie Redis: set, get, hasKey a deleteKey. Použite ho na cachovanie, obmedzovanie rýchlosti a ukladanie kľúč-hodnota. Nakonfigurujte [prihlasovacie údaje](./credentials.md), typ operácie, výraz pre kľúč a pre operácie set hodnotu a voliteľné TTL. Výstup sa líši podľa operácie (value, success, exists, deleted).

Spája sa s [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) a [Parallel Execution](./parallel-execution.md) pre cachovanie, obmedzovanie a koordináciu.

#### [Grist](../nodes/grist-node.md)

Uzol Grist číta, zapisuje a spravuje dáta v tabuľkách Grist. Operácie zahŕňajú getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables a listColumns. Poskytnite ID dokumentu, ID tabuľky a pre create/update údaje záznamu pomocou ID stĺpcov. Použite ho na CRUD, dávkové aktualizácie a automatizáciu tabuliek.

Pozrite si tiež [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) a [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Uzol Google Sheets číta, zapisuje a spravuje údaje tabuliek prostredníctvom OAuth2. Použite ho na čítanie reportov, pripájanie výsledkov workflowu, aktualizáciu sledovačov a vymazanie alebo kontrolu listov tabuľky priamo z workflowu. Rovnako ako [BigQuery](../nodes/bigquery-node.md) používa integračné prihlasovacie údaje podporované spoločnosťou Google a dobre sa hodí vedľa [Grist](../nodes/grist-node.md), keď sú údaje tabuliek súčasťou toku.

Spája sa s [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) a [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

Uzol BigQuery spúšťa SQL dopyty a vkladá riadky do datasetov Google BigQuery prostredníctvom OAuth2. Je užitočný pre analytické workflowy, reportovacie pipeline a zápis štruktúrovaných údajov o udalostiach z behov workflowu. Často sa spája s [Set](../nodes/set-node.md) pre formovanie riadkov a s [Google Sheets](../nodes/google-sheets-node.md) pre ľahšie reportovanie orientované na tabuľky.

Spája sa s [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) a [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Uzol Google Drive umožňuje vypisovať, sťahovať, aktualizovať a odstraňovať súbory a priečinky v Drive prostredníctvom OAuth2 a dokáže skopírovať súbor z Drive priamo do [Heym Drive](../nodes/drive-node.md) pomocou operácie `syncToHeymDrive`. Google Docs, Sheets a Slides nemajú žiadne stiahnuteľné bajty, preto ich uzol automaticky exportuje — Docs do PDF, Sheets do XLSX, Slides do PPTX — s možnosťou prepísať cieľový formát. Odstránenia presúvajú položky do koša v Drive, pokiaľ nie je povolená možnosť „Delete permanently“, a uzol odmietne odstrániť priečinok prostredníctvom operácie pre súbory alebo naopak. Rovnako ako [Google Sheets](../nodes/google-sheets-node.md) používa prihlasovacie údaje OAuth2 podporované spoločnosťou Google; upozorňujeme, že tento uzol vyžaduje plný prístup k Drive, preto si pred jeho zdieľaním preštudujte [Zdieľanie prihlasovacích údajov](./credentials-sharing.md).

Spolupracuje s uzlami [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) a [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Uzol GitHub poskytuje 40 natívnych akcií GitHub REST pokrývajúcich repozitáre, organizácie a používateľov, issues, pull requests, recenzie, releases, workflowy Actions, prehľady návštevnosti a súbory repozitárov. Použite ho na triage issues, automatizáciu recenzií, odosielanie workflowov a čakanie na ich dokončenie, automatizáciu releases a aktualizácie súborov v repozitároch bez ručného zostavovania HTTP požiadaviek. Podporuje GitHub.com a voliteľný `base_url` pre GitHub Enterprise v prihlasovacích údajoch.

Spolupracuje s uzlami [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) a [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Uzol Jira prepája workflowy s Jira Cloud alebo Jira Data Center / Server REST API pre automatizáciu projektov, issues, komentárov, príloh, používateľov, notifikácií a prechodov. Dokáže vypisovať projekty, vyhľadávať issues pomocou JQL, vytvárať alebo aktualizovať issues, skúmať changelogy, upozorňovať zainteresované strany, spravovať komentáre a prílohy, načítavať alebo spravovať používateľov, vypisovať dostupné prechody a presúvať issues prostredníctvom ID prechodu. Použite prihlasovacie údaje Jira s e-mailom Atlassian, API tokenom, základnou URL adresou lokality a režimom nasadenia.

Spolupracuje s uzlami [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) a [Third-Party Integrations](./integrations.md) pre workflowy podpory, triage chýb a vydávania verzií.

#### [Linear](../nodes/linear-node.md)

Uzol Linear prepája workflowy s GraphQL API Linear pre automatizáciu pracovných priestorov a issues. Dokáže vypisovať tímy, projekty, issues, stavy workflowov, členov tímov a komentáre; vytvárať, aktualizovať, odstraňovať a prepájať issues; a vytvárať, aktualizovať, riešiť, znovu otvárať alebo odstraňovať komentáre. Použite osobný API kľúč Linear alebo prihlasovacie údaje OAuth2, potom pred vytváraním alebo aktualizáciou issues zistite UUID tímov, projektov, stavov a riešiteľov pomocou operácií výpisu.

Spolupracuje s uzlami [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) a [Third-Party Integrations](./integrations.md) pre workflowy príjmu požiadaviek, triage a inžinierskeho backlogu.

#### [Supabase](../nodes/supabase-node.md)

Uzol Supabase číta a mení tabuľky sprístupnené prostredníctvom Supabase PostgREST. Dobre sa hodí pre backendy produktov, údaje používateľov a profilov, stav workflowov a automatizácie typu CRUD, ktoré chcú prístup k databáze bez vlastného prepájania HTTP požiadaviek.

Spolupracuje s uzlami [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) a [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Uzol ClickHouse vykonáva operácie CRUD, count a raw SQL voči externej databáze ClickHouse prostredníctvom jej HTTP rozhrania. Hodí sa pre analytické pipeline, logovanie udalostí a reportingové workflowy: vkladajte udalosti tak, ako nastanú, a potom ich agregujte alebo počítajte pomocou `query`/`count`. Zrkadlí sadu operácií uzla [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) plus možnosť raw SQL, pričom `update`/`remove` sa vykonávajú ako mutácie ClickHouse.

Spolupracuje s uzlami [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) pre plánované reporty a [Third-Party Integrations](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Uzol Notion spravuje databázy, dátové zdroje, stránky a bloky Notion prostredníctvom aktuálneho Notion API (`2026-03-11`). Podporuje vyhľadávanie, CRUD stránok, operácie s databázami a dátovými zdrojmi, podradené bloky, pridávanie/aktualizáciu/odstraňovanie blokov a presun do koša/obnovenie. Použite interný integračný token alebo prihlasovacie údaje OAuth2 verejnej integrácie Notion. Editor dokáže vyhľadávať a stránkovať pomocou kurzora dostupné dátové zdroje a nadradené stránky. Zdieľané prihlasovacie údaje fungujú pri vykonávaní workflowov rovnako ako vlastnené prihlasovacie údaje.

Pre vlastné REST volania sa `$credentials.YourNotionCredential` preloží na rovnaký bearer token. Spolupracuje s uzlami [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) a [Third-Party Integrations](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Uzol Sentry automatizuje organizácie, projekty, tímy, issues, udalosti a vydania Sentry prostredníctvom Sentry REST API. Použite ho na triedenie upozornení, aktualizáciu stavu issues, automatizáciu vydaní, vyhľadávanie udalostí a nastavenie alebo čistenie projektov a tímov. Podporuje Sentry SaaS aj self-hosted Sentry prostredníctvom voliteľnej základnej URL v prihlasovacích údajoch.

Spolupracuje s uzlami [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) a [Third-Party Integrations](./integrations.md) pre workflowy incidentov a vydaní.

#### [DataTable](../nodes/datatable-node.md)

Uzol DataTable číta, zapisuje a spravuje dáta v Heym DataTables (štruktúrované úložisko prvej strany). Operácie zahŕňajú find, getAll, getById, insert, update, remove a upsert. Nevyžadujú sa žiadne externé prihlasovacie údaje. Tabuľky sa spravujú z dashboardovej karty [DataTable](../tabs/datatable-tab.md) a priamo k nim pristupuje vlastník workflowu.

Spolupracuje s uzlami [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) a kartou [DataTable](../tabs/datatable-tab.md) pre štruktúrované úložisko prvej strany.

#### [Drive](../nodes/drive-node.md)

Uzol Drive spravuje súbory generované skillmi priamo z prostredia workflowu. Operácie zahŕňajú delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams a unshareWithMyTeams na správu prístupu tímov iba na čítanie; konverzia formátov sa nachádza v uzle [Converter](../nodes/converter-node.md). Na súbor odkazujte pomocou `$agentLabel._generated_files[0].id`; výstupy zahŕňajú status, file_id, aktualizovanú download_url pre obmedzenia odkazov a shared_team_count pre zdieľanie s tímami. Je to obzvlášť užitočné pri workflowoch s uzlom [Agent Node](../nodes/agent-node.md), ktoré využívajú [File Generation](./file-generation.md) a referenčný model [Drive](./drive.md).

Bežnými spoločníkmi sú [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) a [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Uzol Amazon S3 vykonáva operácie s objektovým úložiskom na Amazon S3 pomocou prihlasovacích údajov `s3` (access key, secret key, region, voliteľný session token). Operácie zahŕňajú putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder a listBuckets. Podporované je nahrávanie textu a sťahovanie textu alebo base64, pričom polia bucket a key akceptujú [Expression DSL](./expression-dsl.md). Použite ho na ukladanie výstupov workflowu, archiváciu súborov a čítanie objektov späť do toku.

Spolupracuje s uzlami [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) a [Third-Party Integrations](./integrations.md).

### Automatizácia

#### [Crawler](../nodes/crawler-node.md)

Uzol Crawler scrapuje webové stránky pomocou FlareSolverr s voliteľnou extrakciou HTML prostredníctvom CSS selektorov. Nakonfigurujte [prihlasovacie údaje](./credentials.md) FlareSolverr, výraz URL, čas čakania a voliteľné selektory na extrakciu. Výstupom je surové HTML alebo extrahovaný obsah. Použite ho na web scraping a extrakciu obsahu.

Spolupracuje s uzlami [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) a [LLM](../nodes/llm-node.md) pre toky scrape-and-analyze.

#### [Playwright](../nodes/playwright-node.md)

Uzol Playwright automatizuje interakcie s prehliadačom pomocou konfigurovateľných krokov (navigate, refresh, click, type, screenshot, extract, aiStep) alebo režimu **Run Code** pre vlastný Playwright Python (sandboxovaný; predvolene vypnutý prostredníctvom `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Podporuje headless režim, voliteľné nastavenie, ktoré redukuje bežné signály automatizácie Playwright, časové limity, voliteľné zachytávanie siete (responses, cookies, localStorage, sessionStorage), bootstrap autentifikácie cookie/storageState z výrazov [Global Variables](./global-variables.md), ako napríklad `$global.authState`, záložné prihlasovacie kroky pri zlyhaní obnovenia autentifikácie a AI krok s Auto Heal pri zlyhaní selektorov. Použite ho na web scraping, vypĺňanie formulárov a workflowy založené na prehliadači.

Pozrite si tiež [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) a [Execution History](./execution-history.md) pre automatizáciu prehliadača a ladenie.

### Nástroje

#### [Output](../nodes/output-node.md)

Uzol Output je koncový bod workflowu, ktorý vracia odpoveď volajúcemu. Nastavte výraz správy tak, aby odkazoval na predchádzajúci uzol podľa označenia (nikdy tu nepoužívajte `$input` z uzla [Input](../nodes/input-node.md)). Voliteľný asynchrónny downstream umožňuje, aby uzly za výstupom bežali na pozadí po odoslaní odpovede.

Bežnými zdrojmi proti prúdu sú [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) a [Execute](../nodes/execute-node.md); ladenie tvarovania odpovede je jednoduchšie v [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Uzol JSON output mapper vytvára obyčajný JSON objekt z mapovaní kľúč-hodnota v štýle [Set](../nodes/set-node.md) a vracia ho v koreni odpovede workflowu. Použite ho, keď má volajúci API dostať surové telo JSON namiesto štandardného obalu uzla [Output](../nodes/output-node.md).
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

Uzol HTML output mapper vykresľuje jednu HTML šablónu a interpoluje výrazy `$nodeLabel.field` do stránky. Ak je jediným koncovým uzlom workflowu, execute webhook odpovedá s `text/html` a nakonfigurovaným stavovým kódom uzla namiesto JSON tela, takže workflow môže priamo obsluhovať stránku prehliadaču. Odoslaním `X-Simple-Response: false` získate späť obvyklý JSON obal na ladenie.

Spolupracuje s uzlami [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) a [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Uzol Chart Output je koncovým uzlom workflowu widgetu [Dashboard](../tabs/dashboard-tab.md). Premieňa riadky vytvorené predchádzajúcimi uzlami na štandardizovaný chart payload, ktorý dashboard vykresľuje. Zvoľte `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, Gantt, entity relationships, text alebo HITL), namapujte `labelField`/`valueField` (alebo `series` pre viacero sérií, prípadne `text` pre markdown správu) a umiestnite ho na koniec; nemá výstupnú hranu. Gantt číta riadky úloh s dátumami začiatku/konca ISO, priebehom a ID závislostí. Entity relationships číta objekt grafu s entitami, poľami, kľúčmi PK/FK a reláciami. Oboje sa vykresľuje aj na stránkach Heym Work a v náhľadoch návrhov widgetov. HITL ignoruje riadky z predchádzajúcich uzlov a zobrazuje Vaše čakajúce manuálne kontroly. a ďalšiu ako tlačidlá odkazov, ktoré otvárajú URL na novej karte (`linkColumn`, s `linkLabel` pre text tlačidla)

Pozrite tiež [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) a [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Uzol Wait pozastaví vykonávanie workflowu na zadanú dobu v milisekundách, maximálne 15 minút. Použite ho na obmedzovanie rýchlosti, oneskorené akcie alebo intervaly opakovaného dopytovania. Vstup prechádza nezmenený.

Spolupracuje s uzlami [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) a [Parallel Execution](./parallel-execution.md) na riadenie tempa a opakované dopytovanie.

#### [Sticky Note](../nodes/sticky-note-node.md)

Uzol Sticky Note pridáva na plátno markdown poznámky. Nevykonáva sa. Použite ho na dokumentáciu, pokyny alebo poznámky k workflowu popri ďalších [Canvas Features](./canvas-features.md). Obsah poznámky upravíte dvojitým kliknutím na plátne.

Pozrite tiež [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) a [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Uzol Console Log zapisuje hodnotu do konzoly backendu (servera). Použite ho na ladenie a kontrolu počas vývoja. Správa záznamu podporuje výrazy [Expression DSL](./expression-dsl.md); výstup prechádza nezmenený zo vstupu.

Spolupracuje s [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) a [Expression Evaluation Dialog](./expression-evaluation-dialog.md) na ladenie.

#### [Disable Node](../nodes/disable-node.md)

Uzol Disable Node natrvalo zakáže iný uzol vo workflowe nastavením jeho príznaku `active` na false. Cieľový uzol zadajte podľa označenia. Použite ho na jednorazové operácie, ako je zastavenie triggera [Cron](../nodes/cron-node.md) po splnení podmienky.

Pozrite tiež [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) a [Cron](../nodes/cron-node.md) pre vzory riadenia workflowu.

#### [Enable Node](../nodes/enable-node.md)

Uzol Enable Node opätovne zapne iný uzol nastavením jeho príznaku `active` na true a uložením zmeny. Cieľový uzol zadajte podľa označenia. Použite ho na opätovné aktivovanie zakázaného triggera [Cron](../nodes/cron-node.md) z iného vstupného bodu alebo na zapnutie uzla po splnení podmienky. Cieľ, ktorý sa nachádza za uzlom Enable Node a ešte nebol spustený, sa spustí aj v aktuálnom vykonávaní.

Pozrite tiež [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) a [Cron](../nodes/cron-node.md) pre vzory riadenia workflowu.

#### [Throw Error](../nodes/throw-error-node.md)

Uzol Throw Error okamžite zastaví vykonávanie workflowu a vráti chybovú odpoveď s vlastným stavovým kódom HTTP. Nastavte výraz chybovej správy a stavový kód (napr. 400, 401, 403, 404, 429, 500). Použite ho na zlyhania validácie, neoprávnený prístup alebo iné chybové stavy, najmä v spojení s uzlami [Condition](../nodes/condition-node.md) a [Error Handler](../nodes/error-handler-node.md).

Spolupracuje s uzlami [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) a [Security](./security.md) pre explicitné cesty zlyhania.

---

## Referencie
### [Typy uzlov](./node-types.md)

Heym poskytuje rôzne typy uzlov: triggery ako [Vstup](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) a [Error Handler](../nodes/error-handler-node.md); AI uzly ako [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) a [MCP Call](../nodes/mcp-call-node.md); logické uzly ako [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) a [Loop](../nodes/loop-node.md); dátové uzly ako [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) a [Heym](../nodes/heym-node.md); integrácie ako [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) a [Drive](../nodes/drive-node.md); automatizačné uzly ako [Crawler](../nodes/crawler-node.md) a [Playwright](../nodes/playwright-node.md); a pomocné nástroje ako [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) a [Sticky Note](../nodes/sticky-note-node.md). V konfigurácii uzla používajte výrazy ako `$input.text` a `$nodeLabel.field`.

Pozrite si tiež [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) a [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym používa jednoduchý jazyk výrazov na odkazovanie na dáta z predchádzajúcich uzlov. Použite `$input` pre uzol [Vstup](../nodes/input-node.md), `$nodeLabel.field` pre ľubovoľný predchádzajúci uzol, `$credentials.CredentialName` pre [prihlasovacie údaje](./credentials.md) a `$global.variableName` pre [globálne premenné](./global-variables.md). Medzi vstavané špeciálne premenné patria `$now`, `$UUID` a metadata workflowu: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` a `$executionId` (id [Histórie spustení](./execution-history.md) daného behu — `/workflows/{id}/{executionId}` otvorí tento beh na plátne; iba za behu, v dialógu náhľadu výrazu prázdne). Podporované sú literály, aritmetika, porovnania, kontext [Loop](../nodes/loop-node.md), vnorené polia a pomocné funkcie pre reťazce a polia (vrátane `$text.toJson()` na parsovanie JSON reťazca). Ak je celá hodnota jediným `$expr`, backend zachová polia, objekty, booleovské hodnoty a čísla ako natívne typy.

Pozrite si tiež [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) a [Workflow Structure](./workflow-structure.md).

### [Globálne premenné](./global-variables.md)

Úložisko globálnych premenných uchováva trvalé údaje typu kľúč-hodnota s rozsahom na používateľa, ktoré pretrvávajú naprieč spusteniami workflowu. Premenné vytvárajte na karte [Premenné](../tabs/global-variables-tab.md) alebo pomocou uzla [Variable](../nodes/variable-node.md) so zapnutou možnosťou „Store in Global Variable Store". Pristupujte k nim pomocou `$global.variableName` vo výrazoch; môžu byť zdieľané s ostatnými používateľmi alebo [tímami](./teams.md).

Dopĺňa [Variable](../nodes/variable-node.md), [Teams](./teams.md) a [Credentials Sharing](./credentials-sharing.md) pre zdieľaný stav workflowu.
### [Dialóg vyhodnotenia výrazu](./expression-evaluation-dialog.md)

Dialóg vyhodnotenia výrazu je rozbaliteľný editor, ktorý sa zobrazí po kliknutí na tlačidlo rozbalenia vedľa polí s výrazmi. Otvára sa ako veľké vycentrované modálne okno, zachováva aktívne automatické dopĺňanie a automaticky obnovuje náhľad výstupu z backendu po tom, čo prestanete písať. Výsledky objektov a polí je možné prezerať pomocou nástroja na výber cesty výstupu. Dialóg akceptuje celoriadkovú holú bodkovú cestu (napríklad `myNode.output.field`) tak, ako keby išlo o `$myNode.output.field`; pozrite si pravidlá umiestnenia v [Expression DSL](./expression-dsl.md).

Tlačidlo **Build with AI** na paneli nástrojov vám umožňuje opísať požadovaný výraz v prirodzenom jazyku. Vyberte [prihlasovacie údaje](./credentials.md) pre LLM a model, zadajte popis, napríklad *„Získaj meno zákazníka z odpovede API"*, a kliknite na Generate. Backend odošle modelu kontext [Expression DSL](./expression-dsl.md) a výstupy uzlov z posledného spustenia a vráti jeden reťazec výrazu. Výsledok sa vyhodnotí okamžite, takže ho môžete overiť pred kliknutím na Apply.

Prirodzene sa kombinuje s [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) a [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Štruktúra workflowu](./workflow-structure.md)

Workflowy sa ukladajú ako JSON s uzlami a hranami. Objekt workflowu obsahuje id, name, description, nodes, edges a nastavenia autentifikácie. Každý uzol má id, type, position a data (label a konfiguráciu špecifickú pre daný typ). Hrany prepájajú ID zdrojových a cieľových uzlov s voliteľnými ID handle. Syntax výrazov v poliach data sa riadi [Expression DSL](./expression-dsl.md) a rovnaký formát sa používa v [Download & Import](./download-import.md).

Pozrite si tiež [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) a [Download & Import](./download-import.md).

### [Funkcie plátna](./canvas-features.md)

Prejdite kurzorom nad ľubovoľným nelepiacim uzlom na plátne a kliknutím na **Run** spustíte vykonávanie až po tento uzol. Požadované vstupy sa otvoria v paneli Run s prvým poľom vo fokuse; cesty bez vstupov sa spustia okamžite. Pozrite si [Run to Node](./canvas-features.md#run-to-node).

Editor workflowu poskytuje Data Pin (pripnutie posledného výstupu uzla na testovanie nadväzujúcich uzlov bez opätovného spustenia), Execution Logs (výsledky uzlov a priebeh agenta v reálnom čase, ktoré dopĺňajú [Execution History](./execution-history.md)), Enable/Disable (vynechanie uzlov počas vykonávania) a Extract to Sub-Workflow (presun výberu do nového workflowu a jeho nahradenie uzlom [Execute](../nodes/execute-node.md)). Spustené produkčné vykonávanie je možné otvoriť z História alebo z karty Board; editor obnoví jeho aktuálny snímok, pripojí sa k SSE a zachová animáciu plátna a live Debug logy. [Keyboard Shortcuts](./keyboard-shortcuts.md) podporujú kopírovanie, vkladanie, spustenie a inline vyhľadávanie uzlov.

Pozrite si tiež [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md) a [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym poskytuje skratky v celom editore: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo a Escape na zatvorenie. Na plátne: select all, multi-select, copy/cut/paste, delete, toggle node enabled (D), toggle pinned data (P) a inline vyhľadávanie uzlov písaním. Skratky sú zdokumentované v referencii priamo v aplikácii a úzko spolupracujú s [Canvas Features](./canvas-features.md), ako sú Data Pin a zapnutie/vypnutie uzla.

Pozrite si tiež [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md) a [Contextual Showcase](./contextual-showcase.md).

### [AI Assistant](./ai-assistant.md)

AI Assistant je panel Chat, ktorý sa otvára z panela Debug a umožňuje vám vytvárať alebo upravovať workflowy pomocou prirodzeného jazyka. Vyberte [prihlasovacie údaje](./credentials.md) a model, potom opíšte, čo chcete; AI streamuje odpoveď a akýkoľvek platný [workflow JSON](./workflow-structure.md) v bloku kódu sa automaticky spracuje a použije na plátne. Hlasový vstup je podporovaný v kompatibilných prehliadačoch.

Zapnite **YOLO mode** (Agent mode, predvolene vypnutý) a asistent otestuje to, čo vytvorí. Po každej zmene spustí workflow na plátne, prečíta výsledok a opraví workflow, kým nerobí to, čo ste požadovali, a to až po 5 spustení na jednu správu. Pred prvým spustením si vyžiada testovacie vstupy, v prípade potreby dokáže spustiť vaše ďalšie workflowy, keď potrebuje ich výsledok, a zobrazuje každý krok počas práce. Pozrite si [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Kliknutím na **AI** nad ľubovoľným uzlom na plátne môžete zmeniť alebo opraviť iba tento uzel. Panel ukazuje uzel, ktorý upravuje (s jeho posledným výsledkom po spustení), a ponúka **Change this node as ...**, **Fix error in this node ...** a **Other**. Aktualizuje sa iba tento uzel; zvyšok workflowu a rozloženie zostávajú nezmenené. Pozrite [AI Assistant › Zmena jedného uzla](./ai-assistant.md#changing-one-node).

Keď workflow ukladá záznamy, asistent sa opýta, ktorú [dátovú tabuľku](../tabs/datatable-tab.md) použiť, alebo vytvorí jednu so stĺpcami, ktoré workflow potrebuje. Pozrite si [AI Assistant › Data tables](./Chat a MCP `heym_chat` môžu tiež priamo upravovať stĺpce a riadky s prístupom vlastníka alebo na zápis, s potvrdením pred odstránením stĺpcov alebo vymazaním všetkých riadkov. Chat a MCP `heym_chat` môžu tiež priamo upravovať stĺpce a riadky s prístupom vlastníka alebo na zápis, s potvrdením pred odstránením stĺpcov alebo vymazaním všetkých riadkov. ai-assistant.md#data-tables).

Keď aktuálny workflow obsahuje zručnosti [Agent Node](../nodes/agent-node.md), asistent odošle do kontextu workflowu iba `SKILL.md` jednotlivých zručností. Priložené súbory `.py` a binárne aktíva zručností sú pred odoslaním požiadavky vylúčené, aby veľké balíky zručností neprekročili kontextové okno modelu.

Dobre sa kombinuje s [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) a [Expression DSL](./expression-dsl.md).
### [Chat s Heym](./chat-with-heym.md)

Chat s Heym je asistent pre dokumentačnú hlavičku určený na otázky o produkte. Otvára sa v centrovanom dialógu, prihlasovacie údaje a výber modelu zostávajú viditeľné v hornej časti, ako kontext sa vkladá cesta k aktívnej stránke dokumentácie a história správ sa pri zatvorení dialógu vymaže. Doplňuje širšieho [AI Assistant](./ai-assistant.md) a odľahčenejší [Contextual Showcase](./contextual-showcase.md).

Pozri tiež [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) a [Node Types](./node-types.md).

### [Workflow Organization](./workflow-organization.md)

Administrátori inštancie (`HEYM_ADMIN_EMAILS`) môžu pristupovať ku všetkým workflowom a upravovať ich, vyhľadať workflowy vlastníka podľa e-mailu, skontrolovať plány a históriu spustení, pozastaviť a obnoviť automatické triggery a vymazať workflowy po ustálení behov. Postup odchodu používateľa a rozdiel medzi pozastavením automatických triggerov a zablokovaním všetkých volaní nájdete v časti [Instance Administration](../tabs/workflows-tab.md#instance-administration).

Workflowy je možné organizovať do priečinkov a podpriečinkov v stromovej štruktúre. Priečinky majú názvy a voliteľného rodiča; workflowy sa priraďujú do priečinkov. Workflowy je možné naplánovať na vymazanie (presun do oblasti koša pred trvalým odstránením). API podporuje vytváranie, aktualizáciu, vymazanie a presúvanie workflowov medzi priečinkami a rovnaký model organizácie sa nachádza aj v karte [Workflows](../tabs/workflows-tab.md).

Pozri tiež [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) a [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer je pevný panel rýchleho spustenia na pravej strane pre interné stránky mimo plátna. Umožňuje vyhľadávať [workflowy](../tabs/workflows-tab.md), pripnúť obľúbené, vybrať vstupy, okamžite spustiť a skontrolovať priebeh alebo výsledky bez otvorenia editora. Workflow s uzlom [File Upload Trigger](../nodes/file-upload-trigger-node.md) prijme presunutý alebo vybraný súbor. Poradie pripnutých položiek a naposledy vybraný workflow sa ukladajú v prehliadači.

Pozri tiež [Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) a [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase je kompaktný sprievodný panel v aplikácii pre autentifikované hlavné plochy, ako sú karty dashboardu, [Evals](../tabs/evals-tab.md), Docs a editor workflowov. Štandardne zostáva zatvorený, najprv poskytne krátke zhrnutie stránky, na požiadanie ponúkne trochu podrobnejšie informácie a v prípade potreby hlbšieho usmernenia odkazuje na úplný článok dokumentácie.

Dopĺňa [Chat s Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) a [AI Assistant](./ai-assistant.md) pre toky usmernenia v aplikácii.

### [Prihlasovacie údaje](./credentials.md)

Prihlasovacie údaje uchovávajú API kľúče a tajné údaje používané uzlami workflowu. Pridajte ich v karte [Prihlasovacie údaje](../tabs/credentials-tab.md) a odkazujte na ne podľa názvu alebo ID v uzloch, ako sú [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) a [Redis](../nodes/redis-node.md). Sú šifrované v pokoji, môžu byť zdieľané s používateľmi alebo [tímami](./teams.md) a možno na ne odkazovať aj v [Expression DSL](./expression-dsl.md) prostredníctvom `$credentials.Name`.

Pozri tiež [Prihlasovacie údaje](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md) a [Third-Party Integrations](./integrations.md).

### [Credentials Sharing](./credentials-sharing.md)

Prihlasovacie údaje je možné zdieľať s inými používateľmi prostredníctvom e-mailu alebo s tímami; pri zdieľaní prihlasovacích údajov s tímom získajú prístup všetci členovia tímu. Zdieľané prihlasovacie údaje sa zobrazujú s indikátorom v karte [Prihlasovacie údaje](../tabs/credentials-tab.md). Počas behu sa kontext vlastníka workflowu zlučuje z vlastnených, používateľsky zdieľaných a tímovo zdieľaných prihlasovacích údajov. Vo výrazoch použite `$credentials.CredentialName` alebo v dátach uzla nastavte credentialId.

Pozri tiež [Prihlasovacie údaje](./credentials.md), [Teams](./teams.md) a [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

Tímy umožňujú zdieľať workflowy, prihlasovacie údaje, globálne premenné, vektorové úložiská a súbory Drive so skupinou používateľov naraz. Tímy vytvárajte v karte [Teams](../tabs/teams-tab.md) a členov pridávajte podľa e-mailu. Zdieľajte zdroje s tímom v príslušných dialógoch zdieľania; všetci členovia potom majú prístup. Tvorca môže tím upravovať a vymazať; vymazaním tímu sa odstránia všetky tímové zdieľania.

Dopĺňa [Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md) a [Enterprise](./enterprise.md).

### [Parallel Execution](./parallel-execution.md)

Heym spúšťa uzly paralelne, keď navzájom nezávisia. Executor zostaví DAG a spúšťa uzly na rovnakej úrovni súbežne pomocou thread poolu; hneď ako uzol dokončí činnosť, naplánujú sa jeho nadväzujúce uzly. Na spojenie paralelných vetiev v prípade potreby použite uzol [Merge](../nodes/merge-node.md). Viacero behov workflowu sa vykonáva súbežne; každý beh je izolovaný. Režim [SSE Streaming](./sse-streaming.md) vysiela udalosti po dokončení uzlov.

Pozri tiež [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) a [Execution History](./execution-history.md).
### [Architektúra agenta](./agent-architecture.md)

[Uzol agenta](../nodes/agent-node.md) podporuje sub-agentov (orchestrátor volá ostatné uzly agentov prostredníctvom call_sub_agent), sub-workflowy (agent volá ostatné workflowy prostredníctvom call_sub_workflow), zručnosti (obsah inštrukcií a Python nástroje zo súborov .zip alebo .md) a klientske pripojenia [MCP](../tabs/mcp-tab.md). Vykonávateľ nástrojov orchestrátora smeruje volania sub-agentov a sub-workflowov; ostatné nástroje smerujú do vykonávateľov Python, MCP alebo zručností. Maximálna hĺbka vnorenia pre sub-agentov a sub-workflowy je 5. Slučka volania nástrojov zahŕňa automatickú kompresiu kontextu: pred každou iteráciou sa odhadne spotreba tokenov a ak prekročí 80 % kontextového okna modelu, stredné správy sa zhrnú pomocou toho istého modelu, pričom systémový prompt, prvá používateľská správa a posledná používateľská správa zostanú nedotknuté.

Pozri tiež [Uzol agenta](../nodes/agent-node.md), [Trvalá pamäť agenta](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) a [MCP](../tabs/mcp-tab.md).

### [Trvalá pamäť agenta](./agent-persistent-memory.md)

Voliteľný znalostný graf pre každý [uzol agenta](../nodes/agent-node.md) uložený v Postgres: entity, typy, vlastnosti a orientované vzťahy. Keď je `persistentMemoryEnabled` nastavené na true, graf sa pri každom spustení zhrnie do systémového promptu; po úspešnom dokončení [LLM](../nodes/llm-node.md) na pozadí extrahuje štruktúrované aktualizácie. REST CRUD je dostupné pod `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Editor sa otvára pomocou ružového ovládacieho prvku mozgu na uzle.

Pozri tiež [Uzol agenta](../nodes/agent-node.md), [Architektúra agenta](./agent-architecture.md) a [Spustenia](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-loop umožňuje [uzlu agenta](../nodes/agent-node.md) vyžiadať schválenie v konkrétnych kontrolných bodoch, vytvoriť verejnú stránku `/review/{token}` a čakať, kým neprihlásený recenzent prijme, upraví alebo odmietne text recenzie v Markdowne. Agenti s povoleným HITL tiež vystavujú výstupný handle `review`, takže môžete upozorniť [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) alebo iné kanály, kým je spustenie čakajúce. Text HITL na úrovni uzla sa používa ako pokyny na schválenie, zatiaľ čo zhrnutie verejnej stránky sa generuje zo samotnej žiadosti o recenziu. Čakajúce spustenia sa okamžite zobrazia v [Histórii spustení](./execution-history.md), môžu nastať viackrát v rámci toho istého spustenia a po odoslaní každého rozhodnutia pokračujú z presne uloženého snapshotu workflowu.

Pozri tiež [Uzol agenta](../nodes/agent-node.md), [Portál](./portal.md), [História spustení](./execution-history.md) a [Send Email](../nodes/send-email-node.md).

### [Webhooky](./webhooks.md)

Workflowy je možné spúšťať prostredníctvom [HTTP](../nodes/http-node.md) na adrese `POST /api/workflows/{workflow_id}/execute` alebo streamovať inkrementálne z `POST /api/workflows/{workflow_id}/execute/stream`. Telo požiadavky sa odovzdáva ako body do uzlov [Input](../nodes/input-node.md); hlavičky a parametre dopytu sú dostupné vo výrazoch [Expression DSL](./expression-dsl.md). Nakonfigurujte autentifikáciu pre jednotlivé workflowy: anonymná, JWT alebo vlastná hlavička. Voliteľné ukladanie odpovedí do vyrovnávacej pamäte, obmedzovanie rýchlosti a dialógové okno editora Run with cURL – to všetko sa nachádza na workflowe a vzťahuje sa na oba režimy. S [limitom súbehu](./webhooks.md#concurrency-limit-and-queued-runs) získa volanie, ktoré musí čakať, namiesto toho kód `202 Accepted` s ID vykonania a URL adresou stavu.

Pozri tiež [Input](../nodes/input-node.md), [Tokeny spustenia](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) a [Štruktúra workflowu](./workflow-structure.md).

### [Tokeny spustenia](./execution-tokens.md)

Tokeny spustenia sú JWT s obmedzeným rozsahom, ktoré udeľujú prístup k endpointom execute a stream jedného workflowu. Keď workflow používa autentifikáciu JWT, tokeny umožňujú externým skriptom, CI pipeline a integráciám volať workflow bez zdieľania používateľskej relácie. Každý token nesie claim `wid`, ktorý ho pripája k jednému workflowu, `jti` používaný na okamžité zrušenie a konfigurovateľnú TTL (60 sekúnd až 10 rokov). Tokeny vytvárajte, vyberajte a rušte priamo v dialógovom okne **Run with cURL** – vybraný token sa automaticky vloží do generovaného príkazu.

Pozri tiež [Webhooky](./webhooks.md), [Zabezpečenie](./security.md) a [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

Dialógové okno cURL môže prepnúť vykonávanie [webhooku](./webhooks.md) do režimu Server-Sent Events. To vytvára udalosti `execution_started`, `node_start`, `node_complete` a `execution_complete` v reálnom čase, pridáva `--no-buffer` do generovaného príkazu cURL a umožňuje konfigurovať správy o spustení pre jednotlivé uzly, ako napríklad `[START] LLM` alebo vlastný text pre externých konzumentov terminálu.

Pozri tiež [Webhooky](./webhooks.md), [História spustení](./execution-history.md) a [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflowy sa spúšťajú pomocou trigger uzlov ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) receive) alebo vstupných bodov: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron scheduler, Telegram webhook, Discord interaction webhook, IMAP trigger manager, RabbitMQ consumer alebo spustenie v editore. Každý trigger má vlastný endpoint alebo proces na pozadí; [Cron](../nodes/cron-node.md) sa spúšťa každých 60 sekúnd, uzly [Telegram Trigger](../nodes/telegram-trigger-node.md) prijímajú webhooky bota, uzly [Discord Trigger](../nodes/discord-trigger-node.md) prijímajú podpísané interaction webhooky a uzly [IMAP Trigger](../nodes/imap-trigger-node.md) sa spúšťajú v nakonfigurovanom intervale dopytovania. Uzly [Input](../nodes/input-node.md) prijímajú body, headers a query z webhook požiadaviek.

Pozrite si tiež [Node Types](./node-types.md), [Webhooks](./webhooks.md) a [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

Execution history zaznamenáva spustenia workflowov: vstupy, výstupy, výsledky uzlov, stav a zdroj triggera. Prístup k nej získate z panela nástrojov editora, zobrazenia Docs, hlavičky Dashboardu alebo zobrazenia [Evals](../tabs/evals-tab.md). História pre konkrétny workflow zobrazuje spustenia otvoreného workflowu; zobrazenie celej histórie zobrazuje spustenia naprieč workflowmi a chatom. Práve prebiehajúce spustenia sa zobrazujú v hornej časti oboch dialógov s akciami **Open live** a **Cancel**. Open live pripojí editor k existujúcemu spusteniu cez [SSE](./sse-streaming.md), obnoví dokončené uzly, pulzuje aktuálny a čakajúce uzly a pridá Debug logy bez spustenia ďalšieho behu. Bring to Canvas načíta vstupy a výstupy uzlov dokončeného spustenia na opätovné spustenie alebo ladenie; deep link `/workflows/{workflowId}/{executionId}` podporuje živé aj dokončené spustenia. Spustenia pozastavené pomocou [Human-in-the-Loop](./human-in-the-loop.md) sa okamžite uložia ako `pending`, vrátane verejnej URL na kontrolu a všetkých notifikačných uzlov spustených z vetvy `review` agenta. Ak sa server počas behu reštartuje, prerušené spustenia sa obnovia automaticky: spustia sa odznova s rovnakými vstupmi a zobrazia sa ako dokončené (označené **Recovered**), čo je riadené prepínačom **Auto-recover runs** pre konkrétny workflow, ktorý ich namiesto toho môže zaznamenať ako `skipped`.

Pozrite si tiež [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) a [Traces](../tabs/traces-tab.md).

### Execution Highlights

Po živom spustení — alebo po **Bring to Canvas** — sa v pravom hornom rohu plátna zobrazí odstrániteľné vyskakovacie okno **Execution Highlights**, ktoré v poradí vykonávania uvádza, čo jednotlivé uzly vytvorili. Je to rýchly spôsob, ako skontrolovať výstup jednotlivých uzlov bez otvárania každého z nich; zatvorte ho pomocou **✕** a pri ďalšom spustení sa znova otvorí. Highlights sa zobrazujú aj pri spusteniach na dashboarde. Podrobnosti nájdete v [Execution History](./execution-history.md).

### [Edit History](./edit-history.md)

Edit History sleduje uložené verzie workflowu (každé uloženie vytvorí verziu). Zobrazte zoznam, otvorte verziu a pozrite si diff voči aktuálnemu workflowu ([uzly](./workflow-structure.md), hrany, konfigurácia) a pomocou Revert obnovte predchádzajúcu verziu. Na rozdiel od [Execution History](./execution-history.md) sleduje Edit History zmeny štruktúry, nie spustenia.

Pozrite si tiež [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) a [Canvas Features](./canvas-features.md).

### Error Workflow

Workflow môže určiť iný workflow, ktorý sa spustí pri jeho zlyhaní. Nakonfigurujte ho v paneli **Properties** na úrovni workflowu (zobrazí sa, keď nie je vybraný žiadny uzol) v časti **On error, run workflow**. Nastaviť, zmeniť alebo vymazať ho môže iba vlastník workflowu; pozrite si [Owner-only settings](./workflow-organization.md#owner-only-settings). Keď sa spustenie na najvyššej úrovni skončí neošetreným zlyhaním, spustí sa vybraný error workflow a dostane kontext zlyhania (id a názov zlyhaného workflowu, id spustenia, chybovú správu, označenie a typ zlyhaného uzla a časovú značku). Ak plátno už obsahuje uzol [Error Handler](../nodes/error-handler-node.md), lokálny handler má prednosť a error workflow sa **nevyvolá**. Samotný error workflow sa spúšťa priamo, takže nikdy nespustí svoj vlastný error workflow.

Pokrýva každé netestovacie spustenie na najvyššej úrovni: oba execute endpointy, [Portal](./portal.md) a každý trigger vrátane [cron](../nodes/cron-node.md), triggerov chatovacích platforiem, e-mailu, frontov, [MCP](../tabs/mcp-tab.md) a widgetov dashboardu. Pri zapnutom [Load Distribution](./cluster.md) to zostáva nezmenené, vrátane spustení vykonaných workerom: zlyhávajúci uzol sa vráti spolu s výsledkom a error workflow sa potom distribuuje ako každé iné spustenie, takže uzol v ňom, ktorý musí bežať na hlavnej inštancii, tam stále beží. Dva prípady sú zámerne vynechané, pretože výsledok samotného workflowu ešte nie je známy: spustenie, ktoré nevykonala žiadna inštancia, a čakanie, ktoré vypršalo, pričom spustenie môže stále prebiehať. **Nie je** tiež spustený manuálnymi testovacími behmi na plátne.
### Časový limit workflowu

Každý workflow môže mať nastavený **časový limit workflowu** v sekundách v paneli **Vlastnosti** na úrovni workflowu. Hodnota `0` (predvolená) ho vypína. Ak je nastavený, spustenie, ktoré prekročí limit, sa zastaví na hranici nasledujúceho uzla a zaznamená sa ako neúspešné spustenie s chybou „timed out". Časový limit sa vzťahuje na manuálne, API aj spúšťané behy. Dlhé uzly [Wait](../nodes/wait-node.md) sú prerušené okamžite, namiesto toho, aby blokovali po celú svoju dobu trvania.

### Limit súbehu

Každý workflow môže obmedziť počet súčasne vykonávaných produkčných behov pomocou nastavenia **Limit súbehu** v paneli **Properties** na úrovni workflowu; vlastník a spolupracovníci s prístupom na úpravu ho môžu meniť a predvolene je vypnutý. Pri dosiahnutí limitu nové behy z endpointov [webhooku](./webhooks.md#concurrency-limit-and-queued-runs) a [streamovania](./sse-streaming.md), z [Portalu](./portal.md), z [Quick Drawer](./quick-drawer.md), z [MCP](../tabs/mcp-tab.md) a každého [triggera](./triggers.md) čakajú vo fronte FIFO (prvý dnu, prvý von), počítanom naprieč všetkými inštanciami [clusteru](./cluster.md). Testovacie behy editora, volania sub-workflowov, [Evals](../tabs/evals-tab.md) a obnovenia po kontrole sa do frontu nikdy nezaraďujú a behy kariet z [Boardu](../tabs/board-tab.md), nahrávania súborov, behy spustené nástrojom run-workflow asistenta AI a workflowy na upozornenia na výstrahy štartujú bez čakania na slot. Volanie webhooku, ktoré musí čakať, dostane okamžite `202 Accepted` s `execution_id`, stavovou URL adresou overujúcou rovnaké poverenia, svojou pozíciou, veľkosťou frontu a počtom bežiacich úloh; klient MCP dostane rovnakú odpoveď a dopytuje sa nástroja `heym_execution_status`. Voliteľné nastavenie **Maximálna veľkosť frontu** odmieta nadbytočné volania kódom `429` a voliteľné **Maximálne čakanie** zaznamená beh čakajúci príliš dlho ako `expired`. Čakajúce behy sa zobrazujú v [Histórii spustení](./execution-history.md) ako **V rade n/m** a možno ich tam zrušiť.

### Ušetrený čas

Každý workflow môže zaznamenať **odhadovaný ušetrený čas na jedno spustenie** (v minútach), nastavený v paneli **Vlastnosti** na úrovni workflowu. Karta [Analytics](../tabs/analytics-tab.md) to agreguje v rámci zvoleného rozsahu ako celkovú štatistiku **Ušetrený čas** (súčet odhadu každého workflowu × jeho úspešných spustení). Most Used tiež uvádza tento súčet pre každý workflow; **Not Set** otvorí pole odhadu, keď nie je nastavený. Správa [Workflow Analysis](./workflow-analysis.md) odporúča nastaviť odhad, keď žiadny nie je nakonfigurovaný.

### [Nastavenia](./user-settings.md)

Dialógové okno Nastavenia (otvorené z vášho avatara v hlavičke) má štyri karty: Profile (obrázok Gravatar, zobrazované meno, User Rules), [Security](./security.md) (zmena hesla), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) a Observability (stav [OpenTelemetry](./opentelemetry.md) iba na čítanie). User Rules sú vlastné inštrukcie vkladané do každého AI požiadavku vrátane nástroja na tvorbu workflowov a [Chat](../tabs/chat-tab.md), takže môžete nastaviť jazyk, tón, štýl kódu alebo konvencie workflowov raz. K dispozícii je aj politika hesiel a správa API kľúčov [MCP](../tabs/mcp-tab.md).

Pozri tiež [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) a [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym dokáže vysielať OpenTelemetry traces pre každé spustenie workflowu a vykonanie uzla: koreňový span `heym.workflow.execute` na jedno spustenie a podradený span `heym.node.execute` na jeden uzol, s využitím modelu a tokenov pripojeným k uzlom LLM a agentov. Spany sa exportujú cez OTLP/HTTP do akéhokoľvek kompatibilného backendu (Jaeger, Grafana Tempo, Honeycomb, Datadog) a kontext W3C trace sa šíri naprieč prichádzajúcimi webhookmi, odchádzajúcim HTTP a pod-workflowmi. Tracing je predvolene vypnutý a konfiguruje sa pomocou [environment variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; aktívny stav sa zobrazuje na karte Observability v [Nastaveniach](./user-settings.md).

Pozri tiež [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) a [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Exportujte aktuálny workflow ako JSON z panela nástrojov Editora (tlačidlo Download); súbor obsahuje uzly a hrany. Importujte potiahnutím JSON súboru na kartu [Workflows](../tabs/workflows-tab.md) (vytvorí nový workflow) alebo na plátno (nahradí alebo zlúči). JSON musí obsahovať pole nodes; name a edges sú voliteľné. Použite to na zálohovanie, zdieľanie alebo migráciu medzi inštanciami.

Pozri tiež [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) a [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portal sprístupňuje workflowy ako verejné chat rozhrania na adrese `/chat/{slug}`. Nakonfigurujte portal_enabled, slug, voliteľné overenie (používatelia portalu), streaming a nahrávanie súborov pre každý workflow. Koncoví používatelia komunikujú prostredníctvom chat rozhrania bez prihlásenia do Heymu; výstupy obrázkov je možné zobraziť v chate. Workflowy portalu môžu tiež odovzdať na stránky kontroly [Human-in-the-Loop](./human-in-the-loop.md), keď [Agent Node](../nodes/agent-node.md) vyžaduje schválenie, pričom vetva `review` agenta odosiela upozornenia do iných kanálov. Použite to na interné nástroje, chatboty pre zákazníkov a AI formuláre.

Pozri tiež [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) a [Drive](./drive.md).

### [File Generation](./file-generation.md)

Skills dokážu počas vykonávania generovať súbory ako PDF, DOCX, CSV, JSON a obrázky zápisom do pracovného priestoru `_OUTPUT_DIR`. Heym tieto súbory automaticky zachytí, uloží a sprístupní metadata na stiahnutie pod `_generated_files`, ktoré je potom možné spravovať pomocou [Drive node](../nodes/drive-node.md) alebo prezerať na karte [Drive](../tabs/drive-tab.md).

Pozri tiež [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) a [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive je zdieľaná vrstva úložiska a zdieľania pre súbory generované skillmi. Umožňuje vám prehliadať súbory, vytvárať verejné alebo heslom chránené odkazy, uplatňovať expiráciu a limity sťahovania, zdieľať súbory iba na čítanie s vašimi tímami a spravovať tieto súbory programovo pomocou [Drive node](../nodes/drive-node.md) alebo manuálne na karte [Drive](../tabs/drive-tab.md).

Pozri tiež [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) a [Portal](./portal.md).
### [Zabezpečenie](./security.md)

Heym presadzuje politiku hesiel (dĺžka, veľké písmená, malé písmená, číslice), ukladá prístupové tokeny do HttpOnly cookies a pri použití rotuje refresh tokeny. Obmedzovanie rýchlosti sa uplatňuje na prihlásenie, registráciu a prihlásenie do [Portálu](./portal.md). [Prihlasovacie údaje](./credentials.md) sú šifrované v pokoji pomocou AES-256 (Fernet). API kľúč [MCP](../tabs/mcp-tab.md) sa používa na autentifikáciu klienta; bezpečnosť obsahu je dostupná prostredníctvom [Guardrails](./guardrails.md) na uzloch [LLM](../nodes/llm-node.md) a [Agent Node](../nodes/agent-node.md). [Execution Tokens](./execution-tokens.md) poskytujú JWT s rozsahom pre jednotlivé workflowy pre externých volajúcich.

Pozri tiež [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portál](./portal.md) a [Prihlasovacie údaje](./credentials.md).

### [Single Sign-On](./sso.md)

Heym autentifikuje používateľov voči akémukoľvek externému poskytovateľovi OpenID Connect – Keycloak, Okta, Entra ID, Auth0, Google – nakonfigurovanému za behu v časti **Settings → SSO** správcom inštancie uvedeným v `HEYM_ADMIN_EMAILS`. Zadáva sa iba URL adresa vydavateľa a prihlasovacie údaje klienta; každý endpoint pochádza z discovery dokumentu poskytovateľa, takže žiadny poskytovateľ nie je pevne zakódovaný. Prihlásenie používa Authorization Code s PKCE a ID token sa overuje voči zverejneným kľúčom poskytovateľa. Účty sa mapujú najprv podľa `(issuer, subject)` a následne podľa overeného e-mailu, pričom voliteľné automatické vytváranie účtov je obmedzené na allowlist e-mailových domén. Prihlásenie heslom zostáva dostupné popri SSO a možno ho vypnúť po úspešnom teste pripojenia, pričom účty v `HEYM_ADMIN_EMAILS` sú vyňaté, aby nesprávne nakonfigurovaný poskytovateľ nemohol uzamknúť inštanciu.

Pozri tiež [Settings](./user-settings.md), [Zabezpečenie](./security.md) a [Audit Logging](./audit.md).

### [Rozloženie záťaže](./cluster.md)

Nasmerujte druhú inštanciu Heym na tú istú databázu a pripojí sa ako worker. Beh na pozadí – cron, webhooky, volania nástrojov MCP, chat triggery – sa rozdeľuje medzi inštancie podľa percentuálneho podielu, ktorý nastaví správca inštancie v časti **Settings → Instances**, pričom stav každej inštancie, latencia databázy a verzia sú v jednej tabuľke. Inštancie spolu nikdy nekomunikujú: prácu prenáša Postgres, takže worker nepotrebuje otvorený port ani cestu späť k hlavnej inštancii. Práca, ktorá sa dotýka lokálnych súborov, pracovného priestoru coding-agenta alebo nainštalovaného pluginu, vždy beží na hlavnej inštancii a panel uvádza, aký podiel za posledných 24 hodín to predstavovalo, aby prevádzkovateľ videl, kedy percentá nepomôžu. Každé spustenie v histórii uvádza inštanciu, ktorá ho vykonala, a oba dialógy histórie umožňujú filtrovať podľa nej.

Pozri tiež [Settings](./user-settings.md), [Spustenia](../tabs/traces-tab.md) a [Analytics](../tabs/analytics-tab.md).

### [Third-Party Integrations](./integrations.md)

Heym sa pripája k externým službám prostredníctvom prihlasovacích údajov uložených v karte [Prihlasovacie údaje](../tabs/credentials-tab.md) (šifrované v pokoji). Podporované typy zahŕňajú OpenAI, Google, Decision Model pre [uzol Decision](../nodes/decision-node.md), Model Router pre automatický výber modelu (pozri nižšie), GitHub pre [uzol GitHub](../nodes/github-node.md) a integrácie MCP, Jira pre [uzol Jira](../nodes/jira-node.md), Notion pre [uzol Notion](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP pre [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header a FlareSolverr pre [Crawler](../nodes/crawler-node.md). Každý typ dokumentuje povinné polia; prihlasovacie údaje možno zdieľať s používateľmi alebo [tímami](./teams.md) a odkazovať na ne podľa názvu v uzloch alebo ako `$credentials.Name` vo výrazoch.

### Model Router (Auto Model)

Prihlasovací údaj **Model Router** vyberá model pre každú požiadavku namiesto toho, aby obsahoval kľúč. Ukladá prihlasovací údaj rozhodovacieho modelu plus zoznam vašich existujúcich prihlasovacích údajov OpenAI/Google/Custom, pričom každý má kritériá určujúce, kedy sa má použiť, a zobrazuje sa v každom výbere modelu s jediným modelom s názvom **Auto**.

Spustenia, canvas Execution Log a Span View zobrazujú obe časti voľby, napríklad `Auto Model / GPT-5`, pričom náklady zostávajú priradené modelu, ktorý bežal. Auto Model nemožno kombinovať s Responses API, Batch režimom ani výstupom obrázkov. Úplné správanie nájdete v časti [Prihlasovacie údaje](./credentials.md).

Pozri tiež [Prihlasovacie údaje](./credentials.md), [Credentials Sharing](./credentials-sharing.md) a [Tímy](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blokujú nebezpečné alebo nechcené používateľské správy skôr, než dosiahnu [LLM](../nodes/llm-node.md) alebo [Agent Node](../nodes/agent-node.md). Povoľte ich pre jednotlivé uzly a vyberte kategórie na blokovanie (napr. násilie, nenávistné prejavy, sexuálny obsah, sebapoškodzovanie, obťažovanie, nezákonná činnosť). Nastavte citlivosť (nízka, stredná, vysoká). Pri aktivácii uzol vyhodí chybu, ktorú môžete zachytiť pomocou [Error Handler](../nodes/error-handler-node.md). Detekcia používa moderation API poskytovateľa alebo klasifikáciu LLM v závislosti od typu prihlasovacích údajov.

Pozri tiež [Zabezpečenie](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) a [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise zahŕňa komerčné licencovanie, profesionálnu podporu a služby nasadenia pre tímy, ktoré prevádzkujú Heym v produkcii. Obsahuje pomoc s architektúrou workflowov, onboarding, usmernenia pre Kubernetes a škálovanie, prioritnú podporu a vývoj na mieru okolo pokročilých funkcií, ako sú [uzol Agent](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Paralelné vykonávanie](./parallel-execution.md) a [Portal](./portal.md).

Pozrite si tiež [Prevádzka a nasadenie](../getting-started/running-and-deployment.md), [Bezpečnosť](./security.md) a [Tímy](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work je druhé rozhranie pre obchodné tímy postavené nad Heym. Ľudia opíšu úlohu, odpovedia na niekoľko otázok a získajú otestovaný workflow, potom pracujú zo stránok, schválení a zoznamu Aktivita, kde má každé spustenie svoj názov. Správcovia inštancie ho pripoja v **Nastavenia → Heym Work** pomocou jeho adresy a integračného kľúča; má vlastnú licenciu od tímu Heym.

Pozrite si tiež [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) a [Human-in-the-Loop](./human-in-the-loop.md).

---

## Karty dashboardu

### [Workflowy](../tabs/workflows-tab.md)

Karta Workflowy je predvoleným zobrazením dashboardu. Zobrazuje dvojpanelový zoznam: workflowy a priečinky ako kompaktné riadky vľavo a náhľad vybraného workflowu vpravo s jeho triggerom, posledným spustením a krokmi, plus Open Workflow a Run Now. Každý riadok nesie stavový štítok (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), podľa ktorého možno filtrovať pomocou rozbaľovacieho zoznamu Status. Workflow bez trigger uzla je označený podľa toho, ako sa spustilo jeho posledné spustenie – API pre HTTP volanie, SubWorker pre nadradený workflow, Portal pre jeho verejný chat – a zostáva Manual, kým sa nespustí. Priečinky a podpriečinky zabezpečujú [organizáciu](./workflow-organization.md). Vytvárajte workflowy pomocou New Workflow, pretiahnutím JSON [importujte](./download-import.md) a upravujte alebo odstraňujte pomocou akcií riadka. Workflowy možno presúvať medzi priečinkami; odstránenie je naplánované (kôš) pred trvalým odstránením.

Pozrite si tiež [Organizácia workflowov](./workflow-organization.md), [Download & Import](./download-import.md) a [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Agentická kanbanová tabuľa, kde karty predstavujú trvalé úlohy. Nakonfigurujte každý stĺpec pomocou usporiadaného reťazca workflowov; presunutie karty do stĺpca spustí reťazec s úplným kontextom karty (obsah, komentáre, história, predchádzajúce výstupy). Výsledky sa zapisujú späť do karty – zelená pri úspechu, červená pri zlyhaní, jantárová počas behu. Následné kolá znovu spúšťajú reťazec aktuálneho stĺpca so všetkým, čo sa doteraz nahromadilo, čo poháňa iteratívne plánovanie. Spustenia sa zaznamenávajú v [Histórii spustení](./execution-history.md) so zdrojom triggera `board`. Kým je spustenie karty aktívne, **Open live** otvorí presne toto spustenie na animovanom plátne s prírastkovými Debug logmi.

Pozrite si tiež [Workflowy](../tabs/workflows-tab.md), [História spustení](./execution-history.md) a [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Šablóny](../tabs/templates-tab.md)

Karta Šablóny vám umožňuje ukladať a opätovne používať šablóny workflowov (celé workflowy) a šablóny uzlov (jednotlivé nakonfigurované uzly). Vytvárajte šablóny workflowov z editora (Share as Template) a šablóny uzlov kliknutím pravým tlačidlom na uzol. Prehliadajte podľa viditeľnosti (Everyone alebo konkrétni používatelia/[tímy](./teams.md)), použite šablónu na vytvorenie nového workflowu alebo pridanie uzla na plátno a spravujte svoje zdieľané šablóny.

Pozrite si tiež [Workflowy](../tabs/workflows-tab.md), [Tímy](./teams.md) a [Funkcie plátna](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Premenné](../tabs/global-variables-tab.md)

Karta Premenné spravuje [Global Variable Store](./global-variables.md). Vytvárajte, upravujte a odstraňujte globálne premenné; nastavte názov, hodnotu a typ hodnoty (Auto, String, Number, Boolean, Array, Object). Premenné sú viazané na používateľa a pretrvávajú medzi spusteniami. Odkazujte na ne v ľubovoľnom [výraze](./expression-dsl.md) workflowu ako `$global.variableName`. Premenné možno zdieľať s inými používateľmi alebo [tímami](./teams.md).

Pozrite si tiež [Globálne premenné](./global-variables.md), [uzol Variable](../nodes/variable-node.md) a [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Karta Chat predstavuje dlhodobo bežiace agentné rozhranie Heym na ovládanie pracovného priestoru prostredníctvom konverzácie. Vyberte [prihlasovacie údaje](./credentials.md) a model, potom požiadajte Chat o zodpovedanie otázok, kontrolu definícií workflowov, spustenie existujúcich workflowov, zhrnutie spustení a plánov, nahlásenie histórie spustení jedného workflowu (počet spustení, prehľad stavov, posledné spustenie a na požiadanie podrobnosti jedného spustenia), nahlásenie, ktoré spustenia práve prebiehajú (s uplynutým časom, aktuálnym uzlom a odkazom na každé živé spustenie), vyriešenie čakajúcich manuálnych kontrol, vytváranie a úpravu workflowov pomocou rovnakého AI Builder engine, aký sa používa v editore, alebo pridávanie kariet na kanbanové nástenky prirodzeným jazykom. Nové karty vždy začínajú v prvom stĺpci vybranej nástenky; ak je k dispozícii niekoľko násteniek a žiadna nebola určená, Chat pred vytvorením karty zobrazí výber nástenky.

Chat pokračuje v behu na backende aj po zatvorení prehliadača. Kým odpoveď streamuje, môžete posielať ďalšie správy; Heym ich ukladá do frontu podloženého databázou, umožňuje vám upravovať alebo odstraňovať zaradené správy pred ich spustením a spúšťa ich v poradí, keď sa aktuálna odpoveď dokončí. Ak asistent potrebuje podrobnosti plánovania a vráti doplňujúce otázky, front sa pozastaví, kým na tieto otázky neodpoviete, a potom pokračuje po odpovedi na plánovanie.

Odpovede streamujú s markdownom, inline obrázkami, náhľadovými kartami workflowov, rozbaľovacími kartami volaní nástrojov, využitím kontextu a automatickou kompresiou kontextu. Chat podporuje prílohy, hlasový vstup, prehrávanie nahlas, akcie kopírovania, rýchle prompty, User Rules z [Settings](./user-settings.md) a [globálne premenné](./global-variables.md) ako kontext.

Pozri tiež [AI Assistant](./ai-assistant.md), [Prihlasovacie údaje](./credentials.md) a [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Prihlasovacie údaje](../tabs/credentials-tab.md)

Karta Prihlasovacie údaje spravuje API kľúče a tajné údaje používané uzlami. Pridajte prihlasovacie údaje podľa typu (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere atď.), pomenujte ich a odkazujte na ne v uzloch workflowu. Upravujte alebo odstraňujte z karty; zdieľajte s používateľmi prostredníctvom e-mailu alebo s [tímami](./teams.md). Všetky hodnoty sú šifrované v pokoji a v UI maskované.

Pozri tiež [Prihlasovacie údaje](./credentials.md), [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) a [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Vektorové úložiská](../tabs/vectorstores-tab.md)

Karta Vektorové úložiská spravuje vektorové úložiská používané uzlami [RAG](../nodes/rag-node.md). Vytvorte úložisko s názvom a [prihlasovacími údajmi](./credentials.md) vektorového úložiska — *RAG: Qdrant + OpenAI* (externý Qdrant) alebo *RAG: Psql + OpenAI* (vlastný Postgres Heym cez pgvector), ktoré určujú backend úložiska — voliteľne nastavte názov kolekcie a potom nahrajte dokumenty (PDF, TXT atď.). Spravujte obsah (zobrazujte, odstraňujte zdroje), upravujte podrobnosti úložiska a zdieľajte úložiská s používateľmi. V uzle [RAG](../nodes/rag-node.md) vyberte Database, zvoľte vektorové úložisko a spustite operácie insert, upsert, delete alebo search.

Pozri tiež [Qdrant RAG](../nodes/rag-node.md), [Prihlasovacie údaje](./credentials.md) a [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

Karta MCP konfiguruje integráciu Model Context Protocol. Heym podporuje dva režimy:

**Predvolený server** – Jediný endpoint na adrese `/api/mcp/sse` sprístupňuje všetky workflowy s povoleným MCP. Zobrazte a obnovte svoj API kľúč, skopírujte pripravený JSON pre klienta, pripojte Cursor jedným kliknutím alebo postupujte podľa procesu nastavenia Claude s automatickou registráciou OAuth.

**Pomenované servery** – Vytvorte viacero izolovaných MCP endpointov, každý s vlastnou URL založenou na UUID (`/api/mcp/servers/{uuid}/sse`) a nezávislým API kľúčom. Priraďte konkrétne workflowy ku každému serveru, aby rôzni AI klienti alebo tímy videli iba nástroje, ktoré potrebujú. Každý pomenovaný server podporuje rovnaké metódy autentifikácie (API kľúč, Claude OAuth) a má vlastné skratky Copy JSON a Add to Cursor. Oba endpointy podporujú SSE transport (GET) a Streamable HTTP transport (POST). Prepnutie workflowu v rámci pomenovaného servera ho presunie na začiatok priradeného zoznamu, aby zmenený riadok zostal v zobrazení.

**Nástroj Heym chat** – Každý režim môže tiež sprístupniť engine [Chat](../tabs/chat-tab.md) ako jediný nástroj `heym_chat`, prepínaný pre každé rozhranie s vlastnými prihlasovacími údajmi LLM a modelom (predvyplneným z vášho preferovaného modelu v [Settings](./user-settings.md)). MCP klient pošle jednu správu `message` v prirodzenom jazyku a engine urobí zvyšok: vytváranie workflowov v režime zostavovania (uloženie, až päť testovacích spustení, oprava a overenie), spúšťanie workflowov, analytiku, spustenia, živý stav behu, plány, nástenky a karty, tímy, globálne premenné, vyhľadávanie v dokumentácii a rozhodnutia s človekom v procese. Schopnosti pridané do Chat neskôr sú dostupné prostredníctvom rovnakého nástroja bez ďalšej registrácie. Každé volanie je uložené v histórii karty Chat ako konverzácia označená zástrčkou a vracia `conversation_id`, ktoré môže klient poslať späť na pokračovanie vlákna.

Pozrite tiež [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) a [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Karta Traces zobrazuje stopy spustení [LLM](../nodes/llm-node.md). Hlavička so štatistikami nad zoznamom sumarizuje zvolený časový rozsah pomocou KPI kariet (Calls, Tokens, Cost, Avg Latency, Error %) a troch grafov — Tokens by Model, Cost by Model a Calls Over Time (skladaný úspech vs chyba). Jediný selektor **Time range** (1h / 24h / 7d / 30d / All; predvolene 7 dní) filtruje grafy aj zoznam spoločne. Cost sa vypočítava z používateľskej [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table); modely bez cien sa zobrazia ako inline upozornenie s odkazom na ňu. Otvorte ľubovoľnú stopu a zobrazte payloady požiadavky a odpovede, časový rozpis (llm_ms, tools_ms, mcp_list_ms), volania nástrojov (názov, argumenty, výsledok) a zahrnuté zručnosti. Rozbalené udalosti zobrazujú JSON — vrátane MCP a JSON-RPC payloadov — ako rozbaľovací strom s prvou úrovňou otvorenou predvolene; **Tree / Raw** prepína späť na pôvodný text a neplatný JSON zostáva čitateľný. Použite stopy na ladenie správania [Agent Node](../nodes/agent-node.md) a [LLM](../nodes/llm-node.md) a na kopírovanie alebo export payloadov.

Pozrite tiež [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) a [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Upozornenia](../tabs/alerts-tab.md)

Karta Upozornenia definuje prahové podmienky v rámci časového okna a informuje Vás, keď sú prekročené. Štyri typy upozornení pokrývajú otázky, ktoré si operátori skutočne kladú: **prah chýb** (zlyhalo to viac ako N-krát v okne), **trvanie workflow** (spomalili sa spustenia, merané ako maximum, priemer alebo p95), **náklady na token / USD** (prekročili výdavky rozpočet, vyhodnotené prostredníctvom rovnakej cenovej tabuľky ako [Spustenia](../tabs/traces-tab.md)) a **počet spustení** (bežalo to oveľa častejšie, než by malo). Každý typ sa vyhodnocuje v rámci okna, ktoré si zvolíte, nikdy nie na základe jedinej udalosti, pretože jedno zlyhané spustenie je šum a náraz je incident. Upozornenia sledujú jeden workflow alebo každý workflow, ku ktorému máte prístup.

Sprievodca v piatich krokoch prevedie používateľa cez typ, rozsah, podmienku, reakciu a kontrolu. Krok Kontrola najprv **otestuje** podmienku spätne a hlási, ako často by sa bola spustila za posledných 24 hodín až 7 dní, takže príliš nízky prah sa zachytí pred uložením, a nie až po tom, čo niekomu zavolá. Opíšte, čo chcete, prirodzeným jazykom a AI vyplní každý krok, ktorý dokáže, pričom označí svoje odhady; čiastočná požiadavka stále posunie sprievodcu vpred a otvorí sa na prvom kroku, ktorý ešte vyžaduje rozhodnutie, namiesto toho, aby ste museli začínať odznova. Predvolene sa upozornenie spustí raz a zostane ticho, kým sa metrika nezotaví; namiesto toho ho môžete nechať opakovať v intervale.

V kroku reakcie môže upozornenie vytvoriť a priradiť nový workflow, ktorý sa spustí pri jeho aktivácii, použiť už existujúci alebo nerobiť nič. Payload pri spustení nesie pozorovanú hodnotu, prah, okno a workflowy, ktoré prispeli k číslu, čím sa upozornenia dostávajú do Slacku, e-mailu alebo Telegramu pomocou uzlov, ktoré už máte. História spustení zaznamenáva, čo platilo v momente, keď sa každé upozornenie spustilo, a uchováva sa 90 dní; potvrdenie spustenia zmení odznak z Firing na Acknowledged bez toho, aby predstieralo, že podmienka sa vyriešila. Karta [Chat](../tabs/chat-tab.md) dokáže odpovedať, aké upozornenia existujú a prečo alebo kedy sa niektoré spustilo. Upozornenia je možné zdieľať s používateľmi a [tímami](../tabs/teams-tab.md).

Pozri tiež [Analytika](../tabs/analytics-tab.md), [Spustenia](../tabs/traces-tab.md) a [História spustení](./execution-history.md).

### [Analytika](../tabs/analytics-tab.md)

Karta Analytika zobrazuje metriky spustení a trendy. Súhrnné štatistiky zahŕňajú celkový počet spustení, mieru úspešnosti, mieru chýb, rozpis latencie a celkový **Ušetrený čas** (súčet odhadovaných ušetrených minút na spustenie každého workflow × jeho úspešné spustenia). Najpoužívanejšie uvádza ten istý súčet pre každý workflow. Vyberte základný časový rozsah (24h, 7d, 30d alebo všetko), voliteľne filtrujte podľa workflow a potom potiahnutím cez ľubovoľný graf prejdite do zvoleného rozsahu dátumov. Grafy a tabuľky workflowov sa obnovia podľa výberu a automatické obnovenie udržiava metriky aktuálne. Doplňuje [Históriu spustení](./execution-history.md) a zobrazenie [Plány](../tabs/scheduled-tab.md), keď potrebujete minulé výsledky aj nadchádzajúce spustenia.

Pozri tiež [História spustení](./execution-history.md), [Plány](../tabs/scheduled-tab.md) a [Hodnotenia](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Karta Dashboard je priestor v štýle Grafany, kde vytvárate mriežky widgetov s grafmi, pričom každý je vykreslený z vlastného skrytého workflow Heym. Uchovávajte toľko dashboardov, koľko potrebujete, a každý zdieľajte s používateľmi alebo tímami, iba na čítanie alebo s možnosťou úprav; widgety vždy bežia s prihlasovacími údajmi vlastníka, takže každý vidí rovnaké dáta. Opíšte metriku prirodzeným jazykom a AI vygeneruje widget, alebo pridajte jeden manuálne a vyberte typ grafu s náhľadom na vzorových dátach: stĺpcový, čiarový, plošný, koláčový, tabuľka, číselný, gauge, bodový, proporčný, stĺpcový gauge, text alebo HITL. HITL je karusel Vašich čakajúcich ľudských kontrol. Hlavička zobrazuje `1/n pending`. Názov workflow otvorí toto spustenie na plátne. **Approve**, **Request changes** a **Reject** ho vyriešia a ikona histórie vedľa názvu widgetu otvorí toto spustenie v dialógu histórie na tej istej stránke. Widgety ukladajú svoje výsledky do vyrovnávacej pamäte, dajú sa doladiť pomocou AI (každá zmena sa uloží do [Histórie úprav](./edit-history.md)), klonovať spolu s ich kompletným workflow, preusporiadať pomocou Tidy up a v režime úprav presúvať alebo meniť veľkosť. Tabuľky môžu zobrazovať štítky stavu a prepájať svoje riadky s detailným panelom, ktorý číta záznam kliknutého riadka ako `$page.record`, a widget Run spúšťa workflow z panela: na presunutom súbore, so vstupnými poľami alebo tlačidlom Spustiť. Keďže každý widget je workflow, akékoľvek dáta, ktoré dokážete získať — volanie [HTTP](../nodes/http-node.md), dotaz [BigQuery](../nodes/bigquery-node.md), vyhľadávanie [RAG](../nodes/rag-node.md) alebo výstup [LLM](../nodes/llm-node.md) — sa môžu stať grafom. Nastavenia widgetu HITL ho môžu zúžiť na kontroly jedného workflowu alebo na krok agenta či schválenia Slack v ňom; takýto widget ich zobrazuje všetkým, ktorí môžu daný workflow otvoriť, a je skrytý pre každého, kto nemôže. [Chat](../tabs/chat-tab.md) a nástroj MCP `heym_chat` uvádzajú vaše dashboardy s ich widgetmi, hovoria, na ktorom dashboarde sa workflow nachádza, pridávajú nový widget (najprv prázdny, ktorého workflow Chat potom zostaví a otestuje), umiestňujú existujúci workflow ako widget na dashboard, premenúvajú alebo mažú widgety a usporadúvajú rozloženie, rovnako ako to robí tlačidlo Usporiadať.

Pozri tiež [Uzol Chart Output](../nodes/chart-output-node.md), [Analytika](../tabs/analytics-tab.md) a [História spustení](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>
### [Hodnotenia](../tabs/evals-tab.md)

Karta Hodnotenia (na `/evals`) vám umožňuje vytvárať sady hodnotení, pridávať alebo generovať testovacie prípady, optimalizovať prompt sady a spúšťať hodnotenia voči workflowom [uzla Agent](../nodes/agent-node.md). Vyberte jeden alebo viac modelov, zvoľte metódu skórovania (Exact Match, Contains alebo LLM-as-Judge), voliteľne nechajte samostatný model alebo [uzol Rozhodnutie](../nodes/decision-node.md) posudzovať odpovede LLM-as-Judge, nastavte počet spustení na test (plus temperature a reasoning effort pre Exact Match a Contains), a potom porovnajte úspešnosť/neúspešnosť a výstupy jednotlivých modelov. Prezrite si históriu spustení minulých hodnotení vrátane použitého sudcu, znovu spustite hodnotenie s rovnakým sudcom, exportujte ho ako JSON a skontrolujte základné správanie v [Spusteniach](../tabs/traces-tab.md).

**Sada agenta** namiesto toho kontroluje jeden uzol agenta: zobrazuje základnú latenciu agenta, náklady v USD, tokeny a volania nástrojov z jeho skutočných behov, umožňuje označiť každý nástroj, nástroj MCP, podagenta, čiastkový workflow alebo zručnosť ako prvok, ktorý agent musí alebo nesmie volať, nastavuje horné limity 20 % nad základnú úroveň, spúšťa workflow zvolený počet ráz so vstupmi z posledného behu alebo so vstupmi napísanými AI a hodnotí každý beh s uvedením dôvodu zlyhania. Výber sád uvádza oba druhy s ich typom a je v ňom možné vyhľadávať, a správa [Workflow Analysis](./workflow-analysis.md) navrhuje sadu pre workflowy s uzlami agenta alebo LLM.

Pozri tiež [uzol Agent](../nodes/agent-node.md), [Spustenia](../tabs/traces-tab.md) a [Históriu spustení](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Pozrite si demo Hodnotení</a></p>

### [Tímy](../tabs/teams-tab.md)

Karta Tímy vám umožňuje vytvárať a spravovať tímy. Vytvorte tím, pridajte členov prostredníctvom e-mailu a odstráňte členov (tvorcu nie je možné odstrániť). Zdieľajte [workflowy](../tabs/workflows-tab.md), [šablóny](../tabs/templates-tab.md), [prihlasovacie údaje](../tabs/credentials-tab.md), [premenné](../tabs/global-variables-tab.md), [vektorové úložiská](../tabs/vectorstores-tab.md) a [súbory Drive](../tabs/drive-tab.md) s tímami prostredníctvom príslušných dialógov zdieľania; všetci členovia tímu získajú prístup. Upravte názov a popis tímu alebo tím odstráňte (odstránia sa všetky zdieľania tímu).

Pozri tiež [Tímy](./teams.md), [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) a [Organizáciu workflowov](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Pozrite si demo Tímov</a></p>

### [Plány](../tabs/scheduled-tab.md)

Karta Plány zobrazuje všetky aktívne [Cron](../nodes/cron-node.md) workflowy vo vizuálnom kalendári. Prepínajte medzi zobrazením dňa, týždňa a mesiaca a zistite, kedy sú vaše automatizácie naplánované na spustenie, a potom sa vráťte k príslušnému [workflowu](../tabs/workflows-tab.md), keď potrebujete upraviť plán.

Pozri tiež [Cron](../nodes/cron-node.md), [Analytiku](../tabs/analytics-tab.md) a [Históriu spustení](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Pozrite si demo Plánov</a></p>

### [Logy](../tabs/logs-tab.md)

Karta Logy zobrazuje logy Docker kontajnerov pre stack Heym (backend, frontend, PostgreSQL). Vyberte kontajner (kontajnery), filtrujte podľa úrovne logu (All, INFO, WARNING, ERROR, DEBUG) a vyhľadávajte v logoch. Použite ju na ladenie a riešenie problémov. Pre logy spustenia workflowov (výsledky uzlov, výstupy) použite namiesto toho [Históriu spustení](./execution-history.md), [Spustenia](../tabs/traces-tab.md) alebo panel Debug v editore.

Pozri tiež [Históriu spustení](./execution-history.md), [Spustenia](../tabs/traces-tab.md) a [Funkcie plátna](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Pozrite si demo Logov</a></p>

### [Dátová tabuľka](../tabs/datatable-tab.md)

Karta Dátová tabuľka vám umožňuje vytvárať a spravovať štruktúrované dátové tabuľky v rámci Heym. Definujte typované stĺpce (string, number, boolean, date, JSON), spravujte riadky pomocou inline úprav dvojklikom, importujte/exportujte CSV a zdieľajte tabuľky s používateľmi alebo [tímami](./teams.md) s právami na čítanie/zápis. Použite [uzol Dátová tabuľka](../nodes/datatable-node.md) na programový prístup k tabuľkám vo workflowoch. Pripnutá sekcia **Systémové tabuľky** v hornej časti hostuje **Tabuľku nákladov LLM**: zobrazenie cien jednotlivých modelov s pevnou schémou, naplnené z Helicone na pozadí (24-hodinová TTL, manuálne Obnovenie), kde každý používateľ môže prepísať ceny alebo pridať vlastné riadky pre modely, ktoré Helicone neuvádza. Tieto pravidlá cien poháňajú KPI nákladov a graf nákladov jednotlivých modelov na karte [Spustenia](../tabs/traces-tab.md).

Pozri tiež [uzol Dátová tabuľka](../nodes/datatable-node.md), [Spustenia](../tabs/traces-tab.md), [Štruktúru workflowu](./workflow-structure.md) a [Tímy](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Pozrite si demo Dátovej tabuľky</a></p>
### [Drive](../tabs/drive-tab.md)

Karta Drive zobrazuje všetky súbory vygenerované skillmi naprieč vašimi workflowmi. Zobrazuje zoznam jednotlivých súborov s názvom, typom, veľkosťou, zdrojovým uzlom, dátumom vytvorenia a stavom zdieľania v rámci tímu a poskytuje ovládacie prvky na vyhľadávanie, autentifikované sťahovanie, zdieľanie, mazanie a stránkovanie. Ide o dashboardovú časť dopĺňajúcu [File Generation](./file-generation.md), referenciu [Drive](./drive.md) a [uzol Drive](../nodes/drive-node.md).

Pozrite si tiež [Drive](./drive.md), [File Generation](./file-generation.md) a [uzol Drive](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Pozrite si ukážku Drive</a></p>

### [Spolupráca na plátne](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
