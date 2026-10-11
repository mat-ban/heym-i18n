# Karta Workflows

Karta **Workflows** je výchozím zobrazením dashboardu. Zobrazuje seznam workflow, strukturu složek a umožňuje vám workflow vytvářet, upravovat a organizovat.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Přehrát ukázku Workflows</a></p>

## Zahájení chatu

Nad seznamem workflow se nachází chatovací pole, které vás osloví jménem a zeptá se, co chcete automatizovat. Napište prompt, případně přiložte jeden soubor a vyberte credential a model, které chcete použít. Oba rozbalovací seznamy jsou prohledávatelné a vycházejí z vašich [výchozích nastavení AI](../reference/user-settings.md).

Odesláním se vytvoří nová konverzace a otevře se v [kartě Chat](./chat-tab.md), kde se odpověď streamuje. Podporované přílohy jsou textové soubory, obrázky a PDF, jeden na zprávu, stejně jako v chatovacím editoru.

Pokud ještě nemáte žádný LLM credential, pole zobrazí odkaz na [kartu Credentials](./credentials-tab.md) a odesílání zůstane zakázáno.

Kliknutím na **x** pole skryjete. Vedle nadpisu Workflows se poté zobrazí tlačítko **Ask AI**, které jej vrátí zpět. Volba se ukládá ve vašem prohlížeči.

## Seznam workflow

Seznam je dvoupanelové zobrazení: workflow a složky vlevo, náhled vybraného workflow vpravo.

- Každý řádek zobrazuje ikonu workflow, název, popis, datum poslední aktualizace a [stavový štítek](#stav-workflow)
- Workflow mohou být v kořeni nebo uvnitř složek a připnuté workflow se zobrazují ve vlastní skupině **Pinned** nahoře
- **Kliknutím** na řádek jej vyberete a vpravo se načte jeho náhled
- **Dvojklikem** na řádek nebo stisknutím **Enter**, když je řádek aktivní, jej otevřete v [editoru](../getting-started/quick-start.md)
- Pomocí **Ctrl+klik** (nebo **Cmd+klik**) jej otevřete v nové kartě
- Každý řádek má vpravo akce pro úpravu, kopírování, připnutí a smazání. Na telefonech jsou skryté, aby název zachoval plnou šířku; **dlouhým stisknutím** řádku zde otevřete panel akcí
- Připněte často používané workflow do [Quick Drawer](../reference/quick-drawer.md), abyste je mohli rychle spouštět z karty Workflows a dalších interních stránek

## Náhled workflow

Výběrem workflow se vyplní panel náhledu vedle seznamu. Na obrazovkách užších než 1280 px se stejný panel otevře jako list od spodní části obrazovky.

Panel zobrazuje:

- Název workflow, kdo jej vytvořil a kdy, a kdy byl naposledy upraven
- **Open Workflow** – otevře workflow v editoru
- **Run Now** – otevře workflow v [Quick Drawer](../reference/quick-drawer.md), kde vyplníte jeho vstupy a spustíte běh, aniž byste opustili seznam
- **Description** – popis workflow
- **Trigger Configuration** – plán pro cron workflow nebo naslouchající trigger pro event workflow. Workflow, která jsou vyvolávána přes HTTP, zobrazují místo surového endpointu a textu o autentizaci tlačítko **Copy cURL**: zkopíruje kompletní požadavek se správnou URL, hlavičkami, zástupným symbolem pro autentizaci a tělem sestaveným z vstupních polí workflow. Pokud workflow publikuje [portál](../reference/portal.md), zobrazí se zde také jeho veřejný odkaz na chat
- **Last Run Details** – výsledek a trvání posledního běhu, nebo poznámka, že workflow ještě nikdy neběželo
- **Workflow Steps & Sub-agents** – uzly v pořadí provádění, každý se svým modelem, operací nebo plánem a tečkou označující, zda je aktivní. Výběrem kroku otevřete daný uzel v editoru s již otevřeným panelem vlastností

Panel zůstává při posouvání připnutý vedle seznamu, takže zůstává čitelný i v dlouhém seznamu workflow.
## Správa instance

Účty uvedené v `HEYM_ADMIN_EMAILS` mohou na dané instanci zobrazovat seznam, otevírat, upravovat, prohlížet historii spuštění a mazat libovolný workflow bez sdílení nebo převodu vlastnictví. Nastavení je seznam e-mailových adres oddělených čárkami, porovnávaný bez rozlišení velikosti písmen. Prázdný seznam neuděluje tento přístup nikomu. Po změně restartujte backend.

Administrátoři vidí v seznamu workflow e-mail vlastníka a mohou podle této adresy vyhledávat. Vyberte workflow a v jeho náhledu otevřete **Správu instance**:

1. **Pozastavit triggery** se zobrazuje pouze u workflow obsahujících uzel Cron. Prostřednictvím běžného verzovaného uložení deaktivuje uzel Cron daného workflow a další automatické trigger uzly. Probíhající spuštění mohou dokončit. Ruční volání, volání přes API, portál a volání z podřízených workflow zůstávají dostupná; tato akce není plošným zámkem spuštění pro celý workflow.
2. Během pozastavení se tlačítko změní na **Obnovit triggery**, a to i po opětovném načtení stránky. Obnovení znovu aktivuje triggery pozastavené administrátorem a triggery, které již byly deaktivované, ponechá beze změny. U starších pozastavených workflow bez uloženého stavu administrativního pozastavení obnovení aktivuje jejich automatické triggery.
3. Jakmile se spuštění ustálí, použijte akci **Smazat workflow** v řádku daného workflow. Smazání vrátí konflikt, dokud zůstávají běžící, zařazená nebo na kontrolu čekající úlohy. Naplánované smazání uplatňuje stejnou kontrolu.

Před smazáním pozastavte triggery a nechte probíhající spuštění dokončit. Trigger, který byl odeslán již v okamžiku pozastavení, může stále dokončit. Smazání použijte, když workflow již nesmí být volatelný.

Tajné údaje webhooků a nastavení ověřování přístupné pouze vlastníkovi si zachovávají svou stávající ochranu. Správa nepřevádí vlastnictví ani nesdílí záznamy přihlašovacích údajů vlastníka. Akce administrativního pozastavení, obnovení, smazání a plánování se zobrazují v [audit trailu](../reference/audit.md) s uvedením jednajícího administrátora a vlastníka workflow.

## Stav workflow

Každý řádek nese stavový štítek odvozený z trigger uzlů daného workflow, jeho aktuálního stavu spuštění
a — u workflow bez trigger uzlu — ze způsobu, jakým bylo zahájeno jeho poslední spuštění:

| Stav | Význam |
| --- | --- |
| **Running** | Workflow má právě probíhající spuštění |
| **Scheduled** | Má aktivní trigger [cron](../nodes/cron-node.md) |
| **Listening** | Má aktivní událostní trigger, například trigger Slack, Telegram, IMAP nebo WebSocket |
| **Paused** | Má trigger uzly, ale všechny jsou deaktivované |
| **API** | Nemá žádné trigger uzly a naposledy bylo spuštěno voláním HTTP na jeho endpoint pro spuštění |
| **SubWorker** | Nemá žádné trigger uzly a naposledy bylo spuštěno jako podřízené workflow nadřazeným workflow |
| **Portal** | Nemá žádné trigger uzly a naposledy bylo spuštěno ze svého [portálu](../reference/portal.md) |
| **WEB** | Nemá žádné trigger uzly a jeho jediným koncovým uzlem je [mapovač výstupu HTML](../nodes/html-output-mapper-node.md), takže jeho volání vrací vykreslenou webovou stránku |
| **Manual** | Nemá žádné trigger uzly a nikdy nebylo spuštěno, nebo jeho poslední spuštění přišlo odjinud |
| **Remove Scheduled** | Je [naplánováno ke smazání](../reference/workflow-organization.md) |

Štítky API, SubWorker a Portal čtou jediný nejnovější záznam v [historii spuštění](./logs-tab.md) daného workflow, takže workflow volané dvěma způsoby zobrazuje ten, který proběhl naposledy. **WEB** se určuje z grafu, a má tedy přednost před těmito třemi: workflow obsluhující stránky se zobrazuje jako WEB i poté, co bylo voláno přes HTTP. Trigger uzly vždy vítězí nad všemi z nich: cron workflow, které někdo také volá přes HTTP, zůstává **Scheduled**.

Pomocí rozevíracího seznamu **Stav** vedle vyhledávacího pole zobrazíte pouze jeden stav. Rozevírací seznam uvádí, kolik workflow aktuálně odpovídá každému z nich. Filtr stavu zasahuje i do složek: složky s odpovídající položkou se automaticky rozbalí a složky bez ní se skryjí, dokud filtr nevymažete.

## Aktivní workflow

Na počítači zobrazuje kruhový odznak v horní liště nástrojů, kolik workflow právě běží, a automaticky se obnovuje každých 10 sekund. Kliknutím na nenulový odznak otevřete seznam aktivních workflow, který před posunutím zobrazuje až čtyři řádky. Výběrem názvu workflow připojíte editor k živému náhledu daného spuštění. Nulový odznak je pouze informativní a nelze jej otevřít a na mobilních obrazovkách je odznak skrytý.

## Vyhledávání

Pomocí vyhledávacího pole workflow vedle **Stavu** nebo stisknutím **Ctrl+F** (či **Cmd+F**) filtrujte workflow podle názvu nebo popisu. Odpovídající workflow uvnitř složek se zobrazují s rozbalenými větvemi složek. Stisknutím **Escape** vyhledávání vymažete.
## Složky

- Uspořádejte workflows do [složek a podsložek](../reference/workflow-organization.md)
- Vytvářejte složky tlačítkem **New Folder** a každé přiřaďte název a volitelný popis, který se zobrazuje pod jejím názvem v seznamu
- Každý řádek složky zobrazuje počet workflows, které obsahuje, včetně podsložek, spolu s akcemi pro vytvoření nové podsložky, přejmenování, změnu ikony, stažení jako ZIP a smazání. Na telefonech řádek zobrazuje místo toho jediné tlačítko nabídky
- Přetáhněte workflow na složku nebo podsložku a zobrazí se náhled cíle ve velikosti karty.
  Zvýrazněný náhled zobrazuje úplnou cestu ke složce před uvolněním a při najetí na sbalenou
  složku se tato krátce rozbalí, abyste dosáhli na vnořené složky.
- Přetahujte workflows mezi složkami nebo do kořene. Přetahovaná karta zůstává viditelná jako duch
  a aktivní cíl zůstává zvýrazněn i při posouvání.
- Přetažení workflow zpět do jeho aktuální složky je zakázáno a označeno jako **Already in Folder**.
- Přejmenujte složku nebo změňte její popis pomocí akce přejmenování nebo kontextové nabídky po kliknutí pravým tlačítkem

## Vytváření workflows

1. Klikněte na **New Workflow**
2. Zadejte název a volitelný popis
3. Workflow se otevře v editoru

## Import

Přetáhněte a upusťte soubor workflow ve formátu JSON do oblasti workflows a vytvořte nový workflow. Importované uzly a hrany se použijí k vytvoření workflow; název pochází z pole `name` v JSON nebo z názvu souboru. Formát JSON a možnosti importu najdete v části [Download & Import](../reference/download-import.md).

## Sdílení

Otevřete workflow v editoru a klikněte na **Share** a pozvěte uživatele e-mailem nebo jej sdílejte s [týmem](./teams-tab.md). Pro každého uživatele nebo tým zvolte **Read** (zobrazení a spuštění) nebo **Write** (také úpravy) a později to změňte v rozbalovací nabídce vedle daného záznamu. Přihlašovací údaje a dílčí workflows se nesdílejí automaticky; sdílejte je samostatně se stejnými uživateli nebo týmy. Viz [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) a [Credentials Sharing](../reference/credentials-sharing.md).

## Úpravy a mazání

- **Edit** – Změňte název a popis workflow pomocí akce úprav na řádku
- **Delete** – Workflows jsou [naplánovány ke smazání](../reference/workflow-organization.md); před trvalým odstraněním se přesunou do oblasti koše

## Souběžné úpravy

Uložení odesílá revizi, ze které vaše úpravy vycházejí, a server zápis odmítne, pokud se workflow mezitím změnil — například proto, že jej uložil kolega, nebo protože jste měli stejný workflow otevřený v druhé kartě. Heym poté zobrazí dialog **Stale Workflow Detected** se dvěma možnostmi:

- **Cancel** – Ponechá vaše neuložené změny v editoru, abyste je mohli znovu načíst v jiné kartě a sladit je
- **Override** – Přesto uloží a nahradí verzi druhé osoby

**Spuštění** workflow jej nejprve uloží, takže projde stejnou kontrolou. Pokud se workflow pod vámi změnil, spuštění se pozastaví na dialogu, místo aby jej tiše přepsalo: **Override and Run** uloží vaši verzi a spustí běh, **Cancel Run** zruší obojí a ponechá vaše úpravy nedotčené.

Kontrola je součástí samotného požadavku na uložení, takže nestojí žádný dodatečný round trip a neexistuje okno, ve kterém by uložení mohlo kontrolu obejít. Vaše vlastní změny z jiných částí aplikace — přejmenování, změna nastavení, přepnutí v panelu vlastností — se nikdy nepočítají jako konflikt.

## Paleta příkazů

Stisknutím **Ctrl+K** (nebo **Cmd+K**) otevřete paletu příkazů. Můžete:
- Vyhledávat workflows podle názvu
- Přejít na libovolnou [kartu dashboardu](./credentials-tab.md)
- Otevřít nedávné workflows

## Související

- [Quick Start](../getting-started/quick-start.md) – Vytvořte svůj první workflow
- [Workflow Organization](../reference/workflow-organization.md) – Složky, podsložky a plánované mazání
- [Workflow Structure](../reference/workflow-structure.md) – Formát JSON pro workflows
- [Download & Import](../reference/download-import.md) – Export a import workflows ve formátu JSON
- [Portal](../reference/portal.md) – Zpřístupněte workflows jako veřejná chatovací rozhraní
- [Board](./board-tab.md) – Spouštějte workflows z kanbanových karet pomocí řetězení sloupců
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, uzly a spouštění
- [Execution History](../reference/execution-history.md) – Zobrazte minulé běhy a Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Připněte a spouštějte workflows z dashboardu, dokumentace a dalších stránek mimo editor
- [Contextual Showcase](../reference/contextual-showcase.md) – Krátký průvodce stránkou pro povrchy dashboardu
