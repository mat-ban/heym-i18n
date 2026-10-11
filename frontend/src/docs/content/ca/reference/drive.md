# Drive

La pestanya Drive ofereix un lloc central per veure, gestionar i compartir tots els fitxers generats per les skills.

## Accés a Drive

Navegueu a la pestanya **Drive** del tauler de control. Tots els fitxers generats per les skills del vostre workflow apareixen aquí, ordenats per data de creació.

## Llista de fitxers

La llista de fitxers mostra:

- **Name** - Nom original del fitxer amb una icona específica del tipus
- **Type** - Tipus MIME del fitxer (p. ex., pdf, csv, docx)
- **Size** - Mida del fitxer en format llegible
- **Source** - L'etiqueta del node que va generar el fitxer
- **Date** - Quan es va crear el fitxer
- **Actions** - Botons de descàrrega, compartició i eliminació

## Accions massives

Cada fitxer del qual sigueu propietari té una casella de selecció a l'inici de la seva fila. Els fitxers compartits amb vosaltres a través d'un equip són de només lectura i no es poden seleccionar. Seleccioneu diversos fitxers (Maj+clic selecciona un interval contigu; la casella de selecció de la capçalera selecciona tota la pàgina) per mostrar la barra d'accions massives a sobre de la llista i, a continuació, feu clic a **Bulk actions** per obrir un diàleg que aplica la mateixa configuració a cada fitxer seleccionat:

- **Share all with my teams** / **Remove team sharing** — activa o desactiva la compartició amb equips per a tots els fitxers seleccionats alhora
- **Create share link for each file** — crea un enllaç de compartició a cada fitxer seleccionat utilitzant els mateixos valors de caducitat, contrasenya i descàrregues màximes

El diàleg informa a quants fitxers s'ha aplicat; els fitxers dels quals no sigueu propietari s'ometen. El selector de files per pàgina (25 / 50 / 100 / **All**) a la part inferior de la llista us permet carregar més fitxers en una pàgina per poder seleccionar a tot el vostre Drive.

## Compartir fitxers

Feu clic a la icona **Share** per obrir el diàleg de compartició. Podeu crear diversos enllaços de compartició per fitxer amb configuracions diferents i, opcionalment, compartir el fitxer amb els vostres equips actuals.

### Enllaç públic (basat en Token)

Creeu un enllaç de compartició sense contrasenya. Qualsevol persona amb l'enllaç pot descarregar el fitxer.

### Enllaç protegit amb contrasenya (Basic Auth)

Establiu una contrasenya en crear la compartició. L'URL de descàrrega utilitza HTTP Basic Authentication - els navegadors sol·licitaran el nom d'usuari (`file`) i la contrasenya quan s'obri l'enllaç.

### Opcions de l'enllaç

- **Expires (hours)** - Opcionalment, establiu un temps de caducitat
- **Max downloads** - Opcionalment, limiteu el nombre de descàrregues
- Tots dos es poden combinar per obtenir el màxim control

### Compartir amb els meus equips

Activeu **Share with my teams** per concedir accés de només lectura a tots els equips als quals pertanyeu actualment. Els membres de l'equip poden veure i descarregar el fitxer des de Drive i utilitzar les operacions de lectura del node Drive, però només el propietari del fitxer pot eliminar-lo, crear o revocar enllaços públics, o canviar la contrasenya, el TTL o els límits de descàrrega.

La configuració és específica de cada fitxer. Si us uniu o creeu un altre equip més endavant, torneu a activar la compartició o executeu l'operació `shareWithMyTeams` del node Drive per afegir aquest equip. Utilitzeu `unshareWithMyTeams` per eliminar les comparticions d'equip del fitxer en un workflow.

### Gestionar comparticions

El diàleg de compartició mostra tots els enllaços de compartició existents amb:
- Recompte actual de descàrregues
- Estat de caducitat
- Si Basic Auth està activat
- Botons de còpia i revocació

## Enllaços de fitxers al Chat i al Portal

Quan una skill genera fitxers durant una execució de workflow a través del xat del Portal o del Quick Drawer, els enllaços de descàrrega apareixen automàticament a la resposta. Els usuaris poden fer clic per descarregar-los directament.

## Emmagatzematge

Els fitxers generats s'emmagatzemen al sistema de fitxers del servidor sota `data/files/`. En desplegaments Docker, això es munta com un volum per a la persistència.

## Gestionar fitxers des de workflows

El [node Drive](../nodes/drive-node.md) us permet gestionar fitxers de Drive programàticament des d'un workflow. Utilitzeu-lo per:

- **List** els vostres fitxers i retornar metadades com el nom del fitxer, el tipus MIME, la mida, l'origen i l'URL de descàrrega
- **Delete** un fitxer després d'haver-lo lliurat a l'usuari
- **Share or unshare with your teams** perquè els membres de l'equip puguin llegir-lo i descarregar-lo només mentre existeixi la compartició d'equip
- **Set a password** a l'enllaç de descàrrega
- **Set a TTL** perquè l'enllaç caduqui després de N hores
- **Set a max downloads** límit

Convertir un fitxer a un altre format és feina del [node Converter](../nodes/converter-node.md), amb `conversion: "fileConvert"`. Llegeix un fitxer de Drive i emmagatzema el resultat convertit com un fitxer nou.

Referencieu el fitxer pel seu ID des de la sortida de la skill: `$agentLabel._generated_files[0].id`

Consulteu la [documentació del node Drive](../nodes/drive-node.md) per als detalls de configuració.

## Llegir fitxers de Drive des de skills

Les skills d'agent poden optar per les lectures de Drive amb la configuració **Enable Drive files** de la targeta de la skill. Quan s'activa, el runtime de la skill inclou un auxiliar generat `heym_drive.py`. El codi de la skill pot importar auxiliars com `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` i `list_drive_files`.

Les lectures de Drive es limiten als fitxers accessibles per a l'actor del workflow: fitxers propis i fitxers compartits amb l'actor a través d'equips. Utilitzeu un ID de fitxer per a una cerca exacta, o un nom de fitxer exacte quan l'usuari es refereixi a un fitxer pel seu nom. La cerca per nom de fitxer retorna el fitxer accessible més recent amb aquest nom; `list_drive_files(filename="...")` retorna totes les coincidències.
## Relacionat

- [Node Drive](../nodes/drive-node.md) - Operacions de Workflow (llistar, obtenir, eliminar, contrasenya, TTL, descàrregues màximes, compartició amb l'equip)
- [Pestanya Drive](../tabs/drive-tab.md) - Navegueu pels fitxers al tauler de control
- [Generació de fitxers](./file-generation.md) - Com es produeixen `_generated_files` i les URL de descàrrega

## Neteja
Els tokens de compartició caducats es netegen automàticament cada dia. Els fitxers mateixos persisteixen fins que s'eliminen manualment mitjançant la pestanya Drive. Utilitzeu **Esborra-ho tot** per eliminar tots els fitxers i els seus enllaços de compartició en una sola acció.
