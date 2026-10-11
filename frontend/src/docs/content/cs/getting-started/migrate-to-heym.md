# Migrace do Heym

Máte již workflows v jiném nástroji? **AI Convert** je převede na workflows Heym za vás. Vložte workflow z n8n, Flowise, Dify, Langflow, sim.ai nebo Activepieces — nebo jednoduše popište, co chcete — a Heym vytvoří ekvivalentní workflow na živém plátně, které si můžete stáhnout a importovat.

Otevřete jej na **[heym.run/convert](https://heym.run/convert)** nebo použijte tlačítko **✨ AI Convert** v záhlaví webu.

## Jak to funguje

1. **Zvolte zdrojový nástroj** (volitelné) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, nebo ponechte *Auto*.
2. **Poskytněte svůj workflow** — vložte exportovaný JSON ze současného nástroje nebo napište popis požadované automatizace v přirozeném jazyce.
3. **Vygenerujte** — Heym streamuje výsledek na plátno a vykresluje uzly a spojení tak, jak vznikají.
4. **Stáhněte nebo zkopírujte** vygenerovaný workflow jako JSON.
5. **Importujte do Heym** — použijte postup [Download & Import](../reference/download-import.md) pro vložení JSON na plátno a poté jej spusťte.

Konverze také přidá na plátno malou *Sticky Note* označující workflow jako vygenerovaný nástrojem Heym — můžete ji kdykoli smazat.

## Co získáte

Převodník mapuje koncepty zdrojového nástroje na nativní uzly Heym — triggery, kroky [LLM](../nodes/llm-node.md), volání [HTTP](../nodes/http-node.md), akce [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) a [Output](../nodes/output-node.md). Zkontrolujte výsledek na plátně, propojte své [Credentials](../reference/credentials.md) a upravte cokoli, co zdrojový nástroj vyjádřil odlišně.

> AI Convert je výchozí bod, nikoli zaručený převod 1:1. Před spuštěním v produkci vždy vygenerovaný workflow zkontrolujte.

## Dobré vědět

- **Poháněno AI:** konverze jsou vytvářeny velkým jazykovým modelem, takže výsledky se mohou mezi jednotlivými spuštěními lišit. Pokud první výsledek není zcela správný, vygenerujte jej znovu.
- **Velikost vstupu:** vstup, který vložíte nebo napíšete, je omezen na přibližně **25 000 tokenů**. Před konverzí zkraťte velmi rozsáhlé exporty.
- **Rate limits:** abychom nástroj udrželi dostupný pro všechny, jsou požadavky omezeny na **1 za minutu, 5 za hodinu a 10 za den** na návštěvníka.
- **Bezpečnost:** požadavky jsou prověřovány a zpracovávají se pouze požadavky na sestavení workflow.

## Další kroky

- Jste na plátně noví? Začněte s [Quick Start](./quick-start.md).
- Naučte se, jak funguje import, v [Download & Import](../reference/download-import.md).
- Provozujete Heym na vlastním serveru? Úplný přehled konfigurace najdete v [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).
- Sestavujte od nuly s [AI Assistant](../reference/ai-assistant.md) přímo v aplikaci.
