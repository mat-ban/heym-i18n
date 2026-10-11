# Discord Trigger

El nodo **Discord Trigger** es un punto de entrada sin entradas que recibe webhooks de la API de Discord Interactions e inicia un workflow automáticamente. Úselo para slash commands, botones, modales y otras interacciones de aplicaciones de Discord que deban fluir hacia nodos de IA o de integración posteriores.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `discord_trigger` que contiene la clave pública de la aplicación de Discord |

## Guía de configuración

### 1. Cree una credencial `discord_trigger`

1. Vaya a **Settings → Credentials → New Credential**
2. Seleccione el tipo **Discord Trigger (Public Key)**
3. Pegue la **Application Public Key** del Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Guarde la credencial

### 2. Añada el nodo a su workflow

1. Arrastre **Discord Trigger** al canvas
2. Seleccione el nodo para abrir el panel de Propiedades
3. Elija su credencial `discord_trigger`
4. Copie la **Interactions URL** que se muestra en el panel del nodo

### 3. Registre el endpoint de Interactions en Discord

1. Abra el [Discord Developer Portal](https://discord.com/developers/applications)
2. Seleccione su aplicación
3. Vaya a **General Information** o **Interactions**
4. Pegue la **Interactions Endpoint URL** del nodo en el campo del endpoint
5. Discord envía una solicitud `PING` para validar el endpoint y Heym responde automáticamente tras verificar la firma
6. Guarde los cambios

## Campos de salida

Una vez que el nodo se activa, los nodos posteriores pueden acceder a:

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.interaction` | Payload completo de la interacción de Discord |
| `$nodeLabel.type` | Tipo de interacción |
| `$nodeLabel.data` | Payload del comando, botón o modal |
| `$nodeLabel.data.name` | Nombre del slash command, cuando corresponda |
| `$nodeLabel.data.options` | Array de opciones del slash command |
| `$nodeLabel.headers` | Headers del webhook saneados |
| `$nodeLabel.triggered_by` | Etiqueta del origen del Trigger (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID del nodo del canvas que recibió la interacción de Discord |
| `$nodeLabel.triggered_at` | Marca de tiempo ISO de esta ejecución del workflow |

## Workflow de ejemplo

**Slash command de Discord → LLM → Output**

```
discordTrigger → llm → output
```

- Etiqueta del **Discord Trigger**: `discordEvent`
- Mensaje de usuario del **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Mensaje del **Output**: `$llm.text`

## Seguridad

- Las solicitudes se verifican mediante **Ed25519** con la clave pública de su aplicación
- Se rechazan las marcas de tiempo con una antigüedad superior a **5 minutos** para reducir ataques de repetición
- Los headers sensibles (`x-signature-ed25519`, `authorization`, etc.) se eliminan antes de que los datos lleguen a los nodos posteriores
- El Trigger requiere una credencial `discord_trigger` válida; las solicitudes se rechazan si la credencial falta o no es válida

## Notas

- Heym devuelve una respuesta diferida de Discord de inmediato, ejecuta el workflow en segundo plano y publica la salida final del workflow como un follow-up de Discord cuando un nodo `Output` produce contenido
- La URL de interactions se deriva del ID del nodo y permanece estable aunque se cambie el nombre del workflow
- Utilice un [Discord Node](./discord-node.md) normal solo cuando también desee una publicación de webhook independiente además del follow-up de la interacción
- Un nodo `discordTrigger` suele ser suficiente; use **Switch** o **Condition** en los nodos posteriores para enrutar los distintos tipos de interacción

## Relacionado

- [Discord Node](./discord-node.md) – Enviar mensajes salientes de Discord
- [Triggers](../reference/triggers.md) – Descripción general de todos los puntos de entrada del workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuración de credenciales de Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Añadir y gestionar credenciales `discord_trigger`