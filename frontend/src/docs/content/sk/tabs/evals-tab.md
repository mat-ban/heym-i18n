# Karta Evals

Karta **Evals** je samostatná stránka na adrese `/evals`. Umožňuje vám vytvárať hodnotiace sady, definovať testovacie prípady a spúšťať hodnotenia voči vašim workflowom [Agent](../nodes/agent-node.md). [Sada agenta](#agent-suites) spúšťa agenta alebo číta jeho reálne behy a kontroluje volané nástroje, latenciu, náklady v USD, tokeny a počet volaní nástrojov.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Pozrite si ukážku Evals</a></p>

## Prístup

- Kliknite na **Evals** v lište kariet dashboardu
- Alebo prejdite na `/evals`
- Alebo použite **Ctrl+K** (Cmd+K) a vyberte „Evals" z palety príkazov

## Hodnotiace sady

- **Nová sada** – Zvoľte **Sada promptov** na testovanie systémového promptu naprieč modelmi, alebo **Sada agenta** na kontrolu reálnych behov agenta (pozri [Sady agenta](#agent-suites))
- **Výber sady** – Zobrazuje sady promptov a agentov spolu s typom vedľa každého názvu; písaním vyhľadávajte
- **Vytvoriť sadu** – Definujte sadu s názvom a popisom
- **Vybrať workflow** – Zvoľte, ktorý workflow sa má hodnotiť
- **Vybrať prihlasovacie údaje** – API kľúč na spustenie workflowu
- **Systémový prompt** – Upravte systémový prompt na úrovni sady priamo v ľavom paneli
- **Optimalizovať prompt** – Požiadajte LLM o vylepšenie aktuálneho systémového promptu

## Testovacie prípady

- Pridajte testovacie prípady so vstupnými promptami a očakávanými výstupmi
- Každý prípad môže mať vlastnú očakávanú hodnotu na porovnanie
- Upravujte alebo odstraňujte prípady zo sady
- **Generovať testovacie dáta** – Pomocou vybraných prihlasovacích údajov/modelu automaticky vytvorte testovacie prípady z promptu sady

## Spúšťanie hodnotení

- **Vyberte jeden alebo viac modelov** – Spustite rovnakú sadu voči viacerým modelom v rámci jedného hodnotenia
- **Metóda skórovania** – Zvoľte `Exact Match`, `Contains` alebo `LLM-as-Judge`
- **Judge** – Pre `LLM-as-Judge` voliteľne vyberte prihlasovacie údaje OpenAI, OpenAI kompatibilné (Custom), Gemini (Google) alebo [Decision Model](../nodes/decision-node.md) a zadajte model judgea (napríklad `gpt-4o-mini` alebo `jev-latest`) na skórovanie nezávislým judgeom
- **Počet spustení na test** – Zopakujte každý testovací prípad viackrát v rámci jedného spustenia
- **Zapamätané nastavenia** – Sada sa otvára s nastaveniami svojho najnovšieho behu: poverenie, modely, metóda hodnotenia a hodnotiteľ, teplota, úsilie pri uvažovaní a počet behov na test. Otvorenie staršieho behu načíta jeho nastavenia, takže **Znova spustiť evaluácie** zopakuje rovnaký test
- **Temperature** – Nastavte temperature modelu (`Exact Match` a `Contains`)
- **Úsilie pri uvažovaní** – Nastavte úsilie pri uvažovaní pre uvažujúce modely, od Nízke po Veľmi vysoké a Max rovnako ako pri uzloch LLM a Agent (`Exact Match` a `Contains`)

### LLM-as-Judge

S judgeom každý model odpovedá na testovací vstup iba pomocou promptu sady, potom judge ohodnotí, ako tesne sa odpoveď zhoduje s očakávaným výstupom, na škále od 0 do 100:

- **Modelový judge** (OpenAI, OpenAI kompatibilný alebo Gemini) prečíta otázku, očakávaný výstup a odpoveď a vráti skóre s jednoriadkovým odôvodnením. Beží pri temperature `0`, alebo pri `low` reasoning effort pre reasoning model, takže rovnaká odpoveď dostane rovnaký verdikt.
- **Judge typu decision model** ohodnotí odpoveď podľa päťúrovňovej rubriky, od *Úplne mimo* po *Úplne sa zhoduje*. Skóre je pravdepodobnostne vážená pozícia na tejto rubrike, takže pochádza z distribúcie, ktorú model vypočítal, a nie z čísla, ktoré napísal.

Karta pri prejdení myšou na bunku zobrazuje odôvodnenie hodnotiteľa alebo pri rozhodovacom modeli úroveň, skóre a spoľahlivosť. Latencia a tokeny opisujú testovaný model; vlastné volania hodnotiteľa sa zobrazujú v [Trasách](./traces-tab.md) pod zdrojom **Evaluácie**. Výber hodnotiteľa vynecháva poverenia Model Router, pretože hodnotiteľ musí byť jeden pevný model. Poverením pre testované modely môže byť [Model Router](../reference/credentials.md#model-router-auto-model): jeho model **Auto** vyberá model pre každú požiadavku, rovnako ako vo workflow.

Bez judgea každý model odpovedá a skóruje svoju vlastnú odpoveď v rámci jednej požiadavky.

Temperature a reasoning effort sú v tomto režime skryté a spustenie používa pevné nastavenia: temperature `0.7` pre štandardné modely a `medium` reasoning effort pre reasoning modely (`low`, keď skórujú svoje vlastné odpovede).

## Výsledky

- Zobrazte pass/fail pre každý testovací prípad
- Skontrolujte skutočné vs. očakávané výstupy
- Porovnajte výstupy jednotlivých modelov vedľa seba, keď spustenie zahŕňa viacero modelov
- Prezrite si históriu spustení minulých hodnotení; spustenie `LLM-as-Judge` zobrazuje svoj model judgea v zozname histórie
- Otvorte historické spustenia z panela výsledkov a skontrolujte uložené snapshoty promptu/vstupu/výstupu
- Otvorenie minulého spustenia načíta jeho metódu skórovania a judgea do ľavého panela, takže **Re-Run Evals** zopakuje rovnaké hodnotenie
- **Export** stiahne spustenie ako JSON vrátane `judge_credential_id` a `judge_model`

## Agent Suites

Sada agenta overuje uzol [Agent](../nodes/agent-node.md) na základe jeho behov. Načítava ich z [Trás](./traces-tab.md), kde každý beh už zaznamenáva svoj čas, tokeny, náklady a volania nástrojov, a môže tiež spustiť workflow za vás.

Vytvorte ju cez **Nová sada** → **Sada agenta** a postupujte v troch krokoch:

1. **Agent** – Vyberte workflow a potom jeho uzol agenta. Uvedené sú len workflow s uzlom agenta; workflow alebo agent, ktorý ešte nebežal, sa zobrazí, ale nemožno ho vybrať. Nastavenia vybraného agenta (model, inštrukcie, nástroje a limity) sa zobrazujú vpravo a nižšie sa zobrazí plátno workflow iba na čítanie so zvýrazneným agentom.
2. **Baseline** – Posledných 10 behov agenta: latencia p50 a p95, náklady na beh, tokeny na beh a volania nástrojov na beh, ktoré nástroje volal a ako často, a vlastné čísla každého behu. Behy ukončené chybou sú uvedené, ale z baseline sú vynechané.
3. **Kontroly** – Označte každý nástroj ako **Must call**, **Must not call** alebo **Either**. Každý druh volania je uvedený so svojím typom: nástroje Pythonu a uzlov, nástroje **MCP** s ich serverom, **sub-agenti** podľa štítka, **dielčie workflow** podľa názvu a **skills**. Pridajte nástroj podľa druhu a názvu, ak ešte nebežal, a odstráňte ho pomocou krížika **X**. Nastavte horné limity pre latenciu, náklady, celkové tokeny a volania nástrojov; každý začína 20 % nad p95 baseline a možno ho vypnúť.

Uložená sada sa otvára na karte **Výsledky**, vedľa ktorej sú karty **Baseline** a **Upraviť kontroly**:

- **Spustiť workflow** – Zvoľte počet behov (až 20); štyri bežia súčasne. Vstupy sa predvyplnia z najnovšieho behu workflow a dajú sa upraviť, pričom ich použije každý beh. Zapnite **Generovať vstupy** (ikona iskry) a potom vyberte poverenie a model, aby model pripravil pre každý beh iný vstup. Číta systémové inštrukcie agenta a drží sa blízko zadaných hodnôt: zadanie názvu mesta vygeneruje iné názvy miest. Každý beh vykoná celé workflow ako akýkoľvek iný beh a je zapísaný v Histórii spustení s triggerom `agent_suite`. Ak chcete preskočiť neskoršie kroky, napríklad odoslanie e-mailu, otvorte workflow cez **Prejsť do workflow** v paneli a tieto uzly najprv deaktivujte. **Zastaviť** ukončí beh sady: žiadne nové behy sa nespustia a prebiehajúce sa zrušia. Beh sady, ktorého server sa zastavil, napríklad počas reštartu, sa po minúte zobrazí ako prerušený namiesto toho, aby zostal zablokovaný.
- **Výsledky** – V predvolenom nastavení sa hodnotí najnovší beh sady. Každý beh sady sa uchováva s dátumom vo výbere behov, kde ho môžete otvoriť alebo zmazať; prípadne prepnite na posledných 10, 20 alebo 50 behov agenta a zahrňte aj jeho ďalšie behy. Uvidíte mieru úspešnosti, ako často jednotlivé kontroly prešli, latenciu, náklady, tokeny a volania nástrojov vedľa uloženej baseline, a tiež každý beh s dôvodom zlyhania a odkazom na jeho trasu.
- **Prejsť do workflow** otvorí workflow agenta na novej karte. V poli názvu kláves **Esc** alebo krížik **X** vymaže text.

Ako sa čísla interpretujú:

- **Latencia** je čas modelu plus doba volaní nástrojov daného behu.
- **Náklady** využívajú rovnaké ceny ako Traces. Beh modelu bez nastavenej ceny kontrolu nákladov preskočí namiesto toho, aby zlyhal.
- Beh **uspeje**, ak sa skončil bez chyby a prešli všetky kontroly.
- Sada číta iba vaše vlastné trasy, podľa rovnakého pravidla ako karta Traces.
- **Použiť najnovšie behy ako baseline** v **Upraviť kontroly** nahradí uloženú baseline najnovšími behmi agenta.

Baseline sady pochádza z jedného z troch zdrojov. **Upraviť kontroly** ukazuje aktívny zdroj vedľa **Uložená baseline**:

- najnovšie behy agenta (predvolený stav a hodnota, ktorú preberá **Použiť najnovšie behy ako baseline**),
- jeden dokončený beh sady,
- ručne zadané čísla.

Posledné dve možnosti sa nastavujú z [Chatu](./chat-tab.md#working-with-evals) alebo cez API:

- `PATCH /api/evals/agent-suites/{id}` prijíma `baseline: {"source": "suite_run", "run_id": "…"}` alebo `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` prijíma `inputs_list`: jeden vstupný objekt na beh, až 20.

### Z Chatu a MCP

[Chat](./chat-tab.md#working-with-evals) a MCP nástroj `heym_chat` môžu vytvárať, upravovať a spúšťať sady promptov aj agentov:

- Samy formulujú testovacie prípady a vstupy pre behy.
- Pred vytvorením sady promptov sa spýtajú na poverenie, pokiaľ nevyhovuje práve jedno.
- Odkazujú na každú sadu, ktorú na tejto stránke spomenú.

## Nápady na benchmarkovú maticu

Keď zostavujete benchmarkovú maticu pre workflowy agentov, zahrňte HITL scenáre ako prvoradé prípady namiesto toho, aby ste ich považovali za okrajové prípady.

- Pokryte všetky tri rozhodnutia kontroly: `accepted`, `edited` a `refused`
- Zahrňte viacero zdrojov triggerov, ako sú spustenia z editora, portál, curl/webhook a spustenia spúšťané cez cron
- Pridajte scenáre opakovaných kontrol, kde sa jedno spustenie agenta pozastaví viackrát
- Overte vetvy notifikácií pripojené k výstupu `review` agenta
- Overte downstream správanie po odmietnutí, najmä ak neskoršie uzly vetvia na `$agent.decision`

## Súvisiace

- [Prečo Heym](../getting-started/why-heym.md) – Evals ako testovacia fáza životného cyklu agenta
- [Uzol Agent](../nodes/agent-node.md) – Workflowy, ktoré sa hodnotia
- [Karta Prihlasovacie údaje](./credentials-tab.md) – Prihlasovacie údaje pre spustenia evalov
- [Karta Traces](./traces-tab.md) – Podrobná kontrola traceov
- [Karta Workflows](./workflows-tab.md) – Vytvárajte workflowy na hodnotenie
- [História spustení](../reference/execution-history.md) – Zobrazte minulé spustenia (tlačidlo History v hlavičke)
- [Kontextová ukážka](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkou dostupný na stránke evals
