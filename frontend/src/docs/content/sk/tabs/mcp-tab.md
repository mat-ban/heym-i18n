# Karta MCP

Karta **MCP** konfiguruje integráciu Model Context Protocol (MCP). MCP umožňuje AI klientom (Claude, Cursor a akýkoľvek nástroj kompatibilný s MCP) volať Vaše workflowy Heym ako nástroje.

Heym podporuje dva režimy: **predvolený server**, ktorý sprístupňuje všetky workflowy s povoleným MCP pod jedným endpointom, a **pomenované servery**, ktoré každú logickú skupinu workflowov sprístupňujú pod vlastnou vyhradenou URL a API kľúčom.

Oba režimy môžu sprístupniť dva druhy nástrojov: jednotlivé **workflowy** a **nástroj Heym chat** — celý engine [karty Chat](./chat-tab.md) za jediným nástrojom `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Pozrieť MCP demo</a></p>

## Predvolený MCP server

Predvolený server je vždy dostupný na adrese `{origin}/api/mcp/sse`. Všetky workflowy s povoleným MCP sa tu zobrazujú ako nástroje.

### MCP API kľúč

- Kľúče sa ukladajú ako SHA-256 digesty, takže Heym Vám nemôže zobraziť existujúci kľúč. Karta uvádza, či je kľúč nastavený, nie aký je.
- **Generate** / **Regenerate** – Nový kľúč sa zobrazí raz, hneď po jeho vytvorení. Skopírujte si ho vtedy; po opätovnom načítaní karty sa už natrvalo skryje.
- Tento kľúč použite pri pripájaní Claude Desktop, Cursor alebo iných MCP klientov k Heym
- Stratili ste kľúč? Vygenerujte ho znova. Predchádzajúci kľúč okamžite prestane fungovať.

### Spôsoby pripojenia

- **API Key** – MCP API kľúč použite na programové pripojenia. Karta dokáže skopírovať pripravenú JSON konfiguráciu a obsahuje tlačidlo **Add to Cursor** na jednoklikové nastavenie Cursor.
- **Claude** – Karta zobrazuje URL MCP servera a kroky nastavenia pre Claude. Polia OAuth Client ID a Secret nechajte prázdne; Claude sa zaregistruje automaticky a autentifikuje sa cez Heym OAuth.

### Prepínač MCP pre workflow

Každý workflow môže byť sprístupnený ako nástroj MCP:

- **Enable** – Nástroje workflowu sa stanú dostupnými všetkým klientom pripojeným k predvolenému serveru
- **Disable** – Workflow nie je sprístupnený

Karty workflowov zobrazujú popis a náhľad názvov vstupných polí, takže vidíte, čo každý nástroj očakáva, ešte pred jeho povolením.

## Nástroj Heym chat

Sekcia **Heym Capabilities** mení engine karty Chat na jediný nástroj MCP s názvom `heym_chat`. Povoľte ho na predvolenom serveri, na ktoromkoľvek pomenovanom serveri alebo na oboch — každé rozhranie si zachováva vlastný prepínač a výber modelu.

Keď je zapnutý, `heym_chat` sa zobrazuje v `tools/list` spolu s nástrojmi Vašich workflowov. MCP klient pošle jednu správu v prirodzenom jazyku a engine Heym sa postará o zvyšok, s rovnakými schopnosťami, aké má karta Chat:

- Vytvárať, upravovať, skúmať a spúšťať workflowy prostredníctvom Workflow AI Builder
- Podávať analytiku, nedávne spustenia a nadchádzajúce cron plány
- Podávať históriu behov jedného workflowu: koľkokrát bežal, počty stavov, kedy bežal, a na požiadanie vstupy, výstupy a chyby jednotlivých uzlov jedného behu
- Podávať, čo práve beží: koľko spustení je aktívnych, ich názvy workflowov, ako dlho každé beží, na ktorom uzle sa práve nachádza, a odkaz na živý beh
- Zoznamovať nástenky, vytvárať karty a čítať detail karty na [karte Board](./board-tab.md)
- Zoznamovať Vaše dátové tabuľky s ich stĺpcami, vytvárať nové a zapájať ich do workflowov, ktoré vytvára
- Čítať tímové a globálne premenné a prehľadávať dokumentáciu
- Schvaľovať, upravovať alebo odmietať čakajúce human-in-the-loop kontroly

Schopnosti pridané do karty Chat neskôr sa prostredníctvom `heym_chat` sprístupnia automaticky — neexistuje žiadny prepínač pre jednotlivé schopnosti, ktorý by bolo potrebné udržiavať v synchronizácii.

Prihlasovacie údaje zostávajú v UI: `heym_chat` ich nikdy nezoznamuje, nevyberá ani nevytvára. Keď vytvára alebo upravuje workflow, nové uzly, ktoré potrebujú prihlasovacie údaje, zostávajú prázdne a odpoveď ich pomenuje, takže ich môžete nastaviť v editore.

Dátové tabuľky sú iné. Tabuľka neobsahuje žiadne tajomstvo, takže `heym_chat` môže zoznamovať Vaše tabuľky, opýtať sa, ktorú má workflow použiť, a vytvoriť novú s jej stĺpcami. Nikdy nečíta ani nezapisuje riadky.

### Prihlasovacie údaje a model

`heym_chat` spúšťa engine na Vašom účte Heym, takže potrebuje vlastné prihlasovacie údaje k LLM:

| Pole | Správanie |
|-------|----------|
| **Credential** | Vyberte ľubovoľné prihlasovacie údaje OpenAI, Google alebo Custom, ku ktorým máte prístup. Predvyplní sa z preferovaných prihlasovacích údajov v [Settings](../reference/user-settings.md), ak ste si žiadne nevybrali. |
| **Model** | Načíta sa z vybraných prihlasovacích údajov. Predvyplní sa z Vášho preferovaného modelu, ak sa prihlasovacie údaje zhodujú. |

Ak niektoré z nich chýba, nástroj sa stále zobrazuje v `tools/list`, ale každé volanie vráti chybu s výzvou dokončiť nastavenie na tejto karte.

### Argumenty a história

| Argument | Povinné | Popis |
|----------|----------|-------------|
| `message` | Áno | Inštrukcia alebo otázka v prirodzenom jazyku. |
| `conversation_id` | Nie | `conversation_id` z predchádzajúceho výsledku `heym_chat` na pokračovanie v danom vlákne. |

Každé volanie sa zapíše do histórie Vašej [karty Chat](./chat-tab.md) ako bežná konverzácia, označená ikonou zástrčky v zozname konverzácií. Správy, karty nástrojov a pauzy na objasnenie vyzerajú presne ako konverzácia, ktorú ste začali sami, a vlákno môžete otvoriť a pokračovať v rozprávaní v prehliadači. Každý výsledok vracia svoj `conversation_id`, takže MCP klient môže pokračovať v tom istom vlákne namiesto otvárania nového pri každom volaní.

Keď asistent potrebuje objasnenie, pozastaví sa a oznámi to; odpovedzte s odpoveďami pomocou rovnakého `conversation_id`.
## Pomenované MCP servery

Pomenované servery vám umožňujú segmentovať workflowy do izolovaných MCP endpointov. Každý server má vlastnú URL a API kľúč, takže rôzni AI klienti, tímy alebo prípady použitia sa môžu pripojiť presne k tým workflowom, ktoré potrebujú.

### Vytvorenie pomenovaného servera

1. Zadajte názov do vstupného poľa v spodnej časti karty MCP (napr. **CRM Tools**)
2. Kliknite na **Create** — okamžite sa zobrazí karta nového servera
3. Kliknutím na kartu ju rozbalíte

### Nastavenia jednotlivých serverov

Každá karta servera zobrazuje:

| Nastavenie | Popis |
|---------|-------------|
| **SSE Endpoint** | Jedinečná URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Nezávislý kľúč, zobrazený raz pri vygenerovaní alebo opätovnom vygenerovaní. Skopírujte ho okamžite; je uložený v hashovanej podobe a neskôr ho už nie je možné zobraziť |
| **How to connect** | **Copy JSON** skopíruje MCP konfiguráciu pripravenú na vloženie; **Add to Cursor** ju nainštaluje jedným kliknutím |
| **Heym Capabilities** | Prepnite nástroj `heym_chat` pre tento server a vyberte jeho prihlasovacie údaje a model |
| **Assigned Workflows** | Prepnite, ktoré z vašich workflowov tento server sprístupňuje |

### Priradenie workflowov

Priradenie workflowov je na úrovni jednotlivých serverov a je nezávislé od prepínača predvoleného servera. Workflow môže byť povolený na predvolenom serveri a súčasne na viacerých pomenovaných serveroch, alebo na žiadnom.

Prepnutie workflowu ho presunie na začiatok zoznamu priradených, takže riadok, ktorý ste práve zmenili, zostane viditeľný a neodscrolluje sa preč.

### Autentifikácia

Pomenované servery podporujú rovnaké metódy autentifikácie ako predvolený server:

- **X-MCP-Key header** – Odovzdajte API kľúč servera priamo (API klienti, Cursor). Iba v headeri: kľúče nie sú akceptované ako query parameter `?key=`, pretože URL sa dostávajú do prístupových logov, logov proxy serverov a histórie prehliadača.
- **Claude OAuth** – Pridajte URL servera do integrácií Claude; ponechajte prihlasovacie údaje prázdne a Claude sa zaregistruje automaticky cez OAuth. Bearer token musí byť prenášaný v headeri `Authorization`, nie ako `?token=`.
- **Session token** – Vydaný počas SSE handshake; je viazaný na konkrétny server, takže tokeny z jedného pomenovaného servera nemôžu pristupovať k inému. Tento krátkodobý parameter `?session=` nie je ovplyvnený.

### Odstránenie pomenovaného servera

Kliknite na ikonu **X** v hlavičke karty servera. Odstránením sa server a všetky jeho priradenia workflowov zrušia; samotné workflowy nie sú ovplyvnené.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Oba endpointy podporujú SSE transport (GET, MCP spec 2024-11-05) a Streamable HTTP transport (POST, MCP spec 2025-03-26). Claude používa OAuth 2.1 / PKCE na zabezpečené prihlásenie v oboch prípadoch.

## Súvisiace

- [Why Heym](../getting-started/why-heym.md) – MCP ako prvotriedny prvok v Heym
- [Agent Node](../nodes/agent-node.md) – Uzol agenta s podporou MCP nástrojov
- [Agent Architecture](../reference/agent-architecture.md) – MCP klient, odosielanie nástrojov, orchestrátor
- [Triggers](../reference/triggers.md) – MCP ako vstupný bod workflowu
- [Chat Tab](./chat-tab.md) – Engine za nástrojom `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Vytváranie a správa workflowov
- [Node Types](../reference/node-types.md) – Prehľad AI uzlov
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkou pre povrchy dashboardu
