# Distribuirea încărcării

Îndreptați o a doua instanță Heym către aceeași bază de date PostgreSQL și aceasta se alătură ca worker. Execuțiile de workflow-uri din fundal sunt apoi partajate între instanțe după un procent pe care îl stabiliți, astfel încât mașina care servește UI-ul și API-ul să nu fie și singura mașină care rulează fiecare workflow.

Instanțele nu comunică niciodată între ele. Postgres transportă lucrul, astfel încât un worker nu are nevoie de niciun port deschis, niciun certificat și nicio rută înapoi către instanța principală — doar acces la baza de date.

## Roluri

O instanță este **main**, fixată printr-o variabilă de mediu. Aceasta servește UI-ul, API-ul, MCP și portalul de chat și deține stocarea fișierelor și plugin-urile instalate. Orice altă instanță este un **worker**: ajunge doar la baza de date și execută rulări din fundal.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

Rolul main este separat de alegerea liderului. Heym alege deja un lider în cadrul cluster-ului pentru a deține cron, evaluarea alertelor și recuperarea după blocaje; dacă main cade, conducerea se mută la un worker în câteva secunde, iar rulările programate continuă să se declanșeze. Rolul main nu se mută, deoarece stocarea fișierelor nu poate fi mutată odată cu el.

## Ce poate părăsi instanța principală

Plasarea este decisă pe baza nodurilor workflow-ului înainte de începerea rulării. O rulare rămâne pe main atunci când orice nod din ea — inclusiv nodurile din sub-workflow-urile pe care le apelează — atinge ceva ce există doar pe o singură mașină:

| Nod | De ce rămâne pe main |
|---|---|
| Codex, OpenCode Go | Spațiul de lucru al agentului de codare rămâne pe discul local, astfel încât o continuare să poată relua în el |
| Agent cu o abilitate atașată | Codul abilității citește și scrie în Heym Drive |
| Drive, Converter, Google Drive | Citesc și scriu fișiere generate |
| Trigger File Upload | Încărcarea ajunge pe discul lui main |
| Send Email | Releele SMTP corporative permit de obicei doar o singură adresă sursă |
| Noduri de plugin | Un plugin este instalat pe discul unei singure instanțe |

**Orice altceva este distribuit** — inclusiv nodul Code, Playwright și uneltele Python ale Agentului. Fiecare instanță rulează aceeași imagine cu propriul socket Docker, astfel încât un sandbox nu este un motiv pentru a păstra o rulare pe main, iar acestea sunt nodurile cele mai consumatoare de CPU din produs.

Un workflow al cărui sub-workflow este ales printr-o expresie nu poate fi inspectat în avans, astfel încât rămâne pe main.

## Alegerea procentelor

Ponderile sunt numere întregi stabilite în **Settings → Instances**. Ele sunt **cote din instanțele care pot prelua lucru în acel moment**, nu procente din 100: planificatorul împarte la totalul propriu al acelui grup.

Această distincție apare imediat ce o instanță iese din grup. Cu `Main 41, Worker A 26, Worker B 33`, oprirea Worker B lasă un grup de 67, astfel încât Main primește de fapt 41/67 = **61%**, iar Worker A 26/67 = **39%**. Panoul afișează împărțirea efectivă sub tabel exact din acest motiv, iar salvarea nu este niciodată blocată pentru că numerele nu însumează 100 — este refuzată doar o împărțire în care nicio instanță activată nu are o pondere.

Încă două lucruri sunt ușor de greșit.

**Un procent nu este o cotă din puterea mașinii.** Acesta acoperă doar rulările care trec prin coadă. Servirea UI-ului și a API-ului, transmiterea în flux a rulărilor din editor și portal și gestionarea încărcărilor de fișiere sunt toate treaba lui main și niciuna dintre ele nu este contorizată. Main face mai mult decât spune numărul său.

**Procentul lui main este un plafon, nu un minim.** Rulările care pot fi executate doar pe main sunt imputate cotei sale, astfel încât odată ce acea cotă este epuizată, rulările distribuite rămase ajung la workeri. Stabilirea unui număr mic pentru main este sigură — lucrul care trebuie să ruleze acolo tot rulează. Stabilirea lui prea mare înfometează workerii.

Deci, cu un main puternic și un worker mai mic, începeți mai aproape de 60/40 decât de raportul brut al mașinilor, apoi comparați duratele reale ale rulărilor în fila Traces și ajustați.

Ponderile sunt renormalizate în funcție de instanțele care sunt în prezent active și activate. Cu `main=70, A=15, B=15`, dacă A devine offline, împărțirea devine 70/85 și 15/85 între main și B și revine la 70/15/15 când A revine.

**O instanță care revine nu are dreptul la rulările pe care le-a ratat.** Timpul petrecut Offline, Disabled sau pe o versiune nepotrivită nu este contorizat împotriva ei, astfel încât un worker care petrece o noapte indisponibil se realătură la poziția curentă a grupului, iar împărțirea se citește din nou 70/30 de la prima sa rulare — nu absoarbe fiecare rulare până când și-a recuperat decalajul. Un worker care a fost disponibil tot timpul recuperează totuși, ceea ce face ca procentul lui main să fie un plafon.

### O instanță nouă se alătură de la zero

O instanță căreia nu i s-a atribuit niciodată o pondere începe de la 0, ceea ce ar lăsa-o Live, Enabled și fără să primească nimic. **Give new instances a share automatically** — activat implicit, sub tabelul de instanțe — rezolvă acest lucru: la următoarea trecere a liderului, nou-venitul primește o cotă egală din grup, iar ponderile existente sunt redimensionate în jos păstrându-și raporturile între ele, astfel încât un 70/30 deliberat se citește în continuare ca aproximativ 70/30 după aceea. Totalul rămâne exact 100.

Aceasta rulează **o dată per instanță**. Atât trecerea automată, cât și propria dumneavoastră editare marchează instanța ca fiind configurată, astfel încât o instanță pe care ați setat-o dumneavoastră nu este niciodată modificată pe la spatele dumneavoastră — inclusiv una pe care ați setat-o deliberat la 0. Dezactivați setarea dacă preferați ca fiecare mașină nouă să vă aștepte.

Doar instanțele activate, active și compatibile participă. Acordarea unei cote unei mașini care nu poate executa nimic ar bloca acea cotă.
### Când procentele nu pot ajuta

Panoul de setări raportează câte dintre execuțiile ultimelor 24 de ore au putut rula doar pe main. Dacă acest număr este ridicat — o încărcătură intensivă pentru Codex sau Drive — workerii vor sta degeaba indiferent de ponderi, iar soluția este o instanță main mai mare, nu mai multe instanțe.

## Dimensionarea PostgreSQL pentru un cluster

Conexiunile scalează cu instanțele, nu doar cu utilizatorii. Fiecare instanță rulează mai multe procese uvicorn, iar fiecare proces menține un pool de conexiuni plus patru conexiuni `LISTEN` (anulare, trezirea cozii, rezultatele execuțiilor, fluxurile de chat). Fluxurile de chat deschise partajează singura conexiune de chat, deci nu adaugă conexiuni la baza de date. Un cluster cu trei instanțe pe valoarea implicită `max_connections = 100` epuizează limita, iar Heym nu mai reușește să ajungă la propria bază de date.

Bugetați aproximativ `instances x processes x (async pool + sync pool + 4)` și setați `max_connections` peste această valoare.

Reduceți pool-urile în loc să ridicați doar plafonul. O implementare unică folosește implicit 10+20 conexiuni async și 5+10 conexiuni sync per proces, ceea ce este generos pentru o singură mașină și mult prea mult pentru un cluster:

| Variabilă | Instanță unică | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Fișierul compose exemplu setează aceste valori și `max_connections = 300`. Astfel, un cluster cu două instanțe trece de la un plafon de 768 de conexiuni la 192, iar cu trei instanțe rămâne sub 300.

## Cerințe pe care clusterul nu le poate impune în locul dvs.

**Fiecare instanță trebuie să folosească același `SECRET_KEY` și `ENCRYPTION_KEY`.** Un worker cu un `ENCRYPTION_KEY` diferit nu poate decripta acreditările, iar fiecare execuție care folosește acreditări ar eșua cu o eroare care nu indică nimic util. Heym compară un digest al ambelor chei la fiecare heartbeat, împreună cu versiunea aplicației și revizia bazei de date, și marchează o instanță nepotrivită ca **Mismatch**, astfel încât aceasta să nu primească deloc lucru. Încărcătura revine la main până când remediați situația.

Aceasta definește și ordinea de upgrade. Dacă actualizați mai întâi main, fiecare worker devine incompatibil; lucrul revine la main, iar fiecare worker se realătură pe măsură ce este actualizat. Mai lent, vizibil și reversibil.

**Direcționați ingress-ul doar către instanța main.** Distribuirea round-robin a traficului utilizatorilor către instanțe ar trimite un fișier încărcat către o mașină și descărcarea acestuia către alta. Nimic din cod nu împiedică acest lucru, deoarece un worker rulează aceeași imagine și va răspunde oricărei cereri primite.

**Fiecare instanță are nevoie de `FRONTEND_URL`, setat la aceeași adresă publică.** O execuție care se oprește pentru revizuire umană generează linkul de revizuire pe instanța care a executat-o, nu pe main, iar același lucru este valabil pentru linkurile de continuare Codex și pentru URL-urile de descărcare ale fișierelor generate. Un worker lăsat fără această variabilă construiește acele linkuri către propria adresă locală, iar cine primește unul nu îl poate deschide.

**Instanțele worker au o adresă IP de ieșire diferită.** Orice API care permite doar anumite adrese sursă o va vedea pe cea nouă. Send Email rulează pe main exact din acest motiv; pentru nodul HTTP, fie atribuiți clusterului o singură adresă NAT de egress, fie permiteți toate instanțele.

## Adăugarea unui worker pe altă mașină

`docker-compose.worker.yml` din rădăcina repository-ului rulează un worker pe propriul host. Nu are bază de date și nici UI: ajunge la PostgreSQL-ul instanței main și preia partea sa din execuțiile de fundal.

Completați un `.env` alături de acesta — tag-ul imaginii, host-ul și acreditările bazei de date, ambele chei și un id de instanță — și porniți-l. Compose refuză să pornească până când fiecare valoare obligatorie este setată, în loc să pornească cu un substituent care eșuează mai târziu într-un mod greu de interpretat.

Tag-ul imaginii trebuie să fie versiunea pe care o rulează main, iar ambele chei trebuie copiate exact. Orice diferență la oricare dintre ele arată workerul ca Mismatch și acesta nu primește niciun lucru.

## Citirea tabelului Instances

| Coloană | Semnificație |
|---|---|
| Name | Etichetă editabilă; este aplicată pe fiecare execuție pe care o rulează această instanță |
| Role | `main` sau `worker`, din mediu |
| Status | **Live** cu un heartbeat recent, **Offline** după 30 de secunde de tăcere, **Mismatch** când versiunea, revizia bazei de date sau cheile diferă de cele ale main |
| ms | Dus-întors de la acea instanță la baza de date, măsurat de instanța însăși |
| On | Scoate un worker din rotație fără a-l opri — execuțiile în curs se termină, nu se atribuie altele noi. Blocat pe activat pentru instanța main: lucrul cu fișiere, pluginuri și agenți de cod rulează acolo indiferent de valoarea comutatorului |
| Weight | Ponderea sa din execuțiile distribuibile |

## Istoricul execuțiilor

Fiecare execuție din istoricul execuțiilor indică instanța care a executat-o, iar ambele dialoguri de istoric pot filtra până la o singură instanță. Filtrul se potrivește pe id-ul instanței afișându-i numele, astfel încât redenumirea unei instanțe nu rescrie ceea ce spun execuțiile vechi.

Nimic din toate acestea nu apare într-o instalare cu o singură instanță: câmpurile sunt goale, nu se afișează nicio etichetă și nu se oferă niciun filtru.
## Comportamentul în caz de eșec

**Dacă un worker se oprește în timpul unei execuții**, heartbeat-ul acestuia devine învechit, iar procesul de recuperare existent al leader-ului reia execuția pe o instanță activă. Rândul din coadă pe care acesta îl revendicase este retras separat: odată ce nu mai există nicio execuție activă pentru el și a trecut o perioadă de grație de două minute, leader-ul marchează rândul ca eșuat și trezește pe oricine aștepta rezultatul. Vechimea singură nu este niciodată trigger-ul, astfel încât o execuție legitim de lungă este lăsată în pace; iar rândul este marcat ca eșuat în loc să fie reintrodus în coadă, deoarece recuperarea deține deja reluarea, iar reintroducerea în coadă ar executa același workflow de două ori.

**Dacă main cade**, cron continuă să se declanșeze de pe un worker, iar execuțiile distribuite continuă să ruleze. Execuțiile care necesită main se pun în coadă și așteaptă, și se drenează când acesta revine — dar numai în fereastra de grație pentru declanșări ratate (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, 600 de secunde implicit). Orice este mai vechi este închis ca omis, cu motivul înregistrat, în loc să se redea ore întregi de backlog dintr-o dată.

Interfața UI, API-ul, MCP și editorul sunt indisponibile cât timp main este căzut, deoarece punctele de intrare se află acolo.

## Resurse conexe

- [Rulare și implementare](../getting-started/running-and-deployment.md) – Implementați mai întâi o singură instanță; variabilele de mediu și configurarea cheilor se află acolo
- [Setări](./user-settings.md) – Filamentul Instanțe și cine îl poate vedea
- [Execuții](../tabs/traces-tab.md) – Comparați duratele reale de rulare între instanțe înainte de a modifica împărțirea
- [Securitate](./security.md) – De ce fiecare instanță trebuie să partajeze `SECRET_KEY` și `ENCRYPTION_KEY`
