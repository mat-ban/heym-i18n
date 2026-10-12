# Heym Work

**Heym Work** je drugo sučelje za poslovne timove, izgrađeno na temelju platforme Heym. Korisnici opisuju zadatak vlastitim riječima, odgovaraju na nekoliko pitanja i dobivaju workflow koji je Heym izgradio i testirao. Rade sa stranica pripremljenih posebno za njih, rješavaju revizije i vide svako pokretanje s imenom osobe koja ga je pokrenula. Heym svaki zadatak izvodi u pozadini.

Heym Work radi kao zaseban kontejner uz Heym, s odvojenom licencom od tima Heym. Saznajte više i zatražite probnu verziju na [heym.run/enterprise](https://heym.run/enterprise). Pogledajte [videozapis o Heym Worku](https://youtu.be/5Z2gGo6bcpU) za dvominutni pregled.

## Što poslovni timovi dobivaju

| Područje | Što radi |
|----------|----------|
| **Chat** | Opišite zadatak tekstom ili glasom. Heym traži potrebne podatke, gradi workflow, testira ga i označava kao Provjereno. |
| **Stranice** | Prikvačene stranice s widgetima: brojevi, grafikoni, tablice sa statusnim oznakama, područja za prijenos datoteka i odobrenja. Redak tablice može otvoriti vlastitu stranicu s pojedinostima. |
| **Odobrenja** | Revizije iz koraka [Human-in-the-Loop](./human-in-the-loop.md) čekaju u odjeljku Aktivnost i na stranicama, uz opcije Odobri, Zatraži izmjene i Odbij. |
| **Aktivnost** | Svako pokretanje, s osobom koja ga je pokrenula i instancom koja ga je izvršila. |
| **Uloge** | Vlasnik, Urednik i Pregledavatelj. Prijava se odvija putem [Single Sign-On](./sso.md) mehanizma koji Heym već koristi. |
| **Industrijska izdanja** | Izdanja za pravni sektor, obrazovanje, financije, logistiku, energetiku i e-trgovinu otvaraju se s gotovim stranicama, oglednim podacima i prilagođenim radnim tokovima. |

## Povezivanje Heym Worka

Pogledajte [videozapis o instalaciji](https://youtu.be/zXGfg1HPSLk) za cijeli postupak postavljanja, od prve naredbe do početne stranice.

Veza se konfigurira u **Postavke → Heym Work**. Kartica se prikazuje samo administratorima instance navedenima u `HEYM_ADMIN_EMAILS`.

| Polje | Što radi |
|-------|----------|
| **Adresa Heym Worka** | Adresa na kojoj Heym Work radi, primjerice `https://work.example.com`. Prijava preusmjerava ovamo. Pritisnite **Spremi**. |
| **Integracijski ključ** | Gumb **Generiraj ključ** stvara ključ koji Heym Work koristi za svaki zahtjev prema Heymu. Prikazuje se samo jednom, uz gumb za kopiranje. Heym sprema isključivo njegov sažetak (hash). |
| **Omogući Heym Work** | Uključuje vezu. Zahtijeva prethodni unos adrese i ključa. |
| Status | **Zadnji put viđeno**, **Verzija Worka** i **Licenca**, prema posljednjem izvješću Heym Worka. |

Zatim otvorite adresu Heym Worka i dovršite konfiguraciju:

1. **Licenca**: unesite licencni ključ dobiven od tima Heym.
2. **Heym**: unesite adresu Heyma i integracijski ključ.
3. **Vlasnik**: prijavite se računom koji je naveden kao Vlasnik Heym Worka.

Otvara se početna stranica, spremna za rad tima.

### Rotacija ključa

Opcija **Rotiraj ključ** zamjenjuje integracijski ključ. Heym Work prestaje s radom dok se novi ključ ne unese na tom mjestu, a svi prijavljeni korisnici u Heym Worku bit će odjavljeni. Upotrijebite ovo u slučaju sumnje na kompromitaciju ključa ili pri odlasku osobe koja je imala uvid u njega.

### Onemogućavanje veze

Isključite prekidač **Omogući Heym Work** kako biste prekinuli vezu. Heym Work će u tom slučaju ponovno zatražiti Heymov ključ. Heym nastavlja neometano izvoditi sve radne tokove, rasporede i webhookove u oba slučaja.

## Sigurnosni model

- **Svaka promjena prolazi kroz Heym.** Heym Work čita prikazane podatke iz baze podataka Heyma i šalje svaku radnju prema Heymu putem kanala zaštićenog ključem, gdje Heym primjenjuje vlastita pravila pristupa. Heym Work čuva vlastite podatke u zasebnoj shemi `heym_work`.
- **Ključ je sažet u mirovanju.** Heym uspoređuje sažetak ponuđenog ključa i nikada ne pohranjuje ključ u čistom obliku.
- **Prijava ostaje na strani Heyma.** Korisnici se prijavljuju putem Heyma uz podršku vašeg davatelja identiteta kada je [SSO](./sso.md) uključen.
- **Promjene se evidentiraju.** Spremanje veze i rotacija ključa bilježe retke `work_integration.update` i `work_integration.key_rotate` u [dnevnik revizije](./audit.md).

## Licenciranje

Heym Work zahtijeva vlastiti licencni ključ koji izdaje tim Heym. Svakodnevno Heym Work šalje poslužitelju heym.run svoj ID licence, ID instalacije, broj aktivnih korisnika u posljednjih 30 dana, ukupan broj članova, broj izvođenja u protekla 24 sata te verzije Heyma i Heym Worka. Sadržaj radnih tokova, ulazni podaci, izlazni podaci i vjerodajnice ostaju na vašim poslužiteljima.

Ako svakodnevna sinkronizacija ne uspije tijekom 30 dana, započinje poček od 14 dana, nakon kojeg će sučelje Heym Worka zatražiti ključ od Vlasnika. Probno razdoblje traje do posljednjeg dana i nastavlja se kada ga tim Heym produži (dopušteno je jedno probno razdoblje po instalaciji). Sam Heym nastavlja neprekidno raditi tijekom cijelog razdoblja. Mreže bez pristupa internetu koriste izvanmrežnu licencu dostupnu putem enterprise@heym.run.

## Videozapisi

Svi videozapisi o Heym Worku nalaze se na [popisu za reprodukciju Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Povezane teme

- [Enterprise](./enterprise.md): Komercijalno licenciranje i podrška
- [Single Sign-On](./sso.md): Prijava koju koristi Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Pregledi prikazani u Heym Worku
- [Dnevnik revizije](./audit.md): Zapisi nastali izmjenama veze
- [Postavke](./user-settings.md): Mjesto gdje se nalazi kartica Heym Work
