# Karta MCP / A2A / A2A

Karta **MCP** konfiguruje integraci Model Context Protocol (MCP), a jako servery [Agent2Agent](https://github.com/google/A2A) (A2A 1.0), kterým mohou ostatní agenti delegovat úkoly. MCP umožňuje AI klientům (Claude, ChatGPT, Gemini, Cursor a jakémukoli nástroji kompatibilnímu s MCP) volat vaše Heym workflows jako nástroje.

Heym podporuje dva režimy: **výchozí server**, který zpřístupňuje všechny workflows s povoleným MCP pod jedním endpointem, a **pojmenované servery**, které každé logické skupině workflows přidělují vlastní vyhrazenou URL a API klíč.

Oba režimy mohou zpřístupnit dva druhy nástrojů: jednotlivé **workflows** a **nástroj Heym chat** — celý engine [karty Chat](./chat-tab.md) za jediným nástrojem `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

## Výchozí MCP server

Výchozí server je vždy dostupný na `{origin}/api/mcp/sse`. Všechny workflows s povoleným MCP se zde zobrazují jako nástroje.

### MCP API klíč

- Klíče jsou uloženy jako SHA-256 digesty, takže Heym vám nemůže zobrazit existující klíč. Karta uvádí, zda je klíč nastaven, nikoli jaký je.
- **Generate** / **Regenerate** – Nový klíč se zobrazí jednou, hned po vytvoření. Zkopírujte si jej tehdy; po opětovném načtení karty se již nezobrazí.
- Tento klíč použijte při připojování Claude Desktop, Cursor nebo jiných MCP klientů k Heymu.
- Ztratili jste klíč? Vygenerujte jej znovu. Předchozí klíč okamžitě přestane fungovat.

### Způsoby připojení

- **API Key** – Pro programová připojení použijte MCP API klíč. Karta umí zkopírovat připravenou JSON konfiguraci a obsahuje tlačítko **Add to Cursor** pro nastavení Cursoru jedním kliknutím.
- **Claude** – Karta zobrazuje URL MCP serveru a kroky nastavení pro Claude. Pole OAuth Client ID a Secret ponechte prázdná; Claude se zaregistruje automaticky a autentizuje se přes Heym OAuth.
- **ChatGPT** – Karta zobrazuje URL serveru MCP a kroky nastavení pro aplikaci ChatGPT. Zapněte vývojářský režim, vytvořte aplikaci s danou URL a zvolte OAuth; ChatGPT se zaregistruje automaticky.
- **Gemini** – Karta zobrazuje URL serveru MCP a kroky nastavení pro vlastní aplikaci Gemini: na gemini.google.com přejděte do **Settings → Connected Apps → Add a custom app**, vložte URL a sekci **Advanced features** ponechte zavřenou; Gemini se automaticky zaregistruje a ověří přes Heym OAuth. Po připojení funguje Heym také v mobilní aplikaci Gemini.

### Přepínač MCP u workflow

Každý workflow lze zpřístupnit jako nástroj MCP:

- **Enable** – Nástroje daného workflow budou dostupné všem klientům připojeným k výchozímu serveru.
- **Disable** – Workflow není zpřístupněn.

Karty workflows zobrazují popis a náhled názvů vstupních polí, takže před povolením vidíte, co každý nástroj očekává.


### Spuštění ve frontě a heym_execution_status

Workflow s [limitem souběhu](../reference/webhooks.md#concurrency-limit-and-queued-runs) může být zaneprázdněno, když jej klient zavolá. Volání pak okamžitě vrátí výsledek, který není chybou:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Klient se dotazuje nástroje `heym_execution_status` s tímto `execution_id`. Vrací stejné tělo jako [stavová URL](../reference/webhooks.md#status-url): `queued` s aktuální pozicí, `running` a poté `success` nebo `error` s výstupy. Nalezne pouze běhy workflows vystavených stejným serverem. Nástroj je uveden na výchozím serveru a na každém pojmenovaném serveru pouze tehdy, pokud alespoň jedno z jeho workflows má limit souběhu. Když je fronta plná, volání vrátí chybu „Concurrency queue is full“.
## Heym Agent

Sekce **Heym Capabilities** mění engine karty Chat na jediný nástroj MCP s názvem `heym_chat`. Můžete jej povolit na výchozím serveru, na kterémkoli pojmenovaném serveru nebo na obou — každé rozhraní má vlastní přepínač a volbu modelu.

Když je povolen, `heym_chat` se objevuje v `tools/list` vedle nástrojů vašich workflows. MCP klient odešle jednu zprávu v přirozeném jazyce a Heym engine se postará o zbytek se stejnými schopnostmi, jaké má karta Chat:

- Sestavit workflow, otestovat jej se vzorovými vstupy, opravit jej a dokončit, jakmile běh proběhne úspěšně (viz [Režim sestavení](#build-mode))
- Prohlížet a spouštět vaše stávající workflows
- Podávat přehledy o analytice, nedávných spuštěních a nadcházejících cron plánech
- Vysvětlení, kde workflow selhávají a proč jsou pomalé: workflow s nejvyšším počtem spuštění, chyb a nejdelší dobou běhu, stejně jako typy uzlů s největším časem, chybami a voláními za poslední 1, 3 nebo 6 hodin, 24 hodin, 7 nebo 30 dní či za celou dobu
- Podávat historii běhů jednoho workflow: kolikrát proběhl, počty stavů, kdy proběhl, a na vyžádání vstupy, výstupy a chyby jednotlivých uzlů jednoho běhu
- Podávat přehled o tom, co právě běží: kolik spuštění je aktivních, jejich názvy workflows, jak dlouho každé běží, na kterém uzlu se právě nachází, a odkaz na živý běh
- Vypisovat boards, vytvářet karty a číst detail karty na [kartě Board](./board-tab.md)
- Zobrazení přehledu dashboardů (stránek Heym Work) a jejich widgetů, zjištění, na kterém dashboardu se nachází dané workflow, přidání nového widgetu a sestavení jeho workflow, umístění stávajícího workflow jako widgetu, přejmenování či smazání widgetů nebo uspořádání rozvržení (viz [Dashboard › Z Chatu a MCP](./dashboard-tab.md#from-chat-and-mcp))
- Kontrola datových tabulek a řádků, vytváření tabulek, přidávání nebo odebírání sloupců, vkládání, aktualizace nebo mazání řádků a propojování tabulek ve workflow
- Vytváření, úprava a spouštění evaluačních sad promptů a agentů ([Eval suites](./evals-tab.md#from-chat-and-mcp)), včetně výchozího stavu agenta: nahlášeného, sestaveného z běhů nebo zadaného číselně. Výsledek uvádí odkaz Evals pro každou uloženou sadu.
- Vytvořit nebo aktualizovat své credentials na vyhrazené stránce Heym (viz [Credentials](#credentials))
- Číst týmy a globální proměnné a prohledávat dokumentaci
- Schvalovat, upravovat nebo odmítat čekající human-in-the-loop recenze

Schopnosti přidané na kartu Chat později se automaticky zpřístupní přes `heym_chat` — neexistuje žádný přepínač pro jednotlivé schopnosti, který by bylo třeba udržovat v synchronizaci.

Tyto funkce běží uvnitř `heym_chat`: `tools/list` zobrazuje `heym_chat` a vaše nástroje workflow, nikdy interní nástroje chatu, jako jsou ty pro evaluační sady.

### Režim sestavení

`heym_chat` vždy spouští engine Chatu v režimu sestavení (build mode). V jediném volání může asistent uložit nový workflow, spustit jej s realistickými vzorovými vstupy, přečíst zprávu o běhu, opravit to, co selhalo, a spustit jej znovu – až pět testovacích běhů na jedno volání. Když poslední běh posledního uložení projde, skončí jednovětým shrnutím a odpověď končí textem `Verified: the latest test run of the saved workflow passed.`

Když volání vytvoří nebo upraví workflow, odpověď zobrazí každé z nich s plným odkazem do editoru, jako například `https://heym.example.com/workflows/<id>`, a odkazy v odpovědi asistenta jsou také úplné. Používají vaši nakonfigurovanou adresu Heym (`FRONTEND_URL`) a otevřou se uživatelům přihlášeným do Heym, kteří mají k tomuto workflow přístup.

- Testovací běhy jsou skutečné běhy. Jejich vedlejší účinky se provedou a zobrazí se v historii běhů daného workflow jako každý jiný běh.
- Uložení probíhají cestou editoru: změna grafu zachová předchozí graf v historii úprav (**Edit History**) daného workflow.
- Chcete-li změnit workflow, který asistent vytvořil dříve, pokračujte ve vlákně se stejným `conversation_id`. Asistent tento workflow aktualizuje, místo aby vytvářel nový, a mění pouze workflows, které můžete upravovat.
- Když je vyčerpáno všech pět testovacích běhů, asistent se zastaví a vysvětlí, co stále selhává.

`heym_chat` může kontrolovat vaše tabulky a řádky, vytvářet tabulky, přidávat nebo odebírat sloupce a vkládat, aktualizovat nebo mazat řádky. Zadejte mu název tabulky, UUID nebo odkaz na DataTable, například: „Přidej dva textové sloupce, jméno a příjmení, do https://heym.example/?tab=datatable/<table-id>“. Upravuje tabulku přímo a při přidávání sloupců zachovává stávající sloupce a hodnoty.

`heym_chat` může kontrolovat vaše tabulky a řádky, vytvářet tabulky, přidávat nebo odebírat sloupce a vkládat, aktualizovat nebo mazat řádky. Zadejte mu název tabulky, UUID nebo odkaz na DataTable, například: „Přidej dva textové sloupce, jméno a příjmení, do https://heym.example/?tab=datatable/<table-id>“. Upravuje tabulku přímo a při přidávání sloupců zachovává stávající sloupce a hodnoty.

Zápisy vyžadují vlastnictví nebo oprávnění k **zápisu** prostřednictvím přímého či týmového sdílení. Přístup pouze pro čtení umožňuje kontrolu. Zápisy řádků využívají kontroly typu, výchozí hodnoty, povinnosti a jedinečnosti z karty DataTable; částečné importy hlásí odmítnuté řádky. Odstranění sloupců vymaže jejich hodnoty z každého řádku. Stejně jako na kartě DataTable vyžaduje odstranění sloupců a vymazání všech řádků nejprve potvrzení; odpovězte se stejným `conversation_id` pro potvrzení. Smazání vybraného řádku nevyžaduje žádné další potvrzení.


### Credentials

`heym_chat` vidí credentials, které vlastníte i které s vámi někdo sdílí, podle názvu a typu, stejně jako karta Chat. Když workflow, které staví, potřebuje credential, zeptá se ve výsledku, které použít. Odpovězte se stejným `conversation_id`.

Chcete-li přidat credential nebo aktualizovat vlastní, asistent otevře formulář pro credentials Heym na stránce Heym, `/credentials/setup/<id>`. Zde se přihlásíte do Heym, zadáte klíč nebo propojíte účet a uložíte. Hodnota jde přímo do Heym: MCP klient a jeho model se dozví pouze název a typ credential. Nevkládejte klíče do klienta MCP; místo toho požádejte o formulář.

| Klient | Co se stane |
|--------|-------------|
| Podporuje MCP URL elicitaci | Klient vás vyzve k otevření stránky Heym. Volání čeká na vyplnění formuláře (až deset minut) a poté pokračuje s novým credential. |
| Jakýkoli jiný | Výsledek obsahuje odkaz a žádá klienta, aby znovu zavolal `heym_chat` s parametrem `wait_for_credential_form`. Toto volání čeká až pět minut při vyplňování formuláře a poté pokračuje v konverzaci. Pokud klient nečeká, uložte formulář a odpovězte se stejným `conversation_id`; další volání ví, že formulář byl uložen a jaký credential vytvořil. |

Stránka se otevře pouze pro účet Heym, který požadavek zahájil, takže přeposlaný odkaz je pro kohokoli jiného nepoužitelný. Formulář zůstává otevřený 24 hodin a lze jej ze stránky odmítnout. Jakmile jej uložíte nebo odmítnete, krok v konverzaci na kartě Chat zobrazí výsledek.


### Přihlašovací údaj a model

`heym_chat` spouští engine na vašem účtu Heym, takže potřebuje vlastní LLM přihlašovací údaj:

| Pole | Chování |
|-------|----------|
| **Credential** | Vyberte libovolný přihlašovací údaj OpenAI, Google nebo Custom, ke kterému máte přístup. Předvyplní se z preferovaného přihlašovacího údaje v [Settings](../reference/user-settings.md), pokud jste žádný nezvolili. |
| **Model** | Načte se z vybraného přihlašovacího údaje. Předvyplní se z vašeho preferovaného modelu, pokud přihlašovací údaj odpovídá. |

Pokud některý z nich chybí, nástroj se stále objevuje v `tools/list`, ale každé volání vrátí chybu s výzvou k dokončení nastavení na této kartě.


Uzly LLM a Agent ve workflow vytvořeném `heym_chat` běží na tomto credential a modelu, včetně credentials sdílených s vámi, takže testovací běhy fungují bez dalších kroků nastavení. Když `heym_chat` upravuje workflow, uzly LLM a Agent, které již credential mají, si jej ponechají spolu se svým modelem.
### Argumenty a historie

| Argument | Povinný | Popis |
|----------|----------|-------------|
| `message` | Ano | Instrukce nebo otázka v přirozeném jazyce. |
| `conversation_id` | Ne | `conversation_id` z předchozího výsledku `heym_chat` pro pokračování v daném vlákně. |
| `wait_for_credential_form` | Ne | S `conversation_id`: počkat, dokud uživatel neuloží nebo neodmítne formulář credential otevřený vláknem, a poté odeslat `message`. |

Každé volání se zapíše do historie vaší [karty Chat](./chat-tab.md) jako běžná konverzace označená ikonou zástrčky v seznamu konverzací. Zprávy, karty nástrojů a pauzy pro upřesnění vypadají přesně jako konverzace, kterou jste zahájili sami, a můžete vlákno otevřít a pokračovat v prohlížeči. Každý výsledek vrací své `conversation_id`, takže MCP klient může pokračovat ve stejném vlákně místo otevírání nového při každém volání.

Když asistent potřebuje upřesnění, pozastaví se a oznámí to; odpovězte pomocí stejného `conversation_id`.
### Povolit A2A

Když je Heym Agent zapnutý, karta zobrazuje zaškrtávací políčko **Povolit A2A**. Zaškrtněte jej a ostatní agenti budou moci Heym Agentovi odesílat úkoly prostřednictvím protokolu Agent2Agent (A2A 1.0). Karta pak zobrazí adresu URL pro **Agent Card** a koncový bod **JSON-RPC endpoint**, každý s tlačítkem kopírování, a příkaz `curl` pro načtení karty. A2A používá stejný klíč a přihlášení OAuth jako MCP. Vypnutím agenta se vypne i A2A. Informace o metodách, stavech úkolů a příklad naleznete v [A2A](../reference/a2a.md).

### Průběh

Dlouhé volání `heym_chat` hlásí činnost agenta jako průběh MCP (`notifications/progress`), se stejnými zprávami, jaké zobrazuje karta Chat, například `Testování workflow · pokus 2/5`. Klienti, kteří při hlášení průběhu resetují svůj časový limit, pokračují v čekání, zatímco agent pracuje.

## Pojmenované MCP servery

Pojmenované servery vám umožňují segmentovat workflows do izolovaných MCP endpointů. Každý server má vlastní URL a API klíč, takže různí AI klienti, týmy nebo případy použití se mohou připojit přesně k těm workflow, které potřebují.

### Vytvoření pojmenovaného serveru

1. Zadejte název do vstupního pole ve spodní části karty MCP (např. **CRM Tools**)
2. Klikněte na **Create** — okamžitě se zobrazí karta nového serveru
3. Kliknutím na kartu ji rozbalte

### Nastavení pro jednotlivé servery

Každá karta serveru zobrazuje:

| Nastavení | Popis |
|---------|-------------|
| **SSE Endpoint** | Jedinečná URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Nezávislý klíč, zobrazený jednou při vygenerování nebo regeneraci. Zkopírujte jej ihned; je uložen v hashované podobě a nelze jej později zobrazit |
| **How to connect** | **Copy JSON** zkopíruje připravenou MCP konfiguraci k vložení; **Add to Cursor** ji nainstaluje jedním kliknutím |
| **Heym Capabilities** | Přepněte Heym Agenta (`heym_chat`) pro tento server a vyberte jeho credential a model |
| **Povolit A2A** | Vlastní přepínač A2A tohoto serveru s vlastní Agent Card na `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Povolit A2A** | Vlastní přepínač A2A tohoto serveru s vlastní Agent Card na `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Assigned Workflows** | Přepněte, které z vašich workflow tento server zpřístupňuje |

### Přiřazení workflow

Přiřazení workflow je provedeno pro jednotlivé servery a je nezávislé na přepínači výchozího serveru. Workflow může být povoleno na výchozím serveru a současně na více pojmenovaných serverech, nebo na žádném.

Přepnutí workflow jej přesune na začátek seznamu přiřazených, takže právě změněný řádek zůstane viditelný, místo aby odscrolloval pryč.

### Autentizace

Pojmenované servery podporují stejné metody autentizace jako výchozí server:

- **X-MCP-Key header** – Předávejte API klíč serveru přímo (API klienti, Cursor). Pouze header: klíče nejsou přijímány jako query parametr `?key=`, protože URL se dostávají do access logů, proxy logů a historie prohlížeče.
- **Claude, ChatGPT a Gemini OAuth** – Přidejte URL serveru do konektorů nebo vlastních aplikací klienta; ponechte přihlašovací údaje prázdné a klient se zaregistruje automaticky přes OAuth. Bearer token musí být přenášen v `Authorization` headeru, nikoli jako `?token=`.
- **Session token** – Vydán během SSE handshake; vázán na konkrétní server, takže tokeny z jednoho pojmenovaného serveru nemohou přistupovat k jinému. Tento krátkodobý parametr `?session=` není ovlivněn.

### Smazání pojmenovaného serveru

Klikněte na ikonu **X** v záhlaví karty serveru. Smazáním se odstraní server a všechna jeho přiřazení workflow; samotné workflow nejsou ovlivněny.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Oba endpointy podporují SSE transport (GET, MCP spec 2024-11-05) a Streamable HTTP transport (POST, MCP spec 2025-03-26). Claude, ChatGPT a Gemini používají OAuth 2.1 / PKCE pro bezpečné přihlášení u obou.

## Související

- [Why Heym](../getting-started/why-heym.md) – MCP jako prvotřídní primitivum v Heym
- [Agent Node](../nodes/agent-node.md) – Uzel Agent s podporou MCP nástrojů
- [Agent Architecture](../reference/agent-architecture.md) – MCP klient, dispatch nástrojů, orchestrátor
- [Triggers](../reference/triggers.md) – MCP jako vstupní bod workflow
- [Chat Tab](./chat-tab.md) – Engine stojící za nástrojem `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Vytváření a správa workflow
- [Node Types](../reference/node-types.md) – Přehled AI uzlů
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkami pro dashboard rozhraní