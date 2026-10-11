# Dialogul de Evaluare a Expresiilor

Dialogul de Evaluare a Expresiilor este editorul extins pentru câmpurile care acceptă expresii. Se deschide din butonul de extindere de lângă un câmp de expresie și vă oferă un spațiu de lucru mai amplu, autocomplete, previzualizare live pe backend și navigare prin rezultate, toate într-un singur loc.

## Deschiderea Dialogului

- Faceți clic pe butonul de extindere de lângă un câmp de expresie din panoul Properties.
- Câmpurile multi-linie afișează butonul în interiorul câmpului.
- Câmpurile single-line afișează butonul în dreapta câmpului.

## Aspectul Dialogului

- Dialogul se deschide ca o fereastră modală centrată, la aproximativ **80vw × 80vh**.
- Antetul afișează **Evaluate — {field name}** atunci când eticheta câmpului este cunoscută.
- Editorul păstrează autocomplete, navigarea de la câmp la câmp și acțiunile obișnuite **Apply** / **Cancel**.
- Previzualizarea se actualizează automat la aproximativ **300 ms** după ce încetați să tastați.
- Apăsați `Ctrl` / `Cmd` + `Enter` pentru a aplica textul curent înapoi în câmp și a închide dialogul (la fel ca **Apply**).

## Secțiunea Output

Zona Output se actualizează automat după ce faceți o pauză în timp ce tastați în editor.

### Evaluare

| Tip de expresie | Rezultat |
|---|---|
| Un singur `$expr` (întregul câmp) | Valoarea nativă este păstrată |
| O singură cale cu punct simplu (întregul câmp, fără `$`, fără linie nouă inclusă) | La fel ca `$` + acea cale (backend-ul normalizează pentru evaluare) |
| Text cu `$refs` incluse | Rezultatul final este întotdeauna un string |
| Text literal (fără `$`, nu este o singură cale cu punct) | Returnat ca atare |

**Exemple**

| Intrare | Rezultat |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (la fel ca `$input.items` când întreaga valoare este această cale) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Contextul de evaluare este construit în această ordine:

- **Date fixate** pe nodurile din amonte
- **Rezultatele ultimei execuții** de pe canvas
- `null` atunci când nu sunt disponibile date din amonte

Dacă nodul curent are dependențe în amonte, dar niciuna dintre ele nu are date fixate sau un rezultat recent de execuție, dialogul efectuează mai întâi o execuție de test pentru a construi contextul și apoi evaluează textul curent.

### Selectorul de Căi din Output

Atunci când rezultatul de pe backend este un obiect sau un array, zona Output poate afișa un selector interactiv de căi în loc de JSON brut.

- Faceți dublu clic pe un rând pentru a adăuga acea cale la referința `$node.path` curentă.
- Faceți un singur clic pe rândurile expandabile pentru a deschide sau închide ramurile.
- Folosiți caseta de căutare integrată pentru a căuta chei, valori și string-uri de cale.

## Autocomplete

- Tastați `$` pentru a deschide sugestii pentru nodurile din amonte, elementele încorporate și metode.
- Apăsați `Tab` sau `Enter` pentru a insera sugestia selectată.
- Folosiți `↑` / `↓` pentru a naviga prin lista de sugestii.

### Răspunsuri Exemplu

Atunci când continuați o referință `$…` cu un punct, fiecare rând de sugestie afișează răspunsul pe care l-ar produce acea sugestie, cu caractere aldine în partea dreaptă a rândului.

- Tastând `$set.listItems.first().toString().u` sunt listate `upper`, `urlEncode`, `urlDecode` și `unescape`, fiecare cu rezultatul său evaluat — astfel încât puteți alege după rezultat în loc de nume.
- Tastând `$node.text.toJson()` se analizează un string JSON într-un obiect sau array. După `.toJson()`, autocomplete poate oferi cheile analizate (de exemplu `repoUrl`) atunci când sunt disponibile rezultate din ultima execuție sau date fixate.
- Rezultatele sunt evaluate pe backend pe baza acelorași date fixate și rezultate ale ultimei execuții pe care le folosește previzualizarea dialogului, astfel încât corespund cu ceea ce va produce câmpul.
- Sunt evaluate doar sugestiile care se susțin singure: metode cu zero argumente (`upper()`, `first()`, `keys()`, `toJson()`) și proprietăți simple (`length`, `year`). Sugestiile care necesită mai întâi argumente — `map`, `filter`, `sort`, `replace` — sunt lăsate goale.
- Un rând rămâne gol atunci când candidatul nu produce niciun răspuns: o eroare, un `null` sau o metodă care nu se aplică acelei valori.
- Răspunsurile sunt scurtate la o singură linie. Treceți cu cursorul peste un răspuns scurtat pentru a vedea mai mult din el.

## Build with AI

Butonul **Build with AI** apare în colțul din dreapta sus al dialogului de evaluare atunci când un workflow este încărcat. Acesta deschide o fereastră modală imbricată în care puteți descrie în text simplu expresia dorită și puteți lăsa un LLM să o genereze pentru dumneavoastră.

### Cum funcționează

1. Faceți clic pe **Build with AI** în bara de instrumente a dialogului de evaluare.
2. Selectați o acreditare LLM și un model din meniurile derulante.
3. Tastați o descriere în text simplu a ceea ce doriți — de exemplu, *„Obține numele clientului din răspunsul API"*.
4. Faceți clic pe **Generate**. Fereastra modală apelează backend-ul, care folosește prompt-ul de sistem [Expression DSL](./expression-dsl.md) împreună cu rezultatele ultimei execuții a workflow-ului ca context și returnează un singur string de expresie.
5. Expresia generată este evaluată imediat pe baza acelorași date de pe canvas, astfel încât puteți vedea rezultatul înainte de a-l aplica.
6. Faceți clic pe **Apply** pentru a înlocui conținutul editorului cu expresia generată sau pe **Regenerate** pentru a încerca din nou.

### Contextul folosit

Generatorul primește rezultatele nodurilor din ultima execuție de test de pe canvas. Dacă workflow-ul nu a fost încă executat, LLM-ul generează o expresie cât mai bună posibil pe baza etichetelor nodurilor și a convențiilor DSL.

### Cerințe

- O acreditare LLM (OpenAI, Google sau Custom) trebuie configurată în fila [Credentials](./credentials.md).
- Workflow-ul trebuie să fie deschis în editor.

## Scurtături de Tastatură

| Scurtătură | Acțiune |
|---|---|
| Pauză la tastare (~300 ms) | Reîmprospătează previzualizarea pe backend |
| `Ctrl` / `Cmd` + `Enter` | Aplică și închide dialogul |
| `Escape` | Închide mai întâi autocomplete, altfel închide dialogul |
## `$` imbricat în argumentele metodei

Pentru evaluarea dialogului / backend, puteți transmite o altă referință cu un `$` imbricat în interiorul apelurilor precum `.get($other.field)` atunci când aveți nevoie de o cheie dinamică. De asemenea, puteți utiliza o cale simplă în interiorul `.get(...)` (de exemplu `other.field`); backend-ul o rezolvă în același mod. Câmpurile salvate ale workflow-ului trebuie totuși să respecte regulile [Expression DSL](./expression-dsl.md); API-ul de evaluare acceptă de asemenea, pentru comoditate, o cale punctată simplă pe un rând întreg (consultați tabelul de mai sus).

## Navigare

Editorii de mapare Set și Execute pot afișa butoanele **Prev** / **Next** pentru a vă permite să vă deplasați între câmpuri fără a închide dialogul.

## Resurse conexe

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — necesare pentru funcția Build with AI
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
