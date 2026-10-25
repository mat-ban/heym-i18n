# Tipos de Nodo

Heym proporciona una variedad de tipos de nodo para construir workflows. Utilice [expresiones](./expression-dsl.md) como `$input.text` y `$nodeLabel.field` en la configuración del nodo.

## Nodos Trigger

| Nodo | Descripción | Salidas |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Punto de entrada de texto para el workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger según una programación (expresión cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger cuando llega una actualización del webhook de un bot de Telegram | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger cuando Slack envía un webhook de la Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger cuando Discord envía un webhook de interacción de aplicación | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger cuando llega un nuevo correo electrónico a un buzón IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger cuando Heym publica un evento de plataforma (array por lotes) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger desde una conexión saliente hacia un servidor WebSocket externo | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Genere un enlace de carga de un solo uso e inicie cuando se suba un archivo grande | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger cuando se recibe un mensaje de una cola | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Se ejecuta cuando cualquier nodo presenta un error (sin arista entrante) | 1 |

Consulte [Triggers](./triggers.md) para conocer todos los puntos de entrada.

## Nodos de IA

| Nodo | Descripción | Entradas | Salidas |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Procesa texto con un modelo de lenguaje | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Realice preguntas tipadas a un modelo de decisión y ramifique según las probabilidades que devuelva | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM con tool calling, skills, MCP, [revisión humana](./human-in-the-loop.md) opcional y [grafo de memoria persistente](./agent-persistent-memory.md) opcional. Consulte [Agent Architecture](./agent-architecture.md). | 1 | 1, más una salida `review` opcional |
| [Codex](../nodes/codex-node.md) | Ejecute el CLI local de Codex contra un repositorio de GitHub utilizando un token de acceso de ChatGPT/Codex | 1 | 1, más una salida `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Ejecute el CLI de OpenCode contra un repositorio de GitHub en un contenedor reforzado utilizando una clave de API de la pasarela OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Llame directamente a una herramienta MCP específica sin que un LLM la seleccione | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Inserte, actualice, elimine o busque (vectorial o híbrida vectorial + BM25) en un [almacén vectorial](../tabs/vectorstores-tab.md) de Qdrant o Postgres (pgvector) para RAG | 1 | 1 |

## Nodos de Lógica

| Nodo | Descripción | Entradas | Salidas |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Ramifique según if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Enrute haciendo coincidir un valor con casos | 1 | n |
| [Merge](../nodes/merge-node.md) | Espere múltiples entradas y combínelas | n | 1 |
| [Loop](../nodes/loop-node.md) | Itere sobre un array | 1 | 2 (loop/done) |

## Nodos de Datos

| Nodo | Descripción | Entradas | Salidas |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transforme y asigne datos | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Convierta datos entre formatos (CSV, JSON, XML) y aplique OCR a imágenes o PDFs para obtener texto | 1 | 1 |
| [Code](../nodes/code-node.md) | Ejecute Python en un sandbox desechable y aislado de la red con su propio requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Establezca u obtenga una variable (local del workflow o [global](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Llame a otro workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Lea workflows de Heym e historial de ejecuciones | 1 | 1 |

## Nodos de integración

| Nodo | Descripción | Entradas | Salidas |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Realizar solicitudes HTTP (cURL) | 0 o 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Conectar a un WebSocket externo y enviar un mensaje | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Enviar mensajes de bot de Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Enviar mensajes de Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Enviar mensajes de webhook de Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Enviar correos electrónicos vía SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operaciones de Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Leer/escribir hojas de cálculo de Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Gestionar repositorios, usuarios, issues, pull requests, reviews, releases, workflows de Actions y archivos a través de la API REST de GitHub | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Gestionar proyectos, issues, comentarios, adjuntos, usuarios, notificaciones y transiciones de workflow de Jira a través de la API REST de Jira | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Gestionar equipos, proyectos, issues, estados de workflow y comentarios de Linear a través de GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Leer/escribir Google Sheets vía OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Listar, descargar, actualizar y eliminar archivos de Google Drive vía OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Ejecutar consultas SQL e insertar filas en BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Consultar y modificar tablas de Supabase a través de PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Ejecutar operaciones SQL, CRUD y de conteo contra ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Gestionar bases de datos, fuentes de datos, páginas y bloques de Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Gestionar organizaciones, proyectos, equipos, issues, eventos y releases de Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Gestionar buckets y carpetas; listar, subir, descargar, copiar y eliminar objetos | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Leer/escribir Tablas de datos de Heym (almacenamiento propio) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Gestionar archivos de Drive: eliminar, establecer contraseña, TTL, descargas máximas, compartir/dejar de compartir con el equipo | 1 | 1 |

## Nodos de automatización

| Nodo | Descripción | Entradas | Salidas |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Extraer páginas web con FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automatización de navegador con paso de IA y Auto Heal | 1 | 1 |

## Nodos de utilidad

| Nodo | Descripción | Entradas | Salidas |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Retrasar la ejecución | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint de salida | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Asignar campos a un objeto JSON; único terminal = cuerpo de nivel superior del webhook/ejecución | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Renderizar una página HTML; único terminal = el webhook responde con text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Salida de widget de panel terminal que asigna las filas de entrada a payloads de gráficos | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Añadir notas markdown al canvas (no se ejecuta) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Registrar en la consola del backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Deshabilitar otro nodo en el workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Habilitar un nodo deshabilitado en el workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Detener el workflow con una respuesta de error | 1 | 0 |

## Nodos de plugin

Los nodos de plugin son proporcionados por los plugins instalados en la instancia. Cada plugin instalado aparece en la paleta bajo **Plugins** con su propio nombre; internamente se corresponde con uno de estos dos tipos de nodo.

| Nodo | Descripción | Entradas | Salidas |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Acción personalizada proporcionada por un plugin instalado | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Trigger personalizado proporcionado por un plugin instalado | 0 | 1 |

## Relacionado

- [Funciones del Canvas](./canvas-features.md) – Data pin, registros de ejecución, habilitar/deshabilitar, extraer a sub-workflow
- [Nodo de agente](../nodes/agent-node.md) – Referencia detallada del Nodo de agente IA
- [Arquitectura de agentes](./agent-architecture.md) – Sub-agentes, orquestador, skills, MCP, tool calling
- [Memoria persistente de agentes](./agent-persistent-memory.md) – Grafo de conocimiento por nodo, uso compartido y extracción en segundo plano
- [Human-in-the-Loop](./human-in-the-loop.md) – Pausar la salida del agente para aprobación humana
- [Expression DSL](./expression-dsl.md) – Referenciar datos en la configuración de nodos
- [Diálogo de evaluación de expresiones](./expression-evaluation-dialog.md) – Editor expandible con vista previa en vivo del backend
- [Trigger de carga de archivos](../nodes/file-upload-trigger-node.md) – Aceptar cargas multipart grandes mediante enlaces de un solo uso
- [Trigger de WebSocket](../nodes/websocket-trigger-node.md) – Trigger de socket saliente en tiempo real
- [Envío por WebSocket](../nodes/websocket-send-node.md) – Enviar mensajes a sockets externos
- [Estructura de workflows](./workflow-structure.md) – Formato JSON para nodos y edges
- [Triggers](./triggers.md) – Todos los puntos de entrada de workflows
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir API keys para LLM, HTTP y otros nodos
- [Uso compartido de credenciales](./credentials-sharing.md) – Compartir credenciales con otros usuarios
- [Portal](./portal.md) – Exponer workflows como interfaces de chat públicas
- [Pestaña Almacenes vectoriales](../tabs/vectorstores-tab.md) – Crear almacenes vectoriales para nodos RAG
