# Migrar a Heym

¿Ya tiene workflows en otra herramienta? **AI Convert** los transforma en workflows de Heym por usted. Pegue un workflow de n8n, Flowise, Dify, Langflow, sim.ai o Activepieces — o simplemente describa lo que desea — y Heym construirá el workflow equivalente en un canvas en vivo que podrá descargar e importar.

Ábralo en **[heym.run/convert](https://heym.run/convert)**, o utilice el botón **✨ AI Convert** en el encabezado del sitio.

## Cómo funciona

1. **Seleccione su herramienta de origen** (opcional) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, o déjelo en *Auto*.
2. **Proporcione su workflow** — pegue el JSON exportado desde su herramienta actual, o escriba una descripción en lenguaje natural de la automatización que desea.
3. **Genere** — Heym transmite el resultado a un canvas, dibujando nodos y conexiones a medida que se producen.
4. **Descargue o copie** el workflow generado como JSON.
5. **Importe en Heym** — utilice el flujo de [Download & Import](../reference/download-import.md) para pegar el JSON en su canvas y luego ejecútelo.

La conversión también añade una pequeña *Sticky Note* en el canvas que marca el workflow como generado por Heym — elimínela cuando lo desee.

## Qué obtiene

El conversor asigna los conceptos de origen a nodos nativos de Heym — triggers, pasos de [LLM](../nodes/llm-node.md), llamadas [HTTP](../nodes/http-node.md), acciones de [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) y [Output](../nodes/output-node.md). Revise el resultado en el canvas, configure sus [Credenciales](../reference/credentials.md) y ajuste todo aquello que la herramienta de origen expresara de forma diferente.

> AI Convert es un punto de partida, no un port 1:1 garantizado. Revise siempre el workflow generado antes de ejecutarlo en producción.

## Información útil

- **Impulsado por IA:** las conversiones son producidas por un modelo de lenguaje grande, por lo que los resultados pueden variar entre ejecuciones. Vuelva a generar si el primer resultado no es del todo correcto.
- **Tamaño de entrada:** la entrada que pegue o escriba está limitada a aproximadamente **25.000 tokens**. Recorte las exportaciones muy grandes antes de convertir.
- **Límites de velocidad:** para mantener la herramienta disponible para todos, las solicitudes están limitadas a **1 por minuto, 5 por hora y 10 por día** por visitante.
- **Seguridad:** las solicitudes son filtradas y solo se procesan aquellas destinadas a construir workflows.

## Próximos pasos

- ¿Es nuevo en el canvas? Comience con la [Quick Start](./quick-start.md).
- Aprenda cómo funciona la importación en [Download & Import](../reference/download-import.md).
- ¿Autoaloja Heym? Consulte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) para la referencia completa de configuración.
- Construya desde cero con el [AI Assistant](../reference/ai-assistant.md) integrado en la aplicación.
