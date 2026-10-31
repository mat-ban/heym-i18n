# AI Assistant

**AI Assistant** je panel chatu, ktorý sa otvára z panela Debug a zobrazuje sa v pravom dolnom rohu editora. Potiahnutím hlavičky ho presuniete a potiahnutím okraja alebo rohu zmeníte jeho šírku alebo výšku. Nezmenší sa pod 360×480 pixelov. Poloha a veľkosť sa ukladajú v tomto prehliadači. Voľba **Reset position and size** v hlavičke vráti panel späť do pravého dolného rohu. Pomocou prirodzeného jazyka môžete vytvárať alebo upravovať workflowy – opíšte, čo chcete, a AI vygeneruje uzly a hrany, ktoré sa aplikujú na plátno.

V prípade otázok k dokumentácii mimo editora použite [Chat with Heym](./chat-with-heym.md). Toto rozhranie je optimalizované na pomoc s produktom v kontexte stránky namiesto generovania workflowov.

## Otvorenie panela

1. Otvorte workflow v editore
2. Nájdite **Debug panel** v spodnej časti (oblasť s výsledkami spustenia)
3. Kliknite na tlačidlo **AI** (ikona Sparkles) na paneli s nástrojmi panela
4. Panel AI Assistant sa otvorí v pravom dolnom rohu. Potiahnutím jeho hlavičky ho presuniete alebo potiahnutím okraja či rohu zmeníte jeho šírku a výšku.

Stlačením `Ctrl + I` / `Cmd + I` kdekoľvek v editore panel otvoríte alebo zatvoríte – skratka funguje aj vtedy, keď je aktívne textové pole. Pozrite si [Keyboard Shortcuts](./keyboard-shortcuts.md).

Ak chcete pracovať na jedinom uzle, prejdite naň myšou na plátne a kliknite na **AI** nad ním. Panel sa otvorí so zameraním na tento uzel. Pozrite [Zmena jedného uzla](#changing-one-node).

## Zatvorenie panela

Kliknite na tlačidlo **X**, stlačte `Ctrl + I` / `Cmd + I` alebo prepnite tlačidlo **AI** na paneli s nástrojmi panela Debug. Hlavička panel presúva, nie zatvára.

## Konfigurácia

Pred odoslaním správ vyberte:

| Nastavenie | Popis |
|---------|-------------|
| **Credential** | Prihlasovacie údaje LLM (API kľúč) z [Credentials](../tabs/credentials-tab.md) |
| **Model** | Názov modelu (napr. `gpt-4o`, `gemini-2.5-flash`) |

Prihlasovacie údaje pridajte v [Credentials Tab](../tabs/credentials-tab.md). Zoznam modelov sa načíta z vybraných prihlasovacích údajov.

## Režim Agent vs režim Ask

Panel má dva režimy, ktoré prepínate pomocou čipu **Agent / Ask** v hlavičke panela.

| Režim | Predvolený | Správanie |
|------|---------|-----------|
| **Agent** | ✓ | Vytvára a upravuje plátno. AI vygeneruje blok JSON s workflowom, ktorý sa po dokončení odpovede automaticky aplikuje na plátno. |
| **Ask** | | Iba odpovedá na otázky. Plátno sa nikdy nedotkne. Použite ho na otázky týkajúce sa vášho workflowu, funkcií Heym alebo na získanie rád bez spustenia aktualizácie plátna. |

Režimy môžete kedykoľvek prepnúť. Zmena režimu nevymaže konverzáciu.

V režime Agent pole **YOLO mode** pod poľom pre správu spôsobí, že asistent spustí a opraví to, čo vytvoril. Pozrite si [YOLO Mode](#yolo-mode).

## Používanie chatu

- Napíšte svoju požiadavku do vstupného poľa (napr. „Create a workflow that takes user input and sends it to an LLM“)
- Stlačením **Enter** ju odošlete (Shift+Enter pre nový riadok)
- AI streamuje svoju odpoveď. V režime **Agent**, ak odpoveď obsahuje workflow v bloku kódu \`\`\`json, automaticky sa spracuje a aplikuje na plátno. V režime **Ask** sa plátno nikdy neupraví.
- Pomocou **Clear** resetujete konverzáciu
- Ukážte na správu a kliknite na jej ikonu kopírovania, čím skopírujete text, ktorý zobrazuje, vrátane akéhokoľvek JSON s workflowom
- Potiahnutím riadku nad poľom pre správu pole zväčšíte. Vstupná oblasť môže narásť na 60 % panela a pri opätovnom načítaní stránky sa vráti do predvolenej výšky

## Automatická aplikácia workflowu

Keď odpoveď AI obsahuje platný blok JSON s workflowom (s `nodes` a voliteľne `edges`) v bloku kódu \`\`\`json, Heym:

1. Spracuje JSON z odpovede
2. Nahradí aktuálne plátno novými uzlami a hranami
3. Usporiadá rozloženie uzlov
4. Označí workflow ako neuložený

Ak spracovanie zlyhá, zobrazí sa tlačidlo **Retry** na opätovné vygenerovanie odpovede.

## Zmena jedného uzla

Prejdite myšou na uzel na plátne a kliknite na **AI** nad ním. Panel sa otvorí v režime Agent so zameraním na tento uzel a ukáže, ktorý uzel mení:

| Uzel má... | Panel zobrazuje |
|---|---|
| Žiadny výsledok v aktuálnom behu | **Modifying Node:** v kompaktnom riadku s ikonou a názvom uzla. Asistent upravuje iba z konfigurácie uzla; spustite uzel najprv, ak má vidieť výstup |
| Výsledok v aktuálnom behu | **Modifying Node: (Has Node Output)** nad samotným uzlom: ikona, názov a typ, posledný stav a trvanie a chyba, ak zlyhal. Asistent vidí tento výstup a chybu pri úprave uzla |

Prejdite myšou na štítok, aby ste videli, v akom stave sa panel nachádza.

V akomkoľvek stave sa panel nachádza, asistent číta aj dokumentačnú stránku uzla za ikonou knihy v záhlaví uzla. Využíva ju na pochopenie možností uzla a zodpovedanie otázok o nich.

Pod správami začínajú požiadavku tri možnosti:

| Možnosť | Čo robí |
|---|---|
| **Change this node as ...** | Vyplní pole správy textom *Zmeň tento uzel na*, aby ste vetu dokončili |
| **Fix error in this node ...** | Vyplní *Oprav chybu v tomto uzle.* Asistent prečíta chybu tohto uzla z posledného behu |
| **Other** | Zameria prázdne pole správy |

Upravte text a stlačte **Send**. Asistent vráti iba tento uzel a Heym ho aktualizuje na mieste: uzel si zachováva svoje id, typ a názov, takže výrazy ako `$checkLinkedIn.result` v iných uzloch fungujú ďalej. Ostatné uzly, prepojenia a rozloženie sa nemenia a **Undo** obnoví predchádzajúcu konfiguráciu.

Ak sa požiadavka do uzla nezmestí, napríklad vyžaduje iný typ uzla alebo nový uzel, asistent uvedie, čo by sa malo zmeniť namiesto úpravy. Zatvorte zameranie uzla pomocou **X** na karte uzla, aby ste znova upravili celý workflow. Zatvorenie panela tiež vymaže zameranie.

[Režim YOLO](#yolo-mode) funguje so zameraným uzlom: asistent mení uzel, spúšťa workflow a opravuje uzel, kým beh neuspeje. V režime **Ask** zameranie hovorí asistentovi, o aký uzel ide pri vašej otázke, a plátno sa nemení.

## Režim YOLO

**Režim YOLO** umožňuje asistentovi otestovať to, čo vytvoril. Začiarknite pole **YOLO mode** pod poľom pre správu a potom odošlite svoju požiadavku. Pole sa zobrazuje iba v režime Agent. Predvolene je vypnuté a pri opätovnom načítaní stránky sa vráti do vypnutého stavu. Ukážte na ikonu s informáciami vedľa neho a zobrazí sa krátke zhrnutie.

Pri zapnutom režime YOLO asistent po aplikovaní workflowu nekončí:

1. Aplikuje workflow na plátno.
2. Pred prvým spustením si vyžiada testovacie vstupy. Karta zobrazuje vstupné polia workflowu vyplnené hodnotami, ktoré asistent navrhuje. Upravte ich a stlačte **Run**. Ďalšie spustenia tieto hodnoty znova použijú. Karta sa vráti iba vtedy, keď sa zmenia vstupné polia alebo keď asistent potrebuje iné testovacie údaje.
3. Spustí workflow na plátne presne ako tlačidlo **Run**: neuložené zmeny sa najprv uložia, uzly sa rozsvietia a spustenie sa zobrazí v paneli Debug a v [Execution History](./execution-history.md).
4. Prečíta výsledok. Ak spustenie urobilo to, o čo ste žiadali, skončí s označením **Verified** a krátkym zhrnutím. Ak nie, opraví workflow a spustí ho znova.

Na jednu správu vykoná najviac **5 spustení**. Stlačením **Stop** kedykoľvek ukončíte slučku a zastavíte prebiehajúce spustenie.

Každá odpoveď zobrazuje svoje kroky tak, ako sa dejú:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5` s riadkom `Executing <node>` pre každý uzol;
- konečný verdikt.

Po každom spustení krátky riadok, napríklad *Attempt 1 result sent · error in 1.2s*, ukazuje, že výsledok sa vrátil asistentovi.
### Spúšťanie ostatných workflowov

V režime YOLO môže asistent spúšťať aj Vaše ostatné workflowy, keď potrebuje ich výsledok. Napríklad môže skontrolovať, čo workflow vracia, predtým než ho zavolá z uzla [Execute](../nodes/execute-node.md). Tieto spustenia sa zobrazujú ako kroky `Running workflow "<name>"...` a zaznamenávajú sa v Histórii spustení so zdrojom triggera `ai_assistant`. Workflow, ktorý sa práve upravuje, sa vždy testuje na plátne.

### Kedy sa zastaví predčasne

| Situácia | Čo sa stane |
|---|---|
| Asistent potrebuje rozhodnutie, informáciu, prihlasovacie údaje alebo dátovú tabuľku | Opýta sa pomocou obvyklej karty s otázkou. Odpoveďou sa slučka obnoví. |
| Spustenie čaká na [ľudskú kontrolu](./human-in-the-loop.md) | Slučka sa zastaví. Schváľte kontrolu a potom pošlite správu. |
| Workflow čaká na nahranie súboru | Slučka sa zastaví. Režim YOLO nedokáže testovať spustenia vyvolané nahraním súboru. |
| Novšia verzia workflowu bola uložená inde | Slučka sa zastaví. Vyriešte konflikt uloženia a potom pošlite správu. |

> **Spustenia sú reálne.** E-maily, správy a volania API vo workflowe sa pri každom pokuse skutočne odošlú a uzly DataTable zapisujú skutočné riadky. Každé spustenie uloží workflow, takže predchádzajúce verzie zostávajú v [Histórii úprav](./edit-history.md).

## Hlasový vstup

V podporovaných prehliadačoch tlačidlo **Voice** zapína prevod reči na text. Kliknutím začnite nahrávať, ďalším kliknutím zastavte. Prepísaný text sa pred odoslaním pošle AI na opravu gramatiky.

## Uzol Agent vs AI asistent

| | Uzol Agent | AI asistent |
|---|------------|---------------|
| **Účel** | LLM uzol vo vnútri workflowu; spúšťa sa počas vykonávania | Chat UI na tvorbu workflowov pomocou prirodzeného jazyka |
| **Umiestnenie** | Uzol na plátne | Panel ladenia → plávajúci panel |
| **Kedy** | Počas behu | Počas úprav |

Uzol workflowu, ktorý vykonáva volania LLM s nástrojmi a MCP, nájdete v časti [Uzol Agent](../nodes/agent-node.md).

## Ako to funguje (AI Builder DSL)

AI asistent je poháňaný **workflow DSL** (doménovo špecifickým jazykom), ktorý popisuje uzly, hrany a výrazy. Keď pošlete správu:

1. Vaša správa spolu s [Pravidlami používateľa](./user-settings.md) a aktuálnym workflowom (ak existuje) sa odošlú na backend.
2. Backend zostaví **systémový prompt**, ktorý obsahuje:
   - Kompletný workflow DSL (typy uzlov, syntax výrazov, pravidlá, príklady)
   - Vaše Pravidlá používateľa pripojené ako "User Custom Rules"
   - JSON aktuálneho workflowu, keď upravujete existujúci workflow
   - Zoznam dostupných workflowov, ak používate uzol Execute
   - Názvy, typy a id prihlasovacích údajov, ktoré vlastníte alebo ktoré s Vami boli zdieľané (nikdy ich hodnoty)
   - Názvy, id, popisy a stĺpce dátových tabuliek, ktoré môžete použiť (nikdy ich riadky)
3. Model vráti jeden blok JSON workflowu (s `nodes` a `edges`). Frontend ho spracuje a aplikuje na plátno.

### Prihlasovacie údaje

Keď workflow potrebuje prihlasovacie údaje, asistent sa pred ich vytvorením opýta. Ak máte prihlasovacie údaje vhodného typu, vypíše ich spolu s možnosťou **Create a new credential**; ak nemáte žiadne, opýta sa, či nejaké vytvoriť. Pri každej otázke môžete tiež pokračovať bez prihlasovacích údajov.

Voľba vytvoriť ich otvorí formulár prihlasovacích údajov v paneli, prednastavený na správny typ a s navrhovaným názvom. Hodnoty idú priamo do Heymu; asistent sa dozvie iba názov a typ. OAuth prihlasovacie údaje (Google Sheets, Google Drive, BigQuery, Linear, Notion) sa pripájajú v kontextovom okne a v prípade, že je okno zablokované, sa zobrazí odkaz na autorizačnú stránku. Po uložení prihlasovacích údajov karta zobrazí ich názov a tlačidlo vytvorenia sa vypne; stlačte **Submit answers** a asistent umiestni nové prihlasovacie údaje na uzol.

Môžete tiež požiadať o prihlasovacie údaje samostatne ("create a GitHub credential") alebo požiadať o zmenu tých, ktoré vlastníte ("update my sheet credential", "reconnect my Google Sheets"). Asistent odpovie tou istou kartou: vytvorenie otvorí prázdny formulár, aktualizácia otvorí formulár na daných prihlasovacích údajoch s ich tajomstvami skrytými.

Asistent uprednostňuje špecializovaný uzol. Keď žiadny uzol nepokrýva danú operáciu, napríklad pridanie hárka do Google Sheetu, použije HTTP požiadavku a zapíše riadok hlavičky pre zvolené prihlasovacie údaje. Pozrite si [HTTP › Autentifikácia pomocou prihlasovacích údajov](../nodes/http-node.md#authenticating-with-credentials).

Doplňujúce otázky, bez ktorých sa workflow zaobíde, majú vo svojom vstupe označenie **Optional** a možno ich preskočiť.

DSL vyžaduje označenia v camelCase, jednotné pravidlá výrazov a polia špecifické pre uzly. Ak je hodnota poľa jediný `$expr`, backend zachová natívny typ; ak hodnota mieša prózu s `$refs`, výsledkom je reťazec. Pravidlo jedného `$` stále platí: žiadne `$` vnútri zátvoriek. Pravidlá používateľa z [Nastavení](./user-settings.md) sa vkladajú do tohto systémového promptu, takže Vaše preferencie sa uplatnia pri každom workflowe vygenerovanom AI.

Ak aktuálny workflow obsahuje zručnosti Agenta, AI asistent zahrnie do kontextu tohto workflowu iba `SKILL.md` každej zručnosti. Pripojené súbory `.py` a binárne aktíva zručností sa pred požiadavkou odstránia, aby zostavovateľ zostal v rámci limitov kontextu modelu, aj keď zručnosti obsahujú rozsiahle implementácie.
### Dátové tabuľky

Keď workflow ukladá, uchováva alebo vyhľadáva záznamy a nemáte pomenované iné úložisko, asistent použije uzol [DataTable](../nodes/datatable-node.md). Ak pomenujete jednu zo svojich tabuliek a tá má stĺpce, ktoré workflow potrebuje, asistent ju použije. V opačnom prípade sa opýta, ktorú tabuľku použiť. Karta zobrazuje zoznam tabuliek, ktoré vyhovujú, každú s jej popisom a typmi stĺpcov, plus **Vytvoriť novú tabuľku** s navrhovaným názvom a stĺpcami. Ponúkajú sa aj tabuľky, ktoré sú s vami zdieľané; tabuľka, ktorú môžete iba čítať, sa ponúka len na čítanie.

Vyberte novú tabuľku a stlačte **Odoslať odpovede**: karta vytvorí tabuľku a asistent umiestni jej id na uzol a použije jej presné názvy stĺpcov. Môžete tiež požiadať o tabuľku samostatne, napríklad „vytvor tabuľku pre moje leady".

Asistent na plátne vidí názvy tabuliek, popisy a stĺpce, nikdy riadky. Z týchto metadát konfiguruje uzly workflow; stĺpce môžete pridať na [karte DataTable](../tabs/datatable-tab.md) alebo o to požiadať v [Chate](../tabs/chat-tab.md). Chat a `heym_chat` môžu kontrolovať riadky a priamo pridávať alebo odstraňovať stĺpce a vkladať, aktualizovať alebo mazať riadky v tabuľkách, ktoré vlastníte alebo ku ktorým máte práva na zápis, vrátane tímových zdieľaní. Odstránenie stĺpcov a vymazanie všetkých riadkov vyžaduje pred vymazaním údajov potvrdenie.

## Súvisiace

- [Prečo Heym](../getting-started/why-heym.md) – Tvorba v prirodzenom jazyku ako prvá fáza životného cyklu agenta
- [Rýchly štart](../getting-started/quick-start.md) – Vytvorte svoj prvý workflow
- [Nastavenia](./user-settings.md) – Používateľské pravidlá vkladané do systémového promptu AI asistenta
- [Chat s Heym](./chat-with-heym.md) – Asistent s kontextom stránky v oblasti dokumentácie
- [Kľúčové koncepty](../getting-started/core-concepts.md) – Workflowy, uzly a priebeh spustenia
- [Uzol agenta](../nodes/agent-node.md) – LLM uzol s nástrojmi a MCP
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridajte API kľúče pre AI asistenta
- [Štruktúra workflowu](./workflow-structure.md) – JSON formát pre workflowy
