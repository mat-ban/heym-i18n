# Migrácia do Heym

Máte už workflows v inom nástroji? **AI Convert** ich pre vás premení na Heym workflows. Vložte workflow z n8n, Flowise, Dify, Langflow, sim.ai alebo Activepieces — alebo jednoducho opíšte, čo chcete — a Heym vytvorí ekvivalentný workflow na živom plátne, ktorý si môžete stiahnuť a importovať.

Otvorte ho na **[heym.run/convert](https://heym.run/convert)** alebo použite tlačidlo **✨ AI Convert** v hlavičke stránky.

## Ako to funguje

1. **Vyberte zdrojový nástroj** (voliteľné) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces alebo ponechajte *Auto*.
2. **Poskytnite svoj workflow** — vložte exportovaný JSON z vášho aktuálneho nástroja alebo napíšte opis automatizácie, ktorú chcete, v prirodzenom jazyku.
3. **Vygenerujte** — Heym streamuje výsledok na plátno a vykresľuje uzly a prepojenia tak, ako vznikajú.
4. **Stiahnite alebo skopírujte** vygenerovaný workflow ako JSON.
5. **Importujte do Heym** — použite postup [Download & Import](../reference/download-import.md) na vloženie JSON na vaše plátno a následné spustenie.

Konverzia tiež pridá na plátno malú *Sticky Note* označujúcu workflow ako vygenerovaný nástrojom Heym — môžete ju kedykoľvek vymazať.

## Čo získate

Konvertor mapuje koncepty zdrojového nástroja na natívne Heym uzly — triggery, kroky [LLM](../nodes/llm-node.md), volania [HTTP](../nodes/http-node.md), akcie [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) a [Output](../nodes/output-node.md). Skontrolujte výsledok na plátne, prepojte svoje [Credentials](../reference/credentials.md) a upravte čokoľvek, čo zdrojový nástroj vyjadril odlišne.

> AI Convert je východiskový bod, nie zaručený prevod 1:1. Pred spustením v produkcii vždy skontrolujte vygenerovaný workflow.

## Dobré vedieť

- **Poháňané AI:** konverzie vytvára veľký jazykový model, takže výsledky sa môžu medzi jednotlivými spusteniami líšiť. Ak prvý výsledok nie je celkom správny, vygenerujte ho znova.
- **Veľkosť vstupu:** vstup, ktorý vložíte alebo napíšete, je obmedzený na približne **25 000 tokenov**. Pred konverziou skráťte veľmi rozsiahle exporty.
- **Limity rýchlosti:** aby bol nástroj dostupný pre všetkých, požiadavky sú obmedzené na **1 za minútu, 5 za hodinu a 10 za deň** na návštevníka.
- **Bezpečnosť:** požiadavky sú kontrolované a spracúvajú sa iba požiadavky na zostavenie workflow.

## Ďalšie kroky

- Ste na plátne nový? Začnite s [Quick Start](./quick-start.md).
- Ako funguje import sa dozviete v [Download & Import](../reference/download-import.md).
- Prevádzkujete Heym na vlastnom serveri? Úplnú referenciu konfigurácie nájdete v [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).
- Tvorte od nuly pomocou [AI Assistant](../reference/ai-assistant.md) priamo v aplikácii.
