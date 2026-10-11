# Istoric

Istoricul urmărește versiunile salvate ale unui workflow. Utilizați-l pentru a vizualiza modificările în timp, a compara versiuni sau a reveni la o stare anterioară.

**Notă:** Istoricul este diferit de [Istoricul execuțiilor](./execution-history.md). Istoricul urmărește **salvările** (modificările structurii workflow-ului); Istoricul execuțiilor urmărește **rulările** (execuțiile anterioare).

## Unde îl găsiți

**Bara de instrumente a editorului** → **Istoric** (pictograma GitBranch)

## Versiuni

O versiune nouă este creată de fiecare dată când **salvați** workflow-ul. Lista afișează:

- **Curentă** – Cea mai recentă stare salvată (ceea ce vedeți pe canvas)
- **Versiunea N** – Salvările anterioare cu marcaje temporale

Versiunile fără modificări față de cea anterioară sunt ascunse.

## Vizualizarea diferențelor

Selectați o versiune pentru a vedea ce s-a modificat față de workflow-ul curent:

| Tip de modificare | Descriere |
|-------------|--------------|
| **Noduri** | Noduri adăugate, eliminate sau modificate |
| **Muchii** | Conexiuni adăugate, eliminate sau modificate |
| **Config** | Setări la nivel de workflow (autentificare, limite de rată etc.) |

Extindeți fiecare modificare pentru a vedea diferențele la nivel de câmp (de ex. ce proprietăți ale nodului s-au modificat).

## Previzualizare

Pentru a vedea cum arăta workflow-ul la o versiune anterioară, faceți clic pe **Previzualizare** lângă Revenire.

Se deschide un canvas read-only care afișează nodurile și muchiile acelei versiuni. Puteți deplasa și mări pentru a explora aspectul; nu se pot face modificări din această vizualizare.

## Revenire

Pentru a restaura o versiune anterioară:

1. Selectați versiunea dorită
2. Faceți clic pe **Revenire**
3. Confirmați acțiunea
4. Workflow-ul curent este înlocuit cu versiunea selectată; pagina se reîncarcă

Revenirea creează o nouă stare „curentă” — puteți reveni din nou dacă este necesar.

## Ștergerea istoricului

Faceți clic pe pictograma coșului de gunoi din antetul dialogului pentru a elimina tot istoricul versiunilor. Această acțiune nu poate fi anulată. Workflow-ul curent rămâne; doar versiunile anterioare sunt șterse.

## Când sunt create versiunile

Versiunile sunt create doar când **salvați** (Ctrl/Cmd+S sau butonul Salvare). Modificările nesalvate nu sunt stocate în Istoric până când nu salvați.

Modificările abilităților agentului sunt incluse în aceste instantanee. Pentru a naviga sau a restaura o singură abilitate fără a reveni întregul workflow, utilizați butonul **Istoric** de pe cardul acelei abilități din panoul de proprietăți al nodului Agent. Consultați [Nodul Agent](../nodes/agent-node.md#skill-history).

## Resurse conexe

- [Istoricul execuțiilor](./execution-history.md) – Rulări anterioare și Aducere pe Canvas
- [Structura workflow-ului](./workflow-structure.md) – Formatul nodurilor și muchiilor
- [Fila Workflow-uri](../tabs/workflows-tab.md) – Crearea și gestionarea workflow-urilor
