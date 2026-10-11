# Filă Templates

Fila Templates vă permite să salvați, să răsfoiți și să reutilizați workflow-uri complete și noduri individuale. Partajați ceva ce ați construit o dată și aplicați-l la proiecte noi cu un singur clic.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Urmăriți demonstrația Templates</a></p>

## Prezentare generală

Există două tipuri de template-uri:

- **Workflow templates** — salvați un workflow complet (toate nodurile și conexiunile) ca punct de plecare reutilizabil.
- **Node templates** — salvați un singur nod configurat (de ex. un nod LLM ajustat sau un nod HTTP personalizat) pentru reutilizare în diferite workflow-uri.

Comutați între cele două folosind comutatorul **Workflows / Nodes** din partea de sus a filei.

Folosiți bara de căutare pentru a filtra template-urile vizibile după nume, descriere, etichete sau tip de nod.

---

## Crearea unui template

### Workflow template

1. Deschideți workflow-ul pe care doriți să îl partajați în editor.
2. Faceți clic pe **Share as Template** în bara de instrumente de sus.
3. Completați numele, descrierea și etichetele opționale.
4. Alegeți vizibilitatea: **Everyone** (toți utilizatorii) sau **Specific users** (introduceți nume de utilizator și/sau selectați echipe).
5. Faceți clic pe **Share**. O notificare verde confirmă succesul.

### Node template

1. Faceți clic dreapta pe orice nod de pe canvas.
2. Selectați **Share as Template** din meniul contextual.
3. Completați formularul și faceți clic pe **Share**.

---

## Utilizarea unui template

### Workflow template

1. Deschideți fila **Templates** și asigurați-vă că este selectat **Workflows**.
2. Faceți clic pe un card pentru a-l previzualiza sau faceți clic direct pe **Use**.
3. Workflow-ul este clonat într-un workflow nou care se deschide în editor.

### Node template

1. Deschideți fila **Templates** și selectați **Nodes**.
2. Faceți clic pe **Use** pe cardul unui node template.
3. Apare un dialog — alegeți unde să adăugați nodul:
   - **New workflow** — creează un workflow nou care conține doar acest nod.
   - **Existing workflow** — alegeți din lista de workflow-uri; nodul este inserat automat când se deschide editorul.

---

## Previzualizare

Faceți clic pe orice card de template pentru a deschide o previzualizare completă:

- **Miniaturi ale cardurilor** — cardurile de template afișează o captură de canvas read-only adaptată, atât pentru workflow-uri, cât și pentru template-uri cu un singur nod.
- **Workflow templates** — un canvas read-only care corespunde stilului de previzualizare din istoricul editărilor, inclusiv pan și zoom.
- **Node templates** — nodul salvat se deschide pe același canvas read-only ca previzualizare cu un singur nod.
- **Detalii nod** — faceți clic pe orice nod din previzualizare pentru a inspecta configurația salvată în panoul lateral.
- Etichetele, numărul de utilizări și **owner**-ul sunt afișate pentru toate template-urile.

Apăsați **ESC** sau faceți clic în afara pentru a închide previzualizarea.

---

## Gestionarea template-urilor

- **Edit** – Dacă sunteți proprietarul template-ului, treceți cu cursorul peste card și faceți clic pe pictograma creion pentru a actualiza numele, descrierea, etichetele sau vizibilitatea acestuia
- **Delete** – Dacă sunteți proprietarul template-ului, treceți cu cursorul peste card și ștergeți template-ul după promptul de confirmare
- **Acțiuni exclusive proprietarului** – Controalele de editare și ștergere sunt afișate doar pentru template-urile pe care le-ați creat

---

## Command Palette (CTRL+K)

Template-urile (atât workflow, cât și node) pot fi căutate din command palette-ul **CTRL+K**. Selectați un template pentru a-l utiliza imediat — workflow templates se deschid în editor, node templates solicită o destinație.

---

## Template-uri în Chat

Puteți adresa AI-ului întrebări despre template-urile dumneavoastră — acesta cunoaște toate template-urile din workspace-ul dumneavoastră.

---

## Vizibilitate

| Setare | Cine îl poate vedea |
|---|---|
| Everyone | Toți utilizatorii de pe platformă |
| Specific users | Utilizatorii pe care îi listați după nume și/sau echipele pe care le selectați — toți membrii echipei obțin acces |

Când partajați cu **Specific users**, puteți adăuga atât utilizatori individuali (după nume), cât și echipe. Membrii echipei văd template-ul în fila Templates și îl pot utiliza.

---

## Resurse conexe

- [Teams](../reference/teams.md) – Partajați template-uri cu echipe
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid scurt de pagină pentru filele din dashboard
