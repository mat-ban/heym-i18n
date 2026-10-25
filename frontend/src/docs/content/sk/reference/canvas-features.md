# Funkcie plátna

Editor workflowov poskytuje niekoľko funkcií na ladenie, testovanie a organizáciu uzlov: **Spustenie po uzol**, **AI na uzle**, **Pripnutie dát**, **Záznamy spustení**, **Povoliť/Zakázať** a **Extrahovať do pod-workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Pozrieť demo editora</a></p>

## Spustenie po uzol

Prejdite kurzorom na ľubovoľný uzol okrem sticky note a kliknite na **Run** pod ním. Heym spustí tento uzol a jeho nadradené závislosti, pričom podradené uzly a nesúvisiace vetvy zostanú nedotknuté. Využíva sa tým testovací režim plátna vrátane pripnutých výstupov a bežných podmienok vetvenia workflowu.

Ak má zvolená cesta vstupné polia, otvorí sa panel **Run** na pravej strane a zameria sa na prvé pole. Zadajte hodnoty a kliknite na **Run to _označenie uzla_** alebo stlačte **Ctrl+Enter** (Cmd+Enter na macOS). Režim generického tela zameria editor JSON tela. Cesty bez vstupných polí sa spustia okamžite bez otvorenia panela. Pripnuté vstupné uzly znovu použijú svoj pripnutý výstup bez vyžiadania vstupu.

Panel si zachová zvolený cieľ pre nasledujúce spustenia. Ak chcete cieľ vymazať, zvoľte **Run full workflow**. Tlačidlá spustenia sú počas aktívneho spustenia zakázané. Cieľ vo vnútri slučky zastaví spustenie pri prvom dosiahnutí tohto uzla; výber uzla za slučkou spustí kompletnú nadradenú slučku.

## AI na uzle

Prejdite myšou na ľubovoľný uzel okrem poznámky a kliknite na **AI** nad ním. [AI Assistant](./ai-assistant.md) sa otvorí na danom uzle a ponúkne **Change this node as ...**, **Fix error in this node ...** a **Other**. V režime Agent asistent mení iba tento uzel; ostatné uzly, prepojenia a rozloženie zostávajú nezmenené. Pozrite [AI Assistant › Zmena jedného uzla](./ai-assistant.md#changing-one-node).

Tlačidlo je skryté pri workflowoch, ktoré si môžete iba prezerať.

## Pripnutie dát

Pripnutie dát umožňuje pripnúť výstup uzla z posledného spustenia, aby ste mohli testovať podradené uzly bez opätovného spustenia pripnutého uzla.

### Kde to nájdete

- **Panel vlastností** – Vyberte uzol a posuňte sa na sekciu **Pinned Data**
- **Odznak uzla** – Keď sú dáta pripnuté, na uzle sa zobrazí ikona pripnutia

### Akcie

| Akcia | Popis |
|--------|-------------|
| **Pin** | Pripne výstup posledného spustenia uzla (dostupné po spustení) |
| **Clear** | Odstráni pripnuté dáta |
| **Edit** | Upravte pripnutý JSON priamo; kliknutím na Save použijete zmeny |

### Správanie v testovacom režime

Pri spustení workflowu v testovacom režime uzly s `pinnedData` preskočia spustenie a namiesto toho použijú pripnutý výstup. Využite to na:

- Testovanie podradenej logiky bez volania externých API
- Ladenie výrazov, ktoré odkazujú na výstup uzla
- Iterovanie promptov alebo podmienok s pevnými vzorovými dátami

Dopĺňanie výrazov v editore používa pripnuté dáta, ak sú dostupné, na navrhovanie polí.

## Záznamy spustení

Panel **Debug** (spodný zásuvný panel) zobrazuje záznamy spustenia v reálnom čase počas behu workflowu. Môžete tiež otvoriť bežiace produkčné spustenie buď z dialógu História, alebo z karty Board. Editor sa pripojí k SSE streamu tohto spustenia, obnoví výsledky dokončených uzlov a pokračuje v zobrazovaní animácií uzlov a záznamov, keď nové uzly začínajú a končia.

### Čo zobrazuje

- **Výsledky uzlov** – Stav jednotlivých uzlov (`success`, `error`, `skipped`, `running`), čas spustenia a výstup
- **Konečné výstupy** – Agregované výstupy z uzlov [Output](../nodes/output-node.md)
- **Priebeh agenta** – Pre uzly [Agent](../nodes/agent-node.md) krokové volania nástrojov a uvažovanie

### Akcie

- **Copy as JSON** – Skopíruje celý záznam spustenia do schránky
- **Open in JSON editor** – Otvorí záznam v JSON Hero alebo JSON Editor Online na kontrolu
- **Download generated files** – Ak skill vytvoril súbory na stiahnutie (`_generated_files`), zobrazí sa tlačidlo Download. Jediný súbor sa stiahne priamo; viacero súborov otvorí popup na výber.

### Rozdiel oproti karte Logs

Panel Debug zobrazuje záznamy **spustenia workflowu** (výsledky uzlov, výstupy). Karta [Logs Tab](../tabs/logs-tab.md) zobrazuje záznamy **Docker kontajnerov** (backend, frontend, databáza). <!-- pragma: allowlist secret -->

## Povoliť / Zakázať

Uzly môžete zakázať, aby boli počas spustenia preskočené. Zakázané uzly zobrazujú odznak „off" a sú zobrazené stlmené.

### Ako prepínať

| Metóda | Popis |
|--------|-------------|
| **Panel vlastností** | Vyberte uzol → ikona napájania (vpravo hore) |
| **Kontextové menu** | Kliknite pravým tlačidlom na uzol/uzly → Disable alebo Enable |
| **Klávesnica** | Vyberte uzol/uzly → stlačte **D** (pozri [Klávesové skratky](./keyboard-shortcuts.md)) |

### Viacnásobný výber

Keď je vybraných viacero uzlov, Povoliť/Zakázať sa aplikuje na všetky z nich. Kontextové menu zobrazuje „Enable", ak je niektorý z vybraných uzlov zakázaný, „Disable", ak sú všetky povolené.

### Správanie za behu

Uzly s `active: false` sú preskočené. Podradené uzly nedostávajú žiadne dáta z preskočených uzlov. Využite to na dočasné vylúčenie uzlov bez ich odstránenia.

Ak chcete uzol zapnúť alebo vypnúť zvnútra workflowu namiesto manuálne, použite [Disable Node](../nodes/disable-node.md) a [Enable Node](../nodes/enable-node.md).
## Graf pamäte agenta

Uzly [Agenta](../nodes/agent-node.md) s povolenou **[trvalou pamäťou](./agent-persistent-memory.md)** zobrazujú na uzle ružový ovládací prvok **mozgu**. Kliknutím naň otvoríte editor grafu pamäte: entity sa vykresľujú ako animovaný, silovo orientovaný graf zoskupený podľa typu entity, s prehľadávateľnými výberovými prvkami Source/Target na pridávanie vzťahov a panelom prepojení na preskakovanie medzi prepojenými entitami. Ten istý dialóg obsahuje aj možnosť **Zdieľať pamäť s inými agentmi** (workflow → agent → čítanie alebo čítanie/zápis) pre [zdieľanie pamäte medzi agentmi](./agent-persistent-memory.md#sharing-with-other-agents). Kým je dialóg otvorený, undo/redo na hlavnom plátne je pozastavené, aby si úpravy grafu zachovali vlastnú históriu.

**Filtrovanie grafu.** V ľavom hornom rohu plátna sa nachádza ovládací prvok vyhľadávania, ktorý je zbalený do tlačidla skratky, kým naň nekliknete alebo nestlačíte **Ctrl/Cmd+F**. Zhoduje sa s názvom entity, jej typom a každým kľúčom a hodnotou atribútu, ako aj s typom vzťahu (`parent_of`) a jeho vlastnosťami; zhodný vzťah so sebou prináša obe svoje entity. Všetky výrazy oddelené medzerou sa musia zhodovať. Zhodná entita so sebou prináša celé svoje okolie — každý vzťah, na ktorom sa podieľa, a entitu na opačnej strane každého z nich — takže zhoda nikdy nezostane ako neprepojená bodka. Zhodný vzťah prináša iba dve entity, ktoré spája, a tam sa zastaví, keďže vyhľadávanie typu vzťahu je otázkou o tomto vzťahu, a nie o všetkom, na čo sú jeho konce naviazané. Všetko ostatné je na plátne a v zozname **All edges** úplne skryté — nie stlmené — a odznak zobrazuje, koľko z celkového počtu entít zostáva. **✕** v poli najprv vymaže dopyt a pri druhom stlačení pole zatvorí. Kláves Escape sa odvíja rovnakým spôsobom, od najvnútornejšieho prvku: najprv vymaže dopyt, potom zatvorí vyhľadávacie pole, následne opustí rozšírené zobrazenie plátna a dialóg zatvorí až vtedy, keď nie je otvorené nič z toho. Vymazaním sa obnoví celý graf so všetkými entitami na pôvodných miestach.

**Ručné umiestňovanie entít.** Potiahnutím entity ju pripnete tam, kde ju pustíte, takže automatické rozloženie usadí zvyšok grafu okolo nej namiesto toho, aby ju ťahalo späť. Potiahnutím vybranej entity sa spolu s ňou presunú aj entity, ktoré sú s ňou priamo prepojené, čím sa zachová tvar zhluku; potiahnutím akejkoľvek inej entity sa presunie iba tá jedna. **Tidy layout** (tlačidlo s prútikom) uvoľní každú pripnutú entitu a znovu spustí automatické rozloženie.

## Extrahovať do pod-workflowu

Skonvertujte vybrané uzly na opakovane použiteľný pod-workflow a nahraďte ich uzlom [Execute](../nodes/execute-node.md).

### Ako použiť

1. Vyberte jeden alebo viac uzlov na plátne
2. Kliknite pravým tlačidlom → **Extract to Sub-Workflow**
3. Zadajte názov (a voliteľný popis) nového workflowu
4. Kliknite na **Extract**

### Čo sa stane

- Vytvorí sa nový workflow s vybranými uzlami
- Externé vstupy (hrany zvonka výberu) sa stanú poľami [Input](../nodes/input-node.md) pod-workflowu
- Externé výstupy (hrany k uzlom mimo výberu) sa namapujú na [Output](../nodes/output-node.md) pod-workflowu
- Vybrané uzly sa nahradia jediným uzlom [Execute](../nodes/execute-node.md), ktorý volá nový workflow
- Mapovania vstupov/výstupov sa zachovajú automaticky

### Prípady použitia

- Opakované použitie sekvencie uzlov naprieč viacerými workflowmi
- Zjednodušenie komplexného workflowu zoskupením súvisiacej logiky
- Vytváranie modulárnych, testovateľných pod-workflowov

## Spustenie pomocou cURL

Tlačidlo **cURL** na paneli nástrojov editora (vpravo hore) otvára dialóg na zostavenie a skopírovanie príkazu cURL na spustenie workflowu cez API.

- Zvoľte režim tela požiadavky workflowu (`Defined` alebo `Generic`)
- Nastavte typ autentifikácie (Anonymous, JWT alebo Header Auth)
- Nakonfigurujte ukladanie odpovedí do vyrovnávacej pamäte a obmedzovanie rýchlosti
- Prepnite streamovanie SSE a prispôsobte správy o spustení pre jednotlivé uzly
- Upravte telo požiadavky
- V režime Generic používa panel spustenia na plátne rovnaké surové telo JSON ako dialóg cURL
- Kliknutím na **Copy cURL** skopírujete pripravený príkaz na spustenie

Úplné podrobnosti o dialógu nájdete v časti [Webhooks](./webhooks.md#run-with-curl-dialog) a protokol udalostí v časti [SSE Streaming](./sse-streaming.md).

## Súvisiace

- [Klávesové skratky](./keyboard-shortcuts.md) – Všetky skratky plátna a editora
- [Trvalá pamäť agenta](./agent-persistent-memory.md) – Správanie grafu pamäte a API
- [Uzol Execute](../nodes/execute-node.md) – Volá pod-workflowy
- [Expression DSL](./expression-dsl.md) – Referencie a pripnuté dáta
- [Štruktúra workflowu](./workflow-structure.md) – Formát uzlov a hrán
- [Stiahnutie a import](./download-import.md) – Export a import workflowov ako JSON
- [Typy uzlov](./node-types.md) – Všetky typy uzlov
- [Karta Logs](../tabs/logs-tab.md) – Logy Docker kontajnerov
- [História spustení](./execution-history.md) – Minulé spustenia
- [Šablóny](../tabs/templates-tab.md) – Ukladanie a opakované použitie workflowov a uzlov
- [Kontextová ukážka](./contextual-showcase.md) – Kompaktný sprievodca stránkou dostupný v editore
