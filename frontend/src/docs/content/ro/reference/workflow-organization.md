# Organizarea Workflow-urilor

Heym vă permite să organizați workflow-urile în foldere, să creați sub-foldere și să programați workflow-uri pentru ștergere. Consultați [Workflows Tab](../tabs/workflows-tab.md) pentru prezentarea generală a interfeței.

## Foldere și sub-foldere

Folderele formează o structură arborescentă. Fiecare folder are:

- **Name** – Numele afișat
- **Parent** – `parent_id` face legătura către un alt folder; `null` înseamnă rădăcină
- **Workflows** – Workflow-urile pot fi mutate în foldere prin `folder_id`

### API

| Endpoint | Scop |
|----------|---------|
| `GET /folders` | Doar folderele rădăcină |
| `GET /folders/tree` | Arborele complet (copii + workflow-uri) |
| `GET /folders/{id}` | Un singur folder cu conținutul său |
| `POST /folders` | Creează un folder (`parent_id` opțional) |
| `PUT /folders/{id}` | Actualizează numele sau `parent_id` |
| `DELETE /folders/{id}` | Șterge folderul (în cascadă) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Mută workflow-ul în folder |
| `DELETE /folders/workflows/{workflow_id}/folder` | Elimină workflow-ul din folder |
| `GET /folders/{id}/export` | Descarcă folderul + toate sub-folderele ca ZIP |

### Structura arborescentă

Răspunsul pentru arbore include `children` și `workflows` pentru fiecare folder. Workflow-urile partajate pot apărea într-un folder prin `WorkflowShare.folder_id`.

## Partajarea workflow-urilor

Deschideți **Share** în editorul de workflow pentru a invita utilizatori prin email sau pentru a partaja cu o [echipă](./teams.md). Fiecare invitație și fiecare partajare către o echipă are o permisiune:

| Permisiune | Ce poate face colaboratorul |
|------------|------------------------------|
| **Read** | Deschide workflow-ul, îl inspectează, vizualizează istoricul execuțiilor și îl rulează. Editorul se deschide în modul read-only: Save este dezactivat, iar canvas-ul nu poate fi modificat. |
| **Write** | Tot ce permite Read, plus editarea canvas-ului, a setărilor, a documentului de analiză și a memoriei agentului. |

Permisiunea este afișată lângă fiecare intrare din dialogul Share și poate fi modificată oricând din acel dropdown, fără a elimina și a adăuga din nou partajarea. Când un utilizator ajunge la un workflow pe mai multe căi (o partajare directă și una sau mai multe echipe), câștigă permisiunea **cea mai înaltă**. Partajările care existau înainte de introducerea permisiunilor sunt **Write**, iar clienții API care omit `permission` primesc de asemenea **Write**.

Acțiunile rezervate proprietarului nu depind niciodată de permisiune: ștergerea unui workflow, revenirea la versiuni anterioare sau golirea versiunilor, golirea istoricului, gestionarea partajărilor și [setările rezervate proprietarului](#setări-rezervate-proprietarului) de mai jos rămân la proprietar chiar și pentru colaboratorii cu **Write**. Un colaborator cu **Read** care trimite o modificare prin API (`PUT /api/workflows/{id}`, nota de analiză, memoria agentului, golirea cache-ului) sau prin AI Assistant primește `403` cu `You have read-only access to this workflow`.

Partajarea unui workflow acordă acces la canvas, la istoricul execuțiilor și la documentul de analiză. Aceasta **nu** partajează automat:

- **Acreditările** referite de nodurile din workflow
- **Sub-workflow-urile** apelate de nodurile [Execute](../nodes/execute-node.md) sau de agenți

Destinatarii trebuie să primească acele acreditări și workflow-uri copil partajate separat (aceiași utilizatori sau echipe). Partajați acreditările din [Credentials tab](../tabs/credentials-tab.md); consultați [Credentials Sharing](./credentials-sharing.md). Partajați fiecare sub-workflow din propriul dialog de partajare al editorului său.

### Setări rezervate proprietarului

Întreaga configurare **Run with cURL** rămâne la proprietar după partajare. Colaboratorii pot deschide în continuare dialogul și pot copia comanda generată, dar controalele sunt read-only.

Modificarea oricăreia dintre acestea de către un non-proprietar este respinsă cu `403`:

- **Authentication** (`auth_type`) și **Header Key** (`auth_header_key`)
- Modul **Request Body** (`webhook_body_mode`) și **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) și **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) se comportă diferit: este complet ascuns de colaboratori, iar scrierea unui colaborator este ignorată, nu respinsă. Editorul afișează câmpul mascat, astfel încât un `403` acolo ar întrerupe o salvare obișnuită în loc să semnaleze un atac.

Autentificarea este motivul pentru care blocul este rezervat proprietarului: `Anonymous` permite apelanților neautentificați să ruleze workflow-ul, iar o rulare fără un apelant autentificat rezolvă acreditările și variabilele globale ca fiind ale **proprietarului**, nu ale apelantului. Restul blocului reprezintă contractul de cerere publicat și controalele de cost ale proprietarului, așa că se mută împreună cu acesta.

**On error, run workflow** (`error_workflow_id`) din panoul **Properties** la nivel de workflow este rezervat proprietarului din același motiv: [error workflow](./features.md#error-workflow) rulează cu acreditările și variabilele globale ale rulării eșuate, care sunt ale proprietarului pentru rulările declanșate și anonime. Colaboratorii văd setarea ca read-only, iar adăugarea, înlocuirea sau golirea acesteia de către un non-proprietar este respinsă cu `403`.

Editarea canvas-ului, a numelui și a descrierii nu este afectată.

### Token-uri de execuție

Un colaborator poate genera un token de execuție pentru un workflow partajat cu el. Rularea este atribuită **celui care a generat token-ul**, astfel încât folosește acreditările și variabilele globale ale acelui utilizator, nu ale proprietarului. Doar un apel cu adevărat anonim — `auth_type: anonymous` fără apelant — rulează în contextul proprietarului.

## Programate pentru ștergere

Workflow-urile pot fi programate pentru ștergere în loc să fie eliminate imediat.

- **Câmp**: `scheduled_for_deletion` (datetime care acceptă null)
- **Comportament**: Când este setat, workflow-ul se mută la `folder_id = null` și apare în secțiunea "Scheduled for Deletion".
### API

| Endpoint | Scop |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Setează `scheduled_for_deletion`, golește `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Golește `scheduled_for_deletion` (restaurare) |

### UI

- **Trageți în coșul de gunoi** – Plasați workflow-urile în zona "Programate pentru ștergere" pentru a le programa
- **Restaurare** – Eliminați din programare
- **Ștergere imediată** – Pictograma coșului de gunoi pentru eliminare permanentă

### Logica de curățare

Un cron job rulează zilnic la **23:59** (fus orar configurat). Un workflow este șters doar când:

- **Toate nodurile de intrare** (noduri fără muchii de intrare, excluzând sticky/errorHandler) au `active === false`

Dacă orice nod de intrare este încă activ, workflow-ul rămâne până la următoarea rulare.

## Dashboard UI

- **Rânduri de foldere** – Folder nou, arbore recursiv de foldere cu expandare/colapsare. Fiecare folder
  are o descriere opțională sub numele său și un badge care numără workflow-urile pe care le conține,
  inclusiv sub-folderele.
- **Acțiuni pentru foldere** – Subfolder nou, Redenumire, Schimbare pictogramă, Descărcare ca ZIP și Ștergere
  sunt afișate inline pe fiecare rând de folder; meniul contextual cu clic dreapta oferă același set, iar
  telefoanele afișează un singur buton de meniu.
- **Zona principală** – Workflow-uri rădăcină (fără folder, nescheduled) și Programate pentru ștergere
- **Previzualizare plasare folder** – Tragerea unui workflow evidențiază folderul sau sub-folderul exact și
  afișează calea sa completă într-o previzualizare de dimensiunea unui card. Un folder colapsat se expandează după o scurtă plasare de cursor.
- **Feedback stabil la tragere** – Cardul sursă folosește o umbră de tragere, iar ținta de plasare activă rămâne
  selectată în timpul derulării sau la traversarea controalelor din același folder.
- **Verificare destinație** – Folderul curent este afișat ca **Deja în folder** și nu acceptă
  o mutare redundantă.
- **Alte zone de plasare** – Rădăcina și "Programate pentru ștergere" se evidențiază când pot accepta
  workflow-ul tras.
- **Plasare ZIP** – Plasați un fișier ZIP în zona de workflow-uri pentru a importa o structură de foldere la nivel de rădăcină

## Resurse conexe

- [Fila Workflow-uri](../tabs/workflows-tab.md) – Creați și gestionați workflow-uri
- [Partajarea acreditărilor](./credentials-sharing.md) – Partajați acreditările cu colaboratorii workflow-ului
- [Echipe](./teams.md) – Partajați workflow-uri și acreditări cu echipele
- [Concepte de bază](../getting-started/core-concepts.md) – Workflow-uri, noduri și execuție
- [Structura workflow-ului](./workflow-structure.md) – Format JSON pentru workflow-uri
- [Triggers](./triggers.md) – Noduri de intrare și puncte de acces
