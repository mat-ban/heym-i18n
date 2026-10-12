# Heym Work

**Heym Work** es una segunda interfaz para equipos de negocio, construida sobre Heym. Los usuarios describen una tarea con sus propias palabras, responden a unas pocas preguntas y obtienen un workflow creado y probado por Heym. Trabajan desde páginas creadas para ellos, responden a revisiones y ven cada ejecución con el nombre de quien la inició. Heym ejecuta cada tarea en segundo plano.

Heym Work se ejecuta en su propio contenedor junto a Heym, con una licencia independiente del equipo de Heym. Obtenga más información y solicite una versión de prueba en [heym.run/enterprise](https://heym.run/enterprise). Vea el [vídeo de presentación de Heym Work](https://youtu.be/5Z2gGo6bcpU) para un recorrido de dos minutos.

## Qué obtienen los equipos de negocio

| Área | Qué hace |
|------|----------|
| **Chat** | Describa una tarea escribiendo o por voz. Heym solicita la información necesaria, crea el workflow, lo prueba y lo marca como Verificado. |
| **Páginas** | Páginas fijadas con widgets: números, gráficos, tablas con etiquetas de estado, zonas para soltar archivos y aprobaciones. Una fila de tabla puede abrir su propia página de detalles. |
| **Aprobaciones** | Las revisiones de los pasos [Human-in-the-Loop](./human-in-the-loop.md) esperan en Actividad y en las páginas, con opciones para Aprobar, Solicitar cambios y Rechazar. |
| **Actividad** | Cada ejecución, con la persona que la inició y la instancia que la ejecutó. |
| **Roles** | Propietario, Editor y Visualizador. El inicio de sesión se realiza mediante el [Single Sign-On](./sso.md) que ya utiliza Heym. |
| **Ediciones sectoriales** | Las ediciones para el sector legal, educativo, financiero, logístico, energético y de comercio electrónico se abren con páginas, datos de ejemplo y workflows específicos para esa industria. |

## Conexión de Heym Work

Vea el [vídeo de instalación](https://youtu.be/zXGfg1HPSLk) para conocer toda la configuración, desde el primer comando hasta la pantalla principal.

La conexión se configura en **Ajustes → Heym Work**. La pestaña solo aparece para los administradores de la instancia cuyos correos figuran en `HEYM_ADMIN_EMAILS`.

| Campo | Qué hace |
|-------|----------|
| **Dirección de Heym Work** | Dónde se ejecuta Heym Work, por ejemplo `https://work.example.com`. El inicio de sesión redirige a este destino. Pulse **Guardar**. |
| **Clave de integración** | **Generar clave** crea la clave que Heym Work utiliza para cada solicitud enviada a Heym. Se muestra una única vez, junto con un botón para copiarla. Heym almacena únicamente su hash. |
| **Activar Heym Work** | Habilita la conexión. Requiere haber configurado previamente la dirección y una clave. |
| Estado | **Visto por última vez**, **Versión de Work** y **Licencia**, según el último informe enviado por Heym Work. |

A continuación, abra la dirección de Heym Work y complete su configuración:

1. **Licencia**: introduzca la clave de licencia facilitada por el equipo de Heym.
2. **Heym**: introduzca la dirección de Heym y la clave de integración.
3. **Propietario**: inicie sesión con una cuenta designada como Propietario de Heym Work.

Se abrirá la pantalla principal, lista para el equipo.

### Rotar la clave

**Rotar clave** reemplaza la clave de integración. Heym Work dejará de funcionar hasta que se introduzca allí la nueva clave, y se cerrará la sesión de todos los usuarios en Heym Work. Utilice esta opción si sospecha que la clave se ha filtrado o cuando una persona que tuvo acceso a ella deje el equipo.

### Desactivar la conexión

Desactive **Activar Heym Work** para pausar la conexión. En ese momento Heym Work solicitará de nuevo la clave de Heym. Heym seguirá ejecutando todos los workflows, programaciones y webhooks en cualquiera de los casos.

## Modelo de seguridad

- **Cada cambio pasa por Heym.** Heym Work lee los datos que muestra desde la base de datos de Heym y envía cada acción a Heym a través de un canal protegido por clave, donde Heym aplica sus propias reglas de acceso. Heym Work almacena sus propios datos en un esquema independiente llamado `heym_work`.
- **La clave se almacena en forma de hash.** Heym compara el hash de la clave presentada y nunca almacena la clave en texto claro.
- **La autenticación reside en Heym.** Los usuarios inician sesión a través de Heym, utilizando su proveedor de identidad cuando el [SSO](./sso.md) está activo.
- **Los cambios se auditan.** Guardar la conexión y rotar la clave generan registros `work_integration.update` y `work_integration.key_rotate` en el [registro de auditoría](./audit.md).

## Licencias

Heym Work requiere su propia clave de licencia emitida por el equipo de Heym. Diariamente, Heym Work envía a heym.run su ID de licencia, un ID de instalación, el número de usuarios activos en los últimos 30 días, el número total de miembros, las ejecuciones en las últimas 24 horas y las versiones de Heym y Heym Work. El contenido de los workflows, las entradas, las salidas y las credenciales permanecen siempre en sus servidores.

Si la sincronización diaria falla durante 30 días, comienza un periodo de gracia de 14 días tras el cual la interfaz de Heym Work solicitará una clave a un Propietario. Una prueba funciona hasta su último día y se reactiva cuando el equipo de Heym la amplía (se admite una prueba por instalación). Heym sigue funcionando con normalidad durante todo el proceso. Las redes aisladas sin acceso a Internet utilizan una licencia fuera de línea disponible a través de enterprise@heym.run.

## Vídeos

Todos los vídeos de Heym Work están recopilados en la [lista de reproducción de Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Temas relacionados

- [Enterprise](./enterprise.md): Licencias comerciales y soporte técnico
- [Single Sign-On](./sso.md): El mecanismo de inicio de sesión que usa Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Las revisiones mostradas en Heym Work
- [Registro de auditoría](./audit.md): Los eventos generados por los cambios en la conexión
- [Ajustes](./user-settings.md): Ubicación de la pestaña de Heym Work
