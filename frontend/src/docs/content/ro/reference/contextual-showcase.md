# Prezentare contextuală

**Prezentarea contextuală** este o bară de ghidaj ușoară integrată în aplicație, care explică pagina pe care vă aflați în prezent, fără a vă direcționa imediat către un flux complet de documentație.

## Ce face

- Afișează un scurt rezumat pentru pagina curentă
- Menține primul nivel concis, pentru a nu vă supraîncărca
- Permite extinderea unui număr redus de detalii suplimentare doar atunci când este necesar
- Oferă linkuri către pagina completă de documentație pentru o lectură aprofundată

## Unde apare

În v1, prezentarea este disponibilă pe suprafețele principale autentificate ale Heym:

- Filele din Dashboard
- [Evaluare](../tabs/evals-tab.md)
- [Documentație](../getting-started/introduction.md)
- Canvas-ul editorului de workflow-uri

Paginile publice precum autentificare, înregistrare, portalul de chat și revizuirea HITL nu afișează prezentarea.

## Acces

### Desktop

- Un trigger fix **Page Guide** apare pe marginea din dreapta a ecranului
- Prezentarea se deschide ca un drawer pe partea dreaptă
- Rămâne închisă implicit
- Un teaser unic ajută la dezvăluirea existenței ghidului fără a-l forța să se deschidă

### Mobil

- Același conținut este disponibil printr-un buton flotant **Page Guide**
- Se deschide într-un bottom sheet în locul unei bare laterale drepte

## Model de conținut

Fiecare intrare din prezentare utilizează o definiție structurată în locul unei componente complet personalizate.

- **Titlu** – Ce reprezintă această pagină
- **Rezumat** – O scurtă explicație
- **Puncte** – Câteva repere ușor de parcurs
- **Evidențieri** – Carduri mici pentru valoarea sau tiparele de utilizare cheie
- **Mai multe detalii** – Secțiuni restrânse pentru context suplimentar
- **Acțiuni** – De obicei unul sau două linkuri, cel mai frecvent către documentația completă

Acest lucru menține sistemul flexibil, evitând în același timp panourile de ajutor lungi și aglomerate.

## Conștientizarea contextului

Prezentarea se modifică în funcție de suprafața curentă.

- Fiecare filă din Dashboard are propriul rezumat
- Editorul indică către [Canvas Features](./canvas-features.md)
- Pagina de documentație utilizează o prezentare generală a documentației și, atunci când este posibil, indică articolul curent pe care îl aveți deja deschis

## Persistență

Prezentarea stochează o cantitate redusă de stare personală a interfeței în stocarea browserului:

- Dacă panoul sau foaia a fost ultima dată deschisă
- Ce contexte de pagină au afișat deja teaser-ul
- Ultima secțiune de detalii extinsă pentru fiecare context

## De ce există

Scopul este de a face Heym mai ușor de învățat fără a adăuga mai multe elemente greoaie în interfață.

- Îndrumare scurtă, mereu la îndemână, pentru orientare
- Cale clară către documentație aprofundată
- Întrerupere redusă pentru utilizatorii experimentați

## Resurse conexe

- [Fila Workflows](../tabs/workflows-tab.md) – Suprafața principală a Dashboard-ului
- [Fila Evaluare](../tabs/evals-tab.md) – Workflow-uri de evaluare
- [Canvas Features](./canvas-features.md) – Comportamentul editorului și depanare
- [Quick Drawer](./quick-drawer.md) – Cealaltă suprafață utilitară fixă din partea dreaptă
