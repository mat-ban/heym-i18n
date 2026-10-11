# Karta Workflows

Karta **Workflows** je predvolené zobrazenie dashboardu. Zobrazuje zoznam Vašich workflowov, štruktúru priečinkov a umožňuje Vám vytvárať, upravovať a organizovať workflowy.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Pozrieť demo Workflows</a></p>

## Spustenie Chatu

Nad zoznamom workflowov sa nachádza chat box, ktorý Vás osloví menom a opýta sa, čo chcete automatizovať. Zadajte prompt, voliteľne priložte jeden súbor a vyberte prihlasovacie údaje a model, ktoré chcete použiť. Oba rozbaľovacie zoznamy sú prehľadávateľné a štartujú na Vašich [predvolených nastaveniach AI](../reference/user-settings.md).

Odoslaním sa vytvorí nová konverzácia a otvorí sa v [karte Chat](./chat-tab.md), kde sa odpoveď streamuje. Podporované prílohy sú textové súbory, obrázky a PDF, jeden na správu, rovnako ako v chat composer.

Ak ešte nemáte prihlasovacie údaje k LLM, box zobrazí odkaz na [kartu Prihlasovacie údaje](./credentials-tab.md) a odosielanie zostane zakázané.

Kliknutím na **x** box skryjete. Vedľa nadpisu Workflows sa potom zobrazí tlačidlo **Ask AI**, ktoré ho vráti späť. Voľba sa pamätá vo Vašom prehliadači.

## Zoznam Workflowov

Zoznam je dvojpanelové zobrazenie: workflowy a priečinky vľavo, náhľad vybraného workflowu vpravo.

- Každý riadok zobrazuje ikonu workflowu, názov, popis, kedy bol naposledy aktualizovaný a [stavový štítok](#stav-workflowu)
- Workflowy môžu byť v koreňovom adresári alebo v priečinkoch a pripnuté workflowy sa zobrazujú vo vlastnej skupine **Pinned** navrchu
- **Kliknutím** na riadok ho vyberiete a načítate jeho náhľad vpravo
- **Dvojitým kliknutím** na riadok alebo stlačením **Enter**, keď je riadok aktívny, ho otvoríte v [editore](../getting-started/quick-start.md)
- Použite **Ctrl+kliknutie** (alebo **Cmd+kliknutie**) na otvorenie v novej karte
- Každý riadok má vpravo svoje akcie na úpravu, kopírovanie, pripnutie a vymazanie. Na telefónoch sú skryté, aby názov zachoval plnú šírku; **dlhým stlačením** riadku tam otvoríte panel akcií
- Pripnite často používané workflowy v [Quick Drawer](../reference/quick-drawer.md), aby ste ich mohli rýchlo spustiť z karty Workflows a ďalších interných stránok

## Náhľad Workflowu

Výberom workflowu sa vyplní panel náhľadu vedľa zoznamu. Na obrazovkách užších ako 1280px sa ten istý panel otvára ako sheet zo spodnej časti obrazovky.

Panel zobrazuje:

- Názov workflowu, kto ho vytvoril a kedy a kedy bol naposledy upravený
- **Open Workflow** – otvorí workflow v editore
- **Run Now** – otvorí workflow v [Quick Drawer](../reference/quick-drawer.md), kde vyplníte jeho vstupy a spustíte beh bez opustenia zoznamu
- **Description** – popis workflowu
- **Trigger Configuration** – plán pre cron workflow alebo naslúchajúci trigger pre event workflow. Workflowy, ktoré sa volajú cez HTTP, zobrazujú tlačidlo **Copy cURL** namiesto surového endpointu a autentifikačného textu: skopíruje kompletnú požiadavku so správnou URL, hlavičkami, zástupným symbolom pre autentifikáciu a telom zostaveným zo vstupných polí workflowu. Keď workflow publikuje [portál](../reference/portal.md), zobrazí sa tu aj jeho verejný odkaz na chat
- **Last Run Details** – výsledok a trvanie najnovšieho behu alebo poznámka, že workflow ešte nikdy nebežal
- **Workflow Steps & Sub-agents** – uzly v poradí vykonávania, každý so svojím modelom, operáciou alebo plánom a bodkou znázorňujúcou, či je aktívny. Výberom kroku sa daný uzol otvorí v editore s už otvoreným panelom vlastností

Panel zostáva pripnutý vedľa zoznamu počas posúvania, takže zostáva čitateľný aj v dlhom zozname workflowov.
## Správa inštancie

Účty uvedené v `HEYM_ADMIN_EMAILS` môžu zobrazovať, otvárať, upravovať, kontrolovať históriu spustení a odstraňovať akýkoľvek workflow na inštancii bez zdieľania alebo prevodu vlastníctva. Nastavenie je zoznam e-mailových adries oddelených čiarkami, pričom sa nerozlišujú veľké a malé písmená. Prázdny zoznam neudeľuje tento prístup nikomu. Po zmene je potrebné reštartovať backend.

Administrátori vidia v zozname workflowov e-mail vlastníka a môžu vyhľadávať podľa tejto adresy. Výberom workflowu otvoríte v jeho náhľade položku **Správa inštancie**:

1. **Pozastaviť triggery** sa zobrazuje iba pre workflowy obsahujúce uzol Cron. Prostredníctvom bežného verzovaného uloženia deaktivuje uzol Cron daného workflowu a ostatné automatické trigger uzly. Existujúce spustenia môžu dokončiť. Manuálne volania, volania cez API, portál a volania z pod-workflowov zostávajú dostupné; táto akcia nie je celoplošným zámkom spúšťania workflowu.
2. Počas pozastavenia sa tlačidlo zmení na **Obnoviť triggery**, a to aj po opätovnom načítaní stránky. Obnovenie opätovne aktivuje triggery pozastavené administrátorom a triggery, ktoré už boli deaktivované, ponechá nezmenené. Pri starších pozastavených workflowoch bez uloženého stavu administrátorského pozastavenia obnovenie aktivuje ich automatické triggery.
3. Po ustálení spustení použite akciu **Odstrániť workflow** v riadku daného workflowu. Odstránenie vráti konflikt, kým prebieha spúšťanie, čakanie vo fronte alebo práca čakajúca na kontrolu. Plánované odstránenie uplatňuje rovnakú kontrolu.

Pred odstránením pozastavte triggery a nechajte existujúce spustenia dokončiť. Trigger, ktorý už bol odoslaný v čase pozastavenia, môže stále dokončiť. Odstránenie použite vtedy, keď workflow už nesmie byť volateľný.

Webhookové tajné kľúče a nastavenia autentifikácie prístupné iba vlastníkovi si zachovávajú svoju existujúcu ochranu. Správa neprevádza vlastníctvo ani nezdieľa záznamy prihlasovacích údajov vlastníka. Administrátorské akcie pozastavenia, obnovenia, odstránenia a plánovania sa zobrazujú v [auditnej stope](../reference/audit.md) spolu s konajúcim administrátorom a vlastníkom workflowu.

## Stav workflowu

Každý riadok nesie štítok stavu odvodený z trigger uzlov daného workflowu, jeho aktuálneho stavu spustenia
a — pri workflowoch bez trigger uzla — zo spôsobu, akým bolo spustené jeho posledné spustenie:

| Stav | Význam |
| --- | --- |
| **Running** | Workflow má práve prebiehajúce spustenie |
| **Scheduled** | Má aktívny [cron](../nodes/cron-node.md) trigger |
| **Listening** | Má aktívny event trigger, napríklad trigger Slack, Telegram, IMAP alebo WebSocket |
| **Paused** | Má trigger uzly, ale všetky sú deaktivované |
| **API** | Nemá žiadne trigger uzly a naposledy bol spustený volaním HTTP na svoj execute endpoint |
| **SubWorker** | Nemá žiadne trigger uzly a naposledy bol spustený ako pod-workflow nadradeným workflowom |
| **Portal** | Nemá žiadne trigger uzly a naposledy bol spustený zo svojho [portálu](../reference/portal.md) |
| **WEB** | Nemá žiadne trigger uzly a jeho jediným koncovým uzlom je [HTML output mapper](../nodes/html-output-mapper-node.md), takže jeho volanie vráti vykreslenú webovú stránku |
| **Manual** | Nemá žiadne trigger uzly a nikdy nebol spustený, alebo jeho posledné spustenie prišlo odinakiaľ inam |
| **Remove Scheduled** | Je [naplánovaný na odstránenie](../reference/workflow-organization.md) |

Štítky API, SubWorker a Portal čítajú jediný najnovší záznam v [histórii spustení](./logs-tab.md) daného workflowu, takže workflow volaný dvoma spôsobmi zobrazuje ten, ktorý nastal ako posledný. **WEB** sa určuje z grafu, a preto má prednosť pred týmito tromi: workflow obsluhujúci stránku sa zobrazuje ako WEB aj po tom, čo bol volaný cez HTTP. Trigger uzly vždy víťazia nad všetkými nimi: cron workflow, ktorý niekto zároveň volá cez HTTP, zostáva **Scheduled**.

Pomocou rozbaľovacieho zoznamu **Status** vedľa vyhľadávacieho poľa zobrazíte iba jeden stav. Rozbaľovací zoznam uvádza, koľko workflowov aktuálne zodpovedá jednotlivým stavom. Filter stavu zasahuje aj do priečinkov: priečinky s zhodou sa automaticky rozbalia a priečinky bez zhody sa skryjú, kým filter nevymažete.

## Aktívne workflowy

Na počítači kruhový odznak v hornej lište nástrojov zobrazuje, koľko workflowov práve
beží, a automaticky sa obnovuje každých 10 sekúnd. Kliknutím na nenulový odznak otvoríte zoznam aktívnych
workflowov, ktorý pred posúvaním zobrazuje až štyri riadky. Výberom názvu workflowu pripojíte
editor k živému náhľadu daného spustenia. Nulový odznak je iba informatívny a nedá sa otvoriť
a na mobilných obrazovkách je odznak skrytý.

## Vyhľadávanie

Pomocou vyhľadávacieho poľa workflowov vedľa položky **Status** alebo stlačením **Ctrl+F** (alebo **Cmd+F**) filtrujte workflowy podľa názvu alebo popisu. Zodpovedajúce workflowy v priečinkoch sa zobrazujú s rozbalenými vetvami priečinkov. Stlačením **Escape** vyhľadávanie vymažete.
## Priečinky

- Usporiadajte workflowy do [priečinkov a podpriečinkov](../reference/workflow-organization.md)
- Vytvárajte priečinky tlačidlom **New Folder**, pričom každému zadajte názov a voliteľný popis, ktorý sa zobrazuje pod jeho názvom v zozname
- Každý riadok priečinka zobrazuje počet workflowov, ktoré obsahuje, vrátane podpriečinkov, spolu s akciami pre nový podpriečinok, premenovanie, zmenu ikony, stiahnutie ako ZIP a vymazanie. Na telefónoch sa v riadku zobrazuje namiesto toho jediné tlačidlo ponuky
- Potiahnite workflow na priečinok alebo podpriečinok a zobrazí sa náhľad cieľa vo veľkosti karty. Zvýraznený
  náhľad zobrazuje pred vložením celú cestu k priečinku a pri prejdení na zbalený
  priečinok sa tento krátko rozbalí, aby ste sa dostali k vnoreným priečinkom.
- Preťahujte workflowy medzi priečinkami alebo do koreňa. Preťahovaná karta zostáva viditeľná ako duch,
  a aktívny cieľ zostáva zvýraznený počas posúvania.
- Vloženie workflowu späť do jeho aktuálneho priečinka je zakázané a označené ako **Already in Folder**.
- Premenujte priečinok alebo zmeňte jeho popis pomocou akcie premenovania alebo kontextovej ponuky po kliknutí pravým tlačidlom

## Vytváranie workflowov

1. Kliknite na **New Workflow**
2. Zadajte názov a voliteľný popis
3. Workflow sa otvorí v editore

## Import

Potiahnite a vložte JSON súbor workflowu do oblasti workflowov a vytvorte nový workflow. Importované uzly a hrany sa použijú na vytvorenie workflowu; názov pochádza z poľa `name` v JSON alebo z názvu súboru. Formát JSON a možnosti importu nájdete v [Download & Import](../reference/download-import.md).

## Zdieľanie

Otvorte workflow v editore a kliknite na **Share**, aby ste pozvali používateľov e-mailom alebo zdieľali s [tímom](./teams-tab.md). Pre každého používateľa alebo tím zvoľte **Read** (zobrazenie a spustenie) alebo **Write** (aj úprava) a neskôr to zmeňte v rozbaľovacom zozname vedľa záznamu. Prihlasovacie údaje a podworkflowy sa nezdieľajú automaticky; zdieľajte ich samostatne s tými istými používateľmi alebo tímami. Pozrite si [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) a [Credentials Sharing](../reference/credentials-sharing.md).

## Úpravy a vymazanie

- **Edit** – Zmeňte názov a popis workflowu pomocou akcie úprav v riadku
- **Delete** – Workflowy sú [naplánované na vymazanie](../reference/workflow-organization.md); pred trvalým odstránením sa presunú do oblasti koša

## Súbežné úpravy

Uloženie odosiela revíziu, na ktorej sú vaše úpravy založené, a server zápis odmietne, ak sa workflow medzitým zmenil — napríklad preto, že ho uložil kolega alebo ste ten istý workflow nechali otvorený v druhej karte. Heym potom zobrazí dialóg **Stale Workflow Detected** s dvoma možnosťami:

- **Cancel** – Zachová vaše neuložené zmeny v editore, aby ste ich mohli znova načítať v inej karte a zosúladiť
- **Override** – Uloží napriek tomu a nahradí verziu druhej osoby

**Spustenie** workflowu ho najprv uloží, takže prechádza tou istou kontrolou. Ak sa workflow pod vami zmenil, spustenie sa pozastaví na dialógu namiesto tichého prepísania: **Override and Run** uloží vašu verziu a spustí beh, **Cancel Run** zruší oboje a ponechá vaše úpravy nedotknuté.

Kontrola je súčasťou samotnej požiadavky na uloženie, takže nestojí žiadny dodatočný round trip a neexistuje okno, v ktorom by uloženie mohlo prejsť bez nej. Vaše vlastné zmeny z inej časti aplikácie — premenovanie, zmena nastavení, prepnutie v paneli vlastností — sa nikdy nepočítajú ako konflikt.

## Paleta príkazov

Stlačte **Ctrl+K** (alebo **Cmd+K**) a otvorte paletu príkazov. Môžete:
- Vyhľadávať workflowy podľa názvu
- Prejsť na ľubovoľnú [kartu dashboardu](./credentials-tab.md)
- Otvoriť nedávne workflowy

## Súvisiace

- [Quick Start](../getting-started/quick-start.md) – Vytvorte svoj prvý workflow
- [Workflow Organization](../reference/workflow-organization.md) – Priečinky, podpriečinky a naplánované vymazanie
- [Workflow Structure](../reference/workflow-structure.md) – Formát JSON pre workflowy
- [Download & Import](../reference/download-import.md) – Export a import workflowov ako JSON
- [Portal](../reference/portal.md) – Zverejnite workflowy ako verejné chat rozhrania
- [Board](./board-tab.md) – Spúšťajte workflowy z kanban kariet prostredníctvom reťazcov stĺpcov
- [Core Concepts](../getting-started/core-concepts.md) – Workflowy, uzly a vykonávanie
- [Execution History](../reference/execution-history.md) – Zobrazte minulé spustenia a Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Pripnite a spúšťajte workflowy z dashboardu, dokumentácie a ďalších stránok mimo editora
- [Contextual Showcase](../reference/contextual-showcase.md) – Krátky sprievodca stránkou pre povrchy dashboardu
