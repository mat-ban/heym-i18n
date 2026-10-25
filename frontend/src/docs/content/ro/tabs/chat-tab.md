# Filă Chat

Fila **Chat** oferă o interfață directă de chat cu LLM. Utilizați-o pentru a testa modele, a adresa întrebări, a rula workflow-uri existente sau a crea un workflow nou dintr-o cerere în limbaj natural.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Urmăriți demonstrația Chat</a></p>

## Configurare

1. Selectați o [credential](./credentials-tab.md) (cheie API pentru OpenAI, Google etc.)
2. Alegeți un model din lista derulantă (modelele sunt încărcate din credentiala selectată)
3. Începeți să tastați pentru a trimite mesaje

De asemenea, puteți începe o conversație din caseta de chat de pe [fila Workflows](./workflows-tab.md). Aceasta trimite primul dumneavoastră mesaj și deschide conversația nouă aici, cu răspunsul deja în curs de streaming.

## Funcționalități

- **Context cu variabile globale** – [Variabilele globale](../reference/global-variables.md) sunt disponibile pentru LLM, astfel încât puteți întreba despre valorile stocate sau le puteți referi
- **Context cu șabloane din workspace** – Șabloanele de workflow și de nod partajate în workspace-ul dumneavoastră sunt incluse ca context, astfel încât Chat poate răspunde la întrebări despre șabloanele disponibile
- **Agent de lungă durată** – Chat continuă să lucreze în backend chiar dacă browserul este închis, astfel încât puteți reveni de pe alt dispozitiv și continua aceeași conversație
- **Creare de workflow-uri** – Cereți Chat să creeze sau să configureze un workflow, iar acesta folosește același motor Workflow AI Builder ca asistentul din editor pentru a genera și salva workflow-ul
- **Creare de sarcini Kanban** – Cereți în limbaj natural să adăugați o sarcină sau să creați un card. Chat îl adaugă în prima coloană a board-ului solicitat; când aveți mai multe board-uri și nu numiți niciunul, Chat prezintă un selector de board înainte de a crea cardul
- **Mesaje ulterioare în coadă** – Trimiteți mai multe mesaje în timp ce un răspuns este în streaming. Mesajele din coadă sunt persistate, pot fi editate sau șterse înainte de a începe și rulează în ordine după răspunsul activ
- **Pauze de planificare** – Când Chat are nevoie de detalii de planificare, adresează întrebări de clarificare și suspendă mesajele ulterioare din coadă până când răspundeți. După ce răspunsul de planificare se încheie, mesajele din coadă se reiau
- **Credentiale** – Când un workflow creat sau editat de Chat necesită o credentială, Chat întreabă pe care să o folosească, oferă să creeze una nouă în conversație sau vă lasă să continuați fără. De asemenea, puteți cere Chat să creeze o credentială sau să actualizeze una pe care o dețineți; acesta deschide formularul de credentială în conversație. Modelul vede numele și tipul credentialei, niciodată valorile acesteia. Consultați [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Tabele de date** – Când un workflow creat sau editat de Chat stochează înregistrări, Chat întreabă ce [tabel de date](./datatable-tab.md) să folosească sau oferă să creeze unul cu coloanele de care are nevoie workflow-ul. De asemenea, poate lista tabelele dumneavoastră și coloanele acestora. Nu citește și nu scrie niciodată rânduri. Consultați [AI Assistant › Data tables](../reference/ai-assistant.md#data-tables)
- **Răspunsuri în streaming** – Vedeți ieșirea modelului pe măsură ce este transmisă în streaming
- **Oprire răspuns** – Întrerupeți răspunsul curent în streaming în orice moment; oprirea elimină și mesajele din coadă pentru acea conversație
- **Randare Markdown** – Răspunsurile acceptă formatare markdown, inclusiv imagini inline
- **Afișare imagini** – Imaginile incluse în răspunsuri (de ex. din generarea de imagini LLM) apar inline; faceți clic pe orice imagine pentru a o vizualiza pe tot ecranul. Apăsați **Esc** sau butonul de revenire (mobil) pentru a închide vizualizarea pe tot ecranul
- **Copiere mesaje** – Copiați orice mesaj în clipboard
- **Golire chat** – Începeți o conversație nouă
- **Introducere vocală** – Folosiți butonul de microfon pentru conversie vorbire-în-text (acceptată de browser). Când înregistrarea se oprește, Heym poate curăța ușor transcrierea înainte de a o trimite
- **Workflow-uri programate** – Întrebați când rulează workflow-urile cron (astăzi, săptămâna aceasta, luna aceasta sau un interval de date personalizat). Asistentul folosește aceleași date de programare ca fila [Scheduled](./scheduled-tab.md) și poate limita rezultatele la workflow-urile pe care le dețineți sau le poate include pe cele partajate cu dumneavoastră
- **Istoric de rulare a workflow-urilor** – Întrebați despre un workflow ("de câte ori a rulat raportul zilnic?", "a eșuat?", "când a rulat ultima dată?"). Chat caută workflow-ul după ID-ul său și răspunde pe baza numărului de rulări, defalcării pe stări, orei primei și ultimei rulări și duratei medii. Întrebați de ce a eșuat o rulare sau ce a returnat, iar Chat deschide acea singură rulare pentru a citi intrările, ieșirile și erorile pe nod
- **Stare de rulare în timp real** – Întrebați ce rulează chiar acum, iar Chat răspunde cu numărul, numele workflow-urilor, de cât timp rulează fiecare, pe ce nod se află și un link direct către rularea live
## Utilizarea Chat-ului dintr-un client MCP

Motorul Chat poate fi accesat și din afara browserului. Activați **Heym Chat Tool** în [filamentul MCP](./mcp-tab.md), iar clienții MCP — Claude, Cursor și orice altceva care vorbește MCP — primesc un singur instrument `heym_chat` care rulează același motor cu toate capacitățile sale.

Acele conversații ajung în istoricul acestui filament, marcate cu o pictogramă de ștecher în lista de conversații. Deschideți una pentru a citi ce a solicitat clientul, pentru a vedea cardurile de instrumente declanșate și pentru a continua firul dumneavoastră. Răspunsul la o întrebare de clarificare funcționează la fel, indiferent dacă tura a început aici sau dintr-un client MCP.

Prin MCP, Chat nu listează, nu selectează și nu creează credențiale. Workflow-urile pe care le construiește lasă câmpurile de credențiale goale, iar răspunsul numește nodurile care necesită o credențială, astfel încât să le puteți configura în editor.

Tabelele de date funcționează și prin MCP: Chat listează tabelele dumneavoastră, creează altele noi și le conectează în workflow-urile pe care le construiește. Întrebarea sa despre tabel ajunge ca text în rezultat, așa că răspundeți la ea cu același `conversation_id`.

## Limita de context

Chat-ul păstrează până la 25 de mesaje recente în context. Mesajele mai vechi sunt eliminate pentru a rămâne în limitele modelului.

## Crearea de workflow-uri

Când îi cereți Chat-ului să creeze, să construiască, să genereze sau să configureze un workflow, acesta creează un workflow nou salvat, cu un nume și o descriere generate. Răspunsul include o previzualizare read-only pe canvas a nodurilor și muchiilor generate, plus un link **Open workflow** care deschide editorul de workflow într-un tab nou de browser. Utilizați butonul **Run** al cardului de previzualizare atunci când doriți să executați workflow-ul.

Feedback-ul ulterior în același chat editează acel workflow în loc să creeze altul. De exemplu, după ce Chat creează un workflow, puteți spune „adaugă un pas de aprobare”, „schimbă formatul de ieșire” sau „şöyle yap”, iar Chat actualizează workflow-ul salvat și reîmprospătează previzualizarea.

Acest lucru este cel mai potrivit pentru solicitări în care doriți ca munca să fie realizată ca automatizare reutilizabilă, nu doar ca un răspuns unic.

## Crearea de sarcini Kanban

Adresați-vă Chat-ului în limbaj obișnuit, de exemplu „Adaugă o sarcină numită Fix login bug” sau
„Creează un card nou Update documentation pe board-ul Launch.” Puteți include o
descriere în aceeași solicitare. Chat creează întotdeauna cardul în prima coloană a board-ului
selectat.

Dacă spațiul dumneavoastră de lucru are mai multe board-uri și nu identificați unul, Chat se oprește cu un
selector de board cu alegere unică. Selectați un board pentru a finaliza crearea cardului. Nu este necesară
nicio comandă slash sau format special de mesaj.

## Întrebări despre ce rulează

Întrebați în limbaj obișnuit — „ce rulează?”, „câte workflow-uri sunt active chiar acum?”,
„la ce nod se află raportul nocturn?” — iar Chat raportează imaginea în timp real:

- **Câte** execuții sunt în curs, împărțite în rulare și în așteptare pentru revizuire umană
- **Căror workflow-uri** aparțin, după nume
- **De cât timp** rulează fiecare (de exemplu `1m 35s`, `3h 25m`)
- **Ce nod** se execută chiar acum, după eticheta sa de pe canvas, plus ultimul nod care s-a finalizat
- **Un link** către fiecare rulare activă, care deschide canvas-ul cu acea execuție reluată

Rulările întrerupte pentru o revizuire [Human-in-the-Loop](../reference/human-in-the-loop.md) sau Codex sunt raportate ca
în așteptare pentru dumneavoastră, nu ca în rulare. Acestea sunt aceleași date ca insigna de rulări active din antet,
astfel încât Chat și insigna nu sunt niciodată în dezacord. Pentru rulările care s-au încheiat deja, întrebați despre execuții recente
în schimb — aceasta citește [Execution History](../reference/execution-history.md).

## Întrebări despre o rulare

Selectați o rulare de Workflow în [Execution History](../reference/execution-history.md#ask-ai), din editor sau din All History, și faceți clic pe **Întrebați AI** de lângă titlul dialogului. Chat deschide o conversație nouă cu două chip-uri deasupra casetei de mesaj:

- **Workflow:** numele Workflow-ului
- **Execution:** primele caractere ale id-ului rulării selectate

Eliminați un chip cu **×** pentru a-l exclude. Apoi puneți întrebarea, de exemplu „de ce a durat atât de mult această rulare?”, „ce a eșuat aici?” sau „puteți remedia?”. Chip-urile rămase se atașează la acel mesaj cu id-urile complete, astfel încât Chat citește direct intrările, ieșirile și trasa pe noduri a rulării, în loc să caute Workflow-ul. Pentru a remedia Workflow-ul, Chat salvează, testează și verifică modificarea, așa cum este descris în [Crearea de workflow-uri](#crearea-de-workflow-uri).

Mesajul trimis afișează chip-urile sub întrebarea dvs. Ele aparțin doar acelui mesaj; întrebările următoare din aceeași conversație păstrează contextul din istoric.

## Întrebări despre alerte

Chat poate răspunde la întrebări despre [alertele](./alerts-tab.md) pe care le-ați definit:

- **Ce există** — „ce alerte am?”, „există o alertă pe workflow-ul de facturare?”,
  „care alerte se declanșează chiar acum?”
- **Cum este configurată una** — „care este pragul pentru alerta de cost?”, „cum este configurată?”
- **De ce și când s-a declanșat** — „de ce s-a declanșat alerta de cost?”, „când s-a declanșat ultima dată?”

Pentru o întrebare de tip „de ce s-a declanșat”, Chat citește înregistrarea declanșării și citează valoarea
observată reală, pragul și fereastra exactă care a fost evaluată, plus detaliile contribuitoare:
id-urile execuțiilor eșuate și mesajele de eroare pentru alertele de eroare, cheltuiala per model pentru alertele de cost sau
defalcarea pe sursă de trigger pentru alertele de număr de execuții. Raportează ceea ce era adevărat când alerta
s-a declanșat, în loc să recalculeze fereastra, deoarece fereastra a trecut și un calcul nou
poate da un răspuns diferit.

## Reguli de utilizator

[Regulile de utilizator](../reference/user-settings.md) (configurate în Settings) sunt injectate automat în fiecare conversație Chat ca instrucțiuni la nivel de sistem. Configurați-le o dată pentru a aplica preferințe persistente tuturor solicitărilor de chat.
## Asociat

- [Fila MCP](./mcp-tab.md) – Expuneți acest motor clienților MCP ca instrumentul `heym_chat`
- [Setări](../reference/user-settings.md) – Configurați Regulile de Utilizator aplicate tuturor solicitărilor de chat
- [Fila Credențiale](./credentials-tab.md) – Adăugați și gestionați chei API
- [Fila Variabile](./global-variables-tab.md) – Variabile globale disponibile pentru Chat
- [Tipuri de Noduri](../reference/node-types.md) – Noduri LLM și Agent pentru workflow-uri
- [Nod Agent](../nodes/agent-node.md) – Agent AI cu apelare de instrumente
- [Asistent AI](../reference/ai-assistant.md) – Asistent pentru editor bazat pe același DSL de construire a workflow-urilor
- [Istoric Execuții](../reference/execution-history.md) – Vizualizați execuțiile anterioare (butonul Istoric din antet)
- [Fila Programate](./scheduled-tab.md) – Calendar al execuțiilor cron viitoare (aceleași date pe care Chat le poate rezuma)
- [Fila Alerte](./alerts-tab.md) – Alerte de prag pe care Chat le poate lista și explica
- [Prezentare Contextuală](../reference/contextual-showcase.md) – Orientare compactă în aplicație pentru această pagină
- [Voce Chat (TTS & STT)](../reference/chat-voice.md) – Citiți mesajele cu voce tare și vorbiți hands-free cu ElevenLabs

## Apeluri de instrumente și dimensiunea contextului

De fiecare dată când asistentul invocă un instrument (rulează un workflow, listează execuții, construiește un workflow nou), apare un card pliabil în conversație. Cardul se extinde automat în timp ce instrumentul rulează, afișând argumentele exacte. Când instrumentul se termină, cardul se pliază la un rezumat de o singură linie cu timpul scurs. Faceți clic pe orice card pentru a re-extinde argumentele și rezumatul răspunsului.

Un mic indicator inelar sub câmpul de introducere afișează utilizarea curentă a contextului ca procent din fereastra modelului (de ex. `12% · ~9.2k`). Treceți cu cursorul peste indicator pentru a vedea o defalcare: prompt de sistem, AGENTS.md, blocul de workflow-uri, reguli de utilizator, istoric și textul introdus. Când utilizarea depășește 80%, inelul devine chihlimbar; la 95% devine roșu.

Dacă utilizarea se apropie de limită, Heym comprimă automat mesajele mai vechi într-un rezumat scurt folosind același mecanism pe care îl utilizează nodurile agent. Un card „Context comprimat" apare inline pentru a arăta ce s-a întâmplat.
