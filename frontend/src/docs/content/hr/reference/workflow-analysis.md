# Analiza Workflows-a

**Analiza Workflows-a** je panel s lijeve strane koji sadrži jedan zajednički, uređiv dokument u Markdown formatu po workflow-u. Koristite ga za objašnjenje funkcionalnosti workflow-a i za bilježenje ideja za poboljšanje — te dopustite AI-u da generira prvi nacrt za Vas.

Dokument je zajednički: svatko tko može pristupiti workflow-u može ga čitati i uređivati. Pohranjuje se s workflow-om i automatski se briše kada se workflow obriše.

## Otvaranje Panela

1. Otvorite workflow u uređivaču.
2. Kliknite **Analiziraj** (ikona s iskricama) u alatnoj traci uređivača.
3. Panel se otvara s lijeve strane. Paleta čvorova (lijevi panel) se smanjuje dok je otvorena; ponovnim otvaranjem palete čvorova zatvara se panel analize.

Panel je dostupan samo za spremljene workflow-e. Na potpuno novom nespremljenom workflow-u, prvo ga spremite.

## Dokument

Panel prikazuje jedan Markdown dokument s dva prikaza, koja se prebacuju pomoću gumba **Uredi** (olovka) i **Pregled** (oko):

| Prikaz | Svrha |
|--------|-------|
| **Uredi** | Obični Markdown uređivač (textarea). |
| **Pregled** | Renderirani Markdown. |

Zaglavlje prikazuje **tko je posljednji uređivao** dokument i kada.

### Spremanje

Kliknite **Spremi** kako biste sačuvali svoje promjene. Spremanje je omogućeno samo kada postoje nespremljene izmjene.

Budući da je dokument zajednički, spremanja koriste optimističku konkurentnost:

- Ako je netko drugi spremio noviju verziju otkako ste otvorili panel, Vaše spremanje će biti odbijeno i pojavit će se upozorenje s imenom drugog urednika.
- Tada možete odabrati **Ponovno učitaj (odbaci moje)** kako biste preuzeli verziju s poslužitelja, ili **Prepiši** kako biste prisilno spremili svoju verziju umjesto njihove.

## AI Analiza

Odaberite LLM **Vjerodajnicu** i **Model** na vrhu panela (popis modela učitava se iz odabrane vjerodajnice — pogledajte [Vjerodajnice](../tabs/credentials-tab.md)). Zatim pokrenite analizu:

- **Analiziraj moj workflow** — prikazuje se kada je dokument prazan. Izravno prenosi AI-generirani Markdown izvještaj u uređivač kao nespremljeni nacrt. Pregledajte i uredite ga, a zatim **Spremite**.
- **Ponovno analiziraj** — prikazuje se kada dokument već ima sadržaj. Izravno prenosi novi izvještaj u poseban **pregled**, ostavljajući Vaš trenutni dokument netaknutim. Odaberite **Prihvati** kako biste zamijenili sadržaj uređivača novom analizom, ili **Odbaci** kako biste zadržali ono što ste imali.

Obje radnje prvo **pokreću workflow** (kada je valjan i izvršiv) i uključuju rezultate izvršenja u analizu, tako da izvještaj odražava kako workflow zapravo funkcionira. Ako workflow ne može biti pokrenut, analiza se nastavlja iz njegove statične strukture.

Generirani izvještaj pokriva tri odjeljka, redom: **Područja poboljšanja** (konkretne preporuke, uključujući **sigurnosni** aspekt kad god workflow dodiruje vjerodajnice, korisničke unose, vanjske zahtjeve ili izloženost podacima), **Svrha** workflow-a i **Što radi** (korak-po-korak pregled čvorova).

Odjeljak **Područja poboljšanja** uvijek provodi četiri eksplicitne provjere:

1. **Pokriće grešaka** — ako platno nema [Error Handler](../nodes/error-handler-node.md) čvor i nije konfiguriran workflow za greške, izvještaj to ističe i preporučuje dodavanje obrade grešaka.
2. **Ušteda vremena** — ako nije postavljena procijenjena ušteda vremena po izvršenju, izvještaj preporučuje konfiguriranje iste kako bi se metrika [Analytics](../tabs/analytics-tab.md) **Ušteda vremena** mogla popuniti.
3. **Mrežni čvorovi** — za čvorove koji izvršavaju mrežne pozive (kao što su [HTTP](../nodes/http-node.md) i integracijski čvorovi), izvještaj preporučuje specifičnu obradu grešaka za te čvorove (ponovno pokušaj i/ili nastavak u slučaju greške).
4. **Upozorenja** — kada nisu konfigurirana [upozorenja](../tabs/alerts-tab.md) za workflow, izvještaj preporučuje postavljanje upozorenja prije nego što se pređe u produkciju.

### Pokretanje Analizatora iz Svojstava

Kada workflow ima čvorove na platnu, ali još nema dokument analize, gumb **Pokreni analizator** pojavljuje se u panelu [Svojstva](./canvas-features.md) na razini workflow-a (prikazuje se kada nijedan čvor nije odabran). Otvara ovaj panel Analize Workflows-a kako biste mogli odabrati vjerodajnicu i model te generirati izvještaj.

Svako pokretanje analize bilježi se u [Izvršenjima](../tabs/traces-tab.md) pod izvorom **Analiza Workflows-a**.

Ako nije konfigurirana LLM vjerodajnica, gumb Analiziraj je onemogućen — dodajte jednu u [Završetak Vjerodajnica](../tabs/credentials-tab.md).

## Povezano

- [AI Asistent](./ai-assistant.md) — generirajte ili modificirajte čvorove workflow-a iz prirodnog jezika.
- [Ljepljiva Bilješka](../nodes/sticky-note-node.md) — za kratke bilješke pričvršćene izravno na platnu.
