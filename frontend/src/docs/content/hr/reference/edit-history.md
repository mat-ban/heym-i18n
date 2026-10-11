# Povijest izmjena

Povijest izmjena prati spremljene verzije workflow-a. Koristite je za pregled promjena tijekom vremena, usporedbu verzija ili vraćanje na prethodno stanje.

**Napomena:** Povijest izmjena razlikuje se od [Povijesti izvršavanja](./execution-history.md). Povijest izmjena prati **spremanja** (promjene strukture workflow-a); Povijest izvršavanja prati **izvršenja** (prošla izvršavanja).

## Gdje je pronaći

**Alatna traka uređivača** → **Povijest izmjena** (ikona GitBranch)

## Verzije

Nova verzija se stvara svaki put kada **Spremite** workflow. Popis prikazuje:

- **Trenutna** – Najnovije spremljeno stanje (ono što vidite na platnu)
- **Verzija N** – Prošla spremanja s vremenskim oznakama

Verzije bez promjena u odnosu na prethodnu su skrivene.

## Pregled razlika

Odaberite verziju da biste vidjeli što se promijenilo u odnosu na trenutni workflow:

| Tip promjene | Opis |
|--------------|------|
| **Čvorovi** | Dodani, uklonjeni ili izmijenjeni čvorovi |
| **Veze** | Dodane, uklonjene ili izmijenjene veze |
| **Konfiguracija** | Postavke na razini workflow-a (autentifikacija, ograničenja brzine itd.) |

Proširite svaku promjenu da biste vidjeli razlike na razini polja (npr. koje su se svojstva čvora promijenila).

## Pregled

Da biste vidjeli kako je workflow izgledao u prošloj verziji, kliknite **Pregled** pored Vratiti.

Otvara se platno samo za čitanje koje prikazuje čvorove i veze te verzije. Možete pomicati i zumirati kako biste istražili raspored; promjene se ne mogu napraviti iz ovog pregleda.

## Vratiti

Da biste vratili prošlu verziju:

1. Odaberite verziju koju želite
2. Kliknite **Vratiti**
3. Potvrdite radnju
4. Trenutni workflow se zamjenjuje odabranom verzijom; stranica se ponovo učitava

Vraćanje stvara novo "trenutno" stanje—možete se ponovno vratiti ako je potrebno.

## Očisti povijest

Kliknite ikonu smeća u zaglavlju dijaloga da biste uklonili svu povijest verzija. Ova radnja se ne može poništiti. Trenutni workflow ostaje; samo prošle verzije se brišu.

## Kada se verzije stvaraju

Verzije se stvaraju samo kada **Spremite** (Ctrl/Cmd+S ili gumb Spremi). Ne spremljene promjene se ne pohranjuju u Povijest izmjena dok ih ne spremite.

Izmjene vještina agenta uključene su u ove snimke. Da biste pregledali ili vratili jednu vještinu bez vraćanja cijelog workflow-a, koristite gumb **Povijest** na kartici te vještine u panelu svojstava čvora agenta. Pogledajte [Čvor agenta](../nodes/agent-node.md#skill-history).

## Povezano

- [Povijest izvršavanja](./execution-history.md) – Prošla izvršenja i Donesi na platno
- [Struktura workflow-a](./workflow-structure.md) – Format čvora i veze
- [Zavičajni workflow-a](../tabs/workflows-tab.md) – Kreirajte i upravljajte workflow-ima
