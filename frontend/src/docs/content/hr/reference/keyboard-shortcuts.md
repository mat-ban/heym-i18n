# Prečaci na Tipkovnici

Heym pruža prečace na tipkovnici unutar uređivača workflowa i platna kako bi ubrzao uobičajene radnje.

## Globalni Prečaci Uređivača

Ovi prečaci su aktivni bilo gdje unutar uređivača workflowa.

| Prečac | Radnja |
|--------|--------|
| `Ctrl + K` / `Cmd + K` | Otvorite Command Palette |
| `Ctrl + I` / `Cmd + I` | Prebacite [AI Assistant](./ai-assistant.md) panel (radi dok tipkate) |
| `Ctrl + Enter` / `Cmd + Enter` | Pokrenite trenutni workflow |
| `Ctrl + S` / `Cmd + S` | Spremite workflow |
| `Ctrl + Z` / `Cmd + Z` | Poništi |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Ponovno izvrši |
| `Ctrl + Y` / `Cmd + Y` | Ponovno izvrši (alternativa) |
| `Escape` | Zatvorite otvorene preklapajuće prozore, dijaloge i panele |

## Prečaci na Platnu

Ovi prečaci se primjenjuju kada je platno fokusirano (nema aktivnog unosa teksta).

### Odabir i Navigacija

| Prečac | Radnja |
|--------|--------|
| `Ctrl + A` / `Cmd + A` | Odaberite sve čvorove |
| `Shift` (držite) | Povucite za odabir više čvorova |
| `Ctrl` / `Cmd` (držite) | Kliknite za dodavanje pojedinačnih čvorova u odabir |
| `Escape` | Poništite odabir svih čvorova; zatvorite pretraživanje čvora |

### Uređivanje Čvorova

| Prečac | Radnja |
|--------|--------|
| `Ctrl + C` / `Cmd + C` | Kopirajte odabrane čvorove |
| `Ctrl + X` / `Cmd + X` | Izrežite odabrane čvorove |
| `Ctrl + V` / `Cmd + V` | Zalijepite čvorove |
| `Delete` ili `Backspace` | Izbrišite odabrene čvorove i/ili rubove |
| `D` | Prebacite odabrane čvorove između omogućeno / onemogućeno |
| `P` | Prebacite pričvršćene podatke na odabranom čvoru |

### Pretraživanje Inline Čvora

Upisivanje bilo kojeg ispisivog znaka na platnu (kada nema aktivnog unosa teksta) otvara skočni prozor za pretraživanje inline čvora. Upisani znak postaje prvi znak upita za pretraživanje.

| Prečac | Radnja |
|--------|--------|
| Bilo koji ispisivi znak | Otvorite pretraživanje inline čvora i počnite tipkati |
| `Backspace` | Uklonite posljednji znak iz upita za pretraživanje |
| `Escape` | Zatvorite pretraživanje inline čvora |

## Command Palette (`Ctrl + K`)

Command Palette je dostupna iz uređivača, nadzorne ploče, dokumenata i evaluacija. Omogućuje vam brzo navigiranje do workflowa, kartica i stranica dokumentacije bez napuštanja tipkovnice.

| Prečac | Radnja |
|--------|--------|
| `Ctrl + K` / `Cmd + K` | Otvorite Command Palette |
| `↑` / `↓` | Navigirajte kroz popis rezultata |
| `Tab` / `Shift + Tab` | Navigirajte kroz popis rezultata |
| `Enter` | Otvorite odabranu stavku |
| `Escape` | Zatvorite paletu |

## Prečaci na Nadzornoj Ploči

Ovi prečaci su aktivni na kartici Workflows kada nema aktivnog unosa teksta.

| Prečac | Radnja |
|--------|--------|
| `Ctrl + F` / `Cmd + F` | Fokusirajte pretraživanje workflowa |
| `Escape` | Očistite pretraživanje workflowa kada ima tekst |

## Prečaci Panoa Svojstava

Ovi prečaci su aktivni dok je čvor odabran i panel svojstava je otvoren.

| Prečac | Radnja |
|--------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Otvorite povezani pod-workflow u novoj kartici (samo za Execute čvor) |

## Prečaci Dijaloga za Evaluaciju

Ovi prečaci su aktivni dok je dijalog za Evaluaciju otvoren.

| Prečac | Radnja |
|--------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Primijenite izraz i zatvorite dijalog |
| `Ctrl + Z` / `Cmd + Z` | Poništite promjene u uređivaču izraza |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Ponovno izvršite promjene u uređivaču izraza |
| `Ctrl + Y` / `Cmd + Y` | Ponovno izvršite promjene u uređivaču izraza (alternativa) |

## Prečaci za Povijest i Tragove

Ovi prečaci su dostupni u dijalogu Povijest Izvršenja i panelu Tragovi.

| Prečac | Radnja |
|--------|--------|
| `S` | Prebacite unos pretraživanja za filtriranje unosa |

## Povezano

- [Značajke Platna](./canvas-features.md) – Pin podaci, omogućavanje/onemogućavanje, ekstrakcija u pod-workflow
- [Struktura Workflowa](./workflow-structure.md) – Format čvora i rubova
- [Execute Čvor](../nodes/execute-node.md) – Poziva pod-workflowe (`Ctrl + Shift + O`)
- [Brzi Početak](../getting-started/quick-start.md) – Izradite svoj prvi workflow

- **Esc**: Stop following another collaborator in [Canvas Collaboration](./canvas-collaboration.md).
