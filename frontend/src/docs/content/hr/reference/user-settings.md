# Postavke

Dijalog Postavke omogućuje Vam upravljanje Vašim profilom, postavljanje trajnih AI uputa, ažuriranje lozinke za Vaš račun, konfiguriranje glasa za chat, postavljanje Vaših zadatih AI vjerodajnica i modela te pregled statusa promatranja. Otvorite ga klikom na **Vašu avatar sliku i ime** u gornjem desnom kutu zaglavlja.

## Otvaranje Dijaloškog Okvira

Kliknite **Vašu avatar sliku i ime** u gornjem desnom kutu zaglavlja. Dijalog se otvara s ovim karticama: **Profil**, **Sigurnost**, **Glas**, **AI Zadaci** i **Promatranje**. Administratori instanci također vide karticu **SSO**.

## Kartica Profil

### Profilna Slika

Heym prikazuje Vašu [Gravatar](https://gravatar.com) sliku za Vaju email adresu u zaglavlju, pored Vaših poruka u [Chatu](../tabs/chat-tab.md) i **Chat with Heym**, na komentarima na [Board](../tabs/board-tab.md) i pored Vašeg imena u dijalozima za dijeljenje i popisima članova tima. Da biste je promijenili, ažurirajte sliku na Gravataru; Heym će preuzeti novu unutar nekoliko sati. Ako nemate Gravatar sliku, Heym prikazuje prvu slova Vašeg imena.

Slika se preuzima s Heym servera i tamo se pohranjuje, tako da Vaš preglednik nikada ne kontaktira Gravatar. Ako server ne može doći do Gravatara, svi će i dalje vidjeti inicijale.

### Ime

Vaše prikazano ime koje se prikazuje u cijeloj aplikaciji. Ovo polje je obavezno i ne može ostati prazno.

### Pravila Korisnika

Pravila korisnika su prilagođene upute koje se automatski umetnu u svaki AI zahtjev—kako u graditelju workflowa tako i u chat-u na nadzornoj ploči. U **graditelju workflowa** ([AI Assistant](./ai-assistant.md)), dodaju se na sistemski prompt koji se koristi za generiranje workflow JSON-a. U **chat-u na nadzornoj ploči**, primjenjuju se kao kontekst na razini sustava. Pišete ih jednom i primjenjuju se globalno bez ponavljanja u svakom promptu.

**Uobičajene upotrebe:**

- Jezik ili ton: `Always respond in English. Keep responses concise.`
- Stil kodiranja: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Konvencije workflowa: `Include error handling in all workflows. Use descriptive node labels.`
- Format odgovora: `Use bullet points. Avoid lengthy explanations.`

**Gdje se primjenjuju:**

| Kontekst | Opis |
|----------|------|
| **Graditelj workflowa** | [AI Assistant](./ai-assistant.md) zahtjevi za generiranje ili modificiranje workflowa |
| **Chat na nadzornoj ploči** | Sve [Chat kartice](../tabs/chat-tab.md) razgovore |

Pravila korisnika se umetnu na razini sustava—izvode se prije svakog prompta automatski, bez dodatne konfiguracije po workflowu ili razgovoru.

### Spremanje Promjena Profila

Kliknite **Spremi Promjene** za primjenu. Promjene stupaju na snagu odmah za sve nove AI zahtjeve.

## Kartica Sigurnost

### Promjena Lozinke

Koristite karticu Sigurnost za ažuriranje lozinke Vašeg računa.

**Zahtjevi:**

| Pravilo | Zahtjev |
|---------|---------|
| Minimalna duljina | 8 znakova |
| Velika slova | Najmanje jedno veliko slovo (A–Z) |
| Mala slova | Najmanje jedno malo slovo (a–z) |
| Broj | Najmanje jedan broj (0–9) |

Lozinka također mora biti drugačija od Vaše trenutne lozinke. Ova pravila se primjenjuju i na frontend i na backend.

**Koraci:**

1. Unesite svoju **Trenutnu Lozinku**
2. Unesite svoju **Novu Lozinku** (mora zadovoljiti sve gore navedene zahtjeve)
3. Ponovno unesite u **Potvrdi Novu Lozinku**
4. Kliknite **Ažuriraj Lozinku**

Ako je trenutna lozinka netočna, prikazuje se poruka o pogrešci. U slučaju uspjeha, pojavljuje se poruka o potvrdi i obrazac se automatski resetira.

## Kartica Glas

Kartica Glas konfigurira izgovoreni glas za [Chat karticu](../tabs/chat-tab.md): odaberite **ElevenLabs vjerodajnicu** (ili dodajte jednu inline), odaberite **Glas** iz Vašeg ElevenLabs računa i **Spremite Postavke Glasa**. Ovo omogućuje čitanje po poruci i interaktivni glasovni način. Pogledajte [Chat Voice (TTS & STT)](./chat-voice.md) za cijeli tijek.

## Kartica AI Zadaci

Kartica AI Zadaci ima dva odjeljka.

### Preferirana vjerodajnica i model

Odaberite **preferiranu LLM vjerodajnicu** i **model** iz nje. Ovo postaje početni zadani izbor za svaku AI funkciju u aplikaciji — chat, [AI Assistant](./ai-assistant.md) (graditelj, analitičar i kreacija workflowa), mapper ploče, AI widgete na nadzornoj ploči, [docs chat](../tabs/chat-tab.md), pomoćnika za AI shemu tablice podataka, graditelja izraza i evaluacije — kad god ta površina nema vlastiti spremljeni izbor.

Pravila odabira koja svaka površina slijedi su:

1. **Spremljeni izbor** — izbor koji ste već napravili na toj površini (na primjer, posljednji model chat razgovora) uvijek pobjeđuje.
2. **Preferirani** — koristi se kada nema spremljenog izbora.
3. **Prva dostupna vjerodajnica** — rezervna opcija kada niste postavili preferenciju.

I dalje možete promijeniti vjerodajnicu i model po površini u bilo kojem trenutku; preferencija samo ispunjava početni zadani izbor. Ostavite vjerodajnicu kao **Bez preferencije** kako biste zadržali prethodno ponašanje prve vjerodajnice. Ako se Vaša preferirana vjerodajnica kasnije izbriše ili prestane biti dijeljena, kartica prikazuje obavijest i površine tiho prelaze na prvu dostupnu vjerodajnicu.
### Korištenje paketa za kodiranje

Za svaku **Codex** vjerodajnicu (uključujući dijeljene) kartica prikazuje preostalu upotrebu ograničenja brzine kao horizontalnu traku po aktivnom prozoru — na primjer, **5 sati** prozor i/ili **Tjedni** prozor, ovisno o Vašem planu. Svaka traka prikazuje postotak preostale kvote i odbrojavanje do ponovnog postavljanja. Gumb **Osvježi** ponovno dohvaća podatke na zahtjev (rezultati se kratko keširaju na poslužitelju).

Za svaku **OpenCode** vjerodajnicu kartica prikazuje OpenCode Go pretplatne prozore — **5 sati**, **Tjedni** i **Mjesečni** — u istom stilu trake, čitajući s autentificiranog krajnjeg točke upotrebe gateway-a s API ključem te vjerodajnice. Prozor koji je dostigao svoj maksimum prikazuje se kao **"dosegnut limit"** u boji ambre. Ako je ključ nevažeći ili radni prostor nema Go pretplatu, kartica objašnjava razlog umjesto da prikazuje trake.

## Kartica za promatranje

Kartica za promatranje prikazuje status samo za čitanje [OpenTelemetry Tracing](./opentelemetry.md) za ovu instancu: je li praćenje omogućeno, OTLP krajnja točka, naziv usluge, omjer uzorkovanja i koji su rasponi emitirani. Praćenje se konfigurira putem `HEYM_OTEL_*` varijabli okruženja na backendu, tako da ova kartica ne uređuje ništa. Kada je praćenje onemogućeno, kartica navodi varijable okruženja potrebne za njegovo uključivanje. Tajne kao što su OTLP auth zaglavlja nikada se ne prikazuju ovdje. Pogledajte [Varijable okruženja](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) za punu referencu konfiguracije.

## SSO Kartica

Vidljivo samo administratorima instance — računi navedeni u `HEYM_ADMIN_EMAILS`. Ova kartica povezuje Heym s vanjskim OpenID Connect pružateljem kako bi se korisnici prijavili s računima koje već imaju. Unesite URL izdavatelja i vjerodajnice klijenta, kopirajte URI za preusmjeravanje samo za čitanje u Vaš pružatelj, i pokrenite **Testiraj vezu** prije nego što ga omogućite. Prijava putem lozinke može se isključiti odavde nakon što test prođe. Pogledajte [Jedinstvena prijava](./sso.md) za punu postavku.

## Kartica Instanci

Vidljivo samo administratorima instance — računi navedeni u `HEYM_ADMIN_EMAILS`. Ova kartica navodi Heym instance povezane s ovom bazom podataka i postavlja kako se pozadinski radovi dijele između njih. Svaki redak prikazuje uređivo ime instance, njezinu ulogu, je li aktivna, izmjerenu latenciju prema bazi podataka, prekidač za uključivanje/isključivanje i njezinu težinu. Težine su dijelovi instanci koje trenutno mogu preuzeti rad, a ne postotci od 100: s `41 / 26 / 33` i treća instanca isključena, prve dvije zapravo primaju 61% i 39%. Panel ispisuje tu učinkovitu podjelu ispod tablice, a samo odbija spremiti kada nijedna omogućena instanca nema težinu.

**Automatski dodijelite novu instancu udjel** je prema zadanim postavkama uključeno: instanca koja se pridružuje inače bi imala težinu 0 i ne bi primila ništa, pa joj vođa daje jednak udjel jednom i smanjuje postojeće težine zadržavajući njihove omjere. Nikada ne dodiruje instancu čiju težinu ste sami postavili.

Panel također izvještava koliko je od posljednjih 24 sata radova moglo izvršiti samo na glavnoj instanci. Kada je taj udjel visok, težine ispod njega ne mogu premjestiti taj rad. Pogledajte [Distribucija opterećenja](./cluster.md) za ono što ostaje na glavnoj instanci i kako odabrati brojeve.

## Što nije u ovom dijalogu

| Značajka | Gdje je pronaći |
|-----------|-----------------|
| **Upravljanje API ključem (MCP)** | [MCP Kartica](../tabs/mcp-tab.md) – pregled, kopiranje i regeneracija Vašeg MCP server API ključa |
| **Tema (tamna / svijetla)** | Gumb za prebacivanje Sunce/Mjesec u zaglavlju (pored oznake korisnika) |
| **Promjena e-pošte** | Trenutno nije podržano |

## Povezano

- [AI Asistent](./ai-assistant.md) – Chat za graditelja workflow-a koji koristi korisnička pravila
- [Chat Kartica](../tabs/chat-tab.md) – Chat na nadzornoj ploči koji koristi korisnička pravila
- [Chat Glas (TTS & STT)](./chat-voice.md) – ElevenLabs glas konfiguriran u kartici Glas
- [MCP Kartica](../tabs/mcp-tab.md) – MCP server API ključ i izloženost alatu za workflow
- [Kartica Vjerodajnica](../tabs/credentials-tab.md) – API ključevi za AI čvorove i integracije
- [Sigurnost](./security.md) – Upravljanje sesijama, ograničavanje brzine, enkripcija vjerodajnica
- [Jedinstvena prijava](./sso.md) – Povezivanje s vanjskim OpenID Connect pružateljem
- [OpenTelemetry Tracing](./opentelemetry.md) – Distribuirano praćenje za izvršavanja workflow-a i čvorova
