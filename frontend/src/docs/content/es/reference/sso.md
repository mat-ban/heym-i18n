# Single Sign-On

Heym puede autenticar a las personas contra cualquier proveedor externo de **OpenID Connect**. Un administrador introduce una URL de emisor en **Settings → SSO**, y Heym lee el resto de endpoints desde el documento de descubrimiento de dicho proveedor.

Ningún proveedor está codificado de forma fija. Keycloak, Okta, Entra ID, Auth0, Google y cualquier otro proveedor OIDC se conectan a través de los mismos campos, porque lo único que se le indica a Heym es el emisor.

El inicio de sesión con contraseña y el SSO funcionan en paralelo. El inicio de sesión con contraseña puede desactivarse una vez verificado el SSO.

## Antes de empezar

La configuración de SSO es global para toda la instancia, por lo que solo los administradores de la instancia pueden modificarla. Los administradores se designan mediante una variable de entorno, no se almacenan en la base de datos:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Un valor vacío no otorga acceso a nadie. Reinicie el backend tras modificarlo. Las cuentas incluidas en esta lista también ven la pestaña **SSO** en Settings, y conservan el acceso por contraseña incluso cuando el inicio de sesión con contraseña está desactivado — consulte [Desactivar el inicio de sesión con contraseña](#disabling-password-sign-in).

## Registrar Heym en su proveedor

En su proveedor de identidad, cree un **cliente confidencial** (también denominado registro de aplicación) con:

| Ajuste | Valor |
|---------|-------|
| Protocolo | OpenID Connect |
| Tipo de concesión | Authorization Code con PKCE |
| Autenticación del cliente | Activada — Heym utiliza un secreto de cliente |
| URI de redirección | El valor exacto que se muestra en la pestaña SSO de Heym |
| Scopes | `openid email profile` |

Heym calcula el URI de redirección a partir de `FRONTEND_URL` y lo muestra en modo solo lectura en el formulario de configuración con un botón de copia. Siempre termina en `/api/auth/sso/callback`. Cópielo en lugar de escribirlo — un URI de redirección que no coincida es el fallo de configuración más habitual, y los proveedores lo rechazan sin explicación.

Su proveedor debe devolver una dirección de correo electrónico verificada. Consulte [Asignación de cuentas](#account-mapping).

## Configurar Heym

Abra **Settings → SSO**. La pestaña solo aparece para las cuentas incluidas en `HEYM_ADMIN_EMAILS`.

| Campo | Qué hace |
|-------|--------------|
| **Enable single sign-on** | Muestra el botón de inicio de sesión en la pantalla de login. |
| **Issuer URL** | La URL base del proveedor, por ejemplo `https://idp.example.com/realms/your-realm`. Heym añade `/.well-known/openid-configuration` y lee el resto desde ahí. |
| **Client ID** | El identificador de cliente de su proveedor. |
| **Client secret** | Se almacena cifrado. Deje el campo en blanco para conservar el valor almacenado — Heym nunca devuelve un secreto que posee. |
| **Redirect URI** | Solo lectura. Copie este valor en la lista de permitidos de su proveedor. |
| **Scopes** | `openid email profile` por defecto. |
| **Sign-in button label** | El texto del botón en la pantalla de login, por ejemplo "Sign in with Okta". |
| **Create an account on first sign-in** | Si las personas desconocidas obtienen automáticamente una cuenta de Heym. |
| **Allowed email domains** | Separados por comas. En blanco permite cualquier dominio que el proveedor autentique. |
| **Disable password sign-in** | Desactiva la autenticación por contraseña en toda la instancia. |

### Probar primero la conexión

**Test connection** obtiene el documento de descubrimiento y las claves de firma del proveedor, y a continuación informa del endpoint de token que ha encontrado. Puede ejecutarlo sobre un emisor que haya escrito pero aún no haya guardado, de modo que una URL incorrecta cuesta un clic en lugar de un guardado.

Una prueba solo *registra* un resultado satisfactorio cuando el emisor probado es el que ya está almacenado. Una prueba en borrador indica si la URL resuelve; no autoriza una configuración que no está guardada. Cambiar el emisor, el client ID, los scopes o el secreto borra el resultado registrado por el mismo motivo.

## Cómo funciona el inicio de sesión

1. Alguien hace clic en el botón de inicio de sesión en la pantalla de login.
2. Heym lo redirige al proveedor con un `state`, un `nonce` y un desafío PKCE.
3. Se autentica con el proveedor.
4. El proveedor redirige de vuelta al callback de Heym con un código de autorización.
5. Heym canjea el código por tokens y verifica el ID token contra las claves publicadas por el proveedor, comprobando la firma, la audiencia, el emisor, la caducidad y el nonce.
6. Heym resuelve la cuenta y emite su propia sesión, exactamente igual que hace un inicio de sesión con contraseña.

Todo lo que ocurre después del paso 6 permanece inalterado: las mismas cookies de sesión, los mismos tiempos de vida de token, los mismos permisos.

## Asignación de cuentas

Heym resuelve una cuenta en este orden:

1. **`(issuer, subject)`** — la identidad que el proveedor afirmó en un inicio de sesión anterior. Es autoritativa y sobrevive a un cambio de correo electrónico en el proveedor.
2. **Correo electrónico verificado** — se reclama una cuenta de Heym existente con esa dirección, y el subject del proveedor queda registrado en ella a partir de entonces.
3. **Una cuenta nueva** — creada si **Create an account on first sign-in** está activado y el dominio está permitido.

Un correo electrónico cuenta como verificado solo cuando el ID token incluye `email_verified: true`. Si esa afirmación es `false` o no está presente, se rechaza el inicio de sesión. Reclamar una cuenta existente — o crear una nueva — amparándose en una dirección que el proveedor no avala constituye una vía de apropiación de cuentas, por lo que Heym no lo hace. Un proveedor que nunca emite `email_verified` debe configurarse para hacerlo.

Las cuentas creadas de este modo no tienen contraseña. Inician sesión únicamente a través del proveedor.

## Deshabilitar el inicio de sesión con contraseña

El interruptor **Disable password sign-in** permanece no disponible hasta que se cumplan tres condiciones:

1. El SSO está habilitado.
2. Se ha superado una prueba de conexión, de modo que un emisor incorrecto no pueda cerrar la puerta tras de sí.
3. Al menos una cuenta en `HEYM_ADMIN_EMAILS` tiene realmente una contraseña.

Cuando está activado, la autenticación por contraseña se rechaza en las tres superficies que emiten o aceptan una: el formulario de inicio de sesión, el **registro** y la página de consentimiento de OAuth del MCP. El registro cuenta porque emite una contraseña; dejarlo abierto permitiría eludir la configuración a cualquiera que pueda acceder a `/register`.

Las cuentas incluidas en `HEYM_ADMIN_EMAILS` están exentas de las tres. Quien pueda editar el archivo de entorno ya puede recuperar la instancia, por lo que esta garantía reside en el código y no en la memoria de un operador.

### Por qué existe la tercera condición

Un administrador cuya cuenta de Heym se creó *a través de* SSO no tiene contraseña alguna. La exención le permitiría cruzar la puerta, pero no tendría con qué iniciar sesión, por lo que la instancia no tendría forma de recuperarse si el proveedor dejara de estar disponible. Heym se niega a entrar en ese estado y lo indica.

Si se encuentra con ese mensaje, inicie sesión a través de SSO y registre una cuenta con contraseña en una de sus direcciones de administrador (el registro sigue abierto para direcciones de administrador precisamente por este motivo), o añada a `HEYM_ADMIN_EMAILS` una dirección que ya tenga una contraseña.

### Recuperación cuando el proveedor no está disponible

Por orden de preferencia:

1. **Inicie sesión con una contraseña de administrador de emergencia.** La pantalla de inicio de sesión oculta el formulario de contraseña cuando el inicio de sesión con contraseña está desactivado, así que haga clic en **Sign in with a password instead** debajo del botón de SSO para mostrarlo. El formulario no es una vía de elusión: toda dirección fuera de `HEYM_ADMIN_EMAILS` sigue siendo rechazada, y se le indica el motivo.
2. **Añádase a `HEYM_ADMIN_EMAILS`** en el archivo de entorno y reinicie el backend. Una cuenta que ya tenga una contraseña podrá entonces iniciar sesión.
3. **Vuelva a habilitar el inicio de sesión con contraseña directamente en la base de datos**, si ningún administrador tiene contraseña:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   No es necesario reiniciar; la configuración se lee en cada petición.

Los usuarios finales del Portal no se ven afectados. Se autentican contra un directorio independiente; consulte [Portal](./portal.md).

## Errores de inicio de sesión

Un inicio de sesión fallido devuelve a la pantalla de inicio de sesión con un mensaje legible. Heym nunca muestra el texto de error sin procesar del proveedor.

| Mensaje | Causa |
|---------|-------|
| That sign-in attempt expired | El intento tardó más de diez minutos, o el navegador descartó la cookie de transacción. Inténtelo de nuevo. |
| Could not reach the identity provider | Falló el descubrimiento o el intercambio de token. Compruebe la URL del emisor y que el proveedor sea accesible desde el backend. |
| The provider's response could not be verified | El ID token no superó la validación de firma, audiencia, emisor, caducidad o nonce. Normalmente, un desajuste del client ID. |
| The provider did not return an email address | Falta el scope `email`, o el proveedor no libera la claim. |
| Your email address is not verified | El proveedor envió `email_verified: false`, u omitió la claim. |
| Your email domain is not allowed | La dirección está fuera de **Allowed email domains**. |
| No Heym account exists for you | **Create an account on first sign-in** está desactivado y ninguna cuenta coincide. Un administrador debe crear una. |
| Single sign-on is not configured | El SSO está deshabilitado, o faltan el emisor, el client ID o el secreto. |

## Notas de seguridad

- **El client secret está cifrado en reposo** y ningún endpoint lo devuelve. El formulario de configuración solo indica si hay uno almacenado.
- **El verificador de PKCE nunca sale de Heym.** Se mantiene en una cookie `HttpOnly` de corta duración en lugar de en el parámetro `state`, que viaja de ida y vuelta a través del proveedor a la vista de todos.
- **Solo se aceptan firmas asimétricas.** Se rechazan `none` y los algoritmos simétricos, independientemente de lo que anuncie el proveedor.
- **El destino posterior al inicio de sesión se valida** como una ruta del mismo origen, por lo que el callback no puede utilizarse como redirección abierta.
- **Cada inicio de sesión se audita.** Los éxitos, los fallos y los rechazos aparecen como líneas `auth.sso_login`, y los cambios de configuración como `sso_settings.update`; consulte [Audit Logging](./audit.md).

## Qué no es compatible

- **SAML.** OIDC es el único protocolo.
- **Múltiples proveedores simultáneos.** Una instancia se conecta a un solo proveedor.
- **Mapeo de grupos o roles** a partir de las claims del proveedor.
- **Cierre de sesión único.** Cerrar sesión en Heym no cierra la sesión en el proveedor.
