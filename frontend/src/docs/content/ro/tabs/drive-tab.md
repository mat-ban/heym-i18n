# Filă Drive

Fila Drive afișează toate fișierele generate de skills în cadrul workflow-urilor dumneavoastră.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Urmăriți demonstrația Drive</a></p>

## Prezentare generală

Fișierele generate de skills (PDF, DOCX, CSV, imagini etc.) sunt stocate și listate automat în fila Drive. Fiecare fișier afișează numele, tipul, dimensiunea, nodul sursă, data creării și starea de partajare cu echipa.

## Funcționalități

- **Căutare** - Filtrați fișierele după nume, tip sau nod sursă
- **Copiere ID fișier** - Copiați UUID-ul fișierului în clipboard, pregătit pentru a fi lipit într-un nod [Drive](../nodes/drive-node.md) sau [Converter](../nodes/converter-node.md)
- **Descărcare** - Descărcare autentificată pentru fișierele dumneavoastră și fișierele partajate cu dumneavoastră prin echipe
- **Partajare** - Creați linkuri de descărcare partajabile cu protecție opțională prin parolă și expirare, sau partajați un fișier în mod read-only cu echipele dumneavoastră actuale
- **Ștergere** - Eliminați fișierele și linkurile lor de partajare
- **Ștergere totală** - Ștergeți toate fișierele și linkurile lor de partajare după confirmare
- **Acțiuni în bloc** - Selectați mai multe fișiere cu ajutorul casetelor de selectare (Shift-click pentru un interval) și aplicați aceeași acțiune tuturor simultan
- **Paginare** - Navigați prin colecții mari de fișiere, cu un selector de rânduri pe pagină (25 / 50 / 100 / Toate)

## Acțiuni în bloc

Fișierele pe care le dețineți afișează o casetă de selectare la începutul rândului (fișierele partajate cu dumneavoastră prin intermediul unei echipe sunt read-only și nu pot fi selectate). Selectați mai multe rânduri — sau utilizați caseta de selectare din antet pentru a selecta întreaga pagină, și **Shift-click** pentru a selecta un interval — apoi utilizați bara de acțiuni în bloc care apare deasupra listei:

- **Descărcare ZIP** împachetează fiecare fișier selectat într-o singură arhivă ZIP și o descarcă
- **Acțiuni în bloc** deschide un singur dialog pentru a aplica o setare fiecărui fișier selectat:
  - **Partajare totală cu echipele mele** / **Eliminare partajare cu echipa** cu un singur clic
  - **Creare link de partajare pentru fiecare fișier** utilizând aceleași setări de parolă, expirare și descărcări maxime
- **Ștergere** elimină fiecare fișier selectat și linkurile sale de partajare după o confirmare
- **Golire selecție** deselectează tot

Dialogul raportează numărul de fișiere cărora li s-a aplicat acțiunea (fișierele pe care nu le dețineți sunt ignorate). Utilizați opțiunea **Toate** a selectorului de rânduri pe pagină pentru a încărca toate fișierele pe o singură pagină și pentru a selecta din întregul dumneavoastră Drive. Tastarea în caseta de căutare comută automat selectorul de rânduri pe pagină la **Toate**, astfel încât căutarea să acopere toate fișierele, nu doar pagina curentă; golirea căutării restabilește selecția anterioară.

## Partajare

Creați linkuri de partajare cu:
- **Fără autentificare** - URL public de descărcare bazat pe token
- **Basic Auth** - Link protejat prin parolă (nume utilizator: `file`)
- **Expirare** - Expirare opțională bazată pe timp
- **Limite de descărcare** - Număr maxim opțional de descărcări

Activați **Partajare cu echipele mele** pentru un fișier pentru a-l face vizibil tuturor echipelor din care faceți parte în prezent. Membrii echipelor cu care s-a partajat primesc acces read-only; acțiunile de administrare rămân exclusiv pentru proprietar.

## Acces pentru Agent Skill

Skills pe nodul Agent pot opta pentru citirea fișierelor din Drive. Când **Enable Drive files** este activat pentru un skill, codul său Python poate citi fișierele Drive accesibile după id-ul fișierului sau după numele exact al fișierului prin intermediul helper-ului generat `heym_drive.py`. Setarea este dezactivată implicit.

Consultați [Referință Drive](../reference/drive.md) pentru detalii complete.

## Resurse conexe

- [Nod Drive](../nodes/drive-node.md) - Listați fișiere, recuperați metadate, partajați cu echipe sau modificați constrângerile de partajare dintr-un workflow
- [Generare fișiere](../reference/file-generation.md) - Cum generează skills fișierele
- [Referință Drive](../reference/drive.md) - Linkuri de partajare, tokenuri și curățare
- [Portal](../reference/portal.md) - Linkuri de fișiere în răspunsurile de chat din portal
