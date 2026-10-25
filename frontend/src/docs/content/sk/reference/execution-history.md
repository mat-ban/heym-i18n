# História spustení

História spustení zaznamenáva behy workflowov: vstupy, výstupy, výsledky uzlov, stav a zdroj triggera. Použite ju na sledovanie aktívneho produkčného behu, kontrolu minulých behov, ladenie zlyhaní alebo opätovné spustenie s rovnakými vstupmi prostredníctvom funkcie **Bring to Canvas**.

## Prehľad

Každé spustenie ukladá:

| Pole | Popis |
|-------|-------------|
| **Inputs** | Telo požiadavky alebo vstupy behu (napr. `text` pre Vstupný uzol) |
| **Outputs** | Výstupy na úrovni workflowu |
| **Node results** | Výstupy jednotlivých uzlov, stav a čas vykonania |
| **Status** | `success`, `error`, `pending`, `skipped` alebo `failed` (pozri [Obnova po zlyhaní](#crash-recovery)) |
| **trigger_source** | Ako bol beh spustený (pozri [Triggers](./triggers.md)) |

## Prístup k histórii

| Umiestnenie | Rozsah |
|----------|-------|
| Panel nástrojov **Editora** | Iba aktuálny workflow |
| Hlavička zobrazenia **Docs** | Iba aktuálny workflow |
| Hlavička **Dashboardu** (karta Chat) | Všetky workflowy + behy chatu/asistenta |
| Hlavička zobrazenia **Evals** | Všetky workflowy + behy chatu/asistenta |

Kliknutím na tlačidlo **History** (ikona hodín) otvoríte dialógové okno.

## História pre jednotlivé workflowy vs. všetka história

- **Pre jednotlivé workflowy** (Editor, Docs): Zobrazuje behy pre workflow, ktorý máte otvorený. Pomocou **Clear history** odstránite behy iba pre tento workflow.
- **Všetka história** (Dashboard, Evals): Zobrazuje behy naprieč všetkými workflowmi a reláciami chatu/asistenta. Pokrytie zodpovedá prístupu k workflowom: workflowy, ktoré vlastníte, workflowy zdieľané priamo s vami a workflowy zdieľané s tímom, do ktorého patríte. Pomocou **Clear all history** odstránite všetky záznamy, ktoré vlastníte. História zdieľaných workflowov zostane zachovaná.

## Bring to Canvas

**Bring to Canvas** načíta vstupy a výstupy uzlov vybraného behu do aktuálneho workflowu.

### Čo sa načíta

- **Inputs** → Panel vstupov behu (napr. `text` pre Vstupný uzol alebo vlastné polia)
- **Node results** → Panel výsledkov vykonania zobrazuje minulé výstupy pre jednotlivé uzly
- **Execution result** → Stav, výstupy a časovanie z behu

### Správanie podľa kontextu

- **V Editore** (história pre jednotlivé workflowy): Aplikuje sa okamžite na otvorený workflow a zatvorí dialógové okno.
- **Z Všetkej histórie** (Dashboard/Evals): Prejde do editora workflowu a následne aplikuje údaje pri načítaní editora. Dostupné iba pre behy workflowov – nie pre behy chatu/asistenta.

### Priamy odkaz na spustenie

Otvorenie workflowu na adrese `/workflows/{workflowId}/{executionId}` automaticky prenesie dané spustenie na plátno – rovnako ako výber behu a zvolenie **Bring to Canvas**. Vďaka tomu je možné konkrétny minulý beh zdieľať ako URL. Ak spustenie nemožno nájsť (nesprávne alebo odstránené id), editor sa vráti k načítaniu samotného workflowu.

### Prípady použitia

- Opätovné spustenie workflowu s rovnakými vstupmi
- Ladenie zlyhaného behu kontrolou vstupov a výstupov uzlov
- Porovnanie výstupov naprieč behmi

## Opýtať sa AI

Oba dialógy histórie majú vedľa názvu tlačidlo **Opýtať sa AI** (ikona iskry). Otvorí [kartu Chat](../tabs/chat-tab.md#asking-about-a-run) v novej konverzácii s priloženým workflowom a vybraným spustením ako odnímateľnými čipmi. Opýtajte sa, prečo bol beh pomalý, čo zlyhalo, alebo nechajte Chat workflow opraviť. Chat číta presne toto spustenie, vrátane trasovania a chýb po uzloch.

V dialógu All History sa **Opýtať sa AI** zobrazuje iba pri vybranom spustení workflowu; behy chatu a asistenta ho nezobrazujú.

## Časová os behu

V detaile spustenia tlačidlo **Časová os** (ikona stopiek) vedľa **Rozbaliť všetko** vymení zoznam **Kroky** za časovú os spanov. Keď sa časová os zobrazuje, rovnaké tlačidlo nesie nápis **Protokoly**; kliknutím sa vrátite k zoznamu. V All History sa tlačidlo zobrazuje iba pre behy workflowu. Časová os vykresľuje jeden pruh pre každý uzel v čase jeho spustenia, takže vidíte, ktorý uzel trval ako dlho a ktoré bežali paralelne. Prejdením cez pruh zobrazíte trvanie; kliknutím otvoríte rovnaký inšpektor podrobností ako [časová os spustenia](#execution-timeline-details) v editore. Zvolené zobrazenie zostáva aktívne, kým je dialóg otvorený.

Spustenia zaznamenané skôr, ako sa ukladali časy spustenia uzlov, sú zoradené za sebou podľa trvania.

## Zvýraznenia spustenia

Po živom behu – alebo po **Bring to Canvas** – sa v **pravom hornom rohu plátna** zobrazí odklápateľné okno **Execution Highlights**. Je to rýchly spôsob, ako zistiť, *čo jednotlivé uzly vytvorili*, zoradené zhora nadol v poradí vykonania. Zatvorte ho pomocou **✕**; pri ďalšom behu sa znova otvorí.

### Čo sa zobrazuje

| Záznam | Zdroj | Automaticky? |
|--------|--------|-------|
| **Input** | Vstupné parametre behu (vstupný/trigger uzol) | Áno |
| **Output** | Výsledok výstupného uzla – alebo, ak neexistuje, správa posledného uzla | Áno |
| **Agent / LLM** | Výstup každého agenta alebo LLM uzla | Áno |
| **Output** | Akýkoľvek iný uzol s povolenou možnosťou **Highlight Node Output** | Voliteľne |

Uzly, ktoré sú už automaticky zvýraznené (vstupný / výstupný / posledný / agent / llm), sa nikdy nezobrazia dvakrát, a to ani v prípade, že prepínač povolíte.

### Každý záznam

- Zobrazuje `Node — message…` s prvými **250 znakmi**; kliknutím na riadok ho rozbalíte a vykreslíte **celú správu ako Markdown** s tlačidlom **Copy**.
- Uzol, ktorý sa spustil viackrát (napr. v rámci slučky), zobrazuje `Node (N)` s voličom `‹ i / N ›` – vyberte, ktorý beh chcete zobraziť; volič každého uzla je nezávislý.

### Highlight Node Output

Každý uzol **okrem Agenta a LLM** má vo svojom paneli vlastností zaškrtávacie políčko **Highlight Node Output** (predvolene vypnuté). Povolením pridáte výstup daného uzla do okna. Na plátne sa pri zvýraznených uzloch zobrazí malý odznak ✦. V [workflow DSL](./expression-dsl.md) ide o pole údajov uzla `"highlight": true` (predvolene `false`).

### Na dashboardoch

Karty widgetov na dashboarde, ktoré spustili workflow, zobrazujú v hlavičke karty tlačidlo ✦ **Execution highlights**; kliknutím otvoríte rovnaké okno pre beh daného widgetu, pričom ako výrazný záznam sa zobrazí výstup vykreslený widgetom.
## Spúšťanie spustení

Oba dialógy histórie zobrazujú **aktuálne spúšťané spustenia** v hornej časti zoznamu, pred minulými behmi.

- Zobrazí sa indikátor otáčania a označenie **Spúšťa sa** spolu s časom spustenia
- Kliknutím na **Otvoriť naživo** pripojíte editor k presne tomuto behu bez jeho reštartovania
- Plátno najprv obnoví uzly, ktoré už boli dokončené, a potom prijíma udalosti
  `node_start`, `node_complete` a finálne udalosti spustenia cez SSE
- Aktuálny uzol pulzuje na plátne, nadväzujúce uzly si zachovávajú svoju čakajúcu animáciu a
  panel Debug pridáva každý výsledok hneď, ako dorazí — rovnako ako pri behu spustenom z editora
- Kliknutím na **Zrušiť** okamžite zastavíte spustenie
- Zrušenie z ktoréhokoľvek dialógu (Editor alebo Dashboard) tiež zatvorí aktívny SSE stream v ktorejkoľvek otvorenej karte plátna pre daný workflow, takže sa stav editora čisto resetuje
- Po zrušení záznam spustenia zmizne pri ďalšej aktualizácii; stlačením **Obnoviť** aktualizujete zoznam manuálne
- Ak zrušíte beh, ktorý sa už dokončil, požiadavka nemá žiadny efekt

Spustenia čakajúce na [slot súbehu](./webhooks.md#concurrency-limit-and-queued-runs) sú uvedené v rovnakej sekcii s označením **Queued 2/5**, ich miestom v rade a veľkosťou radu. Nemajú tlačidlo **Open live**, pretože zatiaľ nič nebeží; **Cancel** odstráni čakajúce spustenie z radu a zaznamená ho ako `cancelled`. Spustenie, ktoré čakalo dlhšie ako maximálna doba čakania workflowu, sa zaznamená ako `expired`, a spustenie odmietnuté plným radom ako `queue_full`; obe majú v zozname spustení svoj vlastný odznak.

Živá URL adresa je `/workflows/{workflowId}/{executionId}`. Pozorovateľ je iba na čítanie: opustenie
editora iba odpojí danú kartu prehliadača a nikdy nezastaví workflow. Aktívne snímky
sa zdieľajú cez PostgreSQL, takže otvorenie behu stále funguje, aj keď trigger a požiadavka
editora pristanú na rôznych backendových worker-och.

## Obnova po páde

Ak sa server reštartuje (nasadenie, reštart kontajnera alebo pád) počas behu workflow, worker daného behu sa zastaví uprostred vykonávania. Heym automaticky obnoví tieto prerušené behy namiesto toho, aby ich nechal zaseknuté v stave **Spúšťa sa**.

- Pri ďalšom štarte zvolený líder proces deteguje osirelé behy — okamžite pri elegantnom reštarte alebo do ~60 sekúnd pri tvrdom páde (akonáhle heartbeaty jednoznačne prestanú).
- Obnovené behy sa **spustia odznova s rovnakými vstupmi** (nepokračujú od miesta zastavenia) s použitím aktuálnej definície workflow. Po dokončení zaznamenajú bežný koncový záznam (napr. `success`), takže história zobrazuje beh ako dokončený.
- Beh sa opakuje **raz**. Ak je pokus o obnovu tiež prerušený — alebo bol workflow medzitým odstránený — záznam sa uloží ako `failed`.
- Toto funguje rovnako v rámci jedného kontajnera aj pri nasadeniach s viacerými workermi; obnovu vykonáva iba líder, takže beh nikdy neobnovia dvaja rôzni workeri.

### Prepínač automatickej obnovy

Panel **Execution Log** (beh) v editore má zaškrtávacie pole **Auto-recover**, **predvolene zapnuté** pre každý workflow.

- **Zapnuté**: prerušené behy tohto workflow sa spustia znova, ako je popísané vyššie.
- **Vypnuté**: prerušené behy sa znova nespúšťajú a zaznamenajú sa so stavom `skipped`.

> Beh pod-workflow sa neobnovuje nezávisle — je znovu riadený svojím obnoveným nadradeným behom. Triggery s vlastným opätovným doručením (RabbitMQ, plánované/cron, IMAP) môžu tiež opätovne doručiť pri reštarte, takže obnovený beh sa môže občas vykonať dvakrát.

## Čakajúce na ľudské posúdenie

Behy, ktoré sa pozastavia kvôli schváleniu [Human-in-the-Loop](./human-in-the-loop.md), sa do histórie zapíšu okamžite so stavom `pending`.

- Uzol čakajúceho agenta ukladá payload posúdenia vrátane `reviewUrl`, `draftText` a `expiresAt`
- Akékoľvek uzly pripojené k rukoväti `review` agenta môžu tiež bežať pred odpoveďou človeka a ich výsledky uzlov sa uložia do toho istého záznamu čakajúcej histórie
- Dialógy histórie zobrazujú odkaz na posúdenie, aby ho vlastníci mohli skopírovať alebo otvoriť
- Dialógy histórie a panel Debug v editore zobrazujú konečné rozhodnutie človeka po obnovení behu
- Keď recenzent návrh prijme, upraví alebo odmietne, ten istý záznam histórie sa aktualizuje konečným výsledkom spustenia
- Ak sa ten istý beh pozastaví kvôli HITL viac ako raz, záznam histórie zostáva rovnaký, pričom každý kontrolný bod dostane vlastný jednorazový odkaz na posúdenie

Toto je obzvlášť užitočné pre behy portálu a dlhotrvajúce workflowy, ktoré môžu čakať hodiny alebo dni, kým budú pokračovať.

## Kopírovanie

Použite **Kopírovať** vedľa položky Vstupy alebo Výstupy na skopírovanie JSON do schránky.

## Vymazanie histórie

- **Pre jednotlivý workflow**: V dialógu histórie editora kliknite na **Vymazať históriu** na odstránenie behov aktuálneho workflow.
- **Celá história**: V dialógu histórie Dashboard/Evals kliknite na **Vymazať celú históriu** na odstránenie všetkých záznamov spustení, ktoré vlastníte. Behy zo zdieľaných workflowov sa zachovajú. Túto akciu nie je možné vrátiť späť.

## Podrobnosti časovej osi spustenia

Keď je v editore otvorený **Execution Log**, kliknutím na tlačidlo časovača zobrazíte časovú os spustenia. Vyberte rozpätie na otvorenie vloženého inšpektora podrobností, ktorý prevezme oblasť riadkov. Zobrazuje stav vybraného kroku, trvanie, počet pokusov, informácie o opakovaní, chyby, trace ID a kompaktný náhľad výstupu. Výstupy objektov a polí používajú rovnaký prehliadač `JsonTree` ako zvyšok panela Debug; skalárne hodnoty používajú textový náhľad. Keď krok vytvára obrázky (snímky obrazovky Playwright, generované obrázky, súbory obrázkov alebo obrázky base64 v tele požiadavky nájdené kdekoľvek vo výstupe), zobrazia sa ako miniatúry nad výstupom a JSON zobrazuje krátky zástupný znak namiesto surového base64. Kliknutím na miniatúru ju otvoríte v lightboxe; tlačidlá so šípkami alebo klávesy ←/→ prechádzajú každý obrázok v behu s počítadlom, ako napríklad `2 / 5`. Použite **Otvoriť trace** pre rozpätia LLM a Agent, keď je k dispozícii trace ID.
## Detail uzla na mobile

Na telefóne editor namiesto voľného plátna zobrazuje full-screen strom workflowu. Ťuknutím na uzol stromu so zaznamenaným výsledkom otvoríte jeho spustenie ako full-screen detail. Zobrazenie poskytuje samostatné karty **Vstupné údaje**, **Výstupné údaje** a **Chyby**. Karta výstupu zobrazuje zaznamenaný výsledok a ponúka **Kopírovať výstup**; karta vstupu zobrazuje konfiguráciu vybraného uzla a karta chýb zobrazuje zaznamenanú chybu, ak uzol zlyhal. Na návrat do stromu použite **Späť na workflow** alebo tlačidlo zatvorenia.

Dialógy histórie plátna a dashboardu zachovávajú ovládacie prvky spustenia v jednom riadku a dostupné filtre podľa tagov a inštancií umiestňujú do responzívnej mriežky. Ich ponuky filtrov používajú rovnaký selektor v rámci aplikácie, takže začiarknutie výberu má konzistentný odstup a zarovnanie so všetkými popiskami možností.

## Súvisiace

- [Triggers](./triggers.md) – Ako sa workflowy spúšťajú; história zaznamenáva `trigger_source` (vrátane `board` pre spustenia iniciované presunmi kariet na [Board](../tabs/board-tab.md) a nadväzujúcimi akciami)
- [Human-in-the-Loop](./human-in-the-loop.md) – URL adresy čakajúce na kontrolu a správanie pri obnovení
- [História úprav](./edit-history.md) – Verzionovanie ukladania workflowov (vrátenie, diff)
- [Rýchly štart](../getting-started/quick-start.md) – Vytvorte a spustite svoj prvý workflow
- [Karta Workflows](../tabs/workflows-tab.md) – Vytváranie a správa workflowov
