# Dátová tabuľka

Karta **Dátová tabuľka** vám umožňuje vytvárať a spravovať štruktúrované dátové tabuľky priamo v prostredí Heym. Tabuľky je možné používať vo workflowoch prostredníctvom [uzla DataTable](../nodes/datatable-node.md) na programové operácie CRUD.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Pozrite si ukážku DataTable</a></p>

## Vytvorenie tabuľky

1. Prejdite na kartu Dátová tabuľka z dashboardu
2. Kliknite na **Vytvoriť dátovú tabuľku**
3. Zadajte názov a voliteľný popis
4. Pridajte stĺpce pomocou editora stĺpcov

## Stĺpce

Každý stĺpec má:

| Vlastnosť | Popis |
|----------|-------------|
| Názov | Zobrazovaný názov stĺpca |
| Typ | `string`, `number`, `boolean`, `date` alebo `json` |
| Povinné | Či nové riadky musia obsahovať tento stĺpec |
| Jedinečné | Či hodnoty musia byť v rámci riadkov jedinečné |
| Predvolená hodnota | Automaticky vyplnená, ak riadok tento stĺpec vynechá |

Stĺpce pridávate, upravujete alebo odstraňujete v hlavičke zobrazenia detailu tabuľky.

## Generovanie stĺpcov pomocou AI

Namiesto manuálneho pridávania stĺpcov môžete tabuľku opísať prirodzeným jazykom (alebo vložiť vzorový JSON) a nechať LLM navrhnúť schému. Oba vstupné body otvárajú rovnaký dialóg:

- **Generovať pomocou AI** (hlavička zoznamu Dátová tabuľka) — vytvorí úplne novú tabuľku z vášho popisu.
- **AI stĺpce** (zobrazenie detailu tabuľky, vedľa ovládacích prvkov stĺpcov) — navrhne *nové* stĺpce na pridanie do otvorenej tabuľky.

### Ako to funguje

1. Vyberte **prihlasovacie údaje LLM** a **model** (predvolene sa použijú vaše prvé prihlasovacie údaje LLM a ich najnovší model).
2. Napíšte popis — napríklad *„Tabuľka kníh s názvom, autorom, počtom strán a informáciou, či som ju prečítal"* — alebo vložte vzorovú JSON/schému.
3. Kliknite na **Generovať**. Model vráti navrhovanú schému.
4. Skontrolujte vygenerované stĺpce v editovateľnom formulári: zmeňte **názov**, **typ**, **predvolenú hodnotu**, **jedinečnosť** a **notEmpty** (povinné) pre každý z nich, odstráňte nechcené stĺpce alebo manuálne **Pridajte stĺpec**. Pri novej tabuľke môžete upraviť aj AI navrhnutý **názov** a **popis**.
5. Kliknutím na **Vytvoriť tabuľku** (nová tabuľka) alebo **Pridať stĺpce** (existujúca tabuľka) uložte zmeny. Dialóg môžete kedykoľvek zavrieť stlačením **Esc**.

### Pridávanie iba nových stĺpcov pri existujúcich tabuľkách

Pri generovaní stĺpcov pre existujúcu tabuľku model vidí vaše aktuálne stĺpce ako kontext a navrhuje **iba nové** stĺpce. Existujúce stĺpce a ich údaje sa nikdy neupravujú ani neodstraňujú — vygenerované stĺpce sa pridajú na koniec. Duplicitné názvy (nerozlišujúce veľkosť písmen) sa automaticky vynechajú.

> Vyžadujú sa prihlasovacie údaje LLM (OpenAI, Google alebo Custom). Ak žiadne nemáte, najprv ich pridajte v Nastaveniach.

## Správa riadkov

- **Pridať riadok**: Kliknutím na tlačidlo pridania vytvoríte nový riadok
- **Inline úprava**: Dvojkliknutím na ľubovoľnú bunku upravíte jej hodnotu. Stlačením Enter alebo kliknutím mimo bunky uložíte zmeny, klávesom Escape ich zrušíte
- **Odstrániť riadok**: Pomocou ponuky akcií riadka odstráňte riadok
- **Stránkovanie**: Riadky sa zobrazujú po 25 na stránku s navigáciou medzi stránkami

## Import/Export CSV

### Import
1. V zobrazení detailu tabuľky kliknite na **Importovať CSV**
2. Vyberte CSV súbor na nahranie
3. Zobrazte náhľad prvých 5 riadkov a mapovania stĺpcov
4. Zelené stĺpce sú spárované s existujúcimi stĺpcami tabuľky; žlté sú nespárované
5. Kliknutím na Import hromadne vložte riadky

### Export
Kliknutím na **Exportovať CSV** stiahnete všetky riadky ako CSV súbor.

## Zdieľanie

Zdieľajte tabuľky s ostatnými používateľmi alebo tímami:

1. Otvorte dialóg zdieľania v zobrazení detailu tabuľky
2. Pridajte používateľov podľa e-mailu s právom **read** alebo **write**
3. Pridajte tímy s právom **read** alebo **write**
4. Používatelia s právom iba na čítanie môžu zobrazovať údaje; používatelia s právom zápisu môžu upravovať riadky

## Vytváranie tabuliek z AI asistenta

[AI asistent](../reference/ai-assistant.md#data-tables) na plátne, [Chat](./chat-tab.md) a nástroj `heym_chat` na [karte MCP](./mcp-tab.md) môžu vybrať jednu z vašich tabuliek pre workflow, ktorý vytvárajú, alebo vytvoriť novú. Navrhnú názov a stĺpce a tabuľku vytvoria po odoslaní karty s otázkou. Nikdy nemenia stĺpce existujúcej tabuľky ani nezasahujú do jej riadkov: stĺpce pridávajte alebo upravujte tu.

## Použitie vo workflowoch

[Uzol DataTable](../nodes/datatable-node.md) prepája tabuľky s workflowmi. Operácie zahŕňajú find, getAll, getById, insert, update, remove a upsert. Nevyžadujú sa žiadne prihlasovacie údaje.

## Tabuľka nákladov LLM (systémová tabuľka)

Nad vašimi používateľsky vytvorenými tabuľkami sa zobrazuje pripnutá sekcia **Systémové tabuľky** s jedinou položkou: **Tabuľka nákladov LLM**. Ide o zobrazenie cien jednotlivých modelov s pevnou schémou, upravovateľné pre každého používateľa, ktoré používajú grafy nákladov v [Spusteniach](./traces-tab.md).

### Odkiaľ údaje pochádzajú

Heym uchováva globálnu tabuľku cien jednotlivých modelov naplnenú z verejného cenového endpointu Helicone (`https://www.helicone.ai/api/llm-costs`). Synchronizácia prebieha na pozadí pri prvom otvorení tabuľky alebo Spustení a je obmedzená na jedno načítanie za 24 hodín. Stlačením **Obnoviť** vynútite okamžitú opätovnú synchronizáciu. Položky odstránené z upstream zoznamu Helicone sa lokálne neodstraňujú, takže vyhľadávanie historických nákladov zostáva stabilné.

### Schéma (stĺpce iba na čítanie)

| Stĺpec | Význam |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informatívne, používa Helicone) |
| Model | Identifikátor modelu párovaný s `trace.model` |
| Op | Operátor párovania: `equals`, `startsWith` alebo `includes` |
| Vstup $/1M | USD za 1 milión prompt tokenov |
| Výstup $/1M | USD za 1 milión completion tokenov |
| Source | `helicone`, `seed` alebo `user` |
### Prispôsobenie cien

- **Upravte riadok** a prepíšte tak jeho ceny. Vaše prepísanie je viazané na používateľa a je označené odznakom `Customized`; budúce synchronizácie Helicone ho ponechajú bez zmien.
- **Obnovenie predvolených hodnôt** odstráni prepísanie a obnoví globálnu hodnotu pre daný riadok.
- **Pridať vlastný model** otvorí dialóg na vytvorenie riadku dostupného len pre používateľa (napríklad súkromný doladený model, ktorý Helicone neuvádza). Vlastné riadky sú označené `User added` a ich odstránením sa úplne zrušia.

### Párovanie so spusteniami

Keď dashboard Spustenia vypočítava náklady, páruje každý `trace.model` proti:

1. Vašim prepísaniam (presná zhoda názvu modelu) ako prvým
2. V opačnom prípade globálnej tabuľke — presná zhoda `equals` má prioritu pred `startsWith`/`includes`; zhody v rámci toho istého operátora sa riešia najdlhším zodpovedajúcim prefixom/podreťazcom modelu

Ak sa nezhoduje žiadny riadok, model sa uvedie v upozornení **Unpriced models** na stránke Spustenia; jeho príspevok k nákladom je nulový, kým nepridáte vlastný riadok alebo neprepíšete existujúci.

## Súvisiace

- [Uzol DataTable](../nodes/datatable-node.md) – Referencia uzla Workflow
- [Karta Spustenia](./traces-tab.md) – Používa tabuľku nákladov LLM pre koláčový graf nákladov a KPI karty
- [Uzol Grist](../nodes/grist-node.md) – Alternatíva externého tabuľkového procesora
- [Karta Premenné](./global-variables-tab.md) – Alternatíva úložiska kľúč-hodnota
