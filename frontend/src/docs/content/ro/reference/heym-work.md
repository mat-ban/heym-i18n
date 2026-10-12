# Heym Work

**Heym Work** este o a doua interfață destinată echipelor de afaceri, construită pe baza Heym. Utilizatorii descriu o sarcină în propriile cuvinte, răspund la câteva întrebări și obțin un workflow construit și testat de Heym. Aceștia lucrează din pagini create special pentru ei, răspund la revizuiri și văd fiecare rulare asociată cu numele celui care a inițiat-o. Heym execută fiecare sarcină în fundal.

Heym Work rulează ca un container separat alături de Heym, cu o licență distinctă oferită de echipa Heym. Aflați mai multe și solicitați o versiune de încercare la [heym.run/enterprise](https://heym.run/enterprise). Urmăriți [prezentarea video Heym Work](https://youtu.be/5Z2gGo6bcpU) pentru un tur de două minute.

## Ce primesc echipele de afaceri

| Domeniu | Ce face |
|---------|---------|
| **Chat** | Descrieți o sarcină prin text sau voce. Heym solicită detaliile necesare, construiește workflow-ul, îl testează și îl marchează ca Verificat. |
| **Pagini** | Pagini fixate cu widgeturi: valori numerice, grafice, tabele cu etichete de stare, zone de încărcare a fișierelor și aprobări. Un rând din tabel poate deschide propria pagină de detalii. |
| **Aprobări** | Revizuirile din pașii [Human-in-the-Loop](./human-in-the-loop.md) așteaptă în Activitate și pe pagini, cu opțiuni de Aprobare, Solicitare modificări și Respingere. |
| **Activitate** | Fiecare rulare, indicând persoana care a inițiat-o și instanța care a executat-o. |
| **Roluri** | Proprietar, Editor și Vizualizator. Conectarea se face prin mecanismul [Single Sign-On](./sso.md) deja utilizat de Heym. |
| **Ediții pentru industrii** | Edițiile pentru domeniile juridic, educație, finanțe, logistică, energie și comerț electronic se deschid cu pagini, date demonstrative și workflow-uri adaptate fiecărui domeniu. |

## Conectarea Heym Work

Urmăriți [videoclipul de instalare](https://youtu.be/zXGfg1HPSLk) pentru întreaga procedură de configurare, de la prima comandă până la pagina principală.

Conexiunea se configurează în **Setări → Heym Work**. Această filă este vizibilă doar pentru administratorii de instanță menționați în `HEYM_ADMIN_EMAILS`.

| Câmp | Ce face |
|------|---------|
| **Adresă Heym Work** | Locul unde rulează Heym Work, de exemplu `https://work.example.com`. Autentificarea redirecționează acolo. Apăsați **Salvare**. |
| **Cheie de integrare** | Butonul **Generare cheie** creează cheia utilizată de Heym Work pentru fiecare solicitare trimisă către Heym. Este afișată o singură dată, alături de un buton de copiere. Heym stochează exclusiv hash-ul acesteia. |
| **Activare Heym Work** | Pornește conexiunea. Necesită introducerea prealabilă a adresei și a unei chei. |
| Stare | **Văzut ultima dată**, **Versiune Work** și **Licență**, conform ultimului raport transmis de Heym Work. |

Apoi deschideți adresa Heym Work și finalizați configurarea:

1. **Licență**: introduceți cheia de licență transmisă de echipa Heym.
2. **Heym**: introduceți adresa Heym și cheia de integrare.
3. **Proprietar**: conectați-vă cu un cont desemnat ca Proprietar Heym Work.

Pagina principală se deschide, pregătită pentru echipă.

### Rotirea cheii

Opțiunea **Rotire cheie** înlocuiește cheia de integrare. Heym Work se oprește până când noua cheie este introdusă acolo, iar toți utilizatorii conectați la Heym Work sunt deconectați. Utilizați această funcție atunci când există suspiciunea că a fost compromisă cheia sau când un colaborator care a avut acces la ea părăsește organizația.

### Dezactivarea conexiunii

Dezactivați comutatorul **Activare Heym Work** pentru a întrerupe conexiunea. Heym Work va solicita din nou cheia Heym. Heym va continua să ruleze toate workflow-urile, programările și webhook-urile în ambele situații.

## Model de securitate

- **Fiecare modificare trece prin Heym.** Heym Work citește datele afișate din baza de date a Heym și trimite fiecare acțiune către Heym printr-un canal protejat prin cheie, unde Heym aplică propriile reguli de acces. Heym Work își păstrează datele într-o schemă separată denumită `heym_work`.
- **Cheia este stocată sub formă de hash.** Heym compară hash-ul cheii furnizate și nu stochează niciodată cheia în text clar.
- **Autentificarea rămâne în Heym.** Utilizatorii se autentifică prin Heym, folosind furnizorul dumneavoastră de identitate atunci când [SSO](./sso.md) este activat.
- **Modificările sunt auditate.** Salvarea conexiunii și rotirea cheii creează înregistrări `work_integration.update` și `work_integration.key_rotate` în [jurnalul de audit](./audit.md).

## Licențiere

Heym Work necesită propria cheie de licență, emisă de echipa Heym. În fiecare zi, Heym Work trimite către heym.run ID-ul licenței, un ID de instalare, numărul de utilizatori activi din ultimele 30 de zile, numărul total de membri, numărul de rulări din ultimele 24 de ore și versiunile Heym și Heym Work. Conținutul workflow-urilor, intrările, ieșirile și credențialele rămân în totalitate pe serverele locale.

Dacă sincronizarea zilnică eșuează timp de 30 de zile, începe o perioadă de grație de 14 zile, după care interfața Heym Work va solicita o cheie de la un Proprietar. O versiune de încercare este valabilă până la ultima zi stabilită și se reia atunci când echipa Heym o prelungește (este permisă o singură încercare per instalare). Heym însuși funcționează fără întrerupere în tot acest timp. Rețelele izolate fără acces la internet pot utiliza o licență offline prin enterprise@heym.run.

## Videoclipuri

Toate videoclipurile Heym Work sunt grupate în [lista de redare Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Subiecte conexe

- [Enterprise](./enterprise.md): Licențiere comercială și asistență
- [Single Sign-On](./sso.md): Mecanismul de autentificare utilizat de Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Revizuirile afișate în Heym Work
- [Jurnal de audit](./audit.md): Înregistrările generate de modificările aduse conexiunii
- [Setări](./user-settings.md): Unde se află fila Heym Work
