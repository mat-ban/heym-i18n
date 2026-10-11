# Scurtături de tastatură

Heym oferă scurături de tastatură în editorul de workflow-uri și pe canvas pentru a accelera acțiunile frecvente.

## Scurtături globale în editor

Aceste scurături sunt active oriunde în editorul de workflow-uri.

| Scurtătură | Acțiune |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Deschide Paleta de comenzi |
| `Ctrl + I` / `Cmd + I` | Comută panoul [Asistent AI](./ai-assistant.md) (funcționează în timpul tastării) |
| `Ctrl + Enter` / `Cmd + Enter` | Rulează workflow-ul curent |
| `Ctrl + S` / `Cmd + S` | Salvează workflow-ul |
| `Ctrl + Z` / `Cmd + Z` | Anulează |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Refă |
| `Ctrl + Y` / `Cmd + Y` | Refă (alternativ) |
| `Escape` | Închide suprapunerile, dialogurile și panourile deschise |

## Scurtături pe canvas

Aceste scurături se aplică atunci când canvas-ul este activ (nu există câmp de text activ).

### Selecție și navigare

| Scurtătură | Acțiune |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Selectează toate nodurile |
| `Shift` (menținut) | Trage pentru a selecta mai multe noduri |
| `Ctrl` / `Cmd` (menținut) | Clic pentru a adăuga noduri individuale la selecție |
| `Escape` | Deselectează toate nodurile; închide căutarea inline de noduri |

### Editarea nodurilor

| Scurtătură | Acțiune |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Copiază nodul/nodurile selectate |
| `Ctrl + X` / `Cmd + X` | Decupează nodul/nodurile selectate |
| `Ctrl + V` / `Cmd + V` | Lipește nodul/nodurile |
| `Delete` sau `Backspace` | Șterge nodul/nodurile și/sau muchia/muchiile selectate |
| `D` | Comută activarea/dezactivarea nodului/nodurilor selectate |
| `P` | Comută datele fixate pe nodul selectat |

### Căutare inline de noduri

Tastarea oricărui caracter imprimabil pe canvas (când nu este activ niciun câmp de text) deschide fereastra popup de căutare inline de noduri. Caracterul tastat devine primul caracter al interogării de căutare.

| Scurtătură | Acțiune |
|----------|--------|
| Orice caracter imprimabil | Deschide căutarea inline de noduri și începe tastarea |
| `Backspace` | Elimină ultimul caracter din interogarea de căutare |
| `Escape` | Închide căutarea inline de noduri |

## Paleta de comenzi (`Ctrl + K`)

Paleta de comenzi este disponibilă din editor, panoul de control, documentație și vizualizările de evaluare. Aceasta permite navigarea rapidă către workflow-uri, file și pagini de documentație fără a părăsi tastatura.

| Scurtătură | Acțiune |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Deschide Paleta de comenzi |
| `↑` / `↓` | Navighează în lista de rezultate |
| `Tab` / `Shift + Tab` | Navighează în lista de rezultate |
| `Enter` | Deschide elementul selectat |
| `Escape` | Închide paleta |

## Scurtături în panoul de control

Aceste scurături sunt active în fila Workflow-uri atunci când nu este activ niciun alt câmp de text.

| Scurtătură | Acțiune |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Focalizează căutarea în workflow-uri |
| `Escape` | Golește căutarea în workflow-uri când aceasta conține text |

## Scurtături în panoul de proprietăți

Aceste scurături sunt active atunci când un nod este selectat și panoul de proprietăți este deschis.

| Scurtătură | Acțiune |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Deschide sub-workflow-ul asociat într-o filă nouă (doar pentru nodul Execute) |

## Scurtături în dialogul de evaluare

Aceste scurături sunt active atunci când dialogul de evaluare este deschis.

| Scurtătură | Acțiune |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Aplică expresia și închide dialogul |
| `Ctrl + Z` / `Cmd + Z` | Anulează modificările din editorul de expresii |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Refă modificările din editorul de expresii |
| `Ctrl + Y` / `Cmd + Y` | Refă modificările din editorul de expresii (alternativ) |

## Scurtături în istoric și urme de execuție

Aceste scurături sunt disponibile în dialogul Istoric execuții și în panoul Urme de execuție.

| Scurtătură | Acțiune |
|----------|--------|
| `S` | Comută câmpul de căutare pentru filtrarea intrărilor |

## Resurse conexe

- [Funcționalități canvas](./canvas-features.md) – Fixare date, activare/dezactivare, extragere în sub-workflow
- [Structura workflow-ului](./workflow-structure.md) – Formatul nodurilor și muchiilor
- [Nodul Execute](../nodes/execute-node.md) – Apelează sub-workflow-uri (`Ctrl + Shift + O`)
- [Ghid rapid](../getting-started/quick-start.md) – Creați primul dumneavoastră workflow
