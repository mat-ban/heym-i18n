# Heym Incident Playbook (L0)

Utilizați acest playbook pentru a confirma un incident Heym, a evalua impactul asupra utilizatorilor, a alege severitatea și a ajunge la procedura de recuperare și la responsabilul corespunzător.

Proceduri detaliate: [Heym Runbook (L1)](./operations-runbook.md)

Ultima revizuire: 2026-11-10. Domeniu de aplicare: Heym găzduit local (self-hosted), instanță unică sau cluster, pe Docker Compose sau Kubernetes.

## Predarea implementării (Deployment handover)

Completați acest tabel pentru fiecare mediu înainte de a utiliza aceste documente în timpul serviciului de gardă (on-call). Numele, URL-urile, obiectivele de capacitate și obiectivele de recuperare sunt specifice fiecărei implementări. Exemplele din depozit nu constituie un inventar de producție.

| Element | Valoare implementare |
| --- | --- |
| Mediu și URL public Heym | `<environment>`, `<public-url>` |
| Gardă platformă și înlocuitor | `<rotation-or-contact>`, `<backup-contact>` |
| Canalul incidentului și sistemul de urmărire a incidentelor | `<channel>`, `<tracker-url>` |
| Gardă bază de date și identificator bază de date | `<contact>`, `<database-id>` |
| Responsabili infrastructură, rețea și stocare | `<contacts>` |
| Responsabil de release și sistem de implementare | `<contact>`, `<deployment-url>` |
| Tablou de bord pentru erori de aplicație, latență și disponibilitate | `<dashboard-url>` |
| Tablou de bord pentru CPU, memorie, disc și reporniri gazdă sau pod | `<dashboard-url>` |
| Tablou de bord pentru conexiuni, blocaje, disc și replicare PostgreSQL | `<dashboard-url>` |
| Jurnale și backend opțional de urmărire OTel | `<logs-url>`, `<trace-url-or-disabled>` |
| Proiect/fișiere Compose sau context/namespace Kubernetes | `<exact-target>` |
| Locațiile instanțelor main, workerilor, bazei de date și stocării | `<services-or-deployments>`, `<storage-ids>` |
| Workflow de test (smoke) aprobat și rezultat așteptat | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Procedură de backup pentru baza de date și fișiere, ultimul test de restaurare | `<procedure-url>`, `<test-date>` |
| Obiective de timp de recuperare (RTO) și punct de recuperare (RPO) | `<RTO>`, `<RPO>` |

Păstrați contactele și legăturile către tablourile de bord în copia operațională cu acces restricționat a implementării. Probele trebuie să conțină ID-uri, marcaje temporale, numărători și erori igienizate în loc de credentials sau payloaduri de workflow.

## Inventarul platformei

| Componentă | Responsabilitate | Implicație în incident |
| --- | --- | --- |
| Frontend și backend principal (main) | UI, API, MCP, Portal, execuție interactivă | Verificați separat ruta publică și procesul principal |
| PostgreSQL | Starea aplicației, registrul de execuții, coada de execuții, sloturile de concurență, coordonarea și notificările | O întrerupere a bazei de date poate opri atât tratarea cererilor, cât și execuția în fundal |
| Instanțele de worker, când modul cluster este activat | Rulări eligibile în fundal aflate în coadă | Workerii sănătoși nu înlocuiesc endpointurile publice ale instanței main |
| Proces lider ales | Cron, evaluarea alertelor, coordonarea în fundal | Un worker compatibil poate deveni lider; acest lucru nu îi schimbă rolul în main |
| Stocarea persistentă a instanței main | Fișiere Drive, pluginuri instalate și spații de lucru ale agenților de cod | Recuperați stocarea odată cu main; rutarea ingressului către un worker nu o recuperează |
| Backend sandbox pe fiecare instanță de execuție | Containere Docker sau poduri Kubernetes pentru execuție izolată | Un backend sandbox defect poate afecta noduri selectate în timp ce UI funcționează |
| Dependențe de workflow | Furnizori de modele, servere MCP, API-uri externe, baze de date și servicii de mesagerie | Determinați dacă eșuează o singură dependență sau întreaga platformă |
| Colector OTel opțional | Spans exportate pentru workflow, noduri și instrumente Agent | Lipsa urmelor exportate singură nu dovedește eșecul unei execuții |

Coada de execuție încorporată Heym utilizează PostgreSQL. Redis, RabbitMQ și depozitele vectoriale pot fi dependențe de workflow; nu sunt servicii obligatorii pentru coada încorporată.

`GET /api/health` raportează exclusiv starea procesului și versiunea. Nu testează PostgreSQL, coada, alegerea liderului, capacitatea sandboxurilor sau sincronizarea de credentials. Un răspuns pozitiv este o singură verificare, nu o garanție de funcționare cap-coadă.

## Primele cinci minute

| Pas | Acțiune | Decizie sau probă |
| --- | --- | --- |
| 1 | Confirmați alerta și verificați mediul, serviciul și ora de începere | Înregistrați marcajele temporale UTC și cea mai recentă modificare de release/configurare |
| 2 | Verificați UI publică și `/api/health`, apoi backendul principal direct | Eșecul public cu un backend direct sănătos indică probleme de rutare sau de frontend |
| 3 | Verificați conectivitatea PostgreSQL și presiunea pe conexiuni | Rutați eșecurile de bază de date către L1 înainte de a reporni serviciile de aplicație |
| 4 | Verificați starea containerelor/podurilor, CPU, memorie, stocare și erorile recente | Separați eșecul de infrastructură, supraîncărcarea și eșecurile specifice de workflow |
| 5 | În modul cluster, verificați **Setări > Instanțe**, stările cozilor și dovezile liderului | Identificați pierderea instanței main, workeri offline/nealiniați sau sarcini destinate doar pentru main |
| 6 | Atribuiți severitatea și inițiați o măsură de atenuare din tabelul de rutare | Pentru P1/P2, deschideți imediat un incident și implicați proprietarul relevant |
| 7 | Verificați rularea unui workflow sigur în mod de producție și urmăriți recuperarea | Confirmați îmbunătățirea vârstei cozii, a erorilor și a resurselor; stabiliți următoarea actualizare |

Dacă un release coincide cu eșecul, inspectați [Implementare defectuoasă sau regresie de configurare](./operations-runbook.md#bad-deployment-or-configuration-regression). Verificați compatibilitatea schemei înainte de rollback.

## Severitate și răspuns

Acestea sunt obiective inițiale de răspuns. Aplicați politica de incidente și impactul asupra afacerii al implementării atunci când sunt mai stricte.

| Severitate | Exemple | Răspuns |
| --- | --- | --- |
| P1 | Instanța main indisponibilă pentru toți utilizatorii; baza de date indisponibilă sau scrierile eșuează; eșec generalizat de execuție; intrări critice indisponibile în toate workflow-urile | Atenuare imediată, dosar de incident, gardă platformă și dependențe |
| P2 | Coadă în creștere; pierdere de capacitate a workerilor; epuizarea conexiunilor este iminentă; un singur workflow degradează capacitatea partajată; erori OOM repetate | Inițiați atenuarea imediat, obiectiv de izolare în 15 minute, dosar de incident |
| P3 | Eșec izolat de workflow sau furnizor; impact limitat cu o capacitate generală sănătoasă a platformei | Responsabil workflow sau componentă, acțiuni urmărite și notă de gardă |
| P4 | Semnal informativ, tendință de capacitate așteptată, alarmă falsă verificată | Luați la cunoștință, documentați și ajustați monitorizarea dacă este necesar |

## Rutarea semnalelor către L1

Utilizați aceste ancore relative la configurarea linkurilor de alertă. Unde un serviciu de monitorizare necesită un URL absolut, adăugați ca prefix locația copiei dumneavoastră operaționale găzduite.

| Semnal | Începeți aici |
| --- | --- |
| UI/API indisponibil, erori publice 5xx, eșec al verificării procesului | [UI sau API indisponibil](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL inaccesibil, conexiune refuzată, eșec de scriere | [Baza de date căzută](./operations-runbook.md#postgresql-down-or-not-writable) |
| Prea mulți clienți, timeout la pool, așteptare după blocaje, vârf de conexiuni active | [Conexiuni și blocaje în baza de date](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Este necesară o repornire controlată a backendului sau workerilor | [Repornirea serviciului](./operations-runbook.md#controlled-service-restart) |
| Vârf în numărul de execuții, durata totală, tokenuri, CPU sau memorie | [Workflow-urile care consumă cele mai multe resurse](./operations-runbook.md#most-resource-consuming-workflows) |
| Coadă în creștere, rulări în așteptare sau blocate | [Restanțe în coadă (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instanță offline sau nealiniată, worker inactiv, problemă de planificare sau distribuție | [Verificări mod cluster](./operations-runbook.md#cluster-mode-checks) |
| Main pierdut în timp ce workerii rămân sănătoși | [Instanța principală indisponibilă](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Erori Webhook, defecțiuni MCP/Portal, deconectări de streaming SSE | [Endpointuri de ingress și execuție](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, disc plin, eșec de volum persistent | [Problemă de container, pod sau stocare](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Erori de furnizor Agent/LLM/MCP, cod 429, eșec de credential | [Eșec de model sau integrare](./operations-runbook.md#model-credential-or-integration-failure) |
| Eșecuri de sandbox pentru Code, Playwright, skill sau agent de cod | [Eșec sandbox](./operations-runbook.md#sandbox-failure) |
| Recuperarea nu poate atinge obiectivele; baza de date sau fișiere pierdute | [Recuperare și răspuns la dezastre](./operations-runbook.md#recovery-and-disaster-response) |

## Escaladare

| Constatare | Implicați | Furnizați |
| --- | --- | --- |
| Multiple interfețe sau workflow-uri afectate | Gardă platformă și lider incident | Mediu, perimetru, oră de începere, atenuare, următoarea actualizare |
| Baza de date indisponibilă, saturată, blocată sau fără spațiu pe disc | Gardă bază de date | ID bază de date, număr de conexiuni, PID-uri blocante, erori igienizate, starea stocării |
| Eșec de pod/nod, atașare stocare, capacitate sandbox | Responsabil infrastructură/stocare | Context, namespace, sarcină de lucru, evenimente pod, presiune pe resurse |
| Ruta publică eșuează în timp ce backendul direct funcționează | Responsabil rețea/ingress | Rute afectate, coduri de stare, latență, comparație cu backendul |
| Un singur workflow domină încărcarea sau eșuează izolat | Proprietar de workflow | ID-uri workflow/rulare, sursă trigger, rată, fereastră de timp, limite temporare |
| Modificare corelată de implementare sau configurare | Responsabil de release | Digest-ul imaginii active, ora implementării, revizia schemei, ultima versiune funcțională |
| Cotă, autentificare sau disponibilitate a furnizorului | Responsabil credential sau integrare | Furnizor, model/serviciu, cod de stare, ID cerere dacă este sigur; fără valori secrete |

Dacă impactul P1/P2 persistă după prima măsură de atenuare, escaladați imediat cu probele deja colectate. Nu așteptați analiza completă a cauzei principale.

## Comportamente așteptate în caz de eșec

| Eșec | Ce poate continua | Prima acțiune |
| --- | --- | --- |
| PostgreSQL indisponibil | Frontendul static se poate încărca în continuare | Restabiliți calea către baza de date; nu reporniți fiecare instanță de aplicație |
| Main indisponibil, workeri sănătoși | Sarcinile eligibile în fundal și planificarea pot continua dacă un worker compatibil conduce | Restabiliți main cu stocarea sa persistentă; UI/API/MCP/Portal publice rămân indisponibile |
| Worker indisponibil | Alte instanțe eligibile preiau sarcinile din coadă pe măsură ce sunt reatribuite | Verificați plasarea, capacitatea de rezervă și recuperarea înainte de a reintroduce trafic |
| Rulare întreruptă | Rulările eligibile recuperabile pot reporni de la început, o singură dată | Verificați recuperarea automată și efectele secundare externe înainte de reluarea manuală |
| Supraîncărcare din sarcini destinate doar pentru main | Workerii pot rămâne inactivi | Reduceți afluxul problematic sau măriți capacitatea main; modificările de ponderi nu mută sarcinile fixate |
| Alertare internă indisponibilă | Monitorizarea externă a disponibilității/bazei/infrastructurii poate continua să funcționeze | Utilizați monitorizare externă pentru Heym; alertele Heym depind de aceeași bază și planificator |
| Sandbox sau furnizor indisponibil | Workflow-urile fără această dependență pot funcționa | Izolați workflow-urile afectate și remediați dependența |

## Recuperare și închiderea incidentului

1. Verificați accesul public, accesul la baza de date, eligibilitatea prevăzută a instanțelor și un workflow de test (smoke) sigur în modul de producție. Un test în editor nu dovedește distribuirea către workeri.
2. Observați cel puțin 10 minute de stabilitate a erorilor, a latenței, a utilizării resurselor și o scădere a vârstei cozii. Observați, de asemenea, următoarea execuție planificată critică așteptată sau o verificare echivalentă convenită.
3. Reconciliați rulările eșuate, recuperate, omise, expirate și în așteptare cu proprietarii de workflow-uri. Verificați efectele secundare externe înainte de a relua orice operațiune.
4. Restabiliți treptat pauzele temporare de triggers, limitele și ponderile workerilor. Atribuiți un responsabil și o dată de expirare fiecărei restricții rămase.
5. Actualizați incidentul cu impactul, cronologia UTC, acțiunile, probele și riscurile restante. Alocați o revizuire a cauzei principale pentru P1/P2 și actualizați ambele documente dacă a lipsit o procedură.

## Referințe operaționale asociate

- [Configurarea comenzilor L1 și verificări](./operations-runbook.md#command-setup)
- [Funcționare și implementare](../getting-started/running-and-deployment.md)
- [Distribuția sarcinii](./cluster.md)
- [Implementare Kubernetes](../getting-started/kubernetes.md)
- [Securitate și rotirea cheilor](./security.md)
