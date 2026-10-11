# Filă Teams

Fila **Teams** vă permite să creați și să gestionați echipe pentru partajarea workflow-urilor, a acreditărilor, a variabilelor, a vector store-urilor și a fișierelor Drive cu grupuri de utilizatori.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Urmăriți demonstrația Teams</a></p>

## Crearea unei echipe

1. Faceți clic pe **New Team**
2. Introduceți un nume și o descriere opțională
3. Faceți clic pe **Create**

Deveniți automat creatorul echipei și primul membru.

## Gestionarea membrilor

- **Adăugare membru** – Introduceți un email de utilizator în dialogul de detalii al echipei și faceți clic pe **Add**
- **Eliminare membru** – Faceți clic pe X-ul de lângă un membru (creatorul nu poate fi eliminat)
- **Editare echipă** – Creatorii pot edita numele și descrierea
- **Ștergere echipă** – Creatorii pot șterge echipa; toate partajările echipei sunt eliminate
- **Resurse partajate** – Dialogul de detalii al echipei afișează workflow-urile, acreditările, variabilele, vector store-urile, fișierele Drive, șabloanele de workflow și șabloanele de nod partajate cu echipa. Faceți clic pe un workflow pentru a-l deschide în editor; comutați la fila relevantă pentru alte resurse.

## Partajarea cu echipe

Partajați resurse cu echipe din:

- **Workflows** – Dialogul de partajare din editorul de workflow
- **Workflow Templates** – Dialogul de partajare la crearea/editarea unui șablon de workflow (vizibilitate: Specific users)
- **Node Templates** – Dialogul de partajare la crearea/editarea unui șablon de nod (vizibilitate: Specific users)
- **Credentials** – Dialogul de partajare din fila Credentials
- **Variables** – Dialogul de partajare din fila Variables
- **Vector Stores** – Dialogul de partajare din fila Vectors
- **Dashboards** – Setările dashboard-ului din fila Dashboard (citire sau scriere)
- **Drive Files** – Dialogul de partajare din fila Drive sau operațiunile nodului Drive `shareWithMyTeams` / `unshareWithMyTeams`

Când partajați cu o echipă, toți membrii echipei obțin acces. Consultați [Teams](../reference/teams.md) pentru detalii.

Când partajați un workflow cu o echipă, partajați de asemenea acreditările și sub-workflow-urile de care depinde acel workflow cu aceeași echipă. Accesul la workflow singur nu acordă acces la acreditări sau la workflow-urile copil.

## Integrare Chat

Asistentul AI din [fila Chat](./chat-tab.md) poate lista echipele dumneavoastră. Întrebați "my teams" pentru a vedea căror echipe aparțineți.

## Resurse conexe

- [Teams](../reference/teams.md) – Referință Teams și modelul de partajare
- [Credentials Sharing](../reference/credentials-sharing.md) – Partajați acreditări cu utilizatori și echipe
- [Workflow Organization](../reference/workflow-organization.md) – Foldere și partajare
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid compact de pagină pentru suprafețele dashboard-ului
