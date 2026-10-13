# Karta MCP

Karta **MCP** konfiguruje integraci Model Context Protocol (MCP). MCP umožňuje AI klientům (Claude, ChatGPT, Gemini, Cursor a jakémukoli nástroji kompatibilnímu s MCP) volat vaše Heym workflows jako nástroje.

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

## Nástroj Heym chat

Sekce **Heym Capabilities** mění engine karty Chat na jediný nástroj MCP s názvem `heym_chat`. Můžete jej povolit na výchozím serveru, na kterémkoli pojmenovaném serveru nebo na obou — každé rozhraní má vlastní přepínač a volbu modelu.

Když je povolen, `heym_chat` se objevuje v `tools/list` vedle nástrojů vašich workflows. MCP klient odešle jednu zprávu v přirozeném jazyce a Heym engine se postará o zbytek se stejnými schopnostmi, jaké má karta Chat:

- Sestavit workflow, otestovat jej se vzorovými vstupy, opravit jej a dokončit, jakmile běh proběhne úspěšně (viz [Režim sestavení](#build-mode))
- Prohlížet a spouštět vaše stávající workflows
- Podávat přehledy o analytice, nedávných spuštěních a nadcházejících cron plánech
- Podávat historii běhů jednoho workflow: kolikrát proběhl, počty stavů, kdy proběhl, a na vyžádání vstupy, výstupy a chyby jednotlivých uzlů jednoho běhu
- Podávat přehled o tom, co právě běží: kolik spuštění je aktivních, jejich názvy workflows, jak dlouho každé běží, na kterém uzlu se právě nachází, a odkaz na živý běh
- Vypisovat boards, vytvářet karty a číst detail karty na [kartě Board](./board-tab.md)
- Vypisovat vaše datové tabulky s jejich sloupci, vytvářet nové a zapojovat je do workflows, které sestavuje
- Číst týmy a globální proměnné a prohledávat dokumentaci
- Schvalovat, upravovat nebo odmítat čekající human-in-the-loop recenze

Schopnosti přidané na kartu Chat později se automaticky zpřístupní přes `heym_chat` — neexistuje žádný přepínač pro jednotlivé schopnosti, který by bylo třeba udržovat v synchronizaci.

### Režim sestavení

`heym_chat` vždy spouští engine Chatu v režimu sestavení (build mode). V jediném volání může asistent uložit nový workflow, spustit jej s realistickými vzorovými vstupy, přečíst zprávu o běhu, opravit to, co selhalo, a spustit jej znovu – až pět testovacích běhů na jedno volání. Když poslední běh posledního uložení projde, skončí jednovětým shrnutím a odpověď končí textem `Verified: the latest test run of the saved workflow passed.`

- Testovací běhy jsou skutečné běhy. Jejich vedlejší účinky se provedou a zobrazí se v historii běhů daného workflow jako každý jiný běh.
- Uložení probíhají cestou editoru: změna grafu zachová předchozí graf v historii úprav (**Edit History**) daného workflow.
- Chcete-li změnit workflow, který asistent vytvořil dříve, pokračujte ve vlákně se stejným `conversation_id`. Asistent tento workflow aktualizuje, místo aby vytvářel nový, a mění pouze workflows, které můžete upravovat.
- Když je vyčerpáno všech pět testovacích běhů, asistent se zastaví a vysvětlí, co stále selhává.

Přihlašovací údaje zůstávají v UI: `heym_chat` je nikdy nevypisuje, nevybírá ani nevytváří. Když sestavuje nebo upravuje workflow, nové uzly vyžadující přihlašovací údaj zůstanou prázdné a odpověď je pojmenuje, abyste je mohli nastavit v editoru.

Datové tabulky jsou jiné. Tabulka neobsahuje žádné tajemství, takže `heym_chat` může vypisovat vaše tabulky, zeptat se, kterou má workflow použít, a vytvořit novou s jejími sloupci. Nikdy nečte ani nezapisuje řádky.

### Přihlašovací údaj a model

`heym_chat` spouští engine na vašem účtu Heym, takže potřebuje vlastní LLM přihlašovací údaj:

| Pole | Chování |
|-------|----------|
| **Credential** | Vyberte libovolný přihlašovací údaj OpenAI, Google nebo Custom, ke kterému máte přístup. Předvyplní se z preferovaného přihlašovacího údaje v [Settings](../reference/user-settings.md), pokud jste žádný nezvolili. |
| **Model** | Načte se z vybraného přihlašovacího údaje. Předvyplní se z vašeho preferovaného modelu, pokud přihlašovací údaj odpovídá. |

Pokud některý z nich chybí, nástroj se stále objevuje v `tools/list`, ale každé volání vrátí chybu s výzvou k dokončení nastavení na této kartě.

### Argumenty a historie

| Argument | Povinný | Popis |
|----------|----------|-------------|
| `message` | Ano | Instrukce nebo otázka v přirozeném jazyce. |
| `conversation_id` | Ne | `conversation_id` z předchozího výsledku `heym_chat` pro pokračování v daném vlákně. |

Každé volání se zapíše do historie vaší [karty Chat](./chat-tab.md) jako běžná konverzace označená ikonou zástrčky v seznamu konverzací. Zprávy, karty nástrojů a pauzy pro upřesnění vypadají přesně jako konverzace, kterou jste zahájili sami, a můžete vlákno otevřít a pokračovat v prohlížeči. Každý výsledek vrací své `conversation_id`, takže MCP klient může pokračovat ve stejném vlákně místo otevírání nového při každém volání.

Když asistent potřebuje upřesnění, pozastaví se a oznámí to; odpovězte pomocí stejného `conversation_id`.
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
| **Heym Capabilities** | Přepněte nástroj `heym_chat` pro tento server a zvolte jeho credential a model |
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
