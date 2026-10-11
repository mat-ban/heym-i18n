# Migreren naar Heym

Heeft u al workflows in een andere tool? **AI Convert** zet deze voor u om naar Heym-workflows. Plak een workflow uit n8n, Flowise, Dify, Langflow, sim.ai of Activepieces — of beschrijf eenvoudig wat u wilt — en Heym bouwt de equivalente workflow op een live canvas dat u kunt downloaden en importeren.

Open het op **[heym.run/convert](https://heym.run/convert)** of gebruik de knop **✨ AI Convert** in de siteheader.

## Hoe het werkt

1. **Kies uw brontool** (optioneel) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, of laat deze op *Auto* staan.
2. **Lever uw workflow aan** — plak de geëxporteerde JSON uit uw huidige tool, of schrijf een beschrijving in gewoon Nederlands van de automatisering die u wenst.
3. **Genereren** — Heym streamt het resultaat naar een canvas en tekent knooppunten en verbindingen terwijl deze worden geproduceerd.
4. **Download of kopieer** de gegenereerde workflow als JSON.
5. **Importeer in Heym** — gebruik de [Download & Import](../reference/download-import.md)-flow om de JSON op uw canvas te plakken en voer deze vervolgens uit.

De conversie voegt ook een kleine *Sticky Note* toe op het canvas die de workflow markeert als gegenereerd door Heym — verwijder deze wanneer u wilt.

## Wat u krijgt

De converter vertaalt bronconcepten naar native Heym-knooppunten — triggers, [LLM](../nodes/llm-node.md)-stappen, [HTTP](../nodes/http-node.md)-aanroepen, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md)-acties, [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) en [Output](../nodes/output-node.md). Controleer het resultaat op het canvas, koppel uw [Credentials](../reference/credentials.md) en pas alles aan wat de brontool anders heeft uitgedrukt.

> AI Convert is een startpunt, geen gegarandeerde 1:1-port. Controleer de gegenereerde workflow altijd voordat u deze in productie uitvoert.

## Goed om te weten

- **AI-aangedreven:** conversies worden geproduceerd door een large language model, dus resultaten kunnen variëren tussen runs. Genereer opnieuw als het eerste resultaat niet helemaal klopt.
- **Invoergrootte:** de invoer die u plakt of typt is beperkt tot ongeveer **25.000 tokens**. Trim zeer grote exports voordat u converteert.
- **Snelheidslimieten:** om de tool voor iedereen beschikbaar te houden, zijn verzoeken beperkt tot **1 per minuut, 5 per uur en 10 per dag** per bezoeker.
- **Veiligheid:** verzoeken worden gescreend en alleen verzoeken voor het bouwen van workflows worden verwerkt.

## Volgende stappen

- Nieuw op het canvas? Begin met de [Quick Start](./quick-start.md).
- Leer hoe importeren werkt in [Download & Import](../reference/download-import.md).
- Heym self-hosten? Zie [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) voor de volledige configuratiereferentie.
- Bouw vanaf nul met de ingebouwde [AI Assistant](../reference/ai-assistant.md).
