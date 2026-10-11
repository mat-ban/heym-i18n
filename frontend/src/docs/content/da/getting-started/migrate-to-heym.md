# Migrering til Heym

Findes der allerede workflows i et andet værktøj? **AI Convert** omdanner dem til Heym-workflows. Indsæt en workflow fra n8n, Flowise, Dify, Langflow, sim.ai eller Activepieces — eller beskriv blot det ønskede — og Heym opbygger den tilsvarende workflow på et live canvas, som kan downloades og importeres.

Åbn det på **[heym.run/convert](https://heym.run/convert)**, eller brug knappen **✨ AI Convert** i sidens header.

## Sådan fungerer det

1. **Vælg kildeværktøj** (valgfrit) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, eller lad den stå på *Auto*.
2. **Angiv workflowen** — indsæt det eksporterede JSON fra det aktuelle værktøj, eller skriv en beskrivelse på almindeligt sprog af den ønskede automatisering.
3. **Generér** — Heym streamer resultatet onto et canvas og tegner noder og forbindelser, efterhånden som de produceres.
4. **Download eller kopiér** den genererede workflow som JSON.
5. **Importér til Heym** — brug flowet [Download & Import](../reference/download-import.md) til at indsætte JSON'en på canvas'et og derefter køre den.

Konverteringen tilføjer også en lille *Sticky Note* på canvas'et, der markerer workflowen som genereret af Heym — den kan slettes når som helst.

## Det opnås

Konverteringsværktøjet mapper kildebegreber over på native Heym-noder — triggers, [LLM](../nodes/llm-node.md)-trin, [HTTP](../nodes/http-node.md)-kald, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md)-handlinger, [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) og [Output](../nodes/output-node.md). Gennemgå resultatet på canvas'et, opsæt [Credentials](../reference/credentials.md), og justér alt, som kildeværktøjet har udtrykt anderledes.

> AI Convert er et udgangspunkt, ikke en garanteret 1:1-port. Gennemgå altid den genererede workflow, før den køres i produktion.

## Godt at vide

- **AI-drevet:** konverteringer produceres af en stor sprogmodel, så resultaterne kan variere mellem kørsler. Generér igen, hvis det første resultat ikke er helt rigtigt.
- **Inputstørrelse:** det indsatte eller indtastede input er begrænset til cirka **25.000 tokens**. Beskær meget store eksporter før konvertering.
- **Rate limits:** for at holde værktøjet tilgængeligt for alle er forespørgsler begrænset til **1 pr. minut, 5 pr. time og 10 pr. dag** pr. besøgende.
- **Sikkerhed:** forespørgsler screenes, og kun forespørgsler om opbygning af workflows behandles.

## Næste skridt

- Ny på canvas'et? Start med [Quick Start](./quick-start.md).
- Lær hvordan import fungerer i [Download & Import](../reference/download-import.md).
- Self-hosting af Heym? Se [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) for den fulde konfigurationsreference.
- Byg fra bunden med den indbyggede [AI Assistant](../reference/ai-assistant.md).
