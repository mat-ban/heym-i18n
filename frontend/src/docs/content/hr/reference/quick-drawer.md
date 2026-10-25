# Brzi Izbornik

**Brzi Izbornik** je panel za brzi pristup workflows s desne strane. Pojavljuje se na autentificiranim stranicama kao što su nadzorna ploča [Workflows kartica](../tabs/workflows-tab.md), Dokumenti i Evaluacije.

## Pristup

- Kliknite na fiksni **Brzi / Workflows** trigger na desnom srednjem rubu ekrana
- Kada je [Kontekstualna Prikaz](./contextual-showcase.md) također dostupna, njen **Vodič za Stranicu** trigger nalazi se iznad Brzih Workflows
- Izbornik se otvara s desne strane i pomiče trenutnu stranicu lijevo uz suptilno promjenu veličine
- Na mobilnim uređajima, Brzi Izbornik je skriven
- Izbornik se ne prikazuje na stranicama uređivača workflows, prijave/registracije, portala ili HITL pregleda

## Pretraživanje Workflows

Koristite polje za filtriranje na vrhu izbornika za pretraživanje workflows po:

- Nazivu workflowa
- Opisu workflowa

Pretraživanje nije osjetljivo na velika i mala slova i odmah ažurira popis.

## Prikvačeni Workflows

Prikvačite workflows kako biste ih zadržali na vrhu izbornika.

- Prikvačeni workflows pojavljuju se u vlastitom odjeljku iznad cjelokupnog popisa
- Novi prikvačeni dodaju se na vrh
- Redoslijed prikvačenih se čuva tijekom ponovnog učitavanja u pohrani preglednika

## Izvršavanje Workflows

Odaberite workflow kako biste otvorili njegov obrazac za unos.

- Polja za unos prikazana su vertikalno u redoslijedu izbornika
- Kliknite **Pokreni Workflow** za izvršavanje odabranog workflowa
- Kliknite **Stop Workflow** za otkazivanje aktivnog izvršavanja iz izbornika
- Workflows bez polja za unos mogu se i dalje izravno pokrenuti
- Workflow koji započinje čvorom [File Upload Trigger](../nodes/file-upload-trigger-node.md) umjesto toga prikazuje zonu za ispuštanje: ispustite datoteku na nju ili kliknite za odabir. Zona navodi vrste i veličinu datoteka koje trigger prihvaća te odbija ostale datoteke prije prijenosa. **Run Workflow** ostaje onemogućen dok se datoteka ne odabere.

Izbornik koristi istu API za izvršavanje workflowa kao i druge Heym površine za pokretanje, tako da izlazi i ponašanje tijekom izvođenja ostaju dosljedni.

Zaustavljanje izvođenja iz izbornika također otkazuje aktivno backend izvršavanje, uključujući bilo koji aktivni Playwright preglednik za to izvršavanje workflowa.

## Napredak i Rezultati

Nakon pokretanja izvršavanja, izbornik prikazuje:

- Streaming napredak koraka za čvorove dok započinju i završavaju
- Konačni status: `success`, `error` ili `pending`
- Konačne izlaze u kompaktnom JSON panelu
- Unose u povijesti označene s `Brzi Izbornik`

`pending` znači da workflow čeka na kasniju akciju kao što je ljudski pregled.

Pokretanja iz Quick Drawera su produkcijska pokretanja, pa ih workflow s [ograničenjem istovremenosti](./webhooks.md#concurrency-limit-and-queued-runs) može staviti na čekanje. Dok je pokretanje u redu, status prikazuje **Waiting in queue (2/5)**; mijenja se u "running" kada pokretanje započne i prikazuje rezultat kada završi, bez napretka korak po korak. Pokretanje koje je isteklo u redu ili je otkazano tijekom čekanja završava kao `error`.

Pokretanje s datotekom odvija se putem jednokratne poveznice za prijenos triggera: ladica zatraži poveznicu od workflowa, prenese datoteku na nju i prikaže rezultat kada prijenos završi. Pokretanja s datotekom prikazuju konačni status i izlaze, ali ne i napredak korak po korak, te su u povijesti također označena s `Quick Drawer`. Odabrana datoteka briše se nakon svakog pokretanja jer jedna poveznica prima samo jednu datoteku.

## Pohrana u Pregledniku

Brzi Izbornik pohranjuje osobne postavke u `localStorage`:

- ID-ovi prikvačenih workflowa
- Posljednji odabrani workflow

Izbornik **ne** pohranjuje vrijednosti unosa u ovoj verziji.

## Opseg

Brzi Izbornik je namjerno lagana površina za izvršavanje.

- Uključeno: pretraživanje, prikvačenje, odabir, unos (uključujući datoteku), pokretanje, napredak, rezultat
- Isključeno: kreiranje workflowa, uređivanje, upravljanje mapama i akcije na platnu

## Povezano

- [Workflows Kartica](../tabs/workflows-tab.md) – Glavni popis workflowa, mape i upravljanje
- [Brzi Početak](../getting-started/quick-start.md) – Izradite i pokrenite svoj prvi workflow
- [Povijest Izvršavanja](./execution-history.md) – Pregledajte prethodna izvršavanja
- [Webhooks](./webhooks.md) – Pokrenite workflows putem HTTP-a
- [Kontekstualna Prikaz](./contextual-showcase.md) – Vodič na razini stranice koji nadopunjuje Brzi Izbornik
