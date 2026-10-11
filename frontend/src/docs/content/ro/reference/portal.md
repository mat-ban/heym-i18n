# Portal

**Portalul** expune workflow-urile Heym ca interfețe publice de tip chat. Utilizatorii finali pot rula workflow-uri printr-un URL fără a se autentifica în Heym.

## Ce face

- **URL public**: `/chat/{slug}` (de ex. `/chat/my-workflow`)
- **Interfață de chat**: Utilizatorii interacționează printr-o interfață de chat (mesaje, câmpuri de intrare, răspunsuri)
- **Autentificare opțională**: Dacă sunt configurați utilizatori de portal, autentificarea este obligatorie; în caz contrar, portalul este public
- **Streaming**: Progres în timp real al nodurilor în timpul execuției (când este activat)
- **Oprirea execuțiilor în curs**: Utilizatorii pot opri o rulare de portal activă din subsolul chat-ului; execuția activă a workflow-ului este anulată și pe server
- **Încărcare de fișiere**: Încărcări opționale de fișiere (text, imagini etc.) pentru fiecare câmp de intrare
- **Predare către revizuire umană**: Rulările de portal pot afișa [linkuri de revizuire HITL](./human-in-the-loop.md) când un agent se oprește pentru aprobare
- **Afișare imagini**: Rezultatele workflow-ului care conțin imagini (de ex. din generarea de imagini LLM sau capturi de ecran Playwright) apar ca miniaturi în chat. Faceți clic pe orice imagine pentru a o deschide într-un vizualizator pe tot ecranul; apăsați **Esc** sau utilizați butonul de revenire al dispozitivului pentru a închide

## Configurarea workflow-ului

| Setare | Descriere |
|---------|-------------|
| `portal_enabled` | Activează portalul pentru acest workflow |
| `portal_slug` | Slug-ul URL-ului (de ex. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Utilizează execuția cu streaming |
| `portal_file_upload_enabled` | Permite încărcarea de fișiere |
| `portal_file_config` | Configurarea fișierelor pe câmp (tipuri, limite) |

Configurați în editor: butonul **Portal** din antetul workflow-ului deschide dialogul de setări al portalului.

## Flux

1. **Info**: `GET /api/portal/{slug}/info` – Returnează metadatele workflow-ului și câmpurile de intrare (fără autentificare)
2. **Autentificare** (dacă este necesară): `POST /api/portal/{slug}/login` – Returnează token-ul de sesiune
3. **Execuție**: `POST /api/portal/{slug}/execute` – Interfața de chat a portalului apelează acest endpoint (sau varianta sa cu streaming, intern, când este activată); utilizatorii finali interacționează prin interfața de chat, nu apelând direct API-ul.
4. **Oprire**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Solicitat când utilizatorul apasă **Stop** în timpul unei rulări active de portal

## HITL în rulările de portal

Dacă un workflow de portal ajunge la un [Nod Agent](../nodes/agent-node.md) cu [Human-in-the-Loop](./human-in-the-loop.md) activat, răspunsul portalului afișează un link de revizuire în loc să apară gol.

- Starea execuției workflow-ului devine `pending`
- Chat-ul portalului afișează URL-ul de revizuire
- Orice noduri conectate la handle-ul de ieșire `review` al agentului pot notifica Slack, e-mail sau alte canale imediat
- Un revizor finalizează decizia la `/review/{token}` fără a se autentifica
- După revizuire, workflow-ul își reia execuția din snapshot-ul stocat

Astfel devine posibilă combinarea fluxurilor publice de chat cu pași privați de aprobare umană.

## Câmpuri de intrare

Câmpurile de intrare provin de la nodurile [Input](../nodes/input-node.md). API-ul extrage nodurile de start de tip `textInput` și `inputFields`-urile acestora. Execuția utilizează același motor ca rulările normale; intrările sunt transmise ca `body.inputs` și `conversation_history` pentru fluxuri cu mai multe turnuri.

## Autentificare și sesiuni

- **WorkflowPortalUser**: Nume de utilizator/parolă per workflow (când autentificarea este activată)
- **PortalSession**: Token-uri de sesiune cu TTL de 168 de ore
- **Limitarea ratei**: 3 încercări de autentificare eșuate → interdicție de 24h per workflow+IP
- Sesiunile expirate sunt curățate de un job cron

## Interfața de configurare

Filele **WebPortalSettingsDialog**:

1. **General**: Activează portalul, setează slug-ul, copiază URL-ul portalului
2. **Users**: Adaugă/elimină utilizatori de portal (nume de utilizator/parolă)
3. **Options**: Modul streaming, încărcare de fișiere, vizualizare câmpuri de intrare

## Resurse conexe

- [Why Heym](../getting-started/why-heym.md) – Portalul ca suprafață de chat pentru agenți în producție
- [Workflows Tab](../tabs/workflows-tab.md) – Creați workflow-uri și activați portalul
- [Human-in-the-Loop](./human-in-the-loop.md) – Pagini publice de revizuire pentru rezultatele agenților în așteptare
- [Triggers](./triggers.md) – Portalul ca punct de intrare
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md) pentru intrările de portal
- [Workflow Structure](./workflow-structure.md) – Noduri și muchii
