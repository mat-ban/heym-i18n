# Quick Start

Laat uw eerste Heym-workflow binnen enkele minuten draaien.

Draait Heym nog niet? Zie [Running & Deployment](./running-and-deployment.md), of volg de videowalkthrough: [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Een workflow aanmaken

1. Ga naar het tabblad [Workflows](../tabs/workflows-tab.md)
2. Klik op **New Workflow**
3. Geef uw workflow een naam (bijv. "Hello World")

## 2. Knooppunten toevoegen

1. Open het paneel **Nodes** aan de linkerkant
2. Sleep een [Input](../nodes/input-node.md)-knooppunt naar het canvas
3. Sleep een [LLM](../nodes/llm-node.md)-knooppunt en verbind het met de Input
4. Sleep een [Output](../nodes/output-node.md)-knooppunt en verbind het met de LLM

```
[Input] --> [LLM] --> [Output]
```

Zie [Node Types](../reference/node-types.md) voor alle beschikbare knooppunten.

## 3. Configureren

- **Input**: Stel een standaardwaarde in of laat leeg voor gebruikersinvoer (zie [Input Node](../nodes/input-node.md))
- **LLM**: Selecteer een [credential](../tabs/credentials-tab.md) en model, voeg een systeeminstructie toe en stel `userMessage` in op `$input.text` (zie [LLM Node](../nodes/llm-node.md))
- **Output**: Stel `message` in op `$llm.text` om het LLM-antwoord door te geven (zie [Output Node](../nodes/output-node.md))

Gebruik de [Expression DSL](../reference/expression-dsl.md)-syntaxis voor `$input.text` en `$llm.text`. Klik op de uitklapknop bij expressievelden voor de [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) met live backend-preview.

## 4. Uitvoeren

Klik op **Run**, druk op `Ctrl + Enter`, of gebruik het debug-paneel om uit te voeren. De workflow loopt van het Input-knooppunt via verbonden knooppunten naar de Output. Zie [Triggers](../reference/triggers.md) voor andere manieren om workflows uit te voeren ([webhook](../reference/webhooks.md), portal, cron, enz.).

Bekijk eerdere uitvoeringen in **History** (werkbalk) en gebruik **Bring to Canvas** om opnieuw uit te voeren met dezelfde inputs.

Op Docs, Evals en andere interne pagina's zonder canvas kunt u ook de [Quick Drawer](../reference/quick-drawer.md) gebruiken om een vastgezet workflow te kiezen en uit te voeren zonder terug te gaan naar de editor.

Als u de documentatie leest en verduidelijking wilt voordat u gaat bouwen, opent u [Chat with Heym](../reference/chat-with-heym.md) vanuit de Docs-header om paginabewuste vragen te stellen.

Als alternatief kunt u de [AI Assistant](../reference/ai-assistant.md) vanuit het Debug-paneel gebruiken om workflows met natuurlijke taal te maken—beschrijf wat u wilt en de AI genereert knooppunten en verbindingen.

Bouwt u al automatiseringen in een ander hulpmiddel? [Migrate to Heym](./migrate-to-heym.md) converteert een n8n-, Flowise-, Dify-, Langflow-, sim.ai- of Activepieces-workflow naar een Heym-workflow die u kunt importeren.

## Gerelateerd

- [Core Concepts](./core-concepts.md) – Workflows, knooppunten en uitvoeringsstroom
- [Migrate to Heym](./migrate-to-heym.md) – Converteer n8n-, Flowise-, Dify-, Langflow-, sim.ai- of Activepieces-workflows naar Heym met AI
- [Running & Deployment](./running-and-deployment.md) – Start lokaal met `run.sh` of implementeer met `deploy.sh`
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Volledige configuratiereferentie
- [Settings](../reference/user-settings.md) – Configureer naam, User Rules en wachtwoord
- [Canvas Features](../reference/canvas-features.md) – Data pin, uitvoeringslogboeken, in-/uitschakelen, extraheren naar sub-workflow
- [Keyboard Shortcuts](../reference/keyboard-shortcuts.md) – Sneltoetsen voor canvas en editor
- [Expression DSL](../reference/expression-dsl.md) – Verwijzen naar gegevens in knooppuntconfiguratie
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Uitklapbare editor met live backend-preview
- [Triggers](../reference/triggers.md) – Alle workflow-entrypoints ([webhook](../reference/webhooks.md), portal, cron, enz.)
- [Execution History](../reference/execution-history.md) – Bekijk eerdere uitvoeringen en Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Voer vastgezette workflows uit vanaf pagina's zonder canvas
- [Chat with Heym](../reference/chat-with-heym.md) – Stel contextuele vragen vanuit de docs-header
- [Workflows Tab](../tabs/workflows-tab.md) – Workflows aanmaken en beheren
- [Credentials Tab](../tabs/credentials-tab.md) – API-sleutels toevoegen voor LLM-knooppunten
- [AI Assistant](../reference/ai-assistant.md) – Workflows maken met natuurlijke taal
