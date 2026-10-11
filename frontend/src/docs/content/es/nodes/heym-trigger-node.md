# Trigger de Heym

El nodo **Heym Trigger** inicia un workflow cuando Heym mismo publica un evento de plataforma. Es un nodo trigger sin entradas para automatizar Heym con Heym: trazas de auditoría de cambios, anuncios de despliegue y resúmenes de estado de la instancia.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Credencial | Ninguna requerida |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `eventNames` | Array de cadenas | Qué eventos suscribir. Déjelo vacío para recibir todos los eventos. |

## Eventos

| Evento | Se publica cuando | Alcance |
|-------|----------------|-------|
| `heym.started` | La plataforma Heym se inicia | A nivel de instancia: todos los suscriptores lo reciben |
| `workflow.created` | Se crea un workflow | Solo los suscriptores del propietario del workflow |
| `workflow.updated` | Se guarda un workflow | Solo los suscriptores del propietario del workflow |
| `workflow.deleted` | Se elimina un workflow | Solo los suscriptores del propietario del workflow |

Los widgets del panel se almacenan internamente como workflows, pero nunca producen eventos `workflow.*`.

## La entrega es por lotes

Heym despacha eventos cada cinco segundos. **Todos los eventos reclamados en una pasada de despacho llegan en una sola ejecución del workflow**, como un array.

- Cree dos workflows con cinco segundos de diferencia → **una** ejecución con dos eventos.
- Cree un workflow → **una** ejecución con un array de un elemento.

La forma nunca cambia, por lo que las expresiones posteriores nunca tienen que ramificarse según si llegó un evento o muchos. Cuando necesite actuar una vez por evento, coloque un nodo [Loop](./loop-node.md) sobre `$nodeLabel.events`.

## Entrega exactamente una vez

Cada evento se reclama por nodo suscriptor mediante una restricción única de base de datos antes de ser entregado. Esto se mantiene en cada worker de uvicorn, cada contenedor y cada máquina: ejecutar Heym en dos servidores no entrega un evento dos veces. Si no se puede registrar una reclamación, el evento no se entrega en absoluto — el diseño falla de forma cerrada en lugar de dispararse dos veces.

Dos nodos `heymTrigger` diferentes suscritos al mismo evento lo reciben cada uno una vez; no compiten por él.

## La ventana de despacho

El despachador solo considera eventos publicados en los **últimos cinco minutos**. Los eventos más antiguos permanecen en el registro para inspección, pero nunca se entregan. Esto acota lo que sucede tras un tiempo de inactividad: volver a poner Heym en marcha tras una hora sin conexión no reproduce nada, en lugar de disparar una hora de acumulación de una sola vez.

Los eventos se conservan durante **7 días** y luego se eliminan.

## Campos de salida

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.events` | Array de objetos de evento, del más antiguo al más reciente. Siempre un array. |
| `$nodeLabel.events[0].id` | UUID del evento |
| `$nodeLabel.events[0].name` | Nombre del evento, por ejemplo `workflow.created` |
| `$nodeLabel.events[0].payload` | Cuerpo del evento |
| `$nodeLabel.events[0].workflow_id` | Id del workflow sujeto, o `null` para `heym.started` |
| `$nodeLabel.events[0].created_at` | Marca de tiempo ISO de cuándo se publicó el evento |
| `$nodeLabel.count` | Número de eventos en este lote |
| `$nodeLabel.triggered_at` | Marca de tiempo ISO de la ejecución del workflow |

### Formas del payload

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` lleva el nombre capturado justo antes de la eliminación, ya que la fila del workflow ya no existe cuando usted lee el evento.

## Workflow de ejemplo

**Traza de auditoría de cambios de workflow**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** con etiqueta `platformEvents`, suscrito a `workflow.created`, `workflow.updated`, `workflow.deleted`
- Nodo **Heym** con `getWorkflow` y `heymWorkflowId` establecido en `$platformEvents.events[0].workflow_id`
- Mensaje de **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Notas

- `heym.started` se dispara **una vez por inicio de plataforma**, no una vez por worker, aunque Heym ejecuta ocho workers por contenedor. Los contenedores que se inician con más de cinco minutos de diferencia publican cada uno un evento.
- Las ejecuciones disparadas de esta forma aparecen en el historial con `trigger_source = "heym_event"`.
- Establezca **Events** en ninguno en lugar de listar los cuatro si desea recoger automáticamente los tipos de evento añadidos en versiones futuras.

## Relacionado

- [Heym](./heym-node.md) – Leer workflows e historial de ejecuciones
- [Triggers](../reference/triggers.md) – Descripción general de todos los puntos de entrada de workflows
- [Loop](./loop-node.md) – Actuar una vez por evento en un lote