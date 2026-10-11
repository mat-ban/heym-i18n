# Chat s Heym

Chat s Heym je asistent koji je svjestan stranice i dostupan iz zaglavlja dokumentacije. Otvara se u centriranom dijalogu, omogućuje vam odabir LLM vjerodajnice i modela te odgovara na pitanja koristeći trenutnu stranicu dokumentacije kao svoj prvi kontekst.

## Otvaranje Dijaloga

1. Otvorite bilo koju stranicu pod `/docs`
2. Kliknite **Chat s Heym** u zaglavlju
3. Odaberite [vjerodajnicu](../tabs/credentials-tab.md) i model
4. Postavite pitanje o stranici ili platformi

Na manjim ekranima, okidač se prikazuje samo kao ikona; na većim ekranima prikazuje se puna oznaka.

## Koji Kontekst Koristi

- Trenutna putanja dokumentacije umetnuta je u zahtjev kao kontekstualno vodstvo
- Backend i dalje koristi postojeći chat endpoint za nadzornu ploču i alate za pretraživanje dokumentacije
- Vaša pravila na razini računa [User Rules](./user-settings.md) i dalje se primjenjuju jer se koristi isti chat backend
- Koraci pripreme u stvarnom vremenu struje u balon asistenta prije konačnog odgovora, slično kao u chatu na nadzornoj ploči
- Pitanja za pojašnjenje pojavljuju se kao kartice, isto kao u [Chat tabu](../tabs/chat-tab.md). Kada zahtjev za workflow zahtijeva vjerodajnicu, možete odabrati jednu ili je stvoriti iz kartice. Kada zahtijeva tablicu podataka, možete odabrati jednu od svojih tablica ili stvoriti novu na isti način.

Kada otvorite dijalog na određenom članku, mala oznaka prikazuje aktivnu putanju dokumentacije kako biste mogli potvrditi koja se stranica prioritizira.

## Ponašanje Sesije

- Odabir vjerodajnice i modela ostaje na mjestu dok je dijalog montiran
- Povijest poruka je samo za sesiju i briše se kada se dijalog zatvori
- Klik na pozadinu, `Escape` i gumb za zatvaranje svi resetiraju sesiju
- **Stop** prekida trenutni streaming odgovor
- Dijalog je namjerno širok i fiksne veličine; ne nudi opciju za prikaz na cijelom ekranu

## Kada Ga Koristiti

- Postavite dodatna pitanja dok čitate čvor ili referentnu stranicu
- Pojašnjavanje razlika u značajkama bez napuštanja dokumentacije
- Pronađite pravi članak prije otvaranja uređivača

Ako želite izraditi ili modificirati workflows izravno, umjesto toga koristite [AI Assistant](./ai-assistant.md) na strani uređivača.

## Povezano

- [AI Assistant](./ai-assistant.md) – Chat za uređivač za izradu workflows
- [Credentials Tab](../tabs/credentials-tab.md) – Dodajte LLM vjerodajnice korištene u dijalogu
- [Settings](./user-settings.md) – Globalna pravila korisnika primijenjena na AI površine
- [Quick Start](../getting-started/quick-start.md) – Prvi vodič kroz workflow
