# Rýchly štart

Uveďte svoj prvý Heym workflow do prevádzky za pár minút.

Ešte nemáte spustený Heym? Pozrite si [Spustenie a nasadenie](./running-and-deployment.md) alebo postupujte podľa video návodu: [Nastavte Heym lokálne za menej ako 2 minúty](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Vytvorte Workflow

1. Prejdite na kartu [Workflows](../tabs/workflows-tab.md)
2. Kliknite na **New Workflow**
3. Pomenujte svoj workflow (napr. „Hello World")

## 2. Pridajte uzly

1. Otvorte panel **Nodes** na ľavej strane
2. Presuňte uzol [Input](../nodes/input-node.md) na plátno
3. Presuňte uzol [LLM](../nodes/llm-node.md) a prepojte ho s uzlom Input
4. Presuňte uzol [Output](../nodes/output-node.md) a prepojte ho s uzlom LLM

```
[Input] --> [LLM] --> [Output]
```

Všetky dostupné uzly nájdete v časti [Typy uzlov](../reference/node-types.md).

## 3. Konfigurácia

- **Input**: Nastavte predvolenú hodnotu alebo ponechajte prázdne pre vstup od používateľa (pozrite [Uzol Input](../nodes/input-node.md))
- **LLM**: Vyberte [credential](../tabs/credentials-tab.md) a model, pridajte systémovú inštrukciu a nastavte `userMessage` na `$input.text` (pozrite [Uzol LLM](../nodes/llm-node.md))
- **Output**: Nastavte `message` na `$llm.text` na prenos odpovede z LLM (pozrite [Uzol Output](../nodes/output-node.md))

Pre `$input.text` a `$llm.text` použite syntax [Expression DSL](../reference/expression-dsl.md). Kliknutím na tlačidlo rozbalenia pri poliach výrazov otvoríte [Dialóg vyhodnotenia výrazu](../reference/expression-evaluation-dialog.md) s živým náhľadom backendu.

## 4. Spustenie

Kliknite na **Run**, stlačte `Ctrl + Enter` alebo použite debug panel na spustenie. Workflow sa spustí z uzla Input cez prepojené uzly až po uzol Output. Ďalšie spôsoby spustenia workflow (napr. [webhook](../reference/webhooks.md), portál, cron) nájdete v časti [Triggers](../reference/triggers.md).

Predchádzajúce spustenia si pozrite v **History** (panel s nástrojmi) a pomocou **Bring to Canvas** ich môžete spustiť znova s rovnakými vstupmi.

Na stránkach Docs, Evals a ďalších interných stránkach mimo plátna môžete tiež použiť [Quick Drawer](../reference/quick-drawer.md) na výber pripnutého workflow a jeho spustenie bez návratu do editora.

Ak čítate dokumentáciu a chcete si pred vytváraním vyjasniť nejasnosti, otvorte [Chat with Heym](../reference/chat-with-heym.md) v hlavičke stránky Docs a položte otázky súvisiace s danou stránkou.

Prípadne použite [AI Assistant](../reference/ai-assistant.md) z debug panela na vytváranie workflow pomocou prirodzeného jazyka – opíšte, čo chcete, a AI vygeneruje uzly a prepojenia.

Už vytvárate automatizácie v inom nástroji? [Migrácia do Heym](./migrate-to-heym.md) skonvertuje workflow z n8n, Flowise, Dify, Langflow, sim.ai alebo Activepieces na Heym workflow, ktorý môžete importovať.

## Súvisiace

- [Kľúčové koncepty](./core-concepts.md) – Workflows, uzly a tok vykonávania
- [Migrácia do Heym](./migrate-to-heym.md) – Skonvertujte workflow z n8n, Flowise, Dify, Langflow, sim.ai alebo Activepieces do Heym pomocou AI
- [Spustenie a nasadenie](./running-and-deployment.md) – Spustite lokálne pomocou `run.sh` alebo nasaďte pomocou `deploy.sh`
- [Premenné prostredia](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Kompletná referencia konfigurácie
- [Nastavenia](../reference/user-settings.md) – Konfigurácia mena, User Rules a hesla
- [Funkcie plátna](../reference/canvas-features.md) – Data pin, logy vykonávania, zapnutie/vypnutie, extrahovanie do pod-workflow
- [Klávesové skratky](../reference/keyboard-shortcuts.md) – Skratky plátna a editora
- [Expression DSL](../reference/expression-dsl.md) – Odkazovanie na dáta v konfigurácii uzla
- [Dialóg vyhodnotenia výrazu](../reference/expression-evaluation-dialog.md) – Rozbaliteľný editor so živým náhľadom backendu
- [Triggers](../reference/triggers.md) – Všetky vstupné body workflow ([webhook](../reference/webhooks.md), portál, cron atď.)
- [História vykonávania](../reference/execution-history.md) – Zobrazenie predchádzajúcich spustení a Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Spúšťanie pripnutých workflow zo stránok mimo plátna
- [Chat with Heym](../reference/chat-with-heym.md) – Kladenie kontextových otázok z hlavičky dokumentácie
- [Karta Workflows](../tabs/workflows-tab.md) – Vytváranie a správa workflow
- [Karta Credentials](../tabs/credentials-tab.md) – Pridávanie API kľúčov pre uzly LLM
- [AI Assistant](../reference/ai-assistant.md) – Vytváranie workflow pomocou prirodzeného jazyka
