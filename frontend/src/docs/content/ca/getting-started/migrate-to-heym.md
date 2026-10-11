# Migrar a Heym

Ja teniu workflows en una altra eina? **AI Convert** els converteix en workflows de Heym per a vosaltres. Enganxeu un workflow de n8n, Flowise, Dify, Langflow, sim.ai o Activepieces — o simplement descriviu el que voleu — i Heym construeix el workflow equivalent en un llenç en directe que podeu descarregar i importar.

Obriu-lo a **[heym.run/convert](https://heym.run/convert)**, o utilitzeu el botó **✨ AI Convert** a la capçalera del lloc.

## Com funciona

1. **Trieu l'eina d'origen** (opcional) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, o deixeu-ho en *Auto*.
2. **Proporcioneu el vostre workflow** — enganxeu el JSON exportat de la vostra eina actual, o escriviu una descripció en llenguatge natural de l'automatització que voleu.
3. **Genereu** — Heym transmet el resultat a un llenç, dibuixant els nodes i les connexions a mesura que es produeixen.
4. **Descarregueu o copieu** el workflow generat com a JSON.
5. **Importeu-lo a Heym** — utilitzeu el flux [Download & Import](../reference/download-import.md) per enganxar el JSON al vostre llenç i, a continuació, executeu-lo.

La conversió també afegeix una petita *Sticky Note* al llenç que marca el workflow com a generat per Heym — suprimiu-la quan vulgueu.

## Què obteniu

El convertidor mapeja els conceptes d'origen als nodes natius de Heym — triggers, passos [LLM](../nodes/llm-node.md), crides [HTTP](../nodes/http-node.md), accions de [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) i [Output](../nodes/output-node.md). Reviseu el resultat al llenç, configureu les vostres [Credentials](../reference/credentials.md) i ajusteu qualsevol cosa que l'eina d'origen expressés de manera diferent.

> AI Convert és un punt de partida, no una migració 1:1 garantida. Reviseu sempre el workflow generat abans d'executar-lo en producció.

## Informació útil

- **Impulsat per IA:** les conversions les produeix un model de llenguatge gran, de manera que els resultats poden variar entre execucions. Torneu a generar si el primer resultat no és del tot correcte.
- **Mida de l'entrada:** l'entrada que enganxeu o escriviu està limitada a aproximadament **25.000 tokens**. Retalleu les exportacions molt grans abans de convertir.
- **Límits de freqüència:** per mantenir l'eina disponible per a tothom, les sol·licituds estan limitades a **1 per minut, 5 per hora i 10 per dia** per visitant.
- **Seguretat:** les sol·licituds es filtren i només es processen les sol·licituds de construcció de workflows.

## Passos següents

- Sou nou al llenç? Comenceu amb la [Quick Start](./quick-start.md).
- Apreneu com funciona la importació a [Download & Import](../reference/download-import.md).
- Autoallotgeu Heym? Consulteu les [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) per a la referència completa de configuració.
- Construïu des de zero amb l'[AI Assistant](../reference/ai-assistant.md) integrat a l'aplicació.
