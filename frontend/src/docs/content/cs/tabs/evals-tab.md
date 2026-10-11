# Karta Evals

Karta **Evals** je samostatná stránka na adrese `/evals`. Umožňuje vám vytvářet evaluační sady, definovat testovací případy a spouštět evaluace proti vašim workflow [Agent](../nodes/agent-node.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Přehrát demo Evals</a></p>

## Přístup

- Klikněte na **Evals** v liště karet dashboardu
- Nebo přejděte na `/evals`
- Nebo použijte **Ctrl+K** (Cmd+K) a vyberte „Evals" z palety příkazů

## Evaluační sady

- **Vytvořit sadu** – Definujte sadu s názvem a popisem
- **Vybrat workflow** – Zvolte, které workflow chcete evaluovat
- **Vybrat credential** – API klíč pro spuštění workflow
- **Systémový prompt** – Upravte systémový prompt na úrovni sady přímo v levém panelu
- **Optimalizovat prompt** – Požádejte LLM o vylepšení aktuálního systémového promptu

## Testovací případy

- Přidejte testovací případy se vstupními prompty a očekávanými výstupy
- Každý případ může mít vlastní očekávanou hodnotu pro porovnání
- Upravujte nebo mažte případy ze sady
- **Generovat testovací data** – Pomocí vybraného credential/modelu automaticky vytvořte testovací případy z promptu sady

## Spouštění evaluací

- **Vyberte jeden nebo více modelů** – Spusťte stejnou sadu proti více modelům v rámci jedné evaluace
- **Metoda skórování** – Zvolte `Exact Match`, `Contains` nebo `LLM-as-Judge`
- **Judge** – Pro `LLM-as-Judge` volitelně vyberte credential OpenAI, OpenAI kompatibilní (Custom), Gemini (Google) nebo [Decision Model](../nodes/decision-node.md) a zadejte model judge (například `gpt-4o-mini` nebo `jev-latest`) pro skórování nezávislým judge
- **Počet spuštění na test** – Opakujte každý testovací případ vícekrát v rámci jednoho běhu
- **Temperature** – Nastavte temperature modelu (`Exact Match` a `Contains`)
- **Reasoning effort** – Nastavte reasoning effort pro reasoning modely (`Exact Match` a `Contains`)

### LLM-as-Judge

S judge odpovídá každý model na testovací vstup pouze s promptem sady, poté judge ohodnotí, jak těsně odpověď odpovídá očekávanému výstupu, na škále 0 až 100:

- **Modelový judge** (OpenAI, OpenAI kompatibilní nebo Gemini) přečte otázku, očekávaný výstup a odpověď a vrátí skóre s jednořádkovým odůvodněním. Běží při temperature `0`, nebo při `low` reasoning effort pro reasoning model, takže stejná odpověď dostane stejný verdikt.
- **Judge typu decision model** hodnotí odpověď podle pětistupňového rubrika, od *Completely off* po *Fully matches*. Skóre je pravděpodobnostně vážená pozice na tomto rubriku, takže pochází z distribuce, kterou model vypočítal, nikoli z čísla, které napsal.

Hover karta buňky zobrazuje odůvodnění judge, nebo u decision model úroveň, skóre a jeho confidence. Latence a tokeny popisují testovaný model; vlastní volání judge se zobrazují v [Traces](./traces-tab.md) pod zdrojem **Evals**. Výběr modelu vynechává credential Model Router, protože eval porovnává konkrétní modely.

Bez judge každý model odpovídá a skóruje svou vlastní odpověď v jediném požadavku.

Temperature a reasoning effort jsou v tomto režimu skryté a běh používá pevná nastavení: temperature `0.7` pro standardní modely a `medium` reasoning effort pro reasoning modely (`low`, když skórují své vlastní odpovědi).

## Výsledky

- Zobrazte pass/fail pro každý testovací případ
- Prohlédněte si skutečné vs. očekávané výstupy
- Porovnejte výstupy jednotlivých modelů vedle sebe, když běh zahrnuje více modelů
- Prohlédněte si historii běhů minulých evaluací; běh `LLM-as-Judge` zobrazuje svůj judge model v seznamu historie
- Otevírejte historické běhy z panelu výsledků a prohlížejte uložené snapshoty prompt/input/output
- Otevření minulého běhu načte jeho metodu skórování a judge do levého panelu, takže **Re-Run Evals** zopakuje stejnou evaluaci
- **Export** stáhne běh jako JSON včetně `judge_credential_id` a `judge_model`

## Nápady pro benchmark matici

Když sestavujete benchmark matici pro agent workflow, zahrňte HITL scénáře jako prvotřídní případy místo toho, abyste je považovali za okrajové případy.

- Pokryjte všechna tři rozhodnutí review: `accepted`, `edited` a `refused`
- Zahrňte více zdrojů triggerů, jako jsou spuštění z editoru, portál, curl/webhook a spuštění vyvolaná cron
- Přidejte scénáře opakovaného review, kde se jeden běh agenta pozastaví více než jednou
- Ověřte větve notifikací připojené k výstupu `review` agenta
- Ověřte downstream chování po odmítnutí, zejména pokud pozdější uzly větví na `$agent.decision`

## Související

- [Proč Heym](../getting-started/why-heym.md) – Evals jako testovací fáze životního cyklu agenta
- [Uzel Agent](../nodes/agent-node.md) – Workflow, která jsou evaluována
- [Karta Credentials](./credentials-tab.md) – Credentials pro běhy eval
- [Karta Traces](./traces-tab.md) – Podrobné prohlížení trace
- [Karta Workflows](./workflows-tab.md) – Vytvářejte workflow k evaluaci
- [Historie spuštění](../reference/execution-history.md) – Zobrazte minulé běhy (tlačítko History v hlavičce)
- [Kontextový showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkou dostupný na stránce evals
