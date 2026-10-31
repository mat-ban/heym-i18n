# Karta Chat

Karta **Chat** poskytuje priame rozhranie na konverzáciu s LLM. Použite ju na testovanie modelov, kladenie otázok, spúšťanie existujúcich workflowov alebo na vytvorenie nového workflowu na základe požiadavky v prirodzenom jazyku.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Pozrite si ukážku Chat</a></p>

## Nastavenie

1. Vyberte [prihlasovacie údaje](./credentials-tab.md) (API kľúč pre OpenAI, Google atď.)
2. Zvoľte model z rozbaľovacieho zoznamu (modely sa načítavajú z vybraných prihlasovacích údajov)
3. Začnite písať a odosielajte správy

Konverzáciu môžete začať aj z chatového poľa na karte [Workflowy](./workflows-tab.md). Odošle vašu prvú správu a otvorí novú konverzáciu tu s už streamovanou odpoveďou.

## Funkcie

- **Kontext globálnych premenných** – Vaše [Globálne premenné](../reference/global-variables.md) sú dostupné pre LLM, takže sa môžete pýtať na uložené hodnoty alebo na ne odkazovať
- **Kontext šablón pracovného priestoru** – Zdieľané šablóny workflowov a uzlov vo vašom pracovnom priestore sú zahrnuté ako kontext, takže Chat dokáže odpovedať na otázky o dostupných šablónach
- **Dlho bežiaci agent** – Chat pokračuje v práci na backende aj po zatvorení prehliadača, takže sa môžete vrátiť z iného zariadenia a pokračovať v tej istej konverzácii
- **Vytváranie workflowov** – Požiadajte Chat o vytvorenie alebo nastavenie workflowu a použije rovnaký engine Workflow AI Builder ako asistent v editore na vygenerovanie a uloženie workflowu
- **Vytváranie úloh v Kanban** – Prirodzene požiadajte o pridanie úlohy alebo vytvorenie karty. Chat ju pridá do prvého stĺpca požadovanej tabule; ak máte viac tabúľ a žiadnu nepomenujete, Chat pred vytvorením karty zobrazí výber tabule
- **Zaradené následné správy** – Posielajte ďalšie správy, kým odpoveď streamuje. Zaradené správy sa uchovávajú, môžete ich upraviť alebo odstrániť pred ich spustením a spúšťajú sa v poradí po aktívnej odpovedi
- **Pauzy pri plánovaní** – Keď Chat potrebuje podrobnosti plánovania, položí doplňujúce otázky a pozastaví zaradené následné správy, kým neodpoviete. Po dokončení odpovede na plánovanie sa zaradené správy obnovia
- **Prihlasovacie údaje** – Keď workflow, ktorý Chat vytvára alebo upravuje, potrebuje prihlasovacie údaje, Chat sa opýta, ktoré použiť, ponúkne vytvorenie nových v konverzácii alebo vám umožní pokračovať bez nich. Môžete tiež požiadať Chat o vytvorenie prihlasovacích údajov alebo o aktualizáciu tých, ktoré vlastníte; otvorí formulár prihlasovacích údajov v konverzácii. Model vidí názov a typ prihlasovacích údajov, nikdy nie ich hodnoty, a to pre prihlasovacie údaje, ktoré vlastníte, aj pre tie, ktoré s vami niekto zdieľa. Uzly LLM a Agent pridané Chatom bežia na prihlasovacích údajoch a modeli vybranom pre chat vrátane zdieľaných údajov; keď Chat upravuje workflow, existujúce uzly LLM a Agent si svoje prihlasovacie údaje a model ponechajú. Pozrite si [AI Assistant › Prihlasovacie údaje](../reference/ai-assistant.md#credentials)
- **Dashboards** – Opýtajte sa, aké [dashboards](./dashboard-tab.md) máte, čo sa na niektorom z nich nachádza alebo na ktorom dashboarde je workflow. Požiadajte Chat o pridanie nového widgetu na dashboard (umiestni tam prázdny widget, potom zostaví a otestuje jeho workflow), umiestnenie existujúceho workflow na dashboard ako widgetu, premenovanie alebo odstránenie widgetu či usporiadanie rozloženia dashboardu. Heym Work zobrazuje tieto dashboardy ako svoje stránky. Pozrite si [Dashboard › Z Chatu a MCP](./dashboard-tab.md#z-chatu-a-mcp)
- **Dátové tabuľky** – Keď workflow vytváraný alebo upravovaný Chatom ukladá záznamy, Chat sa opýta, akú [dátovú tabuľku](./datatable-tab.md) použiť, alebo ponúkne vytvorenie novej so stĺpcami, ktoré workflow potrebuje. Môže tiež kontrolovať riadky, pridávať alebo odstraňovať stĺpce a priamo vkladať, aktualizovať alebo mazať riadky v tabuľkách, ktoré vlastníte alebo k nim máte prístup na zápis. Zadajte názov tabuľky alebo odkaz DataTable. Odstránenie stĺpcov a vymazanie všetkých riadkov vyžaduje potvrdenie; pridanie stĺpcov zachová existujúce údaje. Pozrite si [AI asistent › Dátové tabuľky](../reference/ai-assistant.md#data-tables)
- **Streamované odpovede** – Sledujte výstup modelu počas streamovania
- **Zastavenie odpovede** – Kedykoľvek prerušte aktuálnu streamovanú odpoveď; zastavenie tiež vymaže zaradené správy pre danú konverzáciu
- **Vykresľovanie Markdownu** – Odpovede podporujú formátovanie markdownu vrátane inline obrázkov
- **Zobrazenie obrázkov** – Obrázky vložené v odpovediach (napr. z generovania obrázkov LLM) sa zobrazujú inline; kliknutím na ľubovoľný obrázok ho zobrazíte na celú obrazovku. Stlačením **Esc** alebo tlačidla späť (mobil) zatvoríte zobrazenie na celú obrazovku
- **Kopírovanie správ** – Skopírujte ľubovoľnú správu do schránky
- **Vymazanie chatu** – Začnite novú konverzáciu
- **Hlasový vstup** – Použite tlačidlo mikrofónu na prevod reči na text (podporované prehliadačom). Po zastavení nahrávania môže Heym mierne vyčistiť prepis pred jeho odoslaním
- **Plánované workflowy** – Pýtajte sa, kedy sa spúšťajú cron workflowy (dnes, tento týždeň, tento mesiac alebo vlastný rozsah dátumov). Asistent používa rovnaké údaje o pláne ako karta [Plány](./scheduled-tab.md) a dokáže obmedziť výsledky na workflowy, ktoré vlastníte, alebo zahrnúť tie, ktoré sú s vami zdieľané
- **História spustení workflowov** – Pýtajte sa na jeden workflow („koľkokrát sa spustila denná zostava?", „zlyhalo to?", „kedy sa naposledy spustil?"). Chat vyhľadá workflow podľa jeho ID a odpovie na základe počtu spustení, prehľadu stavov, času prvého a posledného spustenia a priemerného trvania. Opýtajte sa, prečo spustenie zlyhalo alebo čo vrátilo, a Chat potom otvorí to konkrétne spustenie, aby prečítalo jeho vstupy, výstupy a chyby jednotlivých uzlov
- **Kde behy zlyhávajú a prečo sú pomalé** – Opýtajte sa, kde vaše workflow zlyhávajú alebo prečo sú pomalé, a Chat uvedie workflow, ktoré bežali najčastejšie, najviac zlyhávali a sú najpomalšie, a tiež typy uzlov, ktoré zaberajú najviac času (priemer na volanie a celkovo), najviac zlyhávajú a bežia najčastejšie, teda rovnaké čísla ako na karte [Analytics](./analytics-tab.md). Typy uzlov sa počítajú pre behy od verzie, ktorá pridala analýzu uzlov. Opýtajte sa na poslednú hodinu, 3 alebo 6 hodín, 24 hodín, 7 alebo 30 dní či celú históriu; hodinové okná sa začínajú v celú hodinu, takže „posledná hodina“ o 15:20 pokrýva čas od 14:00 do súčasnosti.
- **Živý stav spustení** – Opýtajte sa, čo práve beží, a Chat odpovie s počtom, názvami workflowov, ako dlho každé spustenie prebieha, na ktorom uzle sa nachádza a s priamym odkazom na živé spustenie
## Používanie Chatu z MCP klienta

Engine Chatu je možné používať aj mimo prehliadača. Zapnite **Heym Agent** na [karte MCP / A2A](./mcp-tab.md) a klienti MCP (Claude, Cursor a akékoľvek iné nástroje podporujúce MCP) získajú jediný nástroj `heym_chat`, ktorý spúšťa tento istý engine so všetkými jeho schopnosťami. Začiarknite tiež **Povoliť A2A** a ďalší agenti mu môžu posielať úlohy cez [A2A](../reference/a2a.md); tieto konverzácie zobrazujú v zozname ikonu siete.

Tieto konverzácie sa ukladajú do histórie tejto karty a v zozname konverzácií sú označené ikonou zástrčky. Otvorte jednu z nich, aby ste si prečítali, na čo sa klient pýtal, pozrite si karty nástrojov, ktoré spustil, a pokračujte vo vlákne sami. Odpovedanie na doplňujúcu otázku funguje rovnako, či už turn začal tu alebo z MCP klienta.

Cez MCP Chat nezobrazuje, nevyberá ani nevytvára prihlasovacie údaje. Workflowy, ktoré zostaví, ponechávajú polia prihlasovacích údajov prázdne a odpoveď uvádza uzly, ktoré vyžadujú prihlasovacie údaje, aby ste ich mohli nastaviť v editore.

Dátové tabuľky fungujú aj cez MCP: Chat môže priamo upravovať stĺpce a riadky, vytvárať tabuľky a prepájať ich do workflow. Otázky k tabuľkám a potvrdenia o vymazaní prichádzajú ako text vo výsledku; odpovedzte s rovnakým `conversation_id`.

## Limit kontextu

Chat udržiava v kontexte až 25 najnovších správ. Staršie správy sa orezávajú, aby sa zachovali limity modelu.

## Vytváranie workflowov

Keď požiadate Chat, aby vytvoril, zostavil, vygeneroval alebo nastavil workflow, vytvorí nový uložený workflow s vygenerovaným názvom a popisom. Odpoveď obsahuje náhľad plátna iba na čítanie s vygenerovanými uzlami a hranami a odkaz **Open workflow**, ktorý otvorí editor workflowu v novej karte prehliadača. Tlačidlo **Run** na karte náhľadu použite, keď chcete workflow spustiť.

Následná spätná väzba v tom istom chate upraví tento workflow namiesto vytvorenia ďalšieho. Napríklad po tom, čo Chat vytvorí workflow, môžete povedať „pridaj krok schválenia", „zmeň formát výstupu" alebo „şöyle yap" a Chat aktualizuje uložený workflow a obnoví náhľad.

Toto je najvhodnejšie pre požiadavky, pri ktorých chcete, aby bola práca vykonaná ako opakovane použiteľná automatizácia, nielen ako jednorazová odpoveď.

## Vytváranie Kanban úloh

Požiadajte Chat bežným jazykom, napríklad „Pridaj úlohu s názvom Opraviť chybu prihlásenia" alebo
„Vytvor novú kartu Aktualizovať dokumentáciu na nástenke Launch." Popis môžete uviesť v tej istej požiadavke. Chat vždy vytvorí kartu v prvom stĺpci vybranej nástenky.

Ak má váš pracovný priestor niekoľko násteniek a žiadnu neidentifikujete, Chat sa pozastaví s
výberom nástenky s jednou voľbou. Vyberte nástenku a dokončite vytvorenie karty. Nevyžaduje sa žiadny slash príkaz
ani špeciálny formát správy.

## Pýtanie sa, čo beží

Pýtajte sa bežným jazykom — „čo beží?", „koľko workflowov je práve aktívnych?",
„na ktorom uzle je nočný report?" — a Chat podá aktuálny obraz:

- **Koľko** spustení prebieha, rozdelených na bežiace a čakajúce na ľudskú kontrolu
- **Ktorým workflowom** patria, podľa názvu
- **Ako dlho** každé spustenie prebieha (napríklad `1m 35s`, `3h 25m`)
- **Ktorý uzol** práve vykonáva činnosť, podľa jeho označenia na plátne, plus posledný uzol, ktorý dokončil činnosť
- **Odkaz** na každé živé spustenie, ktorý otvorí plátno s prehrávaním tohto spustenia

Spustenia pozastavené na [Human-in-the-Loop](../reference/human-in-the-loop.md) alebo kontrolu Codex sa hlásia ako
čakajúce na vás, nie ako bežiace. Ide o rovnaké údaje ako odznak aktívnych spustení v hlavičke,
takže Chat a odznak sa nikdy nezhodujú v neprospech. Pre spustenia, ktoré už skončili, si namiesto toho vyžiadajte nedávne spustenia
— to číta [Históriu spustení](../reference/execution-history.md).

## Otázky k spusteniu

Vyberte spustenie Workflow v [Execution History](../reference/execution-history.md#ask-ai), z editora alebo z All History, a kliknite na **Opýtať sa AI** vedľa názvu dialógu. Chat otvorí novú konverzáciu s dvoma čipmi nad poľom správy:

- **Workflow:** názov Workflow
- **Execution:** prvých niekoľko znakov ID vybraného spustenia

Čip odstránite jeho **×**, ak ho nechcete použiť. Potom položte otázku, napríklad „prečo toto spustenie trvalo tak dlho?“, „čo tu zlyhalo?“ alebo „môžete to opraviť?“. Zostávajúce čipy sa k tejto správe pripoja s úplnými ID, takže Chat priamo číta vstupy, výstupy a trace jednotlivých uzlov spustenia namiesto hľadania Workflow. Na opravu Workflow Chat zmenu uloží, otestuje a overí, ako je opísané v [Vytváranie workflowov](#vytvaranie-workflowov).

Odoslaná správa zobrazuje čipy pod vašou otázkou. Patria iba k tejto správe; nadväzujúce otázky v tej istej konverzácii si zachovajú kontext z histórie.

## Pýtanie sa na upozornenia

Chat dokáže odpovedať na otázky o [upozorneniach](./alerts-tab.md), ktoré ste definovali:

- **Čo existuje** — „aké upozornenia mám?", „je nejaké upozornenie na workflow faktúr?",
  „ktoré upozornenia práve teraz hlásia?"
- **Ako je niektoré nastavené** — „aká je prahová hodnota na upozornení nákladov?", „ako je to nakonfigurované?"
- **Prečo a kedy sa spustilo** — „prečo sa spustilo upozornenie nákladov?", „kedy sa to naposledy spustilo?"

Pri otázke „prečo sa to spustilo" Chat prečíta záznam o spustení a uvedie skutočnú pozorovanú
hodnotu, prahovú hodnotu a presné okno, ktoré bolo vyhodnotené, plus príslušný detail:
identifikátory zlyhaných spustení a chybové správy pre chybové upozornenia, výdavky podľa modelu pre upozornenia nákladov alebo
rozpis podľa zdroja triggera pre upozornenia na počet spustení. Hlási, čo platilo v čase, keď sa upozornenie
spustilo, namiesto prepočítavania okna, pretože okno už uplynulo a nový výpočet
môže dať inú odpoveď.

## Pravidlá používateľa

[Pravidlá používateľa](../reference/user-settings.md) (nakonfigurované v Nastaveniach) sa automaticky vkladajú do každej konverzácie Chatu ako inštrukcie na úrovni systému. Nastavte ich raz, aby sa trvalé preferencie uplatnili na všetky požiadavky chatu.

## Práca s Evals

Chat môže vytvárať, upravovať a spúšťať sady v [Evals](./evals-tab.md), ako sady promptov, tak sady agentov:

- **Sada promptov**: „vytvor sadu promptov pre môj prompt odpovede podpory s 8 testovacími prípadmi a porovnaj gpt-4o s gpt-4.1-mini“. Chat spíše testovacie prípady s očakávanými odpoveďami, vyberie metódu hodnotenia a sadu uloží.
  - Pred vytvorením sady určí, ktoré prihlasovacie údaje LLM a modely použiť. S presne jednými údajmi LLM použije tieto a oznámi to; inak sa opýta.
  - Pre hodnotenie LLM-as-Judge sa tiež opýta, či má odpovede hodnotiť samostatný rozhodca.
- **Sada agenta**: „skontroluj, či môj agent podpory vždy prehľadáva dokumentáciu a nikdy neodosiela e-maily“. Chat vyhľadá agenta a uloží kontroly nástrojov a prahové hodnoty. Na požiadanie spustí workflow a pre každý beh vygeneruje iný vstup.
  - Behy sád agentov sú skutočné behy workflow, takže dochádza k ich vedľajším účinkom. Chat uvádza, koľko behov spúšťa.
- **Baseline**: Chat môže s východiskovou hodnotou agenta pracovať tromi spôsobmi:
  - Nahlásiť ju z posledných behov agenta.
  - Zostaviť ju z behov, ktoré sám spustí („spusť ho 5-krát a použi to ako baseline“).
  - Uložiť čísla, ktoré mu zadáte („nastav baseline na 3 sekundy p95 a 0,01 $ za beh“).
- **Behy**: Chat čaká na beh až jednu minútu a potom oznámi výsledok:
  - Pri sade promptov: počet úspešných testov každého modelu a prípady, ktoré zlyhali.
  - Pri sade agenta: mieru úspešnosti, neúspešné kontroly a odchýlku od baseline.
  - Dlhší beh pokračuje v Evals; požiadajte Chat, aby ho skontroloval znova.

Potom, čo Chat vytvorí alebo upraví sadu, odpoveď zobrazí kartu s názvom sady, jej typom a tlačidlom **Otvoriť v Evals**, podobne ako karta uloženého workflow. Cez MCP výsledok `heym_chat` uvádza odkaz na každú sadu uloženú v tomto volaní.

To isté funguje z klienta MCP prostredníctvom `heym_chat` (pozrite si [Používanie Chatu z klienta MCP](#používanie-chatu-z-klienta-mcp)). Nástroje na hodnotenie zostávajú vo vnútri `heym_chat`; klienti MCP ich nevidia ako samostatné nástroje.

AI asistent v editore sady nevytvára.

## Práca s Evals

Chat môže vytvárať, upravovať a spúšťať sady v [Evals](./evals-tab.md), ako sady promptov, tak sady agentov:

- **Sada promptov**: „vytvor sadu promptov pre môj prompt odpovede podpory s 8 testovacími prípadmi a porovnaj gpt-4o s gpt-4.1-mini“. Chat spíše testovacie prípady s očakávanými odpoveďami, vyberie metódu hodnotenia a sadu uloží.
  - Pred vytvorením sady určí, ktoré prihlasovacie údaje LLM a modely použiť. S presne jednými údajmi LLM použije tieto a oznámi to; inak sa opýta.
  - Pre hodnotenie LLM-as-Judge sa tiež opýta, či má odpovede hodnotiť samostatný rozhodca.
- **Sada agenta**: „skontroluj, či môj agent podpory vždy prehľadáva dokumentáciu a nikdy neodosiela e-maily“. Chat vyhľadá agenta a uloží kontroly nástrojov a prahové hodnoty. Na požiadanie spustí workflow a pre každý beh vygeneruje iný vstup.
  - Behy sád agentov sú skutočné behy workflow, takže dochádza k ich vedľajším účinkom. Chat uvádza, koľko behov spúšťa.
- **Baseline**: Chat môže s východiskovou hodnotou agenta pracovať tromi spôsobmi:
  - Nahlásiť ju z posledných behov agenta.
  - Zostaviť ju z behov, ktoré sám spustí („spusť ho 5-krát a použi to ako baseline“).
  - Uložiť čísla, ktoré mu zadáte („nastav baseline na 3 sekundy p95 a 0,01 $ za beh“).
- **Behy**: Chat čaká na beh až jednu minútu a potom oznámi výsledok:
  - Pri sade promptov: počet úspešných testov každého modelu a prípady, ktoré zlyhali.
  - Pri sade agenta: mieru úspešnosti, neúspešné kontroly a odchýlku od baseline.
  - Dlhší beh pokračuje v Evals; požiadajte Chat, aby ho skontroloval znova.

Potom, čo Chat vytvorí alebo upraví sadu, odpoveď zobrazí kartu s názvom sady, jej typom a tlačidlom **Otvoriť v Evals**, podobne ako karta uloženého workflow. Cez MCP výsledok `heym_chat` uvádza odkaz na každú sadu uloženú v tomto volaní.

To isté funguje z klienta MCP prostredníctvom `heym_chat` (pozrite si [Používanie Chatu z klienta MCP](#používanie-chatu-z-klienta-mcp)). Nástroje na hodnotenie zostávajú vo vnútri `heym_chat`; klienti MCP ich nevidia ako samostatné nástroje.

AI asistent v editore sady nevytvára.

## Súvisiace

- [Karta MCP / A2A](./mcp-tab.md) – Sprístupnite tento engine pre MCP klientov ako nástroj `heym_chat`
- [Nastavenia](../reference/user-settings.md) – Nastavte Pravidlá používateľa aplikované na všetky požiadavky v Chate
- [Karta Prihlasovacie údaje](./credentials-tab.md) – Pridávanie a správa API kľúčov
- [Karta Premenné](./global-variables-tab.md) – Globálne premenné dostupné pre Chat
- [Typy uzlov](../reference/node-types.md) – LLM a Agent uzly pre workflowy
- [Uzol Agent](../nodes/agent-node.md) – AI Agent s volaním nástrojov
- [AI asistent](../reference/ai-assistant.md) – Asistent editora poháňaný rovnakým DSL pre tvorbu workflowov
- [História spustení](../reference/execution-history.md) – Zobrazenie minulých spustení (tlačidlo História v hlavičke)
- [Karta Plány](./scheduled-tab.md) – Kalendár nadchádzajúcich cron spustení (rovnaké údaje, ktoré môže Chat sumarizovať)
- [Karta Upozornenia](./alerts-tab.md) – Prahové upozornenia, ktoré Chat dokáže vypísať a vysvetliť
- [Kontextová ukážka](../reference/contextual-showcase.md) – Kompaktná orientácia v aplikácii pre túto stránku
- [Chat Voice (TTS & STT)](../reference/chat-voice.md) – Čítanie správ nahlas a rozhovor hands-free s ElevenLabs

## Volania nástrojov a veľkosť kontextu

Zakaždým, keď asistent zavolá nástroj (spustí workflow, vypíše spustenia, vytvorí nový workflow), sa v konverzácii zobrazí rozbaľovacia karta. Karta sa počas behu nástroja automaticky rozbalí a zobrazí presné argumenty. Keď nástroj dokončí činnosť, karta sa zbalí do jednoriadkového súhrnu s uplynutým časom. Kliknutím na ľubovoľnú kartu opätovne rozbalíte argumenty a súhrn odpovede.

Malý kruhový odznak pod vstupom zobrazuje aktuálne využitie kontextu ako percento okna modelu (napr. `12% · ~9.2k`). Pri prejdení myšou nad odznakom sa zobrazí rozpis: systémový prompt, AGENTS.md, blok workflowov, pravidlá používateľa, história a váš koncept vstupu. Keď využitie prekročí 80 %, krúžok zmení farbu na jantárovú; pri 95 % sčervenie.

Ak sa využitie priblíži k limitu, Heym automaticky skomprimuje staršie správy do krátkeho súhrnu pomocou rovnakého mechanizmu, aký používajú Agent uzly. Inline sa zobrazí karta „Kontext skomprimovaný", ktorá ukazuje, čo sa stalo.
