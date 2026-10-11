# Configuración

El diálogo de Configuración permite gestionar su perfil, establecer instrucciones persistentes para la IA, actualizar la contraseña de su cuenta, configurar la voz del chat, definir su credencial y modelo de IA predeterminados, y revisar el estado de observabilidad. Ábralo haciendo clic en **su avatar y nombre** en la esquina superior derecha del encabezado.

## Abrir el diálogo

Haga clic en **su avatar y nombre** en la esquina superior derecha del encabezado. El diálogo se abre con estas pestañas: **Perfil**, **Seguridad**, **Voz**, **Valores predeterminados de IA** y **Observabilidad**. Los administradores de la instancia también ven una pestaña **SSO**.

## Pestaña Perfil

### Foto de perfil

Heym muestra su imagen de [Gravatar](https://gravatar.com) correspondiente al correo electrónico de su cuenta en el encabezado, junto a sus mensajes en el [Chat](../tabs/chat-tab.md) y en **Chat with Heym**, en los comentarios del [Board](../tabs/board-tab.md), y junto a su nombre en los diálogos para compartir y en las listas de miembros del equipo. Para cambiarla, actualice la imagen en Gravatar; Heym adoptará la nueva en unas pocas horas. Si no hay una imagen de Gravatar, Heym muestra la primera letra de su nombre.

La imagen es obtenida por el servidor de Heym y se almacena en caché allí, por lo que su navegador nunca contacta a Gravatar. Si el servidor no puede acceder a Gravatar, todos seguirán viendo las iniciales.

### Nombre

Su nombre para mostrar en toda la aplicación. Este campo es obligatorio y no puede quedar vacío.

### Reglas de usuario

Las Reglas de usuario son instrucciones personalizadas que se inyectan automáticamente en cada solicitud a la IA, tanto en el constructor de workflows como en el chat del panel. En el **constructor de workflows** ([AI Assistant](./ai-assistant.md)), se añaden al system prompt utilizado para generar el JSON del workflow. En el **chat del panel**, se aplican como contexto a nivel de sistema. Se escriben una vez y se aplican globalmente sin repetirlas en cada prompt.

**Usos comunes:**

- Idioma o tono: `Always respond in English. Keep responses concise.`
- Estilo de código: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Convenciones de workflow: `Include error handling in all workflows. Use descriptive node labels.`
- Formato de respuesta: `Use bullet points. Avoid lengthy explanations.`

**Dónde se aplican:**

| Contexto | Descripción |
|---------|-------------|
| **Constructor de workflows** | Solicitudes del [AI Assistant](./ai-assistant.md) para generar o modificar workflows |
| **Chat del panel** | Todas las conversaciones de la [pestaña Chat](../tabs/chat-tab.md) |

Las Reglas de usuario se inyectan a nivel de sistema: se ejecutan antes de cada prompt automáticamente, sin ninguna configuración adicional por workflow o conversación.

### Guardar los cambios del perfil

Haga clic en **Save Changes** para aplicar. Los cambios surten efecto de inmediato para todas las nuevas solicitudes a la IA.

## Pestaña Seguridad

### Cambiar la contraseña

Utilice la pestaña Seguridad para actualizar la contraseña de su cuenta.

**Requisitos:**

| Regla | Requisito |
|------|-------------|
| Longitud mínima | 8 caracteres |
| Mayúscula | Al menos una letra mayúscula (A–Z) |
| Minúscula | Al menos una letra minúscula (a–z) |
| Dígito | Al menos un número (0–9) |

La contraseña también debe ser distinta de su contraseña actual. Estas reglas se aplican tanto en el frontend como en el backend.

**Pasos:**

1. Introduzca su **Current Password**
2. Introduzca su **New Password** (debe cumplir todos los requisitos anteriores)
3. Vuelva a introducirla en **Confirm New Password**
4. Haga clic en **Update Password**

Si la contraseña actual es incorrecta, se muestra un mensaje de error en línea. Si la operación es exitosa, aparece un mensaje de confirmación y el formulario se restablece automáticamente.

## Pestaña Voz

La pestaña Voz configura la voz hablada para la [pestaña Chat](../tabs/chat-tab.md): seleccione una **credencial de ElevenLabs** (o añada una en línea), elija una **Voice** de su cuenta de ElevenLabs y haga clic en **Save Voice Settings**. Esto habilita la lectura en voz alta por mensaje y el modo de voz interactivo. Consulte [Chat Voice (TTS & STT)](./chat-voice.md) para conocer el flujo completo.

## Pestaña Valores predeterminados de IA

La pestaña Valores predeterminados de IA tiene dos secciones.

### Credencial y modelo preferidos

Seleccione una **credencial de LLM preferida** y un **modelo** de esta. Esto se convierte en el valor predeterminado inicial para cada función de IA de la aplicación — el chat, el [AI Assistant](./ai-assistant.md) (constructor, analizador y creación de workflows), el mapeador del board, los widgets de IA del panel, el [chat de docs](../tabs/chat-tab.md), el asistente de esquemas de IA de las tablas de datos, el constructor de expresiones y las evaluaciones — siempre que esa superficie no tenga una selección guardada propia.

La regla de selección que sigue cada superficie es:

1. **Selección guardada** — una elección que ya haya hecho en esa superficie (por ejemplo, el último modelo de una conversación de chat) siempre prevalece.
2. **Preferida** — se utiliza cuando no hay una selección guardada.
3. **Primera credencial disponible** — el valor de reserva cuando no ha establecido ninguna preferencia.

Aún puede cambiar la credencial y el modelo por superficie en cualquier momento; la preferencia solo rellena el valor predeterminado inicial. Deje la credencial como **No preference** para mantener el comportamiento anterior de primera credencial. Si su credencial preferida se elimina o deja de compartirse posteriormente, la pestaña muestra un aviso y las superficies recurren silenciosamente a la primera credencial disponible.

### Uso del paquete de codificación

Para cada credencial de **Codex** (incluidas las compartidas), la pestaña muestra el uso restante del límite de velocidad como una barra horizontal por ventana activa — por ejemplo, una ventana de **5 horas** y/o una ventana **Semanal**, según el plan. Cada barra muestra el porcentaje de cuota restante y una cuenta atrás para el restablecimiento. Un botón **Refresh** vuelve a consultar bajo demanda (los resultados se almacenan en caché brevemente en el servidor).

Para cada credencial de **OpenCode**, la pestaña muestra las ventanas de suscripción de OpenCode Go — **5 horas**, **Semanal** y **Mensual** — con el mismo estilo de barra, leídas desde el endpoint de uso autenticado del gateway con la API key de esa credencial. Una ventana que ha alcanzado su límite se muestra como **"limit reached"** en ámbar. Si la key no es válida o el workspace no tiene suscripción Go, la tarjeta indica el motivo en lugar de mostrar barras.

## Pestaña Observability

La pestaña Observability muestra el estado de solo lectura de [OpenTelemetry Tracing](./opentelemetry.md) para esta instancia: si el tracing está habilitado, el endpoint OTLP, el nombre del servicio, el ratio del sampler y qué spans se emiten. El tracing se configura mediante variables de entorno `HEYM_OTEL_*` en el backend, por lo que esta pestaña no edita nada. Cuando el tracing está deshabilitado, la pestaña enumera las variables de entorno necesarias para activarlo. Los secretos, como las cabeceras de autenticación de OTLP, nunca se muestran aquí. Consulte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) para la referencia completa de configuración.

## Pestaña SSO

Visible solo para los administradores de la instancia — las cuentas listadas en `HEYM_ADMIN_EMAILS`. Esta pestaña conecta Heym con un proveedor externo de OpenID Connect para que las personas inicien sesión con las cuentas que ya tienen. Introduzca una URL de issuer y las credenciales de cliente, copie la URI de redirección de solo lectura en su proveedor y ejecute **Test connection** antes de habilitarlo. El inicio de sesión con contraseña puede desactivarse desde aquí una vez que la prueba sea satisfactoria. Consulte [Single Sign-On](./sso.md) para la configuración completa.

## Pestaña Instances

Visible solo para los administradores de la instancia — las cuentas listadas en `HEYM_ADMIN_EMAILS`. Esta pestaña enumera las instancias de Heym conectadas a esta base de datos y establece cómo se reparten las ejecuciones en segundo plano entre ellas. Cada fila muestra el nombre editable de la instancia, su rol, si está activa, su latencia medida hacia la base de datos, un interruptor de encendido/apagado y su peso. Los pesos son cuotas de las instancias que actualmente pueden asumir trabajo, no porcentajes sobre 100: con `41 / 26 / 33` y la tercera instancia apagada, las dos primeras reciben realmente el 61% y el 39%. El panel imprime ese reparto efectivo bajo la tabla y solo se niega a guardar cuando ninguna instancia habilitada tiene peso alguno.

**Give new instances a share automatically** está activado por defecto: una instancia que se une, de lo contrario, quedaría con peso 0 y no recibiría nada, por lo que el líder le asigna una cuota igual una vez y reduce los pesos existentes manteniendo sus proporciones. Nunca modifica una instancia cuyo peso haya establecido usted mismo.

El panel también informa cuántas de las ejecuciones de las últimas 24 horas solo pudieron ejecutarse en la instancia principal. Cuando esa proporción es alta, los pesos inferiores no pueden mover ese trabajo. Consulte [Load Distribution](./cluster.md) para saber qué permanece en la principal y cómo elegir los números.

## Qué no está en este diálogo

| Función | Dónde encontrarla |
|---------|-----------------|
| **Gestión de API key (MCP)** | [Pestaña MCP](../tabs/mcp-tab.md) – ver, copiar y regenerar la API key del servidor MCP |
| **Tema (oscuro / claro)** | Botón de alternancia Sol/Luna en la cabecera (junto a la insignia de usuario) |
| **Cambio de correo electrónico** | No compatible actualmente |

## Relacionado

- [AI Assistant](./ai-assistant.md) – Chat del constructor de Workflows que utiliza User Rules
- [Pestaña Chat](../tabs/chat-tab.md) – Chat del Dashboard que utiliza User Rules
- [Chat Voice (TTS & STT)](./chat-voice.md) – Voz de ElevenLabs configurada en la pestaña Voice
- [Pestaña MCP](../tabs/mcp-tab.md) – API key del servidor MCP y exposición de herramientas de workflow
- [Pestaña Credentials](../tabs/credentials-tab.md) – API keys para nodos de IA e integraciones
- [Security](./security.md) – Gestión de sesiones, limitación de velocidad, cifrado de credenciales
- [Single Sign-On](./sso.md) – Conectar un proveedor externo de OpenID Connect
- [OpenTelemetry Tracing](./opentelemetry.md) – Tracing distribuido para ejecuciones de workflows y nodos
