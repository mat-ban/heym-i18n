# Karta Evals

Karta **Evals** je samostatná stránka na adrese `/evals`. Umožňuje vám vytvárať hodnotiace sady, definovať testovacie prípady a spúšťať hodnotenia voči vašim workflowom [Agent](../nodes/agent-node.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Pozrite si ukážku Evals</a></p>

## Prístup

- Kliknite na **Evals** v lište kariet dashboardu
- Alebo prejdite na `/evals`
- Alebo použite **Ctrl+K** (Cmd+K) a vyberte „Evals" z palety príkazov

## Hodnotiace sady

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
- **Temperature** – Nastavte temperature modelu (`Exact Match` a `Contains`)
- **Reasoning effort** – Nastavte reasoning effort pre reasoning modely (`Exact Match` a `Contains`)

### LLM-as-Judge

S judgeom každý model odpovedá na testovací vstup iba pomocou promptu sady, potom judge ohodnotí, ako tesne sa odpoveď zhoduje s očakávaným výstupom, na škále od 0 do 100:

- **Modelový judge** (OpenAI, OpenAI kompatibilný alebo Gemini) prečíta otázku, očakávaný výstup a odpoveď a vráti skóre s jednoriadkovým odôvodnením. Beží pri temperature `0`, alebo pri `low` reasoning effort pre reasoning model, takže rovnaká odpoveď dostane rovnaký verdikt.
- **Judge typu decision model** ohodnotí odpoveď podľa päťúrovňovej rubriky, od *Úplne mimo* po *Úplne sa zhoduje*. Skóre je pravdepodobnostne vážená pozícia na tejto rubrike, takže pochádza z distribúcie, ktorú model vypočítal, a nie z čísla, ktoré napísal.

Hover karta bunky zobrazuje odôvodnenie judgea, alebo pri decision modeli úroveň, skóre a jeho confidence. Latency a tokeny opisujú testovaný model; vlastné volania judgea sa zobrazujú v [Traces](./traces-tab.md) pod zdrojom **Evals**. Výber modelu vynecháva prihlasovacie údaje Model Router, pretože eval porovnáva konkrétne modely.

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
