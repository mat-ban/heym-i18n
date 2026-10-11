# Inici de sessió únic

Heym pot autenticar persones contra qualsevol proveïdor extern **OpenID Connect**. Un administrador introdueix una URL d'emissor a **Configuració → SSO**, i Heym llegeix la resta d'endpoints del document de descobriment d'aquest proveïdor.

Cap proveïdor està codificat de manera fixa. Keycloak, Okta, Entra ID, Auth0, Google i qualsevol altre proveïdor OIDC es connecten a través dels mateixos camps, perquè l'única cosa que se li indica a Heym és l'emissor.

L'inici de sessió amb contrasenya i l'SSO funcionen en paral·lel. L'inici de sessió amb contrasenya es pot desactivar un cop l'SSO estigui verificat.

## Abans de començar

La configuració d'SSO és a nivell d'instància, de manera que només els administradors de la instància poden modificar-la. Els administradors es designen mitjançant una variable d'entorn, no s'emmagatzemen a la base de dades:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Un valor buit no atorga accés a ningú. Reinicieu el backend després de modificar-lo. Els comptes d'aquesta llista també veuen la pestanya **SSO** a Configuració, i conserven l'accés amb contrasenya fins i tot quan l'inici de sessió amb contrasenya està desactivat — consulteu [Desactivar l'inici de sessió amb contrasenya](#desactivar-linici-de-sessió-amb-contrasenya).

## Registrar Heym al vostre proveïdor

Al vostre proveïdor d'identitat, creeu un **client confidencial** (també anomenat registre d'aplicació) amb:

| Configuració | Valor |
|---------|-------|
| Protocol | OpenID Connect |
| Tipus de concessió | Authorization Code amb PKCE |
| Autenticació del client | Activada — Heym utilitza un secret de client |
| URI de redirecció | El valor exacte que es mostra a la pestanya SSO de Heym |
| Àmbits | `openid email profile` |

Heym calcula l'URI de redirecció a partir de `FRONTEND_URL` i el mostra en mode només lectura al formulari de configuració amb un botó de còpia. Sempre acaba en `/api/auth/sso/callback`. Copieu-lo en lloc d'escriure'l — un URI de redirecció que no coincideix és la causa més habitual de fallada en la configuració, i els proveïdors el rebutgen sense explicació.

El vostre proveïdor ha de retornar una adreça electrònica verificada. Consulteu [Assignació de comptes](#assignació-de-comptes).

## Configurar Heym

Obriu **Configuració → SSO**. La pestanya només apareix per als comptes de `HEYM_ADMIN_EMAILS`.

| Camp | Què fa |
|-------|--------------|
| **Activa l'inici de sessió únic** | Mostra el botó d'inici de sessió a la pantalla d'accés. |
| **URL de l'emissor** | L'URL base del proveïdor, per exemple `https://idp.example.com/realms/your-realm`. Heym hi afegeix `/.well-known/openid-configuration` i llegeix la resta des d'allà. |
| **ID de client** | L'identificador de client del vostre proveïdor. |
| **Secret de client** | S'emmagatzema xifrat. Deixeu el camp buit per conservar el valor emmagatzemat — Heym mai retorna un secret que tingui. |
| **URI de redirecció** | Només lectura. Copieu-lo a la llista permesa del vostre proveïdor. |
| **Àmbits** | `openid email profile` per defecte. |
| **Etiqueta del botó d'inici de sessió** | El text del botó de la pantalla d'accés, per exemple "Inicia sessió amb Okta". |
| **Crea un compte en el primer inici de sessió** | Si les persones desconegudes obtenen automàticament un compte de Heym. |
| **Dominis de correu permesos** | Separats per comes. En blanc permet qualsevol domini que el proveïdor autentiqui. |
| **Desactiva l'inici de sessió amb contrasenya** | Desactiva l'autenticació amb contrasenya a tota la instància. |

### Proveu primer la connexió

**Prova la connexió** obté el document de descobriment i les claus de signatura del proveïdor, i després informa de l'endpoint de token que ha trobat. Podeu executar-la sobre un emissor que hàgiu escrit però encara no hàgiu desat, de manera que una URL incorrecta costa un clic en lloc d'un desament.

Una prova només *registra* un resultat satisfactori quan l'emissor provat és el que ja està emmagatzemat. Una prova d'esborrany us indica si la URL es resol; no autoritza una configuració que no està desada. Canviar l'emissor, l'ID de client, els àmbits o el secret esborra el resultat registrat pel mateix motiu.

## Com funciona l'inici de sessió

1. Algú fa clic al botó d'inici de sessió de la pantalla d'accés.
2. Heym el redirigeix al proveïdor amb un `state`, un `nonce` i un repte PKCE.
3. S'autentica amb el proveïdor.
4. El proveïdor redirigeix de tornada al callback de Heym amb un codi d'autorització.
5. Heym intercanvia el codi per tokens i verifica l'ID token contra les claus publicades del proveïdor, comprovant la signatura, l'audiència, l'emissor, la caducitat i el nonce.
6. Heym resol el compte i emet la seva pròpia sessió, exactament igual que ho fa un inici de sessió amb contrasenya.

Tot el que hi ha després del pas 6 roman inalterat: les mateixes galetes de sessió, les mateixes durades dels tokens, els mateixos permisos.

## Assignació de comptes

Heym resol un compte en aquest ordre:

1. **`(issuer, subject)`** — la identitat que el proveïdor va afirmar en un inici de sessió anterior. Aquesta és autoritativa i sobreviu a un canvi d'adreça electrònica al proveïdor.
2. **Adreça electrònica verificada** — es reclama un compte de Heym existent amb aquesta adreça, i el subject del proveïdor s'hi registra a partir d'aleshores.
3. **Un compte nou** — es crea si **Crea un compte en el primer inici de sessió** està activat i el domini està permès.

Una adreça electrònica compta com a verificada només quan l'ID token porta `email_verified: true`. Si aquesta afirmació és `false` o no hi és, es rebutja l'inici de sessió. Reclamar un compte existent — o crear-ne un de nou — basant-se en una adreça que el proveïdor no avala és una via d'apropiació de compte, de manera que Heym no ho fa. Un proveïdor que mai emet `email_verified` s'ha de configurar perquè ho faci.

Els comptes creats d'aquesta manera no tenen contrasenya. Inicien sessió únicament a través del proveïdor.
## Desactivació de l'inici de sessió amb contrasenya

L'interruptor **Desactiva l'inici de sessió amb contrasenya** roman no disponible fins que es compleixen tres condicions:

1. L'SSO està activat.
2. Una prova de connexió ha estat superada, de manera que un emissor incorrecte no pot tancar la porta darrere seu.
3. Almenys un compte de `HEYM_ADMIN_EMAILS` té realment una contrasenya.

Quan està activat, l'autenticació amb contrasenya es rebutja a les tres superfícies que n'emeten o n'accepten una: el formulari d'inici de sessió, el **registre** i la pàgina de consentiment OAuth de l'MCP. El registre compta perquè emet una contrasenya; deixar-lo obert faria que qualsevol que pogués arribar a `/register` pogués eludir la configuració.

Els comptes llistats a `HEYM_ADMIN_EMAILS` estan exempts de les tres. Qui pot editar el fitxer d'entorn ja pot recuperar la instància, de manera que aquesta garantia viu al codi en lloc de la memòria d'un operador.

### Per què existeix la tercera condició

Un administrador el compte Heym del qual es va crear *a través* de l'SSO no té cap contrasenya. L'exempció els deixaria passar la porta, però no tenen res amb què iniciar sessió — de manera que la instància no tindria cap manera de tornar si el proveïdor caigués. Heym es nega a entrar en aquest estat i ho diu.

Si us trobeu amb aquest missatge, inicieu sessió a través de l'SSO i registreu un compte amb contrasenya en una de les vostres adreces d'administrador (el registre encara està obert a les adreces d'administrador exactament per aquest motiu), o afegiu una adreça que ja tingui una contrasenya a `HEYM_ADMIN_EMAILS`.

### Recuperació quan el proveïdor està caigut

Per ordre de preferència:

1. **Inicieu sessió amb una contrasenya d'administrador de emergència.** La pantalla d'inici de sessió amaga el formulari de contrasenya quan l'inici de sessió amb contrasenya està desactivat, de manera que feu clic a **Inicia sessió amb una contrasenya** a sota del botó de l'SSO per mostrar-lo. El formulari no és una elusió: cada adreça fora de `HEYM_ADMIN_EMAILS` encara es rebutja, i se li diu per què.
2. **Afegiu-vos a `HEYM_ADMIN_EMAILS`** al fitxer d'entorn i reinicieu el backend. Un compte que ja tingui una contrasenya podrà iniciar sessió.
3. **Torneu a obrir l'inici de sessió amb contrasenya directament a la base de dades**, si cap administrador té cap contrasenya:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   No cal reiniciar; la configuració es llegeix per petició.

Els usuaris finals del Portal no es veuen afectats. S'autentiquen contra un directori separat — vegeu [Portal](./portal.md).

## Errors d'inici de sessió

Un inici de sessió fallit torna a la pantalla d'inici de sessió amb un missatge llegible. Heym mai mostra el text d'error en brut del proveïdor.

| Missatge | Causa |
|---------|-------|
| That sign-in attempt expired | L'intent ha trigat més de deu minuts, o el navegador ha descartat la cookie de transacció. Torneu-ho a provar. |
| Could not reach the identity provider | La descoberta o l'intercanvi de token han fallat. Comproveu l'URL de l'emissor i que el proveïdor sigui accessible des del backend. |
| The provider's response could not be verified | L'ID token ha fallat la validació de signatura, audiència, emissor, caducitat o nonce. Normalment és un desajustament de l'ID de client. |
| The provider did not return an email address | Falta l'àmbit `email`, o el proveïdor no publica la declaració. |
| Your email address is not verified | El proveïdor ha enviat `email_verified: false`, o ha omès la declaració. |
| Your email domain is not allowed | L'adreça és fora dels **Dominis de correu permesos**. |
| No Heym account exists for you | **Crea un compte en el primer inici de sessió** està desactivat i cap compte coincideix. Un administrador n'ha de crear un. |
| Single sign-on is not configured | L'SSO està desactivat, o falta l'emissor, l'ID de client o el secret. |

## Notes de seguretat

- **El secret del client està xifrat en repòs** i cap endpoint el retorna mai. El formulari de configuració només informa si n'hi ha un d'emmagatzemat.
- **El verificador PKCE mai surt de Heym.** Es manté en una cookie `HttpOnly` de curta durada en lloc del paràmetre `state`, que fa la volta a través del proveïdor a la vista de tothom.
- **Només s'accepten signatures asimètriques.** Els algorismes `none` i simètrics es rebutgen independentment del que anunciï el proveïdor.
- **La destinació posterior a l'inici de sessió es valida** com una ruta del mateix origen, de manera que el callback no es pot utilitzar com una redirecció oberta.
- **Cada inici de sessió s'audita.** Els èxits, els fracassos i les denegacions apareixen com a línies `auth.sso_login`, i els canvis de configuració com a `sso_settings.update` — vegeu [Audit Logging](./audit.md).

## Què no és compatible

- **SAML.** OIDC és l'únic protocol.
- **Múltiples proveïdors simultanis.** Una instància es connecta a un proveïdor.
- **Mapatge de grups o rols** a partir de les declaracions del proveïdor.
- **Tancament de sessió únic.** Tancar la sessió de Heym no us tanca la sessió del proveïdor.
