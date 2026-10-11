# Pestanya Teams

La pestanya **Teams** us permet crear i gestionar equips per compartir workflows, credencials, variables, vector stores i fitxers de Drive amb grups d'usuaris.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

## Crear un equip

1. Feu clic a **New Team**
2. Introduïu un nom i una descripció opcional
3. Feu clic a **Create**

Esdeveniu automàticament el creador de l'equip i el primer membre.

## Gestionar membres

- **Add member** – Introduïu un correu electrònic d'usuari al diàleg de detall de l'equip i feu clic a **Add**
- **Remove member** – Feu clic a la X al costat d'un membre (el creador no es pot eliminar)
- **Edit team** – Els creadors poden editar el nom i la descripció
- **Delete team** – Els creadors poden eliminar l'equip; s'eliminen tots els recursos compartits de l'equip
- **Shared resources** – El diàleg de detall de l'equip mostra workflows, credencials, variables, vector stores, fitxers de Drive, plantilles de workflow i plantilles de node compartits amb l'equip. Feu clic a un workflow per obrir-lo a l'editor; canvieu a la pestanya corresponent per a altres recursos.

## Compartir amb equips

Compartiu recursos amb equips des de:

- **Workflows** – Diàleg de compartició a l'editor de workflows
- **Workflow Templates** – Diàleg de compartició en crear/editar una plantilla de workflow (visibilitat: Specific users)
- **Node Templates** – Diàleg de compartició en crear/editar una plantilla de node (visibilitat: Specific users)
- **Credentials** – Diàleg de compartició a la pestanya Credentials
- **Variables** – Diàleg de compartició a la pestanya Variables
- **Vector Stores** – Diàleg de compartició a la pestanya Vectors
- **Dashboards** – Configuració del dashboard a la pestanya Dashboard (lectura o escriptura)
- **Drive Files** – Diàleg de compartició a la pestanya Drive o operacions `shareWithMyTeams` / `unshareWithMyTeams` del node Drive

Quan compartiu amb un equip, tots els membres de l'equip obtenen accés. Consulteu [Teams](../reference/teams.md) per obtenir més informació.

Quan compartiu un workflow amb un equip, compartiu també les credencials i els sub-workflows dels quals depèn aquest workflow amb el mateix equip. L'accés al workflow per si sol no atorga accés a les credencials ni als workflows fills.

## Integració amb el xat

L'assistent d'IA de la [pestanya Chat](./chat-tab.md) pot llistar els vostres equips. Pregunteu "my teams" per veure a quins equips pertanyeu.

## Relacionat

- [Teams](../reference/teams.md) – Referència de Teams i model de compartició
- [Credentials Sharing](../reference/credentials-sharing.md) – Compartiu credencials amb usuaris i equips
- [Workflow Organization](../reference/workflow-organization.md) – Carpetes i compartició
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de pàgina per a superfícies de dashboard
