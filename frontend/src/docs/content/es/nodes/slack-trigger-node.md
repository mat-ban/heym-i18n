# Slack Trigger

El nodo **Slack Trigger** es un punto de entrada sin entradas que recibe webhooks de la Slack Events API e inicia un workflow automáticamente. Gestiona el desafío de verificación de URL de Slack y verifica las firmas de las solicitudes con un signing secret.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `slack_trigger` que contiene el signing secret |

## Guía de configuración

### 1. Cree una credencial `slack_trigger`

1. Vaya a **Settings → Credentials → New Credential**
2. Seleccione el tipo **Slack Trigger (Signing Secret)**
3. Pegue el **Signing Secret** de su Slack App:
   - En Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Guarde la credencial

### 2. Añada el nodo a su workflow

1. Abra el canvas del workflow
2. Arrastre **Slack Trigger** desde el panel de nodos hasta el canvas
3. Haga clic en el nodo para abrir el panel de propiedades
4. Seleccione su credencial `slack_trigger`
5. Copie la **Webhook URL** que se muestra en el panel

### 3. Configure su Slack App

1. En la configuración de su Slack App, vaya a **Event Subscriptions**
2. Active **Enable Events**
3. Pegue la Webhook URL en el campo **Request URL**
4. Slack envía un desafío de verificación de URL — Heym responde automáticamente en milisegundos
5. El campo se vuelve verde: ✓ Verified
6. Suscríbase a los **Bot Events** que necesite (por ejemplo, `message.channels`, `reaction_added`)
7. Guarde los cambios y reinstale la app en su workspace si se le solicita

## Campos de salida

Una vez que el nodo se activa, los nodos posteriores pueden acceder a:

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.event` | Objeto completo del evento de Slack |
| `$nodeLabel.event.type` | Tipo de evento (por ejemplo, `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Texto del mensaje (cuando corresponda) |
| `$nodeLabel.event.user` | ID del usuario de Slack que activó el evento |
| `$nodeLabel.event.channel` | ID del canal |
| `$nodeLabel.event.ts` | Marca de tiempo del evento |
| `$nodeLabel.headers` | Encabezados HTTP saneados de Slack |
| `$nodeLabel.triggered_by` | Etiqueta del origen del Trigger (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID del nodo del canvas que recibió el evento de Slack |

## Workflow de ejemplo

**Mensaje de Slack → respuesta del LLM → envío a Slack:**

```
slackTrigger → llm → slack
```

- Etiqueta de **slackTrigger**: `slackEvent`
- Mensaje de usuario del **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Mensaje de **Slack**: `$llm.text`

## Seguridad

- Las solicitudes se verifican mediante **HMAC-SHA256** con su signing secret
- Las marcas de tiempo con una antigüedad superior a **5 minutos** se rechazan (prevención de ataques de repetición)
- Los encabezados sensibles (`x-slack-signature`, `authorization`, etc.) se eliminan antes de que lleguen a los nodos posteriores
- Si no se configura ninguna credencial, el nodo se ejecuta sin verificación — solo se recomienda para pruebas locales

## Notas

- Heym responde con `200 OK` de inmediato y ejecuta el workflow en segundo plano — esto satisface el requisito de respuesta de 3 segundos de Slack
- La webhook URL se deriva del ID del nodo y nunca cambia, incluso después de renombrar el workflow
- Solo se necesita un nodo `slackTrigger` por workflow; utilice nodos **Switch** o **Condition** posteriores para enrutar los distintos tipos de eventos