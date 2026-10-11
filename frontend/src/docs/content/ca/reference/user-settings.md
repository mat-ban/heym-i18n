# Configuració

El diàleg de Configuració us permet gestionar el vostre perfil, establir instruccions persistents per a la IA, actualitzar la contrasenya del compte, configurar la veu del xat, definir la credencial i el model d'IA predeterminats, i revisar l'estat d'observabilitat. Obriu-lo fent clic a **la vostra imatge d'avatar i el vostre nom** a la cantonada superior dreta de la capçalera.

## Obrir el diàleg

Feu clic a **la vostra imatge d'avatar i el vostre nom** a la part superior dreta de la capçalera. El diàleg s'obre amb aquestes pestanyes: **Profile**, **Security**, **Voice**, **AI Defaults** i **Observability**. Els administradors d'instància també veuen una pestanya **SSO**.

## Pestanya Profile

### Imatge de perfil

Heym mostra la vostra imatge de [Gravatar](https://gravatar.com) per al correu electrònic del vostre compte a la capçalera, al costat dels vostres missatges a [Chat](../tabs/chat-tab.md) i **Chat with Heym**, als comentaris de [Board](../tabs/board-tab.md), i al costat del vostre nom als diàlegs de compartició i a les llistes de membres de l'equip. Per canviar-la, actualitzeu la imatge a Gravatar; Heym recollirà la nova imatge en unes hores. Sense una imatge de Gravatar, Heym mostra la primera lletra del vostre nom.

La imatge l'obté el servidor de Heym i s'emmagatzema a la memòria cau, de manera que el vostre navegador mai contacta amb Gravatar. Si el servidor no pot accedir a Gravatar, tothom continua veient les inicials.

### Nom

El vostre nom visible a tota l'aplicació. Aquest camp és obligatori i no es pot deixar buit.

### User Rules

Les User Rules són instruccions personalitzades que s'injecten automàticament a cada sol·licitud d'IA, tant al constructor de workflows com al xat del tauler. Al **constructor de workflows** ([AI Assistant](./ai-assistant.md)), s'afegeixen al system prompt utilitzat per generar el JSON del workflow. Al **xat del tauler**, s'apliquen com a context a nivell de sistema. Les escriviu una vegada i s'apliquen globalment sense repetir-les a cada prompt.

**Usos habituals:**

- Idioma o to: `Always respond in English. Keep responses concise.`
- Estil de codificació: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Convencions de workflow: `Include error handling in all workflows. Use descriptive node labels.`
- Format de resposta: `Use bullet points. Avoid lengthy explanations.`

**On s'apliquen:**

| Context | Descripció |
|---------|-------------|
| **Constructor de workflows** | Sol·licituds de [AI Assistant](./ai-assistant.md) per generar o modificar workflows |
| **Xat del tauler** | Totes les converses de la [pestanya Chat](../tabs/chat-tab.md) |

Les User Rules s'injecten a nivell de sistema: s'executen abans de cada prompt automàticament, sense cap configuració addicional per workflow o conversa.

### Desar els canvis del perfil

Feu clic a **Save Changes** per aplicar-los. Els canvis tenen efecte immediatament per a totes les sol·licituds d'IA noves.

## Pestanya Security

### Canviar la contrasenya

Utilitzeu la pestanya Security per actualitzar la contrasenya del vostre compte.

**Requisits:**

| Regla | Requisit |
|------|-------------|
| Longitud mínima | 8 caràcters |
| Majúscules | Almenys una lletra majúscula (A–Z) |
| Minúscules | Almenys una lletra minúscula (a–z) |
| Dígit | Almenys un número (0–9) |

La contrasenya també ha de ser diferent de la contrasenya actual. Aquestes regles s'apliquen tant al frontend com al backend.

**Passos:**

1. Introduïu la vostra **Current Password**
2. Introduïu la vostra **New Password** (ha de complir tots els requisits anteriors)
3. Torneu-la a introduir a **Confirm New Password**
4. Feu clic a **Update Password**

Si la contrasenya actual és incorrecta, es mostra un missatge d'error en línia. Si té èxit, apareix un missatge de confirmació i el formulari es reinicia automàticament.

## Pestanya Voice

La pestanya Voice configura la veu parlada per a la [pestanya Chat](../tabs/chat-tab.md): trieu una **credencial d'ElevenLabs** (o afegiu-ne una en línia), escolliu una **Voice** del vostre compte d'ElevenLabs i feu clic a **Save Voice Settings**. Això habilita la lectura en veu alta per missatge i el mode de veu interactiu. Consulteu [Chat Voice (TTS & STT)](./chat-voice.md) per al flux complet.

## Pestanya AI Defaults

La pestanya AI Defaults té dues seccions.

### Credencial i model preferits

Trieu una **credencial LLM preferida** i un **model** d'aquesta. Aquesta es converteix en el valor predeterminat inicial per a totes les funcions d'IA de l'aplicació — el xat, l'[AI Assistant](./ai-assistant.md) (constructor, analitzador i creació de workflows), el mapador de taulers, els ginys d'IA del tauler, el [xat de docs](../tabs/chat-tab.md), l'ajudant d'esquema d'IA de la taula de dades, el constructor d'expressions i les avaluacions — sempre que aquesta superfície no tingui una selecció pròpia desada.

La regla de selecció que segueix cada superfície és:

1. **Selecció desada** — una elecció que ja heu fet en aquesta superfície (per exemple, l'últim model d'una conversa de xat) sempre té prioritat.
2. **Preferida** — s'utilitza quan no hi ha cap selecció desada.
3. **Primera credencial disponible** — el valor de reserva quan no heu establert cap preferència.

Podeu canviar la credencial i el model per superfície en qualsevol moment; la preferència només omple el valor predeterminat inicial. Deixeu la credencial com a **No preference** per mantenir el comportament anterior de primera credencial. Si la vostra credencial preferida se suprimeix o es deixa de compartir més endavant, la pestanya mostra un avís i les superfícies tornen silenciosament a la primera credencial disponible.
### Ús del paquet de codificació

Per a cada credencial de **Codex** (incloent-hi les compartides), la pestanya mostra l'ús restant del límit de velocitat com una barra horitzontal per finestra activa — per exemple, una finestra de **5 hores** i/o una finestra **Setmanal**, segons el vostre pla. Cada barra mostra el percentatge de quota restant i una compte enrere de restabliment. Un botó **Refresh** torna a obtenir les dades sota demanda (els resultats es memoritzen breument al servidor).

Per a cada credencial d'**OpenCode**, la pestanya mostra les finestres de subscripció d'OpenCode Go — **5 hores**, **Setmanal** i **Mensual** — amb el mateix estil de barra, llegides des de l'endpoint d'ús autenticat de la passarel·la amb la clau API d'aquesta credencial. Una finestra que ha arribat al seu límit es mostra com a **"limit reached"** en color ambre. Si la clau no és vàlida o l'espai de treball no té subscripció Go, la targeta indica el motiu en lloc de mostrar barres.

## Pestanya Observability

La pestanya Observability mostra l'estat de només lectura de [OpenTelemetry Tracing](./opentelemetry.md) per a aquesta instància: si el traçat està habilitat, l'endpoint OTLP, el nom del servei, la ràtio del mostrejador i quins spans s'emeten. El traçat es configura mitjançant les variables d'entorn `HEYM_OTEL_*` al backend, de manera que aquesta pestanya no edita res. Quan el traçat està deshabilitat, la pestanya llista les variables d'entorn necessàries per activar-lo. Els secrets com les capçaleres d'autenticació OTLP no es mostren mai aquí. Consulteu [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) per a la referència completa de configuració.

## Pestanya SSO

Visible només per als administradors de la instància — els comptes llistats a `HEYM_ADMIN_EMAILS`. Aquesta pestanya connecta Heym a un proveïdor OpenID Connect extern perquè les persones iniciïn sessió amb els comptes que ja tenen. Introduïu una URL d'emissor i les credencials del client, copieu l'URI de redirecció de només lectura al vostre proveïdor i executeu **Test connection** abans d'habilitar-lo. L'inici de sessió amb contrasenya es pot desactivar des d'aquí un cop superada la prova. Consulteu [Single Sign-On](./sso.md) per a la configuració completa.

## Pestanya Instances

Visible només per als administradors de la instància — els comptes llistats a `HEYM_ADMIN_EMAILS`. Aquesta pestanya llista les instàncies de Heym connectades a aquesta base de dades i estableix com es reparteixen les execucions en segon pla entre elles. Cada fila mostra el nom editable de la instància, el seu rol, si està activa, la seva latència mesurada vers la base de dades, un commutador d'encesa/apagada i el seu pes. Els pesos són quotes de les instàncies que actualment poden assumir feina, no percentatges sobre 100: amb `41 / 26 / 33` i la tercera instància apagada, les dues primeres reben realment el 61% i el 39%. El panell imprimeix aquest repartiment efectiu sota la taula, i només es nega a desar quan cap instància habilitada té cap pes.

**Give new instances a share automatically** està activat per defecte: una instància que s'incorpora, d'altra manera, quedaria amb pes 0 i no rebria res, de manera que el líder li atorga una quota igual una vegada i escala els pesos existents a la baixa mantenint les seves ràtios. Mai no toca una instància el pes de la qual hàgiu establert vosaltres mateixos.

El panell també informa quantes de les execucions de les últimes 24 hores només es podien executar a la instància principal. Quan aquesta quota és alta, els pesos de sota no poden moure aquesta feina. Consulteu [Load Distribution](./cluster.md) per saber què roman a la instància principal i com triar els números.

## Què no hi ha en aquest diàleg

| Funcionalitat | On trobar-la |
|---------|-----------------|
| **Gestió de claus API (MCP)** | [MCP Tab](../tabs/mcp-tab.md) – visualitzeu, copieu i regenereu la clau API del vostre servidor MCP |
| **Tema (fosc / clar)** | Botó de commutació Sol/Lluna a la capçalera (al costat de la insígnia d'usuari) |
| **Canvi de correu electrònic** | Actualment no compatible |

## Relacionat

- [AI Assistant](./ai-assistant.md) – Xat del constructor de Workflows que utilitza les User Rules
- [Chat Tab](../tabs/chat-tab.md) – Xat del tauler que utilitza les User Rules
- [Chat Voice (TTS & STT)](./chat-voice.md) – Veu d'ElevenLabs configurada a la pestanya Voice
- [MCP Tab](../tabs/mcp-tab.md) – Clau API del servidor MCP i exposició d'eines de workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Claus API per a Nodes d'IA i integracions
- [Security](./security.md) – Gestió de sessions, limitació de velocitat, xifratge de credencials
- [Single Sign-On](./sso.md) – Connecteu un proveïdor OpenID Connect extern
- [OpenTelemetry Tracing](./opentelemetry.md) – Traçat distribuït per a execucions de workflow i de Node
