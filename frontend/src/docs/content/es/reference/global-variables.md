# Variables globales

El **Almacén de Variables Globales** contiene datos persistentes de clave-valor con alcance de usuario que sobreviven entre ejecuciones de workflow. Úselo para configuración, indicadores de funcionalidades, contadores o estado compartido que necesiten varios workflows.

> **No almacene secretos aquí.** Las variables globales no son una bóveda de secretos: los valores se almacenan sin cifrar, se devuelven en su totalidad a cualquier persona con quien los comparta, y los colaboradores pueden editarlos. Las claves de API, contraseñas y tokens pertenecen a [Credenciales](./credentials.md), que los cifra en reposo y nunca devuelve el secreto al cliente.

## Locales vs Globales

| Almacén | Sintaxis | Alcance | Persistencia |
|-------|--------|-------|-------------|
| **Local del workflow** | `$vars.variableName` | Solo la ejecución actual | En memoria, se pierde cuando finaliza la ejecución |
| **Global** | `$global.variableName` | Todos los workflows del usuario | Persistido en la base de datos |

## Creación de variables globales

1. **Desde la pestaña Variables** – [Pestaña Variables](../tabs/global-variables-tab.md): Cree, edite y elimine variables directamente.
2. **Desde un Nodo Variable** – Habilite **Store in Global Variable Store** (`isGlobal: true`) en las propiedades del nodo. La variable se escribe en el almacén cuando se ejecuta el workflow.

## Uso en expresiones

Acceda a las variables globales con `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Utilice los mismos métodos que las variables locales del workflow (p. ej. `.upper()`, `.length`, `.add()` para arrays).

## Tipos de valores

Tipos admitidos: `string`, `number`, `boolean`, `array`, `object`. Elija el tipo al crear o editar una variable.

## Compartir variables globales

Puede compartir una variable global con otros usuarios o [Equipos](./teams.md) para que puedan usarla en sus propios workflows.

- **Compartir con un usuario** – Haga clic en el icono de compartir junto a una variable de su propiedad, introduzca el correo electrónico del destinatario y haga clic en **Share**. El destinatario verá la variable en su lista de Variables Globales con una insignia **Shared** y una etiqueta "Shared by &lt;your email&gt;".
- **Compartir con un equipo** – En el diálogo de compartir, seleccione un equipo y haga clic en **Add**. Todos los miembros del equipo obtienen acceso.
- **Acceso editable** – Los destinatarios pueden ver, editar y referenciar la variable compartida mediante `$global.variableName` en sus workflows. Solo el propietario puede compartir, dejar de compartir o eliminar la variable.
- **Conflictos de nombres** – Si un destinatario ya tiene una variable con el mismo nombre, su propia variable prevalece sobre la compartida.
- **Dejar de compartir** – Abra el diálogo de compartir de la variable y haga clic en el botón **×** junto al usuario al que desea revocar el acceso.

## Integración con Chat

Las variables globales están disponibles para el asistente de [Chat](../tabs/chat-tab.md). El LLM puede referenciarlas al responder preguntas o generar contenido.

## Relacionado

- [Pestaña Variables](../tabs/global-variables-tab.md) – Gestione variables globales en la interfaz
- [Nodo Variable](../nodes/variable-node.md) – Establezca variables con `isGlobal`
- [DSL de expresiones](./expression-dsl.md) – Sintaxis `$global`