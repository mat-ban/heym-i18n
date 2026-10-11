# Rychlý start

Zprovozněte svůj první Heym workflow během několika minut.

Ještě nemáte Heym spuštěný? Podívejte se na [Spuštění a nasazení](./running-and-deployment.md) nebo si projděte video návod: [Nastavte Heym lokálně za méně než 2 minuty](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Vytvořte workflow

1. Přejděte na kartu [Workflows](../tabs/workflows-tab.md)
2. Klikněte na **New Workflow**
3. Pojmenujte svůj workflow (např. „Hello World")

## 2. Přidejte uzly

1. Otevřete panel **Nodes** vlevo
2. Přetáhněte uzel [Input](../nodes/input-node.md) na plátno
3. Přetáhněte uzel [LLM](../nodes/llm-node.md) a propojte jej s uzlem Input
4. Přetáhněte uzel [Output](../nodes/output-node.md) a propojte jej s uzlem LLM

```
[Input] --> [LLM] --> [Output]
```

Všechny dostupné uzly naleznete v části [Typy uzlů](../reference/node-types.md).

## 3. Nakonfigurujte

- **Input**: Nastavte výchozí hodnotu, nebo ponechte prázdné pro vstup od uživatele (viz [Uzel Input](../nodes/input-node.md))
- **LLM**: Vyberte [credential](../tabs/credentials-tab.md) a model, přidejte systémovou instrukci a nastavte `userMessage` na `$input.text` (viz [Uzel LLM](../nodes/llm-node.md))
- **Output**: Nastavte `message` na `$llm.text` pro předání odpovědi z LLM (viz [Uzel Output](../nodes/output-node.md))

Pro `$input.text` a `$llm.text` použijte syntaxi [Expression DSL](../reference/expression-dsl.md). Kliknutím na tlačítko rozbalení u polí s výrazy otevřete [Dialog vyhodnocení výrazů](../reference/expression-evaluation-dialog.md) s živým náhledem backendu.

## 4. Spusťte

Klikněte na **Run**, stiskněte `Ctrl + Enter` nebo použijte debug panel ke spuštění. Workflow se spouští od uzlu Input přes propojené uzly až k uzlu Output. Další způsoby spouštění workflow ([webhook](../reference/webhooks.md), portál, cron atd.) naleznete v části [Triggers](../reference/triggers.md).

Minulá spuštění si prohlédnete v **History** (panel nástrojů) a pomocí **Bring to Canvas** je můžete znovu spustit se stejnými vstupy.

Na stránkách Docs, Evals a dalších interních stránkách mimo plátno můžete také použít [Quick Drawer](../reference/quick-drawer.md) k výběru připnutého workflow a jeho spuštění, aniž byste se museli vracet do editoru.

Pokud čtete dokumentaci a chcete si před tvorbou vyjasnit nejasnosti, otevřete [Chat with Heym](../reference/chat-with-heym.md) v záhlaví dokumentace a pokládejte otázky týkající se aktuální stránky.

Případně použijte [AI Assistant](../reference/ai-assistant.md) z debug panelu k vytváření workflow přirozeným jazykem – popište, co chcete, a AI vygeneruje uzly a propojení.

Už vytváříte automatizace v jiném nástroji? [Migrace do Heym](./migrate-to-heym.md) převede workflow z n8n, Flowise, Dify, Langflow, sim.ai nebo Activepieces na workflow Heym, který můžete importovat.

## Související

- [Základní koncepty](./core-concepts.md) – Workflow, uzly a průběh spouštění
- [Migrace do Heym](./migrate-to-heym.md) – Převeďte workflow z n8n, Flowise, Dify, Langflow, sim.ai nebo Activepieces do Heym pomocí AI
- [Spuštění a nasazení](./running-and-deployment.md) – Spusťte lokálně pomocí `run.sh` nebo nasaďte pomocí `deploy.sh`
- [Proměnné prostředí](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Kompletní přehled konfigurace
- [Nastavení](../reference/user-settings.md) – Konfigurace jména, User Rules a hesla
- [Funkce plátna](../reference/canvas-features.md) – Data pin, protokoly spuštění, povolení/zakázání, extrakce do pod-workflow
- [Klávesové zkratky](../reference/keyboard-shortcuts.md) – Zkratky plátna a editoru
- [Expression DSL](../reference/expression-dsl.md) – Odkazování na data v konfiguraci uzlu
- [Dialog vyhodnocení výrazů](../reference/expression-evaluation-dialog.md) – Rozšiřitelný editor s živým náhledem backendu
- [Triggers](../reference/triggers.md) – Všechny vstupní body workflow ([webhook](../reference/webhooks.md), portál, cron atd.)
- [Historie spuštění](../reference/execution-history.md) – Zobrazení minulých spuštění a Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Spouštění připnutých workflow ze stránek mimo plátno
- [Chat with Heym](../reference/chat-with-heym.md) – Pokládejte kontextové otázky ze záhlaví dokumentace
- [Karta Workflows](../tabs/workflows-tab.md) – Vytváření a správa workflow
- [Karta Credentials](../tabs/credentials-tab.md) – Přidání API klíčů pro uzly LLM
- [AI Assistant](../reference/ai-assistant.md) – Vytváření workflow přirozeným jazykem
