# Pestanya Drive

La pestanya Drive mostra tots els fitxers generats per les skills als vostres workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Watch Drive demo</a></p>

## Visió general

Els fitxers generats per les skills (PDF, DOCX, CSV, imatges, etc.) s'emmagatzemen i es llisten automàticament a la pestanya Drive. Cada fitxer mostra el seu nom, tipus, mida, Node d'origen, data de creació i estat de compartició amb equips.

## Funcionalitats

- **Cerca** - Filtreu fitxers per nom, tipus o Node d'origen
- **Copia l'ID del fitxer** - Copieu l'UUID del fitxer al porta-retalls, a punt per enganxar-lo en un Node [Drive](../nodes/drive-node.md) o [Converter](../nodes/converter-node.md)
- **Descàrrega** - Descàrrega autenticada per als vostres fitxers i els fitxers compartits amb vosaltres mitjançant equips
- **Compartició** - Creeu enllaços de descàrrega compartibles amb protecció per contrasenya i caducitat opcionals, o compartiu un fitxer en mode només lectura amb els vostres equips actuals
- **Eliminació** - Elimineu fitxers i els seus enllaços de compartició
- **Esborra-ho tot** - Elimineu tots els fitxers i els seus enllaços de compartició després de confirmar-ho
- **Accions massives** - Seleccioneu diversos fitxers amb caselles de selecció (Maj+clic per a un interval) i apliqueu la mateixa acció a tots alhora
- **Paginació** - Navegueu per col·leccions grans de fitxers, amb un selector de files per pàgina (25 / 50 / 100 / Tots)

## Accions massives

Els fitxers que posseïu mostren una casella de selecció a l'inici de la seva fila (els fitxers compartits amb vosaltres mitjançant un equip són de només lectura i no es poden seleccionar). Seleccioneu diverses files — o utilitzeu la casella de selecció de la capçalera per seleccionar tota la pàgina, i **Maj+clic** per seleccionar un interval — i després utilitzeu la barra d'accions massives que apareix a sobre de la llista:

- **Download ZIP** empaqueta tots els fitxers seleccionats en un únic arxiu ZIP i el descarrega
- **Accions massives** obre un únic diàleg per aplicar una configuració a tots els fitxers seleccionats:
  - **Comparteix-ho tot amb els meus equips** / **Elimina la compartició amb equips** amb un sol clic
  - **Crea un enllaç de compartició per a cada fitxer** utilitzant la mateixa contrasenya, caducitat i configuració de descàrregues màximes
- **Eliminació** elimina tots els fitxers seleccionats i els seus enllaços de compartició després d'una confirmació
- **Esborra la selecció** desselecciona-ho tot

El diàleg informa a quants fitxers s'ha aplicat (els fitxers que no posseïu s'ometen). Utilitzeu l'opció **Tots** del selector de files per pàgina per carregar tots els fitxers en una sola pàgina i seleccionar a tot el vostre Drive. Escriure al quadre de cerca canvia automàticament el selector de files per pàgina a **Tots** perquè la cerca cobreixi tots els fitxers, no només la pàgina actual; esborrar la cerca restaura la selecció anterior.

## Compartició

Creeu enllaços de compartició amb:
- **Sense autenticació** - URL de descàrrega pública basada en token
- **Basic Auth** - Enllaç protegit per contrasenya (nom d'usuari: `file`)
- **Caducitat** - Caducitat opcional basada en temps
- **Límits de descàrrega** - Nombre màxim de descàrregues opcional

Activeu **Comparteix amb els meus equips** en un fitxer per fer-lo visible a tots els equips als quals pertanyeu actualment. Els membres de l'equip amb qui es comparteix obtenen accés de només lectura; les accions de gestió queden reservades al propietari.

## Accés de les Skills de l'Agent

Les skills del Node Agent poden optar per llegir fitxers del Drive. Quan **Enable Drive files** està activat per a una skill, el seu codi Python pot llegir fitxers accessibles del Drive per ID de fitxer o nom de fitxer exacte mitjançant l'ajudant generat `heym_drive.py`. La configuració està desactivada per defecte.

Consulteu la [referència de Drive](../reference/drive.md) per a tots els detalls.

## Relacionat

- [Node Drive](../nodes/drive-node.md) - Llisteu fitxers, recupereu metadades, compartiu amb equips o canvieu les restriccions de compartició des d'un workflow
- [Generació de fitxers](../reference/file-generation.md) - Com les skills generen fitxers
- [Referència de Drive](../reference/drive.md) - Enllaços de compartició, tokens i neteja
- [Portal](../reference/portal.md) - Enllaços de fitxers a les respostes del xat del portal
