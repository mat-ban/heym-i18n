# Analiza Workflow-ului

**Analiza Workflow-ului** este un panou lateral stânga care conține un document Markdown partajat și editabil pentru fiecare workflow. Utilizați-l pentru a explica ce face un workflow și pentru a captura idei de îmbunătățire — și lăsați AI-ul să genereze o primă versiune pentru dvs.

Documentul este partajat: toată lumea care poate accesa workflow-ul îl poate citi și edita. Este stocat împreună cu workflow-ul și șters automat când workflow-ul este șters.

## Deschiderea Panoului

1. Deschideți un workflow în editor.
2. Faceți clic pe **Analyze** (pictograma Sparkles) din bara de instrumente a editorului.
3. Panoul se deschide în stânga. Paleta de noduri (panoul din stânga) se restrânge cât timp acesta este deschis; redeschiderea paletei de noduri închide panoul de analiză.

Panoul este disponibil doar pentru workflow-urile salvate. Pentru un workflow nou, nesalvat, salvați-l mai întâi.

## Documentul

Panoul afișează un singur document Markdown cu două vizualizări, comutate prin butoanele **Edit** (creion) și **Preview** (ochi):

| Vizualizare | Scop |
|------|---------|
| **Edit** | Editor Markdown simplu (textarea). |
| **Preview** | Markdown redat. |

Antetul afișează **cine a editat ultima dată** documentul și când.

### Salvarea

Faceți clic pe **Save** pentru a persista modificările. Salvarea este activată doar când există modificări nesalvate.

Deoarece documentul este partajat, salvările utilizează concurență optimistă:

- Dacă altcineva a salvat o versiune mai nouă de când ați deschis panoul, salvarea dvs. este respinsă și apare un avertisment care numește celălalt editor.
- Puteți apoi să alegeți **Reload (discard mine)** pentru a prelua versiunea serverului sau **Overwrite** pentru a forța salvarea versiunii dvs. peste a lor.

## Analiza AI

Selectați o **Acreditare** LLM și un **Model** în partea de sus a panoului (lista de modele se încarcă din acreditarea selectată — consultați [Acreditări](../tabs/credentials-tab.md)). Apoi rulați analiza:

- **Analyze my workflow** — afișat când documentul este gol. Transmite în flux un raport Markdown generat de AI direct în editor ca o ciornă nesalvată. Revizuiți-l și editați-l, apoi **Save**.
- **Reanalyze** — afișat când documentul are deja conținut. Transmite în flux un raport nou într-o **previzualizare** separată, lăsând documentul dvs. curent neatins. Alegeți **Accept** pentru a înlocui conținutul editorului cu noua analiză sau **Discard** pentru a păstra ce aveați.

Ambele acțiuni **rulează mai întâi workflow-ul** (când acesta este valid și poate fi rulat) și includ rezultatele execuției în prompt-ul de analiză, astfel încât raportul să reflecte modul în care workflow-ul se comportă de fapt. Dacă workflow-ul nu poate rula, analiza continuă pe baza structurii sale statice.

Raportul generat acoperă trei secțiuni, în ordine: **Zone de îmbunătățire** (sugestii concrete, inclusiv o perspectivă de **securitate** ori de câte ori workflow-ul atinge acreditări, input de la utilizator, cereri externe sau expunere de date), **Scopul** workflow-ului și **Ce face** (o parcurgere pas cu pas prin noduri).

Secțiunea **Zone de îmbunătățire** rulează întotdeauna patru verificări explicite:

1. **Acoperirea erorilor** — dacă canvas-ul nu are niciun nod [Error Handler](../nodes/error-handler-node.md) și nu este configurat niciun workflow de eroare, raportul semnalează acest lucru și recomandă adăugarea gestionării erorilor.
2. **Timp economisit** — dacă nu este setată nicio estimare a timpului economisit per rulare, raportul recomandă configurarea uneia, astfel încât metrica **Time Saved** din [Analytics](../tabs/analytics-tab.md) să se poată popula.
3. **Noduri de rețea** — pentru nodurile care efectuează apeluri de rețea (cum ar fi [HTTP](../nodes/http-node.md) și nodurile de integrare), raportul recomandă gestionarea erorilor specifică nodului (retry și/sau continue-on-error) pe acele noduri.
4. **Alerte** — când nu sunt configurate [alerte](../tabs/alerts-tab.md) pentru workflow, raportul recomandă configurarea alertelor înainte de a trece în producție.

### Rularea Analyzer din Properties

Când un workflow are noduri pe canvas, dar încă nu are un document de analiză, un buton **Run Analyzer** apare în panoul [Properties](./canvas-features.md) la nivel de workflow (afișat când nu este selectat niciun nod). Acesta deschide acest panou de Analiză a Workflow-ului, astfel încât să puteți alege o acreditare și un model și să generați raportul.

Fiecare rulare de analiză este înregistrată în [Traces](../tabs/traces-tab.md) sub sursa **Workflow Analysis**.

Dacă nu este configurată nicio acreditare LLM, butonul Analyze este dezactivat — adăugați una în [Credentials Tab](../tabs/credentials-tab.md).

## Resurse Asociate

- [AI Assistant](./ai-assistant.md) — generați sau modificați noduri de workflow din limbaj natural.
- [Sticky Note](../nodes/sticky-note-node.md) — pentru note scurte fixate direct pe canvas.
