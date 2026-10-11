# Migrera till Heym

Finns det redan workflows i ett annat verktyg? **AI Convert** omvandlar dem till Heym-workflows. Klistra in en workflow från n8n, Flowise, Dify, Langflow, sim.ai eller Activepieces — eller beskriv bara vad som önskas — och Heym bygger den motsvarande workflowen på en live-canvas som kan laddas ner och importeras.

Öppna den på **[heym.run/convert](https://heym.run/convert)**, eller använd knappen **✨ AI Convert** i sidhuvudet.

## Så fungerar det

1. **Välj källverktyg** (valfritt) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, eller lämna på *Auto*.
2. **Ange workflowen** — klistra in exporterad JSON från det aktuella verktyget, eller skriv en beskrivning på vanlig svenska av den automatisering som önskas.
3. **Generera** — Heym strömmar resultatet till en canvas och ritar noder och anslutningar allt eftersom de skapas.
4. **Ladda ner eller kopiera** den genererade workflowen som JSON.
5. **Importera till Heym** — använd flödet [Download & Import](../reference/download-import.md) för att klistra in JSON på canvasen och kör sedan workflowen.

Konverteringen lägger även till en liten *Sticky Note* på canvasen som markerar att workflowen genererades av Heym — den kan tas bort när som helst.

## Vad som erhålls

Konverteraren mappar källkoncept till inbyggda Heym-noder — triggers, [LLM](../nodes/llm-node.md)-steg, [HTTP](../nodes/http-node.md)-anrop, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md)-åtgärder, [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) och [Output](../nodes/output-node.md). Granska resultatet på canvasen, koppla upp [Credentials](../reference/credentials.md) och justera allt som källverktyget uttryckte annorlunda.

> AI Convert är en startpunkt, inte en garanterad 1:1-portning. Granska alltid den genererade workflowen innan den körs i produktion.

## Bra att veta

- **AI-driven:** konverteringar produceras av en stor språkmodell, så resultaten kan variera mellan körningar. Generera om ifall det första resultatet inte är helt rätt.
- **Indatastorlek:** indata som klistras in eller skrivs är begränsad till ungefär **25 000 tokens**. Trimma mycket stora exporter före konvertering.
- **Hastighetsbegränsningar:** för att hålla verktyget tillgängligt för alla är förfrågningar begränsade till **1 per minut, 5 per timme och 10 per dag** per besökare.
- **Säkerhet:** förfrågningar granskas, och endast förfrågningar som bygger workflows behandlas.

## Nästa steg

- Ny på canvasen? Börja med [Quick Start](./quick-start.md).
- Information om hur import fungerar finns i [Download & Import](../reference/download-import.md).
- Self-hosting av Heym? Se [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) för fullständig konfigurationsreferens.
- Bygg från grunden med den inbyggda [AI Assistant](../reference/ai-assistant.md).
