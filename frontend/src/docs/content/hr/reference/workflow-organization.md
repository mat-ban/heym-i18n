# Organizacija Workflows-a

Heym vam omogućuje organizaciju workflows-a u mape, stvaranje podmapa i zakazivanje workflows-a za brisanje. Pogledajte [Workflows Tab](../tabs/workflows-tab.md) za pregled korisničkog sučelja.

## Mape i Pod-mape

Mape čine stablo. Svaka mapa ima:

- **Naziv** – Prikazni naziv
- **Roditelj** – `parent_id` povezuje s drugom mapom; `null` označava korijen
- **Workflows** – Workflows se mogu premjestiti u mape putem `folder_id`

### API

| Endpoint | Svrha |
|----------|-------|
| `GET /folders` | Samo korijenske mape |
| `GET /folders/tree` | Cijelo stablo (djeca + workflows) |
| `GET /folders/{id}` | Pojedinačna mapa s sadržajem |
| `POST /folders` | Stvaranje mape (`parent_id` opcionalno) |
| `PUT /folders/{id}` | Ažuriranje naziva ili `parent_id` |
| `DELETE /folders/{id}` | Brisanje mape (kaskadno) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Premještanje workflows-a u mapu |
| `DELETE /folders/workflows/{workflow_id}/folder` | Uklanjanje workflows-a iz mape |
| `GET /folders/{id}/export` | Preuzimanje mape + svih podmapa kao ZIP |

### Struktura Stabla

Odgovor stabla uključuje `children` i `workflows` po mapi. Dijeljeni workflows-i mogu se pojaviti u mapi putem `WorkflowShare.folder_id`.

## Dijeljenje Workflows-a

Otvorite **Share** u uređivaču workflows-a kako biste pozvali korisnike putem e-pošte ili podijelili s [timom](./teams.md). Svaka pozivnica i svako dijeljenje s timom nosi dozvolu:

| Dozvola | Što suradnik može raditi |
|---------|--------------------------|
| **Čitanje** | Otvoriti workflow, pregledati ga, vidjeti povijest izvršavanja i pokrenuti ga. Uređivač se otvara u načinu samo za čitanje: Spremi je onemogućeno i platno se ne može mijenjati. |
| **Pisanje** | Sve što omogućuje Čitanje, plus uređivanje platna, postavki, dokumenta analize i memorije agenta. |

Dozvola se prikazuje pored svake stavke u dijalogu za dijeljenje i može se promijeniti u bilo kojem trenutku iz tog padajućeg izbornika, bez uklanjanja i ponovnog dodavanja dijeljenja. Kada korisnik dođe do workflows-a kroz nekoliko putanja (izravno dijeljenje i jedan ili više timova), **najviša** dozvola pobjeđuje. Dijeljenja koja su postojala prije uvođenja dozvola su **Pisanje**, a API klijenti koji izostave `permission` također dobivaju **Pisanje**.

Radnje koje su samo za vlasnike nikada ne ovise o dozvoli: brisanje workflows-a, vraćanje ili brisanje verzija, brisanje povijesti, upravljanje dijeljenjima i [postavke samo za vlasnike](#owner-only-settings) u nastavku ostaju s vlasnikom čak i za **Pisanje** suradnike. **Čitatelj** koji pošalje izmjenu putem API-ja (`PUT /api/workflows/{id}`, bilješka analize, memorija agenta, brisanje predmemorije) ili putem AI asistenta prima `403` s porukom `Imate pristup samo za čitanje za ovaj workflow`.

Dijeljenje workflows-a omogućuje pristup platnu, povijesti izvršavanja i dokumentu analize. To ne dijeli automatski:

- **Vjerodajnice** na koje se pozivaju čvorovi u workflows-u
- **Pod-workflows** koji se pozivaju putem [Execute](../nodes/execute-node.md) čvorova ili agenata

Primatelji trebaju te vjerodajnice i pod-workflows-e dijeljene s njima odvojeno (isti korisnici ili timovi). Dijelite vjerodajnice iz [Credentials tab](../tabs/credentials-tab.md); pogledajte [Dijeljenje Vjerodajnica](./credentials-sharing.md). Dijelite svaki pod-workflow iz vlastitog dijaloga za dijeljenje uređivača.

### Postavke samo za vlasnike

Cijela konfiguracija **Run with cURL** ostaje s vlasnikom nakon dijeljenja. Suradnici i dalje otvaraju dijalog i kopiraju generiranu naredbu, ali kontrole su samo za čitanje.

Svaka promjena ovih postavki od strane ne-vlasnika odbija se s `403`:

- **Autentifikacija** (`auth_type`) i **Ključ zaglavlja** (`auth_header_key`)
- **Način tijela zahtjeva** (`webhook_body_mode`) i **Metoda zahtjeva** (`http_method`)
- **Predmemorija odgovora** (`cache_ttl_seconds`) i **Ograničenje brzine** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Vrijednost zaglavlja** (`auth_header_value`) ponaša se drugačije: potpuno je skrivena od suradnika, a pisanje suradnika se ignorira umjesto da se odbija. Uređivač prikazuje polje maskirano, tako da bi `403` tamo prekinuo običnu pohranu umjesto da signalizira napad.

Autentifikacija je razlog zašto je blok samo za vlasnike: `Anonymous` omogućuje neautentificiranim pozivateljima pokretanje workflows-a, a pokretanje bez prijavljenog pozivatelja rješava vjerodajnice i globalne varijable kao **vlasnika**, a ne pozivatelja. Ostatak bloka je objavljeni ugovor o zahtjevu i kontrola troškova vlasnika, tako da se premješta s njim.

**U slučaju pogreške, pokreni workflow** (`error_workflow_id`) u panelu **Svojstva** na razini workflows-a je samo za vlasnike iz istog razloga: [error workflow](./features.md#error-workflow) se pokreće s vjerodajnicama i globalnim varijablama neuspješnog pokretanja, koje su vlasnikove za pokretanja koja su pokrenuta i anonimna. Suradnici vide postavku samo za čitanje, a dodavanje, zamjena ili brisanje kao ne-vlasnik odbija se s `403`.

Uređivanje platna, naziva i opisa nije pogođeno.

### Izvršni tokeni

Suradnik može stvoriti izvršni token za workflow koji je s njima dijeljen. Pokretanje se pripisuje **onome tko je stvorio token**, tako da koristi vjerodajnice i globalne varijable tog korisnika, a ne vlasnika. Samo istinski anonimni poziv — `auth_type: anonymous` bez pozivatelja — pokreće se u vlasnikovom kontekstu.

## Zakazano za Brisanje

Workflows-i se mogu zakazati za brisanje umjesto da budu odmah uklonjeni.

- **Polje**: `scheduled_for_deletion` (nullable datetime)
- **Ponašanje**: Kada je postavljeno, workflow se premješta u `folder_id = null` i pojavljuje se u odjeljku "Zakazano za Brisanje".
### API

| Endpoint | Svrha |
|----------|-------|
| `PUT /workflows/{id}/schedule-deletion` | Postavi `scheduled_for_deletion`, očisti `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Očisti `scheduled_for_deletion` (vrati) |

### UI

- **Povucite u smeće** – Otpustite workflows u područje "Zakazano za brisanje" kako biste ih zakazali
- **Vrati** – Ukloni iz rasporeda
- **Odmah obriši** – Ikona smeća za trajno uklanjanje

### Logika čišćenja

Cron zadatak se pokreće dnevno u **23:59** (konfigurirana vremenska zona). Workflow se briše samo kada:

- **Svi početni čvorovi** (čvorovi bez ulaznih rubova, isključujući sticky/errorHandler) imaju `active === false`

Ako je neki početni čvor još uvijek aktivan, workflow ostaje do sljedećeg pokretanja.

## Dashboard UI

- **Redovi mapa** – Nova mapa, rekurzivno stablo mapa s proširi/smanji. Svaka mapa nosi
  opcionalni opis ispod svog imena i oznaku koja broji workflows koje sadrži, uključujući pod-mape.
- **Radnje mape** – Nova podmapa, Preimenuj, Promijeni ikonu, Preuzmi kao ZIP i Obriši nalaze se uz svaki red mape; kontekstni izbornik desnog klika nudi isti skup, a telefoni prikazuju jedan izbornik.
- **Glavno područje** – Korijenski workflows (bez mape, nisu zakazani) i Zakazano za brisanje
- **Pregled povlačenja mape** – Povlačenje workflow-a ističe točnu mapu ili podmapu i
  prikazuje puni put u pregledu veličine kartice. Smanjena mapa se širi nakon kratkog zadržavanja.
- **Stabilna povratna informacija o povlačenju** – Izvorna kartica koristi duh povlačenja, a aktivna odredišna točka ostaje
  odabrana tijekom pomicanja ili prelaska preko kontrola unutar iste mape.
- **Provjera odredišta** – Trenutna mapa prikazana je kao **Već u mapi** i ne prihvaća
  suvišno premještanje.
- **Druge zone ispuštanja** – Korijenska i "Zakazano za brisanje" ističu kada mogu prihvatiti
  povučeni workflow.
- **ZIP ispuštanje** – Otpustite ZIP datoteku na područje workflow-a kako biste uvezli strukturu mapa na razini korijena

## Povezano

- [Workflows Tab](../tabs/workflows-tab.md) – Kreirajte i upravljajte workflows
- [Credentials Sharing](./credentials-sharing.md) – Dijelite vjerodajnice s suradnicima na workflow-u
- [Teams](./teams.md) – Dijelite workflows i vjerodajnice s timovima
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, čvorovi i izvršavanje
- [Workflow Structure](./workflow-structure.md) – JSON format za workflows
- [Triggers](./triggers.md) – Početni čvorovi i ulazne točke
