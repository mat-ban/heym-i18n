# Kontekstualna Prikazna

**Kontekstualna Prikazna** je lagani vodič unutar aplikacije koji objašnjava stranicu na kojoj se trenutno nalazite, bez potrebe da odmah ulazite u cjelokupni dokumentacijski tijek.

## Što Radi

- Prikazuje kratak sažetak za trenutnu stranicu
- Drži prvi sloj sažetim kako ne biste bili preopterećeni
- Omogućuje vam da proširite mali dodatak detalja samo kada je to potrebno
- Povezuje s punom stranicom dokumentacije za dublje čitanje

## Gdje Se Pojavljuje

U verziji 1, prikazna je dostupna na Heymovim autentificiranim glavnim površinama:

- Kartice nadzorne ploče
- [Evaluacije](../tabs/evals-tab.md)
- [Dokumentacija](../getting-started/introduction.md)
- Platno uređivača workflowa

Javne stranice kao što su prijava, registracija, chat portal i HITL pregled ne prikazuju prikaznu.

## Pristup

### Desktop

- Fiksni **Vodič za Stranicu** se pojavljuje na desnom rubu ekrana
- Prikazna se otvara kao ladica s desne strane
- Po defaultu ostaje zatvorena
- Jednokratni teaser pomaže otkriti da vodič postoji bez prisiljavanja na otvaranje

### Mobilni

- Isti sadržaj dostupan je putem lebdeće **Dugme za Stranicu**
- Otvara se u donjem listu umjesto na desnom rubu

## Model Sadržaja

Svaki unos u prikaznoj koristi strukturiranu definiciju umjesto potpuno prilagođenog komponente.

- **Naslov** – Što je ova stranica
- **Sažetak** – Jedno kratko objašnjenje
- **Točke** – Nekoliko skenabilnih naznaka
- **Istaknuto** – Male kartice za ključne vrijednosti ili obrasce korištenja
- **Više Detalja** – Smanjeni odjeljci za dodatni kontekst
- **Akcije** – Obično jedna ili dvije poveznice, najčešće na punu dokumentaciju

Ovo održava sustav fleksibilnim dok izbjegava duge, bučne pomoćne panele.

## Svijest o Kontekstu

Prikazna se mijenja s trenutnom površinom.

- Kartice nadzorne ploče svaka imaju svoj sažetak
- Uređivač upućuje na [Značajke Platna](./canvas-features.md)
- Stranica dokumentacije koristi generički pregled dokumentacije i, kada je to moguće, upućuje na trenutni članak koji već imate otvoren

## Ustrajnost

Prikazna pohranjuje mali dio osobnog UI stanja u pohranu preglednika:

- Je li panel ili list bio posljednji put otvoren
- Koji su konteksti stranica već prikazali teaser
- Posljednji prošireni odjeljak detalja po kontekstu

## Zašto Postoji

Cilj je učiniti Heym lakšim za učenje bez dodavanja dodatnog teškog UI okvira.

- Kratke, uvijek prisutne smjernice za orijentaciju
- Jasna putanja do dublje dokumentacije
- Niska prekidnost za iskusne korisnike

## Povezano

- [Kartica Workflows](../tabs/workflows-tab.md) – Glavna površina nadzorne ploče
- [Kartica Evaluacije](../tabs/evals-tab.md) – Workflow evaluacije
- [Značajke Platna](./canvas-features.md) – Ponašanje uređivača i otklanjanje pogrešaka
- [Brza Ladica](./quick-drawer.md) – Druga fiksna desna pomoćna površina
