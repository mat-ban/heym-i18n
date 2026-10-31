# Karta Chat

Karta **Chat** poskytuje přímé rozhraní pro konverzaci s LLM. Použijte ji k testování modelů, kladení otázek, spouštění existujících workflow nebo k vytvoření nového workflow z požadavku v přirozeném jazyce.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Přehrát ukázku Chat</a></p>

## Nastavení

1. Vyberte [credential](./credentials-tab.md) (API klíč pro OpenAI, Google atd.)
2. Zvolte model z rozbalovacího seznamu (modely se načítají z vybraného credential)
3. Začněte psát a odesílejte zprávy

Konverzaci můžete zahájit také z chatovacího pole na kartě [Workflows](./workflows-tab.md). Odešle vaši první zprávu a otevře zde novou konverzaci s již streamovanou odpovědí.

## Funkce

- **Kontext globálních proměnných** – Vaše [globální proměnné](../reference/global-variables.md) jsou dostupné LLM, takže se můžete dotazovat na uložené hodnoty nebo na ně odkazovat
- **Kontext šablon pracovního prostoru** – Sdílené šablony workflow a uzlů ve vašem pracovním prostoru jsou zahrnuty jako kontext, takže Chat může odpovídat na otázky o dostupných šablonách
- **Dlouho běžící agent** – Chat pokračuje v práci na backendu, i když zavřete prohlížeč, takže se můžete vrátit z jiného zařízení a pokračovat ve stejné konverzaci
- **Vytváření workflow** – Požádejte Chat o vytvoření nebo nastavení workflow a on použije stejný engine Workflow AI Builder jako asistent v editoru ke generování a uložení workflow
- **Vytváření úkolů v Kanbanu** – Požádejte přirozeně o přidání úkolu nebo vytvoření karty. Chat ji přidá do prvního sloupce požadované tabule; pokud máte více tabulí a žádnou nepojmenujete, Chat před vytvořením karty zobrazí výběr tabule
- **Fronta navazujících zpráv** – Posílejte další zprávy, zatímco odpověď streamuje. Zařazené zprávy jsou trvale uloženy, lze je před spuštěním upravit nebo smazat a spouštějí se v pořadí po dokončení aktivní odpovědi
- **Přestávky kvůli plánování** – Když Chat potřebuje podrobnosti k plánování, položí doplňující otázky a pozastaví zařazené navazující zprávy, dokud neodpovíte. Po dokončení plánovací odpovědi se zařazené zprávy obnoví
- **Credentials** – Když workflow, které Chat vytváří nebo upravuje, potřebuje credential, Chat se zeptá, který použít, nabídne vytvoření nového v konverzaci nebo vám umožní pokračovat bez něj. Můžete také požádat Chat o vytvoření credential nebo o úpravu toho, který vlastníte; otevře formulář credential v konverzaci. Model vidí název a typ credential, nikdy jeho hodnoty, a to jak pro credentials, které vlastníte, tak pro ty, které s vámi někdo sdílí. Uzly LLM a Agent přidané Chatem běží na credential a modelu vybraném pro chat, včetně sdílených credentials; když Chat upravuje workflow, jeho stávající uzly LLM a Agent si svůj credential a model ponechají. Viz [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Dashboards** – Zeptejte se, jaké [dashboards](./dashboard-tab.md) máte, co je na některém z nich nebo na kterém dashboardu se nachází workflow. Požádejte Chat o přidání nového widgetu na dashboard (umístí tam prázdný widget, pak sestaví a otestuje jeho workflow), umístění existujícího workflow na dashboard jako widgetu, přejmenování nebo smazání widgetu nebo uspořádání rozvržení dashboardu. Heym Work zobrazuje tyto dashboardy jako své stránky. Viz [Dashboard › Z Chatu a MCP](./dashboard-tab.md#z-chatu-a-mcp)
- **Datové tabulky** – Když workflow vytvářený nebo upravovaný Chatem ukládá záznamy, Chat se zeptá, jakou [datovou tabulku](./datatable-tab.md) použít, nebo nabídne vytvoření nové se sloupci, které workflow potřebuje. Může také kontrolovat řádky, přidávat nebo odebírat sloupce a přímo vkládat, aktualizovat nebo mazat řádky v tabulkách, které vlastníte nebo k nim máte přístup pro zápis. Zadejte název tabulky nebo odkaz DataTable. Odstranění sloupců a vymazání všech řádků vyžaduje potvrzení; přidání sloupců zachová stávající data. Viz [AI asistent › Datové tabulky](../reference/ai-assistant.md#data-tables)
- **Streamované odpovědi** – Sledujte výstup modelu během streamování
- **Zastavení odpovědi** – Přerušte aktuálně streamovanou odpověď kdykoli; zastavení také vymaže zařazené zprávy pro danou konverzaci
- **Vykreslování Markdownu** – Odpovědi podporují formátování Markdownu včetně inline obrázků
- **Zobrazení obrázků** – Obrázky vložené v odpovědích (např. z generování obrázků LLM) se zobrazují inline; kliknutím na obrázek jej zobrazíte na celou obrazovku. Pro zavření zobrazení na celou obrazovku stiskněte **Esc** nebo tlačítko zpět (mobil)
- **Kopírování zpráv** – Zkopírujte libovolnou zprávu do schránky
- **Vymazání chatu** – Zahajte novou konverzaci
- **Hlasový vstup** – Použijte tlačítko mikrofonu pro převod řeči na text (podporováno prohlížečem). Po zastavení nahrávání může Heym mírně vyčistit přepis, než jej odešlete
- **Plánované workflow** – Zeptejte se, kdy se spouštějí cron workflow (dnes, tento týden, tento měsíc nebo vlastní rozsah dat). Asistent používá stejná data plánu jako karta [Scheduled](./scheduled-tab.md) a může omezit výsledky na workflow, které vlastníte, nebo zahrnout ty, které jsou s vámi sdílené
- **Historie spuštění workflow** – Zeptejte se na jedno workflow („kolikrát se spustila denní zpráva?", „selhalo to?", „kdy naposledy běželo?"). Chat vyhledá workflow podle jeho ID a odpoví z jeho počtu spuštění, rozložení stavů, času prvního a posledního spuštění a průměrné doby trvání. Zeptejte se, proč spuštění selhalo nebo co vrátilo, a Chat poté otevře toto jedno spuštění a přečte jeho vstupy, výstupy a chyby jednotlivých uzlů
- **Kde běhy selhávají a proč jsou pomalé** – Zeptejte se, kde vaše workflow selhávají nebo proč jsou pomalé, a Chat uvede workflow, které běžely nejčastěji, nejvíce selhávaly a jsou nejpomalejší, a také typy uzlů, které zabírají nejvíce času (průměr na volání a celkem), nejvíce selhávají a běží nejčastěji, tedy stejná čísla jako na kartě [Analytics](./analytics-tab.md). Typy uzlů se počítají pro běhy od verze, která přidala analýzu uzlů. Zeptejte se na poslední hodinu, 3 nebo 6 hodin, 24 hodin, 7 nebo 30 dní či celou historii; hodinová okna začínají v celou hodinu, takže „poslední hodina“ v 15:20 pokrývá čas od 14:00 do současnosti.
- **Živý stav spuštění** – Zeptejte se, co právě běží, a Chat odpoví počtem, názvy workflow, jak dlouho každé spuštění běží, na kterém uzlu se nachází, a přímým odkazem na živé spuštění
## Používání Chatu z MCP klienta

Engine Chatu lze používat i mimo prohlížeč. Zapněte **Heym Agent** na [kartě MCP / A2A](./mcp-tab.md) a klienti MCP (Claude, Cursor a jakékoli jiné nástroje podporující MCP) získají jediný nástroj `heym_chat`, který spouští tento stejný engine se všemi jeho schopnostmi. Zaškrtněte také **Povolit A2A** a další agenti mu mohou posílat úkoly přes [A2A](../reference/a2a.md); tyto konverzace zobrazují v seznamu ikonu sítě.

Tyto konverzace se ukládají do historie této karty a v seznamu konverzací jsou označeny ikonou zástrčky. Otevřete některou z nich a přečtěte si, na co se klient ptal, prohlédněte si karty nástrojů, které spustil, a pokračujte ve vlákně sami. Odpovídání na doplňující otázku funguje stejně, ať už tah začal zde nebo z MCP klienta.

Přes MCP Chat nezobrazuje, nevybírá ani nevytváří přihlašovací údaje. Workflow, které sestaví, ponechávají pole přihlašovacích údajů prázdná a v odpovědi jsou uvedeny uzly, které přihlašovací údaj vyžadují, abyste je mohli nastavit v editoru.

Datové tabulky fungují i přes MCP: Chat může přímo upravovat sloupce a řádky, vytvářet tabulky a zapojovat je do workflow. Dotazy k tabulkám a potvrzení o smazání přicházejí jako text ve výsledku; odpovězte se stejným `conversation_id`.

## Limit kontextu

Chat udržuje v kontextu až 25 posledních zpráv. Starší zprávy jsou ořezány, aby zůstaly v limitech modelu.

## Vytváření workflow

Když Chatu řeknete, aby vytvořil, sestavil, vygeneroval nebo nastavil workflow, vytvoří nové uložené workflow s vygenerovaným názvem a popisem. Odpověď obsahuje náhled plátna pouze pro čtení s vygenerovanými uzly a hranami a odkaz **Open workflow**, který otevře editor workflow v nové kartě prohlížeče. Tlačítko **Run** na kartě náhledu použijte, když chcete workflow spustit.

Následná zpětná vazba ve stejném chatu upravuje toto workflow místo vytvoření dalšího. Například poté, co Chat vytvoří workflow, můžete říct „přidej krok schválení", „změň formát výstupu" nebo „şöyle yap" a Chat aktualizuje uložené workflow a obnoví náhled.

To je nejvhodnější pro požadavky, u kterých chcete, aby byla práce provedena jako opakovaně použitelná automatizace, ne jen jako jednorázová odpověď.

## Vytváření úkolů Kanban

Zeptejte se Chatu běžným jazykem, například „Přidej úkol s názvem Opravit chybu přihlášení" nebo
„Vytvoř novou kartu Aktualizovat dokumentaci na nástěnce Launch." Popis můžete uvést ve
stejném požadavku. Chat vždy vytvoří kartu v prvním sloupci vybrané nástěnky.

Pokud má váš pracovní prostor několik nástěnek a žádnou neidentifikujete, Chat se pozastaví
s výběrem nástěnky s jedinou volbou. Vyberte nástěnku a dokončete vytvoření karty. Není vyžadován
žádný slash příkaz ani speciální formát zprávy.

## Dotaz na to, co běží

Zeptejte se běžným jazykem — „co běží?", „kolik workflow je právě aktivních?",
„na kterém uzlu je noční report?" — a Chat podá živý přehled:

- **Kolik** spuštění probíhá, rozděleno na běžící a čekající na lidskou kontrolu
- **Kterým workflow** patří, podle názvu
- **Jak dlouho** každé spuštění běží (například `1m 35s`, `3h 25m`)
- **Který uzel** právě provádí, podle jeho popisku na plátně, plus poslední uzel, který dokončil
- **Odkaz** na každé živé spuštění, který otevře plátno s přehráváním tohoto spuštění

Spuštění pozastavená pro [Human-in-the-Loop](../reference/human-in-the-loop.md) nebo kontrolu Codex jsou hlášena jako čekající na vás, ne jako běžící. Jsou to stejná data jako odznak aktivních spuštění v záhlaví, takže Chat a odznak se nikdy nerozcházejí. U spuštění, která již skončila, se místo toho zeptejte na nedávná spuštění — to čte [Execution History](../reference/execution-history.md).

## Dotazy ke spuštění

Vyberte spuštění Workflow v [Execution History](../reference/execution-history.md#ask-ai), v editoru nebo v All History, a klikněte na **Zeptat se AI** vedle názvu dialogu. Chat otevře novou konverzaci se dvěma čipy nad polem zprávy:

- **Workflow:** název Workflow
- **Execution:** prvních několik znaků ID vybraného spuštění

Čip odeberete jeho **×**, pokud jej chcete vynechat. Poté položte otázku, například „proč toto spuštění trvalo tak dlouho?“, „co zde selhalo?“ nebo „můžete to opravit?“. Zbývající čipy se k této zprávě připojí s úplnými ID, takže Chat přímo čte vstupy, výstupy a trace jednotlivých uzlů spuštění namísto hledání Workflow. K opravě Workflow Chat změnu uloží, otestuje a ověří, jak je popsáno v [Vytváření workflow](#vytvareni-workflow).

Odeslaná zpráva zobrazuje čipy pod vaší otázkou. Patří pouze k této zprávě; navazující otázky ve stejné konverzaci si zachovají kontext z historie.

## Dotaz na alerty

Chat umí odpovídat na otázky o [alerech](./alerts-tab.md), která jste definovali:

- **Co existuje** — „jaká mám alery?", „je nějaký alert na workflow faktur?",
  „která alery právě vyvolávají?"
- **Jak je které nastaveno** — „jaký je práh u alertu na náklady?", „jak je to nakonfigurováno?"
- **Proč a kdy se vyvolalo** — „proč se vyvolal alert na náklady?", „kdy se naposledy spustil?"

U otázky „proč se vyvolalo" Chat přečte záznam o vyvolání a uvede skutečnou pozorovanou
hodnotu, práh a přesné okno, které bylo vyhodnoceno, plus související podrobnosti:
identifikátory selhaných spuštění a chybové zprávy u chybových alertů, útratu podle modelu u alertů na náklady nebo
rozpad podle zdroje triggeru u alertů na počet spuštění. Uvádí, co platilo v době, kdy se alert
vyvolal, místo přepočtu okna, protože okno již uplynulo a nový výpočet
může dát jinou odpověď.

## Uživatelská pravidla

[Uživatelská pravidla](../reference/user-settings.md) (nakonfigurovaná v Nastavení) se automaticky vkládají do každé konverzace Chatu jako instrukce na úrovni systému. Nastavte je jednou a aplikujte trvalé předvolby na všechny požadavky chatu.

## Práce s Evals

Chat může vytvářet, upravovat a spouštět sady v [Evals](./evals-tab.md), jak sady promptů, tak sady agentů:

- **Sada promptů**: „vytvoř sadu promptů pro můj prompt odpovědi podpory s 8 testovacími případy a porovnej gpt-4o s gpt-4.1-mini“. Chat sepíše testovací případy s očekávanými odpověďmi, vybere metodu hodnocení a sadu uloží.
  - Před vytvořením sady určí, které přihlašovací údaje LLM a modely použít. S přesně jedněmi údaji LLM použije tyto a oznámí to; jinak se zeptá.
  - Pro hodnocení LLM-as-Judge se také zeptá, zda má odpovědi hodnotit samostatný rozhodčí.
- **Sada agenta**: „zkontroluj, zda můj agent podpory vždy prohledává dokumentaci a nikdy neodesílá e-maily“. Chat vyhledá agenta a uloží kontroly nástrojů a prahové hodnoty. Na požádání spustí workflow a pro každý běh vygeneruje jiný vstup.
  - Běhy sad agentů jsou skutečné běhy workflow, takže dochází k jejich vedlejším účinkům. Chat uvádí, kolik běhů spouští.
- **Baseline**: Chat může s výchozí hodnotou agenta pracovat třemi způsoby:
  - Nahlásit ji z posledních běhů agenta.
  - Sestavit ji z běhů, které sám spustí („spusť ho 5krát a použij to jako baseline“).
  - Uložit čísla, která mu zadáte („nastav baseline na 3 sekundy p95 a 0,01 $ za běh“).
- **Běhy**: Chat čeká na běh až jednu minutu a poté oznámí výsledek:
  - U sady promptů: počet úspěšných testů každého modelu a případy, které selhaly.
  - U sady agenta: míru úspěšnosti, neúspěšné kontroly a odchylku od baseline.
  - Delší běh pokračuje v Evals; požádejte Chat, aby jej zkontroloval znovu.

Poté, co Chat vytvoří nebo upraví sadu, odpověď zobrazí kartu s názvem sady, jejím typem a tlačítkem **Otevřít v Evals**, podobně jako karta uloženého workflow. Přes MCP výsledek `heym_chat` uvádí odkaz na každou sadu uloženou v tomto volání.

Totéž funguje z klienta MCP prostřednictvím `heym_chat` (viz [Používání Chatu z klienta MCP](#používání-chatu-z-klienta-mcp)). Nástroje pro hodnocení zůstávají uvnitř `heym_chat`; klienti MCP je nevidí jako samostatné nástroje.

AI asistent v editoru sady nevytváří.

## Práce s Evals

Chat může vytvářet, upravovat a spouštět sady v [Evals](./evals-tab.md), jak sady promptů, tak sady agentů:

- **Sada promptů**: „vytvoř sadu promptů pro můj prompt odpovědi podpory s 8 testovacími případy a porovnej gpt-4o s gpt-4.1-mini“. Chat sepíše testovací případy s očekávanými odpověďmi, vybere metodu hodnocení a sadu uloží.
  - Před vytvořením sady určí, které přihlašovací údaje LLM a modely použít. S přesně jedněmi údaji LLM použije tyto a oznámí to; jinak se zeptá.
  - Pro hodnocení LLM-as-Judge se také zeptá, zda má odpovědi hodnotit samostatný rozhodčí.
- **Sada agenta**: „zkontroluj, zda můj agent podpory vždy prohledává dokumentaci a nikdy neodesílá e-maily“. Chat vyhledá agenta a uloží kontroly nástrojů a prahové hodnoty. Na požádání spustí workflow a pro každý běh vygeneruje jiný vstup.
  - Běhy sad agentů jsou skutečné běhy workflow, takže dochází k jejich vedlejším účinkům. Chat uvádí, kolik běhů spouští.
- **Baseline**: Chat může s výchozí hodnotou agenta pracovat třemi způsoby:
  - Nahlásit ji z posledních běhů agenta.
  - Sestavit ji z běhů, které sám spustí („spusť ho 5krát a použij to jako baseline“).
  - Uložit čísla, která mu zadáte („nastav baseline na 3 sekundy p95 a 0,01 $ za běh“).
- **Běhy**: Chat čeká na běh až jednu minutu a poté oznámí výsledek:
  - U sady promptů: počet úspěšných testů každého modelu a případy, které selhaly.
  - U sady agenta: míru úspěšnosti, neúspěšné kontroly a odchylku od baseline.
  - Delší běh pokračuje v Evals; požádejte Chat, aby jej zkontroloval znovu.

Poté, co Chat vytvoří nebo upraví sadu, odpověď zobrazí kartu s názvem sady, jejím typem a tlačítkem **Otevřít v Evals**, podobně jako karta uloženého workflow. Přes MCP výsledek `heym_chat` uvádí odkaz na každou sadu uloženou v tomto volání.

Totéž funguje z klienta MCP prostřednictvím `heym_chat` (viz [Používání Chatu z klienta MCP](#používání-chatu-z-klienta-mcp)). Nástroje pro hodnocení zůstávají uvnitř `heym_chat`; klienti MCP je nevidí jako samostatné nástroje.

AI asistent v editoru sady nevytváří.

## Související

- [MCP / A2A Tab](./mcp-tab.md) – Zpřístupněte tento engine MCP klientům jako nástroj `heym_chat`
- [Settings](../reference/user-settings.md) – Nastavte User Rules uplatňovaná na všechny chat požadavky
- [Credentials Tab](./credentials-tab.md) – Přidávejte a spravujte API klíče
- [Variables Tab](./global-variables-tab.md) – Globální proměnné dostupné pro Chat
- [Node Types](../reference/node-types.md) – LLM a Agent uzly pro workflows
- [Agent Node](../nodes/agent-node.md) – AI Agent s voláním nástrojů
- [AI Assistant](../reference/ai-assistant.md) – Asistent editoru poháněný stejným DSL pro tvorbu workflows
- [Execution History](../reference/execution-history.md) – Zobrazte minulá spuštění (tlačítko History v záhlaví)
- [Scheduled Tab](./scheduled-tab.md) – Kalendář nadcházejících cron spuštění (stejná data, která může Chat shrnout)
- [Alerts Tab](./alerts-tab.md) – Prahová upozornění, která může Chat vypsat a vysvětlit
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktní orientace v aplikaci pro tuto stránku
- [Chat Voice (TTS & STT)](../reference/chat-voice.md) – Předčítání zpráv a komunikace hands-free s ElevenLabs

## Volání nástrojů a velikost kontextu

Pokaždé, když asistent zavolá nástroj (spustí workflow, vypíše spuštění, vytvoří nový workflow), objeví se v konverzaci sbalitelná karta. Karta se během běhu nástroje automaticky rozbalí a zobrazí přesné argumenty. Po dokončení nástroje se karta sbalí do jednořádkového souhrnu s uplynulým časem. Kliknutím na libovolnou kartu znovu rozbalíte argumenty a souhrn odpovědi.

Malý kroužkový odznak pod vstupem zobrazuje aktuální využití kontextu jako procento okna modelu (např. `12% · ~9.2k`). Při najetí na odznak se zobrazí rozpis: system prompt, AGENTS.md, blok workflows, user rules, historie a váš koncept vstupu. Když využití překročí 80 %, kroužek získá jantarovou barvu; při 95 % zčervená.

Pokud se využití přiblíží limitu, Heym automaticky zkomprimuje starší zprávy do krátkého souhrnu pomocí stejného mechanismu, který používají agent uzly. Inline se objeví karta „Context compressed", která ukazuje, co se stalo.
