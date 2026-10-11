# Filă Alerts

Fila **Alerts** vă permite să definiți condiții de prag pe o fereastră de timp și să fiți notificat când acestea sunt depășite. Heym înregistrează deja rezultatele execuțiilor, durata rulărilor și cheltuielile LLM, dar nu oferă niciodată aceste informații din proprie inițiativă. O alertă este modalitatea prin care îi solicitați acest lucru.

Fiecare alertă este evaluată pe o **fereastră de timp** pe care o alegeți, niciodată pe un singur eveniment. O rulare eșuată este zgomot. Douăsprezece rulări eșuate în zece minute reprezintă un incident.

## Tipuri de alerte

| Tip | Întrebarea la care răspunde | De unde provine numărul |
|---|---|---|
| **Prag de eroare** | A eșuat de mai mult de N ori în fereastră? | Rânduri din [Execution history](../reference/execution-history.md) cu status de eroare |
| **Durata Workflow-ului** | Rulările au devenit mai lente decât era de așteptat în fereastră? | Timpul de execuție, agregat ca maxim, medie sau percentila 95 |
| **Cost Token / USD** | Cheltuielile au depășit un buget în fereastră? | [LLM traces](./traces-tab.md) plus tabelul de costuri LLM |
| **Număr de execuții** | A rulat mult mai des decât ar fi trebuit? | Numărul de rânduri din istoricul execuțiilor |

### Prag de eroare

Numără rulările eșuate pe parcursul ferestrei și se declanșează când numărul atinge pragul dumneavoastră. Deoarece numără pe o fereastră în loc să intercepteze fiecare eșec, o singură eroare tranzitorie nu vă va alerta.

### Durata Workflow-ului

Măsoară durata rulărilor în interiorul ferestrei. Alegeți **max** (rularea cea mai lentă), **medie** sau **p95**. Valoarea p95 utilizează același calcul de percentilă ca [Analytics tab](./analytics-tab.md), astfel încât alerta și graficul de latență nu vor fi niciodată în dezacord cu privire la aceeași fereastră.

**Numărul minim de rulări în fereastră** menține acest lucru corect. Cea mai lentă rulare dintr-o fereastră aproape goală este doar acea singură rulare, așa că stabilirea unui minim de, să zicem, 3 împiedică declanșarea alertei pe zgomot.

### Cost Token / USD

Însumează cheltuielile LLM pe parcursul ferestrei, fie ca total de tokenuri, fie ca dolari americani. Sumele în dolari se rezolvă prin același tabel de prețuri pe care îl folosesc [Traces tab](./traces-tab.md) și [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table), astfel încât o alertă de cost și pagina de costuri sunt întotdeauna în concordanță.

Când domeniul de aplicare cuprinde toate workflow-urile dumneavoastră, aceasta include apelurile LLM efectuate în afara unui workflow, cum ar fi [Chat tab](./chat-tab.md) și [AI Assistant](../reference/ai-assistant.md). Utilizarea agenților de codare (Codex, OpenCode) nu este inclusă.

Modelele fără rând de prețuri sunt raportate în contextul alertei ca neprețuite, în loc să fie contorizate silențios ca zero.

### Număr de execuții

Numără rulările cu orice status în fereastră. Aceasta este cea care surprinde un Trigger defectuos: un workflow care rulează în mod normal de 20 de ori pe oră rulând brusc de 2.000 de ori. Înregistrarea declanșării include o defalcare pe sursă de Trigger, deoarece acesta este de obicei răspunsul la "de ce s-a întâmplat acest lucru".

## Domeniu de aplicare

O alertă supraveghează fie **un singur workflow**, fie **toate workflow-urile dumneavoastră**.

"Toate workflow-urile dumneavoastră" înseamnă fiecare workflow la care proprietarul alertei are acces. Nu înseamnă în mod deliberat fiecare workflow de pe instanța Heym: alertele pot fi partajate, iar partajarea unei alerte nu ar trebui să ofere cuiva numere agregate pentru workflow-uri pe care nu le poate deschide.

## Asistentul

Crearea unei alerte parcurge cinci pași.

1. **Tip** — alegeți unul dintre cele patru de mai sus.
2. **Domeniu de aplicare** — un workflow sau toate.
3. **Condiție** — fereastra de timp, plus câmpurile de prag pentru acel tip.
4. **Răspuns** — ce se execută când se declanșează și cât de des să vă notifice în continuare.
5. **Verificare** — denumiți-o și consultați backtest-ul.

### Backtest-ul

Pasul de verificare răspunde la întrebarea care contează cu adevărat înainte de a salva: *în ultimele 24 de ore, cât de des s-ar fi declanșat aceasta?*

Acesta raportează numărul de declanșări și cea mai mare valoare observată în raport cu pragul dumneavoastră. Dacă indică faptul că condiția s-ar fi declanșat de 400 de ori, corectați pragul înainte de salvare, în loc să o faceți după ce ați fost alertat. Puteți extinde perioada de analiză retrospectivă la 3 sau 7 zile.

## Redactare AI

În partea de sus a primului pas se află o casetă în care descrieți ce doriți în limbaj natural:

> Avertizează-mă dacă sincronizarea facturilor eșuează de mai mult de 5 ori în 10 minute

Heym transformă aceasta într-o definiție de alertă, completează fiecare pas pe care îl poate și avansează cu câmpurile completate de AI marcate, astfel încât să confirmați în loc să retastați. O cerere completă vă duce la Verificare.

**O cerere parțială vă face totuși să avansați.** Spuneți doar "avertizează-mă dacă eșuează de 5 ori" și primiți o alertă de prag de eroare cu numărul completat, valori implicite pentru restul, iar asistentul se deschide la primul pas care necesită intervenția dumneavoastră: în acest caz Domeniu de aplicare, deoarece nu a fost numit niciun workflow. O notă în partea de sus indică ce rămâne de decis. Nu blochează niciodată Next sau Create.

Același lucru se aplică atunci când modelul numește un workflow la care nu aveți acces sau returnează o condiție cu câmpuri lipsă. Părțile care au sens sunt păstrate, restul revine la valorile implicite pentru acel tip de alertă, iar dumneavoastră ajustați de acolo. Nimic de aici nu ocolește validarea: regulile proprii ale asistentului și API-ul reverifică ambele alerta la salvare.
## Comportament de repetare

Odată ce o alertă se declanșează, aceasta intră într-o stare declanșată. Ce se întâmplă în continuare este alegerea dumneavoastră la pasul 4.

- **Notificare o singură dată, până la recuperare** (implicit) — se declanșează o dată, apoi rămâne silențioasă cât timp condiția se menține. Când metrica scade din nou sub prag, alerta revine la OK și devine eligibilă să se declanșeze din nou. Recuperarea este o schimbare de stare, nu un eveniment: nu creează o înregistrare de declanșare și nu rulează workflow-ul de notificare.
- **Notificare continuă la un interval** — se declanșează din nou la fiecare N minute atât timp cât condiția se menține.

Valoarea implicită există deoarece un workflow defectuos verificat la fiecare 60 de secunde ar produce altfel 60 de declanșări pe oră, ceea ce duce la dezactivarea alertelor.

## Rularea unui Workflow la declanșare

Pasul 4 oferă trei răspunsuri la „ce ar trebui să se întâmple când aceasta se declanșează":

- **Creare și atribuire a unui workflow nou** (implicit) — salvarea alertei creează de asemenea un workflow numit *„&lt;nume alertă&gt; notification"* și îl asociază. Acesta sosește cu un nod de intrare ale cărui câmpuri corespund exact payload-ului de mai jos, astfel încât `$alert.body.observed_value` și restul se rezolvă imediat și trebuie doar să atașați nodul care livrează mesajul. **Go to workflow** de pe cardul alertei îl deschide. Acesta este implicit deoarece o alertă care se declanșează în gol este ușor de ratat.
- **Alegerea unui workflow existent** — rulați ceva ce ați construit deja.
- **Nu faceți nimic** — declanșarea este totuși înregistrată în tab, doar că nu rulează nimic.

Payload-ul alertei sosește ca body de intrare al acelui workflow:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Care workflow a produs numărul

`workflows` este singurul loc în care apare un workflow. Acesta listează fiecare workflow care a contribuit la citire, fiecare cu propriul `value` — numărul de erori al acelui workflow, numărul de rulări, cea mai lentă rulare în milisecunde sau cheltuiala, în funcție de tipul alertei. Lista este sortată după `value`, descrescător, astfel încât `workflows[0]` este cel mai problematic.

Este **întotdeauna un array**: cu un singur element în scopul unui singur workflow, cu mai multe în scopul „toate workflow-urile mele" și gol în loc de null când nimic nu este atribuibil. Un workflow de notificare îl poate itera fără o verificare de formă.

În mod deliberat nu există un `workflow_id` la singular. Acesta descria scopul alertei, nu metrica, astfel încât era `null` în scopul de sistem, care este exact cazul în care „care workflow?" contează cel mai mult. `observed_value` rămâne agregatul cu care a fost comparat pragul; câmpurile `value` per workflow explică de unde provine acesta.

Astfel ajung alertele în Slack, email, Telegram sau oriunde altundeva: cu [nodurile](../reference/node-types.md) pe care le aveți deja, în locul unui sistem separat de notificare.

O alertă nu poate notifica workflow-ul pe care îl supraveghează. Aceasta ar fi o buclă, cel mai evident pentru o alertă de număr de execuții în care fiecare notificare se adaugă la numărul pe care îl măsoară.

Rulările de notificare sunt execuții obișnuite, astfel încât apar în [istoricul execuțiilor](../reference/execution-history.md) ca orice altă rulare. Un workflow de notificare care eșuează este înregistrat la declanșare, dar nu împiedică niciodată înregistrarea declanșării în sine.

Un workflow de notificare rulează în calitate de proprietar al alertei, cu credențialele și variabilele globale ale acestuia, exact ca și cum le-ar fi rulat el însuși. Alegerea unui workflow partajat cu dumneavoastră nu împrumută credențialele acelei persoane. Dacă proprietarul pierde accesul la workflow-ul de notificare, declanșarea este totuși înregistrată, dar rularea de notificare este omisă.

## Istoricul declanșărilor

Sub lista de alerte se află istoricul declanșărilor: ce s-a declanșat, când, valoarea observată față de prag, fereastra exactă care a fost evaluată și rezultatul notificării.

Confirmarea unei declanșări marchează rândul și schimbă insigna alertei din **Firing** în **Acknowledged**. Aceasta este o afirmație despre dumneavoastră, nu despre alertă: condiția se menține în continuare, iar alerta revine la **OK** de la sine când metrica scade din nou sub prag.

Fiecare înregistrare stochează detaliul contribuitor în momentul declanșării: id-urile execuțiilor eșuate și mesajele de eroare, cheltuiala per model sau defalcarea pe surse de trigger. Acest lucru este deliberat. Fereastra a trecut, iar recalcularea ei ulterior poate da un răspuns diferit.

Înregistrările de declanșare sunt păstrate timp de 90 de zile.

## Întrebarea Chat-ului despre alerte

Tab-ul [Chat](./chat-tab.md) poate răspunde la întrebări despre alertele dumneavoastră:

- „Ce alerte am?"
- „Există o alertă pe workflow-ul de facturare?"
- „De ce s-a declanșat alerta de cost?"
- „Când s-a declanșat ultima dată aceasta?"

Pentru o întrebare de tipul „de ce s-a declanșat", Chat-ul citează valoarea observată reală, pragul și fereastra de timp din înregistrarea declanșării, împreună cu detaliul contribuitor.

## Partajare

Alertele pot fi partajate cu utilizatori individuali sau cu [echipe](./teams-tab.md). Persoanele cu care partajați pot vedea alerta și istoricul ei de declanșări. Doar proprietarul poate edita, suspenda, șterge sau re-partaja alerta.
### Când accesul la workflow este eliminat

O alertă pe un singur workflow continuă să citească metricile de rulare ale acelui workflow, astfel încât eliminarea accesului cuiva la workflow decide și ce se întâmplă cu alertele sale pe acesta:

- **Eliminarea unei partajări către un utilizator sau o echipă** îl întreabă pe proprietarul workflow-ului dacă să oprească și alertele acelui utilizator sau acelei echipe pe workflow. Oprirea este implicită. Alertele oprite sunt puse în pauză, nu șterse, iar fiecare este înregistrată ca `alert.disable_on_access_revoke` în [audit log](../reference/audit.md).
- **Eliminarea unui membru al echipei sau ștergerea unei echipe** oprește întotdeauna alertele afectate, deoarece persoana care face această modificare nu este neapărat proprietarul workflow-ului.
- O alertă este oprită doar atunci când proprietarul său nu are nicio altă cale către workflow, cum ar fi o partajare directă sau o altă echipă.
- Reluarea sau testarea unei alerte puse în pauză verifică din nou accesul proprietarului, astfel încât o alertă oprită nu poate fi reactivată sau folosită pentru a citi metricile workflow-ului fără acces. Apăsarea butonului **Resume** fără acces afișează o notificare care explică faptul că proprietarul workflow-ului trebuie să îl partajeze din nou mai întâi.

## Gestionarea alertelor

- **Pause / Resume** — o alertă pusă în pauză nu este niciodată evaluată. Reluarea o verifică imediat, în loc să aștepte următorul interval.
- **Edit** — modificările sunt validate în ansamblu, astfel încât o editare parțială nu poate lăsa alerta într-o stare invalidă.
- **Delete** — elimină alerta și istoricul său de declanșări.

## Vezi și

- [Analytics Tab](./analytics-tab.md) — graficele din care sunt derivate aceste praguri
- [Traces Tab](./traces-tab.md) — de unde provin cifrele privind costurile LLM
- [Execution History](../reference/execution-history.md) — rulările pe care le măsoară alertele de eroare, durată și număr
- [Chat Tab](./chat-tab.md) — interogarea alertelor în limbaj natural
- [Teams](./teams-tab.md) — partajarea alertelor cu o echipă
