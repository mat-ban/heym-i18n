# Enterprise

Licencias comerciales, soporte profesional y servicios de despliegue para la plataforma Heym.

## Descripción general

Heym es de uso gratuito y puede autoalojarse bajo su licencia de código disponible. Para organizaciones que necesitan licencias comerciales, asistencia de despliegue de nivel productivo o soporte dedicado, el plan Enterprise proporciona servicios prácticos del equipo de Heym.

| Servicio | Descripción |
|---------|-------------|
| **Soporte de agentes en producción** | Revisiones de arquitectura, orientación en el diseño de agentes y workflows, y ayuda práctica para llevar agentes a producción |
| **Formación en herramientas** | Sesiones de incorporación y formación para su equipo que abarcan el editor de workflows, nodos de IA, agentes e integraciones |
| **Preguntas y respuestas sobre Heym** | Acceso directo al equipo de ingeniería de Heym para consultas sobre la plataforma, mejores prácticas y resolución de problemas |
| **Despliegue en Kubernetes** | Asistencia con configuraciones de múltiples nodos worker, contenedores sidecar, estrategias de escalado y configuración de clústeres |
| **Consultoría de soluciones** | Diseño de soluciones personalizadas para su caso de uso específico, incluida la planificación de integraciones y recomendaciones de arquitectura |
| **Soporte prioritario y SLA** | Tiempos de respuesta garantizados y resolución prioritaria de incidencias |
| **Desarrollo personalizado** | Desarrollo de funcionalidades y modificaciones adaptadas a los requisitos de su organización |

## Soporte de agentes en producción

El equipo de Heym le ayuda a diseñar, construir y reforzar agentes y workflows para sus procesos de negocio. Esto incluye revisar sus requisitos, recomendar configuraciones de nodos y asegurar que sus workflows sigan las mejores prácticas de fiabilidad, observabilidad y gobernanza.

El soporte abarca todos los tipos de nodos, incluidos los triggers [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) y [Cron](../nodes/cron-node.md), así como patrones avanzados como la [orquestación multiagente](./agent-architecture.md), los puntos de control de [Human-in-the-Loop](./human-in-the-loop.md) y la [ejecución en paralelo](./parallel-execution.md) entre ramas.

## Formación en herramientas

Sesiones de formación práctica adaptadas al nivel de habilidad y los casos de uso de su equipo:

- Editor de workflows y [funcionalidades del canvas](./canvas-features.md)
- Nodos impulsados por IA: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Arquitectura de agentes](./agent-architecture.md) y orquestación multiagente
- Gestión de [Credenciales](./credentials.md) e [integraciones de terceros](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) y programación con [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) y [variables globales](./global-variables.md)
- Colaboración en [Equipos](./teams.md) y [uso compartido de credenciales](./credentials-sharing.md)
- Despliegue del [Portal](./portal.md) para interfaces de chat orientadas al cliente
- [Trazas](../tabs/traces-tab.md) y [Evaluaciones](../tabs/evals-tab.md) para la observabilidad de workflows de IA

## Despliegue en Kubernetes

La guía estándar de [Ejecución y despliegue](../getting-started/running-and-deployment.md) cubre Docker Compose para configuraciones de producción en un único servidor. Los clientes Enterprise reciben asistencia con despliegues de Kubernetes en producción para alta disponibilidad y escalado horizontal:

- **Múltiples nodos worker** — Distribución de los workers del backend de Heym entre varios nodos de Kubernetes para redundancia y balanceo de carga
- **Contenedores sidecar** — Configuración de patrones sidecar para recopilación de logs, agentes de monitorización, mallas de servicios (Istio, Linkerd) e inyección de secretos (Vault)
- **Planificación de recursos** — Solicitudes y límites de CPU y memoria, presupuestos de interrupción de pods y políticas de autoescalado horizontal de pods
- **Redes** — Configuración del controlador Ingress, terminación TLS y comunicación interna de servicios entre los pods de backend, frontend y base de datos
- **Almacenamiento persistente** — Aprovisionamiento de volúmenes para la base de datos y el almacén vectorial con la StorageClass adecuada y estrategias de copia de seguridad
- **Monitorización** — Integración con Prometheus, Grafana o su stack de observabilidad existente para métricas de contenedores, logs y alertas

## Consultoría de soluciones

Cada organización ejecuta agentes contra sistemas y restricciones diferentes. El equipo de Heym proporciona consultoría para ayudarle a:

- Evaluar si Heym se ajusta a su caso de uso específico
- Diseñar arquitecturas de agentes y workflows de extremo a extremo
- Planificar integraciones con su infraestructura existente y servicios de terceros
- Depurar workflows complejos y resolver incidencias en producción
- Migrar workflows existentes desde herramientas como n8n, Zapier o Make.com

## Contacto

Comuníquese con el equipo enterprise en **enterprise@heym.run** para consultas sobre licencias, precios o para programar una llamada introductoria.
## Relacionado

- [Ejecución y despliegue](../getting-started/running-and-deployment.md) — Despliegue en producción con Docker Compose
- [Seguridad](./security.md) — Prácticas de seguridad de la plataforma y configuración
- [Ejecución en paralelo](./parallel-execution.md) — Modelo de ejecución con múltiples workers
- [Equipos](./teams.md) — Colaboración en equipo y uso compartido de recursos
- [Conjunto completo de funcionalidades](./features.md) — Descripción general completa de las capacidades de Heym
