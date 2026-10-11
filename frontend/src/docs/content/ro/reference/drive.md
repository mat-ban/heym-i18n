# Drive

Fila Drive oferă un loc central pentru vizualizarea, gestionarea și partajarea tuturor fișierelor generate de skill-uri.

## Accesarea Drive

Navigați la fila **Drive** din dashboard. Toate fișierele generate de skill-urile workflow-ului dvs. apar aici, sortate după data creării.

## Lista de fișiere

Lista de fișiere afișează:

- **Name** - Numele original al fișierului cu o pictogramă specifică tipului
- **Type** - Tipul MIME al fișierului (de ex. pdf, csv, docx)
- **Size** - Dimensiunea fișierului într-un format ușor de citit
- **Source** - Eticheta nodului care a generat fișierul
- **Date** - Momentul în care a fost creat fișierul
- **Actions** - Butoanele de descărcare, partajare și ștergere

## Acțiuni în bloc

Fiecare fișier pe care îl dețineți are o casetă de selectare la începutul rândului său. Fișierele partajate cu dvs. printr-o echipă sunt doar pentru citire și nu pot fi selectate. Selectați mai multe fișiere (Shift-click selectează un interval contiguu; caseta de selectare din antet selectează întreaga pagină) pentru a afișa bara de acțiuni în bloc deasupra listei, apoi faceți clic pe **Bulk actions** pentru a deschide un singur dialog care aplică aceeași setare fiecărui fișier selectat:

- **Share all with my teams** / **Remove team sharing** — comută partajarea către echipe pentru toate fișierele selectate simultan
- **Create share link for each file** — creează un link de partajare pentru fiecare fișier selectat folosind aceleași valori de expirare, parolă și descărcări maxime

Dialogul raportează câte fișiere au fost afectate; fișierele pe care nu le dețineți sunt ignorate. Selectorul de rânduri pe pagină (25 / 50 / 100 / **All**) din partea de jos a listei vă permite să încărcați mai multe fișiere pe o singură pagină, astfel încât să puteți selecta din întregul dvs. Drive.

## Partajarea fișierelor

Faceți clic pe pictograma **Share** pentru a deschide dialogul de partajare. Puteți crea mai multe link-uri de partajare per fișier cu configurații diferite și, opțional, puteți partaja fișierul cu echipele dvs. actuale.

### Link public (bazat pe Token)

Creați un link de partajare fără parolă. Oricine are link-ul poate descărca fișierul.

### Link protejat cu parolă (Basic Auth)

Setați o parolă la crearea partajării. URL-ul de descărcare utilizează HTTP Basic Authentication - browserele vor solicita numele de utilizator (`file`) și parola la deschiderea link-ului.

### Opțiuni de link

- **Expires (hours)** - Setați opțional un timp de expirare
- **Max downloads** - Limitați opțional numărul de descărcări
- Ambele pot fi combinate pentru un control maxim

### Partajare cu echipele mele

Activați **Share with my teams** pentru a acorda acces doar pentru citire tuturor echipelor din care faceți parte în prezent. Membrii echipei pot vedea și descărca fișierul din Drive și pot utiliza operațiuni de citire ale nodului Drive, dar numai proprietarul fișierului poate șterge fișierul, poate crea sau revoca link-uri publice sau poate modifica parola/TTL/limitele de descărcare.

Setarea este specifică fișierului. Dacă vă alăturați sau creați o altă echipă ulterior, comutați din nou partajarea sau rulați operațiunea `shareWithMyTeams` a nodului Drive pentru a adăuga acea echipă. Utilizați `unshareWithMyTeams` pentru a elimina partajările către echipe din fișier într-un workflow.

### Gestionarea partajărilor

Dialogul de partajare afișează toate link-urile de partajare existente cu:
- Numărul curent de descărcări
- Starea de expirare
- Dacă Basic Auth este activat
- Butoanele de copiere și revocare

## Link-uri de fișiere în Chat și Portal

Când un skill generează fișiere în timpul unei execuții a workflow-ului prin chat-ul Portal sau Quick Drawer, link-urile de descărcare apar automat în răspuns. Utilizatorii pot face clic pentru a descărca direct.

## Stocare

Fișierele generate sunt stocate pe sistemul de fișiere al serverului în `data/files/`. În implementările Docker, acesta este montat ca volum pentru persistență.

## Gestionarea fișierelor din workflow-uri

[Nodul Drive](../nodes/drive-node.md) vă permite să gestionați fișierele din Drive în mod programatic din interiorul unui workflow. Utilizați-l pentru a:

- **Lista** fișierele dvs. și a returna metadate precum numele fișierului, tipul MIME, dimensiunea, sursa și URL-ul de descărcare
- **Șterge** un fișier după ce a fost livrat utilizatorului
- **Partajați sau anulați partajarea cu echipele dvs.**, astfel încât membrii echipei să îl poată citi și descărca doar cât timp există partajarea către echipă
- **Setați o parolă** pe link-ul de descărcare
- **Setați un TTL** astfel încât link-ul să expire după N ore
- **Setați o limită de descărcări maxime**

Convertirea unui fișier într-un alt format este sarcina [nodului Converter](../nodes/converter-node.md), cu `conversion: "fileConvert"`. Acesta citește un fișier din Drive și stochează rezultatul convertit ca un fișier nou.

Referiți fișierul prin ID-ul său din ieșirea skill-ului: `$agentLabel._generated_files[0].id`

Consultați [documentația nodului Drive](../nodes/drive-node.md) pentru detalii de configurare.

## Citirea fișierelor din Drive de către skill-uri

Skill-urile agentului pot opta pentru citirea din Drive prin setarea **Enable Drive files** a cardului de skill. Când este activată, runtime-ul skill-ului include un helper generat `heym_drive.py`. Codul skill-ului poate importa helperi precum `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` și `list_drive_files`.

Citirile din Drive sunt limitate la fișierele accesibile actorului workflow-ului: fișiere deținute și fișiere partajate cu actorul prin echipe. Utilizați un ID de fișier pentru o căutare exactă sau un nume exact de fișier atunci când utilizatorul se referă la un fișier după nume. Căutarea după nume returnează cel mai nou fișier accesibil cu acel nume; `list_drive_files(filename="...")` returnează toate potrivirile.

## Resurse conexe

- [Nodul Drive](../nodes/drive-node.md) - Operațiuni de workflow (listare, obținere, ștergere, parolă, TTL, descărcări maxime, partajare către echipe)
- [Fila Drive](../tabs/drive-tab.md) - Răsfoiți fișierele în dashboard
- [Generarea fișierelor](./file-generation.md) - Cum sunt produse `_generated_files` și URL-urile de descărcare

## Curățare
Token-urile de partajare expirate sunt curățate automat zilnic. Fișierele în sine persistă până când sunt șterse manual prin fila Drive. Utilizați **Clear All** pentru a șterge toate fișierele și link-urile lor de partajare într-o singură acțiune.
