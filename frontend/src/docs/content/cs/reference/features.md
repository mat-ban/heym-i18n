# Kompletní sada funkcí Heym

Komplexní přehled všech možností Heym. Každá sekce popisuje funkci nebo koncept v několika větách.

---

## Začínáme

### [Úvod](../getting-started/introduction.md)

Heym je infrastruktura pro provoz a správu AI agentů v produkci. Své agentní systémy sestavujete na vizuálním canvasu a provozujete je s jistotou: orchestrujte agenty, automatizujte obchodní procesy, kontrolujte každé spuštění a udržujte lidi pod kontrolou na vlastní infrastruktuře. Podporuje vizuální workflow, AI poháněné uzly ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [AI Assistant](./ai-assistant.md), integrace ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), příchozí e-maily přes [IMAP Trigger](../nodes/imap-trigger-node.md), odchozí [Send Email](../nodes/send-email-node.md)), plánování pomocí [Cron](../nodes/cron-node.md) a chatovací portály [Portal](./portal.md) pro koncové uživatele.

Viz také [Základní koncepty](../getting-started/core-concepts.md), [Typy uzlů](./node-types.md) a [Integrace třetích stran](./integrations.md).

### [Proč Heym](../getting-started/why-heym.md)

Proč Heym provází životním cyklem agenta (sestavení, orchestrace, provoz, sledování, evaluace, kontrola, zpřístupnění) a ukazuje, co jeden self-hosted runtime zvládá v každé fázi. Zahrnuje uzel [LLM](../nodes/llm-node.md) a [Agent Node](../nodes/agent-node.md) s voláním nástrojů, Python nástroji, připojeními [MCP](../tabs/mcp-tab.md), dovednostmi a multi-agentní orchestrací; triggery, opakování a [rozložení zátěže](./cluster.md); [Spuštění](../tabs/traces-tab.md) s cenou v USD za běh a exportem OpenTelemetry; [Evaluace](../tabs/evals-tab.md); [kontrolní body lidského schválení](./human-in-the-loop.md), guardrails, SSO a auditní stopu; a REST, MCP a Portal endpointy. Stránku uzavírá srovnání schopností s n8n, Zapier a Make.com.

Viz také [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) a [Architektura agenta](./agent-architecture.md).

### [Rychlý start](../getting-started/quick-start.md)

Uveďte své první workflow do provozu během několika minut: vytvořte workflow na kartě [Workflows](../tabs/workflows-tab.md), přidejte uzel [Input](../nodes/input-node.md), uzel [LLM](../nodes/llm-node.md) a uzel [Output](../nodes/output-node.md) a poté je propojte. Nakonfigurujte [LLM](../nodes/llm-node.md) s přihlašovacími údaji a nastavte `userMessage` na `$input.text`; pomocí Run nebo [AI Assistant](./ai-assistant.md) spouštějte nebo generujte workflow přirozeným jazykem.

Přirozeně se pojí s [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) a [Expression DSL](./expression-dsl.md).

### [Základní koncepty](../getting-started/core-concepts.md)

Workflow jsou orientované grafy uzlů propojených hranami; spuštění proudí z trigger uzlů ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) přes zpracovávající uzly až k uzlům [Output](../nodes/output-node.md). Každý uzel má typ, data (konfiguraci) a vstupy/výstupy; hrany definují tok dat. Uzly odkazují na data z předchozích uzlů pomocí výrazů [Expression DSL](./expression-dsl.md), jako je `$nodeLabel.field`; nezávislé uzly se spouštějí automaticky [paralelně](./parallel-execution.md).

Viz také [Triggers](./triggers.md), [Paralelní spuštění](./parallel-execution.md) a [Struktura workflow](./workflow-structure.md).

### [Provoz a nasazení](../getting-started/running-and-deployment.md)

Heym poskytuje `run.sh` pro lokální vývoj (databáze v Dockeru, FastAPI backend, Vite frontend) a `deploy.sh` pro produkci s Docker Compose. Oba používají soubor `.env`; klíčové proměnné zahrnují `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` a `ALLOW_REGISTER`. Vývoj běží na konfigurovatelných portech frontendu a backendu; produkce obsluhuje API pod `/api` prostřednictvím kontejneru frontendu.

Viz také [Zabezpečení](./security.md), [Enterprise](./enterprise.md) a [Nastavení](./user-settings.md).

### [Migrace do Heym](../getting-started/migrate-to-heym.md)

Nástroj AI Convert převede workflow z jiné platformy (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) nebo popis v přirozeném jazyce na workflow Heym, streamovaně živě na canvas a připravené ke [stažení a importu](./download-import.md). Provede AI bezpečnostní kontrolu a poté vygeneruje DSL s nastavenými limity vstupu a rychlosti. Otevřete jej na [heym.run/convert](https://heym.run/convert).

Viz také [Rychlý start](../getting-started/quick-start.md), [Stažení a import](./download-import.md) a [AI Assistant](./ai-assistant.md).

---

## Uzly

### Triggers
#### [Vstupní uzel](../nodes/input-node.md)

Vstupní uzel je vstupním bodem pro workflow, které přijímají data od uživatele nebo volajícího API. Podporuje jedno nebo více vstupních polí a zpřístupňuje metadata požadavku (hlavičky, parametry dotazu). K polím těla přistupujte přes `$nodeLabel.body.fieldKey`, k hlavičkám přes `$nodeLabel.headers` a k dotazu přes `$nodeLabel.query`.

Přirozeně se kombinuje s uzly [Podmínka](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) a [Výstup](../nodes/output-node.md). Informace o odkazech na payload a přístupu k polím naleznete v [Expression DSL](./expression-dsl.md) a [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Uzel Cron spouští workflow podle plánu pomocí standardního cron výrazu s pěti poli. Není vyžadován žádný vstup od uživatele – workflow se spouští automaticky v zadaných časech (např. každou hodinu, denně, každých 15 minut). Výstupem je trigger událost bez payloadu.

Viz také [Triggers](./triggers.md), [Čekání](../nodes/wait-node.md) a [Historie spuštění](./execution-history.md) pro plánovaná a zpožděná spuštění.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Uzel IMAP Trigger pravidelně kontroluje schránku v konfigurovatelném minutovém intervalu a pro každý nově zjištěný e-mail spustí workflow. Na výstupu poskytuje zpracované hlavičky, seznamy odesílatelů a příjemců, těla ve formátu prostého textu a HTML, metadata příloh a časové razítko triggeru. Využijte jej pro třídění e-mailů podpory, směrování ze schránky do [Slack](../nodes/slack-node.md) nebo pro schvalovací toky řízené e-mailem s [Human-in-the-Loop](./human-in-the-loop.md).

Kombinuje se s uzly [Odeslat e-mail](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) a [Slack](../nodes/slack-node.md) pro zpracování příchozích zpráv a odpovědní workflow.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Uzel Heym Trigger spustí workflow, když samotný Heym publikuje platformní událost: `heym.started`, `workflow.created`, `workflow.updated` nebo `workflow.deleted`. Doručování je dávkové – každá událost publikovaná v rámci jednoho pětisekundového okna dorazí v jediném spuštění jako `$nodeLabel.events`, vždy jako pole. Každá událost je nárokována prostřednictvím jedinečného databázového omezení, takže se spustí přesně jednou pro každý odebírající uzel bez ohledu na to, kolik workerů, kontejnerů nebo strojů běží. Využijte jej pro auditní záznamy změn workflow, oznámení o nasazení a přehledy o stavu instance.

Kombinuje se s uzlem [Heym](../nodes/heym-node.md) pro vyhledání změněného workflow a s uzlem [Smyčka](../nodes/loop-node.md) pro akci při každé události.

#### [Heym](../nodes/heym-node.md)

Uzel Heym čte vlastní data Heymu prostřednictvím tří operací: `listWorkflows` vrací každé workflow, ke kterému má vlastník přístup, včetně počtu uzlů a časových razítek, `getWorkflow` vrací strukturu uzlů a hran jednoho workflow a `getExecutionHistory` vrací záznamy historie spuštění od nejnovějších, s volitelnými filtry podle stavu, časového okna a limitu, spolu s celkovými součty seskupenými podle stavu. Výsledky jsou omezeny na vlastníka workflow, ve kterém se uzel nachází, takže spuštění zahájené cronem, portálem nebo událostí vrací stejná data jako ruční spuštění. `getWorkflow` vrací úplnou konfiguraci uzlů, což umožňuje auditovat workflow na pevně zapsané klíče nebo tokeny; neodhaluje nic, co by vlastník workflow již nemohl otevřít v editoru. Není vyžadováno žádné přihlašovací údaje.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Uzel WebSocket Trigger otevírá odchozí klientské připojení k externímu WebSocket serveru a spouští workflow při událostech `onMessage`, `onConnected` nebo `onClosed`. Zpřístupňuje zpracované payloady zpráv, stav opětovného připojení, metadata uzavření a URL socketu pro navazující výrazy.

Kombinuje se s uzly [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) a [SSE Streaming](./sse-streaming.md) pro realtime integrace.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Uzel Telegram Trigger přijímá webhook aktualizace bota a okamžitě spouští workflow. Zpřístupňuje úplný payload aktualizace, primární objekt zprávy, callback dotazy, sanitizované hlavičky a časové razítko triggeru. Využijte jej pro chatboty, AI asistenty v [Telegram](../nodes/telegram-node.md) a toky řízené tlačítky.

Kombinuje se s uzly [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) a [Webhooks](./webhooks.md) pro workflow řízená botem.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Uzel Slack Trigger přijímá webhooky Slack Events API a po ověření podpisu požadavku automaticky spouští workflow. Zpřístupňuje payload události a sanitizované hlavičky pro navazující směrování, klasifikaci pomocí [LLM](../nodes/llm-node.md) a toky odpovědí.

Kombinuje se s uzly [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) a [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Uzel Discord Trigger přijímá webhooky Discord Interactions API, ověřuje Ed25519 podpisy pomocí zvolených přihlašovacích údajů `discord_trigger` a spouští workflow. Zpřístupňuje úplný payload interakce, data příkazů, sanitizované hlavičky a metadata triggeru pro navazující směrování nebo odpovědi.

Kombinuje se s uzly [Výstup](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) a [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

Uzel RabbitMQ odesílá nebo přijímá zprávy z front a exchangeů RabbitMQ. Použijte jej pro workflow řízené zprávami a zpracování událostí. Režim odesílání publikuje zprávu s volitelným zpožděním; režim příjmu funguje jako [trigger](./triggers.md), takže se workflow spustí při příchodu zprávy. Výstup obsahuje status, message_id a body.

Spolupracuje s uzly [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) a [Parallel Execution](./parallel-execution.md) pro zpracování řízené událostmi.

#### [Error Handler](../nodes/error-handler-node.md)

Uzel Error Handler se spustí automaticky, když jakýkoli uzel ve workflow selže. Nejsou potřeba žádné vstupní hrany; je spuštěn enginem. Výstup obsahuje chybovou zprávu, popisek selhaného uzlu, typ uzlu a časové razítko. Použijte jej k odesílání oznámení prostřednictvím uzlů [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) nebo [Send Email](../nodes/send-email-node.md), k logování chyb nebo k vrácení vlastních chybových odpovědí.

Jako alternativu ke zpracování chyb na canvasu může workflow také delegovat selhání na samostatné workflow — viz [Error Workflow](#error-workflow). Pokud canvas již obsahuje uzel Error Handler, error workflow se **ne**volá (lokální handler má přednost).

Běžnými cíli oznámení jsou [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) a [Send Email](../nodes/send-email-node.md); podrobnosti o spuštění lze snáze prohlížet v [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

Uzel AI Agent je uzel [LLM](../nodes/llm-node.md) s voláním nástrojů. Dokáže spouštět Python nástroje, volat připojené uzly canvasu jako nástroje, připojovat se k serverům [MCP](../tabs/mcp-tab.md), používat skills (soubory s instrukcemi a volitelné Python skripty), fungovat jako orchestrátor, který deleguje na jiné agentní uzly, a volat jiná workflow jako nástroje. Výstup je dostupný jako `$nodeLabel.text`. Volitelný přepínač **Extra Body** připojuje k každému požadavku ve smyčce volání nástrojů JSON objekt s parametry požadavku specifickými pro poskytovatele; ve výchozím stavu je vypnutý. Volitelný přepínač **Use Responses API** směruje volání modelu agenta přes Responses API, které zachovává uvažování modelu napříč voláními nástrojů, takže reasoning model si udrží svůj řetězec myšlenek během vícestupňové smyčky; ve výchozím stavu je vypnutý a funguje s OpenAI a vlastními přihlašovacími údaji.

Nástroje uzlů canvasu umožňují agentovi volat nakonfigurované uzly workflow přímo z canvasu. Připojte podporovaný uzel k handle nástrojů agenta a poté označte konkrétní pole jako poskytovaná agentem pomocí ikony robota. Tato pole se za běhu stanou parametry nástroje, zatímco přihlašovací údaje a neoznačená pole zůstávají pevně dané v konfiguraci uzlu.

Sekce Skills nyní zahrnuje **AI Build** pro vytváření nových skills, inline akci AI úprav pro existující skills, stažení ZIP pro jednotlivé skills a volitelný přepínač **Enable Drive files** pro skills, které potřebují za běhu číst soubory z Heym Drive. Modální okno Skill Builder streamuje chat konverzaci vlevo, přijímá soubory přetažením s každým komentářem k doladění, zobrazuje živý náhled vygenerovaných souborů `SKILL.md` a `.py` pouze pro čtení vpravo, umožňuje stáhnout tento náhled jako ZIP a ukládá nahrané soubory pro doladění zpět jako součásti assets skillu prostřednictvím stejného toku ingestace ZIP, který se používá při ručním nahrávání.

S povolenou funkcí **[Agent Persistent Memory](./agent-persistent-memory.md)** si každý agentní uzel udržuje vlastní znalostní graf: fakta se načítají do systémového promptu, když nejsou prázdná, a úspěšná spuštění spouštějí na pozadí sloučení nových entit a vztahů. Sub-agenti používají samostatné grafy. Graf agenta můžete **sdílet** s jinými agenty (ve stejném nebo jiném workflow) s přístupem pro čtení nebo pro čtení a zápis z dialogu grafu. Ovládací prvek mozku na canvasu otevírá editor grafu.

Agentní uzly mohou také vstoupit do režimu [Human-in-the-Loop](./human-in-the-loop.md). V tomto režimu agent získá nástroj `request_human_review` a může se pozastavit u konkrétních kroků vyžadujících schválení, vytvořit jednorázový veřejný odkaz pro revizi, zpřístupnit větev canvasu `review` pro toky oznámení a čekat, dokud recenzent nepřijme, neupraví nebo neodmítne text revize ve formátu Markdown. Pole HITL uzlu funguje jako pokyny pro schvalování, kdy se má zeptat, zatímco souhrn pro recenzenta se generuje z každého požadavku na revizi. U nástrojů [MCP](../tabs/mcp-tab.md) Heym používá model k interpretaci těchto psaných instrukcí na `always`, `once` nebo `never`, takže volný jazyk schvalování se mapuje na konkrétní runtime politiku. Spuštění je označeno jako `pending` a po obdržení rozhodnutí pokračuje z uloženého snapshotu spuštění; stejné spuštění agenta se může pozastavit vícekrát, pokud i pozdější kroky vyžadují revizi.

Agentní uzly automaticky komprimují svou nahromaděnou historii zpráv, když se přiblíží 80 % kontextového okna modelu. Systémový prompt, první uživatelská zpráva a nejnovější uživatelská zpráva jsou vždy zachovány; vše mezi tím je shrnuto pomocí stejného modelu a přihlašovacích údajů. Události komprese jsou viditelné v panelu Debug, v [Execution History](./execution-history.md) a na kartě [Traces](../tabs/traces-tab.md).

Viz také [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) a [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Uzel Codex spouští OpenAI Codex CLI v izolovaném pracovním prostoru Heym. Přijímá přihlašovací údaje Codex (přihlaste se pomocí ChatGPT a využijte své předplatné bez nákladů na API za jednotlivé tokeny, nebo vložte přístupový token), přihlašovací údaje GitHub, URL repozitáře, základní větev, prompt úlohy, režim publikování (`diff_only` nebo `draft_pr`), název větve a časový limit. Runner naklonuje repozitář lokálně, předá token ChatGPT nebo `CODEX_ACCESS_TOKEN` pouze procesu Codex a vrátí strukturované shrnutí, poznámky k validaci, změněné soubory, diff, metadata o využití a volitelnou URL konceptu PR.

Když Codex vrátí `needs_input`, workflow se pozastaví a zpřístupní větev `question`. Připojte tuto větev k Slacku, e-mailu nebo jinému uzlu pro oznámení; veřejný odkaz pro navazující komunikaci obnoví uložený snímek spuštění poté, co je odpověď odeslána. Uzel Codex lze také připojit k AI Agentovi jako nástroj, což agentovi umožňuje delegovat úlohy kódování; jako nástroj se výsledek `needs_input` vrátí agentovi přímo, místo aby se workflow pozastavilo.

Viz také [GitHub](../nodes/github-node.md), [Přihlašovací údaje](./credentials.md), [Sdílení přihlašovacích údajů](./credentials-sharing.md) a [Typy uzlů](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Uzel OpenCode Go spouští OpenCode CLI (Go) proti repozitáři GitHub. Izolace se řídí vzorem Codex: lokálně běží jako podproces hostitele, zatímco nasazení v Dockeru jej spouští uvnitř zabezpečeného sourozeneckého kontejneru, který sdílí svazek pracovního prostoru. Přijímá přihlašovací údaje OpenCode Go (API klíč brány s volitelnou základní URL), přihlašovací údaje GitHub, URL repozitáře, základní větev, prompt úlohy, režim publikování, název větve, časový limit a model `opencode-go/<model>` vybraný z živého, prohledávatelného seznamu modelů (s vestavěnou záložní možností). Heym provádí všechny operace git/GitHub na hostiteli a nikdy neumisťuje token GitHub do sandboxu; OpenCode upravuje pouze soubory na disku. Uzel vrací strukturované shrnutí, poznámky k validaci, změněné soubory, diff a volitelnou URL pull requestu. Lze jej připojit k AI Agentovi jako nástroj.

Viz také [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Přihlašovací údaje](./credentials.md), [Sdílení přihlašovacích údajů](./credentials-sharing.md) a [Typy uzlů](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Uzel LLM zpracovává text pomocí jazykového modelu nebo generuje obrázky. Podporuje generování textu, vision (vstup obrázků), generování obrázků, strukturovaný výstup JSON, nativní spouštění Batch API poskytovatele pro podporované endpointy OpenAI a kompatibilní s OpenAI a volitelný přepínač **Use Responses API**, který směruje volání přes Responses API namísto Chat Completions (ve výchozím nastavení vypnuto; funguje s přihlašovacími údaji OpenAI a vlastními přihlašovacími údaji a nelze jej kombinovat s režimem Batch). Nakonfigurujte přihlašovací údaje, model, systémové a uživatelské zprávy, teplotu a maximální počet tokenů; v promptech použijte [Expression DSL](./expression-dsl.md). V režimu batch musí `userMessage` vyhodnotit na pole, uzel vysílá větev `batchStatus` s aktualizacemi průběhu a konečný výstup obsahuje výsledky batch pro jednotlivé položky. Volitelný přepínač **Extra Body** připojuje k každému volání API objekt JSON s parametry požadavku specifickými pro poskytovatele (například `{"thinking": {"type": "disabled"}}`); ve výchozím nastavení je vypnutý. Volitelné [Guardrails](./guardrails.md) blokují nebezpečný obsah před voláním.

Přirozeně se kombinuje s [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) a [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Uzel Decision klade rozhodovacímu modelu otázky týkající se stavu spuštění a vrací pravděpodobnosti místo prózy. Pole **State** nese to, co má model číst — osamocený výraz si zachovává svůj vlastní typ, takže `$input` odešle objekt, nikoli jeho text — a seznam otázek nese úsudky. Otázky mají tři podoby: **noul** odpovídá, zda podmínka platí, **choice** vybírá jednu možnost z vámi definované sady a vrací úplné rozdělení a **score** hodnotí stav podle uspořádaných úrovní a může skončit mezi nimi. Odpovědi choice a score také nesou míru jistoty, takže [Switch](../nodes/switch-node.md) může směrovat podle odpovědi, zatímco [Condition](../nodes/condition-node.md) může hradlovat podle toho, jak jistá byla. **Generate with AI** navrhne šablonu stavu a řádky otázek z prosté věty a **Custom request body** odešle ručně napsaný JSON pro endpoint, jehož kontrakt se liší. Odpověď poskytovatele je předána beze změny a každé volání je zaznamenáno v [Traces](../tabs/traces-tab.md).

Vyžaduje přihlašovací údaje Decision Model; přirozeně se kombinuje s [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) a [Agent Node](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Uzel RAG / Vector Store vkládá, aktualizuje (upsert), maže a vyhledává dokumenty ve vektorovém úložišti pro retrieval-augmented generation. Rozbalovací nabídka Database vybírá backend — **Qdrant** (externí server) nebo **Postgres (pgvector)** (vlastní databáze Heym, bez externí služby), přičemž výchozí je Qdrant. Vyberte vektorové úložiště na kartě [Vectorstores](../tabs/vectorstores-tab.md) a nastavte operaci na insert, upsert, delete nebo search. Operace upsert a delete adresují dokument pomocí jedinečného id uloženého v payloadu — pole **Document ID Field** pojmenovává toto pole (výchozí `doc_id`) a **Document ID** nese jeho hodnotu — takže dokument si zachovává id, které již používá Váš vlastní systém: upsert nahradí každý odpovídající bod před uložením nové verze a delete hlásí, zda bylo něco nalezeno. Metadata dokumentu přijímají ve svých hodnotách výrazy, takže `{"url": "$start.url"}` uloží to, co dané spuštění vytvořilo. Vyhledávání podporuje filtry metadat a volitelné přehodnocení (reranking) Cohere a vrací pole výsledků s textem, skóre, metadaty, příznakem reranked a počtem pro použití v tocích [LLM](../nodes/llm-node.md) nebo [Agent Node](../nodes/agent-node.md).

Běžnými navazujícími uzly jsou [LLM](../nodes/llm-node.md) a [Agent Node](../nodes/agent-node.md); nastavení vektorového úložiště najdete v části [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Uzel MCP Call volá konkrétní nástroj [MCP](../tabs/mcp-tab.md) přímo, bez toho, aby o vyvolání nástroje rozhodoval LLM. Použijte jej, když v době návrhu přesně víte, který nástroj má být spuštěn — pro deterministické, jednostupňové spuštění nástroje MCP ve workflow. Nakonfigurujte připojení (SSE, Streamable HTTP nebo stdio; stejná pole jako připojení MCP u [Agent Node](../nodes/agent-node.md)), klikněte na **Fetch Tools** pro naplnění rozbalovací nabídky, vyberte nástroj a vyplňte pole argumentů, která se automaticky vykreslí ze vstupního schématu nástroje. Každý argument přijímá statickou hodnotu nebo [výraz DSL](./expression-dsl.md), jako je `$userInput.body.text`. Výsledek je k dispozici jako `$nodeLabel.result` (objekt JSON, pokud je parsovatelný, jinak řetězec). Uzel MCP Call nelze na canvasu připojit k [Agent Node](../nodes/agent-node.md) jako nástroj.

Viz také [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) a [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Uzel Condition větví workflow na základě výrazu if/else. Má dva výstupní handly: jeden pro případ, kdy je podmínka pravdivá, a jeden pro nepravdivou. V podmínkovém výrazu použijte porovnávací a logické operátory z [Expression DSL](./expression-dsl.md); uzel předává vstup do zvolené větve.

Viz také [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) a [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Uzel Switch směruje spuštění do různých cest porovnáním hodnoty s případy (cases). Nakonfigurujte výraz k vyhodnocení a seznam hodnot případů; každý případ získá zdrojový handle a pro neodpovídající hodnoty se použije výchozí handle. Vstup je předán do odpovídající větve.

Pro binární větvení použijte [Condition](../nodes/condition-node.md) a pro opětovné spojení rozvětvených cest [Merge](../nodes/merge-node.md); pravidla porovnávání jsou popsána v [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Uzel Merge čeká na více paralelních vstupů a kombinuje je do jediného výstupu. Nastavte počet vstupů, na které se má čekat; jakmile všechny větve dokončí činnost, uzel vytvoří sloučený objekt. Použijte jej ke spojení výsledků z paralelních větví před pokračováním; nepoužívejte jej, když paralelní větve končí v samostatných uzlech Output.

Viz také [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) a [Output](../nodes/output-node.md) při opětovném spojování větví.

#### [Loop](../nodes/loop-node.md)

Uzel Loop iteruje přes pole a pro každou položku spouští navazující uzly. Pro posun vyžaduje zpětné připojení z posledního uzlu v těle iterace. Uvnitř těla cyklu použijte `item`, `index`, `total`, `isFirst` a `isLast`; cyklus má samostatné výstupy pro cestu iterace a cestu done.

Pro iterativní workflow se pojí s [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) a [Expression DSL](./expression-dsl.md).

### Data

#### [Set](../nodes/set-node.md)

Uzel Set transformuje a mapuje vstupní data na vlastní výstup. Definujte mapování klíč–hodnota, kde každá hodnota je výraz [Expression DSL](./expression-dsl.md). Použijte jej pro převod na velká písmena, podřetězce, zřetězení, náhodná čísla a podobné transformace. K výstupu přistupujte pomocí klíče (např. `$setNode.keyName`). Při připojení k agentovi jako nástroj na canvasu lze hodnoty mapování označit jako poskytované agentem, aby je agent vyplnil za běhu. Pro volání jiných workflow použijte místo toho uzel [Execute](../nodes/execute-node.md).

Viz také [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) a [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Uzel Converter převádí data mezi formáty bez nutnosti psát kód. Textové konverze zahrnují `csvToJson` (text CSV na pole objektů řádků, případně na pole polí, pokud chybí hlavička), `jsonToCsv` (pole objektů/řádků na text CSV), `xmlToJson` (text XML na objekt) a `jsonToXml` (objekt na text XML). Nakonfigurujte směr konverze a zdrojový výraz; konverze CSV navíc využívají oddělovač a zpracování hlavičky a `jsonToCsv` může určit explicitní pořadí sloupců. Uvozování, vložené oddělovače a vložené znaky nového řádku se řídí normou RFC 4180. Atributy XML používají předpony `@`, text smíšený s atributy používá `#text`, opakující se elementy se stávají poli a expanze entit XML je zakázána. Tentýž uzel pracuje i s uloženými soubory. `imageToText` a `pdfToText` spouštějí Tesseract OCR, čtou soubor z Heym Drive (`$Upload.file.id` z triggeru File upload, výsledek uzlu Drive nebo soubor vygenerovaný agentem), automaticky volí jazyk podle rozpoznaného písma nebo používají vámi zadané kódy, jako například `tur` nebo `eng+tur`, a ve výchozím nastavení normalizují text na UTF-8 s volitelnou normalizací NFC a užšími znakovými sadami, jako je `cp1254`. `fileConvert` přepíše uložený soubor do jiného formátu, dokumenty prostřednictvím pandoc a obrázky prostřednictvím Pillow, a výsledek uloží jako nový soubor na Drive, aniž by se dotkl originálu. Výsledek je k dispozici jako `$converterNode.result`, společně s `.language`, `.encoding`, `.page_count`, `.pages` a `.file` pro běhy OCR a s `.id`, `.filename` a `.download_url` pro `fileConvert`.

Viz také [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) a [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Uzel Code spouští Python, který sami napíšete, s vlastním `requirements.txt`, v kontejneru, jenž se vytváří a ničí při každém spuštění. Váš kód definuje funkci `main(params)` a vrací libovolnou hodnotu serializovatelnou do JSON, která se stává `$codeNode.result`; cokoli, co vypíše, se zachytí samostatně jako `$codeNode.logs`, a `$codeNode.install` hlásí, který nástroj závislosti nainstaloval. Parametry se konfigurují jako objekt JSON, jehož výrazy `$` se vyhodnotí před spuštěním, a kód k nim přistupuje pomocí tečkové notace, jako je `params.user.name` nebo `params.orders[0].id`. Závislosti se instalují pomocí `uv` s návratem k `pip` pro balíčky, které `uv` nezvládne, bez mezipaměti mezi běhy; ponechání prázdného `requirements.txt` instalaci zcela přeskočí a je výrazně rychlejší. Fáze spuštění nemá přístup k síti, pokud není zapnuto `codeAllowNetwork`, zatímco instalace závislostí vždy přistupuje k PyPI. Sandbox běží jako non-root se všemi odebranými oprávněními, s kořenovým souborovým systémem pouze pro čtení, bez Docker socketu a bez přístupu k backendovým tajemstvím, s limitem 512 MB paměti, jednoho CPU, 256 procesů, 120 sekund na instalaci a 60 sekund na spuštění. Docker je vyžadován a neexistuje žádný záložní režim: bez dostupného daemonu uzel selže, místo aby spustil váš kód v procesu backendu.

#### [Variable](../nodes/variable-node.md)

Uzel Variable nastavuje nebo aktualizuje proměnnou lokální pro workflow (`$vars.variableName`) nebo trvalou [globální proměnnou](./global-variables.md) (`$global.variableName`). Použijte jej pro čítače, akumulované seznamy a sdílený stav. Nakonfigurujte název proměnné, výraz hodnoty, přetypování a zda ukládat do globálního úložiště. Proměnné typu pole podporují `$array()` a `.add()`.

Doplňuje [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) a [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Uzel Execute volá jiný workflow (sub-workflow) a předává mu vstup. Zadejte cílový workflow podle ID a poskytněte vstup prostřednictvím jediného výrazu nebo mapování klíč–hodnota. Výstup zahrnuje workflow_id, status a outputs; použijte jej pro znovupoužitelnou logiku, nikoli pro transformaci dat (k tomu použijte Set).

Viz také [Canvas Features](./canvas-features.md) pro Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) a [Output](../nodes/output-node.md).

### Integrations

#### [HTTP](../nodes/http-node.md)

Uzel HTTP provádí HTTP požadavky pomocí konfigurace ve stylu cURL. Může být výchozím bodem workflow (bez příchozí hrany) nebo přijímat vstup z předchozích uzlů. Odpověď je k dispozici jako status, headers a body (parsované JSON, pokud je to možné). Pro autentizaci Bearer nebo vlastní hlavičkou použijte [Credentials](./credentials.md).

Doplňuje [Webhooks](./webhooks.md), [Credentials](./credentials.md) a [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Uzel WebSocket Send otevře odchozí klientské připojení, odešle jednu textovou/JSON/binární zprávu a uzavře je. Použijte jej k publikování výstupu workflow do realtime systémů, aniž byste vytvářeli socket endpoint hostovaný v Heym.

Viz také [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) a [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Uzel Telegram odesílá zprávu bota do chatu, skupiny nebo kanálu. Nakonfigurujte [přihlašovací údaje](./credentials.md) pro Telegram, nastavte `chatId` a sestavte odchozí `message` pomocí výrazů [Expression DSL](./expression-dsl.md). Přirozeně se doplňuje s [Telegram Trigger](../nodes/telegram-trigger-node.md) pro konverzační workflow a s [Error Handler](../nodes/error-handler-node.md) pro výstrahy operátorům.

Viz také [Third-Party Integrations](./integrations.md) a [Credentials](./credentials.md) pro nastavení a vzory přihlašovacích údajů.

#### [Slack](../nodes/slack-node.md)

Uzel Slack odesílá zprávu do kanálu Slack prostřednictvím Incoming Webhook. Nakonfigurujte [přihlašovací údaje](./credentials.md) pro Slack a výraz pro zprávu. Použijte jej pro oznámení, výstrahy a hlášení chyb; výstup prochází skrz vstup.

Doplňuje se s [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) a [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Uzel Discord odesílá zprávu do kanálu Discord prostřednictvím Incoming Webhook. Nakonfigurujte [přihlašovací údaje](./credentials.md) pro Discord, sestavte odchozí zprávu pomocí [Expression DSL](./expression-dsl.md) a volitelně nastavte přepsání uživatelského jména nebo avatara webhooku.

Doplňuje se s [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) a [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Uzel Send Email odesílá e-maily prostřednictvím SMTP. Nakonfigurujte [přihlašovací údaje](./credentials.md) pro SMTP a výrazy [Expression DSL](./expression-dsl.md) pro příjemce, předmět a tělo zprávy. Použijte jej pro oznámení, výstrahy a transakční e-maily. Výstup obsahuje stav, příjemce a předmět.

[IMAP Trigger](../nodes/imap-trigger-node.md) doplňuje Send Email tím, že zpracovává příchozí poštu. Společně umožňují workflow číst příchozí e-maily ze sdílené schránky, shrnout nebo klasifikovat je pomocí AI uzlů a odeslat následnou nebo eskalační zprávu. [Telegram Trigger](../nodes/telegram-trigger-node.md) a [Telegram node](../nodes/telegram-node.md) poskytují stejný vzor příchozí/odchozí komunikace pro chatové workflow řízené botem.

Pro obousměrné toky oznámení se také dobře doplňuje s [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) a [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Uzel Redis provádí operace Redis: set, get, hasKey a deleteKey. Použijte jej pro cachování, omezování rychlosti a ukládání klíč–hodnota. Nakonfigurujte [přihlašovací údaje](./credentials.md), typ operace, výraz pro klíč a u operací set hodnotu a volitelné TTL. Výstup se liší podle operace (value, success, exists, deleted).

Doplňuje se s [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) a [Parallel Execution](./parallel-execution.md) pro cachování, omezování a koordinaci.

#### [Grist](../nodes/grist-node.md)

Uzel Grist čte, zapisuje a spravuje data v tabulkách Grist. Operace zahrnují getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables a listColumns. Zadejte ID dokumentu, ID tabulky a pro create/update data záznamu pomocí ID sloupců. Použijte jej pro CRUD, dávkové aktualizace a automatizaci tabulek.

Viz také [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) a [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Uzel Google Sheets čte, zapisuje a spravuje data tabulek prostřednictvím OAuth2. Použijte jej ke čtení reportů, připojování výsledků workflow, aktualizaci trackerů a mazání nebo kontrole listů tabulky přímo z workflow. Stejně jako [BigQuery](../nodes/bigquery-node.md) využívá přihlašovací údaje integrace podporované Googlem a dobře se hodí vedle [Grist](../nodes/grist-node.md), pokud jsou data tabulek součástí toku.

Doplňuje se s [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) a [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

Uzel BigQuery spouští SQL dotazy a vkládá řádky do datových sad Google BigQuery prostřednictvím OAuth2. Je užitečný pro analytická workflow, reportovací pipelines a zápis strukturovaných dat událostí ze spuštění workflow. Často se doplňuje s [Set](../nodes/set-node.md) pro tvarování řádků a s [Google Sheets](../nodes/google-sheets-node.md) pro lehčí reportování orientované na tabulky.

Doplňuje se s [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) a [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Uzel Google Drive umožňuje vypisovat, stahovat, aktualizovat a mazat soubory a složky na Disku Google prostřednictvím OAuth2 a dokáže také zkopírovat soubor z Disku Google přímo do [Heym Drive](../nodes/drive-node.md) pomocí operace `syncToHeymDrive`. Dokumenty Google, Tabulky Google a Prezentace Google nemají stahovatelná data, proto je uzel automaticky exportuje — Dokumenty do PDF, Tabulky do XLSX a Prezentace do PPTX — s možností přepsat cílový formát. Mazání přesouvá položky do koše Disku Google, pokud není povolena volba „Smazat trvale“, a uzel odmítne smazat složku prostřednictvím operace pro soubory nebo naopak. Stejně jako [Google Sheets](../nodes/google-sheets-node.md) používá přihlašovací údaje OAuth2 podporované společností Google; mějte však na paměti, že tyto údaje vyžadují plný přístup k Disku Google, proto si před jejich sdílením prostudujte část [Sdílení přihlašovacích údajů](./credentials-sharing.md).

Spolupracuje s uzly [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) a s částí [Integrace třetích stran](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Uzel GitHub poskytuje 40 nativních akcí GitHub REST pokrývajících repozitáře, organizace a uživatele, issues, pull requesty, recenze, releases, workflow Actions, přehledy o provozu a soubory v repozitářích. Využijte jej pro třídění issues, automatizaci recenzí, spouštění workflow a čekání na jejich dokončení, automatizaci releases a aktualizace souborů v repozitáři bez ručního sestavování HTTP požadavků. Podporuje GitHub.com a volitelný `base_url` pro GitHub Enterprise v rámci přihlašovacích údajů.

Spolupracuje s uzly [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) a s částí [Integrace třetích stran](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Uzel Jira propojuje workflow s rozhraními REST API služeb Jira Cloud nebo Jira Data Center / Server pro automatizaci projektů, issues, komentářů, příloh, uživatelů, oznámení a přechodů stavů. Dokáže vypisovat projekty, vyhledávat issues pomocí JQL, vytvářet nebo aktualizovat issues, prohlížet changelogy, informovat zainteresované strany, spravovat komentáře a přílohy, načítat nebo spravovat uživatele, vypisovat dostupné přechody a přesouvat issues prostřednictvím ID přechodu. Použijte přihlašovací údaje Jira s e-mailem Atlassian, API tokenem, základní URL webu a režimem nasazení.

Spolupracuje s uzly [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) a s částí [Integrace třetích stran](./integrations.md) pro příjem požadavků podpory, třídění chyb a workflow při vydávání verzí.

#### [Linear](../nodes/linear-node.md)

Uzel Linear propojuje workflow s GraphQL API služby Linear pro automatizaci pracovního prostoru a issues. Dokáže vypisovat týmy, projekty, issues, stavy workflow, členy týmu a komentáře; vytvářet, aktualizovat, mazat a propojovat issues; a vytvářet, aktualizovat, řešit, znovu otevírat nebo mazat komentáře. Použijte osobní API klíč Linear nebo přihlašovací údaje OAuth2 a před vytvářením či aktualizací issues zjistěte UUID týmů, projektů, stavů a řešitelů pomocí operací pro výpis.

Spolupracuje s uzly [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) a s částí [Integrace třetích stran](./integrations.md) pro příjem požadavků, třídění a workflow inženýrského backlogu.

#### [Supabase](../nodes/supabase-node.md)

Uzel Supabase čte a upravuje tabulky zpřístupněné prostřednictvím Supabase PostgREST. Dobře se hodí pro produktové backendy, uživatelská a profilová data, stav workflow a automatizace ve stylu CRUD, které vyžadují přístup k databázi bez ručního sestavování HTTP požadavků.

Spolupracuje s uzly [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) a s částí [Integrace třetích stran](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Uzel ClickHouse spouští operace CRUD, count a raw SQL proti externí databázi ClickHouse prostřednictvím jejího HTTP rozhraní. Hodí se pro analytické pipelines, logování událostí a reportovací workflow: vkládejte události, jak nastanou, a poté je agregujte nebo počítejte pomocí `query`/`count`. Zrcadlí sadu operací uzlu [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) a navíc nabízí možnost spuštění raw SQL, přičemž operace `update`/`remove` se provádějí jako mutace ClickHouse.

Spolupracuje s uzly [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) pro plánované reporty a s částí [Integrace třetích stran](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Uzel Notion spravuje databáze, zdroje dat, stránky a bloky Notion prostřednictvím aktuálního Notion API (`2026-03-11`). Podporuje vyhledávání, CRUD stránek, operace s databázemi a zdroji dat, podřízené bloky, přidávání/aktualizaci/mazání bloků a přesun do koše/obnovení. Použijte interní integrační token nebo přihlašovací údaje OAuth2 veřejné integrace Notion. Editor dokáže vyhledávat a stránkovat dostupné zdroje dat a nadřazené stránky pomocí kurzoru. Sdílené přihlašovací údaje fungují při spouštění workflow stejně jako vlastní přihlašovací údaje.

Pro vlastní volání REST se `$credentials.YourNotionCredential` přeloží na stejný bearer token. Spolupracuje s uzly [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) a s částí [Integrace třetích stran](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Uzel Sentry automatizuje organizace, projekty, týmy, issues, události a releases v Sentry prostřednictvím Sentry REST API. Využijte jej pro třídění výstrah, aktualizace stavu issues, automatizaci releases, vyhledávání událostí a nastavení nebo úklid projektů a týmů. Podporuje Sentry SaaS i self-hosted Sentry prostřednictvím volitelné base URL v přihlašovacích údajích.

Spolupracuje s uzly [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) a s [Third-Party Integrations](./integrations.md) pro workflow incidentů a releases.

#### [DataTable](../nodes/datatable-node.md)

Uzel DataTable čte, zapisuje a spravuje data v Heym DataTables (first-party strukturované úložiště). Operace zahrnují find, getAll, getById, insert, update, remove a upsert. Nevyžaduje žádné externí přihlašovací údaje. Tabulky se spravují z dashboardu na kartě [DataTable](../tabs/datatable-tab.md) a přímo k nim přistupuje vlastník workflow.

Spolupracuje s uzly [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) a s [kartou DataTable](../tabs/datatable-tab.md) pro first-party strukturované úložiště.

#### [Drive](../nodes/drive-node.md)

Uzel Drive spravuje soubory generované skilly přímo z prostředí workflow. Operace zahrnují delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams a unshareWithMyTeams pro správu přístupu týmů pouze pro čtení; konverze formátů je přesunuta do uzlu [Converter](../nodes/converter-node.md). Na soubor odkazujte pomocí `$agentLabel._generated_files[0].id`; výstupy zahrnují status, file_id, aktualizovanou download_url pro omezení odkazů a shared_team_count pro sdílení s týmy. To je obzvláště užitečné ve workflow s uzlem [Agent Node](../nodes/agent-node.md), které využívají [File Generation](./file-generation.md) a referenční model [Drive](./drive.md).

Mezi běžné doprovodné uzly patří [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) a [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Uzel Amazon S3 provádí operace s objektovým úložištěm na Amazon S3 pomocí přihlašovacích údajů `s3` (access key, secret key, region, volitelný session token). Operace zahrnují putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder a listBuckets. Je podporováno nahrávání textu a stahování textu nebo base64, přičemž pole bucket a key přijímají [Expression DSL](./expression-dsl.md). Využijte jej k ukládání výstupů workflow, archivaci souborů a načítání objektů zpět do toku.

Spolupracuje s uzly [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), s [Credentials](./credentials.md) a s [Third-Party Integrations](./integrations.md).

### Automatizace

#### [Crawler](../nodes/crawler-node.md)

Uzel Crawler scrapuje webové stránky pomocí FlareSolverr s volitelnou extrakcí HTML prostřednictvím CSS selektorů. Nakonfigurujte [přihlašovací údaje](./credentials.md) pro FlareSolverr, výraz URL, dobu čekání a volitelné selektory pro extrakci. Výstupem je surové HTML nebo extrahovaný obsah. Využijte jej pro web scraping a extrakci obsahu.

Spolupracuje s uzly [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) a [LLM](../nodes/llm-node.md) pro toky scrape-and-analyze.

#### [Playwright](../nodes/playwright-node.md)

Uzel Playwright automatizuje interakce s prohlížečem pomocí konfigurovatelných kroků (navigate, refresh, click, type, screenshot, extract, aiStep) nebo režimu **Run Code** pro vlastní Playwright Python (sandboxovaný; ve výchozím stavu vypnutý prostřednictvím `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Podporuje headless režim, volitelné nastavení, které potlačuje běžné signály automatizace Playwright, časové limity, volitelné zachytávání síťové komunikace (responses, cookies, localStorage, sessionStorage), bootstrap autentizace pomocí cookie/storageState z výrazů [Global Variables](./global-variables.md), jako je `$global.authState`, záložní přihlašovací kroky pro případ selhání obnovení autentizace a AI krok s Auto Heal při selhání selektorů. Využijte jej pro web scraping, vyplňování formulářů a workflow založené na prohlížeči.

Viz také [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) a [Execution History](./execution-history.md) pro automatizaci prohlížeče a ladění.

### Nástroje

#### [Output](../nodes/output-node.md)

Uzel Output je koncovým bodem workflow, který vrací odpověď volajícímu. Nastavte výraz zprávy tak, aby odkazoval na předchozí uzel podle jeho označení (zde nikdy nepoužívejte `$input` z uzlu [Input](../nodes/input-node.md)). Volitelný asynchronní downstream umožňuje spuštění uzlů za výstupem na pozadí po odeslání odpovědi.

Mezi běžné zdroje na vstupu patří [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) a [Execute](../nodes/execute-node.md); tvarování odpovědi se snáze ladí v [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Uzel JSON output mapper sestavuje prostý JSON objekt z mapování klíč-hodnota ve stylu uzlu [Set](../nodes/set-node.md) a vrací jej v kořeni odpovědi workflow. Využijte jej, když má volající API obdržet surové JSON tělo namísto standardního obalu uzlu [Output](../nodes/output-node.md).
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

Uzel HTML output mapper vykresluje jednu HTML šablonu a interpoluje výrazy `$nodeLabel.field` do stránky. Pokud je jediným koncovým uzlem workflow, execute webhook odpoví typem `text/html` a nakonfigurovaným stavovým kódem uzlu místo těla JSON, takže workflow může přímo obsloužit stránku v prohlížeči. Pro ladění odešlete `X-Simple-Response: false` a získáte zpět obvyklý JSON obal.

Spolupracuje s uzly [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) a [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Uzel Chart Output je koncovým uzlem workflow widgetu [Dashboard](../tabs/dashboard-tab.md). Převádí řádky vytvořené předchozími uzly na standardizovaný chart payload, který dashboard vykreslí. Zvolte `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text nebo HITL), namapujte `labelField`/`valueField` (nebo `series` pro více sérií, případně `text` pro markdown zprávu) a umístěte jej na konec; nemá žádnou výstupní hranu. HITL ignoruje řádky z předchozích uzlů a vypisuje Vaše čekající lidská schválení.

Viz také [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) a [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Uzel Wait pozastaví provádění workflow na zadanou dobu v milisekundách, maximálně však na 15 minut. Použijte jej pro rate limiting, zpožděné akce nebo intervaly dotazování. Vstup předává beze změny.

Spolupracuje s uzly [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) a [Parallel Execution](./parallel-execution.md) pro řízení tempa a dotazování.

#### [Sticky Note](../nodes/sticky-note-node.md)

Uzel Sticky Note přidává na canvas markdown poznámky. Není prováděn. Použijte jej pro dokumentaci, pokyny nebo poznámky k workflow vedle dalších [Canvas Features](./canvas-features.md). Obsah poznámky upravíte dvojklikem na canvasu.

Viz také [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) a [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Uzel Console Log zapisuje hodnotu do konzole backendu (serveru). Použijte jej pro ladění a kontrolu během vývoje. Zpráva logu podporuje výrazy [Expression DSL](./expression-dsl.md); výstup předává vstup beze změny.

Spolupracuje s [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) a [Expression Evaluation Dialog](./expression-evaluation-dialog.md) pro ladění.

#### [Disable Node](../nodes/disable-node.md)

Uzel Disable Node trvale zakáže jiný uzel ve workflow nastavením jeho příznaku `active` na false. Cílový uzel určete podle jeho názvu. Použijte jej pro jednorázové operace, jako je zastavení triggeru [Cron](../nodes/cron-node.md) po splnění podmínky.

Viz také [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) a [Cron](../nodes/cron-node.md) pro vzory řízení workflow.

#### [Enable Node](../nodes/enable-node.md)

Uzel Enable Node znovu zapne jiný uzel nastavením jeho příznaku `active` na true a uložením změny. Cílový uzel určete podle jeho názvu. Použijte jej k opětovnému aktivování zakázaného triggeru [Cron](../nodes/cron-node.md) z jiného vstupního bodu nebo k zapnutí uzlu po splnění podmínky. Cílový uzel, který se nachází níže po proudu od uzlu Enable Node a ještě nebyl spuštěn, se spustí také v rámci aktuálního spuštění.

Viz také [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) a [Cron](../nodes/cron-node.md) pro vzory řízení workflow.

#### [Throw Error](../nodes/throw-error-node.md)

Uzel Throw Error okamžitě zastaví provádění workflow a vrátí chybovou odpověď s vlastním stavovým kódem HTTP. Nastavte výraz chybové zprávy a stavový kód (např. 400, 401, 403, 404, 429, 500). Použijte jej pro selhání validace, neoprávněný přístup nebo jiné chybové stavy, zejména ve spojení s uzly [Condition](../nodes/condition-node.md) a [Error Handler](../nodes/error-handler-node.md).

Spolupracuje s uzly [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) a [Security](./security.md) pro explicitní cesty selhání.

---

## Reference
### [Typy uzlů](./node-types.md)

Heym poskytuje řadu typů uzlů: triggery jako [Vstup](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) a [Error Handler](../nodes/error-handler-node.md); AI uzly jako [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) a [MCP Call](../nodes/mcp-call-node.md); logické uzly jako [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) a [Loop](../nodes/loop-node.md); datové uzly jako [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) a [Heym](../nodes/heym-node.md); integrace jako [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) a [Drive](../nodes/drive-node.md); automatizační uzly jako [Crawler](../nodes/crawler-node.md) a [Playwright](../nodes/playwright-node.md); a utility jako [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) a [Sticky Note](../nodes/sticky-note-node.md). V konfiguraci uzlů používejte výrazy jako `$input.text` a `$nodeLabel.field`.

Viz také [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) a [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym používá jednoduchý jazyk výrazů pro odkazování na data z předchozích uzlů. Použijte `$input` pro uzel [Vstup](../nodes/input-node.md), `$nodeLabel.field` pro jakýkoli předchozí uzel, `$credentials.CredentialName` pro [přihlašovací údaje](./credentials.md) a `$global.variableName` pro [globální proměnné](./global-variables.md). Mezi vestavěné speciální proměnné patří `$now`, `$UUID` a metadata workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` a `$executionId` (id [Historie spuštění](./execution-history.md) daného běhu — `/workflows/{id}/{executionId}` otevře tento běh na canvasu; dostupné pouze za běhu, v dialogu náhledu výrazu prázdné). Podporovány jsou literály, aritmetika, porovnání, kontext [Loop](../nodes/loop-node.md), vnořená pole a pomocné funkce pro řetězce a pole (včetně `$text.toJson()` pro parsování JSON řetězce). Pokud je celá hodnota tvořena jediným `$expr`, backend zachová pole, objekty, booleany a čísla jako nativní typy.

Viz také [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) a [Workflow Structure](./workflow-structure.md).

### [Global Variables](./global-variables.md)

Global Variable Store uchovává persistentní klíč-hodnota data vázaná na uživatele, která přetrvávají napříč spuštěními workflow. Proměnné vytvářejte na kartě [Proměnné](../tabs/global-variables-tab.md) nebo pomocí uzlu [Variable](../nodes/variable-node.md) s povolenou volbou „Store in Global Variable Store". Přistupujte k nim ve výrazech pomocí `$global.variableName`; lze je sdílet s dalšími uživateli nebo [týmy](./teams.md).

Doplňuje [Variable](../nodes/variable-node.md), [Teams](./teams.md) a [Credentials Sharing](./credentials-sharing.md) pro sdílený stav workflow.
### [Dialog pro vyhodnocení výrazů](./expression-evaluation-dialog.md)

Dialog pro vyhodnocení výrazů je rozšiřitelný editor, který se zobrazí po kliknutí na tlačítko rozšíření vedle polí s výrazy. Otevírá se jako velké modální okno ve středu obrazovky, zachovává aktivní automatické doplňování a automaticky obnovuje náhled výstupu z backendu poté, co přestanete psát. Výsledky objektů a polí lze procházet pomocí nástroje pro výběr cesty výstupu. Dialog přijímá celořádkovou cestu s tečkovou notací bez prefixu (například `myNode.output.field`), jako by se jednalo o `$myNode.output.field`; viz pravidla umístění v [Expression DSL](./expression-dsl.md).

Tlačítko **Build with AI** na panelu nástrojů Vám umožňuje popsat požadovaný výraz přirozeným textem. Vyberte [přihlašovací údaje](./credentials.md) pro LLM a model, zadejte popis, například *„Získej jméno zákazníka z odpovědi API"*, a klikněte na Generate. Backend odešle kontext [Expression DSL](./expression-dsl.md) a výstupy uzlů z posledního spuštění do modelu a vrátí řetězec s jedním výrazem. Výsledek je okamžitě vyhodnocen, takže jej můžete ověřit před kliknutím na Apply.

Přirozeně se doplňuje s [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) a [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Struktura workflow](./workflow-structure.md)

Workflow jsou ukládány jako JSON s uzly a hranami. Objekt workflow obsahuje id, name, description, nodes, edges a nastavení autentizace. Každý uzel má id, type, position a data (label a konfiguraci specifickou pro daný typ). Hrany propojují ID zdrojových a cílových uzlů s volitelnými ID handle. Syntaxe výrazů v datových polích se řídí [Expression DSL](./expression-dsl.md) a stejný formát je používán v [Download & Import](./download-import.md).

Viz také [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) a [Download & Import](./download-import.md).

### [Funkce canvasu](./canvas-features.md)

Přesuňte kurzor nad libovolný nesticky uzel na canvasu a klikněte na **Run** pro spuštění až do tohoto uzlu. Požadované vstupy se otevřou v panelu Run s prvním polem ve fokusu; cesty bez vstupů se spustí okamžitě. Viz [Run to Node](./canvas-features.md#run-to-node).

Editor workflow poskytuje Data Pin (připnutí posledního výstupu uzlu pro testování navazujících uzlů bez opětovného spuštění), Execution Logs (výsledky uzlů a průběh agenta v reálném čase, které doplňují [Execution History](./execution-history.md)), Enable/Disable (přeskočení uzlů během spuštění) a Extract to Sub-Workflow (přesun výběru do nového workflow a jeho nahrazení uzlem [Execute](../nodes/execute-node.md)). Probíhající produkční spuštění lze otevřít z Historie nebo z karty na Boardu; editor obnoví jeho aktuální snímek, připojí se k SSE a udržuje animaci canvasu a Debug logy živé. [Keyboard Shortcuts](./keyboard-shortcuts.md) podporují kopírování, vkládání, spuštění a inline vyhledávání uzlů.

Viz také [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md) a [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym poskytuje klávesové zkratky napříč editorem: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo a Escape pro zavření. Na canvasu: vybrat vše, vícenásobný výběr, kopírovat/vyjmout/vložit, smazat, přepnout povolení uzlu (D), přepnout připnutá data (P) a inline vyhledávání uzlů psaním. Klávesové zkratky jsou zdokumentovány v referenci přímo v aplikaci a úzce spolupracují s [Canvas Features](./canvas-features.md), jako jsou Data Pin a povolení/zakázání uzlů.

Viz také [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md) a [Contextual Showcase](./contextual-showcase.md).

### [AI Assistant](./ai-assistant.md)

AI Assistant je chatovací panel otevíraný z panelu Debug, který Vám umožňuje vytvářet nebo upravovat workflow přirozeným jazykem. Vyberte [přihlašovací údaje](./credentials.md) a model, poté popište, co chcete; AI streamuje odpověď a jakýkoli platný [workflow JSON](./workflow-structure.md) v bloku kódu je automaticky zpracován a aplikován na canvas. Hlasový vstup je podporován v kompatibilních prohlížečích.

Zapněte **YOLO mode** (Agent mode, ve výchozím stavu vypnuto) a asistent otestuje, co vytvoří. Po každé změně spustí workflow na canvasu, přečte výsledek a opraví workflow, dokud nedělá to, co jste požadovali, a to až pro 5 spuštění na zprávu. Před prvním spuštěním si vyžádá testovací vstupy, může spustit Vaše další workflow, když potřebuje jejich výsledek, a zobrazuje každý krok během práce. Viz [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Když workflow ukládá záznamy, asistent se zeptá, kterou [datovou tabulku](../tabs/datatable-tab.md) použít, nebo vytvoří novou se sloupci, které workflow potřebuje. Viz [AI Assistant › Data tables](./ai-assistant.md#data-tables).

Když aktuální workflow obsahuje dovednosti [Agent Node](../nodes/agent-node.md), asistent odešle do kontextu workflow pouze `SKILL.md` každé dovednosti. Přiložené soubory `.py` a binární assety dovedností jsou před odesláním požadavku vyloučeny, aby velké balíčky dovedností nepřekročily kontextové okno modelu.

Dobře se doplňuje s [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) a [Expression DSL](./expression-dsl.md).
### [Chat s Heym](./chat-with-heym.md)

Chat s Heym je asistent pro dokumentační hlavičku určený pro dotazy k produktu. Otevírá se v centrovaném dialogu, v horní části udržuje viditelný výběr přihlašovacích údajů a modelu, jako kontext vkládá cestu k aktivní stránce dokumentace a při zavření dialogu vymaže historii zpráv. Doplňuje rozsáhlejšího [AI Assistant](./ai-assistant.md) a odlehčenější [Contextual Showcase](./contextual-showcase.md).

Viz také [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) a [Node Types](./node-types.md).

### [Workflow Organization](./workflow-organization.md)

Administrátoři instance (`HEYM_ADMIN_EMAILS`) mohou přistupovat ke všem workflow a upravovat je, vyhledávat workflow vlastníka podle e-mailu, kontrolovat plány a historii spuštění, pozastavovat a obnovovat automatické triggery a mazat workflow poté, co se běhy ustálí. Postup při offboardingu a rozdíl mezi pozastavením automatických triggerů a zablokováním všech volání naleznete v části [Instance Administration](../tabs/workflows-tab.md#instance-administration).

Workflow lze organizovat do složek a podsložek ve stromové struktuře. Složky mají názvy a volitelného rodiče; workflow jsou přiřazena ke složkám. Workflow lze naplánovat ke smazání (přesun do oblasti koše před trvalým odstraněním). API podporuje vytváření, aktualizaci, mazání a přesun workflow mezi složkami a stejný model organizace se objevuje na kartě [Workflows](../tabs/workflows-tab.md).

Viz také [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) a [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer je pevný panel pro rychlé spuštění na pravé straně určený pro interní stránky mimo canvas. Umožňuje vyhledávat [workflow](../tabs/workflows-tab.md), připínat oblíbené položky, vybírat vstupy, spouštět okamžitě a kontrolovat průběh nebo výsledky bez otevírání editoru. Pořadí připnutých položek a naposledy vybrané workflow se ukládají do prohlížeče.

Viz také [Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) a [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase je kompaktní průvodce v aplikaci pro ověřené hlavní plochy, jako jsou karty dashboardu, [Evals](../tabs/evals-tab.md), Docs a editor workflow. Ve výchozím stavu zůstává zavřený, nejprve poskytne krátké shrnutí stránky, na vyžádání nabídne trochu dalších podrobností a v případě potřeby hlubšího vedení odkáže na úplný článek dokumentace.

Spolupracuje s [Chat s Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) a [AI Assistant](./ai-assistant.md) pro toky vedení v aplikaci.

### [Credentials](./credentials.md)

Credentials ukládají API klíče a tajné údaje používané uzly workflow. Přidejte je na kartě [Credentials](../tabs/credentials-tab.md) a odkazujte na ně názvem nebo ID v uzlech, jako jsou [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) a [Redis](../nodes/redis-node.md). Jsou šifrovány v klidovém stavu, lze je sdílet s uživateli nebo [teams](./teams.md) a lze na ně odkazovat také v [Expression DSL](./expression-dsl.md) prostřednictvím `$credentials.Name`.

Viz také [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md) a [Third-Party Integrations](./integrations.md).

### [Credentials Sharing](./credentials-sharing.md)

Credentials lze sdílet s ostatními uživateli prostřednictvím e-mailu nebo s teams; když jsou credentials sdíleny s teamem, získají přístup všichni členové teamu. Sdílené credentials se na kartě [Credentials](../tabs/credentials-tab.md) zobrazují s indikátorem. Za běhu kontext vlastníka workflow slučuje vlastněné, uživatelsky sdílené a teamově sdílené credentials. V výrazech použijte `$credentials.CredentialName` nebo v datech uzlu nastavte credentialId.

Viz také [Credentials](./credentials.md), [Teams](./teams.md) a [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

Teams umožňují sdílet workflow, credentials, globální proměnné, vektorová úložiště a soubory Drive s skupinou uživatelů najednou. Vytvářejte teams na kartě [Teams](../tabs/teams-tab.md) a přidávejte členy podle e-mailu. Sdílejte prostředky s teamem prostřednictvím příslušných dialogů pro sdílení; všichni členové pak mají přístup. Tvůrce může team upravovat a mazat; smazáním teamu se odstraní všechna sdílení s teamem.

Spolupracuje s [Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md) a [Enterprise](./enterprise.md).

### [Parallel Execution](./parallel-execution.md)

Heym spouští uzly paralelně, pokud na sobě vzájemně nezávisí. Executor sestaví DAG a spouští uzly ve stejné úrovni souběžně pomocí thread poolu; jakmile uzel dokončí činnost, jeho navazující uzly jsou naplánovány. V případě potřeby použijte uzel [Merge](../nodes/merge-node.md) ke sloučení paralelních větví. Více běhů workflow se provádí souběžně; každý běh je izolovaný. Režim [SSE Streaming](./sse-streaming.md) vysílá události při dokončení uzlů.

Viz také [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) a [Execution History](./execution-history.md).
### [Architektura agenta](./agent-architecture.md)

[Uzel Agent](../nodes/agent-node.md) podporuje sub-agenty (orchestrátor volá další uzly agentů prostřednictvím call_sub_agent), sub-workflow (agent volá další workflow prostřednictvím call_sub_workflow), dovednosti (obsah instrukcí a Python nástroje ze souborů .zip nebo .md) a klientská připojení [MCP](../tabs/mcp-tab.md). Vykonavatel nástrojů orchestrátoru směruje volání sub-agentů a sub-workflow; ostatní nástroje směřují do vykonavatelů Python, MCP nebo dovedností. Maximální hloubka vnoření pro sub-agenty a sub-workflow je 5. Smyčka volání nástrojů zahrnuje automatickou kompresi kontextu: před každou iterací je odhadnuto využití tokenů a pokud překročí 80 % kontextového okna modelu, jsou prostřední zprávy shrnuty pomocí stejného modelu, přičemž systémový prompt, první uživatelská zpráva a poslední uživatelská zpráva zůstávají nedotčeny.

Viz také [Uzel Agent](../nodes/agent-node.md), [Trvalá paměť agenta](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) a [MCP](../tabs/mcp-tab.md).

### [Trvalá paměť agenta](./agent-persistent-memory.md)

Volitelný znalostní graf pro každý [Uzel Agent](../nodes/agent-node.md) uložený v Postgres: entity, typy, vlastnosti a orientované vztahy. Pokud je `persistentMemoryEnabled` nastaveno na true, je graf při každém spuštění shrnut do systémového promptu; po úspěšném dokončení [LLM](../nodes/llm-node.md) na pozadí extrahuje strukturované aktualizace. REST CRUD je dostupné pod `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Editor se otevírá pomocí růžového ovládacího prvku mozku na uzlu.

Viz také [Uzel Agent](../nodes/agent-node.md), [Architektura agenta](./agent-architecture.md) a [Spuštění](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop umožňuje [Uzlu Agent](../nodes/agent-node.md) vyžádat schválení v konkrétních kontrolních bodech, vytvořit veřejnou stránku `/review/{token}` a čekat, až nepřihlášený recenzent přijme, upraví nebo odmítne text recenze ve formátu Markdown. Agenti s povoleným HITL také zpřístupňují výstupní handle `review`, takže můžete upozornit [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) nebo jiné kanály, zatímco spuštění čeká na vyřízení. Text HITL na úrovni uzlu se používá jako pokyny pro schválení, zatímco souhrn veřejné stránky je generován ze samotné žádosti o recenzi. Čekající spuštění se okamžitě zobrazí v [Historii spuštění](./execution-history.md), mohou nastat vícekrát v rámci stejného spuštění a po odeslání každého rozhodnutí pokračují z přesně uloženého snapshotu workflow.

Viz také [Uzel Agent](../nodes/agent-node.md), [Portál](./portal.md), [Historie spuštění](./execution-history.md) a [Send Email](../nodes/send-email-node.md).

### [Webhooky](./webhooks.md)

Workflow lze spouštět prostřednictvím [HTTP](../nodes/http-node.md) na adrese `POST /api/workflows/{workflow_id}/execute` nebo streamovat inkrementálně z `POST /api/workflows/{workflow_id}/execute/stream`. Tělo požadavku je předáno jako body do uzlů [Input](../nodes/input-node.md); hlavičky a parametry dotazu jsou dostupné ve výrazech [Expression DSL](./expression-dsl.md). Nakonfigurujte ověřování pro jednotlivá workflow: anonymní, JWT nebo vlastní hlavička. Volitelné cachování odpovědí, omezení rychlosti a dialog Run with cURL v editoru jsou umístěny na úrovni workflow a platí pro oba režimy.

Viz také [Input](../nodes/input-node.md), [Spouštěcí tokeny](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) a [Struktura workflow](./workflow-structure.md).

### [Spouštěcí tokeny](./execution-tokens.md)

Spouštěcí tokeny jsou omezené JWT, které udělují přístup ke koncovým bodům execute a stream jednoho workflow. Pokud workflow používá ověřování JWT, tokeny umožňují externím skriptům, CI pipeline a integracím volat workflow bez sdílení uživatelské relace. Každý token nese claim `wid`, který jej připoutá k jednomu workflow, `jti` používaný pro okamžité odvolání a konfigurovatelnou TTL (60 sekund až 10 let). Tokeny vytvářejte, vybírejte a odvolávejte přímo v dialogu **Run with cURL** — vybraný token je automaticky vložen do generovaného příkazu.

Viz také [Webhooky](./webhooks.md), [Zabezpečení](./security.md) a [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

Dialog cURL může přepnout spuštění [webhooku](./webhooks.md) do režimu Server-Sent Events. To v reálném čase produkuje události `execution_started`, `node_start`, `node_complete` a `execution_complete`, přidá `--no-buffer` do generovaného příkazu cURL a umožňuje konfigurovat zprávy o spuštění pro jednotlivé uzly, jako například `[START] LLM` nebo vlastní text pro externí terminálové konzumenty.

Viz také [Webhooky](./webhooks.md), [Historie spuštění](./execution-history.md) a [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflow jsou spouštěny trigger uzly ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), příjem [RabbitMQ](../nodes/rabbitmq-node.md)) nebo vstupními body: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron scheduler, Telegram webhook, Discord interaction webhook, IMAP trigger manager, RabbitMQ consumer nebo spuštění v Editoru. Každý trigger má vlastní endpoint nebo proces na pozadí; [Cron](../nodes/cron-node.md) běží každých 60 sekund, uzly [Telegram Trigger](../nodes/telegram-trigger-node.md) přijímají bot webhooky, uzly [Discord Trigger](../nodes/discord-trigger-node.md) přijímají podepsané interaction webhooky a uzly [IMAP Trigger](../nodes/imap-trigger-node.md) běží ve svém nakonfigurovaném intervalu dotazování. Uzly [Input](../nodes/input-node.md) přijímají z webhook požadavků body, headers a query.

Viz také [Node Types](./node-types.md), [Webhooks](./webhooks.md) a [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

Execution history zaznamenává spuštění workflow: vstupy, výstupy, výsledky uzlů, stav a zdroj triggeru. Přístup k ní získáte z panelu nástrojů Editoru, zobrazení Docs, záhlaví Dashboardu nebo zobrazení [Evals](../tabs/evals-tab.md). Historie pro konkrétní workflow zobrazuje spuštění otevřeného workflow; zobrazení všech historií zobrazuje spuštění napříč workflow a chatem. Aktuálně běžící spuštění se zobrazují v horní části obou dialogů s akcemi **Open live** a **Cancel**. Open live připojí editor k existujícímu spuštění přes [SSE](./sse-streaming.md), obnoví dokončené uzly, pulzuje aktuální a čekající uzly a připojí Debug logy, aniž by spustil další běh. Bring to Canvas načte vstupy a výstupy uzlů dokončeného spuštění pro opětovné spuštění nebo ladění; deep link `/workflows/{workflowId}/{executionId}` podporuje živá i dokončená spuštění. Spuštění pozastavená funkcí [Human-in-the-Loop](./human-in-the-loop.md) jsou okamžitě uložena jako `pending`, včetně veřejné URL pro kontrolu a všech oznamovacích uzlů spuštěných z větve `review` agenta. Pokud se server restartuje uprostřed běhu, přerušená spuštění se automaticky obnoví: spustí se znovu od začátku se stejnými vstupy a zobrazí se jako dokončená (označená **Recovered**), což je řízeno přepínačem **Auto-recover runs** pro jednotlivá workflow, který je místo toho může zaznamenat jako `skipped`.

Viz také [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) a [Traces](../tabs/traces-tab.md).

### Execution Highlights

Po živém běhu — nebo po **Bring to Canvas** — se v pravém horním rohu Canvas zobrazí zavíratelný popup **Execution Highlights**, který uvádí, co jednotlivé uzly vytvořily, v pořadí provádění. Je to rychlý způsob, jak zkontrolovat výstup jednotlivých uzlů bez otevírání každého uzlu; zavřete jej pomocí **✕** a znovu se otevře při dalším běhu. Highlights se zobrazují také u spuštění na dashboardu. Podrobnosti naleznete v části [Execution History](./execution-history.md).

### [Edit History](./edit-history.md)

Edit History sleduje uložené verze workflow (každé Uložení vytvoří verzi). Zobrazte seznam, otevřete verzi pro zobrazení rozdílů oproti aktuálnímu workflow ([uzly](./workflow-structure.md), hrany, konfigurace) a pomocí Revert obnovte dřívější verzi. Na rozdíl od [Execution History](./execution-history.md) sleduje Edit History změny struktury, nikoli spuštění.

Viz také [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) a [Canvas Features](./canvas-features.md).

### Error Workflow

Workflow může určit jiné workflow, které se spustí při jeho selhání. Nakonfigurujte jej v panelu **Properties** na úrovni workflow (zobrazeném, když není vybrán žádný uzel) v části **On error, run workflow**. Pouze vlastník workflow jej může nastavit, změnit nebo zrušit; viz [Owner-only settings](./workflow-organization.md#owner-only-settings). Když běh na nejvyšší úrovni skončí neošetřeným selháním, spustí se zvolené error workflow a obdrží kontext selhání (id a název selhaného workflow, id spuštění, chybovou zprávu, popisek a typ selhaného uzlu a časové razítko). Pokud canvas již obsahuje uzel [Error Handler](../nodes/error-handler-node.md), má lokální handler přednost a error workflow se **ne**zavolá. Samotné error workflow běží přímo, takže nikdy nespustí své vlastní error workflow.

Pokrývá každý netestovací běh na nejvyšší úrovni: oba execute endpointy, [Portal](./portal.md) a každý trigger, včetně [cron](../nodes/cron-node.md), triggerů chatovacích platforem, e-mailu, front, [MCP](../tabs/mcp-tab.md) a widgetů dashboardu. Při zapnutém [Load Distribution](./cluster.md) to zůstává nezměněno, včetně běhů, které vykonal worker: selhávající uzel se vrací zpět s výsledkem a error workflow je poté distribuováno jako každý jiný běh, takže uzel v něm, který musí běžet na hlavní instanci, tak stále učiní. Dva případy jsou záměrně vynechány, protože výsledek samotného workflow ještě není znám: běh, který nikdy nevykonala žádná instance, a čekání, které vypršelo, zatímco běh může stále probíhat. Rovněž **není** spuštěno ručními testovacími běhy na canvasu.
### Časový limit workflow

Každý workflow může mít nastaven **časový limit workflow** v sekundách v panelu **Vlastnosti** na úrovni workflow. Hodnota `0` (výchozí) jej vypíná. Je-li nastaven, spuštění, které překročí limit, je zastaveno na hranici následujícího uzlu a zaznamenáno jako neúspěšné spuštění s chybou „timed out". Časový limit se vztahuje na ruční, API i triggerovaná spuštění. Dlouhé uzly [Wait](../nodes/wait-node.md) jsou přerušeny neprodleně, namísto aby blokovaly po celou svou dobu trvání.

### Ušetřený čas

Každý workflow může zaznamenávat **odhadovaný ušetřený čas na jedno spuštění** (v minutách), nastavený v panelu **Vlastnosti** na úrovni workflow. Záložka [Analytics](../tabs/analytics-tab.md) tento údaj agreguje za zvolené období jako celkovou statistiku **Ušetřený čas** (součet odhadu každého workflow × jeho úspěšných spuštění). Sekce Most Used rovněž uvádí tento součet pro každý workflow; položka **Not Set** otevře pole pro odhad, pokud není nastaven. Zpráva [Workflow Analysis](./workflow-analysis.md) doporučuje nastavit odhad, pokud žádný není nakonfigurován.

### [Nastavení](./user-settings.md)

Dialog Nastavení (otevřený z Vašeho avatara v záhlaví) má čtyři záložky: Profile (obrázek Gravatar, zobrazované jméno, User Rules), [Security](./security.md) (změna hesla), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) a Observability (stav [OpenTelemetry](./opentelemetry.md) pouze pro čtení). User Rules jsou vlastní instrukce vkládané do každého AI požadavku, včetně tvůrce workflow a [Chat](../tabs/chat-tab.md), takže můžete nastavit jazyk, tón, styl kódu nebo konvence workflow na jednom místě. K dispozici je také správa zásad hesel a API klíčů [MCP](../tabs/mcp-tab.md).

Viz také [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) a [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym může vysílat OpenTelemetry traces pro každé spuštění workflow a každé spuštění uzlu: kořenový span `heym.workflow.execute` na jedno spuštění a podřízený span `heym.node.execute` na jeden uzel, s využitím modelu a tokenů připojeným k uzlům LLM a agent. Spany se exportují přes OTLP/HTTP do libovolného kompatibilního backendu (Jaeger, Grafana Tempo, Honeycomb, Datadog) a kontext W3C trace se šíří napříč příchozími webhooky, odchozím HTTP a sub-workflow. Tracing je ve výchozím stavu vypnutý a konfiguruje se pomocí [proměnných prostředí](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; aktivní stav je zobrazen na záložce Observability v [Nastavení](./user-settings.md).

Viz také [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) a [Webhooks](./webhooks.md).

### [Stažení a import](./download-import.md)

Exportujte aktuální workflow jako JSON z panelu nástrojů Editoru (tlačítko Download); soubor obsahuje uzly a hrany. Import proveďte přetažením JSON souboru na záložku [Workflows](../tabs/workflows-tab.md) (vytvoří nový workflow) nebo na canvas (nahradí nebo sloučí). JSON musí obsahovat pole nodes; název a hrany jsou volitelné. Použijte jej pro zálohování, sdílení nebo migraci mezi instancemi.

Viz také [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) a [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portal zpřístupňuje workflow jako veřejná chat rozhraní na adrese `/chat/{slug}`. Pro každý workflow nakonfigurujte portal_enabled, slug, volitelné ověření (uživatelé portalu), streaming a nahrávání souborů. Koncoví uživatelé komunikují prostřednictvím chat rozhraní bez přihlašování do HeyMu; výstupy v podobě obrázků lze zobrazit v chatu. Workflow portalu mohou rovněž předávat na stránky kontroly [Human-in-the-Loop](./human-in-the-loop.md), když [Agent Node](../nodes/agent-node.md) vyžaduje schválení, zatímco větev `review` agenta odesílá oznámení do dalších kanálů. Použijte jej pro interní nástroje, chatboty pro zákazníky a formuláře poháněné AI.

Viz také [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) a [Drive](./drive.md).

### [Generování souborů](./file-generation.md)

Skills mohou během provádění generovat soubory, jako jsou PDF, DOCX, CSV, JSON a obrázky, zápisem do pracovního prostoru `_OUTPUT_DIR`. Heym tyto soubory automaticky zachytí, uloží a zpřístupní metadata pro stažení pod `_generated_files`, se kterými lze následně pracovat pomocí [Drive node](../nodes/drive-node.md) nebo je prohlížet na záložce [Drive](../tabs/drive-tab.md).

Viz také [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) a [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive je vrstva sdíleného úložiště a sdílení pro soubory generované pomocí skills. Umožňuje procházet soubory, vytvářet veřejné odkazy nebo odkazy chráněné heslem, uplatňovat expiraci a limity stahování, sdílet soubory pouze pro čtení s Vašimi týmy a spravovat tyto soubory programově pomocí [Drive node](../nodes/drive-node.md) nebo ručně na záložce [Drive](../tabs/drive-tab.md).

Viz také [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) a [Portal](./portal.md).
### [Zabezpečení](./security.md)

Heym vynucuje zásady hesel (délka, velká písmena, malá písmena, číslice), ukládá přístupové tokeny do HttpOnly cookies a při každém použití obměňuje refresh tokeny. Omezení rychlosti (rate limiting) se uplatňuje při přihlášení, registraci a přihlášení do [Portálu](./portal.md). [Přihlašovací údaje](./credentials.md) jsou v klidovém stavu šifrovány pomocí AES-256 (Fernet). API klíč [MCP](../tabs/mcp-tab.md) se používá pro autentizaci klienta; bezpečnost obsahu je dostupná prostřednictvím [Guardrails](./guardrails.md) na uzlech [LLM](../nodes/llm-node.md) a [Agent Node](../nodes/agent-node.md). [Execution Tokens](./execution-tokens.md) poskytují JWT s rozsahem pro jednotlivé workflow určené externím volajícím.

Viz také [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portál](./portal.md) a [Přihlašovací údaje](./credentials.md).

### [Single Sign-On](./sso.md)

Heym autentizuje uživatele vůči libovolnému externímu poskytovateli OpenID Connect – Keycloak, Okta, Entra ID, Auth0, Google – nakonfigurovanému za běhu v části **Settings → SSO** správcem instance uvedeným v `HEYM_ADMIN_EMAILS`. Zadává se pouze URL vydavatele (issuer) a přihlašovací údaje klienta; každý endpoint pochází z dokumentu pro vyhledávání poskytovatele (discovery document), takže žádný poskytovatel není pevně zakódován. Přihlášení používá Authorization Code s PKCE a ID token je ověřován proti veřejně publikovaným klíčům poskytovatele. Účty se mapují nejprve podle `(issuer, subject)` a následně podle ověřeného e-mailu, s volitelným automatickým zřizováním omezeným na allowlist e-mailových domén. Přihlášení heslem zůstává dostupné vedle SSO a lze jej vypnout, jakmile projde test připojení, přičemž účty v `HEYM_ADMIN_EMAILS` jsou vyjmuty, aby chybně nakonfigurovaný poskytovatel nemohl instanci uzamknout.

Viz také [Settings](./user-settings.md), [Zabezpečení](./security.md) a [Audit Logging](./audit.md).

### [Rozložení zátěže](./cluster.md)

Nasměrujte druhou instanci Heymu na stejnou databázi a ta se připojí jako worker. Úlohy na pozadí – cron, webhooky, volání nástrojů MCP, chat triggery – jsou mezi instancemi sdíleny podle procent, která nastaví správce instance v části **Settings → Instances**, přičemž stav každé instance, latence databáze a verze jsou v jedné tabulce. Instance spolu nikdy nekomunikují: práci přenáší Postgres, takže worker nepotřebuje otevřený port ani cestu zpět do hlavní instance. Práce, která se dotýká lokálních souborů, pracovního prostoru coding-agenta nebo nainstalovaného pluginu, vždy běží na hlavní instanci, a panel uvádí, jak velká část za posledních 24 hodin to byla, aby operátor viděl, kdy procenta nepomohou. Každé spuštění v historii uvádí instanci, která jej vykonala, a oba dialogy historie lze filtrovat podle ní.

Viz také [Settings](./user-settings.md), [Spuštění](../tabs/traces-tab.md) a [Analytics](../tabs/analytics-tab.md).

### [Integrace třetích stran](./integrations.md)

Heym se připojuje k externím službám prostřednictvím přihlašovacích údajů uložených na kartě [Přihlašovací údaje](../tabs/credentials-tab.md) (šifrovaných v klidovém stavu). Mezi podporované typy patří OpenAI, Google, Decision Model pro [Decision node](../nodes/decision-node.md), Model Router pro automatický výběr modelu (viz níže), GitHub pro [GitHub node](../nodes/github-node.md) a integrace MCP, Jira pro [Jira node](../nodes/jira-node.md), Notion pro [Notion node](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP pro [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header a FlareSolverr pro [Crawler](../nodes/crawler-node.md). Každý typ dokumentuje povinná pole; přihlašovací údaje lze sdílet s uživateli nebo [týmy](./teams.md) a odkazovat na ně podle názvu v uzlech nebo jako `$credentials.Name` ve výrazech.

### Model Router (Auto Model)

Přihlašovací údaj **Model Router** vybírá model pro každý požadavek namísto toho, aby uchovával klíč. Ukládá přihlašovací údaj rozhodovacího modelu (decision model) plus seznam Vašich stávajících přihlašovacích údajů OpenAI/Google/Custom, z nichž každý má kritéria určující, kdy má být použit, a objevuje se v každém výběru modelu s jediným modelem nazvaným **Auto**.

Spuštění, Execution Log na canvasu a Span View zobrazují obě části volby, například `Auto Model / GPT-5`, zatímco náklady zůstávají přiřazeny modelu, který běžel. Auto Model nelze kombinovat s Responses API, režimem Batch ani výstupem obrázků. Úplné chování naleznete v části [Přihlašovací údaje](./credentials.md).

Viz také [Přihlašovací údaje](./credentials.md), [Credentials Sharing](./credentials-sharing.md) a [Týmy](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blokují nebezpečné nebo nežádoucí zprávy uživatelů dříve, než dorazí k [LLM](../nodes/llm-node.md) nebo [Agent Node](../nodes/agent-node.md). Povolte je pro jednotlivé uzly a vyberte kategorie, které se mají blokovat (např. násilí, nenávistné projevy, sexuální obsah, sebepoškozování, obtěžování, nezákonná činnost). Nastavte citlivost (nízká, střední, vysoká). Při aktivaci uzel vyvolá chybu, kterou můžete zachytit pomocí [Error Handler](../nodes/error-handler-node.md). Detekce využívá moderátorské API poskytovatele nebo klasifikaci LLM v závislosti na typu přihlašovacích údajů.

Viz také [Zabezpečení](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) a [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise zahrnuje komerční licencování, profesionální podporu a služby nasazení pro týmy provozující Heym v produkci. Zahrnuje pomoc s architekturou workflow, onboarding, pokyny pro Kubernetes a škálování, prioritní podporu a vývoj na míru kolem pokročilých funkcí, jako jsou [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) a [Portal](./portal.md).

Viz také [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) a [Teams](./teams.md).

---

## Záložky dashboardu

### [Workflows](../tabs/workflows-tab.md)

Záložka Workflows je výchozím zobrazením dashboardu. Zobrazuje dvoupanelový výpis: workflows a složky jako kompaktní řádky vlevo a náhled vybraného workflow vpravo s jeho triggerem, posledním spuštěním a kroky, plus Open Workflow a Run Now. Každý řádek nese stavový štítek (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), podle kterého lze filtrovat v rozbalovacím menu Status. Workflow bez trigger uzlu je označeno podle toho, jak začalo jeho poslední spuštění – API pro HTTP volání, SubWorker pro nadřazený workflow, Portal pro jeho veřejný chat – a zůstává Manual, dokud neproběhne. Složky a podsložky zajišťují [organizaci](./workflow-organization.md). Vytvářejte workflows pomocí New Workflow, přetahováním JSON pro [import](./download-import.md) a upravujte nebo mažte je pomocí akcí na řádku. Workflows lze přesouvat mezi složkami; smazání je naplánováno (koš) před trvalým odstraněním.

Viz také [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) a [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Agentní kanban board, kde karty jsou trvalé úlohy. Nakonfigurujte každý sloupec s uspořádaným řetězcem workflow; přesunutí karty do sloupce spustí řetězec s plným kontextem karty (obsah, komentáře, historie, předchozí výstupy). Výsledky se zapisují zpět do karty – zelená při úspěchu, červená při selhání, jantarová během běhu. Následná kola znovu spouštějí řetězec aktuálního sloupce se vším, co se dosud nashromáždilo, což pohání iterativní plánování. Spuštění jsou zaznamenána v [Execution History](./execution-history.md) se zdrojem triggeru `board`. Zatímco je běh karty aktivní, **Open live** otevře přesně tento běh na animovaném canvasu s přírůstkovými Debug logy.

Viz také [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) a [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Záložka Templates umožňuje ukládat a znovu používat šablony workflow (celé workflows) a šablony uzlů (jednotlivé nakonfigurované uzly). Vytvářejte šablony workflow z editoru (Share as Template) a šablony uzlů kliknutím pravým tlačítkem na uzel. Procházejte podle viditelnosti (Everyone nebo Specific users/[teams](./teams.md)), použijte šablonu k vytvoření nového workflow nebo přidání uzlu na canvas a spravujte své sdílené šablony.

Viz také [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) a [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Záložka Variables spravuje [Global Variable Store](./global-variables.md). Vytvářejte, upravujte a mažte globální proměnné; nastavte název, hodnotu a typ hodnoty (Auto, String, Number, Boolean, Array, Object). Proměnné jsou vázány na uživatele a přetrvávají napříč spuštěními. Odkazujte na ně v jakémkoli [výrazu](./expression-dsl.md) workflow jako `$global.variableName`. Proměnné lze sdílet s ostatními uživateli nebo [týmy](./teams.md).

Viz také [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) a [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Záložka Chat představuje dlouho běžící agentní rozhraní Heym pro ovládání pracovního prostoru prostřednictvím konverzace. Vyberte [přihlašovací údaje](./credentials.md) a model, poté požádejte Chat o zodpovězení dotazů, prohlížení definic workflow, spouštění existujících workflow, shrnutí spuštění a plánů, podání zprávy o historii běhů jednoho workflow (počet spuštění, přehled stavů, poslední spuštění a na vyžádání podrobnosti jednoho běhu), informace o tom, která spuštění právě probíhají (s uplynulým časem, aktuálním uzlem a odkazem na každý živý běh), vyřešení čekajících lidských revizí, vytváření a úpravy workflow pomocí stejného AI Builder enginu, který se používá v editoru, nebo přidávání karet na kanbanové tabule přirozeným jazykem. Nové karty vždy začínají v prvním sloupci vybrané tabule; pokud je k dispozici několik tabulí a žádná nebyla určena, Chat před vytvořením karty nabídne výběr tabule.

Chat běží na backendu i po zavření prohlížeče. Zatímco odpověď streamuje, můžete odesílat další zprávy; Heym je ukládá do fronty podporované databází, umožňuje vám zařazené zprávy před jejich spuštěním upravit nebo smazat a spouští je v pořadí, jakmile aktuální odpověď skončí. Pokud asistent potřebuje podrobnosti k plánování a vrátí doplňující otázky, fronta se pozastaví, dokud na tyto otázky neodpovíte, a poté pokračuje po odpovědi k plánování.

Odpovědi streamují s markdownem, inline obrázky, náhledovými kartami workflow, sbalitelnými kartami volání nástrojů, využitím kontextu a automatickou kompresí kontextu. Chat podporuje přílohy, hlasový vstup, přehrávání čtení nahlas, akce kopírování, rychlé prompty, User Rules z [Nastavení](./user-settings.md) a [globální proměnné](./global-variables.md) jako kontext.

Viz také [AI Assistant](./ai-assistant.md), [Přihlašovací údaje](./credentials.md) a [Nastavení](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Přihlašovací údaje](../tabs/credentials-tab.md)

Záložka Přihlašovací údaje spravuje API klíče a tajné údaje používané uzly. Přidejte přihlašovací údaje podle typu (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere atd.), pojmenujte je a odkazujte na ně v uzlech workflow. Upravujte nebo mažte je z karty; sdílejte je s uživateli prostřednictvím e-mailu nebo s [týmy](./teams.md). Všechny hodnoty jsou šifrovány v klidovém stavu a v rozhraní maskovány.

Viz také [Přihlašovací údaje](./credentials.md), [Sdílení přihlašovacích údajů](./credentials-sharing.md) a [Integrace třetích stran](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Vektorová úložiště](../tabs/vectorstores-tab.md)

Záložka Vektorová úložiště spravuje vektorová úložiště používaná uzly [RAG](../nodes/rag-node.md). Vytvořte úložiště s názvem a [přihlašovacími údaji](./credentials.md) vektorového úložiště — *RAG: Qdrant + OpenAI* (externí Qdrant) nebo *RAG: Psql + OpenAI* (vlastní Postgres Heymu přes pgvector), což určuje backend úložiště — volitelně nastavte název kolekce a poté nahrajte dokumenty (PDF, TXT atd.). Spravujte obsah (zobrazení, mazání zdrojů), upravujte podrobnosti úložiště a sdílejte úložiště s uživateli. V uzlu [RAG](../nodes/rag-node.md) vyberte Database, zvolte vektorové úložiště a spusťte operace insert, upsert, delete nebo search.

Viz také [Qdrant RAG](../nodes/rag-node.md), [Přihlašovací údaje](./credentials.md) a [Týmy](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

Karta MCP konfiguruje integraci Model Context Protocol. Heym podporuje dva režimy:

**Výchozí server** – Jediný endpoint na adrese `/api/mcp/sse` zpřístupňuje všechny Workflow s povoleným MCP. Zobrazte a znovu vygenerujte svůj API klíč, zkopírujte připravený JSON pro klienta, připojte Cursor jedním kliknutím nebo postupujte podle nastavení Claude s automatickou registrací OAuth.

**Pojmenované servery** – Vytvořte více izolovaných MCP endpointů, každý s vlastní URL založenou na UUID (`/api/mcp/servers/{uuid}/sse`) a nezávislým API klíčem. Přiřaďte konkrétní Workflow ke každému serveru, aby různí AI klienti nebo týmy viděli pouze nástroje, které potřebují. Každý pojmenovaný server podporuje stejné metody ověření (API klíč, Claude OAuth) a má vlastní zkratky Copy JSON a Add to Cursor. Oba endpointy podporují SSE transport (GET) a Streamable HTTP transport (POST). Přepnutím Workflow uvnitř pojmenovaného serveru se přesune na začátek přiřazeného seznamu, aby změněný řádek zůstal v zobrazení.

**Nástroj Heym chat** – Oba režimy mohou také zpřístupnit engine [Chat](../tabs/chat-tab.md) jako jediný nástroj `heym_chat`, přepínaný pro každé rozhraní s vlastními Přihlašovacími údaji LLM a modelem (předvyplněnými z vašeho preferovaného modelu v [Settings](./user-settings.md)). MCP klient odešle jednu zprávu `message` v přirozeném jazyce a engine udělá zbytek: sestavování, úpravy a spouštění Workflow, analytiku, Spuštění, stav běhu v reálném čase, Plány, boards a karty, týmy, globální Proměnné, vyhledávání v dokumentaci a rozhodnutí s člověkem ve smyčce. Schopnosti přidané do Chat později jsou dostupné prostřednictvím stejného nástroje bez další registrace. Každé volání je uloženo v historii karty Chat jako konverzace označená plug-markem a vrací `conversation_id`, který klient může předat zpět pro pokračování vlákna.

Viz také [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) a [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Karta Traces zobrazuje stopy spuštění [LLM](../nodes/llm-node.md). Záhlaví statistik nad seznamem shrnuje vybrané časové rozmezí pomocí KPI karet (Calls, Tokens, Cost, Avg Latency, Error %) a tří grafů — Tokens by Model, Cost by Model a Calls Over Time (skládaný úspěch vs chyba). Jediný přepínač **Time range** (1h / 24h / 7d / 30d / All; výchozí 7 dní) filtruje grafy i seznam společně. Cost se počítá z per-user [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table); modely bez cen se zobrazí jako inline upozornění s odkazem na ni. Otevřete libovolnou stopu pro zobrazení request a response payloadů, časového rozpadu (llm_ms, tools_ms, mcp_list_ms), volání nástrojů (název, argumenty, výsledek) a zahrnutých skills. Rozbalené události zobrazují JSON — včetně MCP a JSON-RPC payloadů — jako sbalitelný strom s první úrovní otevřenou ve výchozím stavu; **Tree / Raw** přepíná zpět na původní text a neplatný JSON zůstává čitelný. Použijte stopy k ladění chování [Agent Node](../nodes/agent-node.md) a [LLM](../nodes/llm-node.md) a ke kopírování nebo exportu payloadů.

Viz také [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) a [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Výstrahy](../tabs/alerts-tab.md)

Záložka Výstrahy definuje prahové podmínky v rámci časového okna a upozorní Vás, když jsou překročeny. Čtyři typy výstrah pokrývají otázky, které operátoři skutečně řeší: **prahová hodnota chyb** (selhalo to více než Nkrát v okně), **doba trvání workflow** (zpomalily se běhy, měřeno jako maximum, průměr nebo p95), **náklady na token / USD** (překročily výdaje rozpočet, vyhodnoceno prostřednictvím stejné cenové tabulky jako [Spuštění](../tabs/traces-tab.md)) a **počet spuštění** (běželo to mnohem častěji, než by mělo). Každý typ se vyhodnocuje v rámci Vámi zvoleného okna, nikdy na základě jediné události, protože jeden neúspěšný běh je šum a nárazový výskyt je incident. Výstrahy sledují jeden workflow nebo všechny workflow, ke kterým máte přístup.

Průvodce o pěti krocích Vás provede typem, rozsahem, podmínkou, reakcí a kontrolou. Krok Kontrola nejprve provede **backtest** podmínky a oznámí, jak často by se spustila za posledních 24 hodin až 7 dní, takže příliš nízká prahová hodnota je odhalena před uložením, nikoli až poté, co někoho upozorní. Popište, co chcete, přirozeným jazykem a AI vyplní každý krok, který může, a označí své odhady; částečný požadavek stále posune průvodce vpřed a otevře se na prvním kroku, který ještě vyžaduje rozhodnutí, místo aby Vás nutil začínat znovu. Ve výchozím nastavení se výstraha spustí jednou a zůstane tichá, dokud se metrika nezotaví; místo toho ji můžete nechat opakovat v intervalu.

V kroku reakce může výstraha vytvořit a přiřadit nový workflow, který se spustí při jejím vyvolání, použít workflow, které již máte, nebo nedělat nic. Payload při vyvolání nese pozorovanou hodnotu, prahovou hodnotu, okno a workflow, které k číslu přispěly, což je způsob, jakým výstrahy dosáhnou Slacku, e-mailu nebo Telegramu pomocí uzlů, které již máte. Historie vyvolání zaznamenává, co platilo v okamžiku, kdy se každá výstraha spustila, a uchovává se po dobu 90 dní; potvrzení vyvolání změní odznak z Firing na Acknowledged, aniž by předstíralo, že podmínka pominula. Záložka [Chat](../tabs/chat-tab.md) dokáže odpovědět, jaké výstrahy existují a proč nebo kdy se některá spustila. Výstrahy lze sdílet s uživateli a [týmy](../tabs/teams-tab.md).

Viz také [Analytika](../tabs/analytics-tab.md), [Spuštění](../tabs/traces-tab.md) a [Historie spuštění](./execution-history.md).

### [Analytika](../tabs/analytics-tab.md)

Záložka Analytika zobrazuje metriky a trendy spuštění. Souhrnné statistiky zahrnují celkový počet spuštění, míru úspěšnosti, míru chybovosti, rozpis latence a celkový **Ušetřený čas** (součet odhadovaných ušetřených minut každého workflow na běh × jeho úspěšné běhy). Nejčastěji používané uvádí stejný součet pro každý workflow. Vyberte základní časový rozsah (24h, 7d, 30d nebo vše), volitelně filtrujte podle workflow a poté přetažením přes libovolný graf přejděte k vybranému rozsahu dat. Grafy a tabulky workflow se obnoví podle výběru a automatické obnovení udržuje metriky aktuální. Doplňuje [Historii spuštění](./execution-history.md) a zobrazení [Plány](../tabs/scheduled-tab.md), když potřebujete jak minulé výsledky, tak nadcházející běhy.

Viz také [Historie spuštění](./execution-history.md), [Plány](../tabs/scheduled-tab.md) a [Evaluace](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Záložka Dashboard je prostor ve stylu Grafanu, kde vytváříte mřížky widgetů s grafy, z nichž každý je vykreslen z vlastního skrytého workflow Heym. Uchovávejte tolik dashboardů, kolik potřebujete, a každý sdílejte s uživateli nebo týmy, pouze pro čtení nebo s možností úprav; widgety vždy běží s přihlašovacími údaji vlastníka, takže všichni vidí stejná data. Popište metriku přirozeným jazykem a AI vygeneruje widget, nebo přidejte widget ručně a vyberte typ grafu s náhledem na vzorových datech: sloupcový, čárový, plošný, koláčový, tabulka, číselný, gauge, bodový, proporční, sloupcový gauge, text nebo HITL. HITL je karusel Vašich čekajících lidských kontrol. Záhlaví zobrazuje `1/n pending`. Název workflow otevře daný běh na canvasu. **Approve**, **Request changes** a **Reject** jej vyřeší a ikona historie vedle názvu widgetu otevře daný běh v dialogu historie na stejné stránce. Widgety ukládají své výsledky do mezipaměti, lze je doladit pomocí AI (každá změna se uloží do [Historie úprav](./edit-history.md)), klonovat společně s jejich kompletním workflow, přeskupit pomocí Tidy up a v režimu úprav přetahovat nebo měnit jejich velikost. Protože každý widget je workflow, jakákoli data, která dokážete načíst — volání [HTTP](../nodes/http-node.md), dotaz [BigQuery](../nodes/bigquery-node.md), vyhledání [RAG](../nodes/rag-node.md) nebo výstup [LLM](../nodes/llm-node.md) — se mohou stát grafem.

Viz také [Uzel Chart Output](../nodes/chart-output-node.md), [Analytika](../tabs/analytics-tab.md) a [Historie spuštění](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>
### [Evaluace](../tabs/evals-tab.md)

Záložka Evaluace (na `/evals`) Vám umožňuje vytvářet evaluační sady, přidávat nebo generovat testovací případy, optimalizovat prompt sady a spouštět evaluace proti workflow s [uzlem Agent](../nodes/agent-node.md). Vyberte jeden nebo více modelů, zvolte metodu skórování (Exact Match, Contains nebo LLM-as-Judge), volitelně nechte samostatný model nebo [Rozhodovací uzel](../nodes/decision-node.md) posuzovat odpovědi LLM-as-Judge, nastavte počet spuštění na test (plus temperature a reasoning effort pro Exact Match a Contains) a poté porovnejte pass/fail a výstupy jednotlivých modelů. Prohlédněte si historii spuštění minulých evaluací včetně použitého judge, znovu spusťte evaluaci se stejným judge, exportujte ji jako JSON a ověřte podkladové chování v [Spuštěních](../tabs/traces-tab.md).

Viz také [Uzel Agent](../nodes/agent-node.md), [Spuštění](../tabs/traces-tab.md) a [Historie spuštění](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Týmy](../tabs/teams-tab.md)

Záložka Týmy Vám umožňuje vytvářet a spravovat týmy. Vytvořte tým, přidejte členy podle e-mailu a odebírejte členy (tvůrce nelze odebrat). Sdílejte [workflow](../tabs/workflows-tab.md), [šablony](../tabs/templates-tab.md), [přihlašovací údaje](../tabs/credentials-tab.md), [proměnné](../tabs/global-variables-tab.md), [vektorová úložiště](../tabs/vectorstores-tab.md) a [soubory Drive](../tabs/drive-tab.md) s týmy prostřednictvím příslušných dialogů pro sdílení; všichni členové týmu získají přístup. Upravte název a popis týmu nebo tým smažte (odstraní všechna sdílení týmu).

Viz také [Týmy](./teams.md), [Sdílení přihlašovacích údajů](./credentials-sharing.md) a [Organizace workflow](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Plány](../tabs/scheduled-tab.md)

Záložka Plány zobrazuje všechna aktivní [Cron](../nodes/cron-node.md) workflow ve vizuálním kalendáři. Přepínejte mezi denním, týdenním a měsíčním zobrazením a zjistěte, kdy jsou Vaše automatizace naplánovány ke spuštění, a poté se v případě potřeby úpravy plánu vraťte k příslušnému [workflow](../tabs/workflows-tab.md).

Viz také [Cron](../nodes/cron-node.md), [Analytika](../tabs/analytics-tab.md) a [Historie spuštění](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

### [Logy](../tabs/logs-tab.md)

Záložka Logy zobrazuje logy Docker kontejnerů pro stack Heym (backend, frontend, PostgreSQL). Vyberte kontejner(y), filtrujte podle úrovně logu (All, INFO, WARNING, ERROR, DEBUG) a vyhledávejte v logech. Použijte ji pro ladění a řešení problémů. Pro logy spuštění workflow (výsledky uzlů, výstupy) použijte místo toho [Historii spuštění](./execution-history.md), [Spuštění](../tabs/traces-tab.md) nebo panel Debug v editoru.

Viz také [Historie spuštění](./execution-history.md), [Spuštění](../tabs/traces-tab.md) a [Funkce Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

### [Datové tabulky](../tabs/datatable-tab.md)

Záložka Datové tabulky Vám umožňuje vytvářet a spravovat strukturované datové tabulky v rámci Heym. Definujte typované sloupce (string, number, boolean, date, JSON), spravujte řádky pomocí inline editace dvojklikem, importujte/exportujte CSV a sdílejte tabulky s uživateli nebo [týmy](./teams.md) s právy pro čtení/zápis. Pomocí [uzlu DataTable](../nodes/datatable-node.md) přistupujte k tabulkám programově ve workflow. Připnutá sekce **Systémové tabulky** v horní části obsahuje **Tabulku nákladů LLM**: zobrazení ceníku jednotlivých modelů s pevným schématem, načítané z Helicone na pozadí (TTL 24 hodin, ruční obnovení), kde každý uživatel může přepsat ceny nebo přidat vlastní řádky pro modely, které Helicone neuvádí. Tato cenová pravidla řídí KPI nákladů a graf nákladů jednotlivých modelů na záložce [Spuštění](../tabs/traces-tab.md).

Viz také [Uzel DataTable](../nodes/datatable-node.md), [Spuštění](../tabs/traces-tab.md), [Struktura workflow](./workflow-structure.md) a [Týmy](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>
### [Drive](../tabs/drive-tab.md)

Karta Drive zobrazuje všechny soubory vygenerované skilly napříč Vašimi workflow. U každého souboru uvádí název, typ, velikost, zdrojový uzel, datum vytvoření a stav sdílení v rámci týmu a poskytuje ovládací prvky pro vyhledávání, autentizované stahování, sdílení, mazání a stránkování. Jedná se o dashboardový protějšek k [File Generation](./file-generation.md), referenci [Drive](./drive.md) a [uzlu Drive](../nodes/drive-node.md).

Viz také [Drive](./drive.md), [File Generation](./file-generation.md) a [uzel Drive](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Watch Drive demo</a></p>
