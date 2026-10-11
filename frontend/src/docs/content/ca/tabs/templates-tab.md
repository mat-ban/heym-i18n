# Pestanya Plantilles

La pestanya Plantilles us permet desar, explorar i reutilitzar Workflows complets i Nodes individuals. Compartiu allò que heu creat una vegada i apliqueu-ho a projectes nous amb un sol clic.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Vegeu la demostració de Plantilles</a></p>

## Visió general

Hi ha dos tipus de plantilles:

- **Plantilles de Workflow** — deseu un Workflow complet (tots els Nodes i connexions) com a punt de partida reutilitzable.
- **Plantilles de Node** — deseu un sol Node configurat (per exemple, un Node LLM ajustat o un Node HTTP personalitzat) per reutilitzar-lo en diferents Workflows.

Canvieu entre els dos tipus mitjançant el commutador **Workflows / Nodes** a la part superior de la pestanya.

Utilitzeu la barra de cerca per filtrar les plantilles visibles per nom, descripció, etiquetes o tipus de Node.

---

## Crear una plantilla

### Plantilla de Workflow

1. Obriu el Workflow que voleu compartir a l'editor.
2. Feu clic a **Compartir com a plantilla** a la barra d'eines superior.
3. Ompliu el nom, la descripció i les etiquetes opcionals.
4. Trieu la visibilitat: **Tothom** (tots els usuaris) o **Usuaris específics** (introduïu noms d'usuari i/o seleccioneu equips).
5. Feu clic a **Compartir**. Una notificació verda confirma l'èxit.

### Plantilla de Node

1. Feu clic dret a qualsevol Node del llenç.
2. Seleccioneu **Compartir com a plantilla** al menú contextual.
3. Ompliu el formulari i feu clic a **Compartir**.

---

## Utilitzar una plantilla

### Plantilla de Workflow

1. Obriu la pestanya **Plantilles** i assegureu-vos que **Workflows** està seleccionat.
2. Feu clic a una targeta per previsualitzar-la, o feu clic directament a **Utilitzar**.
3. El Workflow es clona en un Workflow nou que s'obre a l'editor.

### Plantilla de Node

1. Obriu la pestanya **Plantilles** i seleccioneu **Nodes**.
2. Feu clic a **Utilitzar** a la targeta d'una plantilla de Node.
3. Apareix un diàleg — trieu on afegir el Node:
   - **Workflow nou** — crea un Workflow nou que conté només aquest Node.
   - **Workflow existent** — trieu de la vostra llista de Workflows; el Node s'insereix automàticament quan s'obre l'editor.

---

## Previsualització

Feu clic a qualsevol targeta de plantilla per obrir una previsualització completa:

- **Miniatures de les targetes** — les targetes de plantilla mostren una instantània ajustada del llenç en mode només lectura, tant per a Workflows com per a plantilles d'un sol Node.
- **Plantilles de Workflow** — un llenç de només lectura que coincideix amb l'estil de previsualització de l'historial d'edicions, incloent-hi el desplaçament i el zoom.
- **Plantilles de Node** — el Node desat s'obre al mateix llenç de només lectura com a previsualització d'un sol Node.
- **Detalls del Node** — feu clic a qualsevol Node de la previsualització per inspeccionar la seva configuració desada al panell lateral.
- Les etiquetes, el recompte d'usos i el **propietari** es mostren per a totes les plantilles.

Premeu **ESC** o feu clic fora per tancar la previsualització.

---

## Gestionar plantilles

- **Editar** – Si sou el propietari de la plantilla, passeu el cursor per sobre de la targeta i feu clic a la icona del llapis per actualitzar-ne el nom, la descripció, les etiquetes o la visibilitat
- **Eliminar** – Si sou el propietari de la plantilla, passeu el cursor per sobre de la targeta i elimineu la plantilla després del missatge de confirmació
- **Accions exclusives del propietari** – Els controls d'edició i eliminació només es mostren per a les plantilles que heu creat

---

## Paleta d'ordres (CTRL+K)

Les plantilles (tant de Workflow com de Node) es poden cercar des de la paleta d'ordres **CTRL+K**. Seleccioneu una plantilla per utilitzar-la immediatament — les plantilles de Workflow s'obren a l'editor, les plantilles de Node demanen una destinació.

---

## Plantilles al Xat

Podeu fer preguntes a la IA sobre les vostres plantilles — coneix totes les plantilles del vostre espai de treball.

---

## Visibilitat

| Configuració | Qui la pot veure |
|---|---|
| Tothom | Tots els usuaris de la plataforma |
| Usuaris específics | Els usuaris que llisteu per nom i/o els equips que seleccioneu — tots els membres de l'equip hi obtenen accés |

Quan compartiu amb **Usuaris específics**, podeu afegir tant usuaris individuals (per nom) com equips. Els membres de l'equip veuen la plantilla a la pestanya Plantilles i la poden utilitzar.

---

## Relacionat

- [Equips](../reference/teams.md) – Compartiu plantilles amb equips
- [Funcions del llenç](../reference/canvas-features.md)
- [Estructura del Workflow](../reference/workflow-structure.md)
- [Tipus de Node](../reference/node-types.md)
- [Pestanya de Xat](./chat-tab.md)
- [Aparador contextual](../reference/contextual-showcase.md) – Guia breu de pàgina per a les pestanyes del tauler
