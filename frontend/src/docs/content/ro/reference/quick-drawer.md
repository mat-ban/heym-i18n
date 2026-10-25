# Quick Drawer

**Quick Drawer** este un panou de execuție rapidă pe partea dreaptă pentru workflow-uri. Acesta apare pe paginile autentificate, precum tabul [Workflows](../tabs/workflows-tab.md) din dashboard, Docs și Evaluare.

## Acces

- Faceți clic pe trigger-ul fix **Quick / Workflows** de pe marginea din dreapta-mijloc a ecranului
- Când [Contextual Showcase](./contextual-showcase.md) este de asemenea disponibil, trigger-ul său **Page Guide** se află deasupra Quick Workflows
- Panoul se deschide din dreapta și deplasează pagina curentă spre stânga cu o redimensionare subtilă
- Pe mobil, Quick Drawer este ascuns
- Panoul nu este afișat în editorul de workflow, pe paginile de login/register, portal sau HITL review

## Căutare Workflow-uri

Utilizați câmpul de filtrare din partea de sus a panoului pentru a căuta workflow-uri după:

- Numele workflow-ului
- Descrierea workflow-ului

Căutarea nu ține cont de majuscule/minuscule și actualizează lista imediat.

## Workflow-uri Fixate

Fixați workflow-urile pentru a le păstra în partea de sus a panoului.

- Workflow-urile fixate apar în propria secțiune deasupra listei complete
- Fixările noi sunt adăugate în partea de sus
- Ordinea fixărilor este păstrată între reîncărcări în stocarea browserului

## Rularea Workflow-urilor

Selectați un workflow pentru a deschide formularul său de intrare.

- Câmpurile de intrare sunt afișate vertical în ordinea panoului
- Faceți clic pe **Run Workflow** pentru a executa workflow-ul selectat
- Faceți clic pe **Stop Workflow** pentru a anula o execuție în curs din panou
- Workflow-urile fără câmpuri de intrare pot fi rulate direct
- Un workflow care începe cu un [File Upload Trigger](../nodes/file-upload-trigger-node.md) afișează în schimb o zonă de plasare: trageți un fișier în ea sau faceți clic pentru a alege unul. Zona indică tipurile și dimensiunea fișierelor acceptate de trigger și refuză alte fișiere înainte de încărcare. **Run Workflow** rămâne dezactivat până când este ales un fișier.

Panoul utilizează același API de execuție a workflow-urilor ca alte suprafețe de rulare Heym, astfel încât rezultatele și comportamentul la runtime rămân consecvente.

Oprirea unei rulări din panou anulează de asemenea execuția activă din backend, inclusiv orice job Playwright în curs pentru acea rulare de workflow.

## Progres și Rezultate

După pornirea unei rulări, panoul afișează:

- Progresul pașilor în streaming pentru noduri pe măsură ce acestea încep și se termină
- Starea finală: `success`, `error` sau `pending`
- Rezultatele finale într-un panou JSON compact
- Intrări în Istoric etichetate cu `Quick Drawer`

`pending` înseamnă că workflow-ul așteaptă o acțiune ulterioară, precum o revizuire umană.

Rulările din Quick Drawer sunt rulări de producție, astfel încât un workflow cu o [limită de concurență](./webhooks.md#concurrency-limit-and-queued-runs) le poate face să aștepte. În timp ce rularea este la rând, starea indică **Waiting in queue (2/5)**; aceasta se schimbă în "running" când rularea începe și afișează rezultatul când se termină, fără progres pas cu pas. O rulare care a expirat în coadă sau a fost anulată în timpul așteptării se termină ca `error`.

O rulare cu fișier trece prin linkul de încărcare de unică folosință al triggerului: sertarul solicită un link de la workflow, încarcă fișierul la acea adresă și afișează rezultatul când încărcarea se încheie. Rulările cu fișier afișează starea finală și ieșirile, dar fără progres pas cu pas, și sunt etichetate tot cu `Quick Drawer` în istoric. Fișierul ales este golit după fiecare rulare, deoarece un link acceptă un singur fișier.

## Stocarea în Browser

Quick Drawer stochează preferințele personale în `localStorage`:

- ID-urile workflow-urilor fixate
- Ultimul workflow selectat

Panoul **nu** persistă valorile de intrare în această versiune.

## Domeniu de Aplicare

Quick Drawer este în mod intenționat o suprafață de execuție ușoară.

- Inclus: căutare, fixare, selectare, intrare (inclusiv un fișier), rulare, progres, rezultat
- Exclus: crearea de workflow-uri, editare, gestionarea folderelor și acțiuni pe canvas

## Resurse Asociate

- [Workflows Tab](../tabs/workflows-tab.md) – Lista principală de workflow-uri, foldere și gestionare
- [Quick Start](../getting-started/quick-start.md) – Construiți și rulați primul dumneavoastră workflow
- [Execution History](./execution-history.md) – Examinați rulările anterioare
- [Webhooks](./webhooks.md) – Declanșați workflow-uri prin HTTP
- [Contextual Showcase](./contextual-showcase.md) – Ghidaj la nivel de pagină care completează Quick Drawer
